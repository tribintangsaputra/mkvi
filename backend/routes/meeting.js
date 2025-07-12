const express = require('express');
const { body, validationResult } = require('express-validator');
const axios = require('axios');
const db = require('../config/database');
const { authenticateToken, adminOnly, adminOrOwner } = require('../middlewares/auth');
const { uploadSingle } = require('../middlewares/upload');

const router = express.Router();

// Get all meetings (admin) or user's meetings (user)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || '';
    const search = req.query.search || '';
    const offset = (page - 1) * limit;

    let query = `
      SELECT m.*, 
             p.kode_pemesanan, p.nama_acara, p.tanggal_pelaksanaan,
             u.nama_lengkap as pengguna_nama, u.email as pengguna_email,
             l.nama_layanan, l.kategori,
             a.nama_lengkap as admin_nama
      FROM meeting m
      LEFT JOIN pemesanan p ON m.pemesanan_id = p.id
      LEFT JOIN pengguna u ON m.pengguna_id = u.id
      LEFT JOIN layanan l ON p.layanan_id = l.id
      LEFT JOIN admin a ON m.admin_id = a.id
    `;
    let countQuery = 'SELECT COUNT(*) as total FROM meeting m';
    const params = [];

    // Filter by user if not admin
    if (req.user.role !== 'admin') {
      query += ' WHERE m.pengguna_id = ?';
      countQuery += ' WHERE pengguna_id = ?';
      params.push(req.user.id);
    }

    // Add filters
    if (status) {
      const whereClause = params.length > 0 ? ' AND' : ' WHERE';
      query += `${whereClause} m.status = ?`;
      countQuery += `${whereClause} status = ?`;
      params.push(status);
    }

    if (search) {
      const whereClause = params.length > 0 ? ' AND' : ' WHERE';
      query += `${whereClause} (p.kode_pemesanan LIKE ? OR p.nama_acara LIKE ? OR m.nama_client LIKE ?)`;
      countQuery += `${whereClause} (p.kode_pemesanan LIKE ? OR p.nama_acara LIKE ? OR nama_client LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY m.dibuat_pada DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await db.execute(query, params);
    
    // Get count with same filters
    const countParams = params.slice(0, -2); // Remove limit and offset
    const [countRows] = await db.execute(countQuery, countParams);

    const total = countRows[0].total;
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        meetings: rows,
        pagination: {
          current_page: page,
          total_pages: totalPages,
          total_items: total,
          items_per_page: limit
        }
      }
    });
  } catch (error) {
    console.error('Get meetings error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get single meeting
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    let query = `
      SELECT m.*, 
             p.kode_pemesanan, p.nama_acara, p.tanggal_pelaksanaan, p.total_tagihan,
             u.nama_lengkap as pengguna_nama, u.email as pengguna_email, u.no_wa as pengguna_no_wa,
             l.nama_layanan, l.kategori, l.deskripsi as layanan_deskripsi,
             a.nama_lengkap as admin_nama, a.email as admin_email
      FROM meeting m
      LEFT JOIN pemesanan p ON m.pemesanan_id = p.id
      LEFT JOIN pengguna u ON m.pengguna_id = u.id
      LEFT JOIN layanan l ON p.layanan_id = l.id
      LEFT JOIN admin a ON m.admin_id = a.id
      WHERE m.id = ?
    `;
    const params = [id];

    // Filter by user if not admin
    if (req.user.role !== 'admin') {
      query += ' AND m.pengguna_id = ?';
      params.push(req.user.id);
    }

    const [rows] = await db.execute(query, params);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Get meeting error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create meeting (admin only)
router.post('/', authenticateToken, adminOnly, [
  body('pemesanan_id').isInt({ min: 1 }).withMessage('Pemesanan ID harus berupa angka'),
  body('pengguna_id').isInt({ min: 1 }).withMessage('Pengguna ID harus berupa angka'),
  body('calendly_link').optional().isURL().withMessage('Calendly link harus berupa URL valid')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      pemesanan_id,
      pengguna_id,
      platform,
      calendly_link,
      catatan
    } = req.body;

    // Check if pemesanan exists and is validated
    const [pemesanan] = await db.execute(
      'SELECT id, status FROM pemesanan WHERE id = ? AND status = "tervalidasi"',
      [pemesanan_id]
    );

    if (pemesanan.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pemesanan not found or not validated'
      });
    }

    // Check if pengguna exists
    const [pengguna] = await db.execute(
      'SELECT id FROM pengguna WHERE id = ?',
      [pengguna_id]
    );

    if (pengguna.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pengguna not found'
      });
    }

    // Check if meeting already exists for this pemesanan
    const [existingMeeting] = await db.execute(
      'SELECT id FROM meeting WHERE pemesanan_id = ?',
      [pemesanan_id]
    );

    if (existingMeeting.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Meeting already exists for this pemesanan'
      });
    }

    // Create meeting
    const [result] = await db.execute(`
      INSERT INTO meeting (
        pemesanan_id, admin_id, pengguna_id, platform, 
        calendly_link, catatan
      ) VALUES (?, ?, ?, ?, ?, ?)
    `, [
      pemesanan_id,
      req.user.id,
      pengguna_id,
      platform || 'google_meet',
      calendly_link || null,
      catatan || null
    ]);

    // Get created meeting
    const [created] = await db.execute(`
      SELECT m.*, 
             p.kode_pemesanan, p.nama_acara,
             u.nama_lengkap as pengguna_nama, u.email as pengguna_email,
             l.nama_layanan, l.kategori
      FROM meeting m
      LEFT JOIN pemesanan p ON m.pemesanan_id = p.id
      LEFT JOIN pengguna u ON m.pengguna_id = u.id
      LEFT JOIN layanan l ON p.layanan_id = l.id
      WHERE m.id = ?
    `, [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'Meeting created successfully',
      data: created[0]
    });
  } catch (error) {
    console.error('Create meeting error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update meeting (admin only)
router.put('/:id', authenticateToken, adminOnly, uploadSingle('mou_file'), [
  body('nama_client').optional().trim().isLength({ min: 2 }).withMessage('Nama client minimal 2 karakter'),
  body('email_client').optional().isEmail().withMessage('Email client tidak valid'),
  body('no_wa_client').optional().matches(/^\+62\d{9,13}$/).withMessage('Format nomor WA: +62xxxxxxxxxx'),
  body('waktu_mulai').optional().isISO8601().withMessage('Waktu mulai harus valid'),
  body('waktu_selesai').optional().isISO8601().withMessage('Waktu selesai harus valid')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const {
      platform,
      calendly_link,
      booking_response_link,
      nama_client,
      email_client,
      no_wa_client,
      pekerjaan_client,
      waktu_mulai,
      waktu_selesai,
      status,
      catatan,
      email_terkirim
    } = req.body;

    // Check if meeting exists
    const [existing] = await db.execute(
      'SELECT id FROM meeting WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    // Build update query
    const updateFields = [];
    const updateValues = [];

    if (platform) {
      updateFields.push('platform = ?');
      updateValues.push(platform);
    }

    if (calendly_link !== undefined) {
      updateFields.push('calendly_link = ?');
      updateValues.push(calendly_link);
    }

    if (booking_response_link !== undefined) {
      updateFields.push('booking_response_link = ?');
      updateValues.push(booking_response_link);
    }

    if (nama_client) {
      updateFields.push('nama_client = ?');
      updateValues.push(nama_client);
    }

    if (email_client) {
      updateFields.push('email_client = ?');
      updateValues.push(email_client);
    }

    if (no_wa_client) {
      updateFields.push('no_wa_client = ?');
      updateValues.push(no_wa_client);
    }

    if (pekerjaan_client) {
      updateFields.push('pekerjaan_client = ?');
      updateValues.push(pekerjaan_client);
    }

    if (waktu_mulai) {
      updateFields.push('waktu_mulai = ?');
      updateValues.push(waktu_mulai);
    }

    if (waktu_selesai) {
      updateFields.push('waktu_selesai = ?');
      updateValues.push(waktu_selesai);
    }

    if (req.file) {
      updateFields.push('path_mou_pdf = ?');
      updateValues.push(req.file.filename);
    }

    if (status) {
      updateFields.push('status = ?');
      updateValues.push(status);
    }

    if (catatan !== undefined) {
      updateFields.push('catatan = ?');
      updateValues.push(catatan);
    }

    if (email_terkirim !== undefined) {
      updateFields.push('email_terkirim = ?');
      updateValues.push(email_terkirim);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    updateValues.push(id);

    const query = `UPDATE meeting SET ${updateFields.join(', ')} WHERE id = ?`;
    await db.execute(query, updateValues);

    // Get updated meeting
    const [updated] = await db.execute(`
      SELECT m.*, 
             p.kode_pemesanan, p.nama_acara,
             u.nama_lengkap as pengguna_nama, u.email as pengguna_email,
             l.nama_layanan, l.kategori
      FROM meeting m
      LEFT JOIN pemesanan p ON m.pemesanan_id = p.id
      LEFT JOIN pengguna u ON m.pengguna_id = u.id
      LEFT JOIN layanan l ON p.layanan_id = l.id
      WHERE m.id = ?
    `, [id]);

    res.json({
      success: true,
      message: 'Meeting updated successfully',
      data: updated[0]
    });
  } catch (error) {
    console.error('Update meeting error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update meeting status (admin only)
router.put('/:id/status', authenticateToken, adminOnly, [
  body('status').isIn(['dijadwalkan', 'selesai', 'dibatalkan']).withMessage('Status tidak valid')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { status } = req.body;

    // Check if meeting exists
    const [existing] = await db.execute(
      'SELECT id FROM meeting WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    // Update status
    await db.execute(
      'UPDATE meeting SET status = ? WHERE id = ?',
      [status, id]
    );

    // Get updated meeting
    const [updated] = await db.execute(`
      SELECT m.*, 
             p.kode_pemesanan, p.nama_acara,
             u.nama_lengkap as pengguna_nama, u.email as pengguna_email,
             l.nama_layanan, l.kategori
      FROM meeting m
      LEFT JOIN pemesanan p ON m.pemesanan_id = p.id
      LEFT JOIN pengguna u ON m.pengguna_id = u.id
      LEFT JOIN layanan l ON p.layanan_id = l.id
      WHERE m.id = ?
    `, [id]);

    res.json({
      success: true,
      message: 'Meeting status updated successfully',
      data: updated[0]
    });
  } catch (error) {
    console.error('Update meeting status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete meeting (admin only)
router.delete('/:id', authenticateToken, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if meeting exists
    const [existing] = await db.execute(
      'SELECT id FROM meeting WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    // Delete meeting
    await db.execute('DELETE FROM meeting WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Meeting deleted successfully'
    });
  } catch (error) {
    console.error('Delete meeting error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Calendly webhook endpoint (public)
router.post('/calendly-webhook', async (req, res) => {
  try {
    const { event, payload } = req.body;

    if (event === 'invitee.created') {
      const {
        name,
        email,
        questions_and_answers,
        event: eventData
      } = payload;

      // Extract custom fields from questions_and_answers
      let no_wa_client = '';
      let pekerjaan_client = '';
      
      if (questions_and_answers) {
        questions_and_answers.forEach(qa => {
          if (qa.question.toLowerCase().includes('whatsapp') || qa.question.toLowerCase().includes('wa')) {
            no_wa_client = qa.answer;
          }
          if (qa.question.toLowerCase().includes('pekerjaan') || qa.question.toLowerCase().includes('job')) {
            pekerjaan_client = qa.answer;
          }
        });
      }

      // Find meeting by calendly link or other identifier
      // This would need to be implemented based on how you link Calendly events to your meetings
      const calendlyEventUri = eventData.uri;
      
      // Update meeting with client data
      await db.execute(`
        UPDATE meeting 
        SET nama_client = ?, email_client = ?, no_wa_client = ?, pekerjaan_client = ?,
            waktu_mulai = ?, waktu_selesai = ?, booking_response_link = ?
        WHERE calendly_link LIKE ?
      `, [
        name,
        email,
        no_wa_client,
        pekerjaan_client,
        eventData.start_time,
        eventData.end_time,
        calendlyEventUri,
        `%${calendlyEventUri}%`
      ]);
    }

    res.json({
      success: true,
      message: 'Webhook processed successfully'
    });
  } catch (error) {
    console.error('Calendly webhook error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
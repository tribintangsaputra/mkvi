const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticateToken, adminOnly, adminOrOwner } = require('../middlewares/auth');
const { generateOrderCode, generateTrackingCode } = require('../utils/codeGenerator');

const router = express.Router();

// Get all pemesanan (admin) or user's pemesanan (user)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || '';
    const search = req.query.search || '';
    const offset = (page - 1) * limit;

    let query = `
      SELECT p.*, 
             u.nama_lengkap as pengguna_nama, u.email as pengguna_email,
             l.nama_layanan, l.kategori, l.harga_minimal
      FROM pemesanan p
      LEFT JOIN pengguna u ON p.pengguna_id = u.id
      LEFT JOIN layanan l ON p.layanan_id = l.id
    `;
    let countQuery = 'SELECT COUNT(*) as total FROM pemesanan p';
    const params = [];

    // Filter by user if not admin
    if (req.user.role !== 'admin') {
      query += ' WHERE p.pengguna_id = ?';
      countQuery += ' WHERE pengguna_id = ?';
      params.push(req.user.id);
    }

    // Add filters
    if (status) {
      const whereClause = params.length > 0 ? ' AND' : ' WHERE';
      query += `${whereClause} p.status = ?`;
      countQuery += `${whereClause} status = ?`;
      params.push(status);
    }

    if (search) {
      const whereClause = params.length > 0 ? ' AND' : ' WHERE';
      query += `${whereClause} (p.kode_pemesanan LIKE ? OR p.kode_tracking LIKE ? OR p.nama_acara LIKE ?)`;
      countQuery += `${whereClause} (kode_pemesanan LIKE ? OR kode_tracking LIKE ? OR nama_acara LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY p.dibuat_pada DESC LIMIT ? OFFSET ?';
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
        pemesanan: rows,
        pagination: {
          current_page: page,
          total_pages: totalPages,
          total_items: total,
          items_per_page: limit
        }
      }
    });
  } catch (error) {
    console.error('Get pemesanan error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get single pemesanan
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    let query = `
      SELECT p.*, 
             u.nama_lengkap as pengguna_nama, u.email as pengguna_email, u.no_wa as pengguna_no_wa,
             l.nama_layanan, l.kategori, l.harga_minimal, l.deskripsi as layanan_deskripsi
      FROM pemesanan p
      LEFT JOIN pengguna u ON p.pengguna_id = u.id
      LEFT JOIN layanan l ON p.layanan_id = l.id
      WHERE p.id = ?
    `;
    const params = [id];

    // Filter by user if not admin
    if (req.user.role !== 'admin') {
      query += ' AND p.pengguna_id = ?';
      params.push(req.user.id);
    }

    const [rows] = await db.execute(query, params);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pemesanan not found'
      });
    }

    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Get pemesanan error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create pemesanan (user only)
router.post('/', authenticateToken, [
  body('layanan_id').isInt({ min: 1 }).withMessage('Layanan ID harus berupa angka'),
  body('nama_acara').trim().isLength({ min: 2 }).withMessage('Nama acara minimal 2 karakter'),
  body('tanggal_pelaksanaan').isISO8601().withMessage('Tanggal pelaksanaan harus valid'),
  body('jam_mulai').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Format jam harus HH:MM'),
  body('lokasi_acara').trim().isLength({ min: 5 }).withMessage('Lokasi acara minimal 5 karakter'),
  body('deskripsi_kebutuhan').trim().isLength({ min: 10 }).withMessage('Deskripsi kebutuhan minimal 10 karakter')
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
      layanan_id,
      nama_acara,
      tanggal_pelaksanaan,
      tanggal_selesai_pelaksanaan,
      jam_mulai,
      lokasi_acara,
      deskripsi_kebutuhan,
      catatan_pengguna
    } = req.body;

    // Check if layanan exists and is active
    const [layanan] = await db.execute(
      'SELECT id, harga_minimal, aktif FROM layanan WHERE id = ? AND aktif = true',
      [layanan_id]
    );

    if (layanan.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Layanan not found or inactive'
      });
    }

    // Generate codes
    const kode_pemesanan = generateOrderCode();
    const kode_tracking = generateTrackingCode();

    // Create pemesanan
    const [result] = await db.execute(`
      INSERT INTO pemesanan (
        pengguna_id, layanan_id, kode_pemesanan, kode_tracking, 
        nama_acara, tanggal_pelaksanaan, tanggal_selesai_pelaksanaan, 
        jam_mulai, lokasi_acara, deskripsi_kebutuhan, catatan_pengguna, 
        total_tagihan
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      req.user.id,
      layanan_id,
      kode_pemesanan,
      kode_tracking,
      nama_acara,
      tanggal_pelaksanaan,
      tanggal_selesai_pelaksanaan || null,
      jam_mulai,
      lokasi_acara,
      deskripsi_kebutuhan,
      catatan_pengguna || null,
      layanan[0].harga_minimal
    ]);

    // Get created pemesanan
    const [created] = await db.execute(`
      SELECT p.*, 
             u.nama_lengkap as pengguna_nama, u.email as pengguna_email,
             l.nama_layanan, l.kategori, l.harga_minimal
      FROM pemesanan p
      LEFT JOIN pengguna u ON p.pengguna_id = u.id
      LEFT JOIN layanan l ON p.layanan_id = l.id
      WHERE p.id = ?
    `, [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'Pemesanan created successfully',
      data: created[0]
    });
  } catch (error) {
    console.error('Create pemesanan error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update pemesanan status (admin only)
router.put('/:id/status', authenticateToken, adminOnly, [
  body('status').isIn(['menunggu_validasi_admin', 'tervalidasi', 'dibatalkan']).withMessage('Status tidak valid')
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

    // Check if pemesanan exists
    const [existing] = await db.execute(
      'SELECT id FROM pemesanan WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pemesanan not found'
      });
    }

    // Update status
    await db.execute(
      'UPDATE pemesanan SET status = ? WHERE id = ?',
      [status, id]
    );

    // Get updated pemesanan
    const [updated] = await db.execute(`
      SELECT p.*, 
             u.nama_lengkap as pengguna_nama, u.email as pengguna_email,
             l.nama_layanan, l.kategori, l.harga_minimal
      FROM pemesanan p
      LEFT JOIN pengguna u ON p.pengguna_id = u.id
      LEFT JOIN layanan l ON p.layanan_id = l.id
      WHERE p.id = ?
    `, [id]);

    res.json({
      success: true,
      message: 'Pemesanan status updated successfully',
      data: updated[0]
    });
  } catch (error) {
    console.error('Update pemesanan status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update pemesanan (admin only)
router.put('/:id', authenticateToken, adminOnly, [
  body('total_tagihan').optional().isNumeric().withMessage('Total tagihan harus berupa angka'),
  body('tanggal_pelaksanaan').optional().isISO8601().withMessage('Tanggal pelaksanaan harus valid'),
  body('jam_mulai').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Format jam harus HH:MM')
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
      total_tagihan,
      nama_acara,
      tanggal_pelaksanaan,
      tanggal_selesai_pelaksanaan,
      jam_mulai,
      lokasi_acara,
      deskripsi_kebutuhan,
      catatan_pengguna,
      path_invoice_pdf
    } = req.body;

    // Check if pemesanan exists
    const [existing] = await db.execute(
      'SELECT id FROM pemesanan WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pemesanan not found'
      });
    }

    // Build update query
    const updateFields = [];
    const updateValues = [];

    if (total_tagihan !== undefined) {
      updateFields.push('total_tagihan = ?');
      updateValues.push(total_tagihan);
    }

    if (nama_acara) {
      updateFields.push('nama_acara = ?');
      updateValues.push(nama_acara);
    }

    if (tanggal_pelaksanaan) {
      updateFields.push('tanggal_pelaksanaan = ?');
      updateValues.push(tanggal_pelaksanaan);
    }

    if (tanggal_selesai_pelaksanaan !== undefined) {
      updateFields.push('tanggal_selesai_pelaksanaan = ?');
      updateValues.push(tanggal_selesai_pelaksanaan);
    }

    if (jam_mulai) {
      updateFields.push('jam_mulai = ?');
      updateValues.push(jam_mulai);
    }

    if (lokasi_acara) {
      updateFields.push('lokasi_acara = ?');
      updateValues.push(lokasi_acara);
    }

    if (deskripsi_kebutuhan) {
      updateFields.push('deskripsi_kebutuhan = ?');
      updateValues.push(deskripsi_kebutuhan);
    }

    if (catatan_pengguna !== undefined) {
      updateFields.push('catatan_pengguna = ?');
      updateValues.push(catatan_pengguna);
    }

    if (path_invoice_pdf !== undefined) {
      updateFields.push('path_invoice_pdf = ?');
      updateValues.push(path_invoice_pdf);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    updateValues.push(id);

    const query = `UPDATE pemesanan SET ${updateFields.join(', ')} WHERE id = ?`;
    await db.execute(query, updateValues);

    // Get updated pemesanan
    const [updated] = await db.execute(`
      SELECT p.*, 
             u.nama_lengkap as pengguna_nama, u.email as pengguna_email,
             l.nama_layanan, l.kategori, l.harga_minimal
      FROM pemesanan p
      LEFT JOIN pengguna u ON p.pengguna_id = u.id
      LEFT JOIN layanan l ON p.layanan_id = l.id
      WHERE p.id = ?
    `, [id]);

    res.json({
      success: true,
      message: 'Pemesanan updated successfully',
      data: updated[0]
    });
  } catch (error) {
    console.error('Update pemesanan error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete pemesanan (admin only)
router.delete('/:id', authenticateToken, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if pemesanan exists
    const [existing] = await db.execute(
      'SELECT id FROM pemesanan WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pemesanan not found'
      });
    }

    // Delete pemesanan (cascade will handle related records)
    await db.execute('DELETE FROM pemesanan WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Pemesanan deleted successfully'
    });
  } catch (error) {
    console.error('Delete pemesanan error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get pemesanan by tracking code (public)
router.get('/track/:tracking_code', async (req, res) => {
  try {
    const { tracking_code } = req.params;

    const [rows] = await db.execute(`
      SELECT p.id, p.kode_pemesanan, p.kode_tracking, p.status, p.nama_acara, 
             p.tanggal_pelaksanaan, p.dibuat_pada,
             l.nama_layanan, l.kategori
      FROM pemesanan p
      LEFT JOIN layanan l ON p.layanan_id = l.id
      WHERE p.kode_tracking = ?
    `, [tracking_code]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tracking code not found'
      });
    }

    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Track pemesanan error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
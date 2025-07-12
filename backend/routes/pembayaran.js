const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticateToken, adminOnly, adminOrOwner } = require('../middlewares/auth');
const { uploadSingle } = require('../middlewares/upload');
const { generatePaymentCode } = require('../utils/codeGenerator');

const router = express.Router();

// Get all pembayaran (admin) or user's pembayaran (user)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || '';
    const jenis_pembayaran = req.query.jenis_pembayaran || '';
    const search = req.query.search || '';
    const offset = (page - 1) * limit;

    let query = `
      SELECT pb.*, 
             p.kode_pemesanan, p.nama_acara, p.total_tagihan,
             u.nama_lengkap as pengguna_nama, u.email as pengguna_email,
             l.nama_layanan, l.kategori,
             a.nama_lengkap as admin_nama
      FROM pembayaran pb
      LEFT JOIN pemesanan p ON pb.pemesanan_id = p.id
      LEFT JOIN pengguna u ON pb.pengguna_id = u.id
      LEFT JOIN layanan l ON p.layanan_id = l.id
      LEFT JOIN admin a ON pb.admin_id = a.id
    `;
    let countQuery = 'SELECT COUNT(*) as total FROM pembayaran pb';
    const params = [];

    // Filter by user if not admin
    if (req.user.role !== 'admin') {
      query += ' WHERE pb.pengguna_id = ?';
      countQuery += ' WHERE pengguna_id = ?';
      params.push(req.user.id);
    }

    // Add filters
    if (status) {
      const whereClause = params.length > 0 ? ' AND' : ' WHERE';
      query += `${whereClause} pb.status = ?`;
      countQuery += `${whereClause} status = ?`;
      params.push(status);
    }

    if (jenis_pembayaran) {
      const whereClause = params.length > 0 ? ' AND' : ' WHERE';
      query += `${whereClause} pb.jenis_pembayaran = ?`;
      countQuery += `${whereClause} jenis_pembayaran = ?`;
      params.push(jenis_pembayaran);
    }

    if (search) {
      const whereClause = params.length > 0 ? ' AND' : ' WHERE';
      query += `${whereClause} (p.kode_pemesanan LIKE ? OR p.nama_acara LIKE ?)`;
      countQuery += `${whereClause} (p.kode_pemesanan LIKE ? OR p.nama_acara LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY pb.dibuat_pada DESC LIMIT ? OFFSET ?';
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
        pembayaran: rows,
        pagination: {
          current_page: page,
          total_pages: totalPages,
          total_items: total,
          items_per_page: limit
        }
      }
    });
  } catch (error) {
    console.error('Get pembayaran error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get single pembayaran
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    let query = `
      SELECT pb.*, 
             p.kode_pemesanan, p.nama_acara, p.total_tagihan,
             u.nama_lengkap as pengguna_nama, u.email as pengguna_email, u.no_wa as pengguna_no_wa,
             l.nama_layanan, l.kategori, l.deskripsi as layanan_deskripsi,
             a.nama_lengkap as admin_nama, a.email as admin_email
      FROM pembayaran pb
      LEFT JOIN pemesanan p ON pb.pemesanan_id = p.id
      LEFT JOIN pengguna u ON pb.pengguna_id = u.id
      LEFT JOIN layanan l ON p.layanan_id = l.id
      LEFT JOIN admin a ON pb.admin_id = a.id
      WHERE pb.id = ?
    `;
    const params = [id];

    // Filter by user if not admin
    if (req.user.role !== 'admin') {
      query += ' AND pb.pengguna_id = ?';
      params.push(req.user.id);
    }

    const [rows] = await db.execute(query, params);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pembayaran not found'
      });
    }

    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Get pembayaran error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create pembayaran (user only)
router.post('/', authenticateToken, uploadSingle('bukti_pembayaran'), [
  body('pemesanan_id').isInt({ min: 1 }).withMessage('Pemesanan ID harus berupa angka'),
  body('jenis_pembayaran').isIn(['dp', 'pelunasan', 'full']).withMessage('Jenis pembayaran tidak valid'),
  body('total_biaya').isNumeric().withMessage('Total biaya harus berupa angka'),
  body('metode').isIn(['transfer melalui BCA DENGAN NO REKENING 1234567890']).withMessage('Metode pembayaran tidak valid')
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
      jenis_pembayaran,
      total_biaya,
      metode
    } = req.body;

    // Check if pemesanan exists and is validated
    const [pemesanan] = await db.execute(
      'SELECT id, pengguna_id, total_tagihan, status FROM pemesanan WHERE id = ? AND status = "tervalidasi"',
      [pemesanan_id]
    );

    if (pemesanan.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pemesanan not found or not validated'
      });
    }

    // Check if user owns this pemesanan
    if (req.user.role !== 'admin' && pemesanan[0].pengguna_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Calculate payment details
    const totalTagihan = parseFloat(pemesanan[0].total_tagihan);
    let persentase_bayar = 0;
    let urutan = 1;
    let sisa_tagihan = totalTagihan;

    // Get existing payments for this pemesanan
    const [existingPayments] = await db.execute(
      'SELECT SUM(total_biaya) as total_dibayar, COUNT(*) as jumlah_pembayaran FROM pembayaran WHERE pemesanan_id = ? AND status = "lunas"',
      [pemesanan_id]
    );

    const totalDibayar = parseFloat(existingPayments[0].total_dibayar) || 0;
    const jumlahPembayaran = existingPayments[0].jumlah_pembayaran || 0;
    sisa_tagihan = totalTagihan - totalDibayar;
    urutan = jumlahPembayaran + 1;

    // Calculate percentage
    if (jenis_pembayaran === 'dp') {
      persentase_bayar = 25;
      if (parseFloat(total_biaya) !== (totalTagihan * 0.25)) {
        return res.status(400).json({
          success: false,
          message: `DP harus 25% dari total tagihan (${totalTagihan * 0.25})`
        });
      }
    } else if (jenis_pembayaran === 'pelunasan') {
      persentase_bayar = 75;
      if (parseFloat(total_biaya) !== (totalTagihan * 0.75)) {
        return res.status(400).json({
          success: false,
          message: `Pelunasan harus 75% dari total tagihan (${totalTagihan * 0.75})`
        });
      }
    } else if (jenis_pembayaran === 'full') {
      persentase_bayar = 100;
      if (parseFloat(total_biaya) !== totalTagihan) {
        return res.status(400).json({
          success: false,
          message: `Pembayaran full harus sama dengan total tagihan (${totalTagihan})`
        });
      }
    }

    // Check if payment amount is valid
    if (parseFloat(total_biaya) > sisa_tagihan) {
      return res.status(400).json({
        success: false,
        message: `Jumlah pembayaran melebihi sisa tagihan (${sisa_tagihan})`
      });
    }

    // Create pembayaran
    const [result] = await db.execute(`
      INSERT INTO pembayaran (
        pemesanan_id, pengguna_id, admin_id, jenis_pembayaran, urutan,
        sisa_tagihan, total_biaya, persentase_bayar, metode,
        url_bukti_pembayaran, tanggal_pembayaran
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `, [
      pemesanan_id,
      req.user.id,
      1, // Default admin ID
      jenis_pembayaran,
      urutan,
      sisa_tagihan - parseFloat(total_biaya),
      total_biaya,
      persentase_bayar,
      metode,
      req.file ? req.file.filename : null
    ]);

    // Get created pembayaran
    const [created] = await db.execute(`
      SELECT pb.*, 
             p.kode_pemesanan, p.nama_acara, p.total_tagihan,
             u.nama_lengkap as pengguna_nama, u.email as pengguna_email,
             l.nama_layanan, l.kategori
      FROM pembayaran pb
      LEFT JOIN pemesanan p ON pb.pemesanan_id = p.id
      LEFT JOIN pengguna u ON pb.pengguna_id = u.id
      LEFT JOIN layanan l ON p.layanan_id = l.id
      WHERE pb.id = ?
    `, [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'Pembayaran created successfully',
      data: created[0]
    });
  } catch (error) {
    console.error('Create pembayaran error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update pembayaran status (admin only)
router.put('/:id/status', authenticateToken, adminOnly, [
  body('status').isIn(['pending', 'lunas', 'cicilan', 'gagal']).withMessage('Status tidak valid'),
  body('diverifikasi').optional().isBoolean().withMessage('Diverifikasi harus boolean')
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
    const { status, diverifikasi } = req.body;

    // Check if pembayaran exists
    const [existing] = await db.execute(
      'SELECT id FROM pembayaran WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pembayaran not found'
      });
    }

    // Build update query
    const updateFields = ['status = ?'];
    const updateValues = [status];

    if (diverifikasi !== undefined) {
      updateFields.push('diverifikasi = ?');
      updateValues.push(diverifikasi);
    }

    updateValues.push(id);

    const query = `UPDATE pembayaran SET ${updateFields.join(', ')} WHERE id = ?`;
    await db.execute(query, updateValues);

    // Get updated pembayaran
    const [updated] = await db.execute(`
      SELECT pb.*, 
             p.kode_pemesanan, p.nama_acara, p.total_tagihan,
             u.nama_lengkap as pengguna_nama, u.email as pengguna_email,
             l.nama_layanan, l.kategori
      FROM pembayaran pb
      LEFT JOIN pemesanan p ON pb.pemesanan_id = p.id
      LEFT JOIN pengguna u ON pb.pengguna_id = u.id
      LEFT JOIN layanan l ON p.layanan_id = l.id
      WHERE pb.id = ?
    `, [id]);

    res.json({
      success: true,
      message: 'Pembayaran status updated successfully',
      data: updated[0]
    });
  } catch (error) {
    console.error('Update pembayaran status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update pembayaran (admin only)
router.put('/:id', authenticateToken, adminOnly, uploadSingle('kwitansi_file'), [
  body('total_biaya').optional().isNumeric().withMessage('Total biaya harus berupa angka')
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
      jenis_pembayaran,
      total_biaya,
      persentase_bayar,
      metode,
      status,
      diverifikasi,
      tanggal_pembayaran
    } = req.body;

    // Check if pembayaran exists
    const [existing] = await db.execute(
      'SELECT id FROM pembayaran WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pembayaran not found'
      });
    }

    // Build update query
    const updateFields = [];
    const updateValues = [];

    if (jenis_pembayaran) {
      updateFields.push('jenis_pembayaran = ?');
      updateValues.push(jenis_pembayaran);
    }

    if (total_biaya !== undefined) {
      updateFields.push('total_biaya = ?');
      updateValues.push(total_biaya);
    }

    if (persentase_bayar !== undefined) {
      updateFields.push('persentase_bayar = ?');
      updateValues.push(persentase_bayar);
    }

    if (metode) {
      updateFields.push('metode = ?');
      updateValues.push(metode);
    }

    if (status) {
      updateFields.push('status = ?');
      updateValues.push(status);
    }

    if (diverifikasi !== undefined) {
      updateFields.push('diverifikasi = ?');
      updateValues.push(diverifikasi);
    }

    if (req.file) {
      updateFields.push('path_kwitansi_pdf = ?');
      updateValues.push(req.file.filename);
    }

    if (tanggal_pembayaran) {
      updateFields.push('tanggal_pembayaran = ?');
      updateValues.push(tanggal_pembayaran);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    updateValues.push(id);

    const query = `UPDATE pembayaran SET ${updateFields.join(', ')} WHERE id = ?`;
    await db.execute(query, updateValues);

    // Get updated pembayaran
    const [updated] = await db.execute(`
      SELECT pb.*, 
             p.kode_pemesanan, p.nama_acara, p.total_tagihan,
             u.nama_lengkap as pengguna_nama, u.email as pengguna_email,
             l.nama_layanan, l.kategori
      FROM pembayaran pb
      LEFT JOIN pemesanan p ON pb.pemesanan_id = p.id
      LEFT JOIN pengguna u ON pb.pengguna_id = u.id
      LEFT JOIN layanan l ON p.layanan_id = l.id
      WHERE pb.id = ?
    `, [id]);

    res.json({
      success: true,
      message: 'Pembayaran updated successfully',
      data: updated[0]
    });
  } catch (error) {
    console.error('Update pembayaran error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete pembayaran (admin only)
router.delete('/:id', authenticateToken, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if pembayaran exists
    const [existing] = await db.execute(
      'SELECT id FROM pembayaran WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pembayaran not found'
      });
    }

    // Delete pembayaran
    await db.execute('DELETE FROM pembayaran WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Pembayaran deleted successfully'
    });
  } catch (error) {
    console.error('Delete pembayaran error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get pembayaran by pemesanan (user can access their own)
router.get('/pemesanan/:pemesanan_id', authenticateToken, async (req, res) => {
  try {
    const { pemesanan_id } = req.params;

    // Check if user can access this pemesanan
    let pemesananQuery = 'SELECT id, pengguna_id FROM pemesanan WHERE id = ?';
    const pemesananParams = [pemesanan_id];

    if (req.user.role !== 'admin') {
      pemesananQuery += ' AND pengguna_id = ?';
      pemesananParams.push(req.user.id);
    }

    const [pemesanan] = await db.execute(pemesananQuery, pemesananParams);

    if (pemesanan.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pemesanan not found or access denied'
      });
    }

    // Get pembayaran for this pemesanan
    const [rows] = await db.execute(`
      SELECT pb.*, 
             p.kode_pemesanan, p.nama_acara, p.total_tagihan,
             u.nama_lengkap as pengguna_nama, u.email as pengguna_email,
             l.nama_layanan, l.kategori
      FROM pembayaran pb
      LEFT JOIN pemesanan p ON pb.pemesanan_id = p.id
      LEFT JOIN pengguna u ON pb.pengguna_id = u.id
      LEFT JOIN layanan l ON p.layanan_id = l.id
      WHERE pb.pemesanan_id = ?
      ORDER BY pb.urutan ASC, pb.dibuat_pada ASC
    `, [pemesanan_id]);

    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Get pembayaran by pemesanan error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
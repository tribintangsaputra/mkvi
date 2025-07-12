const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticateToken, adminOnly } = require('../middlewares/auth');
const { 
  generateKwitansi, 
  generateInvoice, 
  generateMou 
} = require('../utils/documentGenerator');

const router = express.Router();

// Generate Kwitansi (admin only)
router.post('/kwitansi/:pembayaran_id', authenticateToken, adminOnly, async (req, res) => {
  try {
    const { pembayaran_id } = req.params;

    // Get payment data with related information
    const [paymentData] = await db.execute(`
      SELECT pb.*, 
             p.kode_pemesanan, p.nama_acara, p.total_tagihan, p.lokasi_acara,
             u.nama_lengkap as pengguna_nama, u.email as pengguna_email,
             l.nama_layanan, l.kategori, l.deskripsi as layanan_deskripsi,
             m.nama_client, m.pekerjaan_client
      FROM pembayaran pb
      LEFT JOIN pemesanan p ON pb.pemesanan_id = p.id
      LEFT JOIN pengguna u ON pb.pengguna_id = u.id
      LEFT JOIN layanan l ON p.layanan_id = l.id
      LEFT JOIN meeting m ON m.pemesanan_id = p.id
      WHERE pb.id = ?
    `, [pembayaran_id]);

    if (paymentData.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Generate kwitansi
    const result = await generateKwitansi(paymentData[0]);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to generate kwitansi',
        error: result.error
      });
    }

    // Update payment record with kwitansi path
    await db.execute(
      'UPDATE pembayaran SET path_kwitansi_pdf = ? WHERE id = ?',
      [result.data.filename, pembayaran_id]
    );

    // Log successful generation
    console.log(`✅ Kwitansi generated: ${result.data.filename}`);

    res.json({
      success: true,
      message: 'Kwitansi generated successfully',
      data: result.data
    });
  } catch (error) {
    console.error('Generate kwitansi error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Generate Invoice (admin only)
router.post('/invoice/:pemesanan_id', authenticateToken, adminOnly, async (req, res) => {
  try {
    const { pemesanan_id } = req.params;

    // Get order data with related information
    const [orderData] = await db.execute(`
      SELECT p.*, 
             u.nama_lengkap as pengguna_nama, u.email as pengguna_email,
             l.nama_layanan, l.kategori, l.deskripsi as layanan_deskripsi, l.durasi_pengerjaan
      FROM pemesanan p
      LEFT JOIN pengguna u ON p.pengguna_id = u.id
      LEFT JOIN layanan l ON p.layanan_id = l.id
      WHERE p.id = ?
    `, [pemesanan_id]);

    if (orderData.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Generate invoice
    const result = await generateInvoice(orderData[0]);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to generate invoice',
        error: result.error
      });
    }

    // Update order record with invoice path
    await db.execute(
      'UPDATE pemesanan SET path_invoice_pdf = ? WHERE id = ?',
      [result.data.filename, pemesanan_id]
    );

    // Log successful generation
    console.log(`✅ Invoice generated: ${result.data.filename}`);

    res.json({
      success: true,
      message: 'Invoice generated successfully',
      data: result.data
    });
  } catch (error) {
    console.error('Generate invoice error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Generate MoU (admin only)
router.post('/mou/:meeting_id', authenticateToken, adminOnly, async (req, res) => {
  try {
    const { meeting_id } = req.params;

    // Get meeting data with related information
    const [meetingData] = await db.execute(`
      SELECT m.*, 
             p.kode_pemesanan, p.nama_acara, p.total_tagihan, p.lokasi_acara,
             u.nama_lengkap as pengguna_nama, u.email as pengguna_email,
             l.nama_layanan, l.kategori, l.deskripsi as layanan_deskripsi, l.durasi_pengerjaan
      FROM meeting m
      LEFT JOIN pemesanan p ON m.pemesanan_id = p.id
      LEFT JOIN pengguna u ON m.pengguna_id = u.id
      LEFT JOIN layanan l ON p.layanan_id = l.id
      WHERE m.id = ?
    `, [meeting_id]);

    if (meetingData.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    // Generate MoU
    const result = await generateMou(meetingData[0]);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to generate MoU',
        error: result.error
      });
    }

    // Update meeting record with MoU path
    await db.execute(
      'UPDATE meeting SET path_mou_pdf = ? WHERE id = ?',
      [result.data.filename, meeting_id]
    );

    // Log successful generation
    console.log(`✅ MoU generated: ${result.data.filename}`);

    res.json({
      success: true,
      message: 'MoU generated successfully',
      data: result.data
    });
  } catch (error) {
    console.error('Generate MoU error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get document by type and ID
router.get('/:type/:id', authenticateToken, async (req, res) => {
  try {
    const { type, id } = req.params;
    
    let query = '';
    let tableName = '';
    let pathColumn = '';

    switch (type) {
      case 'kwitansi':
        tableName = 'pembayaran';
        pathColumn = 'path_kwitansi_pdf';
        query = `
          SELECT pb.${pathColumn}, p.kode_pemesanan
          FROM ${tableName} pb
          LEFT JOIN pemesanan p ON pb.pemesanan_id = p.id
          WHERE pb.id = ?
        `;
        break;
      case 'invoice':
        tableName = 'pemesanan';
        pathColumn = 'path_invoice_pdf';
        query = `
          SELECT ${pathColumn}, kode_pemesanan
          FROM ${tableName}
          WHERE id = ?
        `;
        break;
      case 'mou':
        tableName = 'meeting';
        pathColumn = 'path_mou_pdf';
        query = `
          SELECT m.${pathColumn}, p.kode_pemesanan
          FROM ${tableName} m
          LEFT JOIN pemesanan p ON m.pemesanan_id = p.id
          WHERE m.id = ?
        `;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid document type'
        });
    }

    // Add user filter if not admin
    if (req.user.role !== 'admin') {
      if (type === 'kwitansi') {
        query += ' AND pb.pengguna_id = ?';
      } else if (type === 'invoice') {
        query += ' AND pengguna_id = ?';
      } else if (type === 'mou') {
        query += ' AND m.pengguna_id = ?';
      }
    }

    const params = req.user.role === 'admin' ? [id] : [id, req.user.id];
    const [rows] = await db.execute(query, params);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    const documentPath = rows[0][pathColumn];
    if (!documentPath) {
      return res.status(404).json({
        success: false,
        message: 'Document file not found'
      });
    }

    res.json({
      success: true,
      data: {
        type,
        filename: documentPath,
        url: `/uploads/documents/${documentPath}`,
        kode_pemesanan: rows[0].kode_pemesanan
      }
    });
  } catch (error) {
    console.error('Get document error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// List documents for a specific order (user can access their own)
router.get('/order/:pemesanan_id', authenticateToken, async (req, res) => {
  try {
    const { pemesanan_id } = req.params;

    // Check if user can access this order
    let orderQuery = 'SELECT id, pengguna_id, kode_pemesanan FROM pemesanan WHERE id = ?';
    const orderParams = [pemesanan_id];

    if (req.user.role !== 'admin') {
      orderQuery += ' AND pengguna_id = ?';
      orderParams.push(req.user.id);
    }

    const [orderData] = await db.execute(orderQuery, orderParams);

    if (orderData.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or access denied'
      });
    }

    // Get all documents for this order
    const [documents] = await db.execute(`
      SELECT 
        p.path_invoice_pdf as invoice_file,
        m.path_mou_pdf as mou_file,
        GROUP_CONCAT(pb.path_kwitansi_pdf) as kwitansi_files
      FROM pemesanan p
      LEFT JOIN meeting m ON m.pemesanan_id = p.id
      LEFT JOIN pembayaran pb ON pb.pemesanan_id = p.id
      WHERE p.id = ?
      GROUP BY p.id
    `, [pemesanan_id]);

    const result = {
      kode_pemesanan: orderData[0].kode_pemesanan,
      documents: {
        invoice: documents[0]?.invoice_file ? {
          filename: documents[0].invoice_file,
          url: `/uploads/documents/${documents[0].invoice_file}`
        } : null,
        mou: documents[0]?.mou_file ? {
          filename: documents[0].mou_file,
          url: `/uploads/documents/${documents[0].mou_file}`
        } : null,
        kwitansi: documents[0]?.kwitansi_files ? 
          documents[0].kwitansi_files.split(',').filter(f => f).map(filename => ({
            filename,
            url: `/uploads/documents/${filename}`
          })) : []
      }
    };

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('List documents error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
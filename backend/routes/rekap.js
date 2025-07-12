const express = require('express');
const { body, validationResult } = require('express-validator');
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const moment = require('moment');
const db = require('../config/database');
const { authenticateToken, adminOnly } = require('../middlewares/auth');

const router = express.Router();

// Generate rekap pemesanan
router.post('/pemesanan/generate', authenticateToken, adminOnly, [
  body('tanggal_mulai').isISO8601().withMessage('Tanggal mulai harus valid'),
  body('tanggal_selesai').isISO8601().withMessage('Tanggal selesai harus valid')
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

    const { tanggal_mulai, tanggal_selesai } = req.body;

    // Get pemesanan data
    const [pemesananData] = await db.execute(`
      SELECT p.*, 
             u.nama_lengkap as pengguna_nama, u.email as pengguna_email,
             l.nama_layanan, l.kategori
      FROM pemesanan p
      LEFT JOIN pengguna u ON p.pengguna_id = u.id
      LEFT JOIN layanan l ON p.layanan_id = l.id
      WHERE DATE(p.dibuat_pada) BETWEEN ? AND ?
      ORDER BY p.dibuat_pada DESC
    `, [tanggal_mulai, tanggal_selesai]);

    // Calculate statistics
    const total = pemesananData.length;
    const tervalidasi = pemesananData.filter(p => p.status === 'tervalidasi').length;
    const dibatalkan = pemesananData.filter(p => p.status === 'dibatalkan').length;
    const menunggu = pemesananData.filter(p => p.status === 'menunggu_validasi_admin').length;

    // Create Excel file
    const workbook = XLSX.utils.book_new();
    
    // Summary sheet
    const summaryData = [
      ['Rekap Pemesanan'],
      ['Periode', `${tanggal_mulai} s/d ${tanggal_selesai}`],
      ['Tanggal Generate', moment().format('YYYY-MM-DD HH:mm:ss')],
      [''],
      ['RINGKASAN'],
      ['Total Pemesanan', total],
      ['Tervalidasi', tervalidasi],
      ['Dibatalkan', dibatalkan],
      ['Menunggu Validasi', menunggu],
      [''],
      ['DETAIL PER STATUS'],
      ['Status', 'Jumlah', 'Persentase'],
      ['Tervalidasi', tervalidasi, total > 0 ? `${((tervalidasi/total)*100).toFixed(2)}%` : '0%'],
      ['Dibatalkan', dibatalkan, total > 0 ? `${((dibatalkan/total)*100).toFixed(2)}%` : '0%'],
      ['Menunggu Validasi', menunggu, total > 0 ? `${((menunggu/total)*100).toFixed(2)}%` : '0%']
    ];
    
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Ringkasan');

    // Detail sheet
    if (pemesananData.length > 0) {
      const detailData = pemesananData.map(p => ({
        'Kode Pemesanan': p.kode_pemesanan,
        'Kode Tracking': p.kode_tracking,
        'Nama Pengguna': p.pengguna_nama,
        'Email Pengguna': p.pengguna_email,
        'Layanan': p.nama_layanan,
        'Kategori': p.kategori,
        'Nama Acara': p.nama_acara,
        'Tanggal Pelaksanaan': p.tanggal_pelaksanaan,
        'Lokasi Acara': p.lokasi_acara,
        'Total Tagihan': p.total_tagihan,
        'Status': p.status,
        'Dibuat Pada': moment(p.dibuat_pada).format('YYYY-MM-DD HH:mm:ss')
      }));
      
      const detailSheet = XLSX.utils.json_to_sheet(detailData);
      XLSX.utils.book_append_sheet(workbook, detailSheet, 'Detail Pemesanan');
    }

    // Save file
    const fileName = `rekap-pemesanan-${moment().format('YYYYMMDD-HHmmss')}.xlsx`;
    const filePath = path.join(__dirname, '../uploads/reports', fileName);
    
    // Ensure directory exists
    const reportsDir = path.join(__dirname, '../uploads/reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    XLSX.writeFile(workbook, filePath);

    // Save to database
    const [result] = await db.execute(`
      INSERT INTO rekap_pemesanan (
        admin_id, tanggal, bulan, tahun, total, tervalidasi, dibatalkan
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      req.user.id,
      moment().format('YYYY-MM-DD'),
      moment().format('MMMM YYYY'),
      moment().year(),
      total,
      tervalidasi,
      dibatalkan
    ]);

    res.json({
      success: true,
      message: 'Rekap pemesanan generated successfully',
      data: {
        id: result.insertId,
        file_name: fileName,
        file_path: `/uploads/reports/${fileName}`,
        statistics: {
          total,
          tervalidasi,
          dibatalkan,
          menunggu
        },
        periode: {
          tanggal_mulai,
          tanggal_selesai
        }
      }
    });
  } catch (error) {
    console.error('Generate rekap pemesanan error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Generate rekap meeting
router.post('/meeting/generate', authenticateToken, adminOnly, [
  body('tanggal_mulai').isISO8601().withMessage('Tanggal mulai harus valid'),
  body('tanggal_selesai').isISO8601().withMessage('Tanggal selesai harus valid')
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

    const { tanggal_mulai, tanggal_selesai } = req.body;

    // Get meeting data
    const [meetingData] = await db.execute(`
      SELECT m.*, 
             p.kode_pemesanan, p.nama_acara,
             u.nama_lengkap as pengguna_nama, u.email as pengguna_email,
             l.nama_layanan, l.kategori
      FROM meeting m
      LEFT JOIN pemesanan p ON m.pemesanan_id = p.id
      LEFT JOIN pengguna u ON m.pengguna_id = u.id
      LEFT JOIN layanan l ON p.layanan_id = l.id
      WHERE DATE(m.dibuat_pada) BETWEEN ? AND ?
      ORDER BY m.dibuat_pada DESC
    `, [tanggal_mulai, tanggal_selesai]);

    // Calculate statistics
    const total = meetingData.length;
    const selesai = meetingData.filter(m => m.status === 'selesai').length;
    const dibatalkan = meetingData.filter(m => m.status === 'dibatalkan').length;
    const dijadwalkan = meetingData.filter(m => m.status === 'dijadwalkan').length;

    // Create Excel file
    const workbook = XLSX.utils.book_new();
    
    // Summary sheet
    const summaryData = [
      ['Rekap Meeting'],
      ['Periode', `${tanggal_mulai} s/d ${tanggal_selesai}`],
      ['Tanggal Generate', moment().format('YYYY-MM-DD HH:mm:ss')],
      [''],
      ['RINGKASAN'],
      ['Total Meeting', total],
      ['Selesai', selesai],
      ['Dibatalkan', dibatalkan],
      ['Dijadwalkan', dijadwalkan],
      [''],
      ['DETAIL PER STATUS'],
      ['Status', 'Jumlah', 'Persentase'],
      ['Selesai', selesai, total > 0 ? `${((selesai/total)*100).toFixed(2)}%` : '0%'],
      ['Dibatalkan', dibatalkan, total > 0 ? `${((dibatalkan/total)*100).toFixed(2)}%` : '0%'],
      ['Dijadwalkan', dijadwalkan, total > 0 ? `${((dijadwalkan/total)*100).toFixed(2)}%` : '0%']
    ];
    
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Ringkasan');

    // Detail sheet
    if (meetingData.length > 0) {
      const detailData = meetingData.map(m => ({
        'Kode Pemesanan': m.kode_pemesanan,
        'Nama Acara': m.nama_acara,
        'Nama Pengguna': m.pengguna_nama,
        'Email Pengguna': m.pengguna_email,
        'Layanan': m.nama_layanan,
        'Kategori': m.kategori,
        'Nama Client': m.nama_client,
        'Email Client': m.email_client,
        'No WA Client': m.no_wa_client,
        'Pekerjaan Client': m.pekerjaan_client,
        'Platform': m.platform,
        'Waktu Mulai': m.waktu_mulai ? moment(m.waktu_mulai).format('YYYY-MM-DD HH:mm:ss') : '',
        'Waktu Selesai': m.waktu_selesai ? moment(m.waktu_selesai).format('YYYY-MM-DD HH:mm:ss') : '',
        'Status': m.status,
        'Email Terkirim': m.email_terkirim ? 'Ya' : 'Tidak',
        'Dibuat Pada': moment(m.dibuat_pada).format('YYYY-MM-DD HH:mm:ss')
      }));
      
      const detailSheet = XLSX.utils.json_to_sheet(detailData);
      XLSX.utils.book_append_sheet(workbook, detailSheet, 'Detail Meeting');
    }

    // Save file
    const fileName = `rekap-meeting-${moment().format('YYYYMMDD-HHmmss')}.xlsx`;
    const filePath = path.join(__dirname, '../uploads/reports', fileName);
    
    // Ensure directory exists
    const reportsDir = path.join(__dirname, '../uploads/reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    XLSX.writeFile(workbook, filePath);

    // Save to database
    const [result] = await db.execute(`
      INSERT INTO rekap_meeting (
        admin_id, tanggal, bulan, tahun, total, selesai, dibatalkan
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      req.user.id,
      moment().format('YYYY-MM-DD'),
      moment().format('MMMM YYYY'),
      moment().year(),
      total,
      selesai,
      dibatalkan
    ]);

    res.json({
      success: true,
      message: 'Rekap meeting generated successfully',
      data: {
        id: result.insertId,
        file_name: fileName,
        file_path: `/uploads/reports/${fileName}`,
        statistics: {
          total,
          selesai,
          dibatalkan,
          dijadwalkan
        },
        periode: {
          tanggal_mulai,
          tanggal_selesai
        }
      }
    });
  } catch (error) {
    console.error('Generate rekap meeting error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Generate rekap pembayaran
router.post('/pembayaran/generate', authenticateToken, adminOnly, [
  body('tanggal_mulai').isISO8601().withMessage('Tanggal mulai harus valid'),
  body('tanggal_selesai').isISO8601().withMessage('Tanggal selesai harus valid')
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

    const { tanggal_mulai, tanggal_selesai } = req.body;

    // Get pembayaran data
    const [pembayaranData] = await db.execute(`
      SELECT pb.*, 
             p.kode_pemesanan, p.nama_acara, p.total_tagihan,
             u.nama_lengkap as pengguna_nama, u.email as pengguna_email,
             l.nama_layanan, l.kategori
      FROM pembayaran pb
      LEFT JOIN pemesanan p ON pb.pemesanan_id = p.id
      LEFT JOIN pengguna u ON pb.pengguna_id = u.id
      LEFT JOIN layanan l ON p.layanan_id = l.id
      WHERE DATE(pb.dibuat_pada) BETWEEN ? AND ?
      ORDER BY pb.dibuat_pada DESC
    `, [tanggal_mulai, tanggal_selesai]);

    // Calculate statistics
    const total = pembayaranData.length;
    const lunas = pembayaranData.filter(p => p.status === 'lunas').length;
    const gagal = pembayaranData.filter(p => p.status === 'gagal').length;
    const pending = pembayaranData.filter(p => p.status === 'pending').length;
    const cicilan = pembayaranData.filter(p => p.status === 'cicilan').length;
    
    const totalNominal = pembayaranData
      .filter(p => p.status === 'lunas')
      .reduce((sum, p) => sum + parseFloat(p.total_biaya), 0);

    // Create Excel file
    const workbook = XLSX.utils.book_new();
    
    // Summary sheet
    const summaryData = [
      ['Rekap Pembayaran'],
      ['Periode', `${tanggal_mulai} s/d ${tanggal_selesai}`],
      ['Tanggal Generate', moment().format('YYYY-MM-DD HH:mm:ss')],
      [''],
      ['RINGKASAN'],
      ['Total Pembayaran', total],
      ['Lunas', lunas],
      ['Gagal', gagal],
      ['Pending', pending],
      ['Cicilan', cicilan],
      ['Total Nominal (Lunas)', `Rp ${totalNominal.toLocaleString('id-ID')}`],
      [''],
      ['DETAIL PER STATUS'],
      ['Status', 'Jumlah', 'Persentase'],
      ['Lunas', lunas, total > 0 ? `${((lunas/total)*100).toFixed(2)}%` : '0%'],
      ['Gagal', gagal, total > 0 ? `${((gagal/total)*100).toFixed(2)}%` : '0%'],
      ['Pending', pending, total > 0 ? `${((pending/total)*100).toFixed(2)}%` : '0%'],
      ['Cicilan', cicilan, total > 0 ? `${((cicilan/total)*100).toFixed(2)}%` : '0%'],
      [''],
      ['DETAIL PER JENIS PEMBAYARAN'],
      ['Jenis', 'Jumlah', 'Total Nominal'],
    ];

    // Add payment type statistics
    const jenisStats = {};
    pembayaranData.forEach(p => {
      if (!jenisStats[p.jenis_pembayaran]) {
        jenisStats[p.jenis_pembayaran] = { count: 0, total: 0 };
      }
      jenisStats[p.jenis_pembayaran].count++;
      if (p.status === 'lunas') {
        jenisStats[p.jenis_pembayaran].total += parseFloat(p.total_biaya);
      }
    });

    Object.keys(jenisStats).forEach(jenis => {
      summaryData.push([
        jenis.toUpperCase(),
        jenisStats[jenis].count,
        `Rp ${jenisStats[jenis].total.toLocaleString('id-ID')}`
      ]);
    });
    
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Ringkasan');

    // Detail sheet
    if (pembayaranData.length > 0) {
      const detailData = pembayaranData.map(p => ({
        'Kode Pemesanan': p.kode_pemesanan,
        'Nama Acara': p.nama_acara,
        'Nama Pengguna': p.pengguna_nama,
        'Email Pengguna': p.pengguna_email,
        'Layanan': p.nama_layanan,
        'Kategori': p.kategori,
        'Jenis Pembayaran': p.jenis_pembayaran,
        'Urutan': p.urutan,
        'Total Biaya': p.total_biaya,
        'Persentase Bayar': `${p.persentase_bayar}%`,
        'Sisa Tagihan': p.sisa_tagihan,
        'Metode': p.metode,
        'Status': p.status,
        'Diverifikasi': p.diverifikasi ? 'Ya' : 'Tidak',
        'Tanggal Pembayaran': p.tanggal_pembayaran ? moment(p.tanggal_pembayaran).format('YYYY-MM-DD HH:mm:ss') : '',
        'Dibuat Pada': moment(p.dibuat_pada).format('YYYY-MM-DD HH:mm:ss')
      }));
      
      const detailSheet = XLSX.utils.json_to_sheet(detailData);
      XLSX.utils.book_append_sheet(workbook, detailSheet, 'Detail Pembayaran');
    }

    // Save file
    const fileName = `rekap-pembayaran-${moment().format('YYYYMMDD-HHmmss')}.xlsx`;
    const filePath = path.join(__dirname, '../uploads/reports', fileName);
    
    // Ensure directory exists
    const reportsDir = path.join(__dirname, '../uploads/reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    XLSX.writeFile(workbook, filePath);

    // Save to database
    const [result] = await db.execute(`
      INSERT INTO rekap_pembayaran (
        admin_id, tanggal, bulan, tahun, total, lunas, gagal, total_nominal
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      req.user.id,
      moment().format('YYYY-MM-DD'),
      moment().format('MMMM YYYY'),
      moment().year(),
      total,
      lunas,
      gagal,
      totalNominal
    ]);

    res.json({
      success: true,
      message: 'Rekap pembayaran generated successfully',
      data: {
        id: result.insertId,
        file_name: fileName,
        file_path: `/uploads/reports/${fileName}`,
        statistics: {
          total,
          lunas,
          gagal,
          pending,
          cicilan,
          total_nominal: totalNominal
        },
        periode: {
          tanggal_mulai,
          tanggal_selesai
        }
      }
    });
  } catch (error) {
    console.error('Generate rekap pembayaran error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get all rekap pemesanan (admin only)
router.get('/pemesanan', authenticateToken, adminOnly, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const tahun = req.query.tahun || '';
    const bulan = req.query.bulan || '';
    const offset = (page - 1) * limit;

    let query = `
      SELECT rp.*, a.nama_lengkap as admin_nama
      FROM rekap_pemesanan rp
      LEFT JOIN admin a ON rp.admin_id = a.id
    `;
    let countQuery = 'SELECT COUNT(*) as total FROM rekap_pemesanan';
    const params = [];

    // Add filters
    const conditions = [];
    if (tahun) {
      conditions.push('rp.tahun = ?');
      params.push(tahun);
    }
    if (bulan) {
      conditions.push('rp.bulan LIKE ?');
      params.push(`%${bulan}%`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
      countQuery += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY rp.dibuat_pada DESC LIMIT ? OFFSET ?';
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
        rekap: rows,
        pagination: {
          current_page: page,
          total_pages: totalPages,
          total_items: total,
          items_per_page: limit
        }
      }
    });
  } catch (error) {
    console.error('Get rekap pemesanan error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get all rekap meeting (admin only)
router.get('/meeting', authenticateToken, adminOnly, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const tahun = req.query.tahun || '';
    const bulan = req.query.bulan || '';
    const offset = (page - 1) * limit;

    let query = `
      SELECT rm.*, a.nama_lengkap as admin_nama
      FROM rekap_meeting rm
      LEFT JOIN admin a ON rm.admin_id = a.id
    `;
    let countQuery = 'SELECT COUNT(*) as total FROM rekap_meeting';
    const params = [];

    // Add filters
    const conditions = [];
    if (tahun) {
      conditions.push('rm.tahun = ?');
      params.push(tahun);
    }
    if (bulan) {
      conditions.push('rm.bulan LIKE ?');
      params.push(`%${bulan}%`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
      countQuery += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY rm.dibuat_pada DESC LIMIT ? OFFSET ?';
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
        rekap: rows,
        pagination: {
          current_page: page,
          total_pages: totalPages,
          total_items: total,
          items_per_page: limit
        }
      }
    });
  } catch (error) {
    console.error('Get rekap meeting error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get all rekap pembayaran (admin only)
router.get('/pembayaran', authenticateToken, adminOnly, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const tahun = req.query.tahun || '';
    const bulan = req.query.bulan || '';
    const offset = (page - 1) * limit;

    let query = `
      SELECT rpb.*, a.nama_lengkap as admin_nama
      FROM rekap_pembayaran rpb
      LEFT JOIN admin a ON rpb.admin_id = a.id
    `;
    let countQuery = 'SELECT COUNT(*) as total FROM rekap_pembayaran';
    const params = [];

    // Add filters
    const conditions = [];
    if (tahun) {
      conditions.push('rpb.tahun = ?');
      params.push(tahun);
    }
    if (bulan) {
      conditions.push('rpb.bulan LIKE ?');
      params.push(`%${bulan}%`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
      countQuery += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY rpb.dibuat_pada DESC LIMIT ? OFFSET ?';
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
        rekap: rows,
        pagination: {
          current_page: page,
          total_pages: totalPages,
          total_items: total,
          items_per_page: limit
        }
      }
    });
  } catch (error) {
    console.error('Get rekap pembayaran error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete rekap (admin only)
router.delete('/:type/:id', authenticateToken, adminOnly, async (req, res) => {
  try {
    const { type, id } = req.params;
    
    const validTypes = ['pemesanan', 'meeting', 'pembayaran'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid rekap type'
      });
    }

    const tableName = `rekap_${type}`;
    
    // Check if rekap exists
    const [existing] = await db.execute(
      `SELECT id FROM ${tableName} WHERE id = ?`,
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Rekap not found'
      });
    }

    // Delete rekap
    await db.execute(`DELETE FROM ${tableName} WHERE id = ?`, [id]);

    res.json({
      success: true,
      message: 'Rekap deleted successfully'
    });
  } catch (error) {
    console.error('Delete rekap error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
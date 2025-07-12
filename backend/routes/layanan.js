const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticateToken, adminOnly } = require('../middlewares/auth');

const router = express.Router();

// Get all layanan (public)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const kategori = req.query.kategori || '';
    const search = req.query.search || '';
    const unggulan = req.query.unggulan || '';
    const aktif = req.query.aktif !== 'false'; // default true
    const offset = (page - 1) * limit;

    let query = `
      SELECT l.*, a.nama_lengkap as admin_name,
             (SELECT COUNT(*) FROM layanan_media lm WHERE lm.layanan_id = l.id) as media_count
      FROM layanan l
      LEFT JOIN admin a ON l.admin_id = a.id
      WHERE l.aktif = ?
    `;
    let countQuery = 'SELECT COUNT(*) as total FROM layanan WHERE aktif = ?';
    const params = [aktif];

    if (kategori) {
      query += ' AND l.kategori = ?';
      countQuery += ' AND kategori = ?';
      params.push(kategori);
    }

    if (search) {
      query += ' AND (l.nama_layanan LIKE ? OR l.deskripsi LIKE ?)';
      countQuery += ' AND (nama_layanan LIKE ? OR deskripsi LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (unggulan) {
      query += ' AND l.unggulan = ?';
      countQuery += ' AND unggulan = ?';
      params.push(unggulan === 'true');
    }

    query += ' ORDER BY l.unggulan DESC, l.dibuat_pada DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await db.execute(query, params);
    
    // Get count with same filters
    const countParams = [aktif];
    if (kategori) countParams.push(kategori);
    if (search) countParams.push(`%${search}%`, `%${search}%`);
    if (unggulan) countParams.push(unggulan === 'true');
    
    const [countRows] = await db.execute(countQuery, countParams);

    const total = countRows[0].total;
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        layanan: rows,
        pagination: {
          current_page: page,
          total_pages: totalPages,
          total_items: total,
          items_per_page: limit
        }
      }
    });
  } catch (error) {
    console.error('Get layanan error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get single layanan by ID or slug (public)
router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    
    // Check if identifier is numeric (ID) or string (slug)
    const isNumeric = /^\d+$/.test(identifier);
    const field = isNumeric ? 'l.id' : 'l.slug';

    const [rows] = await db.execute(`
      SELECT l.*, a.nama_lengkap as admin_name
      FROM layanan l
      LEFT JOIN admin a ON l.admin_id = a.id
      WHERE ${field} = ?
    `, [identifier]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Layanan not found'
      });
    }

    // Get layanan media
    const [media] = await db.execute(`
      SELECT id, tipe, url_media, keterangan, urutan
      FROM layanan_media
      WHERE layanan_id = ?
      ORDER BY urutan ASC, id ASC
    `, [rows[0].id]);

    res.json({
      success: true,
      data: {
        ...rows[0],
        media
      }
    });
  } catch (error) {
    console.error('Get layanan error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create layanan (admin only)
router.post('/', authenticateToken, adminOnly, [
  body('nama_layanan').trim().isLength({ min: 2 }).withMessage('Nama layanan minimal 2 karakter'),
  body('slug').trim().isLength({ min: 2 }).withMessage('Slug minimal 2 karakter'),
  body('kategori').isIn(['prewedding', 'drone', 'graduation', 'corporate_event', 'documentary']).withMessage('Kategori tidak valid'),
  body('harga_minimal').isNumeric().withMessage('Harga minimal harus berupa angka'),
  body('durasi_pengerjaan').trim().isLength({ min: 1 }).withMessage('Durasi pengerjaan required')
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
      nama_layanan,
      slug,
      kategori,
      deskripsi,
      harga_minimal,
      durasi_pengerjaan,
      unggulan,
      aktif
    } = req.body;

    // Check if slug already exists
    const [existing] = await db.execute(
      'SELECT id FROM layanan WHERE slug = ?',
      [slug]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Slug already exists'
      });
    }

    // Create layanan
    const [result] = await db.execute(`
      INSERT INTO layanan (
        admin_id, nama_layanan, slug, kategori, deskripsi, 
        harga_minimal, durasi_pengerjaan, unggulan, aktif
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      req.user.id,
      nama_layanan,
      slug,
      kategori,
      deskripsi,
      harga_minimal,
      durasi_pengerjaan,
      unggulan || false,
      aktif !== false
    ]);

    // Get created layanan
    const [created] = await db.execute(`
      SELECT l.*, a.nama_lengkap as admin_name
      FROM layanan l
      LEFT JOIN admin a ON l.admin_id = a.id
      WHERE l.id = ?
    `, [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'Layanan created successfully',
      data: created[0]
    });
  } catch (error) {
    console.error('Create layanan error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update layanan (admin only)
router.put('/:id', authenticateToken, adminOnly, [
  body('nama_layanan').optional().trim().isLength({ min: 2 }).withMessage('Nama layanan minimal 2 karakter'),
  body('slug').optional().trim().isLength({ min: 2 }).withMessage('Slug minimal 2 karakter'),
  body('kategori').optional().isIn(['prewedding', 'drone', 'graduation', 'corporate_event', 'documentary']).withMessage('Kategori tidak valid'),
  body('harga_minimal').optional().isNumeric().withMessage('Harga minimal harus berupa angka'),
  body('durasi_pengerjaan').optional().trim().isLength({ min: 1 }).withMessage('Durasi pengerjaan required')
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
      nama_layanan,
      slug,
      kategori,
      deskripsi,
      harga_minimal,
      durasi_pengerjaan,
      unggulan,
      aktif
    } = req.body;

    // Check if layanan exists
    const [existing] = await db.execute(
      'SELECT id FROM layanan WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Layanan not found'
      });
    }

    // Check slug uniqueness if updating slug
    if (slug) {
      const [slugCheck] = await db.execute(
        'SELECT id FROM layanan WHERE slug = ? AND id != ?',
        [slug, id]
      );

      if (slugCheck.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Slug already exists'
        });
      }
    }

    // Build update query
    const updateFields = [];
    const updateValues = [];

    if (nama_layanan) {
      updateFields.push('nama_layanan = ?');
      updateValues.push(nama_layanan);
    }

    if (slug) {
      updateFields.push('slug = ?');
      updateValues.push(slug);
    }

    if (kategori) {
      updateFields.push('kategori = ?');
      updateValues.push(kategori);
    }

    if (deskripsi !== undefined) {
      updateFields.push('deskripsi = ?');
      updateValues.push(deskripsi);
    }

    if (harga_minimal) {
      updateFields.push('harga_minimal = ?');
      updateValues.push(harga_minimal);
    }

    if (durasi_pengerjaan) {
      updateFields.push('durasi_pengerjaan = ?');
      updateValues.push(durasi_pengerjaan);
    }

    if (unggulan !== undefined) {
      updateFields.push('unggulan = ?');
      updateValues.push(unggulan);
    }

    if (aktif !== undefined) {
      updateFields.push('aktif = ?');
      updateValues.push(aktif);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    updateValues.push(id);

    const query = `UPDATE layanan SET ${updateFields.join(', ')} WHERE id = ?`;
    await db.execute(query, updateValues);

    // Get updated layanan
    const [updated] = await db.execute(`
      SELECT l.*, a.nama_lengkap as admin_name
      FROM layanan l
      LEFT JOIN admin a ON l.admin_id = a.id
      WHERE l.id = ?
    `, [id]);

    res.json({
      success: true,
      message: 'Layanan updated successfully',
      data: updated[0]
    });
  } catch (error) {
    console.error('Update layanan error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete layanan (admin only)
router.delete('/:id', authenticateToken, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if layanan exists
    const [existing] = await db.execute(
      'SELECT id FROM layanan WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Layanan not found'
      });
    }

    // Delete layanan (cascade will handle related records)
    await db.execute('DELETE FROM layanan WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Layanan deleted successfully'
    });
  } catch (error) {
    console.error('Delete layanan error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get layanan categories (public)
router.get('/categories/list', async (req, res) => {
  try {
    const categories = [
      { value: 'prewedding', label: 'Prewedding' },
      { value: 'drone', label: 'Drone' },
      { value: 'graduation', label: 'Graduation' },
      { value: 'corporate_event', label: 'Corporate Event' },
      { value: 'documentary', label: 'Documentary' }
    ];

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticateToken, adminOnly } = require('../middlewares/auth');
const { uploadSingle } = require('../middlewares/upload');

const router = express.Router();

// Get all media for a layanan (public)
router.get('/layanan/:layanan_id', async (req, res) => {
  try {
    const { layanan_id } = req.params;
    const tipe = req.query.tipe || '';

    let query = 'SELECT * FROM layanan_media WHERE layanan_id = ?';
    const params = [layanan_id];

    if (tipe) {
      query += ' AND tipe = ?';
      params.push(tipe);
    }

    query += ' ORDER BY urutan ASC, id ASC';

    const [rows] = await db.execute(query, params);

    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Get layanan media error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get single media (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.execute(`
      SELECT lm.*, l.nama_layanan
      FROM layanan_media lm
      LEFT JOIN layanan l ON lm.layanan_id = l.id
      WHERE lm.id = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Media not found'
      });
    }

    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Get media error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create media (admin only)
router.post('/', authenticateToken, adminOnly, uploadSingle('media'), [
  body('layanan_id').isInt({ min: 1 }).withMessage('Layanan ID harus berupa angka'),
  body('tipe').isIn(['gambar', 'video']).withMessage('Tipe harus gambar atau video'),
  body('urutan').optional().isInt({ min: 0 }).withMessage('Urutan harus berupa angka')
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

    const { layanan_id, tipe, keterangan, urutan } = req.body;

    // Check if layanan exists
    const [layanan] = await db.execute(
      'SELECT id FROM layanan WHERE id = ?',
      [layanan_id]
    );

    if (layanan.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Layanan not found'
      });
    }

    // Validate file type matches tipe
    if (req.file) {
      const isImage = req.file.mimetype.startsWith('image/');
      const isVideo = req.file.mimetype.startsWith('video/');

      if ((tipe === 'gambar' && !isImage) || (tipe === 'video' && !isVideo)) {
        return res.status(400).json({
          success: false,
          message: 'File type does not match specified type'
        });
      }
    }

    // Create media
    const [result] = await db.execute(`
      INSERT INTO layanan_media (layanan_id, tipe, url_media, keterangan, urutan)
      VALUES (?, ?, ?, ?, ?)
    `, [
      layanan_id,
      tipe,
      req.file ? req.file.filename : null,
      keterangan || null,
      urutan || 0
    ]);

    // Get created media
    const [created] = await db.execute(`
      SELECT lm.*, l.nama_layanan
      FROM layanan_media lm
      LEFT JOIN layanan l ON lm.layanan_id = l.id
      WHERE lm.id = ?
    `, [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'Media created successfully',
      data: created[0]
    });
  } catch (error) {
    console.error('Create media error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update media (admin only)
router.put('/:id', authenticateToken, adminOnly, uploadSingle('media'), [
  body('tipe').optional().isIn(['gambar', 'video']).withMessage('Tipe harus gambar atau video'),
  body('urutan').optional().isInt({ min: 0 }).withMessage('Urutan harus berupa angka')
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
    const { tipe, keterangan, urutan } = req.body;

    // Check if media exists
    const [existing] = await db.execute(
      'SELECT id, tipe FROM layanan_media WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Media not found'
      });
    }

    // Validate file type matches tipe if both are provided
    if (req.file && tipe) {
      const isImage = req.file.mimetype.startsWith('image/');
      const isVideo = req.file.mimetype.startsWith('video/');

      if ((tipe === 'gambar' && !isImage) || (tipe === 'video' && !isVideo)) {
        return res.status(400).json({
          success: false,
          message: 'File type does not match specified type'
        });
      }
    }

    // Build update query
    const updateFields = [];
    const updateValues = [];

    if (tipe) {
      updateFields.push('tipe = ?');
      updateValues.push(tipe);
    }

    if (req.file) {
      updateFields.push('url_media = ?');
      updateValues.push(req.file.filename);
    }

    if (keterangan !== undefined) {
      updateFields.push('keterangan = ?');
      updateValues.push(keterangan);
    }

    if (urutan !== undefined) {
      updateFields.push('urutan = ?');
      updateValues.push(urutan);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    updateValues.push(id);

    const query = `UPDATE layanan_media SET ${updateFields.join(', ')} WHERE id = ?`;
    await db.execute(query, updateValues);

    // Get updated media
    const [updated] = await db.execute(`
      SELECT lm.*, l.nama_layanan
      FROM layanan_media lm
      LEFT JOIN layanan l ON lm.layanan_id = l.id
      WHERE lm.id = ?
    `, [id]);

    res.json({
      success: true,
      message: 'Media updated successfully',
      data: updated[0]
    });
  } catch (error) {
    console.error('Update media error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete media (admin only)
router.delete('/:id', authenticateToken, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if media exists
    const [existing] = await db.execute(
      'SELECT id FROM layanan_media WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Media not found'
      });
    }

    // Delete media
    await db.execute('DELETE FROM layanan_media WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Media deleted successfully'
    });
  } catch (error) {
    console.error('Delete media error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
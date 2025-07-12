const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticateToken, adminOnly, adminOrOwner } = require('../middlewares/auth');
const { uploadSingle } = require('../middlewares/upload');

const router = express.Router();

// Get all pengguna (admin only)
router.get('/', authenticateToken, adminOnly, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const offset = (page - 1) * limit;

    let query = 'SELECT id, nama_lengkap, email, no_wa, foto_profil, dibuat_pada FROM pengguna';
    let countQuery = 'SELECT COUNT(*) as total FROM pengguna';
    const params = [];

    if (search) {
      query += ' WHERE nama_lengkap LIKE ? OR email LIKE ?';
      countQuery += ' WHERE nama_lengkap LIKE ? OR email LIKE ?';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY dibuat_pada DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await db.execute(query, params);
    const [countRows] = await db.execute(countQuery, search ? [`%${search}%`, `%${search}%`] : []);

    const total = countRows[0].total;
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        pengguna: rows,
        pagination: {
          current_page: page,
          total_pages: totalPages,
          total_items: total,
          items_per_page: limit
        }
      }
    });
  } catch (error) {
    console.error('Get pengguna error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get single pengguna
router.get('/:id', authenticateToken, adminOrOwner, async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.execute(
      'SELECT id, nama_lengkap, email, no_wa, foto_profil, dibuat_pada, diperbarui_pada FROM pengguna WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pengguna not found'
      });
    }

    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Get pengguna error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update pengguna
router.put('/:id', authenticateToken, adminOrOwner, uploadSingle('foto_profil'), [
  body('nama_lengkap').optional().trim().isLength({ min: 2 }).withMessage('Nama lengkap minimal 2 karakter'),
  body('email').optional().isEmail().withMessage('Email tidak valid'),
  body('no_wa').optional().matches(/^\+62\d{9,13}$/).withMessage('Format nomor WA: +62xxxxxxxxxx')
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
    const { nama_lengkap, email, no_wa } = req.body;

    // Check if pengguna exists
    const [existing] = await db.execute(
      'SELECT id FROM pengguna WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pengguna not found'
      });
    }

    // Check email uniqueness if updating email
    if (email) {
      const [emailCheck] = await db.execute(
        'SELECT id FROM pengguna WHERE email = ? AND id != ?',
        [email, id]
      );

      if (emailCheck.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }
    }

    // Build update query
    const updateFields = [];
    const updateValues = [];

    if (nama_lengkap) {
      updateFields.push('nama_lengkap = ?');
      updateValues.push(nama_lengkap);
    }

    if (email) {
      updateFields.push('email = ?');
      updateValues.push(email);
    }

    if (no_wa) {
      updateFields.push('no_wa = ?');
      updateValues.push(no_wa);
    }

    if (req.file) {
      updateFields.push('foto_profil = ?');
      updateValues.push(req.file.filename);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    updateFields.push('diperbarui_pada = NOW()');
    updateValues.push(id);

    const query = `UPDATE pengguna SET ${updateFields.join(', ')} WHERE id = ?`;
    await db.execute(query, updateValues);

    // Get updated pengguna
    const [updated] = await db.execute(
      'SELECT id, nama_lengkap, email, no_wa, foto_profil, dibuat_pada, diperbarui_pada FROM pengguna WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Pengguna updated successfully',
      data: updated[0]
    });
  } catch (error) {
    console.error('Update pengguna error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete pengguna (admin only)
router.delete('/:id', authenticateToken, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if pengguna exists
    const [existing] = await db.execute(
      'SELECT id FROM pengguna WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pengguna not found'
      });
    }

    // Delete pengguna (cascade will handle related records)
    await db.execute('DELETE FROM pengguna WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Pengguna deleted successfully'
    });
  } catch (error) {
    console.error('Delete pengguna error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Change password
router.put('/:id/password', authenticateToken, adminOrOwner, [
  body('current_password').isLength({ min: 1 }).withMessage('Current password required'),
  body('new_password').isLength({ min: 6 }).withMessage('New password minimal 6 karakter'),
  body('confirm_password').custom((value, { req }) => {
    if (value !== req.body.new_password) {
      throw new Error('Password confirmation does not match');
    }
    return true;
  })
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
    const { current_password, new_password } = req.body;

    // Get current password hash
    const [rows] = await db.execute(
      'SELECT password_hash FROM pengguna WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pengguna not found'
      });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(current_password, rows[0].password_hash);
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(new_password, 10);

    // Update password
    await db.execute(
      'UPDATE pengguna SET password_hash = ?, diperbarui_pada = NOW() WHERE id = ?',
      [hashedPassword, id]
    );

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
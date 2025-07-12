const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// Register pengguna
router.post('/register', [
  body('nama_lengkap').trim().isLength({ min: 2 }).withMessage('Nama lengkap minimal 2 karakter'),
  body('email').isEmail().withMessage('Email tidak valid'),
  body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
  body('no_wa').matches(/^\+62\d{9,13}$/).withMessage('Format nomor WA: +62xxxxxxxxxx')
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

    const { nama_lengkap, email, password, no_wa } = req.body;

    // Check if user already exists
    const [existingUser] = await db.execute(
      'SELECT id FROM pengguna WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [result] = await db.execute(
      'INSERT INTO pengguna (nama_lengkap, email, password_hash, no_wa) VALUES (?, ?, ?, ?)',
      [nama_lengkap, email, hashedPassword, no_wa]
    );

    const user = {
      id: result.insertId,
      email,
      role: 'pengguna'
    };

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          nama_lengkap,
          email,
          no_wa,
          role: 'pengguna'
        },
        token
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().withMessage('Email tidak valid'),
  body('password').isLength({ min: 1 }).withMessage('Password required')
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

    const { email, password } = req.body;

    // Check admin first
    const [adminRows] = await db.execute(
      'SELECT id, nama_lengkap, email, password_hash FROM admin WHERE email = ?',
      [email]
    );

    if (adminRows.length > 0) {
      const admin = adminRows[0];
      const isValidPassword = await bcrypt.compare(password, admin.password_hash);

      if (isValidPassword) {
        const user = {
          id: admin.id,
          email: admin.email,
          role: 'admin'
        };

        const token = generateToken(user);

        return res.json({
          success: true,
          message: 'Login successful',
          data: {
            user: {
              id: admin.id,
              nama_lengkap: admin.nama_lengkap,
              email: admin.email,
              role: 'admin'
            },
            token
          }
        });
      }
    }

    // Check pengguna
    const [penggunaRows] = await db.execute(
      'SELECT id, nama_lengkap, email, password_hash, no_wa, foto_profil FROM pengguna WHERE email = ?',
      [email]
    );

    if (penggunaRows.length > 0) {
      const pengguna = penggunaRows[0];
      const isValidPassword = await bcrypt.compare(password, pengguna.password_hash);

      if (isValidPassword) {
        const user = {
          id: pengguna.id,
          email: pengguna.email,
          role: 'pengguna'
        };

        const token = generateToken(user);

        return res.json({
          success: true,
          message: 'Login successful',
          data: {
            user: {
              id: pengguna.id,
              nama_lengkap: pengguna.nama_lengkap,
              email: pengguna.email,
              no_wa: pengguna.no_wa,
              foto_profil: pengguna.foto_profil,
              role: 'pengguna'
            },
            token
          }
        });
      }
    }

    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const { id, role } = req.user;

    if (role === 'admin') {
      const [rows] = await db.execute(
        'SELECT id, nama_lengkap, email, dibuat_pada FROM admin WHERE id = ?',
        [id]
      );

      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Admin not found'
        });
      }

      res.json({
        success: true,
        data: {
          ...rows[0],
          role: 'admin'
        }
      });
    } else {
      const [rows] = await db.execute(
        'SELECT id, nama_lengkap, email, no_wa, foto_profil, dibuat_pada FROM pengguna WHERE id = ?',
        [id]
      );

      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        data: {
          ...rows[0],
          role: 'pengguna'
        }
      });
    }
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Refresh token
router.post('/refresh', authenticateToken, (req, res) => {
  try {
    const newToken = generateToken(req.user);
    
    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        token: newToken
      }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
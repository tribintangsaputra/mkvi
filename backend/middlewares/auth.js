const jwt = require('jsonwebtoken');
const db = require('../config/database');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
};

const userOnly = (req, res, next) => {
  if (req.user.role !== 'pengguna') {
    return res.status(403).json({
      success: false,
      message: 'User access required'
    });
  }
  next();
};

const adminOrOwner = async (req, res, next) => {
  if (req.user.role === 'admin') {
    return next();
  }
  
  // Check if user is accessing their own data
  const resourceUserId = req.params.pengguna_id || req.body.pengguna_id;
  if (req.user.role === 'pengguna' && req.user.id == resourceUserId) {
    return next();
  }
  
  return res.status(403).json({
    success: false,
    message: 'Access denied'
  });
};

module.exports = {
  authenticateToken,
  adminOnly,
  userOnly,
  adminOrOwner
};
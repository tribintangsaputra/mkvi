const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const db = require('./config/database');
const { createDefaultAdmin } = require('./config/defaultAdmin');

// Import routes
const authRoutes = require('./routes/auth');
const penggunaRoutes = require('./routes/pengguna');
const layananRoutes = require('./routes/layanan');
const layananMediaRoutes = require('./routes/layananMedia');
const pemesananRoutes = require('./routes/pemesanan');
const meetingRoutes = require('./routes/meeting');
const pembayaranRoutes = require('./routes/pembayaran');
const rekapRoutes = require('./routes/rekap');
const uploadRoutes = require('./routes/upload');
const documentsRoutes = require('./routes/documents');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pengguna', penggunaRoutes);
app.use('/api/layanan', layananRoutes);
app.use('/api/layanan-media', layananMediaRoutes);
app.use('/api/pemesanan', pemesananRoutes);
app.use('/api/meeting', meetingRoutes);
app.use('/api/pembayaran', pembayaranRoutes);
app.use('/api/rekap', rekapRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/documents', documentsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'MKVI Backend API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;

// Initialize database and start server
const startServer = async () => {
  try {
    // Test database connection
    await db.execute('SELECT 1');
    console.log('✅ Database connected successfully');

    // Create default admin
    await createDefaultAdmin();

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📝 API Documentation: http://localhost:${PORT}/api/health`);
      console.log(`📁 Upload directory: ${uploadsDir}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
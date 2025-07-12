const express = require('express');
const path = require('path');
const fs = require('fs');
const { authenticateToken, adminOnly } = require('../middlewares/auth');
const { uploadSingle, uploadMultiple } = require('../middlewares/upload');

const router = express.Router();

// Upload single file
router.post('/single', authenticateToken, uploadSingle('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    res.json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
        url: `/uploads/${req.file.filename}`
      }
    });
  } catch (error) {
    console.error('Upload single file error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Upload multiple files
router.post('/multiple', authenticateToken, uploadMultiple('files', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const uploadedFiles = req.files.map(file => ({
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path,
      url: `/uploads/${file.filename}`
    }));

    res.json({
      success: true,
      message: 'Files uploaded successfully',
      data: {
        files: uploadedFiles,
        count: uploadedFiles.length
      }
    });
  } catch (error) {
    console.error('Upload multiple files error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Upload profile image
router.post('/profile', authenticateToken, uploadSingle('profile_image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No profile image uploaded'
      });
    }

    // Validate image type
    if (!req.file.mimetype.startsWith('image/')) {
      // Delete uploaded file if not image
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'Only image files are allowed for profile'
      });
    }

    res.json({
      success: true,
      message: 'Profile image uploaded successfully',
      data: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: `/uploads/profiles/${req.file.filename}`
      }
    });
  } catch (error) {
    console.error('Upload profile image error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Upload layanan media
router.post('/layanan-media', authenticateToken, adminOnly, uploadSingle('media'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No media file uploaded'
      });
    }

    const isImage = req.file.mimetype.startsWith('image/');
    const isVideo = req.file.mimetype.startsWith('video/');

    if (!isImage && !isVideo) {
      // Delete uploaded file if not image or video
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'Only image and video files are allowed for layanan media'
      });
    }

    res.json({
      success: true,
      message: 'Layanan media uploaded successfully',
      data: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        type: isImage ? 'gambar' : 'video',
        url: `/uploads/${isImage ? 'images' : 'videos'}/${req.file.filename}`
      }
    });
  } catch (error) {
    console.error('Upload layanan media error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Upload invoice PDF
router.post('/invoice', authenticateToken, adminOnly, uploadSingle('invoice'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No invoice file uploaded'
      });
    }

    // Validate PDF type
    if (req.file.mimetype !== 'application/pdf') {
      // Delete uploaded file if not PDF
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'Only PDF files are allowed for invoice'
      });
    }

    res.json({
      success: true,
      message: 'Invoice uploaded successfully',
      data: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: `/uploads/invoices/${req.file.filename}`
      }
    });
  } catch (error) {
    console.error('Upload invoice error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Upload MoU PDF
router.post('/mou', authenticateToken, adminOnly, uploadSingle('mou'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No MoU file uploaded'
      });
    }

    // Validate PDF type
    if (req.file.mimetype !== 'application/pdf') {
      // Delete uploaded file if not PDF
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'Only PDF files are allowed for MoU'
      });
    }

    res.json({
      success: true,
      message: 'MoU uploaded successfully',
      data: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: `/uploads/mou/${req.file.filename}`
      }
    });
  } catch (error) {
    console.error('Upload MoU error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Upload payment proof
router.post('/payment-proof', authenticateToken, uploadSingle('payment_proof'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No payment proof uploaded'
      });
    }

    // Validate file type (image or PDF)
    const isImage = req.file.mimetype.startsWith('image/');
    const isPDF = req.file.mimetype === 'application/pdf';

    if (!isImage && !isPDF) {
      // Delete uploaded file if not image or PDF
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'Only image and PDF files are allowed for payment proof'
      });
    }

    res.json({
      success: true,
      message: 'Payment proof uploaded successfully',
      data: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: `/uploads/payments/${req.file.filename}`
      }
    });
  } catch (error) {
    console.error('Upload payment proof error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Upload receipt PDF
router.post('/receipt', authenticateToken, adminOnly, uploadSingle('receipt'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No receipt file uploaded'
      });
    }

    // Validate PDF type
    if (req.file.mimetype !== 'application/pdf') {
      // Delete uploaded file if not PDF
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'Only PDF files are allowed for receipt'
      });
    }

    res.json({
      success: true,
      message: 'Receipt uploaded successfully',
      data: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: `/uploads/receipts/${req.file.filename}`
      }
    });
  } catch (error) {
    console.error('Upload receipt error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Download file
router.get('/download/:folder/:filename', authenticateToken, (req, res) => {
  try {
    const { folder, filename } = req.params;
    
    // Validate folder
    const allowedFolders = [
      'images', 'videos', 'invoices', 'mou', 'payments', 
      'receipts', 'reports', 'profiles'
    ];
    
    if (!allowedFolders.includes(folder)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid folder'
      });
    }

    const filePath = path.join(__dirname, '../uploads', folder, filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Set appropriate headers
    const stat = fs.statSync(filePath);
    const ext = path.extname(filename).toLowerCase();
    
    let contentType = 'application/octet-stream';
    if (ext === '.pdf') {
      contentType = 'application/pdf';
    } else if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
      contentType = `image/${ext.substring(1)}`;
    } else if (['.mp4', '.avi', '.mov', '.wmv'].includes(ext)) {
      contentType = `video/${ext.substring(1)}`;
    } else if (['.xlsx', '.xls'].includes(ext)) {
      contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    }

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Stream file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Download file error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete file (admin only)
router.delete('/:folder/:filename', authenticateToken, adminOnly, (req, res) => {
  try {
    const { folder, filename } = req.params;
    
    // Validate folder
    const allowedFolders = [
      'images', 'videos', 'invoices', 'mou', 'payments', 
      'receipts', 'reports', 'profiles'
    ];
    
    if (!allowedFolders.includes(folder)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid folder'
      });
    }

    const filePath = path.join(__dirname, '../uploads', folder, filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Delete file
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get file info
router.get('/info/:folder/:filename', authenticateToken, (req, res) => {
  try {
    const { folder, filename } = req.params;
    
    // Validate folder
    const allowedFolders = [
      'images', 'videos', 'invoices', 'mou', 'payments', 
      'receipts', 'reports', 'profiles'
    ];
    
    if (!allowedFolders.includes(folder)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid folder'
      });
    }

    const filePath = path.join(__dirname, '../uploads', folder, filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    const stat = fs.statSync(filePath);
    const ext = path.extname(filename).toLowerCase();
    
    let fileType = 'other';
    if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
      fileType = 'image';
    } else if (['.mp4', '.avi', '.mov', '.wmv'].includes(ext)) {
      fileType = 'video';
    } else if (ext === '.pdf') {
      fileType = 'pdf';
    } else if (['.xlsx', '.xls'].includes(ext)) {
      fileType = 'excel';
    }

    res.json({
      success: true,
      data: {
        filename,
        folder,
        size: stat.size,
        type: fileType,
        extension: ext,
        created: stat.birthtime,
        modified: stat.mtime,
        url: `/uploads/${folder}/${filename}`
      }
    });
  } catch (error) {
    console.error('Get file info error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
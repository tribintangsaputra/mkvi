const bcrypt = require('bcryptjs');
const db = require('./database');

const createDefaultAdmin = async () => {
  try {
    // Check if admin table exists and has the default admin
    const [rows] = await db.execute(
      'SELECT id FROM admin WHERE email = ?',
      ['binbin@gmail.com']
    );

    if (rows.length === 0) {
      // Create default admin
      const hashedPassword = await bcrypt.hash('binbin', 10);
      
      await db.execute(
        'INSERT INTO admin (nama_lengkap, email, password_hash) VALUES (?, ?, ?)',
        ['binbin', 'binbin@gmail.com', hashedPassword]
      );
      
      console.log('✅ Default admin created successfully');
    } else {
      console.log('✅ Default admin already exists');
    }
  } catch (error) {
    console.error('❌ Error creating default admin:', error);
  }
};

module.exports = { createDefaultAdmin };
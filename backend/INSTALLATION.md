# 🚀 Panduan Instalasi PT. MKVI Admin Panel

## 📋 Prasyarat Sistem

Pastikan sistem Anda memiliki:

### Software Requirements
- **Node.js** v18.0.0 atau lebih baru
- **MySQL** v8.0 atau lebih baru
- **Git** untuk clone repository
- **npm** atau **yarn** package manager

### Hardware Requirements
- **RAM**: Minimal 4GB (Recommended 8GB)
- **Storage**: Minimal 2GB free space
- **CPU**: Dual-core processor atau lebih

## 🔧 Langkah Instalasi

### 1. Clone Repository

```bash
# Clone repository
git clone https://github.com/your-username/mkvi-admin-panel.git
cd mkvi-admin-panel

# Atau download ZIP dan extract
```

### 2. Setup Database MySQL

#### Opsi A: Menggunakan MySQL Command Line
```bash
# Login ke MySQL
mysql -u root -p

# Buat database
CREATE DATABASE mkvi_db;

# Keluar dari MySQL
exit

# Import schema database
mysql -u root -p mkvi_db < supabase/migrations/20250710211132_sweet_wildflower.sql
```

#### Opsi B: Menggunakan phpMyAdmin
1. Buka phpMyAdmin di browser
2. Klik "New" untuk buat database baru
3. Nama database: `mkvi_db`
4. Klik "Import" tab
5. Pilih file `supabase/migrations/20250710211132_sweet_wildflower.sql`
6. Klik "Go" untuk import

#### Opsi C: Menggunakan MySQL Workbench
1. Buka MySQL Workbench
2. Connect ke MySQL server
3. Klik "Create Schema" icon
4. Nama schema: `mkvi_db`
5. File → Open SQL Script → Pilih file migration
6. Execute script

### 3. Setup Backend

```bash
# Install dependencies backend
npm install

# Copy environment file
cp .env.example .env

# Edit file .env dengan text editor favorit
nano .env
# atau
code .env
```

#### Konfigurasi .env Backend
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=mkvi_db
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# File Upload Configuration
MAX_FILE_SIZE=10485760

# Email Configuration (Optional - untuk fitur email)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password

# Calendly Integration (Optional)
CALENDLY_ACCESS_TOKEN=your_calendly_token
```

#### Generate JWT Secret
```bash
# Generate random JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Setup Frontend

```bash
# Masuk ke folder frontend
cd frontend

# Install dependencies frontend
npm install

# Copy environment file
cp .env.example .env

# Edit file .env
nano .env
```

#### Konfigurasi .env Frontend
```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Application Configuration
VITE_APP_NAME=MKVI Admin Panel
VITE_APP_VERSION=1.0.0

# File Upload Configuration
VITE_MAX_FILE_SIZE=10485760
VITE_ALLOWED_FILE_TYPES=image/*,video/*,application/pdf

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_EMAIL_NOTIFICATIONS=true
VITE_ENABLE_DOCUMENT_GENERATION=true
```

### 5. Buat Folder Upload

```bash
# Kembali ke root directory
cd ..

# Buat folder upload dan subdirectories
mkdir -p uploads/{images,videos,profiles,payments,documents,invoices,mou,receipts,reports}

# Set permissions (Linux/Mac)
chmod -R 755 uploads/

# Untuk Windows, pastikan folder dapat ditulis
```

### 6. Test Database Connection

```bash
# Test koneksi database
node -e "
const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'your_password',
  database: 'mkvi_db'
});
connection.connect((err) => {
  if (err) {
    console.log('❌ Database connection failed:', err.message);
  } else {
    console.log('✅ Database connected successfully');
  }
  connection.end();
});
"
```

### 7. Start Development Servers

#### Terminal 1 - Backend
```bash
# Start backend development server
npm run dev

# Output yang diharapkan:
# ✅ Database connected successfully
# ✅ Default admin created successfully
# 🚀 Server is running on port 5000
# 📝 API Documentation: http://localhost:5000/api/health
```

#### Terminal 2 - Frontend
```bash
# Masuk ke folder frontend
cd frontend

# Start frontend development server
npm run dev

# Output yang diharapkan:
# VITE v4.5.0  ready in 500 ms
# ➜  Local:   http://localhost:3000/
# ➜  Network: use --host to expose
```

### 8. Verifikasi Instalasi

#### Test Backend API
```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Expected response:
# {"status":"OK","message":"MKVI Backend API is running","timestamp":"..."}
```

#### Test Frontend
1. Buka browser ke `http://localhost:3000`
2. Anda akan melihat halaman login
3. Login dengan kredensial default:
   - **Email**: `binbin@gmail.com`
   - **Password**: `binbin`

#### Test Database
```bash
# Login ke MySQL dan check tables
mysql -u root -p mkvi_db

# Di MySQL prompt:
SHOW TABLES;

# Expected output:
# +-------------------+
# | Tables_in_mkvi_db |
# +-------------------+
# | admin             |
# | layanan           |
# | layanan_media     |
# | meeting           |
# | pembayaran        |
# | pemesanan         |
# | pengguna          |
# | rekap_meeting     |
# | rekap_pembayaran  |
# | rekap_pemesanan   |
# +-------------------+

# Check default admin
SELECT * FROM admin;
```

## 🔧 Troubleshooting

### Problem: Database Connection Failed

#### Error: "Access denied for user 'root'@'localhost'"
```bash
# Reset MySQL root password
sudo mysql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'new_password';
FLUSH PRIVILEGES;
exit
```

#### Error: "Database 'mkvi_db' doesn't exist"
```bash
# Create database manually
mysql -u root -p
CREATE DATABASE mkvi_db;
exit

# Import schema
mysql -u root -p mkvi_db < supabase/migrations/20250710211132_sweet_wildflower.sql
```

### Problem: Port Already in Use

#### Backend Port 5000 in use
```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 PID_NUMBER

# Or change port in .env
PORT=5001
```

#### Frontend Port 3000 in use
```bash
# Vite will automatically suggest next available port
# Or specify custom port
npm run dev -- --port 3001
```

### Problem: File Upload Errors

#### Permission Denied
```bash
# Linux/Mac
sudo chmod -R 755 uploads/
sudo chown -R $USER:$USER uploads/

# Windows - Run as Administrator
icacls uploads /grant Everyone:F /T
```

#### Upload Directory Not Found
```bash
# Recreate upload directories
mkdir -p uploads/{images,videos,profiles,payments,documents,invoices,mou,receipts,reports}
```

### Problem: Frontend Build Errors

#### Node Modules Issues
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

#### Vite Cache Issues
```bash
cd frontend
rm -rf .vite
npm run dev
```

### Problem: Email Service Not Working

#### Gmail App Password Setup
1. Enable 2-Factor Authentication di Gmail
2. Go to Google Account Settings
3. Security → 2-Step Verification → App passwords
4. Generate app password untuk "Mail"
5. Use generated password di SMTP_PASS

#### Test Email Configuration
```bash
# Test email dengan nodemailer
node -e "
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransporter({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'your_email@gmail.com',
    pass: 'your_app_password'
  }
});
transporter.verify((error, success) => {
  if (error) {
    console.log('❌ Email config error:', error);
  } else {
    console.log('✅ Email server ready');
  }
});
"
```

## 🚀 Production Deployment

### 1. Build untuk Production

```bash
# Build frontend
cd frontend
npm run build

# Build akan tersimpan di folder 'dist'
```

### 2. Environment Variables Production

#### Backend .env Production
```env
NODE_ENV=production
DB_HOST=your_production_db_host
DB_USER=your_production_db_user
DB_PASSWORD=your_production_db_password
JWT_SECRET=your_super_secure_jwt_secret
FRONTEND_URL=https://your-domain.com
```

#### Frontend .env Production
```env
VITE_API_URL=https://your-api-domain.com/api
```

### 3. Process Manager (PM2)

```bash
# Install PM2 globally
npm install -g pm2

# Start backend dengan PM2
pm2 start server.js --name "mkvi-backend"

# Setup auto-restart on server reboot
pm2 startup
pm2 save

# Monitor processes
pm2 status
pm2 logs mkvi-backend
```

### 4. Nginx Configuration (Optional)

```nginx
# /etc/nginx/sites-available/mkvi
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files
    location /uploads {
        alias /path/to/uploads;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## 📊 Monitoring & Maintenance

### 1. Log Files

```bash
# Backend logs
pm2 logs mkvi-backend

# MySQL logs
sudo tail -f /var/log/mysql/error.log

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 2. Database Backup

```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u root -p mkvi_db > /backup/mkvi_db_$DATE.sql

# Keep only last 7 days
find /backup -name "mkvi_db_*.sql" -mtime +7 -delete
```

### 3. Health Checks

```bash
# API health check
curl -f http://localhost:5000/api/health || echo "API Down"

# Database health check
mysql -u root -p -e "SELECT 1" mkvi_db || echo "Database Down"

# Disk space check
df -h | grep -E "(uploads|/var/log)"
```

## 🆘 Getting Help

Jika mengalami masalah:

1. **Check Logs**: Selalu check log files untuk error messages
2. **Restart Services**: Coba restart MySQL, backend, dan frontend
3. **Clear Cache**: Clear browser cache dan node_modules
4. **Check Permissions**: Pastikan file permissions correct
5. **Verify Config**: Double-check semua environment variables

### Contact Support
- **Email**: support@mkvi.com
- **WhatsApp**: +62xxxxxxxxxx
- **GitHub Issues**: [Repository Issues](https://github.com/your-repo/issues)

---

**Selamat! 🎉 PT. MKVI Admin Panel sudah siap digunakan!**
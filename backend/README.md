# PT. MKVI - Sistem Manajemen Admin Panel

## 📋 Deskripsi Proyek

PT. MKVI adalah sistem manajemen lengkap untuk bisnis fotografi dan pembuatan website. Sistem ini menyediakan panel admin untuk mengelola pengguna, layanan, pemesanan, meeting, pembayaran, dan generate dokumen PDF seperti invoice, MoU, dan kwitansi.

## 🏗️ Arsitektur Sistem

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │    Database     │
│   (React)       │◄──►│   (Node.js)     │◄──►│    (MySQL)      │
│   - Admin Panel │    │   - REST API    │    │   - Data Store  │
│   - Dashboard   │    │   - Auth        │    │   - Relations   │
│   - CRUD Forms  │    │   - File Upload │    │   - Indexes     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Fitur Utama

### 1. **Manajemen Pengguna**
- ✅ CRUD lengkap (Create, Read, Update, Delete)
- ✅ Pencarian dan filter
- ✅ Ubah password
- ✅ Upload foto profil
- ✅ Pagination

### 2. **Manajemen Layanan**
- ✅ CRUD layanan fotografi
- ✅ Kategori layanan (Prewedding, Drone, Graduation, dll)
- ✅ Upload media (gambar/video)
- ✅ Harga dan durasi pengerjaan

### 3. **Manajemen Pemesanan**
- ✅ CRUD pemesanan lengkap
- ✅ Status tracking (Menunggu Validasi, Tervalidasi, Dibatalkan)
- ✅ Generate kode tracking unik
- ✅ **Download Invoice PDF**
- ✅ Email notifikasi otomatis

### 4. **Manajemen Meeting**
- ✅ CRUD meeting dengan client
- ✅ Integrasi Calendly untuk penjadwalan
- ✅ **Download MoU PDF**
- ✅ Status meeting (Dijadwalkan, Selesai, Dibatalkan)

### 5. **Manajemen Pembayaran**
- ✅ CRUD pembayaran lengkap
- ✅ Jenis pembayaran (DP 25%, Pelunasan 75%, Full 100%)
- ✅ Upload bukti pembayaran
- ✅ Verifikasi pembayaran admin
- ✅ **Download Kwitansi PDF**

### 6. **Generate Dokumen PDF**
- 📄 **Invoice PDF** - Tagihan pembayaran
- 📄 **MoU PDF** - Surat perjanjian kerja
- 📄 **Kwitansi PDF** - Bukti pembayaran resmi

### 7. **Dashboard & Analytics**
- 📊 Statistik real-time
- 📈 Grafik performa bisnis
- 📋 Rekap data Excel
- 🔔 Notifikasi sistem

## 🛠️ Teknologi yang Digunakan

### Frontend
- **React 18** - UI Framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animasi
- **React Query** - State management
- **React Router** - Routing
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MySQL** - Database
- **JWT** - Authentication
- **Multer** - File upload
- **Nodemailer** - Email service
- **XLSX** - Excel generation

### Security & Utils
- **bcryptjs** - Password hashing
- **Helmet** - Security headers
- **CORS** - Cross-origin requests
- **Rate limiting** - API protection
- **Moment.js** - Date handling

## 📦 Instalasi dan Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd mkvi-admin-panel
```

### 2. Setup Backend
```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Edit .env file dengan konfigurasi Anda:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=mkvi_db
DB_PORT=3306

JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

FRONTEND_URL=http://localhost:3000

# Email configuration (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Start backend server
npm run dev
```

### 3. Setup Database
```bash
# Import database schema
mysql -u root -p mkvi_db < supabase/migrations/20250710211132_sweet_wildflower.sql

# Atau jalankan script SQL di MySQL Workbench/phpMyAdmin
```

### 4. Setup Frontend
```bash
cd frontend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Edit .env file:
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=MKVI Admin Panel

# Start frontend development server
npm run dev
```

### 5. Akses Aplikasi
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Login Admin**: 
  - Email: `binbin@gmail.com`
  - Password: `binbin`

## 🔐 Autentikasi dan Otorisasi

### Login Admin
```javascript
// Login endpoint
POST /api/auth/login
{
  "email": "binbin@gmail.com",
  "password": "binbin"
}

// Response
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "nama_lengkap": "binbin",
      "email": "binbin@gmail.com",
      "role": "admin"
    },
    "token": "jwt_token_here"
  }
}
```

### Middleware Autentikasi
- `authenticateToken` - Verifikasi JWT token
- `adminOnly` - Hanya admin yang bisa akses
- `adminOrOwner` - Admin atau pemilik data

## 📋 Panduan Penggunaan Admin Panel

### 1. **Dashboard**
- Lihat statistik real-time
- Monitor aktivitas terbaru
- Akses cepat ke fitur utama

### 2. **Manajemen Pengguna**

#### Tambah Pengguna Baru
1. Klik tombol "Tambah Pengguna"
2. Isi form:
   - Nama Lengkap
   - Email (unik)
   - No. WhatsApp (+62xxxxxxxxxx)
   - Password (min 6 karakter)
3. Klik "Simpan"

#### Edit Pengguna
1. Klik icon "Edit" pada pengguna
2. Update data yang diperlukan
3. Klik "Simpan"

#### Ubah Password
1. Klik icon "Lock" pada pengguna
2. Masukkan password lama dan baru
3. Konfirmasi password baru
4. Klik "Ubah Password"

### 3. **Manajemen Pemesanan**

#### Tambah Pemesanan
1. Klik "Tambah Pemesanan"
2. Pilih pengguna dan layanan
3. Isi detail acara:
   - Nama acara
   - Tanggal pelaksanaan
   - Jam mulai
   - Lokasi acara
   - Deskripsi kebutuhan
4. Set total tagihan
5. Klik "Simpan"

#### Validasi Pemesanan
1. Klik icon "CheckCircle" untuk validasi
2. Atau icon "XCircle" untuk batalkan
3. Status akan berubah otomatis

#### **Download Invoice PDF**
1. Buka detail pemesanan
2. Scroll ke bagian "Manajemen Dokumen"
3. Klik "Generate" pada Invoice
4. PDF akan otomatis ter-download

### 4. **Manajemen Meeting**

#### Jadwalkan Meeting
1. Klik "Jadwalkan Meeting"
2. Pilih pemesanan yang sudah tervalidasi
3. Set platform meeting (Google Meet)
4. Tambahkan link Calendly (opsional)
5. Klik "Jadwalkan Meeting"

#### **Download MoU PDF**
1. Buka detail meeting
2. Scroll ke bagian "Manajemen Dokumen"
3. Klik "Generate" pada MoU
4. PDF akan otomatis ter-download

### 5. **Manajemen Pembayaran**

#### Tambah Pembayaran
1. Klik "Tambah Pembayaran"
2. Pilih pemesanan
3. Pilih jenis pembayaran:
   - DP (25%)
   - Pelunasan (75%)
   - Full (100%)
4. Upload bukti pembayaran
5. Klik "Simpan"

#### Verifikasi Pembayaran
1. Klik icon "CheckCircle" untuk verifikasi
2. Atau icon "XCircle" untuk tolak
3. Status akan berubah ke "Lunas" atau "Gagal"

#### **Download Kwitansi PDF**
1. Buka detail pembayaran
2. Scroll ke bagian "Manajemen Dokumen"
3. Klik "Generate" pada Kwitansi
4. PDF akan otomatis ter-download

## 📄 Sistem Generate PDF

### 1. **Invoice PDF**
- **Trigger**: Setelah pemesanan tervalidasi
- **Konten**: Detail pemesanan, tagihan, info pembayaran
- **Template**: `/templates/invoice.html`
- **Endpoint**: `POST /api/documents/invoice/:pemesanan_id`

### 2. **MoU PDF**
- **Trigger**: Setelah meeting dijadwalkan
- **Konten**: Surat perjanjian, detail layanan, syarat & ketentuan
- **Template**: `/templates/mou.html`
- **Endpoint**: `POST /api/documents/mou/:meeting_id`

### 3. **Kwitansi PDF**
- **Trigger**: Setelah pembayaran diverifikasi
- **Konten**: Bukti pembayaran resmi, detail transaksi
- **Template**: `/templates/kwitansi.html`
- **Endpoint**: `POST /api/documents/kwitansi/:pembayaran_id`

### Cara Kerja Generate PDF
```javascript
// 1. Admin klik "Generate" di UI
// 2. Frontend call API endpoint
// 3. Backend ambil data dari database
// 4. Generate HTML dari template
// 5. Convert HTML ke PDF (future: puppeteer)
// 6. Save PDF ke /uploads/documents/
// 7. Return download URL
// 8. Frontend auto-download PDF
```

## 🔄 Alur Bisnis Lengkap

### 1. **Registrasi Pengguna**
```
Pengguna Register → Email Verifikasi → Akun Aktif
```

### 2. **Proses Pemesanan**
```
Pemesanan Dibuat → Menunggu Validasi → Admin Validasi → Tervalidasi
                                    ↓
                              Generate Invoice PDF
```

### 3. **Penjadwalan Meeting**
```
Pemesanan Tervalidasi → Admin Jadwalkan Meeting → Generate MoU PDF
                                    ↓
                            Client Pilih Jadwal (Calendly)
```

### 4. **Proses Pembayaran**
```
Invoice Diterima → Client Upload Bukti → Admin Verifikasi → Generate Kwitansi PDF
```

### 5. **Penyelesaian Proyek**
```
Pembayaran Lunas → Meeting Selesai → Proyek Dimulai → Selesai
```

## 📊 API Endpoints

### Authentication
```
POST   /api/auth/login          # Login admin/user
POST   /api/auth/register       # Register user
GET    /api/auth/me            # Get current user
POST   /api/auth/refresh       # Refresh token
```

### Pengguna Management
```
GET    /api/pengguna           # Get all users
GET    /api/pengguna/:id       # Get user by ID
POST   /api/pengguna           # Create user (via register)
PUT    /api/pengguna/:id       # Update user
DELETE /api/pengguna/:id       # Delete user
PUT    /api/pengguna/:id/password # Change password
```

### Pemesanan Management
```
GET    /api/pemesanan          # Get all orders
GET    /api/pemesanan/:id      # Get order by ID
POST   /api/pemesanan          # Create order
PUT    /api/pemesanan/:id      # Update order
DELETE /api/pemesanan/:id      # Delete order
PUT    /api/pemesanan/:id/status # Update order status
GET    /api/pemesanan/track/:code # Track order
```

### Meeting Management
```
GET    /api/meeting            # Get all meetings
GET    /api/meeting/:id        # Get meeting by ID
POST   /api/meeting            # Create meeting
PUT    /api/meeting/:id        # Update meeting
DELETE /api/meeting/:id        # Delete meeting
PUT    /api/meeting/:id/status # Update meeting status
```

### Pembayaran Management
```
GET    /api/pembayaran         # Get all payments
GET    /api/pembayaran/:id     # Get payment by ID
POST   /api/pembayaran         # Create payment
PUT    /api/pembayaran/:id     # Update payment
DELETE /api/pembayaran/:id     # Delete payment
PUT    /api/pembayaran/:id/status # Update payment status
```

### Document Generation
```
POST   /api/documents/invoice/:pemesanan_id    # Generate Invoice PDF
POST   /api/documents/mou/:meeting_id          # Generate MoU PDF
POST   /api/documents/kwitansi/:pembayaran_id  # Generate Kwitansi PDF
GET    /api/documents/:type/:id                # Get document info
GET    /api/documents/order/:pemesanan_id      # Get all order documents
```

### File Upload
```
POST   /api/upload/single         # Upload single file
POST   /api/upload/multiple       # Upload multiple files
POST   /api/upload/profile        # Upload profile image
POST   /api/upload/payment-proof  # Upload payment proof
GET    /api/upload/download/:folder/:filename # Download file
```

## 🗂️ Struktur Database

### Tabel Utama
- `admin` - Data administrator
- `pengguna` - Data pengguna/client
- `layanan` - Layanan yang ditawarkan
- `layanan_media` - Media layanan (gambar/video)
- `pemesanan` - Data pemesanan
- `meeting` - Data meeting dengan client
- `pembayaran` - Data pembayaran
- `rekap_*` - Tabel rekap untuk laporan

### Relasi Database
```
admin (1) ──── (N) layanan
admin (1) ──── (N) meeting
admin (1) ──── (N) pembayaran

pengguna (1) ──── (N) pemesanan
pengguna (1) ──── (N) meeting
pengguna (1) ──── (N) pembayaran

layanan (1) ──── (N) layanan_media
layanan (1) ──── (N) pemesanan

pemesanan (1) ──── (1) meeting
pemesanan (1) ──── (N) pembayaran
```

## 📁 Struktur File Upload

```
uploads/
├── images/          # Gambar layanan
├── videos/          # Video layanan
├── profiles/        # Foto profil pengguna
├── payments/        # Bukti pembayaran
├── documents/       # Generated PDF (Invoice, MoU, Kwitansi)
├── invoices/        # Invoice PDF
├── mou/            # MoU PDF
├── receipts/       # Kwitansi PDF
└── reports/        # Laporan Excel
```

## 🔧 Troubleshooting

### 1. **Database Connection Error**
```bash
# Pastikan MySQL running
sudo systemctl start mysql

# Check connection
mysql -u root -p

# Import database schema ulang
mysql -u root -p mkvi_db < supabase/migrations/20250710211132_sweet_wildflower.sql
```

### 2. **File Upload Error**
```bash
# Pastikan folder uploads ada dan writable
mkdir -p uploads/{images,videos,profiles,payments,documents,invoices,mou,receipts,reports}
chmod 755 uploads/
```

### 3. **PDF Generation Error**
```bash
# Install dependencies untuk PDF generation (future)
npm install puppeteer

# Atau gunakan alternatif lain seperti jsPDF
npm install jspdf html2canvas
```

### 4. **Email Service Error**
```bash
# Setup Gmail App Password
# 1. Enable 2FA di Gmail
# 2. Generate App Password
# 3. Update SMTP_PASS di .env
```

## 🚀 Deployment

### 1. **Production Build**
```bash
# Backend
npm run start

# Frontend
cd frontend
npm run build
npm run preview
```

### 2. **Environment Variables Production**
```bash
# Backend .env
NODE_ENV=production
DB_HOST=your_production_db_host
JWT_SECRET=your_strong_jwt_secret

# Frontend .env
VITE_API_URL=https://your-api-domain.com/api
```

### 3. **Server Setup**
```bash
# Install PM2 untuk process management
npm install -g pm2

# Start dengan PM2
pm2 start server.js --name "mkvi-backend"
pm2 startup
pm2 save
```

## 📈 Monitoring & Maintenance

### 1. **Log Monitoring**
```bash
# Backend logs
pm2 logs mkvi-backend

# Database logs
sudo tail -f /var/log/mysql/error.log
```

### 2. **Backup Database**
```bash
# Daily backup script
mysqldump -u root -p mkvi_db > backup_$(date +%Y%m%d).sql
```

### 3. **Performance Monitoring**
- Monitor API response time
- Check database query performance
- Monitor file upload sizes
- Track user activity

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📞 Support

Untuk bantuan teknis atau pertanyaan:
- Email: support@mkvi.com
- WhatsApp: +62xxxxxxxxxx
- Documentation: [Link to docs]

## 📝 License

Copyright © 2025 PT. MKVI. All rights reserved.

---

**Dibuat dengan ❤️ oleh Tim PT. MKVI**
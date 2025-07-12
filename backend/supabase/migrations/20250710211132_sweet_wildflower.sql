-- PT. MKVI Database Schema
CREATE DATABASE IF NOT EXISTS mkvi_db;
USE mkvi_db;

-- Table: admin
CREATE TABLE IF NOT EXISTS admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_lengkap VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    diperbarui_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: pengguna
CREATE TABLE IF NOT EXISTS pengguna (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_lengkap VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    no_wa VARCHAR(20) COMMENT 'Format: +62xxxxxxxxxx',
    foto_profil VARCHAR(255),
    dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    diperbarui_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: layanan
CREATE TABLE IF NOT EXISTS layanan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT NOT NULL,
    nama_layanan VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    kategori ENUM('prewedding', 'drone', 'graduation', 'corporate_event', 'documentary') NOT NULL,
    deskripsi TEXT,
    harga_minimal DECIMAL(15,2),
    durasi_pengerjaan VARCHAR(100) COMMENT 'Contoh: 3-5 hari',
    unggulan BOOLEAN DEFAULT FALSE,
    aktif BOOLEAN DEFAULT TRUE,
    dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admin(id) ON DELETE CASCADE,
    INDEX idx_admin_id (admin_id),
    INDEX idx_kategori (kategori)
);

-- Table: layanan_media
CREATE TABLE IF NOT EXISTS layanan_media (
    id INT AUTO_INCREMENT PRIMARY KEY,
    layanan_id INT NOT NULL,
    tipe ENUM('gambar', 'video') NOT NULL,
    url_media VARCHAR(255),
    keterangan TEXT,
    urutan INT,
    dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (layanan_id) REFERENCES layanan(id) ON DELETE CASCADE,
    INDEX idx_layanan_id (layanan_id)
);

-- Table: pemesanan
CREATE TABLE IF NOT EXISTS pemesanan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pengguna_id INT NOT NULL,
    layanan_id INT NOT NULL,
    kode_pemesanan VARCHAR(50) UNIQUE NOT NULL,
    kode_tracking VARCHAR(50) UNIQUE COMMENT 'Contoh: MKVI_0123 untuk pelacakan progres',
    status ENUM('menunggu_validasi_admin', 'tervalidasi', 'dibatalkan') DEFAULT 'menunggu_validasi_admin',
    catatan_pengguna TEXT,
    path_invoice_pdf VARCHAR(255) COMMENT 'Link file PDF invoice',
    total_tagihan DECIMAL(15,2) COMMENT 'Total harga layanan penuh (100%)',
    nama_acara VARCHAR(255) COMMENT 'Contoh: Pernikahan Andi & Rina',
    tanggal_pelaksanaan DATE,
    tanggal_selesai_pelaksanaan DATE,
    jam_mulai TIME,
    lokasi_acara TEXT,
    deskripsi_kebutuhan TEXT,
    dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pengguna_id) REFERENCES pengguna(id) ON DELETE CASCADE,
    FOREIGN KEY (layanan_id) REFERENCES layanan(id) ON DELETE CASCADE,
    INDEX idx_pengguna_id (pengguna_id),
    INDEX idx_layanan_id (layanan_id),
    INDEX idx_kode_tracking (kode_tracking)
);

-- Table: meeting
CREATE TABLE IF NOT EXISTS meeting (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pemesanan_id INT NOT NULL,
    admin_id INT NOT NULL,
    pengguna_id INT NOT NULL,
    platform ENUM('google_meet') DEFAULT 'google_meet' COMMENT 'Media meeting aktual (jadwal tetap via Calendly)',
    calendly_link VARCHAR(255) COMMENT 'Link publik Calendly untuk memilih jadwal',
    booking_response_link VARCHAR(255) COMMENT 'Link hasil submit client (berisi waktu & form yang diisi)',
    nama_client VARCHAR(255) COMMENT 'Nama lengkap yang diisi client',
    email_client VARCHAR(255) COMMENT 'Email yang diisi client',
    no_wa_client VARCHAR(20) COMMENT 'Nomor WhatsApp yang diisi client',
    pekerjaan_client VARCHAR(255) COMMENT 'Pekerjaan saat ini yang diisi client',
    waktu_mulai TIMESTAMP COMMENT 'Waktu mulai meeting',
    waktu_selesai TIMESTAMP COMMENT 'Waktu selesai meeting',
    path_mou_pdf VARCHAR(255) COMMENT 'Link file PDF MoU (surat perjanjian)',
    status ENUM('dijadwalkan', 'selesai', 'dibatalkan') DEFAULT 'dijadwalkan',
    catatan TEXT,
    email_terkirim BOOLEAN DEFAULT FALSE,
    dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pemesanan_id) REFERENCES pemesanan(id) ON DELETE CASCADE,
    FOREIGN KEY (admin_id) REFERENCES admin(id) ON DELETE CASCADE,
    FOREIGN KEY (pengguna_id) REFERENCES pengguna(id) ON DELETE CASCADE,
    INDEX idx_admin_id (admin_id),
    INDEX idx_pemesanan_id (pemesanan_id)
);

-- Table: pembayaran
CREATE TABLE IF NOT EXISTS pembayaran (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pemesanan_id INT NOT NULL,
    pengguna_id INT NOT NULL,
    admin_id INT NOT NULL,
    jenis_pembayaran ENUM('dp', 'pelunasan', 'full') NOT NULL COMMENT 'dp = 25%, pelunasan = 75%, full = 100% langsung',
    urutan INT COMMENT '1 untuk DP, 2 untuk pelunasan/full',
    sisa_tagihan DECIMAL(15,2) COMMENT 'Sisa yang harus dibayar oleh pengguna',
    total_biaya DECIMAL(15,2) COMMENT 'Nominal dibayarkan untuk jenis ini',
    persentase_bayar INT COMMENT 'Misal: 25, 75, atau 100',
    metode ENUM('transfer melalui BCA DENGAN NO REKENING 1234567890') NOT NULL,
    status ENUM('pending', 'lunas', 'cicilan', 'gagal') DEFAULT 'pending',
    diverifikasi BOOLEAN DEFAULT FALSE COMMENT 'Telah divalidasi admin',
    path_kwitansi_pdf VARCHAR(255) COMMENT 'Link file PDF kwitansi resmi',
    url_bukti_pembayaran VARCHAR(255) COMMENT 'Link bukti transfer JPG/PDF',
    tanggal_pembayaran TIMESTAMP,
    dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pemesanan_id) REFERENCES pemesanan(id) ON DELETE CASCADE,
    FOREIGN KEY (pengguna_id) REFERENCES pengguna(id) ON DELETE CASCADE,
    FOREIGN KEY (admin_id) REFERENCES admin(id) ON DELETE CASCADE,
    INDEX idx_admin_id (admin_id),
    INDEX idx_pemesanan_id (pemesanan_id)
);

-- Table: rekap_pemesanan
CREATE TABLE IF NOT EXISTS rekap_pemesanan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT NOT NULL,
    tanggal DATE,
    bulan VARCHAR(20),
    tahun INT,
    total INT,
    tervalidasi INT,
    dibatalkan INT,
    dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admin(id) ON DELETE CASCADE
);

-- Table: rekap_meeting
CREATE TABLE IF NOT EXISTS rekap_meeting (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT NOT NULL,
    tanggal DATE,
    bulan VARCHAR(20),
    tahun INT,
    total INT,
    selesai INT,
    dibatalkan INT,
    dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admin(id) ON DELETE CASCADE
);

-- Table: rekap_pembayaran
CREATE TABLE IF NOT EXISTS rekap_pembayaran (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT NOT NULL,
    tanggal DATE,
    bulan VARCHAR(20),
    tahun INT,
    total INT,
    lunas INT,
    gagal INT,
    total_nominal DECIMAL(15,2),
    dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admin(id) ON DELETE CASCADE
);
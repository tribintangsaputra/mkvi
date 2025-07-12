# 📚 API Documentation - PT. MKVI Admin Panel

## 🌐 Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## 🔐 Authentication

Semua endpoint yang memerlukan autentikasi harus menyertakan JWT token di header:

```http
Authorization: Bearer <jwt_token>
```

### Login Response Format
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "nama_lengkap": "Admin Name",
      "email": "admin@mkvi.com",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## 📋 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data here
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

### Pagination Response
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "current_page": 1,
      "total_pages": 10,
      "total_items": 100,
      "items_per_page": 10
    }
  }
}
```

---

## 🔑 Authentication Endpoints

### POST /auth/login
Login admin atau pengguna.

**Request Body:**
```json
{
  "email": "admin@mkvi.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "nama_lengkap": "Admin Name",
      "email": "admin@mkvi.com",
      "role": "admin"
    },
    "token": "jwt_token_here"
  }
}
```

### POST /auth/register
Register pengguna baru.

**Request Body:**
```json
{
  "nama_lengkap": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "no_wa": "+6281234567890"
}
```

### GET /auth/me
Get informasi user yang sedang login.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "nama_lengkap": "Admin Name",
    "email": "admin@mkvi.com",
    "role": "admin",
    "dibuat_pada": "2025-01-01T00:00:00.000Z"
  }
}
```

### POST /auth/refresh
Refresh JWT token.

**Headers:** `Authorization: Bearer <token>`

---

## 👥 Pengguna Management

### GET /pengguna
Get daftar semua pengguna (Admin only).

**Headers:** `Authorization: Bearer <admin_token>`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by name or email

**Example:**
```http
GET /api/pengguna?page=1&limit=10&search=john
```

**Response:**
```json
{
  "success": true,
  "data": {
    "pengguna": [
      {
        "id": 1,
        "nama_lengkap": "John Doe",
        "email": "john@example.com",
        "no_wa": "+6281234567890",
        "foto_profil": "profile_123.jpg",
        "dibuat_pada": "2025-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 5,
      "total_items": 50,
      "items_per_page": 10
    }
  }
}
```

### GET /pengguna/:id
Get pengguna by ID.

**Headers:** `Authorization: Bearer <token>`

### PUT /pengguna/:id
Update pengguna.

**Headers:** `Authorization: Bearer <token>`
**Content-Type:** `multipart/form-data`

**Form Data:**
- `nama_lengkap` (optional): String
- `email` (optional): String
- `no_wa` (optional): String
- `foto_profil` (optional): File

### DELETE /pengguna/:id
Delete pengguna (Admin only).

### PUT /pengguna/:id/password
Change password pengguna.

**Request Body:**
```json
{
  "current_password": "old_password",
  "new_password": "new_password",
  "confirm_password": "new_password"
}
```

---

## 🛍️ Layanan Management

### GET /layanan
Get daftar layanan (Public).

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `kategori` (optional): Filter by category
- `search` (optional): Search by name
- `unggulan` (optional): Filter featured services
- `aktif` (optional): Filter active services (default: true)

**Response:**
```json
{
  "success": true,
  "data": {
    "layanan": [
      {
        "id": 1,
        "nama_layanan": "Prewedding Photography",
        "slug": "prewedding-photography",
        "kategori": "prewedding",
        "deskripsi": "Professional prewedding photography service",
        "harga_minimal": 2500000,
        "durasi_pengerjaan": "3-5 hari",
        "unggulan": true,
        "aktif": true,
        "media_count": 5
      }
    ],
    "pagination": {...}
  }
}
```

### GET /layanan/:identifier
Get layanan by ID atau slug.

### POST /layanan
Create layanan baru (Admin only).

**Request Body:**
```json
{
  "nama_layanan": "Wedding Photography",
  "slug": "wedding-photography",
  "kategori": "prewedding",
  "deskripsi": "Professional wedding photography",
  "harga_minimal": 5000000,
  "durasi_pengerjaan": "7-10 hari",
  "unggulan": false,
  "aktif": true
}
```

### PUT /layanan/:id
Update layanan (Admin only).

### DELETE /layanan/:id
Delete layanan (Admin only).

### GET /layanan/categories/list
Get daftar kategori layanan.

**Response:**
```json
{
  "success": true,
  "data": [
    { "value": "prewedding", "label": "Prewedding" },
    { "value": "drone", "label": "Drone" },
    { "value": "graduation", "label": "Graduation" },
    { "value": "corporate_event", "label": "Corporate Event" },
    { "value": "documentary", "label": "Documentary" }
  ]
}
```

---

## 🖼️ Layanan Media Management

### GET /layanan-media/layanan/:layanan_id
Get media untuk layanan tertentu.

**Query Parameters:**
- `tipe` (optional): Filter by type (gambar/video)

### GET /layanan-media/:id
Get media by ID.

### POST /layanan-media
Upload media untuk layanan (Admin only).

**Content-Type:** `multipart/form-data`

**Form Data:**
- `layanan_id`: Integer (required)
- `tipe`: String (required) - "gambar" or "video"
- `media`: File (required)
- `keterangan`: String (optional)
- `urutan`: Integer (optional)

### PUT /layanan-media/:id
Update media (Admin only).

### DELETE /layanan-media/:id
Delete media (Admin only).

---

## 📋 Pemesanan Management

### GET /pemesanan
Get daftar pemesanan.

**Query Parameters:**
- `page`, `limit`: Pagination
- `status`: Filter by status
- `search`: Search by order code or event name

**Response:**
```json
{
  "success": true,
  "data": {
    "pemesanan": [
      {
        "id": 1,
        "kode_pemesanan": "ORDER-123",
        "kode_tracking": "MKVI_0001",
        "status": "tervalidasi",
        "nama_acara": "Wedding John & Jane",
        "tanggal_pelaksanaan": "2025-02-14",
        "jam_mulai": "09:00:00",
        "lokasi_acara": "Jakarta",
        "total_tagihan": 5000000,
        "pengguna_nama": "John Doe",
        "pengguna_email": "john@example.com",
        "nama_layanan": "Wedding Photography"
      }
    ],
    "pagination": {...}
  }
}
```

### GET /pemesanan/:id
Get pemesanan by ID.

### POST /pemesanan
Create pemesanan baru (User only).

**Request Body:**
```json
{
  "layanan_id": 1,
  "nama_acara": "Wedding Celebration",
  "tanggal_pelaksanaan": "2025-02-14",
  "tanggal_selesai_pelaksanaan": "2025-02-14",
  "jam_mulai": "09:00",
  "lokasi_acara": "Jakarta Convention Center",
  "deskripsi_kebutuhan": "Need professional wedding photography",
  "catatan_pengguna": "Special requirements here"
}
```

### PUT /pemesanan/:id
Update pemesanan (Admin only).

### PUT /pemesanan/:id/status
Update status pemesanan (Admin only).

**Request Body:**
```json
{
  "status": "tervalidasi"
}
```

**Status Options:**
- `menunggu_validasi_admin`
- `tervalidasi`
- `dibatalkan`

### DELETE /pemesanan/:id
Delete pemesanan (Admin only).

### GET /pemesanan/track/:tracking_code
Track pemesanan by tracking code (Public).

**Example:**
```http
GET /api/pemesanan/track/MKVI_0001
```

---

## 📅 Meeting Management

### GET /meeting
Get daftar meeting.

**Query Parameters:**
- `page`, `limit`: Pagination
- `status`: Filter by status
- `search`: Search by order code or event name

### GET /meeting/:id
Get meeting by ID.

### POST /meeting
Create meeting baru (Admin only).

**Request Body:**
```json
{
  "pemesanan_id": 1,
  "pengguna_id": 1,
  "platform": "google_meet",
  "calendly_link": "https://calendly.com/mkvi/consultation",
  "catatan": "Initial consultation meeting"
}
```

### PUT /meeting/:id
Update meeting (Admin only).

**Content-Type:** `multipart/form-data`

**Form Data:**
- `nama_client`: String
- `email_client`: String
- `no_wa_client`: String
- `pekerjaan_client`: String
- `waktu_mulai`: DateTime
- `waktu_selesai`: DateTime
- `mou_file`: File (PDF)
- `status`: String
- `catatan`: String

### PUT /meeting/:id/status
Update status meeting (Admin only).

**Request Body:**
```json
{
  "status": "selesai"
}
```

**Status Options:**
- `dijadwalkan`
- `selesai`
- `dibatalkan`

### DELETE /meeting/:id
Delete meeting (Admin only).

### POST /meeting/calendly-webhook
Calendly webhook endpoint (Public).

---

## 💳 Pembayaran Management

### GET /pembayaran
Get daftar pembayaran.

**Query Parameters:**
- `page`, `limit`: Pagination
- `status`: Filter by status
- `jenis_pembayaran`: Filter by payment type
- `search`: Search by order code

### GET /pembayaran/:id
Get pembayaran by ID.

### POST /pembayaran
Create pembayaran baru (User only).

**Content-Type:** `multipart/form-data`

**Form Data:**
- `pemesanan_id`: Integer (required)
- `jenis_pembayaran`: String (required) - "dp", "pelunasan", "full"
- `total_biaya`: Number (required)
- `metode`: String (required)
- `bukti_pembayaran`: File (required)

### PUT /pembayaran/:id
Update pembayaran (Admin only).

### PUT /pembayaran/:id/status
Update status pembayaran (Admin only).

**Request Body:**
```json
{
  "status": "lunas",
  "diverifikasi": true
}
```

**Status Options:**
- `pending`
- `lunas`
- `cicilan`
- `gagal`

### DELETE /pembayaran/:id
Delete pembayaran (Admin only).

### GET /pembayaran/pemesanan/:pemesanan_id
Get pembayaran by pemesanan ID.

---

## 📄 Document Generation

### POST /documents/invoice/:pemesanan_id
Generate Invoice PDF (Admin only).

**Response:**
```json
{
  "success": true,
  "message": "Invoice generated successfully",
  "data": {
    "filename": "invoice-ORDER-123-20250110-143022.pdf",
    "url": "http://localhost:5000/uploads/documents/invoice-ORDER-123-20250110-143022.pdf",
    "type": "invoice"
  }
}
```

### POST /documents/mou/:meeting_id
Generate MoU PDF (Admin only).

### POST /documents/kwitansi/:pembayaran_id
Generate Kwitansi PDF (Admin only).

### GET /documents/:type/:id
Get document info.

**Parameters:**
- `type`: "invoice", "mou", or "kwitansi"
- `id`: Document ID

### GET /documents/order/:pemesanan_id
Get all documents for an order.

**Response:**
```json
{
  "success": true,
  "data": {
    "kode_pemesanan": "ORDER-123",
    "documents": {
      "invoice": {
        "filename": "invoice-ORDER-123.pdf",
        "url": "http://localhost:5000/uploads/documents/invoice-ORDER-123.pdf"
      },
      "mou": {
        "filename": "mou-ORDER-123.pdf",
        "url": "http://localhost:5000/uploads/documents/mou-ORDER-123.pdf"
      },
      "kwitansi": [
        {
          "filename": "kwitansi-ORDER-123-1.pdf",
          "url": "http://localhost:5000/uploads/documents/kwitansi-ORDER-123-1.pdf"
        }
      ]
    }
  }
}
```

---

## 📊 Rekap & Reports

### POST /rekap/pemesanan/generate
Generate rekap pemesanan Excel (Admin only).

**Request Body:**
```json
{
  "tanggal_mulai": "2025-01-01",
  "tanggal_selesai": "2025-01-31"
}
```

### POST /rekap/meeting/generate
Generate rekap meeting Excel (Admin only).

### POST /rekap/pembayaran/generate
Generate rekap pembayaran Excel (Admin only).

### GET /rekap/pemesanan
Get daftar rekap pemesanan (Admin only).

### GET /rekap/meeting
Get daftar rekap meeting (Admin only).

### GET /rekap/pembayaran
Get daftar rekap pembayaran (Admin only).

### DELETE /rekap/:type/:id
Delete rekap (Admin only).

---

## 📁 File Upload

### POST /upload/single
Upload single file.

**Content-Type:** `multipart/form-data`

**Form Data:**
- `file`: File

### POST /upload/multiple
Upload multiple files (max 5).

**Form Data:**
- `files`: File[]

### POST /upload/profile
Upload profile image.

**Form Data:**
- `profile_image`: File (Image only)

### POST /upload/layanan-media
Upload layanan media (Admin only).

**Form Data:**
- `media`: File (Image/Video)

### POST /upload/payment-proof
Upload payment proof.

**Form Data:**
- `payment_proof`: File (Image/PDF)

### GET /upload/download/:folder/:filename
Download file.

**Example:**
```http
GET /api/upload/download/documents/invoice-ORDER-123.pdf
```

### DELETE /upload/:folder/:filename
Delete file (Admin only).

### GET /upload/info/:folder/:filename
Get file information.

---

## 📧 Email Service

### POST /email/welcome
Send welcome email.

**Request Body:**
```json
{
  "userEmail": "user@example.com",
  "userName": "John Doe"
}
```

### POST /email/order-confirmation
Send order confirmation email.

**Request Body:**
```json
{
  "userEmail": "user@example.com",
  "userName": "John Doe",
  "orderData": {
    "kode_pemesanan": "ORDER-123",
    "nama_acara": "Wedding",
    "total_tagihan": 5000000
  }
}
```

### POST /email/order-validation
Send order validation email.

### POST /email/meeting-invitation
Send meeting invitation email.

### POST /email/payment-confirmation
Send payment confirmation email.

---

## 🔔 Notifications

### GET /notifications
Get user notifications.

**Query Parameters:**
- `page`, `limit`: Pagination
- `filter`: "all", "unread", "read"

### PUT /notifications/:id/read
Mark notification as read.

### PUT /notifications/read-all
Mark all notifications as read.

### DELETE /notifications/:id
Delete notification.

### GET /notifications/unread-count
Get unread notification count.

---

## 🏥 System Health

### GET /health
Check API health status.

**Response:**
```json
{
  "status": "OK",
  "message": "MKVI Backend API is running",
  "timestamp": "2025-01-10T14:30:22.123Z"
}
```

---

## 📊 Analytics

### GET /analytics/dashboard
Get dashboard statistics.

### GET /analytics/orders
Get order analytics.

### GET /analytics/payments
Get payment analytics.

### GET /analytics/meetings
Get meeting analytics.

### GET /analytics/revenue
Get revenue analytics.

---

## ⚠️ Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 422 | Validation Error | Request validation failed |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

---

## 🔒 Security

### Rate Limiting
- **Limit**: 100 requests per 15 minutes per IP
- **Scope**: All `/api/*` endpoints

### File Upload Security
- **Max Size**: 10MB per file
- **Allowed Types**: Images, Videos, PDFs
- **Validation**: File type and size validation
- **Storage**: Local filesystem with organized folders

### Authentication Security
- **JWT**: HS256 algorithm
- **Expiration**: 7 days (configurable)
- **Password**: bcrypt hashing with salt rounds 10

---

## 📝 Examples

### Complete Order Flow Example

```javascript
// 1. Login as admin
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@mkvi.com',
    password: 'password'
  })
});
const { token } = await loginResponse.json();

// 2. Create order
const orderResponse = await fetch('/api/pemesanan', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    layanan_id: 1,
    nama_acara: 'Wedding John & Jane',
    tanggal_pelaksanaan: '2025-02-14',
    jam_mulai: '09:00',
    lokasi_acara: 'Jakarta',
    deskripsi_kebutuhan: 'Professional wedding photography'
  })
});
const order = await orderResponse.json();

// 3. Validate order
await fetch(`/api/pemesanan/${order.data.id}/status`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ status: 'tervalidasi' })
});

// 4. Generate invoice
const invoiceResponse = await fetch(`/api/documents/invoice/${order.data.id}`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` }
});
const invoice = await invoiceResponse.json();

// 5. Download invoice
window.open(invoice.data.url, '_blank');
```

---

**📞 Support**: Jika ada pertanyaan tentang API, hubungi tim development di support@mkvi.com
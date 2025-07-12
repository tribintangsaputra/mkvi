# 🌟 MKVI - Frontend Website Pengguna

## 📋 Deskripsi

Frontend website pengguna MKVI adalah antarmuka yang digunakan oleh pengguna/client untuk melihat layanan fotografi dan website, melakukan pemesanan, menjadwalkan meeting, melakukan pembayaran, dan melacak status pesanan mereka.

## 🚀 Fitur Utama

### 1. **Autentikasi Pengguna**
- ✅ Registrasi akun baru
- ✅ Login dengan email dan password
- ✅ Lupa password
- ✅ Profil pengguna
- ✅ Update profil dan password

### 2. **Katalog Layanan**
- ✅ Daftar layanan fotografi dan website
- ✅ Filter berdasarkan kategori
- ✅ Pencarian layanan
- ✅ Detail layanan dengan galeri foto/video
- ✅ Informasi harga dan durasi pengerjaan

### 3. **Pemesanan**
- ✅ Form pemesanan layanan
- ✅ Pemilihan tanggal dan waktu
- ✅ Input detail acara
- ✅ Konfirmasi pemesanan
- ✅ Tracking status pemesanan

### 4. **Meeting**
- ✅ Jadwalkan meeting via Calendly
- ✅ Lihat jadwal meeting yang akan datang
- ✅ Riwayat meeting
- ✅ Detail meeting (link, waktu, platform)

### 5. **Pembayaran**
- ✅ Metode pembayaran (transfer bank)
- ✅ Upload bukti pembayaran
- ✅ Riwayat pembayaran
- ✅ Status pembayaran

### 6. **Dokumen**
- ✅ Download invoice
- ✅ Download MoU
- ✅ Download kwitansi
- ✅ Riwayat dokumen

### 7. **Dashboard Pengguna**
- ✅ Ringkasan aktivitas
- ✅ Status pemesanan terbaru
- ✅ Jadwal meeting mendatang
- ✅ Notifikasi

## 🛠️ Teknologi

- **React 18** - Library UI
- **Vite** - Build tool
- **React Router** - Routing
- **React Query** - State management & data fetching
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Framer Motion** - Animasi
- **React Hook Form** - Form handling
- **Lucide React** - Icon library
- **React Hot Toast** - Notifications

## 📁 Struktur Folder

```
frontend/
├── public/              # Aset statis
├── src/
│   ├── assets/          # Gambar, font, dll
│   ├── components/      # Komponen reusable
│   │   ├── auth/        # Komponen autentikasi
│   │   ├── layout/      # Layout components
│   │   ├── ui/          # UI components
│   │   └── ...
│   ├── contexts/        # React contexts
│   ├── hooks/           # Custom hooks
│   ├── pages/           # Halaman utama
│   │   ├── auth/        # Halaman autentikasi
│   │   ├── dashboard/   # Halaman dashboard
│   │   ├── layanan/     # Halaman layanan
│   │   ├── pemesanan/   # Halaman pemesanan
│   │   ├── meeting/     # Halaman meeting
│   │   ├── pembayaran/  # Halaman pembayaran
│   │   └── ...
│   ├── services/        # API services
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Root component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── .env.example         # Environment variables example
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
└── tailwind.config.js   # Tailwind configuration
```

## 🔧 Instalasi

### Prasyarat
- Node.js v18.0.0 atau lebih baru
- npm atau yarn

### Langkah-langkah

1. **Clone repository**
```bash
git clone https://github.com/your-username/mkvi-frontend-user.git
cd mkvi-frontend-user
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
```

4. **Edit .env file**
```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=MKVI User Portal
```

5. **Start development server**
```bash
npm run dev
```

## 📱 Halaman dan Fitur

### 1. **Halaman Beranda**

![Halaman Beranda](https://example.com/home-screenshot.jpg)

Halaman utama website dengan:
- Hero section dengan CTA untuk layanan populer
- Highlight layanan unggulan
- Testimonial dari client
- Gallery foto terbaik
- Section FAQ
- Call to action untuk registrasi

### 2. **Halaman Layanan**

![Halaman Layanan](https://example.com/services-screenshot.jpg)

Menampilkan semua layanan yang tersedia:
- Filter berdasarkan kategori (Prewedding, Drone, Graduation, dll)
- Sorting berdasarkan harga dan popularitas
- Search bar untuk pencarian
- Card layanan dengan preview gambar, harga, dan rating

### 3. **Detail Layanan**

![Detail Layanan](https://example.com/service-detail-screenshot.jpg)

Menampilkan detail lengkap layanan:
- Gallery foto/video
- Deskripsi layanan
- Harga dan durasi pengerjaan
- Paket yang tersedia
- Tombol "Pesan Sekarang"
- Layanan terkait

### 4. **Dashboard Pengguna**

![Dashboard Pengguna](https://example.com/dashboard-screenshot.jpg)

Dashboard personal untuk pengguna:
- Ringkasan aktivitas
- Pemesanan terbaru
- Meeting mendatang
- Status pembayaran
- Notifikasi
- Quick links ke fitur utama

### 5. **Halaman Pemesanan**

![Halaman Pemesanan](https://example.com/order-screenshot.jpg)

Form pemesanan layanan:
- Pemilihan layanan
- Input detail acara
- Pemilihan tanggal dan waktu
- Lokasi acara
- Deskripsi kebutuhan
- Preview total biaya
- Tombol konfirmasi

### 6. **Tracking Pemesanan**

![Tracking Pemesanan](https://example.com/tracking-screenshot.jpg)

Halaman untuk melacak status pemesanan:
- Timeline status pemesanan
- Detail pemesanan
- Status validasi admin
- Status pembayaran
- Jadwal meeting
- Download dokumen

### 7. **Halaman Meeting**

![Halaman Meeting](https://example.com/meeting-screenshot.jpg)

Manajemen jadwal meeting:
- Calendly integration untuk pemilihan jadwal
- Daftar meeting mendatang
- Riwayat meeting
- Detail meeting (link, waktu, platform)
- Reminder meeting

### 8. **Halaman Pembayaran**

![Halaman Pembayaran](https://example.com/payment-screenshot.jpg)

Manajemen pembayaran:
- Informasi tagihan
- Opsi pembayaran (DP, pelunasan, full)
- Upload bukti pembayaran
- Status verifikasi
- Riwayat pembayaran
- Download kwitansi

### 9. **Halaman Dokumen**

![Halaman Dokumen](https://example.com/documents-screenshot.jpg)

Manajemen dokumen:
- Daftar semua dokumen
- Download invoice
- Download MoU
- Download kwitansi
- Riwayat dokumen

### 10. **Halaman Profil**

![Halaman Profil](https://example.com/profile-screenshot.jpg)

Manajemen profil pengguna:
- Edit informasi personal
- Upload foto profil
- Ubah password
- Preferensi notifikasi
- Riwayat aktivitas

## 🔐 Autentikasi dan Keamanan

### Alur Autentikasi
1. Pengguna registrasi dengan email dan password
2. Verifikasi email (opsional)
3. Login dengan email dan password
4. JWT token disimpan di localStorage
5. Token digunakan untuk semua API requests
6. Auto-refresh token saat expired
7. Logout menghapus token

### Keamanan
- HTTPS untuk semua komunikasi
- JWT dengan expiration time
- Password hashing dengan bcrypt
- CORS protection
- Input validation
- Rate limiting

## 📊 State Management

### React Query
- Fetching dan caching data
- Optimistic updates
- Refetching otomatis
- Pagination
- Infinite scrolling

### Context API
- Auth context untuk state autentikasi
- Theme context untuk mode gelap/terang
- Notification context untuk notifikasi

## 🎨 UI/UX

### Tema dan Styling
- Tema light dan dark
- Responsive design (mobile-first)
- Animasi dengan Framer Motion
- Konsistensi UI dengan Tailwind CSS
- Aksesibilitas (WCAG compliance)

### Komponen UI
- Buttons, inputs, cards
- Modals, drawers, tooltips
- Forms dengan validasi
- Loaders dan skeletons
- Notifications dan alerts

## 📱 Responsive Design

Website dioptimalkan untuk berbagai ukuran layar:
- Mobile (< 640px)
- Tablet (640px - 1024px)
- Desktop (> 1024px)
- Large Desktop (> 1280px)

## 🔄 API Integration

### Endpoints
- `/auth/*` - Autentikasi
- `/pengguna/*` - Manajemen pengguna
- `/layanan/*` - Layanan dan media
- `/pemesanan/*` - Pemesanan
- `/meeting/*` - Meeting
- `/pembayaran/*` - Pembayaran
- `/documents/*` - Dokumen
- `/upload/*` - File upload

### Error Handling
- Timeout handling
- Network error handling
- API error messages
- Retry mechanism
- Fallback UI

## 🧪 Testing

### Unit Testing
- Component testing dengan Jest dan React Testing Library
- Hook testing
- Utility function testing

### Integration Testing
- API integration testing
- Form submission testing
- Authentication flow testing

### E2E Testing
- User flows dengan Cypress
- Critical path testing

## 🚀 Deployment

### Build Process
```bash
npm run build
```

### Deployment Options
- Netlify
- Vercel
- AWS S3 + CloudFront
- GitHub Pages

## 📈 Analytics dan Monitoring

- Google Analytics integration
- Error tracking dengan Sentry
- Performance monitoring
- User behavior tracking
- Conversion tracking

## 🔍 SEO Optimization

- Meta tags
- Open Graph tags
- Structured data
- Sitemap
- Robots.txt
- Performance optimization

## 🌐 Internationalization

- Support untuk Bahasa Indonesia (default)
- Framework untuk menambahkan bahasa lain
- Date/time/currency formatting

## 📝 Dokumentasi Tambahan

### Komponen Utama

#### AuthProvider
```jsx
// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../services/api'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
          const response = await api.get('/auth/me')
          setUser(response.data.data)
        }
      } catch (error) {
        localStorage.removeItem('token')
        delete api.defaults.headers.common['Authorization']
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Login function
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { user, token } = response.data.data
      
      localStorage.setItem('token', token)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(user)
      
      return { success: true, user }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      }
    }
  }

  // Register function
  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData)
      const { user, token } = response.data.data
      
      localStorage.setItem('token', token)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(user)
      
      return { success: true, user }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      }
    }
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      logout,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
```

#### ProtectedRoute
```jsx
// src/components/auth/ProtectedRoute.jsx
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import LoadingScreen from '../ui/LoadingScreen'

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <LoadingScreen />
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

export default ProtectedRoute
```

#### ServiceCard
```jsx
// src/components/layanan/ServiceCard.jsx
import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Camera, Star } from 'lucide-react'

const ServiceCard = ({ service }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount)
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all"
    >
      <div className="relative h-48 overflow-hidden">
        {service.media_url ? (
          <img 
            src={service.media_url} 
            alt={service.nama_layanan}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <Camera className="w-12 h-12 text-gray-400" />
          </div>
        )}
        {service.unggulan && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
            <Star className="w-3 h-3 mr-1 fill-current" />
            Unggulan
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          {service.nama_layanan}
        </h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
          {service.deskripsi || 'Layanan fotografi profesional untuk kebutuhan Anda'}
        </p>
        
        <div className="flex items-center justify-between mt-3">
          <span className="text-primary-600 dark:text-primary-400 font-medium">
            Mulai dari {formatCurrency(service.harga_minimal)}
          </span>
          
          <Link 
            to={`/layanan/${service.slug}`}
            className="text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 px-3 py-1 rounded-md transition-colors"
          >
            Detail
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export default ServiceCard
```

#### OrderTracker
```jsx
// src/components/pemesanan/OrderTracker.jsx
import React from 'react'
import { CheckCircle, Clock, XCircle } from 'lucide-react'

const OrderTracker = ({ status, createdAt, validatedAt, cancelledAt }) => {
  const steps = [
    { 
      id: 'created', 
      label: 'Pemesanan Dibuat', 
      date: createdAt,
      completed: true,
      icon: CheckCircle
    },
    { 
      id: 'validated', 
      label: 'Tervalidasi Admin', 
      date: validatedAt,
      completed: status === 'tervalidasi',
      current: status === 'menunggu_validasi_admin',
      icon: status === 'tervalidasi' ? CheckCircle : Clock
    },
    { 
      id: 'cancelled', 
      label: 'Dibatalkan', 
      date: cancelledAt,
      completed: status === 'dibatalkan',
      icon: XCircle,
      error: status === 'dibatalkan'
    }
  ]

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="py-6">
      <div className="flex items-center">
        {steps.map((step, i) => (
          <React.Fragment key={step.id}>
            {/* Step */}
            <div className="relative flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step.error ? 'bg-red-100 text-red-600' :
                step.completed ? 'bg-green-100 text-green-600' :
                step.current ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
              }`}>
                <step.icon className="w-5 h-5" />
              </div>
              <div className="mt-2 text-center">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {step.label}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {formatDate(step.date)}
                </div>
              </div>
            </div>
            
            {/* Connector */}
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 ${
                steps[i].completed && steps[i+1].completed ? 'bg-green-500' :
                steps[i].completed && steps[i+1].current ? 'bg-blue-500' :
                steps[i].completed && steps[i+1].error ? 'bg-red-500' : 'bg-gray-300'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

export default OrderTracker
```

#### PaymentForm
```jsx
// src/components/pembayaran/PaymentForm.jsx
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Upload, AlertCircle } from 'lucide-react'
import { pembayaranService } from '../../services/api'
import { useMutation, useQueryClient } from 'react-query'
import toast from 'react-hot-toast'

const PaymentForm = ({ pemesanan, onSuccess }) => {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const queryClient = useQueryClient()
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      jenis_pembayaran: 'dp',
      metode: 'transfer melalui BCA DENGAN NO REKENING 1234567890'
    }
  })
  
  const jenisPembayaran = watch('jenis_pembayaran')
  
  // Calculate payment amount based on type
  const calculateAmount = () => {
    const total = pemesanan?.total_tagihan || 0
    
    switch(jenisPembayaran) {
      case 'dp':
        return total * 0.25
      case 'pelunasan':
        return total * 0.75
      case 'full':
        return total
      default:
        return 0
    }
  }
  
  // Create payment mutation
  const createPaymentMutation = useMutation(
    (data) => pembayaranService.create(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['pembayaran', pemesanan.id])
        queryClient.invalidateQueries(['pemesanan', pemesanan.id])
        toast.success('Pembayaran berhasil dibuat')
        if (onSuccess) onSuccess()
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Gagal membuat pembayaran')
      }
    }
  )
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(selectedFile)
    }
  }
  
  const onSubmit = (data) => {
    if (!file) {
      toast.error('Bukti pembayaran harus diupload')
      return
    }
    
    const formData = new FormData()
    formData.append('pemesanan_id', pemesanan.id)
    formData.append('jenis_pembayaran', data.jenis_pembayaran)
    formData.append('total_biaya', calculateAmount())
    formData.append('metode', data.metode)
    formData.append('bukti_pembayaran', file)
    
    createPaymentMutation.mutate(formData)
  }
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount)
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Jenis Pembayaran
        </label>
        <select
          {...register('jenis_pembayaran', { required: true })}
          className="select w-full"
        >
          <option value="dp">DP (25%)</option>
          <option value="pelunasan">Pelunasan (75%)</option>
          <option value="full">Full Payment (100%)</option>
        </select>
        {errors.jenis_pembayaran && (
          <p className="mt-1 text-sm text-red-600">Jenis pembayaran harus dipilih</p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Jumlah Pembayaran
        </label>
        <div className="input flex items-center bg-gray-100 dark:bg-gray-700 cursor-not-allowed">
          <span className="font-medium">{formatCurrency(calculateAmount())}</span>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          {jenisPembayaran === 'dp' ? '25% dari total tagihan' : 
           jenisPembayaran === 'pelunasan' ? '75% dari total tagihan' : 
           '100% dari total tagihan'}
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Metode Pembayaran
        </label>
        <select
          {...register('metode', { required: true })}
          className="select w-full"
        >
          <option value="transfer melalui BCA DENGAN NO REKENING 1234567890">
            Transfer BCA - 1234567890
          </option>
        </select>
        {errors.metode && (
          <p className="mt-1 text-sm text-red-600">Metode pembayaran harus dipilih</p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Bukti Pembayaran
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            {preview ? (
              <div className="mb-3">
                <img src={preview} alt="Preview" className="mx-auto h-32 object-cover" />
              </div>
            ) : (
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
            )}
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
              >
                <span>Upload bukti pembayaran</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                />
              </label>
              <p className="pl-1">atau drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, JPEG, PDF hingga 10MB</p>
          </div>
        </div>
        {!file && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            Bukti pembayaran wajib diupload
          </p>
        )}
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Catatan:</strong> Pembayaran akan diverifikasi oleh admin dalam 1x24 jam. 
          Pastikan bukti pembayaran jelas dan sesuai dengan jumlah yang ditransfer.
        </p>
      </div>
      
      <div>
        <button
          type="submit"
          disabled={createPaymentMutation.isLoading || !file}
          className="w-full btn btn-primary btn-lg"
        >
          {createPaymentMutation.isLoading ? 'Memproses...' : 'Kirim Pembayaran'}
        </button>
      </div>
    </form>
  )
}

export default PaymentForm
```

## 📄 Halaman Utama

### HomePage.jsx
```jsx
// src/pages/HomePage.jsx
import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { layananService } from '../services/api'
import ServiceCard from '../components/layanan/ServiceCard'
import TestimonialCard from '../components/ui/TestimonialCard'
import { Camera, Calendar, FileText, CreditCard, ArrowRight } from 'lucide-react'

const HomePage = () => {
  // Fetch featured services
  const { data: featuredServices, isLoading } = useQuery(
    'featured-services',
    () => layananService.getAll({ unggulan: true, limit: 4 }),
    {
      select: (data) => data.data.data.layanan
    }
  )

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20 rounded-3xl overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-2xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Abadikan Momen Berharga Anda Bersama MKVI
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-xl mb-8"
            >
              Layanan fotografi profesional untuk pernikahan, wisuda, acara korporat, 
              dan pembuatan website berkualitas tinggi.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/layanan" className="btn btn-lg bg-white text-primary-600 hover:bg-gray-100">
                Lihat Layanan
              </Link>
              <Link to="/register" className="btn btn-lg bg-transparent border-2 border-white hover:bg-white/10">
                Daftar Sekarang
              </Link>
            </motion.div>
          </div>
        </div>
        
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M45.3,-51.2C58.3,-42.5,68.5,-27.1,71.3,-10.7C74.2,5.7,69.7,23.1,59.3,35.9C48.9,48.7,32.5,57,15.2,62.5C-2.1,68.1,-20.4,70.9,-35.3,64.5C-50.2,58.2,-61.8,42.7,-67.4,25.3C-73,7.9,-72.6,-11.4,-64.5,-26.5C-56.3,-41.6,-40.4,-52.5,-24.8,-59.8C-9.2,-67.1,6.2,-70.8,21.9,-67.7C37.7,-64.6,53.8,-54.7,45.3,-51.2Z" transform="translate(100 100)" />
          </svg>
        </div>
      </section>

      {/* Services Section */}
      <section className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Layanan Unggulan Kami
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Kami menyediakan berbagai layanan fotografi dan pembuatan website profesional
            untuk memenuhi kebutuhan Anda.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                </div>
              </div>
            ))
          ) : (
            featuredServices?.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))
          )}
        </div>
        
        <div className="text-center mt-10">
          <Link to="/layanan" className="btn btn-primary btn-lg">
            Lihat Semua Layanan
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Cara Kerja
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Proses pemesanan layanan fotografi dan website yang mudah dan cepat
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: Camera, 
                title: 'Pilih Layanan', 
                description: 'Pilih layanan fotografi atau website yang sesuai dengan kebutuhan Anda' 
              },
              { 
                icon: Calendar, 
                title: 'Jadwalkan Meeting', 
                description: 'Diskusikan detail kebutuhan Anda dengan tim kami' 
              },
              { 
                icon: FileText, 
                title: 'Tanda Tangani MoU', 
                description: 'Setujui perjanjian kerja sama untuk memulai proyek' 
              },
              { 
                icon: CreditCard, 
                title: 'Lakukan Pembayaran', 
                description: 'Bayar DP atau full payment untuk memulai pengerjaan' 
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md text-center"
              >
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Apa Kata Mereka
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Testimoni dari klien yang telah menggunakan layanan kami
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Andi Pratama',
              role: 'Pengantin',
              image: 'https://randomuser.me/api/portraits/men/32.jpg',
              content: 'Hasil foto prewedding kami sangat memuaskan. Tim MKVI sangat profesional dan membantu kami dari awal hingga akhir proses.'
            },
            {
              name: 'Rina Wijaya',
              role: 'Wisudawan',
              image: 'https://randomuser.me/api/portraits/women/44.jpg',
              content: 'Saya sangat puas dengan hasil foto wisuda saya. Kualitas gambar sangat bagus dan pengambilan gambar yang kreatif.'
            },
            {
              name: 'PT Maju Bersama',
              role: 'Corporate Client',
              image: 'https://randomuser.me/api/portraits/men/68.jpg',
              content: 'Website yang dibuat sangat profesional dan sesuai dengan brand kami. Proses pengerjaan cepat dan komunikasi lancar.'
            }
          ].map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-16 rounded-3xl">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Siap Mengabadikan Momen Berharga Anda?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Hubungi kami sekarang untuk konsultasi gratis dan dapatkan penawaran terbaik
            untuk kebutuhan fotografi dan website Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn btn-lg bg-white text-primary-600 hover:bg-gray-100">
              Daftar Sekarang
            </Link>
            <Link to="/layanan" className="btn btn-lg bg-transparent border-2 border-white hover:bg-white/10">
              Lihat Layanan
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
```

## 🔄 Alur Bisnis

### 1. **Registrasi & Login**
```
Pengguna Register → Email Verifikasi → Akun Aktif → Login
```

### 2. **Pemesanan Layanan**
```
Browse Layanan → Pilih Layanan → Isi Form Pemesanan → Submit Pemesanan → Menunggu Validasi Admin → Tervalidasi → Invoice Diterbitkan
```

### 3. **Meeting & MoU**
```
Pemesanan Tervalidasi → Admin Jadwalkan Meeting → Pengguna Pilih Jadwal → Meeting Dilaksanakan → MoU Diterbitkan
```

### 4. **Pembayaran**
```
Invoice Diterima → Upload Bukti Pembayaran DP → Admin Verifikasi → Kwitansi Diterbitkan → Pengerjaan Dimulai → Upload Bukti Pelunasan → Admin Verifikasi → Kwitansi Pelunasan
```

### 5. **Tracking & Dokumen**
```
Cek Status Pemesanan → Download Invoice → Download MoU → Download Kwitansi
```

## 🔧 Troubleshooting

### Login Issues
- Pastikan email dan password benar
- Cek koneksi internet
- Hapus cache browser
- Coba reset password

### Payment Issues
- Pastikan bukti pembayaran jelas
- Cek nominal transfer sesuai
- Pastikan rekening tujuan benar
- Hubungi admin jika pembayaran tidak terverifikasi dalam 24 jam

### Meeting Issues
- Pastikan Calendly terintegrasi dengan baik
- Cek email untuk link meeting
- Pastikan browser mendukung Google Meet
- Test koneksi internet sebelum meeting

## 📞 Support

Untuk bantuan teknis atau pertanyaan:
- Email: support@mkvi.com
- WhatsApp: +62xxxxxxxxxx
- Live Chat: Tersedia di website pada jam kerja (9:00 - 17:00 WIB)

## 🚀 Roadmap

### Q1 2025
- Integrasi pembayaran online (Midtrans)
- Fitur chat langsung dengan admin
- Galeri hasil proyek

### Q2 2025
- Mobile app (Android & iOS)
- Sistem review dan rating
- Loyalty program

### Q3 2025
- Integrasi dengan Google Calendar
- Fitur share ke social media
- Personalized dashboard

### Q4 2025
- AI recommendation system
- Virtual tour studio
- Augmented reality preview

## 📝 License

Copyright © 2025 PT. MKVI. All rights reserved.
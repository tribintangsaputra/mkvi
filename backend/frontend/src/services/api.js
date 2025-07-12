import axios from 'axios'
import toast from 'react-hot-toast'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    
    // Don't show toast for certain endpoints
    const silentEndpoints = ['/auth/me']
    const shouldShowToast = !silentEndpoints.some(endpoint => 
      error.config?.url?.includes(endpoint)
    )
    
    if (shouldShowToast) {
      const message = error.response?.data?.message || 'Terjadi kesalahan'
      toast.error(message)
    }
    
    return Promise.reject(error)
  }
)

// API Services
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
  refresh: () => api.post('/auth/refresh'),
  logout: () => {
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
  }
}

export const penggunaService = {
  getAll: (params) => api.get('/pengguna', { params }),
  getById: (id) => api.get(`/pengguna/${id}`),
  create: (data) => api.post('/auth/register', data),
  update: (id, data) => {
    const formData = new FormData()
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key])
      }
    })
    return api.put(`/pengguna/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  delete: (id) => api.delete(`/pengguna/${id}`),
  changePassword: (id, data) => api.put(`/pengguna/${id}/password`, data)
}

export const layananService = {
  getAll: (params) => api.get('/layanan', { params }),
  getById: (id) => api.get(`/layanan/${id}`),
  create: (data) => api.post('/layanan', data),
  update: (id, data) => api.put(`/layanan/${id}`, data),
  delete: (id) => api.delete(`/layanan/${id}`),
  getCategories: () => api.get('/layanan/categories/list')
}

export const layananMediaService = {
  getByLayanan: (layananId, params) => api.get(`/layanan-media/layanan/${layananId}`, { params }),
  getById: (id) => api.get(`/layanan-media/${id}`),
  create: (data) => api.post('/layanan-media', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, data) => api.put(`/layanan-media/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/layanan-media/${id}`)
}

export const pemesananService = {
  getAll: (params) => api.get('/pemesanan', { params }),
  getById: (id) => api.get(`/pemesanan/${id}`),
  create: (data) => api.post('/pemesanan', data),
  update: (id, data) => api.put(`/pemesanan/${id}`, data),
  updateStatus: (id, status) => api.put(`/pemesanan/${id}/status`, { status }),
  delete: (id) => api.delete(`/pemesanan/${id}`),
  track: (trackingCode) => api.get(`/pemesanan/track/${trackingCode}`)
}

export const meetingService = {
  getAll: (params) => api.get('/meeting', { params }),
  getById: (id) => api.get(`/meeting/${id}`),
  create: (data) => api.post('/meeting', data),
  update: (id, data) => {
    const formData = new FormData()
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key])
      }
    })
    return api.put(`/meeting/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  updateStatus: (id, status) => api.put(`/meeting/${id}/status`, { status }),
  delete: (id) => api.delete(`/meeting/${id}`),
  calendlyWebhook: (data) => api.post('/meeting/calendly-webhook', data)
}

export const pembayaranService = {
  getAll: (params) => api.get('/pembayaran', { params }),
  getById: (id) => api.get(`/pembayaran/${id}`),
  getByPemesanan: (pemesananId) => api.get(`/pembayaran/pemesanan/${pemesananId}`),
  create: (data) => api.post('/pembayaran', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, data) => api.put(`/pembayaran/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateStatus: (id, data) => api.put(`/pembayaran/${id}/status`, data),
  delete: (id) => api.delete(`/pembayaran/${id}`)
}

export const rekapService = {
  generatePemesanan: (data) => api.post('/rekap/pemesanan/generate', data),
  generateMeeting: (data) => api.post('/rekap/meeting/generate', data),
  generatePembayaran: (data) => api.post('/rekap/pembayaran/generate', data),
  getPemesanan: (params) => api.get('/rekap/pemesanan', { params }),
  getMeeting: (params) => api.get('/rekap/meeting', { params }),
  getPembayaran: (params) => api.get('/rekap/pembayaran', { params }),
  delete: (type, id) => api.delete(`/rekap/${type}/${id}`)
}

export const uploadService = {
  single: (file, type = 'single') => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post(`/upload/${type}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  multiple: (files) => {
    const formData = new FormData()
    files.forEach(file => formData.append('files', file))
    return api.post('/upload/multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  profile: (file) => {
    const formData = new FormData()
    formData.append('profile_image', file)
    return api.post('/upload/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  layananMedia: (file) => {
    const formData = new FormData()
    formData.append('media', file)
    return api.post('/upload/layanan-media', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  invoice: (file) => {
    const formData = new FormData()
    formData.append('invoice', file)
    return api.post('/upload/invoice', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  mou: (file) => {
    const formData = new FormData()
    formData.append('mou', file)
    return api.post('/upload/mou', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  paymentProof: (file) => {
    const formData = new FormData()
    formData.append('payment_proof', file)
    return api.post('/upload/payment-proof', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  receipt: (file) => {
    const formData = new FormData()
    formData.append('receipt', file)
    return api.post('/upload/receipt', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  download: (folder, filename) => api.get(`/upload/download/${folder}/${filename}`, {
    responseType: 'blob'
  }),
  delete: (folder, filename) => api.delete(`/upload/${folder}/${filename}`),
  getInfo: (folder, filename) => api.get(`/upload/info/${folder}/${filename}`)
}

export const documentService = {
  generateKwitansi: (pembayaranId) => api.post(`/documents/kwitansi/${pembayaranId}`),
  generateInvoice: (pemesananId) => api.post(`/documents/invoice/${pemesananId}`),
  generateMou: (meetingId) => api.post(`/documents/mou/${meetingId}`),
  getDocument: (type, id) => api.get(`/documents/${type}/${id}`),
  getOrderDocuments: (pemesananId) => api.get(`/documents/order/${pemesananId}`)
}

export const emailService = {
  sendWelcome: (userEmail, userName) => api.post('/email/welcome', { userEmail, userName }),
  sendOrderConfirmation: (userEmail, userName, orderData) => 
    api.post('/email/order-confirmation', { userEmail, userName, orderData }),
  sendOrderValidation: (userEmail, userName, orderData) => 
    api.post('/email/order-validation', { userEmail, userName, orderData }),
  sendMeetingInvitation: (userEmail, userName, meetingData) => 
    api.post('/email/meeting-invitation', { userEmail, userName, meetingData }),
  sendPaymentConfirmation: (userEmail, userName, paymentData) => 
    api.post('/email/payment-confirmation', { userEmail, userName, paymentData })
}

export const analyticsService = {
  getDashboardStats: () => api.get('/analytics/dashboard'),
  getOrderStats: (params) => api.get('/analytics/orders', { params }),
  getPaymentStats: (params) => api.get('/analytics/payments', { params }),
  getMeetingStats: (params) => api.get('/analytics/meetings', { params }),
  getUserStats: (params) => api.get('/analytics/users', { params }),
  getRevenueStats: (params) => api.get('/analytics/revenue', { params })
}

export const notificationService = {
  getAll: (params) => api.get('/notifications', { params }),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  delete: (id) => api.delete(`/notifications/${id}`),
  getUnreadCount: () => api.get('/notifications/unread-count')
}

export const systemService = {
  getHealth: () => api.get('/health'),
  getSystemInfo: () => api.get('/system/info'),
  backup: () => api.post('/system/backup'),
  getBackups: () => api.get('/system/backups'),
  restoreBackup: (backupId) => api.post(`/system/restore/${backupId}`)
}

export default api
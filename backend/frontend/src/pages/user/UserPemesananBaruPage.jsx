import React, { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  FileText, 
  Tag,
  DollarSign,
  ShoppingCart,
  AlertCircle
} from 'lucide-react'
import { useQuery, useMutation } from 'react-query'
import { layananService, pemesananService } from '../../services/api'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'

const UserPemesananBaruPage = () => {
  const [formData, setFormData] = useState({
    layanan_id: '',
    nama_acara: '',
    tanggal_pelaksanaan: '',
    tanggal_selesai_pelaksanaan: '',
    jam_mulai: '',
    lokasi_acara: '',
    deskripsi_kebutuhan: '',
    catatan_pengguna: ''
  })
  
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  
  const headerRef = useRef(null)
  const isHeaderInView = useInView(headerRef, { once: true })
  
  const formRef = useRef(null)
  const isFormInView = useInView(formRef, { once: true })
  
  // Fetch layanan for dropdown
  const { data: layananList, isLoading: loadingLayanan } = useQuery(
    'layanan-list',
    () => layananService.getAll({ limit: 100 }),
    {
      select: (data) => data.data.data.layanan
    }
  )

  // Create pemesanan mutation
  const createPemesananMutation = useMutation(pemesananService.create, {
    onSuccess: (data) => {
      toast.success('Pemesanan berhasil dibuat')
      navigate(`/pengguna/pemesanan`)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Gagal membuat pemesanan')
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    createPemesananMutation.mutate(formData)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount)
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <ShoppingCart className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Login untuk Memesan Layanan
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-center max-w-md">
          Anda perlu login terlebih dahulu untuk memesan layanan.
        </p>
        <div className="flex space-x-4">
          <Link to="/pengguna/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors"
            >
              Login
            </motion.button>
          </Link>
          <Link to="/pengguna/register">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 px-6 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Register
            </motion.button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Back button */}
      <div>
        <Link 
          to="/pengguna/pemesanan"
          className="inline-flex items-center text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Pemesanan
        </Link>
      </div>
      
      {/* Header */}
      <section ref={headerRef}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Pesan Layanan
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Isi form di bawah ini untuk memesan layanan
          </p>
        </motion.div>
      </section>
      
      {/* Form */}
      <section ref={formRef}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isFormInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Layanan *
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  name="layanan_id"
                  value={formData.layanan_id}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="">Pilih Layanan</option>
                  {loadingLayanan ? (
                    <option disabled>Loading...</option>
                  ) : (
                    layananList?.map((layanan) => (
                      <option key={layanan.id} value={layanan.id}>
                        {layanan.nama_layanan} - {formatCurrency(layanan.harga_minimal)}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nama Acara *
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="nama_acara"
                  value={formData.nama_acara}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Contoh: Pernikahan Andi & Rina"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tanggal Pelaksanaan *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    name="tanggal_pelaksanaan"
                    value={formData.tanggal_pelaksanaan}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tanggal Selesai Pelaksanaan
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    name="tanggal_selesai_pelaksanaan"
                    value={formData.tanggal_selesai_pelaksanaan}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Opsional, isi jika acara berlangsung lebih dari 1 hari
                </p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Jam Mulai *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="time"
                  name="jam_mulai"
                  value={formData.jam_mulai}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Lokasi Acara *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <textarea
                  name="lokasi_acara"
                  value={formData.lokasi_acara}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Alamat lengkap lokasi acara"
                  rows={2}
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Deskripsi Kebutuhan *
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <textarea
                  name="deskripsi_kebutuhan"
                  value={formData.deskripsi_kebutuhan}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Jelaskan kebutuhan Anda secara detail"
                  rows={4}
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Catatan Tambahan
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <textarea
                  name="catatan_pengguna"
                  value={formData.catatan_pengguna}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Catatan tambahan (opsional)"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3" />
                <div>
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-300">
                    Informasi Penting
                  </h4>
                  <ul className="list-disc list-inside text-sm text-yellow-700 dark:text-yellow-400 mt-1 space-y-1">
                    <li>Pemesanan akan divalidasi oleh admin dalam 1x24 jam</li>
                    <li>Setelah divalidasi, Anda akan menerima invoice untuk pembayaran DP</li>
                    <li>Meeting akan dijadwalkan setelah pembayaran DP diterima</li>
                    <li>Pembatalan pemesanan hanya dapat dilakukan sebelum pembayaran DP</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <Link to="/pengguna/pemesanan">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 px-6 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Batal
                </motion.button>
              </Link>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={createPemesananMutation.isLoading}
                className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center disabled:opacity-50"
              >
                {createPemesananMutation.isLoading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Memproses...
                  </div>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Pesan Sekarang
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </section>
    </div>
  )
}

export default UserPemesananBaruPage
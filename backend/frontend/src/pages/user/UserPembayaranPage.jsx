import React, { useState, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { 
  CreditCard, 
  ArrowLeft, 
  Upload, 
  DollarSign, 
  CheckCircle, 
  AlertCircle,
  Download,
  FileText,
  Clock,
  Calendar,
  ShoppingCart
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { pembayaranService, pemesananService, documentService } from '../../services/api'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'

const UserPembayaranPage = () => {
  const { pemesananId } = useParams()
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [jenisPembayaran, setJenisPembayaran] = useState('dp')
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()
  
  const headerRef = useRef(null)
  const isHeaderInView = useInView(headerRef, { once: true })
  
  const formRef = useRef(null)
  const isFormInView = useInView(formRef, { once: true })
  
  const historyRef = useRef(null)
  const isHistoryInView = useInView(historyRef, { once: true })
  
  // Fetch pemesanan detail
  const { data: pemesanan, isLoading: loadingPemesanan } = useQuery(
    ['pemesanan', pemesananId],
    () => pemesananService.getById(pemesananId),
    {
      enabled: !!pemesananId && isAuthenticated,
      select: (data) => data.data.data
    }
  )

  // Fetch pembayaran history
  const { data: pembayaranHistory, isLoading: loadingHistory } = useQuery(
    ['pembayaran-history', pemesananId],
    () => pembayaranService.getByPemesanan(pemesananId),
    {
      enabled: !!pemesananId && isAuthenticated,
      select: (data) => data.data.data
    }
  )

  // Fetch documents
  const { data: documents, isLoading: loadingDocuments } = useQuery(
    ['documents', pemesananId],
    () => documentService.getOrderDocuments(pemesananId),
    {
      enabled: !!pemesananId && isAuthenticated,
      select: (data) => data.data.data
    }
  )

  // Create pembayaran mutation
  const createPembayaranMutation = useMutation(pembayaranService.create, {
    onSuccess: () => {
      queryClient.invalidateQueries(['pembayaran-history', pemesananId])
      toast.success('Pembayaran berhasil dibuat')
      setFile(null)
      setPreview(null)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Gagal membuat pembayaran')
    }
  })

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

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!file) {
      toast.error('Bukti pembayaran harus diupload')
      return
    }
    
    const formData = new FormData()
    formData.append('pemesanan_id', pemesananId)
    formData.append('jenis_pembayaran', jenisPembayaran)
    formData.append('total_biaya', calculateAmount())
    formData.append('metode', 'transfer melalui BCA DENGAN NO REKENING 1234567890')
    formData.append('bukti_pembayaran', file)
    
    createPembayaranMutation.mutate(formData)
  }

  const calculateAmount = () => {
    if (!pemesanan) return 0
    
    const total = pemesanan.total_tagihan
    
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount)
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': { label: 'Menunggu Verifikasi', class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' },
      'lunas': { label: 'Lunas', class: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
      'cicilan': { label: 'Cicilan', class: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
      'gagal': { label: 'Gagal', class: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' }
    }
    const statusInfo = statusMap[status] || { label: status, class: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300' }
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.class}`}>
        {statusInfo.label}
      </span>
    )
  }

  const getJenisBadge = (jenis) => {
    const jenisMap = {
      'dp': { label: 'DP (25%)', class: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
      'pelunasan': { label: 'Pelunasan (75%)', class: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' },
      'full': { label: 'Full (100%)', class: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' }
    }
    const jenisInfo = jenisMap[jenis] || { label: jenis, class: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300' }
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${jenisInfo.class}`}>
        {jenisInfo.label}
      </span>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <CreditCard className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Login untuk Melakukan Pembayaran
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-center max-w-md">
          Anda perlu login terlebih dahulu untuk melakukan pembayaran.
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
            Pembayaran
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Lakukan pembayaran untuk pemesanan Anda
          </p>
        </motion.div>
      </section>
      
      {loadingPemesanan ? (
        <div className="space-y-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
          
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        </div>
      ) : !pemesanan ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            Pemesanan Tidak Ditemukan
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Pemesanan yang Anda cari tidak ditemukan atau Anda tidak memiliki akses.
          </p>
          <Link to="/pengguna/pemesanan">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors"
            >
              Lihat Pemesanan Saya
            </motion.button>
          </Link>
        </div>
      ) : (
        <>
          {/* Order Info */}
          <section>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Informasi Pemesanan
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Kode Pemesanan</p>
                  <p className="font-medium text-gray-900 dark:text-white">{pemesanan.kode_pemesanan}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Nama Acara</p>
                  <p className="font-medium text-gray-900 dark:text-white">{pemesanan.nama_acara}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Layanan</p>
                  <p className="font-medium text-gray-900 dark:text-white">{pemesanan.nama_layanan}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Tanggal Pelaksanaan</p>
                  <p className="font-medium text-gray-900 dark:text-white">{formatDate(pemesanan.tanggal_pelaksanaan)}</p>
                </div>
                
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Tagihan</p>
                  <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {formatCurrency(pemesanan.total_tagihan)}
                  </p>
                </div>
              </div>
            </motion.div>
          </section>
          
          {/* Payment Form */}
          <section ref={formRef}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isFormInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Form Pembayaran
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Jenis Pembayaran
                  </label>
                  <select
                    value={jenisPembayaran}
                    onChange={(e) => setJenisPembayaran(e.target.value)}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="dp">DP (25%)</option>
                    <option value="pelunasan">Pelunasan (75%)</option>
                    <option value="full">Full Payment (100%)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Jumlah Pembayaran
                  </label>
                  <div className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-medium">
                    {formatCurrency(calculateAmount())}
                  </div>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {jenisPembayaran === 'dp' ? '25% dari total tagihan' : 
                     jenisPembayaran === 'pelunasan' ? '75% dari total tagihan' : 
                     '100% dari total tagihan'}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Metode Pembayaran
                  </label>
                  <div className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white">
                    Transfer BCA - 1234567890
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bukti Pembayaran
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      {preview ? (
                        <div className="mb-3">
                          <img src={preview} alt="Preview" className="mx-auto h-32 object-cover" />
                        </div>
                      ) : (
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      )}
                      <div className="flex text-sm text-gray-600 dark:text-gray-400">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
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
                      <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, JPEG, PDF hingga 10MB</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Catatan:</strong> Pembayaran akan diverifikasi oleh admin dalam 1x24 jam. 
                    Pastikan bukti pembayaran jelas dan sesuai dengan jumlah yang ditransfer.
                  </p>
                </div>
                
                <div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={createPembayaranMutation.isLoading || !file}
                    className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {createPembayaranMutation.isLoading ? (
                      <div className="flex items-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Memproses...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <DollarSign className="w-5 h-5 mr-2" />
                        Kirim Pembayaran
                      </div>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </section>
          
          {/* Payment History */}
          <section ref={historyRef}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHistoryInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Riwayat Pembayaran
              </h2>
              
              {loadingHistory ? (
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : !pembayaranHistory || pembayaranHistory.length === 0 ? (
                <div className="text-center py-8">
                  <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Belum ada riwayat pembayaran
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pembayaranHistory.map((pembayaran, index) => (
                    <motion.div
                      key={pembayaran.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isHistoryInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.1 * index, duration: 0.5 }}
                      className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <div className="flex items-center mb-2">
                            <h3 className="font-medium text-gray-900 dark:text-white mr-3">
                              Pembayaran #{pembayaran.urutan}
                            </h3>
                            {getStatusBadge(pembayaran.status)}
                            {getJenisBadge(pembayaran.jenis_pembayaran)}
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-1">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>{formatDate(pembayaran.tanggal_pembayaran || pembayaran.dibuat_pada)}</span>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <DollarSign className="w-4 h-4 mr-1" />
                            <span>{formatCurrency(pembayaran.total_biaya)}</span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          {pembayaran.url_bukti_pembayaran && (
                            <a 
                              href={`http://localhost:5000/uploads/payments/${pembayaran.url_bukti_pembayaran}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200 p-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                              title="Lihat Bukti Pembayaran"
                            >
                              <Eye className="w-4 h-4" />
                            </a>
                          )}
                          
                          {pembayaran.status === 'lunas' && documents?.documents?.kwitansi?.length > 0 && (
                            <a 
                              href={documents.documents.kwitansi[0].url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-primary-600 text-white p-2 rounded-md hover:bg-primary-700 transition-colors"
                              title="Download Kwitansi"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                      
                      {pembayaran.status === 'pending' && (
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                          <div className="flex items-center text-yellow-600 dark:text-yellow-400">
                            <Clock className="w-4 h-4 mr-2" />
                            <span className="text-sm">Menunggu verifikasi admin (1x24 jam)</span>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </section>
          
          {/* Documents */}
          <section>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHistoryInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Dokumen
              </h2>
              
              {loadingDocuments ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : !documents || (!documents.documents.invoice && !documents.documents.mou && (!documents.documents.kwitansi || documents.documents.kwitansi.length === 0)) ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Belum ada dokumen tersedia
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {documents.documents.invoice && (
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Invoice</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {documents.documents.invoice.filename}
                          </p>
                        </div>
                      </div>
                      <a 
                        href={documents.documents.invoice.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-primary-600 text-white p-2 rounded-md hover:bg-primary-700 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                  
                  {documents.documents.mou && (
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">MoU</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {documents.documents.mou.filename}
                          </p>
                        </div>
                      </div>
                      <a 
                        href={documents.documents.mou.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-primary-600 text-white p-2 rounded-md hover:bg-primary-700 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                  
                  {documents.documents.kwitansi && documents.documents.kwitansi.length > 0 && (
                    documents.documents.kwitansi.map((kwitansi, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-3" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Kwitansi #{index + 1}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {kwitansi.filename}
                            </p>
                          </div>
                        </div>
                        <a 
                          href={kwitansi.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-primary-600 text-white p-2 rounded-md hover:bg-primary-700 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </div>
                    ))
                  )}
                </div>
              )}
            </motion.div>
          </section>
        </>
      )}
    </div>
  )
}

export default UserPembayaranPage
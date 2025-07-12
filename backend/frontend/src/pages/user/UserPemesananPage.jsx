import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { 
  ShoppingCart, 
  Search, 
  Plus, 
  Eye, 
  FileText, 
  Download,
  Clock,
  Calendar,
  MapPin,
  Tag,
  CheckCircle,
  XCircle,
  Filter
} from 'lucide-react'
import { useQuery } from 'react-query'
import { pemesananService, documentService } from '../../services/api'
import { useAuth } from '../../hooks/useAuth'
import UserOrderTracker from '../../components/user/UserOrderTracker'

const UserPemesananPage = () => {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [selectedPemesanan, setSelectedPemesanan] = useState(null)
  const [showModal, setShowModal] = useState(false)
  
  const { isAuthenticated } = useAuth()
  
  const headerRef = useRef(null)
  const isHeaderInView = useInView(headerRef, { once: true })
  
  const ordersRef = useRef(null)
  const isOrdersInView = useInView(ordersRef, { once: true })
  
  // Fetch pemesanan data
  const { data, isLoading, error } = useQuery(
    ['pemesanan', { page, search, status }],
    () => pemesananService.getAll({ page, limit: 10, search, status }),
    {
      keepPreviousData: true,
      select: (data) => data.data.data,
      enabled: isAuthenticated
    }
  )

  // Fetch documents for selected pemesanan
  const { data: documents, isLoading: loadingDocuments } = useQuery(
    ['documents', selectedPemesanan?.id],
    () => documentService.getOrderDocuments(selectedPemesanan?.id),
    {
      enabled: !!selectedPemesanan?.id && showModal,
      select: (data) => data.data.data
    }
  )

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount)
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      'menunggu_validasi_admin': { label: 'Menunggu Validasi', class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' },
      'tervalidasi': { label: 'Tervalidasi', class: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
      'dibatalkan': { label: 'Dibatalkan', class: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' }
    }
    const statusInfo = statusMap[status] || { label: status, class: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300' }
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.class}`}>
        {statusInfo.label}
      </span>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <ShoppingCart className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Login untuk Melihat Pemesanan
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-center max-w-md">
          Anda perlu login terlebih dahulu untuk melihat dan mengelola pemesanan Anda.
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
      {/* Header */}
      <section ref={headerRef}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Pemesanan Saya
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Kelola dan lacak status pemesanan layanan Anda
            </p>
          </div>
          
          <Link to="/pengguna/pemesanan/baru">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Pesan Layanan
            </motion.button>
          </Link>
        </motion.div>
      </section>
      
      {/* Filters and Search */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cari pemesanan..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="text-gray-400 w-5 h-5" />
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Semua Status</option>
                <option value="menunggu_validasi_admin">Menunggu Validasi</option>
                <option value="tervalidasi">Tervalidasi</option>
                <option value="dibatalkan">Dibatalkan</option>
              </select>
            </div>
          </div>
        </div>
      </motion.section>
      
      {/* Orders List */}
      <section ref={ordersRef}>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  </div>
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <p className="text-red-600 dark:text-red-400">
              Gagal memuat data pemesanan. Silakan coba lagi nanti.
            </p>
          </div>
        ) : data?.pemesanan?.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              Belum Ada Pemesanan
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Anda belum memiliki pemesanan. Mulai dengan memesan layanan yang Anda butuhkan.
            </p>
            <Link to="/pengguna/layanan">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors"
              >
                Lihat Layanan
              </motion.button>
            </Link>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isOrdersInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="space-y-4"
          >
            {data?.pemesanan?.map((pemesanan, index) => (
              <motion.div
                key={pemesanan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isOrdersInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mr-3">
                          {pemesanan.nama_acara}
                        </h3>
                        {getStatusBadge(pemesanan.status)}
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                        Kode Pemesanan: <span className="font-medium">{pemesanan.kode_pemesanan}</span>
                      </p>
                      
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Kode Tracking: <span className="font-medium">{pemesanan.kode_tracking}</span>
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-primary-600 dark:text-primary-400 font-semibold mb-1">
                        {formatCurrency(pemesanan.total_tagihan)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(pemesanan.dibuat_pada)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center">
                      <Tag className="w-5 h-5 text-gray-400 mr-2" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {pemesanan.nama_layanan}
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {formatDate(pemesanan.tanggal_pelaksanaan)}
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 text-gray-400 mr-2" />
                      <span className="text-gray-600 dark:text-gray-400 truncate">
                        {pemesanan.lokasi_acara}
                      </span>
                    </div>
                  </div>
                  
                  <UserOrderTracker 
                    status={pemesanan.status}
                    createdAt={pemesanan.dibuat_pada}
                    validatedAt={pemesanan.status === 'tervalidasi' ? pemesanan.diperbarui_pada : null}
                    cancelledAt={pemesanan.status === 'dibatalkan' ? pemesanan.diperbarui_pada : null}
                  />
                  
                  <div className="flex justify-end space-x-3 mt-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedPemesanan(pemesanan)
                        setShowModal(true)
                      }}
                      className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Detail
                    </motion.button>
                    
                    {pemesanan.status === 'tervalidasi' && (
                      <Link to={`/pengguna/pembayaran/${pemesanan.id}`}>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Bayar
                        </motion.button>
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Pagination */}
            {data?.pagination && data.pagination.total_pages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className={`px-4 py-2 rounded-md ${
                      page === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    Sebelumnya
                  </button>
                  
                  {[...Array(data.pagination.total_pages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-10 h-10 rounded-md ${
                        page === i + 1
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === data.pagination.total_pages}
                    className={`px-4 py-2 rounded-md ${
                      page === data.pagination.total_pages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    Selanjutnya
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </section>
      
      {/* Detail Modal */}
      {showModal && selectedPemesanan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Detail Pemesanan
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Order Info */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Kode Pemesanan</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedPemesanan.kode_pemesanan}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Kode Tracking</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedPemesanan.kode_tracking}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                      <div>{getStatusBadge(selectedPemesanan.status)}</div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Tanggal Pemesanan</p>
                      <p className="font-medium text-gray-900 dark:text-white">{formatDate(selectedPemesanan.dibuat_pada)}</p>
                    </div>
                  </div>
                </div>
                
                {/* Event Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Detail Acara
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Nama Acara</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedPemesanan.nama_acara}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Layanan</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedPemesanan.nama_layanan}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Tanggal Pelaksanaan</p>
                      <p className="font-medium text-gray-900 dark:text-white">{formatDate(selectedPemesanan.tanggal_pelaksanaan)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Jam Mulai</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedPemesanan.jam_mulai}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Lokasi Acara</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedPemesanan.lokasi_acara}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Deskripsi Kebutuhan</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedPemesanan.deskripsi_kebutuhan}</p>
                    </div>
                  </div>
                </div>
                
                {/* Payment Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Informasi Pembayaran
                  </h3>
                  
                  <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Tagihan</p>
                        <p className="text-xl font-semibold text-primary-600 dark:text-primary-400">
                          {formatCurrency(selectedPemesanan.total_tagihan)}
                        </p>
                      </div>
                      
                      <div className="flex space-x-3">
                        {selectedPemesanan.status === 'tervalidasi' && (
                          <Link to={`/pengguna/pembayaran/${selectedPemesanan.id}`}>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center"
                            >
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Bayar Sekarang
                            </motion.button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Documents */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Dokumen
                  </h3>
                  
                  {loadingDocuments ? (
                    <div className="animate-pulse space-y-2">
                      <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  ) : documents ? (
                    <div className="space-y-3">
                      {documents.documents.invoice && (
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
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
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
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
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
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
                      
                      {!documents.documents.invoice && !documents.documents.mou && (!documents.documents.kwitansi || documents.documents.kwitansi.length === 0) && (
                        <div className="text-center py-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-600 dark:text-gray-400">
                            Belum ada dokumen tersedia
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 dark:text-gray-400">
                        Belum ada dokumen tersedia
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Order Tracker */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Status Pemesanan
                  </h3>
                  
                  <UserOrderTracker 
                    status={selectedPemesanan.status}
                    createdAt={selectedPemesanan.dibuat_pada}
                    validatedAt={selectedPemesanan.status === 'tervalidasi' ? selectedPemesanan.diperbarui_pada : null}
                    cancelledAt={selectedPemesanan.status === 'dibatalkan' ? selectedPemesanan.diperbarui_pada : null}
                  />
                </div>
              </div>
              
              <div className="flex justify-end mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowModal(false)}
                  className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Tutup
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default UserPemesananPage
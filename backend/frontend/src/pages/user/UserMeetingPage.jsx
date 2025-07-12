import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { 
  Calendar, 
  Search, 
  Video, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  FileText,
  Download,
  ExternalLink,
  Filter
} from 'lucide-react'
import { useQuery } from 'react-query'
import { meetingService, documentService } from '../../services/api'
import { useAuth } from '../../hooks/useAuth'

const UserMeetingPage = () => {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [selectedMeeting, setSelectedMeeting] = useState(null)
  const [showModal, setShowModal] = useState(false)
  
  const { isAuthenticated } = useAuth()
  
  const headerRef = useRef(null)
  const isHeaderInView = useInView(headerRef, { once: true })
  
  const meetingsRef = useRef(null)
  const isMeetingsInView = useInView(meetingsRef, { once: true })
  
  // Fetch meeting data
  const { data, isLoading, error } = useQuery(
    ['meeting', { page, search, status }],
    () => meetingService.getAll({ page, limit: 10, search, status }),
    {
      keepPreviousData: true,
      select: (data) => data.data.data,
      enabled: isAuthenticated
    }
  )

  // Fetch documents for selected meeting
  const { data: documents, isLoading: loadingDocuments } = useQuery(
    ['documents', selectedMeeting?.pemesanan_id],
    () => documentService.getOrderDocuments(selectedMeeting?.pemesanan_id),
    {
      enabled: !!selectedMeeting?.pemesanan_id && showModal,
      select: (data) => data.data.data
    }
  )

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      'dijadwalkan': { label: 'Dijadwalkan', class: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
      'selesai': { label: 'Selesai', class: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
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
        <Calendar className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Login untuk Melihat Meeting
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-center max-w-md">
          Anda perlu login terlebih dahulu untuk melihat dan mengelola jadwal meeting Anda.
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
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Meeting Saya
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Kelola jadwal meeting dengan tim MKVI
          </p>
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
                  placeholder="Cari meeting..."
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
                <option value="dijadwalkan">Dijadwalkan</option>
                <option value="selesai">Selesai</option>
                <option value="dibatalkan">Dibatalkan</option>
              </select>
            </div>
          </div>
        </div>
      </motion.section>
      
      {/* Meetings List */}
      <section ref={meetingsRef}>
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
              Gagal memuat data meeting. Silakan coba lagi nanti.
            </p>
          </div>
        ) : data?.meetings?.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              Belum Ada Meeting
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Anda belum memiliki jadwal meeting. Meeting akan dijadwalkan oleh admin setelah pemesanan Anda divalidasi.
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isMeetingsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="space-y-4"
          >
            {data?.meetings?.map((meeting, index) => (
              <motion.div
                key={meeting.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isMeetingsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mr-3">
                          {meeting.nama_acara}
                        </h3>
                        {getStatusBadge(meeting.status)}
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                        Kode Pemesanan: <span className="font-medium">{meeting.kode_pemesanan}</span>
                      </p>
                      
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Layanan: <span className="font-medium">{meeting.nama_layanan}</span>
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSelectedMeeting(meeting)
                          setShowModal(true)
                        }}
                        className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
                      >
                        Detail Meeting
                      </motion.button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center">
                      <Video className="w-5 h-5 text-gray-400 mr-2" />
                      <span className="text-gray-600 dark:text-gray-400 capitalize">
                        Platform: {meeting.platform?.replace('_', ' ')}
                      </span>
                    </div>
                    
                    {meeting.waktu_mulai && (
                      <div className="flex items-center">
                        <Clock className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="text-gray-600 dark:text-gray-400">
                          {formatDateTime(meeting.waktu_mulai)}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center">
                      <User className="w-5 h-5 text-gray-400 mr-2" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {meeting.nama_client || 'Belum ada data client'}
                      </span>
                    </div>
                  </div>
                  
                  {meeting.calendly_link && (
                    <div className="mt-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Calendar className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-2" />
                          <span className="text-gray-900 dark:text-white font-medium">
                            Jadwalkan Meeting
                          </span>
                        </div>
                        
                        <a 
                          href={meeting.calendly_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Pilih Jadwal
                        </a>
                      </div>
                    </div>
                  )}
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
      {showModal && selectedMeeting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Detail Meeting
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
                {/* Meeting Info */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Kode Pemesanan</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedMeeting.kode_pemesanan}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                      <div>{getStatusBadge(selectedMeeting.status)}</div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Nama Acara</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedMeeting.nama_acara}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Layanan</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedMeeting.nama_layanan}</p>
                    </div>
                  </div>
                </div>
                
                {/* Meeting Schedule */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Jadwal Meeting
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Platform</p>
                      <p className="font-medium text-gray-900 dark:text-white capitalize">
                        {selectedMeeting.platform?.replace('_', ' ')}
                      </p>
                    </div>
                    
                    {selectedMeeting.waktu_mulai && (
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Waktu Mulai</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {formatDateTime(selectedMeeting.waktu_mulai)}
                        </p>
                      </div>
                    )}
                    
                    {selectedMeeting.waktu_selesai && (
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Waktu Selesai</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {formatDateTime(selectedMeeting.waktu_selesai)}
                        </p>
                      </div>
                    )}
                    
                    {selectedMeeting.calendly_link && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Link Calendly</p>
                        <div className="flex items-center mt-1">
                          <a 
                            href={selectedMeeting.calendly_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 flex items-center"
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Pilih Jadwal Meeting
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Client Info */}
                {(selectedMeeting.nama_client || selectedMeeting.email_client || selectedMeeting.no_wa_client) && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Informasi Client
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedMeeting.nama_client && (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Nama Client</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {selectedMeeting.nama_client}
                          </p>
                        </div>
                      )}
                      
                      {selectedMeeting.email_client && (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Email Client</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {selectedMeeting.email_client}
                          </p>
                        </div>
                      )}
                      
                      {selectedMeeting.no_wa_client && (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">No. WhatsApp Client</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {selectedMeeting.no_wa_client}
                          </p>
                        </div>
                      )}
                      
                      {selectedMeeting.pekerjaan_client && (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Pekerjaan Client</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {selectedMeeting.pekerjaan_client}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
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
                      
                      {(!documents.documents.mou) && (
                        <div className="text-center py-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-600 dark:text-gray-400">
                            Belum ada dokumen MoU tersedia
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
                
                {/* Notes */}
                {selectedMeeting.catatan && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Catatan
                    </h3>
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-gray-600 dark:text-gray-400">
                        {selectedMeeting.catatan}
                      </p>
                    </div>
                  </div>
                )}
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

export default UserMeetingPage
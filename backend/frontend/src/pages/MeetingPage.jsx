import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  Search, 
  Plus, 
  Eye,
  Edit,
  Trash2,
  Video,
  Clock,
  User,
  Mail,
  Phone,
  Briefcase,
  CheckCircle,
  XCircle,
  Link as LinkIcon
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { meetingService, pemesananService } from '../services/api'
import toast from 'react-hot-toast'
import DocumentManager from '../components/DocumentManager'
import EmailManager from '../components/EmailManager'

const MeetingPage = () => {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [selectedMeeting, setSelectedMeeting] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('view')
  const [formData, setFormData] = useState({
    pemesanan_id: '',
    pengguna_id: '',
    platform: 'google_meet',
    calendly_link: '',
    catatan: ''
  })
  
  const queryClient = useQueryClient()

  // Fetch meeting data
  const { data, isLoading, error } = useQuery(
    ['meeting', { page, search, status }],
    () => meetingService.getAll({ page, limit: 10, search, status }),
    {
      keepPreviousData: true,
      select: (data) => data.data.data
    }
  )

  // Fetch validated pemesanan for dropdown
  const { data: pemesananList } = useQuery(
    'pemesanan-validated',
    () => pemesananService.getAll({ status: 'tervalidasi', limit: 100 }),
    {
      select: (data) => data.data.data.pemesanan
    }
  )

  // Create mutation
  const createMutation = useMutation(meetingService.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('meeting')
      toast.success('Meeting berhasil dijadwalkan')
      setShowModal(false)
      resetForm()
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Gagal menjadwalkan meeting')
    }
  })

  // Update status mutation
  const updateStatusMutation = useMutation(
    ({ id, status }) => meetingService.updateStatus(id, status),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('meeting')
        toast.success('Status meeting berhasil diperbarui')
        setShowModal(false)
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Gagal memperbarui status')
      }
    }
  )

  // Delete mutation
  const deleteMutation = useMutation(meetingService.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries('meeting')
      toast.success('Meeting berhasil dihapus')
      setShowModal(false)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Gagal menghapus meeting')
    }
  })

  const resetForm = () => {
    setFormData({
      pemesanan_id: '',
      pengguna_id: '',
      platform: 'google_meet',
      calendly_link: '',
      catatan: ''
    })
    setSelectedMeeting(null)
  }

  const handleCreate = () => {
    setModalType('create')
    resetForm()
    setShowModal(true)
  }

  const handleView = (meeting) => {
    setSelectedMeeting(meeting)
    setModalType('view')
    setShowModal(true)
  }

  const handleUpdateStatus = (meeting, newStatus) => {
    setSelectedMeeting(meeting)
    updateStatusMutation.mutate({ id: meeting.id, status: newStatus })
  }

  const handleDelete = (meeting) => {
    setSelectedMeeting(meeting)
    setModalType('delete')
    setShowModal(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    createMutation.mutate(formData)
  }

  const confirmDelete = () => {
    if (selectedMeeting) {
      deleteMutation.mutate(selectedMeeting.id)
    }
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      'dijadwalkan': { label: 'Dijadwalkan', class: 'badge-warning' },
      'selesai': { label: 'Selesai', class: 'badge-success' },
      'dibatalkan': { label: 'Dibatalkan', class: 'badge-danger' }
    }
    const statusInfo = statusMap[status] || { label: status, class: 'badge-secondary' }
    return (
      <span className={`badge ${statusInfo.class}`}>
        {statusInfo.label}
      </span>
    )
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

  const handlePemesananChange = (e) => {
    const pemesananId = e.target.value
    const selectedPemesanan = pemesananList?.find(p => p.id == pemesananId)
    
    setFormData({
      ...formData,
      pemesanan_id: pemesananId,
      pengguna_id: selectedPemesanan?.pengguna_id || ''
    })
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <Calendar className="w-8 h-8 mr-3 text-primary-600" />
            Manajemen Meeting
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Kelola jadwal meeting dengan klien
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCreate}
          className="btn btn-primary btn-md"
        >
          <Plus className="w-4 h-4 mr-2" />
          Jadwalkan Meeting
        </motion.button>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="card-content">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cari meeting..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="select"
            >
              <option value="">Semua Status</option>
              <option value="dijadwalkan">Dijadwalkan</option>
              <option value="selesai">Selesai</option>
              <option value="dibatalkan">Dibatalkan</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Meeting Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {isLoading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="card-content">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : error ? (
          <div className="card">
            <div className="card-content text-center py-8">
              <p className="text-red-600 dark:text-red-400">
                Gagal memuat data meeting
              </p>
            </div>
          </div>
        ) : data?.meetings?.length === 0 ? (
          <div className="card">
            <div className="card-content text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Belum Ada Meeting
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Belum ada meeting yang dijadwalkan. Mulai dengan menjadwalkan meeting pertama.
              </p>
              <button
                onClick={handleCreate}
                className="btn btn-primary btn-md"
              >
                <Plus className="w-4 h-4 mr-2" />
                Jadwalkan Meeting
              </button>
            </div>
          </div>
        ) : (
          data?.meetings?.map((meeting, index) => (
            <motion.div
              key={meeting.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card hover:shadow-lg transition-shadow"
            >
              <div className="card-content">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {meeting.nama_acara}
                        </h3>
                        {getStatusBadge(meeting.status)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-2" />
                            <span>{meeting.pengguna_nama}</span>
                          </div>
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-2" />
                            <span>{meeting.pengguna_email}</span>
                          </div>
                          {meeting.nama_client && (
                            <div className="flex items-center">
                              <User className="w-4 h-4 mr-2" />
                              <span>Client: {meeting.nama_client}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Video className="w-4 h-4 mr-2" />
                            <span className="capitalize">{meeting.platform?.replace('_', ' ')}</span>
                          </div>
                          {meeting.waktu_mulai && (
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-2" />
                              <span>{formatDateTime(meeting.waktu_mulai)}</span>
                            </div>
                          )}
                          {meeting.calendly_link && (
                            <div className="flex items-center">
                              <LinkIcon className="w-4 h-4 mr-2" />
                              <a 
                                href={meeting.calendly_link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                              >
                                Link Calendly
                              </a>
                            </div>
                          )}
                        </div>
                      </div>

                      {meeting.email_client && (
                        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                            Informasi Client
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center">
                              <Mail className="w-3 h-3 mr-2" />
                              <span>{meeting.email_client}</span>
                            </div>
                            {meeting.no_wa_client && (
                              <div className="flex items-center">
                                <Phone className="w-3 h-3 mr-2" />
                                <span>{meeting.no_wa_client}</span>
                              </div>
                            )}
                            {meeting.pekerjaan_client && (
                              <div className="flex items-center">
                                <Briefcase className="w-3 h-3 mr-2" />
                                <span>{meeting.pekerjaan_client}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleView(meeting)}
                      className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {meeting.status === 'dijadwalkan' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(meeting, 'selesai')}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          title="Tandai Selesai"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(meeting, 'dibatalkan')}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title="Batalkan"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(meeting)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Pagination */}
      {data?.pagination && data.pagination.total_pages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Menampilkan {((page - 1) * 10) + 1} - {Math.min(page * 10, data.pagination.total_items)} dari {data.pagination.total_items} meeting
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="btn btn-secondary btn-sm disabled:opacity-50"
            >
              Sebelumnya
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === data.pagination.total_pages}
              className="btn btn-secondary btn-sm disabled:opacity-50"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {modalType === 'view' && selectedMeeting && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Detail Meeting
                </h3>
                
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Kode Pemesanan</label>
                      <p className="text-gray-900 dark:text-white">{selectedMeeting.kode_pemesanan}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                      <div className="mt-1">
                        {getStatusBadge(selectedMeeting.status)}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Platform</label>
                      <p className="text-gray-900 dark:text-white capitalize">{selectedMeeting.platform?.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Terkirim</label>
                      <p className="text-gray-900 dark:text-white">{selectedMeeting.email_terkirim ? 'Ya' : 'Tidak'}</p>
                    </div>
                  </div>

                  {/* Event Details */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Detail Acara</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Nama Acara</label>
                        <p className="text-gray-900 dark:text-white">{selectedMeeting.nama_acara}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Layanan</label>
                        <p className="text-gray-900 dark:text-white">{selectedMeeting.nama_layanan}</p>
                      </div>
                    </div>
                  </div>

                  {/* Meeting Schedule */}
                  {(selectedMeeting.waktu_mulai || selectedMeeting.waktu_selesai) && (
                    <div>
                      <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Jadwal Meeting</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedMeeting.waktu_mulai && (
                          <div>
                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Waktu Mulai</label>
                            <p className="text-gray-900 dark:text-white">{formatDateTime(selectedMeeting.waktu_mulai)}</p>
                          </div>
                        )}
                        {selectedMeeting.waktu_selesai && (
                          <div>
                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Waktu Selesai</label>
                            <p className="text-gray-900 dark:text-white">{formatDateTime(selectedMeeting.waktu_selesai)}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Client Info */}
                  {selectedMeeting.nama_client && (
                    <div>
                      <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Informasi Client</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Nama Client</label>
                          <p className="text-gray-900 dark:text-white">{selectedMeeting.nama_client}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Client</label>
                          <p className="text-gray-900 dark:text-white">{selectedMeeting.email_client}</p>
                        </div>
                        {selectedMeeting.no_wa_client && (
                          <div>
                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">No. WhatsApp</label>
                            <p className="text-gray-900 dark:text-white">{selectedMeeting.no_wa_client}</p>
                          </div>
                        )}
                        {selectedMeeting.pekerjaan_client && (
                          <div>
                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Pekerjaan</label>
                            <p className="text-gray-900 dark:text-white">{selectedMeeting.pekerjaan_client}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Links */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Links</h4>
                    <div className="space-y-3">
                      {selectedMeeting.calendly_link && (
                        <div>
                          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Calendly Link</label>
                          <p className="text-gray-900 dark:text-white">
                            <a 
                              href={selectedMeeting.calendly_link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                            >
                              {selectedMeeting.calendly_link}
                            </a>
                          </p>
                        </div>
                      )}
                      {selectedMeeting.booking_response_link && (
                        <div>
                          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Booking Response Link</label>
                          <p className="text-gray-900 dark:text-white">
                            <a 
                              href={selectedMeeting.booking_response_link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                            >
                              {selectedMeeting.booking_response_link}
                            </a>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedMeeting.catatan && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Catatan</label>
                      <p className="text-gray-900 dark:text-white">{selectedMeeting.catatan}</p>
                    </div>
                  )}

                  {/* Document Management */}
                  <DocumentManager 
                    pemesananId={selectedMeeting.pemesanan_id}
                    meetingId={selectedMeeting.id}
                    type="mou"
                  />

                  {/* Email Management */}
                  <EmailManager 
                    userEmail={selectedMeeting.pengguna_email}
                    userName={selectedMeeting.pengguna_nama}
                    meetingData={selectedMeeting}
                    type="meeting"
                  />
                </div>
                
                <div className="flex justify-between mt-6">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Meeting ID: <span className="font-mono font-medium">MTG-{selectedMeeting.id}</span>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="btn btn-secondary btn-md"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            )}

            {modalType === 'create' && (
              <form onSubmit={handleSubmit} className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Jadwalkan Meeting
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Pemesanan *
                    </label>
                    <select
                      value={formData.pemesanan_id}
                      onChange={handlePemesananChange}
                      className="select"
                      required
                    >
                      <option value="">Pilih Pemesanan</option>
                      {pemesananList?.map((pemesanan) => (
                        <option key={pemesanan.id} value={pemesanan.id}>
                          {pemesanan.kode_pemesanan} - {pemesanan.nama_acara}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Platform Meeting
                    </label>
                    <select
                      value={formData.platform}
                      onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                      className="select"
                    >
                      <option value="google_meet">Google Meet</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Calendly Link
                    </label>
                    <input
                      type="url"
                      value={formData.calendly_link}
                      onChange={(e) => setFormData({ ...formData, calendly_link: e.target.value })}
                      className="input"
                      placeholder="https://calendly.com/your-link"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Link Calendly untuk client memilih jadwal meeting
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Catatan
                    </label>
                    <textarea
                      value={formData.catatan}
                      onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                      className="textarea"
                      rows={3}
                      placeholder="Catatan tambahan untuk meeting..."
                    />
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    type="submit"
                    disabled={createMutation.isLoading}
                    className="btn btn-primary btn-md flex-1"
                  >
                    {createMutation.isLoading ? 'Menjadwalkan...' : 'Jadwalkan Meeting'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn btn-secondary btn-md flex-1"
                  >
                    Batal
                  </button>
                </div>
              </form>
            )}

            {modalType === 'delete' && selectedMeeting && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Hapus Meeting
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Apakah Anda yakin ingin menghapus meeting untuk <strong>{selectedMeeting.nama_acara}</strong>? 
                  Tindakan ini tidak dapat dibatalkan.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={confirmDelete}
                    disabled={deleteMutation.isLoading}
                    className="btn btn-danger btn-md flex-1"
                  >
                    {deleteMutation.isLoading ? 'Menghapus...' : 'Hapus'}
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="btn btn-secondary btn-md flex-1"
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default MeetingPage
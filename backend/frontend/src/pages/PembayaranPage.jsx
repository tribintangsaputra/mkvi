import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  CreditCard, 
  Search, 
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  User,
  Calendar,
  FileText,
  Download,
  Upload
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { pembayaranService, pemesananService, penggunaService } from '../services/api'
import toast from 'react-hot-toast'
import DocumentManager from '../components/DocumentManager'
import EmailManager from '../components/EmailManager'

const PembayaranPage = () => {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [jenisPembayaran, setJenisPembayaran] = useState('')
  const [page, setPage] = useState(1)
  const [selectedPembayaran, setSelectedPembayaran] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('view')
  const [formData, setFormData] = useState({
    pemesanan_id: '',
    pengguna_id: '',
    jenis_pembayaran: '',
    total_biaya: '',
    metode: 'transfer melalui BCA DENGAN NO REKENING 1234567890',
    bukti_pembayaran: null
  })
  
  const queryClient = useQueryClient()

  // Fetch pembayaran data
  const { data, isLoading, error } = useQuery(
    ['pembayaran', { page, search, status, jenis_pembayaran: jenisPembayaran }],
    () => pembayaranService.getAll({ page, limit: 10, search, status, jenis_pembayaran: jenisPembayaran }),
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

  // Fetch pengguna for dropdown
  const { data: penggunaList } = useQuery(
    'pengguna-list',
    () => penggunaService.getAll({ limit: 100 }),
    {
      select: (data) => data.data.data.pengguna
    }
  )

  // Create mutation
  const createMutation = useMutation(pembayaranService.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('pembayaran')
      toast.success('Pembayaran berhasil ditambahkan')
      setShowModal(false)
      resetForm()
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Gagal menambahkan pembayaran')
    }
  })

  // Update mutation
  const updateMutation = useMutation(
    ({ id, data }) => pembayaranService.update(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('pembayaran')
        toast.success('Pembayaran berhasil diperbarui')
        setShowModal(false)
        resetForm()
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Gagal memperbarui pembayaran')
      }
    }
  )

  // Update status mutation
  const updateStatusMutation = useMutation(
    ({ id, status, diverifikasi }) => pembayaranService.updateStatus(id, { status, diverifikasi }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('pembayaran')
        toast.success('Status pembayaran berhasil diperbarui')
        setShowModal(false)
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Gagal memperbarui status')
      }
    }
  )

  // Delete mutation
  const deleteMutation = useMutation(pembayaranService.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries('pembayaran')
      toast.success('Pembayaran berhasil dihapus')
      setShowModal(false)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Gagal menghapus pembayaran')
    }
  })

  const resetForm = () => {
    setFormData({
      pemesanan_id: '',
      pengguna_id: '',
      jenis_pembayaran: '',
      total_biaya: '',
      metode: 'transfer melalui BCA DENGAN NO REKENING 1234567890',
      bukti_pembayaran: null
    })
    setSelectedPembayaran(null)
  }

  const handleCreate = () => {
    setModalType('create')
    resetForm()
    setShowModal(true)
  }

  const handleView = (pembayaran) => {
    setSelectedPembayaran(pembayaran)
    setModalType('view')
    setShowModal(true)
  }

  const handleEdit = (pembayaran) => {
    setSelectedPembayaran(pembayaran)
    setFormData({
      pemesanan_id: pembayaran.pemesanan_id || '',
      pengguna_id: pembayaran.pengguna_id || '',
      jenis_pembayaran: pembayaran.jenis_pembayaran || '',
      total_biaya: pembayaran.total_biaya || '',
      metode: pembayaran.metode || 'transfer melalui BCA DENGAN NO REKENING 1234567890',
      bukti_pembayaran: null
    })
    setModalType('edit')
    setShowModal(true)
  }

  const handleVerify = (pembayaran) => {
    updateStatusMutation.mutate({ 
      id: pembayaran.id, 
      status: 'lunas', 
      diverifikasi: true 
    })
  }

  const handleReject = (pembayaran) => {
    updateStatusMutation.mutate({ 
      id: pembayaran.id, 
      status: 'gagal', 
      diverifikasi: false 
    })
  }

  const handleDelete = (pembayaran) => {
    setSelectedPembayaran(pembayaran)
    setModalType('delete')
    setShowModal(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const submitData = new FormData()
    submitData.append('pemesanan_id', formData.pemesanan_id)
    submitData.append('jenis_pembayaran', formData.jenis_pembayaran)
    submitData.append('total_biaya', formData.total_biaya)
    submitData.append('metode', formData.metode)
    
    if (formData.bukti_pembayaran) {
      submitData.append('bukti_pembayaran', formData.bukti_pembayaran)
    }
    
    if (modalType === 'create') {
      createMutation.mutate(submitData)
    } else if (modalType === 'edit') {
      updateMutation.mutate({ id: selectedPembayaran.id, data: submitData })
    }
  }

  const confirmDelete = () => {
    if (selectedPembayaran) {
      deleteMutation.mutate(selectedPembayaran.id)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({ ...formData, bukti_pembayaran: file })
    }
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

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': { label: 'Pending', class: 'badge-warning' },
      'lunas': { label: 'Lunas', class: 'badge-success' },
      'cicilan': { label: 'Cicilan', class: 'badge-primary' },
      'gagal': { label: 'Gagal', class: 'badge-danger' }
    }
    const statusInfo = statusMap[status] || { label: status, class: 'badge-secondary' }
    return (
      <span className={`badge ${statusInfo.class}`}>
        {statusInfo.label}
      </span>
    )
  }

  const getJenisBadge = (jenis) => {
    const jenisMap = {
      'dp': { label: 'DP (25%)', class: 'badge-primary' },
      'pelunasan': { label: 'Pelunasan (75%)', class: 'badge-success' },
      'full': { label: 'Full (100%)', class: 'badge-secondary' }
    }
    const jenisInfo = jenisMap[jenis] || { label: jenis, class: 'badge-secondary' }
    return (
      <span className={`badge ${jenisInfo.class}`}>
        {jenisInfo.label}
      </span>
    )
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
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
            <CreditCard className="w-8 h-8 mr-3 text-primary-600" />
            Manajemen Pembayaran
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Kelola pembayaran dari pengguna
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCreate}
          className="btn btn-primary btn-md"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Pembayaran
        </motion.button>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="card-content">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cari pembayaran..."
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
              <option value="pending">Pending</option>
              <option value="lunas">Lunas</option>
              <option value="cicilan">Cicilan</option>
              <option value="gagal">Gagal</option>
            </select>
            <select
              value={jenisPembayaran}
              onChange={(e) => setJenisPembayaran(e.target.value)}
              className="select"
            >
              <option value="">Semua Jenis</option>
              <option value="dp">DP (25%)</option>
              <option value="pelunasan">Pelunasan (75%)</option>
              <option value="full">Full (100%)</option>
            </select>
            <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
              Total: {data?.pagination?.total_items || 0} pembayaran
            </div>
          </div>
        </div>
      </motion.div>

      {/* Pembayaran Cards */}
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
                Gagal memuat data pembayaran
              </p>
            </div>
          </div>
        ) : data?.pembayaran?.length === 0 ? (
          <div className="card">
            <div className="card-content text-center py-12">
              <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Belum Ada Pembayaran
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Belum ada pembayaran yang masuk dari pengguna.
              </p>
              <button
                onClick={handleCreate}
                className="btn btn-primary btn-md"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Pembayaran
              </button>
            </div>
          </div>
        ) : (
          data?.pembayaran?.map((pembayaran, index) => (
            <motion.div
              key={pembayaran.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card hover:shadow-lg transition-shadow"
            >
              <div className="card-content">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {pembayaran.kode_pemesanan}
                        </h3>
                        {getStatusBadge(pembayaran.status)}
                        {getJenisBadge(pembayaran.jenis_pembayaran)}
                        {pembayaran.diverifikasi && (
                          <span className="badge badge-success">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Terverifikasi
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-2" />
                            <span>{pembayaran.pengguna_nama}</span>
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-2" />
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {formatCurrency(pembayaran.total_biaya)}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <FileText className="w-4 h-4 mr-2" />
                            <span>{pembayaran.nama_acara}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>{formatDate(pembayaran.tanggal_pembayaran)}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>Urutan: {pembayaran.urutan}</span>
                          </div>
                          <div className="text-xs">
                            <span className="text-gray-500">Sisa: </span>
                            <span className="font-medium">{formatCurrency(pembayaran.sisa_tagihan)}</span>
                          </div>
                        </div>
                      </div>

                      {pembayaran.url_bukti_pembayaran && (
                        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              Bukti Pembayaran
                            </span>
                            <a 
                              href={`http://localhost:5000/uploads/payments/${pembayaran.url_bukti_pembayaran}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 flex items-center text-sm"
                            >
                              <Download className="w-3 h-3 mr-1" />
                              Lihat Bukti
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleView(pembayaran)}
                      className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                      title="Lihat Detail"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(pembayaran)}
                      className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    {pembayaran.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleVerify(pembayaran)}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          title="Verifikasi & Setujui"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleReject(pembayaran)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title="Tolak"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(pembayaran)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      title="Hapus"
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
            Menampilkan {((page - 1) * 10) + 1} - {Math.min(page * 10, data.pagination.total_items)} dari {data.pagination.total_items} pembayaran
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
            className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            {modalType === 'view' && selectedPembayaran && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Detail Pembayaran
                </h3>
                
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Kode Pemesanan</label>
                      <p className="text-gray-900 dark:text-white">{selectedPembayaran.kode_pemesanan}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                      <div className="mt-1">
                        {getStatusBadge(selectedPembayaran.status)}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Jenis Pembayaran</label>
                      <div className="mt-1">
                        {getJenisBadge(selectedPembayaran.jenis_pembayaran)}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Urutan</label>
                      <p className="text-gray-900 dark:text-white">{selectedPembayaran.urutan}</p>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Detail Pembayaran</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Biaya</label>
                        <p className="text-gray-900 dark:text-white font-semibold">
                          {formatCurrency(selectedPembayaran.total_biaya)}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Persentase</label>
                        <p className="text-gray-900 dark:text-white">{selectedPembayaran.persentase_bayar}%</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Sisa Tagihan</label>
                        <p className="text-gray-900 dark:text-white">
                          {formatCurrency(selectedPembayaran.sisa_tagihan)}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Metode</label>
                        <p className="text-gray-900 dark:text-white">{selectedPembayaran.metode}</p>
                      </div>
                    </div>
                  </div>

                  {/* Customer Details */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Detail Pengguna</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Nama Lengkap</label>
                        <p className="text-gray-900 dark:text-white">{selectedPembayaran.pengguna_nama}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                        <p className="text-gray-900 dark:text-white">{selectedPembayaran.pengguna_email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Service Details */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Detail Layanan</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Nama Layanan</label>
                        <p className="text-gray-900 dark:text-white">{selectedPembayaran.nama_layanan}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Nama Acara</label>
                        <p className="text-gray-900 dark:text-white">{selectedPembayaran.nama_acara}</p>
                      </div>
                    </div>
                  </div>

                  {/* Verification Status */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Status Verifikasi</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Diverifikasi</label>
                        <p className="text-gray-900 dark:text-white">
                          {selectedPembayaran.diverifikasi ? 'Ya' : 'Tidak'}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Tanggal Pembayaran</label>
                        <p className="text-gray-900 dark:text-white">
                          {formatDate(selectedPembayaran.tanggal_pembayaran)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Proof */}
                  {selectedPembayaran.url_bukti_pembayaran && (
                    <div>
                      <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Bukti Pembayaran</h4>
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            File bukti pembayaran tersedia
                          </span>
                          <a 
                            href={`http://localhost:5000/uploads/payments/${selectedPembayaran.url_bukti_pembayaran}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary btn-sm"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Lihat Bukti
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Document Management */}
                  <DocumentManager 
                    pemesananId={selectedPembayaran.pemesanan_id}
                    pembayaranId={selectedPembayaran.id}
                    type="kwitansi"
                  />

                  {/* Email Management */}
                  <EmailManager 
                    userEmail={selectedPembayaran.pengguna_email}
                    userName={selectedPembayaran.pengguna_nama}
                    paymentData={selectedPembayaran}
                    type="payment"
                  />
                </div>
                
                <div className="flex justify-between mt-6">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Payment ID: <span className="font-mono font-medium">PAY-{selectedPembayaran.id}</span>
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

            {(modalType === 'create' || modalType === 'edit') && (
              <form onSubmit={handleSubmit} className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {modalType === 'create' ? 'Tambah Pembayaran' : 'Edit Pembayaran'}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      Jenis Pembayaran *
                    </label>
                    <select
                      value={formData.jenis_pembayaran}
                      onChange={(e) => setFormData({ ...formData, jenis_pembayaran: e.target.value })}
                      className="select"
                      required
                    >
                      <option value="">Pilih Jenis</option>
                      <option value="dp">DP (25%)</option>
                      <option value="pelunasan">Pelunasan (75%)</option>
                      <option value="full">Full (100%)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Total Biaya *
                    </label>
                    <input
                      type="number"
                      value={formData.total_biaya}
                      onChange={(e) => setFormData({ ...formData, total_biaya: e.target.value })}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Metode Pembayaran *
                    </label>
                    <select
                      value={formData.metode}
                      onChange={(e) => setFormData({ ...formData, metode: e.target.value })}
                      className="select"
                      required
                    >
                      <option value="transfer melalui BCA DENGAN NO REKENING 1234567890">
                        Transfer BCA - 1234567890
                      </option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Bukti Pembayaran {modalType === 'create' ? '*' : '(Opsional)'}
                    </label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">Klik untuk upload</span>
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            PNG, JPG, JPEG, PDF
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*,application/pdf"
                          onChange={handleFileChange}
                          required={modalType === 'create'}
                        />
                      </label>
                    </div>
                    {formData.bukti_pembayaran && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        File dipilih: {formData.bukti_pembayaran.name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    type="submit"
                    disabled={createMutation.isLoading || updateMutation.isLoading}
                    className="btn btn-primary btn-md flex-1"
                  >
                    {createMutation.isLoading || updateMutation.isLoading ? 'Menyimpan...' : 'Simpan'}
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

            {modalType === 'delete' && selectedPembayaran && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Hapus Pembayaran
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Apakah Anda yakin ingin menghapus pembayaran untuk <strong>{selectedPembayaran.kode_pemesanan}</strong>? 
                  Tindakan ini tidak dapat dibatalkan dan akan menghapus semua data terkait.
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

export default PembayaranPage
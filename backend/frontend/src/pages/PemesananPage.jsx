import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ShoppingCart, 
  Search, 
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  MapPin,
  User,
  Package,
  Filter,
  DollarSign
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { pemesananService, layananService, penggunaService } from '../services/api'
import toast from 'react-hot-toast'
import DocumentManager from '../components/DocumentManager'
import EmailManager from '../components/EmailManager'

const PemesananPage = () => {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [selectedPemesanan, setSelectedPemesanan] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('view')
  const [formData, setFormData] = useState({
    pengguna_id: '',
    layanan_id: '',
    nama_acara: '',
    tanggal_pelaksanaan: '',
    tanggal_selesai_pelaksanaan: '',
    jam_mulai: '',
    lokasi_acara: '',
    deskripsi_kebutuhan: '',
    catatan_pengguna: '',
    total_tagihan: ''
  })
  
  const queryClient = useQueryClient()

  // Fetch pemesanan data
  const { data, isLoading, error } = useQuery(
    ['pemesanan', { page, search, status }],
    () => pemesananService.getAll({ page, limit: 10, search, status }),
    {
      keepPreviousData: true,
      select: (data) => data.data.data
    }
  )

  // Fetch layanan for dropdown
  const { data: layananList } = useQuery(
    'layanan-list',
    () => layananService.getAll({ limit: 100 }),
    {
      select: (data) => data.data.data.layanan
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
  const createMutation = useMutation(pemesananService.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('pemesanan')
      toast.success('Pemesanan berhasil ditambahkan')
      setShowModal(false)
      resetForm()
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Gagal menambahkan pemesanan')
    }
  })

  // Update mutation
  const updateMutation = useMutation(
    ({ id, data }) => pemesananService.update(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('pemesanan')
        toast.success('Pemesanan berhasil diperbarui')
        setShowModal(false)
        resetForm()
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Gagal memperbarui pemesanan')
      }
    }
  )

  // Update status mutation
  const updateStatusMutation = useMutation(
    ({ id, status }) => pemesananService.updateStatus(id, status),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('pemesanan')
        toast.success('Status pemesanan berhasil diperbarui')
        setShowModal(false)
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Gagal memperbarui status')
      }
    }
  )

  // Delete mutation
  const deleteMutation = useMutation(pemesananService.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries('pemesanan')
      toast.success('Pemesanan berhasil dihapus')
      setShowModal(false)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Gagal menghapus pemesanan')
    }
  })

  const resetForm = () => {
    setFormData({
      pengguna_id: '',
      layanan_id: '',
      nama_acara: '',
      tanggal_pelaksanaan: '',
      tanggal_selesai_pelaksanaan: '',
      jam_mulai: '',
      lokasi_acara: '',
      deskripsi_kebutuhan: '',
      catatan_pengguna: '',
      total_tagihan: ''
    })
    setSelectedPemesanan(null)
  }

  const handleCreate = () => {
    setModalType('create')
    resetForm()
    setShowModal(true)
  }

  const handleView = (pemesanan) => {
    setSelectedPemesanan(pemesanan)
    setModalType('view')
    setShowModal(true)
  }

  const handleEdit = (pemesanan) => {
    setSelectedPemesanan(pemesanan)
    setFormData({
      pengguna_id: pemesanan.pengguna_id || '',
      layanan_id: pemesanan.layanan_id || '',
      nama_acara: pemesanan.nama_acara || '',
      tanggal_pelaksanaan: pemesanan.tanggal_pelaksanaan || '',
      tanggal_selesai_pelaksanaan: pemesanan.tanggal_selesai_pelaksanaan || '',
      jam_mulai: pemesanan.jam_mulai || '',
      lokasi_acara: pemesanan.lokasi_acara || '',
      deskripsi_kebutuhan: pemesanan.deskripsi_kebutuhan || '',
      catatan_pengguna: pemesanan.catatan_pengguna || '',
      total_tagihan: pemesanan.total_tagihan || ''
    })
    setModalType('edit')
    setShowModal(true)
  }

  const handleUpdateStatus = (pemesanan, newStatus) => {
    setSelectedPemesanan(pemesanan)
    updateStatusMutation.mutate({ id: pemesanan.id, status: newStatus })
  }

  const handleDelete = (pemesanan) => {
    setSelectedPemesanan(pemesanan)
    setModalType('delete')
    setShowModal(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (modalType === 'create') {
      createMutation.mutate(formData)
    } else if (modalType === 'edit') {
      updateMutation.mutate({ id: selectedPemesanan.id, data: formData })
    }
  }

  const confirmDelete = () => {
    if (selectedPemesanan) {
      deleteMutation.mutate(selectedPemesanan.id)
    }
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      'menunggu_validasi_admin': { label: 'Menunggu Validasi', class: 'badge-warning' },
      'tervalidasi': { label: 'Tervalidasi', class: 'badge-success' },
      'dibatalkan': { label: 'Dibatalkan', class: 'badge-danger' }
    }
    const statusInfo = statusMap[status] || { label: status, class: 'badge-secondary' }
    return (
      <span className={`badge ${statusInfo.class}`}>
        {statusInfo.label}
      </span>
    )
  }

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
            <ShoppingCart className="w-8 h-8 mr-3 text-primary-600" />
            Manajemen Pemesanan
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Kelola pemesanan layanan dari pengguna
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCreate}
          className="btn btn-primary btn-md"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Pemesanan
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
                  placeholder="Cari pemesanan..."
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
              <option value="menunggu_validasi_admin">Menunggu Validasi</option>
              <option value="tervalidasi">Tervalidasi</option>
              <option value="dibatalkan">Dibatalkan</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Pemesanan Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <div className="card-header">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Daftar Pemesanan
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Total: {data?.pagination?.total_items || 0} pemesanan
          </p>
        </div>
        
        <div className="card-content">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 dark:text-red-400">
                Gagal memuat data pemesanan
              </p>
            </div>
          ) : data?.pemesanan?.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Tidak ada pemesanan ditemukan
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Pemesanan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Pengguna
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Layanan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {data?.pemesanan?.map((pemesanan, index) => (
                    <motion.tr
                      key={pemesanan.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {pemesanan.kode_pemesanan}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {pemesanan.nama_acara}
                          </div>
                          <div className="text-xs text-gray-400 dark:text-gray-500 flex items-center mt-1">
                            <Calendar className="w-3 h-3 mr-1" />
                            {formatDate(pemesanan.tanggal_pelaksanaan)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white font-medium text-xs">
                              {pemesanan.pengguna_nama?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {pemesanan.pengguna_nama}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {pemesanan.pengguna_email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {pemesanan.nama_layanan}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                          {pemesanan.kategori?.replace('_', ' ')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(pemesanan.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatCurrency(pemesanan.total_tagihan)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleView(pemesanan)}
                            className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                            title="Lihat Detail"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(pemesanan)}
                            className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {pemesanan.status === 'menunggu_validasi_admin' && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(pemesanan, 'tervalidasi')}
                                className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                title="Validasi"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(pemesanan, 'dibatalkan')}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                title="Batalkan"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDelete(pemesanan)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {data?.pagination && data.pagination.total_pages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Menampilkan {((page - 1) * 10) + 1} - {Math.min(page * 10, data.pagination.total_items)} dari {data.pagination.total_items} pemesanan
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
        </div>
      </motion.div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            {modalType === 'view' && selectedPemesanan && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Detail Pemesanan
                </h3>
                
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Kode Pemesanan</label>
                      <p className="text-gray-900 dark:text-white">{selectedPemesanan.kode_pemesanan}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Kode Tracking</label>
                      <p className="text-gray-900 dark:text-white">{selectedPemesanan.kode_tracking}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                      <div className="mt-1">
                        {getStatusBadge(selectedPemesanan.status)}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Tagihan</label>
                      <p className="text-gray-900 dark:text-white font-semibold">
                        {formatCurrency(selectedPemesanan.total_tagihan)}
                      </p>
                    </div>
                  </div>

                  {/* Event Details */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Detail Acara</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Nama Acara</label>
                        <p className="text-gray-900 dark:text-white">{selectedPemesanan.nama_acara}</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Tanggal Pelaksanaan</label>
                          <p className="text-gray-900 dark:text-white">{formatDate(selectedPemesanan.tanggal_pelaksanaan)}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Jam Mulai</label>
                          <p className="text-gray-900 dark:text-white">{selectedPemesanan.jam_mulai}</p>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Lokasi Acara</label>
                        <p className="text-gray-900 dark:text-white">{selectedPemesanan.lokasi_acara}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Deskripsi Kebutuhan</label>
                        <p className="text-gray-900 dark:text-white">{selectedPemesanan.deskripsi_kebutuhan}</p>
                      </div>
                    </div>
                  </div>

                  {/* Service Details */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Detail Layanan</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Nama Layanan</label>
                        <p className="text-gray-900 dark:text-white">{selectedPemesanan.nama_layanan}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Kategori</label>
                        <p className="text-gray-900 dark:text-white capitalize">{selectedPemesanan.kategori?.replace('_', ' ')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Customer Details */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Detail Pengguna</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Nama Lengkap</label>
                        <p className="text-gray-900 dark:text-white">{selectedPemesanan.pengguna_nama}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                        <p className="text-gray-900 dark:text-white">{selectedPemesanan.pengguna_email}</p>
                      </div>
                    </div>
                  </div>

                  {selectedPemesanan.catatan_pengguna && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Catatan Pengguna</label>
                      <p className="text-gray-900 dark:text-white">{selectedPemesanan.catatan_pengguna}</p>
                    </div>
                  )}

                  {/* Document Management */}
                  <DocumentManager 
                    pemesananId={selectedPemesanan.id}
                    type="invoice"
                  />

                  {/* Email Management */}
                  <EmailManager 
                    userEmail={selectedPemesanan.pengguna_email}
                    userName={selectedPemesanan.pengguna_nama}
                    orderData={selectedPemesanan}
                    type="order"
                  />
                </div>
                
                <div className="flex justify-between mt-6">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Kode Tracking: <span className="font-mono font-medium">{selectedPemesanan.kode_tracking}</span>
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
                  {modalType === 'create' ? 'Tambah Pemesanan' : 'Edit Pemesanan'}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Pengguna *
                    </label>
                    <select
                      value={formData.pengguna_id}
                      onChange={(e) => setFormData({ ...formData, pengguna_id: e.target.value })}
                      className="select"
                      required
                    >
                      <option value="">Pilih Pengguna</option>
                      {penggunaList?.map((pengguna) => (
                        <option key={pengguna.id} value={pengguna.id}>
                          {pengguna.nama_lengkap} - {pengguna.email}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Layanan *
                    </label>
                    <select
                      value={formData.layanan_id}
                      onChange={(e) => setFormData({ ...formData, layanan_id: e.target.value })}
                      className="select"
                      required
                    >
                      <option value="">Pilih Layanan</option>
                      {layananList?.map((layanan) => (
                        <option key={layanan.id} value={layanan.id}>
                          {layanan.nama_layanan}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nama Acara *
                    </label>
                    <input
                      type="text"
                      value={formData.nama_acara}
                      onChange={(e) => setFormData({ ...formData, nama_acara: e.target.value })}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Total Tagihan *
                    </label>
                    <input
                      type="number"
                      value={formData.total_tagihan}
                      onChange={(e) => setFormData({ ...formData, total_tagihan: e.target.value })}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tanggal Pelaksanaan *
                    </label>
                    <input
                      type="date"
                      value={formData.tanggal_pelaksanaan}
                      onChange={(e) => setFormData({ ...formData, tanggal_pelaksanaan: e.target.value })}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tanggal Selesai
                    </label>
                    <input
                      type="date"
                      value={formData.tanggal_selesai_pelaksanaan}
                      onChange={(e) => setFormData({ ...formData, tanggal_selesai_pelaksanaan: e.target.value })}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Jam Mulai *
                    </label>
                    <input
                      type="time"
                      value={formData.jam_mulai}
                      onChange={(e) => setFormData({ ...formData, jam_mulai: e.target.value })}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Lokasi Acara *
                    </label>
                    <input
                      type="text"
                      value={formData.lokasi_acara}
                      onChange={(e) => setFormData({ ...formData, lokasi_acara: e.target.value })}
                      className="input"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Deskripsi Kebutuhan *
                    </label>
                    <textarea
                      value={formData.deskripsi_kebutuhan}
                      onChange={(e) => setFormData({ ...formData, deskripsi_kebutuhan: e.target.value })}
                      className="textarea"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Catatan Pengguna
                    </label>
                    <textarea
                      value={formData.catatan_pengguna}
                      onChange={(e) => setFormData({ ...formData, catatan_pengguna: e.target.value })}
                      className="textarea"
                      rows={3}
                    />
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

            {modalType === 'delete' && selectedPemesanan && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Hapus Pemesanan
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Apakah Anda yakin ingin menghapus pemesanan <strong>{selectedPemesanan.kode_pemesanan}</strong>? 
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

export default PemesananPage
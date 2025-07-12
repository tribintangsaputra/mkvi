import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Camera, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Star,
  Filter,
  Tag,
  Clock,
  DollarSign
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { layananService } from '../services/api'
import toast from 'react-hot-toast'

const LayananPage = () => {
  const [search, setSearch] = useState('')
  const [kategori, setKategori] = useState('')
  const [page, setPage] = useState(1)
  const [selectedLayanan, setSelectedLayanan] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('view')
  const [formData, setFormData] = useState({
    nama_layanan: '',
    slug: '',
    kategori: '',
    deskripsi: '',
    harga_minimal: '',
    durasi_pengerjaan: '',
    unggulan: false,
    aktif: true
  })
  
  const queryClient = useQueryClient()

  // Fetch layanan data
  const { data, isLoading, error } = useQuery(
    ['layanan', { page, search, kategori }],
    () => layananService.getAll({ page, limit: 10, search, kategori }),
    {
      keepPreviousData: true,
      select: (data) => data.data.data
    }
  )

  // Fetch categories
  const { data: categories } = useQuery(
    'layanan-categories',
    () => layananService.getCategories(),
    {
      select: (data) => data.data.data
    }
  )

  // Create mutation
  const createMutation = useMutation(layananService.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('layanan')
      toast.success('Layanan berhasil ditambahkan')
      setShowModal(false)
      resetForm()
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Gagal menambahkan layanan')
    }
  })

  // Update mutation
  const updateMutation = useMutation(
    ({ id, data }) => layananService.update(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('layanan')
        toast.success('Layanan berhasil diperbarui')
        setShowModal(false)
        resetForm()
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Gagal memperbarui layanan')
      }
    }
  )

  // Delete mutation
  const deleteMutation = useMutation(layananService.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries('layanan')
      toast.success('Layanan berhasil dihapus')
      setShowModal(false)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Gagal menghapus layanan')
    }
  })

  const resetForm = () => {
    setFormData({
      nama_layanan: '',
      slug: '',
      kategori: '',
      deskripsi: '',
      harga_minimal: '',
      durasi_pengerjaan: '',
      unggulan: false,
      aktif: true
    })
    setSelectedLayanan(null)
  }

  const handleCreate = () => {
    setModalType('create')
    resetForm()
    setShowModal(true)
  }

  const handleView = (layanan) => {
    setSelectedLayanan(layanan)
    setModalType('view')
    setShowModal(true)
  }

  const handleEdit = (layanan) => {
    setSelectedLayanan(layanan)
    setFormData({
      nama_layanan: layanan.nama_layanan,
      slug: layanan.slug,
      kategori: layanan.kategori,
      deskripsi: layanan.deskripsi || '',
      harga_minimal: layanan.harga_minimal,
      durasi_pengerjaan: layanan.durasi_pengerjaan,
      unggulan: layanan.unggulan,
      aktif: layanan.aktif
    })
    setModalType('edit')
    setShowModal(true)
  }

  const handleDelete = (layanan) => {
    setSelectedLayanan(layanan)
    setModalType('delete')
    setShowModal(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (modalType === 'create') {
      createMutation.mutate(formData)
    } else if (modalType === 'edit') {
      updateMutation.mutate({ id: selectedLayanan.id, data: formData })
    }
  }

  const confirmDelete = () => {
    if (selectedLayanan) {
      deleteMutation.mutate(selectedLayanan.id)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount)
  }

  const getCategoryLabel = (category) => {
    const categoryMap = {
      'prewedding': 'Prewedding',
      'drone': 'Drone',
      'graduation': 'Graduation',
      'corporate_event': 'Corporate Event',
      'documentary': 'Documentary'
    }
    return categoryMap[category] || category
  }

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-')
  }

  const handleNameChange = (e) => {
    const name = e.target.value
    setFormData({
      ...formData,
      nama_layanan: name,
      slug: generateSlug(name)
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
            <Camera className="w-8 h-8 mr-3 text-primary-600" />
            Manajemen Layanan
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Kelola layanan fotografi dan website
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCreate}
          className="btn btn-primary btn-md"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Layanan
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
                  placeholder="Cari layanan..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>
            <select
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              className="select"
            >
              <option value="">Semua Kategori</option>
              {categories?.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Layanan Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {isLoading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="card-content">
                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                </div>
              </div>
            </div>
          ))
        ) : error ? (
          <div className="col-span-full text-center py-8">
            <p className="text-red-600 dark:text-red-400">
              Gagal memuat data layanan
            </p>
          </div>
        ) : data?.layanan?.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Tidak ada layanan ditemukan
            </p>
          </div>
        ) : (
          data?.layanan?.map((layanan, index) => (
            <motion.div
              key={layanan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card hover:shadow-lg transition-shadow"
            >
              <div className="card-content">
                {/* Image placeholder */}
                <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 rounded-lg mb-4 flex items-center justify-center">
                  <Camera className="w-12 h-12 text-primary-600 dark:text-primary-400" />
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {layanan.nama_layanan}
                    </h3>
                    <div className="flex items-center space-x-1">
                      {layanan.unggulan && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      )}
                      <span className={`badge ${layanan.aktif ? 'badge-success' : 'badge-secondary'}`}>
                        {layanan.aktif ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Tag className="w-4 h-4 mr-1" />
                    {getCategoryLabel(layanan.kategori)}
                  </div>

                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <DollarSign className="w-4 h-4 mr-1" />
                    Mulai dari {formatCurrency(layanan.harga_minimal)}
                  </div>

                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4 mr-1" />
                    {layanan.durasi_pengerjaan}
                  </div>

                  {layanan.deskripsi && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {layanan.deskripsi}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-end space-x-2 pt-2">
                    <button
                      onClick={() => handleView(layanan)}
                      className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(layanan)}
                      className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(layanan)}
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
            Menampilkan {((page - 1) * 10) + 1} - {Math.min(page * 10, data.pagination.total_items)} dari {data.pagination.total_items} layanan
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
            {modalType === 'view' && selectedLayanan && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Detail Layanan
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Nama Layanan</label>
                    <p className="text-gray-900 dark:text-white">{selectedLayanan.nama_layanan}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Slug</label>
                    <p className="text-gray-900 dark:text-white">{selectedLayanan.slug}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Kategori</label>
                    <p className="text-gray-900 dark:text-white">{getCategoryLabel(selectedLayanan.kategori)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Harga Minimal</label>
                    <p className="text-gray-900 dark:text-white">{formatCurrency(selectedLayanan.harga_minimal)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Durasi Pengerjaan</label>
                    <p className="text-gray-900 dark:text-white">{selectedLayanan.durasi_pengerjaan}</p>
                  </div>
                  {selectedLayanan.deskripsi && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Deskripsi</label>
                      <p className="text-gray-900 dark:text-white">{selectedLayanan.deskripsi}</p>
                    </div>
                  )}
                  <div className="flex items-center space-x-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Unggulan</label>
                      <p className="text-gray-900 dark:text-white">{selectedLayanan.unggulan ? 'Ya' : 'Tidak'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                      <p className="text-gray-900 dark:text-white">{selectedLayanan.aktif ? 'Aktif' : 'Nonaktif'}</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-6">
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
                  {modalType === 'create' ? 'Tambah Layanan' : 'Edit Layanan'}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nama Layanan *
                    </label>
                    <input
                      type="text"
                      value={formData.nama_layanan}
                      onChange={handleNameChange}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Slug *
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Kategori *
                    </label>
                    <select
                      value={formData.kategori}
                      onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                      className="select"
                      required
                    >
                      <option value="">Pilih Kategori</option>
                      {categories?.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Harga Minimal *
                    </label>
                    <input
                      type="number"
                      value={formData.harga_minimal}
                      onChange={(e) => setFormData({ ...formData, harga_minimal: e.target.value })}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Durasi Pengerjaan *
                    </label>
                    <input
                      type="text"
                      value={formData.durasi_pengerjaan}
                      onChange={(e) => setFormData({ ...formData, durasi_pengerjaan: e.target.value })}
                      className="input"
                      placeholder="Contoh: 3-5 hari"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Deskripsi
                    </label>
                    <textarea
                      value={formData.deskripsi}
                      onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                      className="textarea"
                      rows={4}
                    />
                  </div>

                  <div className="flex items-center space-x-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.unggulan}
                        onChange={(e) => setFormData({ ...formData, unggulan: e.target.checked })}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Layanan Unggulan</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.aktif}
                        onChange={(e) => setFormData({ ...formData, aktif: e.target.checked })}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Aktif</span>
                    </label>
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

            {modalType === 'delete' && selectedLayanan && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Hapus Layanan
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Apakah Anda yakin ingin menghapus layanan <strong>{selectedLayanan.nama_layanan}</strong>? 
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

export default LayananPage
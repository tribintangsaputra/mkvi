import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Image, 
  Video,
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Upload,
  Filter,
  Camera
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { layananMediaService, layananService } from '../services/api'
import toast from 'react-hot-toast'

const LayananMediaPage = () => {
  const [search, setSearch] = useState('')
  const [layananId, setLayananId] = useState('')
  const [tipe, setTipe] = useState('')
  const [page, setPage] = useState(1)
  const [selectedMedia, setSelectedMedia] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('view')
  const [formData, setFormData] = useState({
    layanan_id: '',
    tipe: '',
    keterangan: '',
    urutan: 0,
    media: null
  })
  
  const queryClient = useQueryClient()

  // Fetch layanan for dropdown
  const { data: layananList } = useQuery(
    'layanan-list',
    () => layananService.getAll({ limit: 100 }),
    {
      select: (data) => data.data.data.layanan
    }
  )

  // Fetch media data
  const { data, isLoading, error } = useQuery(
    ['layanan-media', { page, search, layananId, tipe }],
    () => {
      if (layananId) {
        return layananMediaService.getByLayanan(layananId, { tipe })
      }
      // If no specific layanan selected, we need to fetch all media
      // This would require a different endpoint or approach
      return Promise.resolve({ data: { data: [] } })
    },
    {
      keepPreviousData: true,
      enabled: !!layananId,
      select: (data) => data.data.data
    }
  )

  // Create mutation
  const createMutation = useMutation(layananMediaService.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('layanan-media')
      toast.success('Media berhasil ditambahkan')
      setShowModal(false)
      resetForm()
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Gagal menambahkan media')
    }
  })

  // Update mutation
  const updateMutation = useMutation(
    ({ id, data }) => layananMediaService.update(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('layanan-media')
        toast.success('Media berhasil diperbarui')
        setShowModal(false)
        resetForm()
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Gagal memperbarui media')
      }
    }
  )

  // Delete mutation
  const deleteMutation = useMutation(layananMediaService.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries('layanan-media')
      toast.success('Media berhasil dihapus')
      setShowModal(false)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Gagal menghapus media')
    }
  })

  const resetForm = () => {
    setFormData({
      layanan_id: '',
      tipe: '',
      keterangan: '',
      urutan: 0,
      media: null
    })
    setSelectedMedia(null)
  }

  const handleCreate = () => {
    setModalType('create')
    resetForm()
    setShowModal(true)
  }

  const handleView = (media) => {
    setSelectedMedia(media)
    setModalType('view')
    setShowModal(true)
  }

  const handleEdit = (media) => {
    setSelectedMedia(media)
    setFormData({
      layanan_id: media.layanan_id,
      tipe: media.tipe,
      keterangan: media.keterangan || '',
      urutan: media.urutan || 0,
      media: null
    })
    setModalType('edit')
    setShowModal(true)
  }

  const handleDelete = (media) => {
    setSelectedMedia(media)
    setModalType('delete')
    setShowModal(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const submitData = new FormData()
    submitData.append('layanan_id', formData.layanan_id)
    submitData.append('tipe', formData.tipe)
    submitData.append('keterangan', formData.keterangan)
    submitData.append('urutan', formData.urutan)
    
    if (formData.media) {
      submitData.append('media', formData.media)
    }
    
    if (modalType === 'create') {
      createMutation.mutate(submitData)
    } else if (modalType === 'edit') {
      updateMutation.mutate({ id: selectedMedia.id, data: submitData })
    }
  }

  const confirmDelete = () => {
    if (selectedMedia) {
      deleteMutation.mutate(selectedMedia.id)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({ ...formData, media: file })
    }
  }

  const getMediaUrl = (media) => {
    if (media.url_media) {
      return `http://localhost:5000/uploads/${media.tipe === 'gambar' ? 'images' : 'videos'}/${media.url_media}`
    }
    return null
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
            <Image className="w-8 h-8 mr-3 text-primary-600" />
            Media Layanan
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Kelola gambar dan video untuk layanan
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCreate}
          className="btn btn-primary btn-md"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Media
        </motion.button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="card-content">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Layanan
              </label>
              <select
                value={layananId}
                onChange={(e) => setLayananId(e.target.value)}
                className="select"
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
                Tipe Media
              </label>
              <select
                value={tipe}
                onChange={(e) => setTipe(e.target.value)}
                className="select"
              >
                <option value="">Semua Tipe</option>
                <option value="gambar">Gambar</option>
                <option value="video">Video</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pencarian
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cari media..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Media Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {!layananId ? (
          <div className="card">
            <div className="card-content text-center py-12">
              <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Pilih Layanan
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Silakan pilih layanan terlebih dahulu untuk melihat media
              </p>
            </div>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="card-content">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="card">
            <div className="card-content text-center py-8">
              <p className="text-red-600 dark:text-red-400">
                Gagal memuat data media
              </p>
            </div>
          </div>
        ) : data?.length === 0 ? (
          <div className="card">
            <div className="card-content text-center py-12">
              <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Belum Ada Media
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Layanan ini belum memiliki media. Tambahkan gambar atau video untuk layanan ini.
              </p>
              <button
                onClick={handleCreate}
                className="btn btn-primary btn-md"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Media
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data?.map((media, index) => (
              <motion.div
                key={media.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="card-content">
                  {/* Media Preview */}
                  <div className="h-48 bg-gray-100 dark:bg-gray-800 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                    {media.url_media ? (
                      media.tipe === 'gambar' ? (
                        <img
                          src={getMediaUrl(media)}
                          alt={media.keterangan || 'Media'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none'
                            e.target.nextSibling.style.display = 'flex'
                          }}
                        />
                      ) : (
                        <video
                          src={getMediaUrl(media)}
                          className="w-full h-full object-cover"
                          controls
                          onError={(e) => {
                            e.target.style.display = 'none'
                            e.target.nextSibling.style.display = 'flex'
                          }}
                        />
                      )
                    ) : null}
                    <div className="flex items-center justify-center w-full h-full">
                      {media.tipe === 'gambar' ? (
                        <Image className="w-12 h-12 text-gray-400" />
                      ) : (
                        <Video className="w-12 h-12 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`badge ${media.tipe === 'gambar' ? 'badge-primary' : 'badge-secondary'}`}>
                        {media.tipe === 'gambar' ? 'Gambar' : 'Video'}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Urutan: {media.urutan}
                      </span>
                    </div>

                    {media.keterangan && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {media.keterangan}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-end space-x-2 pt-2">
                      <button
                        onClick={() => handleView(media)}
                        className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(media)}
                        className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(media)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {modalType === 'view' && selectedMedia && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Detail Media
                </h3>
                
                {/* Media Preview */}
                <div className="mb-6">
                  <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
                    {selectedMedia.url_media ? (
                      selectedMedia.tipe === 'gambar' ? (
                        <img
                          src={getMediaUrl(selectedMedia)}
                          alt={selectedMedia.keterangan || 'Media'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <video
                          src={getMediaUrl(selectedMedia)}
                          className="w-full h-full object-cover"
                          controls
                        />
                      )
                    ) : (
                      <div className="flex items-center justify-center">
                        {selectedMedia.tipe === 'gambar' ? (
                          <Image className="w-16 h-16 text-gray-400" />
                        ) : (
                          <Video className="w-16 h-16 text-gray-400" />
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Tipe</label>
                    <p className="text-gray-900 dark:text-white capitalize">{selectedMedia.tipe}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Urutan</label>
                    <p className="text-gray-900 dark:text-white">{selectedMedia.urutan}</p>
                  </div>
                  {selectedMedia.keterangan && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Keterangan</label>
                      <p className="text-gray-900 dark:text-white">{selectedMedia.keterangan}</p>
                    </div>
                  )}
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
                  {modalType === 'create' ? 'Tambah Media' : 'Edit Media'}
                </h3>
                
                <div className="space-y-4">
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
                      Tipe Media *
                    </label>
                    <select
                      value={formData.tipe}
                      onChange={(e) => setFormData({ ...formData, tipe: e.target.value })}
                      className="select"
                      required
                    >
                      <option value="">Pilih Tipe</option>
                      <option value="gambar">Gambar</option>
                      <option value="video">Video</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      File Media {modalType === 'create' ? '*' : '(Opsional)'}
                    </label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">Klik untuk upload</span>
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formData.tipe === 'gambar' ? 'PNG, JPG, JPEG' : 'MP4, AVI, MOV'}
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept={formData.tipe === 'gambar' ? 'image/*' : 'video/*'}
                          onChange={handleFileChange}
                          required={modalType === 'create'}
                        />
                      </label>
                    </div>
                    {formData.media && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        File dipilih: {formData.media.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Urutan
                    </label>
                    <input
                      type="number"
                      value={formData.urutan}
                      onChange={(e) => setFormData({ ...formData, urutan: parseInt(e.target.value) || 0 })}
                      className="input"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Keterangan
                    </label>
                    <textarea
                      value={formData.keterangan}
                      onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
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

            {modalType === 'delete' && selectedMedia && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Hapus Media
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Apakah Anda yakin ingin menghapus media ini? 
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

export default LayananMediaPage
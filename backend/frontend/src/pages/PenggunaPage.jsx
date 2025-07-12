import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Mail,
  Phone,
  Calendar,
  Filter,
  Lock,
  UserPlus
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { penggunaService } from '../services/api'
import toast from 'react-hot-toast'

const PenggunaPage = () => {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [selectedUser, setSelectedUser] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('view') // 'view', 'create', 'edit', 'delete', 'password'
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    email: '',
    no_wa: '',
    password: '',
    confirm_password: ''
  })
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  })
  
  const queryClient = useQueryClient()

  // Fetch pengguna data
  const { data, isLoading, error } = useQuery(
    ['pengguna', { page, search }],
    () => penggunaService.getAll({ page, limit: 10, search }),
    {
      keepPreviousData: true,
      select: (data) => data.data.data
    }
  )

  // Create mutation
  const createMutation = useMutation(penggunaService.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('pengguna')
      toast.success('Pengguna berhasil ditambahkan')
      setShowModal(false)
      resetForm()
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Gagal menambahkan pengguna')
    }
  })

  // Update mutation
  const updateMutation = useMutation(
    ({ id, data }) => penggunaService.update(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('pengguna')
        toast.success('Pengguna berhasil diperbarui')
        setShowModal(false)
        resetForm()
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Gagal memperbarui pengguna')
      }
    }
  )

  // Delete mutation
  const deleteMutation = useMutation(penggunaService.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries('pengguna')
      toast.success('Pengguna berhasil dihapus')
      setShowModal(false)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Gagal menghapus pengguna')
    }
  })

  // Change password mutation
  const changePasswordMutation = useMutation(
    ({ id, data }) => penggunaService.changePassword(id, data),
    {
      onSuccess: () => {
        toast.success('Password berhasil diubah')
        setShowModal(false)
        setPasswordData({ current_password: '', new_password: '', confirm_password: '' })
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Gagal mengubah password')
      }
    }
  )

  const resetForm = () => {
    setFormData({
      nama_lengkap: '',
      email: '',
      no_wa: '',
      password: '',
      confirm_password: ''
    })
    setSelectedUser(null)
  }

  const handleCreate = () => {
    setModalType('create')
    resetForm()
    setShowModal(true)
  }

  const handleView = (user) => {
    setSelectedUser(user)
    setModalType('view')
    setShowModal(true)
  }

  const handleEdit = (user) => {
    setSelectedUser(user)
    setFormData({
      nama_lengkap: user.nama_lengkap,
      email: user.email,
      no_wa: user.no_wa || '',
      password: '',
      confirm_password: ''
    })
    setModalType('edit')
    setShowModal(true)
  }

  const handleDelete = (user) => {
    setSelectedUser(user)
    setModalType('delete')
    setShowModal(true)
  }

  const handleChangePassword = (user) => {
    setSelectedUser(user)
    setModalType('password')
    setShowModal(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (modalType === 'create') {
      if (formData.password !== formData.confirm_password) {
        toast.error('Konfirmasi password tidak cocok')
        return
      }
      createMutation.mutate(formData)
    } else if (modalType === 'edit') {
      const updateData = {
        nama_lengkap: formData.nama_lengkap,
        email: formData.email,
        no_wa: formData.no_wa
      }
      updateMutation.mutate({ id: selectedUser.id, data: updateData })
    }
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('Konfirmasi password tidak cocok')
      return
    }
    
    changePasswordMutation.mutate({ 
      id: selectedUser.id, 
      data: passwordData 
    })
  }

  const confirmDelete = () => {
    if (selectedUser) {
      deleteMutation.mutate(selectedUser.id)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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
            <Users className="w-8 h-8 mr-3 text-primary-600" />
            Manajemen Pengguna
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Kelola data pengguna sistem
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCreate}
          className="btn btn-primary btn-md"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Pengguna
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
                  placeholder="Cari pengguna..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>
            <button className="btn btn-secondary btn-md">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
          </div>
        </div>
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <div className="card-header">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Daftar Pengguna
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Total: {data?.pagination?.total_items || 0} pengguna
          </p>
        </div>
        
        <div className="card-content">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
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
                Gagal memuat data pengguna
              </p>
            </div>
          ) : data?.pengguna?.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Tidak ada pengguna ditemukan
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Pengguna
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Kontak
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Bergabung
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {data?.pengguna?.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {user.nama_lengkap.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {user.nama_lengkap}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              ID: {user.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          <div className="flex items-center mb-1">
                            <Mail className="w-4 h-4 mr-2 text-gray-400" />
                            {user.email}
                          </div>
                          {user.no_wa && (
                            <div className="flex items-center">
                              <Phone className="w-4 h-4 mr-2 text-gray-400" />
                              {user.no_wa}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Calendar className="w-4 h-4 mr-2" />
                          {formatDate(user.dibuat_pada)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleView(user)}
                            className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                            title="Lihat Detail"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(user)}
                            className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleChangePassword(user)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            title="Ubah Password"
                          >
                            <Lock className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(user)}
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
                Menampilkan {((page - 1) * 10) + 1} - {Math.min(page * 10, data.pagination.total_items)} dari {data.pagination.total_items} pengguna
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
            className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            {modalType === 'view' && selectedUser && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Detail Pengguna
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Nama Lengkap</label>
                    <p className="text-gray-900 dark:text-white">{selectedUser.nama_lengkap}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                    <p className="text-gray-900 dark:text-white">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">No. WhatsApp</label>
                    <p className="text-gray-900 dark:text-white">{selectedUser.no_wa || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Bergabung</label>
                    <p className="text-gray-900 dark:text-white">{formatDate(selectedUser.dibuat_pada)}</p>
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
                  {modalType === 'create' ? 'Tambah Pengguna' : 'Edit Pengguna'}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      value={formData.nama_lengkap}
                      onChange={(e) => setFormData({ ...formData, nama_lengkap: e.target.value })}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      No. WhatsApp
                    </label>
                    <input
                      type="text"
                      value={formData.no_wa}
                      onChange={(e) => setFormData({ ...formData, no_wa: e.target.value })}
                      className="input"
                      placeholder="+62xxxxxxxxxx"
                    />
                  </div>

                  {modalType === 'create' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Password *
                        </label>
                        <input
                          type="password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className="input"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Konfirmasi Password *
                        </label>
                        <input
                          type="password"
                          value={formData.confirm_password}
                          onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                          className="input"
                          required
                        />
                      </div>
                    </>
                  )}
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

            {modalType === 'password' && selectedUser && (
              <form onSubmit={handlePasswordSubmit} className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Ubah Password - {selectedUser.nama_lengkap}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Password Saat Ini *
                    </label>
                    <input
                      type="password"
                      value={passwordData.current_password}
                      onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Password Baru *
                    </label>
                    <input
                      type="password"
                      value={passwordData.new_password}
                      onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Konfirmasi Password Baru *
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirm_password}
                      onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                      className="input"
                      required
                    />
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    type="submit"
                    disabled={changePasswordMutation.isLoading}
                    className="btn btn-primary btn-md flex-1"
                  >
                    {changePasswordMutation.isLoading ? 'Mengubah...' : 'Ubah Password'}
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

            {modalType === 'delete' && selectedUser && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Hapus Pengguna
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Apakah Anda yakin ingin menghapus pengguna <strong>{selectedUser.nama_lengkap}</strong>? 
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

export default PenggunaPage
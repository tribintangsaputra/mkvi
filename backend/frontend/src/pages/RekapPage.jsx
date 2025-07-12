import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  Download, 
  Calendar,
  FileText,
  TrendingUp,
  Users,
  CreditCard,
  Video,
  Filter,
  RefreshCw
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { rekapService } from '../services/api'
import toast from 'react-hot-toast'

const RekapPage = () => {
  const [activeTab, setActiveTab] = useState('pemesanan')
  const [dateRange, setDateRange] = useState({
    tanggal_mulai: '',
    tanggal_selesai: ''
  })
  const [page, setPage] = useState(1)
  
  const queryClient = useQueryClient()

  // Fetch rekap data based on active tab
  const { data, isLoading, error } = useQuery(
    ['rekap', activeTab, { page }],
    () => {
      switch (activeTab) {
        case 'pemesanan':
          return rekapService.getPemesanan({ page, limit: 10 })
        case 'meeting':
          return rekapService.getMeeting({ page, limit: 10 })
        case 'pembayaran':
          return rekapService.getPembayaran({ page, limit: 10 })
        default:
          return Promise.resolve({ data: { data: { rekap: [], pagination: {} } } })
      }
    },
    {
      keepPreviousData: true,
      select: (data) => data.data.data
    }
  )

  // Generate mutations
  const generatePemesananMutation = useMutation(rekapService.generatePemesanan, {
    onSuccess: (data) => {
      queryClient.invalidateQueries('rekap')
      toast.success('Rekap pemesanan berhasil dibuat')
      // Auto download
      window.open(data.data.data.file_path, '_blank')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Gagal membuat rekap pemesanan')
    }
  })

  const generateMeetingMutation = useMutation(rekapService.generateMeeting, {
    onSuccess: (data) => {
      queryClient.invalidateQueries('rekap')
      toast.success('Rekap meeting berhasil dibuat')
      // Auto download
      window.open(data.data.data.file_path, '_blank')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Gagal membuat rekap meeting')
    }
  })

  const generatePembayaranMutation = useMutation(rekapService.generatePembayaran, {
    onSuccess: (data) => {
      queryClient.invalidateQueries('rekap')
      toast.success('Rekap pembayaran berhasil dibuat')
      // Auto download
      window.open(data.data.data.file_path, '_blank')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Gagal membuat rekap pembayaran')
    }
  })

  // Delete mutation
  const deleteMutation = useMutation(
    ({ type, id }) => rekapService.delete(type, id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('rekap')
        toast.success('Rekap berhasil dihapus')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Gagal menghapus rekap')
      }
    }
  )

  const handleGenerate = () => {
    if (!dateRange.tanggal_mulai || !dateRange.tanggal_selesai) {
      toast.error('Silakan pilih rentang tanggal terlebih dahulu')
      return
    }

    switch (activeTab) {
      case 'pemesanan':
        generatePemesananMutation.mutate(dateRange)
        break
      case 'meeting':
        generateMeetingMutation.mutate(dateRange)
        break
      case 'pembayaran':
        generatePembayaranMutation.mutate(dateRange)
        break
    }
  }

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus rekap ini?')) {
      deleteMutation.mutate({ type: activeTab, id })
    }
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

  const getTabIcon = (tab) => {
    switch (tab) {
      case 'pemesanan':
        return <FileText className="w-5 h-5" />
      case 'meeting':
        return <Video className="w-5 h-5" />
      case 'pembayaran':
        return <CreditCard className="w-5 h-5" />
      default:
        return <BarChart3 className="w-5 h-5" />
    }
  }

  const getTabLabel = (tab) => {
    switch (tab) {
      case 'pemesanan':
        return 'Rekap Pemesanan'
      case 'meeting':
        return 'Rekap Meeting'
      case 'pembayaran':
        return 'Rekap Pembayaran'
      default:
        return tab
    }
  }

  const isGenerating = generatePemesananMutation.isLoading || 
                     generateMeetingMutation.isLoading || 
                     generatePembayaranMutation.isLoading

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
            <BarChart3 className="w-8 h-8 mr-3 text-primary-600" />
            Rekap Data
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Generate dan kelola laporan data sistem
          </p>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="card-content">
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            {['pemesanan', 'meeting', 'pembayaran'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {getTabIcon(tab)}
                <span>{getTabLabel(tab)}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Generate Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <div className="card-header">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Generate {getTabLabel(activeTab)}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Pilih rentang tanggal untuk membuat laporan Excel
          </p>
        </div>
        <div className="card-content">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tanggal Mulai
              </label>
              <input
                type="date"
                value={dateRange.tanggal_mulai}
                onChange={(e) => setDateRange({ ...dateRange, tanggal_mulai: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tanggal Selesai
              </label>
              <input
                type="date"
                value={dateRange.tanggal_selesai}
                onChange={(e) => setDateRange({ ...dateRange, tanggal_selesai: e.target.value })}
                className="input"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerate}
              disabled={isGenerating}
              className="btn btn-primary btn-md"
            >
              {isGenerating ? (
                <div className="flex items-center">
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </div>
              ) : (
                <div className="flex items-center">
                  <Download className="w-4 h-4 mr-2" />
                  Generate Excel
                </div>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Rekap History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <div className="card-header">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Riwayat {getTabLabel(activeTab)}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Daftar rekap yang telah dibuat sebelumnya
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
                Gagal memuat data rekap
              </p>
            </div>
          ) : data?.rekap?.length === 0 ? (
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Belum Ada Rekap
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Belum ada rekap {activeTab} yang dibuat. Generate rekap pertama Anda.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {data?.rekap?.map((rekap, index) => (
                <motion.div
                  key={rekap.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                      {getTabIcon(activeTab)}
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {rekap.bulan} {rekap.tahun}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Dibuat: {formatDate(rekap.dibuat_pada)} oleh {rekap.admin_nama}
                      </p>
                      
                      {/* Statistics */}
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>Total: {rekap.total}</span>
                        {activeTab === 'pemesanan' && (
                          <>
                            <span>Tervalidasi: {rekap.tervalidasi}</span>
                            <span>Dibatalkan: {rekap.dibatalkan}</span>
                          </>
                        )}
                        {activeTab === 'meeting' && (
                          <>
                            <span>Selesai: {rekap.selesai}</span>
                            <span>Dibatalkan: {rekap.dibatalkan}</span>
                          </>
                        )}
                        {activeTab === 'pembayaran' && (
                          <>
                            <span>Lunas: {rekap.lunas}</span>
                            <span>Gagal: {rekap.gagal}</span>
                            {rekap.total_nominal && (
                              <span>Total: {formatCurrency(rekap.total_nominal)}</span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => window.open(`/api/upload/download/reports/rekap-${activeTab}-${rekap.id}.xlsx`, '_blank')}
                      className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(rekap.id)}
                      disabled={deleteMutation.isLoading}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      title="Hapus"
                    >
                      <RefreshCw className={`w-4 h-4 ${deleteMutation.isLoading ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {data?.pagination && data.pagination.total_pages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Menampilkan {((page - 1) * 10) + 1} - {Math.min(page * 10, data.pagination.total_items)} dari {data.pagination.total_items} rekap
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
    </div>
  )
}

export default RekapPage
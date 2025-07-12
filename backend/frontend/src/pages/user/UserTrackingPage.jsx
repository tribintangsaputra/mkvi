import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { 
  Search, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  XCircle,
  Calendar,
  Tag,
  MapPin
} from 'lucide-react'
import { useMutation } from 'react-query'
import { pemesananService } from '../../services/api'
import toast from 'react-hot-toast'
import UserOrderTracker from '../../components/user/UserOrderTracker'

const UserTrackingPage = () => {
  const [trackingCode, setTrackingCode] = useState('')
  const [trackingResult, setTrackingResult] = useState(null)
  
  const headerRef = useRef(null)
  const isHeaderInView = useInView(headerRef, { once: true })
  
  const resultRef = useRef(null)
  const isResultInView = useInView(resultRef, { once: true })
  
  // Track pemesanan mutation
  const trackPemesananMutation = useMutation(
    (code) => pemesananService.track(code),
    {
      onSuccess: (data) => {
        setTrackingResult(data.data.data)
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Kode tracking tidak ditemukan')
        setTrackingResult(null)
      }
    }
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!trackingCode.trim()) {
      toast.error('Masukkan kode tracking')
      return
    }
    trackPemesananMutation.mutate(trackingCode)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <section ref={headerRef} className="text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
        >
          Lacak Pemesanan
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8"
        >
          Masukkan kode tracking untuk melihat status pemesanan Anda
        </motion.p>
      </section>
      
      {/* Search Form */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="max-w-xl mx-auto"
      >
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Masukkan kode tracking (contoh: MKVI_0001)"
            />
          </div>
          
          <div className="mt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={trackPemesananMutation.isLoading}
              className="w-full bg-primary-600 text-white py-3 rounded-md hover:bg-primary-700 transition-colors flex items-center justify-center"
            >
              {trackPemesananMutation.isLoading ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Melacak...
                </div>
              ) : (
                <>
                  Lacak Pemesanan
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.section>
      
      {/* Tracking Result */}
      {trackingResult && (
        <section ref={resultRef}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isResultInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Hasil Pelacakan
            </h2>
            
            <div className="space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Kode Pemesanan</p>
                  <p className="font-medium text-gray-900 dark:text-white">{trackingResult.kode_pemesanan}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Kode Tracking</p>
                  <p className="font-medium text-gray-900 dark:text-white">{trackingResult.kode_tracking}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Nama Acara</p>
                  <p className="font-medium text-gray-900 dark:text-white">{trackingResult.nama_acara}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Tanggal Pemesanan</p>
                  <p className="font-medium text-gray-900 dark:text-white">{formatDate(trackingResult.dibuat_pada)}</p>
                </div>
              </div>
              
              {/* Service Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-t border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <Tag className="w-5 h-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Layanan</p>
                    <p className="font-medium text-gray-900 dark:text-white">{trackingResult.nama_layanan}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Tanggal Pelaksanaan</p>
                    <p className="font-medium text-gray-900 dark:text-white">{formatDate(trackingResult.tanggal_pelaksanaan)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Kategori</p>
                    <p className="font-medium text-gray-900 dark:text-white capitalize">{trackingResult.kategori?.replace('_', ' ')}</p>
                  </div>
                </div>
              </div>
              
              {/* Status Tracker */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Status Pemesanan
                </h3>
                
                <UserOrderTracker 
                  status={trackingResult.status}
                  createdAt={trackingResult.dibuat_pada}
                  validatedAt={trackingResult.status === 'tervalidasi' ? trackingResult.diperbarui_pada : null}
                  cancelledAt={trackingResult.status === 'dibatalkan' ? trackingResult.diperbarui_pada : null}
                />
              </div>
              
              {/* Login CTA */}
              <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                      Ingin melihat detail lengkap?
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Login untuk melihat detail pemesanan, melakukan pembayaran, dan mengunduh dokumen.
                    </p>
                  </div>
                  
                  <Link to="/pengguna/login">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors whitespace-nowrap"
                    >
                      Login Sekarang
                    </motion.button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      )}
      
      {/* How to Track */}
      <section className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Cara Melacak Pemesanan
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold mr-3 mt-0.5">
                1
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Dapatkan Kode Tracking</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Kode tracking diberikan saat Anda melakukan pemesanan. Kode ini juga dikirimkan melalui email konfirmasi pemesanan.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold mr-3 mt-0.5">
                2
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Masukkan Kode Tracking</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Masukkan kode tracking pada form di atas dan klik tombol "Lacak Pemesanan".
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold mr-3 mt-0.5">
                3
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Lihat Status Pemesanan</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Sistem akan menampilkan status terkini dari pemesanan Anda.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Jika Anda mengalami kesulitan dalam melacak pemesanan, silakan hubungi kami melalui email di myerkvi@gmail.com atau WhatsApp di +62 852-8312-5585.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default UserTrackingPage
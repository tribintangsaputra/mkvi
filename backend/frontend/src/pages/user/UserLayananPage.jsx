import React, { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Camera, 
  ArrowRight,
  Star,
  Tag,
  Clock,
  DollarSign
} from 'lucide-react'
import { useQuery } from 'react-query'
import { layananService } from '../../services/api'
import UserServiceCard from '../../components/user/UserServiceCard'

const UserLayananPage = () => {
  const [search, setSearch] = useState('')
  const [kategori, setKategori] = useState('')
  const [page, setPage] = useState(1)
  
  const headerRef = useRef(null)
  const isHeaderInView = useInView(headerRef, { once: true })
  
  const servicesRef = useRef(null)
  const isServicesInView = useInView(servicesRef, { once: true })
  
  // Fetch layanan data
  const { data, isLoading, error } = useQuery(
    ['layanan', { page, search, kategori }],
    () => layananService.getAll({ page, limit: 9, search, kategori }),
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
          Layanan Kami
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8"
        >
          Temukan berbagai layanan fotografi dan pembuatan website yang kami tawarkan
        </motion.p>
      </section>
      
      {/* Filters and Search */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="container mx-auto px-6"
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cari layanan..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="text-gray-400 w-5 h-5" />
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
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
        </div>
      </motion.section>
      
      {/* Services Grid */}
      <section ref={servicesRef} className="container mx-auto px-6">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400">
              Gagal memuat data layanan. Silakan coba lagi nanti.
            </p>
          </div>
        ) : data?.layanan?.length === 0 ? (
          <div className="text-center py-12">
            <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              Tidak ada layanan ditemukan
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Coba ubah filter atau kata kunci pencarian Anda
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.layanan?.map((layanan, index) => (
                <motion.div
                  key={layanan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isServicesInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.1 * (index % 9), duration: 0.5 }}
                >
                  <UserServiceCard service={layanan} />
                </motion.div>
              ))}
            </div>
            
            {/* Pagination */}
            {data?.pagination && data.pagination.total_pages > 1 && (
              <div className="flex justify-center mt-12">
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
          </>
        )}
      </section>
      
      {/* Categories Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-16 rounded-3xl">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Kategori Layanan
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Kami menawarkan berbagai kategori layanan untuk memenuhi kebutuhan Anda
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Prewedding Photography',
                description: 'Abadikan momen indah sebelum hari pernikahan Anda dengan konsep yang unik dan lokasi yang menarik.',
                icon: Camera,
                color: 'bg-pink-500',
                link: '/pengguna/layanan/prewedding'
              },
              {
                title: 'Drone Photography',
                description: 'Dapatkan sudut pandang yang berbeda dengan pengambilan gambar dari udara menggunakan teknologi drone.',
                icon: Camera,
                color: 'bg-blue-500',
                link: '/pengguna/layanan/drone'
              },
              {
                title: 'Graduation Photography',
                description: 'Abadikan momen kelulusan Anda dengan sesi foto profesional yang akan menjadi kenangan seumur hidup.',
                icon: Camera,
                color: 'bg-yellow-500',
                link: '/pengguna/layanan/graduation'
              },
              {
                title: 'Corporate Event',
                description: 'Dokumentasikan acara perusahaan Anda dengan layanan fotografi profesional untuk berbagai kebutuhan bisnis.',
                icon: Camera,
                color: 'bg-green-500',
                link: '/pengguna/layanan/corporate_event'
              },
              {
                title: 'Documentary',
                description: 'Ceritakan kisah Anda melalui rangkaian foto dokumenter yang menangkap esensi dari momen-momen penting.',
                icon: Camera,
                color: 'bg-purple-500',
                link: '/pengguna/layanan/documentary'
              },
              {
                title: 'Website Development',
                description: 'Buat kehadiran online Anda dengan website profesional yang responsif, modern, dan sesuai kebutuhan.',
                icon: Camera,
                color: 'bg-indigo-500',
                link: '/pengguna/layanan/website'
              }
            ].map((category, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden"
              >
                <div className={`h-2 ${category.color}`}></div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mr-4`}>
                      <category.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {category.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {category.description}
                  </p>
                  
                  <a 
                    href={category.link}
                    className="inline-flex items-center text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    Lihat Detail
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="container mx-auto px-6 mb-20">
        <div className="bg-primary-600 rounded-3xl overflow-hidden shadow-xl">
          <div className="relative px-6 py-12 md:py-16 md:px-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Siap Memesan Layanan Kami?
            </h2>
            <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
              Hubungi kami sekarang untuk konsultasi gratis atau langsung pesan layanan yang Anda butuhkan
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/pengguna/pemesanan"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-primary-600 font-medium px-6 py-3 rounded-md hover:bg-gray-100 transition-colors"
              >
                Pesan Sekarang
              </motion.a>
              <motion.a
                href="/pengguna/bantuan"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-transparent border-2 border-white text-white font-medium px-6 py-3 rounded-md hover:bg-white/10 transition-colors"
              >
                Pelajari Lebih Lanjut
              </motion.a>
            </div>
            
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -ml-32 -mb-32"></div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default UserLayananPage
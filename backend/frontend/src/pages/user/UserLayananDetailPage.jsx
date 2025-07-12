import React, { useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { 
  ArrowLeft, 
  Clock, 
  DollarSign, 
  Tag, 
  Camera, 
  ShoppingCart,
  Star,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause
} from 'lucide-react'
import { useQuery } from 'react-query'
import { layananService, layananMediaService } from '../../services/api'

const UserLayananDetailPage = () => {
  const { slug } = useParams()
  const [activeTab, setActiveTab] = useState('deskripsi')
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  
  const headerRef = useRef(null)
  const isHeaderInView = useInView(headerRef, { once: true })
  
  const contentRef = useRef(null)
  const isContentInView = useInView(contentRef, { once: true })
  
  const relatedRef = useRef(null)
  const isRelatedInView = useInView(relatedRef, { once: true })
  
  // Fetch layanan detail
  const { data: layanan, isLoading: loadingLayanan } = useQuery(
    ['layanan', slug],
    () => layananService.getById(slug),
    {
      select: (data) => data.data.data
    }
  )

  // Fetch layanan media
  const { data: media, isLoading: loadingMedia } = useQuery(
    ['layanan-media', layanan?.id],
    () => layananMediaService.getByLayanan(layanan?.id),
    {
      enabled: !!layanan?.id,
      select: (data) => data.data.data
    }
  )

  // Fetch related layanan
  const { data: relatedLayanan, isLoading: loadingRelated } = useQuery(
    ['layanan-related', layanan?.kategori],
    () => layananService.getAll({ kategori: layanan?.kategori, limit: 3 }),
    {
      enabled: !!layanan?.kategori,
      select: (data) => data.data.data.layanan.filter(item => item.id !== layanan?.id).slice(0, 3)
    }
  )

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

  const nextSlide = () => {
    if (media && media.length > 0) {
      setCurrentSlide((prev) => (prev === media.length - 1 ? 0 : prev + 1))
    }
  }

  const prevSlide = () => {
    if (media && media.length > 0) {
      setCurrentSlide((prev) => (prev === 0 ? media.length - 1 : prev - 1))
    }
  }

  // Auto-play functionality
  React.useEffect(() => {
    let interval
    if (isPlaying && media && media.length > 1) {
      interval = setInterval(() => {
        nextSlide()
      }, 3000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, media, currentSlide])

  return (
    <div className="space-y-12">
      {/* Back button */}
      <div>
        <Link 
          to="/pengguna/layanan"
          className="inline-flex items-center text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Layanan
        </Link>
      </div>
      
      {loadingLayanan ? (
        <div className="space-y-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
          
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
        </div>
      ) : layanan ? (
        <>
          {/* Header */}
          <section ref={headerRef}>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
            >
              {layanan.nama_layanan}
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="flex flex-wrap items-center gap-4 mb-8"
            >
              <div className="flex items-center">
                <Tag className="w-4 h-4 text-primary-600 dark:text-primary-400 mr-1" />
                <span className="text-gray-600 dark:text-gray-400">
                  Kategori: <span className="font-medium">{getCategoryLabel(layanan.kategori)}</span>
                </span>
              </div>
              
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 text-primary-600 dark:text-primary-400 mr-1" />
                <span className="text-gray-600 dark:text-gray-400">
                  Mulai dari: <span className="font-medium">{formatCurrency(layanan.harga_minimal)}</span>
                </span>
              </div>
              
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-primary-600 dark:text-primary-400 mr-1" />
                <span className="text-gray-600 dark:text-gray-400">
                  Durasi: <span className="font-medium">{layanan.durasi_pengerjaan}</span>
                </span>
              </div>
              
              {layanan.unggulan && (
                <div className="flex items-center bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 px-2 py-1 rounded-full text-xs">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  Layanan Unggulan
                </div>
              )}
            </motion.div>
          </section>
          
          {/* Media Gallery */}
          <section>
            {loadingMedia ? (
              <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            ) : media && media.length > 0 ? (
              <div className="relative rounded-lg overflow-hidden">
                <div className="h-96 bg-gray-100 dark:bg-gray-800 relative">
                  {/* Main image/video */}
                  <div className="w-full h-full flex items-center justify-center">
                    {media[currentSlide].tipe === 'gambar' ? (
                      <img 
                        src={`http://localhost:5000/uploads/images/${media[currentSlide].url_media}`}
                        alt={media[currentSlide].keterangan || layanan.nama_layanan}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <video 
                        src={`http://localhost:5000/uploads/videos/${media[currentSlide].url_media}`}
                        controls
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                  
                  {/* Navigation arrows */}
                  {media.length > 1 && (
                    <>
                      <button
                        onClick={prevSlide}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={nextSlide}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}
                  
                  {/* Play/Pause button */}
                  {media.length > 1 && (
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="absolute bottom-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                  )}
                  
                  {/* Slide indicators */}
                  {media.length > 1 && (
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                      {media.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentSlide(index)}
                          className={`w-2 h-2 rounded-full ${
                            currentSlide === index ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Thumbnails */}
                {media.length > 1 && (
                  <div className="flex overflow-x-auto space-x-2 mt-2 pb-2">
                    {media.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden ${
                          currentSlide === index ? 'ring-2 ring-primary-600' : ''
                        }`}
                      >
                        {item.tipe === 'gambar' ? (
                          <img 
                            src={`http://localhost:5000/uploads/images/${item.url_media}`}
                            alt={item.keterangan || `Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <Play className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Belum ada media untuk layanan ini
                  </p>
                </div>
              </div>
            )}
          </section>
          
          {/* Content Tabs */}
          <section ref={contentRef}>
            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
              <div className="flex space-x-8">
                {['deskripsi', 'detail', 'ulasan'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 px-1 relative capitalize ${
                      activeTab === tab
                        ? 'text-primary-600 dark:text-primary-400 font-medium'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isContentInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {activeTab === 'deskripsi' && (
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p>{layanan.deskripsi || 'Tidak ada deskripsi untuk layanan ini.'}</p>
                  
                  {!layanan.deskripsi && (
                    <>
                      <p>
                        Layanan {layanan.nama_layanan} kami menawarkan pengalaman fotografi profesional dengan kualitas terbaik. Tim fotografer berpengalaman kami akan memastikan setiap momen berharga Anda terabadikan dengan sempurna.
                      </p>
                      <p>
                        Kami menggunakan peralatan fotografi terkini dan teknik editing profesional untuk menghasilkan foto-foto yang memukau. Setiap proyek dikerjakan dengan dedikasi tinggi untuk memenuhi ekspektasi klien.
                      </p>
                    </>
                  )}
                </div>
              )}
              
              {activeTab === 'detail' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Spesifikasi Layanan
                    </h3>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
                      <li>Durasi pengerjaan: {layanan.durasi_pengerjaan}</li>
                      <li>Harga mulai dari: {formatCurrency(layanan.harga_minimal)}</li>
                      <li>Kategori: {getCategoryLabel(layanan.kategori)}</li>
                      <li>Termasuk editing dan post-processing</li>
                      <li>Hasil dalam format digital dan cetak</li>
                      <li>Revisi maksimal 2 kali</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Proses Kerja
                    </h3>
                    <ol className="list-decimal list-inside text-gray-600 dark:text-gray-400 space-y-2">
                      <li>Konsultasi awal untuk memahami kebutuhan Anda</li>
                      <li>Penandatanganan kontrak dan pembayaran DP</li>
                      <li>Pelaksanaan sesi fotografi sesuai jadwal</li>
                      <li>Proses editing dan seleksi foto</li>
                      <li>Presentasi hasil dan revisi jika diperlukan</li>
                      <li>Pelunasan pembayaran dan pengiriman hasil akhir</li>
                    </ol>
                  </div>
                </div>
              )}
              
              {activeTab === 'ulasan' && (
                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className="w-5 h-5 text-yellow-500 fill-current" 
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      5.0 dari 5 (12 ulasan)
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      {
                        name: 'Andi Pratama',
                        date: '2 bulan lalu',
                        rating: 5,
                        comment: 'Layanan fotografi yang sangat profesional. Hasil foto sangat memuaskan dan sesuai dengan ekspektasi kami. Fotografer sangat ramah dan membantu selama sesi pemotretan.'
                      },
                      {
                        name: 'Rina Wijaya',
                        date: '3 bulan lalu',
                        rating: 5,
                        comment: 'Sangat puas dengan hasil foto wisuda saya. Kualitas gambar sangat bagus dan pengambilan gambar yang kreatif. Terima kasih MKVI!'
                      },
                      {
                        name: 'PT Maju Bersama',
                        date: '4 bulan lalu',
                        rating: 5,
                        comment: 'Kami menggunakan jasa MKVI untuk acara corporate event perusahaan. Hasilnya sangat profesional dan tim sangat kooperatif. Akan menggunakan jasa mereka lagi untuk acara mendatang.'
                      }
                    ].map((review, index) => (
                      <div key={index} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <div className="flex justify-between mb-2">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {review.name}
                          </div>
                          <div className="text-gray-500 dark:text-gray-400 text-sm">
                            {review.date}
                          </div>
                        </div>
                        <div className="flex mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`w-4 h-4 ${
                                star <= review.rating 
                                  ? 'text-yellow-500 fill-current' 
                                  : 'text-gray-300 dark:text-gray-600'
                              }`} 
                            />
                          ))}
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">
                          {review.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </section>
          
          {/* CTA Section */}
          <section className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Tertarik dengan layanan ini?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Pesan sekarang untuk mendapatkan penawaran terbaik
                </p>
              </div>
              
              <div className="flex space-x-4">
                <Link to="/pengguna/pemesanan">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition-colors flex items-center"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Pesan Sekarang
                  </motion.button>
                </Link>
                <Link to="/pengguna/bantuan">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-primary-600 border border-primary-600 px-6 py-3 rounded-md hover:bg-primary-50 transition-colors"
                  >
                    Tanya Lebih Lanjut
                  </motion.button>
                </Link>
              </div>
            </div>
          </section>
          
          {/* Related Services */}
          {!loadingRelated && relatedLayanan && relatedLayanan.length > 0 && (
            <section ref={relatedRef}>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isRelatedInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
                className="text-2xl font-bold text-gray-900 dark:text-white mb-6"
              >
                Layanan Terkait
              </motion.h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedLayanan.map((related, index) => (
                  <motion.div
                    key={related.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isRelatedInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                  >
                    <Link to={`/pengguna/layanan/${related.slug}`}>
                      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all">
                        <div className="h-48 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          <Camera className="w-12 h-12 text-gray-400" />
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {related.nama_layanan}
                          </h3>
                          <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                            <Tag className="w-4 h-4 mr-1" />
                            <span>{getCategoryLabel(related.kategori)}</span>
                          </div>
                          <div className="flex items-center text-primary-600 dark:text-primary-400 font-medium">
                            <DollarSign className="w-4 h-4 mr-1" />
                            <span>Mulai dari {formatCurrency(related.harga_minimal)}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </section>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            Layanan tidak ditemukan
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Layanan yang Anda cari tidak tersedia atau telah dihapus
          </p>
          <Link to="/pengguna/layanan">
            <button className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors">
              Lihat Semua Layanan
            </button>
          </Link>
        </div>
      )}
    </div>
  )
}

export default UserLayananDetailPage
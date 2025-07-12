import React, { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Mail, 
  Phone, 
  MessageSquare,
  Send,
  Clock,
  CreditCard,
  FileText,
  Camera,
  Calendar,
  ShoppingCart,
  User
} from 'lucide-react'

const UserBantuanPage = () => {
  const headerRef = useRef(null)
  const isHeaderInView = useInView(headerRef, { once: true })
  
  const faqRef = useRef(null)
  const isFaqInView = useInView(faqRef, { once: true })
  
  const contactRef = useRef(null)
  const isContactInView = useInView(contactRef, { once: true })
  
  const guideRef = useRef(null)
  const isGuideInView = useInView(guideRef, { once: true })
  
  const [activeCategory, setActiveCategory] = useState('umum')
  const [expandedFaq, setExpandedFaq] = useState(null)
  
  // FAQ categories
  const faqCategories = [
    { id: 'umum', name: 'Umum' },
    { id: 'layanan', name: 'Layanan' },
    { id: 'pemesanan', name: 'Pemesanan' },
    { id: 'pembayaran', name: 'Pembayaran' },
    { id: 'meeting', name: 'Meeting' },
    { id: 'dokumen', name: 'Dokumen' }
  ]
  
  // FAQ items
  const faqItems = {
    umum: [
      {
        id: 'umum-1',
        question: 'Apa itu MKVI?',
        answer: 'MKVI (Myer Kreatif Vision Vibe) adalah penyedia jasa fotografi profesional dan pembuatan website. Kami menawarkan berbagai layanan fotografi untuk acara pernikahan, wisuda, acara korporat, serta jasa pembuatan website berkualitas tinggi.'
      },
      {
        id: 'umum-2',
        question: 'Di mana lokasi studio MKVI?',
        answer: 'Studio kami berlokasi di Perum Telaga Murni Blok E23 No. 25, RT 02 RW 08 Kelurahan Telaga Murni, Kec. Cikarang Barat, Kab. Bekasi, Jawa Barat 17530.'
      },
      {
        id: 'umum-3',
        question: 'Bagaimana cara menghubungi MKVI?',
        answer: 'Anda dapat menghubungi kami melalui telepon di +62 852-8312-5585, email ke myerkvi@gmail.com, atau mengisi form kontak di website kami.'
      },
      {
        id: 'umum-4',
        question: 'Apakah MKVI melayani area di luar Bekasi?',
        answer: 'Ya, kami melayani area Jabodetabek dan sekitarnya. Untuk lokasi di luar area tersebut, mungkin akan dikenakan biaya transportasi tambahan.'
      }
    ],
    layanan: [
      {
        id: 'layanan-1',
        question: 'Apa saja layanan fotografi yang ditawarkan MKVI?',
        answer: 'Kami menawarkan layanan fotografi prewedding, wedding, graduation, corporate event, dan documentary. Selain itu, kami juga menyediakan layanan drone photography untuk mengambil gambar dari udara.'
      },
      {
        id: 'layanan-2',
        question: 'Apakah MKVI juga menyediakan jasa videografi?',
        answer: 'Ya, kami juga menyediakan jasa videografi untuk berbagai acara. Kami dapat membuat video dokumentasi acara, video prewedding, dan video corporate.'
      },
      {
        id: 'layanan-3',
        question: 'Berapa lama waktu pengerjaan untuk layanan fotografi?',
        answer: 'Waktu pengerjaan bervariasi tergantung jenis layanan. Untuk fotografi acara, hasil foto akan diberikan dalam waktu 3-7 hari kerja. Untuk prewedding dan layanan lainnya, waktu pengerjaan sekitar 1-2 minggu.'
      },
      {
        id: 'layanan-4',
        question: 'Apa saja jenis website yang bisa dibuat oleh MKVI?',
        answer: 'Kami dapat membuat berbagai jenis website seperti company profile, portfolio, e-commerce, blog, dan landing page. Semua website yang kami buat responsif dan SEO-friendly.'
      }
    ],
    pemesanan: [
      {
        id: 'pemesanan-1',
        question: 'Bagaimana cara memesan layanan MKVI?',
        answer: 'Anda dapat memesan layanan kami melalui website dengan membuat akun terlebih dahulu, kemudian pilih layanan yang diinginkan dan isi form pemesanan. Anda juga bisa menghubungi kami langsung melalui telepon atau email.'
      },
      {
        id: 'pemesanan-2',
        question: 'Berapa lama waktu konfirmasi setelah pemesanan?',
        answer: 'Kami akan mengonfirmasi pemesanan Anda dalam waktu 1x24 jam pada hari kerja. Setelah dikonfirmasi, Anda akan mendapatkan invoice untuk pembayaran DP.'
      },
      {
        id: 'pemesanan-3',
        question: 'Apakah saya bisa membatalkan pemesanan?',
        answer: 'Pembatalan pemesanan dapat dilakukan sebelum pembayaran DP. Setelah DP dibayarkan, pembatalan akan dikenakan biaya sesuai dengan ketentuan yang berlaku.'
      },
      {
        id: 'pemesanan-4',
        question: 'Bagaimana cara melacak status pemesanan saya?',
        answer: 'Anda dapat melacak status pemesanan melalui akun Anda di website kami. Kami juga akan mengirimkan update status melalui email dan WhatsApp.'
      }
    ],
    pembayaran: [
      {
        id: 'pembayaran-1',
        question: 'Apa metode pembayaran yang tersedia?',
        answer: 'Saat ini kami menerima pembayaran melalui transfer bank ke rekening BCA kami. Kami akan segera menambahkan metode pembayaran lainnya di masa mendatang.'
      },
      {
        id: 'pembayaran-2',
        question: 'Berapa jumlah DP yang harus dibayarkan?',
        answer: 'DP yang harus dibayarkan adalah 25% dari total biaya layanan. Pelunasan sebesar 75% dilakukan sebelum hasil akhir dikirimkan.'
      },
      {
        id: 'pembayaran-3',
        question: 'Kapan saya harus melunasi pembayaran?',
        answer: 'Pelunasan pembayaran dilakukan setelah proyek selesai dan sebelum hasil akhir dikirimkan kepada Anda.'
      },
      {
        id: 'pembayaran-4',
        question: 'Apakah ada biaya tambahan yang perlu saya ketahui?',
        answer: 'Biaya tambahan mungkin dikenakan untuk lokasi di luar area Jabodetabek, permintaan khusus, atau revisi yang melebihi batas yang ditentukan dalam perjanjian.'
      }
    ],
    meeting: [
      {
        id: 'meeting-1',
        question: 'Bagaimana proses meeting dengan tim MKVI?',
        answer: 'Setelah pemesanan dikonfirmasi, kami akan mengirimkan link Calendly untuk Anda memilih jadwal meeting yang sesuai. Meeting dapat dilakukan secara online melalui Google Meet.'
      },
      {
        id: 'meeting-2',
        question: 'Apa yang perlu saya siapkan untuk meeting?',
        answer: 'Anda perlu menyiapkan detail kebutuhan Anda, referensi visual jika ada, dan pertanyaan yang ingin Anda ajukan. Untuk meeting online, pastikan koneksi internet Anda stabil.'
      },
      {
        id: 'meeting-3',
        question: 'Berapa lama durasi meeting?',
        answer: 'Durasi meeting biasanya sekitar 30-60 menit, tergantung pada kompleksitas proyek dan banyaknya hal yang perlu didiskusikan.'
      },
      {
        id: 'meeting-4',
        question: 'Apakah saya bisa menjadwalkan ulang meeting?',
        answer: 'Ya, Anda dapat menjadwalkan ulang meeting melalui link Calendly yang kami kirimkan, selama dilakukan minimal 24 jam sebelum jadwal yang sudah ditentukan.'
      }
    ],
    dokumen: [
      {
        id: 'dokumen-1',
        question: 'Apa saja dokumen yang akan saya terima?',
        answer: 'Anda akan menerima Invoice untuk tagihan pembayaran, MoU (Memorandum of Understanding) sebagai perjanjian kerja, dan Kwitansi sebagai bukti pembayaran.'
      },
      {
        id: 'dokumen-2',
        question: 'Bagaimana cara mendapatkan dokumen-dokumen tersebut?',
        answer: 'Semua dokumen akan dikirimkan melalui email dan juga tersedia untuk diunduh di akun Anda di website kami.'
      },
      {
        id: 'dokumen-3',
        question: 'Apakah dokumen-dokumen tersebut memiliki kekuatan hukum?',
        answer: 'Ya, MoU yang kami buat memiliki kekuatan hukum sebagai perjanjian antara Anda dan MKVI. Invoice dan Kwitansi juga merupakan dokumen resmi untuk keperluan pembukuan.'
      },
      {
        id: 'dokumen-4',
        question: 'Berapa lama dokumen tersebut tersimpan di sistem?',
        answer: 'Dokumen Anda akan tersimpan di sistem kami selama minimal 2 tahun. Anda juga disarankan untuk menyimpan salinan dokumen tersebut untuk keperluan pribadi.'
      }
    ]
  }
  
  // User guides
  const userGuides = [
    {
      id: 1,
      title: 'Cara Membuat Akun',
      icon: User,
      steps: [
        'Klik tombol "Daftar" di pojok kanan atas',
        'Isi form pendaftaran dengan data yang valid',
        'Verifikasi email Anda',
        'Login dengan email dan password yang telah dibuat'
      ]
    },
    {
      id: 2,
      title: 'Cara Memesan Layanan',
      icon: ShoppingCart,
      steps: [
        'Login ke akun Anda',
        'Pilih layanan yang diinginkan',
        'Isi form pemesanan dengan detail acara',
        'Konfirmasi pemesanan',
        'Tunggu validasi dari admin'
      ]
    },
    {
      id: 3,
      title: 'Cara Menjadwalkan Meeting',
      icon: Calendar,
      steps: [
        'Masuk ke halaman Meeting',
        'Pilih jadwal yang tersedia melalui Calendly',
        'Isi form dengan informasi yang diperlukan',
        'Konfirmasi jadwal meeting',
        'Anda akan menerima link meeting melalui email'
      ]
    },
    {
      id: 4,
      title: 'Cara Melakukan Pembayaran',
      icon: CreditCard,
      steps: [
        'Masuk ke halaman Pembayaran',
        'Pilih jenis pembayaran (DP/Pelunasan)',
        'Transfer ke rekening yang tertera',
        'Upload bukti pembayaran',
        'Tunggu verifikasi dari admin'
      ]
    },
    {
      id: 5,
      title: 'Cara Mengunduh Dokumen',
      icon: FileText,
      steps: [
        'Masuk ke halaman Dokumen',
        'Pilih dokumen yang ingin diunduh (Invoice/MoU/Kwitansi)',
        'Klik tombol "Unduh"',
        'Dokumen akan terunduh ke perangkat Anda'
      ]
    },
    {
      id: 6,
      title: 'Cara Melacak Status Pemesanan',
      icon: Clock,
      steps: [
        'Login ke akun Anda',
        'Masuk ke halaman Pemesanan',
        'Lihat status pemesanan Anda',
        'Anda juga bisa melacak melalui kode tracking yang diberikan'
      ]
    }
  ]
  
  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id)
  }

  return (
    <div className="space-y-16">
      {/* Header */}
      <section ref={headerRef} className="text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
        >
          Pusat Bantuan
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8"
        >
          Temukan jawaban untuk pertanyaan Anda dan panduan penggunaan layanan kami
        </motion.p>
        
        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="max-w-xl mx-auto"
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Cari bantuan..."
              className="w-full px-4 py-3 pl-12 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <HelpCircle className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-primary-600 text-white px-4 py-1 rounded-full hover:bg-primary-700 transition-colors">
              Cari
            </button>
          </div>
        </motion.div>
      </section>
      
      {/* FAQ Section */}
      <section ref={faqRef} className="container mx-auto px-6">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isFaqInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Pertanyaan yang Sering Diajukan
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isFaqInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Temukan jawaban untuk pertanyaan umum tentang layanan kami
          </motion.p>
        </div>
        
        {/* FAQ Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isFaqInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {faqCategories.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {category.name}
            </motion.button>
          ))}
        </motion.div>
        
        {/* FAQ Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isFaqInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="max-w-3xl mx-auto space-y-4"
        >
          {faqItems[activeCategory].map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isFaqInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
            >
              <button
                onClick={() => toggleFaq(item.id)}
                className="w-full flex items-center justify-between p-4 text-left focus:outline-none"
              >
                <span className="text-lg font-medium text-gray-900 dark:text-white">
                  {item.question}
                </span>
                {expandedFaq === item.id ? (
                  <ChevronUp className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                )}
              </button>
              
              {expandedFaq === item.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-4 pb-4"
                >
                  <p className="text-gray-600 dark:text-gray-400">
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </section>
      
      {/* User Guide Section */}
      <section ref={guideRef} className="bg-gray-50 dark:bg-gray-800 py-16 rounded-3xl">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isGuideInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
            >
              Panduan Pengguna
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isGuideInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
            >
              Langkah-langkah mudah untuk menggunakan layanan kami
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {userGuides.map((guide, index) => (
              <motion.div
                key={guide.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isGuideInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mr-4">
                      <guide.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {guide.title}
                    </h3>
                  </div>
                  
                  <ol className="space-y-2 ml-4">
                    {guide.steps.map((step, stepIndex) => (
                      <motion.li
                        key={stepIndex}
                        initial={{ opacity: 0, x: -10 }}
                        animate={isGuideInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.3 + index * 0.1 + stepIndex * 0.05, duration: 0.5 }}
                        className="flex items-start"
                      >
                        <span className="w-5 h-5 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-0.5">
                          {stepIndex + 1}
                        </span>
                        <span className="text-gray-600 dark:text-gray-300">{step}</span>
                      </motion.li>
                    ))}
                  </ol>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section ref={contactRef} className="container mx-auto px-6 mb-20">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isContactInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Hubungi Kami
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isContactInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Jika Anda memiliki pertanyaan lain, jangan ragu untuk menghubungi kami
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isContactInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Kirim Pesan
            </h3>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Masukkan nama lengkap Anda"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Masukkan email Anda"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Subjek
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Masukkan subjek pesan"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Pesan
                </label>
                <textarea
                  rows="5"
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Masukkan pesan Anda"
                ></textarea>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors flex items-center justify-center"
              >
                <Send className="w-4 h-4 mr-2" />
                Kirim Pesan
              </motion.button>
            </form>
          </motion.div>
          
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isContactInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Informasi Kontak
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-1 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Email</p>
                    <a href="mailto:myerkvi@gmail.com" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                      myerkvi@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-1 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Telepon</p>
                    <a href="tel:+6285283125585" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                      +62 852-8312-5585
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MessageSquare className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-1 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">WhatsApp</p>
                    <a href="https://wa.me/6285283125585" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                      +62 852-8312-5585
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Jam Operasional
              </h3>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Senin - Jumat</span>
                  <span className="text-gray-900 dark:text-white">09:00 - 17:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Sabtu</span>
                  <span className="text-gray-900 dark:text-white">09:00 - 15:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Minggu</span>
                  <span className="text-gray-900 dark:text-white">Tutup</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  <Clock className="w-4 h-4 inline-block mr-1" />
                  Respons email dan WhatsApp dalam 1x24 jam pada hari kerja.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default UserBantuanPage
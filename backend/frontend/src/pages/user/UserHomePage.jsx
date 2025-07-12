import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { 
  Camera, 
  Calendar, 
  FileText, 
  CreditCard, 
  ArrowRight,
  CheckCircle,
  Star,
  Award,
  Users,
  Clock,
  ThumbsUp
} from 'lucide-react'
import { useQuery } from 'react-query'
import { layananService } from '../../services/api'
import UserServiceCard from '../../components/user/UserServiceCard'
import UserTestimonialCard from '../../components/user/UserTestimonialCard'

const UserHomePage = () => {
  const heroRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true })
  
  const servicesRef = useRef(null)
  const isServicesInView = useInView(servicesRef, { once: true })
  
  const stepsRef = useRef(null)
  const isStepsInView = useInView(stepsRef, { once: true })
  
  const testimonialsRef = useRef(null)
  const isTestimonialsInView = useInView(testimonialsRef, { once: true })
  
  const statsRef = useRef(null)
  const isStatsInView = useInView(statsRef, { once: true })
  
  const ctaRef = useRef(null)
  const isCtaInView = useInView(ctaRef, { once: true })
  
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.2])
  const y = useTransform(scrollYProgress, [0, 0.2], [0, 100])

  // Fetch featured services
  const { data: featuredServices, isLoading } = useQuery(
    'featured-services',
    () => layananService.getAll({ unggulan: true, limit: 4 }),
    {
      select: (data) => data.data.data.layanan
    }
  )

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: 'Andi Pratama',
      role: 'Pengantin',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      content: 'Hasil foto prewedding kami sangat memuaskan. Tim MKVI sangat profesional dan membantu kami dari awal hingga akhir proses. Mereka memahami apa yang kami inginkan dan memberikan hasil yang melebihi ekspektasi kami.',
      rating: 5
    },
    {
      id: 2,
      name: 'Rina Wijaya',
      role: 'Wisudawan',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      content: 'Saya sangat puas dengan hasil foto wisuda saya. Kualitas gambar sangat bagus dan pengambilan gambar yang kreatif. Fotografer sangat ramah dan membuat saya nyaman selama sesi pemotretan.',
      rating: 5
    },
    {
      id: 3,
      name: 'PT Maju Bersama',
      role: 'Corporate Client',
      image: 'https://randomuser.me/api/portraits/men/68.jpg',
      content: 'Website yang dibuat sangat profesional dan sesuai dengan brand kami. Proses pengerjaan cepat dan komunikasi lancar. Tim MKVI sangat responsif terhadap feedback dan revisi yang kami berikan.',
      rating: 4
    }
  ]

  // Stats data
  const stats = [
    { id: 1, value: '500+', label: 'Klien Puas', icon: Users },
    { id: 2, value: '1000+', label: 'Proyek Selesai', icon: CheckCircle },
    { id: 3, value: '5+', label: 'Tahun Pengalaman', icon: Clock },
    { id: 4, value: '4.9', label: 'Rating Kepuasan', icon: ThumbsUp }
  ]

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <motion.section 
        ref={heroRef}
        style={{ opacity, y }}
        className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20 rounded-3xl overflow-hidden"
      >
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-2xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Abadikan Momen Berharga Anda Bersama MKVI
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-lg md:text-xl mb-8"
            >
              Layanan fotografi profesional untuk pernikahan, wisuda, acara korporat, 
              dan pembuatan website berkualitas tinggi.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/pengguna/layanan">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-lg bg-white text-primary-600 hover:bg-gray-100"
                >
                  Lihat Layanan
                </motion.button>
              </Link>
              <Link to="/pengguna/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-lg bg-transparent border-2 border-white hover:bg-white/10"
                >
                  Daftar Sekarang
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
        
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M45.3,-51.2C58.3,-42.5,68.5,-27.1,71.3,-10.7C74.2,5.7,69.7,23.1,59.3,35.9C48.9,48.7,32.5,57,15.2,62.5C-2.1,68.1,-20.4,70.9,-35.3,64.5C-50.2,58.2,-61.8,42.7,-67.4,25.3C-73,7.9,-72.6,-11.4,-64.5,-26.5C-56.3,-41.6,-40.4,-52.5,-24.8,-59.8C-9.2,-67.1,6.2,-70.8,21.9,-67.7C37.7,-64.6,53.8,-54.7,45.3,-51.2Z" transform="translate(100 100)" />
          </svg>
        </div>
        
        {/* Animated stars */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </motion.section>

      {/* Featured Services Section */}
      <section ref={servicesRef} className="container mx-auto px-6">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isServicesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Layanan Unggulan Kami
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isServicesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Kami menyediakan berbagai layanan fotografi dan pembuatan website profesional
            untuk memenuhi kebutuhan Anda.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                </div>
              </div>
            ))
          ) : (
            featuredServices?.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isServicesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
              >
                <UserServiceCard service={service} />
              </motion.div>
            ))
          )}
        </div>
        
        <div className="text-center mt-10">
          <Link to="/pengguna/layanan">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-primary btn-lg"
            >
              Lihat Semua Layanan
              <ArrowRight className="w-4 h-4 ml-2" />
            </motion.button>
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section ref={stepsRef} className="bg-gray-50 dark:bg-gray-800 py-16 rounded-3xl">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isStepsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
            >
              Cara Kerja
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isStepsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
            >
              Proses pemesanan layanan fotografi dan website yang mudah dan cepat
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: Camera, 
                title: 'Pilih Layanan', 
                description: 'Pilih layanan fotografi atau website yang sesuai dengan kebutuhan Anda' 
              },
              { 
                icon: Calendar, 
                title: 'Jadwalkan Meeting', 
                description: 'Diskusikan detail kebutuhan Anda dengan tim kami' 
              },
              { 
                icon: FileText, 
                title: 'Tanda Tangani MoU', 
                description: 'Setujui perjanjian kerja sama untuk memulai proyek' 
              },
              { 
                icon: CreditCard, 
                title: 'Lakukan Pembayaran', 
                description: 'Bayar DP atau full payment untuk memulai pengerjaan' 
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isStepsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md text-center relative"
              >
                {/* Step number */}
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                
                {/* Icon */}
                <motion.div 
                  className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <step.icon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </motion.div>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400">
                  {step.description}
                </p>
                
                {/* Connector line (except for the last item) */}
                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-primary-200 dark:bg-primary-700">
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-primary-600 rounded-full"></div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section ref={testimonialsRef} className="container mx-auto px-6">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isTestimonialsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Apa Kata Mereka
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isTestimonialsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Testimoni dari klien yang telah menggunakan layanan kami
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isTestimonialsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
            >
              <UserTestimonialCard testimonial={testimonial} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="bg-primary-600 text-white py-16 rounded-3xl">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                className="text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <stat.icon className="w-8 h-8 text-white" />
                </motion.div>
                
                <motion.h3
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={isStatsInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                  className="text-3xl font-bold mb-2"
                >
                  {stat.value}
                </motion.h3>
                
                <p className="text-primary-100">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="container mx-auto px-6 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isCtaInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-3xl overflow-hidden shadow-xl"
        >
          <div className="relative px-6 py-16 md:px-12 text-center">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden opacity-10">
              <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white"></div>
              <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-white"></div>
            </div>
            
            <div className="relative z-10">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isCtaInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="text-3xl md:text-4xl font-bold text-white mb-6"
              >
                Siap Mengabadikan Momen Berharga Anda?
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isCtaInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto"
              >
                Hubungi kami sekarang untuk konsultasi gratis dan dapatkan penawaran terbaik
                untuk kebutuhan fotografi dan website Anda.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isCtaInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link to="/pengguna/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-lg bg-white text-primary-600 hover:bg-gray-100"
                  >
                    Daftar Sekarang
                  </motion.button>
                </Link>
                <Link to="/pengguna/layanan">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-lg bg-transparent border-2 border-white hover:bg-white/10"
                  >
                    Lihat Layanan
                  </motion.button>
                </Link>
              </motion.div>
            </div>
            
            {/* Animated stars */}
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0.2, 1, 0.2],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 3 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                }}
              />
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  )
}

export default UserHomePage
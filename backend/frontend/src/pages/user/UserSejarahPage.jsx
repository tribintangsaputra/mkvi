import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { 
  Calendar, 
  Award, 
  Users, 
  Camera, 
  Monitor, 
  MapPin,
  Star,
  Heart
} from 'lucide-react'

const UserSejarahPage = () => {
  const headerRef = useRef(null)
  const isHeaderInView = useInView(headerRef, { once: true })
  
  const storyRef = useRef(null)
  const isStoryInView = useInView(storyRef, { once: true })
  
  const timelineRef = useRef(null)
  const isTimelineInView = useInView(timelineRef, { once: true })
  
  const teamRef = useRef(null)
  const isTeamInView = useInView(teamRef, { once: true })
  
  const valuesRef = useRef(null)
  const isValuesInView = useInView(valuesRef, { once: true })
  
  // Timeline data
  const timeline = [
    {
      year: 2018,
      title: 'Awal Mula',
      description: 'MKVI didirikan oleh sekelompok fotografer muda yang memiliki passion dalam bidang fotografi dan desain website.',
      icon: Calendar
    },
    {
      year: 2019,
      title: 'Ekspansi Layanan',
      description: 'Mulai menawarkan layanan pembuatan website untuk melengkapi layanan fotografi yang sudah ada.',
      icon: Monitor
    },
    {
      year: 2020,
      title: 'Bertahan di Masa Pandemi',
      description: 'Beradaptasi dengan situasi pandemi dengan menawarkan layanan virtual photoshoot dan fokus pada pengembangan website.',
      icon: Camera
    },
    {
      year: 2021,
      title: 'Penghargaan Pertama',
      description: 'Menerima penghargaan "Best Wedding Photography" dari Indonesia Photography Awards.',
      icon: Award
    },
    {
      year: 2022,
      title: 'Pembukaan Studio Baru',
      description: 'Membuka studio fotografi baru yang lebih besar dan modern di Cikarang.',
      icon: MapPin
    },
    {
      year: 2023,
      title: 'Ekspansi Tim',
      description: 'Memperbesar tim dengan menambahkan lebih banyak fotografer profesional dan web developer.',
      icon: Users
    },
    {
      year: 2024,
      title: 'Inovasi Teknologi',
      description: 'Mengadopsi teknologi terbaru dalam fotografi dan pengembangan website untuk meningkatkan kualitas layanan.',
      icon: Star
    }
  ]
  
  // Team members data
  const teamMembers = [
    {
      id: 1,
      name: 'Budi Santoso',
      role: 'Founder & Lead Photographer',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      bio: 'Budi memiliki pengalaman lebih dari 10 tahun dalam dunia fotografi. Spesialisasi dalam wedding dan prewedding photography.'
    },
    {
      id: 2,
      name: 'Rina Wijaya',
      role: 'Creative Director',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      bio: 'Rina adalah seorang creative director dengan latar belakang desain grafis. Ia bertanggung jawab atas konsep visual untuk setiap proyek.'
    },
    {
      id: 3,
      name: 'Dimas Prayoga',
      role: 'Lead Web Developer',
      image: 'https://randomuser.me/api/portraits/men/68.jpg',
      bio: 'Dimas adalah web developer berpengalaman yang fokus pada pengembangan website dengan teknologi terkini.'
    },
    {
      id: 4,
      name: 'Sari Indah',
      role: 'Marketing Manager',
      image: 'https://randomuser.me/api/portraits/women/17.jpg',
      bio: 'Sari mengelola strategi pemasaran dan hubungan dengan klien untuk memastikan kepuasan pelanggan.'
    }
  ]
  
  // Company values
  const values = [
    {
      id: 1,
      title: 'Kreativitas',
      description: 'Kami selalu berinovasi dan mencari pendekatan kreatif dalam setiap proyek.',
      icon: Star
    },
    {
      id: 2,
      title: 'Kualitas',
      description: 'Kami berkomitmen untuk memberikan hasil dengan kualitas terbaik tanpa kompromi.',
      icon: Award
    },
    {
      id: 3,
      title: 'Profesionalisme',
      description: 'Kami bekerja dengan standar profesional tinggi dan menghargai setiap detail.',
      icon: Users
    },
    {
      id: 4,
      title: 'Kepuasan Klien',
      description: 'Kepuasan klien adalah prioritas utama kami dalam setiap proyek yang kami kerjakan.',
      icon: Heart
    }
  ]

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
          Sejarah MKVI
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8"
        >
          Perjalanan kami dalam membangun MKVI sebagai penyedia jasa fotografi dan pembuatan website terpercaya.
        </motion.p>
      </section>
      
      {/* Our Story */}
      <section ref={storyRef} className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isStoryInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Kisah Kami
            </h2>
            
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                MKVI didirikan pada tahun 2018 oleh sekelompok fotografer muda yang memiliki passion dalam bidang fotografi dan desain website. Berawal dari studio kecil di Cikarang, kami mulai menawarkan jasa fotografi untuk acara pernikahan, wisuda, dan acara korporat.
              </p>
              
              <p>
                Seiring berjalannya waktu, kami melihat kebutuhan klien yang tidak hanya membutuhkan jasa fotografi, tetapi juga pembuatan website untuk bisnis mereka. Hal ini mendorong kami untuk memperluas layanan dengan menambahkan jasa pembuatan website.
              </p>
              
              <p>
                Pada tahun 2020, ketika pandemi COVID-19 melanda, kami beradaptasi dengan situasi dengan menawarkan layanan virtual photoshoot dan fokus pada pengembangan website. Ini membantu kami bertahan dan bahkan berkembang di masa-masa sulit.
              </p>
              
              <p>
                Tahun 2022 menjadi tonggak penting bagi kami dengan pembukaan studio baru yang lebih besar dan modern di Cikarang. Ini menandai pertumbuhan signifikan MKVI sebagai penyedia jasa fotografi dan pembuatan website terpercaya di wilayah Bekasi dan sekitarnya.
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isStoryInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img 
                  src="https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg" 
                  alt="Team working" 
                  className="rounded-lg shadow-md h-40 w-full object-cover"
                />
                <img 
                  src="https://images.pexels.com/photos/3182777/pexels-photo-3182777.jpeg" 
                  alt="Office" 
                  className="rounded-lg shadow-md h-64 w-full object-cover"
                />
              </div>
              <div className="space-y-4 mt-8">
                <img 
                  src="https://images.pexels.com/photos/3182781/pexels-photo-3182781.jpeg" 
                  alt="Photography session" 
                  className="rounded-lg shadow-md h-64 w-full object-cover"
                />
                <img 
                  src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg" 
                  alt="Team meeting" 
                  className="rounded-lg shadow-md h-40 w-full object-cover"
                />
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary-100 dark:bg-primary-900/30 rounded-full -z-10"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary-100 dark:bg-primary-900/30 rounded-full -z-10"></div>
          </motion.div>
        </div>
      </section>
      
      {/* Timeline */}
      <section ref={timelineRef} className="bg-gray-50 dark:bg-gray-800 py-16 rounded-3xl">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isTimelineInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
            >
              Perjalanan Kami
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isTimelineInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
            >
              Momen-momen penting dalam perjalanan MKVI dari awal hingga sekarang
            </motion.p>
          </div>
          
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-primary-200 dark:bg-primary-800"></div>
            
            {/* Timeline items */}
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isTimelineInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                  className={`flex items-center ${
                    index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                  }`}
                >
                  {/* Content */}
                  <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-primary-600 dark:text-primary-400 font-semibold mb-2">
                      {item.year}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {item.description}
                    </p>
                  </div>
                  
                  {/* Center icon */}
                  <div className="w-2/12 flex justify-center">
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center z-10"
                    >
                      <item.icon className="w-6 h-6 text-white" />
                    </motion.div>
                  </div>
                  
                  {/* Empty space for alternating layout */}
                  <div className="w-5/12"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section ref={teamRef} className="container mx-auto px-6">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isTeamInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Tim Kami
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isTeamInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Kenali orang-orang berbakat di balik MKVI
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isTeamInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md"
            >
              <div className="h-64 overflow-hidden">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  {member.name}
                </h3>
                
                <p className="text-primary-600 dark:text-primary-400 font-medium mb-3">
                  {member.role}
                </p>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {member.bio}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Company Values */}
      <section ref={valuesRef} className="bg-primary-600 text-white py-16 rounded-3xl">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isValuesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold mb-4"
            >
              Nilai-Nilai Kami
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isValuesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-primary-100 max-w-2xl mx-auto"
            >
              Prinsip-prinsip yang menjadi panduan kami dalam bekerja
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isValuesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6"
              >
                <motion.div
                  whileHover={{ rotate: 10 }}
                  className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <value.icon className="w-8 h-8 text-white" />
                </motion.div>
                
                <h3 className="text-xl font-semibold text-center mb-3">
                  {value.title}
                </h3>
                
                <p className="text-primary-100 text-center">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default UserSejarahPage
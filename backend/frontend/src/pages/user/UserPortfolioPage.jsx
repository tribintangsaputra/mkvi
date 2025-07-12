import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Image, Camera, Video, Award, ExternalLink } from 'lucide-react'

const UserPortfolioPage = () => {
  const headerRef = useRef(null)
  const isHeaderInView = useInView(headerRef, { once: true })
  
  const galleryRef = useRef(null)
  const isGalleryInView = useInView(galleryRef, { once: true })
  
  const awardsRef = useRef(null)
  const isAwardsInView = useInView(awardsRef, { once: true })
  
  // Portfolio categories
  const categories = [
    { id: 'all', name: 'Semua' },
    { id: 'prewedding', name: 'Prewedding' },
    { id: 'wedding', name: 'Wedding' },
    { id: 'graduation', name: 'Graduation' },
    { id: 'corporate', name: 'Corporate' },
    { id: 'drone', name: 'Drone' },
    { id: 'website', name: 'Website' }
  ]
  
  // Portfolio items
  const portfolioItems = [
    {
      id: 1,
      title: 'Prewedding Andi & Rina',
      category: 'prewedding',
      image: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg',
      type: 'image'
    },
    {
      id: 2,
      title: 'Wedding Budi & Sari',
      category: 'wedding',
      image: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg',
      type: 'image'
    },
    {
      id: 3,
      title: 'Graduation Day ITB',
      category: 'graduation',
      image: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg',
      type: 'image'
    },
    {
      id: 4,
      title: 'PT Maju Bersama Corporate Event',
      category: 'corporate',
      image: 'https://images.pexels.com/photos/2566581/pexels-photo-2566581.jpeg',
      type: 'image'
    },
    {
      id: 5,
      title: 'Drone Footage Pantai Anyer',
      category: 'drone',
      image: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg',
      type: 'video'
    },
    {
      id: 6,
      title: 'Website Toko Online XYZ',
      category: 'website',
      image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg',
      type: 'website',
      url: 'https://example.com'
    },
    {
      id: 7,
      title: 'Prewedding Dimas & Putri',
      category: 'prewedding',
      image: 'https://images.pexels.com/photos/1128317/pexels-photo-1128317.jpeg',
      type: 'image'
    },
    {
      id: 8,
      title: 'Wedding Ceremony Rudi & Ani',
      category: 'wedding',
      image: 'https://images.pexels.com/photos/1043902/pexels-photo-1043902.jpeg',
      type: 'image'
    },
    {
      id: 9,
      title: 'Graduation Universitas Indonesia',
      category: 'graduation',
      image: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg',
      type: 'image'
    },
    {
      id: 10,
      title: 'Annual Meeting PT ABC',
      category: 'corporate',
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg',
      type: 'image'
    },
    {
      id: 11,
      title: 'Drone View Gunung Bromo',
      category: 'drone',
      image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg',
      type: 'video'
    },
    {
      id: 12,
      title: 'Website Company Profile DEF',
      category: 'website',
      image: 'https://images.pexels.com/photos/326503/pexels-photo-326503.jpeg',
      type: 'website',
      url: 'https://example.com'
    }
  ]
  
  // Awards data
  const awards = [
    {
      id: 1,
      title: 'Best Wedding Photography',
      organization: 'Indonesia Photography Awards',
      year: 2024,
      image: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg'
    },
    {
      id: 2,
      title: 'Excellence in Corporate Photography',
      organization: 'Business Media Association',
      year: 2023,
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg'
    },
    {
      id: 3,
      title: 'Best Website Design',
      organization: 'Indonesia Web Awards',
      year: 2023,
      image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg'
    }
  ]
  
  const [activeCategory, setActiveCategory] = React.useState('all')
  const [selectedItem, setSelectedItem] = React.useState(null)
  
  const filteredItems = activeCategory === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeCategory)

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
          Portfolio Kami
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8"
        >
          Koleksi karya terbaik kami dalam fotografi dan pembuatan website. Setiap proyek
          dikerjakan dengan dedikasi tinggi untuk memberikan hasil yang memuaskan.
        </motion.p>
        
        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {categories.map((category) => (
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
      </section>
      
      {/* Portfolio Gallery */}
      <section ref={galleryRef} className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isGalleryInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 * (index % 6), duration: 0.5 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md cursor-pointer relative group"
              onClick={() => setSelectedItem(item)}
            >
              {/* Type indicator */}
              <div className="absolute top-2 left-2 z-10">
                <div className={`flex items-center space-x-1 rounded-full px-2 py-1 text-xs font-medium ${
                  item.type === 'video' 
                    ? 'bg-red-500 text-white' 
                    : item.type === 'website'
                    ? 'bg-blue-500 text-white'
                    : 'bg-green-500 text-white'
                }`}>
                  {item.type === 'image' && <Camera className="w-3 h-3" />}
                  {item.type === 'video' && <Video className="w-3 h-3" />}
                  {item.type === 'website' && <ExternalLink className="w-3 h-3" />}
                  <span>{item.type === 'image' ? 'Foto' : item.type === 'video' ? 'Video' : 'Website'}</span>
                </div>
              </div>
              
              {/* Image */}
              <div className="h-64 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="p-4 text-white">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-200 capitalize">{item.category}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Awards Section */}
      <section ref={awardsRef} className="bg-gray-50 dark:bg-gray-800 py-16 rounded-3xl">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isAwardsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
            >
              Penghargaan
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isAwardsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
            >
              Pengakuan atas dedikasi dan kualitas karya kami
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {awards.map((award, index) => (
              <motion.div
                key={award.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isAwardsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                className="bg-white dark:bg-gray-700 rounded-lg overflow-hidden shadow-md"
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={award.image} 
                    alt={award.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <Award className="w-6 h-6 text-yellow-500 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {award.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    {award.organization}
                  </p>
                  
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    {award.year}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Modal for portfolio item detail */}
      {selectedItem && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedItem(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <div className="h-96 overflow-hidden">
                <img 
                  src={selectedItem.image} 
                  alt={selectedItem.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                {selectedItem.title}
              </h3>
              
              <div className="flex items-center mb-4">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  selectedItem.type === 'video' 
                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
                    : selectedItem.type === 'website'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                    : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                }`}>
                  {selectedItem.type === 'image' ? 'Fotografi' : selectedItem.type === 'video' ? 'Videografi' : 'Website'}
                </span>
                
                <span className="ml-3 text-sm text-gray-500 dark:text-gray-400 capitalize">
                  Kategori: {selectedItem.category}
                </span>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque. Duis vulputate commodo lectus, ac blandit elit tincidunt id.
              </p>
              
              {selectedItem.type === 'website' && selectedItem.url && (
                <a 
                  href={selectedItem.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Kunjungi Website
                </a>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default UserPortfolioPage
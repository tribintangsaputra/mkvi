import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Camera, Star, ArrowRight } from 'lucide-react'

const UserServiceCard = ({ service }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount)
  }

  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all h-full flex flex-col"
    >
      <div className="relative h-48 overflow-hidden">
        {service.media_url ? (
          <img 
            src={service.media_url} 
            alt={service.nama_layanan}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 flex items-center justify-center">
            <Camera className="w-12 h-12 text-primary-600 dark:text-primary-400" />
          </div>
        )}
        {service.unggulan && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
            <Star className="w-3 h-3 mr-1 fill-current" />
            Unggulan
          </div>
        )}
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          {service.nama_layanan}
        </h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2 flex-1">
          {service.deskripsi || 'Layanan fotografi profesional untuk kebutuhan Anda'}
        </p>
        
        <div className="flex items-center justify-between mt-3">
          <span className="text-primary-600 dark:text-primary-400 font-medium">
            Mulai dari {formatCurrency(service.harga_minimal)}
          </span>
          
          <Link 
            to={`/pengguna/layanan/${service.slug}`}
            className="text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 px-3 py-1 rounded-md transition-colors flex items-center"
          >
            Detail
            <ArrowRight className="w-3 h-3 ml-1" />
          </Link>
        </div>
      </div>
      
      {/* Glare effect on hover */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-tr from-transparent via-white/10 to-transparent"></div>
    </motion.div>
  )
}

export default UserServiceCard
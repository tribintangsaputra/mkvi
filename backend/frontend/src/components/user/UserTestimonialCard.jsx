import React from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const UserTestimonialCard = ({ testimonial }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all relative"
    >
      {/* Quote mark */}
      <div className="absolute top-4 right-4 text-6xl text-primary-100 dark:text-primary-900 font-serif">
        "
      </div>
      
      {/* Content */}
      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-400 relative z-10">
          "{testimonial.content}"
        </p>
      </div>
      
      {/* Rating */}
      <div className="flex mb-4">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-4 h-4 ${
              i < testimonial.rating 
                ? 'text-yellow-500 fill-current' 
                : 'text-gray-300 dark:text-gray-600'
            }`} 
          />
        ))}
      </div>
      
      {/* Author */}
      <div className="flex items-center">
        <img 
          src={testimonial.image} 
          alt={testimonial.name}
          className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-primary-100 dark:border-primary-900"
        />
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white">
            {testimonial.name}
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {testimonial.role}
          </p>
        </div>
      </div>
      
      {/* Glare effect on hover */}
      <motion.div 
        className="absolute inset-0 pointer-events-none opacity-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent rounded-lg"
        whileHover={{ opacity: 1 }}
      />
    </motion.div>
  )
}

export default UserTestimonialCard
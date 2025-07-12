import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const UserGooeyNavigation = ({ items, className = '' }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  
  return (
    <div className={`relative ${className}`}>
      {/* SVG Filter for Gooey Effect */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter id="gooey">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
            result="gooey"
          />
        </filter>
      </svg>
      
      {/* Navigation */}
      <div 
        className="flex justify-center items-center bg-primary-100 dark:bg-primary-900/30 rounded-full p-1"
        style={{ filter: 'url(#gooey)' }}
      >
        {items.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            onClick={() => setActiveIndex(index)}
            className="relative z-10"
          >
            <div className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 relative z-10">
              {item.label}
            </div>
            
            {activeIndex === index && (
              <motion.div
                layoutId="gooey-background"
                className="absolute inset-0 bg-white dark:bg-gray-800 rounded-full shadow-md z-0"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default UserGooeyNavigation
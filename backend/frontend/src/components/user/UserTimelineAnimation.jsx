import React from 'react'
import { motion } from 'framer-motion'

const UserTimelineAnimation = ({ items }) => {
  return (
    <div className="relative">
      {/* Vertical line */}
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: '100%' }}
        transition={{ duration: 1.5 }}
        className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-primary-200 dark:bg-primary-800"
      />
      
      {/* Timeline items */}
      <div className="space-y-12">
        {items.map((item, index) => (
          <motion.div
            key={item.year}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
            className={`flex items-center ${
              index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
            }`}
          >
            {/* Content */}
            <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
              <motion.h3
                initial={{ opacity: 0, x: index % 2 === 0 ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                className="text-xl font-bold text-gray-900 dark:text-white mb-2"
              >
                {item.title}
              </motion.h3>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                className="text-primary-600 dark:text-primary-400 font-semibold mb-2"
              >
                {item.year}
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                className="text-gray-600 dark:text-gray-400"
              >
                {item.description}
              </motion.p>
            </div>
            
            {/* Center icon */}
            <div className="w-2/12 flex justify-center">
              <motion.div
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.5, type: 'spring' }}
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
  )
}

export default UserTimelineAnimation
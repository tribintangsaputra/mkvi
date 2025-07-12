import React from 'react'
import { motion } from 'framer-motion'

const UserLoading = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center z-50">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.2, 1],
                opacity: [1, 0.8, 1]
              }}
              transition={{ 
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 1, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: 1, repeat: Infinity, ease: "easeInOut" }
              }}
              className="text-4xl font-bold text-primary-600"
            >
              M
            </motion.div>
          </div>
          
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-4xl font-bold text-white mb-2"
          >
            MKVI
          </motion.h1>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-primary-100 text-lg"
          >
            Myer Kreatif Vision Vibe
          </motion.p>
        </motion.div>

        {/* Animated dots */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.7, duration: 0.3 }}
          className="flex justify-center space-x-2"
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-3 h-3 bg-white rounded-full"
            />
          ))}
        </motion.div>
        
        {/* Text trail effect */}
        <motion.div 
          className="mt-8 text-white text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <span className="inline-block">
            {Array.from("Memuat pengalaman visual terbaik...").map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 + index * 0.05 }}
                className="inline-block"
              >
                {char}
              </motion.span>
            ))}
          </span>
        </motion.div>
      </div>
    </div>
  )
}

export default UserLoading
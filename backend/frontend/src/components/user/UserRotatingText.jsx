import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const UserRotatingText = ({ texts, interval = 3000, className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length)
    }, interval)
    
    return () => clearInterval(timer)
  }, [texts, interval])
  
  return (
    <div className={`relative h-8 ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          {texts[currentIndex]}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default UserRotatingText
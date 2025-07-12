import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const UserCardSwap = ({ cards, className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(1) // 1 for right, -1 for left
  
  const nextCard = () => {
    setDirection(1)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length)
  }
  
  const prevCard = () => {
    setDirection(-1)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length)
  }
  
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.8
    })
  }

  return (
    <div className={`relative ${className}`}>
      <div className="relative overflow-hidden rounded-lg">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-full"
          >
            {cards[currentIndex]}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Navigation buttons */}
      <div className="absolute inset-0 flex items-center justify-between pointer-events-none">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={prevCard}
          className="ml-2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 text-gray-800 dark:text-gray-200 shadow-md pointer-events-auto"
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={nextCard}
          className="mr-2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 text-gray-800 dark:text-gray-200 shadow-md pointer-events-auto"
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>
      
      {/* Indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {cards.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1)
              setCurrentIndex(index)
            }}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex
                ? 'bg-white'
                : 'bg-white/50 hover:bg-white/80'
            } transition-colors pointer-events-auto`}
          />
        ))}
      </div>
    </div>
  )
}

export default UserCardSwap
import React from 'react'
import { motion } from 'framer-motion'

const UserStarBorder = ({ children, className = '', starCount = 8, starSize = 10, starColor = '#3B82F6' }) => {
  // Generate positions for stars around the border
  const generateStarPositions = () => {
    const positions = []
    
    // Top edge
    for (let i = 0; i < starCount / 4; i++) {
      positions.push({
        top: -starSize / 2,
        left: `${(i / (starCount / 4)) * 100}%`,
        delay: i * 0.1
      })
    }
    
    // Right edge
    for (let i = 0; i < starCount / 4; i++) {
      positions.push({
        top: `${(i / (starCount / 4)) * 100}%`,
        right: -starSize / 2,
        delay: (starCount / 4 + i) * 0.1
      })
    }
    
    // Bottom edge
    for (let i = 0; i < starCount / 4; i++) {
      positions.push({
        bottom: -starSize / 2,
        right: `${(i / (starCount / 4)) * 100}%`,
        delay: (starCount / 2 + i) * 0.1
      })
    }
    
    // Left edge
    for (let i = 0; i < starCount / 4; i++) {
      positions.push({
        bottom: `${(i / (starCount / 4)) * 100}%`,
        left: -starSize / 2,
        delay: (3 * starCount / 4 + i) * 0.1
      })
    }
    
    return positions
  }
  
  const starPositions = generateStarPositions()
  
  return (
    <div className={`relative ${className}`}>
      {/* Stars */}
      {starPositions.map((pos, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{
            top: pos.top,
            left: pos.left,
            right: pos.right,
            bottom: pos.bottom,
            width: starSize,
            height: starSize
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 1, 0], 
            scale: [0, 1, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 3,
            delay: pos.delay,
            repeat: Infinity,
            repeatDelay: 2
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
              fill={starColor} 
            />
          </svg>
        </motion.div>
      ))}
      
      {/* Content */}
      {children}
    </div>
  )
}

export default UserStarBorder
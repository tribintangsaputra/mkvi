import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'

const UserGlareCard = ({ children, className = '', glareColor = 'rgba(255, 255, 255, 0.4)', glareSize = 150 }) => {
  const [glarePosition, setGlarePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const cardRef = useRef(null)
  
  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    setGlarePosition({ x, y })
  }
  
  const handleMouseEnter = () => {
    setIsHovering(true)
  }
  
  const handleMouseLeave = () => {
    setIsHovering(false)
  }

  return (
    <motion.div
      ref={cardRef}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
    >
      {/* Glare effect */}
      {isHovering && (
        <div
          className="absolute pointer-events-none"
          style={{
            left: `${glarePosition.x - glareSize / 2}px`,
            top: `${glarePosition.y - glareSize / 2}px`,
            width: `${glareSize}px`,
            height: `${glareSize}px`,
            background: `radial-gradient(circle, ${glareColor} 0%, rgba(255,255,255,0) 70%)`,
            borderRadius: '50%',
            opacity: 0.8,
            zIndex: 10,
            mixBlendMode: 'overlay'
          }}
        />
      )}
      
      {/* Card content */}
      {children}
    </motion.div>
  )
}

export default UserGlareCard
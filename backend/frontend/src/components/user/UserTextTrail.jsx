import React from 'react'
import { motion } from 'framer-motion'

const UserTextTrail = ({ text, tag = 'div', className = '', charClassName = '', delay = 0.03 }) => {
  // Split text into characters
  const chars = text.split('')
  
  // Create variants for animation
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: delay, delayChildren: delay * i }
    })
  }
  
  const child = {
    hidden: { 
      opacity: 0,
      y: 20,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100
      }
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100
      }
    }
  }
  
  // Render the component with the appropriate HTML tag
  const Tag = tag
  
  return (
    <Tag className={className}>
      <motion.span
        variants={container}
        initial="hidden"
        animate="visible"
        className="inline-block"
      >
        {chars.map((char, index) => (
          <motion.span
            key={index}
            variants={child}
            className={`inline-block ${charClassName}`}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  )
}

export default UserTextTrail
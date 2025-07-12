import React from 'react'
import { motion } from 'framer-motion'

const UserSplitText = ({ text, tag = 'div', className = '', charClassName = '', wordClassName = '', type = 'chars', delay = 0.03 }) => {
  // Split text into words and characters
  const words = text.split(' ')
  
  // Create variants for animation
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: delay, delayChildren: delay * i }
    })
  }
  
  const child = {
    hidden: { opacity: 0, y: 20, rotateX: -20 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100
      }
    }
  }
  
  // Render based on type (chars or words)
  const renderContent = () => {
    if (type === 'words') {
      return words.map((word, index) => (
        <motion.span
          key={index}
          className={`inline-block ${wordClassName}`}
          variants={child}
        >
          {word}{' '}
        </motion.span>
      ))
    } else {
      return words.map((word, index) => (
        <span key={index} className="inline-block">
          {word.split('').map((char, charIndex) => (
            <motion.span
              key={`${index}-${charIndex}`}
              className={`inline-block ${charClassName}`}
              variants={child}
            >
              {char}
            </motion.span>
          ))}
          {index !== words.length - 1 && <span>&nbsp;</span>}
        </span>
      ))
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
        {renderContent()}
      </motion.span>
    </Tag>
  )
}

export default UserSplitText
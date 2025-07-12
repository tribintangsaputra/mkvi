import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const UserScrollReveal = ({ children, delay = 0, direction = 'up', duration = 0.5, className = '' }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px 0px' })
  
  // Set initial animation values based on direction
  const getInitialValues = () => {
    switch (direction) {
      case 'up':
        return { opacity: 0, y: 50 }
      case 'down':
        return { opacity: 0, y: -50 }
      case 'left':
        return { opacity: 0, x: 50 }
      case 'right':
        return { opacity: 0, x: -50 }
      case 'scale':
        return { opacity: 0, scale: 0.8 }
      default:
        return { opacity: 0, y: 50 }
    }
  }
  
  // Set animate values based on direction
  const getAnimateValues = () => {
    switch (direction) {
      case 'up':
      case 'down':
        return { opacity: 1, y: 0 }
      case 'left':
      case 'right':
        return { opacity: 1, x: 0 }
      case 'scale':
        return { opacity: 1, scale: 1 }
      default:
        return { opacity: 1, y: 0 }
    }
  }

  return (
    <div ref={ref} className={className}>
      <motion.div
        initial={getInitialValues()}
        animate={isInView ? getAnimateValues() : getInitialValues()}
        transition={{ duration, delay }}
      >
        {children}
      </motion.div>
    </div>
  )
}

export default UserScrollReveal
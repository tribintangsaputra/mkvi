import React, { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const UserBlurText = ({ text, tag = 'div', className = '', blurAmount = 10, duration = 1.5, delay = 0 }) => {
  const [isBlurred, setIsBlurred] = useState(true)
  const textRef = useRef(null)
  const isInView = useInView(textRef, { once: true, margin: '-100px 0px' })
  
  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setIsBlurred(false)
      }, delay * 1000)
      
      return () => clearTimeout(timer)
    }
  }, [isInView, delay])
  
  const Tag = tag
  
  return (
    <Tag ref={textRef} className={className}>
      <motion.span
        initial={{ filter: `blur(${blurAmount}px)` }}
        animate={{ filter: isBlurred ? `blur(${blurAmount}px)` : 'blur(0px)' }}
        transition={{ duration }}
      >
        {text}
      </motion.span>
    </Tag>
  )
}

export default UserBlurText
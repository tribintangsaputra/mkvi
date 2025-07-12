import React, { useState, useEffect, useRef } from 'react'
import { useInView } from 'framer-motion'

const UserAnimatedCounter = ({ end, duration = 2000, prefix = '', suffix = '' }) => {
  const [count, setCount] = useState(0)
  const countRef = useRef(null)
  const isInView = useInView(countRef, { once: true })
  
  useEffect(() => {
    let startTime
    let animationFrame
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = timestamp - startTime
      
      // Calculate the current count based on progress
      const percentage = Math.min(progress / duration, 1)
      const currentCount = Math.floor(end * percentage)
      
      setCount(currentCount)
      
      // Continue animation until duration is reached
      if (progress < duration) {
        animationFrame = requestAnimationFrame(animate)
      }
    }
    
    if (isInView) {
      animationFrame = requestAnimationFrame(animate)
    }
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [end, duration, isInView])

  return (
    <span ref={countRef} className="inline-block">
      {prefix}{count}{suffix}
    </span>
  )
}

export default UserAnimatedCounter
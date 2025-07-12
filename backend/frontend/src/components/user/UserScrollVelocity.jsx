import React, { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'

const UserScrollVelocity = ({ children, className = '', maxVelocity = 2000 }) => {
  const ref = useRef(null)
  const [elementTop, setElementTop] = useState(0)
  const [clientHeight, setClientHeight] = useState(0)
  
  const { scrollY } = useScroll()
  
  // Track scroll velocity
  const scrollVelocity = useSpring(0, { stiffness: 500, damping: 100 })
  
  useEffect(() => {
    const unsubscribeY = scrollY.onChange((latest) => {
      const previousY = scrollY.getPrevious()
      const diff = latest - previousY
      
      // Calculate velocity (capped at maxVelocity)
      const cappedVelocity = Math.min(Math.abs(diff * 50), maxVelocity) * Math.sign(diff)
      scrollVelocity.set(cappedVelocity)
    })
    
    return () => {
      unsubscribeY()
    }
  }, [scrollY, scrollVelocity, maxVelocity])
  
  // Get element position
  useEffect(() => {
    const element = ref.current
    if (!element) return
    
    const updatePosition = () => {
      const rect = element.getBoundingClientRect()
      setElementTop(rect.top + window.scrollY)
      setClientHeight(window.innerHeight)
    }
    
    updatePosition()
    window.addEventListener('resize', updatePosition)
    
    return () => {
      window.removeEventListener('resize', updatePosition)
    }
  }, [])
  
  // Calculate progress based on scroll position
  const yRange = useTransform(
    scrollY,
    [elementTop - clientHeight, elementTop + clientHeight],
    [0, 1]
  )
  
  // Apply transformations based on velocity
  const rotateX = useTransform(scrollVelocity, [-maxVelocity, 0, maxVelocity], [10, 0, -10])
  const rotateY = useTransform(scrollVelocity, [-maxVelocity, 0, maxVelocity], [-10, 0, 10])
  const scale = useTransform(yRange, [0, 0.5, 1], [0.8, 1.1, 0.8])
  const opacity = useTransform(yRange, [0, 0.5, 1], [0.3, 1, 0.3])

  return (
    <div ref={ref} className={className}>
      <motion.div
        style={{
          rotateX,
          rotateY,
          scale,
          opacity
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}

export default UserScrollVelocity
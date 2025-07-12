import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, ExternalLink, Image as ImageIcon, Video } from 'lucide-react'

const UserMasonryGallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(null)
  
  const openLightbox = (image) => {
    setSelectedImage(image)
  }
  
  const closeLightbox = () => {
    setSelectedImage(null)
  }
  
  // Calculate column spans for masonry layout
  const getColumnSpan = (index) => {
    // Create a pattern of column spans
    const pattern = [
      'col-span-1', // small
      'col-span-2', // wide
      'col-span-1', // small
      'col-span-1', // small
      'col-span-1', // small
      'col-span-2', // wide
    ]
    return pattern[index % pattern.length]
  }
  
  // Calculate row spans for masonry layout
  const getRowSpan = (index) => {
    // Create a pattern of row spans
    const pattern = [
      'row-span-1', // normal
      'row-span-1', // normal
      'row-span-2', // tall
      'row-span-1', // normal
      'row-span-2', // tall
      'row-span-1', // normal
    ]
    return pattern[index % pattern.length]
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className={`${getColumnSpan(index)} ${getRowSpan(index)} overflow-hidden rounded-lg cursor-pointer group`}
            onClick={() => openLightbox(image)}
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative h-full">
              <img 
                src={image.src} 
                alt={image.title || `Gallery image ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-end">
                <div className="p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="font-medium">{image.title}</h3>
                  {image.category && (
                    <p className="text-sm text-gray-200">{image.category}</p>
                  )}
                </div>
              </div>
              
              {/* Type indicator */}
              {image.type && (
                <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full">
                  {image.type === 'video' ? (
                    <Video className="w-4 h-4" />
                  ) : (
                    <ImageIcon className="w-4 h-4" />
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={closeLightbox}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              {/* Image */}
              <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                <div className="relative">
                  {selectedImage.type === 'video' ? (
                    <video 
                      src={selectedImage.src} 
                      controls
                      className="w-full max-h-[70vh] object-contain"
                    />
                  ) : (
                    <img 
                      src={selectedImage.src} 
                      alt={selectedImage.title} 
                      className="w-full max-h-[70vh] object-contain"
                    />
                  )}
                </div>
                
                {/* Caption */}
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {selectedImage.title}
                      </h3>
                      {selectedImage.category && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {selectedImage.category}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      {selectedImage.downloadUrl && (
                        <a 
                          href={selectedImage.downloadUrl}
                          download
                          className="p-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                          title="Download"
                        >
                          <Download className="w-5 h-5" />
                        </a>
                      )}
                      
                      {selectedImage.externalUrl && (
                        <a 
                          href={selectedImage.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors"
                          title="Visit"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                  
                  {selectedImage.description && (
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      {selectedImage.description}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default UserMasonryGallery
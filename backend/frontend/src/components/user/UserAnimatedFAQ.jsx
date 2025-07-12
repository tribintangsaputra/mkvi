import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'

const UserAnimatedFAQ = ({ faqItems }) => {
  const [expandedFaq, setExpandedFaq] = useState(null)
  
  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id)
  }

  return (
    <div className="space-y-4">
      {faqItems.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index, duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
        >
          <button
            onClick={() => toggleFaq(item.id)}
            className="w-full flex items-center justify-between p-4 text-left focus:outline-none"
          >
            <span className="text-lg font-medium text-gray-900 dark:text-white">
              {item.question}
            </span>
            {expandedFaq === item.id ? (
              <ChevronUp className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            )}
          </button>
          
          <AnimatePresence>
            {expandedFaq === item.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4">
                  <p className="text-gray-600 dark:text-gray-400">
                    {item.answer}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  )
}

export default UserAnimatedFAQ
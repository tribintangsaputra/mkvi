import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Clock, XCircle } from 'lucide-react'

const UserOrderTracker = ({ status, createdAt, validatedAt, cancelledAt }) => {
  const steps = [
    { 
      id: 'created', 
      label: 'Pemesanan Dibuat', 
      date: createdAt,
      completed: true,
      icon: CheckCircle
    },
    { 
      id: 'validated', 
      label: 'Tervalidasi Admin', 
      date: validatedAt,
      completed: status === 'tervalidasi',
      current: status === 'menunggu_validasi_admin',
      icon: status === 'tervalidasi' ? CheckCircle : Clock
    },
    { 
      id: 'cancelled', 
      label: 'Dibatalkan', 
      date: cancelledAt,
      completed: status === 'dibatalkan',
      icon: XCircle,
      error: status === 'dibatalkan'
    }
  ]

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="py-6">
      <div className="flex items-center">
        {steps.map((step, i) => (
          <React.Fragment key={step.id}>
            {/* Step */}
            <div className="relative flex flex-col items-center flex-1">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.2 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step.error ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                  step.completed ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                  step.current ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 
                  'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
                }`}
              >
                <step.icon className="w-5 h-5" />
              </motion.div>
              
              <div className="mt-2 text-center">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {step.label}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {formatDate(step.date)}
                </div>
              </div>
            </div>
            
            {/* Connector */}
            {i < steps.length - 1 && (
              <motion.div 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: i * 0.2 + 0.1, duration: 0.5 }}
                className={`flex-1 h-0.5 mx-2 origin-left ${
                  steps[i].completed && steps[i+1].completed ? 'bg-green-500 dark:bg-green-600' :
                  steps[i].completed && steps[i+1].current ? 'bg-blue-500 dark:bg-blue-600' :
                  steps[i].completed && steps[i+1].error ? 'bg-red-500 dark:bg-red-600' : 
                  'bg-gray-300 dark:bg-gray-700'
                }`} 
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

export default UserOrderTracker
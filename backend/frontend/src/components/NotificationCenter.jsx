import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bell, 
  X, 
  Check, 
  CheckCheck,
  Trash2,
  Filter,
  MoreVertical
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { notificationService } from '../services/api'
import toast from 'react-hot-toast'

const NotificationCenter = ({ isOpen, onClose }) => {
  const [filter, setFilter] = useState('all') // all, unread, read
  const queryClient = useQueryClient()

  // Fetch notifications
  const { data: notifications, isLoading } = useQuery(
    ['notifications', { filter }],
    () => notificationService.getAll({ filter }),
    {
      enabled: isOpen,
      select: (data) => data.data.data
    }
  )

  // Fetch unread count
  const { data: unreadCount } = useQuery(
    'notifications-unread-count',
    () => notificationService.getUnreadCount(),
    {
      refetchInterval: 30000, // Refresh every 30 seconds
      select: (data) => data.data.data.count
    }
  )

  // Mark as read mutation
  const markAsReadMutation = useMutation(notificationService.markAsRead, {
    onSuccess: () => {
      queryClient.invalidateQueries('notifications')
      queryClient.invalidateQueries('notifications-unread-count')
    }
  })

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation(notificationService.markAllAsRead, {
    onSuccess: () => {
      queryClient.invalidateQueries('notifications')
      queryClient.invalidateQueries('notifications-unread-count')
      toast.success('Semua notifikasi ditandai sudah dibaca')
    }
  })

  // Delete notification mutation
  const deleteMutation = useMutation(notificationService.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries('notifications')
      queryClient.invalidateQueries('notifications-unread-count')
      toast.success('Notifikasi dihapus')
    }
  })

  const handleMarkAsRead = (id) => {
    markAsReadMutation.mutate(id)
  }

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate()
  }

  const handleDelete = (id) => {
    deleteMutation.mutate(id)
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order':
        return '📋'
      case 'payment':
        return '💳'
      case 'meeting':
        return '📅'
      case 'system':
        return '⚙️'
      default:
        return '📢'
    }
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date
    
    if (diff < 60000) return 'Baru saja'
    if (diff < 3600000) return `${Math.floor(diff / 60000)} menit lalu`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} jam lalu`
    return `${Math.floor(diff / 86400000)} hari lalu`
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />

          {/* Notification Panel */}
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-800 shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Notifikasi
                </h2>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {unreadCount}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filters */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  {['all', 'unread', 'read'].map((filterType) => (
                    <button
                      key={filterType}
                      onClick={() => setFilter(filterType)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        filter === filterType
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
                      }`}
                    >
                      {filterType === 'all' ? 'Semua' : 
                       filterType === 'unread' ? 'Belum Dibaca' : 'Sudah Dibaca'}
                    </button>
                  ))}
                </div>
                
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    disabled={markAllAsReadMutation.isLoading}
                    className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                  >
                    <CheckCheck className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="flex space-x-3">
                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : notifications?.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                  <Bell className="w-12 h-12 mb-4" />
                  <p className="text-center">
                    {filter === 'unread' ? 'Tidak ada notifikasi yang belum dibaca' :
                     filter === 'read' ? 'Tidak ada notifikasi yang sudah dibaca' :
                     'Tidak ada notifikasi'}
                  </p>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {notifications?.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3 rounded-lg border transition-colors ${
                        notification.read
                          ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                          : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className={`text-sm font-medium ${
                                notification.read 
                                  ? 'text-gray-900 dark:text-gray-300' 
                                  : 'text-gray-900 dark:text-white'
                              }`}>
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                {formatTime(notification.created_at)}
                              </p>
                            </div>
                            
                            <div className="flex items-center space-x-1 ml-2">
                              {!notification.read && (
                                <button
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                  title="Tandai sudah dibaca"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(notification.id)}
                                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                title="Hapus notifikasi"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <button className="w-full text-center text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium">
                Lihat Semua Notifikasi
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default NotificationCenter
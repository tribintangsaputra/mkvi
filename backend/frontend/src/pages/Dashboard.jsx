import React from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Camera, 
  ShoppingCart, 
  Calendar,
  CreditCard,
  TrendingUp,
  Activity,
  DollarSign,
  BarChart3,
  FileText
} from 'lucide-react'
import { useQuery } from 'react-query'
import { api } from '../services/api'
import AnalyticsDashboard from '../components/AnalyticsDashboard'

const StatCard = ({ title, value, icon: Icon, color, change, loading }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="card"
  >
    <div className="card-content">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          {loading ? (
            <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse text-2xl font-bold" />
          ) : (
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {value}
            </p>
          )}
          {change && (
            <p className={`text-xs ${change > 0 ? 'text-green-600' : 'text-red-600'} flex items-center mt-1`}>
              <TrendingUp className="w-3 h-3 mr-1" />
              {change > 0 ? '+' : ''}{change}%
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  </motion.div>
)

const Dashboard = () => {
  const [activeTab, setActiveTab] = React.useState('overview')

  // Fetch dashboard stats
  const { data: penggunaStats, isLoading: loadingPengguna } = useQuery(
    'dashboard-pengguna',
    () => api.get('/pengguna?limit=1'),
    { 
      select: (data) => data.data.data.pagination?.total_items || 0,
      refetchInterval: 30000 
    }
  )

  const { data: layananStats, isLoading: loadingLayanan } = useQuery(
    'dashboard-layanan',
    () => api.get('/layanan?limit=1'),
    { 
      select: (data) => data.data.data.pagination?.total_items || 0,
      refetchInterval: 30000 
    }
  )

  const { data: pemesananStats, isLoading: loadingPemesanan } = useQuery(
    'dashboard-pemesanan',
    () => api.get('/pemesanan?limit=1'),
    { 
      select: (data) => data.data.data.pagination?.total_items || 0,
      refetchInterval: 30000 
    }
  )

  const { data: meetingStats, isLoading: loadingMeeting } = useQuery(
    'dashboard-meeting',
    () => api.get('/meeting?limit=1'),
    { 
      select: (data) => data.data.data.pagination?.total_items || 0,
      refetchInterval: 30000 
    }
  )

  const stats = [
    {
      title: 'Total Pengguna',
      value: penggunaStats || 0,
      icon: Users,
      color: 'bg-blue-500',
      change: 12,
      loading: loadingPengguna
    },
    {
      title: 'Total Layanan',
      value: layananStats || 0,
      icon: Camera,
      color: 'bg-green-500',
      change: 8,
      loading: loadingLayanan
    },
    {
      title: 'Total Pemesanan',
      value: pemesananStats || 0,
      icon: ShoppingCart,
      color: 'bg-yellow-500',
      change: 15,
      loading: loadingPemesanan
    },
    {
      title: 'Total Meeting',
      value: meetingStats || 0,
      icon: Calendar,
      color: 'bg-purple-500',
      change: 5,
      loading: loadingMeeting
    }
  ]

  return (
    <div className="space-y-6">
      {/* Rest of the content */}
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Selamat datang di panel administrasi MKVI
          </p>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-right"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date().toLocaleDateString('id-ID', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </motion.div>
      </motion.div>
      
      {/* Dashboard Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="card-content">
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Tab Content */}
      {activeTab === 'overview' ? (
        <>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card"
      >
        <div className="card-header">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Aksi Cepat
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Akses fitur utama dengan cepat
          </p>
        </div>
        <div className="card-content">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Tambah Layanan', icon: Camera, href: '/layanan', color: 'bg-green-500' },
              { name: 'Kelola Pemesanan', icon: ShoppingCart, href: '/pemesanan', color: 'bg-blue-500' },
              { name: 'Jadwal Meeting', icon: Calendar, href: '/meeting', color: 'bg-purple-500' },
              { name: 'Kelola Pembayaran', icon: CreditCard, href: '/pembayaran', color: 'bg-yellow-500' }
            ].map((action, index) => (
              <motion.a
                key={action.name}
                href={action.href}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
              >
                <div className={`p-2 rounded-lg ${action.color} mr-3`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
                  {action.name}
                </span>
              </motion.a>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card"
      >
        <div className="card-header">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Aktivitas Terbaru
          </h2>
        </div>
        <div className="card-content">
          <div className="space-y-4">
            {[
              { action: 'Pemesanan baru', detail: 'ORDER-123 - Prewedding Package', time: '2 menit lalu', type: 'order' },
              { action: 'Pembayaran diterima', detail: 'DP untuk ORDER-122', time: '15 menit lalu', type: 'payment' },
              { action: 'Meeting dijadwalkan', detail: 'Client consultation', time: '1 jam lalu', type: 'meeting' },
              { action: 'Layanan baru ditambahkan', detail: 'Corporate Event Package', time: '2 jam lalu', type: 'service' }
            ].map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
              >
                <div className={`p-2 rounded-full mr-3 ${
                  activity.type === 'order' ? 'bg-blue-100 text-blue-600' :
                  activity.type === 'payment' ? 'bg-green-100 text-green-600' :
                  activity.type === 'meeting' ? 'bg-purple-100 text-purple-600' :
                  'bg-yellow-100 text-yellow-600'
                }`}>
                  {activity.type === 'order' && <ShoppingCart className="w-4 h-4" />}
                  {activity.type === 'payment' && <DollarSign className="w-4 h-4" />}
                  {activity.type === 'meeting' && <Calendar className="w-4 h-4" />}
                  {activity.type === 'service' && <Camera className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {activity.action}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {activity.detail}
                  </p>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {activity.time}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
        </>
      ) : (
        <AnalyticsDashboard />
      )}
    </div>
  )
}

export default Dashboard
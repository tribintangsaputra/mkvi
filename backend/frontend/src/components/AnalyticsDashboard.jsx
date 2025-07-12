import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users,
  ShoppingCart,
  DollarSign,
  Calendar,
  Eye,
  Download
} from 'lucide-react'
import { useQuery } from 'react-query'
import { analyticsService } from '../services/api'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'

const AnalyticsDashboard = () => {
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  })

  // Fetch analytics data
  const { data: dashboardStats, isLoading: loadingDashboard } = useQuery(
    'dashboard-stats',
    () => analyticsService.getDashboardStats(),
    {
      select: (data) => data.data.data
    }
  )

  const { data: orderStats, isLoading: loadingOrders } = useQuery(
    ['order-stats', dateRange],
    () => analyticsService.getOrderStats(dateRange),
    {
      select: (data) => data.data.data
    }
  )

  const { data: paymentStats, isLoading: loadingPayments } = useQuery(
    ['payment-stats', dateRange],
    () => analyticsService.getPaymentStats(dateRange),
    {
      select: (data) => data.data.data
    }
  )

  const { data: revenueStats, isLoading: loadingRevenue } = useQuery(
    ['revenue-stats', dateRange],
    () => analyticsService.getRevenueStats(dateRange),
    {
      select: (data) => data.data.data
    }
  )

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount)
  }

  const StatCard = ({ title, value, change, icon: Icon, color, loading }) => (
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
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {loading ? (
                <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              ) : (
                value
              )}
            </p>
            {change && (
              <p className={`text-xs flex items-center mt-1 ${
                change > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {change > 0 ? (
                  <TrendingUp className="w-3 h-3 mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1" />
                )}
                {Math.abs(change)}% dari bulan lalu
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

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Analytics & Reports
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Analisis performa bisnis dan laporan detail
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="input text-sm"
            />
            <span className="text-gray-500">-</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="input text-sm"
            />
          </div>
          <button className="btn btn-primary btn-sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Pengguna"
          value={dashboardStats?.totalUsers || 0}
          change={dashboardStats?.userGrowth}
          icon={Users}
          color="bg-blue-500"
          loading={loadingDashboard}
        />
        <StatCard
          title="Total Pemesanan"
          value={dashboardStats?.totalOrders || 0}
          change={dashboardStats?.orderGrowth}
          icon={ShoppingCart}
          color="bg-green-500"
          loading={loadingDashboard}
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(dashboardStats?.totalRevenue || 0)}
          change={dashboardStats?.revenueGrowth}
          icon={DollarSign}
          color="bg-yellow-500"
          loading={loadingDashboard}
        />
        <StatCard
          title="Meeting Selesai"
          value={dashboardStats?.completedMeetings || 0}
          change={dashboardStats?.meetingGrowth}
          icon={Calendar}
          color="bg-purple-500"
          loading={loadingDashboard}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Trend Pemesanan
            </h3>
          </div>
          <div className="card-content">
            {loadingOrders ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={orderStats?.trends || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="orders" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Revenue Bulanan
            </h3>
          </div>
          <div className="card-content">
            {loadingRevenue ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueStats?.monthly || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Bar dataKey="revenue" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* Payment Status Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Status Pembayaran
            </h3>
          </div>
          <div className="card-content">
            {loadingPayments ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={paymentStats?.statusDistribution || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {(paymentStats?.statusDistribution || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* Service Popularity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Layanan Populer
            </h3>
          </div>
          <div className="card-content">
            {loadingOrders ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={orderStats?.servicePopularity || []} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="service" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#F59E0B" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Customers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Top Customers
            </h3>
          </div>
          <div className="card-content">
            <div className="space-y-3">
              {(dashboardStats?.topCustomers || []).map((customer, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {customer.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {customer.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {customer.orders} pemesanan
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(customer.totalSpent)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Aktivitas Terbaru
            </h3>
          </div>
          <div className="card-content">
            <div className="space-y-3">
              {(dashboardStats?.recentActivities || []).map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'order' ? 'bg-blue-100 text-blue-600' :
                    activity.type === 'payment' ? 'bg-green-100 text-green-600' :
                    activity.type === 'meeting' ? 'bg-purple-100 text-purple-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {activity.type === 'order' && <ShoppingCart className="w-4 h-4" />}
                    {activity.type === 'payment' && <DollarSign className="w-4 h-4" />}
                    {activity.type === 'meeting' && <Calendar className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AnalyticsDashboard
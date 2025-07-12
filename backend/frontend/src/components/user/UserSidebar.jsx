import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, 
  Camera, 
  Image, 
  HelpCircle, 
  History,
  ShoppingCart,
  Calendar,
  CreditCard,
  User,
  LogOut,
  X
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const UserSidebar = ({ isOpen, onClose }) => {
  const location = useLocation()
  const { isAuthenticated, logout } = useAuth()

  // Navigation links
  const navLinks = [
    { name: 'Beranda', path: '/pengguna', icon: Home },
    { name: 'Layanan', path: '/pengguna/layanan', icon: Camera },
    { name: 'Portfolio', path: '/pengguna/portfolio', icon: Image },
    { name: 'Sejarah', path: '/pengguna/sejarah', icon: History },
    { name: 'Bantuan', path: '/pengguna/bantuan', icon: HelpCircle },
  ]

  // User account links (only shown when authenticated)
  const accountLinks = [
    { name: 'Pemesanan Saya', path: '/pengguna/pemesanan', icon: ShoppingCart },
    { name: 'Meeting', path: '/pengguna/meeting', icon: Calendar },
    { name: 'Pembayaran', path: '/pengguna/pembayaran', icon: CreditCard },
    { name: 'Profil', path: '/pengguna/profil', icon: User },
  ]

  const sidebarVariants = {
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
        variants={sidebarVariants}
        className="fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 shadow-lg overflow-y-auto lg:hidden"
      >
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Link to="/pengguna" className="flex items-center space-x-3" onClick={onClose}>
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">MKVI</h2>
                <p className="text-xs text-gray-600 dark:text-gray-400">Myer Kreatif Vision Vibe</p>
              </div>
            </Link>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Navigation */}
          <nav className="space-y-1 mb-6">
            <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Menu Utama
            </h3>
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path || 
                (link.path !== '/pengguna' && location.pathname.startsWith(link.path))
              
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={onClose}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-primary-400'
                  }`}
                >
                  <link.icon className={`mr-3 h-5 w-5 ${
                    isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'
                  }`} />
                  {link.name}
                </Link>
              )
            })}
          </nav>

          {/* Account Navigation (only if authenticated) */}
          {isAuthenticated && (
            <nav className="space-y-1 mb-6">
              <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Akun Saya
              </h3>
              {accountLinks.map((link) => {
                const isActive = location.pathname === link.path || 
                  (link.path !== '/pengguna' && location.pathname.startsWith(link.path))
                
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={onClose}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-primary-400'
                    }`}
                  >
                    <link.icon className={`mr-3 h-5 w-5 ${
                      isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'
                    }`} />
                    {link.name}
                  </Link>
                )
              })}

              {/* Logout Button */}
              <button
                onClick={() => {
                  logout()
                  onClose()
                }}
                className="flex items-center w-full px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Keluar
              </button>
            </nav>
          )}

          {/* Login/Register Buttons (only if not authenticated) */}
          {!isAuthenticated && (
            <div className="space-y-3 mt-6">
              <Link
                to="/pengguna/login"
                onClick={onClose}
                className="block w-full px-4 py-2 text-center text-sm font-medium text-primary-600 bg-primary-50 rounded-md hover:bg-primary-100 dark:bg-primary-900/20 dark:text-primary-400 dark:hover:bg-primary-900/30"
              >
                Masuk
              </Link>
              <Link
                to="/pengguna/register"
                onClick={onClose}
                className="block w-full px-4 py-2 text-center text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
              >
                Daftar
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default UserSidebar
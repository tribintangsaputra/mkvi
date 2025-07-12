import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from './hooks/useAuth'
import { ThemeProvider } from './contexts/ThemeContext'
import LoadingScreen from './components/LoadingScreen'
import LoginPage from './pages/LoginPage'
import DashboardLayout from './components/layout/DashboardLayout'
import Dashboard from './pages/Dashboard'
import PenggunaPage from './pages/PenggunaPage'
import LayananPage from './pages/LayananPage'
import LayananMediaPage from './pages/LayananMediaPage'
import PemesananPage from './pages/PemesananPage'
import MeetingPage from './pages/MeetingPage'
import PembayaranPage from './pages/PembayaranPage'
import RekapPage from './pages/RekapPage'
import SettingsPage from './pages/SettingsPage'
import UserLayout from './pages/user/UserLayout'
import UserHomePage from './pages/user/UserHomePage'
import UserPortfolioPage from './pages/user/UserPortfolioPage'
import UserSejarahPage from './pages/user/UserSejarahPage'
import UserBantuanPage from './pages/user/UserBantuanPage'
import UserLayananPage from './pages/user/UserLayananPage'
import UserLayananDetailPage from './pages/user/UserLayananDetailPage'
import UserLoginPage from './pages/user/UserLoginPage'
import UserRegisterPage from './pages/user/UserRegisterPage'
import UserPemesananPage from './pages/user/UserPemesananPage'
import UserPemesananBaruPage from './pages/user/UserPemesananBaruPage'
import UserMeetingPage from './pages/user/UserMeetingPage'
import UserPembayaranPage from './pages/user/UserPembayaranPage'
import UserProfilPage from './pages/user/UserProfilPage'
import UserTrackingPage from './pages/user/UserTrackingPage'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const { user, isAuthenticated, loading } = useAuth()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <LoadingScreen />
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="loading-dots">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    )
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <AnimatePresence mode="wait">
          <Routes>
            <Route 
              path="/login" 
              element={
                !isAuthenticated ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <LoginPage />
                  </motion.div>
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              } 
            />
            
            <Route 
              path="/*" 
              element={
                isAuthenticated && user?.role === 'admin' ? (
                  <DashboardLayout>
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/pengguna" element={<PenggunaPage />} />
                      <Route path="/layanan" element={<LayananPage />} />
                      <Route path="/layanan-media" element={<LayananMediaPage />} />
                      <Route path="/pemesanan" element={<PemesananPage />} />
                      <Route path="/meeting" element={<MeetingPage />} />
                      <Route path="/pembayaran" element={<PembayaranPage />} />
                      <Route path="/rekap" element={<RekapPage />} />
                      <Route path="/settings" element={<SettingsPage />} />
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </DashboardLayout>
                ) : (
                  <Navigate to="/pengguna" replace />
                )
              } 
            />
            
            {/* User Website Routes */}
            <Route path="/pengguna" element={<UserLayout />}>
              <Route index element={<UserHomePage />} />
              <Route path="portfolio" element={<UserPortfolioPage />} />
              <Route path="sejarah" element={<UserSejarahPage />} />
              <Route path="bantuan" element={<UserBantuanPage />} />
              <Route path="layanan" element={<UserLayananPage />} />
              <Route path="layanan/:slug" element={<UserLayananDetailPage />} />
              <Route path="pemesanan" element={<UserPemesananPage />} />
              <Route path="pemesanan/baru" element={<UserPemesananBaruPage />} />
              <Route path="meeting" element={<UserMeetingPage />} />
              <Route path="pembayaran/:pemesananId" element={<UserPembayaranPage />} />
              <Route path="profil" element={<UserProfilPage />} />
              <Route path="tracking" element={<UserTrackingPage />} />
            </Route>
            
            <Route path="/pengguna/login" element={<UserLoginPage />} />
            <Route path="/pengguna/register" element={<UserRegisterPage />} />
          </Routes>
        </AnimatePresence>
      </div>
    </ThemeProvider>
  )
}

export default App
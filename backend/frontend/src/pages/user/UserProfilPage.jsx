import React, { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Camera, 
  Lock, 
  Save, 
  Eye, 
  EyeOff,
  ShoppingCart,
  CreditCard,
  FileText
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { penggunaService } from '../../services/api'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'

const UserProfilPage = () => {
  const [activeTab, setActiveTab] = useState('profile')
  const [showPassword, setShowPassword] = useState(false)
  const [profileImage, setProfileImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  
  const [profileData, setProfileData] = useState({
    nama_lengkap: '',
    email: '',
    no_wa: ''
  })
  
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  })
  
  const { user, isAuthenticated } = useAuth()
  const queryClient = useQueryClient()
  
  const headerRef = useRef(null)
  const isHeaderInView = useInView(headerRef, { once: true })
  
  const contentRef = useRef(null)
  const isContentInView = useInView(contentRef, { once: true })
  
  // Fetch user data
  const { data: userData, isLoading } = useQuery(
    'user-profile',
    () => penggunaService.getById(user?.id),
    {
      enabled: isAuthenticated && !!user?.id,
      select: (data) => data.data.data,
      onSuccess: (data) => {
        setProfileData({
          nama_lengkap: data.nama_lengkap || '',
          email: data.email || '',
          no_wa: data.no_wa || ''
        })
      }
    }
  )

  // Update profile mutation
  const updateProfileMutation = useMutation(
    (data) => penggunaService.update(user?.id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('user-profile')
        toast.success('Profil berhasil diperbarui')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Gagal memperbarui profil')
      }
    }
  )

  // Change password mutation
  const changePasswordMutation = useMutation(
    (data) => penggunaService.changePassword(user?.id, data),
    {
      onSuccess: () => {
        toast.success('Password berhasil diubah')
        setPasswordData({
          current_password: '',
          new_password: '',
          confirm_password: ''
        })
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Gagal mengubah password')
      }
    }
  )

  const handleProfileSubmit = (e) => {
    e.preventDefault()
    
    const formData = new FormData()
    formData.append('nama_lengkap', profileData.nama_lengkap)
    formData.append('email', profileData.email)
    formData.append('no_wa', profileData.no_wa)
    
    if (profileImage) {
      formData.append('foto_profil', profileImage)
    }
    
    updateProfileMutation.mutate(formData)
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('Konfirmasi password tidak cocok')
      return
    }
    
    changePasswordMutation.mutate(passwordData)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfileImage(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <User className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Login untuk Melihat Profil
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-center max-w-md">
          Anda perlu login terlebih dahulu untuk melihat dan mengelola profil Anda.
        </p>
        <div className="flex space-x-4">
          <Link to="/pengguna/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors"
            >
              Login
            </motion.button>
          </Link>
          <Link to="/pengguna/register">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 px-6 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Register
            </motion.button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <section ref={headerRef}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Profil Saya
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Kelola informasi profil dan keamanan akun Anda
          </p>
        </motion.div>
      </section>
      
      {/* Content */}
      <section ref={contentRef}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isContentInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              {/* Profile Image */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : userData?.foto_profil ? (
                      <img 
                        src={`http://localhost:5000/uploads/profiles/${userData.foto_profil}`} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                        <User className="w-12 h-12 text-primary-600 dark:text-primary-400" />
                      </div>
                    )}
                  </div>
                  
                  <label className="absolute bottom-0 right-0 bg-primary-600 text-white p-1 rounded-full cursor-pointer hover:bg-primary-700 transition-colors">
                    <Camera className="w-4 h-4" />
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-4">
                  {userData?.nama_lengkap || 'Loading...'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Pengguna
                </p>
              </div>
              
              {/* Navigation */}
              <nav className="space-y-1">
                {[
                  { id: 'profile', label: 'Informasi Profil', icon: User },
                  { id: 'security', label: 'Keamanan', icon: Lock }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
              
              {/* Account Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                  Aktivitas Akun
                </h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <ShoppingCart className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Pemesanan</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">3</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CreditCard className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Pembayaran</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">2</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Dokumen</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">4</span>
                  </div>
                </div>
              </div>
              
              {/* Member Since */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Bergabung sejak {formatDate(userData?.dibuat_pada)}</span>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isContentInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Informasi Profil
                  </h2>
                  
                  {isLoading ? (
                    <div className="animate-pulse space-y-4">
                      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  ) : (
                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Nama Lengkap
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            value={profileData.nama_lengkap}
                            onChange={(e) => setProfileData({ ...profileData, nama_lengkap: e.target.value })}
                            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Nama lengkap Anda"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="email@example.com"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          No. WhatsApp
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            value={profileData.no_wa}
                            onChange={(e) => setProfileData({ ...profileData, no_wa: e.target.value })}
                            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="+628123456789"
                          />
                        </div>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          Format: +62xxxxxxxxxx
                        </p>
                      </div>
                      
                      <div className="flex justify-end">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="submit"
                          disabled={updateProfileMutation.isLoading}
                          className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center disabled:opacity-50"
                        >
                          {updateProfileMutation.isLoading ? (
                            <div className="flex items-center">
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              Menyimpan...
                            </div>
                          ) : (
                            <>
                              <Save className="w-5 h-5 mr-2" />
                              Simpan Perubahan
                            </>
                          )}
                        </motion.button>
                      </div>
                    </form>
                  )}
                </div>
              )}
              
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Keamanan
                  </h2>
                  
                  <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Password Saat Ini
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={passwordData.current_password}
                          onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                          className="w-full pl-10 pr-10 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="••••••••"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Password Baru
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={passwordData.new_password}
                          onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                          className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="••••••••"
                          required
                          minLength={6}
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Minimal 6 karakter
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Konfirmasi Password Baru
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={passwordData.confirm_password}
                          onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                          className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="••••••••"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={changePasswordMutation.isLoading}
                        className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center disabled:opacity-50"
                      >
                        {changePasswordMutation.isLoading ? (
                          <div className="flex items-center">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Menyimpan...
                          </div>
                        ) : (
                          <>
                            <Lock className="w-5 h-5 mr-2" />
                            Ubah Password
                          </>
                        )}
                      </motion.button>
                    </div>
                  </form>
                  
                  {/* Security Tips */}
                  <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-2">
                      Tips Keamanan
                    </h3>
                    <ul className="list-disc list-inside text-blue-700 dark:text-blue-400 space-y-1 text-sm">
                      <li>Gunakan password yang kuat dengan kombinasi huruf, angka, dan simbol</li>
                      <li>Jangan gunakan password yang sama dengan akun lain</li>
                      <li>Ganti password Anda secara berkala</li>
                      <li>Jangan bagikan password Anda dengan orang lain</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default UserProfilPage
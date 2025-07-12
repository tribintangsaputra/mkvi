import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  ArrowRight
} from 'lucide-react'

const UserFooter = () => {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <motion.div 
                whileHover={{ rotate: 10 }}
                className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center"
              >
                <span className="text-white font-bold text-xl">M</span>
              </motion.div>
              <div>
                <h2 className="text-xl font-bold">MKVI</h2>
                <p className="text-xs text-gray-400">Myer Kreatif Vision Vibe</p>
              </div>
            </div>
            
            <p className="text-gray-400 text-sm">
              Jasa fotografi profesional dan pembuatan website berkualitas tinggi untuk kebutuhan personal maupun bisnis Anda.
            </p>
            
            <div className="flex space-x-4">
              <motion.a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ y: -3, color: '#1877F2' }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook size={20} />
              </motion.a>
              <motion.a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ y: -3, color: '#E1306C' }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram size={20} />
              </motion.a>
              <motion.a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ y: -3, color: '#1DA1F2' }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter size={20} />
              </motion.a>
              <motion.a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ y: -3, color: '#FF0000' }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Youtube size={20} />
              </motion.a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-800 pb-2">Link Cepat</h3>
            <ul className="space-y-2">
              {[
                { name: 'Beranda', path: '/pengguna' },
                { name: 'Layanan', path: '/pengguna/layanan' },
                { name: 'Portfolio', path: '/pengguna/portfolio' },
                { name: 'Sejarah', path: '/pengguna/sejarah' },
                { name: 'Bantuan', path: '/pengguna/bantuan' }
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path}
                    className="text-gray-400 hover:text-primary-400 transition-colors flex items-center group"
                  >
                    <ArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-800 pb-2">Layanan Kami</h3>
            <ul className="space-y-2">
              {[
                { name: 'Prewedding Photography', path: '/pengguna/layanan/prewedding' },
                { name: 'Drone Photography', path: '/pengguna/layanan/drone' },
                { name: 'Graduation Photography', path: '/pengguna/layanan/graduation' },
                { name: 'Corporate Event', path: '/pengguna/layanan/corporate_event' },
                { name: 'Documentary', path: '/pengguna/layanan/documentary' }
              ].map((service) => (
                <li key={service.name}>
                  <Link 
                    to={service.path}
                    className="text-gray-400 hover:text-primary-400 transition-colors flex items-center group"
                  >
                    <ArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-800 pb-2">Kontak Kami</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={18} className="text-primary-400 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-400">
                  Perum Telaga Murni Blok E23 No. 25, RT 02 RW 08 Kelurahan Telaga Murni, Kec. Cikarang Barat, Kab. Bekasi, Jawa Barat 17530
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="text-primary-400 mr-3 flex-shrink-0" />
                <a href="tel:+6285283125585" className="text-gray-400 hover:text-primary-400 transition-colors">
                  +62 852-8312-5585
                </a>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="text-primary-400 mr-3 flex-shrink-0" />
                <a href="mailto:myerkvi@gmail.com" className="text-gray-400 hover:text-primary-400 transition-colors">
                  myerkvi@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} MKVI - Myer Kreatif Vision Vibe. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to="/pengguna/terms" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
                Syarat & Ketentuan
              </Link>
              <Link to="/pengguna/privacy" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
                Kebijakan Privasi
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default UserFooter
import React from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, ExternalLink } from 'lucide-react'

const UserProfileCard = ({ profile, className = '' }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden ${className}`}
    >
      {/* Cover Image */}
      {profile.coverImage && (
        <div className="h-24 bg-gradient-to-r from-primary-500 to-primary-700 relative">
          <img 
            src={profile.coverImage} 
            alt="Cover" 
            className="w-full h-full object-cover opacity-50"
          />
        </div>
      )}
      
      {/* Profile Image */}
      <div className="flex justify-center">
        <div className={`w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 ${profile.coverImage ? '-mt-12' : 'mt-6'}`}>
          <img 
            src={profile.image} 
            alt={profile.name} 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      
      {/* Profile Info */}
      <div className="p-6 text-center">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
          {profile.name}
        </h3>
        
        <p className="text-primary-600 dark:text-primary-400 font-medium mb-3">
          {profile.role}
        </p>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
          {profile.bio}
        </p>
        
        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          {profile.email && (
            <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-400">
              <Mail className="w-4 h-4 mr-2" />
              <span>{profile.email}</span>
            </div>
          )}
          
          {profile.phone && (
            <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-400">
              <Phone className="w-4 h-4 mr-2" />
              <span>{profile.phone}</span>
            </div>
          )}
        </div>
        
        {/* Social Links */}
        {profile.socialLinks && profile.socialLinks.length > 0 && (
          <div className="flex justify-center space-x-3">
            {profile.socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-primary-100 hover:text-primary-600 dark:hover:bg-primary-900 dark:hover:text-primary-400 transition-colors"
              >
                {link.icon}
              </a>
            ))}
          </div>
        )}
        
        {/* Action Button */}
        {profile.actionUrl && (
          <div className="mt-4">
            <a
              href={profile.actionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              {profile.actionLabel || 'View Profile'}
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default UserProfileCard
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Mail, 
  Send, 
  CheckCircle, 
  Clock,
  AlertCircle,
  User,
  FileText
} from 'lucide-react'
import { useMutation } from 'react-query'
import { emailService } from '../services/api'
import toast from 'react-hot-toast'

const EmailManager = ({ 
  userEmail, 
  userName, 
  orderData, 
  meetingData, 
  paymentData,
  type = 'all' 
}) => {
  const [emailHistory, setEmailHistory] = useState([])

  // Email mutations
  const sendWelcomeMutation = useMutation(
    () => emailService.sendWelcome(userEmail, userName),
    {
      onSuccess: () => {
        toast.success('Email selamat datang berhasil dikirim')
        addToHistory('welcome', 'Email Selamat Datang')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Gagal mengirim email')
      }
    }
  )

  const sendOrderConfirmationMutation = useMutation(
    () => emailService.sendOrderConfirmation(userEmail, userName, orderData),
    {
      onSuccess: () => {
        toast.success('Email konfirmasi pemesanan berhasil dikirim')
        addToHistory('order-confirmation', 'Konfirmasi Pemesanan')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Gagal mengirim email')
      }
    }
  )

  const sendOrderValidationMutation = useMutation(
    () => emailService.sendOrderValidation(userEmail, userName, orderData),
    {
      onSuccess: () => {
        toast.success('Email validasi pemesanan berhasil dikirim')
        addToHistory('order-validation', 'Validasi Pemesanan')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Gagal mengirim email')
      }
    }
  )

  const sendMeetingInvitationMutation = useMutation(
    () => emailService.sendMeetingInvitation(userEmail, userName, meetingData),
    {
      onSuccess: () => {
        toast.success('Email undangan meeting berhasil dikirim')
        addToHistory('meeting-invitation', 'Undangan Meeting')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Gagal mengirim email')
      }
    }
  )

  const sendPaymentConfirmationMutation = useMutation(
    () => emailService.sendPaymentConfirmation(userEmail, userName, paymentData),
    {
      onSuccess: () => {
        toast.success('Email konfirmasi pembayaran berhasil dikirim')
        addToHistory('payment-confirmation', 'Konfirmasi Pembayaran')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Gagal mengirim email')
      }
    }
  )

  const addToHistory = (type, title) => {
    setEmailHistory(prev => [...prev, {
      id: Date.now(),
      type,
      title,
      sentAt: new Date(),
      recipient: userEmail
    }])
  }

  const emailTypes = [
    {
      id: 'welcome',
      title: 'Email Selamat Datang',
      description: 'Kirim email selamat datang untuk pengguna baru',
      icon: User,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      mutation: sendWelcomeMutation,
      enabled: type === 'all' || type === 'welcome'
    },
    {
      id: 'order-confirmation',
      title: 'Konfirmasi Pemesanan',
      description: 'Kirim email konfirmasi setelah pemesanan dibuat',
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      mutation: sendOrderConfirmationMutation,
      enabled: (type === 'all' || type === 'order') && orderData
    },
    {
      id: 'order-validation',
      title: 'Validasi Pemesanan',
      description: 'Kirim email setelah pemesanan divalidasi admin',
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
      mutation: sendOrderValidationMutation,
      enabled: (type === 'all' || type === 'order') && orderData
    },
    {
      id: 'meeting-invitation',
      title: 'Undangan Meeting',
      description: 'Kirim email undangan meeting dengan client',
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      mutation: sendMeetingInvitationMutation,
      enabled: (type === 'all' || type === 'meeting') && meetingData
    },
    {
      id: 'payment-confirmation',
      title: 'Konfirmasi Pembayaran',
      description: 'Kirim email konfirmasi setelah pembayaran diterima',
      icon: CheckCircle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      mutation: sendPaymentConfirmationMutation,
      enabled: (type === 'all' || type === 'payment') && paymentData
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Manajemen Email
        </h3>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Penerima: {userEmail}
        </div>
      </div>

      {/* Email Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {emailTypes.filter(email => email.enabled).map((email) => (
          <motion.div
            key={email.id}
            whileHover={{ scale: 1.02 }}
            className="card"
          >
            <div className="card-content">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${email.bgColor}`}>
                  <email.icon className={`w-5 h-5 ${email.color}`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {email.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {email.description}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => email.mutation.mutate()}
                disabled={email.mutation.isLoading}
                className="btn btn-primary btn-sm w-full mt-4"
              >
                {email.mutation.isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Mengirim...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Send className="w-4 h-4 mr-2" />
                    Kirim Email
                  </div>
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Email History */}
      {emailHistory.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 dark:text-white">
            Riwayat Email Terkirim
          </h4>
          
          <div className="space-y-2">
            {emailHistory.map((email) => (
              <motion.div
                key={email.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
              >
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {email.title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Dikirim ke: {email.recipient}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {email.sentAt.toLocaleTimeString('id-ID')}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Email Status Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 dark:text-blue-100">
              Informasi Email
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              Email akan dikirim secara otomatis menggunakan template yang telah ditentukan. 
              Pastikan alamat email penerima sudah benar sebelum mengirim.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmailManager
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Download, 
  Eye, 
  Plus,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { documentService } from '../services/api'
import toast from 'react-hot-toast'

const DocumentManager = ({ pemesananId, pembayaranId, meetingId, type = 'all' }) => {
  const [generating, setGenerating] = useState(null)
  const queryClient = useQueryClient()

  // Fetch documents for order
  const { data: documents, isLoading } = useQuery(
    ['documents', pemesananId],
    () => documentService.getOrderDocuments(pemesananId),
    {
      enabled: !!pemesananId,
      select: (data) => data.data.data
    }
  )

  // Generate document mutations
  const generateKwitansiMutation = useMutation(documentService.generateKwitansi, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['documents', pemesananId])
      toast.success('Kwitansi berhasil dibuat')
      // Auto download
      window.open(data.data.data.url, '_blank')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Gagal membuat kwitansi')
    },
    onSettled: () => setGenerating(null)
  })

  const generateInvoiceMutation = useMutation(documentService.generateInvoice, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['documents', pemesananId])
      toast.success('Invoice berhasil dibuat')
      // Auto download
      window.open(data.data.data.url, '_blank')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Gagal membuat invoice')
    },
    onSettled: () => setGenerating(null)
  })

  const generateMouMutation = useMutation(documentService.generateMou, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['documents', pemesananId])
      toast.success('MoU berhasil dibuat')
      // Auto download
      window.open(data.data.data.url, '_blank')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Gagal membuat MoU')
    },
    onSettled: () => setGenerating(null)
  })

  const handleGenerateKwitansi = () => {
    if (!pembayaranId) {
      toast.error('ID Pembayaran diperlukan untuk membuat kwitansi')
      return
    }
    setGenerating('kwitansi')
    generateKwitansiMutation.mutate(pembayaranId)
  }

  const handleGenerateInvoice = () => {
    if (!pemesananId) {
      toast.error('ID Pemesanan diperlukan untuk membuat invoice')
      return
    }
    setGenerating('invoice')
    generateInvoiceMutation.mutate(pemesananId)
  }

  const handleGenerateMou = () => {
    if (!meetingId) {
      toast.error('ID Meeting diperlukan untuk membuat MoU')
      return
    }
    setGenerating('mou')
    generateMouMutation.mutate(meetingId)
  }

  const handleDownload = (url, filename) => {
    // Open in new tab for download
    window.open(url, '_blank')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Manajemen Dokumen
        </h3>
      </div>

      {/* Generate Documents */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(type === 'all' || type === 'invoice') && (
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="card"
          >
            <div className="card-content">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Invoice</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Tagihan pembayaran
                  </p>
                </div>
                {documents?.documents?.invoice ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                )}
              </div>
              
              <div className="flex space-x-2 mt-4">
                {documents?.documents?.invoice ? (
                  <>
                    <button
                      onClick={() => window.open(documents.documents.invoice.url, '_blank')}
                      className="btn btn-secondary btn-sm flex-1"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Lihat
                    </button>
                    <button
                      onClick={() => handleDownload(documents.documents.invoice.url, documents.documents.invoice.filename)}
                      className="btn btn-primary btn-sm flex-1"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleGenerateInvoice}
                    disabled={generating === 'invoice'}
                    className="btn btn-primary btn-sm w-full"
                  >
                    {generating === 'invoice' ? (
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4 mr-1" />
                    )}
                    Generate
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {(type === 'all' || type === 'mou') && (
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="card"
          >
            <div className="card-content">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">MoU</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Surat perjanjian
                  </p>
                </div>
                {documents?.documents?.mou ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                )}
              </div>
              
              <div className="flex space-x-2 mt-4">
                {documents?.documents?.mou ? (
                  <>
                    <button
                      onClick={() => window.open(documents.documents.mou.url, '_blank')}
                      className="btn btn-secondary btn-sm flex-1"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Lihat
                    </button>
                    <button
                      onClick={() => handleDownload(documents.documents.mou.url, documents.documents.mou.filename)}
                      className="btn btn-primary btn-sm flex-1"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleGenerateMou}
                    disabled={generating === 'mou'}
                    className="btn btn-primary btn-sm w-full"
                  >
                    {generating === 'mou' ? (
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4 mr-1" />
                    )}
                    Generate
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {(type === 'all' || type === 'kwitansi') && (
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="card"
          >
            <div className="card-content">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Kwitansi</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Bukti pembayaran
                  </p>
                </div>
                {documents?.documents?.kwitansi?.length > 0 ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                )}
              </div>
              
              <div className="flex space-x-2 mt-4">
                {documents?.documents?.kwitansi?.length > 0 ? (
                  <>
                    <button
                      onClick={() => window.open(documents.documents.kwitansi[0].url, '_blank')}
                      className="btn btn-secondary btn-sm flex-1"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Lihat
                    </button>
                    <button
                      onClick={() => handleDownload(documents.documents.kwitansi[0].url, documents.documents.kwitansi[0].filename)}
                      className="btn btn-primary btn-sm flex-1"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleGenerateKwitansi}
                    disabled={generating === 'kwitansi'}
                    className="btn btn-primary btn-sm w-full"
                  >
                    {generating === 'kwitansi' ? (
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4 mr-1" />
                    )}
                    Generate
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Document List */}
      {documents?.documents && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 dark:text-white">Dokumen Tersedia</h4>
          
          <div className="space-y-2">
            {documents.documents.invoice && (
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Invoice</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {documents.documents.invoice.filename}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => window.open(documents.documents.invoice.url, '_blank')}
                    className="text-primary-600 hover:text-primary-800"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDownload(documents.documents.invoice.url, documents.documents.invoice.filename)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {documents.documents.mou && (
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">MoU</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {documents.documents.mou.filename}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => window.open(documents.documents.mou.url, '_blank')}
                    className="text-primary-600 hover:text-primary-800"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDownload(documents.documents.mou.url, documents.documents.mou.filename)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {documents.documents.kwitansi?.map((kwitansi, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Kwitansi #{index + 1}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {kwitansi.filename}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => window.open(kwitansi.url, '_blank')}
                    className="text-primary-600 hover:text-primary-800"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDownload(kwitansi.url, kwitansi.filename)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default DocumentManager
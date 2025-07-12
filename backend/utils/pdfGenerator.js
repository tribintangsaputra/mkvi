const fs = require('fs');
const path = require('path');

// Generate Invoice PDF (placeholder - you can integrate with libraries like puppeteer or jsPDF)
const generateInvoicePDF = async (orderData, outputPath) => {
  try {
    // This is a placeholder implementation
    // In a real application, you would use libraries like:
    // - puppeteer for HTML to PDF conversion
    // - jsPDF for client-side PDF generation
    // - PDFKit for server-side PDF generation
    
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Invoice - ${orderData.kode_pemesanan}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; margin-bottom: 30px; }
          .company-name { font-size: 24px; font-weight: bold; color: #333; }
          .invoice-title { font-size: 20px; margin: 20px 0; }
          .details { margin: 20px 0; }
          .details table { width: 100%; border-collapse: collapse; }
          .details th, .details td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
          .total { font-size: 18px; font-weight: bold; text-align: right; margin-top: 20px; }
          .footer { margin-top: 40px; text-align: center; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-name">PT. MKVI</div>
          <div>Sistem Pemesanan Jasa Website & Fotografi</div>
        </div>
        
        <div class="invoice-title">INVOICE</div>
        
        <div class="details">
          <table>
            <tr><th>Kode Pemesanan:</th><td>${orderData.kode_pemesanan}</td></tr>
            <tr><th>Kode Tracking:</th><td>${orderData.kode_tracking}</td></tr>
            <tr><th>Nama Pengguna:</th><td>${orderData.pengguna_nama}</td></tr>
            <tr><th>Email:</th><td>${orderData.pengguna_email}</td></tr>
            <tr><th>Layanan:</th><td>${orderData.nama_layanan}</td></tr>
            <tr><th>Nama Acara:</th><td>${orderData.nama_acara}</td></tr>
            <tr><th>Tanggal Pelaksanaan:</th><td>${orderData.tanggal_pelaksanaan}</td></tr>
            <tr><th>Lokasi Acara:</th><td>${orderData.lokasi_acara}</td></tr>
          </table>
        </div>
        
        <div class="total">
          Total: Rp ${parseFloat(orderData.total_tagihan).toLocaleString('id-ID')}
        </div>
        
        <div class="footer">
          <p>Terima kasih atas kepercayaan Anda kepada PT. MKVI</p>
          <p>Untuk pertanyaan, hubungi kami di info@mkvi.com</p>
        </div>
      </body>
      </html>
    `;

    // Save HTML file (in real implementation, convert to PDF)
    const htmlPath = outputPath.replace('.pdf', '.html');
    fs.writeFileSync(htmlPath, invoiceHTML);
    
    // For now, just copy the HTML file as PDF placeholder
    fs.writeFileSync(outputPath, invoiceHTML);
    
    return { success: true, path: outputPath };
  } catch (error) {
    console.error('Generate invoice PDF error:', error);
    return { success: false, error: error.message };
  }
};

// Generate Receipt PDF
const generateReceiptPDF = async (paymentData, outputPath) => {
  try {
    const receiptHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Kwitansi - ${paymentData.kode_pemesanan}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; margin-bottom: 30px; }
          .company-name { font-size: 24px; font-weight: bold; color: #333; }
          .receipt-title { font-size: 20px; margin: 20px 0; }
          .details { margin: 20px 0; }
          .details table { width: 100%; border-collapse: collapse; }
          .details th, .details td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
          .amount { font-size: 18px; font-weight: bold; text-align: center; margin: 20px 0; padding: 15px; background: #f8f9fa; border: 2px solid #dee2e6; }
          .footer { margin-top: 40px; text-align: center; color: #666; }
          .signature { margin-top: 60px; text-align: right; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-name">PT. MKVI</div>
          <div>Sistem Pemesanan Jasa Website & Fotografi</div>
        </div>
        
        <div class="receipt-title">KWITANSI PEMBAYARAN</div>
        
        <div class="details">
          <table>
            <tr><th>Kode Pemesanan:</th><td>${paymentData.kode_pemesanan}</td></tr>
            <tr><th>Nama Pengguna:</th><td>${paymentData.pengguna_nama}</td></tr>
            <tr><th>Layanan:</th><td>${paymentData.nama_layanan}</td></tr>
            <tr><th>Jenis Pembayaran:</th><td>${paymentData.jenis_pembayaran.toUpperCase()}</td></tr>
            <tr><th>Metode Pembayaran:</th><td>${paymentData.metode}</td></tr>
            <tr><th>Tanggal Pembayaran:</th><td>${new Date(paymentData.tanggal_pembayaran).toLocaleDateString('id-ID')}</td></tr>
          </table>
        </div>
        
        <div class="amount">
          Jumlah Dibayar: Rp ${parseFloat(paymentData.total_biaya).toLocaleString('id-ID')}
        </div>
        
        <div class="signature">
          <p>Jakarta, ${new Date().toLocaleDateString('id-ID')}</p>
          <br><br><br>
          <p>PT. MKVI</p>
        </div>
        
        <div class="footer">
          <p>Kwitansi ini sah dan tidak perlu tanda tangan basah</p>
        </div>
      </body>
      </html>
    `;

    // Save HTML file (in real implementation, convert to PDF)
    const htmlPath = outputPath.replace('.pdf', '.html');
    fs.writeFileSync(htmlPath, receiptHTML);
    
    // For now, just copy the HTML file as PDF placeholder
    fs.writeFileSync(outputPath, receiptHTML);
    
    return { success: true, path: outputPath };
  } catch (error) {
    console.error('Generate receipt PDF error:', error);
    return { success: false, error: error.message };
  }
};

// Generate MoU PDF
const generateMouPDF = async (meetingData, outputPath) => {
  try {
    const mouHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>MoU - ${meetingData.kode_pemesanan}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
          .header { text-align: center; margin-bottom: 30px; }
          .company-name { font-size: 24px; font-weight: bold; color: #333; }
          .mou-title { font-size: 20px; margin: 20px 0; text-align: center; }
          .content { margin: 20px 0; text-align: justify; }
          .parties { margin: 20px 0; }
          .signature-section { margin-top: 60px; display: flex; justify-content: space-between; }
          .signature-box { width: 45%; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-name">PT. MKVI</div>
          <div>Sistem Pemesanan Jasa Website & Fotografi</div>
        </div>
        
        <div class="mou-title">MEMORANDUM OF UNDERSTANDING (MoU)</div>
        
        <div class="content">
          <p>Pada hari ini, ${new Date().toLocaleDateString('id-ID')}, telah disepakati Memorandum of Understanding antara:</p>
          
          <div class="parties">
            <p><strong>PIHAK PERTAMA:</strong><br>
            PT. MKVI<br>
            Berkedudukan di Jakarta<br>
            Dalam hal ini diwakili oleh Admin</p>
            
            <p><strong>PIHAK KEDUA:</strong><br>
            ${meetingData.nama_client || meetingData.pengguna_nama}<br>
            Email: ${meetingData.email_client || meetingData.pengguna_email}<br>
            ${meetingData.no_wa_client ? `No. WhatsApp: ${meetingData.no_wa_client}<br>` : ''}
            ${meetingData.pekerjaan_client ? `Pekerjaan: ${meetingData.pekerjaan_client}` : ''}</p>
          </div>
          
          <p><strong>PASAL 1 - OBJEK PERJANJIAN</strong><br>
          Pihak Pertama akan menyediakan layanan ${meetingData.nama_layanan} untuk acara "${meetingData.nama_acara}" yang akan dilaksanakan pada tanggal ${meetingData.tanggal_pelaksanaan}.</p>
          
          <p><strong>PASAL 2 - KEWAJIBAN PIHAK PERTAMA</strong><br>
          - Menyediakan layanan sesuai dengan spesifikasi yang telah disepakati<br>
          - Menyelesaikan pekerjaan tepat waktu<br>
          - Menjaga kerahasiaan data klien</p>
          
          <p><strong>PASAL 3 - KEWAJIBAN PIHAK KEDUA</strong><br>
          - Melakukan pembayaran sesuai dengan ketentuan yang disepakati<br>
          - Memberikan informasi yang diperlukan untuk pelaksanaan layanan<br>
          - Memberikan akses yang diperlukan untuk pelaksanaan layanan</p>
          
          <p><strong>PASAL 4 - PEMBAYARAN</strong><br>
          Total nilai kontrak sebesar Rp ${parseFloat(meetingData.total_tagihan || 0).toLocaleString('id-ID')} dengan sistem pembayaran yang akan disepakati lebih lanjut.</p>
          
          <p><strong>PASAL 5 - PENUTUP</strong><br>
          MoU ini berlaku sejak ditandatangani oleh kedua belah pihak dan akan berakhir setelah semua kewajiban terpenuhi.</p>
        </div>
        
        <div class="signature-section">
          <div class="signature-box">
            <p>PIHAK PERTAMA</p>
            <br><br><br>
            <p>PT. MKVI</p>
          </div>
          <div class="signature-box">
            <p>PIHAK KEDUA</p>
            <br><br><br>
            <p>${meetingData.nama_client || meetingData.pengguna_nama}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Save HTML file (in real implementation, convert to PDF)
    const htmlPath = outputPath.replace('.pdf', '.html');
    fs.writeFileSync(htmlPath, mouHTML);
    
    // For now, just copy the HTML file as PDF placeholder
    fs.writeFileSync(outputPath, mouHTML);
    
    return { success: true, path: outputPath };
  } catch (error) {
    console.error('Generate MoU PDF error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  generateInvoicePDF,
  generateReceiptPDF,
  generateMouPDF
};
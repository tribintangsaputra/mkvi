const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

// Send email
const sendEmail = async (to, subject, html, attachments = []) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"PT. MKVI" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      attachments
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};

// Send welcome email to new user
const sendWelcomeEmail = async (userEmail, userName) => {
  const subject = 'Selamat Datang di PT. MKVI';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Selamat Datang, ${userName}!</h2>
      <p>Terima kasih telah mendaftar di PT. MKVI - Sistem Pemesanan Jasa Website & Fotografi.</p>
      <p>Akun Anda telah berhasil dibuat dan siap digunakan.</p>
      <p>Anda dapat mulai menjelajahi layanan kami dan melakukan pemesanan sesuai kebutuhan.</p>
      <hr style="border: 1px solid #eee; margin: 20px 0;">
      <p style="color: #666; font-size: 12px;">
        Email ini dikirim secara otomatis. Mohon tidak membalas email ini.
      </p>
    </div>
  `;
  
  return await sendEmail(userEmail, subject, html);
};

// Send order confirmation email
const sendOrderConfirmationEmail = async (userEmail, userName, orderData) => {
  const subject = `Konfirmasi Pemesanan - ${orderData.kode_pemesanan}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Konfirmasi Pemesanan</h2>
      <p>Halo ${userName},</p>
      <p>Pemesanan Anda telah berhasil dibuat dengan detail sebagai berikut:</p>
      
      <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <h3 style="margin-top: 0;">Detail Pemesanan</h3>
        <p><strong>Kode Pemesanan:</strong> ${orderData.kode_pemesanan}</p>
        <p><strong>Kode Tracking:</strong> ${orderData.kode_tracking}</p>
        <p><strong>Layanan:</strong> ${orderData.nama_layanan}</p>
        <p><strong>Nama Acara:</strong> ${orderData.nama_acara}</p>
        <p><strong>Tanggal Pelaksanaan:</strong> ${orderData.tanggal_pelaksanaan}</p>
        <p><strong>Lokasi:</strong> ${orderData.lokasi_acara}</p>
        <p><strong>Total Tagihan:</strong> Rp ${parseFloat(orderData.total_tagihan).toLocaleString('id-ID')}</p>
        <p><strong>Status:</strong> ${orderData.status}</p>
      </div>
      
      <p>Pemesanan Anda sedang dalam proses validasi admin. Kami akan menghubungi Anda segera.</p>
      <p>Anda dapat melacak status pemesanan menggunakan kode tracking: <strong>${orderData.kode_tracking}</strong></p>
      
      <hr style="border: 1px solid #eee; margin: 20px 0;">
      <p style="color: #666; font-size: 12px;">
        Email ini dikirim secara otomatis. Mohon tidak membalas email ini.
      </p>
    </div>
  `;
  
  return await sendEmail(userEmail, subject, html);
};

// Send order validation email
const sendOrderValidationEmail = async (userEmail, userName, orderData) => {
  const subject = `Pemesanan Tervalidasi - ${orderData.kode_pemesanan}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #28a745;">Pemesanan Tervalidasi</h2>
      <p>Halo ${userName},</p>
      <p>Kabar baik! Pemesanan Anda telah divalidasi dan disetujui oleh admin.</p>
      
      <div style="background: #d4edda; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #28a745;">
        <h3 style="margin-top: 0; color: #155724;">Detail Pemesanan</h3>
        <p><strong>Kode Pemesanan:</strong> ${orderData.kode_pemesanan}</p>
        <p><strong>Kode Tracking:</strong> ${orderData.kode_tracking}</p>
        <p><strong>Layanan:</strong> ${orderData.nama_layanan}</p>
        <p><strong>Nama Acara:</strong> ${orderData.nama_acara}</p>
        <p><strong>Status:</strong> Tervalidasi</p>
      </div>
      
      <p>Langkah selanjutnya:</p>
      <ol>
        <li>Admin akan menghubungi Anda untuk penjadwalan meeting</li>
        <li>Setelah meeting, Anda akan menerima invoice dan dapat melakukan pembayaran</li>
        <li>Proses pengerjaan akan dimulai setelah pembayaran dikonfirmasi</li>
      </ol>
      
      <hr style="border: 1px solid #eee; margin: 20px 0;">
      <p style="color: #666; font-size: 12px;">
        Email ini dikirim secara otomatis. Mohon tidak membalas email ini.
      </p>
    </div>
  `;
  
  return await sendEmail(userEmail, subject, html);
};

// Send meeting invitation email
const sendMeetingInvitationEmail = async (userEmail, userName, meetingData) => {
  const subject = `Undangan Meeting - ${meetingData.kode_pemesanan}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #007bff;">Undangan Meeting</h2>
      <p>Halo ${userName},</p>
      <p>Anda diundang untuk menghadiri meeting terkait pemesanan Anda.</p>
      
      <div style="background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #007bff;">
        <h3 style="margin-top: 0; color: #0d47a1;">Detail Meeting</h3>
        <p><strong>Kode Pemesanan:</strong> ${meetingData.kode_pemesanan}</p>
        <p><strong>Nama Acara:</strong> ${meetingData.nama_acara}</p>
        <p><strong>Platform:</strong> ${meetingData.platform}</p>
        ${meetingData.waktu_mulai ? `<p><strong>Waktu:</strong> ${new Date(meetingData.waktu_mulai).toLocaleString('id-ID')}</p>` : ''}
        ${meetingData.calendly_link ? `<p><strong>Link Penjadwalan:</strong> <a href="${meetingData.calendly_link}" target="_blank">Pilih Jadwal Meeting</a></p>` : ''}
      </div>
      
      ${meetingData.calendly_link ? 
        '<p>Silakan klik link di atas untuk memilih jadwal meeting yang sesuai dengan Anda.</p>' :
        '<p>Admin akan menghubungi Anda untuk konfirmasi jadwal meeting.</p>'
      }
      
      <hr style="border: 1px solid #eee; margin: 20px 0;">
      <p style="color: #666; font-size: 12px;">
        Email ini dikirim secara otomatis. Mohon tidak membalas email ini.
      </p>
    </div>
  `;
  
  return await sendEmail(userEmail, subject, html);
};

// Send payment confirmation email
const sendPaymentConfirmationEmail = async (userEmail, userName, paymentData) => {
  const subject = `Konfirmasi Pembayaran - ${paymentData.kode_pemesanan}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #28a745;">Konfirmasi Pembayaran</h2>
      <p>Halo ${userName},</p>
      <p>Pembayaran Anda telah berhasil dikonfirmasi.</p>
      
      <div style="background: #d4edda; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #28a745;">
        <h3 style="margin-top: 0; color: #155724;">Detail Pembayaran</h3>
        <p><strong>Kode Pemesanan:</strong> ${paymentData.kode_pemesanan}</p>
        <p><strong>Jenis Pembayaran:</strong> ${paymentData.jenis_pembayaran.toUpperCase()}</p>
        <p><strong>Jumlah:</strong> Rp ${parseFloat(paymentData.total_biaya).toLocaleString('id-ID')}</p>
        <p><strong>Metode:</strong> ${paymentData.metode}</p>
        <p><strong>Status:</strong> ${paymentData.status}</p>
        <p><strong>Tanggal:</strong> ${new Date(paymentData.tanggal_pembayaran).toLocaleString('id-ID')}</p>
      </div>
      
      <p>Terima kasih atas pembayaran Anda. Proses pengerjaan akan segera dimulai.</p>
      
      <hr style="border: 1px solid #eee; margin: 20px 0;">
      <p style="color: #666; font-size: 12px;">
        Email ini dikirim secara otomatis. Mohon tidak membalas email ini.
      </p>
    </div>
  `;
  
  return await sendEmail(userEmail, subject, html);
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendOrderConfirmationEmail,
  sendOrderValidationEmail,
  sendMeetingInvitationEmail,
  sendPaymentConfirmationEmail
};
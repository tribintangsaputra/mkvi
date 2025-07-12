const fs = require('fs');
const path = require('path');
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');

// Set locale to Indonesian
moment.locale('id');

// Helper function to convert number to Indonesian words
const terbilang = (angka) => {
  const bilangan = [
    '', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan',
    'sepuluh', 'sebelas', 'dua belas', 'tiga belas', 'empat belas', 'lima belas',
    'enam belas', 'tujuh belas', 'delapan belas', 'sembilan belas'
  ];

  const puluhan = [
    '', '', 'dua puluh', 'tiga puluh', 'empat puluh', 'lima puluh',
    'enam puluh', 'tujuh puluh', 'delapan puluh', 'sembilan puluh'
  ];

  if (angka < 20) {
    return bilangan[angka];
  } else if (angka < 100) {
    return puluhan[Math.floor(angka / 10)] + (angka % 10 !== 0 ? ' ' + bilangan[angka % 10] : '');
  } else if (angka < 200) {
    return 'seratus' + (angka % 100 !== 0 ? ' ' + terbilang(angka % 100) : '');
  } else if (angka < 1000) {
    return bilangan[Math.floor(angka / 100)] + ' ratus' + (angka % 100 !== 0 ? ' ' + terbilang(angka % 100) : '');
  } else if (angka < 2000) {
    return 'seribu' + (angka % 1000 !== 0 ? ' ' + terbilang(angka % 1000) : '');
  } else if (angka < 1000000) {
    return terbilang(Math.floor(angka / 1000)) + ' ribu' + (angka % 1000 !== 0 ? ' ' + terbilang(angka % 1000) : '');
  } else if (angka < 1000000000) {
    return terbilang(Math.floor(angka / 1000000)) + ' juta' + (angka % 1000000 !== 0 ? ' ' + terbilang(angka % 1000000) : '');
  } else {
    return terbilang(Math.floor(angka / 1000000000)) + ' miliar' + (angka % 1000000000 !== 0 ? ' ' + terbilang(angka % 1000000000) : '');
  }
};

// Format currency to Indonesian Rupiah
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID').format(amount);
};

// Generate Kwitansi HTML
const generateKwitansiHTML = async (paymentData) => {
  try {
    const templatePath = path.join(__dirname, '../templates/kwitansi.html');
    let template = fs.readFileSync(templatePath, 'utf8');

    // Generate nomor urut based on current year and payment ID
    const currentYear = moment().year();
    const nomorUrut = String(paymentData.id).padStart(3, '0');

    // Prepare data for template
    const templateData = {
      tahun: currentYear,
      nomor_urut: nomorUrut,
      tanggal_pembayaran: moment(paymentData.tanggal_pembayaran).format('DD MMMM YYYY'),
      nama_client: paymentData.nama_client || paymentData.pengguna_nama,
      perusahaan_client: paymentData.pekerjaan_client || '-',
      alamat_client: paymentData.lokasi_acara || '-',
      total_biaya_formatted: formatCurrency(paymentData.total_biaya),
      terbilang: terbilang(parseInt(paymentData.total_biaya)) + ' rupiah',
      layanan_list: [paymentData.nama_layanan],
      nama_penerima: 'Admin MKVi',
      jabatan_penerima: 'Manager',
      kode_pemesanan: paymentData.kode_pemesanan
    };

    // Replace template variables
    Object.keys(templateData).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      if (Array.isArray(templateData[key])) {
        // Handle arrays (like layanan_list)
        const listItems = templateData[key].map(item => `<p>- ${item}</p>`).join('');
        template = template.replace(regex, listItems);
      } else {
        template = template.replace(regex, templateData[key] || '');
      }
    });

    return { success: true, html: template };
  } catch (error) {
    console.error('Generate kwitansi HTML error:', error);
    return { success: false, error: error.message };
  }
};

// Generate Invoice HTML
const generateInvoiceHTML = async (orderData) => {
  try {
    const templatePath = path.join(__dirname, '../templates/invoice.html');
    let template = fs.readFileSync(templatePath, 'utf8');

    // Generate nomor urut based on current year and order ID
    const currentYear = moment().year();
    const nomorUrut = String(orderData.id).padStart(3, '0');

    // Prepare invoice items
    const items = [
      {
        layanan: orderData.nama_layanan,
        deskripsi: orderData.deskripsi_kebutuhan || orderData.layanan_deskripsi || 'Layanan sesuai kesepakatan',
        jumlah: 1,
        harga_satuan_formatted: `Rp ${formatCurrency(orderData.total_tagihan)}`,
        total_formatted: `Rp ${formatCurrency(orderData.total_tagihan)}`
      }
    ];

    // Prepare data for template
    const templateData = {
      tahun: currentYear,
      nomor_urut: nomorUrut,
      tanggal_invoice: moment().format('DD MMMM YYYY'),
      nama_client: orderData.pengguna_nama,
      perusahaan_client: '-',
      alamat_client: orderData.lokasi_acara || '-',
      items: items,
      grand_total_formatted: `Rp ${formatCurrency(orderData.total_tagihan)}`,
      nama_penanggung_jawab: 'Admin MKVi',
      kode_pemesanan: orderData.kode_pemesanan
    };

    // Replace template variables
    Object.keys(templateData).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      if (key === 'items') {
        // Handle items array
        let itemsHTML = '';
        templateData[key].forEach(item => {
          itemsHTML += `
            <tr>
              <td>${item.layanan}</td>
              <td>${item.deskripsi}</td>
              <td class="text-center">${item.jumlah}</td>
              <td class="text-right">${item.harga_satuan_formatted}</td>
              <td class="text-right">${item.total_formatted}</td>
            </tr>
          `;
        });
        template = template.replace(/{{#each items}}[\s\S]*?{{\/each}}/g, itemsHTML);
      } else {
        template = template.replace(regex, templateData[key] || '');
      }
    });

    return { success: true, html: template };
  } catch (error) {
    console.error('Generate invoice HTML error:', error);
    return { success: false, error: error.message };
  }
};

// Generate MoU HTML
const generateMouHTML = async (meetingData) => {
  try {
    const templatePath = path.join(__dirname, '../templates/mou.html');
    let template = fs.readFileSync(templatePath, 'utf8');

    // Prepare data for template
    const templateData = {
      hari: moment().format('dddd'),
      tanggal: moment().format('DD MMMM YYYY'),
      nama_client_perusahaan: meetingData.nama_client || meetingData.pengguna_nama,
      nama_penanggung_jawab_mkvi: 'Admin MKVi',
      jabatan_penanggung_jawab: 'Manager Produksi',
      nama_client: meetingData.nama_client || meetingData.pengguna_nama,
      jabatan_client: meetingData.pekerjaan_client || 'Client',
      nama_perusahaan_client: meetingData.pekerjaan_client || '-',
      alamat_client: meetingData.lokasi_acara || '-',
      layanan_list: [meetingData.nama_layanan],
      total_biaya_formatted: `Rp ${formatCurrency(meetingData.total_tagihan || 0)}`,
      dp_percentage: '50',
      pelunasan_percentage: '50',
      durasi_proyek: meetingData.durasi_pengerjaan || '14 hari kerja setelah DP diterima',
      max_revisi: '2x',
      kode_pemesanan: meetingData.kode_pemesanan
    };

    // Replace template variables
    Object.keys(templateData).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      if (Array.isArray(templateData[key])) {
        // Handle arrays (like layanan_list)
        const listItems = templateData[key].map(item => `<p>- ${item}</p>`).join('');
        template = template.replace(regex, listItems);
      } else {
        template = template.replace(regex, templateData[key] || '');
      }
    });

    // Handle Handlebars-style each loops
    template = template.replace(/{{#each layanan_list}}[\s\S]*?{{\/each}}/g, 
      templateData.layanan_list.map(item => `<p>- ${item}</p>`).join(''));

    return { success: true, html: template };
  } catch (error) {
    console.error('Generate MoU HTML error:', error);
    return { success: false, error: error.message };
  }
};

// Save HTML to file
const saveHTMLToFile = async (html, filename, folder = 'documents') => {
  try {
    const outputDir = path.join(__dirname, `../uploads/${folder}`);
    
    // Ensure directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const filePath = path.join(outputDir, filename);
    fs.writeFileSync(filePath, html, 'utf8');

    return { 
      success: true, 
      path: filePath, 
      url: `http://localhost:5000/uploads/${folder}/${filename}`,
      filename: filename
    };
  } catch (error) {
    console.error('Save HTML to file error:', error);
    return { success: false, error: error.message };
  }
};

// Convert HTML to PDF (placeholder for future implementation)
const convertHTMLToPDF = async (html, filename, folder = 'documents') => {
  try {
    // For now, save as HTML file
    // In production, use puppeteer or similar to convert to actual PDF
    const htmlResult = await saveHTMLToFile(html, filename.replace('.pdf', '.html'), folder);
    
    // Simulate PDF conversion
    const pdfFilename = filename;
    const pdfPath = path.join(__dirname, `../uploads/${folder}`, pdfFilename);
    
    // Copy HTML content as PDF placeholder
    fs.writeFileSync(pdfPath, html, 'utf8');
    
    return {
      success: true,
      path: pdfPath,
      url: `http://localhost:5000/uploads/${folder}/${pdfFilename}`,
      filename: pdfFilename
    };
  } catch (error) {
    console.error('Convert HTML to PDF error:', error);
    return { success: false, error: error.message };
  }
};

// Generate and save Kwitansi
const generateKwitansi = async (paymentData) => {
  try {
    const htmlResult = await generateKwitansiHTML(paymentData);
    if (!htmlResult.success) {
      return htmlResult;
    }

    const filename = `kwitansi-${paymentData.kode_pemesanan}-${moment().format('YYYYMMDD-HHmmss')}.pdf`;
    const saveResult = await convertHTMLToPDF(htmlResult.html, filename);

    return {
      success: true,
      data: {
        filename: saveResult.filename,
        path: saveResult.path,
        url: saveResult.url,
        type: 'kwitansi'
      }
    };
  } catch (error) {
    console.error('Generate kwitansi error:', error);
    return { success: false, error: error.message };
  }
};

// Generate and save Invoice
const generateInvoice = async (orderData) => {
  try {
    const htmlResult = await generateInvoiceHTML(orderData);
    if (!htmlResult.success) {
      return htmlResult;
    }

    const filename = `invoice-${orderData.kode_pemesanan}-${moment().format('YYYYMMDD-HHmmss')}.pdf`;
    const saveResult = await convertHTMLToPDF(htmlResult.html, filename);

    return {
      success: true,
      data: {
        filename: saveResult.filename,
        path: saveResult.path,
        url: saveResult.url,
        type: 'invoice'
      }
    };
  } catch (error) {
    console.error('Generate invoice error:', error);
    return { success: false, error: error.message };
  }
};

// Generate and save MoU
const generateMou = async (meetingData) => {
  try {
    const htmlResult = await generateMouHTML(meetingData);
    if (!htmlResult.success) {
      return htmlResult;
    }

    const filename = `mou-${meetingData.kode_pemesanan}-${moment().format('YYYYMMDD-HHmmss')}.pdf`;
    const saveResult = await convertHTMLToPDF(htmlResult.html, filename);

    return {
      success: true,
      data: {
        filename: saveResult.filename,
        path: saveResult.path,
        url: saveResult.url,
        type: 'mou'
      }
    };
  } catch (error) {
    console.error('Generate MoU error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  generateKwitansiHTML,
  generateInvoiceHTML,
  generateMouHTML,
  generateKwitansi,
  generateInvoice,
  generateMou,
  saveHTMLToFile,
  convertHTMLToPDF,
  formatCurrency,
  terbilang
};
const { v4: uuidv4 } = require('uuid');

// Generate order code
const generateOrderCode = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORDER-${timestamp}-${random}`;
};

// Generate tracking code
const generateTrackingCode = () => {
  const counter = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
  return `MKVI_${counter}`;
};

// Generate payment code
const generatePaymentCode = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 4).toUpperCase();
  return `PAY-${timestamp}-${random}`;
};

// Generate invoice number
const generateInvoiceNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 999).toString().padStart(3, '0');
  return `INV-${year}${month}${day}-${random}`;
};

// Generate receipt number
const generateReceiptNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 999).toString().padStart(3, '0');
  return `RCP-${year}${month}${day}-${random}`;
};

// Generate UUID
const generateUUID = () => {
  return uuidv4();
};

module.exports = {
  generateOrderCode,
  generateTrackingCode,
  generatePaymentCode,
  generateInvoiceNumber,
  generateReceiptNumber,
  generateUUID
};
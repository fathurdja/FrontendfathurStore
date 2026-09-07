/**
 * Format number as Indonesian Rupiah currency.
 */
export function formatRupiah(amount) {
  if (!amount && amount !== 0) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format date to Indonesian locale.
 */
export function formatDate(dateString) {
  if (!dateString) return '-';
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString));
}

/**
 * Format short date.
 */
export function formatShortDate(dateString) {
  if (!dateString) return '-';
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateString));
}

/**
 * Get status label in Indonesian.
 */
export function getStatusLabel(status) {
  const labels = {
    pending: 'Menunggu Pembayaran',
    pending_verification: 'Menunggu Verifikasi',
    paid: 'Sudah Dibayar',
    processing: 'Sedang Diproses',
    success: 'Berhasil',
    failed: 'Gagal',
    refund: 'Refund',
    expired: 'Kedaluwarsa',
  };
  return labels[status] || status;
}

/**
 * Get status CSS class.
 */
export function getStatusClass(status) {
  return `status-${status}`;
}

/**
 * Operator logo/color mapping.
 */
export const operatorColors = {
  Telkomsel: { bg: '#ED1C24', text: '#FFFFFF' },
  Indosat: { bg: '#FFD700', text: '#1a1a1a' },
  XL: { bg: '#0168B3', text: '#FFFFFF' },
  Axis: { bg: '#6B2D8B', text: '#FFFFFF' },
  Tri: { bg: '#E31E52', text: '#FFFFFF' },
  Smartfren: { bg: '#ED1C24', text: '#FFFFFF' },
  PLN: { bg: '#0066B3', text: '#FFFFFF' },
  GoPay: { bg: '#00AEEF', text: '#FFFFFF' },
  OVO: { bg: '#4C3494', text: '#FFFFFF' },
  Dana: { bg: '#108EE9', text: '#FFFFFF' },
  ShopeePay: { bg: '#EE4D2D', text: '#FFFFFF' },
};

/**
 * Get operator initials for avatar.
 */
export function getOperatorInitials(operator) {
  if (!operator) return '?';
  return operator.substring(0, 2).toUpperCase();
}

/**
 * Truncate string with ellipsis.
 */
export function truncate(str, maxLen = 30) {
  if (!str) return '';
  return str.length > maxLen ? str.substring(0, maxLen) + '...' : str;
}

/**
 * Normalize phone number to 08xxx format.
 */
export function normalizePhone(phone) {
  if (!phone) return '';
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('62')) {
    cleaned = '0' + cleaned.substring(2);
  }
  if (cleaned.startsWith('+62')) {
    cleaned = '0' + cleaned.substring(3);
  }
  return cleaned;
}

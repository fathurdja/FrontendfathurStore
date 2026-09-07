'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { CheckCircle, XCircle, Clock, Loader2, Home, ArrowLeft, Copy, Upload, RefreshCw, Mail, Send } from 'lucide-react';
import { getTransactionStatus, confirmPayment, sendTransactionInvoice } from '@/lib/api';
import { formatRupiah, formatDate, getStatusLabel, getStatusClass } from '@/lib/utils';
import useAppStore from '@/store/useAppStore';

export default function PaymentPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId;
  const { currentTransaction, clearCheckout } = useAppStore();

  const [transaction, setTransaction] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [paymentProof, setPaymentProof] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [invoiceEmail, setInvoiceEmail] = useState('');
  const [isSendingInvoice, setIsSendingInvoice] = useState(false);
  const [invoiceSentMessage, setInvoiceSentMessage] = useState(null);
  
  const pollingRef = useRef(null);

  useEffect(() => {
    loadTransaction();
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [orderId]);

  const loadTransaction = async () => {
    try {
      const res = await getTransactionStatus(orderId);
      const tx = res.data.data;
      setTransaction(tx);
      if (tx.customer_email) {
        setInvoiceEmail(tx.customer_email);
      }
      setIsLoading(false);

      // Start polling if not in terminal state and not pending (pending needs manual upload)
      if (['processing', 'pending_verification'].includes(tx.status)) {
        startPolling();
      }
    } catch (err) {
      console.error('Failed to load transaction:', err);
      setError('Transaksi tidak ditemukan');
      setIsLoading(false);
    }
  };

  const startPolling = () => {
    if (pollingRef.current) return;
    pollingRef.current = setInterval(async () => {
      try {
        const res = await getTransactionStatus(orderId);
        const tx = res.data.data;
        setTransaction(tx);

        if (['success', 'failed', 'refund', 'expired'].includes(tx.status)) {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 5000);
  };

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyTotal = () => {
    const total = parseFloat(transaction?.total_price || 0) + (transaction?.unique_code || 0);
    navigator.clipboard.writeText(total.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUploadProof = async () => {
    setIsUploading(true);
    try {
      const res = await confirmPayment(orderId, new FormData());
      setTransaction(res.data.data);
      alert('Pembayaran berhasil dikonfirmasi. Menunggu verifikasi admin.');
      
      // Start polling after upload
      startPolling();
    } catch (err) {
      console.error('Confirmation failed:', err);
      alert(err.response?.data?.message || 'Gagal mengonfirmasi pembayaran');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendInvoice = async (e) => {
    e?.preventDefault();
    if (!invoiceEmail || !invoiceEmail.includes('@')) {
      alert('Masukkan alamat email yang valid.');
      return;
    }

    setIsSendingInvoice(true);
    setInvoiceSentMessage(null);
    try {
      const res = await sendTransactionInvoice(orderId, { email: invoiceEmail });
      setInvoiceSentMessage(res.data?.message || 'Bukti transaksi / invoice berhasil dikirim ke email!');
      if (transaction) {
        setTransaction({ ...transaction, customer_email: invoiceEmail });
      }
    } catch (err) {
      console.error('Failed to send invoice:', err);
      alert(err.response?.data?.message || 'Gagal mengirim invoice ke email.');
    } finally {
      setIsSendingInvoice(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 animate-fade-in">
        <Loader2 size={40} className="text-primary animate-spin" />
        <p className="text-text-muted text-sm">Memuat detail transaksi...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center animate-fade-in">
        <div className="w-20 h-20 bg-danger/10 rounded-full mx-auto mb-4 flex items-center justify-center">
          <XCircle size={32} className="text-danger" />
        </div>
        <p className="text-text-dark font-semibold mb-2">{error}</p>
        <button
          onClick={() => router.push('/')}
          className="bg-primary text-accent font-bold px-6 py-2.5 rounded-xl hover:bg-primary-hover transition-all"
        >
          Ke Beranda
        </button>
      </div>
    );
  }

  const status = transaction?.status || 'pending';
  const isSuccess = status === 'success';
  const isFailed = ['failed', 'expired', 'refund'].includes(status);
  const isPendingVerification = status === 'pending_verification';
  const isPending = status === 'pending';
  const isProcessing = status === 'processing';

  const basePrice = parseFloat(transaction?.total_price || 0);
  const uniqueCode = transaction?.unique_code || 0;
  const grandTotal = basePrice + uniqueCode;

  return (
    <div className="animate-fade-in w-full max-w-3xl mx-auto md:py-8 md:px-6">
      <div className="md:bg-white md:rounded-3xl md:shadow-2xl md:overflow-hidden">
        {/* Status Header */}
        <div className={`px-5 md:px-8 pt-6 md:pt-8 pb-10 md:pb-12 -mt-0.5 md:mt-0 ${
          isSuccess ? 'bg-gradient-to-br from-emerald-500 to-emerald-700'
          : isFailed ? 'bg-gradient-to-br from-red-500 to-red-700'
          : isPendingVerification ? 'bg-gradient-to-br from-orange-400 to-orange-600'
          : 'bg-gradient-to-br from-accent to-accent-alt'
        }`}>
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-white/80 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Beranda</span>
          </button>

          <div className="text-center">
            <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg ${
              isSuccess ? 'bg-white/20' : isFailed ? 'bg-white/20' : 'bg-white/15'
            }`}>
              {isSuccess ? (
                <CheckCircle size={40} className="text-white animate-scale-in" />
              ) : isFailed ? (
                <XCircle size={40} className="text-white animate-scale-in" />
              ) : (
                <Clock size={40} className="text-white animate-pulse-soft" />
              )}
            </div>
            <h2 className="text-white font-extrabold text-xl md:text-2xl mb-1">
              {isSuccess ? 'Transaksi Berhasil!' 
               : isFailed ? 'Transaksi Gagal'
               : isPending ? 'Menunggu Pembayaran'
               : isPendingVerification ? 'Menunggu Verifikasi Admin'
               : 'Sedang Diproses'}
            </h2>
            <p className="text-white/80 text-sm md:text-base mt-2">
              {isSuccess ? 'Produk berhasil dikirim ke nomor tujuan'
               : isFailed ? transaction?.notes || 'Pembayaran ditolak atau gagal'
               : isPending ? 'Silakan transfer tepat sesuai nominal yang tertera'
               : isPendingVerification ? 'Pembayaran Anda sedang dicek oleh admin kami'
               : 'Pesanan sedang diproses, mohon tunggu...'}
            </p>
          </div>
        </div>

        <div className="px-5 md:px-8 -mt-6 relative z-10 space-y-4 md:space-y-6 md:pb-8">
          
          {/* QRIS Payment Section - ONLY SHOW IF PENDING */}
          {isPending && (
            <div className="bg-white rounded-2xl shadow-lg border border-primary/20 p-5 md:p-8 animate-slide-up text-center">
              <h3 className="text-sm font-bold text-text-dark uppercase tracking-wider mb-2">Scan QRIS untuk Membayar</h3>
              <p className="text-xs md:text-sm text-text-muted mb-6">Gunakan aplikasi GoPay, OVO, Dana, ShopeePay atau M-Banking Anda</p>
              
              <div className="bg-bg-main p-4 rounded-xl inline-block mb-6 shadow-inner border border-border">
                {/* PLACEHOLDER QRIS - Will be updated by user later */}
                <div className="w-[200px] h-[200px] bg-white flex items-center justify-center border-2 border-dashed border-primary/30 rounded-lg">
                  <span className="text-primary font-semibold">QRIS IMAGE HERE</span>
                </div>
              </div>

              <div className="bg-primary/5 rounded-xl p-4 mb-6 border border-primary/10">
                <p className="text-xs text-text-muted mb-1">Total yang harus ditransfer (PENTING!)</p>
                <div className="flex items-center justify-center gap-3">
                  <span className="font-extrabold text-primary text-2xl md:text-3xl">{formatRupiah(grandTotal)}</span>
                  <button onClick={copyTotal} className="p-2 bg-white rounded-lg shadow-sm text-text-muted hover:text-primary transition-colors">
                    <Copy size={18} />
                  </button>
                </div>
                <p className="text-xs text-danger mt-2 font-medium">Transfer sesuai nominal persis hingga 3 digit terakhir agar pembayaran dapat dikenali admin.</p>
              </div>

              <div className="border-t border-border pt-5">
                <p className="text-sm font-bold text-text-dark mb-3">Penting! Jika Anda sudah transfer:</p>
                <button
                  onClick={handleUploadProof}
                  disabled={isUploading}
                  className="w-full bg-primary text-accent px-6 py-4 rounded-xl font-bold hover:bg-primary-hover disabled:opacity-50 flex items-center justify-center gap-2 shadow-md transition-all text-base"
                >
                  {isUploading ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle size={20} />}
                  Saya Sudah Transfer
                </button>
              </div>
            </div>
          )}

          {/* Transaction Detail Card */}
          <div className="bg-white rounded-2xl shadow-lg p-5 md:p-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xs md:text-sm font-bold text-text-muted uppercase tracking-wider">
                Detail Transaksi
              </h3>
              <span className={`text-xs font-bold px-3 py-1.5 rounded-lg ${getStatusClass(status)}`}>
                {getStatusLabel(status)}
              </span>
            </div>

            <div className="space-y-3.5 text-sm md:text-base">
              <div className="flex justify-between items-center pb-2 border-b border-border/50">
                <span className="text-text-muted">Order ID</span>
                <button onClick={copyOrderId} className="flex items-center gap-2 group">
                  <span className="font-mono font-semibold text-text-dark text-xs md:text-sm">{orderId}</span>
                  <Copy size={14} className={`transition-colors ${copied ? 'text-primary' : 'text-text-muted group-hover:text-primary'}`} />
                </button>
              </div>

              <div className="flex justify-between">
                <span className="text-text-muted">Produk</span>
                <span className="font-semibold text-text-dark">{transaction?.product?.name || '-'}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-text-muted">Nomor Tujuan</span>
                <span className="font-semibold text-text-dark">
                  {transaction?.phone_number || transaction?.customer_id || '-'}
                </span>
              </div>

              {transaction?.customer_name && (
                <div className="flex justify-between">
                  <span className="text-text-muted">Nama Pelanggan</span>
                  <span className="font-semibold text-text-dark">{transaction.customer_name}</span>
                </div>
              )}

              <div className="bg-bg-main p-4 rounded-xl mt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-text-muted text-xs md:text-sm">Harga</span>
                  <span className="font-semibold text-xs md:text-sm">{formatRupiah(transaction?.product_price)}</span>
                </div>
                {transaction?.admin_fee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-text-muted text-xs md:text-sm">Biaya Admin</span>
                    <span className="font-semibold text-xs md:text-sm">{formatRupiah(transaction?.admin_fee)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-text-muted text-xs md:text-sm">Kode Unik</span>
                  <span className="font-semibold text-primary text-xs md:text-sm">+{uniqueCode}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border">
                  <span className="font-bold text-text-darker">Total Akhir</span>
                  <span className="font-extrabold text-primary">{formatRupiah(grandTotal)}</span>
                </div>
              </div>

              {transaction?.payment_method && (
                <div className="flex justify-between pt-3">
                  <span className="text-text-muted">Metode Bayar</span>
                  <span className="font-semibold text-text-dark uppercase">{transaction.payment_method}</span>
                </div>
              )}

              {transaction?.iak_sn && (
                <div className="bg-primary-light rounded-xl p-4 mt-4 border border-primary/20">
                  <p className="text-xs text-accent font-semibold mb-1">Nomor Token / SN (Berhasil)</p>
                  <p className="font-mono font-bold text-accent text-lg tracking-wider">{transaction.iak_sn}</p>
                </div>
              )}

              <div className="flex justify-between pt-3">
                <span className="text-text-muted">Waktu Transaksi</span>
                <span className="font-medium text-text-muted text-xs md:text-sm">{formatDate(transaction?.created_at)}</span>
              </div>
            </div>
          </div>

          {/* Email Invoice & Bukti Transaksi Card */}
          <div className="bg-white rounded-2xl md:rounded-xl shadow-lg md:shadow-sm md:border md:border-border/50 p-5 md:p-6 animate-slide-up" style={{ animationDelay: '150ms' }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                <Mail size={16} className="text-primary" />
                Bukti Transaksi & Invoice ke Email
              </h3>
              {transaction?.customer_email && (
                <span className="text-[10px] bg-success/15 text-success font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle size={10} /> Terdaftar
                </span>
              )}
            </div>

            {transaction?.customer_email ? (
              <p className="text-xs text-text-muted mb-3">
                Bukti transaksi ini dikirim ke: <strong className="text-text-darker">{transaction.customer_email}</strong>
              </p>
            ) : (
              <p className="text-xs text-text-muted mb-3">
                Ingin bukti pembayaran atau invoice terkirim ke email Anda? Masukkan alamat email di bawah:
              </p>
            )}

            <form onSubmit={handleSendInvoice} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="email"
                  value={invoiceEmail}
                  onChange={(e) => {
                    setInvoiceEmail(e.target.value);
                    setInvoiceSentMessage(null);
                  }}
                  placeholder="Masukkan alamat email..."
                  required
                  className="w-full bg-bg-main rounded-xl pl-10 pr-4 py-2.5 text-xs md:text-sm font-medium border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={isSendingInvoice || !invoiceEmail}
                className="bg-primary text-accent font-bold px-5 py-2.5 rounded-xl text-xs md:text-sm hover:bg-primary-hover transition-all disabled:opacity-60 flex items-center justify-center gap-1.5 shadow-sm whitespace-nowrap"
              >
                {isSendingInvoice ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Mengirim...</span>
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    <span>{transaction?.customer_email ? 'Kirim Ulang Invoice' : 'Kirim Invoice'}</span>
                  </>
                )}
              </button>
            </form>

            {invoiceSentMessage && (
              <div className="mt-3 p-2.5 bg-success/10 border border-success/20 rounded-xl flex items-center gap-2 text-xs font-semibold text-success animate-fade-in">
                <CheckCircle size={14} className="flex-shrink-0" />
                <span>{invoiceSentMessage}</span>
              </div>
            )}
          </div>

          {/* Polling indicator for verification or processing */}
          {(isPendingVerification || isProcessing) && (
            <div className="flex items-center justify-center gap-2 text-text-muted text-xs md:text-sm bg-white py-3 rounded-xl shadow-sm animate-pulse-soft" style={{ animationDelay: '200ms' }}>
              <RefreshCw size={16} className="animate-spin text-primary" />
              <span>Memeriksa status pesanan Anda...</span>
            </div>
          )}

          {/* Back to home */}
          <div className="pt-2 md:pt-4">
            <button
              onClick={() => {
                clearCheckout();
                router.push('/');
              }}
              className="w-full bg-white border-2 border-border text-text-dark font-bold py-4 rounded-xl text-sm md:text-base hover:border-primary hover:text-primary hover:shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Home size={20} />
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

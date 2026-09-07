'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, Loader2, Shield, Mail, AlertCircle } from 'lucide-react';
import { createTransaction } from '@/lib/api';
import { formatRupiah } from '@/lib/utils';
import useAppStore from '@/store/useAppStore';

export default function CheckoutPage() {
  const router = useRouter();
  const { checkoutData, setCurrentTransaction, clearCheckout } = useAppStore();
  const [email, setEmail] = useState(checkoutData?.customer_email || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!checkoutData) {
    return (
      <div className="p-6 text-center animate-fade-in">
        <div className="w-20 h-20 bg-primary-light rounded-full mx-auto mb-4 flex items-center justify-center">
          <CreditCard size={32} className="text-accent" />
        </div>
        <p className="text-text-dark font-semibold mb-2">Tidak ada produk dipilih</p>
        <p className="text-text-muted text-sm mb-4">Silakan pilih produk terlebih dahulu</p>
        <button
          onClick={() => router.push('/')}
          className="bg-primary text-accent font-bold px-6 py-2.5 rounded-xl hover:bg-primary-hover transition-all"
        >
          Ke Beranda
        </button>
      </div>
    );
  }

  const { product, phone_number, customer_id, customer_name } = checkoutData;
  const totalPrice = parseFloat(product.price) + parseFloat(product.admin_fee || 0);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        product_id: product.id,
        phone_number: phone_number || null,
        customer_id: customer_id || null,
        customer_name: customer_name || null,
        customer_email: email || null,
      };

      const res = await createTransaction(payload);
      const data = res.data.data;

      setCurrentTransaction(data);
      router.push(`/payment/${data.order_id}`);
    } catch (err) {
      console.error('Checkout failed:', err);
      setError(err.response?.data?.message || 'Gagal membuat transaksi. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in w-full max-w-3xl mx-auto md:py-8 md:px-6">
      <div className="md:bg-white md:rounded-3xl md:shadow-2xl md:overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-accent to-accent-alt px-5 md:px-8 pt-4 md:pt-8 pb-8 md:pb-10 -mt-0.5 md:mt-0 shadow-xl md:shadow-none">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/80 hover:text-white text-sm mb-4 md:mb-6 transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Kembali</span>
          </button>
          <h2 className="text-white font-extrabold text-xl md:text-2xl">Konfirmasi Pesanan</h2>
          <p className="text-white/70 text-sm md:text-base mt-1">Periksa detail pesanan sebelum bayar</p>
        </div>

        <div className="px-5 md:px-8 -mt-4 md:mt-0 md:py-8 space-y-4 md:space-y-6 relative z-10">
          {/* Order Summary Card */}
          <div className="bg-white rounded-2xl md:rounded-xl shadow-lg md:shadow-sm md:border md:border-border/50 p-5 md:p-6 animate-slide-up">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">
              Ringkasan Pesanan
            </h3>

            <div className="flex items-center gap-4 mb-5 pb-5 border-b border-border">
              <div className="w-14 h-14 bg-primary-light rounded-xl flex items-center justify-center shadow-inner">
                <CreditCard size={24} className="text-accent" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-text-darker text-sm md:text-base">{product.name}</p>
                <p className="text-text-muted text-xs md:text-sm mt-0.5">
                  {phone_number || customer_id || '-'}
                  {customer_name ? ` • ${customer_name}` : ''}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm md:text-base">
                <span className="text-text-muted">Harga Produk</span>
                <span className="font-semibold text-text-dark">{formatRupiah(product.price)}</span>
              </div>
              {product.admin_fee > 0 && (
                <div className="flex justify-between text-sm md:text-base">
                  <span className="text-text-muted">Biaya Admin</span>
                  <span className="font-semibold text-text-dark">{formatRupiah(product.admin_fee)}</span>
                </div>
              )}
              <div className="border-t border-border pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-text-darker">Total Bayar</span>
                  <span className="font-extrabold text-primary text-lg md:text-xl">{formatRupiah(totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Email untuk Bukti Transaksi & Invoice */}
          <div className="bg-white rounded-2xl md:rounded-xl shadow-lg md:shadow-sm md:border md:border-border/50 p-5 md:p-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                <Mail size={14} className="text-primary" />
                Email Penerima Bukti Transaksi & Invoice
              </h3>
              <span className="text-[10px] bg-primary-light text-accent font-bold px-2 py-0.5 rounded-full">
                Otomatis Dikirim
              </span>
            </div>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full bg-bg-main rounded-xl pl-12 pr-4 py-3.5 text-sm font-medium border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <p className="text-[11px] text-text-muted mt-2 leading-relaxed">
              Bukti pembayaran, rincian transaksi, dan kode voucher / token PLN akan otomatis dikirimkan ke alamat email ini.
            </p>
          </div>

          {/* Security Note */}
          <div className="flex items-center gap-3 px-2 md:px-0 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="w-8 h-8 rounded-full bg-accent-alt/10 flex items-center justify-center flex-shrink-0">
              <Shield size={16} className="text-accent-alt" />
            </div>
            <p className="text-[11px] md:text-xs text-text-muted">
              Pembayaran menggunakan <strong>GoPay Merchant (QRIS)</strong>. Kode QRIS dan petunjuk transfer akan ditampilkan di halaman selanjutnya.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-danger/10 border border-danger/20 rounded-xl p-4 flex items-start gap-3 animate-scale-in">
              <AlertCircle size={18} className="text-danger flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-danger">{error}</p>
            </div>
          )}

          {/* Pay Button */}
          <div className="md:pt-4">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-primary text-accent font-extrabold py-4 md:py-4.5 rounded-2xl text-base md:text-lg hover:bg-primary-hover hover:shadow-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md animate-slide-up"
              style={{ animationDelay: '300ms' }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={24} className="animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <CreditCard size={24} />
                  Lanjut Pembayaran
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

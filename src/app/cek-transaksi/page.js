'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowLeft, Mail, Hash, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { getTransactionStatus, checkTransactionByEmail } from '@/lib/api';
import { formatRupiah, formatDate, getStatusLabel, getStatusClass } from '@/lib/utils';

export default function CekTransaksiPage() {
  const router = useRouter();
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [transaction, setTransaction] = useState(null);
  const [error, setError] = useState(null);
  const [searchMode, setSearchMode] = useState('orderId'); // 'orderId' or 'email'

  const handleSearch = async () => {
    if (searchMode === 'orderId' && !orderId.trim()) {
      setError('Masukkan Order ID');
      return;
    }
    if (searchMode === 'email' && (!orderId.trim() || !email.trim())) {
      setError('Masukkan Order ID dan Email');
      return;
    }

    setIsLoading(true);
    setError(null);
    setTransaction(null);

    try {
      let res;
      if (searchMode === 'email') {
        res = await checkTransactionByEmail({ order_id: orderId, email });
      } else {
        res = await getTransactionStatus(orderId);
      }
      setTransaction(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Transaksi tidak ditemukan');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-br from-accent to-accent-alt px-5 pt-4 pb-8 -mt-0.5">
        <h2 className="text-white font-bold text-xl mb-1">Cek Transaksi</h2>
        <p className="text-white/60 text-sm">Lacak status transaksi Anda</p>

        {/* Search Mode Tabs */}
        <div className="mt-4 flex gap-2 bg-white/10 rounded-xl p-1">
          <button
            onClick={() => setSearchMode('orderId')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              searchMode === 'orderId' ? 'bg-white text-accent shadow' : 'text-white/70'
            }`}
          >
            Order ID
          </button>
          <button
            onClick={() => setSearchMode('email')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              searchMode === 'email' ? 'bg-white text-accent shadow' : 'text-white/70'
            }`}
          >
            Order ID + Email
          </button>
        </div>

        {/* Input Fields */}
        <div className="mt-4 space-y-3">
          <div className="relative">
            <Hash size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Masukkan Order ID (FTR-...)"
              className="w-full bg-white/15 text-white placeholder-white/40 rounded-xl pl-11 pr-4 py-3.5 border border-white/20 focus:border-primary focus:outline-none text-sm font-medium"
            />
          </div>

          {searchMode === 'email' && (
            <div className="relative animate-slide-down">
              <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email saat checkout"
                className="w-full bg-white/15 text-white placeholder-white/40 rounded-xl pl-11 pr-4 py-3.5 border border-white/20 focus:border-primary focus:outline-none text-sm font-medium"
              />
            </div>
          )}

          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="w-full bg-primary text-accent font-bold py-3.5 rounded-xl hover:bg-primary-hover transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <><Loader2 size={18} className="animate-spin" /> Mencari...</>
            ) : (
              <><Search size={18} /> Cari Transaksi</>
            )}
          </button>
        </div>
      </div>

      <div className="px-5 -mt-3">
        {/* Error */}
        {error && (
          <div className="bg-danger/10 border border-danger/20 rounded-xl p-3 flex items-start gap-2 animate-scale-in mb-4">
            <AlertCircle size={16} className="text-danger flex-shrink-0 mt-0.5" />
            <p className="text-sm text-danger">{error}</p>
          </div>
        )}

        {/* Result */}
        {transaction && (
          <div className="bg-white rounded-2xl shadow-lg p-5 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Hasil</h3>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${getStatusClass(transaction.status)}`}>
                {getStatusLabel(transaction.status)}
              </span>
            </div>

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">Order ID</span>
                <span className="font-mono font-semibold text-xs">{transaction.order_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Produk</span>
                <span className="font-semibold">{transaction.product?.name || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Total</span>
                <span className="font-extrabold text-primary">{formatRupiah(transaction.total_price)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Tanggal</span>
                <span className="font-semibold text-xs">{formatDate(transaction.created_at)}</span>
              </div>
              {transaction.iak_sn && (
                <div className="bg-primary-light rounded-xl p-3 mt-2">
                  <p className="text-xs text-accent font-semibold mb-1">Token / SN</p>
                  <p className="font-mono font-bold text-accent tracking-wider">{transaction.iak_sn}</p>
                </div>
              )}
            </div>

            <button
              onClick={() => router.push(`/payment/${transaction.order_id}`)}
              className="mt-4 w-full bg-accent text-white font-bold py-3 rounded-xl hover:bg-accent-alt transition-all text-sm"
            >
              Lihat Detail Lengkap
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

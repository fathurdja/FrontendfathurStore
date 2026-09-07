'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { History, Loader2, Clock, AlertCircle, ChevronRight } from 'lucide-react';
import { formatRupiah, formatShortDate, getStatusLabel, getStatusClass } from '@/lib/utils';
import useAppStore from '@/store/useAppStore';
import api from '@/lib/api';

export default function RiwayatPage() {
  const router = useRouter();
  const { isAuthenticated } = useAppStore();
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadHistory();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const loadHistory = async () => {
    try {
      const res = await api.get('/my/transactions');
      setTransactions(res.data.data?.data || []);
    } catch (err) {
      setError('Gagal memuat riwayat');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="animate-fade-in">
        <div className="bg-gradient-to-br from-accent to-accent-alt px-5 pt-4 pb-8 -mt-0.5">
          <h2 className="text-white font-bold text-xl mb-1">Riwayat Transaksi</h2>
          <p className="text-white/60 text-sm">Lihat semua riwayat transaksi Anda</p>
        </div>

        <div className="px-5 -mt-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-primary-light rounded-full mx-auto mb-4 flex items-center justify-center">
              <History size={32} className="text-accent" />
            </div>
            <p className="text-text-dark font-semibold mb-2">Fitur Riwayat</p>
            <p className="text-text-muted text-sm mb-4 leading-relaxed">
              Riwayat transaksi tersedia untuk pengguna yang login. 
              Untuk melacak transaksi tanpa login, gunakan fitur <strong>Cek Transaksi</strong>.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/cek-transaksi')}
                className="flex-1 bg-primary text-accent font-bold py-3 rounded-xl hover:bg-primary-hover transition-all text-sm"
              >
                Cek Transaksi
              </button>
              <button
                onClick={() => router.push('/admin/login')}
                className="flex-1 bg-accent text-white font-bold py-3 rounded-xl hover:bg-accent-alt transition-all text-sm"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-br from-accent to-accent-alt px-5 pt-4 pb-8 -mt-0.5">
        <h2 className="text-white font-bold text-xl mb-1">Riwayat Transaksi</h2>
        <p className="text-white/60 text-sm">{transactions.length} transaksi</p>
      </div>

      <div className="px-5 -mt-4">
        {isLoading ? (
          <div className="flex flex-col items-center py-12 gap-3">
            <Loader2 size={32} className="text-primary animate-spin" />
            <p className="text-text-muted text-sm">Memuat riwayat...</p>
          </div>
        ) : error ? (
          <div className="bg-danger/10 border border-danger/20 rounded-xl p-3 flex items-start gap-2">
            <AlertCircle size={16} className="text-danger flex-shrink-0 mt-0.5" />
            <p className="text-sm text-danger">{error}</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <Clock size={40} className="text-text-muted mx-auto mb-3" />
            <p className="text-text-dark font-semibold">Belum ada transaksi</p>
            <p className="text-text-muted text-sm">Transaksi Anda akan muncul di sini</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <button
                key={tx.id}
                onClick={() => router.push(`/payment/${tx.order_id}`)}
                className="w-full bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all text-left flex items-center gap-3 group"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-text-dark text-sm truncate">
                    {tx.product?.name || 'Produk'}
                  </p>
                  <p className="text-text-muted text-xs mt-0.5">
                    {tx.phone_number || tx.customer_id || '-'} • {formatShortDate(tx.created_at)}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-text-darker text-sm">{formatRupiah(tx.total_price)}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${getStatusClass(tx.status)}`}>
                    {getStatusLabel(tx.status)}
                  </span>
                </div>
                <ChevronRight size={16} className="text-text-muted group-hover:text-primary transition-colors flex-shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

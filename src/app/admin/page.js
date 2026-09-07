'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BarChart3, TrendingUp, ShoppingCart, AlertTriangle, CheckCircle, 
  XCircle, Clock, Loader2, LogOut, ArrowLeft, ChevronRight, RefreshCw,
  DollarSign, Activity 
} from 'lucide-react';
import { getAdminDashboard, getAdminTransactions } from '@/lib/api';
import { formatRupiah, formatShortDate, getStatusLabel, getStatusClass } from '@/lib/utils';
import useAppStore from '@/store/useAppStore';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user, clearAuth, loadAuth } = useAppStore();
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [error, setError] = useState(null);
  
  // Modal State
  const [selectedTx, setSelectedTx] = useState(null);
  const [isProcessingTx, setIsProcessingTx] = useState(false);

  useEffect(() => {
    loadAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      loadDashboard();
    } else if (!isAuthenticated) {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  const loadDashboard = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [dashRes, txRes] = await Promise.all([
        getAdminDashboard(),
        getAdminTransactions({ status: statusFilter || undefined }),
      ]);
      setStats(dashRes.data.data);
      setTransactions(txRes.data.data?.data || []);
    } catch (err) {
      setError('Gagal memuat dashboard');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = async (status) => {
    setStatusFilter(status);
    try {
      const res = await getAdminTransactions({ status: status || undefined });
      setTransactions(res.data.data?.data || []);
    } catch (err) {
      console.error('Filter error:', err);
    }
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="p-6 text-center animate-fade-in">
        <div className="w-20 h-20 bg-danger/10 rounded-full mx-auto mb-4 flex items-center justify-center">
          <AlertTriangle size={32} className="text-danger" />
        </div>
        <p className="text-text-dark font-semibold mb-2">Akses Ditolak</p>
        <p className="text-text-muted text-sm mb-4">Halaman ini hanya untuk admin</p>
        <button
          onClick={() => router.push('/admin/login')}
          className="bg-accent text-white font-bold px-6 py-2.5 rounded-xl hover:bg-accent-alt transition-all"
        >
          Login Admin
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 size={40} className="text-primary animate-spin" />
        <p className="text-text-muted text-sm">Memuat dashboard...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Admin Header */}
      <div className="bg-gradient-to-br from-accent to-accent-alt px-5 pt-4 pb-8 -mt-0.5">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Beranda</span>
          </button>
          <button
            onClick={() => { clearAuth(); router.push('/'); }}
            className="flex items-center gap-1.5 text-white/60 hover:text-white text-xs transition-colors"
          >
            <LogOut size={14} />
            Keluar
          </button>
        </div>
        <h2 className="text-white font-extrabold text-xl">Dashboard Admin</h2>
        <p className="text-white/60 text-sm">Halo, {user?.name} 👋</p>
      </div>

      <div className="px-5 -mt-4 space-y-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-4 shadow-sm animate-slide-up">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-primary-light rounded-lg flex items-center justify-center">
                <DollarSign size={16} className="text-accent" />
              </div>
              <span className="text-xs text-text-muted">Revenue Hari Ini</span>
            </div>
            <p className="font-extrabold text-text-darker text-sm">
              {formatRupiah(stats?.today?.revenue || 0)}
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm animate-slide-up" style={{ animationDelay: '50ms' }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <ShoppingCart size={16} className="text-blue-600" />
              </div>
              <span className="text-xs text-text-muted">Transaksi Hari Ini</span>
            </div>
            <p className="font-extrabold text-text-darker text-sm">
              {stats?.today?.transactions || 0}
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                <CheckCircle size={16} className="text-emerald-600" />
              </div>
              <span className="text-xs text-text-muted">Sukses Hari Ini</span>
            </div>
            <p className="font-extrabold text-emerald-600 text-sm">
              {stats?.today?.success || 0}
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm animate-slide-up" style={{ animationDelay: '150ms' }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                <AlertTriangle size={16} className="text-amber-600" />
              </div>
              <span className="text-xs text-text-muted">Perlu Review</span>
            </div>
            <p className="font-extrabold text-amber-600 text-sm">
              {stats?.pending_review || 0}
            </p>
          </div>
        </div>

        {/* Monthly Summary */}
        <div className="bg-white rounded-xl p-4 shadow-sm animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Ringkasan Bulan Ini
            </h3>
            <button onClick={loadDashboard} className="p-1.5 hover:bg-bg-main rounded-lg transition-colors">
              <RefreshCw size={14} className="text-text-muted" />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-extrabold text-primary">
                {formatRupiah(stats?.this_month?.revenue || 0)}
              </p>
              <p className="text-xs text-text-muted mt-1">
                {stats?.this_month?.transactions || 0} transaksi • {stats?.this_month?.success || 0} sukses
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center">
              <TrendingUp size={24} className="text-accent" />
            </div>
          </div>
        </div>

        {/* Transaction Filter Tabs */}
        <div className="flex gap-1.5 overflow-x-auto">
          {['', 'pending', 'pending_verification', 'paid', 'processing', 'success', 'failed', 'refund'].map((s) => (
            <button
              key={s}
              onClick={() => handleFilterChange(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                statusFilter === s
                  ? 'bg-accent text-white shadow'
                  : 'bg-white text-text-muted hover:bg-bg-main'
              }`}
            >
              {s ? getStatusLabel(s) : 'Semua'}
            </button>
          ))}
        </div>

        {/* Transaction List */}
        <div className="space-y-2 pb-4">
          <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">
            Transaksi Terbaru
          </h3>
          {transactions.length === 0 ? (
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <p className="text-text-muted text-sm">Belum ada transaksi</p>
            </div>
          ) : (
            transactions.map((tx) => (
              <button
                key={tx.id}
                onClick={() => setSelectedTx(tx)}
                className="w-full bg-white rounded-xl p-3.5 shadow-sm hover:shadow-md transition-all text-left flex items-center gap-3 group"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-text-dark text-sm truncate">
                    {tx.product?.name || 'Produk'}
                  </p>
                  <p className="text-text-muted text-xs mt-0.5 truncate">
                    {tx.order_id} • {tx.phone_number || tx.customer_id || '-'}
                    {tx.customer_email ? ` • ✉️ ${tx.customer_email}` : ''}
                  </p>
                  <p className="text-text-muted text-[10px] mt-0.5">
                    {formatShortDate(tx.created_at)}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-text-darker text-sm">{formatRupiah(tx.total_price)}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${getStatusClass(tx.status)}`}>
                    {getStatusLabel(tx.status)}
                  </span>
                </div>
                <ChevronRight size={14} className="text-text-muted group-hover:text-primary transition-colors flex-shrink-0" />
              </button>
            ))
          )}
        </div>
      </div>

      {/* Transaction Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
            <div className="flex justify-between items-center p-5 border-b border-border">
              <h3 className="font-bold text-lg text-text-darker">Detail Transaksi</h3>
              <button onClick={() => setSelectedTx(null)} className="text-text-muted hover:text-danger">
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="p-5 space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">Status</span>
                <span className={`font-bold px-2 py-0.5 rounded-md ${getStatusClass(selectedTx.status)}`}>
                  {getStatusLabel(selectedTx.status)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-text-muted">Order ID</span>
                <span className="font-mono font-semibold">{selectedTx.order_id}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-text-muted">Produk</span>
                <span className="font-semibold">{selectedTx.product?.name}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-text-muted">Tujuan</span>
                <span className="font-semibold">{selectedTx.phone_number || selectedTx.customer_id}</span>
              </div>

              {selectedTx.customer_email && (
                <div className="flex justify-between">
                  <span className="text-text-muted">Email Invoice</span>
                  <span className="font-semibold text-accent">{selectedTx.customer_email}</span>
                </div>
              )}

              <div className="bg-bg-main p-3 rounded-xl mt-2">
                <div className="flex justify-between mb-1">
                  <span className="text-text-muted text-xs">Total Tagihan</span>
                  <span className="font-bold">{formatRupiah(selectedTx.total_price + (selectedTx.unique_code || 0))}</span>
                </div>
              </div>

              {selectedTx.payment_proof && (
                <div className="mt-4">
                  <p className="text-xs font-bold text-text-muted mb-2 uppercase">Bukti Pembayaran</p>
                  <a href={`http://localhost:8000/storage/${selectedTx.payment_proof}`} target="_blank" rel="noopener noreferrer">
                    <img 
                      src={`http://localhost:8000/storage/${selectedTx.payment_proof}`} 
                      alt="Bukti Transfer" 
                      className="w-full h-auto rounded-lg border border-border object-contain max-h-64"
                    />
                  </a>
                  <p className="text-[10px] text-center text-text-muted mt-1">Klik gambar untuk memperbesar</p>
                </div>
              )}
            </div>

            {selectedTx.status === 'pending_verification' && (
              <div className="p-5 border-t border-border flex gap-3">
                <button 
                  onClick={async () => {
                    if (confirm('Tolak pembayaran ini?')) {
                      setIsProcessingTx(true);
                      try {
                        const { rejectPayment } = await import('@/lib/api');
                        await rejectPayment(selectedTx.order_id, { reason: 'Bukti transfer tidak valid' });
                        alert('Pembayaran ditolak.');
                        setSelectedTx(null);
                        loadDashboard();
                      } catch (e) {
                        alert('Gagal menolak.');
                      } finally {
                        setIsProcessingTx(false);
                      }
                    }
                  }}
                  disabled={isProcessingTx}
                  className="flex-1 bg-danger/10 text-danger font-bold py-3 rounded-xl hover:bg-danger/20 transition-colors disabled:opacity-50"
                >
                  Tolak
                </button>
                <button 
                  onClick={async () => {
                    if (confirm('Verifikasi dan proses top up ke IAK sekarang?')) {
                      setIsProcessingTx(true);
                      try {
                        const { processPayment } = await import('@/lib/api');
                        await processPayment(selectedTx.order_id);
                        alert('Pembayaran berhasil diverifikasi. Top Up sedang diproses!');
                        setSelectedTx(null);
                        loadDashboard();
                      } catch (e) {
                        alert(e.response?.data?.message || 'Gagal memproses Top Up.');
                      } finally {
                        setIsProcessingTx(false);
                      }
                    }
                  }}
                  disabled={isProcessingTx}
                  className="flex-1 bg-primary text-accent font-bold py-3 rounded-xl hover:bg-primary-hover transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {isProcessingTx && <Loader2 size={16} className="animate-spin" />}
                  Verifikasi & Proses
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

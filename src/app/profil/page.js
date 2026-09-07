'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, LogIn, Shield, ChevronRight, Info, ExternalLink } from 'lucide-react';
import useAppStore from '@/store/useAppStore';

export default function ProfilPage() {
  const router = useRouter();
  const { isAuthenticated, user, clearAuth, loadAuth } = useAppStore();

  useEffect(() => {
    loadAuth();
  }, []);

  const handleLogout = () => {
    clearAuth();
    router.push('/');
  };

  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-br from-accent to-accent-alt px-5 pt-4 pb-8 -mt-0.5">
        <h2 className="text-white font-bold text-xl mb-1">Profil</h2>
        <p className="text-white/60 text-sm">
          {isAuthenticated ? `Halo, ${user?.name}!` : 'Kelola akun Anda'}
        </p>
      </div>

      <div className="px-5 -mt-4 space-y-4">
        {isAuthenticated ? (
          // Logged in profile
          <>
            <div className="bg-white rounded-2xl shadow-lg p-5 animate-slide-up">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center">
                  <span className="text-accent font-extrabold text-xl">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-text-darker">{user?.name}</p>
                  <p className="text-text-muted text-sm">{user?.email}</p>
                  {user?.phone && <p className="text-text-muted text-xs">{user.phone}</p>}
                </div>
              </div>

              {user?.role === 'admin' && (
                <button
                  onClick={() => router.push('/admin')}
                  className="w-full flex items-center justify-between bg-accent text-white rounded-xl px-4 py-3 mt-2 hover:bg-accent-alt transition-all"
                >
                  <div className="flex items-center gap-2">
                    <Shield size={18} />
                    <span className="font-semibold text-sm">Dashboard Admin</span>
                  </div>
                  <ChevronRight size={18} />
                </button>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="w-full bg-white border-2 border-danger/20 text-danger font-bold py-3 rounded-2xl hover:bg-danger/5 transition-all text-sm"
            >
              Keluar
            </button>
          </>
        ) : (
          // Guest profile
          <>
            <div className="bg-white rounded-2xl shadow-lg p-5 animate-slide-up">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-bg-main rounded-2xl flex items-center justify-center">
                  <User size={28} className="text-text-muted" />
                </div>
                <div>
                  <p className="font-bold text-text-darker">Mode Tamu</p>
                  <p className="text-text-muted text-sm">Anda bisa bertransaksi tanpa login</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => router.push('/admin/login')}
              className="w-full bg-accent text-white font-bold py-3.5 rounded-2xl hover:bg-accent-alt transition-all text-sm flex items-center justify-center gap-2 animate-slide-up"
              style={{ animationDelay: '100ms' }}
            >
              <LogIn size={18} />
              Login Admin
            </button>
          </>
        )}

        {/* App Info */}
        <div className="bg-white rounded-2xl shadow-lg p-5 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Tentang Aplikasi</h3>
          <div className="space-y-3">
            {[
              { label: 'Versi', value: '1.0.0' },
              { label: 'Platform', value: 'Web (Mobile-Responsive)' },
              { label: 'Payment Gateway', value: 'Midtrans' },
              { label: 'Biller', value: 'IAK' },
            ].map((item) => (
              <div key={item.label} className="flex justify-between text-sm">
                <span className="text-text-muted">{item.label}</span>
                <span className="font-semibold text-text-dark">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

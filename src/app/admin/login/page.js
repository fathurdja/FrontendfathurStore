'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, Mail, Lock, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { login } from '@/lib/api';
import useAppStore from '@/store/useAppStore';

export default function AdminLoginPage() {
  const router = useRouter();
  const { setAuth } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await login({ email, password });
      const { user, token } = res.data.data;

      setAuth(user, token);

      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal. Periksa email dan password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-br from-accent to-accent-alt px-5 pt-4 pb-12 -mt-0.5">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-white/80 hover:text-white text-sm mb-6 transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Beranda</span>
        </button>

        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <span className="text-accent font-extrabold text-2xl">F</span>
          </div>
          <h2 className="text-white font-extrabold text-2xl">Login Admin</h2>
          <p className="text-white/60 text-sm mt-1">Masuk ke dashboard admin</p>
        </div>
      </div>

      <div className="px-5 -mt-6">
        <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
          {error && (
            <div className="bg-danger/10 border border-danger/20 rounded-xl p-3 flex items-start gap-2 animate-scale-in">
              <AlertCircle size={16} className="text-danger flex-shrink-0 mt-0.5" />
              <p className="text-sm text-danger">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
              Email
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ftrstore.com"
                required
                className="w-full bg-bg-main rounded-xl pl-11 pr-4 py-3 text-sm border border-border focus:border-primary focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-bg-main rounded-xl pl-11 pr-4 py-3 text-sm border border-border focus:border-primary focus:outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-accent font-extrabold py-3.5 rounded-xl hover:bg-primary-hover transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-md"
          >
            {isLoading ? (
              <><Loader2 size={18} className="animate-spin" /> Masuk...</>
            ) : (
              <><LogIn size={18} /> Masuk</>
            )}
          </button>

          <p className="text-center text-text-muted text-xs">
            Default: admin@ftrstore.com / admin123
          </p>
        </form>
      </div>
    </div>
  );
}

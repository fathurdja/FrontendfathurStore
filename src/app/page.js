'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, Zap, Wallet, Wifi, Gamepad2, ChevronRight, TrendingUp, Shield, Clock } from 'lucide-react';
import { getCategories } from '@/lib/api';

const categoryIcons = {
  'pulsa': Phone,
  'paket-data': Wifi,
  'token-pln': Zap,
  'e-wallet': Wallet,
  'game-voucher': Gamepad2,
};

const categoryColors = {
  'pulsa': 'from-emerald-400 to-emerald-600',
  'paket-data': 'from-blue-400 to-blue-600',
  'token-pln': 'from-amber-400 to-amber-600',
  'e-wallet': 'from-violet-400 to-violet-600',
  'game-voucher': 'from-rose-400 to-rose-600',
};

const categoryBg = {
  'pulsa': 'bg-emerald-50',
  'paket-data': 'bg-blue-50',
  'token-pln': 'bg-amber-50',
  'e-wallet': 'bg-violet-50',
  'game-voucher': 'bg-rose-50',
};

export default function HomePage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data.data || []);
    } catch (err) {
      console.error('Failed to load categories:', err);
      // Use default categories as fallback
      setCategories([
        { id: 1, name: 'Pulsa', slug: 'pulsa', description: 'Isi pulsa semua operator', icon: 'phone' },
        { id: 2, name: 'Paket Data', slug: 'paket-data', description: 'Paket data internet', icon: 'wifi' },
        { id: 3, name: 'Token PLN', slug: 'token-pln', description: 'Token listrik PLN', icon: 'zap' },
        { id: 4, name: 'E-Wallet', slug: 'e-wallet', description: 'Top-up saldo e-wallet', icon: 'wallet' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in w-full max-w-7xl mx-auto px-0 md:px-6 lg:px-8">
      {/* Desktop Layout Wrapper */}
      <div className="md:py-6">
        
        {/* Mobile: Full bleed banner. Desktop: Rounded banner */}
        <section className="bg-gradient-to-br from-accent via-accent to-accent-alt px-5 md:px-10 pt-6 pb-12 md:pb-16 -mt-0.5 md:mt-0 md:rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="text-white md:max-w-xl">
            <p className="text-sm md:text-base opacity-80 mb-1">Selamat datang di</p>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3 md:mb-4">
              FTR Store
            </h2>
            <p className="text-sm md:text-lg opacity-80 leading-relaxed max-w-md">
              Beli pulsa, token listrik, dan top-up e-wallet dengan mudah, instan, & aman.
            </p>
          </div>

          {/* Quick Search Box (Hero) */}
          <div
            className="mt-6 md:mt-0 bg-white/15 backdrop-blur-sm md:backdrop-blur-md rounded-2xl p-4 md:p-6 border border-white/20 cursor-pointer hover:bg-white/20 transition-all md:min-w-[320px]"
            onClick={() => router.push('/produk/pulsa')}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary flex items-center justify-center shadow-inner">
                <Phone size={24} className="text-accent" />
              </div>
              <div className="flex-1">
                <p className="text-white font-bold text-base md:text-lg">Isi Pulsa Cepat</p>
                <p className="text-white/70 text-xs md:text-sm mt-0.5">Mulai dari sini</p>
              </div>
              <ChevronRight size={24} className="text-white/60" />
            </div>
          </div>
        </section>

        {/* Content Wrapper for Desktop */}
        <div className="px-5 md:px-0 -mt-6 md:-mt-8 relative z-10 space-y-5 md:space-y-8">
          
          <div className="md:grid md:grid-cols-12 md:gap-8">
            
            {/* Category Grid */}
            <div className="md:col-span-8">
              <div className="bg-white rounded-2xl shadow-lg p-5 md:p-8 h-full">
                <h3 className="text-sm md:text-base font-bold text-text-darker mb-5 uppercase tracking-wider flex items-center gap-2">
                  <div className="w-2 h-6 bg-primary rounded-full"></div>
                  Layanan Kami
                </h3>
                <div className="grid grid-cols-4 gap-3 md:gap-6">
                  {isLoading
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex flex-col items-center gap-2 md:gap-3">
                          <div className="skeleton w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-3xl" />
                          <div className="skeleton w-12 md:w-16 h-3 md:h-4 rounded" />
                        </div>
                      ))
                    : categories.map((cat, index) => {
                        const Icon = categoryIcons[cat.slug] || Phone;
                        const gradient = categoryColors[cat.slug] || 'from-gray-400 to-gray-600';
                        return (
                          <button
                            key={cat.id}
                            onClick={() => router.push(`/produk/${cat.slug}`)}
                            className="flex flex-col items-center gap-2 md:gap-3 group"
                            style={{ animationDelay: `${index * 80}ms` }}
                          >
                            <div className={`w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md group-hover:shadow-xl group-hover:scale-110 md:group-hover:-translate-y-2 transition-all duration-300`}>
                              <Icon size={24} className="text-white md:w-8 md:h-8" />
                            </div>
                            <span className="text-[11px] md:text-sm font-bold text-text-dark text-center leading-tight">
                              {cat.name}
                            </span>
                          </button>
                        );
                      })
                  }
                </div>
              </div>
            </div>

            {/* Promo Banner / Side Info (Desktop) */}
            <div className="hidden md:block md:col-span-4">
              <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-accent-alt/10 rounded-2xl p-8 border border-primary/20 h-full flex flex-col justify-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 shadow-inner">
                  <TrendingUp size={32} className="text-accent" />
                </div>
                <h3 className="text-xl font-extrabold text-text-darker mb-3 leading-tight">
                  Transaksi Instan & <br/> Terjamin Aman
                </h3>
                <p className="text-sm text-text-muted leading-relaxed mb-6">
                  Pulsa, token PLN, dan saldo e-wallet langsung masuk dalam hitungan detik. Semua pembayaran didukung oleh sistem keamanan Midtrans yang terenkripsi penuh.
                </p>
                <button 
                  onClick={() => router.push('/produk/pulsa')}
                  className="bg-accent text-white font-bold py-3 px-6 rounded-xl hover:bg-accent-alt transition-colors w-max"
                >
                  Coba Sekarang
                </button>
              </div>
            </div>
            
          </div>

          {/* Mobile Promo Banner (Hidden on Desktop) */}
          <div className="md:hidden">
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-accent-alt/10 rounded-2xl p-5 border border-primary/20">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <TrendingUp size={20} className="text-accent" />
                </div>
                <div>
                  <p className="font-bold text-text-darker text-sm mb-1">
                    Transaksi Instan & Aman
                  </p>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Pulsa, token PLN, dan saldo e-wallet langsung masuk dalam hitungan detik. Didukung oleh Midtrans & IAK.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="mb-6 md:mb-12">
            <h3 className="text-sm md:text-base font-bold text-text-darker mb-4 md:mb-6 uppercase tracking-wider flex items-center gap-2">
              <div className="w-2 h-6 bg-accent rounded-full"></div>
              Kenapa FTR Store?
            </h3>
            <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-3 md:gap-6">
              {[
                { icon: Clock, title: 'Proses Instan', desc: 'Transaksi diproses otomatis dalam hitungan detik tanpa perlu menunggu lama.' },
                { icon: Shield, title: 'Aman & Terpercaya', desc: 'Pembayaran terenkripsi melalui payment gateway resmi Midtrans.' },
                { icon: Wallet, title: 'Tanpa Registrasi', desc: 'Langsung beli produk dan checkout tanpa perlu ribet membuat akun.' },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 bg-white rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-border/50 animate-slide-up"
                  style={{ animationDelay: `${(i + 1) * 100}ms` }}
                >
                  <div className="w-11 h-11 md:w-14 md:h-14 rounded-xl bg-primary-light flex items-center justify-center flex-shrink-0">
                    <feature.icon size={20} className="text-accent md:w-6 md:h-6" />
                  </div>
                  <div>
                    <p className="font-extrabold text-sm md:text-base text-text-dark mb-1">{feature.title}</p>
                    <p className="text-xs md:text-sm text-text-muted leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

'use client';

import { usePathname } from 'next/navigation';
import { ArrowLeft, Home, Search, History, User } from 'lucide-react';
import Link from 'next/link';

const desktopNavItems = [
  { href: '/', label: 'Beranda', icon: Home },
  { href: '/cek-transaksi', label: 'Cek Transaksi', icon: Search },
  { href: '/riwayat', label: 'Riwayat', icon: History },
  { href: '/profil', label: 'Profil', icon: User },
];

export default function Navbar({ title, showBack = false, backHref = '/' }) {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <header className="sticky top-0 z-40 bg-accent text-white shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-14 md:h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center flex-1">
          {(showBack && !isHome) && (
            <Link
              href={backHref}
              className="mr-3 p-1 rounded-lg hover:bg-white/10 transition-colors md:hidden"
            >
              <ArrowLeft size={22} />
            </Link>
          )}
          
          <div className="md:hidden">
            <h1 className="text-lg font-bold tracking-tight">
              {isHome ? (
                <span className="flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-accent font-extrabold text-sm">
                    F
                  </span>
                  FTR Store
                </span>
              ) : (
                title || 'FTR Store'
              )}
            </h1>
          </div>

          <Link href="/" className="hidden md:flex items-center gap-2 text-lg font-bold tracking-tight">
            <span className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-accent font-extrabold text-sm">
              F
            </span>
            FTR Store
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {desktopNavItems.map(item => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                className={`flex items-center gap-2 text-sm font-semibold transition-colors ${
                  isActive ? 'text-primary' : 'text-white/80 hover:text-white'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

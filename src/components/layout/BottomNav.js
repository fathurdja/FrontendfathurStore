'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, History, User, Search } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Beranda', icon: Home },
  { href: '/cek-transaksi', label: 'Cek Transaksi', icon: Search },
  { href: '/riwayat', label: 'Riwayat', icon: History },
  { href: '/profil', label: 'Profil', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  // Hide on admin pages
  if (pathname.startsWith('/admin')) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full bg-white border-t border-border z-50 md:hidden">
      <div className="flex items-center justify-around h-16 px-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-primary scale-105'
                  : 'text-text-muted hover:text-accent-alt'
              }`}
            >
              <Icon
                size={22}
                strokeWidth={isActive ? 2.5 : 2}
                className="transition-all duration-200"
              />
              <span className={`text-[10px] font-medium ${isActive ? 'font-bold' : ''}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute bottom-1 w-5 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

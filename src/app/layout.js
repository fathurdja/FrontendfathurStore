import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import BottomNav from '@/components/layout/BottomNav';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata = {
  title: 'FTR Store - PPOB Pulsa, Token PLN & E-Wallet',
  description: 'Beli pulsa, paket data, token PLN, dan top-up e-wallet dengan mudah, cepat, dan aman. Pembayaran instan via QRIS, GoPay, OVO, Dana, dan ShopeePay.',
  keywords: 'ppob, pulsa, token pln, e-wallet, top up, gopay, ovo, dana, shopeepay',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#03624C',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={plusJakartaSans.variable}>
      <body className="font-sans bg-bg-main min-h-screen flex flex-col">
        <div className="flex-1 flex flex-col w-full relative">
          <Navbar />
          <main className="pb-safe md:pb-8 flex-1">
            {children}
          </main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}

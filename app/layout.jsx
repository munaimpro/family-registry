import './globals.css';
import { AppShell } from '../components/AppShell';
import { Hind_Siliguri, Inter } from 'next/font/google';

const hindSiliguri = Hind_Siliguri({
  subsets: ['bengali', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-hind-siliguri',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: 'অলি মিয়া সমাজ কল্যাণ পরিষদ - পরিবার তথ্য নিবন্ধন ও ডিজিটাল ডাইরেক্টরি',
  description: 'অলি মিয়া সমাজ কল্যাণ পরিষদের ডিজিটাল সামাজিক পরিবার রেজিস্ট্রি ও তথ্য ব্যবস্থাপনা ফরম',
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn" className={`${hindSiliguri.variable} ${inter.variable}`}>
      <body suppressHydrationWarning>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

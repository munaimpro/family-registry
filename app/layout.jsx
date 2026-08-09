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
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://omskp.vercel.app'),
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },

  // opengraph image
  openGraph: {
    title: 'অলি মিয়া সমাজ কল্যাণ পরিষদ - পরিবার তথ্য নিবন্ধন ও ডিজিটাল ডাইরেক্টরি',
    description: 'অলি মিয়া সমাজ কল্যাণ পরিষদের ডিজিটাল সামাজিক পরিবার রেজিস্ট্রি ও তথ্য ব্যবস্থাপনা ফরম',
    url: metadata.metadataBase.toString(),
    siteName: 'অলি মিয়া সমাজ কল্যাণ পরিষদ',
    images: [
      {
        url: metadata.metadataBase.toString() + "/icon.png",
        width: 1200,
        height: 630,
        alt: 'অলি মিয়া সমাজ কল্যাণ পরিষদ',
      },
    ],
    locale: 'bn_BD',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'অলি মিয়া সমাজ কল্যাণ পরিষদ - পরিবার তথ্য নিবন্ধন ও ডিজিটাল ডাইরেক্টরি',
    description: 'অলি মিয়া সমাজ কল্যাণ পরিষদের ডিজিটাল সামাজিক পরিবার রেজিস্ট্রি ও তথ্য ব্যবস্থাপনা ফরম',
    images: [metadata.metadataBase.toString() + "/icon.png"],
  },
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

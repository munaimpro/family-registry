import './globals.css';
import { AppShell } from '../components/AppShell';
import { Hind_Siliguri, Inter, Noto_Sans_Bengali, Tiro_Bangla } from 'next/font/google';

const hindSiliguri = Hind_Siliguri({
  subsets: ['bengali', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-hind-siliguri',
  display: 'swap',
});

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ['bengali', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-noto-sans-bengali',
  display: 'swap',
});

const tiroBangla = Tiro_Bangla({
  subsets: ['bengali', 'latin'],
  weight: ['400'], // Tiro Bangla শুধুমাত্র 400 weight সাপোর্ট করে
  variable: '--font-tiro-bangla',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://omskp.vercel.app';

// Native Fetch API দিয়ে API থেকে সেটিংস ডেটা ফেচ করা
const fetchSettings = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/admin/settings`);
    if (response.ok) {
      const result = await response.json();
      return result;
    }
  } catch (error) {
    console.error('Settings fetch error:', error);
  }
};

const settings = await fetchSettings();

export const metadata = {
  title: settings?.appTitle || 'অলি মিয়া সমাজ কল্যাণ পরিষদ - পরিবার তথ্য নিবন্ধন ও ডিজিটাল ডিরেক্টরি',
  description: settings?.appDescription || 'অলি মিয়া সমাজ কল্যাণ পরিষদের ডিজিটাল সামাজিক পরিবার রেজিস্ট্রি ও তথ্য ব্যবস্থাপনা ফরম',
  metadataBase: new URL(baseUrl),
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },

  // OpenGraph Metadata
  openGraph: {
    title: settings?.appTitle || 'অলি মিয়া সমাজ কল্যাণ পরিষদ - পরিবার তথ্য নিবন্ধন ও ডিজিটাল ডিরেক্টরি',
    description: settings?.appDescription || 'অলি মিয়া সমাজ কল্যাণ পরিষদের ডিজিটাল সামাজিক পরিবার রেজিস্ট্রি ও তথ্য ব্যবস্থাপনা ফরম',
    url: '/',
    siteName: settings?.foundationName || 'অলি মিয়া সমাজ কল্যাণ পরিষদ',
    images: [
      {
        property: 'og:image',
        url: settings?.logo || 'https://omskp-blood-bank.vercel.app/og-image.png',
        alt: settings?.foundationName || 'অলি মিয়া সমাজ কল্যাণ পরিষদ',
      },
    ],
    locale: 'bn_BD',
    type: 'website',
  },

  // Twitter Card Metadata
  twitter: {
    card: 'summary_large_image',
    title: settings?.appTitle || 'অলি মিয়া সমাজ কল্যাণ পরিষদ - পরিবার তথ্য নিবন্ধন ও ডিজিটাল ডিরেক্টরি',
    description: settings?.appDescription || 'অলি মিয়া সমাজ কল্যাণ পরিষদের ডিজিটাল সামাজিক পরিবার রেজিস্ট্রি ও তথ্য ব্যবস্থাপনা ফরম',
    images: [settings?.logo || 'https://omskp-blood-bank.vercel.app/og-image.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="bn"
      className={`${hindSiliguri.variable} ${notoSansBengali.variable} ${tiroBangla.variable} ${inter.variable}`}
    >
      <body suppressHydrationWarning>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

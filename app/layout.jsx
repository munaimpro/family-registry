import './globals.css';
import { AppShell } from '../components/AppShell';

export const metadata = {
  title: 'অলি মিয়া সমাজ কল্যাণ পরিষদ - পরিবার তথ্য নিবন্ধন ও ডিজিটাল ডাইরেক্টরি',
  description: 'অলি মিয়া সমাজ কল্যাণ পরিষদের ডিজিটাল সামাজিক পরিবার রেজিস্ট্রি ও তথ্য ব্যবস্থাপনা ফরম',
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <body suppressHydrationWarning>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

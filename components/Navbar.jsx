'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from '../lib/auth-client';
import { getAppSettings } from '../lib/storage';
import {
  Home,
  Search,
  ShieldCheck,
  PlusCircle,
  Download,
  Upload,
  HeartHandshake,
  Menu,
  X,
  LogIn,
  User,
  Settings,
  LogOut,
  UserPlus,
  Heart
} from 'lucide-react';

export const Navbar = ({
  onOpenImportModal,
  onExportBackup,
  recordCount = 0,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logo, setLogo] = useState('');
  const [appTitle, setAppTitle] = useState('স্মার্ট পরিবার ডাইরেক্টরি ও সমাজ কল্যাণ নেটওয়ার্ক');
  const [foundationName, setFoundationName] = useState('অলি মিয়া সমাজ কল্যাণ পরিষদ');
  const [address, setAddress] = useState('উত্তর গোলিন্দর বীর, ৯নং ওয়ার্ড, পটিয়া চট্টগ্রাম');

  useEffect(() => {
    const updateSettings = () => {
      const settings = getAppSettings();
      if (settings) {
        setLogo(settings.logo || '');
        if (settings.appTitle) setAppTitle(settings.appTitle);
        if (settings.foundationName) setFoundationName(settings.foundationName);
        if (settings.address) setAddress(settings.address);
      }
    };
    updateSettings();

    window.addEventListener('omskp_settings_updated', updateSettings);
    return () => {
      window.removeEventListener('omskp_settings_updated', updateSettings);
    };
  }, []);

  const handleLogout = async () => {
    await signOut();
    router.push('/signin');
  };

  const isLoggedIn = !!session?.user;

  return (
    <>
      <header className="bg-[#0F2C59] text-white sticky top-0 z-50 shadow-md border-b-4 border-[#1B8A44]">
        {/* Decorative Diagonal Green Accents in Top Right */}
        <div className="absolute top-0 right-0 w-36 h-full overflow-hidden pointer-events-none hidden sm:block">
          <div className="absolute -top-6 -right-6 w-32 h-20 bg-[#1B8A44] transform rotate-45 shadow-sm"></div>
          <div className="absolute -top-12 -right-2 w-32 h-16 bg-[#62C255] transform rotate-45 opacity-90"></div>
        </div>

        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-between py-2.5 sm:py-3.5 gap-2">

            {/* Logo Brand Title */}
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 sm:gap-3.5 group min-w-0"
            >
              {/* Circular Crest Logo */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-13 md:h-13 rounded-full bg-white border-2 border-[#1B8A44] flex items-center justify-center p-0.5 sm:p-1 shadow-md group-hover:scale-105 transition-transform flex-shrink-0 overflow-hidden">
                {logo ? (
                  <img src={logo} alt="Logo" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <div className="w-full h-full rounded-full border border-dashed border-[#0F2C59] flex flex-col items-center justify-center text-center">
                    <HeartHandshake className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#1B8A44]" />
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-lg md:text-xl font-black text-white tracking-tight sm:tracking-wide font-serif leading-tight truncate">
                  {appTitle}
                </h1>
                <p className="text-[10px] sm:text-xs text-emerald-200 font-sans truncate">
                  {address}
                </p>
              </div>
            </Link>

            {/* Action Tools & Backup Shortcuts */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              {onExportBackup && (
                <button
                  onClick={onExportBackup}
                  className="p-2 sm:px-3.5 sm:py-1.5 text-[11px] sm:text-xs font-semibold bg-[#1B8A44] hover:bg-[#156d35] text-white rounded-lg border border-emerald-400/40 flex items-center gap-1 transition cursor-pointer shadow-xs min-w-[36px] min-h-[36px] sm:min-w-0 sm:min-h-0 justify-center"
                  title="সকল ডেটাবেজ ব্যাকআপ (JSON) ডাউনলোড করুন"
                >
                  <Download size={15} />
                  <span className="hidden sm:inline">ব্যাকআপ (JSON)</span>
                </button>
              )}
              {onOpenImportModal && (
                <button
                  onClick={onOpenImportModal}
                  className="p-2 sm:px-3.5 sm:py-1.5 text-[11px] sm:text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 flex items-center gap-1 transition cursor-pointer min-w-[36px] min-h-[36px] sm:min-w-0 sm:min-h-0 justify-center"
                  title="ব্যাকআপ ফাইল ইমপোর্ট করুন"
                >
                  <Upload size={15} />
                  <span className="hidden sm:inline">ইমপোর্ট</span>
                </button>
              )}

              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer border border-white/20"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Navigation Tabs (Desktop view) */}
          <div className="hidden md:flex overflow-x-auto items-center justify-between gap-1.5 sm:gap-2 border-t border-white/10 py-2 scrollbar-none max-w-full">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <Link
                href="/"
                className={`px-3 sm:px-3.5 py-2 rounded-lg text-xs md:text-sm font-bold flex items-center gap-1.5 whitespace-nowrap transition min-h-[38px] ${pathname === '/'
                  ? 'bg-[#1B8A44] text-white shadow-md border border-[#62C255]/50'
                  : 'text-emerald-100 hover:bg-white/10 hover:text-white'
                  }`}
              >
                <Home size={15} />
                <span>হোম</span>
              </Link>

              <Link
                href="/member"
                className={`px-3 sm:px-3.5 py-2 rounded-lg text-xs md:text-sm font-bold flex items-center gap-1.5 whitespace-nowrap transition min-h-[38px] ${pathname === '/member'
                  ? 'bg-[#1B8A44] text-white shadow-md border border-[#62C255]/50'
                  : 'text-emerald-100 hover:bg-white/10 hover:text-white'
                  }`}
              >
                <Search size={15} />
                <span>অনুসন্ধান ও তালিকা</span>
                {recordCount > 0 && (
                  <span className="ml-0.5 bg-[#0F2C59] text-[#62C255] text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-0.5 rounded-full font-mono font-bold border border-[#1B8A44]">
                    {recordCount}
                  </span>
                )}
              </Link>

              <Link
                href="/new-form"
                className={`px-3 sm:px-3.5 py-2 rounded-lg text-xs md:text-sm font-bold flex items-center gap-1.5 whitespace-nowrap transition min-h-[38px] ${pathname === '/new-form'
                  ? 'bg-[#1B8A44] text-white shadow-md border border-[#62C255]/50'
                  : 'text-emerald-100 hover:bg-white/10 hover:text-white'
                  }`}
              >
                <PlusCircle size={15} />
                <span>নতুন ইনপুট ফরম</span>
              </Link>

              <Link
                href="/admin"
                className={`px-3 sm:px-3.5 py-2 rounded-lg text-xs md:text-sm font-bold flex items-center gap-1.5 whitespace-nowrap transition min-h-[38px] ${pathname === '/admin'
                  ? 'bg-[#1B8A44] text-white shadow-md border border-[#62C255]/50'
                  : 'text-emerald-100 hover:bg-white/10 hover:text-white'
                  }`}
              >
                <ShieldCheck size={15} />
                <span>অ্যাডমিন ড্যাশবোর্ড</span>
              </Link>

              <Link
                href="/admin/profile"
                className={`px-3 sm:px-3.5 py-2 rounded-lg text-xs md:text-sm font-bold flex items-center gap-1.5 whitespace-nowrap transition min-h-[38px] ${pathname === '/admin/profile'
                  ? 'bg-[#1B8A44] text-white shadow-md border border-[#62C255]/50'
                  : 'text-emerald-100 hover:bg-white/10 hover:text-white'
                  }`}
              >
                <User size={15} />
                <span>প্রোফাইল</span>
              </Link>

              <Link
                href="/admin/settings"
                className={`px-3 sm:px-3.5 py-2 rounded-lg text-xs md:text-sm font-bold flex items-center gap-1.5 whitespace-nowrap transition min-h-[38px] ${pathname === '/admin/settings'
                  ? 'bg-[#1B8A44] text-white shadow-md border border-[#62C255]/50'
                  : 'text-emerald-100 hover:bg-white/10 hover:text-white'
                  }`}
              >
                <Settings size={15} />
                <span>সেটিংস</span>
              </Link>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-1.5">
              {!isLoggedIn ? (
                <div className="flex items-center gap-1.5">
                  <Link
                    href="/signin"
                    className={`px-3.5 py-2 rounded-lg text-xs md:text-sm font-bold flex items-center gap-1.5 whitespace-nowrap transition min-h-[38px] bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs`}
                  >
                    <LogIn size={15} />
                    <span>লগইন</span>
                  </Link>
                  <Link
                    href="/signup"
                    className={`px-3 py-2 rounded-lg text-xs md:text-sm font-bold flex items-center gap-1.5 whitespace-nowrap transition min-h-[38px] bg-white/10 hover:bg-white/20 text-white border border-white/20`}
                  >
                    <UserPlus size={15} />
                    <span>রেজিস্ট্রেশন</span>
                  </Link>
                </div>
              ) : (
                <button
                  onClick={handleLogout}
                  className="px-3.5 py-2 rounded-lg text-xs md:text-sm font-bold flex items-center gap-1.5 whitespace-nowrap transition min-h-[38px] bg-rose-600/80 hover:bg-rose-700 text-white cursor-pointer shadow-xs"
                >
                  <LogOut size={15} />
                  <span>লগআউট</span>
                </button>
              )}
            </div>
          </div>

          {/* Mobile Collapsible Dropdown Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-white/10 py-3 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`w-full px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-between transition min-h-[44px] ${pathname === '/'
                  ? 'bg-[#1B8A44] text-white shadow-md'
                  : 'text-emerald-100 bg-white/5 hover:bg-white/10'
                  }`}
              >
                <div className="flex items-center gap-2.5">
                  <Home size={18} />
                  <span>হোম পেজ</span>
                </div>
              </Link>

              <Link
                href="/member"
                onClick={() => setMobileMenuOpen(false)}
                className={`w-full px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-between transition min-h-[44px] ${pathname === '/member'
                  ? 'bg-[#1B8A44] text-white shadow-md'
                  : 'text-emerald-100 bg-white/5 hover:bg-white/10'
                  }`}
              >
                <div className="flex items-center gap-2.5">
                  <Heart size={18} />
                  <span>রক্তদাতা খুজুন</span>
                </div>
                {recordCount > 0 && (
                  <span className="bg-[#0F2C59] text-[#62C255] text-xs px-2.5 py-0.5 rounded-full font-mono font-bold border border-[#1B8A44]">
                    {recordCount} টি
                  </span>
                )}
              </Link>

              <Link
                href="/new-form"
                onClick={() => setMobileMenuOpen(false)}
                className={`w-full px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2.5 transition min-h-[44px] ${pathname === '/new-form'
                  ? 'bg-[#1B8A44] text-white shadow-md'
                  : 'text-emerald-100 bg-white/5 hover:bg-white/10'
                  }`}
              >
                <PlusCircle size={18} />
                <span>নতুন তথ্য ইনপুট ফরম</span>
              </Link>

              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className={`w-full px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2.5 transition min-h-[44px] ${pathname === '/admin'
                  ? 'bg-[#1B8A44] text-white shadow-md'
                  : 'text-emerald-100 bg-white/5 hover:bg-white/10'
                  }`}
              >
                <ShieldCheck size={18} />
                <span>অ্যাডমিন ড্যাশবোর্ড</span>
              </Link>

              <Link
                href="/admin/profile"
                onClick={() => setMobileMenuOpen(false)}
                className={`w-full px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2.5 transition min-h-[44px] ${pathname === '/admin/profile'
                  ? 'bg-[#1B8A44] text-white shadow-md'
                  : 'text-emerald-100 bg-white/5 hover:bg-white/10'
                  }`}
              >
                <User size={18} />
                <span>প্রোফাইল (Profile)</span>
              </Link>

              <Link
                href="/admin/settings"
                onClick={() => setMobileMenuOpen(false)}
                className={`w-full px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2.5 transition min-h-[44px] ${pathname === '/admin/settings'
                  ? 'bg-[#1B8A44] text-white shadow-md'
                  : 'text-emerald-100 bg-white/5 hover:bg-white/10'
                  }`}
              >
                <Settings size={18} />
                <span>সেটিংস (Settings)</span>
              </Link>

              {!isLoggedIn ? (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    href="/signin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition min-h-[44px] bg-emerald-600 text-white shadow-md"
                  >
                    <LogIn size={18} />
                    <span>লগইন (Sign In)</span>
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition min-h-[44px] bg-white/10 text-white border border-white/20"
                  >
                    <UserPlus size={18} />
                    <span>রেজিস্ট্রেশন</span>
                  </Link>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2.5 transition min-h-[44px] bg-rose-600/90 text-white shadow-md cursor-pointer mt-1"
                >
                  <LogOut size={18} />
                  <span>লগআউট (Logout)</span>
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Fixed Mobile Bottom Navigation Bar (Phone & Tablet < 768px) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0F2C59] border-t-2 border-[#1B8A44] md:hidden shadow-2xl backdrop-blur-md bg-opacity-95">
        <div className="grid grid-cols-6 h-14">
          <Link
            href="/"
            className={`flex flex-col items-center justify-center gap-0.5 text-[9px] sm:text-[10px] font-bold transition ${pathname === '/' ? 'text-[#62C255] bg-white/10' : 'text-slate-300 hover:text-white'
              }`}
          >
            <Home size={15} />
            <span>হোম</span>
          </Link>

          <Link
            href="/member"
            className={`flex flex-col items-center justify-center gap-0.5 text-[9px] sm:text-[10px] font-bold transition ${pathname === '/member' ? 'text-[#62C255] bg-white/10' : 'text-slate-300 hover:text-white'
              }`}
          >
            <Search size={15} />
            <span>তালিকা</span>
          </Link>

          <Link
            href="/new-form"
            className={`flex flex-col items-center justify-center gap-0.5 text-[9px] sm:text-[10px] font-bold transition ${pathname === '/new-form' ? 'text-[#62C255] bg-white/10' : 'text-slate-300 hover:text-white'
              }`}
          >
            <PlusCircle size={15} />
            <span>নতুন ফরম</span>
          </Link>

          <Link
            href="/admin"
            className={`flex flex-col items-center justify-center gap-0.5 text-[9px] sm:text-[10px] font-bold transition ${pathname === '/admin' ? 'text-[#62C255] bg-white/10' : 'text-slate-300 hover:text-white'
              }`}
          >
            <ShieldCheck size={15} />
            <span>অ্যাডমিন</span>
          </Link>

          <Link
            href="/admin/profile"
            className={`flex flex-col items-center justify-center gap-0.5 text-[9px] sm:text-[10px] font-bold transition ${pathname === '/admin/profile' ? 'text-[#62C255] bg-white/10' : 'text-slate-300 hover:text-white'
              }`}
          >
            <User size={15} />
            <span>প্রোফাইল</span>
          </Link>

          <Link
            href="/admin/settings"
            className={`flex flex-col items-center justify-center gap-0.5 text-[9px] sm:text-[10px] font-bold transition ${pathname === '/admin/settings' ? 'text-[#62C255] bg-white/10' : 'text-slate-300 hover:text-white'
              }`}
          >
            <Settings size={15} />
            <span>সেটিংস</span>
          </Link>
        </div>
      </nav>
    </>
  );
};

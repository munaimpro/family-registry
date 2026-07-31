'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  ChevronRight,
} from 'lucide-react';

/* ─── nav items config ─────────────────────────────────────────── */
const NAV_ITEMS = [
  { href: '/',               label: 'হোম',                  labelFull: 'হোম পেজ',                      Icon: Home        },
  { href: '/member',         label: 'তালিকা',               labelFull: 'রক্তদাতা তালিকা ও অনুসন্ধান', Icon: Search      },
  { href: '/new-form',       label: 'নতুন ফরম',             labelFull: 'নতুন তথ্য ইনপুট ফরম',         Icon: PlusCircle  },
  { href: '/admin',          label: 'অ্যাডমিন',             labelFull: 'অ্যাডমিন ড্যাশবোর্ড',         Icon: ShieldCheck },
  { href: '/admin/profile',  label: 'প্রোফাইল',             labelFull: 'প্রোফাইল (Profile)',           Icon: User        },
  { href: '/admin/settings', label: 'সেটিংস',               labelFull: 'সেটিংস (Settings)',            Icon: Settings    },
];

export const Navbar = ({ onOpenImportModal, onExportBackup, recordCount = 0 }) => {
  const pathname   = usePathname();
  const router     = useRouter();
  const { data: session } = useSession();

  const [drawerOpen, setDrawerOpen]     = useState(false);
  const [logo, setLogo]                 = useState('');
  const [appTitle, setAppTitle]         = useState('স্মার্ট পরিবার ডাইরেক্টরি ও সমাজ কল্যাণ নেটওয়ার্ক');
  const [foundationName, setFoundationName] = useState('অলি মিয়া সমাজ কল্যাণ পরিষদ');
  const [address, setAddress]           = useState('উত্তর গোলিন্দর বীর, ৯নং ওয়ার্ড, পটিয়া চট্টগ্রাম');

  const drawerRef = useRef(null);

  /* settings sync */
  useEffect(() => {
    const sync = () => {
      const s = getAppSettings();
      if (!s) return;
      setLogo(s.logo || '');
      if (s.appTitle)        setAppTitle(s.appTitle);
      if (s.foundationName)  setFoundationName(s.foundationName);
      if (s.address)         setAddress(s.address);
    };
    sync();
    window.addEventListener('omskp_settings_updated', sync);
    return () => window.removeEventListener('omskp_settings_updated', sync);
  }, []);

  /* close drawer on route change */
  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  /* close drawer on outside click */
  useEffect(() => {
    if (!drawerOpen) return;
    const handler = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        setDrawerOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [drawerOpen]);

  /* lock body scroll when drawer open */
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  const handleLogout = async () => {
    setDrawerOpen(false);
    await signOut();
    router.push('/signin');
  };

  const isLoggedIn = !!session?.user;

  /* ── helpers ── */
  const navLinkClass = (href) =>
    `px-3 py-2 rounded-lg text-xs xl:text-sm font-bold flex items-center gap-1.5 whitespace-nowrap transition-all duration-150 min-h-[36px] ${
      pathname === href
        ? 'bg-[#1B8A44] text-white shadow-md border border-[#62C255]/50'
        : 'text-emerald-100 hover:bg-white/10 hover:text-white'
    }`;

  return (
    <>
      {/* ════════════════════════════════════════════════
          TOP HEADER  (fixed, full-width)
      ════════════════════════════════════════════════ */}
      <header
        id="main-navbar"
        className="bg-[#0F2C59] text-white fixed top-0 left-0 right-0 z-50 shadow-lg border-b-4 border-[#1B8A44]"
      >
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-28 h-full overflow-hidden pointer-events-none hidden sm:block">
          <div className="absolute -top-5 -right-5 w-28 h-16 bg-[#1B8A44] rotate-45 shadow-sm" />
          <div className="absolute -top-10 right-0 w-28 h-14 bg-[#62C255] rotate-45 opacity-80" />
        </div>

        <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8 relative z-10">

          {/* ── Row 1: logo + tools + hamburger ── */}
          <div className="flex items-center justify-between py-2.5 sm:py-3 gap-2">

            {/* Logo & Title */}
            <Link
              href="/"
              className="flex items-center gap-2 sm:gap-3 group min-w-0 flex-1"
            >
              {/* Circular logo */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-white border-2 border-[#1B8A44] flex items-center justify-center p-0.5 shadow-md group-hover:scale-105 transition-transform flex-shrink-0 overflow-hidden">
                {logo ? (
                  <img src={logo} alt="Logo" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <div className="w-full h-full rounded-full border border-dashed border-[#0F2C59] flex items-center justify-center">
                    <HeartHandshake className="w-4 h-4 sm:w-5 sm:h-5 text-[#1B8A44]" />
                  </div>
                )}
              </div>

              {/* Text block */}
              <div className="min-w-0 flex-1">
                <h1 className="text-[11px] xs:text-xs sm:text-base md:text-lg font-black text-white tracking-tight leading-tight line-clamp-2 sm:line-clamp-1">
                  {appTitle}
                </h1>
                <p className="text-[9px] sm:text-[11px] text-emerald-200 truncate hidden xs:block">
                  {address}
                </p>
              </div>
            </Link>

            {/* Right-side tool buttons + hamburger */}
            <div className="flex items-center gap-1.5 flex-shrink-0">

              {/* Export backup */}
              {onExportBackup && (
                <button
                  onClick={onExportBackup}
                  className="p-2 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs font-semibold bg-[#1B8A44] hover:bg-[#156d35] text-white rounded-lg border border-emerald-400/40 flex items-center gap-1 transition cursor-pointer min-w-[36px] min-h-[36px] justify-center"
                  title="সকল ডেটাবেজ ব্যাকআপ (JSON) ডাউনলোড করুন"
                >
                  <Download size={15} />
                  <span className="hidden sm:inline">ব্যাকআপ</span>
                </button>
              )}

              {/* Import */}
              {onOpenImportModal && (
                <button
                  onClick={onOpenImportModal}
                  className="p-2 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 flex items-center gap-1 transition cursor-pointer min-w-[36px] min-h-[36px] justify-center"
                  title="ব্যাকআপ ফাইল ইমপোর্ট করুন"
                >
                  <Upload size={15} />
                  <span className="hidden sm:inline">ইমপোর্ট</span>
                </button>
              )}

              {/* Hamburger — visible on all screens < lg */}
              <button
                id="navbar-hamburger"
                onClick={() => setDrawerOpen((p) => !p)}
                className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer border border-white/20 relative z-10"
                aria-label={drawerOpen ? 'মেনু বন্ধ করুন' : 'মেনু খুলুন'}
                aria-expanded={drawerOpen}
              >
                <span
                  className="block transition-all duration-300"
                  style={{ transform: drawerOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
                >
                  {drawerOpen ? <X size={20} /> : <Menu size={20} />}
                </span>
              </button>
            </div>
          </div>

          {/* ── Row 2: Desktop nav tabs (lg+) ── */}
          <div className="hidden lg:flex items-center justify-between gap-2 border-t border-white/10 py-2">

            {/* Nav links */}
            <div className="flex items-center gap-1 flex-wrap">
              {NAV_ITEMS.map(({ href, labelFull, Icon }) => (
                <Link key={href} href={href} className={navLinkClass(href)}>
                  <Icon size={14} />
                  <span>{labelFull}</span>
                  {href === '/member' && recordCount > 0 && (
                    <span className="ml-0.5 bg-[#0F2C59] text-[#62C255] text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold border border-[#1B8A44]">
                      {recordCount}
                    </span>
                  )}
                </Link>
              ))}
            </div>

            {/* Auth buttons */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {!isLoggedIn ? (
                <>
                  <Link
                    href="/signin"
                    className="px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition min-h-[36px] bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                  >
                    <LogIn size={14} />
                    <span>লগইন</span>
                  </Link>
                  <Link
                    href="/signup"
                    className="px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition min-h-[36px] bg-white/10 hover:bg-white/20 text-white border border-white/20"
                  >
                    <UserPlus size={14} />
                    <span>রেজিস্ট্রেশন</span>
                  </Link>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition min-h-[36px] bg-rose-600/80 hover:bg-rose-700 text-white cursor-pointer shadow-sm"
                >
                  <LogOut size={14} />
                  <span>লগআউট</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════════════════
          MOBILE / TABLET DRAWER  (fixed overlay, lg:hidden)
          Slides down from just below the header.
      ════════════════════════════════════════════════ */}

      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={() => setDrawerOpen(false)}
        className={`lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        id="mobile-drawer"
        className={`lg:hidden fixed left-0 right-0 top-0 z-[45] bg-[#0F2C59] shadow-2xl border-b-2 border-[#1B8A44] transition-transform duration-300 ease-in-out ${
          drawerOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
        style={{ paddingTop: 'var(--navbar-height, 68px)' }}
      >
        {/* Close bar at top */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
          <span className="text-emerald-200 text-xs font-semibold tracking-wide uppercase">নেভিগেশন মেনু</span>
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-1.5 text-white hover:bg-white/10 rounded-lg transition cursor-pointer"
            aria-label="মেনু বন্ধ করুন"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="px-3 py-3 space-y-1.5 overflow-y-auto max-h-[calc(100dvh-120px)]">
          {NAV_ITEMS.map(({ href, labelFull, Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setDrawerOpen(false)}
              className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-bold transition min-h-[48px] ${
                pathname === href
                  ? 'bg-[#1B8A44] text-white shadow-md'
                  : 'text-emerald-100 bg-white/5 hover:bg-white/10 active:bg-white/15'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} />
                <span>{labelFull}</span>
              </div>
              <div className="flex items-center gap-2">
                {href === '/member' && recordCount > 0 && (
                  <span className="bg-[#0F2C59] text-[#62C255] text-[11px] px-2 py-0.5 rounded-full font-mono font-bold border border-[#1B8A44]">
                    {recordCount}
                  </span>
                )}
                <ChevronRight size={15} className="text-white/40" />
              </div>
            </Link>
          ))}

          {/* Divider */}
          <div className="border-t border-white/10 my-2" />

          {/* Auth section */}
          {!isLoggedIn ? (
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/signin"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition min-h-[48px] bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
              >
                <LogIn size={18} />
                <span>লগইন</span>
              </Link>
              <Link
                href="/signup"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition min-h-[48px] bg-white/10 hover:bg-white/20 text-white border border-white/20"
              >
                <UserPlus size={18} />
                <span>রেজিস্ট্রেশন</span>
              </Link>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition min-h-[48px] bg-rose-600/90 hover:bg-rose-700 text-white shadow-md cursor-pointer"
            >
              <LogOut size={18} />
              <span>লগআউট (Logout)</span>
            </button>
          )}
        </nav>
      </div>

      {/* ════════════════════════════════════════════════
          BOTTOM TAB BAR  (phones / small tablets < md)
      ════════════════════════════════════════════════ */}
      <nav
        id="bottom-nav"
        className="fixed bottom-0 left-0 right-0 z-50 bg-[#0F2C59] border-t-2 border-[#1B8A44] md:hidden shadow-2xl"
        aria-label="Bottom navigation"
      >
        <div className="grid grid-cols-6 h-[56px]">
          {NAV_ITEMS.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center gap-0.5 text-[9px] xs:text-[10px] font-bold transition-colors duration-150 ${
                pathname === href
                  ? 'text-[#62C255] bg-white/10'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={16} />
              <span className="leading-none">{label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
};

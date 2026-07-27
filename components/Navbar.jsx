'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Search, 
  ShieldCheck, 
  PlusCircle, 
  Download, 
  Upload,
  HeartHandshake
} from 'lucide-react';

export const Navbar = ({
  onOpenImportModal,
  onExportBackup,
  recordCount = 0,
}) => {
  const pathname = usePathname();

  return (
    <header className="bg-[#0F2C59] text-white sticky top-0 z-40 shadow-md border-b-4 border-[#1B8A44]">
      {/* Decorative Diagonal Green Accents in Top Right */}
      <div className="absolute top-0 right-0 w-36 h-full overflow-hidden pointer-events-none hidden sm:block">
        <div className="absolute -top-6 -right-6 w-32 h-20 bg-[#1B8A44] transform rotate-45 shadow-sm"></div>
        <div className="absolute -top-12 -right-2 w-32 h-16 bg-[#62C255] transform rotate-45 opacity-90"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand Title */}
          <Link 
            href="/"
            className="flex items-center gap-3.5 group"
          >
            {/* Circular Crest Logo */}
            <div className="w-13 h-13 rounded-full bg-white border-2 border-[#1B8A44] flex items-center justify-center p-1 shadow-md group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-full border border-dashed border-[#0F2C59] flex flex-col items-center justify-center text-center">
                <HeartHandshake className="w-6 h-6 text-[#1B8A44]" />
              </div>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-white tracking-wide font-serif leading-tight">
                অলি মিয়া সমাজ কল্যাণ পরিষদ
              </h1>
              <p className="text-xs text-emerald-200 font-sans">
                অলি মিয়া মিশ্রির বাড়ি, উত্তর গোলিন্দর বীর, ৯নং ওয়ার্ড, পটিয়া চট্টগ্রাম
              </p>
            </div>
          </Link>

          {/* Action Tools & Backup Shortcuts */}
          <div className="hidden md:flex items-center gap-2">
            {onExportBackup && (
              <button
                onClick={onExportBackup}
                className="px-3.5 py-1.5 text-xs font-semibold bg-[#1B8A44] hover:bg-[#156d35] text-white rounded-lg border border-emerald-400/40 flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                title="সকল ডেটাবেজ ব্যাকআপ (JSON) ডাউনলোড করুন"
              >
                <Download size={14} /> ব্যাকআপ (JSON)
              </button>
            )}
            {onOpenImportModal && (
              <button
                onClick={onOpenImportModal}
                className="px-3.5 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 flex items-center gap-1.5 transition cursor-pointer"
                title="ব্যাকআপ ফাইল ইমপোর্ট করুন"
              >
                <Upload size={14} /> ইমপোর্ট
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs using App Router Routes */}
        <div className="flex overflow-x-auto gap-2 border-t border-white/10 py-2.5 scrollbar-none">
          <Link
            href="/"
            className={`px-4 py-2 rounded-lg text-xs md:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition ${
              pathname === '/'
                ? 'bg-[#1B8A44] text-white shadow-md border border-[#62C255]/50'
                : 'text-emerald-100 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Search size={16} />
            পরিবার অনুসন্ধান ও প্রোফাইল
            {recordCount > 0 && (
              <span className="ml-1 bg-[#0F2C59] text-[#62C255] text-[11px] px-2 py-0.5 rounded-full font-mono font-bold border border-[#1B8A44]">
                {recordCount}
              </span>
            )}
          </Link>

          <Link
            href="/new-form"
            className={`px-4 py-2 rounded-lg text-xs md:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition ${
              pathname === '/new-form'
                ? 'bg-[#1B8A44] text-white shadow-md border border-[#62C255]/50'
                : 'text-emerald-100 hover:bg-white/10 hover:text-white'
            }`}
          >
            <PlusCircle size={16} />
            নতুন তথ্য ইনপুট ফরম
          </Link>

          <Link
            href="/admin"
            className={`px-4 py-2 rounded-lg text-xs md:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition ${
              pathname === '/admin'
                ? 'bg-[#1B8A44] text-white shadow-md border border-[#62C255]/50'
                : 'text-emerald-100 hover:bg-white/10 hover:text-white'
            }`}
          >
            <ShieldCheck size={16} />
            অ্যাডমিন ড্যাশবোর্ড
          </Link>
        </div>
      </div>
    </header>
  );
};

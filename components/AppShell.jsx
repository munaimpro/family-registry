'use client';

import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from '../lib/AppContext';
import dynamic from 'next/dynamic';
import { PrintableForm } from './PrintableForm';
import { ImportModal } from './ImportModal';
import { Toaster } from 'react-hot-toast';
import { HeartHandshake } from 'lucide-react';
import { getAppSettings } from '../lib/storage';

const Navbar = dynamic(() => import('./Navbar').then(mod => ({ default: mod.Navbar })), {
  ssr: false,
});

function ShellContent({ children }) {
  const {
    records,
    refreshRecords,
    printingRecord,
    setPrintingRecord,
    isImportOpen,
    setIsImportOpen,
    handleExportBackup
  } = useApp();

  const [foundationName, setFoundationName] = useState('অলি মিয়া সমাজ কল্যাণ পরিষদ');
  const [address, setAddress] = useState('উত্তর গৌবিন্দারখীল, ৯নং ওয়ার্ড, পটিয়া চট্টগ্রাম');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    const updateSettings = () => {
      const settings = getAppSettings();
      if (settings) {
        if (settings.foundationName) setFoundationName(settings.foundationName);
        if (settings.address) setAddress(settings.address);
      }
    };
    updateSettings();

    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    const handleCopy = (e) => {
      const tag = e.target?.tagName?.toLowerCase();
      if (tag !== 'input' && tag !== 'textarea') {
        e.preventDefault();
      }
    };

    window.addEventListener('omskp_settings_updated', updateSettings);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('omskp_settings_updated', updateSettings);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F4F6F4] text-slate-800 flex flex-col font-sans selection:bg-[#1B8A44] selection:text-white">
      {/* Toast Notifications */}
      {mounted && (
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 3000,
            style: {
              background: '#ffffff',
              color: '#1e293b',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              borderRadius: '0.75rem',
              padding: '12px 16px',
              fontSize: '14px',
              fontWeight: 500,
            },
          }}
        />
      )}

      {/* Main Navbar with Next.js App Router Navigation */}
      <Navbar
        onOpenImportModal={() => setIsImportOpen(true)}
        onExportBackup={handleExportBackup}
        recordCount={records.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-20 md:pb-8">
        {/* Printable Modal View Overlay */}
        {printingRecord && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 p-2 sm:p-4 md:p-8 flex items-start justify-center backdrop-blur-xs">
            <div className="w-full max-w-4xl bg-white rounded-2xl border border-slate-300 p-2 shadow-2xl relative my-4 sm:my-8">
              <PrintableForm
                record={printingRecord}
                onClose={() => setPrintingRecord(null)}
              />
            </div>
          </div>
        )}

        {children}
      </main>

      {/* Import JSON Modal */}
      <ImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImportSuccess={() => {
          refreshRecords();
        }}
      />

      {/* Footer */}
      <footer className="bg-[#0F2C59] border-t-2 border-[#1B8A44] py-5 text-slate-200 print:hidden mb-14 md:mb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">

          {/* Top Section: Foundation Name & Address side-by-side on desktop */}
          <div className="flex flex-col lg:flex-row items-center gap-2 sm:gap-4 text-xs justify-between">
            <div className="flex items-center gap-2 text-emerald-300 font-serif font-bold text-sm tracking-wide">
              <HeartHandshake size={18} className="text-emerald-400 shrink-0" />
              <span>{foundationName}</span>
            </div>

            <p className="text-slate-300/90 text-xs">
              &copy; {new Date().getFullYear()}  • সর্বস্বত্ব সংরক্ষিত
            </p>
          </div>

          {/* Bottom Section: Developer Credit at the end */}
          <div className="text-[11px] text-slate-300/80 tracking-width font-medium flex items-center justify-center lg:justify-end gap-1.5 shrink-0 mt-4 w-full border-t-1 border-[#1F3d6a] pt-3">
            <span>Developed by</span>
            <span className="text-emerald-400 font-semibold"><a href="https://munaimpro.vercel.app" target='_blank'>{process.env.NEXT_PUBLIC_DEVELOPER_NAME}</a></span> | <span>August 8, 2026</span>
          </div>

        </div>
      </footer>
    </div>
  );
}

export function AppShell({ children }) {
  return (
    <AppProvider>
      <ShellContent>{children}</ShellContent>
    </AppProvider>
  );
}

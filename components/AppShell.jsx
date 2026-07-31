'use client';

import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from '../lib/AppContext';
import { Navbar } from './Navbar';
import { PrintableForm } from './PrintableForm';
import { ImportModal } from './ImportModal';
import { Toaster } from 'react-hot-toast';
import { HeartHandshake } from 'lucide-react';
import { getAppSettings } from '../lib/storage';

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
  const [address, setAddress] = useState('উত্তর গোলিন্দর বীর, ৯নং ওয়ার্ড, পটিয়া চট্টগ্রাম');
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

    window.addEventListener('omskp_settings_updated', updateSettings);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('omskp_settings_updated', updateSettings);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F4F6F4] text-slate-800 flex flex-col font-sans selection:bg-[#1B8A44] selection:text-white">
      {/* Toast Notifications */}
      {mounted && (
        <Toaster position="top-right" />
      )}

      {/* Main Navbar with Next.js App Router Navigation */}
      <Navbar
        onOpenImportModal={() => setIsImportOpen(true)}
        onExportBackup={handleExportBackup}
        recordCount={records.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 pt-[68px] lg:pt-[116px] pb-[72px] md:pb-8">
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
      <footer className="bg-[#0F2C59] border-t-2 border-[#1B8A44] py-6 text-center text-xs text-slate-200 print:hidden mb-14 md:mb-0">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2 text-emerald-300 font-serif font-bold">
            <HeartHandshake size={18} />
            {foundationName}
          </div>
          <p className="text-emerald-100">
            {address} • সর্বস্বত্ব সংরক্ষিত
          </p>
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

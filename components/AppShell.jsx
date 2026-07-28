'use client';

import React from 'react';
import { AppProvider, useApp } from '../lib/AppContext';
import { Navbar } from './Navbar';
import { PrintableForm } from './PrintableForm';
import { ImportModal } from './ImportModal';
import { ToastContainer } from 'react-toastify';
import { HeartHandshake } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-[#F4F6F4] text-slate-800 flex flex-col font-sans selection:bg-[#1B8A44] selection:text-white">
      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

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
      <footer className="bg-[#0F2C59] border-t-2 border-[#1B8A44] py-6 text-center text-xs text-slate-200 print:hidden mb-14 md:mb-0">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2 text-emerald-300 font-serif font-bold">
            <HeartHandshake size={18} />
            অলি মিয়া সমাজ কল্যাণ পরিষদ (স্থাপিত: ২০১০)
          </div>
          <p className="text-emerald-100">
            উত্তর গোলিন্দর বীর, ৯নং ওয়ার্ড, পশ্চিম পৌর এলাকা, পটিয়া চট্টগ্রাম • সর্বস্বত্ব সংরক্ষিত
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

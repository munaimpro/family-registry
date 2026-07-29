'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-[#F4F6F4]">
      <h2 className="text-2xl font-bold text-[#0F2C59] mb-2 font-serif">৪০৪ - পেজটি পাওয়া যায়নি</h2>
      <p className="text-sm text-slate-600 mb-6">আপনার খোঁজা পৃষ্ঠাটি বা ফাইলটি খুঁজে পাওয়া যাচ্ছে না।</p>
      <Link
        href="/"
        className="px-5 py-2.5 bg-[#1B8A44] text-white font-bold text-sm rounded-xl hover:bg-emerald-700 transition"
      >
        হোম পেজে ফিরে যান
      </Link>
    </div>
  );
}


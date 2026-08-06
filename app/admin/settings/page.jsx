'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '../../../lib/auth-client';
import { getAppSettings, saveAppSettings } from '../../../lib/storage';
import { toast } from 'react-hot-toast';
import { Settings, Upload, CheckCircle2, ArrowLeft, Trash2, HeartHandshake } from 'lucide-react';
import Link from 'next/link';

export default function AdminSettingsPage() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [logo, setLogo] = useState('');
  const [appTitle, setAppTitle] = useState('স্মার্ট পরিবার ডাইরেক্টরি ও সমাজ কল্যাণ নেটওয়ার্ক');
  const [foundationName, setFoundationName] = useState('অলি মিয়া সমাজ কল্যাণ পরিষদ');
  const [formTitle, setFormTitle] = useState('পরিবার শুমারি ও তথ্য নিবন্ধন ফরম');
  const [address, setAddress] = useState('উত্তর গোলিন্দর বীর, ৯নং ওয়ার্ড, পটিয়া, চট্টগ্রাম');
  const [hotline, setHotline] = useState('০১৮১৯-০০০০০০');

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setMounted(true);
    const settings = getAppSettings();
    if (settings) {
      if (settings.logo) setLogo(settings.logo);
      if (settings.appTitle) setAppTitle(settings.appTitle);
      if (settings.foundationName) setFoundationName(settings.foundationName);
      if (settings.formTitle) setFormTitle(settings.formTitle);
      if (settings.address) setAddress(settings.address);
      if (settings.hotline) setHotline(settings.hotline);
    }
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      const errMsg = 'ছবির সাইজ ২ এমবির কম হতে হবে।';
      setError(errMsg);
      toast.error(errMsg);
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result;
      if (typeof result === 'string') {
        setLogo(result);
        setError('');
        toast.success('লোগো সিলেক্ট করা হয়েছে!');
      }
    };
    reader.onerror = () => {
      const errMsg = 'ফাইল পড়তে সমস্যা হয়েছে।';
      setError(errMsg);
      toast.error(errMsg);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e) => {
    e.preventDefault();
    try {
      saveAppSettings({ logo, appTitle, foundationName, formTitle, address, hotline });
      setSuccess(true);
      toast.success('সেটিংস সফলভাবে সংরক্ষণ করা হয়েছে!');
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      const errMsg = 'সেটিংস সংরক্ষণ করতে সমস্যা হয়েছে।';
      setError(errMsg);
      toast.error(errMsg);
    }
  };

  const handleRemoveLogo = () => {
    setLogo('');
  };

  if (!mounted || isPending) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500 text-sm animate-pulse font-medium">লোড হচ্ছে...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-[#1B8A44] transition bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-xs"
          >
            <ArrowLeft size={16} /> হোম পেজে ফিরে যান
          </Link>
          <Link
            href="/admin/profile"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-[#1B8A44] transition bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-xs"
          >
            অ্যাডমিন প্রোফাইল
          </Link>
        </div>

        {/* Settings Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-[#0F2C59] p-6 text-white flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 border border-emerald-400/30">
              <Settings size={26} />
            </div>
            <div>
              <h1 className="text-xl font-bold">সিস্টেম ও লোগো সেটিংস (Settings)</h1>
              <p className="text-xs text-slate-300">সাইট এবং ইনপুট ফরমের জন্য সাধারণ লোগো পরিবর্তন করুন</p>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-[#1B8A44] text-xs rounded-xl font-medium flex items-center gap-2">
                <CheckCircle2 size={16} /> সেটিংস সফলভাবে সংরক্ষিত হয়েছে! সাইট ও ইনপুট ফরে লোগো আপডেট করা হয়েছে।
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  সাইট এবং ফরমের লোগো (Site & Form Logo)
                </label>
                <p className="text-xs text-slate-500 mb-4">
                  এই লোগোটি স্বয়ংক্রিয়ভাবে মূল নেভবার, ইনপুট ফরম এবং প্রিন্টেবল ফর্মে প্রদর্শিত হবে।
                </p>

                {/* Logo Preview & Upload Box */}
                <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl">
                  <div className="w-24 h-24 rounded-full bg-white border-4 border-[#1B8A44] flex items-center justify-center shadow-md overflow-hidden relative flex-shrink-0">
                    {logo ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={logo} alt="Site Logo" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center p-1">
                        <HeartHandshake className="w-8 h-8 text-[#1B8A44]" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 text-center sm:text-left flex-1">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <label className="px-4 py-2.5 bg-[#1B8A44] hover:bg-[#156d35] text-white font-bold text-xs rounded-xl transition shadow-sm cursor-pointer inline-flex items-center gap-2">
                        <Upload size={16} /> লোগো আপলোড করুন
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>

                      {logo && (
                        <button
                          type="button"
                          onClick={handleRemoveLogo}
                          className="px-3 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs rounded-xl transition border border-rose-200 inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Trash2 size={15} /> রিমুভ করুন
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      সাজেস্টেড ফরম্যাট: PNG, JPG বা SVG (সর্বোচ্চ ২ MB, গোল আকৃতির জন্য স্কয়ার ছবি শ্রেয়)
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">অথবা লোগো ইমেজ URL (Image URL)</label>
                <input
                  type="url"
                  value={logo.startsWith('data:') ? '' : logo}
                  onChange={(e) => setLogo(e.target.value)}
                  placeholder="https://example.com/logo.png"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-[#1B8A44] focus:outline-hidden font-mono"
                />
              </div>

              {/* App Title */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1">
                  অ্যাপের টাইটেল (App Title)
                </label>
                <p className="text-xs text-slate-500 mb-2">
                  সাইটের সাধারণ শিরোনাম যা হেডার নেভবারে লোগোর পাশে প্রদর্শিত হবে।
                </p>
                <input
                  type="text"
                  value={appTitle}
                  onChange={(e) => setAppTitle(e.target.value)}
                  placeholder="যেমন: স্মার্ট পরিবার ডাইরেক্টরি ও সমাজ কল্যাণ নেটওয়ার্ক"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-[#1B8A44] focus:outline-hidden font-sans font-medium"
                />
              </div>

              {/* Foundation Name */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1">
                  ফাউন্ডেশনের নাম (Foundation Name)
                </label>
                <p className="text-xs text-slate-500 mb-2">
                  সংগঠন বা ফাউন্ডেশনের নাম যা হোম পেজের হিরো সেকশনের মূল শিরোনামে প্রদর্শিত হবে।
                </p>
                <input
                  type="text"
                  value={foundationName}
                  onChange={(e) => setFoundationName(e.target.value)}
                  placeholder="যেমন: অলি মিয়া সমাজ কল্যাণ পরিষদ"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-[#1B8A44] focus:outline-hidden font-sans font-medium"
                />
              </div>

              {/* Form Title */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1">
                  ফরমের টাইটেল (Form Title)
                </label>
                <p className="text-xs text-slate-500 mb-2">
                  ইনপুট ফরম এবং প্রিন্টেবল ফর্মে ফরম হেডিং হিসেবে প্রদর্শিত হবে।
                </p>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="যেমন: পরিবার শুমারি ও তথ্য নিবন্ধন ফরম"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-[#1B8A44] focus:outline-hidden font-sans font-medium"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1">
                  ঠিকানা (Address)
                </label>
                <p className="text-xs text-slate-500 mb-2">
                  সংগঠনের বিস্তারিত ঠিকানা যা নেভবার, প্রিন্টেবল ফরম এবং ফুটারে ব্যবহৃত হবে।
                </p>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="যেমন: উত্তর গোলিন্দর বীর, ৯নং ওয়ার্ড, পটিয়া, চট্টগ্রাম"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-[#1B8A44] focus:outline-hidden font-sans font-medium"
                />
              </div>

              {/* Hotline / Phone Number */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1">
                  হটলাইন / ফোন নম্বর (Hotline / Phone Number)
                </label>
                <p className="text-xs text-slate-500 mb-2">
                  জরুরি রক্তের প্রয়োজনে হোম পেজের লাল হটলাইন বাটন এবং যোগাযোগের তথ্যে এই নম্বরটি ব্যবহৃত হবে।
                </p>
                <input
                  type="text"
                  value={hotline}
                  onChange={(e) => setHotline(e.target.value)}
                  placeholder="যেমন: ০১৮১৯-০০০০০০"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-[#1B8A44] focus:outline-hidden font-sans font-medium"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  className="py-3 px-8 bg-[#1B8A44] hover:bg-[#156d35] text-white font-bold rounded-xl text-sm transition shadow-md cursor-pointer inline-flex items-center gap-2"
                >
                  <CheckCircle2 size={18} /> সেটিংস সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
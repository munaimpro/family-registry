'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAppSettings } from '../lib/storage';
import {
  Heart,
  Search,
  PlusCircle,
  Users,
  ShieldCheck,
  PhoneCall,
  Activity,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Droplet,
  UserPlus,
  HeartHandshake,
  Award,
} from 'lucide-react';

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8000';

// Animated skeleton pill shown while loading
function Skeleton({ className = '' }) {
  return (
    <span
      className={`inline-block bg-white/20 animate-pulse rounded-lg ${className}`}
    />
  );
}

export default function HomePage() {
  const router = useRouter();

  // ── App settings (from localStorage) ──────────────────────────────────────
  const [foundationName, setFoundationName] = useState('অলি মিয়া সমাজ কল্যাণ পরিষদ');
  const [address, setAddress] = useState('উত্তর গোলিন্দর বীর, ৯নং ওয়ার্ড, পটিয়া, চট্টগ্রাম');

  useEffect(() => {
    const load = () => {
      const s = getAppSettings();
      if (s?.foundationName) setFoundationName(s.foundationName);
      if (s?.address) setAddress(s.address);
    };
    load();
    window.addEventListener('omskp_settings_updated', load);
    return () => window.removeEventListener('omskp_settings_updated', load);
  }, []);

  // ── Dashboard stats from /dashboard-stats ──────────────────────────────────
  const [dashStats, setDashStats] = useState(null);
  const [dashLoading, setDashLoading] = useState(true);
  const [dashError, setDashError] = useState(false);

  useEffect(() => {
    setDashLoading(true);
    fetch(`${SERVER_URL}/dashboard-stats`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => { setDashStats(d); setDashError(false); })
      .catch(() => setDashError(true))
      .finally(() => setDashLoading(false));
  }, []);

  // ── All families from /families (for blood counts & totalDonors) ──────────
  const [families, setFamilies] = useState([]);
  const [famLoading, setFamLoading] = useState(true);

  useEffect(() => {
    setFamLoading(true);
    fetch(`${SERVER_URL}/families`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => setFamilies(d))
      .catch(() => setFamilies([]))
      .finally(() => setFamLoading(false));
  }, []);

  // ── Derived values ─────────────────────────────────────────────────────────
  const totalFamilies = dashStats?.totalFamilies ?? 0;
  const totalMembers = dashStats?.totalMembers ?? 0;
  const specialMembersCount = dashStats?.specialMembersCount ?? 0;

  const totalDonors = families.reduce((acc, rec) => {
    let n = rec.bloodGroup ? 1 : 0;
    if (rec.members) n += rec.members.filter((m) => m.bloodGroup).length;
    return acc + n;
  }, 0);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  const bloodCounts = bloodGroups.reduce((acc, bg) => {
    let n = families.filter((r) => r.bloodGroup === bg).length;
    families.forEach((r) => {
      if (r.members) n += r.members.filter((m) => m.bloodGroup === bg).length;
    });
    acc[bg] = n;
    return acc;
  }, {});

  const handleBloodGroupClick = (bg) => {
    router.push(`/member/blood-group?bloodGroup=${encodeURIComponent(bg)}`);
  };

  // ── Stat cards config ──────────────────────────────────────────────────────
  const statCards = [
    { label: 'নিবন্ধিত পরিবার', value: totalFamilies, color: 'text-emerald-300', Icon: Users, loading: dashLoading },
    { label: 'সক্রিয় রক্তদাতা', value: totalDonors, color: 'text-rose-300', Icon: Heart, loading: famLoading },
    { label: 'বিশেষ সদস্য', value: specialMembersCount, color: 'text-amber-300', Icon: UserPlus, loading: dashLoading },
    { label: 'সর্বমোট নাগরিক', value: totalMembers, color: 'text-emerald-300', Icon: Activity, loading: dashLoading },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-[#1B8A44] selection:text-white">

      {/* ── 1. BISMILLAH BANNER ─────────────────────────────────────────────── */}
      <div className="bg-[#0A1D3B] text-white py-4 px-4 text-center border-b border-[#1B8A44]/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/20 via-[#1B8A44]/20 to-emerald-900/20 pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center gap-1">
          <div className="inline-block bg-emerald-950/80 border border-emerald-500/40 px-4 py-1.5 rounded-full shadow-inner mb-1">
            <span className="text-xl sm:text-2xl md:text-3xl font-serif text-emerald-300 font-bold tracking-widest leading-relaxed">
              بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
            </span>
          </div>
          <p className="text-xs sm:text-sm text-emerald-100 font-medium tracking-wide">
            পরম করুণাময় অসীম দয়ালু আল্লাহর নামে শুরু করছি
          </p>
        </div>
      </div>

      {/* ── 2. HERO SECTION ─────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-b from-[#0F2C59] via-[#113366] to-[#0A1D3B] text-white pt-8 pb-16 px-4 overflow-hidden border-b-4 border-[#1B8A44]">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#1B8A44_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          {/* Title */}
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white font-serif tracking-tight leading-tight">
              {foundationName}
            </h1>
          </div>

          <p className="text-sm sm:text-base md:text-lg text-emerald-100/90 max-w-3xl mx-auto font-normal leading-relaxed mb-8">
            আমাদের লক্ষ পরিবার ডিজিটাল রেজিস্ট্রি ব্যবস্থা, জরুরি ব্লাড ডোনার ডিরেক্টরি এবং সর্বস্তরের মানুষের সামাজিক কল্যাণে নিয়োজিত এক আধুনিক ডিজিটাল প্ল্যাটফর্ম।
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            <Link
              href="/member"
              className="px-6 py-3.5 bg-[#1B8A44] hover:bg-[#156d35] text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 border border-emerald-400/40"
            >
              <Search size={18} />
              <span>সদস্য অনুসন্ধান ও তালিকা</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/member"
              className="px-6 py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 border border-rose-400/40"
            >
              <Heart size={18} className="fill-white" />
              <span>রক্তদাতা খুঁজুন (Blood Donors)</span>
            </Link>

            <Link
              href="/new-form"
              className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all border border-white/20 backdrop-blur-md"
            >
              <PlusCircle size={18} />
              <span>নতুন পরিবার যুক্ত করুন</span>
            </Link>
          </div>

          {/* ── Statistics Bar (Dynamic) ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl shadow-2xl">
            {statCards.map(({ label, value, color, Icon, loading }, idx) => (
              <div key={idx} className="p-3 text-center border-r border-white/10 last:border-0">
                <div className={`text-2xl sm:text-3xl md:text-4xl font-black ${color} font-mono min-h-[2.75rem] flex items-center justify-center`}>
                  {loading
                    ? <Skeleton className="w-16 h-8" />
                    : value
                  }
                </div>
                <div className="text-xs text-slate-300 font-medium mt-1 flex items-center justify-center gap-1">
                  <Icon size={12} className={color} />
                  {label}
                </div>
              </div>
            ))}
          </div>

          {/* API error banner */}
          {dashError && (
            <p className="mt-3 text-xs text-red-300/80 text-center animate-pulse">
              ⚠ সার্ভার থেকে পরিসংখ্যান লোড করতে সমস্যা হচ্ছে। অনুগ্রহ করে পরে আবার চেষ্টা করুন।
            </p>
          )}
        </div>
      </section>

      {/* ── 3. BLOOD GROUP QUICK SEARCH ─────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 -mt-6 relative z-20">
        <div className="bg-white border-2 border-rose-200 rounded-2xl p-4 sm:p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                <Droplet size={20} className="fill-rose-600" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-serif">
                  রক্তের গ্রুপ অনুযায়ী রক্তদাতা খুঁজুন
                </h3>
                <p className="text-xs text-slate-500">
                  নিচের যেকোন রক্তের গ্রুপে ক্লিক করে সরাসরি নিবন্ধিত রক্তদাতাদের তালিকা দেখুন
                </p>
              </div>
            </div>
            <Link
              href="/member"
              className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 transition"
            >
              সকল ডোনার ডিরেক্টরি <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2.5">
            {bloodGroups.map((bg) => (
              <button
                key={bg}
                onClick={() => handleBloodGroupClick(bg)}
                className="group relative bg-rose-50 hover:bg-rose-600 border border-rose-200 hover:border-rose-600 p-3 rounded-xl text-center transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
              >
                <span className="block text-lg font-black text-rose-700 group-hover:text-white font-mono">
                  {bg}
                </span>
                <span className="block text-[11px] font-bold text-slate-600 group-hover:text-rose-100 mt-0.5">
                  {famLoading
                    ? <span className="inline-block w-8 h-3 bg-rose-200 animate-pulse rounded" />
                    : `${bloodCounts[bg] || 0} জন দাতা`
                  }
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. BLOOD DONATION BENEFITS ──────────────────────────────────────── */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1 rounded-full mb-3">
            <Heart size={14} className="fill-rose-600 text-rose-600" />
            <span>মানবসেবা ও স্বাস্থ্য সুরক্ষা</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0F2C59] font-serif leading-tight">
            রক্তদানের শারীরিক, মানসিক ও সামাজিক উপকারিতা
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            এক ব্যাগ রক্ত কেবল একটি জীবনই বাঁচায় না, বরং রক্তদাতার নিজের স্বাস্থ্যের জন্যও অত্যন্ত উপকারী।
          </p>
        </div>

        {/* Quranic Quote */}
        <div className="bg-gradient-to-r from-emerald-900 to-[#0F2C59] text-white p-6 sm:p-8 rounded-2xl shadow-xl mb-12 border-2 border-[#1B8A44]">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <p className="text-emerald-300 font-serif text-lg sm:text-xl font-bold italic">
              &quot;মুমূর্ষু মানুষের পাশে দাঁড়ানো এবং রক্তদান করা মহত্তম মানবিক কাজগুলির একটি।&quot;
            </p>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              &quot;যে ব্যক্তি একজন মানুষের জীবন বাঁচালো, সে যেন সমগ্র মানবজাতিকে বাঁচালো।&quot; — (সূরা আল-মায়িদাহ: ৩২)
            </p>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { Icon: Activity, color: 'rose', title: '১. হৃৎপিণ্ড সুস্থ রাখে (Heart Health)', body: 'নিয়মিত রক্তদানে রক্তে অতিরিক্ত আয়রন জমতে পারে না। ফলে রক্তনালী পরিষ্কার থাকে এবং হার্ট অ্যাটাক ও স্ট্রোকের ঝুঁকি বহুগুণ হ্রাস পায়।' },
            { Icon: Sparkles, color: 'emerald', title: '২. নতুন রক্তকণিকা সৃষ্টি (Cell Regeneration)', body: 'রক্তদানের ২৪ থেকে ৪৮ ঘণ্টার মধ্যে শরীরে নতুন রক্তকণিকা ও প্লাজমা তৈরি হওয়া শুরু হয়, যা শরীরের রোগ প্রতিরোধ ক্ষমতা বৃদ্ধিতে সহায়ক।' },
            { Icon: CheckCircle2, color: 'blue', title: '৩. বিনামূল্যে স্বাস্থ্য পরীক্ষা (Free Screening)', body: 'রক্তদানের পূর্বে হিমোগ্লোবিন, রক্তচাপ, হেপাটাইটিস-বি ও সি, সিফিলিস ও এইচআইভি সহ ৫টি বড় রোগের স্বাস্থ্য পরীক্ষা সম্পূর্ণ বিনামূল্যে পাওয়া যায়।' },
            { Icon: Award, color: 'amber', title: '৪. ক্যালোরি ক্ষয় ও ওজন নিয়ন্ত্রণ (Weight Management)', body: 'একবার রক্তদান করলে শরীরে প্রায় ৬৫০ ক্যালোরি বার্ন হয়, যা অতিরিক্ত চর্বি কমায় এবং ওজন নিয়ন্ত্রণে ভারসাম্য রক্ষা করে।' },
            { Icon: HeartHandshake, color: 'green', title: '৫. আত্মিক প্রশান্তি ও সওয়াব (Mental Joy & Rewards)', body: 'একজন মুমূর্ষু রোগীর জীবন বাঁচাতে রক্তদানের মাধ্যমে যে আত্মতৃপ্তি ও পরম মানসিক শান্তি পাওয়া যায়, তা অসামান্য মানবিক ও দ্বীনি অনুভূতি।' },
            { Icon: ShieldCheck, color: 'indigo', title: '৬. ক্যানসার ও লিভার রোগের ঝুঁকি হ্রাস', body: 'শরীরে আয়রনের পরিমাণ সুষম থাকায় লিভার, ফুসফুস ও পাকস্থলীর ক্ষতিকর ক্যানসার কোষ সৃষ্টির সম্ভাবনা উল্লেখযোগ্য হারে হ্রাস পায়।' },
          ].map(({ Icon, color, title, body }, i) => {
            const hoverBorderMap = { rose: 'hover:border-rose-400', emerald: 'hover:border-emerald-400', blue: 'hover:border-blue-400', amber: 'hover:border-amber-400', green: 'hover:border-[#1B8A44]', indigo: 'hover:border-indigo-400' };
            const bgMap = { rose: 'bg-rose-100 text-rose-600 group-hover:bg-rose-600', emerald: 'bg-emerald-100 text-emerald-600 group-hover:bg-[#1B8A44]', blue: 'bg-blue-100 text-blue-600 group-hover:bg-blue-600', amber: 'bg-amber-100 text-amber-600 group-hover:bg-amber-600', green: 'bg-emerald-100 text-[#1B8A44] group-hover:bg-[#1B8A44]', indigo: 'bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600' };
            return (
              <div key={i} className={`bg-white border-2 border-slate-200 ${hoverBorderMap[color]} p-6 rounded-2xl shadow-sm hover:shadow-xl transition duration-300 group`}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:text-white transition ${bgMap[color]}`}>
                  <Icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-[#0F2C59] font-serif mb-2">{title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 5. SERVICES SECTION ─────────────────────────────────────────────── */}
      <section className="bg-white py-16 px-4 border-t border-b border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#1B8A44] uppercase tracking-wider bg-emerald-100 px-3 py-1 rounded-full">
              আমাদের সেবাসমূহ
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F2C59] font-serif mt-2">
              স্মার্ট পরিবার রেজিস্ট্রি ও সমাজ কল্যাণ কার্যক্রম
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { bg: 'bg-[#0F2C59]', Icon: Users, title: '১. স্মার্ট পরিবার ডাইরেক্টরি', body: 'পটিয়া ৯নং ওয়ার্ডের স্থায়ী ও অস্থায়ী বাসিন্দাদের পরিবার প্রধান, স্ত্রী, পুত্র ও কন্যাদের সঠিক ডিজিটাল রেকর্ড ডাটাবেজ।' },
              { bg: 'bg-[#1B8A44]', Icon: Heart, title: '২. ২৪/৭ রক্তদাতা সার্ভিস', body: 'জরুরি মুহূর্তে রক্তের গ্রুপ ও এলাকা ভিত্তিক নিখুঁত সার্চ করে দ্রুত রক্তদাতার মোবাইল নম্বর ও ঠিকানা খুঁজে বের করার আধুনিক ব্যবস্থা।', iconClass: 'fill-white' },
              { bg: 'bg-amber-600', Icon: UserPlus, title: '৩. বিশেষ সদস্য নিবন্ধন', body: 'মহল্লা সদস্য, রক্ত দাতা সদস্য, এবং ভাড়াটিয়া/অস্থায়ী সদস্যদের জন্য বিশেষ সদস্য ট্যাগ সহ ডাইরেক্টরি অন্তর্ভুক্তি।' },
            ].map(({ bg, Icon, title, body, iconClass = '' }, i) => (
              <div key={i} className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-3">
                <div className={`w-14 h-14 ${bg} text-white rounded-2xl flex items-center justify-center mx-auto shadow-md`}>
                  <Icon size={28} className={iconClass} />
                </div>
                <h3 className="text-lg font-bold text-[#0F2C59] font-serif">{title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. EMERGENCY CTA ────────────────────────────────────────────────── */}
      <section className="py-12 px-4 max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-[#0F2C59] via-[#153D7A] to-[#0A1D3B] text-white rounded-3xl p-8 sm:p-10 shadow-2xl border-2 border-[#1B8A44] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-mono font-bold bg-rose-600 text-white px-3 py-1 rounded-full uppercase tracking-wider">
              Emergency Blood Support
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-serif text-white">
              জরুরি রক্তের প্রয়োজনে আমরা আপনার পাশে আছি
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              যে কোনো সময়ে রক্তের প্রয়োজন হলে সরাসরি আমাদের সদস্য ডাইরেক্টরিতে সার্চ করুন অথবা হটলাইনে যোগাযোগ করুন।
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <Link
              href="/member"
              className="w-full sm:w-auto px-6 py-3.5 bg-[#1B8A44] hover:bg-[#156d35] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-lg"
            >
              <Search size={16} />
              <span>রক্তদাতা তালিকা দেখুন</span>
            </Link>

            <a
              href="tel:01819000000"
              className="w-full sm:w-auto px-6 py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-lg"
            >
              <PhoneCall size={16} />
              <span>হটলাইন: ০১৮১৯-০০০০০০</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    GitCommit,
    Sparkles,
    Calendar,
    Tag,
    ChevronLeft,
    CheckCircle2,
    ArrowRight,
    ShieldCheck,
    Search,
    Code2,
    Layers,
    History,
    Rocket
} from 'lucide-react';

export const VersionLogView = ({ logs }) => {
    const [selectedTag, setSelectedTag] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const currentVersion = logs[0]?.version || 'v1.0.0';

    const filteredLogs = logs.filter(log => {
        const matchesTag = selectedTag === 'all' || log.tag === selectedTag;
        const matchesSearch = !searchQuery.trim() ||
            log.version.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.changes.some(c => c.items.some(it => it.toLowerCase().includes(searchQuery.toLowerCase())));
        return matchesTag && matchesSearch;
    });

    const getTagBadgeStyle = (tagColor) => {
        switch (tagColor) {
            case 'emerald':
                return 'bg-emerald-100 text-emerald-800 border-emerald-300';
            case 'blue':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'rose':
                return 'bg-rose-100 text-rose-800 border-rose-300';
            case 'purple':
                return 'bg-purple-100 text-purple-800 border-purple-300';
            default:
                return 'bg-slate-100 text-slate-800 border-slate-300';
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-3 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">

                {/* Top Header Card */}
                <div className="bg-white border-2 border-[#0F2C59]/30 rounded-2xl p-6 sm:p-8 shadow-md mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6 mb-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-[#1B8A44] transition"
                                >
                                    <ChevronLeft size={14} /> হোম পেজ
                                </Link>
                                <span className="text-slate-300">•</span>
                                <span className="text-xs font-bold text-[#1B8A44] bg-[#EBF5EE] px-2 py-0.5 rounded-md border border-[#1B8A44]/30">
                                    সিস্টেম লগ
                                </span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-black text-[#0F2C59] font-serif flex items-center gap-2.5">
                                <History className="text-[#1B8A44]" size={28} /> ভার্সন ও আপডেট লগ (Version Log)
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
                                অলি মিয়া সমাজ কল্যাণ পরিষদ ডেটা ব্যাংকের সকল রিলিজ, সংযোজিত ফিচার ও পরিবর্তনের সার্বিক ইতিবৃত্ত।
                            </p>
                        </div>

                        {/* Current Active Version Banner */}
                        <div className="bg-[#0F2C59] text-white p-4 rounded-xl shadow-xs border-2 border-[#1B8A44] text-center sm:text-right flex-shrink-0">
                            <span className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider block">
                                বর্তমান লাইভ সংস্করণ
                            </span>
                            <div className="text-2xl font-black font-mono text-white mt-0.5 flex items-center justify-center sm:justify-end gap-1.5">
                                <Rocket size={20} className="text-emerald-400" />
                                <span>{currentVersion}</span>
                            </div>
                            <span className="text-[11px] text-slate-300 block mt-1">
                                স্ট্যাটাস: 🟢 প্রোডাকশন রিলিজ
                            </span>
                        </div>
                    </div>

                    {/* Search & Tag Filtering Bar */}
                    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-3 text-slate-400" size={16} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="আপডেট বা ফিচার খুঁজুন (যেমন: বয়স, সার্চ, প্রিন্ট)..."
                                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-[#1B8A44] focus:outline-hidden"
                            />
                        </div>

                        <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
                                <Tag size={13} /> টাইপ:
                            </span>
                            {['all', 'Major Release', 'Feature Update', 'Enhancement'].map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => setSelectedTag(tag)}
                                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer border ${selectedTag === tag
                                        ? 'bg-[#0F2C59] text-white border-[#0F2C59] shadow-2xs'
                                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                                        }`}
                                >
                                    {tag === 'all' ? 'সকল আপডেট' : tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Timeline Version Cards */}
                <div className="space-y-6 relative before:absolute before:inset-0 before:left-4 sm:before:left-8 before:w-0.5 before:bg-slate-200 before:pointer-events-none">
                    {filteredLogs.length === 0 ? (
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500">
                            <History size={40} className="mx-auto text-slate-300 mb-2" />
                            <p className="font-bold text-slate-700">কোন ভার্সন বা আপডেট লগ পাওয়া যায়নি</p>
                            <button
                                onClick={() => { setSearchQuery(''); setSelectedTag('all'); }}
                                className="mt-3 text-xs text-[#1B8A44] font-bold hover:underline"
                            >
                                ফিল্টার রিসেট করুন
                            </button>
                        </div>
                    ) : (
                        filteredLogs.map((log, index) => (
                            <div
                                key={log.version}
                                className="relative pl-10 sm:pl-16 group"
                            >
                                {/* Node Dot on the timeline */}
                                <div className={`absolute left-2.5 sm:left-6.5 top-5 w-4 h-4 rounded-full border-2 border-white shadow-md flex items-center justify-center transform -translate-x-1/2 transition-transform group-hover:scale-125 ${index === 0 ? 'bg-[#1B8A44] ring-4 ring-emerald-100' : 'bg-[#0F2C59]'
                                    }`} />

                                {/* Content Box */}
                                <div className={`bg-white rounded-2xl border-2 transition-all p-5 sm:p-7 shadow-xs hover:shadow-md ${index === 0 ? 'border-[#1B8A44]/50' : 'border-slate-200 hover:border-slate-300'
                                    }`}>

                                    {/* Card Header */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4 mb-4">
                                        <div className="flex items-center gap-2.5 flex-wrap">
                                            <span className="font-mono font-black text-lg sm:text-xl text-[#0F2C59] bg-slate-100 px-3 py-0.5 rounded-lg border border-slate-300">
                                                {log.version}
                                            </span>
                                            <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold border uppercase tracking-wider ${getTagBadgeStyle(log.tagColor)}`}>
                                                {log.tag}
                                            </span>
                                            {index === 0 && (
                                                <span className="px-2 py-0.5 bg-emerald-500 text-white rounded text-[10px] font-bold tracking-wider uppercase animate-pulse">
                                                    Latest
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                            <Calendar size={13} className="text-[#1B8A44]" />
                                            <span>রিলিজের তারিখ: <strong className="text-slate-700">{log.releaseDate}</strong></span>
                                        </div>
                                    </div>

                                    {/* Title & Summary */}
                                    <div className="mb-5">
                                        <h3 className="text-base sm:text-lg font-bold text-[#0F2C59] font-serif mb-1.5">
                                            {log.title}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                                            {log.summary}
                                        </p>
                                    </div>

                                    {/* Detailed Changes List */}
                                    <div className="space-y-4">
                                        {log.changes.map((changeGroup, idx) => (
                                            <div key={idx} className="space-y-2">
                                                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1B8A44] flex items-center gap-1.5">
                                                    <Code2 size={14} /> {changeGroup.category}
                                                </h4>
                                                <ul className="space-y-1.5 pl-1">
                                                    {changeGroup.items.map((item, itemIdx) => (
                                                        <li key={itemIdx} className="text-xs sm:text-sm text-slate-700 flex items-start gap-2">
                                                            <CheckCircle2 size={15} className="text-[#1B8A44] mt-0.5 flex-shrink-0" />
                                                            <span>{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>

                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer info note */}
                <div className="mt-12 text-center text-xs text-slate-500 border-t border-slate-200 pt-6">
                    <p>
                        সফটওয়্যারের প্রতিটি নতুন আপডেট এবং পরিবর্তনগুলো এই পেজে নিয়মিত সংরক্ষণ ও প্রদর্শন করা হবে।
                    </p>
                    <p className="mt-1 font-semibold text-slate-700">
                        অলি মিয়া সমাজ কল্যাণ পরিষদ (OMSKP) • ডেটা ব্যাংক সিস্টেম
                    </p>
                </div>

            </div>
        </div>
    );
};

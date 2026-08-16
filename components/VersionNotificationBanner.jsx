'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { VERSION_LOGS } from '../lib/version-data';
import { Sparkles, X, ChevronRight, Bell } from 'lucide-react';

export const VersionNotificationBanner = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const latestLog = VERSION_LOGS && VERSION_LOGS.length > 0 ? VERSION_LOGS[0] : null;

    useEffect(() => {
        if (!latestLog || !latestLog.version) return;

        const timer = setTimeout(() => {
            try {
                const dismissedVersion = localStorage.getItem('omskp_dismissed_version_banner');
                // যদি ইউজার বর্তমান ভার্সনটি আগে ক্রস না করে থাকে, তবে দেখাবে
                if (dismissedVersion !== latestLog.version) {
                    setIsVisible(true);
                }
            } catch (e) {
                console.error('Error reading localStorage for version banner:', e);
                setIsVisible(true);
            }
        }, 0);

        return () => clearTimeout(timer);
    }, [latestLog]);

    const handleDismiss = () => {
        // ধীরে ধীরে ভ্যানিশ (fade out & collapse) ট্রানজিশন শুরু করা
        setIsClosing(true);
        try {
            if (latestLog?.version) {
                localStorage.setItem('omskp_dismissed_version_banner', latestLog.version);
            }
        } catch (e) {
            console.error('Error saving dismissal to localStorage:', e);
        }

        // ট্রানজিশন শেষ হলে সম্পূর্ণ রিমুভ করা
        setTimeout(() => {
            setIsVisible(false);
        }, 700);
    };

    if (!isVisible || !latestLog) return null;

    return (
        <div
            className={`w-full bg-gradient-to-r from-[#0F2C59] via-[#1B8A44] to-[#0F2C59] text-white border-b border-emerald-400/40 shadow-sm relative z-40 overflow-hidden transition-all duration-700 ease-in-out ${isClosing
                ? 'opacity-0 -translate-y-2 max-h-0 border-b-0 py-0 pointer-events-none'
                : 'opacity-100 translate-y-0 max-h-20 py-0'
                }`}
        >
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-1.5 sm:py-2 flex items-center justify-between gap-2 sm:gap-4 text-xs">

                {/* Left Side: Badge & Message */}
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <span className="inline-flex items-center gap-1 bg-white/20 text-white font-mono font-black text-[10px] sm:text-xs px-2 py-0.5 rounded-md backdrop-blur-xs border border-white/30 flex-shrink-0 shadow-2xs">
                        <Sparkles size={12} className="text-amber-300 fill-amber-300 animate-pulse" />
                        <span>নতুন আপডেট {latestLog.version}</span>
                    </span>

                    <p className="truncate text-[11px] sm:text-xs text-white/95 font-medium">
                        <span className="font-bold text-amber-200">{latestLog.title}:</span>{' '}
                        <span className="hidden md:inline text-white/90">{latestLog.summary}</span>
                    </p>
                </div>

                {/* Right Side: View Log Link & Close Button */}
                <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
                    <Link
                        href="/version-log"
                        onClick={handleDismiss}
                        className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-white bg-white/15 hover:bg-white/25 px-2.5 py-1 rounded-md transition border border-white/30 hover:border-white/50 shadow-2xs whitespace-nowrap"
                    >
                        <span>বিস্তারিত দেখুন</span>
                        <ChevronRight size={13} />
                    </Link>

                    <button
                        onClick={handleDismiss}
                        aria-label="বিজ্ঞপ্তি বন্ধ করুন"
                        title="বিজ্ঞপ্তি বন্ধ করুন"
                        className="p-1 text-white/80 hover:text-white hover:bg-white/20 rounded-md transition cursor-pointer flex-shrink-0"
                    >
                        <X size={15} />
                    </button>
                </div>

            </div>
        </div>
    );
};

'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/lib/AppContext';
import { Heart, User, Eye, Users, Calendar, ArrowLeft, Filter } from 'lucide-react';
import Link from 'next/link';
import { isHeadOfAnyRecord } from '@/lib/storage';

// ইংরেজি সংখ্যাকে বাংলায় রূপান্তর করার হেলপার ফাংশন
const toBengaliNumber = (num) => {
    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(num).replace(/\d/g, (digit) => bnDigits[digit]);
};

// বাংলা সংখ্যাকে ইংরেজিতে রূপান্তর করার হেলপার ফাংশন
const toEnglishNumber = (str) => {
    if (!str) return '';
    return String(str).replace(/[০-৯]/g, d => '0123456789'['০১২৩৪৫৬৭৮৯'.indexOf(d)]);
};

// নিখুঁত বয়স বের করার হেলপার ফাংশন (২৩ বছর ৩ মাস ১৫ দিন)
const calculateExactAge = (dobInput) => {
    if (!dobInput) return null;
    const str = String(dobInput).trim();
    if (!str) return null;

    // যদি সরাসরি কেবল বয়স সংখ্যা হিসেবে দেওয়া থাকে (যেমন "23")
    if (/^\d{1,3}$/.test(toEnglishNumber(str))) {
        const ageNum = parseInt(toEnglishNumber(str), 10);
        return { years: ageNum, months: 0, days: 0, text: `${toBengaliNumber(ageNum)} বছর` };
    }

    const bnToEn = toEnglishNumber(str);
    let birthDate = null;

    // DD/MM/YYYY বা DD-MM-YYYY
    const dmyMatch = bnToEn.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/);
    if (dmyMatch) {
        birthDate = new Date(parseInt(dmyMatch[3], 10), parseInt(dmyMatch[2], 10) - 1, parseInt(dmyMatch[1], 10));
    } else {
        // YYYY-MM-DD
        const ymdMatch = bnToEn.match(/^(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})$/);
        if (ymdMatch) {
            birthDate = new Date(parseInt(ymdMatch[1], 10), parseInt(ymdMatch[2], 10) - 1, parseInt(ymdMatch[3], 10));
        } else {
            const parsed = new Date(bnToEn);
            if (!isNaN(parsed.getTime())) birthDate = parsed;
        }
    }

    if (!birthDate || isNaN(birthDate.getTime())) {
        return { years: 0, months: 0, days: 0, text: str };
    }

    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
        months -= 1;
        // পূর্ববর্তী মাসের দিন সংখ্যা বের করা
        const previousMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        days += previousMonth.getDate();
    }

    if (months < 0) {
        years -= 1;
        months += 12;
    }

    if (years < 0) return null;

    // পারফেক্ট বাংলা টেক্সট ফরম্যাট
    let ageParts = [];
    if (years > 0) ageParts.push(`${toBengaliNumber(years)} বছর`);
    if (months > 0) ageParts.push(`${toBengaliNumber(months)} মাস`);
    if (days > 0) ageParts.push(`${toBengaliNumber(days)} দিন`);

    const text = ageParts.length > 0 ? ageParts.join(' ') : '০ দিন';
    return { years, months, days, text };
};

function BloodGroupAndAgeContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { records } = useApp();

    const bloodGroup = searchParams.get('bloodGroup') || '';
    const minAgeParam = searchParams.get('minAge') || '';
    const maxAgeParam = searchParams.get('maxAge') || '';

    const [fetchedFamilies, setFetchedFamilies] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // API থেকে ফিল্টার করা ডাটা ফেচ
    useEffect(() => {
        let isCancelled = false;
        const loadApiData = async () => {
            if (!bloodGroup && !minAgeParam && !maxAgeParam) return;
            setIsLoading(true);
            try {
                const queryParams = new URLSearchParams();
                if (bloodGroup) queryParams.append('bloodGroup', bloodGroup);
                if (minAgeParam) queryParams.append('minAge', minAgeParam);
                if (maxAgeParam) queryParams.append('maxAge', maxAgeParam);

                const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || '';
                const res = await fetch(`${baseUrl}/families?${queryParams.toString()}`);
                if (res.ok && !isCancelled) {
                    const data = await res.json();
                    setFetchedFamilies(data);
                }
            } catch (err) {
                console.error("Error fetching families by criteria:", err);
            } finally {
                if (!isCancelled) setIsLoading(false);
            }
        };

        loadApiData();
        return () => { isCancelled = true; };
    }, [bloodGroup, minAgeParam, maxAgeParam]);

    const activeRecords = React.useMemo(() => {
        return fetchedFamilies || records || [];
    }, [fetchedFamilies, records]);

    // সার্ভার থেকে আসা রেজাল্ট মেম্বার লিস্ট আকারে সঠিক ফিল্টারিংসহ সাজানো
    const members = React.useMemo(() => {
        if (!bloodGroup && !minAgeParam && !maxAgeParam) return [];

        const matchedMembers = [];
        const minAgeNum = minAgeParam ? parseInt(toEnglishNumber(minAgeParam), 10) : null;
        const maxAgeNum = maxAgeParam ? parseInt(toEnglishNumber(maxAgeParam), 10) : null;

        const isAgeMatching = (ageObj) => {
            if (!ageObj) return true; // যদি বয়স দেওয়া না থাকে তবে বাদ যাবে না
            const y = ageObj.years;
            if (minAgeNum !== null && !isNaN(minAgeNum) && y < minAgeNum) return false;
            if (maxAgeNum !== null && !isNaN(maxAgeNum) && y > maxAgeNum) return false;
            return true;
        };

        const isBloodMatching = (bg) => {
            if (!bloodGroup) return true;
            return bg === bloodGroup;
        };

        activeRecords.forEach(rec => {
            // ১. প্রধান সদস্য যাচাই ও যুক্ত করা
            const headAgeObj = calculateExactAge(rec.dob || rec.age);
            if (isBloodMatching(rec.bloodGroup) && isAgeMatching(headAgeObj)) {
                matchedMembers.push({
                    _id: (rec._id || rec.id) + '-head',
                    recordId: rec._id || rec.id,
                    type: 'head',
                    name: rec.headName,
                    fatherName: rec.fatherOrHusbandName || 'তথ্য নেই',
                    bloodGroup: rec.bloodGroup,
                    ageText: headAgeObj ? headAgeObj.text : null,
                    formNo: rec.formNo,
                    mobile: rec.mobileNumber
                });
            }

            // ২. পরিবারের অন্যান্য সদস্য (ওয়ারিশগণ) যাচাই ও যুক্ত করা
            if (rec.members && rec.members.length > 0) {
                rec.members.forEach(m => {
                    if (!isHeadOfAnyRecord(m.name, activeRecords, rec._id || rec.id)) {
                        const memAgeObj = calculateExactAge(m.dobOrAge || m.dob || m.age);

                        if (isBloodMatching(m.bloodGroup) && isAgeMatching(memAgeObj)) {
                            matchedMembers.push({
                                _id: m.id || (rec._id || rec.id) + '-' + m.name,
                                recordId: rec._id || rec.id,
                                type: 'member',
                                name: m.name + (m.relation ? ' (' + m.relation + ')' : ''),
                                fatherName: 'প্রধান সদস্য: ' + rec.headName,
                                bloodGroup: m.bloodGroup,
                                ageText: memAgeObj ? memAgeObj.text : null,
                                formNo: rec.formNo,
                                mobile: m.mobileNumber
                            });
                        }
                    }
                });
            }
        });

        return matchedMembers;
    }, [activeRecords, bloodGroup, minAgeParam, maxAgeParam]);

    // ফিল্টার হেডার ও টাইটেল
    let titleBadge = '';
    if (bloodGroup && (minAgeParam || maxAgeParam)) {
        titleBadge = `ব্লাড গ্রুপ: ${bloodGroup} | বয়স: ${minAgeParam || '০'} হতে ${maxAgeParam || '∞'} বছর`;
    } else if (bloodGroup) {
        titleBadge = `ব্লাড গ্রুপ: ${bloodGroup}`;
    } else if (minAgeParam || maxAgeParam) {
        if (minAgeParam && maxAgeParam) {
            titleBadge = `বয়স সীমা: ${minAgeParam} হতে ${maxAgeParam} বছর`;
        } else if (minAgeParam) {
            titleBadge = `বয়স সীমা: ন্যূনতম ${minAgeParam} বছর ও তদূর্ধ্ব`;
        } else {
            titleBadge = `বয়স সীমা: অনূর্ধ্ব ${maxAgeParam} বছর`;
        }
    }

    return (
        <div className="max-w-7xl mx-auto my-6 px-4 min-h-[60vh]">
            {/* Header Info Panel */}
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-sm border borderSlate200 border-slate-200">
                <div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0F2C59] font-serif flex items-center gap-2">
                            {bloodGroup ? (
                                <Heart className="text-rose-600 fill-rose-600 flex-shrink-0" size={28} />
                            ) : (
                                <Calendar className="text-amber-600 flex-shrink-0" size={28} />
                            )}
                            <span>{titleBadge || 'সদস্য তালিকা'}</span>
                        </h1>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 mt-2 flex items-center gap-2 flex-wrap">
                        <span>ফিল্টার শর্ত অনুযায়ী মোট সদস্য পাওয়া গেছে:</span>
                        <strong className="text-[#1B8A44] font-mono text-base sm:text-lg bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            {members.length}
                        </strong> জন
                    </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Link
                        href="/member"
                        className="flex-1 sm:flex-none text-center px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs sm:text-sm font-bold transition shadow-xs border border-slate-300 whitespace-nowrap flex items-center justify-center gap-1.5"
                    >
                        <ArrowLeft size={16} />
                        <span>ফিল্টারে ফিরে যান</span>
                    </Link>
                    <Link
                        href="/"
                        className="flex-1 sm:flex-none text-center px-4 py-2.5 bg-[#0F2C59] hover:bg-[#1B365D] text-white rounded-xl text-xs sm:text-sm font-bold transition shadow-xs whitespace-nowrap"
                    >
                        হোম পেজ
                    </Link>
                </div>
            </div>

            {isLoading ? (
                <div className="bg-white border border-slate-200 borderSlate200 rounded-2xl p-12 text-center text-slate-500">
                    <div className="animate-spin w-8 h-8 border-4 border-[#1B8A44] border-t-transparent rounded-full mx-auto mb-3"></div>
                    <p className="font-semibold text-sm">সদস্য তথ্য লোড হচ্ছে...</p>
                </div>
            ) : (!bloodGroup && !minAgeParam && !maxAgeParam) ? (
                <div className="bg-white border-2 border-slate-200 borderSlate200 rounded-2xl p-12 text-center text-slate-600">
                    <Filter size={48} className="mx-auto text-slate-400 mb-3" />
                    <h3 className="text-lg font-bold text-slate-800">কোন ব্লাড গ্রুপ বা বয়স সীমা নির্বাচন করা হয়নি</h3>
                    <p className="text-xs text-slate-500 mt-1">অনুগ্রহ করে মেম্বার পেজ থেকে বয়স সীমা অথবা রক্তের গ্রুপ নির্বাচন করুন।</p>
                </div>
            ) : members.length === 0 ? (
                <div className="bg-white border-2 border-slate-200 borderSlate200 borderSlate200 borderSlate200 rounded-2xl p-12 text-center text-slate-600">
                    <User size={48} className="mx-auto text-slate-300 mb-3" />
                    <h3 className="text-xl font-bold text-slate-800">কোন সদস্যের তথ্য পাওয়া যায়নি</h3>
                    <p className="text-sm text-slate-500 mt-2">এই ফিল্টার শর্তের সাথে মিল রয়েছে এমন কোনো সদস্য বর্তমানে ডাটাবেজে নেই।</p>
                    <Link
                        href="/member"
                        className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-[#1B8A44] hover:bg-[#156d35] text-white text-xs font-bold rounded-xl transition"
                    >
                        অন্যান্য শর্ত দিয়ে খুঁজুন
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {members.map((member) => (
                        <div
                            key={member._id}
                            className="bg-white border-2 border-slate-200 borderSlate200 hover:border-[#1B8A44]/60 rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                        >
                            <div>
                                {/* Card Header */}
                                <div className="flex justify-between items-start mb-3 gap-2">
                                    <div className="flex flex-col items-start gap-1 flex-wrap">
                                        <span className="text-[11px] uppercase font-mono font-bold tracking-wider text-[#0F2C59] bg-[#EBF5EE] px-2.5 py-1 rounded-md border border-[#1B8A44]/30">
                                            ফরম: {member.formNo}
                                        </span>
                                        {member.type === 'member' ? (
                                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200 shadow-2xs">
                                                পরিবারের সদস্য
                                            </span>
                                        ) : (
                                            <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-md border border-blue-200 shadow-2xs">
                                                প্রধান সদস্য
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex flex-col items-end gap-1">
                                        {member.bloodGroup && (
                                            <span className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-black flex items-center gap-1 shadow-2xs flex-shrink-0 font-mono">
                                                <Heart size={12} fill="currentColor" /> {member.bloodGroup}
                                            </span>
                                        )}
                                        {member.ageText && (
                                            <span className="px-2 py-0.5 bg-slate-100 text-slate-800 border border-slate-300 rounded-md text-[11px] font-bold flex items-center gap-1 shadow-2xs">
                                                <Calendar size={11} className="text-slate-600" /> {member.ageText}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Member Name */}
                                <h3 className="text-base sm:text-lg font-bold text-[#0F2C59] font-serif mb-2.5 group-hover:text-[#1B8A44] transition-colors leading-snug">
                                    {member.name}
                                </h3>

                                {/* Father / Head Info */}
                                <div className="space-y-1.5">
                                    <p className="text-xs text-slate-600 font-medium flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                        {member.type === 'head' ? (
                                            <User size={15} className="text-[#1B8A44] flex-shrink-0 mt-0.5" />
                                        ) : (
                                            <Users size={15} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                                        )}
                                        <span className="leading-snug">
                                            {member.type === 'head' ? (
                                                <>
                                                    <span className="text-slate-500 text-[10px] font-bold block mb-0.5">পিতা/স্বামীর নাম:</span>
                                                    <strong className="text-slate-800 text-xs sm:text-sm">{member.fatherName}</strong>
                                                </>
                                            ) : (
                                                <strong className="text-slate-800 text-xs sm:text-sm">{member.fatherName}</strong>
                                            )}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function BloodGroupAndAgePage() {
    return (
        <Suspense fallback={
            <div className="bg-white border border-slate-200 borderSlate200 rounded-2xl p-12 text-center text-slate-500 max-w-7xl mx-auto my-6">
                <div className="animate-spin w-8 h-8 border-4 border-[#1B8A44] border-t-transparent rounded-full mx-auto mb-3"></div>
                <p className="font-semibold text-sm">পেইজ লোড হচ্ছে...</p>
            </div>
        }>
            <BloodGroupAndAgeContent />
        </Suspense>
    );
}
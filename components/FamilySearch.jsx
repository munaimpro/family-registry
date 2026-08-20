'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { searchRecords, isHeadOfAnyRecord } from '../lib/storage';
import { getApiUrl } from '../lib/utils';
import {
    Search,
    Heart,
    Phone,
    MapPin,
    Users,
    FileText,
    Printer,
    Eye,
    Edit2,
    RotateCcw,
    Plus,
    User,
    Hash,
    X,
    ChevronLeft,
    ChevronRight,
    ShieldCheck,
    UserCheck,
    Calendar,
    Sparkles
} from 'lucide-react';

// ইংরেজি সংখ্যাকে বাংলায় রূপান্তর
const toBengaliNum = (num) => {
    if (num === null || num === undefined) return '';
    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(num).replace(/\d/g, (d) => bnDigits[d]);
};

// বাংলা সংখ্যাকে ইংরেজিতে রূপান্তর
const toEnglishNum = (str) => {
    if (!str) return '';
    return String(str).replace(/[০-৯]/g, (d) => '0123456789'['০১২৩৪৫৬৭৮৯'.indexOf(d)]);
};

// বয়স হিসাব করার লোকাল সেফটি ফাংশন (যদি পেজ থেকে exactAgeText না আসে)
const formatAgeDisplay = (exactAgeText, rawDob, rawAge) => {
    if (exactAgeText) return exactAgeText;

    const input = rawDob || rawAge;
    if (!input) return null;
    const str = String(input).trim();
    if (!str) return null;

    const cleanStr = toEnglishNum(str);
    const today = new Date();

    // ১. শুধু সংখ্যা হলে (যেমন "23")
    if (/^\d{1,2}$/.test(cleanStr)) {
        return `${toBengaliNum(cleanStr)} বছর`;
    }

    // ২. শুধু সাল হলে (যেমন "1998")
    if (/^\d{4}$/.test(cleanStr)) {
        const calculatedAge = today.getFullYear() - parseInt(cleanStr, 10);
        return calculatedAge > 0 ? `${toBengaliNum(calculatedAge)} বছর` : '১ বছর';
    }

    // ৩. পূর্ণাঙ্গ জন্মতারিখ পার্স করা
    let birthDate = null;
    const dmyMatch = cleanStr.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/);
    const ymdMatch = cleanStr.match(/^(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})$/);

    if (dmyMatch) {
        birthDate = new Date(parseInt(dmyMatch[3], 10), parseInt(dmyMatch[2], 10) - 1, parseInt(dmyMatch[1], 10));
    } else if (ymdMatch) {
        birthDate = new Date(parseInt(ymdMatch[1], 10), parseInt(ymdMatch[2], 10) - 1, parseInt(ymdMatch[3], 10));
    } else {
        const parsed = new Date(cleanStr);
        if (!isNaN(parsed.getTime())) birthDate = parsed;
    }

    if (!birthDate || isNaN(birthDate.getTime())) return str;

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
        months -= 1;
        const previousMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        days += previousMonth.getDate();
    }
    if (months < 0) {
        years -= 1;
        months += 12;
    }
    if (years < 0) return null;

    let parts = [];
    if (years > 0) parts.push(`${toBengaliNum(years)} বছর`);
    if (months > 0) parts.push(`${toBengaliNum(months)} মাস`);
    if (days > 0) parts.push(`${toBengaliNum(days)} দিন`);

    return parts.length > 0 ? parts.join(' ') : '০ দিন';
};

export const FamilySearch = ({
    records,
    isLoggedIn = false,
    onSelectRecord,
    onEditRecord,
    onPrintRecord,
    onAddNew,
    initialBloodGroup = ''
}) => {
    const router = useRouter();
    const [nameQuery, setNameQuery] = useState('');
    const [formNoQuery, setFormNoQuery] = useState('');
    const [generalQuery, setGeneralQuery] = useState('');
    const [minAgeQuery, setMinAgeQuery] = useState('');
    const [maxAgeQuery, setMaxAgeQuery] = useState('');
    const [selectedBloodGroup, setSelectedBloodGroup] = useState(initialBloodGroup);
    const [filterType, setFilterType] = useState('all'); // 'all', 'moholla', 'bloodDonor', 'temporary', 'regular'

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(12);

    const [dbRecords, setDbRecords] = useState(() => records || []);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let isCancelled = false;
        const fetchRecords = async () => {
            setIsLoading(true);
            try {
                const queryParams = new URLSearchParams();
                const searchInput = (nameQuery || generalQuery).trim();
                if (searchInput) queryParams.append('search', searchInput);
                if (formNoQuery) queryParams.append('formNo', formNoQuery);
                if (selectedBloodGroup) queryParams.append('bloodGroup', selectedBloodGroup);
                if (filterType !== 'all') queryParams.append('filterType', filterType);
                if (minAgeQuery) queryParams.append('minAge', minAgeQuery.trim());
                if (maxAgeQuery) queryParams.append('maxAge', maxAgeQuery.trim());

                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/families?${queryParams.toString()}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(process.env.NEXT_PUBLIC_API_TOKEN ? { 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}` } : {})
                    }
                });
                if (response.ok && !isCancelled) {
                    const data = await response.json();
                    setDbRecords(data);
                } else if (!isCancelled) {
                    const filteredLocal = searchRecords(records || [], {
                        query: searchInput,
                        formNoQuery,
                        selectedBloodGroup,
                        minAge: minAgeQuery,
                        maxAge: maxAgeQuery,
                    });
                    setDbRecords(filteredLocal);
                }
            } catch (error) {
                console.error("Error fetching records:", error);
                if (!isCancelled) {
                    const filteredLocal = searchRecords(records || [], {
                        query: (nameQuery || generalQuery).trim(),
                        formNoQuery,
                        selectedBloodGroup,
                        minAge: minAgeQuery,
                        maxAge: maxAgeQuery,
                    });
                    setDbRecords(filteredLocal);
                }
            } finally {
                if (!isCancelled) {
                    setIsLoading(false);
                }
            }
        };

        const timeoutId = setTimeout(() => {
            fetchRecords();
        }, 200);
        return () => {
            isCancelled = true;
            clearTimeout(timeoutId);
        };
    }, [nameQuery, generalQuery, formNoQuery, minAgeQuery, maxAgeQuery, selectedBloodGroup, filterType, records]);

    const handleNameChange = (val) => { setNameQuery(val); setCurrentPage(1); };
    const handleFormNoChange = (val) => { setFormNoQuery(val); setCurrentPage(1); };
    const handleGeneralChange = (val) => { setGeneralQuery(val); setCurrentPage(1); };
    const handleMinAgeChange = (val) => { setMinAgeQuery(val); setCurrentPage(1); };
    const handleMaxAgeChange = (val) => { setMaxAgeQuery(val); setCurrentPage(1); };
    const handleBloodChange = (val) => {
        setSelectedBloodGroup(val);
        setCurrentPage(1);
        if (val) {
            router.push(`/member/blood-group?bloodGroup=${encodeURIComponent(val)}`);
        }
    };
    const handleFilterTypeChange = (val) => { setFilterType(val); setCurrentPage(1); };

    // dbRecords is already filtered by backend
    const filteredRecords = dbRecords;

    // Calculate pagination
    const totalRecords = filteredRecords.length;
    const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
    const validCurrentPage = Math.min(currentPage, totalPages);
    const startIndex = (validCurrentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalRecords);
    const paginatedRecords = filteredRecords.slice(startIndex, endIndex);

    const bloodGroups = ['N/A', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

    const resetFilters = () => {
        setNameQuery('');
        setFormNoQuery('');
        setGeneralQuery('');
        setMinAgeQuery('');
        setMaxAgeQuery('');
        setSelectedBloodGroup('');
        setFilterType('all');
        setCurrentPage(1);
    };

    return (
        <div className="max-w-7xl mx-auto my-6 px-4">
            {/* Search & Filter Control Panel */}
            <div className="bg-white border-2 border-[#0F2C59]/30 p-5 rounded-2xl shadow-md mb-8">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-[#0F2C59] font-serif flex items-center gap-2">
                            <Search className="text-[#1B8A44]" size={20} /> পরিবার ডিরেক্টরি ও অনুসন্ধান (Public Member Directory)
                        </h2>
                        <p className="text-xs text-slate-600 mt-1">
                            প্রধান সদস্যের নাম, ফরম নম্বর, স্ত্রী/পুত্র/কন্যা বা নির্দিষ্ট বয়স সীমা দিয়ে মেম্বার খুঁজুন।
                        </p>
                    </div>

                    {isLoggedIn && (
                        <button
                            onClick={onAddNew}
                            className="px-4 py-2 bg-[#1B8A44] hover:bg-[#156d35] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition cursor-pointer self-stretch lg:self-auto justify-center"
                        >
                            <Plus size={16} /> নতুন ফ্যামিলি যুক্ত করুন
                        </button>
                    )}
                </div>

                {/* Input Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                    {/* Separate Name Input Field */}
                    <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                            <User size={13} className="text-[#1B8A44]" />
                            নাম / স্ত্রী / সন্তান
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={nameQuery}
                                onChange={(e) => handleNameChange(e.target.value)}
                                placeholder="প্রধান বা সদস্যের নাম..."
                                className="w-full px-3 py-2 pr-8 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-[#1B8A44] focus:outline-hidden"
                            />
                            {nameQuery && (
                                <button
                                    onClick={() => handleNameChange('')}
                                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                                    title="ক্লিয়ার করুন"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Separate Form No Input Field */}
                    <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                            <Hash size={13} className="text-[#0F2C59]" />
                            ফরম নম্বর (Form No)
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={formNoQuery}
                                onChange={(e) => handleFormNoChange(e.target.value)}
                                placeholder="e.g. F-2026-001 / 001"
                                className="w-full px-3 py-2 pr-8 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono text-slate-900 focus:ring-2 focus:ring-[#1B8A44] focus:outline-hidden"
                            />
                            {formNoQuery && (
                                <button
                                    onClick={() => handleFormNoChange('')}
                                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                                    title="ক্লিয়ার করুন"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Age Range Filter (Min Age & Max Age) */}
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                                <Calendar size={13} className="text-amber-600" />
                                বয়স সীমা (Min - Max Age)
                            </label>
                            {(minAgeQuery || maxAgeQuery) && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        const params = new URLSearchParams();
                                        if (minAgeQuery) params.append('minAge', minAgeQuery);
                                        if (maxAgeQuery) params.append('maxAge', maxAgeQuery);
                                        if (selectedBloodGroup) params.append('bloodGroup', selectedBloodGroup);
                                        router.push(`/member/blood-group?${params.toString()}`);
                                    }}
                                    className="text-[10px] text-[#1B8A44] hover:text-[#156d35] font-bold underline cursor-pointer flex items-center gap-0.5"
                                    title="নির্দিষ্ট বয়সের সদস্য তালিকা দেখুন"
                                >
                                    <Eye size={11} /> তালিকা দেখুন
                                </button>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-1.5">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={minAgeQuery}
                                    onChange={(e) => handleMinAgeChange(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && (minAgeQuery || maxAgeQuery)) {
                                            const params = new URLSearchParams();
                                            if (minAgeQuery) params.append('minAge', minAgeQuery);
                                            if (maxAgeQuery) params.append('maxAge', maxAgeQuery);
                                            if (selectedBloodGroup) params.append('bloodGroup', selectedBloodGroup);
                                            router.push(`/member/blood-group?${params.toString()}`);
                                        }
                                    }}
                                    placeholder="মিন (e.g. 18)"
                                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:ring-2 focus:ring-[#1B8A44] focus:outline-hidden"
                                />
                                {minAgeQuery && (
                                    <button
                                        onClick={() => handleMinAgeChange('')}
                                        className="absolute right-1.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                                    >
                                        <X size={12} />
                                    </button>
                                )}
                            </div>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={maxAgeQuery}
                                    onChange={(e) => handleMaxAgeChange(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && (minAgeQuery || maxAgeQuery)) {
                                            const params = new URLSearchParams();
                                            if (minAgeQuery) params.append('minAge', minAgeQuery);
                                            if (maxAgeQuery) params.append('maxAge', maxAgeQuery);
                                            if (selectedBloodGroup) params.append('bloodGroup', selectedBloodGroup);
                                            router.push(`/member/blood-group?${params.toString()}`);
                                        }
                                    }}
                                    placeholder="ম্যাক্স (e.g. 60)"
                                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:ring-2 focus:ring-[#1B8A44] focus:outline-hidden"
                                />
                                {maxAgeQuery && (
                                    <button
                                        onClick={() => handleMaxAgeChange('')}
                                        className="absolute right-1.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                                    >
                                        <X size={12} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Mobile / Address / NID Input Field */}
                    <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                            <Phone size={13} className="text-emerald-600" />
                            মোবাইল / এনআইডি / গ্রাম
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={generalQuery}
                                onChange={(e) => handleGeneralChange(e.target.value)}
                                placeholder="মোবাইল, এনআইডি, গ্রাম..."
                                className="w-full px-3 py-2 pr-8 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-[#1B8A44] focus:outline-hidden"
                            />
                            {generalQuery && (
                                <button
                                    onClick={() => handleGeneralChange('')}
                                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                                    title="ক্লিয়ার করুন"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Blood Group Dropdown */}
                    <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                            <Heart size={13} className="text-rose-600" />
                            রক্তের গ্রুপ (Blood Group)
                        </label>
                        <select
                            value={selectedBloodGroup}
                            onChange={(e) => handleBloodChange(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm text-rose-700 font-bold focus:ring-2 focus:ring-[#1B8A44] focus:outline-hidden h-[38px] cursor-pointer"
                        >
                            <option value="">সকল রক্তের গ্রুপ (All)</option>
                            {bloodGroups.map(bg => (
                                <option key={bg} value={bg}>রক্তের গ্রুপ {bg}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* External Member Filter Tabs */}
                <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-col lg:flex-row items-center gap-2">
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                            <UserCheck size={14} className="text-[#1B8A44]" /> মেম্বার টাইপ
                        </span>
                        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-300 flex-wrap gap-1">
                            <button
                                onClick={() => handleFilterTypeChange('all')}
                                className={`w-full lg:w-auto justify-center px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${filterType === 'all'
                                    ? 'bg-[#0F2C59] text-white shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900'
                                    }`}
                            >
                                সকল মেম্বার
                            </button>
                            <button
                                onClick={() => handleFilterTypeChange('moholla')}
                                className={`w-full lg:w-auto justify-center px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${filterType === 'moholla'
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : 'text-emerald-800 hover:text-emerald-900'
                                    }`}
                            >
                                <span>মহল্লা সদস্য</span>
                            </button>
                            <button
                                onClick={() => handleFilterTypeChange('bloodDonor')}
                                className={`w-full lg:w-auto justify-center px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${filterType === 'bloodDonor'
                                    ? 'bg-rose-600 text-white shadow-xs'
                                    : 'text-rose-800 hover:text-rose-900'
                                    }`}
                            >
                                <span>রক্ত দাতা সদস্য</span>
                            </button>
                            <button
                                onClick={() => handleFilterTypeChange('temporary')}
                                className={`w-full lg:w-auto justify-center px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${filterType === 'temporary'
                                    ? 'bg-purple-600 text-white shadow-xs'
                                    : 'text-purple-800 hover:text-purple-900'
                                    }`}
                            >
                                <span>ভাড়াটিয়া/অস্থায়ী সদস্য</span>
                            </button>
                        </div>
                    </div>

                    {/* Filter Badges & Reset Controls */}
                    <button
                        onClick={resetFilters}
                        className="w-full lg:w-auto justify-center px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer border border-slate-300 ml-auto"
                    >
                        <RotateCcw size={13} /> ফিল্টার রিসেট
                    </button>
                </div>

                {/* Results Counter & Summary */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
                    <span>
                        সর্বমোট প্রাপ্ত ফলাফল: <strong className="text-[#1B8A44] font-mono text-sm">{totalRecords}</strong> টি পরিবার
                        {filterType === 'moholla' && <span className="ml-1 text-emerald-700 font-bold">(केवल মহল্লা সদস্য)</span>}
                        {filterType === 'bloodDonor' && <span className="ml-1 text-rose-700 font-bold">(কেবল রক্ত দাতা সদস্য)</span>}
                        {filterType === 'temporary' && <span className="ml-1 text-purple-700 font-bold">(কেবল ভাড়াটিয়া/অস্থায়ী সদস্য)</span>}
                        {(minAgeQuery || maxAgeQuery) && (
                            <span className="ml-1 text-amber-700 font-bold">
                                (বয়স: {minAgeQuery || '০'} থেকে {maxAgeQuery || '∞'} বছর)
                            </span>
                        )}
                    </span>
                </div>
            </div>

            {/* Grid of Family Cards */}
            {isLoading ? (
                <div className="bg-white border-2 border-slate-200 rounded-2xl p-12 text-center text-slate-600">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B8A44] mx-auto mb-3"></div>
                    <h3 className="text-lg font-bold text-slate-800">তথ্য লোড হচ্ছে...</h3>
                    <p className="text-xs text-slate-500 mt-1">
                        অনুগ্রহ করে অপেক্ষা করুন, সার্ভার থেকে ডাটা আনা হচ্ছে।
                    </p>
                </div>
            ) : filteredRecords.length === 0 ? (
                <div className="bg-white border-2 border-slate-200 rounded-2xl p-12 text-center text-slate-600">
                    <FileText size={48} className="mx-auto text-slate-400 mb-3" />
                    <h3 className="text-lg font-bold text-slate-800">কোন পরিবারের তথ্য পাওয়া যায়নি</h3>
                    <p className="text-xs text-slate-500 mt-1">
                        আপনার প্রদানকৃত ফিল্টার বা অনুসন্ধানের তথ্যের সাথে কোন মিল পাওয়া যায়নি।
                    </p>
                    <button
                        onClick={resetFilters}
                        className="mt-4 px-4 py-2 bg-[#1B8A44] hover:bg-[#156d35] text-white rounded-lg text-xs font-bold cursor-pointer"
                    >
                        সকল ফিল্টার রিসেট করুন
                    </button>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {paginatedRecords.map((rec) => {
                            const query = (nameQuery || generalQuery).trim().toLowerCase();
                            let matchedMember = null;
                            if ((query || selectedBloodGroup) && rec.members && rec.members.length > 0) {
                                matchedMember = rec.members.find(m => {
                                    if (isHeadOfAnyRecord(m.name, records, rec.id)) return false;

                                    let matchesQuery = false;
                                    if (query) {
                                        const mName = (m.name || '').toLowerCase();
                                        const mRel = (m.relation || '').toLowerCase();
                                        const mMob = (m.mobileNumber || '').toLowerCase();
                                        matchesQuery = mName.includes(query) || mRel.includes(query) || mMob.includes(query);
                                    }

                                    let matchesBlood = false;
                                    if (selectedBloodGroup) {
                                        matchesBlood = m.bloodGroup === selectedBloodGroup;
                                    }

                                    if (query && selectedBloodGroup) return matchesQuery || matchesBlood;
                                    if (query) return matchesQuery;
                                    if (selectedBloodGroup) return matchesBlood;

                                    return false;
                                });
                            }

                            // প্রধান সদস্যের বয়স নির্ধারণ
                            const headAgeFormatted = formatAgeDisplay(rec.exactAgeText, rec.dob, rec.age);

                            return (
                                <div
                                    key={rec._id}
                                    className="bg-white border-2 border-slate-200 hover:border-[#1B8A44] rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between group"
                                >
                                    <div>
                                        {/* Top Header Card Info */}
                                        <div className="flex justify-between items-start mb-3 gap-2">
                                            <div>
                                                <div className="flex items-center gap-1.5 flex-wrap mb-1">
                                                    <span className="text-[11px] uppercase font-mono font-bold tracking-wider text-[#0F2C59] bg-[#EBF5EE] px-2.5 py-1 rounded-md border border-[#1B8A44]/30 inline-block">
                                                        ফরম নং: {rec.formNo}
                                                    </span>
                                                    {rec.isMohollaMember && (
                                                        <span className="px-2 py-0.5 text-[10px] font-mono font-extrabold bg-emerald-500 text-white rounded uppercase tracking-wider shadow-2xs">
                                                            মহল্লা সদস্য
                                                        </span>
                                                    )}
                                                    {rec.isBloodDonorMember && (
                                                        <span className="px-2 py-0.5 text-[10px] font-mono font-extrabold bg-rose-500 text-white rounded uppercase tracking-wider shadow-2xs">
                                                            রক্ত দাতা সদস্য
                                                        </span>
                                                    )}
                                                    {rec.isTemporaryMember && (
                                                        <span className="px-2 py-0.5 text-[10px] font-mono font-extrabold bg-purple-500 text-white rounded uppercase tracking-wider shadow-2xs">
                                                            ভাড়াটিয়া/অস্থায়ী সদস্য
                                                        </span>
                                                    )}
                                                </div>
                                                <h3 className="text-lg font-bold text-[#0F2C59] font-serif group-hover:text-[#1B8A44] transition flex items-center gap-2 flex-wrap">
                                                    <span>{rec.headName.toUpperCase()}</span>
                                                    {headAgeFormatted && (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 border border-slate-300 text-slate-800 rounded-md text-[11px] font-sans font-bold shadow-2xs" title={`বয়স: ${headAgeFormatted}`}>
                                                            <Calendar size={11} className="text-slate-600" />
                                                            <span>{headAgeFormatted}</span>
                                                        </span>
                                                    )}
                                                </h3>
                                                {rec.fatherOrHusbandName && (
                                                    <p className="text-xs text-slate-600 font-medium mt-0.5 flex items-center gap-1">
                                                        <User size={13} className="text-[#1B8A44] flex-shrink-0" />
                                                        <span>পিতার নাম: <strong className="text-slate-800 font-semibold">{rec.fatherOrHusbandName.toUpperCase()}</strong></span>
                                                    </p>
                                                )}
                                            </div>
                                            {rec.bloodGroup && (
                                                <span className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs flex-shrink-0">
                                                    <Heart size={12} fill="currentColor" /> {rec.bloodGroup}
                                                </span>
                                            )}
                                        </div>

                                        {/* Matched Spouse / Child Highlight Notice */}
                                        {matchedMember && (
                                            <div className="mb-3 p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-medium flex items-center gap-2 shadow-2xs">
                                                <Users size={15} className="text-[#1B8A44] flex-shrink-0" />
                                                <div>
                                                    <span className="text-[10px] text-emerald-700 block font-bold">সার্চ অনুযায়ী খুঁজে পাওয়া মেম্বার:</span>
                                                    <span className="font-bold text-[#1B8A44]">{matchedMember.name.toUpperCase()}</span>
                                                    <span className="text-slate-600 font-normal"> ({matchedMember.relation.toUpperCase()})</span>
                                                    {formatAgeDisplay(matchedMember.exactAgeText, matchedMember.dobOrAge || matchedMember.dob, matchedMember.age) && (
                                                        <span className="ml-1 text-slate-700 font-bold">• বয়স: {formatAgeDisplay(matchedMember.exactAgeText, matchedMember.dobOrAge || matchedMember.dob, matchedMember.age)}</span>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Body Meta Details */}
                                        <div className="space-y-2 text-xs text-slate-700 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
                                            <div className="flex items-center gap-2">
                                                <Phone size={14} className="text-[#1B8A44] flex-shrink-0" />
                                                <span className="font-mono text-[#1B8A44] font-bold">{rec.mobileNumber || 'মোবাইল অপ্রাপ্য'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin size={14} className="text-slate-500 flex-shrink-0" />
                                                <span className="truncate">{rec.presentAddress?.village || 'পটিয়া'}, ওয়ার্ড-৯</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Users size={14} className="text-[#0F2C59] flex-shrink-0" />
                                                <span>পরিবারের মোট সদস্য: <strong className="text-[#0F2C59] font-bold">{(rec.members?.length || 0) + 1} জন</strong></span>
                                            </div>
                                        </div>

                                        {/* Heir Names preview pills */}
                                        {rec.members && rec.members.length > 0 && (
                                            <div className="mb-4">
                                                <span className="text-[11px] font-bold text-slate-500 block mb-1">ওয়ারিশবৃন্দ (স্ত্রী/পুত্র/কন্যা):</span>
                                                <div className="flex flex-col gap-1.5">
                                                    {rec.members.slice(0, 4).map((m, idx) => {
                                                        const isThisMatched = matchedMember && matchedMember.id === m.id;
                                                        const memberAgeFormatted = formatAgeDisplay(m.exactAgeText, m.dobOrAge || m.dob, m.age);

                                                        return (
                                                            <div
                                                                key={idx}
                                                                className={`px-2.5 py-1 text-[11px] rounded-lg border font-medium flex items-center justify-between gap-1.5 flex-wrap ${isThisMatched
                                                                    ? 'bg-emerald-100 text-emerald-950 border-emerald-400 font-bold'
                                                                    : 'bg-slate-100/90 text-slate-800 border-slate-200'
                                                                    }`}
                                                            >
                                                                <span className="truncate">
                                                                    <strong>{m.name}</strong> <span className="text-slate-500">({m.relation})</span>
                                                                </span>
                                                                {memberAgeFormatted ? (
                                                                    <span className="text-[10px] text-slate-700 bg-slate-200/80 px-1.5 py-0.5 rounded font-semibold whitespace-nowrap">
                                                                        {memberAgeFormatted}
                                                                    </span>
                                                                ) : (
                                                                    m.gender && <span className="text-[10px] text-slate-500">{m.gender}</span>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                    {rec.members.length > 4 && (
                                                        <span className="text-center py-0.5 bg-emerald-50 text-[#1B8A44] text-[11px] rounded font-bold border border-emerald-200">
                                                            +{rec.members.length - 4} জন সদস্য আরও
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Card Action Footer */}
                                    <div className="pt-3 border-t border-slate-100 flex justify-between items-center gap-2">
                                        <button
                                            onClick={() => isLoggedIn ? onSelectRecord(rec) : router.push('/signin')}
                                            className="flex-1 py-2 bg-[#0F2C59] hover:bg-[#1B365D] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                                        >
                                            <Eye size={14} /> প্রোফাইল দেখুন
                                        </button>

                                        {isLoggedIn && (
                                            <button
                                                onClick={() => onEditRecord(rec)}
                                                className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-xs transition cursor-pointer border border-amber-200"
                                                title="সম্পাদনা করুন"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="mt-8 bg-white border-2 border-[#0F2C59]/20 p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="text-xs text-slate-600 font-medium text-center sm:text-left">
                                দেখাচ্ছে <strong className="text-[#0F2C59] font-mono">{startIndex + 1}</strong> থেকে{' '}
                                <strong className="text-[#0F2C59] font-mono">{endIndex}</strong> (সর্বমোট{' '}
                                <strong className="text-[#1B8A44] font-mono">{totalRecords}</strong> টি রেকর্ড)
                            </div>

                            <div className="flex items-center gap-1.5 flex-wrap justify-center">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={validCurrentPage === 1}
                                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-slate-800 rounded-lg text-xs font-bold transition cursor-pointer border border-slate-300 flex items-center gap-1"
                                >
                                    <ChevronLeft size={14} /> পূর্ববর্তী
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                                    <button
                                        key={pg}
                                        onClick={() => setCurrentPage(pg)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition cursor-pointer border ${validCurrentPage === pg
                                            ? 'bg-[#0F2C59] text-white border-[#0F2C59] shadow-xs'
                                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                                            }`}
                                    >
                                        {pg}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={validCurrentPage === totalPages}
                                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-slate-800 rounded-lg text-xs font-bold transition cursor-pointer border border-slate-300 flex items-center gap-1"
                                >
                                    পরবর্তী <ChevronRight size={14} />
                                </button>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-slate-600">
                                <span>প্রতি পেজে:</span>
                                <select
                                    value={pageSize}
                                    onChange={(e) => {
                                        setPageSize(Number(e.target.value));
                                        setCurrentPage(1);
                                    }}
                                    className="px-2 py-1 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold focus:outline-hidden cursor-pointer"
                                >
                                    <option value={12}>১২ টি</option>
                                    <option value={24}>২৪ টি</option>
                                    <option value={48}>৪৮ টি</option>
                                </select>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
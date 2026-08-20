'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/lib/AppContext';
import {
    Search,
    Filter,
    Users,
    User,
    Heart,
    Phone,
    MapPin,
    Calendar,
    RotateCcw,
    Printer,
    Eye,
    Hash,
    X,
    FileText,
    UserCheck,
    ChevronLeft,
    ChevronRight,
    Sparkles,
    Download,
    CheckCircle2,
    Home,
    LayoutList,
    UserSquare2
} from 'lucide-react';

function FilterPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { records } = useApp();

    // Search Filter States
    const [nameQuery, setNameQuery] = useState(searchParams.get('name') || '');
    const [formNoQuery, setFormNoQuery] = useState(searchParams.get('formNo') || '');
    const [generalQuery, setGeneralQuery] = useState(searchParams.get('search') || '');
    const [minAgeQuery, setMinAgeQuery] = useState(searchParams.get('minAge') || '');
    const [maxAgeQuery, setMaxAgeQuery] = useState(searchParams.get('maxAge') || '');
    const [selectedBloodGroup, setSelectedBloodGroup] = useState(searchParams.get('bloodGroup') || '');
    const [filterType, setFilterType] = useState(searchParams.get('filterType') || 'all'); // 'all', 'moholla', 'bloodDonor', 'temporary', 'regular'

    // View Mode: 'individual' (ব্যক্তিভিত্তিক আলাদা রো) vs 'family' (পরিবারভিত্তিক রো)
    const [userSelectedViewMode, setUserSelectedViewMode] = useState('individual');
    const viewMode = userSelectedViewMode;

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);

    const [dbRecords, setDbRecords] = useState(() => records || []);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch from Server API
    useEffect(() => {
        let isCancelled = false;
        const fetchFilteredFamilies = async () => {
            setIsLoading(true);
            try {
                const queryParams = new URLSearchParams();
                const searchInput = (nameQuery || generalQuery).trim();
                if (searchInput) queryParams.append('search', searchInput);
                if (formNoQuery) queryParams.append('formNo', formNoQuery.trim());
                if (selectedBloodGroup) queryParams.append('bloodGroup', selectedBloodGroup);
                if (filterType && filterType !== 'all') queryParams.append('filterType', filterType);
                if (minAgeQuery) queryParams.append('minAge', minAgeQuery.trim());
                if (maxAgeQuery) queryParams.append('maxAge', maxAgeQuery.trim());

                const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || '';
                const response = await fetch(`${serverUrl}/families?${queryParams.toString()}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (response.ok && !isCancelled) {
                    const data = await response.json();
                    setDbRecords(data);
                } else if (!isCancelled && records) {
                    setDbRecords(records);
                }
            } catch (error) {
                console.error("Error fetching filtered records:", error);
                if (!isCancelled && records) {
                    setDbRecords(records);
                }
            } finally {
                if (!isCancelled) {
                    setIsLoading(false);
                }
            }
        };

        const debounceTimer = setTimeout(() => {
            fetchFilteredFamilies();
        }, 250);

        return () => {
            isCancelled = true;
            clearTimeout(debounceTimer);
        };
    }, [nameQuery, formNoQuery, generalQuery, minAgeQuery, maxAgeQuery, selectedBloodGroup, filterType, records]);

    // Number parser for English & Bengali numerals
    const parseNumber = (val) => {
        if (!val && val !== 0) return null;
        const str = String(val).replace(/[০-৯]/g, d => '0123456789'['০১২৩৪৫৬৭৮৯'.indexOf(d)]).trim();
        const num = parseInt(str, 10);
        return isNaN(num) ? null : num;
    };

    const minAgeNum = parseNumber(minAgeQuery);
    const maxAgeNum = parseNumber(maxAgeQuery);

    // Inline Age Calculation Logic replacing calculateAge function
    const computeAgeDetails = (dobOrAgeVal) => {
        if (!dobOrAgeVal) return null;

        const str = String(dobOrAgeVal).trim();
        // Convert Bangla numbers to English digits for processing
        const normalizedStr = str.replace(/[০-৯]/g, d => '0123456789'['০১২৩৪৫৬৭৮৯'.indexOf(d)]);

        // Check if directly passed as an age number (e.g. 25, 30)
        const parsedDirect = parseInt(normalizedStr, 10);
        if (!isNaN(parsedDirect) && parsedDirect > 0 && parsedDirect < 150 && !normalizedStr.includes('/') && !normalizedStr.includes('-')) {
            return { years: parsedDirect, formattedTextShort: `${parsedDirect} বছর` };
        }

        // Try parsing Date of Birth (YYYY-MM-DD or DD/MM/YYYY)
        const dobDate = new Date(normalizedStr);
        if (!isNaN(dobDate.getTime())) {
            const today = new Date();
            let years = today.getFullYear() - dobDate.getFullYear();
            let months = today.getMonth() - dobDate.getMonth();
            let days = today.getDate() - dobDate.getDate();

            if (days < 0) {
                months--;
            }
            if (months < 0) {
                years--;
                months += 12;
            }

            if (years < 0) return null;

            return {
                years,
                formattedTextShort: `${years} বছর`
            };
        }

        return null;
    };

    // Age year extractor
    const getAgeYears = (dobOrAgeVal) => {
        const ageObj = computeAgeDetails(dobOrAgeVal);
        return ageObj ? ageObj.years : null;
    };

    // Format display age string
    const getDisplayAgeText = (dobOrAgeVal) => {
        if (!dobOrAgeVal) return 'তথ্য নেই';
        const ageObj = computeAgeDetails(dobOrAgeVal);
        if (ageObj && ageObj.formattedTextShort) {
            return ageObj.formattedTextShort;
        }
        const str = String(dobOrAgeVal).trim();
        if (/^\d{1,3}$/.test(str) || /^[০-৯]{1,3}$/.test(str)) {
            return `${str} বছর`;
        }
        return str;
    };

    // Filtered raw families
    const filteredFamilies = useMemo(() => {
        return dbRecords || [];
    }, [dbRecords]);

    // Flattened Individual Members Matching the Criteria
    const individualMembers = useMemo(() => {
        const list = [];

        const isBloodMatch = (bg) => {
            if (!selectedBloodGroup) return true;
            if (!bg) return false;
            return bg.trim().toUpperCase() === selectedBloodGroup.trim().toUpperCase();
        };

        const isAgeMatch = (dobOrAgeVal) => {
            if (minAgeNum === null && maxAgeNum === null) return true;
            const years = getAgeYears(dobOrAgeVal);
            if (years === null) return false;
            if (minAgeNum !== null && years < minAgeNum) return false;
            if (maxAgeNum !== null && years > maxAgeNum) return false;
            return true;
        };

        const isNameMatch = (name) => {
            if (!nameQuery.trim()) return true;
            if (!name) return false;
            return name.toLowerCase().includes(nameQuery.trim().toLowerCase());
        };

        const isGeneralMatch = (family, person) => {
            if (!generalQuery.trim()) return true;
            const q = generalQuery.trim().toLowerCase();
            const mobile = (person.mobileNumber || family.mobileNumber || '').toLowerCase();
            const nid = (family.nidNumber || family.nid || '').toLowerCase();
            const village = (family.presentAddress?.village || '').toLowerCase();
            const ward = (family.presentAddress?.ward || '').toLowerCase();
            return mobile.includes(q) || nid.includes(q) || village.includes(q) || ward.includes(q);
        };

        const isMemberTypeMatch = (family) => {
            if (!filterType || filterType === 'all') return true;
            if (filterType === 'moholla') return Boolean(family.isMohollaMember);
            if (filterType === 'bloodDonor') return Boolean(family.isBloodDonorMember);
            if (filterType === 'temporary') return Boolean(family.isTemporaryMember);
            if (filterType === 'regular') return !family.isMohollaMember && !family.isBloodDonorMember && !family.isTemporaryMember;
            return true;
        };

        filteredFamilies.forEach((family) => {
            if (!isMemberTypeMatch(family)) return;

            // 1. Check Head Member
            const headBloodOk = isBloodMatch(family.bloodGroup);
            const headAgeOk = isAgeMatch(family.dob || family.age);
            const headNameOk = isNameMatch(family.headName);
            const headGeneralOk = isGeneralMatch(family, family);

            if (headBloodOk && headAgeOk && headNameOk && headGeneralOk) {
                list.push({
                    id: (family._id || family.id) + '-head',
                    familyId: family._id || family.id,
                    isHead: true,
                    formNo: family.formNo,
                    name: family.headName,
                    relation: 'প্রধান সদস্য',
                    headName: family.headName,
                    bloodGroup: family.bloodGroup,
                    dobOrAge: family.dob || family.age,
                    displayAgeText: getDisplayAgeText(family.dob || family.age),
                    fatherName: family.fatherOrHusbandName || 'তথ্য নেই',
                    mobileNumber: family.mobileNumber || 'অপ্রাপ্য',
                    presentAddress: family.presentAddress,
                    isMohollaMember: family.isMohollaMember,
                    isBloodDonorMember: family.isBloodDonorMember,
                    isTemporaryMember: family.isTemporaryMember,
                    heirsCount: family.members?.length || 0,
                    familyRef: family
                });
            }

            // 2. Check Family Members / Heirs (ওয়ারিশগণ)
            if (family.members && family.members.length > 0) {
                family.members.forEach((mem, memIdx) => {
                    const memBloodOk = isBloodMatch(mem.bloodGroup);
                    const memAgeOk = isAgeMatch(mem.dobOrAge || mem.dob || mem.age);
                    const memNameOk = isNameMatch(mem.name);
                    const memGeneralOk = isGeneralMatch(family, mem);

                    if (memBloodOk && memAgeOk && memNameOk && memGeneralOk) {
                        list.push({
                            id: mem.id || `${family._id || family.id}-mem-${memIdx}`,
                            familyId: family._id || family.id,
                            isHead: false,
                            formNo: family.formNo,
                            name: mem.name,
                            relation: mem.relation || 'পরিবারের সদস্য',
                            headName: family.headName,
                            bloodGroup: mem.bloodGroup,
                            dobOrAge: mem.dobOrAge || mem.dob || mem.age,
                            displayAgeText: getDisplayAgeText(mem.dobOrAge || mem.dob || mem.age),
                            fatherName: mem.fatherName || `প্রধান সদস্য: ${family.headName}`,
                            mobileNumber: mem.mobileNumber || family.mobileNumber || 'অপ্রাপ্য',
                            presentAddress: family.presentAddress,
                            isMohollaMember: family.isMohollaMember,
                            isBloodDonorMember: family.isBloodDonorMember,
                            isTemporaryMember: family.isTemporaryMember,
                            heirsCount: family.members?.length || 0,
                            familyRef: family
                        });
                    }
                });
            }
        });

        return list;
    }, [filteredFamilies, selectedBloodGroup, minAgeNum, maxAgeNum, nameQuery, generalQuery, filterType]);

    // Active filters criteria descriptor list
    const activeFilters = useMemo(() => {
        const filters = [];
        if (nameQuery.trim()) filters.push({ key: 'name', label: `নাম: "${nameQuery.trim()}"` });
        if (formNoQuery.trim()) filters.push({ key: 'formNo', label: `ফরম নং: "${formNoQuery.trim()}"` });
        if (minAgeQuery.trim() || maxAgeQuery.trim()) {
            filters.push({
                key: 'age',
                label: `বয়স: ${minAgeQuery.trim() || '০'} হতে ${maxAgeQuery.trim() || '∞'} বছর`
            });
        }
        if (selectedBloodGroup) filters.push({ key: 'bloodGroup', label: `রক্তের গ্রুপ: ${selectedBloodGroup}` });
        if (generalQuery.trim()) filters.push({ key: 'general', label: `মোবাইল/এনআইডি/গ্রাম: "${generalQuery.trim()}"` });
        if (filterType === 'moholla') filters.push({ key: 'type', label: 'মেম্বার টাইপ: মহল্লা সদস্য' });
        if (filterType === 'bloodDonor') filters.push({ key: 'type', label: 'মেম্বার টাইপ: রক্ত দাতা সদস্য' });
        if (filterType === 'temporary') filters.push({ key: 'type', label: 'মেম্বার টাইপ: ভাড়াটিয়া/অস্থায়ী সদস্য' });
        if (filterType === 'regular') filters.push({ key: 'type', label: 'মেম্বার টাইপ: নিয়মিত সদস্য' });
        return filters;
    }, [nameQuery, formNoQuery, minAgeQuery, maxAgeQuery, selectedBloodGroup, generalQuery, filterType]);

    // Reset all filters
    const handleResetFilters = () => {
        setNameQuery('');
        setFormNoQuery('');
        setGeneralQuery('');
        setMinAgeQuery('');
        setMaxAgeQuery('');
        setSelectedBloodGroup('');
        setFilterType('all');
        setCurrentPage(1);
    };

    // Active data source based on viewMode
    const activeDataList = viewMode === 'individual' ? individualMembers : filteredFamilies;
    const totalCount = activeDataList.length;

    // Pagination calculation
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const validCurrentPage = Math.min(currentPage, totalPages);
    const startIndex = (validCurrentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalCount);
    const paginatedList = activeDataList.slice(startIndex, endIndex);

    const bloodGroups = ['N/A', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

    // Print trigger
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="max-w-7xl mx-auto my-6 px-3 sm:px-6 lg:px-8">
            {/* Printable Header (Visible only when printed) */}
            <div className="hidden print:block mb-5 text-center border-b-2 border-black pb-3">
                <h1 className="text-2xl font-black text-black">OMSKP মেম্বার ডাটা ব্যাংক</h1>
                <h2 className="text-base font-bold text-gray-800 mt-1">
                    মেম্বার ফিল্টারিং ও তথ্য রিপোর্ট
                    {viewMode === 'individual' ? ' (ব্যক্তিভিত্তিক আলাদা আলাদা রো তালিকা)' : ' (পরিবারভিত্তিক তালিকা)'}
                </h2>
                <div className="flex justify-between items-center text-xs text-gray-700 mt-2 px-2">
                    <div>
                        <strong>ফিল্টার শর্ত: </strong>
                        {activeFilters.length === 0 ? 'সকল মেম্বার' : activeFilters.map(f => f.label).join(' | ')}
                    </div>
                    <div>
                        <strong>মোট ফলাফল: </strong> {totalCount} {viewMode === 'individual' ? 'জন ব্যক্তি' : 'টি পরিবার'}
                        {' '}| <strong>তারিখ: </strong> {new Date().toLocaleDateString('bn-BD')}
                    </div>
                </div>
            </div>

            {/* Header & Title Section */}
            <div className="bg-white border-2 border-[#0F2C59]/30 rounded-2xl p-5 shadow-sm mb-6 print:hidden">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="p-2 bg-[#EBF5EE] text-[#1B8A44] rounded-xl border border-[#1B8A44]/30">
                                <Filter size={22} />
                            </span>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold text-[#0F2C59] font-serif">
                                    অ্যাডমিন ডাটা ফিল্টারিং ও মেম্বার ডিরেক্টরি
                                </h1>
                                <p className="text-xs text-slate-600 mt-0.5">
                                    বয়স, রক্তের গ্রুপ, মেম্বার টাইপ ও নাম দিয়ে ফিল্টার করুন এবং ব্যক্তিভিত্তিক বা পরিবারভিত্তিক রো প্রিন্ট করুন।
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                            onClick={handlePrint}
                            className="flex-1 sm:flex-none px-4 py-2.5 bg-[#0F2C59] hover:bg-[#1B365D] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                        >
                            <Printer size={15} />
                            <span>তালিকা প্রিন্ট করুন</span>
                        </button>
                        <Link
                            href="/"
                            className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition border border-slate-300 flex items-center justify-center gap-1.5 shadow-2xs"
                        >
                            <Home size={15} />
                            <span>হোম পেজ</span>
                        </Link>
                    </div>
                </div>

                {/* Multi-criteria Filter Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mt-5 pt-4 border-t border-slate-200">
                    {/* 1. Name Input */}
                    <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                            <User size={13} className="text-[#1B8A44]" />
                            মেম্বারের নাম
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={nameQuery}
                                onChange={(e) => { setNameQuery(e.target.value); setCurrentPage(1); }}
                                placeholder="প্রধান বা সদস্যের নাম..."
                                className="w-full px-3 py-2 pr-7 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-[#1B8A44] focus:outline-hidden"
                            />
                            {nameQuery && (
                                <button
                                    onClick={() => setNameQuery('')}
                                    className="absolute right-2 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                                >
                                    <X size={13} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* 2. Form No Input */}
                    <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                            <Hash size={13} className="text-[#0F2C59]" />
                            ফরম নম্বর
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={formNoQuery}
                                onChange={(e) => { setFormNoQuery(e.target.value); setCurrentPage(1); }}
                                placeholder="e.g. F-2026-001 / 001"
                                className="w-full px-3 py-2 pr-7 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:ring-2 focus:ring-[#1B8A44] focus:outline-hidden"
                            />
                            {formNoQuery && (
                                <button
                                    onClick={() => setFormNoQuery('')}
                                    className="absolute right-2 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                                >
                                    <X size={13} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* 3. Age Range Input */}
                    <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                            <Calendar size={13} className="text-amber-600" />
                            বয়স সীমা (মিন - ম্যাক্স)
                        </label>
                        <div className="grid grid-cols-2 gap-1.5">
                            <input
                                type="text"
                                value={minAgeQuery}
                                onChange={(e) => { setMinAgeQuery(e.target.value); setCurrentPage(1); }}
                                placeholder="মিন (১৮)"
                                className="w-full px-2 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:ring-2 focus:ring-[#1B8A44] focus:outline-hidden"
                            />
                            <input
                                type="text"
                                value={maxAgeQuery}
                                onChange={(e) => { setMaxAgeQuery(e.target.value); setCurrentPage(1); }}
                                placeholder="ম্যাক্স (৬০)"
                                className="w-full px-2 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:ring-2 focus:ring-[#1B8A44] focus:outline-hidden"
                            />
                        </div>
                    </div>

                    {/* 4. Blood Group Dropdown */}
                    <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                            <Heart size={13} className="text-rose-600" />
                            রক্তের গ্রুপ
                        </label>
                        <select
                            value={selectedBloodGroup}
                            onChange={(e) => { setSelectedBloodGroup(e.target.value); setCurrentPage(1); }}
                            className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-rose-700 font-bold focus:ring-2 focus:ring-[#1B8A44] focus:outline-hidden h-[36px] cursor-pointer"
                        >
                            <option value="">সকল রক্তের গ্রুপ</option>
                            {bloodGroups.map(bg => (
                                <option key={bg} value={bg}>গ্রুপ {bg}</option>
                            ))}
                        </select>
                    </div>

                    {/* 5. Mobile / NID / Village Input */}
                    <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                            <Phone size={13} className="text-emerald-600" />
                            মোবাইল / এনআইডি / গ্রাম
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={generalQuery}
                                onChange={(e) => { setGeneralQuery(e.target.value); setCurrentPage(1); }}
                                placeholder="মোবাইল, এনআইডি, গ্রাম..."
                                className="w-full px-3 py-2 pr-7 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-[#1B8A44] focus:outline-hidden"
                            />
                            {generalQuery && (
                                <button
                                    onClick={() => setGeneralQuery('')}
                                    className="absolute right-2 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                                >
                                    <X size={13} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* 6. Member Type Dropdown */}
                    <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                            <UserCheck size={13} className="text-[#1B8A44]" />
                            মেম্বার টাইপ
                        </label>
                        <select
                            value={filterType}
                            onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
                            className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 font-bold focus:ring-2 focus:ring-[#1B8A44] focus:outline-hidden h-[36px] cursor-pointer"
                        >
                            <option value="all">সকল মেম্বার</option>
                            <option value="moholla">মহল্লা সদস্য</option>
                            <option value="bloodDonor">রক্ত দাতা সদস্য</option>
                            <option value="temporary">ভাড়াটিয়া/অস্থায়ী সদস্য</option>
                            <option value="regular">সাধারণ সদস্য</option>
                        </select>
                    </div>
                </div>

                {/* Member Type Fast Filter Pills & View Mode Selector */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] font-bold text-slate-500 mr-1">দ্রুত ফিল্টার:</span>
                        <button
                            onClick={() => { setFilterType('all'); setCurrentPage(1); }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${filterType === 'all'
                                ? 'bg-[#0F2C59] text-white shadow-2xs'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                        >
                            সকল
                        </button>
                        <button
                            onClick={() => { setFilterType('moholla'); setCurrentPage(1); }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${filterType === 'moholla'
                                ? 'bg-emerald-600 text-white shadow-2xs'
                                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                                }`}
                        >
                            মহল্লা সদস্য
                        </button>
                        <button
                            onClick={() => { setFilterType('bloodDonor'); setCurrentPage(1); }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${filterType === 'bloodDonor'
                                ? 'bg-rose-600 text-white shadow-2xs'
                                : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
                                }`}
                        >
                            রক্ত দাতা
                        </button>
                        <button
                            onClick={() => { setFilterType('temporary'); setCurrentPage(1); }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${filterType === 'temporary'
                                ? 'bg-purple-600 text-white shadow-2xs'
                                : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200'
                                }`}
                        >
                            ভাড়াটিয়া/অস্থায়ী
                        </button>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap ml-auto">
                        {/* View Mode Toggle: Individual Row vs Family Row */}
                        <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-300">
                            <button
                                onClick={() => { setUserSelectedViewMode('individual'); setCurrentPage(1); }}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${viewMode === 'individual'
                                    ? 'bg-white text-[#0F2C59] shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                title="প্রতিটি ব্যক্তির আলাদা আলাদা রোতে প্রদর্শন"
                            >
                                <UserSquare2 size={13} className="text-[#1B8A44]" />
                                <span>ব্যক্তিভিত্তিক রো</span>
                            </button>
                            <button
                                onClick={() => { setUserSelectedViewMode('family'); setCurrentPage(1); }}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${viewMode === 'family'
                                    ? 'bg-white text-[#0F2C59] shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                title="পরিবারভিত্তিক রোতে প্রদর্শন"
                            >
                                <LayoutList size={13} className="text-[#0F2C59]" />
                                <span>পরিবারভিত্তিক রো</span>
                            </button>
                        </div>

                        <button
                            onClick={handleResetFilters}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border border-slate-300"
                        >
                            <RotateCcw size={13} />
                            <span>রিসেট</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Filter Summary & Stats Banner (Always visible in UI & Print) */}
            <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs mb-6 print:border print:border-black print:rounded-none print:p-2 print:mb-3">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs sm:text-sm font-bold text-slate-700">
                                ফিল্টারকৃত মোট সংখ্যা:
                            </span>
                            {viewMode === 'individual' ? (
                                <span className="px-3 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-full font-mono text-sm sm:text-base font-extrabold shadow-2xs">
                                    {totalCount} জন ব্যক্তি
                                </span>
                            ) : (
                                <span className="px-3 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-full font-mono text-sm sm:text-base font-extrabold shadow-2xs">
                                    {totalCount} টি পরিবার
                                </span>
                            )}
                            <span className="px-2.5 py-0.5 bg-blue-50 text-blue-900 border border-blue-200 rounded-full text-xs font-bold">
                                ভিউ মোড: {viewMode === 'individual' ? 'ব্যক্তিভিত্তিক আলাদা আলাদা রো' : 'পরিবারভিত্তিক'}
                            </span>
                        </div>

                        {/* Criteria summary tags */}
                        <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                            <span className="text-[11px] font-bold text-slate-500">ফিল্টার ক্রাইটেরিয়া:</span>
                            {activeFilters.length === 0 ? (
                                <span className="text-xs text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md font-medium">
                                    সকল ডাটা প্রদর্শিত হচ্ছে (কোন ফিল্টার প্রযোজ্য নয়)
                                </span>
                            ) : (
                                activeFilters.map((flt, idx) => (
                                    <span
                                        key={idx}
                                        className="text-[11px] font-bold px-2.5 py-0.5 bg-emerald-50 text-[#1B8A44] border border-emerald-300 rounded-md flex items-center gap-1 shadow-2xs print:border-black print:text-black"
                                    >
                                        <CheckCircle2 size={11} className="text-[#1B8A44] print:hidden" />
                                        {flt.label}
                                    </span>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="text-right text-xs text-slate-500 print:hidden">
                        <span>রিপোর্ট তৈরির সময়: {new Date().toLocaleDateString('bn-BD')}</span>
                    </div>
                </div>
            </div>

            {/* Main Results Table */}
            {isLoading ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-600">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1B8A44] mx-auto mb-3"></div>
                    <h3 className="text-base font-bold text-slate-800">ডাটা লোড হচ্ছে...</h3>
                    <p className="text-xs text-slate-500 mt-1">অনুগ্রহ করে অপেক্ষা করুন, সার্ভার থেকে তথ্য নিয়ে আসা হচ্ছে।</p>
                </div>
            ) : paginatedList.length === 0 ? (
                <div className="bg-white border-2 border-slate-200 rounded-2xl p-12 text-center text-slate-600">
                    <FileText size={48} className="mx-auto text-slate-400 mb-3" />
                    <h3 className="text-lg font-bold text-slate-800">কোন ফলাফল পাওয়া যায়নি</h3>
                    <p className="text-xs text-slate-500 mt-1">
                        আপনার নির্বাচিত ফিল্টার শর্তাবলীর সাথে মিল রয়েছে এমন কোনো মেম্বার বর্তমানে নেই।
                    </p>
                    <button
                        onClick={handleResetFilters}
                        className="mt-4 px-4 py-2 bg-[#1B8A44] hover:bg-[#156d35] text-white rounded-xl text-xs font-bold cursor-pointer transition shadow-sm"
                    >
                        ফিল্টার রিসেট করুন
                    </button>
                </div>
            ) : viewMode === 'individual' ? (
                /* ------------------------------------------------------------- */
                /* 1. INDIVIDUAL MEMBERS TABLE (ব্যক্তিভিত্তিক আলাদা আলাদা রো)   */
                /* ------------------------------------------------------------- */
                <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-6 print:border print:border-black print:rounded-none print:shadow-none">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse print:text-[10px]">
                            <thead>
                                <tr className="bg-[#0F2C59] text-white font-serif tracking-wide border-b border-[#1B8A44] print:bg-gray-100 print:text-black print:border-black">
                                    <th className="py-3 px-2.5 text-center w-12 font-bold border-r border-white/10 print:border-black">ক্রমি.</th>
                                    <th className="py-3 px-3 w-24 font-bold border-r border-white/10 print:border-black">ফরম নং</th>
                                    <th className="py-3 px-3 w-28 font-bold border-r border-white/10 print:border-black">মেম্বার টাইপ</th>
                                    <th className="py-3 px-4 w-52 font-bold border-r border-white/10 print:border-black">নাম (সম্পর্ক) ও রক্তের গ্রুপ</th>
                                    <th className="py-3 px-3 w-24 font-bold border-r border-white/10 print:border-black">বয়স</th>
                                    <th className="py-3 px-4 w-40 font-bold border-r border-white/10 print:border-black">পিতার/স্বামীর নাম</th>
                                    <th className="py-3 px-3 w-28 font-bold border-r border-white/10 print:border-black">ফোন নম্বর</th>
                                    <th className="py-3 px-4 w-44 font-bold border-r border-white/10 print:border-black">প্রেজেন্ট অ্যাড্রেস</th>
                                    <th className="py-3 px-3 text-center w-24 font-bold print:hidden">অ্যাকশন</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 print:divide-black">
                                {paginatedList.map((person, index) => {
                                    const sl = startIndex + index + 1;

                                    return (
                                        <tr
                                            key={person._id || index}
                                            className="hover:bg-slate-50/80 transition-colors group align-top print:border-b print:border-black"
                                        >
                                            {/* 1. SL */}
                                            <td className="py-3 px-2.5 text-center font-mono font-bold text-slate-500 border-r border-slate-100 print:border-black print:text-black">
                                                {sl}
                                            </td>

                                            {/* 2. Form No */}
                                            <td className="py-3 px-3 border-r border-slate-100 print:border-black">
                                                <span className="px-2 py-0.5 bg-[#EBF5EE] text-[#0F2C59] border border-[#1B8A44]/30 rounded font-mono font-bold text-[11px] block text-center whitespace-nowrap print:bg-transparent print:border-none print:text-black">
                                                    {person.formNo || 'N/A'}
                                                </span>
                                            </td>

                                            {/* 3. Member Type Badge */}
                                            <td className="py-3 px-3 border-r border-slate-100 print:border-black">
                                                <div className="flex flex-col gap-1">
                                                    {person.isHead ? (
                                                        <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-200 rounded text-center whitespace-nowrap print:border print:border-black print:bg-transparent print:text-black">
                                                            প্রধান সদস্য
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-200 rounded text-center whitespace-nowrap print:border print:border-black print:bg-transparent print:text-black">
                                                            পরিবারের সদস্য
                                                        </span>
                                                    )}

                                                    {person.isMohollaMember && (
                                                        <span className="px-1.5 py-0.2 text-[9px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-center whitespace-nowrap print:hidden">
                                                            মহল্লা
                                                        </span>
                                                    )}
                                                    {person.isBloodDonorMember && (
                                                        <span className="px-1.5 py-0.2 text-[9px] font-bold bg-rose-50 text-rose-800 border border-rose-200 rounded text-center whitespace-nowrap print:hidden">
                                                            রক্ত দাতা
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* 4. Name, Relation, Head Name & Blood Group */}
                                            <td className="py-3 px-4 border-r border-slate-100 print:border-black">
                                                <div>
                                                    {person.isHead ? (
                                                        <div className="font-bold text-slate-900 text-sm font-serif group-hover:text-[#1B8A44] transition-colors leading-snug print:text-[11px] print:text-black">
                                                            {person.name}
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            {/* ব্যাক্তির নামের পাশে (সম্পর্ক) */}
                                                            <div className="font-bold text-slate-900 text-sm font-serif group-hover:text-[#1B8A44] transition-colors leading-snug print:text-[11px] print:text-black">
                                                                {person.name}{' '}
                                                                {person.relation && (
                                                                    <span className="text-slate-600 font-sans text-xs font-semibold print:text-black">
                                                                        ({person.relation})
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {/* নামের নিচে মূল সদস্য নাম */}
                                                            <div className="text-[11px] text-slate-500 font-medium mt-0.5 flex items-center gap-1 print:text-[10px] print:text-black">
                                                                <span>মূল সদস্য:</span>
                                                                <strong className="text-[#0F2C59] print:text-black">{person.headName}</strong>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {person.bloodGroup && (
                                                        <span className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.2 bg-rose-50 text-rose-700 border border-rose-200 rounded text-[10px] font-bold font-mono print:border print:border-black print:bg-transparent print:text-black">
                                                            <Heart size={10} fill="currentColor" className="print:hidden" /> {person.bloodGroup}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* 5. Age */}
                                            <td className="py-3 px-3 border-r border-slate-100 print:border-black">
                                                <div className="text-slate-800 font-semibold whitespace-nowrap print:text-black">
                                                    {person.displayAgeText}
                                                </div>
                                            </td>

                                            {/* 6. Father / Husband Name */}
                                            <td className="py-3 px-4 border-r border-slate-100 print:border-black">
                                                <div className="text-slate-800 font-medium print:text-black">
                                                    {person.fatherName}
                                                </div>
                                            </td>

                                            {/* 7. Phone */}
                                            <td className="py-3 px-3 border-r border-slate-100 print:border-black">
                                                <div className="font-mono text-slate-800 font-semibold whitespace-nowrap print:text-black">
                                                    {person.mobileNumber}
                                                </div>
                                            </td>

                                            {/* 8. Present Address */}
                                            <td className="py-3 px-4 border-r border-slate-100 print:border-black">
                                                <div className="text-slate-700 leading-snug print:text-black">
                                                    {person.presentAddress?.village ? (
                                                        <>
                                                            <span>{person.presentAddress.village}</span>
                                                            {person.presentAddress.ward && (
                                                                <span className="text-slate-500 text-[11px] block print:text-black">
                                                                    ওয়ার্ড: {person.presentAddress.ward}
                                                                </span>
                                                            )}
                                                        </>
                                                    ) : (
                                                        'পটিয়া, চট্টগ্রাম'
                                                    )}
                                                </div>
                                            </td>

                                            {/* 9. Action (Hidden in print) */}
                                            <td className="py-3 px-3 text-center print:hidden">
                                                <button
                                                    onClick={() => router.push(`/member-profile/${person.familyId}`)}
                                                    className="px-2.5 py-1.5 bg-[#0F2C59] hover:bg-[#1B365D] text-white rounded-lg text-[11px] font-bold inline-flex items-center gap-1 transition shadow-2xs cursor-pointer whitespace-nowrap"
                                                    title="বিস্তারিত পরিবার প্রোফাইল দেখুন"
                                                >
                                                    <Eye size={12} />
                                                    <span>প্রোফাইল</span>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Bar */}
                    {totalPages > 1 && (
                        <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
                            <div className="text-xs text-slate-600 font-medium">
                                দেখাচ্ছে <strong className="text-[#0F2C59] font-mono">{startIndex + 1}</strong> হতে{' '}
                                <strong className="text-[#0F2C59] font-mono">{endIndex}</strong> (সর্বমোট{' '}
                                <strong className="text-[#1B8A44] font-mono">{totalCount}</strong> জন ব্যক্তি)
                            </div>

                            <div className="flex items-center gap-1.5 flex-wrap justify-center">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={validCurrentPage === 1}
                                    className="px-3 py-1.5 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-800 rounded-lg text-xs font-bold transition border border-slate-300 flex items-center gap-1 cursor-pointer"
                                >
                                    <ChevronLeft size={14} /> পূর্ববর্তী
                                </button>

                                {Array.from({ length: Math.min(totalPages, 8) }, (_, i) => {
                                    let pg = i + 1;
                                    if (totalPages > 8 && validCurrentPage > 4) {
                                        pg = validCurrentPage - 4 + i;
                                        if (pg > totalPages) pg = totalPages - (7 - i);
                                    }
                                    return (
                                        <button
                                            key={pg}
                                            onClick={() => setCurrentPage(pg)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition cursor-pointer border ${validCurrentPage === pg
                                                ? 'bg-[#0F2C59] text-white border-[#0F2C59] shadow-2xs'
                                                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                                                }`}
                                        >
                                            {pg}
                                        </button>
                                    );
                                })}

                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={validCurrentPage === totalPages}
                                    className="px-3 py-1.5 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-800 rounded-lg text-xs font-bold transition border border-slate-300 flex items-center gap-1 cursor-pointer"
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
                                    className="px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold focus:outline-hidden cursor-pointer"
                                >
                                    <option value={10}>১০ জন</option>
                                    <option value={25}>২৫ জন</option>
                                    <option value={50}>৫০ জন</option>
                                    <option value={100}>১০০ জন</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                /* ------------------------------------------------------------- */
                /* 2. FAMILY GROUP TABLE (পরিবারভিত্তিক রো)                     */
                /* ------------------------------------------------------------- */
                <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-6 print:border print:border-black print:rounded-none print:shadow-none">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse print:text-[10px]">
                            <thead>
                                <tr className="bg-[#0F2C59] text-white font-serif tracking-wide border-b border-[#1B8A44] print:bg-gray-100 print:text-black print:border-black">
                                    <th className="py-3 px-3 text-center w-12 font-bold border-r border-white/10 print:border-black">ক্রমি.</th>
                                    <th className="py-3 px-3 w-28 font-bold border-r border-white/10 print:border-black">ফরম নং</th>
                                    <th className="py-3 px-3 w-32 font-bold border-r border-white/10 print:border-black">মেম্বার টাইপ</th>
                                    <th className="py-3 px-4 w-44 font-bold border-r border-white/10 print:border-black">নাম ও রক্ত</th>
                                    <th className="py-3 px-3 w-28 font-bold border-r border-white/10 print:border-black">বয়স</th>
                                    <th className="py-3 px-4 w-40 font-bold border-r border-white/10 print:border-black">পিতার/স্বামীর নাম</th>
                                    <th className="py-3 px-3 w-32 font-bold border-r border-white/10 print:border-black">ফোন নম্বর</th>
                                    <th className="py-3 px-4 w-44 font-bold border-r border-white/10 print:border-black">প্রেজেন্ট অ্যাড্রেস</th>
                                    <th className="py-3 px-4 font-bold border-r border-white/10 print:border-black">ওয়ারিশবৃন্দ - নাম (সম্পর্ক)</th>
                                    <th className="py-3 px-3 text-center w-24 font-bold print:hidden">অ্যাকশন</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 print:divide-black">
                                {paginatedList.map((family, index) => {
                                    const sl = startIndex + index + 1;
                                    const headAge = getDisplayAgeText(family.dob || family.age);
                                    const heirs = family.members || [];

                                    return (
                                        <tr
                                            key={family._id || family.id || index}
                                            className="hover:bg-slate-50/80 transition-colors group align-top print:border-b print:border-black"
                                        >
                                            {/* 1. SL */}
                                            <td className="py-3 px-3 text-center font-mono font-bold text-slate-500 border-r border-slate-100 print:border-black print:text-black">
                                                {sl}
                                            </td>

                                            {/* 2. Form No */}
                                            <td className="py-3 px-3 border-r border-slate-100 print:border-black">
                                                <span className="px-2 py-0.5 bg-[#EBF5EE] text-[#0F2C59] border border-[#1B8A44]/30 rounded font-mono font-bold text-[11px] block text-center whitespace-nowrap print:bg-transparent print:border-none print:text-black">
                                                    {family.formNo || 'N/A'}
                                                </span>
                                            </td>

                                            {/* 3. Member Type */}
                                            <td className="py-3 px-3 border-r border-slate-100 print:border-black">
                                                <div className="flex flex-col gap-1">
                                                    {family.isMohollaMember && (
                                                        <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 rounded text-center whitespace-nowrap print:border print:border-black print:bg-transparent print:text-black">
                                                            মহল্লা সদস্য
                                                        </span>
                                                    )}
                                                    {family.isBloodDonorMember && (
                                                        <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 rounded text-center whitespace-nowrap print:border print:border-black print:bg-transparent print:text-black">
                                                            রক্ত দাতা সদস্য
                                                        </span>
                                                    )}
                                                    {family.isTemporaryMember && (
                                                        <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200 rounded text-center whitespace-nowrap print:border print:border-black print:bg-transparent print:text-black">
                                                            ভাড়াটিয়া/অস্থায়ী
                                                        </span>
                                                    )}
                                                    {!family.isMohollaMember && !family.isBloodDonorMember && !family.isTemporaryMember && (
                                                        <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 rounded text-center whitespace-nowrap print:border print:border-black print:bg-transparent print:text-black">
                                                            নিয়মিত সদস্য
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* 4. Name & Blood Group */}
                                            <td className="py-3 px-4 border-r border-slate-100 print:border-black">
                                                <div className="font-bold text-slate-900 text-sm font-serif group-hover:text-[#1B8A44] transition-colors leading-snug print:text-[11px] print:text-black">
                                                    {family.headName}
                                                </div>
                                                {family.bloodGroup && (
                                                    <span className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.2 bg-rose-50 text-rose-700 border border-rose-200 rounded text-[10px] font-bold font-mono print:border print:border-black print:bg-transparent print:text-black">
                                                        <Heart size={10} fill="currentColor" className="print:hidden" /> {family.bloodGroup}
                                                    </span>
                                                )}
                                            </td>

                                            {/* 5. Age */}
                                            <td className="py-3 px-3 border-r border-slate-100 print:border-black">
                                                <div className="text-slate-700 font-medium print:text-black">
                                                    {headAge}
                                                </div>
                                            </td>

                                            {/* 6. Father / Husband Name */}
                                            <td className="py-3 px-4 border-r border-slate-100 print:border-black">
                                                <div className="text-slate-800 font-medium print:text-black">
                                                    {family.fatherOrHusbandName || 'তথ্য নেই'}
                                                </div>
                                            </td>

                                            {/* 7. Phone */}
                                            <td className="py-3 px-3 border-r border-slate-100 print:border-black">
                                                <div className="font-mono text-slate-800 font-semibold whitespace-nowrap print:text-black">
                                                    {family.mobileNumber || 'অপ্রাপ্য'}
                                                </div>
                                            </td>

                                            {/* 8. Present Address */}
                                            <td className="py-3 px-4 border-r border-slate-100 print:border-black">
                                                <div className="text-slate-700 leading-snug print:text-black">
                                                    {family.presentAddress?.village ? (
                                                        <>
                                                            <span>{family.presentAddress.village}</span>
                                                            {family.presentAddress.ward && (
                                                                <span className="text-slate-500 text-[11px] block print:text-black">
                                                                    ওয়ার্ড: {family.presentAddress.ward}
                                                                </span>
                                                            )}
                                                        </>
                                                    ) : (
                                                        'পটিয়া, চট্টগ্রাম'
                                                    )}
                                                </div>
                                            </td>

                                            {/* 9. Heirs - Name (Relation) */}
                                            <td className="py-3 px-4 border-r border-slate-100 print:border-black">
                                                {heirs.length === 0 ? (
                                                    <span className="text-slate-400 italic text-[11px]">কোন সদস্য তালিকাভুক্ত নেই</span>
                                                ) : (
                                                    <div className="flex flex-wrap gap-1.5 max-w-md">
                                                        {heirs.map((mem, memIdx) => (
                                                            <span
                                                                key={memIdx}
                                                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-800 border border-slate-200 rounded-md text-[11px] leading-tight print:bg-transparent print:border print:border-black print:text-black"
                                                            >
                                                                <strong className="text-slate-900 print:text-black">{mem.name}</strong>
                                                                {mem.relation && <span className="text-slate-500 print:text-black">({mem.relation})</span>}
                                                                {mem.bloodGroup && (
                                                                    <span className="text-rose-600 font-mono font-bold text-[10px] print:text-black">[{mem.bloodGroup}]</span>
                                                                )}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </td>

                                            {/* 10. Actions */}
                                            <td className="py-3 px-3 text-center print:hidden">
                                                <button
                                                    onClick={() => router.push(`/member-profile/${family._id || family.id}`)}
                                                    className="px-2.5 py-1.5 bg-[#0F2C59] hover:bg-[#1B365D] text-white rounded-lg text-[11px] font-bold inline-flex items-center gap-1 transition shadow-2xs cursor-pointer whitespace-nowrap"
                                                    title="বিস্তারিত পরিবার প্রোফাইল দেখুন"
                                                >
                                                    <Eye size={12} />
                                                    <span>প্রোফাইল</span>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Bar */}
                    {totalPages > 1 && (
                        <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
                            <div className="text-xs text-slate-600 font-medium">
                                দেখাচ্ছে <strong className="text-[#0F2C59] font-mono">{startIndex + 1}</strong> হতে{' '}
                                <strong className="text-[#0F2C59] font-mono">{endIndex}</strong> (সর্বমোট{' '}
                                <strong className="text-[#1B8A44] font-mono">{totalCount}</strong> টি পরিবার)
                            </div>

                            <div className="flex items-center gap-1.5 flex-wrap justify-center">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={validCurrentPage === 1}
                                    className="px-3 py-1.5 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-800 rounded-lg text-xs font-bold transition border border-slate-300 flex items-center gap-1 cursor-pointer"
                                >
                                    <ChevronLeft size={14} /> পূর্ববর্তী
                                </button>

                                {Array.from({ length: Math.min(totalPages, 8) }, (_, i) => {
                                    let pg = i + 1;
                                    if (totalPages > 8 && validCurrentPage > 4) {
                                        pg = validCurrentPage - 4 + i;
                                        if (pg > totalPages) pg = totalPages - (7 - i);
                                    }
                                    return (
                                        <button
                                            key={pg}
                                            onClick={() => setCurrentPage(pg)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition cursor-pointer border ${validCurrentPage === pg
                                                ? 'bg-[#0F2C59] text-white border-[#0F2C59] shadow-2xs'
                                                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                                                }`}
                                        >
                                            {pg}
                                        </button>
                                    );
                                })}

                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={validCurrentPage === totalPages}
                                    className="px-3 py-1.5 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-800 rounded-lg text-xs font-bold transition border border-slate-300 flex items-center gap-1 cursor-pointer"
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
                                    className="px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold focus:outline-hidden cursor-pointer"
                                >
                                    <option value={10}>১০ টি</option>
                                    <option value={25}>২৫ টি</option>
                                    <option value={50}>৫০ টি</option>
                                    <option value={100}>১০০ টি</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default function FilterPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-slate-500">লোড হচ্ছে...</div>}>
            <FilterPageContent />
        </Suspense>
    );
}
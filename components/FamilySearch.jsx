'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { searchRecords, isHeadOfAnyRecord } from '../lib/storage';
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
  UserCheck
} from 'lucide-react';

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
  const [selectedBloodGroup, setSelectedBloodGroup] = useState(initialBloodGroup);
  const [filterType, setFilterType] = useState('all'); // 'all', 'moholla', 'bloodDonor', 'temporary', 'regular'

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  useEffect(() => {
    if (initialBloodGroup) {
      setSelectedBloodGroup(initialBloodGroup);
    }
  }, [initialBloodGroup]);

  const [dbRecords, setDbRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRecords = async () => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams();
        const searchInput = (nameQuery || generalQuery).trim();
        if (searchInput) queryParams.append('search', searchInput);
        if (formNoQuery) queryParams.append('formNo', formNoQuery);
        if (selectedBloodGroup) queryParams.append('bloodGroup', selectedBloodGroup);
        if (filterType !== 'all') queryParams.append('filterType', filterType);

        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/families?${queryParams.toString()}`);
        if (response.ok) {
          const data = await response.json();
          setDbRecords(data);
        }
      } catch (error) {
        console.error("Error fetching records:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchRecords();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [nameQuery, generalQuery, formNoQuery, selectedBloodGroup, filterType]);

  const handleNameChange = (val) => { setNameQuery(val); setCurrentPage(1); };
  const handleFormNoChange = (val) => { setFormNoQuery(val); setCurrentPage(1); };
  const handleGeneralChange = (val) => { setGeneralQuery(val); setCurrentPage(1); };
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

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  const resetFilters = () => {
    setNameQuery('');
    setFormNoQuery('');
    setGeneralQuery('');
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
              প্রধান সদস্যের নাম, ফরম নম্বর অথবা স্ত্রী/পুত্র/কন্যা (পরিবার সদস্যদের) নাম দিয়ে খুঁজুন।
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Separate Name Input Field */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
              <User size={13} className="text-[#1B8A44]" />
              নাম / স্ত্রী / সন্তান (বাংলা / English)
            </label>
            <div className="relative">
              <input
                type="text"
                value={nameQuery}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="প্রধান বা স্ত্রী/সন্তানের নাম..."
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
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <UserCheck size={14} className="text-[#1B8A44]" /> মেম্বার টাইপ:
            </span>
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-300 flex-wrap gap-1">
              <button
                onClick={() => handleFilterTypeChange('all')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${filterType === 'all'
                  ? 'bg-[#0F2C59] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                সকল মেম্বার
              </button>
              <button
                onClick={() => handleFilterTypeChange('moholla')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${filterType === 'moholla'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-800 hover:text-emerald-900'
                  }`}
              >
                <span>মহল্লা সদস্য</span>
              </button>
              <button
                onClick={() => handleFilterTypeChange('bloodDonor')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${filterType === 'bloodDonor'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-rose-800 hover:text-rose-900'
                  }`}
              >
                <span>রক্ত দাতা সদস্য</span>
              </button>
              <button
                onClick={() => handleFilterTypeChange('temporary')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${filterType === 'temporary'
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
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer border border-slate-300 ml-auto"
          >
            <RotateCcw size={13} /> ফিল্টার রিসেট
          </button>
        </div>

        {/* Results Counter & Summary */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
          <span>
            সর্বমোট প্রাপ্ত ফলাফল: <strong className="text-[#1B8A44] font-mono text-sm">{totalRecords}</strong> টি পরিবার
            {filterType === 'moholla' && <span className="ml-1 text-emerald-700 font-bold">(কেবল মহল্লা সদস্য)</span>}
            {filterType === 'bloodDonor' && <span className="ml-1 text-rose-700 font-bold">(কেবল রক্ত দাতা সদস্য)</span>}
            {filterType === 'temporary' && <span className="ml-1 text-purple-700 font-bold">(কেবল ভাড়াটিয়া/অস্থায়ী সদস্য)</span>}
          </span>

          {/* <div className="flex flex-wrap gap-1">
            {bloodGroups.map(bg => {
              const count = records.filter(r => r.bloodGroup === bg || (r.members && r.members.some(m => m.bloodGroup === bg && !isHeadOfAnyRecord(m.name, records, r.id)))).length;
              if (count === 0) return null;
              return (
                <button
                  key={bg}
                  onClick={() => setSelectedBloodGroup(selectedBloodGroup === bg ? '' : bg)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold border transition cursor-pointer ${selectedBloodGroup === bg
                      ? 'bg-rose-600 text-white border-rose-500 shadow-xs'
                      : 'bg-rose-50 text-rose-700 border-rose-200 hover:border-rose-400'
                    }`}
                >
                  {bg}: {count}
                </button>
              );
            })}
          </div> */}
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

              return (
                <div
                  key={rec.id}
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
                        <h3 className="text-lg font-bold text-[#0F2C59] font-serif group-hover:text-[#1B8A44] transition flex items-center gap-2">
                          <span>{rec.headName}</span>
                        </h3>
                        {rec.fatherOrHusbandName && (
                          <p className="text-xs text-slate-600 font-medium mt-0.5 flex items-center gap-1">
                            <User size={13} className="text-[#1B8A44] flex-shrink-0" />
                            <span>পিতার নাম: <strong className="text-slate-800 font-semibold">{rec.fatherOrHusbandName}</strong></span>
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
                          <span className="text-[10px] text-emerald-700 block uppercase font-bold">সার্চ অনুযায়ী খুঁজে পাওয়া মেম্বার:</span>
                          <span className="font-bold text-[#1B8A44]">{matchedMember.name}</span>
                          <span className="text-slate-600 font-normal"> ({matchedMember.relation})</span>
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
                        <div className="flex flex-wrap gap-1">
                          {rec.members.slice(0, 3).map((m, idx) => {
                            const isThisMatched = matchedMember && matchedMember.id === m.id;
                            return (
                              <span
                                key={idx}
                                className={`px-2 py-0.5 text-[11px] rounded border font-medium ${isThisMatched
                                  ? 'bg-emerald-100 text-emerald-900 border-emerald-400 font-bold'
                                  : 'bg-slate-100 text-slate-700 border-slate-200'
                                  }`}
                              >
                                {m.name} ({m.relation})
                              </span>
                            );
                          })}
                          {rec.members.length > 3 && (
                            <span className="px-2 py-0.5 bg-emerald-50 text-[#1B8A44] text-[11px] rounded font-bold border border-emerald-200">
                              +{rec.members.length - 3} আরও
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

                    {/* <button
                      onClick={() => onPrintRecord(rec)}
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs transition cursor-pointer border border-slate-200"
                      title="ফরম প্রিন্ট করুন"
                    >
                      <Printer size={16} />
                    </button> */}

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

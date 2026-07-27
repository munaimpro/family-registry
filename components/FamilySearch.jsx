'use client';

import React, { useState } from 'react';
import { searchRecords } from '@/lib/storage';
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
  Plus
} from 'lucide-react';

export const FamilySearch = ({
  records,
  onSelectRecord,
  onEditRecord,
  onPrintRecord,
  onAddNew,
}) => {
  const [query, setQuery] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredRecords = searchRecords(records, query, selectedBloodGroup, statusFilter);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  const resetFilters = () => {
    setQuery('');
    setSelectedBloodGroup('');
    setStatusFilter('');
  };

  return (
    <div className="max-w-7xl mx-auto my-6 px-4">
      {/* Search & Filter Control Panel */}
      <div className="bg-white border-2 border-[#0F2C59]/30 p-5 rounded-2xl shadow-md mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-[#0F2C59] font-serif flex items-center gap-2">
              <Search className="text-[#1B8A44]" size={20} /> পরিবার ডিরেক্টরি ও অনুসন্ধান
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              ফরম নম্বর, নাম, রক্তের গ্রুপ বা মোবাইল নম্বর দিয়ে দ্রুত সার্চ করুন
            </p>
          </div>

          <button
            onClick={onAddNew}
            className="px-4 py-2 bg-[#1B8A44] hover:bg-[#156d35] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition cursor-pointer self-stretch lg:self-auto justify-center"
          >
            <Plus size={16} /> নতুন ফ্যামিলি যুক্ত করুন
          </button>
        </div>

        {/* Input Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Query Text Box */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="নাম, ফরম নং, মোবাইল, এনআইডি..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-[#1B8A44] focus:outline-hidden"
            />
          </div>

          {/* Blood Group Filter */}
          <div className="relative">
            <select
              value={selectedBloodGroup}
              onChange={(e) => setSelectedBloodGroup(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm text-rose-700 font-bold focus:ring-2 focus:ring-[#1B8A44] focus:outline-hidden"
            >
              <option value="">সকল রক্তের গ্রুপ (All)</option>
              {bloodGroups.map(bg => (
                <option key={bg} value={bg}>রক্তের গ্রুপ {bg}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-[#1B8A44] focus:outline-hidden"
            >
              <option value="">সকল স্ট্যাটাস</option>
              <option value="verified">যাচাইকৃত (Verified)</option>
              <option value="pending">অপেক্ষমাণ (Pending)</option>
            </select>
          </div>

          {/* Reset Filters */}
          <div>
            <button
              onClick={resetFilters}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer border border-slate-300"
            >
              <RotateCcw size={14} /> ফিল্টার রিসেট করুন
            </button>
          </div>
        </div>

        {/* Results Counter & Blood Pills */}
        <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
          <span>
            সর্বমোট প্রাপ্ত ফলাফল: <strong className="text-[#1B8A44] font-mono text-sm">{filteredRecords.length}</strong> টি পরিবার
          </span>

          <div className="flex flex-wrap gap-1">
            {bloodGroups.map(bg => {
              const count = records.filter(r => r.bloodGroup === bg || r.members.some(m => m.bloodGroup === bg)).length;
              if (count === 0) return null;
              return (
                <button
                  key={bg}
                  onClick={() => setSelectedBloodGroup(selectedBloodGroup === bg ? '' : bg)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold border transition cursor-pointer ${
                    selectedBloodGroup === bg
                      ? 'bg-rose-600 text-white border-rose-500 shadow-xs'
                      : 'bg-rose-50 text-rose-700 border-rose-200 hover:border-rose-400'
                  }`}
                >
                  {bg}: {count}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid of Family Cards */}
      {filteredRecords.length === 0 ? (
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-12 text-center text-slate-600">
          <FileText size={48} className="mx-auto text-slate-400 mb-3" />
          <h3 className="text-lg font-bold text-slate-800">কোন পরিবারের তথ্য পাওয়া যায়নি</h3>
          <p className="text-xs text-slate-500 mt-1">
            আপনার প্রদানকৃত সার্চ ফিল্টার অনুযায়ী কোন ফলাফল নেই। অনুগ্রহ করে পুনরায় চেষ্টা করুন।
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 px-4 py-2 bg-[#1B8A44] hover:bg-[#156d35] text-white rounded-lg text-xs font-bold cursor-pointer"
          >
            ফিল্টার রিসেট করুন
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRecords.map((rec) => (
            <div
              key={rec.id}
              className="bg-white border-2 border-slate-200 hover:border-[#1B8A44] rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                {/* Top Header Card Info */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-[11px] uppercase font-mono font-bold tracking-wider text-[#0F2C59] bg-[#EBF5EE] px-2.5 py-1 rounded-md border border-[#1B8A44]/30 inline-block mb-1">
                      ফরম নং: {rec.formNo}
                    </span>
                    <h3 className="text-lg font-bold text-[#0F2C59] font-serif group-hover:text-[#1B8A44] transition">
                      {rec.headName}
                    </h3>
                  </div>
                  {rec.bloodGroup && (
                    <span className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs">
                      <Heart size={12} fill="currentColor" /> {rec.bloodGroup}
                    </span>
                  )}
                </div>

                {/* Body Meta Details */}
                <div className="space-y-2 text-xs text-slate-700 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-[#1B8A44] flex-shrink-0" />
                    <span className="font-mono text-[#1B8A44] font-bold">{rec.mobileNumber}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-slate-500 flex-shrink-0" />
                    <span className="truncate">{rec.presentAddress.village}, ওয়ার্ড-৯</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-[#0F2C59] flex-shrink-0" />
                    <span>পরিবারের মোট সদস্য: <strong className="text-[#0F2C59] font-bold">{rec.members.length + 1} জন</strong></span>
                  </div>
                </div>

                {/* Heir Names preview pills */}
                {rec.members.length > 0 && (
                  <div className="mb-4">
                    <span className="text-[11px] font-bold text-slate-500 block mb-1">ওয়ারিশবৃন্দ:</span>
                    <div className="flex flex-wrap gap-1">
                      {rec.members.slice(0, 3).map((m, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[11px] rounded border border-slate-200 font-medium">
                          {m.name} ({m.relation})
                        </span>
                      ))}
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
                  onClick={() => onSelectRecord(rec)}
                  className="flex-1 py-2 bg-[#0F2C59] hover:bg-[#1B365D] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  <Eye size={14} /> প্রোফাইল দেখুন
                </button>

                <button
                  onClick={() => onPrintRecord(rec)}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs transition cursor-pointer border border-slate-200"
                  title="ফরম প্রিন্ট করুন"
                >
                  <Printer size={16} />
                </button>

                <button
                  onClick={() => onEditRecord(rec)}
                  className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-xs transition cursor-pointer border border-amber-200"
                  title="সম্পাদনা করুন"
                >
                  <Edit2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

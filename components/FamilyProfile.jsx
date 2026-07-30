'use client';

import React, { useState } from 'react';
import { PrintableForm } from './PrintableForm';
import { 
  Printer, 
  Phone, 
  MapPin, 
  Heart, 
  Users, 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  ChevronLeft,
  Edit
} from 'lucide-react';

export const FamilyProfile = ({
  record,
  onBack,
  onEdit,
}) => {
  const [activeView, setActiveView] = useState('profile');

  return (
    <div className="max-w-5xl mx-auto my-6 px-2 sm:px-4 print:max-w-none print:m-0 print:p-0 print:w-full">
      {/* Navigation Top Bar */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6 bg-white p-4 rounded-xl border-2 border-[#0F2C59]/30 shadow-md print:hidden">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs md:text-sm font-bold flex items-center gap-1.5 transition cursor-pointer border border-slate-300"
        >
          <ChevronLeft size={16} /> তালিকায় ফিরে যান
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(record)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs md:text-sm font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
            >
              <Edit size={16} /> সম্পাদনা (Edit)
            </button>
          )}

          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-300">
            <button
              onClick={() => setActiveView('profile')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition cursor-pointer ${
                activeView === 'profile' ? 'bg-[#0F2C59] text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              প্রোফাইল
            </button>
            <button
              onClick={() => setActiveView('members')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition cursor-pointer ${
                activeView === 'members' ? 'bg-[#0F2C59] text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ওয়ারিশবৃন্দ ({record.members.length})
            </button>
            <button
              onClick={() => setActiveView('printable')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                activeView === 'printable' ? 'bg-[#1B8A44] text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Printer size={14} /> অফিসিয়াল ফরম
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: Printable Form Overlay/View */}
      {activeView === 'printable' && (
        <PrintableForm record={record} />
      )}

      {/* VIEW 2: Interactive Member Roster Grid */}
      {activeView === 'members' && (
        <div className="bg-white border-2 border-[#0F2C59]/30 p-6 rounded-2xl shadow-lg">
          <div className="mb-6 flex justify-between items-center border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-xl font-bold text-[#0F2C59] font-serif flex items-center gap-2">
                <Users size={20} /> {record.headName}-এর পরিবার ও ওয়ারিশগণের তথ্য
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                মোট পরিবার সদস্য: {record.members.length + 1} জন (প্রধানসহ)
              </p>
            </div>
            <span className="px-3 py-1 bg-[#EBF5EE] text-[#1B8A44] border border-[#1B8A44]/40 text-xs font-mono font-bold rounded-full">
              ফরম: {record.formNo}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Head Card */}
            <div className="bg-[#EBF5EE] border-2 border-[#1B8A44] p-4 rounded-xl shadow-xs relative">
              <span className="absolute top-3 right-3 px-2.5 py-0.5 bg-[#1B8A44] text-white text-[10px] font-bold rounded-full uppercase">
                পরিবারের প্রধান
              </span>
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-[#0F2C59] text-white flex items-center justify-center font-bold text-lg font-serif shadow">
                  {record.headName[0] || 'প'}
                </div>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="text-base font-bold text-[#0F2C59]">{record.headName}</h3>
                    {record.isExternalMember && (
                      <span className="px-1.5 py-0.5 bg-amber-500 text-white text-[9px] font-mono font-bold rounded uppercase">
                        External Member
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#1B8A44] font-bold">{record.headOccupation || 'পেশা উল্লেখ নেই'}</p>
                  <p className="text-xs text-slate-600 mt-1">পিতা/স্বামী: {record.fatherOrHusbandName}</p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-[#1B8A44]/20 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px]">রক্তের গ্রুপ:</span>
                  <span className="text-rose-600 font-bold text-sm">{record.bloodGroup || 'অজানা'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">মোবাইল:</span>
                  <span className="text-[#1B8A44] font-mono font-bold">{record.mobileNumber}</span>
                </div>
              </div>
              {record.bloodDonationDates && (Array.isArray(record.bloodDonationDates) ? record.bloodDonationDates.length > 0 : Boolean(record.bloodDonationDates)) && (
                <div className="mt-2 pt-2 border-t border-[#1B8A44]/10 text-xs">
                  <span className="text-slate-600 font-bold text-[11px] flex items-center gap-1 mb-1">
                    <Heart size={12} className="text-rose-600 fill-rose-600" /> রক্তদানের তারিখসমূহ:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {(Array.isArray(record.bloodDonationDates) ? record.bloodDonationDates : [record.bloodDonationDates]).map((d, i) => (
                      <span key={i} className="px-2 py-0.5 bg-rose-50 text-rose-800 border border-rose-200 rounded text-[11px] font-mono font-bold">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Members Roster */}
            {record.members.map((mem, idx) => (
              <div key={mem.id || idx} className="bg-slate-50 border border-slate-300 p-4 rounded-xl shadow-xs">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-[#0F2C59] text-white flex items-center justify-center font-bold text-xs">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{mem.name || 'সদস্য'}</h4>
                      <span className="text-xs text-[#1B8A44] font-bold">{mem.relation || 'সম্পর্ক'}</span>
                    </div>
                  </div>
                  {mem.bloodGroup && (
                    <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded text-xs font-bold">
                      {mem.bloodGroup}
                    </span>
                  )}
                </div>

                <div className="mt-3 space-y-1 text-xs text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">লিঙ্গ ও বয়স/জন্ম:</span>
                    <span className="font-medium">{mem.gender} • {mem.dobOrAge || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">শিক্ষা/পেশা:</span>
                    <span className="text-slate-800 font-medium">{mem.instituteOrOccupation || '—'}</span>
                  </div>
                  {mem.specialInfo && (
                    <div className="mt-2 p-1.5 bg-amber-50 border border-amber-200 rounded text-amber-800 text-[11px] font-medium">
                      বিশেষ: {mem.specialInfo}
                    </div>
                  )}
                  {mem.bloodDonationDates && (Array.isArray(mem.bloodDonationDates) ? mem.bloodDonationDates.length > 0 : Boolean(mem.bloodDonationDates)) && (
                    <div className="mt-2 pt-2 border-t border-slate-200">
                      <span className="text-slate-500 text-[11px] font-bold block mb-1 flex items-center gap-1">
                        <Heart size={12} className="text-rose-600 fill-rose-600" /> রক্তদানের তারিখ:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {(Array.isArray(mem.bloodDonationDates) ? mem.bloodDonationDates : [mem.bloodDonationDates]).map((d, i) => (
                          <span key={i} className="px-2 py-0.5 bg-rose-50 text-rose-800 border border-rose-200 rounded text-[11px] font-mono font-bold">
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: Standard Profile Card */}
      {activeView === 'profile' && (
        <div className="bg-white border-2 border-[#0F2C59]/30 rounded-2xl shadow-xl overflow-hidden">
          {/* Profile Header Banner */}
          <div className="bg-[#0F2C59] text-white p-6 md:p-8 border-b border-[#1B8A44] relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white border-2 border-[#1B8A44] text-[#0F2C59] flex items-center justify-center text-2xl font-black font-serif shadow-md">
                  {record.headName[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl md:text-3xl font-black text-white font-serif">{record.headName}</h1>
                    {record.isExternalMember && (
                      <span className="px-2.5 py-0.5 bg-amber-500 text-white border border-amber-300 rounded-md text-xs font-mono font-extrabold tracking-wider uppercase shadow-2xs">
                        External Member
                      </span>
                    )}
                    {record.status === 'verified' ? (
                      <span className="px-2.5 py-0.5 bg-[#1B8A44] text-white border border-[#62C255] rounded-full text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 size={12} /> যাচাইকৃত
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 bg-amber-600 text-white rounded-full text-xs font-bold flex items-center gap-1">
                        <Clock size={12} /> অপেক্ষমাণ
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-emerald-200 font-bold mt-1 flex items-center gap-2">
                    <Briefcase size={14} /> {record.headOccupation || 'পেশা প্রদান করা হয়নি'}
                  </p>
                  <p className="text-xs text-slate-300 mt-1 flex items-center gap-1">
                    <MapPin size={14} className="text-[#62C255]" /> {record.presentAddress.village}, {record.presentAddress.road}, পটিয়া
                  </p>
                </div>
              </div>

              {/* Quick Key Badges */}
              <div className="flex flex-wrap md:flex-col items-end gap-2 text-right">
                <div className="bg-white/10 border border-white/20 px-3 py-1.5 rounded-lg">
                  <span className="text-[10px] text-emerald-200 block uppercase font-bold">ফরম নং</span>
                  <span className="text-sm font-mono font-bold text-amber-300">{record.formNo}</span>
                </div>
                <div className="bg-white/10 border border-white/20 px-3 py-1.5 rounded-lg">
                  <span className="text-[10px] text-emerald-200 block uppercase font-bold">সদস্য নং</span>
                  <span className="text-sm font-mono font-bold text-[#62C255]">
                    {record.memberNo?.startsWith('OMSKP-') ? record.memberNo : `OMSKP-${record.memberNo || ''}`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Info Grid */}
          <div className="p-6 md:p-8 space-y-6 text-sm text-slate-800">
            {/* Contact & Blood Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center gap-3">
                <div className="p-3 bg-[#EBF5EE] text-[#1B8A44] rounded-lg">
                  <Phone size={20} />
                </div>
                <div>
                  <span className="text-xs text-slate-500 block font-semibold">মোবাইল নম্বর</span>
                  <a href={`tel:${record.mobileNumber}`} className="text-base font-mono font-bold text-[#1B8A44] hover:underline">
                    {record.mobileNumber}
                  </a>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center gap-3">
                <div className="p-3 bg-rose-50 text-rose-600 rounded-lg">
                  <Heart size={20} />
                </div>
                <div>
                  <span className="text-xs text-slate-500 block font-semibold">রক্তের গ্রুপ</span>
                  <span className="text-base font-bold text-rose-600">
                    {record.bloodGroup || 'অজানা'}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center gap-3">
                <div className="p-3 bg-amber-50 text-amber-700 rounded-lg">
                  <Users size={20} />
                </div>
                <div>
                  <span className="text-xs text-slate-500 block font-semibold">পরিবারের মোট সদস্য</span>
                  <span className="text-base font-bold text-slate-900">
                    {record.members.length + 1} জন
                  </span>
                </div>
              </div>
            </div>

            {/* Personal Details List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F2C59] border-b border-slate-200 pb-1">
                  ব্যক্তিগত পরিচয়
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between border-b border-slate-100 pb-1">
                    <span className="text-slate-500">পিতা/স্বামীর নাম:</span>
                    <span className="font-semibold text-slate-900">{record.fatherOrHusbandName}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1">
                    <span className="text-slate-500">মাতার নাম:</span>
                    <span className="font-semibold text-slate-900">{record.motherName}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1">
                    <span className="text-slate-500">জন্ম তারিখ:</span>
                    <span className="font-mono text-slate-900">{record.dob || '—'}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1">
                    <span className="text-slate-500">জাতীয়তা ও ধর্ম:</span>
                    <span className="text-slate-900">{record.nationality} • {record.religion}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1">
                    <span className="text-slate-500">জাতীয় পরিচয়পত্র (NID):</span>
                    <span className="font-mono font-bold text-[#1B8A44]">{record.nidNumber || '—'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F2C59] border-b border-slate-200 pb-1">
                  সামাজিক ও শিক্ষাগত তথ্য
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between border-b border-slate-100 pb-1">
                    <span className="text-slate-500">শিক্ষাগত যোগ্যতা:</span>
                    <span className="font-semibold text-slate-900">{record.educationalQualification || '—'}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1">
                    <span className="text-slate-500">সামাজিক/ধার্মিক পরিচয়:</span>
                    <span className="text-slate-900">{record.socialOrReligiousIdentity || '—'}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1">
                    <span className="text-slate-500">পরিষদে ভূমিকা:</span>
                    <span className="text-[#1B8A44] font-bold">{record.relationWithOrganization}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1">
                    <span className="text-slate-500">কর্মস্থলের ঠিকানা:</span>
                    <span className="text-slate-900">{record.workplaceAddress || '—'}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1">
                    <span className="text-slate-500">তথ্য সংগ্রহকারী:</span>
                    <span className="text-slate-900">{record.collectorSignatureName || '—'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-slate-200 flex justify-between items-center">
              <button
                onClick={() => setActiveView('printable')}
                className="px-6 py-2.5 bg-[#1B8A44] hover:bg-[#156d35] text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-md transition cursor-pointer"
              >
                <Printer size={18} /> মূল ফরম প্রিন্ট করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

'use client';

import React, { useState, useEffect } from 'react';
import { Printer, HeartHandshake } from 'lucide-react';
import { getAppSettings } from '../lib/storage';

export const PrintableForm = ({ record, onClose }) => {
  const [settings, setSettings] = useState(() => getAppSettings());

  useEffect(() => {
    const handleSettingsUpdate = () => {
      setSettings(getAppSettings());
    };
    window.addEventListener('omskp_settings_updated', handleSettingsUpdate);
    return () => window.removeEventListener('omskp_settings_updated', handleSettingsUpdate);
  }, []);

  const customLogo = settings?.logo || '';
  const foundationName = settings?.foundationName || 'অলি মিয়া সমাজ কল্যাণ পরিষদ';
  const formTitle = settings?.formTitle || 'পরিবার শুমারি ও তথ্য নিবন্ধন ফরম';
  const address = settings?.address || 'উত্তর গোলিন্দর বীর, ৯নং ওয়ার্ড, পটিয়া চট্টগ্রাম';

  const handlePrint = () => {
    window.print();
  };

  // Helper to pad digit array for boxed representation
  const renderDigitBoxes = (val, count) => {
    const chars = (val || '').replace(/\D/g, '').split('');
    const boxes = [];
    for (let i = 0; i < count; i++) {
      boxes.push(chars[i] || '');
    }
    return (
      <div className="flex gap-0.5 sm:gap-1 items-center inline-flex max-w-full overflow-x-auto py-0.5 scrollbar-none">
        {boxes.map((char, idx) => (
          <span
            key={idx}
            className="w-4.5 h-5.5 sm:w-5 sm:h-6 border border-black text-center font-mono text-xs sm:text-sm leading-5 sm:leading-6 inline-block font-bold bg-white text-black flex-shrink-0"
          >
            {char}
          </span>
        ))}
      </div>
    );
  };

  // Helper for date box display (DD / MM / YYYY)
  const parseDateBoxes = (dateStr) => {
    const parts = (dateStr || '').split(/[/.-]/);
    const day = parts[0] || '';
    const month = parts[1] || '';
    const year = parts[2] || '';
    return { day, month, year };
  };

  const { day, month, year } = parseDateBoxes(record.date);
  const dobParts = parseDateBoxes(record.dob);

  return (
    <div className="printable-container bg-white text-black p-4 md:p-8 rounded-lg shadow-xl max-w-4xl mx-auto print:max-w-none print:shadow-none print:p-0 print:m-0 print:bg-white text-sm">
      {/* Print Trigger Button for Screen */}
      <div className="flex justify-between items-center mb-6 print:hidden border-b pb-4">
        <div>
          <h2 className="text-xl font-bold text-black">অফিসিয়াল ফরম প্রিভিউ ও প্রিন্ট</h2>
          <p className="text-xs text-slate-500">মূল কাগজের ডুপ্লিকেট ডিজিটাল ফরম (A4 সাইজে প্রিন্ট উপযোগী)</p>
        </div>
        <div className="flex gap-2">
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-slate-100 text-slate-700 text-sm font-medium transition cursor-pointer"
            >
              বন্ধ করুন
            </button>
          )}
          <button
            onClick={handlePrint}
            className="px-5 py-2 bg-[#1B8A44] hover:bg-[#156d35] text-white rounded-md text-sm font-semibold flex items-center gap-2 shadow transition cursor-pointer"
          >
            <Printer size={18} /> প্রিন্ট / PDF সংরক্ষণ
          </button>
        </div>
      </div>

      {/* Actual Paper Outer Frame */}
      <div className="border-2 border-[#0F2C59] p-4 md:p-8 bg-white relative overflow-hidden font-serif print:border-2 print:border-[#0F2C59] print:p-4 print:bg-white text-[#0F2C59] leading-snug rounded-lg shadow-2xl">
        {/* Top Right Decorative Diagonal Green Corner Accent */}
        <svg 
          className="absolute top-0 right-0 w-64 sm:w-80 h-28 sm:h-32 pointer-events-none z-10 print:w-64 print:h-28" 
          viewBox="0 0 320 128" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon points="120,0 320,0 320,80 180,0" fill="#1B8A44" />
          <polygon points="60,0 120,0 320,80 320,110 200,32" fill="#62C255" />
        </svg>

        {/* Header Branding Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-b-2 border-[#0F2C59] pb-4 mb-4 gap-3 relative z-20">
          {/* Logo Crest */}
          <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center border-2 border-[#0F2C59] rounded-full p-1 bg-white shadow-xs overflow-hidden">
            {customLogo ? (
              <img src={customLogo} alt="Logo" className="w-full h-full object-cover rounded-full" />
            ) : (
              <div className="w-full h-full rounded-full border border-dashed border-[#1B8A44] flex flex-col items-center justify-center text-center p-0.5">
                <HeartHandshake className="w-6 h-6 text-[#1B8A44]" />
                <span className="text-[7px] font-bold text-[#0F2C59] leading-none mt-0.5">অলি মিয়া সমাজ কল্যাণ</span>
              </div>
            )}
          </div>

          {/* Main Title Banner */}
          <div className="text-center flex-1 px-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0F2C59] tracking-tight mb-1 font-serif">
              {foundationName}
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-black">
              {address}
            </p>
          </div>

          {/* Reserved Empty Spacer for balance */}
          <div className="w-20 hidden sm:block"></div>
        </div>

        {/* Form Title Heading Banner */}
        <div className="text-center my-3">
          <span className="inline-block border-2 border-[#0F2C59] text-[#0F2C59] font-extrabold px-6 py-1 rounded-md text-xs sm:text-sm font-serif bg-slate-50 tracking-wide">
            {formTitle}
          </span>
        </div>

        {/* Top Meta Fields: Line 1 (সূত্র - বামে, তারিখ - ডানে), Line 2 (সদস্য নং - বামে, ফরম নং - ডানে) */}
        <div className="space-y-3 mb-4 text-xs font-bold text-black">
          {/* Line 1: সূত্র & তারিখ */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 flex-1">
              <span>সূত্র :</span>
              <span className="border-b border-dotted border-black flex-1 px-1 font-sans max-w-xs">
                {record.refNo || '—'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span>তারিখ :</span>
              <div className="flex gap-1.5">
                {renderDigitBoxes(day, 2)}
                {renderDigitBoxes(month, 2)}
                {renderDigitBoxes(year, 4)}
              </div>
            </div>
          </div>

          {/* Line 2: সদস্য নং & ফরম নং */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <span>সদস্য নং–</span>
              <span className="border border-black rounded-xs px-2 py-0.5 bg-white font-mono font-bold text-black">
                {record.memberNo || '—'}
              </span>
            </div>
            {record.isExternalMember && (
              <div className="border-2 border-black px-2 py-0.5 font-mono font-extrabold text-[11px] text-black tracking-wider uppercase bg-slate-100">
                External Member
              </div>
            )}
            <div className="flex items-center gap-1">
              <span>ফরম নং–</span>
              <span className="border border-black rounded-xs px-2 py-0.5 bg-white font-mono font-bold text-black">
                {record.formNo || '—'}
              </span>
            </div>
          </div>
        </div>

        {/* Main Personal Info List */}
        <div className="space-y-2.5 text-xs text-black">
          {/* 1. নাম & পেশা */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-baseline">
            <div className="md:col-span-2 flex items-baseline">
              <span className="font-bold w-32 flex-shrink-0 text-black">১. নাম :</span>
              <div className="border-b border-dotted border-black flex-1 font-semibold px-1 text-sm text-black flex items-center gap-2 flex-wrap">
                <span>{record.headName}</span>
                {record.isExternalMember && (
                  <span className="border border-black px-1.5 py-0.2 text-[10px] font-mono font-bold uppercase">
                    External Member
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-baseline">
              <span className="font-bold w-16 flex-shrink-0 text-black">পেশা :</span>
              <span className="border-b border-dotted border-black flex-1 px-1 text-black">
                {record.headOccupation || '—'}
              </span>
            </div>
          </div>

          {/* 2. পিতা/স্বামীর নাম & পেশা */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-baseline">
            <div className="md:col-span-2 flex items-baseline">
              <span className="font-bold w-32 flex-shrink-0 text-black">২. পিতা/স্বামীর নাম :</span>
              <span className="border-b border-dotted border-black flex-1 px-1 text-black">
                {record.fatherOrHusbandName}
              </span>
            </div>
            <div className="flex items-baseline">
              <span className="font-bold w-16 flex-shrink-0 text-black">পেশা :</span>
              <span className="border-b border-dotted border-black flex-1 px-1 text-black">
                {record.fatherOrHusbandOccupation || '—'}
              </span>
            </div>
          </div>

          {/* 3. মাতার নাম & পেশা */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-baseline">
            <div className="md:col-span-2 flex items-baseline">
              <span className="font-bold w-32 flex-shrink-0 text-black">৩. মাতার নাম :</span>
              <span className="border-b border-dotted border-black flex-1 px-1 text-black">
                {record.motherName}
              </span>
            </div>
            <div className="flex items-baseline">
              <span className="font-bold w-16 flex-shrink-0 text-black">পেশা :</span>
              <span className="border-b border-dotted border-black flex-1 px-1 text-black">
                {record.motherOccupation || '—'}
              </span>
            </div>
          </div>

          {/* 4. ঠিকানা */}
          <div>
            <div className="flex flex-wrap items-baseline gap-y-1">
              <span className="font-bold w-32 flex-shrink-0 text-black">৪. ঠিকানা :</span>
              <span className="font-semibold mr-1 text-black">বাড়ি/গ্রাম :</span>
              <span className="border-b border-dotted border-black min-w-[140px] flex-1 px-1 mr-2 text-black">
                {record.presentAddress?.village || record.permanentAddress?.village || '—'}
              </span>
              <span className="font-semibold mr-1 text-black">রোড :</span>
              <span className="border-b border-dotted border-black min-w-[100px] px-1 mr-2 text-black">
                {record.presentAddress?.road || record.permanentAddress?.road || '—'}
              </span>
            </div>
            <div className="flex flex-wrap items-baseline gap-y-1 mt-1 pl-32">
              <span className="font-semibold mr-1 text-black">পোঃ :</span>
              <span className="border-b border-dotted border-black min-w-[100px] px-1 mr-2 text-black">
                {record.presentAddress?.postOffice || record.permanentAddress?.postOffice || '—'}
              </span>
              <span className="font-semibold mr-1 text-black">থানা :</span>
              <span className="border-b border-dotted border-black min-w-[100px] px-1 mr-2 text-black">
                {record.presentAddress?.thana || record.permanentAddress?.thana || '—'}
              </span>
              <span className="font-semibold mr-1 text-black">জেলা :</span>
              <span className="border-b border-dotted border-black min-w-[100px] px-1 text-black">
                {record.presentAddress?.district || record.permanentAddress?.district || '—'}
              </span>
            </div>
          </div>

          {/* 5. জন্ম তারিখ ও রক্তের গ্রুপ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center">
            <div className="flex items-center gap-1 flex-wrap">
              <span className="font-bold w-32 flex-shrink-0 text-black">৫. জন্ম তারিখ :</span>
              <span className="text-[11px] text-black">দিন :</span>
              {renderDigitBoxes(dobParts.day, 2)}
              <span className="text-[11px] ml-1 text-black">মাস :</span>
              {renderDigitBoxes(dobParts.month, 2)}
              <span className="text-[11px] ml-1 text-black">বছর :</span>
              {renderDigitBoxes(dobParts.year, 4)}
            </div>
            <div className="flex items-center gap-2 justify-start md:justify-end">
              <span className="font-bold text-black">রক্তের গ্রুপ :</span>
              <span className="border border-black px-3 py-0.5 font-bold text-sm bg-white rounded-xs text-black">
                {record.bloodGroup || '—'}
              </span>
            </div>
            {record.bloodDonationDates && (Array.isArray(record.bloodDonationDates) ? record.bloodDonationDates.length > 0 : Boolean(record.bloodDonationDates)) && (
              <div className="md:col-span-2 flex items-baseline mt-1 pt-1 border-t border-dotted border-black/30">
                <span className="font-bold w-32 flex-shrink-0 text-black">রক্তদানের তারিখ :</span>
                <span className="border-b border-dotted border-black flex-1 px-1 font-mono text-black font-semibold">
                  {Array.isArray(record.bloodDonationDates) ? record.bloodDonationDates.join(', ') : record.bloodDonationDates}
                </span>
              </div>
            )}
          </div>

          {/* 6. জাতীয়তা & ধর্ম */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-baseline">
            <div className="flex items-baseline">
              <span className="font-bold w-32 flex-shrink-0 text-black">৬. জাতীয়তা :</span>
              <span className="border-b border-dotted border-black flex-1 px-1 text-black">
                {record.nationality || 'বাংলাদেশী'}
              </span>
            </div>
            <div className="flex items-baseline">
              <span className="font-bold w-16 flex-shrink-0 text-black">ধর্ম :</span>
              <span className="border-b border-dotted border-black flex-1 px-1 text-black">
                {record.religion || 'ইসলাম'}
              </span>
            </div>
          </div>

          {/* 7. জাতীয় পরিচয়পত্র নং (NID Box Grid) */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold w-32 flex-shrink-0 text-black">৭. জাতীয় পরিচয়পত্র নং :</span>
            {renderDigitBoxes(record.nidNumber, 17)}
          </div>

          {/* 8. জন্ম সনদ & পাসপোর্ট নং */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-baseline">
            <div className="flex items-baseline">
              <span className="font-bold w-32 flex-shrink-0 text-black">৮. জন্ম সনদ :</span>
              <span className="border-b border-dotted border-black flex-1 px-1 font-mono text-black">
                {record.birthCertificateNo || '—'}
              </span>
            </div>
            <div className="flex items-baseline">
              <span className="font-bold w-24 flex-shrink-0 text-black">পাসপোর্ট নং :</span>
              <span className="border-b border-dotted border-black flex-1 px-1 font-mono text-black">
                {record.passportNo || '—'}
              </span>
            </div>
          </div>

          {/* 9. শিক্ষাগত যোগ্যতা */}
          <div className="flex items-baseline">
            <span className="font-bold w-32 flex-shrink-0 text-black">৯. শিক্ষাগত যোগ্যতা :</span>
            <span className="border-b border-dotted border-black flex-1 px-1 text-black">
              {record.educationalQualification || '—'}
            </span>
          </div>

          {/* 10. মোবাইল নম্বর (Boxed 11 Digits for Mobile & Alt Mobile) */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold w-32 flex-shrink-0 text-black">১০. মোবাইল নম্বর :</span>
              {renderDigitBoxes(record.mobileNumber, 11)}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold w-32 flex-shrink-0 text-black">বিকল্প নম্বর :</span>
              {renderDigitBoxes(record.altMobileNumber, 11)}
            </div>
          </div>
        </div>

        {/* Section Title: ওয়ারিশগণের তথ্য Table Header Pill */}
        <div className="mt-6 mb-3 text-center">
          <span className="inline-block border border-black rounded-full px-8 py-1 font-bold text-sm text-black">
            ওয়ারিশগণের তথ্য
          </span>
        </div>

        {/* Table of Heirs / Family Members */}
        <div className="overflow-x-auto mb-4 border border-black rounded-lg bg-transparent overflow-hidden">
          <table className="w-full border-collapse text-center text-xs text-black">
            <thead>
              <tr className="border-b border-black font-bold text-black bg-slate-50/50">
                <th className="border border-black p-1 w-8">ক্রমিক নং</th>
                <th className="border border-black p-1 min-w-[180px] w-48">নাম</th>
                <th className="border border-black p-1 w-20">জন্ম তারিখ<br />(দিন/মাস/বছর)</th>
                <th className="border border-black p-1 w-12">রক্তের গ্রুপ</th>
                <th className="border border-black p-1 w-28">রক্তদানের তারিখ</th>
                <th className="border border-black p-1">শিক্ষা প্রতিষ্ঠান/শ্রেণি/পেশা</th>
                <th className="border border-black p-1 w-24">সম্পর্ক<br />(পিতা/মাতা/স্বামী/স্ত্রী/পুত্র/কন্যা)</th>
                <th className="border border-black p-1">ঠিকানা</th>
                <th className="border border-black p-1 min-w-[130px] w-32">বিশেষ তথ্য<br />(রোগী, প্রবাসী, প্রতিবন্ধী, পৌষ্য)</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: Math.max(5, record.members.length) }).map((_, index) => {
                const member = record.members[index];
                return (
                  <tr key={index} className="h-7">
                    <td className="border border-black p-1 font-semibold">{index + 1}.</td>
                    <td className="border border-black p-1 text-left px-1.5 font-medium">
                      {member?.name || ''}
                    </td>
                    <td className="border border-black p-1 font-mono">{member?.dobOrAge || ''}</td>
                    <td className="border border-black p-1 font-bold">{member?.bloodGroup || ''}</td>
                    <td className="border border-black p-1 text-center font-mono text-[11px] leading-tight">
                      {member?.bloodDonationDates
                        ? (Array.isArray(member.bloodDonationDates) ? member.bloodDonationDates.join(', ') : member.bloodDonationDates)
                        : '—'}
                    </td>
                    <td className="border border-black p-1 text-left px-1">
                      {member?.instituteOrOccupation || ''}
                    </td>
                    <td className="border border-black p-1">{member?.relation || ''}</td>
                    <td className="border border-black p-1 text-left px-1">{member?.address || ''}</td>
                    <td className="border border-black p-1 text-left px-1">{member?.specialInfo || ''}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Legal Declaration Text */}
        <div className="text-[10px] text-justify leading-snug my-3 text-black">
          <p>
            আমি <span className="border-b border-black font-bold px-2 inline-block min-w-[120px] text-center">{record.headName || ''}</span> এই মর্মে ঘোষণা, স্বীকার ও সুস্থ মস্তিষ্কে জানাচ্ছি যে, আমার দেওয়া উপরোল্লিখিত সকল তথ্য সত্য এবং নির্ভুল। এ ছাড়া আধে প্রমাণ হলে, আমি আইনগতভাবে পরিষদের অন্যান্য করণীয় প্রতিটি গ্রহণ করতে বাধ্য থাকিব। আমি অলি মিয়া সমাজ কল্যাণ পরিষদের গঠনতন্ত্র, নীতি ও সিদ্ধান্ত মেনে চলব। পরিষদের পবিত্র উদ্দেশ্য বাস্তবায়নে নিজেকে নিয়োজিত রাখব এবং সমাজ কল্যাণমূলক সকল কার্যক্রমে সরাসরি বা পরোক্ষভাবে সহযোগিতা করব। আমি বিবাদ বা বিতেন সৃষ্টি না করে শান্তিপূর্ণ, ঐক্যবদ্ধ ও সৌহার্দ্যপূর্ণ পরিবেশ বজায় রাখতে সচেষ্ট থাকব, ইনশাআল্লাহ।
          </p>
        </div>

        {/* Signatures Row */}
        <div className="grid grid-cols-3 gap-4 pt-10 mt-6 text-center text-[10px] font-bold text-black">
          <div>
            <div className="border-t border-dotted border-black pt-1 mx-2">
              সদস্য সংগ্রহকের স্বাক্ষর
            </div>
          </div>
          <div>
            <div className="border-t border-dotted border-black pt-1 mx-2">
              আবেদনকারীর স্বাক্ষর
            </div>
          </div>
          <div>
            <div className="border-t border-dotted border-black pt-1 mx-2">
              সভাপতি/আহ্বায়কের স্বাক্ষর
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

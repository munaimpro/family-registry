'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/lib/AppContext';
import { Heart, User, Eye, Users, Calendar, ArrowLeft, Filter } from 'lucide-react';
import Link from 'next/link';
import { isHeadOfAnyRecord } from '@/lib/storage';

function BloodGroupAndAgeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { records } = useApp();

  const bloodGroup = searchParams.get('bloodGroup') || '';
  const minAgeParam = searchParams.get('minAge') || '';
  const maxAgeParam = searchParams.get('maxAge') || '';

  // API বা AppContext থেকে পরিবার তালিকা লোড করা
  const [fetchedFamilies, setFetchedFamilies] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

  // সংখ্যা পার্সিং (বাংলা ও ইংরেজি সংখ্যা)
  const parseNum = (val) => {
    if (!val && val !== 0) return null;
    const str = String(val).replace(/[০-৯]/g, d => '0123456789'['০১২৩৪৫৬৭৮৯'.indexOf(d)]).trim();
    const num = parseInt(str, 10);
    return isNaN(num) ? null : num;
  };

  const minAgeNum = parseNum(minAgeParam);
  const maxAgeNum = parseNum(maxAgeParam);

  // বয়স বা জন্মতারিখ থেকে বছর বের করার হেল্পার
  const getYearsFromDobOrAge = (dobOrAgeVal) => {
    if (!dobOrAgeVal) return null;
    const str = String(dobOrAgeVal).trim();
    const parsedDirect = parseInt(str.replace(/[০-৯]/g, d => '0123456789'['০১২৩৪৫৬৭৮৯'.indexOf(d)]), 10);
    if (!isNaN(parsedDirect) && parsedDirect > 0 && parsedDirect < 150 && !str.includes('/') && !str.includes('-')) {
      return parsedDirect;
    }
    const parts = str.split(/[-/.]/);
    if (parts.length === 3) {
      let year = parseInt(parts[2].replace(/[০-৯]/g, d => '0123456789'['০১২৩৪৫৬৭৮৯'.indexOf(d)]), 10);
      let month = parseInt(parts[1].replace(/[০-৯]/g, d => '0123456789'['০১২৩৪৫৬৭৮৯'.indexOf(d)]), 10);
      let day = parseInt(parts[0].replace(/[০-৯]/g, d => '0123456789'['০১২৩৪৫৬৭৮৯'.indexOf(d)]), 10);
      if (parts[0].length === 4) {
        year = parseInt(parts[0].replace(/[০-৯]/g, d => '0123456789'['০১২৩৪৫৬৭৮৯'.indexOf(d)]), 10);
        day = parseInt(parts[2].replace(/[০-৯]/g, d => '0123456789'['০১২৩৪৫৬৭৮৯'.indexOf(d)]), 10);
      }
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        const birthDate = new Date(year, month - 1, day);
        const today = new Date();
        let ageYears = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          ageYears--;
        }
        return ageYears >= 0 ? ageYears : null;
      }
    }
    return null;
  };

  const members = React.useMemo(() => {
    if (!bloodGroup && minAgeNum === null && maxAgeNum === null) return [];

    const isAgeMatches = (dobOrAgeVal) => {
      if (minAgeNum === null && maxAgeNum === null) return true;
      const years = getYearsFromDobOrAge(dobOrAgeVal);
      if (years === null) return false;
      if (minAgeNum !== null && years < minAgeNum) return false;
      if (maxAgeNum !== null && years > maxAgeNum) return false;
      return true;
    };

    const matchedMembers = [];

    activeRecords.forEach(rec => {
      // 1. Check head member
      const headBloodMatch = !bloodGroup || rec.bloodGroup === bloodGroup;
      const headAgeMatch = (minAgeNum === null && maxAgeNum === null) || isAgeMatches(rec.dob || rec.age);

      if (headBloodMatch && headAgeMatch) {
        const displayAge = rec.dob || (rec.age ? `${rec.age} বছর` : null);
        matchedMembers.push({
          id: (rec._id || rec.id) + '-head',
          recordId: rec._id || rec.id,
          type: 'head',
          name: rec.headName,
          fatherName: rec.fatherOrHusbandName || 'তথ্য নেই',
          bloodGroup: rec.bloodGroup,
          ageText: displayAge,
          formNo: rec.formNo,
          mobile: rec.mobileNumber
        });
      }

      // 2. Check family members (ওয়ারিশগণ)
      if (rec.members && rec.members.length > 0) {
        rec.members.forEach(m => {
          const memBloodMatch = !bloodGroup || m.bloodGroup === bloodGroup;
          const memAgeMatch = (minAgeNum === null && maxAgeNum === null) || isAgeMatches(m.dobOrAge || m.dob || m.age);

          if (memBloodMatch && memAgeMatch && !isHeadOfAnyRecord(m.name, activeRecords, rec._id || rec.id)) {
            const displayAge = m.dobOrAge || m.dob || (m.age ? `${m.age} বছর` : null);
            matchedMembers.push({
              id: m.id || (rec._id || rec.id) + '-' + m.name,
              recordId: rec._id || rec.id,
              type: 'member',
              name: m.name + (m.relation ? ' (' + m.relation + ')' : ''),
              fatherName: 'প্রধান সদস্য: ' + rec.headName,
              bloodGroup: m.bloodGroup,
              ageText: displayAge,
              formNo: rec.formNo,
              mobile: m.mobileNumber
            });
          }
        });
      }
    });

    return matchedMembers;
  }, [activeRecords, bloodGroup, minAgeNum, maxAgeNum]);

  // ফিল্টার বিবরণ টাইটেল ও হেডার তৈরি
  let titleBadge = '';
  if (bloodGroup && (minAgeNum !== null || maxAgeNum !== null)) {
    titleBadge = `ব্লাড গ্রুপ: ${bloodGroup} | বয়স: ${minAgeParam || '০'} হতে ${maxAgeParam || '∞'} বছর`;
  } else if (bloodGroup) {
    titleBadge = `ব্লাড গ্রুপ: ${bloodGroup}`;
  } else if (minAgeNum !== null || maxAgeNum !== null) {
    if (minAgeNum !== null && maxAgeNum !== null) {
      titleBadge = `বয়স সীমা: ${minAgeParam} হতে ${maxAgeParam} বছর`;
    } else if (minAgeNum !== null) {
      titleBadge = `বয়স সীমা: ন্যূনতম ${minAgeParam} বছর ও তদূর্ধ্ব`;
    } else {
      titleBadge = `বয়স সীমা: অনূর্ধ্ব ${maxAgeParam} বছর`;
    }
  }

  return (
    <div className="max-w-7xl mx-auto my-6 px-4 min-h-[60vh]">
      {/* Header Info Panel */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
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
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
          <div className="animate-spin w-8 h-8 border-4 border-[#1B8A44] border-t-transparent rounded-full mx-auto mb-3"></div>
          <p className="font-semibold text-sm">সদস্য তথ্য লোড হচ্ছে...</p>
        </div>
      ) : (!bloodGroup && minAgeNum === null && maxAgeNum === null) ? (
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-12 text-center text-slate-600">
          <Filter size={48} className="mx-auto text-slate-400 mb-3" />
          <h3 className="text-lg font-bold text-slate-800">কোন ব্লাড গ্রুপ বা বয়স সীমা নির্বাচন করা হয়নি</h3>
          <p className="text-xs text-slate-500 mt-1">অনুগ্রহ করে মেম্বার পেজ থেকে বয়স সীমা অথবা রক্তের গ্রুপ নির্বাচন করুন।</p>
        </div>
      ) : members.length === 0 ? (
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-12 text-center text-slate-600">
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
              key={member.id}
              className="bg-white border-2 border-slate-200 hover:border-[#1B8A44]/60 rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Card Header: Form No, Badges & Blood/Age */}
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

              {/* Action Button */}
              <div className="pt-4 mt-4 border-t border-slate-100">
                <button
                  onClick={() => router.push(`/member-profile/${member.recordId}`)}
                  className="w-full py-2 bg-[#0F2C59] hover:bg-[#1B365D] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-sm hover:shadow-md"
                >
                  <Eye size={15} /> পরিবার প্রোফাইল দেখুন
                </button>
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
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-slate-500 font-medium text-lg">লোড হচ্ছে...</div>}>
      <BloodGroupAndAgeContent />
    </Suspense>
  );
}

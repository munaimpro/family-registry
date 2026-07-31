'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/lib/AppContext';
import { Heart, User, Eye, Users } from 'lucide-react';
import Link from 'next/link';
import { isHeadOfAnyRecord } from '@/lib/storage';

function BloodGroupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { records } = useApp();
  
  const bloodGroup = searchParams.get('bloodGroup');

  const [members, setMembers] = useState([]);

  useEffect(() => {
    if (!bloodGroup || !records) return;

    const matchedMembers = [];

    records.forEach(rec => {
      // Check head
      if (rec.bloodGroup === bloodGroup) {
        matchedMembers.push({
          id: rec.id + '-head',
          recordId: rec.id,
          type: 'head',
          name: rec.headName,
          fatherName: rec.fatherOrHusbandName || 'তথ্য নেই',
          bloodGroup: rec.bloodGroup,
          formNo: rec.formNo,
          mobile: rec.mobileNumber
        });
      }

      // Check family members
      if (rec.members && rec.members.length > 0) {
        rec.members.forEach(m => {
          if (m.bloodGroup === bloodGroup && !isHeadOfAnyRecord(m.name, records, rec.id)) {
            matchedMembers.push({
              id: m.id,
              recordId: rec.id,
              type: 'member',
              name: m.name,
              fatherName: 'প্রধান সদস্য: ' + rec.headName + ' (' + m.relation + ')',
              bloodGroup: m.bloodGroup,
              formNo: rec.formNo,
              mobile: m.mobileNumber
            });
          }
        });
      }
    });

    setMembers(matchedMembers);
  }, [records, bloodGroup]);

  return (
    <div className="max-w-7xl mx-auto my-8 px-4 min-h-[60vh]">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F2C59] font-serif flex items-center gap-2">
            <Heart className="text-rose-600 fill-rose-600" size={28} />
            ব্লাড গ্রুপ: <span className="text-rose-600">{bloodGroup || 'নির্বাচিত হয়নি'}</span>
          </h1>
          <p className="text-sm text-slate-600 mt-1.5">
            মোট রক্তদাতা পাওয়া গেছে: <strong className="text-[#1B8A44] font-mono text-lg ml-1">{members.length}</strong> জন
          </p>
        </div>
        <Link 
          href="/"
          className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-sm font-bold transition shadow-xs border border-slate-300 whitespace-nowrap"
        >
          হোমে ফিরে যান
        </Link>
      </div>

      {!bloodGroup ? (
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-12 text-center text-slate-600">
           <h3 className="text-lg font-bold text-slate-800">কোন ব্লাড গ্রুপ নির্বাচন করা হয়নি</h3>
        </div>
      ) : members.length === 0 ? (
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-12 text-center text-slate-600">
          <Heart size={48} className="mx-auto text-rose-300 mb-3" />
          <h3 className="text-xl font-bold text-slate-800">কোন রক্তদাতার তথ্য পাওয়া যায়নি</h3>
          <p className="text-sm text-slate-500 mt-2">এই গ্রুপের রক্তদাতা বর্তমানে আমাদের ডাটাবেজে নেই।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {members.map((member) => (
            <div key={member.id} className="bg-white border-2 border-slate-200 hover:border-rose-400 rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="flex justify-between items-start mb-4 gap-2">
                  <div className="flex flex-col items-start gap-1.5 flex-wrap mb-1">
                    <span className="text-[11px] uppercase font-mono font-bold tracking-wider text-[#0F2C59] bg-[#EBF5EE] px-2.5 py-1 rounded-md border border-[#1B8A44]/30">
                      ফরম: {member.formNo}
                    </span>
                    {member.type === 'member' && (
                       <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200 shadow-xs">
                         ফ্যামিলি মেম্বার
                       </span>
                    )}
                  </div>
                  <span className="px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-sm font-black flex items-center gap-1.5 shadow-xs flex-shrink-0 font-mono">
                    <Heart size={14} fill="currentColor" /> {member.bloodGroup}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-[#0F2C59] font-serif mb-3 group-hover:text-rose-700 transition-colors leading-snug">
                  {member.name}
                </h3>
                
                <div className="space-y-1.5">
                  <p className="text-[13px] text-slate-600 font-medium flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {member.type === 'head' ? (
                       <User size={15} className="text-[#1B8A44] flex-shrink-0 mt-0.5" />
                    ) : (
                       <Users size={15} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                    )}
                    <span className="leading-snug">
                      {member.type === 'head' ? (
                        <>
                          <span className="text-slate-500 text-[11px] font-bold block mb-0.5">পিতা/স্বামীর নাম:</span>
                          <strong className="text-slate-800 text-sm">{member.fatherName}</strong>
                        </>
                      ) : (
                        <strong className="text-slate-800">{member.fatherName}</strong>
                      )}
                    </span>
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100">
                <button
                  onClick={() => router.push(`/member-profile/${member.recordId}`)}
                  className="w-full py-2.5 bg-[#0F2C59] hover:bg-[#1B365D] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-md hover:shadow-lg"
                >
                  <Eye size={16} /> প্রোফাইল দেখুন
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function BloodGroupPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-slate-500 font-medium text-lg">লোড হচ্ছে...</div>}>
      <BloodGroupContent />
    </Suspense>
  );
}

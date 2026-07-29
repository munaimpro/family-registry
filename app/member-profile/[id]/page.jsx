'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getStoredRecords } from '../../../lib/storage';
import { FamilyProfile } from '../../../components/FamilyProfile';
import { FileText, ChevronLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function MemberProfilePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const allRecords = getStoredRecords();
  const record = id ? allRecords.find((r) => r.id === id || String(r.id) === String(id) || r.formNo === id) : null;

  if (!record) {
    return (
      <div className="max-w-2xl mx-auto my-16 bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
        <FileText size={48} className="mx-auto text-slate-400 mb-3" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">সদস্যের তথ্য পাওয়া যায়নি</h2>
        <p className="text-sm text-slate-500 mb-6">অনুরোধকৃত প্রোফাইলটি ডাটাবেজে খুঁজে পাওয়া যায়নি।</p>
        <button
          onClick={() => router.push('/')}
          className="px-5 py-2.5 bg-[#0F2C59] hover:bg-[#1B365D] text-white rounded-xl text-xs font-bold transition cursor-pointer inline-flex items-center gap-2"
        >
          <ChevronLeft size={16} /> হোম পেজে ফিরে যান
        </button>
      </div>
    );
  }

  return (
    <FamilyProfile
      record={record}
      onBack={() => router.push('/')}
      onEdit={(rec) => router.push(`/new-form/${rec.id}`)}
    />
  );
}

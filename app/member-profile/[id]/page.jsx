'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FamilyProfile } from '../../../components/FamilyProfile';
import { FileText, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export const dynamic = 'force-dynamic';

export default function MemberProfilePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [record, setRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    const fetchRecord = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/families/${id}`);
        if (response.ok) {
          const data = await response.json();
          setRecord(data);
        } else {
          toast.error('রেকর্ড খুঁজে পাওয়া যায়নি।');
        }
      } catch (error) {
        console.error('Error fetching record:', error);
        toast.error('সার্ভার থেকে তথ্য আনতে সমস্যা হয়েছে।');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecord();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B8A44]"></div>
        <p className="text-slate-600 text-sm font-medium">প্রোফাইল লোড হচ্ছে...</p>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="max-w-2xl mx-auto my-16 bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
        <FileText size={48} className="mx-auto text-slate-400 mb-3" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">সদস্যের তথ্য পাওয়া যায়নি</h2>
        <p className="text-sm text-slate-500 mb-6">অনুরোধকৃত প্রোফাইলটি ডাটাবেজে খুঁজে পাওয়া যায়নি।</p>
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
      onEdit={(rec) => router.push(`/new-form/${rec._id || rec.id}`)}
    />
  );
}

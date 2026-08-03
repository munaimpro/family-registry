'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useApp } from '../../../lib/AppContext';
import { FamilyForm } from '../../../components/FamilyForm';
import toast from 'react-hot-toast';

export const dynamic = 'force-dynamic';

export default function EditFormPage() {
  const router = useRouter();
  const params = useParams();
  const editId = params?.id;
  const { refreshRecords, setPrintingRecord } = useApp();

  const [editingRecord, setEditingRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the record from the backend using the _id from the URL
  useEffect(() => {
    if (!editId) {
      setIsLoading(false);
      return;
    }

    const fetchRecord = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:8000/families/${editId}`);
        if (response.ok) {
          const data = await response.json();
          setEditingRecord(data);
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
  }, [editId]);

  const handleSaveSuccess = async (savedRecord) => {
    try {
      const recordId = editingRecord?._id || editId;
      const response = await fetch(`http://localhost:8000/families/${recordId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(savedRecord),
      });

      if (!response.ok) {
        throw new Error('Failed to update record');
      }

      refreshRecords();
      toast.success('তথ্য সফলভাবে আপডেট হয়েছে!');
      router.push('/');
    } catch (error) {
      console.error('Error updating record:', error);
      toast.error('তথ্য আপডেটে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    }
  };

  const handleCancel = () => {
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B8A44]"></div>
        <p className="text-slate-600 text-sm font-medium">তথ্য লোড হচ্ছে...</p>
      </div>
    );
  }

  if (!editingRecord) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center px-4">
        <div className="text-5xl">⚠️</div>
        <h2 className="text-xl font-bold text-slate-800">রেকর্ড পাওয়া যায়নি</h2>
        <p className="text-slate-500 text-sm">এই আইডি-তে কোনো পরিবারের তথ্য খুঁজে পাওয়া যায়নি।</p>
        <button
          onClick={handleCancel}
          className="px-5 py-2 bg-[#1B8A44] text-white rounded-lg text-sm font-bold hover:bg-[#156d35] transition cursor-pointer"
        >
          তালিকায় ফিরে যান
        </button>
      </div>
    );
  }

  return (
    <div className="px-2 sm:px-4">
      <FamilyForm
        key={editingRecord._id || editingRecord.id}
        initialData={editingRecord}
        onSaveSuccess={handleSaveSuccess}
        onCancel={handleCancel}
        onPrintPreview={(rec) => setPrintingRecord(rec)}
      />
    </div>
  );
}

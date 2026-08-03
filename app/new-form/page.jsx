'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { saveSingleRecord } from '../../lib/storage';
import { useApp } from '../../lib/AppContext';
import { FamilyForm } from '../../components/FamilyForm';
import toast from 'react-hot-toast';

function NewFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const { records, refreshRecords, setPrintingRecord } = useApp();

  const editingRecord = editId ? records.find(r => r.id === editId) || null : null;

  const handleSaveSuccess = async (savedRecord) => {
    try {
      const isEdit = !!editingRecord;
      // If we are editing, we should have the _id from the backend, otherwise fallback to id.
      // But if the backend hasn't generated an _id yet (using old local data), we might need to handle it.
      // Assuming editingRecord has _id if it came from backend.
      const recordId = editingRecord ? (editingRecord._id || editingRecord.id) : null;
      const url = isEdit 
        ? `http://localhost:8000/families/${recordId}` 
        : `http://localhost:8000/families`;
      
      const method = isEdit ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(savedRecord),
      });

      if (!response.ok) {
        throw new Error('Failed to save record');
      }

      // We still call refreshRecords to update local context if needed
      refreshRecords();
      toast.success('তথ্য সফলভাবে সংরক্ষিত হয়েছে!');
      router.push('/');
    } catch (error) {
      console.error('Error saving record:', error);
      toast.error('তথ্য সংরক্ষণে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    }
  };

  const handleCancel = () => {
    router.push('/');
  };

  return (
    <div className="px-2 sm:px-4">
      <FamilyForm
        key={editingRecord ? editingRecord.id : 'new-form-key'}
        initialData={editingRecord}
        onSaveSuccess={handleSaveSuccess}
        onCancel={handleCancel}
        onPrintPreview={(rec) => setPrintingRecord(rec)}
      />
    </div>
  );
}

export default function NewFormPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#1B8A44] border-t-transparent"></div>
      </div>
    }>
      <NewFormContent />
    </Suspense>
  );
}

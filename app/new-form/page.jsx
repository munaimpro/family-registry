'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { saveSingleRecord } from '../../lib/storage';
import { useApp } from '../../lib/AppContext';
import { FamilyForm } from '../../components/FamilyForm';
import { toast } from 'react-toastify';

function NewFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const { records, refreshRecords, setPrintingRecord } = useApp();

  const editingRecord = editId ? records.find(r => r.id === editId) || null : null;

  const handleSaveSuccess = (savedRecord) => {
    saveSingleRecord(savedRecord);
    refreshRecords();
    toast.success('তথ্য সফলভাবে সংরক্ষিত হয়েছে!');
    router.push('/');
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

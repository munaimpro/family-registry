'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { saveSingleRecord, getStoredRecords } from '../../../lib/storage';
import { useApp } from '../../../lib/AppContext';
import { FamilyForm } from '../../../components/FamilyForm';
import { toast } from 'react-toastify';

export default function EditFormPage() {
  const router = useRouter();
  const params = useParams();
  const editId = params?.id;
  const { records, refreshRecords, setPrintingRecord } = useApp();

  const allRecords = records.length > 0 ? records : getStoredRecords();
  const editingRecord = editId ? allRecords.find(r => r.id === editId || String(r.id) === String(editId)) || null : null;

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
        key={editingRecord ? editingRecord.id : 'edit-form-key'}
        initialData={editingRecord}
        onSaveSuccess={handleSaveSuccess}
        onCancel={handleCancel}
        onPrintPreview={(rec) => setPrintingRecord(rec)}
      />
    </div>
  );
}

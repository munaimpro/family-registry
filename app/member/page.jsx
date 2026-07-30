'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '../../lib/AppContext';
import { FamilySearch } from '../../components/FamilySearch';

function MemberDirectoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { records, setPrintingRecord } = useApp();

  // Pre-filter by blood group when navigated from home page blood group buttons
  const initialBloodGroup = searchParams.get('bloodGroup') || '';

  const handleEdit = (record) => {
    router.push(`/new-form/${record.id}`);
  };

  const handleAddNew = () => {
    router.push('/new-form');
  };

  const handleSelectRecord = (record) => {
    router.push(`/member-profile/${record.id}`);
  };

  return (
    <FamilySearch
      records={records}
      onSelectRecord={handleSelectRecord}
      onEditRecord={(rec) => handleEdit(rec)}
      onPrintRecord={(rec) => setPrintingRecord(rec)}
      onAddNew={handleAddNew}
      initialBloodGroup={initialBloodGroup}
    />
  );
}

export default function MemberDirectoryPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-slate-500">লোড হচ্ছে...</div>}>
      <MemberDirectoryContent />
    </Suspense>
  );
}

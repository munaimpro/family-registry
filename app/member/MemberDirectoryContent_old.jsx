'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '../../lib/AppContext';
import { useSession } from '../../lib/auth-client';
import { FamilySearch } from '../../components/FamilySearch';

export default function MemberDirectoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { records, setPrintingRecord } = useApp();
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  // Pre-filter by blood group when navigated from home page blood group buttons
  const initialBloodGroup = searchParams.get('bloodGroup') || '';

  const handleEdit = (record) => {
    router.push(`/new-form/${record._id || record.id}`);
  };

  const handleAddNew = () => {
    router.push('/new-form');
  };

  const handleSelectRecord = (record) => {
    router.push(`/member-profile/${record._id || record.id}`);
  };

  return (
    <FamilySearch
      records={records}
      isLoggedIn={isLoggedIn}
      onSelectRecord={handleSelectRecord}
      onEditRecord={(rec) => handleEdit(rec)}
      onPrintRecord={(rec) => setPrintingRecord(rec)}
      onAddNew={handleAddNew}
      initialBloodGroup={initialBloodGroup}
    />
  );
}

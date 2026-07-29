'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../lib/AppContext';
import { FamilySearch } from '../../components/FamilySearch';

export default function MemberDirectoryPage() {
  const router = useRouter();
  const { records, setPrintingRecord } = useApp();

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
    />
  );
}

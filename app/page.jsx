'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/AppContext';
import { FamilySearch } from '@/components/FamilySearch';
import { FamilyProfile } from '@/components/FamilyProfile';

export default function DirectoryPage() {
  const router = useRouter();
  const { records, setPrintingRecord } = useApp();
  const [selectedRecord, setSelectedRecord] = useState(null);

  const handleEdit = (record) => {
    router.push(`/new-form?edit=${record.id}`);
  };

  const handleAddNew = () => {
    router.push('/new-form');
  };

  return (
    <>
      {selectedRecord ? (
        <FamilyProfile
          record={selectedRecord}
          onBack={() => setSelectedRecord(null)}
          onEdit={(rec) => handleEdit(rec)}
        />
      ) : (
        <FamilySearch
          records={records}
          onSelectRecord={(rec) => setSelectedRecord(rec)}
          onEditRecord={(rec) => handleEdit(rec)}
          onPrintRecord={(rec) => setPrintingRecord(rec)}
          onAddNew={handleAddNew}
        />
      )}
    </>
  );
}

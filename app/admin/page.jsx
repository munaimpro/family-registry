'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../lib/AppContext';
import { AdminDashboard } from '../../components/AdminDashboard';

export default function AdminPage() {
  const router = useRouter();
  const { 
    records, 
    refreshRecords, 
    setPrintingRecord, 
    setIsImportOpen, 
    handleExportBackup 
  } = useApp();

  const handleEdit = (record) => {
    router.push(`/new-form/${record.id}`);
  };

  const handleAddNew = () => {
    router.push('/new-form');
  };

  return (
    <AdminDashboard
      records={records}
      onRefreshData={refreshRecords}
      onEditRecord={(rec) => handleEdit(rec)}
      onPrintRecord={(rec) => setPrintingRecord(rec)}
      onAddNew={handleAddNew}
      onOpenImportModal={() => setIsImportOpen(true)}
      onExportBackup={handleExportBackup}
    />
  );
}

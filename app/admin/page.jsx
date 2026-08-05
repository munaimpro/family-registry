'use client';

import React, { useEffect, useState } from 'react';
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

  const [dashboardStats, setDashboardStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/dashboard-stats`);
      if (response.ok) {
        const data = await response.json();
        setDashboardStats(data);
      }
    } catch (err) {
      console.error('Error loading dashboard stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    let active = true;
    const loadStats = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/dashboard-stats`);
        if (response.ok && active) {
          const data = await response.json();
          setDashboardStats(data);
        }
      } catch (err) {
        console.error('Error loading dashboard stats:', err);
      } finally {
        if (active) {
          setLoadingStats(false);
        }
      }
    };

    loadStats();

    return () => {
      active = false;
    };
  }, [records]);

  const handleEdit = (record) => {
    const recId = record._id || record.id;
    router.push(`/new-form/${recId}`);
  };

  const handleAddNew = () => {
    router.push('/new-form');
  };

  return (
    <AdminDashboard
      records={records}
      dashboardStats={dashboardStats}
      loadingStats={loadingStats}
      onRefreshData={() => {
        refreshRecords();
        fetchDashboardStats();
      }}
      onEditRecord={(rec) => handleEdit(rec)}
      onPrintRecord={(rec) => setPrintingRecord(rec)}
      onAddNew={handleAddNew}
      onOpenImportModal={() => setIsImportOpen(true)}
      onExportBackup={handleExportBackup}
    />
  );
}


'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
// import { getStoredRecords, INITIAL_SAMPLE_RECORDS } from './storage';
import toast from 'react-hot-toast';

const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
  // const [records, setRecords] = useState(INITIAL_SAMPLE_RECORDS);
  const [records, setRecords] = useState([]);
  const [printingRecord, setPrintingRecord] = useState(null);
  const [isImportOpen, setIsImportOpen] = useState(false);

  // const refreshRecords = () => {
  //   const loaded = getStoredRecords();
  //   setRecords(loaded);
  // };

  // // Fetching record data from API
  const refreshRecords = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/families`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`
        }
      });
      if (!res.ok) throw new Error('Failed to fetch records');
      const data = await res.json();
      setRecords(data);
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };

  // useEffect(() => {
  //   const handle = requestAnimationFrame(() => {
  //     setRecords(getStoredRecords());
  //   });
  //   return () => cancelAnimationFrame(handle);
  // }, []);

  // const handleExportBackup = () => {
  //   if (records.length === 0) {
  //     toast.error('ব্যাকআপের জন্য কোন রেকর্ড পাওয়া যায়নি');
  //     return;
  //   }
  //   const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(records, null, 2));
  //   const downloadAnchor = document.createElement('a');
  //   downloadAnchor.setAttribute('href', dataStr);
  //   downloadAnchor.setAttribute('download', `omskp_family_backup_${new Date().toISOString().slice(0, 10)}.json`);
  //   document.body.appendChild(downloadAnchor);
  //   downloadAnchor.click();
  //   downloadAnchor.remove();
  //   toast.success('JSON ব্যাকআপ ডাউনলোড সম্পন্ন হয়েছে!');
  // };

  // Initial Loading
  useEffect(() => {
    refreshRecords();
  }, []);

  const handleExportBackup = () => {
    if (records.length === 0) {
      toast.error('ব্যাকআপের জন্য কোন রেকর্ড পাওয়া যায়নি');
      return;
    }
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(records, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `omskp_family_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success('JSON ব্যাকআপ ডাউনলোড সম্পন্ন হয়েছে!');
  };

  // return (
  //   <AppContext.Provider
  //     value={{
  //       records,
  //       refreshRecords,
  //       printingRecord,
  //       setPrintingRecord,
  //       isImportOpen,
  //       setIsImportOpen,
  //       handleExportBackup,
  //     }}
  //   >
  //     {children}
  //   </AppContext.Provider>
  // );

  return (
    <AppContext.Provider
      value={{
        records,
        refreshRecords,
        printingRecord,
        setPrintingRecord,
        isImportOpen,
        setIsImportOpen,
        handleExportBackup,
      }}
    >
      {children}
    </AppContext.Provider>
  );

};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

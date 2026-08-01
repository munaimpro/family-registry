'use client';

import React, { useState } from 'react';
import { deleteRecordById, saveSingleRecord, saveRecords, INITIAL_SAMPLE_RECORDS } from '../lib/storage';
import toast from 'react-hot-toast';
import {
  Users,
  Heart,
  ShieldCheck,
  Download,
  Upload,
  Trash2,
  Edit,
  Printer,
  CheckCircle2,
  Clock,
  FileSpreadsheet,
  RotateCcw,
  Search,
  Check,
  UserPlus
} from 'lucide-react';

export const AdminDashboard = ({
  records,
  onRefreshData,
  onEditRecord,
  onPrintRecord,
  onAddNew,
  onOpenImportModal,
  onExportBackup,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Compute Stats
  const totalFamilies = records.length;
  let totalMembers = 0;
  const bloodGroupCounts = {};
  let verifiedCount = 0;

  records.forEach(r => {
    totalMembers += 1 + r.members.length; // head + members
    if (r.status === 'verified') verifiedCount++;

    // Head blood group
    if (r.bloodGroup) {
      bloodGroupCounts[r.bloodGroup] = (bloodGroupCounts[r.bloodGroup] || 0) + 1;
    }
    // Members blood group
    r.members.forEach(m => {
      if (m.bloodGroup) {
        bloodGroupCounts[m.bloodGroup] = (bloodGroupCounts[m.bloodGroup] || 0) + 1;
      }
    });
  });

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  // Toggle Verification Status
  // const handleToggleStatus = (record) => {
  //   const newStatus = record.status === 'verified' ? 'pending' : 'verified';
  //   const updated = { ...record, status: newStatus };
  //   saveSingleRecord(updated);
  //   onRefreshData();
  //   toast.success(`স্ট্যাটাস পরিবর্তন করা হয়েছে: ${newStatus === 'verified' ? 'যাচাইকৃত' : 'অপেক্ষমাণ'}`);
  // };

  // Delete Action
  const handleDelete = (id) => {
    if (deleteRecordById(id)) {
      onRefreshData();
      toast.success('রেকর্ডটি সফলভাবে মুছে ফেলা হয়েছে');
      setDeleteConfirmId(null);
    } else {
      toast.error('রেকর্ড মুছতে সমস্যা হয়েছে');
    }
  };

  // Export CSV
  const exportToCSV = () => {
    if (records.length === 0) {
      toast('ডাউনলোডের জন্য কোন ডেটা নেই', { icon: '⚠️' });
      return;
    }

    const headers = [
      'ফরম নং',
      'সদস্য নং',
      'পরিবারের প্রধানের নাম',
      'পেশা',
      'পিতা/স্বামীর নাম',
      'মোবাইল নম্বর',
      'রক্তের গ্রুপ',
      'ঠিকানা',
      'ওয়ারিশ সংখ্যা',
      'স্ট্যাটাস'
    ];

    const rows = records.map(r => [
      r.formNo,
      r.memberNo,
      `"${r.headName}"`,
      `"${r.headOccupation}"`,
      `"${r.fatherOrHusbandName}"`,
      `"${r.mobileNumber}"`,
      r.bloodGroup,
      `"${r.presentAddress.village}, ${r.presentAddress.road}"`,
      r.members.length,
      r.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `omskp_family_data_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV ফাইল এক্সপোর্ট সম্পূর্ণ হয়েছে!');
  };

  // Reset to Sample Data
  const handleResetSampleData = () => {
    if (window.confirm('আপনি কি নিশ্চিত যে ডেমো স্যাম্পল ডেটাতে রিসেট করতে চান? বর্তমান সব পরিবর্তন মুছে যাবে।')) {
      saveRecords(INITIAL_SAMPLE_RECORDS);
      onRefreshData();
      toast.success('স্যাম্পল ডেটায় রিসেট সম্পূর্ণ হয়েছে');
    }
  };

  const filtered = records.filter(r =>
    r.headName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.formNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.memberNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.mobileNumber.includes(searchTerm)
  );

  return (
    <div className="max-w-7xl mx-auto my-6 px-4 space-y-8">

      {/* Top Header & Admin Tools Banner */}
      <div className="bg-[#0F2C59] text-white p-6 rounded-2xl shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-4 border-[#1B8A44]">
        <div>
          <h2 className="text-2xl font-bold font-serif flex items-center gap-2">
            <ShieldCheck className="text-[#62C255]" size={24} /> অ্যাডমিন কন্ট্রোল ও ডেটাবেজ ড্যাশবোর্ড
          </h2>
          <p className="text-xs text-emerald-200 mt-1">
            পারিবারিক ডেটা নিয়ন্ত্রণ, এক্সপোর্ট/ব্যাকআপ, প্রিন্টিং ও স্ট্যাটাস ব্যবস্থাপনা
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onAddNew}
            className="px-4 py-2 bg-[#1B8A44] hover:bg-[#156d35] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition cursor-pointer"
          >
            <UserPlus size={16} /> নতুন ফর্ম যুক্ত
          </button>
          <button
            onClick={exportToCSV}
            className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <FileSpreadsheet size={16} /> Excel CSV
          </button>
          <button
            onClick={onExportBackup}
            className="px-3 py-2 bg-white/10 hover:bg-white/20 text-amber-300 border border-white/20 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Download size={16} /> JSON ব্যাকআপ
          </button>
          <button
            onClick={onOpenImportModal}
            className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Upload size={16} /> ইমপোর্ট
          </button>
        </div>
      </div>

      {/* Analytics Summary Stats Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Families Card */}
        <div className="bg-white border-2 border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 block mb-1 font-bold">নিবন্ধিত মোট পরিবার</span>
            <span className="text-3xl font-black text-[#1B8A44] font-mono">{totalFamilies}</span>
            <span className="text-[10px] text-slate-500 block mt-1">ফরম ডাটাবেজ</span>
          </div>
          <div className="p-3 bg-[#EBF5EE] text-[#1B8A44] rounded-xl border border-[#1B8A44]/30">
            <Users size={28} />
          </div>
        </div>

        {/* Total Population Card */}
        <div className="bg-white border-2 border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 block mb-1 font-bold">মোট জনসংখ্যা / ওয়ারিশ</span>
            <span className="text-3xl font-black text-[#0F2C59] font-mono">{totalMembers}</span>
            <span className="text-[10px] text-slate-500 block mt-1">পরিবার প্রধান + সদস্য</span>
          </div>
          <div className="p-3 bg-indigo-50 text-[#0F2C59] rounded-xl border border-indigo-200">
            <Users size={28} />
          </div>
        </div>

        {/* Verified Families */}
        <div className="bg-white border-2 border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 block mb-1 font-bold">যাচাইকৃত পরিবার</span>
            <span className="text-3xl font-black text-indigo-600 font-mono">{verifiedCount}</span>
            <span className="text-[10px] text-slate-500 block mt-1">যাচাই এর হার {totalFamilies ? Math.round((verifiedCount / totalFamilies) * 100) : 0}%</span>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-200">
            <CheckCircle2 size={28} />
          </div>
        </div>

        {/* Blood Donor Pool */}
        <div className="bg-white border-2 border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 block mb-1 font-bold">সংগৃহীত রক্তের ডোনার</span>
            <span className="text-3xl font-black text-rose-600 font-mono">
              {Object.values(bloodGroupCounts).reduce((a, b) => a + b, 0)}
            </span>
            <span className="text-[10px] text-slate-500 block mt-1">ব্লাড গ্রুপ রেজিস্ট্রি</span>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl border border-rose-200">
            <Heart size={28} />
          </div>
        </div>
      </div>

      {/* Blood Donors Breakdown Grid */}
      <div className="bg-[#FAFBF9] border-2 border-slate-200 p-5 rounded-2xl shadow-sm">
        <h3 className="text-sm font-bold text-[#0F2C59] mb-3 flex items-center gap-2">
          <Heart size={16} className="text-rose-600" /> রক্তের গ্রুপ ভিত্তিক মোট ব্যক্তির তালিকা:
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {bloodGroups.map(bg => (
            <div key={bg} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
              <span className="text-xs font-bold text-rose-600 block">{bg}</span>
              <span className="text-lg font-black text-[#0F2C59] font-mono">{bloodGroupCounts[bg] || 0}</span>
              <span className="text-[10px] text-slate-500 block">জন</span>
            </div>
          ))}
        </div>
      </div>

      {/* Records Management Data Table */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-md overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-50">
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="অ্যাডমিন টেবিল ফিল্টার (নাম, ফরম নং)..."
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden"
            />
          </div>

          <button
            onClick={handleResetSampleData}
            className="text-xs text-slate-600 hover:text-amber-700 font-bold flex items-center gap-1 transition cursor-pointer"
          >
            <RotateCcw size={14} /> ডেমো স্যাম্পল ডেটায় রিসেট করুন
          </button>
        </div>

        {/* Main Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800">
            <thead className="bg-[#EBF5EE] text-[#0F2C59] font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3 w-12 text-center">#</th>
                <th className="p-3">ফরম ও সদস্য নং</th>
                <th className="p-3">পরিবারের প্রধান</th>
                <th className="p-3">মোবাইল</th>
                <th className="p-3">রক্তের গ্রুপ</th>
                <th className="p-3">সদস্য</th>
                <th className="p-3">স্ট্যাটাস</th>
                <th className="p-3 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((rec, idx) => (
                <tr key={rec.id} className="hover:bg-slate-50 transition">
                  <td className="p-3 text-center text-slate-500 font-mono">{idx + 1}</td>

                  <td className="p-3">
                    <span className="font-mono font-bold text-[#0F2C59] block">{rec.formNo}</span>
                    <span className="font-mono text-[10px] text-slate-500">
                      {rec.memberNo?.startsWith('OMSKP-') ? rec.memberNo : `OMSKP-${rec.memberNo || ''}`}
                    </span>
                  </td>

                  <td className="p-3">
                    <span className="font-bold text-slate-900 block">{rec.headName}</span>
                    <span className="text-[11px] text-slate-500">{rec.headOccupation}</span>
                  </td>

                  <td className="p-3 font-mono text-[#1B8A44] font-bold">
                    {rec.mobileNumber}
                  </td>

                  <td className="p-3 font-bold text-rose-600">
                    {rec.bloodGroup || '—'}
                  </td>

                  <td className="p-3 text-[#0F2C59] font-bold font-mono">
                    {rec.members.length + 1} জন
                  </td>

                  {/* <td className="p-3">
                    <button
                      onClick={() => handleToggleStatus(rec)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1 transition cursor-pointer ${
                        rec.status === 'verified'
                          ? 'bg-[#EBF5EE] text-[#1B8A44] border-[#1B8A44]/40 hover:bg-emerald-100'
                          : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                      }`}
                      title="স্ট্যাটাস পরিবর্তন করতে ক্লিক করুন"
                    >
                      {rec.status === 'verified' ? <Check size={12} /> : <Clock size={12} />}
                      {rec.status === 'verified' ? 'যাচাইকৃত' : 'অপেক্ষমাণ'}
                    </button>
                  </td> */}

                  <td className="p-3 text-right">
                    <div className="flex justify-end items-center gap-1.5">
                      <button
                        onClick={() => onPrintRecord(rec)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition cursor-pointer border border-slate-300"
                        title="প্রিন্ট ফরম"
                      >
                        <Printer size={15} />
                      </button>

                      <button
                        onClick={() => onEditRecord(rec)}
                        className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded transition cursor-pointer border border-amber-200"
                        title="সম্পাদনা"
                      >
                        <Edit size={15} />
                      </button>

                      {deleteConfirmId === rec.id ? (
                        <div className="flex items-center gap-1 bg-rose-50 p-1 rounded border border-rose-300">
                          <button
                            onClick={() => handleDelete(rec.id)}
                            className="px-2 py-0.5 bg-rose-600 text-white rounded text-[10px] font-bold cursor-pointer"
                          >
                            হ্যাঁ
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded text-[10px] cursor-pointer"
                          >
                            না
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(rec.id)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded transition cursor-pointer border border-rose-200"
                          title="মুছুন"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

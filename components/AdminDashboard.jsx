'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
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
  UserPlus,
  Loader2,
  House,
  Building2
} from 'lucide-react';

export const AdminDashboard = ({
  records,
  dashboardStats,
  loadingStats,
  onRefreshData,
  onEditRecord,
  onPrintRecord,
  onAddNew,
  onOpenImportModal,
  onExportBackup,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBloodGroup, setFilterBloodGroup] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const [apiFamilies, setApiFamilies] = useState(null);
  const [loadingTable, setLoadingTable] = useState(false);

  // Native fetch for dynamic table list
  const fetchFamilies = useCallback(async () => {
    setLoadingTable(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterBloodGroup) params.append('bloodGroup', filterBloodGroup);
      if (filterType) params.append('filterType', filterType);
      if (filterStatus) params.append('status', filterStatus);

      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/families?${params.toString()}`);
      if (res.ok) {
        const isFallback = res.headers.get('x-fallback') === 'true';
        const data = await res.json();
        if (Array.isArray(data) && (!isFallback || data.length > 0)) {
          setApiFamilies(data);
          setLoadingTable(false);
          return;
        }
      }
    } catch (err) {
      console.error('Error fetching families from API:', err);
    }
    setApiFamilies(null);
    setLoadingTable(false);
  }, [searchTerm, filterBloodGroup, filterType, filterStatus]);

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      setLoadingTable(true);
      try {
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (filterBloodGroup) params.append('bloodGroup', filterBloodGroup);
        if (filterType) params.append('filterType', filterType);
        if (filterStatus) params.append('status', filterStatus);

        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/families?${params.toString()}`);
        if (res.ok && active) {
          const isFallback = res.headers.get('x-fallback') === 'true';
          const data = await res.json();
          if (Array.isArray(data) && (!isFallback || data.length > 0)) {
            setApiFamilies(data);
            setLoadingTable(false);
            return;
          }
        }
      } catch (err) {
        console.error('Error fetching families from API:', err);
      }
      if (active) {
        setApiFamilies(null);
        setLoadingTable(false);
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, [searchTerm, filterBloodGroup, filterType, filterStatus, records]);

  // Compute Local Fallback Stats
  const totalFamilies = records.length;
  let totalMembers = 0;
  const bloodGroupCounts = {};
  let verifiedCount = 0;
  let localSpecialMembers = 0;

  records.forEach(r => {
    totalMembers += 1 + (r.members ? r.members.length : 0); // head + members
    if (r.status === 'verified') verifiedCount++;
    if (r.isMohollaMember || r.isBloodDonorMember || r.isTemporaryMember) {
      localSpecialMembers++;
    }

    // Head blood group
    if (r.bloodGroup) {
      bloodGroupCounts[r.bloodGroup] = (bloodGroupCounts[r.bloodGroup] || 0) + 1;
    }
    // Members blood group
    if (Array.isArray(r.members)) {
      r.members.forEach(m => {
        if (m.bloodGroup) {
          bloodGroupCounts[m.bloodGroup] = (bloodGroupCounts[m.bloodGroup] || 0) + 1;
        }
      });
    }
  });

  const displayTotalFamilies = (dashboardStats && typeof dashboardStats.totalFamilies === 'number' && !dashboardStats.isFallback)
    ? dashboardStats.totalFamilies
    : totalFamilies;

  const displayTotalMembers = (dashboardStats && typeof dashboardStats.totalMembers === 'number' && !dashboardStats.isFallback)
    ? dashboardStats.totalMembers
    : totalMembers;

  const displayTemporaryMembers = (dashboardStats && typeof dashboardStats.temporaryMember === 'object' && !dashboardStats.isFallback)
    ? dashboardStats.temporaryMember
    : 0;

  const displayDonerMembers = (dashboardStats && dashboardStats.donerMember && !dashboardStats.isFallback)
    ? dashboardStats.donerMember
    : null;

  const displayMohollaMembers = (dashboardStats && typeof dashboardStats.mohollaMember === 'object' && !dashboardStats.isFallback)
    ? dashboardStats.mohollaMember
    : 0;

  console.log(displayMohollaMembers);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  // Toggle Verification Status via MongoDB API
  // const handleToggleStatus = async (record) => {
  //   const recId = record._id || record.id;
  //   const newStatus = record.status === 'verified' ? 'pending' : 'verified';
  //   try {
  //     const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/families/${recId}`, {
  //       method: 'PATCH',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ status: newStatus }),
  //     });
  //     if (res.ok) {
  //       toast.success(`স্ট্যাটাস পরিবর্তন করা হয়েছে: ${newStatus === 'verified' ? 'যাচাইকৃত' : 'অপেক্ষমাণ'}`);
  //     }
  //   } catch (err) {
  //     console.error('Error updating status via API:', err);
  //   }
  //   saveSingleRecord({ ...record, status: newStatus });
  //   if (onRefreshData) onRefreshData();
  //   fetchFamilies();
  // };

  // Native API Delete Action
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/families/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success('রেকর্ডটি সফলভাবে মুছে ফেলা হয়েছে');
      } else {
        toast.error('রেকর্ড মুছতে সমস্যা হয়েছে');
      }
    } catch (err) {
      console.error('API delete failed:', err);
      toast.error('নেটওয়ার্ক সমস্যা');
    }

    if (onRefreshData) onRefreshData();
    fetchFamilies();
    setDeleteConfirmId(null);
  };

  // Export CSV
  const exportToCSV = () => {
    const listToExport = apiFamilies !== null ? apiFamilies : records;
    if (listToExport.length === 0) {
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

    const rows = listToExport.map(r => [
      r.formNo || '',
      r.memberNo || '',
      `"${r.headName || ''}"`,
      `"${r.headOccupation || ''}"`,
      `"${r.fatherOrHusbandName || ''}"`,
      `"${r.mobileNumber || ''}"`,
      r.bloodGroup || '',
      `"${r.presentAddress?.village || ''}, ${r.presentAddress?.road || ''}"`,
      Array.isArray(r.members) ? r.members.length : 0,
      r.status || ''
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
  // const handleResetSampleData = () => {
  //   if (window.confirm('আপনি কি নিশ্চিত যে ডেমো স্যাম্পল ডেটাতে রিসেট করতে চান? বর্তমান সব পরিবর্তন মুছে যাবে।')) {
  //     saveRecords(INITIAL_SAMPLE_RECORDS);
  //     if (onRefreshData) onRefreshData();
  //     fetchFamilies();
  //     toast('স্যাম্পল ডেটায় রিসেট সম্পূর্ণ হয়েছে', { icon: 'ℹ️' });
  //   }
  // };

  // List to display in the table
  const displayedList = apiFamilies !== null ? apiFamilies : records.filter(r => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch = !term ||
      (r.headName && r.headName.toLowerCase().includes(term)) ||
      (r.formNo && r.formNo.toLowerCase().includes(term)) ||
      (r.memberNo && r.memberNo.toLowerCase().includes(term)) ||
      (r.mobileNumber && r.mobileNumber.includes(term)) ||
      (r.nidNumber && r.nidNumber.includes(term)) ||
      (r.presentAddress?.village && r.presentAddress.village.toLowerCase().includes(term)) ||
      (Array.isArray(r.members) && r.members.some(m =>
        (m.name && m.name.toLowerCase().includes(term)) ||
        (m.mobileNumber && m.mobileNumber.includes(term))
      ));

    const matchesBloodGroup = !filterBloodGroup || r.bloodGroup === filterBloodGroup || (Array.isArray(r.members) && r.members.some(m => m.bloodGroup === filterBloodGroup));

    const matchesStatus = !filterStatus || r.status === filterStatus;

    let matchesFilterType = true;
    if (filterType === 'moholla') matchesFilterType = !!r.isMohollaMember;
    else if (filterType === 'bloodDonor') matchesFilterType = !!r.isBloodDonorMember;
    else if (filterType === 'temporary') matchesFilterType = !!r.isTemporaryMember;
    else if (filterType === 'regular') matchesFilterType = !r.isMohollaMember && !r.isBloodDonorMember && !r.isTemporaryMember;

    return matchesSearch && matchesBloodGroup && matchesStatus && matchesFilterType;
  });

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Families Card */}
        <div className="bg-white border-2 border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 block mb-1 font-bold">নিবন্ধিত মোট পরিবার</span>
            <span className="text-3xl font-black text-[#1B8A44] font-mono">{displayTotalFamilies}</span>
            <span className="text-[10px] text-slate-500 block mt-1">ফরম ডাটাবেজ</span>
          </div>
          <div className="p-3 bg-[#EBF5EE] text-[#1B8A44] rounded-xl border border-[#1B8A44]/30">
            <House size={28} />
          </div>
        </div>

        {/* Total Population Card */}
        <div className="bg-white border-2 border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 block mb-1 font-bold">মোট জনসংখ্যা / ওয়ারিশ</span>
            <span className="text-3xl font-black text-[#0F2C59] font-mono">{displayTotalMembers}</span>
            <span className="text-[10px] text-slate-500 block mt-1">পরিবার প্রধান + সদস্য</span>
          </div>
          <div className="p-3 bg-indigo-50 text-[#0F2C59] rounded-xl border border-indigo-200">
            <Users size={28} />
          </div>
        </div>

        {/* Temporary Members Card */}
        <div className="bg-white border-2 border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 block mb-1 font-bold">অস্থায়ী / ভাড়াটিয়া সদস্য</span>
            <span className="text-3xl font-black text-amber-600 font-mono">{displayTemporaryMembers.total}</span>
            <span className="text-[10px] text-slate-500 block mt-1 flex space-x-4">
              {/* Total Male Member */}
              <span className="text-[10px] text-slate-500 block mb-1">Male: <strong>{displayTemporaryMembers.male}</strong> জন </span>

              {/* Total Female Member */}
              <span className="text-[10px] text-slate-500 block mb-1">Female: <strong>{displayTemporaryMembers.female}</strong> জন</span>
            </span>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-200">
            <Clock size={28} />
          </div>
        </div>

        {/* Moholla Members Card */}
        <div className="bg-white border-2 border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 block mb-1 font-bold">মহল্লা সদস্য</span>
            <span className="text-3xl font-black text-indigo-600 font-mono">{displayMohollaMembers.total}</span>
            <span className="text-[10px] text-slate-500 block mt-1 flex space-x-4">
              {/* Total Male Member */}
              <span className="text-[10px] text-slate-500 block mb-1">Male: <strong>{displayMohollaMembers.male}</strong> জন </span>

              {/* Total Female Member */}
              <span className="text-[10px] text-slate-500 block mb-1">Female: <strong>{displayMohollaMembers.female}</strong> জন</span>
            </span>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-200">
            {/* Indicate village member icon */}
            <Building2 size={28} />
          </div>
        </div>
      </div>

      {/* Doner Member Breakdown */}
      <div className="bg-[#FAFBF9] border-2 border-slate-200 p-5 rounded-2xl shadow-sm">
        <h3 className="text-sm font-bold text-[#0F2C59] mb-3 flex items-center gap-2">
          <Heart size={16} className="text-rose-600" /> রক্তদাতা সদস্য (ডোনার মেম্বার) — ব্লাড গ্রুপ আছে এমন
        </h3>
        {loadingStats ? (
          <div className="flex items-center gap-2 text-xs text-slate-400"><Loader2 size={14} className="animate-spin" /> লোড হচ্ছে...</div>
        ) : displayDonerMembers ? (
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white border border-rose-200 rounded-xl p-4 text-center">
              <span className="text-xs text-slate-500 block mb-1 font-bold">মোট রক্তদাতা</span>
              <span className="text-3xl font-black text-rose-600 font-mono">{displayDonerMembers.total}</span>
              <span className="text-[10px] text-slate-500 block mt-1">জন</span>
            </div>
            <div className="bg-white border border-blue-200 rounded-xl p-4 text-center">
              <span className="text-xs text-slate-500 block mb-1 font-bold">Male রক্তদাতা</span>
              <span className="text-3xl font-black text-blue-700 font-mono">{displayDonerMembers.male}</span>
              <span className="text-[10px] text-slate-500 block mt-1">জন</span>
            </div>
            <div className="bg-white border border-pink-200 rounded-xl p-4 text-center">
              <span className="text-xs text-slate-500 block mb-1 font-bold">Female রক্তদাতা</span>
              <span className="text-3xl font-black text-pink-600 font-mono">{displayDonerMembers.female}</span>
              <span className="text-[10px] text-slate-500 block mt-1">জন</span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-400">ডেটা পাওয়া যায়নি</p>
        )}
      </div>

      {/* Village Member Breakdown */}
      {/* {displayVillageMember.length > 0 && (
        <div className="bg-[#FAFBF9] border-2 border-slate-200 p-5 rounded-2xl shadow-sm">
          <h3 className="text-sm font-bold text-[#0F2C59] mb-3 flex items-center gap-2">
            <Users size={16} className="text-[#1B8A44]" /> গ্রাম / এলাকা ভিত্তিক সদস্য তালিকা
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-[#0F2C59] text-white">
                  <th className="text-left p-2.5 rounded-tl-lg font-bold">#</th>
                  <th className="text-left p-2.5 font-bold">গ্রাম / এলাকার নাম</th>
                  <th className="text-center p-2.5 font-bold text-blue-200">পুরুষ</th>
                  <th className="text-center p-2.5 font-bold text-pink-200">মহিলা</th>
                  <th className="text-center p-2.5 rounded-tr-lg font-bold">মোট</th>
                </tr>
              </thead>
              <tbody>
                {displayVillageMember.map((v, idx) => (
                  <tr key={v.village} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="p-2.5 text-slate-500 font-mono">{idx + 1}</td>
                    <td className="p-2.5 font-semibold text-slate-800">{v.village}</td>
                    <td className="p-2.5 text-center font-mono font-bold text-blue-700">{v.male}</td>
                    <td className="p-2.5 text-center font-mono font-bold text-pink-600">{v.female}</td>
                    <td className="p-2.5 text-center font-mono font-black text-[#1B8A44]">{v.total}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-[#EBF5EE] font-bold border-t-2 border-[#1B8A44]/30">
                  <td className="p-2.5" colSpan={2}>মোট</td>
                  <td className="p-2.5 text-center font-mono text-blue-700">
                    {displayVillageMember.reduce((s, v) => s + v.male, 0)}
                  </td>
                  <td className="p-2.5 text-center font-mono text-pink-600">
                    {displayVillageMember.reduce((s, v) => s + v.female, 0)}
                  </td>
                  <td className="p-2.5 text-center font-mono text-[#1B8A44]">
                    {displayVillageMember.reduce((s, v) => s + v.total, 0)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )} */}

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
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 bg-slate-50">
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="অ্যাডমিন টেবিল ফিল্টার (নাম, ফরম নং)..."
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden"
              />
            </div>

            {/* <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-hidden cursor-pointer"
            >
              <option value="">সকল স্ট্যাটাস</option>
              <option value="verified">যাচাইকৃত</option>
              <option value="pending">অপেক্ষমাণ</option>
            </select> */}

            <select
              value={filterBloodGroup}
              onChange={(e) => setFilterBloodGroup(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-hidden cursor-pointer"
            >
              <option value="">সকল ব্লাড গ্রুপ</option>
              {bloodGroups.map(bg => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-hidden cursor-pointer"
            >
              <option value="">সকল ক্যাটাগরি</option>
              <option value="moholla">মহল্লা সদস্য</option>
              <option value="bloodDonor">রক্তদাতা সদস্য</option>
              <option value="temporary">অস্থায়ী সদস্য</option>
            </select>

            {loadingTable && (
              <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                <Loader2 size={14} className="animate-spin text-[#1B8A44]" /> লোড হচ্ছে...
              </span>
            )}
          </div>

          {/* <button
            onClick={handleResetSampleData}
            className="text-xs text-slate-600 hover:text-amber-700 font-bold flex items-center gap-1 transition cursor-pointer self-end md:self-auto"
          >
            <RotateCcw size={14} /> ডেমো স্যাম্পল ডেটায় রিসেট করুন
          </button> */}
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
                {/* <th className="p-3">স্ট্যাটাস</th> */}
                <th className="p-3 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {displayedList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500 font-medium">
                    কোন পরিবার বা রেকর্ড পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                displayedList.map((rec, idx) => {
                  const recId = rec._id;
                  return (
                    <tr key={recId || idx} className="hover:bg-slate-50 transition">
                      <td className="p-3 text-center text-slate-500 font-mono">{idx + 1}</td>

                      <td className="p-3">
                        <span className="font-mono font-bold text-[#0F2C59] block">{rec.formNo || '—'}</span>
                        <span className="font-mono text-[10px] text-slate-500">{rec.memberNo || '—'}</span>
                      </td>

                      <td className="p-3">
                        <span className="font-bold text-slate-900 block">{rec.headName || '—'}</span>
                        <span className="text-[11px] text-slate-500">{rec.headOccupation || '—'}</span>
                      </td>

                      <td className="p-3 font-mono text-[#1B8A44] font-bold">
                        {rec.mobileNumber || '—'}
                      </td>

                      <td className="p-3 font-bold text-rose-600">
                        {rec.bloodGroup || '—'}
                      </td>

                      <td className="p-3 text-[#0F2C59] font-bold font-mono">
                        {(Array.isArray(rec.members) ? rec.members.length : 0) + 1} জন
                      </td>

                      {/* <td className="p-3">
                        <button
                          onClick={() => handleToggleStatus(rec)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1 transition cursor-pointer ${rec.status === 'verified'
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
                          {/* <button
                            onClick={() => onPrintRecord(rec)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition cursor-pointer border border-slate-300"
                            title="প্রিন্ট ফরম"
                          >
                            <Printer size={15} />
                          </button> */}

                          <button
                            onClick={() => onEditRecord(rec)}
                            className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded transition cursor-pointer border border-amber-200"
                            title="সম্পাদনা"
                          >
                            <Edit size={15} />
                          </button>

                          {deleteConfirmId === recId ? (
                            <div className="flex items-center gap-1 bg-rose-50 p-1 rounded border border-rose-300">
                              <button
                                onClick={() => handleDelete(recId)}
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
                              onClick={() => setDeleteConfirmId(recId)}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded transition cursor-pointer border border-rose-200"
                              title="মুছুন"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

'use client';

import React, { useState, useEffect } from 'react';
import { generateNextFormNumber, getAppSettings } from '../lib/storage';
import toast from 'react-hot-toast';
import {
  Plus,
  Trash2,
  Save,
  Printer,
  Heart,
  HeartHandshake
} from 'lucide-react';

export const FamilyForm = ({
  initialData,
  onSaveSuccess,
  onCancel,
  onPrintPreview,
}) => {
  const [appSettings, setAppSettings] = useState(() => getAppSettings());

  useEffect(() => {
    const handleSettingsUpdate = () => {
      setAppSettings(getAppSettings());
    };
    window.addEventListener('omskp_settings_updated', handleSettingsUpdate);
    return () => window.removeEventListener('omskp_settings_updated', handleSettingsUpdate);
  }, []);

  const customLogo = appSettings?.logo || '';
  const foundationName = appSettings?.foundationName || 'অলি মিয়া সমাজ কল্যাণ পরিষদ';
  const formTitle = appSettings?.formTitle || 'পরিবার শুমারি ও তথ্য নিবন্ধন ফরম';
  const address = appSettings?.address || 'উত্তর গোলিন্দর বীর, ৯নং ওয়ার্ড, পটিয়া, চট্টগ্রাম';

  const normalizeDates = (val) => {
    if (Array.isArray(val)) return val;
    if (typeof val === 'string' && val.trim()) {
      return val.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [];
  };

  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return {
        ...initialData,
        bloodDonationDates: normalizeDates(initialData.bloodDonationDates),
        members: (initialData.members || []).map(m => ({
          ...m,
          bloodDonationDates: normalizeDates(m.bloodDonationDates)
        }))
      };
    }
    const { formNo, memberNo } = generateNextFormNumber();
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    const dateStr = `${dd}/${mm}/${yyyy}`;

    return {
      id: `rec-${Date.now()}`,
      refNo: '',
      date: dateStr,
      memberNo: memberNo || '',
      formNo: formNo || '',
      headName: '',
      headOccupation: '',
      fatherOrHusbandName: '',
      fatherOrHusbandOccupation: '',
      motherName: '',
      motherOccupation: '',
      presentAddress: {
        village: '',
        road: '',
        postOffice: '',
        thana: '',
        district: '',
      },
      permanentAddress: {
        village: '',
        road: '',
        postOffice: '',
        thana: '',
        district: '',
      },
      dob: '',
      bloodGroup: '',
      bloodDonationDates: [],
      nationality: '',
      religion: '',
      nidNumber: '',
      birthCertificateNo: '',
      passportNo: '',
      educationalQualification: '',
      socialOrReligiousIdentity: '',
      relationWithOrganization: '',
      mobileNumber: '',
      altMobileNumber: '',
      workplaceAddress: '',
      status: 'verified',
      collectorSignatureName: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      members: [
        {
          id: `mem-1`,
          slNo: 1,
          name: '',
          gender: 'মহিলা',
          dobOrAge: '',
          bloodGroup: '',
          bloodDonationDates: [],
          instituteOrOccupation: '',
          relation: '',
          address: '',
          specialInfo: '',
          mobileNumber: '',
        },
        {
          id: `mem-2`,
          slNo: 2,
          name: '',
          gender: 'পুরুষ',
          dobOrAge: '',
          bloodGroup: '',
          bloodDonationDates: [],
          instituteOrOccupation: '',
          relation: '',
          address: '',
          specialInfo: '',
          mobileNumber: '',
        }
      ],
    };
  });

  const [sameAsPresent, setSameAsPresent] = useState(true);
  const [headBloodDateInput, setHeadBloodDateInput] = useState('');
  const [memberBloodDateInputs, setMemberBloodDateInputs] = useState({});

  // Synchronize DOB parts for boxed input
  const parseDobParts = (str) => {
    const parts = (str || '').split(/[/.-]/);
    return {
      dd: parts[0] || '',
      mm: parts[1] || '',
      yyyy: parts[2] || '',
    };
  };

  const [dobParts, setDobParts] = useState(parseDobParts(formData.dob));
  const [deathDateParts, setDeathDateParts] = useState(parseDobParts(formData.deathDate || formData.passportNo));

  const handleDeathDatePartChange = (part, val) => {
    const updated = { ...deathDateParts, [part]: val };
    setDeathDateParts(updated);
    const combined = `${updated.dd}/${updated.mm}/${updated.yyyy}`;
    setFormData(prev => ({ ...prev, deathDate: combined }));
  };

  // Synchronize Date parts for boxed input
  const parseDateParts = (str) => {
    const parts = (str || '').split(/[/.-]/);
    return {
      dd: parts[0] || '',
      mm: parts[1] || '',
      yyyy: parts[2] || '',
    };
  };

  const [dateParts, setDateParts] = useState(() => parseDateParts(formData.date));

  const handleDatePartChange = (part, val) => {
    const updated = { ...dateParts, [part]: val };
    setDateParts(updated);
    const combined = `${updated.dd}/${updated.mm}/${updated.yyyy}`;
    setFormData(prev => ({ ...prev, date: combined }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleToggleSameAsPresent = (checked) => {
    setSameAsPresent(checked);
    if (checked) {
      setFormData(prev => ({
        ...prev,
        permanentAddress: { ...prev.presentAddress }
      }));
    }
  };

  const handleAddressChange = (subField, value) => {
    setFormData(prev => {
      const updatedAddress = {
        ...(prev.presentAddress || {}),
        [subField]: value
      };
      return {
        ...prev,
        presentAddress: updatedAddress,
        permanentAddress: { ...updatedAddress }
      };
    });
  };

  const handleDobPartChange = (part, val) => {
    const updated = { ...dobParts, [part]: val };
    setDobParts(updated);
    const combined = `${updated.dd}/${updated.mm}/${updated.yyyy}`;
    setFormData(prev => ({ ...prev, dob: combined }));
  };

  const renderDigitInputBoxes = (
    value,
    onChange,
    length = 11,
    isRequired = false
  ) => {
    const chars = (value || '').slice(0, length).split('');
    return (
      <div className="flex items-center gap-0.5 sm:gap-1 max-w-full overflow-x-auto py-1 scrollbar-none">
        {Array.from({ length }).map((_, idx) => (
          <input
            key={idx}
            type="text"
            maxLength={1}
            value={chars[idx] || ''}
            required={isRequired && idx === 0 && !value}
            onChange={(e) => {
              const inputVal = e.target.value;
              if (inputVal.length > 1) {
                const digits = inputVal.replace(/\D/g, '').slice(0, length);
                onChange(digits);
                return;
              }
              const digit = inputVal.slice(-1);
              const charsArr = (value || '').padEnd(length, ' ').split('');
              charsArr[idx] = digit || ' ';
              const updatedVal = charsArr.join('').replace(/\s+$/, '');
              onChange(updatedVal);

              if (digit && e.target.nextElementSibling) {
                e.target.nextElementSibling.focus();
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Backspace' && !chars[idx] && e.currentTarget.previousElementSibling) {
                e.currentTarget.previousElementSibling.focus();
              }
            }}
            className="w-5 h-7 sm:w-6 sm:h-8 md:w-7 md:h-8 border border-black bg-white text-center font-mono font-bold text-xs sm:text-sm text-black focus:outline-hidden focus:ring-1 focus:ring-black rounded-xs flex-shrink-0"
          />
        ))}
      </div>
    );
  };

  // Blood donation date handlers for Head
  const handleAddHeadBloodDate = () => {
    const val = headBloodDateInput.trim();
    if (!val) return;
    setFormData(prev => ({
      ...prev,
      bloodDonationDates: [...(prev.bloodDonationDates || []), val]
    }));
    setHeadBloodDateInput('');
    toast.success(`রক্তদানের তারিখ '${val}' যুক্ত করা হয়েছে`);
  };

  const handleRemoveHeadBloodDate = (index) => {
    setFormData(prev => ({
      ...prev,
      bloodDonationDates: (prev.bloodDonationDates || []).filter((_, i) => i !== index)
    }));
  };

  // Blood donation date handlers for Members
  const handleAddMemberBloodDate = (memberIndex) => {
    const val = (memberBloodDateInputs[memberIndex] || '').trim();
    if (!val) return;
    setFormData(prev => {
      const updatedMembers = [...prev.members];
      const currentDates = normalizeDates(updatedMembers[memberIndex].bloodDonationDates);
      updatedMembers[memberIndex] = {
        ...updatedMembers[memberIndex],
        bloodDonationDates: [...currentDates, val]
      };
      return { ...prev, members: updatedMembers };
    });
    setMemberBloodDateInputs(prev => ({ ...prev, [memberIndex]: '' }));
    toast.success(`সদস্যের রক্তদানের তারিখ '${val}' যুক্ত করা হয়েছে`);
  };

  const handleRemoveMemberBloodDate = (memberIndex, dateIndex) => {
    setFormData(prev => {
      const updatedMembers = [...prev.members];
      const currentDates = normalizeDates(updatedMembers[memberIndex].bloodDonationDates);
      updatedMembers[memberIndex] = {
        ...updatedMembers[memberIndex],
        bloodDonationDates: currentDates.filter((_, i) => i !== dateIndex)
      };
      return { ...prev, members: updatedMembers };
    });
  };

  const handleAutoFill = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();

    setFormData({
      id: formData.id || `rec-${Date.now()}`,
      refNo: 'REF-2026-001',
      date: `${dd}/${mm}/${yyyy}`,
      memberNo: 'M-1024',
      formNo: 'F-5012',
      headName: 'মোঃ রফিকুল ইসলাম',
      headOccupation: 'ব্যবসায়ী',
      fatherOrHusbandName: 'মরহুম আব্দুল মজিদ',
      fatherOrHusbandOccupation: 'গৃহ শিক্ষক',
      motherName: 'রাহেলা বেগম',
      motherOccupation: 'গৃহিনী',
      presentAddress: {
        village: 'অলি মিয়া মিস্ত্রি বাড়ী, ফইল্যাতলী, উত্তর গোবিন্দরখিল',
        road: 'ওয়ার্ড নং ০৯',
        postOffice: 'পটিয়া',
        thana: 'পটিয়া',
        district: 'চট্টগ্রাম',
      },
      permanentAddress: {
        village: 'অলি মিয়া মিস্ত্রি বাড়ী, ফইল্যাতলী, উত্তর গোবিন্দরখিল',
        road: 'ওয়ার্ড নং ০৯',
        postOffice: 'পটিয়া',
        thana: 'পটিয়া',
        district: 'চট্টগ্রাম',
      },
      dob: '15/08/1988',
      bloodGroup: 'B+',
      bloodDonationDates: ['10/01/2024', '15/08/2025'],
      nationality: 'বাংলাদেশী',
      religion: 'ইসলাম',
      nidNumber: '19881512345678901',
      birthCertificateNo: '198815123456789012345',
      passportNo: 'A01234567',
      educationalQualification: 'বিএ (অনার্স)',
      socialOrReligiousIdentity: '',
      relationWithOrganization: '',
      mobileNumber: '01712345678',
      altMobileNumber: '01812345678',
      workplaceAddress: '',
      status: 'verified',
      collectorSignatureName: 'মোঃ শাহ আলম',
      createdAt: formData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      members: [
        {
          id: `mem-1`,
          slNo: 1,
          name: 'মোসাম্মৎ সুলতানা আক্তার',
          gender: 'মহিলা',
          dobOrAge: '12/04/1992',
          bloodGroup: 'O+',
          bloodDonationDates: ['15/05/2024', '10/12/2025'],
          instituteOrOccupation: 'গৃহিনী',
          relation: 'স্ত্রী',
          address: 'বর্তমান ঠিকানা',
          specialInfo: '',
          mobileNumber: '01812345678',
        },
        {
          id: `mem-2`,
          slNo: 2,
          name: 'তানভীর ইসলাম তানিম',
          gender: 'পুরুষ',
          dobOrAge: '05/10/2015',
          bloodGroup: 'B+',
          bloodDonationDates: ['01/02/2025'],
          instituteOrOccupation: 'পটিয়া মডেল প্রাইমারি স্কুল (শ্রেণি: ৫ম)',
          relation: 'পুত্র',
          address: 'বর্তমান ঠিকানা',
          specialInfo: '',
          mobileNumber: '',
        },
        {
          id: `mem-3`,
          slNo: 3,
          name: 'আনিকা ইসলাম',
          gender: 'মহিলা',
          dobOrAge: '20/01/2019',
          bloodGroup: 'B+',
          bloodDonationDates: [],
          instituteOrOccupation: 'শিশু শ্রেণি',
          relation: 'কন্যা',
          address: 'বর্তমান ঠিকানা',
          specialInfo: '',
          mobileNumber: '',
        }
      ],
    });
    toast.success('নমুনা তথ্য ফর্মের ঘরে পূরণ করা হয়েছে!');
  };

  // Family Members Table Row Handlers
  const handleMemberChange = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.members];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, members: updated };
    });
  };

  const addMemberRow = () => {
    setFormData(prev => {
      const newSl = prev.members.length + 1;
      const newMember = {
        id: `mem-${Date.now()}-${newSl}`,
        slNo: newSl,
        name: '',
        gender: 'পুরুষ',
        dobOrAge: '',
        bloodGroup: '',
        bloodDonationDates: [],
        instituteOrOccupation: '',
        relation: '',
        address: 'বর্তমান ঠিকানা',
        specialInfo: '',
        mobileNumber: '',
      };
      return { ...prev, members: [...prev.members, newMember] };
    });
    toast.success('নতুন সদস্য সারি যুক্ত করা হয়েছে');
  };

  const removeMemberRow = (index) => {
    if (formData.members.length <= 1) {
      toast.error('অন্তত ১ জন সদস্যের তথ্য রাখুন');
      return;
    }
    setFormData(prev => {
      const updated = prev.members.filter((_, idx) => idx !== index).map((m, i) => ({
        ...m,
        slNo: i + 1
      }));
      return { ...prev, members: updated };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.headName.trim()) {
      toast.error('অনুগ্রহ করে পরিবারের প্রধানের নাম লিখুন');
      return;
    }
    if (!formData.mobileNumber.trim()) {
      toast.error('অনুগ্রহ করে মোবাইল নম্বর লিখুন');
      return;
    }

    const validMembers = formData.members
      .filter(m => m.name.trim() !== '')
      .map((m, idx) => ({ ...m, slNo: idx + 1 }));

    const finalRecord = {
      ...formData,
      members: validMembers,
      updatedAt: new Date().toISOString()
    };

    onSaveSuccess(finalRecord);
    toast.success('পারিবারিক তথ্য সফলভাবে সংরক্ষিত হয়েছে!');
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  return (
    <div className="max-w-5xl mx-auto my-6 px-2 sm:px-4">
      {/* Outer Paper Sheet Canvas Matching Image replica */}
      <form
        onSubmit={handleSubmit}
        className="bg-white text-[#0F2C59] p-4 sm:p-8 rounded-lg shadow-2xl border-2 border-[#0F2C59] relative overflow-hidden font-serif leading-snug"
      >
        {/* Top Right Decorative Diagonal Green Corner Accent */}
        <svg
          className="absolute top-0 right-0 w-64 sm:w-80 h-28 sm:h-32 pointer-events-none z-10"
          viewBox="0 0 320 128"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon points="120,0 320,0 320,80 180,0" fill="#1B8A44" />
          <polygon points="60,0 120,0 320,80 320,110 200,32" fill="#62C255" />
        </svg>

        {/* Top Header Branding Block */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-b-2 border-[#0F2C59] pb-4 mb-4 gap-3">

          {/* Circular Crest Logo Left */}
          <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center border-2 border-[#0F2C59] rounded-full p-1 bg-white shadow-xs overflow-hidden">
            {customLogo ? (
              <img src={customLogo} alt="Logo" className="w-full h-full object-cover rounded-full" />
            ) : (
              <div className="w-full h-full rounded-full border border-dashed border-[#1B8A44] flex flex-col items-center justify-center text-center p-0.5">
                <HeartHandshake className="w-6 h-6 text-[#1B8A44]" />
                <span className="text-[7px] font-bold text-[#0F2C59] leading-none mt-0.5">অলি মিয়া সমাজ কল্যাণ</span>
              </div>
            )}
          </div>

          {/* Centered Main Title Banner */}
          <div className="text-center flex-1 px-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0F2C59] tracking-tight mb-1 font-serif">
              {formTitle}
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-black mb-1">
              {address}
            </p>
          </div>

          {/* Right Spacer or Badge */}
          <div className="w-20 hidden sm:block"></div>
        </div>

        {/* Top Metadata Section */}
        <div className="space-y-3 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end gap-3">
            <div className="flex items-center gap-2">
              <label className="whitespace-nowrap text-black font-bold text-xs sm:text-sm">তারিখ :</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  maxLength={2}
                  value={dateParts.dd}
                  onChange={(e) => handleDatePartChange('dd', e.target.value)}
                  className="w-9 h-7 border border-black bg-white text-center font-mono font-bold text-xs text-black focus:ring-1 focus:ring-[#1B8A44] focus:outline-hidden rounded-xs"
                />
                <input
                  type="text"
                  maxLength={2}
                  value={dateParts.mm}
                  onChange={(e) => handleDatePartChange('mm', e.target.value)}
                  className="w-9 h-7 border border-black bg-white text-center font-mono font-bold text-xs text-black focus:ring-1 focus:ring-[#1B8A44] focus:outline-hidden rounded-xs"
                />
                <input
                  type="text"
                  maxLength={4}
                  value={dateParts.yyyy}
                  onChange={(e) => handleDatePartChange('yyyy', e.target.value)}
                  className="w-14 h-7 border border-black bg-white text-center font-mono font-bold text-xs text-black focus:ring-1 focus:ring-[#1B8A44] focus:outline-hidden rounded-xs"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <label className="whitespace-nowrap text-black font-bold text-xs sm:text-sm">সদস্য নং–</label>
              <div className="flex items-center border border-black rounded-xs bg-white overflow-hidden">
                <span className="bg-gray-100 px-2 py-0.5 border-r border-black font-mono font-bold text-black text-xs">OMSKP-</span>
                <input
                  type="text"
                  value={formData.memberNo ? formData.memberNo.replace('OMSKP-', '') : ''}
                  onChange={(e) => handleInputChange('memberNo', e.target.value)}
                  className="w-20 px-2 py-0.5 font-mono font-bold text-center text-black text-xs focus:outline-hidden"
                />
              </div>
            </div>

            {/* Membership Type Checkbox Fields */}
            <div className="flex flex-wrap items-center gap-2 bg-amber-50 border border-amber-300 px-3 py-1.5 rounded-lg shadow-sm my-1 sm:my-0">
              {/* Moholla Member */}
              <div className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  id="isMohollaMemberCheckbox"
                  checked={Boolean(formData.isMohollaMember)}
                  onChange={(e) => handleInputChange('isMohollaMember', e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-400 focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="isMohollaMemberCheckbox" className="font-bold text-emerald-900 text-xs sm:text-sm cursor-pointer select-none flex items-center gap-1">
                  মহল্লা সদস্য
                </label>
              </div>

              {/* Blood Donor Member */}
              <div className="flex items-center gap-1.5 cursor-pointer border-l border-amber-300 pl-2">
                <input
                  type="checkbox"
                  id="isBloodDonorMemberCheckbox"
                  checked={Boolean(formData.isBloodDonorMember)}
                  onChange={(e) => handleInputChange('isBloodDonorMember', e.target.checked)}
                  className="w-4 h-4 text-rose-600 rounded border-slate-400 focus:ring-rose-500 cursor-pointer"
                />
                <label htmlFor="isBloodDonorMemberCheckbox" className="font-bold text-rose-900 text-xs sm:text-sm cursor-pointer select-none flex items-center gap-1">
                  রক্ত দাতা সদস্য
                </label>
              </div>

              {/* Temporary Member */}
              <div className="flex items-center gap-1.5 cursor-pointer border-l border-amber-300 pl-2">
                <input
                  type="checkbox"
                  id="isTemporaryMemberCheckbox"
                  checked={Boolean(formData.isTemporaryMember)}
                  onChange={(e) => handleInputChange('isTemporaryMember', e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded border-slate-400 focus:ring-purple-500 cursor-pointer"
                />
                <label htmlFor="isTemporaryMemberCheckbox" className="font-bold text-purple-900 text-xs sm:text-sm cursor-pointer select-none flex items-center gap-1">
                  ভাড়াটিয়া/অস্থায়ী সদস্য
                </label>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <label className="whitespace-nowrap text-black font-bold text-xs sm:text-sm">ফরম নং–</label>
              <input
                type="text"
                value={formData.formNo}
                onChange={(e) => handleInputChange('formNo', e.target.value)}
                className="w-32 bg-white border border-black rounded-xs px-2 py-0.5 font-mono font-bold text-center text-black text-xs focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Numbered Input Form Section */}
        <div className="space-y-3.5 text-xs text-black">

          {/* ১. সদস্য/সদস্যা & পেশা */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-baseline">
            <div className="md:col-span-2 flex items-baseline">
              <label className="font-bold w-32 flex-shrink-0 text-black">
                ১. সদস্য/সদস্যা <span className="text-rose-600">*</span> :
              </label>
              <input
                type="text"
                required
                value={formData.headName}
                onChange={(e) => handleInputChange('headName', e.target.value)}
                className="flex-1 bg-transparent border-b border-dotted border-black px-2 py-0.5 font-bold text-sm text-black focus:outline-hidden"
              />
            </div>
            <div className="flex items-baseline">
              <label className="font-bold w-16 flex-shrink-0 text-black">পেশা :</label>
              <input
                type="text"
                value={formData.headOccupation}
                onChange={(e) => handleInputChange('headOccupation', e.target.value)}
                className="flex-1 bg-transparent border-b border-dotted border-black px-2 py-0.5 font-normal text-black focus:outline-hidden"
              />
            </div>
          </div>

          {/* ২. পিতা/স্বামীর নাম & পেশা */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-baseline">
            <div className="md:col-span-2 flex items-baseline">
              <label className="font-bold w-32 flex-shrink-0 text-black">২. পিতা/স্বামীর নাম :</label>
              <input
                type="text"
                value={formData.fatherOrHusbandName}
                onChange={(e) => handleInputChange('fatherOrHusbandName', e.target.value)}
                className="flex-1 bg-transparent border-b border-dotted border-black px-2 py-0.5 font-normal text-black focus:outline-hidden"
              />
            </div>
            <div className="flex items-baseline">
              <label className="font-bold w-16 flex-shrink-0 text-black">পেশা :</label>
              <input
                type="text"
                value={formData.fatherOrHusbandOccupation}
                onChange={(e) => handleInputChange('fatherOrHusbandOccupation', e.target.value)}
                className="flex-1 bg-transparent border-b border-dotted border-black px-2 py-0.5 font-normal text-black focus:outline-hidden"
              />
            </div>
          </div>

          {/* ৩. মাতার নাম & পেশা */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-baseline">
            <div className="md:col-span-2 flex items-baseline">
              <label className="font-bold w-32 flex-shrink-0 text-black">৩. মাতার নাম :</label>
              <input
                type="text"
                value={formData.motherName}
                onChange={(e) => handleInputChange('motherName', e.target.value)}
                className="flex-1 bg-transparent border-b border-dotted border-black px-2 py-0.5 font-normal text-black focus:outline-hidden"
              />
            </div>
            <div className="flex items-baseline">
              <label className="font-bold w-16 flex-shrink-0 text-black">পেশা :</label>
              <input
                type="text"
                value={formData.motherOccupation}
                onChange={(e) => handleInputChange('motherOccupation', e.target.value)}
                className="flex-1 bg-transparent border-b border-dotted border-black px-2 py-0.5 font-normal text-black focus:outline-hidden"
              />
            </div>
          </div>

          {/* ৪. ঠিকানা */}
          <div>
            <div className="flex flex-wrap items-baseline gap-y-1">
              <label className="font-bold w-32 flex-shrink-0 text-black">৪. ঠিকানা :</label>
              <span className="font-semibold mr-1 text-black">বাড়ি/গ্রাম :</span>
              <input
                type="text"
                value={formData.presentAddress.village}
                onChange={(e) => handleAddressChange('village', e.target.value)}
                className="min-w-[140px] flex-1 bg-transparent border-b border-dotted border-black px-2 py-0.5 mr-2 text-black focus:outline-hidden"
              />
              <span className="font-semibold mr-1 text-black">রোড :</span>
              <input
                type="text"
                value={formData.presentAddress.road}
                onChange={(e) => handleAddressChange('road', e.target.value)}
                className="min-w-[90px] w-28 bg-transparent border-b border-dotted border-black px-2 py-0.5 mr-2 text-black focus:outline-hidden"
              />
            </div>
            <div className="flex flex-wrap items-baseline gap-y-1 mt-1 pl-0 sm:pl-32">
              <span className="font-semibold mr-1 text-black">পোঃ :</span>
              <input
                type="text"
                value={formData.presentAddress.postOffice}
                onChange={(e) => handleAddressChange('postOffice', e.target.value)}
                className="w-24 bg-transparent border-b border-dotted border-black px-2 py-0.5 mr-2 text-black focus:outline-hidden"
              />
              <span className="font-semibold mr-1 text-black">থানা :</span>
              <input
                type="text"
                value={formData.presentAddress.thana}
                onChange={(e) => handleAddressChange('thana', e.target.value)}
                className="w-28 bg-transparent border-b border-dotted border-black px-2 py-0.5 mr-2 text-black focus:outline-hidden"
              />
              <span className="font-semibold mr-1 text-black">জেলা :</span>
              <input
                type="text"
                value={formData.presentAddress.district}
                onChange={(e) => handleAddressChange('district', e.target.value)}
                className="w-28 bg-transparent border-b border-dotted border-black px-2 py-0.5 text-black focus:outline-hidden"
              />
            </div>
          </div>

          {/* ৫. জন্ম তারিখ ও রক্তের গ্রুপ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center">
            <div className="flex items-center gap-1 flex-wrap">
              <label className="font-bold w-32 flex-shrink-0 text-black">৫. জন্ম তারিখ :</label>
              <span className="text-[11px] text-black">দিন :</span>
              <input
                type="text"
                maxLength={2}
                value={dobParts.dd}
                onChange={(e) => handleDobPartChange('dd', e.target.value)}
                className="w-9 h-7 border border-black bg-white text-center font-mono font-bold text-xs text-black focus:outline-hidden"
              />
              <span className="text-[11px] ml-1 text-black">মাস :</span>
              <input
                type="text"
                maxLength={2}
                value={dobParts.mm}
                onChange={(e) => handleDobPartChange('mm', e.target.value)}
                className="w-9 h-7 border border-black bg-white text-center font-mono font-bold text-xs text-black focus:outline-hidden"
              />
              <span className="text-[11px] ml-1 text-black">বছর :</span>
              <input
                type="text"
                maxLength={4}
                value={dobParts.yyyy}
                onChange={(e) => handleDobPartChange('yyyy', e.target.value)}
                className="w-14 h-7 border border-black bg-white text-center font-mono font-bold text-xs text-black focus:outline-hidden"
              />
            </div>
            <div className="flex items-center gap-2 justify-start md:justify-end">
              <label className="font-bold text-black flex items-center gap-1">
                <Heart size={14} className="text-rose-700 fill-rose-600" /> রক্তের গ্রুপ :
              </label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                className="bg-white border border-black rounded px-3 py-1 font-bold text-black text-xs focus:outline-hidden"
              >
                <option value="">নির্বাচন করুন</option>
                {bloodGroups.map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            {/* রক্তদানের তারিখ (Head Multiple Dates) */}
            <div className="col-span-1 md:col-span-2 pt-2 mt-1 border-t border-dotted border-slate-300">
              <div className="flex items-center gap-2 flex-wrap">
                <label className="font-bold text-black flex items-center gap-1 text-xs">
                  <Heart size={14} className="text-rose-700 fill-rose-600" /> রক্তদানের তারিখ :
                </label>

                <div className="flex flex-wrap items-center gap-1.5">
                  {(formData.bloodDonationDates || []).map((dateStr, dIdx) => (
                    <span key={dIdx} className="inline-flex items-center gap-1 bg-rose-50 border border-rose-300 text-rose-800 text-xs font-bold px-2.5 py-0.5 rounded-full shadow-2xs">
                      <Heart size={10} className="text-rose-600 fill-rose-600" />
                      <span>{dateStr}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveHeadBloodDate(dIdx)}
                        className="text-rose-500 hover:text-rose-800 font-black ml-1 cursor-pointer leading-none"
                        title="তারিখ মুছুন"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-1 print:hidden">
                  <input
                    type="text"
                    placeholder="দিন/মাস/বছর (যেমন: 15/02/2025)"
                    value={headBloodDateInput}
                    onChange={(e) => setHeadBloodDateInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddHeadBloodDate();
                      }
                    }}
                    className="w-44 bg-white border border-black rounded px-2 py-0.5 text-xs text-black font-medium focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddHeadBloodDate}
                    className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-bold flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    + তারিখ যোগ করুন
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ৬. জাতীয়তা & ধর্ম */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-baseline">
            <div className="flex items-baseline">
              <label className="font-bold w-32 flex-shrink-0 text-black">৬. জাতীয়তা :</label>
              <input
                type="text"
                value={formData.nationality}
                onChange={(e) => handleInputChange('nationality', e.target.value)}
                className="flex-1 bg-transparent border-b border-dotted border-black px-2 py-0.5 text-black focus:outline-hidden"
              />
            </div>
            <div className="flex items-baseline">
              <label className="font-bold w-16 flex-shrink-0 text-black">ধর্ম :</label>
              <input
                type="text"
                value={formData.religion}
                onChange={(e) => handleInputChange('religion', e.target.value)}
                className="flex-1 bg-transparent border-b border-dotted border-black px-2 py-0.5 text-black focus:outline-hidden"
              />
            </div>
          </div>

          {/* ৭. জাতীয় পরিচয়পত্র নং */}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <label className="font-bold w-32 flex-shrink-0 text-black">৭. জাতীয় পরিচয়পত্র নং :</label>
              {renderDigitInputBoxes(
                formData.nidNumber,
                (val) => handleInputChange('nidNumber', val),
                17,
                false
              )}
            </div>
          </div>

          {/* ৮. জন্ম সনদ & মৃত্যু তারিখ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-baseline">
            <div className="flex items-baseline">
              <label className="font-bold w-32 flex-shrink-0 text-black">৮. জন্ম সনদ :</label>
              <input
                type="text"
                value={formData.birthCertificateNo}
                onChange={(e) => handleInputChange('birthCertificateNo', e.target.value)}
                className="flex-1 bg-transparent border-b border-dotted border-black px-2 py-0.5 font-mono text-black focus:outline-hidden"
              />
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              <label className="font-bold w-24 flex-shrink-0 text-black">মৃত্যু তারিখ :</label>
              <span className="text-[11px] text-black">দিন :</span>
              <input
                type="text"
                maxLength={2}
                value={deathDateParts.dd}
                onChange={(e) => handleDeathDatePartChange('dd', e.target.value)}
                className="w-9 h-7 border border-black bg-white text-center font-mono font-bold text-xs text-black focus:outline-hidden"
              />
              <span className="text-[11px] ml-1 text-black">মাস :</span>
              <input
                type="text"
                maxLength={2}
                value={deathDateParts.mm}
                onChange={(e) => handleDeathDatePartChange('mm', e.target.value)}
                className="w-9 h-7 border border-black bg-white text-center font-mono font-bold text-xs text-black focus:outline-hidden"
              />
              <span className="text-[11px] ml-1 text-black">বছর :</span>
              <input
                type="text"
                maxLength={4}
                value={deathDateParts.yyyy}
                onChange={(e) => handleDeathDatePartChange('yyyy', e.target.value)}
                className="w-14 h-7 border border-black bg-white text-center font-mono font-bold text-xs text-black focus:outline-hidden"
              />
            </div>
          </div>

          {/* ৯. শিক্ষাগত যোগ্যতা */}
          <div className="flex items-baseline">
            <label className="font-bold w-32 flex-shrink-0 text-black">৯. শিক্ষাগত যোগ্যতা :</label>
            <input
              type="text"
              value={formData.educationalQualification}
              onChange={(e) => handleInputChange('educationalQualification', e.target.value)}
              className="flex-1 bg-transparent border-b border-dotted border-black px-2 py-0.5 text-black focus:outline-hidden"
            />
          </div>

          {/* ১০. মোবাইল নাম্বার & বিকল্প নাম্বার */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <label className="font-bold w-32 flex-shrink-0 text-black">
                ১০. মোবাইল নাম্বার <span className="text-rose-600">*</span> :
              </label>
              {renderDigitInputBoxes(
                formData.mobileNumber,
                (val) => handleInputChange('mobileNumber', val),
                11,
                true
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <label className="font-bold w-32 flex-shrink-0 text-black">
                বিকল্প নাম্বার :
              </label>
              {renderDigitInputBoxes(
                formData.altMobileNumber,
                (val) => handleInputChange('altMobileNumber', val),
                11,
                false
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Heirs Pill Badge Section */}
        <div className="mt-6 mb-3 text-center">
          <span className="inline-block border border-black rounded-full px-8 py-1 font-bold text-sm text-black">
            ওয়ারিশগণের তথ্য
          </span>
        </div>

        {/* Warish Table */}
        <div className="overflow-x-auto mb-4 border border-black rounded-lg bg-transparent overflow-hidden">
          <table className="w-full border-collapse text-center text-xs text-black">
            <thead>
              <tr className="border-b border-black font-bold text-black bg-slate-50/50">
                <th className="border border-black p-1.5 w-10">ক্রমিক নং</th>
                <th className="border border-black p-1.5 min-w-[160px] sm:min-w-[180px]">সদস্য/সদস্যা</th>
                <th className="border border-black p-1.5 w-28">জন্ম তারিখ<br /><span className="text-[9px] font-normal">(দিন/মাস/বছর)</span></th>
                <th className="border border-black p-1.5 w-20">রক্তের গ্রুপ</th>
                <th className="border border-black p-1.5 min-w-[160px]">রক্তদানের তারিখ<br /><span className="text-[9px] font-normal">(একাধিক তারিখ)</span></th>
                <th className="border border-black p-1.5 min-w-[140px]">শিক্ষা প্রতিষ্ঠান/শ্রেণি/পেশা</th>
                <th className="border border-black p-1.5 w-28">সম্পর্ক<br /><span className="text-[9px] font-normal">(স্ত্রী/পুত্র/কন্যা ইত্যাদি)</span></th>
                <th className="border border-black p-1.5 min-w-[120px]">NID</th>
                <th className="border border-black p-1.5 min-w-[130px]">বিশেষ তথ্য<br /><span className="text-[9px] font-normal">(রোগী, প্রবাসী, প্রতিবন্ধী, পৌষ্য)</span></th>
                <th className="border border-black p-1.5 w-10 print:hidden">মুছুন</th>
              </tr>
            </thead>
            <tbody>
              {formData.members.map((member, idx) => (
                <tr key={member.id} className="transition">
                  <td className="border border-black p-1 font-bold text-black">{idx + 1}.</td>
                  <td className="border border-black p-1">
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                      className="w-full bg-transparent px-1 py-0.5 text-xs text-black font-medium focus:outline-hidden"
                    />
                  </td>
                  <td className="border border-black p-1">
                    <input
                      type="text"
                      value={member.dobOrAge}
                      onChange={(e) => handleMemberChange(idx, 'dobOrAge', e.target.value)}
                      className="w-full bg-transparent px-1 py-0.5 text-xs font-mono text-black focus:outline-hidden"
                    />
                  </td>
                  <td className="border border-black p-1">
                    <select
                      value={member.bloodGroup}
                      onChange={(e) => handleMemberChange(idx, 'bloodGroup', e.target.value)}
                      className="w-full bg-transparent text-xs font-bold text-black focus:outline-hidden"
                    >
                      <option value="">—</option>
                      {bloodGroups.map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </td>
                  <td className="border border-black p-1.5 min-w-[160px] text-left">
                    <div className="flex flex-col gap-1.5">
                      {/* List of existing blood donation dates */}
                      <div className="flex flex-wrap gap-1">
                        {normalizeDates(member.bloodDonationDates).map((dStr, dIdx) => (
                          <span
                            key={dIdx}
                            className="inline-flex items-center gap-1 bg-rose-50 border border-rose-300 text-rose-800 text-[11px] font-bold px-1.5 py-0.5 rounded-md shadow-2xs"
                          >
                            <Heart size={10} className="text-rose-600 fill-rose-600 flex-shrink-0" />
                            <span>{dStr}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveMemberBloodDate(idx, dIdx)}
                              className="text-rose-500 hover:text-rose-800 font-bold ml-0.5 cursor-pointer leading-none"
                              title="তারিখ মুছুন"
                            >
                              &times;
                            </button>
                          </span>
                        ))}
                      </div>

                      {/* Input to add new date */}
                      <div className="flex items-center gap-1 print:hidden">
                        <input
                          type="text"
                          placeholder="দিন/মাস/বছর"
                          value={memberBloodDateInputs[idx] || ''}
                          onChange={(e) => setMemberBloodDateInputs(prev => ({ ...prev, [idx]: e.target.value }))}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddMemberBloodDate(idx);
                            }
                          }}
                          className="w-24 bg-white border border-slate-300 rounded px-1.5 py-0.5 text-[11px] text-black focus:outline-none focus:border-rose-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddMemberBloodDate(idx)}
                          className="px-2 py-0.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-[10px] font-bold cursor-pointer whitespace-nowrap shadow-xs"
                          title="নতুন রক্তদানের তারিখ যোগ করুন"
                        >
                          + যোগ
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="border border-black p-1">
                    <input
                      type="text"
                      value={member.instituteOrOccupation}
                      onChange={(e) => handleMemberChange(idx, 'instituteOrOccupation', e.target.value)}
                      className="w-full bg-transparent px-1 py-0.5 text-xs text-black focus:outline-hidden"
                    />
                  </td>
                  <td className="border border-black p-1">
                    <input
                      type="text"
                      value={member.relation}
                      onChange={(e) => handleMemberChange(idx, 'relation', e.target.value)}
                      className="w-full bg-transparent px-1 py-0.5 text-xs text-black focus:outline-hidden"
                    />
                  </td>
                  <td className="border border-black p-1">
                    <input
                      type="text"
                      value={member.nid || member.address || ''}
                      onChange={(e) => handleMemberChange(idx, 'nid', e.target.value)}
                      className="w-full bg-transparent px-1 py-0.5 text-xs text-black focus:outline-hidden font-mono text-center"
                    />
                  </td>
                  <td className="border border-black p-1">
                    <input
                      type="text"
                      value={member.specialInfo || ''}
                      onChange={(e) => handleMemberChange(idx, 'specialInfo', e.target.value)}
                      className="w-full bg-transparent px-1 py-0.5 text-xs text-black focus:outline-hidden"
                    />
                  </td>
                  <td className="border border-black p-1 text-center print:hidden">
                    <button
                      type="button"
                      onClick={() => removeMemberRow(idx)}
                      className="p-1 text-rose-600 hover:bg-rose-100 rounded transition cursor-pointer"
                      title="সারি সরান"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Button to Add More Heir Rows */}
        <div className="flex justify-end mb-6 print:hidden">
          <button
            type="button"
            onClick={addMemberRow}
            className="px-3.5 py-1.5 bg-[#1B8A44] hover:bg-[#156d35] text-white rounded text-xs font-bold flex items-center gap-1 transition shadow cursor-pointer"
          >
            <Plus size={15} /> নতুন ওয়ারিশ তথ্য সারি যুক্ত করুন
          </button>
        </div>

        {/* Lower Legal Declaration Block */}
        <div className="text-[11px] text-justify leading-relaxed my-4 text-black">
          <p>
            আমি{' '}
            <input
              type="text"
              value={formData.headName}
              onChange={(e) => handleInputChange('headName', e.target.value)}
              className="bg-transparent border-b border-black px-1 font-bold text-black focus:outline-hidden inline-block min-w-[200px] text-center text-[11px]"
            />{' '}
            এই মর্মে ঘোষণা, স্বীকার ও সুস্থ মস্তিষ্কে জানাচ্ছি যে, আমার দেওয়া উপরোল্লিখিত সকল তথ্য সত্য এবং নির্ভুল। এ ছাড়া উপরোক্ত তথ্যে কোনো ভুল প্রমানিত হলে আমি উপযুক্ত শাস্তি গ্রহন করিতে বাধ্য থাকিব। আমি অলি মিয়া সমাজ কল্যাণ পরিষদের গঠনতন্ত্র, নীতি ও সিদ্ধান্ত মেনে চলব। পরিষদের পবিত্র উদ্দেশ্য বাস্তবায়নে নিজেকে নিয়োজিত রাখব এবং সমাজ কল্যাণমূলক সকল কার্যক্রমে সরাসরি বা পরোক্ষভাবে সহযোগিতা করব। আমি বিবাদ বা বিতেন সৃষ্টি না করে শান্তিপূর্ণ, ঐক্যবদ্ধ ও সৌহার্দ্যপূর্ণ পরিবেশ বজায় রাখতে সচেষ্ট থাকব, ইনশাআল্লাহ।
          </p>
        </div>

        {/* Signatures Row */}
        <div className="grid grid-cols-3 gap-4 pt-12 mt-6 text-center text-xs font-bold text-black">
          <div>
            <div className="border-t border-dotted border-black pt-1 mx-2">
              সদস্য সংগ্রহকের স্বাক্ষর
            </div>
            <input
              type="text"
              placeholder="সংগ্রহকের নাম (ঐচ্ছিক)"
              value={formData.collectorSignatureName || ''}
              onChange={(e) => handleInputChange('collectorSignatureName', e.target.value)}
              className="w-full text-center text-[10px] border-b border-transparent hover:border-slate-300 focus:border-black bg-transparent mt-1 text-black font-normal focus:outline-hidden print:border-none"
            />
          </div>
          <div>
            <div className="border-t border-dotted border-black pt-1 mx-2">
              আবেদনকারীর স্বাক্ষর
            </div>
          </div>
          <div>
            <div className="border-t border-dotted border-black pt-1 mx-2">
              সভাপতি/আহ্বায়কের স্বাক্ষর
            </div>
          </div>
        </div>

        {/* Bottom Floating Control Panel */}
        <div className="mt-8 pt-4 border-t border-slate-300 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <button
            type="button"
            onClick={handleAutoFill}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border border-slate-300"
          >
            স্বয়ংক্রিয় নমুনা ফর্ম তথ্য পূরণ
          </button>

          <div className="flex items-center gap-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                বাতিল
              </button>
            )}

            {onPrintPreview && (
              <button
                type="button"
                onClick={() => onPrintPreview(formData)}
                className="px-4 py-2 bg-[#0F2C59] hover:bg-[#1B365D] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow cursor-pointer"
              >
                <Printer size={15} /> প্রিন্ট প্রিভিউ
              </button>
            )}

            <button
              type="submit"
              className="px-6 py-2.5 bg-[#1B8A44] hover:bg-[#156d35] text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-lg transition cursor-pointer"
            >
              <Save size={16} /> সম্পূর্ণ তথ্য সংরক্ষণ করুন
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

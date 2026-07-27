'use client';

import React, { useState } from 'react';
import { generateNextFormNumber } from '@/lib/storage';
import { toast } from 'react-toastify';
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
  const [formData, setFormData] = useState(() => {
    if (initialData) return initialData;
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

  const handleAddressChange = (type, subField, value) => {
    setFormData(prev => {
      const updatedAddress = {
        ...prev[type],
        [subField]: value
      };
      if (type === 'presentAddress' && sameAsPresent) {
        return {
          ...prev,
          presentAddress: updatedAddress,
          permanentAddress: { ...updatedAddress }
        };
      }
      return {
        ...prev,
        [type]: updatedAddress
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
      <div className="flex items-center gap-1 flex-wrap">
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
            className="w-6 h-7 sm:w-7 sm:h-8 border border-black bg-white text-center font-mono font-bold text-xs sm:text-sm text-black focus:outline-hidden focus:ring-1 focus:ring-black rounded-xs"
          />
        ))}
      </div>
    );
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
        village: 'উত্তর গোলিন্দর বীর, অলি মিয়া মিশ্রির বাড়ি',
        road: 'ওয়ার্ড নং ০৯',
        postOffice: 'পটিয়া',
        thana: 'পটিয়া',
        district: 'চট্টগ্রাম',
      },
      permanentAddress: {
        village: 'উত্তর গোলিন্দর বীর, অলি মিয়া মিশ্রির বাড়ি',
        road: 'ওয়ার্ড নং ০৯',
        postOffice: 'পটিয়া',
        thana: 'পটিয়া',
        district: 'চট্টগ্রাম',
      },
      dob: '15/08/1988',
      bloodGroup: 'B+',
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
          instituteOrOccupation: 'শিশু শ্রেণি',
          relation: 'কন্যা',
          address: 'বর্তমান ঠিকানা',
          specialInfo: '',
          mobileNumber: '',
        }
      ],
    });
    toast.info('নমুনা তথ্য স্বয়ংক্রিয়ভাবে ফর্মের ঘরে পূরণ করা হয়েছে!');
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
        instituteOrOccupation: '',
        relation: '',
        address: 'বর্তমান ঠিকানা',
        specialInfo: '',
        mobileNumber: '',
      };
      return { ...prev, members: [...prev.members, newMember] };
    });
    toast.info('নতুন সদস্য সারি যুক্ত করা হয়েছে');
  };

  const removeMemberRow = (index) => {
    if (formData.members.length <= 1) {
      toast.warning('অন্তত ১ জন সদস্যের তথ্য রাখুন');
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
          <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center border-2 border-[#0F2C59] rounded-full p-1 bg-white shadow-xs">
            <div className="w-full h-full rounded-full border border-dashed border-[#1B8A44] flex flex-col items-center justify-center text-center p-0.5">
              <HeartHandshake className="w-6 h-6 text-[#1B8A44]" />
              <span className="text-[7px] font-bold text-[#0F2C59] leading-none mt-0.5">অলি মিয়া সমাজ কল্যাণ</span>
            </div>
          </div>

          {/* Centered Main Title Banner */}
          <div className="text-center flex-1 px-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0F2C59] tracking-tight mb-1 font-serif">
              অলি মিয়া সমাজ কল্যাণ পরিষদ
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-black">
              অলি মিয়া মিশ্রির বাড়ি, উত্তর গোলিন্দর বীর,
            </p>
            <p className="text-xs sm:text-sm font-semibold text-black">
              ৯নং ওয়ার্ড পশ্চিম পৌর এলাকা, পটিয়া চট্টগ্রাম।
            </p>
          </div>

          {/* Right Spacer or Badge */}
          <div className="w-20 hidden sm:block"></div>
        </div>

        {/* Top Metadata Section */}
        <div className="space-y-3 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 flex-1 w-full sm:w-auto">
              <label className="whitespace-nowrap text-black font-bold text-xs sm:text-sm">সূত্র :</label>
              <input
                type="text"
                value={formData.refNo}
                onChange={(e) => handleInputChange('refNo', e.target.value)}
                className="w-full max-w-xs bg-transparent border-b border-dotted border-black px-2 py-0.5 font-sans font-medium text-xs text-black focus:outline-hidden focus:border-solid focus:border-[#1B8A44]"
              />
            </div>

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
              <input
                type="text"
                value={formData.memberNo}
                onChange={(e) => handleInputChange('memberNo', e.target.value)}
                className="w-32 bg-white border border-black rounded-xs px-2 py-0.5 font-mono font-bold text-center text-black text-xs focus:outline-hidden"
              />
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
          
          {/* ১. নাম & পেশা */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-baseline">
            <div className="md:col-span-2 flex items-baseline">
              <label className="font-bold w-32 flex-shrink-0 text-black">
                ১. নাম <span className="text-rose-600">*</span> :
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

          {/* ৪. বর্তমান ঠিকানা */}
          <div>
            <div className="flex flex-wrap items-baseline gap-y-1">
              <label className="font-bold w-32 flex-shrink-0 text-black">৪. বর্তমান ঠিকানা :</label>
              <span className="font-semibold mr-1 text-black">বাড়ি/গ্রাম :</span>
              <input
                type="text"
                value={formData.presentAddress.village}
                onChange={(e) => handleAddressChange('presentAddress', 'village', e.target.value)}
                className="min-w-[140px] flex-1 bg-transparent border-b border-dotted border-black px-2 py-0.5 mr-2 text-black focus:outline-hidden"
              />
              <span className="font-semibold mr-1 text-black">রোড :</span>
              <input
                type="text"
                value={formData.presentAddress.road}
                onChange={(e) => handleAddressChange('presentAddress', 'road', e.target.value)}
                className="min-w-[90px] w-28 bg-transparent border-b border-dotted border-black px-2 py-0.5 mr-2 text-black focus:outline-hidden"
              />
            </div>
            <div className="flex flex-wrap items-baseline gap-y-1 mt-1 pl-0 sm:pl-32">
              <span className="font-semibold mr-1 text-black">পোঃ :</span>
              <input
                type="text"
                value={formData.presentAddress.postOffice}
                onChange={(e) => handleAddressChange('presentAddress', 'postOffice', e.target.value)}
                className="w-24 bg-transparent border-b border-dotted border-black px-2 py-0.5 mr-2 text-black focus:outline-hidden"
              />
              <span className="font-semibold mr-1 text-black">থানা :</span>
              <input
                type="text"
                value={formData.presentAddress.thana}
                onChange={(e) => handleAddressChange('presentAddress', 'thana', e.target.value)}
                className="w-28 bg-transparent border-b border-dotted border-black px-2 py-0.5 mr-2 text-black focus:outline-hidden"
              />
              <span className="font-semibold mr-1 text-black">জেলা :</span>
              <input
                type="text"
                value={formData.presentAddress.district}
                onChange={(e) => handleAddressChange('presentAddress', 'district', e.target.value)}
                className="w-28 bg-transparent border-b border-dotted border-black px-2 py-0.5 text-black focus:outline-hidden"
              />
            </div>
          </div>

          {/* ৫. স্থায়ী ঠিকানা */}
          <div>
            <div className="flex flex-wrap justify-between items-baseline mb-1">
              <div className="flex flex-wrap items-baseline gap-y-1 flex-1">
                <label className="font-bold w-32 flex-shrink-0 text-black">৫. স্থায়ী ঠিকানা :</label>
                <span className="font-semibold mr-1 text-black">বাড়ি/গ্রাম :</span>
                <input
                  type="text"
                  value={formData.permanentAddress.village}
                  onChange={(e) => handleAddressChange('permanentAddress', 'village', e.target.value)}
                  disabled={sameAsPresent}
                  className="min-w-[140px] flex-1 bg-transparent border-b border-dotted border-black px-2 py-0.5 mr-2 text-black focus:outline-hidden disabled:opacity-70"
                />
                <span className="font-semibold mr-1 text-black">রোড :</span>
                <input
                  type="text"
                  value={formData.permanentAddress.road}
                  onChange={(e) => handleAddressChange('permanentAddress', 'road', e.target.value)}
                  disabled={sameAsPresent}
                  className="min-w-[90px] w-28 bg-transparent border-b border-dotted border-black px-2 py-0.5 mr-2 text-black focus:outline-hidden disabled:opacity-70"
                />
              </div>
              <label className="text-[11px] font-sans font-medium text-black flex items-center gap-1 cursor-pointer ml-2">
                <input
                  type="checkbox"
                  checked={sameAsPresent}
                  onChange={(e) => handleToggleSameAsPresent(e.target.checked)}
                  className="rounded text-black focus:ring-black"
                />
                বর্তমান ঠিকানার অনুরূপ
              </label>
            </div>
            {!sameAsPresent && (
              <div className="flex flex-wrap items-baseline gap-y-1 mt-1 pl-0 sm:pl-32">
                <span className="font-semibold mr-1 text-black">পোঃ :</span>
                <input
                  type="text"
                  value={formData.permanentAddress.postOffice}
                  onChange={(e) => handleAddressChange('permanentAddress', 'postOffice', e.target.value)}
                  className="w-24 bg-transparent border-b border-dotted border-black px-2 py-0.5 mr-2 text-black focus:outline-hidden"
                />
                <span className="font-semibold mr-1 text-black">থানা :</span>
                <input
                  type="text"
                  value={formData.permanentAddress.thana}
                  onChange={(e) => handleAddressChange('permanentAddress', 'thana', e.target.value)}
                  className="w-28 bg-transparent border-b border-dotted border-black px-2 py-0.5 mr-2 text-black focus:outline-hidden"
                />
                <span className="font-semibold mr-1 text-black">জেলা :</span>
                <input
                  type="text"
                  value={formData.permanentAddress.district}
                  onChange={(e) => handleAddressChange('permanentAddress', 'district', e.target.value)}
                  className="w-28 bg-transparent border-b border-dotted border-black px-2 py-0.5 text-black focus:outline-hidden"
                />
              </div>
            )}
          </div>

          {/* ৬. জন্ম তারিখ ও রক্তের গ্রুপ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center">
            <div className="flex items-center gap-1 flex-wrap">
              <label className="font-bold w-32 flex-shrink-0 text-black">৬. জন্ম তারিখ :</label>
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
                <Heart size={14} className="text-rose-700" /> রক্তের গ্রুপ :
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
          </div>

          {/* ৭. জাতীয়তা & ধর্ম */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-baseline">
            <div className="flex items-baseline">
              <label className="font-bold w-32 flex-shrink-0 text-black">৭. জাতীয়তা :</label>
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

          {/* ৮. জাতীয় পরিচয়পত্র নং */}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <label className="font-bold w-32 flex-shrink-0 text-black">৮. জাতীয় পরিচয়পত্র নং :</label>
              {renderDigitInputBoxes(
                formData.nidNumber,
                (val) => handleInputChange('nidNumber', val),
                17,
                false
              )}
            </div>
          </div>

          {/* ৯. জন্ম সনদ & পাসপোর্ট নং */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-baseline">
            <div className="flex items-baseline">
              <label className="font-bold w-32 flex-shrink-0 text-black">৯. জন্ম সনদ :</label>
              <input
                type="text"
                value={formData.birthCertificateNo}
                onChange={(e) => handleInputChange('birthCertificateNo', e.target.value)}
                className="flex-1 bg-transparent border-b border-dotted border-black px-2 py-0.5 font-mono text-black focus:outline-hidden"
              />
            </div>
            <div className="flex items-baseline">
              <label className="font-bold w-24 flex-shrink-0 text-black">পাসপোর্ট নং :</label>
              <input
                type="text"
                value={formData.passportNo}
                onChange={(e) => handleInputChange('passportNo', e.target.value)}
                className="flex-1 bg-transparent border-b border-dotted border-black px-2 py-0.5 font-mono text-black focus:outline-hidden"
              />
            </div>
          </div>

          {/* ১০. শিক্ষাগত যোগ্যতা */}
          <div className="flex items-baseline">
            <label className="font-bold w-32 flex-shrink-0 text-black">১০. শিক্ষাগত যোগ্যতা :</label>
            <input
              type="text"
              value={formData.educationalQualification}
              onChange={(e) => handleInputChange('educationalQualification', e.target.value)}
              className="flex-1 bg-transparent border-b border-dotted border-black px-2 py-0.5 text-black focus:outline-hidden"
            />
          </div>

          {/* ১১. মোবাইল নাম্বার & বিকল্প নাম্বার */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <label className="font-bold w-32 flex-shrink-0 text-black">
                ১১. মোবাইল নাম্বার <span className="text-rose-600">*</span> :
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
                <th className="border border-black p-1.5 min-w-[130px]">নাম</th>
                <th className="border border-black p-1.5 w-28">জন্ম তারিখ<br /><span className="text-[9px] font-normal">(দিন/মাস/বছর)</span></th>
                <th className="border border-black p-1.5 w-20">রক্তের গ্রুপ</th>
                <th className="border border-black p-1.5 min-w-[140px]">শিক্ষা প্রতিষ্ঠান/শ্রেণি/পেশা</th>
                <th className="border border-black p-1.5 w-28">সম্পর্ক<br /><span className="text-[9px] font-normal">(স্ত্রী/পুত্র/কন্যা ইত্যাদি)</span></th>
                <th className="border border-black p-1.5 min-w-[120px]">ঠিকানা</th>
                <th className="border border-black p-1.5 min-w-[120px]">বিশেষ তথ্য<br /><span className="text-[9px] font-normal">(রোগী, প্রবাসী, প্রতিবন্ধী)</span></th>
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
                      value={member.address}
                      onChange={(e) => handleMemberChange(idx, 'address', e.target.value)}
                      className="w-full bg-transparent px-1 py-0.5 text-xs text-black focus:outline-hidden"
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
            এই মর্মে ঘোষণা, স্বীকার ও সুস্থ মস্তিষ্কে জানাচ্ছি যে, আমার দেওয়া উপরোল্লিখিত সকল তথ্য সত্য এবং নির্ভুল। এ ছাড়া আধে প্রমাণ হলে, আমি আইনগতভাবে পরিষদের অন্যান্য করণীয় প্রতিটি গ্রহণ করতে বাধ্য থাকিব। আমি অলি মিয়া সমাজ কল্যাণ পরিষদের গঠনতন্ত্র, নীতি ও সিদ্ধান্ত মেনে চলব। পরিষদের পবিত্র উদ্দেশ্য বাস্তবায়নে নিজেকে নিয়োজিত রাখব এবং সমাজ কল্যাণমূলক সকল কার্যক্রমে সরাসরি বা পরোক্ষভাবে সহযোগিতা করব। আমি বিবাদ বা বিতেন সৃষ্টি না করে শান্তিপূর্ণ, ঐক্যবদ্ধ ও সৌহার্দ্যপূর্ণ পরিবেশ বজায় রাখতে সচেষ্ট থাকব, ইনশাআল্লাহ।
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

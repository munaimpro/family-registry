'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
    Plus,
    Trash2,
    Save,
    Printer,
    Heart,
    HeartHandshake,
    Upload,
    X,
    GripVertical
} from 'lucide-react';

export const FamilyForm = ({
    records,
    initialData,
    onSaveSuccess,
    onCancel,
    onPrintPreview,
}) => {
    // Admin settings state
    const [appSettings, setAppSettings] = useState({
        formTitle: '',
        address: '',
        logo: ''
    });

    // Fetch settings from API on component mount
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/admin/settings`);
                if (!response.ok) {
                    throw new Error('নেটওয়ার্ক সমস্যা বা তথ্য পাওয়া যায়নি');
                }
                const data = await response.json();
                setAppSettings({
                    formTitle: data?.formTitle || '',
                    address: data?.address || '',
                    logo: data?.logo || ''
                });
            } catch (error) {
                console.error('Settings fetching error:', error);
            }
        };

        fetchSettings();
    }, []);

    const customLogo = appSettings.logo;
    const formTitle = appSettings.formTitle || 'পরিবার শুমারি ও তথ্য নিবন্ধন ফরম';
    const address = appSettings.address || 'উত্তর গোলিন্দর বীর, ৯নং ওয়ার্ড, পটিয়া, চট্টগ্রাম';

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
                headGender: initialData.headGender || 'Male',
                headImage: initialData.headImage || '',
                bloodDonationDates: normalizeDates(initialData.bloodDonationDates),
                members: (initialData.members || []).map(m => ({
                    ...m,
                    image: m.image || '',
                    selected: m.selected || false,
                    isDeceased: m.isDeceased || false,
                    isMarried: m.isMarried || false,
                    bloodDonationDates: normalizeDates(m.bloodDonationDates)
                }))
            };
        }
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();
        const dateStr = `${dd}/${mm}/${yyyy}`;

        return {
            id: `rec-${Date.now()}`,
            refNo: '',
            date: dateStr,
            memberNo: '',
            formNo: '',
            headName: '',
            headGender: 'Male',
            headImage: '',
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
                    selected: false,
                    isDeceased: false,
                    isMarried: false,
                    name: '',
                    image: '',
                    gender: 'Female',
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
                    selected: false,
                    isDeceased: false,
                    isMarried: false,
                    name: '',
                    image: '',
                    gender: 'Male',
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

    useEffect(() => {
        if (!initialData && records) {
            const nextCount = (records.length || 0) + 1;
            const paddedNo = String(nextCount).padStart(2, '0');

            setFormData(prev => ({
                ...prev,
                memberNo: prev.memberNo ? prev.memberNo : `OMSKP-${paddedNo}`,
                formNo: prev.formNo ? prev.formNo : paddedNo
            }));
        }
    }, [records, initialData]);

    const [sameAsPresent, setSameAsPresent] = useState(true);
    const [headBloodDateInput, setHeadBloodDateInput] = useState('');
    const [memberBloodDateInputs, setMemberBloodDateInputs] = useState({});

    // Drag & Drop State
    const [draggedIndex, setDraggedIndex] = useState(null);

    // File Upload Handlers
    const handleHeadImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, headImage: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleMemberImageChange = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => {
                    const updated = [...prev.members];
                    updated[index] = { ...updated[index], image: reader.result };
                    return { ...prev, members: updated };
                });
            };
            reader.readAsDataURL(file);
        }
    };

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
            headGender: 'Male',
            headImage: '',
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
                    selected: false,
                    isDeceased: false,
                    isMarried: false,
                    name: 'মোসাম্মৎ সুলতানা আক্তার',
                    image: '',
                    gender: 'Female',
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
                    selected: false,
                    isDeceased: false,
                    isMarried: false,
                    name: 'তানভীর ইসলাম তানিম',
                    image: '',
                    gender: 'Male',
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
                    selected: false,
                    isDeceased: false,
                    isMarried: false,
                    name: 'আনিকা ইসলাম',
                    image: '',
                    gender: 'Female',
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

    // Drag and Drop Logic
    const handleDragStart = (index) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (dropIndex) => {
        if (draggedIndex === null || draggedIndex === dropIndex) return;
        setFormData(prev => {
            const updatedMembers = [...prev.members];
            const [draggedItem] = updatedMembers.splice(draggedIndex, 1);
            updatedMembers.splice(dropIndex, 0, draggedItem);

            const reordered = updatedMembers.map((m, i) => ({
                ...m,
                slNo: i + 1
            }));
            return { ...prev, members: reordered };
        });
        setDraggedIndex(null);
    };

    const addMemberRow = () => {
        setFormData(prev => {
            const newSl = prev.members.length + 1;
            const newMember = {
                id: `mem-${Date.now()}-${newSl}`,
                slNo: newSl,
                selected: false,
                isDeceased: false,
                isMarried: false,
                name: '',
                image: '',
                gender: 'Male',
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
        // if (formData.members.length <= 1) {
        //     toast.error('অন্তত ১ জন সদস্যের তথ্য রাখুন');
        //     return;
        // }
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

        if (!formData.isMohollaMember && !formData.isBloodDonorMember && !formData.isTemporaryMember) {
            toast.error('অনুগ্রহ করে মহল্লা সদস্য, রক্তদাতা সদস্য অথবা ভাড়াটিয়া/অস্থায়ী সদস্য নির্বাচন করুন');
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
        <div className="max-w-5xl mx-auto my-2 sm:my-6 px-1 sm:px-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white text-[#0F2C59] p-3 sm:p-6 md:p-8 rounded-lg shadow-2xl border border-slate-200 md:border-2 md:border-[#0F2C59] relative overflow-hidden font-serif leading-snug"
            >
                {/* Top Right Decorative Accent */}
                <svg
                    className="absolute top-0 right-0 w-32 sm:w-64 md:w-80 h-16 sm:h-28 md:h-32 pointer-events-none z-10"
                    viewBox="0 0 320 128"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <polygon points="120,0 320,0 320,80 180,0" fill="#1B8A44" />
                    <polygon points="60,0 120,0 320,80 320,110 200,32" fill="#62C255" />
                </svg>

                {/* Top Header Branding Block */}
                <div className="flex flex-col md:flex-row items-center justify-between border-b-2 border-[#0F2C59] pb-4 mb-4 gap-3 relative z-20">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 flex items-center justify-center border-2 border-[#0F2C59] rounded-full p-1 bg-white shadow-xs overflow-hidden">
                        {customLogo ? (
                            <img src={customLogo} alt="Logo" className="w-full h-full object-cover rounded-full" />
                        ) : (
                            <div className="w-full h-full rounded-full border border-dashed border-[#1B8A44] flex flex-col items-center justify-center text-center p-0.5">
                                <HeartHandshake className="w-5 h-5 sm:w-6 sm:h-6 text-[#1B8A44]" />
                                <span className="text-[6px] sm:text-[7px] font-bold text-[#0F2C59] leading-none mt-0.5">অলি মিয়া সমাজ কল্যাণ</span>
                            </div>
                        )}
                    </div>

                    <div className="text-center flex-1 px-1 sm:px-2">
                        <h1 className="text-xl sm:text-2xl md:text-4xl font-extrabold text-[#0F2C59] tracking-tight mb-1 font-serif">
                            {formTitle}
                        </h1>
                        <p className="text-[11px] sm:text-xs md:text-sm font-semibold text-black mb-1">
                            {address}
                        </p>
                    </div>

                    <div className="w-20 hidden md:block"></div>
                </div>

                {/* Top Metadata Section */}
                <div className="space-y-3 mb-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end gap-2">
                        <div className="flex items-center gap-1.5 w-full sm:w-auto justify-between sm:justify-end">
                            <label className="whitespace-nowrap text-black font-bold text-xs sm:text-sm">তারিখ :</label>
                            <div className="flex items-center gap-1">
                                <input
                                    readOnly
                                    type="text"
                                    maxLength={2}
                                    value={dateParts.dd}
                                    onChange={(e) => handleDatePartChange('dd', e.target.value)}
                                    className="w-8 sm:w-9 h-7 border border-black bg-white text-center font-mono font-bold text-xs text-black focus:ring-1 focus:ring-[#1B8A44] focus:outline-hidden rounded-xs uppercase"
                                />
                                <input
                                    readOnly
                                    type="text"
                                    maxLength={2}
                                    value={dateParts.mm}
                                    onChange={(e) => handleDatePartChange('mm', e.target.value)}
                                    className="w-8 sm:w-9 h-7 border border-black bg-white text-center font-mono font-bold text-xs text-black focus:ring-1 focus:ring-[#1B8A44] focus:outline-hidden rounded-xs uppercase"
                                />
                                <input
                                    readOnly
                                    type="text"
                                    maxLength={4}
                                    value={dateParts.yyyy}
                                    onChange={(e) => handleDatePartChange('yyyy', e.target.value)}
                                    className="w-12 sm:w-14 h-7 border border-black bg-white text-center font-mono font-bold text-xs text-black focus:ring-1 focus:ring-[#1B8A44] focus:outline-hidden rounded-xs uppercase"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                        <div className="flex items-center gap-1.5 w-full md:w-auto">
                            <label className="whitespace-nowrap text-black font-bold text-xs sm:text-sm flex-shrink-0">সদস্য নং–</label>
                            <div className="flex items-center border border-black rounded-xs bg-white overflow-hidden w-full md:w-auto">
                                <span className="bg-gray-100 px-2 py-0.5 border-r border-black font-mono font-bold text-black text-xs flex-shrink-0">OMSKP-</span>
                                <input
                                    readOnly
                                    type="text"
                                    value={formData.memberNo ? formData.memberNo.replace('OMSKP-', '') : ''}
                                    onChange={(e) => handleInputChange('memberNo', e.target.value)}
                                    className="w-full md:w-20 px-2 py-0.5 font-mono font-bold text-center text-black text-xs focus:outline-hidden uppercase"
                                />
                            </div>
                        </div>

                        {/* Membership Type Checkbox Fields */}
                        <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2 bg-amber-50 border border-amber-300 px-2.5 py-1.5 rounded-lg shadow-2xs">
                            <div className="flex items-center gap-1 cursor-pointer">
                                <input
                                    type="checkbox"
                                    id="isMohollaMemberCheckbox"
                                    checked={Boolean(formData.isMohollaMember)}
                                    onChange={(e) => handleInputChange('isMohollaMember', e.target.checked)}
                                    className="w-4 h-4 text-emerald-600 rounded border-slate-400 focus:ring-emerald-500 cursor-pointer"
                                />
                                <label htmlFor="isMohollaMemberCheckbox" className="font-bold text-emerald-900 text-xs cursor-pointer select-none">
                                    মহল্লা সদস্য
                                </label>
                            </div>

                            <div className="flex items-center gap-1 cursor-pointer sm:border-l sm:border-amber-300 sm:pl-2">
                                <input
                                    type="checkbox"
                                    id="isBloodDonorMemberCheckbox"
                                    checked={Boolean(formData.isBloodDonorMember)}
                                    onChange={(e) => handleInputChange('isBloodDonorMember', e.target.checked)}
                                    className="w-4 h-4 text-rose-600 rounded border-slate-400 focus:ring-rose-500 cursor-pointer"
                                />
                                <label htmlFor="isBloodDonorMemberCheckbox" className="font-bold text-rose-900 text-xs cursor-pointer select-none">
                                    রক্ত দাতা সদস্য
                                </label>
                            </div>

                            <div className="flex items-center gap-1 cursor-pointer sm:border-l sm:border-amber-300 sm:pl-2">
                                <input
                                    type="checkbox"
                                    id="isTemporaryMemberCheckbox"
                                    checked={Boolean(formData.isTemporaryMember)}
                                    onChange={(e) => handleInputChange('isTemporaryMember', e.target.checked)}
                                    className="w-4 h-4 text-purple-600 rounded border-slate-400 focus:ring-purple-500 cursor-pointer"
                                />
                                <label htmlFor="isTemporaryMemberCheckbox" className="font-bold text-purple-900 text-xs cursor-pointer select-none">
                                    ভাড়াটিয়া/অস্থায়ী
                                </label>
                            </div>
                        </div>

                        <div className="flex items-center gap-1.5 w-full md:w-auto">
                            <label className="whitespace-nowrap text-black font-bold text-xs sm:text-sm flex-shrink-0">ফরম নং–</label>
                            <input
                                readOnly
                                type="text"
                                value={formData.formNo ? formData.formNo : ''}
                                onChange={(e) => handleInputChange('formNo', e.target.value)}
                                className="w-full md:w-32 bg-white border border-black rounded-xs px-2 py-0.5 font-mono font-bold text-center text-black text-xs focus:outline-hidden uppercase"
                            />
                        </div>
                    </div>
                </div>

                {/* Numbered Input Form Section */}
                <div className="space-y-4 text-xs text-black">

                    {/* ১. সদস্য/সদস্যা & পেশা */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-2 items-start md:items-baseline">
                        <div className="md:col-span-2 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2">
                            <div className="flex items-center gap-2">
                                <label className="font-bold text-black whitespace-nowrap">
                                    ১. সদস্য/সদস্যা <span className="text-rose-600">*</span> :
                                </label>
                                <div className="relative flex-shrink-0">
                                    {formData.headImage ? (
                                        <div className="relative w-8 h-8 sm:w-10 sm:h-10 border border-black rounded overflow-hidden group">
                                            <img src={formData.headImage} alt="Head Member" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => handleInputChange('headImage', '')}
                                                className="absolute top-0 right-0 bg-rose-600 text-white rounded-bl p-0.5 opacity-0 group-hover:opacity-100 transition print:hidden"
                                                title="ছবি মুছুন"
                                            >
                                                <X size={10} />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="w-8 h-8 sm:w-10 sm:h-10 border border-dashed border-gray-400 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition print:hidden" title="ছবি আপলোড করুন">
                                            <Upload size={12} className="text-gray-500" />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleHeadImageChange}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                </div>
                            </div>
                            <input
                                type="text"
                                required
                                value={formData.headName}
                                onChange={(e) => handleInputChange('headName', e.target.value)}
                                className="w-full flex-1 bg-transparent border-b border-dotted border-black px-1.5 py-0.5 font-bold text-sm text-black focus:outline-hidden uppercase"
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                            <label className="font-bold sm:w-16 flex-shrink-0 text-black">লিঙ্গ :</label>
                            <select
                                value={formData.headGender || 'Male'}
                                onChange={(e) => handleInputChange('headGender', e.target.value)}
                                className="w-full flex-1 bg-transparent border-b border-dotted border-black px-1.5 py-0.5 font-normal text-black focus:outline-hidden"
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                            <label className="font-bold sm:w-16 flex-shrink-0 text-black">পেশা :</label>
                            <input
                                type="text"
                                value={formData.headOccupation}
                                onChange={(e) => handleInputChange('headOccupation', e.target.value)}
                                className="w-full flex-1 bg-transparent border-b border-dotted border-black px-1.5 py-0.5 font-normal text-black focus:outline-hidden uppercase"
                            />
                        </div>
                    </div>

                    {/* ২. পিতা/স্বামীর নাম & পেশা */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-2 items-start md:items-baseline">
                        <div className="md:col-span-2 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                            <label className="font-bold sm:w-32 flex-shrink-0 text-black">২. পিতা/স্বামীর নাম :</label>
                            <input
                                type="text"
                                value={formData.fatherOrHusbandName}
                                onChange={(e) => handleInputChange('fatherOrHusbandName', e.target.value)}
                                className="w-full flex-1 bg-transparent border-b border-dotted border-black px-1.5 py-0.5 font-normal text-black focus:outline-hidden uppercase"
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                            <label className="font-bold sm:w-16 flex-shrink-0 text-black">পেশা :</label>
                            <input
                                type="text"
                                value={formData.fatherOrHusbandOccupation}
                                onChange={(e) => handleInputChange('fatherOrHusbandOccupation', e.target.value)}
                                className="w-full flex-1 bg-transparent border-b border-dotted border-black px-1.5 py-0.5 font-normal text-black focus:outline-hidden uppercase"
                            />
                        </div>
                    </div>

                    {/* ৩. মাতার নাম & পেশা */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-2 items-start md:items-baseline">
                        <div className="md:col-span-2 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                            <label className="font-bold sm:w-32 flex-shrink-0 text-black">৩. মাতার নাম :</label>
                            <input
                                type="text"
                                value={formData.motherName}
                                onChange={(e) => handleInputChange('motherName', e.target.value)}
                                className="w-full flex-1 bg-transparent border-b border-dotted border-black px-1.5 py-0.5 font-normal text-black focus:outline-hidden uppercase"
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                            <label className="font-bold sm:w-16 flex-shrink-0 text-black">পেশা :</label>
                            <input
                                type="text"
                                value={formData.motherOccupation}
                                onChange={(e) => handleInputChange('motherOccupation', e.target.value)}
                                className="w-full flex-1 bg-transparent border-b border-dotted border-black px-1.5 py-0.5 font-normal text-black focus:outline-hidden uppercase"
                            />
                        </div>
                    </div>

                    {/* ৪. ঠিকানা */}
                    <div className="space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                            <label className="font-bold sm:w-32 flex-shrink-0 text-black">৪. ঠিকানা :</label>
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div className="flex items-center gap-1.5">
                                    <span className="font-semibold flex-shrink-0 text-black">বাড়ি/গ্রাম :</span>
                                    <input
                                        type="text"
                                        value={formData.presentAddress.village}
                                        onChange={(e) => handleAddressChange('village', e.target.value)}
                                        className="w-full bg-transparent border-b border-dotted border-black px-1 py-0.5 text-black focus:outline-hidden uppercase"
                                    />
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="font-semibold flex-shrink-0 text-black">রোড :</span>
                                    <input
                                        type="text"
                                        value={formData.presentAddress.road}
                                        onChange={(e) => handleAddressChange('road', e.target.value)}
                                        className="w-full bg-transparent border-b border-dotted border-black px-1 py-0.5 text-black focus:outline-hidden uppercase"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pl-0 sm:pl-32">
                            <div className="flex items-center gap-1.5">
                                <span className="font-semibold flex-shrink-0 text-black">পোঃ :</span>
                                <input
                                    type="text"
                                    value={formData.presentAddress.postOffice}
                                    onChange={(e) => handleAddressChange('postOffice', e.target.value)}
                                    className="w-full bg-transparent border-b border-dotted border-black px-1 py-0.5 text-black focus:outline-hidden uppercase"
                                />
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="font-semibold flex-shrink-0 text-black">থানা :</span>
                                <input
                                    type="text"
                                    value={formData.presentAddress.thana}
                                    onChange={(e) => handleAddressChange('thana', e.target.value)}
                                    className="w-full bg-transparent border-b border-dotted border-black px-1 py-0.5 text-black focus:outline-hidden uppercase"
                                />
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="font-semibold flex-shrink-0 text-black">জেলা :</span>
                                <input
                                    type="text"
                                    value={formData.presentAddress.district}
                                    onChange={(e) => handleAddressChange('district', e.target.value)}
                                    className="w-full bg-transparent border-b border-dotted border-black px-1 py-0.5 text-black focus:outline-hidden uppercase"
                                />
                            </div>
                        </div>
                    </div>

                    {/* ৫. জন্ম তারিখ ও রক্তের গ্রুপ */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-2 items-center">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <label className="font-bold sm:w-32 flex-shrink-0 text-black">৫. জন্ম তারিখ<span className="text-rose-600">*</span> :</label>
                            <div className="flex items-center gap-1">
                                <span className="text-[11px] text-black">দিন:</span>
                                <input
                                    type="text"
                                    required
                                    maxLength={2}
                                    value={dobParts.dd}
                                    onChange={(e) => handleDobPartChange('dd', e.target.value)}
                                    className="w-8 sm:w-9 h-7 border border-black bg-white text-center font-mono font-bold text-xs text-black focus:outline-hidden uppercase"
                                />
                                <span className="text-[11px] text-black ml-1">মাস:</span>
                                <input
                                    type="text"
                                    required
                                    maxLength={2}
                                    value={dobParts.mm}
                                    onChange={(e) => handleDobPartChange('mm', e.target.value)}
                                    className="w-8 sm:w-9 h-7 border border-black bg-white text-center font-mono font-bold text-xs text-black focus:outline-hidden uppercase"
                                />
                                <span className="text-[11px] text-black ml-1">বছর:</span>
                                <input
                                    type="text"
                                    required
                                    minLength={4}
                                    maxLength={4}
                                    value={dobParts.yyyy}
                                    onChange={(e) => handleDobPartChange('yyyy', e.target.value)}
                                    className="w-12 sm:w-14 h-7 border border-black bg-white text-center font-mono font-bold text-xs text-black focus:outline-hidden uppercase"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 justify-between sm:justify-start md:justify-end">
                            <label className="font-bold text-black flex items-center gap-1">
                                <Heart size={14} className="text-rose-700 fill-rose-600" /> রক্তের গ্রুপ :
                            </label>
                            <select
                                required
                                value={formData.bloodGroup}
                                onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                                className="bg-white border border-black rounded px-2.5 py-1 font-bold text-black text-xs focus:outline-hidden"
                            >
                                <option value="">নির্বাচন করুন</option>
                                {bloodGroups.map(bg => (
                                    <option key={bg} value={bg}>{bg}</option>
                                ))}
                            </select>
                        </div>

                        {/* রক্তদানের তারিখ (Head Multiple Dates) */}
                        <div className="col-span-1 md:col-span-2 pt-2 mt-1 border-t border-dotted border-slate-300">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                <label className="font-bold text-black flex items-center gap-1 text-xs whitespace-nowrap">
                                    <Heart size={14} className="text-rose-700 fill-rose-600" /> রক্তদানের তারিখ :
                                </label>

                                <div className="flex flex-wrap items-center gap-1.5">
                                    {(formData.bloodDonationDates || []).map((dateStr, dIdx) => (
                                        <span key={dIdx} className="inline-flex items-center gap-1 bg-rose-50 border border-rose-300 text-rose-800 text-xs font-bold px-2 py-0.5 rounded-full shadow-2xs">
                                            <Heart size={10} className="text-rose-600 fill-rose-600" />
                                            <span>{dateStr}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveHeadBloodDate(dIdx)}
                                                className="text-rose-500 hover:text-rose-800 font-black ml-0.5 cursor-pointer leading-none"
                                                title="তারিখ মুছুন"
                                            >
                                                &times;
                                            </button>
                                        </span>
                                    ))}
                                </div>

                                <div className="flex items-center gap-1.5 w-full sm:w-auto print:hidden mt-1 sm:mt-0">
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
                                        className="w-full sm:w-44 bg-white border border-black rounded px-2 py-1 text-xs text-black font-medium focus:outline-none focus:ring-1 focus:ring-rose-500 uppercase"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddHeadBloodDate}
                                        className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-bold flex items-center gap-1 cursor-pointer shadow-xs whitespace-nowrap"
                                    >
                                        + যোগ
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ৬. জাতীয়তা & ধর্ম */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-2 items-start md:items-baseline">
                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                            <label className="font-bold sm:w-32 flex-shrink-0 text-black">৬. জাতীয়তা :</label>
                            <input
                                type="text"
                                value={formData.nationality}
                                onChange={(e) => handleInputChange('nationality', e.target.value)}
                                className="w-full flex-1 bg-transparent border-b border-dotted border-black px-1.5 py-0.5 text-black focus:outline-hidden uppercase"
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                            <label className="font-bold sm:w-16 flex-shrink-0 text-black">ধর্ম :</label>
                            <input
                                type="text"
                                value={formData.religion}
                                onChange={(e) => handleInputChange('religion', e.target.value)}
                                className="w-full flex-1 bg-transparent border-b border-dotted border-black px-1.5 py-0.5 text-black focus:outline-hidden uppercase"
                            />
                        </div>
                    </div>

                    {/* ৭. জাতীয় পরিচয়পত্র নং */}
                    <div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5">
                            <label className="font-bold sm:w-32 flex-shrink-0 text-black">৭. জাতীয় পরিচয়পত্র নং<span className="text-rose-600">*</span> :</label>
                            {renderDigitInputBoxes(
                                formData.nidNumber,
                                (val) => handleInputChange('nidNumber', val),
                                17,
                                true
                            )}
                        </div>
                    </div>

                    {/* ৮. জন্ম সনদ & মৃত্যু তারিখ */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-2 items-start md:items-baseline">
                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                            <label className="font-bold sm:w-32 flex-shrink-0 text-black">৮. জন্ম সনদ :</label>
                            <input
                                type="text"
                                value={formData.birthCertificateNo}
                                onChange={(e) => handleInputChange('birthCertificateNo', e.target.value)}
                                className="w-full flex-1 bg-transparent border-b border-dotted border-black px-1.5 py-0.5 font-mono text-black focus:outline-hidden uppercase"
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <label className="font-bold sm:w-24 flex-shrink-0 text-black">মৃত্যু তারিখ :</label>
                            <div className="flex items-center gap-1">
                                <span className="text-[11px] text-black">দিন:</span>
                                <input
                                    type="text"
                                    maxLength={2}
                                    value={deathDateParts.dd}
                                    onChange={(e) => handleDeathDatePartChange('dd', e.target.value)}
                                    className="w-8 sm:w-9 h-7 border border-black bg-white text-center font-mono font-bold text-xs text-black focus:outline-hidden uppercase"
                                />
                                <span className="text-[11px] text-black ml-1">মাস:</span>
                                <input
                                    type="text"
                                    maxLength={2}
                                    value={deathDateParts.mm}
                                    onChange={(e) => handleDeathDatePartChange('mm', e.target.value)}
                                    className="w-8 sm:w-9 h-7 border border-black bg-white text-center font-mono font-bold text-xs text-black focus:outline-hidden uppercase"
                                />
                                <span className="text-[11px] text-black ml-1">বছর:</span>
                                <input
                                    type="text"
                                    maxLength={4}
                                    value={deathDateParts.yyyy}
                                    onChange={(e) => handleDeathDatePartChange('yyyy', e.target.value)}
                                    className="w-12 sm:w-14 h-7 border border-black bg-white text-center font-mono font-bold text-xs text-black focus:outline-hidden uppercase"
                                />
                            </div>
                        </div>
                    </div>

                    {/* ৯. শিক্ষাগত যোগ্যতা */}
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                        <label className="font-bold sm:w-32 flex-shrink-0 text-black">৯. শিক্ষাগত যোগ্যতা :</label>
                        <input
                            type="text"
                            value={formData.educationalQualification}
                            onChange={(e) => handleInputChange('educationalQualification', e.target.value)}
                            className="w-full flex-1 bg-transparent border-b border-dotted border-black px-1.5 py-0.5 text-black focus:outline-hidden uppercase"
                        />
                    </div>

                    {/* ১০. মোবাইল নাম্বার & বিকল্প নাম্বার */}
                    <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5">
                            <label className="font-bold sm:w-32 flex-shrink-0 text-black">
                                ১০. মোবাইল নাম্বার <span className="text-rose-600">*</span> :
                            </label>
                            {renderDigitInputBoxes(
                                formData.mobileNumber,
                                (val) => handleInputChange('mobileNumber', val),
                                11,
                                true
                            )}
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5">
                            <label className="font-bold sm:w-32 flex-shrink-0 text-black">
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
                    <span className="inline-block border border-black rounded-full px-4 sm:px-8 py-1 font-bold text-xs sm:text-sm text-black">
                        সদস্যগণের তথ্য/ওয়ারিশগণের তথ্য
                    </span>
                </div>

                {/* Mobile View Card Layout for Members (< lg screens) */}
                <div className="block lg:hidden space-y-3 mb-4">
                    {formData.members.map((member, idx) => (
                        <div
                            key={member.id}
                            className={`border border-black rounded-md p-3 relative bg-slate-50/50 space-y-2.5 ${member.isDeceased ? 'bg-gray-100 opacity-80' : ''}`}
                        >
                            <div className="flex items-center justify-between border-b border-gray-300 pb-2">
                                <span className="font-bold text-black text-xs">সদস্য #{idx + 1}</span>
                                <div className="flex items-center gap-2">
                                    <label className="flex items-center gap-1 text-xs text-rose-700 font-bold">
                                        <input
                                            type="checkbox"
                                            checked={Boolean(member.isDeceased)}
                                            onChange={(e) => handleMemberChange(idx, 'isDeceased', e.target.checked)}
                                            className="w-3.5 h-3.5 text-rose-600 rounded border-slate-400 focus:ring-rose-500 cursor-pointer"
                                        />
                                        মরহুম?
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => removeMemberRow(idx)}
                                        className="p-1 text-rose-600 hover:bg-rose-100 rounded transition cursor-pointer print:hidden"
                                        title="সারি সরান"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <label className="flex items-center gap-1 text-xs text-rose-700 font-bold">
                                        <input
                                            type="checkbox"
                                            checked={Boolean(member.isMarried)}
                                            onChange={(e) => handleMemberChange(idx, 'isMarried', e.target.checked)}
                                            className="w-3.5 h-3.5 text-rose-600 rounded border-slate-400 focus:ring-rose-500 cursor-pointer"
                                        />
                                        বিবাহিত?
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => removeMemberRow(idx)}
                                        className="p-1 text-rose-600 hover:bg-rose-100 rounded transition cursor-pointer print:hidden"
                                        title="সারি সরান"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                <div className="sm:col-span-2">
                                    <label className="font-semibold block text-black text-[11px] mb-0.5">সদস্য/সদস্যার নাম:</label>
                                    <div className="flex items-center gap-1.5">
                                        <div className="relative flex-shrink-0">
                                            {member.image ? (
                                                <div className="relative w-8 h-8 border border-black rounded overflow-hidden group">
                                                    <img src={member.image} alt={member.name || 'Member'} className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleMemberChange(idx, 'image', '')}
                                                        className="absolute top-0 right-0 bg-rose-600 text-white rounded-bl p-0.5 opacity-0 group-hover:opacity-100 transition print:hidden"
                                                    >
                                                        <X size={8} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <label className="w-8 h-8 border border-dashed border-gray-400 rounded flex items-center justify-center cursor-pointer hover:bg-gray-50 transition print:hidden">
                                                    <Upload size={12} className="text-gray-500" />
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleMemberImageChange(idx, e)}
                                                        className="hidden"
                                                    />
                                                </label>
                                            )}
                                        </div>
                                        <input
                                            type="text"
                                            value={member.name}
                                            onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                                            className="w-full border-b border-black px-1.5 py-0.5 bg-white uppercase"
                                            placeholder="নাম লিখুন"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="font-semibold block text-black text-[11px] mb-0.5">লিঙ্গ:</label>
                                    <select
                                        value={member.gender || 'Male'}
                                        onChange={(e) => handleMemberChange(idx, 'gender', e.target.value)}
                                        className="w-full border-b border-black px-1.5 py-0.5 bg-white text-xs"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="font-semibold block text-black text-[11px] mb-0.5">জন্ম তারিখ/বয়স:</label>
                                    <input
                                        type="text"
                                        value={member.dobOrAge}
                                        onChange={(e) => handleMemberChange(idx, 'dobOrAge', e.target.value)}
                                        className="w-full border-b border-black px-1.5 py-0.5 bg-white font-mono text-xs uppercase"
                                        placeholder="দিন/মাস/বছর"
                                    />
                                </div>

                                <div>
                                    <label className="font-semibold block text-black text-[11px] mb-0.5">রক্তের গ্রুপ:</label>
                                    <select
                                        required
                                        value={member.bloodGroup}
                                        onChange={(e) => handleMemberChange(idx, 'bloodGroup', e.target.value)}
                                        className="w-full border-b border-black px-1 py-0.5 bg-white text-xs font-bold"
                                    >
                                        <option value="">নির্বাচন করুন</option>
                                        {bloodGroups.map(bg => (
                                            <option key={bg} value={bg}>{bg}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="font-semibold block text-black text-[11px] mb-0.5">সম্পর্ক:</label>
                                    <input
                                        type="text"
                                        value={member.relation}
                                        onChange={(e) => handleMemberChange(idx, 'relation', e.target.value)}
                                        className="w-full border-b border-black px-1.5 py-0.5 bg-white uppercase"
                                        placeholder="স্ত্রী/পুত্র/কন্যা ইত্যাদি"
                                    />
                                </div>

                                <div>
                                    <label className="font-semibold block text-black text-[11px] mb-0.5">NID/মৃত্যু সনদ নং<span className="text-rose-600">*</span> :</label>
                                    <input
                                        type="text"
                                        required
                                        value={member.nidNumber || ''}
                                        onChange={(e) => handleMemberChange(idx, 'nidNumber', e.target.value)}
                                        className="w-full border-b border-black px-1.5 py-0.5 bg-white font-mono uppercase"
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="font-semibold block text-black text-[11px] mb-0.5">শিক্ষা প্রতিষ্ঠান/শ্রেণি/পেশা:</label>
                                    <input
                                        type="text"
                                        value={member.instituteOrOccupation}
                                        onChange={(e) => handleMemberChange(idx, 'instituteOrOccupation', e.target.value)}
                                        className="w-full border-b border-black px-1.5 py-0.5 bg-white uppercase"
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="font-semibold block text-black text-[11px] mb-0.5">বিশেষ তথ্য:</label>
                                    <input
                                        type="text"
                                        value={member.specialInfo || ''}
                                        onChange={(e) => handleMemberChange(idx, 'specialInfo', e.target.value)}
                                        className="w-full border-b border-black px-1.5 py-0.5 bg-white uppercase"
                                        placeholder="রোগী, প্রবাসী, প্রতিবন্ধী ইত্যাদি"
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="font-semibold block text-black text-[11px] mb-0.5">রক্তদানের তারিখসমূহ:</label>
                                    <div className="flex flex-wrap gap-1 mb-1">
                                        {normalizeDates(member.bloodDonationDates).map((dStr, dIdx) => (
                                            <span key={dIdx} className="inline-flex items-center gap-1 bg-rose-50 border border-rose-300 text-rose-800 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                                                <Heart size={8} className="text-rose-600 fill-rose-600" />
                                                <span>{dStr}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveMemberBloodDate(idx, dIdx)}
                                                    className="text-rose-500 font-bold ml-0.5"
                                                >
                                                    &times;
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-1 print:hidden">
                                        <input
                                            type="text"
                                            placeholder="দিন/মাস/বছর"
                                            value={memberBloodDateInputs[idx] || ''}
                                            onChange={(e) => setMemberBloodDateInputs(prev => ({ ...prev, [idx]: e.target.value }))}
                                            className="w-full bg-white border border-slate-300 rounded px-1.5 py-0.5 text-xs uppercase"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleAddMemberBloodDate(idx)}
                                            className="px-2 py-0.5 bg-rose-600 text-white rounded text-xs font-bold whitespace-nowrap"
                                        >
                                            + যোগ
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Warish Table (Desktop / Large Tablet View) */}
                <div className="hidden lg:block overflow-x-auto mb-4 border border-black rounded-lg bg-transparent">
                    <table className="w-full border-collapse text-center text-xs text-black">
                        <thead>
                            <tr className="border-b border-black font-bold text-black bg-slate-50/50">
                                <th className="border border-black p-1.5 w-10">ক্রমিক নং</th>
                                <th className="border border-black p-1.5 min-w-[180px] sm:min-w-[200px]">সদস্য/সদস্যা</th>
                                <th className="border border-black p-1.5 w-28">লিঙ্গ</th>
                                <th className="border border-black p-1.5 w-16">মরহুম?</th>
                                <th className="border border-black p-1.5 w-16">বিবাহিত?</th>
                                <th className="border border-black p-1.5 w-28">জন্ম তারিখ/বয়স<br /><span className="text-[9px] font-normal">(দিন/মাস/বছর)</span></th>
                                <th className="border border-black p-1.5 w-20">রক্তের গ্রুপ</th>
                                <th className="border border-black p-1.5 min-w-[160px]">রক্তদানের তারিখ<br /><span className="text-[9px] font-normal">(একাধিক তারিখ)</span></th>
                                <th className="border border-black p-1.5 min-w-[140px]">শিক্ষা প্রতিষ্ঠান/শ্রেণি/পেশা</th>
                                <th className="border border-black p-1.5 w-28">সম্পর্ক<br /><span className="text-[9px] font-normal">(স্ত্রী/পুত্র/কন্যা ইত্যাদি)</span></th>
                                <th className="border border-black p-1.5 min-w-[120px]">NID/মৃত্যু সনদ নং</th>
                                <th className="border border-black p-1.5 min-w-[130px]">বিশেষ তথ্য<br /><span className="text-[9px] font-normal">(রোগী, প্রবাসী, প্রতিবন্ধী, পৌষ্য)</span></th>
                                <th className="border border-black p-1.5 w-10 print:hidden">মুছুন</th>
                            </tr>
                        </thead>
                        <tbody>
                            {formData.members.map((member, idx) => (
                                <tr
                                    key={member.id}
                                    draggable
                                    onDragStart={() => handleDragStart(idx)}
                                    onDragOver={handleDragOver}
                                    onDrop={() => handleDrop(idx)}
                                    className={`transition cursor-grab active:cursor-grabbing ${member.isDeceased || member.isMarried ? 'bg-gray-100 text-gray-500' : ''
                                        } ${draggedIndex === idx ? 'opacity-40 bg-amber-100' : ''}`}
                                >
                                    <td className="border border-black p-1 text-center print:hidden">
                                        <div className="flex items-center justify-center gap-1 font-bold text-black">
                                            <GripVertical size={14} className="text-gray-400 hover:text-black cursor-grab" />
                                            {idx + 1}.
                                        </div>
                                    </td>

                                    <td className="border border-black p-1">
                                        <div className="flex items-center gap-1.5">
                                            <div className="relative flex-shrink-0">
                                                {member.image ? (
                                                    <div className="relative w-8 h-8 border border-black rounded overflow-hidden group">
                                                        <img src={member.image} alt={member.name || 'Member'} className="w-full h-full object-cover" />
                                                        <button
                                                            type="button"
                                                            onClick={() => handleMemberChange(idx, 'image', '')}
                                                            className="absolute top-0 right-0 bg-rose-600 text-white rounded-bl p-0.5 opacity-0 group-hover:opacity-100 transition print:hidden"
                                                            title="ছবি মুছুন"
                                                        >
                                                            <X size={8} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <label className="w-8 h-8 border border-dashed border-gray-400 rounded flex items-center justify-center cursor-pointer hover:bg-gray-50 transition print:hidden" title="ছবি আপলোড করুন">
                                                        <Upload size={12} className="text-gray-500" />
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => handleMemberImageChange(idx, e)}
                                                            className="hidden"
                                                        />
                                                    </label>
                                                )}
                                            </div>
                                            <input
                                                type="text"
                                                value={member.name}
                                                onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                                                className="w-full bg-transparent px-1 py-0.5 text-xs text-black font-medium focus:outline-hidden uppercase"
                                            />
                                        </div>
                                    </td>

                                    <td className="border border-black p-1 text-center">
                                        <select
                                            value={member.gender || 'Male'}
                                            onChange={(e) => handleMemberChange(idx, 'gender', e.target.value)}
                                            className="w-16 sm:w-24 bg-transparent px-1 py-0.5 text-xs text-black font-medium focus:outline-hidden"
                                        >
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                    </td>

                                    <td className="border border-black p-1 text-center">
                                        <input
                                            type="checkbox"
                                            checked={Boolean(member.isDeceased)}
                                            onChange={(e) => handleMemberChange(idx, 'isDeceased', e.target.checked)}
                                            className="w-3.5 h-3.5 text-rose-600 rounded border-slate-400 focus:ring-rose-500 cursor-pointer"
                                            title="মরহুম চিহ্নিত করুন"
                                        />
                                    </td>

                                    <td className="border border-black p-1 text-center">
                                        <input
                                            type="checkbox"
                                            checked={Boolean(member.isMarried)}
                                            onChange={(e) => handleMemberChange(idx, 'isMarried', e.target.checked)}
                                            className="w-3.5 h-3.5 text-rose-600 rounded border-slate-400 focus:ring-rose-500 cursor-pointer"
                                            title="বিবাহিত চিহ্নিত করুন"
                                        />
                                    </td>

                                    <td className="border border-black p-1">
                                        <input
                                            type="text"
                                            required
                                            value={member.dobOrAge}
                                            onChange={(e) => handleMemberChange(idx, 'dobOrAge', e.target.value)}
                                            className="w-full bg-transparent px-1 py-0.5 text-xs font-mono text-black focus:outline-hidden uppercase"
                                        />
                                    </td>

                                    <td className="border border-black p-1">
                                        <select
                                            value={member.bloodGroup}
                                            required
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
                                                    className="w-24 bg-white border border-slate-300 rounded px-1.5 py-0.5 text-[11px] text-black focus:outline-none focus:border-rose-500 uppercase"
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
                                            className="w-full bg-transparent px-1 py-0.5 text-xs text-black focus:outline-hidden uppercase"
                                        />
                                    </td>

                                    <td className="border border-black p-1">
                                        <input
                                            type="text"
                                            value={member.relation}
                                            onChange={(e) => handleMemberChange(idx, 'relation', e.target.value)}
                                            className="w-full bg-transparent px-1 py-0.5 text-xs text-black focus:outline-hidden uppercase"
                                        />
                                    </td>

                                    <td className="border border-black p-1">
                                        <input
                                            type="text"
                                            value={member.nidNumber || ''}
                                            required
                                            onChange={(e) => handleMemberChange(idx, 'nidNumber', e.target.value)}
                                            className="w-full bg-transparent px-1 py-0.5 text-xs text-black focus:outline-hidden font-mono text-center uppercase"
                                        />
                                    </td>

                                    <td className="border border-black p-1">
                                        <input
                                            type="text"
                                            value={member.specialInfo || ''}
                                            onChange={(e) => handleMemberChange(idx, 'specialInfo', e.target.value)}
                                            className="w-full bg-transparent px-1 py-0.5 text-xs text-black focus:outline-hidden uppercase"
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
                        className="w-full sm:w-auto px-3.5 py-2 bg-[#1B8A44] hover:bg-[#156d35] text-white rounded text-xs font-bold flex items-center justify-center gap-1 transition shadow cursor-pointer"
                    >
                        <Plus size={15} /> নতুন সদস্য তথ্য সারি যুক্ত করুন
                    </button>
                </div>

                {/* Lower Legal Declaration Block */}
                <div className="text-[11px] text-justify leading-relaxed my-4 text-black">
                    <p>
                        আমি{' '}
                        <input
                            type="text"
                            required
                            value={formData.headName}
                            onChange={(e) => handleInputChange('headName', e.target.value)}
                            className="bg-transparent border-b border-black px-1 font-bold text-black focus:outline-hidden inline-block min-w-[150px] sm:min-w-[200px] text-center text-[11px] uppercase"
                        />{' '}
                        এই মর্মে ঘোষণা, স্বীকার ও সুস্থ মস্তিষ্কে জানাচ্ছি যে, আমার দেওয়া উপরোল্লিখিত সকল তথ্য সত্য এবং নির্ভুল। এ ছাড়া উপরোক্ত তথ্যে কোনো ভুল প্রমানিত হলে আমি উপযুক্ত শাস্তি গ্রহন করিতে বাধ্য থাকিব। আমি অলি মিয়া সমাজ কল্যাণ পরিষদের গঠনতন্ত্র, নীতি ও সিদ্ধান্ত মেনে চলব। পরিষদের পবিত্র উদ্দেশ্য বাস্তবায়নে নিজেকে নিয়োজিত রাখব এবং সমাজ কল্যাণমূলক সকল কার্যক্রমে সরাসরি বা পরোক্ষভাবে সহযোগিতা করব। আমি বিবাদ বা বিতেন সৃষ্টি না করে শান্তিপূর্ণ, ঐক্যবদ্ধ ও সৌহার্দ্যপূর্ণ পরিবেশ বজায় রাখতে সচেষ্ট থাকব, ইনশাআল্লাহ।
                    </p>
                </div>

                {/* Signatures Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 pt-10 sm:pt-12 mt-6 text-center text-xs font-bold text-black">
                    <div className="order-1">
                        <div className="border-t border-dotted border-black pt-1 mx-2">
                            সদস্য সংগ্রহকের স্বাক্ষর
                        </div>
                        <input
                            type="text"
                            placeholder="সংগ্রহকের নাম (ঐচ্ছিক)"
                            value={formData.collectorSignatureName || ''}
                            onChange={(e) => handleInputChange('collectorSignatureName', e.target.value)}
                            className="w-full text-center text-[10px] border-b border-transparent hover:border-slate-300 focus:border-black bg-transparent mt-1 text-black font-normal focus:outline-hidden print:border-none uppercase"
                        />
                    </div>
                    <div className="order-2">
                        <div className="border-t border-dotted border-black pt-1 mx-2">
                            আবেদনকারীর স্বাক্ষর
                        </div>
                    </div>
                    <div className="order-3">
                        <div className="border-t border-dotted border-black pt-1 mx-2">
                            সভাপতি/আহ্বায়কের স্বাক্ষর
                        </div>
                    </div>
                </div>

                {/* Bottom Control Panel */}
                <div className="mt-8 pt-4 border-t border-slate-300 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 print:hidden">
                    <button
                        type="button"
                        onClick={handleAutoFill}
                        className="w-full sm:w-auto px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer border border-slate-300"
                    >
                        স্বয়ংক্রিয় নমুনা ফর্ম তথ্য পূরণ
                    </button>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                        {onCancel && (
                            <button
                                type="button"
                                onClick={onCancel}
                                className="w-full sm:w-auto px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                            >
                                বাতিল
                            </button>
                        )}

                        {onPrintPreview && (
                            <button
                                type="button"
                                onClick={() => onPrintPreview(formData)}
                                className="w-full sm:w-auto px-4 py-2 bg-[#0F2C59] hover:bg-[#1B365D] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow cursor-pointer"
                            >
                                <Printer size={15} /> প্রিন্ট প্রিভিউ
                            </button>
                        )}

                        <button
                            type="submit"
                            className="w-full sm:w-auto px-6 py-2.5 bg-[#1B8A44] hover:bg-[#156d35] text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-lg transition cursor-pointer"
                        >
                            <Save size={16} /> সম্পূর্ণ তথ্য সংরক্ষণ করুন
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};
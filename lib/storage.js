const STORAGE_KEY = 'omskp_family_records_v1';

export const INITIAL_SAMPLE_RECORDS = [
  {
    id: 'rec-001',
    refNo: 'সূ-১০২',
    date: '15/01/2026',
    memberNo: 'OMSKP-1001',
    formNo: 'F-2026-001',
    headName: 'মো: রফিকুল ইসলাম',
    headOccupation: 'ব্যবসা',
    fatherOrHusbandName: 'মরহুম আলী আহমদ',
    fatherOrHusbandOccupation: 'কৃষি',
    motherName: 'রাবেয়া বেগম',
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
    dob: '12/05/1982',
    bloodGroup: 'B+',
    nationality: 'বাংলাদেশী',
    religion: 'ইসলাম',
    nidNumber: '19821591234567890',
    birthCertificateNo: '19821591234000111',
    passportNo: 'A05432198',
    educationalQualification: 'এইচ.এস.সি',
    socialOrReligiousIdentity: 'উপদেষ্টা, স্থানীয় মসজিদ কমিটি',
    relationWithOrganization: 'আজীবন সদস্য',
    mobileNumber: '01819123456',
    altMobileNumber: '01711987654',
    workplaceAddress: 'পটিয়া স্টেশন রোড মার্কেট, দোকান নং ৪',
    status: 'verified',
    collectorSignatureName: 'কাজী শাহাদাত হোসেন',
    createdAt: '2026-01-15T10:30:00.000Z',
    updatedAt: '2026-01-15T10:30:00.000Z',
    members: [
      {
        id: 'mem-101',
        slNo: 1,
        name: 'সাবিহা সুলতানা',
        gender: 'মহিলা',
        dobOrAge: '10/08/1988',
        bloodGroup: 'O+',
        instituteOrOccupation: 'গৃহিনী (বি.এ পাস)',
        relation: 'স্ত্রী',
        address: 'বর্তমান ঠিকানা',
        specialInfo: 'স্বাস্থ সচেতন',
        mobileNumber: '01819000111',
      },
      {
        id: 'mem-102',
        slNo: 2,
        name: 'মো: তানভীর ইসলাম',
        gender: 'পুরুষ',
        dobOrAge: '14/03/2010',
        bloodGroup: 'B+',
        instituteOrOccupation: 'পটিয়া আদর্শ উচ্চ বিদ্যালয় (৯ম শ্রেণি)',
        relation: 'পুত্র',
        address: 'বর্তমান ঠিকানা',
        specialInfo: 'ছাত্র',
        mobileNumber: '01819000222',
      },
      {
        id: 'mem-103',
        slNo: 3,
        name: 'ফাতেমা তুজ জোহরা',
        gender: 'মহিলা',
        dobOrAge: '22/11/2015',
        bloodGroup: 'A+',
        instituteOrOccupation: 'গোলিন্দর বীর প্রাথমিক বিদ্যালয় (৫ম শ্রেণি)',
        relation: 'কন্যা',
        address: 'বর্তমান ঠিকানা',
        specialInfo: 'মেধাবী ছাত্রী',
        mobileNumber: '',
      }
    ]
  },
  {
    id: 'rec-002',
    refNo: 'সূ-১০৩',
    date: '20/02/2026',
    memberNo: 'OMSKP-1002',
    formNo: 'F-2026-002',
    headName: 'হাজী মোঃ ইউনুস মিস্ত্রী',
    headOccupation: 'চাকুরীজীবী',
    fatherOrHusbandName: 'আব্দুল জাব্বার',
    fatherOrHusbandOccupation: 'অবসরপ্রাপ্ত',
    motherName: 'মাজেদা খাতুন',
    motherOccupation: 'গৃহিনী',
    presentAddress: {
      village: 'অলি মিয়া মিশ্রির বাড়ি, উত্তর গোলিন্দর',
      road: 'ওয়ার্ড ৯',
      postOffice: 'পটিয়া',
      thana: 'পটিয়া',
      district: 'চট্টগ্রাম',
    },
    permanentAddress: {
      village: 'অলি মিয়া মিশ্রির বাড়ি, উত্তর গোলিন্দর',
      road: 'ওয়ার্ড ৯',
      postOffice: 'পটিয়া',
      thana: 'পটিয়া',
      district: 'চট্টগ্রাম',
    },
    dob: '05/11/1975',
    bloodGroup: 'O+',
    nationality: 'বাংলাদেশী',
    religion: 'ইসলাম',
    nidNumber: '19751598765432100',
    birthCertificateNo: '19751598765000222',
    passportNo: '',
    educationalQualification: 'এস.এস.সি',
    socialOrReligiousIdentity: 'সমাজসেবক',
    relationWithOrganization: 'সাধারণ সদস্য',
    mobileNumber: '01812345678',
    altMobileNumber: '01812999888',
    workplaceAddress: 'চট্টগ্রাম বন্দর, চট্টগ্রাম',
    status: 'verified',
    collectorSignatureName: 'মোঃ জাহাংগীর আলম',
    createdAt: '2026-02-20T11:00:00.000Z',
    updatedAt: '2026-02-20T11:00:00.000Z',
    members: [
      {
        id: 'mem-201',
        slNo: 1,
        name: 'মোসাম্মৎ জাহেদা বেগম',
        gender: 'মহিলা',
        dobOrAge: '18/04/1980',
        bloodGroup: 'O+',
        instituteOrOccupation: 'গৃহিনী',
        relation: 'স্ত্রী',
        address: 'বর্তমান ঠিকানা',
        specialInfo: '',
        mobileNumber: '01812345679',
      },
      {
        id: 'mem-202',
        slNo: 2,
        name: 'মো: শাহরিয়ার হোসাইন',
        gender: 'পুরুষ',
        dobOrAge: '01/01/2002',
        bloodGroup: 'AB+',
        instituteOrOccupation: 'চট্টগ্রাম বিশ্ববিদ্যালয় (অনার্স)',
        relation: 'পুত্র',
        address: 'চট্টগ্রাম কটেজ',
        specialInfo: 'রক্তদাতা স্বেচ্ছাসেবক',
        mobileNumber: '01812345680',
      }
    ]
  },
  {
    id: 'rec-003',
    refNo: 'সূ-১০৪',
    date: '10/03/2026',
    memberNo: 'OMSKP-1003',
    formNo: 'F-2026-003',
    headName: 'কাজী আরিফুল ইসলাম',
    headOccupation: 'শিক্ষকতা',
    fatherOrHusbandName: 'কাজী বশির উল্লাহ',
    fatherOrHusbandOccupation: 'অবসরপ্রাপ্ত শিক্ষক',
    motherName: 'মমতাজ বেগম',
    motherOccupation: 'গৃহিনী',
    presentAddress: {
      village: 'পশ্চিম পৌর এলাকা, গোলিন্দর বিলে',
      road: 'প্রধান সড়ক',
      postOffice: 'পটিয়া',
      thana: 'পটিয়া',
      district: 'চট্টগ্রাম',
    },
    permanentAddress: {
      village: 'পশ্চিম পৌর এলাকা, গোলিন্দর বিলে',
      road: 'প্রধান সড়ক',
      postOffice: 'পটিয়া',
      thana: 'পটিয়া',
      district: 'চট্টগ্রাম',
    },
    dob: '15/08/1985',
    bloodGroup: 'A-',
    nationality: 'বাংলাদেশী',
    religion: 'ইসলাম',
    nidNumber: '19851591112223334',
    birthCertificateNo: '19851591112000333',
    passportNo: 'B09876543',
    educationalQualification: 'এম.এ (বাংলা)',
    socialOrReligiousIdentity: 'মাদ্রাসা গভর্নিং বডি সদস্য',
    relationWithOrganization: 'প্রচার সম্পাদক',
    mobileNumber: '01712345678',
    altMobileNumber: '01712111222',
    workplaceAddress: 'পটিয়া মডেল হাই স্কুল',
    status: 'pending',
    collectorSignatureName: 'মোঃ ফারহান',
    createdAt: '2026-03-10T09:15:00.000Z',
    updatedAt: '2026-03-10T09:15:00.000Z',
    members: [
      {
        id: 'mem-301',
        slNo: 1,
        name: 'সুমাইয়া তারান্নুম',
        gender: 'মহিলা',
        dobOrAge: '04/06/1991',
        bloodGroup: 'A-',
        instituteOrOccupation: 'বেসরকারি চাকুরিজীবী',
        relation: 'স্ত্রী',
        address: 'বর্তমান ঠিকানা',
        specialInfo: '',
        mobileNumber: '01712345679',
      }
    ]
  }
];

export function getStoredRecords() {
  if (typeof window === 'undefined') return INITIAL_SAMPLE_RECORDS;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_RECORDS));
      return INITIAL_SAMPLE_RECORDS;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading from localStorage', err);
    return INITIAL_SAMPLE_RECORDS;
  }
}

export function saveRecords(records) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (err) {
    console.error('Error saving to localStorage', err);
  }
}

export function saveSingleRecord(record) {
  const records = getStoredRecords();
  const existingIndex = records.findIndex(r => r.id === record.id);
  
  if (existingIndex >= 0) {
    records[existingIndex] = {
      ...record,
      updatedAt: new Date().toISOString()
    };
  } else {
    records.unshift({
      ...record,
      createdAt: record.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
  
  saveRecords(records);
  return record;
}

export function deleteRecordById(id) {
  const records = getStoredRecords();
  const filtered = records.filter(r => r.id !== id);
  if (filtered.length !== records.length) {
    saveRecords(filtered);
    return true;
  }
  return false;
}

export function searchRecords(records, query, bloodGroupFilter = '', statusFilter = '') {
  const q = query.trim().toLowerCase();

  return records.filter(rec => {
    // Blood group filter match
    if (bloodGroupFilter && rec.bloodGroup !== bloodGroupFilter) {
      // Check if any family member has this blood group
      const memberHasBloodGroup = rec.members.some(m => m.bloodGroup === bloodGroupFilter);
      if (!memberHasBloodGroup) return false;
    }

    // Status filter
    if (statusFilter && rec.status !== statusFilter) return false;

    if (!q) return true;

    // Search matches: Head Name, Form No, Member No, Phone, NID, Father/Mother, Member Name
    const matchesHead = rec.headName.toLowerCase().includes(q);
    const matchesFormNo = rec.formNo.toLowerCase().includes(q);
    const matchesMemberNo = rec.memberNo.toLowerCase().includes(q);
    const matchesMobile = rec.mobileNumber.includes(q) || rec.altMobileNumber.includes(q);
    const matchesNid = rec.nidNumber.includes(q);
    const matchesFather = rec.fatherOrHusbandName.toLowerCase().includes(q);
    const matchesVillage = rec.presentAddress.village.toLowerCase().includes(q);
    const matchesMembers = rec.members.some(m => 
      m.name.toLowerCase().includes(q) || 
      (m.mobileNumber && m.mobileNumber.includes(q))
    );

    return matchesHead || matchesFormNo || matchesMemberNo || matchesMobile || matchesNid || matchesFather || matchesVillage || matchesMembers;
  });
}

export function generateNextFormNumber() {
  const records = getStoredRecords();
  const year = new Date().getFullYear();
  const count = records.length + 1;
  const formattedCount = String(count).padStart(3, '0');
  
  return {
    formNo: `F-${year}-${formattedCount}`,
    memberNo: `OMSKP-${1000 + count}`
  };
}

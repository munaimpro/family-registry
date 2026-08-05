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
    bloodDonationDates: ['10/01/2024', '15/08/2025'],
    isExternalMember: false,
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
        bloodDonationDates: ['15/05/2024', '10/12/2025'],
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
    isExternalMember: true,
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

export function convertBanglaDigitsToEnglish(str) {
  if (!str) return '';
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(str).replace(/[০-৯]/g, (w) => banglaDigits.indexOf(w));
}

export function transliterateBanglaToEnglish(str) {
  if (!str) return '';
  let s = String(str).toLowerCase();

  const nameMap = [
    [/রফিকুল/g, 'rafiqul rofikul rafikul'],
    [/রফিক/g, 'rafiq rafik rofik'],
    [/ইউনুস|ইউনুছ/g, 'yunus iunus junus'],
    [/আরিফুল/g, 'ariful arif'],
    [/আরিফ/g, 'arif'],
    [/ইসলাম/g, 'islam eslam'],
    [/সুলতানা/g, 'sultana soltana'],
    [/তানভীর/g, 'tanvir tanveer'],
    [/ফাতেমা/g, 'fatema fathima'],
    [/জাহেদা/g, 'jaheda zaheda'],
    [/শাহরিয়ার/g, 'shahriar shahriyar'],
    [/হোসাইন|হোসেন/g, 'hossain hossein hosen'],
    [/মিস্ত্রী|মিস্ত্রি/g, 'mistri mistree'],
    [/রাবেয়া|রাবেয়া/g, 'rabeya rabia'],
    [/আহমেদ|আহমদ/g, 'ahmed ahmad'],
    [/কাজী/g, 'kazi qazi'],
    [/আলী|আলি/g, 'ali aly'],
    [/মাহমুদ/g, 'mahmud mahmood'],
    [/রহমান/g, 'rahman rohman'],
    [/খালেদ/g, 'khaled khalid'],
    [/তারিক/g, 'tariq tarik'],
    [/হাসান/g, 'hasan hassan'],
    [/চৌধুরী/g, 'chowdhury chowdhuri'],
    [/খান/g, 'khan'],
    [/বেগম/g, 'begum begam'],
    [/আক্তার|আকতার/g, 'aktar akther akter'],
    [/রশীদ|রশিদ/g, 'rashid rasheed'],
    [/ফারহান/g, 'farhan'],
    [/জাহাঙ্গীর|জাহাংগীর/g, 'jahangir jahangeer'],
    [/সাবিহা/g, 'sabiha'],
    [/মুমতাহিনা/g, 'mumtahina'],
    [/তানিম/g, 'tanim'],
    [/সৈয়দ|সৈয়দ/g, 'syed saiyid'],
    [/সফর|সাফর/g, 'safar'],
    [/হাজী|হাজি/g, 'haji hazi'],
    [/মোঃ|মো:|মো/g, 'md mo mohammad mohammed'],
    [/মোসাম্মৎ|মোসাম্মাত/g, 'mst mosammat']
  ];

  nameMap.forEach(([pattern, replacement]) => {
    s = s.replace(pattern, replacement);
  });

  const charMap = {
    'ক': 'k', 'খ': 'kh', 'গ': 'g', 'ঘ': 'gh', 'ঙ': 'ng',
    'চ': 'c', 'ছ': 'ch', 'জ': 'j', 'ঝ': 'jh', 'ঞ': 'n',
    'ট': 't', 'ঠ': 'th', 'ড': 'd', 'ঢ': 'dh', 'ণ': 'n',
    'ত': 't', 'থ': 'th', 'দ': 'd', 'ধ': 'dh', 'ন': 'n',
    'প': 'p', 'ফ': 'f', 'ব': 'b', 'ভ': 'v', 'ম': 'm',
    'য': 'z', 'র': 'r', 'ল': 'l', 'শ': 's', 'ষ': 'sh', 'স': 's', 'হ': 'h',
    'ড়': 'r', 'ঢ়': 'rh', 'য়': 'y',
    'া': 'a', 'ি': 'i', 'ী': 'i', 'ু': 'u', 'ূ': 'u', 'ে': 'e', 'ৈ': 'oi', 'ো': 'o', 'ৌ': 'ou',
    'অ': 'o', 'আ': 'a', 'ই': 'i', 'ঈ': 'i', 'উ': 'u', 'ঊ': 'u', 'এ': 'e', 'ঐ': 'oi', 'ও': 'o', 'ঔ': 'ou'
  };

  let charStr = '';
  for (let i = 0; i < s.length; i++) {
    charStr += charMap[s[i]] || s[i];
  }

  return `${s} ${charStr}`;
}

export function isHeadOfAnyRecord(memberName, records, excludeRecordId = null) {
  if (!memberName || typeof memberName !== 'string' || !records || !Array.isArray(records)) return false;

  const cleanMemberName = memberName.trim().toLowerCase().replace(/[.:,ঃ]/g, ' ').replace(/\s+/g, ' ').trim();
  if (!cleanMemberName) return false;

  const memberTrans = transliterateBanglaToEnglish(memberName).trim();

  return records.some(r => {
    if (excludeRecordId && r.id === excludeRecordId) return false;
    if (!r.headName) return false;

    const cleanHeadName = r.headName.trim().toLowerCase().replace(/[.:,ঃ]/g, ' ').replace(/\s+/g, ' ').trim();
    if (cleanHeadName === cleanMemberName) return true;

    if (memberTrans && memberTrans.length > 3) {
      const headTrans = transliterateBanglaToEnglish(r.headName).trim();
      if (headTrans === memberTrans) return true;
    }

    return false;
  });
}

export function searchRecords(records, options = {}, argBloodGroup = '', argStatus = '') {
  let nameQuery = '';
  let formNoQuery = '';
  let generalQuery = '';
  let bloodGroupFilter = '';
  let statusFilter = '';

  if (typeof options === 'object' && options !== null && !Array.isArray(options)) {
    nameQuery = options.nameQuery || options.query || '';
    formNoQuery = options.formNoQuery || '';
    generalQuery = options.generalQuery || '';
    bloodGroupFilter = options.bloodGroupFilter || options.selectedBloodGroup || '';
    statusFilter = options.statusFilter || '';
  } else if (typeof options === 'string') {
    generalQuery = options;
    bloodGroupFilter = argBloodGroup;
    statusFilter = argStatus;
  }

  const nameQ = nameQuery.trim().toLowerCase();
  const formQ = convertBanglaDigitsToEnglish(formNoQuery.trim().toLowerCase());
  const genQ = convertBanglaDigitsToEnglish(generalQuery.trim().toLowerCase());
  const bloodF = bloodGroupFilter.trim();
  const statusF = statusFilter.trim();

  return records.filter(rec => {
    // Blood group filter match
    if (bloodF) {
      const headBloodMatch = rec.bloodGroup === bloodF;
      const memberBloodMatch = rec.members && rec.members.some(m =>
        m.bloodGroup === bloodF && !isHeadOfAnyRecord(m.name, records, rec.id)
      );
      if (!headBloodMatch && !memberBloodMatch) return false;
    }

    // Status filter match (if explicitly passed in options)
    if (statusF && rec.status !== statusF) return false;

    // Helper for matching string in Bangla or English
    const matchNameInString = (targetStr) => {
      if (!targetStr) return false;
      const targetLower = targetStr.toLowerCase();
      if (targetLower.includes(nameQ)) return true;

      const targetTrans = transliterateBanglaToEnglish(targetStr);
      return targetTrans.includes(nameQ);
    };

    // 1. Name query filter
    if (nameQ) {
      const headNameMatch = matchNameInString(rec.headName);
      const fatherMatch = matchNameInString(rec.fatherOrHusbandName);
      const motherMatch = matchNameInString(rec.motherName);
      const membersMatch = rec.members && rec.members.some(m =>
        matchNameInString(m.name) && !isHeadOfAnyRecord(m.name, records, rec.id)
      );

      if (!headNameMatch && !fatherMatch && !motherMatch && !membersMatch) {
        return false;
      }
    }

    // 2. Form No query filter
    if (formQ) {
      const recFormEng = convertBanglaDigitsToEnglish((rec.formNo || '').toLowerCase());
      const recMemberEng = convertBanglaDigitsToEnglish((rec.memberNo || '').toLowerCase());
      const recRefEng = convertBanglaDigitsToEnglish((rec.refNo || '').toLowerCase());

      const formMatches = recFormEng.includes(formQ) || recMemberEng.includes(formQ) || recRefEng.includes(formQ);
      if (!formMatches) return false;
    }

    // 3. General query filter
    if (genQ) {
      const normRecForm = convertBanglaDigitsToEnglish((rec.formNo || '').toLowerCase());
      const normRecMem = convertBanglaDigitsToEnglish((rec.memberNo || '').toLowerCase());
      const normRecHead = rec.headName.toLowerCase();
      const normRecMobile = (rec.mobileNumber || '') + (rec.altMobileNumber || '');
      const normRecNid = rec.nidNumber || '';
      const normVillage = rec.presentAddress ? (rec.presentAddress.village || '').toLowerCase() : '';
      const headTrans = transliterateBanglaToEnglish(rec.headName);

      const matchesHead = normRecHead.includes(genQ) || headTrans.includes(genQ);
      const matchesForm = normRecForm.includes(genQ) || normRecMem.includes(genQ);
      const matchesMobile = normRecMobile.includes(genQ);
      const matchesNid = normRecNid.includes(genQ);
      const matchesVillage = normVillage.includes(genQ);
      const matchesMembers = rec.members && rec.members.some(m => {
        if (isHeadOfAnyRecord(m.name, records, rec.id)) return false;

        const mName = m.name.toLowerCase();
        const mTrans = transliterateBanglaToEnglish(m.name);
        const mMob = m.mobileNumber || '';
        return mName.includes(genQ) || mTrans.includes(genQ) || mMob.includes(genQ);
      });

      if (!matchesHead && !matchesForm && !matchesMobile && !matchesNid && !matchesVillage && !matchesMembers) {
        return false;
      }
    }

    return true;
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

const SETTINGS_KEY = 'omskp_app_settings_v1';

export const DEFAULT_APP_SETTINGS = {
  logo: '',
  appTitle: 'স্মার্ট পরিবার ডাইরেক্টরি ও সমাজ কল্যাণ নেটওয়ার্ক',
  foundationName: 'অলি মিয়া সমাজ কল্যাণ পরিষদ',
  formTitle: 'পরিবার শুমারি ও তথ্য নিবন্ধন ফরম',
  address: 'উত্তর গোলিন্দর বীর, ৯নং ওয়ার্ড, পটিয়া, চট্টগ্রাম',
  hotline: '০১৮১৯-০০০০০০',
};

export function getAppSettings() {
  if (typeof window === 'undefined') return DEFAULT_APP_SETTINGS;
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (!data) return DEFAULT_APP_SETTINGS;
    const parsed = JSON.parse(data);
    return {
      ...DEFAULT_APP_SETTINGS,
      ...parsed
    };
  } catch (e) {
    return DEFAULT_APP_SETTINGS;
  }
}

export function saveAppSettings(settings) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    window.dispatchEvent(new Event('omskp_settings_updated'));
  } catch (e) {
    console.error('Failed to save app settings', e);
  }
}

const USER_PROFILE_KEY = 'omskp_user_profile_';

export function getUserProfile(email) {
  if (typeof window === 'undefined' || !email) return { avatar: '' };
  try {
    const data = localStorage.getItem(USER_PROFILE_KEY + email);
    return data ? JSON.parse(data) : { avatar: '' };
  } catch (e) {
    return { avatar: '' };
  }
}

export function saveUserProfile(email, profile) {
  if (typeof window === 'undefined' || !email) return;
  try {
    localStorage.setItem(USER_PROFILE_KEY + email, JSON.stringify(profile));
    window.dispatchEvent(new Event('omskp_user_profile_updated'));
  } catch (e) {
    console.error('Failed to save user profile', e);
  }
}


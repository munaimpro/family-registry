'use client';

import React, { useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '../../lib/AppContext';
import { useSession } from '../../lib/auth-client';
import { FamilySearch } from '../../components/FamilySearch';

// সংখ্যা রূপান্তর
const toBengaliNumber = (num) => {
  if (num === null || num === undefined) return '';
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/\d/g, (digit) => bnDigits[digit]);
};

const toEnglishNumber = (str) => {
  if (!str) return '';
  return String(str).replace(/[০-৯]/g, (d) => '0123456789'['০১২৩৪৫৬৭৮৯'.indexOf(d)]);
};

// নিখুঁত বয়স হিসাবের শক্তিশালী ফাংশন
const calculateExactAge = (dobInput) => {
  if (!dobInput) return '';
  const rawStr = String(dobInput).trim();
  if (!rawStr) return '';

  const cleanStr = toEnglishNumber(rawStr);
  const today = new Date();

  // ১. যদি শুধু বয়স দেওয়া থাকে (যেমন "23")
  if (/^\d{1,2}$/.test(cleanStr)) {
    const ageNum = parseInt(cleanStr, 10);
    return `${toBengaliNumber(ageNum)} বছর`;
  }

  // ২. যদি শুধু জন্মসাল দেওয়া থাকে (যেমন "1998" বা "২০০১")
  if (/^\d{4}$/.test(cleanStr)) {
    const birthYear = parseInt(cleanStr, 10);
    const calculatedAge = today.getFullYear() - birthYear;
    return calculatedAge > 0 ? `${toBengaliNumber(calculatedAge)} বছর` : '১ বছর';
  }

  // ৩. তারিখ পার্স করা (DD/MM/YYYY, YYYY-MM-DD ইত্যাদি)
  let birthDate = null;
  const dmyMatch = cleanStr.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/);
  const ymdMatch = cleanStr.match(/^(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})$/);

  if (dmyMatch) {
    birthDate = new Date(parseInt(dmyMatch[3], 10), parseInt(dmyMatch[2], 10) - 1, parseInt(dmyMatch[1], 10));
  } else if (ymdMatch) {
    birthDate = new Date(parseInt(ymdMatch[1], 10), parseInt(ymdMatch[2], 10) - 1, parseInt(ymdMatch[3], 10));
  } else {
    const parsed = new Date(cleanStr);
    if (!isNaN(parsed.getTime())) birthDate = parsed;
  }

  if (!birthDate || isNaN(birthDate.getTime())) {
    return rawStr; // পার্স করতে না পারলে মূল লেখা রিটার্ন করবে
  }

  // বছর, মাস ও দিন হিসাব
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (days < 0) {
    months -= 1;
    const previousMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += previousMonth.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (years < 0) return '';

  let ageParts = [];
  if (years > 0) ageParts.push(`${toBengaliNumber(years)} বছর`);
  if (months > 0) ageParts.push(`${toBengaliNumber(months)} মাস`);
  if (days > 0) ageParts.push(`${toBengaliNumber(days)} দিন`);

  return ageParts.length > 0 ? ageParts.join(' ') : '০ দিন';
};

export default function MemberDirectoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { records, setPrintingRecord } = useApp();
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  const initialBloodGroup = searchParams.get('bloodGroup') || '';

  // সব রেকর্ডের বয়স কনভার্ট করে ওভাররাইট (Override) করে দেওয়া হচ্ছে
  const processedRecords = useMemo(() => {
    if (!records || !Array.isArray(records)) return [];

    return records.map((record) => {
      const calculatedHeadAge = calculateExactAge(record.dob || record.age || record.dobOrAge);

      const processedMembers = (record.members || []).map((member) => {
        const calculatedMemberAge = calculateExactAge(member.dobOrAge || member.dob || member.age);
        return {
          ...member,
          exactAgeText: calculatedMemberAge,
          // age এবং dob ফিল্ডেও বয়সের টেক্সট সেট করে দেয়া হচ্ছে যাতে যেকোনো ফিল্ড কল করলেও বয়স দেখায়
          age: calculatedMemberAge || member.age,
          dobOrAge: calculatedMemberAge || member.dobOrAge,
        };
      });

      return {
        ...record,
        exactAgeText: calculatedHeadAge,
        // age ও dob-তে টেক্সট বসিয়ে দেওয়া হচ্ছে যাতে FamilySearch-এ পরিবর্তন করতে সমস্যা না হয়
        age: calculatedHeadAge || record.age,
        dob: calculatedHeadAge || record.dob,
        members: processedMembers,
      };
    });
  }, [records]);

  const handleEdit = (record) => {
    router.push(`/new-form/${record._id || record.id}`);
  };

  const handleAddNew = () => {
    router.push('/new-form');
  };

  const handleSelectRecord = (record) => {
    router.push(`/member-profile/${record._id || record.id}`);
  };

  return (
    <FamilySearch
      records={processedRecords}
      isLoggedIn={isLoggedIn}
      onSelectRecord={handleSelectRecord}
      onEditRecord={(rec) => handleEdit(rec)}
      onPrintRecord={(rec) => setPrintingRecord(rec)}
      onAddNew={handleAddNew}
      initialBloodGroup={initialBloodGroup}
    />
  );
}
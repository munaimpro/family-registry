'use client';

import dynamic from 'next/dynamic';
import React, { Suspense } from 'react';

// MemberDirectoryContent uses useSession (Better Auth) which internally calls
// useRef — this MUST be dynamically imported with ssr:false to prevent the
// "Cannot read properties of null (reading 'useRef')" crash during prerendering.
const MemberDirectoryContent = dynamic(
  () => import('./MemberDirectoryContent'),
  { ssr: false }
);

export default function MemberDirectoryPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-slate-500">লোড হচ্ছে...</div>}>
      <MemberDirectoryContent />
    </Suspense>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from '../../lib/auth-client';
import { Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2, KeyRound } from 'lucide-react';
import Link from 'next/link';

export default function SigninPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Check and redirect loggedin users
  const { data: loggedInUser, loggedInError } = useSession();

  useEffect(() => {
    if (loggedInError) setError(loggedInError.message);
    if (loggedInUser?.user) router.push('/');
  }, [loggedInUser, loggedInError, router]);

  if (loading || loggedInUser) return null; // or a loading spinner

  // const fillDemoCredentials = async () => {
  //   setEmail('admin@omskp.org');
  //   setPassword('password123');
  //   setError('');
  //   setLoading(true);

  //   try {
  //     const res = await signIn.email({
  //       email: 'admin@omskp.org',
  //       password: 'password123',
  //     });

  //     if (res.error) {
  //       setError('ডেমো লগইন ব্যর্থ হয়েছে।');
  //     } else {
  //       setSuccess(true);
  //       setTimeout(() => {
  //         window.location.href = '/';
  //       }, 300);
  //     }
  //   } catch (err) {
  //     setError('একটি অপ্রত্যাশিত ত্রুটি ঘটেছে।');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSignin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let res = await signIn.email({
        email,
        password,
      });

      if (res.error) {
        setError(res.error.message || 'লগইন করতে সমস্যা হয়েছে। ইমেইল বা পাসওয়ার্ড যাচাই করুন।');
      } else {
        setSuccess(true);
        setTimeout(() => {
          window.location.href = '/';
        }, 300);
      }
    } catch (err) {
      setError('একটি অপ্রত্যাশিত ত্রুটি ঘটেছে।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-emerald-50 text-[#1B8A44] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-emerald-100">
            <ShieldCheck size={30} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">অলি মিয়া সমাজ কল্যাণ পরিষদ</h1>
          <p className="text-sm text-slate-500 mt-1">অ্যাডমিন প্যানেল লগইন (Sign In)</p>
        </div>

        {/* Demo Credentials Quick Fill Banner */}
        {/* <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-[#1B8A44] flex items-center gap-1.5">
              <KeyRound size={15} /> ডেমো তথ্য
            </span>
            <p className="text-[11px] text-slate-600 mt-0.5">এক ক্লিকে ডেমো তথ্য ইনপুট করুন</p>
          </div>
          <button
            type="button"
            onClick={fillDemoCredentials}
            className="px-3.5 py-2 bg-[#1B8A44] hover:bg-[#156d35] text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer flex-shrink-0"
          >
            ডেমো তথ্য বসান
          </button>
        </div> */}

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-[#1B8A44] text-xs rounded-xl font-medium flex items-center gap-2">
            <CheckCircle2 size={16} /> সফলভাবে লগইন হয়েছে! হোম পেজে রিডাইরেক্ট হচ্ছে...
          </div>
        )}

        <form onSubmit={handleSignin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">ইমেইল অ্যাড্রেস (Email)</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-[#1B8A44] focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">পাসওয়ার্ড (Password)</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-[#1B8A44] focus:outline-hidden"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full mt-2 py-3 bg-[#1B8A44] hover:bg-[#156d35] text-white font-bold rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'লগইন হচ্ছে...' : 'লগইন করুন'} <ArrowRight size={16} />
          </button>
        </form>

        {/* <div className="mt-6 text-center text-xs text-slate-500">
          অ্যাকাউন্ট নেই?{' '}
          <Link href="/signup" className="text-[#1B8A44] font-bold hover:underline">
            নিবন্ধন করুন (Sign Up)
          </Link>
        </div> */}
      </div>
    </div>
  );
}

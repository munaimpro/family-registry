'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut, authClient, updateUser, changeEmail } from '../../../lib/auth-client';
import { User, Lock, Shield, LogOut, KeyRound, ArrowLeft, Upload, Settings, Mail, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function AdminProfilePage() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const [uploadedAvatar, setUploadedAvatar] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [newEmail, setNewEmail] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (user?.email) {
      setNewEmail(user.email);
    }
    if (user?.password) {
      setCurrentPassword(user.password);
    }
  }, [user]);

  const activeAvatar = uploadedAvatar || user?.image || '';

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('ছবির সাইজ ২ এমবির কম হতে হবে।');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (uploadEvent) => {
      const result = uploadEvent.target?.result;
      if (typeof result === 'string') {
        setUploadedAvatar(result);

        try {
          const { error } = await updateUser({
            image: result
          });

          if (error) {
            toast.error(error.message || 'প্রোফাইল ছবি আপডেট করতে ব্যর্থ হয়েছে।');
            setUploadedAvatar('');
          } else {
            toast.success('প্রোফাইল ছবি সফলভাবে আপডেট হয়েছে!');
          }
        } catch (err) {
          toast.error('একটি অপ্রত্যাশিত ত্রুটি ঘটেছে।');
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleEmailChange = async (e) => {
    e.preventDefault();

    if (!newEmail || newEmail === user?.email) {
      toast.error('দয়া করে একটি নতুন ইমেইল প্রদান করুন।');
      return;
    }

    setEmailLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/admin/update-email`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user?.id,
          newEmail: newEmail
        })
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'ইমেইল আপডেট করতে ব্যর্থ হয়েছে।');
      } else {
        toast.success('ইমেইল সফলভাবে আপডেট হয়েছে!');
        window.location.reload();
      }
    } catch (err) {
      toast.error('একটি অপ্রত্যাশিত ত্রুটি ঘটেছে।');
    } finally {
      setEmailLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (newPassword !== confirmPassword) {
      toast.error('নতুন পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মিলছে না।');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });

      if (error) {
        toast.error(error.message || 'পাসওয়ার্ড পরিবর্তন করতে ব্যর্থ হয়েছে। বর্তমান পাসওয়ার্ড যাচাই করুন।');
      } else {
        toast.success('পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে!');
        setCurrentPassword(currentPassword);
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      toast.error('একটি অপ্রত্যাশিত ত্রুটি ঘটেছে।');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/signin');
  };

  // Prevent prerendering issues on Next.js build
  if (!mounted || isPending) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500 text-sm animate-pulse font-medium">লোড হচ্ছে...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Top bar navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-[#1B8A44] transition bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-xs"
          >
            <ArrowLeft size={16} /> হোম পেজে ফিরে যান
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/settings"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F2C59] hover:text-[#1B8A44] bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-xs transition"
            >
              <Settings size={15} /> সেটিংস
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-2 rounded-xl border border-rose-200 transition cursor-pointer"
            >
              <LogOut size={16} /> লগআউট
            </button>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-[#0F2C59] p-6 text-white flex flex-col sm:flex-row items-center gap-5">
            <div className="relative group">
              <div className="w-24 h-24 bg-emerald-500/25 border-4 border-emerald-400 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-md overflow-hidden">
                {activeAvatar ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={activeAvatar} alt="Profile Avatar" className="w-full h-full object-cover" />
                ) : user?.name ? (
                  user.name.charAt(0).toUpperCase()
                ) : (
                  <User size={36} />
                )}
              </div>
              <label className="absolute bottom-0 right-0 p-2 bg-[#1B8A44] hover:bg-[#156d35] text-white rounded-full shadow cursor-pointer transition" title="প্রোফাইল ছবি পরিবর্তন করুন">
                <Upload size={14} />
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </label>
            </div>

            <div className="text-center sm:text-left space-y-1">
              <h1 className="text-xl font-bold">{user?.name || 'অ্যাডমিন ব্যবহারকারী'}</h1>
              <p className="text-xs text-slate-300">{user?.email || 'admin@omskp.org'}</p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/20 text-emerald-300 rounded-lg text-xs font-semibold border border-emerald-400/30">
                <Shield size={13} /> সিস্টেম অ্যাডমিন
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-10">
            {/* Email Update Section */}
            <div className="space-y-6">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Mail size={18} className="text-[#1B8A44]" /> ইমেইল পরিবর্তন করুন (Change Email)
              </h2>

              <form onSubmit={handleEmailChange} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ইমেইল ঠিকানা (Email Address)</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-3 text-slate-400" />
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="আপনার ইমেইল লিখুন"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-[#1B8A44] focus:outline-hidden"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={emailLoading}
                  className="py-3 px-6 bg-[#1B8A44] hover:bg-[#156d35] text-white font-bold rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {emailLoading ? 'আপডেট হচ্ছে...' : 'ইমেইল আপডেট করুন'}
                </button>
              </form>
            </div>

            {/* Password Update Section */}
            <div className="space-y-6">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <KeyRound size={18} className="text-[#1B8A44]" /> পাসওয়ার্ড পরিবর্তন করুন (Change Password)
              </h2>

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">বর্তমান পাসওয়ার্ড (Current Password)</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-3 text-slate-400" />
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-[#1B8A44] focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition"
                    >
                      {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">নতুন পাসওয়ার্ড (New Password)</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-3 text-slate-400" />
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-[#1B8A44] focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition"
                    >
                      {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">নতুন পাসওয়ার্ড নিশ্চিত করুন (Confirm New Password)</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-3 text-slate-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-[#1B8A44] focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="py-3 px-6 bg-[#1B8A44] hover:bg-[#156d35] text-white font-bold rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'পরিবর্তন হচ্ছে...' : 'পাসওয়ার্ড আপডেট করুন'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
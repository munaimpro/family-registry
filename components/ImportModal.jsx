'use client';

import React, { useState } from 'react';
import { saveRecords, getStoredRecords } from '../lib/storage';
import { toast } from 'react-toastify';
import { Upload, X } from 'lucide-react';

export const ImportModal = ({
  isOpen,
  onClose,
  onImportSuccess,
}) => {
  const [jsonInput, setJsonInput] = useState('');
  const [mode, setMode] = useState('merge');

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        setJsonInput(text);
        toast.info('JSON ফাইল লোড হয়েছে');
      } catch (err) {
        toast.error('ফাইল পড়তে সমস্যা হয়েছে');
      }
    };
    reader.readAsText(file);
  };

  const handleImportSubmit = () => {
    try {
      if (!jsonInput.trim()) {
        toast.error('অনুগ্রহ করে JSON ডেটা দিন');
        return;
      }

      const parsed = JSON.parse(jsonInput);
      if (!Array.isArray(parsed)) {
        toast.error('অকার্যকর JSON ফরম্যাট (অ্যারে হতে হবে)');
        return;
      }

      const current = getStoredRecords();
      let updated;

      if (mode === 'replace') {
        updated = parsed;
      } else {
        // Merge records by id or formNo
        const existingMap = new Map(current.map(r => [r.id || r.formNo, r]));
        parsed.forEach(r => {
          existingMap.set(r.id || r.formNo, r);
        });
        updated = Array.from(existingMap.values());
      }

      saveRecords(updated);
      onImportSuccess();
      toast.success(`সফলভাবে ${parsed.length} টি রেকর্ড ইমপোর্ট সম্পূর্ণ হয়েছে!`);
      onClose();
    } catch (err) {
      toast.error('অকার্যকর JSON ফাইল বা সিনট্যাক্স এরর');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-xs p-4">
      <div className="bg-white border-2 border-[#0F2C59]/30 rounded-2xl p-6 max-w-xl w-full shadow-2xl space-y-4">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-slate-200 pb-3">
          <h3 className="text-lg font-bold text-[#0F2C59] flex items-center gap-2 font-serif">
            <Upload size={20} className="text-[#1B8A44]" /> ব্যাকআপ ডেটাবেজ ইমপোর্ট (JSON)
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-800 rounded-lg transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Upload File Section */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            ১. কম্পিউটারের ফাইল থেকে লোড করুন (.json):
          </label>
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="block w-full text-xs text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#EBF5EE] file:text-[#1B8A44] hover:file:bg-emerald-100 cursor-pointer"
          />
        </div>

        {/* JSON Textarea */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            অথবা JSON কোড পেস্ট করুন:
          </label>
          <textarea
            rows={6}
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="[ { ... }, { ... } ]"
            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-mono text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-[#1B8A44]"
          />
        </div>

        {/* Import Mode Options */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
          <span className="font-bold text-slate-800 block mb-1">ইমপোর্ট মোড নির্বাচন করুন:</span>
          <div className="flex gap-4">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium">
              <input
                type="radio"
                name="mode"
                checked={mode === 'merge'}
                onChange={() => setMode('merge')}
                className="text-[#1B8A44] focus:ring-[#1B8A44]"
              />
              বিদ্যমান ডেটার সাথে যুক্ত করুন (Merge)
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium">
              <input
                type="radio"
                name="mode"
                checked={mode === 'replace'}
                onChange={() => setMode('replace')}
                className="text-rose-600 focus:ring-rose-500"
              />
              সব মুছে নতুন ইমপোর্ট করুন (Replace)
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
          >
            বাতিল
          </button>
          <button
            onClick={handleImportSubmit}
            className="px-5 py-2 bg-[#1B8A44] hover:bg-[#156d35] text-white text-xs font-bold rounded-xl shadow cursor-pointer"
          >
            ইমপোর্ট করুন
          </button>
        </div>
      </div>
    </div>
  );
};

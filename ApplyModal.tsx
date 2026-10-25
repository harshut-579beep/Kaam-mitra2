import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, CheckCircle, ShieldCheck, User, MapPin } from 'lucide-react';

export const ApplyModal: React.FC = () => {
  const { applyingJob, setApplyingJob, applyToCurrentJob, currentUser } = useApp();
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!applyingJob) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await applyToCurrentJob(applyingJob.id, note);
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-center items-end sm:items-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
        
        {/* Header */}
        <div className="p-4 bg-emerald-700 text-white flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold">काम मित्र के जरिए आवेदन</h3>
            <p className="text-xs text-emerald-100">एडमिन द्वारा सुरक्षित समन्वय व निष्पक्ष आवंटन</p>
          </div>
          <button
            onClick={() => setApplyingJob(null)}
            className="p-1.5 rounded-full bg-emerald-800 text-white hover:bg-emerald-600 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Job summary */}
          <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">{applyingJob.category}</span>
            <h4 className="text-sm font-bold text-slate-900 mt-0.5">{applyingJob.title}</h4>
            <p className="text-xs text-emerald-800 font-extrabold mt-1">मजदूरी: {applyingJob.salary}</p>
          </div>

          {/* Worker identity preview */}
          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-slate-500 font-medium pb-1 border-b border-slate-200">
              <span>आपकी प्रोफाइल:</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>सत्यापित पहचान</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-800 font-bold">
              <User className="w-3.5 h-3.5 text-emerald-600" />
              <span>{currentUser?.name || 'मजदूर साथी'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>{currentUser?.location || 'स्थान'}</span>
            </div>
          </div>

          {/* Optional Message / Note */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              अपने काम के तजुर्बे या उपलब्धता के बारे में लिखें (वैकल्पिक):
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="जैसे: मैं तुरंत काम शुरू कर सकता हूँ, मुझे इस काम का 5 साल का तजुर्बा है..."
              rows={3}
              className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Submit button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white font-black py-3 rounded-2xl shadow-md flex items-center justify-center gap-2 text-sm transition cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{submitting ? 'आवेदन भेजा जा रहा है...' : 'आवेदन जमा करें'}</span>
            </button>
            <p className="text-center text-[11px] text-slate-500 mt-2">
              काम मित्र व्यवस्थापक द्वारा आवेदन की समीक्षा कर आपसे संपर्क किया जाएगा।
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

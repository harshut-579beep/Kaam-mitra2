import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CategoryIcon } from '../components/CategoryIcon';
import {
  Briefcase,
  MapPin,
  Clock,
  Users,
  IndianRupee,
  Flame,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Lock
} from 'lucide-react';

export const PostJobView: React.FC = () => {
  const {
    currentUser,
    categories,
    postNewJob,
    setActiveTab,
    switchDemoRole
  } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('खेती का काम');
  const [location, setLocation] = useState(currentUser?.location || 'लखनऊ, उत्तर प्रदेश');
  const [salaryAmount, setSalaryAmount] = useState('650');
  const [salaryPeriod, setSalaryPeriod] = useState<'daily' | 'monthly' | 'task'>('daily');
  const [workingHours, setWorkingHours] = useState('सुबह 8:00 से शाम 5:00 बजे तक');
  const [workersNeeded, setWorkersNeeded] = useState('2');
  const [description, setDescription] = useState('');
  const [urgent, setUrgent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const wagePresets = [
    { label: '₹600 / दिन', amount: '600', period: 'daily' },
    { label: '₹850 / दिन (मिस्त्री)', amount: '850', period: 'daily' },
    { label: '₹14,000 / महीना', amount: '14000', period: 'monthly' },
    { label: '₹20,000 / ठेका', amount: '20000', period: 'task' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!currentUser) {
      setErrorMsg('काम पोस्ट करने के लिए कृपया पहले लॉगिन करें।');
      setActiveTab('profile');
      return;
    }

    if (!title.trim()) {
      setErrorMsg('कृपया काम का नाम दर्ज करें (उदा: गेहूं कटाई, मकान निर्माण)');
      return;
    }
    if (!location.trim()) {
      setErrorMsg('कृपया काम का स्थान दर्ज करें');
      return;
    }
    if (!salaryAmount || isNaN(Number(salaryAmount))) {
      setErrorMsg('कृपया सही मजदूरी या वेतन दर्ज करें');
      return;
    }

    setIsSubmitting(true);

    const salaryString = salaryPeriod === 'daily'
      ? `₹${salaryAmount} प्रति दिन`
      : salaryPeriod === 'monthly'
      ? `₹${Number(salaryAmount).toLocaleString('en-IN')} प्रति महीना`
      : `₹${Number(salaryAmount).toLocaleString('en-IN')} कुल ठेका`;

    const success = await postNewJob({
      title: title.trim(),
      category,
      location: location.trim(),
      salary: salaryString,
      salaryAmount: Number(salaryAmount),
      salaryPeriod,
      workingHours,
      workersNeeded: Number(workersNeeded) || 1,
      description: description.trim() || 'काम के इच्छुक साथी काम मित्र प्लेटफॉर्म के जरिए आवेदन करें।',
      urgent,
    });

    setIsSubmitting(false);
    if (!success) {
      setErrorMsg('काम पोस्ट नहीं हो सका, कृपया दोबारा प्रयास करें।');
    }
  };

  return (
    <div className="pb-28 max-w-lg mx-auto p-4 space-y-4 animate-in fade-in duration-150">
      
      {/* Title Header */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-5 rounded-3xl shadow-md">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-2 bg-white/10 rounded-xl">
            <Briefcase className="w-5 h-5 text-amber-300" />
          </div>
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-200">
            काम देने वाले / ठेकेदार / किसान
          </span>
        </div>
        <h2 className="text-xl font-black leading-tight">नया काम पोस्ट करें</h2>
        <p className="text-xs text-emerald-100 mt-0.5">
          काम मित्र एडमिन की निगरानी में सत्यापित मजदूर प्राप्त करें
        </p>
      </div>

      {/* Notice if logged in as Worker */}
      {currentUser?.role === 'worker' && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-amber-900">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold">सुझाव: </span>
            आप अभी <strong>काम ढूंढने वाले (मजदूर)</strong> के रूप में लॉगिन हैं।
            <button
              onClick={() => switchDemoRole('employer')}
              className="block mt-1 font-bold text-emerald-800 underline cursor-pointer"
            >
              काम देने वाले (रामेश पटेल) के रोल में स्विच करें →
            </button>
          </div>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-4">
        
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 1. Job Title */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1">
            काम का नाम / शीर्षक <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="जैसे: 10 दिन के लिए मकान चुनाई हेतु 2 राजमिस्त्री चाहिए"
            className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold"
            required
          />
        </div>

        {/* 2. Category Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1">
            काम की श्रेणी चुनें <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-1.5 max-h-44 overflow-y-auto no-scrollbar p-1.5 bg-slate-50 rounded-2xl border border-slate-200">
            {categories.map((cat) => {
              const isSelected = category === cat.name;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.name)}
                  className={`flex items-center gap-2 p-2 rounded-xl text-left text-xs font-bold transition cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <CategoryIcon name={cat.name} className="w-4 h-4 shrink-0" />
                  <span className="truncate">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Location */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-rose-500" />
            <span>काम का स्थान / गाँव या शहर <span className="text-red-500">*</span></span>
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="जैसे: गोमती नगर, लखनऊ (उत्तर प्रदेश)"
            className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        {/* 4. Salary / Wage */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
            <span>मजदूरी या वेतन (रुपयों में) <span className="text-red-500">*</span></span>
          </label>
          
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-3 text-slate-400 font-bold text-xs">₹</span>
              <input
                type="number"
                value={salaryAmount}
                onChange={(e) => setSalaryAmount(e.target.value)}
                placeholder="650"
                className="w-full text-xs pl-7 pr-3 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold"
                required
              />
            </div>

            <select
              value={salaryPeriod}
              onChange={(e) => setSalaryPeriod(e.target.value as any)}
              className="bg-slate-50 border border-slate-300 text-xs font-bold text-slate-800 rounded-xl px-3 py-2 focus:outline-none"
            >
              <option value="daily">प्रति दिन (दिहाड़ी)</option>
              <option value="monthly">प्रति महीना</option>
              <option value="task">कुल ठेका (काम पूरा होने पर)</option>
            </select>
          </div>

          {/* Quick presets */}
          <div className="flex items-center gap-1.5 flex-wrap mt-2">
            <span className="text-[10px] text-slate-400">सुझाव:</span>
            {wagePresets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSalaryAmount(p.amount);
                  setSalaryPeriod(p.period as any);
                }}
                className="text-[11px] bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-lg border border-emerald-200 transition cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* 5. Workers Needed & Hours Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-blue-500" />
              <span>कितने मजदूर चाहिए?</span>
            </label>
            <input
              type="number"
              min="1"
              value={workersNeeded}
              onChange={(e) => setWorkersNeeded(e.target.value)}
              placeholder="1"
              className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>काम के घंटे</span>
            </label>
            <input
              type="text"
              value={workingHours}
              onChange={(e) => setWorkingHours(e.target.value)}
              placeholder="सुबह 8:30 से शाम 5:30"
              className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* 6. Description */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1">
            काम का पूरा विवरण (शर्तें, औजार, खाना आदि)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="काम की अवधि, क्या दोपहर का खाना मिलेगा, औजार कौन लाएगा, आदि..."
            className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* 7. Urgent Badge */}
        <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={urgent}
              onChange={(e) => setUrgent(e.target.checked)}
              className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
            />
            <div>
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-red-600" />
                तुरंत जरूरत है (Urgent Job)
              </span>
              <p className="text-[10px] text-slate-500">इस काम को शीर्ष प्राथमिकता पर दिखाया जाएगा</p>
            </div>
          </label>
        </div>

        {/* Platform Coordination Notice (Section 4 Compliance) */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-xs text-emerald-900 leading-relaxed flex items-start gap-2">
          <Lock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <span>
            <strong>गोपनीयता नियम:</strong> आपका फोन नंबर सार्वजनिक रूप से नहीं दिखाया जाएगा। मजदूर काम मित्र के माध्यम से आवेदन करेंगे और व्यवस्थापक द्वारा उपयुक्त मजदूर समन्वय किया जाएगा।
          </span>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black py-3.5 rounded-2xl shadow-md transition flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-50"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>{isSubmitting ? 'काम पोस्ट हो रहा है...' : 'सत्यापन हेतु काम पोस्ट करें'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};

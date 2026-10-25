import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CategoryIcon } from '../components/CategoryIcon';
import { JobCard } from '../components/JobCard';
import { AdminContactCard } from '../components/AdminContactCard';
import {
  Search,
  MapPin,
  Briefcase,
  Tractor,
  Truck,
  UserCheck,
  TrendingUp,
  Sparkles,
  PhoneCall,
  ShieldCheck,
  Headphones,
  ArrowRight,
  CalendarCheck,
  FileText,
  AlertCircle
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    categories,
    jobs,
    loadingJobs,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    locationFilter,
    setLocationFilter,
    setActiveTab,
    machineryListings,
    currentUser,
    openAdminPhoneCall,
    openAdminWhatsApp,
    settings
  } = useApp();

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [localLoc, setLocalLoc] = useState(locationFilter);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    setLocationFilter(localLoc);
    setActiveTab('jobs');
  };

  const handleCategoryClick = (catName: string) => {
    if (catName.includes('मशीनरी') || catName.includes('ट्रैक्टर') || catName.includes('वाहन')) {
      setActiveTab('services');
    } else {
      setSelectedCategory(catName);
      setActiveTab('jobs');
    }
  };

  const popularLocations = settings?.serviceLocations || ['लखनऊ', 'करनाल', 'पटना', 'जयपुर', 'इंदौर', 'वाराणसी'];

  return (
    <div className="pb-28 space-y-4 animate-in fade-in duration-150">
      
      {/* Hero Banner with Green and White Theme */}
      <div className="bg-gradient-to-b from-emerald-800 via-emerald-700 to-emerald-800 text-white px-4 pt-4 pb-6 rounded-b-[2.5rem] shadow-md relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -right-8 -top-8 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-emerald-950/70 text-amber-300 px-3 py-1 rounded-full text-[11px] font-bold mb-2 border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ग्रामीण व शहरी भारत का सरल रोजगार व कृषि मंच</span>
          </div>

          <h2 className="text-2xl font-black leading-tight tracking-tight text-white">
            काम ढूँढें, मजदूर पाएं या कृषि मशीनरी व वाहन बुक करें!
          </h2>
          <p className="text-xs text-emerald-100 mt-1 leading-relaxed">
            काम मित्र भारत के गाँवों और कस्बों में खेती, मजदूरी, ट्रैक्टर-ट्रॉली और कारीगरों को पारदर्शी तरीके से जोड़ता है।
          </p>

          {/* Quick Dual Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5 mt-4">
            <button
              onClick={() => {
                setSelectedCategory('सभी काम');
                setActiveTab('jobs');
              }}
              className="bg-amber-400 hover:bg-amber-500 active:scale-95 text-slate-900 font-black p-3.5 rounded-2xl shadow-md transition flex flex-col items-center justify-center text-center cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-slate-900/10 flex items-center justify-center mb-1">
                <UserCheck className="w-5 h-5 text-slate-900" />
              </div>
              <span className="text-sm font-black leading-tight">काम ढूँढें</span>
              <span className="text-[10px] text-slate-800 font-bold">मजदूर व कारीगर साथी</span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className="bg-white hover:bg-emerald-50 active:scale-95 text-emerald-900 font-black p-3.5 rounded-2xl shadow-md transition flex flex-col items-center justify-center text-center cursor-pointer border border-emerald-200"
            >
              <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center mb-1">
                <Tractor className="w-5 h-5 text-emerald-800" />
              </div>
              <span className="text-sm font-black leading-tight">कृषि मशीनरी व वाहन</span>
              <span className="text-[10px] text-emerald-700 font-bold">ट्रैक्टर, रोटावेटर, लोडर</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search & Location Bar */}
      <div className="px-4 -mt-3">
        <form onSubmit={handleSearchSubmit} className="bg-white rounded-2xl shadow-lg border border-slate-200 p-2.5 space-y-2">
          <div className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-50 rounded-xl border border-slate-200">
            <Search className="w-4 h-4 text-emerald-700 shrink-0" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="काम या सेवा खोजें (उदा: गेहूं कटाई, रोटावेटर, मिस्त्री...)"
              className="w-full text-xs text-slate-800 bg-transparent focus:outline-none font-medium"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 rounded-xl border border-slate-200">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
              <input
                type="text"
                value={localLoc}
                onChange={(e) => setLocalLoc(e.target.value)}
                placeholder="गाँव, शहर या जिला (उदा: करनाल, लखनऊ)"
                className="w-full text-xs text-slate-800 bg-transparent focus:outline-none font-medium"
              />
            </div>

            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow flex items-center gap-1 cursor-pointer shrink-0"
            >
              <span>खोजें</span>
            </button>
          </div>

          {/* Quick city tags */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
            <span className="text-[10px] text-slate-400 whitespace-nowrap">स्थान:</span>
            {popularLocations.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => {
                  setLocalLoc(loc);
                  setLocationFilter(loc);
                  setActiveTab('jobs');
                }}
                className="text-[11px] bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 text-slate-700 px-2.5 py-0.5 rounded-full whitespace-nowrap transition cursor-pointer font-medium"
              >
                {loc}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* 10 Direct Quick Action Grid Cards (Explicitly requested in Section 11) */}
      <div className="px-4">
        <h3 className="text-sm font-black text-slate-900 mb-2.5">
          मुख्य सुविधाएं (Quick Access)
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {/* 1. काम ढूँढें */}
          <button
            onClick={() => {
              setSelectedCategory('सभी काम');
              setActiveTab('jobs');
            }}
            className="p-3 bg-white hover:bg-emerald-50 rounded-2xl border border-slate-200 text-left transition flex items-center gap-2.5 shadow-xs cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900 leading-tight">काम ढूँढें</h4>
              <p className="text-[10px] text-slate-500">सभी नए काम</p>
            </div>
          </button>

          {/* 2. काम पोस्ट करें */}
          <button
            onClick={() => setActiveTab('post')}
            className="p-3 bg-white hover:bg-emerald-50 rounded-2xl border border-slate-200 text-left transition flex items-center gap-2.5 shadow-xs cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900 leading-tight">काम पोस्ट करें</h4>
              <p className="text-[10px] text-slate-500">मजदूर प्राप्त करें</p>
            </div>
          </button>

          {/* 3. कृषि मशीनरी बुक करें */}
          <button
            onClick={() => setActiveTab('services')}
            className="p-3 bg-white hover:bg-emerald-50 rounded-2xl border border-slate-200 text-left transition flex items-center gap-2.5 shadow-xs cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
              <Tractor className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900 leading-tight">कृषि मशीनरी</h4>
              <p className="text-[10px] text-slate-500">रोटावेटर, रीपर</p>
            </div>
          </button>

          {/* 4. ट्रैक्टर एवं ट्रॉली */}
          <button
            onClick={() => setActiveTab('services')}
            className="p-3 bg-white hover:bg-emerald-50 rounded-2xl border border-slate-200 text-left transition flex items-center gap-2.5 shadow-xs cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
              <Tractor className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900 leading-tight">ट्रैक्टर एवं ट्रॉली</h4>
              <p className="text-[10px] text-slate-500">किराये पर बुकिंग</p>
            </div>
          </button>

          {/* 5. वाहन सेवा */}
          <button
            onClick={() => setActiveTab('services')}
            className="p-3 bg-white hover:bg-emerald-50 rounded-2xl border border-slate-200 text-left transition flex items-center gap-2.5 shadow-xs cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900 leading-tight">वाहन सेवा</h4>
              <p className="text-[10px] text-slate-500">पिकअप, छोटा हाथी</p>
            </div>
          </button>

          {/* 6. मजदूर सेवा */}
          <button
            onClick={() => {
              setSelectedCategory('मजदूरी व निर्माण');
              setActiveTab('jobs');
            }}
            className="p-3 bg-white hover:bg-emerald-50 rounded-2xl border border-slate-200 text-left transition flex items-center gap-2.5 shadow-xs cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900 leading-tight">मजदूर सेवा</h4>
              <p className="text-[10px] text-slate-500">खेती व निर्माण</p>
            </div>
          </button>

          {/* 7. मेरी बुकिंग */}
          <button
            onClick={() => setActiveTab('bookings')}
            className="p-3 bg-white hover:bg-emerald-50 rounded-2xl border border-slate-200 text-left transition flex items-center gap-2.5 shadow-xs cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900 leading-tight">मेरी बुकिंग</h4>
              <p className="text-[10px] text-slate-500">ट्रैक्टर व वाहन स्थिति</p>
            </div>
          </button>

          {/* 8. सहायता एवं शिकायत */}
          <button
            onClick={() => setActiveTab('support')}
            className="p-3 bg-white hover:bg-emerald-50 rounded-2xl border border-slate-200 text-left transition flex items-center gap-2.5 shadow-xs cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900 leading-tight">सहायता एवं शिकायत</h4>
              <p className="text-[10px] text-slate-500">टिकट व विवाद हल</p>
            </div>
          </button>
        </div>
      </div>

      {/* Permanent Owner Contact Section (Section 3 Requirement) */}
      <div className="px-4">
        <AdminContactCard
          title="एडमिन से संपर्क करें (Official Owner Helpline)"
        />
      </div>

      {/* Job Categories Grid */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-2.5">
          <div>
            <h3 className="text-sm font-black text-slate-900 leading-tight">
              काम की श्रेणियां (Job Categories)
            </h3>
            <p className="text-xs text-slate-500">अपने हुनर के अनुसार काम चुनें</p>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('सभी काम');
              setActiveTab('jobs');
            }}
            className="text-xs font-bold text-emerald-700 flex items-center gap-0.5 hover:underline cursor-pointer"
          >
            <span>सभी देखें</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.name)}
                className={`p-3 rounded-2xl border text-left transition-all active:scale-[0.98] flex items-center gap-2.5 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-700 text-white border-emerald-800 shadow-md'
                    : 'bg-white hover:bg-emerald-50/70 border-slate-200 text-slate-800 shadow-xs'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  <CategoryIcon name={cat.name} className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold leading-tight truncate">
                    {cat.name}
                  </h4>
                  <p className={`text-[10px] mt-0.5 ${isSelected ? 'text-emerald-100' : 'text-slate-500'}`}>
                    {cat.jobCount} उपलब्ध
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Approved Jobs with Safe Platform Application */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-700" />
            <h3 className="text-sm font-black text-slate-900 leading-tight">
              हाल ही में आए नए काम
            </h3>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('सभी काम');
              setActiveTab('jobs');
            }}
            className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
          >
            और देखें ({jobs.length})
          </button>
        </div>

        {loadingJobs ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 bg-slate-200/70 animate-pulse rounded-3xl"></div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white p-6 rounded-3xl text-center border border-slate-200 text-slate-500 space-y-1">
            <p className="text-sm font-bold text-slate-700">अभी कोई नया काम नहीं है</p>
            <p className="text-xs">काम पोस्ट करने के लिए 'काम पोस्ट करें' बटन दबाएं।</p>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.slice(0, 4).map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>

      {/* Safety & Easy Usage Guidelines in Simple Hindi */}
      <div className="px-4">
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-3xl p-4 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-300" />
            <h4 className="text-sm font-bold">काम मित्र पर सुरक्षा व संचालन नियम:</h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-emerald-100">
            <div className="bg-white/10 p-2.5 rounded-2xl">
              <span className="font-bold text-amber-300">1. कोई सीधा नंबर नहीं:</span>
              <p className="mt-0.5">धोखाधड़ी रोकने के लिए व्यक्तिगत फोन नंबर छिपाए गए हैं।</p>
            </div>
            <div className="bg-white/10 p-2.5 rounded-2xl">
              <span className="font-bold text-amber-300">2. एडमिन आवंटन:</span>
              <p className="mt-0.5">काम मित्र व्यवस्थापक योग्य मजदूर व मशीनरी आवंटित करते हैं।</p>
            </div>
            <div className="bg-white/10 p-2.5 rounded-2xl">
              <span className="font-bold text-amber-300">3. सुरक्षित भुगतान:</span>
              <p className="mt-0.5">काम पूरा होने पर ही भुगतान। किसी को निजी अग्रिम न दें।</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

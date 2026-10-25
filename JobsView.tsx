import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { JobCard } from '../components/JobCard';
import { CategoryIcon } from '../components/CategoryIcon';
import {
  Search,
  MapPin,
  Filter,
  Flame,
  RotateCcw,
  PlusCircle,
  Briefcase
} from 'lucide-react';

export const JobsView: React.FC = () => {
  const {
    jobs,
    categories,
    loadingJobs,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    locationFilter,
    setLocationFilter,
    setActiveTab
  } = useApp();

  const [urgentOnly, setUrgentOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'salary'>('newest');

  // Filter jobs locally
  let filteredJobs = jobs;
  if (urgentOnly) {
    filteredJobs = filteredJobs.filter(j => j.urgent);
  }

  if (sortBy === 'salary') {
    filteredJobs = [...filteredJobs].sort((a, b) => (b.salaryAmount || 0) - (a.salaryAmount || 0));
  }

  const handleResetFilters = () => {
    setSelectedCategory('सभी काम');
    setSearchQuery('');
    setLocationFilter('');
    setUrgentOnly(false);
  };

  return (
    <div className="pb-24 space-y-4 animate-in fade-in duration-150">
      
      {/* Top sticky search & filter bar */}
      <div className="bg-white border-b border-slate-200 p-4 sticky top-14 z-20 shadow-xs">
        {/* Search Inputs */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200">
            <Search className="w-4 h-4 text-emerald-600 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="काम का नाम या विवरण खोजें..."
              className="w-full text-xs text-slate-800 bg-transparent focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 flex-1 sm:w-44">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
              <input
                type="text"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                placeholder="स्थान / शहर"
                className="w-full text-xs text-slate-800 bg-transparent focus:outline-none"
              />
              {locationFilter && (
                <button
                  onClick={() => setLocationFilter('')}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Urgent toggle */}
            <button
              onClick={() => setUrgentOnly(!urgentOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer ${
                urgentOnly
                  ? 'bg-red-500 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              title="केवल तुरंत जरूरत वाले काम"
            >
              <Flame className={`w-3.5 h-3.5 ${urgentOnly ? 'text-white' : 'text-red-500'}`} />
              <span className="hidden sm:inline">तुरंत</span>
            </button>
          </div>
        </div>

        {/* Category Pills Horizontal Scroller */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-3">
          <button
            onClick={() => setSelectedCategory('सभी काम')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              selectedCategory === 'सभी काम'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            सभी काम ({jobs.length})
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <CategoryIcon name={cat.name} className="w-3.5 h-3.5" />
                <span>{cat.name}</span>
                {cat.jobCount > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20' : 'bg-slate-200 text-slate-600'}`}>
                    {cat.jobCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header: Count & Sorting */}
      <div className="px-4 flex items-center justify-between text-xs text-slate-500">
        <div>
          <span className="font-bold text-slate-800">{filteredJobs.length}</span> काम उपलब्ध हैं
          {selectedCategory !== 'सभी काम' && (
            <span className="text-emerald-700 font-semibold"> • {selectedCategory}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px]">क्रम:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'salary')}
            className="bg-white border border-slate-200 text-xs text-slate-700 font-medium px-2 py-1 rounded-lg focus:outline-none"
          >
            <option value="newest">हालिया पहले</option>
            <option value="salary">अधिक मजदूरी</option>
          </select>
        </div>
      </div>

      {/* Jobs List */}
      <div className="px-4 space-y-3">
        {loadingJobs ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-36 bg-slate-200/80 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 space-y-4 my-4">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <Briefcase className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">कोई काम नहीं मिला</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                आपके द्वारा चुने गए फिल्टर या स्थान में फिलहाल कोई काम दर्ज नहीं है। फिल्टर बदलकर देखें।
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
              <button
                onClick={handleResetFilters}
                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>सभी फिल्टर हटाएं</span>
              </button>

              <button
                onClick={() => setActiveTab('post')}
                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>नया काम डालें</span>
              </button>
            </div>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))
        )}
      </div>

    </div>
  );
};

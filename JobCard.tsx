import React from 'react';
import { Job } from '../types';
import { useApp } from '../context/AppContext';
import { CategoryIcon } from './CategoryIcon';
import {
  MapPin,
  Clock,
  Volume2,
  VolumeX,
  ShieldCheck,
  Flame,
  Users,
  ChevronRight,
  Calendar,
  Headphones,
  Lock
} from 'lucide-react';

interface JobCardProps {
  job: Job;
  compact?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({ job, compact = false }) => {
  const {
    setSelectedJob,
    setApplyingJob,
    activeSpeakingId,
    toggleJobSpeech,
    currentUser,
    openAdminPhoneCall,
    setActiveTab
  } = useApp();

  const isSpeaking = activeSpeakingId === job.id;

  // Format posted time in Hindi
  const formatTimeInHindi = (isoDate: string) => {
    try {
      const diffMs = Date.now() - new Date(isoDate).getTime();
      const diffHours = Math.floor(diffMs / 3600000);
      if (diffHours < 1) return 'अभी हाल ही में';
      if (diffHours < 24) return `${diffHours} घंटे पहले`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} दिन पहले`;
    } catch {
      return 'नया काम';
    }
  };

  return (
    <div
      onClick={() => setSelectedJob(job)}
      className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all active:scale-[0.99] overflow-hidden cursor-pointer flex flex-col"
    >
      {/* Top Banner / Tags */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between border-b border-slate-100 bg-slate-50/70">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
            <CategoryIcon name={job.category} className="w-3.5 h-3.5 text-emerald-700" />
            <span>{job.category}</span>
          </span>

          {job.urgent && (
            <span className="inline-flex items-center gap-0.5 bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
              <Flame className="w-3 h-3 text-red-600" />
              <span>तुरंत आवश्यकता</span>
            </span>
          )}

          {job.isVerified && (
            <span className="inline-flex items-center gap-0.5 text-emerald-700 text-[10px] font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>प्रमाणित</span>
            </span>
          )}
        </div>

        {/* Audio Narration button in Hindi */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleJobSpeech(job);
          }}
          className={`p-1.5 rounded-full transition-colors flex items-center gap-1 text-[11px] font-medium cursor-pointer ${
            isSpeaking
              ? 'bg-amber-500 text-white animate-bounce shadow'
              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
          }`}
          title="हिंदी में विवरण सुनें"
        >
          {isSpeaking ? (
            <>
              <VolumeX className="w-4 h-4" />
              <span className="text-[10px] pr-1">रोकें</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-emerald-700" />
              <span className="text-[10px] text-emerald-800 font-bold pr-1">सुनिए</span>
            </>
          )}
        </button>
      </div>

      {/* Main Content Area */}
      <div className="p-4 flex-1">
        {/* Title */}
        <h3 className="text-base font-black text-slate-900 leading-snug line-clamp-2">
          {job.title}
        </h3>

        {/* Big Salary / Wage display */}
        <div className="mt-2.5 flex items-baseline gap-2">
          <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-2xl">
            <span className="text-xs text-emerald-700 font-bold">मजदूरी/वेतन: </span>
            <span className="text-base font-black text-emerald-800 tracking-tight">
              {job.salary}
            </span>
          </div>
        </div>

        {/* Details snippet: Employer, Location, Hours */}
        <div className="mt-3 space-y-1.5 text-xs text-slate-600">
          <div className="flex items-center justify-between text-slate-800">
            <div className="flex items-center gap-1.5 font-medium">
              <span className="text-slate-400">नियोक्ता:</span>
              <span className="font-bold">{job.employerName}</span>
            </div>
            {/* Privacy indicator */}
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>नंबर सुरक्षित</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-700">
            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span className="truncate font-medium">{job.location}</span>
          </div>

          <div className="flex items-center gap-3 text-slate-500 text-[11px] pt-0.5">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{job.workingHours}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3 text-slate-400" />
              <span>{job.workersNeeded} मजदूर चाहिए</span>
            </div>
          </div>
        </div>

        {/* Short description if not compact */}
        {!compact && (
          <p className="mt-2.5 text-xs text-slate-600 line-clamp-2 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            {job.description}
          </p>
        )}
      </div>

      {/* Footer: Safe Platform Application & Coordinator Help */}
      <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <Calendar className="w-3 h-3" />
          <span>{formatTimeInHindi(job.createdAt)}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Contact Admin for this job */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              openAdminPhoneCall();
            }}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition flex items-center gap-1 text-[11px] font-bold cursor-pointer"
            title="काम के बारे में एडमिन से पूछें"
          >
            <Headphones className="w-3.5 h-3.5 text-emerald-700" />
            <span className="hidden xs:inline">एडमिन मदद</span>
          </button>

          {/* Primary Apply Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (currentUser?.role === 'employer' && currentUser.id === job.employerId) {
                setSelectedJob(job);
              } else {
                setApplyingJob(job);
              }
            }}
            className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-sm flex items-center gap-1 cursor-pointer"
          >
            <span>
              {currentUser?.role === 'employer' && currentUser.id === job.employerId
                ? 'आवेदन देखें'
                : 'आवेदन करें'}
            </span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

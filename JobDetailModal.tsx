import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CategoryIcon } from './CategoryIcon';
import { fetchApplications, updateApplicationStatus } from '../api';
import { Application } from '../types';
import {
  X,
  MapPin,
  Clock,
  Users,
  Volume2,
  VolumeX,
  ShieldCheck,
  Flame,
  CheckCircle,
  Briefcase,
  Calendar,
  Lock,
  PhoneCall,
  MessageCircle,
  AlertTriangle,
  Headphones
} from 'lucide-react';

export const JobDetailModal: React.FC = () => {
  const {
    selectedJob,
    setSelectedJob,
    setApplyingJob,
    activeSpeakingId,
    toggleJobSpeech,
    currentUser,
    showToast,
    refreshAll,
    openAdminPhoneCall,
    openAdminWhatsApp,
    setActiveTab,
    settings
  } = useApp();

  const [jobApplications, setJobApplications] = useState<Application[]>([]);
  const [loadingApps, setLoadingApps] = useState(false);

  useEffect(() => {
    if (selectedJob && currentUser?.role === 'employer' && currentUser.id === selectedJob.employerId) {
      setLoadingApps(true);
      fetchApplications({ jobId: selectedJob.id, requesterRole: currentUser.role })
        .then(apps => setJobApplications(apps))
        .catch(err => console.error(err))
        .finally(() => setLoadingApps(false));
    }
  }, [selectedJob, currentUser]);

  if (!selectedJob) return null;

  const isSpeaking = activeSpeakingId === selectedJob.id;
  const isEmployerOwner = currentUser?.role === 'employer' && currentUser.id === selectedJob.employerId;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-center items-end sm:items-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
        
        {/* Header Bar */}
        <div className="p-4 bg-emerald-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-800 rounded-xl">
              <CategoryIcon name={selectedJob.category} className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xs text-emerald-200 font-medium">काम की श्रेणी</span>
              <h4 className="text-sm font-bold text-white">{selectedJob.category}</h4>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Button */}
            <button
              onClick={() => toggleJobSpeech(selectedJob)}
              className={`p-2 rounded-xl flex items-center gap-1 text-xs font-bold transition cursor-pointer ${
                isSpeaking ? 'bg-amber-400 text-slate-900 animate-pulse' : 'bg-emerald-800 text-white hover:bg-emerald-600'
              }`}
              title="हिंदी में सुनें"
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span className="text-[11px]">{isSpeaking ? 'रोकें' : 'सुनिए'}</span>
            </button>

            <button
              onClick={() => setSelectedJob(null)}
              className="p-2 rounded-xl bg-emerald-800 hover:bg-emerald-600 text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable details content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Title & Badges */}
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              {selectedJob.urgent && (
                <span className="bg-red-100 text-red-700 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-red-600" />
                  <span>तुरंत आवश्यकता</span>
                </span>
              )}
              {selectedJob.isVerified && (
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>काम मित्र सत्यापित</span>
                </span>
              )}
            </div>

            <h2 className="text-xl font-black text-slate-900 leading-tight">
              {selectedJob.title}
            </h2>
          </div>

          {/* Big Salary Banner */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-emerald-800">तयशुदा मजदूरी / वेतन</p>
              <p className="text-2xl font-black text-emerald-900 tracking-tight mt-0.5">
                {selectedJob.salary}
              </p>
            </div>
            <div className="text-right">
              <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-xl shadow-xs">
                सत्यापित दर
              </span>
            </div>
          </div>

          {/* Primary Job Info Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
                <MapPin className="w-4 h-4 text-rose-500" />
                <span>काम का स्थान</span>
              </div>
              <p className="text-sm font-bold text-slate-800 leading-snug">
                {selectedJob.location}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
                <Users className="w-4 h-4 text-blue-500" />
                <span>मजदूरों की संख्या</span>
              </div>
              <p className="text-sm font-bold text-slate-800">
                {selectedJob.workersNeeded} व्यक्ति चाहिए
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>काम का समय</span>
              </div>
              <p className="text-sm font-bold text-slate-800">
                {selectedJob.workingHours}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
                <Briefcase className="w-4 h-4 text-emerald-600" />
                <span>काम देने वाले</span>
              </div>
              <p className="text-sm font-bold text-slate-800 truncate">
                {selectedJob.employerName}
              </p>
            </div>
          </div>

          {/* Full Work Description */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-1.5">काम का विवरण:</h4>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {selectedJob.description}
            </div>
          </div>

          {/* Privacy & No Direct Contact Policy Box (Section 4 Compliance) */}
          <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-3.5 space-y-1.5 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
              <Lock className="w-4 h-4 text-emerald-700" />
              <span>काम मित्र गोपनीयता व सुरक्षा नीति:</span>
            </div>
            <p className="text-emerald-800 leading-relaxed">
              धोखाधड़ी और अनुचित संपर्क से बचाव के लिए काम देने वालों और काम ढूंढने वालों के व्यक्तिगत फोन नंबर सार्वजनिक रूप से नहीं दिखाए जाते। आपका आवेदन सीधे काम मित्र प्लेटफॉर्म को जाएगा और व्यवस्थापक द्वारा उपयुक्त मजदूर नियुक्त किए जाएंगे।
            </p>
          </div>

          {/* Employer specific view: Applications received (Coordinated by platform) */}
          {isEmployerOwner && (
            <div className="border-t border-slate-200 pt-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-slate-900">
                  इस काम के लिए आए आवेदन ({jobApplications.length})
                </h4>
              </div>

              {loadingApps ? (
                <p className="text-xs text-slate-500">आवेदन लोड हो रहे हैं...</p>
              ) : jobApplications.length === 0 ? (
                <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-500">
                  अभी तक कोई आवेदन नहीं आया है। काम मित्र एडमिन द्वारा जल्द ही मजदूर जोड़े जाएंगे।
                </div>
              ) : (
                <div className="space-y-2.5">
                  {jobApplications.map((app) => (
                    <div key={app.id} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-bold text-slate-900">{app.workerName}</p>
                          <p className="text-xs text-slate-600">
                            स्थान: {app.workerLocation} • तजुर्बा: {app.workerExperienceYears} वर्ष
                          </p>
                          {app.note && (
                            <p className="text-xs text-slate-500 mt-1 italic">"{app.note}"</p>
                          )}
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          app.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                          app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          app.status === 'shortlisted' ? 'bg-blue-100 text-blue-700' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {app.status === 'accepted' ? 'स्वीकृत' :
                           app.status === 'rejected' ? 'अस्वीकृत' :
                           app.status === 'shortlisted' ? 'पसंद आया' : 'समीक्षाधीन'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-200/70 pt-2 text-xs">
                        <span className="text-[11px] text-slate-500">
                          समन्वय: <strong>काम मित्र एडमिन</strong>
                        </span>
                        <div className="flex items-center gap-1.5">
                          {app.status !== 'accepted' && (
                            <button
                              onClick={() => {
                                updateApplicationStatus(app.id, 'accepted');
                                showToast('आवेदन स्वीकृत हुआ! एडमिन मजदूर को सूचित करेंगे।', 'success');
                              }}
                              className="bg-emerald-600 text-white px-2.5 py-1 rounded-lg font-bold hover:bg-emerald-700 cursor-pointer"
                            >
                              स्वीकार करें
                            </button>
                          )}
                          {app.status !== 'rejected' && (
                            <button
                              onClick={() => {
                                updateApplicationStatus(app.id, 'rejected');
                                showToast('आवेदन निरस्त किया गया', 'info');
                              }}
                              className="bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg font-medium hover:bg-slate-300 cursor-pointer"
                            >
                              मना करें
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Quick report or doubt */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <button
              onClick={() => {
                setSelectedJob(null);
                setActiveTab('support');
              }}
              className="text-red-600 hover:underline flex items-center gap-1 font-bold cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>फर्जी काम या संदिग्ध जानकारी की शिकायत करें</span>
            </button>
          </div>
        </div>

        {/* Bottom Action Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
          {/* Contact Admin Call Button */}
          <button
            onClick={openAdminPhoneCall}
            className="flex-1 bg-white hover:bg-slate-100 border border-emerald-600 text-emerald-800 font-bold py-3 px-2 rounded-2xl flex items-center justify-center gap-1.5 text-xs shadow-xs transition active:scale-[0.98] cursor-pointer"
          >
            <PhoneCall className="w-4 h-4 text-emerald-700" />
            <span>एडमिन को कॉल</span>
          </button>

          {/* Contact Admin WhatsApp Button */}
          <button
            onClick={openAdminWhatsApp}
            className="p-3 bg-green-500 hover:bg-green-600 text-white rounded-2xl flex items-center justify-center shadow-xs transition active:scale-[0.98] cursor-pointer"
            title="WhatsApp एडमिन"
          >
            <MessageCircle className="w-5 h-5" />
          </button>

          {/* Primary Apply Button */}
          {!isEmployerOwner && (
            <button
              onClick={() => {
                const target = selectedJob;
                setSelectedJob(null);
                setApplyingJob(target);
              }}
              className="flex-[1.8] bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 px-3 rounded-2xl flex items-center justify-center gap-1.5 text-xs shadow-md transition active:scale-[0.98] cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>काम के लिए आवेदन करें</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

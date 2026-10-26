import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { fetchApplications, updateApplicationStatus } from '../api';
import { Application } from '../types';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  User,
  MapPin,
  ChevronRight,
  ShieldCheck,
  Lock,
  PhoneCall
} from 'lucide-react';

export const ApplicationsView: React.FC = () => {
  const { currentUser, setActiveTab, setSelectedJob, jobs, showToast, refreshAll, openAdminPhoneCall } = useApp();
  const [roleView, setRoleView] = useState<'worker' | 'employer'>(
    currentUser?.role === 'employer' ? 'employer' : 'worker'
  );
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser?.role === 'employer') {
      setRoleView('employer');
    } else {
      setRoleView('worker');
    }
  }, [currentUser]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (roleView === 'employer') {
        const data = await fetchApplications({ employerId: currentUser?.id, requesterRole: currentUser?.role });
        setApps(data);
      } else {
        const data = await fetchApplications({ workerId: currentUser?.id, requesterRole: currentUser?.role });
        setApps(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [roleView, currentUser]);

  const handleStatusUpdate = async (id: string, status: 'accepted' | 'shortlisted' | 'rejected') => {
    try {
      await updateApplicationStatus(id, status);
      setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a));
      showToast('आवेदन स्थिति बदल दी गई', 'success');
      await refreshAll();
    } catch {
      showToast('अपडेट में त्रुटि हुई', 'error');
    }
  };

  return (
    <div className="pb-28 max-w-lg mx-auto p-4 space-y-4 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="bg-emerald-800 text-white p-5 rounded-3xl shadow-md">
        <div className="flex items-center gap-2 mb-1">
          <FileText className="w-5 h-5 text-amber-300" />
          <span className="text-xs font-bold text-emerald-200">काम मित्र आवेदन ट्रैकिंग</span>
        </div>
        <h2 className="text-xl font-black">
          {roleView === 'employer' ? 'काम के लिए आए आवेदन' : 'मेरे द्वारा किए गए आवेदन'}
        </h2>
        <p className="text-xs text-emerald-100 mt-0.5">
          काम मित्र एडमिन के समन्वय द्वारा पारदर्शी और सुरक्षित भर्ती
        </p>

        {/* View Switcher Tabs */}
        <div className="grid grid-cols-2 gap-2 mt-4 bg-emerald-900/80 p-1 rounded-2xl border border-emerald-600/40">
          <button
            onClick={() => setRoleView('worker')}
            className={`py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
              roleView === 'worker'
                ? 'bg-white text-emerald-900 shadow'
                : 'text-emerald-100 hover:text-white'
            }`}
          >
            👷 मेरे आवेदन (मजदूर)
          </button>
          <button
            onClick={() => setRoleView('employer')}
            className={`py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
              roleView === 'employer'
                ? 'bg-white text-emerald-900 shadow'
                : 'text-emerald-100 hover:text-white'
            }`}
          >
            💼 आए हुए आवेदन (ठेकेदार)
          </button>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-28 bg-slate-200 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : apps.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 space-y-3">
            <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">अभी कोई आवेदन नहीं है</h4>
              <p className="text-xs text-slate-500 mt-1">
                {roleView === 'worker'
                  ? 'आपने अभी तक किसी काम के लिए आवेदन नहीं किया है।'
                  : 'आपके पोस्ट किए गए कामों पर अभी कोई नया आवेदन नहीं आया है।'}
              </p>
            </div>
            <button
              onClick={() => setActiveTab(roleView === 'worker' ? 'jobs' : 'post')}
              className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow hover:bg-emerald-700 transition cursor-pointer"
            >
              {roleView === 'worker' ? 'काम खोजें और आवेदन करें' : 'नया काम पोस्ट करें'}
            </button>
          </div>
        ) : (
          apps.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                      काम:
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 leading-tight">
                      {app.jobTitle}
                    </h4>
                  </div>

                  {roleView === 'employer' ? (
                    <div className="space-y-0.5 text-xs text-slate-600 mt-1">
                      <p className="font-bold text-slate-800 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-emerald-600" />
                        <span>मजदूर साथी: {app.workerName}</span>
                      </p>
                      <p className="text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        <span>स्थान: {app.workerLocation}</span>
                      </p>
                      <p className="text-slate-500">
                        अनुभव: {app.workerExperienceYears} साल • कौशल: {app.workerSkills.join(', ')}
                      </p>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500 mt-1">
                      <span>आवेदन की तारीख: {new Date(app.createdAt).toLocaleDateString('hi-IN')}</span>
                    </div>
                  )}

                  {app.note && (
                    <div className="mt-2 bg-slate-50 p-2 rounded-xl text-xs text-slate-600 border border-slate-100 italic">
                      "{app.note}"
                    </div>
                  )}
                </div>

                {/* Status Badge */}
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 flex items-center gap-1 ${
                  app.status === 'accepted' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                  app.status === 'rejected' ? 'bg-red-100 text-red-700 border border-red-200' :
                  app.status === 'shortlisted' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                  'bg-amber-100 text-amber-800 border border-amber-200'
                }`}>
                  {app.status === 'accepted' && <CheckCircle className="w-3 h-3 text-emerald-700" />}
                  {app.status === 'rejected' && <XCircle className="w-3 h-3 text-red-700" />}
                  {app.status === 'pending' && <Clock className="w-3 h-3 text-amber-700" />}
                  <span>
                    {app.status === 'accepted' ? 'स्वीकृत' :
                     app.status === 'rejected' ? 'अस्वीकृत' :
                     app.status === 'shortlisted' ? 'पसंद आया' : 'समीक्षाधीन'}
                  </span>
                </span>
              </div>

              {/* Action Buttons: Coordinated via Platform */}
              <div className="border-t border-slate-100 pt-2.5 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>समन्वय: काम मित्र एडमिन</span>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={openAdminPhoneCall}
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-700" />
                    <span>एडमिन कॉल</span>
                  </button>

                  {roleView === 'employer' && (
                    <div className="flex items-center gap-1.5">
                      {app.status !== 'accepted' && (
                        <button
                          onClick={() => handleStatusUpdate(app.id, 'accepted')}
                          className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1.5 rounded-xl transition cursor-pointer"
                        >
                          स्वीकारें
                        </button>
                      )}
                      {app.status !== 'rejected' && (
                        <button
                          onClick={() => handleStatusUpdate(app.id, 'rejected')}
                          className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-2.5 py-1.5 rounded-xl transition cursor-pointer"
                        >
                          मना करें
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

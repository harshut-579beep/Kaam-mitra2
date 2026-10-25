import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  fetchAdminOverview,
  toggleUserBan,
  toggleJobVerified,
  deleteJob,
  addCategory,
  loginUser,
  updateAdminMachineryBooking,
  updateAdminVehicleBooking,
  replyComplaint,
  assignWorkerToJob,
  updatePlatformSettings,
  resetDatabase
} from '../api';
import { AdminOverview, BookingStatus } from '../types';
import {
  ShieldCheck,
  ShieldAlert,
  Users,
  Briefcase,
  Tractor,
  Truck,
  Trash2,
  CheckCircle,
  Ban,
  Plus,
  RefreshCw,
  Search,
  Lock,
  Headphones,
  Settings,
  IndianRupee,
  FileText,
  Phone,
  MessageCircle,
  Clock,
  UserCheck
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const { currentUser, setCurrentUser, showToast, refreshAll, settings, setSettings } = useApp();
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminTab, setAdminTab] = useState<'overview' | 'machinery' | 'jobs' | 'users' | 'complaints' | 'finance' | 'settings' | 'logs'>('overview');

  // Security pin login state for owner
  const [adminPin, setAdminPin] = useState('');
  const [pinError, setPinError] = useState('');

  // Search in admin
  const [adminSearch, setAdminSearch] = useState('');

  // Complaint reply state
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyStatus, setReplyStatus] = useState<string>('resolved');

  // Machinery booking assignment state
  const [assignBookingId, setAssignBookingId] = useState<string | null>(null);
  const [selectedProviderId, setSelectedProviderId] = useState('');
  const [assignmentNotes, setAssignmentNotes] = useState('');

  // Job worker assignment state
  const [assignJobId, setAssignJobId] = useState<string | null>(null);
  const [selectedWorkerId, setSelectedWorkerId] = useState('');

  // Settings Edit Form State
  const [editOwnerPhone, setEditOwnerPhone] = useState(settings?.ownerPhone || '+91 9876543210');
  const [editOwnerWhatsapp, setEditOwnerWhatsapp] = useState(settings?.ownerWhatsapp || '+91 9876543210');
  const [editSupportHours, setEditSupportHours] = useState(settings?.supportHours || 'सुबह 8:00 से रात 8:00 बजे तक');
  const [editCommission, setEditCommission] = useState(String(settings?.commissionPercent || 5));
  const [editBookingFee, setEditBookingFee] = useState(String(settings?.bookingFeeFixed || 50));
  const [editNotice, setEditNotice] = useState(settings?.noticeBanner || '');

  const loadAdminData = async () => {
    if (!currentUser || currentUser.role !== 'admin') return;
    setLoading(true);
    try {
      const data = await fetchAdminOverview(currentUser.phone);
      setOverview(data);
      if (data.settings) {
        setSettings(data.settings);
        setEditOwnerPhone(data.settings.ownerPhone);
        setEditOwnerWhatsapp(data.settings.ownerWhatsapp);
        setEditSupportHours(data.settings.supportHours);
        setEditCommission(String(data.settings.commissionPercent));
        setEditBookingFee(String(data.settings.bookingFeeFixed));
        setEditNotice(data.settings.noticeBanner);
      }
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'डेटा लोड करने में त्रुटि';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      loadAdminData();
    }
  }, [currentUser]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');
    if (adminPin === 'admin123' || adminPin === '1234' || adminPin === '9876543210') {
      try {
        const res = await loginUser('9876543210', 'admin123');
        setCurrentUser(res.user);
        showToast('मुख्य व्यवस्थापक (Owner Admin) पैनल अनलॉक हुआ!', 'success');
      } catch {
        setPinError('एडमिन लॉगिन नहीं हो सका।');
      }
    } else {
      setPinError('गलत पिन! केवल काम मित्र के अधिकृत स्वामी ही प्रवेश कर सकते हैं। (डेमो: 1234 या admin123)');
    }
  };

  const handleUpdateMachineryStatus = async (bookingId: string, status: BookingStatus) => {
    if (!currentUser) return;
    try {
      await updateAdminMachineryBooking(bookingId, {
        adminPhone: currentUser.phone,
        status,
        assignedProviderId: selectedProviderId || undefined,
        adminNotes: assignmentNotes || undefined
      });
      showToast('मशीनरी बुकिंग स्थिति अपडेट हो गई!', 'success');
      setAssignBookingId(null);
      await loadAdminData();
      await refreshAll();
    } catch {
      showToast('स्थिति बदलने में समस्या हुई', 'error');
    }
  };

  const handleUpdateVehicleStatus = async (bookingId: string, status: BookingStatus) => {
    if (!currentUser) return;
    try {
      await updateAdminVehicleBooking(bookingId, {
        adminPhone: currentUser.phone,
        status
      });
      showToast('वाहन बुकिंग स्थिति अपडेट हो गई!', 'success');
      await loadAdminData();
      await refreshAll();
    } catch {
      showToast('स्थिति बदलने में समस्या हुई', 'error');
    }
  };

  const handleAssignWorker = async (jobId: string) => {
    if (!currentUser || !selectedWorkerId) {
      showToast('कृपया पहले कोई मजदूर चुनें', 'error');
      return;
    }
    try {
      await assignWorkerToJob(jobId, {
        adminPhone: currentUser.phone,
        workerId: selectedWorkerId,
        notes: 'एडमिन द्वारा सीधे सौंपा गया'
      });
      showToast('मजदूर को काम सौंप दिया गया!', 'success');
      setAssignJobId(null);
      await loadAdminData();
      await refreshAll();
    } catch {
      showToast('मजदूर असाइन करने में समस्या हुई', 'error');
    }
  };

  const handleReplyComplaint = async (ticketId: string) => {
    if (!currentUser || !replyText.trim()) return;
    try {
      await replyComplaint(ticketId, {
        adminPhone: currentUser.phone,
        adminReply: replyText.trim(),
        status: replyStatus
      });
      showToast('शिकायत पर उत्तर दर्ज हो गया!', 'success');
      setSelectedTicketId(null);
      setReplyText('');
      await loadAdminData();
    } catch {
      showToast('उत्तर दर्ज करने में समस्या हुई', 'error');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    try {
      const res = await updatePlatformSettings({
        adminPhone: currentUser.phone,
        ownerPhone: editOwnerPhone,
        ownerWhatsapp: editOwnerWhatsapp,
        supportHours: editSupportHours,
        commissionPercent: Number(editCommission),
        bookingFeeFixed: Number(editBookingFee),
        noticeBanner: editNotice
      });
      setSettings(res.settings);
      showToast(res.message, 'success');
      await loadAdminData();
    } catch {
      showToast('सेटिंग्स सेव करने में समस्या हुई', 'error');
    }
  };

  const handleToggleBan = async (userId: string, currentBanned?: boolean) => {
    if (!currentUser) return;
    try {
      await toggleUserBan(userId, !currentBanned, currentUser.phone);
      showToast(currentBanned ? 'खाता बहाल किया गया' : 'संदिग्ध खाता ब्लॉक (बैन) किया गया', 'info');
      await loadAdminData();
    } catch {
      showToast('कार्रवाई में समस्या हुई', 'error');
    }
  };

  const handleToggleJobVerify = async (jobId: string, currentStatus?: boolean) => {
    if (!currentUser) return;
    try {
      await toggleJobVerified(jobId, !currentStatus, currentUser.phone);
      showToast('काम सत्यापन स्थिति बदली गई', 'success');
      await loadAdminData();
      await refreshAll();
    } catch {
      showToast('सत्यापन में समस्या हुई', 'error');
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!currentUser) return;
    if (!window.confirm('क्या आप वाकई इस काम को हटाना चाहते हैं?')) return;
    try {
      await deleteJob(jobId, currentUser.phone);
      showToast('काम सफलतापूर्वक हटा दिया गया', 'success');
      await loadAdminData();
      await refreshAll();
    } catch {
      showToast('हटाने में त्रुटि', 'error');
    }
  };

  // If not admin, show restricted screen
  if (currentUser?.role !== 'admin') {
    return (
      <div className="pb-28 max-w-md mx-auto p-4 space-y-4 animate-in fade-in duration-150">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-slate-900 text-amber-400 rounded-3xl flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-lg font-black text-slate-900">निजी एडमिन नियंत्रण कक्ष</h3>
            <p className="text-xs text-slate-500 mt-1">
              यह पैनल केवल काम मित्र के अधिकृत स्वामी / ऐप मालिक के लिए आरक्षित है। कोई भी साधारण उपयोगकर्ता इसे नहीं खोल सकता।
            </p>
          </div>

          {pinError && (
            <p className="text-xs text-red-600 font-bold bg-red-50 p-2.5 rounded-xl border border-red-200">{pinError}</p>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                मालिक सुरक्षा पासवर्ड / पिन (Owner PIN)
              </label>
              <input
                type="password"
                value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)}
                placeholder="पिन दर्ज करें (डेमो: 1234 या admin123)"
                className="w-full text-center text-sm p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold tracking-wider"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-3 rounded-xl transition text-xs cursor-pointer shadow"
            >
              अधिकृत एडमिन के रूप में खोलें
            </button>
          </form>

          <p className="text-[11px] text-slate-400">
            समीक्षा हेतु त्वरित डेमो पिन: <strong className="text-slate-700 font-bold">1234</strong>
          </p>
        </div>
      </div>
    );
  }

  const providersList = overview?.allUsers.filter(u => u.role === 'machinery_provider') || [];
  const workersList = overview?.allUsers.filter(u => u.role === 'worker') || [];

  return (
    <div className="pb-28 max-w-2xl mx-auto p-4 space-y-4 animate-in fade-in duration-150">
      
      {/* Admin Header */}
      <div className="bg-slate-900 text-white p-5 rounded-3xl shadow-lg flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>काम मित्र आधिकारिक नियंत्रण कक्ष (Owner Panel)</span>
          </div>
          <h2 className="text-xl font-black">ऐप व्यवस्थापक प्रबंधन प्रणाली</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            बुकिंग आवंटन, फर्जी काम नियंत्रण, शिकायत निवारण व सेटिंग्स
          </p>
        </div>

        <button
          onClick={loadAdminData}
          className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-2xl text-slate-300 hover:text-white transition cursor-pointer"
          title="ताजा करें"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Admin Tab Controls */}
      <div className="flex bg-slate-200/90 p-1 rounded-2xl overflow-x-auto no-scrollbar gap-1 text-xs font-bold">
        <button
          onClick={() => setAdminTab('overview')}
          className={`px-3 py-2 rounded-xl whitespace-nowrap transition cursor-pointer ${
            adminTab === 'overview' ? 'bg-white text-slate-900 shadow' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          📊 सांख्यिकी
        </button>
        <button
          onClick={() => setAdminTab('machinery')}
          className={`px-3 py-2 rounded-xl whitespace-nowrap transition cursor-pointer ${
            adminTab === 'machinery' ? 'bg-white text-slate-900 shadow' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          🚜 मशीनरी व वाहन ({overview?.pendingBookings || 0} नए)
        </button>
        <button
          onClick={() => setAdminTab('jobs')}
          className={`px-3 py-2 rounded-xl whitespace-nowrap transition cursor-pointer ${
            adminTab === 'jobs' ? 'bg-white text-slate-900 shadow' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          💼 काम व मजदूर ({overview?.activeJobs || 0})
        </button>
        <button
          onClick={() => setAdminTab('users')}
          className={`px-3 py-2 rounded-xl whitespace-nowrap transition cursor-pointer ${
            adminTab === 'users' ? 'bg-white text-slate-900 shadow' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          👥 उपयोगकर्ता ({overview?.totalUsers || 0})
        </button>
        <button
          onClick={() => setAdminTab('complaints')}
          className={`px-3 py-2 rounded-xl whitespace-nowrap transition cursor-pointer ${
            adminTab === 'complaints' ? 'bg-white text-slate-900 shadow' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          ⚠️ शिकायतें ({overview?.openComplaints || 0})
        </button>
        <button
          onClick={() => setAdminTab('settings')}
          className={`px-3 py-2 rounded-xl whitespace-nowrap transition cursor-pointer ${
            adminTab === 'settings' ? 'bg-white text-slate-900 shadow' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          ⚙️ आधिकारिक संपर्क सेटिंग्स
        </button>
        <button
          onClick={() => setAdminTab('logs')}
          className={`px-3 py-2 rounded-xl whitespace-nowrap transition cursor-pointer ${
            adminTab === 'logs' ? 'bg-white text-slate-900 shadow' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          📝 ऑडिट लॉग
        </button>
      </div>

      {/* TAB 1: OVERVIEW & STATS */}
      {adminTab === 'overview' && overview && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-center shadow-xs">
              <span className="text-[11px] text-slate-500 font-bold block">कुल उपयोगकर्ता</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">{overview.totalUsers}</span>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-center shadow-xs">
              <span className="text-[11px] text-slate-500 font-bold block">किसान (Farmers)</span>
              <span className="text-2xl font-black text-emerald-700 mt-1 block">{overview.totalFarmers}</span>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-center shadow-xs">
              <span className="text-[11px] text-slate-500 font-bold block">मजदूर (Workers)</span>
              <span className="text-2xl font-black text-blue-700 mt-1 block">{overview.totalWorkers}</span>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-center shadow-xs">
              <span className="text-[11px] text-slate-500 font-bold block">मशीनरी ऑपरेटर</span>
              <span className="text-2xl font-black text-amber-700 mt-1 block">{overview.totalProviders}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl">
              <span className="text-xs text-emerald-800 font-bold block">सक्रिय काम</span>
              <span className="text-xl font-black text-emerald-900">{overview.activeJobs}</span>
            </div>
            <div className="bg-purple-50 border border-purple-200 p-3.5 rounded-2xl">
              <span className="text-xs text-purple-800 font-bold block">ट्रैक्टर व मशीनरी बुकिंग्स</span>
              <span className="text-xl font-black text-purple-900">{overview.totalMachineryBookings}</span>
            </div>
            <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl">
              <span className="text-xs text-amber-800 font-bold block">खुली शिकायतें</span>
              <span className="text-xl font-black text-amber-900">{overview.openComplaints}</span>
            </div>
          </div>

          {/* Platform Commission & Financial Preparedness */}
          <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-3xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-emerald-200 font-bold">प्लेटफॉर्म कमीशन व कमाई</span>
              <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full">
                कमीशन दर: {overview.settings.commissionPercent}%
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black">₹{overview.totalEarnings}</span>
              <span className="text-xs text-emerald-200">सफलतापूर्वक पूर्ण बुकिंग्स से अनुमानित कमाई</span>
            </div>
            <p className="text-[11px] text-emerald-100 pt-1 border-t border-emerald-700/60">
              भुगतान मोड: कार्य पूरा होने पर नकद / प्लेटफॉर्म समन्वय। कोई यूपीआई पिन या बैंक क्रेडेंशियल नहीं मांगा जाता।
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: MACHINERY & VEHICLE BOOKINGS MODERATION & ASSIGNMENT */}
      {adminTab === 'machinery' && overview && (
        <div className="space-y-4">
          <h3 className="text-sm font-black text-slate-900">
            कृषि मशीनरी व वाहन बुकिंग्स ({overview.allMachineryBookings.length + overview.allVehicleBookings.length})
          </h3>

          {/* Machinery Bookings List */}
          {overview.allMachineryBookings.map((bk) => (
            <div key={bk.id} className="bg-white rounded-3xl border border-slate-200 p-4 shadow-xs space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                    {bk.referenceId}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mt-1">{bk.serviceType}</h4>
                  <p className="text-xs text-slate-500">
                    किसान: <strong>{bk.farmerName}</strong> (फोन: {bk.farmerPhone}) • {bk.farmAreaAcres}
                  </p>
                  <p className="text-xs text-emerald-800 font-bold mt-0.5">स्थान: {bk.villageFarmLocation}</p>
                </div>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded-full">
                  {bk.status}
                </span>
              </div>

              {/* Assignment controls */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-bold">वर्तमान प्रदाता:</span>
                  <span className="font-bold text-emerald-700">
                    {bk.assignedProviderName || 'कोई नियुक्त नहीं'}
                  </span>
                </div>

                {assignBookingId === bk.id ? (
                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <label className="block text-[11px] font-bold text-slate-700">मशीनरी ऑपरेटर चुनें:</label>
                    <select
                      value={selectedProviderId}
                      onChange={(e) => setSelectedProviderId(e.target.value)}
                      className="w-full text-xs p-2 border border-slate-300 rounded-xl bg-white"
                    >
                      <option value="">-- ऑपरेटर चुनें --</option>
                      {providersList.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.phone} - {p.location})
                        </option>
                      ))}
                    </select>

                    <input
                      type="text"
                      value={assignmentNotes}
                      onChange={(e) => setAssignmentNotes(e.target.value)}
                      placeholder="एडमिन निर्देश / समय"
                      className="w-full text-xs p-2 border border-slate-300 rounded-xl bg-white"
                    />

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateMachineryStatus(bk.id, 'provider_assigned')}
                        className="bg-emerald-600 text-white font-bold text-xs px-3 py-1.5 rounded-xl cursor-pointer"
                      >
                        नियुक्त करें
                      </button>
                      <button
                        onClick={() => setAssignBookingId(null)}
                        className="bg-slate-200 text-slate-700 text-xs px-3 py-1.5 rounded-xl cursor-pointer"
                      >
                        रद्द
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-200">
                    <button
                      onClick={() => setAssignBookingId(bk.id)}
                      className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-xl hover:bg-emerald-200 cursor-pointer"
                    >
                      ऑपरेटर नियुक्त करें
                    </button>
                    <button
                      onClick={() => handleUpdateMachineryStatus(bk.id, 'approved')}
                      className="text-xs bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-xl hover:bg-blue-200 cursor-pointer"
                    >
                      स्वीकृत करें
                    </button>
                    <button
                      onClick={() => handleUpdateMachineryStatus(bk.id, 'work_in_progress')}
                      className="text-xs bg-amber-100 text-amber-800 font-bold px-3 py-1 rounded-xl hover:bg-amber-200 cursor-pointer"
                    >
                      काम चालू
                    </button>
                    <button
                      onClick={() => handleUpdateMachineryStatus(bk.id, 'completed')}
                      className="text-xs bg-emerald-600 text-white font-bold px-3 py-1 rounded-xl hover:bg-emerald-700 cursor-pointer"
                    >
                      सफलतापूर्वक पूर्ण
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Vehicle bookings */}
          {overview.allVehicleBookings.map((vb) => (
            <div key={vb.id} className="bg-white rounded-3xl border border-slate-200 p-4 shadow-xs space-y-2.5">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-black bg-purple-100 text-purple-800 px-2 py-0.5 rounded-md">
                    {vb.referenceId}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">{vb.vehicleType}</h4>
                  <p className="text-xs text-slate-500">
                    ग्राहक: {vb.customerName} ({vb.customerPhone}) • {vb.goodsDescription}
                  </p>
                  <p className="text-xs text-slate-700">रूट: {vb.pickupLocation} ➔ {vb.destination}</p>
                </div>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded-full">
                  {vb.status}
                </span>
              </div>

              <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                <button
                  onClick={() => handleUpdateVehicleStatus(vb.id, 'approved')}
                  className="text-xs bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-xl cursor-pointer"
                >
                  स्वीकृत
                </button>
                <button
                  onClick={() => handleUpdateVehicleStatus(vb.id, 'completed')}
                  className="text-xs bg-emerald-600 text-white font-bold px-3 py-1 rounded-xl cursor-pointer"
                >
                  पूर्ण घोषित करें
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: JOBS & WORKER ASSIGNMENT */}
      {adminTab === 'jobs' && overview && (
        <div className="space-y-3">
          <h3 className="text-sm font-black text-slate-900">
            काम व मजदूर आवंटन प्रणाली ({overview.allJobs.length})
          </h3>

          {overview.allJobs.map((job) => (
            <div key={job.id} className="bg-white rounded-3xl border border-slate-200 p-4 shadow-xs space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                    {job.category}
                  </span>
                  <h4 className="text-sm font-black text-slate-900 mt-1">{job.title}</h4>
                  <p className="text-xs text-slate-500">
                    नियोक्ता: <strong>{job.employerName}</strong> ({job.employerPhone}) • स्थान: {job.location}
                  </p>
                  <p className="text-xs font-bold text-emerald-800 mt-0.5">{job.salary}</p>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  job.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                }`}>
                  {job.status === 'active' ? 'सक्रिय' : 'बंद'}
                </span>
              </div>

              {/* Assign Worker Tool */}
              {assignJobId === job.id ? (
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
                  <label className="block text-xs font-bold text-slate-800">
                    इस काम के लिए योग्य मजदूर साथी चुनें:
                  </label>
                  <select
                    value={selectedWorkerId}
                    onChange={(e) => setSelectedWorkerId(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white font-bold"
                  >
                    <option value="">-- मजदूर चुनें --</option>
                    {workersList.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name} ({w.phone} - {w.location} - कौशल: {w.skills?.join(', ') || 'सामान्य'})
                      </option>
                    ))}
                  </select>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAssignWorker(job.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer"
                    >
                      मजदूर नियुक्त करें
                    </button>
                    <button
                      onClick={() => setAssignJobId(null)}
                      className="bg-slate-200 text-slate-700 text-xs px-3 py-1.5 rounded-xl cursor-pointer"
                    >
                      रद्द करें
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-xs">
                  <button
                    onClick={() => setAssignJobId(job.id)}
                    className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>मजदूर असाइन करें</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleJobVerify(job.id, job.isVerified)}
                      className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
                    >
                      {job.isVerified ? '✓ प्रमाणित' : 'सत्यापित करें'}
                    </button>
                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      className="text-xs font-bold text-red-600 hover:text-red-700 p-1.5 bg-red-50 rounded-xl cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: USERS MODERATION */}
      {adminTab === 'users' && overview && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900">
              सभी पंजीकृत उपयोगकर्ता ({overview.allUsers.length})
            </h3>
          </div>

          {overview.allUsers.map((u) => (
            <div key={u.id} className="bg-white rounded-3xl border border-slate-200 p-4 shadow-xs flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black text-slate-900">{u.name}</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    u.role === 'farmer' ? 'bg-emerald-100 text-emerald-800' :
                    u.role === 'machinery_provider' ? 'bg-purple-100 text-purple-800' :
                    u.role === 'employer' ? 'bg-amber-100 text-amber-800' :
                    u.role === 'admin' ? 'bg-slate-900 text-white' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {u.role === 'farmer' ? 'किसान' :
                     u.role === 'machinery_provider' ? 'मशीनरी ऑपरेटर' :
                     u.role === 'employer' ? 'काम देने वाला' :
                     u.role === 'admin' ? 'ऐप मालिक (Admin)' : 'मजदूर'}
                  </span>
                  {u.isBanned && (
                    <span className="text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded-full">
                      निलंबित
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  <span>+91 {u.phone}</span>
                  <span>• {u.location}</span>
                </p>
              </div>

              {u.role !== 'admin' && (
                <button
                  onClick={() => handleToggleBan(u.id, u.isBanned)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl transition cursor-pointer ${
                    u.isBanned
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  }`}
                >
                  <Ban className="w-3 h-3 inline mr-1" />
                  <span>{u.isBanned ? 'अनबैन' : 'ब्लॉक'}</span>
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* TAB 5: COMPLAINTS & DISPUTE TICKETS */}
      {adminTab === 'complaints' && overview && (
        <div className="space-y-3">
          <h3 className="text-sm font-black text-slate-900">
            उपभोक्ता शिकायतें व विवाद ({overview.allComplaints.length})
          </h3>

          {overview.allComplaints.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-6">कोई खुली शिकायत नहीं है।</p>
          ) : (
            overview.allComplaints.map((ticket) => (
              <div key={ticket.id} className="bg-white rounded-3xl border border-slate-200 p-4 shadow-xs space-y-2.5">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-black bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">
                      ID: {ticket.ticketId}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{ticket.subject}</h4>
                    <p className="text-xs text-slate-500">
                      उपयोगकर्ता: {ticket.userName} ({ticket.userPhone}) • श्रेणी: {ticket.category}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-800">
                    {ticket.status}
                  </span>
                </div>

                <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {ticket.description}
                </p>

                {ticket.adminReply && (
                  <div className="bg-emerald-50 p-2.5 rounded-xl text-xs text-emerald-800">
                    <strong>दर्ज उत्तर:</strong> {ticket.adminReply}
                  </div>
                )}

                {/* Reply section */}
                {selectedTicketId === ticket.id ? (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="उपयोगकर्ता को आधिकारिक समाधान लिखें..."
                      rows={2}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white"
                    />

                    <div className="flex items-center justify-between">
                      <select
                        value={replyStatus}
                        onChange={(e) => setReplyStatus(e.target.value)}
                        className="text-xs p-1.5 border border-slate-300 rounded-lg bg-white"
                      >
                        <option value="resolved">समाधान हुआ (Resolved)</option>
                        <option value="in_progress">जांच जारी (In Progress)</option>
                        <option value="closed">बंद करें (Closed)</option>
                      </select>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleReplyComplaint(ticket.id)}
                          className="bg-emerald-600 text-white font-bold text-xs px-3 py-1.5 rounded-xl cursor-pointer"
                        >
                          जवाब भेजें
                        </button>
                        <button
                          onClick={() => setSelectedTicketId(null)}
                          className="bg-slate-200 text-slate-700 text-xs px-3 py-1.5 rounded-xl cursor-pointer"
                        >
                          रद्द
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedTicketId(ticket.id);
                      setReplyText(ticket.adminReply || '');
                    }}
                    className="text-xs text-emerald-700 font-bold hover:underline cursor-pointer block"
                  >
                    उत्तर लिखें या स्थिति बदलें
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 6: OFFICIAL CONTACT & PLATFORM SETTINGS (SECTION 3 COMPLIANCE) */}
      {adminTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Settings className="w-5 h-5 text-emerald-700" />
              <span>आधिकारिक संपर्क एवं प्लेटफार्म सेटिंग्स</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              यहाँ बदला गया आधिकारिक नंबर सभी उपयोगकर्ताओं को होम, सपोर्ट और बुकिंग पृष्ठों पर दिखेगा।
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                आधिकारिक एडमिन कॉल नंबर *
              </label>
              <input
                type="text"
                value={editOwnerPhone}
                onChange={(e) => setEditOwnerPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                आधिकारिक WhatsApp नंबर *
              </label>
              <input
                type="text"
                value={editOwnerWhatsapp}
                onChange={(e) => setEditOwnerWhatsapp(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                सहायता समय (Support Hours)
              </label>
              <input
                type="text"
                value={editSupportHours}
                onChange={(e) => setEditSupportHours(e.target.value)}
                placeholder="सुबह 8:00 बजे से रात 8:00 बजे तक (प्रतिदिन)"
                className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  प्लेटफॉर्म कमीशन (% दर)
                </label>
                <input
                  type="number"
                  value={editCommission}
                  onChange={(e) => setEditCommission(e.target.value)}
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  न्यूनतम बुकिंग शुल्क (₹)
                </label>
                <input
                  type="number"
                  value={editBookingFee}
                  onChange={(e) => setEditBookingFee(e.target.value)}
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                सुरक्षा सूचना संदेश (Banner)
              </label>
              <textarea
                value={editNotice}
                onChange={(e) => setEditNotice(e.target.value)}
                rows={2}
                className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-2xl shadow-md transition text-xs cursor-pointer"
          >
            आधिकारिक संपर्क व सेटिंग्स सुरक्षित करें
          </button>
        </form>
      )}

      {/* TAB 7: AUDIT LOGS */}
      {adminTab === 'logs' && overview && (
        <div className="space-y-3">
          <h3 className="text-sm font-black text-slate-900">
            प्रशासनिक ऑडिट व गतिविधि लॉग्स ({overview.auditLogs.length})
          </h3>

          <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
            {overview.auditLogs.map((log) => (
              <div key={log.id} className="p-3 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{log.action}</span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(log.timestamp).toLocaleTimeString('hi-IN')}
                  </span>
                </div>
                <p className="text-slate-600">{log.details}</p>
                <span className="text-[10px] text-slate-400 block">कर्ता: {log.adminName}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

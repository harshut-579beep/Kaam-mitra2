import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AdminContactCard } from '../components/AdminContactCard';
import {
  Tractor,
  Truck,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  MapPin,
  Calendar,
  PhoneCall,
  MessageCircle,
  ShieldAlert,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { BookingStatus } from '../types';

export const BookingsView: React.FC = () => {
  const {
    currentUser,
    machineryBookings,
    vehicleBookings,
    applications,
    setActiveTab,
    openAdminPhoneCall,
    openAdminWhatsApp,
    showToast
  } = useApp();

  const [bookingFilter, setBookingFilter] = useState<'all' | 'machinery' | 'vehicle' | 'jobs'>('all');

  const getStatusBadge = (status: BookingStatus | string) => {
    switch (status) {
      case 'request_submitted':
        return (
          <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3 text-blue-600" />
            <span>अनुरोध प्राप्त (Submitted)</span>
          </span>
        );
      case 'pending_admin_review':
        return (
          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>एडमिन समीक्षाधीन</span>
          </span>
        );
      case 'approved':
        return (
          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            <span>स्वीकृत (Approved)</span>
          </span>
        );
      case 'provider_assigned':
        return (
          <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-purple-600" />
            <span>प्रदाता नियुक्त (Assigned)</span>
          </span>
        );
      case 'assignment_accepted':
        return (
          <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-indigo-600" />
            <span>कार्य स्वीकार</span>
          </span>
        );
      case 'work_in_progress':
        return (
          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>काम चालू है (In Progress)</span>
          </span>
        );
      case 'completed':
        return (
          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            <span>पूर्ण (Completed)</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <XCircle className="w-3 h-3 text-red-600" />
            <span>रद्द (Cancelled)</span>
          </span>
        );
      case 'disputed':
        return (
          <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            <span>विवादित (Disputed)</span>
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
            {status}
          </span>
        );
    }
  };

  const totalBookingsCount =
    (machineryBookings?.length || 0) +
    (vehicleBookings?.length || 0) +
    (applications?.length || 0);

  return (
    <div className="pb-28 max-w-xl mx-auto p-4 space-y-4 animate-in fade-in duration-150">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white rounded-3xl p-5 shadow-md flex items-center justify-between">
        <div>
          <span className="text-xs text-amber-300 font-bold block mb-1">
            पारदर्शी ट्रैकिंग प्रणाली
          </span>
          <h2 className="text-xl font-black">मेरी बुकिंग व अनुरोध</h2>
          <p className="text-xs text-emerald-100 mt-0.5">
            सभी कृषि मशीनरी, वाहन ढुलाई और काम के आवेदनों की स्थिति
          </p>
        </div>

        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white font-black text-lg border border-white/20">
          {totalBookingsCount}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-slate-200/80 p-1 rounded-2xl text-xs font-bold">
        <button
          onClick={() => setBookingFilter('all')}
          className={`flex-1 py-2 rounded-xl transition cursor-pointer text-center ${
            bookingFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          सभी ({totalBookingsCount})
        </button>
        <button
          onClick={() => setBookingFilter('machinery')}
          className={`flex-1 py-2 rounded-xl transition cursor-pointer text-center ${
            bookingFilter === 'machinery' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          🚜 ट्रैक्टर ({machineryBookings?.length || 0})
        </button>
        <button
          onClick={() => setBookingFilter('vehicle')}
          className={`flex-1 py-2 rounded-xl transition cursor-pointer text-center ${
            bookingFilter === 'vehicle' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          🚚 वाहन ({vehicleBookings?.length || 0})
        </button>
        <button
          onClick={() => setBookingFilter('jobs')}
          className={`flex-1 py-2 rounded-xl transition cursor-pointer text-center ${
            bookingFilter === 'jobs' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          💼 काम ({applications?.length || 0})
        </button>
      </div>

      {/* If No Bookings */}
      {totalBookingsCount === 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-3">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-700 rounded-3xl flex items-center justify-center mx-auto">
            <Calendar className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-800">अभी तक कोई बुकिंग या अनुरोध नहीं है</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              आप खेत की जुताई के लिए ट्रैक्टर या माल ढुलाई के लिए वाहन बुक कर सकते हैं।
            </p>
          </div>
          <button
            onClick={() => setActiveTab('services')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow cursor-pointer"
          >
            नई सेवा बुक करें
          </button>
        </div>
      )}

      {/* 1. Agricultural Machinery Bookings */}
      {(bookingFilter === 'all' || bookingFilter === 'machinery') && machineryBookings?.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5 px-1">
            <Tractor className="w-4 h-4 text-emerald-700" />
            <span>कृषि मशीनरी एवं ट्रैक्टर बुकिंग्स</span>
          </h3>

          {machineryBookings.map((bk) => (
            <div
              key={bk.id}
              className="bg-white rounded-3xl border border-slate-200 p-4 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div>
                  <span className="text-[11px] font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                    ID: {bk.referenceId}
                  </span>
                  <h4 className="text-sm font-black text-slate-900 mt-1">{bk.serviceType}</h4>
                  <p className="text-xs text-slate-500">उपकरण: {bk.implementRequired} • {bk.farmAreaAcres}</p>
                </div>
                {getStatusBadge(bk.status)}
              </div>

              {/* Booking Details */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px]">तारीख व समय:</span>
                  <span className="font-bold text-slate-800">{bk.bookingDate} ({bk.bookingTime})</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">अपेक्षित बजट:</span>
                  <span className="font-bold text-emerald-800">{bk.budget}</span>
                </div>
                <div className="col-span-2 flex items-center gap-1 text-slate-600 pt-1 border-t border-slate-200/50">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span className="truncate">{bk.villageFarmLocation}</span>
                </div>
              </div>

              {/* Assignment Information */}
              <div className="bg-emerald-50/70 p-2.5 rounded-xl text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-800 font-bold">नियुक्त मशीनरी प्रदाता:</span>
                  <span className="font-bold text-slate-900">
                    {bk.assignedProviderName || 'एडमिन समीक्षा जारी है'}
                  </span>
                </div>
                {bk.adminNotes && (
                  <p className="text-[11px] text-emerald-700 italic border-t border-emerald-200/60 pt-1">
                    टिप्पणी: {bk.adminNotes}
                  </p>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => {
                    setActiveTab('support');
                    showToast(`संदर्भ संख्या ${bk.referenceId} के लिए शिकायत टिकट खोल रहे हैं...`, 'info');
                  }}
                  className="text-xs text-slate-500 hover:text-red-600 font-bold hover:underline cursor-pointer"
                >
                  रद्द करें / शिकायत करें
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={openAdminPhoneCall}
                    className="p-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    title="एडमिन से पूछें"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>एडमिन कॉल</span>
                  </button>
                  <button
                    onClick={openAdminWhatsApp}
                    className="p-2 bg-green-100 hover:bg-green-200 text-green-800 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    title="WhatsApp"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. Vehicle Transport Bookings */}
      {(bookingFilter === 'all' || bookingFilter === 'vehicle') && vehicleBookings?.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5 px-1">
            <Truck className="w-4 h-4 text-emerald-700" />
            <span>वाहन व माल ढुलाई बुकिंग्स</span>
          </h3>

          {vehicleBookings.map((vb) => (
            <div
              key={vb.id}
              className="bg-white rounded-3xl border border-slate-200 p-4 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div>
                  <span className="text-[11px] font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                    ID: {vb.referenceId}
                  </span>
                  <h4 className="text-sm font-black text-slate-900 mt-1">{vb.vehicleType}</h4>
                  <p className="text-xs text-slate-500">{vb.goodsDescription}</p>
                </div>
                {getStatusBadge(vb.status)}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px]">पिकअप स्थान:</span>
                  <span className="font-bold text-slate-800 truncate block">{vb.pickupLocation}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">गंतव्य स्थान:</span>
                  <span className="font-bold text-slate-800 truncate block">{vb.destination}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">तारीख व समय:</span>
                  <span className="font-bold text-slate-800">{vb.bookingDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">भाड़ा:</span>
                  <span className="font-bold text-emerald-800">{vb.budget}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-400">
                  ऑपरेटर: <strong>{vb.assignedProviderName || 'प्रदाता आवंटन जारी'}</strong>
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={openAdminPhoneCall}
                    className="p-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>कॉल</span>
                  </button>
                  <button
                    onClick={openAdminWhatsApp}
                    className="p-2 bg-green-100 hover:bg-green-200 text-green-800 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. Job Applications */}
      {(bookingFilter === 'all' || bookingFilter === 'jobs') && applications?.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5 px-1">
            <FileText className="w-4 h-4 text-emerald-700" />
            <span>काम व रोजगार आवेदन</span>
          </h3>

          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-3xl border border-slate-200 p-4 shadow-xs space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {app.assignedByAdmin ? 'एडमिन द्वारा आवंटित' : 'आवेदन प्राप्त'}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">{app.jobTitle}</h4>
                  <p className="text-xs text-slate-500">आवेदक: <strong>{app.workerName}</strong> • {app.workerLocation}</p>
                </div>
                {getStatusBadge(app.status)}
              </div>

              {app.note && (
                <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-xl italic">
                  "{app.note}"
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Permanent Admin Contact Card (Section 3 Requirement) */}
      <AdminContactCard
        title="बुकिंग की स्थिति व बदलाव के लिए एडमिन से संपर्क"
      />

    </div>
  );
};

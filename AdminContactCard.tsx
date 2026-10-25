import React from 'react';
import { useApp } from '../context/AppContext';
import {
  PhoneCall,
  MessageCircle,
  Headphones,
  ShieldCheck,
  Clock,
  ExternalLink
} from 'lucide-react';

interface AdminContactCardProps {
  compact?: boolean;
  title?: string;
}

export const AdminContactCard: React.FC<AdminContactCardProps> = ({
  compact = false,
  title = 'एडमिन सहायता केंद्र (Kaam Mitra Official Support)'
}) => {
  const { settings, openAdminPhoneCall, openAdminWhatsApp, setActiveTab } = useApp();

  const phoneDisplay = settings?.ownerPhone || '+91 9876543210';
  const whatsappDisplay = settings?.ownerWhatsapp || phoneDisplay;
  const supportHours = settings?.supportHours || 'सुबह 8:00 से रात 8:00 बजे तक (प्रतिदिन)';

  if (compact) {
    return (
      <div className="bg-emerald-900 text-white rounded-2xl p-3 border border-emerald-700/60 shadow-sm flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-300 font-bold">
            <Headphones className="w-3.5 h-3.5" />
            <span>एडमिन हेल्पलाइन</span>
          </div>
          <p className="text-sm font-black text-white truncate mt-0.5">{phoneDisplay}</p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={openAdminPhoneCall}
            className="p-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-xs"
            title="कॉल करें"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>कॉल</span>
          </button>
          <button
            onClick={openAdminWhatsApp}
            className="p-2 bg-green-500 hover:bg-green-600 active:scale-95 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-xs"
            title="व्हाट्सएप"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-900 text-white rounded-3xl p-4 sm:p-5 shadow-md border border-emerald-600/50 space-y-3.5 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute -right-12 -bottom-12 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex items-start justify-between gap-2 relative z-10">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-emerald-900/80 text-amber-300 px-2.5 py-0.5 rounded-full text-[11px] font-bold border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>काम मित्र आधिकारिक समन्वयक</span>
          </div>
          <h3 className="text-base sm:text-lg font-black mt-1 text-white leading-tight">
            {title}
          </h3>
          <p className="text-xs text-emerald-100 mt-0.5 leading-relaxed">
            काम ढूंढने, मजदूर प्राप्त करने, ट्रैक्टर बुकिंग और भुगतान विवाद में सीधा एडमिन से सहयोग लें।
          </p>
        </div>
      </div>

      {/* Official Contact Info Box */}
      <div className="bg-white/10 rounded-2xl p-3 border border-white/15 backdrop-blur-xs space-y-2 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs">
          <div>
            <span className="text-emerald-200 block text-[11px]">अधिकृत सहायता नंबर:</span>
            <span className="text-lg font-black tracking-wide text-white">{phoneDisplay}</span>
          </div>
          <div className="text-[11px] text-emerald-200 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-300" />
            <span>{supportHours}</span>
          </div>
        </div>

        {settings?.noticeBanner && (
          <p className="text-[11px] text-emerald-100/90 pt-1 border-t border-white/10 leading-normal">
            {settings.noticeBanner}
          </p>
        )}
      </div>

      {/* Action Buttons: Call, WhatsApp, Support Ticket */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-0.5 relative z-10">
        <button
          onClick={openAdminPhoneCall}
          className="bg-amber-400 hover:bg-amber-500 active:scale-95 text-slate-900 font-bold py-2.5 px-3 rounded-2xl shadow transition flex items-center justify-center gap-1.5 text-xs cursor-pointer"
        >
          <PhoneCall className="w-4 h-4 text-slate-900" />
          <span>एडमिन को कॉल करें</span>
        </button>

        <button
          onClick={openAdminWhatsApp}
          className="bg-green-500 hover:bg-green-600 active:scale-95 text-white font-bold py-2.5 px-3 rounded-2xl shadow transition flex items-center justify-center gap-1.5 text-xs cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 text-white" />
          <span>WhatsApp पर संपर्क</span>
        </button>

        <button
          onClick={() => setActiveTab('support')}
          className="bg-white/15 hover:bg-white/25 active:scale-95 text-white font-bold py-2.5 px-3 rounded-2xl border border-white/20 shadow-xs transition flex items-center justify-center gap-1.5 text-xs cursor-pointer"
        >
          <Headphones className="w-4 h-4 text-amber-300" />
          <span>सहायता एवं शिकायत</span>
        </button>
      </div>
    </div>
  );
};

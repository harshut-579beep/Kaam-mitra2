import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AdminContactCard } from '../components/AdminContactCard';
import {
  Headphones,
  AlertTriangle,
  Send,
  CheckCircle,
  Clock,
  ShieldCheck,
  FileQuestion,
  UserX,
  CreditCard,
  Ban,
  MessageSquare
} from 'lucide-react';

export const SupportView: React.FC = () => {
  const {
    currentUser,
    complaints,
    submitComplaint,
    showToast,
    setActiveTab,
    settings
  } = useApp();

  const [category, setCategory] = useState<'fake_job' | 'suspicious_user' | 'booking_issue' | 'cancellation' | 'payment_inquiry' | 'general_complaint'>('booking_issue');
  const [relatedRefId, setRelatedRefId] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      showToast('शिकायत दर्ज करने के लिए कृपया पहले लॉगिन करें।', 'error');
      setActiveTab('profile');
      return;
    }
    if (!subject.trim() || !description.trim()) {
      showToast('कृपया विषय और विवरण पूरा भरें।', 'error');
      return;
    }

    setSubmitting(true);
    const ticketId = await submitComplaint({
      category,
      relatedReferenceId: relatedRefId,
      subject: subject.trim(),
      description: description.trim()
    });
    setSubmitting(false);

    if (ticketId) {
      setSubject('');
      setDescription('');
      setRelatedRefId('');
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'fake_job':
        return 'फर्जी काम की रिपोर्ट (Fake Job)';
      case 'suspicious_user':
        return 'संदिग्ध यूजर की रिपोर्ट (Suspicious User)';
      case 'booking_issue':
        return 'मशीनरी या वाहन बुकिंग पूछताछ';
      case 'cancellation':
        return 'रद्दीकरण अनुरोध (Cancellation)';
      case 'payment_inquiry':
        return 'भुगतान या कमीशन संबंधी प्रश्न';
      default:
        return 'सामान्य शिकायत व सुझाव';
    }
  };

  return (
    <div className="pb-28 max-w-xl mx-auto p-4 space-y-4 animate-in fade-in duration-150">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white rounded-3xl p-5 shadow-md space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-emerald-900/80 text-amber-300 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/30">
          <Headphones className="w-4 h-4" />
          <span>काम मित्र उपभोक्ता सहायता एवं विवाद निवारण</span>
        </div>
        <h2 className="text-xl font-black leading-tight">
          सहायता, शिकायत एवं पूछताछ केंद्र
        </h2>
        <p className="text-xs text-emerald-100 leading-relaxed">
          किसी भी प्रकार की समस्या, फर्जी काम की रिपोर्ट, बुकिंग में बदलाव या भुगतान संबंधी सहायता हेतु टिकट दर्ज करें।
        </p>
      </div>

      {/* Official Admin Contact Card (Section 3 Requirement) */}
      <AdminContactCard
        title="तुरंत सहायता हेतु आधिकारिक एडमिन हेल्पलाइन"
      />

      {/* Complaint / Ticket Submission Form */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="border-b border-slate-100 pb-2">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span>नई शिकायत या सहायता टिकट दर्ज करें</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            आपकी समस्या सीधे ऐप मालिक / मुख्य एडमिन के नियंत्रण कक्ष में पहुंचेगी।
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              शिकायत या प्रश्न का प्रकार चुनें *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full text-xs p-3 border border-slate-300 rounded-xl bg-slate-50 focus:ring-2 focus:ring-emerald-500 font-bold"
              required
            >
              <option value="booking_issue">🚜 मशीनरी या वाहन बुकिंग पूछताछ / देरी</option>
              <option value="cancellation">❌ बुकिंग रद्दीकरण अनुरोध (Cancellation)</option>
              <option value="fake_job">⚠️ फर्जी काम / गलत मजदूरी की रिपोर्ट</option>
              <option value="suspicious_user">🚫 संदिग्ध यूजर या दुर्व्यवहार की रिपोर्ट</option>
              <option value="payment_inquiry">💰 भुगतान, मजदूरी या कमीशन संबंधी प्रश्न</option>
              <option value="general_complaint">📝 अन्य सामान्य सहायता या शिकायत</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              संबंधित बुकिंग या जॉब संदर्भ ID (वैकल्पिक)
            </label>
            <input
              type="text"
              value={relatedRefId}
              onChange={(e) => setRelatedRefId(e.target.value)}
              placeholder="उदा: KM-MBK-1001 या KM-VBK-2001"
              className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              विषय (शीर्षक) *
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="उदा: जुताई का समय 2 घंटे आगे बढ़ाना है..."
              className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              पूरा विवरण व समस्या *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="कृपया समस्या के बारे में विस्तार से लिखें ताकि एडमिन आपकी सहायता कर सकें..."
              rows={3}
              className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-black py-3.5 rounded-2xl shadow-md transition text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? 'टिकट दर्ज हो रहा है...' : 'सहायता टिकट भेजें'}</span>
          </button>
        </form>
      </div>

      {/* User's Previous Support Tickets */}
      <div className="space-y-3">
        <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5 px-1">
          <MessageSquare className="w-4 h-4 text-emerald-700" />
          <span>मेरी दर्ज की गई शिकायतें एवं टिकट ({complaints?.length || 0})</span>
        </h3>

        {complaints?.length === 0 ? (
          <div className="p-6 bg-white rounded-3xl border border-slate-200 text-center text-slate-500 space-y-1">
            <p className="text-sm font-bold text-slate-700">कोई सक्रिय शिकायत टिकट नहीं है</p>
            <p className="text-xs">यदि कोई समस्या हो तो ऊपर दिए गए फॉर्म से टिकट बनाएं।</p>
          </div>
        ) : (
          complaints.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white rounded-3xl border border-slate-200 p-4 shadow-xs space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2">
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-lg border border-emerald-200">
                      टिकट ID: {ticket.ticketId}
                    </span>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                      {getCategoryLabel(ticket.category)}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">{ticket.subject}</h4>
                </div>

                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                  ticket.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' :
                  ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-800 animate-pulse' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {ticket.status === 'resolved' ? '✓ समाधान हो चुका' :
                   ticket.status === 'in_progress' ? 'कार्रवाई जारी' : 'खुला (Open)'}
                </span>
              </div>

              <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                {ticket.description}
              </p>

              {/* Admin reply if available */}
              {ticket.adminReply ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs space-y-1">
                  <span className="font-bold text-emerald-900 block flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                    <span>एडमिन का जवाब:</span>
                  </span>
                  <p className="text-emerald-800">{ticket.adminReply}</p>
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 italic">
                  एडमिन द्वारा जांच की जा रही है। जल्द ही समाधान दर्ज किया जाएगा।
                </p>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
};

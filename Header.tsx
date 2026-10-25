import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Database,
  Smartphone,
  ShieldCheck,
  UserCheck,
  Briefcase,
  Tractor,
  Truck,
  PhoneCall,
  MessageCircle,
  Headphones
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentUser,
    switchDemoRole,
    activeTab,
    setActiveTab,
    setShowBackendInfoModal,
    isMobileDeviceFrame,
    setIsMobileDeviceFrame,
    settings,
    openAdminPhoneCall,
    openAdminWhatsApp
  } = useApp();

  const ownerPhone = settings?.ownerPhone || '+91 9876543210';

  return (
    <header className="bg-emerald-700 text-white shadow-md sticky top-0 z-30">
      {/* Top utility bar: Official Admin Help & Tools */}
      <div className="bg-emerald-800 px-3 py-1.5 text-xs flex items-center justify-between border-b border-emerald-600/40">
        <div className="flex items-center gap-2 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="hidden sm:inline">आधिकारिक सहायता:</span>
          <span className="font-bold text-amber-300">{ownerPhone}</span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Quick Call to Admin */}
          <button
            onClick={openAdminPhoneCall}
            className="flex items-center gap-1 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer shadow-xs"
            title="एडमिन को कॉल करें"
          >
            <PhoneCall className="w-3 h-3 text-slate-900" />
            <span>कॉल</span>
          </button>

          {/* Quick WhatsApp to Admin */}
          <button
            onClick={openAdminWhatsApp}
            className="flex items-center gap-1 bg-green-500 hover:bg-green-400 text-white font-bold px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer shadow-xs"
            title="WhatsApp एडमिन"
          >
            <MessageCircle className="w-3 h-3" />
            <span className="hidden xs:inline">WhatsApp</span>
          </button>

          {/* Backend Info in Hindi */}
          <button
            onClick={() => setShowBackendInfoModal(true)}
            className="flex items-center gap-1 bg-emerald-900/70 hover:bg-emerald-900 px-2 py-0.5 rounded text-[11px] text-emerald-100 transition-colors cursor-pointer"
            title="डेटाबेस व APK विवरण"
          >
            <Database className="w-3 h-3 text-emerald-300" />
            <span className="hidden sm:inline">APK व गाइड</span>
          </button>

          {/* Toggle Mobile Phone frame for desktop testing */}
          <button
            onClick={() => setIsMobileDeviceFrame(!isMobileDeviceFrame)}
            className="hidden md:flex items-center gap-1 bg-emerald-900/70 hover:bg-emerald-900 px-2 py-0.5 rounded text-[11px] text-emerald-100 transition-colors cursor-pointer"
            title="मोबाइल स्क्रीन व्यू बदलें"
          >
            <Smartphone className="w-3 h-3 text-emerald-300" />
            <span>{isMobileDeviceFrame ? 'फुल' : 'मोबाइल'}</span>
          </button>
        </div>
      </div>

      {/* Main branding & active user profile badge */}
      <div className="px-4 py-2.5 flex items-center justify-between">
        <div
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={() => setActiveTab('home')}
        >
          <div className="w-10 h-10 rounded-2xl bg-white text-emerald-800 flex items-center justify-center font-black text-xl shadow-inner border border-emerald-200">
            <span>KM</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-black tracking-tight leading-none">काम मित्र</h1>
              <span className="bg-emerald-900/80 text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded text-emerald-200">
                Kaam Mitra
              </span>
            </div>
            <p className="text-[11px] text-emerald-100 leading-tight mt-0.5">
              रोजगार • ट्रैक्टर व कृषि मशीनरी • वाहन ढुलाई
            </p>
          </div>
        </div>

        {/* User Badge / Quick Tab Jump */}
        <div className="flex items-center gap-2">
          {currentUser ? (
            <button
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-2 bg-emerald-800/90 hover:bg-emerald-800 px-2.5 py-1.5 rounded-xl border border-emerald-600/60 transition text-left cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs shadow">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden sm:block leading-tight">
                <div className="text-xs font-bold text-white truncate max-w-[110px]">
                  {currentUser.name.split(' ')[0]}
                </div>
                <div className="text-[10px] text-amber-300 font-bold">
                  {currentUser.role === 'farmer' ? 'किसान' :
                   currentUser.role === 'machinery_provider' ? 'मशीनरी ऑपरेटर' :
                   currentUser.role === 'employer' ? 'काम देने वाला' :
                   currentUser.role === 'admin' ? 'व्यवस्थापक (Admin)' : 'मजदूर'}
                </div>
              </div>
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('profile')}
              className="bg-amber-400 hover:bg-amber-500 text-slate-900 text-xs font-black px-3.5 py-1.5 rounded-xl shadow transition cursor-pointer"
            >
              लॉगिन / रजिस्टर
            </button>
          )}
        </div>
      </div>

      {/* Role Switcher Bar - 5 Accounts (Farmer, Worker, Employer, Provider, Admin) */}
      <div className="bg-emerald-900/95 px-3 py-1.5 flex items-center text-xs overflow-x-auto no-scrollbar gap-2 border-t border-emerald-600/30">
        <span className="text-[11px] text-emerald-300 font-bold whitespace-nowrap">
          खाता बदलें:
        </span>
        <div className="flex items-center gap-1.5">
          {/* 1. Farmer */}
          <button
            onClick={() => switchDemoRole('farmer')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              currentUser?.role === 'farmer'
                ? 'bg-amber-400 text-slate-900 shadow-sm'
                : 'bg-emerald-800/80 text-emerald-100 hover:bg-emerald-700'
            }`}
          >
            <span>🌾 किसान (बलविंदर)</span>
          </button>

          {/* 2. Worker */}
          <button
            onClick={() => switchDemoRole('worker')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              currentUser?.role === 'worker'
                ? 'bg-amber-400 text-slate-900 shadow-sm'
                : 'bg-emerald-800/80 text-emerald-100 hover:bg-emerald-700'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>👷 मजदूर (सुरेश)</span>
          </button>

          {/* 3. Employer */}
          <button
            onClick={() => switchDemoRole('employer')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              currentUser?.role === 'employer'
                ? 'bg-amber-400 text-slate-900 shadow-sm'
                : 'bg-emerald-800/80 text-emerald-100 hover:bg-emerald-700'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>💼 काम देने वाला (रामेश)</span>
          </button>

          {/* 4. Machinery Provider */}
          <button
            onClick={() => switchDemoRole('machinery_provider')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              currentUser?.role === 'machinery_provider'
                ? 'bg-amber-400 text-slate-900 shadow-sm'
                : 'bg-emerald-800/80 text-emerald-100 hover:bg-emerald-700'
            }`}
          >
            <Tractor className="w-3.5 h-3.5" />
            <span>🚜 ऑपरेटर (गुरमीत)</span>
          </button>

          {/* 5. Admin */}
          <button
            onClick={() => switchDemoRole('admin')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              currentUser?.role === 'admin'
                ? 'bg-amber-400 text-slate-900 shadow-sm'
                : 'bg-emerald-800/80 text-emerald-100 hover:bg-emerald-700'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
            <span>🛡️ एडमिन (Admin)</span>
          </button>
        </div>
      </div>
    </header>
  );
};

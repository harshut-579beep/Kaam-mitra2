import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Database,
  Smartphone,
  ShieldCheck,
  UserCheck,
  Briefcase,
  Tractor,
  PhoneCall,
  MessageCircle,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentUser,
    switchDemoRole,
    setActiveTab,
    setShowBackendInfoModal,
    isMobileDeviceFrame,
    setIsMobileDeviceFrame,
    settings,
    openAdminPhoneCall,
    openAdminWhatsApp,
  } = useApp();

  const ownerPhone = settings?.ownerPhone || '+91 9876543210';

  return (
    <header className="sticky top-0 z-30 bg-emerald-700 text-white shadow-md">
      <div className="flex items-center justify-between gap-2 border-b border-emerald-600/40 bg-emerald-800 px-3 py-1.5 text-xs">
        <div className="flex items-center gap-2 font-medium">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          <span className="hidden sm:inline">आधिकारिक सहायता:</span>
          <span className="font-bold text-amber-300">{ownerPhone}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={openAdminPhoneCall}
            className="flex cursor-pointer items-center gap-1 rounded bg-amber-400 px-2 py-0.5 text-[11px] font-bold text-slate-900"
            title="एडमिन को कॉल करें"
          >
            <PhoneCall className="h-3 w-3" />
            <span>कॉल</span>
          </button>

          <button
            onClick={openAdminWhatsApp}
            className="flex cursor-pointer items-center gap-1 rounded bg-green-500 px-2 py-0.5 text-[11px] font-bold text-white"
            title="WhatsApp एडमिन"
          >
            <MessageCircle className="h-3 w-3" />
            <span>WhatsApp</span>
          </button>

          <button
            onClick={() => setShowBackendInfoModal(true)}
            className="flex cursor-pointer items-center gap-1 rounded bg-emerald-900/70 px-2 py-0.5 text-[11px] text-emerald-100"
            title="डेटाबेस व APK विवरण"
          >
            <Database className="h-3 w-3 text-emerald-300" />
            <span className="hidden sm:inline">APK व गाइड</span>
          </button>

          <button
            onClick={() => setIsMobileDeviceFrame(!isMobileDeviceFrame)}
            className="hidden items-center gap-1 rounded bg-emerald-900/70 px-2 py-0.5 text-[11px] text-emerald-100 md:flex"
            title="मोबाइल स्क्रीन व्यू बदलें"
          >
            <Smartphone className="h-3 w-3 text-emerald-300" />
            <span>{isMobileDeviceFrame ? 'फुल' : 'मोबाइल'}</span>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-2.5">
        <button
          className="flex cursor-pointer items-center gap-2.5 text-left"
          onClick={() => setActiveTab('home')}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-200 bg-white text-xl font-black text-emerald-800 shadow-inner">
            KM
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-black leading-none tracking-tight">
                काम मित्र
              </h1>
              <span className="rounded bg-emerald-900/80 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-200">
                Kaam Mitra
              </span>
            </div>

            <p className="mt-0.5 text-[11px] leading-tight text-emerald-100">
              रोजगार • ट्रैक्टर व कृषि मशीनरी • वाहन ढुलाई
            </p>
          </div>
        </button>

        <div className="flex items-center gap-2">
          {currentUser ? (
            <button
              onClick={() => setActiveTab('profile')}
              className="flex cursor-pointer items-center gap-2 rounded-xl border border-emerald-600/60 bg-emerald-800/90 px-2.5 py-1.5 text-left transition hover:bg-emerald-800"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800">
                {currentUser.name.charAt(0)}
              </div>

              <div className="hidden leading-tight sm:block">
                <div className="max-w-[110px] truncate text-xs font-bold text-white">
                  {currentUser.name.split(' ')[0]}
                </div>
                <div className="text-[10px] font-bold text-amber-300">
                  {currentUser.role === 'farmer'
                    ? 'किसान'
                    : currentUser.role === 'machinery_provider'
                      ? 'मशीनरी ऑपरेटर'
                      : currentUser.role === 'employer'
                        ? 'काम देने वाला'
                        : currentUser.role === 'admin'
                          ? 'व्यवस्थापक (Admin)'
                          : 'मजदूर'}
                </div>
              </div>
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('profile')}
              className="cursor-pointer rounded-xl bg-amber-400 px-3.5 py-1.5 text-xs font-black text-slate-900 transition hover:bg-amber-500"
            >
              लॉगिन / रजिस्टर
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto border-t border-emerald-600/30 bg-emerald-900/95 px-3 py-1.5 text-xs">
        <span className="whitespace-nowrap text-[11px] font-bold text-emerald-300">
          खाता बदलें:
        </span>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => switchDemoRole('farmer')}
            className={`flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ${
              currentUser?.role === 'farmer'
                ? 'bg-amber-400 text-slate-900'
                : 'bg-emerald-800/80 text-emerald-100 hover:bg-emerald-700'
            }`}
          >
            🌾 किसान (बलविंदर)
          </button>

          <button
            onClick={() => switchDemoRole('worker')}
            className={`flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ${
              currentUser?.role === 'worker'
                ? 'bg-amber-400 text-slate-900'
                : 'bg-emerald-800/80 text-emerald-100 hover:bg-emerald-700'
            }`}
          >
            <UserCheck className="h-3.5 w-3.5" />
            👷 मजदूर (सुरेश)
          </button>

          <button
            onClick={() => switchDemoRole('employer')}
            className={`flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ${
              currentUser?.role === 'employer'
                ? 'bg-amber-400 text-slate-900'
                : 'bg-emerald-800/80 text-emerald-100 hover:bg-emerald-700'
            }`}
          >
            <Briefcase className="h-3.5 w-3.5" />
            💼 काम देने वाला (रामेश)
          </button>

          <button
            onClick={() => switchDemoRole('machinery_provider')}
            className={`flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ${
              currentUser?.role === 'machinery_provider'
                ? 'bg-amber-400 text-slate-900'
                : 'bg-emerald-800/80 text-emerald-100 hover:bg-emerald-700'
            }`}
          >
            <Tractor className="h-3.5 w-3.5" />
            🚜 ऑपरेटर (गुरमीत)
          </button>

          <button
            onClick={() => switchDemoRole('admin')}
            className={`flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ${
              currentUser?.role === 'admin'
                ? 'bg-amber-400 text-slate-900'
                : 'bg-emerald-800/80 text-emerald-100 hover:bg-emerald-700'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5 text-amber-300" />
            🛡️ एडमिन
          </button>
        </div>
      </div>
    </header>
  );
};

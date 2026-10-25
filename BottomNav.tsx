import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Home,
  Briefcase,
  Tractor,
  CalendarCheck,
  User,
  ShieldCheck,
  Headphones
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, currentUser, applications, machineryBookings, vehicleBookings } = useApp();

  const totalActiveBookings =
    (applications?.length || 0) +
    (machineryBookings?.length || 0) +
    (vehicleBookings?.length || 0);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200/90 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] max-w-md mx-auto md:max-w-none">
      <div className="flex items-center justify-around px-1 py-1">
        {/* 1. Home */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition cursor-pointer ${
            activeTab === 'home'
              ? 'text-emerald-700 font-black'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.5px] scale-110 text-emerald-700' : ''} transition-transform`} />
          <span className="text-[11px] mt-1 font-bold leading-none">होम</span>
        </button>

        {/* 2. Jobs */}
        <button
          onClick={() => setActiveTab('jobs')}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition cursor-pointer ${
            activeTab === 'jobs'
              ? 'text-emerald-700 font-black'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Briefcase className={`w-5 h-5 ${activeTab === 'jobs' ? 'stroke-[2.5px] scale-110 text-emerald-700' : ''} transition-transform`} />
          <span className="text-[11px] mt-1 font-bold leading-none">काम खोजें</span>
        </button>

        {/* 3. Services: Tractor, Agricultural Machinery & Vehicles */}
        <button
          onClick={() => setActiveTab('services')}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition cursor-pointer ${
            activeTab === 'services'
              ? 'text-emerald-700 font-black'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <Tractor className={`w-5 h-5 ${activeTab === 'services' ? 'stroke-[2.5px] scale-110 text-emerald-700' : ''} transition-transform`} />
            <span className="absolute -top-1 -right-2 bg-amber-500 text-slate-900 text-[8px] font-black px-1 rounded-full">
              कृषि
            </span>
          </div>
          <span className="text-[11px] mt-1 font-bold leading-none">सेवाएं</span>
        </button>

        {/* 4. My Bookings / Requests */}
        <button
          onClick={() => setActiveTab('bookings')}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition relative cursor-pointer ${
            activeTab === 'bookings'
              ? 'text-emerald-700 font-black'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <CalendarCheck className={`w-5 h-5 ${activeTab === 'bookings' ? 'stroke-[2.5px] scale-110 text-emerald-700' : ''} transition-transform`} />
            {totalActiveBookings > 0 && (
              <span className="absolute -top-1 -right-2 bg-emerald-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-white">
                {totalActiveBookings}
              </span>
            )}
          </div>
          <span className="text-[11px] mt-1 font-bold leading-none">मेरी बुकिंग</span>
        </button>

        {/* 5. Profile or Admin */}
        {currentUser?.role === 'admin' ? (
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition cursor-pointer ${
              activeTab === 'admin'
                ? 'text-amber-700 font-black'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className={`w-5 h-5 ${activeTab === 'admin' ? 'stroke-[2.5px] scale-110 text-amber-600' : ''} transition-transform`} />
            <span className="text-[11px] mt-1 font-bold leading-none">एडमिन</span>
          </button>
        ) : (
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition cursor-pointer ${
              activeTab === 'profile'
                ? 'text-emerald-700 font-black'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className={`w-5 h-5 ${activeTab === 'profile' ? 'stroke-[2.5px] scale-110 text-emerald-700' : ''} transition-transform`} />
            <span className="text-[11px] mt-1 font-bold leading-none">प्रोफाइल</span>
          </button>
        )}
      </div>
    </nav>
  );
};

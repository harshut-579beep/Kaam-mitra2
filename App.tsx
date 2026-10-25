import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { JobDetailModal } from './components/JobDetailModal';
import { ApplyModal } from './components/ApplyModal';
import { BackendInfoModal } from './components/BackendInfoModal';
import { HomeView } from './views/HomeView';
import { JobsView } from './views/JobsView';
import { ServicesView } from './views/ServicesView';
import { PostJobView } from './views/PostJobView';
import { BookingsView } from './views/BookingsView';
import { SupportView } from './views/SupportView';
import { ProfileView } from './views/ProfileView';
import { AdminView } from './views/AdminView';
import { CheckCircle2, AlertCircle, Info, Wifi, Battery, Signal } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, toastMessage, isMobileDeviceFrame } = useApp();

  return (
    <div className={`min-h-screen bg-slate-900 ${isMobileDeviceFrame ? 'py-4 px-2 flex justify-center items-center' : ''}`}>
      
      {/* Device frame container: If mobile frame toggle is ON, show Android smartphone bezel */}
      <div className={`w-full bg-slate-100 flex flex-col relative transition-all duration-200 ${
        isMobileDeviceFrame
          ? 'max-w-[420px] h-[860px] rounded-[3rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] border-[10px] border-slate-800 overflow-hidden ring-1 ring-slate-700/50'
          : 'max-w-2xl mx-auto shadow-xl min-h-screen'
      }`}>
        
        {/* Android Status Bar (Only in Mobile Frame) */}
        {isMobileDeviceFrame && (
          <div className="bg-emerald-800 text-emerald-100 px-6 py-2 text-[11px] font-semibold flex items-center justify-between select-none shrink-0">
            <span>09:41</span>
            <div className="w-16 h-3 bg-slate-900 rounded-full mx-auto -mt-0.5"></div>
            <div className="flex items-center gap-1.5">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>
        )}

        {/* Global Header */}
        <Header />

        {/* Dynamic View Body */}
        <main className="flex-1 overflow-y-auto no-scrollbar">
          {activeTab === 'home' && <HomeView />}
          {activeTab === 'jobs' && <JobsView />}
          {activeTab === 'services' && <ServicesView />}
          {activeTab === 'post' && <PostJobView />}
          {activeTab === 'bookings' && <BookingsView />}
          {activeTab === 'support' && <SupportView />}
          {activeTab === 'profile' && <ProfileView />}
          {activeTab === 'admin' && <AdminView />}
        </main>

        {/* Bottom Navigation */}
        <BottomNav />

        {/* Modals & Dialogs */}
        <JobDetailModal />
        <ApplyModal />
        <BackendInfoModal />

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[90%] pointer-events-none animate-in fade-in slide-in-from-top-4 duration-150">
            <div className={`p-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold text-white ${
              toastMessage.type === 'error'
                ? 'bg-rose-600'
                : toastMessage.type === 'info'
                ? 'bg-slate-900'
                : 'bg-emerald-700'
            }`}>
              {toastMessage.type === 'error' ? (
                <AlertCircle className="w-4 h-4 shrink-0 text-white" />
              ) : toastMessage.type === 'info' ? (
                <Info className="w-4 h-4 shrink-0 text-amber-400" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />
              )}
              <span className="leading-snug">{toastMessage.text}</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

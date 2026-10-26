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

import {
CheckCircle2,
AlertCircle,
Info,
} from 'lucide-react';

const AppContent: React.FC = () => {
const { activeTab, toastMessage } = useApp();

return (
<div className="min-h-screen w-full bg-slate-100 text-slate-900 antialiased">

  {/* Main App Container */}
  <div className="relative mx-auto flex min-h-screen w-full max-w-2xl flex-col overflow-x-hidden bg-white shadow-sm">

    {/* Global Header */}
    <Header />

    {/* Main Content */}
    <main className="relative flex-1 overflow-x-hidden overflow-y-auto pb-2">

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

    {/* Modals */}
    <JobDetailModal />

    <ApplyModal />

    <BackendInfoModal />

    {/* Toast Notification */}
    {toastMessage && (
      <div className="pointer-events-none fixed left-1/2 top-4 z-[100] w-[calc(100%-32px)] max-w-sm -translate-x-1/2">

        <div
          role="status"
          className={`flex items-center gap-3 rounded-2xl p-4 text-sm font-semibold text-white shadow-2xl ${
            toastMessage.type === 'error'
              ? 'bg-rose-600'
              : toastMessage.type === 'info'
              ? 'bg-slate-800'
              : 'bg-emerald-700'
          }`}
        >

          {toastMessage.type === 'error' ? (
            <AlertCircle className="h-5 w-5 shrink-0" />
          ) : toastMessage.type === 'info' ? (
            <Info className="h-5 w-5 shrink-0 text-amber-300" />
          ) : (
            <CheckCircle2 className="h-5 w-5 shrink-0" />
          )}

          <span className="leading-relaxed">
            {toastMessage.text}
          </span>

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

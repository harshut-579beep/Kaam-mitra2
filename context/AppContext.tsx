import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  User,
  Job,
  Category,
  Application,
  MachineryListing,
  MachineryBooking,
  VehicleBooking,
  ComplaintTicket,
  PlatformSettings,
  UserRole
} from '../types';
import {
  fetchJobs,
  fetchCategories,
  fetchApplications,
  fetchPlatformSettings,
  fetchMachineryListings,
  fetchMachineryBookings,
  fetchVehicleBookings,
  fetchComplaints,
  loginUser,
  applyToJob as apiApplyToJob,
  createJob as apiCreateJob,
  bookMachinery as apiBookMachinery,
  bookVehicle as apiBookVehicle,
  createComplaint as apiCreateComplaint,
} from '../api';
import { speakHindiText, stopSpeaking } from '../utils/speech';

export type TabType = 'home' | 'jobs' | 'services' | 'post' | 'bookings' | 'support' | 'profile' | 'admin';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  settings: PlatformSettings | null;
  setSettings: (s: PlatformSettings) => void;
  categories: Category[];
  jobs: Job[];
  applications: Application[];
  machineryListings: MachineryListing[];
  machineryBookings: MachineryBooking[];
  vehicleBookings: VehicleBooking[];
  complaints: ComplaintTicket[];
  loadingJobs: boolean;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  locationFilter: string;
  setLocationFilter: (loc: string) => void;
  selectedJob: Job | null;
  setSelectedJob: (job: Job | null) => void;
  applyingJob: Job | null;
  setApplyingJob: (job: Job | null) => void;
  toastMessage: { text: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
  activeSpeakingId: string | null;
  toggleJobSpeech: (job: Job) => void;
  switchDemoRole: (role: UserRole) => Promise<void>;
  refreshAll: () => Promise<void>;
  applyToCurrentJob: (jobId: string, note?: string) => Promise<boolean>;
  postNewJob: (jobData: Partial<Job>) => Promise<boolean>;
  submitMachineryBooking: (bookingData: Partial<MachineryBooking>) => Promise<string | null>;
  submitVehicleBooking: (bookingData: Partial<VehicleBooking>) => Promise<string | null>;
  submitComplaint: (ticketData: { category: string; relatedReferenceId?: string; subject: string; description: string }) => Promise<string | null>;
  showBackendInfoModal: boolean;
  setShowBackendInfoModal: (show: boolean) => void;
  isMobileDeviceFrame: boolean;
  setIsMobileDeviceFrame: (val: boolean) => void;
  openAdminPhoneCall: () => void;
  openAdminWhatsApp: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('kaam_mitra_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    // Default initial user: Farmer (किसान) Balwinder Singh for immediate agricultural & jobs exploration
    return {
      id: 'farmer_1',
      name: 'बलविंदर सिंह (किसान)',
      phone: '9822233344',
      role: 'farmer',
      village: 'तरावड़ी',
      city: 'करनाल',
      district: 'करनाल',
      location: 'गाँव तरावड़ी, करनाल, हरियाणा',
      skills: ['गेहूं की खेती', 'धान की रोपाई', 'मशीनरी आवश्यकता'],
      verified: true,
      createdAt: new Date().toISOString(),
    };
  });

  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [settings, setSettings] = useState<PlatformSettings | null>({
    ownerPhone: '+91 9876543210',
    ownerWhatsapp: '+91 9876543210',
    ownerName: 'काम मित्र संचालक (Admin)',
    supportHours: 'सुबह 8:00 बजे से रात 8:00 बजे तक (प्रतिदिन)',
    commissionPercent: 5,
    bookingFeeFixed: 50,
    serviceLocations: ['लखनऊ', 'करनाल', 'पटना', 'जयपुर', 'इंदौर', 'वाराणसी', 'भोपाल', 'कानपुर'],
    noticeBanner: 'सभी काम और मशीनरी की बुकिंग काम मित्र द्वारा प्रमाणित व सुरक्षित है। किसी को व्यक्तिगत नकद अग्रिम न दें।',
    emergencyHelpline: '1800-120-KAAM'
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [machineryListings, setMachineryListings] = useState<MachineryListing[]>([]);
  const [machineryBookings, setMachineryBookings] = useState<MachineryBooking[]>([]);
  const [vehicleBookings, setVehicleBookings] = useState<VehicleBooking[]>([]);
  const [complaints, setComplaints] = useState<ComplaintTicket[]>([]);

  const [loadingJobs, setLoadingJobs] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('सभी काम');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applyingJob, setApplyingJob] = useState<Job | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [activeSpeakingId, setActiveSpeakingId] = useState<string | null>(null);
  const [showBackendInfoModal, setShowBackendInfoModal] = useState<boolean>(false);
  const [isMobileDeviceFrame, setIsMobileDeviceFrame] = useState<boolean>(false);

  // Sync user with localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('kaam_mitra_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('kaam_mitra_user');
    }
  }, [currentUser]);

  const showToast = useCallback((text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(prev => (prev?.text === text ? null : prev));
    }, 4500);
  }, []);

  const loadData = useCallback(async () => {
    setLoadingJobs(true);
    try {
      const [catsData, jobsData, setsData, machListings] = await Promise.all([
        fetchCategories().catch(() => []),
        fetchJobs({
          category: selectedCategory === 'सभी काम' ? undefined : selectedCategory,
          search: searchQuery || undefined,
          location: locationFilter || undefined,
          requesterId: currentUser?.id
        }).catch(() => []),
        fetchPlatformSettings().catch(() => null),
        fetchMachineryListings().catch(() => [])
      ]);
      setCategories(catsData);
      setJobs(jobsData);
      if (setsData) setSettings(setsData);
      setMachineryListings(machListings);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setLoadingJobs(false);
    }
  }, [selectedCategory, searchQuery, locationFilter, currentUser?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const loadUserRecords = useCallback(async () => {
    if (!currentUser) {
      setApplications([]);
      setMachineryBookings([]);
      setVehicleBookings([]);
      setComplaints([]);
      return;
    }
    try {
      const [apps, mBookings, vBookings, comps] = await Promise.all([
        currentUser.role === 'employer'
          ? fetchApplications({ employerId: currentUser.id, requesterRole: currentUser.role })
          : currentUser.role === 'worker'
          ? fetchApplications({ workerId: currentUser.id, requesterRole: currentUser.role })
          : fetchApplications({ requesterRole: currentUser.role }),
        currentUser.role === 'farmer'
          ? fetchMachineryBookings({ farmerId: currentUser.id, requesterRole: currentUser.role })
          : currentUser.role === 'machinery_provider'
          ? fetchMachineryBookings({ providerId: currentUser.id, requesterRole: currentUser.role })
          : fetchMachineryBookings({ requesterRole: currentUser.role }),
        currentUser.role === 'machinery_provider'
          ? fetchVehicleBookings({ providerId: currentUser.id, requesterRole: currentUser.role })
          : fetchVehicleBookings({ customerId: currentUser.id, requesterRole: currentUser.role }),
        fetchComplaints({ userId: currentUser.id, requesterRole: currentUser.role })
      ]);
      setApplications(apps || []);
      setMachineryBookings(mBookings || []);
      setVehicleBookings(vBookings || []);
      setComplaints(comps || []);
    } catch (err) {
      console.error('Failed to load user records:', err);
    }
  }, [currentUser]);

  useEffect(() => {
    loadUserRecords();
  }, [loadUserRecords, activeTab]);

  const refreshAll = async () => {
    await loadData();
    await loadUserRecords();
  };

  const switchDemoRole = async (role: UserRole) => {
    stopSpeaking();
    setActiveSpeakingId(null);

    let phone = '9822233344'; // Balwinder (Farmer)
    if (role === 'worker') phone = '9844455566'; // Suresh (Worker)
    if (role === 'employer') phone = '9811122233'; // Ramesh (Employer)
    if (role === 'machinery_provider') phone = '9811199988'; // Gurmeet (Provider)
    if (role === 'admin') phone = '9876543210'; // Admin

    try {
      const { user } = await loginUser(phone);
      setCurrentUser(user);
      if (role === 'admin') {
        setActiveTab('admin');
      } else if (role === 'farmer') {
        setActiveTab('services');
      } else if (role === 'employer') {
        setActiveTab('post');
      } else if (role === 'worker') {
        setActiveTab('jobs');
      } else {
        setActiveTab('services');
      }
      showToast(`खाता सक्रिय: ${user.name} (${
        role === 'farmer' ? 'किसान' :
        role === 'worker' ? 'मजदूर' :
        role === 'employer' ? 'काम देने वाला' :
        role === 'machinery_provider' ? 'मशीनरी ऑपरेटर' : 'मुख्य एडमिन'
      })`, 'info');
      await refreshAll();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'रोल बदलने में समस्या';
      showToast(message, 'error');
    }
  };

  const toggleJobSpeech = (job: Job) => {
    if (activeSpeakingId === job.id) {
      stopSpeaking();
      setActiveSpeakingId(null);
      return;
    }

    setActiveSpeakingId(job.id);
    const speechText = `काम का नाम: ${job.title}। काम की श्रेणी: ${job.category}। मजदूरी या वेतन: ${job.salary}। स्थान: ${job.location}। काम देने वाले: ${job.employerName}। काम के घंटे: ${job.workingHours}। काम का विवरण: ${job.description}। काम मित्र व्यवस्थापक द्वारा निष्पक्ष आवंटन किया जाएगा। आवेदन करने के लिए नीचे दिए गए बटन पर दबाएं।`;

    speakHindiText(speechText, () => {
      setActiveSpeakingId(null);
    });
  };

  const applyToCurrentJob = async (jobId: string, note?: string): Promise<boolean> => {
    if (!currentUser) {
      showToast('आवेदन करने के लिए कृपया पहले लॉगिन या पंजीकरण करें।', 'error');
      setActiveTab('profile');
      return false;
    }

    try {
      const res = await apiApplyToJob(jobId, {
        workerId: currentUser.id,
        workerName: currentUser.name,
        workerPhone: currentUser.phone,
        workerLocation: currentUser.location,
        workerSkills: currentUser.skills || [],
        workerExperienceYears: currentUser.experienceYears || 1,
        note: note || '',
      });
      showToast(res.message, 'success');
      setApplyingJob(null);
      await refreshAll();
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'आवेदन नहीं हो सका';
      showToast(msg, 'error');
      return false;
    }
  };

  const postNewJob = async (jobData: Partial<Job>): Promise<boolean> => {
    if (!currentUser) {
      showToast('काम पोस्ट करने के लिए कृपया लॉगिन करें।', 'error');
      setActiveTab('profile');
      return false;
    }

    try {
      const res = await apiCreateJob({
        ...jobData,
        employerId: currentUser.id,
        employerName: currentUser.name,
        employerPhone: currentUser.phone,
      });
      showToast(res.message, 'success');
      setActiveTab('jobs');
      await refreshAll();
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'काम पोस्ट नहीं हो सका';
      showToast(msg, 'error');
      return false;
    }
  };

  const submitMachineryBooking = async (bookingData: Partial<MachineryBooking>): Promise<string | null> => {
    if (!currentUser) {
      showToast('कृषि मशीनरी बुक करने के लिए कृपया पहले लॉगिन करें।', 'error');
      setActiveTab('profile');
      return null;
    }

    try {
      const res = await apiBookMachinery({
        ...bookingData,
        farmerId: currentUser.id,
      });
      showToast(res.message, 'success');
      setActiveTab('bookings');
      await refreshAll();
      return res.referenceId;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'मशीनरी बुक नहीं हो सकी';
      showToast(msg, 'error');
      return null;
    }
  };

  const submitVehicleBooking = async (bookingData: Partial<VehicleBooking>): Promise<string | null> => {
    if (!currentUser) {
      showToast('वाहन बुक करने के लिए कृपया पहले लॉगिन करें।', 'error');
      setActiveTab('profile');
      return null;
    }

    try {
      const res = await apiBookVehicle({
        ...bookingData,
        customerId: currentUser.id,
      });
      showToast(res.message, 'success');
      setActiveTab('bookings');
      await refreshAll();
      return res.referenceId;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'वाहन बुक नहीं हो सका';
      showToast(msg, 'error');
      return null;
    }
  };

  const submitComplaint = async (ticketData: { category: string; relatedReferenceId?: string; subject: string; description: string }): Promise<string | null> => {
    if (!currentUser) {
      showToast('शिकायत दर्ज करने के लिए कृपया पहले लॉगिन करें।', 'error');
      setActiveTab('profile');
      return null;
    }

    try {
      const res = await apiCreateComplaint({
        userId: currentUser.id,
        ...ticketData
      });
      showToast(res.message, 'success');
      setActiveTab('support');
      await refreshAll();
      return res.ticketNumber;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'शिकायत दर्ज नहीं हो सकी';
      showToast(msg, 'error');
      return null;
    }
  };

  const openAdminPhoneCall = () => {
    const rawNum = settings?.ownerPhone || '+91 9876543210';
    const cleanNum = rawNum.replace(/\D/g, '');
    window.location.href = `tel:+${cleanNum}`;
  };

  const openAdminWhatsApp = () => {
    const rawNum = settings?.ownerWhatsapp || settings?.ownerPhone || '+91 9876543210';
    const cleanNum = rawNum.replace(/\D/g, '');
    const userRoleStr = currentUser?.role === 'farmer' ? 'किसान' :
      currentUser?.role === 'worker' ? 'मजदूर' :
      currentUser?.role === 'employer' ? 'काम देने वाला' :
      currentUser?.role === 'machinery_provider' ? 'मशीनरी ऑपरेटर' : 'उपयोगकर्ता';
    const msg = encodeURIComponent(`नमस्ते काम मित्र एडमिन, मैं ${currentUser ? `${currentUser.name} (${userRoleStr})` : 'काम मित्र का उपयोगकर्ता'} बोल रहा हूँ। मुझे सहायता चाहिए।`);
    window.open(`https://wa.me/${cleanNum}?text=${msg}`, '_blank');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        activeTab,
        setActiveTab,
        settings,
        setSettings,
        categories,
        jobs,
        applications,
        machineryListings,
        machineryBookings,
        vehicleBookings,
        complaints,
        loadingJobs,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        locationFilter,
        setLocationFilter,
        selectedJob,
        setSelectedJob,
        applyingJob,
        setApplyingJob,
        toastMessage,
        showToast,
        activeSpeakingId,
        toggleJobSpeech,
        switchDemoRole,
        refreshAll,
        applyToCurrentJob,
        postNewJob,
        submitMachineryBooking,
        submitVehicleBooking,
        submitComplaint,
        showBackendInfoModal,
        setShowBackendInfoModal,
        isMobileDeviceFrame,
        setIsMobileDeviceFrame,
        openAdminPhoneCall,
        openAdminWhatsApp,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

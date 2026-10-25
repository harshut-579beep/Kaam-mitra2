export type UserRole = 'worker' | 'employer' | 'farmer' | 'machinery_provider' | 'admin';

export interface User {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  village?: string;
  city?: string;
  district?: string;
  location: string;
  pinCode?: string;
  skills?: string[];
  servicesOffered?: string[];
  experienceYears?: number;
  expectedWage?: number; // per day
  bio?: string;
  avatarUrl?: string;
  isBanned?: boolean;
  verified?: boolean;
  createdAt: string;
}

export interface Job {
  id: string;
  title: string;
  category: string;
  employerId: string;
  employerName: string;
  employerPhone?: string;
  location: string;
  district?: string;
  state?: string;
  salary: string;
  salaryAmount: number;
  salaryPeriod: 'daily' | 'monthly' | 'task';
  description: string;
  workingHours: string;
  workersNeeded: number;
  status: 'active' | 'closed' | 'pending_approval' | 'flagged';
  urgent: boolean;
  isVerified?: boolean;
  createdAt: string;
  assignedWorkerCount?: number;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  employerId: string;
  workerId: string;
  workerName: string;
  workerPhone?: string;
  workerLocation: string;
  workerSkills: string[];
  workerExperienceYears: number;
  note?: string;
  status: 'pending' | 'accepted' | 'shortlisted' | 'rejected' | 'completed';
  assignedByAdmin?: boolean;
  createdAt: string;
}

export interface MachineryListing {
  id: string;
  providerId: string;
  providerName: string;
  equipmentType: string;
  tractorModel?: string;
  horsepower?: string;
  availableImplements: string[];
  serviceArea: string;
  rateDisplay: string;
  availability: boolean;
  status: 'pending_approval' | 'approved' | 'rejected';
  createdAt: string;
}

export type BookingStatus =
  | 'request_submitted'
  | 'pending_admin_review'
  | 'approved'
  | 'provider_assigned'
  | 'assignment_accepted'
  | 'work_in_progress'
  | 'completed'
  | 'cancelled'
  | 'disputed';

export interface MachineryBooking {
  id: string;
  referenceId: string;
  farmerId: string;
  farmerName: string;
  farmerPhone?: string;
  serviceType: string;
  tractorType: string;
  horsepowerRange?: string;
  implementRequired: string;
  villageFarmLocation: string;
  district?: string;
  farmAreaAcres: string;
  cropType: string;
  bookingDate: string;
  bookingTime: string;
  workingHours: string;
  budget: string;
  instructions?: string;
  status: BookingStatus;
  assignedProviderId?: string;
  assignedProviderName?: string;
  adminNotes?: string;
  estimatedPrice: number;
  platformCommission: number;
  paymentStatus: 'pending' | 'escrow' | 'paid' | 'refunded';
  createdAt: string;
}

export interface VehicleBooking {
  id: string;
  referenceId: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  vehicleType: string;
  pickupLocation: string;
  destination: string;
  goodsDescription: string;
  bookingDate: string;
  bookingTime: string;
  budget: string;
  specialRequirements?: string;
  status: BookingStatus;
  assignedProviderId?: string;
  assignedProviderName?: string;
  adminNotes?: string;
  estimatedPrice: number;
  platformCommission: number;
  paymentStatus: 'pending' | 'escrow' | 'paid' | 'refunded';
  createdAt: string;
}

export interface ComplaintTicket {
  id: string;
  ticketId: string;
  userId: string;
  userName: string;
  userPhone?: string;
  userRole: UserRole;
  category: 'fake_job' | 'suspicious_user' | 'booking_issue' | 'cancellation' | 'payment_inquiry' | 'general_complaint';
  relatedReferenceId?: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  adminReply?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlatformSettings {
  ownerPhone: string;
  ownerWhatsapp: string;
  ownerName: string;
  supportHours: string;
  commissionPercent: number;
  bookingFeeFixed: number;
  serviceLocations: string[];
  noticeBanner: string;
  emergencyHelpline: string;
}

export interface AuditLog {
  id: string;
  action: string;
  adminName: string;
  targetId?: string;
  details: string;
  timestamp: string;
}

export interface Category {
  id: string;
  name: string;
  enName: string;
  iconName: string;
  jobCount: number;
  active: boolean;
}

export interface AdminOverview {
  totalUsers: number;
  totalWorkers: number;
  totalEmployers: number;
  totalFarmers: number;
  totalProviders: number;
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  totalMachineryBookings: number;
  totalVehicleBookings: number;
  pendingBookings: number;
  totalComplaints: number;
  openComplaints: number;
  totalEarnings: number;
  allUsers: User[];
  allJobs: Job[];
  allMachineryBookings: MachineryBooking[];
  allVehicleBookings: VehicleBooking[];
  allComplaints: ComplaintTicket[];
  allMachineryListings: MachineryListing[];
  auditLogs: AuditLog[];
  settings: PlatformSettings;
}

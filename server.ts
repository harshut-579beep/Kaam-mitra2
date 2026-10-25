import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json());

// Persistent database path
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Types
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
  skills?: string[];
  servicesOffered?: string[];
  experienceYears?: number;
  expectedWage?: number; // per day
  bio?: string;
  passwordHash?: string;
  salt?: string;
  securityQuestion?: string;
  securityAnswerHash?: string;
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
  employerPhone?: string; // Private, scrubbed in public queries
  location: string;
  district?: string;
  state?: string;
  salary: string; // e.g. "₹650 प्रति दिन"
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
  workerPhone?: string; // Private to admin
  workerLocation: string;
  workerSkills: string[];
  workerExperienceYears: number;
  note?: string;
  status: 'pending' | 'accepted' | 'shortlisted' | 'rejected' | 'completed';
  assignedByAdmin?: boolean;
  createdAt: string;
}

// Agricultural Machinery Listing
export interface MachineryListing {
  id: string;
  providerId: string;
  providerName: string;
  providerPhone?: string; // Private to admin
  equipmentType: string; // e.g. 'ट्रैक्टर (Tractor)', 'रोटावेटर (Rotavator)', 'कल्टीवेटर', 'रीपर (Reaper)', 'थ्रेशर'
  tractorModel?: string; // e.g. 'महिंद्रा 575 DI'
  horsepower?: string; // e.g. '45 HP', '50 HP', '55+ HP'
  availableImplements: string[];
  serviceArea: string; // e.g. 'करनाल, कैथल व आस-पास के 20 गाँव'
  rateDisplay: string; // e.g. '₹800 / घंटा' या '₹1,200 / एकड़'
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

// Agricultural Machinery Booking (Farmers)
export interface MachineryBooking {
  id: string;
  referenceId: string;
  farmerId: string;
  farmerName: string;
  farmerPhone?: string; // Private
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

// Vehicle & Goods Transport Booking
export interface VehicleBooking {
  id: string;
  referenceId: string;
  customerId: string;
  customerName: string;
  customerPhone?: string; // Private
  vehicleType: string; // 'Tractor', 'Tractor with trolley', 'Auto-rickshaw', 'Goods auto', 'Pickup vehicle', 'Mini truck', 'Truck'
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

// Support / Complaints Ticket
export interface ComplaintTicket {
  id: string;
  ticketId: string; // e.g. KM-TIC-701
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

// Platform Settings (Admin Configurable)
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
  name: string; // Hindi name
  enName: string;
  iconName: string;
  jobCount: number;
  active: boolean;
}

interface DatabaseSchema {
  users: User[];
  jobs: Job[];
  applications: Application[];
  machineryListings: MachineryListing[];
  machineryBookings: MachineryBooking[];
  vehicleBookings: VehicleBooking[];
  complaints: ComplaintTicket[];
  settings: PlatformSettings;
  auditLogs: AuditLog[];
  categories: Category[];
}

// Password hashing utility using PBKDF2
function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

// Scrub user sensitive details (Privacy requirement: No direct contact / phone numbers exposed between users)
function scrubUser(user: User): Partial<User> {
  const { passwordHash, salt, securityAnswerHash, phone, ...safeUser } = user;
  return safeUser;
}

// Scrub job sensitive details
function scrubJob(job: Job): Job {
  const { employerPhone, ...safeJob } = job;
  return safeJob as Job;
}

// Initial default settings
const INITIAL_SETTINGS: PlatformSettings = {
  ownerPhone: '+91 9876543210',
  ownerWhatsapp: '+91 9876543210',
  ownerName: 'काम मित्र संचालक (Admin)',
  supportHours: 'सुबह 8:00 बजे से रात 8:00 बजे तक (प्रतिदिन)',
  commissionPercent: 5,
  bookingFeeFixed: 50,
  serviceLocations: ['लखनऊ', 'पटना', 'करनाल', 'जयपुर', 'इंदौर', 'वाराणसी', 'भोपाल', 'कानपुर', 'मेरठ', 'रोहतक'],
  noticeBanner: 'सभी काम और मशीनरी की बुकिंग काम मित्र द्वारा प्रमाणित व सुरक्षित है। किसी को निजी नकद अग्रिम न दें।',
  emergencyHelpline: '1800-120-KAAM'
};

const INITIAL_CATEGORIES: Category[] = [
  { id: 'farming', name: 'खेती का काम', enName: 'Farming / Agriculture', iconName: 'Tractor', jobCount: 18, active: true },
  { id: 'tractor', name: 'ट्रैक्टर व मशीनरी सेवा', enName: 'Tractor & Machinery', iconName: 'Tractor', jobCount: 15, active: true },
  { id: 'vehicle', name: 'वाहन एवं माल ढुलाई', enName: 'Goods Transport', iconName: 'Truck', jobCount: 12, active: true },
  { id: 'labour', name: 'मजदूरी व निर्माण', enName: 'Labour / Construction', iconName: 'Hammer', jobCount: 28, active: true },
  { id: 'cleaning', name: 'सफाई का काम', enName: 'Cleaning & Housekeeping', iconName: 'Sparkles', jobCount: 19, active: true },
  { id: 'delivery', name: 'सामान डिलीवरी', enName: 'Delivery Boy', iconName: 'Truck', jobCount: 22, active: true },
  { id: 'mason', name: 'राजमिस्त्री', enName: 'Mason', iconName: 'Layers', jobCount: 11, active: true },
  { id: 'painter', name: 'पेंटर', enName: 'Painter', iconName: 'Paintbrush', jobCount: 9, active: true },
  { id: 'plumber', name: 'प्लंबर', enName: 'Plumber', iconName: 'Wrench', jobCount: 13, active: true },
  { id: 'electrician', name: 'इलेक्ट्रिशियन', enName: 'Electrician', iconName: 'Zap', jobCount: 16, active: true },
  { id: 'driver', name: 'ड्राइवर', enName: 'Driver', iconName: 'Car', jobCount: 18, active: true },
  { id: 'household', name: 'घर के काम', enName: 'Domestic / Maid', iconName: 'Home', jobCount: 25, active: true },
];

const INITIAL_USERS: User[] = [
  {
    id: 'admin_1',
    name: 'काम मित्र मुख्य व्यवस्थापक (Admin)',
    phone: '9876543210',
    role: 'admin',
    village: 'सदर',
    city: 'लखनऊ',
    district: 'लखनऊ',
    location: 'हजरतगंज, लखनऊ, उत्तर प्रदेश',
    passwordHash: hashPassword('admin123', 'admin_salt'),
    salt: 'admin_salt',
    securityQuestion: 'आपकी जन्मभूमि?',
    securityAnswerHash: hashPassword('lucknow', 'admin_salt'),
    verified: true,
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
  },
  {
    id: 'farmer_1',
    name: 'बलविंदर सिंह (किसान)',
    phone: '9822233344',
    role: 'farmer',
    village: 'तरावड़ी',
    city: 'करनाल',
    district: 'करनाल',
    location: 'गाँव तरावड़ी, करनाल, हरियाणा',
    skills: ['गेहूं की खेती', 'धान की रोपाई', 'मशीनरी आवश्यकता'],
    passwordHash: hashPassword('123456', 'farmer_salt'),
    salt: 'farmer_salt',
    verified: true,
    createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
  },
  {
    id: 'prov_1',
    name: 'गुरमीत सिंह (ट्रैक्टर व मशीनरी सेवा)',
    phone: '9811199988',
    role: 'machinery_provider',
    village: 'नीलोखेड़ी',
    city: 'करनाल',
    district: 'करनाल',
    location: 'नीलोखेड़ी, करनाल, हरियाणा',
    servicesOffered: ['ट्रैक्टर मय ड्राइवर', 'रोटावेटर', 'कल्टीवेटर', 'थ्रेशर', 'ट्रॉली'],
    passwordHash: hashPassword('123456', 'prov_salt'),
    salt: 'prov_salt',
    verified: true,
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
  {
    id: 'emp_1',
    name: 'रामेश कुमार पटेल (ठेकेदार)',
    phone: '9811122233',
    role: 'employer',
    village: 'गोमती नगर',
    city: 'लखनऊ',
    district: 'लखनऊ',
    location: 'गोमती नगर, लखनऊ, उत्तर प्रदेश',
    passwordHash: hashPassword('123456', 'emp_salt'),
    salt: 'emp_salt',
    verified: true,
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
  {
    id: 'wrk_1',
    name: 'सुरेश कुमार यादव',
    phone: '9844455566',
    role: 'worker',
    village: 'शिवपुर',
    city: 'वाराणसी',
    district: 'वाराणसी',
    location: 'शिवपुर, वाराणसी, उत्तर प्रदेश',
    skills: ['राजमिस्त्री', 'मजदूरी'],
    experienceYears: 6,
    expectedWage: 750,
    bio: 'मकान निर्माण, ईंट चुनाई और प्लास्टर के काम का 6 साल का तजुर्बा है।',
    passwordHash: hashPassword('123456', 'wrk_salt'),
    salt: 'wrk_salt',
    verified: true,
    createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
  }
];

const INITIAL_MACHINERY_LISTINGS: MachineryListing[] = [
  {
    id: 'mach_1',
    providerId: 'prov_1',
    providerName: 'गुरमीत सिंह एग्रो सर्विसेज',
    providerPhone: '9811199988',
    equipmentType: 'महिंद्रा 575 DI (45 HP) मय रोटावेटर',
    tractorModel: 'Mahindra 575 DI Sarpanch',
    horsepower: '45 HP',
    availableImplements: ['रोटावेटर से जुताई', 'कल्टीवेटर', 'हल', 'ट्रॉली सामान ढुलाई'],
    serviceArea: 'करनाल, नीलोखेड़ी, तरावड़ी और 15 आस-पास के गाँव',
    rateDisplay: '₹850 / घंटा (डीजल सहित)',
    availability: true,
    status: 'approved',
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: 'mach_2',
    providerId: 'prov_1',
    providerName: 'किसान सेवा केंद्र (सोनालीका डीलर)',
    providerPhone: '9811199988',
    equipmentType: 'सोनालीका DI 60 (60 HP) हैवी ट्रैक्टर',
    tractorModel: 'Sonalika Tiger DI 60',
    horsepower: '60 HP (हैवी ड्यूटी)',
    availableImplements: ['लेजर लैंड लेवलर (खेत समतल)', 'डिस्क हैरो', 'गहरी जुताई हल', 'रीपर'],
    serviceArea: 'करनाल, कैथल रोड व 25 किमी परिधि',
    rateDisplay: '₹1,100 / घंटा या ₹1,400 / एकड़',
    availability: true,
    status: 'approved',
    createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
  },
  {
    id: 'mach_3',
    providerId: 'prov_1',
    providerName: 'अवध कृषि यंत्र सेवा',
    providerPhone: '9811199988',
    equipmentType: 'स्वराज 744 FE + थ्रेशर व रीपर',
    tractorModel: 'Swaraj 744 FE (48 HP)',
    horsepower: '48 HP',
    availableImplements: ['थ्रेशर से गेहूं मड़ाई', 'सीड ड्रिल बुवाई', 'जीरो टिलेज', 'स्प्रे मशीन'],
    serviceArea: 'लखनऊ, मोहनलालगंज व उन्नाव सीमा',
    rateDisplay: '₹950 / घंटा',
    availability: true,
    status: 'approved',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  }
];

const INITIAL_MACHINERY_BOOKINGS: MachineryBooking[] = [
  {
    id: 'mbk_1',
    referenceId: 'KM-MBK-1001',
    farmerId: 'farmer_1',
    farmerName: 'बलविंदर सिंह',
    farmerPhone: '9822233344',
    serviceType: 'रोटावेटर से खेत की जुताई',
    tractorType: 'ट्रैक्टर मय रोटावेटर व ड्राइवर',
    horsepowerRange: '45-55 HP',
    implementRequired: '7 फीट रोटावेटर',
    villageFarmLocation: 'गाँव तरावड़ी, खेत संख्या 14',
    district: 'करनाल',
    farmAreaAcres: '6 एकड़',
    cropType: 'गेहूं की बुवाई पूर्व जुताई',
    bookingDate: '2026-10-20',
    bookingTime: 'सुबह 07:00 बजे',
    workingHours: 'लगभग 5 घंटे',
    budget: '₹4,500',
    instructions: 'खेत में नमी अच्छी है, बारीक जुताई चाहिए।',
    status: 'provider_assigned',
    assignedProviderId: 'prov_1',
    assignedProviderName: 'गुरमीत सिंह एग्रो सर्विसेज',
    adminNotes: 'एडमिन द्वारा गुरमीत सिंह को 20 तारीख सुबह 7 बजे के लिए नियुक्त किया गया।',
    estimatedPrice: 4500,
    platformCommission: 225,
    paymentStatus: 'pending',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  }
];

const INITIAL_VEHICLE_BOOKINGS: VehicleBooking[] = [
  {
    id: 'vbk_1',
    referenceId: 'KM-VBK-2001',
    customerId: 'farmer_1',
    customerName: 'बलविंदर सिंह',
    customerPhone: '9822233344',
    vehicleType: 'ट्रैक्टर मय बड़ी ट्रॉली',
    pickupLocation: 'तरावड़ी फार्म यार्ड',
    destination: 'करनाल नई अनाज मंडी',
    goodsDescription: '120 बोरी गेहूं मंडी पहुंचाना है',
    bookingDate: '2026-10-22',
    bookingTime: 'सुबह 08:00 बजे',
    budget: '₹2,500',
    specialRequirements: 'तिरपाल ढंका हुआ होना चाहिए',
    status: 'approved',
    assignedProviderId: 'prov_1',
    assignedProviderName: 'गुरमीत सिंह एग्रो सर्विसेज',
    adminNotes: 'मंडी ट्रिप स्वीकृत, ऑपरेटर को निर्देश दिया गया।',
    estimatedPrice: 2500,
    platformCommission: 125,
    paymentStatus: 'pending',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  }
];

const INITIAL_JOBS: Job[] = [
  {
    id: 'job_1',
    title: 'गेहूं कटाई और थ्रेशिंग हेतु 5 मजदूर चाहिए',
    category: 'खेती का काम',
    employerId: 'farmer_1',
    employerName: 'बलविंदर सिंह (किसान)',
    employerPhone: '9822233344',
    location: 'करनाल, हरियाणा',
    district: 'करनाल',
    state: 'हरियाणा',
    salary: '₹650 प्रति दिन + खाना',
    salaryAmount: 650,
    salaryPeriod: 'daily',
    description: '15 एकड़ खेत में गेहूं की कटाई और थ्रेसर मशीन से गेहूं निकालने का काम है। दोपहर का भोजन दिया जाएगा। प्लेटफार्म द्वारा मजदूर आवंटित किए जाएंगे।',
    workingHours: 'सुबह 7:00 बजे से शाम 5:30 बजे तक',
    workersNeeded: 5,
    status: 'active',
    urgent: true,
    isVerified: true,
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    assignedWorkerCount: 1,
  },
  {
    id: 'job_2',
    title: 'मकान निर्माण कार्य के लिए 2 राजमिस्त्री और 3 हेल्पर',
    category: 'राजमिस्त्री',
    employerId: 'emp_1',
    employerName: 'रामेश कुमार पटेल (ठेकेदार)',
    employerPhone: '9811122233',
    location: 'गोमती नगर, लखनऊ',
    district: 'लखनऊ',
    state: 'उत्तर प्रदेश',
    salary: '₹850 प्रति दिन (मिस्त्री) / ₹550 (हेल्पर)',
    salaryAmount: 850,
    salaryPeriod: 'daily',
    description: 'दो मंजिला मकान में ईंट चुनाई और बाहरी प्लास्टर का काम है। 15 दिन का पक्का काम है। काम मित्र एडमिन द्वारा समन्वय होगा।',
    workingHours: 'सुबह 8:30 बजे से शाम 5:00 बजे तक',
    workersNeeded: 5,
    status: 'active',
    urgent: true,
    isVerified: true,
    createdAt: new Date(Date.now() - 14 * 3600000).toISOString(),
    assignedWorkerCount: 1,
  },
  {
    id: 'job_3',
    title: 'सब्जी एवं फल लोडिंग-अनलोडिंग हेतु 3 पल्लेदार साथी',
    category: 'मजदूरी',
    employerId: 'emp_1',
    employerName: 'रामेश कुमार पटेल',
    employerPhone: '9811122233',
    location: 'दुबग्गा मंडी, लखनऊ',
    district: 'लखनऊ',
    state: 'उत्तर प्रदेश',
    salary: '₹700 प्रति दिन + चाय नाश्ता',
    salaryAmount: 700,
    salaryPeriod: 'daily',
    description: 'मंडी में आने वाली गाड़ियों से माल उतारना और गोदाम में सुरक्षित लगाना है। नकद भुगतान काम पूरा होते ही।',
    workingHours: 'सुबह 5:00 से दोपहर 1:00 बजे तक',
    workersNeeded: 3,
    status: 'active',
    urgent: false,
    isVerified: true,
    createdAt: new Date(Date.now() - 28 * 3600000).toISOString(),
  }
];

const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'app_1',
    jobId: 'job_1',
    jobTitle: 'गेहूं कटाई और थ्रेशिंग हेतु 5 मजदूर चाहिए',
    employerId: 'farmer_1',
    workerId: 'wrk_1',
    workerName: 'सुरेश कुमार यादव',
    workerPhone: '9844455566',
    workerLocation: 'वाराणसी, उत्तर प्रदेश',
    workerSkills: ['खेती का काम', 'मजदूरी'],
    workerExperienceYears: 6,
    note: 'हम साथी तैयार हैं, काम की जानकारी मिलते ही पहुँच जाएंगे।',
    status: 'accepted',
    assignedByAdmin: true,
    createdAt: new Date(Date.now() - 1 * 3600000).toISOString(),
  }
];

const INITIAL_COMPLAINTS: ComplaintTicket[] = [
  {
    id: 'comp_1',
    ticketId: 'KM-TIC-301',
    userId: 'farmer_1',
    userName: 'बलविंदर सिंह',
    userPhone: '9822233344',
    userRole: 'farmer',
    category: 'booking_issue',
    relatedReferenceId: 'KM-MBK-1001',
    subject: 'जुताई के समय में थोड़ा बदलाव चाहिए',
    description: 'कल रात बारिश की संभावना के कारण हम 20 तारीख की जगह 21 तारीख सुबह 7 बजे जुताई करवाना चाहते हैं। कृपया ऑपरेटर को सूचित करें।',
    status: 'in_progress',
    adminReply: 'एडमिन द्वारा गुरमीत सिंह को 21 तारीख का नया समय बता दिया गया है। वे समय पर पहुँचेंगे।',
    createdAt: new Date(Date.now() - 12 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 3600000).toISOString(),
  }
];

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log_1',
    action: 'मशीनरी बुकिंग स्वीकृत व ऑपरेटर नियुक्त',
    adminName: 'काम मित्र मुख्य व्यवस्थापक',
    targetId: 'KM-MBK-1001',
    details: 'किसान बलविंदर सिंह की रोटावेटर बुकिंग को गुरमीत सिंह एग्रो को सौंपा गया।',
    timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    id: 'log_2',
    action: 'काम सत्यापित किया गया',
    adminName: 'काम मित्र मुख्य व्यवस्थापक',
    targetId: 'job_1',
    details: 'गेहूं कटाई काम को कॉल पर जांच कर सत्यापित घोषित किया गया।',
    timestamp: new Date(Date.now() - 48 * 3600000).toISOString(),
  }
];

// Database helper functions
function loadDatabase(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const initialData: DatabaseSchema = {
        users: INITIAL_USERS,
        jobs: INITIAL_JOBS,
        applications: INITIAL_APPLICATIONS,
        machineryListings: INITIAL_MACHINERY_LISTINGS,
        machineryBookings: INITIAL_MACHINERY_BOOKINGS,
        vehicleBookings: INITIAL_VEHICLE_BOOKINGS,
        complaints: INITIAL_COMPLAINTS,
        settings: INITIAL_SETTINGS,
        auditLogs: INITIAL_AUDIT_LOGS,
        categories: INITIAL_CATEGORIES,
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
      return initialData;
    }
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(content);
    // Ensure all required collections exist
    if (!parsed.machineryListings) parsed.machineryListings = INITIAL_MACHINERY_LISTINGS;
    if (!parsed.machineryBookings) parsed.machineryBookings = INITIAL_MACHINERY_BOOKINGS;
    if (!parsed.vehicleBookings) parsed.vehicleBookings = INITIAL_VEHICLE_BOOKINGS;
    if (!parsed.complaints) parsed.complaints = INITIAL_COMPLAINTS;
    if (!parsed.settings) parsed.settings = INITIAL_SETTINGS;
    if (!parsed.auditLogs) parsed.auditLogs = INITIAL_AUDIT_LOGS;
    if (!parsed.categories) parsed.categories = INITIAL_CATEGORIES;
    return parsed;
  } catch (err) {
    console.error('Error loading database, returning defaults:', err);
    return {
      users: INITIAL_USERS,
      jobs: INITIAL_JOBS,
      applications: INITIAL_APPLICATIONS,
      machineryListings: INITIAL_MACHINERY_LISTINGS,
      machineryBookings: INITIAL_MACHINERY_BOOKINGS,
      vehicleBookings: INITIAL_VEHICLE_BOOKINGS,
      complaints: INITIAL_COMPLAINTS,
      settings: INITIAL_SETTINGS,
      auditLogs: INITIAL_AUDIT_LOGS,
      categories: INITIAL_CATEGORIES,
    };
  }
}

function saveDatabase(data: DatabaseSchema): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving database:', err);
  }
}

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

// 1. Health & Meta & Public Platform Settings
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'Kaam Mitra (काम मित्र)',
    version: '2.0.0',
    platform: 'Rural India Job & Agricultural Machinery Marketplace',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/settings', (req: Request, res: Response) => {
  const db = loadDatabase();
  res.json(db.settings || INITIAL_SETTINGS);
});

// Update settings (Admin only)
app.put('/api/settings', (req: Request, res: Response) => {
  const { adminPhone, ownerPhone, ownerWhatsapp, ownerName, supportHours, commissionPercent, bookingFeeFixed, noticeBanner } = req.body;
  const db = loadDatabase();
  
  // Security verification
  const adminUser = db.users.find(u => u.phone === adminPhone && u.role === 'admin');
  if (!adminUser) {
    res.status(403).json({ error: 'केवल अधिकृत एडमिन ही आधिकारिक संपर्क विवरण बदल सकते हैं।' });
    return;
  }

  if (ownerPhone) db.settings.ownerPhone = ownerPhone;
  if (ownerWhatsapp) db.settings.ownerWhatsapp = ownerWhatsapp;
  if (ownerName) db.settings.ownerName = ownerName;
  if (supportHours) db.settings.supportHours = supportHours;
  if (commissionPercent !== undefined) db.settings.commissionPercent = Number(commissionPercent);
  if (bookingFeeFixed !== undefined) db.settings.bookingFeeFixed = Number(bookingFeeFixed);
  if (noticeBanner) db.settings.noticeBanner = noticeBanner;

  db.auditLogs.unshift({
    id: `log_${Date.now()}`,
    action: 'आधिकारिक संपर्क व सेटिंग्स अपडेट',
    adminName: adminUser.name,
    details: `नया फोन: ${ownerPhone || db.settings.ownerPhone}, कमीशन: ${db.settings.commissionPercent}%`,
    timestamp: new Date().toISOString()
  });

  saveDatabase(db);
  res.json({ settings: db.settings, message: 'आधिकारिक संपर्क जानकारी सफलतापूर्वक अपडेट कर दी गई।' });
});

// 2. Authentication (Register, Login, Password Reset, Profile)
app.post('/api/auth/register', (req: Request, res: Response) => {
  const {
    name,
    phone,
    role,
    village,
    city,
    district,
    location,
    skills,
    servicesOffered,
    experienceYears,
    expectedWage,
    bio,
    password,
    securityQuestion,
    securityAnswer
  } = req.body;

  if (!name || !phone || !role || !password) {
    res.status(400).json({ error: 'कृपया नाम, 10 अंकों का मोबाइल नंबर, पासवर्ड और अपना खाता प्रकार (रोल) भरें।' });
    return;
  }

  const cleanPhone = String(phone).replace(/\D/g, '');
  if (cleanPhone.length < 10) {
    res.status(400).json({ error: 'कृपया सही 10 अंकों का भारतीय मोबाइल नंबर दर्ज करें।' });
    return;
  }

  const validRoles: UserRole[] = ['worker', 'employer', 'farmer', 'machinery_provider', 'admin'];
  if (!validRoles.includes(role)) {
    res.status(400).json({ error: 'अमान्य खाता प्रकार।' });
    return;
  }

  // Prevent ordinary users from registering as admin
  if (role === 'admin' && cleanPhone !== '9876543210') {
    res.status(403).json({ error: 'प्रशासक (Admin) खाता केवल मुख्य व्यवस्थापक के लिए आरक्षित है।' });
    return;
  }

  const db = loadDatabase();
  const existingUser = db.users.find(u => u.phone === cleanPhone);

  const salt = generateSalt();
  const passwordHash = hashPassword(password, salt);
  const securityAnswerHash = securityAnswer ? hashPassword(securityAnswer.toLowerCase().trim(), salt) : undefined;

  const locString = location || [village, city, district].filter(Boolean).join(', ') || 'भारत';

  if (existingUser) {
    // If existing, update password & profile
    existingUser.name = name;
    existingUser.role = role;
    existingUser.village = village || existingUser.village;
    existingUser.city = city || existingUser.city;
    existingUser.district = district || existingUser.district;
    existingUser.location = locString;
    existingUser.salt = salt;
    existingUser.passwordHash = passwordHash;
    if (securityQuestion) existingUser.securityQuestion = securityQuestion;
    if (securityAnswerHash) existingUser.securityAnswerHash = securityAnswerHash;
    if (skills) existingUser.skills = skills;
    if (servicesOffered) existingUser.servicesOffered = servicesOffered;
    if (experienceYears !== undefined) existingUser.experienceYears = Number(experienceYears);
    if (expectedWage !== undefined) existingUser.expectedWage = Number(expectedWage);
    if (bio) existingUser.bio = bio;

    saveDatabase(db);
    res.json({ user: scrubUser(existingUser), message: 'खाता अपडेट हुआ! नया पासवर्ड सुरक्षित कर दिया गया।' });
    return;
  }

  const newUser: User = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name,
    phone: cleanPhone,
    role,
    village: village || '',
    city: city || '',
    district: district || '',
    location: locString,
    skills: skills || [],
    servicesOffered: servicesOffered || [],
    experienceYears: experienceYears ? Number(experienceYears) : 1,
    expectedWage: expectedWage ? Number(expectedWage) : 600,
    bio: bio || '',
    salt,
    passwordHash,
    securityQuestion: securityQuestion || 'आपका पसंदीदा गाँव?',
    securityAnswerHash: securityAnswerHash || hashPassword('india', salt),
    verified: true,
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  saveDatabase(db);

  res.status(201).json({ user: scrubUser(newUser), message: 'सफलतापूर्वक पंजीकरण हुआ! काम मित्र में आपका स्वागत है।' });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { phone, password } = req.body;
  if (!phone) {
    res.status(400).json({ error: 'कृपया मोबाइल नंबर दर्ज करें।' });
    return;
  }

  const cleanPhone = String(phone).replace(/\D/g, '');
  const db = loadDatabase();
  const user = db.users.find(u => u.phone === cleanPhone);

  if (!user) {
    res.status(404).json({ error: 'यह मोबाइल नंबर पंजीकृत नहीं है। कृपया नया खाता बनाएं।' });
    return;
  }

  if (user.isBanned) {
    res.status(403).json({ error: 'यह खाता व्यवस्थापक द्वारा निलंबित (Banned) किया गया है। आधिकारिक एडमिन सहायता नंबर पर संपर्क करें।' });
    return;
  }

  // Password check: If password was provided
  if (password && user.passwordHash && user.salt) {
    const computedHash = hashPassword(password, user.salt);
    if (computedHash !== user.passwordHash) {
      res.status(401).json({ error: 'गलत पासवर्ड दर्ज किया गया है। कृपया दोबारा प्रयास करें या खाता रिकवर करें।' });
      return;
    }
  }

  // Send safe user object with phone preserved for self-session
  const safeUser = { ...user };
  delete (safeUser as any).passwordHash;
  delete (safeUser as any).salt;
  delete (safeUser as any).securityAnswerHash;

  res.json({ user: safeUser, message: `स्वागत है, ${user.name}!` });
});

// Account Recovery / Password Reset
app.post('/api/auth/recover', (req: Request, res: Response) => {
  const { phone, securityAnswer, newPassword } = req.body;
  if (!phone || !newPassword) {
    res.status(400).json({ error: 'कृपया मोबाइल नंबर और नया पासवर्ड दर्ज करें।' });
    return;
  }

  const cleanPhone = String(phone).replace(/\D/g, '');
  const db = loadDatabase();
  const user = db.users.find(u => u.phone === cleanPhone);

  if (!user) {
    res.status(404).json({ error: 'उपयोगकर्ता नहीं मिला।' });
    return;
  }

  if (newPassword.length < 4) {
    res.status(400).json({ error: 'नया पासवर्ड कम से कम 4 अक्षरों का होना चाहिए।' });
    return;
  }

  const salt = user.salt || generateSalt();
  user.salt = salt;
  user.passwordHash = hashPassword(newPassword, salt);
  saveDatabase(db);

  res.json({ message: 'आपका पासवर्ड सफलतापूर्वक बदल दिया गया है! अब नए पासवर्ड से लॉगिन करें।' });
});

// Update profile
app.put('/api/users/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const db = loadDatabase();
  const user = db.users.find(u => u.id === id);

  if (!user) {
    res.status(404).json({ error: 'उपयोगकर्ता नहीं मिला।' });
    return;
  }

  const { name, village, city, district, location, skills, servicesOffered, experienceYears, expectedWage, bio } = req.body;
  if (name) user.name = name;
  if (village) user.village = village;
  if (city) user.city = city;
  if (district) user.district = district;
  if (location) user.location = location;
  if (skills !== undefined) user.skills = skills;
  if (servicesOffered !== undefined) user.servicesOffered = servicesOffered;
  if (experienceYears !== undefined) user.experienceYears = Number(experienceYears);
  if (expectedWage !== undefined) user.expectedWage = Number(expectedWage);
  if (bio !== undefined) user.bio = bio;

  saveDatabase(db);
  const safeUser = { ...user };
  delete (safeUser as any).passwordHash;
  delete (safeUser as any).salt;
  delete (safeUser as any).securityAnswerHash;

  res.json({ user: safeUser, message: 'प्रोफाइल सुरक्षित हो गया!' });
});

// 3. Categories
app.get('/api/categories', (req: Request, res: Response) => {
  const db = loadDatabase();
  const categoriesWithCounts = db.categories.map(cat => {
    const count = db.jobs.filter(j => j.category === cat.name && j.status === 'active').length;
    return { ...cat, jobCount: count };
  });
  res.json(categoriesWithCounts);
});

// 4. Jobs Marketplace (Privacy protected - no direct employer phone to unauthorized)
app.get('/api/jobs', (req: Request, res: Response) => {
  const { category, search, location, employerId, status, requesterId } = req.query;
  const db = loadDatabase();

  let jobs = db.jobs;

  if (employerId) {
    jobs = jobs.filter(j => j.employerId === employerId);
  } else {
    if (status) {
      jobs = jobs.filter(j => j.status === status);
    } else {
      jobs = jobs.filter(j => j.status === 'active');
    }
  }

  if (category && category !== 'सभी काम') {
    jobs = jobs.filter(j => j.category === category);
  }

  if (location && typeof location === 'string' && location.trim()) {
    const locLower = location.toLowerCase();
    jobs = jobs.filter(j =>
      j.location.toLowerCase().includes(locLower) ||
      (j.district && j.district.toLowerCase().includes(locLower)) ||
      (j.state && j.state.toLowerCase().includes(locLower))
    );
  }

  if (search && typeof search === 'string' && search.trim()) {
    const s = search.toLowerCase();
    jobs = jobs.filter(j =>
      j.title.toLowerCase().includes(s) ||
      j.description.toLowerCase().includes(s) ||
      j.category.toLowerCase().includes(s) ||
      j.location.toLowerCase().includes(s)
    );
  }

  jobs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Privacy protection: Scrub employer phone numbers for ordinary workers/farmers/public
  const requester = requesterId ? db.users.find(u => u.id === requesterId) : null;
  const isAdmin = requester?.role === 'admin';

  const sanitizedJobs = jobs.map(j => {
    if (isAdmin || (requester && requester.id === j.employerId)) {
      return j;
    }
    return scrubJob(j);
  });

  res.json(sanitizedJobs);
});

app.post('/api/jobs', (req: Request, res: Response) => {
  const {
    title,
    category,
    employerId,
    employerName,
    employerPhone,
    location,
    district,
    salary,
    salaryAmount,
    salaryPeriod,
    description,
    workingHours,
    workersNeeded,
    urgent
  } = req.body;

  if (!title || !category || !location || !salary || !employerId) {
    res.status(400).json({ error: 'कृपया काम का नाम, श्रेणी, स्थान और मजदूरी/वेतन अवश्य भरें।' });
    return;
  }

  const db = loadDatabase();
  const employer = db.users.find(u => u.id === employerId);

  const newJob: Job = {
    id: `job_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    title,
    category,
    employerId,
    employerName: employerName || employer?.name || 'नियोक्ता',
    employerPhone: employerPhone || employer?.phone || '',
    location,
    district: district || employer?.district || '',
    salary,
    salaryAmount: salaryAmount ? Number(salaryAmount) : 600,
    salaryPeriod: salaryPeriod || 'daily',
    description: description || 'काम मित्र प्लेटफॉर्म के माध्यम से आवेदन आमंत्रित हैं।',
    workingHours: workingHours || 'सुबह 8:30 से शाम 5:30 बजे तक',
    workersNeeded: workersNeeded ? Number(workersNeeded) : 1,
    status: 'active',
    urgent: Boolean(urgent),
    isVerified: true,
    createdAt: new Date().toISOString(),
    assignedWorkerCount: 0
  };

  db.jobs.unshift(newJob);
  saveDatabase(db);

  res.status(201).json({ job: scrubJob(newJob), message: 'काम सफलतापूर्वक पोस्ट हो गया! काम मित्र एडमिन द्वारा समीक्षा की जाएगी।' });
});

// 5. Job Applications (Platform coordinated - no direct contact)
app.post('/api/jobs/:id/apply', (req: Request, res: Response) => {
  const { id } = req.params;
  const { workerId, workerName, workerPhone, workerLocation, workerSkills, workerExperienceYears, note } = req.body;

  if (!workerId) {
    res.status(400).json({ error: 'आवेदन करने के लिए लॉगिन होना जरूरी है।' });
    return;
  }

  const db = loadDatabase();
  const job = db.jobs.find(j => j.id === id);
  if (!job) {
    res.status(404).json({ error: 'यह काम अब उपलब्ध नहीं है।' });
    return;
  }

  const existingApp = db.applications.find(a => a.jobId === id && a.workerId === workerId);
  if (existingApp) {
    res.status(400).json({ error: 'आपने इस काम के लिए पहले ही आवेदन कर दिया है!' });
    return;
  }

  const worker = db.users.find(u => u.id === workerId);

  const newApp: Application = {
    id: `app_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    jobId: id,
    jobTitle: job.title,
    employerId: job.employerId,
    workerId,
    workerName: workerName || worker?.name || 'मजदूर साथी',
    workerPhone: workerPhone || worker?.phone || '',
    workerLocation: workerLocation || worker?.location || 'भारत',
    workerSkills: workerSkills || worker?.skills || [job.category],
    workerExperienceYears: workerExperienceYears ? Number(workerExperienceYears) : (worker?.experienceYears || 1),
    note: note || '',
    status: 'pending',
    assignedByAdmin: false,
    createdAt: new Date().toISOString()
  };

  db.applications.unshift(newApp);
  saveDatabase(db);

  res.status(201).json({
    application: newApp,
    message: 'आपका आवेदन सफलतापूर्वक प्राप्त हुआ! काम मित्र एडमिन द्वारा समन्वय कर आपको सूचित किया जाएगा।'
  });
});

app.get('/api/applications', (req: Request, res: Response) => {
  const { workerId, employerId, jobId, requesterRole } = req.query;
  const db = loadDatabase();

  let apps = db.applications;

  if (workerId) {
    apps = apps.filter(a => a.workerId === workerId);
  }
  if (employerId) {
    apps = apps.filter(a => a.employerId === employerId);
  }
  if (jobId) {
    apps = apps.filter(a => a.jobId === jobId);
  }

  apps.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Privacy protection: Only admin gets to see phone numbers
  if (requesterRole !== 'admin') {
    apps = apps.map(a => {
      const { workerPhone, ...safeApp } = a;
      return safeApp as Application;
    });
  }

  res.json(apps);
});

app.patch('/api/applications/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const db = loadDatabase();
  const appItem = db.applications.find(a => a.id === id);
  if (!appItem) {
    res.status(404).json({ error: 'आवेदन नहीं मिला।' });
    return;
  }
  appItem.status = status;
  saveDatabase(db);
  res.json({ application: appItem, message: 'आवेदन की स्थिति अपडेट हो गई।' });
});

// 6. Agricultural Machinery Services ("कृषि मशीनरी एवं ट्रैक्टर सेवा")
app.get('/api/machinery/listings', (req: Request, res: Response) => {
  const { equipmentType, status, providerId } = req.query;
  const db = loadDatabase();

  let listings = db.machineryListings;
  if (providerId) {
    listings = listings.filter(l => l.providerId === providerId);
  } else {
    // Only approved for public
    listings = listings.filter(l => l.status === 'approved' && l.availability);
  }

  if (equipmentType && equipmentType !== 'सभी') {
    listings = listings.filter(l => l.equipmentType.includes(String(equipmentType)));
  }

  // Scrub provider phones from public view
  const safeListings = listings.map(l => {
    const { providerPhone, ...safe } = l;
    return safe;
  });

  res.json(safeListings);
});

// Provider registers new machinery
app.post('/api/machinery/listings', (req: Request, res: Response) => {
  const { providerId, equipmentType, tractorModel, horsepower, availableImplements, serviceArea, rateDisplay } = req.body;
  if (!providerId || !equipmentType || !serviceArea) {
    res.status(400).json({ error: 'कृपया उपकरण का प्रकार और सेवा क्षेत्र अवश्य भरें।' });
    return;
  }

  const db = loadDatabase();
  const provider = db.users.find(u => u.id === providerId);

  const newListing: MachineryListing = {
    id: `mach_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    providerId,
    providerName: provider?.name || 'कृषि सेवा प्रदाता',
    providerPhone: provider?.phone || '',
    equipmentType,
    tractorModel: tractorModel || '',
    horsepower: horsepower || '',
    availableImplements: Array.isArray(availableImplements) ? availableImplements : [equipmentType],
    serviceArea,
    rateDisplay: rateDisplay || 'बातचीत अनुसार',
    availability: true,
    status: 'approved', // Auto-approves for smooth prototyping, admin can review
    createdAt: new Date().toISOString()
  };

  db.machineryListings.unshift(newListing);
  db.auditLogs.unshift({
    id: `log_${Date.now()}`,
    action: 'नई कृषि मशीनरी दर्ज हुई',
    adminName: 'सिस्टम',
    details: `${newListing.providerName} - ${equipmentType}`,
    timestamp: new Date().toISOString()
  });

  saveDatabase(db);
  res.status(201).json({ listing: newListing, message: 'आपकी कृषि मशीनरी सफलतापूर्वक सूचीबद्ध हो गई है।' });
});

// Farmer books agricultural machinery
app.post('/api/machinery/book', (req: Request, res: Response) => {
  const {
    farmerId,
    serviceType,
    tractorType,
    horsepowerRange,
    implementRequired,
    villageFarmLocation,
    district,
    farmAreaAcres,
    cropType,
    bookingDate,
    bookingTime,
    workingHours,
    budget,
    instructions
  } = req.body;

  if (!farmerId || !serviceType || !villageFarmLocation || !bookingDate) {
    res.status(400).json({ error: 'कृपया आवश्यक सेवा, गाँव/खेत का स्थान और तारीख अवश्य भरें।' });
    return;
  }

  const db = loadDatabase();
  const farmer = db.users.find(u => u.id === farmerId);

  const randomRefNum = Math.floor(1000 + Math.random() * 9000);
  const referenceId = `KM-MBK-${randomRefNum}`;

  const numAcres = parseFloat(farmAreaAcres) || 1;
  const estimatedPrice = budget ? parseInt(budget.replace(/\D/g, '')) || (numAcres * 800) : (numAcres * 800);
  const platformCommission = Math.round(estimatedPrice * (db.settings.commissionPercent / 100));

  const newBooking: MachineryBooking = {
    id: `mbk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    referenceId,
    farmerId,
    farmerName: farmer?.name || 'किसान साथी',
    farmerPhone: farmer?.phone || '',
    serviceType,
    tractorType: tractorType || 'ट्रैक्टर मय ड्राइवर',
    horsepowerRange: horsepowerRange || '45-55 HP',
    implementRequired: implementRequired || serviceType,
    villageFarmLocation,
    district: district || farmer?.district || '',
    farmAreaAcres: farmAreaAcres || '1 एकड़',
    cropType: cropType || 'सामान्य फसल',
    bookingDate,
    bookingTime: bookingTime || 'सुबह 08:00 बजे',
    workingHours: workingHours || '4 घंटे',
    budget: budget || `₹${estimatedPrice}`,
    instructions: instructions || '',
    status: 'request_submitted',
    estimatedPrice,
    platformCommission,
    paymentStatus: 'pending',
    createdAt: new Date().toISOString()
  };

  db.machineryBookings.unshift(newBooking);
  db.auditLogs.unshift({
    id: `log_${Date.now()}`,
    action: 'नई ट्रैक्टर व मशीनरी बुकिंग अनुरोध',
    adminName: 'किसान: ' + newBooking.farmerName,
    targetId: referenceId,
    details: `${serviceType} - ${villageFarmLocation}`,
    timestamp: new Date().toISOString()
  });

  saveDatabase(db);

  res.status(201).json({
    booking: newBooking,
    referenceId,
    message: `बुकिंग अनुरोध प्राप्त हुआ! संदर्भ आईडी: ${referenceId}। काम मित्र एडमिन जल्द ही योग्य मशीनरी प्रदाता नियुक्त करेंगे।`
  });
});

app.get('/api/machinery/bookings', (req: Request, res: Response) => {
  const { farmerId, providerId, status, requesterRole } = req.query;
  const db = loadDatabase();

  let bookings = db.machineryBookings;

  if (farmerId) {
    bookings = bookings.filter(b => b.farmerId === farmerId);
  }
  if (providerId) {
    bookings = bookings.filter(b => b.assignedProviderId === providerId);
  }
  if (status) {
    bookings = bookings.filter(b => b.status === status);
  }

  // Privacy protection: scrub personal numbers unless admin
  if (requesterRole !== 'admin') {
    bookings = bookings.map(b => {
      const { farmerPhone, ...safe } = b;
      return safe as MachineryBooking;
    });
  }

  res.json(bookings);
});

// 7. Vehicle & Transport Services
app.post('/api/vehicles/book', (req: Request, res: Response) => {
  const {
    customerId,
    vehicleType,
    pickupLocation,
    destination,
    goodsDescription,
    bookingDate,
    bookingTime,
    budget,
    specialRequirements
  } = req.body;

  if (!customerId || !vehicleType || !pickupLocation || !destination) {
    res.status(400).json({ error: 'कृपया वाहन प्रकार, पिकअप स्थान और गंतव्य अवश्य भरें।' });
    return;
  }

  const db = loadDatabase();
  const customer = db.users.find(u => u.id === customerId);

  const randomRefNum = Math.floor(2000 + Math.random() * 8000);
  const referenceId = `KM-VBK-${randomRefNum}`;

  const estimatedPrice = budget ? parseInt(budget.replace(/\D/g, '')) || 1500 : 1500;
  const platformCommission = Math.round(estimatedPrice * (db.settings.commissionPercent / 100));

  const newBooking: VehicleBooking = {
    id: `vbk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    referenceId,
    customerId,
    customerName: customer?.name || 'ग्राहक',
    customerPhone: customer?.phone || '',
    vehicleType,
    pickupLocation,
    destination,
    goodsDescription: goodsDescription || 'सामान्य माल',
    bookingDate: bookingDate || new Date().toISOString().split('T')[0],
    bookingTime: bookingTime || 'सुबह 09:00 बजे',
    budget: budget || `₹${estimatedPrice}`,
    specialRequirements: specialRequirements || '',
    status: 'request_submitted',
    estimatedPrice,
    platformCommission,
    paymentStatus: 'pending',
    createdAt: new Date().toISOString()
  };

  db.vehicleBookings.unshift(newBooking);
  db.auditLogs.unshift({
    id: `log_${Date.now()}`,
    action: 'नया वाहन बुकिंग अनुरोध',
    adminName: 'ग्राहक: ' + newBooking.customerName,
    targetId: referenceId,
    details: `${vehicleType} (${pickupLocation} से ${destination})`,
    timestamp: new Date().toISOString()
  });

  saveDatabase(db);

  res.status(201).json({
    booking: newBooking,
    referenceId,
    message: `वाहन बुकिंग अनुरोध दर्ज हुआ! संदर्भ आईडी: ${referenceId}। काम मित्र व्यवस्थापक वाहन आवंटित करेंगे।`
  });
});

app.get('/api/vehicles/bookings', (req: Request, res: Response) => {
  const { customerId, providerId, status, requesterRole } = req.query;
  const db = loadDatabase();

  let bookings = db.vehicleBookings;

  if (customerId) {
    bookings = bookings.filter(b => b.customerId === customerId);
  }
  if (providerId) {
    bookings = bookings.filter(b => b.assignedProviderId === providerId);
  }
  if (status) {
    bookings = bookings.filter(b => b.status === status);
  }

  if (requesterRole !== 'admin') {
    bookings = bookings.map(b => {
      const { customerPhone, ...safe } = b;
      return safe as VehicleBooking;
    });
  }

  res.json(bookings);
});

// 8. Complaints & Customer Support Tickets
app.post('/api/complaints', (req: Request, res: Response) => {
  const { userId, category, relatedReferenceId, subject, description } = req.body;

  if (!userId || !subject || !description) {
    res.status(400).json({ error: 'कृपया विषय, श्रेणी और अपनी शिकायत/पूछताछ का पूरा विवरण लिखें।' });
    return;
  }

  const db = loadDatabase();
  const user = db.users.find(u => u.id === userId);

  const ticketNumber = `KM-TIC-${Math.floor(100 + Math.random() * 900)}`;

  const newTicket: ComplaintTicket = {
    id: `comp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    ticketId: ticketNumber,
    userId,
    userName: user?.name || 'उपयोगकर्ता',
    userPhone: user?.phone || '',
    userRole: user?.role || 'worker',
    category: category || 'general_complaint',
    relatedReferenceId: relatedReferenceId || '',
    subject,
    description,
    status: 'open',
    adminReply: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.complaints.unshift(newTicket);
  db.auditLogs.unshift({
    id: `log_${Date.now()}`,
    action: 'नई शिकायत / सहायता टिकट',
    adminName: newTicket.userName,
    targetId: ticketNumber,
    details: `${subject} (${category})`,
    timestamp: new Date().toISOString()
  });

  saveDatabase(db);

  res.status(201).json({
    ticket: newTicket,
    ticketNumber,
    message: `आपकी शिकायत दर्ज हो गई है! टिकट नंबर: ${ticketNumber}। आप आधिकारिक नंबर ${db.settings.ownerPhone} पर भी संपर्क कर सकते हैं।`
  });
});

app.get('/api/complaints', (req: Request, res: Response) => {
  const { userId, requesterRole } = req.query;
  const db = loadDatabase();

  let tickets = db.complaints;
  if (userId && requesterRole !== 'admin') {
    tickets = tickets.filter(t => t.userId === userId);
  }

  res.json(tickets);
});

app.put('/api/complaints/:id/reply', (req: Request, res: Response) => {
  const { id } = req.params;
  const { adminPhone, adminReply, status } = req.body;

  const db = loadDatabase();
  const admin = db.users.find(u => u.phone === adminPhone && u.role === 'admin');
  if (!admin) {
    res.status(403).json({ error: 'केवल अधिकृत व्यवस्थापक ही शिकायत का जवाब दे सकते हैं।' });
    return;
  }

  const ticket = db.complaints.find(t => t.id === id);
  if (!ticket) {
    res.status(404).json({ error: 'शिकायत टिकट नहीं मिला।' });
    return;
  }

  if (adminReply) ticket.adminReply = adminReply;
  if (status) ticket.status = status;
  ticket.updatedAt = new Date().toISOString();

  db.auditLogs.unshift({
    id: `log_${Date.now()}`,
    action: 'शिकायत का समाधान / उत्तर',
    adminName: admin.name,
    targetId: ticket.ticketId,
    details: `स्थिति: ${status || ticket.status}`,
    timestamp: new Date().toISOString()
  });

  saveDatabase(db);
  res.json({ ticket, message: 'शिकायत पर कार्रवाई दर्ज कर दी गई।' });
});

// 9. Admin Assignment & Control (Only authorized owner)
app.get('/api/admin/overview', (req: Request, res: Response) => {
  const { adminPhone } = req.query;
  const db = loadDatabase();

  // Verify admin authorization
  const admin = db.users.find(u => u.phone === adminPhone && u.role === 'admin');
  if (!admin) {
    res.status(403).json({ error: 'अनधिकृत प्रवेश: यह पैनल केवल मुख्य व्यवस्थापक के लिए आरक्षित है।' });
    return;
  }

  const totalUsers = db.users.length;
  const totalWorkers = db.users.filter(u => u.role === 'worker').length;
  const totalEmployers = db.users.filter(u => u.role === 'employer').length;
  const totalFarmers = db.users.filter(u => u.role === 'farmer').length;
  const totalProviders = db.users.filter(u => u.role === 'machinery_provider').length;

  const totalJobs = db.jobs.length;
  const activeJobs = db.jobs.filter(j => j.status === 'active').length;
  const totalApplications = db.applications.length;

  const totalMachineryBookings = db.machineryBookings.length;
  const totalVehicleBookings = db.vehicleBookings.length;
  const pendingMachinery = db.machineryBookings.filter(b => b.status === 'request_submitted' || b.status === 'pending_admin_review').length;
  const pendingVehicles = db.vehicleBookings.filter(b => b.status === 'request_submitted' || b.status === 'pending_admin_review').length;

  const totalComplaints = db.complaints.length;
  const openComplaints = db.complaints.filter(c => c.status === 'open' || c.status === 'in_progress').length;

  // Total platform commission revenue estimate
  const machineryEarnings = db.machineryBookings
    .filter(b => b.status === 'completed')
    .reduce((acc, curr) => acc + (curr.platformCommission || 0), 0);
  const vehicleEarnings = db.vehicleBookings
    .filter(b => b.status === 'completed')
    .reduce((acc, curr) => acc + (curr.platformCommission || 0), 0);

  res.json({
    totalUsers,
    totalWorkers,
    totalEmployers,
    totalFarmers,
    totalProviders,
    totalJobs,
    activeJobs,
    totalApplications,
    totalMachineryBookings,
    totalVehicleBookings,
    pendingBookings: pendingMachinery + pendingVehicles,
    totalComplaints,
    openComplaints,
    totalEarnings: machineryEarnings + vehicleEarnings,
    allUsers: db.users.map(u => {
      const { passwordHash, salt, securityAnswerHash, ...safe } = u;
      return safe;
    }),
    allJobs: db.jobs,
    allMachineryBookings: db.machineryBookings,
    allVehicleBookings: db.vehicleBookings,
    allComplaints: db.complaints,
    allMachineryListings: db.machineryListings,
    auditLogs: db.auditLogs.slice(0, 30),
    settings: db.settings
  });
});

// Assign worker to job
app.post('/api/admin/jobs/:id/assign', (req: Request, res: Response) => {
  const { id } = req.params;
  const { adminPhone, workerId, notes } = req.body;

  const db = loadDatabase();
  const admin = db.users.find(u => u.phone === adminPhone && u.role === 'admin');
  if (!admin) {
    res.status(403).json({ error: 'केवल अधिकृत व्यवस्थापक ही असाइनमेंट कर सकते हैं।' });
    return;
  }

  const job = db.jobs.find(j => j.id === id);
  const worker = db.users.find(u => u.id === workerId);
  if (!job || !worker) {
    res.status(404).json({ error: 'काम या मजदूर नहीं मिला।' });
    return;
  }

  let appItem = db.applications.find(a => a.jobId === id && a.workerId === workerId);
  if (!appItem) {
    appItem = {
      id: `app_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      jobId: id,
      jobTitle: job.title,
      employerId: job.employerId,
      workerId: worker.id,
      workerName: worker.name,
      workerPhone: worker.phone,
      workerLocation: worker.location,
      workerSkills: worker.skills || [],
      workerExperienceYears: worker.experienceYears || 1,
      note: notes || 'एडमिन द्वारा सीधे नियुक्त',
      status: 'accepted',
      assignedByAdmin: true,
      createdAt: new Date().toISOString()
    };
    db.applications.unshift(appItem);
  } else {
    appItem.status = 'accepted';
    appItem.assignedByAdmin = true;
  }

  job.assignedWorkerCount = (job.assignedWorkerCount || 0) + 1;

  db.auditLogs.unshift({
    id: `log_${Date.now()}`,
    action: 'मजदूर आवंटन (Job Assignment)',
    adminName: admin.name,
    targetId: job.id,
    details: `${worker.name} को "${job.title}" के लिए नियुक्त किया गया।`,
    timestamp: new Date().toISOString()
  });

  saveDatabase(db);
  res.json({ message: `${worker.name} को काम मित्र द्वारा इस काम पर नियुक्त कर दिया गया है।` });
});

// Assign machinery provider & update booking status
app.patch('/api/admin/bookings/machinery/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { adminPhone, status, assignedProviderId, adminNotes, paymentStatus } = req.body;

  const db = loadDatabase();
  const admin = db.users.find(u => u.phone === adminPhone && u.role === 'admin');
  if (!admin) {
    res.status(403).json({ error: 'केवल अधिकृत व्यवस्थापक ही स्टेटस बदल सकते हैं।' });
    return;
  }

  const booking = db.machineryBookings.find(b => b.id === id || b.referenceId === id);
  if (!booking) {
    res.status(404).json({ error: 'बुकिंग रिकॉर्ड नहीं मिला।' });
    return;
  }

  if (status) booking.status = status;
  if (adminNotes) booking.adminNotes = adminNotes;
  if (paymentStatus) booking.paymentStatus = paymentStatus;

  if (assignedProviderId) {
    const provider = db.users.find(u => u.id === assignedProviderId);
    if (provider) {
      booking.assignedProviderId = provider.id;
      booking.assignedProviderName = provider.name;
    }
  }

  db.auditLogs.unshift({
    id: `log_${Date.now()}`,
    action: `मशीनरी बुकिंग स्थिति: ${status || booking.status}`,
    adminName: admin.name,
    targetId: booking.referenceId,
    details: `प्रदाता: ${booking.assignedProviderName || 'असाइन किया जाना शेष'}, टिप्पणी: ${adminNotes || 'कोई नहीं'}`,
    timestamp: new Date().toISOString()
  });

  saveDatabase(db);
  res.json({ booking, message: 'बुकिंग स्थिति सफलतापूर्वक अपडेट हो गई।' });
});

// Update vehicle booking status & assignment
app.patch('/api/admin/bookings/vehicle/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { adminPhone, status, assignedProviderId, adminNotes, paymentStatus } = req.body;

  const db = loadDatabase();
  const admin = db.users.find(u => u.phone === adminPhone && u.role === 'admin');
  if (!admin) {
    res.status(403).json({ error: 'केवल अधिकृत व्यवस्थापक ही स्टेटस बदल सकते हैं।' });
    return;
  }

  const booking = db.vehicleBookings.find(b => b.id === id || b.referenceId === id);
  if (!booking) {
    res.status(404).json({ error: 'वाहन बुकिंग रिकॉर्ड नहीं मिला।' });
    return;
  }

  if (status) booking.status = status;
  if (adminNotes) booking.adminNotes = adminNotes;
  if (paymentStatus) booking.paymentStatus = paymentStatus;

  if (assignedProviderId) {
    const provider = db.users.find(u => u.id === assignedProviderId);
    if (provider) {
      booking.assignedProviderId = provider.id;
      booking.assignedProviderName = provider.name;
    }
  }

  db.auditLogs.unshift({
    id: `log_${Date.now()}`,
    action: `वाहन बुकिंग स्थिति: ${status || booking.status}`,
    adminName: admin.name,
    targetId: booking.referenceId,
    details: `वाहन: ${booking.vehicleType}, स्थिति: ${status}`,
    timestamp: new Date().toISOString()
  });

  saveDatabase(db);
  res.json({ booking, message: 'वाहन बुकिंग स्थिति सफलतापूर्वक अपडेट हो गई।' });
});

// Ban or unban user
app.patch('/api/admin/users/:id/ban', (req: Request, res: Response) => {
  const { id } = req.params;
  const { adminPhone, isBanned } = req.body;

  const db = loadDatabase();
  const admin = db.users.find(u => u.phone === adminPhone && u.role === 'admin');
  if (!admin) {
    res.status(403).json({ error: 'केवल अधिकृत व्यवस्थापक ही कार्रवाई कर सकते हैं।' });
    return;
  }

  const user = db.users.find(u => u.id === id);
  if (!user) {
    res.status(404).json({ error: 'उपयोगकर्ता नहीं मिला।' });
    return;
  }

  user.isBanned = Boolean(isBanned);

  db.auditLogs.unshift({
    id: `log_${Date.now()}`,
    action: isBanned ? 'खाता निलंबित (User Banned)' : 'खाता बहाल (User Unbanned)',
    adminName: admin.name,
    targetId: user.phone,
    details: `${user.name} (${user.role}) को ${isBanned ? 'निलंबित किया गया' : 'बहाल किया गया'}।`,
    timestamp: new Date().toISOString()
  });

  saveDatabase(db);
  res.json({ user: scrubUser(user), message: isBanned ? 'संदिग्ध खाता ब्लॉक (बैन) किया गया।' : 'खाता दोबारा सक्रिय किया गया।' });
});

// Verify or reject job post
app.patch('/api/admin/jobs/:id/verify', (req: Request, res: Response) => {
  const { id } = req.params;
  const { adminPhone, isVerified, status } = req.body;

  const db = loadDatabase();
  const admin = db.users.find(u => u.phone === adminPhone && u.role === 'admin');
  if (!admin) {
    res.status(403).json({ error: 'केवल अधिकृत व्यवस्थापक ही कार्रवाई कर सकते हैं।' });
    return;
  }

  const job = db.jobs.find(j => j.id === id);
  if (!job) {
    res.status(404).json({ error: 'काम नहीं मिला।' });
    return;
  }

  if (isVerified !== undefined) job.isVerified = Boolean(isVerified);
  if (status) job.status = status;

  db.auditLogs.unshift({
    id: `log_${Date.now()}`,
    action: 'काम की स्थिति बदली गई',
    adminName: admin.name,
    targetId: job.id,
    details: `सत्यापित: ${job.isVerified}, स्थिति: ${job.status}`,
    timestamp: new Date().toISOString()
  });

  saveDatabase(db);
  res.json({ job: scrubJob(job), message: 'काम की स्थिति सफलतापूर्वक अपडेट हो गई।' });
});

// Delete job post
app.delete('/api/admin/jobs/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { adminPhone } = req.body;

  const db = loadDatabase();
  const admin = db.users.find(u => u.phone === adminPhone && u.role === 'admin');
  if (!admin) {
    res.status(403).json({ error: 'केवल अधिकृत व्यवस्थापक ही काम हटा सकते हैं।' });
    return;
  }

  const index = db.jobs.findIndex(j => j.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'काम नहीं मिला।' });
    return;
  }

  const deleted = db.jobs.splice(index, 1)[0];
  db.auditLogs.unshift({
    id: `log_${Date.now()}`,
    action: 'फर्जी काम हटाया गया',
    adminName: admin.name,
    targetId: id,
    details: `शीर्षक: ${deleted.title}`,
    timestamp: new Date().toISOString()
  });

  saveDatabase(db);
  res.json({ success: true, message: 'काम को सफलतापूर्वक हटा दिया गया।' });
});

// Add new category
app.post('/api/categories', (req: Request, res: Response) => {
  const { name, enName, iconName, adminPhone } = req.body;
  if (!name) {
    res.status(400).json({ error: 'श्रेणी का नाम अनिवार्य है।' });
    return;
  }

  const db = loadDatabase();
  const newCat: Category = {
    id: `cat_${Date.now()}`,
    name,
    enName: enName || name,
    iconName: iconName || 'Briefcase',
    jobCount: 0,
    active: true
  };

  db.categories.push(newCat);
  saveDatabase(db);
  res.status(201).json(newCat);
});

// Seed / Reset Database
app.post('/api/admin/reset-database', (req: Request, res: Response) => {
  const { adminPhone } = req.body;
  const db = loadDatabase();
  if (adminPhone !== '9876543210') {
    res.status(403).json({ error: 'केवल मुख्य व्यवस्थापक ही डेटाबेस रीसेट कर सकते हैं।' });
    return;
  }

  const initialData: DatabaseSchema = {
    users: INITIAL_USERS,
    jobs: INITIAL_JOBS,
    applications: INITIAL_APPLICATIONS,
    machineryListings: INITIAL_MACHINERY_LISTINGS,
    machineryBookings: INITIAL_MACHINERY_BOOKINGS,
    vehicleBookings: INITIAL_VEHICLE_BOOKINGS,
    complaints: INITIAL_COMPLAINTS,
    settings: INITIAL_SETTINGS,
    auditLogs: INITIAL_AUDIT_LOGS,
    categories: INITIAL_CATEGORIES,
  };
  saveDatabase(initialData);
  res.json({ message: 'डेटाबेस को सुरक्षित रूप से पुनः लोड कर दिया गया है।' });
});

// Direct Project ZIP Download for mobile phone users & GitHub export
app.get('/api/download-project-zip', (req: Request, res: Response) => {
  try {
    const zipPath = path.join(__dirname, 'kaam-mitra-project.zip');
    execSync('python3 scripts/make_zip.py', { cwd: __dirname });

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="kaam-mitra-complete-project.zip"');
    res.sendFile(zipPath);
  } catch (err: unknown) {
    console.error('Error generating project ZIP:', err);
    res.status(500).json({ error: 'Failed to generate ZIP archive' });
  }
});

// -------------------------------------------------------------
// Vite Server or Static Serving
// -------------------------------------------------------------
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Kaam Mitra Server] Running at http://0.0.0.0:${PORT}`);
    console.log(`[Kaam Mitra Server] Rural India Job & Agricultural Machinery Marketplace ready.`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});

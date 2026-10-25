import {
  User,
  Job,
  Application,
  Category,
  MachineryListing,
  MachineryBooking,
  VehicleBooking,
  ComplaintTicket,
  PlatformSettings,
  AdminOverview
} from './types';

const BASE_URL = '/api';

// Platform settings & owner contact
export async function fetchPlatformSettings(): Promise<PlatformSettings> {
  const res = await fetch(`${BASE_URL}/settings`);
  if (!res.ok) throw new Error('प्लेटफॉर्म सेटिंग्स लोड नहीं हो सकी');
  return res.json();
}

export async function updatePlatformSettings(data: Partial<PlatformSettings> & { adminPhone: string }): Promise<{ settings: PlatformSettings; message: string }> {
  const res = await fetch(`${BASE_URL}/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const resData = await res.json();
  if (!res.ok) throw new Error(resData.error || 'सेटिंग्स अपडेट करने में त्रुटि');
  return resData;
}

// Categories
export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(`${BASE_URL}/categories`);
  if (!res.ok) throw new Error('श्रेणियां लोड करने में त्रुटि');
  return res.json();
}

export async function addCategory(categoryData: { name: string; enName: string; iconName?: string; adminPhone?: string }): Promise<Category> {
  const res = await fetch(`${BASE_URL}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(categoryData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'श्रेणी जोड़ने में त्रुटि');
  return data;
}

// Jobs Marketplace
export async function fetchJobs(params?: { category?: string; search?: string; location?: string; employerId?: string; status?: string; requesterId?: string }): Promise<Job[]> {
  const query = new URLSearchParams();
  if (params?.category) query.append('category', params.category);
  if (params?.search) query.append('search', params.search);
  if (params?.location) query.append('location', params.location);
  if (params?.employerId) query.append('employerId', params.employerId);
  if (params?.status) query.append('status', params.status);
  if (params?.requesterId) query.append('requesterId', params.requesterId);

  const res = await fetch(`${BASE_URL}/jobs?${query.toString()}`);
  if (!res.ok) throw new Error('काम सूची लोड करने में त्रुटि');
  return res.json();
}

export async function createJob(jobData: Partial<Job>): Promise<{ job: Job; message: string }> {
  const res = await fetch(`${BASE_URL}/jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(jobData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'काम पोस्ट करने में त्रुटि');
  return data;
}

export async function deleteJob(id: string, adminPhone?: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${BASE_URL}/admin/jobs/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ adminPhone }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'काम हटाने में त्रुटि');
  return data;
}

// Applications
export async function applyToJob(jobId: string, applicationData: {
  workerId: string;
  workerName?: string;
  workerPhone?: string;
  workerLocation?: string;
  workerSkills?: string[];
  workerExperienceYears?: number;
  note?: string;
}): Promise<{ application: Application; message: string }> {
  const res = await fetch(`${BASE_URL}/jobs/${jobId}/apply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(applicationData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'आवेदन करने में त्रुटि');
  return data;
}

export async function fetchApplications(params: { workerId?: string; employerId?: string; jobId?: string; requesterRole?: string }): Promise<Application[]> {
  const query = new URLSearchParams();
  if (params.workerId) query.append('workerId', params.workerId);
  if (params.employerId) query.append('employerId', params.employerId);
  if (params.jobId) query.append('jobId', params.jobId);
  if (params.requesterRole) query.append('requesterRole', params.requesterRole);

  const res = await fetch(`${BASE_URL}/applications?${query.toString()}`);
  if (!res.ok) throw new Error('आवेदन लोड करने में त्रुटि');
  return res.json();
}

export async function updateApplicationStatus(id: string, status: 'pending' | 'accepted' | 'shortlisted' | 'rejected'): Promise<{ application: Application; message: string }> {
  const res = await fetch(`${BASE_URL}/applications/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'आवेदन अपडेट करने में त्रुटि');
  return data;
}

// Authentication & Users
export async function registerUser(userData: Partial<User> & { password?: string; securityQuestion?: string; securityAnswer?: string }): Promise<{ user: User; message: string }> {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'पंजीकरण में त्रुटि');
  return data;
}

export async function loginUser(phone: string, password?: string): Promise<{ user: User; message: string }> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'लॉगिन में त्रुटि');
  return data;
}

export async function recoverPassword(phone: string, securityAnswer: string, newPassword: string): Promise<{ message: string }> {
  const res = await fetch(`${BASE_URL}/auth/recover`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, securityAnswer, newPassword }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'पासवर्ड रीसेट में त्रुटि');
  return data;
}

export async function updateUserProfile(id: string, data: Partial<User>): Promise<{ user: User; message: string }> {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const resData = await res.json();
  if (!res.ok) throw new Error(resData.error || 'प्रोफाइल अपडेट में त्रुटि');
  return resData;
}

// Agricultural Machinery
export async function fetchMachineryListings(params?: { equipmentType?: string; providerId?: string }): Promise<MachineryListing[]> {
  const query = new URLSearchParams();
  if (params?.equipmentType) query.append('equipmentType', params.equipmentType);
  if (params?.providerId) query.append('providerId', params.providerId);

  const res = await fetch(`${BASE_URL}/machinery/listings?${query.toString()}`);
  if (!res.ok) throw new Error('मशीनरी सूची लोड नहीं हो सकी');
  return res.json();
}

export async function createMachineryListing(data: Partial<MachineryListing>): Promise<{ listing: MachineryListing; message: string }> {
  const res = await fetch(`${BASE_URL}/machinery/listings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const resData = await res.json();
  if (!res.ok) throw new Error(resData.error || 'मशीनरी दर्ज करने में त्रुटि');
  return resData;
}

export async function bookMachinery(data: Partial<MachineryBooking>): Promise<{ booking: MachineryBooking; referenceId: string; message: string }> {
  const res = await fetch(`${BASE_URL}/machinery/book`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const resData = await res.json();
  if (!res.ok) throw new Error(resData.error || 'मशीनरी बुक करने में त्रुटि');
  return resData;
}

export async function fetchMachineryBookings(params?: { farmerId?: string; providerId?: string; requesterRole?: string }): Promise<MachineryBooking[]> {
  const query = new URLSearchParams();
  if (params?.farmerId) query.append('farmerId', params.farmerId);
  if (params?.providerId) query.append('providerId', params.providerId);
  if (params?.requesterRole) query.append('requesterRole', params.requesterRole);

  const res = await fetch(`${BASE_URL}/machinery/bookings?${query.toString()}`);
  if (!res.ok) throw new Error('मशीनरी बुकिंग्स लोड नहीं हो सकीं');
  return res.json();
}

// Vehicle & Goods Transport Booking
export async function bookVehicle(data: Partial<VehicleBooking>): Promise<{ booking: VehicleBooking; referenceId: string; message: string }> {
  const res = await fetch(`${BASE_URL}/vehicles/book`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const resData = await res.json();
  if (!res.ok) throw new Error(resData.error || 'वाहन बुक करने में त्रुटि');
  return resData;
}

export async function fetchVehicleBookings(params?: { customerId?: string; providerId?: string; requesterRole?: string }): Promise<VehicleBooking[]> {
  const query = new URLSearchParams();
  if (params?.customerId) query.append('customerId', params.customerId);
  if (params?.providerId) query.append('providerId', params.providerId);
  if (params?.requesterRole) query.append('requesterRole', params.requesterRole);

  const res = await fetch(`${BASE_URL}/vehicles/bookings?${query.toString()}`);
  if (!res.ok) throw new Error('वाहन बुकिंग्स लोड नहीं हो सकीं');
  return res.json();
}

// Complaints & Support Tickets
export async function createComplaint(data: {
  userId: string;
  category: string;
  relatedReferenceId?: string;
  subject: string;
  description: string;
}): Promise<{ ticket: ComplaintTicket; ticketNumber: string; message: string }> {
  const res = await fetch(`${BASE_URL}/complaints`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const resData = await res.json();
  if (!res.ok) throw new Error(resData.error || 'शिकायत दर्ज करने में त्रुटि');
  return resData;
}

export async function fetchComplaints(params?: { userId?: string; requesterRole?: string }): Promise<ComplaintTicket[]> {
  const query = new URLSearchParams();
  if (params?.userId) query.append('userId', params.userId);
  if (params?.requesterRole) query.append('requesterRole', params.requesterRole);

  const res = await fetch(`${BASE_URL}/complaints?${query.toString()}`);
  if (!res.ok) throw new Error('शिकायतें लोड नहीं हो सकीं');
  return res.json();
}

export async function replyComplaint(id: string, data: { adminPhone: string; adminReply: string; status?: string }): Promise<{ ticket: ComplaintTicket; message: string }> {
  const res = await fetch(`${BASE_URL}/complaints/${id}/reply`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const resData = await res.json();
  if (!res.ok) throw new Error(resData.error || 'शिकायत पर उत्तर देने में त्रुटि');
  return resData;
}

// Admin Panel APIs
export async function fetchAdminOverview(adminPhone: string): Promise<AdminOverview> {
  const res = await fetch(`${BASE_URL}/admin/overview?adminPhone=${encodeURIComponent(adminPhone)}`);
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'एडमिन डेटा लोड करने में त्रुटि');
  }
  return res.json();
}

export async function assignWorkerToJob(jobId: string, data: { adminPhone: string; workerId: string; notes?: string }): Promise<{ message: string }> {
  const res = await fetch(`${BASE_URL}/admin/jobs/${jobId}/assign`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const resData = await res.json();
  if (!res.ok) throw new Error(resData.error || 'मजदूर असाइन करने में त्रुटि');
  return resData;
}

export async function updateAdminMachineryBooking(id: string, data: {
  adminPhone: string;
  status?: string;
  assignedProviderId?: string;
  adminNotes?: string;
  paymentStatus?: string;
}): Promise<{ booking: MachineryBooking; message: string }> {
  const res = await fetch(`${BASE_URL}/admin/bookings/machinery/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const resData = await res.json();
  if (!res.ok) throw new Error(resData.error || 'बुकिंग अपडेट करने में त्रुटि');
  return resData;
}

export async function updateAdminVehicleBooking(id: string, data: {
  adminPhone: string;
  status?: string;
  assignedProviderId?: string;
  adminNotes?: string;
  paymentStatus?: string;
}): Promise<{ booking: VehicleBooking; message: string }> {
  const res = await fetch(`${BASE_URL}/admin/bookings/vehicle/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const resData = await res.json();
  if (!res.ok) throw new Error(resData.error || 'वाहन बुकिंग अपडेट करने में त्रुटि');
  return resData;
}

export async function toggleUserBan(id: string, isBanned: boolean, adminPhone: string): Promise<{ user: User; message: string }> {
  const res = await fetch(`${BASE_URL}/admin/users/${id}/ban`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isBanned, adminPhone }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'प्रतिबंध बदलने में त्रुटि');
  return data;
}

export async function toggleJobVerified(id: string, isVerified: boolean, adminPhone: string, status?: string): Promise<{ job: Job; message: string }> {
  const res = await fetch(`${BASE_URL}/admin/jobs/${id}/verify`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isVerified, adminPhone, status }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'सत्यापन बदलने में त्रुटि');
  return data;
}

export async function resetDatabase(adminPhone: string): Promise<{ message: string }> {
  const res = await fetch(`${BASE_URL}/admin/reset-database`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ adminPhone }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'रीसेट में त्रुटि');
  return data;
}

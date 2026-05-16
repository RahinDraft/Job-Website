export type JobCategory = 'সরকারি' | 'বেসরকারি' | 'ব্যাংক' | 'এনজিও' | 'সব';

export interface JobPosition {
  name: string;
  vacancy: string;
  grade?: string;
  applicationFee?: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  category: JobCategory;
  location: string;
  deadline: string;
  description: string;
  requirements: string[];
  salary?: string;
  companyLogoUrl?: string;
  circularImageUrl?: string;
  positions?: JobPosition[];
  applicationFee?: string;
  searchKeywords?: string;
  seoTitle?: string;
  seoDescription?: string;
  minEducationLevel?: number;
}

export interface User {
  id: string;
  username: string;
  password?: string;
  role: 'admin' | 'user';
  fullName: string;
  email?: string;
  mobile: string;
  createdAt?: string;
  isOnline?: boolean;
}

export interface Address {
  careOf: string;
  village: string;
  district: string;
  upazila: string;
  postOffice: string;
  postCode: string;
}

export interface CV {
  userId: string;
  error?: string;
  personalInfo: {
    fullNameEn: string;
    fullNameBn: string;
    fatherNameEn: string;
    fatherNameBn: string;
    motherNameEn: string;
    motherNameBn: string;
    dob: string;
    nationality: string;
    religion: string;
    gender: string;
    nid: string;
    birthReg: string;
    passportId: string;
    maritalStatus: string;
    mobile: string;
    email: string;
    quota: string;
    deptStatus: string;
    photoUrl?: string;
    signatureUrl?: string;
  };
  presentAddress: Address;
  permanentAddress: Address;
  education: {
    level?: string;
    isApplicable?: boolean;
    examination: string;
    board: string;
    roll: string;
    registration: string;
    resultType: string;
    result: string;
    group: string;
    year: string;
    duration: string;
  }[];
  experience: {
    position: string;
    company: string;
    duration: string;
    description: string;
  }[];
  skills: string[];
}

export interface AdminStats {
  totalVisitors: number;
  activeVisitors: number;
  registeredUsers: number;
  loggedInUsers: number;
  newMessages?: number;
}

export interface Stats {
  total: number;
  byCategory: { category: string; count: number }[];
}

export interface Order {
  id: string;
  userId: string;
  jobId: string;
  selectedPost?: string;
  transactionId?: string; // Optional initially until payment step
  paymentMethod?: string;
  status: 'Ordered' | 'Demo Sent' | 'Payment Sent' | 'Completed' | 'Rejected';
  statusHistory?: {
    status: string;
    timestamp: string;
    note?: string;
  }[];
  amount: string;
  jobFee?: string;
  serviceCharge?: string;
  createdAt: string;
  jobTitle?: string;
  company?: string;
  userName?: string;
  userMobile?: string;
  demoCopyUrl?: string;
  finalCopyUrl?: string;
  adminNote?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export interface SiteSettings {
  siteName: string;
  primaryColor: string;
  contactPhone: string;
  contactEmail: string;
  noticeText: string;
  bkashNumber: string;
  nagadNumber: string;
  applicationFee: string;
  heroTitle: string;
  heroSubtitle: string;
  footerText: string;
  facebookLink: string;
  youtubeLink: string;
  logoUrl: string;
  aboutText: string;
  contactAddress: string;
  paymentInstructions: string;
  seoTitle: string;
  seoDescription: string;
  serviceCharge: string;
  whatsappNumber: string;
}

export interface Reply {
  id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
  isAdmin: boolean;
}

export interface Comment {
  id: string;
  jobId: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
  replies: Reply[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: string;
}

export interface ServiceRequest {
  id: string;
  userId: string;
  type: string;
  photoUrl: string;
  signatureUrl: string;
  processedPhotoUrl?: string;
  processedSignatureUrl?: string;
  status: 'Pending' | 'Processing' | 'Completed' | 'Rejected';
  transactionId: string;
  paymentMethod: string;
  createdAt: string;
  userName?: string;
  userMobile?: string;
}

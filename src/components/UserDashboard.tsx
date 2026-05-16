import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, CV, Address, Order, Job } from '../types';
import { User as UserIcon, FileText, Settings, LogOut, Download, Plus, Trash2, Save, Globe, Check, Briefcase, Clock, X, ChevronRight, Bookmark, MapPin, Building2, Calendar, LayoutDashboard, Landmark } from 'lucide-react';
import { BD_LOCATIONS } from '../data/locations';

const EXAMINATIONS: Record<number, string[]> = {
  0: ['S.S.C', 'Dakhil', 'S.S.C Vocational', 'O Level/Cambridge', 'S.S.C Equivalent', 'Dakhil Vocational'],
  1: ['H.S.C', 'Alim', 'Business Management', 'Diploma-in-Engineering', 'A Level/Sr. Cambridge', 'H.S.C Equivalent', 'Diploma in Medical Technology', 'H.S.C Vocational', 'H.S.C (BM)', 'Diploma in Pharmacy', 'Diploma in Fisheries'],
  2: ['B.Sc Engineering', 'B.Sc in Agricultural Science', 'M.B.B.S./B.D.S', 'Honors', 'Pass Course', 'Fazil', 'B.B.A.', 'Graduation Equivalent'],
  3: ['M.A', 'M.S.S', 'M.Sc', 'M.Com', 'M.B.A', 'L.L.M', 'Kamil', 'Masters Equivalent']
};

const BOARDS = [
  'Barishal', 'Chattogram', 'Cumilla', 'Dhaka', 'Dinajpur', 'Jashore', 'Madrasah', 'Mymensingh', 'Rajshahi', 'Sylhet',
  'Open University', 'Edexcel International', 'Cambridge International - IGCE', 'Pharmacy Council of Bangladesh', 'The State Medical Faculty of Bangladesh', 'Bangladesh Technical Education Board (BTEB)', 'Other'
];

const UNIVERSITIES = [
  'National University', 'Dhaka University', 'Rajshahi University', 'Chittagong University', 'Jahangirnagar University', 'Jagannath University', 'Islamic University', 'Khulna University', 'Barisal University', 'Comilla University', 'Begum Rokeya University', 'Jatiya Kabi Kazi Nazrul Islam University', 'Bangladesh University of Professionals', 'BUET', 'RUET', 'CUET', 'KUET', 'DUET', 'Other'
];

const RESULTS = [
  '1st Division', '2nd Division', '3rd Division', 'GPA(out of 4)', 'GPA(out of 5)', 'Class/Division', 'Appeared'
];

const GROUPS_SSC_HSC = [
  'Business Studies', 'General', 'Humanities', 'Science', 'Other'
];

const SUBJECTS_GRAD = [
  'Accounting', 'Management', 'Finance', 'Marketing', 'Computer Science & Engineering', 'Electrical & Electronic Engineering', 'Civil Engineering', 'Mechanical Engineering', 'Architecture', 'Physics', 'Chemistry', 'Mathematics', 'Statistics', 'Botany', 'Zoology', 'English', 'Bengali', 'Economics', 'Political Science', 'Sociology', 'Public Administration', 'International Relations', 'History', 'Islamic History & Culture', 'Philosophy', 'Law', 'Pharmacy', 'Agriculture', 'Medicine', 'Other'
];

const DURATIONS = [
  '01 Year', '02 Years', '03 Years', '04 Years', '05 Years'
];

const YEARS = Array.from({ length: 50 }, (_, i) => (new Date().getFullYear() - i).toString());

interface UserDashboardProps {
  user: User;
  onLogout: () => void;
  onBack: () => void;
  onAdmin?: () => void;
  initialTab?: 'profile' | 'cv' | 'orders' | 'saved';
  onCvUpdate?: (cv: CV) => void;
  siteSettings: any;
  savedJobs?: Job[];
  onToggleSaveJob?: (job: Job) => void;
  showToast?: (message: string, type: 'success' | 'error' | 'info') => void;
}

const AddressFields = ({ title, type, formData, setFormData, sameAsPresent, setSameAsPresent }: { 
  title: string, 
  type: 'presentAddress' | 'permanentAddress',
  formData: CV,
  setFormData: React.Dispatch<React.SetStateAction<CV>>,
  sameAsPresent: boolean,
  setSameAsPresent: React.Dispatch<React.SetStateAction<boolean>>
}) => (
  <section className="space-y-4 p-6 bg-gray-50 rounded-2xl">
    <div className="flex justify-between items-center border-b pb-2">
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      {type === 'permanentAddress' && (
        <label className="flex items-center gap-2 cursor-pointer group">
          <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${sameAsPresent ? 'bg-emerald-600 border-emerald-600' : 'bg-white border-gray-300 group-hover:border-emerald-500'}`}>
            {sameAsPresent && <Check className="w-3.5 h-3.5 text-white" />}
          </div>
          <input
            type="checkbox"
            className="hidden"
            checked={sameAsPresent}
            onChange={e => setSameAsPresent(e.target.checked)}
          />
          <span className="text-xs font-bold text-gray-600">Same as Present</span>
        </label>
      )}
    </div>
    <div className="grid grid-cols-2 gap-4">
      {[
        { label: 'Care Of', key: 'careOf', required: true },
        { label: 'Vill/ Road/ House/ Flat', key: 'village', required: true },
        { label: 'District', key: 'district', type: 'select', required: true },
        { label: 'Upazila/P.S.', key: 'upazila', type: 'select', required: true },
        { label: 'Post Office', key: 'postOffice', required: true },
        { label: 'Post Code', key: 'postCode', type: 'text', pattern: "\\d{4}", inputMode: 'numeric', required: true },
      ].map(field => (
        <div key={field.key} className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">{field.label} *</label>
          {field.key === 'district' ? (
            <select
              value={(formData[type] as any)[field.key]}
              required={field.required}
              disabled={type === 'permanentAddress' && sameAsPresent}
              onChange={e => {
                const newDistrict = e.target.value;
                setFormData({ 
                  ...formData, 
                  [type]: { 
                    ...formData[type], 
                    district: newDistrict,
                    upazila: '' // Reset upazila when district changes
                  } 
                });
              }}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Select District</option>
              {Object.keys(BD_LOCATIONS).sort().map(dist => (
                <option key={dist} value={dist}>{dist}</option>
              ))}
            </select>
          ) : field.key === 'upazila' ? (
            <select
              value={(formData[type] as any)[field.key]}
              required={field.required}
              disabled={(type === 'permanentAddress' && sameAsPresent) || !(formData[type] as any).district}
              onChange={e => setFormData({ 
                ...formData, 
                [type]: { ...formData[type], upazila: e.target.value } 
              })}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Select Upazila</option>
              {((formData[type] as any).district && BD_LOCATIONS[(formData[type] as any).district]) ? (
                BD_LOCATIONS[(formData[type] as any).district].sort().map(upz => (
                  <option key={upz} value={upz}>{upz}</option>
                ))
              ) : null}
            </select>
          ) : (
            <input
              type={field.type || "text"}
              value={(formData[type] as any)[field.key] || ''}
              required={field.required}
              pattern={(field as any).pattern}
              inputMode={(field as any).inputMode}
              disabled={type === 'permanentAddress' && sameAsPresent}
              onChange={e => setFormData({ 
                ...formData, 
                [type]: { ...formData[type], [field.key]: e.target.value } 
              })}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          )}
        </div>
      ))}
    </div>
  </section>
);

const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

export const UserDashboard: React.FC<UserDashboardProps> = ({ 
  user, 
  onLogout, 
  onBack, 
  onAdmin, 
  initialTab = 'profile', 
  onCvUpdate, 
  siteSettings,
  savedJobs = [],
  onToggleSaveJob,
  showToast
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'cv' | 'orders' | 'saved'>(initialTab);
  const [cv, setCv] = useState<CV | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isEditingCV, setIsEditingCV] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setDataLoading(true);
      await Promise.all([fetchCV(), fetchOrders()]);
      setDataLoading(false);
    };
    loadData();
  }, [user.id]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/users/${user.id}/orders`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchCV = async () => {
    try {
      const response = await fetch(`/api/cv/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setCv(data);
      }
    } catch (error) {
      console.error('Error fetching CV:', error);
    }
  };

  const saveCV = async (cvData: CV) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/cv/${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cvData),
      });
      if (response.ok) {
        setCv(cvData);
        if (onCvUpdate) onCvUpdate(cvData);
        setIsEditingCV(false);
        setMessage({ type: 'success', text: 'সিভি সফলভাবে সেভ করা হয়েছে!' });
      } else {
        setMessage({ type: 'error', text: 'সিভি সেভ করা সম্ভব হয়নি।' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'সার্ভার ত্রুটি!' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const submitPayment = async (orderId: string, transactionId: string, paymentMethod: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/orders/${orderId}/payment`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId, paymentMethod }),
      });
      if (response.ok) {
        showToast?.('পেমেন্ট তথ্য সফলভাবে জমাদিন করা হয়েছে!', 'success');
        fetchOrders();
        setSelectedOrder(null);
      } else {
        showToast?.('পেমেন্ট তথ্য জমাদিন করা সম্ভব হয়নি।', 'error');
      }
    } catch (error) {
      showToast?.('সার্ভার ত্রুটি!', 'error');
    } finally {
      setLoading(false);
    }
  };

  const defaultCV: CV = {
    userId: user.id,
    personalInfo: {
      fullNameEn: user.fullName || '',
      fullNameBn: '',
      fatherNameEn: '',
      fatherNameBn: '',
      motherNameEn: '',
      motherNameBn: '',
      dob: '',
      nationality: 'Bangladeshi',
      religion: '',
      gender: '',
      nid: '',
      birthReg: '',
      passportId: '',
      maritalStatus: '',
      mobile: user.mobile || '',
      email: user.email || '',
      quota: '',
      deptStatus: '',
    },
    presentAddress: {
      careOf: '',
      village: '',
      district: '',
      upazila: '',
      postOffice: '',
      postCode: '',
    },
    permanentAddress: {
      careOf: '',
      village: '',
      district: '',
      upazila: '',
      postOffice: '',
      postCode: '',
    },
    education: [
      { level: 'SSC/Equivalent Level', isApplicable: true, examination: '', board: '', roll: '', registration: '', resultType: '', result: '', group: '', year: '', duration: '' },
      { level: 'HSC/Equivalent Level', isApplicable: true, examination: '', board: '', roll: '', registration: '', resultType: '', result: '', group: '', year: '', duration: '' },
      { level: 'Graduation/Equivalent Level', isApplicable: false, examination: '', board: '', roll: '', registration: '', resultType: '', result: '', group: '', year: '', duration: '' },
      { level: 'Masters/Equivalent Level', isApplicable: false, examination: '', board: '', roll: '', registration: '', resultType: '', result: '', group: '', year: '', duration: '' },
    ],
    experience: [],
    skills: [],
  };

  const generateDemoCV = () => {
    const demoCV: CV = {
      userId: user.id,
      personalInfo: {
        fullNameEn: 'MD. DEMO USER',
        fullNameBn: 'মোঃ ডেমো ইউজার',
        fatherNameEn: 'MD. FATHER NAME',
        fatherNameBn: 'মোঃ পিতার নাম',
        motherNameEn: 'MRS. MOTHER NAME',
        motherNameBn: 'মোসাঃ মাতার নাম',
        dob: '1995-01-01',
        nationality: 'Bangladeshi',
        religion: 'Islam',
        gender: 'Male',
        nid: '1234567890',
        birthReg: '19951234567890123',
        passportId: 'A01234567',
        maritalStatus: 'Single',
        mobile: user.mobile || '01700000000',
        email: user.email || 'demo@example.com',
        quota: 'None',
        deptStatus: 'None',
      },
      presentAddress: {
        careOf: 'MD. FATHER NAME',
        village: 'Demo Village, Road 01',
        district: 'Dhaka',
        upazila: 'Dhanmondi',
        postOffice: 'Dhanmondi',
        postCode: '1209',
      },
      permanentAddress: {
        careOf: 'MD. FATHER NAME',
        village: 'Demo Village, Road 01',
        district: 'Dhaka',
        upazila: 'Dhanmondi',
        postOffice: 'Dhanmondi',
        postCode: '1209',
      },
      education: [
        { level: 'SSC/Equivalent Level', isApplicable: true, examination: 'S.S.C', board: 'Dhaka', roll: '123456', registration: '1234567890', resultType: 'GPA(out of 5)', result: '5.00', group: 'Science', year: '2011', duration: '2 Years' },
        { level: 'HSC/Equivalent Level', isApplicable: true, examination: 'H.S.C', board: 'Dhaka', roll: '654321', registration: '1234567890', resultType: 'GPA(out of 5)', result: '5.00', group: 'Science', year: '2013', duration: '2 Years' },
        { level: 'Graduation/Equivalent Level', isApplicable: true, examination: 'B.Sc Engineering', board: 'Dhaka University', roll: '112233', registration: '445566', resultType: 'GPA(out of 4)', result: '3.85', group: 'Computer Science & Engineering', year: '2017', duration: '4 Years' },
        { level: 'Masters/Equivalent Level', isApplicable: false, examination: '', board: '', roll: '', registration: '', resultType: '', result: '', group: '', year: '', duration: '' },
      ],
      experience: [
        { position: 'Software Engineer', company: 'Demo Tech Ltd.', duration: '2 Years', description: 'Worked on web development projects.' }
      ],
      skills: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS'],
    };
    saveCV(demoCV);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-gray-200 flex flex-col shrink-0">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between md:justify-start gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                {user.fullName?.[0] || 'U'}
              </div>
              <div>
                <p className="font-bold text-gray-900 truncate w-32">{user.fullName}</p>
                <p className="text-xs text-gray-500">@{user.username}</p>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-shrink-0 md:w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              activeTab === 'profile' ? 'bg-emerald-50 text-emerald-600 font-bold' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <UserIcon className="w-5 h-5" />
            <span>প্রোফাইল</span>
          </button>
          <button
            onClick={() => setActiveTab('cv')}
            className={`flex-shrink-0 md:w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              activeTab === 'cv' ? 'bg-emerald-50 text-emerald-600 font-bold' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span>আমার সিভি</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-shrink-0 md:w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              activeTab === 'orders' ? 'bg-emerald-50 text-emerald-600 font-bold' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Briefcase className="w-5 h-5" />
            <span>আমার আবেদনসমূহ</span>
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-shrink-0 md:w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              activeTab === 'saved' ? 'bg-emerald-50 text-emerald-600 font-bold' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Bookmark className="w-5 h-5" />
            <span>সেভ করা জব</span>
          </button>
          <button
            onClick={onBack}
            className="flex-shrink-0 md:w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Globe className="w-5 h-5" />
            <span>মূল সাইটে ফিরুন</span>
          </button>
          {user.role === 'admin' && onAdmin && (
            <button
              onClick={onAdmin}
              className="flex-shrink-0 md:w-full flex items-center gap-3 px-4 py-3 rounded-xl text-emerald-600 hover:bg-emerald-50 transition-colors"
            >
              <Briefcase className="w-5 h-5" />
              <span>এডমিন প্যানেল</span>
            </button>
          )}
          <div className="hidden md:block flex-1"></div>
          <button
            onClick={onLogout}
            className="flex-shrink-0 md:w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors md:mt-auto"
          >
            <LogOut className="w-5 h-5" />
            <span>লগআউট</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full">
        {message && (
          <div className={`mb-6 p-4 rounded-xl text-sm font-bold flex justify-between items-center ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
          }`}>
            {message.text}
            <button onClick={() => setMessage(null)} className="ml-4 hover:opacity-70">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {activeTab === 'profile' ? (
          <div className="max-w-2xl space-y-8">
            <header>
              <h1 className="text-2xl font-bold text-gray-900">আমার প্রোফাইল</h1>
              <p className="text-gray-500">আপনার ব্যক্তিগত তথ্য এখানে দেখুন</p>
            </header>

            {dataLoading ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                <div className="p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="space-y-2">
                        <div className="w-20 h-4 bg-gray-100 rounded-md" />
                        <div className="w-3/4 h-6 bg-gray-100 rounded-md" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase">পুরো নাম</label>
                      <p className="text-lg font-medium text-gray-900">{user.fullName}</p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase">ইউজারনেম</label>
                      <p className="text-lg font-medium text-gray-900">@{user.username}</p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase">মোবাইল</label>
                      <p className="text-lg font-medium text-gray-900">{user.mobile}</p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase">ইমেইল</label>
                      <p className="text-lg font-medium text-gray-900">{user.email || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : activeTab === 'saved' ? (
          <div className="max-w-4xl space-y-8">
            <header>
              <h1 className="text-2xl font-bold text-gray-900">সেভ করা চাকরি</h1>
              <p className="text-gray-500">আপনার পছন্দের চাকরির বিজ্ঞপ্তিগুলো এখানে পাবেন</p>
            </header>

            {dataLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm animate-pulse">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-20 h-5 bg-gray-100 rounded-full" />
                      <div className="w-24 h-5 bg-gray-100 rounded-md" />
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-100" />
                      <div className="flex-1 space-y-2">
                        <div className="w-3/4 h-5 bg-gray-100 rounded-md" />
                        <div className="w-1/2 h-4 bg-gray-100 rounded-md" />
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-20 h-4 bg-gray-100 rounded-md" />
                      <div className="w-20 h-4 bg-gray-100 rounded-md" />
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-1 h-11 bg-gray-100 rounded-xl" />
                      <div className="w-12 h-11 bg-gray-100 rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            ) : savedJobs.length === 0 ? (
              <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
                <Bookmark className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900">কোনো চাকরি সেভ করা নেই</h3>
                <p className="text-gray-500">পছন্দের চাকরির বিজ্ঞপ্তিগুলোতে বুকমার্ক আইকনে ক্লিক করে সেভ করুন</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {savedJobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group relative"
                  >
                    <button
                      onClick={() => onToggleSaveJob?.(job)}
                      className="absolute top-4 right-4 p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors"
                      title="রিমুভ করুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex justify-between items-start mb-4 pr-8">
                      <div className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        job.category === 'সরকারি' ? "bg-red-50 text-red-600" :
                        job.category === 'ব্যাংক' ? "bg-blue-50 text-blue-600" :
                        job.category === 'এনজিও' ? "bg-purple-50 text-purple-600" :
                        "bg-emerald-50 text-emerald-600"
                      )}>
                        {job.category}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-4">
                      {job.companyLogoUrl ? (
                        <img 
                          src={job.companyLogoUrl} 
                          alt={job.company} 
                          className="w-12 h-12 rounded-xl object-contain bg-gray-50 p-1 border border-gray-100"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100">
                          <Building2 className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <h4 className="text-lg font-bold group-hover:text-emerald-600 transition-colors leading-tight">{job.title}</h4>
                        <p className="text-gray-600 text-sm mt-0.5">{job.company}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-6">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {job.location}
                      </div>
                      {job.salary && (
                        <div className="flex items-center gap-1">
                          <Landmark className="w-3 h-3" />
                          {job.salary}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <button 
                        onClick={() => onBack()} // This is a bit hacky, maybe should navigate to home with selected job
                        className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition-all text-center"
                      >
                        বিস্তারিত দেখুন
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'orders' ? (
          <div className="max-w-4xl space-y-8">
            <header>
              <h1 className="text-2xl font-bold text-gray-900">আমার আবেদনসমূহ</h1>
              <p className="text-gray-500">আপনার সকল জবের আবেদন এবং অর্ডারের স্ট্যাটাস দেখুন</p>
            </header>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">জব টাইটেল</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">প্রতিষ্ঠান</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">ট্রানজেকশন আইডি</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">স্ট্যাটাস</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">তারিখ</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">ট্র্যাকিং</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {dataLoading ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <tr key={i} className="animate-pulse">
                          <td className="px-6 py-4"><div className="w-32 h-5 bg-gray-100 rounded-md" /></td>
                          <td className="px-6 py-4"><div className="w-24 h-4 bg-gray-100 rounded-md" /></td>
                          <td className="px-6 py-4"><div className="w-20 h-4 bg-gray-100 rounded-md" /></td>
                          <td className="px-6 py-4"><div className="w-24 h-6 bg-gray-100 rounded-full" /></td>
                          <td className="px-6 py-4"><div className="w-20 h-4 bg-gray-100 rounded-md" /></td>
                          <td className="px-6 py-4 text-right"><div className="w-8 h-8 bg-gray-100 rounded-lg ml-auto" /></td>
                        </tr>
                      ))
                    ) : orders.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                          আপনি এখনো কোনো জবে আবেদন করেননি।
                        </td>
                      </tr>
                    ) : (
                      orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-bold text-gray-900">{order.jobTitle}</p>
                            {order.selectedPost && (
                              <p className="text-xs font-bold text-emerald-600 mt-1">পদ: {order.selectedPost}</p>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">{order.company}</td>
                          <td className="px-6 py-4 text-sm font-mono text-gray-600">{order.transactionId}</td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-2 items-start">
                              <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                                order.status === 'Ordered' ? 'bg-amber-50 text-amber-600' :
                                order.status === 'Demo Sent' ? 'bg-blue-50 text-blue-600' :
                                order.status === 'Payment Sent' ? 'bg-purple-50 text-purple-600' :
                                order.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' :
                                'bg-red-50 text-red-600'
                              }`}>
                                {order.status === 'Ordered' ? 'অর্ডার জমা হয়েছে' :
                                 order.status === 'Demo Sent' ? 'ডেমো পাঠানো হয়েছে' :
                                 order.status === 'Payment Sent' ? 'পিেমন্ট ভেরিফিকেশন' :
                                 order.status === 'Completed' ? 'সম্পন্ন' : 'বাতিল'}
                              </span>
                              {order.status === 'Completed' && order.finalCopyUrl && (
                                <a 
                                  href={order.finalCopyUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg"
                                >
                                  <FileText className="w-3 h-3" />
                                  আবেদনের ফাইনাল কপি
                                </a>
                              )}
                              {order.status === 'Demo Sent' && order.demoCopyUrl && (
                                <a 
                                  href={order.demoCopyUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg"
                                >
                                  <FileText className="w-3 h-3" />
                                  ডেমো কপি দেখুন
                                </a>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString('bn-BD')}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="ট্র্যাকিং দেখুন"
                            >
                              <Clock className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <header className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">আমার সিভি</h1>
                <p className="text-gray-500">আপনার প্রফেশনাল সিভি তৈরি ও আপডেট করুন</p>
              </div>
              <div className="flex gap-3">
                {user.role === 'admin' && !isEditingCV && (
                  <button
                    onClick={generateDemoCV}
                    className="px-6 py-2 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-colors flex items-center gap-2"
                    title="এডমিনের জন্য ডেমো সিভি তৈরি করুন"
                  >
                    <Plus className="w-5 h-5" />
                    ডেমো সিভি (Admin)
                  </button>
                )}
                {!isEditingCV && cv && (
                  <button
                    onClick={() => setIsEditingCV(true)}
                    className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors"
                  >
                    এডিট সিভি
                  </button>
                )}
                {!isEditingCV && !cv && (
                  <button
                    onClick={() => setIsEditingCV(true)}
                    className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors"
                  >
                    সিভি তৈরি করুন
                  </button>
                )}
              </div>
            </header>

            {dataLoading ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8 animate-pulse">
                <div className="flex justify-between items-start">
                  <div className="flex gap-6 items-center">
                    <div className="w-24 h-24 rounded-2xl bg-gray-100" />
                    <div className="space-y-3">
                      <div className="w-48 h-6 bg-gray-100 rounded-md" />
                      <div className="w-32 h-4 bg-gray-100 rounded-md" />
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="w-full h-40 bg-gray-100 rounded-2xl" />
                  <div className="w-full h-40 bg-gray-100 rounded-2xl" />
                </div>
              </div>
            ) : isEditingCV ? (
              <CVForm
                initialData={cv || defaultCV}
                onSave={saveCV}
                onCancel={() => setIsEditingCV(false)}
                loading={loading}
              />
            ) : cv ? (
              <CVPreview cv={cv} />
            ) : (
              <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900">আপনার কোনো সিভি নেই</h3>
                <p className="text-gray-500 mb-6">একটি প্রফেশনাল সিভি তৈরি করতে নিচের বাটনে ক্লিক করুন</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={() => setIsEditingCV(true)}
                    className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors inline-flex items-center gap-2 w-full sm:w-auto justify-center"
                  >
                    <Plus className="w-5 h-5" />
                    সিভি তৈরি শুরু করুন
                  </button>
                  {user.role === 'admin' && (
                    <button
                      onClick={generateDemoCV}
                      className="px-8 py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-colors inline-flex items-center gap-2 w-full sm:w-auto justify-center"
                    >
                      <Plus className="w-5 h-5" />
                      ডেমো সিভি (Admin)
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        {/* Tracking Modal */}
        <AnimatePresence>
          {selectedOrder && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedOrder(null)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
              >
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg">আবেদন ট্র্যাকিং</h3>
                    <p className="text-xs text-gray-500">ID: {selectedOrder.transactionId}</p>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-8">
                  <div className="mb-6">
                    <h4 className="font-bold text-gray-900 mb-1">{selectedOrder.jobTitle}</h4>
                    <p className="text-sm text-gray-500">{selectedOrder.company}</p>
                    {selectedOrder.adminNote && (
                      <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-xl">
                        <p className="text-xs font-bold text-amber-700 uppercase mb-1">এডমিন নোট</p>
                        <p className="text-sm text-amber-900 font-medium">{selectedOrder.adminNote}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-8 relative mb-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                    {selectedOrder.statusHistory?.map((step, i) => (
                      <div key={i} className="relative pl-10">
                        <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${
                          i === selectedOrder.statusHistory!.length - 1 ? 'bg-emerald-500' : 'bg-gray-300'
                        }`}>
                          {i === selectedOrder.statusHistory!.length - 1 && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <p className={`text-sm font-bold ${i === selectedOrder.statusHistory!.length - 1 ? 'text-emerald-600' : 'text-gray-900'}`}>
                              {step.status === 'Ordered' ? 'অর্ডার জমা হয়েছে' :
                               step.status === 'Demo Sent' ? 'ডেমো পাঠানো হয়েছে' :
                               step.status === 'Payment Sent' ? 'পেমেন্ট ভেরিফিকেশন চলছে' :
                               step.status === 'Completed' ? 'সম্পন্ন হয়েছে' : 'বাতিল করা হয়েছে'}
                            </p>
                            <p className="text-[10px] font-medium text-gray-400">
                              {new Date(step.timestamp).toLocaleString('bn-BD')}
                            </p>
                          </div>
                          <p className="text-xs text-gray-500 leading-relaxed">{step.note}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedOrder.status === 'Demo Sent' && (
                    <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <h4 className="font-bold text-emerald-900 mb-4 flex items-center gap-2">
                        < Landmark className="w-5 h-5" /> 
                        পেমেন্ট তথ্য জমাদিন করুন
                      </h4>
                      <div className="bg-white/50 rounded-xl p-4 mb-4 border border-emerald-200 space-y-2">
                        <div className="flex justify-between items-center text-sm text-emerald-800">
                          <span>আবেদন ফি:</span>
                          <span className="font-bold">৳ {selectedOrder.jobFee || '0'}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm text-emerald-800">
                          <span>সার্ভিস চার্জ:</span>
                          <span className="font-bold">৳ {selectedOrder.serviceCharge || '0'}</span>
                        </div>
                        <div className="pt-2 border-t border-emerald-200 flex justify-between items-center">
                          <span className="text-sm font-bold text-emerald-800">মোট পরিশোধযোগ্য:</span>
                          <span className="text-xl font-black text-emerald-900">৳ {selectedOrder.amount}</span>
                        </div>
                      </div>
                      <p className="text-xs text-emerald-700 mb-4 leading-relaxed">
                        আপনি যদি ডেমো কপি দেখে সন্তুষ্ট হন, তবে উপরের নির্ধারিত আবেদন ফি এবং চার্জ (<span className="font-bold">৳ {selectedOrder.amount}</span>) পরিশোধ করে নিচের তথ্যগুলো পূরণ করুন। 
                        বিকাশ/নগদ নাম্বার: <span className="font-bold">{siteSettings?.bkashNumber}</span>
                      </p>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        submitPayment(
                          selectedOrder.id, 
                          formData.get('transactionId') as string,
                          formData.get('paymentMethod') as string
                        );
                      }} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">পেমেন্ট মেথড</label>
                            <select name="paymentMethod" required className="w-full px-4 py-2 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-sm font-bold">
                              <option value="bKash">bKash</option>
                              <option value="Nagad">Nagad</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">ট্রানজেকশন আইডি</label>
                            <input name="transactionId" required placeholder="TrxID" className="w-full px-4 py-2 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-sm font-mono font-bold" />
                          </div>
                        </div>
                        <button 
                          type="submit" 
                          disabled={loading}
                          className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all disabled:opacity-50"
                        >
                          {loading ? 'জমা হচ্ছে...' : 'পেমেন্ট জমা দিন'}
                        </button>
                      </form>
                    </div>
                  )}
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100">
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="w-full py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-100 transition-all"
                  >
                    বন্ধ করুন
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

interface CVFormProps {
  initialData: CV;
  onSave: (data: CV) => void;
  onCancel: () => void;
  loading: boolean;
}

const CVForm: React.FC<CVFormProps> = ({ initialData, onSave, onCancel, loading }) => {
  const [formData, setFormData] = useState<CV>(() => {
    const data = { ...initialData };
    if (!data.education || data.education.length === 0 || !data.education[0].level) {
      data.education = [
        { level: 'SSC/Equivalent Level', isApplicable: true, examination: '', board: '', roll: '', registration: '', resultType: '', result: '', group: '', year: '', duration: '' },
        { level: 'HSC/Equivalent Level', isApplicable: false, examination: '', board: '', roll: '', registration: '', resultType: '', result: '', group: '', year: '', duration: '' },
        { level: 'Graduation/Equivalent Level', isApplicable: false, examination: '', board: '', roll: '', registration: '', resultType: '', result: '', group: '', year: '', duration: '' },
        { level: 'Masters/Equivalent Level', isApplicable: false, examination: '', board: '', roll: '', registration: '', resultType: '', result: '', group: '', year: '', duration: '' },
      ];
    }
    return data;
  });
  const [sameAsPresent, setSameAsPresent] = useState(false);

  useEffect(() => {
    if (sameAsPresent) {
      setFormData(prev => ({
        ...prev,
        permanentAddress: { ...prev.presentAddress }
      }));
    }
  }, [sameAsPresent, formData.presentAddress]);

  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [...formData.experience, { position: '', company: '', duration: '', description: '' }]
    });
  };

  const removeExperience = (index: number) => {
    setFormData({
      ...formData,
      experience: formData.experience.filter((_, i) => i !== index)
    });
  };

  const addSkill = (skill: string) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData({ ...formData, skills: [...formData.skills, skill] });
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">
            {/* Personal Info */}
            <section className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 border-b pb-2">ব্যক্তিগত তথ্য (Personal Information)</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Applicant's Name (English)", key: 'fullNameEn', pattern: "[A-Za-z ]+", required: true },
                  { label: "আবেদনকারীর নাম (বাংলা)", key: 'fullNameBn', pattern: "[\\u0980-\\u09FF][\\u0980-\\u09FF ]*", required: true },
                  { label: "Father's Name (English)", key: 'fatherNameEn', pattern: "[A-Za-z ]+", required: true },
                  { label: "পিতার নাম (বাংলা)", key: 'fatherNameBn', pattern: "[\\u0980-\\u09FF][\\u0980-\\u09FF ]*", required: true },
                  { label: "Mother's Name (English)", key: 'motherNameEn', pattern: "[A-Za-z ]+", required: true },
                  { label: "মাতার নাম (বাংলা)", key: 'motherNameBn', pattern: "[\\u0980-\\u09FF][\\u0980-\\u09FF ]*", required: true },
                  { label: "Date of Birth", key: 'dob', type: 'date', required: true },
                  { label: "Nationality", key: 'nationality', required: true },
                  { label: "Religion", key: 'religion', options: ['Islam', 'Hinduism', 'Buddhism', 'Christianity', 'Other'], required: true },
                  { label: "Gender", key: 'gender', options: ['Male', 'Female', 'Third Gender'], required: true },
                  { label: "National ID", key: 'nid', type: 'text', pattern: "\\d{10,17}", inputMode: 'numeric', required: true },
                  { label: "Birth Registration", key: 'birthReg', type: 'text', pattern: "\\d{17}", inputMode: 'numeric' },
                  { label: "Passport ID", key: 'passportId' },
                  { label: "Marital Status", key: 'maritalStatus', options: ['Single', 'Married', 'Other'], required: true },
                  ...(formData.personalInfo.maritalStatus === 'Married' ? [{ label: "Spouse Name", key: 'spouseName', required: true }] : []),
                  { label: "Mobile Number", key: 'mobile', type: 'text', pattern: "01\\d{9}", inputMode: 'numeric', required: true },
                  { label: "Email", key: 'email', type: 'email', required: true },
                  { label: "Quota", key: 'quota', options: ['Child of Freedom Fighter', 'Child of Martyred Freedom Fighter', 'Child of War Heroine (Birangana)', 'Physically Challenged', 'Ethnic Minority', 'Third Gender', 'Not Applicable'], required: true },
                  { label: "Departmental Status", key: 'deptStatus', options: ['Govt. Employee', 'Semi Govt. Employee', 'Autonomous', 'Departmental Candidate', 'Not Applicable'], required: true },
                  { label: "Photo", key: 'photoUrl', type: 'file', required: true },
                  { label: "Signature", key: 'signatureUrl', type: 'file', required: true },
                ].map(field => (
                  <div key={field.key} className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">{field.label} {field.required && '*'}</label>
                    {field.type === 'file' ? (
                      <input
                        type="file"
                        required={field.required}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const uploadData = new FormData();
                            uploadData.append('file', file);
                            const response = await fetch('/api/upload', {
                              method: 'POST',
                              body: uploadData,
                            });
                            const data = await response.json();
                            setFormData(prev => ({ 
                              ...prev, 
                              personalInfo: { ...prev.personalInfo, [field.key]: data.url } 
                            }));
                          }
                        }}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                      />
                    ) : field.options ? (
                      <select
                        value={(formData.personalInfo as any)[field.key]}
                        required={field.required}
                        onChange={e => setFormData({ 
                          ...formData, 
                          personalInfo: { ...formData.personalInfo, [field.key]: e.target.value } 
                        })}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                      >
                        <option value="">Select</option>
                        {field.options.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type || 'text'}
                        value={(formData.personalInfo as any)[field.key]}
                        required={field.required}
                        pattern={field.pattern}
                        inputMode={(field as any).inputMode}
                        onChange={e => setFormData({ 
                          ...formData, 
                          personalInfo: { ...formData.personalInfo, [field.key]: e.target.value } 
                        })}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                      />
                    )}
                  </div>
                ))}
              </div>
            </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AddressFields title="বর্তমান ঠিকানা (Present Address)" type="presentAddress" formData={formData} setFormData={setFormData} sameAsPresent={sameAsPresent} setSameAsPresent={setSameAsPresent} />
        <AddressFields title="স্থায়ী ঠিকানা (Permanent Address)" type="permanentAddress" formData={formData} setFormData={setFormData} sameAsPresent={sameAsPresent} setSameAsPresent={setSameAsPresent} />
      </div>

      {/* Education */}
      <section className="space-y-6">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-lg font-bold text-gray-900">শিক্ষাগত যোগ্যতা (Educational Info)</h3>
        </div>
        
        {formData.education.map((edu, index) => {
          const isOptionalEd = index >= 1; // HSC, Graduation and Masters
          const isSSC = index === 0; // SSC/Equivalent Level
          const isHigherEd = index >= 2; // Graduation and Masters
          
          return (
            <div key={index} className="space-y-2">
              {isOptionalEd && (
                <label className="flex items-center gap-2 cursor-pointer w-fit">
                  <input
                    type="checkbox"
                    checked={edu.isApplicable}
                    onChange={e => {
                      const newEdu = [...formData.education];
                      newEdu[index].isApplicable = e.target.checked;
                      setFormData({ ...formData, education: newEdu });
                    }}
                    className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                  />
                  <span className="text-sm font-bold italic text-gray-700">If Applicable</span>
                </label>
              )}
              
              <div className={`border rounded-xl overflow-hidden ${!edu.isApplicable && isOptionalEd ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="bg-emerald-500 text-white px-4 py-1.5 font-bold text-sm">
                  {edu.level}
                </div>
                <div className="p-4 bg-white space-y-4">
                  
                  {/* Row 1: Examination and Board/University */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div className="flex items-center gap-4">
                      <label className="text-sm font-bold text-gray-700 w-32 text-right">Examination {(isSSC || edu.isApplicable) && '*'}</label>
                      <select
                        value={edu.examination}
                        required={isSSC || edu.isApplicable}
                        onChange={e => {
                          const newEdu = [...formData.education];
                          newEdu[index].examination = e.target.value;
                          newEdu[index].board = '';
                          newEdu[index].group = '';
                          newEdu[index].duration = '';
                          setFormData({ ...formData, education: newEdu });
                        }}
                        className="flex-1 px-3 py-1.5 rounded border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                      >
                        <option value="">Select</option>
                        {EXAMINATIONS[index].map(exam => <option key={exam} value={exam}>{exam}</option>)}
                      </select>
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="text-sm font-bold text-gray-700 w-32 text-right">{isHigherEd ? 'University/Inst.' : 'Board'} {(isSSC || edu.isApplicable) && '*'}</label>
                      <select
                        value={edu.board}
                        required={isSSC || edu.isApplicable}
                        onChange={e => {
                          const newEdu = [...formData.education];
                          newEdu[index].board = e.target.value;
                          setFormData({ ...formData, education: newEdu });
                        }}
                        className="flex-1 px-3 py-1.5 rounded border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                      >
                        <option value="">Select</option>
                        {(!isHigherEd ? BOARDS : UNIVERSITIES).map(board => <option key={board} value={board}>{board}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Row 2: Roll No and Registration No */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div className="flex items-center gap-4">
                      <label className="text-sm font-bold text-gray-700 w-32 text-right">Roll No {(isSSC || edu.isApplicable) && '*'}</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        required={isSSC || edu.isApplicable}
                        pattern={!isHigherEd ? "\\d{6,10}" : undefined}
                        title={!isHigherEd ? "Roll must be 6-10 digits" : undefined}
                        value={edu.roll}
                        onChange={e => {
                          const newEdu = [...formData.education];
                          newEdu[index].roll = e.target.value;
                          setFormData({ ...formData, education: newEdu });
                        }}
                        className="flex-1 px-3 py-1.5 rounded border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="text-sm font-bold text-gray-700 w-32 text-right">Registration No {(isSSC || edu.isApplicable) && '*'}</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        required={isSSC || edu.isApplicable}
                        pattern={!isHigherEd ? "\\d{10}" : undefined}
                        title={!isHigherEd ? "Registration must be 10 digits" : undefined}
                        value={edu.registration || ''}
                        onChange={e => {
                          const newEdu = [...formData.education];
                          newEdu[index].registration = e.target.value;
                          setFormData({ ...formData, education: newEdu });
                        }}
                        className="flex-1 px-3 py-1.5 rounded border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                      />
                    </div>
                  </div>

                  {/* Row 3: Group/Subject and Result */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div className="flex items-center gap-4">
                      <label className="text-sm font-bold text-gray-700 w-32 text-right">{isHigherEd ? 'Subject/Degree' : 'Group/Subject'} {(isSSC || edu.isApplicable) && '*'}</label>
                      <select
                        value={edu.group}
                        required={isSSC || edu.isApplicable}
                        onChange={e => {
                          const newEdu = [...formData.education];
                          newEdu[index].group = e.target.value;
                          setFormData({ ...formData, education: newEdu });
                        }}
                        className="flex-1 px-3 py-1.5 rounded border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                      >
                        <option value="">Select</option>
                        {(!isHigherEd ? GROUPS_SSC_HSC : SUBJECTS_GRAD).map(grp => <option key={grp} value={grp}>{grp}</option>)}
                      </select>
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="text-sm font-bold text-gray-700 w-32 text-right">Result {(isSSC || edu.isApplicable) && '*'}</label>
                      <div className="flex-1 flex gap-2">
                        <select
                          value={edu.resultType || ''}
                          required={isSSC || edu.isApplicable}
                          onChange={e => {
                            const newEdu = [...formData.education];
                            newEdu[index].resultType = e.target.value;
                            if (!e.target.value.startsWith('GPA')) {
                              newEdu[index].result = e.target.value;
                            } else {
                              newEdu[index].result = '';
                            }
                            setFormData({ ...formData, education: newEdu });
                          }}
                          className="flex-1 px-3 py-1.5 rounded border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                        >
                          <option value="">Select</option>
                          {RESULTS.map(res => <option key={res} value={res}>{res}</option>)}
                        </select>
                        {edu.resultType?.startsWith('GPA') && (
                          <input
                            type="number"
                            step="0.01"
                            min="1.00"
                            max={edu.resultType === 'GPA(out of 5)' ? "5.00" : "4.00"}
                            required={isSSC || edu.isApplicable}
                            placeholder="3.50"
                            inputMode="decimal"
                            value={edu.result}
                            onChange={e => {
                              const newEdu = [...formData.education];
                              newEdu[index].result = e.target.value;
                              setFormData({ ...formData, education: newEdu });
                            }}
                            className="w-24 px-2 py-1.5 rounded border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Row 4: Passing Year and Duration */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div className="flex items-center gap-4">
                      <label className="text-sm font-bold text-gray-700 w-32 text-right">Passing Year {(isSSC || edu.isApplicable) && '*'}</label>
                      <select
                        value={edu.year}
                        required={isSSC || edu.isApplicable}
                        onChange={e => {
                          const newEdu = [...formData.education];
                          newEdu[index].year = e.target.value;
                          setFormData({ ...formData, education: newEdu });
                        }}
                        className="flex-1 px-3 py-1.5 rounded border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                      >
                        <option value="">Select</option>
                        {YEARS.map(yr => <option key={yr} value={yr}>{yr}</option>)}
                      </select>
                    </div>
                    {isHigherEd && (
                      <div className="flex items-center gap-4">
                        <label className="text-sm font-bold text-gray-700 w-32 text-right">Course Duration {(isSSC || edu.isApplicable) && '*'}</label>
                        <select
                          value={edu.duration}
                          required={isSSC || edu.isApplicable}
                          onChange={e => {
                            const newEdu = [...formData.education];
                            newEdu[index].duration = e.target.value;
                            setFormData({ ...formData, education: newEdu });
                          }}
                          className="flex-1 px-3 py-1.5 rounded border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                        >
                          <option value="">Select</option>
                          {DURATIONS.map(dur => <option key={dur} value={dur}>{dur}</option>)}
                        </select>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Experience */}
      <section className="space-y-4">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-lg font-bold text-gray-900">কাজের অভিজ্ঞতা (Experience)</h3>
          <button type="button" onClick={addExperience} className="text-emerald-600 hover:text-emerald-700 font-bold text-sm flex items-center gap-1">
            <Plus className="w-4 h-4" /> যোগ করুন
          </button>
        </div>
        {formData.experience.map((exp, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-xl space-y-4 relative">
            <button type="button" onClick={() => removeExperience(index)} className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-1 rounded">
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="grid grid-cols-2 gap-4">
              <input
                placeholder="পদবী"
                value={exp.position}
                onChange={e => {
                  const newExp = [...formData.experience];
                  newExp[index].position = e.target.value;
                  setFormData({ ...formData, experience: newExp });
                }}
                className="px-4 py-2 rounded-lg border border-gray-200 outline-none bg-white"
              />
              <input
                placeholder="প্রতিষ্ঠান"
                value={exp.company}
                onChange={e => {
                  const newExp = [...formData.experience];
                  newExp[index].company = e.target.value;
                  setFormData({ ...formData, experience: newExp });
                }}
                className="px-4 py-2 rounded-lg border border-gray-200 outline-none bg-white"
              />
              <input
                placeholder="সময়কাল (যেমন: জানু ২০২২ - বর্তমান)"
                value={exp.duration}
                onChange={e => {
                  const newExp = [...formData.experience];
                  newExp[index].duration = e.target.value;
                  setFormData({ ...formData, experience: newExp });
                }}
                className="px-4 py-2 rounded-lg border border-gray-200 outline-none bg-white col-span-2"
              />
              <textarea
                placeholder="কাজের বর্ণনা"
                value={exp.description}
                onChange={e => {
                  const newExp = [...formData.experience];
                  newExp[index].description = e.target.value;
                  setFormData({ ...formData, experience: newExp });
                }}
                className="px-4 py-2 rounded-lg border border-gray-200 outline-none bg-white col-span-2 h-20 resize-none"
              />
            </div>
          </div>
        ))}
      </section>

      {/* Skills */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 border-b pb-2">দক্ষতা (Skills)</h3>
        <div className="flex flex-wrap gap-2">
          {formData.skills.map(skill => (
            <span key={skill} className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-sm font-bold flex items-center gap-2">
              {skill}
              <button onClick={() => removeSkill(skill)} className="hover:text-emerald-800">×</button>
            </span>
          ))}
          <input
            type="text"
            placeholder="নতুন দক্ষতা লিখে এন্টার দিন"
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addSkill(e.currentTarget.value);
                e.currentTarget.value = '';
              }
            }}
            className="px-4 py-1 rounded-full border border-gray-200 outline-none text-sm"
          />
        </div>
      </section>

      <div className="flex justify-end gap-4 pt-6 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 text-gray-500 font-bold hover:bg-gray-50 rounded-xl transition-colors"
        >
          বাতিল
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <Save className="w-5 h-5" />
          {loading ? 'সেভ হচ্ছে...' : 'সেভ করুন'}
        </button>
      </div>
    </form>
  );
};

const CVPreview: React.FC<{ cv: CV }> = ({ cv }) => {
  const handlePrint = () => {
    window.print();
  };

  const AddressTable = ({ title, address }: { title: string, address: Address }) => (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <div className="bg-emerald-600 text-white px-4 py-1 text-sm font-bold">{title}</div>
      <table className="w-full text-xs">
        <tbody>
          {[
            { label: 'Care Of', val: address.careOf },
            { label: 'Vill/ Road/ House/ Flat', val: address.village },
            { label: 'District', val: address.district },
            { label: 'Upazila/P.S.', val: address.upazila },
            { label: 'Post Office', val: address.postOffice },
            { label: 'Post Code', val: address.postCode },
          ].map((row, i) => (
            <tr key={i} className="border-t border-gray-200">
              <td className="p-2 font-bold w-1/2 border-r border-gray-200">{row.label}</td>
              <td className="p-2">{row.val}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={handlePrint}
          className="px-6 py-2 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors flex items-center gap-2"
        >
          <Download className="w-5 h-5" />
          ডাউনলোড / প্রিন্ট
        </button>
      </div>

      <div id="cv-content" className="bg-white shadow-lg border border-gray-100 p-8 md:p-12 max-w-[210mm] mx-auto min-h-[297mm] text-gray-900">
        {/* Header with Photo Placeholder */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex-1">
            <h1 className="text-3xl font-bold border-b-2 border-emerald-600 pb-2 mb-4">Job Application Form</h1>
          </div>
          <div className="w-32 h-40 border-2 border-gray-200 bg-gray-50 flex items-center justify-center text-gray-400 text-xs text-center p-2 ml-8 overflow-hidden">
            {cv.personalInfo.photoUrl ? (
              <img src={cv.personalInfo.photoUrl} alt="Photo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : 'Passport Size Photo'}
          </div>
        </div>

        {/* Personal Info Table */}
        <section className="mb-8">
          <table className="w-full border-collapse text-sm">
            <tbody>
              {[
                { label: "Applicant's Name", val: cv.personalInfo.fullNameEn },
                { label: "আবেদনকারীর নাম", val: cv.personalInfo.fullNameBn },
                { label: "Father's Name", val: cv.personalInfo.fatherNameEn },
                { label: "পিতার নাম", val: cv.personalInfo.fatherNameBn },
                { label: "Mother's Name", val: cv.personalInfo.motherNameEn },
                { label: "মাতার নাম", val: cv.personalInfo.motherNameBn },
                { label: "Date of Birth", val: cv.personalInfo.dob },
                { label: "Nationality", val: cv.personalInfo.nationality },
                { label: "Religion", val: cv.personalInfo.religion },
                { label: "Gender", val: cv.personalInfo.gender },
                { label: "National ID", val: cv.personalInfo.nid },
                { label: "Birth Registration", val: cv.personalInfo.birthReg },
                { label: "Passport ID", val: cv.personalInfo.passportId },
                { label: "Marital Status", val: cv.personalInfo.maritalStatus },
                { label: "Mobile Number", val: cv.personalInfo.mobile },
                { label: "Email", val: cv.personalInfo.email },
                { label: "Quota", val: cv.personalInfo.quota },
                { label: "Departmental Status", val: cv.personalInfo.deptStatus },
              ].map((row, i) => (
                <tr key={i} className="border border-gray-200">
                  <td className="p-2 font-bold w-1/3 border-r border-gray-200 bg-gray-50">{row.label}</td>
                  <td className="p-2 w-4 text-center border-r border-gray-200">:</td>
                  <td className="p-2">{row.val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Address Section */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <AddressTable title="Present Address (বর্তমান ঠিকানা)" address={cv.presentAddress} />
          <AddressTable title="Permanent Address (স্থায়ী ঠিকানা)" address={cv.permanentAddress} />
        </div>

        {/* Education Table */}
        <section className="mb-8">
          <div className="bg-emerald-600 text-white px-4 py-1 text-sm font-bold rounded-t-lg">Educational Info</div>
          <table className="w-full border-collapse text-xs border border-gray-300">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-300">
                <th className="p-2 border-r border-gray-300 text-left">Examination</th>
                <th className="p-2 border-r border-gray-300 text-left">Board/University</th>
                <th className="p-2 border-r border-gray-300 text-left">Roll</th>
                <th className="p-2 border-r border-gray-300 text-left">Registration</th>
                <th className="p-2 border-r border-gray-300 text-left">Result</th>
                <th className="p-2 border-r border-gray-300 text-left">Group/Subject</th>
                <th className="p-2 border-r border-gray-300 text-left">Year</th>
                <th className="p-2 text-left">Duration</th>
              </tr>
            </thead>
            <tbody>
              {cv.education.filter(edu => edu.isApplicable !== false).map((edu, i) => (
                <tr key={i} className="border-b border-gray-200">
                  <td className="p-2 border-r border-gray-200">{edu.examination}</td>
                  <td className="p-2 border-r border-gray-200">{edu.board}</td>
                  <td className="p-2 border-r border-gray-200">{edu.roll}</td>
                  <td className="p-2 border-r border-gray-200">{edu.registration}</td>
                  <td className="p-2 border-r border-gray-200">
                    {edu.resultType?.startsWith('GPA') ? `${edu.resultType}: ${edu.result}` : edu.result}
                  </td>
                  <td className="p-2 border-r border-gray-200">{edu.group}</td>
                  <td className="p-2 border-r border-gray-200">{edu.year}</td>
                  <td className="p-2">{edu.duration || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Experience Section */}
        {cv.experience.length > 0 && (
          <section className="mb-8">
            <div className="bg-emerald-600 text-white px-4 py-1 text-sm font-bold rounded-t-lg">Experience</div>
            <div className="border border-gray-300 p-4 space-y-4">
              {cv.experience.map((exp, i) => (
                <div key={i} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                  <div className="flex justify-between font-bold">
                    <span>{exp.position}</span>
                    <span className="text-gray-500">{exp.duration}</span>
                  </div>
                  <div className="text-emerald-600 font-medium">{exp.company}</div>
                  <p className="text-xs text-gray-600 mt-1">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer / Signature */}
        <div className="mt-16 flex justify-end">
          <div className="text-center w-48">
            <div className="h-16 mb-2 flex items-center justify-center border-b border-gray-300">
              {cv.personalInfo.signatureUrl && (
                <img src={cv.personalInfo.signatureUrl} alt="Signature" className="max-h-full" referrerPolicy="no-referrer" />
              )}
            </div>
            <div className="font-bold text-sm">
              Applicant's Signature
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #cv-content, #cv-content * { visibility: visible; }
          #cv-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none;
            box-shadow: none;
            padding: 0;
          }
        }
      `}</style>
    </div>
  );
};

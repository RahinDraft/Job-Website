import React, { useState } from 'react';
import { 
  Briefcase, 
  ChevronRight, 
  Trash2, 
  Edit2,
  Plus,
  Clock,
  Upload,
  X,
  Check,
  AlertCircle,
  Settings,
  Save,
  Loader2,
  FileText,
  MessageSquare,
  Mail,
  Camera,
  User as UserIcon
} from 'lucide-react';
import { Job, JobCategory, AdminStats, Stats, Order, SiteSettings, ContactMessage, ServiceRequest } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { AdminPrepManager } from './AdminPrepManager';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AdminDashboardProps {
  adminView: 'dashboard' | 'jobs' | 'users' | 'orders' | 'settings' | 'messages' | 'service-requests' | 'preps';
  setAdminView: (view: 'dashboard' | 'jobs' | 'users' | 'orders' | 'settings' | 'messages' | 'service-requests' | 'preps') => void;
  adminStats: AdminStats;
  stats: Stats | null;
  jobs: Job[];
  users: any[];
  orders: Order[];
  serviceRequests: ServiceRequest[];
  onUpdateServiceRequestStatus: (id: string, status: string, processedPhoto?: File, processedSignature?: File) => void;
  messages: ContactMessage[];
  onUpdateMessageStatus: (id: string, status: 'new' | 'read' | 'replied') => void;
  onDeleteMessage: (id: string) => void;
  siteSettings: SiteSettings | null;
  onUpdateSettings: (settings: SiteSettings) => void;
  handleUpdateOrderStatus: (orderId: string, status: string, note?: string, demoCopyUrl?: string, finalCopyUrl?: string, adminNote?: string) => void;
  setEditingJob: (job: any) => void;
  setIsEditing: (is: boolean) => void;
  setDeleteConfirm: (confirm: any) => void;
  setEditingUser: (user: any) => void;
  setNewPassword: (pass: string) => void;
  setIsEditingUser: (is: boolean) => void;
  showToast?: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  adminView,
  setAdminView,
  adminStats,
  stats,
  jobs,
  users,
  orders,
  serviceRequests,
  onUpdateServiceRequestStatus,
  messages,
  onUpdateMessageStatus,
  onDeleteMessage,
  siteSettings,
  onUpdateSettings,
  handleUpdateOrderStatus,
  setEditingJob,
  setIsEditing,
  setDeleteConfirm,
  setEditingUser,
  setNewPassword,
  setIsEditingUser,
  showToast
}) => {
  const [statusUpdate, setStatusUpdate] = useState<{ orderId: string, status: string } | null>(null);
  const [statusNote, setStatusNote] = useState('');
  const [demoCopyUrl, setDemoCopyUrl] = useState('');
  const [finalCopyUrl, setFinalCopyUrl] = useState('');
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [viewHistory, setViewHistory] = useState<Order | null>(null);
  const [tempSettings, setTempSettings] = useState<SiteSettings | null>(siteSettings);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [serviceRequestUpdate, setServiceRequestUpdate] = useState<ServiceRequest | null>(null);
  const [processedPhoto, setProcessedPhoto] = useState<File | null>(null);
  const [processedSignature, setProcessedSignature] = useState<File | null>(null);
  const [newServiceStatus, setNewServiceStatus] = useState<string>('');

  React.useEffect(() => {
    if (siteSettings) setTempSettings(siteSettings);
  }, [siteSettings]);

  const onUpdateStatus = () => {
    if (statusUpdate) {
      handleUpdateOrderStatus(
        statusUpdate.orderId, 
        statusUpdate.status, 
        statusNote, 
        demoCopyUrl || undefined, 
        finalCopyUrl || undefined, 
        adminNoteInput || undefined
      );
      setStatusUpdate(null);
      setStatusNote('');
      setDemoCopyUrl('');
      setFinalCopyUrl('');
      setAdminNoteInput('');
    }
  };

  const handleSaveSettings = async () => {
    if (!tempSettings) return;
    setIsSavingSettings(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tempSettings)
      });
      if (res.ok) {
        onUpdateSettings(tempSettings);
        showToast?.('সেটিংস সফলভাবে সেভ করা হয়েছে!', 'success');
      }
    } catch (error) {
      showToast?.('সেটিংস সেভ করতে সমস্যা হয়েছে।', 'error');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const onUpdateServiceStatus = () => {
    if (serviceRequestUpdate) {
      onUpdateServiceRequestStatus(
        serviceRequestUpdate.id,
        newServiceStatus || serviceRequestUpdate.status,
        processedPhoto || undefined,
        processedSignature || undefined
      );
      setServiceRequestUpdate(null);
      setProcessedPhoto(null);
      setProcessedSignature(null);
      setNewServiceStatus('');
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        setTempSettings(prev => prev ? { ...prev, logoUrl: data.url } : null);
        showToast?.('লোগো সফলভাবে আপলোড হয়েছে!', 'success');
      } else {
        showToast?.('লোগো আপলোড করতে সমস্যা হয়েছে।', 'error');
      }
    } catch (error) {
      console.error('Upload error:', error);
      showToast?.('লোগো আপলোড করতে সমস্যা হয়েছে।', 'error');
    }
  };

  return (
    <div className="space-y-8">
      {adminView === 'dashboard' ? (
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-gray-400 text-[10px] font-bold uppercase mb-2">মোট ভিজিটর</p>
              <h3 className="text-2xl font-bold text-purple-600">{adminStats.totalVisitors}</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-gray-400 text-[10px] font-bold uppercase mb-2">সক্রিয় ভিজিটর</p>
              <h3 className="text-2xl font-bold text-orange-600">{adminStats.activeVisitors}</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-gray-400 text-[10px] font-bold uppercase mb-2">মোট ইউজার</p>
              <h3 className="text-2xl font-bold text-blue-600">{adminStats.registeredUsers}</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-gray-400 text-[10px] font-bold uppercase mb-2">লগইন ইউজার</p>
              <h3 className="text-2xl font-bold text-emerald-600">{adminStats.loggedInUsers}</h3>
            </div>
            <div 
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setAdminView('messages')}
            >
              <p className="text-gray-400 text-[10px] font-bold uppercase mb-2">নতুন মেসেজ</p>
              <h3 className="text-2xl font-bold text-red-600">{adminStats.newMessages || 0}</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-gray-400 text-[10px] font-bold uppercase mb-2">মোট জব পোস্ট</p>
              <h3 className="text-2xl font-bold text-emerald-600">{stats?.total || 0}</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {stats?.byCategory.slice(0, 2).map((cat: any) => (
                <div key={cat.category} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <p className="text-gray-400 text-[10px] font-bold uppercase mb-2">{cat.category}</p>
                  <h3 className="text-2xl font-bold">{cat.count}</h3>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold">সাম্প্রতিক জব পোস্ট</h4>
                <button 
                  onClick={() => setAdminView('jobs')}
                  className="text-xs font-bold text-emerald-600 hover:underline"
                >
                  সবগুলো দেখুন
                </button>
              </div>
              <div className="space-y-4">
                {jobs.slice(0, 5).map(job => (
                  <div key={job.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl transition-colors">
                    <div className="flex-1">
                      <p className="font-bold text-sm">{job.title}</p>
                      <p className="text-xs text-gray-500">{job.company}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{job.category}</span>
                      <button 
                        onClick={() => setDeleteConfirm({ type: 'job', id: job.id })}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold">সাম্প্রতিক ইউজার</h4>
                <button 
                  onClick={() => setAdminView('users')}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  সবগুলো দেখুন
                </button>
              </div>
              <div className="space-y-4">
                {users.slice(0, 5).map(u => (
                  <div key={u.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl transition-colors">
                    <div>
                      <p className="font-bold text-sm">{u.fullName}</p>
                      <p className="text-xs text-gray-500">@{u.username}</p>
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{u.role}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : adminView === 'jobs' ? (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-gray-400 text-xs font-bold uppercase mb-2">মোট জব পোস্ট</p>
              <h3 className="text-3xl font-bold text-emerald-600">{stats?.total || 0}</h3>
            </div>
            {stats?.byCategory.map((cat: any) => (
              <div key={cat.category} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-gray-400 text-xs font-bold uppercase mb-2">{cat.category}</p>
                <h3 className="text-3xl font-bold">{cat.count}</h3>
              </div>
            ))}
          </div>

          {/* Job List Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
            <table className="w-full min-w-[600px] text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">পদবী ও প্রতিষ্ঠান</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">ক্যাটাগরি</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">পদ সংখ্যা</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">ডেডলাইন</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{job.title}</p>
                      <p className="text-xs text-gray-500">{job.company}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-1 text-[10px] font-bold rounded-full uppercase",
                        job.category === 'সরকারি' ? "bg-red-50 text-red-600" :
                        job.category === 'ব্যাংক' ? "bg-blue-50 text-blue-600" :
                        job.category === 'এনজিও' ? "bg-purple-50 text-purple-600" :
                        "bg-emerald-50 text-emerald-600"
                      )}>
                        {job.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                        {job.positions?.length || 0} টি পদ
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{job.deadline}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => {
                            setEditingJob(job);
                            setIsEditing(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setDeleteConfirm({ type: 'job', id: job.id })}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : adminView === 'users' ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full min-w-[800px] text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">ইউজার</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">পাসওয়ার্ড</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">যোগাযোগ</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">রোল</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">রেজিস্ট্রেশন</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    কোন ইউজার পাওয়া যায়নি।
                  </td>
                </tr>
              ) : users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-2.5 h-2.5 rounded-full shrink-0",
                        u.isOnline ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" : "bg-gray-300"
                      )} title={u.isOnline ? "অনলাইন" : "অফলাইন"} />
                      <div>
                        <p className="font-bold text-gray-900">{u.fullName}</p>
                        <p className="text-xs text-gray-500">@{u.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-mono font-bold text-emerald-600">{u.password}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-700">{u.mobile}</p>
                    <p className="text-xs text-gray-500">{u.email || 'N/A'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 text-[10px] font-bold rounded-full uppercase",
                      u.role === 'admin' ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"
                    )}>
                      {u.role === 'admin' ? 'এডমিন' : 'ইউজার'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-[10px] text-gray-500 font-medium">
                      {u.createdAt ? new Date(u.createdAt).toLocaleString('bn-BD', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'N/A'}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => {
                          setEditingUser(u);
                          setNewPassword(u.password);
                          setIsEditingUser(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="পাসওয়ার্ড পরিবর্তন করুন"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {u.role !== 'admin' && (
                        <button 
                          onClick={() => setDeleteConfirm({ type: 'user', id: u.id })}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="ইউজার ডিলিট করুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : adminView === 'orders' ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full min-w-[800px] text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">ইউজার</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">জব টাইটেল</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">ট্রানজেকশন আইডি</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">তারিখ</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">স্ট্যাটাস ও অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    কোনো অর্ডার পাওয়া যায়নি।
                  </td>
                </tr>
              ) : orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900">{order.userName}</p>
                    <p className="text-xs text-gray-500">{order.userMobile}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900">{order.jobTitle}</p>
                    <p className="text-xs text-gray-500">{order.company}</p>
                    {order.selectedPost && (
                      <p className="text-xs font-bold text-emerald-600 mt-1">পদ: {order.selectedPost}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-mono font-bold text-emerald-600">{order.transactionId}</p>
                    <p className="text-xs text-gray-500">৳{order.amount}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('bn-BD')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <select
                        value={order.status}
                        onChange={(e) => setStatusUpdate({ orderId: order.id, status: e.target.value })}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg border-0 cursor-pointer focus:ring-2 focus:ring-emerald-400 ${
                          order.status === 'Ordered' ? 'bg-amber-50 text-amber-700' :
                          order.status === 'Demo Sent' ? 'bg-blue-50 text-blue-700' :
                          order.status === 'Payment Sent' ? 'bg-purple-50 text-purple-700' :
                          order.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' :
                          'bg-red-50 text-red-700'
                        }`}
                      >
                        <option value="Ordered">অর্ডার করা হয়েছে</option>
                        <option value="Demo Sent">ডেমো পাঠানো হয়েছে</option>
                        <option value="Payment Sent">পেমেন্ট পাওয়া গেছে</option>
                        <option value="Completed">সম্পন্ন</option>
                        <option value="Rejected">বাতিল</option>
                      </select>
                      <button
                        onClick={() => setViewHistory(order)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="ইতিহাস দেখুন"
                      >
                        <Clock className="w-4 h-4" />
                      </button>
                      <a 
                        href={`/api/admin/cv/${order.userId}/download`} 
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="সিভি ডাউনলোড করুন"
                      >
                        <FileText className="w-4 h-4" />
                      </a>
                      <a 
                        href={`/api/cv/${order.userId}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="সিভি দেখুন"
                          onClick={(e) => {
                            e.preventDefault();
                            // In a real app, this would open a new tab with the CV view.
                            // For now, we can just alert or show a modal.
                            showToast?.('সিভি দেখার জন্য ইউজার ড্যাশবোর্ডে যেতে হবে বা আলাদা ভিউ তৈরি করতে হবে।', 'info');
                          }}
                      >
                        <Briefcase className="w-4 h-4" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : adminView === 'settings' && tempSettings ? (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div>
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Settings className="w-6 h-6 text-emerald-600" />
                সাইট সেটিংস কন্ট্রোল প্যানেল
              </h3>
              <p className="text-sm text-gray-500">কোডিং ছাড়াই এখান থেকে পুরো সাইট কন্ট্রোল করুন</p>
            </div>
            <button
              onClick={handleSaveSettings}
              disabled={isSavingSettings}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 disabled:opacity-50"
            >
              {isSavingSettings ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              সেটিংস সেভ করুন
            </button>
          </div>
          
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h4 className="font-bold text-gray-900 border-b pb-2">সাধারণ সেটিংস</h4>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">ওয়েবসাইটের নাম</label>
                <input
                  type="text"
                  value={tempSettings.siteName || ''}
                  onChange={(e) => setTempSettings({ ...tempSettings, siteName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-400 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">লোগো আপলোড</label>
                <div className="flex items-center gap-4">
                  {tempSettings.logoUrl && (
                    <img src={tempSettings.logoUrl} alt="Logo preview" className="h-12 w-auto object-contain border rounded p-1" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-400 outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">থিম কালার (Primary Color)</label>
                <div className="flex gap-3">
                  <input
                    type="color"
                    value={tempSettings.primaryColor || '#10b981'}
                    onChange={(e) => setTempSettings({ ...tempSettings, primaryColor: e.target.value })}
                    className="w-12 h-12 rounded-lg cursor-pointer border-0 p-0"
                  />
                  <input
                    type="text"
                    value={tempSettings.primaryColor || '#10b981'}
                    onChange={(e) => setTempSettings({ ...tempSettings, primaryColor: e.target.value })}
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">হিরো টাইটেল (Hero Title)</label>
                <input
                  type="text"
                  value={tempSettings.heroTitle || ''}
                  onChange={(e) => setTempSettings({ ...tempSettings, heroTitle: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-400 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">হিরো সাবটাইটেল (Hero Subtitle)</label>
                <textarea
                  value={tempSettings.heroSubtitle || ''}
                  onChange={(e) => setTempSettings({ ...tempSettings, heroSubtitle: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-400 outline-none transition-all h-20 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">নোটিশ টেক্সট (হোমপেজ)</label>
                <textarea
                  value={tempSettings.noticeText || ''}
                  onChange={(e) => setTempSettings({ ...tempSettings, noticeText: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-400 outline-none transition-all h-24 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">আমাদের সম্পর্কে (About Text)</label>
                <textarea
                  value={tempSettings.aboutText || ''}
                  onChange={(e) => setTempSettings({ ...tempSettings, aboutText: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-400 outline-none transition-all h-24 resize-none"
                />
              </div>
              <h4 className="font-bold text-gray-900 border-b pb-2 mt-8">এসইও (SEO) সেটিংস</h4>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">এসইও টাইটেল (SEO Title)</label>
                <input
                  type="text"
                  value={tempSettings.seoTitle || ''}
                  onChange={(e) => setTempSettings({ ...tempSettings, seoTitle: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-400 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">এসইও ডেসক্রিপশন (SEO Description)</label>
                <textarea
                  value={tempSettings.seoDescription || ''}
                  onChange={(e) => setTempSettings({ ...tempSettings, seoDescription: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-400 outline-none transition-all h-24 resize-none"
                />
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="font-bold text-gray-900 border-b pb-2">পেমেন্ট ও কন্টাক্ট সেটিংস</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">বিকাশ নাম্বার</label>
                  <input
                    type="text"
                    value={tempSettings.bkashNumber || ''}
                    onChange={(e) => setTempSettings({ ...tempSettings, bkashNumber: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-400 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">নগদ নাম্বার</label>
                  <input
                    type="text"
                    value={tempSettings.nagadNumber || ''}
                    onChange={(e) => setTempSettings({ ...tempSettings, nagadNumber: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-400 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">আবেদন ফি (টাকা)</label>
                  <input
                    type="text"
                    value={tempSettings.applicationFee || ''}
                    onChange={(e) => setTempSettings({ ...tempSettings, applicationFee: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-400 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">সার্ভিস চার্জ (টাকা)</label>
                  <input
                    type="text"
                    value={tempSettings.serviceCharge || ''}
                    onChange={(e) => setTempSettings({ ...tempSettings, serviceCharge: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-400 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">পেমেন্ট নির্দেশিকা (Payment Instructions)</label>
                <textarea
                  value={tempSettings.paymentInstructions || ''}
                  onChange={(e) => setTempSettings({ ...tempSettings, paymentInstructions: e.target.value })}
                  placeholder="যেমন: নিচের যেকোনো নাম্বারে সেন্ড মানি করে Transaction ID (TrxID) দিন।"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-400 outline-none transition-all h-24 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">হেল্পলাইন মোবাইল</label>
                  <input
                    type="text"
                    value={tempSettings.contactPhone}
                    onChange={(e) => setTempSettings({ ...tempSettings, contactPhone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-400 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">হোয়াটসঅ্যাপ নাম্বার</label>
                  <input
                    type="text"
                    value={tempSettings.whatsappNumber || ''}
                    onChange={(e) => setTempSettings({ ...tempSettings, whatsappNumber: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-400 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">সাপোর্ট ইমেইল</label>
                <input
                  type="email"
                  value={tempSettings.contactEmail}
                  onChange={(e) => setTempSettings({ ...tempSettings, contactEmail: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-400 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">যোগাযোগের ঠিকানা (Address)</label>
                <input
                  type="text"
                  value={tempSettings.contactAddress || ''}
                  onChange={(e) => setTempSettings({ ...tempSettings, contactAddress: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-400 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">ফেসবুক পেজ লিঙ্ক</label>
                <input
                  type="text"
                  value={tempSettings.facebookLink || ''}
                  onChange={(e) => setTempSettings({ ...tempSettings, facebookLink: e.target.value })}
                  placeholder="https://facebook.com/..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-400 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">ইউটিউব চ্যানেল লিঙ্ক</label>
                <input
                  type="text"
                  value={tempSettings.youtubeLink || ''}
                  onChange={(e) => setTempSettings({ ...tempSettings, youtubeLink: e.target.value })}
                  placeholder="https://youtube.com/..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-400 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">ফুটার টেক্সট (Footer Text)</label>
                <input
                  type="text"
                  value={tempSettings.footerText || ''}
                  onChange={(e) => setTempSettings({ ...tempSettings, footerText: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-400 outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      ) : adminView === 'messages' ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full min-w-[800px] text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">প্রেরক</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">বিষয় ও বার্তা</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">তারিখ</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">স্ট্যাটাস</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {messages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    কোনো মেসেজ পাওয়া যায়নি।
                  </td>
                </tr>
              ) : messages.map((msg) => (
                <tr key={msg.id} className={cn("hover:bg-gray-50 transition-colors", msg.status === 'new' && "bg-emerald-50/30")}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <UserIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{msg.name}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {msg.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-sm text-gray-900">{msg.subject}</p>
                    <p className="text-xs text-gray-600 line-clamp-2 mt-1">{msg.message}</p>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {new Date(msg.createdAt).toLocaleString('bn-BD')}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={msg.status}
                      onChange={(e) => onUpdateMessageStatus(msg.id, e.target.value as any)}
                      className={cn(
                        "px-3 py-1.5 text-[10px] font-bold rounded-lg border-0 cursor-pointer focus:ring-2 focus:ring-emerald-400",
                        msg.status === 'new' ? "bg-emerald-100 text-emerald-700" :
                        msg.status === 'read' ? "bg-blue-100 text-blue-700" :
                        "bg-gray-100 text-gray-700"
                      )}
                    >
                      <option value="new">নতুন</option>
                      <option value="read">পঠিত</option>
                      <option value="replied">রিপ্লাই দেয়া হয়েছে</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => onDeleteMessage(msg.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="ডিলিট করুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : adminView === 'service-requests' ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full min-w-[800px] text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">ইউজার</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">সার্ভিস টাইপ</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">ফাইলসমূহ</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">পেমেন্ট</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">তারিখ</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">স্ট্যাটাস ও অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {serviceRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    কোনো সার্ভিস রিকোয়েস্ট পাওয়া যায়নি।
                  </td>
                </tr>
              ) : serviceRequests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900">{req.userName}</p>
                    <p className="text-xs text-gray-500">{req.userMobile}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full uppercase">
                      {req.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {req.photoUrl && (
                        <a href={req.photoUrl} target="_blank" rel="noreferrer" className="p-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors" title="ছবি দেখুন">
                          <Camera className="w-4 h-4 text-gray-600" />
                        </a>
                      )}
                      {req.signatureUrl && (
                        <a href={req.signatureUrl} target="_blank" rel="noreferrer" className="p-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors" title="স্বাক্ষর দেখুন">
                          <FileText className="w-4 h-4 text-gray-600" />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-mono font-bold text-emerald-600">{req.transactionId}</p>
                    <p className="text-[10px] text-gray-500 uppercase font-bold">{req.paymentMethod}</p>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {new Date(req.createdAt).toLocaleDateString('bn-BD')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <span className={cn(
                        "px-3 py-1.5 text-[10px] font-bold rounded-lg",
                        req.status === 'Pending' ? 'bg-amber-50 text-amber-700' :
                        req.status === 'Processing' ? 'bg-blue-50 text-blue-700' :
                        req.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' :
                        'bg-red-50 text-red-700'
                      )}>
                        {req.status === 'Pending' ? 'পেন্ডিং' :
                         req.status === 'Processing' ? 'প্রসেসিং' :
                         req.status === 'Completed' ? 'সম্পন্ন' : 'বাতিল'}
                      </span>
                      <button
                        onClick={() => {
                          setServiceRequestUpdate(req);
                          setNewServiceStatus(req.status);
                        }}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="আপডেট করুন"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : adminView === 'preps' ? (
        <AdminPrepManager showToast={showToast} />
      ) : null}

      {/* Service Request Update Modal */}
      <AnimatePresence>
        {serviceRequestUpdate && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setServiceRequestUpdate(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-lg">সার্ভিস রিকোয়েস্ট আপডেট</h3>
                <button onClick={() => setServiceRequestUpdate(null)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">স্ট্যাটাস পরিবর্তন</label>
                  <select
                    value={newServiceStatus}
                    onChange={(e) => setNewServiceStatus(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-400 outline-none"
                  >
                    <option value="Pending">পেন্ডিং</option>
                    <option value="Processing">প্রসেসিং</option>
                    <option value="Completed">সম্পন্ন</option>
                    <option value="Rejected">বাতিল</option>
                  </select>
                </div>

                {newServiceStatus === 'Completed' && (
                  <>
                    <div className="space-y-4">
                      <label className="block text-sm font-bold text-gray-700">প্রসেসড ফাইল আপলোড করুন</label>
                      
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">প্রসেসড ছবি</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setProcessedPhoto(e.target.files?.[0] || null)}
                          className="w-full text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                        />
                      </div>

                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">প্রসেসড স্বাক্ষর</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setProcessedSignature(e.target.files?.[0] || null)}
                          className="w-full text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setServiceRequestUpdate(null)}
                    className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all"
                  >
                    বাতিল
                  </button>
                  <button
                    onClick={onUpdateServiceStatus}
                    className="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-200 transition-all"
                  >
                    আপডেট করুন
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Status Update Modal with Note */}
      <AnimatePresence>
        {statusUpdate && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setStatusUpdate(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-lg">স্ট্যাটাস আপডেট করুন</h3>
                <button onClick={() => setStatusUpdate(null)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-700 mb-2">নতুন স্ট্যাটাস</label>
                  <div className={`px-4 py-2 rounded-xl font-bold ${
                    statusUpdate.status === 'Ordered' ? 'bg-amber-50 text-amber-700' :
                    statusUpdate.status === 'Demo Sent' ? 'bg-blue-50 text-blue-700' :
                    statusUpdate.status === 'Payment Sent' ? 'bg-purple-50 text-purple-700' :
                    statusUpdate.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' :
                    'bg-red-50 text-red-700'
                  }`}>
                    {statusUpdate.status === 'Ordered' ? 'অর্ডার করা হয়েছে' :
                     statusUpdate.status === 'Demo Sent' ? 'ডেমো পাঠানো হয়েছে' :
                     statusUpdate.status === 'Payment Sent' ? 'পেমেন্ট পাওয়া গেছে' :
                     statusUpdate.status === 'Completed' ? 'সম্পন্ন' : 'বাতিল'}
                  </div>
                </div>
                {statusUpdate.status === 'Demo Sent' && (
                  <div className="mb-4">
                    <label className="block text-sm font-bold text-gray-700 mb-2">ডেমো কপি</label>
                    <div className="flex gap-2">
                       <input
                        type="url"
                        value={demoCopyUrl}
                        onChange={(e) => setDemoCopyUrl(e.target.value)}
                        placeholder="লিঙ্ক দিন (Drive/Dropbox/etc)"
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                      />
                      <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-3 rounded-xl flex items-center justify-center transition-all border border-gray-200">
                        <Upload className="w-5 h-5 text-gray-600" />
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const formData = new FormData();
                              formData.append('file', file);
                              try {
                                const res = await fetch('/api/upload', {
                                  method: 'POST',
                                  body: formData
                                });
                                const data = await res.json();
                                if (data.url) setDemoCopyUrl(window.location.origin + data.url);
                              } catch (err) {
                                console.error("Upload failed", err);
                              }
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                )}
                {statusUpdate.status === 'Completed' && (
                  <div className="mb-4">
                    <label className="block text-sm font-bold text-gray-700 mb-2">ফাইনাল কপি</label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={finalCopyUrl}
                        onChange={(e) => setFinalCopyUrl(e.target.value)}
                        placeholder="লিঙ্ক দিন (Drive/Dropbox/etc)"
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                      />
                      <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-3 rounded-xl flex items-center justify-center transition-all border border-gray-200">
                        <Upload className="w-5 h-5 text-gray-600" />
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const formData = new FormData();
                              formData.append('file', file);
                              try {
                                const res = await fetch('/api/upload', {
                                  method: 'POST',
                                  body: formData
                                });
                                const data = await res.json();
                                if (data.url) setFinalCopyUrl(window.location.origin + data.url);
                              } catch (err) {
                                console.error("Upload failed", err);
                              }
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                )}
                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-700 mb-2">এডমিন নোট (ইউজার দেখবে)</label>
                  <input
                    type="text"
                    value={adminNoteInput}
                    onChange={(e) => setAdminNoteInput(e.target.value)}
                    placeholder="যেমন: ১ ঘন্টার মধ্যে পেমেন্ট করুন।"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">নোট (ঐচ্ছিক)</label>
                  <textarea
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder="এখানে কোনো বিশেষ তথ্য থাকলে লিখুন..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all h-32 resize-none"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setStatusUpdate(null)}
                    className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all"
                  >
                    বাতিল
                  </button>
                  <button
                    onClick={onUpdateStatus}
                    className="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-200 transition-all"
                  >
                    আপডেট করুন
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* History Modal */}
      <AnimatePresence>
        {viewHistory && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewHistory(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-lg">আবেদন ইতিহাস</h3>
                <button onClick={() => setViewHistory(null)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-8 max-h-[60vh] overflow-y-auto">
                <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                  {viewHistory.statusHistory?.map((step, i) => (
                    <div key={i} className="relative pl-10">
                      <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${
                        i === viewHistory.statusHistory!.length - 1 ? 'bg-emerald-500' : 'bg-gray-300'
                      }`}>
                        {i === viewHistory.statusHistory!.length - 1 && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <p className={`text-sm font-bold ${i === viewHistory.statusHistory!.length - 1 ? 'text-emerald-600' : 'text-gray-900'}`}>
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
              </div>
              <div className="p-6 bg-gray-50 border-t border-gray-100">
                <button
                  onClick={() => setViewHistory(null)}
                  className="w-full py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-100 transition-all"
                >
                  বন্ধ করুন
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Search, 
  Briefcase, 
  Building2, 
  Landmark, 
  Globe, 
  Calendar, 
  MapPin, 
  Check,
  Mail,
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  Loader2,
  X,
  Bell,
  User as UserIcon,
  Menu,
  MoreHorizontal,
  Trash2,
  MessageCircle,
  Facebook,
  Edit2,
  LayoutDashboard,
  LayoutGrid,
  Trophy,
  Users,
  Plus,
  LogOut,
  Clock,
  Bookmark,
  FileText,
  Settings,
  Phone,
  BookOpen,
  CheckCircle,
  ArrowLeft,
  ArrowUp,
  Share2,
  MessageSquare,
  Send,
  Camera,
  CreditCard,
  Download,
  History as HistoryIcon,
  Home,
  ChevronDown,
  GraduationCap,
  Info,
  UserCircle,
  ShieldCheck,
  Eye,
  EyeOff,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { 
  Job, 
  JobCategory, 
  AdminStats, 
  Stats, 
  User, 
  Order, 
  CV, 
  SiteSettings, 
  ChatMessage,
  Comment,
  Reply,
  ContactMessage,
  ServiceRequest
} from './types';
import { AdminDashboard } from './components/AdminDashboard';
import { JobCard } from './components/JobCard';
import { UserDashboard } from './components/UserDashboard';
import { OrderModal } from './components/OrderModal';
import { HowItWorksAndFAQ } from './components/HowItWorksAndFAQ';
import { AIInterviewPractice } from './components/AIInterviewPractice';
import { SubjectLessons } from './components/SubjectLessons';
import { MockTest } from './components/MockTest';
import { SkillAssessment } from './components/SkillAssessment';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CATEGORIES: { label: JobCategory; icon: React.ReactNode }[] = [
  { label: 'সব', icon: <Globe className="w-4 h-4" /> },
  { label: 'সরকারি', icon: <Building2 className="w-4 h-4" /> },
  { label: 'বেসরকারি', icon: <Briefcase className="w-4 h-4" /> },
  { label: 'ব্যাংক', icon: <Landmark className="w-4 h-4" /> },
  { label: 'এনজিও', icon: <Globe className="w-4 h-4" /> },
];

// Toast Component
const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error' | 'info', onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 min-w-[320px] max-w-[90vw]",
        type === 'success' ? "bg-emerald-600 text-white" : 
        type === 'error' ? "bg-red-600 text-white" : "bg-blue-600 text-white"
      )}
    >
      {type === 'success' ? <Check className="w-5 h-5 shrink-0" /> : 
       type === 'error' ? <X className="w-5 h-5 shrink-0" /> : <Bell className="w-5 h-5 shrink-0" />}
      <p className="text-sm font-bold flex-1">{message}</p>
      <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

// About Us Component
const AboutUs = ({ siteSettings, setView }: { siteSettings: SiteSettings, setView: (view: any) => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 pt-12 pb-20"
    >
      <div className="max-w-4xl mx-auto px-4">
        <button 
          onClick={() => setView('user')}
          className="flex items-center gap-2 text-emerald-600 font-bold mb-8 hover:underline"
        >
          <ArrowLeft className="w-5 h-5" />
          ফিরে যান
        </button>

        <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-emerald-600 p-12 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-400 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
            </div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="relative z-10"
            >
              <div className="inline-flex p-4 bg-white/20 rounded-3xl backdrop-blur-xl mb-6">
                <Briefcase className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold mb-4">আমাদের সম্পর্কে</h1>
              <p className="text-emerald-50 text-lg max-w-2xl mx-auto">
                {siteSettings.siteName} - আপনার ক্যারিয়ারের বিশ্বস্ত সঙ্গী
              </p>
            </motion.div>
          </div>

          <div className="p-12 space-y-12">
            <section className="space-y-6">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">আমাদের লক্ষ্য ও উদ্দেশ্য</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                আমরা এই ওয়েবসাইটের মাধ্যমে চলমান সকল নিয়োগ বিজ্ঞপ্তি দেখা, নিয়োগ পরীক্ষার প্রস্তুতি ও মেধা যাচাই করা, ক্যারিয়ার বিষয়ক গাইডলাইন প্রদান এবং ঘরে বসেই নির্ভুলভাবে ও ঝামেলা ছাড়াই আমাদের মাধ্যমে যেকোনো চাকরির আবেদন করার সুযোগ দিয়ে থাকি।
              </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 space-y-4">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">নিয়োগ বিজ্ঞপ্তি</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  সরকারি, বেসরকারি, ব্যাংক এবং এনজিওসহ সকল ধরনের চলমান নিয়োগ বিজ্ঞপ্তি সবার আগে এবং নির্ভুলভাবে আমাদের এখানে পাবেন।
                </p>
              </div>

              <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 space-y-4">
                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">পরীক্ষার প্রস্তুতি</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  নিয়োগ পরীক্ষার জন্য বিশেষ প্রস্তুতিমূলক কন্টেন্ট এবং মেধা যাচাইয়ের জন্য কুইজ ও মডেল টেস্টের সুবিধা রয়েছে।
                </p>
              </div>

              <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 space-y-4">
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">ক্যারিয়ার গাইডলাইন</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  সঠিক ক্যারিয়ার নির্বাচনে এবং ইন্টারভিউ টিপসসহ বিভিন্ন ক্যারিয়ার বিষয়ক দিকনির্দেশনা আমরা প্রদান করে থাকি।
                </p>
              </div>

              <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 space-y-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">অনলাইন আবেদন</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  ঘরে বসেই যেকোনো চাকরির আবেদন আমাদের মাধ্যমে নির্ভুলভাবে এবং ঝামেলা ছাড়াই সম্পন্ন করার সুযোগ রয়েছে।
                </p>
              </div>
            </div>

            <section className="bg-emerald-900 rounded-[2.5rem] p-10 text-white text-center space-y-6">
              <h2 className="text-3xl font-bold">আমাদের সাথে যুক্ত হোন</h2>
              <p className="text-emerald-100 max-w-xl mx-auto">
                আপনার ক্যারিয়ারের প্রতিটি ধাপে আমরা আছি আপনার পাশে। আজই আমাদের সাথে যুক্ত হয়ে আপনার স্বপ্নের চাকরি খুঁজে নিন।
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button 
                  onClick={() => { setView('user'); window.scrollTo(0, 0); }}
                  className="bg-white text-emerald-900 px-8 py-4 rounded-2xl font-bold hover:bg-emerald-50 transition-all"
                >
                  চাকরি খুঁজুন
                </button>
                <button 
                  onClick={() => { setView('contact'); window.scrollTo(0, 0); }}
                  className="bg-emerald-800 text-white border border-emerald-700 px-8 py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all"
                >
                  যোগাযোগ করুন
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Contact Us Component
const ContactUs = ({ siteSettings, setView, showToast }: { siteSettings: SiteSettings, setView: (view: any) => void, showToast: (message: string, type: 'success' | 'error' | 'info') => void }) => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        showToast('আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে! আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।', 'success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        showToast('বার্তা পাঠাতে সমস্যা হয়েছে। আবার চেষ্টা করুন।', 'error');
      }
    } catch (error) {
      showToast('সার্ভারে সমস্যা হয়েছে। আবার চেষ্টা করুন।', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 pt-12 pb-20"
    >
      <div className="max-w-6xl mx-auto px-4">
        <button 
          onClick={() => { setView('user'); window.scrollTo(0, 0); }}
          className="flex items-center gap-2 text-emerald-600 font-bold mb-8 hover:underline"
        >
          <ArrowLeft className="w-5 h-5" />
          ফিরে যান
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">যোগাযোগের তথ্য</h2>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">ঠিকানা</h4>
                    <p className="text-gray-500 text-sm">{siteSettings.contactAddress || 'ঢাকা, বাংলাদেশ'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">ফোন</h4>
                    <p className="text-gray-500 text-sm">{siteSettings.contactPhone || siteSettings.whatsappNumber || '০১৭০০০০০০০০'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 shrink-0">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">ইমেইল</h4>
                    <p className="text-gray-500 text-sm">{siteSettings.contactEmail || 'support@jobportal.com'}</p>
                  </div>
                </div>

                {siteSettings.whatsappNumber && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
                      <MessageCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">WhatsApp</h4>
                      <a 
                        href={`https://wa.me/${siteSettings.whatsappNumber}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-emerald-600 text-sm font-bold hover:underline"
                      >
                        সরাসরি মেসেজ দিন
                      </a>
                    </div>
                  </div>
                )}

                {siteSettings.facebookLink && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                      <Facebook className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">ফেসবুক</h4>
                      <a 
                        href={siteSettings.facebookLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm font-bold hover:underline"
                      >
                        আমাদের পেজ ভিজিট করুন
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-12 pt-8 border-t border-gray-100">
                <h4 className="font-bold text-gray-900 mb-4">সোশ্যাল মিডিয়া</h4>
                <div className="flex gap-3">
                  {siteSettings.facebookLink && (
                    <a href={siteSettings.facebookLink} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-all">
                      <Facebook className="w-5 h-5" />
                    </a>
                  )}
                  {siteSettings.whatsappNumber && (
                    <a href={`https://wa.me/${siteSettings.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 hover:bg-emerald-100 transition-all">
                      <MessageCircle className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">আমাদের বার্তা পাঠান</h2>
              <p className="text-gray-500 mb-8">আপনার যেকোনো প্রশ্ন বা মতামতের জন্য নিচের ফর্মটি পূরণ করুন।</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">আপনার নাম</label>
                    <input 
                      required
                      type="text" 
                      placeholder="নাম লিখুন"
                      className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">ইমেইল ঠিকানা</label>
                    <input 
                      required
                      type="email" 
                      placeholder="ইমেইল লিখুন"
                      className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                      value={formData.email || ''}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">বিষয়</label>
                  <input 
                    required
                    type="text" 
                    placeholder="বার্তার বিষয়"
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                    value={formData.subject || ''}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">আপনার বার্তা</label>
                  <textarea 
                    required
                    rows={5}
                    placeholder="এখানে আপনার বার্তাটি লিখুন..."
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all resize-none"
                    value={formData.message || ''}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button 
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      পাঠানো হচ্ছে...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      বার্তা পাঠান
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const MoreServicesPage = ({ setView, handleProtectedView }: { setView: (v: any) => void, handleProtectedView: (v: any) => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 pt-12 pb-20"
    >
      <div className="max-w-4xl mx-auto px-4">
        <button 
          onClick={() => setView('user')}
          className="flex items-center gap-2 text-emerald-600 font-bold mb-8 hover:underline"
        >
          <ArrowLeft className="w-5 h-5" />
          ফিরে যান
        </button>

        <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-emerald-600 p-12 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-400 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
            </div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="relative z-10"
            >
              <div className="inline-flex p-4 bg-white/20 rounded-3xl backdrop-blur-xl mb-6">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold mb-4">আরও সেবা</h1>
              <p className="text-emerald-50 text-lg max-w-2xl mx-auto">
                আপনার ক্যারিয়ার এবং দৈনন্দিন কাজের জন্য প্রয়োজনীয় বিশেষ সেবাগুলো এখানে পাবেন।
              </p>
            </motion.div>
          </div>

          <div className="p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  id: 'translation-service',
                  title: 'ট্রান্সলেশন সেবা', 
                  desc: 'বাংলা থেকে ইংরেজি বা ইংরেজি থেকে বাংলা অনুবাদ করুন সহজেই।',
                  price: 'ফ্রি',
                  icon: <Globe className="w-8 h-8" />,
                  color: 'bg-blue-100 text-blue-600'
                },
                { 
                  id: 'bangla-converter',
                  title: 'বাংলা লেখা কনভার্টার', 
                  desc: 'ইউনিকোড টু বিজয় এবং বিজয় টু ইউনিকোড কনভার্ট করুন।',
                  price: 'ফ্রি',
                  icon: <FileText className="w-8 h-8" />,
                  color: 'bg-purple-100 text-purple-600'
                },
                { 
                  id: 'photo-resizer',
                  title: 'ছবি ও স্বাক্ষর সাইজ', 
                  desc: 'চাকুরির আবেদনের জন্য ছবি (300x300) ও স্বাক্ষর (300x80) সাইজ করুন।',
                  price: '১০ টাকা',
                  icon: <Sparkles className="w-8 h-8" />,
                  color: 'bg-emerald-100 text-emerald-600'
                }
              ].map((service, index) => (
                <motion.div 
                  key={index}
                  whileHover={{ y: -5 }}
                  className="p-8 bg-white rounded-[2.5rem] border border-gray-100 text-left shadow-lg shadow-gray-100/50 hover:shadow-xl transition-all cursor-pointer"
                  onClick={() => handleProtectedView(service.id as any)}
                >
                  <div className={`w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center mb-6`}>
                    {service.icon}
                  </div>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${service.price === 'ফ্রি' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
                      {service.price}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">{service.desc}</p>
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                    সেবাটি গ্রহণ করুন
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-16 pt-12 border-t border-gray-100 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">শীঘ্রই আরও সেবা আসছে!</h3>
              <p className="text-gray-500 max-w-2xl mx-auto mb-8">
                আমরা আপনাদের জন্য আরও কিছু প্রিমিয়াম সেবা নিয়ে কাজ করছি যা আপনার ক্যারিয়ারের পথকে আরও সহজ করবে।
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {['প্রিমিয়াম সিভি মেকিং', 'ক্যারিয়ার কাউন্সিলিং', 'জব অ্যালার্ট সার্ভিস', 'ডকুমেন্ট ভেরিফিকেশন'].map((s, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-gray-400 text-sm font-medium">
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const CareerGuidePage = ({ title, content, onBack }: { title: string; content: React.ReactNode; onBack?: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4 py-12"
    >
      {onBack && (
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-emerald-600 font-bold mb-6 hover:underline"
        >
          <ArrowLeft className="w-5 h-5" />
          ফিরে যান
        </button>
      )}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-emerald-600 p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <div className="w-20 h-1.5 bg-white/30 rounded-full" />
        </div>
        <div className="p-8 prose prose-emerald max-w-none">
          {content}
        </div>
      </div>
    </motion.div>
  );
};

const TranslationService = ({ showToast, onBack }: { showToast: (msg: string, type: 'success' | 'error' | 'info') => void; onBack: () => void }) => {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [direction, setDirection] = useState<'bn-en' | 'en-bn'>('bn-en');

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setIsTranslating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = direction === 'bn-en' 
        ? `Translate the following Bengali text to English. Return only the translated text: "${inputText}"`
        : `Translate the following English text to Bengali. Return only the translated text: "${inputText}"`;
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      setTranslatedText(response.text || '');
    } catch (error) {
      showToast('অনুবাদ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।', 'error');
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <CareerGuidePage 
      title="ট্রান্সলেশন সেবা (Translation Service)"
      onBack={onBack}
      content={
        <div className="space-y-6">
          <div className="flex justify-center gap-4 mb-6">
            <button 
              onClick={() => setDirection('bn-en')}
              className={`px-6 py-2 rounded-xl font-bold transition-all ${direction === 'bn-en' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600'}`}
            >
              বাংলা → ইংরেজি
            </button>
            <button 
              onClick={() => setDirection('en-bn')}
              className={`px-6 py-2 rounded-xl font-bold transition-all ${direction === 'en-bn' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600'}`}
            >
              ইংরেজি → বাংলা
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">আপনার লেখা</label>
              <textarea 
                className="w-full h-48 px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all resize-none"
                placeholder={direction === 'bn-en' ? 'এখানে বাংলা লিখুন...' : 'Type English here...'}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">অনুবাদ</label>
              <div className="w-full h-48 px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 overflow-y-auto whitespace-pre-wrap text-gray-800">
                {isTranslating ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                  </div>
                ) : translatedText || 'অনুবাদ এখানে দেখা যাবে...'}
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <button 
              onClick={handleTranslate}
              disabled={isTranslating || !inputText.trim()}
              className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg disabled:opacity-50 flex items-center gap-2"
            >
              {isTranslating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Globe className="w-5 h-5" />}
              অনুবাদ করুন
            </button>
          </div>
        </div>
      }
    />
  );
};

const BanglaConverter = ({ onBack, showToast }: { onBack: () => void, showToast: (msg: string, type: 'success' | 'error') => void }) => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState<'u2b' | 'b2u'>('u2b');

  const handleConvert = () => {
    if (!inputText.trim()) {
      setOutputText('');
      return;
    }

    // Comprehensive Unicode to Bijoy and Bijoy to Unicode mapping logic
    // This is a simplified but functional implementation of the mapping
    const unicodeToBijoyMap: { [key: string]: string } = {
      'অ': 'A', 'আ': 'Av', 'ই': 'B', 'ঈ': 'C', 'উ': 'D', 'ঊ': 'E', 'ঋ': 'F', 'এ': 'G', 'ঐ': 'H', 'ও': 'I', 'ঔ': 'J',
      'ক': 'K', 'খ': 'L', 'গ': 'M', 'ঘ': 'N', 'ঙ': 'O', 'চ': 'P', 'ছ': 'Q', 'জ': 'R', 'ঝ': 'S', 'ঞ': 'T',
      'ট': 'U', 'ঠ': 'V', 'ড': 'W', 'ঢ': 'X', 'ণ': 'Y', 'ত': 'Z', 'থ': '[', 'দ': '\\', 'ধ': ']', 'ন': '^',
      'প': '_', 'ফ': '`', 'ব': 'a', 'ভ': 'b', 'ম': 'c', 'য': 'd', 'র': 'e', 'ল': 'f', 'শ': 'g', 'ষ': 'h', 'স': 'i', 'হ': 'j',
      'ড়': 'k', 'ঢ়': 'l', 'য়': 'm', 'ৎ': 'n', 'ং': 'o', 'ঃ': 'p', 'ঁ': 'q',
      'া': 'v', 'ি': 'w', 'ী': 'x', 'ু': 'y', 'ূ': 'z', 'ৃ': '{', 'ে': 't', 'ৈ': 'u', 'ো': 'v', 'ৌ': 'w',
      '্': '&', '।': '|', '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4', '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
    };

    const bijoyToUnicodeMap: { [key: string]: string } = Object.fromEntries(
      Object.entries(unicodeToBijoyMap).map(([k, v]) => [v, k])
    );

    let result = '';
    if (mode === 'u2b') {
      let text = inputText;
      
      // 1. Handle Reph (র + ্ + Consonant -> Consonant + &)
      text = text.replace(/র্([ক-হ])/g, '$1&');
      
      // 2. Handle ো and ৌ
      text = text.replace(/([ক-হ])ো/g, 't$1v');
      text = text.replace(/([ক-হ])ৌ/g, 't$1w');
      
      // 3. Handle ে, ি, ৈ
      text = text.replace(/([ক-হ])ে/g, 't$1');
      text = text.replace(/([ক-হ])ি/g, 'w$1');
      text = text.replace(/([ক-হ])ৈ/g, 'u$1');

      // 4. Map remaining characters
      result = text.split('').map(char => unicodeToBijoyMap[char] || char).join('');
    } else {
      let text = inputText;
      
      // 1. Handle ো and ৌ (tCv -> Cো, tCw -> Cৌ)
      text = text.replace(/t([A-Za-z])v/g, '$1ো');
      text = text.replace(/t([A-Za-z])w/g, '$1ৌ');
      
      // 2. Handle ে, ি, ৈ (tC -> Cে, wC -> Cি, uC -> Cৈ)
      text = text.replace(/t([A-Za-z])/g, '$1ে');
      text = text.replace(/w([A-Za-z])/g, '$1ি');
      text = text.replace(/u([A-Za-z])/g, '$1ৈ');
      
      // 3. Handle Reph (C& -> র + ্ + C)
      text = text.replace(/([A-Za-z])&/g, 'র্$1');

      // 4. Map remaining characters
      result = text.split('').map(char => bijoyToUnicodeMap[char] || char).join('');
    }
    
    setOutputText(result);
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
  };

  return (
    <CareerGuidePage 
      title="বাংলা লেখা কনভার্টার (Unicode/Bijoy)"
      onBack={onBack}
      content={
        <div className="space-y-6">
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <button 
              onClick={() => setMode('u2b')}
              className={`px-6 py-2 rounded-xl font-bold transition-all ${mode === 'u2b' ? 'bg-purple-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600'}`}
            >
              ইউনিকোড টু বিজয়
            </button>
            <button 
              onClick={() => setMode('b2u')}
              className={`px-6 py-2 rounded-xl font-bold transition-all ${mode === 'b2u' ? 'bg-purple-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600'}`}
            >
              বিজয় টু ইউনিকোড
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-bold text-gray-700">ইনপুট টেক্সট</label>
                <button 
                  onClick={handleClear}
                  className="text-xs font-bold text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  মুছে ফেলুন
                </button>
              </div>
              <textarea 
                className="w-full h-48 px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all resize-none font-sans"
                placeholder="এখানে লেখা পেস্ট করুন..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-bold text-gray-700">আউটপুট টেক্সট</label>
                {outputText && (
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(outputText);
                      showToast('কপি করা হয়েছে!', 'success');
                    }}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
                  >
                    <Check className="w-3 h-3" />
                    কপি করুন
                  </button>
                )}
              </div>
              <textarea 
                readOnly
                className="w-full h-48 px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none transition-all resize-none font-sans"
                placeholder="কনভার্ট করা লেখা এখানে আসবে..."
                value={outputText}
              />
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <button 
              onClick={handleConvert}
              className="bg-purple-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-purple-700 transition-all shadow-lg flex items-center gap-2"
            >
              <FileText className="w-5 h-5" />
              কনভার্ট করুন
            </button>
          </div>
          
          <p className="text-xs text-center text-gray-400 italic">
            দ্রষ্টব্য: এটি একটি প্রাথমিক সংস্করণ। জটিল ফন্ট স্টাইলের ক্ষেত্রে কিছু সীমাবদ্ধতা থাকতে পারে।
          </p>
        </div>
      }
    />
  );
};

const InterviewTipsContent = ({ onBack, showToast }: { onBack: () => void; showToast: (msg: string, type: 'success' | 'error' | 'info') => void }) => {
  const [activeTab, setActiveTab] = useState<'prep' | 'qa' | 'body' | 'checklist'>('prep');
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    showToast('টেমপ্লেট কপি করা হয়েছে!', 'success');
    setTimeout(() => setCopiedText(null), 2000);
  };

  const checklistItems = [
    { id: '1', label: 'আমি কোম্পানির অফিসিয়াল ওয়েবসাইট ও তাদের সাম্প্রতিক কার্যক্রমগুলোর বিশদ খোঁজ নিয়েছি।' },
    { id: '2', label: 'আমি যে পদের জন্য ইন্টারভিউ দিচ্ছি, তার প্রধান দায়িত্বগুলো ভালোভাবে পর্যালোচনা করেছি।' },
    { id: '3', label: 'কমপক্ষে ৩ কপি রঙিন ছবি এবং ৫ কপি পাসপোর্ট আকারের ছবি ও ৫ সেট আপডেট সিভি প্রস্তুত করেছি।' },
    { id: '4', label: 'ইন্টারভিউয়ের অন্তত ১ দিন আগে মার্জিত ফরমাল পোশাক ধুয়ে এবং ইস্ত্রি করে গুছিয়ে রেখেছি।' },
    { id: '5', label: 'নিজের অন্তত ৩টি অনন্য ভালো দিক (Strengths) এবং ১টি বাস্তব দুর্বলতা সুন্দর উদাহরণের মাধ্যমে রেডি করেছি।' },
    { id: '6', label: 'ইন্টারভিউ বোর্ডের সমাপনী মুহূর্তে রিক্রুটারকে জিজ্ঞেস করার জন্য ২টি চমৎকার প্রশ্ন রেডি রেখেছি।' },
    { id: '7', label: 'ইন্টারভিউ শুরুর অন্তত ৩০ মিনিট আগে অফিসে উপস্থিত সুনিশ্চিত করার জন্য বাসা থেকে বের হওয়ার সময় নির্ধারণ করেছি।' }
  ];

  const qas = [
    {
      q: '১. নিজের সম্পর্কে কিছু বলুন? (Tell me about yourself?)',
      formula: 'পদ্ধতি: বর্তমান চাকরি/দক্ষতা + রিকর্ড বা বিগত কাজের সাফল্য + আপনার শিক্ষাগত ব্যাকগ্রাউন্ড + কেন এই পদে আগ্রহ ও কাজের লক্ষ্য।',
      ans: 'উত্তর উদাহরণ: "ধন্যবাদ স্যার আমাকে আমার সম্পর্কে বলার সুযোগ দেওয়ার জন্য। আমি বর্তমানে একজন [আপনার পদের নাম] হিসেবে [আপনার প্রতিষ্ঠানের নাম]-এ কর্মরত আছি, যেখানে আমার মূল দায়িত্ব হলো [আপনার দায়িত্ব]। আমার রয়েছে [X] বছরের কাজের চমৎকার ট্র্যাক রেকর্ড এবং আমি সম্প্রতি [আপনার প্রধান সাফল্য] অর্জন করেছি। আমি [ইউনিভার্সিটির নাম] থেকে পড়াশোনা সম্পন্ন করেছি। আমি মনে করি আপনাদের প্রতিষ্ঠানের প্রবৃদ্ধি এবং আমার এই কাজের ব্যাকগ্রাউন্ড একে অপরের সাথে দারুণভাবে মিলে যায়, যা আমাকে এই পদের জন্য অত্যন্ত যোগ্য প্রমাণ করে।"'
    },
    {
      q: '২. আপনার সেরা কাজের শক্তি বা কর্মক্ষমতা (Strengths) কী?',
      formula: 'পদ্ধতি: এমন স্কিল বা গুণাবলী উল্লেখ করুন যা চাকুরির ডেসক্রিপশনের সাথে সরাসরি মিলে যায় এবং তার একটি প্রমাণ বা উদাহরণ দিন।',
      ans: 'উত্তর উদাহরণ: "আমার অন্যতম প্রধান শক্তি হচ্ছে যেকোনো কঠিন ও সংকটময় মুহূর্তে ঠাণ্ডা মাথায় সঠিক সিদ্ধান্ত নেওয়া এবং যেকোনো নতুন পরিবেশের সাথে দ্রুত খাপ খাইয়ে নেওয়া। যেমন, আমার পূর্বের চাকরিতে একটি ক্লায়েন্টের অতি জরুরি বড় প্রজেক্ট ডেডলাইন থ্রেট থাকা সত্ত্বেও আমি ও আমার টিম অতিরিক্ত পরিশ্রম করে সাকসেসফুলি ৭ দিন আগেই ডেলিভারি দিয়ে ক্লায়েন্ট সন্তুষ্টি নিশ্চিত করেছিলাম।"'
    },
    {
      q: '৩. আপনার ক্যারিয়ারে সবচেয়ে বড় দুর্বলতা (Weakness) কী?',
      formula: 'পদ্ধতি: এমন দুর্বলতা বলুন যা চাকরির কোনো বড় ক্ষতি করবে না, এবং আপনি সেটি দূর করতে বর্তমানে কী ব্যবস্থা নিচ্ছেন তার চমৎকার উদাহরণ দিন।',
      ans: 'উত্তর উদাহরণ: "আগে আমার সবচেয়ে বড় দুর্বলতা ছিল অন্য কাওকে কোনো সরাসরি কাজে না বলতে না পারা এবং অতিরিক্ত কাজ নিজের ঘাড়ে একা নেওয়া, যার ফলে অনেক চাপ তৈরি হতো। কিন্তু এখন আমি কাজ বন্টন ও কাজের প্রায়োরিটি সেট করা শিখছি। আমি কন্টিনিউয়াস প্রজেক্ট ট্র্যাকার এবং To-Do লিস্ট মেন্টেন করছি যাতে কাজের গুণমান ধরে রেখে পারফেক্ট সময় নিয়ন্ত্রণ করা যায়। এটি আমার কাজকে অনেক সহজ করে তুলছে।"'
    }
  ];

  const emailText = `বিষয়: ইন্টারভিউ বোর্ডের সুযোগ দানের জন্য আন্তরিক ধন্যবাদ — [আপনার নাম] — [পদের নাম]

প্রিয় স্যার/ম্যাডাম,

আজকে সফলভাবে সম্পন্ন হওয়া [প্রতিষ্ঠানের নাম] এর "[পদের নাম]" পদের চমৎকার ইন্টারভিউ বোর্ডে অংশ নেওয়ার অনুমতি প্রদানের জন্য আমি আপনার টিম এবং রিক্রুটারদের প্রতি গভীর কৃতজ্ঞতা প্রকাশ করছি। আজ আপনাদের মূল্যবান সময় দিয়ে আমার ক্যারিয়ার বিষয়ক চমৎকার আলোচনা পরিচালনা করায় আমি অত্যন্ত আনন্দিত।

আমাদের মধ্যকার সংক্ষিপ্ত আলোচনার মাধ্যমে আমি আপনাদের প্রতিষ্ঠানের লক্ষ্য এবং কর্মপরিবেশ সম্পর্কে জেনে অত্যন্ত অনুপ্রাণিত হয়েছি। আমি গভীরভাবে বিশ্বাস করি, আমার শিক্ষাগত যোগ্যতা ও বিগত প্রফেশনাল অভিজ্ঞতা দিয়ে আমি দায়িত্বসমূহ সফলভাবে পরিচালনা করতে সক্ষম হবো।

আমার আবেদনটি যত্নসহকারে বিবেচনা করার জন্য আবার ধন্যবাদ জানাচ্ছি। যেকোনো পরবর্তী করণীয় বা কাগজপত্রের প্রয়োজন হলে অনুগ্রহপূর্বক আমাকে অবগত করবেন।

আপনার সুন্দর দিন কামনা করছি।

বিনীত,
[আপনার নাম]
[মোবাইল নম্বর]
[ইমেইল এড্রেস]`;

  return (
    <CareerGuidePage
      title="প্রফেশনাল ইন্টারভিউ প্রস্তুতি গাইড (Interview Guide)"
      onBack={onBack}
      content={
        <div className="space-y-8 font-bengali text-gray-700">
          {/* Top Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-4">
            {[
              { id: 'prep', label: 'প্রস্তুতির ৩ ধাপ', icon: <Briefcase className="w-4 h-4" /> },
              { id: 'qa', label: 'কমন প্রশ্নোত্তর', icon: <GraduationCap className="w-4 h-4" /> },
              { id: 'body', label: 'বডি ল্যাঙ্গুয়েজ টিপস', icon: <Sparkles className="w-4 h-4" /> },
              { id: 'checklist', label: 'প্রস্তুতি চেকলিস্ট', icon: <CheckCircle className="w-4 h-4" /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={clsx(
                  "flex items-center gap-2 px-5 py-3 rounded-2xl text-xs md:text-sm font-bold transition-all border-2",
                  activeTab === tab.id
                    ? "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-50"
                    : "bg-white border-gray-100 text-gray-500 hover:border-emerald-600 hover:text-emerald-600"
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Preparations Stages */}
          {activeTab === 'prep' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-6 rounded-3xl border border-emerald-100 mb-6">
                <h3 className="text-lg font-bold text-emerald-800 mb-2 flex items-center gap-2 font-bengali">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  ইন্টারভিউ পাস করার মূল চাবিকাঠি
                </h3>
                <p className="text-emerald-900/80 text-sm leading-relaxed">
                  একটি অসাধারণ ইন্টারভিউ শুরু হয় রুমে ঢোকার অনেক পূর্বে, এবং শেষ হয় আপনার নিখুঁত ফলো-আপের মাধ্যমে। নিজেকে শতভাগ নিশ্চিত করতে নিচের ৩টি বড় পর্যায়গুলো গভীরভাবে অনুসরণ করুন।
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                  <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center">
                    <span className="text-xl font-black text-amber-600 font-sans">01</span>
                  </div>
                  <h4 className="text-base font-bold text-gray-900">ধাপ ১: কোম্পানির ব্যাকগ্রাউন্ড ও পজিশন স্টাডি</h4>
                  <p className="text-xs text-gray-500 leading-relaxed font-bengali">
                    কোম্পানির মিশন, ভিশন, সার্ভিস পোর্টফোলিও জানুন। পদের দায়িত্ব (Job Responsibilities) ভালোভাবে পড়ে আপনার অভিজ্ঞতার সাথে মিলগুলো চিহ্নিত করুন এবং সেগুলো প্রফেশনালি হাইলাইট করার কৌশল বের করুন।
                  </p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                    <span className="text-xl font-black text-blue-600 font-sans">02</span>
                  </div>
                  <h4 className="text-base font-bold text-gray-900">ধাপ ২: প্রফেশনাল পোশাক ও পরিমার্জিত রূপ</h4>
                  <p className="text-xs text-gray-500 leading-relaxed font-bengali">
                    নম্র এবং ডেকোরাম সমৃদ্ধ ফরমাল পোশাক নির্বাচন করুন। পুরুষদের কোট-টাই বা পরিষ্কার ইস্ত্রি করা শার্ট-প্যান্ট ও ফরমাল জুতো। নারীদের মার্জিত কামিজ বা শাড়ি। সুনির্দিষ্ট ফরমাল সাজগোজ ও চুলে পরিপাটি ভাব বজায় রাখুন।
                  </p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                    <span className="text-xl font-black text-emerald-600 font-sans">03</span>
                  </div>
                  <h4 className="text-base font-bold text-gray-900">ধাপ ৩: প্রয়োজনীয় সব কাগজের ট্র্যাকিং ফাইল</h4>
                  <p className="text-xs text-gray-500 leading-relaxed font-bengali">
                    ন্যূনতম ৩ থেকে ৫ কপি ঝকঝকে রঙিন পরিষ্কার সিভি, ছবির কপি, জাতীয় পরিচয়পত্র বা এনআইডির মূল কপি, পূর্ববর্তী কাজের মূল সার্টিফিকেট এবং ট্রান্সক্রিপ্ট সুন্দর ফাইলে রেডি রাখুন যাতে বোর্ডে ডাকার আগে খুঁজতে না হয়।
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Common Q&A */}
          {activeTab === 'qa' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-950 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-emerald-600" />
                শীর্ষ ৩টি কমন ইন্টারভিউ প্রশ্নোত্তর (Q&A Formula)
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">
                ইন্টারভিউ বোর্ডে এই প্রশ্নগুলো প্রায়ই যেকোনো ক্যান্ডিডেটের দক্ষতা ও মনস্তাত্ত্বিক অবস্থা পরীক্ষার জন্য করা হয়। কীভাবে উত্তর দিবেন তার আদর্শ গাইডলাইন:
              </p>

              <div className="space-y-4">
                {qas.map((qa, idx) => (
                  <div key={idx} className="bg-gray-50 p-6 rounded-2xl border border-gray-100/90 space-y-3">
                    <h4 className="font-bold text-sm text-emerald-800 flex items-center gap-2 font-bengali">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      {qa.q}
                    </h4>
                    <p className="text-xs font-bold text-gray-500 border-l-2 border-amber-400 pl-3 py-1">
                      {qa.formula}
                    </p>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      {qa.ans}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Body Language */}
          {activeTab === 'body' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 space-y-6">
                <h3 className="text-lg font-bold text-gray-950 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  শারীরিক অঙ্গভঙ্গি ও মনস্তাত্ত্বিক বডি ল্যাঙ্গুয়েজ টিপস
                </h3>
                <p className="text-sm text-gray-500">
                  নিয়োগকর্তারা সবসময় আপনার মৌখিক উত্তরের পাশাপাশি আপনার বডি ল্যাঙ্গুয়েজের মাধ্যমে মানসিক আত্মবিশ্বাস ও সততা খুব কাছ থেকে পর্যবেক্ষণ করেন।
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div className="space-y-4 p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                    <h4 className="font-bold text-emerald-950 text-sm">১. রুমে প্রবেশের মুহূর্তে করণীয়:</h4>
                    <ul className="space-y-2 text-xs text-emerald-900 list-decimal pl-4">
                      <li>রুমে প্রবেশের জন্য দরজা খুলে অত্যন্ত বিনীতভাবে রুমে আসার অনুমতি চান।</li>
                      <li>মুখে সাধারণ ও মার্জিত হাসি রাখুন এবং বিনীতভাবে সালাম বা কুশলাদি বিনিময় করুন।</li>
                      <li>রিক্রুটাররা আপনাকে যতক্ষণ বসার অনুরোধ না করছেন ততোক্ষণ পর্যন্ত শান্তভাবে দাঁড়িয়ে থাকুন এবং ধন্যবাদ জানিয়ে বসুন।</li>
                    </ul>
                  </div>

                  <div className="space-y-4 p-5 bg-blue-50/50 rounded-2xl border border-blue-100">
                    <h4 className="font-bold text-blue-950 text-sm">২. আই কন্ট্যাক্ট এবং বসার ভঙ্গি:</h4>
                    <ul className="space-y-2 text-xs text-blue-900 list-decimal pl-4">
                      <li>বসার সময় সোজা হয়ে মেরুদণ্ড সোজাসুজি করে আরামদায়কভাবে বসুন। কোনো কিছুর উপর অতিরিক্ত হেলান বা ঝুলবেন না।</li>
                      <li>কথা বলার সময় প্রশ্নকর্তার চোখে সরাসরি তাকান (খুব বেশি অতিরিক্ত কঠোরভাবে নয়, তবে অন্তত ৬০% সময় আই কন্ট্যাক্ট ইতিবাচক প্রফেশনালি)।</li>
                      <li>যদি বোর্ডে একাধিক সদস্য থাকে, তবে আপনার দিকে যে প্রশ্ন ছুঁড়ছে তাকে বেশি সময় এবং বাকিদেরও হালকা চোখে চোখ রেখে কুশল বজায় বলুন।</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Interactive Checklist */}
          {activeTab === 'checklist' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-950 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                ইন্টারেক্টিভ সেলফ-প্রিপারেশন চেকলিস্ট
              </h3>
              <p className="text-sm text-gray-500">
                ইন্টারভিউ বোর্ড রুমে যাওয়ার আগের দিন চেক করতে পারেন আপনার নিজের প্রস্তুতি ১০০% সম্পূর্ণ হয়েছে কিনা। নিচে ক্লিক করে মেলান:
              </p>

              <div className="space-y-3">
                {checklistItems.map(item => (
                  <label
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className={clsx(
                      "flex items-start gap-3 p-4 rounded-2xl border transition-all cursor-pointer",
                      checkedItems[item.id]
                        ? "bg-emerald-50/80 border-emerald-200 text-emerald-900"
                        : "bg-white border-gray-100 hover:border-gray-200 text-gray-600"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={!!checkedItems[item.id]}
                      onChange={() => {}}
                      className="mt-1 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-xs md:text-sm font-medium leading-relaxed">{item.label}</span>
                  </label>
                ))}
              </div>

              {/* Thank you email section */}
              <div className="mt-8 p-6 bg-amber-50 rounded-3xl border border-amber-100 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-sm text-amber-900 flex items-center gap-2">
                    <Send className="w-5 h-5 text-amber-600" />
                    ইন্টারভিউ শেষ হওয়ার পর "Thank You" ইমেইল টেমপ্লেট
                  </h4>
                  <button
                    onClick={() => handleCopy(emailText, 'email')}
                    className="px-4 py-1.5 bg-amber-600/10 hover:bg-amber-600/20 text-amber-800 rounded-xl text-xs font-bold transition-all"
                  >
                    {copiedText === 'email' ? 'কপি হয়েছে!' : 'কপি করুন'}
                  </button>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  ইন্টারভিউ দেওয়ার দিন রাতের আগে বা ২৪ ঘণ্টার মধ্যে একটি থ্যাঙ্ক ইউ ইমেইল পাঠানো অত্যন্ত প্রফেশনাল এবং এটি আপনাকে বাকি ক্যান্ডিডেটের চেয়ে আলাদা পরিচিতি দিবে। নিচের টেক্সটটি কপি করে ব্যবহার করুন:
                </p>
                <pre className="p-4 bg-white rounded-2xl text-xs font-sans text-gray-700 whitespace-pre-wrap overflow-x-auto border border-amber-100/60 max-h-48 overflow-y-auto">
                  {emailText}
                </pre>
              </div>
            </div>
          )}
        </div>
      }
    />
  );
};

const ResumeGuideContent = ({ onBack, showToast }: { onBack: () => void; showToast: (msg: string, type: 'success' | 'error' | 'info') => void }) => {
  const [activeTab, setActiveTab] = useState<'structure' | 'rules' | 'audit' | 'copyable'>('structure');
  const [checkedAudit, setCheckedAudit] = useState<{ [key: string]: boolean }>({});
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const toggleAudit = (id: string) => {
    setCheckedAudit(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    showToast('টেমপ্লেট কপি করা হয়েছে!', 'success');
    setTimeout(() => setCopiedText(null), 2000);
  };

  const auditItems = [
    { id: 'a1', label: 'সিভিতে কোনো প্রকার ব্যাকরণগত বা বানান ভুল (Spelling Mistakes) নেই।' },
    { id: 'a2', label: 'আমার ব্যবহৃত ইমেইল এড্রেসটি শতভাগ প্রফেশনাল ও মার্জিত (যেমন: rahman.shuvo@email.com, কোনো ছদ্মনাম বা অতিরিক্ত স্টাইলিং নম্বর নয়)' },
    { id: 'a3', label: 'সিভির সর্বোচ্চ দৈর্ঘ্য ১ পেজ রাখার চেষ্টা করেছি (৫ বছরের নিচে অভিজ্ঞতা হলে ১ পেজ অত্যন্ত স্ট্যান্ডার্ড নিয়ম)' },
    { id: 'a4', label: 'ডিজাইনে হিজিবিজি কালার, অতিরিক্ত গ্রাফিক্যাল বার বা স্কিলের পাশে স্টার-ডট রেটিং প্রদর্শন এড়ানো হয়েছে।' },
    { id: 'a5', label: 'আমার বর্তমান কাজের অভিজ্ঞতা সম্পূর্ণ রিভার্স ক্রনোলজিক্যাল (সদ্য চাকরি সবার উপরে) ফরম্যাটে রাখা হয়েছে।' },
    { id: 'a6', label: 'ফাইলটি চূড়ান্তভাবে পিডিএফ (.pdf) ফরম্যাটে মেইল করার জন্য সেভ করা রয়েছে।' },
    { id: 'a7', label: 'সিভি ফাইলের নাম দেওয়ার সময় অর্থপূর্ণ নাম দেওয়া হয়েছে (যেমন: CV_of_Shuvo_Rahman_Software_Engineer.pdf)।' }
  ];

  const cvStructureText = `RESUME OF [YOUR FULL NAME]
[City, Country] | [+8801XXXXXXXXX] | [your.professional.email@email.com] | [linkedin.com/in/yourprofile]

CAREER OBJECTIVE
Highly motivated and proactive [Your Profession/Graduate Major Area] seeking to leverage my strong foundation in [Skill 1], [Skill 2], and practical project coordination experience at [Target Company Name]. Highly dedicated to achieving the team's shared goals and ensuring smooth operational growth.

WORK EXPERIENCE
[Job Title/Position Name]
[Company Name] — [City, Country]
[Starting Month, Year] – [Ending Month, Year or Present]
• Led a group of [X] members to coordinate [Y] projects, resulting in an [X]% boost in team productivity.
• Analyzed market trends and collaborated with executive leadership to deploy the [Z] platform, onboarding [X] new users.
• Solved complex operational roadblocks, decreasing system downtime by [X]% within the first quarter.

EDUCATION
[Bachelor of Science in Major Name] - [University/College Name]
[Passing Year] | [CGPA / Grade]
[High School Certificate (HSC)] - [College Name]
[Passing Year] | [GPA]

KEY SKILLS
• Industry Expertise: [Skill Area A], [Skill Area B], Analytical Dashboarding
• Technical Proficiencies: [Tools/Software 1], [Tools/Software 2]
• Soft Skills: Excellent Team Communication, Crisis Management, Assertiveness

CERTIFICATIONS & HIGHLIGHTS
• Certified [Certification Name] - [Issuing Organization Name], [Year]
• Champion, [Competition Name] - organized by [Host Union Name], [Year]`;

  return (
    <CareerGuidePage
      title="সম্পূর্ণ জীবনবৃত্তান্ত ও সিভি রাইটিং গাইড (Resume Class)"
      onBack={onBack}
      content={
        <div className="space-y-8 font-bengali text-gray-700">
          {/* Top Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-4">
            {[
              { id: 'structure', label: 'সিভির সঠিক স্ট্রাকচার', icon: <FileText className="w-4 h-4" /> },
              { id: 'rules', label: '৫টি সুবর্ণ নিয়ম', icon: <GraduationCap className="w-4 h-4" /> },
              { id: 'audit', label: 'সিভি সেলফ-অডিট', icon: <ShieldCheck className="w-4 h-4" /> },
              { id: 'copyable', label: 'কপিযোগ্য টেক্সট গাইড', icon: <Download className="w-4 h-4" /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={clsx(
                  "flex items-center gap-2 px-5 py-3 rounded-2xl text-xs md:text-sm font-bold transition-all border-2",
                  activeTab === tab.id
                    ? "bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-50"
                    : "bg-white border-gray-100 text-gray-500 hover:border-purple-600 hover:text-purple-600"
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Structure */}
          {activeTab === 'structure' && (
            <div className="space-y-6">
              <div className="bg-purple-50 p-6 rounded-3xl border border-purple-100">
                <h3 className="text-base font-bold text-purple-950 mb-1 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  একটি স্ট্যান্ডার্ড প্রফেশনাল সিভির প্রধান অংশসমূহ
                </h3>
                <p className="text-xs text-purple-900/80 leading-relaxed">
                  বর্তমান কর্পোরেট যুগে রিক্রুটাররা খুব সংক্ষিপ্ত সময় ব্যয় করেন একটি সিভির প্রাথমিক বাছাই বা স্ক্রিনিংয়ে। সঠিক স্থানে সঠিক তথ্য রাখার নমুনা নিচে দেওয়া হলো:
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-2">
                  <h4 className="font-bold text-sm text-purple-950">১. কন্টাক্ট ইনফরমেশন (Header):</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    সবার উপরে স্পষ্ট ফন্টে নিজের সম্পূর্ণ নাম, কার্যকর সচল ফোন নম্বর, প্রফেশনাল ইমেইল ও লিংকডইন (LinkedIn) লিংক ব্যবহার করুন। অপ্রাসঙ্গিক বিষয় যেমন: রক্তের গ্রুপ, বাবা-মায়ের নাম এবং শখের অতিরিক্ত বিবরণ এড়ানো এখনকার আন্তর্জাতিক স্ট্যান্ডার্ড।
                  </p>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-2">
                  <h4 className="font-bold text-sm text-purple-950">২. প্রফেশনাল ক্যারিয়ার সামারি বা অবজেক্টিভ:</h4>
                  <p className="text-xs text-gray-500 leading-relaxed font-bengali">
                    যদি আপনার ৫ বছরের কম কাজের অভিজ্ঞতা থাকে, তবে একটি অত্যন্ত পরিষ্কার ও ৩ লাইনের "Career Objective" লিখুন। সেখানে আপনার মূল কাজের ক্ষেত্র এবং কোম্পানির কীভাবে সেবা বাড়িয়ে দিতে পারেন তা দৃঢ়তার সাথে প্রকাশ করুন।
                  </p>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-2">
                  <h4 className="font-bold text-sm text-purple-950">৩. কাজের অভিজ্ঞতা (Work Experience):</h4>
                  <p className="text-xs text-gray-500 leading-relaxed font-bengali">
                    যে কাজগুলো করেছেন সেগুলোর সংক্ষিপ্ত বিবরণ দেওয়ার চেয়ে "পরিমাণযোগ্য অর্জন বা সাফল্য" (Quantifiable Results) বেশি ফোকাস করুন। যেমন: "কোম্পানির সোশ্যাল পেজ দেখাশোনা করতাম" এর চেয়ে "সোশ্যাল পেজ অপ্টিমাইজেশন দ্বারা কাস্টমার রিচ ৪০% বাড়িয়েছিলাম" অনেক বেশি ট্রাস্টের প্রতীক।
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Rules */}
          {activeTab === 'rules' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-950 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-purple-600" />
                সিভি রাইটিং এর ৫টি সুবর্ণ কর্পোরেট নিয়ম
              </h3>
              <p className="text-sm text-gray-500">
                নিচের নিয়মগুলো কঠোরভাবে মেনে আপনি আপনার চাকরির প্রাথমিক স্ক্রীনিং রাউন্ডের পাসের সম্ভাবনা অনেক বাড়িয়ে নিতে পারেন:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="p-5 bg-purple-50/40 rounded-2xl border border-purple-100/60 space-y-2">
                  <span className="text-xs font-bold text-purple-700 bg-purple-100/60 px-2 py-0.5 rounded-full">নিয়ম ১</span>
                  <h4 className="font-bold text-sm text-purple-950">এটিএস ফ্রেন্ডলি (ATS Friendly) ফন্ট ও লেআউট:</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    বর্তমানে বড় ও মাঝারি সব কোম্পানি তাদের ক্যান্ডিডেটের সিভি স্ক্রিনিং করার জন্য একধরনের অটোমেটেড সফটওয়্যার বা ATS প্ল্যাটফর্ম মেইনটেইন করে। এটি স্কিল বা বার চার্ট ও অপ্রয়োজনীয় ডাবল কলাম গ্রাফিক্স রিড করতে ব্যর্থ হতে পারে। সবসময় পরিষ্কার, সোজা এবং এক কলামের সরল প্রফেশনাল লেআউট মেইনটেইন করুন। ফন্ট হিসেবে Arial, Calibri বা Helvetica সবচেয়ে প্রশংসিত।
                  </p>
                </div>

                <div className="p-5 bg-purple-50/40 rounded-2xl border border-purple-100/60 space-y-2">
                  <span className="text-xs font-bold text-purple-700 bg-purple-100/60 px-2 py-0.5 rounded-full">নিয়ম ২</span>
                  <h4 className="font-bold text-sm text-purple-950">এক পৃষ্ঠার কঠোর নিয়ম (One Page Policy):</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    সদ্য গ্র্যাজুয়েট ও অনভিজ্ঞ অথবা ৫ বছরের কম কাজের অভিজ্ঞতা যাদের রয়েছে, তারা কোনো অবস্থাতেই সিভি ২-৩ পৃষ্ঠা লম্বা করবেন না। যত দীর্ঘ ডক্যুমেন্ট হবে, তথ্য খোঁজা তত বেশি কঠিন হবে। সব তথ্য সংক্ষেপে একটি নিখুঁত পৃষ্ঠায় সাজিয়ে আনুন।
                  </p>
                </div>

                <div className="p-5 bg-purple-50/40 rounded-2xl border border-purple-100/60 space-y-2">
                  <span className="text-xs font-bold text-purple-700 bg-purple-100/60 px-2 py-0.5 rounded-full">নিয়ম ৩</span>
                  <h4 className="font-bold text-sm text-purple-950">সঠিক এবং জোরালো অ্যাকশন ভার্ব (Action Verbs):</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    প্রতিটি কাজের ডেসক্রিপশনের শুরুতে "Responsible for" বা "Tasked with" জাতীয় অতি পরিচিত শব্দগুচ্ছ ব্যবহার করা পরিহার করুন। পরিবর্তে জোরালো অ্যাকশন ভার্ব যেমন: "Led", "Created", "Improved", "Optimized", "Designed", "Managed" শব্দ ব্যবহার করার চেষ্টা করুন।
                  </p>
                </div>

                <div className="p-5 bg-purple-50/40 rounded-2xl border border-purple-100/60 space-y-2">
                  <span className="text-xs font-bold text-purple-700 bg-purple-100/60 px-2 py-0.5 rounded-full">নিয়ম ৪</span>
                  <h4 className="font-bold text-sm text-purple-950">পিডিএফ ফরম্যাট নিশ্চিতকরণ (Save as PDF):</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    নিয়োগকর্তা বা HR-কে ফাইল পাঠানোর পূর্বে ফাইলটি ডকবুক বা Microsoft Word (.docx) ফাইল আকারে মেইল করা অনুচিত। কারণ একেকটি সিস্টেমে এটি খুললে ফরমেটিং নষ্ট হতে পারে। সবসময় .pdf ফরম্যাটে এক্সপোর্ট করে নিরাপদ ফরম্যাট সুনিশ্চিত করুন।
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Audit */}
          {activeTab === 'audit' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-950 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-600" />
                সিভি সেলফ-অডিট ইন্টারেক্টিভ ক্যান্ডিডেট ট্র্যাকার
              </h3>
              <p className="text-sm text-gray-500">
                রিক্রুটারের নিকট আপনার কাঙ্ক্ষিত সিভিটি জমা দেওয়ার আগে নিজের তৈরি করা সিভিটির মান নিচের চাবিকাঠি দিয়ে পরীক্ষা করে নিন:
              </p>

              <div className="space-y-3">
                {auditItems.map(item => (
                  <label
                    key={item.id}
                    onClick={() => toggleAudit(item.id)}
                    className={clsx(
                      "flex items-start gap-3 p-4 rounded-2xl border transition-all cursor-pointer",
                      checkedAudit[item.id]
                        ? "bg-purple-50/80 border-purple-200 text-purple-900"
                        : "bg-white border-gray-100 hover:border-gray-200 text-gray-600"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={!!checkedAudit[item.id]}
                      onChange={() => {}}
                      className="mt-1 w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-xs md:text-sm font-medium leading-relaxed">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Copyable Title Text */}
          {activeTab === 'copyable' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-950 flex items-center gap-2">
                  <Download className="w-5 h-5 text-purple-600" />
                  মাস্টার প্রফেশনাল রেজুমে টেক্সট গাইডলাইন
                </h3>
                <button
                  onClick={() => handleCopy(cvStructureText, 'cv')}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-md"
                >
                  {copiedText === 'cv' ? 'টেমপ্লেট কপিড!' : 'সম্পূর্ণ স্ট্রাকচার কপি করুন'}
                </button>
              </div>
              <p className="text-sm text-gray-500">
                কম্পিউটারে সিভি বানানোর সময় এই সরল, আধুনিক এবং সম্পূর্ণ এটিএস (ATS) রেডি ফর্মাল রেজুমে স্ট্রাকচার অনুসরণ করে তৈরি করতে পারেন:
              </p>

              <pre className="p-6 bg-gray-50 rounded-3xl text-xs font-sans text-gray-700 whitespace-pre-wrap overflow-x-auto border border-gray-100 h-96 overflow-y-auto">
                {cvStructureText}
              </pre>
            </div>
          )}
        </div>
      }
    />
  );
};

const CoverLetterTipsContent = ({ onBack, showToast }: { onBack: () => void; showToast: (msg: string, type: 'success' | 'error' | 'info') => void }) => {
  const [activeTab, setActiveTab] = useState<'strategy' | 'templates' | 'mistakes' | 'pro'>('strategy');
  const [activeTemplate, setActiveTemplate] = useState<'corporate' | 'ngo' | 'email'>('corporate');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    showToast('টেমপ্লেট কপি করা হয়েছে!', 'success');
    setTimeout(() => setCopiedText(null), 2000);
  };

  const corporateTemplate = `তারিখ: [আজকের তারিখ, যেমন: ২৫ মে, ২০২৬]

বরাবর,
ম্যানেজার, হিউম্যান রিসোর্স ডিপার্টমেন্ট,
[প্রতিষ্ঠানের নাম বা কোম্পানির নাম]
[প্রতিষ্ঠানের ঠিকানা]

বিষয়: [পদের নাম] পদের জন্য আবেদন।

প্রিয় মহোদয়/মহোদয়া,
আমি অত্যন্ত আগ্রহের সাথে আপনার প্রতিষ্ঠানের শূন্য ঘোষিত "[পদের নাম]" পদের জন্য আমার সুনির্দিষ্ট আগ্রহ প্রকাশ করছি। সম্প্রতি [যেখানে সার্কুলার দেখেছেন, যেমন: বিডিজবস] প্রকাশিত বিজ্ঞপ্তির মাধ্যমে আমি জানতে পেরেছি যে আপনারা এই শূন্য পদের জন্য একজন আত্মবিশ্বাসী ও প্রফেশনাল কর্মী খুঁজছেন।

আমার পূর্ববর্তী কাজের অভিজ্ঞতায় আমি [আপনার প্রধান প্রফেশনাল দক্ষতা] বিষয়ে চমৎকার সাফল্য পেয়েছি। বিশেষত আমি [পূূর্বের কাজের একটি গুরুত্বপূর্ণ অবদান/অর্জন] সফলভাবে সম্পন্ন করেছি যা আমাকে টিম ম্যানেজমেন্ট ও আপনার কোম্পানির কাঙ্ক্ষিত লক্ষ্য অর্জনে অত্যন্ত সক্ষম করে তুলেছে। ডেসক্রিপশনে বর্ণিত প্রায় সবকয়টি দায়িত্বের সাথে আমার স্কিল দারুণ মিল তৈরি করে।

আমি নিশ্চয়তা দিতে পারছি যে, আমার কাজের প্রতি গভীর দায়িত্ববোধ এবং আন্তরিকতা আপনাদের লক্ষ্য অর্জনে চমৎকার ভূমিকা রাখবে। আমি কাজের জন্য একটি নিখুঁত ও প্রফেশনাল পরিবেশ কামনা করি।

আমার বিস্তারিত এবং সম্পূর্ণ সিভি (Resume) আপনার মূল্যবান বিবেচনার জন্য ফাইল হিসেবে এই কভার লেটারের সাথে যুক্ত করলাম। আপনার সুবিধাজনক যেকোনো সময়ে একটি সংক্ষিপ্ত সাক্ষাৎকারের আয়োজন করলে আমি অত্যন্ত কৃতজ্ঞ থাকব।

আপনার আন্তরিক সময় ও বিবেচনার জন্য কৃতজ্ঞতা প্রকাশ করছি।

বিনীত,
[আপনার নাম]
[মোবাইল নম্বর]
[ইমেইল এড্রেস]
[লিংকডইন প্রোফাইল লিঙ্ক]`;

  const ngoTemplate = `তারিখ: [তারিখ যুক্ত করুন]

বরাবর,
হিউম্যান রিসোর্সেস এবং পলিসি এডমিন,
[এনজিও বা সমাজসেবামূলক সংস্থার নাম]
[সংস্থার কার্যালয়ের ঠিকানা]

বিষয়: [পদের নাম] পদে কর্মসংস্থানের জন্য আবেদন।

মহোদয়,
আপনার সংস্থার সম্মানিত [সংস্থার নাম] এর মাধ্যমে সমাজকল্যাণ ও টেকসই আর্থ-সামাজিক উন্নয়নে অবদানের অংশ হতে পেরে আমি খুশি। সোর্সের মাধ্যমে সাকসেসফুলি প্রকাশিত "[পদের নাম]" পদে নিয়োগ কন্ডিশনের ভিত্তিতে আমি আমার আবেদনটি পেশ করছি।

আমার ক্যারিয়ারে আমি [আপনার দক্ষতা] দক্ষতা দিয়ে প্রান্তিক তৃণমূল বা সামগ্রিক সামাজিক কার্যক্রমে সরাসরি সাহায্য করেছি। বিশেষত, আমি সামাজিক ও দলগত উন্নয়নে [পূর্বে আপনার সামাজিক কাজের অর্জন বা প্রজেক্ট বিবরণী] দারুণ সাফল্য পেয়েছি। আমার কাজের নীতি আপনাদের সমাজসেবামূলক লক্ষ্য ও মূল্যবোধের সাথে সম্পূর্ণ সামঞ্জস্যপূর্ণ।

আপনাদের এই সংস্থায় কাজের মাধ্যমে সুবিধাবঞ্চিত মানুষের পাশে দাঁড়াতে ও সমাজকে একটি কাঙ্ক্ষিত প্রগতিশীল অবস্থানে নিয়ে যেতে আমি দৃঢ় প্রতিজ্ঞাবদ্ধ। আমি সবসময় সততা ও দলবদ্ধতাকে অগ্রাধিকার প্রদান করি।

আপনার মূল্যবান রিভিউর জন্য আমার জীবনবৃত্তান্ত ও সকল প্রশংসাপত্র এই পত্রের সাথে যুক্ত রয়েছে। আমি আশা রাখছি, একটি প্রাতিষ্ঠানিক প্রজেক্ট মিটিং ও মৌখিক আলোচনার সুযোগ পাবো।

আপনার সহযোগিতাপূর্ণ সময় ও সুস্থতার জন্য ধন্যবাদ জানাচ্ছি।

বিনীত,
[আপনার নাম]
[মোবাইল নম্বর]
[ইমেইল এড্রেস]`;

  const emailTemplate = `বিষয়: আবেদনপত্র — [পদের নাম] — [আপনার নাম]

প্রিয় শ্রদ্ধাভাজন রিক্রুটার বা নিয়োগকর্তা মহোদয়,

আমি অত্যন্ত আনন্দের সাথে আপনাদের কোম্পানির "[পদের নাম]" পদের জন্য আবেদন করছি। আমার চাকরির ব্যাকগ্রাউন্ড এবং দক্ষতার বিবরণী নিচে দেয়া হলো যা পদের সাথে চমৎকারভাবে মিলে যায়।

বিগত [কাজের অভিজ্ঞতার বছর] বছরে আমি সরাসরি [আপনার প্রধান সেক্টর বা দক্ষতা] নিয়ে চমৎকারভাবে কাজ করেছি এবং আমার প্রধান অবদানগুলোর মধ্য রয়েছে:
• [সাফল্য বা প্রথম চমৎকার অবদান]
• [দ্বিতীয় অবদান/কাজের দক্ষতা বা স্পেশাল প্রোজেক্ট]

আমি আপনার কোম্পানিতে আমার শ্রম ও কাজের গতি প্রদান করতে সম্পূর্ণ প্রস্তুত রয়েছি। এই আবেদনের সাথে আমার আপডেট করা প্রফেশনাল জীবনবৃত্তান্ত (CV) পিডিএফ ফরম্যাটে সংযুক্ত করা হলো। আপনার সুবিধাজনক যেকোনো সময় বিস্তারিত আলোচনার জন্য আমাকে ফোন অথবা ইমেইলে যোগাযোগ করার অনুরোধ জানাচ্ছি।

আপনার মূল্যবান সময় দিয়ে আমার এই প্রাথমিক আগ্রহটি পড়ার জন্য আন্তরিক ধন্যবাদ।

বিনীত,
[আপনার নাম]
[মোবাইল নম্বর]
[লিংকডইন প্রোফাইল বা পোর্টফোলিও লিঙ্ক]`;

  return (
    <CareerGuidePage
      title="কভার লেটার রাইটিং ও টিপস গাইড (Cover Letter Guidance)"
      onBack={onBack}
      content={
        <div className="space-y-8 font-bengali text-gray-700">
          {/* Top Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-4">
            {[
              { id: 'strategy', label: 'কভার লেটারের মূল রেসিপি', icon: <FileText className="w-4 h-4" /> },
              { id: 'templates', label: 'কপিযোগ্য ডাইরেক্ট টেমপ্লেট', icon: <Download className="w-4 h-4" /> },
              { id: 'mistakes', label: 'যে ১০টি ভুল এড়াবেন', icon: <ShieldCheck className="w-4 h-4" /> },
              { id: 'pro', label: 'উন্নত প্রো টিপস', icon: <Sparkles className="w-4 h-4" /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={clsx(
                  "flex items-center gap-2 px-5 py-3 rounded-2xl text-xs md:text-sm font-bold transition-all border-2",
                  activeTab === tab.id
                    ? "bg-teal-600 border-teal-600 text-white shadow-lg shadow-teal-50"
                    : "bg-white border-gray-100 text-gray-500 hover:border-teal-600 hover:text-teal-600"
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Strategy */}
          {activeTab === 'strategy' && (
            <div className="space-y-6">
              <div className="bg-teal-50 p-6 rounded-3xl border border-teal-100">
                <h3 className="text-base font-bold text-teal-950 mb-1 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-teal-600" />
                  কভার লেটার মূলত কী এবং কেন এটি আবশ্যক?
                </h3>
                <p className="text-xs text-teal-900/80 leading-relaxed">
                  কভার লেটার হলো রিক্রুটারের প্রতি একটি অত্যন্ত চমৎকার ও প্রফেশনাল চিঠি যেখানে আপনি সংক্ষেপে প্রমাণ করেন কেন আপনি সিভি পাঠানোর উপযুক্ত দাবিদার। এটি শুধু সিভির কপি নয়, বরং এটি আপনার ব্যক্তিগত কাজের আগ্রহের মেলবন্ধন ঘটায়।
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-2">
                  <h4 className="font-bold text-sm text-gray-900">১. আকর্ষণীয় সূচনা প্যারাগ্রাফ:</h4>
                  <p className="text-xs text-gray-500 leading-relaxed font-bengali">
                    শুরুতেই সরাসরি বলুন আপনি কোন পদের জন্য আবেদন করছেন এবং কোথায় বিজ্ঞপ্তিটি দেখেছেন। একটি সুন্দর সূচনা লাইন দিয়ে রিক্রুটারের গভীর মনোযোগ আকর্ষণ করুন।
                  </p>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-2">
                  <h4 className="font-bold text-sm text-gray-900">২. অভিজ্ঞতার মেলবন্ধন:</h4>
                  <p className="text-xs text-gray-500 leading-relaxed font-bengali">
                    এখানে আপনার সিভির কাজের সেরা ১-২টি সাফল্য এমনভাবে ফুটিয়ে তুলুন যা বর্তমান চাকরির জব রিক্রুটমেন্ট চ্যালেঞ্জ সরাসরি সমাধান করতে সাহায্য করবে।
                  </p>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-2">
                  <h4 className="font-bold text-sm text-gray-900">৩. কোম্পানির মিশন ও ফিউচার ভ্যালু:</h4>
                  <p className="text-xs text-gray-500 leading-relaxed font-bengali">
                    রিক্রুটারকে বোঝান আপনি কাজটির জন্য কতটা বেশি সজাগ এবং তাদের সাথে কেন যুক্ত হতে চান তা প্রফেশনালি ২ লাইনে ম্যাচ করুন।
                  </p>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-2">
                  <h4 className="font-bold text-sm text-gray-900">৪. কল টু অ্যাকশন ও সমাপ্তি:</h4>
                  <p className="text-xs text-gray-500 leading-relaxed font-bengali">
                    একটি ইতিবাচক সাক্ষাত্কার বা কুশল আলোচনার জন্য আমন্ত্রণ জানিয়ে অত্যন্ত মার্জিত ভঙ্গিতে কভার লেটারটির ইতিবাচক সমাপ্তি টানুন।
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Copy-Paste Templates */}
          {activeTab === 'templates' && (
            <div className="space-y-6">
              <p className="text-sm text-gray-500">
                নিচের সেক্টর অনুযায়ী উপযুক্ত কপিযোগ্য ফরমাল টেমপ্লেটটি সিলেক্ট করে ব্র্যাকেটের অংশগুলো নিজের মতো পরিবর্তন করে মেইল করুন:
              </p>

              {/* Selector inside Templates */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'corporate', label: 'প্রাইভেট বা কর্পোরেট জব' },
                  { id: 'ngo', label: 'এনজিও ও উন্নয়ন সংস্থা' },
                  { id: 'email', label: 'ইমেলের বডি কভার লেটার' },
                ].map(temp => (
                  <button
                    key={temp.id}
                    onClick={() => setActiveTemplate(temp.id as any)}
                    className={clsx(
                      "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                      activeTemplate === temp.id
                        ? "bg-teal-600/10 border-teal-600 text-teal-800"
                        : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                    )}
                  >
                    {temp.label}
                  </button>
                ))}
              </div>

              {/* Render Template Details */}
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-t-2xl border-b border-gray-200">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest font-sans">Template View</span>
                  <button
                    onClick={() => {
                      const text = activeTemplate === 'corporate' 
                        ? corporateTemplate 
                        : activeTemplate === 'ngo' 
                        ? ngoTemplate 
                        : emailTemplate;
                      handleCopy(text, activeTemplate);
                    }}
                    className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                  >
                    {copiedText === activeTemplate ? 'সফলভাবে কপিড!' : 'কপি করুন'}
                  </button>
                </div>

                <pre className="p-6 bg-gray-50 rounded-b-2xl text-xs font-sans text-gray-700 whitespace-pre-wrap overflow-x-auto border border-t-0 border-gray-200 h-96 overflow-y-auto">
                  {activeTemplate === 'corporate' ? corporateTemplate : activeTemplate === 'ngo' ? ngoTemplate : emailTemplate}
                </pre>
              </div>
            </div>
          )}

          {/* Tab 3: Avoid Mistakes */}
          {activeTab === 'mistakes' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-950 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-600" />
                যে ১০টি চরম কভার লেটার ভুল আপনাকে অবশ্যই এড়াতে হবে
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">
                রিক্রুটাররা প্রায়ই নিম্নোক্ত কারণে চমৎকার ক্যান্ডিডেটের কভার লেটারটি রিজেক্ট করে দেন। এগুলো শতভাগ এড়াতে হবে:
              </p>

              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                <ul className="space-y-3 pl-4 list-decimal text-xs md:text-sm text-gray-600 leading-relaxed">
                  <li><strong className="text-gray-900">ভুল ব্যক্তির নাম বা কোম্পানির নাম:</strong> আগের কোনো জবের আবেদনপত্র থেকে কপি-পেস্ট করতে গিয়ে অন্য কোম্পানির নাম কভার লেটারে ভুলেও রেখে দেওয়া যাবে না।</li>
                  <li><strong className="text-gray-900">সিভির তথ্য হুবহু পুনরাবৃত্তি (Repetitive Copy-paste):</strong> স্রেফ অবজেক্টিভ বা কাজের তালিকা কপি পেস্ট না করে আপনার আন্তরিকতা ও সফট স্কিলের প্র্যাকটিকাল কাজ ফুটিয়ে তুলুন।</li>
                  <li><strong className="text-gray-900">অতিরিক্ত লম্বা চিঠি:</strong> কভার লেটারের আদর্শ সাইজ হলো এক পৃষ্ঠার ৩ থেকে ৪ প্যারাগ্রাফ (সর্বোচ্চ ৩০০ থেকে ৪০০ শব্দ)। এর বেশি লম্বা ড্রাফট রিক্রুটাররা এড়ায়।</li>
                  <li><strong className="text-gray-900">অতিরিক্ত মেকি আত্মতুষ্টি:</strong> "আমিই এই পদের একমাত্র সেরা কর্মী" এ জাতীয় অতি-পরিচিত উক্তি এড়িয়ে বিনীত ও স্টাইলিশ পেশাদারিত্ব প্রকাশ করুন।</li>
                  <li><strong className="text-gray-900">অগোছালো ফরমেটিং ও বানান ভুল:</strong> বানানের ভুল এবং ফন্ট সাইজের অসামঞ্জস্যতা আপনার সামগ্রিক অমনোযোগিতাকে সরাসরি প্রকাশ করে।</li>
                </ul>
              </div>
            </div>
          )}

          {/* Tab 4: Pro Tips */}
          {activeTab === 'pro' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-teal-500/10 to-emerald-500/10 p-6 rounded-3xl border border-teal-100">
                <h3 className="text-base font-bold text-teal-950 mb-1 flex items-center gap-2 font-bengali">
                  <Sparkles className="w-5 h-5 text-teal-600" />
                  উন্নত "প্রো-প্যাক" কভার লেটার কৌশল
                </h3>
                <p className="text-xs text-teal-900/80 leading-relaxed">
                  আপনার আবেদনের গ্রহণযোগ্যতা অনেক বেশি ইতিবাচক করার জন্য নিচের ছোট কিন্তু প্রফেশনাল পদ্ধতিসমূহ ব্যবহার করতে পারেন:
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-2">
                  <h4 className="font-bold text-sm text-gray-900">পদ্ধতি ১: "The Hook Formula" দিয়ে কাজ শুরু করা</h4>
                  <p className="text-xs text-gray-500 leading-relaxed font-bengali">
                    কভার লেটারের প্রথম ২ লাইনে শুকনো বা অতি পরিচিত কথাবার্তা না লিখে একটি চমৎকার কাজের সাফল্য বা আগ্রহের বাস্তব অভিজ্ঞতা সরাসরি প্রকাশ করুন। যেমন: "বিগত ৩ বছরের সেলস কো-অর্ডিনেশন প্রজেক্টে আমি সাকসেসফুলি ২০টি প্লাস জোনে কোম্পানির কাস্টমার বেনিফিট বাড়াতে সক্ষম হয়েছি..." এটি নিয়োগকর্তাকে বাকি অর্ধেক কভার লেটার পড়তে বাধ্য করবে।
                  </p>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-2">
                  <h4 className="font-bold text-sm text-gray-900">পদ্ধতি ২: এটিএস কিওয়ার্ড ম্যাচিং (ATS Keywords Tracking)</h4>
                  <p className="text-xs text-gray-500 leading-relaxed font-bengali">
                    জব ডেসক্রিপশনের রিকোয়ারমেন্টস অংশে যে ৪-৫টি গুরুত্বপূর্ণ স্কিলের কিওয়ার্ড (যেমন: Teamwork, MS Office, Analytical, Strategy, Management) রয়েছে, তা আপনার আবেদনের মানের সাথে সুকৌশলে কভার লেটারের মাঝে অন্তত একবার ইনপুট করুন। এতে ATS সফটওয়্যার সহজে আপনার কভার লেটারটি বাছাই করে উত্তীর্ণ করে দেবে।
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      }
    />
  );
};

const PhotoResizer = ({ showToast, onBack, user, siteSettings, setIsLoginModalOpen }: { 
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void; 
  onBack: () => void;
  user: User | null;
  siteSettings: SiteSettings;
  setIsLoginModalOpen: (open: boolean) => void;
}) => {
  const [photo, setPhoto] = useState<File | null>(null);
  const [signature, setSignature] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad'>('bkash');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);

  useEffect(() => {
    if (user) {
      fetchMyRequests();
    }
  }, [user]);

  const fetchMyRequests = async () => {
    if (!user) return;
    setIsLoadingRequests(true);
    try {
      const res = await fetch(`/api/my-service-requests/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setMyRequests(data);
      }
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    } finally {
      setIsLoadingRequests(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSignature(file);
      const reader = new FileReader();
      reader.onloadend = () => setSignaturePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    if (!photo || !signature || !transactionId) {
      showToast('সবগুলো তথ্য দিন (ছবি, স্বাক্ষর এবং ট্রানজেকশন আইডি)', 'error');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('userId', user.id);
    formData.append('type', 'photo_resize');
    formData.append('photo', photo);
    formData.append('signature', signature);
    formData.append('transactionId', transactionId);
    formData.append('paymentMethod', paymentMethod);

    try {
      const res = await fetch('/api/service-requests', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        showToast('আপনার আবেদনটি জমা হয়েছে। এডমিন এটি প্রসেস করে দিলে আপনি এখান থেকেই ডাউনলোড করতে পারবেন।', 'success');
        setPhoto(null);
        setSignature(null);
        setPhotoPreview(null);
        setSignaturePreview(null);
        setTransactionId('');
        fetchMyRequests();
      } else {
        showToast('আবেদন জমা দিতে সমস্যা হয়েছে।', 'error');
      }
    } catch (error) {
      showToast('সার্ভারে সমস্যা হয়েছে।', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CareerGuidePage 
      title="ছবি ও স্বাক্ষর সাইজ (Photo & Signature Service)"
      onBack={onBack}
      content={
        <div className="space-y-12">
          {/* Instructions */}
          <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-[2.5rem] text-emerald-900">
            <h4 className="font-bold text-xl mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6" />
              সেবাটির বৈশিষ্ট্য ও নির্দেশনা:
            </h4>
            <ul className="space-y-3 text-emerald-800">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span>আপনার মোবাইলে তোলা ছবি ও স্বাক্ষর আপলোড করুন।</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span>আমরা ছবিটিকে বুক বরাবর ক্রপ করে ব্যাকগ্রাউন্ড সাদা করে দিব।</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span>স্বাক্ষরটিকে পরিষ্কার করে সলিড সাদা ব্যাকগ্রাউন্ডে নিয়ে আসা হবে।</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span>চাকরির আবেদনের জন্য নির্ধারিত সাইজ (৩০০x৩০০ ও ৩০০x৮০) নিশ্চিত করা হবে।</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span className="font-bold">চার্জ: মাত্র ১০ টাকা।</span>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Photo Upload */}
            <div className="space-y-4">
              <label className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Camera className="w-5 h-5 text-emerald-600" />
                আপনার ছবি আপলোড করুন
              </label>
              <div className="relative group aspect-square border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer overflow-hidden flex items-center justify-center">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                  onChange={handlePhotoChange}
                />
                {photoPreview ? (
                  <img src={photoPreview} alt="Photo Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-6">
                    <Plus className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">ছবি সিলেক্ট করুন</p>
                  </div>
                )}
              </div>
            </div>

            {/* Signature Upload */}
            <div className="space-y-4">
              <label className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                আপনার স্বাক্ষর আপলোড করুন
              </label>
              <div className="relative group aspect-[300/80] border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer overflow-hidden flex items-center justify-center">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                  onChange={handleSignatureChange}
                />
                {signaturePreview ? (
                  <img src={signaturePreview} alt="Signature Preview" className="w-full h-full object-contain" />
                ) : (
                  <div className="text-center p-4">
                    <Plus className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                    <p className="text-sm text-gray-500">স্বাক্ষর সিলেক্ট করুন</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="bg-white border border-gray-100 p-8 rounded-[2.5rem] shadow-xl shadow-gray-100/50 space-y-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-emerald-600" />
              পেমেন্ট করুন (১০ টাকা)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                <p className="text-sm text-emerald-800 mb-2">বিকাশ (পার্সোনাল)</p>
                <p className="text-2xl font-bold text-emerald-600">{siteSettings.bkashNumber || '01700000000'}</p>
              </div>
              <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100">
                <p className="text-sm text-orange-800 mb-2">নগদ (পার্সোনাল)</p>
                <p className="text-2xl font-bold text-orange-600">{siteSettings.nagadNumber || '01700000000'}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <button 
                  onClick={() => setPaymentMethod('bkash')}
                  className={`flex-1 py-3 rounded-xl font-bold transition-all ${paymentMethod === 'bkash' ? 'bg-pink-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                >
                  বিকাশ
                </button>
                <button 
                  onClick={() => setPaymentMethod('nagad')}
                  className={`flex-1 py-3 rounded-xl font-bold transition-all ${paymentMethod === 'nagad' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                >
                  নগদ
                </button>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Transaction ID (TrxID)</label>
                <input 
                  type="text" 
                  placeholder="পেমেন্ট করার পর TrxID এখানে দিন"
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                />
              </div>
            </div>

            <button 
              onClick={handleSubmit}
              disabled={isSubmitting || !photo || !signature || !transactionId}
              className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
              আবেদন জমা দিন
            </button>
          </div>

          {/* My Requests */}
          {user && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <HistoryIcon className="w-7 h-7 text-emerald-600" />
                আপনার আবেদনসমূহ
              </h3>
              
              {isLoadingRequests ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
                </div>
              ) : myRequests.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {myRequests.map((req) => (
                    <div key={req.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xs font-bold text-gray-400">ID: {req.id}</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            req.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' :
                            req.status === 'Processing' ? 'bg-blue-100 text-blue-600' :
                            req.status === 'Rejected' ? 'bg-red-100 text-red-600' :
                            'bg-orange-100 text-orange-600'
                          }`}>
                            {req.status === 'Pending' ? 'অপেক্ষমান' : 
                             req.status === 'Processing' ? 'প্রসেসিং হচ্ছে' :
                             req.status === 'Completed' ? 'সম্পন্ন' : 'বাতিল'}
                          </span>
                        </div>
                        <p className="text-gray-500 text-xs">{new Date(req.createdAt).toLocaleString('bn-BD')}</p>
                      </div>

                      <div className="flex gap-2">
                        {req.status === 'Completed' ? (
                          <>
                            <a 
                              href={req.processedPhotoUrl} 
                              download 
                              className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all flex items-center gap-2"
                            >
                              <Download className="w-4 h-4" />
                              ছবি ডাউনলোড
                            </a>
                            <a 
                              href={req.processedSignatureUrl} 
                              download 
                              className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all flex items-center gap-2"
                            >
                              <Download className="w-4 h-4" />
                              স্বাক্ষর ডাউনলোড
                            </a>
                          </>
                        ) : (
                          <p className="text-sm text-gray-400 italic">প্রসেস সম্পন্ন হলে ডাউনলোড বাটন আসবে</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-200">
                  <p className="text-gray-400">আপনার কোনো আবেদন পাওয়া যায়নি।</p>
                </div>
              )}
            </div>
          )}
        </div>
      }
    />
  );
};

// Scroll To Top Component
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 z-[90] bg-emerald-600 text-white p-4 rounded-2xl shadow-2xl hover:bg-emerald-700 transition-all active:scale-90 group"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

// Notice Ticker Component
const NoticeTicker = ({ notice }: { notice: string }) => {
  if (!notice) return null;
  
  const notices = notice.split(',').map(n => n.trim()).filter(Boolean);
  if (notices.length === 0) return null;

  return (
    <div className="bg-emerald-600 border-b border-emerald-500/30 overflow-hidden py-2 relative flex items-center h-12">
      <div className="bg-emerald-700 px-4 h-full flex items-center justify-center absolute left-0 z-20 shadow-[10px_0_15px_rgba(0,0,0,0.1)]">
        <span className="text-white text-[10px] sm:text-xs font-black uppercase tracking-widest whitespace-nowrap flex items-center gap-2">
          <Bell className="w-3 h-3 sm:w-4 sm:h-4 animate-bounce" />
          জরুরি নোটিশ
        </span>
      </div>
      <div className="flex-1 overflow-hidden relative ml-32 sm:ml-40">
        <div className="animate-marquee whitespace-nowrap flex gap-12 items-center py-1">
          {[...notices, ...notices, ...notices].map((text, idx) => (
            <span key={idx} className="text-emerald-50 text-xs sm:text-sm font-bold flex items-center gap-4">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full shrink-0" />
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
  };

  const [view, setView] = useState<'user' | 'admin' | 'dashboard' | 'about' | 'contact' | 'more-services' | 'interview-tips' | 'resume-guide' | 'cover-letter-tips' | 'subject-lessons' | 'mock-test' | 'skill-assessment' | 'ai-interview' | 'translation-service' | 'bangla-converter' | 'photo-resizer' | 'privacy' | 'terms'>('user');

  const handleProtectedView = (newView: typeof view) => {
    if (!user) {
      setAuthMode('login');
      setIsLoginModalOpen(true);
      setIsMobileMenuOpen(false);
      showToast('এই ফিচারটি ব্যবহার করতে দয়া করে লগইন করুন', 'info');
      return;
    }
    setView(newView);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<JobCategory>('সব');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const relatedJobs = useMemo(() => {
    if (!selectedJob) return [];
    return jobs
      .filter(job => 
        job.id !== selectedJob.id && 
        (job.category === selectedJob.category || 
         job.title.toLowerCase().includes(selectedJob.title.toLowerCase().split(' ')[0]))
      )
      .slice(0, 3);
  }, [selectedJob, jobs]);

  const [aiSearchQuery, setAiSearchQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [user, setUser] = useState<User | null>(null);
  const [cv, setCv] = useState<CV | null>(null);
  const jobDetailsRef = useRef<HTMLDivElement>(null);
  const renderJobCard = (job: Job) => (
    <motion.div
      layout
      key={job.id}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group"
      onClick={() => setSelectedJob(job)}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={cn(
          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
          job.category === 'সরকারি' ? "bg-red-50 text-red-600" :
          job.category === 'ব্যাংক' ? "bg-blue-50 text-blue-600" :
          job.category === 'এনজিও' ? "bg-purple-50 text-purple-600" :
          "bg-emerald-50 text-emerald-600"
        )}>
          {job.category}
        </div>
        <div className="flex items-center gap-3">
          {getRemainingDaysBn(job.deadline) && (
            <div className={cn(
              "flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md",
              getRemainingDaysBn(job.deadline) === 'সময় শেষ' ? "bg-red-50 text-red-600" :
              getRemainingDaysBn(job.deadline) === 'আজ শেষ দিন' ? "bg-orange-50 text-orange-600" :
              "bg-emerald-50 text-emerald-600"
            )}>
              <Clock className="w-3 h-3" />
              <span>{getRemainingDaysBn(job.deadline)}</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Calendar className="w-3 h-3" />
            <span>{formatDateBn(job.deadline)}</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSaveJob(job);
            }}
            className={cn(
              "p-1.5 rounded-lg transition-all",
              savedJobs.some(j => j.id === job.id)
                ? "bg-emerald-50 text-emerald-600"
                : "text-gray-300 hover:text-emerald-600 hover:bg-emerald-50"
            )}
            title={savedJobs.some(j => j.id === job.id) ? "রিমুভ করুন" : "সেভ করুন"}
          >
            <Bookmark className={cn("w-4 h-4", savedJobs.some(j => j.id === job.id) && "fill-emerald-600")} />
          </button>
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
          <p className="text-gray-600 text-sm flex items-center gap-1 mt-0.5">
            {job.company}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-500 mb-6">
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {job.location}
        </div>
        {job.positions && job.positions.length > 0 && (
          <div className="flex items-center gap-1 bg-gray-50 text-gray-500 px-2 py-0.5 rounded-md border border-gray-100">
            <LayoutDashboard className="w-3 h-3" />
            <span>{job.positions.length}টি পদ</span>
          </div>
        )}
        {job.salary && (
          <div className="flex items-center gap-1">
            <Landmark className="w-3 h-3" />
            {job.salary}
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            handleApply(job);
          }}
          disabled={getRemainingDaysBn(job.deadline) === 'সময় শেষ'}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all",
            getRemainingDaysBn(job.deadline) === 'সময় শেষ'
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-emerald-600 text-white hover:bg-emerald-700"
          )}
        >
          {getRemainingDaysBn(job.deadline) === 'সময় শেষ' ? 'সময় শেষ' : 'আবেদন করুন'}
        </button>
        {job.circularImageUrl && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              const url = job.circularImageUrl;
              if (url) window.open(url, '_blank');
            }}
            className="px-4 flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-50 text-blue-600 font-bold text-sm hover:bg-blue-100 transition-all"
            title="নিয়োগ বিজ্ঞপ্তি দেখুন"
          >
            <FileText className="w-5 h-5" />
          </button>
        )}
      </div>
      <button className="w-full mt-3 flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-50 text-gray-700 font-bold text-sm group-hover:bg-gray-100 transition-all">
        বিস্তারিত দেখুন
        <ChevronRight className="w-4 h-4" />
      </button>
    </motion.div>
  );

  const renderSection = (category: JobCategory) => {
    const categoryJobs = jobs.filter(j => j.category === category).slice(0, 4);
    if (categoryJobs.length === 0) return null;

    return (
      <section key={category} className="space-y-6 pt-4 first:pt-0">
        <div className="flex justify-between items-center border-l-4 border-emerald-600 pl-4 py-1">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{category} চাকরির বিজ্ঞপ্তি</h3>
            <p className="text-sm text-gray-500">সেরা সব {category} নিয়োগ বিজ্ঞপ্তি এখানে পাবেন।</p>
          </div>
          <button 
            onClick={() => {
              setSelectedCategory(category);
              window.scrollTo({ top: 600, behavior: 'smooth' });
            }}
            className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-all bg-emerald-50 px-3 py-1.5 rounded-lg"
          >
            সব দেখুন
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categoryJobs.map(renderJobCard)}
        </div>
      </section>
    );
  };

  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    siteName: 'চাকরি সেবা',
    primaryColor: '#059669',
    contactEmail: '',
    contactPhone: '',
    bkashNumber: '',
    nagadNumber: '',
    applicationFee: '0',
    noticeText: '',
    heroTitle: 'আপনার স্বপ্নের চাকরি খুঁজুন',
    heroSubtitle: 'বাংলাদেশের সবচেয়ে বিশ্বস্ত চাকরি সেবা প্ল্যাটফর্ম',
    footerText: `© ${new Date().getFullYear()} চাকরি সেবা। সর্বস্বত্ব সংরক্ষিত।`,
    facebookLink: '',
    youtubeLink: '',
    logoUrl: '',
    aboutText: 'আমরা বাংলাদেশের অন্যতম প্রধান চাকরি সেবা প্ল্যাটফর্ম। আমাদের লক্ষ্য হলো চাকরিপ্রার্থী এবং নিয়োগকর্তাদের মধ্যে একটি সেতুবন্ধন তৈরি করা।',
    contactAddress: 'ঢাকা, বাংলাদেশ',
    paymentInstructions: 'নিচের যেকোনো নাম্বারে সেন্ড মানি করে Transaction ID (TrxID) দিন।',
    seoTitle: 'চাকরি সেবা - বাংলাদেশের ১ নম্বর চাকরির পোর্টাল | Chakri Seba',
    seoDescription: 'সরকারি ও বেসরকারি চাকরির সবশেষ সার্কুলার ও ঘরে বসে সহজে আবেদনের বিশ্বস্ত মাধ্যম।',
    serviceCharge: '50',
    whatsappNumber: '01700000000'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (siteSettings.primaryColor) {
      document.documentElement.style.setProperty('--primary-color', siteSettings.primaryColor);
    }
    if (siteSettings.seoTitle) {
      document.title = siteSettings.seoTitle;
    }
    if (siteSettings.seoDescription) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', siteSettings.seoDescription);
    }
  }, [siteSettings.primaryColor, siteSettings.seoTitle, siteSettings.seoDescription]);

  useEffect(() => {
    if (selectedJob) {
      document.title = selectedJob.seoTitle || `${selectedJob.title} - ${selectedJob.company} | ${siteSettings.siteName}`;
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', selectedJob.seoDescription || `${selectedJob.title} - ${selectedJob.company} এ নিয়োগ বিজ্ঞপ্তি। ${selectedJob.location} এ অবস্থিত। বিস্তারিত দেখুন।`);
    } else {
      document.title = siteSettings.seoTitle || siteSettings.siteName;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', siteSettings.seoDescription);
      }
    }
  }, [selectedJob, siteSettings]);

  useEffect(() => {
    if (selectedJob && jobDetailsRef.current) {
      jobDetailsRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedJob]);

  useEffect(() => {
    if (selectedJob) {
      fetchComments(selectedJob.id);
    }
  }, [selectedJob]);

  const fetchComments = async (jobId: string) => {
    try {
      const res = await fetch(`/api/jobs/${jobId}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  };

  const handlePostComment = async () => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    if (!newComment.trim() || !selectedJob) return;
    setIsPostingComment(true);
    try {
      const res = await fetch(`/api/jobs/${selectedJob.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          userName: user.fullName,
          text: newComment
        })
      });
      if (res.ok) {
        const data = await res.json();
        setComments([data, ...comments]);
        setNewComment('');
      }
    } catch (error) {
      console.error("Failed to post comment:", error);
    } finally {
      setIsPostingComment(false);
    }
  };

  const handlePostReply = async (commentId: string) => {
    if (!user || !replyText[commentId]?.trim()) return;
    try {
      const res = await fetch(`/api/comments/${commentId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          userName: user.fullName,
          text: replyText[commentId],
          isAdmin: user.role === 'admin'
        })
      });
      if (res.ok) {
        const data = await res.json();
        setComments(comments.map(c => 
          c.id === commentId ? { ...c, replies: [...c.replies, data] } : c
        ));
        setReplyText({ ...replyText, [commentId]: '' });
      }
    } catch (error) {
      console.error("Failed to post reply:", error);
    }
  };

  const handleShare = async () => {
    if (!selectedJob) return;
    const shareData = {
      title: selectedJob.seoTitle || selectedJob.title,
      text: selectedJob.seoDescription || `${selectedJob.title} - ${selectedJob.company} এ নিয়োগ বিজ্ঞপ্তি। বিস্তারিত দেখুন:`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        throw new Error('Web Share API not supported');
      }
    } catch (err) {
      // If it's an AbortError (user canceled), we just ignore it
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      
      // For any other error or if Web Share is not supported, fallback to clipboard
      try {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        showToast('লিঙ্কটি ক্লিপবোর্ডে কপি করা হয়েছে!', 'success');
      } catch (clipErr) {
        console.error('Clipboard fallback failed:', clipErr);
      }
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setSiteSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleUpdateSettings = async (newSettings: SiteSettings) => {
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
      if (response.ok) {
        setSiteSettings(newSettings);
        return true;
      }
    } catch (error) {
      console.error('Error updating settings:', error);
    }
    return false;
  };
  const [adminView, setAdminView] = useState<'dashboard' | 'jobs' | 'users' | 'orders' | 'settings' | 'messages' | 'service-requests' | 'preps'>('dashboard');
  const [users, setUsers] = useState<any[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loginCredentials, setLoginCredentials] = useState({ 
    username: '', 
    password: '',
    fullName: '',
    email: '',
    mobile: '',
    securityQuestion: 'আপনার প্রিয় রং কি?',
    securityAnswer: ''
  });
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'user' | 'job', id: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAiFilling, setIsAiFilling] = useState(false);
  const [aiChatHistory, setAiChatHistory] = useState<ChatMessage[]>([]);
  const [showProfilePrompt, setShowProfilePrompt] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  
  // Welcome message for AI Chat
  useEffect(() => {
    if (isAiChatOpen && aiChatHistory.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        role: 'ai',
        text: 'আসসালামু আলাইকুম! আমি আপনার ক্যারিয়ার গাইড এআই। আপনার ক্যারিয়ার নিয়ে যেকোনো প্রশ্ন করতে পারেন। যেমন: "কিভাবে বিসিএস প্রস্তুতি নেব?" অথবা "সফটওয়্যার ইঞ্জিনিয়ার হওয়ার রোডম্যাপ কি?"',
        timestamp: new Date()
      };
      setAiChatHistory([welcomeMessage]);
    }
  }, [isAiChatOpen]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      // Check if user is near the bottom (within 50px)
      const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 50;
      
      // If we're loading (streaming) or if it's a new message and we're at the bottom
      if (isAtBottom || (aiChatHistory.length > 0 && aiChatHistory[aiChatHistory.length - 1].role === 'user')) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: isAiLoading ? 'auto' : 'smooth'
        });
      }
    }
  }, [aiChatHistory, isAiLoading]);

  const handleScroll = () => {
    const container = chatContainerRef.current;
    if (container) {
      const atBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 50;
      setIsAtBottom(atBottom);
    }
  };
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'companyLogoUrl' | 'circularImageUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Limit file size to 10MB
    if (file.size > 10 * 1024 * 1024) {
      showToast('ফাইল সাইজ ১০ মেগাবাইটের বেশি হতে পারবে না।', 'error');
      e.target.value = '';
      return;
    }

    setIsUploading(true);
    try {
      const base64 = await fileToBase64(file);
      setEditingJob({ ...editingJob, [field]: base64 });
    } catch (error) {
      console.error('File upload error:', error);
      showToast('ফাইল আপলোড করতে সমস্যা হয়েছে।', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAiGenerateKeywords = async () => {
    if (!editingJob.title || !editingJob.company) {
      showToast('প্রথমে পদবী এবং প্রতিষ্ঠানের নাম লিখুন।', 'error');
      return;
    }
    setIsAiFilling(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a comma-separated list of English and Bengali search keywords for a job posting with the following details:
        Title: ${editingJob.title}
        Company: ${editingJob.company}
        Category: ${editingJob.category}
        
        Include common English translations and transliterations. For example, if the title is "ব্যাংক অফিসার", include "Bank Officer", "Bank", "Officer". If the company is "সোনালী ব্যাংক", include "Sonali Bank", "Sonali".`,
      });
      const keywords = response.text?.trim() || '';
      setEditingJob({ ...editingJob, searchKeywords: keywords });
    } catch (error) {
      console.error('AI Keyword Generation error:', error);
      showToast('কি-ওয়ার্ড জেনারেট করতে সমস্যা হয়েছে।', 'error');
    } finally {
      setIsAiFilling(false);
    }
  };

  const handleAiGenerateSeo = async () => {
    if (!editingJob.title || !editingJob.company) {
      showToast('প্রথমে পদবী এবং প্রতিষ্ঠানের নাম লিখুন।', 'error');
      return;
    }
    setIsAiFilling(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate SEO meta tags (title and description) for a job posting with the following details:
        Title: ${editingJob.title}
        Company: ${editingJob.company}
        Location: ${editingJob.location || 'Bangladesh'}
        Category: ${editingJob.category}
        
        Return ONLY a JSON object with the following fields:
        seoTitle (string, max 60 characters), 
        seoDescription (string, max 160 characters).
        
        Language: Bengali for the content.`,
      });
      
      const jsonStr = response.text?.trim().replace(/```json|```/g, '') || '{}';
      let seoData = { seoTitle: '', seoDescription: '' };
      try {
        seoData = JSON.parse(jsonStr);
      } catch (e) {
        console.error('Failed to parse AI SEO response:', e);
      }
      
      setEditingJob({ 
        ...editingJob, 
        seoTitle: seoData.seoTitle || '', 
        seoDescription: seoData.seoDescription || '' 
      });
    } catch (error) {
      console.error('AI SEO Generation error:', error);
      showToast('এসইও ট্যাগ জেনারেট করতে সমস্যা হয়েছে।', 'error');
    } finally {
      setIsAiFilling(false);
    }
  };

  const handleAiAutoFill = async () => {
    if (!editingJob.circularImageUrl) {
      showToast('দয়া করে আগে নিয়োগ বিজ্ঞপ্তি আপলোড করুন।', 'error');
      return;
    }

    setIsAiFilling(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const base64Parts = editingJob.circularImageUrl.split(',');
      const base64Data = base64Parts[1];
      const mimeType = base64Parts[0].split(';')[0].split(':')[1];

      const prompt = `
        Extract job details from this image. Return ONLY a JSON object with the following fields:
        title (string, the job title), 
        institution (string, the name of the organization/company), 
        category (one of: 'সরকারি', 'বেসরকারি', 'ব্যাংক', 'এনজিও'), 
        location (string), 
        deadline (string in YYYY-MM-DD format), 
        description (string, a brief summary), 
        requirements (array of strings), 
        salary (string),
        positions (array of objects with fields: name, vacancy, grade, applicationFee)

        Language: Bengali for text fields.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: mimeType,
                  data: base64Data
                }
              }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json"
        }
      });

      const data = JSON.parse(response.text);

      setEditingJob(prev => ({
        ...prev,
        title: data.title || prev.title,
        company: data.institution || prev.company,
        category: data.category || prev.category,
        location: data.location || prev.location,
        deadline: data.deadline || prev.deadline,
        description: data.description || prev.description,
        requirements: Array.isArray(data.requirements) ? data.requirements : prev.requirements,
        salary: data.salary || prev.salary,
        positions: Array.isArray(data.positions) ? data.positions : prev.positions
      }));

    } catch (error) {
      console.error('AI Auto-fill error:', error);
      showToast('AI এর মাধ্যমে তথ্য সংগ্রহ করা সম্ভব হয়নি। দয়া করে ম্যানুয়ালি পূরণ করুন।', 'error');
    } finally {
      setIsAiFilling(false);
    }
  };

  const openCircular = (dataUrl: string) => {
    if (!dataUrl) return;

    // If it's a direct URL (not base64), just open it
    if (!dataUrl.startsWith('data:')) {
      window.open(dataUrl, '_blank');
      return;
    }

    try {
      const parts = dataUrl.split(',');
      const mime = parts[0].match(/:(.*?);/)?.[1];
      const bstr = atob(parts[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const blob = new Blob([u8arr], { type: mime });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      
      // Clean up the URL after some time
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (e) {
      console.error('Error opening circular:', e);
      // Fallback: open in a new window and write to document
      const newWindow = window.open();
      if (newWindow) {
        if (dataUrl.startsWith('data:application/pdf')) {
          newWindow.document.write(`
            <html>
              <head><title>Job Circular PDF</title></head>
              <body style="margin:0;">
                <embed src="${dataUrl}" type="application/pdf" width="100%" height="100%">
              </body>
            </html>
          `);
        } else {
          newWindow.document.write(`
            <html>
              <head><title>Job Circular Image</title></head>
              <body style="margin:0; background:#f0f0f0; display:flex; justify-content:center; align-items:center;">
                <img src="${dataUrl}" style="max-width:100%; max-height:100%; object-fit:contain;">
              </body>
            </html>
          `);
        }
      }
    }
  };

  const [adminStats, setAdminStats] = useState({
    totalVisitors: 0,
    activeVisitors: 0,
    registeredUsers: 0,
    loggedInUsers: 0
  });
  const [forgotMobile, setForgotMobile] = useState('');
  const [forgotQuestion, setForgotQuestion] = useState('');
  const [forgotAnswer, setForgotAnswer] = useState('');
  const [forgotResult, setForgotResult] = useState<{username: string, password: string} | null>(null);
  const [forgotMessage, setForgotMessage] = useState('');
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [showDeadlineToast, setShowDeadlineToast] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [isJobsDropdownOpen, setIsJobsDropdownOpen] = useState(false);
  const [isCareerDropdownOpen, setIsCareerDropdownOpen] = useState(false);
  const [isPrepDropdownOpen, setIsPrepDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCvModal, setShowCvModal] = useState(false);
  const [pendingJob, setPendingJob] = useState<Job | null>(null);
  const [initialDashboardTab, setInitialDashboardTab] = useState<'profile' | 'cv' | 'orders' | 'saved'>('profile');
  const [loginModalMessage, setLoginModalMessage] = useState<string | null>(null);

  const fetchCv = async (userId: string) => {
    try {
      const res = await fetch(`/api/cv/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setCv(data);
      }
    } catch (error) {
      console.error('Failed to fetch CV:', error);
    }
  };

  const toggleSaveJob = (job: Job) => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    setSavedJobs(prev => {
      const isSaved = prev.some(j => j.id === job.id);
      if (isSaved) {
        return prev.filter(j => j.id !== job.id);
      } else {
        return [...prev, job];
      }
    });
  };

  const handleApply = (job: Job) => {
    if (getRemainingDaysBn(job.deadline) === 'সময় শেষ') {
      showToast('দুঃখিত, আবেদনের সময় শেষ হয়ে গেছে।', 'error');
      return;
    }
    if (!user) {
      setLoginModalMessage("আবেদন করার জন্য লগইন বা রেজিস্ট্রেশন করুন");
      setPendingJob(job);
      setAuthMode('login');
      setIsLoginModalOpen(true);
      return;
    }
    if (!cv || cv.error) {
      setInitialDashboardTab('cv');
      setShowCvModal(true);
      return;
    }
    setSelectedJob(job);
    setIsOrderModalOpen(true);
  };

  const SECURITY_QUESTIONS = [
    'আপনার প্রিয় রং কি?',
    'আপনার প্রথম স্কুলের নাম কি?',
    'আপনার প্রিয় খাবার কি?',
    'আপনার প্রিয় বন্ধুর নাম কি?',
    'আপনার জন্মস্থান কোথায়?'
  ];

  const generateUsername = (name: string) => {
    if (!name.trim()) return '';
    const parts = name.trim().split(/\s+/);
    let base = '';
    
    if (parts.length === 1) {
      base = parts[0];
    } else if (parts.length === 2) {
      base = parts[1]; // Use second part if only two
    } else {
      // Use middle part for 3+ words
      const middleIndex = Math.floor(parts.length / 2);
      base = parts[middleIndex];
    }
    
    // Clean base (remove special chars)
    const cleanBase = base.replace(/[^\w\u0980-\u09FF]/g, '');
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${cleanBase}${randomNum}`;
  };

  const handleFullNameChange = (val: string) => {
    const newUsername = authMode === 'register' ? generateUsername(val) : loginCredentials.username;
    setLoginCredentials({
      ...loginCredentials,
      fullName: val,
      username: newUsername
    });
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setForgotMessage('');
    setForgotQuestion('');
    setForgotResult(null);
    
    if (!forgotMobile || forgotMobile.length !== 11) {
      setLoginError('সঠিক মোবাইল নাম্বারটি দিন (১১ ডিজিট)');
      return;
    }

    setIsAuthLoading(true);
    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: forgotMobile })
      });
      const data = await res.json();
      
      if (res.ok) {
        setForgotQuestion(data.question);
      } else {
        setLoginError(data.error);
      }
    } catch (error) {
      setLoginError('সার্ভারের সাথে যোগাযোগ করা যাচ্ছে না!');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleVerifyAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    try {
      const res = await fetch('/api/verify-security-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: forgotMobile, answer: forgotAnswer })
      });
      const data = await res.json();
      
      if (res.ok) {
        setForgotResult({ username: data.username, password: data.password });
        setForgotMessage(data.message);
      } else {
        setLoginError(data.error);
      }
    } catch (error) {
      setLoginError('সার্ভারের সাথে যোগাযোগ করা যাচ্ছে না!');
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (authMode === 'register') {
      if (!loginCredentials.fullName || !loginCredentials.mobile) {
        setLoginError('নাম এবং মোবাইল নাম্বার অবশ্যই দিতে হবে');
        return;
      }
      if (!/^01\d{9}$/.test(loginCredentials.mobile)) {
        setLoginError('আপনার ১১ ডিজিটের মোবাইল নাম্বারটির শুরুতে 01 লিখুন');
        return;
      }
    }

    const endpoint = authMode === 'login' ? '/api/login' : '/api/register';
    
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginCredentials)
      });
      const data = await res.json();
      
      if (res.ok) {
        setUser(data);
        // Fetch CV
        try {
          const cvRes = await fetch(`/api/cv/${data.id}`);
          let cvData = null;
          if (cvRes.ok) {
            cvData = await cvRes.json();
            setCv(cvData);
          } else {
            setCv(null);
          }
          
          // Check CV status after login/registration
          if (data.role !== 'admin') {
            const isProfileIncomplete = !data.fullName || !data.mobile || !data.email;
            const isCvIncomplete = !cvData || cvData.error || !cvData.personalInfo?.photoUrl || !cvData.personalInfo?.signatureUrl;
            
            if (isProfileIncomplete || isCvIncomplete) {
              setShowProfilePrompt(true);
            } else if (pendingJob) {
              setSelectedJob(pendingJob);
              setPendingJob(null);
              setIsOrderModalOpen(true);
            }
          }
          
          if (data.role === 'admin') {
            setView('admin');
          }
        } catch (err) {
          console.error('Error fetching CV:', err);
          if (data.role !== 'admin') {
            setShowProfilePrompt(true);
          }
        }
        setIsLoginModalOpen(false);
        setLoginModalMessage(null);
        setLoginCredentials({ 
          username: '', 
          password: '',
          fullName: '',
          email: '',
          mobile: '',
          securityQuestion: 'আপনার প্রিয় রং কি?',
          securityAnswer: ''
        });
      } else {
        setLoginError(data.error || 'কিছু ভুল হয়েছে!');
      }
    } catch (error) {
      setLoginError('সার্ভারের সাথে যোগাযোগ করা যাচ্ছে না!');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCv(null);
    setLoginModalMessage(null);
    setView('user');
  };

  // Admin states
  const [isEditing, setIsEditing] = useState(false);
  const [editingJob, setEditingJob] = useState<Partial<Job>>({
    title: '',
    company: '',
    category: 'বেসরকারি',
    location: '',
    deadline: '',
    description: '',
    requirements: [],
    salary: '',
    companyLogoUrl: '',
    circularImageUrl: '',
    positions: [],
    applicationFee: '',
    minEducationLevel: 0
  });

  const [stats, setStats] = useState<{ total: number; byCategory: any[] } | null>(null);

  const fetchUsers = async () => {
    try {
      console.log('Fetching users...');
      const res = await fetch('/api/users');
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch');
      }
      const data = await res.json();
      console.log('Users fetched:', data);
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setUsers([]);
    }
  };

  const fetchAllOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      setAllOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setAllOrders([]);
    }
  };

  const fetchServiceRequests = async () => {
    try {
      const res = await fetch('/api/service-requests');
      if (!res.ok) throw new Error('Failed to fetch service requests');
      const data = await res.json();
      setServiceRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch service requests:', error);
      setServiceRequests([]);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/contact');
      if (res.ok) {
        const data = await res.json();
        setMessages(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const fetchAdminData = async () => {
    fetchUsers();
    fetchAllOrders();
    fetchServiceRequests();
    fetchMessages();
    fetchAdminStats();
  };

  useEffect(() => {
    if (user?.role === 'admin' && adminView === 'users') {
      fetchUsers();
    }
    if (user?.role === 'admin' && adminView === 'orders') {
      fetchAllOrders();
    }
    if (user?.role === 'admin' && adminView === 'service-requests') {
      fetchServiceRequests();
    }
  }, [adminView, user]);

  const handleUpdateOrderStatus = async (orderId: string, status: string, note?: string, demoCopyUrl?: string, finalCopyUrl?: string, adminNote?: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, note, demoCopyUrl, finalCopyUrl, adminNote })
      });
      if (res.ok) {
        fetchAllOrders();
        showToast('অর্ডারের স্ট্যাটাস সফলভাবে আপডেট করা হয়েছে।', 'success');
      } else {
        showToast('স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে।', 'error');
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
      showToast('সার্ভার ত্রুটি!', 'error');
    }
  };

  const handleUpdateServiceRequestStatus = async (requestId: string, status: string, processedPhoto?: File, processedSignature?: File) => {
    try {
      const formData = new FormData();
      formData.append('status', status);
      if (processedPhoto) formData.append('processedPhoto', processedPhoto);
      if (processedSignature) formData.append('processedSignature', processedSignature);

      const res = await fetch(`/api/service-requests/${requestId}`, {
        method: 'PUT',
        body: formData
      });
      if (res.ok) {
        fetchServiceRequests();
        showToast('সার্ভিস রিকোয়েস্ট স্ট্যাটাস আপডেট হয়েছে।', 'success');
      } else {
        showToast('আপডেট করতে সমস্যা হয়েছে।', 'error');
      }
    } catch (error) {
      console.error('Failed to update service request:', error);
      showToast('সার্ভার ত্রুটি!', 'error');
    }
  };

  const fetchAdminStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      setAdminStats(data);
    } catch (error) {
      console.error('Failed to fetch admin stats:', error);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAdminData();
      const interval = setInterval(() => {
        fetchAdminData();
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}`);
    
    ws.onopen = () => {
      if (user) {
        ws.send(JSON.stringify({ type: 'AUTH', userId: (user as any).id }));
      }
    };

    return () => ws.close();
  }, [user]);

  const handleDeleteUser = async (id: string) => {
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setDeleteConfirm(null);
        showToast('ইউজার সফলভাবে ডিলিট করা হয়েছে', 'success');
        fetchUsers();
      } else {
        const data = await res.json();
        showToast(data.error || 'ইউজার ডিলিট করা সম্ভব হয়নি', 'error');
        setDeleteConfirm(null);
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
      showToast('ইউজার ডিলিট করতে সমস্যা হয়েছে', 'error');
      setDeleteConfirm(null);
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    try {
      const res = await fetch(`/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: editingUser.fullName,
          mobile: editingUser.mobile,
          role: editingUser.role,
          password: newPassword || undefined
        })
      });
      const data = await res.json();
      if (res.ok) {
        setIsEditingUser(false);
        setNewPassword('');
        setEditingUser(null);
        showToast('ইউজার তথ্য সফলভাবে আপডেট হয়েছে', 'success');
        fetchUsers();
      } else {
        showToast(data.error || 'ইউজার আপডেট করা সম্ভব হয়নি', 'error');
      }
    } catch (error) {
      console.error('Failed to update user:', error);
      showToast('ইউজার আপডেট করতে সমস্যা হয়েছে', 'error');
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchJobs();
    fetchStats();
    if (user?.role === 'admin') {
      fetchUsers();
    }
    if (user?.role === 'user') {
      fetchSavedJobs();
      fetchCv(user.id);
    }
    
    // Safety fallback: ensure loading is marked as false after 10 seconds
    const safetyTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 10000);
    
    return () => clearTimeout(safetyTimeout);
  }, [user]);

  const fetchSavedJobs = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/users/${user.id}/saved-jobs`);
      const data = await res.json();
      setSavedJobs(data);
      
      // Check for approaching deadlines to show toast
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const approaching = data.filter((job: Job) => {
        const deadlineDate = new Date(job.deadline);
        if (isNaN(deadlineDate.getTime())) return false;
        const diffTime = deadlineDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 3;
      });
      
      if (approaching.length > 0) {
        setShowDeadlineToast(true);
        setTimeout(() => setShowDeadlineToast(false), 5000); // Hide after 5 seconds
      }
    } catch (error) {
      console.error('Failed to fetch saved jobs:', error);
    }
  };

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderMessage, setOrderMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [lastOrderInfo, setLastOrderInfo] = useState<{ id: string, name: string } | null>(null);

  const handleApplyClick = async () => {
    if (selectedJob && getRemainingDaysBn(selectedJob.deadline) === 'সময় শেষ') {
      setToast({ message: "দুঃখিত, আবেদনের সময় শেষ হয়ে গেছে।", type: 'error' });
      return;
    }

    if (!user) {
      setLoginModalMessage("আবেদন করার জন্য লগইন বা রেজিস্ট্রেশন করুন");
      setPendingJob(selectedJob);
      setAuthMode('login');
      setIsLoginModalOpen(true);
      return;
    }
    
    if (!cv || cv.error) {
      setInitialDashboardTab('cv');
      setShowCvModal(true);
      return;
    }
    
    setIsOrderModalOpen(true);
  };

  const handleOrderSubmit = async (transactionId: string, selectedPost?: string, paymentMethod?: string) => {
    if (!user || !selectedJob) return;

    setIsOrdering(true);
    setOrderMessage(null);
    setLastOrderInfo(null);

    const safeParseInt = (val: string | undefined, fallback: number = 0) => {
      if (!val) return fallback;
      
      const bengaliToEnglish: { [key: string]: string } = {
        '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
        '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
      };

      let converted = val.split('').map(char => bengaliToEnglish[char] || char).join('');
      const cleaned = converted.replace(/[^0-9.]/g, '');
      const parsed = parseInt(cleaned, 10);
      return isNaN(parsed) ? fallback : parsed;
    };

    try {
      // Calculate job fee based on selected post or general job fee
      let jobFee = 0;
      if (selectedPost && selectedJob.positions) {
        const post = selectedJob.positions.find(p => p.name === selectedPost);
        if (post && post.applicationFee) {
          jobFee = safeParseInt(post.applicationFee);
        }
      }
      
      if (jobFee === 0 && selectedJob.applicationFee) {
        jobFee = safeParseInt(selectedJob.applicationFee);
      }
      
      if (jobFee === 0) {
        jobFee = safeParseInt(siteSettings.applicationFee, 0);
      }

      const serviceCharge = safeParseInt(siteSettings.serviceCharge, 50);
      const totalAmount = (jobFee + serviceCharge).toString();
      const orderId = 'ORD' + Date.now().toString().slice(-6);

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: orderId,
          userId: user.id,
          jobId: selectedJob.id,
          selectedPost: selectedPost,
          amount: totalAmount,
          jobFee: jobFee.toString(),
          serviceCharge: serviceCharge.toString()
        })
      });

      if (res.ok) {
        setLastOrderInfo({ id: orderId, name: user.fullName });
      } else {
        const data = await res.json();
        setOrderMessage({ type: 'error', text: data.error || 'অর্ডার করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।' });
      }
    } catch (error) {
      setOrderMessage({ type: 'error', text: 'সার্ভার ত্রুটি!' });
    } finally {
      setIsOrdering(false);
    }
  };

  const handleToggleSaveJob = async (jobId: string) => {
    if (!user) {
      setAuthMode('login');
      setIsLoginModalOpen(true);
      return;
    }
    const isSaved = savedJobs.some(j => j.id === jobId);
    try {
      if (isSaved) {
        await fetch(`/api/users/${user.id}/saved-jobs/${jobId}`, { method: 'DELETE' });
        setSavedJobs(savedJobs.filter(j => j.id !== jobId));
      } else {
        await fetch(`/api/users/${user.id}/saved-jobs`, { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jobId })
        });
        fetchSavedJobs();
      }
    } catch (error) {
      console.error('Failed to toggle save job:', error);
    }
  };

  const formatNumberBn = (num: number) => {
    return new Intl.NumberFormat('bn-BD').format(num);
  };

  const formatDateBn = (dateString: string) => {
    if (!dateString) return dateString;
    // Normalize string to help cross-browser parsing (replacing - with /)
    const normalized = dateString.includes('-') && !dateString.includes('T') 
      ? dateString.split('-').reverse().join('/') 
      : dateString;
    
    let date = new Date(dateString);
    // If standard parsing fails, try manual parsing for DD/MM/YYYY
    if (isNaN(date.getTime())) {
      const parts = dateString.split(/[-/]/);
      if (parts.length === 3) {
        const d = parseInt(parts[0]);
        const m = parseInt(parts[1]);
        const y = parseInt(parts[2]);
        if (y > 1000) date = new Date(y, m - 1, d);
        else if (d > 1000) date = new Date(d, m - 1, y);
      }
    }

    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
  };

  const getRemainingDaysBn = (deadlineString: string) => {
    if (!deadlineString) return null;
    
    let deadline = new Date(deadlineString);
    // Manual fallback for DD-MM-YYYY or DD/MM/YYYY
    if (isNaN(deadline.getTime())) {
      const parts = deadlineString.split(/[-/]/);
      if (parts.length === 3) {
        const d = parseInt(parts[0]);
        const m = parseInt(parts[1]);
        const y = parseInt(parts[2]);
        if (y > 1000) deadline = new Date(y, m - 1, d);
        else if (d > 1000) deadline = new Date(d, m - 1, y);
      }
    }

    if (isNaN(deadline.getTime())) return null;

    const today = new Date();
    // Normalize both to start of day in local time for accurate day difference
    const d1 = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    const d2 = new Date(deadline.getFullYear(), deadline.getMonth(), deadline.getDate()).getTime();
    
    const diffTime = d2 - d1;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'সময় শেষ';
    if (diffDays === 0) return 'আজ শেষ দিন';
    
    const digits: { [key: string]: string } = {
      '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
    };
    const bnDays = diffDays.toString().split('').map(d => digits[d] || d).join('');
    return `${bnDays} দিন বাকি`;
  };

  const getApproachingDeadlines = () => {
    const today = new Date();
    const d1 = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    
    return savedJobs.filter(job => {
      let deadlineDate = new Date(job.deadline);
      if (isNaN(deadlineDate.getTime())) {
        const parts = job.deadline.split(/[-/]/);
        if (parts.length === 3) {
          const d = parseInt(parts[0]);
          const m = parseInt(parts[1]);
          const y = parseInt(parts[2]);
          if (y > 1000) deadlineDate = new Date(y, m - 1, d);
          else if (d > 1000) deadlineDate = new Date(d, m - 1, y);
        }
      }
      
      if (isNaN(deadlineDate.getTime())) return false;
      
      const d2 = new Date(deadlineDate.getFullYear(), deadlineDate.getMonth(), deadlineDate.getDate()).getTime();
      const diffDays = Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 3;
    });
  };

  const approachingJobs = getApproachingDeadlines();

  const fetchJobs = async (silent = false) => {
    if (!silent && jobs.length === 0) setIsLoading(true);
    try {
      const res = await fetch('/api/jobs');
      if (!res.ok) throw new Error('Failed to fetch jobs');
      const data = await res.json();
      setJobs(data);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      if (!res.ok) throw new Error('Failed to fetch stats');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingJob.id ? 'PUT' : 'POST';
    const url = editingJob.id ? `/api/jobs/${editingJob.id}` : '/api/jobs';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingJob)
      });
      if (res.ok) {
        fetchJobs(true);
        fetchStats();
        setIsEditing(false);
        setEditingJob({
          title: '',
          company: '',
          category: 'বেসরকারি',
          location: '',
          deadline: '',
          description: '',
          requirements: [],
          salary: '',
          companyLogoUrl: '',
          circularImageUrl: '',
          positions: [],
          applicationFee: '',
          minEducationLevel: 0,
          searchKeywords: '',
          seoTitle: '',
          seoDescription: ''
        });
      }
    } catch (error) {
      console.error('Failed to save job:', error);
    }
  };

  const handleDeleteJob = async (id: string) => {
    try {
      const res = await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setDeleteConfirm(null);
        fetchJobs(true);
        fetchStats();
      } else {
        setDeleteConfirm(null);
      }
    } catch (error) {
      console.error('Failed to delete job:', error);
      setDeleteConfirm(null);
    }
  };

  const filteredJobs = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      return jobs.filter(job => selectedCategory === 'সব' || job.category === selectedCategory);
    }

    const searchMappings: { [key: string]: string } = {
      'bank': 'ব্যাংক',
      'govt': 'সরকারি',
      'government': 'সরকারি',
      'private': 'বেসরকারি',
      'ngo': 'এনজিও',
      'officer': 'অফিসার',
      'manager': 'ম্যানেজার',
      'assistant': 'সহকারী',
      'teacher': 'শিক্ষক',
      'engineer': 'ইঞ্জিনিয়ার',
      'doctor': 'ডাক্তার',
      'primary': 'প্রাথমিক',
      'school': 'স্কুল',
      'college': 'কলেজ',
      'university': 'বিশ্ববিদ্যালয়',
      'circular': 'বিজ্ঞপ্তি',
      'job': 'চাকরি',
      'sonali': 'সোনালী',
      'janata': 'জনতা',
      'agrani': 'অগ্রণী',
      'rupali': 'রূপালী',
      'krishi': 'কৃষি',
      'railway': 'রেলওয়ে',
      'police': 'পুলিশ',
      'army': 'সেনাবাহিনী',
      'navy': 'নৌবাহিনী',
      'airforce': 'বিমানবাহিনী',
      'health': 'স্বাস্থ্য',
      'education': 'শিক্ষা',
      'ministry': 'মন্ত্রণালয়',
      'department': 'অধিদপ্তর',
      'bpsc': 'বিপিএসসি',
      'ntrca': 'এনটিআরসিএ',
      'clerk': 'কেরানি',
      'post': 'পদ',
      'vacancy': 'শূন্যপদ',
      'apply': 'আবেদন',
      'recruitment': 'নিয়োগ',
    };

    const queryWords = query.split(/\s+/);
    const expandedQueryWords = queryWords.map(word => searchMappings[word] || word);
    
    return jobs.filter(job => {
      const matchesCategory = selectedCategory === 'সব' || job.category === selectedCategory;
      
      const title = job.title.toLowerCase();
      const company = job.company.toLowerCase();
      const keywords = (job.searchKeywords || '').toLowerCase();
      
      const matchesOriginal = title.includes(query) || company.includes(query) || keywords.includes(query);
      
      // Check if any of the expanded words match individually
      const matchesExpanded = expandedQueryWords.some(word => 
        title.includes(word) || company.includes(word) || keywords.includes(word)
      );

      return matchesCategory && (matchesOriginal || matchesExpanded);
    });
  }, [selectedCategory, searchQuery, jobs]);

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredJobs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredJobs, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  const handleAiSearch = async (e?: React.FormEvent, overrideQuery?: string) => {
    if (e) e.preventDefault();
    const query = overrideQuery || aiSearchQuery;
    if (!query.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: query,
      timestamp: new Date()
    };

    setAiChatHistory(prev => [...prev, userMessage]);
    setAiSearchQuery('');
    setIsAiLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const result = await ai.models.generateContentStream({
        model: "gemini-3-flash-preview",
        contents: `চাকরি প্রত্যাশী হিসেবে আমার প্রশ্ন: "${userMessage.text}". 
        দয়া করে বাংলায় উত্তর দিন। যদি নির্দিষ্ট কোনো চাকরির খোঁজ চান, তবে বর্তমান বাজারের প্রেক্ষাপটে পরামর্শ দিন। 
        আপনার উত্তরটি সুন্দরভাবে ফরম্যাট করে দিন।`,
      });

      const aiMessageId = (Date.now() + 1).toString();
      const aiMessage: ChatMessage = {
        id: aiMessageId,
        role: 'ai',
        text: '',
        timestamp: new Date()
      };

      setAiChatHistory(prev => [...prev, aiMessage]);

      let fullText = '';
      for await (const chunk of result) {
        const chunkText = chunk.text;
        if (chunkText) {
          fullText += chunkText;
          setAiChatHistory(prev => 
            prev.map(msg => 
              msg.id === aiMessageId ? { ...msg, text: fullText } : msg
            )
          );
        }
      }
    } catch (error) {
      console.error('AI Search Error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: 'দুঃখিত, এআই সার্চে সমস্যা হয়েছে। আবার চেষ্টা করুন।',
        timestamp: new Date()
      };
      setAiChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsAiLoading(false);
    }
  };



  if (view === 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex relative">
        {/* Admin Sidebar */}
        <aside className={cn(
          "bg-emerald-900 text-white flex flex-col fixed lg:sticky top-0 left-0 h-screen transition-all duration-300 ease-in-out z-50 shadow-2xl overflow-hidden shrink-0",
          isSidebarOpen ? "w-64" : "w-0 lg:w-20"
        )}>
          <div className={cn("p-6 flex items-center justify-between border-b border-emerald-800 lg:min-w-0 transition-all", isSidebarOpen ? "min-w-[256px]" : "w-0")}>
            {isSidebarOpen ? (
              <div className="flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-emerald-400" />
                <h1 className="text-lg font-bold truncate">{siteSettings.siteName}</h1>
              </div>
            ) : (
              <Briefcase className="w-8 h-8 text-emerald-400 mx-auto hidden lg:block" />
            )}
          </div>
          <nav className={cn("flex-1 p-4 space-y-2 lg:min-w-0 transition-all", isSidebarOpen ? "min-w-[256px]" : "w-0")}>
            <button 
              onClick={() => {
                setAdminView('dashboard');
                if (window.innerWidth < 1024) setIsSidebarOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                adminView === 'dashboard' ? "bg-emerald-800 text-white shadow-inner" : "hover:bg-emerald-800/50 text-emerald-100",
                !isSidebarOpen && "lg:justify-center lg:px-0"
              )}
              title="ড্যাশবোর্ড"
            >
              <Building2 className="w-4 h-4" />
              {(isSidebarOpen || window.innerWidth >= 1024) && <span className={cn("truncate", !isSidebarOpen && "lg:hidden")}>ড্যাশবোর্ড</span>}
            </button>
            <button 
              onClick={() => {
                setAdminView('jobs');
                if (window.innerWidth < 1024) setIsSidebarOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                adminView === 'jobs' ? "bg-emerald-800 text-white shadow-inner" : "hover:bg-emerald-800/50 text-emerald-100",
                !isSidebarOpen && "lg:justify-center lg:px-0"
              )}
              title="জব ম্যানেজমেন্ট"
            >
              <Briefcase className="w-4 h-4" />
              {(isSidebarOpen || window.innerWidth >= 1024) && <span className={cn("truncate", !isSidebarOpen && "lg:hidden")}>জব ম্যানেজমেন্ট</span>}
            </button>
            <button 
              onClick={() => {
                setAdminView('users');
                if (window.innerWidth < 1024) setIsSidebarOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                adminView === 'users' ? "bg-emerald-800 text-white shadow-inner" : "hover:bg-emerald-800/50 text-emerald-100",
                !isSidebarOpen && "lg:justify-center lg:px-0"
              )}
              title="ইউজার লিস্ট"
            >
              <UserIcon className="w-4 h-4" />
              {(isSidebarOpen || window.innerWidth >= 1024) && <span className={cn("truncate", !isSidebarOpen && "lg:hidden")}>ইউজার লিস্ট</span>}
            </button>
            <button 
              onClick={() => {
                setAdminView('orders');
                if (window.innerWidth < 1024) setIsSidebarOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                adminView === 'orders' ? "bg-emerald-800 text-white shadow-inner" : "hover:bg-emerald-800/50 text-emerald-100",
                !isSidebarOpen && "lg:justify-center lg:px-0"
              )}
              title="অর্ডার লিস্ট"
            >
              <FileText className="w-4 h-4" />
              {(isSidebarOpen || window.innerWidth >= 1024) && <span className={cn("truncate", !isSidebarOpen && "lg:hidden")}>অর্ডার লিস্ট</span>}
            </button>
            <button 
              onClick={() => {
                setAdminView('service-requests');
                if (window.innerWidth < 1024) setIsSidebarOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                adminView === 'service-requests' ? "bg-emerald-800 text-white shadow-inner" : "hover:bg-emerald-800/50 text-emerald-100",
                !isSidebarOpen && "lg:justify-center lg:px-0"
              )}
              title="সার্ভিস রিকোয়েস্ট"
            >
              <Camera className="w-4 h-4" />
              {(isSidebarOpen || window.innerWidth >= 1024) && <span className={cn("truncate", !isSidebarOpen && "lg:hidden")}>সার্ভিস রিকোয়েস্ট</span>}
            </button>
            <button 
              onClick={() => {
                setAdminView('settings');
                if (window.innerWidth < 1024) setIsSidebarOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                adminView === 'settings' ? "bg-emerald-800 text-white shadow-inner" : "hover:bg-emerald-800/50 text-emerald-100",
                !isSidebarOpen && "lg:justify-center lg:px-0"
              )}
              title="সাইট সেটিংস"
            >
              <Settings className="w-4 h-4" />
              {(isSidebarOpen || window.innerWidth >= 1024) && <span className={cn("truncate", !isSidebarOpen && "lg:hidden")}>সাইট সেটিংস</span>}
            </button>
            <button 
              onClick={() => {
                setAdminView('preps');
                if (window.innerWidth < 1024) setIsSidebarOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                adminView === 'preps' ? "bg-emerald-800 text-white shadow-inner" : "hover:bg-emerald-800/50 text-emerald-100",
                !isSidebarOpen && "lg:justify-center lg:px-0"
              )}
              title="প্রস্তুতি কন্টেন্ট"
            >
              <Layers className="w-4 h-4" />
              {(isSidebarOpen || window.innerWidth >= 1024) && <span className={cn("truncate", !isSidebarOpen && "lg:hidden")}>প্রস্তুতি কন্টেন্ট</span>}
            </button>
            <button 
              onClick={() => {
                setAdminView('messages');
                if (window.innerWidth < 1024) setIsSidebarOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                adminView === 'messages' ? "bg-emerald-800 text-white shadow-inner" : "hover:bg-emerald-800/50 text-emerald-100",
                !isSidebarOpen && "lg:justify-center lg:px-0"
              )}
              title="মেসেজ লিস্ট"
            >
              <MessageSquare className="w-4 h-4" />
              {(isSidebarOpen || window.innerWidth >= 1024) && <span className={cn("truncate", !isSidebarOpen && "lg:hidden")}>মেসেজ লিস্ট</span>}
            </button>
          </nav>
          <div className={cn("p-4 border-t border-emerald-800 lg:min-w-0 transition-all", isSidebarOpen ? "min-w-[256px]" : "w-0")}>
            <button 
              onClick={() => setView('user')}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 hover:bg-red-900/50 text-red-200 rounded-xl text-sm font-medium transition-colors",
                !isSidebarOpen && "lg:justify-center lg:px-0"
              )}
              title="ইউজার ভিউ"
            >
              <Globe className="w-4 h-4" />
              {(isSidebarOpen || window.innerWidth >= 1024) && <span className={cn("truncate", !isSidebarOpen && "lg:hidden")}>ইউজার ভিউ</span>}
            </button>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Admin Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 transition-all duration-300 w-full">
          <header className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 gap-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm shrink-0"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              <div className="min-w-0">
                <h2 className="text-xl lg:text-2xl font-bold truncate">
                  {adminView === 'dashboard' ? 'ড্যাশবোর্ড ওভারভিউ' : 
                   adminView === 'jobs' ? 'জব ম্যানেজমেন্ট' : 
                   adminView === 'users' ? 'ইউজার লিস্ট' : 
                   adminView === 'orders' ? 'অর্ডার লিস্ট' : 
                   adminView === 'messages' ? 'মেসেজ লিস্ট' : 
                   adminView === 'service-requests' ? 'সার্ভিস রিকোয়েস্ট' : 
                   adminView === 'preps' ? 'প্রস্তুতি ও কন্ট্রিবিউশন কন্ট্রোল' : 'সাইট সেটিংস'}
                </h2>
                <p className="text-gray-500 text-xs lg:text-sm truncate">
                  {adminView === 'dashboard' ? 'আপনার পোর্টালের যাবতীয় কার্যক্রমের সারসংক্ষেপ।' : 
                   adminView === 'jobs' ? 'আপনার পোর্টালের যাবতীয় চাকরির বিজ্ঞপ্তি পরিচালনা করুন।' : 
                   adminView === 'users' ? 'রেজিস্ট্রেশনকৃত সকল ইউজারের তালিকা ও তথ্য।' :
                   adminView === 'orders' ? 'সকল পেমেন্ট ও আবেদন অর্ডারের তালিকা।' : 
                   adminView === 'messages' ? 'ইউজারদের পাঠানো সকল মেসেজের তালিকা।' : 
                   adminView === 'service-requests' ? 'ইউজারদের ছবি ও স্বাক্ষর সাইজ করার রিকোয়েস্ট।' : 
                   adminView === 'preps' ? 'ব্যবহারকারীদের প্রস্তাবকৃত প্রশ্ন সংযোজন, বিয়োজন এবং সংশোধন করুন।' : 'কোডিং ছাড়াই এখান থেকে পুরো সাইট কন্ট্রোল করুন।'}
                </p>
              </div>
            </div>
            {adminView === 'jobs' && (
              <button 
                onClick={() => {
                  setIsEditing(true);
                  setEditingJob({
                    title: '',
                    company: '',
                    category: 'বেসরকারি',
                    location: '',
                    deadline: '',
                    description: '',
                    requirements: [],
                    salary: '',
                    companyLogoUrl: '',
                    circularImageUrl: '',
                    positions: [],
                    applicationFee: '',
                    minEducationLevel: 0,
                    searchKeywords: '',
                    seoTitle: '',
                    seoDescription: ''
                  });
                }}
                className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                নতুন জব পোস্ট করুন
              </button>
            )}
          </header>

          {/* Admin Dashboard Content */}
          <AdminDashboard 
            adminView={adminView}
            setAdminView={setAdminView}
            adminStats={adminStats}
            stats={stats}
            jobs={jobs}
            users={users}
            orders={allOrders}
            serviceRequests={serviceRequests}
            onUpdateServiceRequestStatus={handleUpdateServiceRequestStatus}
            messages={messages}
            onUpdateMessageStatus={async (id, status) => {
              try {
                const res = await fetch(`/api/contact/${id}/status`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ status })
                });
                if (res.ok) {
                  setMessages(prev => prev.map(m => m.id === id ? { ...m, status } : m));
                  showToast('মেসেজ স্ট্যাটাস আপডেট হয়েছে', 'success');
                }
              } catch (error) {
                showToast('আপডেট করতে সমস্যা হয়েছে', 'error');
              }
            }}
            onDeleteMessage={async (id) => {
              try {
                const res = await fetch(`/api/contact/${id}`, { method: 'DELETE' });
                if (res.ok) {
                  setMessages(prev => prev.filter(m => m.id === id));
                  showToast('মেসেজ ডিলিট হয়েছে', 'success');
                  fetchAdminData();
                }
              } catch (error) {
                showToast('ডিলিট করতে সমস্যা হয়েছে', 'error');
              }
            }}
            handleUpdateOrderStatus={handleUpdateOrderStatus}
            setEditingJob={setEditingJob}
            setIsEditing={setIsEditing}
            setDeleteConfirm={setDeleteConfirm}
            setEditingUser={setEditingUser}
            setNewPassword={setNewPassword}
            setIsEditingUser={setIsEditingUser}
            siteSettings={siteSettings}
            onUpdateSettings={handleUpdateSettings}
            showToast={showToast}
          />
        </main>

        {/* Job Editor Modal */}
        <AnimatePresence>
          {isEditing && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setIsEditing(false)}
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh]"
              >
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-xl font-bold">{editingJob.id ? 'জব এডিট করুন' : 'নতুন জব পোস্ট'}</h3>
                  <button onClick={() => setIsEditing(false)}><X className="w-6 h-6" /></button>
                </div>
                <form onSubmit={handleSaveJob} className="p-8 overflow-y-auto space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">পদবী</label>
                      <input 
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        value={editingJob.title}
                        onChange={(e) => setEditingJob({...editingJob, title: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">প্রতিষ্ঠান</label>
                      <input 
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        value={editingJob.company}
                        onChange={(e) => setEditingJob({...editingJob, company: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">ক্যাটাগরি</label>
                      <select 
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        value={editingJob.category}
                        onChange={(e) => setEditingJob({...editingJob, category: e.target.value as JobCategory})}
                      >
                        <option value="সরকারি">সরকারি</option>
                        <option value="বেসরকারি">বেসরকারি</option>
                        <option value="ব্যাংক">ব্যাংক</option>
                        <option value="এনজিও">এনজিও</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">ন্যূনতম শিক্ষাগত যোগ্যতা</label>
                      <select 
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        value={editingJob.minEducationLevel || 0}
                        onChange={(e) => setEditingJob({...editingJob, minEducationLevel: parseInt(e.target.value)})}
                      >
                        <option value={0}>প্রয়োজন নেই</option>
                        <option value={1}>এসএসসি / সমমান (SSC)</option>
                        <option value={2}>এইচএসসি / সমমান (HSC)</option>
                        <option value={3}>স্নাতক / সমমান (Graduation)</option>
                        <option value={4}>স্নাতকোত্তর / সমমান (Masters)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">ডেডলাইন</label>
                      <input 
                        type="date"
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        value={editingJob.deadline}
                        onChange={(e) => setEditingJob({...editingJob, deadline: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">অবস্থান</label>
                    <input 
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      value={editingJob.location}
                      onChange={(e) => setEditingJob({...editingJob, location: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">বেতন</label>
                      <input 
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        value={editingJob.salary}
                        onChange={(e) => setEditingJob({...editingJob, salary: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">আবেদন ফি (টাকা)</label>
                      <input 
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        value={editingJob.applicationFee || ''}
                        onChange={(e) => setEditingJob({...editingJob, applicationFee: e.target.value})}
                        placeholder="উদা: 100"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">প্রতিষ্ঠানের লগো (Browse)</label>
                      <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                          <input 
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'companyLogoUrl')}
                            className="hidden"
                            id="logo-upload"
                          />
                          <label 
                            htmlFor="logo-upload"
                            className={cn(
                              "flex items-center justify-center gap-2 w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-100 transition-all text-sm font-bold text-gray-600",
                              isUploading && "opacity-50 cursor-not-allowed"
                            )}
                          >
                            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                            লগো সিলেক্ট করুন
                          </label>
                        </div>
                        {editingJob.companyLogoUrl && (
                          <div className="relative group">
                            <img 
                              src={editingJob.companyLogoUrl} 
                              alt="Logo Preview" 
                              className="w-12 h-12 rounded-lg object-contain border border-gray-100 bg-white"
                            />
                            <button 
                              type="button"
                              onClick={() => setEditingJob({ ...editingJob, companyLogoUrl: '' })}
                              className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">নিয়োগ বিজ্ঞপ্তি (Image/PDF)</label>
                      <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                          <input 
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={(e) => handleFileUpload(e, 'circularImageUrl')}
                            className="hidden"
                            id="circular-upload"
                          />
                          <label 
                            htmlFor="circular-upload"
                            className={cn(
                              "flex items-center justify-center gap-2 w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-100 transition-all text-sm font-bold text-gray-600",
                              isUploading && "opacity-50 cursor-not-allowed"
                            )}
                          >
                            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                            ফাইল সিলেক্ট করুন
                          </label>
                        </div>
                        {editingJob.circularImageUrl && (
                          <div className="flex flex-col gap-2">
                            <div className="relative group">
                              {editingJob.circularImageUrl.startsWith('data:application/pdf') ? (
                                <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center border border-red-100">
                                  <FileText className="w-6 h-6 text-red-500" />
                                </div>
                              ) : (
                                <img 
                                  src={editingJob.circularImageUrl} 
                                  alt="Circular Preview" 
                                  className="w-12 h-12 rounded-lg object-cover border border-gray-100 bg-white"
                                />
                              )}
                              <button 
                                type="button"
                                onClick={() => setEditingJob({ ...editingJob, circularImageUrl: '' })}
                                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={handleAiAutoFill}
                              disabled={isAiFilling}
                              className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-all disabled:opacity-50"
                            >
                              {isAiFilling ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Sparkles className="w-3 h-3" />
                              )}
                              AI অটো-ফিল
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase flex justify-between items-center">
                      সার্চ কি-ওয়ার্ড (ইংরেজি ও বাংলা)
                      <button
                        type="button"
                        onClick={handleAiGenerateKeywords}
                        disabled={isAiFilling}
                        className="text-[10px] font-bold text-emerald-600 hover:underline flex items-center gap-1"
                      >
                        {isAiFilling ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <Sparkles className="w-2.5 h-2.5" />}
                        AI দিয়ে জেনারেট করুন
                      </button>
                    </label>
                    <textarea 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 h-20 resize-none"
                      value={editingJob.searchKeywords || ''}
                      onChange={(e) => setEditingJob({...editingJob, searchKeywords: e.target.value})}
                      placeholder="উদা: Bank, Officer, Sonali Bank, ব্যাংক অফিসার..."
                    />
                    <p className="text-[10px] text-gray-400">ইংরেজি বা বাংলা যেকোনো ভাষায় সার্চ করার জন্য এখানে কি-ওয়ার্ডগুলো কমা দিয়ে লিখুন।</p>
                  </div>
                  <div className="flex gap-4 pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 px-6 py-4 rounded-2xl border border-gray-200 font-bold hover:bg-gray-50 transition-all"
                    >
                      বাতিল করুন
                    </button>
                    <button
                      type="submit"
                      disabled={isUploading}
                      className="flex-2 px-6 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
                    >
                      {isUploading && <Loader2 className="w-4 h-4 animate-spin" />}
                      তথ্য সংরক্ষণ করুন
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deleteConfirm && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[210] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl text-center"
              >
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trash2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">আপনি কি নিশ্চিত?</h3>
                <p className="text-gray-500 mb-8">
                  {deleteConfirm.type === 'user' ? 'এই ইউজারকে মুছে ফেললে তা আর ফেরত পাওয়া যাবে না।' : 'এই বিজ্ঞপ্তিটি মুছে ফেললে তা আর ফেরত পাওয়া যাবে না।'}
                </p>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setDeleteConfirm(null)}
                    className="flex-1 px-6 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    বাতিল করুন
                  </button>
                  <button 
                    onClick={() => deleteConfirm.type === 'user' ? handleDeleteUser(deleteConfirm.id) : handleDeleteJob(deleteConfirm.id)}
                    className="flex-1 px-6 py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
                  >
                    হ্যাঁ, মুছে ফেলুন
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* User Editor Modal */}
        <AnimatePresence>
          {isEditingUser && editingUser && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => {
                  setIsEditingUser(false);
                  setEditingUser(null);
                  setNewPassword('');
                }}
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
              >
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h3 className="text-lg font-bold text-gray-900 font-bengali">ইউজার তথ্য আপডেট করুন</h3>
                  <button 
                    onClick={() => {
                      setIsEditingUser(false);
                      setEditingUser(null);
                      setNewPassword('');
                    }}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    await handleUpdateUser();
                  }} 
                  className="p-6 overflow-y-auto space-y-4"
                >
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">ইউজারনেম</label>
                    <input 
                      type="text"
                      disabled
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-250 rounded-xl focus:outline-none cursor-not-allowed text-gray-500 font-mono text-sm"
                      value={editingUser.username || ''}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">পূর্ণ নাম</label>
                    <input 
                      type="text"
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm font-bengali"
                      value={editingUser.fullName || ''}
                      onChange={(e) => setEditingUser({ ...editingUser, fullName: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">মোবাইল নাম্বার</label>
                    <input 
                      type="text"
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 font-mono text-sm"
                      value={editingUser.mobile || ''}
                      onChange={(e) => setEditingUser({ ...editingUser, mobile: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase font-bengali">নতুন পাসওয়ার্ড (পরিবর্তন করতে চাইলে লিখুন)</label>
                    <input 
                      type="text"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 font-mono text-sm"
                      placeholder="পাসওয়ার্ড অপরিবর্তিত থাকবে"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">ভূমিকা (Role)</label>
                    <select
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm font-bengali"
                      value={editingUser.role || 'user'}
                      onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                    >
                      <option value="user">User (ইউজার)</option>
                      <option value="admin">Admin (এডমিন)</option>
                    </select>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingUser(false);
                        setEditingUser(null);
                        setNewPassword('');
                      }}
                      className="flex-1 px-5 py-3 rounded-xl border border-gray-200 font-bold hover:bg-gray-50 transition-all text-gray-700 text-sm font-bengali"
                    >
                      বাতিল করুন
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-5 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 text-sm font-bengali"
                    >
                      সংরক্ষণ করুন
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <ScrollToTop />
        <AnimatePresence>
          {toast && (
            <Toast 
              message={toast.message} 
              type={toast.type} 
              onClose={() => setToast(null)} 
            />
          )}
        </AnimatePresence>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-white font-bengali pb-20 lg:pb-0">
      <nav className="sticky top-0 z-[100] bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200 rotate-3 group cursor-pointer hover:rotate-0 transition-all duration-300 shrink-0">
                <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div 
                className="flex flex-col cursor-pointer"
                onClick={() => { setView('user'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              >
                <h1 className="text-base sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
                  {siteSettings.siteName}
                </h1>
                <span className="text-[10px] text-gray-400 font-bold tracking-[0.2em] uppercase hidden sm:block">Trusted Job Seva</span>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-6">
              <button 
                onClick={() => { setView('user'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                className="text-sm font-bold text-gray-600 hover:text-emerald-600 transition-colors"
              >
                হোম
              </button>
              
              {/* নিয়োগ বিজ্ঞপ্তি Dropdown */}
              <div className="relative group" onMouseEnter={() => setIsJobsDropdownOpen(true)} onMouseLeave={() => setIsJobsDropdownOpen(false)}>
                <button className="flex items-center gap-1.5 text-sm font-bold text-gray-600 hover:text-emerald-600 transition-colors py-8">
                  নিয়োগ বিজ্ঞপ্তি <ChevronDown className="w-4 h-4" />
                </button>
                <div className={`absolute top-[80px] left-0 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 transition-all duration-300 z-[110] ${isJobsDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
                  {['সরকারি', 'বেসরকারি', 'ব্যাংক', 'এনজিও'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat as any);
                        setView('user');
                        window.scrollTo({ top: 600, behavior: 'smooth' });
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* প্রস্তুতি Dropdown */}
              <div className="relative group" onMouseEnter={() => setIsPrepDropdownOpen(true)} onMouseLeave={() => setIsPrepDropdownOpen(false)}>
                <button className="flex items-center gap-1.5 text-sm font-bold text-gray-600 hover:text-emerald-600 transition-colors py-8">
                  প্রস্তুতি <ChevronDown className="w-4 h-4" />
                </button>
                <div className={`absolute top-[80px] left-0 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 transition-all duration-300 z-[110] ${isPrepDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
                  {[
                    { id: 'subject-lessons', label: 'বিষয়ভিত্তিক পাঠ' },
                    { id: 'mock-test', label: 'মক টেস্ট' },
                    { id: 'ai-interview', label: 'AI ইন্টারভিউ' },
                    { id: 'skill-assessment', label: 'স্কিল অ্যাসেসমেন্ট' }
                  ].map((item) => (
                    <button key={item.id} onClick={() => setView(item.id as any)} className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all">{item.label}</button>
                  ))}
                </div>
              </div>

              {/* ক্যারিয়ার গাইড Dropdown */}
              <div className="relative group" onMouseEnter={() => setIsCareerDropdownOpen(true)} onMouseLeave={() => setIsCareerDropdownOpen(false)}>
                <button className="flex items-center gap-1.5 text-sm font-bold text-gray-600 hover:text-emerald-600 transition-colors py-8">
                  ক্যারিয়ার গাইড <ChevronDown className="w-4 h-4" />
                </button>
                <div className={`absolute top-[80px] left-0 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 transition-all duration-300 z-[110] ${isCareerDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
                  {[
                    { id: 'interview-tips', label: 'ইন্টারভিউ টিপস' },
                    { id: 'resume-guide', label: 'সিভি গাইড' },
                    { id: 'cover-letter-tips', label: 'কভার লেটার টিপস' }
                  ].map((item) => (
                    <button key={item.id} onClick={() => setView(item.id as any)} className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all">{item.label}</button>
                  ))}
                </div>
              </div>

              <button onClick={() => setView('more-services')} className="text-sm font-bold text-gray-600 hover:text-emerald-600 transition-colors">অন্যান্য সেবা</button>
              <button onClick={() => setView('about')} className="text-sm font-bold text-gray-600 hover:text-emerald-600 transition-colors">সম্পর্কে</button>
              <button onClick={() => setView('contact')} className="text-sm font-bold text-gray-600 hover:text-emerald-600 transition-colors">যোগাযোগ</button>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-3 md:gap-4">
              {user ? (
                <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
                  <button 
                    onClick={() => setView('dashboard')} 
                    className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-4 sm:py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl font-bold transition-all text-xs sm:text-sm"
                  >
                    <UserIcon className="w-4 h-4 text-emerald-600" />
                    <span className="hidden sm:inline">ড্যাশবোর্ড</span>
                  </button>
                  <button 
                    onClick={handleLogout} 
                    className="p-1.5 sm:p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-colors"
                    title="লগ আউট"
                  >
                    <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsLoginModalOpen(true)} 
                  className="px-3 py-1.5 sm:px-6 sm:py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-200 text-xs sm:text-sm"
                >
                  লগইন
                </button>
              )}
              
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 sm:p-2.5 md:p-3 bg-gray-50 text-gray-600 rounded-2xl hover:bg-gray-100 transition-all focus:outline-none"
                aria-label="মেনু"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Bottom Navigation Bar for Mobile and Tablets */}
        <div 
          className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-100 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] z-[9999] px-2 flex justify-around items-center"
          style={{ 
            boxSizing: 'border-box'
          }}
        >
          <button 
            onClick={() => { 
              setView('user'); 
              setIsMobileMenuOpen(false); 
              setSelectedCategory('সব');
              window.scrollTo({ top: 0, behavior: 'smooth' }); 
            }}
            className={cn(
              "flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-all rounded-xl relative h-full",
              view === 'user' && selectedCategory === 'সব' && !isMobileMenuOpen ? "text-emerald-600 font-bold scale-105" : "text-gray-500 hover:text-gray-700 active:scale-95"
            )}
          >
            <Home className={cn("w-5 h-5 transition-transform", view === 'user' && selectedCategory === 'সব' && !isMobileMenuOpen && "scale-110")} />
            <span className="text-[10px] tracking-wide font-bold">হোম</span>
            {view === 'user' && selectedCategory === 'সব' && !isMobileMenuOpen && (
              <span className="absolute bottom-1 w-1.5 h-1.5 bg-emerald-600 rounded-full" />
            )}
          </button>

          <button 
            onClick={() => { 
              setView('user'); 
              setIsMobileMenuOpen(false);
              setSelectedCategory('সব'); 
              setTimeout(() => {
                const el = document.getElementById('jobs');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                } else {
                  window.scrollTo({ top: 600, behavior: 'smooth' });
                }
              }, 100);
            }}
            className={cn(
              "flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-all rounded-xl relative h-full",
              view === 'user' && selectedCategory !== 'সব' && !isMobileMenuOpen ? "text-emerald-600 font-bold scale-105" : "text-gray-500 hover:text-gray-700 active:scale-95"
            )}
          >
            <Briefcase className={cn("w-5 h-5 transition-transform", view === 'user' && selectedCategory !== 'সব' && !isMobileMenuOpen && "scale-110")} />
            <span className="text-[10px] tracking-wide font-bold">চাকরি</span>
            {view === 'user' && selectedCategory !== 'সব' && !isMobileMenuOpen && (
              <span className="absolute bottom-1 w-1.5 h-1.5 bg-emerald-600 rounded-full" />
            )}
          </button>

          <button 
            onClick={() => { setView('more-services'); setIsMobileMenuOpen(false); }}
            className={cn(
              "flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-all rounded-xl relative h-full",
              view === 'more-services' && !isMobileMenuOpen ? "text-emerald-600 font-bold scale-105" : "text-gray-500 hover:text-gray-700 active:scale-95"
            )}
          >
            <BookOpen className={cn("w-5 h-5 transition-transform", view === 'more-services' && !isMobileMenuOpen && "scale-110")} />
            <span className="text-[10px] tracking-wide font-bold">সেবা সমূহ</span>
            {view === 'more-services' && !isMobileMenuOpen && (
              <span className="absolute bottom-1 w-1.5 h-1.5 bg-emerald-600 rounded-full" />
            )}
          </button>

          <button 
            onClick={() => {
              setIsMobileMenuOpen(false);
              if (user) {
                setInitialDashboardTab('profile');
                setView('dashboard');
              } else {
                setIsLoginModalOpen(true);
              }
            }}
            className={cn(
              "flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-all rounded-xl relative h-full",
              view === 'dashboard' && !isMobileMenuOpen ? "text-emerald-600 font-bold scale-105" : "text-gray-500 hover:text-gray-700 active:scale-95"
            )}
          >
            <UserIcon className={cn("w-5 h-5 transition-transform", view === 'dashboard' && !isMobileMenuOpen && "scale-110")} />
            <span className="text-[10px] tracking-wide font-bold">{user ? "প্রোফাইল" : "লগইন"}</span>
            {view === 'dashboard' && !isMobileMenuOpen && (
              <span className="absolute bottom-1 w-1.5 h-1.5 bg-emerald-600 rounded-full" />
            )}
          </button>

          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-all rounded-xl relative h-full",
              isMobileMenuOpen ? "text-emerald-600 font-bold scale-105" : "text-gray-500 hover:text-gray-700 active:scale-95"
            )}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 transition-transform scale-110 text-emerald-600" /> : <MoreHorizontal className="w-5 h-5 transition-transform" />}
            <span className="text-[10px] tracking-wide font-bold font-bengali">মেনু</span>
            {isMobileMenuOpen && (
              <span className="absolute bottom-1 w-1.5 h-1.5 bg-emerald-600 rounded-full" />
            )}
          </button>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-0 z-[250] bg-gray-50 lg:hidden overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-150 px-6 h-20 flex justify-between items-center z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-black text-gray-900 leading-tight">{siteSettings.siteName}</h1>
                    <p className="text-[10px] text-emerald-600 font-bold tracking-wider uppercase">মোবাইল মেনু পোর্টাল</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 active:scale-95 transition-all"
                  aria-label="বন্ধ করুন"
                >
                  <X className="w-5 h-5 font-bold" />
                </button>
              </div>

              <div className="p-5 space-y-6 pb-36">
                
                {/* User Session card (Login/Register or Profile Quick Options) */}
                <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm">
                  {user ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 pb-4 border-b border-gray-50">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center font-black text-lg">
                          {user.fullName?.[0] || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-extrabold text-gray-900 truncate">{user.fullName || 'ব্যবহারকারী'}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                          <span className="inline-block mt-0.5 px-2.5 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold">
                            {user.role === 'admin' ? 'অ্যাডমিন অ্যাকাউন্ট' : 'জব প্রার্থী'}
                          </span>
                        </div>
                      </div>

                      {/* Dashboard specific navigation within the menu */}
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">আমার অ্যাকাউন্ট মেনু</p>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => {
                              setInitialDashboardTab('profile');
                              setView('dashboard');
                              setIsMobileMenuOpen(false);
                            }}
                            className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 hover:bg-emerald-50 hover:text-emerald-700 text-gray-700 rounded-xl text-xs font-bold text-left transition-all font-bengali"
                          >
                            <UserIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>আমার প্রোফাইল</span>
                          </button>
                          
                          <button
                            onClick={() => {
                              setInitialDashboardTab('cv');
                              setView('dashboard');
                              setIsMobileMenuOpen(false);
                            }}
                            className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 hover:bg-emerald-50 hover:text-emerald-700 text-gray-700 rounded-xl text-xs font-bold text-left transition-all font-bengali"
                          >
                            <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>আমার সিভি</span>
                          </button>

                          <button
                            onClick={() => {
                              setInitialDashboardTab('orders');
                              setView('dashboard');
                              setIsMobileMenuOpen(false);
                            }}
                            className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 hover:bg-emerald-50 hover:text-emerald-700 text-gray-700 rounded-xl text-xs font-bold text-left transition-all font-bengali"
                          >
                            <Briefcase className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>আবেদনসমূহ</span>
                          </button>

                          <button
                            onClick={() => {
                              setInitialDashboardTab('saved');
                              setView('dashboard');
                              setIsMobileMenuOpen(false);
                            }}
                            className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 hover:bg-emerald-50 hover:text-emerald-700 text-gray-700 rounded-xl text-xs font-bold text-left transition-all font-bengali"
                          >
                            <Bookmark className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>সেভ করা চাকরি</span>
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-2 pt-2 border-t border-gray-50">
                        {user.role === 'admin' && (
                          <button
                            onClick={() => {
                              setView('admin');
                              setIsMobileMenuOpen(false);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="w-full flex items-center justify-center gap-2 p-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-sm font-bold transition-all font-bengali"
                          >
                            <ShieldCheck className="w-4 h-4" />
                            অ্যাডমিন ড্যাশবোর্ড
                          </button>
                        )}
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full flex items-center justify-center gap-2 p-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-bold transition-all font-bengali"
                        >
                          <LogOut className="w-4 h-4" />
                          লগ আউট করুন
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-xs text-gray-500 font-medium">আপনার প্রোফাইল, আবেদন ট্র্যাকিং এবং সিভি সার্ভিস ব্যবহার করতে লগইন করুন।</p>
                      <button
                        onClick={() => {
                          setIsLoginModalOpen(true);
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 p-3.5 bg-emerald-600 text-white rounded-xl text-sm font-black hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 active:scale-95 font-bengali"
                      >
                        <UserIcon className="w-5 h-5" />
                        লগইন / রেজিস্টার করুন
                      </button>
                    </div>
                  )}
                </div>

                {/* Main Views Segment */}
                <div className="space-y-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-1">মূল পেজ সমুহ</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => { setView('user'); setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-xl font-bold text-gray-700 hover:text-emerald-600 text-sm active:scale-95 transition-all text-left font-bengali"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <Home className="w-4 h-4" />
                      </div>
                      হোম পেজ
                    </button>
                    
                    <button
                      onClick={() => { setView('more-services'); setIsMobileMenuOpen(false); }}
                      className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-xl font-bold text-gray-700 hover:text-emerald-600 text-sm active:scale-95 transition-all text-left font-bengali"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <LayoutGrid className="w-4 h-4" />
                      </div>
                      সেবা সমূহ
                    </button>

                    <button
                      onClick={() => { setView('about'); setIsMobileMenuOpen(false); }}
                      className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-xl font-bold text-gray-700 hover:text-emerald-600 text-sm active:scale-95 transition-all text-left font-bengali"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <Info className="w-4 h-4" />
                      </div>
                      সম্পর্কে
                    </button>

                    <button
                      onClick={() => { setView('contact'); setIsMobileMenuOpen(false); }}
                      className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-xl font-bold text-gray-700 hover:text-emerald-600 text-sm active:scale-95 transition-all text-left font-bengali"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <Phone className="w-4 h-4" />
                      </div>
                      যোগাযোগ
                    </button>
                  </div>
                </div>

                {/* Job Categories Segment */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 px-1">
                    <div className="w-1 h-3 bg-emerald-500 rounded-full" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">নিয়োগ বিজ্ঞপ্তি ক্যাটাগরি</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: 'सरकारी', color: 'text-rose-600 bg-rose-50 border-rose-100', fullName: 'সরকারি' },
                      { name: 'বেসরকারি', color: 'text-blue-600 bg-blue-50 border-blue-100', fullName: 'বেসরকারি' },
                      { name: 'ব্যাংক', color: 'text-amber-600 bg-amber-50 border-amber-100', fullName: 'ব্যাংক' },
                      { name: 'এনজিও', color: 'text-purple-600 bg-purple-50 border-purple-100', fullName: 'এনজিও' }
                    ].map((cat) => (
                      <button
                        key={cat.fullName}
                        onClick={() => {
                          setSelectedCategory(cat.fullName as any);
                          setView('user');
                          setIsMobileMenuOpen(false);
                          setTimeout(() => {
                            const el = document.getElementById('jobs');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }, 150);
                        }}
                        className={`flex items-center gap-3 p-3.5 bg-white border border-gray-100 hover:border-emerald-500 rounded-xl active:scale-95 text-left transition-all font-bold text-sm font-bengali`}
                      >
                        <div className={`w-8 h-8 ${cat.color} border rounded-lg flex items-center justify-center shrink-0 font-extrabold text-xs`}>
                          {cat.fullName[0]}
                        </div>
                        <span className="text-gray-800">{cat.fullName} চাকরি</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Prep and Guides Segment */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 px-1">
                    <div className="w-1 h-3 bg-amber-500 rounded-full" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">প্রস্তুতি ও গাইড</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'subject-lessons', label: 'বিষয়ভিত্তিক পাঠ', icon: <BookOpen className="w-4 h-4" />, color: 'bg-indigo-50 text-indigo-700' },
                      { id: 'mock-test', label: 'মক টেস্ট', icon: <Trophy className="w-4 h-4" />, color: 'bg-amber-50 text-amber-700' },
                      { id: 'ai-interview', label: 'AI ইন্টারভিউ', icon: <Sparkles className="w-4 h-4" />, color: 'bg-purple-50 text-purple-700' },
                      { id: 'skill-assessment', label: 'স্কিল অ্যাসেসমেন্ট', icon: <CheckCircle className="w-4 h-4" />, color: 'bg-teal-50 text-teal-700' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => { setView(item.id as any); setIsMobileMenuOpen(false); }}
                        className="flex flex-col items-start gap-2.5 p-4 bg-white border border-gray-100 hover:border-emerald-300 rounded-2xl active:scale-95 transition-all text-left cursor-pointer group font-bengali"
                      >
                        <div className={`w-8 h-8 ${item.color} rounded-lg flex items-center justify-center`}>{item.icon}</div>
                        <span className="font-bold text-xs text-gray-800 leading-tight group-hover:text-emerald-700">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tools and Tips Segment */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 px-1">
                    <div className="w-1 h-3 bg-blue-500 rounded-full" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">স্মার্ট টুলস ও টিপস</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { id: 'photo-resizer', label: 'ছবি ও স্বাক্ষর নিখুঁত সাইজ', desc: 'আবেদনের ছবি সাইজ করার অটোমেটেড টুল', icon: <Camera className="w-4 h-4" />, color: 'bg-rose-50 text-rose-700' },
                      { id: 'resume-guide', label: 'জীবনবৃত্তান্ত / সিভি গাইড', desc: 'প্রফেশনাল সিভি তৈরি করার সঠিক নিয়ম', icon: <FileText className="w-4 h-4" />, color: 'bg-emerald-50 text-emerald-700' },
                      { id: 'cover-letter-tips', label: 'কভার লেটার রাইটিং টিপস', desc: 'নিয়োগকারীদের আকৃষ্ট করার সেরা উপায়', icon: <Bookmark className="w-4 h-4" />, color: 'bg-orange-50 text-orange-700' },
                      { id: 'interview-tips', label: 'ইন্টারভিউ সফলতার টিপস', desc: 'ইন্টারভিউ বোর্ডে জড়তা কাটানোর কৌশল', icon: <Users className="w-4 h-4" />, color: 'bg-indigo-50 text-indigo-700' },
                      { id: 'bangla-converter', label: 'বাংলা লেখা কনভার্টার', desc: 'ইউনিকোড ও বিজয় লেখার কনভার্ট সমাধান', icon: <Send className="w-4 h-4" />, color: 'bg-teal-50 text-teal-700' },
                      { id: 'translation-service', label: 'ইংলিশ টু বাংলা অনুবাদক', desc: 'সহজেই কোনো বাক্য বা প্যারা অনুবাদ করুন', icon: <Globe className="w-4 h-4" />, color: 'bg-sky-50 text-sky-700' },
                    ].map((tool) => (
                      <button
                        key={tool.id}
                        onClick={() => { setView(tool.id as any); setIsMobileMenuOpen(false); }}
                        className="w-full flex items-center justify-between p-3.5 bg-white hover:bg-emerald-50/50 border border-gray-100 rounded-2xl active:scale-95 transition-all text-left cursor-pointer group font-bengali"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className={`w-9 h-9 ${tool.color} rounded-xl flex items-center justify-center shrink-0`}>{tool.icon}</div>
                          <div className="truncate">
                            <p className="font-bold text-xs text-gray-800 leading-tight group-hover:text-emerald-700">{tool.label}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5 truncate">{tool.desc}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-500 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Footer terms */}
                <div className="pt-2 flex flex-wrap justify-center gap-x-4 gap-y-2 text-[11px] font-bold text-gray-400 font-bengali">
                  <button onClick={() => { setView('terms'); setIsMobileMenuOpen(false); }} className="hover:text-emerald-600">শর্তাবলী</button>
                  <span>•</span>
                  <button onClick={() => { setView('privacy'); setIsMobileMenuOpen(false); }} className="hover:text-emerald-600">প্রাইভেসি পলিসি</button>
                  <span>•</span>
                  <span className="text-gray-300">© ২০২৬ {siteSettings.siteName}</span>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      <NoticeTicker notice={siteSettings.noticeText} />

      {view === 'dashboard' && user ? (
        <UserDashboard 
          key={initialDashboardTab}
          user={user} 
          onLogout={handleLogout} 
          onBack={() => { setView('user'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
          onAdmin={() => { setView('admin'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
          initialTab={initialDashboardTab} 
          onCvUpdate={setCv} 
          siteSettings={siteSettings}
          savedJobs={savedJobs}
          onToggleSaveJob={toggleSaveJob}
          showToast={showToast}
        />
      ) : view === 'privacy' ? (
        <CareerGuidePage 
          title="প্রাইভেসি পলিসি (Privacy Policy)"
          onBack={() => setView('user')}
          content={
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <section>
                <h2 className="text-xl font-bold text-emerald-700 mb-3">১. তথ্য সংগ্রহ</h2>
                <p>আমরা আমাদের সেবার মান উন্নয়নের জন্য ব্যবহারকারীর নাম, ইমেইল এবং মোবাইল নম্বর সংগ্রহ করে থাকি। এই তথ্যগুলো শুধুমাত্র আপনার চাকুরির আবেদন প্রক্রিয়া সহজতর করতে ব্যবহৃত হয়।</p>
              </section>
              <section>
                <h2 className="text-xl font-bold text-emerald-700 mb-3">২. তথ্যের সুরক্ষা</h2>
                <p>আপনার ব্যক্তিগত তথ্যের নিরাপত্তা আমাদের কাছে অত্যন্ত গুরুত্বপূর্ণ। আমরা এনক্রিপশন এবং নিরাপদ সার্ভার ব্যবহার করে আপনার তথ্য রক্ষা করি।</p>
              </section>
              <section>
                <h2 className="text-xl font-bold text-emerald-700 mb-3">৩. তথ্যের ব্যবহার</h2>
                <p>আমরা আইনগত বাধ্যবাধকতা ছাড়া আপনার কোনো তথ্য তৃতীয় কারো কাছে হস্তান্তর বা বিক্রি করি না। শুধুমাত্র সরকারি বিধিমোতাবেক কোনো তথ্যের প্রয়োজন হলে তা প্রদান করা হতে পারে।</p>
              </section>
            </div>
          }
        />
      ) : view === 'about' ? (
        <AboutUs siteSettings={siteSettings} setView={setView} />
      ) : view === 'contact' ? (
        <ContactUs siteSettings={siteSettings} setView={setView} showToast={showToast} />
      ) : view === 'more-services' ? (
        <MoreServicesPage setView={setView} handleProtectedView={handleProtectedView} />
      ) : view === 'ai-interview' ? (
        <AIInterviewPractice onBack={() => setView('user')} showToast={showToast} />
      ) : view === 'subject-lessons' ? (
        <SubjectLessons onBack={() => setView('user')} showToast={showToast} />
      ) : view === 'mock-test' ? (
        <MockTest onBack={() => setView('user')} showToast={showToast} />
      ) : view === 'skill-assessment' ? (
        <SkillAssessment onBack={() => setView('user')} showToast={showToast} />
      ) : view === 'translation-service' || view === 'bangla-converter' || view === 'photo-resizer' ? (
        <CareerGuidePage 
          title={view === 'translation-service' ? "ট্রান্সলেশন সেবা" : view === 'bangla-converter' ? "বাংলা লেখা কনভার্টার" : "ছবি ও স্বাক্ষর সাইজ"}
          onBack={() => setView('more-services')}
          content={
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-emerald-200">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                <Settings className="w-10 h-10 text-emerald-500 animate-spin-slow" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">সেবাটি দ্রুতই চালু হচ্ছে</h2>
              <p className="text-gray-500">আমরা আপনাদের জন্য সেরা কোয়ালিটির সেবা নিশ্চিত করতে কাজ করছি।</p>
              <button 
                onClick={() => setView('more-services')}
                className="mt-8 px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold"
              >
                অন্যান্য সেবা দেখুন
              </button>
            </div>
          }
        />
      ) : view === 'interview-tips' ? (
        <InterviewTipsContent onBack={() => setView('user')} showToast={showToast} />
      ) : view === 'resume-guide' ? (
        <ResumeGuideContent onBack={() => setView('user')} showToast={showToast} />
      ) : view === 'cover-letter-tips' ? (
        <CoverLetterTipsContent onBack={() => setView('user')} showToast={showToast} />
      ) : view === 'terms' ? (
        <CareerGuidePage 
          title="শর্তাবলী (Terms & Conditions)"
          onBack={() => setView('user')}
          content={
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <section>
                <h2 className="text-xl font-bold text-emerald-700 mb-3">১. সেবার শর্তাবলী</h2>
                <p>আমাদের ওয়েবসাইট ব্যবহারের মাধ্যমে আপনি আমাদের সকল শর্তাবলীর সাথে একমত পোষণ করছেন। আমরা যেকোনো সময় এই শর্তাবলী পরিবর্তন করার অধিকার রাখি।</p>
              </section>
              <section>
                <h2 className="text-xl font-bold text-emerald-700 mb-3">২. পেমেন্ট ও রিফান্ড পলিসি</h2>
                <p>আমাদের পেইড সেবাগুলোর জন্য নির্ধারিত ফি প্রদান করতে হবে। পেমেন্ট সম্পন্ন হওয়ার পর এবং কাজ শুরু হয়ে গেলে সাধারণত কোনো রিফান্ড প্রদান করা হয় না। তবে টেকনিক্যাল কোনো সমস্যার কারণে সেবা না পেলে আমরা তা সমাধানের চেষ্টা করব।</p>
              </section>
              <section>
                <h2 className="text-xl font-bold text-emerald-700 mb-3">৩. ইউজার অ্যাকাউন্ট</h2>
                <p>আপনার অ্যাকাউন্টের পাসওয়ার্ড এবং তথ্যের গোপনীয়তা রক্ষার দায়িত্ব আপনার। আপনার অ্যাকাউন্ট থেকে কোনো অননুমোদিত কাজ হলে তার জন্য কর্তৃপক্ষ দায়ী থাকবে না।</p>
              </section>
              <section>
                <h2 className="text-xl font-bold text-emerald-700 mb-3">৪. কন্টেন্ট ও কপিরাইট</h2>
                <p>এই ওয়েবসাইটে প্রকাশিত সকল নিয়োগ বিজ্ঞপ্তি এবং কন্টেন্ট আমাদের নিজস্ব অথবা সংগৃহীত। কোনো কন্টেন্ট বাণিজ্যিক উদ্দেশ্যে অনুমতি ছাড়া ব্যবহার করা আইনত দণ্ডনীয়।</p>
              </section>
              <section>
                <h2 className="text-xl font-bold text-emerald-700 mb-3">৫. দায়বদ্ধতা</h2>
                <p>আমরা নিয়োগ বিজ্ঞপ্তির নির্ভুলতা নিশ্চিত করার চেষ্টা করি, তবে কোনো ভুল তথ্যের জন্য বা নিয়োগ প্রক্রিয়ায় কোনো সমস্যার জন্য আমরা সরাসরি দায়ী নই। আবেদনের আগে অবশ্যই মূল সার্কুলারটি যাচাই করে নেবেন।</p>
              </section>
            </div>
          }
        />
      ) : view === 'user' ? (
        <main className="flex-1">
          <header className="relative bg-emerald-950 text-white overflow-hidden">
            <div className="absolute inset-0 z-0">
              <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-900/50 skew-x-12 translate-x-20" />
              <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-600 rounded-full blur-[120px] opacity-20 -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[150px] opacity-10 translate-x-1/3 translate-y-1/3" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="text-left space-y-8">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full text-emerald-400 text-sm font-bold"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>বাংলাদেশের সবচেয়ে বিশ্বস্ত চাকুরীর প্ল্যাটফর্ম</span>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <h2 className="text-4xl md:text-6xl font-black mb-6 text-white leading-[1.1] tracking-tight">
                      {siteSettings.siteName} - এ <span className="text-emerald-400">সহজেই</span> খুঁজুন আপনার স্বপ্নের ক্যারিয়ার
                    </h2>
                    <p className="text-emerald-100/80 text-lg md:text-xl max-w-xl leading-relaxed">
                      চাকরির সকল নির্ভুল বিজ্ঞপ্তি দেখা থেকে শুরু করে ঘরে বসে আবেদন এবং পেমেন্ট করার সবচেয়ে সহজ ও নিরাপদ সমাধান।
                    </p>
                  </motion.div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-emerald-500 transition-colors" />
                      <input 
                        type="text"
                        placeholder="পদবী বা প্রতিষ্ঠান লিখে সার্চ করুন..."
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-gray-900 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 shadow-2xl transition-all font-medium"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                    {[
                      { icon: <Bell className="w-5 h-5" />, title: "চাকরির বিজ্ঞপ্তি", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
                      { icon: <Home className="w-5 h-5" />, title: "ঘরে বসে আবেদন", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
                      { icon: <CreditCard className="w-5 h-5" />, title: "নিরাপদ পেমেন্ট", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" }
                    ].map((feature, i) => (
                      <div key={i} className={`p-4 rounded-2xl border ${feature.color} flex flex-col gap-3 backdrop-blur-sm transition-transform hover:scale-105`}>
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">{feature.icon}</div>
                        <p className="text-sm font-bold text-white">{feature.title}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative hidden lg:block">
                  <div className="relative rounded-3xl overflow-hidden border-8 border-white/10 shadow-3xl transform skew-y-2">
                    <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" alt="Join us" className="w-full h-[450px] object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent" />
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Filters & Job Area - MOVED UP AS REQUESTED */}
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 md:py-20" id="jobs">
             <div className="flex flex-wrap items-center gap-3 mb-12 overflow-x-auto pb-4 scrollbar-hide">
              <div className="flex items-center gap-2 mr-4">
                <div className="w-1.5 h-6 bg-emerald-600 rounded-full" />
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">ফিল্টার করুন</span>
              </div>
              {(['সব', 'সরকারি', 'বেসরকারি', 'ব্যাংক', 'এনজিও'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-7 py-3 rounded-2xl text-sm font-bold transition-all border-2 whitespace-nowrap",
                    selectedCategory === cat ? "bg-emerald-600 border-emerald-600 text-white shadow-xl shadow-emerald-100" : "bg-white border-gray-100 text-gray-500 hover:border-emerald-600 hover:text-emerald-600"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-64 bg-gray-50 rounded-3xl animate-pulse" />
                ))
              ) : paginatedJobs.length > 0 ? (
                  paginatedJobs.map(job => renderJobCard(job))
                ) : (
                  <div className="col-span-full py-20 text-center">
                    <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900">দুঃখিত, কোনো চাকরি পাওয়া যায়নি</h4>
                    <p className="text-gray-500">অন্য কোনো কি-ওয়ার্ড দিয়ে চেষ্টা করুন।</p>
                  </div>
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-16">
                <button
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage(prev => Math.max(1, prev - 1));
                    document.getElementById('jobs')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={cn(
                    "p-3 rounded-xl border-2 transition-all",
                    currentPage === 1 ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed" : "bg-white border-gray-100 text-gray-600 hover:border-emerald-600 hover:text-emerald-600 hover:shadow-lg"
                  )}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setCurrentPage(i + 1);
                        document.getElementById('jobs')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={cn(
                        "w-12 h-12 rounded-xl text-sm font-bold transition-all border-2",
                        currentPage === i + 1 ? "bg-emerald-600 border-emerald-600 text-white shadow-xl shadow-emerald-100" : "bg-white border-gray-100 text-gray-500 hover:border-emerald-600 hover:text-emerald-600"
                      )}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage(prev => Math.min(totalPages, prev + 1));
                    document.getElementById('jobs')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={cn(
                    "p-3 rounded-xl border-2 transition-all",
                    currentPage === totalPages ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed" : "bg-white border-gray-100 text-gray-600 hover:border-emerald-600 hover:text-emerald-600 hover:shadow-lg"
                  )}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* New Sections based on Images - MOVED BELOW JOBS */}
          
          {/* 2. একবার প্রোফাইল, আজীবন সুবিধা */}
          <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="space-y-8"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-8 bg-emerald-600 rounded-full" />
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight text-left">একবার প্রোফাইল, আজীবন সুবিধা</h2>
                  </div>
                  
                  <p className="text-lg text-gray-500 leading-relaxed text-left font-medium">
                    আমাদের উন্নত প্রোফাইল ম্যানেজমেন্ট সিস্টেমে ইউজারের সকল প্রয়োজনীয় তথ্য (ছবি, স্বাক্ষর, সার্টিফিকেট, এনআইডি) একবারই আপলোড করে রাখা যায়।
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                      { title: "ঝামেলামুক্ত", desc: "বারবার তথ্য এন্ট্রি করার প্রয়োজনে নেই।" },
                      { title: "সহজ এক্সেস", desc: "যেকোনো ডিভাইস থেকে এক্সেস করুন।" },
                      { title: "১০০% নির্ভুল", desc: "আবেদনের ভুল হওয়ার সম্ভাবনা নেই।" },
                      { title: "দ্রুত আবেদন", desc: "১-ক্লিকে যেকোনো চাকরির আবেদন।" }
                    ].map((item, i) => (
                      <div key={i} className="p-5 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-emerald-500 transition-colors">
                        <div className="flex items-center gap-3 mb-2">
                          <Check className="w-5 h-5 text-emerald-600" />
                          <h4 className="font-bold text-gray-900">{item.title}</h4>
                        </div>
                        <p className="text-xs text-gray-500 font-medium">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="absolute -inset-4 bg-emerald-500/10 rounded-[3rem] blur-3xl" />
                  <img 
                    src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop" 
                    alt="Profile Management" 
                    className="relative w-full h-[450px] object-cover rounded-[3rem] shadow-2xl border-8 border-white"
                  />
                </motion.div>
              </div>
            </div>
          </section>

          {/* 3. সমসা বনাম আমাদের সমাধান */}
          <section className="py-24 bg-emerald-950 text-white">
            <div className="max-w-7xl mx-auto px-4 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-black tracking-tight"><span className="text-emerald-400">সমস্যা</span> বনাম আমাদের <span className="text-emerald-400">সমাধান</span></h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-sm">
                  <h3 className="text-2xl font-black text-amber-400 mb-8 flex items-center gap-3 text-left">
                    <X className="w-6 h-6" /> বিদ্যমান সমস্যা
                  </h3>
                  <ul className="space-y-6">
                    {[
                      "প্রতিটি আবেদনে বারবার তথ্য পূরণ করার ঝামেলা।",
                      "নির্ভুলতার অভাবে ফরম বাতিল হওয়ার ভয়।",
                      "প্রস্তুতির জন্য গোছানো মেটেরিয়াল ও সময়ের অভাব।",
                      "নিরাপদ পেমেন্ট গেটওয়ের অভাব।"
                    ].map((item, i) => (
                      <li key={i} className="flex gap-4 items-start text-left">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                        <span className="text-emerald-100/70 font-bold">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-emerald-600 p-10 rounded-[2.5rem] shadow-2xl shadow-emerald-500/20 relative overflow-hidden group">
                  <Sparkles className="absolute -top-6 -right-6 w-32 h-32 text-white/10 group-hover:rotate-12 transition-transform" />
                  <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3 text-left">
                    <Check className="w-6 h-6" /> চাকরি সেবা সমাধান
                  </h3>
                  <ul className="space-y-6">
                    {[
                      "একবার প্রোফাইল করলেই আজীবন ১-ক্লিকে আবেদন।",
                      "স্মার্ট প্রযুক্তির মাধ্যমে ১০০% নির্ভুল ফরম প্রসেসিং।",
                      "অটো আবেদন, ঘরে ফোনেই হবে ফ্রী।",
                      "সার্টিফাইড মেন্টর ও পরীক্ষার প্রস্তুতি কোর্স।"
                    ].map((item, i) => (
                      <li key={i} className="flex gap-4 items-start text-left">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                        <span className="text-white font-black">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* 4. মাইলফলক */}
          <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div className="relative group">
                   <div className="absolute -inset-10 bg-emerald-50 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
                   <div className="relative flex flex-col items-center lg:items-start">
                    <span className="text-[120px] md:text-[200px] font-black leading-none text-emerald-950 tracking-tighter mix-blend-multiply italic">৯৯%</span>
                    <div className="bg-amber-400 px-8 py-3 rounded-2xl -mt-6 lg:-ml-6 shadow-xl transform skew-x-[-10deg]">
                      <span className="text-xl md:text-2xl font-black text-emerald-950">আবেদনের নির্ভুলতা</span>
                    </div>
                   </div>
                </div>

                <div className="text-left space-y-10">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-10 bg-emerald-600 rounded-full" />
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">আস্থার নাম চাকরি সেবা</h2>
                  </div>
                  
                  <p className="text-xl text-gray-500 font-medium leading-relaxed">
                    আমরা প্রতিটি চাকরিপ্রার্থীর বিশ্বস্ত সারথী। আমাদের মাধ্যমে হাজার হাজার ইউজার সফলতার সাথে তাদের আবেদন সম্পন্ন করেছেন।
                  </p>

                  <div className="grid grid-cols-2 gap-10">
                    <div>
                      <h3 className="text-5xl font-black text-emerald-600 mb-2">১০কে+</h3>
                      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">সফল আবেদন</p>
                    </div>
                    <div>
                      <h3 className="text-5xl font-black text-emerald-600 mb-2">৫কে+</h3>
                      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">সন্তুষ্ট ইউজার</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      ) : null}

      {/* Shared Modals & Extras */}
      <HowItWorksAndFAQ />
      <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                {siteSettings.logoUrl ? (
                  <img src={siteSettings.logoUrl} alt={siteSettings.siteName} className="h-10 object-contain" referrerPolicy="no-referrer" />
                ) : (
                  <div className="bg-emerald-600 p-2 rounded-lg">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                )}
                {!siteSettings.logoUrl && <h1 className="text-xl font-bold text-emerald-800">{siteSettings.siteName || 'চাকরি সেবা'}</h1>}
              </div>
              <p className="text-gray-500 text-sm max-w-md leading-relaxed">
                {siteSettings.aboutText || 'আমরা বাংলাদেশের অন্যতম প্রধান চাকরি সেবা প্ল্যাটফর্ম। আমাদের লক্ষ্য হলো চাকরিপ্রার্থী এবং নিয়োগকর্তাদের মধ্যে একটি সেতুবন্ধন তৈরি করা।'}
              </p>
              
              <div className="flex items-center gap-4 mt-8">
                {siteSettings.facebookLink && (
                  <a href={siteSettings.facebookLink} target="_blank" rel="noopener noreferrer" className="bg-blue-50 p-2 rounded-lg text-blue-600 hover:bg-blue-100 transition-all" title="Facebook">
                    <Facebook className="w-5 h-5" />
                  </a>
                )}
                {siteSettings.whatsappNumber && (
                  <a href={`https://wa.me/${siteSettings.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="bg-emerald-50 p-2 rounded-lg text-emerald-600 hover:bg-emerald-100 transition-all" title="WhatsApp">
                    <MessageCircle className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 mb-6">ক্যারিয়ার গাইড</h4>
              <ul className="space-y-4">
                <li><button onClick={() => { setView('interview-tips'); window.scrollTo(0, 0); }} className="text-gray-500 hover:text-emerald-600 transition-colors text-sm">ইন্টারভিউ টিপস</button></li>
                <li><button onClick={() => { setView('resume-guide'); window.scrollTo(0, 0); }} className="text-gray-500 hover:text-emerald-600 transition-colors text-sm">জীবন বৃত্তান্ত / সিভি গাইড</button></li>
                <li><button onClick={() => { setView('cover-letter-tips'); window.scrollTo(0, 0); }} className="text-gray-500 hover:text-emerald-600 transition-colors text-sm">কভার লেটার টিপস</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 mb-6">দ্রুত লিঙ্ক</h4>
              <ul className="space-y-4">
                <li><button onClick={() => { setView('user'); setSelectedCategory('সব'); window.scrollTo(0, 0); }} className="text-gray-500 hover:text-emerald-600 transition-colors text-sm">হোম</button></li>
                <li><button onClick={() => { setView('about'); window.scrollTo(0, 0); }} className="text-gray-500 hover:text-emerald-600 transition-colors text-sm">আমাদের সম্পর্কে</button></li>
                <li><button onClick={() => { setView('contact'); window.scrollTo(0, 0); }} className="text-gray-500 hover:text-emerald-600 transition-colors text-sm">যোগাযোগ</button></li>
                <li><button onClick={() => { setView('dashboard'); window.scrollTo(0, 0); }} className="text-gray-500 hover:text-emerald-600 transition-colors text-sm">ড্যাশবোর্ড</button></li>
                <li><button onClick={() => setIsLoginModalOpen(true)} className="text-gray-500 hover:text-emerald-600 transition-colors text-sm">লগইন</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 mb-6">যোগাযোগ</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm text-gray-500">
                  <MapPin className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{siteSettings.contactAddress}</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-500">
                  <Phone className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{siteSettings.contactPhone || siteSettings.whatsappNumber}</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-500">
                  <Globe className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{siteSettings.contactEmail || 'support@jobportal.com'}</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-xs">
              {siteSettings.footerText || `© ${new Date().getFullYear()} ${siteSettings.siteName}. All rights reserved.`}
            </p>
            <div className="flex items-center gap-6">
              <button onClick={() => { setView('privacy'); window.scrollTo(0, 0); }} className="text-gray-400 hover:text-emerald-600 text-xs transition-colors">প্রাইভেসি পলিসি</button>
              <button onClick={() => { setView('terms'); window.scrollTo(0, 0); }} className="text-gray-400 hover:text-emerald-600 text-xs transition-colors">শর্তাবলী</button>
            </div>
          </div>
        </div>
      </footer>

      {/* Job Details Modal */}
      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedJob(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  {selectedJob.companyLogoUrl ? (
                    <img 
                      src={selectedJob.companyLogoUrl} 
                      alt={selectedJob.company} 
                      className="w-12 h-12 rounded-xl object-contain bg-gray-50 p-1 border border-gray-100"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="bg-emerald-100 p-2 rounded-xl">
                      <Briefcase className="w-6 h-6 text-emerald-600" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-lg leading-tight">{selectedJob.title}</h3>
                    <p className="text-sm text-gray-500">{selectedJob.company}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleShare}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                    title="শেয়ার করুন"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setSelectedJob(null)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div ref={jobDetailsRef} className="p-8 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">ক্যাটাগরি</p>
                    <p className="font-bold text-emerald-700">{selectedJob.category}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">আবেদনের শেষ তারিখ</p>
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-red-600">{formatDateBn(selectedJob.deadline)}</p>
                      {getRemainingDaysBn(selectedJob.deadline) && (
                        <span className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded-md",
                          getRemainingDaysBn(selectedJob.deadline) === 'সময় শেষ' ? "bg-red-100 text-red-700" :
                          getRemainingDaysBn(selectedJob.deadline) === 'আজ শেষ দিন' ? "bg-orange-100 text-orange-700" :
                          "bg-emerald-100 text-emerald-700"
                        )}>
                          {getRemainingDaysBn(selectedJob.deadline)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">অবস্থান</p>
                    <p className="font-bold">{selectedJob.location}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">বেতন</p>
                    <p className="font-bold">{selectedJob.salary || 'আলোচনা সাপেক্ষে'}</p>
                  </div>
                  {selectedJob.applicationFee && (
                    <div className="bg-gray-50 p-4 rounded-2xl">
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">আবেদন ফি</p>
                      <p className="font-bold text-emerald-700">৳{selectedJob.applicationFee}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  {selectedJob.positions && selectedJob.positions.length > 0 && (
                    <section>
                      <h5 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <LayoutDashboard className="w-5 h-5 text-emerald-600" />
                        পদের তালিকা ও শূন্যপদ
                      </h5>
                      <div className="overflow-hidden border border-gray-100 rounded-2xl">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="px-4 py-3 text-[10px] font-bold uppercase text-gray-400">পদের নাম</th>
                              <th className="px-4 py-3 text-[10px] font-bold uppercase text-gray-400">পদ সংখ্যা</th>
                              <th className="px-4 py-3 text-[10px] font-bold uppercase text-gray-400">গ্রেড/স্কেল</th>
                              <th className="px-4 py-3 text-[10px] font-bold uppercase text-gray-400">ফি</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {selectedJob.positions.map((pos, i) => (
                              <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-4 py-3 text-sm font-bold text-gray-700">{pos.name}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{pos.vacancy}</td>
                                <td className="px-4 py-3 text-sm text-gray-500">{pos.grade || '-'}</td>
                                <td className="px-4 py-3 text-sm text-emerald-600 font-bold">{pos.applicationFee ? `৳${pos.applicationFee}` : '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </section>
                  )}

                  <section>
                    <h5 className="font-bold text-gray-900 mb-3">কাজের বিবরণ</h5>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {selectedJob.description}
                    </p>
                  </section>

                  <section>
                    <h5 className="font-bold text-gray-900 mb-3">প্রয়োজনীয় যোগ্যতা</h5>
                    <ul className="space-y-2">
                      {selectedJob.requirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </section>

                  {selectedJob.circularImageUrl && (
                    <section className="pt-4">
                      <h5 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        নিয়োগ বিজ্ঞপ্তি (ইমেজ/পিডিএফ)
                      </h5>
                      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                        {selectedJob.circularImageUrl.startsWith('data:image') || selectedJob.circularImageUrl.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                          <div className="space-y-4">
                            <img 
                              src={selectedJob.circularImageUrl} 
                              alt="Job Circular" 
                              className="w-full rounded-xl shadow-sm border border-gray-200"
                              referrerPolicy="no-referrer"
                            />
                            <button 
                              onClick={() => openCircular(selectedJob.circularImageUrl)}
                              className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all"
                            >
                              পূর্ণাঙ্গ বিজ্ঞপ্তি বড় করে দেখুন
                            </button>
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-sm text-gray-500 mb-4">
                              {selectedJob.circularImageUrl.startsWith('data:application/pdf') || selectedJob.circularImageUrl.match(/\.pdf$/i) 
                                ? 'বিজ্ঞপ্তিটি পিডিএফ ফরম্যাটে রয়েছে।' 
                                : 'বিজ্ঞপ্তিটি অন্য ফরম্যাটে রয়েছে।'}
                            </p>
                            <button 
                              onClick={() => openCircular(selectedJob.circularImageUrl)}
                              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all"
                            >
                              বিজ্ঞপ্তিটি ডাউনলোড/ওপেন করুন
                            </button>
                          </div>
                        )}
                      </div>
                    </section>
                  )}

                  <section className="pt-8 border-t border-gray-100">
                    <h5 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-emerald-600" />
                      প্রশ্ন ও মন্তব্য ({comments.length})
                    </h5>

                    <div className="space-y-6">
                      <div className="bg-gray-50 rounded-2xl p-4">
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="এই জব সম্পর্কে কোনো প্রশ্ন বা মন্তব্য থাকলে এখানে লিখুন..."
                          className="w-full bg-transparent border-0 focus:ring-0 text-sm resize-none h-20"
                        />
                        <div className="flex justify-end mt-2">
                          <button
                            onClick={handlePostComment}
                            disabled={isPostingComment || !newComment.trim()}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all disabled:opacity-50"
                          >
                            {isPostingComment ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                            কমেন্ট করুন
                          </button>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {comments.map((comment) => (
                          <div key={comment.id} className="space-y-4">
                            <div className="flex gap-3">
                              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                <span className="text-[10px] font-bold text-emerald-700">{comment.userName[0]}</span>
                              </div>
                              <div className="flex-1">
                                <div className="bg-gray-50 rounded-2xl p-4">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-bold text-gray-900">{comment.userName}</span>
                                    <span className="text-[10px] text-gray-400">{new Date(comment.createdAt).toLocaleDateString('bn-BD')}</span>
                                  </div>
                                  <p className="text-sm text-gray-700">{comment.text}</p>
                                </div>

                                <div className="ml-4 mt-4 space-y-4 border-l-2 border-gray-100 pl-4">
                                  {comment.replies.map((reply) => (
                                    <div key={reply.id} className="flex gap-3">
                                      <div className={cn(
                                        "w-6 h-6 rounded-full flex items-center justify-center shrink-0",
                                        reply.isAdmin ? "bg-amber-100" : "bg-gray-100"
                                      )}>
                                        <span className={cn(
                                          "text-[8px] font-bold",
                                          reply.isAdmin ? "text-amber-700" : "text-gray-500"
                                        )}>{reply.userName[0]}</span>
                                      </div>
                                      <div className={cn(
                                        "flex-1 p-3 rounded-2xl text-sm",
                                        reply.isAdmin ? "bg-amber-50" : "bg-gray-50"
                                      )}>
                                        <div className="flex justify-between items-center mb-1">
                                          <span className={cn(
                                            "text-[10px] font-bold",
                                            reply.isAdmin ? "text-amber-700" : "text-gray-900"
                                          )}>
                                            {reply.userName} {reply.isAdmin && <span className="bg-amber-200 text-amber-800 px-1 rounded text-[8px] ml-1">এডমিন</span>}
                                          </span>
                                          <span className="text-[8px] text-gray-400">{new Date(reply.createdAt).toLocaleDateString('bn-BD')}</span>
                                        </div>
                                        <p className="text-xs text-gray-700">{reply.text}</p>
                                      </div>
                                    </div>
                                  ))}

                                  {user?.role === 'admin' && (
                                    <div className="flex gap-2 mt-2">
                                      <input
                                        type="text"
                                        value={replyText[comment.id] || ''}
                                        onChange={(e) => setReplyText({ ...replyText, [comment.id]: e.target.value })}
                                        placeholder="উত্তর দিন..."
                                        className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-emerald-400 outline-none"
                                      />
                                      <button
                                        onClick={() => handlePostReply(comment.id)}
                                        disabled={!replyText[comment.id]?.trim()}
                                        className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all disabled:opacity-50"
                                      >
                                        <Send className="w-3 h-3" />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>

                  <section className="pt-8 border-t border-gray-100">
                    <h5 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-emerald-600" />
                      প্রশ্ন ও মন্তব্য ({comments.length})
                    </h5>

                    <div className="space-y-6">
                      <div className="bg-gray-50 rounded-2xl p-4">
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="এই জব সম্পর্কে কোনো প্রশ্ন বা মন্তব্য থাকলে এখানে লিখুন..."
                          className="w-full bg-transparent border-0 focus:ring-0 text-sm resize-none h-20"
                        />
                        <div className="flex justify-end mt-2">
                          <button
                            onClick={handlePostComment}
                            disabled={isPostingComment || !newComment.trim()}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all disabled:opacity-50"
                          >
                            {isPostingComment ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                            কমেন্ট করুন
                          </button>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {comments.map((comment) => (
                          <div key={comment.id} className="space-y-4">
                            <div className="flex gap-3">
                              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                <span className="text-[10px] font-bold text-emerald-700">{comment.userName[0]}</span>
                              </div>
                              <div className="flex-1">
                                <div className="bg-gray-50 rounded-2xl p-4">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-bold text-gray-900">{comment.userName}</span>
                                    <span className="text-[10px] text-gray-400">{new Date(comment.createdAt).toLocaleDateString('bn-BD')}</span>
                                  </div>
                                  <p className="text-sm text-gray-700">{comment.text}</p>
                                </div>

                                <div className="ml-4 mt-4 space-y-4 border-l-2 border-gray-100 pl-4">
                                  {comment.replies.map((reply) => (
                                    <div key={reply.id} className="flex gap-3">
                                      <div className={cn(
                                        "w-6 h-6 rounded-full flex items-center justify-center shrink-0",
                                        reply.isAdmin ? "bg-amber-100" : "bg-gray-100"
                                      )}>
                                        <span className={cn(
                                          "text-[8px] font-bold",
                                          reply.isAdmin ? "text-amber-700" : "text-gray-500"
                                        )}>{reply.userName[0]}</span>
                                      </div>
                                      <div className={cn(
                                        "flex-1 p-3 rounded-2xl text-sm",
                                        reply.isAdmin ? "bg-amber-50" : "bg-gray-50"
                                      )}>
                                        <div className="flex justify-between items-center mb-1">
                                          <span className={cn(
                                            "text-[10px] font-bold",
                                            reply.isAdmin ? "text-amber-700" : "text-gray-900"
                                          )}>
                                            {reply.userName} {reply.isAdmin && <span className="bg-amber-200 text-amber-800 px-1 rounded text-[8px] ml-1">এডমিন</span>}
                                          </span>
                                          <span className="text-[8px] text-gray-400">{new Date(reply.createdAt).toLocaleDateString('bn-BD')}</span>
                                        </div>
                                        <p className="text-xs text-gray-700">{reply.text}</p>
                                      </div>
                                    </div>
                                  ))}

                                  {user?.role === 'admin' && (
                                    <div className="flex gap-2 mt-2">
                                      <input
                                        type="text"
                                        value={replyText[comment.id] || ''}
                                        onChange={(e) => setReplyText({ ...replyText, [comment.id]: e.target.value })}
                                        placeholder="উত্তর দিন..."
                                        className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-emerald-400 outline-none"
                                      />
                                      <button
                                        onClick={() => handlePostReply(comment.id)}
                                        disabled={!replyText[comment.id]?.trim()}
                                        className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all disabled:opacity-50"
                                      >
                                        <Send className="w-3 h-3" />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>

                  {relatedJobs.length > 0 && (
                    <section className="pt-8 border-t border-gray-100">
                      <h5 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-emerald-600" />
                        সম্পর্কিত অন্যান্য চাকরি
                      </h5>
                      <div className="grid grid-cols-1 gap-4">
                        {relatedJobs.map((job) => (
                          <motion.div
                            key={job.id}
                            whileHover={{ x: 4 }}
                            onClick={() => setSelectedJob(job)}
                            className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 cursor-pointer hover:bg-emerald-50 hover:border-emerald-100 transition-all group"
                          >
                            {job.companyLogoUrl ? (
                              <img 
                                src={job.companyLogoUrl} 
                                alt={job.company} 
                                className="w-12 h-12 rounded-xl object-contain bg-white p-1 border border-gray-100"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center border border-gray-100">
                                <Building2 className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h6 className="font-bold text-sm text-gray-900 truncate group-hover:text-emerald-700 transition-colors">
                                {job.title}
                              </h6>
                              <p className="text-xs text-gray-500 truncate">{job.company}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-[10px] font-bold text-red-500 mb-1">
                                {formatDateBn(job.deadline)}
                              </p>
                              <ChevronRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-emerald-500 transition-colors" />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-4">
                <button 
                  onClick={handleApplyClick}
                  disabled={selectedJob && getRemainingDaysBn(selectedJob.deadline) === 'সময় শেষ'}
                  className={cn(
                    "flex-1 py-4 rounded-2xl font-bold transition-all",
                    selectedJob && getRemainingDaysBn(selectedJob.deadline) === 'সময় শেষ'
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200"
                  )}
                >
                  {selectedJob && getRemainingDaysBn(selectedJob.deadline) === 'সময় শেষ' ? 'আবেদনের সময় শেষ' : 'আবেদন করতে অর্ডার করুন'}
                </button>
                <button 
                  onClick={() => handleToggleSaveJob(selectedJob.id)}
                  className={cn(
                    "px-6 py-4 rounded-2xl border font-bold transition-all",
                    savedJobs.some(j => j.id === selectedJob.id) 
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100" 
                      : "border-gray-200 hover:bg-white"
                  )}
                >
                  {savedJobs.some(j => j.id === selectedJob.id) ? 'সেভ করা হয়েছে' : 'সেভ করুন'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Deadline Toast Notification */}
      <AnimatePresence>
        {showDeadlineToast && approachingJobs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-6 left-1/2 z-50 bg-white rounded-2xl shadow-2xl border border-red-100 p-4 flex items-center gap-4 cursor-pointer"
            onClick={() => {
              setShowDeadlineToast(false);
              setIsNotificationsOpen(true);
            }}
          >
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Bell className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="font-bold text-gray-900">সতর্কতা!</p>
              <p className="text-sm text-gray-600">
                আপনার সেভ করা <span className="font-bold text-red-600">{approachingJobs.length}টি</span> চাকরির আবেদনের শেষ তারিখ ঘনিয়ে এসেছে।
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <button 
                onClick={() => setIsLoginModalOpen(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
              
              <div className="p-8 overflow-y-auto">
                {loginModalMessage && (
                  <div className="mb-6 p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-center gap-3 text-amber-800">
                    <Sparkles className="w-5 h-5 shrink-0" />
                    <p className="text-sm font-bold">{loginModalMessage}</p>
                  </div>
                )}
                {isForgotPassword ? (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <div className="bg-amber-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Bell className="w-8 h-8 text-amber-600" />
                      </div>
                      <h3 className="text-2xl font-bold">পাসওয়ার্ড পুনরুদ্ধার</h3>
                      <p className="text-gray-500 text-sm mt-2">
                        {forgotResult ? 'আপনার তথ্য সফলভাবে উদ্ধার করা হয়েছে' : forgotQuestion ? 'সিকিউরিটি প্রশ্নের উত্তর দিন' : 'আপনার মোবাইল নাম্বারটি দিন'}
                      </p>
                    </div>

                    {!forgotQuestion && !forgotResult ? (
                      <form onSubmit={handleForgotPassword} className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase">মোবাইল নাম্বার <span className="text-red-500">*</span></label>
                          <input 
                            type="tel"
                            required
                            maxLength={11}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                            placeholder="০১XXXXXXXXX"
                            value={forgotMobile}
                            onChange={(e) => setForgotMobile(e.target.value)}
                          />
                        </div>
                        {loginError && <p className="text-red-500 text-xs font-medium text-center">{loginError}</p>}
                        <button 
                          type="submit" 
                          disabled={isAuthLoading}
                          className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 mt-4 flex items-center justify-center gap-2"
                        >
                          {isAuthLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                          এগিয়ে যান
                        </button>
                      </form>
                    ) : forgotQuestion && !forgotResult ? (
                      <form onSubmit={handleVerifyAnswer} className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-4">
                          <p className="text-xs font-bold text-gray-400 uppercase mb-1">আপনার সিকিউরিটি প্রশ্ন:</p>
                          <p className="text-sm font-medium text-gray-700">{forgotQuestion}</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase">আপনার উত্তর <span className="text-red-500">*</span></label>
                          <input 
                            type="text"
                            required
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                            placeholder="উত্তর লিখুন"
                            value={forgotAnswer}
                            onChange={(e) => setForgotAnswer(e.target.value)}
                          />
                        </div>
                        {loginError && <p className="text-red-500 text-xs font-medium text-center">{loginError}</p>}
                        <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 mt-4">যাচাই করুন</button>
                      </form>
                    ) : (
                      <div className="space-y-4">
                        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 space-y-4">
                          <div>
                            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">ইউজারনেম</p>
                            <p className="text-lg font-mono font-bold text-emerald-900">{forgotResult?.username}</p>
                          </div>
                          <div className="pt-4 border-t border-emerald-100">
                            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">পাসওয়ার্ড</p>
                            <p className="text-lg font-mono font-bold text-emerald-900">{forgotResult?.password}</p>
                          </div>
                        </div>
                        <p className="text-center text-xs text-gray-500 italic">নিরাপত্তার স্বার্থে এই তথ্যটি কোথাও লিখে রাখুন এবং কাউকে জানাবেন না।</p>
                      </div>
                    )}

                    <button 
                      onClick={() => {
                        setIsForgotPassword(false);
                        setForgotQuestion('');
                        setForgotAnswer('');
                        setForgotResult(null);
                        setLoginError('');
                        setForgotMessage('');
                      }}
                      className="w-full text-gray-500 text-sm font-medium hover:text-emerald-600 transition-colors pt-4"
                    >
                      লগইন পেজে ফিরে যান
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="text-center mb-8">
                      <div className="bg-emerald-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <UserIcon className="w-8 h-8 text-emerald-600" />
                      </div>
                      <h3 className="text-2xl font-bold">{authMode === 'login' ? 'লগইন করুন' : 'অ্যাকাউন্ট তৈরি করুন'}</h3>
                      <p className="text-gray-500 text-sm mt-2">
                        {authMode === 'login' ? 'আপনার একাউন্টে প্রবেশ করতে তথ্য দিন' : 'নতুন একাউন্ট তৈরি করতে নিচের তথ্যগুলো দিন'}
                      </p>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-4">
                      {authMode === 'register' && (
                        <>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase">পূর্ণ নাম <span className="text-red-500">*</span></label>
                            <input 
                              type="text"
                              required
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                              placeholder="আপনার পূর্ণ নাম"
                              value={loginCredentials.fullName}
                              onChange={(e) => handleFullNameChange(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase">মোবাইল নাম্বার <span className="text-red-500">*</span></label>
                            <input 
                              type="tel"
                              required
                              maxLength={11}
                              className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 ${loginError === 'আপনার ১১ ডিজিটের মোবাইল নাম্বারটির শুরুতে 01 লিখুন' ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-100'}`}
                              placeholder="০১XXXXXXXXX"
                              value={loginCredentials.mobile}
                              onChange={(e) => setLoginCredentials({...loginCredentials, mobile: e.target.value})}
                            />
                            {loginError === 'আপনার ১১ ডিজিটের মোবাইল নাম্বারটির শুরুতে 01 লিখুন' && (
                              <p className="text-red-500 text-[10px] font-medium mt-1">{loginError}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase">সিকিউরিটি প্রশ্ন <span className="text-red-500">*</span></label>
                            <select 
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm"
                              value={loginCredentials.securityQuestion}
                              onChange={(e) => setLoginCredentials({...loginCredentials, securityQuestion: e.target.value})}
                            >
                              {SECURITY_QUESTIONS.map(q => <option key={q} value={q}>{q}</option>)}
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase">আপনার উত্তর <span className="text-red-500">*</span></label>
                            <input 
                              type="text"
                              required
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                              placeholder="পাসওয়ার্ড ভুলে গেলে এটি লাগবে"
                              value={loginCredentials.securityAnswer}
                              onChange={(e) => setLoginCredentials({...loginCredentials, securityAnswer: e.target.value})}
                            />
                          </div>
                        </>
                      )}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">ইউজারনেম {authMode === 'register' ? '(অটো জেনারেটেড)' : ''} <span className="text-red-500">*</span></label>
                        <input 
                          type="text"
                          required
                          readOnly={authMode === 'register'}
                          className={`w-full px-4 py-3 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 ${authMode === 'register' ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-50'}`}
                          placeholder={authMode === 'register' ? "নাম লিখলে অটো তৈরি হবে" : "আপনার ইউজারনেম"}
                          value={loginCredentials.username}
                          onChange={(e) => setLoginCredentials({...loginCredentials, username: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-bold text-gray-400 uppercase">পাসওয়ার্ড <span className="text-red-500">*</span></label>
                          {authMode === 'login' && (
                            <button 
                              type="button"
                              onClick={() => setIsForgotPassword(true)}
                              className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 uppercase tracking-wider"
                            >
                              পাসওয়ার্ড ভুলে গেছেন?
                            </button>
                          )}
                        </div>
                        <div className="relative">
                          <input 
                            type={showPassword ? "text" : "password"}
                            required
                            className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                            placeholder="••••••••"
                            value={loginCredentials.password}
                            onChange={(e) => setLoginCredentials({...loginCredentials, password: e.target.value})}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-500 transition-colors p-1"
                            title={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      {loginError && loginError !== 'আপনার ১১ ডিজিটের মোবাইল নাম্বারটির শুরুতে 01 লিখুন' && (
                        <div className="space-y-2">
                          <p className="text-red-500 text-xs font-medium text-center">{loginError}</p>
                          {loginError.includes('ইতিমধ্যে রেজিস্ট্রেশন করা হয়েছে') && (
                            <button 
                              type="button"
                              onClick={() => {
                                setIsForgotPassword(true);
                                setForgotMobile(loginCredentials.mobile);
                                setLoginError('');
                              }}
                              className="w-full text-emerald-600 text-xs font-bold hover:underline"
                            >
                              পাসওয়ার্ড ভুলে গেছেন? এখান থেকে উদ্ধার করুন
                            </button>
                          )}
                        </div>
                      )}

                      <button 
                        type="submit"
                        className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 mt-4"
                      >
                        {authMode === 'login' ? 'লগইন' : 'রেজিস্ট্রেশন'}
                      </button>
                    </form>

                    <div className="mt-8 text-center">
                      <button 
                        onClick={() => {
                          setAuthMode(authMode === 'login' ? 'register' : 'login');
                          setLoginError('');
                        }}
                        className="text-emerald-600 text-sm font-bold hover:underline"
                      >
                        {authMode === 'login' ? 'নতুন একাউন্ট তৈরি করতে চান? সাইন আপ করুন' : 'ইতিমধ্যে একাউন্ট আছে? লগইন করুন'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">আপনি কি নিশ্চিত?</h3>
              <p className="text-gray-500 mb-8">
                {deleteConfirm.type === 'user' ? 'এই ইউজারকে মুছে ফেললে তা আর ফেরত পাওয়া যাবে না।' : 'এই বিজ্ঞপ্তিটি মুছে ফেললে তা আর ফেরত পাওয়া যাবে না।'}
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-6 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  বাতিল করুন
                </button>
                <button 
                  onClick={() => deleteConfirm.type === 'user' ? handleDeleteUser(deleteConfirm.id) : handleDeleteJob(deleteConfirm.id)}
                  className="flex-1 px-6 py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
                >
                  হ্যাঁ, মুছে ফেলুন
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Order Modal */}
      <AnimatePresence>
        {isOrderModalOpen && selectedJob && (
          <OrderModal 
            job={selectedJob} 
            onClose={() => {
              setIsOrderModalOpen(false);
              setLastOrderInfo(null);
              setSelectedJob(null);
              setOrderMessage(null);
            }} 
            onConfirm={(transactionId, selectedPost, paymentMethod) => {
              handleOrderSubmit(transactionId, selectedPost, paymentMethod);
            }}
            isOrdering={isOrdering}
            siteSettings={siteSettings}
            orderSuccessData={lastOrderInfo}
            orderMessage={orderMessage}
          />
        )}
        {showProfilePrompt && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl text-center relative overflow-hidden"
            >
              {/* Decorative background elements */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-50 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-50 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-3 shadow-inner">
                  <UserIcon className="w-10 h-10" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">আপনার প্রোফাইল কি অসম্পূর্ণ?</h3>
                
                <p className="text-gray-600 mb-10 leading-relaxed">
                  চাকরিতে আবেদনের অভিজ্ঞতা আরও সহজ করতে আপনার প্রোফাইল এবং সিভি সম্পূর্ণ করুন। একটি পূর্ণাঙ্গ প্রোফাইল আপনার আবেদনের গ্রহণযোগ্যতা বাড়িয়ে দেয়।
                </p>
                
                <div className="flex flex-col gap-4">
                  <button 
                    onClick={() => {
                      setShowProfilePrompt(false);
                      setView('dashboard');
                      setInitialDashboardTab('profile');
                    }}
                    className="w-full py-4 rounded-2xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 group"
                  >
                    প্রোফাইল আপডেট করুন
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  
                  <button 
                    onClick={() => setShowProfilePrompt(false)}
                    className="w-full py-4 rounded-2xl bg-gray-50 text-gray-500 font-bold hover:bg-gray-100 transition-all"
                  >
                    পরে করব
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
        {showCvModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[110] p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
              <h2 className="text-xl font-bold mb-4">সিভি তৈরি করুন</h2>
              <p className="text-gray-600 mb-6">আবেদন করার জন্য প্রথমে আপনার সিভি তৈরি করুন।</p>
              <div className="flex gap-4">
                <button onClick={() => setShowCvModal(false)} className="flex-1 py-3 rounded-xl bg-gray-100 font-bold">পরে</button>
                <button onClick={() => { setShowCvModal(false); setView('dashboard'); }} className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-bold">সিভি তৈরি করুন</button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
      <ScrollToTop />
      <AnimatePresence>
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

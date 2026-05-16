import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Loader2, Copy, CheckCircle2 } from 'lucide-react';
import { Job, SiteSettings } from '../types';

interface OrderModalProps {
  job: Job;
  onClose: () => void;
  onConfirm: (transactionId: string, selectedPost?: string, paymentMethod?: string) => void;
  isOrdering: boolean;
  siteSettings: SiteSettings;
  orderSuccessData?: { id: string, name: string } | null;
  orderMessage?: { type: 'success' | 'error', text: string } | null;
}

export const OrderModal: React.FC<OrderModalProps> = ({ job, onClose, onConfirm, isOrdering, siteSettings, orderSuccessData, orderMessage }) => {
  const [transactionId, setTransactionId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad'>('bKash');
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<string>(job.positions && job.positions.length > 0 ? job.positions[0].name : '');

  const safeParseInt = (val: string | undefined, fallback: number = 0) => {
    if (!val) return fallback;
    
    // Map of Bengali digits to English digits
    const bengaliToEnglish: { [key: string]: string } = {
      '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
      '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
    };

    // Replace Bengali digits with English digits
    let converted = val.split('').map(char => bengaliToEnglish[char] || char).join('');
    
    // Remove all non-numeric characters except decimal point
    const cleaned = converted.replace(/[^0-9.]/g, '');
    const parsed = parseInt(cleaned, 10);
    return isNaN(parsed) ? fallback : parsed;
  };

  const jobFee = React.useMemo(() => {
    if (selectedPost && job.positions) {
      const post = job.positions.find(p => p.name === selectedPost);
      if (post && post.applicationFee) {
        return safeParseInt(post.applicationFee);
      }
    }
    if (job.applicationFee) {
      return safeParseInt(job.applicationFee);
    }
    return safeParseInt(siteSettings.applicationFee, 0);
  }, [selectedPost, job, siteSettings.applicationFee]);

  const serviceCharge = React.useMemo(() => safeParseInt(siteSettings.serviceCharge, 50), [siteSettings.serviceCharge]);
  const totalBill = jobFee + serviceCharge;

  const handleCopy = (number: string) => {
    navigator.clipboard.writeText(number);
    setCopiedNumber(number);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  if (orderSuccessData) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[120] p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative overflow-hidden"
        >
          {/* Success Confetti Effect Background */}
          <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500" />
          
          <div className="text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            
            <h2 className="text-2xl font-black text-gray-900 mb-2">অভিনন্দন, {orderSuccessData.name}!</h2>
            <p className="text-gray-600 mb-8">আপনার আবেদন অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে।</p>
            
            <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">আপনার অর্ডার নাম্বার</p>
              <p className="text-3xl font-black text-emerald-600 tracking-wider mb-4">{orderSuccessData.id}</p>
              
              <div className="text-left space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold text-emerald-700">১</span>
                  </div>
                  <p className="text-xs text-gray-600 font-medium tracking-tight">আমরা আপনার হয়ে আবেদন সম্পন্ন করে শীঘ্রই আপনাকে ডেমো কপি পাঠাবো।</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold text-emerald-700">২</span>
                  </div>
                  <p className="text-xs text-gray-600 font-medium tracking-tight">অর্ডারের আপডেট জানতে আপনার "ড্যাশবোর্ড" এর "অর্ডারসমূহ" সেকশনটি চেক করুন।</p>
                </div>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200"
            >
              ঠিক আছে
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[120] p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">আবেদনের জন্য অর্ডার করুন</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100 text-blue-800 text-sm">
          <p className="font-bold mb-1">অর্ডার প্রক্রিয়া:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>আপনি অর্ডার করলে আমরা আপনার হয়ে আবেদন করে দেব।</li>
            <li>আবেদন শেষ হলে আমরা আপনাকে একটি ডেমো কপি পাঠাবো।</li>
            <li>ডেমো কপি পাওয়ার পর আপনি ফি (চাকরির ফি + আমাদের চার্জ) পরিশোধ করবেন।</li>
            <li>পেমেন্ট পাওয়ার পর আমরা আপনাকে ফাইনাল কপি পাঠিয়ে দেব।</li>
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="font-bold text-gray-900 mb-2">{job.title}</h3>
          <p className="text-gray-600 text-sm">{job.company}</p>
        </div>

        {job.positions && job.positions.length > 0 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">পদের নাম নির্বাচন করুন:</label>
            <select 
              value={selectedPost}
              onChange={(e) => setSelectedPost(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              {job.positions.map((pos, idx) => (
                <option key={idx} value={pos.name}>
                  {pos.name} {pos.applicationFee ? `(৳${pos.applicationFee})` : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="bg-gray-50 p-5 rounded-2xl mb-6 border border-gray-100">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">আবেদন ফি (আনুমানিক):</span>
              <span className="font-bold text-gray-800">{jobFee} টাকা</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">আমাদের সার্ভিস চার্জ:</span>
              <span className="font-bold text-gray-800">{serviceCharge} টাকা</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
              <span className="font-bold text-gray-900">মোট আনুমানিক বিল:</span>
              <div className="text-right">
                <span className="text-xl font-black text-emerald-600">{totalBill}</span>
                <span className="text-sm font-bold text-emerald-600 ml-1">টাকা</span>
              </div>
            </div>
          </div>
        </div>

        {orderMessage && (
          <div className={`mb-6 p-4 rounded-xl border text-sm font-medium ${
            orderMessage.type === 'success' 
              ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
              : 'bg-red-50 border-red-100 text-red-800'
          }`}>
            {orderMessage.text}
          </div>
        )}

        <button 
          onClick={() => onConfirm('', selectedPost, '')}
          disabled={isOrdering}
          className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isOrdering && <Loader2 className="w-4 h-4 animate-spin" />}
          অর্ডার কনফার্ম করুন
        </button>
      </motion.div>
    </div>
  );
};

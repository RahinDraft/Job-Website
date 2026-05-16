import React from 'react';
import { motion } from 'motion/react';
import { Building2, MapPin, LayoutDashboard, Landmark, FileText, ChevronRight, Bookmark, Clock } from 'lucide-react';
import { Job } from '../types';

interface JobCardProps {
  job: Job;
  handleApply: (job: Job) => void;
  isSaved: boolean;
  formatDateBn: (date: string) => string;
}

const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

export const JobCard: React.FC<JobCardProps> = ({ job, handleApply, isSaved, formatDateBn }) => {
  const isExpired = React.useMemo(() => {
    if (!job.deadline) return false;
    const deadlineDate = new Date(job.deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return deadlineDate < today;
  }, [job.deadline]);

  const openCircular = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!job.circularImageUrl) return;
    
    if (job.circularImageUrl.startsWith('data:')) {
      try {
        const byteString = atob(job.circularImageUrl.split(',')[1]);
        const mimeString = job.circularImageUrl.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeString });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      } catch (error) {
        console.error('Error opening circular:', error);
        window.open(job.circularImageUrl, '_blank');
      }
    } else {
      window.open(job.circularImageUrl, '_blank');
    }
  };

  const minFee = job.positions && job.positions.length > 0 
    ? Math.min(...job.positions.map(p => parseInt(p.applicationFee || '0', 10)).filter(f => f > 0))
    : parseInt(job.applicationFee || '0', 10);

  return (
    <motion.div 
      whileHover={!isExpired ? { y: -5 } : {}}
      className={cn(
        "group bg-white rounded-3xl p-6 border transition-all duration-300",
        isExpired 
          ? "border-gray-100 opacity-75 grayscale-[0.5]" 
          : "border-gray-100 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10"
      )}
    >
      <div className="flex justify-between items-start mb-4">
        {isExpired ? (
          <div className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full">
            <Clock className="w-3 h-3" />
            <span>আবেদনের সময় শেষ</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            <Clock className="w-3 h-3" />
            <span>{formatDateBn(job.deadline)}</span>
          </div>
        )}
        {isSaved && <Bookmark className="w-4 h-4 text-emerald-600 fill-emerald-600" />}
      </div>

      <div className="flex items-center gap-4 mb-4">
        {job.companyLogoUrl ? (
          <img 
            src={job.companyLogoUrl} 
            alt={job.company} 
            className="w-14 h-14 rounded-2xl object-contain bg-gray-50 p-2 border border-gray-100"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100">
            <Building2 className="w-7 h-7 text-gray-400" />
          </div>
        )}
        <div>
          <h4 className="text-lg font-bold group-hover:text-emerald-600 transition-colors leading-tight">{job.title}</h4>
          <p className="text-gray-600 text-sm">{job.company}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-6">
        <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
          <MapPin className="w-3 h-3" />
          {job.location}
        </div>
        {job.positions && job.positions.length > 0 && (
          <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
            <LayoutDashboard className="w-3 h-3" />
            <span>{job.positions.length}টি পদ</span>
          </div>
        )}
        {minFee > 0 && (
          <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg font-bold">
            <Landmark className="w-3 h-3" />
            ফি: {minFee} টাকা+
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button 
          onClick={() => !isExpired && handleApply(job)}
          disabled={isExpired}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all",
            isExpired 
              ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
              : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200"
          )}
        >
          {isExpired ? 'সময় শেষ' : 'আবেদন করুন'}
        </button>
        {job.circularImageUrl && (
          <button 
            onClick={openCircular}
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
};

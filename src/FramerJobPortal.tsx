import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Search, 
  Briefcase, 
  Building2, 
  Landmark, 
  Globe, 
  Calendar, 
  MapPin, 
  Check,
  ChevronRight, 
  Clock,
  FileText,
  Share2,
  Bookmark,
  Bell,
  Menu,
  X
} from "lucide-react"

// Import Google Font for perfect Bengali typography
const GoogleFont = () => (
  <style dangerouslySetInnerHTML={{ __html: `
    @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap');
    :root {
      --font-bengali: 'Hind Siliguri', sans-serif;
    }
    .font-bengali {
      font-family: var(--font-bengali);
    }
  `}} />
)

/**
 * @license
 * Job Portal Component for Framer
 * This is a standalone, single-file component that recreates the job portal experience.
 */

// --- Types ---
interface Job {
  id: string
  title: string
  company: string
  category: string
  location: string
  deadline: string
  companyLogoUrl?: string
  circularImageUrl?: string
  applicationFee?: string
}

interface FramerJobPortalProps {
  siteName: string
  primaryColor: string
  heroTitle: string
  heroSubtitle: string
  showSearch: boolean
  jobsLimit: number
}

// --- Helper Functions ---
const cn = (...classes: any[]) => classes.filter(Boolean).join(" ")

const formatNumberBn = (num: number) => {
  const digits: { [key: string]: string } = {
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
  }
  return num.toString().split('').map(d => digits[d] || d).join('')
}

const formatDateBn = (dateString: string) => {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    return new Intl.DateTimeFormat('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }).format(date)
  } catch (e) {
    return dateString
  }
}

// --- Mock Data ---
const MOCK_JOBS: Job[] = [
  {
    id: "1",
    title: "সিনিয়র সফটওয়্যার ইঞ্জিনিয়ার",
    company: "টেক সল্যুশন লিমিটেড",
    category: "বেসরকারি",
    location: "ঢাকা",
    deadline: "2026-12-31",
    companyLogoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=TS",
    applicationFee: "৫০০"
  },
  {
    id: "2",
    title: "অফিসার (সাধারণ শাখা)",
    company: "জনতা ব্যাংক পিএলসি",
    category: "ব্যাংক",
    location: "সারা বাংলাদেশ",
    deadline: "2026-06-15",
    companyLogoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=JB",
    applicationFee: "২০০"
  },
  {
    id: "3",
    title: "প্রজেক্ট কো-অর্ডিনেটর",
    company: "ব্র্যাক (BRAC)",
    category: "এনজিও",
    location: "সিলেট",
    deadline: "2026-05-20",
    companyLogoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=BR",
    applicationFee: "০"
  },
  {
    id: "4",
    title: "উপ-সহকারী প্রকৌশলী",
    company: "বাংলাদেশ বিদ্যুৎ উন্নয়ন বোর্ড",
    category: "সরকারি",
    location: "ঢাকা",
    deadline: "2026-04-30",
    companyLogoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=BP",
    applicationFee: "৩০০"
  }
]

// --- Sub-components ---

const JobCard = ({ job, primaryColor }: { job: Job, primaryColor: string }) => {
  const isExpired = new Date(job.deadline) < new Date()
  
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      style={{ borderColor: "#f3f4f6" }}
      className="bg-white rounded-3xl p-6 border shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={cn(
          "flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full",
          isExpired ? "text-red-600 bg-red-50" : "text-emerald-600 bg-emerald-50"
        )}>
          <Clock className="w-3 h-3" />
          <span>{isExpired ? "সময় শেষ" : formatDateBn(job.deadline)}</span>
        </div>
        <Bookmark className="w-4 h-4 text-gray-300" />
      </div>

      <div className="flex items-center gap-4 mb-4">
        <img 
          src={job.companyLogoUrl} 
          alt={job.company} 
          className="w-14 h-14 rounded-2xl object-cover bg-gray-50 border border-gray-100"
        />
        <div>
          <h4 className="text-lg font-bold leading-tight hover:text-emerald-600 transition-colors cursor-pointer">
            {job.title}
          </h4>
          <p className="text-gray-600 text-sm">{job.company}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-6">
        <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
          <MapPin className="w-3 h-3" />
          {job.location}
        </div>
        <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
          <Briefcase className="w-3 h-3" />
          {job.category}
        </div>
      </div>

      <div className="flex gap-3">
        <button 
          style={{ backgroundColor: isExpired ? "#e5e7eb" : primaryColor }}
          className={cn(
            "flex-1 py-3 rounded-xl font-bold text-sm text-white transition-all shadow-lg",
            isExpired && "text-gray-500 cursor-not-allowed"
          )}
        >
          {isExpired ? "সময় শেষ" : "আবেদন করুন"}
        </button>
        <button className="px-4 py-3 rounded-xl bg-blue-50 text-blue-600">
          <FileText className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  )
}

// --- Main Component ---

export function JobPortalFramer(props: FramerJobPortalProps) {
  const { 
    siteName = "JobPortal", 
    primaryColor = "#059669", 
    heroTitle = "আপনার স্বপ্নের ক্যারিয়ার খুঁজুন", 
    heroSubtitle = "সঠিক চাকরির সন্ধান পেতে এখনই আমাদের সাথে যুক্ত হোন",
    showSearch = true,
    jobsLimit = 4
  } = props

  const [selectedCategory, setSelectedCategory] = React.useState("সব")
  const categories = [
    { name: "সব", icon: <Globe className="w-4 h-4" /> },
    { name: "সরকারি", icon: <Building2 className="w-4 h-4" /> },
    { name: "বেসরকারি", icon: <Briefcase className="w-4 h-4" /> },
    { name: "ব্যাংক", icon: <Landmark className="w-4 h-4" /> },
    { name: "এনজিও", icon: <Globe className="w-4 h-4" /> }
  ]

  const filteredJobs = MOCK_JOBS
    .filter(job => selectedCategory === "সব" || job.category === selectedCategory)
    .slice(0, jobsLimit)

  return (
    <div className="font-bengali text-gray-900 bg-white min-h-screen">
      <GoogleFont />
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div 
                style={{ backgroundColor: primaryColor }}
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg"
              >
                <Briefcase className="w-6 h-6" />
              </div>
              <span className="text-xl font-black tracking-tighter text-gray-900">
                {siteName}
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              {["হোম", "চাকরি", "প্রস্তুতি", "পেমেন্ট"].map((item) => (
                <a key={item} href="#" className="font-bold text-gray-600 hover:text-emerald-600 transition-colors">
                  {item}
                </a>
              ))}
              <button 
                style={{ backgroundColor: primaryColor }}
                className="px-6 py-2.5 rounded-xl text-white font-bold text-sm shadow-lg"
              >
                লগইন
              </button>
            </div>
            <div className="md:hidden">
              <Menu className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-16 pb-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-50 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
              {heroTitle}
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              {heroSubtitle}
            </p>
          </motion.div>

          {showSearch && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl mx-auto"
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative flex items-center bg-white p-2 rounded-[2rem] shadow-xl border border-gray-100">
                  <div className="flex-1 flex items-center px-6">
                    <Search className="w-5 h-5 text-gray-400 mr-3" />
                    <input 
                      type="text" 
                      placeholder="পদবী বা প্রতিষ্ঠানের নাম লিখুন..." 
                      className="w-full bg-transparent border-none outline-none font-bold placeholder:text-gray-300"
                    />
                  </div>
                  <button 
                    style={{ backgroundColor: primaryColor }}
                    className="px-8 py-4 rounded-[1.5rem] text-white font-bold shadow-xl flex items-center gap-2"
                  >
                    খুঁজুন
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all border",
                selectedCategory === cat.name 
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-200" 
                  : "bg-white text-gray-600 border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/30"
              )}
              style={selectedCategory === cat.name ? { backgroundColor: primaryColor, borderColor: primaryColor } : {}}
            >
              {cat.icon}
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} primaryColor={primaryColor} />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div 
                  style={{ backgroundColor: primaryColor }}
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-white"
                >
                  <Briefcase className="w-6 h-6" />
                </div>
                <span className="text-2xl font-black tracking-tighter">{siteName}</span>
              </div>
              <p className="text-gray-400 font-medium">আপনার স্বপ্নের ক্যারিয়ার গড়তে আমরা আছি আপনার পাশে।</p>
            </div>
            <div>
              <h5 className="font-bold text-lg mb-6">গুরুত্বপূর্ণ লিংক</h5>
              <ul className="space-y-4 text-gray-400 font-bold">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">আমাদের সম্পর্কে</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">গোপনীয়তা নীতি</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">টার্মস ও কন্ডিশন</a></li>
              </ul>
            </div>
            {/* Add more sections as needed */}
          </div>
          <div className="mt-16 pt-8 border-t border-white/5 text-center text-gray-500 font-bold">
            © {new Date().getFullYear()} {siteName}. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

// --- Framer Property Controls ---
// These only work when exported to a Framer project environment
// We include them here as a reference and template.

export const __addPropertyControls = (Component: any) => {
  if (typeof window !== "undefined" && (window as any).framer) {
    const { addPropertyControls, ControlType } = (window as any).framer
    addPropertyControls(Component, {
      siteName: { type: ControlType.String, title: "Site Name", defaultValue: "চাকরির খবর" },
      primaryColor: { type: ControlType.Color, title: "Primary Color", defaultValue: "#059669" },
      heroTitle: { type: ControlType.String, title: "Hero Title", defaultValue: "আপনার স্বপ্নের ক্যারিয়ার খুঁজুন" },
      heroSubtitle: { type: ControlType.String, title: "Hero Subtitle", defaultValue: "সহজেই খুঁজে নিন আপনার পছন্দের চাকরি" },
      showSearch: { type: ControlType.Boolean, title: "Show Search", defaultValue: true },
      jobsLimit: { type: ControlType.Number, title: "Jobs Limit", defaultValue: 4, min: 1, max: 20 },
    })
  }
}

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Clock, 
  HelpCircle, 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  Award, 
  Play, 
  BookOpen, 
  Check, 
  ChevronRight, 
  Sparkles, 
  ListOrdered,
  AlertTriangle
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface MockTestProps {
  onBack: () => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

interface Question {
  id: string;
  category: string;
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const DATABASE_QUESTIONS: Question[] = [
  // BCS / PSC Category
  {
    id: 'q1',
    category: 'bcs',
    questionText: 'বাংলা ভাষা ও সাহিত্যের প্রাচীনতম প্রাচীন নিদর্শন কোনটি?',
    options: ['চর্যাপদ', 'শ্রীকৃষ্ণকীর্তন', 'মঙ্গলকাব্য', 'শূন্যপুরাণ'],
    correctIndex: 0,
    explanation: 'বাংলা সাহিত্যের প্রাচীনতম আদি নিদর্শন হলো "চর্যাপদ"। যা ১৯০৭ সালে মহামহোপাধ্যায় হরপ্রসাদ শাস্ত্রী নেপালের রাজদরবারের রয়েল লাইব্রেরি থেকে আবিষ্কার করেছিলেন।'
  },
  {
    id: 'q2',
    category: 'bcs',
    questionText: 'বাংলাদেশ সংবিধান কত তারিখে গণপরিষদে গৃহীত হয়?',
    options: ['৪ নভেম্বর, ১৯৭২', '১৬ ডিসেম্বর, ১৯৭২', '১২ অক্টোবর, ১৯৭২', '১০ এপ্রিল, ১৯৭২'],
    correctIndex: 0,
    explanation: 'বাংলাদেশ সংবিধান ৪ নভেম্বর, ১৯৭২ সালে গণপরিষদে গৃহীত হয় এবং একই বছরের ১৬ই ডিসেম্বর (বিজয় দিবস) থেকে তা কার্যকর করা হয়েছিল।'
  },
  {
    id: 'q3',
    category: 'bcs',
    questionText: 'পদ্মা সেতুর দৈর্ঘ্য কত কিলোমিটার?',
    options: ['৬.১৫ কি.মি.', '৫.১৫ কি.মি.', '৭.১৫ কি.মি.', '৮.১৫ কি.মি.'],
    correctIndex: 0,
    explanation: 'পদ্মা বহুমুখী সেতুর মোট দৈর্ঘ্য ৬.১৫ কিলোমিটার (প্রস্থ ১৮.১০ মিটার)। এতে মোট স্প্যান রয়েছে ৪১টি এবং পিলার বা খুঁটি রয়েছে ৪২টি।'
  },
  {
    id: 'q4',
    category: 'bcs',
    questionText: 'The synonym for the word "Altruistic" is:',
    options: ['Selfish', 'Benevolent', 'Hostile', 'Greedy'],
    correctIndex: 1,
    explanation: '"Altruistic" শব্দের অর্থ পরোপকারী। এর সমার্থক বা Synonym শব্দ হলো "Benevolent" (দয়ালু বা কল্যাণকর)।'
  },
  {
    id: 'q5',
    category: 'bcs',
    questionText: 'দুটি সংখ্যার অনুপাত ৫:৬ এবং তাদের গ.সা.গু ৪ হলে, সংখ্যা দুটির ল.সা.গু কত?',
    options: ['১২০', '১০০', '২৪', '১২'],
    correctIndex: 0,
    explanation: 'অনুপাত দুটি x ধরে সংখ্যাগুলো হবে যথাক্রমে ৫x এবং ৬x। অতএব গসাগু = x। প্রশ্নে গসাগু ৪ দেওয়া আছে, অর্থাৎ x = ৪। সংখ্যা দুটি যথাক্রমে ২০ এবং ২৪। ২০ এবং ২৪ এর লসাগু = ১২০।'
  },

  // Bank Category
  {
    id: 'q6',
    category: 'bank',
    questionText: 'বাংলাদেশ ব্যাংকের প্রথম গভর্নরের নাম কী?',
    options: ['এ. এন. এম. হামিদুল্লাহ', 'কে. ই. খসরু', 'ফখরুদ্দীন আহমদ', 'ড. আতিউর রহমান'],
    correctIndex: 0,
    explanation: 'বাংলাদেশ ব্যাংকের সর্বপ্রথম গভর্নর হিসেবে দায়িত্ব পালন করেছিলেন এ. এন. এম. হামিদুল্লাহ (১৮ ডিসেম্বর, ১৯৭১ থেকে ১৩ জুলাই, ১৯৭৪ পর্যন্ত)।'
  },
  {
    id: 'q7',
    category: 'bank',
    questionText: 'What is the acronym of "SWIFT" in banking network?',
    options: [
      'Society for Worldwide Interbank Financial Telecommunication',
      'Society for World Integrated Funds Transfer',
      'Swift Worldwide Interbank Financial Transactions',
      'Secure Worldwide Interbank Financial Tracking'
    ],
    correctIndex: 0,
    explanation: 'SWIFT এর পূর্ণরূপ হলো "Society for Worldwide Interbank Financial Telecommunication"। এটি ব্যাংক সমূহের মধ্যে নিরাপদ লেনদেন তথ্য বিনিময়ের এক আন্তর্জাতিক নেটওয়ার্ক।'
  },
  {
    id: 'q8',
    category: 'bank',
    questionText: 'কোন ব্যাংক সর্ব প্রথম বাংলাদেশে শাখা খুলে মোবাইল ব্যাংকিং পদ্ধতি "রকেট" চালু করে?',
    options: ['ব্র্যাক ব্যাংক', 'ডাচ-বাংলা ব্যাংক', 'অগ্রণী ব্যাংক', 'সিটি ব্যাংক'],
    correctIndex: 1,
    explanation: 'ডাচ-বাংলা ব্যাংক লিমিটেড (DBBL) বাংলাদেশে সর্বপ্রথম ব্যাংকিং সেবার বাইরে থাকা জনসাধারণকে সেবায় অন্তর্ভুক্ত করতে মোবাইল ফিনান্সিয়াল প্রোডাক্ট হিসেবে "রকেট" ও এটিএম বুথ সেবা ব্যাপকাকারে চালু করে।'
  },
  {
    id: 'q9',
    category: 'bank',
    questionText: 'দ্বিগু সমাসের উদাহরণ কোনটি?',
    options: ['পঞ্চনদ', 'মুখেভাত', 'উপকূল', 'হাটবাজার'],
    correctIndex: 0,
    explanation: '"পঞ্চনদ" (পঞ্চ নদের সমাহার) এটি সংখ্যাবাচক ও সমাহার অর্থ প্রকাশ করায় দ্বিগু সমাসের চমৎকার উদাহরণ।'
  },

  // Primary Category
  {
    id: 'q10',
    category: 'primary',
    questionText: 'বাংলায় চিরস্থায়ী বন্দোবস্ত প্রথা কত সালে প্রবর্তন করা হয়?',
    options: ['১৭৯৩ সালে', '১৭৭৩ সালে', '১৮৫৭ সালে', '১৯০৫ সালে'],
    correctIndex: 0,
    explanation: '১৭৯৩ সালে লর্ড কর্নওয়ালিস বাংলায় ভূমি রাজস্ব আদায়ের সুবিধার্থে "চিরস্থায়ী বন্দোবস্ত" বা সূর্যাস্ত আইন প্রবর্তন করেছিলেন।'
  },
  {
    id: 'q11',
    category: 'primary',
    questionText: 'নিচের কোনটি খাঁটি বাংলা উপসর্গ?',
    options: ['রাম', 'প্র', 'পরা', 'সু'],
    correctIndex: 0,
    explanation: '"রাম" হলো খাঁটি বাংলা উপসর্গ (যেমন: রামছাগল, রামদা)। অপরদিকে প্র, পরা, অপ, সম হল সংস্কৃত উপসর্গ।'
  },
  {
    id: 'q12',
    category: 'primary',
    questionText: 'একটি সংখ্যার ৩ গুণ অপর একটি সংখ্যার ২ গুণের সমান। এদের অনুপাত কত?',
    options: ['৩:২', '২:৩', '১:৩', '৪:৩'],
    correctIndex: 1,
    explanation: 'ধরি সংখ্যা দুটি X এবং Y। প্রশ্নানুসারে, ৩X = ২Y। অতএব X / Y = ২ / ৩। অর্থাৎ অনুপাত হবে ২:৩।'
  },
  {
    id: 'q13',
    category: 'primary',
    questionText: '"বিড়ালের আড়াই পা" প্রবচনের প্রকৃত অর্থ কী?',
    options: ['বেহায়াপনা', 'অতিরিক্ত অহংকার', 'ক্ষণস্থায়ী রাগ', 'অসম্ভব আবদার'],
    correctIndex: 1,
    explanation: '"বিড়ালের আড়াই পা" বাগধারা বা প্রবচনের আসল অর্থ হলো অতিরিক্ত বেহায়াপনা বা "অতিরিক্ত অহংকার" প্রকাশ করা বা তুচ্ছ ক্ষমতা দেখানোর দম্ভ।'
  },

  // GK & General Preparation
  {
    id: 'q14',
    category: 'general',
    questionText: 'বাংলাদেশের একমাত্র রাষ্ট্রীয় মালিকানাধীন সার কারখানার নাম কী যা সম্প্রতি ইউরিয়া সার তৈরি করে?',
    options: ['শাহজালাল সার কারখানা', 'যমুনা ফার্টিলাইজার', 'ঘোড়াশাল পলাশ ফার্টিলাইজার', 'ফেনী সার কারখানা'],
    correctIndex: 2,
    explanation: 'বাংলাদেশের সর্বাধুনিক, বৃহৎ এবং পরিবেশবান্ধব রাষ্ট্রীয় সার কারখানা হলো নরসিংদীর "ঘোড়াশাল পলাশ ফার্টিলাইজার লিমিটেড"।'
  },
  {
    id: 'q15',
    category: 'general',
    questionText: 'কত তারিখে স্বাধীন বাংলাদেশে প্রথম সাধারণ নির্বাচন অনুষ্ঠিত হয়েছিল?',
    options: ['৭ মার্চ, ১৯৭৩', '১৬ ডিসেম্বর, ১৯৭২', '১০ জানুয়ারি, ১৯৭২', '২৫ অক্টোবর, ১৯৭২'],
    correctIndex: 0,
    explanation: 'স্বাধীন বাংলাদেশের প্রথম জাতীয় সাধারণ নির্বাচন অনুষ্ঠিত হয়েছিল ১৯৭৩ সালের ৭ই মার্চ।'
  }
];

export const MockTest: React.FC<MockTestProps> = ({ onBack, showToast }) => {
  const [gameState, setGameState] = useState<'lobby' | 'test' | 'result'>('lobby');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedNumQuestions, setSelectedNumQuestions] = useState<number>(10);
  const [selectedDuration, setSelectedDuration] = useState<number>(5); // test duration in minutes

  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number }>({});
  
  // Timer States
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Stats
  const [score, setScore] = useState<number>(0);
  const [timeTaken, setTimeTaken] = useState<string>('');

  const activeCategories = [
    { id: 'all', title: 'পূর্ণাঙ্গ মক টেস্ট (সম্মিলিত)', desc: 'সব বিষয়ের ১০টি সেরা বাছাই প্রশ্নোত্তর' },
    { id: 'bcs', title: 'বিসিএস প্রিলিমিনারি মক টেস্ট', desc: 'বিগত বিসিএস পরীক্ষার অতি গুরুত্বপূর্ণ প্রশ্নসমূহ' },
    { id: 'bank', title: 'ব্যাংক অফিসার স্পেশাল টেস্ট', desc: 'সরকারি ব্যাংক ও বিএসইসি নিয়োগ উপযোগী প্রশ্ন' },
    { id: 'primary', title: 'প্রাইমারি ও শিক্ষক নিয়োগ পরীক্ষা', desc: 'প্রাইমারী গাইডলাইন অনুযায়ী সাজানো MCQ পরীক্ষা' },
  ];

  // Begin Test Session
  const handleStartTest = () => {
    // Collect candidate questions matching configuration
    let pool = [...DATABASE_QUESTIONS];
    if (selectedCategory !== 'all') {
      pool = pool.filter(q => q.category === selectedCategory);
    }

    // Handle case where we requested more questions than database size
    const availableCount = pool.length;
    let limit = Math.min(selectedNumQuestions, availableCount);
    if (limit === 0) {
      showToast('দুঃখিত, এই ক্যাটাগরি পর্ষদে পর্যাপ্ত প্রশ্ন নেই। অন্য অপশন সিলেক্ট করুন।', 'error');
      return;
    }

    // Shuffle and slice pool
    const shuffled = pool.sort(() => 0.5 - Math.random()).slice(0, limit);
    setActiveQuestions(shuffled);
    setActiveQuestionIndex(0);
    setUserAnswers({});
    
    // Set Time Left in seconds
    setTimeLeft(selectedDuration * 60);
    setGameState('test');
    showToast('মক টেস্ট শুরু হয়েছে। শান্ত মাথায় উত্তর দিন!', 'success');
  };

  // Timer loop
  useEffect(() => {
    if (gameState === 'test') {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleFinishTest(true); // Auto-finish due to time expiry
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  // Handle Option Click
  const handleSelectOption = (optIdx: number) => {
    setUserAnswers(prev => ({ ...prev, [activeQuestionIndex]: optIdx }));
  };

  // Finish exam early or on timer end
  const handleFinishTest = (isTimeExpired: boolean = false) => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Calculate Score
    let correctSum = 0;
    activeQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) {
        correctSum++;
      }
    });

    // Calculate time taken
    const totalSecsAllocated = selectedDuration * 60;
    const secsLeft = timeLeft;
    const elapsedSecs = totalSecsAllocated - secsLeft;
    const elapsedMin = Math.floor(elapsedSecs / 60);
    const elapsedSecUnused = elapsedSecs % 60;
    
    setScore(correctSum);
    setTimeTaken(`${elapsedMin > 0 ? `${elapsedMin} মিনিট ` : ''}${elapsedSecUnused} সেকেন্ড`);
    setGameState('result');

    if (isTimeExpired) {
      showToast('সময় শেষ! আপনার পরীক্ষাটি স্বয়ংক্রিয়ভাবে জমা হয়েছে।', 'info');
    } else {
      showToast('পরীক্ষা সফলভাবে সম্পন্ন হয়েছে! আপনার স্কোর ড্যাশবোর্ড দেখুন।', 'success');
    }
  };

  const currentQuestion = activeQuestions[activeQuestionIndex];

  // Percentage calculator
  const percentScore = activeQuestions.length > 0 
    ? Math.round((score / activeQuestions.length) * 100) 
    : 0;
  
  const isPassed = percentScore >= 60;

  // Format seconds to text
  const formatTime = (secs: number) => {
    const min = Math.floor(secs / 60);
    const sec = secs % 60;
    return `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-bengali text-gray-700 select-none pb-12 px-2 md:px-4">
      
      {/* 1. LOBBY STATE */}
      {gameState === 'lobby' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100/80 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={onBack}
                className="w-10 h-10 rounded-2xl bg-gray-50 hover:bg-emerald-50 text-gray-600 hover:text-emerald-600 flex items-center justify-center transition-all border border-gray-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl md:text-2xl font-black text-gray-950 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-emerald-600" />
                  ইন্টারেক্টিভ মক টেস্ট রূম
                </h1>
                <p className="text-xs text-gray-500 mt-1">
                  স্বল্প সময়ে চূড়ান্ত চাকরি পরীক্ষার প্রস্তুতি মূল্যায়ণ করতে এখনই শুরু করুন
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Setting configuration card */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 space-y-6 shadow-sm">
              <h3 className="text-base font-bold text-gray-950 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-500" />
                মক টেস্টের নিয়মাবলী সেট করুন:
              </h3>

              <div className="space-y-4 text-xs">
                {/* Number of questions setting */}
                <div className="space-y-2">
                  <label className="font-bold text-gray-600 block">১. প্রশ্নের সংখ্যা নির্ধারণ করুন:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[5, 10, 15].map(num => (
                      <button
                        key={num}
                        onClick={() => setSelectedNumQuestions(num)}
                        className={cn(
                          "px-4 py-2 rounded-xl border font-bold transition-all text-center",
                          selectedNumQuestions === num 
                            ? "bg-emerald-600 border-emerald-600 text-white" 
                            : "bg-white border-gray-100 text-gray-600 hover:border-gray-200"
                        )}
                      >
                        {num} টি প্রশ্ন
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration setting */}
                <div className="space-y-2">
                  <label className="font-bold text-gray-600 block">২. সময়কাল নির্ধারণ করুন:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[3, 5, 10].map(duration => (
                      <button
                        key={duration}
                        onClick={() => setSelectedDuration(duration)}
                        className={cn(
                          "px-4 py-2 rounded-xl border font-bold transition-all text-center",
                          selectedDuration === duration 
                            ? "bg-emerald-600 border-emerald-600 text-white" 
                            : "bg-white border-gray-100 text-gray-600 hover:border-gray-200"
                        )}
                      >
                        {duration} মিনিট
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Start Game Action */}
              <button
                onClick={handleStartTest}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold transition-all text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-50"
              >
                <Play className="w-5 h-5" />
                ফ্রি পরীক্ষা শুরু করুন
              </button>
            </div>

            {/* Syllabus selection and statistics */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider font-sans px-1">
                SELECT EXAM TOPIC / ক্যাটাগরি ছক
              </h3>
              <div className="space-y-3">
                {activeCategories.map(cat => (
                  <div
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={cn(
                      "p-4 bg-white rounded-2xl border transition-all cursor-pointer flex justify-between items-center group shadow-sm",
                      selectedCategory === cat.id
                        ? "border-emerald-500 bg-emerald-50/20 ring-2 ring-emerald-50"
                        : "border-gray-100 hover:border-gray-200"
                    )}
                  >
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                        {cat.title}
                      </h4>
                      <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                        {cat.desc}
                      </p>
                    </div>
                    {selectedCategory === cat.id && (
                      <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. EXAM TEST ACTIVE STATE */}
      {gameState === 'test' && currentQuestion && (
        <div className="space-y-6">
          {/* Top Exam Tracker */}
          <div className="bg-white p-5 rounded-3xl border border-gray-100 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold font-sans">
                {activeQuestionIndex + 1}/{activeQuestions.length}
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">মক টেস্ট প্রগ্রেস</h4>
                <div className="w-32 bg-gray-100 h-2 rounded-full mt-1 overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all"
                    style={{ width: `${((activeQuestionIndex + 1) / activeQuestions.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Animated Timer Control */}
            <div className={cn(
              "px-4 py-2.5 rounded-2xl border flex items-center gap-2 font-mono font-bold text-xs md:text-sm shadow-sm",
              timeLeft < 60 
                ? "bg-red-50 border-red-200 text-red-600 animate-pulse" 
                : "bg-amber-50 border-amber-200 text-amber-700"
            )}>
              <Clock className="w-4.5 h-4.5" />
              <span>{formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Question Display Card */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 space-y-6 shadow-sm">
            <div className="flex gap-2.5 items-start">
              <HelpCircle className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-[10px] bg-gray-100 px-2 py-0.5 text-gray-500 font-bold rounded-md uppercase tracking-wider font-sans">
                  {currentQuestion.category.toUpperCase()} TOPIC
                </span>
                <h3 className="text-base md:text-lg font-bold text-gray-950 leading-relaxed font-bengali">
                  {currentQuestion.questionText}
                </h3>
              </div>
            </div>

            {/* Answer Options list */}
            <div className="space-y-3 pt-3">
              {currentQuestion.options.map((option, optIdx) => {
                const isSelected = userAnswers[activeQuestionIndex] === optIdx;
                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={cn(
                      "w-full text-left p-4 rounded-2xl text-xs md:text-sm font-medium border flex items-center justify-between transition-all",
                      isSelected
                        ? "bg-emerald-600 border-emerald-600 text-white shadow-md font-bold"
                        : "bg-white border-gray-100 hover:border-emerald-200 text-gray-700"
                    )}
                  >
                    <span>{option}</span>
                    <div className={cn(
                      "w-5 h-5 rounded-full border flex items-center justify-center shrink-0",
                      isSelected ? "border-white bg-white/20" : "border-gray-200"
                    )}>
                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigations buttons */}
          <div className="flex justify-between items-center">
            <button
              disabled={activeQuestionIndex === 0}
              onClick={() => setActiveQuestionIndex(prev => prev - 1)}
              className="px-5 py-3 bg-white border border-gray-100 hover:border-gray-200 text-gray-600 text-xs font-bold rounded-xl transition-all disabled:opacity-50"
            >
              পূর্ববর্তী প্রশ্ন
            </button>

            {activeQuestionIndex < activeQuestions.length - 1 ? (
              <button
                onClick={() => setActiveQuestionIndex(prev => prev + 1)}
                className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1 shadow-sm"
              >
                পরবর্তী প্রশ্ন
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => handleFinishTest()}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-red-55"
              >
                পরীক্ষা শেষ করুন (Submit)
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. DIAGNOSTIC RESULTS STATE */}
      {gameState === 'result' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-xl md:text-2xl font-black text-gray-950 flex items-center gap-2">
              <Award className="w-7 h-7 text-emerald-600" />
              মক টেস্ট রেজাল্ট রিপোর্ট
            </h1>
            <button
              onClick={() => setGameState('lobby')}
              className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-emerald-100"
            >
              <RotateCcw className="w-4 h-4" />
              নতুন মক টেস্ট দিন
            </button>
          </div>

          {/* Performance Report Card */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6 text-center items-center shadow-sm">
            {/* Left: Overall gauge */}
            <div className="space-y-2 border-r border-gray-100 md:pb-0 pb-6 md:mb-0 mb-6">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block font-sans">
                SCORE SUMMARY / স্কোর
              </span>
              <div className="text-4xl font-black text-emerald-600 font-sans tracking-tight">
                {score} <span className="text-lg text-gray-400 font-medium">/ {activeQuestions.length}</span>
              </div>
              <div className="inline-block px-3 py-1 rounded-full text-[10px] font-bold mt-1.5 uppercase">
                {isPassed ? (
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 p-2.5 rounded-2xl block">সফল হয়েছে (PASSED)</span>
                ) : (
                  <span className="bg-amber-50 text-amber-600 border border-amber-100 p-2.5 rounded-2xl block">পুনরায় ট্রাই করুন (FAILED)</span>
                )}
              </div>
            </div>

            {/* Middle: Performance details */}
            <div className="space-y-2 border-r border-gray-100 md:pb-0 pb-6 md:mb-0 mb-6">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block font-sans">
                SUCCESS PERCENTAGE / শতকরা
              </span>
              <div className="text-3xl font-black text-gray-950 font-sans tracking-tight">
                {percentScore}%
              </div>
              <p className="text-xs text-gray-500">
                পাসের যোগ্যতা মান হলো ৬০%
              </p>
            </div>

            {/* Right: Spent time details */}
            <div className="space-y-2">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block font-sans">
                TIME USED / গৃহীত সময়
              </span>
              <div className="text-2xl font-black text-blue-600 font-sans tracking-tight">
                {timeTaken}
              </div>
              <p className="text-xs text-gray-500">
                বরাদ্দকৃত সময়: {selectedDuration} মিনিট
              </p>
            </div>
          </div>

          {/* Feedback Section */}
          <div className="p-5 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 border border-emerald-100 rounded-2xl flex items-start gap-3">
            <Sparkles className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5 animate-pulse" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-emerald-950">ম্যাক্রো রিক্রুটার এডভাইস:</h4>
              <p className="text-xs leading-relaxed text-emerald-900">
                {isPassed 
                  ? 'অসাধারণ প্রস্তুতি! আপনার সাধারণ জ্ঞান এবং নির্ভুলতা প্রশংসাযোগ্য। বর্তমান ধারাবাহিকতা বজায় রেখে নিয়মিত বিসিএস ও ব্যাংকের বিষয়ভিত্তিক সাজেশন্স পড়তে থাকুন।'
                  : 'ইন্টারভিউ বা ভাইভায় এ জাতীয় MCQ ভিত্তিক প্রশ্নের উত্তর দেওয়ার দক্ষতার ওপর ব্যাপক ফোকাস করা হয়। অনুগ্রহপূর্বক বামে "বিষয়ভিত্তিক প্রিপারেশন" জোন থেকে সমাস, সংবিধান ও শতকরা টপিক সিলেক্ট করে আরো একবার রিভিশন দিন!'}
              </p>
            </div>
          </div>

          {/* Question Reviews lists */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider font-sans flex items-center gap-1">
              <ListOrdered className="w-5 h-5 text-gray-400" />
              DETAILED QUESTION REVIEW / উত্তর সমাধান ও ব্যাখ্যা
            </h3>

            <div className="space-y-3">
              {activeQuestions.map((q, idx) => {
                const userAns = userAnswers[idx];
                const isCorrect = userAns === q.correctIndex;

                return (
                  <div key={idx} className="bg-white p-5 rounded-3xl border border-gray-100 space-y-3 shadow-sm">
                    <div className="flex items-start gap-2.5 justify-between">
                      <div className="flex gap-2 items-start">
                        <span className="text-xs font-bold text-gray-400 font-sans shrink-0 mt-0.5">#{idx + 1}</span>
                        <h4 className="font-bold text-sm text-gray-950 leading-relaxed">
                          {q.questionText}
                        </h4>
                      </div>
                      <div className="shrink-0 mt-0.5">
                        {isCorrect ? (
                          <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                            <CheckCircle className="w-3.5 h-3.5" />
                            সঠিক
                          </div>
                        ) : userAns === undefined ? (
                          <div className="flex items-center gap-1 text-amber-600 text-xs font-bold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            উত্তর দেয়া হয়নি
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-red-600 text-xs font-bold bg-red-50 px-2.5 py-1 rounded-full border border-red-100">
                            <XCircle className="w-3.5 h-3.5" />
                            ভুল
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Options status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2">
                      {q.options.map((option, optIdx) => {
                        const isCorrectOpt = optIdx === q.correctIndex;
                        const isUserAnswerOpt = optIdx === userAns;

                        return (
                          <div 
                            key={optIdx}
                            className={cn(
                              "p-3 rounded-xl text-xs font-medium border text-left flex items-center justify-between",
                              isCorrectOpt 
                                ? "bg-emerald-50 border-emerald-200 text-emerald-950" 
                                : isUserAnswerOpt 
                                  ? "bg-red-50 border-red-200 text-red-950" 
                                  : "bg-white border-gray-50 text-gray-500"
                            )}
                          >
                            <span>{option}</span>
                            {isCorrectOpt && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation wrapper */}
                    <div className="p-3 bg-gray-50 rounded-2xl text-xs text-gray-600 leading-relaxed border border-gray-100/60 font-sans">
                      <strong className="font-bold text-gray-900 font-bengali">সহজ সমাধান ব্যাখ্যা:</strong> {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

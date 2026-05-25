import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Award, 
  Check, 
  ChevronRight, 
  HelpCircle, 
  MessageSquare, 
  RotateCcw, 
  Sparkles, 
  TrendingUp, 
  UserCheck, 
  Zap, 
  Terminal, 
  Heart, 
  Users 
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SkillAssessmentProps {
  onBack: () => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

interface AssessmentQuestion {
  id: string;
  scenario: string;
  options: {
    text: string;
    points: number; // weighted intelligence points (1 to 4)
    feedback: string;
  }[];
}

interface AssessmentTheme {
  id: string;
  title: string;
  bengaliTitle: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  questions: AssessmentQuestion[];
}

const ASSESSMENT_THEMES: AssessmentTheme[] = [
  {
    id: 'communication',
    title: 'Communication & Negotiation',
    bengaliTitle: 'কমিউনিকেশন ও নেগোশিয়েশন স্কিলস',
    desc: 'কর্পোরেট ভাইভা ও কর্মক্ষেত্রে সফল যোগাযোগের গভীর পরীক্ষা',
    icon: <MessageSquare className="w-5 h-5 text-blue-600" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-100',
    questions: [
      {
        id: 'c1',
        scenario: 'একটি গুরুত্বপূর্ণ মিটিংয়ে আপনার উপস্থাপনা করা আইডিয়া বা প্রস্তাবটি আপনার ঊর্ধ্বতন কর্মকর্তা (Boss) সরাসরি অগ্রাহ্য ও সমালোচনা করলেন। এমতাবস্থায় আপনার প্রতিক্রিয়া কেমন হবে?',
        options: [
          {
            text: 'তাত্ক্ষণিক রেগে গিয়ে মিটিং বর্জন করবেন এবং মনে মনে ক্ষোভ ধরে রাখবেন।',
            points: 1,
            feedback: 'এটি পেশাদারি আচরণের সম্পূর্ণ পরিপন্থী এবং কর্মক্ষেত্রে আপনার ইমেজ ক্ষুণ্ণ করতে পারে।'
          },
          {
            text: 'চুপচাপ থাকবেন এবং কথা না বলে বস যা বলেন তাই নিঃশব্দে মেনে নেবেন।',
            points: 2,
            feedback: 'এটি অনিরাপদ সমাধান। বসের সিদ্ধান্তের সম্মান দিলেও আপনার নিজস্ব চিন্তা তুলে ধরা দরকার।'
          },
          {
            text: 'ঠাণ্ডা মাথায় বসের যুক্তি শুনবেন এবং বিনীতভাবে আপনার আইডিয়াটির লাভজনক দিক পরিষ্কার করে আবারও তুলে ধরবেন।',
            points: 4,
            feedback: 'চমৎকার! এটি অত্যন্ত মার্জিত এবং পেশাদার লিডারের বড় গুণ।'
          },
          {
            text: 'মিটিং শেষ হওয়ার পর সহকর্মীদের কাছে বসের নামে আড়ালে নিন্দা বা গীবত করবেন।',
            points: 1,
            feedback: 'এটি কর্মক্ষেত্রের টক্সিক কালচার বাড়িয়ে দেয় ও টিমওয়ার্ক নষ্ট করে।'
          }
        ]
      },
      {
        id: 'c2',
        scenario: 'একজন গুরুত্বপূর্ণ ক্লায়েন্ট অতি তুচ্ছ টেকনিক্যাল ভুলের কারণে আপনার প্রজেক্ট টিমের ওপর প্রচণ্ড রেগে ফোন করে গালিগালাজ করছেন। আপনার নেগোশিয়েশন পদ্ধতি কী হবে?',
        options: [
          {
            text: 'ক্লায়েন্টের কথার মাঝেই বাধা দিয়ে বলবেন তিনি ভুল বলছেন এবং আপনার অপরাধ অস্বীকার করবেন।',
            points: 1,
            feedback: 'এতে ক্লায়েন্টের ক্রোধ আরও বাড়বে এবং কোম্পানি বড় চুক্তি হারাতে পারে।'
          },
          {
            text: 'ক্লায়েন্টকে ধৈর্য ধরে শান্তভাবে বলতে দেবেন, নিজেরাও দুঃখ প্রকাশ করে দ্রুত সমাধান করে দেওয়ার নির্ভরযোগ্য আশ্বাস দেবেন।',
            points: 4,
            feedback: 'অসাধারণ! ক্লায়েন্ট হ্যান্ডলিং ও সংকট ব্যবস্থাপনার সেরা প্রফেশনাল উদাহরণ এটি।'
          },
          {
            text: 'ভয়ে নিজে কথা না বলে কলটি অন্য কোনো জুনিয়র কলিগ বা টিমের উপর হস্তান্তর করে পালিয়ে যাবেন।',
            points: 2,
            feedback: 'এটি দায়িত্ব এড়ানোর প্রবণতা নির্দেশ করে, যা লিডারশিপ কোয়ালিটির অভাব কমায়।'
          },
          {
            text: 'বলবেন আমাদের অন্য কোনো কাজ নেই তাই আপনারা অন্য সার্ভিস প্রোভাইডার খুঁজে নিন।',
            points: 1,
            feedback: 'এটি চরম অপেশাদারিত্ব, যা কোম্পানির মারিয়া ও ভাবমূর্তির ক্ষতি করে।'
          }
        ]
      }
    ]
  },
  {
    id: 'leadership',
    title: 'Leadership & Conflict Resolver',
    bengaliTitle: 'লিডারশিপ ও টিম ক্রাইসিস ম্যানেজমেন্ট',
    desc: 'টিমের নেতৃত্ব দেওয়ার যোগ্যতা ও সহকর্মীদের সাথে জটিল দ্বন্দ্ব মেটানোর পরীক্ষা',
    icon: <Users className="w-5 h-5 text-emerald-600" />,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-100',
    questions: [
      {
        id: 'l1',
        scenario: 'একটি বড় সফটওয়্যার প্রজেক্ট সাবমিট করার শেষ ডেডলাইনের মাত্র ১ দিন আগে আপনার টিমের প্রধান ডেভেলপার অসুস্থ হয়ে দায়িত্ব থেকে ব্যাকআউট নিলেন। লিডার হিসেবে আপনার ভূমিকা:',
        options: [
          {
            text: 'প্রজেক্ট ডিরেক্টর ও কোম্পানির বসের কাছে গিয়ে সেই ডেভেলপারের অসুস্থতার নামে বড় নালিশ জারি করবেন।',
            points: 2,
            feedback: 'এটি বসের কাছে নেতিবাচক টিম ম্যানেজমেন্ট হিসেবে প্রতীয়মান হবে।'
          },
          {
            text: 'টিমের বাকি সদস্যদের নিয়ে বসবেন, অসমাপ্ত কাজগুলো বণ্টন করবেন এবং ক্লায়েন্টকে আগেই বিনীতভাবে পরিস্থিতি বুঝিয়ে সামান্য সময় চেয়ে মেইল করবেন।',
            points: 4,
            feedback: 'অনবদ্য! এটিকে বলে ক্রাইসিস সলিউশন এবং সাহসী লিডারশিপ প্র্যাকটিস।'
          },
          {
            text: 'হতাশাগ্রস্ত হয়ে কাজ সম্পূর্ণ বন্ধ করে দিবেন এবং বলবেন আমাদের দ্বারা এই কাজ অসম্ভব।',
            points: 1,
            feedback: 'চাপ বা সংকট মুহূর্তে ভেঙে পড়া দুর্বল মানসিকতার পরিচয় দেয়।'
          },
          {
            text: 'অসুস্থ সদস্যের বাসায় গিয়ে জোর করে অফিসে নিয়ে এসে কাজ করাবেন।',
            points: 1,
            feedback: 'এটি অমানবিক ও সহকর্মীর প্রতি সহানুভূতিহীন ব্যবহার যা টিমে হতাশা ছড়ায়।'
          }
        ]
      },
      {
        id: 'l2',
        scenario: 'আপনার প্রজেক্টের অধীন থাকা দুইজন জুনিয়র সহকর্মী নিজেদের মধ্যে ব্যক্তিগত অহংকার লড়াইয়ে মেতে কোনো ফাইল বা তথ্য একে অপরের সাথে শেয়ার ও কথা বলা বন্ধ করে দিয়েছেন। আপনি কী করবেন?',
        options: [
          {
            text: 'বিষয়টি অগ্রাহ্য করবেন, বলবেন এটি তাদের একান্ত ব্যক্তিগত বিষয়, কাজেই আমার কিছু করার নেই।',
            points: 2,
            feedback: 'সহকর্মীদের দ্বন্দ্ব প্রজেক্টের কাজে গভীর প্রভাব ফেলার আগে মেটানো লিডারের প্রধান দায়িত্ব।'
          },
          {
            text: 'দুজনকে আলাদাভাবে ডেকে তাদের সমস্যার কথা মনোযোগ দিয়ে শুনবেন এবং প্রজেক্টের বৃহত্তর স্বার্থে তাদের মিলিয়ে চমৎকার পেশাদার সমাধান দেবেন।',
            points: 4,
            feedback: 'অপূর্ব! দ্বন্দ্ব নিরসনকারী (Conflict Resolver) হিসেবে আপনি কর্পোরেটদের কাছে অত্যন্ত আকর্ষণীয়।'
          },
          {
            text: 'তাৎক্ষণিকভাবে দুজনকে কোনো আত্মপক্ষ সমর্থনের সুযোগ না দিয়ে অফিস থেকে বরখাস্ত বা নোটিশ করার হুমকি দিবেন।',
            points: 2,
            feedback: 'কঠোরতা দেখানোর পূর্বে ডেমোক্রেটিক উপায়ে বোঝার চেষ্টা করুন।'
          },
          {
            text: 'অফিসের বাকি কলিগদের সাথে নিয়ে কার দোষ তা নিয়ে গুঞ্জন বা হাসাহাসি করবেন।',
            points: 1,
            feedback: 'এটি অপেশাদার ও কুরুচিপূর্ণ কর্মপরিবেশের সৃষ্টি করে।'
          }
        ]
      }
    ]
  }
];

export const SkillAssessment: React.FC<SkillAssessmentProps> = ({ onBack, showToast }) => {
  const [activeTab, setActiveTab] = useState<'lobby' | 'quiz' | 'result'>('lobby');
  const [selectedTheme, setSelectedTheme] = useState<AssessmentTheme | null>(null);
  
  // Interactive Quiz States
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userSelections, setUserSelections] = useState<{ [key: number]: number }>({});
  const [completedPoints, setCompletedPoints] = useState<number>(0);

  const startAssessment = (theme: AssessmentTheme) => {
    setSelectedTheme(theme);
    setCurrentIndex(0);
    setUserSelections({});
    setCompletedPoints(0);
    setActiveTab('quiz');
    showToast(`${theme.bengaliTitle} প্রশ্নাবলী লোড হয়েছে!`, 'success');
  };

  const handleSelectOption = (optIdx: number) => {
    setUserSelections(prev => ({ ...prev, [currentIndex]: optIdx }));
  };

  const nextStep = () => {
    if (userSelections[currentIndex] === undefined) {
      showToast('অনুগ্রহ করে সঠিক আচরণটি চিহ্নিত করুন।', 'error');
      return;
    }

    if (selectedTheme && currentIndex < selectedTheme.questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      finishAssessment();
    }
  };

  const finishAssessment = () => {
    if (!selectedTheme) return;
    
    // Calculate total weighted points
    let pointsEarned = 0;
    selectedTheme.questions.forEach((q, qidx) => {
      const selectedOptIdx = userSelections[qidx];
      const opt = q.options[selectedOptIdx];
      pointsEarned += opt.points;
    });

    setCompletedPoints(pointsEarned);
    setActiveTab('result');
    showToast('আপনার প্রফেশনাল স্কিল অ্যাসেসমেন্ট সম্পন্ন হয়েছে!', 'success');
  };

  // Profile generator based on scores
  const getSkillProfile = (points: number) => {
    const maxPoints = (selectedTheme?.questions.length || 2) * 4;
    const ratio = points / maxPoints;

    if (ratio >= 0.8) {
      return {
        title: 'প্রো-অ্যাক্টিভ ও স্ট্রাটেজিক লিডার (Strategic Leader)',
        scoreLabel: 'অসাধারণ (Exceptional)',
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200',
        feedback: 'আপনার আত্মনিয়ন্ত্রণ, পেশাদারিত্ব এবং মানবিক সংবেদনশীলতা কর্পোরেট ম্যানেজারদের জন্য এক উজ্জ্বল দৃষ্টান্ত। যেকোনো সংকট মুহূর্তে আপনি ঠাণ্ডা মাথায় প্রবলেম ম্যানেজ করতে সক্ষম।'
      };
    } else if (ratio >= 0.5) {
      return {
        title: 'মেথডিক্যাল টিম প্লেয়ার (Collaborative Team Player)',
        scoreLabel: 'ভালো (Satisfactory)',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        feedback: 'আপনার আচরণ কর্মক্ষেত্রের পরিবেশ অনুকূলে রাখার জন্য ইতিবাচক। তবে জটিল পরিস্থিতিতে বা ক্লায়েন্ট ডিলিংয়ের সময় আরেকটু দৃঢ় ও সৃজনশীল উপায়ে নেতৃত্ব প্রকাশ করতে পারেন।'
      };
    } else {
      return {
        title: 'লার্নিং কোলাবোরেশন মেম্বার (Needs Guidance)',
        scoreLabel: 'উন্নতি করতে হবে (Action Required)',
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        feedback: 'চাপ বা সংকটময় সময়ে আপনার মাঝে দ্রুত আবেগ বা ক্ষোভ উসকে যাওয়ার একটি সূক্ষ্ম প্রবণতা লক্ষ্য করা যাচ্ছে। কাজের জায়গার সফলতা অনেকখানি নম্রতা ও বিনীত নেগোশিয়েশনের ওপর নির্ভর করে।'
      };
    }
  };

  const activeQuestion = selectedTheme?.questions[currentIndex];
  const profile = getSkillProfile(completedPoints);

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-bengali text-gray-700 select-none pb-12 px-2 md:px-4">
      
      {/* 1. LOBBY CONTAINER */}
      {activeTab === 'lobby' && (
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
                  <UserCheck className="w-6 h-6 text-emerald-600" />
                  সফ্ট স্কিল ও অ্যাটিটিউড অ্যাসেসমেন্ট
                </h1>
                <p className="text-xs text-gray-500 mt-1">
                  কর্মক্ষেত্রে বড় বড় রিক্রুটাররা আপনার শিক্ষাগত যোগ্যতার চেয়ে আচরণ কেমন তা বেশি যাচাই করেন
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-6 rounded-3xl border border-emerald-100 flex items-start gap-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md">
              <Zap className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-emerald-950">কেন এই পরীক্ষাটি প্রয়োজনীয়?</h3>
              <p className="text-xs text-emerald-900/80 leading-relaxed font-medium">
                ইন্টারভিউ রুমে ভাইভায় কিছু বাস্তব পরিস্থিতি দিয়ে আপনার সহ্য ক্ষমতা, পরিস্থিতি নিয়ন্ত্রণ দক্ষতা ও দলের সহকর্মীদের সাথে জটিলতা সমাধানের স্পিরিট নির্ধারণ করা হয়। নিচে ক্লিক করে আপনার যোগ্যতা মানুন।
              </p>
            </div>
          </div>

          {/* Theme list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ASSESSMENT_THEMES.map(theme => (
              <div 
                key={theme.id}
                onClick={() => startAssessment(theme)}
                className="p-6 bg-white rounded-3xl border border-gray-100 hover:border-emerald-300 transition-all cursor-pointer space-y-4 hover:shadow-lg shadow-sm group text-left"
              >
                <div className="w-12 h-12 rounded-2xl bg-gray-50 group-hover:bg-emerald-50 flex items-center justify-center transition-colors">
                  {theme.icon}
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm md:text-base font-bold text-gray-950 group-hover:text-emerald-700 transition-colors">
                    {theme.bengaliTitle}
                  </h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {theme.desc}
                  </p>
                </div>
                <button
                  className="px-4 py-2 bg-gray-50 group-hover:bg-emerald-600 text-gray-600 group-hover:text-white rounded-xl text-xs font-bold transition-all w-full text-center border border-gray-100"
                >
                  পরীক্ষায় অংশ নিন
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. ACTIVE QUIZ TEST STATE */}
      {activeTab === 'quiz' && selectedTheme && activeQuestion && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-3xl border border-gray-100 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (confirm('আপনি কি সত্যিই পরীক্ষা থেকে বের হতে চান? অগ্রগতি সংরক্ষিত হবে না।')) {
                    setActiveTab('lobby');
                  }
                }}
                className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center border text-gray-500"
              >
                <ArrowLeft className="w-4.5 h-4.5" />
              </button>
              <div>
                <h4 className="text-xs font-bold text-gray-950">{selectedTheme.bengaliTitle}</h4>
                <p className="text-[10px] text-gray-400 mt-0.5">পরিস্থিতিভিত্তিক সঠিক মানসিক প্রতিক্রিয়া বাছাই করুন</p>
              </div>
            </div>

            <div className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
              প্রশ্ন: {currentIndex + 1} / {selectedTheme.questions.length}
            </div>
          </div>

          {/* Scenario question container */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 space-y-6 shadow-sm">
            <div className="flex gap-2.5 items-start">
              <HelpCircle className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                  বাস্তবিক সিচুয়েশন বা পরিস্থিতি (Scenario)
                </span>
                <h3 className="text-base md:text-lg font-bold text-gray-950 leading-relaxed font-bengali">
                  {activeQuestion.scenario}
                </h3>
              </div>
            </div>

            {/* Answer option nodes */}
            <div className="space-y-3 pt-3">
              {activeQuestion.options.map((opt, optIdx) => {
                const isSelected = userSelections[currentIndex] === optIdx;
                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={cn(
                      "w-full text-left p-4 rounded-2xl text-xs md:text-sm font-medium border flex items-center justify-between transition-all leading-relaxed",
                      isSelected
                        ? "bg-emerald-600 border-emerald-600 text-white shadow-md font-bold text-left"
                        : "bg-white border-gray-100 hover:border-emerald-200 text-gray-700"
                    )}
                  >
                    <span className="pr-4">{opt.text}</span>
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

          <button
            onClick={nextStep}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold transition-all text-xs md:text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-50"
          >
            {currentIndex < selectedTheme.questions.length - 1 ? 'পরবর্তী সিচুয়েশনে যান' : 'অ্যাসেসমেন্ট ফলাফল দেখুন'}
            <ChevronRight className="w-4.5 h-4.5" />
          </button>
        </div>
      )}

      {/* 3. DIAGNOSTIC RESULTS STATE CONTAINER */}
      {activeTab === 'result' && selectedTheme && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-xl md:text-2xl font-black text-gray-950 flex items-center gap-2">
              <Award className="w-7 h-7 text-emerald-600" />
              ব্যক্তিত্ব ও সফ্ট স্কিল ফলাফল
            </h1>
            <button
              onClick={() => setActiveTab('lobby')}
              className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-emerald-100"
            >
              <RotateCcw className="w-4 h-4" />
              অন্যান্য স্কিল টেস্ট দিন
            </button>
          </div>

          {/* Personality report card design */}
          <div className={cn(
            "p-8 rounded-3xl border transition-all text-center space-y-6 shadow-sm",
            profile.bgColor,
            profile.borderColor
          )}>
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md mx-auto">
              <UserCheck className="w-8 h-8 text-emerald-600" />
            </div>
            
            <div className="space-y-1">
              <span className="text-xs uppercase font-bold tracking-wider text-gray-400 font-sans block">
                YOUR COGNITIVE PROFILE / প্রোফাইল
              </span>
              <h2 className="text-lg md:text-xl font-black text-gray-950">
                {profile.title}
              </h2>
              <div className="inline-block px-3 py-1 bg-white text-emerald-700 font-bold border rounded-full text-[10px] uppercase mt-1">
                আইডেন্টিটি মান: {profile.scoreLabel}
              </div>
            </div>

            <p className="text-xs md:text-sm leading-relaxed text-gray-700 max-w-xl mx-auto font-medium">
              {profile.feedback}
            </p>
          </div>

          {/* Action highlights step by step */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider font-sans px-1">
              RECOMMENDED CAREER GROWTH / সমাধান সমাধানাবলি ও পরামর্শ
            </h3>

            <div className="space-y-3">
              {selectedTheme.questions.map((q, qidx) => {
                const userSel = userSelections[qidx];
                const opt = q.options[userSel];
                const isBest = opt.points === 4;

                return (
                  <div key={qidx} className="bg-white p-5 rounded-3xl border border-gray-100 space-y-3 shadow-sm">
                    <h4 className="font-bold text-xs text-gray-400">পরিস্থিতি {qidx + 1}</h4>
                    <p className="text-xs font-bold text-gray-950 leading-relaxed font-bengali">
                      {q.scenario}
                    </p>
                    
                    {/* User\'s Selection Feedback */}
                    <div className={cn(
                      "p-4 rounded-2xl border text-xs leading-relaxed font-medium space-y-1.5",
                      isBest 
                        ? "bg-emerald-50/50 border-emerald-150 text-emerald-950" 
                        : "bg-amber-50/50 border-amber-100 text-amber-950"
                    )}>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold">আপনার নির্বাচিত আচরণ:</span>
                        <span className="font-semibold text-gray-500 font-sans text-[11px]">({opt.points} / ৪ পয়েন্ট)</span>
                      </div>
                      <p className="text-xs italic text-gray-700">
                        "{opt.text}"
                      </p>
                      <div className="pt-2 border-t border-dashed border-gray-250 font-sans">
                        <strong className="font-bold text-gray-950 font-bengali block mb-1">প্রফেশনাল গাইড রিলিজ:</strong> {opt.feedback}
                      </div>
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

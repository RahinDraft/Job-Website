import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  BookOpen, 
  Search, 
  CheckCircle, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Award, 
  Lightbulb, 
  GraduationCap, 
  Share2, 
  Bookmark, 
  BookmarkCheck,
  Zap,
  FileText,
  Check,
  Calendar,
  RotateCcw,
  AlertCircle,
  Plus,
  Trash2,
  HelpCircle,
  TrendingUp,
  Briefcase,
  User,
  ShieldAlert
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  SUBJECT_LESSONS_DATA,
  PAST_QUESTIONS_DATA,
  FLASHCARDS_DATA,
  MNEMONICS_DATA,
  STUDY_ROUTINES_DATA,
  Subject,
  Topic,
  PastQuestion,
  Flashcard,
  MnemonicTrick
} from '../data/preparationData';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SubjectLessonsProps {
  onBack: () => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const SubjectLessons: React.FC<SubjectLessonsProps> = ({ onBack, showToast }) => {
  // Navigation tabs state
  const [activeTab, setActiveTab] = useState<'lecture' | 'question_bank' | 'flashcards' | 'mnemonics' | 'routine' | 'contribute'>('lecture');

  // Dynamic Content States loaded from defaults + localStorage custom contributions
  const [subjectLessons, setSubjectLessons] = useState<Subject[]>(() => {
    const localCustom = localStorage.getItem('shadhin_custom_topics');
    let customTopics: { subjectId: string; topic: Topic }[] = [];
    if (localCustom) {
      try {
        customTopics = JSON.parse(localCustom);
      } catch (e) {
        console.error(e);
      }
    }
    return SUBJECT_LESSONS_DATA.map(subj => {
      const matched = customTopics.filter(item => item.subjectId === subj.id).map(item => item.topic);
      return {
        ...subj,
        topics: [...subj.topics, ...matched]
      };
    });
  });

  const [pastQuestions, setPastQuestions] = useState<PastQuestion[]>(() => {
    const localCustom = localStorage.getItem('shadhin_custom_past_questions');
    let customQuestions: PastQuestion[] = [];
    if (localCustom) {
      try {
        customQuestions = JSON.parse(localCustom);
      } catch (e) {
        console.error(e);
      }
    }
    return [...PAST_QUESTIONS_DATA, ...customQuestions];
  });

  const [flashcards, setFlashcards] = useState<Flashcard[]>(() => {
    const localCustom = localStorage.getItem('shadhin_custom_flashcards');
    let customCards: Flashcard[] = [];
    if (localCustom) {
      try {
        customCards = JSON.parse(localCustom);
      } catch (e) {
        console.error(e);
      }
    }
    return [...FLASHCARDS_DATA, ...customCards];
  });

  const [mnemonics, setMnemonics] = useState<MnemonicTrick[]>(() => {
    const localCustom = localStorage.getItem('shadhin_custom_mnemonics');
    let customMnemonics: MnemonicTrick[] = [];
    if (localCustom) {
      try {
        customMnemonics = JSON.parse(localCustom);
      } catch (e) {
        console.error(e);
      }
    }
    return [...MNEMONICS_DATA, ...customMnemonics];
  });

  // Contribution Form states
  const [contributorRole, setContributorRole] = useState<'user' | 'admin'>('user');
  const [contributionType, setContributionType] = useState<'past_question' | 'lecture' | 'flashcard' | 'mnemonic'>('past_question');

  // Form inputs
  const [pqExamName, setPqExamName] = useState('');
  const [pqYear, setPqYear] = useState('২০২৬');
  const [pqCategory, setPqCategory] = useState<'bcs' | 'bank' | 'primary'>('bcs');
  const [pqText, setPqText] = useState('');
  const [pqOptions, setPqOptions] = useState<string[]>(['', '', '', '']);
  const [pqCorrectIdx, setPqCorrectIdx] = useState<number>(0);
  const [pqExplanation, setPqExplanation] = useState('');

  const [lecSubjectId, setLecSubjectId] = useState('bangla');
  const [lecTitle, setLecTitle] = useState('');
  const [lecTag, setLecTag] = useState('নতুন বিসিএস রেকমেন্ডেশন');
  const [lecContent, setLecContent] = useState('');
  const [lecHack, setLecHack] = useState('');
  const [lecQuizQ, setLecQuizQ] = useState('');
  const [lecQuizOptions, setLecQuizOptions] = useState<string[]>(['', '', '', '']);
  const [lecQuizCorrectIdx, setLecQuizCorrectIdx] = useState<number>(0);
  const [lecQuizExplanation, setLecQuizExplanation] = useState('');

  const [fcCategory, setFcCategory] = useState('english');
  const [fcFront, setFcFront] = useState('');
  const [fcBack, setFcBack] = useState('');
  const [fcHint, setFcHint] = useState('');

  const [mnCategory, setMnCategory] = useState('বাংলা সাহিত্য');
  const [mnTitle, setMnTitle] = useState('');
  const [mnFormula, setMnFormula] = useState('');
  const [mnExplanation, setMnExplanation] = useState('');
  const [mnExample, setMnExample] = useState('');

  // Other Interactive States
  const [activeSubject, setActiveSubject] = useState<string>('bangla');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [userProgress, setUserProgress] = useState<{ [key: string]: boolean }>({});
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<{ [key: string]: boolean }>({});

  const [pastQFilter, setPastQFilter] = useState<'all' | 'bcs' | 'bank' | 'primary'>('all');
  const [pastQSearch, setPastQSearch] = useState<string>('');
  const [revealedAnswers, setRevealedAnswers] = useState<{ [key: string]: boolean }>({});

  const [flashcardFilter, setFlashcardFilter] = useState<string>('all');
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [masteredCards, setMasteredCards] = useState<{ [key: string]: boolean }>({});

  const [mnemonicSearch, setMnemonicSearch] = useState<string>('');

  const [activeRoutineId, setActiveRoutineId] = useState<string>('bcs_90');
  const [completedRoutineTasks, setCompletedRoutineTasks] = useState<{ [key: string]: boolean }>({});
  const [studyStreak, setStudyStreak] = useState<number>(3);
  const [customGoals, setCustomGoals] = useState<string[]>([]);
  const [newGoalInput, setNewGoalInput] = useState<string>('');
  const [completedCustomGoals, setCompletedCustomGoals] = useState<{ [key: string]: boolean }>({});

  // Load progress and custom data on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('shadhin_subject_progress');
    if (savedProgress) {
      try { setUserProgress(JSON.parse(savedProgress)); } catch (e) {}
    }

    const savedMastered = localStorage.getItem('shadhin_mastered_cards');
    if (savedMastered) {
      try { setMasteredCards(JSON.parse(savedMastered)); } catch (e) {}
    }

    const savedRoutineTasks = localStorage.getItem('shadhin_completed_routine_tasks');
    if (savedRoutineTasks) {
      try { setCompletedRoutineTasks(JSON.parse(savedRoutineTasks)); } catch (e) {}
    }

    const savedCustomGoals = localStorage.getItem('shadhin_custom_goals');
    if (savedCustomGoals) {
      try { setCustomGoals(JSON.parse(savedCustomGoals)); } catch (e) {}
    }

    const savedCompletedCustom = localStorage.getItem('shadhin_completed_custom_goals');
    if (savedCompletedCustom) {
      try { setCompletedCustomGoals(JSON.parse(savedCompletedCustom)); } catch (e) {}
    }
    
    const savedStreak = localStorage.getItem('shadhin_study_streak');
    if (savedStreak) {
      setStudyStreak(parseInt(savedStreak, 10));
    } else {
      localStorage.setItem('shadhin_study_streak', '3');
    }
  }, []);

  const toggleProgress = (topicId: string) => {
    const updated = { ...userProgress, [topicId]: !userProgress[topicId] };
    setUserProgress(updated);
    localStorage.setItem('shadhin_subject_progress', JSON.stringify(updated));
    
    if (updated[topicId]) {
      showToast('টপিকটি সম্পন্ন হয়েছে হিসেবে চিহ্নিত করা হয়েছে! আপনার পড়ার স্ট্রীক বৃদ্ধি পেয়েছে। 🔥', 'success');
      const nextStreak = studyStreak + 1;
      setStudyStreak(nextStreak);
      localStorage.setItem('shadhin_study_streak', nextStreak.toString());
    } else {
      showToast('টপিকটি সম্পন্ন তালিকা থেকে সরানো হয়েছে।', 'info');
    }
  };

  const handleQuizAnswer = (topicId: string, answerIdx: number) => {
    if (quizSubmitted[topicId]) return;
    setQuizAnswers(prev => ({ ...prev, [topicId]: answerIdx }));
  };

  const submitQuiz = (topicId: string, correctIdx: number) => {
    if (quizAnswers[topicId] === undefined) {
      showToast('অনুগ্রহ করে একটি উত্তর সিলেক্ট করুন।', 'error');
      return;
    }
    setQuizSubmitted(prev => ({ ...prev, [topicId]: true }));
    if (quizAnswers[topicId] === correctIdx) {
      showToast('কুইজে অভিনন্দন! আপনার উত্তরটি সঠিক হয়েছে। 🎉', 'success');
    } else {
      showToast('উত্তরটি সঠিক হয়নি। ব্যাখ্যাটি নিচে পড়ুন। 💡', 'error');
    }
  };

  const handleShare = (title: string) => {
    const shareText = `${title} - চাকরির অসাধারণ প্রস্তুতি নিন দেশের সেরা স্বাধীন ড্যাশবোর্ড থেকে! ${window.location.origin}`;
    if (navigator.share) {
      navigator.share({
        title: title,
        text: `স্বাধীন ক্যারিয়ার পোর্টাল প্রস্তুতি কর্নার: ${title}`,
        url: window.location.origin,
      }).catch(() => {
        navigator.clipboard.writeText(shareText);
        showToast('প্রস্তুতি লিংক ক্লিপবোর্ডে কপি করা হয়েছে!', 'success');
      });
    } else {
      navigator.clipboard.writeText(shareText);
      showToast('প্রস্তুতি লিংক ক্লিপবোর্ডে কপি করা হয়েছে!', 'success');
    }
  };

  const toggleRevealAnswer = (id: string) => {
    setRevealedAnswers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleMasteredCard = (cardId: string) => {
    const updated = { ...masteredCards, [cardId]: !masteredCards[cardId] };
    setMasteredCards(updated);
    localStorage.setItem('shadhin_mastered_cards', JSON.stringify(updated));
    if (updated[cardId]) {
      showToast('অভিনন্দন! কার্ডটি সফলভাবে আয়ত্ত তালিকায় যুক্ত হলো। 🧠', 'success');
    } else {
      showToast('কার্ডটিকে রিভিশন তালিকায় ফেরত পাঠানো হয়েছে।', 'info');
    }
  };

  const toggleRoutineTaskCompleted = (taskId: string) => {
    const updated = { ...completedRoutineTasks, [taskId]: !completedRoutineTasks[taskId] };
    setCompletedRoutineTasks(updated);
    localStorage.setItem('shadhin_completed_routine_tasks', JSON.stringify(updated));
    if (updated[taskId]) {
      showToast('আজকের নির্ধারিত রুটিন টাস্ক সফলভাবে সম্পন্ন! দেশ গড়ার প্রস্তুতি নিন। 🚀', 'success');
    }
  };

  const addCustomGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalInput.trim()) return;
    const updated = [...customGoals, newGoalInput.trim()];
    setCustomGoals(updated);
    localStorage.setItem('shadhin_custom_goals', JSON.stringify(updated));
    setNewGoalInput('');
    showToast('নতুন স্টাডি গোল বা টার্গেট যুক্ত করা হয়েছে!', 'success');
  };

  const removeCustomGoal = (idx: number) => {
    const textToRemove = customGoals[idx];
    const updated = customGoals.filter((_, i) => i !== idx);
    setCustomGoals(updated);
    localStorage.setItem('shadhin_custom_goals', JSON.stringify(updated));

    const updatedCompleted = { ...completedCustomGoals };
    delete updatedCompleted[textToRemove];
    setCompletedCustomGoals(updatedCompleted);
    localStorage.setItem('shadhin_completed_custom_goals', JSON.stringify(updatedCompleted));

    showToast('স্টাডি টার্গেটটি সফলভাবে রিমুভ করা হয়েছে।', 'info');
  };

  const toggleCustomGoalComplete = (text: string) => {
    const updated = { ...completedCustomGoals, [text]: !completedCustomGoals[text] };
    setCompletedCustomGoals(updated);
    localStorage.setItem('shadhin_completed_custom_goals', JSON.stringify(updated));
    if (updated[text]) {
      showToast('দারুণ! আপনার ব্যক্তিগত স্টাডি গোল অর্জিত হয়েছে। 🎯', 'success');
    }
  };

  // Submit handers for newly proposed admin/user contributions
  const handleAddPastQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pqExamName || !pqText || pqOptions.some(o => !o)) {
      showToast('অনুগ্রহ করে সমস্ত আবশ্যিক ফিল্ড পূরণ করুন।', 'error');
      return;
    }
    const newQuestion: PastQuestion = {
      id: `custom_pq_${Date.now()}`,
      examName: pqExamName,
      year: pqYear,
      category: pqCategory,
      questionText: pqText,
      options: [...pqOptions],
      correctIndex: pqCorrectIdx,
      explanation: pqExplanation || 'কোনো সমাধান বা ব্যাখ্যা প্রদান করা হয়নি।'
    };

    const localCustom = localStorage.getItem('shadhin_custom_past_questions');
    let customQuestions: PastQuestion[] = [];
    if (localCustom) {
      try { customQuestions = JSON.parse(localCustom); } catch (err) {}
    }
    customQuestions.unshift(newQuestion);
    localStorage.setItem('shadhin_custom_past_questions', JSON.stringify(customQuestions));
    setPastQuestions([...PAST_QUESTIONS_DATA, ...customQuestions]);

    setPqExamName('');
    setPqText('');
    setPqOptions(['', '', '', '']);
    setPqCorrectIdx(0);
    setPqExplanation('');

    if (contributorRole === 'admin') {
      showToast('নতুন বিগত সালের প্রশ্নটি সফলভাবে এডমিন হিসেবে প্রকাশ করা হয়েছে! বিগত প্রশ্ন ব্যাংক ট্যাবে দেখুন। 🎉', 'success');
    } else {
      showToast('কন্ট্রিবিউশনটি জমা হয়েছে এবং এডমিন পর্যালোচনার জন্য পাঠানো হয়েছে! আপনার ডিভাইসে এখনই লাইভ। 🚀', 'success');
    }
  };

  const handleAddLecture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lecTitle || !lecContent || !lecQuizQ || lecQuizOptions.some(o => !o)) {
      showToast('অনুগ্রহ করে সমস্ত আবশ্যিক ফিল্ড পূরণ করুন।', 'error');
      return;
    }
    const newTopic: Topic = {
      id: `custom_lec_${Date.now()}`,
      title: lecTitle,
      importantTag: lecTag,
      content: lecContent,
      quickHack: lecHack || 'কোনো সর্টকাট নেই',
      quiz: {
        question: lecQuizQ,
        options: [...lecQuizOptions],
        answerIndex: lecQuizCorrectIdx,
        explanation: lecQuizExplanation || 'কোনো সমাধান বা ব্যাখ্যা নেই'
      }
    };

    const localCustom = localStorage.getItem('shadhin_custom_topics');
    let customTopics: { subjectId: string; topic: Topic }[] = [];
    if (localCustom) {
      try { customTopics = JSON.parse(localCustom); } catch (err) {}
    }
    customTopics.unshift({ subjectId: lecSubjectId, topic: newTopic });
    localStorage.setItem('shadhin_custom_topics', JSON.stringify(customTopics));

    setSubjectLessons(SUBJECT_LESSONS_DATA.map(subj => {
      const matched = customTopics.filter(item => item.subjectId === subj.id).map(item => item.topic);
      return {
        ...subj,
        topics: [...subj.topics, ...matched]
      };
    }));

    setLecTitle('');
    setLecContent('');
    setLecHack('');
    setLecQuizQ('');
    setLecQuizOptions(['', '', '', '']);
    setLecQuizCorrectIdx(0);
    setLecQuizExplanation('');

    if (contributorRole === 'admin') {
      showToast('লেকচার ও কুইজ সফলভাবে এডমিন হিসেবে লাইভ করা হয়েছে! বিষয়ভিত্তিক লেকচার ট্যাবে এটি দেখুন। 🎉', 'success');
    } else {
      showToast('লেকচার কন্ট্রিবিউশন দাখিল করা হয়েছে! আপনার ডিভাইসে এখনই কার্যকর। 🚀', 'success');
    }
  };

  const handleAddFlashcard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fcFront || !fcBack) {
      showToast('অনুগ্রহ করে ফ্রন্ট ও ব্যাক উভয় অংশ পূরণ করুন।', 'error');
      return;
    }
    const categoriesLabels: { [key: string]: string } = {
      english: 'ইংরেজি ভোকেব',
      constitution: 'সংবিধান আর্ট',
      gk: 'সাধারণ জ্ঞান',
      math: 'গণিত সূত্রসমূহ'
    };
    const newCard: Flashcard = {
      id: `custom_fc_${Date.now()}`,
      category: fcCategory as any,
      categoryLabel: categoriesLabels[fcCategory] || 'কাস্টম স্মার্ট কার্ড',
      front: fcFront,
      back: fcBack,
      hint: fcHint || undefined
    };

    const localCustom = localStorage.getItem('shadhin_custom_flashcards');
    let customCards: Flashcard[] = [];
    if (localCustom) {
      try { customCards = JSON.parse(localCustom); } catch (err) {}
    }
    customCards.unshift(newCard);
    localStorage.setItem('shadhin_custom_flashcards', JSON.stringify(customCards));
    setFlashcards([...FLASHCARDS_DATA, ...customCards]);

    setFcFront('');
    setFcBack('');
    setFcHint('');

    if (contributorRole === 'admin') {
      showToast('ফ্ল্যাশ কার্ডটি সরাসরি এডমিন মোডে যুক্ত হয়াছে। স্মার্ট ফ্ল্যাশ কার্ড ট্যাবে দেখুন! 🎉', 'success');
    } else {
      showToast('ফ্ল্যাশ কার্ড রিভিউয়ের জন্য পাঠানো হয়েছে। আপনার জন্য এখনই দৃশ্যমান। 🚀', 'success');
    }
  };

  const handleAddMnemonic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mnTitle || !mnFormula || !mnExplanation) {
      showToast('অনুগ্রহ করে সমস্ত তথ্য দিন।', 'error');
      return;
    }
    const newMnemonic: MnemonicTrick = {
      id: `custom_mn_${Date.now()}`,
      category: mnCategory,
      title: mnTitle,
      formula: mnFormula,
      explanation: mnExplanation,
      example: mnExample || 'উদাহরণ প্রয়োজন নেই'
    };

    const localCustom = localStorage.getItem('shadhin_custom_mnemonics');
    let customMnemonics: MnemonicTrick[] = [];
    if (localCustom) {
      try { customMnemonics = JSON.parse(localCustom); } catch (err) {}
    }
    customMnemonics.unshift(newMnemonic);
    localStorage.setItem('shadhin_custom_mnemonics', JSON.stringify(customMnemonics));
    setMnemonics([...MNEMONICS_DATA, ...customMnemonics]);

    setMnTitle('');
    setMnFormula('');
    setMnExplanation('');
    setMnExample('');

    if (contributorRole === 'admin') {
      showToast('মনে রাখার ছন্দ ও মেমরি ট্রিক সরাসরি লাইভ করা হয়েছে! ছন্দ ট্যাবে এটি দেখুন। 🎉', 'success');
    } else {
      showToast('ছন্দ ট্রিক কন্ট্রিবিউট হয়েছে! পর্যালোচনার পর লাইভ হবে। আপনার ড্যাশবোর্ডে এখনই দৃশ্যমান। 🚀', 'success');
    }
  };

  const clearAllCustomContributions = () => {
    localStorage.removeItem('shadhin_custom_topics');
    localStorage.removeItem('shadhin_custom_past_questions');
    localStorage.removeItem('shadhin_custom_flashcards');
    localStorage.removeItem('shadhin_custom_mnemonics');

    setSubjectLessons(SUBJECT_LESSONS_DATA);
    setPastQuestions(PAST_QUESTIONS_DATA);
    setFlashcards(FLASHCARDS_DATA);
    setMnemonics(MNEMONICS_DATA);

    showToast('আপনার সমস্ত কাস্টম কন্ট্রিবিউশন মুছে ফেলা হয়েছে এবং ডিফল্ট ড্যাটা রিস্টোর করা হয়েছে।', 'info');
  };

  // Subject Object Resolver
  const currentSubjectObj = subjectLessons.find(s => s.id === activeSubject) || subjectLessons[0];

  // Filters for Lectures
  const filteredTopics = currentSubjectObj.topics.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filters for Question Bank
  const filteredPastQuestions = pastQuestions.filter(pq => {
    const matchesFilter = pastQFilter === 'all' || pq.category === pastQFilter;
    const matchesSearch = pq.questionText.toLowerCase().includes(pastQSearch.toLowerCase()) ||
                          pq.examName.toLowerCase().includes(pastQSearch.toLowerCase()) ||
                          pq.explanation.toLowerCase().includes(pastQSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Filter and Select Active Flashcards
  const totalCategoryFlashcards = flashcards.filter(fc => flashcardFilter === 'all' || fc.category === flashcardFilter);
  const activeFlashcard = totalCategoryFlashcards[activeCardIndex] || null;

  // Filter Mnemonics
  const filteredMnemonics = mnemonics.filter(m => 
    m.title.toLowerCase().includes(mnemonicSearch.toLowerCase()) ||
    m.formula.toLowerCase().includes(mnemonicSearch.toLowerCase()) ||
    m.explanation.toLowerCase().includes(mnemonicSearch.toLowerCase())
  );

  // Statistics calculation
  const totalLecturesCount = subjectLessons.reduce((acc, s) => acc + s.topics.length, 0);
  const completedLecturesCount = Object.values(userProgress).filter(Boolean).length;
  const progressPercent = totalLecturesCount > 0 
    ? Math.round((completedLecturesCount / totalLecturesCount) * 100) 
    : 0;

  // Selected preset routine object
  const currentRoutineObj = STUDY_ROUTINES_DATA.find(r => r.id === activeRoutineId) || STUDY_ROUTINES_DATA[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-bengali text-gray-700 select-none pb-12 px-2 md:px-4 font-bengali">
      
      {/* 1. Header Navigation Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-2xl bg-gray-50 hover:bg-emerald-50 text-gray-600 hover:text-emerald-600 flex items-center justify-center transition-all border border-gray-100 shrink-0"
            id="back_to_dashboard_btn"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-gray-950 flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-emerald-600 shrink-0" />
              স্মার্ট ক্যারিয়ার প্রস্তুতি হাব
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              বিসিএস, প্রাইমারী, সরকারি ব্যাংক ও মন্ত্রণালয় পরীক্ষার অল-ইন-ওয়ান স্টাডি ডেক
            </p>
          </div>
        </div>

        {/* Dynamic Multi-Stat badge */}
        <div className="flex flex-row items-center gap-3 w-full md:w-auto">
          {/* Fire Streak Badge */}
          <div className="p-3 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-2 shrink-0">
            <span className="text-xl">🔥</span>
            <div>
              <div className="text-[10px] uppercase font-bold text-rose-500">স্টাডি স্ট্রীক</div>
              <div className="text-xs font-black text-rose-950">{studyStreak} দিন ক্রমান্বয়ে</div>
            </div>
          </div>
          {/* Progress Percent Card */}
          <div className="flex-1 md:w-48 p-3 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-sans text-xs font-bold shrink-0">
              {progressPercent}%
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-emerald-600">লেকচার প্রগ্রেস</div>
              <div className="text-xs font-semibold text-emerald-950">{completedLecturesCount}/{totalLecturesCount} টি সম্পূর্ণ</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top-Level Professional Tabs */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100 shadow-xs">
        {[
          { id: 'lecture', label: 'বিষয়ভিত্তিক লেকচার', icon: <BookOpen className="w-4 h-3.5" /> },
          { id: 'question_bank', label: 'বিগত প্রশ্ন ব্যাংক', icon: <FileText className="w-4 h-3.5" /> },
          { id: 'flashcards', label: 'স্মার্ট ফ্ল্যাশ কার্ড', icon: <Zap className="w-4 h-3.5" /> },
          { id: 'mnemonics', label: 'মুখস্থ রাখার ছন্দ', icon: <Sparkles className="w-4 h-3.5" /> },
          { id: 'routine', label: 'স্টাডি রুটিন', icon: <Calendar className="w-4 h-3.5" /> },
          { id: 'contribute', label: 'কন্টেন্ট কন্ট্রিবিউটর', icon: <Plus className="w-4 h-3.5" /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              setIsFlipped(false);
              setActiveCardIndex(0);
            }}
            id={`tab_select_${tab.id}`}
            className={cn(
              "flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 sm:py-3 px-1 rounded-xl text-[10px] sm:text-xs font-bold transition-all",
              activeTab === tab.id
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-100/30"
                : "text-gray-655 hover:text-emerald-700 hover:bg-white"
            )}
          >
            {tab.icon}
            <span className="text-[10px] sm:text-xs text-center">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 3. Tab Contents Layout */}
      <div className="space-y-6">

        {/* ==================== A. SUBJECTWISE LECTURES AND QUIZZES ==================== */}
        {activeTab === 'lecture' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Subject Selector Sidebar */}
            <div className="md:col-span-1 bg-white p-4 rounded-3xl border border-gray-150 space-y-3 h-fit">
              <h3 className="text-xs font-bold text-gray-400 px-2 pb-1 uppercase tracking-wider font-sans">
                SELECT SUBJECT / বিষয়সমূহ
              </h3>
              <div className="space-y-1.5">
                {subjectLessons.map(subject => {
                  const numLectures = subject.topics.length;
                  const completedLectures = subject.topics.filter(t => userProgress[t.id]).length;
                  return (
                    <button
                      key={subject.id}
                      onClick={() => {
                        setActiveSubject(subject.id);
                        setSearchQuery('');
                        setExpandedTopic(null);
                      }}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-xs md:text-sm font-bold transition-all border text-left",
                        activeSubject === subject.id
                          ? "bg-emerald-55 border-emerald-500 text-emerald-900 shadow-xs"
                          : "bg-white border-gray-50 hover:border-gray-250 text-gray-600"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base sm:text-lg">
                          {subject.id === 'bangla' ? '✍️' : subject.id === 'english' ? '🔤' : subject.id === 'math' ? '🔢' : subject.id === 'gk' ? '🌎' : '💻'}
                        </span>
                        <span>{subject.bengaliName}</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                        {completedLectures}/{numLectures}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Core Lectures Feed and Quizzes */}
            <div className="md:col-span-2 space-y-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="লেকচার বা ট্রিকস কিওয়ার্ড দিয়ে খুঁজুন..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-150 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs md:text-sm shadow-sm font-sans"
                />
              </div>

              <div className="space-y-4">
                {filteredTopics.length > 0 ? (
                  filteredTopics.map((topic, index) => {
                    const isExpanded = expandedTopic === topic.id;
                    const isCompleted = !!userProgress[topic.id];
                    const selectedAns = quizAnswers[topic.id];
                    const isSubmitted = !!quizSubmitted[topic.id];

                    return (
                      <div 
                        key={topic.id}
                        className={cn(
                          "bg-white rounded-3xl border transition-all duration-300 overflow-hidden shadow-xs",
                          isExpanded ? "border-emerald-300 shadow-sm" : "border-gray-100 hover:border-gray-200"
                        )}
                      >
                        {/* Header bar */}
                        <div 
                          onClick={() => setExpandedTopic(isExpanded ? null : topic.id)}
                          className="p-5 flex justify-between items-start gap-3 cursor-pointer select-none"
                        >
                          <div className="flex-1 space-y-1">
                            <div className="flex flex-wrap items-center gap-2 animate-fadeIn">
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase">
                                ক্লাস-নোট {index + 1}
                              </span>
                              <span className="text-[10px] text-gray-400 font-medium">
                                {topic.importantTag}
                              </span>
                            </div>
                            <h4 className="text-sm md:text-base font-bold text-gray-950 flex items-center gap-2 mt-1 leading-normal">
                              {isCompleted ? (
                                <BookmarkCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                              ) : (
                                <Bookmark className="w-5 h-5 text-gray-300 shrink-0" />
                              )}
                              {topic.title}
                            </h4>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                            {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                          </div>
                        </div>

                        {/* Slide-out lecture body */}
                        {isExpanded && (
                          <div className="px-5 pb-6 border-t border-gray-50 pt-5 space-y-5">
                            {/* Material details */}
                            <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
                              <p className="text-xs md:text-sm text-gray-700 whitespace-pre-line leading-relaxed font-sans">
                                {topic.content}
                              </p>
                            </div>

                            {/* Quick Memory Hacks */}
                            <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-100 flex items-start gap-2.5">
                              <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                              <div className="space-y-0.5 text-left">
                                <h5 className="text-xs font-bold text-amber-950">মেমোরি শর্টকাট ট্রিক:</h5>
                                <p className="text-xs text-amber-900 leading-relaxed font-medium">
                                  {topic.quickHack}
                                </p>
                              </div>
                            </div>

                            {/* Interactive Quiz container */}
                            <div className="p-5 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 border border-emerald-100 rounded-2xl space-y-4 text-left">
                              <h5 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                                <Award className="w-4 h-4 text-emerald-600" />
                                কুইজ চ্যালেঞ্জ (পরীক্ষামূলক যাচাই)
                              </h5>
                              <p className="text-xs font-bold text-gray-950 leading-relaxed">
                                {topic.quiz.question}
                              </p>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {topic.quiz.options.map((opt, optIdx) => (
                                  <button
                                    key={optIdx}
                                    disabled={isSubmitted}
                                    onClick={() => handleQuizAnswer(topic.id, optIdx)}
                                    className={cn(
                                      "w-full text-left px-4 py-3 rounded-xl text-xs transition-all border font-medium leading-relaxed font-sans",
                                      isSubmitted
                                        ? optIdx === topic.quiz.answerIndex
                                          ? "bg-emerald-500 border-emerald-500 text-white font-bold"
                                          : selectedAns === optIdx
                                            ? "bg-red-500 border-red-500 text-white font-bold"
                                            : "bg-white border-gray-100 text-gray-400"
                                        : selectedAns === optIdx
                                          ? "bg-emerald-600 border-emerald-600 text-white"
                                          : "bg-white border-gray-100 hover:border-emerald-300 text-gray-600"
                                    )}
                                  >
                                    {opt}
                                  </button>
                                ))}
                              </div>

                              {!isSubmitted ? (
                                <button
                                  onClick={() => submitQuiz(topic.id, topic.quiz.answerIndex)}
                                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-50"
                                >
                                  উত্তর জাজ করুন
                                </button>
                              ) : (
                                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 font-sans">
                                  <p className="text-xs text-emerald-900 leading-relaxed">
                                    <strong className="font-bold">সমাধান ব্যাখ্যা:</strong> {topic.quiz.explanation}
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Options action toolbar */}
                            <div className="flex flex-wrap gap-2 justify-between items-center border-t border-gray-50 pt-4">
                              <button
                                onClick={() => toggleProgress(topic.id)}
                                className={cn(
                                  "px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border",
                                  isCompleted
                                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                    : "bg-white border-gray-200 hover:border-gray-300 text-gray-600"
                                )}
                              >
                                <CheckCircle className="w-4 h-4" />
                                {isCompleted ? 'পড়া সম্পন্ন হয়েছে' : 'পড়া শেষ হয়েছে চিহ্নিত করুন'}
                              </button>

                              <button
                                onClick={() => handleShare(topic.title)}
                                className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-gray-100"
                              >
                                <Share2 className="w-4 h-4" />
                                লিঙ্ক শেয়ার করুন
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="bg-white p-12 text-center rounded-3xl border border-gray-100 space-y-4 font-sans">
                    <BookOpen className="w-12 h-12 text-gray-300 mx-auto" />
                    <h4 className="text-base font-bold text-gray-900 font-bengali">কোনো লেকচার পাওয়া যায়নি!</h4>
                    <p className="text-xs text-gray-400">বানান চেক করে অন্য টপিক দিয়ে সার্চ করুন।</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================== B. HISTORICAL PAST QUESTION BANK ==================== */}
        {activeTab === 'question_bank' && (
          <div className="space-y-6">
            {/* Filtering toolbar */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'all', bLabel: 'সব প্রশ্ন' },
                  { id: 'bcs', bLabel: 'বিসিএস প্রিলি' },
                  { id: 'bank', bLabel: 'ব্যাংক নিয়োগ' },
                  { id: 'primary', bLabel: 'প্রাইমারী প্রশ্ন' },
                ].map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => setPastQFilter(filter.id as any)}
                    className={cn(
                       "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                       pastQFilter === filter.id
                         ? "bg-emerald-600 border-emerald-600 text-white"
                         : "bg-white border-gray-100 text-gray-655 hover:border-gray-200"
                    )}
                  >
                    {filter.bLabel}
                  </button>
                ))}
              </div>

              {/* Instant search */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="পরীক্ষা বা প্রশ্নের কিওয়ার্ড দিয়ে খুঁজুন..."
                  value={pastQSearch}
                  onChange={e => setPastQSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-gray-150 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs shadow-sm font-sans"
                />
              </div>
            </div>

            {/* Questions Feed list */}
            <div className="space-y-4">
              {filteredPastQuestions.length > 0 ? (
                filteredPastQuestions.map((q, idx) => {
                  const isRevealed = !!revealedAnswers[q.id];
                  return (
                    <div 
                      key={q.id}
                      className="bg-white p-5 md:p-6 rounded-3xl border border-gray-100 shadow-xs hover:border-emerald-250 transition-all space-y-4 text-left"
                    >
                      <div className="flex items-start md:items-center justify-between gap-3 flex-wrap">
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-full font-bold">
                          {q.examName} ({q.year})
                        </span>
                        <div className="text-xs text-gray-450 font-sans font-medium">আইডি #{idx + 1}</div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm md:text-base font-bold text-gray-950 leading-relaxed font-bengali">
                          {q.questionText}
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                          {q.options.map((option, optIdx) => (
                            <div
                              key={optIdx}
                              className={cn(
                                "p-3 rounded-xl border text-xs font-semibold text-left flex justify-between items-center transition-all font-sans",
                                isRevealed
                                  ? optIdx === q.correctIndex
                                    ? "bg-emerald-50 border-emerald-300 text-emerald-900 font-bold shadow-xs"
                                    : "bg-gray-50 border-gray-100 text-gray-400 font-medium"
                                  : "bg-white border-gray-100 text-gray-600"
                              )}
                            >
                              <span>{option}</span>
                              {isRevealed && optIdx === q.correctIndex && (
                                <Check className="w-4 h-4 text-emerald-600 shrink-0 font-bold" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between items-center border-t border-gray-50 pt-4 flex-wrap gap-2">
                        <p className="text-[10px] text-gray-450 font-sans">
                          * উত্তর ও বিস্তারিত ব্যাখ্যার জন্য ডানদিকের বাটনে ক্লিক করুন
                        </p>
                        <button
                          onClick={() => toggleRevealAnswer(q.id)}
                          className={cn(
                            "px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border shadow-xs leading-none",
                            isRevealed
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                              : "bg-emerald-600 text-white hover:bg-emerald-700"
                          )}
                        >
                          <HelpCircle className="w-4 h-4" />
                          {isRevealed ? 'সমাধান লুকান' : 'সঠিক সমাধান ও ব্যাখ্যা'}
                        </button>
                      </div>

                      {isRevealed && (
                        <div className="p-4 bg-emerald-50/40 rounded-2xl border border-emerald-100/50 space-y-1 text-left">
                          <strong className="text-xs font-bold text-emerald-950 font-bengali block">সহজ সমাধান ও বিশ্লেষণ:</strong>
                          <p className="text-xs text-emerald-900 leading-relaxed font-semibold">
                            {q.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="bg-white p-12 text-center rounded-3xl border border-gray-100 space-y-4">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto" />
                  <h4 className="text-base font-bold text-gray-900">প্রশ্ন ব্যাংকে কোনো ম্যাচিং প্রশ্ন পাওয়া যায়নি!</h4>
                  <p className="text-xs text-gray-400 font-sans">অন্য কোনো বছর বা প্রশ্ন কিওয়ার্ড দিয়ে পুনরায় দিন।</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== C. ACTIVE RECALL FLASHCARDS ==================== */}
        {activeTab === 'flashcards' && (
          <div className="max-w-2xl mx-auto space-y-6">
            
            <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-5 rounded-3xl border border-emerald-100 flex items-start gap-3">
              <span className="text-2xl mt-0.5 animate-bounce">🧠</span>
              <div className="space-y-1 text-left">
                <h4 className="text-sm font-bold text-emerald-950">ফ্ল্যাশ কার্ড দিয়ে দ্রুত আয়ত্ত করার বৈজ্ঞানিক পদ্ধতি:</h4>
                <p className="text-xs text-emerald-900/80 leading-relaxed font-semibold">
                  কার্ডের ওপরে বিষয় দেখে মনে মনে উত্তর ভাবুন, তারপর কার্ডে ট্যাপ করে উল্টে সমাধান মিলিয়ে নিন। আয়ত্ত হয়ে গেলে "মনে আছে" চিহ্নিত করুন!
                </p>
              </div>
            </div>

            {/* Flashcard filters */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {[
                { id: 'all', label: 'সব কার্ড' },
                { id: 'english', label: 'ইংরেজি ভোকেব' },
                { id: 'constitution', label: 'সংবিধান আর্ট' },
                { id: 'gk', label: 'সাধারণ জ্ঞান' },
                { id: 'math', label: 'গণিত সূত্রসমূহ' },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setFlashcardFilter(cat.id);
                    setActiveCardIndex(0);
                    setIsFlipped(false);
                  }}
                  className={cn(
                    "px-3.5 py-2 rounded-xl text-xs font-bold transition-all border",
                    flashcardFilter === cat.id
                      ? "bg-emerald-600 border-emerald-600 text-white shadow-xs"
                      : "bg-white border-gray-100 text-gray-600 hover:border-gray-200"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Flashcard details */}
            {activeFlashcard ? (
              <div className="space-y-6">
                
                {/* 3D design cards */}
                <div 
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="relative w-full h-64 md:h-72 cursor-pointer [perspective:1000px] group"
                >
                  <div className={cn(
                    "w-full h-full duration-500 [transform-style:preserve-3d] relative rounded-3xl border border-gray-105 shadow-md",
                    isFlipped ? "[transform:rotateY(180deg)]" : ""
                  )}>
                    
                    {/* Front Face */}
                    <div className="absolute inset-0 w-full h-full p-6 md:p-8 rounded-3xl bg-white [backface-visibility:hidden] flex flex-col justify-between border-2 border-dashed border-emerald-150">
                      <div className="flex justify-between items-center w-full">
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-55 px-2.5 py-1 rounded-full uppercase tracking-wider font-sans">
                          {activeFlashcard.categoryLabel}
                        </span>
                        <span className="text-xs text-gray-450 font-sans font-bold">
                          {activeCardIndex + 1} / {totalCategoryFlashcards.length}
                        </span>
                      </div>
                      
                      <div className="text-center space-y-2 py-4">
                        <div className="text-xl md:text-2xl font-black text-gray-950 font-sans tracking-tight leading-relaxed">
                          {activeFlashcard.front}
                        </div>
                        {activeFlashcard.hint && (
                          <div className="inline-flex items-center gap-1 text-[11px] text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                            <Lightbulb className="w-3.5 h-3.5" />
                            <span>ইঙ্গিত: {activeFlashcard.hint}</span>
                          </div>
                        )}
                      </div>

                      <div className="text-[11px] text-gray-400 text-center font-bold">
                        👉 উত্তর দেখতে কার্ডের যেকোনো স্থানে ট্যাপ করুন
                      </div>
                    </div>

                    {/* Back Face */}
                    <div className="absolute inset-0 w-full h-full p-6 md:p-8 rounded-3xl bg-emerald-950 [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col justify-between text-white border-2 border-emerald-800">
                      <div className="flex justify-between items-center w-full">
                        <span className="text-[10px] font-bold text-emerald-300 bg-emerald-900/60 px-2.5 py-1 rounded-full uppercase tracking-wider font-sans">
                          সঠিক উত্তর সমাধান
                        </span>
                        <span className="text-xs text-emerald-450 font-sans font-bold">REVEALED</span>
                      </div>

                      <div className="py-2 text-center">
                        <p className="text-sm md:text-lg font-bold text-emerald-50 leading-relaxed font-bengali">
                          {activeFlashcard.back}
                        </p>
                      </div>

                      <div className="text-[11px] opacity-60 text-center font-bold">
                        ↩️ আবার ট্যাপ করলে প্রশ্নে ফেরত যাবে
                      </div>
                    </div>

                  </div>
                </div>

                {/* Navigation and mastery */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex gap-2">
                    <button
                      disabled={activeCardIndex === 0}
                      onClick={() => {
                        setActiveCardIndex(prev => prev - 1);
                        setIsFlipped(false);
                      }}
                      className="px-4 py-2 bg-white border border-gray-150 hover:bg-gray-50 text-gray-600 hover:text-gray-800 text-xs font-bold rounded-xl disabled:opacity-50 transition-all font-sans"
                    >
                      পূর্ববর্তী
                    </button>
                    <button
                      disabled={activeCardIndex === totalCategoryFlashcards.length - 1}
                      onClick={() => {
                        setActiveCardIndex(prev => prev + 1);
                        setIsFlipped(false);
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl disabled:opacity-50 transition-all font-sans"
                    >
                      পরবর্তী
                    </button>
                  </div>

                  <button
                    onClick={() => toggleMasteredCard(activeFlashcard.id)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 shadow-xs",
                      masteredCards[activeFlashcard.id]
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700 font-bold"
                        : "bg-white border-gray-200 hover:border-gray-350 text-gray-600"
                    )}
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    {masteredCards[activeFlashcard.id] ? 'ইতিমধ্যে আয়ত্ত হয়েছে' : 'মনে আছে আমার'}
                  </button>
                </div>

                <p className="text-center text-xs text-gray-400 font-sans">
                  এই ক্যাটাগরিতে মোট আয়ত্ত করেছেন: {Object.keys(masteredCards).filter(k => flashcards.find(f => f.id === k && (flashcardFilter === 'all' || f.category === flashcardFilter))).length} / {totalCategoryFlashcards.length} টি কার্ড
                </p>
              </div>
            ) : (
              <div className="bg-white p-12 text-center rounded-3xl border border-gray-100 space-y-4">
                <Zap className="w-12 h-12 text-gray-300 mx-auto" />
                <h4 className="text-base font-bold text-gray-900">দুঃখিত, কোনো ফ্ল্যাশকার্ড খুঁজে পাওয়া যায়নি!</h4>
                <p className="text-xs text-gray-455">আপনার তৈরি বা ডিফল্ট তালিকায় ফিল্টার পরিবর্তন করুন।</p>
              </div>
            )}
          </div>
        )}

        {/* ==================== D. MEMORY TECHNIQUE & MNEMONICS ==================== */}
        {activeTab === 'mnemonics' && (
          <div className="space-y-6">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="কোনো সাহিত্যিক ছদ্মনাম বা প্রণালী মনে রাখার ছন্দ সার্চ করুন..."
                value={mnemonicSearch}
                onChange={e => setMnemonicSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-150 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs md:text-sm shadow-sm font-sans"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMnemonics.length > 0 ? (
                filteredMnemonics.map(m => (
                  <div 
                    key={m.id}
                    className="p-6 bg-white rounded-3xl border border-gray-100 shadow-xs hover:shadow-sm hover:border-emerald-250 transition-all space-y-4 text-left"
                  >
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-[10px] bg-purple-50 text-purple-700 border border-purple-100 px-3 py-1 rounded-full font-bold">
                        {m.category}
                      </span>
                      <Sparkles className="w-4 h-4 text-amber-500" />
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="text-sm md:text-base font-bold text-gray-950 leading-relaxed font-bengali font-black">
                        {m.title}
                      </h4>
                      <p className="text-xs text-gray-450 italic">
                        কিভাবে ছন্দ দিয়ে মনে রাখবেন?:
                      </p>
                      <div className="p-3.5 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 rounded-2xl border border-dashed border-emerald-200">
                        <p className="text-xs md:text-sm font-black text-emerald-950 font-bengali leading-relaxed">
                          "{m.formula}"
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-gray-50 text-left font-sans text-xs">
                      <strong className="text-xs text-gray-900 font-bengali block">সহজ প্রফেশনাল ব্যাখ্যা রূপ:</strong>
                      <p className="text-gray-600 leading-relaxed">
                        {m.explanation}
                      </p>
                      <p className="text-emerald-900 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/30">
                        <strong className="text-[10px] uppercase block tracking-wider text-emerald-600 font-sans">উদাহরণসমূহ:</strong>
                        {m.example}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-1 md:col-span-2 bg-white p-12 text-center rounded-3xl border border-gray-100 space-y-4 font-sans">
                  <Sparkles className="w-12 h-12 text-gray-300 mx-auto" />
                  <h4 className="text-base font-bold text-gray-900 font-bengali">কোনো ছন্দ খুঁজে পাওয়া সম্ভব হয়নি!</h4>
                  <p className="text-xs text-gray-400">অন্য কোনো কিওয়ার্ড বা কবি নাম দিয়ে পুনরায় সার্চ করুন।</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== E. STAMINA DAILY ROUTINE ==================== */}
        {activeTab === 'routine' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            
            {/* Sidebar configurations */}
            <div className="md:col-span-1 space-y-6">
              
              <div className="bg-white p-4 rounded-3xl border border-gray-150 space-y-3 shadow-xs">
                <h3 className="text-xs font-bold text-gray-400 px-2 pb-1 uppercase tracking-wider font-sans text-left">
                  PRESET ROUTINE / লক্ষ্যসমূহ
                </h3>
                <div className="space-y-2">
                  {STUDY_ROUTINES_DATA.map(routine => (
                    <button
                      key={routine.id}
                      onClick={() => setActiveRoutineId(routine.id)}
                      className={cn(
                        "w-full p-4 rounded-2xl border text-left transition-all group relative overflow-hidden",
                        activeRoutineId === routine.id
                          ? "bg-emerald-55 border-emerald-500 text-emerald-900 shadow-sm"
                          : "bg-white border-gray-50 hover:border-gray-250 text-gray-600"
                      )}
                    >
                      <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest font-sans">
                        {routine.tag}
                      </div>
                      <h4 className="text-xs md:text-sm font-bold text-gray-955 mt-1">
                        {routine.title}
                      </h4>
                      <p className="text-[10px] text-gray-400 mt-1 font-medium leading-relaxed font-sans">
                        {routine.desc.slice(0, 50)}...
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Personal Study Goals */}
              <div className="bg-white p-5 rounded-3xl border border-gray-150 space-y-4 shadow-xs">
                <div className="flex items-center gap-1.5 text-emerald-600">
                  <TrendingUp className="w-5 h-5 font-bold" />
                  <h4 className="text-sm font-bold text-gray-950">আজকের অতিরিক্ত স্টাডি গোল</h4>
                </div>
                <p className="text-[11px] text-gray-400 font-sans">
                  নিজের জন্য কাস্টম পড়ার টার্গেট (যেমন: বাংলা ব্যাকরণ ২০ পৃষ্ঠা) এখানে যুক্ত করে ট্র্যাক রাখতে পারেন।
                </p>

                <form onSubmit={addCustomGoal} className="flex gap-2">
                  <input
                    type="text"
                    required
                    maxLength={60}
                    placeholder="পড়ার টার্গেট লিখুন..."
                    value={newGoalInput}
                    onChange={e => setNewGoalInput(e.target.value)}
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-sans"
                  />
                  <button
                    type="submit"
                    className="w-10 h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center justify-center transition-all shadow-md shrink-0 font-bold"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </form>

                {customGoals.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto pt-2 border-t border-gray-50">
                    {customGoals.map((goal, idx) => {
                      const isDone = !!completedCustomGoals[goal];
                      return (
                        <div 
                          key={idx}
                          className="flex justify-between items-center bg-gray-50 hover:bg-emerald-50/20 p-2.5 rounded-xl border border-gray-100 group transition-all"
                        >
                          <label className="flex items-center gap-2 cursor-pointer flex-1">
                            <input
                              type="checkbox"
                              checked={isDone}
                              onChange={() => toggleCustomGoalComplete(goal)}
                              className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                            />
                            <span className={cn(
                              "text-xs font-semibold leading-normal font-sans",
                              isDone ? "line-through text-gray-400" : "text-gray-700 font-bold"
                            )}>
                              {goal}
                            </span>
                          </label>
                          <button
                            onClick={() => removeCustomGoal(idx)}
                            className="text-gray-400 hover:text-red-500 leading-none transition-colors ml-1 p-1 rounded-md opacity-0 group-hover:opacity-100 font-bold"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-center text-[10px] text-gray-400 italic py-2">
                    আজকের জন্য কোনো ব্যক্তিগত গোল তৈরি করা হয়নি।
                  </p>
                )}
              </div>

            </div>

            {/* Checklist Day timeline */}
            <div className="md:col-span-2 space-y-4">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider font-sans">
                    ROADMAP ACTIVE SPRINT
                  </span>
                  <h3 className="text-base font-black text-gray-950 mt-1.5 font-bengali">
                    {currentRoutineObj.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed font-sans">
                    {currentRoutineObj.desc}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {currentRoutineObj.tasks.map(task => {
                    const isTaskDone = !!completedRoutineTasks[task.id];
                    return (
                      <div 
                        key={task.id}
                        className={cn(
                          "p-4 rounded-2xl border transition-all flex items-start gap-3.5",
                          isTaskDone 
                            ? "bg-emerald-50/30 border-emerald-250" 
                            : "bg-white border-gray-100 hover:border-gray-250"
                        )}
                      >
                        <div className="px-2.5 py-1.5 bg-gray-50 border rounded-xl font-sans text-center text-[10px] font-black tracking-tight text-gray-500 shrink-0">
                          <div>DAY</div>
                          <div className="text-sm font-black text-gray-800">{task.day}</div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center flex-wrap gap-1 leading-none font-sans">
                            <span className="text-[10px] uppercase font-bold text-emerald-700">
                              {task.subject}
                            </span>
                            <span className="text-[10px] font-bold text-gray-400">
                              অবধি: {task.duration}
                            </span>
                          </div>
                          <h4 className={cn(
                            "text-xs md:text-sm font-bold text-gray-950 mt-1 leading-relaxed",
                            isTaskDone ? "line-through text-gray-400 font-medium" : "font-semibold"
                          )}>
                            {task.taskTitle}
                          </h4>
                        </div>

                        <button
                          onClick={() => toggleRoutineTaskCompleted(task.id)}
                          className={cn(
                            "w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 transition-all font-bold",
                            isTaskDone
                              ? "bg-emerald-600 border-emerald-600 text-white"
                              : "bg-white border-gray-200 hover:border-emerald-350 text-gray-500"
                          )}
                        >
                          {isTaskDone ? <Check className="w-4 h-4 font-black" /> : <Plus className="w-4 h-4 text-gray-400" />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ==================== F. CORE QUESTION AND CONTENT CONTRIBUTION ENGINE ==================== */}
        {activeTab === 'contribute' && (
          <div className="space-y-6 text-left max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-emerald-55 to-emerald-100/30 p-6 rounded-3xl border border-emerald-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider flex items-center gap-1.5 font-sans">
                  👥 Shadhin Career Portal Question Contribution
                </span>
                <h3 className="text-base md:text-xl font-black text-gray-950 font-bengali">
                  প্রশ্ন প্রস্তাব ও কন্ট্রিবিউশন প্যানেল
                </h3>
                <p className="text-xs text-gray-500 max-w-xl leading-relaxed font-sans">
                  এখানে একজন সাধারণ ইউজার যেকোনো বিগত সালের পরীক্ষা বা প্রস্তুতিমূলক গুরুত্বপূর্ণ MCQ প্রশ্ন প্রস্তাব করতে পারেন। আপনার কন্ট্রিবিউটকৃত প্রশ্নটি পর্যালোচনার পর স্থায়ীভাবে প্রকাশ করা হবে।
                </p>
              </div>
              <button
                onClick={clearAllCustomContributions}
                className="px-4.5 py-3.5 bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-700 text-xs font-bold rounded-2xl transition-all shadow-xs flex items-center gap-2 font-sans shrink-0"
              >
                <Trash2 className="w-4 h-4" />
                আমার প্রস্তাবিত প্রশ্নসমূহ মুছুন
              </button>
            </div>

            {/* Form Input fields - Centered Form Container */}
            <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-xs">
              
              {/* A. PAST MCQS QUESTION INPUT FORM */}
              {contributionType === 'past_question' && (
                  <div className="space-y-4">
                    <h3 className="text-base font-black text-gray-950 font-bengali">
                      যুক্ত করুন: বিগত সালের এমসিকিউ (MCQs)
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5 text-left">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">পরীক্ষার নাম (Exam Name) *</label>
                        <input
                          type="text"
                          required
                          placeholder="যেমন: ৪৬তম বিসিএস প্রিলিমিনারি"
                          value={pqExamName}
                          onChange={e => setPqExamName(e.target.value)}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-550 text-xs font-medium"
                        />
                      </div>
                      <div className="space-y-1.5 text-left">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">অনুষ্ঠিত বছর (Year)</label>
                        <input
                          type="text"
                          placeholder="যেমন: ২০২৪"
                          value={pqYear}
                          onChange={e => setPqYear(e.target.value)}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-550 text-xs font-medium"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">পরীক্ষার ধরণ (Category) *</label>
                      <select
                        value={pqCategory}
                        onChange={e => setPqCategory(e.target.value as any)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-550 text-xs font-bold"
                      >
                        <option value="bcs">বিসিএস প্রিলিমিনারি (BCS)</option>
                        <option value="bank">ব্যাংক নিয়োগ পরীক্ষা (Bank)</option>
                        <option value="primary">প্রাইমারী সহকারী শিক্ষক নিয়োগ (Primary)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">প্রশ্নের মূল টেক্সট (Question) *</label>
                      <textarea
                        rows={3}
                        required
                        placeholder="প্রশ্নটি এখানে বিস্তারিত টাইপ করুন..."
                        value={pqText}
                        onChange={e => setPqText(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-550 text-xs leading-relaxed font-semibold font-bengali"
                      />
                    </div>

                    {/* Options arrays */}
                    <div className="space-y-3 p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                      <label className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">অপশনসমূহ (৪টি অপশন প্রদান করুন) *</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {pqOptions.map((opt, optIdx) => (
                          <div key={optIdx} className="space-y-1 text-left">
                            <span className="text-[10px] font-bold text-emerald-700">অপশন {optIdx + 1}</span>
                            <input
                              type="text"
                              required
                              placeholder={`বিকল্প উত্তর ${optIdx + 1}`}
                              value={opt}
                              onChange={e => {
                                const copy = [...pqOptions];
                                copy[optIdx] = e.target.value;
                                setPqOptions(copy);
                              }}
                              className="w-full px-3 py-2 bg-white border border-gray-150 rounded-xl focus:ring-2 focus:ring-emerald-550 text-xs font-semibold"
                            />
                          </div>
                        ))}
                      </div>

                      <div className="space-y-1.5 text-left pt-2">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">সঠিক অপশন ইনডেক্স কোনটি? *</label>
                        <select
                          value={pqCorrectIdx}
                          onChange={e => setPqCorrectIdx(parseInt(e.target.value, 10))}
                          className="w-full px-3 py-2 bg-white border border-gray-150 rounded-xl focus:ring-2 focus:ring-emerald-550 text-xs font-bold"
                        >
                          <option value={0}>অপশন ১ সঠিক</option>
                          <option value={1}>অপশন ২ সঠিক</option>
                          <option value={2}>অপশন ৩ সঠিক</option>
                          <option value={3}>অপশন ৪ সঠিক</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider font-sans">বিশ্লেষণ ও ব্যাখ্যা (Explanation)</label>
                      <textarea
                        rows={2}
                        placeholder="প্রশ্নটির ব্যাকরণ বা নিয়মের শর্টকাট বিশ্লেষণ এখানে লিখুন..."
                        value={pqExplanation}
                        onChange={e => setPqExplanation(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-550 text-xs font-medium font-bengali"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleAddPastQuestion}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black transition-all shadow-md mt-2 font-bengali font-sans"
                    >
                      {contributorRole === 'admin' ? 'এডমিন হিসেবে প্রশ্ন পাবলিশ করুন' : 'কন্ট্রিবিউশন দাখিল করুন'}
                    </button>
                  </div>
                )}

                {/* B. SUBJECT LECTURE NOTES DETAILS */}
                {contributionType === 'lecture' && (
                  <div className="space-y-4">
                    <h3 className="text-base font-black text-gray-950 font-bengali">
                      যুক্ত করুন: নতুন লেকচার বিষয় ও কুইজ সমাধান
                    </h3>

                    <div className="space-y-1.5 text-left">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">কোন বিষয়ের অন্তর্ভুক্ত? (Subject) *</label>
                      <select
                        value={lecSubjectId}
                        onChange={e => setLecSubjectId(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-550 text-xs font-bold"
                      >
                        <option value="bangla">বাংলা ভাষা ও সাহিত্য (Bangla)</option>
                        <option value="english">ইংরেজি ভাষা ও সাহিত্য (English)</option>
                        <option value="math">গাণিতিক যুক্তি ও দক্ষতা (Mathematics)</option>
                        <option value="gk">বাংলাদেশ ও আন্তর্জাতিক সায়েন্স (General Knowledge)</option>
                        <option value="computer">কম্পিউটার ও আইসিটি (ICT)</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5 text-left">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">লেকচার শিরোনাম (Concept Title) *</label>
                        <input
                          type="text"
                          required
                          placeholder="যেমন: চর্যাপদ ও সাহিত্যিকদের উৎস"
                          value={lecTitle}
                          onChange={e => setLecTitle(e.target.value)}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-550 text-xs font-medium"
                        />
                      </div>
                      <div className="space-y-1.5 text-left">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">গুরুত্ব ট্যাগ (Tag)</label>
                        <input
                          type="text"
                          placeholder="যেমন: ৪৫তম প্রিলির ৪টি প্রশ্ন"
                          value={lecTag}
                          onChange={e => setLecTag(e.target.value)}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-550 text-xs font-medium"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">মূল ক্লাস নোট আলোচনা (Body content) *</label>
                      <textarea
                        rows={4}
                        required
                        placeholder="পড়ার মূল সারাংশ ও বিস্তারিত নোট এখানে সুন্দর করে প্যারাগ্রাফাকারে প্রদান করুন..."
                        value={lecContent}
                        onChange={e => setLecContent(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-550 text-xs leading-relaxed font-semibold font-bengali"
                      />
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-[11px] font-bold text-amber-800 uppercase tracking-wider font-sans">মেমোরি ট্রিক বা সর্টকাট (Memory Hack)</label>
                      <input
                        type="text"
                        placeholder="এই টেকনিকটি সহজে মনে রাখার জন্য কোনো ছড়া বা টেকনিক লাইন লিখুন..."
                        value={lecHack}
                        onChange={e => setLecHack(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-550 text-xs font-medium"
                      />
                    </div>

                    {/* Quick quiz in lesson */}
                    <div className="space-y-4 p-4 bg-emerald-500/5 rounded-2xl border border-emerald-150 text-left">
                      <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-emerald-600" />
                        লেকচারের সাথে একটি প্রস্তুতি কুইজ প্রশ্ন যুক্ত করুন
                      </h4>
                      
                      <div className="space-y-1 px-1">
                        <span className="text-[10px] font-bold text-gray-400 block">কুইজ প্রশ্ন টেক্সট *</span>
                        <input
                          type="text"
                          required
                          placeholder="যেমন: চর্যাপদ এর মোট পদের সংখ্যা কত?"
                          value={lecQuizQ}
                          onChange={e => setLecQuizQ(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-150 rounded-xl text-xs font-bold"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3.5 px-1">
                        {lecQuizOptions.map((opt, optIdx) => (
                          <div key={optIdx} className="space-y-1">
                            <span className="text-[10px] font-bold text-gray-400">বিকল্প {optIdx + 1} *</span>
                            <input
                              type="text"
                              required
                              placeholder={`উত্তর অপশন ${optIdx + 1}`}
                              value={opt}
                              onChange={e => {
                                const copy = [...lecQuizOptions];
                                copy[optIdx] = e.target.value;
                                setLecQuizOptions(copy);
                              }}
                              className="w-full px-3 py-2 bg-white border border-gray-150 rounded-xl text-xs font-semibold"
                            />
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-4 px-1 pb-1">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-gray-400">সঠিক অপশন ইনডেক্স কোনটি?</span>
                          <select
                            value={lecQuizCorrectIdx}
                            onChange={e => setLecQuizCorrectIdx(parseInt(e.target.value, 10))}
                            className="w-full px-3 py-2 bg-white border border-gray-150 rounded-xl text-xs font-bold"
                          >
                            <option value={0}>বিকল্প ১ সঠিক</option>
                            <option value={1}>বিকল্প ২ সঠিক</option>
                            <option value={2}>বিকল্প ৩ সঠিক</option>
                            <option value={3}>বিকল্প ৪ সঠিক</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-gray-400">কুইজের ব্যাখ্যা সমাধান</span>
                          <input
                            type="text"
                            placeholder="সঠিক উত্তরের যুক্তি ব্যাখ্যা..."
                            value={lecQuizExplanation}
                            onChange={e => setLecQuizExplanation(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-150 rounded-xl text-xs font-medium"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddLecture}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black transition-all shadow-md mt-2 font-bengali"
                    >
                      {contributorRole === 'admin' ? 'এডমিন হিসেবে লেকচার নোট সেভ করুন' : 'কন্ট্রিবিউশন দাখিল করুন'}
                    </button>
                  </div>
                )}

                {/* C. FLASHCARDS FORM */}
                {contributionType === 'flashcard' && (
                  <div className="space-y-4">
                    <h3 className="text-base font-black text-gray-950 font-bengali">
                      যুক্ত করুন: স্মার্ট ফ্ল্যাশ শব্দার্থ বা মেমোরি কার্ড (Flashcard)
                    </h3>

                    <div className="space-y-1.5 text-left">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">কার্ডের বিষয়ের ধরন (Category) *</label>
                      <select
                        value={fcCategory}
                        onChange={e => setFcCategory(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-550 text-xs font-bold"
                      >
                        <option value="english">ইংরেজি শব্দার্থ ও ভোকেবুলারি (English)</option>
                        <option value="constitution">গণপ্রজাতন্ত্রী বাংলাদেশ সংবিধান আর্ট (Constitution)</option>
                        <option value="gk">ইতিহাস ও সাধারণ জ্ঞান (GK)</option>
                        <option value="math">গণিত ও ত্রিকোণমিতি শর্ট সূত্রসমূহ (Math)</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1 text-left">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">কার্ডের সম্মুখ পার্ট (Front - Question) *</label>
                        <textarea
                          rows={2}
                          required
                          placeholder="কার্ডের সামনে যা দৃশ্যমান হবে (যেমন: 'Abate')"
                          value={fcFront}
                          onChange={e => setFcFront(e.target.value)}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-550 text-xs font-bold leading-normal text-center"
                        />
                      </div>
                      <div className="space-y-1 text-left">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">কার্ডের বিপরীত পার্ট (Back - Answer) *</label>
                        <textarea
                          rows={2}
                          required
                          placeholder="কার্ড উল্টালে যে উত্তর দেখা যাবে (যেমন: 'হ্রাস করা বা কমানো')"
                          value={fcBack}
                          onChange={e => setFcBack(e.target.value)}
                          className="w-full px-4 py-2.5 bg-emerald-950/20 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-550 text-xs font-bold leading-normal text-center"
                        />
                      </div>
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">স্মরণ সহায়ক সংকেত বা ইঙ্গিত (Hint, optional)</label>
                      <input
                        type="text"
                        placeholder="যেমন: 'এটি একটি Verb এবং এর সিনোনিম হলো Subside'"
                        value={fcHint}
                        onChange={e => setFcHint(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-550 text-xs font-semibold"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleAddFlashcard}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black transition-all shadow-md mt-2 font-bengali"
                    >
                      {contributorRole === 'admin' ? 'এডমিন হিসেবে ফ্ল্যাশ কার্ড লাইভ করুন' : 'কন্ট্রিবিউশন দাখিল করুন'}
                    </button>
                  </div>
                )}

                {/* D. MNEMONICS RHYMES TECHNIQUE */}
                {contributionType === 'mnemonic' && (
                  <div className="space-y-4">
                    <h3 className="text-base font-black text-gray-950 font-bengali">
                      যুক্ত করুন: পড়া সহজ করার কবি-সাহিত্যিক ছন্দ ট্রিক
                    </h3>

                    <div className="space-y-1.5 text-left font-sans">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">ছন্দের বিষয় ক্যাটাগরি (Mnemonic Topic) *</label>
                      <input
                        type="text"
                        required
                        placeholder="যেমন: স্ক্যান্ডিনেভিয়ান রাষ্ট্রসমূহ / রবীন্দ্রনাথের কাব্য"
                        value={mnCategory}
                        onChange={e => setMnCategory(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                      />
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">ছন্দ বা কুপলেট এর সংক্ষিপ্ত নাম (Title) *</label>
                      <input
                        type="text"
                        required
                        placeholder="যেমন: কাজী নজরুলের উপন্যাস মনে রাখার ট্রিক"
                        value={mnTitle}
                        onChange={e => setMnTitle(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold font-bengali"
                      />
                    </div>

                    <div className="space-y-1.5 text-left font-sans">
                      <label className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">চক্রী ছন্দ রূপ সংকেত (Mnemonic Formula Poem) *</label>
                      <input
                        type="text"
                        required
                        placeholder="যেমন: 'বাঁধন হারা শিউলি মালা কুহেলিকা মৃত্যুর খোঁজে'"
                        value={mnFormula}
                        onChange={e => setMnFormula(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold font-bengali"
                      />
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">ছন্দের সহজ সংক্ষিপ্ত বিশ্লেষণ ও ব্যাখ্যা *</label>
                      <textarea
                        rows={3}
                        required
                        placeholder="ছন্দ দিয়ে কিভাবে মনে রাখা যাবে তা সহজভাবে ব্যাখ্যা করে বিবরণ দিন..."
                        value={mnExplanation}
                        onChange={e => setMnExplanation(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold leading-relaxed font-bengali"
                      />
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">প্রধান উদাহরণসমূহ (Derived list)</label>
                      <input
                        type="text"
                        placeholder="যেমন: বাঁধন হারা (উপন্যাস), শিউলি মালা (গল্প), কুহেলিকা, মৃত্যুক্ষুধা।"
                        value={mnExample}
                        onChange={e => setMnExample(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleAddMnemonic}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black transition-all shadow-md mt-2 font-bengali"
                    >
                      {contributorRole === 'admin' ? 'এডমিন মোডে টেকনিকটি পাবলিশ করুন' : 'কন্ট্রিবিউশন দাখিল করুন'}
                    </button>
                  </div>
                )}

              </div>

            </div>
          )}

      </div>

    </div>
  );
};

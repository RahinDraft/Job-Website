import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  X, 
  FileText, 
  BookOpen, 
  Zap, 
  Sparkles, 
  Search, 
  RefreshCw, 
  Layers, 
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { 
  PastQuestion, 
  Topic, 
  Subject, 
  Flashcard, 
  MnemonicTrick,
  PAST_QUESTIONS_DATA,
  SUBJECT_LESSONS_DATA,
  FLASHCARDS_DATA,
  MNEMONICS_DATA
} from '../data/preparationData';

interface AdminPrepManagerProps {
  showToast?: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const AdminPrepManager: React.FC<AdminPrepManagerProps> = ({ showToast }) => {
  const [activeSubTab, setActiveSubTab] = useState<'questions' | 'lessons' | 'flashcards' | 'mnemonics'>('questions');
  const [searchQuery, setSearchQuery] = useState('');

  // Loaded items (defaults + custom from localStorage)
  const [questions, setQuestions] = useState<PastQuestion[]>([]);
  const [lessons, setLessons] = useState<{ subjectId: string; topic: Topic }[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [mnemonics, setMnemonics] = useState<MnemonicTrick[]>([]);

  // Form states
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Question Form
  const [pqId, setPqId] = useState('');
  const [pqExamName, setPqExamName] = useState('');
  const [pqYear, setPqYear] = useState('২০২৬');
  const [pqCategory, setPqCategory] = useState<'bcs' | 'bank' | 'primary' | 'other'>('bcs');
  const [pqText, setPqText] = useState('');
  const [pqOptions, setPqOptions] = useState<string[]>(['', '', '', '']);
  const [pqCorrectIdx, setPqCorrectIdx] = useState(0);
  const [pqExplanation, setPqExplanation] = useState('');

  // Lesson/Topic Form
  const [lcSubjectId, setLcSubjectId] = useState('bangla');
  const [lcTitle, setLcTitle] = useState('');
  const [lcTag, setLcTag] = useState('');
  const [lcContent, setLcContent] = useState('');
  const [lcHack, setLcHack] = useState('');
  const [lcQuizQ, setLcQuizQ] = useState('');
  const [lcQuizOptions, setLcQuizOptions] = useState<string[]>(['', '', '', '']);
  const [lcQuizCorrectIdx, setLcQuizCorrectIdx] = useState(0);
  const [lcQuizExplanation, setLcQuizExplanation] = useState('');

  // Flashcards Form
  const [fcCategory, setFcCategory] = useState<'english' | 'constitution' | 'gk' | 'math' | 'science'>('english');
  const [fcFront, setFcFront] = useState('');
  const [fcBack, setFcBack] = useState('');
  const [fcHint, setFcHint] = useState('');

  // Mnemonics Form
  const [mnCategory, setMnCategory] = useState('');
  const [mnTitle, setMnTitle] = useState('');
  const [mnFormula, setMnFormula] = useState('');
  const [mnExplanation, setMnExplanation] = useState('');
  const [mnExample, setMnExample] = useState('');

  // Load all items
  const loadData = () => {
    // 1. Questions
    const customQStr = localStorage.getItem('shadhin_custom_past_questions');
    let customQ: PastQuestion[] = [];
    if (customQStr) {
      try { customQ = JSON.parse(customQStr); } catch (e) {}
    }
    setQuestions([...customQ, ...PAST_QUESTIONS_DATA]);

    // 2. Lessons
    const customLStr = localStorage.getItem('shadhin_custom_topics');
    let customL: { subjectId: string; topic: Topic }[] = [];
    if (customLStr) {
      try { customL = JSON.parse(customLStr); } catch (e) {}
    }
    const defaultLessons: { subjectId: string; topic: Topic }[] = [];
    SUBJECT_LESSONS_DATA.forEach(sub => {
      sub.topics.forEach(t => {
        defaultLessons.push({ subjectId: sub.id, topic: t });
      });
    });
    setLessons([...customL, ...defaultLessons]);

    // 3. Flashcards
    const customFStr = localStorage.getItem('shadhin_custom_flashcards');
    let customF: Flashcard[] = [];
    if (customFStr) {
      try { customF = JSON.parse(customFStr); } catch (e) {}
    }
    setFlashcards([...customF, ...FLASHCARDS_DATA]);

    // 4. Mnemonics
    const customMStr = localStorage.getItem('shadhin_custom_mnemonics');
    let customM: MnemonicTrick[] = [];
    if (customMStr) {
      try { customM = JSON.parse(customMStr); } catch (e) {}
    }
    setMnemonics([...customM, ...MNEMONICS_DATA]);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Utility to check if item is default or custom
  const isCustomItem = (id: string) => {
    return id.startsWith('custom_') || id.includes('custom') || !isNaN(Number(id)) === false;
  };

  const resetForms = () => {
    setIsAdding(false);
    setEditingId(null);

    // Qs Reset
    setPqId('');
    setPqExamName('');
    setPqYear('২০২৬');
    setPqCategory('bcs');
    setPqText('');
    setPqOptions(['', '', '', '']);
    setPqCorrectIdx(0);
    setPqExplanation('');

    // Lesson Reset
    setLcTitle('');
    setLcTag('');
    setLcContent('');
    setLcHack('');
    setLcQuizQ('');
    setLcQuizOptions(['', '', '', '']);
    setLcQuizCorrectIdx(0);
    setLcQuizExplanation('');

    // FC Reset
    setFcFront('');
    setFcBack('');
    setFcHint('');

    // Mnemonic Reset
    setMnCategory('');
    setMnTitle('');
    setMnFormula('');
    setMnExplanation('');
    setMnExample('');
  };

  // --- SAVE / UPDATE HANDLERS ---
  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pqExamName || !pqText || pqOptions.some(o => !o)) {
      showToast?.('অনুগ্রহ করে প্রয়োজনীয় সব তথ্যাদি পূর্ণ করুন!', 'error');
      return;
    }

    const currentCustomStr = localStorage.getItem('shadhin_custom_past_questions');
    let customQ: PastQuestion[] = [];
    if (currentCustomStr) {
      try { customQ = JSON.parse(currentCustomStr); } catch (err) {}
    }

    if (editingId) {
      // Edit existing custom
      customQ = customQ.map(q => {
        if (q.id === editingId) {
          return {
            ...q,
            examName: pqExamName,
            year: pqYear,
            category: pqCategory,
            questionText: pqText,
            options: [...pqOptions],
            correctIndex: pqCorrectIdx,
            explanation: pqExplanation || 'কোনো সমাধান বা ব্যাখ্যা প্রদান করা হয়নি।'
          };
        }
        return q;
      });
      showToast?.('প্রশ্নটি সফলভাবে এডিট করা হয়েছে!', 'success');
    } else {
      // Create new Custom Question (direct publishing as Admin!)
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
      customQ.unshift(newQuestion);
      showToast?.('নতুন বিগত সালের পরীক্ষা প্রশ্ন এডমিন হিসেবে প্রকাশ করা হয়েছে!', 'success');
    }

    localStorage.setItem('shadhin_custom_past_questions', JSON.stringify(customQ));
    loadData();
    resetForms();
  };

  const handleSaveLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lcTitle || !lcContent || !lcQuizQ || lcQuizOptions.some(o => !o)) {
      showToast?.('অনুগ্রহ করে লেকচার এবং কুইজের প্রয়োজনীয় মূল অংশগুলো পূর্ণ করুন!', 'error');
      return;
    }

    const currentCustomStr = localStorage.getItem('shadhin_custom_topics');
    let customL: { subjectId: string; topic: Topic }[] = [];
    if (currentCustomStr) {
      try { customL = JSON.parse(currentCustomStr); } catch (err) {}
    }

    if (editingId) {
      customL = customL.map(item => {
        if (item.topic.id === editingId) {
          return {
            subjectId: lcSubjectId,
            topic: {
              ...item.topic,
              title: lcTitle,
              importantTag: lcTag,
              content: lcContent,
              quickHack: lcHack || 'কোনো সর্টকাট ট্রিক নেই',
              quiz: {
                question: lcQuizQ,
                options: [...lcQuizOptions],
                answerIndex: lcQuizCorrectIdx,
                explanation: lcQuizExplanation || 'কোনো সমাধান বা ব্যাখ্যা নেই'
              }
            }
          };
        }
        return item;
      });
      showToast?.('লেকচারটি সফলভাবে এডিট করা হয়েছে!', 'success');
    } else {
      const newTopic: Topic = {
        id: `custom_lec_${Date.now()}`,
        title: lcTitle,
        importantTag: lcTag,
        content: lcContent,
        quickHack: lcHack || 'কোনো সর্টকাট ট্রিক নেই',
        quiz: {
          question: lcQuizQ,
          options: [...lcQuizOptions],
          answerIndex: lcQuizCorrectIdx,
          explanation: lcQuizExplanation || 'কোনো সমাধান বা ব্যাখ্যা নেই'
        }
      };
      customL.unshift({ subjectId: lcSubjectId, topic: newTopic });
      showToast?.('নতুন লেকচার টপিক সরাসরি এডমিন প্যানেলে লাইভ করা হয়েছে!', 'success');
    }

    localStorage.setItem('shadhin_custom_topics', JSON.stringify(customL));
    loadData();
    resetForms();
  };

  const handleSaveFlashcard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fcFront || !fcBack) {
      showToast?.('ফ্ল্যাশ ও ব্যাক পার্টের মূল তথ্য দিন!', 'error');
      return;
    }

    const categoriesLabels: { [key: string]: string } = {
      english: 'ইংরেজি ভোকেব',
      constitution: 'সংবিধান আর্ট',
      gk: 'সাধারণ জ্ঞান',
      math: 'গণিত সূত্রসমূহ',
      science: 'দৈনন্দিন বিজ্ঞান'
    };

    const currentCustomStr = localStorage.getItem('shadhin_custom_flashcards');
    let customF: Flashcard[] = [];
    if (currentCustomStr) {
      try { customF = JSON.parse(currentCustomStr); } catch (err) {}
    }

    if (editingId) {
      customF = customF.map(card => {
        if (card.id === editingId) {
          return {
            ...card,
            category: fcCategory,
            categoryLabel: categoriesLabels[fcCategory] || 'কাস্টম ফ্লাশকার্ড',
            front: fcFront,
            back: fcBack,
            hint: fcHint || undefined
          };
        }
        return card;
      });
      showToast?.('ফ্ল্যাশ কার্ডটি সফলভাবে এডিট করা হয়েছে!', 'success');
    } else {
      const newCard: Flashcard = {
        id: `custom_fc_${Date.now()}`,
        category: fcCategory,
        categoryLabel: categoriesLabels[fcCategory] || 'কাস্টম ফ্লাশকার্ড',
        front: fcFront,
        back: fcBack,
        hint: fcHint || undefined
      };
      customF.unshift(newCard);
      showToast?.('নতুন স্মার্ট ফ্ল্যাশ কার্ড সফলভাবে পাবলিশ করা হয়েছে!', 'success');
    }

    localStorage.setItem('shadhin_custom_flashcards', JSON.stringify(customF));
    loadData();
    resetForms();
  };

  const handleSaveMnemonic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mnTitle || !mnFormula || !mnExplanation) {
      showToast?.('অনুগ্রহ করে সমস্ত বড় ফিল্ডগুলো পূরণ করুন!', 'error');
      return;
    }

    const currentCustomStr = localStorage.getItem('shadhin_custom_mnemonics');
    let customM: MnemonicTrick[] = [];
    if (currentCustomStr) {
      try { customM = JSON.parse(currentCustomStr); } catch (err) {}
    }

    if (editingId) {
      customM = customM.map(mn => {
        if (mn.id === editingId) {
          return {
            ...mn,
            category: mnCategory,
            title: mnTitle,
            formula: mnFormula,
            explanation: mnExplanation,
            example: mnExample || 'উদাহরণ প্রয়োজন টাইপ করা হয়নি'
          };
        }
        return mn;
      });
      showToast?.('ছন্দের ট্রিকটি সফলভাবে এডিট করা হয়েছে!', 'success');
    } else {
      const newMnemonic: MnemonicTrick = {
        id: `custom_mn_${Date.now()}`,
        category: mnCategory,
        title: mnTitle,
        formula: mnFormula,
        explanation: mnExplanation,
        example: mnExample || 'উদাহরণ প্রয়োজন টাইপ করা হয়নি'
      };
      customM.unshift(newMnemonic);
      showToast?.('নতুন ছন্দের মেমরি ট্রিকটি এডমিন হিসেবে সেভ করা হয়েছে!', 'success');
    }

    localStorage.setItem('shadhin_custom_mnemonics', JSON.stringify(customM));
    loadData();
    resetForms();
  };

  // --- DELETE HANDLER (Only applicable for custom storage) ---
  const handleDeleteItem = (id: string, type: 'question' | 'lesson' | 'flashcard' | 'mnemonic') => {
    if (!confirm('আপনি কি নিশ্চিত যে এই কাস্টম আইটেমটি ডিলিট করতে চান? এটি চিরতরে সাইট থেকে মুছে যাবে।')) {
      return;
    }

    if (type === 'question') {
      const current = localStorage.getItem('shadhin_custom_past_questions');
      if (current) {
        const parsed: PastQuestion[] = JSON.parse(current);
        const filtered = parsed.filter(item => item.id !== id);
        localStorage.setItem('shadhin_custom_past_questions', JSON.stringify(filtered));
      }
    } else if (type === 'lesson') {
      const current = localStorage.getItem('shadhin_custom_topics');
      if (current) {
        const parsed: any[] = JSON.parse(current);
        const filtered = parsed.filter(item => item.topic.id !== id);
        localStorage.setItem('shadhin_custom_topics', JSON.stringify(filtered));
      }
    } else if (type === 'flashcard') {
      const current = localStorage.getItem('shadhin_custom_flashcards');
      if (current) {
        const parsed: Flashcard[] = JSON.parse(current);
        const filtered = parsed.filter(item => item.id !== id);
        localStorage.setItem('shadhin_custom_flashcards', JSON.stringify(filtered));
      }
    } else if (type === 'mnemonic') {
      const current = localStorage.getItem('shadhin_custom_mnemonics');
      if (current) {
        const parsed: MnemonicTrick[] = JSON.parse(current);
        const filtered = parsed.filter(item => item.id !== id);
        localStorage.setItem('shadhin_custom_mnemonics', JSON.stringify(filtered));
      }
    }

    showToast?.('সাফল্যের সাথে আইটেমটি ডিলিট করা হয়েছে!', 'success');
    loadData();
  };

  // --- POPULATE FOR EDITING ---
  const startEditQuestion = (q: PastQuestion) => {
    setEditingId(q.id);
    setIsAdding(true);

    setPqExamName(q.examName);
    setPqYear(q.year);
    setPqCategory(q.category as any);
    setPqText(q.questionText);
    setPqOptions([...q.options]);
    setPqCorrectIdx(q.correctIndex);
    setPqExplanation(q.explanation);
  };

  const startEditLesson = (item: { subjectId: string; topic: Topic }) => {
    setEditingId(item.topic.id);
    setIsAdding(true);

    setLcSubjectId(item.subjectId);
    setLcTitle(item.topic.title);
    setLcTag(item.topic.importantTag);
    setLcContent(item.topic.content);
    setLcHack(item.topic.quickHack);
    setLcQuizQ(item.topic.quiz.question);
    setLcQuizOptions([...item.topic.quiz.options]);
    setLcQuizCorrectIdx(item.topic.quiz.answerIndex);
    setLcQuizExplanation(item.topic.quiz.explanation);
  };

  const startEditFlashcard = (c: Flashcard) => {
    setEditingId(c.id);
    setIsAdding(true);

    setFcCategory(c.category as any);
    setFcFront(c.front);
    setFcBack(c.back);
    setFcHint(c.hint || '');
  };

  const startEditMnemonic = (mn: MnemonicTrick) => {
    setEditingId(mn.id);
    setIsAdding(true);

    setMnCategory(mn.category);
    setMnTitle(mn.title);
    setMnFormula(mn.formula);
    setMnExplanation(mn.explanation);
    setMnExample(mn.example);
  };

  // Filter lists based on Query
  const filteredQuestions = questions.filter(q => 
    q.questionText.toLowerCase().includes(searchQuery.toLowerCase()) || 
    q.examName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLessons = lessons.filter(l => 
    l.topic.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.topic.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFlashcards = flashcards.filter(f => 
    f.front.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.back.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMnemonics = mnemonics.filter(m => 
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.formula.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* 1. Header Control Panel */}
      <div className="bg-white p-5 rounded-3xl border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xs">
        <div className="space-y-1">
          <h2 className="text-lg font-black text-slate-900 font-bengali flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-600" />
            শিক্ষণ ও ভর্তি প্রস্তুতি কন্টেন্ট ডাটাবেস গাইড
          </h2>
          <p className="text-xs text-slate-500 font-sans">
            এখানে ব্যবহারকারীদের অবদানকৃত বিভিন্ন বিগত চাকরির লিখিত/MCQ প্রশ্ন এবং শিক্ষণ লেকচার নোট নিয়ন্ত্রণ করুন।
          </p>
        </div>
        
        <button
          onClick={() => {
            resetForms();
            setIsAdding(!isAdding);
          }}
          className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl transition-all shadow-md flex items-center gap-2 font-bengali"
        >
          {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {isAdding ? 'লিস্ট ভিউতে ফিরুন' : 'নতুন কন্টেন্ট লাইভ করতে যুক্ত করুন'}
        </button>
      </div>

      {/* 2. Form Rendering Zone */}
      {isAdding && (
        <div className="bg-white p-6 rounded-3xl border-2 border-emerald-500/20 shadow-xl max-w-4xl mx-auto text-left font-sans transition-all">
          <div className="border-b border-gray-100 pb-4 mb-6 flex justify-between items-center">
            <h3 className="text-base font-black text-gray-900 font-bengali">
              {editingId ? 'সম্পর্কিত কন্টেন্ট এডিট করুন' : 'নতুন প্রিপারেশন আইটেম তৈরি প্রজেক্ট'} ({
                activeSubTab === 'questions' ? 'বিগত প্রশ্ন' :
                activeSubTab === 'lessons' ? 'লেকচার কুইজ' :
                activeSubTab === 'flashcards' ? 'ফ্ল্যাশ কার্ড' : 'আবৃত্তি ছন্দ ট্রিক'
              })
            </h3>
            <button onClick={resetForms} className="p-2 bg-gray-55 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form switchers based on sub-tab */}
          {activeSubTab === 'questions' && (
            <form onSubmit={handleSaveQuestion} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600">পরীক্ষার নাম (যেমন: ৪৬তম বিসিএস প্রিলিমিনারি) *</label>
                  <input 
                    type="text" required value={pqExamName} onChange={e => setPqExamName(e.target.value)}
                    placeholder="পরীক্ষার নাম বা প্রশ্ন উৎস" className="w-full px-4 py-2 border border-gray-200 bg-gray-50/50 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-550"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600">বছর (Year) *</label>
                    <input 
                      type="text" required value={pqYear} onChange={e => setPqYear(e.target.value)}
                      placeholder="২০২৬" className="w-full px-4 py-2 border border-gray-200 bg-gray-50/50 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-550"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600">ক্যাটাগরি *</label>
                    <select 
                      value={pqCategory} onChange={e => setPqCategory(e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-200 bg-gray-50/50 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-550"
                    >
                      <option value="bcs">বিসিএস (BCS)</option>
                      <option value="bank">ব্যাংক জবস (Bank)</option>
                      <option value="primary">প্রাইমারি শিক্ষক (Primary)</option>
                      <option value="other">অন্যান্য সরকারি পরীক্ষা</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">প্রশ্ন টেক্সট (Question Label) *</label>
                <textarea 
                  required rows={2} value={pqText} onChange={e => setPqText(e.target.value)}
                  placeholder="প্রশ্নটি সুন্দরভাবে লিখুন..." className="w-full px-4 py-2 border border-gray-200 bg-gray-50/50 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-550"
                />
              </div>

              <div className="space-y-3 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                <span className="text-xs font-bold text-emerald-800 block">এমসিকিউ উত্তর বিকল্পসমূহ (৪টি অপশন দিন) *</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {pqOptions.map((opt, oIdx) => (
                    <div key={oIdx} className="space-y-1">
                      <span className="text-[10px] font-bold text-emerald-700">বিকল্প {oIdx + 1}</span>
                      <input 
                        type="text" required value={opt} 
                        onChange={e => {
                          const copy = [...pqOptions];
                          copy[oIdx] = e.target.value;
                          setPqOptions(copy);
                        }}
                        placeholder={`উত্তর অপশন ${oIdx + 1}`} 
                        className="w-full px-3 py-2 border border-gray-200 bg-white rounded-xl text-xs font-semibold"
                      />
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <label className="text-xs font-bold text-slate-800 block mb-1">কোনটি সঠিক উত্তর? *</label>
                  <select 
                    value={pqCorrectIdx} onChange={e => setPqCorrectIdx(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 border border-gray-200 bg-white rounded-xl text-xs font-bold"
                  >
                    <option value={0}>বিকল্প ১ সঠিক</option>
                    <option value={1}>বিকল্প ২ সঠিক</option>
                    <option value={2}>বিকল্প ৩ সঠিক</option>
                    <option value={3}>বিকল্প ৪ সঠিক</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">বিশ্লেষণ ও ব্যাকরণগত ব্যাখ্যা (Explanation)</label>
                <textarea 
                  rows={2} value={pqExplanation} onChange={e => setPqExplanation(e.target.value)}
                  placeholder="প্রশ্নটির সমাধান ব্যাখ্যা এখানে দিন..." className="w-full px-4 py-2 border border-gray-200 bg-gray-50/50 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-550"
                />
              </div>

              <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 font-bengali">
                <Save className="w-4 h-4" />
                {editingId ? 'আপডেট সেভ করুন (Publish)' : 'নতুন বিগত সালের এমসিকিউ যোগ করুন'}
              </button>
            </form>
          )}

          {activeSubTab === 'lessons' && (
            <form onSubmit={handleSaveLesson} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600">কোন বিষয়ের অংশ? (Subject Block) *</label>
                  <select 
                    value={lcSubjectId} onChange={e => setLcSubjectId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 bg-gray-50/50 rounded-xl text-xs font-bold"
                  >
                    <option value="bangla">বাংলা ভাষা ও সাহিত্য (Bangla)</option>
                    <option value="english">ইংরেজি ভাষা ও সাহিত্য (English)</option>
                    <option value="math">গাণিতিক যুক্তি ও দক্ষতা (Mathematics)</option>
                    <option value="gk">বাংলাদেশ ও আন্তর্জাতিক সায়েন্স (General Knowledge)</option>
                    <option value="computer">কম্পিউটার ও আইসিটি (ICT)</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600">লেকচার শিরোনাম *</label>
                    <input 
                      type="text" required value={lcTitle} onChange={e => setLcTitle(e.target.value)}
                      placeholder="যেমন: সমাস চেনার সহজ ট্রিকস" className="w-full px-4 py-2 border border-gray-200 bg-gray-50/50 rounded-xl text-xs font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600">গুরুত্ব ট্যাগ (Tag name)</label>
                    <input 
                      type="text" value={lcTag} onChange={e => setLcTag(e.target.value)}
                      placeholder="যেমন: ৩ নম্বর বিসিএস কমন" className="w-full px-4 py-2 border border-gray-200 bg-gray-50/50 rounded-xl text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">লেকচারের বিস্তারিত আর্টিকেল ও বিশ্লেষণ কন্টেন্ট *</label>
                <textarea 
                  required rows={5} value={lcContent} onChange={e => setLcContent(e.target.value)}
                  placeholder="ডিটেইলড তথ্য সূত্র এখানে লিখুন..." className="w-full px-4 py-2 border border-gray-200 bg-gray-50/50 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-555 leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-amber-800">শর্টকাট মেমোরি হ্যাক (Memory Hack Shortcut)</label>
                <input 
                  type="text" value={lcHack} onChange={e => setLcHack(e.target.value)}
                  placeholder="ছন্দে সহজে কিভাবে মনে রাখা যায়..." className="w-full px-4 py-2 border border-gray-200 bg-gray-50/50 rounded-xl text-xs font-semibold"
                />
              </div>

              {/* Quiz details */}
              <div className="p-4 bg-emerald-500/5 border border-emerald-500/15 rounded-2xl space-y-3">
                <span className="text-xs font-bold text-emerald-950 block">লেকচারের কুইজ কোশ্চেন নির্ধারণ (সহযোগী প্রশ্ন) *</span>
                
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400 block">কুইজ প্রশ্ন টেক্সট</span>
                  <input 
                    type="text" required value={lcQuizQ} onChange={e => setLcQuizQ(e.target.value)}
                    placeholder="চর্যাপদের প্রথম কবি কে?" className="w-full px-3 py-2 border border-gray-200 bg-white rounded-xl text-xs font-semibold"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {lcQuizOptions.map((opt, idx) => (
                    <div key={idx} className="space-y-1">
                      <span className="text-[10px] font-bold text-emerald-700">বিকল্প উত্তর {idx + 1}</span>
                      <input 
                        type="text" required value={opt}
                        onChange={e => {
                          const copy = [...lcQuizOptions];
                          copy[idx] = e.target.value;
                          setLcQuizOptions(copy);
                        }}
                        placeholder={`অপশন ${idx + 1}`} className="w-full px-3 py-2 border border-gray-200 bg-white rounded-xl text-xs font-semibold"
                      />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-800 font-bold block">সঠিক উত্তর নির্দেশন</span>
                    <select 
                      value={lcQuizCorrectIdx} onChange={e => setLcQuizCorrectIdx(parseInt(e.target.value, 10))}
                      className="w-full px-3 py-2 border border-gray-200 bg-white rounded-xl text-xs font-bold"
                    >
                      <option value={0}>অপশন ১ সঠিক</option>
                      <option value={1}>অপশন ২ সঠিক</option>
                      <option value={2}>অপশন ৩ সঠিক</option>
                      <option value={3}>অপশন ৪ সঠিক</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 block">ঝটপট কুইজের সঠিক সমাধান ব্যাখ্যা</span>
                    <input 
                      type="text" value={lcQuizExplanation} onChange={e => setLcQuizExplanation(e.target.value)}
                      placeholder="অপশনটির ব্যাখ্যা..." className="w-full px-3 py-2 border border-gray-200 bg-white rounded-xl text-xs font-medium"
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 font-bengali">
                <Save className="w-4 h-4" />
                {editingId ? 'লেকচার আপডেট প্রকাশ করুন' : 'নতুন লেকচার প্লাস কুইজ ডাটা সেভ করুন'}
              </button>
            </form>
          )}

          {activeSubTab === 'flashcards' && (
            <form onSubmit={handleSaveFlashcard} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600">কার্ড ক্যাটাগরি ধরন *</label>
                  <select 
                    value={fcCategory} onChange={e => setFcCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-200 bg-gray-50/50 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-550"
                  >
                    <option value="english">ইংরেজি শব্দার্থ (English Vocab)</option>
                    <option value="constitution">সংবিধানের ধারা ও আর্ট (Constitution)</option>
                    <option value="gk">সাধারণ জ্ঞান ক্যাটিগরি (GK)</option>
                    <option value="math">গাণিতিক সূত্রাবলি (Math Formulas)</option>
                    <option value="science">দৈনন্দিন বিজ্ঞান (Science Concept)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600">স্মরণ সহায়ক সংকেত বাণী (Hint, optional)</label>
                  <input 
                    type="text" value={fcHint} onChange={e => setFcHint(e.target.value)}
                    placeholder="কার্ডের ওপরে ছোট সংকেত নির্দেশনা..." className="w-full px-4 py-2 border border-gray-200 bg-gray-50/50 rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-indigo-800 block">কার্ডের সামনের পার্ট (Front side) *</label>
                  <textarea 
                    required rows={3} value={fcFront} onChange={e => setFcFront(e.target.value)}
                    placeholder="যেমন: Abate (Verb)" className="w-full px-4 py-2.5 bg-indigo-50/10 border border-gray-200 text-xs text-center font-bold font-sans rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-emerald-800 block">কার্ডের পিছনের পার্ট (Back side - Answer) *</label>
                  <textarea 
                    required rows={3} value={fcBack} onChange={e => setFcBack(e.target.value)}
                    placeholder="যেমন: কমানো বা ম্রিয়মাণ হওয়া।" className="w-full px-4 py-2.5 bg-emerald-50/10 border border-gray-200 text-xs text-center font-bold font-bengali rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 font-bengali">
                <Save className="w-4 h-4" />
                {editingId ? 'স্মার্ট ফ্ল্যাশ কার্ড আপডেট করুন' : 'নতুন স্মার্ট কার্ড এডমিন হিসেবে লাইভ করুন'}
              </button>
            </form>
          )}

          {activeSubTab === 'mnemonics' && (
            <form onSubmit={handleSaveMnemonic} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600">ছন্দের রূপ ক্যাটাগরি (যেমন: রবীন্দ্রনাথের উপন্যাস) *</label>
                  <input 
                    type="text" required value={mnCategory} onChange={e => setMnCategory(e.target.value)}
                    placeholder="ক্যাটাগরি বা ছন্দের বিষয়বস্তু" className="w-full px-4 py-2 border border-gray-200 bg-gray-50/50 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-550"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600">ছন্দ গীতি শিরোনাম বা টাইটেল *</label>
                  <input 
                    type="text" required value={mnTitle} onChange={e => setMnTitle(e.target.value)}
                    placeholder="মনে রাখার সহজ টেকনিক শিরোনাম" className="w-full px-4 py-2 border border-gray-200 bg-gray-50/50 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-550"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-emerald-800 font-sans block">চক্র ছন্দ কবিতা বা সংকেত বাণী (Mnemonic Formula) *</label>
                <input 
                  type="text" required value={mnFormula} onChange={e => setMnFormula(e.target.value)}
                  placeholder="যেমন: বাঁধন হারা শিউলি মালা কুহেলিকা মৃত্যুর খোঁজে..." className="w-full px-4 py-2.5 border border-emerald-100 bg-green-50/10 rounded-xl text-xs font-bengali font-bold"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 block">ছন্দের সহজ সংক্ষিপ্ত বিশ্লেষণ ও ব্যাখ্যা *</label>
                  <textarea 
                    required rows={3} value={mnExplanation} onChange={e => setMnExplanation(e.target.value)}
                    placeholder="যেমন ছড়া থেকে উপন্যাসের নাম যেভাবে বের হবে..." className="w-full px-4 py-2 border border-gray-200 text-xs font-medium bg-gray-50/50 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 block">প্রধান উদাহরণসমূহ তালিকা (Derived list)</label>
                  <textarea 
                    rows={3} value={mnExample} onChange={e => setMnExample(e.target.value)}
                    placeholder="যেমন: বাঁধন হারা, শিউলিমালা, কুহেলিকা, মৃত্যুক্ষুধা।" className="w-full px-4 py-2 border border-gray-200 text-xs font-medium bg-gray-50/50 rounded-xl"
                  />
                </div>
              </div>

              <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 font-bengali">
                <Save className="w-4 h-4" />
                {editingId ? 'মেমোরি ছন্দ সংস্কার ও সেভ করুন' : 'নতুন আবৃত্তি ছন্দ ট্রিক প্রকাশ করুন'}
              </button>
            </form>
          )}
        </div>
      )}

      {/* 3. Sub-tabs Selection Grid & Search filter bar */}
      {!isAdding && (
        <div className="space-y-6 text-left">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50 p-4 rounded-3xl border border-gray-150 shadow-2xs">
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'questions', label: 'বিগত শতাদ্বীন MCQ প্রশ্ন ব্যাংক', count: filteredQuestions.length, icon: <FileText className="w-4 h-4" /> },
                { id: 'lessons', label: 'লেকচার বিষয়সমূহ', count: filteredLessons.length, icon: <BookOpen className="w-4 h-4" /> },
                { id: 'flashcards', label: 'স্মার্ট ফ্লাশকার্ডসমূহ', count: filteredFlashcards.length, icon: <Zap className="w-4 h-4" /> },
                { id: 'mnemonics', label: 'আবৃত্তি ছন্দ ট্রিকস', count: filteredMnemonics.length, icon: <Sparkles className="w-4 h-4" /> },
              ].map(sub => (
                <button
                  key={sub.id}
                  onClick={() => {
                    setActiveSubTab(sub.id as any);
                    setSearchQuery('');
                  }}
                  className={`px-4.5 py-3 rounded-2xl text-xs font-black transition-all flex items-center gap-2 font-bengali ${
                    activeSubTab === sub.id
                      ? 'bg-emerald-600 text-white shadow-md scale-102 font-sans'
                      : 'bg-white hover:bg-white/80 border border-gray-150 text-slate-800'
                  }`}
                >
                  {sub.icon}
                  {sub.label}
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeSubTab === sub.id ? 'bg-emerald-800 text-white' : 'bg-gray-100 text-gray-500'}`}>
                    {sub.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="মডিউল সার্চ ফিল্টার..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 bg-white rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-555"
              />
            </div>
          </div>

          {/* 4. Database Lists Views */}
          
          {/* A. PAST QUESTIONS PANEL */}
          {activeSubTab === 'questions' && (
            <div className="grid grid-cols-1 gap-4">
              {filteredQuestions.map((q) => {
                const isCustom = isCustomItem(q.id);
                return (
                  <div key={q.id} className={`p-5 rounded-3xl bg-white border ${isCustom ? 'border-amber-300 bg-amber-50/5' : 'border-gray-150'} shadow-xs flex flex-col md:flex-row justify-between gap-4 relative overflow-hidden transition-all hover:shadow-sm`}>
                    {isCustom && (
                      <div className="absolute top-0 left-0 px-2.5 py-0.5 bg-amber-500 text-white text-[9px] font-bold rounded-br-2xl">
                        USER CONTRIBUTED / CUSTOM
                      </div>
                    )}
                    <div className="space-y-2 mt-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-xl text-[10px] font-black uppercase font-sans">
                          {q.category.toUpperCase()} Exam
                        </span>
                        <span className="text-xs font-bold text-emerald-700 font-bengali">
                          {q.examName} ({q.year})
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-slate-900 leading-relaxed font-bengali">
                        {q.questionText}
                      </h4>
                      <div className="grid grid-cols-2 gap-2 max-w-lg mt-1 pt-1 border-t border-dashed border-gray-100 font-bengali">
                        {q.options.map((opt, oIdx) => (
                          <div key={oIdx} className={`text-xs p-1.5 rounded-lg ${oIdx === q.correctIndex ? 'bg-emerald-50 text-emerald-800 font-black' : 'text-slate-500'}`}>
                            {oIdx + 1}. {opt} {oIdx === q.correctIndex && '✓'}
                          </div>
                        ))}
                      </div>
                      {q.explanation && (
                        <p className="text-[11px] text-slate-400 italic font-bengali pt-1 max-w-2xl">
                          <HelpCircle className="w-3.5 h-3.5 inline mr-1 text-slate-300" />
                          ব্যাখ্যা: {q.explanation}
                        </p>
                      )}
                    </div>

                    <div className="flex md:flex-col justify-end gap-2 shrink-0 md:border-l border-gray-100 md:pl-4">
                      {isCustom ? (
                        <>
                          <button
                            onClick={() => startEditQuestion(q)}
                            className="p-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                            title="এডিট করুন"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span className="md:inline hidden font-bengali">সম্পাদনা</span>
                          </button>
                          <button
                            onClick={() => handleDeleteItem(q.id, 'question')}
                            className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="md:inline hidden font-bengali">মুছুন</span>
                          </button>
                        </>
                      ) : (
                        <span className="text-[10px] text-slate-300 italic font-medium p-2 text-center select-none">
                          Default System Data
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
              {filteredQuestions.length === 0 && (
                <div className="py-12 text-center text-slate-400 text-xs font-medium">কোনো বিগত প্রশ্ন পাওয়া যায়নি।</div>
              )}
            </div>
          )}

          {/* B. SUBJECT LECTURE NOTES LIST */}
          {activeSubTab === 'lessons' && (
            <div className="grid grid-cols-1 gap-4">
              {filteredLessons.map((item) => {
                const isCustom = isCustomItem(item.topic.id);
                return (
                  <div key={item.topic.id} className={`p-5 rounded-3xl bg-white border ${isCustom ? 'border-amber-300 bg-amber-50/5' : 'border-gray-150'} shadow-xs flex flex-col md:flex-row justify-between gap-4 relative overflow-hidden transition-all hover:shadow-sm`}>
                    {isCustom && (
                      <div className="absolute top-0 left-0 px-2.5 py-0.5 bg-amber-500 text-white text-[9px] font-bold rounded-br-2xl">
                        ADMIN CUSTOM LECTURE
                      </div>
                    )}
                    <div className="space-y-2 mt-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-xl text-[10px] font-black uppercase font-sans">
                          {item.subjectId.toUpperCase()}
                        </span>
                        {item.topic.importantTag && (
                          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-xl text-[10px] font-black">
                            {item.topic.importantTag}
                          </span>
                        )}
                        <h4 className="text-sm font-black text-slate-900 leading-relaxed font-bengali">
                          {item.topic.title}
                        </h4>
                      </div>
                      
                      <p className="text-xs text-slate-600 line-clamp-3 font-bengali max-w-3xl leading-relaxed">
                        {item.topic.content}
                      </p>

                      <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-bengali space-y-1 max-w-3xl mt-1">
                        <div className="font-bold text-amber-800 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          শর্টকাট ট্রিক: {item.topic.quickHack}
                        </div>
                        <div className="text-slate-550 flex items-center gap-1.5 border-t border-gray-200/50 pt-1 mt-1">
                          <ArrowRight className="w-3 h-3 text-emerald-600" />
                          কুইজ: {item.topic.quiz.question} (উত্তর:অপশন {item.topic.quiz.answerIndex + 1})
                        </div>
                      </div>
                    </div>

                    <div className="flex md:flex-col justify-end gap-2 shrink-0 md:border-l border-gray-100 md:pl-4">
                      {isCustom ? (
                        <>
                          <button
                            onClick={() => startEditLesson(item)}
                            className="p-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                            title="এডিট করুন"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span className="md:inline hidden font-bengali">সম্পাদনা</span>
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.topic.id, 'lesson')}
                            className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="md:inline hidden font-bengali">মুছুন</span>
                          </button>
                        </>
                      ) : (
                        <span className="text-[10px] text-slate-300 italic font-medium p-2 text-center select-none">
                          Default System Data
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
              {filteredLessons.length === 0 && (
                <div className="py-12 text-center text-slate-400 text-xs font-medium">কোনো লেকচার কন্টেন্ট পাওয়া যায়নি।</div>
              )}
            </div>
          )}

          {/* C. SMART FLASHCARDS LIST */}
          {activeSubTab === 'flashcards' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredFlashcards.map((c) => {
                const isCustom = isCustomItem(c.id);
                return (
                  <div key={c.id} className={`p-5 rounded-3xl bg-white border ${isCustom ? 'border-amber-300 bg-amber-50/5' : 'border-gray-150'} shadow-xs flex justify-between gap-4 relative overflow-hidden transition-all hover:shadow-sm`}>
                    {isCustom && (
                      <div className="absolute top-0 left-0 px-2.5 py-0.5 bg-amber-500 text-white text-[9px] font-bold rounded-br-2xl">
                        CUSTOM SMART CARD
                      </div>
                    )}
                    <div className="space-y-2 mt-2 w-full text-left">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-xl text-[10px] font-black uppercase font-sans inline-block">
                        {c.categoryLabel}
                      </span>
                      <div className="grid grid-cols-2 gap-3.5 pt-2 font-bengali">
                        <div className="p-3 bg-indigo-50/20 border border-indigo-100/50 rounded-2xl">
                          <span className="text-[9px] font-bold text-indigo-700 uppercase block tracking-wider">FRONT Side</span>
                          <span className="text-xs font-bold text-gray-900 mt-1 block leading-relaxed font-sans">{c.front}</span>
                        </div>
                        <div className="p-3 bg-emerald-50/20 border border-emerald-100/50 rounded-2xl">
                          <span className="text-[9px] font-bold text-emerald-700 uppercase block tracking-wider font-sans">BACK Side (উত্তর)</span>
                          <span className="text-xs font-bold text-gray-900 mt-1 block leading-relaxed">{c.back}</span>
                        </div>
                      </div>
                      {c.hint && (
                        <p className="text-[10px] text-slate-400 block font-sans">
                          💡 Hint: <span className="font-medium font-bengali">{c.hint}</span>
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col justify-end gap-2 shrink-0 border-l border-gray-100 pl-4">
                      {isCustom ? (
                        <>
                          <button
                            onClick={() => startEditFlashcard(c)}
                            className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs transition-colors"
                            title="এডিট করুন"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(c.id, 'flashcard')}
                            className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs transition-colors"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <span className="text-[10px] text-slate-300 italic font-medium select-none text-center">
                          Default
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
              {filteredFlashcards.length === 0 && (
                <div className="py-12 col-span-2 text-center text-slate-400 text-xs font-medium">কোনো ফ্ল্যাশ কার্ড পাওয়া যায়নি।</div>
              )}
            </div>
          )}

          {/* D. MNEMONICS RHYMES TECHNIQUE */}
          {activeSubTab === 'mnemonics' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMnemonics.map((mn) => {
                const isCustom = isCustomItem(mn.id);
                return (
                  <div key={mn.id} className={`p-5 rounded-3xl bg-white border ${isCustom ? 'border-amber-300 bg-amber-50/5' : 'border-gray-150'} shadow-xs flex justify-between gap-4 relative overflow-hidden transition-all hover:shadow-sm`}>
                    {isCustom && (
                      <div className="absolute top-0 left-0 px-2.5 py-0.5 bg-amber-500 text-white text-[9px] font-bold rounded-br-2xl">
                        CUSTOM TRICK
                      </div>
                    )}
                    <div className="space-y-2 mt-2 w-full text-left font-bengali">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="px-2 bg-emerald-50 text-emerald-800 rounded-lg text-[9px] font-bold uppercase">
                          {mn.category}
                        </span>
                        <h4 className="text-xs font-black text-slate-800">{mn.title}</h4>
                      </div>
                      
                      <div className="p-3 bg-gradient-to-r from-emerald-50 border border-emerald-100/50 rounded-2xl">
                        <span className="text-[9px] text-emerald-800 font-bold uppercase tracking-wider block font-sans">ছন্দ সংকেত</span>
                        <span className="text-xs font-black text-emerald-950 mt-1 block">{mn.formula}</span>
                      </div>

                      <p className="text-xs text-slate-650 leading-relaxed max-w-lg">
                        বিশ্লেষণ: <span className="text-slate-900 font-semibold">{mn.explanation}</span>
                      </p>
                      
                      {mn.example && (
                        <p className="text-[10.5px] text-indigo-700">
                          উদাহরণ: <span className="font-semibold">{mn.example}</span>
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col justify-end gap-2 shrink-0 border-l border-gray-100 pl-4 font-sans">
                      {isCustom ? (
                        <>
                          <button
                            onClick={() => startEditMnemonic(mn)}
                            className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs transition-colors"
                            title="এডিট"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(mn.id, 'mnemonic')}
                            className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs transition-colors"
                            title="মুছুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <span className="text-[10px] text-slate-300 italic font-medium select-none text-center">
                          Default
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
              {filteredMnemonics.length === 0 && (
                <div className="py-12 col-span-2 text-center text-slate-400 text-xs font-medium font-bengali">কোনো আবৃত্তি মেমোরি ছন্দ পাওয়া যায়নি।</div>
              )}
            </div>
          )}

        </div>
      )}

    </div>
  );
};

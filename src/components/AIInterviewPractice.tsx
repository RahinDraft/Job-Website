import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Sparkles, 
  MessageSquare, 
  Send, 
  Loader2, 
  User, 
  Bot, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  Briefcase,
  Trophy,
  History
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIInterviewPracticeProps {
  onBack: () => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const JOB_TYPES = [
  'সফটওয়্যার ইঞ্জিনিয়ার (Software Engineer)',
  'শিক্ষক (Teacher)',
  'ব্যাংকার (Banker)',
  'মার্কেটিং এক্সিকিউটিভ (Marketing Executive)',
  'কাস্টমার সাপোর্ট (Customer Support)',
  'ডাটা এন্ট্রি অপারেটর (Data Entry Operator)',
  'সেলস রিপ্রেজেন্টেটিভ (Sales Representative)',
  'অ্যাকাউন্ট্যান্ট (Accountant)',
  'অন্যান্য (Others)'
];

export const AIInterviewPractice: React.FC<AIInterviewPracticeProps> = ({ onBack, showToast }) => {
  const [step, setStep] = useState<'setup' | 'interview' | 'feedback'>('setup');
  const [jobType, setJobType] = useState('');
  const [customJobType, setCustomJobType] = useState('');
  const [experience, setExperience] = useState('Fresher');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const lastMessageRef = useRef<HTMLDivElement>(null);

  const scrollToLastMessage = () => {
    if (lastMessageRef.current) {
      const lastMsg = messages[messages.length - 1];
      // If it's an assistant message, scroll to the top of it so the user can read from the start
      // If it's a user message or loading, scroll to the bottom
      lastMessageRef.current.scrollIntoView({ 
        behavior: "smooth", 
        block: lastMsg?.role === 'assistant' ? "start" : "end" 
      });
    } else if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(scrollToLastMessage, 150);
    return () => clearTimeout(timeoutId);
  }, [messages, isLoading]);

  // Scroll to top when step changes (especially for feedback)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const startInterview = async () => {
    const finalJobType = jobType === 'অন্যান্য (Others)' ? customJobType : jobType;
    if (!finalJobType) {
      showToast('অনুগ্রহ করে জবের ধরন নির্বাচন করুন', 'error');
      return;
    }

    setStep('interview');
    setIsLoading(true);
    setInterviewStarted(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const prompt = `You are an expert interviewer. Start an interview for the position of "${finalJobType}" with "${experience}" experience level. 
      Please introduce yourself briefly and ask the first interview question in Bengali. 
      Keep the tone professional and encouraging.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      const firstQuestion = response.text || "আসসালামু আলাইকুম। আমি আপনার আজকের ইন্টারভিউয়ার। চলুন শুরু করি। আপনার সম্পর্কে কিছু বলুন।";
      
      setMessages([{
        role: 'assistant',
        content: firstQuestion,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Error starting interview:', error);
      showToast('ইন্টারভিউ শুরু করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।', 'error');
      setStep('setup');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    }]);

    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const finalJobType = jobType === 'অন্যান্য (Others)' ? customJobType : jobType;
      
      // Construct conversation history for context
      const history = messages.map(m => `${m.role === 'user' ? 'Candidate' : 'Interviewer'}: ${m.content}`).join('\n');
      
      const prompt = `You are an expert interviewer for the position of "${finalJobType}". 
      Current Interview History:
      ${history}
      Candidate's latest answer: "${userMessage}"

      Based on the candidate's answer, provide a very brief feedback (if necessary) and ask the next relevant interview question in Bengali. 
      If you have asked enough questions (around 5-6), you can conclude the interview by saying "ধন্যবাদ, আমাদের ইন্টারভিউ এখানেই শেষ।" and provide a summary.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      const aiResponse = response.text || "ধন্যবাদ আপনার উত্তরের জন্য। পরবর্তী প্রশ্ন...";
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      }]);

      if (aiResponse.includes("ইন্টারভিউ এখানেই শেষ") || messages.length >= 10) {
        // Automatically trigger feedback if interview ends
        setTimeout(() => getOverallFeedback(), 2000);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      showToast('মেসেজ পাঠাতে সমস্যা হয়েছে।', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const getOverallFeedback = async () => {
    setIsLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const finalJobType = jobType === 'অন্যান্য (Others)' ? customJobType : jobType;
      const history = messages.map(m => `${m.role === 'user' ? 'Candidate' : 'Interviewer'}: ${m.content}`).join('\n');

      const prompt = `Analyze the following interview for the position of "${finalJobType}":
      ${history}

      Provide a comprehensive feedback in Bengali covering:
      1. Strengths (আপনার সবল দিকগুলো)
      2. Areas for improvement (উন্নতির জায়গাগুলো)
      3. Overall score out of 10 (সামগ্রিক স্কোর)
      4. Tips for the real interview (টিপস)
      
      Format the response nicely using Markdown.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      setFeedback(response.text || "দুঃখিত, ফিডব্যাক জেনারেট করা সম্ভব হয়নি।");
      setStep('feedback');
    } catch (error) {
      console.error('Error getting feedback:', error);
      showToast('ফিডব্যাক পেতে সমস্যা হয়েছে।', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const resetInterview = () => {
    setStep('setup');
    setMessages([]);
    setFeedback(null);
    setInterviewStarted(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-12 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-emerald-600 font-bold mb-8 hover:underline"
        >
          <ArrowLeft className="w-5 h-5" />
          ফিরে যান
        </button>

        <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden min-h-[600px] flex flex-col">
          {/* Header */}
          <div className="bg-emerald-600 p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl" />
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-emerald-400 rounded-full translate-x-1/3 translate-y-1/3 blur-2xl" />
            </div>
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-xl">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">ইন্টারভিউ প্র্যাকটিস</h1>
                  <p className="text-emerald-50 text-sm">আপনার স্বপ্নের চাকরির জন্য নিজেকে প্রস্তুত করুন</p>
                </div>
              </div>
              {step !== 'setup' && (
                <button 
                  onClick={resetInterview}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
                  title="নতুন করে শুরু করুন"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col relative">
            <AnimatePresence mode="wait">
              {step === 'setup' && (
                <motion.div 
                  key="setup"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-8 space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-emerald-600" />
                        জবের ধরন নির্বাচন করুন
                      </label>
                      <div className="grid grid-cols-1 gap-2">
                        {JOB_TYPES.map((type) => (
                          <button
                            key={type}
                            onClick={() => setJobType(type)}
                            className={cn(
                              "w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all border",
                              jobType === type 
                                ? "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm" 
                                : "bg-white border-gray-100 text-gray-600 hover:bg-gray-50"
                            )}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                      {jobType === 'অন্যান্য (Others)' && (
                        <input 
                          type="text"
                          placeholder="জবের নাম লিখুন..."
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                          value={customJobType}
                          onChange={(e) => setCustomJobType(e.target.value)}
                        />
                      )}
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-4">
                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                          <History className="w-4 h-4 text-emerald-600" />
                          অভিজ্ঞতার লেভেল
                        </label>
                        <div className="flex gap-2">
                          {['Fresher', '1-2 Years', '3-5 Years', '5+ Years'].map((exp) => (
                            <button
                              key={exp}
                              onClick={() => setExperience(exp)}
                              className={cn(
                                "flex-1 px-3 py-2 rounded-xl text-xs font-bold transition-all border",
                                experience === exp 
                                  ? "bg-emerald-600 border-emerald-600 text-white shadow-md" 
                                  : "bg-white border-gray-100 text-gray-500 hover:bg-gray-50"
                              )}
                            >
                              {exp}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
                        <h3 className="font-bold text-emerald-800 mb-2 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          নির্দেশনা:
                        </h3>
                        <ul className="text-sm text-emerald-700 space-y-2 list-disc pl-4">
                          <li>আপনার পছন্দের জবের ধরন নির্বাচন করুন।</li>
                          <li>আপনাকে বাস্তব ইন্টারভিউয়ের মতো প্রশ্ন করা হবে।</li>
                          <li>প্রতিটি প্রশ্নের উত্তর বাংলায় দেওয়ার চেষ্টা করুন।</li>
                          <li>ইন্টারভিউ শেষে আপনি একটি বিস্তারিত ফিডব্যাক পাবেন।</li>
                        </ul>
                      </div>

                      <button 
                        onClick={startInterview}
                        disabled={isLoading || (!jobType) || (jobType === 'অন্যান্য (Others)' && !customJobType)}
                        className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                        ইন্টারভিউ শুরু করুন
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 'interview' && (
                <motion.div 
                  key="interview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col h-[500px]"
                >
                  <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                    {messages.map((msg, idx) => (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        key={idx}
                        ref={idx === messages.length - 1 ? lastMessageRef : null}
                        className={cn(
                          "flex gap-3 max-w-[85%]",
                          msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                        )}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                          msg.role === 'user' ? "bg-emerald-600 text-white" : "bg-white border border-gray-100 text-emerald-600"
                        )}>
                          {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </div>
                        <div className={cn(
                          "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                          msg.role === 'user' 
                            ? "bg-emerald-600 text-white rounded-tr-none" 
                            : "bg-emerald-50 text-emerald-900 rounded-tl-none border border-emerald-100"
                        )}>
                          <div className={cn(
                            "text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70",
                            msg.role === 'user' ? "text-emerald-100" : "text-emerald-600"
                          )}>
                            {msg.role === 'user' ? 'আপনি' : 'ইন্টারভিউয়ার'}
                          </div>
                          <div className="whitespace-pre-wrap">
                            {msg.content}
                          </div>
                          <div className={cn(
                            "text-[10px] mt-2 opacity-50",
                            msg.role === 'user' ? "text-right" : ""
                          )}>
                            {msg.timestamp.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    {isLoading && (
                      <div className="flex gap-3 max-w-[85%]">
                        <div className="w-8 h-8 rounded-xl bg-white border border-gray-100 text-emerald-600 flex items-center justify-center animate-pulse">
                          <Bot className="w-4 h-4" />
                        </div>
                        <div className="bg-emerald-50 p-4 rounded-2xl rounded-tl-none border border-emerald-100">
                          <div className="text-[10px] font-bold uppercase tracking-wider mb-2 text-emerald-600 opacity-70">
                            ইন্টারভিউয়ার লিখছে...
                          </div>
                          <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="p-6 bg-white border-t border-gray-100">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <input 
                        type="text"
                        placeholder="আপনার উত্তর লিখুন..."
                        className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isLoading}
                      />
                      <button 
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 disabled:opacity-50"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </form>
                    <div className="mt-4 flex justify-between items-center">
                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                        {messages.length / 2} / 5 প্রশ্ন সম্পন্ন
                      </p>
                      <button 
                        onClick={getOverallFeedback}
                        disabled={isLoading || messages.length < 4}
                        className="text-xs font-bold text-emerald-600 hover:underline disabled:opacity-50"
                      >
                        ইন্টারভিউ শেষ করুন ও ফিডব্যাক দেখুন
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 'feedback' && (
                <motion.div 
                  key="feedback"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-8 space-y-8"
                >
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto">
                      <Trophy className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">ইন্টারভিউ রিপোর্ট</h2>
                    <p className="text-gray-500">আপনার পারফরম্যান্সের বিস্তারিত বিশ্লেষণ নিচে দেওয়া হলো</p>
                  </div>

                  <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm prose prose-emerald max-w-none">
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                      {feedback}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={resetInterview}
                      className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                    >
                      <RefreshCw className="w-5 h-5" />
                      আবার প্র্যাকটিস করুন
                    </button>
                    <button 
                      onClick={onBack}
                      className="flex-1 py-4 rounded-2xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition-all"
                    >
                      ড্যাশবোর্ডে ফিরে যান
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

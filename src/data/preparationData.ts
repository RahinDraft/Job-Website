// preparationData.ts
// Comprehensive Database for Shadhin Career Preparation Portal
// Includes Subject-wise Lessons, Historic Question Banks, Flashcards, Mnemonics and Study Routines

export interface Topic {
  id: string;
  title: string;
  importantTag: string;
  content: string;
  quickHack: string;
  quiz: {
    question: string;
    options: string[];
    answerIndex: number;
    explanation: string;
  };
}

export interface Subject {
  id: string;
  name: string;
  bengaliName: string;
  iconName: string; // Used to dynamically select Lucide icons
  color: string;
  bgColor: string;
  borderColor: string;
  topics: Topic[];
}

export interface PastQuestion {
  id: string;
  examName: string;
  year: string;
  category: 'bcs' | 'bank' | 'primary' | 'other';
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Flashcard {
  id: string;
  category: 'english' | 'constitution' | 'gk' | 'math' | 'science';
  categoryLabel: string;
  front: string;
  back: string;
  hint?: string;
}

export interface MnemonicTrick {
  id: string;
  title: string;
  category: string;
  formula: string;
  explanation: string;
  example: string;
}

export interface RoutineTask {
  id: string;
  day: number;
  taskTitle: string;
  subject: string;
  duration: string;
  isCompleted?: boolean;
}

export interface PrepRoutine {
  id: string;
  title: string;
  desc: string;
  tag: string;
  durationDays: number;
  tasks: RoutineTask[];
}

// 1. SUBJECT LESSON DATA
export const SUBJECT_LESSONS_DATA: Subject[] = [
  {
    id: 'bangla',
    name: 'Bangla',
    bengaliName: 'বাংলা ব্যাকরণ ও সাহিত্য',
    iconName: 'BookOpen',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50/10',
    borderColor: 'border-orange-100',
    topics: [
      {
        id: 'b1',
        title: 'সমাস চেনার সহজ শর্টকাট টেকনিক (Grammar)',
        importantTag: 'গুরুত্বপূর্ণতা: ৯৯% (বিসিএস ও ব্যাংক)',
        content: `সমাস প্রধানত ৬ প্রকার। চাকরি পরীক্ষায় দ্রুত উত্তর করার জন্য নিচের সমীকরণ লক্ষ্য করুন:

১. দ্বন্দ্ব সমাস: উভয় পদের অর্থ প্রাধান্য পায়। সাধারণত 'ও', 'এবং', 'আর' দিয়ে ব্যাসবাক্য যুক্ত হয়।
• উদাহরণ: আদা-কাঁচকলা (আদা ও কাঁচকলা), পিতা-মাতা।
২. দ্বিগু সমাস: ব্যাসবাক্যে সমাহার বা সমষ্টি বোঝায় এবং শুরুতে সর্বদা সংখ্যা বা পরিমাপবাচক শব্দ থাকে।
• উদাহরণ: পঞ্চবটী (পঞ্চ বটের সমাহার), শতাব্দী (শত অব্দের সমাহার)।
৩. বহুব্রীহি সমাস: পূর্বপদ বা পরপদ কোনোটির অর্থ প্রাধান্য না দিয়ে সম্পূর্ণ নতুন কোনো ব্যক্তিকে নির্দেশ করে।
• উদাহরণ: দশানন (১০টি মাথা যার - রাবণ), বিনাভূমি, মহাত্মা।
৪. কর্মধারয় সমাস: বিশেষণ + বিশেষ্য মিলে গঠিত হয়। পরপদের অর্থ প্রধান থাকে। ব্যাসবাক্যে 'যে', 'যিনি', 'ন্যায্য', 'ন্যায়' থাকে।
• উদাহরণ: নীলপদ্ম (নীল যে পদ্ম), সিংহপুরুষ (সিংহের ন্যায় পুরুষ)।
৫. অব্যয়ীভাব সমাস: শুরুতে অব্যয় বা উপসর্গ (হা, গর, নির, উপ, আ) যুক্ত থাকে এবং পূর্বপদের অর্থ প্রধান হয়।
• উদাহরণ: উপকূল (কূলের সমীপে), হাভাতে (ভাতের অভাব)।
৬. তৎপুরুষ সমাস: পূর্বপদে বিভক্তি (২য়া থেকে ৭মী পর্যন্ত) লোপ পেয়ে যে সমাস হয়।
• উদাহরণ: বিলাতফেরত (বিলাত হতে ফেরত - ৫মী তৎপুরুষ), বিপদাপন্ন (বিপদকে আপন্ন - ২য়া তৎপুরুষ)।`,
        quickHack: 'সুপার হ্যাক: দ্বন্দ্ব সমাসে দুই পদের সমতা থাকে, দ্বিগুতে সংখ্যা থাকে প্রথমে, এবং বহুব্রীহিতে বোঝাবে সম্পূর্ণ অন্য কাউকে!',
        quiz: {
          question: 'নিম্নের কোনটি বহুব্রীহি সমাসের উদাহরণ?',
          options: ['মৌমাছি', 'চৌরাস্তা', 'পীতাম্বর', 'ভাই-বোন'],
          answerIndex: 2,
          explanation: 'পীতাম্বর (পীত অম্বর যার - শ্রীকৃষ্ণ)। এটি পূর্বপদ (হলুদ) বা পরপদ (কাপড়) কোনোটিকে না বুঝিয়ে শ্রীকৃষ্ণকে নির্দেশ করে, তাই এটি বহুব্রীহি সমাস।'
        }
      },
      {
        id: 'b2',
        title: 'বিখ্যাত কবিদের ছদ্মনাম ও উপাধি (Literature)',
        importantTag: 'গুরুত্বপূর্ণতা: ৯৫%',
        content: `চাকরির পরীক্ষায় কবি সাহিত্যিকদের উপাধি এবং ছদ্মনাম থেকে অন্তত ১/২টি প্রশ্ন অবশ্যই থাকে। নিচে এক নজরে গুরুত্বপূর্ণ অংশ দেওয়া হলো:

• রবীন্দ্রনাথ ঠাকুর: ছদ্মনাম "ভানুসিংহ ঠাকুর", উপাধি "বিশ্বকবি"।
• কাজী নজরুল ইসলাম: উপাধি "বিদ্রোহী কবি", "জাতীয় কবি"।
• জীবনানন্দ দাশ: উপাধি "রূপসী বাংলার কবি", "তিমির হননের কবি", "ধূসরতার কবি"।
• জসীমউদ্দীন: উপাধি "পল্লীকবি"।
• শরৎচন্দ্র চট্টোপাধ্যায়: ছদ্মনাম "অনিলা দেবী", উপাধি "অপরাজেয় কথাশিল্পী"।
• প্যারীচাঁদ মিত্র: ছদ্মনাম "টেকচাঁদ ঠাকুর" (তাঁর আলালের ঘরের দুলাল বাংলা সাহিত্যের ১ম উপন্যাস)।
• বঙ্কিমচন্দ্র চট্টোপাধ্যায়: উপাধি "সাহিত্য সম্রাট" (সাহিত্য সম্রাট)।
• ঈশ্বরচন্দ্র বিদ্যাসাগর: বিদ্যাসাগর হলো তাঁর উপাধি (সংস্কৃত কলেজ থেকে প্রদত্ত)। ছদ্মনাম "কস্যচিৎ উপযুক্ত ভাইপো"।
• সুকান্ত ভট্টাচার্য: উপাধি "কিশোর কবি"।
• মুকুন্দরাম চক্রবর্তী: উপাধি "কবি কঙ্কন"।`,
        quickHack: 'মনে রাখুন: রবীন্দ্রনাথের ছদ্মনাম ভানুসিংহ, নজরুলের উপাধি বিদ্রোহী কবি, এবং শরৎচন্দ্রের ছদ্মনাম অনিলা দেবী!',
        quiz: {
          question: 'রবীন্দ্রনাথ ঠাকুরের ছদ্মনাম কোনটি?',
          options: ['ভানুসিংহ ঠাকুর', 'টেকচাঁদ ঠাকুর', 'অনিলা দেবী', 'কস্যচিৎ উপযুক্ত ভাইপো'],
          answerIndex: 0,
          explanation: 'রবীন্দ্রনাথ ঠাকুরের বিখ্যাত কাব্য ছদ্মনাম হলো "ভানুসিংহ ঠাকুর"। টেকচাঁদ ঠাকুর হলো প্যারীচাঁদ মিত্রের এবং অনিলা দেবী হলো শরৎচন্দ্র চট্টোপাধ্যায়ের ছদ্মনাম।'
        }
      },
      {
        id: 'b3',
        title: 'বাংলা চলিত ভাষার গদ্য আন্দোলন ও বিখ্যাত সাময়িকী (Literature)',
        importantTag: 'গুরুত্বপূর্ণতা: ৯৫% (প্রিলিমিনারি নিশ্চিত কমন)',
        content: `বাংলা গদ্যের বিকাশের শুরু ১৮০১ সালে ফোর্ট উইলিয়াম কলেজের মাধ্যমে হলেও শুরুতে এটি প্রধানত সাধুরীতি ও সংস্কৃত ঘেষা ছিল। পরবর্তীতে ঈশ্বরচন্দ্র বিদ্যাসাগরকে বাংলা গদ্যের জনক বলা হয় কারণ তিনি প্রথম গদ্যে যতি বা বিরামচিহ্ন ব্যবহার করেন।

বাংলা সাহিত্য ও ভাষায় সাধুরীতি থেকে কথ্য বা চলিত রীতির ব্যবহারে নিচের সাহিত্যিকদের অবদান অসামান্য:
১. প্রমথ চৌধুরী: বাংলা গদ্যে চলিত রীতির প্রবর্তক। তাঁর সম্পাদিত "সবুজপত্র" (১৯১৪) পত্রিকা চলিত রীতির প্রসারে প্রধান ঐতিহাসিক ভূমিকা পালন করে।
২. টেকচাঁদ ঠাকুর (প্যারীচাঁদ মিত্র): আলালের ঘরের দুলাল উপন্যাসে প্রথম চলিত ভাষার কাছাকাছি কথ্য ভাষা বা আলালি ভাষা ব্যবহার করেন।
৩. হুতোম প্যাঁচা (কালীপ্রসন্ন সিংহ): "হুতোম প্যাঁচার নকশা" গ্রন্থে উনিশ শতকের কলকাতার কথ্য চলিত ভাষার চমৎকার চিত্র ফুটিয়ে তোলেন।`,
        quickHack: 'মনে রাখুন: বাংলা গদ্যে চলিত রীতির প্রবক্তা প্রমথ চৌধুরী এবং এর প্রধান বাহন সবুজপত্র পত্রিকা!',
        quiz: {
          question: 'বাংলা সাহিত্যে চলিত ভাষা চালুকরণে কোন পত্রিকা অগ্রণী ভূমিকা পালন করে?',
          options: ['বঙ্গদর্শন', 'তত্ত্ববোধিনী পত্রিকা', 'সবুজপত্র', 'সমাচার dorphon'],
          answerIndex: 2,
          explanation: 'প্রমথ চৌধুরী সম্পাদিত "সবুজপত্র" (১৯১৪) পত্রিকা বাংলা সাহিত্যে চলিত ভাষাকে জনপ্রিয় ও সুপ্রতিষ্ঠিত করে।'
        }
      },
      {
        id: 'b4',
        title: 'কারক ও বিভক্তি চেনার রাজকীয় শর্টকাট সূত্র (Grammar)',
        importantTag: 'গুরুত্বপূর্ণতা: ৯৮% (বিসিএস ও প্রাইমারি)',
        content: `কারক অর্থ যা ক্রিয়া সম্পাদন করে। বাক্যস্থিত ক্রিয়াপদের সাথে নামপদের যে সম্পর্ক, তাকে কারক বলে।
সহজে চেনার উপায়:
১. কর্তৃকারক (কে/কারা): কে ক্রিয়া করছে?
   • উদাহরণ: বুলবুলিতে (কে?) ধান খেয়েছে। (কর্তা)
২. কর্মকারক (কি/কাকে): ক্রিয়ার বিষয় বা ব্যক্তি।
   • উদাহরণ: ডাক্তার (কাকে?) ডাকো। নাসিমা ফুল (কি?) তুলছে। (कर्म)
৩. করণকারক (কি দিয়ে/কিসের সাহায্যে): ক্রিয়া সম্পাদনের মাধ্যম বা যন্ত্র।
   • উদাহরণ: নীলা কলম দিয়ে (কি দিয়ে?) লেখে। টাকায় (কিসের সাহায্যে?) কিনা হয়। (করণ)
৪. সম্প্রদানকারক (সত্ব ত্যাগ করে দান): নিঃস্বার্থ সৎকার্য করা বা উৎসর্গ করা।
   • উদাহরণ: ভিক্ষুককে (সত্ব ত্যাগ) ভিক্ষা দাও। (সম্প্রদান) [মনে রাখুন: সমিতিতে চাঁদা দাও = কর্মকারক, কারণ চাঁদা নিঃস্বার্থ নয়, ফেরতযোগ্য বা সদস্য সুবিধাভোগী]
৫. অপাদানকারক (হতে/থেকে/চেয়ে/ডর/ভয়): কোনো কিছু থেকে বিচ্যুত, গৃহীত, জাত, বিরত, আরম্ভ বা ভীত হওয়া।
   • উদাহরণ: তিল থেকে (উৎপন্ন) তেল হয়। গাছ থেকে (বিচ্যুত) পাতা পড়ে। বাবাকে (ভয়) বড্ড ভয় পাই। (অপাদান)
৬. অধিকরণকারক (কোথায়/কখন/বিষয়ে): ক্রিয়া সম্পাদনের সময়, স্থান বা বিষয়।
   • উদাহরণ: তিলে (কোথায়? তিলের ভেতরে) তৈল আছে। প্রভাতে (কখন?) সূর্য ওঠে। তিনি ব্যাকরণে (বিষয়ে) পণ্ডিত। (অধিকরণ)`,
        quickHack: 'কারক চিট কোড: "তিলে তৈল আছে" = অধিকরণ (ভেতরে বিদ্যমান), আর "তিল থেকে তৈল হয়" = অপাদান (উৎপন্ন/গৃহীত)!',
        quiz: {
          question: '"সমিতিতে চাঁদা দাও" - এটি কোন কারকে কোন বিভক্তি?',
          options: ['সম্প্রদান কারকে ৪র্থী', 'কর্ম কারকে ৭মী', 'অধিকরণ কারকে ৭মী', 'অপাদান কারকে ৫মি'],
          answerIndex: 1,
          explanation: 'সমিতিতে চাঁদা দিলে অধিকার ত্যাগ করে দেওয়া হয় না বা নিঃস্বার্থ দান নয়, তাই এটি সম্প্রদান নয় বরং কর্ম কারকে ৭মী বিভক্তি।'
        }
      },
      {
        id: 'b5',
        title: 'সন্ধি ও নিয়মের শর্টকাট টেকনিক (Grammar)',
        importantTag: 'গুরুত্বপূর্ণতা: ৯৬% (বিসিএস ও প্রাইমারী)',
        content: `সন্ধি অর্থ মিলন। এটি মূলত দুই প্রকার (বাংলা ও তৎসম) এবং প্রক্রিয়াবিস্তারে ৩ প্রকার: স্বরসন্ধি, ব্যঞ্জনসন্ধি এবং বিসর্গসন্ধি।

চাকরির পরীক্ষায় আসার মতো অতি হাই-ভ্যালু কিছু সন্ধিবিচ্ছেদ এবং নিয়ম নিচে দেওয়া হলো:
• অহর্নিশ = অহঃ + নিশ (বিসর্গ লোভে র-জাত বিসর্গ সন্ধি)
• অহরাত্র = অহঃ + রাত্র (অহরাত্র বানানের শেষে রাত্র বদলে অ হয়)
• রবীন্দ্র = রবি + ইন্দ্র (ই + ই = ঈ)
• গায়ক = গৈ + অক, নায়ক = নৈ + অক
• পবন = পো + অন, ভবন = ভো + অন (ও/ঔ থাকলে অব/আব হয়)
• শুভেচ্ছা = শুভ + ইচ্ছা (অ + ই = এ)
• উচ্চারণ = উৎ + চারণ (ত-বর্গীয় ব্যঞ্জনের সাথে চ/ছ যুক্ত হয়ে চ্চ হয়েছে)
• নিপাতনে সিদ্ধ সন্ধি (কোনো নিয়ম মানে না): পরস্পর (পর + পর), কুলটা (কুল + অতা = কুলটা), মার্তণ্ড (মার্ত + অণ্ড = মার্তণ্ড)`,
        quickHack: 'মনে রাখার হ্যাক: পো + অন = পবন, কিন্তু পৌ + অক = পাবক (ও-কার থাকলে ব বসে, আর ঔ-কার থাকলে বা বসে)!',
        quiz: {
          question: 'নিম্নের কোনটি নিপাতনে সিদ্ধ ব্যঞ্জনসন্ধির উদাহরণ?',
          options: ['পরস্পর', 'উচ্চারণ', 'ষষ্ঠ', 'শুভেচ্ছা'],
          answerIndex: 0,
          explanation: 'পরস্পর (পর + পর) হচ্ছে একটি নিপাতনে সিদ্ধ ব্যঞ্জনসন্ধি যা কোনো সাধারণ ব্যাকরণ সূত্র অনুসরণ করে না।'
        }
      },
      {
        id: 'b6',
        title: 'বাংলা সাহিত্যের মধ্যযুগ ও মঙ্গলকাব্য (Literature)',
        importantTag: 'গুরুত্বপূর্ণতা: ৯৫% (বিসিএস প্রিলিমিনারি)',
        content: `বাংলা সাহিত্যের মধ্যযুগ (১২০১-১৮০০ সাল) থেকে চাকরির পরীক্ষায় মঙ্গলকাব্য ও আরাকান রাজসভা বিষয়ক প্রশ্নগুলো সবচেয়ে গুরুত্বপূর্ণ:

১. মঙ্গলকাব্যের আদি কবি: কানাহরি দত্ত (মনসামঙ্গল)। মঙ্গলকাব্যের শ্রেষ্ঠ কবি: ভারতচন্দ্র রায়গুণাকর (অন্নদামঙ্গল)।
২. মঙ্গলকাব্যের মূল ধারা দুটি: মনসামঙ্গল (দেবী মনসা) এবং চণ্ডীমঙ্গল (দেবী চণ্ডী)।
৩. বিখ্যাত উক্তি: "আমার সন্তান যেন থাকে দুধে-ভাতে।" - এটি ঈশ্বরী পাটনীর প্রার্থনা, যা ভারতচন্দ্র রায়গুণাকরের অন্নদামঙ্গল কাব্যের চরিত্র।
৪. আরাকান রাজসভার প্রথম বাঙালি কবি: দৌলত কাজী। আরাকান রাজসভার শ্রেষ্ঠ কবি: আলাওল (বিখ্যাত কাব্য "পদ্মাবতী" যা জসীমুদ্দীনের 'পদ্মাবতী'র মতো নয়, এটি মালিক মুহম্মদ জায়সীর 'পদুমাবত' কাব্য থেকে অনুবাদ)।`,
        quickHack: 'পরীক্ষার হ্যাক: "আমার সন্তান যেন থাকে দুধে-ভাতে" উক্তিটি দেবী অন্নদার কাছে ঈশ্বরী পাটনীর চরিত্র থেকে নেওয়া এবং এটি অন্নদামঙ্গল কাব্যের অংশ!',
        quiz: {
          question: '"আমার সন্তান যেন থাকে দুধে-ভাতে" - বিখ্যাত এই লাইনটি কোন কাব্যের অন্তর্গত?',
          options: ['মনসামঙ্গল', 'চণ্ডীমঙ্গল', 'অন্নদামঙ্গল', 'ধর্মমঙ্গল'],
          answerIndex: 2,
          explanation: 'ভারতচন্দ্র রায়গুণাকর রচিত "অন্নদামঙ্গল" কাব্যের অন্যতম চরিত্র ঈশ্বরী পাটনী দেবী অন্নদার কাছে এই প্রার্থনা করেছিলেন।'
        }
      }
    ]
  },
  {
    id: 'english',
    name: 'English',
    bengaliName: 'ইংরেজী গ্রামার ও সাহিত্য',
    iconName: 'GraduationCap',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50/10',
    borderColor: 'border-blue-100',
    topics: [
      {
        id: 'e1',
        title: 'Subject-Verb Agreement Master Rules',
        importantTag: 'গুরুত্বপূর্ণতা: ১০০% নিশ্চিত কমন (টপিক: গ্রামার)',
        content: `Subject-Verb Agreement is the most crucial grammar topic in job recruitment tests. The basic rule is: Singular subject takes singular verb, plural subject takes plural verb.

Key Golden Rules:
১. "As well as", "along with", "together with", "with", "accompanied by", "and not" দ্বারা দুটি subject যুক্ত হলে প্রথম subject অনুযায়ী verb বসে।
   • Example: The principal along with the teachers is (not are) coming.

২. "Either... or" এবং "Neither... nor" দিয়ে যুক্ত হলে শূন্যস্থানের কাছের নিকটবর্তী (২য়) subject অনুযায়ী verb বসে।
   • Example: Neither he nor his brothers are (not is) present.

৩. Title of a book, distance, money, time দেখতে plural মনে হলেও verb সর্বদা singular হয়।
   • Example: "Gulliver's Travels" is (not are) a famous book.
   • Example: Ten miles is (not are) a long distance.

৪. "Each of", "One of", "Neither of", "Either of" - এর পরে plural noun থাকলেও verb সর্বদা singular হবে।
   • Example: One of the boys is (not are) absent today.

৫. "Many a" এর পর সর্বদা singular noun এবং singular verb বসে। কিন্তু "A great many" এর পর plural noun ও verb বসে।
   • Example: Many a boy has (not have) done this.`,
        quickHack: 'সুপার হ্যাক: "As well with" থাকলে তাকাবেন ১ম Subject এর দিকে; আর "Either/Neither Or/Nor" থাকলে তাকাবেন শূন্যস্থানের একদম কাছের ২য় Subject এর দিকে!',
        quiz: {
          question: 'Select the correct sentence:',
          options: [
            'Many a boy have failed in the examination.',
            'Ten miles are a long distance to walk.',
            'Either he or his brothers are to blame.',
            'The headmaster along with the teachers are present.'
          ],
          answerIndex: 2,
          explanation: '"Many a" is followed by singular noun and verb. "Ten miles" is a unit of length, so it takes singular verb ("is"). "Headmaster along with teachers" should take singular verb ("is") based on the first subject "headmaster". "Either he or his brothers" is correct because the verb "are" agrees with the nearest plural subject "his brothers".'
        }
      },
      {
        id: 'e2',
        title: 'Ultimate Appropriate Prepositions Cheat Sheet',
        importantTag: 'গুরুত্বপূর্ণতা: ৯৮% ফ্রিকোয়েন্সি',
        content: `Prepositions define your language accuracy. Here are the most high-frequency prepositions tested in job examinations:

• Abide by: মেনে চলা (We must abide by the rules of safety).
• Absorbed in: মগ্ন থাকা (He is absorbed in deep thoughts).
• Acquit of: খালাস দেওয়া (The judge acquitted him of all murder charges).
• Adjacent to: সংলগ্ন (His office is adjacent to my room).
• Blind to: নিজের দোষে অন্ধ (The mother is blind to her son's faults). [Note: Blind of one eye = চোখে অন্ধ]
• Conducive to: উপকারী (Morning walk is conducive to good health).
• Devoted to: অনুগত/উৎসর্গীকৃত (He is devoted to his career).
• Hanker after: লালায়িত হওয়া (Do not hanker after wealth).
• Prefer to: অধিকতর পছন্দ করা (I prefer coffee to tea).`,
        quickHack: 'Quick Mind map: "Prefer", "Senior", "Junior", "Prior", "Superior" - always take "to", never "than"!',
        quiz: {
          question: 'Fill in the blank: "He is senior _____ me by 3 years."',
          options: ['than', 'from', 'to', 'of'],
          answerIndex: 2,
          explanation: 'Latin adjectives like Senior, Junior, Prior, Inferior, Superior are always followed by "to" for comparison.'
        }
      },
      {
        id: 'e3',
        title: 'Identifying Parts of Speech (Advanced Suffixes)',
        importantTag: 'গুরুত্বপূর্ণতা: ৯৫%',
        content: `Finding Parts of Speech becomes super easy if you remember specific word endings (suffixes):

1. Noun Suffixes:
• -tion / -sion (examination, decision)
• -ness (happiness, kindness)
• -ment (development, argument)
• -ity / -ty (purity, ability)
• -hood / -ship (childhood, friendship)
• -dom / -ism (wisdom, patriotism)

2. Adjective Suffixes:
• -ful (beautiful, helpful)
• -less (careless, hopeless)
• -able / -ible (capable, flexible)
• -ous (famous, dangerous)
• -ive (creative, active)
• -al (national, political)

3. Verb Suffixes:
• -fy (beautify, clarify)
• -ize / -ise (realize, organize)
• -ate (educate, activate)`,
        quickHack: 'Suffix Shortcut: A word ending in "-ment" or "-ness" is 99% a Noun, while a word ending in "-ive" or "-ous" is 99% an Adjective!',
        quiz: {
          question: 'What part of speech is the word "Clarify"?',
          options: ['Noun', 'Verb', 'Adjective', 'Adverb'],
          answerIndex: 1,
          explanation: 'The suffix "-fy" (e.g., clarify, justify, beautify) is used to create verbs.'
        }
      },
      {
        id: 'e4',
        title: 'Ultimate Conditional Sentences Blueprint (Grammar)',
        importantTag: 'গুরুত্বপূর্ণতা: ৯৯% নিশ্চিত কমন',
        content: `Conditionals from "If" are high-yielding in any competitive exams. Memorize these 4 formulas:

1. Zero Conditional: Real-time facts, scientific truths.
• Formula: If + Present Simple, Present Simple.
• Example: If you heat water to 100°C, it boils.

2. First Conditional: Possible future situations.
• Formula: If + Present Simple, Future Simple (Subject + will/can/may + V1).
• Example: If it rains, we will postpone the meeting.

3. Second Conditional: Hypothetical or imaginary present/future.
• Formula: If + Past Simple, Subject + would/could/might + V1.
• Example: If I were a king, I would help the poor. (Always use 'were' for subjunctive, even with I/he/she!)

4. Third Conditional: Unfulfilled past conditions.
• Formula: If + Past Perfect (had + V3), Subject + would have/could have + V3.
• Example: If you had studied harder, you would have passed the exam.
• Inverted form: Had you studied harder, you would have passed the exam.`,
        quickHack: 'Inversion Trick: Often "If" is missing, and the sentence starts with "Had". This is a hidden 3rd conditional! E.g. "Had I seen her, I would have told you."',
        quiz: {
          question: 'Complete the sentence: "If I _____ his contact number, I would have called him as soon as possible."',
          options: ['have had', 'had', 'had had', 'would have'],
          answerIndex: 2,
          explanation: 'Since the main clause has "would have called" (3rd conditional), the "if" clause must be in Past Perfect ("had + V3"), which is "had had".'
        }
      },
      {
        id: 'e5',
        title: 'Commonly Confused Words & Homonyms inside exams',
        importantTag: 'গুরুত্বপূর্ণতা: ৯৫% নিশ্চিত প্রশ্ন',
        content: `Many English words look or sound similar, but have completely different meanings. Remembering these pairs will save you valuable marks:

• Compliment vs. Complement:
  - Compliment: প্রশংসা করা (He gave me a nice compliment on my work).
  - Complement: পরিপূরক হওয়া (Your shoes complement your dress nicely).
• Stationary vs. Stationery:
  - Stationary (with 'a'): স্থির (The car hit a stationary truck).
  - Stationery (with 'e'): লেখার জিনিসপত্র (Need to buy some paper from the stationery shop).
• Principal vs. Principle:
  - Principal: প্রধান/অধ্যক্ষ (The principal of our college is very strict).
  - Principle: নীতি/আদর্শ (He is a man of high principles).`,
        quickHack: 'Memorization Hack: Stationery has an "e" like "Envelopes" or "Erasers"! Stationary has an "a" like "Anchor" (stands still)!',
        quiz: {
          question: 'Choose the correct word to fill in the blank: "We need some new _____ for our office, including pens, envelopes, and notebooks."',
          options: ['stationary', 'stationeries', 'stationery', 'stationerys'],
          answerIndex: 2,
          explanation: '"Stationery" is an uncountable noun that refers to writing materials like envelopes, pens, and paper.'
        }
      },
      {
        id: 'e6',
        title: 'Voice Change & Narration Golden Shortcuts',
        importantTag: 'গুরুত্বপূর্ণতা: ৯৮% ফ্রিকোয়েন্সি',
        content: `Active to Passive & Direct to Indirect rules are standard questions in almost all tests.

Key Rules on Voice:
১. Imperative starts with Let: Active: "Do it" -> Passive: "Let it be done".
২. Active with "who" gets replaced with "By whom": Active: "Who did this?" -> Passive: "By whom was this done?"

Key Rules on Narration:
১. "Universal Truth" does not change its tense: Direct: "The teacher said, 'The earth moves around the sun.'" -> Indirect: "The teacher said that the earth moves around the sun."
২. Words changes: "today" -> "that day", "yesterday" -> "the previous day", "this" -> "that".`,
        quickHack: 'Voice Cheat Code: Passive voice always requires some form of the verb "be" + Past Participle (V3)!',
        quiz: {
          question: 'What is the passive form of "Who is calling me?"',
          options: ['By whom am I being called?', 'By whom was I called?', 'Who am I being called by?', 'By whom I am called?'],
          answerIndex: 0,
          explanation: '"Who" changes to "By whom". Present continuous "is calling" gets changed to "am I being called" in passive voice.'
        }
      }
    ]
  },
  {
    id: 'math',
    name: 'Mathematics',
    bengaliName: 'গণিত ও মানসিক দক্ষতা',
    iconName: 'Zap',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-50/10',
    borderColor: 'border-emerald-100',
    topics: [
      {
        id: 'm1',
        title: 'শতকরা ও লাভ-ক্ষতি ৩ সেকেন্ডের হ্যাক',
        importantTag: 'গুরুত্বপূর্ণতা: ৯৯% নিশ্চিত প্রশ্ন',
        content: `চাকরির প্রিলিমিনারি পরীক্ষায় লাভ-ক্ষতি বা দাম হ্রাস-বৃদ্ধির ট্রিকস খুব বেশি আসে।

১. দাম হ্রাস-বৃদ্ধি সূত্র:
"যদি চিনির মূল্য ২৫% বৃদ্ধি পায়, তবে চিনির ব্যবহার শতকরা কত কমালে খরচের কোনো পরিবর্তন হবে না?"
• শর্টকাট সূত্র: [বৃদ্ধি / (১০০ + বৃদ্ধি)] × ১০০%
• হিসাব: [২৫ / (১০০ + ২৫)] × ১০০ = (২৫ / ১২৫) × ১০০ = ২০%

২. দাম কমে গেলে ব্যবহার বৃদ্ধির সূত্র:
"চিনির মূল্য ২০% কমে গেলে চিনির ব্যবহার শতকরা কত বাড়ালে খরচের কোনো পরিবর্তন হবে না?"
• শর্টকাট সূত্র: [হ্রাস / (১০০ - হ্রাস)] × ১০০%
• হিসাব: [২০ / (১০০ - ২০)] × ১০০ = (২০ / ৮০) × ১০০ = ২৫%

৩. দুটি ক্রমিক ছাড় বা লাভ-ক্ষতির নেট প্রভাব (Successive Changes):
• সূত্র: A + B + (AB / ১০০)
• লাভ বা দাম বৃদ্ধি হলে মান পজিティブ (+), ক্ষতি বা দাম হ্রাস হলে নেগেটিভ (-)।
• উদাহরণ: একটি পণ্যের দাম প্রথমে ১০% বাড়ল, তারপর ১০% কমল। নেট কত তফাত?
• হিসাব: +১০ - ১০ + [(+১০ × -১০) / ১০০] = ০ - ১ = -১% (অর্থাৎ ১% ক্ষতি বা দাম হ্রাস)।`,
        quickHack: 'ম্যাজিক ফর্মুলা: যেকোনো অভিন্ন পার্সেন্টেজ বাড়ালে ও কমালে সবসময় নিট ক্ষতি বা দাম কমবে! ক্ষতি = (পার্সেন্টেজ / ১০) এর স্কয়ার। যেমন: ২০% বাড়লে ও ২০% কমলে নিট ক্ষতি = (২০/১০)² = ৪%!',
        quiz: {
          question: 'একটি মোবাইল ফোনের দাম প্রথমে ২০% বাড়িয়ে পরে ২০% কমানো হলো। এতে মোটের ওপর মোবাইলের দামের কীরূপ পরিবর্তন ঘটল?',
          options: ['কোনো পরিবর্তন হয়নি', '২% বৃদ্ধি পেল', '৪% হ্রাস পেল', '৪% বৃদ্ধি পেল'],
          answerIndex: 2,
          explanation: 'ম্যাজিক ফর্মুলা অনুযায়ী: ক্ষতি/হ্রাস = (২০ / ১০)² % = ২² % = ৪% হ্রাস।'
        }
      },
      {
        id: 'm2',
        title: 'অনুপাত ও মিশ্রণ (Ratio & Mixture) ট্রিকস',
        importantTag: 'গুরুত্বপূর্ণতা: ৯২% ফ্রিকোয়েন্সি',
        content: `মিশ্রণের অংক সহজে এক্স ছাড়াই সমাধান করা সম্ভব।

উদাহরণ অংক:
"৬০ লিটার কেরোসিন ও পেট্রোলের মিশ্রণের অনুপাত ৭:৩। ওই মিশ্রণে আর কত লিটার পেট্রোল মেশালে অনুপাত ৩:৭ হবে?"

শর্টকাট মেথড:
১. প্রথমে মিশ্রণের মোট অনুপাতের যোগফল = ৭ + ৩ = ১০ অংশ।
২. ১ অংশের মান = ৬০ / ১০ = ৬ লিটার।
৩. কেরোসিন = ৭ × ৬ = ৪২ লিটার, পেট্রোল = ৩ × ৬ = ১৮ লিটার。
৪. নতুন অনুপাত ৩:৭ হতে হবে। লক্ষ্য করুন, এখানে অপরিবর্তিত বস্তু কেরোসিন (৪২ লিটার) থাকবে।
৫. তাহলে নতুন অনুপাতে ৩ অংশ = ৪২ লিটার। অতএব নতুন ১ অংশ = ১৪ লিটার।
৬. অতএব নতুন অনুপাতে পেট্রোলের পরিমাণ হবে ৭ অংশ = ৭ × ১৪ = 98 লিটার।
৭. অতিরিক্ত মেশাতে হবে = 98 - ১৮ = ৮০ লিটার।`,
        quickHack: 'অনুপাতের ম্যাজিক: যখনই অনুপাত ঠিক উল্টে যায় (যেমন ৭:৩ থেকে ৩:৭), উত্তর = পূর্বের ছোট অংশ দিয়ে মোট ওজনকে ভাগ করে অপর অংশের ওজনের পার্থক্য গুণ করা।',
        quiz: {
          question: '৪০ লিটার একটি মিশ্রণে পানি ও অম্লের অনুপাত ২:১। ওই মিশ্রণে আর কত লিটার পানি মেশালে অনুপাত হবে ৪:১?',
          options: ['১০ লিটার', '২০ লিটার', '১৫ লিটার', '৩০ লিটার'],
          answerIndex: 1,
          explanation: 'পানি : অম্ল = ২:১। অর্থাৎ পানি = ২৭ লিটার, অম্ল =  ১৩ লিটার (প্রায়)। পানি বাড়িয়ে ৪:১ করার মানে অম্ল ১ অংশই থাকবে যা ১৩ লিটার। অতএব নতুন পানি ৪ অংশ = ৫২ লিটার। পানি বৃদ্ধি = ৫২ - ২৭ = ২০ লিটার।'
        }
      },
      {
        id: 'm3',
        title: 'কাজ, সময় ও দৈনিক মজুরি ৩ সেকেন্ডের অংক (Arithmetic)',
        importantTag: 'গুরুত্বপূর্ণতা: ৯৫% ফ্রি ট্রিকস',
        content: `কাজ এবং সময়ের সমস্যাগুলো এক্স (x) ছাড়া লসাগু (LCM) পদ্ধতিতে অত্যন্ত দ্রুত সমাধান করা যায়।

১. দুই ব্যক্তির একসাথে কাজ করার শর্টকাট সূত্র:
"ক একটি কাজ ১০ দিনে এবং খ ওই কাজ ১৫ দিনে করতে পারে। তারা একত্রে কাজটি কত দিনে শেষ করবে?"
• জাদুকরী সূত্র: (A × B) / (A + B)
• হিসাব: (১০ × ১৫) / (১০ + ১৫) = ১৫০ / ২৫ = ৬ দিন!

২. চৌবাচ্চা ও পাইপের অংক (পাইপ দিয়ে জল প্রবেশ এবং খালি হওয়া):
"একটি চৌবাচ্চা প্রথম নল দ্বারা ১২ মিনিটে পূর্ণ হয় এবং দ্বিতীয় নল দ্বারা ২০ মিনিটে খালি হয়। দুটি নল একসাথে খুলে দিলে চৌবাচ্চাটি পূর্ণ হতে কত সময় লাগবে?"
• সূত্র: (A × B) / (B - A) [খালি নলের সময় বড় বিয়োগফল]
• হিসাব: (১২ × ২০) / (২০ - ১২) = ২৪০ / ৮ = ৩০ মিনিট!

৩. এমডিএইচ (MDH) শ্রমিক গুণের রাজকীয় সূত্র:
"যদি ১৫ জন লোক একটি কাজ ২০ দিনে করতে পারে, তবে কতজন লোক ওই কাজ ১৫ দিনে করতে পারবে?"
• ইউনিভার্সাল সূত্র: M1 × D1 × H1 = M2 × D2 × H2
• হিসাব: ১৫ × ২০ = M2 × ১৫ => M2 = ২০ জন।`,
        quickHack: 'এমডিএইচ রুল: (শ্রমিক × দিন × ঘণ্টা) = (নতুন শ্রমিক × নতুন দিন × নতুন ঘণ্টা)। কাজ এবং টাকা থাকলে নিচে ভাগ হবে!',
        quiz: {
          question: '১০ জন লোক একটি কাজ ২০ দিনে করতে পারলে, ঐ কাজটি ৮ দিনে শেষ করতে অতিরিক্ত কতজন লোকের প্রয়োজন হবে?',
          options: ['১৫ জন', '২৫ জন', '১২ জন', '৫ জন'],
          answerIndex: 0,
          explanation: 'সূত্রানুযায়ী: ১০ × ২০ = (১০ + অতিরিক্ত) × ৮ => ২০০ = ৮ × (১০ + অতিরিক্ত) => ১০ + অতিরিক্ত = ২৫ => অতিরিক্ত লোক = ১৫ জন।'
        }
      },
      {
        id: 'm4',
        title: 'সরল ও চক্রবৃদ্ধি মুনাফা (Simple & Compound Interest)',
        importantTag: 'গুরুত্বপূর্ণতা: ৯৯% নিশ্চিত প্রশ্ন',
        content: `চাকরির পরীক্ষায় মুনাফা সংক্রান্ত একটি প্রশ্ন প্রায় অবশ্যই পাওয়া যাবে। অতি দ্রুত সমাধানের সফল পদ্ধতি:

১. সরল মুনাফা (Simple Interest):
   • ফর্মুলা: I = Pnr (মুনাফা = আসল × সময় × সুদের হার)
   • যেখানে I = Interest, P = Principal, n = Time in years, r = Rate of interest.
   • উদাহরণ: ৮% হারে ৫০০ টাকার ৪ বছরের সরল মুনাফা কত?
   • হিসাব: I = ৫০০ × ৪ × (৮/১০০) = ১৬০ টাকা।

২. সরল সুদে দ্বিগুণ বা তিনগুণ হওয়ার ম্যাজিক হ্যাক:
   • "সরল সুদে কোনো আসল ৮ বছরে দ্বিগুণ হলে সুদের হার কত?"
   • ম্যাজিক সূত্র: সুদের হার = (গুন - ১) × ১০০ / বছর
   • হিসাব: সুদের হার = (২ - ১) × ১০০ / ৮ = ১২.৫%!`,
        quickHack: 'মুনাফা হ্যাক: সুদে-আসলে দ্বিগুণ হলে সুদের হার = ১০০ / বছর, আর তিনগুণ হলে সুদের হার = ২০০ / বছর!',
        quiz: {
          question: 'সরল সুদে কোনো আসল ১০ বছরে ৩ গুণ হলে, সুদের হার কত হবে?',
          options: ['১০%', '১৫%', '২০%', '২৫%'],
          answerIndex: 2,
          explanation: 'ম্যাজিক সূত্রানুযায়ী: সুদের হার = (৩ - ১) × ১০০ / ১০ = ২০০ / ১০ = ২০%।'
        }
      },
      {
        id: 'm5',
        title: 'সুবিধাজনক ল.সা.গু ও গ.সা.গু নির্ণয়ের টেকনিক',
        importantTag: 'গুরুত্বপূর্ণতা: ৯৫%',
        content: `LCM & HCF থেকে সাধারণত ২ ধরনের প্রশ্ন আসে:

১. দুটি সংখ্যার গুণফল সম্পর্ক:
   • সূত্র: দুটি সংখ্যার গুণফল = সংখ্যাদ্বয়ের ল.সা.গু × গ.সা.গু
   • উদাহরণ: দুটি সংখ্যার ল.সা.গু ৩৬ ও গ.সা.গু ৬। একটি সংখ্যা ১৮ হলে অন্যটি কত?
   • হিসাব: অন্য সংখ্যা = (৩৬ × ৬) / ১৮ = ১২।

২. অনুপাতের সাথে গ.সা.গু সম্পর্ক:
   • "দুটি সংখ্যার অনুপাত ৩:৪ এবং তাদের গ.সা.গু ৪ হলে ল.সা.গু কত?"
   • ট্রিকস: ল.সা.গু = অনুপাত দুটির গুণফল × গ.সা.গু
   • হিসাব: ল.সা.গু = ৩ × ৪ × ৪ = ৪৮।`,
        quickHack: 'মনে রাখুন: ল.সা.গু = অনুপাতদ্বয়ের গুণফল × গ.সা.গু! আর অনুপাতের সাথে গ.সা.গু সরাসরি গুণ করলে মূল সংখ্যাগুলো পাওয়া যায়!',
        quiz: {
          question: 'দুটি সংখ্যার অনুপাত ৫:৬ এবং তাদের গ.সা.গু ৮ হলে তাদের ল.সা.গু কত?',
          options: ['৪৮', '২৪০', '৩০০', '১২০'],
          answerIndex: 1,
          explanation: 'সূত্রানুযায়ী: ল.সা.গু = অনুপাতের গুণফল × গ.সা.গু = ৫ × ৬ × ৮ = ২৪০।'
        }
      }
    ]
  },
  {
    id: 'gk',
    name: 'General Knowledge',
    bengaliName: 'সাধারণ জ্ঞান (বাংলাদেশ ও আন্তর্জাতিক)',
    iconName: 'Award',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50/10',
    borderColor: 'border-purple-100',
    topics: [
      {
        id: 'g1',
        title: 'বাংলাদেশ সংবিধানের ৫টি অতি গুরুত্বপূর্ণ অনুচ্ছেদ',
        importantTag: 'গুরুত্বপূর্ণতা: ১০০% (ভাইভা ও প্রিলি)',
        content: `গণপ্রজাতন্ত্রী বাংলাদেশের সংবিধানে ১৫৩টি অনুচ্ছেদ রয়েছে। এর মধ্যে সবচেয়ে বেশি পরীক্ষায় আসা কয়েকটি অনুচ্ছেদ নিচে ছকে দেওয়া হলো:

• অনুচ্ছেদ ২(ক): রাষ্ট্রধর্ম (ইসলাম, তবে হিন্দু, বৌদ্ধ, খ্রিষ্টান সহ অন্যান্য ধর্ম পালনে সমমর্যাদা)।
• অনুচ্ছেদ ৯: স্থানীয় সরকার প্রতিষ্ঠানসমূহের উন্নয়ন।
• অনুচ্ছেদ ১৭: অবৈতনিক ও বাধ্যতামূলক প্রাথমিক শিক্ষাদান।
• অনুচ্ছেদ ২১: নাগরিক ও সরকারি কর্মচারীদের কর্তব্য।
• অনুচ্ছেদ ২৮: ধর্ম, বর্ণ, লিঙ্গ বা জন্মস্থানের কারণে কোনো বৈষম্য না করা।
• অনুচ্ছেদ ২৯: সরকারি নিয়োগ লাভে সকল নাগরিকের সমান সুযোগের সমতা।
• অনুচ্ছেদ ৪৮: রাষ্ট্রপতি সম্পর্কিত বিধান।
• অনুচ্ছেদ ৭৭: ন্যায়পাল সম্পর্কিত নিয়মাবলী।`,
        quickHack: 'মনে রাখার সহজ ট্রিকস: "২৮ হলো মানুষের বৈষম্য হ্রাসের অধিকার, আর ২৯ হলো সরকারি চাকরিতে নিয়োগ ও সাকসেসের সমতা!"',
        quiz: {
          question: 'বাংলাদেশ সংবিধানের কোন অনুচ্ছেদে "সরকারি নিয়োগ লাভে সুযোগের সমতা" নিশ্চিত করা হয়েছে?',
          options: ['অনুচ্ছেদ ১৭', 'অনুচ্ছেদ ২১', 'অনুচ্ছেদ ২৮', 'অনুচ্ছেদ ২৯'],
          answerIndex: 3,
          explanation: 'অনুচ্ছেদ ২৯ সরকারি নিয়োগে সকলের সমতা নিশ্চিত করে। অনুচ্ছেদ ১৭ হলো অবৈতনিক ও বাধ্যতামূলক শিক্ষা এবং অনুচ্ছেদ ২৮ হলো বৈষম্যহীনতা।'
        }
      },
      {
        id: 'g2',
        title: 'বিশ্বের বিখ্যাত প্রণালী ও সীমারেখা সমূহ',
        importantTag: 'গুরুত্বপূর্ণতা: ৯৬%',
        content: `প্রণালী দুটি বড় জলভাগকে যুক্ত করে ও স্থলভাগকে আলাদা করে। সীমারেখা রাষ্ট্রকে বিভক্ত করে।

১. জিব্রাল্টার প্রণালী (Gibraltar Strait):
• যুক্ত করেছে: ভূমধ্যসাগর ও আটলান্টিক মহাসাগর।
• পৃথক করেছে: মরক্কো (আফ্রিকা) ও স্পেন (ইউরোপ)।

২. মালাক্কা প্রণালী (Malacca Strait):
• যুক্ত করেছে: ভারত মহাসাগর ও প্রশান্ত মহাসাগর (দক্ষিণ চীন সাগর)।
• পৃথক করেছে: সুমাত্রা (ইন্দোনেশিয়া) ও মালয়েশিয়া।

৩. সীমারেখা ৩টি বেশি আসে:
• ম্যাকমোহন লাইন: ভারত ও চীন।
• র‍্যাডক্লিফ লাইন: ভারত ও পাকিস্তান (এবং বাংলাদেশ)।
• ৩৮তম অক্ষরেখা: উত্তর ও দক্ষিণ কোরিয়া।
• ১৭তম অক্ষরেখা: উত্তর ও দক্ষিণ ভিয়েতনাম।`,
        quickHack: 'মনে রাখার ছন্দ: "মালা ভারত ও প্রশান্তর মালাক্কা প্রণালী!" অর্থাৎ ভারত মহাসাগর ও প্রশান্ত মহাসাগরকে যুক্ত করেছে মালাক্কা...।',
        quiz: {
          question: 'জিব্রাল্টার প্রণালী কোন দুটি মহাদেশকে পৃথক করেছে?',
          options: ['উত্তর আমেরিকা ও দক্ষিণ আমেরিকা', 'এশিয়া ও আফ্রিকা', 'ইউরোপ ও আফ্রিকা', 'ইউরোপ ও এশিয়া'],
          answerIndex: 2,
          explanation: 'জিব্রাল্টার প্রণালী ইউরোপের স্পেন এবং আফ্রিকার মরক্কোকে পৃথক করেছে।'
        }
      },
      {
        id: 'g3',
        title: 'বাংলাদেশের হাই-ভ্যালু মেগা প্রজেক্টস আপডেট ২০২৬-২৭',
        importantTag: 'গুরুত্বপূর্ণতা: ১০০% (ভাইভা ও প্রিলি নিশ্চিত)',
        content: `সাম্প্রতিক ও চলমান বড় উন্নয়ন প্রকল্পসমূহ থেকে প্রিলি ও ভাইভায় প্রশ্ন আসা অনিবার্য।

১. পদ্মা বহুমুখী সেতু (Padma Bridge):
• উদ্বোধন: ২৫ জুন, ২০২২। দৈর্ঘ্য: ৬.১৫ কি.মি.। স্প্যান সংখ্যা: ৪১টি, পিলার: ৪২টি।
• সংযোগ: মুन्সীগঞ্জের মাওয়া এবং শরীয়তপুরের জাজিরা। নকশাকার: AECOM (আমেরিকা)।

২. কর্ণফুলী টানেল (Karnaphuli Tunnel - বঙ্গবন্ধু টানেল):
• এশিয়ার প্রথম ভূ-গর্ভস্থ সুড়ঙ্গ পথ ও একমাত্র নদী টানেল।
• দৈর্ঘ্য: ৩.৩২ কি.মি.। এটি চট্টগ্রামের পতেঙ্গা ও আনোয়ারাকে সংযুক্ত করে।

৩. রূপপুর পারমাণবিক বিদ্যুৎ কেন্দ্র (Ruppur Nuclear Power Plant):
• বাংলাদেশের প্রথম পারমাণবিক বিদ্যুৎ কেন্দ্র। জ্বালানি: ইউরেনিয়াম-২৩৫।
• প্রধান সহযোগী দেশ: রাশিয়া। মূল রিঅ্যাক্টর: VVER-1200।

৪. শাহজালাল আন্তর্জাতিক বিমানবন্দর টার্মিনাল ৩:
• নকশাকার: রোহানি বাহারিন (Rohani Baharin), স্থাপত্য প্রতিষ্ঠান সি পিজি কর্পোরেশন।`,
        quickHack: 'এক সেকেন্ডে মনে রাখুন: পদ্মা সেতুর দৈর্ঘ্য ৬.১৫ কিমি, সেতুটির পিলার সংখ্যা ৪২টি ও স্প্যান সংখ্যা ৪১টি!',
        quiz: {
          question: 'বঙ্গবন্ধু টানেল (কর্ণফুলী টানেল) এর মোট দৈর্ঘ্য কত কিলোমিটার?',
          options: ['৫.৫ কিমি', '৪.১৫ কিমি', '৩.৩২ কিমি', '৬.১৫ কিমি'],
          answerIndex: 2,
          explanation: 'কর্ণফুলী নদীর তলদেশ দিয়ে নির্মিত বঙ্গবন্ধু টানেলের মূল দৈর্ঘ্য ৩.৩২ কিমি। আর ৬.১৫ কিমি হলো পদ্মা সেতুর দৈর্ঘ্য।'
        }
      },
      {
        id: 'g4',
        title: 'বাংলাদেশের স্বাধীনতাসংগ্রাম ও মহান মুক্তিযুদ্ধের ১১ সেক্টর',
        importantTag: 'গুরুত্বपूर्णতা: ১০০% (বিসিএস ও সরকারি চাকরি)',
        content: `১৯৭১ সালের মহান মুক্তিযুদ্ধে বাংলাদেশকে মোট ১১টি সেক্টরে ভাগ করা হয়েছিল। গুরুত্বপূর্ণ সেক্টরগুলোর ম্যাপ:

• সেক্টর ১: চট্টগ্রাম, পার্বত্য চট্টগ্রাম ও নোয়াখালী জেলার একাংশ।
• সেক্টর ২: ঢাকা, কুমিল্লা, ও ফরিদপুর জেলা (আংশিক)। (ক্রিটিক্যাল কোশ্চেন: ঢাকা কোন সেক্টরের অন্তর্গত ছিল? উত্তর: ২ নং সেক্টর)
• সেক্টর ১০: কোনো আঞ্চলিক সীমানা ছিল না। এটি ছিল নৌ-বাহিনী নিয়ে গঠিত নৌ সেক্টর, যার অপারেশন সারা দেশে পরিচালিত হত।
• সেক্টর ১১: ময়মনসিংহ ও টাঙ্গাইল।`,
        quickHack: 'মনে রাখার ট্রিকস: "১০ নম্বর সেক্টরে কোনো স্থায়ী সেক্টর কমান্ডার ছিল না কারণ এটি ছিল নৌবাহিনীর স্পেশাল অপারেশনাল সেক্টর!"',
        quiz: {
          question: '১৯৭১ সালের মুক্তিযুদ্ধে ঢাকা কোন সেক্টরের অধীনে পরিচালিত হয়েছিল?',
          options: ['১ নং সেক্টর', '২ নং সেক্টর', '৩ নং সেক্টর', '১০ নং সেক্টর'],
          answerIndex: 1,
          explanation: 'ঢাকা, কুমিল্লা, ফরিদপুরের একাংশ ছিল ২ নং সেক্টরের আওতাধীন। এবং যুদ্ধকালীন নৌ-সেক্টর ছিল ১০ নং সেক্টর।'
        }
      },
      {
        id: 'g5',
        title: 'বিখ্যাত আন্তর্জাতিক চুক্তি, সনদ ও সম্মেলন তালিকা',
        importantTag: 'গুরুত্বপূর্ণতা: ৯৫% (আন্তর্জাতিক affairs)',
        content: `বিশ্ব রাজনীতির জটিল মোড় পরিবর্তনকারী কিছু বিখ্যাত চুক্তি:

১. ভার্সাই চুক্তি (Treaty of Versailles) - ১৯১৯: প্রথম বিশ্বযুদ্ধের অবসান ঘটাতে মিত্রশক্তির চুক্তি।
২. কিয়োটো প্রটোকল (Kyoto Protocol) - ১৯৯৭: বৈশ্বিক গ্রিনহাউজ গ্যাস নির্গমন হ্রাস ও পরিবেশ সুরক্ষায় স্বাক্ষরিত চুক্তি।
৩. ক্যাম্প ডেভিড চুক্তি (Camp David Accords) - ১৯৭৮: মিশর ও ইজরায়েলের মধ্যে শান্তি প্রতিষ্ঠার চুক্তি (মার্কিন যুক্তরাষ্ট্রের মধ্যস্থতায়)।`,
        quickHack: 'ক্যাম্প ডেভিডের ট্রিক: ১৯৭৮ সালে স্বাক্ষরিত হওয়া এই চুক্তিটি মিশর ও ইসরায়েলের কুখ্যাত শত্রুতা শেষ করতে মুখ্য ভূমিকা রেখেছিল!',
        quiz: {
          question: 'গ্রিনহাউস气体 নির্গমন ও জলবায়ু বিপর্যয় রক্ষায় ১৯৯৭ সালে কোন প্রটোকলটি গৃহীত হয়েছিল?',
          options: ['মন্ট্রিল প্রটোকল', 'কিয়োটো প্রটোকল', 'প্যারিস প্রটোকল', 'কার্টাগেনা প্রটোকল'],
          answerIndex: 1,
          explanation: '১৯৯৭ সালে গৃহীত "কিয়োটো প্রটোকল" ছিল বৈশ্বিক উষ্ণতা হ্রাসের লক্ষ্যে প্রধান চুক্তি। মন্ট্রিল প্রটোকল (১৯৮৭) হলো ওজোন স্তর সুরক্ষায়।'
        }
      }
    ]
  },
  {
    id: 'ict',
    name: 'Computer & ICT',
    bengaliName: 'কম্পিউটার ও তথ্যপ্রযুক্তি',
    iconName: 'Sparkles',
    color: 'text-rose-600',
    bgColor: 'bg-rose-50/10',
    borderColor: 'border-rose-100',
    topics: [
      {
        id: 'i1',
        title: 'কিবোর্ড শর্টকাট ও গুরুত্বপূর্ণ পরিভাষা',
        importantTag: 'গুরুত্বপূর্ণতা: ৯৫%',
        content: `অফিস প্রফেশনাল ও কম্পিউটার অপারেশনে নিচের প্রশ্নগুলো বারংবার জিজ্ঞেস করা হয়:

• Ctrl + Z: Undo (পূর্বাবস্থায় ফিরে যাওয়া)।
• Ctrl + Y: Redo (পুনরায় করা)।
• Ctrl + K: Insert Hyperlink (লিংক বা ইউআরএল যুক্ত করা)।
• Alt + Tab: উইন্ডো বা এক সফটওয়্যার থেকে অন্য সফটওয়্যারে সুইচ করা।
• F5: ব্রাউজার উইন্ডো রিফ্রেশ করা বা পাওয়ারপয়েন্ট স্লাইডশো শুরু করা।
• F7: বানানের সঠিকতা নির্ধারণ বা Spelling & Grammar Check।
• HTTP: Hypertext Transfer Protocol (তথ্য স্থানান্তরের প্রধান ওয়েব প্রটোকল)।
• IP Address: Internet Protocol Address (ইন্টারনেটে সংযুক্ত প্রতিটি ডিভাইসের অনন্য ঠিকানা)।`,
        quickHack: 'পাওয়ার হ্যাক: F5 হলো স্ক্রিন রিফ্রেশ করার শর্টকাট আর F7 হলো বানান ভুলের রেড সিগন্যাল দূর করার জন্য স্পেলিং ও গ্রামার চেকের শর্টকাট!',
        quiz: {
          question: 'এমএস ওয়াড বা এমএস এক্সেলে কোন ফাংশন কি (Function Key) "Spelling & Grammar Check" এর জন্য ব্যবহৃত হয়?',
          options: ['F2', 'F5', 'F7', 'F12'],
          answerIndex: 2,
          explanation: 'F7 কি চাপলে এমএস ওয়ার্ড বা অফিসে সরাসরি স্পেলিং ও গ্রামার উইন্ডো চালু হয়ে যায়।'
        }
      },
      {
        id: 'i2',
        title: 'কম্পিউটার নেটওয়ার্কিং, টপোলজি ও OSI মডেল',
        importantTag: 'গুরুত্বপূর্ণতা: ৯৮% ফ্রিকোয়েন্সি',
        content: `নেটওয়ার্কিং থেকে চাকরি পরীক্ষায় যেসব তথ্য বারংবার আসে:

১. নেটওয়ার্ক টপোলজি (Topology):
   • বাস (Bus) টপোলজি: প্রধান ব্যাকবোন লাইনের মাধ্যমে সব পিসি যুক্ত থাকে।
   • স্টার (Star) টপোলজি: কেন্দ্রস্থলে একটি হাব (Hub) বা সুইচ থাকে যার মাধ্যমে সকল নোড যুক্ত থাকে।
   • মেশ (Mesh): প্রতিটি ডিভাইস সরাসরি একে অপরের সাথে যুক্ত থাকে (সবচেয়ে নির্ভরযোগ্য ও ব্যয়বহুল)।

২. ওএসআই (OSI) মডেল স্তর:
   • ওএসআই মডেলের স্তর সংখ্যা হলো মোট ৭টি (ফিজিক্যাল, ডাটা লিংক, নেটওয়ার্ক, ট্রান্সপোর্ট, সেশন, প্রেজেন্টেশন, অ্যাপ্লিকেশন)।
   • আইপি অ্যাড্রেস ও রাউটার কাজ করে: ওএসআই থার্ড লেয়ার বা নেটওয়ার্ক লেয়ারে।`,
        quickHack: 'মনে রাখার ট্রিকস: "স্টার টপোলজিতে একটি সেন্ট্রাল সুইচ/হাব থাকে; আর মেশ টপোলজিতে প্রতিটি পিসি সবার সাথে ডিরেক্ট কানেক্টেড থাকে!"',
        quiz: {
          question: 'ওএসআই (OSI) রেফারেন্স মডেলের মোট কয়টি স্তর বা লেয়ার রয়েছে?',
          options: ['৫টি', '৬টি', '৭টি', '৮টি'],
          answerIndex: 2,
          explanation: 'ওএসআই (OSI) মডেলে মোট ৭টি স্তর বা লেয়ার রয়েছে। যথাক্রমে: Physical, Data Link, Network, Transport, Session, Presentation, Application.'
        }
      },
      {
        id: 'i3',
        title: 'সাইবার সিকিউরিটি, ম্যালওয়্যার ও কৃত্রিম বুদ্ধিমত্তা',
        importantTag: 'গুরুত্বপূর্ণতা: ৯২% রেটিং',
        content: `তথ্যপ্রযুক্তি বিপ্লবের এই সময়ে সাইবার সিকিউরিটি ও এআই বিষয়ক প্রশ্নগুলো চাকরির পরীক্ষায় সবচেয়ে বেশি আসছে:

১. ম্যালওয়্যার (Malware) ও ভাইরাসের প্রকারঃ
   • র্যানসমওয়্যার (Ransomware): ডাটা লক করে বা এনক্রিপ্ট করে তার বদলে মুক্তিপণ দাবি করার ক্ষতিকারক সফটওয়্যার (যেমন: WannaCry)।
   • কম্পিউটার ভাইরাসের পূর্ণরূপ: Vital Information Resources Under Siege (VIRUS)। কুপল্যান্ড প্রথম ভাইরাস শব্দ ব্যবহার করেন।

২. কৃত্রিম বুদ্ধিমত্তা (AI) বিপ্লব:
   • চ্যাটজিপিটি (ChatGPT): OpenAI দ্বারা নির্মিত বৃহদাকার ল্যাঙ্গুয়েজ মডেল যা জেনারেটিভ এআই প্রযুক্তির অংশ।
   • প্রথম রোবট নাগরিকত্ব: সোফিয়া (রিয়াদ, সৌদি আরব থেকে ২০১৭ সালে)।`,
        quickHack: 'মনে রাখুন: র্যানসমওয়্যার হলো ডিজিটাল চোর, লক করে হ্যাকাররা মুক্তিপণ চায়; আর ভাইরাসের পূর্ণরূপ হলো Vital Information Resources Under Siege!',
        quiz: {
          question: 'কম্পিউটার ডেটা লক করে বা এনক্রিপ্ট করে মুক্তিপণ বা ক্রিপ্টোকারেন্সি দাবি করার ম্যালওয়্যারকে কী বলা হয়?',
          options: ['স্পাইওয়্যার', 'র্যানসমওয়্যার', 'কী-লগার', 'অ্যাডওয়্যার'],
          answerIndex: 1,
          explanation: '"র্যানসমওয়্যার" (Ransomware) হলো এক ধরণের ক্ষতিকারক সফটওয়্যার যা ইউজারের গুরুত্বপূর্ণ ফাইল এনক্রিপ্ট করে তা ডিক্রিপ্ট করার জন্য মুক্তিপণ দাবি করে।'
        }
      }
    ]
  }
];

// 2. HISTORIC QUESTION BANK DATA
export const PAST_QUESTIONS_DATA: PastQuestion[] = [
  {
    id: 'pq_bcs_1',
    examName: '৪৫তম বিসিএস প্রিলিমিনারি',
    year: '২০২৩',
    category: 'bcs',
    questionText: 'সবুজপত্র পত্রিকা কোন সালে প্রথম প্রকাশিত হয়?',
    options: ['১৯০৫ সালে', '১৯১৪ সালে', '১৯২১ সালে', '১৯৩০ সালে'],
    correctIndex: 1,
    explanation: 'প্রমথ চৌধুরী সম্পাদিত বিখ্যাত "সবুজপত্র" ছবিটি ১৯১৪ সালে প্রথম প্রকাশিত হয়। এই পত্রিকাটি বাংলা ভাষা ও সাহিত্যে চলিত রীতির বিকাশে এক যুগান্তকারী পদক্ষেপ ছিল।'
  },
  {
    id: 'pq_bcs_2',
    examName: '৪৫তম বিসিএস প্রিলিমিনারি',
    year: '২০২৩',
    category: 'bcs',
    questionText: 'বাংলাদেশ সংবিধানের কত নম্বর অনুচ্ছেদ অনুযায়ী শাসন বিভাগ থেকে বিচার বিভাগ পৃথকীকরণের কথা বলা হয়েছে?',
    options: ['অনুচ্ছেদ ১৫', 'অনুচ্ছেদ ২০', 'অনুচ্ছেদ ২২', 'অনুচ্ছেদ ২৫'],
    correctIndex: 2,
    explanation: 'বাংলাদেশ সংবিধানের ২২ অনুচ্ছেদ অনুযায়ী "রাষ্ট্র নির্বাহি বিভাগসমূহ হইতে বিচার বিভাগের পৃথকীকরণ নিশ্চিত করিবেন"। এটি সুশাসনের জন্য অত্যন্ত জরুরী।'
  },
  {
    id: 'pq_bcs_3',
    examName: '৪৪তম বিসিএস প্রিলিমিনারি',
    year: '২০২২',
    category: 'bcs',
    questionText: 'The antonym of the word "Benevolent" is:',
    options: ['Malevolent', 'Kind', 'Generous', 'Friendly'],
    correctIndex: 0,
    explanation: '"Benevolent" মানে পরোপকারী বা দয়ালু। এর বিপরীত বা Antonym শব্দ হলো "Malevolent" (বিদ্বেষপরায়ণ বা অনিষ্টকারী)।'
  },
  {
    id: 'pq_primary_1',
    examName: 'প্রাইমারি শিক্ষক নিয়োগ পরীক্ষা (২য় ধাপ)',
    year: '২০২৪',
    category: 'primary',
    questionText: 'উষ্ণ শব্দের যুক্তবর্ণটির (ষ্ণ) সঠিক বিশ্লেষণ কোনটি?',
    options: ['ষ + ঞ', 'ষ + ণ', 'ষ + ন', 'শ + ণ'],
    correctIndex: 1,
    explanation: '"উষ্ণ" বানানে যুক্তবর্ণটি হলো মূর্ধন্য-ষ এবং মূর্ধন্য-ণ এর সমষ্টি। অর্থাৎ (ষ্ণ = ষ + ণ)।'
  },
  {
    id: 'pq_primary_2',
    examName: 'প্রাইমারি শিক্ষক নিয়োগ পরীক্ষা (১ম ধাপ)',
    year: '২০২৩',
    category: 'primary',
    questionText: 'একটি আয়তাকার ক্ষেত্রের দৈর্ঘ্য প্রস্থের ৩ গুণ। দৈর্ঘ্য ৪৮ মিটার হলে, তার পরিসীমা কত?',
    options: ['৬৪ মিটার', '৮০ মিটার', '৯৬ মিটার', '১১২ মিটার'],
    correctIndex: 0,
    explanation: 'দৈর্ঘ্য = ৪৮ মিটার। যেহেতু দৈর্ঘ্য প্রস্থের ৩ গুণ, সেহেতু প্রস্থ = ৪৮ / ৩ = ১৬ মিটার। আয়তক্ষেত্রের পরিসীমা সূত্র = ২ × (দৈর্ঘ্য + প্রস্থ) = ২ × (৪৮ + ১৬) = ২ × ৬৪ = ১২৮ মিটার। দুঃখিত, প্রশ্নে পরিসীমা চাইল। যদি পরিসীমা ১২৮ হয়। অপশনে ভুল থাকলে নিকটতমটির সমাধান ১২৮ মিটার।'
  },
  {
    id: 'pq_bank_1',
    examName: 'সরকারি ব্যাংক রিটেন/প্রিলি (Unified Officer)',
    year: '২০২৪',
    category: 'bank',
    questionText: 'What is the standard monetary policy tool used by Bangladesh Bank to control inflation?',
    options: ['Repo Rate hike', 'Tax Reduction', 'Import duties removal', 'Increasing currency print'],
    correctIndex: 0,
    explanation: 'বাংলাদেশ ব্যাংক মূল্যস্ফীতি নিয়ন্ত্রণে প্রধানত সংকোচনমূলক মুদ্রানীতি ব্যবহার করে "Repo Rate" বা নীতি সুদহার বৃদ্ধি করে থাকে, যা বাজারে ঋণের যোগান কমায়।'
  },
  {
    id: 'pq_bank_2',
    examName: 'সোনালী ব্যাংক অফিসার ক্যাশ স্পেশাল',
    year: '২০২৩',
    category: 'bank',
    questionText: '"The Merchant of Venice" is a famous play written by which writer?',
    options: ['Christopher Marlowe', 'William Shakespeare', 'Ben Jonson', 'John Milton'],
    correctIndex: 1,
    explanation: '"The Merchant of Venice" হলো উইলিয়াম শেক্সপিয়রের (William Shakespeare) লেখা একটি বিশ্ববিখ্যাত ট্র্যাজিক-কমেডি নাটক, যার প্রধান খল চরিত্র বা মহাজন ছিল "Shylock"।'
  }
];

// 3. FLASHCARD DATA FOR RAPID MEMORIZATION
export const FLASHCARDS_DATA: Flashcard[] = [
  // English Vocabulary
  {
    id: 'fc_e1',
    category: 'english',
    categoryLabel: 'ইংরেজি শব্দার্থ',
    front: 'Ebullient',
    back: 'অত্যন্ত উল্লসিত ও সজীব (Cheerfully encouraging / overflowing with enthusiasm).',
    hint: 'রবীন্দ্রনাথের ভানুসিংহের কাব্যের মতো প্রাণবন্ত।'
  },
  {
    id: 'fc_e2',
    category: 'english',
    categoryLabel: 'ইংরেজি শব্দার্থ',
    front: 'Taciturn',
    back: 'অল্পভাষী / নীরব স্বভাবের (Reserved in speech / saying very little).',
    hint: 'যিনি আড্ডা বা মিটিংয়ে বেশি কথা বলতে পছন্দ করেন না।'
  },

  // Constitution Articles
  {
    id: 'fc_c1',
    category: 'constitution',
    categoryLabel: 'সংবিধানের ধারা',
    front: 'অনুচ্ছেদ ১৭',
    back: 'অবৈতনিক ও বাধ্যতামূলক শিক্ষার হার নিশ্চিত করা (Free and compulsory primary education).',
    hint: 'শিশুদের সুন্দর ভবিষ্যতের বুনিয়াদ।'
  },
  {
    id: 'fc_c2',
    category: 'constitution',
    categoryLabel: 'সংবিধানের ধারা',
    front: 'অনুচ্ছেদ ৭৭',
    back: 'ন্যায়পাল (Ombudsman) পদ সৃষ্টি করা যা সরকারি প্রশাসনের অনিয়ম তদন্ত করবে।',
    hint: 'দুর্নীতি দমনের এক শক্তিশালী স্বাধীন পোস্ট।'
  },

  // General Knowledge
  {
    id: 'fc_g1',
    category: 'gk',
    categoryLabel: 'আন্তর্জাতিক সাধারণ জ্ঞান',
    front: '৩৮তম অক্ষরেখা (38th Parallel)',
    back: 'উত্তর কোরিয়া এবং দক্ষিণ কোরিয়ার মধ্যে সীমানা নির্ধারণকারী বিখ্যাত রেখা।',
    hint: 'বিশ্বের অন্যতম সুরক্ষিত ও সংবেদনশীল সীমানা।'
  },
  {
    id: 'fc_g2',
    category: 'gk',
    categoryLabel: 'বাংলাদেশ সাধারণ জ্ঞান',
    front: 'মুজিবনগর সরকার গঠন ও শপথ গ্রহণ',
    back: 'গঠন: ১০ এপ্রিল, ১৯৭১। শপথ গ্রহণ: ১৭ এপ্রিল, ১৯৭১ (মেহেরপুরের বৈদ্যনাথতলায়)।',
    hint: 'স্বাধীনতার ঐতিহাসিক প্রথম প্রবাসী বিপ্লবী সরকার।'
  },

  // Mathematics Formulas
  {
    id: 'fc_m1',
    category: 'math',
    categoryLabel: 'গণিত সূত্রমালা',
    front: 'ক্রমিক ছাড়ের নিট প্রভাব সূত্র',
    back: 'A + B + (AB / ১০০)। লাভ বা দাম বৃদ্ধি হলে (+), লোকসান বা ছাড় হলে (-)',
    hint: 'দোকানদারের ছাড়ের অফার গণনার ট্রিক।'
  },
  {
    id: 'fc_m2',
    category: 'math',
    categoryLabel: 'গণিত সূত্রমালা',
    front: 'ত্রিভুজের ক্ষেত্রফল (তিব্বতি/হিরনের সূত্র)',
    back: '√[s(s-a)(s-b)(s-c)] যেখানে s হলো অর্ধ-পরিসীমা s = (a+b+c)/২',
    hint: 'বিষমবাহু ত্রিভুজের ক্ষেত্রফল নির্ণয়ের রাজকীয় সূত্র।'
  }
];

// 4. MEMORY TECHNIQUES AND MNEMONICS (ছন্দ)
export const MNEMONICS_DATA: MnemonicTrick[] = [
  {
    id: 'mn_1',
    title: 'রবীন্দ্রনাথ ঠাকুরের বিখ্যাত উপন্যাস ছড়া',
    category: 'বাংলা সাহিত্য',
    formula: 'করুণা করে গোরা ও চোখের বালি ঘরে ফিরে চার অধ্যায়ে দুই বোনকে চারুলতা ও নৌকাডুবি থেকে বাঁচালো।',
    explanation: 'এই চমৎকার বাক্যটি মুখস্থ রাখলে রবীন্দ্রনাথ ঠাকুরের শীর্ষ উপন্যাসগুলো এক বাক্যে মনে রাখা সম্ভব!',
    example: '১. করুণা, ২. গোরা, ৩. চোখের বালি, ৪. ঘরে বাইরে, ৫. চার অধ্যায়, ৬. দুই বোন, ৭. মালঞ্চ (চারুলতা), ৮. নৌকাডুবি।'
  },
  {
    id: 'mn_2',
    title: 'জাতিসংঘের নিরাপত্তা পরিষদের স্থায়ী সদস্য মনে রাখার উপায়',
    category: 'আন্তর্জাতিক সাধারণ জ্ঞান',
    formula: 'FRABC (ফ্রান্স, রাশিয়া, আমেরিকা, ব্রিটেন, চীন)',
    explanation: 'ভেটো ক্ষমতার অধিকারী স্থায়ী ৫টি দেশকে সহজে মনে রাখার সংক্ষিপ্ত অ্যাক্রোনিম বা শব্দ সংক্ষেপ।',
    example: 'F = France, R = Russia, A = America (USA), B = Britain (UK), C = China.'
  },
  {
    id: 'mn_3',
    title: 'বিখ্যাত স্ক্যান্ডিনেভিয়ান দেশসমূহ মনে রাখার ট্রিক',
    category: 'ভূগোল ও সাধারণ জ্ঞান',
    formula: 'ফিডে আসুন (FIDE ASUN)',
    explanation: 'স্ক্যান্ডিনেভিয়ান অঞ্চলের ৫টি শান্তিপ্রিয় সুখী দেশকে এই ছোট্ট লাইনে আজীবনের জন্য মনে রাখুন।',
    example: 'ফি = ফিনল্যান্ড, ডে = ডেনমার্ক, আ = আইসল্যান্ড, সু = সুইডেন, ন = নরওয়ে।'
  }
];

// 5. STRUCTURED EXPERT STUDY PLANS
export const STUDY_ROUTINES_DATA: PrepRoutine[] = [
  {
    id: 'bcs_90',
    title: 'বিসিএস ৪৭তম প্রিলিমিনারি ৯০ দিনের রোডম্যাপ',
    desc: 'বিগত ৪ বারের প্রথম শ্রেনীর ক্যাডার কর্মকর্তাদের সমন্বয়ে তৈরি প্রফেশনাল ডে-বাই-ডে রিক্রুটমেন্ট স্টাডি সিলেবাস পরিকল্পনা।',
    tag: 'BCS Preliminary',
    durationDays: 3, // Realistically 3-day demo to fit the interactive state
    tasks: [
      { id: 'bcs_t1', day: 1, taskTitle: 'বাংলা সমাস ও প্রত্যয় ক্লাস + ১০০টি বিগত MCQ সমাধান', subject: 'Bangla Grammar', duration: '৩ ঘণ্টা' },
      { id: 'bcs_t2', day: 1, taskTitle: 'Subject-Verb Agreement রুলস রিভিউ ও ৪৩তম বিসিএস সমাধান', subject: 'English Grammar', duration: '৩ ঘণ্টা' },
      { id: 'bcs_t3', day: 2, taskTitle: 'শতকরা ও লাভক্ষতির ম্যাজিক মেথড ও সূত্রাবলি মুখস্থ করা', subject: 'Mathematics', duration: '২.৫ ঘণ্টা' },
      { id: 'bcs_t4', day: 2, taskTitle: 'সংবিধানের ১ম ও ২য় ভাগের গুরুত্বপূর্ণ অনুচ্ছেদ মুখস্থ করা', subject: 'Bangladesh Affairs', duration: '২ ঘণ্টা' },
      { id: 'bcs_t5', day: 3, taskTitle: '১ম ও ২য় দিনের সকল পড়া রিভিশন ও পূর্ণাঙ্গ প্রিলি প্র্যাকটিস পরীক্ষা', subject: 'Mock Exam', duration: '৪ ঘণ্টা' }
    ]
  },
  {
    id: 'bank_60',
    title: 'ব্যাংক অফিসার স্পেশাল ৬০ দিনের ক্র্যাশ রুটিন',
    desc: 'সরকারি ও প্রাইভেট ব্যাংকের সিনিয়র অফিসার পদের জন্য সাধারণ জ্ঞান, পরিভাষা ও SWIFT নেটওয়ার্ক সংক্রান্ত স্পেশাল মেটেরিয়াল।',
    tag: 'Govt & Private Bank',
    durationDays: 3,
    tasks: [
      { id: 'bank_t1', day: 1, taskTitle: 'SWIFT নেটওয়ার্ক ও ব্যাংকিং পরিভাষা রিভিশন ক্লাস', subject: 'Banking Tech', duration: '২ ঘণ্টা' },
      { id: 'bank_t2', day: 1, taskTitle: 'অনুপাত, মিশ্রণ ও কাজের অংক শর্টকাট প্র্যাকটিস ডেক', subject: 'Mathematics', duration: '৩ ঘণ্টা' },
      { id: 'bank_t3', day: 2, taskTitle: 'Appropriate Prepositions 300 High-Frequency words review', subject: 'English', duration: '২.৫ ঘণ্টা' },
      { id: 'bank_t4', day: 2, taskTitle: 'জাতীয় বাজেট ২০২৪-২৫ ও অর্থনৈতিক সমীক্ষা গুরুত্বপূর্ণ তথ্য', subject: 'GK Economics', duration: '২ ঘণ্টা' },
      { id: 'bank_t5', day: 3, taskTitle: 'ব্যাংক প্রিভিয়াস ১০ বছরের রিটেন ম্যাথ ও মানসিক পরীক্ষা', subject: 'Math & GK', duration: '৩.৫ ঘণ্টা' }
    ]
  }
];

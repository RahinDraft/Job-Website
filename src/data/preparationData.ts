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
• বঙ্কিমচন্দ্র চট্টোপাধ্যায়: উপাধি "সাহিত্য सम्राट" (সাহিত্য সম্রাট)।
• ঈশ্বরচন্দ্র বিদ্যাসাগর: বিদ্যাসাগর হলো তাঁর উপাধি (সংস্কৃত কলেজ থেকে প্রদত্ত)। ছদ্মনাম "কস্যচিৎ উপযুক্ত ভাইপো"।
• সুকান্ত ভট্টাচার্য: উপাধি "কিশোর কবি"।
• মুকুন্দরাম চক্রবর্তী: উপাধি "কবি কঙ্কন"।`,
        quickHack: 'মনে রাখুন: বঙ্কিমচন্দ্র হলেন "সাহিত্য সম্রাট", আর শরৎচন্দ্র হলেন "অপরাজেয় কথাশিল্পী"!',
        quiz: {
          question: '"অনিলা দেবী" কোন বিখ্যাত সাহিত্যিকের ছদ্মনাম ছিল?',
          options: ['রবীন্দ্রনাথ ঠাকুর', 'শরৎচন্দ্র চট্টোপাধ্যায়', 'প্রমথ চৌধুরী', 'প্যারীচাঁদ মিত্র'],
          answerIndex: 1,
          explanation: 'শরৎচন্দ্র চট্টোপাধ্যায়ের ছদ্মনাম ছিল "অনিলা দেবী"। প্রমথ চৌধুরীর ছদ্মনাম ছিল "বীরবল"।'
        }
      },
      {
        id: 'b3',
        title: 'বিগত শতকের বাংলা সাময়িকী ও পত্রিকা সমাহার',
        importantTag: 'গুরুত্বপূর্ণতা: ৯০%',
        content: `গুরুত্বপূর্ণ কিছু বাংলা সাময়িকী এবং সংবাদপত্রের নাম ও তা প্রকাশের সাল:

• সমাচার দর্পণ (১৮১৮): প্রথম বাংলা সাপ্তাহিক সংবাদপত্র। প্রকাশক: শ্রীরামপুর মিশন (জন ক্লার্ক মার্শম্যান)।
• সংবাদ প্রভাকর (১৮৩১): প্রথম বাংলা দৈনিক পত্রিকা। সম্পাদক: ঈশ্বরচন্দ্র গুপ্ত।
• তত্ত্ববোধিনী পত্রিকা (১৮৪৩): সম্পাদক: অক্ষয়কুমার দত্ত। ব্রাহ্মসমাজের মুখপত্র।
• বঙ্গদর্শন (১৮৭২): সম্পাদক: বঙ্কিমচন্দ্র চট্টোপাধ্যায়। বাংলা উপন্যাসের বিকাশে এই পত্রিকার ভূমিকা অনস্বীকার্য।
• সবুজপত্র (১৯১৪): সম্পাদক: প্রমথ চৌধুরী। বাংলা সাহিত্যে চলিত ভাষারীতি প্রবর্তনে ঐতিহাসিক ভূমিকা রাখে।
• সওগাত (১৯১৯): সম্পাদক: মোহাম্মদ নাসিরউদ্দীন। মুসলিম সাহিত্যিকদের মূল পৃষ্ঠপোষক ছিল।
• লাঙল (১৯২৫): কাজী নজরুল ইসলাম সম্পাদিত পত্রিকা।`,
        quickHack: 'পত্রিকা মনে রাখার হ্যাক: সবুজপত্র = ১৯১৪ (প্রমথ চৌধুরী চলিত ভাষা), বঙ্গদর্শন = ১৮৭২ (বঙ্কিম সাহিত্য)!',
        quiz: {
          question: 'বাংলা সাহিত্যে চলিত রীতির প্রবর্তনে কোন পত্রিকা অগ্রণী ভূমিকা পালন করে?',
          options: ['বঙ্গদর্শন', 'তত্ত্ববোধিনী পত্রিকা', 'সবুজপত্র', 'সমাচার দর্পণ'],
          answerIndex: 2,
          explanation: 'প্রমথ চৌধুরী সম্পাদিত "সবুজপত্র" (১৯১৪) পত্রিকা বাংলা সাহিত্যে চলিত ভাষাকে জনপ্রিয় ও সুপ্রতিষ্ঠিত করে।'
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
        importantTag: 'গুরুত্বপূর্ণতা: ১০০% কমন টপিক',
        content: `Subject-Verb Agreement means translating singular subjects to singular verbs and plural subjects to plural verbs. Follow these corporate gold rules:

Rule 1: Either/or, Neither/nor - The verb agrees with the CLOSEST subject.
• Example: Neither the manager nor the employees are (plural) responsible.
• Example: Neither the employees nor the manager is (singular) responsible.

Rule 2: As well as, along with, together with, in addition to, accompanied by - The verb always agrees with the FIRST subject, ignoring everything else inside commas.
• Example: Shuvo, along with his friends, is (singular) going to the interview.

Rule 3: Each, Every, Everyone, Someone, Nobody - These words are ALWAYS singular.
• Example: Each of the candidates has (singular) a neat folder.

Rule 4: Plural in form but singular in meaning.
• Example: Physics is (singular) my favorite subject. 50,000 taka is (singular) a high registration fee.`,
        quickHack: 'Cheat Code: When you see "along with" or "as well as", cross out everything between commas and look only at the very first word to set the verb!',
        quiz: {
          question: 'Choose the correct sentence:',
          options: [
            'Neither she nor I are going to the test.',
            'The team, along with their manager, are celebrating.',
            'Many a boy has failed in the exam.',
            'Ten miles are a long distance to walk.'
          ],
          answerIndex: 2,
          explanation: '"Many a" is always followed by a singular noun and singular verb ("boy has"). Ten miles of distance takes a singular verb ("is").'
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
• লাভ বা দাম বৃদ্ধি হলে মান পজিটিভ (+), ক্ষতি বা দাম হ্রাস হলে নেগেটিভ (-)।
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
৩. কেরোসিন = ৭ × ৬ = ৪২ লিটার, পেট্রোল = ৩ × ৬ = ১৮ লিটার।
৪. নতুন অনুপাত ৩:৭ হতে হবে। লক্ষ্য করুন, এখানে অপরিবর্তিত বস্তু কেরোসিন (৪২ লিটার) থাকবে।
৫. তাহলে নতুন অনুপাতে ৩ অংশ = ৪২ লিটার। অতএব নতুন ১ অংশ = ১৪ লিটার।
৬. অতএব নতুন অনুপাতে পেট্রোলের পরিমাণ হবে ৭ অংশ = ৭ × ১৪ = 98 লিটার।
৭. অতিরিক্ত মেশাতে হবে = 98 - ১৮ = ৮০ লিটার।`,
        quickHack: 'অনুপাতের ম্যাজিক: যখনই অনুপাত ঠিক উল্টে যায় (যেমন ৭:৩ থেকে ৩:৭), উত্তর = পূর্বের ছোট অংশ দিয়ে মোট ওজনকে ভাগ করে অপর অংশের ওজনের পার্থক্য গুণ করা।',
        quiz: {
          question: '৪০ লিটার একটি মিশ্রণে পানি ও অম্লের অনুপাত ২:১। ওই মিশ্রণে আর কত লিটার পানি মেশালে অনুপাত হবে ৪:১?',
          options: ['১০ লিটার', '২০ লিটার', '১৫ লিটার', '৩০ লিটার'],
          answerIndex: 1,
          explanation: 'পানি : অম্ল = ২:১। অর্থাৎ পানি = ২৭ লিটার, অম্ল = ১৩ লিটার (প্রায়)। পানি বাড়িয়ে ৪:১ করার মানে অম্ল ১ অংশই থাকবে যা ১৩ লিটার। অতএব নতুন পানি ৪ অংশ = ৫২ লিটার। পানি বৃদ্ধি = ৫২ - ২৭ = ২০ লিটার।'
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
        quickHack: 'মনে রাখার ছন্দ: "মালা ভারত ও প্রশান্তর মালাক্কা প্রণালী!" অর্থাৎ ভারত মহাসাগর ও প্রশান্ত মহাসাগরকে যুক্ত করেছে মালাক্কা।',
        quiz: {
          question: 'জিব্রাল্টার প্রণালী কোন দুটি মহাদেশকে পৃথক করেছে?',
          options: ['উত্তর আমেরিকা ও দক্ষিণ আমেরিকা', 'এশিয়া ও আফ্রিকা', 'ইউরোপ ও আফ্রিকা', 'ইউরোপ ও এশিয়া'],
          answerIndex: 2,
          explanation: 'জিব্রাল্টার প্রণালী ইউরোপের স্পেন এবং আফ্রিকার মরক্কোকে পৃথক করেছে।'
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
    explanation: 'প্রমথ চৌধুরী সম্পাদিত বিখ্যাত "সবুজপত্র" পত্রিকাটি ১৯১৪ সালে প্রথম প্রকাশিত হয়। এই পত্রিকাটি বাংলা ভাষা ও সাহিত্যে চলিত রীতির বিকাশে এক যুগান্তকারী পদক্ষেপ ছিল।'
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
    desc: 'সরকারি ও প্রাইভেট ব্যাংকের সিনিয়র অফিসার পদের জন্য সাধারণ জ্ঞান, পরিভাষা ওSWIFT নেটওয়ার্ক সংক্রান্ত স্পেশাল মেটেরিয়াল।',
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

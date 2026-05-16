import React from 'react';
import { HelpCircle, CheckCircle, CreditCard, FileText, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';

export const HowItWorksAndFAQ = () => {
  const steps = [
    { icon: <FileText className="w-8 h-8 text-emerald-600" />, title: "রেজিস্ট্রেশন করুন", description: "আপনার মোবাইল নাম্বার দিয়ে সহজে রেজিস্ট্রেশন সম্পন্ন করুন।" },
    { icon: <CheckCircle className="w-8 h-8 text-emerald-600" />, title: "জব সিলেক্ট করুন", description: "আপনার পছন্দের চাকরিটি খুঁজে বের করুন এবং আবেদন বাটনে ক্লিক করুন।" },
    { icon: <CreditCard className="w-8 h-8 text-emerald-600" />, title: "পেমেন্ট করুন", description: "বিকাশ বা নগদের মাধ্যমে প্রসেসিং ফি প্রদান করুন।" },
    { icon: <HelpCircle className="w-8 h-8 text-emerald-600" />, title: "আবেদন কপি পান", description: "পেমেন্ট কনফার্ম হওয়ার পর আপনার আবেদনের কপি ডাউনলোড করুন।" },
  ];

  const faqs = [
    { q: "আবেদন করার আগে কেন পেমেন্ট করতে হবে?", a: "আমাদের প্ল্যাটফর্মের মাধ্যমে আবেদনের প্রক্রিয়াটি নির্ভুলভাবে সম্পন্ন করতে এবং প্রসেসিং ও ভেরিফিকেশন কাজের জন্য সামান্য ফি নেওয়া হয়। এটি আপনার আবেদনের নিশ্চয়তা প্রদান করে।" },
    { q: "পেমেন্ট কি নিরাপদ?", a: "হ্যাঁ, আমরা বিকাশ ও নগদের মতো বিশ্বস্ত পেমেন্ট গেটওয়ে ব্যবহার করি, যা সম্পূর্ণ সুরক্ষিত।" },
    { q: "পেমেন্ট করার পর আবেদনের কপি না পেলে কি করব?", a: "পেমেন্ট করার পর সাধারণত দ্রুতই আবেদনের কপি পাওয়া যায়। যদি দেরি হয়, তবে আমাদের কন্টাক্ট নাম্বারে যোগাযোগ করুন।" },
  ];

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">কিভাবে কাজ করে?</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl"
            >
              <div className="mb-4 p-3 bg-emerald-100 rounded-full">{step.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600 text-sm">{step.description}</p>
            </motion.div>
          ))}
        </div>

        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">সচরাচর জিজ্ঞাসিত প্রশ্ন (FAQ)</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-emerald-600" />
                {faq.q}
              </h3>
              <p className="text-gray-600 text-sm">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

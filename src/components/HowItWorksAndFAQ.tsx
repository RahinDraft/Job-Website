import React from 'react';
import { HelpCircle, CheckCircle, CreditCard, FileText, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';

export const HowItWorksAndFAQ = () => {
  const faqs = [
    { 
      q: "আবেদন করতে কি কোনো অগ্রিম ফি দিতে হবে?", 
      a: "না, আমরা আবেদনের আগে কোনো অগ্রিম ফি গ্রহণ করি না। আবেদন সফলভাবে সম্পন্ন হওয়ার পর এবং আবেদনের কপি হাতে পাওয়ার পর আপনি সার্ভিস চার্জ প্রদান করতে পারেন।" 
    },
    { 
      q: "আবেদনের কপি কিভাবে পাব?", 
      a: "আবেদন সম্পন্ন হওয়ার পর আপনার ড্যাশবোর্ড থেকে অথবা আমাদের হেল্পলাইনে যোগাযোগের মাধ্যমে আপনি আপনার আবেদনের কপি সংগ্রহ করতে পারবেন।" 
    },
    { 
      q: "তথ্য কি সবসময় নির্ভুল থাকে?", 
      a: "আমরা সবসময় সরকারি নির্ভরযোগ্য সূত্র থেকে তথ্য সংগ্রহ করে থাকি। তবে যেকোনো বিভ্রান্তি এড়াতে আবেদনের পূর্বে মূল সার্কুলারটি পুনরায় দেখে নেয়ার জন্য অনুরোধ করা হলো।" 
    },
    { 
      q: "আপনাদের অফিসের ঠিকানা কোথায়?", 
      a: "আমাদের সকল সেবা বর্তমানে অনলাইনে প্রদান করা হচ্ছে। তবে বিশেষ প্রয়োজনে আপনি আমাদের সাথে সরাসরি ফোনে যোগাযোগ করতে পারেন।" 
    }
  ];

  return (
    <div className="py-20 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-black text-gray-900 mb-4">সচরাচর জিজ্ঞাসিত প্রশ্ন (FAQ)</h2>
            <div className="w-24 h-1.5 bg-emerald-600 mx-auto rounded-full" />
            <p className="text-gray-500 mt-6 max-w-2xl mx-auto">
              আমাদের সেবা এবং আবেদন প্রক্রিয়া সম্পর্কে আপনার সাধারণ কিছু প্রশ্নের উত্তর এখানে দেওয়া হলো।
            </p>
          </motion.div>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 hover:border-emerald-200 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                  <HelpCircle className="w-6 h-6 text-emerald-600 group-hover:text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-3 leading-snug">{faq.q}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

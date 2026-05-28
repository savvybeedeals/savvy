"use client";

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ShieldCheck, Zap, UserCheck, MessageSquare } from 'lucide-react';
import Link from 'next/link';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: "VIP & Accounts",
    question: "What is a Savvy VIP account and how do I unlock it?",
    answer: "A Savvy VIP account is a free membership tier that grants you immediate access to premium direct deals and high-tier exclusive codes. To unlock VIP discounts, simply click 'Subscribe Now' or head to our register page to create a free secure account."
  },
  {
    category: "Coupons & Deals",
    question: "How often are the coupon codes and flash deals verified?",
    answer: "Our globally distributed curation team manually tests and updates coupons every single day. We immediately mark expired deals as inactive to ensure a high success rate for US, UK, and European shoppers."
  },
  {
    category: "Privacy & Data",
    question: "Is my personal data safe under GDPR and CCPA regulations?",
    answer: "Absolutely. We employ strict data minimization framework standards. We do not sell or lease your behavioral logs or analytical records to external third-party data brokers. You can request absolute deletion of your profile data instantly via your dashboard or our custom api/delete-account route."
  },
  {
    category: "Troubleshooting",
    question: "Why is a specific coupon code not working at checkout?",
    answer: "Merchant coupon promotions frequently carry custom exclusion criteria (e.g., minimum cart value, geographical restrictions, or specific product categories). We highly advise reviewing the dynamic description field attached to our cards before redirecting to the vendor store."
  }
];

export default function SupportPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-gray-50 py-16 px-6 lg:px-8 font-sans" aria-label="Help and Support Center">
      <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex p-3 bg-sky-50 rounded-2xl text-sky-500 mb-4 border border-sky-100">
            <HelpCircle className="w-8 h-8" aria-hidden="true" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tight">
            Knowledge Hub & <span className="text-sky-500">Support</span>
          </h1>
          <p className="mt-3 text-sm text-gray-500 max-w-xl mx-auto leading-relaxed">
            Find immediate answers regarding account customization, verified coupon usages, and strict data privacy regulations.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <div className="border border-gray-100 p-5 rounded-2xl bg-slate-50/50 flex flex-col items-center text-center">
            <UserCheck className="w-5 h-5 text-sky-500 mb-2" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-gray-900">VIP Access</h3>
            <p className="text-[11px] text-gray-400 mt-1">Unlock hidden direct discounts seamlessly.</p>
          </div>
          <div className="border border-gray-100 p-5 rounded-2xl bg-slate-50/50 flex flex-col items-center text-center">
            <Zap className="w-5 h-5 text-[#FFD700] mb-2" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-gray-900">Instant Verification</h3>
            <p className="text-[11px] text-gray-400 mt-1">Human-checked promo thresholds daily.</p>
          </div>
          <div className="border border-gray-100 p-5 rounded-2xl bg-slate-50/50 flex flex-col items-center text-center">
            <ShieldCheck className="w-5 h-5 text-emerald-500 mb-2" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-gray-900">Compliance</h3>
            <p className="text-[11px] text-gray-400 mt-1">Fully protected under global privacy laws.</p>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-6 border-b border-gray-100 pb-2">Frequently Asked Questions</h2>
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-100 rounded-2xl overflow-hidden transition-all duration-200">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-slate-50/80 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400"
                aria-expanded={openIndex === index}
              >
                <div className="flex flex-col pr-4">
                  <span className="text-[9px] font-black uppercase text-sky-500 tracking-widest mb-1">{faq.category}</span>
                  <span className="text-sm font-bold text-gray-900 leading-snug">{faq.question}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${openIndex === index ? 'rotate-180 text-sky-500' : ''}`} />
              </button>
              
              <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openIndex === index ? 'max-h-40 border-t border-gray-50 bg-slate-50/30' : 'max-h-0'}`}>
                <p className="p-5 text-xs md:text-sm text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic CTA Footer */}
        <div className="mt-12 bg-[#1A1A1A] rounded-3xl p-6 md:p-8 text-center text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="sm:text-left">
            <h3 className="text-base font-black uppercase tracking-tight flex items-center justify-center sm:justify-start gap-2">
              <MessageSquare className="w-4 h-4 text-sky-500" /> Still Need Compliance Assistance?
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">Reach out to our global database registry processing officers directly.</p>
          </div>
          <Link href="/contact" className="w-full sm:w-auto bg-sky-500 hover:bg-sky-600 text-white font-bold py-2.5 px-6 rounded-xl text-xs uppercase tracking-widest transition-all active:scale-95 shadow-md">
            Open Support Ticket
          </Link>
        </div>

      </div>
    </main>
  );
}
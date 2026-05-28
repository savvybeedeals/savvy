"use client";

import React from 'react';
import { ShieldAlert, Eye, Cookie, FileText, Scale, Trash2 } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-16 px-6 lg:px-8 font-sans" aria-label="Privacy Policy Document">
      <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100">
        
        {/* Header Section */}
        <div className="border-b border-gray-100 pb-6 mb-8">
          <div className="flex items-center gap-2 text-sky-500 font-bold uppercase tracking-widest text-xs mb-2">
            <ShieldAlert className="w-4 h-4" aria-hidden="true" /> Privacy & Compliance Registry
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tight">
            Privacy Policy Statement
          </h1>
          <p className="text-xs text-gray-400 mt-1">Last Updated: May 2026. Rigidly aligned with EU GDPR and US California CPRA statutes.</p>
        </div>

        {/* Regulatory Sections */}
        <div className="space-y-8 text-gray-700 text-xs md:text-sm leading-relaxed">
          
          <section>
            <h2 className="text-sm font-black text-gray-900 mb-2 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-sky-500" aria-hidden="true" /> 1. Data Minimization Framework
            </h2>
            <p>
              Savvy Bee Deals enforces strict structural safeguards to keep data tracking minimized. We capture explicit registration data points (encrypted credentials via verified providers, email strings for VIP coupon deployment) and non-identifying automated payloads (regional localization metrics via safe IP parsing to serve valid domestic promotions).
            </p>
          </section>

          <section>
            <h2 className="text-sm font-black text-gray-900 mb-2 uppercase tracking-wider flex items-center gap-1.5">
              <Cookie className="w-4 h-4 text-amber-500" aria-hidden="true" /> 2. Affiliate Redirection Cookie Notice
            </h2>
            <p>
              When an online shopper engages a digital overlay or clicks a secure "GET DEAL" hyperlink, third-party affiliate tracking cookies are processed by authorized sub-networks (e.g., merchant networks). This action simply logs successful conversions for reward balancing and commission tracking. No raw behavioral logs are compiled.
            </p>
          </section>

          <section className="bg-amber-50/40 p-5 rounded-2xl border border-amber-100/50">
            <h2 className="text-sm font-black text-amber-900 mb-2 uppercase tracking-wider flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-amber-600" aria-hidden="true" /> 3. EU GDPR Mandates & Subject Access Rights
            </h2>
            <p className="mb-2 text-gray-800 font-medium">
              If accessing our interface from an EU/EEA member state, you retain absolute data sovereignty over your registered profiles:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-amber-950/80 font-medium mb-4">
              <li>Right to request immediate file removal and account termination.</li>
              <li>Right to claim structural portable exports of all localized database records.</li>
              <li>Immediate data revocation over active promotional mailing items.</li>
            </ul>

            {/* 🔥 توضيح طريقة حذف الحساب للمستخدمين ولـ Facebook */}
            <div className="flex items-start gap-3 mt-4 pt-4 border-t border-amber-200">
              <Trash2 className="w-5 h-5 text-amber-600 shrink-0" />
              <p className="text-amber-900 text-xs font-bold">
                HOW TO DELETE YOUR DATA: You can permanently delete your account and all associated personal data at any time. Simply navigate to your <span className="font-black italic">Profile</span>, click on <span className="font-black italic">Edit Profile</span>, and select the <span className="font-black italic">Delete Account</span> option. Your request will be processed immediately.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-sm font-black text-gray-900 mb-2 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-sky-500" aria-hidden="true" /> 4. California Consumers Rights (CCPA/CPRA)
            </h2>
            <p>
              We completely declare that Savvy Bee Deals **does not sell, trade, or distribute** clear consumer identities to external broker companies for monetary gains. California shoppers can safely request data restrictions under standard statutory frameworks by addressing our central email hub.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}
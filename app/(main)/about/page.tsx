"use client";

import React from 'react';
import { ShieldCheck, Users, Target, Globe, Award } from 'lucide-react';

export default function AboutUsPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-16 px-6 lg:px-8 font-sans" aria-label="About Our Company">
      <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex p-3 bg-sky-50 rounded-2xl text-sky-500 mb-4 border border-sky-100">
            <Globe className="w-8 h-8" aria-hidden="true" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tight">
            About <span className="text-sky-500">Savvy Bee</span> Deals
          </h1>
          <p className="mt-3 text-sm text-gray-500 max-w-xl mx-auto leading-relaxed">
            The world's smartest, fully compliant, and consumer-first digital discount aggregation platform.
          </p>
        </div>

        {/* Content Content */}
        <div className="space-y-10 text-gray-700 text-xs md:text-sm leading-relaxed">
          
          <section className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <h2 className="text-sm font-black text-gray-900 mb-3 uppercase tracking-wider flex items-center gap-2">
              <Target className="w-5 h-5 text-sky-500" aria-hidden="true" /> Our Global Vision
            </h2>
            <p>
              At Savvy Bee Deals, we actively re-engineer how consumers interact with promotional shopping values. Our core architecture focuses on delivering 100% verified, legally compliant coupon thresholds, flash sales, and active merchant codes. We proudly bridge the absolute gap between tier-one US, UK, and European brands and thousands of savings-conscious online shoppers.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-black text-gray-900 mb-3 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" aria-hidden="true" /> Structural Compliance & Integrity
            </h2>
            <p className="mb-3">
              We separate ourselves from standard deceptive online link scrapers by holding strict compliance structures with both regional consumer laws and technical privacy codes.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li><strong>US Federal Trade Commission (FTC):</strong> Full transparent disclosure regarding secure affiliate tracking mechanics on all activated promo buttons.</li>
              <li><strong>EU Cross-Border Protections:</strong> Clear operational boundaries outlining that third-party checkout parameters remain dictated by official final store parameters.</li>
            </ul>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="border border-gray-100 p-6 rounded-2xl bg-white shadow-sm flex items-start gap-4">
              <Users className="w-6 h-6 text-sky-500 shrink-0" aria-hidden="true" />
              <div>
                <h3 className="font-bold text-gray-900 mb-1 text-xs md:text-sm">Human Curation Team</h3>
                <p className="text-[11px] md:text-xs text-gray-500">We do not blindly scrape data. Codes are regularly parsed manually to prevent coupon failures at checkouts.</p>
              </div>
            </div>
            <div className="border border-gray-100 p-6 rounded-2xl bg-white shadow-sm flex items-start gap-4">
              <Award className="w-6 h-6 text-[#FFD700] shrink-0" aria-hidden="true" />
              <div>
                <h3 className="font-bold text-gray-900 mb-1 text-xs md:text-sm">Zero Data Commercialization</h3>
                <p className="text-[11px] md:text-xs text-gray-500">Your registered profile dashboard metrics remain strictly encrypted. We protect consumer data sovereignty.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
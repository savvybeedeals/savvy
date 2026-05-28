"use client";

import React from 'react';
import { Scale, AlertCircle, HelpCircle, CheckCircle2 } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-gray-50 py-16 px-6 lg:px-8 font-sans" aria-label="Terms of Service Agreement">
      <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100">
        
        {/* Header Section */}
        <div className="border-b border-gray-100 pb-6 mb-8">
          <div className="flex items-center gap-2 text-sky-500 font-bold uppercase tracking-widest text-xs mb-2">
            <Scale className="w-4 h-4" aria-hidden="true" /> Legal & Terms Agreement
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs text-gray-400 mt-1">Effective Date: May 2026. Outlines comprehensive rules governing our deal platform.</p>
        </div>

        {/* Regulatory Sections */}
        <div className="space-y-8 text-gray-700 text-xs md:text-sm leading-relaxed">
          
          <section>
            <h2 className="text-sm font-black text-gray-900 mb-2 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-green-500" aria-hidden="true" /> 1. Operational Acceptance Criteria
            </h2>
            <p>
              By utilizing Savvy Bee Deals interfaces or engaging with verified coupon card triggers, you enter a binding electronic legal contract to abide by this operational framework. If you do not accept these global interface rules, you are prohibited from utilizing our dashboard scripts or retrieving exclusive promotion paths.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-black text-gray-900 mb-2 uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-red-500" aria-hidden="true" /> 2. Complete Third-Party Liability Disclaimer
            </h2>
            <p>
              Savvy Bee Deals functions solely as a verified aggregate coupon indexer. Promo codes, price points, flash item limitations, and purchase distributions remain completely owned and managed by the target checkout store. We convey no legal warranty, liability, or financial guarantees regarding real-time checkout updates or code exclusions modified by third-party retailers.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-black text-gray-900 mb-2 uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-sky-500" aria-hidden="true" /> 3. Fair Platform Policy & Account Rules
            </h2>
            <p>
              Online platform users are explicitly forbidden from executing structural data scraping routines, deployment of coupon scraping macros, or aiming malicious payloads against our Savvy VIP validation systems. Failure to follow rules results in automatic database access restrictions.
            </p>
          </section>

          <section className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <h3 className="font-bold text-gray-900 mb-1 text-xs md:text-sm">FTC Advertising Compliance Notice</h3>
            <p className="text-gray-500 text-[11px] leading-relaxed">
              In deep coordination with US FTC consumer advertising rules, please assume that select conversion hyperlinks trigger small affiliate balances to our indexing servers. This legal commercial process serves as our primary framework to maintain free high-performance platform utilities for global consumer shoppers without charging premiums.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}
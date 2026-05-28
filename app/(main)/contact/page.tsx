"use client";

import React from 'react';
import { Mail, MapPin, Phone, Info } from 'lucide-react';
import ContactForm from '@/components/forms/contact-form';

export default function ContactUsPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-16 px-6 lg:px-8 font-sans" aria-label="Contact and Legal Inquiry Hub">
      <div className="max-w-5xl mx-auto bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 grid grid-cols-1 lg:grid-cols-12">
        
        {/* Sidebar Data Column */}
        <div className="lg:col-span-5 bg-[#1A1A1A] p-8 md:p-12 text-white flex flex-col justify-between">
          <div className="space-y-6">
            <h1 className="text-2xl font-black uppercase tracking-tight">Get In <span className="text-sky-500">Touch</span></h1>
            <p className="text-xs text-gray-400 leading-relaxed">
              Have inquiries regarding broken deal parameters, partnership onboarding requests, or global data processing opt-outs? Reach out securely.
            </p>
            
            <ul className="space-y-5 text-xs pt-6">
              <li className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-sky-500 shrink-0" aria-hidden="true" />
                <span className="text-gray-300">Global Corporate Hub: US & UK Operations</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-sky-500 shrink-0" aria-hidden="true" />
                <a href="mailto:hello@savvybeedeals.com" className="text-gray-300 hover:text-sky-500 focus:outline-none focus:underline">hello@savvybeedeals.com</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-sky-500 shrink-0" aria-hidden="true" />
                <a href="tel:+15557288923" className="text-gray-300 hover:text-sky-500 focus:outline-none focus:underline">+1 (555) SAVVY-BEE</a>
              </li>
            </ul>
          </div>

          <div className="mt-8 border-t border-gray-800 pt-4 flex items-start gap-2 text-[10px] text-gray-500 uppercase font-bold tracking-wider">
            <Info className="w-4 h-4 text-sky-500 shrink-0" aria-hidden="true" />
            <span>GDPR Subject Access Requests (SAR) are processed within standard regulatory timelines.</span>
          </div>
        </div>

        {/* Contact Form Component Integration */}
        <div className="lg:col-span-7 p-8 md:p-12">
          <ContactForm />
        </div>

      </div>
    </main>
  );
}
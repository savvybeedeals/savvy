"use client";

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      // ربط مباشر مع مسار الـ API المتاح في بنية مشروعك
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 font-sans">
      <div className="space-y-1">
        <label htmlFor="name" className="text-xs font-black uppercase tracking-wider text-gray-700">Full Name</label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full bg-gray-50 border border-gray-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none transition-all"
          placeholder="John Doe"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="email" className="text-xs font-black uppercase tracking-wider text-gray-700">Email Address</label>
        <input
          type="email"
          id="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full bg-gray-50 border border-gray-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none transition-all"
          placeholder="john@example.com"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="subject" className="text-xs font-black uppercase tracking-wider text-gray-700">Inquiry Subject</label>
        <input
          type="text"
          id="subject"
          required
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          className="w-full bg-gray-50 border border-gray-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none transition-all"
          placeholder="Partnership, GDPR request, Broken Code..."
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="message" className="text-xs font-black uppercase tracking-wider text-gray-700">Message Details</label>
        <textarea
          id="message"
          rows={4}
          required
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full bg-gray-50 border border-gray-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none transition-all resize-none"
          placeholder="Write your compliance or support inquiry here..."
        />
      </div>

      {/* حواجز الإشعارات وحالة الإرسال */}
      {status === 'success' && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Your message inside the hive has been recorded! We will respond within 24 hours.</span>
        </div>
      )}

      {status === 'error' && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-800 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>Failed to transmit data. Please check your network or email address parameters.</span>
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-[#1A1A1A] hover:bg-black text-white font-bold py-3 px-6 rounded-xl text-xs uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 shadow-md focus:outline-none focus:ring-2 focus:ring-sky-400"
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-sky-500" />
            Processing Transmission...
          </>
        ) : (
          <>
            <Send className="w-3.5 h-3.5 text-sky-500" />
            Dispatch Message
          </>
        )}
      </button>
    </form>
  );
}
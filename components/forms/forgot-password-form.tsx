"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Mail, Loader2, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      // الرابط اللي هيروح له العميل لما يفتح الإيميل (هنعمل الصفحة دي في الخطوة القادمة)
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (resetError) {
      setError(resetError.message);
    } else {
      setSuccess("Reset link sent! Please check your email inbox. ✉️");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleResetRequest} className="w-full max-w-md p-8 rounded-[2rem] bg-white border border-slate-100 shadow-sm space-y-5">
      <div className="text-center space-y-2">
        <h1 className="text-xl font-black text-slate-900">Forgot Password?</h1>
        <p className="text-xs text-slate-500 font-medium">Enter your email and we'll send you a link to reset your password.</p>
      </div>

      {error && <div className="p-4 text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2"><XCircle size={16} /> {error}</div>}
      {success && <div className="p-4 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2"><CheckCircle2 size={16} /> {success}</div>}

      <div className="space-y-1">
        <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider pl-1">Email Address</label>
        <div className="relative flex items-center">
          <Mail size={15} className="absolute left-4 text-slate-400" />
          <input
            type="email" required placeholder="you@example.com"
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-amber-400"
            value={email} onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <button
        type="submit" disabled={loading}
        className="w-full py-4 bg-slate-950 hover:bg-slate-900 disabled:bg-slate-400 text-white font-black rounded-xl text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition-all"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : "Send Reset Link"}
      </button>

      <p className="text-center text-xs font-bold text-slate-500">
        Remembered it? <Link href="/login" className="text-amber-500 hover:underline">Back to Login</Link>
      </p>
    </form>
  );
}
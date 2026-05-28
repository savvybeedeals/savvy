"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Lock, Loader2, CheckCircle2, XCircle, Eye, EyeOff } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    // تحديث الباسورد في سوبابيز للجلسة الحالية القادمة من رابط الإيميل
    const { error: updateError } = await supabase.auth.updateUser({
      password: password,
    });

    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess("Your password has been reset successfully! Redirecting to home...");
      setTimeout(() => {
        router.push("/");
      }, 3000);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-slate-50/50">
      <form onSubmit={handleUpdatePassword} className="w-full max-w-md p-8 rounded-[2rem] bg-white border border-slate-100 shadow-sm space-y-4">
        <div className="text-center space-y-2">
          <h1 className="text-xl font-black text-slate-900">Create New Password</h1>
          <p className="text-xs text-slate-500 font-medium">Please enter your new strong password below.</p>
        </div>

        {error && <div className="p-4 text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2"><XCircle size={16} /> {error}</div>}
        {success && <div className="p-4 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2"><CheckCircle2 size={16} /> {success}</div>}

        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider pl-1">New Password</label>
          <div className="relative flex items-center">
            <Lock size={15} className="absolute left-4 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"} required placeholder="••••••••"
              className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-amber-400"
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" className="absolute right-4 text-slate-400 hover:text-amber-500" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider pl-1">Confirm New Password</label>
          <div className="relative flex items-center">
            <Lock size={15} className="absolute left-4 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"} required placeholder="••••••••"
              className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-amber-400"
              value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit" disabled={loading}
          className="w-full py-4 bg-slate-950 hover:bg-slate-900 disabled:bg-slate-400 text-white font-black rounded-xl text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition-all"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : "Update Password"}
        </button>
      </form>
    </div>
  );
}
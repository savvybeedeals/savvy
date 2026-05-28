"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2, XCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";
import Link from "next/link"; // استيراد Link للتنقل بين الصفحات

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [globalSuccess, setGlobalSuccess] = useState("");

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorEmail, setErrorEmail] = useState("");

  // الـ Inline Validation الفوري للإيميل
  useEffect(() => {
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorEmail("Invalid email format");
    } else {
      setErrorEmail("");
    }
  }, [formData.email]);

  const handleSocialLogin = async (provider: "google" | "facebook") => {
    setGlobalError("");
    
    // بناء رابط الـ Redirect بشكل آمن وثابت
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
    const redirectUrl = `${origin}/auth/callback`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { 
        redirectTo: redirectUrl,
        // إجبار جوجل والـ Flow على توليد الـ Server Code (PKCE Flow) بشكل صارم
        queryParams: provider === "google" ? {
          access_type: 'offline',
          prompt: 'consent',
        } : undefined
      },
    });
    if (error) setGlobalError(error.message);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError("");
    setGlobalSuccess("");

    if (errorEmail) {
      setGlobalError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (authError) {
      setGlobalError(authError.message);
      setLoading(false);
    } else {
      setGlobalSuccess("Welcome back to the Hive! 🐝");
      setTimeout(() => { router.push("/"); router.refresh(); }, 1500);
    }
  };

  return (
    <form onSubmit={handleLogin} className="w-full max-w-md p-8 rounded-[2rem] bg-white border border-slate-100 shadow-sm space-y-4 relative z-10">
      {globalError && <div className="p-4 text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2"><XCircle size={16} /> {globalError}</div>}
      {globalSuccess && <div className="p-4 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2"><CheckCircle2 size={16} /> {globalSuccess}</div>}

      {/* 🌟 تم التعديل: تقسيم الأزرار لعمودين فقط وحذف Apple ID */}
      <div className="grid grid-cols-2 gap-3">
        <button 
          type="button" 
          onClick={() => handleSocialLogin("google")} 
          className="py-3.5 bg-white border border-slate-200 rounded-xl flex flex-col items-center justify-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-slate-700 hover:bg-slate-50 shadow-sm cursor-pointer transition-all"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.61c-.29 1.53-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-8.58z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.11 0-5.74-2.11-6.68-4.96H1.21v3.15C3.18 21.88 7.31 24 12 24z"/>
            <path fill="#FBBC05" d="M5.32 14.24A7.16 7.16 0 0 1 4.95 12c0-.79.13-1.57.37-2.31V6.54H1.21A11.94 11.94 0 0 0 0 12c0 1.92.45 3.74 1.21 5.46l4.11-3.22z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.18 2.12 1.21 5.54l4.11 3.22c.94-2.85 3.57-4.96 6.68-4.96z"/>
          </svg>
          Google
        </button>
        <button 
          type="button" 
          onClick={() => handleSocialLogin("facebook")} 
          className="py-3.5 bg-white border border-slate-200 rounded-xl flex flex-col items-center justify-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-slate-700 hover:bg-slate-50 shadow-sm cursor-pointer transition-all"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Facebook
        </button>
      </div>

      {/* الخط الفاصل */}
      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t border-slate-200"></div>
        <span className="flex-shrink mx-4 text-slate-400 text-[10px] font-black uppercase tracking-wider">Or Continue With</span>
        <div className="flex-grow border-t border-slate-200"></div>
      </div>

      {/* حقول الإدخال التقليدية */}
      <div className="space-y-1">
        <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider pl-1">Email Address</label>
        <div className="relative flex items-center">
          <Mail size={15} className="absolute left-4 text-slate-400" />
          <input
            type="email" required placeholder="you@example.com"
            className={`w-full pl-11 pr-4 py-3 bg-slate-50 border ${errorEmail ? "border-red-400" : "border-slate-200 focus:border-amber-400"} rounded-xl text-sm font-semibold focus:outline-none`}
            value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        {errorEmail && <p className="text-[10px] text-red-500 font-bold pl-1">{errorEmail}</p>}
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider pl-1">Password</label>
        <div className="relative flex items-center">
          <Lock size={15} className="absolute left-4 text-slate-400" />
          <input
            type={showPassword ? "text" : "password"} required placeholder="••••••••"
            className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-amber-400"
            value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <button type="button" className="absolute right-4 text-slate-400 hover:text-amber-500" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        
        {/* زر "نسيت كلمة المرور" */}
        <div className="flex justify-end pt-0.5 pr-1">
          <Link 
            href="/forgot-password" 
            className="text-[11px] font-bold text-slate-400 hover:text-amber-500 transition-colors"
          >
            Forgot Password?
          </Link>
        </div>
      </div>

      <button
        disabled={loading} type="submit"
        className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-black text-xs tracking-widest uppercase italic flex items-center justify-center gap-2 shadow-sm cursor-pointer hover:bg-slate-800 transition-all"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : "Sign In"}
      </button>

      {/* 🌟 تم الإضافة: رابط التسجيل الجديد في أسفل الفورم */}
      <div className="text-center pt-2">
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
          Don&apos;t have an account yet?{" "}
          <Link href="/register" className="text-amber-500 hover:text-amber-600 transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </form>
  );
}
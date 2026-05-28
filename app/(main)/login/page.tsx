"use client";

import React from "react";
import LoginForm from "@/components/forms/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-[90vh] bg-gradient-to-br from-zinc-50 via-slate-100 to-zinc-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* دوائر ضوئية عملاقة فنية بالخلفية لجمال التصميم */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-amber-200/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-sky-200/30 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="text-center mb-6 relative z-10">
        <span className="text-3xl">🔑</span>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 mt-2">Welcome Back</h1>
        <p className="text-slate-500 text-xs font-semibold mt-1">Sign in to your Savvy Bee dashboard.</p>
      </div>

      <LoginForm />
    </div>
  );
}
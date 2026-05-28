"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";

export default function DeleteAccountForm() {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setLoading(true);
    setError("");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setError("Session expired. Please log in again.");
        setLoading(false);
        return;
      }

      // 🔥 هنا التعديل: تم تغيير المسار ليتطابق مع اقتراحك الذكي المباشر
      const response = await fetch("/api/delete-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong");
      }

      // تسجيل الخروج محلياً وتوجيه الزائر للصفحة الرئيسية كزائر جديد
      await supabase.auth.signOut();
      window.location.href = "/";
    } catch (err: any) {
      setError(err.message || "Failed to delete account");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl p-6 rounded-[2rem] bg-red-50/40 border border-red-100 space-y-4">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-red-100 text-red-600 rounded-xl mt-0.5">
          <AlertTriangle size={18} />
        </div>
        <div className="space-y-1">
          <h3 className="text-xs font-black text-red-950 uppercase tracking-wider">Danger Zone</h3>
          <p className="text-xs text-red-700 font-medium leading-relaxed">
            Deleting your account is permanent. This action will erase your profile and all saved coupons from the Hive instantly.
          </p>
        </div>
      </div>

      {error && <p className="text-[11px] font-bold text-red-600 pl-1">{error}</p>}

      {!showConfirm ? (
        <button
          type="button"
          onClick={() => setShowConfirm(true)}
          className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-black text-[10px] tracking-widest uppercase italic rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
        >
          <Trash2 size={14} /> Delete My Account
        </button>
      ) : (
        <div className="pt-2 space-y-3">
          <p className="text-xs font-bold text-red-950">Are you absolutely sure? This cannot be undone.</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={handleDelete}
              className="px-5 py-2.5 bg-red-700 hover:bg-red-800 disabled:bg-slate-400 text-white font-black text-[10px] tracking-wider uppercase rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : "Confirm Delete"}
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => setShowConfirm(false)}
              className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-black text-[10px] tracking-wider uppercase rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
"use client";

import React, { useState, useEffect } from "react";
import { X, User, Loader2, CheckCircle, AlertCircle, ShieldAlert, Settings } from "lucide-react";
import DeleteAccountForm from "@/components/forms/delete-account-form";
import { useAuth } from "@/context/auth-context";
import { supabase } from "@/lib/supabase";

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = "profile" | "danger";

export default function ProfileSettingsModal({ isOpen, onClose }: ProfileSettingsModalProps) {
  const { user } = useAuth();
  
  // حالة التحكم في التبويب النشط (الافتراضي تعديل البيانات)
  const [activeTab, setActiveTab] = useState<TabType>("profile");

  // حالات إدارة حقول الإدخال
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  
  // حالات إدارة الحفظ والعمليات
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // مزامنة جلب البيانات الحالية للمستخدم فور فتح الـ Popup من جدول profiles المستقر منعاً لأي تضارب
  useEffect(() => {
    const fetchLatestProfileData = async () => {
      if (user && isOpen) {
        try {
          const { data: stableProfile } = await supabase
            .from('profiles')
            .select('first_name, last_name, phone_number')
            .eq('id', user.id)
            .single();

          setFirstName(stableProfile?.first_name || user.user_metadata?.first_name || user.user_metadata?.full_name?.split(" ")[0] || "");
          setLastName(stableProfile?.last_name || user.user_metadata?.last_name || user.user_metadata?.full_name?.split(" ")[1] || "");
          setPhoneNumber(stableProfile?.phone_number || user.user_metadata?.phone_number || user.phone || "");
        } catch (err) {
          console.error("Error loading profile fields inside modal:", err);
          // Fallback في حال حدوث تضارب
          setFirstName(user.user_metadata?.first_name || user.user_metadata?.full_name?.split(" ")[0] || "");
          setLastName(user.user_metadata?.last_name || user.user_metadata?.full_name?.split(" ")[1] || "");
          setPhoneNumber(user.user_metadata?.phone_number || user.phone || "");
        }
        setSuccessMessage("");
        setErrorMessage("");
        setActiveTab("profile"); // إرجاعه الافتراضي عند الفتح مجدداً
      }
    };

    fetchLatestProfileData();
  }, [user, isOpen]);

  if (!isOpen) return null;

  // dالة التعامل مع إرسال وحفظ البيانات في سوبابيز للجدولين معاً لضمان المزامنة الكاملة
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      if (!user?.id) throw new Error("User session not found");

      const fullName = `${firstName} ${lastName}`.trim();

      // 1. تحديث بيانات الـ user_metadata داخل Auth في سوبابيز بشكل مباشر وآمن
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          first_name: firstName,
          last_name: lastName,
          full_name: fullName,
          phone_number: phoneNumber,
        }
      });

      if (authError) throw authError;

      // 2. تحديث البيانات داخل جدول الـ profiles لضمان المزامنة التامة في قاعدة البيانات
      const { error: profilesError } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber,
        })
        .eq('id', user.id);

      if (profilesError) throw profilesError;

      setSuccessMessage("Your profile information has been updated successfully!");
      
      // عمل إنعاش خفيف للصفحة بعد ثانيتين لتحديث العرض العام للحساب تلقائياً
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error: any) {
      console.error("Error updating profile:", error);
      setErrorMessage(error.message || "An error occurred while saving. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      {/* عرض فخم بنظام كارت عريض يتسع لعمودين مريحين للمستخدم */}
      <div className="bg-white rounded-[2.5rem] w-full max-w-4xl shadow-2xl relative border border-slate-100 max-h-[85vh] overflow-hidden flex flex-col md:flex-row">
        
        {/* زر الإغلاق العلوي المطلق */}
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors cursor-pointer z-10"
        >
          <X size={20} />
        </button>
        
        {/* العمود الأول: القائمة الجانبية (Sidebar Tabs) */}
        <div className="w-full md:w-64 bg-slate-50 p-6 pt-8 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col shrink-0">
          <div className="flex items-center gap-2 mb-8 px-2">
            <Settings size={18} className="text-slate-700 animate-spin-slow" />
            <h2 className="text-sm font-[1000] text-slate-900 uppercase tracking-wider">
              Settings Hub
            </h2>
          </div>

          <nav className="space-y-1.5 flex-1">
            {/* زر تبويب تعديل الملف الشخصي */}
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer text-left ${
                activeTab === "profile"
                  ? "bg-white text-sky-600 shadow-sm border border-slate-100"
                  : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900"
              }`}
            >
              <User size={16} className={activeTab === "profile" ? "text-sky-500" : "text-slate-400"} />
              <span>Edit Profile Info</span>
            </button>

            {/* زر تبويب منطقة الخطر (حذف الحساب) */}
            <button
              onClick={() => setActiveTab("danger")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer text-left ${
                activeTab === "danger"
                  ? "bg-red-50 text-red-600 shadow-sm border border-red-100"
                  : "text-slate-600 hover:bg-red-50/40 hover:text-red-600"
              }`}
            >
              <ShieldAlert size={16} className={activeTab === "danger" ? "text-red-500" : "text-slate-400"} />
              <span>Danger Zone</span>
            </button>
          </nav>
        </div>

        {/* العمود الثاني: لوحة عرض النتائج (Content Area) */}
        <div className="flex-1 p-6 sm:p-8 overflow-y-auto max-h-[60vh] md:max-h-[85vh]">
          {activeTab === "profile" ? (
            /* النتيجة الأولى: فورم تعديل الحساب الشخصي */
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  Edit Profile Info
                </h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Modify your profile metadata info such as first name, last name, and phone number.
                </p>
              </div>

              {/* رسائل التنبيه والنجاح */}
              {successMessage && (
                <div className="flex items-center gap-2 p-4 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-2xl">
                  <CheckCircle size={16} className="text-emerald-600 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {errorMessage && (
                <div className="flex items-center gap-2 p-4 text-xs font-bold text-red-800 bg-red-50 border border-red-100 rounded-2xl">
                  <AlertCircle size={16} className="text-red-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* حقل الاسم الأول */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase text-slate-500 tracking-wider px-1">First Name</label>
                    <input 
                      type="text" 
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-sky-500 transition-colors shadow-sm"
                      placeholder="Enter your first name"
                    />
                  </div>

                  {/* hقل اسم العائلة */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase text-slate-500 tracking-wider px-1">Last Name</label>
                    <input 
                      type="text" 
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-sky-500 transition-colors shadow-sm"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                {/* حقل رقم الهاتف */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase text-slate-500 tracking-wider px-1">Phone Number</label>
                  <input 
                    type="tel" 
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-sky-500 transition-colors shadow-sm"
                    placeholder="Enter your phone number"
                  />
                </div>

                {/* زر حفظ التعديلات */}
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer select-none"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Saving Changes...</span>
                      </>
                    ) : (
                      <span>Save Changes</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* النتيجة الثانية: فورم حذف الحساب المباشر */
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-base font-black text-red-600 uppercase tracking-wider flex items-center gap-2">
                  Danger Zone
                </h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Actions here are permanent and cannot be reversed. Proceed with caution.
                </p>
              </div>
              
              <div className="p-6 bg-red-50/50 rounded-3xl border border-red-100/70">
                <DeleteAccountForm />
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
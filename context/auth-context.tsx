"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { useRouter, usePathname } from "next/navigation"; // 1. استيراد أدوات التوجيه

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  loading: true,
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();   // 2. تفعيل الـ Router لتوجيه العميل
  const pathname = usePathname(); // 3. تفعيل الـ Pathname لمعرفة الصفحة الحالية

  useEffect(() => {
    // 1. التحقق من الجلسة الحالية عند تحميل الموقع لأول مرة
    const bootstrapAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.warn("Supabase auth session temporary bypass:", error);
      } finally {
        setLoading(false);
      }
    };

    bootstrapAuth();

    // 2. الاستماع لأي تغيير في حالة الـ Auth تلقائياً
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);

      // 🔥 المنطق الجديد: التحقق من تسجيل الخروج (التلقائي أو اليدوي)
      if (event === "SIGNED_OUT") {
        if (pathname === "/") {
          // إذا كان العميل في الصفحة الرئيسية بالفعل -> نعمل إعادة تحميل للصفحة
          window.location.reload();
        } else {
          // إذا كان في أي صفحة أخرى -> نوجهه فوراً للصفحة الرئيسية
          router.push("/");
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [pathname, router]); // 4. إضافة pathname و router كمراقبين داخل الـ Dependency Array

  const logout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
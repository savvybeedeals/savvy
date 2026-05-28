"use client";

import { Geist, Geist_Mono } from "next/font/google"; 
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/context/auth-context";

// إعداد الخطوط لضمان مظهر احترافي ومتناسق لمشروع Savvy Bee
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  
  // التعديل: التحقق إذا كان المسار يبدأ بـ /admin ليتوافق مع مجلد app/admin
  const isStudio = pathname?.startsWith("/admin");

  return (
    <html 
      lang="en" 
      className="scroll-smooth" 
      data-scroll-behavior="smooth" 
      suppressHydrationWarning
    > 
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-50 text-slate-900 min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        {/* تغليف الموقع بالكامل بـ AuthProvider الخاص بـ Supabase لمراقبة فك الكوبونات */}
        <AuthProvider>
          {/* 1. الهيدر: يظهر فقط في صفحات المستخدم العادي ولا يظهر في Sanity Studio */}
          {!isStudio && <Header />} 

          {/* 2. محتوى الصفحات المتغير (Main Content) */}
          {/* تم استخدام flex-grow لضمان بقاء الفوتر في الأسفل دائماً */}
          <main className="flex-grow">
            {children}
          </main>

          {/* 3. الفوتر: يظهر فقط في صفحات المستخدم العادي */}
          {!isStudio && <Footer />}
        </AuthProvider>
      </body>
    </html>
  );
}
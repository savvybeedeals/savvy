import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google"; 
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
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

// [SEO 2026] ضبط الـ Viewport لضمان سرعة الاستجابة وإمكانية الوصول الكاملة
export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5, 
};

// [SEO 2026] كائن الـ Metadata العالمي المتكامل والمضبوط برمجياً لموقع Savvy Bee Deals
export const metadata: Metadata = {
  metadataBase: new URL("https://savvybeedeals.com"), 
  
  title: {
    template: "%s | Savvy Bee Deals",
    default: "Savvy Bee Deals | Best Coupons, Promo Codes & Discounts", 
  },
  description: "Save money with the best coupons, promo codes, discount vouchers, and daily deals from top brands globally at Savvy Bee Deals.",
  
  keywords: [
    "coupons", "promo codes", "discount vouchers", "daily deals", 
    "online shopping offers", "save money", "best discounts 2026",
    "Amazon coupons", "Walmart promo codes", "verified discount codes"
  ],

  authors: [{ name: "Savvy Bee Deals Team" }],
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://savvybeedeals.com",
    siteName: "Savvy Bee Deals",
    title: "Savvy Bee Deals | Best Coupons, Promo Codes & Discounts",
    description: "Save money with the best coupons, promo codes, discount vouchers, and daily deals from top brands globally.",
    images: [
      {
        url: "/images/og-default.jpg", 
        width: 1200,
        height: 630,
        alt: "Savvy Bee Deals - Your Ultimate Coupon & Promo Codes Platform",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Savvy Bee Deals | Best Coupons, Promo Codes & Discounts",
    description: "Save money with the best coupons, promo codes, and daily deals from top brands.",
    images: ["/images/og-default.jpg"],
    creator: "@SavvyBeeDeals",
  },

icons: {
  icon: "/favicon.ico",
  apple: "/apple-touch-icon.png", 
},};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
          {/* الهيدر والفوتر يعملان هنا بشكل طبيعي على كامل الموقع مع فحص داخلي لـ /admin لضمان استقرار التصميم */}
          <Header /> 

          {/* محتوى الصفحات المتغير (Main Content) */}
          <main className="flex-grow">
            {children}
          </main>

          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
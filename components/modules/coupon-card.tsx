"use client";
import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, X, Info, ExternalLink, Ticket, Tag, TrendingUp, CheckCircle2, Clock, Lock, UserPlus, LogIn, Sparkles, Copy, Check, Star, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from "@/sanity/lib/image";
import { updateCouponStats, saveUserCoupon } from "@/services/coupon-service"; // تم استيراد دالة الحفظ
// استيراد الـ Auth Context لقراءة حالة تسجيل الدخول الحقيقية
import { useAuth } from "@/context/auth-context";

interface CouponProps {
  coupon: {
    _id: string;
    title: string;
    code: string;
    discount: string;
    expiryDate?: string;
    isVip?: boolean;
    affiliateUrl?: string;
    type?: 'Code' | 'Deal';
    usersCount?: number;
    rating?: number;
    reviewsCount?: number;
    store?: {
      name: string;
      logo: any;
      slug: { current: string };
    };
  };
}

const CouponCard: React.FC<CouponProps> = ({ coupon }) => {
  const {
    _id,
    title,
    code,
    discount,
    expiryDate,
    isVip,
    affiliateUrl = "#",
    type = "Code",
    usersCount = 502,
    rating = 4.7,
    reviewsCount = 150,
    store
  } = coupon;

  const [showPopup, setShowPopup] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [userRating, setUserRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);

  // جلب بيانات العميل الحالية من الـ Context الديناميكي للموقع
  const { user } = useAuth();

  // إذا كان الـ user موجوداً ومسجلاً فعلياً، ستصبح القيمة true تلقائياً
  const isLoggedIn = !!user;

  const handleGetCode = async () => {
    if (isVip && !isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    await updateCouponStats(_id, 'usage');

    // 🔥 التعديل الجديد: حفظ الكوبون في البروفايل للعميل الحالي بمجرد الضغط
    if (isLoggedIn && user?.id) {
      await saveUserCoupon(user.id, _id);
    }

    setShowPopup(true);
  };

  const handleCopyOnly = (e: React.MouseEvent) => {
    e.preventDefault();
    // منع السلوك الافتراضي للرابط للتحكم في التوقيت
    navigator.clipboard.writeText(code);
    setCopied(true);

    // يرى المستخدم أنه تم النسخ ثم يتم التوجيه بعد 800 مللي ثانية فقط
    setTimeout(() => {
      setCopied(false);
      window.open(affiliateUrl, '_blank');
    }, 800);
  };

  const handleRating = async (star: number) => {
    setUserRating(star);
    await updateCouponStats(_id, 'rating', star);
  };

  const storeName = store?.name || "Store";
  const storeSlug = store?.slug?.current || "";

  return (
    <>
      {/* Main Card - Increased padding from py-4 to py-6 and gap from 3 to 5 */}
      <div className={`relative bg-white rounded-[2.5rem] px-6 py-6 border-2 transition-all duration-300 flex items-center gap-5 shadow-sm hover:shadow-xl group overflow-visible
        ${isVip 
          ? 'border-[#FFD700] bg-gradient-to-r from-white to-[#FFD700]/5' 
          : 'border-sky-100 hover:border-sky-300 shadow-sky-50' 
        }`}>
      
        <div className="absolute -left-[11px] top-1/2 -translate-y-1/2 w-5 h-10 bg-[#F8F9FA] rounded-full border-r-2 border-inherit z-10"></div>
        <div className="absolute -right-[11px] top-1/2 -translate-y-1/2 w-5 h-10 bg-[#F8F9FA] rounded-full border-l-2 border-inherit z-10"></div>

        {isVip && (
          <div className="absolute -top-4 -left-2 z-20 scale-100">
            <div className="absolute inset-0 bg-[#FFD700] rounded-full blur-lg opacity-30 animate-pulse"></div>
            <div className="relative bg-[#FFD700] text-black px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1.5 border-2 border-white overflow-hidden">
              <span className="text-base">🐝</span>
              <div className="flex flex-col leading-none">
                <span className="text-[7px] font-black uppercase tracking-tighter opacity-80">Savvy</span>
                <span className="text-[11px] font-black uppercase italic">VIP</span>
              </div>
              <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 animate-[shimmer_2s_infinite]"></div>
            </div>
          </div>
        )}

        <div className="flex flex-col items-center gap-2 shrink-0">
          {/* Increased logo size from w-20 h-20 to w-20 h-20 */}
          <div className={`w-20 h-20 rounded-full flex items-center justify-center overflow-hidden shadow-sm border-2 border-gray-50 bg-white group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300`}>
            {store?.logo ? (
              <Image 
                src={urlFor(store.logo).url()} 
                alt={storeName} 
                width={80} 
                height={80} 
                className="object-contain p-2.5"
              />
            ) : (
              <span className="text-2xl font-black text-slate-300">{storeName.charAt(0)}</span>
            )}
          </div>
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${type === 'Code' ? 'bg-amber-100 text-amber-700' : 'bg-sky-100 text-sky-700'}`}>
            {type === 'Code' ? <Ticket size={10} /> : <Tag size={10} />}
            {type}
          </div>
        </div>

        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-2.5 mb-1">
            {/* Increased discount text size from text-2xl to text-2xl */}
            <span className="text-2xl font-black text-black tracking-tight whitespace-nowrap">{discount}</span>
            <div className="flex items-center gap-1.5 overflow-hidden">
              <span className="text-sky-500 font-black text-[10px] uppercase tracking-widest bg-sky-50 px-2.5 py-1 rounded-full border border-sky-100 truncate">
                {storeName}
              </span>
              <div className="flex items-center gap-0.5 text-[#FFD700] shrink-0">
                <Star size={12} fill="#FFD700" />
                <span className="text-[11px] font-black text-gray-800">{rating}</span>
              </div>
            </div>
          </div>
          {/* Increased title size from text-[15px] to text-[15px] */}
          <h3 className="text-[15px] font-bold text-gray-700 leading-tight line-clamp-2 group-hover:text-black transition-colors">
            {title}
          </h3>
          
          <div className="flex flex-wrap items-center gap-2.5 mt-3 pt-3 border-t border-gray-50">
              <div className="flex items-center gap-1.5 bg-green-50 px-2 py-1 rounded-md border border-green-100">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span> 
                <span className="text-green-600 text-[9px] font-black uppercase whitespace-nowrap">Verified</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[11px] whitespace-nowrap">
                <TrendingUp size={12} />
                <span>{usersCount}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-400 font-bold text-[10px] italic hidden sm:flex">
                <Clock size={11} />
                <span className="truncate">{expiryDate || 'Soon'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-400 font-bold text-[10px] whitespace-nowrap">
                <CheckCircle2 size={12} className="text-emerald-500" />
                <span>Worked recently</span>
              </div>
          </div>
        </div>

        {/* Increased min-width of button section for better visual balance */}
        <div className="flex flex-col items-center gap-2.5 shrink-0 min-w-[125px]">
          <button 
            onClick={handleGetCode}
            className={`w-full py-3.5 rounded-[1.2rem] font-black text-[13px] transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 ${isVip ? 'bg-[#FFD700] hover:bg-black hover:text-[#FFD700] text-black' : 'bg-[#1A1A1A] hover:bg-sky-600 text-white'}`}
          >
            {isVip && !isLoggedIn && <Lock size={14} />}
            {isVip && !isLoggedIn ? 'UNLOCK' : 'GET CODE'}
          </button>
          
          <Link 
            href={`/stores/${storeSlug}`} 
            className="text-[11px] font-black text-sky-500 hover:text-sky-700 transition-colors flex items-center gap-1 group/link"
          >
            Store Page
            <ExternalLink size={11} className="group-hover/link:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div 
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md cursor-pointer"
          onClick={() => setShowLoginModal(false)}
        >
          <div 
            className="bg-white rounded-[2.5rem] w-full max-w-md p-8 relative shadow-2xl animate-in fade-in zoom-in duration-300 border-4 border-[#FFD700] cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setShowLoginModal(false)} className="absolute right-6 top-6 text-gray-400 hover:text-black transition-colors">
              <X size={24} />
            </button>
            <div className="text-center">
              <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-[#FFD700]">
                <span className="text-4xl">🐝</span>
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">Members Only!</h2>
              <p className="text-gray-500 font-medium mb-8">
                This is a <span className="text-[#FFB800] font-bold underline">Savvy VIP</span> coupon. Create a free account to unlock exclusive high-value deals.
              </p>
              <div className="flex flex-col gap-4">
                <Link href="/register" className="flex items-center justify-center gap-3 w-full bg-[#1A1A1A] text-white py-4 rounded-2xl font-black text-lg hover:bg-black transition-all shadow-xl shadow-gray-200">
                  <UserPlus size={20} /> Join Savvy Bee Free
                </Link>
                <Link href="/login" className="flex items-center justify-center gap-3 w-full bg-white text-black py-4 rounded-2xl font-black text-lg border-2 border-gray-100 hover:border-gray-300 transition-all">
                  <LogIn size={20} /> Sign In
                </Link>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">
                  Unlock 500+ Premium Coupons Daily
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Coupon Popup */}
      {showPopup && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl transition-all cursor-pointer"
          onClick={() => setShowPopup(false)}
        >
          <div 
            className={`bg-white rounded-[3.5rem] w-full max-w-2xl overflow-hidden relative shadow-[0_0_100px_rgba(255,215,0,0.15)] animate-in fade-in zoom-in duration-500 border-b-[12px] ${isVip ? 'border-[#FFD700]' : 'border-sky-500'} cursor-default`}
            onClick={(e) => e.stopPropagation()}
          >
            
            <div className={`relative pt-12 pb-8 px-10 text-center ${isVip ? 'bg-gradient-to-b from-[#FFD700]/10 to-white' : 'bg-gradient-to-b from-sky-50 to-white'}`}>
              <button 
                onClick={() => setShowPopup(false)} 
                className="absolute right-8 top-8 w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center text-gray-400 hover:text-black hover:rotate-90 transition-all z-50 border border-gray-100"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col items-center gap-4">
                <div className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${isVip ? 'bg-[#FFD700] text-black' : 'bg-black text-white'}`}>
                  {isVip ? <Sparkles size={14} /> : <Ticket size={14} />}
                  {isVip ? 'Savvy VIP Deal Unlocked' : 'Verified Coupon Code'}
                </div>
                <h2 className="text-4xl font-black text-gray-900 leading-[1.1] tracking-tight">
                  {discount} <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-400">OFF</span> AT {storeName}
                </h2>
                <p className="text-gray-500 font-bold max-w-md mx-auto leading-relaxed">
                  {title}
                </p>
              </div>
            </div>

            <div className="px-10 pb-12">
              <a 
                href={affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleCopyOnly}
                className="relative group block cursor-pointer"
              >
                <div className={`absolute -inset-1 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 ${isVip ? 'bg-[#FFD700]' : 'bg-sky-400'}`}></div>
                
                <div className="relative flex items-center justify-between bg-gray-50 border-2 border-dashed border-gray-200 p-3 rounded-[2rem] hover:border-amber-400 hover:bg-white transition-all">
                  <div className="flex flex-col ml-8">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                       {copied ? "Copy Successful! Redirecting..." : "Click to Copy & Visit"}
                    </span>
                    <span className={`text-4xl font-black tracking-[0.15em] ${isVip ? 'text-amber-600' : 'text-gray-800'}`}>
                      {code}
                    </span>
                  </div>
                  
                  <div className={`flex items-center gap-3 px-8 py-5 rounded-[1.5rem] font-black text-xl transition-all shadow-xl shadow-amber-100/50 ${copied ? 'bg-green-500 text-white min-w-[180px] justify-center' : 'bg-[#1A1A1A] text-white group-hover:bg-[#FFD700] group-hover:text-black'}`}>
                    {copied ? <Check size={24} strokeWidth={3} /> : <Copy size={24} />}
                    {copied ? 'COPIED!' : 'COPY'}
                  </div>
                </div>
              </a>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <a 
                  href={affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-lg transition-all shadow-xl shadow-sky-100/50 active:scale-95 ${isVip ? 'bg-white border-2 border-amber-400 text-gray-900 hover:bg-amber-50' : 'bg-sky-500 text-white hover:bg-sky-600'}`}
                >
                  Visit {storeName} <ExternalLink size={20} />
                </a>
                
                <div className="flex flex-col justify-center bg-amber-50/50 border border-amber-100 px-6 py-4 rounded-2xl transition-all">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-amber-800 font-black text-[11px] uppercase tracking-wider">
                      {userRating > 0 ? "Thanks for rating!" : "Did it work?"}
                    </span>
                    {userRating > 0 && (
                      <span className="text-green-600 font-black text-[9px] flex items-center gap-1 animate-bounce">
                        <Check size={10} /> Saved
                      </span>
                    )}
                  </div>
                  
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => handleRating(star)}
                        className="transition-all duration-200 transform active:scale-125"
                      >
                        <Star 
                          size={24} 
                          fill={(hoverRating || userRating) >= star ? "#FFB800" : "transparent"} 
                          className={(hoverRating || userRating) >= star ? "text-[#FFB800] drop-shadow-sm" : "text-amber-200"}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Troubleshooting Alert */}
              <div className="mt-6 flex items-start gap-3 p-4 bg-amber-50/30 border border-amber-100/50 rounded-2xl">
                <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1 text-left">
                  <p className="text-[12px] font-black text-amber-900 uppercase tracking-tight">Trouble Redirecting?</p>
                  <p className="text-[11px] font-medium text-amber-700 leading-normal">
                    Some browser extensions or <b>Ad-Blockers</b> may prevent our store links from opening. For the best experience, please disable them or add our site to your whitelist.
                  </p>
                </div>
              </div>

              {/* Footer Info with Fixed Rating Formatting */}
              <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] font-black text-gray-400 uppercase tracking-widest border-t border-gray-50 pt-8">
                <div className="flex items-center gap-2 bg-green-50 text-green-600 px-3 py-1 rounded-full border border-green-100">
                  <CheckCircle2 size={12} />
                  Tested & Verified 2 hours ago
                </div>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 whitespace-nowrap"><TrendingUp size={14} /> {usersCount} Uses Today</span>
                  
                  <div className="flex items-center flex-row gap-1 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-[#FFB800]">
                      <Star size={12} fill="#FFB800" />
                      <span className="text-gray-900">{rating}</span>
                    </div>
                    <span className="text-gray-400 text-[9px] lowercase ml-0.5">({reviewsCount} reviews)</span>
                  </div>
                  
                  <button className="hover:text-black flex items-center gap-1 whitespace-nowrap">Details <Info size={14} /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
      `}</style>
    </>
  );
};

export default CouponCard;
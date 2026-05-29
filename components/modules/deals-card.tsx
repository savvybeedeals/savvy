"use client";
import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, X, Info, ExternalLink, Ticket, Tag, TrendingUp, CheckCircle2, Clock, Lock, UserPlus, LogIn, Sparkles, Copy, Check, Star, Zap, MousePointerClick } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/auth-context';
import { urlFor } from '@/sanity/lib/image';
import { saveUserDeal } from '@/services/deals-service';

interface DealProps {
  _id?: string;
  id?: string;
  dealId?: string; // 🔥 تغطية إضافية لالتقاط المعرف
  deal?: any;      // 🔥 لتغطية احتمالية تمرير العرض ككائن كامل من الصفحة الأب
  storeName: string;
  storeLogo: any;
  discount: string;
  title: string;
  secondTitle?: string; 
  description?: string; 
  isVip?: boolean;
  expiryDate?: string;
  usersCount?: number;
  affiliateUrl?: string;
  storeSlug?: string;
  type?: 'Code' | 'Deal';
  rating?: number;
  reviewsCount?: number;
}

const DealCard: React.FC<DealProps> = (props) => {
  const { 
    _id, id, dealId, deal, storeName, storeLogo, discount, title, secondTitle, description, isVip, expiryDate, usersCount, affiliateUrl = "#", storeSlug, type = "Deal",
    rating = 4.7, reviewsCount = 150
  } = props;

  const [showPopup, setShowPopup] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  const [userRating, setUserRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);

  const { user } = useAuth();
  const isLoggedIn = !!user;

  // 🔥 استخراج المعرف بذكاء من أي خاصية تم تمريرها لضمان عدم ضياع الـ ID
  const validDealId = _id || id || dealId || deal?._id || deal?.id;

  const handleGetDeal = async () => {
    if (isVip && !isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    // حفظ العرض في بروفايل المستخدم إذا كان مسجلاً وهناك ID فعلي
    if (isLoggedIn && user?.id && validDealId) {
      await saveUserDeal(user.id, validDealId);
    } else if (isLoggedIn && !validDealId) {
      console.warn("Deal ID is missing! Cannot save to profile.");
    }

    setShowPopup(true);
  };

  const finalSlug = (storeSlug || storeName || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-');

  return (
    <>
      {/* الكرت الرئيسي */}
      <div className={`group relative bg-white rounded-[2rem] p-4 border-2 transition-all duration-300 flex flex-col sm:flex-row items-center gap-5 shadow-sm hover:shadow-xl overflow-visible
        ${isVip 
          ? 'border-[#FFD700] bg-gradient-to-r from-white to-[#FFD700]/5' 
          : 'border-gray-100 hover:border-sky-200' 
        }`}>
        
        {/* شارة الـ VIP */}
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
        
        {/* 1. اللوجو الجانبي */}
        <div className="relative shrink-0 w-20 h-20 bg-[#F8F9FA] rounded-2xl flex items-center justify-center border border-gray-50 overflow-hidden group-hover:bg-white transition-colors">
          {storeLogo ? (
            <Image 
              src={urlFor(storeLogo).url()} 
              alt={storeName}
              fill
              sizes="80px"
              priority={isVip}
              className="object-contain p-2 transform group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <span className="text-xl font-black text-slate-400">{storeName.charAt(0)}</span>
          )}
        </div>

        {/* 2. منطقة النص (العنوان والوصف) */}
        <div className="flex-grow min-w-0 flex flex-col gap-1 text-center sm:text-left w-full">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="text-sky-500 font-black text-[10px] uppercase tracking-widest bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100">
              {storeName}
            </span>
            <div className="flex items-center gap-0.5 text-[#FFD700] shrink-0">
              <Star size={10} fill="#FFD700" />
              <span className="text-[10px] font-black text-gray-700">{rating}</span>
            </div>
          </div>

          <h3 className="text-base font-black text-gray-900 leading-tight truncate group-hover:text-sky-600 transition-colors">
            {title}
          </h3>
          
          <p className="text-[11px] font-medium text-gray-500 line-clamp-1 leading-relaxed">
            {description || `Grab this exclusive discount at ${storeName}. Limited time offer for Savvy Bee users.`}
          </p>

          <div className="flex items-center justify-center sm:justify-start gap-3 mt-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
            <div className="flex items-center gap-1.5 bg-green-50 px-2 py-0.5 rounded-md border border-green-100">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span> 
              <span className="text-green-600 font-black uppercase whitespace-nowrap">Verified</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp size={10} className="text-emerald-500" />
              <span>{usersCount || 502} Used</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={10} />
              <span>{expiryDate || 'Limited'}</span>
            </div>
          </div>
        </div>

        {/* 3. منطقة السعر والزر */}
        <div className="shrink-0 flex flex-col items-center sm:items-end gap-2 border-t sm:border-t-0 sm:border-l border-gray-100 pt-4 sm:pt-0 sm:pl-5 w-full sm:w-auto sm:min-w-[120px]">
          <div className="flex flex-col items-center sm:items-end leading-none">
            <span className="text-2xl font-black text-black tracking-tighter">{discount}</span>
          </div>

          <button 
            onClick={handleGetDeal}
            className={`w-full h-11 px-4 rounded-xl font-black text-[11px] transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 
            ${isVip ? 'bg-[#FFD700] hover:bg-black hover:text-[#FFD700] text-black' : 'bg-[#1A1A1A] hover:bg-sky-600 text-white'}`}
          >
            {isVip && !isLoggedIn ? <Lock size={12} /> : <Zap size={12} fill="currentColor" />}
            {isVip && !isLoggedIn ? 'UNLOCK' : 'GET DEAL'}
          </button>

          <Link 
            href={`/stores/${finalSlug}`}
            className="text-[11px] font-black text-sky-500 hover:text-sky-600 transition-colors flex items-center gap-1 group/link"
          >
            Store Page <ExternalLink size={11} className="group-hover/link:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* --- Login Modal (For VIP) --- */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 relative shadow-2xl border-4 border-[#FFD700]">
            <button onClick={() => setShowLoginModal(false)} className="absolute right-6 top-6 text-gray-400 hover:text-black transition-colors">
              <X size={24} />
            </button>
            <div className="text-center">
              <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-[#FFD700]">
                <span className="text-4xl">🐝</span>
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">VIP Deals Only!</h2>
              <p className="text-gray-500 font-medium mb-8">
                This is a <span className="text-[#FFB800] font-bold underline">Savvy VIP</span> exclusive deal. Log in to access direct discounts and rewards.
              </p>
              <div className="flex flex-col gap-4">
                <Link href="/register" className="flex items-center justify-center gap-3 w-full bg-[#1A1A1A] text-white py-4 rounded-2xl font-black text-lg hover:bg-black transition-all shadow-xl shadow-gray-200">
                  <UserPlus size={20} /> Join Savvy Bee Free
                </Link>
                <Link href="/login" className="flex items-center justify-center gap-3 w-full bg-white text-black py-4 rounded-2xl font-black text-lg border-2 border-gray-100 hover:border-gray-300 transition-all">
                  <LogIn size={20} /> Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- Deal Popup --- */}
      {showPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl transition-all">
          <div className={`bg-white rounded-[3.5rem] w-full max-w-2xl overflow-hidden relative shadow-[0_0_100px_rgba(255,215,0,0.15)] border-b-[12px] ${isVip ? 'border-[#FFD700]' : 'border-sky-500'}`}>
            <div className={`relative pt-12 pb-8 px-10 text-center ${isVip ? 'bg-gradient-to-b from-[#FFD700]/10 to-white' : 'bg-gradient-to-b from-sky-50 to-white'}`}>
              <button onClick={() => setShowPopup(false)} className="absolute right-8 top-8 w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center text-gray-400 hover:text-black hover:rotate-90 transition-all z-50 border border-gray-100">
                <X size={20} />
              </button>
              <div className="flex flex-col items-center gap-4">
                <div className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${isVip ? 'bg-[#FFD700] text-black' : 'bg-black text-white'}`}>
                  {isVip ? <Sparkles size={14} /> : <Zap size={14} fill="currentColor" />}
                  {isVip ? 'Savvy VIP Deal Unlocked' : 'Direct Deal Activated'}
                </div>
                
                <h2 className="text-3xl font-black text-gray-900 leading-[1.1] tracking-tight max-w-xl mx-auto">
                  {title}
                </h2>

                {description && (
                  <div className="w-full text-right mt-3">
                    <p className="text-sm font-bold text-gray-700 leading-relaxed bg-slate-50/80 p-5 rounded-2xl border border-slate-100 max-w-xl mx-auto text-center">
                      {description}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="px-10 pb-12">
              <div className="relative group cursor-pointer" onClick={() => window.open(affiliateUrl, '_blank')}>
                <div className={`absolute -inset-1 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 ${isVip ? 'bg-[#FFD700]' : 'bg-sky-400'}`}></div>
                <div className="relative flex items-center justify-between bg-gray-50 border-2 border-dashed border-gray-200 p-6 rounded-[2rem] hover:border-amber-400 hover:bg-white transition-all">
                   <div className="flex flex-col">
                      <span className="text-[12px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</span>
                      <span className="text-2xl font-black text-green-600 flex items-center gap-2">
                        <CheckCircle2 size={24} /> DEAL READY
                      </span>
                   </div>
                  <div className={`flex items-center gap-3 px-8 py-5 rounded-[1.5rem] font-black text-xl transition-all shadow-xl shadow-amber-100/50 bg-[#1A1A1A] text-white group-hover:bg-[#FFD700] group-hover:text-black`}>
                      GET DEAL <ExternalLink size={24} />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <button onClick={() => window.open(affiliateUrl, '_blank')} className={`flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-lg transition-all shadow-xl shadow-sky-100/50 active:scale-95 ${isVip ? 'bg-white border-2 border-amber-400 text-gray-900 hover:bg-amber-50' : 'bg-sky-500 text-white hover:bg-sky-600'}`}>
                  Visit {storeName} <ExternalLink size={20} />
                </button>
                <div className="flex flex-col justify-center bg-amber-50/50 border border-amber-100 px-6 py-4 rounded-2xl transition-all">
                  <span className="text-amber-800 font-black text-[11px] uppercase tracking-wider mb-1">{userRating > 0 ? "Thanks!" : "Rate it"}</span>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} onClick={() => setUserRating(star)} className="transition-all duration-200 transform active:scale-125">
                        <Star size={24} fill={(hoverRating || userRating) >= star ? "#FFB800" : "transparent"} className={(hoverRating || userRating) >= star ? "text-[#FFB800]" : "text-amber-200"} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-center mt-6 text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                <MousePointerClick size={12} /> No Coupon Code Required for this Deal
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DealCard;
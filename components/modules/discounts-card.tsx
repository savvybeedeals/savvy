"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, ShoppingCart, Star, X, Copy, Check, 
  ExternalLink, ShieldCheck, Lock, UserPlus, LogIn, 
  TrendingUp, CheckCircle2, Ticket, AlertCircle, Maximize2 
} from 'lucide-react';
import Link from 'next/link';
// استيراد الـ Auth Context لقراءة حالة تسجيل الدخول الحقيقية مثل الكوبونات
import { useAuth } from "@/context/auth-context";
// التعديل الصحيح: استخدام الـ named export لمنع تحذير الـ deprecation نهائياً
import { createImageUrlBuilder } from '@sanity/image-url';
// استيراد دالة حفظ الخصم
import { saveUserDiscount } from "@/services/discounts-service";

// إعداد دالة الـ Builder لاستخراج روابط الصور (تأكد من إعداد متغيرات البيئة بملفك)
const imageBuilder = createImageUrlBuilder({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
});

const urlFor = (source: any) => {
  return imageBuilder.image(source);
};

interface DiscountItem {
  id: number;
  _id: string;
  name: string;
  store: any; // تم تعديلها إلى any لتستقبل النص أو الكائن القادم من الساني المربوط ديناميكياً
  currentPrice?: number;
  // تم جعلها اختيارية لضمان معالجة الحساب التلقائي بأمان
  oldPrice: number;
  discountPercentage?: number;
  // إضافة الحقل القادم من سانتي ليعتمد عليه الحساب التلقائي هنا
  productImage: any;
  // تم استبدال حقل النص img بحقل الكائن productImage الخاص بصور سانتي
  rating?: number; // تم جعلها اختيارية هنا للأمان التام في الـ TypeScript
  isVip: boolean;
  promoCode: string;
  description: string;
  affiliateLink: string;
  usersCount: number;
  discountPercentageString?: string; // خانة جاهزة للربط المباشر مع سانتي (Sanity) مثل الكوبونات
}

interface DiscountsCardProps {
  discount: DiscountItem;
}

export function DiscountsCard({ discount }: DiscountsCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  // جلب بيانات العميل الحالية من الـ Context الديناميكي للموقع لمنطق الـ VIP الحقيقي
  const { user } = useAuth();
  const isLoggedIn = !!user;

  // الحساب الذكي والآمن للسعر النهائي في حال عدم إدخاله يدوياً في لوحة تحكم Sanity
  const finalCurrentPrice = discount.currentPrice && discount.currentPrice > 0
    ? discount.currentPrice
    : (discount.discountPercentage && discount.discountPercentage > 0
        ? parseFloat((discount.oldPrice - (discount.oldPrice * (discount.discountPercentage / 100))).toFixed(2))
        : discount.oldPrice);

  // استخدام قيمة سانتي المباشرة إن وجدت، أو حسابها تلقائياً كبديل ذكي لمنع الـ 100% الخاطئة
  const displayDiscount = discount.discountPercentageString ||
  (discount.discountPercentage && discount.discountPercentage > 0
      ? `${discount.discountPercentage}% OFF`
      : (discount.oldPrice > finalCurrentPrice
          ? `${Math.round(((discount.oldPrice - finalCurrentPrice) / discount.oldPrice) * 100)}% OFF`
          : ""));

  // دالة أمان ذكية لاستخراج اسم المتجر لمنع خطأ Runtime Error (Objects are not valid as a React child)
  const renderStoreName = () => {
    if (!discount.store) return "";
    if (typeof discount.store === "string") return discount.store;
    if (typeof discount.store === "object") {
      return discount.store.name || discount.store.title || "Store";
    }
    return "Store";
  };

  const handleOpenProduct = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (discount.isVip && !isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    // 🔥 استخراج الـ id الخاص بالعميل الحالي وحفظ الخصم بمجرد الضغط
    if (isLoggedIn && user?.id) {
      await saveUserDiscount(user.id, discount._id);
    }

    setUserRating(0);
    setIsOpen(true);
  };

  // دالة مخصصة لتكبير الصورة من داخل الكارت الخارجي مباشرة دون التداخل مع الـ Popup
  const handleZoomFromCard = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (discount.isVip && !isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    setIsImageZoomed(true);
  };

  // تعديل وظيفة النسخ لتطابق الكوبونات تماماً بالتوجيه ورابط الأفلييت
  const handleCopyAndRedirect = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(discount.promoCode);
    setCopied(true);
    
    // يرى المستخدم نجاح النسخ أولاً ثم يتم فتح رابط الأفلييت بعد 800 مللي ثانية
    setTimeout(() => {
      setCopied(false);
      window.open(discount.affiliateLink || "#", '_blank');
    }, 800);
  };

  return (
    <>
      {/* الكارت الخارجي مع أنيميشن أنعم عالي المرونة - تم تعديل الخلفية لتصبح #F5F6F7 بناءً على طلبك */}
      <motion.div 
        whileHover={{ y: -8, scale: 1.015 }}
        transition={{ type: "spring", stiffness: 300, damping: 22, mass: 0.8 }}
        onClick={handleOpenProduct}
        className={`group relative bg-[#F5F6F7] rounded-[2.5rem] p-6 border-2 transition-all duration-500 cursor-pointer w-full h-full flex flex-col justify-between
          ${discount.isVip 
          ? 'border-amber-200 shadow-[0_10px_30px_-10px_rgba(255,215,0,0.25)] hover:shadow-[0_25px_50px_-12px_rgba(255,215,0,0.35)]' 
          : 'border-sky-100 hover:border-sky-300 hover:shadow-[0_25px_50px_-12px_rgba(14,165,233,0.18)]'}`}
      >
        {/* شارة الـ VIP */}
        {discount.isVip && (
          <div className="absolute -top-3 -left-2 z-20 scale-75 origin-top-left">
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

        {/* شارة نسبة الخصم الذكية - تم تعديل التنسيق ليطابق تماماً شارة الـ VIP بالجلو الذهبي المحيط والأنيميشن الشيمر */}
        {displayDiscount && (
          <div className="absolute top-4 right-4 z-20">
            <div className="absolute inset-0 bg-[#FFD700] rounded-xl blur-md opacity-40 animate-pulse"></div>
            <span className="relative bg-[#FFD700] text-black px-3 py-1 rounded-xl text-xs font-black tracking-tight shadow-md border-2 border-white block overflow-hidden">
              {displayDiscount}
              <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 animate-[shimmer_2s_infinite]"></div>
            </span>
          </div>
        )}

        {/* حاوية الصورة المحدثة لعرض صور سانتي بشكل متناسق وممتاز داخل الكارت (تم حذف زر التكبير الخارجي والاكتفاء بالصورة فقط) */}
        <div className="group/imgContainer h-48 bg-white rounded-[2rem] flex items-center justify-center mb-6 relative overflow-hidden select-none shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/[0.02]"></div>
          {discount.productImage && (
            <img 
              src={urlFor(discount.productImage).url()} 
              alt={discount.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] z-10"
            />
          )}
        </div>

        {/* تفاصيل المتجر والتقييم */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black text-sky-500 uppercase tracking-tighter">{renderStoreName()}</span>
            <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full">
              <Star size={10} className="fill-amber-400 text-amber-400" />
              {/* التعديل الوقائي الأول: التحقق من وجود التقييم لمنع الخطأ في محرك البحث */}
              <span className="text-[10px] font-bold text-amber-700">
                {discount.rating !== undefined && discount.rating !== null ? discount.rating.toFixed(1) : "0.0"}
              </span>
            </div>
          </div>
          <h4 className="font-[900] text-xl text-gray-900 mb-4 line-clamp-1 group-hover:text-sky-600 transition-colors">
            {discount.name}
          </h4>
        </div>

        {/* الأسعار وزر الإجراء السريع - تم تعديل ألوان السعر القديم والجديد بدقة والأزرار لتطابق طلبك */}
        <div className="flex items-center justify-between border-t border-gray-200/50 pt-5 mt-auto">
          <div className="flex flex-col">
            <span className="text-black text-xs font-bold line-through">${discount.oldPrice}</span>
            <span className="text-2xl font-[1000] tracking-tighter" style={{ color: '#00A6F4' }}>${finalCurrentPrice}</span>
          </div>
          <button 
            onClick={handleOpenProduct}
            className={`p-4 rounded-2xl transition-all shadow-lg active:scale-90 group/btn flex items-center justify-center
              ${discount.isVip ? 'bg-[#FFD700] hover:bg-black hover:text-[#FFD700] text-black' : 'bg-black text-white hover:bg-sky-500'}
            `}
          >
            {discount.isVip && !isLoggedIn ? <Lock size={20} /> : <ShoppingCart size={20} className="group-hover/btn:rotate-12 transition-transform duration-300" />}
          </button>
        </div>
      </motion.div>

      {/* --- Login Modal (VIP) --- */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowLoginModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }} 
              transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
              className="relative bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl border-4 border-[#FFD700] z-[120]"
            >
              <button onClick={() => setShowLoginModal(false)} className="absolute right-6 top-6 text-gray-400 hover:text-black transition-colors"><X size={24} /></button>
              <div className="text-center">
                <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-[#FFD700]"><span className="text-4xl">🐝</span></div>
                <h2 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">Members Only!</h2>
                <p className="text-gray-500 font-medium mb-8">This is a <span className="text-[#FFB800] font-bold underline">Savvy VIP</span> deal. Create a free account to unlock exclusive offers.</p>
                <div className="flex flex-col gap-4">
                  <Link href="/register" className="flex items-center justify-center gap-3 w-full bg-[#1A1A1A] text-white py-4 rounded-2xl font-black text-lg hover:bg-black transition-all shadow-xl shadow-gray-200"><UserPlus size={20} /> Join Savvy Bee Free</Link>
                  <Link href="/login" className="flex items-center justify-center gap-3 w-full bg-white text-black py-4 rounded-2xl font-black text-lg border-2 border-gray-100 hover:border-gray-300 transition-all"><LogIn size={20} /> Sign In</Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- Discount Product Popup --- */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-xl" />
            
            <motion.div 
              initial={{ scale: 0.96, y: 15, opacity: 0 }} 
              animate={{ scale: 1, y: 0, opacity: 1 }} 
              exit={{ scale: 0.96, y: 15, opacity: 0 }}
              transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.5 }}
              className={`relative bg-white w-full max-w-5xl rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl border-b-[8px] md:border-b-[12px] z-50 flex flex-col md:flex-row max-h-[90vh] ${discount.isVip ? 'border-[#FFD700]' : 'border-sky-500'}`}
            >
              {/* زر الإغلاق العلوي للنافذة الثابت بذكاء - يتكيف مع الشاشات الصغيرة */}
              <button onClick={() => setIsOpen(false)} className="absolute right-4 top-4 md:right-6 md:top-6 w-10 h-10 bg-white/80 backdrop-blur-md shadow-md rounded-full flex items-center justify-center text-gray-400 hover:text-black hover:rotate-90 transition-all z-[60] border border-gray-100"><X size={20} /></button>

              {/* الجانب الأول: حاوية الصورة الكبيرة (تم تكبير المساحة لتعرض جزءًا أكبر من الصورة) */}
              <div className={`w-full md:w-[45%] lg:w-1/2 p-6 md:p-8 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-gray-100/70 ${discount.isVip ? 'bg-gradient-to-b from-[#FFD700]/5 to-transparent' : 'bg-gradient-to-b from-sky-50/40 to-transparent'}`}>
                
                {/* عرض قيمة العرض بشكل واضح وممتاز أعلى حاوية الصورة مباشرة */}
                {displayDiscount && (
                  <div className="w-full flex justify-start mb-4 select-none">
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#FFD700] rounded-xl blur-md opacity-40 animate-pulse"></div>
                      <span className="relative bg-[#FFD700] text-black px-4 py-2 rounded-xl text-xs md:text-sm font-black tracking-tight shadow-md border-2 border-white block overflow-hidden">
                        {displayDiscount}
                        <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 animate-[shimmer_2s_infinite]"></div>
                      </span>
                    </div>
                  </div>
                )}

                {/* حاوية الصورة (تكبير الكونتينر لعرض أكبر للصورة مع توافق استجابة الشاشات - تم الإبقاء على زر التكبير هنا في الـ Popup كما طلبت) */}
                <div className="group/img relative w-full aspect-square md:aspect-auto md:h-[450px] lg:h-[500px] bg-white rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center shadow-xl border border-gray-50 overflow-hidden select-none">
                  {discount.productImage && (
                    <>
                      <img 
                        src={urlFor(discount.productImage).url()} 
                        alt={discount.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                      />
                      {/* زر التكبير السلس عند تمرير الماوس فوق الصورة في الـ Popup */}
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsImageZoomed(true);
                        }}
                        className="absolute inset-0 bg-black/30 flex items-center justify-center text-white opacity-0 group-hover/img:opacity-100 transition-opacity duration-300"
                        title="Zoom Image"
                      >
                        <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl border border-white/30 transform scale-75 group-hover/img:scale-100 transition-transform duration-300">
                          <Maximize2 size={24} />
                        </div>
                      </button>
                    </                    >
                  )}
                </div>
              </div>

              {/* الجانب الثاني: عمود البيانات الكاملة والوظائف التفاعلية */}
              <div className="w-full md:w-[55%] lg:w-1/2 p-6 md:p-10 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-none">
                <div>
                  {/* شارات التحقق العلوية */}
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 w-fit mb-4 select-none ${discount.isVip ? 'bg-[#FFD700] text-black' : 'bg-black text-white'}`}>
                     {discount.isVip ? <Sparkles size={14}/> : <Ticket size={14}/>}
                     {discount.isVip ? 'Savvy VIP Unlocked' : 'Verified discounts'}
                  </div>

                  {/* اسم المنتج الفاخر */}
                  <h3 className="text-xl md:text-3xl lg:text-4xl font-[1000] tracking-tighter text-gray-900 leading-tight mb-2">{discount.name}</h3>
                  
                  {/* بيانات المتجر والتقييم الإجمالي */}
                  <div className="flex items-center gap-3 mb-4">
                     <span className="text-sky-500 font-black text-xs md:text-sm uppercase tracking-widest">{renderStoreName()}</span>
                     <div className="flex items-center gap-1 text-[#FFB800]">
                        <Star size={14} fill="currentColor" />
                        {/* التعديل الوقائي الثاني: التحقق من وجود التقييم داخل الـ Popup للأمان المطلق */}
                        <span className="text-gray-900 font-bold text-xs md:text-sm">
                          {discount.rating !== undefined && discount.rating !== null ? discount.rating.toFixed(1) : "0.0"}
                        </span>
                     </div>
                  </div>

                  {/* الوصف التفصيلي للمنتج */}
                  <p className="text-gray-500 font-bold text-sm md:text-base leading-relaxed mb-6">
                    {discount.description}
                  </p>

                  {/* بلوك كود الخصم الفعال والنسخ التلقائي المتكامل مع التوجيه للأفلييت */}
                  <div className="relative group cursor-pointer mb-6" onClick={handleCopyAndRedirect}>
                    <div className={`absolute -inset-1 rounded-[2rem] blur opacity-10 group-hover:opacity-30 transition duration-1000 ${discount.isVip ? 'bg-[#FFD700]' : 'bg-sky-400'}`}></div>
                    <div className="relative flex items-center justify-between bg-gray-50 border-2 border-dashed border-gray-200 p-2.5 md:p-3 rounded-[2rem] hover:border-amber-400 hover:bg-white transition-all">
                      <div className="flex flex-col ml-4">
                        <span className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          {copied ? "Copy Successful! Redirecting..." : "Click to Copy & Visit"}
                        </span>
                        <span className={`text-lg md:text-2xl lg:text-3xl font-black tracking-[0.15em] ${discount.isVip ? 'text-amber-600' : 'text-gray-800'}`}>
                          {discount.promoCode}
                        </span>
                      </div>
                      <div className={`flex items-center gap-2 px-4 py-3 md:px-5 md:py-4 rounded-[1.5rem] font-black text-xs md:text-sm transition-all shadow-md ${copied ? 'bg-green-500 text-white min-w-[120px] justify-center' : 'bg-[#1A1A1A] text-white group-hover:bg-[#FFD700] group-hover:text-black'}`}>
                        {copied ? <Check size={18} strokeWidth={3} /> : <Copy size={18} />}
                        {copied ? 'COPIED!' : 'COPY'}
                      </div>
                    </div>
                  </div>

                  {/* شبكة الأزرار: الانتقال السريع للمتجر والتقييم النجمي الداخلي للعملاء */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <a href={discount.affiliateLink} target="_blank" rel="noopener noreferrer" className={`flex items-center justify-center gap-2 py-3 md:py-4 rounded-2xl font-black text-sm md:text-base transition-all shadow-lg active:scale-95 ${discount.isVip ? 'bg-white border-2 border-amber-400 text-gray-900 hover:bg-amber-50' : 'bg-sky-500 text-white hover:bg-sky-600'}`}>
                      Shop at {renderStoreName()} <ExternalLink size={16} />
                    </a>

                    <div className="flex flex-col justify-center bg-amber-50/50 border border-amber-100 px-4 py-3 rounded-2xl">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-amber-800 font-black text-[10px] uppercase tracking-wider">
                          {userRating > 0 ? "Thanks for rating!" : "Did it work?"}
                        </span>
                        {userRating > 0 && <span className="text-green-600 font-black text-[9px] flex items-center gap-1 animate-bounce"><Check size={10} /> Saved</span>}
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button key={star} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} onClick={() => setUserRating(star)} className="transition-all duration-200 transform active:scale-125">
                            <Star size={18} fill={(hoverRating || userRating) >= star ? "#FFB800" : "transparent"} className={(hoverRating || userRating) >= star ? "text-[#FFB800] drop-shadow-sm" : "text-amber-200"} />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* رسالة التحذير الذكية الخاصة بمانعي الإعلانات Ad-Blockers */}
                  <div className="flex items-start gap-3 p-4 bg-amber-50/30 border border-amber-100/50 rounded-2xl mb-6">
                    <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-0.5 text-left">
                      <p className="text-[11px] font-black text-amber-900 uppercase tracking-tight">Trouble Redirecting?</p>
                      <p className="text-[10px] font-medium text-amber-700 leading-normal">
                        Some browser extensions or <b>Ad-Blockers</b> may prevent our store links from opening. For the best experience, please disable them or add our site to your whitelist.
                      </p>
                    </div>
                  </div>
                </div>

                {/* شريط الإحصائيات النهائي للتحقق الفوري أسفل الكارت */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest border-t border-gray-50 pt-4 mt-4 md:mt-auto">
                   <div className="flex items-center gap-1.5 bg-green-50 text-green-600 px-2.5 py-1 rounded-full border border-green-100">
                      <CheckCircle2 size={12} />
                      Tested & Verified 2 hours ago
                   </div>
                   <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1"><TrendingUp size={12} /> {discount.usersCount} Uses Today</span>
                      <ShieldCheck size={14} className="text-sky-500" />
                   </div>
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- Lightbox Modal لعرض الصورة بحجمها الكامل المكبر عند الضغط على زر التكبير --- */}
      <AnimatePresence>
        {isImageZoomed && discount.productImage && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsImageZoomed(false)} 
              className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-zoom-out" 
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="relative max-w-full max-h-[85vh] z-[210] select-none"
            >
              <button 
                onClick={() => setIsImageZoomed(false)} 
                className="absolute -top-14 right-0 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors border border-white/20 shadow-lg"
              >
                <X size={20} />
              </button>
              <img 
                src={urlFor(discount.productImage).url()} 
                alt={discount.name}
                className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-white/10"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ستايل شيمر أنيميشن العالمي لشارات الـ VIP وشارات الخصم المحدثة */}
      <style jsx global>{`
        @keyframes shimmer { 0% { left: -100%; } 100% { left: 100%; } }
      `}</style>
    </>
  );
}
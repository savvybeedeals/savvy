"use client";

import React, { useState, useEffect } from 'react';
import { notFound } from "next/navigation";
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Ticket, Zap, Flame, ChevronDown } from 'lucide-react';
import { getStoreBySlug } from "@/services/store-service";
import CouponCard from "@/components/modules/coupon-card";
import { DiscountsCard } from "@/components/modules/discounts-card";

interface StorePageClientProps {
  params: Promise<{ storeSlug: string }>;
}

export default function StorePageClient({ params }: StorePageClientProps) {
  // فك الـ params برمجياً متوافق 100% مع Next.js 15
  const resolvedParams = React.use(params);
  const storeSlug = resolvedParams.storeSlug;

  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // حالة الفلتر الافتراضية: Discounts أولاً بناءً على التصميم الفخم
  const [activeTab, setActiveTab] = useState<'discounts' | 'coupons' | 'deals'>('discounts');

  // التحكم في الـ Pagination (Load More) لكل قسم بشكل مستقل تماماً وبدون تداخل
  const [visibleCoupons, setVisibleCoupons] = useState(4);
  const [visibleDiscounts, setVisibleDiscounts] = useState(4);
  const [visibleDeals, setVisibleDeals] = useState(4);

  useEffect(() => {
    const fetchData = async () => {
      if (!storeSlug) return;
      try {
        setLoading(true);
        const data = await getStoreBySlug(storeSlug);
        if (data) {
          setStore(data);
        }
      } catch (error) {
        console.error("Error fetching store data in client hub:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [storeSlug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-black italic text-xl animate-pulse uppercase tracking-widest text-gray-400">Loading Savvy Hub...</p>
        </div>
      </div>
    );
  }

  if (!store) return notFound();

  // تجميع وتأمين المصفوفات القادمة من السيرفر لضمان عدم حدوث خطأ undefined
  const allCoupons = store.coupons || [];
  const allDeals = store.deals || [];
  const allDiscounts = store.discounts || [];

  // تقطيع المصفوفات طبقاً للحد الحالي للـ Load More الخاص بكل تبويب
  const displayedCoupons = allCoupons.slice(0, visibleCoupons);
  const displayedDeals = allDeals.slice(0, visibleDeals);
  const displayedDiscounts = allDiscounts.slice(0, visibleDiscounts);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] pb-24">
      
      {/* --- SECTION 1: HERO CONTAINER --- */}
      <div className="bg-white border-b border-slate-100 py-16 px-6 mb-12 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          
          <motion.div 
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="bg-[#FFD700] w-14 h-14 md:w-16 md:h-16 rounded-[1.2rem] md:rounded-[1.5rem] flex items-center justify-center text-xl md:text-3xl shadow-[0_15px_40px_rgba(255,215,0,0.3)] animate-bounce border-2 border-white/20 mb-6"
          >
            🐝
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-emerald-100"
          >
            <Sparkles size={12} /> Official {store.name} Verified Partner
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-[1000] text-slate-900 italic uppercase tracking-tighter leading-none mb-6"
          >
            Exclusive <span className="text-sky-500">{store.name}</span> Hub
          </motion.h1>
          
          {store.description && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="max-w-3xl text-slate-500 font-medium text-base md:text-lg leading-relaxed italic"
            >
              {store.description}
            </motion.p>
          )}

          {/* ================= Tabs Bar Navigation ================= */}
          <div className="flex flex-wrap justify-center items-center gap-2 md:gap-3 mt-10 bg-slate-100/90 p-1.5 rounded-2xl max-w-lg mx-auto border border-slate-200/50 shadow-inner">
            
            <button
              onClick={() => setActiveTab('discounts')}
              className={`relative flex items-center gap-2 px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-colors duration-300 select-none cursor-pointer ${
                activeTab === 'discounts' ? 'text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {activeTab === 'discounts' && (
                <motion.div layoutId="storeActiveTabBg" className="absolute inset-0 bg-rose-500 rounded-xl shadow-sm" transition={{ type: "spring", stiffness: 380, damping: 30 }} />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <Zap size={13} /> Discounts ({allDiscounts.length})
              </span>
            </button>

            <button
              onClick={() => setActiveTab('coupons')}
              className={`relative flex items-center gap-2 px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-colors duration-300 select-none cursor-pointer ${
                activeTab === 'coupons' ? 'text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {activeTab === 'coupons' && (
                <motion.div layoutId="storeActiveTabBg" className="absolute inset-0 bg-amber-500 rounded-xl shadow-sm" transition={{ type: "spring", stiffness: 380, damping: 30 }} />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <Ticket size={13} /> Coupons ({allCoupons.length})
              </span>
            </button>

            <button
              onClick={() => setActiveTab('deals')}
              className={`relative flex items-center gap-2 px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-colors duration-300 select-none cursor-pointer ${
                activeTab === 'deals' ? 'text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {activeTab === 'deals' && (
                <motion.div layoutId="storeActiveTabBg" className="absolute inset-0 bg-sky-500 rounded-xl shadow-sm" transition={{ type: "spring", stiffness: 380, damping: 30 }} />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <Flame size={13} /> Deals ({allDeals.length})
              </span>
            </button>

          </div>
        </div>
      </div>

      {/* الحاوية الرئيسية للتصفية النشطة */}
      <div className="max-w-[90rem] mx-auto px-6 w-full min-h-[450px]">
        <AnimatePresence mode="wait">
          
          {/* 1. قسم التخفيضات المباشرة (FLASH DISCOUNTS) */}
          {activeTab === 'discounts' && (
            <motion.section
              key="discounts-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <div className="flex items-center gap-3 mb-8 border-b border-gray-200/60 pb-4">
                <div className="p-2.5 bg-rose-50 rounded-2xl text-rose-500 shadow-sm">
                  <Zap size={24} className="animate-bounce" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-[1000] italic uppercase tracking-tighter text-slate-800">FLASH DISCOUNTS</h2>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Hot Product Price Drops</p>
                </div>
                <span className="ml-auto bg-rose-100 text-rose-800 text-xs font-black px-3 py-1 rounded-full">{allDiscounts.length} Active</span>
              </div>

              {allDiscounts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
                  {displayedDiscounts.map((item: any, idx: number) => {
                    // هيكلة الـ Object ليتوافق 100% مع الخصائص الداخلية لـ DiscountsCard ويمنع الكروت البيضاء الفارغة
                    const formattedDiscount = {
                      id: item._id, // 🌟 تم إضافة المعرّف هنا لحل مشكلة التايب سكريبت بشكل كامل وسليم
                      _id: item._id,
                      name: item.name,
                      description: item.description,
                      productImage: item.productImage,
                      oldPrice: item.oldPrice,
                      discountPercentage: item.discountPercentage,
                      currentPrice: item.currentPrice,
                      affiliateLink: item.affiliateLink,
                      promoCode: item.promoCode,
                      expiryDate: item.expiryDate,
                      rating: item.rating || 4.5,
                      usersCount: item.usersCount || 120,
                      isVip: item.isVip === true,
                      store: { name: store.name }
                    };

                    return (
                      <motion.div key={item._id || idx} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.25 }}>
                        <DiscountsCard discount={formattedDiscount} />
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-[2.5rem] bg-white/50 font-bold text-gray-400 uppercase tracking-widest text-sm">No Flash Discounts Right Now</div>
              )}

              {allDiscounts.length > visibleDiscounts && (
                <div className="flex justify-center mt-10">
                  <button
                    onClick={() => setVisibleDiscounts(prev => prev + 4)}
                    className="group relative flex items-center gap-3 bg-white hover:bg-slate-900 text-slate-800 hover:text-white px-8 py-3.5 rounded-2xl font-black text-sm transition-all duration-300 shadow-sm hover:shadow-xl border border-slate-200/80 hover:border-slate-900 cursor-pointer select-none"
                  >
                    <span>LOAD MORE FLASH DISCOUNTS</span>
                    <ChevronDown size={16} className="transition-transform group-hover:translate-y-1 duration-300" />
                    <span className="absolute -top-3 -right-3 bg-[#FFD700] text-slate-900 text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow animate-bounce">🐝</span>
                  </button>
                </div>
              )}
            </motion.section>
          )}

          {/* 2. قسم الكوبونات الترويجية (LATEST COUPONS) */}
          {activeTab === 'coupons' && (
            <motion.section
              key="coupons-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <div className="flex items-center gap-3 mb-8 border-b border-gray-200/60 pb-4">
                <div className="p-2.5 bg-amber-50 rounded-2xl text-amber-500 shadow-sm">
                  <Ticket size={24} className="animate-pulse" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-[1000] italic uppercase tracking-tighter text-slate-800">LATEST COUPONS</h2>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Verified Promo Codes</p>
                </div>
                <span className="ml-auto bg-amber-100 text-amber-800 text-xs font-black px-3 py-1 rounded-full">{allCoupons.length} Available</span>
              </div>

              {allCoupons.length > 0 ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 w-full">
                  {displayedCoupons.map((coupon: any) => (
                    <motion.div key={coupon._id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.25 }}>
                      <CouponCard coupon={{ ...coupon, store: { name: store.name, logo: store.logo } }} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-[2.5rem] bg-white/50 font-bold text-gray-400 uppercase tracking-widest text-sm">No Active Coupons For This Store</div>
              )}

              {allCoupons.length > visibleCoupons && (
                <div className="flex justify-center mt-10">
                  <button
                    onClick={() => setVisibleCoupons(prev => prev + 4)}
                    className="group relative flex items-center gap-3 bg-white hover:bg-slate-900 text-slate-800 hover:text-white px-8 py-3.5 rounded-2xl font-black text-sm transition-all duration-300 shadow-sm hover:shadow-xl border border-slate-200/80 hover:border-slate-900 cursor-pointer select-none"
                  >
                    <span>LOAD MORE COUPONS</span>
                    <ChevronDown size={16} className="transition-transform group-hover:translate-y-1 duration-300" />
                    <span className="absolute -top-3 -right-3 bg-[#FFD700] text-slate-900 text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow animate-bounce">🐝</span>
                  </button>
                </div>
              )}
            </motion.section>
          )}

          {/* 3. قسم العروض الساخنة (TOP DEALS) */}
          {activeTab === 'deals' && (
            <motion.section
              key="deals-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <div className="flex items-center gap-3 mb-8 border-b border-gray-200/60 pb-4">
                <div className="p-2.5 bg-sky-50 rounded-2xl text-sky-500 shadow-sm">
                  <Flame size={24} className="animate-pulse" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-[1000] italic uppercase tracking-tighter text-slate-800">TOP DEALS</h2>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Hand-Picked Shopping Offers</p>
                </div>
                <span className="ml-auto bg-sky-100 text-sky-800 text-xs font-black px-3 py-1 rounded-full">{allDeals.length} Deals</span>
              </div>

              {allDeals.length > 0 ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 w-full">
                  {displayedDeals.map((deal: any) => (
                    <motion.div key={deal._id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.25 }}>
                      <CouponCard coupon={{
                        ...deal,
                        discount: deal.secondTitle || "PROMO",
                        code: "DEAL ACTIVE",
                        type: "deal",
                        store: { name: store.name, logo: store.logo }
                      }} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-[2.5rem] bg-white/50 font-bold text-gray-400 uppercase tracking-widest text-sm">No Active Deals Today</div>
              )}

              {allDeals.length > visibleDeals && (
                <div className="flex justify-center mt-10">
                  <button
                    onClick={() => setVisibleDeals(prev => prev + 4)}
                    className="group relative flex items-center gap-3 bg-white hover:bg-slate-900 text-slate-800 hover:text-white px-8 py-3.5 rounded-2xl font-black text-sm transition-all duration-300 shadow-sm hover:shadow-xl border border-slate-200/80 hover:border-slate-900 cursor-pointer select-none"
                  >
                    <span>LOAD MORE DEALS</span>
                    <ChevronDown size={16} className="transition-transform group-hover:translate-y-1 duration-300" />
                    <span className="absolute -top-3 -right-3 bg-[#FFD700] text-slate-900 text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow animate-bounce">🐝</span>
                  </button>
                </div>
              )}
            </motion.section>
          )}

        </AnimatePresence>
      </div>

      <footer className="max-w-7xl mx-auto px-6 text-center mt-24 pt-8 border-t border-gray-200/50">
        <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.4em]">
           Savvy Bee Deals Hub × {store.name} • 2026
        </p>
      </footer>
    </div>
  );
}
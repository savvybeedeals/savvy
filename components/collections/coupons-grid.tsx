"use client";
import React, { useState, useMemo } from 'react';
import CouponCard from "../modules/coupon-card";
import CouponsFilter from "./coupons-filter";

interface CouponsGridProps {
  coupons?: any[];
  showFilter?: boolean;
}

export function CouponsGrid({ coupons: initialCoupons = [] , showFilter = false }: CouponsGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStore, setSelectedStore] = useState("all");
  
  // ليمت عرض الكوبونات يبدأ بـ 10 كوبونات
  const [visibleCount, setVisibleCount] = useState(10);

  // 1. استخراج قائمة المتاجر الفريدة المتاحة ديناميكياً
  const storesList = useMemo(() => {
    const stores = initialCoupons
      .map((c) => c.store?.name)
      .filter((name): name is string => !!name);
    return Array.from(new Set(stores)).sort();
  }, [initialCoupons]);

  // 2. تصفية الكوبونات بناءً على البحث واختيار المتجر
  const filteredCoupons = useMemo(() => {
    return initialCoupons.filter((coupon) => {
      const storeName = coupon.store?.name?.toLowerCase() || "";
      const title = coupon.title?.toLowerCase() || "";
      const discount = coupon.discount?.toLowerCase() || "";
      const code = coupon.code?.toLowerCase() || "";
      
      const cleanQuery = searchQuery.toLowerCase().trim();
      const matchesStore = selectedStore === "all" || coupon.store?.name === selectedStore;

      const matchesSearch = 
        storeName.includes(cleanQuery) ||
        title.includes(cleanQuery) ||
        discount.includes(cleanQuery) ||
        code.includes(cleanQuery);

      return matchesStore && matchesSearch;
    });
  }, [initialCoupons, searchQuery, selectedStore]);

  // الكوبونات التي سيتم عرضها فعلياً في الصفحة (أول 10 مثلاً)
  const displayedCoupons = useMemo(() => {
    return filteredCoupons.slice(0, visibleCount);
  }, [filteredCoupons, visibleCount]);

  // دالة تحميل المزيد عند الضغط على زر النحلة الشقية (تزيد 10 كوبونات إضافية في كل ضغطة)
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  return (
    <div className="w-full space-y-8">
      {/* الفلتر في الأعلى منفصل */}
      {showFilter && (
        <div className="w-full block">
          <CouponsFilter 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedStore={selectedStore}
            setSelectedStore={setSelectedStore}
            storesList={storesList}
          />
        </div>
      )}

      {filteredCoupons.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-slate-400 font-bold uppercase tracking-widest">
          No Coupons Found Matching Your Search.
        </div>
      ) : (
        <div className="flex flex-col items-center w-full gap-12">
          {/* شبكة عرض الكوبونات المحدودة بـ 10 */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 w-full">
            {displayedCoupons.map((coupon: any) => (
              <CouponCard key={coupon._id} coupon={coupon} />
            ))}
          </div>

          {/* زرار Load More الشقي بتصميم النحلة العسل - يظهر فقط إذا كان هناك المزيد من الكوبونات */}
          {visibleCount < filteredCoupons.length && (
            <button
              onClick={handleLoadMore}
              className="group relative flex items-center gap-3 bg-[#1A1A1A] hover:bg-[#FFD700] text-white hover:text-black font-black text-base px-8 py-4 rounded-2xl shadow-xl transition-all duration-300 transform active:scale-95 overflow-hidden border-2 border-transparent hover:border-black"
            >
              {/* النحلة الشقية وحركتها الطائرة عند الـ Hover */}
              <span className="text-2xl transition-transform duration-500 group-hover:animate-bounce group-hover:translate-x-2">
                🐝
              </span>
              {/* تم تعديل المسمى هنا فقط ليصبح كما طلبت تماماً */}
              <span className="tracking-tight uppercase">Load More Sweet Coupons</span>
              
              {/* تأثير اللمعان الخلفي الشقي عند الـ Hover */}
              <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-[shimmer_3s_infinite] group-hover:via-black/5"></div>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
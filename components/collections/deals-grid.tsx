"use client";
import React, { useState, useMemo } from 'react';
import DealCard from "../modules/deals-card";
import DealsFilter from "./deals-filter";

interface DealsGridProps {
  deals?: any[];
  showFilter?: boolean;
}

export function DealsGrid({ deals: initialDeals = [], showFilter = false }: DealsGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStore, setSelectedStore] = useState("all");
  
  // ليمت عرض العروض المبدئي (10 عروض كما في الملف الأصلي)
  const [visibleCount, setVisibleCount] = useState(10);

  // 1. استخراج قائمة المتاجر الفريدة المتاحة ديناميكياً من العروض الممررة
  const storesList = useMemo(() => {
    const stores = initialDeals
      .map((d) => d.store?.name)
      .filter((name): name is string => !!name);
    return Array.from(new Set(stores)).sort();
  }, [initialDeals]);

  // 2. تصفية العروض بناءً على البحث واختيار المتجر
  const filteredDeals = useMemo(() => {
    return initialDeals.filter((deal) => {
      const storeName = deal.store?.name?.toLowerCase() || "";
      const title = deal.title?.toLowerCase() || "";
      const secondTitle = deal.secondTitle?.toLowerCase() || "";
      const description = deal.description?.toLowerCase() || "";
      
      const cleanQuery = searchQuery.toLowerCase().trim();
      const matchesStore = selectedStore === "all" || deal.store?.name === selectedStore;

      const matchesSearch = 
        storeName.includes(cleanQuery) ||
        title.includes(cleanQuery) ||
        secondTitle.includes(cleanQuery) ||
        description.includes(cleanQuery);

      return matchesStore && matchesSearch;
    });
  }, [initialDeals, searchQuery, selectedStore]);

  // العروض التي سيتم عرضها فعلياً في الصفحة
  const displayedDeals = useMemo(() => {
    return filteredDeals.slice(0, visibleCount);
  }, [filteredDeals, visibleCount]);

  // دالة تحميل المزيد عند الضغط على زر النحلة الشقية (تزيد 10 عروض إضافية)
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  return (
    <div className="w-full space-y-8">
      {/* حقن ستايل أنيميشن الـ Shimmer محلياً لضمان تشغيله فوراً وظهور الزر */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes inlineShimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        .animate-inline-shimmer {
          animation: inlineShimmer 3s infinite linear;
        }
      `}} />

      {/* الفلتر في الأعلى منفصل ويظهر فقط عند الرغبة */}
      {showFilter && (
        <div className="w-full block">
          <DealsFilter 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedStore={selectedStore}
            setSelectedStore={setSelectedStore}
            storesList={storesList}
          />
        </div>
      )}

      {filteredDeals.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-slate-400 font-bold uppercase tracking-widest col-span-full">
          No Deals Found Matching Your Search.
        </div>
      ) : (
        <div className="flex flex-col items-center w-full gap-12">
          {/* شبكة عرض كروت العروض */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 w-full">
            {displayedDeals.map((deal: any) => (
              <DealCard 
                key={deal._id} 
                _id={deal._id} // 🔥 التعديل المطلوب لتمرير المعرف بنجاح
                id={deal.id || deal._id} // 🔥 طبقة حماية إضافية لضمان عدم ضياع المعرف
                storeName={deal.store?.name || "Store"} 
                storeLogo={deal.store?.logo} 
                discount={deal.secondTitle || "Promo"} 
                title={deal.title} 
                secondTitle={deal.secondTitle} 
                description={deal.description} 
                isVip={deal.isVip} 
                expiryDate={deal.expiryDate} 
                usersCount={deal.usersCount} 
                affiliateUrl={deal.affiliateUrl} 
                storeSlug={deal.store?.slug?.current}
              />
            ))}
          </div>

          {/* زرار Load More الفخم بعد إصلاح الأنيميشن وتغيير الاسم إلى Load More Sweet Deals بالملي */}
          {visibleCount < filteredDeals.length && (
            <button
              onClick={handleLoadMore}
              className="group relative flex items-center gap-3 bg-[#1A1A1A] hover:bg-[#FFD700] text-white hover:text-black font-black text-base px-8 py-4 rounded-2xl shadow-xl transition-all duration-300 transform active:scale-95 overflow-hidden border-2 border-transparent hover:border-black cursor-pointer select-none"
            >
              {/* النحلة الشقية وحركتها الطائرة عند الـ Hover */}
              <span className="text-2xl transition-transform duration-500 group-hover:animate-bounce group-hover:translate-x-2">
                🐝
              </span>
              
              {/* النص المصلح والمطلوب بدقة لصفحة العروض */}
              <span className="tracking-tight uppercase">Load More Sweet Deals</span>
              
              {/* تأثير اللمعان الخلفي الشقي المصلح محلياً ليعمل 100% */}
              <div className="absolute top-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-inline-shimmer group-hover:via-black/5"></div>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
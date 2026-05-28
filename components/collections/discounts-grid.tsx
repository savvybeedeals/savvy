"use client";

import React, { useState } from 'react';
import { DiscountsCard } from '../modules/discounts-card';

// تم تعديل الواجهة لجعل id اختيارياً لتجنب تعارض TypeScript مع بيانات ساني
interface DiscountItem {
  id?: number; // علامة الاستفهام تجعله اختيارياً هنا
  _id: string;
  name: string;
  store: any;
  currentPrice: number;
  oldPrice: number;
  productImage: any; 
  rating: number;
  isVip: boolean;
  promoCode: string;
  description: string;
  affiliateLink: string;
  usersCount: number;
}

interface DiscountsGridProps {
  discounts: DiscountItem[];
}

export function DiscountsGrid({ discounts = [] }: DiscountsGridProps) {
  // ليمت عرض التخفيضات يبدأ بـ 12 تخفيض
  const [visibleCount, setVisibleCount] = useState(12);

  // قص العروض المتاحة لعرض أول 12 كارت
  const displayedDiscounts = discounts.slice(0, visibleCount);

  return (
    <div className="w-full space-y-12">
      {/* حقن ستايل الـ Shimmer لزر اللود مور فقط */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes inlineShimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        .animate-inline-shimmer {
          animation: inlineShimmer 3s infinite linear;
        }
      `}} />

      {/* شبكة عرض الخصومات المباشرة النظيفة */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
        {displayedDiscounts.map((item, idx) => (
          <DiscountsCard 
            key={item._id || idx} 
            // نقوم بدمج id رقمي تلقائي (idx) ليطابق ما يتوقعه الكارت بالملي دون أي نقص
            discount={{ ...item, id: item.id ?? idx }} 
          />
        ))}
      </div>

      {/* زرار Load More الفخم */}
      {visibleCount < discounts.length && (
        <div className="flex justify-center w-full mt-4">
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => prev + 12)}
            className="group relative flex items-center gap-3 bg-[#1A1A1A] hover:bg-[#FFD700] text-white hover:text-black font-black text-base px-8 py-4 rounded-2xl shadow-xl transition-all duration-300 transform active:scale-95 overflow-hidden border-2 border-transparent hover:border-black cursor-pointer select-none"
          >
            <span className="text-2xl transition-transform duration-500 group-hover:animate-bounce group-hover:translate-x-2">
              🐝
            </span>
            <span className="tracking-tight uppercase">Load More Sweet Discounts</span>
            <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-inline-shimmer group-hover:via-black/5"></div>
          </button>
        </div>
      )}
    </div>
  );
}
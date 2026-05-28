"use client";

import React, { useState, useEffect } from 'react';
import { client } from "@/services/client";
import { DiscountsCard } from '@/components/modules/discounts-card';

interface CategoryPageProps {
  params: Promise<{
    categorySlug?: string[];
  }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  // فك الـ params برمجياً بأمان تام للتوافق مع مكونات العميل (Client Component)
  const resolvedParams = React.use(params);
  const slugArray = resolvedParams.categorySlug || [];
  
  // دائمًا نأخذ آخر عنصر في الـ Array لأنه يمثل القسم الحالي المستهدف بالتصفية مباشرة
  const currentCategorySlug = slugArray.length > 0 ? slugArray[slugArray.length - 1] : null;

  // حالات الـ State لإدارة جلب البيانات والـ Limit الذكي لـ 12 عنصر
  const [categoryData, setCategoryData] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // تحديد الحد الأقصى الأولي للعرض بـ 12 تخفيض بناءً على طلبك
  const [visibleCount, setVisibleCount] = useState<number>(12);

  // جلب البيانات من الـ Sanity Client بشكل متزامن وآمن تماماً
  useEffect(() => {
    async function getPageData() {
      setLoading(true);
      try {
        // 1. جلب بيانات القسم الحالية للتأكد من وجودها وعرض عنوانها الشيك
        const categoryQuery = `*[_type == "category" && slug.current == $slug][0] { _id, name, description }`;
        const categoryDataFetched = currentCategorySlug 
          ? await client.fetch(categoryQuery, { slug: currentCategorySlug }) 
          : null;
        
        setCategoryData(categoryDataFetched);

        // 2. جلب الخصومات (Discounts) بناءً على حالة المسار مع دعم النشر التنازلي التلقائي للأقسام
        const itemsQuery = currentCategorySlug
          ? `*[_type == "discount" && (
              category->slug.current == $slug || 
              category->parent->slug.current == $slug || 
              category->parent->parent->slug.current == $slug
            )] | order(_createdAt desc) {
              _id,
              name,
              description,
              productImage,
              oldPrice,
              discountPercentage,
              currentPrice,
              affiliateLink,
              promoCode,
              expiryDate,
              rating,
              usersCount,
              "isVip": isVip == true,
              store->{
                name,
                "logo": logo.asset->url,
                "slug": slug.current
              }
            }`
          : `*[_type == "discount"] | order(_createdAt desc) {
              _id,
              name,
              description,
              productImage,
              oldPrice,
              discountPercentage,
              currentPrice,
              affiliateLink,
              promoCode,
              expiryDate,
              rating,
              usersCount,
              "isVip": isVip == true,
              store->{
                name,
                "logo": logo.asset->url,
                "slug": slug.current
              }
            }`;

        const itemsFetched = await client.fetch(
          itemsQuery, 
          currentCategorySlug ? { slug: currentCategorySlug } : {}
        );
        
        setItems(itemsFetched);
      } catch (error) {
        console.error("Error fetching discounts page data:", error);
      } finally {
        setLoading(false);
      }
    }

    getPageData();
  }, [currentCategorySlug]);

  // دالة تحميل المزيد عند الضغط (تزيد 12 تخفيض إضافي في كل ضغطة)
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 12);
  };

  // واجهة تحميل مرنة ومستقرة لمنع حدوث أي جليتش بصري
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 min-h-screen flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 min-h-screen">
      {categoryData ? (
        <div className="mb-8 border-b border-slate-100 pb-6">
          <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-3 flex-wrap">
            <span>{categoryData.name}</span>
            
            {/* حاوية تجمع النحلة وكلمة with باللون الأسود الواضح الصريح */}
            <div className="flex flex-col items-center justify-center select-none mx-1 relative h-14">
              <div className="bg-[#FFD700] w-9 h-9 rounded-[0.8rem] flex items-center justify-center text-base shadow-[0_10px_25px_rgba(255,215,0,0.3)] animate-bounce border border-white/20 z-10">
                🐝
              </div>
              <span className="text-[10px] font-black text-slate-900 absolute bottom-0 transition-all duration-300 tracking-widest animate-pulse">
                with
              </span>
            </div>

            <span className="text-slate-800">Savvy</span><span className="text-sky-500">Bee</span>
          </h1>
          {categoryData.description && (
            <p className="text-slate-500 text-sm mt-2 max-w-2xl">{categoryData.description}</p>
          )}
        </div>
      ) : (
        <div className="mb-8 border-b border-slate-100 pb-6">
          <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-3 flex-wrap">
            <span>All</span>
            
            {/* حاوية تجمع النحلة وكلمة with باللون الأسود الواضح الصريح في المسار حاف */}
            <div className="flex flex-col items-center justify-center select-none mx-1 relative h-14">
              <div className="bg-[#FFD700] w-9 h-9 rounded-[0.8rem] flex items-center justify-center text-base shadow-[0_10px_25px_rgba(255,215,0,0.3)] animate-bounce border border-white/20 z-10">
                🐝
              </div>
              <span className="text-[10px] font-black text-slate-900 absolute bottom-0 transition-all duration-300 tracking-widest animate-pulse">
                with
              </span>
            </div>

            <span className="text-slate-800">Savvy</span><span className="text-sky-500">Bee</span> Offers
          </h1>
          <p className="text-slate-500 text-sm mt-2 max-w-2xl">
            Browse through all available limited-time offers and dynamic flash discounts across all our categories.
          </p>
        </div>
      )}

      {/* استدعاء نفس كروت التصميم الفخم الحقيقي الممرر لها البيانات والـ Props بنسبة 100% */}
      {items.length > 0 ? (
        <div className="flex flex-col items-center w-full gap-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
            {items.slice(0, visibleCount).map((item: any, index: number) => {
              // تجهيز البيانات ومطابقتها مع كائن الـ Interface المتوقع داخل الـ DiscountsCard لتجنب أي مشاكل بالـ TypeScript
              const formattedDiscount = {
                id: index, 
                _id: item._id,
                name: item.name,
                store: item.store, 
                currentPrice: item.currentPrice,
                oldPrice: item.oldPrice,
                discountPercentage: item.discountPercentage,
                productImage: item.productImage,
                rating: item.rating || 4.5,
                isVip: item.isVip || false,
                promoCode: item.promoCode,
                description: item.description,
                affiliateLink: item.affiliateLink,
                usersCount: item.usersCount || 100
              };

              return (
                <DiscountsCard key={item._id} discount={formattedDiscount} />
              );
            })}
          </div>

          {/* نقل كود الزر والأنيميشن والتأثيرات كاملة 100% بدون أي نقص طبق الأصل من ملف الكوبونات */}
          {visibleCount < items.length && (
            <button
              onClick={handleLoadMore}
              className="group relative flex items-center gap-3 bg-[#1A1A1A] hover:bg-[#FFD700] text-white hover:text-black font-black text-base px-8 py-4 rounded-2xl shadow-xl transition-all duration-300 transform active:scale-95 overflow-hidden border-2 border-transparent hover:border-black"
            >
              {/* النحلة الشقية وحركتها الطائرة عند الـ Hover */}
              <span className="text-2xl transition-transform duration-500 group-hover:animate-bounce group-hover:translate-x-2">
                🐝
              </span>
              
              {/* تعديل الاسم المطلوب حراً ونقياً */}
              <span className="tracking-tight uppercase">Load More Sweet Discounts</span>
              
              {/* تأثير اللمعان الخلفي الشقي عند الـ Hover */}
              <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-[shimmer_3s_infinite] group-hover:via-black/5"></div>
            </button>
          )}
        </div>
      ) : (
        <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-400 font-medium">
          {currentCategorySlug 
            ? `No active flash discounts found for: "${currentCategorySlug}". Make sure to link the product to this sub-category in Sanity Studio.`
            : "No flash discounts found on the store currently."}
        </div>
      )}
    </div>
  );
}
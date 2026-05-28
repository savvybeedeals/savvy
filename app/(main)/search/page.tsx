"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { client } from "@/services/client"; // أو المسار الصحيح لعميل Sanity لديك
import CouponCard from "@/components/modules/coupon-card";
import { DiscountsCard } from "@/components/modules/discounts-card";
import DealCard from "@/components/modules/deals-card"; // استيراد كارت العروض الفخم الصحيح لعرض الـ Hot Deals
import { Loader2, Search, Ticket, Tag, ShoppingBag, Flame, ExternalLink } from "lucide-react";
import Link from "next/link";
import { createImageUrlBuilder } from '@sanity/image-url';

// إعداد دالة جلب الصور من الساني لعرض لوجو المتاجر بداخل الكارت الداخلي للمتاجر المكتشفة
const imageBuilder = createImageUrlBuilder({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
});

const urlFor = (source: any) => {
  return source ? imageBuilder.image(source).url() : null;
};

// مكون داخلي لمعالجة البحث بعد لفّه بـ Suspense لمنع أخطاء الـ Build في Next.js
function SearchResultsContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "";
  
  const [loading, setLoading] = useState(true);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]); // حالة حفظ الـ Deals المكتشفة
  const [stores, setStores] = useState<any[]>([]); // حالة حفظ الـ Stores المكتشفة

  // حالات التحكم في الليمت الافتراضي (يبدأ بـ 4 لكل قسم)
  const [visibleCoupons, setVisibleCoupons] = useState(4);
  const [visibleDiscounts, setVisibleDiscounts] = useState(4);
  const [visibleDeals, setVisibleDeals] = useState(4);

  useEffect(() => {
    async function fetchSearchResults() {
      if (!queryParam.trim()) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // تنظيف الكلمة للبحث الذكي
        const cleanQuery = queryParam.toLowerCase().trim();

        // 1. استعلام جلب الكوبونات التي تطابق اسم المتجر أو عنوان الكوبون مع تفكيك المتجر واللوجو بالكامل
        const couponsQuery = `*[_type == "coupon" && (lower(title) match $cleanQuery || lower(store->name) match $cleanQuery)] | order(_createdAt desc) {
          _id,
          title,
          code,
          discount,
          discountValue,
          description,
          affiliateUrl,
          affiliateLink,
          expiryDate,
          type,
          rating,
          reviewsCount,
          usersCount,
          "isVip": couponType == "vip",
          store-> { 
            name, 
            "logo": logo.asset->url, 
            "slug": slug.current 
          }
        }`;

        // 2. استعلام جلب الخصومات التي تطابق اسم المنتج أو المتجر مع تفكيك المتجر واللوجو بالكامل
        const discountsQuery = `*[_type == "discount" && (lower(name) match $cleanQuery || lower(store->name) match $cleanQuery)] | order(_createdAt desc) {
          "id": _id,
          _id,
          name,
          currentPrice,
          oldPrice,
          productImage,
          promoCode,
          affiliateLink,
          description,
          rating,
          isVip,
          usersCount,
          store-> { 
            name, 
            "logo": logo.asset->url, 
            "slug": slug.current 
          }
        }`;

        // 3. استعلام جلب الصفقات (Deals) - فحص ذكي وشامل لحالة الـ VIP لضمان التقاطها بأي شكل مخزنة به
        const dealsQuery = `*[(_type == "deal" || _type == "deals") && (lower(title) match $cleanQuery || lower(store->name) match $cleanQuery)] | order(_createdAt desc) {
          _id,
          title,
          description,
          expiryDate,
          usersCount,
          rating,
          reviewsCount,
          "isVip": isVip == true || couponType == "vip" || dealType == "vip",
          "discount": coalesce(secondTitle, discountPrice, price, "PROMO"),
          "secondTitle": secondTitle,
          "affiliateUrl": coalesce(affiliateLink, affiliateUrl, "#"),
          store-> { 
            name, 
            logo,
            "slug": slug.current 
          }
        }`;

        // 4. استعلام جلب المتاجر (Stores) التي يطابق اسمها كلمة البحث المباشرة لتوجيه المستخدمين إليها
        const storesQuery = `*[_type == "store" && (lower(name) match $cleanQuery || lower(metaTitle) match $cleanQuery)] | order(name asc) {
          _id,
          name,
          "slug": slug.current,
          logo,
          url,
          isFeatured,
          description
        }`;

        // تنفيذ كافة الاستعلامات بالتوازي لضمان أقصى سرعة أداء واستجابة للموقع
        const [couponsData, discountsData, dealsData, storesData] = await Promise.all([
          client.fetch(couponsQuery, { cleanQuery: `*${cleanQuery}*` }),
          client.fetch(discountsQuery, { cleanQuery: `*${cleanQuery}*` }),
          client.fetch(dealsQuery, { cleanQuery: `*${cleanQuery}*` }),
          client.fetch(storesQuery, { cleanQuery: `*${cleanQuery}*` })
        ]);

        setCoupons(couponsData || []);
        setDiscounts(discountsData || []);
        setDeals(dealsData || []);
        setStores(storesData || []);
        
        // إعادة تعيين العدادات لـ 4 عند القيام بعملية بحث جديدة تماماً
        setVisibleCoupons(4);
        setVisibleDiscounts(4);
        setVisibleDeals(4);
      } catch (error) {
        console.error("Error during sanity search fetch:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSearchResults();
  }, [queryParam]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3 text-slate-500">
        <Loader2 className="w-10 h-10 animate-spin text-sky-500" />
        <p className="text-sm font-bold tracking-widest">SEARCHING THE HONEYCOMB...</p>
      </div>
    );
  }

  // حساب إجمالي النتائج التي تم العثور عليها بكافة التصنيفات
  const totalResultsCount = coupons.length + discounts.length + deals.length + stores.length;
  const hasResults = totalResultsCount > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* رأس الصفحة */}
      <div className="mb-10">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-950 flex items-center gap-3">
          <Search className="w-7 h-7 text-sky-500" />
          <span>Search Results for: <span className="text-sky-500">"{queryParam}"</span></span>
        </h1>
        <p className="text-slate-500 text-sm font-medium mt-1">
          We found {totalResultsCount} available offers matching your request.
        </p>
      </div>

      {!hasResults ? (
        <div className="text-center py-20 bg-gray-50 border border-dashed border-gray-200 rounded-3xl">
          <div className="text-4xl mb-3">🐝</div>
          <h3 className="text-lg font-black text-slate-800">No Matches Found</h3>
          <p className="text-slate-400 text-sm font-semibold max-w-md mx-auto mt-1">
            We couldn't find any coupons, discounts, deals or stores for "{queryParam}" right now. Try searching for other top brands like Amazon, Walmart or ASOS.
          </p>
        </div>
      ) : (
        <div className="space-y-16">
          {/* قسم المتاجر المكتشفة المباشرة */}
          {stores.length > 0 && (
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-6 border-b pb-3 border-gray-100">
                <ShoppingBag className="w-5 h-5 text-indigo-500" />
                <span>Matching Stores ({stores.length})</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {stores.map((store) => {
                  const storeLogoUrl = urlFor(store.logo);
                  return (
                    <Link
                      key={store._id}
                      href={`/stores/${store.slug}`}
                      className="group flex flex-col items-center p-6 bg-white rounded-2xl border border-slate-100 hover:border-indigo-500 hover:shadow-xl transition-all duration-300 text-center relative overflow-hidden"
                    >
                      <div className="w-20 h-20 bg-slate-50 rounded-xl flex items-center justify-center p-3 mb-4 group-hover:scale-105 transition-transform duration-300 border border-slate-100/80">
                        {storeLogoUrl ? (
                          <img src={storeLogoUrl} alt={store.name} className="max-w-full max-h-full object-contain" />
                        ) : (
                          <span className="text-xl font-bold text-slate-400">{store.name?.charAt(0)}</span>
                        )}
                      </div>
                      <h3 className="font-black text-slate-800 text-sm group-hover:text-indigo-600 transition-colors line-clamp-1">{store.name}</h3>
                      <span className="text-[10px] bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 font-bold px-2.5 py-1 rounded-full mt-2 transition-colors flex items-center gap-1">
                        <span>Visit Store</span>
                        <ExternalLink size={10} />
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* 1- قسم الكوبونات المكتشفة (Available Coupons) */}
          {coupons.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b pb-3 border-gray-100">
                <Ticket className="w-5 h-5 text-amber-500" />
                <span>Available Coupons ({coupons.length})</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {coupons.slice(0, visibleCoupons).map((coupon) => (
                  <CouponCard key={coupon._id} coupon={coupon} />
                ))}
              </div>
              {visibleCoupons < coupons.length && (
                <div className="flex justify-center pt-2">
                  <button
                    onClick={() => setVisibleCoupons((prev) => prev + 4)}
                    className="flex items-center gap-2 bg-slate-900 hover:bg-amber-500 text-white hover:text-slate-950 font-black text-xs px-6 py-3 rounded-xl transition-all duration-300 transform active:scale-95 shadow-md uppercase tracking-wider"
                  >
                    <span>Load More Coupons</span>
                    <span className="text-base">🐝</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 2- قسم الخصومات والعروض المكتشفة (Exclusive Discounts) */}
          {discounts.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b pb-3 border-gray-100">
                <Tag className="w-5 h-5 text-emerald-500" />
                <span>Exclusive Discounts ({discounts.length})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {discounts.slice(0, visibleDiscounts).map((discount) => (
                  <DiscountsCard key={discount._id} discount={discount} />
                ))}
              </div>
              {visibleDiscounts < discounts.length && (
                <div className="flex justify-center pt-2">
                  <button
                    onClick={() => setVisibleDiscounts((prev) => prev + 4)}
                    className="flex items-center gap-2 bg-slate-900 hover:bg-emerald-500 text-white hover:text-slate-950 font-black text-xs px-6 py-3 rounded-xl transition-all duration-300 transform active:scale-95 shadow-md uppercase tracking-wider"
                  >
                    <span>Load More Discounts</span>
                    <span className="text-base">🐝</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 3- قسم الصفقات الساخنة (Hot Deals) */}
          {deals.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b pb-3 border-gray-100">
                <Flame className="w-5 h-5 text-red-500" />
                <span>Hot Deals ({deals.length})</span>
              </h2>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 w-full">
                {deals.slice(0, visibleDeals).map((deal) => (
                  <DealCard 
                    key={deal._id} 
                    _id={deal._id}
                    id={deal._id}
                    storeName={deal.store?.name || "Store"} 
                    storeLogo={deal.store?.logo} 
                    discount={deal.discount} 
                    title={deal.title} 
                    secondTitle={deal.secondTitle} 
                    description={deal.description} 
                    isVip={!!deal.isVip} // تحويل صارم إلى Boolean حقيقي لضمان استجابة الكارت فوراً عند تسجيل الخروج
                    expiryDate={deal.expiryDate} 
                    usersCount={deal.usersCount} 
                    affiliateUrl={deal.affiliateUrl} 
                    storeSlug={deal.store?.slug} // تمرير النص الصافي للـ Slug مباشرة كما يتوقعه كارت العروض
                    rating={deal.rating}
                    reviewsCount={deal.reviewsCount}
                  />
                ))}
              </div>
              {visibleDeals < deals.length && (
                <div className="flex justify-center pt-2">
                  <button
                    onClick={() => setVisibleDeals((prev) => prev + 4)}
                    className="flex items-center gap-2 bg-slate-900 hover:bg-red-500 text-white hover:text-slate-950 font-black text-xs px-6 py-3 rounded-xl transition-all duration-300 transform active:scale-95 shadow-md uppercase tracking-wider"
                  >
                    <span>Load More Deals</span>
                    <span className="text-base">🐝</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// المكون الرئيسي المغلف بـ Suspense لحماية نظام الـ Build
export default function SearchPage() {
  return (
    <div className="min-h-screen bg-white">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center py-32 gap-3 text-slate-500">
          <Loader2 className="w-10 h-10 animate-spin text-sky-500" />
          <p className="text-sm font-bold tracking-widest">LOADING SEARCH ENGINE...</p>
        </div>
      }>
        <SearchResultsContent />
      </Suspense>
    </div>
  );
}
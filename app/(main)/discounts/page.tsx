"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Tag } from "lucide-react";
import { client } from "@/services/client";
import { DiscountsGrid } from "@/components/collections/discounts-grid";
import CategoryFilter from "@/components/collections/category-filter";

export default function DiscountsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // حالات الـ States الخاصة بالفلتر الممررة للمكون المتوافق
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStore, setSelectedStore] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [filterVipOnly, setFilterVipOnly] = useState(false);

  // جلب البيانات يدوياً
  useEffect(() => {
    async function getDiscountsData() {
      setLoading(true);
      try {
        const itemsQuery = `*[_type == "discount"] | order(_createdAt desc) {
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
          category->{ name, "slug": slug.current },
          store->{ name, "logo": logo.asset->url, "slug": slug.current }
        }`;

        const itemsFetched = await client.fetch(itemsQuery);
        setItems(itemsFetched);
      } catch (error) {
        console.error("Error fetching discounts data:", error);
      } finally {
        setLoading(false);
      }
    }

    getDiscountsData();
  }, []);

  // 1. استخراج الفئات المتاحة ديناميكياً بأمان للفلتر
  const categoriesList = useMemo(() => {
    const cats = items
      .map((d) => typeof d.category === 'object' ? d.category?.name : d.category)
      .filter((c): c is string => typeof c === 'string' && c.trim() !== "");
    return Array.from(new Set(cats)).sort();
  }, [items]);

  // 2. استخراج المتاجر المتاحة ديناميكياً بأمان للفلتر
  const storesList = useMemo(() => {
    const stores = items
      .map((d) => d?.store?.name)
      .filter((name): name is string => typeof name === 'string' && name.trim() !== "");
    return Array.from(new Set(stores)).sort();
  }, [items]);

  // 3. معالجة الفلترة والترتيب الآمنة تماماً داخل الصفحة قبل التمرير للشبكة
  const processedDiscounts = useMemo(() => {
    let result = items.filter((item) => {
      if (!item) return false;

      const storeName = item.store?.name?.toLowerCase() || "";
      const title = item.name?.toLowerCase() || "";
      const desc = item.description?.toLowerCase() || "";
      
      const rawCat = typeof item.category === 'object' ? item.category?.name : item.category;
      const cat = typeof rawCat === 'string' ? rawCat.toLowerCase() : "";
      
      const cleanQuery = searchQuery.toLowerCase().trim();
      
      const matchesSearch = storeName.includes(cleanQuery) || title.includes(cleanQuery) || desc.includes(cleanQuery);
      const matchesCategory = selectedCategory === "all" || cat === selectedCategory.toLowerCase();
      const matchesStore = selectedStore === "all" || item.store?.name === selectedStore;
      const matchesVip = !filterVipOnly || item.isVip === true;

      return matchesSearch && matchesCategory && matchesStore && matchesVip;
    });

    // الترتيب
    if (sortBy === "popular") {
      result.sort((a, b) => (b?.usersCount || 0) - (a?.usersCount || 0));
    } else {
      result.sort((a, b) => {
        const timeA = new Date(a?._createdAt || a?.createdAt || 0).getTime();
        const timeB = new Date(b?._createdAt || b?.createdAt || 0).getTime();
        return timeB - timeA;
      });
    }

    return result;
  }, [items, searchQuery, selectedCategory, selectedStore, sortBy, filterVipOnly]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 min-h-screen flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
      
      {/* ================= HEADER SECTION ================= */}
      <header className="bg-white border-b border-slate-100 py-12 px-6 mb-10">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="bg-amber-50 text-amber-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 mb-6 border border-amber-100">
            <Tag size={14} />
            {processedDiscounts.length} Active Flash Discounts Available
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4">
            Today's Best <span className="text-sky-500">Discounts</span>
          </h1>
          
          <p className="max-w-2xl text-slate-500 font-medium text-lg leading-relaxed">
            Get instant price drops on premium products from top global stores. 
            Don't miss out on these exclusive, limited-time deals verified by our team.
          </p>
        </div>
      </header>

      {/* ================= FILTER & GRID SECTION ================= */}
      <section className="max-w-7xl mx-auto px-6 space-y-8">
        
        {/* حقن الفلتر المحدث */}
        <CategoryFilter
          searchQuery={searchQuery} setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
          selectedStore={selectedStore} setSelectedStore={setSelectedStore}
          sortBy={sortBy} setSortBy={setSortBy}
          categoriesList={categoriesList} storesList={storesList}
          filterVipOnly={filterVipOnly} setFilterVipOnly={setFilterVipOnly}
        />

        {/* تمرير مصفوفة البيانات التي تم فلترتها بنجاح لتتكفل الشبكة بعرض أول 12 فقط */}
        <DiscountsGrid discounts={processedDiscounts} />
      </section>

      {/* ================= SEO CONTENT SECTION ================= */}
      <section className="max-w-4xl mx-auto px-6 mt-20 pt-10 border-t border-slate-200">
        <h2 className="text-2xl font-black text-slate-800 mb-4 uppercase italic tracking-tighter">
          Why Shop via Savvy Bee Discounts?
        </h2>
        <div className="grid md:grid-cols-3 gap-8 text-slate-600 font-medium text-sm leading-relaxed">
          <p>
            <strong className="text-sky-500 block mb-1">1. Biggest Price Drops</strong>
            We monitor major retailers continuously to curate the lowest prices across electronics, fashion, and everyday essentials.
          </p>
          <p>
            <strong className="text-sky-500 block mb-1">2. Member Exclusives</strong>
            Unlock special Savvy VIP prices and hidden price cuts simply by being part of our free smart shoppers community.
          </p>
          <p>
            <strong className="text-sky-500 block mb-1">3. Direct Buying Links</strong>
            Skip the hassle. Every discount includes direct, safe affiliate links straight to the verified store checkout.
          </p>
        </div>
      </section>
      
    </div>
  );
}
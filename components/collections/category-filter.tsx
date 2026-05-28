"use client";

import React from 'react';
import { Search } from 'lucide-react';

interface CategoryFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedStore: string;
  setSelectedStore: (store: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  categoriesList: string[];
  storesList: string[];
  filterVipOnly: boolean;
  setFilterVipOnly: (vip: boolean) => void;
}

export default function CategoryFilter({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedStore,
  setSelectedStore,
  categoriesList,
  storesList,
  filterVipOnly,
  setFilterVipOnly,
}: CategoryFilterProps) {
  return (
    <div className="w-full bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-5">
      
      {/* 1. السطر الرئيسي العلوي الموحد (البحث، الفلاتر، وزر الـ VIP على اليمين تماماً) */}
      <div className="flex flex-col lg:flex-row gap-4 items-center w-full">
        
        {/* حقل البحث الذكي */}
        <div className="relative w-full lg:flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by store name, deal title or description..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-sm font-medium"
          />
        </div>

        {/* حاوية تجمع الفلاتر وخيار الـ VIP بجانب البحث */}
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto items-center shrink-0">
          {/* فلتر الأقسام */}
          <div className="w-full sm:w-44">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-slate-600 text-xs font-bold transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            >
              <option value="all">All Categories</option>
              {categoriesList.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* فلتر المتاجر */}
          <div className="w-full sm:w-44">
            <select
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-slate-600 text-xs font-bold transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            >
              <option value="all">All Stores</option>
              {storesList.map((store) => (
                <option key={store} value={store}>{store}</option>
              ))}
            </select>
          </div>

          {/* تصعيد خيار الـ VIP السحري بجانب الـ All Store من جهة اليمين تماماً */}
          <div className="w-full sm:w-auto shrink-0 flex justify-end pl-2">
            <label className="flex items-center gap-2.5 cursor-pointer select-none bg-amber-50/50 hover:bg-amber-50 border border-amber-100/70 px-4 py-2.5 rounded-2xl transition-all">
              <input
                type="checkbox"
                checked={filterVipOnly}
                onChange={(e) => setFilterVipOnly(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 border-amber-300 focus:ring-amber-500/20 cursor-pointer"
              />
              <span className="text-xs font-black uppercase tracking-wider text-amber-700 flex items-center gap-1.5 whitespace-nowrap">
                👑 VIP Only
              </span>
            </label>
          </div>
        </div>

      </div>

      {/* 2. شريط الأزرار التفاعلية السفلي بسكرول مرن وسلس يميناً ويساراً للأقسام */}
      <div className="pt-3 border-t border-slate-100 w-full">
        <div className="w-full overflow-x-auto no-scrollbar flex items-center gap-2 pb-1 scroll-smooth snap-x">
          
          {/* زر عرض الكل الافتراضي */}
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap snap-start transition-all duration-200 border cursor-pointer select-none
              ${selectedCategory === "all" 
                ? "bg-sky-500 text-white border-sky-500 shadow-sm" 
                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
          >
            🐝 All Deals
          </button>

          {/* توليد أزرار للأقسام المتوفرة ديناميكياً */}
          {categoriesList.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap snap-start transition-all duration-200 border cursor-pointer select-none
                  ${isSelected 
                    ? "bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-sm" 
                    : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                  }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
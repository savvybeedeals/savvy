"use client";
import React from 'react';
import { Search, Store } from 'lucide-react';

interface DealsFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedStore: string;
  setSelectedStore: (store: string) => void;
  storesList: string[];
}

export default function DealsFilter({
  searchQuery,
  setSearchQuery,
  selectedStore,
  setSelectedStore,
  storesList,
}: DealsFilterProps) {
  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
      {/* حقل البحث الذكي للعروض */}
      <div className="relative w-full md:flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Search by store name, offer title, or discount value..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white transition-all text-sm"
        />
      </div>

      {/* قائمة المتاجر المتاحة ديناميكياً */}
      <div className="relative w-full md:w-64">
        <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <select
          value={selectedStore}
          onChange={(e) => setSelectedStore(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-700 focus:outline-none focus:border-sky-500 focus:bg-white transition-all text-sm appearance-none cursor-pointer"
        >
          <option value="all">All Stores</option>
          {storesList.map((storeName) => (
            <option key={storeName} value={storeName}>
              {storeName}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-500 w-0 h-0"></div>
      </div>
    </div>
  );
}
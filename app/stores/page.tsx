"use client";

import React, { useState, useEffect } from "react";
import { getAllStores } from "@/services/store-service";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { Tag, Search, X, Sparkles, ArrowRight } from "lucide-react";
import { Store } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

export default function StoresDirectoryPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllStores();
        setStores(data);
        setFilteredStores(data);
      } catch (error) {
        console.error("Error fetching stores:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const results = stores.filter((store) =>
      store.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredStores(results);
  }, [searchQuery, stores]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20 overflow-x-hidden">
      {/* Header Section - تم تقليص المساحات (py-6 و mb-4) لتقليل الاسكرولينج */}
      <header className="relative bg-white border-b border-slate-100 py-6 px-6 mb-4 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-50 rounded-full blur-3xl -ml-32 -mb-32 opacity-50" />

        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-sky-50 text-sky-600 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2 mb-3 border border-sky-100 shadow-sm"
          >
            <Sparkles size={12} className="animate-pulse" />
            {stores.length} Premium Brands Verified
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-2"
          >
            Brand <span className="text-sky-500">Universe</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-xl text-slate-400 font-medium text-sm md:text-base leading-relaxed mb-5"
          >
            Your ultimate gateway to exclusive deals from the world&apos;s most trusted retailers.
          </motion.p>

          {/* محرك البحث مع تأثير الوهج (Glowing) - تصميم مضغوط */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative w-full max-w-lg mx-auto group"
          >
            {/* طبقة الوهج الخارجية */}
            <div className="absolute -inset-1 bg-gradient-to-r from-sky-400 to-blue-500 rounded-[2rem] blur opacity-20 group-hover:opacity-40 group-focus-within:opacity-60 transition duration-500"></div>
            
            <div className="relative flex items-center">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <Search size={18} className="text-slate-300 group-focus-within:text-sky-500 transition-colors duration-300" />
              </div>
              <input
                type="text"
                placeholder="Quick search brands..."
                className="w-full pl-12 pr-12 py-3 bg-white border border-slate-100 rounded-[2rem] shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500/10 focus:border-sky-400 transition-all text-slate-700 font-semibold text-sm relative z-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-5 flex items-center text-slate-400 hover:text-sky-500 transition-colors z-20"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </header>

      {/* Grid Section */}
      <section className="max-w-7xl mx-auto px-6">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="h-40 bg-white border border-slate-100 rounded-[2rem] animate-pulse" />
            ))}
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {filteredStores.map((store, index) => (
                <motion.div
                  layout
                  key={store._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.02 }}
                >
                  <Link 
                    href={`/stores/${store.slug.current}`}
                    className="group relative p-6 bg-white border border-slate-100 rounded-[2rem] hover:shadow-[0_15px_40px_rgba(0,186,255,0.1)] hover:-translate-y-1.5 transition-all duration-500 text-center flex flex-col items-center justify-center overflow-hidden h-full"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-sky-50/0 to-sky-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative h-12 w-full mb-4 z-10">
                      <Image 
                        src={urlFor(store.logo).url()} 
                        alt={store.name} 
                        fill 
                        className="object-contain grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"
                      />
                    </div>
                    
                    <p className="font-black text-slate-700 group-hover:text-sky-600 transition-colors relative z-10 uppercase tracking-tighter text-xs">
                      {store.name}
                    </p>

                    <div className="mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-1 text-[9px] font-bold text-sky-400">
                      EXPLORE <ArrowRight size={10} />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && filteredStores.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100"
          >
            <div className="text-slate-300 mb-4 flex justify-center">
              <Search size={48} strokeWidth={1} />
            </div>
            <div className="text-slate-900 font-black text-xl">No Brands Found</div>
            <p className="text-slate-400 mt-2 text-sm">We couldn&apos;t find any results for &quot;{searchQuery}&quot;</p>
            <button 
              onClick={() => setSearchQuery("")}
              className="mt-4 text-sky-500 font-bold hover:underline text-sm"
            >
              Clear Search
            </button>
          </motion.div>
        )}
      </section>

      {/* SEO Content Section - تم تحديثه لإضافة بادج النحلة المعتاد */}
      <section className="max-w-7xl mx-auto px-6 mt-20">
        <div className="relative p-8 md:p-14 bg-slate-900 rounded-[3rem] overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 blur-[120px]" />
          
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center text-white">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-5xl font-black leading-tight italic">
                Why shop via 
                <span className="flex items-center gap-3 my-2">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-[#FFD700] w-12 h-12 md:w-16 md:h-16 rounded-[1.2rem] md:rounded-[1.5rem] flex items-center justify-center text-xl md:text-3xl shadow-[0_15px_40px_rgba(255,215,0,0.25)] animate-bounce border-2 border-white/20"
                  >
                    🐝
                  </motion.div>
                  <span className="text-sky-400 font-black not-italic uppercase tracking-tighter">Savvy Bee Directory?</span>
                </span>
              </h2>
              <p className="text-slate-300 font-medium text-base md:text-lg leading-relaxed max-w-lg">
                We act as a premium bridge between you and the world&apos;s most renowned retailers, 
                curating exclusive access to ensure you never pay full price on top-tier brands again.
              </p>
            </div>
            
            <div className="grid gap-6 border-l border-white/10 pl-8 md:pl-12">
              {[
                { title: "Verified Partners", desc: "Every brand in our universe undergoes a rigorous safety and authenticity vetting process." },
                { title: "Real-time Updates", desc: "Our intelligent directory syncs hourly to bring you the latest verified deals and stores." },
                { title: "Seamless Experience", desc: "Navigate directly to official stores through secure, encrypted affiliate gateways." }
              ].map((item, i) => (
                <div key={i} className="group">
                  <h4 className="font-bold text-sky-400 group-hover:translate-x-2 transition-transform duration-300 flex items-center gap-3 text-lg md:text-xl mb-1">
                    <Tag size={20} className="text-sky-500" /> {item.title}
                  </h4>
                  <p className="text-sm md:text-base text-slate-400 leading-snug">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, Globe, User, ChevronDown, Flame, Ticket, Tag, TrendingDown, LogOut, ChevronRight, Settings, Shield, FileText, HelpCircle, Store, Menu, Smartphone } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/auth-context'; 
import { getCategoriesTree } from '@/services/category-service';
import { Category } from '@/types';
import MobileMenu from './mobile-menu'; // استيراد المنيو المطور للموبايل
import { client } from '@/services/client'; // استيراد عميل الساني لجلب الروابط بشكل آمن

const DEFAULT_OFFERS = [
  { id: "deals", text: "Limited Time: Get up to 80% Off on Top US & UK Brands.", link: "/deals" },
  { id: "coupons", text: "Flash Sale: Find the best exclusive coupons today!", link: "/coupons" },
  { id: "trending", text: "New Coupons Added: Check latest trending deals & discounts.", link: "/trending" },
];

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentOffer, setCurrentOffer] = useState(0);
  const [categoriesTree, setCategoriesTree] = useState<Category[]>([]);
  const [dynamicOffers, setDynamicOffers] = useState<Array<{ id: string | number, text: string, link: string }>>(DEFAULT_OFFERS);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // حالة التحكم في منيو الموبايل
  
  // الحالات الجديدة المضافة لإدارة روابط التطبيق من سانتي
  const [appLinks, setAppLinks] = useState<{ googlePlay?: string; appStore?: string } | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user, logout } = useAuth();

  const displayName = user?.user_metadata?.first_name || user?.user_metadata?.name || user?.email?.split('@')[0] || "Account";

  const getSafeSlug = (cat: any) => {
    if (cat?.slug?.current) return cat.slug.current;
    if (cat?.name) {
      return cat.name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }
    return cat?._id || "";
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategoriesTree();
        setCategoriesTree(data || []);
        
        if (data && data.length > 0) {
          const generatedOffers = data.slice(0, 3).map((cat: any) => {
            const slug = getSafeSlug(cat);
            return {
              id: cat._id,
              text: `Explore top coupons and exclusive deals under ${cat.name} category!`,
              link: `/categories/${slug}`
            };
          });
        
          setDynamicOffers([
            { id: "default-deals", text: "Limited Time: Get up to 80% Off on Top US & UK Brands.", link: "/deals" },
            ...generatedOffers,
            { id: "default-trending", text: "Exclusive: Search coupons for Amazon, Walmart & top stores.", link: "/search?q=amazon" }
          ]);
        }
      } catch (error) {
        console.error("Error fetching categories tree:", error);
      }
    };
    fetchCategories();
  }, []);

  // تأثير جلب روابط التطبيقات ديناميكياً من سانتي (Sanity) لحقنها في القائمة المنسدلة
  useEffect(() => {
    const fetchAppLinks = async () => {
      try {
        // يتم الاستعلام عن أول وثيقة تحتوي على إعدادات الروابط أو إعدادات الموقع العامة
        const data = await client.fetch(`*[_type in ["appSettings", "siteSettings", "siteConfig"]][0]{
          googlePlay,
          appStore
        }`);
        if (data) {
          setAppLinks({
            googlePlay: data.googlePlay || "",
            appStore: data.appStore || ""
          });
        }
      } catch (error) {
        console.error("Error fetching app links from Sanity:", error);
      }
    };
    fetchAppLinks();
  }, []);

  useEffect(() => {
    if (dynamicOffers.length === 0) return;
    const timer = setInterval(() => {
      setCurrentOffer((prev) => (prev + 1) % dynamicOffers.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [dynamicOffers]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      router.push(`/search?q=${encodeURIComponent(trimmedQuery.toLowerCase())}`);
    }
  };

  return (
    <div className="w-full">
      {/* 1. Top Announcement Bar */}
      <div className="w-full bg-[#333333] text-white py-2 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto relative h-5">
          <AnimatePresence mode="wait">
            {dynamicOffers[currentOffer] && (
              <motion.p
                key={dynamicOffers[currentOffer].id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="text-center text-xs sm:text-sm font-medium w-full"
              >
                <span className="text-[#FFD700] font-bold uppercase mr-2">Hot Offer:</span>
                {dynamicOffers[currentOffer].text}
                <Link href={dynamicOffers[currentOffer].link} className="ml-2 underline hover:text-[#FFD700] transition-colors">
                  Check Now
                </Link>
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-[100] shadow-sm">
        {/* 2. Main Header Row */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          
          {/* Logo & Icon */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group cursor-pointer">
            <div className="w-10 h-10 bg-[#FFD700] flex items-center justify-center [clip-path:polygon(25%_0%,_75%_0%,_100%_50%,_75%_100%,_25%_100%,_0%_50%)] group-hover:rotate-12 transition-transform duration-300">
               <span className="text-black font-black text-xl italic">S</span>
            </div>
            <span className="text-xl sm:text-2xl font-black text-[#333333] tracking-tighter uppercase">
              Savvy<span className="text-sky-500">Bee</span>Deals
            </span>
          </Link>

          {/* Search Bar - Hidden on Mobile, Visible on Desktop */}
          <form onSubmit={handleSearch} className="flex-grow max-w-2xl relative hidden md:block">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search coupons for Amazon, Walmart, ASOS..." 
              className="w-full bg-gray-50 border border-gray-200 rounded-full py-2.5 px-12 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/5 text-black font-semibold outline-none transition-all shadow-sm"
            />
            <button type="submit" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-sky-500 transition-colors">
              <Search className="w-5 h-5" />
            </button>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <div className="hidden lg:flex items-center gap-2 text-slate-900 text-sm font-black border-r pr-4 border-gray-200">
              <Globe className="w-4 h-4 text-sky-500" />
              <span>USA / UK</span>
            </div>

            {user ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link 
                  href="/profile" 
                  className="bg-slate-100 text-slate-900 px-3 sm:px-5 py-2.5 rounded-full font-black hover:bg-slate-200 transition-all shadow-sm flex items-center gap-2 text-xs sm:text-sm active:scale-95 border border-slate-200/60 max-w-[120px] sm:max-w-[160px] truncate"
                >
                  <User className="w-4 h-4 text-slate-800 shrink-0" />
                  <span className="truncate">{displayName}</span>
                </Link>

                {/* Dropdown Menu */}
                <div className="relative" ref={menuRef}>
                  <button 
                    onClick={() => setIsSettingsOpen(!isSettingsOpen)} 
                    className={`p-2.5 rounded-full transition-all active:scale-95 border border-transparent hover:shadow-sm ${isSettingsOpen ? 'bg-slate-100 text-slate-900 rotate-45' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
                    title="Settings"
                  >
                    <Settings className="w-4 h-4 transition-transform duration-200" />
                  </button>

                  <AnimatePresence>
                    {isSettingsOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 shadow-2xl rounded-2xl py-2 z-[120]"
                      >
                        <Link 
                          href="/privacy" 
                          onClick={() => setIsSettingsOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors text-xs font-black"
                        >
                          <Shield className="w-3.5 h-3.5 text-slate-400" />
                          <span>Privacy</span>
                        </Link>

                        <Link 
                          href="/terms" 
                          onClick={() => setIsSettingsOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors text-xs font-black"
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-400" />
                          <span>Terms</span>
                        </Link>

                        <Link 
                          href="/contact" 
                          onClick={() => setIsSettingsOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors text-xs font-black"
                        >
                          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                          <span>Report (Contact Us)</span>
                        </Link>

                        <div className="my-1 border-t border-gray-100" />

                        <button 
                          onClick={() => {
                            setIsSettingsOpen(false);
                            logout?.();
                          }} 
                          className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors text-xs font-black text-left"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Logout</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Hamburger Button for Mobile Menu (Positioned aligned next to the gear icon) */}
                <motion.button 
                  onClick={() => setIsMobileMenuOpen(true)} 
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2.5 rounded-full text-sky-600 bg-sky-50 hover:bg-sky-100 md:hidden transition-all shadow-sm flex items-center justify-center border border-sky-100"
                >
                  <Menu className="w-5 h-5" />
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center gap-3 sm:gap-4">
                {/* زر موحد ونظيف لتسجيل الدخول يدخل مباشرة على صفحة اللوجن */}
                <Link 
                  href="/login" 
                  className="bg-[#333333] text-white px-5 sm:px-6 py-2.5 rounded-full font-black hover:bg-black transition-all shadow-md flex items-center gap-2 text-xs sm:text-sm active:scale-95"
                >
                  <User className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>

                {/* Hamburger Button for Mobile Menu (Fallback when user is logged out) */}
                <motion.button 
                  onClick={() => setIsMobileMenuOpen(true)} 
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2.5 rounded-full text-sky-600 bg-sky-50 hover:bg-sky-100 md:hidden transition-all shadow-sm flex items-center justify-center border border-sky-100"
                >
                  <Menu className="w-5 h-5" />
                </motion.button>
              </div>
            )}
          </div>
        </div>

        {/* 3. Navigation Bar */}
        <nav className="border-t border-gray-50 bg-white hidden md:block">
          <div className="max-w-7xl mx-auto px-6 flex items-center gap-8 py-3 text-sm font-black text-slate-900">
             
             {/* Categories Dropdown Container */}
             <div className="relative group pb-2 -mb-2"> 
                <button className="flex items-center gap-1 group-hover:text-amber-600 transition-colors py-1 font-black">
                  Categories <ChevronDown className="w-3 h-3 text-slate-900 group-hover:text-amber-600 group-hover:rotate-180 transition-transform" />
                </button>
                
                <div className="absolute top-[calc(100%-4px)] left-0 w-64 bg-white border border-gray-100 shadow-2xl rounded-2xl py-3 
                                opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0
                                transition-all duration-300 ease-out z-[110] mt-0 pointer-events-none group-hover:pointer-events-auto">
                  
                  {categoriesTree.map((mainCat) => {
                    const mainSlug = getSafeSlug(mainCat);
                    const hasSubCategories = mainCat.subCategories && mainCat.subCategories.length > 0;
                    
                    return (
                      <div key={mainCat._id} className="relative group/sub min-w-full z-10">
                        {/* Level 1 */}
                        {hasSubCategories ? (
                          <div 
                            className="flex items-center justify-between px-6 py-2.5 text-black font-black hover:bg-amber-500/10 hover:text-amber-600 transition-colors duration-150 rounded-lg mx-2 cursor-default select-none"
                          >
                            <span className="tracking-wide">{mainCat.name}</span>
                            <ChevronRight className="w-4 h-4 text-slate-900 group-hover/sub:text-amber-600 transition-transform group-hover/sub:translate-x-0.5" />
                          </div>
                        ) : (
                          <Link 
                            href={`/categories/${mainSlug}`} 
                            className="flex items-center justify-between px-6 py-2.5 text-black font-black hover:bg-amber-500/10 hover:text-amber-600 transition-colors duration-150 rounded-lg mx-2"
                          >
                            <span className="tracking-wide">{mainCat.name}</span>
                          </Link>
                        )}

                        {/* Level 2 */}
                        {hasSubCategories && (
                          <div className="absolute top-0 left-[calc(100%-4px)] w-60 bg-white border border-gray-100 shadow-2xl rounded-2xl py-2
                                          opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible translate-x-2 group-hover/sub:translate-x-0
                                          transition-all duration-200 ease-out ml-1 pointer-events-none group-hover/sub:pointer-events-auto">
                            
                            {mainCat.subCategories!.map((subCat) => {
                              const subSlug = getSafeSlug(subCat);
                              const hasSubSubCategories = subCat.subSubCategories && subCat.subSubCategories.length > 0;
                              
                              return (
                                <div key={subCat._id} className="relative group/subsub min-w-full z-10">
                                  {/* Level 2 Main item */}
                                  {hasSubSubCategories ? (
                                    <div
                                      className="flex items-center justify-between px-5 py-2 text-slate-900 hover:bg-amber-500/10 hover:text-amber-600 transition-colors duration-150 font-extrabold text-[13px] rounded-lg mx-1 cursor-default select-none"
                                    >
                                      <span>{subCat.name}</span>
                                      <ChevronRight className="w-3.5 h-3.5 text-slate-900 group-hover/subsub:text-amber-600 transition-transform group-hover/subsub:translate-x-0.5" />
                                    </div>
                                  ) : (
                                    <Link
                                      href={`/categories/${mainSlug}/${subSlug}`}
                                      className="flex items-center justify-between px-5 py-2 text-slate-900 hover:bg-amber-500/10 hover:text-amber-600 transition-colors duration-150 font-extrabold text-[13px] rounded-lg mx-1"
                                    >
                                      <span>{subCat.name}</span>
                                    </Link>
                                  )}

                                  {/* Level 3 */}
                                  {hasSubSubCategories && (
                                    <div className="absolute top-0 left-[calc(100%-4px)] w-56 bg-white border border-gray-100 shadow-2xl rounded-2xl py-2
                                                    opacity-0 invisible group-hover/subsub:opacity-100 group-hover/subsub:visible translate-x-2 group-hover/subsub:translate-x-0
                                                    transition-all duration-200 ease-out ml-1 pointer-events-none group-hover/subsub:pointer-events-auto">
                                      
                                      {subCat.subSubCategories!.map((subSubCat) => {
                                        const subSubSlug = getSafeSlug(subSubCat);
                                        return (
                                          <Link
                                            key={subSubCat._id}
                                            href={`/categories/${mainSlug}/${subSlug}/${subSubSlug}`}
                                            className="block px-5 py-2 text-slate-800 hover:bg-amber-500/10 hover:text-amber-600 transition-colors duration-150 font-bold text-[13px] rounded-lg mx-1 z-10 relative"
                                          >
                                            {subSubCat.name}
                                          </Link>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <NavLink href="/stores" icon={<Store className="w-4 h-4 text-slate-900 group-hover:text-sky-500" />}>Stores</NavLink>
              <NavLink href="/coupons" icon={<Ticket className="w-4 h-4 text-slate-900 group-hover:text-sky-500" />}>Coupons</NavLink>
              <NavLink href="/deals" icon={<Tag className="w-4 h-4 text-slate-900 group-hover:text-sky-500" />}>Deals</NavLink>
              <NavLink href="/discounts" icon={<TrendingDown className="w-4 h-4 text-slate-900 group-hover:text-sky-500" />}>Discounts</NavLink>
              <NavLink href="/blog" icon={<FileText className="w-4 h-4 text-slate-900 group-hover:text-sky-500" />}>Blog</NavLink>

              {/* Get Our App Dropdown */}
              <div className="relative group pb-2 -mb-2 ml-auto">
                 <motion.button 
                   animate={{ scale: [1, 1.02, 1] }}
                   transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.98 }}
                   className="flex items-center gap-1.5 text-sky-600 hover:text-sky-700 transition-colors py-1.5 px-3.5 font-black border border-sky-200 hover:border-sky-400 bg-sky-50/30 hover:bg-sky-50 rounded-full shadow-sm"
                 >
                   <Smartphone className="w-4 h-4" />
                   <span>Get Our App</span>
                   <ChevronDown className="w-3 h-3 text-sky-600 group-hover:rotate-180 transition-transform" />
                 </motion.button>
                 
                 <div className="absolute top-[calc(100%-4px)] right-0 w-52 bg-white border border-gray-100 shadow-2xl rounded-2xl py-2.5 
                                 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0
                                 transition-all duration-300 ease-out z-[110] pointer-events-none group-hover:pointer-events-auto">
                   
                   {appLinks?.googlePlay ? (
                     <a 
                       href={appLinks.googlePlay} 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       className="block px-5 py-2 text-slate-700 hover:bg-sky-50 hover:text-sky-600 transition-all text-xs font-black"
                     >
                       Google Play Store
                     </a>
                   ) : (
                     <span className="block px-5 py-2 text-slate-400 text-xs font-medium italic">Google Play coming soon</span>
                   )}

                   {appLinks?.appStore ? (
                     <a 
                       href={appLinks.appStore} 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       className="block px-5 py-2 text-slate-700 hover:bg-sky-50 hover:text-sky-600 transition-all text-xs font-black"
                     >
                       Apple App Store
                     </a>
                   ) : (
                     <span className="block px-5 py-2 text-slate-400 text-xs font-medium italic">App Store coming soon</span>
                   )}
                 </div>
              </div>

          </div>
        </nav>
      </header>

      {/* Mobile Menu Component */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
        categoriesTree={categoriesTree} 
        getSafeSlug={getSafeSlug} 
        appLinks={appLinks} 
      />
    </div>
  );
};

const NavLink = ({ href, children, icon }: { href: string, children: React.ReactNode, icon?: React.ReactNode }) => (
  <Link href={href} className="text-slate-900 hover:text-sky-500 font-black transition-colors flex items-center gap-1.5 group">
    {icon && <span className="transition-colors">{icon}</span>}
    {children}
  </Link>
);

export default Header;
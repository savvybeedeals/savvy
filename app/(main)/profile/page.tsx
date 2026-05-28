"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { supabase } from "@/lib/supabase";
import {  
  User, Mail, Phone, Globe, Ticket, Calendar,  
  CheckCircle2, Copy, Loader2, Settings, LayoutDashboard,  
  Sparkles, LogOut, AlertCircle, ShoppingBag, Flame, Zap, ChevronDown,
  Camera, Upload, Plus, Minus, X
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from 'framer-motion';
// textاستيراد الكروت الفاخرة المطابقة لصفحة المتاجر الخاصة بك
import CouponCard from "@/components/modules/coupon-card";
import { DiscountsCard } from "@/components/modules/discounts-card";
import DealCard from "@/components/modules/deals-card"; // 🔥 استيراد كارت العروض
import { client } from "@/services/client"; // 🔥 استيراد عميل Sanity

// استيراد الـ Popup الجديد المصمم خصيصاً للحساب
import ProfileSettingsModal from "@/components/modules/profile-settings-modal";

// تعريف أنواع الفلتر الثلاثي الجديد بالترتيب المتفق عليه
type ActiveTabType = 'discounts' | 'coupons' | 'deals';

export default function ProfilePage() {
  // جلب بيانات العميل وحالة التحميل والـ logout من المايسترو useAuth
  const { user, isLoggedIn, loading: authLoading } = useAuth();
  
  // التحكم في حالة التبويب النشط (الافتراضي هو الخصومات)
  const [activeTab, setActiveTab] = useState<ActiveTabType>('discounts');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // حالة التحكم بفتح وإغلاق الـ Settings Popup
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // حالات التحكم بفتح وإغلاق وسياق الـ Avatar Upload Popup الجديد
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // حالات التحكم في الـ Pagination لكل قسم بشكل منفصل تماماً كصفحة المتاجر
  const [visibleCoupons, setVisibleCoupons] = useState(4);
  const [visibleDiscounts, setVisibleDiscounts] = useState(4);
  const [visibleDeals, setVisibleDeals] = useState(4);

  // حالة حفظ وإدارة بيانات العميل الشخصية في الفورم
  const [userProfile, setUserProfile] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    country: "Egypt",
  });

  // 🔥 حالات الكوبونات المحفوظة
  const [allCoupons, setAllCoupons] = useState<any[]>([]);
  const [isFetchingCoupons, setIsFetchingCoupons] = useState(true);

  // 🔥 حالات الخصومات المحفوظة
  const [allDiscounts, setAllDiscounts] = useState<any[]>([]);
  const [isFetchingDiscounts, setIsFetchingDiscounts] = useState(true);

  // 🔥 حالات العروض المحفوظة
  const [allDeals, setAllDeals] = useState<any[]>([]);
  const [isFetchingDeals, setIsFetchingDeals] = useState(true);

  // مزامنة البيانات الشخصية وصورة البروفايل فور اكتمال جلب الـ user من الـ Context مع دعم جلبها أولاً من جدول profiles المستقر
  useEffect(() => {
    const fetchProfileData = async () => {
      if (user) {
        try {
          // جلب البيانات من جدول البروفايل المستقر لضمان عدم تأثر الصورة بجوجل بعد تسجيل الدخول
          const { data: profileData } = await supabase
            .from('profiles')
            .select('avatar_url, first_name, last_name, phone_number, country')
            .eq('id', user.id)
            .single();

          setUserProfile({
            firstName: profileData?.first_name || user.user_metadata?.first_name || user.user_metadata?.full_name?.split(" ")[0] || "Shopper",
            lastName: profileData?.last_name || user.user_metadata?.last_name || user.user_metadata?.full_name?.split(" ")[1] || "User",
            phoneNumber: profileData?.phone_number || user.user_metadata?.phone_number || user.phone || "",
            country: profileData?.country || user.user_metadata?.country || "Egypt",
          });
          
          setAvatarUrl(profileData?.avatar_url || user.user_metadata?.avatar_url || null);
        } catch (err) {
          console.error("Error loading stable profile image:", err);
          // Fallback في حال حدوث خطأ غير متوقع
          setUserProfile({
            firstName: user.user_metadata?.first_name || user.user_metadata?.full_name?.split(" ")[0] || "Shopper",
            lastName: user.user_metadata?.last_name || user.user_metadata?.full_name?.split(" ")[1] || "User",
            phoneNumber: user.user_metadata?.phone_number || user.phone || "",
            country: user.user_metadata?.country || "Egypt",
          });
          setAvatarUrl(user.user_metadata?.avatar_url || null);
        }
      }
    };

    fetchProfileData();
  }, [user]);

  // معالج اختيار الصورة محلياً من الجهاز وتحويلها للعرض
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setSelectedImage(URL.createObjectURL(file));
      setZoomScale(1); // إعادة تعيين التكبير للصورة الجديدة
    }
  };

  // وظيفة رفع الصورة المعدلة إلى Supabase Storage وتحديث بيانات المستخدم الشخصية في الـ auth والـ profiles معاً
  const handleUploadAvatar = async () => {
    if (!imageFile || !user) return;
    setIsUploadingAvatar(true);
    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // 1. رفع الصورة مباشرة إلى الـ Bucket المسمى 'avatars'
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, imageFile, { upsert: true });

      if (uploadError) throw uploadError;

      // 2. جلب رابط الصورة العام المباشر بعد الرفع
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // 3. تحديث بيانات الـ user_metadata الخاصة بالمستخدم الحالية
      const { error: updateAuthError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      if (updateAuthError) throw updateAuthError;

      // 4. 🔥 تحديث الصورة داخل جدول الـ profiles لحمايتها بنسبة 100% من تزامنات جوجل القادمة
      const { error: updateProfileError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateProfileError) throw updateProfileError;

      setAvatarUrl(publicUrl);
      setIsAvatarModalOpen(false);
      setSelectedImage(null);
      setImageFile(null);
      
      // عمل إنعاش خفيف لتحديث الواجهة بالصورة الثابتة الجديدة تماماً
      window.location.reload();
    } catch (error) {
      console.error("Error uploading avatar:", error);
      alert("Failed to upload image. Please make sure storage bucket 'avatars' is created and public.");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // 🔥 جلب الكوبونات المحفوظة من Supabase ثم Sanity
  useEffect(() => {
    const fetchSavedCoupons = async () => {
      if (!user?.id) return;
      setIsFetchingCoupons(true);
      try {
        const { data, error } = await supabase
          .from('saved_coupons')
          .select('coupon_id')
          .eq('user_id', user.id);

        if (error) throw error;

        const couponIds = data.map((row) => row.coupon_id);

        if (couponIds.length > 0) {
          const query = `*[_type == "coupon" && _id in $ids] | order(_createdAt desc) {
            _id, title, description, discount, code, expiryDate,
            "isVip": couponType == "vip", affiliateUrl, type, rating, reviewsCount, usersCount,
            store->{ name, logo, slug }
          }`;
          const sanityCoupons = await client.fetch(query, { ids: couponIds });
          setAllCoupons(sanityCoupons);
        } else {
          setAllCoupons([]);
        }
      } catch (error) {
        console.error("Error fetching saved coupons:", error);
      } finally {
        setIsFetchingCoupons(false);
      }
    };
    if (user) {
      fetchSavedCoupons();
    }
  }, [user]);

  // 🔥 جلب الخصومات المحفوظة من Supabase ثم Sanity
  useEffect(() => {
    const fetchSavedDiscounts = async () => {
      if (!user?.id) return;
      setIsFetchingDiscounts(true);
      try {
        const { data, error } = await supabase
          .from('saved_discounts')
          .select('discount_id')
          .eq('user_id', user.id);

        if (error) throw error;

        const discountIds = data.map((row) => row.discount_id);

        if (discountIds.length > 0) {
          const query = `*[_type == "discount" && _id in $ids] | order(_createdAt desc) {
            "id": _id, _id, name, 
            "store": store-> { name, "slug": slug.current },
            "category": category-> { name, "slug": slug.current },
            currentPrice, oldPrice, productImage, rating, isVip, 
            promoCode, description, affiliateLink, usersCount, _createdAt
          }`;
          const sanityDiscounts = await client.fetch(query, { ids: discountIds });
          setAllDiscounts(sanityDiscounts);
        } else {
          setAllDiscounts([]);
        }
      } catch (error) {
        console.error("Error fetching saved discounts:", error);
      } finally {
        setIsFetchingDiscounts(false);
      }
    };
    if (user) {
      fetchSavedDiscounts();
    }
  }, [user]);

  // 🔥 جلب العروض المحفوظة من Supabase ثم Sanity
  useEffect(() => {
    const fetchSavedDeals = async () => {
      if (!user?.id) return;
      setIsFetchingDeals(true);
      try {
        const { data, error } = await supabase
          .from('saved_deals')
          .select('deal_id')
          .eq('user_id', user.id);

        if (error) throw error;

        const dealIds = data.map((row) => row.deal_id);

        if (dealIds.length > 0) {
          const query = `*[_type == "deal" && _id in $ids] | order(_createdAt desc) {
            _id, title, description, secondTitle, expiryDate,
            "isVip": dealType == "vip", affiliateUrl, type, rating, usersCount,
            store->{ name, logo, "slug": slug.current },
            category->{ name, "slug": slug.current }
          }`;
          const sanityDeals = await client.fetch(query, { ids: dealIds });
          setAllDeals(sanityDeals);
        } else {
          setAllDeals([]);
        }
      } catch (error) {
        console.error("Error fetching saved deals:", error);
      } finally {
        setIsFetchingDeals(false);
      }
    };
    if (user) {
      fetchSavedDeals();
    }
  }, [user]);

  // حماية الصفحة: إذا انتهى التحميل والمستخدم مش مسجل دخول، يرجع فوراً لصفحة الـ login
  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      window.location.href = "/login";
    }
  }, [authLoading, isLoggedIn]);

  if (authLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-2">
          <Loader2 className="animate-spin text-sky-500 mx-auto" size={40} />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest animate-pulse">Loading Profile Hub...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // استخراج الحروف الأولى للاسم لعرضها في الأفتار عند عدم وجود صورة
  const firstInitial = userProfile.firstName ? userProfile.firstName[0].toUpperCase() : "S";
  const lastInitial = userProfile.lastName ? userProfile.lastName[0].toUpperCase() : "U";

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24 text-slate-800">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        
        {/* ================= 1. الـ Header العلوي الفخم والمطور بالكامل ================= */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-6 sm:p-8 mb-10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left min-w-0 w-full md:w-auto flex-1">
          
            {/* الأفتار الفاخر: يدعم العرض والضغط عليه مباشرة لرفع وتعديل الصورة بـ Popup */}
            <div 
              onClick={() => setIsAvatarModalOpen(true)}
              className="w-32 h-32 bg-gradient-to-tr from-amber-400 to-amber-600 text-white rounded-full flex items-center justify-center font-[1000] text-4xl shadow-md relative select-none tracking-wider border border-amber-300 shrink-0 cursor-pointer group overflow-hidden"
            >
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt="Profile Avatar" 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                <span>{firstInitial}{lastInitial}</span>
              )}
              {/* طبقة المؤثر اللمسية اللطيفة عند التمرير بالماوس للفوز بتجربة مستخدم مذهلة */}
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Camera size={20} className="text-white" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white">Update</span>
              </div>
            </div>
            
            <div className="space-y-2 min-w-0 flex-1 w-full sm:w-auto">
              <div className="flex flex-col sm:flex-row items-center gap-2 flex-wrap sm:flex-nowrap">
                <h1 className="text-2xl font-[1000] tracking-tight text-slate-900 break-words min-w-0">
                  {userProfile.firstName} {userProfile.lastName}
                </h1>
                <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-center">
                  <span className="bg-amber-50 text-amber-700 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-amber-200/60 flex items-center gap-1 shadow-sm whitespace-nowrap">
                    <Sparkles size={10} className="animate-pulse text-amber-500" /> VIP Shopper Active
                  </span>
                  <span className="bg-amber-50/60 border border-amber-100 rounded-full px-2.5 py-0.5 flex items-center gap-1 text-amber-950 font-black text-[10px] uppercase shadow-sm whitespace-nowrap">
                    <Sparkles size={10} className="text-amber-500 animate-spin" />
                    <span>100% VIP Unlocked</span>
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold text-slate-600 break-words">
                  Welcome back, <span className="text-sky-500">@{userProfile.firstName.toLowerCase()}</span>!
                  Don't miss out—your exclusive premium discounts and unlocked voucher rewards are waiting for your next order!
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-3 mt-1">
                  <Link 
                    href="/" 
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all relative z-10"
                  >
                    <ShoppingBag size={14} /> Shop Premium Deals Now
                  </Link>
                  <p className="text-xs font-medium text-slate-400 flex items-center gap-1.5 truncate max-w-full">
                    <Mail size={13} className="shrink-0" /> <span className="truncate">{user.email}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* زر التعديل السريع للملف الشخصي */}
          <div className="flex flex-col items-center md:items-end gap-2 md:self-start shrink-0">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="px-5 py-2.5 bg-slate-50 hover:bg-sky-50 text-slate-600 hover:text-sky-600 font-black text-xs uppercase tracking-wider rounded-xl border border-slate-100 transition-all flex items-center gap-2 cursor-pointer shadow-sm shrink-0 whitespace-nowrap"
            >
              <Settings size={14} /> Edit Profile
            </button>
          </div>
        </div>

        {/* ================= 2. شريط التبويبات الثلاثي ================= */}
        <div className="flex justify-center mb-10">
          <div className="flex flex-wrap justify-center items-center gap-2 md:gap-3 bg-slate-100/90 p-1.5 rounded-2xl max-w-lg mx-auto border border-slate-200/50 shadow-inner">
            
            {/* 1. زر Coupons */}
            <button
              onClick={() => setActiveTab('coupons')}
              className={`relative flex items-center gap-2 px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-colors duration-300 select-none cursor-pointer ${
                activeTab === 'coupons' ? 'text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {activeTab === 'coupons' && (
                <motion.div 
                  layoutId="profileActiveTabBg" 
                  className="absolute inset-0 bg-amber-500 rounded-xl shadow-sm" 
                  transition={{ type: "spring", stiffness: 380, damping: 30 }} 
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <Ticket size={13} /> 
                Coupon ({allCoupons.length})
              </span>
            </button>

            {/* 2. زر Discounts */}
            <button
              onClick={() => setActiveTab('discounts')}
              className={`relative flex items-center gap-2 px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-colors duration-300 select-none cursor-pointer ${
                activeTab === 'discounts' ? 'text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {activeTab === 'discounts' && (
                <motion.div 
                  layoutId="profileActiveTabBg" 
                  className="absolute inset-0 bg-rose-500 rounded-xl shadow-sm" 
                  transition={{ type: "spring", stiffness: 380, damping: 30 }} 
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <Flame size={13} /> 
                Discount ({allDiscounts.length})
              </span>
            </button>

            {/* 3. زر Deals */}
            <button
              onClick={() => setActiveTab('deals')}
              className={`relative flex items-center gap-2 px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-colors duration-300 select-none cursor-pointer ${
                activeTab === 'deals' ? 'text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {activeTab === 'deals' && (
                <motion.div 
                  layoutId="profileActiveTabBg" 
                  className="absolute inset-0 bg-sky-500 rounded-xl shadow-sm" 
                  transition={{ type: "spring", stiffness: 380, damping: 30 }} 
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <Zap size={13} /> 
                Deals ({allDeals.length})
              </span>
            </button>
          </div>
        </div>

        {/* ================= 3. عرض المحتوى التفاعلي ================= */}
        <AnimatePresence mode="wait">
          
          {/* سيكشن الخصومات الأول: Discount */}
          {activeTab === 'discounts' && (
            <motion.section
              key="profile-discounts-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {allDiscounts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {allDiscounts.slice(0, visibleDiscounts).map((discount) => (
                    <DiscountsCard key={discount._id} discount={discount as any} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 font-bold text-slate-400 tracking-widest text-sm">
                  {isFetchingDiscounts ? "Loading Saved Discounts..." : "No Active Discounts Saved"}
                </div>
              )}

              {allDiscounts.length > visibleDiscounts && (
                <div className="flex justify-center mt-10">
                  <button
                    onClick={() => setVisibleDiscounts(prev => prev + 4)}
                    className="group relative flex items-center gap-3 bg-white hover:bg-slate-900 text-slate-800 hover:text-white px-8 py-3.5 rounded-2xl font-black text-sm transition-all duration-300 shadow-sm hover:shadow-xl border border-slate-200/80 hover:border-slate-900 cursor-pointer select-none"
                  >
                    <span>LOAD MORE DISCOUNTS</span>
                    <ChevronDown size={16} className="transition-transform group-hover:translate-y-1 duration-300" />
                    <span className="absolute -top-3 -right-3 bg-[#FFD700] text-slate-900 text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow animate-bounce">🐝</span>
                  </button>
                </div>
              )}
            </motion.section>
          )}

          {/* سيكشن الكوبونات الثاني: Coupon */}
          {activeTab === 'coupons' && (
            <motion.section
              key="profile-coupons-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {allCoupons.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {allCoupons.slice(0, visibleCoupons).map((coupon) => (
                    <CouponCard key={coupon._id || coupon.id} coupon={coupon as any} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 font-bold text-slate-400 tracking-widest text-sm">
                  {isFetchingCoupons ? "Loading Saved Coupons..." : "No Active Coupons Found"}
                </div>
              )}

              {allCoupons.length > visibleCoupons && (
                <div className="flex justify-center mt-10">
                  <button
                    onClick={() => setVisibleCoupons(prev => prev + 4)}
                    className="group relative flex items-center gap-3 bg-white hover:bg-slate-900 text-slate-800 hover:text-white px-8 py-3.5 rounded-2xl font-black text-sm transition-all duration-300 shadow-sm hover:shadow-xl border border-slate-200/80 hover:border-slate-900 cursor-pointer select-none"
                  >
                    <span>LOAD MORE COUPONS</span>
                    <ChevronDown size={16} className="transition-transform group-hover:translate-y-1 duration-300" />
                    <span className="absolute -top-3 -right-3 bg-[#FFD700] text-slate-900 text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow animate-bounce">🐝</span>
                  </button>
                </div>
              )}
            </motion.section>
          )}

          {/* سيكشن العروض الثالث الحصري والمعدل لحل المشكلة بشكل كامل بنسبة 100% 🔥 */}
          {activeTab === 'deals' && (
            <motion.section
              key="profile-deals-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {allDeals.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {allDeals.slice(0, visibleDeals).map((deal) => (
                    <DealCard
                      key={deal._id}
                      _id={deal._id}
                      storeName={deal.store?.name || "Store"}
                      storeLogo={deal.store?.logo}
                      storeSlug={deal.store?.slug}
                      discount={deal.discount || "🔥 SPECIAL"}
                      title={deal.title}
                      secondTitle={deal.secondTitle}
                      description={deal.description}
                      isVip={deal.isVip}
                      expiryDate={deal.expiryDate}
                      usersCount={deal.usersCount}
                      affiliateUrl={deal.affiliateUrl}
                      type={deal.type}
                      rating={deal.rating}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 font-bold text-slate-400 tracking-widest text-sm">
                  {isFetchingDeals ? "Loading Saved Deals..." : "No Active Deals Unlocked"}
                </div>
              )}

              {allDeals.length > visibleDeals && (
                <div className="flex justify-center mt-10">
                  <button
                    onClick={() => setVisibleDeals(prev => prev + 4)}
                    className="group relative flex items-center gap-3 bg-white hover:bg-slate-900 text-slate-800 hover:text-white px-8 py-3.5 rounded-2xl font-black text-sm transition-all duration-300 shadow-sm hover:shadow-xl border border-slate-200/80 hover:border-slate-900 cursor-pointer select-none"
                  >
                    <span>LOAD MORE DEALS</span>
                    <ChevronDown size={16} className="transition-transform group-hover:translate-y-1 duration-300" />
                    <span className="absolute -top-3 -right-3 bg-[#FFD700] text-slate-900 text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow animate-bounce">🐝</span>
                  </button>
                </div>
              )}
            </motion.section>
          )}

        </AnimatePresence>
      </div>

      {/* ================= 4. الـ Popups المنبثقة التفاعلية للملف الشخصي ================= */}
      <AnimatePresence>
        {isAvatarModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 p-6 sm:p-8 relative space-y-6"
            >
              {/* زر الإغلاق لـ Popup الصورة */}
              <button 
                onClick={() => {
                  setIsAvatarModalOpen(false);
                  setSelectedImage(null);
                  setImageFile(null);
                }}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  Update Avatar Pic
                </h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Upload a fresh custom profile picture. Supported formats are JPG, PNG, and WebP.
                </p>
              </div>

              {/* منطقة الإسقاط والعرض التفاعلي للصورة الشخصية المرفوعة */}
              <div className="flex flex-col items-center justify-center py-4">
                {selectedImage ? (
                  <div className="space-y-4 w-full flex flex-col items-center">
                    <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-amber-400 shadow-md relative bg-slate-50">
                      <img 
                        src={selectedImage} 
                        alt="Preview" 
                        className="w-full h-full object-cover transition-transform"
                        style={{ transform: `scale(${zoomScale})` }}
                      />
                    </div>
                    {/* متحكم التكبير الدقيق لتعديل وضعية الصورة بنجاح مبهر */}
                    <div className="w-full max-w-xs flex items-center gap-3 px-2">
                      <button 
                        type="button"
                        onClick={() => setZoomScale(prev => Math.max(1, prev - 0.1))}
                        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs flex items-center justify-center cursor-pointer shadow-sm"
                      >
                        <Minus size={12} />
                      </button>
                      <input 
                        type="range"
                        min="1"
                        max="2"
                        step="0.05"
                        value={zoomScale}
                        onChange={(e) => setZoomScale(parseFloat(e.target.value))}
                        className="flex-1 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      />
                      <button 
                        type="button"
                        onClick={() => setZoomScale(prev => Math.min(2, prev + 0.1))}
                        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs flex items-center justify-center cursor-pointer shadow-sm"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="w-full max-w-xs h-40 rounded-[2rem] border-2 border-dashed border-slate-200 hover:border-amber-400 bg-slate-50/50 hover:bg-amber-50/10 transition-all duration-300 flex flex-col items-center justify-center gap-2 cursor-pointer p-4 group select-none">
                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-amber-500 transition-colors">
                      <Upload size={18} />
                    </div>
                    <span className="text-xs font-black text-slate-700 uppercase tracking-wider">Choose Image</span>
                    <span className="text-[10px] font-semibold text-slate-400">Click to browse your files</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageChange} 
                    />
                  </label>
                )}
              </div>

              {/* أزرار إنهاء الرفع المطور والحفظ الفوري */}
              <div className="pt-2">
                <div className="flex items-center gap-3">
                  {selectedImage && (
                    <button
                      type="button"
                      disabled={isUploadingAvatar}
                      onClick={() => {
                        setSelectedImage(null);
                        setImageFile(null);
                      }}
                      className="px-4 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 font-black text-xs uppercase tracking-wider rounded-xl border border-slate-200/60 transition-all cursor-pointer text-center"
                    >
                      Change
                    </button>
                  )}
                  <button 
                    type="button"
                    disabled={!imageFile || isUploadingAvatar}
                    onClick={handleUploadAvatar}
                    className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:from-slate-200 disabled:to-slate-200 text-white disabled:text-slate-400 font-black text-xs uppercase tracking-wider rounded-xl shadow-sm border border-amber-500 hover:border-amber-600 disabled:border-slate-200 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isUploadingAvatar ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <span>Save Avatar</span>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* مودال إعدادات الحساب وتعديل البيانات الشخصية */}
      <ProfileSettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />

    </div>
  );
}
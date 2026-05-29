import { client } from "@/services/client";
import { supabase } from "@/lib/supabase";

// دالة جلب جميع البيانات
export async function getAllCoupons() {
  const query = `*[_type == "coupon"] | order(_createdAt desc) {
    _id,
    title,
    description,
    discount,
    code,
    expiryDate,
    "isVip": couponType == "vip",
    affiliateUrl,
    type,
    rating,
    reviewsCount,
    usersCount,
    store->{
      name,
      logo,
      slug
    }
  }`;
  try {
    // 🔥 تفعيل الـ ISR باستخدام الـ tags لربطها بالـ Webhook
    const coupons = await client.fetch(query, {}, { next: { tags: ['coupons'] } });
    return coupons;
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return [];
  }
}

// دالة جلب آخر 4 كوبونات فقط للصفحة الرئيسية
export async function getLatestCoupons() {
  const query = `*[_type == "coupon"] | order(_createdAt desc)[0...4] {
    _id,
    title,
    description,
    discount,
    code,
    expiryDate,
    "isVip": couponType == "vip",
    affiliateUrl,
    type,
    rating,
    reviewsCount,
    usersCount,
    store->{
      name,
      logo,
      slug
    }
  }`;
  try {
    // 🔥 تفعيل الـ ISR هنا أيضاً لضمان سرعة الصفحة الرئيسية وتحديثها الفوري
    const coupons = await client.fetch(query, {}, { next: { tags: ['coupons'] } });
    return coupons;
  } catch (error) {
    console.error("Error fetching latest coupons:", error);
    return [];
  }
}

// دالة تحديث الإحصائيات (الزيارات والتقييم)
export async function updateCouponStats(couponId: string, type: 'usage' | 'rating', ratingValue?: number) {
  try {
    const res = await fetch('/api/coupon/update-stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ couponId, type, ratingValue }),
    });
    
    if (!res.ok) {
        const errorText = await res.text();
        console.error('Server error response:', errorText);
        return { success: false };
    }

    return await res.json();
  } catch (error) {
    console.error('Failed to update coupon stats:', error);
    return { success: false };
  }
}

// دالة حفظ الكوبون في بروفايل المستخدم
export async function saveUserCoupon(userId: string, couponId: string) {
  try {
    // الحصول على التوكن (JWT) للمستخدم الحالي لإثبات هويته للسيرفر
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    const res = await fetch('/api/coupon/save-coupon', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        // إرسال التوكن في الـ Headers إذا كان موجوداً
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}) 
      },
      body: JSON.stringify({ userId, couponId }),
    });
    if (!res.ok) {
        const errorText = await res.text();
        console.error('Server error response:', errorText);
        return { success: false };
    }

    return await res.json();
  } catch (error) {
    console.error('Failed to save user coupon:', error);
    return { success: false };
  }
}

// الدالة الجديدة لجلب الكوبون الفردي عن طريق الـ Slug الخاص به من أجل الـ SEO والصفحة المنفردة
export async function getCouponBySlug(slug: string) {
  const query = `*[_type == "coupon" && slug.current == $slug][0] {
    _id,
    title,
    description,
    discount,
    code,
    expiryDate,
    "slug": slug.current,
    "isVip": couponType == "vip",
    affiliateUrl,
    type,
    rating,
    reviewsCount,
    usersCount,
    store->{
      name,
      logo,
      slug
    }
  }`;
  try {
    // 🔥 تفعيل الـ ISR لصفحة الكوبون الفردية لأرشفة فائقة وسرعة TTFB قصوى
    const coupon = await client.fetch(query, { slug }, { next: { tags: ['coupons'] } });
    return coupon;
  } catch (error) {
    console.error(`Error fetching coupon with slug ${slug}:`, error);
    return null;
  }
} // <--- تم التعديل هنا بإزالة القوس الزائد )
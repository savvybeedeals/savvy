import { client } from "@/services/client";
import { supabase } from "@/lib/supabase"; // 🔥 إضافة استيراد عميل Supabase هنا

// دالة جلب جميع العروض المتاحة مرتبة من الأحدث للأقدم
export async function getAllDeals() {
  const query = `*[_type == "deal"] |
  order(_createdAt desc) {
    _id,
    title,
    description,
    secondTitle,
    expiryDate,
    "isVip": dealType == "vip",
    affiliateUrl,
    type,
    rating,
    usersCount,
    store->{
      name,
      logo,
      slug
    },
    category->{
      name,
      slug
    }
  }`;
  try {
    const deals = await client.fetch(query);
    return deals || [];
  } catch (error) {
    console.error("Error fetching deals:", error);
    return [];
  }
}

// دالة جلب آخر 4 عروض فقط للصفحة الرئيسية
export async function getLatestDeals() {
  const query = `*[_type == "deal"] |
  order(_createdAt desc)[0...4] {
    _id,
    title,
    description,
    secondTitle,
    expiryDate,
    "isVip": dealType == "vip",
    affiliateUrl,
    type,
    rating,
    usersCount,
    store->{
      name,
      logo,
      slug
    },
    category->{
      name,
      slug
    }
  }`;
  try {
    const deals = await client.fetch(query);
    return deals || [];
  } catch (error) {
    console.error("Error fetching latest deals:", error);
    return [];
  }
}

// دالة تحديث إحصائيات العروض (الزيارات عند الضغط أو التقييم) عبر الـ API المخصص لها
export async function updateDealStats(dealId: string, type: 'usage' | 'rating', ratingValue?: number) {
  try {
    const res = await fetch('/api/deals/update-stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dealId, type, ratingValue }),
    });

    if (!res.ok) {
        const errorText = await res.text();
        console.error('Server error response while updating deal stats:', errorText);
        return { success: false };
    }

    return await res.json();
  } catch (error) {
    console.error('Failed to update deal stats:', error);
    return { success: false };
  }
}

// 🔥 التعديل الجديد: دالة حفظ العرض في بروفايل المستخدم
export async function saveUserDeal(userId: string, dealId: string) {
  try {
    // الحصول على التوكن (JWT) للمستخدم الحالي لإثبات هويته للسيرفر وتخطي الـ RLS
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    const res = await fetch('/api/deals/save-deals', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        // إرسال التوكن في الـ Headers إذا كان موجوداً
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}) 
      },
      body: JSON.stringify({ userId, dealId }),
    });

    if (!res.ok) {
        const errorText = await res.text();
        console.error('Server error response:', errorText);
        return { success: false };
    }

    return await res.json();
  } catch (error) {
    console.error('Failed to save user deal:', error);
    return { success: false };
  }
}
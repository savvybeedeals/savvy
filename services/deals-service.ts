import { client } from "@/services/client";
import { supabase } from "@/lib/supabase";

// دالة جلب جميع العروض المتاحة مرتبة من الأحدث للأقدم
export async function getAllDeals() {
  const query = `*[_type == "deal"] | order(_createdAt desc) {
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
    "slug": slug.current,
    store->{
      name,
      logo,
      "slug": slug.current
    },
    category->{
      name,
      "slug": slug.current
    }
  }`;
  try {
    // 🔥 التعديل: استبدال revalidate: 0 بنظام الـ tags لربطها بالـ Webhook ومنع بطء الصفحة
    const deals = await client.fetch(query, {}, { next: { tags: ['deals'] } });
    return deals || [];
  } catch (error) {
    console.error("Error fetching deals:", error);
    return [];
  }
}

// جلب عرض واحد فريد بواسطة الـ Slug الخاص به لدعم صفحة الـ Deal الفردية
export async function getDealBySlug(slug: string) {
  if (!slug) return null;
  const query = `*[_type == "deal" && slug.current == $slug][0] {
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
    "slug": slug.current,
    store->{
      name,
      logo,
      "slug": store->slug.current
    },
    category->{
      name,
      "slug": category->slug.current
    }
  }`;
  try {
    // 🔥 التعديل: ربط الـ tag هنا أيضاً لتحديث كاش الصفحة الفردية بمجرد تعديل العرض في Sanity
    const deal = await client.fetch(query, { slug }, { next: { tags: ['deals'] } });
    return deal;
  } catch (error) {
    console.error("Error fetching deal by slug:", error);
    return null;
  }
}

// دالة جلب آخر 4 عروض فقط للصفحة الرئيسية
export async function getLatestDeals() {
  const query = `*[_type == "deal"] | order(_createdAt desc)[0...4] {
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
      "slug": slug.current
    },
    category->{
      name,
      "slug": slug.current
    }
  }`;
  try {
    // 🔥 التعديل: تفعيل الـ ISR لربط كاش العروض بالصفحة الرئيسية
    const deals = await client.fetch(query, {}, { next: { tags: ['deals'] } });
    return deals || [];
  } catch (error) {
    console.error("Error fetching latest deals:", error);
    return [];
  }
}

// دالة تحديث إحصائيات العروض
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

// دالة حفظ العرض في بروفايل المستخدم
export async function saveUserDeal(userId: string, dealId: string) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    const res = await fetch('/api/deals/save-deals', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
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
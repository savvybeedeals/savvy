import { client } from "@/sanity/lib/client";
import { supabase } from "@/lib/supabase";

// تعريف الـ Interface الخاص بالـ Discount لضمان الـ Type Safety في الـ TypeScript
export interface DiscountItem {
  id: number;
  // سنستخدم الـ _id من سانتي كـ id رقمي أو نصي
  _id: string;
  name: string;
  store: any;
  // تم تحديثها لتقبل كائن المتجر بالكامل بعد فك الريفرنس
  category?: any;
  // تم إضافتها وتحديثها لتقبل الفئة بعد فك الريفرنس
  currentPrice: number;
  oldPrice: number;
  productImage: any;
  // تم استبدال حقل النص img بحقل الكائن productImage الخاص بصور سانتي
  rating: number;
  isVip: boolean;
  promoCode: string;
  description: string;
  affiliateLink: string;
  usersCount: number;
  _createdAt?: string;
  createdAt?: string;
}

/**
 * جلب عروض الخصومات المحدودة (أول 4 فقط للـ Homepage)
 */
export async function getLatestDiscounts(): Promise<DiscountItem[]> {
  const query = `*[_type == "discount"] |
  order(_createdAt desc)[0..3] {
    "id": _id,
    _id,
    name,
    "store": store-> {
      name,
      "slug": slug.current
    },
    "category": category-> {
      name,
      "slug": slug.current
    },
    currentPrice,
    oldPrice,
    productImage,
    rating,
    isVip,
    promoCode,
    description,
    affiliateLink,
    usersCount,
    _createdAt
  }`;

  try {
    const discounts = await client.fetch(query, {}, { next: { revalidate: 60 } });
    // عمل كاش لمدة دقيقة لسرعة الأداء
    return discounts;
  } catch (error) {
    console.error("Error fetching latest discounts:", error);
    return [];
  }
}

/**
 * جلب جميع عروض الخصومات لصفحة الخصومات الشاملة
 */
export async function getAllDiscounts(): Promise<DiscountItem[]> {
  const query = `*[_type == "discount"] |
  order(_createdAt desc) {
    "id": _id,
    _id,
    name,
    "store": store-> {
      name,
      "slug": slug.current
    },
    "category": category-> {
      name,
      "slug": slug.current
    },
    currentPrice,
    oldPrice,
    productImage,
    rating,
    isVip,
    promoCode,
    description,
    affiliateLink,
    usersCount,
    _createdAt
  }`;

  try {
    const discounts = await client.fetch(query, {}, { next: { revalidate: 60 } });
    return discounts;
  } catch (error) {
    console.error("Error fetching all discounts:", error);
    return [];
  }
}

/**
 * حفظ الخصم في بروفايل المستخدم بشكل آمن (بتخطي RLS)
 */
export async function saveUserDiscount(userId: string, discountId: string) {
  try {
    // الحصول على التوكن (JWT) للمستخدم الحالي لإثبات هويته للسيرفر
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    const res = await fetch('/api/discounts/save-discounts', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}) 
      },
      body: JSON.stringify({ userId, discountId }),
    });

    if (!res.ok) {
        const errorText = await res.text();
        console.error('Server error response:', errorText);
        return { success: false };
    }

    return await res.json();
  } catch (error) {
    console.error('Failed to save user discount:', error);
    return { success: false };
  }
}
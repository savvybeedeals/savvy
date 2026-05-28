import { client } from "./client";
import { Store } from "@/types";

/**
 * جلب جميع المتاجر مرتبة حسب التميز (Featured) أولاً ثم أبجدياً
 */
export const getAllStores = async (): Promise<Store[]> => {
  const query = `*[_type == "store"] |
order(isFeatured desc, name asc) {
    _id,
    name,
    slug,
    logo,
    url,
    isFeatured,
    metaTitle,
    description,
    affiliateNetwork,
    "categories": categories[]->{
      _id,
      name,
      slug
    }
  }`;
  return await client.fetch(query, {}, { next: { revalidate: 60 } });
};

/**
 * جلب بيانات متجر واحد بناءً على الـ Slug مع الكوبونات، العروض، والخصومات التابعة له
 */
export const getStoreBySlug = async (slug: string): Promise<Store | null> => {
  if (!slug) return null;

  // الاستعلام المحدث المتوافق 100% مع الـ schema لربط وعرض المنتجات التابعة للمتجر الحالي
  const query = `*[_type == "store" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    logo,
    url,
    isFeatured,
    metaTitle,
    description,
    affiliateNetwork,
    "categories": categories[]->{
      _id,
      name,
      slug
    },
    // جلب الكوبونات التي تشير إلى هذا المتجر
    "coupons": *[_type == "coupon" && store._ref == ^._id] | order(_createdAt desc) {
      _id,
      title,
      description,
      code,
      discountValue,
      type,
      expiryDate,
      "isVip": couponType == "vip",
      affiliateUrl,
      rating,
      reviewsCount,
      usersCount
    },
    // جلب العروض التابعة لـ _type == "deal" وتطابق الـ ID
    "deals": *[_type == "deal" && store._ref == ^._id] | order(_createdAt desc) {
      _id,
      title,
      secondTitle,
      description,
      dealType,
      "isVip": dealType == "vip",
      affiliateUrl,
      expiryDate,
      rating,
      usersCount
    },
    // جلب الخصومات التابعة لـ _type == "discount" وتطابق الـ ID مع جلب الصورة والرابط
    "discounts": *[_type == "discount" && store._ref == ^._id] | order(_createdAt desc) {
      _id,
      name,
      description,
      "productImage": productImage.asset->url,
      oldPrice,
      discountPercentage,
      currentPrice,
      affiliateLink,
      promoCode,
      expiryDate,
      isVip,
      rating,
      usersCount
    }
  }`;

  try {
    const store = await client.fetch(query, { slug }, { cache: 'no-store' });
    return store;
  } catch (error) {
    console.error("Error fetching store:", error);
    return null;
  }
};
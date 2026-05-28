export const ALL_COUPONS_QUERY = `*[_type == "coupon"] | order(_createdAt desc) {
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
    "logo": logo.asset->url,
    "slug": slug.current
  }
}`;

export const STORE_COUPONS_QUERY = `*[_type == "coupon" && store->slug.current == $slug] |
order(_createdAt desc) {
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
    "logo": logo.asset->url,
    "slug": slug.current
  }
}`;

export const CATEGORIES_TREE_QUERY = `*[_type == "category" && !defined(parent)] |
order(name asc) {
  _id,
  name,
  "slug": slug.current,
  icon,
  "subCategories": *[_type == "category" && parent._ref == ^._id] |
order(name asc) {
    _id,
    name,
    "slug": slug.current,
    icon,
    "subSubCategories": *[_type == "category" && parent._ref == ^._id] |
order(name asc) {
      _id,
      name,
      "slug": slug.current,
      icon
    }
  }
}`;

// --- الاستعلامات الإضافية الجديدة لجلب العروض والخصومات الفردية للمتجر بناءً على الـ Slug ---
export const STORE_PAGE_DATA_QUERY = `*[_type == "store" && slug.current == $slug][0] {
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
  "coupons": *[_type == "coupon" && store._ref == ^._id] | order(_createdAt desc) {
    _id,
    title,
    description,
    code,
    discountValue,
    type,
    expiryDate
  },
  "deals": *[(_type == "deal" || _type == "deals") && store._ref == ^._id] | order(_createdAt desc) {
    _id,
    title,
    description,
    price,
    discountPrice,
    imageUrl,
    store->{
      name,
      "logo": logo.asset->url,
      "slug": slug.current
    }
  },
  "discounts": *[(_type == "discount" || _type == "discounts") && store._ref == ^._id] | order(_createdAt desc) {
    _id,
    title,
    description,
    percentage,
    link,
    store->{
      name,
      "logo": logo.asset->url,
      "slug": slug.current
    }
  }
}`;

// ==========================================
// --- استعلامات الـ GROQ الجديدة لنظام المقالات (Blog) ---
// ==========================================

// 1. استعلام جلب كافة المقالات لصفحة الـ Blog الرئيسية مرتبة من الأحدث للأقدم
export const ALL_BLOGS_QUERY = `*[_type == "blog"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  mainImage,
  excerpt,
  publishedAt
}`;

// 2. استعلام جلب تفاصيل مقالة واحدة كاملة بناءً على الـ Slug الخاص بها
export const BLOG_BY_SLUG_QUERY = `*[_type == "blog" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  mainImage,
  excerpt,
  publishedAt,
  content
}`;
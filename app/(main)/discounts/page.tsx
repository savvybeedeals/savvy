import React from 'react';
import { client } from "@/services/client";
import { Tag } from "lucide-react";
import { DiscountsGrid } from "@/components/collections/discounts-grid";
import CategoryFilter from "@/components/collections/category-filter";
import DiscountsPageClient from "./DiscountsPageClient";

// إضافة الـ Metadata الرصينة التي لم تكن مدعومة بسبب الـ "use client" السابق
export const metadata = {
  title: "All Flash Discounts & Price Drops | Savvy Bee Deals",
  description: "Get instant price drops on premium products from top global stores. Hand-picked, tested and 100% active limited-time discounts.",
};

export default async function DiscountsPage() {
  let itemsFetched: any[] = [];
  
  // جلب البيانات من السيرفر مباشرة لتغذية الـ Schema ودعم محركات البحث
  try {
    const itemsQuery = `*[_type == "discount"] | order(_createdAt desc) {
      _id,
      name,
      slug,
      description,
      productImage,
      oldPrice,
      discountPercentage,
      currentPrice,
      affiliateLink,
      promoCode,
      expiryDate,
      rating,
      usersCount,
      _createdAt,
      "isVip": isVip == true,
      category->{ name, "slug": slug.current },
      store->{ name, "logo": logo.asset->url, "slug": slug.current }
    }`;
    itemsFetched = await client.fetch(itemsQuery);
  } catch (error) {
    console.error("Server-side fetching error for discounts schema:", error);
  }

  // بناء الـ ItemList Schema الديناميكية للتخفيضات والأسعار
  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Today's Best Flash Discounts | Savvy Bee Deals",
    "description": "Get instant price drops on premium products from top global stores verified by our team.",
    "url": "https://savvybeedeals.com/discounts",
    "numberOfItems": itemsFetched.length,
    "itemListElement": itemsFetched.map((discount: any, index: number) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": discount.name,
        "description": discount.description || `Limited time verified drop discount.`,
        "image": discount.productImage || discount.store?.logo || "https://savvybeedeals.com/favicon.ico",
        "offers": {
          "@type": "Offer",
          "price": discount.currentPrice || "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "seller": {
            "@type": "Organization",
            "name": discount.store?.name || "Savvy Bee Deals"
          }
        }
      }
    }))
  };

  return (
    <>
      {/* حقن الـ Structured Data من السيرفر فوراً */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />

      {/* تمرير مصفوفة البيانات الأولية الجاهزة لمكون الكلاينت الفرعي للحفاظ على الفلترة والبحث الفوري بدون جليتش */}
      <DiscountsPageClient initialItems={itemsFetched} />
    </>
  );
}
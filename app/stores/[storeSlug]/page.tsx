import React from 'react';
import { notFound } from "next/navigation";
import { Metadata } from 'next';
import { getStoreBySlug } from "@/services/store-service";
import StorePageClient from "./StorePageClient";

interface PageProps {
  params: Promise<{ storeSlug: string }>;
}

// 1️⃣ خطوة الـ Dynamic Routes & SEO المستقرة تماماً والسيرفر ساید 100%
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const storeSlug = resolvedParams.storeSlug;
  
  try {
    const store = await getStoreBySlug(storeSlug);
    if (!store) {
      return {
        title: "Store Not Found | Savvy Bee Deals",
        description: "The requested store could not be found."
      };
    }

    const titleText = `Exclusive ${store.name} Promo Codes & Coupons | Savvy Bee Deals`;
    const descriptionText = store.description || `Save money at ${store.name} with the latest verified coupons, active discount flash offers, and hand-picked hot deals updated daily.`;

    return {
      title: titleText,
      description: descriptionText,
      openGraph: {
        title: titleText,
        description: descriptionText,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: titleText,
        description: descriptionText,
      }
    };
  } catch (error) {
    console.error("Error generating metadata for store:", error);
    return {
      title: "Savvy Bee Deals Hub",
      description: "Browse verified coupons and discount codes for your favorite brands."
    };
  }
}

// المكون الرئيسي السيرفر الذي يمرر الـ params إلى الـ Client Component بأمان تامة للتوافق مع Next.js 15
export default async function StorePage({ params }: PageProps) {
  const resolvedParams = await params;
  const storeSlug = resolvedParams.storeSlug;
  
  // جلب بيانات المتجر على السيرفر لبناء الـ ItemList سكيما بشكل نظيف وديناميكي
  let store: any = null;
  try {
    store = await getStoreBySlug(storeSlug);
  } catch (e) {
    console.error("Error fetching store for schema:", e);
  }

  // إذا لم يكن المتجر موجوداً، نترك التعامل معه للـ Client Component أو الـ Metadata، 
  // وإذا وجدناه نقوم ببناء سكيما الـ ItemList لجميع العروض (الكوبونات أو الخصومات الملحقة به)
  const itemListSchema = store ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${store.name} Promo Codes & Coupons`,
    "description": `List of active and verified coupons, promo codes, and discounts for ${store.name}.`,
    "numberOfItems": store.coupons?.length || 0,
    "itemListElement": (store.coupons || []).map((coupon: any, index: number) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Coupon",
        "name": coupon.title || coupon.name || `${store.name} Coupon`,
        "description": coupon.description || `Verified promo code for ${store.name}`,
        "provider": {
          "@type": "Organization",
          "name": store.name
        }
      }
    }))
  } : null;

  return (
    <>
      {itemListSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
      )}
      <StorePageClient params={params} />
    </>
  );
}
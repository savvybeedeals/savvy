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
export default function StorePage({ params }: PageProps) {
  return <StorePageClient params={params} />;
}
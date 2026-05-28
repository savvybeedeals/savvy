import React from 'react';
import { client } from "@/services/client";
import CategoryClient from "./categoryClient";
import { Metadata } from "next";

interface CategoryPageProps {
  params: Promise<{
    categorySlug?: string[];
  }>;
}

// توليد الـ Dynamic Metadata ومحركات البحث برمجياً من السيرفر مباشرة
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slugArray = resolvedParams.categorySlug || [];
  const currentCategorySlug = slugArray.length > 0 ? slugArray[slugArray.length - 1] : null;

  if (!currentCategorySlug) {
    return {
      title: "Categories & Collections | Savvy Bee Deals 🍯",
    };
  }

  // جلب حقول القسم لبناء عناوين الـ SEO بدقة متناهية
  const query = `*[_type == "category" && slug.current == $slug][0]{ name, description }`;
  const categoryData = await client.fetch(query, { slug: currentCategorySlug });

  if (!categoryData) {
    return {
      title: "Category Not Found | Savvy Bee Deals 🍯",
    };
  }

  return {
    title: `${categoryData.name} Coupons, Promo Codes & Discounts | Savvy Bee Deals 🍯`,
    description: categoryData.description || `Find the best verified coupons, promo codes, and exclusive discounts for ${categoryData.name} on Savvy Bee Deals.`,
    openGraph: {
      title: `${categoryData.name} Coupons & Best Promo Deals`,
      description: categoryData.description || `Find the best verified coupons, promo codes, and exclusive discounts for ${categoryData.name} on Savvy Bee Deals.`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  // فك الـ params وتمريرها مباشرة إلى الـ Client Component ليقوم بعملية الـ Fetch المستقرة الخاصة بك
  const resolvedParams = await params;

  return (
    <CategoryClient params={resolvedParams} />
  );
}
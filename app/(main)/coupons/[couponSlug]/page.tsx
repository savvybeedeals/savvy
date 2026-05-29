import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCouponBySlug } from "@/services/coupon-service";
import CouponCard from "@/components/modules/coupon-card";

interface Props {
  params: Promise<{ couponSlug: string }>;
}

// Full Dynamic SEO Optimization for Global/US/EU Markets
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { couponSlug } = await params;
  const coupon = await getCouponBySlug(couponSlug);

  if (!coupon) {
    return {
      title: "Coupon Not Found | Savvy Bee Deals 🍯",
      description: "Sorry, this coupon or promo code is currently unavailable or has expired.",
    };
  }

  const storeName = coupon.store?.name || "Store";
  const pageTitle = `${coupon.title} - ${storeName} Promo Code & Coupon | Savvy Bee Deals 🍯`;
  const pageDescription = coupon.description || `Get the best discount and save money with our exclusive and verified ${storeName} promo code today.`;

  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
    },
  };
}

// Single Coupon Page Component
export default async function CouponSlugPage({ params }: Props) {
  const { couponSlug } = await params;
  const coupon = await getCouponBySlug(couponSlug);

  // Automatically triggers 404 if the coupon doesn't exist
  if (!coupon) {
    notFound();
  }

  // بناء بيانات الـ Schema المهيكلة لدعم الـ Rich Snippets في جوجل
  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": coupon.title,
    "description": coupon.description || `Exclusive coupon code for ${coupon.store?.name || 'our partner store'}.`,
    "image": coupon.store?.logo || coupon.productImage || "https://savvybeedeals.com/favicon.ico",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "itemOffered": {
        "@type": "Coupon",
        "name": coupon.title,
        "promoCode": coupon.promoCode || ""
      },
      "seller": {
        "@type": "Organization",
        "name": coupon.store?.name || "Savvy Bee Deals"
      }
    }
  };

  return (
    <>
      {/* حقن الـ Structured Data من السيرفر مباشرة */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />

      <main className="min-h-screen bg-gray-50/50 py-12 px-4 md:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-8">
          
          {/* Badge & Main SEO Heading for Global Users */}
          <div className="text-center space-y-2">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full">
              Exclusive Deal
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              {coupon.title}
            </h1>
          </div>

          {/* Original Coupon Card (Maintains all active functionalities & styles) */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 md:p-4 transition-all duration-300 hover:shadow-md">
            <CouponCard coupon={coupon} />
          </div>

        </div>
      </main>
    </>
  );
}
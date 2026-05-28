import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { client } from "@/services/client"; 
import { getAllStores } from "@/services/store-service";
import { getLatestCoupons } from "@/services/coupon-service"; 
import { getLatestDeals } from "@/services/deals-service"; 
import { urlFor } from "@/sanity/lib/image"; 
import { MotionDiv } from "@/components/layout/motion-wrapper"; 
import { VipButton } from "@/components/ui/vip-button";
import { CouponsGrid } from "@/components/collections/coupons-grid";
import { DiscountsGrid } from "@/components/collections/discounts-grid";
import { DealsGrid } from "@/components/collections/deals-grid";

// [SEO 2026] تخصيص الـ Metadata الخاصة بالصفحة الرئيسية وتوريث قالب الـ Layout العالمي
export const metadata: Metadata = {
  title: "Home", 
  description: "Find the latest, 100% verified promo codes, hot deals, and shopping discount vouchers for your favorite online stores at Savvy Bee Deals.",
  openGraph: {
    title: "Savvy Bee Deals | Best Coupons, Promo Codes & Discounts",
    description: "Find the latest, 100% verified promo codes, hot deals, and shopping discount vouchers.",
    url: "https://savvybeedeals.com",
  }
};

export default async function Home() {
  // جلب البيانات الحقيقية تزامنياً بالكامل من Sanity للكوبونات والمتاجر والخصومات والعروض
  const stores = await getAllStores();
  const latestCoupons = await getLatestCoupons(); 
  const latestDeals = await getLatestDeals(); 

  // جلب الـ 4 خصومات الحقيقية الأحدث وتشكيل الـ id والـ store ليتطابق مع الـ Grid والكروت ويختفي خطأ الـ Key تماماً
  const latestDiscounts = await client.fetch(`
    *[_type == "discount"] | order(_createdAt desc)[0...4] {
      "id": _id,
      _id,
      name,
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
      "isVip": isVip == true,
      store->{
        name,
        "logo": logo.asset->url,
        "slug": slug.current
      }
    }
  `);

  // [SEO 2026] إنتاج الـ JSON-LD Schema لإصدار البيانات المهيكلة لمحرك البحث لجوجل
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://savvybeedeals.com/#organization",
        "name": "Savvy Bee Deals",
        "url": "https://savvybeedeals.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://savvybeedeals.com/apple-touch-icon.png",
          "width": "180",
          "height": "180"
        },
        "sameAs": [
          "https://x.com/SavvyBeeDeals"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://savvybeedeals.com/#website",
        "url": "https://savvybeedeals.com",
        "name": "Savvy Bee Deals",
        "description": "Smart Shopping, Bigger Savings. Verified coupons and promo codes.",
        "publisher": {
          "@id": "https://savvybeedeals.com/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://savvybeedeals.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
    ]
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-[#F8F9FA]">
      
      {/* حقن البيانات المهيكلة لجوجل لتعزيز ترتيب أرشفة موقع Savvy Bee Deals */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="flex-grow">
        
        {/* ================= HERO SECTION ================= */}
        <section className="bg-white py-10 px-6">
          <div className="max-w-7xl mx-auto text-center sm:text-left flex flex-col items-center sm:items-start gap-6">
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">
              Smart Shopping, <span className="text-sky-500">Bigger Savings.</span>
            </h1>
            <p className="max-w-xl text-lg text-slate-600 leading-relaxed">
              Welcome to Savvy Bee Deals. We bring you the latest verified coupons and exclusive offers from your favorite brands.
            </p>
            <div className="flex gap-4 mt-4">
              <button className="bg-[#FFD700] text-black px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-transform">
                Explore Coupons
              </button>
              <button className="border-2 border-slate-200 px-8 py-3 rounded-full font-bold hover:bg-slate-50 transition-colors">
                How it works
              </button>
            </div>
          </div>
        </section>

        {/* ================= TRUSTED BRANDS SECTION ================= */}
        <section className="py-10 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Header: Top Badge */}
            <div className="flex justify-center md:justify-start mb-4">
               <div className="bg-slate-100 border border-slate-200 text-slate-500 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-slate-400 rounded-full"></span>
                  Official Partners
               </div>
            </div>

            {/* Main Title & CTA Button */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
              <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter text-slate-900 uppercase">
                Trusted <span className="text-sky-500 not-italic">Brands</span>
              </h2>
              <div className="w-full sm:w-56 h-14 flex [&>a]:w-full [&>a]:h-full [&>a>div]:!w-full [&>a>div>div]:!w-full [&>a>div>div]:!h-full [&>a>div>div]:justify-center">
                <VipButton text="All Stores" href="/stores" variant="sky" />
              </div>
            </div>
            
            <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-6 justify-items-center">
              {stores.map((store, idx) => (
                <MotionDiv key={store._id} idx={idx}>
                  <Link 
                    href={`/stores/${store.slug.current}`} 
                    className="flex flex-col items-center gap-3 group cursor-pointer"
                  >
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden transition-all duration-300 relative shadow-lg bg-white border border-gray-100 group-hover:shadow-2xl">
                        {store.logo ? (
                           <Image 
                            src={urlFor(store.logo).url()} 
                            alt={store.name}
                            width={80}
                            height={80}
                            className="object-contain p-2"
                           />
                        ) : (
                          <span className="text-xl font-black text-slate-400">{store.name.charAt(0)}</span>
                        )}
                        <div className="absolute inset-0 rounded-full bg-sky-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-black group-hover:text-sky-500 transition-colors duration-300 text-center">
                      {store.name}
                    </span>
                  </Link>
                </MotionDiv>
              ))}
            </div>
          </div>
        </section>

        {/* ================= LATEST COUPONS SECTION ================= */}
        <section className="py-12 px-6 bg-white/50 border-t border-slate-100">
          <div className="max-w-7xl mx-auto">
            {/* Header: Verified Coupons Badge */}
            <div className="flex justify-center md:justify-start mb-4">
               <div className="bg-sky-50 border border-sky-100 text-sky-500 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-sky-500 rounded-full animate-pulse"></span>
                  Verified Coupons
               </div>
            </div>

            {/* Main Title & CTA Button */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
              <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter text-slate-900 uppercase">
                LATEST <span className="text-sky-500 not-italic">COUPONS</span>
              </h2>
              <div className="w-full sm:w-56 h-14 flex [&>a]:w-full [&>a]:h-full [&>a>div]:!w-full [&>a>div>div]:!w-full [&>a>div>div]:!h-full [&>a>div>div]:justify-center">
                <VipButton text="All Coupons" href="/coupons" variant="sky" />
              </div>
            </div>

            {/* Coupons Grid */}
            <CouponsGrid coupons={latestCoupons} />
          </div>
        </section>

        {/* ================= SAVVY BEE DEALS HUB MID BANNER ================= */}
        <section className="py-12 flex flex-col items-center justify-center bg-transparent select-none">
          <div className="w-10 h-10 bg-[#FFD700] rounded-full flex items-center justify-center shadow-md mb-3 border border-amber-200">
            <span className="text-xl">🐝</span>
          </div>
          <h3 className="text-3xl md:text-5xl font-[1000] tracking-tighter text-slate-900 uppercase italic">
            SAVVY BEE <span className="text-sky-500 not-italic">DEALS</span> HUB
          </h3>
        </section>

        {/* ================= FLASH DISCOUNTS SECTION ================= */}
        <section className="py-12 px-6 bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto">
            {/* Header: Top Picks Badge */}
            <div className="flex justify-center md:justify-start mb-4">
               <div className="bg-sky-50 border border-sky-100 text-sky-500 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-sky-500 rounded-full animate-pulse"></span>
                  Top Picks for You
               </div>
            </div>

            {/* Main Title & CTA Button */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
              <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter text-slate-900 uppercase leading-none">
                Flash <span className="text-sky-500 not-italic">Discounts</span>
              </h2>
              <div className="w-full sm:w-56 h-14 flex [&>a]:w-full [&>a]:h-full [&>a>div]:!w-full [&>a>div>div]:!w-full [&>a>div>div]:!h-full [&>a>div>div]:justify-center">
                <VipButton text="All Discounts" href="/discounts" variant="sky" />
              </div>
            </div>

            {/* Discounts Grid */}
            <DiscountsGrid discounts={latestDiscounts} />
          </div>
        </section>

        {/* ================= TOP DEALS SECTION ================= */}
        <section className="py-12 px-6 bg-white/50 border-t border-slate-100">
          <div className="max-w-7xl mx-auto">
            {/* Header: Hot Offers Badge */}
            <div className="flex justify-center md:justify-start mb-4">
               <div className="bg-amber-50 border border-amber-100 text-amber-600 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                  Hot Offers Right Now
               </div>
            </div>

            {/* Main Title & CTA Button */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
              <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter text-slate-900 uppercase leading-none">
                Top <span className="text-sky-500 not-italic">Deals</span>
              </h2>
              <div className="w-full sm:w-56 h-14 flex [&>a]:w-full [&>a]:h-full [&>a>div]:!w-full [&>a>div>div]:!w-full [&>a>div>div]:!h-full [&>a>div>div]:justify-center">
                <VipButton text="All Deals" href="/deals" variant="orange" />
              </div>
            </div>

            {/* Deals Grid */}
            <DealsGrid deals={latestDeals} />
          </div>
        </section>

      </main>
    </div>
  );
}
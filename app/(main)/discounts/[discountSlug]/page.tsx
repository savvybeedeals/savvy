import { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/services/client";
import { DiscountsCard } from "@/components/modules/discounts-card";

interface Props {
  // التعديل الصحيح: تطابق الاسم تماماً مع اسم المجلد الديناميكي [discountSlug]
  params: Promise<{ discountSlug: string }>;
}

/**
 * جلب بيانات الخصم الفردي من Sanity بالاعتماد على الـ Slug
 */
async function getDiscountBySlug(slug: string): Promise<any> {
  // حماية إضافية: لمنع إرسال طلب فارغ لـ Sanity إذا كان الـ slug غير معرف
  if (!slug) return null;

  const query = `*[_type == "discount" && slug.current == $slug][0] {
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
    category->{ name, "slug": slug.current },
    store->{ name, "logo": logo.asset->url, "slug": slug.current }
  }`;

  try {
    const discount = await client.fetch(query, { slug });
    return discount;
  } catch (error) {
    console.error("Error fetching discount by slug:", error);
    return null;
  }
}

// التخصيص الكامل للـ SEO الديناميكي الموجه للأسواق العالمية
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { discountSlug } = await params;
  const discount = await getDiscountBySlug(discountSlug);

  if (!discount) {
    return {
      title: "Discount Not Found | Savvy Bee",
      description: "Sorry, this limited-time flash discount is currently unavailable or has expired.",
    };
  }

  const storeName = discount.store?.name || "Store";
  const pageTitle = `${discount.name} - ${storeName} Verified Deal | Savvy Bee`;
  const pageDescription = discount.description || `Save big with our verified ${storeName} price drop. Get ${discount.name} at the lowest price today.`;

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

// مكون الصفحة الفردية للخصم
export default async function DiscountSlugPage({ params }: Props) {
  const { discountSlug } = await params;
  const discount = await getDiscountBySlug(discountSlug);

  // حماية وتوجيه تلقائي لصفحة 404 في حال عدم وجود الخصم في السانيتي
  if (!discount) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50/50 py-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* شارة علوية لتحسين الـ SEO الداخلي وتجربة المستخدم */}
        <div className="text-center space-y-2">
          <span className="text-sm font-semibold text-sky-500 uppercase tracking-wider bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
            Limited Time Price Drop
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            {discount.name}
          </h1>
        </div>

        {/* تعديل توحيد العرض: حاوية مرنة تمنع التمدد وتجعل الكارت بنفس أبعاده القياسية الأصلية في المنتصف */}
        <div className="flex justify-center items-center">
          <div className="w-full max-w-[380px] bg-[#F5F6F7] rounded-[2.5rem] shadow-sm border border-gray-100 p-2 transition-all duration-300 hover:shadow-md">
            <DiscountsCard discount={discount} />
          </div>
        </div>

      </div>
    </main>
  );
}
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDealBySlug, getAllDeals } from "@/services/deals-service";
import DealCard from "@/components/modules/deals-card";

// إجبار الصفحة على التحديث الفوري لالتقاط أي Slugs جديدة مباشرة من السيرفر
export const dynamic = "force-dynamic";
export const revalidate = 0;

// تعريف الواجهة البرمجية (Interface) لمنع خطأ الـ Implicit Any في الـ TypeScript
interface DealData {
  _id: string;
  title: string;
  description?: string;
  secondTitle?: string;
  expiryDate?: string;
  isVip?: boolean;
  affiliateUrl?: string;
  type?: 'Code' | 'Deal';
  rating?: number;
  usersCount?: number;
  slug?: string;
  store?: {
    name: string;
    logo?: any;
    slug?: string;
  };
  category?: {
    name: string;
    slug?: string;
  };
}

interface Props {
  // التعديل الجوهري: مطابقة اسم البارامتر تماماً مع اسم مجلدك الحالي [dealsslug]
  params: Promise<{ dealsslug: string }>;
}

// دالة مساعدة لـ Next.js لإنشاء المسارات مسبقاً ومنع الـ 404 مع تحديد الأنواع بشكل صريح 100%
export async function generateStaticParams() {
  const deals: DealData[] = await getAllDeals();
  return deals
    .filter((deal: DealData) => deal.slug)
    .map((deal: DealData) => ({
      dealsslug: deal.slug,
    }));
}

// توليد البيانات الوصفية المخصصة للـ SEO الديناميكي بشكل آمن
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const dealSlug = resolvedParams?.dealsslug;
  
  const deal = await getDealBySlug(dealSlug);

  if (!deal) {
    return {
      title: "Deal Not Found | Savvy Bee",
      description: "Sorry, this product deal is currently unavailable or has expired.",
    };
  }

  const storeName = deal.store?.name || "Partner Store";
  const pageTitle = `${deal.title} - ${storeName} Exclusive Deal | Savvy Bee`;
  const pageDescription = deal.description || `Get the best price drop on ${deal.title} at ${storeName}. Verified and tested product deal available now.`;

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

// مكون الصفحة الفردية للعرض المختار
export default async function DealSlugPage({ params }: Props) {
  const resolvedParams = await params;
  const dealSlug = resolvedParams?.dealsslug;

  // جلب بيانات العرض الفردي من السيرفيس
  const deal = await getDealBySlug(dealSlug);

  // توجيه فوري لصفحة 404 المدمجة إذا لم يتم العثور على العرض في قاعدة البيانات
  if (!deal) {
    notFound();
  }

  // ترتيب تمرير الخصائص لـ DealCard لتتوافق مع الـ Props الخاصة به
  const cardProps = {
    ...deal, // تمرير الكائن الأساسي كأمان إضافي
    _id: deal._id,
    storeName: deal.store?.name || "Store",
    storeLogo: deal.store?.logo,
    discount: deal.secondTitle || "PROMO",
    title: deal.title,
    description: deal.description,
    isVip: deal.isVip,
    expiryDate: deal.expiryDate,
    usersCount: deal.usersCount,
    affiliateUrl: deal.affiliateUrl,
    storeSlug: deal.store?.slug,
    type: deal.type || "Deal",
    rating: deal.rating,
  };

  return (
    <main className="min-h-screen bg-[#F8F9FA] py-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* العناوين والشارات العلوية المخصصة للمظهر والدعم البرمجي */}
        <div className="text-center space-y-2">
          <span className="text-xs font-black text-amber-600 uppercase tracking-[0.2em] bg-amber-50 px-4 py-1.5 rounded-full border border-amber-100 inline-block">
            Verified Product Deal
          </span>
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
            {deal.title}
          </h1>
        </div>

        {/* الحاوية الموحدة لعرض الكارت بالأبعاد القياسية المستقرة والمحاذية للمنتصف */}
        <div className="flex justify-center items-center w-full">
          <div className="w-full max-w-4xl transition-all duration-300">
            <DealCard {...cardProps} />
          </div>
        </div>

      </div>
    </main>
  );
}
import { getAllDeals } from "@/services/deals-service";
import { DealsGrid } from "@/components/collections/deals-grid";
import { ShoppingCart } from "lucide-react";

export const metadata = {
  title: "All Deals & Discounts | Savvy Bee Deals",
  description: "Browse the latest verified product discounts, price drops, and exclusive deals from top international brands.",
};

export default async function DealsPage() {
  // جلب البيانات هنا من السيرفيس الصحيح لضمان تمريرها لشبكة العرض وحساب العدد بدقة
  const deals = await getAllDeals();

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
      {/* Header Section */}
      <header className="bg-white border-b border-slate-100 py-12 px-6 mb-10">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="bg-amber-50 text-amber-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 mb-6 border border-amber-100">
            <ShoppingCart size={14} />
            {deals.length} Verified Discounts Available
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4">
            Today's Best <span className="text-sky-500">Deals</span>
          </h1>
          
          <p className="max-w-2xl text-slate-500 font-medium text-lg leading-relaxed">
            Discover the ultimate price drops and hand-picked product discounts. 
            Updated constantly to ensure you never miss out on massive savings.
          </p>
        </div>
      </header>

      {/* Grid Section */}
      <section className="max-w-7xl mx-auto px-6 w-full">
        {/* استدعاء المكون وتفعيل الفلترة وعرض العروض والزر الآمن والمعدل */}
        <DealsGrid deals={deals} showFilter={true} />
      </section>

      {/* SEO Content Section */}
      <section className="max-w-4xl mx-auto px-6 mt-20 pt-10 border-t border-slate-200">
        <h2 className="text-2xl font-black text-slate-800 mb-4 uppercase italic tracking-tighter">
          How to claim our deals?
        </h2>
        <div className="grid md:grid-cols-3 gap-8 text-slate-600 font-medium text-sm leading-relaxed">
          <p>
            <strong className="text-sky-500 block mb-1">1. Explore</strong>
            Browse through our exclusive catalog of product discounts and premium offers.
          </p>
          <p>
            <strong className="text-sky-500 block mb-1">2. Unlock & Copy</strong>
            Click the product card to review full details, reveal the promo code, and automatically visit the store.
          </p>
          <p>
            <strong className="text-sky-500 block mb-1">3. Checkout</strong>
            Apply the code on the destination store page to apply the price reduction instantly.
          </p>
        </div>
      </section>
    </div>
  );
}
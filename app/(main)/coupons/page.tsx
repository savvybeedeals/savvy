import { getAllCoupons } from "@/services/coupon-service";
import { CouponsGrid } from "@/components/collections/coupons-grid";
import { Ticket } from "lucide-react";

export const metadata = {
  title: "All Coupons | Savvy Bee Deals",
  description: "Browse the latest verified coupon codes and deals from top international brands.",
};

export default async function CouponsPage() {
  // جلب البيانات هنا لضمان تمريرها لشبكة العرض وحساب العدد بدقة
  const coupons = await getAllCoupons();

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
      {/* Header Section */}
      <header className="bg-white border-b border-slate-100 py-12 px-6 mb-10">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="bg-amber-50 text-amber-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 mb-6 border border-amber-100">
            <Ticket size={14} />
            {coupons.length} Verified Offers Available
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4">
            Today's Best <span className="text-sky-500">Coupons</span>
          </h1>
          
          <p className="max-w-2xl text-slate-500 font-medium text-lg leading-relaxed">
            Save more on your favorite brands with our hand-picked and tested coupon codes. 
            Updated hourly to ensure 100% working deals.
          </p>
        </div>
      </header>

      {/* Grid Section - تم تعديل الحاوية هنا لتصبح max-w-[90rem] لمنع انكماش الكروت */}
      <section className="max-w-[90rem] mx-auto px-6 w-full">
        {/* نمرر showFilter كـ true هنا حصرياً ليظهر محرك البحث الذكي في هذه الصفحة فقط */}
        <CouponsGrid coupons={coupons} showFilter={true} />
      </section>

      {/* SEO Content Section (Optional) */}
      <section className="max-w-4xl mx-auto px-6 mt-20 pt-10 border-t border-slate-200">
        <h2 className="text-2xl font-black text-slate-800 mb-4 uppercase italic tracking-tighter">
          How to use our coupons?
        </h2>
        <div className="grid md:grid-cols-3 gap-8 text-slate-600 font-medium text-sm leading-relaxed">
          <p>
            <strong className="text-sky-500 block mb-1">1. Choose</strong>
            Find the store or deal that fits your needs from our curated list.
          </p>
          <p>
            <strong className="text-sky-500 block mb-1">2. Copy</strong>
            Click on "Get Code" to reveal and copy the unique discount code.
          </p>
          <p>
            <strong className="text-sky-500 block mb-1">3. Save</strong>
            Paste the code at the checkout page of the store and enjoy your savings.
          </p>
        </div>
      </section>
    </div>
  );
}
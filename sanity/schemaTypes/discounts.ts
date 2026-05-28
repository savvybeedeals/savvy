import { defineField, defineType } from "sanity";

export const discountsSchema = defineType({
  name: "discount",
  title: "Flash Discounts",
  type: "document",
  fields: [
    // 1. Product Name
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      description: "اسم المنتج المراد عمل الخصم عليه",
      validation: (Rule) => Rule.required().min(3).max(100),
    }),

    // حقل الـ Slug المضاف حديثاً لتوليد روابط URL ديناميكية متوافقة مع الـ SEO
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      description: "الرابط الفريد لصفحة الخصم (اضغط على Generate لإنشائه تلقائياً من اسم المنتج)",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required().error("الـ Slug مطلوب لإنشاء صفحة منفردة متوافقة مع محركات البحث"),
    }),

    // 2. Product Short Description
    defineField({
      name: "description",
      title: "Product Short Description",
      type: "text",
      description: "وصف قصير ومميز للمنتج يظهر داخل الكارت والـ Popup",
      validation: (Rule) => Rule.required().min(10).max(500),
    }),

    // 3. Product Image
    defineField({
      name: "productImage",
      title: "Product Image",
      type: "image",
      description: "رفع صورة المنتج الرسمية عالية الجودة (إجبارية)",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),

    // 4. Current Price
    defineField({
      name: "oldPrice",
      title: "Original Price / Current Price ($)",
      description: "السعر الحالي الأصلي للمنتج قبل تطبيق الخصم",
      type: "number",
      validation: (Rule) => Rule.required().positive(),
    }),

    // 5. Discount Percentage (%)
    defineField({
      name: "discountPercentage",
      title: "Discount Percentage (%)",
      description: "نسبة الخصم المئوية (مثال: اكتب 20 لخصم 20%)",
      type: "number",
      validation: (Rule) => Rule.min(0).max(100),
    }),

    // 6. Price After Discount ($)
    defineField({
      name: "currentPrice",
      title: "Price After Discount ($)",
      type: "number",
      description: "السعر النهائي بعد الخصم. ملحوظة: يتم حساب هذه القيمة تلقائياً في الواجهة الأمامية (Frontend) بناءً على السعر الأصلي ونسبة الخصم، أو يمكنك إدخال قيمة مخصصة هنا يدوياً.",
      validation: (Rule) => Rule.positive(),
    }),

    // 7. Affiliate Link / Shop Link
    defineField({
      name: "affiliateLink",
      title: "Affiliate Link / Shop Link",
      type: "url",
      description: "رابط التوجيه المباشر الخاص بالأفلييت للمتجر",
      validation: (Rule) => Rule.required().uri({ scheme: ["http", "https"] }),
    }),

    // 8. Affiliate Promo Code / Coupon
    defineField({
      name: "promoCode",
      title: "Affiliate Promo Code / Coupon",
      type: "string",
      description: "كود الخصم التابع لك للأفلييت والذي سيتم نسخه تلقائياً",
      validation: (Rule) => Rule.required(),
    }),

    // 9. Discount Expiry Date
    defineField({
      name: "expiryDate",
      title: "Discount Expiry Date",
      type: "date",
      description: "تاريخ انتهاء هذا الخصم وعقد الصفقة",
      options: {
        dateFormat: "YYYY-MM-DD",
      },
      validation: (Rule) => Rule.required(),
    }),

    // 10. category (إضافة جديدة مية مية)
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      description: "اختر القسم التابع له هذا المنتج (مثال: Health أو Electronics) لربطه بصفحات الأقسام وتفعيل الفلترة",
      validation: (Rule) => Rule.required().error("القسم مطلوب لربط المنتج بصفحة التصنيفات"),
    }),

    // 11. Store Provider
    defineField({
      name: "store",
      title: "Store Provider",
      type: "reference",
      to: [{ type: "store" }],
      description: "اختر المتجر المقدم للخصم من المتاجر الحالية المسجلة لديك في قاعدة البيانات",
      validation: (Rule) => Rule.required(),
    }),

    // 12. Is Savvy VIP Exclusive?
    defineField({
      name: "isVip",
      title: "Is Savvy VIP Exclusive?",
      type: "boolean",
      description: "تفعيل هذا الخيار يجعل الخصم حصرياً لأعضاء الـ VIP فقط",
      initialValue: false,
    }),

    // 13. Product Rating Stars
    defineField({
      name: "rating",
      title: "Product Rating Stars",
      type: "number",
      description: "تقييم النجوم للمنتج من 1.0 إلى 5.0",
      initialValue: 4.5,
      validation: (Rule) => Rule.min(1).max(5),
    }),

    // 14. Today's Usage Count
    defineField({
      name: "usersCount",
      title: "Today's Usage Count",
      type: "number",
      description: "عدد مرات الاستخدام. يتم تحديثه تلقائياً برمجياً من الموقع عند الضغط على كارت الخصم",
      initialValue: 100,
      readOnly: true,
    }),
  ],
});

export default discountsSchema;
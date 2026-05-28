import { Ticket } from 'lucide-react'; // إذا كنت تستخدم أيقونات في الاستوديو

export default {
  name: 'coupon',
  title: 'Coupons',
  type: 'document',
  icon: Ticket,
  fields: [
    {
      name: 'title',
      title: 'Coupon Title',
      type: 'string',
      description: 'مثال: خصم 20% على جميع المنتجات',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Coupon Description',
      type: 'text',
      description: 'وصف تفصيلي للخصم وشروط الاستخدام',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'discount',
      title: 'Discount Value (Short)',
      type: 'string',
      description: 'مثال: 20% OFF أو SALE',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'couponType',
      title: 'Access Level',
      type: 'string',
      options: {
        list: [
          { title: 'Normal (Public)', value: 'normal' },
          { title: 'VIP (Members Only)', value: 'vip' },
        ],
        layout: 'radio',
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'type',
      title: 'Offer Type',
      type: 'string',
      options: {
        list: [
          { title: 'Code', value: 'Code' },
          { title: 'Deal', value: 'Deal' },
        ],
      },
      initialValue: 'Code',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'code',
      title: 'Coupon Code',
      type: 'string',
      description: 'اتركه فارغاً في حال كان نوع العرض Deal',
      hidden: ({ document }: any) => document?.type === 'Deal',
      // اجباري فقط لو كان نوع العرض Code
      validation: (Rule: any) => 
        Rule.custom((value: any, context: any) => {
          if (context.document.type === 'Code' && !value) return 'Code is required for coupon type';
          return true;
        }),
    },
    {
      name: 'affiliateUrl',
      title: 'Affiliate / Store Link',
      type: 'url',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'expiryDate',
      title: 'Expiry Date',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM-DD',
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'store',
      title: 'Store',
      type: 'reference',
      to: [{ type: 'store' }], // يربط الكبون بمتجر من جدول المتاجر
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'rating',
      title: 'Rating (Static Start)',
      type: 'number',
      initialValue: 4.5,
      description: 'التقييم الابتدائي للكبون (سيتم تحديثه برمجياً لاحقاً)',
      validation: (Rule: any) => Rule.min(1).max(5),
    },
    {
      name: 'usersCount',
      title: 'Usage Count (Views/Uses)',
      type: 'number',
      initialValue: 100,
      description: 'عدد مرات الاستخدام. يتم تحديثه تلقائياً عند الضغط على الكبون',
      readOnly: true, // نجعله للقراءة فقط في الاستوديو لأنه يُدار برمجياً
    },
  ],
};
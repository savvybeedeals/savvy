import { Tags } from 'lucide-react';

export default {
  name: 'deal',
  title: 'Deals',
  type: 'document',
  icon: Tags,
  fields: [
    {
      name: 'title',
      title: 'Deal Title',
      type: 'string',
      description: 'مثال: خصم يصل إلى 50% على لابتوبات ديل',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'secondTitle',
      title: 'Second Title',
      type: 'string',
      description: 'العنوان الثانوي الكرت المتمثل في كلمة (Promo) أو أي عنوان مخصص لهذا العرض',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Deal Description',
      type: 'text',
      description: 'وصف تفصيلي للعرض وشروطه ومميزاته',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'dealType',
      title: 'Access Level',
      type: 'string',
      options: {
        list: [
          { title: 'Normal (Public)', value: 'normal' },
          { title: 'VIP (Members Only)', value: 'vip' },
        ],
        layout: 'radio',
      },
      initialValue: 'normal',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'affiliateUrl',
      title: 'Affiliate / Store Link',
      type: 'url',
      description: 'رابط التوجيه المباشر الذي سيضغط عليه المشتري للحصول على العرض',
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
      to: [{ type: 'store' }], // ربط العرض بمتجر من جدول المتاجر (دروب ميو)
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'rating',
      title: 'Rating (Static Start)',
      type: 'number',
      initialValue: 4.5,
      description: 'التقييم الابتدائي للعرض (يتم تحديثه تلقائياً برمجياً لاحقاً)',
      validation: (Rule: any) => Rule.min(1).max(5),
    },
    {
      name: 'usersCount',
      title: 'Usage Count (Views/Uses)',
      type: 'number',
      initialValue: 100,
      description: 'عدد مرات الضغط والتوجيه. يتم تحديثه تلقائياً برمجياً وجعله للقراءة فقط في الاستوديو',
      readOnly: true,
    },
  ],
};
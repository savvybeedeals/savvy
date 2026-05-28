import { Layers } from 'lucide-react';

export default {
  name: 'category',
  title: 'Categories',
  type: 'document',
  icon: Layers,
  fields: [
    {
      name: 'name',
      title: 'Category Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'icon',
      title: 'Category Icon (Emoji/Lucide)',
      type: 'string',
      description: 'اكتب إيموجي أو اسم الأيقونة لعرضها في القائمة المنسدلة (مثال: 👗 أو 🔌)',
    },
    {
      name: 'description',
      title: 'Description (SEO)',
      type: 'text',
    },
    {
      name: 'parent',
      title: 'Parent Category',
      type: 'reference',
      to: [{ type: 'category' }],
      description: 'اتركه فارغاً إذا كان هذا هو القسم الرئيسي الأكبر، أو اختر القسم الأب التابع له لتوليد الفروع.',
    },
  ],
};
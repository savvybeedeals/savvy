import { TagIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'store',
  title: 'Stores',
  type: 'document',
  icon: TagIcon,
  // تنظيم الحقول في مجموعات (Tabs) لراحة العين وسهولة الإدخال بعد حذف مجموعة الأفلييت
  groups: [
    { name: 'main', title: 'Main Info' },
    { name: 'seo', title: 'SEO Settings' },
  ],
  fields: [
    // --- مجموعة البيانات الأساسية (Main Info) ---
    defineField({
      name: 'name',
      title: 'Store Name',
      type: 'string',
      group: 'main',
      validation: (Rule) => Rule.required().error('Store name is required'),
      description: 'The official name of the brand (e.g., Amazon, Nike)',
    }),

    defineField({
      name: 'isFeatured',
      title: 'Featured Store',
      type: 'boolean',
      group: 'main',
      initialValue: false,
      description: 'If enabled, this store will appear first in the Trusted Brands section.',
    }),

    defineField({
      name: 'slug',
      title: 'Slug',      
      type: 'slug',
      group: 'main',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
      description: 'The URL path (e.g., /stores/amazon). Click "Generate" to create it from the name.',
    }),

    defineField({
      name: 'logo',
      title: 'Store Logo',
      type: 'image',
      group: 'main',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),

    // --- مجموعة الـ SEO (SEO Settings) ---
    defineField({
      name: 'metaTitle',
      title: 'Meta Title (SEO)',
      type: 'string',
      group: 'seo',
      description: 'Recommended: 50-60 characters. Example: Amazon Promo Codes & Coupons May 2026',
      validation: (Rule) =>
        Rule.custom((text) => {
          if (!text) return true;
          if (text.length < 30) return '⚠️ Too short for search results';
          if (text.length > 60) return '⚠️ Too long! Google may cut this title (max 60 chars recommended)';
          return true;
        }).warning(),
    }),

    defineField({
      name: 'description',
      title: 'Meta Description (SEO)',
      type: 'text',
      group: 'seo',
      rows: 3,
      description: 'SEO Best Practice: Aim for 120-160 characters.',
      validation: (Rule) =>
        Rule.custom((text) => {
          if (!text) return true;
          if (text.length < 50) return '⚠️ Too short for SEO (at least 50 chars recommended)';
          if (text.length > 160) return '⚠️ Too long! It might get cut off in Google results (max 160 chars)';
          return true;
        }).warning(),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'logo',
      subtitle: 'slug.current',
      isFeatured: 'isFeatured',
    },
    prepare(selection) {
      const { title, media, subtitle, isFeatured } = selection;
      return {
        title: isFeatured ? `⭐ ${title}` : title,
        media,
        subtitle: subtitle ? `/${subtitle}` : '',
      };
    },
  },
})
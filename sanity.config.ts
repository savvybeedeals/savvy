'use client'

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `app/admin/[[...tool]]/page.tsx` route
 */

import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'

// استيراد الإعدادات من ملف env لضمان المركزية
import { apiVersion, dataset } from './sanity/env'

// استيراد الـ schema الذي قمنا بتجميعه في الملف الذي أنشأناه سابقاً
import { schema } from './sanity/schema'

export default defineConfig({
  // المسار الذي تفتح منه لوحة التحكم
  basePath: '/admin', 
  
  // معرف المشروع الخاص بك
  projectId: 'xlug5h5i', 
  
  dataset: dataset || 'production',

  // استخدام الـ schema المجمع (store, category, coupon, etc.)
  schema: {
    types: schema.types,
  },

  plugins: [
    structureTool(),
    // أداة Vision لاختبار استعلامات GROQ داخل الاستوديو
    visionTool({ defaultApiVersion: apiVersion }),
  ],
})
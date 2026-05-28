import { type SchemaTypeDefinition } from 'sanity'

// استيراد السكيمات التي قمنا بإنشائها
import store from './schemaTypes/store'
import category from './schemaTypes/category'
import coupon from './schemaTypes/coupon'
import deals from './schemaTypes/deals'
import discounts from './schemaTypes/discounts'
import appSettings from './schemaTypes/appSettings' // 1. قمنا باستيراد السكيما الجديدة هنا بشكل صحيح
import blog from './schemaTypes/blog' // قمنا باستيراد سكيما المقالات الجديدة هنا

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    store,      // جدول المتاجر
    category,   // جدول التصنيفات
    coupon,     // جدول الكوبونات
    deals,      // جدول العروض
    discounts,  // جدول الخصومات
    appSettings, // 2. قمنا بإضافة السكيما هنا داخل المصفوفة ليتم تفعيلها في الداش بورد فوراً
    blog        // جدول المقالات الجديد
  ],
}
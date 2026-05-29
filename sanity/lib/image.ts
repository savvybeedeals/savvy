import createImageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url'

import { dataset, projectId } from '../env'

// https://www.sanity.io/docs/image-url
// بناء رابط الـ CDN الخاص بـ cdn.sanity.io باستخدام المعرفات الخاصة بمشروعك
const builder = createImageUrlBuilder({ projectId, dataset })

/**
 * دالة urlFor الكاملة
 * تأخذ حقل الصورة الناتجة من استعلامات Sanity وتُرجع كائن الباني لاستخراج رابط نقي 100% للصور
 */
export const urlFor = (source: SanityImageSource) => {
  return builder.image(source)
}
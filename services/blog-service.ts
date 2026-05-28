import { client } from '@/services/client'; // استيراد عميل الاتصال بـ Sanity المعتمد بمشروعك
import { ALL_BLOGS_QUERY, BLOG_BY_SLUG_QUERY } from '@/lib/sanity.queries';
import { BlogPost } from '@/types';

/**
 * جلب جميع المقالات لصفحة المدونة الرئيسية
 * مرتبة من الأحدث إلى الأقدم
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    // جلب البيانات مع تفعيل الكاش لـ Next.js مع إمكانية عمل revalidate لاحقاً
    const posts = await client.fetch<BlogPost[]>(
      ALL_BLOGS_QUERY,
      {},
      {
        next: {
          tags: ['blog'], // تاغ الـ Revalidation لتحديث الكاش عند إضافة مقال جديد
        },
      }
    );
    return posts || [];
  } catch (error) {
    console.error('Error fetching blog posts from Sanity:', error);
    return [];
  }
}

/**
 * جلب تفاصيل مقالة واحدة كاملة بناءً على الرابط الديناميكي (Slug)
 * @param slug الرابط الفريد للمقالة
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const post = await client.fetch<BlogPost | null>(
      BLOG_BY_SLUG_QUERY,
      { slug },
      {
        next: {
          tags: [`blog:${slug}`], // تاغ مخصص لتحديث هذه المقالة تحديداً عند تعديلها
        },
      }
    );
    return post;
  } catch (error) {
    console.error(`Error fetching blog post with slug "${slug}":`, error);
    return null;
  }
}
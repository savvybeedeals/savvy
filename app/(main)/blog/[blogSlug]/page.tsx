import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getBlogPostBySlug } from '@/services/blog-service';
import { client } from '@/services/client';
import { PortableText } from '@portabletext/react';
// 🟢 التحديث هنا: التعديل متوافق أيضاً مع صفحة المقال الفردي لمنع أي تحذيرات مستمرة
import { createImageUrlBuilder } from '@sanity/image-url';

interface BlogPostPageProps {
  params: Promise<{ blogSlug: string }> | { blogSlug: string };
}

// 🟢 التحديث هنا: تحديث الباني للدالة الجديدة
const builder = createImageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

// تخصيص مطابقة العناصر المرئية بين Sanity وموقعك بنسبة 100%
const portableTextComponents = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset) return null;
      return (
        <div className="relative my-8 aspect-[16/9] w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-900 shadow-md">
          <Image
            src={urlFor(value).url()}
            alt={value.alt || 'Blog content image'}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 768px"
            className="object-cover"
          />
        </div>
      );
    },
  },
  block: {
    h1: ({ children }: any) => <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50 mt-8 mb-4">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50 mt-8 mb-4 border-b border-gray-100 pb-2 dark:border-gray-800">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-6 mb-3">{children}</h3>,
    h4: ({ children }: any) => <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mt-4 mb-2">{children}</h4>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-amber-500 pl-4 italic text-gray-700 dark:text-gray-300 my-6 bg-amber-50/50 dark:bg-amber-950/20 py-2 pr-2 rounded-r-md">
        {children}
      </blockquote>
    ),
    normal: ({ children }: any) => <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-5 text-base sm:text-lg">{children}</p>,
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc pl-6 mb-5 space-y-2 text-gray-700 dark:text-gray-300">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal pl-6 mb-5 space-y-2 text-gray-700 dark:text-gray-300">{children}</ol>,
  },
  marks: {
    strong: ({ children }: any) => <strong className="font-bold text-gray-950 dark:text-white">{children}</strong>,
    em: ({ children }: any) => <em className="italic">{children}</em>,
    underline: ({ children }: any) => <u className="underline decoration-amber-500 decoration-2">{children}</u>,
    link: ({ children, value }: any) => {
      const rel = value.nofollow ? 'nofollow noopener noreferrer' : 'noopener noreferrer';
      const target = value.blank ? '_blank' : '_self';
      return (
        <a
          href={value.href}
          target={target}
          rel={rel}
          className="text-amber-500 underline font-medium transition-colors hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300"
        >
          {children}
        </a>
      );
    },
  },
};

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getBlogPostBySlug(resolvedParams.blogSlug);
  if (!post) return { title: 'Post Not Found' };
  return { title: `${post.title} | Savvy Bee Deals`, description: post.excerpt };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const post = await getBlogPostBySlug(resolvedParams.blogSlug);

  if (!post) notFound();

  const { title, mainImage, publishedAt, content } = post;
  const mainImageUrl = mainImage && mainImage.asset ? urlFor(mainImage).url() : '/placeholder.jpg';

  const displayDate = new Date(publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    numberingSystem: 'latn'
  });

  return (
    <article className="container mx-auto max-w-3xl px-4 py-10 sm:px-6">
      {/* Header */}
      <header className="mb-8 text-center">
        <time dateTime={publishedAt} className="text-sm font-semibold tracking-wide text-amber-500 uppercase">
          {displayDate}
        </time>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl lg:text-5xl">
          {title}
        </h1>
      </header>

      {/* Featured Image */}
      <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-2xl bg-gray-100 shadow-md dark:bg-gray-900">
        <Image
          src={mainImageUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 768px"
          className="object-cover"
          priority
        />
      </div>

      {/* Content Area */}
      <div className="prose prose-base sm:prose-lg max-w-none dark:prose-invert">
        <PortableText value={content} components={portableTextComponents} />
      </div>
    </article>
  );
}
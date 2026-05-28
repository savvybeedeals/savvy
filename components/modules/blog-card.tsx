'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BlogPost } from '@/types';
import { client } from '@/services/client';
// 🟢 التحديث هنا: استخدام التصدير المسمى الموصى به من ساني
import { createImageUrlBuilder } from '@sanity/image-url';

interface BlogCardProps {
  post: BlogPost;
}

// 🟢 التحديث هنا: استخدام الدالة الحديثة لتوليد الروابط
const builder = createImageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

export const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  const { title, slug, mainImage, excerpt, publishedAt } = post;

  const imageUrl = mainImage && mainImage.asset ? urlFor(mainImage).url() : '/placeholder.jpg';

  // تاريخ صارم بالإنجليزية والأرقام اللاتينية الموجهة لأمريكا وأوروبا
  const displayDate = new Date(publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    numberingSystem: 'latn'
  });

  return (
    <div className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-950">
      {/* Image Link */}
      <Link href={`/blog/${slug.current}`} className="relative block aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-gray-900">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority={false}
        />
      </Link>

      {/* Content Details */}
      <div className="p-5">
        {/* Published Date */}
        <div className="mb-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
          <time dateTime={publishedAt}>
            {displayDate}
          </time>
        </div>

        {/* Title */}
        <h3 className="mb-2 line-clamp-2 text-lg font-bold text-gray-900 transition-colors group-hover:text-amber-500 dark:text-gray-50 dark:group-hover:text-amber-400">
          <Link href={`/blog/${slug.current}`}>
            {title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="mb-4 line-clamp-3 text-sm text-gray-600 dark:text-gray-400">
          {excerpt}
        </p>

        {/* Action Link */}
        <Link
          href={`/blog/${slug.current}`}
          className="inline-flex items-center text-sm font-semibold text-amber-500 transition-colors hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300"
        >
          Read More
          <svg
            className="ml-1 h-4 w-4 transform transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
};
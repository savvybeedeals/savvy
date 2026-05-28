'use client';

import React from 'react';
import { BlogPost } from '@/types';
import { BlogCard } from '../modules/blog-card';

interface BlogGridProps {
  posts: BlogPost[];
}

export const BlogGrid: React.FC<BlogGridProps> = ({ posts }) => {
  // التعامل مع حالة عدم وجود مقالات مضافة
  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg text-gray-500 dark:text-gray-400">لا توجد مقالات منشورة حالياً.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <BlogCard key={post._id} post={post} />
      ))}
    </div>
  );
};
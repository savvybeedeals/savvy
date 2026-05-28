import React from 'react';
import { Metadata } from 'next';
import { getBlogPosts } from '@/services/blog-service';
import { BlogGrid } from '@/components/collections/blog-grid';

// SEO Settings for Western Audience
export const metadata: Metadata = {
  title: 'Blog | Savvy Bee Deals',
  description: 'Read the latest articles, smart shopping tips, saving guides, and how to maximize your savings with coupons.',
};

export default async function BlogPage() {
  // Fetch posts from Sanity on the server
  const posts = await getBlogPosts();

  return (
    <main className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-10 text-center">
        <h1 className="mb-3 text-3xl font-extrabold text-gray-900 dark:text-gray-50 sm:text-4xl">
          Savvy Bee <span className="text-amber-500">Blog</span>
        </h1>
        <p className="mx-auto max-w-2xl text-base text-gray-600 dark:text-gray-400">
          Your ultimate guide to smart shopping, money-saving tips, latest deals, and how to get the most out of your coupons.
        </p>
      </div>

      {/* Blog Posts Grid */}
      <BlogGrid posts={posts} />
    </main>
  );
}
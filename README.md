# 🍯 Savvy Bee Deals

Welcome to **Savvy Bee Deals**, a modern, high-performance web platform built for affiliate marketing, digital coupons, promo codes, and dynamic flash discounts. The platform targets high-purchasing shopping seasons across the United States and European markets.

## 🚀 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS & Framer Motion (for sweet animations 🐝)
- **Content Management:** Sanity CMS (Structured data & asset pipelines)
- **Database & Backend:** Supabase (Deployed across US & EU regions)

## 🏗️ Architecture & Optimization

The platform utilizes a hybrid architecture splitting views into highly optimized Server and Client components to guarantee **100% SEO efficacy** and lightning-fast Core Web Vitals:

- **Server Components (`page.tsx`):** Handles parallel server-side data fetching directly from Sanity CMS and dynamically generates rich metadata, OpenGraph tags, and semantic headers for flawless search engine indexation.
- **Client Components (`*Client.tsx`):** Manages dynamic UI micro-interactions, responsive states, client-side pagination (`Load More`), and fluid layouts without visual glitches.

---

## 🛠️ Development & Deployment

### Prerequisites
Make sure you have your environment variables configured for Sanity and Supabase in your `.env.local`:
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=your_dataset
# Add other Supabase & API tokens here
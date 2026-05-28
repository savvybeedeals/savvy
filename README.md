
```
savvy-code
├─ AGENTS.md
├─ app
│  ├─ (main)
│  │  ├─ about
│  │  │  └─ page.tsx
│  │  ├─ blog
│  │  │  ├─ page.tsx
│  │  │  └─ [blogSlug]
│  │  │     └─ page.tsx
│  │  ├─ categories
│  │  │  └─ [[...categorySlug]]
│  │  │     ├─ categoryClient.tsx
│  │  │     └─ page.tsx
│  │  ├─ contact
│  │  │  └─ page.tsx
│  │  ├─ coupons
│  │  │  ├─ page.tsx
│  │  │  └─ [couponSlug]
│  │  │     └─ page.tsx
│  │  ├─ deals
│  │  │  ├─ page.tsx
│  │  │  └─ [dealsslug]
│  │  │     └─ page.tsx
│  │  ├─ discounts
│  │  │  ├─ page.tsx
│  │  │  └─ [discountSlug]
│  │  │     └─ page.tsx
│  │  ├─ forgot-password
│  │  │  └─ page.tsx
│  │  ├─ layout.tsx
│  │  ├─ login
│  │  │  └─ page.tsx
│  │  ├─ privacy
│  │  │  └─ page.tsx
│  │  ├─ profile
│  │  │  └─ page.tsx
│  │  ├─ register
│  │  │  └─ page.tsx
│  │  ├─ reset-password
│  │  │  └─ page.tsx
│  │  ├─ search
│  │  │  └─ page.tsx
│  │  ├─ support
│  │  │  └─ page.tsx
│  │  └─ terms
│  │     └─ page.tsx
│  ├─ admin
│  │  └─ [[...tool]]
│  │     └─ page.tsx
│  ├─ api
│  │  ├─ coupon
│  │  │  ├─ save-coupon
│  │  │  │  └─ route.ts
│  │  │  └─ update-stats
│  │  │     └─ route.ts
│  │  ├─ deals
│  │  │  └─ save-deals
│  │  │     └─ route.ts
│  │  ├─ delete-account
│  │  │  └─ route.ts
│  │  ├─ discounts
│  │  │  └─ save-discounts
│  │  │     └─ route.ts
│  │  ├─ revalidate
│  │  │  └─ route.ts
│  │  └─ send-email
│  │     └─ route.ts
│  ├─ auth
│  │  └─ callback
│  │     └─ route.ts
│  ├─ favicon.ico
│  ├─ globals.css
│  ├─ layout.tsx
│  ├─ page.tsx
│  ├─ robots.ts
│  ├─ sitemap.ts
│  └─ stores
│     ├─ page.tsx
│     └─ [storeSlug]
│        ├─ page.tsx
│        └─ StorePageClient.tsx
├─ CLAUDE.md
├─ components
│  ├─ collections
│  │  ├─ blog-grid.tsx
│  │  ├─ category-filter.tsx
│  │  ├─ coupons-filter.tsx
│  │  ├─ coupons-grid.tsx
│  │  ├─ deals-filter.tsx
│  │  ├─ deals-grid.tsx
│  │  └─ discounts-grid.tsx
│  ├─ forms
│  │  ├─ contact-form.tsx
│  │  ├─ delete-account-form.tsx
│  │  ├─ forgot-password-form.tsx
│  │  ├─ login-form.tsx
│  │  └─ register-form.tsx
│  ├─ layout
│  │  ├─ footer.tsx
│  │  ├─ header.tsx
│  │  ├─ mobile-menu.tsx
│  │  └─ motion-wrapper.tsx
│  ├─ modules
│  │  ├─ blog-card.tsx
│  │  ├─ coupon-card.tsx
│  │  ├─ deals-card.tsx
│  │  ├─ discounts-card.tsx
│  │  ├─ profile-settings-modal.tsx
│  │  └─ store-card.tsx
│  └─ ui
│     └─ vip-button.tsx
├─ context
│  └─ auth-context.tsx
├─ eslint.config.mjs
├─ Gemini_Generated_Image_ik79s4ik79s4ik79.png
├─ lib
│  ├─ constants.ts
│  ├─ sanity.queries.ts
│  ├─ supabase.ts
│  └─ utils.ts
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ public
│  ├─ file.svg
│  ├─ globe.svg
│  ├─ next.svg
│  ├─ vercel.svg
│  └─ window.svg
├─ sanity
│  ├─ env.ts
│  ├─ lib
│  │  ├─ client.ts
│  │  ├─ image.ts
│  │  └─ live.ts
│  ├─ schema.ts
│  ├─ schemaTypes
│  │  ├─ appSettings.ts
│  │  ├─ blog.ts
│  │  ├─ category.ts
│  │  ├─ coupon.ts
│  │  ├─ deals.ts
│  │  ├─ discounts.ts
│  │  ├─ index.ts
│  │  └─ store.ts
│  └─ structure.ts
├─ sanity.cli.ts
├─ sanity.config.ts
├─ services
│  ├─ app-service.ts
│  ├─ blog-service.ts
│  ├─ category-service.ts
│  ├─ client.ts
│  ├─ coupon-service.ts
│  ├─ deals-service.ts
│  ├─ discounts-service.ts
│  └─ store-service.ts
├─ tsconfig.json
└─ types
   └─ index.ts

```
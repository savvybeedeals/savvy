export interface Category {
  _id: string;
  name: string;
  slug: { current: string };
  icon?: string;
  description?: string;
  parent?: { _ref: string; _type: 'reference' };
  subCategories?: Category[];
  subSubCategories?: Category[];
}

export interface Coupon {
  _id: string;
  title: string;
  description: string;
  code?: string;
  discountValue: string;
  type: 'code' | 'deal';
  expiryDate?: string;
}

export interface Store {
  _id: string;
  name: string;
  slug: { current: string };
  logo: any;
  url?: string;
  metaTitle?: string; // الحقل الجديد للـ SEO
  description?: string;
  affiliateNetwork?: string;
  categories?: Category[];
  coupons?: Coupon[]; // الحقل الجديد المرتبط بـ Sanity
}

// واجهة البيانات الجديدة الخاصة بالمقالات (Blog) متوافقة 100% مع السكيما
export interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage: {
    asset: {
      _ref: string;
      _type: string;
    };
  };
  excerpt: string;
  publishedAt: string;
  content: any[]; // مصفوفة الـ Block Content والمحتوى الغني من Sanity
}
import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

export async function POST(request: Request) {
  try {
    // قراءة البيانات والتأكد من أنها ليست فارغة
    const body = await request.json();
    const { couponId, type, ratingValue } = body;

    if (!couponId) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }

    if (type === 'usage') {
      await writeClient
        .patch(couponId)
        .setIfMissing({ usersCount: 0 })
        .inc({ usersCount: 1 })
        .commit();
    } 
    
    else if (type === 'rating' && ratingValue) {
      await writeClient
        .patch(couponId)
        .setIfMissing({ reviewsCount: 0, rating: 4.5 })
        .inc({ reviewsCount: 1 })
        .set({ rating: ratingValue }) 
        .commit();
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Sanity Update Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Internal Server Error' 
    }, { status: 500 });
  }
}
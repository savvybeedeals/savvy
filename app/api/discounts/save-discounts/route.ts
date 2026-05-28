import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { userId, discountId } = await request.json();
    // التقاط توكن المصادقة القادم من العميل
    const authHeader = request.headers.get('Authorization');

    if (!userId || !discountId) {
      return NextResponse.json(
        { success: false, message: 'Missing userId or discountId' }, 
        { status: 400 }
      );
    }

    // إنشاء عميل Supabase مخصص بهذه العملية يحمل توكن المستخدم لتخطي الـ RLS بأمان
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: authHeader ? { Authorization: authHeader } : {},
      },
    });

    // إدخال البيانات في جدول الخصومات المحفوظة
    const { data, error } = await supabase
      .from('saved_discounts')
      .insert([{ user_id: userId, discount_id: discountId }])
      .select();

    if (error) {
      // تجاهل الخطأ إذا كان الخصم محفوظاً بالفعل (بسبب قيد unique)
      if (error.code === '23505') {
        return NextResponse.json({ success: true, message: 'Discount already saved' });
      }
      console.error('Supabase insert error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });

  } catch (error) {
    console.error('Server error saving discount:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
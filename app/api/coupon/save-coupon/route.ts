import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { userId, couponId } = await request.json();
    
    // 🔥 التعديل الجديد 1: التقاط توكن المصادقة القادم من العميل
    const authHeader = request.headers.get('Authorization');

    if (!userId || !couponId) {
      return NextResponse.json(
        { success: false, message: 'Missing userId or couponId' }, 
        { status: 400 }
      );
    }

    // 🔥 التعديل الجديد 2: إنشاء عميل Supabase مخصص لهذه العملية يحمل توكن المستخدم
    // هذا يجعل قاعدة البيانات تتعرف على المستخدم وتسمح له باجتياز حماية RLS بأمان تام
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: authHeader ? { Authorization: authHeader } : {},
      },
    });

    // إدخال البيانات في جدول الكوبونات المحفوظة
    const { data, error } = await supabase
      .from('saved_coupons')
      .insert([{ user_id: userId, coupon_id: couponId }])
      .select();

    if (error) {
      // تجاهل الخطأ إذا كان الكوبون محفوظاً بالفعل (بسبب قيد unique)
      if (error.code === '23505') {
        return NextResponse.json({ success: true, message: 'Coupon already saved' });
      }
      console.error('Supabase insert error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Server error saving coupon:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
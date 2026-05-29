import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { userId, couponId } = await request.json();
    
    // التقاط توكن المصادقة القادم من العميل
    const authHeader = request.headers.get('Authorization');

    if (!userId || !couponId) {
      return NextResponse.json(
        { success: false, message: 'Missing userId or couponId' }, 
        { status: 400 }
      );
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Missing token' }, 
        { status: 401 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    
    // إنشاء عميل Supabase مخصص يحمل توكن المستخدم لتخطي الـ RLS
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    // 🔥 خطوة التأمين الإضافية (التحقق الفعلي من التوكن ومطابقة المستخدم لمنع الـ Spams)
    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user || user.id !== userId) {
      return NextResponse.json(
        { success: false, message: 'Forbidden: Invalid token or user mismatch' }, 
        { status: 403 }
      );
    }

    // إدخال البيانات في جدول الكوبونات المحفوظة الفعلي الخاص بك (saved_coupons)
    // نستخدم هنا .upsert مع الـ onConflict ليكون الكود مرناً ونظيفاً جداً
    const { data, error } = await supabase
      .from('saved_coupons')
      .upsert(
        { user_id: userId, coupon_id: couponId },
        { onConflict: 'user_id,coupon_id' }
      )
      .select();

    if (error) {
      console.error('Supabase upsert error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Server error saving coupon:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
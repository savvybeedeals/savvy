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
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    
    // 1. إنشاء عميل افتراضي للتحقق من التوكن فقط
    const supabaseAuthClient = createClient(supabaseUrl, supabaseAnonKey);

    // 🔥 خطوة التأمين (التحقق الفعلي من التوكن ومطابقة المستخدم لمنع الـ Spams)
    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabaseAuthClient.auth.getUser(token);

    if (authError || !user || user.id !== userId) {
      return NextResponse.json(
        { success: false, message: 'Forbidden: Invalid token or user mismatch' }, 
        { status: 403 }
      );
    }

    // 2. تـعـديـل جـوهـري: إنشاء عميل بصلاحيات الخدمة (Service Role) لإتمام الإدخال بأمان وتخطي الـ RLS
    // تأكد من وجود SUPABASE_SERVICE_ROLE_KEY في ملف الـ .env.local الخاص بك
    const supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY || '');

    // إدخال البيانات باستخدام عميل الأدمن الموثوق
    const { data, error } = await supabaseAdmin
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
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { userId, discountId } = await request.json();
    
    // التقاط توكن المصادقة القادم من العميل لتخطي حماية RLS
    const authHeader = request.headers.get('Authorization');

    if (!userId || !discountId) {
      return NextResponse.json(
        { success: false, message: 'Missing userId or discountId' }, 
        { status: 400 }
      );
    }

    // التحقق من وجود التوكن لمنع الطلبات العشوائية (Spam)
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Missing or invalid token format' }, 
        { status: 401 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    
    // 1. إنشاء عميل افتراضي للتحقق من التوكن فقط
    const supabaseAuthClient = createClient(supabaseUrl, supabaseAnonKey);

    // الخطوة الثالثة: فك التوكن والتحقق من الهوية الفردية ومطابقة الـ IDs لمنع التلاعب بالخلفية
    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabaseAuthClient.auth.getUser(token);

    if (authError || !user || user.id !== userId) {
      return NextResponse.json(
        { success: false, message: 'Forbidden: Invalid token or user mismatch' }, 
        { status: 403 }
      );
    }

    // 🔥 الـتـعـديـل الـجـوهـري: إنشاء عميل بصلاحيات الخدمة (Service Role) لتخطي الـ RLS بأمان داخل السيرفر
    const supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY || '');

    // تنفيذ عملية الإدخال باستخدام عميل الأدمن الموثوق
    const { data, error } = await supabaseAdmin
      .from('saved_discounts')
      .insert([{ user_id: userId, discount_id: discountId }])
      .select();

    if (error) {
      // 🔥 إذا كان الخصم محفوظاً بالفعل في المفضلة (Unique Constraint Violation)، نتجاوز الخطأ بذكاء
      if (error.code === '23505') {
        return NextResponse.json({ success: true, message: 'Discount already saved' }, { status: 200 });
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
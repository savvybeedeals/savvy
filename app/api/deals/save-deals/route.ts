import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { userId, dealId } = await request.json();

    // التقاط توكن المصادقة القادم من العميل لتخطي حماية RLS
    const authHeader = request.headers.get('Authorization');

    if (!userId || !dealId) {
      return NextResponse.json(
        { success: false, message: 'Missing userId or dealId' }, 
        { status: 400 }
      );
    }

    // التحقق من وجود التوكن وهيكلته لمنع الطلبات العشوائية (Spam)
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Missing or invalid token format' }, 
        { status: 401 }
      );
    }

    // إنشاء عميل Supabase مخصص لهذه العملية يحمل توكن المستخدم الحالي
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    // 🔥 الخطوة الثالثة: فك التوكن والتحقق من الهوية ومطابقة الـ IDs لمنع التلاعب
    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user || user.id !== userId) {
      return NextResponse.json(
        { success: false, message: 'Forbidden: Invalid token or user mismatch' }, 
        { status: 403 }
      );
    }

    // 🔥 الخطوة الثانية: الحفظ الآمن في جدول العروض الفعلي باستخدام الـ upsert لمنع تكرار البيانات هدوء
    const { data, error } = await supabase
      .from('saved_deals')
      .upsert(
        { user_id: userId, deal_id: dealId },
        { onConflict: 'user_id,deal_id' }
      )
      .select();

    if (error) {
      console.error('Supabase upsert error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Server error saving deal:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
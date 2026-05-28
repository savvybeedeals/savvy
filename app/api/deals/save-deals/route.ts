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

    // إنشاء عميل Supabase مخصص لهذه العملية يحمل توكن المستخدم
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: authHeader ? { Authorization: authHeader } : {},
      },
    });

    // إدخال البيانات في جدول العروض المحفوظة
    const { data, error } = await supabase
      .from('saved_deals')
      .insert([{ user_id: userId, deal_id: dealId }])
      .select();

    if (error) {
      // تجاهل الخطأ إذا كان العرض محفوظاً بالفعل (بسبب قيد unique)
      if (error.code === '23505') {
        return NextResponse.json({ success: true, message: 'Deal already saved' });
      }
      console.error('Supabase insert error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Server error saving deal:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
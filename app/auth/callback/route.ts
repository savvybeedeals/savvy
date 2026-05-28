import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  // 🔥 تم التعديل هنا ليصبح التوجيه التلقائي إلى الصفحة الرئيسية "/" بدلاً من "/profile"
  const next = requestUrl.searchParams.get('next') ?? '/';

  // 1. إذا وجد السيرفر كود التحقق (السيناريو الطبيعي المباشر)
  if (code) {
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (!error && data?.session) {
        const cookieStore = await cookies();
        
        cookieStore.set('sb-access-token', data.session.access_token, {
          path: '/',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: data.session.expires_in
        });
        
        cookieStore.set('sb-refresh-token', data.session.refresh_token, {
          path: '/',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7
        });

        return NextResponse.redirect(`${requestUrl.origin}${next}`);
      }
    } catch (catchError) {
      console.error("Callback catch error:", catchError);
    }
  }

  // 2. إذا رجع الرابط ويحتوي على التوكن في الـ Hash (#) ولم يجد السيرفر كلمة code
  // تم التعديل هنا أيضاً ليوجه العميل للصفحة الرئيسية مباشرة
  if (request.url.includes('#access_token') || request.url.includes('access_token=')) {
    return NextResponse.redirect(`${requestUrl.origin}/`);
  }

  // 3. الحل السحري: إذا تم استدعاء السيرفر فارغاً تماماً (بسبب الـ Router/Middleware)
  // تم التعديل هنا أيضاً ليوجه العميل للصفحة الرئيسية مباشرة ليلتقط الـ Client Session هناك
  console.log("Empty callback detected, safely forwarding to home-side session catcher...");
  return NextResponse.redirect(`${requestUrl.origin}/`);
}
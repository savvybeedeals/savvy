import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // 1. التحقق من وجود توكن العميل في الـ Headers
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    
    // 2. التحقق من هوية العميل وصحة جلسته
    const clientSupabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user }, error: authError } = await clientSupabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    // 3. استخدام الـ Service Role لحذف العميل نهائياً من سوبابيز
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // تحقق وقائي للتأكد من أن المفتاح مقروء بشكل سليم ومحمي من الكراش
    if (!supabaseServiceKey) {
      return NextResponse.json(
        { error: "Server Configuration Error: SUPABASE_SERVICE_ROLE_KEY is missing." }, 
        { status: 500 }
      );
    }

    const adminSupabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    const { error: deleteError } = await adminSupabase.auth.admin.deleteUser(user.id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Account deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
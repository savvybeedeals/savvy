import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// التحقق من أن الروابط صالحة وتبدأ بـ http لحماية السيرفر من الانهيار
const isValidUrl = supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://');

// تصدير كليانت موحد وآمن للمشروع بالكامل
export const supabase = isValidUrl 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder-project.supabase.co', 'placeholder-key');
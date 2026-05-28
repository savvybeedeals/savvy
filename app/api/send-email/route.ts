import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// استدعاء الكي السري من ملف البيئة بأمان
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    // 1. استقبال البيانات القادمة من الفورم التفاعلي
    const body = await request.json();
    const { name, email, subject, message } = body;

    // 2. تحقق سريع من وجود البيانات الأساسية
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required parameters inside the hive payload.' },
        { status: 400 }
      );
    }

    // 3. إرسال الإيميل عبر Resend
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev', // سيبها كدة سادة بدون أي إضافات في وضع الـ Sandbox
      to: 'savvybee.deals@gmail.com', // الإيميل الحقيقي لحسابك عشان ريسيند يوافق يبعت له
      replyTo: email, // عشان لما تضغط Reply يرد على العميل مباشرة
      subject: `🐝 Savvy Bee Inquiry: ${subject}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #1a1a1a; max-width: 600px; border: 1px solid #eaeaea; border-radius: 12px;">
          <h2 style="color: #0ea5e9; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px;">New Message from Honeycomb!</h2>
          <p><strong>Sender Name:</strong> ${name}</p>
          <p><strong>Sender Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Subject:</strong> ${subject}</p>
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin-top: 15px; border-left: 4px solid #0ea5e9;">
            <p style="margin: 0; white-space: pre-wrap;"><strong>Message Details:</strong><br/>${message}</p>
          </div>
          <footer style="margin-top: 20px; font-size: 10px; color: #94a3b8; text-transform: uppercase;">
            Automated transmission secure via Savvy Bee Deals Server API Hub.
          </footer>
        </div>
      `,
    });

    // 4. الرد بالنجاح على واجهة المستخدم
    return NextResponse.json({ success: true, data }, { status: 200 });

  } catch (error: any) {
    console.error("Resend API Error Logging:", error);
    return NextResponse.json(
      { error: error.message || 'Internal server error while processing transmission.' },
      { status: 500 }
    );
  }
}
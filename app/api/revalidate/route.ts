import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { parseBody } from "next-sanity/webhook";

// تعريف الواجهة البرمجية لنوع البيانات المتوقعة من السيرفر
interface RevalidateWebhookBody {
  _type: string;
  slug?: {
    current?: string;
  };
}

// السيرفر السري للتحقق من هوية الطلب القادم من Sanity لزيادة الأمان
const SANITY_REVALIDATE_SECRET = process.env.SANITY_REVALIDATE_SECRET;

export async function POST(req: NextRequest) {
  try {
    // 1. التحقق من صحة التوقيع والـ Token القادم من الـ Webhook
    const { isValidSignature, body } = await parseBody<RevalidateWebhookBody>(
      req,
      SANITY_REVALIDATE_SECRET
    );

    if (!isValidSignature) {
      return new NextResponse("Invalid signature", { status: 401 });
    }

    if (!body?._type) {
      return new NextResponse("Bad Request: Missing _type", { status: 400 });
    }

    const docType = body._type;

    // 2. عمل Revalidate ذكي بناءً على نوع المستند (Tag-based Revalidation)
    // تم استخدام (revalidateTag as any) لكسر تعارض حزم TypeScript وإجبار المحرك على تمرير معامل واحد فقط بأمان
    if (["coupon", "store", "deal", "discount", "category"].includes(docType)) {
      (revalidateTag as any)(docType);
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      message: `Cache successfully purged for document type: ${docType}`,
    });

  } catch (error: any) {
    console.error("❌ Revalidation Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
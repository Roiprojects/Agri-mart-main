import { NextResponse } from 'next/server';
import { CatalogueService } from '@/lib/catalogue-service';
import { devDb } from '@/lib/dev-db';

export async function GET() {
  const coupons = await CatalogueService.getCoupons();
  return NextResponse.json({ success: true, count: coupons.length, data: coupons });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.code || body.discountValue === undefined) {
      return NextResponse.json({ success: false, message: 'Coupon code and discount value are required.' }, { status: 400 });
    }

    const saved = await CatalogueService.saveCoupon(body);
    return NextResponse.json({
      success: true,
      data: saved,
      message: `Coupon "${saved.code}" saved.`,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

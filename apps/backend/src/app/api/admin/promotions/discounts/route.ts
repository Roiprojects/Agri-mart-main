import { NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

export async function GET() {
  try {
    const discounts = (devDb as any).data?.discounts || [];
    return NextResponse.json({ success: true, data: discounts });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ success: false, error: 'Discount name is required' }, { status: 400 });
    }

    if (!(devDb as any).data) {
      (devDb as any).data = {};
    }
    if (!(devDb as any).data.discounts) {
      (devDb as any).data.discounts = [];
    }

    const newDiscount = {
      id: body.id || `disc-${Date.now()}`,
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      name: body.name.trim(),
      discountType: body.discountType || 'Assigned to order total',
      vendor: body.vendor || 'No vendor',
      usePercentage: Boolean(body.usePercentage),
      discountAmount: Number(body.discountAmount || 0),
      discountPercentage: Number(body.discountPercentage || 0),
      currency: body.currency || 'USD',
      requiresCouponCode: Boolean(body.requiresCouponCode),
      couponCode: body.couponCode ? body.couponCode.trim() : '',
      startDate: body.startDate || '',
      endDate: body.endDate || '',
      cumulativeWithOtherDiscounts: Boolean(body.cumulativeWithOtherDiscounts),
      discountLimitation: body.discountLimitation || 'Unlimited',
      limitationTimes: Number(body.limitationTimes || 1),
      adminComment: body.adminComment || '',
      timesUsed: body.timesUsed || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    (devDb as any).data.discounts.unshift(newDiscount);

    try {
      (devDb as any).save?.();
    } catch (saveErr) {
      console.warn('Could not call save on devDb', saveErr);
    }

    return NextResponse.json({ success: true, data: newDiscount });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

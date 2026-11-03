import { NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const discounts = (devDb as any).data?.discounts || [];
    const discount = discounts.find((d: any) => d.id === id);
    if (!discount) {
      return NextResponse.json({ success: false, error: 'Discount not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: discount });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const discounts = (devDb as any).data?.discounts || [];
    const discount = discounts.find((d: any) => d.id === id);
    if (!discount) {
      return NextResponse.json({ success: false, error: 'Discount not found' }, { status: 404 });
    }

    Object.assign(discount, body, { updatedAt: new Date().toISOString() });

    try {
      (devDb as any).save?.();
    } catch (saveErr) {
      console.warn('Could not call save on devDb', saveErr);
    }

    return NextResponse.json({ success: true, data: discount });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const discounts = (devDb as any).data?.discounts || [];
    const index = discounts.findIndex((d: any) => d.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Discount not found' }, { status: 404 });
    }

    discounts.splice(index, 1);

    try {
      (devDb as any).save?.();
    } catch (saveErr) {
      console.warn('Could not call save on devDb', saveErr);
    }

    return NextResponse.json({ success: true, message: 'Discount deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

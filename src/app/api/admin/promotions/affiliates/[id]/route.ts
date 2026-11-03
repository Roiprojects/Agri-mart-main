import { NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const affiliates = (devDb as any).data?.affiliates || [];
    const affiliate = affiliates.find((a: any) => a.id === id);
    if (!affiliate) {
      return NextResponse.json({ success: false, error: 'Affiliate not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: affiliate });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const affiliates = (devDb as any).data?.affiliates || [];
    const affiliate = affiliates.find((a: any) => a.id === id);
    if (!affiliate) {
      return NextResponse.json({ success: false, error: 'Affiliate not found' }, { status: 404 });
    }

    Object.assign(affiliate, body, { updatedAt: new Date().toISOString() });

    try {
      (devDb as any).save?.();
    } catch (saveErr) {
      console.warn('Could not call save on devDb', saveErr);
    }

    return NextResponse.json({ success: true, data: affiliate });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const affiliates = (devDb as any).data?.affiliates || [];
    const index = affiliates.findIndex((a: any) => a.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Affiliate not found' }, { status: 404 });
    }

    affiliates.splice(index, 1);

    try {
      (devDb as any).save?.();
    } catch (saveErr) {
      console.warn('Could not call save on devDb', saveErr);
    }

    return NextResponse.json({ success: true, message: 'Affiliate deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

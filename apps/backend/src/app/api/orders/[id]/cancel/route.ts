import { NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json().catch(() => ({}));
    const { reason = 'Customer requested cancellation', userId = 'usr-farmer-01' } = body;

    const result = devDb.cancelOrder(id, userId, reason);

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: result.message });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

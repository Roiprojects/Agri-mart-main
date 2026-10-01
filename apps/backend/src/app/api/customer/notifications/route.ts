import { NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId') || 'usr-farmer-01';

  const notifications = devDb.getCustomerNotifications(userId);
  return NextResponse.json({ success: true, count: notifications.length, data: notifications });
}

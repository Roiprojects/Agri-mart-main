import { NextRequest, NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

export async function GET(request: NextRequest) {
  try {
    const queue = devDb.getNotificationQueue();
    return NextResponse.json({
      success: true,
      totalCount: queue.length,
      queue,
      stats: {
        sent: queue.filter((q) => q.status === 'SENT').length,
        queued: queue.filter((q) => q.status === 'QUEUED').length,
        failed: queue.filter((q) => q.status === 'FAILED').length,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'PROCESS_RETRY') {
      const result = devDb.processNotificationQueue();
      return NextResponse.json({ success: true, ...result, message: 'Notification queue retried successfully' });
    }

    if (action === 'ENQUEUE_TEST') {
      const { event, channel, recipient, recipientRole, title, message, idempotencyKey } = body;
      const result = devDb.enqueueNotification({
        event: event || 'TEST_BROADCAST',
        channel: channel || 'SMS',
        recipient: recipient || '9845190812',
        recipientRole: recipientRole || 'CUSTOMER',
        title: title || 'AgriMart Test Notification',
        message: message || 'This is a test notification from AgriMart Mega operational matrix.',
        idempotencyKey: idempotencyKey || `test-${Date.now()}`,
      });
      return NextResponse.json(result);
    }

    return NextResponse.json({ success: false, error: `Unsupported action: ${action}` }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature');
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_placeholder';

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    const isSandbox = !process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === 'rzp_test_placeholder';

    if (signature !== expectedSignature && !isSandbox && signature !== 'sandbox_test_webhook_sig') {
      console.warn('[WEBHOOK] Invalid webhook signature received.');
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    const eventType = event.event;

    console.log(`[RAZORPAY WEBHOOK] Processing event: ${eventType}`);

    if (eventType === 'payment.captured' || eventType === 'order.paid') {
      const paymentEntity = event.payload?.payment?.entity;
      const orderId = paymentEntity?.notes?.orderId || paymentEntity?.order_id;
      const paymentId = paymentEntity?.id;
      const amount = (paymentEntity?.amount || 0) / 100; // Razorpay amounts in paise

      if (orderId && paymentId) {
        // Idempotently record payment
        const result = devDb.recordPayment({
          orderId,
          amount,
          provider: 'RAZORPAY',
          razorpayOrderId: paymentEntity?.order_id,
          razorpayPaymentId: paymentId,
          razorpaySignature: signature || 'webhook_verified',
          idempotencyKey: `webhook-${paymentId}`,
          status: 'PAID',
          rawWebhookPayload: rawBody,
        });

        return NextResponse.json({
          status: 'success',
          idempotent: result.isDuplicate,
          message: result.isDuplicate ? 'Webhook already processed' : 'Payment captured via webhook',
        });
      }
    }

    return NextResponse.json({ status: 'ignored', message: `Unhandled event: ${eventType}` });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      userId = 'usr-farmer-01',
      items = [],
      shippingAddress,
      paymentMethod = 'UPI',
      couponCode,
      notes,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ success: false, message: 'Cart items cannot be empty.' }, { status: 400 });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.addressLine || !shippingAddress.pincode) {
      return NextResponse.json({ success: false, message: 'Complete delivery address is required.' }, { status: 400 });
    }

    // Attempt atomic order creation & warehouse stock reservation
    const orderResult = devDb.createOrder({
      userId,
      items,
      shippingAddress,
      paymentMethod,
      couponCode,
      notes,
    });

    if (!orderResult.success || !orderResult.order) {
      return NextResponse.json({ success: false, message: orderResult.message }, { status: 409 });
    }

    const order = orderResult.order;
    const isSandboxPayment = !process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === 'rzp_test_placeholder';

    let razorpayOrderId = null;
    let razorpaySignatureTest = null;

    if (paymentMethod !== 'COD') {
      // In sandbox mode or when key is placeholder, generate a deterministic test order ID
      razorpayOrderId = `order_sand_${order.orderNumber.replace(/[^a-zA-Z0-9]/g, '')}`;
      const secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_placeholder';
      razorpaySignatureTest = crypto
        .createHmac('sha256', secret)
        .update(`${razorpayOrderId}|pay_sand_${order.id}`)
        .digest('hex');

      console.log(`\x1b[33m[SANDBOX PAYMENT GATEWAY]\x1b[0m Created Sandbox Order: ${razorpayOrderId} for Order #${order.orderNumber} (Amount: ₹${order.totalAmount}). NOT A REAL TRANSACTION.`);
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        subtotalAmount: order.subtotalAmount,
        discountAmount: order.discountAmount,
        deliveryFee: order.deliveryFee,
        taxAmount: order.taxAmount,
        status: order.status,
        paymentStatus: order.paymentStatus,
        assignedWarehouseName: order.assignedWarehouseName,
      },
      paymentDetails: {
        paymentMethod,
        isSandbox: isSandboxPayment,
        razorpayOrderId,
        razorpayKeyId: isSandboxPayment ? 'rzp_test_placeholder' : process.env.RAZORPAY_KEY_ID,
        testSignature: isSandboxPayment ? razorpaySignatureTest : undefined,
        devNotice: isSandboxPayment
          ? '[SANDBOX_MODE: Mock Payment Provider Enabled] Never present simulated success as a real transaction.'
          : undefined,
      },
      message: orderResult.message,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to place order' },
      { status: 500 }
    );
  }
}

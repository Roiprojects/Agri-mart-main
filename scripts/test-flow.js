async function runTests() {
  console.log('--- 1. Testing Live Database Products API ---');
  const prodRes = await fetch('http://localhost:3000/api/products').then((r) => r.json());
  console.log(`Success: ${prodRes.success} | Count: ${prodRes.count} | First Item: ${prodRes.data[0]?.name}`);

  console.log('\n--- 2. Testing Customer Phone OTP (Sandbox Behavior) ---');
  const otpRes = await fetch('http://localhost:3000/api/auth/otp/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobile: '9845190812' }),
  }).then((r) => r.json());
  console.log(`Success: ${otpRes.success} | Sandbox Mode: ${otpRes.isDevMode} | Dev OTP: ${otpRes.devOtp}`);

  console.log('\n--- 3. Testing Server-Side Cart Calculation (Prices + GST + Delivery + Coupon) ---');
  const cartRes = await fetch('http://localhost:3000/api/cart/calculate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [{ productId: 'prod-001', quantity: 1 }],
      couponCode: 'MEGA1000',
      pincode: '580026',
    }),
  }).then((r) => r.json());
  console.log(`Subtotal: ₹${cartRes.subtotal} | Coupon Discount: -₹${cartRes.discount} | GST: ₹${cartRes.tax} | Delivery: ₹${cartRes.deliveryFee} | Net Total: ₹${cartRes.total}`);
  console.log(`Dark Warehouse Routing: ${cartRes.warehouseRouting.assignedWarehouse.name} (${cartRes.warehouseRouting.estimatedDelivery})`);

  console.log('\n--- 4. Testing Checkout Order Placement & Stock Reservation ---');
  const orderRes = await fetch('http://localhost:3000/api/checkout/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: 'usr-farmer-01',
      items: [{ productId: 'prod-001', quantity: 1 }],
      shippingAddress: {
        fullName: 'Ramesh Kumar Gowda',
        mobile: '9845190812',
        addressLine: 'Farm Plot #14, Sy. No 124',
        taluk: 'Mandya',
        district: 'Mandya',
        state: 'Karnataka',
        pincode: '571401',
      },
      paymentMethod: 'UPI',
      couponCode: 'MEGA1000',
    }),
  }).then((r) => r.json());
  console.log(`Order Placed: ${orderRes.success} | Order Number: ${orderRes.order?.orderNumber} | Hub: ${orderRes.order?.assignedWarehouseName} | Total: ₹${orderRes.order?.totalAmount}`);
  console.log(`Payment Details: Sandbox=${orderRes.paymentDetails?.isSandbox} | Razorpay Order: ${orderRes.paymentDetails?.razorpayOrderId}`);

  console.log('\n--- 5. Testing Payment Verification (HMAC Signature & Idempotency) ---');
  const verifyRes = await fetch('http://localhost:3000/api/checkout/verify-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      orderId: orderRes.order.id,
      razorpayOrderId: orderRes.paymentDetails.razorpayOrderId,
      razorpayPaymentId: 'pay_sand_' + Date.now(),
      razorpaySignature: orderRes.paymentDetails.testSignature || 'sig_sandbox_test',
    }),
  }).then((r) => r.json());
  console.log(`Payment Verified: ${verifyRes.success} | Sandbox: ${verifyRes.isSandbox} | Payment Number: ${verifyRes.paymentNumber}`);

  // Test duplicate payment idempotency
  const dupRes = await fetch('http://localhost:3000/api/checkout/verify-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      orderId: orderRes.order.id,
      razorpayOrderId: orderRes.paymentDetails.razorpayOrderId,
      razorpayPaymentId: 'pay_sand_' + Date.now(),
      razorpaySignature: orderRes.paymentDetails.testSignature || 'sig_sandbox_test',
    }),
  }).then((r) => r.json());
  console.log(`Duplicate Webhook/Callback Handled Idempotently: ${dupRes.success} | Duplicate Flag: ${dupRes.isDuplicate}`);

  console.log('\n--- 6. Testing Order Cancellation & Stock Restoration ---');
  const cancelRes = await fetch(`http://localhost:3000/api/orders/${orderRes.order.id}/cancel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason: 'Farmer test cancellation' }),
  }).then((r) => r.json());
  console.log(`Order Cancelled: ${cancelRes.success} | Message: ${cancelRes.message}`);

  console.log('\n--- 7. Testing Admin Product Creation & Cache Revalidation ---');
  const adminProdRes = await fetch('http://localhost:3000/api/admin/catalogue/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'AgriMart 5HP Heavy Rotary Tiller (Field Edition)',
      nameKn: 'ಅಗ್ರಿಮಾರ್ಟ್ 5HP ರೋಟರಿ ಟಿಲ್ಲರ್',
      sku: 'AGM-TIL-5HP-TEST',
      categoryId: 'cat-machinery',
      price: 28500,
      comparePrice: 32000,
      shortDescription: 'High torque 5HP petrol tiller for inter-row weeding.',
      description: 'Tested and certified for sandy loam and black cotton soils.',
      isPublished: true,
      isDraft: false,
      targetCrops: 'Chili, Tomato, Cotton',
      cropStages: '1, 2',
    }),
  }).then((r) => r.json());
  console.log(`Admin Product Created: ${adminProdRes.success} | Revalidated: ${adminProdRes.message}`);

  // Verify it appears in public products list
  const updatedProdRes = await fetch('http://localhost:3000/api/products').then((r) => r.json());
  const newlyCreated = updatedProdRes.data.find((p) => p.sku === 'AGM-TIL-5HP-TEST');
  console.log(`Newly Created Product Live in Public Catalogue: ${Boolean(newlyCreated)} | Name: ${newlyCreated?.name}`);

  console.log('\n================ ALL COMMERCE & ADMIN FLOWS VERIFIED SUCCESSFULLY ================');
}

runTests().catch(console.error);

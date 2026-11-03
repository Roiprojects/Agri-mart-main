'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Truck, MapPin, ShieldCheck, CheckCircle2, CreditCard, Smartphone, Banknote, Building2, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/lib/auth-client';
import { validatePhoneNumber, validateEmailOptional, validatePinCode } from '@/lib/validation';

const INDIAN_BANKS = [
  'State Bank of India (SBI)',
  'Canara Bank',
  'Karnataka Bank',
  'Karnataka Vikas Grameena Bank (KVGB)',
  'HDFC Bank',
  'ICICI Bank',
  'Axis Bank',
  'Union Bank of India',
  'Bank of Baroda',
  'Punjab National Bank (PNB)',
];

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [village, setVillage] = useState('');
  const [taluk, setTaluk] = useState('');
  const [district, setDistrict] = useState('');
  const [pincode, setPincode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'NETBANKING' | 'COD'>('UPI');
  const [upiId, setUpiId] = useState('farmer@upi');
  const [selectedBank, setSelectedBank] = useState(INDIAN_BANKS[0]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Sandbox payment modal state
  const [showSandboxModal, setShowSandboxModal] = useState(false);
  const [sandboxOrderData, setSandboxOrderData] = useState<any>(null);

  // Cart items from session or localStorage
  const [checkoutItems, setCheckoutItems] = useState<any[]>([
    { productId: 'prod-001', variantId: 'var-001-1', quantity: 1, name: 'AgriPro 7HP Heavy-Duty Multi-Speed Power Weeder', price: 36500 },
    { productId: 'prod-003', variantId: 'var-003-1', quantity: 2, name: 'Bhoomi Sanjivani Organic Micro-Nutrient Bio-Fertilizer (5 Kg)', price: 850 },
  ]);
  const [couponCode, setCouponCode] = useState('MEGA1000');

  useEffect(() => {
    if (isLoggedIn && user) {
      if (user.name && !name) setName(user.name);
      if (user.phone && !mobile) setMobile(user.phone);
    }
  }, [isLoggedIn, user]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedSession = sessionStorage.getItem('agri_checkout_items');
      const storedCart = localStorage.getItem('agri_cart_items');
      const storedCoupon = sessionStorage.getItem('agri_checkout_coupon');
      const raw = storedSession || storedCart;
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCheckoutItems(parsed.map((p: any) => ({
              productId: p.id || p.productId,
              variantId: p.variantId,
              quantity: p.quantity || 1,
              name: p.name,
              price: p.price,
            })));
          }
        } catch (e) {}
      }
      if (storedCoupon !== null) setCouponCode(storedCoupon);
    }
  }, []);

  const clearCartAfterOrder = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('agri_cart_items');
      sessionStorage.removeItem('agri_checkout_items');
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const phoneValidation = validatePhoneNumber(mobile);
    if (!phoneValidation.valid) {
      setErrorMessage(phoneValidation.error || 'Please enter a valid 10-digit mobile number.');
      return;
    }

    const emailValidation = validateEmailOptional(email);
    if (!emailValidation.valid) {
      setErrorMessage(emailValidation.error || 'Please enter a valid email address.');
      return;
    }

    const pinValidation = validatePinCode(pincode);
    if (!pinValidation.valid) {
      setErrorMessage(pinValidation.error || 'Please enter a valid 6-digit PIN code.');
      return;
    }

    const cleanMobile = phoneValidation.cleaned!;
    const cleanPin = pinValidation.cleaned!;

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || `usr-customer-${cleanMobile}`,
          items: checkoutItems,
          shippingAddress: {
            fullName: name.trim(),
            mobile: cleanMobile,
            email: emailValidation.cleaned || undefined,
            addressLine: address.trim(),
            village: village.trim(),
            taluk: taluk.trim(),
            district: district.trim() || 'Karnataka',
            state: 'Karnataka',
            pincode: cleanPin,
          },
          paymentMethod,
          couponCode,
          notes,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setErrorMessage(data.message || 'Could not complete order');
        setIsSubmitting(false);
        return;
      }

      // Show Payment Confirmation Modal with UPI Pay, NetBanking, and Cash on Delivery options
      setSandboxOrderData(data);
      setShowSandboxModal(true);
      setIsSubmitting(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error placing order');
      setIsSubmitting(false);
    }
  };

  const handleSimulatePaymentSuccess = async () => {
    if (!sandboxOrderData) return;
    setIsSubmitting(true);

    if (paymentMethod === 'COD') {
      clearCartAfterOrder();
      router.push(
        `/order-success?id=${sandboxOrderData.order.orderNumber}&wh=${encodeURIComponent(sandboxOrderData.order.assignedWarehouseName)}`
      );
      return;
    }

    try {
      const verifyRes = await fetch('/api/checkout/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: sandboxOrderData.order.id,
          razorpayOrderId: sandboxOrderData.paymentDetails.razorpayOrderId,
          razorpayPaymentId: `pay_sand_${Date.now()}`,
          razorpaySignature: sandboxOrderData.paymentDetails.testSignature || 'sig_sandbox_verified_test',
        }),
      });

      const verifyData = await verifyRes.json();
      if (verifyData.success) {
        clearCartAfterOrder();
        router.push(
          `/order-success?id=${sandboxOrderData.order.orderNumber}&wh=${encodeURIComponent(sandboxOrderData.order.assignedWarehouseName)}`
        );
      } else {
        alert(verifyData.message || 'Verification failed');
        setIsSubmitting(false);
      }
    } catch (err: any) {
      alert('Payment processing error: ' + err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-xs">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Secure Checkout &amp; Dark Warehouse Routing</h1>
        <p className="text-xs text-slate-500 mt-1">Delivery address validation, automatic dark warehouse inventory assignment, and payment.</p>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Address & Payment */}
        <div className="lg:col-span-8 space-y-6">
          {/* Address Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <MapPin className="w-4 h-4 text-agri-green" />
              1. Delivery &amp; Farm Destination Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Farmer Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:ring-1 focus:ring-agri-green"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mobile Number (10 Digits, Non-Repeating) *</label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="10-digit mobile number"
                  className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:ring-1 focus:ring-agri-green"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Email Address (Optional — validated if entered)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Optional: e.g. farmer@example.com"
                  className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:ring-1 focus:ring-agri-green"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Farm Plot / Street / Landmark *</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Sy. No 14, Main Road, Near Gram Panchayat"
                  className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:ring-1 focus:ring-agri-green"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Village / Town *</label>
                <input
                  type="text"
                  required
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="e.g. Byadgi"
                  className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:ring-1 focus:ring-agri-green"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Taluk *</label>
                <input
                  type="text"
                  required
                  value={taluk}
                  onChange={(e) => setTaluk(e.target.value)}
                  placeholder="e.g. Byadgi"
                  className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:ring-1 focus:ring-agri-green"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">District (Karnataka) *</label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="e.g. Haveri"
                  className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:ring-1 focus:ring-agri-green"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">PIN Code (6 Digits) *</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="6-digit PIN code (e.g. 581106)"
                  className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:ring-1 focus:ring-agri-green"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Delivery Notes (Optional)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Please call before delivery, tractor path via north canal"
                  className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:ring-1 focus:ring-agri-green"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <CreditCard className="w-4 h-4 text-agri-green" />
              2. Payment Method (UPI Pay &bull; NetBanking &bull; Cash on Delivery)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label
                onClick={() => setPaymentMethod('UPI')}
                className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col items-center justify-center text-center space-y-2 ${
                  paymentMethod === 'UPI' ? 'border-agri-green bg-emerald-50 text-agri-green-dark font-extrabold shadow-2xs ring-2 ring-emerald-500/20' : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Smartphone className="w-5 h-5 text-agri-green" />
                <span className="text-xs font-bold">UPI Pay</span>
                <span className="text-[10px] text-slate-500 font-normal">GPay, PhonePe, Paytm, BHIM</span>
              </label>

              <label
                onClick={() => setPaymentMethod('NETBANKING')}
                className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col items-center justify-center text-center space-y-2 ${
                  paymentMethod === 'NETBANKING' ? 'border-agri-green bg-emerald-50 text-agri-green-dark font-extrabold shadow-2xs ring-2 ring-emerald-500/20' : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Building2 className="w-5 h-5 text-agri-green" />
                <span className="text-xs font-bold">NetBanking</span>
                <span className="text-[10px] text-slate-500 font-normal">SBI, Canara, Karnataka Bank &amp; All Banks</span>
              </label>

              <label
                onClick={() => setPaymentMethod('COD')}
                className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col items-center justify-center text-center space-y-2 ${
                  paymentMethod === 'COD' ? 'border-agri-green bg-emerald-50 text-agri-green-dark font-extrabold shadow-2xs ring-2 ring-emerald-500/20' : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Banknote className="w-5 h-5 text-agri-green" />
                <span className="text-xs font-bold">Cash on Delivery</span>
                <span className="text-[10px] text-slate-500 font-normal">Pay cash upon farm delivery</span>
              </label>
            </div>

            {/* Contextual Payment Details */}
            {paymentMethod === 'UPI' && (
              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-2">
                <label className="block font-bold text-emerald-950 text-xs">Enter UPI ID / VPA (or pay via QR in next step)</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. farmer@okaxis, 9845012345@ybl"
                  className="w-full p-2.5 bg-white border border-emerald-300 rounded-xl outline-none focus:ring-1 focus:ring-agri-green text-xs"
                />
                <div className="text-[11px] text-emerald-800">
                  Supports Google Pay, PhonePe, Paytm, BHIM &amp; Kisan UPI apps with zero transaction charges.
                </div>
              </div>
            )}

            {paymentMethod === 'NETBANKING' && (
              <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-2xl space-y-2">
                <label className="block font-bold text-slate-900 text-xs">Select Your Bank for NetBanking</label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full p-2.5 bg-white border border-blue-300 rounded-xl outline-none focus:ring-1 focus:ring-blue-600 text-xs font-semibold"
                >
                  {INDIAN_BANKS.map((bank) => (
                    <option key={bank} value={bank}>{bank}</option>
                  ))}
                </select>
                <div className="text-[11px] text-slate-600">
                  Instant online banking verification across all nationalized, private &amp; regional Gramin banks.
                </div>
              </div>
            )}

            {paymentMethod === 'COD' && (
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-amber-950">
                <Banknote className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <strong>Cash on Delivery (COD) Selected:</strong> Pay in cash or via field QR directly to the delivery agent when your agricultural order arrives at your farm gate.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Review & Submission */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-3">
              Fulfillment Summary
            </h3>

            {/* Itemized Cart Breakdown */}
            <div className="space-y-2 border-b border-slate-100 pb-3 max-h-52 overflow-y-auto">
              {checkoutItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start gap-2 text-[11px]">
                  <div className="text-slate-700 font-semibold line-clamp-1 flex-1">
                    {item.name || `Item #${idx + 1}`} <span className="text-slate-400 font-normal">&times; {item.quantity}</span>
                  </div>
                  <div className="font-bold text-slate-900 shrink-0">
                    ₹{((item.price || 500) * (item.quantity || 1)).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>

            {(() => {
              const calcSubtotal = checkoutItems.reduce((sum, i) => sum + (i.price || 500) * (i.quantity || 1), 0);
              const calcDiscount = couponCode && calcSubtotal >= 2000 ? Math.min(1000, Math.round(calcSubtotal * 0.1)) : 0;
              const calcTax = Math.round(calcSubtotal * 0.05);
              const calcFreight = calcSubtotal >= 10000 ? 0 : 250;
              const calcTotal = Math.max(0, calcSubtotal - calcDiscount + calcTax + calcFreight);
              return (
                <div className="space-y-2 text-slate-600">
                  <div className="flex justify-between">
                    <span>Items in Cart:</span>
                    <span className="font-bold text-slate-900">{checkoutItems.reduce((s, i) => s + (i.quantity || 1), 0)} unit(s)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-bold text-slate-900">₹{calcSubtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {calcDiscount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Coupon ({couponCode}):</span>
                      <span>- ₹{calcDiscount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Agri GST (5%):</span>
                    <span className="font-semibold text-slate-900">₹{calcTax.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Routing Hub:</span>
                    <span className="font-bold text-slate-900">Nearest Regional Dark Hub</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Freight:</span>
                    <span className="font-bold text-emerald-700">{calcFreight === 0 ? 'FREE Express' : `₹${calcFreight}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Mode:</span>
                    <span className="font-bold text-emerald-800">
                      {paymentMethod === 'UPI' ? 'UPI Pay' : paymentMethod === 'NETBANKING' ? 'NetBanking' : 'Cash on Delivery'}
                    </span>
                  </div>
                  <div className="border-t border-slate-200 pt-2.5 flex justify-between items-center text-sm font-black text-slate-950">
                    <span>Estimated Total:</span>
                    <span className="text-base text-agri-green-dark">₹{calcTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              );
            })()}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-agri-green hover:bg-agri-green-dark text-white font-extrabold py-3.5 rounded-2xl transition flex items-center justify-center gap-2 shadow-xs"
            >
              {isSubmitting ? 'Reserving Stock & Processing...' : 'Place Farm Order & Proceed to Payment'}
            </button>

            <div className="pt-2 text-[10px] text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% Guaranteed Stock Reservation
              </div>
              <p>Supports UPI Pay, NetBanking &amp; Cash on Delivery.</p>
            </div>
          </div>
        </div>
      </form>

      {/* Sandbox Payment Modal with UPI Pay, NetBanking & Cash on Delivery */}
      {showSandboxModal && sandboxOrderData && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-2xl animate-scaleIn">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <span className="bg-emerald-100 text-emerald-900 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Shop Order Payment Gateway
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">Complete Your Payment</h3>
              </div>
              <button
                onClick={() => setShowSandboxModal(false)}
                className="text-slate-400 hover:text-slate-600 text-base font-bold"
              >
                &times;
              </button>
            </div>

            {/* Interactive Payment Mode Switcher inside Modal */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-700 block">Select Payment Option:</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                    paymentMethod === 'UPI'
                      ? 'border-agri-green bg-emerald-50 text-agri-green-dark font-extrabold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-agri-green" />
                  <span className="text-[11px]">UPI Pay</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('NETBANKING')}
                  className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                    paymentMethod === 'NETBANKING'
                      ? 'border-agri-green bg-emerald-50 text-agri-green-dark font-extrabold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-agri-green" />
                  <span className="text-[11px]">NetBanking</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                    paymentMethod === 'COD'
                      ? 'border-agri-green bg-emerald-50 text-agri-green-dark font-extrabold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Banknote className="w-4 h-4 text-agri-green" />
                  <span className="text-[11px]">Cash on Delivery</span>
                </button>
              </div>
            </div>

            {paymentMethod === 'UPI' && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-[11px]">
                <div className="font-bold text-emerald-950">UPI Pay (GPay / PhonePe / Paytm / BHIM)</div>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="Enter UPI ID (e.g. farmer@upi)"
                  className="w-full p-2 bg-white border border-emerald-300 rounded-lg text-xs"
                />
              </div>
            )}

            {paymentMethod === 'NETBANKING' && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-2 text-[11px]">
                <div className="font-bold text-slate-900">NetBanking Bank Selection</div>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full p-2 bg-white border border-blue-300 rounded-lg text-xs font-semibold"
                >
                  {INDIAN_BANKS.map((bank) => (
                    <option key={bank} value={bank}>{bank}</option>
                  ))}
                </select>
              </div>
            )}

            {paymentMethod === 'COD' && (
              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl space-y-1 text-[11px]">
                <div className="font-bold flex items-center gap-1">
                  <Banknote className="w-3.5 h-3.5 text-amber-700" />
                  Cash on Delivery (Pay at Farm Gate)
                </div>
                <p>Pay ₹{sandboxOrderData.order.totalAmount.toLocaleString('en-IN')} in cash upon receiving your products.</p>
              </div>
            )}

            <div className="space-y-2 bg-slate-50 p-4 rounded-2xl text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">Order Reference:</span>
                <span className="font-mono font-bold text-slate-900">{sandboxOrderData.order.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Selected Payment:</span>
                <span className="font-bold text-emerald-800">
                  {paymentMethod === 'UPI' ? `UPI Pay (${upiId || 'Instant QR'})` : paymentMethod === 'NETBANKING' ? `NetBanking (${selectedBank})` : 'Cash on Delivery (COD)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Payable:</span>
                <span className="font-extrabold text-sm text-slate-900">
                  ₹{sandboxOrderData.order.totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleSimulatePaymentSuccess}
                disabled={isSubmitting}
                className="w-full bg-agri-green hover:bg-agri-green-dark text-white font-extrabold py-3 rounded-xl transition shadow-xs flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                {isSubmitting
                  ? 'Processing Order...'
                  : paymentMethod === 'COD'
                  ? `Confirm Cash on Delivery Order (₹${sandboxOrderData.order.totalAmount.toLocaleString('en-IN')})`
                  : `Pay ₹${sandboxOrderData.order.totalAmount.toLocaleString('en-IN')} via ${paymentMethod === 'UPI' ? 'UPI Pay' : 'NetBanking'}`}
              </button>

              <button
                onClick={() => setShowSandboxModal(false)}
                className="w-full py-2 text-slate-500 hover:text-slate-800 font-semibold text-center"
              >
                Cancel / Modify Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

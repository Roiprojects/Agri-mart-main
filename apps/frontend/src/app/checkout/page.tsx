'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Truck, MapPin, ShieldCheck, CheckCircle2, CreditCard, Smartphone, Banknote, AlertTriangle } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [village, setVillage] = useState('');
  const [taluk, setTaluk] = useState('');
  const [district, setDistrict] = useState('Dharwad');
  const [pincode, setPincode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'COD'>('UPI');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Sandbox payment modal state
  const [showSandboxModal, setShowSandboxModal] = useState(false);
  const [sandboxOrderData, setSandboxOrderData] = useState<any>(null);

  // Cart items from session or default
  const [checkoutItems, setCheckoutItems] = useState([
    { productId: 'prod-001', variantId: 'var-001-1', quantity: 1 },
    { productId: 'prod-003', variantId: 'var-003-1', quantity: 2 },
  ]);
  const [couponCode, setCouponCode] = useState('MEGA1000');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('agri_checkout_items');
      const storedCoupon = sessionStorage.getItem('agri_checkout_coupon');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCheckoutItems(parsed.map((p: any) => ({
              productId: p.id,
              variantId: p.variantId,
              quantity: p.quantity,
            })));
          }
        } catch (e) {}
      }
      if (storedCoupon) setCouponCode(storedCoupon);
    }
  }, []);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'usr-farmer-01',
          items: checkoutItems,
          shippingAddress: {
            fullName: name,
            mobile,
            addressLine: address,
            village,
            taluk,
            district,
            state: 'Karnataka',
            pincode,
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

      if (paymentMethod === 'COD') {
        // COD order placed directly
        router.push(`/order-success?id=${data.order.orderNumber}&wh=${encodeURIComponent(data.order.assignedWarehouseName)}`);
      } else {
        // Show Sandbox Payment Sheet
        setSandboxOrderData(data);
        setShowSandboxModal(true);
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error placing order');
      setIsSubmitting(false);
    }
  };

  const handleSimulatePaymentSuccess = async () => {
    if (!sandboxOrderData) return;
    setIsSubmitting(true);

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
                  placeholder="e.g. Basavaraj Patil"
                  className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:ring-1 focus:ring-agri-green"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mobile Number (For Dispatch SMS &amp; OTP) *</label>
                <input
                  type="text"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="10-digit mobile number"
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
                <label className="block font-semibold text-slate-700 mb-1">PIN Code (Maps to Nearest Dark Hub) *</label>
                <input
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="e.g. 581106"
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
              2. Payment Method
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label
                onClick={() => setPaymentMethod('UPI')}
                className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col items-center justify-center text-center space-y-2 ${
                  paymentMethod === 'UPI' ? 'border-agri-green bg-emerald-50 text-agri-green-dark font-extrabold shadow-2xs' : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Smartphone className="w-5 h-5 text-agri-green" />
                <span className="text-xs">UPI / QR Code</span>
                <span className="text-[10px] text-slate-500 font-normal">GPay, PhonePe, Paytm</span>
              </label>

              <label
                onClick={() => setPaymentMethod('CARD')}
                className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col items-center justify-center text-center space-y-2 ${
                  paymentMethod === 'CARD' ? 'border-agri-green bg-emerald-50 text-agri-green-dark font-extrabold shadow-2xs' : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <CreditCard className="w-5 h-5 text-agri-green" />
                <span className="text-xs">Card / NetBanking</span>
                <span className="text-[10px] text-slate-500 font-normal">Debit &amp; Kisan Credit Card</span>
              </label>

              <label
                onClick={() => setPaymentMethod('COD')}
                className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col items-center justify-center text-center space-y-2 ${
                  paymentMethod === 'COD' ? 'border-agri-green bg-emerald-50 text-agri-green-dark font-extrabold shadow-2xs' : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Banknote className="w-5 h-5 text-agri-green" />
                <span className="text-xs">Cash on Delivery</span>
                <span className="text-[10px] text-slate-500 font-normal">Pay upon farm receipt</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Review & Submission */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-3">
              Fulfillment Summary
            </h3>

            <div className="space-y-2 text-slate-600">
              <div className="flex justify-between">
                <span>Items in Cart:</span>
                <span className="font-bold text-slate-900">{checkoutItems.length} items</span>
              </div>
              <div className="flex justify-between">
                <span>Coupon Applied:</span>
                <span className="font-bold text-emerald-700">{couponCode || 'None'}</span>
              </div>
              <div className="flex justify-between">
                <span>Routing Hub:</span>
                <span className="font-bold text-slate-900">Hubballi Dark Hub</span>
              </div>
              <div className="flex justify-between">
                <span>Freight:</span>
                <span className="font-bold text-emerald-700">FREE Express</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-agri-green hover:bg-agri-green-dark text-white font-extrabold py-3.5 rounded-2xl transition flex items-center justify-center gap-2 shadow-xs"
            >
              {isSubmitting ? 'Reserving Stock & Processing...' : 'Place Farm Order & Reserve Stock'}
            </button>

            <div className="pt-2 text-[10px] text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% Guaranteed Stock Reservation
              </div>
              <p>Transactions in development environment are routed via verified Sandbox Gateways.</p>
            </div>
          </div>
        </div>
      </form>

      {/* Sandbox Payment Modal */}
      {showSandboxModal && sandboxOrderData && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-2xl animate-scaleIn">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <span className="bg-amber-100 text-amber-900 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Sandbox Active
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">Razorpay Payment Sandbox</h3>
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl space-y-1 text-[11px]">
              <div className="font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                Development Behavior Notice:
              </div>
              <p>
                {sandboxOrderData.paymentDetails.devNotice || 'Simulated sandbox transaction. No actual bank charge will occur.'}
              </p>
            </div>

            <div className="space-y-2 bg-slate-50 p-4 rounded-2xl text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">Order Reference:</span>
                <span className="font-mono font-bold text-slate-900">{sandboxOrderData.order.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Razorpay Order ID:</span>
                <span className="font-mono text-slate-700">{sandboxOrderData.paymentDetails.razorpayOrderId}</span>
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
                {isSubmitting ? 'Verifying HMAC Signature...' : 'Authorize Sandbox Payment (Test Success)'}
              </button>

              <button
                onClick={() => setShowSandboxModal(false)}
                className="w-full py-2 text-slate-500 hover:text-slate-800 font-semibold text-center"
              >
                Cancel / Choose Another Method
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

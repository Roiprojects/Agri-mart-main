'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar as CalendarIcon,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  Sparkles,
  CreditCard,
  Truck,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface RentalMachineData {
  id: string;
  slug: string;
  title: string;
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
  securityDeposit: number;
  totalUnits: number;
  powerRating?: string;
}

interface RentalBookingCalendarProps {
  machine: RentalMachineData;
}

export default function RentalBookingCalendar({ machine }: RentalBookingCalendarProps) {
  const [startDate, setStartDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    const end = new Date();
    end.setDate(end.getDate() + 4);
    return end.toISOString().split('T')[0];
  });

  const [customerName, setCustomerName] = useState('Ramesh Kumar Gowda');
  const [customerMobile, setCustomerMobile] = useState('9845190812');
  const [deliveryAddress, setDeliveryAddress] = useState('Farm Plot #14, Sy. No 124, Maddur Road, Mandya');
  const [pincode, setPincode] = useState('571401');

  // Availability State
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availabilityData, setAvailabilityData] = useState<{
    isAvailable: boolean;
    remainingUnits: number;
    totalUnits: number;
    activeBookingsCount: number;
  } | null>(null);

  // Booking Execution State
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<any | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Calculate Duration in Days
  const startMs = new Date(startDate).getTime();
  const endMs = new Date(endDate).getTime();
  const totalDays = isNaN(startMs) || isNaN(endMs) || endMs < startMs
    ? 1
    : Math.max(1, Math.round((endMs - startMs) / (1000 * 3600 * 24)) + 1);

  // Tiered Pricing Calculation
  let pricingTier: 'DAILY' | 'WEEKLY' | 'MONTHLY' = 'DAILY';
  let tierLabel = 'Standard Daily Rate';
  let rentAmount = machine.dailyRate * totalDays;

  if (totalDays >= 30) {
    pricingTier = 'MONTHLY';
    tierLabel = 'Monthly Super-Saver Slab (40% OFF Standard)';
    rentAmount = Math.round(machine.monthlyRate * (totalDays / 30));
  } else if (totalDays >= 7) {
    pricingTier = 'WEEKLY';
    tierLabel = 'Weekly Discounted Slab (15% OFF Standard)';
    rentAmount = Math.round(machine.weeklyRate * (totalDays / 7));
  }

  const securityDeposit = machine.securityDeposit;
  const totalUpfront = rentAmount + securityDeposit;

  // Check Availability when Dates Change
  useEffect(() => {
    if (!startDate || !endDate) return;
    setCheckingAvailability(true);
    setBookingError(null);

    fetch(`/api/rentals/availability?productId=${machine.id}&startDate=${startDate}&endDate=${endDate}`)
      .then((res) => res.json())
      .then((data) => {
        setCheckingAvailability(false);
        if (data.success) {
          setAvailabilityData({
            isAvailable: data.data.isAvailable,
            remainingUnits: data.data.remainingUnits,
            totalUnits: data.data.totalUnits,
            activeBookingsCount: data.data.activeBookingsCount,
          });
        }
      })
      .catch((err) => {
        setCheckingAvailability(false);
        console.error(err);
      });
  }, [machine.id, startDate, endDate]);

  const handleOpenPaymentModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!availabilityData?.isAvailable) {
      setBookingError('Selected dates conflict with current equipment capacity. Please adjust dates.');
      return;
    }
    setBookingError(null);
    setShowPaymentModal(true);
  };

  const handleConfirmBooking = async () => {
    setSubmitting(true);
    setBookingError(null);

    try {
      const response = await fetch('/api/rentals/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rentalProductId: machine.id,
          startDate,
          endDate,
          customerName,
          customerMobile,
          deliveryAddress,
          pincode,
          paymentMethod: 'ONLINE_UPI',
        }),
      });

      const result = await response.json();
      setSubmitting(false);

      if (!response.ok || !result.success) {
        setShowPaymentModal(false);
        setBookingError(result.error || 'Failed to complete booking.');
        return;
      }

      setShowPaymentModal(false);
      setBookingSuccess(result.data);
    } catch (err: any) {
      setSubmitting(false);
      setShowPaymentModal(false);
      setBookingError(err.message || 'An unexpected network error occurred.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-emerald-700" />
            <span>Book Equipment &amp; Schedule Delivery</span>
          </span>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            ₹{machine.dailyRate}/day
          </span>
        </h3>

        {/* Success State */}
        {bookingSuccess ? (
          <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3 text-emerald-950 animate-fadeIn">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <div className="font-extrabold text-base text-slate-900">
                  Rental Booking Confirmed &amp; Dispatched!
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  Booking Reference: <strong className="font-mono text-slate-900 bg-white px-2 py-0.5 rounded border">{bookingSuccess.bookingNumber}</strong>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-white/80 rounded-xl border border-emerald-200 text-xs space-y-1.5 text-slate-700">
              <div className="flex justify-between">
                <span>Equipment:</span>
                <span className="font-bold text-slate-900">{bookingSuccess.productTitle}</span>
              </div>
              <div className="flex justify-between">
                <span>Rental Period:</span>
                <span className="font-semibold text-slate-900">{bookingSuccess.startDate} to {bookingSuccess.endDate} ({bookingSuccess.totalDays} Days)</span>
              </div>
              <div className="flex justify-between">
                <span>Rent Amount Paid:</span>
                <span className="font-bold text-emerald-700">₹{bookingSuccess.rentAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Refundable Deposit Held:</span>
                <span className="font-bold text-emerald-700">₹{bookingSuccess.securityDeposit.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="text-[11px] text-emerald-800 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Assigned Dark Warehouse (Hubballi Central) is preparing machine inspection and dispatch kit.</span>
            </div>

            <div className="pt-2 flex flex-wrap gap-2">
              <Link
                href="/account/rentals"
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition"
              >
                Track in Account Dashboard &rarr;
              </Link>
              <button
                onClick={() => setBookingSuccess(null)}
                className="bg-white text-slate-700 font-semibold text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 transition"
              >
                Book Another Machine
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleOpenPaymentModal} className="space-y-4 text-xs">
            {/* Error Banner */}
            {bookingError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-900 animate-shake">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Booking Conflict</strong>
                  <span className="text-[11px] leading-relaxed">{bookingError}</span>
                </div>
              </div>
            )}

            {/* Capacity Status Badge */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-slate-500 font-medium">Regional Fleet Capacity:</span>
                <div className="font-extrabold text-slate-900 text-sm">
                  {machine.totalUnits} Units in Karnataka Network
                </div>
              </div>
              <div className="text-right">
                {checkingAvailability ? (
                  <span className="text-xs text-slate-500">Checking availability...</span>
                ) : availabilityData?.isAvailable ? (
                  <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {availabilityData.remainingUnits} Unit(s) Available
                  </span>
                ) : (
                  <span className="bg-rose-100 text-rose-800 font-bold px-2.5 py-1 rounded-full text-[11px] flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Fully Booked
                  </span>
                )}
              </div>
            </div>

            {/* Date Pickers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Start Date (Pickup / Delivery) *</label>
                <Input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">End Date (Return Date) *</label>
                <Input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            {/* Customer Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Customer Full Name *</label>
                <Input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Contact Mobile Number *</label>
                <Input
                  type="tel"
                  required
                  value={customerMobile}
                  onChange={(e) => setCustomerMobile(e.target.value)}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Farm Delivery Address (with Taluk/Hobli) *</label>
                <Input
                  type="text"
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">PIN Code *</label>
                <Input
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                />
              </div>
            </div>

            {/* Pricing Summary Card */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
              <div className="flex justify-between items-center text-slate-600">
                <span>Duration:</span>
                <span className="font-bold text-slate-900">{totalDays} Day(s)</span>
              </div>

              <div className="flex justify-between items-center text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                <span>Applied Tier:</span>
                <span className="font-bold">{tierLabel}</span>
              </div>

              <div className="flex justify-between items-center text-slate-600">
                <span>Net Rental Fee:</span>
                <span className="font-extrabold text-slate-900 text-sm">₹{rentAmount.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between items-center text-emerald-800">
                <span className="flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" /> Refundable Security Deposit:
                </span>
                <span className="font-bold">₹{securityDeposit.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-sm font-black text-slate-900">
                <span>Total Amount Payable:</span>
                <span className="text-emerald-800 text-base">₹{totalUpfront.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3.5 text-sm font-bold shadow-md"
              disabled={Boolean(checkingAvailability || (availabilityData && !availabilityData.isAvailable))}
            >
              {checkingAvailability
                ? 'Validating Fleet Capacity...'
                : availabilityData?.isAvailable
                ? `Proceed to Rent (Pay ₹${totalUpfront.toLocaleString('en-IN')})`
                : 'Fully Reserved &mdash; Choose Alternative Dates'}
            </Button>
          </form>
        )}
      </div>

      {/* Security Deposit & Return Policy Transparency Card */}
      <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 text-xs text-emerald-950 space-y-2">
        <div className="font-bold flex items-center gap-1.5 text-slate-900">
          <ShieldCheck className="w-4 h-4 text-emerald-700" /> Transparent Security Deposit &amp; Return Terms
        </div>
        <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside">
          <li><strong>On-Time Return:</strong> 100% of the ₹{machine.securityDeposit.toLocaleString('en-IN')} deposit is refunded within 24 hours of inspection.</li>
          <li><strong>Late Return Policy:</strong> Returned after end date incurs a fee of 1.5&times; the daily rate (₹{Math.round(machine.dailyRate * 1.5)}/day) deducted from deposit.</li>
          <li><strong>Damage Inspection:</strong> Minor soil wear is covered. Broken components or motor seizure due to dry oil operation are assessed and deducted at actual spare part cost.</li>
        </ul>
      </div>

      {/* Sandbox Payment Confirmation Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-100 text-xs animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Confirm Rental &amp; Pay</h4>
                  <span className="text-[10px] text-amber-700 font-semibold uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    [SANDBOX ENVIRONMENT]
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-slate-400 hover:text-slate-600 text-base font-bold"
              >
                &times;
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl space-y-2 text-slate-700">
              <div className="flex justify-between">
                <span>Equipment:</span>
                <span className="font-bold text-slate-900">{machine.title}</span>
              </div>
              <div className="flex justify-between">
                <span>Rental Period:</span>
                <span className="font-semibold text-slate-900">{startDate} &rarr; {endDate} ({totalDays} Days)</span>
              </div>
              <div className="flex justify-between">
                <span>Rental Charge:</span>
                <span className="font-bold text-slate-900">₹{rentAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-emerald-800 font-semibold">
                <span>Refundable Deposit:</span>
                <span>₹{securityDeposit.toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-slate-900 text-sm">
                <span>Total Amount:</span>
                <span className="text-emerald-800">₹{totalUpfront.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
              <strong>Simulated Sandbox Payment:</strong> No real bank funds will be debited. This simulates Razorpay UPI instant authorization and logs the transaction signature.
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleConfirmBooking}
                className="flex-1 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-md transition disabled:opacity-50"
              >
                {submitting ? 'Authorizing...' : 'Authorize Payment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

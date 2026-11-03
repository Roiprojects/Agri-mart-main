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
  Smartphone,
  Building2,
  Banknote,
  Truck,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
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
];

interface RentalMachineData {
  id: string;
  slug: string;
  title: string;
  hourlyRate?: number;
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
  const { user, isLoggedIn } = useAuth();
  const [rentalBasis, setRentalBasis] = useState<'HOURLY' | 'DAILY'>('HOURLY');
  const [totalHours, setTotalHours] = useState<number>(3);
  const [preferredTimeSlot, setPreferredTimeSlot] = useState('08:00 AM - 11:00 AM');
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

  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'NETBANKING' | 'COD'>('UPI');
  const [upiId, setUpiId] = useState('farmer@upi');
  const [selectedBank, setSelectedBank] = useState(INDIAN_BANKS[0]);

  useEffect(() => {
    if (isLoggedIn && user) {
      if (user.name && !customerName) setCustomerName(user.name);
      if (user.phone && !customerMobile) setCustomerMobile(user.phone);
    }
  }, [isLoggedIn, user]);

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

  // Hourly & Daily Rate Calculations
  const hourlyRate = machine.hourlyRate || Math.max(50, Math.round(machine.dailyRate / 6));
  const effectiveEndDate = rentalBasis === 'HOURLY' ? startDate : endDate;

  // Calculate Duration in Days
  const startMs = new Date(startDate).getTime();
  const endMs = new Date(effectiveEndDate).getTime();
  const totalDays = isNaN(startMs) || isNaN(endMs) || endMs < startMs
    ? 1
    : Math.max(1, Math.round((endMs - startMs) / (1000 * 3600 * 24)) + 1);

  // Tiered Pricing Calculation
  let pricingTier: 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY' = 'DAILY';
  let tierLabel = 'Standard Daily Rate';
  let rentAmount = machine.dailyRate * totalDays;

  if (rentalBasis === 'HOURLY') {
    pricingTier = 'HOURLY';
    tierLabel = `Hourly Rental Slab (₹${hourlyRate}/hour × ${totalHours} hr${totalHours > 1 ? 's' : ''})`;
    rentAmount = hourlyRate * totalHours;
  } else if (totalDays >= 30) {
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
    if (!startDate || !effectiveEndDate) return;
    setCheckingAvailability(true);
    setBookingError(null);

    fetch(`/api/rentals/availability?productId=${machine.id}&startDate=${startDate}&endDate=${effectiveEndDate}`)
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
  }, [machine.id, startDate, effectiveEndDate]);

  const handleOpenPaymentModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!availabilityData?.isAvailable) {
      setBookingError('Selected dates conflict with current equipment capacity. Please adjust dates.');
      return;
    }
    if (rentalBasis === 'DAILY' && new Date(endDate).getTime() < new Date(startDate).getTime()) {
      setBookingError('End date cannot be earlier than start date.');
      return;
    }
    if (rentalBasis === 'HOURLY' && (totalHours < 1 || totalHours > 24)) {
      setBookingError('Please select between 1 and 24 hours for hourly equipment rental.');
      return;
    }
    if (customerName.trim().length < 2) {
      setBookingError('Please enter your full name.');
      return;
    }
    const phoneValidation = validatePhoneNumber(customerMobile);
    if (!phoneValidation.valid) {
      setBookingError(phoneValidation.error || 'Please enter a valid 10-digit mobile number.');
      return;
    }
    const emailValidation = validateEmailOptional(customerEmail);
    if (!emailValidation.valid) {
      setBookingError(emailValidation.error || 'Please enter a valid email address.');
      return;
    }
    if (deliveryAddress.trim().length < 5) {
      setBookingError('Please enter a complete farm delivery address.');
      return;
    }
    const pinValidation = validatePinCode(pincode);
    if (!pinValidation.valid) {
      setBookingError(pinValidation.error || 'Please enter a valid 6-digit PIN code.');
      return;
    }
    setBookingError(null);
    setShowPaymentModal(true);
  };

  const handleConfirmBooking = async () => {
    setSubmitting(true);
    setBookingError(null);
    const cleanMobile = customerMobile.replace(/[^0-9]/g, '').slice(0, 10);
    const cleanPin = pincode.replace(/[^0-9]/g, '').slice(0, 6);

    try {
      const response = await fetch('/api/rentals/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rentalProductId: machine.id,
          rentalBasis,
          totalHours: rentalBasis === 'HOURLY' ? totalHours : undefined,
          preferredTimeSlot: rentalBasis === 'HOURLY' ? preferredTimeSlot : undefined,
          startDate,
          endDate: effectiveEndDate,
          userId: user?.id || `usr-customer-${cleanMobile}`,
          customerName: customerName.trim(),
          customerMobile: cleanMobile,
          customerEmail: customerEmail.trim() || undefined,
          deliveryAddress: deliveryAddress.trim(),
          pincode: cleanPin,
          paymentMethod,
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
            ₹{hourlyRate}/hr &bull; ₹{machine.dailyRate}/day
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
                <span>Rental Basis:</span>
                <span className="font-bold text-emerald-800">
                  {bookingSuccess.pricingTier === 'HOURLY' || bookingSuccess.rentalBasis === 'HOURLY'
                    ? `Hourly Basis (${bookingSuccess.totalHours || totalHours} Hour(s))`
                    : `Daily / Multi-Day Basis (${bookingSuccess.totalDays} Day(s))`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Schedule:</span>
                <span className="font-semibold text-slate-900">
                  {bookingSuccess.pricingTier === 'HOURLY' || bookingSuccess.rentalBasis === 'HOURLY'
                    ? `${bookingSuccess.startDate} (${preferredTimeSlot})`
                    : `${bookingSuccess.startDate} to ${bookingSuccess.endDate}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Payment Mode:</span>
                <span className="font-bold text-emerald-800">
                  {bookingSuccess.paymentMethod === 'NETBANKING'
                    ? 'NetBanking'
                    : bookingSuccess.paymentMethod === 'COD'
                    ? 'Cash on Delivery (COD)'
                    : 'UPI Pay'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Rent Amount:</span>
                <span className="font-bold text-emerald-700">₹{bookingSuccess.rentAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Refundable Deposit:</span>
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

            {/* Rental Basis Selector (Hourly Basis vs Daily / Multi-Day Basis) */}
            <div className="space-y-2">
              <label className="block font-extrabold text-slate-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-700" />
                <span>Select Rental Duration Basis *</span>
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setRentalBasis('HOURLY')}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center gap-0.5 ${
                    rentalBasis === 'HOURLY'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-extrabold ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="text-xs font-extrabold">Hourly Basis</span>
                  <span className="text-[11px] text-emerald-700 font-bold">₹{hourlyRate} / hour</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRentalBasis('DAILY')}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center gap-0.5 ${
                    rentalBasis === 'DAILY'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-extrabold ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="text-xs font-extrabold">Daily / Weekly / Monthly</span>
                  <span className="text-[11px] text-emerald-700 font-bold">₹{machine.dailyRate} / day</span>
                </button>
              </div>
            </div>

            {/* Schedule Inputs based on Hourly vs Daily */}
            {rentalBasis === 'HOURLY' ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-200/80">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Rental Date *</label>
                  <Input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Number of Hours *</label>
                  <Input
                    type="number"
                    min={1}
                    max={24}
                    required
                    value={totalHours}
                    onChange={(e) => setTotalHours(Math.max(1, Math.min(24, parseInt(e.target.value, 10) || 1)))}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Preferred Time Slot *</label>
                  <select
                    value={preferredTimeSlot}
                    onChange={(e) => setPreferredTimeSlot(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium outline-none focus:ring-1 focus:ring-emerald-600"
                  >
                    <option value="06:00 AM - 09:00 AM">06:00 AM - 09:00 AM</option>
                    <option value="08:00 AM - 11:00 AM">08:00 AM - 11:00 AM</option>
                    <option value="11:00 AM - 02:00 PM">11:00 AM - 02:00 PM</option>
                    <option value="02:00 PM - 05:00 PM">02:00 PM - 05:00 PM</option>
                    <option value="04:00 PM - 07:00 PM">04:00 PM - 07:00 PM</option>
                  </select>
                </div>
              </div>
            ) : (
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
            )}

            {/* Customer Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Customer Full Name *</label>
                <Input
                  type="text"
                  required
                  placeholder="Enter your full name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Contact Mobile Number (10 Digits) *</label>
                <Input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="10-digit mobile number"
                  value={customerMobile}
                  onChange={(e) => setCustomerMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Email Address (Optional — validated if entered)</label>
                <Input
                  type="email"
                  placeholder="Optional: e.g. farmer@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Farm Delivery Address (with Taluk/Hobli) *</label>
                <Input
                  type="text"
                  required
                  placeholder="Farm Plot / Survey No, Village, Taluk, District"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">PIN Code (6 Digits) *</label>
                <Input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="6-digit PIN code"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                />
              </div>
            </div>

            {/* Payment Method Section (UPI Pay, NetBanking, Cash on Delivery) */}
            <div className="pt-2 border-t border-slate-100 space-y-2.5">
              <label className="block font-extrabold text-slate-900 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-emerald-700" />
                <span>Select Payment Method *</span>
              </label>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                    paymentMethod === 'UPI'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-extrabold ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-emerald-700" />
                  <span className="text-[11px] font-bold">UPI Pay</span>
                  <span className="text-[9px] text-slate-500 font-normal">GPay, PhonePe, Paytm</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('NETBANKING')}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                    paymentMethod === 'NETBANKING'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-extrabold ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-emerald-700" />
                  <span className="text-[11px] font-bold">NetBanking</span>
                  <span className="text-[9px] text-slate-500 font-normal">SBI, Canara &amp; All Banks</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                    paymentMethod === 'COD'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-extrabold ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Banknote className="w-4 h-4 text-emerald-700" />
                  <span className="text-[11px] font-bold">Cash on Delivery</span>
                  <span className="text-[9px] text-slate-500 font-normal">Pay on machine delivery</span>
                </button>
              </div>

              {paymentMethod === 'UPI' && (
                <div className="p-2.5 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-emerald-950 block">UPI ID / VPA (GPay, PhonePe, Paytm, BHIM)</span>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. farmer@upi"
                    className="w-full p-2 bg-white border border-emerald-300 rounded-lg text-xs outline-none"
                  />
                </div>
              )}

              {paymentMethod === 'NETBANKING' && (
                <div className="p-2.5 bg-blue-50/60 border border-blue-200 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-slate-900 block">Select Bank for NetBanking</span>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full p-2 bg-white border border-blue-300 rounded-lg text-xs font-semibold outline-none"
                  >
                    {INDIAN_BANKS.map((bank) => (
                      <option key={bank} value={bank}>{bank}</option>
                    ))}
                  </select>
                </div>
              )}

              {paymentMethod === 'COD' && (
                <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded-xl text-[11px] text-amber-950">
                  <strong>Cash on Delivery (COD):</strong> Pay rental fee and refundable security deposit directly when the equipment is delivered to your farm.
                </div>
              )}
            </div>

            {/* Pricing Summary Card */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
              <div className="flex justify-between items-center text-slate-600">
                <span>Duration:</span>
                <span className="font-bold text-slate-900">
                  {rentalBasis === 'HOURLY'
                    ? `${totalHours} Hour(s) (${preferredTimeSlot})`
                    : `${totalDays} Day(s)`}
                </span>
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

              <div className="flex justify-between items-center text-slate-600">
                <span>Payment Mode:</span>
                <span className="font-bold text-emerald-800">
                  {paymentMethod === 'UPI' ? 'UPI Pay' : paymentMethod === 'NETBANKING' ? 'NetBanking' : 'Cash on Delivery'}
                </span>
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
                ? `Proceed to Rent (${rentalBasis === 'HOURLY' ? `${totalHours} Hr(s)` : `${totalDays} Day(s)`} • ${paymentMethod === 'COD' ? 'Cash on Delivery' : paymentMethod === 'NETBANKING' ? 'NetBanking' : 'UPI Pay'} • ₹${totalUpfront.toLocaleString('en-IN')})`
                : 'Fully Reserved — Choose Alternative Dates'}
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
          <li><strong>Late Return Policy:</strong> Returned after end date/time incurs a fee of 1.5&times; the applicable rate deducted from deposit.</li>
          <li><strong>Damage Inspection:</strong> Minor soil wear is covered. Broken components or motor seizure due to dry oil operation are assessed and deducted at actual spare part cost.</li>
        </ul>
      </div>

      {/* Equipment Rental Payment Confirmation Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100 text-xs animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Confirm Equipment Rental &amp; Payment</h4>
                  <span className="text-[10px] text-emerald-800 font-semibold uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    UPI Pay &bull; NetBanking &bull; Cash on Delivery
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

            {/* Payment Option Selector inside Modal */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-700 block">Choose Payment Mode:</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                    paymentMethod === 'UPI'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-extrabold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-emerald-700" />
                  <span className="text-[11px]">UPI Pay</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('NETBANKING')}
                  className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                    paymentMethod === 'NETBANKING'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-extrabold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-emerald-700" />
                  <span className="text-[11px]">NetBanking</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                    paymentMethod === 'COD'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-extrabold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Banknote className="w-4 h-4 text-emerald-700" />
                  <span className="text-[11px]">Cash on Delivery</span>
                </button>
              </div>
            </div>

            {paymentMethod === 'UPI' && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1.5 text-[11px]">
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
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1.5 text-[11px]">
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
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                <strong>Cash on Delivery (COD):</strong> Pay ₹{totalUpfront.toLocaleString('en-IN')} at your farm gate upon equipment delivery and inspection.
              </div>
            )}

            <div className="p-3.5 bg-slate-50 rounded-xl space-y-2 text-slate-700">
              <div className="flex justify-between">
                <span>Equipment:</span>
                <span className="font-bold text-slate-900">{machine.title}</span>
              </div>
              <div className="flex justify-between">
                <span>Rental Basis:</span>
                <span className="font-semibold text-slate-900">
                  {rentalBasis === 'HOURLY'
                    ? `Hourly Basis (${totalHours} Hour(s) on ${startDate})`
                    : `${startDate} → ${endDate} (${totalDays} Days)`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Rental Charge:</span>
                <span className="font-bold text-slate-900">₹{rentAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-emerald-800 font-semibold">
                <span>Refundable Deposit:</span>
                <span>₹{securityDeposit.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Selected Mode:</span>
                <span className="font-bold text-emerald-800">
                  {paymentMethod === 'UPI' ? `UPI Pay (${upiId || 'QR'})` : paymentMethod === 'NETBANKING' ? `NetBanking (${selectedBank})` : 'Cash on Delivery'}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-slate-900 text-sm">
                <span>Total Amount:</span>
                <span className="text-emerald-800">₹{totalUpfront.toLocaleString('en-IN')}</span>
              </div>
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
                {submitting
                  ? 'Confirming...'
                  : paymentMethod === 'COD'
                  ? 'Confirm COD Booking'
                  : `Pay via ${paymentMethod === 'UPI' ? 'UPI Pay' : 'NetBanking'}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

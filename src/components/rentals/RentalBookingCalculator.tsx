'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { RentalProductType } from '@/lib/seed-data';
import { ShieldCheck, CheckCircle2, Calendar, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface RentalBookingCalculatorProps {
  machine: RentalProductType;
}

export default function RentalBookingCalculator({ machine }: RentalBookingCalculatorProps) {
  const [durationDays, setDurationDays] = useState(3);
  const [startDate, setStartDate] = useState('2026-09-20');
  const [isBooked, setIsBooked] = useState(false);

  // Rate calculation
  let rentRate = machine.dailyRate * durationDays;
  if (durationDays >= 30) {
    rentRate = Math.round(machine.monthlyRate * (durationDays / 30));
  } else if (durationDays >= 7) {
    rentRate = Math.round(machine.weeklyRate * (durationDays / 7));
  }

  const totalAmount = rentRate + machine.securityDeposit;

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBooked(true);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
          <span>Book Rental Equipment</span>
          <span className="text-xs font-semibold text-brand-green bg-brand-lightGreen px-2.5 py-0.5 rounded-full">
            ₹{machine.dailyRate}/day
          </span>
        </h3>

        {isBooked ? (
          <div className="p-4 bg-brand-lightGreen/60 border border-brand-green/30 rounded-xl space-y-2 text-brand-greenDark">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-brand-green shrink-0" />
              <div className="font-extrabold text-sm text-slate-900">
                Rental Request Submitted Successfully!
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Booking Reference: <strong className="font-mono text-slate-900">RNT-2026-9481</strong>. Your
              nearest dark warehouse operator will verify field availability and contact you for delivery.
            </p>
            <Link
              href="/account/rentals"
              className="inline-block mt-2 text-xs font-bold underline text-brand-green hover:text-brand-greenDark"
            >
              View in Customer Account &rarr;
            </Link>
          </div>
        ) : (
          <form onSubmit={handleBook} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Start Date *</label>
              <Input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Duration (Days) *
              </label>
              <Input
                type="number"
                min="1"
                max="90"
                value={durationDays}
                onChange={(e) => setDurationDays(parseInt(e.target.value) || 1)}
              />
              <div className="text-[11px] text-slate-500 mt-1">
                {durationDays >= 30
                  ? '30+ Days: Applied Monthly Discounted Slab Rate'
                  : durationDays >= 7
                  ? '7+ Days: Applied Weekly Discounted Slab Rate'
                  : 'Standard Daily Rental Slab'}
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Rent for {durationDays} Day(s):</span>
                <span className="font-bold text-slate-900">₹{rentRate.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-brand-green">
                <span>Refundable Security Deposit:</span>
                <span className="font-bold">₹{machine.securityDeposit.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-black text-slate-900">
                <span>Total Upfront Amount:</span>
                <span className="text-brand-greenDark">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3.5 text-sm"
              disabled={!machine.isAvailable}
            >
              {machine.isAvailable ? 'Confirm Rental Booking' : 'Currently Rented Out'}
            </Button>
          </form>
        )}
      </div>

      <div className="p-4 bg-brand-lightGreen/50 rounded-xl border border-brand-green/20 text-xs text-brand-greenDark space-y-1.5">
        <div className="font-bold flex items-center gap-1.5 text-slate-900">
          <ShieldCheck className="w-4 h-4 text-brand-green" /> Transparent Security Deposit Policy
        </div>
        <p className="text-slate-600 leading-relaxed">
          The security deposit is 100% refunded to your original payment method or Kisan Wallet within
          24 hours of machine return and condition inspection at the dark warehouse.
        </p>
      </div>
    </div>
  );
}

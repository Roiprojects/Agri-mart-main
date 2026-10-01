import React from 'react';
import Link from 'next/link';
import { devDb } from '@/lib/dev-db';
import { ArrowLeft, Tractor, Calendar, ShieldCheck, AlertTriangle, CheckCircle2, Clock, Truck } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export default function CustomerRentalsPage() {
  const bookings = devDb.getRentalBookings({ userId: 'usr-farmer-01' });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="bg-emerald-100 text-emerald-800 font-extrabold px-3 py-1 rounded-full text-[11px] border border-emerald-300">ACTIVE ON-FIELD</span>;
      case 'APPROVED':
        return <span className="bg-blue-100 text-blue-800 font-extrabold px-3 py-1 rounded-full text-[11px] border border-blue-300">APPROVED &bull; DISPATCH READY</span>;
      case 'PENDING_APPROVAL':
        return <span className="bg-amber-100 text-amber-800 font-extrabold px-3 py-1 rounded-full text-[11px] border border-amber-300">PENDING WAREHOUSE APPROVAL</span>;
      case 'RETURNED_ON_TIME':
        return <span className="bg-slate-100 text-slate-800 font-extrabold px-3 py-1 rounded-full text-[11px] border border-slate-300">RETURNED &bull; ON-TIME</span>;
      case 'RETURNED_LATE':
        return <span className="bg-orange-100 text-orange-900 font-extrabold px-3 py-1 rounded-full text-[11px] border border-orange-300">RETURNED &bull; LATE</span>;
      case 'RETURNED_DAMAGED':
        return <span className="bg-rose-100 text-rose-900 font-extrabold px-3 py-1 rounded-full text-[11px] border border-rose-300">RETURNED &bull; DAMAGED</span>;
      case 'CANCELLED':
        return <span className="bg-slate-200 text-slate-600 font-extrabold px-3 py-1 rounded-full text-[11px]">CANCELLED</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-full text-[11px]">{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-xs">
      <Link href="/account" className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Account
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Your Equipment Rentals &amp; Return Status</h1>
          <p className="text-slate-500 mt-0.5">
            Track active machinery, return schedules, late fees, and security deposit settlements.
          </p>
        </div>
        <Link
          href="/rentals"
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2.5 rounded-xl transition self-start sm:self-auto shadow-sm"
        >
          Rent Equipment
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <Tractor className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No Rental Bookings Yet</h3>
          <p className="text-slate-500 max-w-sm mx-auto">
            Rent power weeders, brush cutters, sprayers, and reapers by the day, week, or month with 100% refundable security deposits.
          </p>
          <Link
            href="/rentals"
            className="inline-block bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-2.5 rounded-xl transition"
          >
            Explore Rental Machinery &rarr;
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 hover:border-slate-300 transition"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
                <div>
                  <span className="font-mono font-bold text-sm text-slate-900">
                    Booking #{booking.bookingNumber}
                  </span>
                  <span className="text-slate-400 ml-2">
                    ({booking.totalDays} Days &bull; {booking.pricingTier} Tier)
                  </span>
                </div>
                <div>{getStatusBadge(booking.status)}</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-slate-600">
                <div>
                  <div className="text-slate-500 font-medium">Equipment:</div>
                  <div className="text-slate-900 font-bold mt-0.5">{booking.productTitle}</div>
                </div>

                <div>
                  <div className="text-slate-500 font-medium">Rental Period:</div>
                  <div className="text-slate-900 font-semibold mt-0.5">
                    {booking.startDate} to {booking.endDate}
                  </div>
                </div>

                <div>
                  <div className="text-slate-500 font-medium">Security Deposit:</div>
                  <div className="text-slate-900 font-bold mt-0.5">
                    ₹{booking.securityDeposit.toLocaleString('en-IN')}
                    <span className="text-[10px] text-emerald-700 font-normal ml-1">
                      ({booking.depositRefundStatus === 'PROCESSED' ? 'Refunded' : 'Held'})
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-slate-500 font-medium">Rent Paid:</div>
                  <div className="text-emerald-700 font-extrabold text-sm mt-0.5">
                    ₹{booking.rentAmount.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Specific Return Audit Details */}
              {booking.status === 'RETURNED_LATE' && (
                <div className="p-3.5 bg-orange-50 rounded-xl border border-orange-200 text-orange-950 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-orange-700" /> Late Return Penalty Deduction Applied
                  </div>
                  <div className="text-[11px] text-orange-900 leading-relaxed">
                    Returned on <strong>{booking.actualReturnDate}</strong> ({booking.lateDays} day(s) late).
                    Late fee calculated at 1.5&times; daily rate: <strong>₹{booking.lateFee?.toLocaleString('en-IN')}</strong> deducted from security deposit. Net refunded to customer: <strong>₹{booking.depositRefundAmount?.toLocaleString('en-IN')}</strong>.
                  </div>
                </div>
              )}

              {booking.status === 'RETURNED_DAMAGED' && (
                <div className="p-3.5 bg-rose-50 rounded-xl border border-rose-200 text-rose-950 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-700" /> Damage Assessment Fee Deducted
                  </div>
                  <div className="text-[11px] text-rose-900 leading-relaxed">
                    Inspection Notes: {booking.damageNotes || 'Components required repair at dark warehouse.'}
                    <br />
                    Damage fee: <strong>₹{booking.damageFee?.toLocaleString('en-IN')}</strong> deducted from security deposit. Net refunded: <strong>₹{booking.depositRefundAmount?.toLocaleString('en-IN')}</strong>.
                  </div>
                </div>
              )}

              {booking.status === 'RETURNED_ON_TIME' && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    Machine inspected in perfect condition at Hubballi Hub. 100% security deposit (₹{booking.securityDeposit.toLocaleString('en-IN')}) refunded to original payment method.
                  </span>
                  <span className="font-bold text-emerald-800">Settled ✓</span>
                </div>
              )}

              {booking.status === 'ACTIVE' && (
                <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 text-emerald-950 flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
                    Currently on-field with safety gear and operator kit. Scheduled return: <strong>{booking.endDate}</strong>.
                  </span>
                  <Link href="/rentals" className="text-emerald-700 font-bold hover:underline">
                    Rent Another Implement &rarr;
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

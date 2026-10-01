import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { devDb } from '@/lib/dev-db';
import { SEED_RENTAL_PRODUCTS } from '@/lib/seed-data';
import { Tractor, Calendar, ShieldCheck, ArrowRight } from 'lucide-react';

export default function RentalsPage() {
  const dbRentals = devDb.getRentalProducts();
  const rentalProducts = dbRentals && dbRentals.length > 0 ? dbRentals : SEED_RENTAL_PRODUCTS;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-2xl p-6 sm:p-10 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">Rent a Product Module</span>
          <h1 className="text-2xl sm:text-4xl font-extrabold mt-1">Agricultural Equipment Rental Marketplace</h1>
          <p className="text-xs sm:text-sm text-emerald-100 mt-2 max-w-2xl">
            Mechanize your farm operations without heavy capital investment. Rent power weeders, brush cutters, sprayers, and reapers by Day, Week, or Month.
          </p>
        </div>
        <div className="bg-white/10 p-4 rounded-xl border border-white/20 text-xs space-y-1">
          <div className="font-bold text-amber-300">✓ 100% Refundable Deposits</div>
          <div className="text-slate-300">✓ Complete Maintenance Included</div>
          <div className="text-slate-300">✓ Doorstep Dark Warehouse Dispatch</div>
        </div>
      </div>

      {/* Rentals List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rentalProducts.map((machine) => (
          <div key={machine.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div className="relative aspect-video w-full bg-slate-100">
              <Image src={machine.images[0]} alt={machine.title} fill className="object-cover" />
              <span className="absolute top-3 left-3 bg-slate-900/80 text-white font-bold text-[10px] px-2.5 py-1 rounded-full">
                {machine.category}
              </span>
            </div>

            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 leading-snug">{machine.title}</h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">{machine.description}</p>

                <div className="mt-3 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1 text-slate-700">
                  <div><strong>Power:</strong> {machine.powerRating}</div>
                  <div><strong>Suitable for:</strong> {machine.suitableFor}</div>
                  <div className="text-emerald-700 font-semibold">
                    <strong>Security Deposit:</strong> ₹{machine.securityDeposit.toLocaleString('en-IN')} (Refundable)
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-lg font-black text-slate-900">₹{machine.dailyRate}/day</div>
                  <div className="text-[10px] text-slate-500">₹{machine.weeklyRate}/week | ₹{machine.monthlyRate}/month</div>
                </div>

                <Link
                  href={`/rentals/${machine.slug}`}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1"
                >
                  <span>Book Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

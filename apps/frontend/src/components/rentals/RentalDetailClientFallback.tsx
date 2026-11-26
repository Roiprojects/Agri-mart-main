'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Badge } from '@/components/ui/Badge';
import RentalBookingCalendar from '@/components/rentals/RentalBookingCalendar';
import { mergeRentalsWithOverrides, buildRentalFromProduct } from '@/lib/admin-rentals-services-storage';
import { mergeProductsWithOverrides } from '@/lib/admin-product-overrides';

interface RentalDetailClientFallbackProps {
  slug: string;
  initialMachine: any | null;
  allRentals: any[];
}

export default function RentalDetailClientFallback({
  slug,
  initialMachine,
  allRentals,
}: RentalDetailClientFallbackProps) {
  const [machine, setMachine] = useState<any | null>(initialMachine);
  const [resolvedAllRentals, setResolvedAllRentals] = useState<any[]>(allRentals);
  const [checkedClient, setCheckedClient] = useState(Boolean(initialMachine));
  const [activeImage, setActiveImage] = useState<string>('');

  useEffect(() => {
    const mergedRentals = mergeRentalsWithOverrides(allRentals);
    setResolvedAllRentals(mergedRentals);

    let found =
      mergedRentals.find((r: any) => r.slug === slug || r.id === slug) || initialMachine;

    if (!found) {
      const mergedProds = mergeProductsWithOverrides<any>([]);
      const prodMatch = mergedProds.find(
        (p: any) =>
          Boolean(p?.isRental) &&
          (`${p.slug}-rental` === slug || p.slug === slug || p.id === slug)
      );
      if (prodMatch) {
        found = buildRentalFromProduct(prodMatch);
      }
    }

    if (found) {
      setMachine(found);
      const imgs = Array.isArray(found.images) && found.images.length > 0 ? found.images : [];
      setActiveImage(imgs[0] || '/images/gallery/01-hero-tractor-sunrise.jpg');
    }
    setCheckedClient(true);
  }, [slug, initialMachine, allRentals]);

  if (!checkedClient) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-slate-400 text-sm">
        Loading rental equipment details...
      </div>
    );
  }

  if (!machine) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-4">
        <h1 className="text-2xl font-extrabold text-slate-900">Rental Equipment Not Found</h1>
        <p className="text-sm text-slate-500">
          The requested rental equipment could not be found or is no longer available.
        </p>
        <Link
          href="/rentals"
          className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition"
        >
          <span>Browse All Rent Equipment</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  const isAvailable =
    machine.isAvailable !== undefined
      ? Boolean(machine.isAvailable)
      : (machine.availableUnits ?? 1) > 0;
  const imagesList: string[] =
    Array.isArray(machine.images) && machine.images.length > 0
      ? machine.images.filter(Boolean)
      : ['/images/gallery/01-hero-tractor-sunrise.jpg'];
  const primaryImage = activeImage || imagesList[0];

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Rent Equipment', href: '/rentals' },
    { label: machine.title },
  ];

  const otherRentals = resolvedAllRentals.filter((r: any) => r.id !== machine.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Machine Info */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex flex-col-reverse sm:flex-row gap-3 items-start">
            {imagesList.length > 1 && (
              <div className="flex sm:flex-col gap-2 w-full sm:w-20 shrink-0 overflow-x-auto sm:overflow-y-auto sm:max-h-[420px] p-1">
                {imagesList.map((imgUrl, idx) => (
                  <button
                    key={`${idx}-${imgUrl.slice(0, 24)}`}
                    type="button"
                    onClick={() => setActiveImage(imgUrl)}
                    className={`w-16 h-16 shrink-0 rounded-xl overflow-hidden border-2 transition cursor-pointer ${
                      primaryImage === imgUrl ? 'border-emerald-600' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img src={imgUrl} alt={`${machine.title} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="relative flex-1 aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
              <img
                src={primaryImage}
                alt={machine.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <Badge variant={isAvailable ? 'success' : 'warning'}>
                  {isAvailable ? 'Available for Rent' : 'Currently On Field'}
                </Badge>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-brand-green uppercase tracking-wider">
                  {machine.category}
                </span>
                {machine.brand && (
                  <>
                    <span className="text-slate-300">&bull;</span>
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      {machine.brand}
                    </span>
                  </>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 leading-tight">
                {machine.title}
              </h1>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">{machine.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs sm:text-sm">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-slate-500 font-medium">Engine / Power Rating:</div>
                <div className="font-bold text-slate-900 mt-0.5">{machine.powerRating}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-slate-500 font-medium">Fuel / Power Source:</div>
                <div className="font-bold text-slate-900 mt-0.5">{machine.fuelType}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-slate-500 font-medium">Suitable Crop Operations:</div>
                <div className="font-bold text-slate-900 mt-0.5">{machine.suitableFor}</div>
              </div>
              <div className="p-3 bg-brand-lightGreen/60 rounded-xl border border-brand-green/20">
                <div className="text-brand-greenDark font-medium">Pre-Dispatch Inspection:</div>
                <div className="font-bold text-brand-green mt-0.5">
                  100% Tested &amp; Lubricated
                </div>
              </div>
            </div>

            {machine.specifications && Object.keys(machine.specifications).length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Technical Specifications
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  {Object.entries(machine.specifications).map(([key, val]) => (
                    <div
                      key={key}
                      className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center gap-2"
                    >
                      <span className="text-slate-500 font-medium">{key}</span>
                      <span className="text-slate-900 font-bold text-right">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Transparent Rental Rate Structure (Hourly &bull; Daily &bull; Weekly &bull; Monthly)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <div className="text-xs text-emerald-800 font-semibold">Hourly Rate</div>
                  <div className="text-base font-black text-emerald-900 mt-0.5">
                    ₹{(machine.hourlyRate || Math.max(50, Math.round(machine.dailyRate / 6))).toLocaleString('en-IN')}/hr
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500">Daily Rate</div>
                  <div className="text-base font-black text-slate-900 mt-0.5">
                    ₹{(Number(machine.dailyRate) || 0).toLocaleString('en-IN')}/day
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500">Weekly Rate</div>
                  <div className="text-base font-black text-slate-900 mt-0.5">
                    ₹{(Number(machine.weeklyRate) || 0).toLocaleString('en-IN')}/wk
                  </div>
                </div>
                <div className="p-3 bg-brand-lightGreen/50 rounded-xl border border-brand-green/30">
                  <div className="text-xs text-brand-greenDark">Monthly Rate</div>
                  <div className="text-base font-black text-brand-green mt-0.5">
                    ₹{(Number(machine.monthlyRate) || 0).toLocaleString('en-IN')}/mo
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form & Calendar */}
        <div className="lg:col-span-5">
          <RentalBookingCalendar machine={machine} />
        </div>
      </div>

      {/* Other Rentals */}
      {otherRentals.length > 0 && (
        <div className="space-y-6 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-900">
              Explore Other Rental Machinery
            </h2>
            <Link
              href="/rentals"
              className="text-xs font-bold text-brand-green hover:underline flex items-center gap-1"
            >
              View all machines <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {otherRentals.map((r: any) => {
              const imgUrl =
                (Array.isArray(r.images) && r.images[0]) ||
                '/images/gallery/01-hero-tractor-sunrise.jpg';
              return (
                <div
                  key={r.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col sm:flex-row gap-4 items-center shadow-sm hover:shadow-md transition"
                >
                  <div className="relative w-full sm:w-36 h-28 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    <img src={imgUrl} alt={r.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <span className="text-[11px] font-bold text-brand-green uppercase">
                      {r.category}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{r.title}</h3>
                    <div className="text-xs font-extrabold text-slate-900">
                      ₹{r.dailyRate}/day &bull; Dep: ₹{r.securityDeposit}
                    </div>
                    <Link
                      href={`/rentals/${r.slug}`}
                      className="inline-block text-xs font-bold text-brand-green hover:underline pt-1"
                    >
                      View &amp; Book &rarr;
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

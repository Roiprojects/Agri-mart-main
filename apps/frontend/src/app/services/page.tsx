import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/config';
import { SERVICES_CATALOGUE, ServiceDefinition } from '@/lib/services-data';
import { ApiClient } from '@/lib/api-client';
import { Wrench, MapPin, ArrowRight, ShieldCheck, Tractor, Layers, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export const metadata: Metadata = {
  title: 'On-Field Agricultural Services & GPS Farm Dispatch | AGRI MART MEGA',
  description:
    'Book tractor ploughing, rotavator tilling, reaper harvesting, drone spraying, soil testing, and skilled farm labour dispatched directly to your GPS parcel coordinates across Karnataka.',
  alternates: {
    canonical: `https://www.${SITE_CONFIG.domain}/services`,
  },
  openGraph: {
    title: 'Agricultural Services & Machinery Booking | AGRI MART MEGA',
    description:
      '10 mechanized on-field services with certified operators dispatched via smart GPS coordinates across Karnataka.',
    url: `https://www.${SITE_CONFIG.domain}/services`,
    siteName: SITE_CONFIG.name,
    locale: 'en_IN',
    type: 'website',
  },
};

export default async function ServicesPage() {
  let services: ServiceDefinition[] = SERVICES_CATALOGUE;
  try {
    const res = await ApiClient.getServicesCatalogue();
    if (res?.success && res.services?.length > 0) {
      services = res.services;
    }
  } catch (err) {
    // Fall back to seed catalog
  }

  const breadcrumbItems = [{ label: 'Home', href: '/' }, { label: 'Services' }];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-xs">
      <Breadcrumbs items={breadcrumbItems} />

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 font-black text-[10px] px-3 py-0.5 rounded-full uppercase tracking-wider">
            <span>Pillar 3 &bull; Section 8 &amp; 9 Compliant</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            On-Field Agricultural Services (GPS Dispatched)
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            Professional tractor operators, rotavator tilling, combine harvesters, drone precision spraying,
            and NABL soil testing deployed directly to your farm parcel GPS location across Karnataka.
          </p>
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          <Link
            href="/services/book"
            className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-lg transition text-center"
          >
            Book Smart Service via GPS &rarr;
          </Link>
          <div className="text-[11px] text-emerald-200 text-center font-medium">
            ✓ Operator + Diesel + Implement Included
          </div>
        </div>
      </div>

      {/* 10 Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((srv) => (
          <div
            key={srv.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <Tractor className="w-5 h-5" />
                </div>
                <span className="bg-amber-100 text-amber-900 font-bold px-2.5 py-0.5 rounded-full text-[10px] border border-amber-200">
                  {srv.badge}
                </span>
              </div>

              <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1">
                {srv.category}
              </div>

              <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                <Link href={`/services/${srv.slug}`} className="hover:text-emerald-700 transition">
                  {srv.name}
                </Link>
              </h3>

              <div className="text-emerald-800 font-bold text-xs mt-1">
                Starting from ₹{srv.baseRatePerAcre}/acre
              </div>

              <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-2">
                {srv.shortDescription}
              </p>

              {/* Job-Work Sub-Operations preview */}
              <div className="mt-3.5 bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5">
                <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{srv.jobWorkTypes.length} Documented Job-Work Types:</span>
                </div>
                <div className="space-y-1 text-[11px] text-slate-600">
                  {srv.jobWorkTypes.slice(0, 2).map((jw) => (
                    <div key={jw.id} className="flex justify-between items-center">
                      <span className="truncate pr-2">&bull; {jw.name}</span>
                      <span className="font-bold text-slate-900 shrink-0">₹{jw.rate} {jw.rateUnit}</span>
                    </div>
                  ))}
                  {srv.jobWorkTypes.length > 2 && (
                    <div className="text-[10px] text-slate-400 font-medium">
                      + {srv.jobWorkTypes.length - 2} more operations available
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-3 text-[11px] text-slate-500 space-y-1">
                <div>
                  <strong className="text-slate-700">Fleet:</strong> {srv.equipmentUsed}
                </div>
                <div>
                  <strong className="text-slate-700">Operational Speed:</strong> {srv.timeEstimate}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
              <Link
                href={`/services/${srv.slug}`}
                className="text-xs font-bold text-slate-600 hover:text-emerald-700 flex items-center gap-1"
              >
                View Details <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href={`/services/book?service=${srv.id}`}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-xs"
              >
                Book with GPS
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

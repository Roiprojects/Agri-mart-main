import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SITE_CONFIG } from '@/lib/config';
import { SERVICES_CATALOGUE, getServiceBySlug } from '@/lib/services-data';
import { ApiClient } from '@/lib/api-client';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Wrench,
  Clock,
  IndianRupee,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Tractor,
  ArrowRight,
  PhoneCall,
  Layers,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

interface ServiceDetailPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: ServiceDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  let service = getServiceBySlug(resolvedParams.slug);
  try {
    const res = await ApiClient.getServicesCatalogue({ slug: resolvedParams.slug });
    if (res?.success && (res as any).service) {
      service = (res as any).service;
    }
  } catch {}

  if (!service) {
    return { title: 'Service Not Found | AGRI MART MEGA' };
  }

  const title = `${service.name} | Farm Mechanization Services | AGRI MART MEGA`;
  const description = `${service.description.slice(0, 155)}... Book certified machinery operators at ₹${service.baseRatePerAcre}/acre with GPS live field tracking in Karnataka.`;
  const canonical = `https://www.${SITE_CONFIG.domain}/services/${service.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_CONFIG.name,
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const resolvedParams = await params;
  let service = getServiceBySlug(resolvedParams.slug);

  try {
    const res = await ApiClient.getServicesCatalogue({ slug: resolvedParams.slug });
    if (res?.success && (res as any).service) {
      service = (res as any).service;
    }
  } catch (e) {
    console.error('ServiceDetailPage fetch error:', e);
  }

  if (!service) {
    notFound();
  }

  const canonicalUrl = `https://www.${SITE_CONFIG.domain}/services/${service.slug}`;

  // Structured Data (Schema.org Service)
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: service.name,
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      telephone: SITE_CONFIG.tollFree,
      url: `https://www.${SITE_CONFIG.domain}`,
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Karnataka, India',
    },
    offers: {
      '@type': 'Offer',
      price: service.baseRatePerAcre,
      priceCurrency: 'INR',
      description: `₹${service.baseRatePerAcre} per acre standard field operation fee`,
    },
  };

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: service.name },
  ];

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `https://www.${SITE_CONFIG.domain}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Services',
        item: `https://www.${SITE_CONFIG.domain}/services`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: service.name,
        item: canonicalUrl,
      },
    ],
  };

  const otherServices = SERVICES_CATALOGUE.filter((s) => s.id !== service.id).slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 text-xs">
        <Breadcrumbs items={breadcrumbItems} />

        {/* Hero Banner */}
        <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-emerald-900/40">
          <div className="max-w-3xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {service.badge}
              </span>
              <span className="text-xs text-emerald-300 font-medium">
                GPS Dispatched &bull; {service.category}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {service.name}
            </h1>
            <p className="text-sm sm:text-base text-emerald-100 leading-relaxed">
              {service.description}
            </p>
          </div>
        </div>

        {/* Details & Booking Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Info */}
          <div className="lg:col-span-7 space-y-6">
            {/* Overview Stats */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
                <span>Machinery &amp; Operational Standards</span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  All-Inclusive Service
                </span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="text-slate-500 font-medium flex items-center gap-1.5">
                    <Tractor className="w-4 h-4 text-emerald-700" /> Fleet Units:
                  </div>
                  <div className="font-bold text-slate-900 text-xs sm:text-sm">
                    {service.equipmentUsed}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="text-slate-500 font-medium flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-emerald-700" /> Operational Speed:
                  </div>
                  <div className="font-bold text-slate-900 text-xs sm:text-sm">
                    {service.timeEstimate}
                  </div>
                </div>

                <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200/80 space-y-1">
                  <div className="text-emerald-900 font-medium flex items-center gap-1.5">
                    <IndianRupee className="w-4 h-4 text-emerald-700" /> Standard Base Rate:
                  </div>
                  <div className="font-black text-emerald-900 text-base">
                    ₹{service.baseRatePerAcre} / acre
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="text-slate-500 font-medium flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-700" /> Dispatch Coverage:
                  </div>
                  <div className="font-bold text-slate-900 text-xs sm:text-sm">
                    Direct GPS dispatch to farm parcels
                  </div>
                </div>
              </div>

              {/* Documented Job-Work Sub-Operations */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-emerald-700" /> Documented Job-Work Operations &amp; Pricing
                  </h3>
                  <span className="text-[10px] text-slate-400 font-medium">Selectable on booking</span>
                </div>

                <div className="space-y-3">
                  {service.jobWorkTypes.map((jw) => (
                    <div
                      key={jw.id}
                      className="p-4 bg-slate-50 hover:bg-emerald-50/40 rounded-xl border border-slate-200 transition space-y-2"
                    >
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1">
                        <div>
                          <span className="font-extrabold text-sm text-slate-900">{jw.name}</span>
                        </div>
                        <span className="bg-emerald-100 text-emerald-900 font-black px-3 py-1 rounded-lg text-xs self-start sm:self-auto border border-emerald-300">
                          ₹{jw.rate} <span className="font-normal text-[10px]">/{jw.rateUnit}</span>
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">{jw.description}</p>

                      <div className="pt-2 border-t border-slate-200/60 flex flex-wrap gap-4 text-[11px] text-slate-500">
                        <div>
                          <strong>Implement:</strong> {jw.equipmentNeeded}
                        </div>
                        <div>
                          <strong>Duration:</strong> {jw.estimatedDuration}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Guarantees */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Agri Mart Mega Service Guarantees
                </h3>
                <ul className="space-y-2 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Live GPS arrival tracking directly to your field parcel bund.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>No diesel or operator surcharges &mdash; 100% transparent pricing.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Backup machine dispatched within 3 hours in event of mechanical snag.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Booking Action Sidebar */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
              <div>
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                  Section 9 GPS Booking
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                  Schedule {service.name}
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Pin your farm parcel location with your phone GPS. Super Admin assigns the nearest verified fleet unit within 2 hours.
                </p>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
                <span className="text-xs text-emerald-800 font-medium">Starting from</span>
                <div className="text-3xl font-black text-slate-950 mt-0.5">
                  ₹{service.baseRatePerAcre}
                  <span className="text-sm font-normal text-slate-600"> / acre</span>
                </div>
              </div>

              <div className="space-y-2.5">
                <Link
                  href={`/services/book?service=${service.id}`}
                  className="w-full inline-block text-center bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm py-3.5 px-6 rounded-xl shadow-md transition"
                >
                  Book Smart Service via GPS &rarr;
                </Link>

                <a
                  href={`tel:${SITE_CONFIG.supportPhone.replace(/\s+/g, '')}`}
                  className="w-full inline-flex items-center justify-center gap-2 text-center bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-3 px-6 rounded-xl transition"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-700" /> Agronomist Booking Desk: {SITE_CONFIG.supportPhone}
                </a>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <div className="font-semibold text-slate-800">Assistance &amp; Helplines:</div>
                <div>Karnataka Toll-Free: {SITE_CONFIG.tollFree}</div>
                <div>Dark Warehouse Hub: Hubballi, Belagavi, Mandya Hubs</div>
              </div>
            </div>

            {/* FAQs */}
            {service.faq && service.faq.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-700" /> Frequently Asked Questions
                </h4>
                <div className="space-y-2 text-[11px]">
                  {service.faq.map((item, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl space-y-1">
                      <div className="font-bold text-slate-900">{item.q}</div>
                      <div className="text-slate-600">{item.a}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Other Farm Services */}
        {otherServices.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-slate-900">
                Other Mechanized Farm Services
              </h2>
              <Link
                href="/services"
                className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
              >
                View all 10 services <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {otherServices.map((s) => (
                <div
                  key={s.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase">
                      {s.category}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm">{s.name}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2">{s.shortDescription}</p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">
                      ₹{s.baseRatePerAcre}/acre
                    </span>
                    <Link
                      href={`/services/${s.slug}`}
                      className="text-xs font-bold text-emerald-700 hover:underline"
                    >
                      Details &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

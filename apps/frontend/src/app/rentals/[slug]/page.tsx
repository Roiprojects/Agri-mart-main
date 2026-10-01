import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { SITE_CONFIG } from '@/lib/config';
import { SEED_RENTAL_PRODUCTS } from '@/lib/seed-data';
import { ApiClient } from '@/lib/api-client';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Badge } from '@/components/ui/Badge';
import RentalBookingCalendar from '@/components/rentals/RentalBookingCalendar';
import {
  Wrench,
  Fuel,
  CheckCircle,
  Truck,
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface RentalDetailPageProps {
  params: Promise<{ slug: string }>;
}

async function fetchDbRental(slug: string) {
  try {
    const res = await ApiClient.getRentalBySlug(slug);
    if (res.success && res.data) return res.data;
  } catch (e) {
    // Fallback
  }
  return null;
}

export async function generateStaticParams() {
  try {
    const res = await ApiClient.getRentals();
    if (res.success && res.data && res.data.length > 0) {
      return res.data.map((machine: any) => ({ slug: machine.slug }));
    }
  } catch (e) {
    // Fallback
  }
  return SEED_RENTAL_PRODUCTS.map((machine) => ({
    slug: machine.slug,
  }));
}

export async function generateMetadata({ params }: RentalDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const dbProduct = await fetchDbRental(resolvedParams.slug);
  const seedProduct = SEED_RENTAL_PRODUCTS.find((r) => r.slug === resolvedParams.slug);
  const machine = dbProduct || seedProduct;

  if (!machine) {
    return { title: 'Rental Equipment Not Found | AGRI MART MEGA' };
  }

  const title = `Rent ${machine.title} | AGRI MART MEGA`;
  const description = `${machine.description.slice(0, 155)}... Rent starting at ₹${machine.dailyRate}/day with direct dark warehouse delivery across Karnataka.`;
  const canonical = `https://www.${SITE_CONFIG.domain}/rentals/${machine.slug}`;

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
      images: machine.images.map((img: string) => ({
        url: img,
        width: 800,
        height: 600,
        alt: machine.title,
      })),
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: machine.images,
    },
  };
}

export default async function RentalDetailPage({ params }: RentalDetailPageProps) {
  const resolvedParams = await params;
  const dbProduct = await fetchDbRental(resolvedParams.slug);
  const seedProduct = SEED_RENTAL_PRODUCTS.find((r) => r.slug === resolvedParams.slug);
  const machine = (dbProduct || seedProduct) as any;

  if (!machine) {
    notFound();
  }

  const canonicalUrl = `https://www.${SITE_CONFIG.domain}/rentals/${machine.slug}`;

  // Structured Data (Schema.org)
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: machine.title,
    image: machine.images,
    description: machine.description,
    category: machine.category,
    offers: {
      '@type': 'Offer',
      url: canonicalUrl,
      priceCurrency: 'INR',
      price: machine.dailyRate,
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/UsedCondition',
      availability: machine.isAvailable
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: SITE_CONFIG.name,
      },
    },
  };

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Farm Rentals', href: '/rentals' },
    { label: machine.title },
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
        name: 'Farm Rentals',
        item: `https://www.${SITE_CONFIG.domain}/rentals`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: machine.title,
        item: canonicalUrl,
      },
    ],
  };

  const otherRentals = SEED_RENTAL_PRODUCTS.filter((r) => r.id !== machine.id);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Machine Info */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
              <Image
                src={machine.images[0]}
                alt={machine.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute top-4 left-4">
                <Badge variant={machine.isAvailable ? 'success' : 'warning'}>
                  {machine.isAvailable ? 'Available for Rent' : 'Currently On Field'}
                </Badge>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold text-brand-green uppercase tracking-wider">
                  {machine.category}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 leading-tight">
                  {machine.title}
                </h1>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                {machine.description}
              </p>

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
                    100% Tested & Lubricated
                  </div>
                </div>
              </div>

              {/* Machine Rental Rates Slab */}
              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Transparent Rental Rate Structure
                </h3>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-xs text-slate-500">Daily Rate</div>
                    <div className="text-base font-black text-slate-900 mt-0.5">
                      ₹{machine.dailyRate.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-xs text-slate-500">Weekly Rate</div>
                    <div className="text-base font-black text-slate-900 mt-0.5">
                      ₹{machine.weeklyRate.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="p-3 bg-brand-lightGreen/50 rounded-xl border border-brand-green/30">
                    <div className="text-xs text-brand-greenDark">Monthly Rate</div>
                    <div className="text-base font-black text-brand-green mt-0.5">
                      ₹{machine.monthlyRate.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form & Calendar (Client Component) */}
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
              {otherRentals.map((r) => (
                <div
                  key={r.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col sm:flex-row gap-4 items-center shadow-sm hover:shadow-md transition"
                >
                  <div className="relative w-full sm:w-36 h-28 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    <Image src={r.images[0]} alt={r.title} fill className="object-cover" />
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
                      View & Book &rarr;
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

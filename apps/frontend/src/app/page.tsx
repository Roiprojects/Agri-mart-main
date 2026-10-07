import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { SITE_CONFIG } from '@/lib/config';
import {
  SEED_CATEGORIES,
  SEED_PRODUCTS,
  SEED_RENTAL_PRODUCTS,
  SEED_BLOG_POSTS,
} from '@/lib/seed-data';
import { ApiClient } from '@/lib/api-client';
import FieldContourDecoration from '@/components/home/FieldContourDecoration';
import HeroBannerSlider from '@/components/home/HeroBannerSlider';
import CropStageFilter from '@/components/home/CropStageFilter';
import CropJourneyTimeline from '@/components/home/CropJourneyTimeline';
import ProductCard from '@/components/shop/ProductCard';
import YmmFilterWidget from '@/components/shop/YmmFilterWidget';
import { Accordion, AccordionItemData } from '@/components/ui/Accordion';
import { Badge } from '@/components/ui/Badge';
import {
  Sparkles,
  Tractor,
  Wrench,
  Warehouse,
  ShieldCheck,
  Sprout,
  ArrowRight,
  CheckCircle2,
  PhoneCall,
  Clock,
  Star,
  Quote,
  Shield,
  Truck,
  RotateCcw,
  IndianRupee,
  Calendar,
  Layers,
  Search,
} from 'lucide-react';

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} | Farm Essentials, Machinery Rentals & Crop Guidance Karnataka`,
  description:
    'Shop farm essentials, rent equipment, book agricultural services, and find guidance for every stage of your crop across Karnataka. Hyper-local 40-60 km dark warehouse fulfillment.',
  alternates: {
    canonical: `https://www.${SITE_CONFIG.domain}`,
  },
  openGraph: {
    title: `${SITE_CONFIG.name} - ${SITE_CONFIG.tagline}`,
    description:
      'Empowering Indian farmers with genuine farm equipment, rentals, on-field services, and AI agronomy guidance.',
    url: `https://www.${SITE_CONFIG.domain}`,
    siteName: SITE_CONFIG.name,
    locale: 'en_IN',
    type: 'website',
  },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const [productsRes, categoriesRes, rentalsRes] = await Promise.all([
    ApiClient.getProducts().catch(() => null),
    ApiClient.getCategories().catch(() => null),
    ApiClient.getRentals().catch(() => null),
  ]);

  const featuredProducts = productsRes?.data && productsRes.data.length > 0
    ? productsRes.data.slice(0, 4)
    : SEED_PRODUCTS.slice(0, 4);

  const displayCategories = categoriesRes?.data && categoriesRes.data.length > 0
    ? categoriesRes.data.slice(0, 6).map((c: any) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        image: c.image || 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?auto=format&fit=crop&w=600&q=80',
      }))
    : SEED_CATEGORIES.slice(0, 6);

  const featuredRentals = rentalsRes?.data && rentalsRes.data.length > 0
    ? rentalsRes.data.slice(0, 3)
    : SEED_RENTAL_PRODUCTS;

  const topServices = SITE_CONFIG.services.slice(0, 4);
  const blogs = SEED_BLOG_POSTS;

  // FAQ items for Section 13
  const homeFaqs: AccordionItemData[] = [
    {
      id: 'faq-warehouse',
      title: 'How does the Dark Warehouse delivery network work across Karnataka?',
      subtitle: 'Hyper-local logistics within 40-60 km',
      content: (
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          We operate centralized dark warehouses in Hubballi, Belagavi, Davanagere, and Haveri.
          All orders within 40-60 km of our hubs are dispatched via local light commercial vehicles,
          ensuring farm gate delivery within 24 to 48 hours.
        </p>
      ),
    },
    {
      id: 'faq-amc',
      title: 'What is included in the 1-Year AMC for farm machinery?',
      subtitle: 'Doorsetp tune-ups & warranty',
      content: (
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Every new power weeder, tiller, and sprayer includes 2 free on-field preventive maintenance
          tune-ups, 100% manufacturer warranty against defects, and priority spare parts dispatch
          through our 1,500+ authorized dealer workshops.
        </p>
      ),
    },
    {
      id: 'faq-rental',
      title: 'When is the rental security deposit refunded?',
      subtitle: '100% transparent refund',
      content: (
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Upon return of the machine, our technician verifies the unit within 2 to 4 hours.
          The security deposit is 100% credited back to your original payment method or Kisan
          Wallet within 24 hours.
        </p>
      ),
    },
    {
      id: 'faq-subsidy',
      title: 'Can I use the purchase invoice for Government DBT subsidies?',
      subtitle: 'Official GST tax invoice',
      content: (
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Yes. All purchases come with a certified GST invoice containing the machine serial number,
          engine number, and HSN code, approved for state Department of Agriculture Krishi Abhiyan
          subsidies.
        </p>
      ),
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 bg-agri-cream/30">
      {/* =========================================================================
          SECTION 1: HERO (Edge-to-Edge Full-Width Banner & Viewport-Optimized)
         ========================================================================= */}
      <section className="relative w-full overflow-hidden border-b border-agri-border/60">
        <HeroBannerSlider />
      </section>

      {/* =========================================================================
          YMM FILTER WIDGET (Controlled by Filter (YMM) settings: displayOnHomePage)
         ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12 relative z-20">
        <YmmFilterWidget />
      </div>

      {/* =========================================================================
          SECTION 2: SHOP BY CATEGORY (Asymmetrical Visual Tiles)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 mb-8">
          <div>
            <span className="text-xs font-bold text-agri-green uppercase tracking-wider">
              Comprehensive Catalogue
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Shop by Agricultural Category
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-bold text-agri-green hover:underline flex items-center gap-1"
          >
            Explore all categories <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {displayCategories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group bg-white rounded-2xl border border-agri-border p-3.5 card-hover shadow-subtle flex flex-col items-center text-center space-y-3"
            >
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-agri-cream/60">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover img-zoom"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-extrabold text-xs text-agri-dark group-hover:text-agri-green transition line-clamp-2">
                  {category.name}
                </h3>
                <div className="text-[10px] text-agri-secondary">Explore Category &rarr;</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: FEATURED PRODUCTS (Clean Product Grid)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 mb-8">
          <div>
            <span className="text-xs font-bold text-agri-green uppercase tracking-wider">
              Top Selling Inputs
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Featured Agricultural Equipment & Care
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-bold text-agri-green hover:underline flex items-center gap-1"
          >
            View all products <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: SHOP BY CROP OR FARMING STAGE (Interactive Dual Filter)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <span className="text-xs font-bold text-agri-green uppercase tracking-wider">
            Precision Agronomy Filtering
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Shop by Crop or Farming Stage
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Filter inputs specifically formulated for your crop type and current phenological stage.
          </p>
        </div>

        <CropStageFilter />
      </section>

      {/* =========================================================================
          SECTION 5: AI PRODUCT GUIDANCE (Google Gemini Advisory Callout)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-agri-pale via-white to-agri-cream rounded-3xl border-2 border-agri-green/30 p-6 sm:p-10 shadow-sm relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-agri-yellow text-agri-dark px-3 py-1 rounded-full text-xs font-black shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Google Gemini AI Agri-Doctor</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Instant AI Crop Diagnosis & Input Recommendations
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Describe your crop symptom or upload a leaf photo. Our AI advisor identifies nutrient
              deficiencies, fungal blights, and pest attacks according to Karnataka University of
              Agricultural Sciences (UAS) agronomic standards.
            </p>

            {/* Quick Symptom Chips */}
            <div className="pt-2">
              <div className="text-xs font-bold text-slate-500 uppercase mb-2">
                Common Farmer Inquiries:
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                {[
                  'Yellow leaf tip in paddy',
                  'Inter-row weeds in Bt Cotton',
                  'Shoot borer in sugarcane',
                  'Stage 3 fertilizer dosage for maize',
                ].map((query, i) => (
                  <Link
                    key={i}
                    href={`/ai-advisory?q=${encodeURIComponent(query)}`}
                    className="bg-white hover:bg-emerald-50 text-slate-800 hover:text-agri-green font-semibold px-3 py-1.5 rounded-xl border border-slate-200 transition shadow-xs"
                  >
                    &ldquo;{query}&rdquo; &rarr;
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-3">
              <Link
                href="/ai-advisory"
                className="inline-flex items-center gap-2 bg-agri-green hover:bg-agri-green-dark text-white font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow transition"
              >
                <Sparkles className="w-4 h-4 text-agri-yellow" />
                <span>Launch Interactive AI Crop Doctor</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: RENT FARM EQUIPMENT (Wide Photographic Panel)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 mb-8">
          <div>
            <span className="text-xs font-bold text-agri-green uppercase tracking-wider">
              Zero Heavy Capital Investment
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Rent Farm Machinery by the Day
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              100% pre-serviced equipment with transparent daily rates and guaranteed security deposit refund.
            </p>
          </div>
          <Link
            href="/rentals"
            className="text-xs font-bold text-agri-green hover:underline flex items-center gap-1"
          >
            View all rental machines <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredRentals.map((machine) => (
            <div
              key={machine.id}
              className="bg-white rounded-3xl border border-agri-border overflow-hidden shadow-subtle card-hover flex flex-col justify-between group"
            >
              <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden">
                <Image
                  src={machine.images[0]}
                  alt={machine.title}
                  fill
                  className="object-cover img-zoom"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant={machine.isAvailable ? 'success' : 'warning'} size="sm">
                    {machine.isAvailable ? 'Available Now' : 'Currently Rented'}
                  </Badge>
                </div>
              </div>

              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-bold text-agri-green uppercase tracking-wider">
                    {machine.category} &bull; {machine.powerRating}
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900 mt-1 line-clamp-2">
                    {machine.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {machine.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-lg font-black text-slate-900">
                        ₹{machine.dailyRate}
                      </span>
                      <span className="text-xs text-slate-500 font-medium"> / day</span>
                    </div>
                    <span className="text-xs text-agri-secondary font-medium">
                      Dep: ₹{machine.securityDeposit}
                    </span>
                  </div>

                  <Link
                    href={`/rentals/${machine.slug}`}
                    className="w-full text-center bg-agri-green hover:bg-agri-green-dark text-white font-bold text-xs py-2.5 px-4 rounded-xl transition block shadow-xs"
                  >
                    Rent This Machine &rarr;
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: BOOK AGRICULTURAL SERVICES (GPS Dispatched)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 mb-8">
          <div>
            <span className="text-xs font-bold text-agri-green uppercase tracking-wider">
              On-Field Mechanization Fleet
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Book Agricultural Services via GPS
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Experienced operators and certified agri drones dispatched directly to your parcel coordinates.
            </p>
          </div>
          <Link
            href="/services"
            className="text-xs font-bold text-agri-green hover:underline flex items-center gap-1"
          >
            View all 10 services <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topServices.map((srv) => (
            <div
              key={srv.id}
              className="bg-white rounded-3xl border border-agri-border p-5 shadow-subtle card-hover flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-agri-pale text-agri-green flex items-center justify-center mb-3">
                  <Tractor className="w-5 h-5" />
                </div>
                <Badge variant="outline" size="sm" className="mb-2">
                  {srv.category}
                </Badge>
                <h3 className="font-extrabold text-sm text-slate-900 leading-snug">
                  {srv.name}
                </h3>
                <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                  {srv.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="text-slate-500">Rate:</span>
                  <span className="font-black text-slate-900 text-sm">₹{srv.ratePerAcre} / acre</span>
                </div>
                <Link
                  href={`/services/book?type=${srv.id}`}
                  className="w-full text-center bg-agri-green hover:bg-agri-green-dark text-white font-bold text-xs py-2 px-3 rounded-xl transition block shadow-xs"
                >
                  Book Service &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: SEVEN-STAGE CROP JOURNEY (Interactive Stepped Timeline)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-xs font-bold text-agri-green uppercase tracking-wider">
            Scientific Agronomy Roadmaps
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Seven-Stage Crop Journey
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Follow the standardized package of practices to systematically reduce inputs and maximize yields.
          </p>
        </div>

        <CropJourneyTimeline />
      </section>

      {/* =========================================================================
          SECTION 9: EQUIPMENT REPAIR AND WORKSHOP SUPPORT (9-Stage Flow)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-agri-border p-6 sm:p-10 shadow-sm space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <span className="text-xs font-bold text-agri-green uppercase tracking-wider">
                Automotive Standard Workshop Care
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Equipment Repair & 1-Year AMC Support
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Every repair job is tracked through a transparent 9-stage digital workflow across 1,500+ dealer workshops.
              </p>
            </div>
            <Link
              href="/dealers"
              className="bg-agri-yellow hover:bg-amber-400 text-slate-950 font-black text-xs px-5 py-3 rounded-xl shadow-xs transition shrink-0"
            >
              Find Nearest Service Center &rarr;
            </Link>
          </div>

          {/* 9 Stages Badges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2 text-center text-xs">
            {SITE_CONFIG.repairStages.map((stg, i) => (
              <div
                key={stg.key}
                className="p-3 bg-agri-cream rounded-xl border border-agri-border/70 flex flex-col items-center justify-center space-y-1"
              >
                <div className="w-5 h-5 rounded-full bg-agri-green text-white font-bold text-[10px] flex items-center justify-center">
                  {i + 1}
                </div>
                <div className="text-[11px] font-bold text-slate-800 leading-tight">
                  {stg.label.split('. ')[1]}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-agri-pale/60 rounded-2xl border border-emerald-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-agri-green shrink-0" />
              <div>
                <span className="font-extrabold text-slate-900 text-sm">
                  1-Year Comprehensive AMC Coverage
                </span>
                <p className="text-slate-600 mt-0.5">
                  Includes 2 free doorstep preventive tune-ups, genuine OEM replacement parts, and mechanic phone support.
                </p>
              </div>
            </div>
            <Link
              href="/dealers"
              className="text-xs font-bold text-agri-green hover:underline shrink-0"
            >
              Find Authorized Dealer Workshops &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 10: WHY CHOOSE AGRI MART MEGA (Value Pillars)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <Badge variant="brand" size="md">
            The Agri Mart Mega Advantage
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Why Farmers Across Karnataka Trust Us
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Backed by {SITE_CONFIG.parentCompany} with guaranteed standards in machinery metallurgy,
            bio-purity, and logistics speed.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl border border-agri-border p-6 space-y-3 shadow-subtle card-hover">
            <div className="w-12 h-12 rounded-2xl bg-agri-pale text-agri-green flex items-center justify-center font-black">
              <Warehouse className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">40-60km Dark Hubs</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Automated order routing to your nearest regional warehouse ensures fast 24-48 hr farm gate delivery.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-agri-border p-6 space-y-3 shadow-subtle card-hover">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">1-Year Full AMC</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Free preventive maintenance tune-ups and guaranteed OEM spare parts from 1,500+ dealer workshops.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-agri-border p-6 space-y-3 shadow-subtle card-hover">
            <div className="w-12 h-12 rounded-2xl bg-agri-pale text-agri-green flex items-center justify-center font-black">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">100% Deposit Refund</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Rental security deposits are verified and returned to your bank account or Kisan Wallet within 24 hours.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-agri-border p-6 space-y-3 shadow-subtle card-hover">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black">
              <PhoneCall className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">Farmer Helpline</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Toll-free telephone assistance for farmers at {SITE_CONFIG.tollFree}.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 11: FARMING GUIDES & AGRONOMY BLOG
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 mb-8">
          <div>
            <span className="text-xs font-bold text-agri-green uppercase tracking-wider">
              Agronomy Knowledge Hub
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Farming Guides & Scientific Advice
            </h2>
          </div>
          <Link
            href="/blog"
            className="text-xs font-bold text-agri-green hover:underline flex items-center gap-1"
          >
            Read all guides <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogs.map((b) => (
            <article
              key={b.id}
              className="bg-white rounded-3xl border border-agri-border overflow-hidden shadow-subtle card-hover flex flex-col justify-between group"
            >
              <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                <Image src={b.image} alt={b.title} fill className="object-cover img-zoom" sizes="(max-width: 768px) 100vw, 33vw" />
                <div className="absolute top-3 left-3">
                  <Badge variant="brand" size="sm">
                    {b.category}
                  </Badge>
                </div>
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] text-slate-500 flex items-center gap-2">
                    <Calendar className="w-3 h-3" /> {b.date} &bull; {b.readingTime}
                  </div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 mt-1 line-clamp-2 leading-snug">
                    <Link href={`/blog/${b.slug}`} className="hover:text-agri-green transition-colors duration-150">
                      {b.title}
                    </Link>
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {b.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 truncate max-w-[65%]">{b.author}</span>
                  <Link
                    href={`/blog/${b.slug}`}
                    className="font-bold text-agri-green hover:underline flex items-center gap-1"
                  >
                    Read Guide &rarr;
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 12: APPROVED TESTIMONIALS (Clearly Marked Demo Farmer Examples)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <Badge variant="golden" size="md">
            Verified Farmer Stories &bull; Demo Examples
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Hear from Farmers in Karnataka
          </h2>
          <p className="text-xs text-slate-500">
            Real field outcomes simulated for demonstration based on regional agronomy trials.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl border border-agri-border p-6 shadow-subtle card-hover space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <Quote className="w-8 h-8 text-agri-green/30" />
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                &ldquo;Renting the 7HP rotary power weeder saved me over ₹4,000 per acre in manual weeding costs across my 6-acre Bt cotton parcel. The machine was pre-tuned and the security deposit was refunded the next morning.&rdquo;
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-agri-pale text-agri-green flex items-center justify-center font-bold text-sm">
                SP
              </div>
              <div>
                <div className="font-extrabold text-sm text-slate-900">Suresh Patil</div>
                <div className="text-[11px] text-slate-500">Ranebennur, Haveri &bull; Bt Cotton (6 Acres)</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-agri-border p-6 shadow-subtle card-hover space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <Quote className="w-8 h-8 text-agri-green/30" />
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                &ldquo;The drone precision spraying service sprayed 10 acres of sugarcane ratoon in under 2 hours. Water consumption was reduced by 90% and canopy penetration under dense leaves was far superior to manual knapsacks.&rdquo;
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-agri-pale text-agri-green flex items-center justify-center font-bold text-sm">
                BH
              </div>
              <div>
                <div className="font-extrabold text-sm text-slate-900">Basavaraj Hiremath</div>
                <div className="text-[11px] text-slate-500">Kundgol, Dharwad &bull; Sugarcane (10 Acres)</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-agri-border p-6 shadow-subtle card-hover space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <Quote className="w-8 h-8 text-agri-green/30" />
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                &ldquo;Ordering Bhoomi Sanjivani bio-fertilizer and seeds from the Hubballi warehouse was seamless. Delivered to our village gate within 24 hours with an official GST invoice for our Krishi Abhiyan subsidy.&rdquo;
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-agri-pale text-agri-green flex items-center justify-center font-bold text-sm">
                MK
              </div>
              <div>
                <div className="font-extrabold text-sm text-slate-900">Mallikarjun Kulkarni</div>
                <div className="text-[11px] text-slate-500">Bailhongal, Belagavi &bull; Paddy & Soybean</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 13: FREQUENTLY ASKED QUESTIONS (Accordion)
         ========================================================================= */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
          <Badge variant="brand" size="md">
            Common Questions
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Answers on dark warehouse logistics, machinery AMC, rental security deposits, and DBT subsidy invoicing.
          </p>
        </div>

        <Accordion items={homeFaqs} defaultOpenId="faq-warehouse" />

        <div className="text-center pt-6">
          <Link
            href="/faq"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-agri-green hover:underline"
          >
            <span>View All Frequently Asked Questions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* Bottom Conversion CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-agri-dark via-emerald-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-emerald-900/40">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Ready to Mechanize Your Farm Parcel?
            </h3>
            <p className="text-xs sm:text-sm text-emerald-200/80 max-w-xl">
              Call our agronomists toll-free or browse our catalogue for express dark warehouse delivery across Karnataka.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <a
              href={`tel:${SITE_CONFIG.tollFree.replace(/[^\d+]/g, '')}`}
              className="inline-flex items-center gap-2 bg-agri-yellow hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-md transition"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{SITE_CONFIG.tollFree}</span>
            </a>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl transition border border-white/20"
            >
              Explore Catalogue &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

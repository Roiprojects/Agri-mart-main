import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/config';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Badge } from '@/components/ui/Badge';
import { Accordion, AccordionItemData } from '@/components/ui/Accordion';
import {
  HelpCircle,
  Truck,
  ShieldCheck,
  RotateCcw,
  Tractor,
  CreditCard,
  PhoneCall,
  MessageSquare,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions (FAQ) | AGRI MART MEGA',
  description:
    'Got questions about Agri Mart Mega? Read our comprehensive FAQ on dark warehouse express delivery, 1-year machinery AMC warranties, farm rental deposits, GPS service booking, and payments.',
  alternates: {
    canonical: `https://www.${SITE_CONFIG.domain}/faq`,
  },
  openGraph: {
    title: 'Frequently Asked Questions (FAQ) | AGRI MART MEGA',
    description:
      'Clear answers on dark warehouse deliveries, farm equipment rental, AMC warranty policies, and GPS field mechanization.',
    url: `https://www.${SITE_CONFIG.domain}/faq`,
    siteName: SITE_CONFIG.name,
    locale: 'en_IN',
    type: 'website',
  },
};

const FAQ_ITEMS: AccordionItemData[] = [
  {
    id: 'faq-warehouse-delivery',
    title: 'How does the Dark Warehouse delivery network work across Karnataka?',
    subtitle: 'Hyper-local logistics & delivery timelines',
    icon: <Truck className="w-5 h-5 text-brand-green" />,
    content: (
      <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
        <p>
          AGRI MART MEGA operates strategically positioned dark warehouses in Hubballi, Belagavi,
          Davanagere, and Haveri. Each warehouse maintains cold and dry storage for certified seeds,
          crop care formulations, and heavy machinery spare parts.
        </p>
        <p>
          Orders placed by farmers within a <strong>40-60 km radius</strong> of any dark warehouse
          are dispatched via our dedicated rural transport fleet, ensuring delivery within 24 to 48
          hours directly to your farm gate or village drop point.
        </p>
      </div>
    ),
  },
  {
    id: 'faq-machinery-amc',
    title: 'What does the 1-Year AMC (Annual Maintenance Contract) & Warranty cover?',
    subtitle: 'Machinery protection and doorstep service',
    icon: <ShieldCheck className="w-5 h-5 text-brand-green" />,
    content: (
      <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
        <p>
          Every new power tiller, rotary weeder, tractor-mounted boom sprayer, and solar water pump
          purchased on AGRI MART MEGA comes backed by our comprehensive <strong>1-Year AMC</strong>:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-slate-700">
          <li>Two complimentary on-field preventive maintenance checkups and engine oil flushes.</li>
          <li>100% warranty against manufacturing defects on engines, gearboxes, and chassis.</li>
          <li>Priority dispatch of genuine OEM spare parts through our authorized dealer workshops.</li>
          <li>Free phone troubleshooting with certified agricultural machinery engineers.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'faq-rental-deposits',
    title: 'How do farm equipment rentals and security deposit refunds work?',
    subtitle: 'Transparent rental terms without hidden deductions',
    icon: <RotateCcw className="w-5 h-5 text-brand-green" />,
    content: (
      <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
        <p>
          Farmers can rent high-capacity machinery (e.g., 7HP power weeders, self-propelled paddy
          reapers) on a daily, weekly, or monthly slab rate. When booking, an initial refundable
          security deposit is held to protect against physical mishandling.
        </p>
        <p>
          Upon return of the machine to the dark warehouse, our technicians inspect the unit within
          2 to 4 hours. The security deposit is <strong>100% refunded</strong> to your original
          bank account, UPI, or Kisan Wallet within 24 hours of inspection sign-off.
        </p>
      </div>
    ),
  },
  {
    id: 'faq-gps-services',
    title: 'How does GPS-dispatched on-field farm service booking work?',
    subtitle: 'Tractor ploughing, drone spraying & soil sampling',
    icon: <Tractor className="w-5 h-5 text-brand-green" />,
    content: (
      <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
        <p>
          When you request services like tractor ploughing, rotavator tilling, or precision drone
          spraying via our website or mobile app, our system captures your farm parcel coordinates
          via GPS.
        </p>
        <p>
          The request is automatically routed to the nearest equipped operator and dark warehouse.
          The operator arrives with calibrated machinery at the scheduled date and time. Real-time
          acreage is recorded and verified digitally before the final billing is generated.
        </p>
      </div>
    ),
  },
  {
    id: 'faq-payments-subsidy',
    title: 'Which payment methods are supported, and can I use the invoice for government subsidy?',
    subtitle: 'GST compliance, DBT subsidies & flexible payment',
    icon: <CreditCard className="w-5 h-5 text-brand-green" />,
    content: (
      <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
        <p>
          We accept all major payment modes including UPI (PhonePe, Google Pay, BHIM), Net Banking,
          Debit/Credit Cards, Kisan Credit Cards (KCC), and Cash on Delivery (COD for eligible
          pincodes).
        </p>
        <p>
          All equipment purchases include an official <strong>GST-compliant tax invoice</strong> with
          machine serial numbers, engine numbers, and HSN codes, fully eligible for state department
          of agriculture (Raitha Samparka Kendra / Krishi Abhiyan) Direct Benefit Transfer (DBT)
          subsidies.
        </p>
      </div>
    ),
  },
  {
    id: 'faq-dealer-network',
    title: 'Where can I find an authorized Agri Mart Mega service center or dealer in Karnataka?',
    subtitle: 'Over 28+ district partner workshops',
    icon: <HelpCircle className="w-5 h-5 text-brand-green" />,
    content: (
      <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
        <p>
          We have an established network of authorized dealer workshops across Dharwad, Belagavi,
          Haveri, Gadag, Bagalkote, Vijayapura, and Davanagere.
        </p>
        <p>
          You can visit any authorized dealer for genuine spares, warranty repairs, blade
          replacements, or drop off your equipment for seasonal overhaul. Job cards are tracked
          digitally from check-in to quality sign-off.
        </p>
      </div>
    ),
  },
];

export default function FAQPage() {
  const breadcrumbItems = [{ label: 'Home', href: '/' }, { label: 'FAQ' }];

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
        name: 'FAQ',
        item: `https://www.${SITE_CONFIG.domain}/faq`,
      },
    ],
  };

  // Structured Data (Schema.org FAQPage)
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How does the Dark Warehouse delivery network work across Karnataka?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'AGRI MART MEGA operates strategically positioned dark warehouses in Hubballi, Belagavi, Davanagere, and Haveri. Orders within a 40-60 km radius are dispatched via rural transport within 24 to 48 hours.',
        },
      },
      {
        '@type': 'Question',
        name: 'What does the 1-Year AMC (Annual Maintenance Contract) & Warranty cover?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Every new power tiller, rotary weeder, tractor-mounted boom sprayer, and solar pump comes backed by our 1-Year AMC covering 2 complimentary preventive maintenance checkups, 100% warranty against manufacturing defects, and genuine OEM spares.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do farm equipment rentals and security deposit refunds work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Farmers can rent machinery on daily, weekly, or monthly rates. The refundable security deposit is 100% refunded to your original payment method or Kisan Wallet within 24 hours of machine return and inspection.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does GPS-dispatched on-field farm service booking work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'When you book tractor ploughing, rotavators, or drone spraying, your farm coordinates are captured via GPS. The request is routed to the nearest equipped operator and dark warehouse with digital boundary verification.',
        },
      },
      {
        '@type': 'Question',
        name: 'Which payment methods are supported, and can I use the invoice for government subsidy?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We accept UPI, Net Banking, Debit/Credit Cards, Kisan Credit Cards, and Cash on Delivery. All purchases include official GST-compliant tax invoices eligible for state agricultural DBT subsidies.',
        },
      },
      {
        '@type': 'Question',
        name: 'Where can I find an authorized Agri Mart Mega service center or dealer in Karnataka?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We have authorized dealer workshops across Dharwad, Belagavi, Haveri, Gadag, Bagalkote, Vijayapura, and Davanagere providing genuine spares and digital job card warranty repairs.',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <Breadcrumbs items={breadcrumbItems} />

        {/* Header */}
        <div className="text-center space-y-3">
          <Badge variant="success" size="md">
            Farmer Support & Help
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Everything you need to know about our products, dark warehouse deliveries, rental
            equipment, and GPS on-field services.
          </p>
        </div>

        {/* FAQ Accordion */}
        <Accordion items={FAQ_ITEMS} defaultOpenId="faq-warehouse-delivery" />

        {/* Still Have Questions Box */}
        <div className="bg-brand-lightGreen rounded-3xl p-6 sm:p-8 border border-brand-green/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-extrabold text-slate-900">Still have questions?</h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Our Karnataka agricultural support team is available Monday to Saturday, 8 AM to 8 PM.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <a
              href={`tel:${SITE_CONFIG.tollFree.replace(/[^\d+]/g, '')}`}
              className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-greenDark text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow transition"
            >
              <PhoneCall className="w-4 h-4" /> {SITE_CONFIG.tollFree}
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm px-5 py-3 rounded-xl border border-slate-200 shadow-sm transition"
            >
              <MessageSquare className="w-4 h-4 text-brand-green" /> Contact Us
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

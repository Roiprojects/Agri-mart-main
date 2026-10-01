import React from 'react';
import { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/config';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | AGRI MART MEGA',
  description:
    'Privacy Policy for AGRI MART MEGA. Learn how we collect, safeguard, and use farmer location data, phone numbers, and agricultural information across Karnataka.',
  alternates: {
    canonical: `https://www.${SITE_CONFIG.domain}/privacy-policy`,
  },
  openGraph: {
    title: 'Privacy Policy | AGRI MART MEGA',
    description: 'Privacy Policy and data security guidelines for AGRI MART MEGA.',
    url: `https://www.${SITE_CONFIG.domain}/privacy-policy`,
    siteName: SITE_CONFIG.name,
    locale: 'en_IN',
    type: 'website',
  },
};

export default function PrivacyPolicyPage() {
  const breadcrumbItems = [{ label: 'Home', href: '/' }, { label: 'Privacy Policy' }];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8 text-slate-700 leading-relaxed text-sm">
        <div className="border-b border-slate-100 pb-6 space-y-2">
          <div className="flex items-center gap-2 text-brand-green font-bold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" /> Legal & Data Protection
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-400">
            Effective Date: September 1, 2026 &bull; Last Revised: September 2026
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-brand-green" /> 1. Overview & Commitment
          </h2>
          <p>
            {SITE_CONFIG.name} (a division of {SITE_CONFIG.parentCompany}, located at {SITE_CONFIG.headquarters}) is committed to safeguarding the personal, geospatial, and operational data of farmers, equipment operators, and rural dealers who access our website, mobile application, and dark warehouse fulfillment services.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">2. Information We Collect</h2>
          <ul className="list-disc pl-5 space-y-2 text-slate-600">
            <li>
              <strong>Account & Contact Information:</strong> Full name, mobile phone number, OTP authentication tokens, village name, taluk, district, and delivery address.
            </li>
            <li>
              <strong>Geospatial & Farm Parcel Data:</strong> GPS coordinates, acreage size, soil test results, and crop stage classifications provided when scheduling on-field machinery services (tractors, rotavators, drone sprayers) or AI agronomy advisory.
            </li>
            <li>
              <strong>Payment & Invoicing Information:</strong> Transaction identifiers, payment methods (UPI IDs, Kisan Credit Card transaction logs), and GST registration numbers for agricultural tax invoices and subsidy documentation.
            </li>
            <li>
              <strong>Machinery Rental Records:</strong> Equipment serial numbers, duration of usage, dispatch/return odometer readings, and inspection logs.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">3. How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-2 text-slate-600">
            <li>To dispatch agricultural machinery, spare parts, and inputs from the nearest dark warehouse within our 40-60 km delivery grid.</li>
            <li>To route field technicians and licensed drone pilots directly to farm parcels with turn-by-turn precision.</li>
            <li>To process 1-Year AMC warranties, dealer service job cards, and security deposit refunds.</li>
            <li>To deliver automated SMS and WhatsApp notifications regarding seed germination advice, pest warnings, and dispatch status.</li>
            <li>To improve regional crop guidance through aggregated, non-personally identifiable agricultural analytics.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">4. Data Sharing & Third-Party Protection</h2>
          <p>
            We do not sell, rent, or trade your personal or farm data to third-party advertisers. Information is only shared with:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>Authorized local dealer workshops for job card repair and warranty maintenance.</li>
            <li>Verified logistics partners delivering heavy agricultural equipment to rural pin codes.</li>
            <li>Regulatory authorities when required by Karnataka state or Indian central agricultural compliance laws.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">5. Security & Data Retention</h2>
          <p>
            All network communication is encrypted using 256-bit TLS encryption. Farm parcel coordinates and payment logs are stored in secure ISO 27001-certified Indian data center regions in compliance with the Digital Personal Data Protection Act (DPDP Act, 2023).
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">6. Contact Our Grievance Officer</h2>
          <p>
            For privacy inquiries, data deletion requests, or grievances:
          </p>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
            <div className="font-bold text-slate-900">Grievance Redressal Cell &bull; {SITE_CONFIG.name}</div>
            <div>Email: <a href={`mailto:${SITE_CONFIG.supportEmail}`} className="text-brand-green font-semibold">{SITE_CONFIG.supportEmail}</a></div>
            <div>Toll-Free Helpline: {SITE_CONFIG.tollFree}</div>
            <div>Address: {SITE_CONFIG.headquarters}</div>
          </div>
        </section>
      </div>
    </div>
  );
}

import React from 'react';
import { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/config';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { FileCheck, ShieldAlert, Scale, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms and Conditions | AGRI MART MEGA',
  description:
    'Terms of service, warranty conditions, equipment rental rules, and on-field operational policies for AGRI MART MEGA customers and partners across Karnataka.',
  alternates: {
    canonical: `https://www.${SITE_CONFIG.domain}/terms`,
  },
  openGraph: {
    title: 'Terms and Conditions | AGRI MART MEGA',
    description: 'Terms of service and equipment rental terms for AGRI MART MEGA.',
    url: `https://www.${SITE_CONFIG.domain}/terms`,
    siteName: SITE_CONFIG.name,
    locale: 'en_IN',
    type: 'website',
  },
};

export default function TermsPage() {
  const breadcrumbItems = [{ label: 'Home', href: '/' }, { label: 'Terms & Conditions' }];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8 text-slate-700 leading-relaxed text-sm">
        <div className="border-b border-slate-100 pb-6 space-y-2">
          <div className="flex items-center gap-2 text-brand-green font-bold text-xs uppercase tracking-wider">
            <Scale className="w-4 h-4" /> Legal Agreement
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Terms & Conditions of Service
          </h1>
          <p className="text-xs text-slate-400">
            Last Updated: September 2026 &bull; Applicable to Sales, Rentals & Field Services
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">1. Acceptance of Terms</h2>
          <p>
            By using the {SITE_CONFIG.name} portal, purchasing agricultural machinery, booking on-field services, or entering into farm equipment rental agreements, you agree to comply with these terms, established under the laws of Karnataka and India.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">2. Equipment Rental & Security Deposit Policy</h2>
          <ul className="list-disc pl-5 space-y-2 text-slate-600">
            <li>
              <strong>Pre-condition:</strong> A refundable security deposit is mandatory for all self-operated equipment rentals (weeders, tillers, reapers).
            </li>
            <li>
              <strong>Refund:</strong> 100% of the deposit is returned within 24 hours of equipment return, contingent on technical inspection confirming no reckless mechanical damage or missing attachments.
            </li>
            <li>
              <strong>Fuel & Operation:</strong> Unless specified otherwise, fuel (petrol/diesel) is provided by the lessee farmer. Only authorized lubricants recommended by the manufacturer may be used.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">3. 1-Year Annual Maintenance Contract (AMC) & Warranty</h2>
          <ul className="list-disc pl-5 space-y-2 text-slate-600">
            <li>All new power equipment carries a 1-year manufacturer warranty against defective metallurgy and assembly errors.</li>
            <li>The 1-year AMC covers two scheduled field tune-ups and technical inspections by authorized dealer mechanics.</li>
            <li>Warranty does not cover standard wear items (such as tines, belts, spark plugs, or rubber hoses) or damages resulting from unauthorized modification.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">4. GPS On-Field Services Execution</h2>
          <p>
            Tractor ploughing, rotavator tilling, and drone spraying operations require safe parcel approach roads and viable weather conditions (e.g. drone flights cannot proceed during heavy winds &gt;25 km/h or heavy rainfall). If weather halts operations, work is rescheduled without cancellation penalties.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">5. Jurisdiction & Disputes</h2>
          <p>
            Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the competent courts in Hubballi-Dharwad, Karnataka.
          </p>
        </section>
      </div>
    </div>
  );
}

import React from 'react';
import { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/config';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Truck, Clock, MapPin, ShieldCheck, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Shipping & Delivery Policy | AGRI MART MEGA',
  description:
    'Shipping and delivery guidelines for AGRI MART MEGA. Dark warehouse express dispatch within 40-60 km across Karnataka, heavy machinery transport, and tracking.',
  alternates: {
    canonical: `https://www.${SITE_CONFIG.domain}/shipping-policy`,
  },
  openGraph: {
    title: 'Shipping & Delivery Policy | AGRI MART MEGA',
    description:
      'Dark warehouse rural delivery network, heavy equipment transit, and dispatch timelines.',
    url: `https://www.${SITE_CONFIG.domain}/shipping-policy`,
    siteName: SITE_CONFIG.name,
    locale: 'en_IN',
    type: 'website',
  },
};

export default function ShippingPolicyPage() {
  const breadcrumbItems = [{ label: 'Home', href: '/' }, { label: 'Shipping Policy' }];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8 text-slate-700 leading-relaxed text-sm">
        <div className="border-b border-slate-100 pb-6 space-y-2">
          <div className="flex items-center gap-2 text-brand-green font-bold text-xs uppercase tracking-wider">
            <Truck className="w-4 h-4" /> Logistics & Fulfillment
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Shipping & Delivery Policy
          </h1>
          <p className="text-xs text-slate-400">
            Last Updated: September 2026 &bull; Fast Rural Distribution Network
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand-green" /> 1. Dark Warehouse Dispatch Grid
          </h2>
          <p>
            To eliminate rural delivery delays, {SITE_CONFIG.name} fulfills all farm orders directly from our network of regional Dark Warehouses situated in <strong>Hubballi (Central Hub), Belagavi, Davanagere, and Haveri</strong>.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="font-bold text-slate-900 text-xs uppercase text-brand-green">
                Core Radius (0 - 40 km)
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Same-day or next-day delivery (within 24 hours) via local light commercial vehicle (LCV) fleet.
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="font-bold text-slate-900 text-xs uppercase text-brand-green">
                Extended Radius (40 - 60 km)
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Guaranteed delivery within 24 to 48 hours directly to the farm gate or village cooperative center.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-green" /> 2. Delivery Timelines by Product Category
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-slate-600">
            <li>
              <strong>Agrochemicals, Certified Seeds & Bio-Inputs:</strong> Dispatched in tamper-evident sealed packaging within 12 hours of order confirmation. Delivered within 24-36 hours.
            </li>
            <li>
              <strong>Heavy Farm Machinery (Tillers, Weeders, Sprayers):</strong> Every unit undergoes a 15-point pre-delivery inspection (PDI), including oil filling and trial engine crank, before loading onto transport. Delivered within 24-48 hours.
            </li>
            <li>
              <strong>Rental Equipment:</strong> Dispatched early morning (between 6:00 AM - 8:00 AM) to arrive at the farm parcel prior to daily field operations.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">3. Shipping Charges & Free Delivery Threshold</h2>
          <p>
            Standard input orders (seeds, fertilizers, bio-stimulants, hand tools) with a cart value of <strong>₹1,999 or higher</strong> qualify for <strong>FREE DELIVERY</strong> within all serviced pin codes.
          </p>
          <p>
            Orders below ₹1,999 carry a flat nominal delivery fee of ₹120 to subsidize rural last-mile transit costs.
          </p>
          <p>
            Heavy machinery delivery (above 40 kg) includes hydraulic tailgate offloading and on-site initial startup demonstration at zero extra cost.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">4. Live GPS Tracking & Handover Verification</h2>
          <p>
            Once your order leaves the dark warehouse, an automated SMS and WhatsApp alert is sent containing the driver contact number and a real-time tracking link.
          </p>
          <p>
            Upon delivery, the customer verifies the sealed container or equipment serial numbers and authenticates the delivery with a 4-digit OTP provided via SMS.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-green" /> 5. Transit Damage & Immediate Replacement
          </h2>
          <p>
            All shipments are 100% transit-insured. If an item arrives with broken seals, leakage, or transit denting, simply refuse delivery or note the damage on the delivery challan. A replacement unit will be dispatched from the nearest warehouse within 24 hours at no additional charge.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Logistics Helpline</h2>
          <p className="text-xs text-slate-600">
            For urgent delivery status or route updates, call our Central Dispatch Desk at{' '}
            <strong className="text-slate-900">{SITE_CONFIG.supportPhone}</strong> or toll-free at{' '}
            <strong className="text-slate-900">{SITE_CONFIG.tollFree}</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}

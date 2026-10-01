import React from 'react';
import { SITE_CONFIG } from '@/lib/config';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
      <h1 className="text-3xl font-extrabold text-slate-900">About {SITE_CONFIG.name}</h1>
      <p className="font-semibold text-emerald-800">
        Commissioned by {SITE_CONFIG.parentCompany}, Bangalore &bull; {SITE_CONFIG.projectRef}
      </p>

      <p>
        Agri Mart Mega is an end-to-end digital agricultural platform designed to digitize the entire agricultural value chain for Indian farmers. At its core, Agri Mart connects farmers with modern equipment, green care crop inputs, and certified on-field services through an intelligent AI-powered platform.
      </p>

      <h2 className="text-xl font-bold text-slate-900 pt-4">Five Functional Pillars</h2>
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>Pillar 1: E-Commerce & AI:</strong> Product catalog, 9-point guided agronomy questionnaire, automated crop & soil recommendations.</li>
        <li><strong>Pillar 2: Dark Warehouse Logistics:</strong> Automated GPS & PIN code routing across 5 regional dark warehouses in Karnataka.</li>
        <li><strong>Pillar 3: Equipment Rental & Smart Services:</strong> Daily/monthly machinery rentals and GPS-dispatched on-field farm services.</li>
        <li><strong>Pillar 4: Crop Lifecycle Management:</strong> Dedicated procurement portal tracking farmers through all 7 standardized crop stages.</li>
        <li><strong>Pillar 5: Service & Dealer Commissions:</strong> 9-stage automotive-grade equipment repair system across 1,500+ dealers and incentive commission disbursements.</li>
      </ul>
    </div>
  );
}

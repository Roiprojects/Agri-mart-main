'use client';

import React from 'react';
import Link from 'next/link';
import {
  CircleDot,
  Circle,
  Sliders,
  Layers,
  ShoppingCart,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export default function AttributesHubPage() {
  const sections = [
    {
      title: 'Product attributes',
      href: '/admin/catalogue/attributes/product',
      description: 'Manage configurable attributes like Sprayer Tank Capacity, Blade Type, Power Source, and Packaging SKU Size.',
      countLabel: '5 Standard Attributes',
      icon: Sliders,
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      title: 'Specification attributes',
      href: '/admin/catalogue/attributes/specification',
      description: 'Define technical specification dictionaries including Engine Displacement, HP, Tilling Width, and Soil Compatibility.',
      countLabel: '8 Technical Specs',
      icon: Layers,
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      title: 'Checkout attributes',
      href: '/admin/catalogue/attributes/checkout',
      description: 'Configure options selected by farmers at checkout, such as Pre-delivery Assembly, Transit Insurance, and Dark-store Dispatch.',
      countLabel: '4 Checkout Options',
      icon: ShoppingCart,
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    },
  ];

  return (
    <div className="space-y-6 max-w-full text-slate-800 pb-16 font-sans">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 pb-1">
        <div>
          <h1 className="text-2xl font-normal text-slate-800 tracking-tight flex items-center gap-2">
            <CircleDot className="w-6 h-6 text-[#3c8dbc]" />
            <span>Attributes</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure product options, technical specification dictionaries, and checkout attributes.
          </p>
        </div>
      </div>

      {/* 3 ATTRIBUTE CARDS MATCHING SIDEBAR SUB-ITEMS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {sections.map((sec) => {
          const Icon = sec.icon;
          return (
            <Link
              key={sec.title}
              href={sec.href}
              className="bg-white rounded border border-[#d2d6de] p-5 shadow-2xs hover:shadow-md hover:border-[#3c8dbc] transition-all group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm group-hover:text-[#3c8dbc] transition-colors">
                    <Circle className="w-4 h-4 stroke-[2.5] text-slate-500 group-hover:text-[#3c8dbc]" />
                    <span>{sec.title}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${sec.badgeColor}`}>
                    {sec.countLabel}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {sec.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#f4f4f4] flex items-center justify-between text-xs text-[#3c8dbc] font-medium group-hover:translate-x-1 transition-transform">
                <span>Manage {sec.title.toLowerCase()}</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* FOOTER */}
      <footer className="mt-8 border-t border-[#d2d6de] pt-4 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          Powered by{' '}
          <a
            href="https://www.nopcommerce.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#3c8dbc] hover:underline"
          >
            nopCommerce
          </a>
        </div>
        <div>nopCommerce version 4.90.0</div>
      </footer>
    </div>
  );
}

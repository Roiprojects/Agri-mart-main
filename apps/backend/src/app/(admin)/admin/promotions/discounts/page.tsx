import { Percent, Sparkles, Tag, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function DiscountsPage() {
  const activeCampaigns = [
    {
      title: 'Kharif Sowing Season Launch',
      discount: 'Up to 25% Off Compare Price',
      scope: 'Farm Machinery, Tillers & Sprayers',
      badge: 'Active Season',
    },
    {
      title: 'Bio-Care Micro-Nutrient Bundle',
      discount: 'Automatic ₹150 Off above ₹2,000 cart',
      scope: 'Fertilizers & Soil Care Consortia',
      badge: 'Applied at Checkout',
    },
    {
      title: 'Drip & Micro-Irrigation Foundation Subsidy',
      discount: 'Direct Farmer Instant Rebate',
      scope: 'Jain Drip Tech & Venturi Kits',
      badge: 'Govt Aligned',
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
            <Percent className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Promotions & Discounts</h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Catalog price markdowns, automated strike-through pricing, and volume bundle campaigns.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {activeCampaigns.map((camp) => (
          <div key={camp.title} className="rounded-xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold uppercase">
                {camp.badge}
              </span>
              <Sparkles className="h-4 w-4 text-amber-500" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">{camp.title}</h3>
            <p className="text-xs font-semibold text-emerald-700">{camp.discount}</p>
            <p className="text-xs text-slate-500">{camp.scope}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-semibold text-slate-900">Looking to set item-level markdown pricing?</h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Use the Compare Price feature on any individual product to show crossed-out MRP with discount percentages on customer storefront pages.
          </p>
        </div>
        <Link
          href="/admin/catalogue/products"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition whitespace-nowrap"
        >
          <Tag className="h-3.5 w-3.5" />
          Edit Products
        </Link>
      </div>
    </div>
  );
}

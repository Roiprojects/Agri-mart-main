import { Sliders, CheckCircle2, ShieldCheck, Layers } from 'lucide-react';

export default function AttributesPage() {
  const standardGroups = [
    {
      name: 'Engine & Power Specifications',
      items: ['Engine Displacement (cc)', 'Power Rating (HP / kW)', 'Fuel Tank Capacity', 'Starting Mechanism'],
    },
    {
      name: 'Physical & Structural Attributes',
      items: ['Weight (kg)', 'Tilling Width (inches)', 'Blade Material', 'Wheelbase Dimensions'],
    },
    {
      name: 'Soil & Agronomy Compatibility',
      items: ['Target Crop Types', 'Approved Soil Textures', 'Recommended Crop Stages (1-7)', 'Operating Pressure (PSI)'],
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
            <Sliders className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Product Attributes & Groups</h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Standardized technical attribute dictionaries attached across machinery, inputs, and fertilizers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {standardGroups.map((grp) => (
          <div key={grp.name} className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-emerald-600" />
              <h3 className="font-bold text-sm text-slate-900">{grp.name}</h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-700">
              {grp.items.map((it) => (
                <li key={it} className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-xs text-slate-500 shadow-xs">
        <ShieldCheck className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
        <p className="font-semibold text-slate-900">Catalog Schema Enforced</p>
        <p className="mt-1 max-w-md mx-auto text-slate-500">
          Product specifications are synchronized automatically with the farmer storefront product page filter facets and comparison matrices.
        </p>
      </div>
    </div>
  );
}

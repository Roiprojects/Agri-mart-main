import Link from 'next/link';

export default function BackendGatewayPage() {
  const portals = [
    {
      title: 'Super Admin Command Center',
      href: '/admin',
      desc: 'Master product catalogue, live orders, customer directory, and system audit logs.',
      icon: '🛡️',
      color: 'border-emerald-200 hover:border-emerald-500 bg-white hover:bg-emerald-50/20',
      badge: 'Admin Panel',
    },
    {
      title: 'Dark Warehouse Fulfillment',
      href: '/warehouse',
      desc: 'Multi-hub inventory ledger, proximity allocation, packing slips, and carrier dispatch.',
      icon: '🏢',
      color: 'border-blue-200 hover:border-blue-500 bg-white hover:bg-blue-50/20',
      badge: 'Operations Hub',
    },
    {
      title: 'Procurement & Agronomy Tracker',
      href: '/procurement',
      desc: '7-stage farmer crop cycles, input logs, and scheduled agronomist follow-up advisory.',
      icon: '🌾',
      color: 'border-amber-200 hover:border-amber-500 bg-white hover:bg-amber-50/20',
      badge: 'Agronomy',
    },
    {
      title: 'Sales CRM & Field Visits',
      href: '/sales',
      desc: '8-stage lead pipeline, sales quotas, quotation generator, and GPS farm visit records.',
      icon: '💼',
      color: 'border-purple-200 hover:border-purple-500 bg-white hover:bg-purple-50/20',
      badge: 'Sales CRM',
    },
    {
      title: 'Workshop Repairs & Services',
      href: '/repairs',
      desc: '9-stage job card workflow, multi-complaint intake, spare parts debit, QC sign-off, and GST tax invoice.',
      icon: '🛠️',
      color: 'border-rose-200 hover:border-rose-500 bg-white hover:bg-rose-50/20',
      badge: 'Service Workshop',
    },
    {
      title: 'Finance Incentive Commission Portal',
      href: '/finance',
      desc: 'Dealer commission tiers, net delivered sales reconciliation, return clawbacks, and payout vouchers.',
      icon: '💰',
      color: 'border-teal-200 hover:border-teal-500 bg-white hover:bg-teal-50/20',
      badge: 'Finance Desk',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAF8] p-6 md:p-12 text-slate-800 flex flex-col justify-between">
      <div className="max-w-6xl mx-auto w-full">
        <header className="mb-10 pb-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌱</span>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
                AGRI MART MEGA — Operations & API Backend
              </h1>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              GreenShield Industries Karnataka · Ref No: 2026-27/P163 · Port 3001
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              API SERVER ACTIVE
            </span>
            <Link
              href="http://localhost:3000"
              target="_blank"
              className="px-4 py-2 bg-white hover:bg-slate-50 text-xs font-medium rounded-lg transition border border-slate-300 text-slate-700 shadow-sm"
            >
              Open Customer Website ↗
            </Link>
          </div>
        </header>

        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Enterprise Operations Portals</h2>
            <span className="text-xs text-slate-500">6 Authenticated Portals</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portals.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className={`p-6 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between ${p.color}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-3xl">{p.icon}</div>
                    <span className="text-[11px] font-medium text-slate-500 px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200">
                      {p.badge}
                    </span>
                  </div>
                  <h3 className="font-semibold text-slate-900 text-lg">{p.title}</h3>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">{p.desc}</p>
                </div>
                <div className="mt-6 flex items-center text-xs font-semibold text-emerald-700">
                  <span>Enter Portal</span>
                  <span className="ml-1">→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-slate-900">System Diagnostics & Active Integrations</h3>
              <p className="text-xs text-slate-500 mt-1">
                Real-time status of Razorpay, GoKwik, UIDAI, MSG91, Meta WhatsApp Cloud API, and VRL Logistics.
              </p>
            </div>
            <Link
              href="/api/integrations/diagnostics"
              target="_blank"
              className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-xs font-mono rounded-lg border border-slate-200 text-slate-700 self-start md:self-auto"
            >
              GET /api/integrations/diagnostics ↗
            </Link>
          </div>
        </section>
      </div>

      <footer className="max-w-6xl mx-auto w-full pt-6 border-t border-slate-200 text-xs text-slate-500 text-center flex flex-col md:flex-row justify-between gap-2">
        <span>© 2026 GreenShield Industries Pvt Ltd. All operational rights reserved.</span>
        <span>Standalone API & Operations Gateway (Port 3001)</span>
      </footer>
    </div>
  );
}

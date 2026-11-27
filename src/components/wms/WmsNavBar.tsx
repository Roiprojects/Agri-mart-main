'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Users,
  Package,
  ArrowLeftRight,
  Inbox,
  ShoppingBag,
  Truck,
  AlertTriangle,
} from 'lucide-react';
import { useWmsContext } from './WmsContext';
import { WmsBadge } from './WmsBadge';

interface NavModule {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  countKey?: 'incoming' | 'ordersDispatch' | 'deliveries' | 'exceptions';
}

const NAV_MODULES: NavModule[] = [
  {
    id: 'locations',
    label: '01. Locations & Access',
    href: '/warehouse/locations',
    icon: Users,
  },
  {
    id: 'stock',
    label: '02. Stock & Availability',
    href: '/warehouse/stock',
    icon: Package,
  },
  {
    id: 'transfers',
    label: '03–04. Stock Transfers & Challans',
    href: '/warehouse/transfers',
    icon: ArrowLeftRight,
  },
  {
    id: 'incoming',
    label: '05. Incoming',
    href: '/warehouse/incoming',
    icon: Inbox,
    countKey: 'incoming',
  },
  {
    id: 'orders',
    label: '06–07. Orders → Dispatch',
    href: '/warehouse/orders',
    icon: ShoppingBag,
    countKey: 'ordersDispatch',
  },
  {
    id: 'deliveries',
    label: '08. My Deliveries',
    href: '/warehouse/deliveries',
    icon: Truck,
    countKey: 'deliveries',
  },
  {
    id: 'exceptions',
    label: '10. Exceptions & Returns',
    href: '/warehouse/exceptions',
    icon: AlertTriangle,
    countKey: 'exceptions',
  },
];

export function WmsNavBar() {
  const pathname = usePathname();
  const { counts, loading } = useWmsContext();

  return (
    <nav
      aria-label="Warehouse Management Modules"
      className="border-b border-slate-800 pb-3 overflow-x-auto"
    >
      <div className="flex flex-wrap items-center gap-2 min-w-max sm:min-w-0">
        {NAV_MODULES.map((mod) => {
          const Icon = mod.icon;
          const isActive =
            pathname === mod.href || pathname.startsWith(`${mod.href}/`);
          const count = mod.countKey ? counts[mod.countKey] : undefined;

          return (
            <Link
              key={mod.id}
              href={mod.href}
              aria-current={isActive ? 'page' : undefined}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm border border-emerald-500/40'
                  : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{mod.label}</span>
              {count !== undefined && (
                <WmsBadge count={loading ? 0 : count} active={isActive} />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

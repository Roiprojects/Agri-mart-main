'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Bell, RefreshCw, Users } from 'lucide-react';
import { clsx } from 'clsx';

interface AdminTopbarProps {
  onMobileMenuOpen: () => void;
}

function getBreadcrumb(pathname: string): { label: string; href?: string }[] {
  const segments = pathname.split('/').filter(Boolean);
  const crumbs: { label: string; href?: string }[] = [];
  let path = '';
  for (const seg of segments) {
    path += `/${seg}`;
    const label = seg
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
    crumbs.push({ label, href: path });
  }
  return crumbs;
}

export function AdminTopbar({ onMobileMenuOpen }: AdminTopbarProps) {
  const pathname = usePathname();
  const crumbs = getBreadcrumb(pathname);

  return (
    <header className="flex h-14 flex-shrink-0 items-center gap-4 border-b border-slate-200 bg-white px-4 shadow-xs">
      {/* Mobile menu toggle */}
      <button
        onClick={onMobileMenuOpen}
        className="lg:hidden rounded-lg p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-sm min-w-0">
        {crumbs.map((crumb, i) => (
          <span key={crumb.href} className="flex items-center gap-1.5 min-w-0">
            {i > 0 && <span className="text-slate-300">/</span>}
            <span
              className={clsx(
                'truncate text-xs',
                i === crumbs.length - 1 ? 'text-slate-900 font-semibold' : 'text-slate-500'
              )}
            >
              {crumb.label}
            </span>
          </span>
        ))}
      </nav>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-2">
        <Link
          href="/admin/staff"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition"
        >
          <Users className="h-3.5 w-3.5" />
          <span>Staff</span>
        </Link>
        <button
          onClick={() => window.location.reload()}
          title="Refresh page"
          className="rounded-lg p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
        <button
          title="Notifications"
          className="rounded-lg p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
        >
          <Bell className="h-4 w-4" />
        </button>
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white shadow-xs">
          A
        </div>
      </div>
    </header>
  );
}

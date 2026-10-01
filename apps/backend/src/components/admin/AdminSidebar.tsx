'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Tag,
  Award,
  Star,
  Sliders,
  ShoppingCart,
  CalendarDays,
  Wrench,
  Users,
  Ticket,
  Percent,
  FileText,
  Image,
  MessageSquare,
  Settings,
  Warehouse,
  Plug,
  BarChart3,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Leaf,
  ExternalLink,
  X,
} from 'lucide-react';
import { clsx } from 'clsx';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

const navTree: NavGroup[] = [
  {
    group: 'Overview',
    items: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    ],
  },
  {
    group: 'Catalog',
    items: [
      { label: 'Products', href: '/admin/catalogue/products', icon: Package },
      { label: 'Categories', href: '/admin/catalogue/categories', icon: Tag },
      { label: 'Manufacturers', href: '/admin/catalogue/manufacturers', icon: Award },
      { label: 'Product reviews', href: '/admin/catalogue/reviews', icon: Star },
      { label: 'Attributes', href: '/admin/catalogue/attributes', icon: Sliders },
    ],
  },
  {
    group: 'Sales',
    items: [
      { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
      { label: 'Rentals', href: '/admin/rentals', icon: CalendarDays },
      { label: 'Services', href: '/admin/services', icon: Wrench },
    ],
  },
  {
    group: 'Customers',
    items: [
      { label: 'Customer List', href: '/admin/customers', icon: Users },
    ],
  },
  {
    group: 'Promotions',
    items: [
      { label: 'Coupons', href: '/admin/promotions/coupons', icon: Ticket },
      { label: 'Discounts', href: '/admin/promotions/discounts', icon: Percent },
    ],
  },
  {
    group: 'Content',
    items: [
      { label: 'Blog Posts', href: '/admin/content/blog', icon: FileText },
      { label: 'Gallery', href: '/admin/content/gallery', icon: Image },
      { label: 'Blog Reviews', href: '/admin/content/reviews', icon: MessageSquare },
    ],
  },
  {
    group: 'Configuration',
    items: [
      { label: 'Site Settings', href: '/admin/configuration/settings', icon: Settings },
      { label: 'Warehouses', href: '/admin/configuration/warehouses', icon: Warehouse },
      { label: 'Integrations', href: '/admin/configuration/integrations', icon: Plug },
    ],
  },
  {
    group: 'Reports',
    items: [
      { label: 'Sales Report', href: '/admin/reports/sales', icon: BarChart3 },
      { label: 'Low Stock', href: '/admin/reports/low-stock', icon: AlertTriangle },
    ],
  },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

function NavItemLink({ item, collapsed, pathname }: { item: NavItem; collapsed: boolean; pathname: string }) {
  const isActive =
    item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      className={clsx(
        'flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors',
        isActive
          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-semibold shadow-xs'
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
      )}
    >
      <Icon className={clsx('h-4 w-4 flex-shrink-0', isActive ? 'text-emerald-700' : 'text-slate-500')} />
      {!collapsed && <span className="truncate">{item.label}</span>}
      {!collapsed && item.badge && (
        <span className="ml-auto rounded-full bg-emerald-600 px-1.5 py-0.5 text-xs text-white leading-none">
          {item.badge}
        </span>
      )}
    </Link>
  );
}

export function AdminSidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const sidebarContent = (
    <div className="flex h-full flex-col bg-white">
      {/* Logo */}
      <div className={clsx(
        'flex h-14 items-center border-b border-slate-200 flex-shrink-0',
        collapsed ? 'justify-center px-2' : 'gap-3 px-4'
      )}>
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-600 shadow-sm">
          <Leaf className="h-4 w-4 text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-900 leading-tight truncate">AGRI MART MEGA</p>
            <p className="text-[10px] text-slate-500 leading-tight">Admin Operations</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
        {navTree.map((group) => (
          <div key={group.group}>
            {!collapsed && (
              <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                {group.group}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavItemLink key={item.href} item={item} collapsed={collapsed} pathname={pathname} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="flex-shrink-0 border-t border-slate-200 p-2 space-y-1 bg-slate-50/50">
        <Link
          href="http://localhost:3000"
          target="_blank"
          title={collapsed ? 'Customer Website' : undefined}
          className="flex items-center gap-3 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <ExternalLink className="h-4 w-4 flex-shrink-0 text-slate-400" />
          {!collapsed && <span>Customer Website ↗</span>}
        </Link>
        <Link
          href="/"
          title={collapsed ? 'Backend Gateway' : undefined}
          className="flex items-center gap-3 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <Settings className="h-4 w-4 flex-shrink-0 text-slate-400" />
          {!collapsed && <span>Backend Gateway</span>}
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={clsx(
          'hidden lg:flex flex-col flex-shrink-0 bg-white border-r border-slate-200 transition-all duration-300 relative shadow-sm',
          collapsed ? 'w-14' : 'w-56'
        )}
      >
        {sidebarContent}
        {/* Collapse toggle button */}
        <button
          onClick={onToggle}
          className="absolute -right-3 top-16 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 shadow-sm"
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
            onClick={onMobileClose}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 lg:hidden flex flex-col shadow-xl">
            <div className="flex h-14 items-center justify-between px-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600">
                  <Leaf className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-tight">AGRI MART MEGA</p>
                  <p className="text-[10px] text-slate-500 leading-tight">Admin Operations</p>
                </div>
              </div>
              <button onClick={onMobileClose} className="text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
              {navTree.map((group) => (
                <div key={group.group}>
                  <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    {group.group}
                  </p>
                  <div className="space-y-0.5">
                    {group.items.map((item) => (
                      <NavItemLink key={item.href} item={item} collapsed={false} pathname={pathname} />
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </aside>
        </>
      )}
    </>
  );
}

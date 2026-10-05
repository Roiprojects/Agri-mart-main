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
  ChevronDown,
  CircleDot,
  Circle,
  Leaf,
  ExternalLink,
  X,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';

function CubesIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 512 512"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M488.6 250.4L392 189.7V105.8c0-11.3-6.4-21.7-16.6-26.8L270.6 24.3c-9.1-4.6-19.8-4.6-28.9 0L136.6 79c-10.2 5.1-16.6 15.5-16.6 26.8v83.9L23.4 250.4c-9.6 6-15.4 16.5-15.4 27.8v105c0 11.3 6.4 21.7 16.6 26.8l104.8 54.7c9.1 4.6 19.8 4.6 28.9 0l77.7-40.6v.1l20 10.4c9.1 4.6 19.8 4.6 28.9 0l104.8-54.7c10.2-5.1 16.6-15.5 16.6-26.8v-105c0-11.3-5.8-21.8-15.4-27.8zM256 52.8l100.9 52.6L256 166 155.1 105.4 256 52.8zm-116 83.2v72.1l-89.9-56.7L140 136zm0 102.5v94.1l-90.1-47v-94.2l90.1 47.1zm20 157.9l-89.9-46.9 89.9-56.7v103.6zm18.3-125.6l97.7-61.6 97.7 61.6-97.7 51-97.7-51zm97.7 172.9l-89.9-46.9v-94.2l89.9 46.9v94.2zm20-103.6v-94.2l89.9-46.9v94.2l-89.9 46.9zm116-22.3l-89.9 46.9v-72.1l89.9-56.7v81.9z" />
    </svg>
  );
}

interface NavSubItem {
  label: string;
  href: string;
  icon?: React.ElementType;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  children?: NavSubItem[];
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
      { label: 'Product tags', href: '/admin/catalogue/tags', icon: Tag },
      {
        label: 'Attributes',
        href: '/admin/catalogue/attributes',
        icon: CircleDot,
        children: [
          { label: 'Product attributes', href: '/admin/catalogue/attributes/product', icon: Circle },
          { label: 'Specification attributes', href: '/admin/catalogue/attributes/specification', icon: Circle },
          { label: 'Checkout attributes', href: '/admin/catalogue/attributes/checkout', icon: Circle },
        ],
      },
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
      {
        label: 'Promotions',
        href: '/admin/promotions',
        icon: Tag,
        children: [
          { label: 'Discounts', href: '/admin/promotions/discounts', icon: CircleDot },
          { label: 'Affiliates', href: '/admin/promotions/affiliates', icon: CircleDot },
          { label: 'Campaigns', href: '/admin/promotions/campaigns', icon: CircleDot },
        ],
      },
    ],
  },
  {
    group: 'Content management',
    items: [
      {
        label: 'Content management',
        href: '/admin/content',
        icon: CubesIcon,
        children: [
          { label: 'Topics (pages)', href: '/admin/content/topics', icon: CircleDot },
          { label: 'Message templates', href: '/admin/content/message-templates', icon: CircleDot },
          { label: 'News items', href: '/admin/content/news', icon: CircleDot },
          { label: 'News comments', href: '/admin/content/news-comments', icon: CircleDot },
          { label: 'Blog posts', href: '/admin/content/blog', icon: CircleDot },
          { label: 'Blog comments', href: '/admin/content/blog-comments', icon: CircleDot },
          { label: 'Polls', href: '/admin/content/polls', icon: CircleDot },
          { label: 'Forums', href: '/admin/content/forums', icon: CircleDot },
        ],
      },
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
  const isChildActive = item.children?.some((c) => pathname === c.href || pathname.startsWith(c.href));
  const isParentActive =
    item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href) || !!isChildActive;

  const [isOpen, setIsOpen] = useState(
    item.children
      ? isParentActive ||
        item.label === 'Attributes' ||
        item.label === 'Promotions' ||
        item.label === 'Content management'
      : false
  );

  useEffect(() => {
    if (isParentActive) {
      setIsOpen(true);
    }
  }, [isParentActive]);

  const Icon = item.icon;

  if (item.children && item.children.length > 0) {
    return (
      <div className="space-y-0.5">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          title={collapsed ? item.label : undefined}
          className={clsx(
            'w-full flex items-center justify-between rounded-lg px-2.5 py-2 text-sm font-medium transition-colors text-left cursor-pointer',
            isParentActive
              ? 'text-slate-900 font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
          )}
        >
          <div className="flex items-center gap-3 min-w-0">
            <Icon
              className={clsx(
                'h-4 w-4 flex-shrink-0',
                isParentActive ? 'text-emerald-700' : 'text-slate-500'
              )}
            />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </div>
          {!collapsed && (
            <ChevronDown
              className={clsx(
                'h-3.5 w-3.5 text-slate-400 transition-transform duration-200 stroke-[2.5]',
                isOpen ? 'rotate-0' : '-rotate-90'
              )}
            />
          )}
        </button>

        {/* Children sub-menu matching media_1791006594469.png */}
        {!collapsed && isOpen && (
          <div className="pl-6 space-y-0.5 mt-0.5">
            {item.children.map((child) => {
              const isSelected = pathname === child.href || pathname.startsWith(child.href);
              const ChildIcon = child.icon || Circle;
              return (
                <Link
                  key={child.href}
                  href={child.href}
                  className={clsx(
                    'flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-xs transition-colors',
                    isSelected
                      ? 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200/80 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  )}
                >
                  <ChildIcon
                    className={clsx(
                      'h-3 w-3 flex-shrink-0 stroke-[2.5]',
                      isSelected ? 'text-emerald-700' : 'text-slate-400'
                    )}
                  />
                  <span className="truncate">{child.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      className={clsx(
        'flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors',
        isParentActive
          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-semibold shadow-xs'
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
      )}
    >
      <Icon className={clsx('h-4 w-4 flex-shrink-0', isParentActive ? 'text-emerald-700' : 'text-slate-500')} />
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
        {navTree.map((group) => {
          const isSingleSelfNamed =
            group.items.length === 1 &&
            group.items[0].label.toLowerCase() === group.group.toLowerCase();

          return (
            <div key={group.group}>
              {!collapsed && !isSingleSelfNamed && (
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
          );
        })}
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

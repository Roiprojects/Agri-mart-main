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
  Coins,
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

// Exact FontAwesome fa-cogs (twin gears) from media_1791201213297.png
function FaCogsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 640 512" fill="currentColor" className={className} aria-hidden="true">
      <path d="M512.1 192l-14.9-1.3c-2.8-9.4-6.8-18.4-11.8-26.8l8.9-12.1c4.5-6.1 3.8-14.6-1.7-19.9l-22.6-22.6c-5.3-5.3-13.8-6.1-19.9-1.7l-12.1 8.9c-8.4-5-17.4-9-26.8-11.8L420 89.9c-1.4-7.5-7.9-13-15.5-13h-32c-7.6 0-14.1 5.5-15.5 13l-1.3 14.9c-9.4 2.8-18.4 6.8-26.8 11.8l-12.1-8.9c-6.1-4.5-14.6-3.8-19.9 1.7l-22.6 22.6c-5.3 5.3-6.1 13.8-1.7 19.9l8.9 12.1c-5 8.4-9 17.4-11.8 26.8L274.9 192c-7.5 1.4-13 7.9-13 15.5v32c0 7.6 5.5 14.1 13 15.5l14.9 1.3c2.8 9.4 6.8 18.4 11.8 26.8l-8.9 12.1c-4.5 6.1-3.8 14.6 1.7 19.9l22.6 22.6c5.3 5.3 13.8 6.1 19.9 1.7l12.1-8.9c8.4 5 17.4 9 26.8 11.8l1.3 14.9c1.4 7.5 7.9 13 15.5 13h32c7.6 0 14.1-5.5 15.5-13l1.3-14.9c9.4-2.8 18.4-6.8 26.8-11.8l12.1 8.9c6.1 4.5 14.6 3.8 19.9-1.7l22.6-22.6c5.3-5.3 6.1-13.8 1.7-19.9l-8.9-12.1c5-8.4 9-17.4 11.8-26.8l14.9-1.3c7.5-1.4 13-7.9 13-15.5v-32c0-7.6-5.5-14.1-13-15.5zm-120.1 56c-22.1 0-40-17.9-40-40s17.9-40 40-40 40 17.9 40 40-17.9 40-40 40zM256 304l-11.2-1c-2.1-7.1-5.1-13.8-8.9-20.1l6.7-9.1c3.4-4.6 2.9-11-1.3-15l-17-17c-4-4-10.4-4.6-15-1.3l-9.1 6.7c-6.3-3.8-13-6.8-20.1-8.9L179 227.2c-1.1-5.6-5.9-9.8-11.6-9.8h-24c-5.7 0-10.6 4.1-11.6 9.8l-1 11.2c-7.1 2.1-13.8 5.1-20.1 8.9l-9.1-6.7c-4.6-3.4-11-2.9-15 1.3l-17 17c-4 4-4.6 10.4-1.3 15l6.7 9.1c-3.8 6.3-6.8 13-8.9 20.1L55.2 304c-5.6 1.1-9.8 5.9-9.8 11.6v24c0 5.7 4.1 10.6 9.8 11.6l11.2 1c2.1 7.1 5.1 13.8 8.9 20.1l-6.7 9.1c-3.4 4.6-2.9 11 1.3 15l17 17c4 4 10.4 4.6 15 1.3l9.1-6.7c6.3 3.8 13 6.8 20.1 8.9l1 11.2c1.1 5.6 5.9 9.8 11.6 9.8h24c5.7 0 10.6-4.1 11.6-9.8l1-11.2c7.1-2.1 13.8-5.1 20.1-8.9l9.1 6.7c4.6 3.4 11 2.9 15-1.3l17-17c4-4 4.6-10.4 1.3-15l-6.7-9.1c3.8-6.3 6.8-13 8.9-20.1l11.2-1c5.6-1.1 9.8-5.9 9.8-11.6v-24c0-5.7-4.1-10.6-9.8-11.6zm-90.1 42c-16.6 0-30-13.4-30-30s13.4-30 30-30 30 13.4 30 30-13.4 30-30 30z" />
    </svg>
  );
}

// Exact FontAwesome fa-dot-circle-o (bullseye dot circle) from media_1791201213297.png
function DotCircleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" fill="currentColor" className={className} aria-hidden="true">
      <path d="M256 504c137 0 248-111 248-248S393 8 256 8 8 119 8 256s111 248 248 248zm0-448c110.5 0 200 89.5 200 200s-89.5 200-200 200S56 366.5 56 256 145.5 56 256 56zm0 264c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64z" />
    </svg>
  );
}

interface NavSubItem {
  label: string;
  href: string;
  icon?: React.ElementType;
  hidden?: boolean;
  children?: NavSubItem[];
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
      { label: 'Staff', href: '/admin/staff', icon: Users },
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
    group: 'Customers & Staff',
    items: [
      { label: 'Customer List', href: '/admin/customers', icon: Users },
      { label: 'Staff', href: '/admin/staff', icon: Users },
    ],
  },
  {
    group: 'Operations & Portals',
    items: [
      { label: 'All Portals Control', href: '/admin/portals', icon: Sliders, badge: 'Master' },
      { label: 'Finance Portal', href: '/finance', icon: Coins },
      { label: 'Procurement & Agronomy', href: '/procurement', icon: Leaf },
      { label: 'Farmer POP Forms', href: '/procurement/pop-forms', icon: FileText },
      { label: 'Crop Guidance', href: '/procurement/crop-guidance', icon: Leaf },
      { label: 'Workshop & Repairs', href: '/repairs', icon: Wrench },
      { label: 'Field Sales CRM', href: '/sales', icon: Users },
      { label: 'Dark Warehouse & Stock', href: '/warehouse', icon: Warehouse },
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
          { label: 'Topics (pages)', href: '/admin/content/topics', icon: DotCircleIcon },
          { label: 'Message templates', href: '/admin/content/message-templates', icon: DotCircleIcon },
          { label: 'News items', href: '/admin/content/news', icon: DotCircleIcon },
          { label: 'News comments', href: '/admin/content/news-comments', icon: DotCircleIcon },
          { label: 'Blog posts', href: '/admin/content/blog', icon: DotCircleIcon },
          { label: 'Blog comments', href: '/admin/content/blog-comments', icon: DotCircleIcon },
          { label: 'Crop guidance', href: '/admin/content/crop-guidance', icon: DotCircleIcon },
          { label: 'Gallery', href: '/admin/content/gallery', icon: DotCircleIcon },
          { label: 'Polls', href: '/admin/content/polls', icon: DotCircleIcon, hidden: true },
          { label: 'Forums', href: '/admin/content/forums', icon: DotCircleIcon, hidden: true },
        ],
      },
    ],
  },
  {
    group: 'Configuration',
    items: [
      {
        label: 'Configuration',
        href: '/admin/configuration',
        icon: FaCogsIcon,
        children: [
          {
            label: 'Settings',
            href: '/admin/configuration/settings',
            icon: DotCircleIcon,
            children: [
              { label: 'General settings', href: '/admin/configuration/settings/general' },
              { label: 'Customer settings', href: '/admin/configuration/settings/customer' },
              { label: 'Order settings', href: '/admin/configuration/settings/order' },
              { label: 'Shipping settings', href: '/admin/configuration/settings/shipping' },
              { label: 'Tax settings', href: '/admin/configuration/settings/tax' },
              { label: 'Catalog settings', href: '/admin/configuration/settings/catalog' },
              { label: 'Filter (YMM) settings', href: '/admin/configuration/settings/filter-ymm' },
              { label: 'Shopping cart settings', href: '/admin/configuration/settings/shopping-cart' },
              { label: 'Reward points', href: '/admin/configuration/settings/reward-points' },
              { label: 'GDPR settings', href: '/admin/configuration/settings/gdpr' },
              { label: 'Vendor settings', href: '/admin/configuration/settings/vendor' },
              { label: 'Blog settings', href: '/admin/configuration/settings/blog' },
              { label: 'News settings', href: '/admin/configuration/settings/news' },
              { label: 'Forum settings', href: '/admin/configuration/settings/forum', hidden: true },
              { label: 'Media settings', href: '/admin/configuration/settings/media' },
              { label: 'Crop guidance settings', href: '/admin/configuration/settings/crop-guidance' },
              { label: 'Gallery settings', href: '/admin/configuration/settings/gallery' },
              { label: 'All settings (advanced)', href: '/admin/configuration/settings/all' },
            ],
          },
          { label: 'Countries', href: '/admin/configuration/countries', icon: DotCircleIcon },
          { label: 'Languages', href: '/admin/configuration/languages', icon: DotCircleIcon },
          { label: 'Tax providers', href: '/admin/configuration/tax-providers', icon: DotCircleIcon },
          { label: 'Tax categories', href: '/admin/configuration/tax-categories', icon: DotCircleIcon },
          {
            label: 'Shipping',
            href: '/admin/configuration/shipping',
            icon: DotCircleIcon,
            children: [
              { label: 'Shipping providers', href: '/admin/configuration/shipping/providers' },
              { label: 'Warehouses', href: '/admin/configuration/warehouses' },
              { label: 'Pickup points', href: '/admin/configuration/shipping/pickup-points' },
              { label: 'Dates and ranges', href: '/admin/configuration/shipping/dates-and-ranges' },
              { label: 'Measures', href: '/admin/configuration/shipping/measures' },
            ],
          },
          {
            label: 'Authentication',
            href: '/admin/configuration/authentication',
            icon: DotCircleIcon,
            children: [
              { label: 'External authentication methods', href: '/admin/configuration/authentication/external' },
            ],
          },
        ],
      },
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

// Sub-item renderer with support for 2nd-level dropdowns (Settings, Shipping, Authentication)
function NavSubItemRow({
  child,
  pathname,
}: {
  child: NavSubItem;
  pathname: string;
}) {
  const isChildActive = child.children?.some(
    (c) => pathname === c.href || pathname.startsWith(c.href)
  );
  const isDirectActive = pathname === child.href;
  const isSelected = isDirectActive || isChildActive;

  const [isOpen, setIsOpen] = useState(
    !!isChildActive || child.label === 'Settings'
  );

  useEffect(() => {
    if (isChildActive) {
      setIsOpen(true);
    }
  }, [isChildActive]);

  if (child.hidden) {
    return null;
  }

  const ChildIcon = child.icon || DotCircleIcon;

  if (child.children && child.children.length > 0) {
    return (
      <div className="space-y-0.5">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={clsx(
            'w-full flex items-center justify-between rounded-lg px-2 py-1.5 text-xs transition-colors text-left cursor-pointer select-none',
            isSelected
              ? 'text-slate-900 font-semibold bg-slate-100/80'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
          )}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <ChildIcon
              className={clsx(
                'h-3.5 w-3.5 flex-shrink-0',
                isSelected ? 'text-slate-800' : 'text-slate-400'
              )}
            />
            <span className="truncate">{child.label}</span>
          </div>
          {/* nopCommerce style angle icon: < when closed, v when open */}
          <ChevronLeft
            className={clsx(
              'h-3 w-3 text-slate-400 transition-transform duration-200 stroke-[2.5]',
              isOpen ? '-rotate-90' : 'rotate-0'
            )}
          />
        </button>

        {isOpen && (
          <div className="pl-5 space-y-0.5 mt-0.5 border-l-2 border-slate-200 ml-3.5">
            {child.children.map((subChild) => {
              if (subChild.hidden) return null;
              const isSubSelected =
                pathname === subChild.href ||
                (subChild.href === '/admin/configuration/settings/general' &&
                  pathname === '/admin/configuration/settings');

              return (
                <Link
                  key={subChild.href}
                  href={subChild.href}
                  className={clsx(
                    'flex items-center gap-2 rounded px-2 py-1.5 text-[11px] transition-colors',
                    isSubSelected
                      ? 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200/70 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  )}
                >
                  <span
                    className={clsx(
                      'w-1.5 h-1.5 rounded-full flex-shrink-0',
                      isSubSelected ? 'bg-emerald-600' : 'bg-slate-400'
                    )}
                  />
                  <span className="truncate">{subChild.label}</span>
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
          'h-3.5 w-3.5 flex-shrink-0',
          isSelected ? 'text-emerald-700' : 'text-slate-400'
        )}
      />
      <span className="truncate">{child.label}</span>
    </Link>
  );
}

function NavItemLink({ item, collapsed, pathname }: { item: NavItem; collapsed: boolean; pathname: string }) {
  const isChildActive = item.children?.some(
    (c) =>
      pathname === c.href ||
      pathname.startsWith(c.href) ||
      c.children?.some((sub) => pathname === sub.href || pathname.startsWith(sub.href))
  );

  const isParentActive =
    item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href) || !!isChildActive;

  const [isOpen, setIsOpen] = useState(
    item.children
      ? isParentActive ||
        item.label === 'Attributes' ||
        item.label === 'Promotions' ||
        item.label === 'Content management' ||
        item.label === 'Configuration'
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

        {/* Children sub-menu */}
        {!collapsed && isOpen && (
          <div className="pl-6 space-y-0.5 mt-0.5">
            {item.children.map((child) => (
              <NavSubItemRow
                key={child.href}
                child={child}
                pathname={pathname}
              />
            ))}
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
          href="/"
          title={collapsed ? 'Customer Website' : undefined}
          className="flex items-center gap-3 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <ExternalLink className="h-4 w-4 flex-shrink-0 text-slate-400" />
          {!collapsed && <span>Customer Website ↗</span>}
        </Link>
        <Link
          href="/operations-gateway"
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
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm hover:bg-slate-50 transition-colors z-10"
        >
          {collapsed ? (
            <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5 text-slate-600" />
          )}
        </button>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl lg:hidden transform transition-transform duration-300',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="absolute right-2 top-3">
          <button
            onClick={onMobileClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {sidebarContent}
      </aside>
    </>
  );
}

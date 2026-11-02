'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { SITE_CONFIG } from '@/lib/config';
import DeliveryLocationSelector from '@/components/layout/DeliveryLocationSelector';
import {
  Search,
  ShoppingCart,
  User,
  Heart,
  Phone,
  Sparkles,
  Wrench,
  Tractor,
  Sprout,
  Menu,
  X,
  Home,
  Image as ImageIcon,
  BookOpen,
  ClipboardList,
  ArrowRight,
} from 'lucide-react';
import { useShoppingCartSettings } from '@/lib/shopping-cart-settings';

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [logoFlipCount, setLogoFlipCount] = useState(0);
  const { settings: cartSettings } = useShoppingCartSettings();
  const [miniCartOpen, setMiniCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([
    {
      id: 'prod-001',
      name: 'AgriPro 7HP Heavy-Duty Multi-Speed Power Weeder',
      price: 36500,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'prod-003',
      name: 'Bhoomi Sanjivani Organic Micro-Nutrient Bio-Fertilizer (5 Kg)',
      price: 850,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=600&q=80',
    },
  ]);

  React.useEffect(() => {
    const updateItems = () => {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('agri_cart_items');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setCartItems(parsed);
            }
          } catch {}
        }
      }
    };
    updateItems();
    window.addEventListener('cartUpdated', updateItems);
    window.addEventListener('storage', updateItems);
    return () => {
      window.removeEventListener('cartUpdated', updateItems);
      window.removeEventListener('storage', updateItems);
    };
  }, []);

  const totalCartCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const displayedItems = cartItems.slice(0, cartSettings.miniShoppingCartProductNumber || 5);
  const miniCartSubtotal = cartItems.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = '/shop?q=' + encodeURIComponent(searchQuery.trim());
    }
  };

  const navLinks = [
    { label: 'Home', href: '/', exact: true, icon: Home },
    { label: 'Shop Products', href: '/shop' },
    { label: 'Rent Equipment', href: '/rentals', icon: Tractor },
    { label: 'Rent Services', href: '/services', icon: Wrench },
    { label: 'Package of Practice', href: '/package-of-practice', icon: ClipboardList },
    { label: 'Crop Guidance', href: '/crop-guidance', icon: Sprout },
    { label: 'Gallery', href: '/gallery', icon: ImageIcon },
    { label: 'Blogs', href: '/blog', icon: BookOpen },
    { label: 'About Us', href: '/about' },
    { label: 'Contact Us', href: '/contact', icon: Phone },
  ];

  const isActive = (href: string, exact?: boolean) => {
    if (exact || href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-agri-border shadow-subtle">
      {/* Top Bar: Toll-Free Helpline & Dealer Network */}
      <div className="bg-agri-cream border-b border-agri-border/70 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center space-x-3 text-agri-secondary">
            <span className="flex items-center gap-1.5 font-medium">
              <Phone className="w-3.5 h-3.5 text-agri-green" />
              <span>Toll-Free Farmer Helpline:</span>
              <strong className="text-agri-dark font-bold ml-0.5 tracking-wider">
                {SITE_CONFIG.tollFree}
              </strong>
            </span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="hidden sm:inline text-[11px] text-agri-secondary">
              A Flagship Digital Initiative by <strong className="text-agri-dark">{SITE_CONFIG.parentCompany}</strong>
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/dealers"
              className="hover:text-agri-green text-agri-secondary text-[11px] font-medium transition"
            >
              1,500+ Certified Dealers
            </Link>
          </div>
        </div>
      </div>

      {/* Main Bar: Logo, Location Selector, Prominent Search, Quick Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3 sm:gap-4">
          {/* Logo — Flips between English & Kannada logo every time user hovers */}
          <Link
            href="/"
            onMouseEnter={() => setLogoFlipCount((prev) => prev + 1)}
            className="flex-shrink-0 flex items-center py-1 group"
            style={{ perspective: '1000px' }}
            title="Hover to flip between English & Kannada Logo"
          >
            <div
              className="relative w-48 sm:w-56 md:w-64 h-12 sm:h-14 md:h-16 transition-transform duration-700 ease-in-out"
              style={{
                transformStyle: 'preserve-3d',
                transform: `rotateY(${logoFlipCount * 180}deg)`,
              }}
            >
              {/* Front Face: English Logo */}
              <div
                className="absolute inset-0 w-full h-full"
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
              >
                <Image
                  src="/images/agrimart_logo_en_transparent.png"
                  alt="AGRI MART MEGA - English Logo"
                  fill
                  sizes="(max-width: 640px) 192px, (max-width: 768px) 224px, 256px"
                  className="object-contain object-left"
                  priority
                />
              </div>

              {/* Back Face: Kannada Logo */}
              <div
                className="absolute inset-0 w-full h-full"
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                <Image
                  src="/images/agrimart_logo_kn_transparent.png"
                  alt="ಅಗ್ರಿ ಮಾರ್ಟ್ ಮೆಗಾ - Kannada Logo"
                  fill
                  sizes="(max-width: 640px) 192px, (max-width: 768px) 224px, 256px"
                  className="object-contain object-left"
                  priority
                />
              </div>
            </div>
          </Link>

          {/* Delivery Location / PIN Code Selector */}
          <div className="hidden lg:block shrink-0">
            <DeliveryLocationSelector />
          </div>

          {/* Prominent Search Bar */}
          <div className="flex-1 max-w-xl mx-1 sm:mx-2">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search farm equipment, seeds, bio-fertilizers, drone spraying..."
                className="w-full pl-10 pr-20 py-2.5 text-xs sm:text-sm rounded-full border border-agri-border bg-agri-cream/60 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-agri-green focus:border-agri-green focus:bg-white transition shadow-inner"
              />
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-agri-secondary" />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 bg-agri-green hover:bg-agri-green-dark text-white text-xs font-bold px-3 sm:px-4 rounded-full transition shadow-xs"
              >
                Search
              </button>
            </form>
          </div>

          {/* User Actions: AI Advisor, Wishlist, Account, Cart */}
          <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
            {/* AI Crop Doctor / AI Farm Assistant Button (Hidden for now) */}
            {/* 
            <Link
              href="/ai-advisory"
              className="hidden xl:inline-flex items-center gap-1.5 bg-agri-yellow hover:bg-amber-400 text-agri-dark font-extrabold text-xs px-3 py-2 rounded-xl shadow-xs transition focus-ring"
            >
              <Sparkles className="w-3.5 h-3.5 text-agri-dark" />
              <span>AI Crop Doctor</span>
            </Link>
            */}

            {/* Wishlist Link */}
            <Link
              href="/account/wishlist"
              className="p-2 text-agri-dark hover:text-red-600 hover:bg-agri-cream rounded-xl transition focus-ring relative"
              title="Saved Items / Wishlist"
            >
              <Heart className="w-5 h-5" />
            </Link>

            {/* Account / Login Link */}
            <Link
              href="/login"
              className="p-2 text-agri-dark hover:text-agri-green hover:bg-agri-cream rounded-xl transition focus-ring"
              title="Farmer & Customer Account"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Cart Link with Badge & Mini-Shopping Cart */}
            <div
              className="relative"
              onMouseEnter={() => cartSettings.miniShoppingCartEnabled && setMiniCartOpen(true)}
              onMouseLeave={() => setMiniCartOpen(false)}
            >
              <Link
                href="/cart"
                onClick={() => setMiniCartOpen(false)}
                className="relative p-2 text-agri-dark hover:text-agri-green hover:bg-agri-cream rounded-xl transition focus-ring block"
                title="Shopping Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalCartCount > 0 && (
                  <span className="absolute top-1 right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold text-white bg-agri-green rounded-full shadow-xs">
                    {totalCartCount}
                  </span>
                )}
              </Link>

              {/* Mini-Shopping Cart Dropdown (nopCommerce MiniShoppingCartEnabled setting) */}
              {cartSettings.miniShoppingCartEnabled && miniCartOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="font-extrabold text-xs text-slate-800">
                      Shopping Cart ({totalCartCount} {totalCartCount === 1 ? 'item' : 'items'})
                    </span>
                    <Link
                      href="/cart"
                      onClick={() => setMiniCartOpen(false)}
                      className="text-[11px] font-bold text-agri-green hover:underline"
                    >
                      View Cart
                    </Link>
                  </div>

                  {displayedItems.length > 0 ? (
                    <>
                      <div className="max-h-60 overflow-y-auto space-y-2 divide-y divide-slate-100 pr-1">
                        {displayedItems.map((item, idx) => (
                          <div key={item.id || idx} className="pt-2 first:pt-0 flex items-center gap-3">
                            {cartSettings.showProductImagesInMiniShoppingCart && (
                              <div className="relative w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                                <Image
                                  src={item.image || 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80'}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0 text-left">
                              <div className="font-bold text-xs text-slate-900 truncate">{item.name}</div>
                              <div className="text-[11px] text-slate-500">
                                {item.quantity || 1} × <span className="font-bold text-slate-800">₹{(item.price || 0).toLocaleString('en-IN')}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {cartItems.length > (cartSettings.miniShoppingCartProductNumber || 5) && (
                        <div className="text-[10px] text-center text-slate-400">
                          + {cartItems.length - (cartSettings.miniShoppingCartProductNumber || 5)} more items in cart
                        </div>
                      )}

                      <div className="border-t border-slate-100 pt-2 flex items-center justify-between">
                        <span className="text-xs text-slate-600 font-medium">Subtotal:</span>
                        <span className="text-sm font-black text-slate-950">₹{miniCartSubtotal.toLocaleString('en-IN')}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <Link
                          href="/cart"
                          onClick={() => setMiniCartOpen(false)}
                          className="py-2 text-center text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                        >
                          View Cart
                        </Link>
                        <Link
                          href="/checkout"
                          onClick={() => setMiniCartOpen(false)}
                          className="py-2 text-center text-xs font-bold text-white bg-agri-green hover:bg-agri-green-dark rounded-xl transition flex items-center justify-center gap-1"
                        >
                          <span>Checkout</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </>
                  ) : (
                    <div className="py-6 text-center text-slate-400 text-xs">
                      Your shopping cart is empty.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-agri-dark hover:text-agri-green focus-ring rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Desktop Navigation Bar - Full Width, Sleek & Animated, 10% Reduced */}
      <div className="hidden md:block w-full border-t border-b border-agri-border/70 bg-white/95 backdrop-blur-xs shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
        <div className="w-full px-3 sm:px-5 lg:px-7 xl:px-9">
          <nav className="flex items-center justify-between w-full h-[50px] lg:h-[52px] text-[11.5px] lg:text-[12px] xl:text-[12.5px] 2xl:text-[13px] font-bold uppercase tracking-wide no-scrollbar">
            <div className="flex items-center justify-between flex-1 gap-0.5 sm:gap-1 lg:gap-1.5 xl:gap-2 mr-2">
              {navLinks.map((item) => {
                const active = isActive(item.href, item.exact);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch={true}
                    className={`group relative flex items-center gap-1.5 h-[50px] lg:h-[52px] px-1 sm:px-1.5 lg:px-2 xl:px-2.5 transition-colors duration-200 shrink-0 select-none ${
                      active
                        ? 'text-agri-green font-extrabold'
                        : 'text-black hover:text-agri-green font-bold'
                    }`}
                  >
                    {Icon && (
                      <Icon
                        className={`w-3.5 h-3.5 lg:w-4 lg:h-4 transition-all duration-200 shrink-0 ${
                          active
                            ? 'text-agri-green scale-105'
                            : 'text-black group-hover:text-agri-green group-hover:-translate-y-0.5 group-hover:scale-110'
                        }`}
                      />
                    )}
                    <span className="whitespace-nowrap">{item.label}</span>

                    {/* Smooth animated expanding underline */}
                    <span
                      className={`absolute bottom-0 left-1 right-1 h-[2.5px] rounded-full bg-agri-green transition-all duration-300 ease-out origin-center ${
                        active
                          ? 'opacity-100 scale-x-100'
                          : 'opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100'
                      }`}
                    />
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-agri-border px-4 pt-4 pb-6 space-y-4 animate-fadeIn">
          {/* Mobile Delivery PIN selector */}
          <div className="border-b border-agri-border/60 pb-3">
            <DeliveryLocationSelector />
          </div>

          <div className="flex flex-col space-y-1.5 text-sm font-semibold text-agri-dark">
            {navLinks.map((item) => {
              const active = isActive(item.href, item.exact);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-1.5 px-2.5 rounded-lg flex items-center gap-2.5 transition ${
                    active
                      ? 'text-brand-green bg-emerald-50 font-bold'
                      : 'hover:text-brand-green hover:bg-slate-50'
                  }`}
                >
                  {Icon ? (
                    <Icon className="w-4 h-4 text-brand-green" />
                  ) : (
                    <span className="w-4 h-4 inline-block" />
                  )}
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="border-t border-slate-100 pt-2 space-y-1.5">
              <Link
                href="/account/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 px-2.5 hover:text-agri-green flex items-center gap-2.5"
              >
                <Heart className="w-4 h-4 text-red-500" />
                <span>Saved Items (Wishlist)</span>
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 px-2.5 text-agri-green font-bold flex items-center gap-2.5"
              >
                <User className="w-4 h-4" />
                <span>Sign In / My Account</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

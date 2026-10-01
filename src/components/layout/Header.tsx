'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SITE_CONFIG } from '@/lib/config';
import DeliveryLocationSelector from '@/components/layout/DeliveryLocationSelector';
import {
  Search,
  ShoppingCart,
  User,
  Heart,
  Phone,
  Sparkles,
  Layers,
  Wrench,
  Tractor,
  Warehouse,
  TrendingUp,
  Sprout,
  Menu,
  X,
  Languages,
  ChevronDown,
  ClipboardList,
} from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [portalsDropdown, setPortalsDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = '/shop?q=' + encodeURIComponent(searchQuery.trim());
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-agri-border shadow-subtle">
      {/* Top Bar: Toll-Free Helpline & Certified Dealers */}
      <div className="bg-agri-cream border-b border-agri-border/70 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center space-x-3 text-agri-secondary">
            <span className="flex items-center gap-1.5 font-medium">
              <Phone className="w-3.5 h-3.5 text-agri-green" />
              <span>Toll-Free Kisan Helpline:</span>
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
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center py-1 group">
            <div className="relative w-48 sm:w-56 md:w-64 h-12 sm:h-14 md:h-16 transition-transform duration-200 group-hover:scale-[1.01]">
              <Image
                src="/images/agrimart_logo_en_transparent.png"
                alt="AGRI MART MEGA"
                fill
                sizes="(max-width: 640px) 192px, (max-width: 768px) 224px, 256px"
                className="object-contain object-left"
                priority
              />
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

          {/* User Actions: AI Advisor, Portals, Wishlist, Account, Cart */}
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

            {/* Stakeholder Portals Dropdown */}
            <div className="relative inline-block text-left">
              <button
                onClick={() => setPortalsDropdown(!portalsDropdown)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-agri-dark hover:text-agri-green border border-agri-border px-2.5 py-2 rounded-xl bg-white hover:bg-agri-cream transition focus-ring"
              >
                <Layers className="w-4 h-4 text-agri-green" />
                <span className="hidden md:inline">Portals</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {portalsDropdown && (
                <div
                  className="absolute right-0 mt-2 w-64 rounded-2xl shadow-hover bg-white border border-agri-border z-50 divide-y divide-agri-border/60 animate-fadeIn"
                  onMouseLeave={() => setPortalsDropdown(false)}
                >
                  <div className="p-3 bg-agri-cream/80 rounded-t-2xl text-[11px] font-bold text-agri-secondary uppercase tracking-wider">
                    Operational Portals
                  </div>
                  <div className="py-1 text-xs">
                    <Link
                      href="/warehouse"
                      onClick={() => setPortalsDropdown(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-agri-dark hover:bg-agri-pale hover:text-agri-green-dark transition"
                    >
                      <Warehouse className="w-4 h-4 text-agri-green" />
                      <div>
                        <div className="font-bold">Warehouse Portal</div>
                        <div className="text-[10px] text-agri-secondary">Haversine 40-60km routing</div>
                      </div>
                    </Link>

                    <Link
                      href="/procurement"
                      onClick={() => setPortalsDropdown(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-agri-dark hover:bg-agri-pale hover:text-agri-green-dark transition"
                    >
                      <Sprout className="w-4 h-4 text-agri-green" />
                      <div>
                        <div className="font-bold">Procurement Portal</div>
                        <div className="text-[10px] text-agri-secondary">7-Stage crop lifecycle</div>
                      </div>
                    </Link>

                    <Link
                      href="/sales"
                      onClick={() => setPortalsDropdown(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-agri-dark hover:bg-agri-pale hover:text-agri-green-dark transition"
                    >
                      <TrendingUp className="w-4 h-4 text-agri-green" />
                      <div>
                        <div className="font-bold">Sales CRM Portal</div>
                        <div className="text-[10px] text-agri-secondary">8-Stage lead pipeline</div>
                      </div>
                    </Link>

                    <Link
                      href="/repairs"
                      onClick={() => setPortalsDropdown(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-agri-dark hover:bg-agri-pale hover:text-agri-green-dark transition"
                    >
                      <Wrench className="w-4 h-4 text-agri-green" />
                      <div>
                        <div className="font-bold">Repairs & Workshop</div>
                        <div className="text-[10px] text-agri-secondary">9-Stage automotive repair job cards</div>
                      </div>
                    </Link>

                    <Link
                      href="/finance"
                      onClick={() => setPortalsDropdown(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-agri-dark hover:bg-agri-pale hover:text-agri-green-dark transition"
                    >
                      <Layers className="w-4 h-4 text-agri-green" />
                      <div>
                        <div className="font-bold">Finance Commission</div>
                        <div className="text-[10px] text-agri-secondary">Dealer targets & payouts</div>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

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

            {/* Cart Link with Badge */}
            <Link
              href="/cart"
              className="relative p-2 text-agri-dark hover:text-agri-green hover:bg-agri-cream rounded-xl transition focus-ring"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute top-1 right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold text-white bg-agri-green rounded-full shadow-xs">
                2
              </span>
            </Link>

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
              <Link
                href="/"
                className={`group relative flex items-center gap-1.5 h-[50px] lg:h-[52px] px-1 sm:px-1.5 lg:px-2 xl:px-2.5 transition-colors duration-200 shrink-0 select-none ${
                  pathname === '/'
                    ? 'text-agri-green font-extrabold'
                    : 'text-black hover:text-agri-green font-bold'
                }`}
              >
                <Home className={`w-3.5 h-3.5 lg:w-4 lg:h-4 transition-all duration-200 shrink-0 ${
                  pathname === '/' ? 'text-agri-green scale-105' : 'text-black group-hover:text-agri-green group-hover:-translate-y-0.5 group-hover:scale-110'
                }`} />
                <span className="whitespace-nowrap">Home</span>
                <span className={`absolute bottom-0 left-1 right-1 h-[2.5px] rounded-full bg-agri-green transition-all duration-300 ease-out origin-center ${
                  pathname === '/' ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100'
                }`} />
              </Link>

              <Link
                href="/shop"
                className={`group relative flex items-center gap-1.5 h-[50px] lg:h-[52px] px-1 sm:px-1.5 lg:px-2 xl:px-2.5 transition-colors duration-200 shrink-0 select-none ${
                  pathname.startsWith('/shop')
                    ? 'text-agri-green font-extrabold'
                    : 'text-black hover:text-agri-green font-bold'
                }`}
              >
                <span className="whitespace-nowrap">Shop Products</span>
                <span className={`absolute bottom-0 left-1 right-1 h-[2.5px] rounded-full bg-agri-green transition-all duration-300 ease-out origin-center ${
                  pathname.startsWith('/shop') ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100'
                }`} />
              </Link>

              <Link
                href="/rentals"
                className={`group relative flex items-center gap-1.5 h-[50px] lg:h-[52px] px-1 sm:px-1.5 lg:px-2 xl:px-2.5 transition-colors duration-200 shrink-0 select-none ${
                  pathname.startsWith('/rentals')
                    ? 'text-agri-green font-extrabold'
                    : 'text-black hover:text-agri-green font-bold'
                }`}
              >
                <Tractor className={`w-3.5 h-3.5 lg:w-4 lg:h-4 transition-all duration-200 shrink-0 ${
                  pathname.startsWith('/rentals') ? 'text-agri-green scale-105' : 'text-black group-hover:text-agri-green group-hover:-translate-y-0.5 group-hover:scale-110'
                }`} />
                <span className="whitespace-nowrap">Rent Equipment</span>
                <span className={`absolute bottom-0 left-1 right-1 h-[2.5px] rounded-full bg-agri-green transition-all duration-300 ease-out origin-center ${
                  pathname.startsWith('/rentals') ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100'
                }`} />
              </Link>

              <Link
                href="/services"
                className={`group relative flex items-center gap-1.5 h-[50px] lg:h-[52px] px-1 sm:px-1.5 lg:px-2 xl:px-2.5 transition-colors duration-200 shrink-0 select-none ${
                  pathname.startsWith('/services')
                    ? 'text-agri-green font-extrabold'
                    : 'text-black hover:text-agri-green font-bold'
                }`}
              >
                <Wrench className={`w-3.5 h-3.5 lg:w-4 lg:h-4 transition-all duration-200 shrink-0 ${
                  pathname.startsWith('/services') ? 'text-agri-green scale-105' : 'text-black group-hover:text-agri-green group-hover:-translate-y-0.5 group-hover:scale-110'
                }`} />
                <span className="whitespace-nowrap">Rent Services</span>
                <span className={`absolute bottom-0 left-1 right-1 h-[2.5px] rounded-full bg-agri-green transition-all duration-300 ease-out origin-center ${
                  pathname.startsWith('/services') ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100'
                }`} />
              </Link>

              <Link
                href="/package-of-practice"
                className={`group relative flex items-center gap-1.5 h-[50px] lg:h-[52px] px-1 sm:px-1.5 lg:px-2 xl:px-2.5 transition-colors duration-200 shrink-0 select-none ${
                  pathname.startsWith('/package-of-practice')
                    ? 'text-agri-green font-extrabold'
                    : 'text-black hover:text-agri-green font-bold'
                }`}
              >
                <ClipboardList className={`w-3.5 h-3.5 lg:w-4 lg:h-4 transition-all duration-200 shrink-0 ${
                  pathname.startsWith('/package-of-practice') ? 'text-agri-green scale-105' : 'text-black group-hover:text-agri-green group-hover:-translate-y-0.5 group-hover:scale-110'
                }`} />
                <span className="whitespace-nowrap">Package of Practice</span>
                <span className={`absolute bottom-0 left-1 right-1 h-[2.5px] rounded-full bg-agri-green transition-all duration-300 ease-out origin-center ${
                  pathname.startsWith('/package-of-practice') ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100'
                }`} />
              </Link>

              <Link
                href="/crop-guidance"
                className={`group relative flex items-center gap-1.5 h-[50px] lg:h-[52px] px-1 sm:px-1.5 lg:px-2 xl:px-2.5 transition-colors duration-200 shrink-0 select-none ${
                  pathname.startsWith('/crop-guidance')
                    ? 'text-agri-green font-extrabold'
                    : 'text-black hover:text-agri-green font-bold'
                }`}
              >
                <Sprout className={`w-3.5 h-3.5 lg:w-4 lg:h-4 transition-all duration-200 shrink-0 ${
                  pathname.startsWith('/crop-guidance') ? 'text-agri-green scale-105' : 'text-black group-hover:text-agri-green group-hover:-translate-y-0.5 group-hover:scale-110'
                }`} />
                <span className="whitespace-nowrap">Crop Guidance</span>
                <span className={`absolute bottom-0 left-1 right-1 h-[2.5px] rounded-full bg-agri-green transition-all duration-300 ease-out origin-center ${
                  pathname.startsWith('/crop-guidance') ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100'
                }`} />
              </Link>

              <Link
                href="/gallery"
                className={`group relative flex items-center gap-1.5 h-[50px] lg:h-[52px] px-1 sm:px-1.5 lg:px-2 xl:px-2.5 transition-colors duration-200 shrink-0 select-none ${
                  pathname.startsWith('/gallery')
                    ? 'text-agri-green font-extrabold'
                    : 'text-black hover:text-agri-green font-bold'
                }`}
              >
                <ImageIcon className={`w-3.5 h-3.5 lg:w-4 lg:h-4 transition-all duration-200 shrink-0 ${
                  pathname.startsWith('/gallery') ? 'text-agri-green scale-105' : 'text-black group-hover:text-agri-green group-hover:-translate-y-0.5 group-hover:scale-110'
                }`} />
                <span className="whitespace-nowrap">Gallery</span>
                <span className={`absolute bottom-0 left-1 right-1 h-[2.5px] rounded-full bg-agri-green transition-all duration-300 ease-out origin-center ${
                  pathname.startsWith('/gallery') ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100'
                }`} />
              </Link>

              <Link
                href="/blog"
                className={`group relative flex items-center gap-1.5 h-[50px] lg:h-[52px] px-1 sm:px-1.5 lg:px-2 xl:px-2.5 transition-colors duration-200 shrink-0 select-none ${
                  pathname.startsWith('/blog')
                    ? 'text-agri-green font-extrabold'
                    : 'text-black hover:text-agri-green font-bold'
                }`}
              >
                <BookOpen className={`w-3.5 h-3.5 lg:w-4 lg:h-4 transition-all duration-200 shrink-0 ${
                  pathname.startsWith('/blog') ? 'text-agri-green scale-105' : 'text-black group-hover:text-agri-green group-hover:-translate-y-0.5 group-hover:scale-110'
                }`} />
                <span className="whitespace-nowrap">Blogs</span>
                <span className={`absolute bottom-0 left-1 right-1 h-[2.5px] rounded-full bg-agri-green transition-all duration-300 ease-out origin-center ${
                  pathname.startsWith('/blog') ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100'
                }`} />
              </Link>

              <Link
                href="/about"
                className={`group relative flex items-center gap-1.5 h-[50px] lg:h-[52px] px-1 sm:px-1.5 lg:px-2 xl:px-2.5 transition-colors duration-200 shrink-0 select-none ${
                  pathname.startsWith('/about')
                    ? 'text-agri-green font-extrabold'
                    : 'text-black hover:text-agri-green font-bold'
                }`}
              >
                <span className="whitespace-nowrap">About Us</span>
                <span className={`absolute bottom-0 left-1 right-1 h-[2.5px] rounded-full bg-agri-green transition-all duration-300 ease-out origin-center ${
                  pathname.startsWith('/about') ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100'
                }`} />
              </Link>

              <Link
                href="/contact"
                className={`group relative flex items-center gap-1.5 h-[50px] lg:h-[52px] px-1 sm:px-1.5 lg:px-2 xl:px-2.5 transition-colors duration-200 shrink-0 select-none ${
                  pathname.startsWith('/contact')
                    ? 'text-agri-green font-extrabold'
                    : 'text-black hover:text-agri-green font-bold'
                }`}
              >
                <Phone className={`w-3.5 h-3.5 lg:w-4 lg:h-4 transition-all duration-200 shrink-0 ${
                  pathname.startsWith('/contact') ? 'text-agri-green scale-105' : 'text-black group-hover:text-agri-green group-hover:-translate-y-0.5 group-hover:scale-110'
                }`} />
                <span className="whitespace-nowrap">Contact Us</span>
                <span className={`absolute bottom-0 left-1 right-1 h-[2.5px] rounded-full bg-agri-green transition-all duration-300 ease-out origin-center ${
                  pathname.startsWith('/contact') ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100'
                }`} />
              </Link>
            </div>

            {/* Quick link to Design System */}
            <Link
              href="/design-system"
              className={`group relative flex items-center gap-1.5 py-1 px-2.5 rounded-full text-[11px] xl:text-xs font-semibold normal-case transition-all duration-200 shrink-0 border ${
                pathname === '/design-system'
                  ? 'bg-emerald-50 text-agri-green border-agri-green font-bold shadow-xs'
                  : 'bg-slate-50 text-black hover:text-agri-green hover:bg-emerald-50/70 border-slate-200/80 hover:border-agri-green/40 shadow-xs'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-200" />
              <span className="whitespace-nowrap">Design System</span>
            </Link>
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

          <div className="flex flex-col space-y-2.5 text-sm font-semibold text-agri-dark">
            <Link href="/shop" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-agri-green">
              Shop Products
            </Link>
            <Link href="/rentals" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-agri-green flex items-center gap-2">
              <Tractor className="w-4 h-4 text-agri-green" /> Rent Equipment
            </Link>
            <Link href="/services" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-agri-green flex items-center gap-2">
              <Wrench className="w-4 h-4 text-agri-yellow-dark" /> Rent Services
            </Link>
            <Link href="/package-of-practice" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-agri-green flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-agri-green" /> Package of Practice
            </Link>
            <Link href="/crop-guidance" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-agri-green flex items-center gap-2">
              <Sprout className="w-4 h-4 text-agri-green" /> Crop Guidance
            </Link>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-agri-green">
              About Us
            </Link>
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-agri-green">
              Contact
            </Link>
            <Link href="/account/wishlist" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-agri-green flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500" /> Saved Items (Wishlist)
            </Link>
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="py-1 text-agri-green font-bold flex items-center gap-2">
              <User className="w-4 h-4" /> Sign In / My Account
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

import React from 'react';
import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/config';
import {
  Compass,
  ShoppingBag,
  Tractor,
  Wrench,
  Sprout,
  PhoneCall,
  Search,
  ArrowRight,
  Home,
} from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 bg-agri-cream/40">
      <div className="max-w-2xl w-full text-center space-y-8 bg-white p-8 sm:p-12 rounded-3xl border border-agri-border shadow-subtle">
        {/* Visual Badge */}
        <div className="w-20 h-20 mx-auto bg-amber-50 rounded-3xl flex items-center justify-center border border-amber-200 text-agri-yellow-dark shadow-xs">
          <Compass className="w-10 h-10 animate-spin-slow" />
        </div>

        {/* Heading & Bilingual Explanation */}
        <div className="space-y-3">
          <div className="inline-block bg-agri-pale text-agri-green-dark text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-200">
            Error 404 &bull;  
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            We Can’t Find That Field or Page
          </h1>
          <p className="text-sm sm:text-base text-agri-secondary max-w-md mx-auto leading-relaxed">
            The page you are looking for may have been moved, renamed, or is temporarily out of service. Use the search below or explore our core agricultural services.
          </p>
        </div>

        {/* Search Bar */}
        <form action="/shop" method="GET" className="max-w-md mx-auto relative">
          <input
            type="text"
            name="q"
            placeholder="Search power weeders, fertilizers, services..."
            className="w-full pl-10 pr-24 py-3 rounded-full border border-agri-border bg-agri-cream/60 focus:bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-agri-green shadow-inner"
          />
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-agri-secondary" />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 bottom-1.5 bg-agri-green hover:bg-agri-green-dark text-white text-xs font-bold px-4 rounded-full transition shadow-xs"
          >
            Search
          </button>
        </form>

        {/* Recommended Quick Action Tiles */}
        <div className="pt-4 border-t border-slate-100">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            Popular Agricultural Destinations
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link
              href="/shop"
              className="p-3 bg-agri-cream/50 hover:bg-emerald-50 rounded-2xl border border-agri-border text-center space-y-1 group transition"
            >
              <ShoppingBag className="w-5 h-5 mx-auto text-agri-green group-hover:scale-110 transition-transform" />
              <div className="text-xs font-extrabold text-slate-800">Shop Inputs</div>
              <div className="text-[10px] text-slate-500">Seeds &amp; Tools</div>
            </Link>

            <Link
              href="/rentals"
              className="p-3 bg-agri-cream/50 hover:bg-amber-50 rounded-2xl border border-agri-border text-center space-y-1 group transition"
            >
              <Tractor className="w-5 h-5 mx-auto text-agri-yellow-dark group-hover:scale-110 transition-transform" />
              <div className="text-xs font-extrabold text-slate-800">Rentals</div>
              <div className="text-[10px] text-slate-500">Tillers &amp; Harvesters</div>
            </Link>

            <Link
              href="/services"
              className="p-3 bg-agri-cream/50 hover:bg-emerald-50 rounded-2xl border border-agri-border text-center space-y-1 group transition"
            >
              <Wrench className="w-5 h-5 mx-auto text-agri-green group-hover:scale-110 transition-transform" />
              <div className="text-xs font-extrabold text-slate-800">Services</div>
              <div className="text-[10px] text-slate-500">Drone &amp; Operators</div>
            </Link>

            <Link
              href="/crop-guidance"
              className="p-3 bg-agri-cream/50 hover:bg-emerald-50 rounded-2xl border border-agri-border text-center space-y-1 group transition"
            >
              <Sprout className="w-5 h-5 mx-auto text-agri-green group-hover:scale-110 transition-transform" />
              <div className="text-xs font-extrabold text-slate-800">Guidance</div>
              <div className="text-[10px] text-slate-500">7-Stage Advisory</div>
            </Link>
          </div>
        </div>

        {/* Back to Home & Help Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-agri-green hover:bg-agri-green-dark text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-full shadow-xs transition"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>

          <a
            href={`tel:${SITE_CONFIG.tollFree}`}
            className="inline-flex items-center gap-2 bg-white hover:bg-agri-cream text-agri-dark border border-agri-border font-bold text-xs sm:text-sm px-5 py-3 rounded-full transition"
          >
            <PhoneCall className="w-4 h-4 text-agri-green" />
            <span>Kisan Helpline: {SITE_CONFIG.tollFree}</span>
          </a>
        </div>
      </div>
    </div>
  );
}

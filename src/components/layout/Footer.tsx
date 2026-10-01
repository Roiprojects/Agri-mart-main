import React from 'react';
import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/config';
import { Phone, Mail, MapPin, Shield, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-sm">
      {/* 4 Pillars Highlight */}
      <div className="bg-emerald-950/80 border-b border-emerald-900/60 py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-10 h-10 rounded-xl bg-brand-green/20 flex items-center justify-center text-brand-gold font-bold text-sm">
              100%
            </div>
            <div>
              <div className="font-bold text-white text-sm">Certified Agri Inputs</div>
              <div className="text-xs text-emerald-200/80">Genuine seeds, bio-fertilizers & weeders</div>
            </div>
          </div>
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <Shield className="w-8 h-8 text-brand-gold" />
            <div>
              <div className="font-bold text-white text-sm">1-Year AMC & Warranty</div>
              <div className="text-xs text-emerald-200/80">Free service across 1,500+ dealer network</div>
            </div>
          </div>
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-10 h-10 rounded-xl bg-brand-green/20 flex items-center justify-center text-brand-gold font-bold text-xs">
              GPS
            </div>
            <div>
              <div className="font-bold text-white text-sm">Dark Warehouse Dispatch</div>
              <div className="text-xs text-emerald-200/80">Automated order routing within 40-60 km</div>
            </div>
          </div>
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <Phone className="w-8 h-8 text-brand-gold" />
            <div>
              <div className="font-bold text-white text-sm">Kisan Agronomist Line</div>
              <div className="text-xs text-emerald-200/80">Toll-Free: {SITE_CONFIG.tollFree}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 space-y-3">
          <div className="text-white text-xl font-extrabold tracking-tight flex items-center gap-2">
            <span className="text-brand-gold">AGRI MART</span> MEGA
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {SITE_CONFIG.nameKannada} — {SITE_CONFIG.taglineKannada}. An end-to-end digital agriculture platform by{' '}
            <strong className="text-slate-200">{SITE_CONFIG.parentCompany}</strong>. Connecting farmers to products, equipment rentals, on-field services, and AI agronomy guidance.
          </p>
          <div className="text-xs text-slate-400 space-y-1 pt-1">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-brand-green" />
              <span>Headquarters: {SITE_CONFIG.headquarters}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-brand-green" />
              <span>Support: {SITE_CONFIG.supportPhone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-brand-green" />
              <span>Email: {SITE_CONFIG.supportEmail}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">E-Commerce Catalog</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><Link href="/categories/farm-equipment-machinery" className="hover:text-white transition">Power Weeders & Tillers</Link></li>
            <li><Link href="/categories/farm-equipment-machinery" className="hover:text-white transition">Knapsack & Boom Sprayers</Link></li>
            <li><Link href="/categories/fertilizers-soil-care" className="hover:text-white transition">Organic Bio-Fertilizers</Link></li>
            <li><Link href="/categories/crop-protection-green-care" className="hover:text-white transition">Neem Guard Bio-Pesticides</Link></li>
            <li><Link href="/categories/seeds-planting-materials" className="hover:text-white transition">Certified Hybrid Seeds</Link></li>
            <li><Link href="/crop-guidance" className="text-brand-gold hover:underline font-semibold">7-Stage Crop Guidance (POP)</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Rentals & Services</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><Link href="/rentals" className="hover:text-white transition">Rent Power Weeders</Link></li>
            <li><Link href="/rentals" className="hover:text-white transition">Rent Paddy Reapers</Link></li>
            <li><Link href="/services/tractor-ploughing-services" className="hover:text-white transition">Tractor Ploughing Services</Link></li>
            <li><Link href="/services/drone-precision-spraying-services" className="hover:text-white transition">Drone Precision Spraying</Link></li>
            <li><Link href="/services/soil-testing-laboratory-analysis" className="hover:text-white transition">Soil Testing Laboratory</Link></li>
            <li><Link href="/ai-advisory" className="text-brand-gold hover:underline font-semibold">Gemini AI Crop Advisory</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Portals & Farmer Care</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><Link href="/login" className="hover:text-white transition">Farmer & Partner Login</Link></li>
            <li><Link href="/account" className="hover:text-white transition">Customer Dashboard</Link></li>
            <li><Link href="/account/wishlist" className="hover:text-white transition">Saved Equipment (Wishlist)</Link></li>
            <li><Link href="/dealers" className="hover:text-white transition">Authorized Dealer Workshops</Link></li>
            <li><Link href="/blog" className="hover:text-white transition">Agronomy Blog & POP</Link></li>
            <li><Link href="/faq" className="hover:text-white transition">Frequently Asked Questions</Link></li>
          </ul>
        </div>
      </div>

      <div className="bg-slate-950 py-4 px-4 border-t border-slate-800 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div>
            &copy; 2026 {SITE_CONFIG.name} ({SITE_CONFIG.parentCompany}). Configured domain:{' '}
            <span className="text-brand-gold">{SITE_CONFIG.domain}</span>
          </div>
          <div className="flex flex-wrap gap-4 text-slate-400">
            <Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white">Terms & Conditions</Link>
            <Link href="/shipping-policy" className="hover:text-white">Shipping Policy</Link>
            <Link href="/faq" className="hover:text-white">FAQ</Link>
            <Link href="/about" className="hover:text-white">About</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Sprout,
  CheckCircle2,
} from 'lucide-react';

export interface BannerSlide {
  id: number;
  type: 'showcase' | 'buy' | 'rent-product' | 'rent-service';
  title: string;
  subtitle: string;
  badge: string;
  image: string;
  buttonText?: string;
  buttonLink?: string;
  floatingCard?: {
    title: string;
    description: string;
    stat: string;
  };
}

// Underlying banner records preserved exactly with offer badges
export const BANNERS: BannerSlide[] = [
  {
    id: 1,
    type: 'showcase',
    title: 'Precision Agri Mechanization & Green Care',
    subtitle:
      'High-density farming inputs, certified seed hybrids, and zero-defect power machinery across Karnataka.',
    badge: 'Seasonal Subsidy Direct',
    image: '/images/banners/hero_showcase.jpg',
    floatingCard: {
      title: 'Dark Warehouse Network',
      description: '40-60 km hyper-local delivery grid in Hubballi, Belagavi, Davanagere & Haveri',
      stat: '24-48 Hr Dispatch',
    },
  },
  {
    id: 2,
    type: 'buy',
    title: 'Certified Farm Equipment & Power Weeders',
    subtitle:
      'Multi-speed tillers, knapsack sprayers, and organic NPK bio-consortia backed by 1-Year comprehensive AMC.',
    badge: '1-Year Free AMC Warranty',
    image: '/images/banners/hero_equipment_buy.jpg',
    buttonText: 'Buy the Product',
    buttonLink: '/shop',
    floatingCard: {
      title: 'AgriPro 7HP Weeder',
      description: '2 Forward + 1 Reverse Gear, Boron J-Blades',
      stat: '₹42,500 with GST',
    },
  },
  {
    id: 3,
    type: 'rent-product',
    title: 'Flexible Farm Equipment Rental Fleet',
    subtitle:
      'Rent heavy power tillers, boom sprayers, and self-propelled paddy reapers on daily or weekly slabs without heavy capital outlay.',
    badge: '100% Refundable Deposit',
    image: '/images/banners/hero_rental.jpg',
    buttonText: 'Rent Product',
    buttonLink: '/rentals',
    floatingCard: {
      title: 'Self-Propelled Reaper',
      description: '1 Acre in 60 Mins, 100% Refundable Security Deposit',
      stat: '₹1,450 / day',
    },
  },
  {
    id: 4,
    type: 'rent-service',
    title: 'On-Field GPS Dispatched Services',
    subtitle:
      'Book professional tractor ploughing, 16L drone precision spraying, and 12-parameter soil testing directly to your farm parcel coordinates.',
    badge: 'Verified Drone Operators',
    image: '/images/banners/hero_service_drone.jpg',
    buttonText: 'Rent Service',
    buttonLink: '/services',
    floatingCard: {
      title: 'Drone Micron Spraying',
      description: '90% Water Savings, Uniform Canopy Penetration',
      stat: '₹450 / acre',
    },
  },
];

export default function HeroBannerSlider() {
  const [slides, setSlides] = useState<BannerSlide[]>(BANNERS);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Check user prefers-reduced-motion preference
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Connect to backend banner management if published banners are available
  useEffect(() => {
    fetch('/api/content/banners')
      .then((r) => r.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setSlides((prev) =>
            prev.map((slide, idx) => {
              const backendItem = res.data[idx];
              if (backendItem) {
                return {
                  ...slide,
                  image: backendItem.imageUrl || slide.image,
                  badge: backendItem.badge || slide.badge,
                };
              }
              return slide;
            })
          );
        }
      })
      .catch(() => {
        // Graceful fallback to rich local banner definitions
      });
  }, []);

  const nextSlide = useCallback(() => {
    setSlides((curr) => {
      setCurrentIdx((prev) => (prev + 1) % curr.length);
      return curr;
    });
  }, []);

  const prevSlide = useCallback(() => {
    setSlides((curr) => {
      setCurrentIdx((prev) => (prev - 1 + curr.length) % curr.length);
      return curr;
    });
  }, []);

  // 6-second auto slideshow: automatically pauses when hovered, focused, or reduced motion active
  useEffect(() => {
    if (isHovered || isFocused || isReducedMotion) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [isHovered, isFocused, isReducedMotion, nextSlide]);

  // Accessible keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
    }
  };

  const activeSlide = slides[currentIdx] || slides[0];

  return (
    <div
      ref={sliderRef}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="AGRI MART MEGA Hero Banner Slideshow"
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className="relative w-full overflow-hidden bg-slate-950 flex flex-col justify-between h-auto min-h-[480px] sm:min-h-[500px] lg:h-[calc(100vh-148px)] lg:min-h-[500px] lg:max-h-[620px] focus:outline-none"
    >
      {/* =========================================================================
          1. FULL-WIDTH EDGE-TO-EDGE BACKGROUND SLIDESHOW
         ========================================================================= */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        {slides.map((b, i) => (
          <div
            key={b.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              currentIdx === i ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <Image
              src={b.image}
              alt={b.title}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover object-center sm:object-right brightness-[0.82] contrast-[1.05]"
            />
          </div>
        ))}

        {/* Subtle agricultural dot-grid texture overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] z-10" />

        {/* Directional dark gradient behind text for supreme readability while keeping machinery visible */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 sm:via-slate-950/65 to-slate-950/30 lg:to-transparent z-10" />

        {/* Soft bottom vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent z-10" />
      </div>

      {/* =========================================================================
          2. TOP CONTROL AREA: ONLY THE OFFER BADGE (Neatly Positioned Top-Right)
         ========================================================================= */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 flex justify-end">
        <div className="inline-flex items-center gap-1.5 bg-agri-yellow text-slate-950 font-bold text-xs sm:text-sm px-3.5 sm:px-4 py-1.5 rounded-full shadow-lg border border-amber-300/70 backdrop-blur-md transition-all duration-300">
          <Sparkles className="w-3.5 h-3.5 text-slate-900" />
          <span>{activeSlide.badge}</span>
        </div>
      </div>

      {/* =========================================================================
          3. STATIONARY OVERLAID HERO CONTENT (Left-Aligned, Real H1 for SEO)
         ========================================================================= */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-5 lg:py-6 flex-1 flex flex-col justify-center">
        <div className="max-w-2xl xl:max-w-3xl space-y-3 sm:space-y-4 text-left">
          {/* Eyebrow Tagline */}
          <div className="inline-flex items-center gap-2 bg-emerald-950/80 border border-emerald-400/40 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold text-emerald-300 shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-agri-yellow" />
            <span>Farm Equipment &bull; Green Care &bull; Services</span>
          </div>

          {/* Real HTML H1 Heading */}
          <h1 className="text-2xl sm:text-4xl lg:text-4.5xl xl:text-5xl font-black text-white tracking-tight leading-[1.14] drop-shadow-md">
            Everything Your Farm Needs.{' '}
            <span className="text-agri-yellow underline decoration-agri-green decoration-4 underline-offset-8">
              In One Place.
            </span>
          </h1>

          {/* Subtitle / Description */}
          <p className="text-xs sm:text-sm lg:text-base text-slate-200 leading-relaxed max-w-xl drop-shadow">
            Shop farm essentials, rent equipment, book agricultural services, and find guidance for
            every stage of your crop.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              href="/shop"
              className="bg-agri-green hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm lg:text-base px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
            >
              <span>Shop Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/crop-guidance"
              className="bg-white hover:bg-agri-cream text-agri-green-dark border-2 border-agri-green font-bold text-xs sm:text-sm lg:text-base px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-2xl transition-all duration-200 shadow-md flex items-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Sprout className="w-4 h-4 text-agri-green" />
              <span>Get Crop Guidance</span>
            </Link>
          </div>

          {/* Trust Indicators Pill Grid */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/20 text-[11px] sm:text-xs text-slate-200 max-w-lg">
            <div className="flex items-center gap-1.5 font-semibold text-white">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-agri-yellow shrink-0" />
              <span>40-60km Dark Hubs</span>
            </div>
            <div className="flex items-center gap-1.5 font-semibold text-white">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-agri-yellow shrink-0" />
              <span>1-Year Free AMC</span>
            </div>
            <div className="flex items-center gap-1.5 font-semibold text-white">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-agri-yellow shrink-0" />
              <span>GPS Field Mechanization</span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          4. NAVIGATION ARROWS (Left & Right Edge Controls)
         ========================================================================= */}
      <button
        onClick={prevSlide}
        className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/45 hover:bg-black/75 backdrop-blur-md text-white border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-30 focus:opacity-100 shadow-lg"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/45 hover:bg-black/75 backdrop-blur-md text-white border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-30 focus:opacity-100 shadow-lg"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* =========================================================================
          5. PAGINATION DOTS (Positioned Bottom-Right)
         ========================================================================= */}
      <div className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-3 sm:pb-4 flex items-center justify-end space-x-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIdx(i)}
            className={`h-2 rounded-full transition-all duration-250 ${
              currentIdx === i ? 'w-7 bg-agri-yellow shadow-xs' : 'w-2 bg-white/40 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

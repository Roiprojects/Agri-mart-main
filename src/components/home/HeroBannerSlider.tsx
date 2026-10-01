'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Tractor,
  Wrench,
  Sparkles,
  ArrowRight,
  Pause,
  Play,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface BannerSlide {
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

const BANNERS: BannerSlide[] = [
  {
    id: 1,
    type: 'showcase',
    title: 'Precision Agri Mechanization & Green Care',
    subtitle: 'High-density farming inputs, certified seed hybrids, and zero-defect power machinery across Karnataka.',
    badge: 'Showcase & Overview',
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
    subtitle: 'Multi-speed tillers, knapsack sprayers, and organic NPK bio-consortia backed by 1-Year comprehensive AMC.',
    badge: 'Direct Farm Purchase',
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
    subtitle: 'Rent heavy power tillers, boom sprayers, and self-propelled paddy reapers on daily or weekly slabs without heavy capital outlay.',
    badge: 'Flexible Machine Rentals',
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
    subtitle: 'Book professional tractor ploughing, 16L drone precision spraying, and 12-parameter soil testing directly to your farm parcel coordinates.',
    badge: 'GPS Mechanized Services',
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
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const nextSlide = useCallback(() => {
    setCurrentIdx((prev) => (prev + 1) % BANNERS.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIdx((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);
  }, []);

  // Readable 6-second slide duration, pause on hover or when paused by user
  useEffect(() => {
    if (!isPlaying || isHovered) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [isPlaying, isHovered, nextSlide]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
    }
  };

  const banner = BANNERS[currentIdx];

  return (
    <div
      ref={sliderRef}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Agri Mart Mega Highlights"
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      className="relative w-full rounded-3xl overflow-hidden border border-agri-border shadow-md bg-slate-900 group aspect-[4/3] sm:aspect-[16/10] lg:aspect-[16/11] focus:outline-none focus-visible:ring-2 focus-visible:ring-agri-green"
    >
      {/* Background Image with gentle crossfade */}
      <div className="relative w-full h-full">
        {BANNERS.map((b, i) => (
          <div
            key={b.id}
            className={`absolute inset-0 transition-opacity duration-500 ease-out ${
              currentIdx === i ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <Image
              src={b.image}
              alt={b.title}
              fill
              className="object-cover brightness-[0.82]"
              priority={i === 0}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
            />
          </div>
        ))}

        {/* Subtle field contour overlay SVG */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] z-10" />

        {/* Soft bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10" />
      </div>

      {/* Banner Top Navigation Tabs & Play/Pause Button */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 z-20">
        <div className="flex bg-black/45 backdrop-blur-md p-1 rounded-2xl border border-white/15 text-[10px] sm:text-xs">
          {BANNERS.map((b, idx) => (
            <button
              key={b.id}
              onClick={() => setCurrentIdx(idx)}
              aria-label={`Go to slide ${b.id}: ${b.title}`}
              className={`px-2.5 sm:px-3 py-1 rounded-xl transition-all duration-200 font-bold ${
                currentIdx === idx
                  ? 'bg-agri-green text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Banner {b.id}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="golden" size="sm" className="hidden sm:inline-flex shadow-xs">
            {banner.badge}
          </Badge>

          {/* Accessible Play/Pause Toggle */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? 'Pause automatic slideshow' : 'Play automatic slideshow'}
            className="w-7 h-7 rounded-xl bg-black/45 hover:bg-black/70 backdrop-blur-md border border-white/15 text-white flex items-center justify-center transition-colors duration-150"
            title={isPlaying ? 'Pause slideshow' : 'Resume slideshow'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
          </button>
        </div>
      </div>

      {/* Slide Content Box */}
      <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 z-20 space-y-3">
        <div className="space-y-1 sm:space-y-1.5 max-w-xl animate-fadeSlideUp">
          <h3 className="text-lg sm:text-2xl font-black text-white leading-snug drop-shadow-md">
            {banner.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 leading-relaxed drop-shadow">
            {banner.subtitle}
          </p>
        </div>

        {/* Action Button for Banners 2, 3, 4 */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {banner.buttonText && banner.buttonLink ? (
            <Link
              href={banner.buttonLink}
              className="inline-flex items-center gap-2 bg-agri-yellow hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {banner.type === 'buy' && <ShoppingCart className="w-4 h-4" />}
              {banner.type === 'rent-product' && <Tractor className="w-4 h-4" />}
              {banner.type === 'rent-service' && <Wrench className="w-4 h-4" />}
              <span>{banner.buttonText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white text-xs font-semibold px-4 py-2 rounded-xl border border-white/30">
              <Sparkles className="w-3.5 h-3.5 text-agri-yellow" />
              <span>Full Agricultural Ecosystem Showcase</span>
            </div>
          )}

          {/* Floating Spec / Pricing pill */}
          {banner.floatingCard && (
            <div className="hidden sm:block bg-black/60 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-xl text-right">
              <div className="text-[10px] text-slate-300 font-medium">{banner.floatingCard.title}</div>
              <div className="text-xs font-black text-agri-yellow">{banner.floatingCard.stat}</div>
            </div>
          )}
        </div>
      </div>

      {/* Accessible Previous / Next Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-30 focus:opacity-100"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-30 focus:opacity-100"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Slide Indicator Dots */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center space-x-1.5 z-30">
        {BANNERS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIdx(i)}
            className={`h-1.5 rounded-full transition-all duration-250 ${
              currentIdx === i ? 'w-6 bg-agri-yellow' : 'w-2 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

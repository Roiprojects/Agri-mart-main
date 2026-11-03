'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Camera,
  ZoomIn,
} from 'lucide-react';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  badge?: string;
}

export default function ProductImageGallery({
  images,
  productName,
  badge,
}: ProductImageGalleryProps) {
  const fallbackImage =
    'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80';
  const validImages = images && images.length > 0 ? images : [fallbackImage];

  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const activeImage = validImages[activeIndex] || validImages[0];

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      {/* Main Image Stage */}
      <div className="relative aspect-square w-full bg-slate-50 rounded-3xl overflow-hidden border border-slate-200 shadow-sm group">
        <Image
          src={activeImage}
          alt={`${productName} - Picture ${activeIndex + 1}`}
          fill
          unoptimized
          priority
          className="object-cover transition-transform duration-300 group-hover:scale-105 cursor-zoom-in"
          onClick={() => setLightboxOpen(true)}
          sizes="(max-width: 768px) 100vw, 50vw"
        />

        {/* Floating Tag or Badge */}
        {badge && (
          <div className="absolute top-4 left-4 z-10 bg-emerald-600 text-white font-extrabold text-[11px] px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
            {badge}
          </div>
        )}

        {/* Counter Badge */}
        <div className="absolute top-4 right-4 z-10 bg-slate-900/70 backdrop-blur-md text-white font-bold text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
          <Camera className="w-3.5 h-3.5 text-agri-yellow" />
          <span>
            {activeIndex + 1} / {validImages.length}
          </span>
        </div>

        {/* Fullscreen Button */}
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          title="Open fullscreen preview"
          className="absolute bottom-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md flex items-center justify-center transition opacity-0 group-hover:opacity-100"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Left & Right Arrow Buttons on Main Stage */}
        {validImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md flex items-center justify-center transition opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md flex items-center justify-center transition opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Row */}
      {validImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-thin">
          {validImages.map((img, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`relative w-20 h-20 shrink-0 rounded-2xl overflow-hidden border-2 transition-all ${
                  isActive
                    ? 'border-emerald-600 ring-2 ring-emerald-500/30 scale-105 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
                }`}
              >
                <Image
                  src={img}
                  alt={`${productName} thumbnail ${idx + 1}`}
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="80px"
                />
                {isActive && (
                  <div className="absolute inset-0 bg-emerald-600/10 pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6 animate-fadeIn"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Top Bar */}
          <div
            className="w-full max-w-5xl flex items-center justify-between text-white text-xs pb-2 border-b border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-agri-yellow" />
              <span className="font-bold text-sm truncate max-w-md">
                {productName}
              </span>
              <span className="text-white/60">
                ({activeIndex + 1} of {validImages.length})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => (z === 1 ? 1.5 : 1))}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium flex items-center gap-1.5 transition text-xs"
              >
                <ZoomIn className="w-3.5 h-3.5" />
                <span>{zoomLevel > 1 ? 'Reset Zoom' : 'Zoom 1.5x'}</span>
              </button>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Center Stage */}
          <div
            className="relative w-full max-w-4xl h-[70vh] flex items-center justify-center my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="relative w-full h-full transition-transform duration-200"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <Image
                src={activeImage}
                alt={productName}
                fill
                unoptimized
                className="object-contain"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
            </div>

            {validImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center shadow-lg transition"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center shadow-lg transition"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnails */}
          {validImages.length > 1 && (
            <div
              className="flex items-center gap-2 overflow-x-auto pt-2"
              onClick={(e) => e.stopPropagation()}
            >
              {validImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setActiveIndex(idx);
                    setZoomLevel(1);
                  }}
                  className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 transition ${
                    idx === activeIndex
                      ? 'border-emerald-500 scale-105'
                      : 'border-white/20 opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt="" fill unoptimized className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

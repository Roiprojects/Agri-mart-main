'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Badge } from '@/components/ui/Badge';
import { GALLERY_PHOTOS, GalleryPhotoType } from '@/lib/gallery-data';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ExternalLink,
  Camera,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export default function GalleryPage() {
  const [photos, setPhotos] = useState<GalleryPhotoType[]>(GALLERY_PHOTOS);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/gallery')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setPhotos(json.data);
        }
      })
      .catch(() => {});
  }, []);

  const activePhoto = lightboxIndex !== null ? photos[lightboxIndex] : null;

  const handleNext = useCallback(() => {
    setLightboxIndex((prev) => (prev === null ? null : (prev + 1) % photos.length));
  }, [photos.length]);

  const handlePrev = useCallback(() => {
    setLightboxIndex((prev) =>
      prev === null ? null : (prev - 1 + photos.length) % photos.length
    );
  }, [photos.length]);

  const handleClose = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') handleClose();
      else if (e.key === 'ArrowRight') handleNext();
      else if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, handleClose, handleNext, handlePrev]);

  // Lock body scroll when lightbox is active
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [lightboxIndex]);

  const breadcrumbItems = [{ label: 'Home', href: '/' }, { label: 'Gallery' }];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={breadcrumbItems} />

      {/* Header Section */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg border border-emerald-800/40 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <Badge variant="warning" size="sm">
            Visual Agronomy Archive
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Life on the Farm
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-2xl">
            A visual journey across agricultural rhythms in Karnataka—from fertile seedbed preparation
            and precision irrigation to mechanized harvesting and dry post-harvest storage. Illustrating the
            vitality, dedication, and seasonal milestones of farm life.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2 text-[11px] text-emerald-300">
            <span className="flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-brand-gold" /> 10 Curated Agricultural Themes
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-gold" /> Permitted &amp; Attributed Photography
            </span>
          </div>
        </div>
      </div>

      {/* Responsive Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {photos.map((photo, index) => (
          <article
            key={photo.id}
            onClick={() => setLightboxIndex(index)}
            className="group relative bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between"
          >
            {/* Image Container with Consistent 4:3 Proportion */}
            <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
              <Image
                src={photo.image}
                alt={photo.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority={index < 4}
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <div className="flex items-center justify-between w-full text-white text-xs">
                  <span className="font-semibold flex items-center gap-1">
                    <Maximize2 className="w-3.5 h-3.5" /> Enlarge
                  </span>
                  <span className="text-[10px] text-emerald-200">Photo #{index + 1}</span>
                </div>
              </div>

              {/* Subject Tag */}
              <div className="absolute top-3 left-3 z-10">
                <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs border border-white/20">
                  {photo.subject}
                </span>
              </div>
            </div>

            {/* Content & Caption */}
            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between bg-white">
              <div>
                <h2 className="font-bold text-sm text-slate-900 leading-snug group-hover:text-brand-green transition">
                  {photo.title}
                </h2>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  {photo.caption}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                <span>By {photo.photographer}</span>
                <span className="text-emerald-700 font-semibold group-hover:underline">View Photo &rarr;</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && activePhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activePhoto.title}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-fadeIn"
          onClick={handleClose}
        >
          {/* Top Bar: Counter, Title, Close Button */}
          <div
            className="flex items-center justify-between text-white w-full max-w-5xl mx-auto z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono bg-white/10 px-3 py-1 rounded-full text-emerald-300">
                {lightboxIndex + 1} / {photos.length}
              </span>
              <span className="text-xs font-semibold text-slate-300 hidden sm:inline">
                {activePhoto.subject}
              </span>
            </div>

            <button
              onClick={handleClose}
              aria-label="Close Lightbox"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Photo Display Area */}
          <div
            className="relative flex items-center justify-center flex-1 my-3 max-w-5xl mx-auto w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Previous Button */}
            <button
              onClick={handlePrev}
              aria-label="Previous image"
              className="absolute left-2 sm:-left-12 z-20 p-2 sm:p-3 rounded-full bg-slate-900/80 hover:bg-emerald-700 text-white transition border border-white/10 shadow-lg cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Image */}
            <div className="relative w-full h-[55vh] sm:h-[65vh] max-h-[700px] rounded-2xl overflow-hidden shadow-2xl bg-black/40">
              <Image
                src={activePhoto.image}
                alt={activePhoto.alt}
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              aria-label="Next image"
              className="absolute right-2 sm:-right-12 z-20 p-2 sm:p-3 rounded-full bg-slate-900/80 hover:bg-emerald-700 text-white transition border border-white/10 shadow-lg cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Caption & Attribution Footer */}
          <div
            className="w-full max-w-5xl mx-auto bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-white space-y-2 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-base text-white">{activePhoto.title}</h3>
                <p className="text-xs text-slate-300 mt-0.5">{activePhoto.caption}</p>
              </div>
              <div className="text-[11px] text-slate-400 sm:text-right shrink-0">
                <div>Photo Credit: <strong className="text-slate-200">{activePhoto.photographer}</strong></div>
                <div className="text-[10px] text-emerald-400">{activePhoto.license}</div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline">Navigate:</span>
                <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[10px]">Left / Right</kbd>
                <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[10px]">Esc to close</kbd>
              </div>
              <a
                href={activePhoto.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>View Source</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  MapPin,
  Download,
  Calendar,
  Filter,
} from 'lucide-react';

interface GallerySettings {
  enabled?: boolean;
  pageSize?: number;
  allowLightbox?: boolean;
  showPhotographer?: boolean;
  showLocation?: boolean;
  showLicense?: boolean;
  enableCategories?: boolean;
  pageTitle?: string;
  pageSubtitle?: string;
  gridColumns?: number;
  allowDownload?: boolean;
  showCaptions?: boolean;
}

export default function GalleryPage() {
  const [photos, setPhotos] = useState<any[]>(GALLERY_PHOTOS);
  const [settings, setSettings] = useState<GallerySettings>({
    enabled: true,
    pageSize: 12,
    allowLightbox: true,
    showPhotographer: true,
    showLocation: true,
    showLicense: true,
    enableCategories: true,
    pageTitle: 'Life on the Farm',
    pageSubtitle:
      'A visual journey across agricultural rhythms in Karnataka—from fertile seedbed preparation and precision irrigation to mechanized harvesting and dry post-harvest storage.',
    gridColumns: 4,
    allowDownload: true,
    showCaptions: true,
  });
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/gallery', { cache: 'no-store' })
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setPhotos(json.data);
        }
        if (json.settings) {
          setSettings(json.settings);
        }
      })
      .catch(() => {});
  }, []);

  // Compute unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    photos.forEach((p) => {
      const cat = p.subject || p.category;
      if (cat) set.add(cat);
    });
    return ['All', ...Array.from(set)];
  }, [photos]);

  // Filtered photos
  const filteredPhotos = useMemo(() => {
    if (selectedCategory === 'All') return photos;
    return photos.filter((p) => (p.subject || p.category) === selectedCategory);
  }, [photos, selectedCategory]);

  const activePhoto = lightboxIndex !== null ? filteredPhotos[lightboxIndex] : null;

  const handleNext = useCallback(() => {
    setLightboxIndex((prev) => (prev === null ? null : (prev + 1) % filteredPhotos.length));
  }, [filteredPhotos.length]);

  const handlePrev = useCallback(() => {
    setLightboxIndex((prev) =>
      prev === null ? null : (prev - 1 + filteredPhotos.length) % filteredPhotos.length
    );
  }, [filteredPhotos.length]);

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

  if (settings.enabled === false) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="bg-white rounded-2xl border border-slate-200 p-12 max-w-xl mx-auto space-y-3">
          <Camera className="w-12 h-12 text-slate-300 mx-auto" />
          <h2 className="text-xl font-bold text-slate-800">Agricultural Gallery</h2>
          <p className="text-sm text-slate-500">
            The agricultural photography gallery is currently undergoing seasonal curation. Please check back shortly.
          </p>
          <Link href="/" className="inline-block mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // Dynamic grid column class
  const gridColClass =
    settings.gridColumns === 2
      ? 'grid-cols-1 sm:grid-cols-2 gap-6'
      : settings.gridColumns === 3
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
      : settings.gridColumns === 6
      ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';

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
            {settings.pageTitle || 'Life on the Farm'}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-2xl">
            {settings.pageSubtitle ||
              'A visual journey across agricultural rhythms in Karnataka—from fertile seedbed preparation and precision irrigation to mechanized harvesting and dry post-harvest storage.'}
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2 text-[11px] text-emerald-300">
            <span className="flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-amber-400" /> {photos.length} Curated Agricultural Photographs
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Permitted &amp; Attributed Photography
            </span>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      {settings.enableCategories !== false && categories.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-emerald-600" /> Filter:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-white shadow-xs font-bold'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Responsive Gallery Grid */}
      <div className={`grid ${gridColClass}`}>
        {filteredPhotos.map((photo, index) => (
          <article
            key={photo.id}
            onClick={() => {
              if (settings.allowLightbox !== false) {
                setLightboxIndex(index);
              }
            }}
            className={`group relative bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between ${
              settings.allowLightbox !== false ? 'cursor-pointer' : ''
            }`}
          >
            {/* Image Container with Consistent Proportion */}
            <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
              <Image
                src={photo.image}
                alt={photo.alt || photo.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority={index < 4}
              />
              {/* Overlay on hover */}
              {settings.allowLightbox !== false && (
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div className="flex items-center justify-between w-full text-white text-xs">
                    <span className="font-semibold flex items-center gap-1">
                      <Maximize2 className="w-3.5 h-3.5" /> Enlarge
                    </span>
                    <span className="text-[10px] text-emerald-200">Photo #{photo.displayOrder || index + 1}</span>
                  </div>
                </div>
              )}

              {/* Subject Tag */}
              <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
                <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs border border-white/20">
                  {photo.subject || photo.category || 'Farm Fields'}
                </span>
                {photo.isFeatured && (
                  <span className="bg-amber-400 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                    ★ Featured
                  </span>
                )}
              </div>
            </div>

            {/* Content & Caption */}
            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between bg-white">
              <div>
                <h2 className="font-bold text-sm text-slate-900 leading-snug group-hover:text-emerald-700 transition">
                  {photo.title}
                </h2>
                {settings.showCaptions !== false && (
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {photo.caption}
                  </p>
                )}

                {/* Location and Crop tags */}
                {settings.showLocation !== false && (photo.location || photo.cropType) && (
                  <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
                    {photo.location && (
                      <span className="flex items-center gap-0.5 truncate">
                        <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate">{photo.location}</span>
                      </span>
                    )}
                    {photo.cropType && (
                      <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                        🌾 {photo.cropType}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                {settings.showPhotographer !== false ? (
                  <span>By {photo.photographer || 'Agri Mart Archive'}</span>
                ) : (
                  <span>Agri Mart Archive</span>
                )}
                {settings.allowLightbox !== false && (
                  <span className="text-emerald-700 font-semibold group-hover:underline">View Photo &rarr;</span>
                )}
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
                {lightboxIndex + 1} / {filteredPhotos.length}
              </span>
              <span className="text-xs font-semibold text-slate-300 hidden sm:inline">
                {activePhoto.subject || activePhoto.category}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {settings.allowDownload !== false && (
                <a
                  href={activePhoto.image}
                  download
                  target="_blank"
                  rel="noreferrer"
                  title="Download photograph"
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                </a>
              )}
              <button
                onClick={handleClose}
                aria-label="Close Lightbox"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Photo Display Area */}
          <div
            className="relative flex items-center justify-center flex-1 my-3 max-w-5xl mx-auto w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Prev Button */}
            <button
              onClick={handlePrev}
              aria-label="Previous Photo"
              className="absolute left-2 sm:left-4 z-20 p-2 sm:p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition border border-white/10 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Photo */}
            <div className="relative w-full h-[60vh] sm:h-[70vh]">
              <Image
                src={activePhoto.image}
                alt={activePhoto.alt || activePhoto.title}
                fill
                className="object-contain"
                sizes="(max-width: 1280px) 100vw, 1280px"
                priority
              />
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              aria-label="Next Photo"
              className="absolute right-2 sm:right-4 z-20 p-2 sm:p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition border border-white/10 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Bottom Bar: Title, Caption, Metadata */}
          <div
            className="w-full max-w-5xl mx-auto bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-4 text-white z-10 space-y-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                {activePhoto.title}
              </h2>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                {settings.showPhotographer !== false && (
                  <span>
                    Photo by <strong className="text-emerald-300 font-semibold">{activePhoto.photographer}</strong>
                  </span>
                )}
                {activePhoto.sourceUrl && (
                  <a
                    href={activePhoto.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-emerald-400 hover:underline"
                  >
                    Source <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            {activePhoto.caption && (
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {activePhoto.caption}
              </p>
            )}

            {/* Extra details in lightbox */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-400 border-t border-white/10">
              {activePhoto.location && <span>📍 {activePhoto.location}</span>}
              {activePhoto.cropType && <span>🌾 {activePhoto.cropType}</span>}
              {activePhoto.season && <span>📅 {activePhoto.season}</span>}
              {settings.showLicense !== false && activePhoto.license && (
                <span className="text-[10px] text-slate-500">📜 {activePhoto.license}</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

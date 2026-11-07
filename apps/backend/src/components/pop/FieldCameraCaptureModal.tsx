'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  RefreshCw,
  Check,
  X,
  Upload,
  Image as ImageIcon,
  Trash2,
  Sparkles,
  Eye,
  Layers,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Sprout,
  User,
} from 'lucide-react';

export interface CropSummaryItem {
  cropId: string;
  cropName: string;
  cropAcreage: string | number;
  variety?: string;
  cropType?: string;
}

export const MOCK_PHOTO_FILENAMES = new Set([
  'maize-visit-oct18.jpg',
  'faw-whorl-oct18.jpg',
  'chilli-vegetative-oct27.jpg',
  'chilli-thrips-curl-oct27.jpg',
  'ramesh-tomato-oct20.jpg',
  'tomato-blight-check.jpg',
  'tomato-leafminer-oct20.jpg',
  'ramesh-turmeric-oct20.jpg',
  'turmeric-leafblotch-oct20.jpg',
  'paddy-tillering-oct19.jpg',
  'ysb-deadheart-oct19.jpg',
  'tomato-flowering-test-oct27.jpg',
  'tuta-pinworm-blotch-oct27.jpg',
  'xyz-tomato-flowering-oct25.jpg',
  'xyz-chilli-visit-oct26.jpg',
  'xyz-groundnut-peg-oct28.jpg',
]);

export function sanitizeFieldPhotos(raw: string | undefined | null): string {
  if (!raw) return '';
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s && !MOCK_PHOTO_FILENAMES.has(s.toLowerCase()))
    .join(', ');
}

export interface CapturedPhotoItem {
  id?: string;
  fileName: string;
  url: string;
  cropId?: string;
  cropName?: string;
  sectionId?: string;
  capturedAt?: string;
}

export interface FieldCameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  farmerName: string;
  farmerId?: string;
  mobileNumber?: string;
  totalAcreage?: string | number;
  activeCropId?: string;
  activeCropName: string;
  activeCropAcreage?: string | number;
  activeVariety?: string;
  activeCropType?: string;
  sectionId: string;
  sectionName: string;
  targetFieldName: string;
  currentFieldPhotos?: string;
  capturedPhotos?: CapturedPhotoItem[];
  allCropsSummary?: CropSummaryItem[];
  onPhotoSaved: (photoData: { fileName: string; url: string; photoId: string }) => void;
  onPhotoDeleted?: (fileName: string) => void;
}

export function FieldCameraCaptureModal({
  isOpen,
  onClose,
  farmerName,
  farmerId,
  mobileNumber,
  totalAcreage,
  activeCropId,
  activeCropName,
  activeCropAcreage,
  activeVariety,
  activeCropType,
  sectionId,
  sectionName,
  targetFieldName,
  currentFieldPhotos = '',
  capturedPhotos = [],
  allCropsSummary = [],
  onPhotoSaved,
  onPhotoDeleted,
}: FieldCameraCaptureModalProps) {
  // Tabs: 'camera' (take photo) | 'review' (preview before save)
  const [activeTab, setActiveTab] = useState<'camera' | 'review'>('camera');
  const [capturedDataUrl, setCapturedDataUrl] = useState<string | null>(null);
  const [notes, setNotes] = useState<string>('');
  const [stageName, setStageName] = useState<string>('Vegetative Stage');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [modalSessionPhotos, setModalSessionPhotos] = useState<CapturedPhotoItem[]>([]);

  // Camera video stream
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraPermissionDenied, setCameraPermissionDenied] = useState<boolean>(false);

  // Database Gallery State
  const [dbGallery, setDbGallery] = useState<any | null>(null);
  const [_loadingGallery, setLoadingGallery] = useState<boolean>(false);
  const [enlargedPhoto, setEnlargedPhoto] = useState<any | null>(null);

  // Effective names
  const effectiveFarmerName = farmerName?.trim() || 'Farmer';
  const rawTotalAcreage = String(totalAcreage || '10').trim();
  const effectiveTotalAcreage = rawTotalAcreage.replace(/\s*acres?\s*$/i, '') || '10';
  const effectiveCropName = activeCropName?.trim() || 'General Crop';
  const rawCropAcreage = String(activeCropAcreage || '4').trim();
  const effectiveCropAcreage = rawCropAcreage.replace(/\s*acres?\s*$/i, '') || '4';

  // Load cached live photos from localStorage on mount/open
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem('agrimart_live_field_photos');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const clean = parsed.filter(
            (p: any) =>
              p &&
              p.fileName &&
              !MOCK_PHOTO_FILENAMES.has(String(p.fileName).toLowerCase()) &&
              Boolean(p.url || p.dataUrl)
          );
          setModalSessionPhotos(clean);
        }
      }
    } catch {}
  }, [isOpen]);

  // Initialize camera stream when modal opens
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setCapturedDataUrl(null);
      setErrorMsg(null);
      setSaveSuccessMsg(null);
      setEnlargedPhoto(null);
      return;
    }

    fetchDatabaseGallery();

    if (activeTab === 'camera') {
      startCamera(facingMode);
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode, effectiveCropName]);

  // Fetch Database Gallery for this farmer
  const fetchDatabaseGallery = async () => {
    try {
      setLoadingGallery(true);
      const query = effectiveFarmerName || farmerId || '';
      const res = await fetch(
        `/api/farmer-crop-gallery?farmerName=${encodeURIComponent(query)}&farmerId=${encodeURIComponent(
          farmerId || ''
        )}`
      );
      const data = await res.json();
      if (data.success && data.gallery) {
        setDbGallery(data.gallery);
      }
    } catch (err) {
      console.warn('Error loading farmer gallery from DB:', err);
    } finally {
      setLoadingGallery(false);
    }
  };

  const startCamera = async (mode: 'environment' | 'user') => {
    stopCamera();
    setCameraPermissionDenied(false);
    setErrorMsg(null);

    try {
      if (!navigator?.mediaDevices?.getUserMedia) {
        setCameraPermissionDenied(true);
        return;
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      setStream(mediaStream);
      setCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch((err) => {
          console.warn('Video play warning:', err);
        });
      }
    } catch (err: any) {
      console.warn('Camera access could not be established:', err);
      setCameraPermissionDenied(true);
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const toggleCameraFacingMode = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  // Capture frame from video to canvas
  const handleCapturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');

    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // If front camera, flip horizontally for natural mirror feel
    if (facingMode === 'user') {
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, width, height);

    // Compress to 85% JPEG
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setCapturedDataUrl(dataUrl);
    stopCamera();
    setActiveTab('review');
  };

  // Handle device file upload or native camera app fallback
  const handleNativeFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setCapturedDataUrl(result);
        stopCamera();
        setActiveTab('review');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Retake photo
  const handleRetake = () => {
    setCapturedDataUrl(null);
    setActiveTab('camera');
    startCamera(facingMode);
  };

  // Confirm & Save Photograph to Database
  const handleSaveToDatabase = async () => {
    if (!capturedDataUrl) return;

    if (isCropPhotoLimitReached) {
      setErrorMsg(
        `Maximum 5 images allowed for a single crop. "${effectiveCropName}" already has 5 photos saved in the database. Please delete one photo to free up a slot.`
      );
      return;
    }

    try {
      setIsSaving(true);
      setErrorMsg(null);

      // Generate recognizable agronomic filename
      const safeFarmer = effectiveFarmerName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const safeCrop = effectiveCropName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const sectionTag = sectionId === 'pest-disease-tracking' ? 'pest' : 'visit';
      const timeTag = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
      const generatedFileName = `${safeFarmer}-${safeCrop}-${sectionTag}-${timeTag}.jpg`;

      const payload = {
        farmerName: effectiveFarmerName,
        farmerId: farmerId || `farmer-${Date.now()}`,
        mobileNumber: mobileNumber || '',
        totalAcreage: effectiveTotalAcreage,
        cropId: activeCropId || 'primary',
        cropName: effectiveCropName,
        cropAcreage: effectiveCropAcreage,
        variety: activeVariety || '',
        cropType: activeCropType || '',
        sectionId: sectionId || 'farmer-visit-photographs',
        sectionName: sectionName || 'Farmer Visit Photographs',
        photo: {
          url: capturedDataUrl,
          fileName: generatedFileName,
          capturedAt: new Date().toISOString(),
          stageName: stageName,
          notes: notes,
          takenBy: effectiveFarmerName,
        },
        allCropsSummary:
          allCropsSummary.length > 0
            ? allCropsSummary
            : [
                {
                  cropId: activeCropId || 'primary',
                  cropName: effectiveCropName,
                  cropAcreage: effectiveCropAcreage,
                  variety: activeVariety || '',
                  cropType: activeCropType || '',
                },
              ],
      };

      const res = await fetch('/api/farmer-crop-gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save photo to database');
      }

      const savedPhotoObj: CapturedPhotoItem = {
        id: data.savedPhoto?.id || generatedFileName,
        fileName: generatedFileName,
        url: capturedDataUrl,
        cropId: activeCropId || 'primary',
        cropName: effectiveCropName,
        sectionId: sectionId || 'farmer-visit-photographs',
        capturedAt: new Date().toISOString(),
      };

      setModalSessionPhotos((prev) => [
        savedPhotoObj,
        ...prev.filter((p) => p.fileName !== generatedFileName),
      ]);

      try {
        if (typeof window !== 'undefined') {
          const raw = localStorage.getItem('agrimart_live_field_photos');
          const existing = raw ? JSON.parse(raw) : [];
          const updated = [
            savedPhotoObj,
            ...existing.filter((p: any) => p.fileName !== generatedFileName),
          ].slice(0, 50);
          localStorage.setItem('agrimart_live_field_photos', JSON.stringify(updated));
        }
      } catch {}

      setSaveSuccessMsg(`Photo saved in database for ${effectiveCropName}!`);
      if (data.gallery) {
        setDbGallery(data.gallery);
      }

      // Update parent form input field
      onPhotoSaved({
        fileName: generatedFileName,
        url: capturedDataUrl,
        photoId: data.savedPhoto?.id || generatedFileName,
      });

      setTimeout(() => {
        setCapturedDataUrl(null);
        setActiveTab('camera');
        startCamera(facingMode);
        setIsSaving(false);
      }, 800);
    } catch (err: any) {
      console.error('Error saving field photo:', err);
      setErrorMsg(err.message || 'Could not save photograph to database');
      setIsSaving(false);
    }
  };

  // Select an existing photo from gallery into form
  // Delete a photo from database & form
  const handleDeletePhoto = async (photoId: string, photoFileName?: string) => {
    if (!confirm('Are you sure you want to delete this photograph?')) return;
    try {
      if (photoFileName && onPhotoDeleted) {
        onPhotoDeleted(photoFileName);
      }
      setModalSessionPhotos((prev) =>
        prev.filter((p) => p.id !== photoId && p.fileName !== photoFileName)
      );
      try {
        if (typeof window !== 'undefined') {
          const raw = localStorage.getItem('agrimart_live_field_photos');
          if (raw) {
            const arr = JSON.parse(raw).filter(
              (p: any) => p.id !== photoId && p.fileName !== photoFileName
            );
            localStorage.setItem('agrimart_live_field_photos', JSON.stringify(arr));
          }
        }
      } catch {}

      const res = await fetch(
        `/api/farmer-crop-gallery?farmerName=${encodeURIComponent(
          effectiveFarmerName
        )}&cropId=${encodeURIComponent(effectiveCropName)}&sectionId=${encodeURIComponent(
          sectionId || 'farmer-visit-photographs'
        )}&photoId=${encodeURIComponent(photoId)}`,
        { method: 'DELETE' }
      );
      const data = await res.json();
      if (data.success) {
        fetchDatabaseGallery();
      }
    } catch (err) {
      console.error('Error deleting photo:', err);
    }
  };

  // Active Crop photos in database strictly for this specific crop and section
  const activeCropFromDb = dbGallery?.crops?.find((c: any) => {
    const cName = String(c.cropName || '').trim().toLowerCase();
    const effName = String(effectiveCropName || '').trim().toLowerCase();
    if (cName && effName && cName === effName) return true;
    if (activeCropId && activeCropId !== 'primary' && c.cropId === activeCropId) return true;
    return false;
  });

  const targetSection = activeCropFromDb?.sections?.find((s: any) => s.sectionId === sectionId);
  const dbSectionPhotos: any[] = targetSection?.photos || [];

  // Current photos from the form field for this crop (filtering out any mock strings)
  const formPhotoNames = sanitizeFieldPhotos(currentFieldPhotos)
    .split(',')
    .map((s: string) => s.trim())
    .filter(Boolean);

  // Build the unified list of up to 5 photos strictly belonging to this crop and section
  const existingCropPhotos: any[] = [];
  const seenNames = new Set<string>();

  const matchesCurrentCrop = (p: any) => {
    const pCrop = String(p.cropName || '').trim().toLowerCase();
    const curCrop = String(effectiveCropName || '').trim().toLowerCase();
    if (pCrop && curCrop) {
      if (pCrop === curCrop) return true;
      const safeCurCrop = curCrop.replace(/[^a-z0-9]/g, '');
      const safePCrop = pCrop.replace(/[^a-z0-9]/g, '');
      if (safeCurCrop && safePCrop && (safeCurCrop === safePCrop || safePCrop.includes(safeCurCrop) || safeCurCrop.includes(safePCrop))) {
        return true;
      }
      return false;
    }
    if (p.cropId && activeCropId && p.cropId !== 'primary' && p.cropId === activeCropId) return true;
    const safeCurCrop = curCrop.replace(/[^a-z0-9]/g, '');
    const safeFile = String(p.fileName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    if (safeCurCrop && safeFile.includes(safeCurCrop)) return true;
    return false;
  };

  const matchesCurrentSection = (p: any) => {
    if (!p.sectionId) return true;
    return p.sectionId === sectionId;
  };

  // 1. First add from modalSessionPhotos (newly captured in this modal session)
  for (const p of modalSessionPhotos) {
    if (matchesCurrentCrop(p) && matchesCurrentSection(p)) {
      const fName = String(p.fileName || '').trim();
      const hasImage = Boolean(p.url || (p as any).dataUrl);
      if (fName && hasImage && !seenNames.has(fName)) {
        seenNames.add(fName);
        existingCropPhotos.push(p);
      }
    }
  }

  // 2. Add from props.capturedPhotos (passed down from parent form state)
  for (const p of (capturedPhotos || [])) {
    if (matchesCurrentCrop(p) && matchesCurrentSection(p)) {
      const fName = String(p.fileName || '').trim();
      const hasImage = Boolean(p.url || (p as any).dataUrl);
      if (fName && hasImage && !seenNames.has(fName)) {
        seenNames.add(fName);
        existingCropPhotos.push(p);
      }
    }
  }

  // 3. Add from dbSectionPhotos (synced with database)
  for (const p of dbSectionPhotos) {
    const fName = String(p.fileName || '').trim();
    const hasImage = Boolean(p.url || (p as any).dataUrl);
    if (fName && hasImage && !seenNames.has(fName) && !MOCK_PHOTO_FILENAMES.has(fName.toLowerCase())) {
      seenNames.add(fName);
      existingCropPhotos.push(p);
    }
  }

  // 4. For any filenames registered in formPhotoNames, resolve url from localStorage or props
  for (const fName of formPhotoNames) {
    if (!seenNames.has(fName) && !MOCK_PHOTO_FILENAMES.has(fName.toLowerCase())) {
      let resolvedUrl = '';
      const inProps = (capturedPhotos || []).find((p) => p.fileName === fName);
      if (inProps?.url) resolvedUrl = inProps.url;

      if (!resolvedUrl) {
        try {
          if (typeof window !== 'undefined') {
            const raw = localStorage.getItem('agrimart_live_field_photos');
            if (raw) {
              const arr = JSON.parse(raw);
              const found = arr.find((p: any) => p.fileName === fName);
              if (found?.url) resolvedUrl = found.url;
            }
          }
        } catch {}
      }

      if (resolvedUrl) {
        seenNames.add(fName);
        existingCropPhotos.push({
          id: `local-${fName}`,
          fileName: fName,
          url: resolvedUrl,
          cropName: effectiveCropName,
          sectionId,
        });
      }
    }
  }

  const activeCropPhotosCount = existingCropPhotos.length;
  const isCropPhotoLimitReached = activeCropPhotosCount >= 5;

  if (!isOpen) return null;

  return (
    <div
      style={{ zIndex: 10050 }}
      className="fixed inset-0 z-[10050] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl shadow-2xl border-2 border-emerald-500/30 overflow-hidden w-full max-w-3xl max-h-[92vh] flex flex-col text-slate-900">
        {/* ========================================================= */}
        {/* MODAL HEADER: Farmer Name, Total Farm, Active Crop Details */}
        {/* ========================================================= */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 shrink-0 border-b border-emerald-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-emerald-950 flex items-center justify-center font-black shadow-md shrink-0">
              <Camera className="w-5 h-5 text-emerald-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                  Field Camera Capture
                </h3>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Database Synced
                </span>
              </div>
              <div className="text-xs text-emerald-200 flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5">
                <span className="flex items-center gap-1 font-bold text-white">
                  <User className="w-3.5 h-3.5 text-amber-300" />
                  Farmer: <strong className="text-amber-300">{effectiveFarmerName}</strong>
                </span>
                <span>•</span>
                <span className="text-emerald-100">
                  Total Farm: <strong>{effectiveTotalAcreage} Acres</strong>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-emerald-100">
                  <Sprout className="w-3.5 h-3.5 text-emerald-300" />
                  Crop: <strong className="text-emerald-300">{effectiveCropName}</strong> ({effectiveCropAcreage} Acres)
                </span>
              </div>
            </div>
          </div>

          {/* Close Action */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Close Camera"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>


        {/* ========================================================= */}
        {/* MODAL BODY */}
        {/* ========================================================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/70">
          {/* Notifications */}
          {saveSuccessMsg && (
            <div className="mb-4 p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="mb-4 p-3 bg-rose-100 border border-rose-300 text-rose-900 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* TAB 1: LIVE CAMERA VIEW */}
          {activeTab === 'camera' && (
            <div className="space-y-4">
              {/* 5-Slot Photo Album Strip for the Active Single Crop */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 font-black text-slate-900">
                    <ImageIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{effectiveCropName} Crop Photographic Album</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                        isCropPhotoLimitReached
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      }`}
                    >
                      {activeCropPhotosCount}/5 Photos Added
                    </span>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500">
                    {isCropPhotoLimitReached ? (
                      <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Max 5/5 Photos Reached
                      </span>
                    ) : (
                      <span className="text-emerald-700 font-bold">
                        {5 - activeCropPhotosCount} {5 - activeCropPhotosCount === 1 ? 'slot' : 'slots'} available (Maximum 5 images per crop)
                      </span>
                    )}
                  </div>
                </div>

                {/* 5 Slots Grid */}
                <div className="grid grid-cols-5 gap-2">
                  {[0, 1, 2, 3, 4].map((slotIdx) => {
                    const photo = existingCropPhotos[slotIdx];
                    if (photo && (photo.url || photo.dataUrl)) {
                      return (
                        <div
                          key={photo.id || slotIdx}
                          className="group relative aspect-square bg-slate-900 rounded-xl overflow-hidden border-2 border-emerald-600 shadow-xs"
                        >
                          <img
                            src={photo.url || photo.dataUrl}
                            alt={photo.fileName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 p-1">
                            <button
                              type="button"
                              onClick={() => setEnlargedPhoto(photo)}
                              className="p-1 rounded-md bg-white/20 hover:bg-white/40 text-white cursor-pointer"
                              title="View full photo"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeletePhoto(photo.id, photo.fileName)}
                              className="p-1 rounded-md bg-rose-600/90 hover:bg-rose-700 text-white cursor-pointer"
                              title="Delete photo to free up slot"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="absolute bottom-0 inset-x-0 bg-black/75 px-1 py-0.5 text-[9px] text-white truncate text-center font-bold">
                            Photo #{slotIdx + 1}
                          </div>
                        </div>
                      );
                    }

                    const isNextAvailable = slotIdx === activeCropPhotosCount;
                    return (
                      <div
                        key={slotIdx}
                        className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center p-1 text-center transition-colors ${
                          isNextAvailable
                            ? 'border-dashed border-emerald-500 bg-emerald-50/70 text-emerald-800 ring-2 ring-emerald-200'
                            : 'border-dashed border-slate-300 bg-slate-50 text-slate-400'
                        }`}
                      >
                        <Camera className={`w-4 h-4 mb-0.5 ${isNextAvailable ? 'text-emerald-600 animate-pulse' : 'text-slate-300'}`} />
                        <span className="text-[9px] font-bold">
                          {isNextAvailable ? `Slot #${slotIdx + 1} (Next)` : `Slot #${slotIdx + 1}`}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Limit notice when 5/5 reached */}
                {isCropPhotoLimitReached && (
                  <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      Maximum limit reached: A single crop can hold at most 5 images. To add a new photo, click the trash icon on any photo above to delete it and free up a slot.
                    </span>
                  </div>
                )}
              </div>

              <div className="relative bg-black rounded-2xl overflow-hidden shadow-inner aspect-[4/3] max-h-[440px] flex items-center justify-center border-2 border-emerald-500/40">
                {/* Live Video Viewfinder */}
                <video
                  ref={videoRef}
                  playsInline
                  autoPlay
                  muted
                  className={`w-full h-full object-cover ${
                    cameraActive ? 'block' : 'hidden'
                  } ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                />

                {/* Viewfinder Crosshair & Corner Guides */}
                {cameraActive && (
                  <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4">
                    <div className="flex justify-between items-start">
                      <div className="w-8 h-8 border-t-2 border-l-2 border-emerald-400 rounded-tl-lg" />
                      <div className="bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] font-black text-emerald-300 flex items-center gap-1.5 border border-emerald-500/30">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        LIVE FIELD FEED ({facingMode === 'environment' ? 'Rear Camera' : 'Front Camera'})
                      </div>
                      <div className="w-8 h-8 border-t-2 border-r-2 border-emerald-400 rounded-tr-lg" />
                    </div>

                    {/* Center Focus Reticle */}
                    <div className="self-center flex items-center justify-center">
                      <div className="w-14 h-14 border border-emerald-400/50 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-emerald-400/80" />
                      </div>
                    </div>

                    <div className="flex justify-between items-end">
                      <div className="w-8 h-8 border-b-2 border-l-2 border-emerald-400 rounded-bl-lg" />
                      <div className="bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] text-white/90">
                        {effectiveCropName} • {sectionName}
                      </div>
                      <div className="w-8 h-8 border-b-2 border-r-2 border-emerald-400 rounded-br-lg" />
                    </div>
                  </div>
                )}

                {/* Camera Permission / Fallback Message */}
                {cameraPermissionDenied && (
                  <div className="p-6 text-center text-white max-w-md space-y-3">
                    <div className="w-12 h-12 rounded-full bg-white/10 text-amber-300 flex items-center justify-center mx-auto">
                      <Camera className="w-6 h-6" />
                    </div>
                    <div className="font-extrabold text-sm sm:text-base text-white">
                      Direct Browser Camera Feed Unavailable
                    </div>
                    <p className="text-xs text-white/70">
                      Camera permission was not granted or this browser requires device file capture. You can take a photo immediately with your device camera below.
                    </p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-extrabold text-xs shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 mx-auto cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Take Photo with Device Camera</span>
                    </button>
                  </div>
                )}

                <canvas ref={canvasRef} className="hidden" />
              </div>

              {/* Bottom Controls Bar */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
                {/* Switch Camera */}
                <button
                  type="button"
                  onClick={toggleCameraFacingMode}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Switch between front and back camera"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Flip Camera</span>
                </button>

                {/* Shutter Button */}
                <button
                  type="button"
                  onClick={handleCapturePhoto}
                  disabled={!cameraActive || isCropPhotoLimitReached}
                  className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all cursor-pointer ${
                    cameraActive && !isCropPhotoLimitReached
                      ? 'bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 text-white hover:scale-105 active:scale-95 ring-4 ring-emerald-200'
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-50'
                  }`}
                  title={
                    isCropPhotoLimitReached
                      ? `Maximum 5 photographs reached for ${effectiveCropName}`
                      : 'Capture photograph'
                  }
                >
                  <Camera className="w-7 h-7" />
                </button>

                {/* Native Device File / Camera Fallback */}
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    disabled={isCropPhotoLimitReached}
                    onChange={handleNativeFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={isCropPhotoLimitReached}
                    onClick={() => {
                      if (isCropPhotoLimitReached) {
                        alert(
                          `Maximum 5 photos reached for ${effectiveCropName}. Please delete an existing photo to upload a new one.`
                        );
                        return;
                      }
                      fileInputRef.current?.click();
                    }}
                    className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                      isCropPhotoLimitReached
                        ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-60'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Device Camera / File</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: REVIEW CAPTURED PHOTO BEFORE DATABASE SAVE */}
          {activeTab === 'review' && capturedDataUrl && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                {/* Image Preview */}
                <div className="md:col-span-7 bg-black rounded-2xl overflow-hidden shadow-md flex items-center justify-center aspect-[4/3] max-h-[380px] border border-emerald-500/30">
                  <img
                    src={capturedDataUrl}
                    alt="Captured Field Crop"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Metadata & Tagging Form */}
                <div className="md:col-span-5 flex flex-col justify-between space-y-4">
                  <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200">
                    <div className="flex items-center gap-2 text-xs font-black uppercase text-emerald-800 border-b border-emerald-100 pb-2">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>Photo Tagging & Agronomy Details</span>
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="text-slate-500 font-semibold">Farmer & Crop</div>
                      <div className="font-extrabold text-slate-900">
                        {effectiveFarmerName} &bull; {effectiveCropName} ({effectiveCropAcreage} Acres)
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="text-slate-500 font-semibold">Section</div>
                      <div className="font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
                        {sectionName}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">
                        Observed Crop Stage
                      </label>
                      <select
                        value={stageName}
                        onChange={(e) => setStageName(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="Land Preparation">Stage 1: Land Preparation & Sowing</option>
                        <option value="Vegetative Stage">Stage 2: Vegetative Growth / Knee-High</option>
                        <option value="Flowering Stage">Stage 3: Flowering & Fruit Set / Tasseling</option>
                        <option value="Maturity & Grain Formation">Stage 4: Maturity & Grain Formation</option>
                        <option value="Harvest Ready">Stage 5: Harvest Ready</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">
                        Field Observation / Remarks (Optional)
                      </label>
                      <textarea
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g. Flower clusters healthy, uniform branching, pest symptoms absent..."
                        className="w-full px-3 py-2 text-xs font-medium bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="space-y-2 pt-2">
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={handleSaveToDatabase}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Saving to Database...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 text-amber-300" />
                          <span>Confirm & Save to Database</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleRetake}
                      disabled={isSaving}
                      className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Retake Photo</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}


        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100/90 px-5 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Database Storage: <strong>Active & Synced</strong></span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>

      {/* Enlarged Lightbox Modal */}
      {enlargedPhoto && (
        <div
          style={{ zIndex: 10060 }}
          className="fixed inset-0 z-[10060] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setEnlargedPhoto(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl p-2 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3 border-b border-slate-800">
              <div className="font-bold text-sm truncate">{enlargedPhoto.fileName}</div>
              <button
                type="button"
                onClick={() => setEnlargedPhoto(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-2 flex items-center justify-center max-h-[75vh] overflow-hidden">
              <img
                src={enlargedPhoto.url}
                alt={enlargedPhoto.fileName}
                className="max-h-[70vh] w-auto object-contain rounded-lg"
              />
            </div>
            {enlargedPhoto.notes && (
              <div className="p-3 bg-slate-950/80 text-xs text-slate-300">
                <strong>Observations:</strong> {enlargedPhoto.notes}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

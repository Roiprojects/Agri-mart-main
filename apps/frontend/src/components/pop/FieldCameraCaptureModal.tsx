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
  Maximize2,
  FolderTree,
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
  allCropsSummary?: CropSummaryItem[];
  onPhotoSaved: (photoData: { fileName: string; url: string; photoId: string }) => void;
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
  allCropsSummary = [],
  onPhotoSaved,
}: FieldCameraCaptureModalProps) {
  // Tabs: 'camera' (take photo) | 'review' (preview before save) | 'gallery' (view DB photos)
  const [activeTab, setActiveTab] = useState<'camera' | 'review' | 'gallery'>('camera');
  const [capturedDataUrl, setCapturedDataUrl] = useState<string | null>(null);
  const [notes, setNotes] = useState<string>('');
  const [stageName, setStageName] = useState<string>('Vegetative Stage');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
  const [loadingGallery, setLoadingGallery] = useState<boolean>(false);
  const [enlargedPhoto, setEnlargedPhoto] = useState<any | null>(null);
  const [activeGalleryCrop, setActiveGalleryCrop] = useState<string>('');

  // Effective names
  const effectiveFarmerName = farmerName?.trim() || 'Farmer';
  const effectiveTotalAcreage = totalAcreage || '10';
  const effectiveCropName = activeCropName?.trim() || 'General Crop';
  const effectiveCropAcreage = activeCropAcreage || '4';

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
  }, [isOpen, facingMode]);

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
        if (data.gallery.crops && data.gallery.crops.length > 0) {
          setActiveGalleryCrop(data.gallery.crops[0].cropId);
        }
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

      setSaveSuccessMsg(`Photo saved in database for ${effectiveCropName}!`);
      setDbGallery(data.gallery);

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
  const handleSelectPhotoFromGallery = (photo: any, cropItem: any) => {
    onPhotoSaved({
      fileName: photo.fileName,
      url: photo.url,
      photoId: photo.id,
    });
    setSaveSuccessMsg(`Selected ${photo.fileName} from ${cropItem.cropName}!`);
    setTimeout(() => {
      onClose();
    }, 800);
  };

  // Delete a photo from database
  const handleDeletePhoto = async (cropId: string, pSectionId: string, photoId: string) => {
    if (!confirm('Are you sure you want to delete this photograph from the database?')) return;
    try {
      const res = await fetch(
        `/api/farmer-crop-gallery?farmerName=${encodeURIComponent(
          effectiveFarmerName
        )}&cropId=${encodeURIComponent(cropId)}&sectionId=${encodeURIComponent(
          pSectionId
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

  // Active Crop photos in database for this specific single crop
  const activeCropFromDb = dbGallery?.crops?.find(
    (c: any) =>
      (activeCropId && c.cropId === activeCropId) ||
      c.cropName?.toLowerCase() === effectiveCropName.toLowerCase()
  );

  const existingCropPhotos: any[] =
    activeCropFromDb?.sections?.flatMap((s: any) => s.photos || []) || [];

  const activeCropPhotosCount = existingCropPhotos.length;
  const isCropPhotoLimitReached = activeCropPhotosCount >= 5;

  if (!isOpen) return null;

  // Calculate total photos in gallery
  const totalGalleryPhotos =
    dbGallery?.crops?.reduce((acc: number, c: any) => {
      return acc + (c.sections?.reduce((sAcc: number, s: any) => sAcc + (s.photos?.length || 0), 0) || 0);
    }, 0) || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
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

        {/* Section Context Ribbon */}
        <div className="bg-amber-50/90 border-b border-amber-200 px-5 py-2 flex flex-wrap items-center justify-between text-xs text-amber-950">
          <div className="flex items-center gap-2 font-semibold">
            <FolderTree className="w-3.5 h-3.5 text-amber-700" />
            <span>Target Section:</span>
            <span className="font-extrabold bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-md">
              {sectionName}
            </span>
            <span className="text-amber-800/80">({effectiveCropName} Plot)</span>
          </div>
          <div className="text-[11px] text-amber-800">
            Photos will be stored in database under: <strong>{effectiveFarmerName} &gt; {effectiveCropName} &gt; {sectionName}</strong>
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
                    if (photo) {
                      return (
                        <div
                          key={photo.id || slotIdx}
                          className="group relative aspect-square bg-slate-900 rounded-xl overflow-hidden border-2 border-emerald-600 shadow-xs"
                        >
                          <img
                            src={photo.url}
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
                              onClick={() =>
                                handleDeletePhoto(
                                  activeCropFromDb?.cropId || activeCropId || 'primary',
                                  sectionId || 'farmer-visit-photographs',
                                  photo.id
                                )
                              }
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

          {/* TAB 3: VIEW STORED DATABASE GALLERY (Structured exactly as requested) */}
          {activeTab === 'gallery' && (
            <div className="space-y-5">
              {/* Database Structure Banner */}
              <div className="bg-gradient-to-r from-emerald-950 to-teal-900 text-white p-4 rounded-2xl shadow-sm border border-emerald-600/40">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase font-extrabold text-emerald-400 tracking-wider">
                      Database Photographic Storage Hierarchy
                    </div>
                    <h4 className="text-base sm:text-lg font-black text-white mt-0.5 flex items-center gap-2">
                      <User className="w-4 h-4 text-amber-300" />
                      1st: {dbGallery?.farmerName || effectiveFarmerName}
                      <span className="text-xs font-bold bg-amber-400 text-emerald-950 px-2 py-0.5 rounded-md">
                        {dbGallery?.totalAcreage || effectiveTotalAcreage} Acres Total
                      </span>
                    </h4>
                    <p className="text-xs text-emerald-200 mt-1">
                      Contains {dbGallery?.crops?.length || 0} Crops &bull; Each crop has its own separate named sections and photographs.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('camera');
                      startCamera(facingMode);
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-emerald-950 font-black text-xs shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Camera className="w-4 h-4 text-emerald-950" />
                    <span>Capture New Photo</span>
                  </button>
                </div>
              </div>

              {/* Crop Selector Tabs (e.g. Tomato, Chilli, Maize) */}
              <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-[11px] font-black uppercase text-slate-500 mb-2 px-1 flex items-center gap-1.5">
                  <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Select Crop to View Separate Photographs ({dbGallery?.crops?.length || 0} Crops):</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {dbGallery?.crops?.map((cropItem: any) => {
                    const isSelected =
                      activeGalleryCrop === cropItem.cropId ||
                      (!activeGalleryCrop && cropItem.cropId === dbGallery?.crops?.[0]?.cropId);

                    const cropPhotoCount =
                      cropItem.sections?.reduce(
                        (acc: number, s: any) => acc + (s.photos?.length || 0),
                        0
                      ) || 0;

                    return (
                      <button
                        key={cropItem.cropId}
                        type="button"
                        onClick={() => setActiveGalleryCrop(cropItem.cropId)}
                        className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer border-2 ${
                          isSelected
                            ? 'bg-gradient-to-r from-emerald-700 to-teal-700 text-white border-emerald-800 shadow-md scale-[1.02]'
                            : 'bg-slate-50 hover:bg-emerald-50 text-slate-800 border-slate-200'
                        }`}
                      >
                        <span>{cropItem.cropName}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {cropItem.cropAcreage || '0'} Ac ({cropPhotoCount} Photos)
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Display Sections & Photos for the Selected Crop */}
              {(() => {
                const selectedCrop =
                  dbGallery?.crops?.find(
                    (c: any) =>
                      c.cropId === activeGalleryCrop ||
                      (!activeGalleryCrop && c.cropId === dbGallery?.crops?.[0]?.cropId)
                  ) || dbGallery?.crops?.[0];

                if (!selectedCrop) {
                  return (
                    <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
                      No crop sections stored yet. Capture a photo to populate the database.
                    </div>
                  );
                }

                return (
                  <div className="space-y-4">
                    <div className="bg-emerald-50/80 border border-emerald-200 p-3 rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-emerald-900 text-sm">
                          {selectedCrop.cropName} Crop Plot
                        </span>
                        <span className="text-emerald-700 font-bold">
                          ({selectedCrop.cropAcreage || '0'} Acres &bull; Variety: {selectedCrop.variety || 'Standard'})
                        </span>
                      </div>
                      <span className="text-[11px] font-extrabold bg-emerald-200/80 text-emerald-900 px-2.5 py-0.5 rounded-md">
                        {selectedCrop.sections?.length || 0} Named Sections
                      </span>
                    </div>

                    {/* Loop through each named section for this crop */}
                    {selectedCrop.sections?.map((sectionItem: any) => (
                      <div
                        key={sectionItem.sectionId}
                        className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
                      >
                        <div className="bg-slate-100/90 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FolderTree className="w-4 h-4 text-emerald-700" />
                            <h5 className="font-extrabold text-xs text-slate-900">
                              {sectionItem.sectionName}
                            </h5>
                          </div>
                          <span className="text-[11px] font-bold text-slate-600">
                            {sectionItem.photos?.length || 0}{' '}
                            {sectionItem.photos?.length === 1 ? 'Photograph' : 'Photographs'}
                          </span>
                        </div>

                        {/* Photo Grid */}
                        <div className="p-4">
                          {(!sectionItem.photos || sectionItem.photos.length === 0) && (
                            <div className="p-6 text-center text-slate-400 text-xs italic">
                              No photographs captured for this section yet.
                            </div>
                          )}

                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {sectionItem.photos?.map((photo: any) => (
                              <div
                                key={photo.id}
                                className="group relative bg-slate-50 rounded-xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col"
                              >
                                <div className="relative aspect-[4/3] bg-black overflow-hidden">
                                  <img
                                    src={photo.url}
                                    alt={photo.fileName}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setEnlargedPhoto(photo)}
                                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                                    title="Click to view full photo"
                                  >
                                    <Maximize2 className="w-5 h-5" />
                                  </button>
                                </div>

                                <div className="p-2.5 flex-1 flex flex-col justify-between space-y-1.5 text-[11px]">
                                  <div>
                                    <div className="font-bold text-slate-900 truncate" title={photo.fileName}>
                                      {photo.fileName}
                                    </div>
                                    {photo.stageName && (
                                      <div className="text-[10px] text-emerald-700 font-semibold truncate">
                                        {photo.stageName}
                                      </div>
                                    )}
                                    {photo.notes && (
                                      <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5">
                                        {photo.notes}
                                      </p>
                                    )}
                                  </div>

                                  <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between gap-1">
                                    <button
                                      type="button"
                                      onClick={() => handleSelectPhotoFromGallery(photo, selectedCrop)}
                                      className="px-2 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] flex items-center gap-1 transition-colors cursor-pointer"
                                      title="Set this photo in the POP Photographs input"
                                    >
                                      <Check className="w-3 h-3" />
                                      <span>Use</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleDeletePhoto(selectedCrop.cropId, sectionItem.sectionId, photo.id)
                                      }
                                      className="p-1 rounded-md text-rose-600 hover:bg-rose-50 hover:text-rose-800 transition-colors cursor-pointer"
                                      title="Delete photograph from database"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
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
          className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4"
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

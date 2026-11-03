'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload,
  Globe,
  Camera,
  X,
  Edit2,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  ZoomIn,
  ZoomOut,
  Sliders,
  Check,
  RefreshCw,
  Sparkles,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

interface ImageEditorFieldProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  tooltip?: string;
  shape?: 'square' | 'circle' | 'rectangle';
  previewHeight?: string;
  showDropzoneAlways?: boolean;
}

export function ImageEditorField({
  value,
  onChange,
  label,
  tooltip,
  shape = 'rectangle',
  previewHeight = 'h-28',
  showDropzoneAlways = false,
}: ImageEditorFieldProps) {
  // Source selection modals
  const [sourceModalOpen, setSourceModalOpen] = useState(false);
  const [activeSourceTab, setActiveSourceTab] = useState<'device' | 'url'>('device');
  const [urlInput, setUrlInput] = useState('');
  const [urlError, setUrlError] = useState(false);
  const [urlLoading, setUrlLoading] = useState(false);

  // Edit / Transform modal
  const [editorModalOpen, setEditorModalOpen] = useState(false);
  const [originalImage, setOriginalImage] = useState<string>(value || '');
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [grayscale, setGrayscale] = useState(false);
  const [sepia, setSepia] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Sync original image when value changes
  useEffect(() => {
    if (value) {
      setOriginalImage(value);
    }
  }, [value]);

  // Handle local file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    // reset input
    if (e.target) e.target.value = '';
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, WebP, GIF, SVG).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        onChange(dataUrl);
        setOriginalImage(dataUrl);
        setSourceModalOpen(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Drag & Drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Handle URL submission
  const handleUrlSubmit = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;

    setUrlLoading(true);
    setUrlError(false);

    // Verify image loads
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setUrlLoading(false);
      onChange(trimmed);
      setOriginalImage(trimmed);
      setUrlInput('');
      setSourceModalOpen(false);
    };
    img.onerror = () => {
      setUrlLoading(false);
      // Still allow applying if user insists or Google image has anti-hotlinking
      if (confirm('Image preview failed to load from this URL. Apply anyway?')) {
        onChange(trimmed);
        setOriginalImage(trimmed);
        setUrlInput('');
        setSourceModalOpen(false);
      } else {
        setUrlError(true);
      }
    };
    img.src = trimmed;
  };

  // Open Image Editor Modal
  const openEditor = () => {
    if (!value) return;
    setZoom(1);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setBrightness(100);
    setContrast(100);
    setGrayscale(false);
    setSepia(false);
    setEditorModalOpen(true);
  };

  // Render Canvas with transforms
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !originalImage) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const w = img.naturalWidth || 400;
      const h = img.naturalHeight || 400;

      // Handle rotated dimensions
      const is90or270 = rotation % 180 !== 0;
      canvas.width = is90or270 ? h : w;
      canvas.height = is90or270 ? w : h;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();

      // Apply CSS Filters directly to canvas context
      const filterParts = [
        `brightness(${brightness}%)`,
        `contrast(${contrast}%)`,
        grayscale ? 'grayscale(100%)' : '',
        sepia ? 'sepia(100%)' : '',
      ]
        .filter(Boolean)
        .join(' ');

      ctx.filter = filterParts || 'none';

      // Translate to center for rotation & flip
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flipH ? -zoom : zoom, flipV ? -zoom : zoom);

      // Draw image centered
      ctx.drawImage(img, -w / 2, -h / 2, w, h);
      ctx.restore();
    };
    img.src = originalImage;
  }, [originalImage, zoom, rotation, flipH, flipV, brightness, contrast, grayscale, sepia]);

  useEffect(() => {
    if (editorModalOpen) {
      renderCanvas();
    }
  }, [editorModalOpen, renderCanvas]);

  // Apply Changes from Canvas
  const applyEditedImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      onChange(dataUrl);
      setOriginalImage(dataUrl);
      setEditorModalOpen(false);
    } catch {
      alert('Could not export canvas image due to cross-origin restriction. Try uploading the image file directly.');
      setEditorModalOpen(false);
    }
  };

  return (
    <div className="space-y-2">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Label if provided */}
      {label && (
        <div className="flex items-center gap-1 text-xs font-semibold text-slate-700">
          <span>{label}</span>
          {tooltip && (
            <span
              title={tooltip}
              className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[#3c8dbc] text-white text-[10px] font-bold cursor-help"
            >
              ?
            </span>
          )}
        </div>
      )}

      {/* Main Image Container */}
      {value ? (
        <div className="space-y-2">
          <div className="relative inline-block border border-slate-300 rounded-md p-1.5 bg-white shadow-2xs group">
            {shape === 'circle' ? (
              <img
                src={value}
                alt="Preview"
                className={`w-24 h-24 rounded-full object-cover border border-slate-200`}
              />
            ) : (
              <img
                src={value}
                alt="Preview"
                className={`max-w-[200px] ${previewHeight} object-contain rounded border border-slate-100 bg-slate-50`}
              />
            )}

            {/* Quick remove button */}
            <button
              type="button"
              onClick={() => onChange('')}
              title="Remove image"
              className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 shadow-md transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

          {/* Action buttons bar */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={openEditor}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-[#d2d6de] hover:bg-slate-50 rounded shadow-2xs transition cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5 text-[#3c8dbc]" />
              <span>Edit / Crop Image</span>
            </button>

            <button
              type="button"
              onClick={() => setSourceModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-white bg-[#2489c5] hover:bg-[#1f72a3] rounded shadow-2xs transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Change Image</span>
            </button>

            <button
              type="button"
              onClick={() => onChange('')}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      ) : (
        /* Empty Dropzone / Upload area matching nopCommerce styling */
        <div className="space-y-2">
          <div
            onClick={() => setSourceModalOpen(true)}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-[#d2d6de] hover:border-[#3c8dbc] rounded-md bg-[#f9fafb] hover:bg-[#f0f7fb] p-5 text-center cursor-pointer transition select-none group"
          >
            <div className="flex flex-col items-center justify-center gap-1.5">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-[#3c8dbc] flex items-center justify-center group-hover:scale-105 transition">
                <Upload className="w-5 h-5 stroke-[2]" />
              </div>
              <p className="text-xs text-slate-700 font-medium">
                Drop image here to upload, or{' '}
                <span className="text-[#3c8dbc] underline font-semibold">Browse device</span>
              </p>
              <p className="text-[11px] text-slate-500">
                Or paste a website / Google image URL
              </p>
            </div>
          </div>

          {/* Quick URL shortcut input */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Or paste website / Google image URL here..."
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleUrlSubmit();
                  }
                }}
                className="w-full text-xs pl-8 pr-3 py-1.5 rounded border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none bg-white text-slate-800"
              />
            </div>
            <button
              type="button"
              disabled={!urlInput.trim() || urlLoading}
              onClick={handleUrlSubmit}
              className="bg-[#2489c5] hover:bg-[#1f72a3] disabled:opacity-50 text-white text-xs font-semibold px-3 py-1.5 rounded shadow-2xs cursor-pointer transition flex items-center gap-1"
            >
              {urlLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              <span>Apply</span>
            </button>
          </div>
        </div>
      )}

      {/* ── SOURCE MODAL: Pick from Local Device OR Website / Google URL ── */}
      {sourceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-2xs animate-in fade-in duration-150">
          <div className="bg-white rounded-lg border border-slate-300 shadow-2xl max-w-lg w-full overflow-hidden text-slate-800">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#3c8dbc]" />
                <h3 className="text-sm font-semibold text-slate-800">
                  Select Image: Local Device or Website URL
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSourceModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 rounded p-1 hover:bg-slate-200 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 text-xs font-semibold bg-slate-100/50">
              <button
                type="button"
                onClick={() => setActiveSourceTab('device')}
                className={`flex-1 py-2.5 px-4 text-center border-b-2 flex items-center justify-center gap-2 cursor-pointer transition ${
                  activeSourceTab === 'device'
                    ? 'border-[#2489c5] text-[#2489c5] bg-white font-bold'
                    : 'border-transparent text-slate-600 hover:text-slate-800'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>Upload from Device</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveSourceTab('url')}
                className={`flex-1 py-2.5 px-4 text-center border-b-2 flex items-center justify-center gap-2 cursor-pointer transition ${
                  activeSourceTab === 'url'
                    ? 'border-[#2489c5] text-[#2489c5] bg-white font-bold'
                    : 'border-transparent text-slate-600 hover:text-slate-800'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>Website / Google Image URL</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              {activeSourceTab === 'device' ? (
                <div className="space-y-3">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className="border-2 border-dashed border-[#2489c5] rounded-lg p-8 text-center bg-blue-50/40 hover:bg-blue-50/80 cursor-pointer transition group"
                  >
                    <Upload className="w-10 h-10 text-[#2489c5] mx-auto mb-2 group-hover:scale-110 transition" />
                    <p className="text-sm font-semibold text-slate-800">
                      Click to choose image file from your device
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Supports JPG, PNG, WEBP, GIF, SVG up to 10MB
                    </p>
                    <button
                      type="button"
                      className="mt-3 px-4 py-1.5 rounded bg-[#2489c5] hover:bg-[#1f72a3] text-white text-xs font-semibold shadow-xs"
                    >
                      Browse Files
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  <p className="text-slate-600">
                    Paste any direct image URL from Google Images, Unsplash, or any website.
                  </p>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Image URL:
                    </label>
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => {
                        setUrlInput(e.target.value);
                        setUrlError(false);
                      }}
                      placeholder="https://example.com/image.jpg or Google image link"
                      className="w-full text-xs px-3 py-2 rounded border border-[#d2d6de] focus:border-[#3c8dbc] outline-none"
                    />
                  </div>

                  {urlError && (
                    <p className="text-xs text-red-600 font-medium">
                      Could not load preview from this URL. Please verify the link.
                    </p>
                  )}

                  {urlInput.trim() && (
                    <div className="border border-slate-200 rounded p-2 bg-slate-50">
                      <span className="text-[11px] font-bold text-slate-500 block mb-1">
                        URL Preview:
                      </span>
                      <img
                        src={urlInput.trim()}
                        alt="URL Preview"
                        className="max-h-36 max-w-full rounded object-contain mx-auto border border-slate-200 bg-white"
                        onError={() => setUrlError(true)}
                        onLoad={() => setUrlError(false)}
                      />
                    </div>
                  )}

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      disabled={!urlInput.trim() || urlLoading}
                      onClick={handleUrlSubmit}
                      className="px-4 py-2 bg-[#2489c5] hover:bg-[#1f72a3] disabled:opacity-50 text-white rounded text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      {urlLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                      <span>Use this URL</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setSourceModalOpen(false)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── IMAGE EDITOR MODAL: Full Transform / Crop / Rotate / Adjust ── */}
      {editorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-lg border border-slate-300 shadow-2xl max-w-3xl w-full overflow-hidden text-slate-800 flex flex-col max-h-[92vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#3c8dbc]" />
                <h3 className="text-sm font-semibold text-slate-800">
                  Image Editor &amp; Adjustments
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditorModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 rounded p-1 hover:bg-slate-200 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Editor Body */}
            <div className="p-5 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-12 gap-5">
              {/* Left / Top: Interactive Canvas Preview */}
              <div className="md:col-span-8 flex flex-col items-center justify-center bg-slate-900 rounded-lg p-3 min-h-[300px] overflow-hidden relative">
                <canvas
                  ref={canvasRef}
                  className="max-w-full max-h-[360px] object-contain shadow-lg rounded"
                />

                <span className="absolute bottom-2 left-2 text-[10px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                  Live Preview • Zoom: {Math.round(zoom * 100)}% • Rotation: {rotation}°
                </span>
              </div>

              {/* Right: Controls & Adjustments */}
              <div className="md:col-span-4 space-y-4 text-xs">
                {/* Transform: Rotate & Flip */}
                <div>
                  <label className="font-semibold text-slate-700 block mb-1.5">
                    Rotate &amp; Flip
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setRotation((r) => (r - 90 + 360) % 360)}
                      title="Rotate 90° Left"
                      className="p-2 border border-slate-300 rounded bg-white hover:bg-slate-50 flex flex-col items-center justify-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-700" />
                      <span className="text-[10px]">-90°</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRotation((r) => (r + 90) % 360)}
                      title="Rotate 90° Right"
                      className="p-2 border border-slate-300 rounded bg-white hover:bg-slate-50 flex flex-col items-center justify-center gap-1 cursor-pointer"
                    >
                      <RotateCw className="w-3.5 h-3.5 text-slate-700" />
                      <span className="text-[10px]">+90°</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFlipH((f) => !f)}
                      title="Flip Horizontal"
                      className={`p-2 border rounded flex flex-col items-center justify-center gap-1 cursor-pointer ${
                        flipH ? 'bg-blue-50 border-[#3c8dbc] text-[#3c8dbc]' : 'border-slate-300 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <FlipHorizontal className="w-3.5 h-3.5" />
                      <span className="text-[10px]">Flip H</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFlipV((f) => !f)}
                      title="Flip Vertical"
                      className={`p-2 border rounded flex flex-col items-center justify-center gap-1 cursor-pointer ${
                        flipV ? 'bg-blue-50 border-[#3c8dbc] text-[#3c8dbc]' : 'border-slate-300 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <FlipVertical className="w-3.5 h-3.5" />
                      <span className="text-[10px]">Flip V</span>
                    </button>
                  </div>
                </div>

                {/* Zoom / Scale Slider */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-700">Zoom / Scale</label>
                    <span className="text-[11px] font-mono text-slate-500">
                      {Math.round(zoom * 100)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ZoomOut className="w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.05"
                      value={zoom}
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="w-full accent-[#3c8dbc] cursor-pointer"
                    />
                    <ZoomIn className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>

                {/* Brightness Slider */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-700">Brightness</label>
                    <span className="text-[11px] font-mono text-slate-500">{brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    step="5"
                    value={brightness}
                    onChange={(e) => setBrightness(parseInt(e.target.value))}
                    className="w-full accent-[#3c8dbc] cursor-pointer"
                  />
                </div>

                {/* Contrast Slider */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-700">Contrast</label>
                    <span className="text-[11px] font-mono text-slate-500">{contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    step="5"
                    value={contrast}
                    onChange={(e) => setContrast(parseInt(e.target.value))}
                    className="w-full accent-[#3c8dbc] cursor-pointer"
                  />
                </div>

                {/* Color Filters */}
                <div>
                  <label className="font-semibold text-slate-700 block mb-1.5">Filters</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setGrayscale((g) => !g)}
                      className={`px-2.5 py-1.5 rounded border text-xs font-medium cursor-pointer transition ${
                        grayscale
                          ? 'bg-[#3c8dbc] text-white border-[#3c8dbc]'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      B&amp;W Grayscale
                    </button>
                    <button
                      type="button"
                      onClick={() => setSepia((s) => !s)}
                      className={`px-2.5 py-1.5 rounded border text-xs font-medium cursor-pointer transition ${
                        sepia
                          ? 'bg-[#3c8dbc] text-white border-[#3c8dbc]'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      Vintage Sepia
                    </button>
                  </div>
                </div>

                {/* Reset button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setZoom(1);
                      setRotation(0);
                      setFlipH(false);
                      setFlipV(false);
                      setBrightness(100);
                      setContrast(100);
                      setGrayscale(false);
                      setSepia(false);
                    }}
                    className="w-full py-1.5 text-xs text-slate-600 hover:text-slate-800 border border-slate-300 rounded hover:bg-slate-100 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset All Adjustments</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setEditorModalOpen(false)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={applyEditedImage}
                className="px-4 py-1.5 bg-[#2489c5] hover:bg-[#1f72a3] text-white text-xs font-semibold rounded shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Save &amp; Apply Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

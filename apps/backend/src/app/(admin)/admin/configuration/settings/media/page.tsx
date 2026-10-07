'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Save,
  Minus,
  Plus,
  CheckCircle2,
  AlertCircle,
  Info,
  Box,
  FileText,
  Upload,
  X,
  Image as ImageIcon,
} from 'lucide-react';

function HelpTooltip({ text }: { text: string }) {
  return (
    <span
      title={text}
      className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[#3c8dbc] text-white text-[10px] font-bold cursor-help shrink-0 select-none shadow-2xs"
    >
      ?
    </span>
  );
}

export default function MediaSettingsPage() {
  const [isAdvanced, setIsAdvanced] = useState(true);

  // Collapse states
  const [commonOpen, setCommonOpen] = useState(true);
  const [productOpen, setProductOpen] = useState(true);
  const [otherPagesOpen, setOtherPagesOpen] = useState(true);

  // Card 1: Common Settings (media_1791365726119.png & media_1791365739539.png)
  const [pictureStorageTarget, setPictureStorageTarget] = useState('database');
  const [maximumImageSize, setMaximumImageSize] = useState<number | string>(1920);
  const [multipleThumbDirectories, setMultipleThumbDirectories] = useState(false);
  const [defaultImageQuality, setDefaultImageQuality] = useState<number | string>(80);
  const [importProductImagesUsingHash, setImportProductImagesUsingHash] = useState(true);
  const [pictureZoom, setPictureZoom] = useState(false);
  const [allowSvgUploadsInAdminArea, setAllowSvgUploadsInAdminArea] = useState(false);

  // Card 2: Product (media_1791365726119.png)
  const [productDetailImageSize, setProductDetailImageSize] = useState<number | string>(750);
  const [productThumbnailImageSizeCatalog, setProductThumbnailImageSizeCatalog] = useState<number | string>(400);
  const [productThumbnailImageSizeProductPage, setProductThumbnailImageSizeProductPage] = useState<number | string>(750);
  const [associatedProductImageSize, setAssociatedProductImageSize] = useState<number | string>(350);
  const [defaultImageUrl, setDefaultImageUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Card 3: Other pages (media_1791365737147.png)
  const [categoryThumbnailImageSize, setCategoryThumbnailImageSize] = useState<number | string>(600);
  const [manufacturerThumbnailImageSize, setManufacturerThumbnailImageSize] = useState<number | string>(300);
  const [vendorThumbnailImageSize, setVendorThumbnailImageSize] = useState<number | string>(300);
  const [cartWishlistThumbnailImageSize, setCartWishlistThumbnailImageSize] = useState<number | string>(90);
  const [orderThumbnailImageSize, setOrderThumbnailImageSize] = useState<number | string>(80);
  const [miniShoppingCartThumbnailImageSize, setMiniShoppingCartThumbnailImageSize] = useState<number | string>(70);
  const [avatarImageSize, setAvatarImageSize] = useState<number | string>(120);

  // Status & Notification
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Load settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/admin/settings/media');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            const d = json.data;
            if (d.pictureStorageTarget !== undefined) setPictureStorageTarget(d.pictureStorageTarget);
            if (d.maximumImageSize !== undefined) setMaximumImageSize(d.maximumImageSize);
            if (d.multipleThumbDirectories !== undefined) setMultipleThumbDirectories(d.multipleThumbDirectories);
            if (d.defaultImageQuality !== undefined) setDefaultImageQuality(d.defaultImageQuality);
            if (d.importProductImagesUsingHash !== undefined) setImportProductImagesUsingHash(d.importProductImagesUsingHash);
            if (d.pictureZoom !== undefined) setPictureZoom(d.pictureZoom);
            if (d.allowSvgUploadsInAdminArea !== undefined) setAllowSvgUploadsInAdminArea(d.allowSvgUploadsInAdminArea);

            if (d.productDetailImageSize !== undefined) setProductDetailImageSize(d.productDetailImageSize);
            if (d.productThumbnailImageSizeCatalog !== undefined) setProductThumbnailImageSizeCatalog(d.productThumbnailImageSizeCatalog);
            if (d.productThumbnailImageSizeProductPage !== undefined) setProductThumbnailImageSizeProductPage(d.productThumbnailImageSizeProductPage);
            if (d.associatedProductImageSize !== undefined) setAssociatedProductImageSize(d.associatedProductImageSize);
            if (d.defaultImageUrl !== undefined) setDefaultImageUrl(d.defaultImageUrl);

            if (d.categoryThumbnailImageSize !== undefined) setCategoryThumbnailImageSize(d.categoryThumbnailImageSize);
            if (d.manufacturerThumbnailImageSize !== undefined) setManufacturerThumbnailImageSize(d.manufacturerThumbnailImageSize);
            if (d.vendorThumbnailImageSize !== undefined) setVendorThumbnailImageSize(d.vendorThumbnailImageSize);
            if (d.cartWishlistThumbnailImageSize !== undefined) setCartWishlistThumbnailImageSize(d.cartWishlistThumbnailImageSize);
            if (d.orderThumbnailImageSize !== undefined) setOrderThumbnailImageSize(d.orderThumbnailImageSize);
            if (d.miniShoppingCartThumbnailImageSize !== undefined) setMiniShoppingCartThumbnailImageSize(d.miniShoppingCartThumbnailImageSize);
            if (d.avatarImageSize !== undefined) setAvatarImageSize(d.avatarImageSize);

            if (d.isAdvanced !== undefined) setIsAdvanced(d.isAdvanced);
            return;
          }
        }
      } catch (err) {
        console.warn('Could not fetch media settings from API, using localStorage...', err);
      }

      // Local storage fallback
      const saved = localStorage.getItem('admin_media_settings');
      if (saved) {
        try {
          const d = JSON.parse(saved);
          if (d.pictureStorageTarget !== undefined) setPictureStorageTarget(d.pictureStorageTarget);
          if (d.maximumImageSize !== undefined) setMaximumImageSize(d.maximumImageSize);
          if (d.multipleThumbDirectories !== undefined) setMultipleThumbDirectories(d.multipleThumbDirectories);
          if (d.defaultImageQuality !== undefined) setDefaultImageQuality(d.defaultImageQuality);
          if (d.importProductImagesUsingHash !== undefined) setImportProductImagesUsingHash(d.importProductImagesUsingHash);
          if (d.pictureZoom !== undefined) setPictureZoom(d.pictureZoom);
          if (d.allowSvgUploadsInAdminArea !== undefined) setAllowSvgUploadsInAdminArea(d.allowSvgUploadsInAdminArea);

          if (d.productDetailImageSize !== undefined) setProductDetailImageSize(d.productDetailImageSize);
          if (d.productThumbnailImageSizeCatalog !== undefined) setProductThumbnailImageSizeCatalog(d.productThumbnailImageSizeCatalog);
          if (d.productThumbnailImageSizeProductPage !== undefined) setProductThumbnailImageSizeProductPage(d.productThumbnailImageSizeProductPage);
          if (d.associatedProductImageSize !== undefined) setAssociatedProductImageSize(d.associatedProductImageSize);
          if (d.defaultImageUrl !== undefined) setDefaultImageUrl(d.defaultImageUrl);

          if (d.categoryThumbnailImageSize !== undefined) setCategoryThumbnailImageSize(d.categoryThumbnailImageSize);
          if (d.manufacturerThumbnailImageSize !== undefined) setManufacturerThumbnailImageSize(d.manufacturerThumbnailImageSize);
          if (d.vendorThumbnailImageSize !== undefined) setVendorThumbnailImageSize(d.vendorThumbnailImageSize);
          if (d.cartWishlistThumbnailImageSize !== undefined) setCartWishlistThumbnailImageSize(d.cartWishlistThumbnailImageSize);
          if (d.orderThumbnailImageSize !== undefined) setOrderThumbnailImageSize(d.orderThumbnailImageSize);
          if (d.miniShoppingCartThumbnailImageSize !== undefined) setMiniShoppingCartThumbnailImageSize(d.miniShoppingCartThumbnailImageSize);
          if (d.avatarImageSize !== undefined) setAvatarImageSize(d.avatarImageSize);

          if (d.isAdvanced !== undefined) setIsAdvanced(d.isAdvanced);
        } catch {
          // ignore
        }
      }
    };

    fetchSettings();
  }, []);

  const handleChangeStorageTarget = () => {
    const newTarget = pictureStorageTarget === 'database' ? 'file system' : 'database';
    setPictureStorageTarget(newTarget);
    showToast(`Picture storage target changed to "${newTarget}". Click Save to persist.`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        setDefaultImageUrl(result);
        showToast('Default image uploaded successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      pictureStorageTarget,
      maximumImageSize: Number(maximumImageSize) || 0,
      multipleThumbDirectories,
      defaultImageQuality: Number(defaultImageQuality) || 0,
      importProductImagesUsingHash,
      pictureZoom,
      allowSvgUploadsInAdminArea,

      productDetailImageSize: Number(productDetailImageSize) || 0,
      productThumbnailImageSizeCatalog: Number(productThumbnailImageSizeCatalog) || 0,
      productThumbnailImageSizeProductPage: Number(productThumbnailImageSizeProductPage) || 0,
      associatedProductImageSize: Number(associatedProductImageSize) || 0,
      defaultImageUrl,

      categoryThumbnailImageSize: Number(categoryThumbnailImageSize) || 0,
      manufacturerThumbnailImageSize: Number(manufacturerThumbnailImageSize) || 0,
      vendorThumbnailImageSize: Number(vendorThumbnailImageSize) || 0,
      cartWishlistThumbnailImageSize: Number(cartWishlistThumbnailImageSize) || 0,
      orderThumbnailImageSize: Number(orderThumbnailImageSize) || 0,
      miniShoppingCartThumbnailImageSize: Number(miniShoppingCartThumbnailImageSize) || 0,
      avatarImageSize: Number(avatarImageSize) || 0,

      isAdvanced,
    };

    try {
      localStorage.setItem('admin_media_settings', JSON.stringify(payload));

      const res = await fetch('/api/admin/settings/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast('Media settings have been updated successfully.');
      } else {
        showToast('Settings saved locally, but server update failed.', 'error');
      }
    } catch {
      showToast('Settings saved locally (server unreachable).', 'success');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded shadow-lg text-sm text-white transition-all transform duration-300 ${
            toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Bar matching Reference: Title + Save Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-3">
        <h1 className="text-xl font-normal text-slate-800">Media settings</h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center justify-center px-3.5 py-1.5 bg-[#2489c5] hover:bg-[#207ba5] text-white text-xs font-medium rounded shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5 mr-1.5" />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Mode Switcher Pill on the Left Side */}
      <div className="pt-0.5">
        <button
          type="button"
          onClick={() => setIsAdvanced(!isAdvanced)}
          className={`inline-flex items-center justify-between px-2.5 py-1 rounded-[3px] text-xs font-normal border transition-colors duration-150 cursor-pointer select-none w-[94px] h-[28px] shadow-2xs ${
            isAdvanced
              ? 'bg-[#2489c5] border-[#2080b9] text-white hover:bg-[#1f72a3]'
              : 'bg-[#f8fafc] border-[#2489c5] text-[#2489c5] hover:bg-slate-100'
          }`}
          title="Toggle Basic / Advanced mode"
        >
          {isAdvanced ? (
            <>
              <span className="text-white text-xs font-normal pl-0.5">Advanced</span>
              <span className="w-3.5 h-[18px] rounded-[2px] bg-white shadow-2xs" />
            </>
          ) : (
            <>
              <span className="w-3.5 h-[18px] rounded-full border border-slate-400 bg-white shadow-2xs" />
              <span className="text-[#2489c5] text-xs font-normal pr-0.5">Basic</span>
            </>
          )}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* CARD 1: COMMON (Matching media_1791365726119.png & media_1791365739539.png)*/}
      {/* ========================================================================= */}
      <div className="bg-white rounded border border-slate-200 border-t-3 border-t-[#00c0ef] shadow-2xs overflow-hidden">
        <div
          onClick={() => setCommonOpen(!commonOpen)}
          className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
            <Info className="w-4 h-4 text-slate-500" />
            <span>Common</span>
          </div>
          <div className="text-slate-400 hover:text-slate-600">
            {commonOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </div>
        </div>

        {commonOpen && (
          <div className="p-6 space-y-4">
            {/* 1. Pictures are stored into... (Both Basic and Advanced) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-start">
              <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs pt-1.5">
                <span>Pictures are stored into...</span>
                <HelpTooltip text="Choose where pictures are stored (database or file system)." />
              </div>
              <div className="md:col-span-9 space-y-2">
                <div className="flex items-center gap-4">
                  <span className="text-xs text-slate-800 font-normal">{pictureStorageTarget}</span>
                  <button
                    type="button"
                    onClick={handleChangeStorageTarget}
                    className="px-3.5 py-1 bg-[#2489c5] hover:bg-[#207ba5] text-white text-xs font-normal rounded shadow-2xs transition-colors cursor-pointer"
                  >
                    Change
                  </button>
                </div>
                <div className="text-xs text-slate-600 leading-relaxed">
                  NOTE: Do not forget to backup your database before changing this option. It is not recommended to change this setting in production environment.
                </div>
              </div>
            </div>

            {/* Advanced Only Fields in Card 1 */}
            {isAdvanced && (
              <>
                {/* 2. Maximum image size */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                  <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <span>Maximum image size</span>
                    <HelpTooltip text="The maximum image size in pixels (either width or height) when uploaded." />
                  </div>
                  <div className="md:col-span-9">
                    <input
                      type="number"
                      value={maximumImageSize}
                      onChange={(e) => setMaximumImageSize(e.target.value)}
                      className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                    />
                  </div>
                </div>

                {/* 3. Multiple thumb directories */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                  <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <span>Multiple thumb directories</span>
                    <HelpTooltip text="Check to store thumbnail images across multiple directories instead of a single folder." />
                  </div>
                  <div className="md:col-span-9 flex items-center">
                    <input
                      type="checkbox"
                      checked={multipleThumbDirectories}
                      onChange={(e) => setMultipleThumbDirectories(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* 4. Default image quality (0 - 100) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                  <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <span>Default image quality (0 - 100)</span>
                    <HelpTooltip text="Set the default JPEG image quality (0 - 100)." />
                  </div>
                  <div className="md:col-span-9">
                    <input
                      type="number"
                      value={defaultImageQuality}
                      onChange={(e) => setDefaultImageQuality(e.target.value)}
                      className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                    />
                  </div>
                </div>

                {/* 5. Import product images using hash */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                  <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <span>Import product images using hash</span>
                    <HelpTooltip text="Check to avoid downloading/duplicating images when importing products if the image hash is already in the database." />
                  </div>
                  <div className="md:col-span-9 flex items-center">
                    <input
                      type="checkbox"
                      checked={importProductImagesUsingHash}
                      onChange={(e) => setImportProductImagesUsingHash(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* 6. Picture zoom */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                  <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <span>Picture zoom</span>
                    <HelpTooltip text="Check to enable picture zoom on the product details page." />
                  </div>
                  <div className="md:col-span-9 flex items-center">
                    <input
                      type="checkbox"
                      checked={pictureZoom}
                      onChange={(e) => setPictureZoom(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* 7. Allow SVG uploads in admin area */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                  <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <span>Allow SVG uploads in admin area</span>
                    <HelpTooltip text="Check to allow SVG image uploads in the admin area." />
                  </div>
                  <div className="md:col-span-9 flex items-center">
                    <input
                      type="checkbox"
                      checked={allowSvgUploadsInAdminArea}
                      onChange={(e) => setAllowSvgUploadsInAdminArea(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* CARD 2: PRODUCT (Advanced only, matching media_1791365726119.png) */}
      {/* ========================================================================= */}
      {isAdvanced && (
        <div className="bg-white rounded border border-slate-200 border-t-3 border-t-[#00c0ef] shadow-2xs overflow-hidden">
          <div
            onClick={() => setProductOpen(!productOpen)}
            className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between cursor-pointer select-none"
          >
            <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
              <Box className="w-4 h-4 text-slate-500" />
              <span>Product</span>
            </div>
            <div className="text-slate-400 hover:text-slate-600">
              {productOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </div>
          </div>

          {productOpen && (
            <div className="p-6 space-y-4">
              {/* 1. Product detail image size */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <span>Product detail image size</span>
                  <HelpTooltip text="Set default image size for product details page (pixels)." />
                </div>
                <div className="md:col-span-9">
                  <input
                    type="number"
                    value={productDetailImageSize}
                    onChange={(e) => setProductDetailImageSize(e.target.value)}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                  />
                </div>
              </div>

              {/* 2. Product thumbnail image size (catalog) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <div className="flex flex-col items-end leading-tight">
                    <span>Product thumbnail image size</span>
                    <span>(catalog)</span>
                  </div>
                  <HelpTooltip text="Set default thumbnail image size for products on catalog pages (pixels)." />
                </div>
                <div className="md:col-span-9">
                  <input
                    type="number"
                    value={productThumbnailImageSizeCatalog}
                    onChange={(e) => setProductThumbnailImageSizeCatalog(e.target.value)}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                  />
                </div>
              </div>

              {/* 3. Product thumbnail image size (product page) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <div className="flex flex-col items-end leading-tight">
                    <span>Product thumbnail image size (product</span>
                    <span>page)</span>
                  </div>
                  <HelpTooltip text="Set default thumbnail image size for additional images on the product page (pixels)." />
                </div>
                <div className="md:col-span-9">
                  <input
                    type="number"
                    value={productThumbnailImageSizeProductPage}
                    onChange={(e) => setProductThumbnailImageSizeProductPage(e.target.value)}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                  />
                </div>
              </div>

              {/* 4. Associated product image size */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <span>Associated product image size</span>
                  <HelpTooltip text="Set default image size for associated products on grouped product pages (pixels)." />
                </div>
                <div className="md:col-span-9">
                  <input
                    type="number"
                    value={associatedProductImageSize}
                    onChange={(e) => setAssociatedProductImageSize(e.target.value)}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                  />
                </div>
              </div>

              {/* 5. Default image */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-start">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs pt-2">
                  <span>Default image</span>
                  <HelpTooltip text="Upload a custom default placeholder image used when no picture is uploaded." />
                </div>
                <div className="md:col-span-9 space-y-3">
                  {/* Dropzone container matching screenshot: rounded rectangle with 'Drop files here to upload / Browse' */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border border-slate-300 rounded bg-[#f5f5f5] hover:bg-[#eaeaea] py-3.5 px-4 text-center cursor-pointer transition-colors shadow-2xs"
                  >
                    <span className="text-xs text-slate-600">
                      Drop files here to upload / <span className="text-[#2489c5] underline">Browse</span>
                    </span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>

                  {/* Circular preview / placeholder below dropzone */}
                  <div className="pt-1">
                    {defaultImageUrl ? (
                      <div className="relative inline-block">
                        <img
                          src={defaultImageUrl}
                          alt="Default placeholder"
                          className="w-16 h-16 rounded-full object-cover border border-slate-300 shadow-2xs"
                        />
                        <button
                          type="button"
                          onClick={() => setDefaultImageUrl('')}
                          className="absolute -top-1 -right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-0.5 shadow cursor-pointer"
                          title="Remove image"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-full border border-slate-300 bg-white flex flex-col items-center justify-center text-slate-400 select-none shadow-2xs">
                        <ImageIcon className="w-5 h-5 text-slate-300 mb-0.5" />
                        <span className="text-[8px] uppercase tracking-wider text-slate-400 font-medium">NO IMAGE</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* CARD 3: OTHER PAGES (Advanced only, matching media_1791365737147.png) */}
      {/* ========================================================================= */}
      {isAdvanced && (
        <div className="bg-white rounded border border-slate-200 border-t-3 border-t-[#00c0ef] shadow-2xs overflow-hidden">
          <div
            onClick={() => setOtherPagesOpen(!otherPagesOpen)}
            className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between cursor-pointer select-none"
          >
            <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
              <FileText className="w-4 h-4 text-slate-500" />
              <span>Other pages</span>
            </div>
            <div className="text-slate-400 hover:text-slate-600">
              {otherPagesOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </div>
          </div>

          {otherPagesOpen && (
            <div className="p-6 space-y-4">
              {/* 1. Category thumbnail image size */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <span>Category thumbnail image size</span>
                  <HelpTooltip text="Set default thumbnail image size for categories (pixels)." />
                </div>
                <div className="md:col-span-9">
                  <input
                    type="number"
                    value={categoryThumbnailImageSize}
                    onChange={(e) => setCategoryThumbnailImageSize(e.target.value)}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                  />
                </div>
              </div>

              {/* 2. Manufacturer thumbnail image size */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <div className="flex flex-col items-end leading-tight">
                    <span>Manufacturer thumbnail image</span>
                    <span>size</span>
                  </div>
                  <HelpTooltip text="Set default thumbnail image size for manufacturers (pixels)." />
                </div>
                <div className="md:col-span-9">
                  <input
                    type="number"
                    value={manufacturerThumbnailImageSize}
                    onChange={(e) => setManufacturerThumbnailImageSize(e.target.value)}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                  />
                </div>
              </div>

              {/* 3. Vendor thumbnail image size */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <span>Vendor thumbnail image size</span>
                  <HelpTooltip text="Set default thumbnail image size for vendors (pixels)." />
                </div>
                <div className="md:col-span-9">
                  <input
                    type="number"
                    value={vendorThumbnailImageSize}
                    onChange={(e) => setVendorThumbnailImageSize(e.target.value)}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                  />
                </div>
              </div>

              {/* 4. Cart/Wishlist thumbnail image size */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <div className="flex flex-col items-end leading-tight">
                    <span>Cart/Wishlist thumbnail image</span>
                    <span>size</span>
                  </div>
                  <HelpTooltip text="Set default thumbnail image size for products in shopping cart and wishlist (pixels)." />
                </div>
                <div className="md:col-span-9">
                  <input
                    type="number"
                    value={cartWishlistThumbnailImageSize}
                    onChange={(e) => setCartWishlistThumbnailImageSize(e.target.value)}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                  />
                </div>
              </div>

              {/* 5. Order thumbnail image size */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <span>Order thumbnail image size</span>
                  <HelpTooltip text="Set default thumbnail image size for products on order details pages (pixels)." />
                </div>
                <div className="md:col-span-9">
                  <input
                    type="number"
                    value={orderThumbnailImageSize}
                    onChange={(e) => setOrderThumbnailImageSize(e.target.value)}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                  />
                </div>
              </div>

              {/* 6. Mini-shopping cart thumbnail image size */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <div className="flex flex-col items-end leading-tight">
                    <span>Mini-shopping cart thumbnail image</span>
                    <span>size</span>
                  </div>
                  <HelpTooltip text="Set default thumbnail image size for products in the mini-shopping cart (pixels)." />
                </div>
                <div className="md:col-span-9">
                  <input
                    type="number"
                    value={miniShoppingCartThumbnailImageSize}
                    onChange={(e) => setMiniShoppingCartThumbnailImageSize(e.target.value)}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                  />
                </div>
              </div>

              {/* 7. Avatar image size */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <span>Avatar image size</span>
                  <HelpTooltip text="Set default image size for customer avatar images (pixels)." />
                </div>
                <div className="md:col-span-9">
                  <input
                    type="number"
                    value={avatarImageSize}
                    onChange={(e) => setAvatarImageSize(e.target.value)}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

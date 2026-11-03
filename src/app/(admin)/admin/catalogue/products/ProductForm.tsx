'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Save,
  ArrowLeft,
  Settings,
  Info,
  Minus,
  Plus,
  Undo2,
  Redo2,
  Sparkles,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Table as TableIcon,
  Link as LinkIcon,
  Image as ImageIcon,
  Video,
  Code,
  Maximize2,
  HelpCircle,
  X,
  CheckCircle2,
  AlertCircle,
  Package,
  Layers,
  Search,
  ChevronUp,
  DollarSign,
  Truck,
  Gift,
  Calendar,
} from 'lucide-react';
import { ImageEditorField } from '@/components/admin/ImageEditorField';

export interface ProductFormData {
  id?: string;
  name: string;
  sku: string;
  brandId: string;
  categoryId: string;
  parentCategoryId?: string;
  subCategoryId?: string;
  price: number;
  comparePrice?: number;
  shortDescription: string;
  description: string;
  targetCrops?: string;
  cropStages?: string;
  isPublished: boolean;
  isDraft: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  seName?: string;
  metaTitle?: string;
  metaKeywords?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  images?: string[];
  stockQuantity?: number;
  cost?: number;
  disableBuyButton?: boolean;
  callForPrice?: boolean;
  minCartQty?: number;
  maxCartQty?: number;
  productTags?: string;
  gtin?: string;
  manufacturerPartNumber?: string;
  showOnHomePage?: boolean;
  productType?: 'Simple' | 'Grouped';
  productTemplate?: 'Simple product' | 'Grouped product';
  visibleIndividually?: boolean;
  ageVerification?: boolean;
  customerRoles?: string;
  limitedToStores?: string;
  vendor?: string;
  requireOtherProducts?: boolean;
  allowCustomerReviews?: boolean;
  availableStartDate?: string;
  availableEndDate?: string;
  markAsNew?: boolean;
  adminComment?: string;
  disableWishlistButton?: boolean;
  availableForPreOrder?: boolean;
  customerEntersPrice?: boolean;
  pangvBasePriceEnabled?: boolean;
  taxExempt?: boolean;
  taxCategory?: string;
  isShippingEnabled?: boolean;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  freeShipping?: boolean;
  shipSeparately?: boolean;
  additionalShippingCharge?: number;
  deliveryDate?: string;
  isGiftCard?: boolean;
  giftCardType?: 'Virtual' | 'Physical';
  overriddenGiftCardAmount?: number | string;
  isRental?: boolean;
  rentalPeriodLength?: number | string;
  rentalPeriod?: 'Days' | 'Weeks' | 'Months' | 'Years';
}

interface ProductFormProps {
  initialValues?: Partial<ProductFormData>;
  categories: { id: string; name: string; parentId?: string | null }[];
  brands: { id: string; name: string }[];
  onSave: (data: ProductFormData, continueEditing?: boolean) => Promise<void>;
  saving: boolean;
  isEdit?: boolean;
  externalAdvancedMode?: boolean;
  onToggleAdvancedMode?: (nextMode: boolean) => void;
}

export function ProductForm({
  initialValues,
  categories,
  brands,
  onSave,
  saving,
  isEdit = false,
  externalAdvancedMode,
  onToggleAdvancedMode,
}: ProductFormProps) {
  const parentCategories = categories.filter((c) => !c.parentId);
  const childCategories = categories.filter((c) => Boolean(c.parentId));

  // Resolve initial parentCategoryId and subCategoryId
  const resolveInitialCategoryHierarchy = () => {
    const rawCatId = initialValues?.categoryId || '';
    const rawParentId =
      initialValues?.parentCategoryId ||
      (initialValues as any)?.parentCategory?.id ||
      '';
    const rawSubId =
      initialValues?.subCategoryId ||
      (initialValues as any)?.subCategory?.id ||
      '';

    let pId = rawParentId;
    let sId = rawSubId;

    if (!pId && rawCatId) {
      const found = categories.find((c) => c.id === rawCatId);
      if (found) {
        if (found.parentId) {
          sId = sId || found.id;
          pId = found.parentId;
        } else {
          pId = found.id;
        }
      }
    }

    if (!pId) {
      pId = parentCategories[0]?.id || categories[0]?.id || 'cat-machinery';
    }

    if (!sId) {
      const firstSub = childCategories.find((c) => c.parentId === pId);
      if (firstSub) {
        sId = firstSub.id;
      }
    }

    return { parentCategoryId: pId, subCategoryId: sId };
  };

  const initialHierarchy = resolveInitialCategoryHierarchy();

  // Main form state — all checkboxes defaulted to unchecked (false) while preserving full functionality
  const [formData, setFormData] = useState<ProductFormData>({
    id: initialValues?.id,
    name: initialValues?.name || '',
    sku: initialValues?.sku || `AGP-${Math.floor(1000 + Math.random() * 9000)}`,
    brandId: initialValues?.brandId || (brands[0]?.id || 'br-agripro'),
    categoryId: initialHierarchy.parentCategoryId,
    parentCategoryId: initialHierarchy.parentCategoryId,
    subCategoryId: initialHierarchy.subCategoryId,
    price: initialValues?.price !== undefined ? initialValues.price : 0,
    comparePrice: initialValues?.comparePrice || 0,
    shortDescription: initialValues?.shortDescription || '',
    description: initialValues?.description || '',
    targetCrops: initialValues?.targetCrops || 'Paddy, Cotton, Sugarcane',
    cropStages: initialValues?.cropStages || '1, 2, 3',
    isPublished: false,
    isDraft: false,
    isFeatured: false,
    isBestSeller: false,
    seName: initialValues?.seName || (initialValues as any)?.slug || '',
    metaTitle: initialValues?.metaTitle || '',
    metaKeywords: initialValues?.metaKeywords || '',
    metaDescription: initialValues?.metaDescription || '',
    canonicalUrl: initialValues?.canonicalUrl || '',
    images: initialValues?.images || [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=400&q=80',
    ],
    stockQuantity:
      initialValues?.stockQuantity !== undefined
        ? initialValues.stockQuantity
        : (initialValues as any)?.variants?.[0]?.stockQuantity !== undefined
        ? (initialValues as any).variants[0].stockQuantity
        : 25,
    cost: initialValues?.cost ?? Math.round((initialValues?.price || 0) * 0.78),
    disableBuyButton: false,
    disableWishlistButton: false,
    availableForPreOrder: false,
    callForPrice: false,
    customerEntersPrice: false,
    pangvBasePriceEnabled: false,
    taxExempt: false,
    taxCategory: initialValues?.taxCategory || 'Agricultural Essentials (5% GST)',
    isShippingEnabled: false,
    weight: initialValues?.weight ?? 5,
    length: initialValues?.length ?? 35,
    width: initialValues?.width ?? 25,
    height: initialValues?.height ?? 20,
    freeShipping: false,
    shipSeparately: false,
    additionalShippingCharge: initialValues?.additionalShippingCharge || 0,
    deliveryDate: initialValues?.deliveryDate || '1-2 days',
    isGiftCard: false,
    giftCardType: initialValues?.giftCardType || 'Virtual',
    overriddenGiftCardAmount: initialValues?.overriddenGiftCardAmount || '',
    isRental: false,
    rentalPeriodLength: initialValues?.rentalPeriodLength || '',
    rentalPeriod: (initialValues?.rentalPeriod as any) || 'Days',
    minCartQty: initialValues?.minCartQty || 1,
    maxCartQty: initialValues?.maxCartQty || 100,
    productTags: initialValues?.productTags || 'agriculture, certified, farming',
    gtin: initialValues?.gtin || '8901234560011',
    manufacturerPartNumber: initialValues?.manufacturerPartNumber || `${initialValues?.sku || 'AGP'}-IND`,
    showOnHomePage: false,
    productType: initialValues?.productType || 'Simple',
    productTemplate: initialValues?.productTemplate || 'Simple product',
    visibleIndividually: false,
    ageVerification: false,
    customerRoles: initialValues?.customerRoles || '',
    limitedToStores: initialValues?.limitedToStores || '',
    vendor: initialValues?.vendor || 'Agri-Mart Direct',
    requireOtherProducts: false,
    allowCustomerReviews: false,
    availableStartDate: initialValues?.availableStartDate || '',
    availableEndDate: initialValues?.availableEndDate || '',
    markAsNew: false,
    adminComment: initialValues?.adminComment || '',
  });

  // UI States — starts in Advanced mode (showing all fields); clicking shifts to Basic mode (showing only mandatory/important fields)
  const [internalAdvancedMode, setInternalAdvancedMode] = useState(true);
  const advancedMode = externalAdvancedMode !== undefined ? externalAdvancedMode : internalAdvancedMode;
  const handleToggleAdvancedMode = () => {
    const next = !advancedMode;
    setInternalAdvancedMode(next);
    if (onToggleAdvancedMode) onToggleAdvancedMode(next);
  };
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [productInfoCollapsed, setProductInfoCollapsed] = useState(false);
  const [priceCollapsed, setPriceCollapsed] = useState(false);
  const [shippingCollapsed, setShippingCollapsed] = useState(false);
  const [giftCardCollapsed, setGiftCardCollapsed] = useState(false);
  const [rentalCollapsed, setRentalCollapsed] = useState(false);
  const [seoCollapsed, setSeoCollapsed] = useState(false);
  const [seoActiveTab, setSeoActiveTab] = useState<'standard' | 'en' | 'rtl'>('standard');
  const [activeLangTab, setActiveLangTab] = useState<'standard' | 'en' | 'rtl'>('standard');
  const [sourceCodeMode, setSourceCodeMode] = useState(false);
  const [fontSize, setFontSize] = useState('16');
  const [textColor, setTextColor] = useState('#000000');
  const [newImageUrl, setNewImageUrl] = useState('');

  // Rich text editor ref
  const richTextRef = useRef<HTMLDivElement>(null);
  const [richTextHtml, setRichTextHtml] = useState(
    formData.description || '<p>Enter full product specifications, warranty details, and instructions here...</p>'
  );

  // Sync formData & richTextRef whenever initialValues or categories/brands change
  useEffect(() => {
    if (!initialValues) return;
    const resolved = resolveInitialCategoryHierarchy();
    const desc =
      initialValues.description ||
      initialValues.shortDescription ||
      '<p>Enter full product specifications, warranty details, and instructions here...</p>';

    setFormData((prev) => ({
      ...prev,
      id: initialValues.id ?? prev.id,
      name: initialValues.name ?? prev.name,
      sku: initialValues.sku ?? prev.sku,
      brandId: initialValues.brandId || prev.brandId || brands[0]?.id || 'br-agripro',
      categoryId: resolved.parentCategoryId,
      parentCategoryId: resolved.parentCategoryId,
      subCategoryId: resolved.subCategoryId,
      price: initialValues.price !== undefined ? initialValues.price : prev.price,
      comparePrice: initialValues.comparePrice ?? prev.comparePrice,
      shortDescription: initialValues.shortDescription ?? prev.shortDescription,
      description: initialValues.description ?? prev.description,
      targetCrops: initialValues.targetCrops || prev.targetCrops || 'Paddy, Cotton, Sugarcane',
      cropStages: initialValues.cropStages || prev.cropStages || '1, 2, 3',
      seName: initialValues.seName || (initialValues as any)?.slug || prev.seName,
      metaTitle: initialValues.metaTitle || `Buy ${initialValues.name || prev.name} Online | Agri-Mart India`,
      metaKeywords:
        initialValues.metaKeywords ||
        `${initialValues.name || prev.name}, ${initialValues.sku || prev.sku}, agriculture India`,
      metaDescription:
        initialValues.metaDescription ||
        initialValues.shortDescription ||
        initialValues.description ||
        prev.metaDescription,
      canonicalUrl: initialValues.canonicalUrl || prev.canonicalUrl,
      images:
        initialValues.images && initialValues.images.length > 0
          ? initialValues.images
          : prev.images,
      stockQuantity:
        initialValues.stockQuantity !== undefined
          ? initialValues.stockQuantity
          : (initialValues as any)?.variants?.[0]?.stockQuantity !== undefined
          ? (initialValues as any).variants[0].stockQuantity
          : prev.stockQuantity,
      cost:
        initialValues.cost ??
        Math.round(((initialValues.price !== undefined ? initialValues.price : prev.price) || 0) * 0.78),
      taxCategory: initialValues.taxCategory || prev.taxCategory || 'Agricultural Essentials (5% GST)',
      weight: initialValues.weight ?? prev.weight ?? 5,
      length: initialValues.length ?? prev.length ?? 35,
      width: initialValues.width ?? prev.width ?? 25,
      height: initialValues.height ?? prev.height ?? 20,
      deliveryDate: initialValues.deliveryDate || prev.deliveryDate || '1-2 days',
      gtin: initialValues.gtin || prev.gtin || '8901234560011',
      manufacturerPartNumber:
        initialValues.manufacturerPartNumber || `${initialValues.sku || prev.sku}-IND`,
      vendor: initialValues.vendor || prev.vendor || 'Agri-Mart Direct',
    }));

    setRichTextHtml(desc);
    if (richTextRef.current) {
      richTextRef.current.innerHTML = desc;
    }
  }, [initialValues?.id, initialValues?.sku, initialValues?.name, categories.length, brands.length]);

  // Validation
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Form input change handlers
  const handleChange = (field: keyof ProductFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  // Execute rich text formatting commands
  const executeCmd = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (richTextRef.current) {
      setRichTextHtml(richTextRef.current.innerHTML);
      handleChange('description', richTextRef.current.innerHTML);
    }
  };

  // Save Handlers
  const handleSaveAction = async (continueEditing = false) => {
    // Validate
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Please fill in all required fields.');
      return;
    }

    const payload: ProductFormData = {
      ...formData,
      description: sourceCodeMode ? formData.description : richTextHtml,
    };

    await onSave(payload, continueEditing);
    if (continueEditing) {
      showToast('Product saved successfully! Continue editing.');
    }
  };

  // Tooltip component
  const Tooltip = ({ text }: { text: string }) => (
    <span
      title={text}
      className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[#3c8dbc] text-white text-[10px] cursor-help font-bold shrink-0 select-none"
    >
      ?
    </span>
  );

  return (
    <div className="space-y-4 max-w-full text-slate-800 pb-16">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-4 py-2.5 rounded-lg shadow-lg bg-emerald-600 text-white text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* TOP HEADER: Title + Back link + Save buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 pb-1">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-normal text-slate-800 tracking-tight">
            {isEdit ? `Edit product details - ${formData.name}` : 'Add a new product'}
          </h1>
          <Link
            href="/admin/catalogue/products"
            className="text-[#3c8dbc] hover:underline flex items-center gap-1 text-xs font-semibold transition"
          >
            <span className="w-4 h-4 rounded-full bg-[#3c8dbc] text-white inline-flex items-center justify-center text-[10px]">
              ←
            </span>
            <span>back to product list</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {/* Save button */}
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSaveAction(false)}
            className="bg-[#2585be] hover:bg-[#1f72a3] disabled:opacity-50 text-white text-xs font-semibold px-3.5 py-1.5 rounded flex items-center gap-1.5 shadow-xs transition"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save'}</span>
          </button>

          {/* Save and Continue Edit button */}
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSaveAction(true)}
            className="bg-[#2585be] hover:bg-[#1f72a3] disabled:opacity-50 text-white text-xs font-semibold px-3.5 py-1.5 rounded flex items-center gap-1.5 shadow-xs transition"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save and Continue Edit'}</span>
          </button>
        </div>
      </div>

      {/* MODE SWITCHER & SETTINGS BAR */}
      <div className="flex flex-wrap items-center gap-2.5 pt-1 pb-2">
        {/* Advanced / Basic Toggle Switch (nopCommerce style) */}
        <button
          type="button"
          onClick={handleToggleAdvancedMode}
          className={`inline-flex items-center justify-between px-2.5 py-1 rounded text-xs font-semibold border transition cursor-pointer select-none min-w-[96px] h-7 shadow-2xs ${
            advancedMode
              ? 'bg-[#2585be] border-[#2585be] text-white hover:bg-[#1f72a3]'
              : 'bg-white border-[#3c8dbc] text-[#3c8dbc] hover:bg-slate-50'
          }`}
          title={
            advancedMode
              ? 'Click to switch to Basic mode (show only mandatory & important fields)'
              : 'Click to switch to Advanced mode (show all hidden fields)'
          }
        >
          {advancedMode ? (
            <>
              <span className="text-white font-semibold text-xs">Advanced</span>
              <span className="w-3.5 h-5 rounded-xs bg-white shadow-xs ml-2" />
            </>
          ) : (
            <>
              <span className="w-3.5 h-5 rounded-xs bg-[#3c8dbc] border border-[#3c8dbc] shadow-xs mr-2" />
              <span className="text-[#3c8dbc] font-semibold text-xs">Basic</span>
            </>
          )}
        </button>

        {/* Settings Button */}
        <button
          type="button"
          onClick={() => setSettingsOpen(true)}
          className="bg-[#00c0ef] hover:bg-[#00a7d0] text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 shadow-xs transition cursor-pointer h-7"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Settings</span>
        </button>

        {/* Active Mode Indicator */}
        <span
          className={`text-[11px] px-2.5 py-1 rounded border font-medium ${
            advancedMode
              ? 'bg-blue-50 text-blue-700 border-blue-200'
              : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}
        >
          {advancedMode
            ? 'Advanced mode: Showing all product fields & sections (click Advanced to switch to Basic)'
            : 'Basic mode: Showing only mandatory & important fields (click Basic to show all hidden fields)'}
        </span>
      </div>

      {/* PRODUCT INFO CARD */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden">
        {/* Card Header */}
        <div
          onClick={() => setProductInfoCollapsed(!productInfoCollapsed)}
          className="border-b border-[#f4f4f4] px-4 py-2.5 flex items-center justify-between cursor-pointer select-none bg-white hover:bg-slate-50/50 transition"
        >
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-xs sm:text-sm">
            <span className="font-serif italic font-bold text-slate-700 text-sm">i</span>
            <span>Product info</span>
          </div>
          <button
            type="button"
            className="p-1 text-slate-500 hover:text-slate-700 focus:outline-none"
          >
            {productInfoCollapsed ? (
              <Plus className="w-3.5 h-3.5" />
            ) : (
              <Minus className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Card Body */}
        {!productInfoCollapsed && (
          <div className="p-4 sm:p-6 space-y-5 text-xs text-slate-700">
            {/* Language / Variant Tabs (Advanced mode only) */}
            {advancedMode && (
              <div className="flex border-b border-slate-200 gap-1 pb-px">
                <button
                  type="button"
                  onClick={() => setActiveLangTab('standard')}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-t border-t-2 transition ${
                    activeLangTab === 'standard'
                      ? 'border-[#3c8dbc] text-slate-800 bg-white font-semibold border-x border-b-white -mb-px'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Standard
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLangTab('en')}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-t border-t-2 transition flex items-center gap-1 ${
                    activeLangTab === 'en'
                      ? 'border-[#3c8dbc] text-slate-800 bg-white font-semibold border-x border-b-white -mb-px'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <span>🇺🇸</span>
                  <span>EN</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLangTab('rtl')}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-t border-t-2 transition flex items-center gap-1 ${
                    activeLangTab === 'rtl'
                      ? 'border-[#3c8dbc] text-slate-800 bg-white font-semibold border-x border-b-white -mb-px'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <span>🇮🇳</span>
                  <span>KN (Kannada)</span>
                </button>
              </div>
            )}

            {/* FORM FIELDS */}
            <div className="space-y-4 max-w-4xl">
              {/* Product name */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                <div className="sm:col-span-3 flex items-center gap-1 font-medium text-slate-700">
                  <span>Product name</span>
                  <Tooltip text="The name of the product that will be displayed across the website." />
                </div>
                <div className="sm:col-span-9 relative">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Enter product title..."
                    className={`w-full text-xs px-2.5 py-2 pr-7 rounded border ${
                      errors.name ? 'border-red-500 bg-red-50/20' : 'border-[#d2d6de]'
                    } focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none`}
                  />
                  <span className="absolute right-2.5 top-2.5 text-red-500 font-bold text-sm pointer-events-none">
                    *
                  </span>
                  {errors.name && (
                    <p className="text-[11px] text-red-500 mt-0.5">{errors.name}</p>
                  )}
                </div>
              </div>

              {/* Short description */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-start gap-2">
                <div className="sm:col-span-3 flex items-center gap-1 font-medium text-slate-700 pt-1.5">
                  <span>Short description</span>
                  <Tooltip text="Short description displayed on category grids, search results, and catalog summaries." />
                </div>
                <div className="sm:col-span-9">
                  <textarea
                    rows={4}
                    value={formData.shortDescription}
                    onChange={(e) => handleChange('shortDescription', e.target.value)}
                    placeholder="Enter a concise product overview..."
                    className="w-full text-xs p-2.5 rounded border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none resize-y"
                  />
                </div>
              </div>

              {/* Full description with WYSIWYG Toolbar */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-start gap-2">
                <div className="sm:col-span-3 flex items-center gap-1 font-medium text-slate-700 pt-1.5">
                  <span>Full description</span>
                  <Tooltip text="Full description displayed on the public product details page with rich formatting." />
                </div>

                <div className="sm:col-span-9">
                  <div className="border border-[#d2d6de] rounded overflow-hidden bg-white shadow-2xs">
                    {/* Rich text WYSIWYG Toolbar */}
                    <div className="bg-[#f4f6f9] border-b border-slate-200 p-1 flex flex-wrap items-center gap-1 text-slate-700 select-none">
                      {/* Undo / Redo */}
                      <button
                        type="button"
                        onClick={() => executeCmd('undo')}
                        title="Undo"
                        className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition"
                      >
                        <Undo2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => executeCmd('redo')}
                        title="Redo"
                        className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition"
                      >
                        <Redo2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => executeCmd('removeFormat')}
                        title="Clear Formatting"
                        className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>

                      <div className="h-4 w-px bg-slate-300 mx-0.5" />

                      {/* Bold / Italic / Underline / Strike */}
                      <button
                        type="button"
                        onClick={() => executeCmd('bold')}
                        title="Bold"
                        className="p-1.5 hover:bg-slate-200 rounded text-slate-800 font-bold transition"
                      >
                        <Bold className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => executeCmd('italic')}
                        title="Italic"
                        className="p-1.5 hover:bg-slate-200 rounded text-slate-800 italic transition"
                      >
                        <Italic className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => executeCmd('underline')}
                        title="Underline"
                        className="p-1.5 hover:bg-slate-200 rounded text-slate-800 underline transition"
                      >
                        <Underline className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => executeCmd('strikeThrough')}
                        title="Strikethrough"
                        className="p-1.5 hover:bg-slate-200 rounded text-slate-800 transition"
                      >
                        <Strikethrough className="w-3.5 h-3.5" />
                      </button>

                      <div className="h-4 w-px bg-slate-300 mx-0.5" />

                      {/* Font size */}
                      <select
                        value={fontSize}
                        onChange={(e) => {
                          setFontSize(e.target.value);
                          executeCmd('fontSize', e.target.value === '16' ? '3' : '4');
                        }}
                        className="text-[11px] px-1.5 py-1 rounded border border-slate-300 bg-white outline-none cursor-pointer"
                        title="Font Size"
                      >
                        <option value="12">12</option>
                        <option value="14">14</option>
                        <option value="16">16</option>
                        <option value="18">18</option>
                        <option value="20">20</option>
                        <option value="24">24</option>
                      </select>

                      {/* Text Color Indicator */}
                      <div className="relative flex items-center">
                        <label
                          htmlFor="richTextColor"
                          className="px-1.5 py-0.5 hover:bg-slate-200 rounded cursor-pointer font-bold flex items-center gap-0.5 text-xs text-amber-600"
                          title="Text Color"
                        >
                          <span>A</span>
                          <span className="text-[9px]">▾</span>
                        </label>
                        <input
                          id="richTextColor"
                          type="color"
                          value={textColor}
                          onChange={(e) => {
                            setTextColor(e.target.value);
                            executeCmd('foreColor', e.target.value);
                          }}
                          className="opacity-0 w-0 h-0 absolute pointer-events-none"
                        />
                      </div>

                      <div className="h-4 w-px bg-slate-300 mx-0.5" />

                      {/* Lists */}
                      <button
                        type="button"
                        onClick={() => executeCmd('insertUnorderedList')}
                        title="Bullet List"
                        className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition"
                      >
                        <List className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => executeCmd('insertOrderedList')}
                        title="Numbered List"
                        className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition"
                      >
                        <ListOrdered className="w-3.5 h-3.5" />
                      </button>

                      {/* Alignment */}
                      <button
                        type="button"
                        onClick={() => executeCmd('justifyLeft')}
                        title="Align Left"
                        className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition"
                      >
                        <AlignLeft className="w-3.5 h-3.5" />
                      </button>

                      <div className="h-4 w-px bg-slate-300 mx-0.5" />

                      {/* Insert Table */}
                      <button
                        type="button"
                        onClick={() =>
                          executeCmd(
                            'insertHTML',
                            '<table border="1" style="width:100%; border-collapse:collapse; margin:8px 0;"><tr><th style="padding:4px;border:1px solid #ccc;">Header 1</th><th style="padding:4px;border:1px solid #ccc;">Header 2</th></tr><tr><td style="padding:4px;border:1px solid #ccc;">Data 1</td><td style="padding:4px;border:1px solid #ccc;">Data 2</td></tr></table>'
                          )
                        }
                        title="Insert Table"
                        className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition"
                      >
                        <TableIcon className="w-3.5 h-3.5" />
                      </button>

                      {/* Link */}
                      <button
                        type="button"
                        onClick={() => {
                          const url = prompt('Enter link URL:');
                          if (url) executeCmd('createLink', url);
                        }}
                        title="Insert Link"
                        className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition"
                      >
                        <LinkIcon className="w-3.5 h-3.5" />
                      </button>

                      {/* Image */}
                      <button
                        type="button"
                        onClick={() => {
                          const url = prompt('Enter image URL:');
                          if (url) executeCmd('insertImage', url);
                        }}
                        title="Insert Image"
                        className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                      </button>

                      {/* Horizontal Rule */}
                      <button
                        type="button"
                        onClick={() => executeCmd('insertHorizontalRule')}
                        title="Horizontal Line"
                        className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <div className="h-4 w-px bg-slate-300 mx-0.5" />

                      {/* Source Code Toggle */}
                      <button
                        type="button"
                        onClick={() => {
                          if (sourceCodeMode && richTextRef.current) {
                            richTextRef.current.innerHTML = formData.description;
                            setRichTextHtml(formData.description);
                          }
                          setSourceCodeMode(!sourceCodeMode);
                        }}
                        title="HTML Source Code Mode"
                        className={`p-1.5 rounded transition ${
                          sourceCodeMode
                            ? 'bg-blue-600 text-white'
                            : 'hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        <Code className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Rich text Content Area */}
                    {sourceCodeMode ? (
                      <textarea
                        rows={8}
                        value={formData.description}
                        onChange={(e) => {
                          handleChange('description', e.target.value);
                          setRichTextHtml(e.target.value);
                        }}
                        className="w-full p-3 font-mono text-xs text-slate-800 bg-slate-900 text-emerald-400 outline-none resize-y"
                      />
                    ) : (
                      <div
                        ref={richTextRef}
                        contentEditable
                        dangerouslySetInnerHTML={{ __html: richTextHtml }}
                        onBlur={(e) => {
                          setRichTextHtml(e.currentTarget.innerHTML);
                          handleChange('description', e.currentTarget.innerHTML);
                        }}
                        className="min-h-[140px] p-3 text-xs text-slate-800 outline-none prose prose-xs max-w-none focus:bg-amber-50/10"
                      />
                    )}

                    {/* Bottom Resize Bar */}
                    <div className="bg-[#f9fafc] border-t border-slate-200 py-1 text-center text-slate-300 text-[10px] select-none">
                      ===
                    </div>
                  </div>
                </div>
              </div>

              {/* SKU */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                  <span>SKU</span>
                  <Tooltip text="Stock Keeping Unit (SKU) identifying this product variant." />
                </div>
                <div className="sm:col-span-9">
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => handleChange('sku', e.target.value)}
                    placeholder="e.g. BAG-STR-01"
                    className="w-full text-xs px-2.5 py-2 rounded border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none font-mono"
                  />
                  {errors.sku && (
                    <p className="text-[11px] text-red-500 mt-0.5">{errors.sku}</p>
                  )}
                </div>
              </div>

              {/* Parent Category & Child Category (Subcategory) */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-start gap-2 bg-slate-50/70 p-3 rounded-md border border-slate-200">
                <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-semibold text-slate-800 pt-1.5">
                  <span>Parent &amp; Child Category</span>
                  <Tooltip text="Select both the Parent Category and the Child Subcategory for this product." />
                </div>
                <div className="sm:col-span-9 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Parent Category */}
                    <div>
                      <label className="block text-[11px] font-bold text-blue-700 uppercase tracking-wider mb-1">
                        Parent Category
                      </label>
                      <select
                        value={formData.parentCategoryId || formData.categoryId}
                        onChange={(e) => {
                          const newParentId = e.target.value;
                          const firstChild = childCategories.find(
                            (c) => c.parentId === newParentId
                          );
                          setFormData((prev) => ({
                            ...prev,
                            categoryId: newParentId,
                            parentCategoryId: newParentId,
                            subCategoryId: firstChild ? firstChild.id : '',
                          }));
                        }}
                        className="w-full text-xs px-2.5 py-2 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none font-medium"
                      >
                        {(parentCategories.length > 0 ? parentCategories : categories).map(
                          (c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    {/* Child Category (Subcategory) */}
                    <div>
                      <label className="block text-[11px] font-bold text-emerald-700 uppercase tracking-wider mb-1">
                        Child Category (Subcategory)
                      </label>
                      <select
                        value={formData.subCategoryId || ''}
                        onChange={(e) =>
                          handleChange('subCategoryId', e.target.value)
                        }
                        className="w-full text-xs px-2.5 py-2 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none font-medium"
                      >
                        {childCategories
                          .filter(
                            (c) =>
                              c.parentId ===
                              (formData.parentCategoryId || formData.categoryId)
                          )
                          .map((sub) => (
                            <option key={sub.id} value={sub.id}>
                              {sub.name}
                            </option>
                          ))}
                        {childCategories.filter(
                          (c) =>
                            c.parentId ===
                            (formData.parentCategoryId || formData.categoryId)
                        ).length === 0 && (
                          <option value="">General Subcategory</option>
                        )}
                      </select>
                    </div>
                  </div>

                  {/* Active Hierarchy Preview */}
                  <div className="flex flex-wrap items-center gap-2 text-xs bg-white px-3 py-2 rounded border border-slate-200">
                    <span className="text-slate-500 font-medium">
                      Selected Hierarchy:
                    </span>
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 font-semibold">
                      {categories.find(
                        (c) =>
                          c.id ===
                          (formData.parentCategoryId || formData.categoryId)
                      )?.name || 'Farm Equipment & Machinery'}
                    </span>
                    <span className="text-slate-400 font-bold">&gt;&gt;</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                      {categories.find((c) => c.id === formData.subCategoryId)
                        ?.name || 'General Subcategory'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Manufacturers */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                  <span>Manufacturers</span>
                  <Tooltip text="Select the brand or manufacturer producing this product." />
                </div>
                <div className="sm:col-span-9">
                  <select
                    value={formData.brandId}
                    onChange={(e) => handleChange('brandId', e.target.value)}
                    className="w-full text-xs px-2.5 py-2 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none"
                  >
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Stock quantity */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                  <span>Stock quantity</span>
                  <Tooltip text="Current available inventory stock quantity across dark warehouses." />
                </div>
                <div className="sm:col-span-9">
                  <input
                    type="number"
                    value={formData.stockQuantity ?? 25}
                    onChange={(e) =>
                      handleChange('stockQuantity', parseInt(e.target.value, 10) || 0)
                    }
                    className="w-full max-w-[200px] text-xs px-2.5 py-2 rounded border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none"
                  />
                </div>
              </div>

              {/* Target Crops & Crop Stages (Advanced only) */}
              {advancedMode && (
                <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                  <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                    <span>Target crops &amp; stages</span>
                    <Tooltip text="Target agricultural crops and growth stages for this product." />
                  </div>
                  <div className="sm:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <input
                        type="text"
                        value={formData.targetCrops || ''}
                        onChange={(e) => handleChange('targetCrops', e.target.value)}
                        placeholder="Target Crops (e.g. Paddy, Cotton, Sugarcane)"
                        className="w-full text-xs px-2.5 py-2 rounded border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={formData.cropStages || ''}
                        onChange={(e) => handleChange('cropStages', e.target.value)}
                        placeholder="Crop Stages (e.g. 1, 2, 3)"
                        className="w-full text-xs px-2.5 py-2 rounded border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Published Checkbox */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                  <span>Published</span>
                  <Tooltip text="Determines whether this product is marked as published." />
                </div>
                <div className="sm:col-span-9 flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => handleChange('isPublished', e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc]"
                  />
                </div>
              </div>

              {advancedMode && (
                <>
                  {/* Product tags */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                    <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                      <span>Product tags</span>
                      <Tooltip text="Product tags are keywords that products can be categorized by." />
                    </div>
                    <div className="sm:col-span-9">
                      <input
                        type="text"
                        value={formData.productTags}
                        onChange={(e) => handleChange('productTags', e.target.value)}
                        placeholder=""
                        className="w-full text-xs px-2.5 py-2 rounded border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none"
                      />
                    </div>
                  </div>

                  {/* GTIN (global trade item number) */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                    <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                      <span>GTIN (global trade item number)</span>
                      <Tooltip text="Enter global trade item number (GTIN). These include UPC, EAN, JAN, and ISBN." />
                    </div>
                    <div className="sm:col-span-9">
                      <input
                        type="text"
                        value={formData.gtin}
                        onChange={(e) => handleChange('gtin', e.target.value)}
                        placeholder=""
                        className="w-full text-xs px-2.5 py-2 rounded border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none"
                      />
                    </div>
                  </div>

                  {/* Manufacturer part number */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                    <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                      <span>Manufacturer part number</span>
                      <Tooltip text="The manufacturer's part number for this product." />
                    </div>
                    <div className="sm:col-span-9">
                      <input
                        type="text"
                        value={formData.manufacturerPartNumber}
                        onChange={(e) => handleChange('manufacturerPartNumber', e.target.value)}
                        placeholder=""
                        className="w-full text-xs px-2.5 py-2 rounded border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none"
                      />
                    </div>
                  </div>

                  {/* Show on home page */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                    <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                      <span>Show on home page</span>
                      <Tooltip text="Check to display this product on your store's home page." />
                    </div>
                    <div className="sm:col-span-9 flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.showOnHomePage}
                        onChange={(e) => handleChange('showOnHomePage', e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc]"
                      />
                    </div>
                  </div>

                  {/* Product type */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                    <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                      <span>Product type</span>
                      <Tooltip text="Select a product type (Simple or Grouped)." />
                    </div>
                    <div className="sm:col-span-9">
                      <select
                        value={formData.productType}
                        onChange={(e) => handleChange('productType', e.target.value as any)}
                        className="w-full text-xs px-2.5 py-2 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none"
                      >
                        <option value="Simple">Simple</option>
                        <option value="Grouped">Grouped (product with variants)</option>
                      </select>
                    </div>
                  </div>

                  {/* Product template */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                    <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                      <span>Product template</span>
                      <Tooltip text="The template that will be used to display this product on the public storefront." />
                    </div>
                    <div className="sm:col-span-9">
                      <select
                        value={formData.productTemplate}
                        onChange={(e) => handleChange('productTemplate', e.target.value as any)}
                        className="w-full text-xs px-2.5 py-2 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none"
                      >
                        <option value="Simple product">Simple product</option>
                        <option value="Grouped product">Grouped product</option>
                      </select>
                    </div>
                  </div>

                  {/* Visible individually */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                    <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                      <span>Visible individually</span>
                      <Tooltip text="Check if the product is individually visible in catalog or search results." />
                    </div>
                    <div className="sm:col-span-9 flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.visibleIndividually}
                        onChange={(e) => handleChange('visibleIndividually', e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc]"
                      />
                    </div>
                  </div>

                  {/* Age verification */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                    <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                      <span>Age verification</span>
                      <Tooltip text="Check to require age verification before viewing or purchasing this product." />
                    </div>
                    <div className="sm:col-span-9 flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.ageVerification}
                        onChange={(e) => handleChange('ageVerification', e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc]"
                      />
                    </div>
                  </div>

                  {/* Limited to customer roles */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                    <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                      <span>Limited to customer roles</span>
                      <Tooltip text="Select customer roles that can view/purchase this product." />
                    </div>
                    <div className="sm:col-span-9 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                      <div className="md:col-span-6">
                        <input
                          type="text"
                          value={formData.customerRoles}
                          onChange={(e) => handleChange('customerRoles', e.target.value)}
                          placeholder=""
                          className="w-full text-xs px-2.5 py-2 rounded border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none"
                        />
                      </div>
                      <div className="md:col-span-6 border border-[#d2d6de] bg-[#f9fafc] text-slate-600 px-3 py-2 rounded text-[11px] leading-snug">
                        In order to use this functionality, you have to disable the following setting: Catalog settings &gt; Ignore ACL rules.
                      </div>
                    </div>
                  </div>

                  {/* Limited to stores */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                    <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                      <span>Limited to stores</span>
                      <Tooltip text="Select stores this product is limited to." />
                    </div>
                    <div className="sm:col-span-9 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                      <div className="md:col-span-6">
                        <input
                          type="text"
                          value={formData.limitedToStores}
                          onChange={(e) => handleChange('limitedToStores', e.target.value)}
                          placeholder=""
                          className="w-full text-xs px-2.5 py-2 rounded border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none"
                        />
                      </div>
                      <div className="md:col-span-6 border border-[#d2d6de] bg-[#f9fafc] text-slate-600 px-3 py-2 rounded text-[11px] leading-snug">
                        In order to use this functionality, you have to disable the following setting: Catalog settings &gt; Ignore &quot;limit per store&quot; rules.
                      </div>
                    </div>
                  </div>

                  {/* Vendor */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                    <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                      <span>Vendor</span>
                      <Tooltip text="Choose the vendor for this product." />
                    </div>
                    <div className="sm:col-span-9">
                      <select
                        value={formData.vendor}
                        onChange={(e) => handleChange('vendor', e.target.value)}
                        className="w-full text-xs px-2.5 py-2 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none text-slate-700 cursor-pointer"
                      >
                        <option value="No vendor">No vendor</option>
                        <option value="Agri-Mart Direct">Agri-Mart Direct</option>
                        <option value="Bayer CropScience">Bayer CropScience</option>
                        <option value="Syngenta India">Syngenta India</option>
                        <option value="UPL Limited">UPL Limited</option>
                        <option value="IFFCO Organic">IFFCO Organic</option>
                      </select>
                    </div>
                  </div>

                  {/* Require other products */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                    <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                      <span>Require other products</span>
                      <Tooltip text="Check if this product requires other products to be added to the cart." />
                    </div>
                    <div className="sm:col-span-9 flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.requireOtherProducts}
                        onChange={(e) => handleChange('requireOtherProducts', e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Allow customer reviews */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                    <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                      <span>Allow customer reviews</span>
                      <Tooltip text="Check if customers are allowed to write reviews for this product." />
                    </div>
                    <div className="sm:col-span-9 flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.allowCustomerReviews}
                        onChange={(e) => handleChange('allowCustomerReviews', e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Available start date */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                    <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                      <span>Available start date</span>
                      <Tooltip text="The start of the product availability range." />
                    </div>
                    <div className="sm:col-span-9">
                      <input
                        type="datetime-local"
                        value={formData.availableStartDate}
                        onChange={(e) => handleChange('availableStartDate', e.target.value)}
                        className="w-full max-w-[280px] text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none bg-white text-slate-700"
                      />
                    </div>
                  </div>

                  {/* Available end date */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                    <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                      <span>Available end date</span>
                      <Tooltip text="The end of the product availability range." />
                    </div>
                    <div className="sm:col-span-9">
                      <input
                        type="datetime-local"
                        value={formData.availableEndDate}
                        onChange={(e) => handleChange('availableEndDate', e.target.value)}
                        className="w-full max-w-[280px] text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none bg-white text-slate-700"
                      />
                    </div>
                  </div>

                  {/* Mark as new */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                    <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                      <span>Mark as new</span>
                      <Tooltip text="Check to mark the product as new. It can be used to display 'New' badge." />
                    </div>
                    <div className="sm:col-span-9 flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.markAsNew}
                        onChange={(e) => handleChange('markAsNew', e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Admin comment */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 items-start gap-2">
                    <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700 pt-1.5">
                      <span>Admin comment</span>
                      <Tooltip text="This comment is for internal use only, not displayed to customers." />
                    </div>
                    <div className="sm:col-span-9">
                      <textarea
                        rows={4}
                        value={formData.adminComment}
                        onChange={(e) => handleChange('adminComment', e.target.value)}
                        className="w-full text-xs px-2.5 py-2 rounded border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none resize-y font-sans"
                        placeholder=""
                      />
                    </div>
                  </div>
                </>
              )}

            </div>
          </div>
        )}
      </div>

      {/* PRICE CARD */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden">
        {/* Card Header */}
        <div
          onClick={() => setPriceCollapsed(!priceCollapsed)}
          className="border-b border-[#f4f4f4] px-4 py-2.5 flex items-center justify-between cursor-pointer select-none bg-white hover:bg-slate-50/50 transition"
        >
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-xs sm:text-sm">
            <span className="font-bold text-slate-700 text-sm">₹</span>
            <span>Price (INR)</span>
          </div>
          <button
            type="button"
            className="p-1 text-slate-500 hover:text-slate-700 focus:outline-none"
          >
            {priceCollapsed ? (
              <Plus className="w-3.5 h-3.5" />
            ) : (
              <Minus className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Card Body */}
        {!priceCollapsed && (
          <div className="p-4 sm:p-6 space-y-4 text-xs text-slate-700">
            {/* Price */}
            <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
              <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                <span>Price</span>
                <Tooltip text="The retail selling price of this product in INR." />
              </div>
              <div className="sm:col-span-9 flex items-center">
                <div className="flex max-w-[200px] w-full">
                  <input
                    type="number"
                    step="any"
                    value={formData.price}
                    onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                    className="w-full text-xs px-2.5 py-1.5 rounded-l border border-r-0 border-[#d2d6de] focus:border-[#3c8dbc] outline-none"
                  />
                  <span className="inline-flex items-center px-3 text-xs text-slate-600 bg-white border border-[#d2d6de] rounded-r font-medium select-none">
                    INR
                  </span>
                </div>
              </div>
            </div>

            {advancedMode && (
              <>
                {/* Old price */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                  <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                    <span>Old price</span>
                    <Tooltip text="The old price of the product in INR. If set, this price will be displayed alongside the new price." />
                  </div>
                  <div className="sm:col-span-9 flex items-center">
                    <div className="flex max-w-[200px] w-full">
                      <input
                        type="number"
                        step="any"
                        value={formData.comparePrice ?? 0}
                        onChange={(e) => handleChange('comparePrice', parseFloat(e.target.value) || 0)}
                        className="w-full text-xs px-2.5 py-1.5 rounded-l border border-r-0 border-[#d2d6de] focus:border-[#3c8dbc] outline-none"
                      />
                      <span className="inline-flex items-center px-3 text-xs text-slate-600 bg-white border border-[#d2d6de] rounded-r font-medium select-none">
                        INR
                      </span>
                    </div>
                  </div>
                </div>

                {/* Product cost */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                  <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                    <span>Product cost</span>
                    <Tooltip text="The cost of the product in INR for calculating profit margin. Not shown to customers." />
                  </div>
                  <div className="sm:col-span-9 flex items-center">
                    <div className="flex max-w-[200px] w-full">
                      <input
                        type="number"
                        step="any"
                        value={formData.cost ?? 0}
                        onChange={(e) => handleChange('cost', parseFloat(e.target.value) || 0)}
                        className="w-full text-xs px-2.5 py-1.5 rounded-l border border-r-0 border-[#d2d6de] focus:border-[#3c8dbc] outline-none"
                      />
                      <span className="inline-flex items-center px-3 text-xs text-slate-600 bg-white border border-[#d2d6de] rounded-r font-medium select-none">
                        INR
                      </span>
                    </div>
                  </div>
                </div>

                {/* Disable buy button */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                  <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                    <span>Disable buy button</span>
                    <Tooltip text="Check to disable the buy button for this product." />
                  </div>
                  <div className="sm:col-span-9 flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.disableBuyButton}
                      onChange={(e) => handleChange('disableBuyButton', e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                    />
                  </div>
                </div>

                {/* Disable wishlist button */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                  <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                    <span>Disable wishlist button</span>
                    <Tooltip text="Check to disable the wishlist button for this product." />
                  </div>
                  <div className="sm:col-span-9 flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.disableWishlistButton}
                      onChange={(e) => handleChange('disableWishlistButton', e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                    />
                  </div>
                </div>

                {/* Available for pre-order */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                  <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                    <span>Available for pre-order</span>
                    <Tooltip text="Check if this product is available for pre-order." />
                  </div>
                  <div className="sm:col-span-9 flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.availableForPreOrder}
                      onChange={(e) => handleChange('availableForPreOrder', e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                    />
                  </div>
                </div>

                {/* Call for price */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                  <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                    <span>Call for price</span>
                    <Tooltip text="Check to show 'Call for price' instead of the price." />
                  </div>
                  <div className="sm:col-span-9 flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.callForPrice}
                      onChange={(e) => handleChange('callForPrice', e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                    />
                  </div>
                </div>

                {/* Customer enters price */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                  <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                    <span>Customer enters price</span>
                    <Tooltip text="Check if customers can enter the product price (e.g. for donations or flexible payment)." />
                  </div>
                  <div className="sm:col-span-9 flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.customerEntersPrice}
                      onChange={(e) => handleChange('customerEntersPrice', e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                    />
                  </div>
                </div>

                {/* PAngV (base price) enabled */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                  <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                    <span>PAngV (base price) enabled</span>
                    <Tooltip text="Check if product base price (PAngV) is enabled for display according to German Price Indication Directive." />
                  </div>
                  <div className="sm:col-span-9 flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.pangvBasePriceEnabled}
                      onChange={(e) => handleChange('pangvBasePriceEnabled', e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                    />
                  </div>
                </div>

                {/* Discounts */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                  <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                    <span>Discounts</span>
                    <Tooltip text="Check discounts applied to this product." />
                  </div>
                  <div className="sm:col-span-9">
                    <div className="w-full border border-[#d2d6de] bg-[#f4f4f4] text-slate-600 px-3 py-2 rounded text-xs leading-snug">
                      No discounts available. Create at least one discount before mapping.
                    </div>
                  </div>
                </div>

                {/* Tax exempt */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                  <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                    <span>Tax exempt</span>
                    <Tooltip text="Check if this product is tax exempt (no tax will be calculated on purchase)." />
                  </div>
                  <div className="sm:col-span-9 flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.taxExempt}
                      onChange={(e) => handleChange('taxExempt', e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Tax category */}
            <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
              <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                <span>Tax category</span>
                <Tooltip text="The tax category applied to calculate the tax rate for this product." />
              </div>
              <div className="sm:col-span-9">
                <select
                  value={formData.taxCategory}
                  onChange={(e) => handleChange('taxCategory', e.target.value)}
                  className="w-full text-xs px-2.5 py-2 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none text-slate-700 cursor-pointer"
                >
                  <option value="[None]">[None]</option>
                  <option value="Standard Rate (18% GST)">Standard Rate (18% GST)</option>
                  <option value="Reduced Rate (12% GST)">Reduced Rate (12% GST)</option>
                  <option value="Agricultural Essentials (5% GST)">Agricultural Essentials (5% GST)</option>
                  <option value="Exempt / Agricultural (5% GST)">Exempt / Agricultural (5% GST)</option>
                  <option value="Exempt Seeds & Biocides (0% GST)">Exempt Seeds &amp; Biocides (0% GST)</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ADVANCED CARDS: SHIPPING, GIFT CARD, RENTAL, SEO */}
      {advancedMode && (
        <>
          {/* SHIPPING CARD */}
          <div className="bg-white rounded border border-[#d2d6de] border-t-[3px] border-t-[#00c0ef] shadow-2xs overflow-hidden">
            {/* Card Header */}
            <div
              onClick={() => setShippingCollapsed(!shippingCollapsed)}
              className="border-b border-[#f4f4f4] px-4 py-2.5 flex items-center justify-between cursor-pointer select-none bg-white hover:bg-slate-50/50 transition"
            >
              <div className="flex items-center gap-2 text-slate-800 font-semibold text-xs sm:text-sm">
                <Truck className="w-4 h-4 text-slate-800" />
                <span>Shipping</span>
              </div>
              <button
                type="button"
                className="p-1 text-slate-500 hover:text-slate-700 focus:outline-none"
              >
                {shippingCollapsed ? (
                  <Plus className="w-3.5 h-3.5" />
                ) : (
                  <Minus className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Card Body */}
            {!shippingCollapsed && (
              <div className="p-4 sm:p-6 space-y-4 text-xs text-slate-700">
                {/* Shipping enabled */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                  <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                    <span>Shipping enabled</span>
                    <Tooltip text="Check if this product can be shipped to customers." />
                  </div>
                  <div className="sm:col-span-9 flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isShippingEnabled}
                      onChange={(e) => handleChange('isShippingEnabled', e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Dimensions Group: Weight, Length, Width, Height */}
                  <div className="space-y-0">
                    {/* Weight */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                      <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                        <span>Weight</span>
                        <Tooltip text="The physical weight of the product." />
                      </div>
                      <div className="sm:col-span-9 relative flex items-center pl-6">
                        <div className="absolute left-[7px] -top-4 bottom-0 w-px bg-[#d2d6de]" />
                        <div className="absolute left-[7px] top-1/2 w-4 h-px bg-[#d2d6de]" />
                        <div className="flex max-w-[200px] w-full">
                          <input
                            type="number"
                            step="any"
                            value={formData.weight}
                            onChange={(e) => handleChange('weight', parseFloat(e.target.value) || 0)}
                            className="w-full text-xs px-2.5 py-1.5 rounded-tl border border-r-0 border-[#d2d6de] focus:border-[#3c8dbc] outline-none"
                          />
                          <span className="inline-flex items-center px-3 text-xs text-slate-600 bg-white border border-[#d2d6de] rounded-tr font-medium select-none">
                            kg
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Length */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                      <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                        <span>Length</span>
                        <Tooltip text="The package length of the product." />
                      </div>
                      <div className="sm:col-span-9 relative flex items-center pl-6">
                        <div className="absolute left-[7px] 0 bottom-0 w-px bg-[#d2d6de]" />
                        <div className="flex max-w-[200px] w-full">
                          <input
                            type="number"
                            step="any"
                            value={formData.length}
                            onChange={(e) => handleChange('length', parseFloat(e.target.value) || 0)}
                            className="w-full text-xs px-2.5 py-1.5 border border-r-0 border-t-0 border-[#d2d6de] focus:border-[#3c8dbc] outline-none"
                          />
                          <span className="inline-flex items-center px-3 text-xs text-slate-600 bg-white border border-t-0 border-[#d2d6de] font-medium select-none">
                            cm
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Width */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                      <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                        <span>Width</span>
                        <Tooltip text="The package width of the product." />
                      </div>
                      <div className="sm:col-span-9 relative flex items-center pl-6">
                        <div className="absolute left-[7px] 0 bottom-0 w-px bg-[#d2d6de]" />
                        <div className="flex max-w-[200px] w-full">
                          <input
                            type="number"
                            step="any"
                            value={formData.width}
                            onChange={(e) => handleChange('width', parseFloat(e.target.value) || 0)}
                            className="w-full text-xs px-2.5 py-1.5 border border-r-0 border-t-0 border-[#d2d6de] focus:border-[#3c8dbc] outline-none"
                          />
                          <span className="inline-flex items-center px-3 text-xs text-slate-600 bg-white border border-t-0 border-[#d2d6de] font-medium select-none">
                            cm
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Height */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                      <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                        <span>Height</span>
                        <Tooltip text="The package height of the product." />
                      </div>
                      <div className="sm:col-span-9 relative flex items-center pl-6">
                        <div className="absolute left-[7px] 0 bottom-0 w-px bg-[#d2d6de]" />
                        <div className="flex max-w-[200px] w-full">
                          <input
                            type="number"
                            step="any"
                            value={formData.height}
                            onChange={(e) => handleChange('height', parseFloat(e.target.value) || 0)}
                            className="w-full text-xs px-2.5 py-1.5 rounded-bl border border-r-0 border-t-0 border-[#d2d6de] focus:border-[#3c8dbc] outline-none"
                          />
                          <span className="inline-flex items-center px-3 text-xs text-slate-600 bg-white border border-t-0 border-[#d2d6de] rounded-br font-medium select-none">
                            cm
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Free shipping */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                    <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                      <span>Free shipping</span>
                      <Tooltip text="Check if this product qualifies for free shipping." />
                    </div>
                    <div className="sm:col-span-9 relative flex items-center pl-6">
                      <div className="absolute left-[7px] -top-4 bottom-0 w-px bg-[#d2d6de]" />
                      <div className="absolute left-[7px] top-1/2 w-4 h-px bg-[#d2d6de]" />
                      <input
                        type="checkbox"
                        checked={formData.freeShipping}
                        onChange={(e) => handleChange('freeShipping', e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Ship separately */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                    <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                      <span>Ship separately</span>
                      <Tooltip text="Check if this product must be shipped in its own individual parcel/box." />
                    </div>
                    <div className="sm:col-span-9 relative flex items-center pl-6">
                      <div className="absolute left-[7px] -top-4 bottom-0 w-px bg-[#d2d6de]" />
                      <div className="absolute left-[7px] top-1/2 w-4 h-px bg-[#d2d6de]" />
                      <input
                        type="checkbox"
                        checked={formData.shipSeparately}
                        onChange={(e) => handleChange('shipSeparately', e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Additional shipping charge */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                    <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                      <span>Additional shipping charge</span>
                      <Tooltip text="An additional fixed amount in INR charged for shipping this product." />
                    </div>
                    <div className="sm:col-span-9 relative flex items-center pl-6">
                      <div className="absolute left-[7px] -top-4 top-1/2 w-px bg-[#d2d6de]" />
                      <div className="absolute left-[7px] top-1/2 w-4 h-px bg-[#d2d6de]" />
                      <div className="flex max-w-[200px] w-full">
                        <input
                          type="number"
                          step="any"
                          value={formData.additionalShippingCharge}
                          onChange={(e) => handleChange('additionalShippingCharge', parseFloat(e.target.value) || 0)}
                          className="w-full text-xs px-2.5 py-1.5 rounded-l border border-r-0 border-[#d2d6de] focus:border-[#3c8dbc] outline-none"
                        />
                        <span className="inline-flex items-center px-3 text-xs text-slate-600 bg-white border border-[#d2d6de] rounded-r font-medium select-none">
                          INR
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery date */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                    <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                      <span>Delivery date</span>
                      <Tooltip text="The delivery date options for this product." />
                    </div>
                    <div className="sm:col-span-9">
                      <select
                        value={formData.deliveryDate}
                        onChange={(e) => handleChange('deliveryDate', e.target.value)}
                        className="w-full text-xs px-2.5 py-2 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none text-slate-700 cursor-pointer"
                      >
                        <option value="None">None</option>
                        <option value="1-2 days">1-2 days</option>
                        <option value="1-2 days (Express Hub)">1-2 days (Express Hub)</option>
                        <option value="2-3 days">2-3 days</option>
                        <option value="2-4 days">2-4 days</option>
                        <option value="3-5 days">3-5 days</option>
                        <option value="1 week">1 week</option>
                        <option value="2-3 weeks">2-3 weeks</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* GIFT CARD */}
          <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden">
            {/* Card Header */}
            <div
              onClick={() => setGiftCardCollapsed(!giftCardCollapsed)}
              className="border-b border-[#f4f4f4] px-4 py-2.5 flex items-center justify-between cursor-pointer select-none bg-white hover:bg-slate-50/50 transition"
            >
              <div className="flex items-center gap-2 text-slate-800 font-semibold text-xs sm:text-sm">
                <Gift className="w-4 h-4 text-slate-800" />
                <span>Gift card</span>
              </div>
              <button
                type="button"
                className="p-1 text-slate-500 hover:text-slate-700 focus:outline-none"
              >
                {giftCardCollapsed ? (
                  <Plus className="w-3.5 h-3.5" />
                ) : (
                  <Minus className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Card Body */}
            {!giftCardCollapsed && (
              <div className="p-4 sm:p-6 space-y-4 text-xs text-slate-700">
                {/* Is gift card */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                  <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                    <span>Is gift card</span>
                    <Tooltip text="Check if this product is a gift card." />
                  </div>
                  <div className="sm:col-span-9 flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isGiftCard}
                      onChange={(e) => handleChange('isGiftCard', e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                    />
                  </div>
                </div>

                {formData.isGiftCard && (
                  <div className="space-y-4 pt-1">
                    {/* Gift card type */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                      <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                        <span>Gift card type</span>
                        <Tooltip text="Choose the gift card type: Virtual (delivered via email) or Physical (shipped)." />
                      </div>
                      <div className="sm:col-span-9 relative flex items-center pl-6">
                        <div className="absolute left-[7px] -top-4 bottom-0 w-px bg-[#d2d6de]" />
                        <div className="absolute left-[7px] top-1/2 w-4 h-px bg-[#d2d6de]" />
                        <select
                          value={formData.giftCardType}
                          onChange={(e) => handleChange('giftCardType', e.target.value as any)}
                          className="w-full text-xs px-2.5 py-2 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none text-slate-700 cursor-pointer"
                        >
                          <option value="Virtual">Virtual</option>
                          <option value="Physical">Physical</option>
                        </select>
                      </div>
                    </div>

                    {/* Overridden gift card amount */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                      <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                        <span>Overridden gift card amount (INR)</span>
                        <Tooltip text="Specify the overridden gift card amount in INR if applicable. Leave blank to use product price." />
                      </div>
                      <div className="sm:col-span-9 relative flex items-center pl-6">
                        <div className="absolute left-[7px] -top-4 top-1/2 w-px bg-[#d2d6de]" />
                        <div className="absolute left-[7px] top-1/2 w-4 h-px bg-[#d2d6de]" />
                        <input
                          type="number"
                          step="any"
                          placeholder=""
                          value={formData.overriddenGiftCardAmount || ''}
                          onChange={(e) => handleChange('overriddenGiftCardAmount', e.target.value ? parseFloat(e.target.value) : '')}
                          className="w-full max-w-[180px] text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RENTAL CARD */}
          <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden">
            {/* Card Header */}
            <div
              onClick={() => setRentalCollapsed(!rentalCollapsed)}
              className="border-b border-[#f4f4f4] px-4 py-2.5 flex items-center justify-between cursor-pointer select-none bg-white hover:bg-slate-50/50 transition"
            >
              <div className="flex items-center gap-2 text-slate-800 font-semibold text-xs sm:text-sm">
                <Calendar className="w-4 h-4 text-slate-800" />
                <span>Rental</span>
              </div>
              <button
                type="button"
                className="p-1 text-slate-500 hover:text-slate-700 focus:outline-none"
              >
                {rentalCollapsed ? (
                  <Plus className="w-3.5 h-3.5" />
                ) : (
                  <Minus className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Card Body */}
            {!rentalCollapsed && (
              <div className="p-4 sm:p-6 space-y-4 text-xs text-slate-700">
                {/* Is rental */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                  <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                    <span>Is rental</span>
                    <Tooltip text="Check if this product is available for rental instead of outright purchase." />
                  </div>
                  <div className="sm:col-span-9 flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isRental}
                      onChange={(e) => handleChange('isRental', e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                    />
                  </div>
                </div>

                {formData.isRental && (
                  <div className="space-y-4 pt-1">
                    {/* Rental period length */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 items-start gap-2">
                      <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700 pt-1.5">
                        <span>Rental period length</span>
                        <Tooltip text="Specify the cycle length for rental (e.g. 1, 3, 7)." />
                      </div>
                      <div className="sm:col-span-9 relative pl-6">
                        <div className="absolute left-[7px] -top-4 bottom-0 w-px bg-[#d2d6de]" />
                        <div className="absolute left-[7px] top-4 w-4 h-px bg-[#d2d6de]" />
                        <input
                          type="number"
                          min="1"
                          placeholder=""
                          value={formData.rentalPeriodLength || ''}
                          onChange={(e) => handleChange('rentalPeriodLength', e.target.value ? parseInt(e.target.value, 10) : '')}
                          className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none"
                        />
                        {(!formData.rentalPeriodLength || Number(formData.rentalPeriodLength) <= 0) && (
                          <span className="block text-red-500 text-[11px] mt-1 font-normal">
                            The Rental period length field is required.
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Rental period */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                      <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                        <span>Rental period</span>
                        <Tooltip text="Choose the rental cycle period: Days, Weeks, Months, or Years." />
                      </div>
                      <div className="sm:col-span-9 relative flex items-center pl-6">
                        <div className="absolute left-[7px] -top-4 top-1/2 w-px bg-[#d2d6de]" />
                        <div className="absolute left-[7px] top-1/2 w-4 h-px bg-[#d2d6de]" />
                        <select
                          value={formData.rentalPeriod}
                          onChange={(e) => handleChange('rentalPeriod', e.target.value as any)}
                          className="w-full text-xs px-2.5 py-2 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none text-slate-700 cursor-pointer"
                        >
                          <option value="Days">Days</option>
                          <option value="Weeks">Weeks</option>
                          <option value="Months">Months</option>
                          <option value="Years">Years</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SEO CARD */}
          <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden">
            {/* Card Header */}
            <div
              onClick={() => setSeoCollapsed(!seoCollapsed)}
              className="border-b border-[#f4f4f4] px-4 py-2.5 flex items-center justify-between cursor-pointer select-none bg-white hover:bg-slate-50/50 transition"
            >
              <div className="flex items-center gap-2 text-slate-800 font-semibold text-xs sm:text-sm">
                <Search className="w-4 h-4 text-slate-800" />
                <span>SEO</span>
              </div>
              <button
                type="button"
                className="p-1 text-slate-500 hover:text-slate-700 focus:outline-none"
              >
                {seoCollapsed ? (
                  <Plus className="w-3.5 h-3.5" />
                ) : (
                  <Minus className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Card Body */}
            {!seoCollapsed && (
              <div className="p-4 sm:p-6 text-xs text-slate-700">
                <div className="border border-[#d2d6de] rounded-xs bg-white">
                  {/* Tabs bar */}
                  <div className="flex border-b border-[#d2d6de] bg-[#fdfdfd]">
                    <button
                      type="button"
                      onClick={() => setSeoActiveTab('standard')}
                      className={`px-4 py-2 text-xs transition border-r border-[#d2d6de] select-none ${
                        seoActiveTab === 'standard'
                          ? 'border-t-2 border-t-[#3c8dbc] bg-white text-slate-800 font-medium -mb-px border-b border-b-white'
                          : 'border-t-2 border-t-transparent text-slate-600 hover:text-slate-800'
                      }`}
                    >
                      Standard
                    </button>
                    <button
                      type="button"
                      onClick={() => setSeoActiveTab('en')}
                      className={`px-4 py-2 text-xs transition border-r border-[#d2d6de] flex items-center gap-1.5 select-none ${
                        seoActiveTab === 'en'
                          ? 'border-t-2 border-t-[#3c8dbc] bg-white text-slate-800 font-medium -mb-px border-b border-b-white'
                          : 'border-t-2 border-t-transparent text-slate-600 hover:text-slate-800'
                      }`}
                    >
                      <span>🇺🇸</span>
                      <span>EN</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSeoActiveTab('rtl')}
                      className={`px-4 py-2 text-xs transition flex items-center gap-1.5 select-none ${
                        seoActiveTab === 'rtl'
                          ? 'border-t-2 border-t-[#3c8dbc] bg-white text-slate-800 font-medium -mb-px border-b border-b-white'
                          : 'border-t-2 border-t-transparent text-slate-600 hover:text-slate-800'
                      }`}
                    >
                      <span>🇮🇱</span>
                      <span>RTL</span>
                    </button>
                  </div>

                  {/* Tab Content Fields */}
                  <div className="p-5 sm:p-6 space-y-4">
                    {/* Search engine friendly page name */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                      <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                        <span>Search engine friendly page name</span>
                        <Tooltip text="Set a search engine friendly page name such as 'the-best-product' to make your product page URL more SEO-friendly. If left empty, the product name will be used." />
                      </div>
                      <div className="sm:col-span-9">
                        <input
                          type="text"
                          value={formData.seName || ''}
                          onChange={(e) => handleChange('seName', e.target.value)}
                          className="w-full text-xs px-2.5 py-2 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none text-slate-700"
                        />
                      </div>
                    </div>

                    {/* Meta title */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                      <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                        <span>Meta title</span>
                        <Tooltip text="The title tag is displayed on search engine results pages (SERPs) as the clickable headline for a given result." />
                      </div>
                      <div className="sm:col-span-9">
                        <input
                          type="text"
                          value={formData.metaTitle || ''}
                          onChange={(e) => handleChange('metaTitle', e.target.value)}
                          className="w-full text-xs px-2.5 py-2 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none text-slate-700"
                        />
                      </div>
                    </div>

                    {/* Meta keywords */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                      <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                        <span>Meta keywords</span>
                        <Tooltip text="Keywords to include in product page meta tags for search engines." />
                      </div>
                      <div className="sm:col-span-9">
                        <input
                          type="text"
                          value={formData.metaKeywords || ''}
                          onChange={(e) => handleChange('metaKeywords', e.target.value)}
                          className="w-full text-xs px-2.5 py-2 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none text-slate-700"
                        />
                      </div>
                    </div>

                    {/* Meta description */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 items-start gap-2">
                      <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700 pt-2">
                        <span>Meta description</span>
                        <Tooltip text="Brief description to be included in product page meta tags for search engines." />
                      </div>
                      <div className="sm:col-span-9">
                        <textarea
                          rows={4}
                          value={formData.metaDescription || ''}
                          onChange={(e) => handleChange('metaDescription', e.target.value)}
                          className="w-full text-xs px-2.5 py-2 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none text-slate-700 resize-y"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* PICTURES & MEDIA CARD (Always visible so all product details are shown properly) */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-purple-600" /> Product Pictures &amp; Gallery
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            {formData.images?.length || 0} picture(s)
          </span>
        </div>

        {/* Add New Picture with ImageEditorField */}
        <div className="border border-dashed border-slate-300 rounded-lg p-3 bg-slate-50/60 space-y-2">
          <span className="text-xs font-semibold text-slate-700 block">
            Add New Picture (From Local Device or Website URL):
          </span>
          <ImageEditorField
            value=""
            onChange={(url) => {
              if (url) {
                setFormData((prev) => ({
                  ...prev,
                  images: [...(prev.images || []), url],
                }));
              }
            }}
          />
        </div>

        {/* List of Existing Product Images with Edit / Crop / Change / Remove */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-semibold text-slate-700 block">
            Current Gallery Pictures (Click Edit to crop, rotate, or adjust):
          </span>
          {!formData.images || formData.images.length === 0 ? (
            <p className="text-xs text-slate-400 italic">
              No pictures uploaded yet for this product.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {formData.images.map((img, i) => (
                <div
                  key={i}
                  className="border border-slate-200 rounded-lg p-3 bg-white shadow-2xs space-y-2"
                >
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                    <span>
                      Picture #{i + 1}{' '}
                      {i === 0 && <strong className="text-[#3c8dbc]">(Main)</strong>}
                    </span>
                  </div>
                  <ImageEditorField
                    value={img}
                    onChange={(newUrl) => {
                      if (!newUrl) {
                        setFormData((prev) => ({
                          ...prev,
                          images: prev.images?.filter((_, idx) => idx !== i),
                        }));
                      } else {
                        setFormData((prev) => ({
                          ...prev,
                          images: prev.images?.map((item, idx) =>
                            idx === i ? newUrl : item
                          ),
                        }));
                      }
                    }}
                    previewHeight="h-28"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* QUICK SETTINGS MODAL */}
      {settingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <div className="font-semibold text-sm text-slate-800 flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#00c0ef]" />
                <span>Catalog &amp; Product Settings</span>
              </div>
              <button
                onClick={() => setSettingsOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs text-slate-700">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span>Default Currency Symbol</span>
                <span className="font-bold text-slate-900">₹ (INR)</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span>Auto-Generate SKU Pattern</span>
                <span className="font-mono text-slate-900">AGP-[RAND4]</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span>Enable Multi-Language Tabs</span>
                <span className="text-emerald-700 font-bold">Enabled</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span>Automatic Next.js ISR Cache Revalidation</span>
                <span className="text-emerald-700 font-bold">Active (/shop, /products)</span>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSettingsOpen(false)}
                  className="px-4 py-1.5 bg-[#2585be] text-white rounded font-semibold text-xs shadow-xs"
                >
                  Close Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scroll-to-top button */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 w-10 h-10 bg-[#00a65a] hover:bg-[#008d4c] text-white rounded flex items-center justify-center shadow-md transition-all z-40 cursor-pointer"
        title="Scroll to top"
      >
        <ChevronUp className="w-6 h-6 stroke-[2.5]" />
      </button>
    </div>
  );
}

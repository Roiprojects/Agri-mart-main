'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Save,
  ArrowLeft,
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
  Check,
  CheckCircle2,
  AlertCircle,
  Camera,
  Upload,
  Monitor,
  Bookmark,
  Search,
  ChevronUp,
  Eye,
  Pencil,
  Trash2,
  RotateCw,
} from 'lucide-react';
import { ImageEditorField } from '@/components/admin/ImageEditorField';

export interface CategoryFormData {
  id?: string;
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  parentId?: string | null;
  displayOrder?: number;
  published?: boolean;
  restrictFromVendors?: boolean;
  showOnHomePage?: boolean;
  allowCustomersToSelectPageSize?: boolean;
  pageSizeOptions?: string;
  priceRangeFiltering?: boolean;
  manuallyPriceRange?: boolean;
  priceFrom?: number;
  priceTo?: number;
  discounts?: string;
  customerRoles?: string;
  limitedToStores?: string;
  seName?: string;
  metaTitle?: string;
  metaKeywords?: string;
  metaDescription?: string;
}

interface CategoryFormProps {
  initialValues?: Partial<CategoryFormData>;
  categories: { id: string; name: string }[];
  onSave: (data: CategoryFormData, continueEditing?: boolean) => Promise<void>;
  saving: boolean;
  isEdit?: boolean;
}

export function CategoryForm({
  initialValues,
  categories,
  onSave,
  saving,
  isEdit = false,
}: CategoryFormProps) {
  // Main form state — all checkboxes defaulted to unchecked (false) while preserving full functionality
  const [formData, setFormData] = useState<CategoryFormData>({
    id: initialValues?.id,
    name: initialValues?.name || '',
    slug: initialValues?.slug || '',
    description: initialValues?.description || '',
    image: initialValues?.image || '',
    parentId: initialValues?.parentId || '',
    displayOrder: initialValues?.displayOrder !== undefined ? initialValues.displayOrder : 0,
    published: false,
    restrictFromVendors: false,
    showOnHomePage: false,
    allowCustomersToSelectPageSize: false,
    pageSizeOptions: initialValues?.pageSizeOptions || '6, 3, 9',
    priceRangeFiltering: false,
    manuallyPriceRange: false,
    priceFrom: initialValues?.priceFrom !== undefined ? initialValues.priceFrom : 0,
    priceTo: initialValues?.priceTo !== undefined ? initialValues.priceTo : 10000,
    discounts: initialValues?.discounts || '',
    customerRoles: initialValues?.customerRoles || '',
    limitedToStores: initialValues?.limitedToStores || '',
    seName: initialValues?.seName || initialValues?.slug || '',
    metaTitle: initialValues?.metaTitle || '',
    metaKeywords: initialValues?.metaKeywords || '',
    metaDescription: initialValues?.metaDescription || '',
  });

  // UI States — starts in Advanced mode (true) showing all fields; clicking shifts to Basic mode (false) showing only mandatory/important fields
  const [advancedMode, setAdvancedMode] = useState(true);
  const [categoryInfoCollapsed, setCategoryInfoCollapsed] = useState(false);
  const [displayCollapsed, setDisplayCollapsed] = useState(false);
  const [mappingsCollapsed, setMappingsCollapsed] = useState(false);
  const [seoCollapsed, setSeoCollapsed] = useState(false);
  const [seoActiveTab, setSeoActiveTab] = useState<'standard' | 'en' | 'rtl'>('standard');
  const [activeLangTab, setActiveLangTab] = useState<'standard' | 'en' | 'rtl'>('standard');
  const [sourceCodeMode, setSourceCodeMode] = useState(false);
  const [fontSize, setFontSize] = useState('16');
  const [textColor, setTextColor] = useState('#000000');
  const [imageInputOpen, setImageInputOpen] = useState(false);
  const [imageUrlDraft, setImageUrlDraft] = useState('');

  // Rich text editor ref
  const richTextRef = useRef<HTMLDivElement>(null);
  const [richTextHtml, setRichTextHtml] = useState(
    formData.description || ''
  );

  // Products section state
  const [productsCollapsed, setProductsCollapsed] = useState(false);
  const [categoryProducts, setCategoryProducts] = useState<any[]>([]);
  const [allAvailableProducts, setAllAvailableProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [pageSize, setPageSize] = useState('15');
  const [addProductModalOpen, setAddProductModalOpen] = useState(false);
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [selectedProductToAdd, setSelectedProductToAdd] = useState('');

  // Sync initialValues if updated dynamically
  useEffect(() => {
    if (initialValues) {
      setFormData((prev) => ({
        ...prev,
        ...initialValues,
        published: false,
        restrictFromVendors: false,
        showOnHomePage: false,
        allowCustomersToSelectPageSize: false,
        priceRangeFiltering: false,
        manuallyPriceRange: false,
        seName: initialValues.seName || initialValues.slug || prev.seName || '',
      }));
      if (initialValues.description !== undefined) {
        setRichTextHtml(initialValues.description);
      }
    }
  }, [initialValues]);

  // Fetch products associated with this category
  const fetchCategoryProducts = async () => {
    const catId = formData.id || initialValues?.id;
    if (!catId) return;
    try {
      setLoadingProducts(true);
      const res = await fetch('/api/admin/catalogue/products');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setAllAvailableProducts(json.data);
        const filtered = json.data.filter((p: any) => p.categoryId === catId);
        setCategoryProducts(filtered);
      }
    } catch (err) {
      console.error('Error fetching category products:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    if (formData.id || initialValues?.id) {
      fetchCategoryProducts();
    }
  }, [formData.id, initialValues?.id]);

  const handleRemoveProductFromCategory = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product from this category?')) return;
    try {
      const prod = allAvailableProducts.find((p) => p.id === productId);
      if (prod) {
        const res = await fetch('/api/admin/catalogue/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...prod, categoryId: '' }),
        });
        const json = await res.json();
        if (json.success) {
          showToast('Product removed from category.');
          fetchCategoryProducts();
        } else {
          alert(json.message || 'Failed to remove product');
        }
      }
    } catch (err: any) {
      alert(err.message || 'Failed to remove product');
    }
  };

  const handleAddProductToCategory = async (productId: string) => {
    const catId = formData.id || initialValues?.id;
    if (!catId) return;
    try {
      const prod = allAvailableProducts.find((p) => p.id === productId);
      if (prod) {
        const res = await fetch('/api/admin/catalogue/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...prod, categoryId: catId }),
        });
        const json = await res.json();
        if (json.success) {
          showToast('Product added to category.');
          setAddProductModalOpen(false);
          setSelectedProductToAdd('');
          fetchCategoryProducts();
        } else {
          alert(json.message || 'Failed to add product');
        }
      }
    } catch (err: any) {
      alert(err.message || 'Failed to add product');
    }
  };

  // Errors & Toasts
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (field: keyof CategoryFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Rich Text Editor Commands
  const executeCmd = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (richTextRef.current) {
      setRichTextHtml(richTextRef.current.innerHTML);
      handleChange('description', richTextRef.current.innerHTML);
    }
  };

  // Save handler
  const handleSaveAction = async (continueEditing = false) => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Please fill in required fields.');
      return;
    }

    const payload: CategoryFormData = {
      ...formData,
      slug:
        formData.slug?.trim() ||
        formData.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, ''),
      description: sourceCodeMode ? formData.description : richTextHtml,
      parentId: formData.parentId || null,
    };

    await onSave(payload, continueEditing);
    if (continueEditing) {
      showToast('Category saved successfully! Continue editing.');
    }
  };

  // Tooltip Helper
  const Tooltip = ({ text }: { text: string }) => (
    <span
      title={text}
      className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[#3c8dbc] text-white text-[10px] cursor-help font-bold shrink-0 select-none"
    >
      ?
    </span>
  );

  // Filter out self from parent options to avoid circular hierarchies
  const parentOptions = categories.filter((c) => !formData.id || c.id !== formData.id);

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
            {isEdit ? `Edit category details - ${formData.name}` : 'Add a new category'}
          </h1>
          <Link
            href="/admin/catalogue/categories"
            className="text-[#3c8dbc] hover:underline flex items-center gap-1 text-xs font-semibold transition"
          >
            <span className="w-4 h-4 rounded-full bg-[#3c8dbc] text-white inline-flex items-center justify-center text-[10px]">
              ←
            </span>
            <span>back to category list</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {/* Save button */}
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSaveAction(false)}
            className="bg-[#2585be] hover:bg-[#1f72a3] disabled:opacity-50 text-white text-xs font-semibold px-3.5 py-1.5 rounded flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save'}</span>
          </button>

          {/* Save and Continue Edit button */}
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSaveAction(true)}
            className="bg-[#2585be] hover:bg-[#1f72a3] disabled:opacity-50 text-white text-xs font-semibold px-3.5 py-1.5 rounded flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save and Continue Edit'}</span>
          </button>
        </div>
      </div>

      {/* MODE SWITCHER: Advanced <-> Basic Toggle Switch */}
      <div className="flex flex-wrap items-center gap-2.5 pt-1 pb-2">
        <button
          type="button"
          onClick={() => setAdvancedMode(!advancedMode)}
          className={`inline-flex items-center justify-between px-2.5 py-1 rounded text-xs font-semibold border transition cursor-pointer select-none min-w-[96px] h-7 shadow-2xs ${
            advancedMode
              ? 'bg-[#2585be] border-[#2585be] text-white hover:bg-[#1f72a3]'
              : 'bg-white border-[#3c8dbc] text-[#3c8dbc] hover:bg-slate-50'
          }`}
          title={
            advancedMode
              ? 'Click to switch to Basic mode (show only mandatory/important fields)'
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
        <span
          className={`text-[11px] px-2.5 py-0.5 rounded border font-medium ${
            advancedMode
              ? 'bg-blue-50 text-blue-700 border-blue-200'
              : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}
        >
          {advancedMode
            ? 'Advanced mode: Showing all category fields & sections (click Advanced to switch to Basic)'
            : 'Basic mode: Showing only mandatory & important fields (click Basic to show all hidden fields)'}
        </span>
      </div>

      {/* CATEGORY INFO CARD */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden border-t-2 border-t-[#00c0ef]">
        {/* Card Header */}
        <div
          onClick={() => setCategoryInfoCollapsed(!categoryInfoCollapsed)}
          className="border-b border-[#f4f4f4] px-4 py-2.5 flex items-center justify-between cursor-pointer select-none bg-white hover:bg-slate-50/50 transition"
        >
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-xs sm:text-sm">
            <Info className="w-4 h-4 text-slate-800" />
            <span>Category info</span>
          </div>
          <button
            type="button"
            className="p-1 text-slate-500 hover:text-slate-700 focus:outline-none cursor-pointer"
          >
            {categoryInfoCollapsed ? (
              <Plus className="w-3.5 h-3.5" />
            ) : (
              <Minus className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Card Body */}
        {!categoryInfoCollapsed && (
          <div className="p-4 sm:p-6 space-y-5 text-xs text-slate-700">
            {/* Tabbed box container matching screenshot */}
            <div className="border border-[#d2d6de] rounded-xs bg-white">
              {/* Tabs bar (Advanced only) */}
              {advancedMode && (
                <div className="flex border-b border-[#d2d6de] bg-[#fdfdfd]">
                  <button
                    type="button"
                    onClick={() => setActiveLangTab('standard')}
                    className={`px-4 py-2 text-xs transition border-r border-[#d2d6de] select-none ${
                      activeLangTab === 'standard'
                        ? 'border-t-2 border-t-[#3c8dbc] bg-white text-slate-800 font-medium -mb-px border-b border-b-white'
                        : 'border-t-2 border-t-transparent text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    Standard
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveLangTab('en')}
                    className={`px-4 py-2 text-xs transition border-r border-[#d2d6de] flex items-center gap-1.5 select-none ${
                      activeLangTab === 'en'
                        ? 'border-t-2 border-t-[#3c8dbc] bg-white text-slate-800 font-medium -mb-px border-b border-b-white'
                        : 'border-t-2 border-t-transparent text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    <span>🇺🇸</span>
                    <span>EN</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveLangTab('rtl')}
                    className={`px-4 py-2 text-xs transition flex items-center gap-1.5 select-none ${
                      activeLangTab === 'rtl'
                        ? 'border-t-2 border-t-[#3c8dbc] bg-white text-slate-800 font-medium -mb-px border-b border-b-white'
                        : 'border-t-2 border-t-transparent text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    <span>🇮🇱</span>
                    <span>RTL</span>
                  </button>
                </div>
              )}

              {/* Tab Content Fields: Name & Description */}
              <div className="p-5 sm:p-6 space-y-4">
                {/* Category Name */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                  <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                    <span>Name</span>
                    <Tooltip text="The name of the category." />
                  </div>
                  <div className="sm:col-span-9 relative">
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder=""
                      className={`w-full text-xs px-2.5 py-2 pr-6 rounded border ${
                        errors.name ? 'border-red-500' : 'border-[#d2d6de]'
                      } bg-white focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none text-slate-700`}
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-red-500 font-bold text-sm pointer-events-none">
                      *
                    </span>
                  </div>
                </div>

                {/* Description (WYSIWYG) */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-start gap-2">
                  <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700 pt-2">
                    <span>Description</span>
                    <Tooltip text="The description of the category." />
                  </div>
                  <div className="sm:col-span-9">
                    <div className="border border-[#d2d6de] rounded bg-white overflow-hidden shadow-2xs">
                      {/* WYSIWYG Toolbar matching screenshot */}
                      <div className="bg-[#f8f9fa] border-b border-[#e9ecef] p-1.5 flex flex-wrap items-center gap-1 text-slate-700 select-none">
                        <button
                          type="button"
                          onClick={() => executeCmd('undo')}
                          title="Undo"
                          className="p-1.5 hover:bg-slate-200 rounded text-slate-600 transition"
                        >
                          <Undo2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => executeCmd('redo')}
                          title="Redo"
                          className="p-1.5 hover:bg-slate-200 rounded text-slate-600 transition"
                        >
                          <Redo2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="h-4 w-px bg-slate-300 mx-0.5" />

                        <button
                          type="button"
                          onClick={() => executeCmd('removeFormat')}
                          title="Clean formatting"
                          className="p-1.5 hover:bg-slate-200 rounded text-slate-600 transition"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>
                        <div className="h-4 w-px bg-slate-300 mx-0.5" />

                        <button
                          type="button"
                          onClick={() => executeCmd('bold')}
                          title="Bold"
                          className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition font-bold"
                        >
                          <Bold className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => executeCmd('italic')}
                          title="Italic"
                          className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition"
                        >
                          <Italic className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => executeCmd('underline')}
                          title="Underline"
                          className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition"
                        >
                          <Underline className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => executeCmd('strikeThrough')}
                          title="Strikethrough"
                          className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition"
                        >
                          <Strikethrough className="w-3.5 h-3.5" />
                        </button>
                        <div className="h-4 w-px bg-slate-300 mx-0.5" />

                        {/* Font size dropdown */}
                        <select
                          value={fontSize}
                          onChange={(e) => {
                            setFontSize(e.target.value);
                            executeCmd('fontSize', '4');
                          }}
                          className="text-xs bg-white border border-slate-300 rounded px-1.5 py-0.5 outline-none cursor-pointer"
                        >
                          <option value="12">12</option>
                          <option value="14">14</option>
                          <option value="16">16</option>
                          <option value="18">18</option>
                          <option value="24">24</option>
                        </select>

                        {/* Text color picker */}
                        <div className="flex items-center gap-0.5 bg-white border border-slate-300 rounded px-1.5 py-0.5">
                          <span
                            className="font-bold text-xs"
                            style={{ color: textColor }}
                          >
                            A
                          </span>
                          <input
                            type="color"
                            value={textColor}
                            onChange={(e) => {
                              setTextColor(e.target.value);
                              executeCmd('foreColor', e.target.value);
                            }}
                            className="w-3.5 h-3.5 border-0 p-0 cursor-pointer bg-transparent"
                            title="Text color"
                          />
                        </div>
                        <div className="h-4 w-px bg-slate-300 mx-0.5" />

                        <button
                          type="button"
                          onClick={() => executeCmd('insertUnorderedList')}
                          title="Bullet list"
                          className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition"
                        >
                          <List className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => executeCmd('insertOrderedList')}
                          title="Numbered list"
                          className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition"
                        >
                          <ListOrdered className="w-3.5 h-3.5" />
                        </button>

                        {/* Alignment dropdown */}
                        <button
                          type="button"
                          onClick={() => executeCmd('justifyLeft')}
                          title="Align Left"
                          className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition"
                        >
                          <AlignLeft className="w-3.5 h-3.5" />
                        </button>
                        <div className="h-4 w-px bg-slate-300 mx-0.5" />

                        <button
                          type="button"
                          onClick={() => {
                            const rows = prompt('Number of rows:', '2');
                            const cols = prompt('Number of columns:', '2');
                            if (rows && cols) {
                              const tbl = `<table border="1" style="width:100%; border-collapse:collapse; margin:8px 0;"><tbody>${Array(
                                parseInt(rows, 10) || 2
                              )
                                .fill(
                                  `<tr>${Array(parseInt(cols, 10) || 2)
                                    .fill('<td style="padding:6px; border:1px solid #ccc;">Cell</td>')
                                    .join('')}</tr>`
                                )
                                .join('')}</tbody></table><p></p>`;
                              executeCmd('insertHTML', tbl);
                            }
                          }}
                          title="Insert Table"
                          className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition"
                        >
                          <TableIcon className="w-3.5 h-3.5" />
                        </button>

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

                        <button
                          type="button"
                          onClick={() => {
                            const url = prompt('Enter video embed URL (YouTube/Vimeo):');
                            if (url) {
                              const embed = `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:8px 0;"><iframe src="${url}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allowfullscreen></iframe></div><p></p>`;
                              executeCmd('insertHTML', embed);
                            }
                          }}
                          title="Insert Video"
                          className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition"
                        >
                          <Video className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => executeCmd('insertHorizontalRule')}
                          title="Horizontal line"
                          className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>

                        <div className="h-4 w-px bg-slate-300 mx-0.5" />

                        <button
                          type="button"
                          onClick={() => {
                            if (richTextRef.current) {
                              if (!document.fullscreenElement) {
                                richTextRef.current.requestFullscreen?.();
                              } else {
                                document.exitFullscreen?.();
                              }
                            }
                          }}
                          title="Fullscreen"
                          className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (sourceCodeMode) {
                              setRichTextHtml(formData.description || '');
                            } else {
                              if (richTextRef.current) {
                                handleChange('description', richTextRef.current.innerHTML);
                              }
                            }
                            setSourceCodeMode(!sourceCodeMode);
                          }}
                          title="Source Code"
                          className={`p-1.5 hover:bg-slate-200 rounded transition font-mono text-[11px] ${
                            sourceCodeMode ? 'bg-[#3c8dbc] text-white' : 'text-slate-700'
                          }`}
                        >
                          <Code className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            alert(
                              'WYSIWYG Rich Text Editor\nUse the toolbar to format headers, lists, links, media, and styles.'
                            )
                          }
                          title="Help"
                          className="p-1.5 hover:bg-slate-200 rounded text-slate-500 transition"
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Editor Text Area */}
                      {sourceCodeMode ? (
                        <textarea
                          rows={6}
                          value={formData.description || ''}
                          onChange={(e) => {
                            handleChange('description', e.target.value);
                            setRichTextHtml(e.target.value);
                          }}
                          className="w-full p-3 font-mono text-xs bg-slate-900 text-slate-100 outline-none resize-y"
                        />
                      ) : (
                        <div
                          ref={richTextRef}
                          contentEditable
                          dangerouslySetInnerHTML={{ __html: richTextHtml }}
                          onBlur={(e) => handleChange('description', e.currentTarget.innerHTML)}
                          className="p-3 min-h-[140px] text-xs text-slate-800 outline-none focus:ring-0 leading-relaxed bg-white"
                        />
                      )}

                      {/* Resizable bottom bar */}
                      <div className="bg-[#f8f9fa] border-t border-[#e9ecef] px-3 py-1 flex items-center justify-between text-[10px] text-slate-400 select-none">
                        <span>p</span>
                        <span className="cursor-ns-resize">///</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Parent category */}
            <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
              <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                <span>Parent category</span>
                <Tooltip text="The parent category for this category. If none, this category will be a top-level category." />
              </div>
              <div className="sm:col-span-9">
                <select
                  value={formData.parentId || ''}
                  onChange={(e) => handleChange('parentId', e.target.value)}
                  className="w-full text-xs px-2.5 py-2 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none text-slate-700 cursor-pointer"
                >
                  <option value="">[None]</option>
                  {parentOptions.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Picture */}
            <div className="grid grid-cols-1 sm:grid-cols-12 items-start gap-2">
              <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700 pt-2">
                <span>Picture</span>
                <Tooltip text="The category picture." />
              </div>
              <div className="sm:col-span-9">
                <ImageEditorField
                  value={formData.image || ''}
                  onChange={(url) => handleChange('image', url)}
                  previewHeight="h-28"
                />
              </div>
            </div>

            {/* Restrict from vendors (Advanced only) */}
            {advancedMode && (
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                  <span>Restrict from vendors</span>
                  <Tooltip text="Check if this category is restricted and not available to vendors." />
                </div>
                <div className="sm:col-span-9 flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.restrictFromVendors}
                    onChange={(e) => handleChange('restrictFromVendors', e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                  />
                </div>
              </div>
            )}

          </div>
        )}
      </div>

      {/* DISPLAY CARD */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden">
        {/* Card Header */}
        <div
          onClick={() => setDisplayCollapsed(!displayCollapsed)}
          className="border-b border-[#f4f4f4] px-4 py-2.5 flex items-center justify-between cursor-pointer select-none bg-white hover:bg-slate-50/50 transition"
        >
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-xs sm:text-sm">
            <Monitor className="w-4 h-4 text-slate-800" />
            <span>Display</span>
          </div>
          <button
            type="button"
            className="p-1 text-slate-500 hover:text-slate-700 focus:outline-none cursor-pointer"
          >
            {displayCollapsed ? (
              <Plus className="w-3.5 h-3.5" />
            ) : (
              <Minus className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Card Body */}
        {!displayCollapsed && (
          <div className="p-4 sm:p-6 space-y-4 text-xs text-slate-700">
            {/* Published */}
            <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
              <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                <span>Published</span>
                <Tooltip text="Check to publish this category to the public storefront." />
              </div>
              <div className="sm:col-span-9 flex items-center">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => handleChange('published', e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {advancedMode && (
              <>
                {/* Show on home page */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                  <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                    <span>Show on home page</span>
                    <Tooltip text="Check if this category should be displayed on the home page." />
                  </div>
                  <div className="sm:col-span-9 flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.showOnHomePage}
                      onChange={(e) => handleChange('showOnHomePage', e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                    />
                  </div>
                </div>

                {/* Allow customers to select page size */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                  <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                    <span>Allow customers to select page size</span>
                    <Tooltip text="Whether customers are allowed to select page size from the predefined list of options." />
                  </div>
                  <div className="sm:col-span-9 flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.allowCustomersToSelectPageSize}
                      onChange={(e) => handleChange('allowCustomersToSelectPageSize', e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                    />
                  </div>
                </div>

                {/* Page size options (Tree child with branch connector) */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                  <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                    <span>Page size options</span>
                    <Tooltip text="Comma separated list of page size options (e.g. 6, 3, 9)." />
                  </div>
                  <div className="sm:col-span-9 relative flex items-center pl-6">
                    {/* Vertical line ending at branch */}
                    <div className="absolute left-[7px] -top-4 top-1/2 w-px bg-[#d2d6de]" />
                    {/* Horizontal branch line */}
                    <div className="absolute left-[7px] top-1/2 w-4 h-px bg-[#d2d6de]" />
                    <input
                      type="text"
                      value={formData.pageSizeOptions || ''}
                      onChange={(e) => handleChange('pageSizeOptions', e.target.value)}
                      placeholder="6, 3, 9"
                      className="w-full text-xs px-2.5 py-2 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none text-slate-700"
                    />
                  </div>
                </div>

                {/* Price range filtering */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                  <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                    <span>Price range filtering</span>
                    <Tooltip text="Check to enable price range filtering on category page." />
                  </div>
                  <div className="sm:col-span-9 flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.priceRangeFiltering}
                      onChange={(e) => handleChange('priceRangeFiltering', e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                    />
                  </div>
                </div>

                {/* Tree branch for price range filtering children */}
                <div className="space-y-4 pt-1">
                  {/* Enter price range manually */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                    <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                      <span>Enter price range manually</span>
                      <Tooltip text="Check to enter price range manually (from / to)." />
                    </div>
                    <div className="sm:col-span-9 relative flex items-center pl-6">
                      {/* Vertical line through or ending */}
                      <div className="absolute left-[7px] -top-5 bottom-0 w-px bg-[#d2d6de]" />
                      {/* Horizontal branch line */}
                      <div className="absolute left-[7px] top-1/2 w-4 h-px bg-[#d2d6de]" />
                      <input
                        type="checkbox"
                        checked={formData.manuallyPriceRange}
                        onChange={(e) => handleChange('manuallyPriceRange', e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Price 'from' */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                    <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                      <span>Price &apos;from&apos;</span>
                      <Tooltip text="The minimum price in INR for price range filtering." />
                    </div>
                    <div className="sm:col-span-9 relative flex items-center pl-6">
                      {/* Vertical line passing through */}
                      <div className="absolute left-[7px] -top-5 bottom-0 w-px bg-[#d2d6de]" />
                      {/* Horizontal branch line */}
                      <div className="absolute left-[7px] top-1/2 w-4 h-px bg-[#d2d6de]" />
                      <div className="flex rounded border border-[#d2d6de] overflow-hidden bg-white focus-within:border-[#3c8dbc] focus-within:ring-1 focus-within:ring-[#3c8dbc] w-48">
                        <input
                          type="number"
                          value={formData.priceFrom !== undefined ? formData.priceFrom : 0}
                          onChange={(e) => handleChange('priceFrom', parseFloat(e.target.value) || 0)}
                          className="w-full text-xs px-2.5 py-1.5 outline-none text-slate-800"
                        />
                        <span className="bg-[#eee] px-3 py-1.5 text-xs text-slate-600 border-l border-[#d2d6de] flex items-center select-none font-medium">
                          INR
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Price 'to' */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                    <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                      <span>Price &apos;to&apos;</span>
                      <Tooltip text="The maximum price in INR for price range filtering." />
                    </div>
                    <div className="sm:col-span-9 relative flex items-center pl-6">
                      {/* Vertical line ending at last branch */}
                      <div className="absolute left-[7px] -top-5 top-1/2 w-px bg-[#d2d6de]" />
                      {/* Horizontal branch line */}
                      <div className="absolute left-[7px] top-1/2 w-4 h-px bg-[#d2d6de]" />
                      <div className="flex rounded border border-[#d2d6de] overflow-hidden bg-white focus-within:border-[#3c8dbc] focus-within:ring-1 focus-within:ring-[#3c8dbc] w-48">
                        <input
                          type="number"
                          value={formData.priceTo !== undefined ? formData.priceTo : 10000}
                          onChange={(e) => handleChange('priceTo', parseFloat(e.target.value) || 0)}
                          className="w-full text-xs px-2.5 py-1.5 outline-none text-slate-800"
                        />
                        <span className="bg-[#eee] px-3 py-1.5 text-xs text-slate-600 border-l border-[#d2d6de] flex items-center select-none font-medium">
                          INR
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Display order */}
            <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 pt-1">
              <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                <span>Display order</span>
                <Tooltip text="The display order for this category. 1 represents the top of the list." />
              </div>
              <div className="sm:col-span-9">
                <input
                  type="number"
                  value={formData.displayOrder !== undefined ? formData.displayOrder : 0}
                  onChange={(e) => handleChange('displayOrder', parseInt(e.target.value, 10) || 0)}
                  className="w-full text-xs px-2.5 py-2 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none text-slate-700"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ADVANCED CARDS: MAPPINGS & SEO */}
      {advancedMode && (
        <>
          {/* MAPPINGS CARD */}
          <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden">
            {/* Card Header */}
            <div
              onClick={() => setMappingsCollapsed(!mappingsCollapsed)}
              className="border-b border-[#f4f4f4] px-4 py-2.5 flex items-center justify-between cursor-pointer select-none bg-white hover:bg-slate-50/50 transition"
            >
              <div className="flex items-center gap-2 text-slate-800 font-semibold text-xs sm:text-sm">
                <Bookmark className="w-4 h-4 text-slate-800 fill-slate-800" />
                <span>Mappings</span>
              </div>
              <button
                type="button"
                className="p-1 text-slate-500 hover:text-slate-700 focus:outline-none cursor-pointer"
              >
                {mappingsCollapsed ? (
                  <Plus className="w-3.5 h-3.5" />
                ) : (
                  <Minus className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Card Body */}
            {!mappingsCollapsed && (
              <div className="p-4 sm:p-6 space-y-4 text-xs text-slate-700">
                {/* Discounts */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                  <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                    <span>Discounts</span>
                    <Tooltip text="Discounts applied to this category." />
                  </div>
                  <div className="sm:col-span-9">
                    <div className="bg-[#f4f4f4] text-slate-500 rounded px-3 py-2 text-xs border border-[#e5e5e5]">
                      No discounts available. Create at least one discount before mapping.
                    </div>
                  </div>
                </div>

                {/* Limited to customer roles */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                  <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                    <span>Limited to customer roles</span>
                    <Tooltip text="Determines whether the category is available only to certain customer roles." />
                  </div>
                  <div className="sm:col-span-9 flex flex-col md:flex-row items-start md:items-center gap-3">
                    <input
                      type="text"
                      value={formData.customerRoles || ''}
                      onChange={(e) => handleChange('customerRoles', e.target.value)}
                      placeholder=""
                      className="w-full md:w-72 text-xs px-2.5 py-2 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] outline-none text-slate-700"
                    />
                    <div className="bg-[#f9f9f9] border border-[#d2d6de] rounded p-2 text-slate-600 text-xs shadow-2xs flex-1">
                      In order to use this functionality, you have to disable the following setting: Catalog settings &gt; Ignore ACL rules.
                    </div>
                  </div>
                </div>

                {/* Limited to stores */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                  <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-1 font-medium text-slate-700">
                    <span>Limited to stores</span>
                    <Tooltip text="Determines whether the category is available only in certain stores." />
                  </div>
                  <div className="sm:col-span-9 flex flex-col md:flex-row items-start md:items-center gap-3">
                    <input
                      type="text"
                      value={formData.limitedToStores || ''}
                      onChange={(e) => handleChange('limitedToStores', e.target.value)}
                      placeholder=""
                      className="w-full md:w-72 text-xs px-2.5 py-2 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] outline-none text-slate-700"
                    />
                    <div className="bg-[#f9f9f9] border border-[#d2d6de] rounded p-2 text-slate-600 text-xs shadow-2xs flex-1">
                      In order to use this functionality, you have to disable the following setting: Catalog settings &gt; Ignore &quot;limit per store&quot; rules.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SEO CARD (with top cyan stripe) */}
          <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden border-t-2 border-t-[#00c0ef]">
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
                className="p-1 text-slate-500 hover:text-slate-700 focus:outline-none cursor-pointer"
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
                {/* Tabbed box container matching screenshot */}
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
                        <Tooltip text="Set a search engine friendly page name such as 'the-best-category' to make your category page URL more SEO-friendly. If left empty, the category name will be used." />
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
                        <Tooltip text="Keywords to include in category page meta tags for search engines." />
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
                        <Tooltip text="Brief description to be included in category page meta tags for search engines." />
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

      {/* Products Card (Shown in Edit mode or when category exists) */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs mb-6">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#f4f4f4] bg-white">
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
            <TableIcon className="w-4 h-4 text-slate-700" />
            <span>Products</span>
          </div>
          <button
            type="button"
            onClick={() => setProductsCollapsed(!productsCollapsed)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer transition"
          >
            {productsCollapsed ? (
              <Plus className="w-4 h-4" />
            ) : (
              <Minus className="w-4 h-4" />
            )}
          </button>
        </div>

        {!productsCollapsed && (
          <div className="p-4 sm:p-5">
            {!formData.id && !isEdit ? (
              <div className="p-4 text-xs text-slate-500 bg-slate-50 rounded border border-slate-200">
                You need to save the category before you can add products for this category page.
              </div>
            ) : (
              <>
                <div className="overflow-x-auto border border-[#d2d6de] rounded-xs bg-white">
                  <table className="w-full text-xs text-left text-slate-700">
                    <thead className="bg-[#f4f4f4] border-b border-[#d2d6de] text-slate-800 font-semibold">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left">
                          Product
                        </th>
                        <th scope="col" className="px-4 py-3 text-center whitespace-nowrap">
                          Is featured product?
                        </th>
                        <th scope="col" className="px-4 py-3 text-center whitespace-nowrap">
                          Display order
                        </th>
                        <th scope="col" className="px-4 py-3 text-center whitespace-nowrap">
                          View
                        </th>
                        <th scope="col" className="px-4 py-3 text-center whitespace-nowrap">
                          Edit
                        </th>
                        <th scope="col" className="px-4 py-3 text-center whitespace-nowrap">
                          Delete
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f4f4f4]">
                      {categoryProducts.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                            No products assigned to this category.
                          </td>
                        </tr>
                      ) : (
                        categoryProducts.map((prod, idx) => (
                          <tr
                            key={prod.id}
                            className={`transition hover:bg-[#f5f5f5] ${
                              idx % 2 === 1 ? 'bg-[#f9f9f9]' : 'bg-white'
                            }`}
                          >
                            <td className="px-4 py-2.5 font-normal text-slate-800">
                              {prod.name}
                            </td>
                            <td className="px-4 py-2.5 text-center">
                              {prod.isFeatured ? (
                                <span className="text-[#00a65a] font-bold text-sm inline-block">
                                  ✓
                                </span>
                              ) : (
                                <span className="text-[#dd4b39] font-bold text-sm inline-block">
                                  ✕
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-2.5 text-center text-slate-700">
                              {prod.displayOrder !== undefined ? prod.displayOrder : idx + 1}
                            </td>
                            <td className="px-4 py-2.5 text-center">
                              <a
                                href={`http://localhost:3000/products/${prod.slug || prod.id}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#d2d6de] text-slate-700 hover:text-slate-900 rounded hover:bg-slate-50 shadow-2xs transition text-xs"
                              >
                                <Eye className="w-3.5 h-3.5 text-slate-600" />
                                <span>View</span>
                              </a>
                            </td>
                            <td className="px-4 py-2.5 text-center">
                              <Link
                                href={`/admin/catalogue/products/${prod.id}/edit`}
                                className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#d2d6de] text-slate-700 hover:text-slate-900 rounded hover:bg-slate-50 shadow-2xs transition text-xs"
                              >
                                <Pencil className="w-3.5 h-3.5 text-slate-700" />
                                <span>Edit</span>
                              </Link>
                            </td>
                            <td className="px-4 py-2.5 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveProductFromCategory(prod.id)}
                                className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#d2d6de] text-slate-700 hover:text-red-600 rounded hover:bg-slate-50 shadow-2xs transition text-xs cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-slate-500" />
                                <span>Delete</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer / Pagination */}
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 select-none">
                  <div className="inline-flex items-center rounded border border-[#d2d6de] overflow-hidden bg-white shadow-2xs">
                    <button
                      type="button"
                      disabled
                      className="px-3 py-1 text-slate-400 bg-white hover:bg-slate-50 cursor-not-allowed border-r border-[#d2d6de]"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      className="px-3 py-1 bg-[#3c8dbc] text-white font-medium border-r border-[#3c8dbc]"
                    >
                      1
                    </button>
                    <button
                      type="button"
                      disabled
                      className="px-3 py-1 text-slate-400 bg-white hover:bg-slate-50 cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span>Show</span>
                    <select
                      value={pageSize}
                      onChange={(e) => setPageSize(e.target.value)}
                      className="border border-[#d2d6de] rounded px-2 py-1 bg-white outline-none cursor-pointer"
                    >
                      <option value="15">15</option>
                      <option value="20">20</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </select>
                    <span>items</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span>
                      {categoryProducts.length > 0
                        ? `1-${categoryProducts.length} of ${categoryProducts.length} items`
                        : '0 items'}
                    </span>
                    <button
                      type="button"
                      onClick={fetchCategoryProducts}
                      className="p-1.5 border border-[#d2d6de] rounded bg-white hover:bg-slate-100 text-slate-600 cursor-pointer shadow-2xs transition"
                      title="Refresh"
                    >
                      <RotateCw className={`w-3.5 h-3.5 ${loadingProducts ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Add a new product button */}
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => setAddProductModalOpen(true)}
                    className="px-3.5 py-1.5 bg-[#2585be] hover:bg-[#1e6f9f] text-white text-xs font-normal rounded shadow-2xs transition inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    Add a new product
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Add a new product Modal */}
      {addProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded shadow-xl w-full max-w-2xl border border-slate-300 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
              <h3 className="text-sm font-semibold text-slate-800">
                Add a new product to category
              </h3>
              <button
                type="button"
                onClick={() => setAddProductModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search products by name or SKU..."
                  value={productSearchTerm}
                  onChange={(e) => setProductSearchTerm(e.target.value)}
                  className="flex-1 text-xs px-3 py-2 border border-[#d2d6de] rounded focus:border-[#3c8dbc] outline-none"
                />
                <button
                  type="button"
                  className="px-3 py-2 bg-[#3c8dbc] text-white text-xs rounded hover:bg-[#367fa9]"
                >
                  Search
                </button>
              </div>

              <div className="border border-slate-200 rounded max-h-72 overflow-y-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#f8f9fa] border-b border-slate-200 text-slate-700">
                    <tr>
                      <th className="px-3 py-2">Select</th>
                      <th className="px-3 py-2">Product Name</th>
                      <th className="px-3 py-2">SKU</th>
                      <th className="px-3 py-2">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {allAvailableProducts
                      .filter((p) => {
                        const matchesSearch =
                          p.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
                          (p.sku && p.sku.toLowerCase().includes(productSearchTerm.toLowerCase()));
                        return matchesSearch;
                      })
                      .map((p) => {
                        const isAlreadyAssigned = p.categoryId === formData.id;
                        return (
                          <tr
                            key={p.id}
                            onClick={() => setSelectedProductToAdd(p.id)}
                            className={`cursor-pointer hover:bg-slate-50 ${
                              selectedProductToAdd === p.id ? 'bg-blue-50/60' : ''
                            }`}
                          >
                            <td className="px-3 py-2">
                              <input
                                type="radio"
                                name="selectedProduct"
                                checked={selectedProductToAdd === p.id}
                                onChange={() => setSelectedProductToAdd(p.id)}
                                className="cursor-pointer"
                              />
                            </td>
                            <td className="px-3 py-2 font-medium text-slate-800">
                              {p.name}
                              {isAlreadyAssigned && (
                                <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-green-100 text-green-700 rounded font-normal">
                                  Already assigned
                                </span>
                              )}
                            </td>
                            <td className="px-3 py-2 text-slate-600">{p.sku || '—'}</td>
                            <td className="px-3 py-2 text-slate-600">₹{p.price?.toLocaleString()}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>

              <div className="text-right text-xs">
                <Link
                  href="/admin/catalogue/products/new"
                  target="_blank"
                  className="text-[#3c8dbc] hover:underline"
                >
                  + Create a brand new product in a new tab
                </Link>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-200 bg-slate-50">
              <button
                type="button"
                onClick={() => setAddProductModalOpen(false)}
                className="px-3 py-1.5 border border-[#d2d6de] text-slate-700 text-xs rounded hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!selectedProductToAdd}
                onClick={() => handleAddProductToCategory(selectedProductToAdd)}
                className={`px-4 py-1.5 text-white text-xs rounded cursor-pointer transition ${
                  selectedProductToAdd
                    ? 'bg-[#3c8dbc] hover:bg-[#367fa9]'
                    : 'bg-slate-300 cursor-not-allowed'
                }`}
              >
                Assign Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer info matching nopCommerce */}
      <div className="mt-8 pt-4 pb-12 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          Powered by{' '}
          <a
            href="https://www.nopcommerce.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#3c8dbc] hover:underline"
          >
            nopCommerce
          </a>
        </div>
        <div>Wednesday, September 30, 2026 11:25 AM</div>
        <div>nopCommerce version 4.90.0</div>
      </div>

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

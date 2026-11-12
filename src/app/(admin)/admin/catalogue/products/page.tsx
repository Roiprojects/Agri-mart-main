'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Edit3,
  FileText,
  Download,
  Upload,
  Trash2,
  Search,
  ChevronUp,
  ChevronDown,
  Check,
  X,
  HelpCircle,
  Package,
  Printer,
  ChevronRight,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  SlidersHorizontal,
  Save,
} from 'lucide-react';
import { ProductForm, ProductFormData } from './ProductForm';
import {
  markProductDeletedOverride,
  mergeProductsWithOverrides,
  saveProductOverride,
  saveProductOverridesBulk,
} from '@/lib/admin-product-overrides';
import { mergeCategoriesWithOverrides } from '@/lib/admin-category-overrides';
import { mergeBrandsWithOverrides } from '@/lib/admin-brand-overrides';

interface Product {
  id: string;
  name: string;
  nameKn?: string;
  slug?: string;
  sku: string;
  categoryId: string;
  parentCategoryId?: string;
  subCategoryId?: string;
  brandId?: string;
  price: number;
  comparePrice?: number;
  cost?: number;
  stockQuantity?: number;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  gtin?: string;
  manufacturerPartNumber?: string;
  vendor?: string;
  taxCategory?: string;
  deliveryDate?: string;
  shortDescription?: string;
  description?: string;
  metaTitle?: string;
  metaKeywords?: string;
  metaDescription?: string;
  isPublished: boolean;
  isDraft?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  disableBuyButton?: boolean;
  disableWishlistButton?: boolean;
  callForPrice?: boolean;
  availableForPreOrder?: boolean;
  images?: string[];
  category?: { id?: string; name: string; parentId?: string | null };
  parentCategory?: { id: string; name: string };
  subCategory?: { id: string; name: string };
  categoryHierarchy?: string;
  brand?: { id?: string; name: string };
  variants?: { stockQuantity?: number; sku?: string; price?: number; title?: string }[];
  specifications?: { id?: string; group?: string; name: string; value: string }[];
  targetCrops?: string;
  cropStages?: string;
}

interface CategoryOption {
  id: string;
  name: string;
  parentId?: string | null;
}

interface BrandOption {
  id: string;
  name: string;
}

export default function AdminProductsPage() {
  const router = useRouter();

  // Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [brands, setBrands] = useState<BrandOption[]>([]);
  const [loading, setLoading] = useState(true);

  // Selection State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Search Collapsible State
  const [searchOpen, setSearchOpen] = useState(true);

  // Filter States
  const [filterName, setFilterName] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterSubcategoryId, setFilterSubcategoryId] = useState('All');
  const [filterSubcategories, setFilterSubcategories] = useState(false);
  const [filterManufacturer, setFilterManufacturer] = useState('All');
  const [filterProductType, setFilterProductType] = useState('All');
  const [filterPublished, setFilterPublished] = useState('All');
  const [skuSearchInput, setSkuSearchInput] = useState('');

  // Applied Filters
  const [appliedFilters, setAppliedFilters] = useState({
    name: '',
    category: 'All',
    subcategoryId: 'All',
    subcategories: false,
    manufacturer: 'All',
    productType: 'All',
    published: 'All',
    sku: '',
  });

  // Export Dropdown State
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  // Modal States
  const [bulkEditOpen, setBulkEditOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Bulk Edit Form State
  const [bulkPriceChange, setBulkPriceChange] = useState('');
  const [bulkPriceType, setBulkPriceType] = useState<'percent' | 'fixed'>('percent');
  const [bulkStockChange, setBulkStockChange] = useState('');
  const [bulkPublishState, setBulkPublishState] = useState<'keep' | 'publish' | 'unpublish'>('keep');

  // Import State
  const [importFileContent, setImportFileContent] = useState('');
  const [importFileName, setImportFileName] = useState('');
  const [importing, setImporting] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Close export dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setExportDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch initial data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes, brandRes] = await Promise.all([
        fetch('/api/admin/catalogue/products', { cache: 'no-store' }).then((r) => r.json()),
        fetch('/api/admin/catalogue/categories', { cache: 'no-store' }).then((r) => r.json()),
        fetch('/api/admin/brands', { cache: 'no-store' }).then((r) => r.json()),
      ]);

      const loadedCategories: CategoryOption[] = mergeCategoriesWithOverrides(
        catRes.success && Array.isArray(catRes.data) ? catRes.data : []
      );
      const loadedBrands: BrandOption[] = mergeBrandsWithOverrides(
        brandRes.success && Array.isArray(brandRes.data) ? brandRes.data : []
      );

      if (loadedCategories.length > 0) {
        setCategories(loadedCategories);
      }
      if (loadedBrands.length > 0) {
        setBrands(loadedBrands);
      }

      let loadedProducts: Product[] = [];
      if (prodRes.success && Array.isArray(prodRes.data)) {
        loadedProducts = prodRes.data;
      }

      const merged = mergeProductsWithOverrides(
        loadedProducts,
        loadedCategories,
        loadedBrands
      );
      setProducts(merged);
    } catch (err) {
      console.error('Error loading products:', err);
      showToast('Failed to load products catalogue.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Category Map & Parent/Child Helpers
  const categoryMap = useMemo(() => {
    const map = new Map<string, CategoryOption>();
    categories.forEach((c) => map.set(c.id, c));
    return map;
  }, [categories]);

  const parentCategories = useMemo(
    () => categories.filter((c) => !c.parentId),
    [categories]
  );

  const childCategories = useMemo(
    () => categories.filter((c) => Boolean(c.parentId)),
    [categories]
  );

  const availableSubcategoriesForFilter = useMemo(() => {
    if (filterCategory === 'All') return childCategories;
    const selectedCat = categoryMap.get(filterCategory);
    if (selectedCat?.parentId) {
      return childCategories.filter((c) => c.parentId === selectedCat.parentId);
    }
    return childCategories.filter((c) => c.parentId === filterCategory);
  }, [filterCategory, childCategories, categoryMap]);

  const getCategoryHierarchyLabel = (cat: CategoryOption): string => {
    if (!cat.parentId) return cat.name;
    const parent = categoryMap.get(cat.parentId);
    return parent ? `${parent.name} >> ${cat.name}` : cat.name;
  };

  const resolveProductCategories = (p: Product) => {
    let parentName = p.parentCategory?.name || '';
    let childName = p.subCategory?.name || '';
    let parentId = p.parentCategoryId || p.parentCategory?.id || '';
    let childId = p.subCategoryId || p.subCategory?.id || '';

    if (!parentName && p.categoryId) {
      const cat = categoryMap.get(p.categoryId);
      if (cat) {
        if (cat.parentId) {
          childName = childName || cat.name;
          childId = childId || cat.id;
          const parent = categoryMap.get(cat.parentId);
          if (parent) {
            parentName = parent.name;
            parentId = parent.id;
          }
        } else {
          parentName = cat.name;
          parentId = cat.id;
        }
      }
    }

    if (!childName && p.subCategoryId) {
      const sub = categoryMap.get(p.subCategoryId);
      if (sub) {
        childName = sub.name;
        childId = sub.id;
        if (!parentName && sub.parentId) {
          const parent = categoryMap.get(sub.parentId);
          if (parent) {
            parentName = parent.name;
            parentId = parent.id;
          }
        }
      }
    }

    if (!parentName && p.category?.name) {
      parentName = p.category.name;
    }

    // Fallback default child category if parent has subcategories
    if (parentId && !childName) {
      const firstSub = childCategories.find((c) => c.parentId === parentId);
      if (firstSub) {
        childName = firstSub.name;
        childId = firstSub.id;
      }
    }

    return {
      parentId,
      childId,
      parentName: parentName || 'Uncategorized',
      childName: childName || 'General Subcategory',
      fullHierarchy: childName
        ? `${parentName || 'Uncategorized'} >> ${childName}`
        : parentName || 'Uncategorized',
    };
  };

  const [advancedMode, setAdvancedMode] = useState(true);
  const [inlineFormSaving, setInlineFormSaving] = useState(false);
  const [showInlineForm, setShowInlineForm] = useState(true);
  const autoFilledFromUrlRef = useRef<string>('');

  // Inline table row quick-edit state
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [rowEditData, setRowEditData] = useState<{
    name: string;
    sku: string;
    brandId: string;
    parentCategoryId: string;
    subCategoryId: string;
    price: number;
    comparePrice: number;
    stockQuantity: number;
    targetCrops: string;
    isPublished: boolean;
  } | null>(null);
  const [rowSaving, setRowSaving] = useState(false);

  const handleStartRowEdit = (p: Product) => {
    const resolved = resolveProductCategories(p);
    const currentStock =
      p.stockQuantity !== undefined
        ? Number(p.stockQuantity)
        : p.variants?.reduce((sum, v) => sum + (v.stockQuantity || 0), 0) || 0;

    setEditingRowId(p.id);
    setRowEditData({
      name: p.name || '',
      sku: p.sku || '',
      brandId: p.brandId || brands[0]?.id || 'br-agripro',
      parentCategoryId: resolved.parentId || p.categoryId || parentCategories[0]?.id || '',
      subCategoryId: resolved.childId || p.subCategoryId || '',
      price: Number(p.price) || 0,
      comparePrice: p.comparePrice !== undefined ? Number(p.comparePrice) : Number(p.price) || 0,
      stockQuantity: currentStock,
      targetCrops: p.targetCrops || '',
      isPublished: Boolean(p.isPublished),
    });
  };

  const handleCancelRowEdit = () => {
    setEditingRowId(null);
    setRowEditData(null);
  };

  const handleSaveRowEdit = async (p: Product) => {
    if (!rowEditData) return;
    if (!rowEditData.name.trim() || !rowEditData.sku.trim()) {
      showToast('Product name and SKU are required.', 'error');
      return;
    }

    try {
      setRowSaving(true);
      const parentCat = categoryMap.get(rowEditData.parentCategoryId);
      const subCat = rowEditData.subCategoryId
        ? categoryMap.get(rowEditData.subCategoryId)
        : undefined;
      const brandObj = brands.find((b) => b.id === rowEditData.brandId);

      const payload = {
        ...p,
        id: p.id,
        name: rowEditData.name.trim(),
        sku: rowEditData.sku.trim(),
        brandId: rowEditData.brandId,
        categoryId: rowEditData.parentCategoryId || p.categoryId,
        parentCategoryId: rowEditData.parentCategoryId || p.parentCategoryId,
        subCategoryId: rowEditData.subCategoryId || '',
        price: Number(rowEditData.price) || 0,
        comparePrice: Number(rowEditData.comparePrice) || 0,
        stockQuantity: Number(rowEditData.stockQuantity) || 0,
        targetCrops: rowEditData.targetCrops,
        isPublished: Boolean(rowEditData.isPublished),
      };

      const res = await fetch(`/api/admin/catalogue/products/${p.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      const updatedProd: Product = {
        ...p,
        ...(json.data || {}),
        ...payload,
        category: parentCat
          ? { id: parentCat.id, name: parentCat.name, parentId: parentCat.parentId }
          : p.category,
        parentCategory: parentCat
          ? { id: parentCat.id, name: parentCat.name }
          : p.parentCategory,
        subCategory: subCat ? { id: subCat.id, name: subCat.name } : undefined,
        brand: brandObj ? { id: brandObj.id, name: brandObj.name } : p.brand,
        variants: [
          {
            ...(p.variants?.[0] || {}),
            sku: payload.sku,
            price: payload.price,
            stockQuantity: payload.stockQuantity,
          },
        ],
      };

      saveProductOverride(updatedProd);
      setProducts((prev) =>
        prev.map((item) => (item.id === p.id ? updatedProd : item))
      );
      setEditingRowId(null);
      setRowEditData(null);
      showToast(`Product "${updatedProd.name}" edited and saved successfully!`);
    } catch (err: any) {
      showToast(`Error saving product: ${err.message}`, 'error');
    } finally {
      setRowSaving(false);
    }
  };

  // Auto-fill all search/filter inputs and select the product to display its full details & editable form
  const autoFillProductDetails = (targetProduct: Product, applyToTableFilter = false) => {
    const resolved = resolveProductCategories(targetProduct);
    const parentCatValue = resolved.parentId || 'All';
    const childCatValue = resolved.childId || 'All';
    const brandValue = targetProduct.brandId || 'All';
    const prodTypeValue = (targetProduct as any).productType || 'Simple';

    setFilterName(targetProduct.name || '');
    setFilterCategory(parentCatValue);
    setFilterSubcategoryId(childCatValue);
    setFilterSubcategories(false);
    setFilterManufacturer(brandValue);
    setFilterProductType(prodTypeValue);
    setFilterPublished('All');
    setSkuSearchInput(targetProduct.sku || '');

    if (applyToTableFilter) {
      setAppliedFilters({
        name: targetProduct.name || '',
        category: parentCatValue,
        subcategoryId: childCatValue,
        subcategories: false,
        manufacturer: brandValue,
        productType: 'All',
        published: 'All',
        sku: targetProduct.sku || '',
      });
      setCurrentPage(1);
    }

    setSelectedIds((prev) =>
      prev.includes(targetProduct.id) ? prev : [targetProduct.id, ...prev]
    );
    setShowInlineForm(true);
  };

  // Automatically read URL query parameters (?productId=...&sku=...&name=...) when navigated from Product Attributes or Specification Attributes
  useEffect(() => {
    if (typeof window === 'undefined' || products.length === 0) return;
    const params = new URLSearchParams(window.location.search);
    const qProductId = (params.get('productId') || params.get('id') || '').trim();
    const qSku = (params.get('sku') || '').trim();
    const qName = (params.get('name') || params.get('search') || '').trim();

    if (!qProductId && !qSku && !qName) return;

    const querySignature = `${qProductId}|${qSku}|${qName}|${categories.length}`;
    if (autoFilledFromUrlRef.current === querySignature) return;

    const matched =
      products.find(
        (p) =>
          (qProductId && p.id.toLowerCase() === qProductId.toLowerCase()) ||
          (qSku && p.sku?.toLowerCase() === qSku.toLowerCase())
      ) ||
      products.find(
        (p) =>
          (qProductId && p.id.toLowerCase().includes(qProductId.toLowerCase())) ||
          (qSku && p.sku?.toLowerCase().includes(qSku.toLowerCase())) ||
          (qName && p.name?.toLowerCase().includes(qName.toLowerCase()))
      );

    if (matched) {
      autoFilledFromUrlRef.current = querySignature;
      autoFillProductDetails(matched, true);
      showToast(
        `Auto-filled all product details for "${matched.name}" (ID: ${matched.id}, SKU: ${matched.sku}).`
      );
    }
  }, [products, categories]);

  // Save handler for the inline Auto-Filled Product Form directly on the Products page
  const handleSaveInlineProduct = async (formData: ProductFormData, continueEditing = false) => {
    const targetId = formData.id || selectedIds[0];
    if (!targetId) return;
    try {
      setInlineFormSaving(true);
      const existingProd = products.find((p) => p.id === targetId);
      const parentCat = formData.parentCategoryId
        ? categoryMap.get(formData.parentCategoryId)
        : formData.categoryId
        ? categoryMap.get(formData.categoryId)
        : undefined;
      const subCat = formData.subCategoryId
        ? categoryMap.get(formData.subCategoryId)
        : undefined;
      const brandObj = formData.brandId
        ? brands.find((b) => b.id === formData.brandId)
        : undefined;

      const payload = {
        ...(existingProd || {}),
        ...formData,
        id: targetId,
        slug: formData.seName || existingProd?.slug || targetId,
        categoryId: formData.parentCategoryId || formData.categoryId || existingProd?.categoryId || '',
        parentCategoryId: formData.parentCategoryId || formData.categoryId || existingProd?.parentCategoryId || '',
        subCategoryId: formData.subCategoryId ?? existingProd?.subCategoryId ?? '',
        price: Number(formData.price) || 0,
        comparePrice: formData.comparePrice !== undefined ? Number(formData.comparePrice) : 0,
        cost: formData.cost !== undefined ? Number(formData.cost) : 0,
        stockQuantity: formData.stockQuantity !== undefined ? Number(formData.stockQuantity) : 0,
        isPublished: Boolean(formData.isPublished),
      };

      const res = await fetch(`/api/admin/catalogue/products/${targetId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        const updatedProd: Product = {
          ...(existingProd || {}),
          ...(json.data || {}),
          ...payload,
          category: parentCat
            ? { id: parentCat.id, name: parentCat.name, parentId: parentCat.parentId }
            : existingProd?.category,
          parentCategory: parentCat
            ? { id: parentCat.id, name: parentCat.name }
            : existingProd?.parentCategory,
          subCategory: subCat
            ? { id: subCat.id, name: subCat.name }
            : existingProd?.subCategory,
          brand: brandObj
            ? { id: brandObj.id, name: brandObj.name }
            : existingProd?.brand,
          variants: [
            {
              ...(existingProd?.variants?.[0] || {}),
              sku: payload.sku,
              price: payload.price,
              stockQuantity: payload.stockQuantity,
            },
          ],
        };

        saveProductOverride(updatedProd);
        setProducts((prev) =>
          prev.map((item) => (item.id === targetId ? updatedProd : item))
        );
        showToast(`Product "${updatedProd.name}" updated and saved successfully!`);
        if (!continueEditing) {
          setShowInlineForm(false);
        }
      } else {
        showToast(json.error || 'Failed to update product', 'error');
      }
    } catch (err: any) {
      showToast(`Error saving product: ${err.message}`, 'error');
    } finally {
      setInlineFormSaving(false);
    }
  };

  // Apply filters on Search button click
  const handleApplySearch = () => {
    setAppliedFilters({
      name: filterName.trim(),
      category: filterCategory,
      subcategoryId: filterSubcategoryId,
      subcategories: filterSubcategories,
      manufacturer: filterManufacturer,
      productType: filterProductType,
      published: filterPublished,
      sku: skuSearchInput.trim(),
    });
    setCurrentPage(1);
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilterName('');
    setFilterCategory('All');
    setFilterSubcategoryId('All');
    setFilterSubcategories(false);
    setFilterManufacturer('All');
    setFilterProductType('All');
    setFilterPublished('All');
    setSkuSearchInput('');
    setAppliedFilters({
      name: '',
      category: 'All',
      subcategoryId: 'All',
      subcategories: false,
      manufacturer: 'All',
      productType: 'All',
      published: 'All',
      sku: '',
    });
    setSelectedIds([]);
    setCurrentPage(1);
    if (typeof window !== 'undefined' && window.location.search) {
      window.history.replaceState({}, '', '/admin/catalogue/products');
    }
  };

  // Quick Go directly to product SKU
  const handleGoSku = () => {
    if (!skuSearchInput.trim()) {
      showToast('Please enter a product SKU.', 'error');
      return;
    }
    const cleanSku = skuSearchInput.trim().toLowerCase();
    const matched = products.find(
      (p) =>
        p.sku?.toLowerCase() === cleanSku ||
        p.id?.toLowerCase() === cleanSku ||
        p.variants?.some((v) => v.sku?.toLowerCase() === cleanSku)
    );

    if (matched) {
      autoFillProductDetails(matched, true);
      showToast(`Auto-filled product details for SKU "${matched.sku}" (${matched.name}).`);
    } else {
      // Filter the table by this SKU
      setAppliedFilters((prev) => ({ ...prev, sku: skuSearchInput.trim() }));
      showToast(`No exact match to jump directly. Filtered table by SKU "${skuSearchInput}".`);
    }
  };

  // Filtered Products Memo
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const resolved = resolveProductCategories(p);

      // Product Name / ID / SKU filter
      if (appliedFilters.name) {
        const query = appliedFilters.name.toLowerCase();
        const matchesName = p.name?.toLowerCase().includes(query);
        const matchesSku = p.sku?.toLowerCase().includes(query);
        const matchesId = p.id?.toLowerCase().includes(query);
        if (!matchesName && !matchesSku && !matchesId) return false;
      }

      // SKU filter
      if (appliedFilters.sku) {
        const querySku = appliedFilters.sku.toLowerCase();
        const matchesMainSku = p.sku?.toLowerCase().includes(querySku);
        const matchesVariantSku = p.variants?.some((v) =>
          v.sku?.toLowerCase().includes(querySku)
        );
        if (!matchesMainSku && !matchesVariantSku) return false;
      }

      // Category & Subcategory filter
      if (appliedFilters.category !== 'All') {
        const targetCat = appliedFilters.category;
        const subIdsOfTarget = childCategories
          .filter((c) => c.parentId === targetCat)
          .map((c) => c.id);

        const directMatch =
          p.categoryId === targetCat ||
          p.parentCategoryId === targetCat ||
          p.subCategoryId === targetCat ||
          resolved.parentId === targetCat ||
          resolved.childId === targetCat ||
          p.category?.id === targetCat;

        const subCatMatch =
          subIdsOfTarget.includes(p.categoryId) ||
          (p.subCategoryId ? subIdsOfTarget.includes(p.subCategoryId) : false) ||
          (resolved.childId ? subIdsOfTarget.includes(resolved.childId) : false);

        if (!directMatch && !subCatMatch) return false;
      }

      // Explicit Subcategory dropdown filter
      if (appliedFilters.subcategoryId !== 'All') {
        const targetSub = appliedFilters.subcategoryId;
        const matchesSub =
          p.subCategoryId === targetSub ||
          p.categoryId === targetSub ||
          resolved.childId === targetSub;
        if (!matchesSub) return false;
      }

      // Manufacturer / Brand filter
      if (appliedFilters.manufacturer !== 'All') {
        const brandMatch =
          p.brandId === appliedFilters.manufacturer ||
          p.brand?.name?.toLowerCase() === appliedFilters.manufacturer.toLowerCase() ||
          p.brand?.id === appliedFilters.manufacturer;
        if (!brandMatch) return false;
      }

      // Published filter
      if (appliedFilters.published === 'Published only' && !p.isPublished) {
        return false;
      }
      if (appliedFilters.published === 'Unpublished only' && p.isPublished) {
        return false;
      }

      return true;
    });
  }, [products, appliedFilters, categoryMap, childCategories]);

  // Pagination slice
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  // Select all visible toggle
  const isAllSelected =
    paginatedProducts.length > 0 &&
    paginatedProducts.every((p) => selectedIds.includes(p.id));

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      const pageIds = paginatedProducts.map((p) => p.id);
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      const pageIds = paginatedProducts.map((p) => p.id);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const handleToggleSelectRow = (id: string) => {
    const isCurrentlySelected = selectedIds.includes(id);
    if (!isCurrentlySelected) {
      const targetProd = products.find((item) => item.id === id);
      if (targetProd) {
        autoFillProductDetails(targetProd, false);
      }
    }
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Toggle Published Status inline
  const handleTogglePublished = async (p: Product) => {
    const updatedStatus = !p.isPublished;
    const updatedProd = { ...p, isPublished: updatedStatus };
    // Optimistic UI update
    setProducts((prev) =>
      prev.map((item) =>
        item.id === p.id ? updatedProd : item
      )
    );
    saveProductOverride(updatedProd);

    try {
      await fetch(`/api/admin/catalogue/products/${p.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: p.id,
          isPublished: updatedStatus,
        }),
      });
      showToast(
        `Product "${p.name}" is now ${updatedStatus ? 'Published ✓' : 'Unpublished'}.`
      );
    } catch {
      // Revert if error
      setProducts((prev) =>
        prev.map((item) =>
          item.id === p.id ? { ...item, isPublished: p.isPublished } : item
        )
      );
      showToast('Failed to update published status.', 'error');
    }
  };

  // Delete Selected Products
  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    setDeleting(true);
    try {
      for (const id of selectedIds) {
        markProductDeletedOverride(id);
        try {
          await fetch(`/api/admin/catalogue/products?id=${id}`, {
            method: 'DELETE',
          });
        } catch (_) {
          await fetch(`/api/admin/catalogue/products/${id}`, {
            method: 'DELETE',
          });
        }
      }
      setProducts((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
      showToast(
        `Successfully deleted ${selectedIds.length} product${selectedIds.length > 1 ? 's' : ''}.`
      );
      setSelectedIds([]);
      setDeleteConfirmOpen(false);
    } catch (err: any) {
      showToast(`Error deleting products: ${err.message}`, 'error');
    } finally {
      setDeleting(false);
    }
  };

  // Export to CSV
  const handleExportCSV = (selectedOnly: boolean) => {
    const targetProducts = selectedOnly
      ? products.filter((p) => selectedIds.includes(p.id))
      : filteredProducts;

    if (targetProducts.length === 0) {
      showToast('No products available to export.', 'error');
      return;
    }

    const headers = [
      'ID',
      'Name',
      'SKU',
      'Price',
      'ComparePrice',
      'StockQuantity',
      'Category',
      'Manufacturer',
      'Published',
    ];

    const rows = targetProducts.map((p) => {
      const stock =
        p.variants?.reduce((sum, v) => sum + (v.stockQuantity || 0), 0) || 0;
      return [
        `"${p.id}"`,
        `"${(p.name || '').replace(/"/g, '""')}"`,
        `"${p.sku || ''}"`,
        p.price || 0,
        p.comparePrice || '',
        stock,
        `"${(p.category?.name || '').replace(/"/g, '""')}"`,
        `"${(p.brand?.name || '').replace(/"/g, '""')}"`,
        p.isPublished ? 'Yes' : 'No',
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `products_export_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setExportDropdownOpen(false);
    showToast(`Exported ${targetProducts.length} product(s) to CSV.`);
  };

  // Export to XML
  const handleExportXML = (selectedOnly: boolean) => {
    const targetProducts = selectedOnly
      ? products.filter((p) => selectedIds.includes(p.id))
      : filteredProducts;

    if (targetProducts.length === 0) {
      showToast('No products available to export.', 'error');
      return;
    }

    const xmlItems = targetProducts
      .map((p) => {
        const stock =
          p.variants?.reduce((sum, v) => sum + (v.stockQuantity || 0), 0) || 0;
        return `  <Product>
    <Id>${p.id}</Id>
    <Name><![CDATA[${p.name || ''}]]></Name>
    <SKU>${p.sku || ''}</SKU>
    <Price>${p.price || 0}</Price>
    <StockQuantity>${stock}</StockQuantity>
    <Category><![CDATA[${p.category?.name || ''}]]></Category>
    <Manufacturer><![CDATA[${p.brand?.name || ''}]]></Manufacturer>
    <Published>${p.isPublished ? 'true' : 'false'}</Published>
  </Product>`;
      })
      .join('\n');

    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n<Products>\n${xmlItems}\n</Products>`;
    const blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `products_export_${new Date().toISOString().split('T')[0]}.xml`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setExportDropdownOpen(false);
    showToast(`Exported ${targetProducts.length} product(s) to XML.`);
  };

  // Download Catalog as Printable PDF
  const handleDownloadPDF = () => {
    const targetProducts =
      selectedIds.length > 0
        ? products.filter((p) => selectedIds.includes(p.id))
        : filteredProducts;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      showToast('Please allow popups to download catalog as PDF.', 'error');
      return;
    }

    const rowsHtml = targetProducts
      .map((p, idx) => {
        const stock =
          p.variants?.reduce((sum, v) => sum + (v.stockQuantity || 0), 0) || 0;
        const img = p.images?.[0] || 'https://via.placeholder.com/60';
        return `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${idx + 1}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">
            <img src="${img}" style="width: 48px; height: 48px; object-fit: cover; border-radius: 4px;" />
          </td>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">
            ${p.name}<br/>
            <span style="font-size: 11px; color: #666;">SKU: ${p.sku} | ${p.category?.name || 'General'}</span>
          </td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: bold;">
            ₹${p.price?.toLocaleString('en-IN')}
          </td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${stock}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">
            ${p.isPublished ? '✓ Published' : 'Draft'}
          </td>
        </tr>
      `;
      })
      .join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Agri Mart Mega — Product Catalog</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 24px; color: #333; }
            h1 { margin-bottom: 4px; color: #183526; }
            p { margin-top: 0; color: #666; font-size: 13px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
            th { background: #f4f6f9; padding: 10px 8px; border: 1px solid #ddd; text-align: left; }
            @media print {
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #079447; padding-bottom: 12px;">
            <div>
              <h1>AGRI MART MEGA</h1>
              <p>Official Master Product Catalog · Generated on ${new Date().toLocaleDateString('en-IN')}</p>
            </div>
            <button onclick="window.print()" style="padding: 8px 16px; background: #079447; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
              Print / Save as PDF
            </button>
          </div>
          <table>
            <thead>
              <tr>
                <th style="width: 40px; text-align: center;">#</th>
                <th style="width: 60px; text-align: center;">Picture</th>
                <th>Product Name &amp; Details</th>
                <th style="width: 100px; text-align: right;">Price</th>
                <th style="width: 90px; text-align: center;">Stock Qty</th>
                <th style="width: 90px; text-align: center;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
          <script>
            setTimeout(function() { window.print(); }, 500);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Bulk Edit Handler
  const handleBulkEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetIds = selectedIds.length > 0 ? selectedIds : products.map((p) => p.id);

    try {
      const updatedList = products.map((p) => {
        if (!targetIds.includes(p.id)) return p;
        let newPrice = p.price;
        if (bulkPriceChange) {
          const val = parseFloat(bulkPriceChange);
          if (!isNaN(val)) {
            if (bulkPriceType === 'percent') {
              newPrice = Math.round(p.price * (1 + val / 100));
            } else {
              newPrice = Math.max(0, p.price + val);
            }
          }
        }

        let newStock =
          p.stockQuantity !== undefined
            ? Number(p.stockQuantity)
            : p.variants?.[0]?.stockQuantity || 0;
        if (bulkStockChange) {
          const sVal = parseInt(bulkStockChange, 10);
          if (!isNaN(sVal)) newStock = sVal;
        }

        let newPublish = p.isPublished;
        if (bulkPublishState === 'publish') newPublish = true;
        if (bulkPublishState === 'unpublish') newPublish = false;

        const updatedProduct = {
          ...p,
          price: newPrice,
          stockQuantity: newStock,
          isPublished: newPublish,
          variants: p.variants?.map((v, i) =>
            i === 0 ? { ...v, stockQuantity: newStock, price: newPrice } : { ...v, stockQuantity: 0 }
          ) || [{ stockQuantity: newStock, sku: p.sku, price: newPrice }],
        };

        saveProductOverride(updatedProduct);

        // Fire-and-forget background update
        fetch('/api/admin/catalogue/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedProduct),
        }).catch(() => {});

        return updatedProduct;
      });

      setProducts(updatedList);
      showToast(`Bulk updated ${targetIds.length} product(s) successfully!`);
      setBulkEditOpen(false);
      setBulkPriceChange('');
      setBulkStockChange('');
      setBulkPublishState('keep');
    } catch (err: any) {
      showToast(`Failed bulk edit: ${err.message}`, 'error');
    }
  };

  // Import Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setImportFileContent(event.target?.result as string);
    };
    reader.readAsText(file);
  };

  const handleProcessImport = async () => {
    if (!importFileContent) {
      showToast('Please choose a valid CSV or JSON file.', 'error');
      return;
    }

    try {
      setImporting(true);
      let newItems: any[] = [];

      if (importFileName.endsWith('.json')) {
        newItems = JSON.parse(importFileContent);
      } else {
        // Parse CSV
        const lines = importFileContent.split(/\r?\n/).filter((l) => l.trim().length > 0);
        const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
        newItems = lines.slice(1).map((line, idx) => {
          const values = line.split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
          return {
            name: values[1] || `Imported Item ${idx + 1}`,
            sku: values[2] || `IMP-${Date.now()}-${idx}`,
            price: parseFloat(values[3]) || 999,
            categoryId: categories[0]?.id || 'cat-machinery',
            isPublished: values[8]?.toLowerCase() === 'yes',
          };
        });
      }

      for (const item of newItems) {
        await fetch('/api/admin/catalogue/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
      }

      showToast(`Successfully imported ${newItems.length} products!`);
      setImportModalOpen(false);
      setImportFileContent('');
      setImportFileName('');
      fetchData();
    } catch (err: any) {
      showToast(`Import error: ${err.message}`, 'error');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-4 max-w-full text-slate-800">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2.5 text-xs font-semibold animate-fadeIn ${
            toastMessage.type === 'success'
              ? 'bg-emerald-600 text-white'
              : 'bg-red-600 text-white'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 hover:opacity-80"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* TOP HEADER & ACTION BUTTONS BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1 pb-1">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl font-normal text-slate-800 tracking-tight">
            Products
          </h1>

          {/* ADVANCED / BASIC TOGGLE SWITCH (nopCommerce style) */}
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

          <span
            className={`text-[11px] px-2.5 py-0.5 rounded border font-medium ${
              advancedMode
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}
          >
            {advancedMode
              ? 'Advanced mode: All fields visible'
              : 'Basic mode: Showing only mandatory & important fields'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Add New */}
          <Link
            href="/admin/catalogue/products/new"
            className="bg-[#2585be] hover:bg-[#1f73a5] text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 shadow-xs transition"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add new</span>
          </Link>

          {/* Bulk Edit */}
          <Link
            href="/admin/catalogue/products/bulk-edit"
            className="bg-[#00c0ef] hover:bg-[#00a7d0] text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 shadow-xs transition"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Bulk edit products</span>
          </Link>

          {/* Download catalog as PDF */}
          <button
            onClick={handleDownloadPDF}
            className="bg-[#5c6bc0] hover:bg-[#4a58a7] text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 shadow-xs transition"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Download catalog as PDF</span>
          </button>

          {/* Export Dropdown */}
          <div className="relative" ref={exportRef}>
            <button
              onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
              className="bg-[#00a65a] hover:bg-[#008d4c] text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 shadow-xs transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
              <ChevronDown className="w-3 h-3 ml-0.5" />
            </button>

            {exportDropdownOpen && (
              <div className="absolute right-0 mt-1 w-56 bg-white rounded-md shadow-lg border border-slate-200 py-1 z-30 text-xs">
                <button
                  onClick={() => handleExportXML(false)}
                  className="w-full text-left px-3.5 py-1.5 hover:bg-slate-100 text-slate-700 flex items-center gap-2"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>Export to XML (all found)</span>
                </button>
                <button
                  onClick={() => handleExportXML(true)}
                  disabled={selectedIds.length === 0}
                  className="w-full text-left px-3.5 py-1.5 hover:bg-slate-100 text-slate-700 disabled:opacity-40 disabled:hover:bg-transparent flex items-center gap-2"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>Export to XML (selected {selectedIds.length ? `(${selectedIds.length})` : ''})</span>
                </button>
                <div className="my-1 border-t border-slate-100" />
                <button
                  onClick={() => handleExportCSV(false)}
                  className="w-full text-left px-3.5 py-1.5 hover:bg-slate-100 text-slate-700 flex items-center gap-2"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Export to Excel (all found)</span>
                </button>
                <button
                  onClick={() => handleExportCSV(true)}
                  disabled={selectedIds.length === 0}
                  className="w-full text-left px-3.5 py-1.5 hover:bg-slate-100 text-slate-700 disabled:opacity-40 disabled:hover:bg-transparent flex items-center gap-2"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Export to Excel (selected {selectedIds.length ? `(${selectedIds.length})` : ''})</span>
                </button>
              </div>
            )}
          </div>

          {/* Import */}
          <button
            onClick={() => setImportModalOpen(true)}
            className="bg-[#20c997] hover:bg-[#1baa80] text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 shadow-xs transition"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import</span>
          </button>

          {/* Delete (selected) */}
          <button
            onClick={() => setDeleteConfirmOpen(true)}
            disabled={selectedIds.length === 0}
            className="bg-[#d73925] hover:bg-[#c22e1b] disabled:bg-red-400 text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 shadow-xs transition disabled:cursor-not-allowed"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete (selected)</span>
          </button>
        </div>
      </div>

      {/* SEARCH / FILTER CARD */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs">
        {/* Collapsible Card Header */}
        <div
          onClick={() => setSearchOpen(!searchOpen)}
          className="border-b border-[#f4f4f4] px-4 py-2.5 flex items-center justify-between cursor-pointer select-none bg-white hover:bg-slate-50/50 transition rounded-t"
        >
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-xs sm:text-sm">
            <Search className="w-4 h-4 text-slate-600" />
            <span>Search</span>
          </div>
          <button
            type="button"
            className="p-1 text-slate-500 hover:text-slate-700 focus:outline-none"
          >
            {searchOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Card Body */}
        {searchOpen && (
          <div className="p-4 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3.5 text-xs text-slate-700">
              {/* LEFT COLUMN */}
              <div className="space-y-3.5">
                {/* Product Name (Mandatory / Important) */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                  <div className="sm:col-span-4 flex items-center gap-1 font-medium text-slate-700">
                    <span>Product name</span>
                    <span
                      title="A product name or part of it."
                      className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[#3c8dbc] text-white text-[10px] cursor-help font-bold"
                    >
                      ?
                    </span>
                  </div>
                  <div className="sm:col-span-8">
                    <input
                      type="text"
                      value={filterName}
                      onChange={(e) => setFilterName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleApplySearch()}
                      placeholder=""
                      className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none"
                    />
                  </div>
                </div>

                {/* Category (Mandatory / Important) */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                  <div className="sm:col-span-4 flex items-center gap-1 font-medium text-slate-700">
                    <span>Category</span>
                    <span
                      title="Search by a specific parent or child category."
                      className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[#3c8dbc] text-white text-[10px] cursor-help font-bold"
                    >
                      ?
                    </span>
                  </div>
                  <div className="sm:col-span-8">
                    <select
                      value={filterCategory}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFilterCategory(val);
                        setFilterSubcategoryId('All');
                      }}
                      className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none"
                    >
                      <option value="All">All</option>
                      <optgroup label="Parent Categories">
                        {parentCategories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </optgroup>
                      {childCategories.length > 0 && (
                        <optgroup label="Parent >> Child Subcategories">
                          {childCategories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {getCategoryHierarchyLabel(c)}
                            </option>
                          ))}
                        </optgroup>
                      )}
                    </select>
                  </div>
                </div>

                {/* Search subcategories (Advanced mode only) */}
                {advancedMode && (
                  <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                    <div className="sm:col-span-4 flex items-center gap-1 font-medium text-slate-700">
                      <span>Search subcategories</span>
                      <span
                        title="Check to search in subcategories or select a child subcategory."
                        className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[#3c8dbc] text-white text-[10px] cursor-help font-bold"
                      >
                        ?
                      </span>
                    </div>
                    <div className="sm:col-span-8">
                      <select
                        value={filterSubcategoryId}
                        onChange={(e) => setFilterSubcategoryId(e.target.value)}
                        className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none"
                      >
                        <option value="All">
                          All Subcategories ({availableSubcategoriesForFilter.length})
                        </option>
                        {availableSubcategoriesForFilter.map((sub) => (
                          <option key={sub.id} value={sub.id}>
                            {getCategoryHierarchyLabel(sub)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Manufacturer (Advanced mode only) */}
                {advancedMode && (
                  <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                    <div className="sm:col-span-4 flex items-center gap-1 font-medium text-slate-700">
                      <span>Manufacturer</span>
                      <span
                        title="Search by a specific manufacturer or brand."
                        className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[#3c8dbc] text-white text-[10px] cursor-help font-bold"
                      >
                        ?
                      </span>
                    </div>
                    <div className="sm:col-span-8">
                      <select
                        value={filterManufacturer}
                        onChange={(e) => setFilterManufacturer(e.target.value)}
                        className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none"
                      >
                        <option value="All">All</option>
                        {brands.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-3.5">

                {/* Published (Advanced mode only) */}
                {advancedMode && (
                  <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                    <div className="sm:col-span-5 flex items-center gap-1 font-medium text-slate-700">
                      <span>Published</span>
                      <span
                        title="Search by published status."
                        className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[#3c8dbc] text-white text-[10px] cursor-help font-bold"
                      >
                        ?
                      </span>
                    </div>
                    <div className="sm:col-span-7">
                      <select
                        value={filterPublished}
                        onChange={(e) => setFilterPublished(e.target.value)}
                        className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none"
                      >
                        <option value="All">All</option>
                        <option value="Published only">Published only</option>
                        <option value="Unpublished only">Unpublished only</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Go directly to product SKU (Mandatory / Important) */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                  <div className="sm:col-span-5 flex items-center gap-1 font-medium text-slate-700">
                    <span>Go directly to product SKU</span>
                    <span
                      title="Enter product SKU to jump directly to its edit screen."
                      className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[#3c8dbc] text-white text-[10px] cursor-help font-bold"
                    >
                      ?
                    </span>
                  </div>
                  <div className="sm:col-span-7 flex">
                    <input
                      type="text"
                      value={skuSearchInput}
                      onChange={(e) => setSkuSearchInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleGoSku()}
                      placeholder=""
                      className="flex-1 text-xs px-2.5 py-1.5 rounded-l border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleGoSku}
                      className="bg-[#00c0ef] hover:bg-[#00a7d0] text-white text-xs font-semibold px-3 py-1.5 rounded-r transition"
                    >
                      Go
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Centered Search Button */}
            <div className="pt-2 flex justify-center items-center gap-3">
              <button
                type="button"
                onClick={handleApplySearch}
                className="bg-[#3c8dbc] hover:bg-[#357ca5] text-white font-medium text-xs px-7 py-2 rounded flex items-center gap-2 shadow-xs transition"
              >
                <Search className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Search</span>
              </button>
              {(appliedFilters.name ||
                appliedFilters.category !== 'All' ||
                appliedFilters.subcategoryId !== 'All' ||
                appliedFilters.manufacturer !== 'All' ||
                appliedFilters.published !== 'All' ||
                appliedFilters.sku) && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs text-slate-500 hover:text-red-600 underline"
                >
                  Reset filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* SELECTED PRODUCT(S) FULL DETAILS PANEL & AUTO-FILLED FORM */}
      {selectedIds.length > 0 && (
        <div className="bg-white rounded border-2 border-[#3c8dbc] shadow-sm overflow-hidden">
          <div className="bg-[#3c8dbc] text-white px-4 py-2.5 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-xs font-bold">
              <Package className="w-4 h-4" />
              <span>
                Selected Product Details ({selectedIds.length} selected) — Parent &amp; Child Category + Auto-Filled Product Form
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAdvancedMode(!advancedMode)}
                className={`inline-flex items-center justify-between px-2.5 py-1 rounded text-xs font-semibold border transition cursor-pointer select-none min-w-[96px] h-7 shadow-2xs ${
                  advancedMode
                    ? 'bg-[#2585be] border-white text-white'
                    : 'bg-white border-white text-[#3c8dbc]'
                }`}
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
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="text-white/90 hover:text-white text-xs flex items-center gap-1 bg-white/15 px-2.5 py-1 rounded h-7"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear selection</span>
              </button>
            </div>
          </div>

          {/* AUTO-FILLED DIRECT PRODUCT FORM SECTION RIGHT AT THE TOP WHEN SELECTED */}
          {(() => {
            const activeProd = products.find((p) => p.id === selectedIds[0]);
            if (!activeProd) return null;
            const resolvedCat = resolveProductCategories(activeProd);
            return (
              <div className="border-b-2 border-[#3c8dbc] bg-white">
                <div
                  onClick={() => setShowInlineForm(!showInlineForm)}
                  className="bg-slate-100 hover:bg-slate-200/70 px-4 py-2.5 flex items-center justify-between cursor-pointer select-none border-b border-slate-200 transition"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <Edit3 className="w-4 h-4 text-[#3c8dbc]" />
                    <span>
                      Auto-Filled Product Form — {activeProd.name} (ID: {activeProd.id} | SKU: {activeProd.sku})
                    </span>
                  </div>
                  <button
                    type="button"
                    className="text-xs font-semibold text-[#3c8dbc] hover:underline flex items-center gap-1"
                  >
                    <span>{showInlineForm ? 'Hide Auto-Filled Form' : 'Show Auto-Filled Form'}</span>
                    {showInlineForm ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {showInlineForm && (
                  <div className="p-4 sm:p-5 bg-[#ecf0f5]">
                    <ProductForm
                      key={activeProd.id}
                      isEdit={true}
                      categories={categories}
                      brands={brands}
                      saving={inlineFormSaving}
                      onSave={handleSaveInlineProduct}
                      externalAdvancedMode={advancedMode}
                      onToggleAdvancedMode={setAdvancedMode}
                      initialValues={{
                        ...(activeProd as any),
                        id: activeProd.id,
                        name: activeProd.name || '',
                        sku: activeProd.sku || '',
                        brandId: activeProd.brandId || '',
                        categoryId: resolvedCat.parentId || activeProd.categoryId || '',
                        parentCategoryId: resolvedCat.parentId || activeProd.parentCategoryId || '',
                        subCategoryId: resolvedCat.childId || activeProd.subCategoryId || '',
                        price: activeProd.price ?? 0,
                        comparePrice: activeProd.comparePrice ?? 0,
                        cost: activeProd.cost ?? Math.round((activeProd.price || 0) * 0.78),
                        shortDescription:
                          activeProd.shortDescription || activeProd.description || '',
                        description:
                          activeProd.description || activeProd.shortDescription || '',
                        targetCrops:
                          activeProd.targetCrops || 'Paddy, Cotton, Sugarcane, Vegetables',
                        cropStages: activeProd.cropStages || '1, 2, 3',
                        isPublished: Boolean(activeProd.isPublished),
                        isDraft: Boolean(activeProd.isDraft),
                        isFeatured: Boolean(activeProd.isFeatured),
                        isBestSeller: Boolean(activeProd.isBestSeller),
                        seName: activeProd.slug || activeProd.id || '',
                        metaTitle:
                          activeProd.metaTitle || `Buy ${activeProd.name} Online | Agri-Mart India`,
                        metaKeywords:
                          activeProd.metaKeywords ||
                          `${activeProd.name}, ${activeProd.sku}, agriculture India`,
                        metaDescription:
                          activeProd.metaDescription ||
                          activeProd.shortDescription ||
                          activeProd.description ||
                          '',
                        images:
                          activeProd.images && activeProd.images.length > 0
                            ? activeProd.images
                            : [
                                'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=400&q=80',
                              ],
                        stockQuantity:
                          activeProd.stockQuantity !== undefined
                            ? Number(activeProd.stockQuantity)
                            : activeProd.variants?.reduce(
                                (sum, v) => sum + (v.stockQuantity || 0),
                                0
                              ) || 25,
                        weight: activeProd.weight ?? 5,
                        length: activeProd.length ?? 35,
                        width: activeProd.width ?? 25,
                        height: activeProd.height ?? 20,
                        gtin: activeProd.gtin || '8901234560011',
                        manufacturerPartNumber:
                          activeProd.manufacturerPartNumber || `${activeProd.sku}-IND`,
                        vendor: activeProd.vendor || 'Agri-Mart Direct',
                        taxCategory:
                          activeProd.taxCategory || 'Agricultural Essentials (5% GST)',
                        deliveryDate: activeProd.deliveryDate || '1-2 days',
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })()}

          <div className="divide-y divide-slate-200 max-h-[540px] overflow-y-auto">
            {products
              .filter((p) => selectedIds.includes(p.id))
              .map((p) => {
                const catInfo = resolveProductCategories(p);
                const stock =
                  p.variants?.reduce((sum, v) => sum + (v.stockQuantity || 0), 0) ||
                  (p as any).stockQuantity ||
                  0;
                const brandName =
                  p.brand?.name ||
                  brands.find((b) => b.id === p.brandId)?.name ||
                  'AgriPro';

                return (
                  <div key={p.id} className="p-4 sm:p-5 space-y-4 bg-slate-50/40">
                    {/* Top Row: Images + Title + Hierarchy Badges + Edit Link */}
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-200 pb-4">
                      <div className="flex items-start gap-4">
                        <div className="flex gap-2 shrink-0">
                          {(p.images && p.images.length > 0 ? p.images : ['']).map(
                            (img, idx) =>
                              img ? (
                                <img
                                  key={idx}
                                  src={img}
                                  alt={p.name}
                                  className="w-16 h-16 rounded-md object-cover border border-slate-300 bg-white shadow-2xs"
                                />
                              ) : (
                                <div
                                  key={idx}
                                  className="w-16 h-16 rounded-md bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-400"
                                >
                                  <Package className="w-6 h-6" />
                                </div>
                              )
                          )}
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-sm font-bold text-slate-900">
                              {p.name}
                            </h3>
                            <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-mono text-[11px] font-semibold">
                              SKU: {p.sku}
                            </span>
                          </div>
                          {p.nameKn && (
                            <p className="text-xs text-slate-500">{p.nameKn}</p>
                          )}

                          {/* Parent & Child Category Hierarchy */}
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
                              <span className="text-[10px] uppercase tracking-wider text-blue-600 font-bold">
                                Parent Category:
                              </span>
                              <span>{catInfo.parentName}</span>
                            </span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                              <span className="text-[10px] uppercase tracking-wider text-emerald-600 font-bold">
                                Child Category (Subcategory):
                              </span>
                              <span>{catInfo.childName}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          href={`/admin/catalogue/products/${p.id}/edit`}
                          className="bg-[#3c8dbc] hover:bg-[#357ca5] text-white text-xs font-semibold px-3.5 py-2 rounded flex items-center gap-1.5 shadow-2xs transition"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit Full Product</span>
                        </Link>
                      </div>
                    </div>

                    {/* Grid of All Product Details */}
                    <div className={`grid grid-cols-1 sm:grid-cols-2 ${advancedMode ? 'lg:grid-cols-4' : 'lg:grid-cols-2'} gap-3 text-xs`}>
                      {/* Pricing & Tax (INR) — Mandatory/Important */}
                      <div className="bg-white p-3 rounded border border-slate-200 space-y-1.5">
                        <div className="font-bold text-slate-700 border-b border-slate-100 pb-1 uppercase text-[10px] tracking-wider">
                          Pricing &amp; Tax (INR)
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Selling Price:</span>
                          <span className="font-bold text-emerald-700">
                            ₹{(p.price || 0).toLocaleString('en-IN')} INR
                          </span>
                        </div>
                        {advancedMode && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-slate-500">MRP / Old Price:</span>
                              <span className="font-semibold text-slate-700">
                                ₹{(p.comparePrice || p.price || 0).toLocaleString('en-IN')} INR
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Product Cost:</span>
                              <span className="font-semibold text-slate-700">
                                ₹{(p.cost ?? Math.round((p.price || 0) * 0.78)).toLocaleString('en-IN')} INR
                              </span>
                            </div>
                          </>
                        )}
                        <div className="flex justify-between">
                          <span className="text-slate-500">Tax Category:</span>
                          <span className="font-medium text-slate-800">
                            {p.taxCategory || 'Exempt / Agricultural (5% GST)'}
                          </span>
                        </div>
                      </div>

                      {/* Inventory & Identification — Mandatory/Important */}
                      <div className="bg-white p-3 rounded border border-slate-200 space-y-1.5">
                        <div className="font-bold text-slate-700 border-b border-slate-100 pb-1 uppercase text-[10px] tracking-wider">
                          Inventory &amp; Brand
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Manufacturer:</span>
                          <span className="font-semibold text-slate-800">{brandName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Stock Quantity:</span>
                          <span className="font-bold text-blue-700">{stock} units</span>
                        </div>
                        {advancedMode && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Vendor:</span>
                              <span className="font-medium text-slate-800">
                                {p.vendor || 'Agri-Mart Direct'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">GTIN / MPN:</span>
                              <span className="font-mono text-[11px] text-slate-700">
                                {p.gtin || '8901234560011'} / {p.manufacturerPartNumber || `${p.sku}-IND`}
                              </span>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Shipping & Dimensions — Advanced mode only */}
                      {advancedMode && (
                        <div className="bg-white p-3 rounded border border-slate-200 space-y-1.5">
                          <div className="font-bold text-slate-700 border-b border-slate-100 pb-1 uppercase text-[10px] tracking-wider">
                            Shipping &amp; Dimensions
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Weight:</span>
                            <span className="font-medium text-slate-800">
                              {p.weight ?? 5} kg
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Dimensions (L×W×H):</span>
                            <span className="font-medium text-slate-800">
                              {p.length ?? 35} × {p.width ?? 25} × {p.height ?? 20} cm
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Delivery Time:</span>
                            <span className="font-medium text-slate-800">
                              {p.deliveryDate || '1-2 days (Express Hub)'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">URL Slug:</span>
                            <span className="font-mono text-[11px] text-slate-600 truncate max-w-[140px]">
                              /{p.slug || p.id}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Agronomy & Crop Guidance — Advanced mode only */}
                      {advancedMode && (
                        <div className="bg-white p-3 rounded border border-slate-200 space-y-1.5">
                          <div className="font-bold text-slate-700 border-b border-slate-100 pb-1 uppercase text-[10px] tracking-wider">
                            Agronomy &amp; Crop Stages
                          </div>
                          <div>
                            <span className="text-slate-500 block">Target Crops:</span>
                            <span className="font-medium text-slate-800">
                              {p.targetCrops || 'Paddy, Cotton, Sugarcane, Vegetables'}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Crop Stages:</span>
                            <span className="font-medium text-slate-800">
                              Stages: {p.cropStages || '1, 2, 3'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Descriptions & Technical Specifications — Advanced mode only */}
                    {advancedMode && (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-xs">
                        <div className="bg-white p-3 rounded border border-slate-200 space-y-1.5">
                          <div className="font-bold text-slate-700 border-b border-slate-100 pb-1 uppercase text-[10px] tracking-wider">
                            Product Descriptions &amp; SEO
                          </div>
                          {p.shortDescription && (
                            <p className="text-slate-700 font-medium">
                              <span className="text-slate-500">Short: </span>
                              {p.shortDescription}
                            </p>
                          )}
                          <p className="text-slate-600 leading-relaxed">
                            <span className="text-slate-500 font-medium">Full: </span>
                            {p.description || p.shortDescription || 'Standard agricultural specification.'}
                          </p>
                          <div className="pt-1 text-[11px] text-slate-500 border-t border-slate-100">
                            <strong>SEO Title:</strong> {p.metaTitle || `Buy ${p.name} | Agri-Mart India`}
                          </div>
                        </div>

                        <div className="bg-white p-3 rounded border border-slate-200 space-y-1.5">
                          <div className="font-bold text-slate-700 border-b border-slate-100 pb-1 uppercase text-[10px] tracking-wider">
                            Technical Specifications &amp; Variants
                          </div>
                          {p.specifications && p.specifications.length > 0 ? (
                            <div className="space-y-1">
                              {p.specifications.map((sp, i) => (
                                <div key={i} className="flex justify-between border-b border-slate-50 pb-0.5">
                                  <span className="text-slate-500">
                                    {sp.group ? `[${sp.group}] ` : ''}
                                    {sp.name}:
                                  </span>
                                  <span className="font-medium text-slate-800">{sp.value}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-slate-500">
                              ISO &amp; FCO Certified Agricultural Input — Quality Tested
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* PRODUCTS DATA GRID CARD */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden">
        {/* Helper Link */}
        <div className="px-4 py-2.5 text-xs text-slate-500 border-b border-slate-100 flex items-center justify-between">
          <div>
            Learn more about{' '}
            <Link
              href="/admin/catalogue/categories"
              className="text-[#3c8dbc] hover:underline"
            >
              products &amp; subcategories
            </Link>
          </div>
          <div className="text-[11px] text-slate-500">
            Tip: Check any product row to view its <strong>Parent &amp; Child Category</strong> and complete details above, or click <strong>Edit</strong>.
          </div>
        </div>

        {/* Selected Products Toolbar */}
        {selectedIds.length > 0 && (
          <div className="bg-red-50/90 border-b border-red-200 px-4 py-3 flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-2.5 text-xs font-bold text-red-900">
              <span className="w-5 h-5 rounded-full bg-[#d73925] text-white flex items-center justify-center text-[10px] font-mono">
                {selectedIds.length}
              </span>
              <span>
                {selectedIds.length} product{selectedIds.length > 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#d73925] hover:bg-[#c22e1b] text-white rounded text-xs font-bold shadow-xs transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Selected ({selectedIds.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-700 text-xs font-medium transition cursor-pointer"
              >
                Cancel Selection
              </button>
            </div>
          </div>
        )}

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f9fafc] border-b border-slate-200 text-slate-700 font-bold">
                <th className="py-2.5 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleToggleSelectAll}
                    className="h-4 w-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc]"
                  />
                </th>
                <th className="py-2.5 px-3 w-20 text-center">Picture</th>
                <th className="py-2.5 px-3">Product name &amp; Details</th>
                <th className="py-2.5 px-3 w-64">Parent &amp; Child Category</th>
                <th className="py-2.5 px-3 w-36">SKU</th>
                <th className="py-2.5 px-3 w-28 text-right">Price (INR)</th>
                <th className="py-2.5 px-3 w-28 text-center">Stock quantity</th>
                <th className="py-2.5 px-3 w-24 text-center">Published</th>
                <th className="py-2.5 px-3 w-56 text-center">Edit / Save</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#3c8dbc]" />
                    <span>Loading products catalogue...</span>
                  </td>
                </tr>
              ) : paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <Package className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-600">No products found</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Try adjusting your search criteria or add a new product.
                    </p>
                    <button
                      onClick={handleResetFilters}
                      className="mt-3 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs"
                    >
                      Clear Search
                    </button>
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((p) => {
                  const isChecked = selectedIds.includes(p.id);
                  const isRowEditing = editingRowId === p.id && rowEditData !== null;
                  const stock =
                    p.stockQuantity !== undefined
                      ? Number(p.stockQuantity)
                      : p.variants?.reduce(
                          (sum, v) => sum + (v.stockQuantity || 0),
                          0
                        ) || 0;
                  const thumb = p.images?.[0];
                  const catInfo = resolveProductCategories(p);
                  const brandName =
                    p.brand?.name ||
                    brands.find((b) => b.id === p.brandId)?.name ||
                    'AgriPro';
                  const rowSubcategories = isRowEditing
                    ? childCategories.filter(
                        (c) => c.parentId === rowEditData.parentCategoryId
                      )
                    : [];

                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isRowEditing
                          ? 'bg-amber-50/60 ring-1 ring-inset ring-[#3c8dbc]'
                          : isChecked
                          ? 'bg-blue-50/40'
                          : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-2.5 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSelectRow(p.id)}
                          className="h-4 w-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc]"
                        />
                      </td>

                      {/* Picture */}
                      <td className="py-2.5 px-3 text-center">
                        <Link
                          href={`/admin/catalogue/products/${p.id}/edit`}
                          className="relative group/pic inline-block"
                          title="Click to view & edit pictures"
                        >
                          {thumb ? (
                            <img
                              src={thumb}
                              alt={p.name}
                              className="w-12 h-12 rounded object-cover border border-slate-200 bg-white mx-auto shadow-2xs group-hover/pic:opacity-80 transition"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 mx-auto">
                              <Package className="w-5 h-5" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/40 rounded opacity-0 group-hover/pic:opacity-100 flex items-center justify-center text-white text-[9px] font-bold transition">
                            Edit
                          </div>
                          {p.images && p.images.length > 1 && (
                            <span className="absolute -bottom-1 -right-1 bg-purple-600 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full shadow">
                              {p.images.length}
                            </span>
                          )}
                        </Link>
                      </td>

                      {/* Product Name & Summary Details */}
                      <td className="py-2.5 px-3 font-medium text-slate-800">
                        {isRowEditing && rowEditData ? (
                          <div className="space-y-1.5 min-w-[200px]">
                            <input
                              type="text"
                              value={rowEditData.name}
                              onChange={(e) =>
                                setRowEditData({ ...rowEditData, name: e.target.value })
                              }
                              placeholder="Product name"
                              className="w-full px-2 py-1 text-xs font-semibold border border-[#3c8dbc] rounded bg-white outline-none"
                            />
                            <div className="grid grid-cols-2 gap-1.5">
                              <select
                                value={rowEditData.brandId}
                                onChange={(e) =>
                                  setRowEditData({ ...rowEditData, brandId: e.target.value })
                                }
                                className="px-1.5 py-1 text-[11px] border border-slate-300 rounded bg-white outline-none"
                              >
                                {brands.map((b) => (
                                  <option key={b.id} value={b.id}>
                                    {b.name}
                                  </option>
                                ))}
                              </select>
                              <input
                                type="text"
                                value={rowEditData.targetCrops}
                                onChange={(e) =>
                                  setRowEditData({
                                    ...rowEditData,
                                    targetCrops: e.target.value,
                                  })
                                }
                                placeholder="Target crops"
                                className="px-2 py-1 text-[11px] border border-slate-300 rounded bg-white outline-none"
                              />
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <Link
                                href={`/admin/catalogue/products/${p.id}/edit`}
                                className="hover:text-[#3c8dbc] transition font-semibold"
                              >
                                {p.name}
                              </Link>
                              {p.disableBuyButton && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                  Buy Disabled
                                </span>
                              )}
                              {p.callForPrice && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                  Call for Price
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-500 font-normal">
                              <span>
                                Brand: <strong className="text-slate-700">{brandName}</strong>
                              </span>
                              {p.targetCrops && <span>• Crops: {p.targetCrops}</span>}
                            </div>
                          </>
                        )}
                      </td>

                      {/* Parent & Child Category */}
                      <td className="py-2.5 px-3">
                        {isRowEditing && rowEditData ? (
                          <div className="space-y-1.5">
                            <select
                              value={rowEditData.parentCategoryId}
                              onChange={(e) => {
                                const newParent = e.target.value;
                                const firstSub = childCategories.find(
                                  (c) => c.parentId === newParent
                                );
                                setRowEditData({
                                  ...rowEditData,
                                  parentCategoryId: newParent,
                                  subCategoryId: firstSub ? firstSub.id : '',
                                });
                              }}
                              className="w-full px-1.5 py-1 text-[11px] border border-blue-300 rounded bg-white outline-none"
                            >
                              {parentCategories.map((c) => (
                                <option key={c.id} value={c.id}>
                                  Parent: {c.name}
                                </option>
                              ))}
                            </select>
                            <select
                              value={rowEditData.subCategoryId}
                              onChange={(e) =>
                                setRowEditData({
                                  ...rowEditData,
                                  subCategoryId: e.target.value,
                                })
                              }
                              className="w-full px-1.5 py-1 text-[11px] border border-emerald-300 rounded bg-white outline-none"
                            >
                              <option value="">-- No Subcategory --</option>
                              {rowSubcategories.map((sub) => (
                                <option key={sub.id} value={sub.id}>
                                  Child: {sub.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 text-[11px] font-medium">
                              <span className="text-[9px] uppercase font-bold text-blue-600">
                                Parent:
                              </span>
                              <span>{catInfo.parentName}</span>
                            </div>
                            <div className="flex items-center gap-1 pl-1">
                              <span className="text-slate-400 text-[10px]">↳</span>
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-medium">
                                <span className="text-[9px] uppercase font-bold text-emerald-600">
                                  Child:
                                </span>
                                <span>{catInfo.childName}</span>
                              </span>
                            </div>
                          </div>
                        )}
                      </td>

                      {/* SKU */}
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                        {isRowEditing && rowEditData ? (
                          <input
                            type="text"
                            value={rowEditData.sku}
                            onChange={(e) =>
                              setRowEditData({ ...rowEditData, sku: e.target.value })
                            }
                            className="w-full px-2 py-1 text-[11px] font-mono border border-slate-300 rounded bg-white outline-none"
                          />
                        ) : (
                          p.sku || '-'
                        )}
                      </td>

                      {/* Price */}
                      <td className="py-2.5 px-3 text-right font-semibold text-slate-800">
                        {isRowEditing && rowEditData ? (
                          <div className="space-y-1">
                            <input
                              type="number"
                              value={rowEditData.price}
                              onChange={(e) =>
                                setRowEditData({
                                  ...rowEditData,
                                  price: parseFloat(e.target.value) || 0,
                                })
                              }
                              placeholder="Selling Price"
                              className="w-24 px-2 py-1 text-xs text-right border border-[#3c8dbc] rounded bg-white outline-none"
                            />
                            <input
                              type="number"
                              value={rowEditData.comparePrice}
                              onChange={(e) =>
                                setRowEditData({
                                  ...rowEditData,
                                  comparePrice: parseFloat(e.target.value) || 0,
                                })
                              }
                              placeholder="MRP"
                              title="Old / Compare Price (MRP)"
                              className="w-24 px-2 py-0.5 text-[10px] text-right border border-slate-300 rounded bg-white outline-none text-slate-500"
                            />
                          </div>
                        ) : (
                          <>
                            ₹{p.price?.toLocaleString('en-IN')}
                            {p.comparePrice && p.comparePrice > p.price && (
                              <span className="block text-[10px] text-slate-400 line-through font-normal">
                                ₹{p.comparePrice.toLocaleString('en-IN')}
                              </span>
                            )}
                          </>
                        )}
                      </td>

                      {/* Stock Quantity */}
                      <td className="py-2.5 px-3 text-center text-slate-700">
                        {isRowEditing && rowEditData ? (
                          <input
                            type="number"
                            value={rowEditData.stockQuantity}
                            onChange={(e) =>
                              setRowEditData({
                                ...rowEditData,
                                stockQuantity: parseInt(e.target.value, 10) || 0,
                              })
                            }
                            className="w-20 px-2 py-1 text-xs text-center border border-[#3c8dbc] rounded bg-white outline-none"
                          />
                        ) : (
                          stock
                        )}
                      </td>

                      {/* Published */}
                      <td className="py-2.5 px-3 text-center">
                        {isRowEditing && rowEditData ? (
                          <input
                            type="checkbox"
                            checked={rowEditData.isPublished}
                            onChange={(e) =>
                              setRowEditData({
                                ...rowEditData,
                                isPublished: e.target.checked,
                              })
                            }
                            className="h-4 w-4 rounded border-slate-300 text-[#2585be] focus:ring-[#2585be]"
                          />
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleTogglePublished(p)}
                            title={`Click to ${p.isPublished ? 'unpublish' : 'publish'}`}
                            className="p-1 hover:bg-slate-100 rounded transition inline-flex items-center justify-center"
                          >
                            {p.isPublished ? (
                              <Check className="w-4 h-4 text-[#2585be] stroke-[2.5]" />
                            ) : (
                              <X className="w-4 h-4 text-slate-300 stroke-[2]" />
                            )}
                          </button>
                        )}
                      </td>

                      {/* Edit / Save Buttons */}
                      <td className="py-2.5 px-3 text-center">
                        {isRowEditing ? (
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              disabled={rowSaving}
                              onClick={() => handleSaveRowEdit(p)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#00a65a] hover:bg-[#008d4c] disabled:opacity-50 text-white rounded text-xs font-semibold shadow-2xs transition cursor-pointer"
                            >
                              <Save className="w-3 h-3" />
                              <span>{rowSaving ? '...' : 'Save'}</span>
                            </button>
                            <button
                              type="button"
                              disabled={rowSaving}
                              onClick={handleCancelRowEdit}
                              className="inline-flex items-center px-2 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-600 text-xs font-medium transition cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleStartRowEdit(p)}
                              title="Edit fields right in this row and click Save"
                              className="inline-flex items-center gap-1 px-2 py-1 bg-[#2585be] hover:bg-[#1f72a3] text-white rounded text-[11px] font-semibold shadow-2xs transition cursor-pointer"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Quick Edit</span>
                            </button>
                            <Link
                              href={`/admin/catalogue/products/${p.id}/edit`}
                              title="Open full product editor"
                              className="inline-flex items-center gap-1 px-2 py-1 bg-white hover:bg-slate-50 border border-slate-300 rounded text-slate-700 text-[11px] font-medium shadow-2xs transition"
                            >
                              <span>Full Edit</span>
                            </Link>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedIds([p.id]);
                                setDeleteConfirmOpen(true);
                              }}
                              title="Delete this product"
                              className="inline-flex items-center gap-1 px-2 py-1 bg-white hover:bg-red-50 border border-red-300 hover:border-red-400 text-red-600 hover:text-red-700 rounded text-[11px] font-medium shadow-2xs transition cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer & Pagination */}
        <div className="px-4 py-3 bg-[#f9fafc] border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            <span>
              Showing {(currentPage - 1) * pageSize + (totalItems > 0 ? 1 : 0)} to{' '}
              {Math.min(currentPage * pageSize, totalItems)} of {totalItems} items
            </span>
            {selectedIds.length > 0 && (
              <span className="ml-2 font-semibold text-blue-600">
                ({selectedIds.length} selected)
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span>Items per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 bg-white border border-slate-300 rounded text-xs outline-none"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            <div className="flex items-center gap-1">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-2.5 py-1 bg-white border border-slate-300 rounded disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                Previous
              </button>
              <span className="px-2 font-medium">
                {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-2.5 py-1 bg-white border border-slate-300 rounded disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: BULK EDIT */}
      {bulkEditOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full border border-slate-200 overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <div className="font-semibold text-sm text-slate-800 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#00c0ef]" />
                <span>
                  Bulk Edit Products{' '}
                  {selectedIds.length > 0
                    ? `(${selectedIds.length} Selected)`
                    : '(All Filtered Products)'}
                </span>
              </div>
              <button
                onClick={() => setBulkEditOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleBulkEditSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Adjust Price
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="any"
                    value={bulkPriceChange}
                    onChange={(e) => setBulkPriceChange(e.target.value)}
                    placeholder="e.g. 10 to increase by 10%, -5 to discount"
                    className="flex-1 px-3 py-1.5 border border-slate-300 rounded outline-none focus:border-[#3c8dbc]"
                  />
                  <select
                    value={bulkPriceType}
                    onChange={(e) =>
                      setBulkPriceType(e.target.value as 'percent' | 'fixed')
                    }
                    className="px-3 py-1.5 border border-slate-300 rounded bg-white outline-none"
                  >
                    <option value="percent">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Leave empty if you don't wish to change price.
                </p>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Set Stock Quantity
                </label>
                <input
                  type="number"
                  value={bulkStockChange}
                  onChange={(e) => setBulkStockChange(e.target.value)}
                  placeholder="e.g. 50"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none focus:border-[#3c8dbc]"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Leave empty to retain existing stock quantity.
                </p>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Published Status
                </label>
                <select
                  value={bulkPublishState}
                  onChange={(e) => setBulkPublishState(e.target.value as any)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white outline-none"
                >
                  <option value="keep">Do not change</option>
                  <option value="publish">Set to Published</option>
                  <option value="unpublish">Set to Unpublished</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setBulkEditOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00c0ef] hover:bg-[#00a7d0] text-white rounded font-semibold shadow-xs"
                >
                  Apply Bulk Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: IMPORT */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <div className="font-semibold text-sm text-slate-800 flex items-center gap-2">
                <Upload className="w-4 h-4 text-[#20c997]" />
                <span>Import Products from File</span>
              </div>
              <button
                onClick={() => setImportModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <p className="text-slate-600">
                Upload a <strong>.CSV</strong> or <strong>.JSON</strong> file
                containing product rows.
              </p>

              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-[#20c997] transition">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <label className="cursor-pointer block">
                  <span className="text-[#3c8dbc] font-semibold hover:underline">
                    Choose a file
                  </span>{' '}
                  or drag here
                  <input
                    type="file"
                    accept=".csv,.json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                {importFileName && (
                  <p className="mt-2 text-xs font-semibold text-emerald-700 bg-emerald-50 py-1 px-2 rounded inline-block">
                    Selected: {importFileName}
                  </p>
                )}
              </div>

              <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded border border-slate-200">
                <strong>Expected columns:</strong> ID, Name, SKU, Price, ComparePrice, StockQuantity, Category, Manufacturer, Published
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setImportModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!importFileContent || importing}
                  onClick={handleProcessImport}
                  className="px-4 py-2 bg-[#20c997] hover:bg-[#1baa80] disabled:opacity-40 text-white rounded font-semibold shadow-xs flex items-center gap-1.5"
                >
                  {importing ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
                  <span>Import Products</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DELETE CONFIRMATION */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="p-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-xs">
                <Trash2 className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <h3 className="font-extrabold text-slate-900 text-base">
                  {selectedIds.length === 1 ? 'Delete Product' : `Delete ${selectedIds.length} Products`}
                </h3>
                <p className="text-sm font-semibold text-slate-800">
                  {selectedIds.length === 1
                    ? 'Are you sure you want to delete this product?'
                    : `Are you sure you want to delete these ${selectedIds.length} products?`}
                </p>

                {/* Show name(s) of products being deleted */}
                {(() => {
                  const toDelete = products.filter((p) => selectedIds.includes(p.id));
                  if (toDelete.length === 0) return null;
                  return (
                    <div className="max-h-32 overflow-y-auto bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-left space-y-1.5 my-2">
                      {toDelete.map((p) => (
                        <div key={p.id} className="flex items-center gap-2 text-slate-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                          <span className="font-bold truncate flex-1">{p.name}</span>
                          {p.sku && (
                            <span className="text-[10px] text-slate-400 font-mono shrink-0">
                              [{p.sku}]
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })()}

                <p className="text-xs text-slate-500 leading-relaxed">
                  This action cannot be undone. This product will be permanently removed from the catalogue.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => setDeleteConfirmOpen(false)}
                  className="px-5 py-2.5 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 text-xs font-semibold transition cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={handleDeleteSelected}
                  className="px-5 py-2.5 bg-[#d73925] hover:bg-[#c22e1b] disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  {deleting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

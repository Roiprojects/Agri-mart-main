'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Star,
  ShieldCheck,
  Truck,
  CheckCircle,
  ShoppingCart,
  Zap,
  Heart,
  Warehouse,
  CheckCircle2,
  Plus,
  Minus,
  MessageSquare,
  Lock,
  User,
  Tractor,
  X,
  ArrowRight,
  PhoneCall,
  Ban,
  Clock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  getEffectiveProductAttributes,
  getEffectiveSpecificationAttributes,
} from '@/lib/product-attribute-defaults';
import { useAuth, setClientAuthUser } from '@/lib/auth-client';
import { useShoppingCartSettings } from '@/lib/shopping-cart-settings';
import { useFilterYmmSettings } from '@/lib/filter-ymm-settings';
import { getProductOverrideById, mergeProductsWithOverrides } from '@/lib/admin-product-overrides';
import { getProductAvailability } from '@/lib/product-availability';
import { resolveProductDiscounts, ResolvedProductDiscounts } from '@/lib/admin-discounts-storage';
import { Tag } from 'lucide-react';

interface ProductDetailClientProps {
  product: any;
}

export default function ProductDetailClient({ product: initialProduct }: ProductDetailClientProps) {
  const [product, setProduct] = useState<any>(initialProduct);
  const [resolvedRequiredProducts, setResolvedRequiredProducts] = useState<any[]>(
    Array.isArray(initialProduct?.requiredProducts) ? initialProduct.requiredProducts : []
  );
  const [requiredWarning, setRequiredWarning] = useState<string | null>(null);
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();
  const { settings: cartSettings } = useShoppingCartSettings();
  const { settings: ymmSettings } = useFilterYmmSettings();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<'cart' | 'buy' | null>(null);

  const variants = product.variants && product.variants.length > 0 ? product.variants : [];
  const [selectedVariant, setSelectedVariant] = useState<any>(
    variants.find((v: any) => v.isDefault) || variants[0] || null
  );

  useEffect(() => {
    const applyProductState = (baseProd: any) => {
      const ov = getProductOverrideById(baseProd?.id);
      const baseTime = baseProd?.updatedAt ? new Date(baseProd.updatedAt).getTime() : 0;
      const ovTime = ov?.updatedAt ? new Date(ov.updatedAt).getTime() : 0;
      const useOverride = Boolean(ov) && (!baseTime || (Number.isFinite(ovTime) && ovTime >= baseTime));

      const merged = useOverride ? { ...baseProd, ...ov } : baseProd;
      if (useOverride && ov.stockQuantity !== undefined && Array.isArray(merged.variants) && merged.variants.length > 0) {
        merged.variants = merged.variants.map((v: any, idx: number) =>
          idx === 0 ? { ...v, stockQuantity: Number(ov.stockQuantity) } : v
        );
      }
      setProduct(merged);
      if (Array.isArray(merged.variants) && merged.variants.length > 0) {
        setSelectedVariant(merged.variants.find((v: any) => v.isDefault) || merged.variants[0]);
      }

      if (merged.requireOtherProducts && Array.isArray(merged.requiredProductIds) && merged.requiredProductIds.length > 0) {
        fetch('/api/products', { cache: 'no-store' })
          .then((r) => r.json())
          .then((json) => {
            if (json.success && Array.isArray(json.data)) {
              const allProds = mergeProductsWithOverrides(json.data);
              const reqs = merged.requiredProductIds
                .map((id: string) => allProds.find((p: any) => p.id === id || p.sku === id))
                .filter(Boolean);
              setResolvedRequiredProducts(reqs);
            }
          })
          .catch(() => {});
      } else {
        setResolvedRequiredProducts(
          Array.isArray(merged?.requiredProducts) ? merged.requiredProducts : []
        );
      }
    };

    applyProductState(initialProduct);

    if (initialProduct?.slug || initialProduct?.id) {
      fetch(`/api/products/${encodeURIComponent(initialProduct.slug || initialProduct.id)}`, {
        cache: 'no-store',
      })
        .then((r) => r.json())
        .then((json) => {
          if (json?.success && json.data) {
            applyProductState(json.data);
          }
        })
        .catch(() => {});
    }
  }, [initialProduct]);

  const productLevelStock =
    product.stockQuantity !== undefined
      ? Number(product.stockQuantity)
      : product.stock !== undefined
      ? Number(product.stock)
      : product.availableQty !== undefined
      ? Number(product.availableQty)
      : undefined;

  const rawMaxStock =
    variants.length > 1 && selectedVariant?.stockQuantity !== undefined
      ? Number(selectedVariant.stockQuantity)
      : productLevelStock ?? Number(selectedVariant?.stockQuantity ?? 0);
  const maxStock = Math.max(0, Number.isFinite(rawMaxStock) ? rawMaxStock : 0);
  const minQty = 1;
  const availability = getProductAvailability(product);

  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, any>>({});
  const [attributeError, setAttributeError] = useState<string | null>(null);
  const [adminProductAttributes, setAdminProductAttributes] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/admin/catalogue/attributes/product', { cache: 'no-store' })
      .then((r) => r.json())
      .then((json) => {
        if (json?.success && Array.isArray(json.data)) {
          setAdminProductAttributes(json.data);
        }
      })
      .catch(() => {});
  }, []);

  const effectiveProductAttributes = useMemo(() => {
    return getEffectiveProductAttributes(product, adminProductAttributes);
  }, [product, adminProductAttributes]);

  const sortedProductAttributes = useMemo(() => {
    return [...effectiveProductAttributes].sort(
      (a: any, b: any) => Number(a.displayOrder ?? 0) - Number(b.displayOrder ?? 0)
    );
  }, [effectiveProductAttributes]);

  const visibleProductAttributes = useMemo(() => {
    return sortedProductAttributes.filter((attr: any) => {
      if (attr.condition?.enabled && attr.condition?.attributeId) {
        const targetVal = selectedAttributes[attr.condition.attributeId];
        if (Array.isArray(targetVal)) {
          return targetVal.includes(attr.condition.valueId);
        }
        return targetVal === attr.condition.valueId;
      }
      return true;
    });
  }, [sortedProductAttributes, selectedAttributes]);

  // Pre-select default attribute values whenever product attributes load/change
  useEffect(() => {
    if (!Array.isArray(effectiveProductAttributes) || effectiveProductAttributes.length === 0) {
      setSelectedAttributes({});
      return;
    }
    const defaults: Record<string, any> = {};
    for (const attr of effectiveProductAttributes) {
      const vals = Array.isArray(attr.values)
        ? [...attr.values].sort((a: any, b: any) => Number(a.displayOrder ?? 0) - Number(b.displayOrder ?? 0))
        : [];
      const ct = String(attr.controlType || '').toLowerCase();
      if (ct === 'text box' || ct === 'multiline textbox') {
        if (attr.defaultValue && String(attr.defaultValue).trim() !== '') {
          defaults[attr.id] = String(attr.defaultValue);
        }
      } else if (ct === 'checkboxes' || ct === 'read-only checkboxes') {
        const pre = vals.filter((v: any) => v.isPreSelected).map((v: any) => v.id || v.name);
        if (pre.length > 0) defaults[attr.id] = pre;
      } else if (
        ct === 'color squares' ||
        ct === 'image squares' ||
        ct === 'drop-down list' ||
        ct === 'dropdown list' ||
        ct === 'radio button list' ||
        !ct
      ) {
        const pre = vals.find((v: any) => v.isPreSelected);
        if (pre) defaults[attr.id] = pre.id || pre.name;
      }
    }
    setSelectedAttributes(defaults);
    setAttributeError(null);
  }, [product.id, effectiveProductAttributes]);

  const matchedCombination = useMemo(() => {
    const combs = Array.isArray(product.attributeCombinations) ? product.attributeCombinations : [];
    if (combs.length === 0) return null;
    return (
      combs.find((comb: any) => {
        if (comb.selectedValues && typeof comb.selectedValues === 'object') {
          const entries = Object.entries(comb.selectedValues).filter(([, v]) => v !== '' && v !== undefined && v !== null);
          if (entries.length === 0) return false;
          return entries.every(([attrId, valId]) => {
            const sel = selectedAttributes[attrId];
            if (Array.isArray(sel)) return sel.includes(valId);
            return sel === valId;
          });
        }
        return false;
      }) || null
    );
  }, [product.attributeCombinations, selectedAttributes]);

  const basePriceBeforeAttrs = selectedVariant ? selectedVariant.price : product.price;

  const attributeAdjustments = useMemo(() => {
    let priceAdj = 0;
    let weightAdj = 0;
    const summaryParts: string[] = [];
    const activeImages: string[] = [];

    for (const attr of visibleProductAttributes) {
      const sel = selectedAttributes[attr.id];
      if (sel === undefined || sel === null || sel === '' || (Array.isArray(sel) && sel.length === 0)) continue;
      const vals = Array.isArray(attr.values) ? attr.values : [];
      const ct = String(attr.controlType || '').toLowerCase();

      if (
        ct === 'text box' ||
        ct === 'multiline textbox' ||
        ct === 'date picker' ||
        ct === 'file upload'
      ) {
        summaryParts.push(`${attr.attributeName}: ${String(sel)}`);
        continue;
      }

      const selIds = Array.isArray(sel) ? sel : [sel];
      const matchedVals = vals.filter((v: any) => selIds.includes(v.id || v.name));
      if (matchedVals.length > 0) {
        summaryParts.push(`${attr.attributeName}: ${matchedVals.map((v: any) => v.name).join(', ')}`);
      }
      for (const val of matchedVals) {
        const pAdj = Number(val.priceAdjustment || 0);
        if (Number.isFinite(pAdj) && pAdj !== 0) {
          priceAdj += val.priceAdjustmentUsePercentage ? basePriceBeforeAttrs * (pAdj / 100) : pAdj;
        }
        const wAdj = Number(val.weightAdjustment || 0);
        if (Number.isFinite(wAdj) && wAdj !== 0) {
          weightAdj += wAdj;
        }
        if (val.picture && typeof val.picture === 'string') {
          activeImages.push(val.picture);
        }
        if (Array.isArray(val.pictures)) {
          val.pictures.forEach((p: string) => {
            if (p && !activeImages.includes(p)) activeImages.push(p);
          });
        }
      }
    }

    const combImages =
      matchedCombination && Array.isArray(matchedCombination.pictures) && matchedCombination.pictures.length > 0
        ? matchedCombination.pictures.filter(Boolean)
        : [];

    return {
      priceAdjustment: Math.round(priceAdj * 100) / 100,
      weightAdjustment: Math.round(weightAdj * 1000) / 1000,
      summary: summaryParts.join(' | '),
      images: combImages.length > 0 ? combImages : activeImages,
    };
  }, [visibleProductAttributes, selectedAttributes, basePriceBeforeAttrs, matchedCombination]);

  // Notify ProductImageGallery when attribute/combination images change
  useEffect(() => {
    if (typeof window === 'undefined' || !product?.id) return;
    window.dispatchEvent(
      new CustomEvent('productAttributeImagesChanged', {
        detail: {
          productId: product.id,
          images: attributeAdjustments.images,
          displayOnlyAttributeImages: Boolean(product.displayOnlyAttributeImages),
        },
      })
    );
  }, [product?.id, product?.displayOnlyAttributeImages, attributeAdjustments.images]);

  const effectiveMaxStock = matchedCombination
    ? matchedCombination.allowOutOfStock
      ? Math.max(1, Number(matchedCombination.stockQuantity ?? 999))
      : Math.max(0, Number(matchedCombination.stockQuantity ?? 0))
    : maxStock;

  // Keep quantity clamped between [minQty, maxStock] when variant or product stock changes
  useEffect(() => {
    setQuantity((prev) => {
      if (maxStock <= 0) return 1;
      return Math.min(Math.max(minQty, prev), maxStock);
    });
  }, [minQty, maxStock, selectedVariant?.id]);

  // Review Form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const hasOverriddenPrice =
    matchedCombination &&
    matchedCombination.overriddenPrice !== undefined &&
    matchedCombination.overriddenPrice !== '' &&
    matchedCombination.overriddenPrice !== null &&
    Number(matchedCombination.overriddenPrice) > 0;
  const currentPrice = hasOverriddenPrice
    ? Number(matchedCombination.overriddenPrice)
    : Math.max(0, basePriceBeforeAttrs + attributeAdjustments.priceAdjustment);
  const currentComparePrice = selectedVariant ? selectedVariant.comparePrice : product.comparePrice;
  const currentSku =
    matchedCombination?.sku && String(matchedCombination.sku).trim()
      ? matchedCombination.sku
      : selectedVariant
      ? selectedVariant.sku
      : product.sku;
  const currentGtin = matchedCombination?.gtin || product.gtin;
  const currentMpn = matchedCombination?.manufacturerPartNumber || product.manufacturerPartNumber;
  const discountPercent = currentComparePrice
    ? Math.round(((currentComparePrice - currentPrice) / currentComparePrice) * 100)
    : 0;

  const isCustomPriceEnabled = Boolean(product.customerEntersPrice) && !product.callForPrice;
  const [customPriceInput, setCustomPriceInput] = useState<string>(() =>
    currentPrice > 0 ? String(currentPrice) : ''
  );
  const [customPriceError, setCustomPriceError] = useState<string | null>(null);
  const [resolvedDiscount, setResolvedDiscount] = useState<ResolvedProductDiscounts | null>(null);

  useEffect(() => {
    setCustomPriceInput(currentPrice > 0 ? String(currentPrice) : '');
    setCustomPriceError(null);
    setResolvedDiscount(resolveProductDiscounts(product, currentPrice));
  }, [product, currentPrice]);

  const parsedCustomPrice = Number(customPriceInput);
  const effectivePrice = isCustomPriceEnabled
    ? Number.isFinite(parsedCustomPrice) && parsedCustomPrice > 0
      ? parsedCustomPrice
      : 0
    : currentPrice;

  // Track recently viewed products
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('agri_recently_viewed');
        const list = stored ? JSON.parse(stored) : [];
        const filtered = list.filter((item: any) => item.id !== product.id);
        filtered.unshift({
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: currentPrice,
          image: product.media?.[0]?.url || product.images?.[0],
          category: product.category?.name || product.category,
        });
        localStorage.setItem('agri_recently_viewed', JSON.stringify(filtered.slice(0, 8)));

        // Check wishlist (and automatically exclude if wishlist button is disabled)
        const wishlisted = localStorage.getItem('agri_wishlist');
        if (wishlisted) {
          let wList: string[] = JSON.parse(wishlisted);
          if (product.disableWishlistButton) {
            if (wList.includes(product.id)) {
              wList = wList.filter((id) => id !== product.id);
              localStorage.setItem('agri_wishlist', JSON.stringify(wList));
            }
            setIsWishlisted(false);
          } else {
            setIsWishlisted(wList.includes(product.id));
          }
        }
      } catch (e) {}
    }
  }, [product.id, product.disableWishlistButton, currentPrice]);

  const handleToggleWishlist = () => {
    if (product.disableWishlistButton) return;
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('agri_wishlist');
        let list: string[] = stored ? JSON.parse(stored) : [];
        let justAdded = false;
        if (list.includes(product.id)) {
          list = list.filter((id) => id !== product.id);
          setIsWishlisted(false);
        } else {
          list.push(product.id);
          setIsWishlisted(true);
          justAdded = true;
        }
        localStorage.setItem('agri_wishlist', JSON.stringify(list));
        if (justAdded && cartSettings.displayWishlistAfterAddingProduct) {
          router.push('/account/wishlist');
        }
      } catch (e) {}
    }
  };

  const addRequiredProductsToCart = () => {
    if (typeof window === 'undefined' || resolvedRequiredProducts.length === 0) return;
    try {
      const stored = localStorage.getItem('agri_cart_items');
      const cart = stored ? JSON.parse(stored) : [];
      for (const reqProd of resolvedRequiredProducts) {
        if (!cart.some((c: any) => c.id === reqProd.id)) {
          cart.push({
            id: reqProd.id,
            name: reqProd.name,
            price: reqProd.price || 0,
            quantity: 1,
            maxStock: reqProd.stockQuantity ?? 25,
            minQty: 1,
            image: reqProd.images?.[0] || reqProd.image,
            category: reqProd.category?.name || reqProd.category || 'Agricultural Input',
          });
        }
      }
      localStorage.setItem('agri_cart_items', JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));
      setRequiredWarning(null);
    } catch {}
  };

  const validateRequiredAttributes = (): string | null => {
    for (const attr of visibleProductAttributes) {
      const sel = selectedAttributes[attr.id];
      const isEmpty = Array.isArray(sel)
        ? sel.length === 0
        : sel === undefined || sel === null || String(sel).trim() === '';
      if (attr.isRequired && isEmpty) {
        return `Please select or enter required option: ${attr.attributeName}`;
      }
      const minLen = attr.minLength || attr.validationRules?.minLength;
      const maxLen = attr.maxLength || attr.validationRules?.maxLength;
      if (!isEmpty && (minLen || maxLen)) {
        const strVal = String(sel);
        if (minLen && strVal.length < Number(minLen)) {
          return `${attr.attributeName} must be at least ${minLen} characters.`;
        }
        if (maxLen && strVal.length > Number(maxLen)) {
          return `${attr.attributeName} must be at most ${maxLen} characters.`;
        }
      }
    }
    return null;
  };

  const executeAddToCart = () => {
    setRequiredWarning(null);
    setCustomPriceError(null);
    setAttributeError(null);
    const attrErr = validateRequiredAttributes();
    if (attrErr) {
      setAttributeError(attrErr);
      return;
    }
    if (isCustomPriceEnabled && effectivePrice <= 0) {
      setCustomPriceError('Please enter a valid price greater than ₹0.');
      return;
    }
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('agri_cart_items');
        let cart = stored ? JSON.parse(stored) : [];

        if (product.requireOtherProducts && resolvedRequiredProducts.length > 0) {
          const missing = resolvedRequiredProducts.filter(
            (rp: any) => !cart.some((c: any) => c.id === rp.id)
          );
          if (missing.length > 0) {
            if (product.automaticallyAddRequiredProducts) {
              for (const reqProd of missing) {
                cart.push({
                  id: reqProd.id,
                  name: reqProd.name,
                  price: reqProd.price || 0,
                  quantity: 1,
                  maxStock: reqProd.stockQuantity ?? 25,
                  minQty: 1,
                  image: reqProd.images?.[0] || reqProd.image,
                  category: reqProd.category?.name || reqProd.category || 'Agricultural Input',
                });
              }
            } else {
              setRequiredWarning(
                `This product requires buying: ${missing.map((m: any) => m.name).join(', ')}. Please add the required product(s) to your cart first.`
              );
              return;
            }
          }
        }

        setAddedNotice(true);
        const existingIdx = cart.findIndex(
          (i: any) =>
            i.id === product.id &&
            i.variantId === selectedVariant?.id &&
            (i.selectedAttributesSummary || '') === attributeAdjustments.summary &&
            (!isCustomPriceEnabled || Number(i.price) === effectivePrice)
        );
        if (existingIdx >= 0) {
          const nextQty = existingIdx >= 0 ? cart[existingIdx].quantity + quantity : quantity;
          cart[existingIdx].quantity = effectiveMaxStock > 0 ? Math.min(nextQty, effectiveMaxStock) : nextQty;
          cart[existingIdx].maxStock = effectiveMaxStock;
          cart[existingIdx].minQty = minQty;
        } else {
          cart.push({
            id: product.id,
            name: product.name,
            price: effectivePrice,
            customPrice: isCustomPriceEnabled ? effectivePrice : undefined,
            quantity: effectiveMaxStock > 0 ? Math.min(quantity, effectiveMaxStock) : quantity,
            maxStock: effectiveMaxStock,
            minQty,
            image: attributeAdjustments.images[0] || product.media?.[0]?.url || product.images?.[0],
            category: product.category?.name || product.category,
            variantId: selectedVariant?.id,
            variantTitle: selectedVariant?.title,
            selectedAttributes: selectedAttributes,
            selectedAttributesSummary: attributeAdjustments.summary || undefined,
            sku: currentSku,
          });
        }
        localStorage.setItem('agri_cart_items', JSON.stringify(cart));
        window.dispatchEvent(new Event('cartUpdated'));

        if (cartSettings.displayCartAfterAddingProduct) {
          router.push('/cart');
          return;
        }
      } catch (e) {}
    }
    setTimeout(() => setAddedNotice(false), 2000);
  };

  const executeBuyNow = () => {
    setRequiredWarning(null);
    setCustomPriceError(null);
    setAttributeError(null);
    const attrErr = validateRequiredAttributes();
    if (attrErr) {
      setAttributeError(attrErr);
      return;
    }
    if (isCustomPriceEnabled && effectivePrice <= 0) {
      setCustomPriceError('Please enter a valid price greater than ₹0.');
      return;
    }
    if (typeof window !== 'undefined') {
      const checkoutList: any[] = [
        {
          id: product.id,
          name: product.name,
          price: effectivePrice,
          customPrice: isCustomPriceEnabled ? effectivePrice : undefined,
          quantity,
          image: attributeAdjustments.images[0] || product.media?.[0]?.url || product.images?.[0],
          category: product.category?.name || product.category,
          variantId: selectedVariant?.id,
          variantTitle: selectedVariant?.title,
          selectedAttributes: selectedAttributes,
          selectedAttributesSummary: attributeAdjustments.summary || undefined,
          sku: currentSku,
        },
      ];

      if (product.requireOtherProducts && resolvedRequiredProducts.length > 0) {
        const stored = localStorage.getItem('agri_cart_items');
        const cart = stored ? JSON.parse(stored) : [];
        const missing = resolvedRequiredProducts.filter(
          (rp: any) => !cart.some((c: any) => c.id === rp.id)
        );
        if (missing.length > 0) {
          if (product.automaticallyAddRequiredProducts) {
            for (const reqProd of missing) {
              checkoutList.push({
                id: reqProd.id,
                name: reqProd.name,
                price: reqProd.price || 0,
                quantity: 1,
                image: reqProd.images?.[0] || reqProd.image,
                category: reqProd.category?.name || reqProd.category || 'Agricultural Input',
              });
            }
          } else {
            setRequiredWarning(
              `This product requires buying: ${missing.map((m: any) => m.name).join(', ')}. Click "Add Required Products to Cart" below to proceed.`
            );
            return;
          }
        } else {
          for (const reqProd of resolvedRequiredProducts) {
            const inCart = cart.find((c: any) => c.id === reqProd.id);
            if (inCart) checkoutList.push(inCart);
          }
        }
      }

      sessionStorage.setItem('agri_checkout_items', JSON.stringify(checkoutList));
    }
    router.push('/checkout');
  };

  const canPreOrder =
    availability.isBeforeStart && Boolean(product.availableForPreOrder) && !product.disableBuyButton;

  const handleAddToCart = () => {
    if (product.disableBuyButton || product.callForPrice || (!availability.isAvailableNow && !canPreOrder)) return;
    executeAddToCart();
  };

  const handleBuyNow = () => {
    if (product.disableBuyButton || product.callForPrice || (!availability.isAvailableNow && !canPreOrder)) return;
    executeBuyNow();
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/admin/catalogue/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_review',
          productId: product.id,
          rating: reviewRating,
          title: reviewTitle,
          comment: reviewComment,
        }),
      });
      setReviewSubmitted(true);
      setShowReviewForm(false);
    } catch (e) {
      setReviewSubmitted(true);
      setShowReviewForm(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & SKU */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {product.markAsNew && (
              <span className="bg-blue-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                NEW
              </span>
            )}
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">
              {product.category?.name || product.category || 'Agricultural Machinery'}
            </span>
            <span className="text-slate-300">&bull;</span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {product.brand?.name || product.brand || 'AgriPro'}
            </span>
          </div>

          {!product.disableWishlistButton && (
            <button
              onClick={handleToggleWishlist}
              className={`p-2 rounded-xl border transition flex items-center gap-1 text-xs font-bold ${
                isWishlisted
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
              <span>{isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}</span>
            </button>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight mt-2">
          {product.name}
        </h1>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-500 mt-2 font-mono">
          <div>
            SKU: <strong className="text-slate-800">{currentSku}</strong>
          </div>
          {(product.riplCode || selectedVariant?.riplCode) && (
            <div className="flex items-center gap-1">
              <span className="text-slate-400">&bull;</span>
              <span>RIPL Code:</span>
              <strong className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {product.riplCode || selectedVariant?.riplCode}
              </strong>
            </div>
          )}
          {(product.modelNumber || selectedVariant?.title) && (
            <div className="flex items-center gap-1">
              <span className="text-slate-400">&bull;</span>
              <span>Model:</span>
              <strong className="text-slate-800">
                {product.modelNumber || selectedVariant?.title}
              </strong>
            </div>
          )}
          {currentGtin && (
            <div className="flex items-center gap-1">
              <span className="text-slate-400">&bull;</span>
              <span>GTIN:</span>
              <strong className="text-slate-800">{currentGtin}</strong>
            </div>
          )}
          {currentMpn && (
            <div className="flex items-center gap-1">
              <span className="text-slate-400">&bull;</span>
              <span>MPN:</span>
              <strong className="text-slate-800">{currentMpn}</strong>
            </div>
          )}
        </div>

        {/* Rating & Stock */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 text-xs">
          {product.allowCustomerReviews !== false && (
            <>
              <div className="flex items-center text-amber-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-extrabold ml-1 text-slate-900 text-sm">4.9</span>
              </div>
              <span className="text-slate-300">|</span>
              <span className="text-slate-600 font-medium">
                {product.reviews?.length || 18} Verified Farmer Reviews
              </span>
              <span className="text-slate-300">|</span>
            </>
          )}
          <span className="text-emerald-700 font-bold flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" />
            {product.availableQty !== undefined && product.availableQty > 0
              ? `${product.availableQty} Units Ready in Dark Warehouse`
              : 'In Stock • Dark Warehouse Dispatch'}
          </span>
        </div>
      </div>

      {/* Pricing with GST notice */}
      <div className="p-5 bg-agri-pale/60 rounded-2xl border border-emerald-200/80 flex flex-wrap items-baseline gap-3">
        {product.callForPrice ? (
          <div>
            <div className="text-2xl font-black text-emerald-800">
              Call For Price
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
              Customized agricultural quotas &amp; institutional pricing available
            </div>
          </div>
        ) : isCustomPriceEnabled ? (
          <div className="w-full space-y-2">
            <div className="flex items-center justify-between gap-2">
              <label htmlFor="customer-entered-price" className="text-xs font-extrabold text-slate-900">
                Enter Your Price (₹)
              </label>
              <span className="text-[11px] text-emerald-800 font-semibold">
                Flexible pricing enabled
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-slate-700">₹</span>
              <input
                id="customer-entered-price"
                type="number"
                min="1"
                step="1"
                value={customPriceInput}
                onChange={(e) => {
                  setCustomPriceInput(e.target.value);
                  setCustomPriceError(null);
                }}
                placeholder="Enter amount in ₹"
                className="w-full max-w-[220px] px-3.5 py-2 rounded-xl border border-emerald-300 bg-white text-lg font-black text-slate-950 focus:outline-none focus:ring-2 focus:ring-agri-green"
              />
            </div>
            {customPriceError && (
              <div className="text-xs font-bold text-rose-600">{customPriceError}</div>
            )}
          </div>
        ) : (
          <>
            {resolvedDiscount?.hasAutomaticDiscount ? (
              <>
                <div className="text-3xl font-black text-emerald-700">
                  ₹{resolvedDiscount.discountedPrice.toLocaleString('en-IN')}
                </div>
                <div className="text-base text-slate-400 line-through">
                  ₹{currentPrice.toLocaleString('en-IN')}
                </div>
              </>
            ) : (
              <>
                <div className="text-3xl font-black text-slate-950">
                  ₹{currentPrice.toLocaleString('en-IN')}
                </div>
                {currentComparePrice && (
                  <div className="text-base text-slate-400 line-through">
                    ₹{currentComparePrice.toLocaleString('en-IN')}
                  </div>
                )}
              </>
            )}
            {discountPercent > 0 && (
              <span className="bg-agri-yellow text-slate-950 font-black text-xs px-2.5 py-0.5 rounded-full">
                {discountPercent}% SAVINGS
              </span>
            )}
            <span className="text-xs text-emerald-800 font-semibold ml-auto">
              {product.priceNote || '(MRP • Inclusive of All Taxes & Transit Insurance)'}
            </span>
          </>
        )}
      </div>

      {/* Applied Storefront Discounts & Coupon Offers */}
      {resolvedDiscount && resolvedDiscount.activeDiscounts.length > 0 && !product.callForPrice && (
        <div className="p-3.5 rounded-2xl bg-emerald-50/90 border border-emerald-200 space-y-2">
          <div className="text-xs font-extrabold text-emerald-900 flex items-center gap-1.5">
            <Tag className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Available Discount Offers</span>
          </div>
          <div className="space-y-1.5">
            {resolvedDiscount.activeDiscounts.map((disc) => {
              const valueLabel = disc.usePercentage
                ? `${disc.discountPercentage}% OFF`
                : `₹${disc.discountAmount.toLocaleString('en-IN')} OFF`;
              return (
                <div
                  key={disc.id}
                  className="flex flex-wrap items-center justify-between gap-2 text-xs bg-white px-3 py-2 rounded-xl border border-emerald-200/80"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-black text-emerald-700">{disc.name}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      {valueLabel}
                    </span>
                    <span className="text-[11px] text-slate-500">{disc.discountType}</span>
                  </div>
                  {disc.requiresCouponCode && disc.couponCode ? (
                    <span className="px-2.5 py-0.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 font-mono font-bold text-[11px]">
                      Use Code: {disc.couponCode}
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-emerald-700">Applied</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Product Attributes Selector */}
      {visibleProductAttributes.length > 0 && (
        <div className="space-y-4 pt-1 border-t border-slate-100">
          {visibleProductAttributes.map((attr: any) => {
            const vals = Array.isArray(attr.values)
              ? [...attr.values].sort((a: any, b: any) => Number(a.displayOrder ?? 0) - Number(b.displayOrder ?? 0))
              : [];
            const ct = String(attr.controlType || 'Drop-down list').toLowerCase();
            const sel = selectedAttributes[attr.id];

            const formatAdj = (v: any) => {
              const p = Number(v.priceAdjustment || 0);
              if (!p) return '';
              const sign = p > 0 ? '+' : '-';
              return v.priceAdjustmentUsePercentage
                ? ` (${sign}${Math.abs(p)}%)`
                : ` (${sign}₹${Math.abs(p).toLocaleString('en-IN')})`;
            };

            const selectedValObj = vals.find((v: any) => (v.id || v.name) === sel);
            const fallbackThumb =
              product.media?.[0]?.url ||
              (Array.isArray(product.images) && product.images[0]) ||
              '';

            return (
              <div key={attr.id} className="space-y-2">
                <label className="block text-xs font-bold text-slate-900">
                  {ct === 'color squares' || ct === 'image squares' ? (
                    <span>
                      Selected {attr.attributeName}:{' '}
                      <span className="font-semibold text-slate-700">
                        {selectedValObj?.name || 'Choose option'}
                      </span>
                    </span>
                  ) : (
                    <span>
                      {ct === 'radio button list' ? `Select ${attr.attributeName}` : attr.attributeName}
                    </span>
                  )}
                  {attr.isRequired && <span className="text-rose-600 ml-1">*</span>}
                  {attr.textPrompt && (
                    <span className="block text-[11px] font-normal text-slate-500 mt-0.5">{attr.textPrompt}</span>
                  )}
                </label>

                {(ct === 'color squares' || ct === 'image squares') && (
                  <div className="relative group flex items-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        const scroller = e.currentTarget.nextElementSibling as HTMLElement | null;
                        scroller?.scrollBy({ left: -180, behavior: 'smooth' });
                      }}
                      aria-label={`Scroll ${attr.attributeName} left`}
                      className="hidden sm:flex items-center justify-center w-7 h-7 rounded-full bg-white/95 border border-slate-200 shadow-sm text-slate-700 hover:bg-slate-50 shrink-0 mr-1.5 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-2.5 overflow-x-auto py-1 px-0.5 scrollbar-thin">
                      {vals.map((val: any) => {
                        const valKey = val.id || val.name;
                        const isSel = sel === valKey;
                        const imgUrl =
                          val.picture ||
                          (Array.isArray(val.pictures) && val.pictures[0]) ||
                          fallbackThumb;
                        return (
                          <button
                            key={valKey}
                            type="button"
                            onClick={() => {
                              setSelectedAttributes((prev) => ({ ...prev, [attr.id]: valKey }));
                              setAttributeError(null);
                            }}
                            title={`${val.name}${formatAdj(val)}`}
                            className={`relative shrink-0 flex flex-col items-center p-1 rounded-xl border-2 transition cursor-pointer bg-white ${
                              isSel
                                ? 'border-slate-900 ring-2 ring-slate-900/15 shadow-sm'
                                : 'border-slate-200 hover:border-slate-400'
                            }`}
                          >
                            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-slate-50 border border-slate-100">
                              {imgUrl ? (
                                <img
                                  src={imgUrl}
                                  alt={val.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div
                                  className="w-full h-full"
                                  style={{ backgroundColor: val.rgbColor || '#e2e8f0' }}
                                />
                              )}
                              {val.rgbColor && (
                                <span
                                  className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full border border-white shadow-sm"
                                  style={{ backgroundColor: val.rgbColor }}
                                />
                              )}
                            </div>
                            <span className="mt-1 text-[10px] font-semibold text-slate-700 max-w-[68px] truncate">
                              {val.name}
                            </span>
                            {formatAdj(val) && (
                              <span className="text-[9px] text-emerald-700 font-bold">
                                {formatAdj(val)}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        const scroller = e.currentTarget.previousElementSibling as HTMLElement | null;
                        scroller?.scrollBy({ left: 180, behavior: 'smooth' });
                      }}
                      aria-label={`Scroll ${attr.attributeName} right`}
                      className="hidden sm:flex items-center justify-center w-7 h-7 rounded-full bg-white/95 border border-slate-200 shadow-sm text-slate-700 hover:bg-slate-50 shrink-0 ml-1.5 cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {(ct === 'drop-down list' || ct === 'dropdown list') && (
                  <select
                    value={typeof sel === 'string' ? sel : ''}
                    onChange={(e) => {
                      setSelectedAttributes((prev) => ({ ...prev, [attr.id]: e.target.value }));
                      setAttributeError(null);
                    }}
                    className="w-full sm:w-auto min-w-[240px] px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-agri-green"
                  >
                    <option value="">-- Select {attr.attributeName} --</option>
                    {vals.map((val: any) => {
                      const valKey = val.id || val.name;
                      return (
                        <option key={valKey} value={valKey}>
                          {val.name}
                          {formatAdj(val)}
                        </option>
                      );
                    })}
                  </select>
                )}

                {ct === 'radio button list' && (
                  <div className="flex flex-wrap gap-2.5 pt-0.5">
                    {vals.map((val: any) => {
                      const valKey = val.id || val.name;
                      const isSel = sel === valKey;
                      const thumbUrl = val.picture || (Array.isArray(val.pictures) && val.pictures[0]) || '';
                      return (
                        <button
                          key={valKey}
                          type="button"
                          onClick={() => {
                            setSelectedAttributes((prev) => ({ ...prev, [attr.id]: valKey }));
                            setAttributeError(null);
                          }}
                          className={`min-w-[56px] px-3.5 py-2 rounded-xl border-2 text-xs font-bold cursor-pointer transition inline-flex items-center gap-2 ${
                            isSel
                              ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                              : 'border-slate-200 bg-white text-slate-800 hover:border-slate-400'
                          }`}
                        >
                          {thumbUrl && (
                            <img src={thumbUrl} alt={val.name} className="w-5 h-5 rounded object-cover border border-slate-200 shrink-0" />
                          )}
                          {val.rgbColor && /color/i.test(attr.attributeName || '') && (
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0"
                              style={{ backgroundColor: val.rgbColor }}
                            />
                          )}
                          <span>
                            {val.name}
                            {formatAdj(val) && (
                              <span className={`text-[10px] font-bold ${isSel ? 'text-emerald-300' : 'text-emerald-700'}`}>
                                {formatAdj(val)}
                              </span>
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {(ct === 'checkboxes' || ct === 'read-only checkboxes') && (
                  <div className="flex flex-wrap gap-2.5 pt-0.5">
                    {vals.map((val: any) => {
                      const valKey = val.id || val.name;
                      const arr = Array.isArray(sel) ? sel : [];
                      const isSel = arr.includes(valKey);
                      const isReadOnly = ct === 'read-only checkboxes';
                      const thumbUrl = val.picture || (Array.isArray(val.pictures) && val.pictures[0]) || '';
                      return (
                        <label
                          key={valKey}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition ${
                            isReadOnly ? 'cursor-default opacity-80' : 'cursor-pointer'
                          } ${
                            isSel
                              ? 'border-agri-green bg-emerald-50 text-emerald-900'
                              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            disabled={isReadOnly}
                            checked={isSel}
                            onChange={(e) => {
                              if (isReadOnly) return;
                              setSelectedAttributes((prev) => {
                                const current = Array.isArray(prev[attr.id]) ? prev[attr.id] : [];
                                const next = e.target.checked
                                  ? [...current, valKey]
                                  : current.filter((x: string) => x !== valKey);
                                return { ...prev, [attr.id]: next };
                              });
                              setAttributeError(null);
                            }}
                            className="accent-emerald-700"
                          />
                          {thumbUrl && (
                            <img src={thumbUrl} alt={val.name} className="w-5 h-5 rounded object-cover border border-slate-200 shrink-0" />
                          )}
                          {val.rgbColor && /color/i.test(attr.attributeName || '') && (
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0"
                              style={{ backgroundColor: val.rgbColor }}
                            />
                          )}
                          <span>
                            {val.name}
                            {formatAdj(val) && <span className="text-[10px] text-emerald-700 font-bold">{formatAdj(val)}</span>}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}

                {ct === 'text box' && (
                  <input
                    type="text"
                    value={typeof sel === 'string' ? sel : ''}
                    onChange={(e) => {
                      setSelectedAttributes((prev) => ({ ...prev, [attr.id]: e.target.value }));
                      setAttributeError(null);
                    }}
                    placeholder={attr.textPrompt || `Enter ${attr.attributeName}`}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-agri-green"
                  />
                )}

                {ct === 'multiline textbox' && (
                  <textarea
                    rows={3}
                    value={typeof sel === 'string' ? sel : ''}
                    onChange={(e) => {
                      setSelectedAttributes((prev) => ({ ...prev, [attr.id]: e.target.value }));
                      setAttributeError(null);
                    }}
                    placeholder={attr.textPrompt || `Enter ${attr.attributeName}`}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-agri-green"
                  />
                )}

                {ct === 'date picker' && (
                  <input
                    type="date"
                    value={typeof sel === 'string' ? sel : ''}
                    onChange={(e) => {
                      setSelectedAttributes((prev) => ({ ...prev, [attr.id]: e.target.value }));
                      setAttributeError(null);
                    }}
                    className="px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-agri-green"
                  />
                )}

                {ct === 'file upload' && (
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept={
                        attr.allowedFileExtensions || attr.validationRules?.allowedFileExtensions
                          ? String(attr.allowedFileExtensions || attr.validationRules?.allowedFileExtensions)
                              .split(',')
                              .map((ext: string) => `.${ext.trim().replace(/^\./, '')}`)
                              .join(',')
                          : undefined
                      }
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          const allowedRaw =
                            attr.allowedFileExtensions || attr.validationRules?.allowedFileExtensions || '';
                          if (allowedRaw) {
                            const allowed = String(allowedRaw)
                              .split(',')
                              .map((s: string) => s.trim().toLowerCase().replace(/^\./, ''))
                              .filter(Boolean);
                            const ext = f.name.split('.').pop()?.toLowerCase() || '';
                            if (allowed.length > 0 && !allowed.includes(ext)) {
                              setAttributeError(
                                `${attr.attributeName}: Allowed file extensions are ${allowed.join(', ')}.`
                              );
                              return;
                            }
                          }
                          const maxKb = Number(attr.maxFileSizeKb || attr.validationRules?.maxFileSizeKb || 0);
                          if (maxKb > 0 && f.size > maxKb * 1024) {
                            setAttributeError(
                              `${attr.attributeName}: File size must be under ${maxKb} KB.`
                            );
                            return;
                          }
                        }
                        setSelectedAttributes((prev) => ({ ...prev, [attr.id]: f ? f.name : '' }));
                        setAttributeError(null);
                      }}
                      className="text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                    />
                    {sel && <span className="text-[11px] font-semibold text-emerald-700">{String(sel)}</span>}
                  </div>
                )}
              </div>
            );
          })}

          {(attributeAdjustments.priceAdjustment !== 0 || attributeAdjustments.weightAdjustment !== 0 || hasOverriddenPrice) && (
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold text-emerald-800 bg-emerald-50/70 border border-emerald-200 px-3 py-2 rounded-xl">
              {hasOverriddenPrice && (
                <span>Combination Price Applied: ₹{Number(matchedCombination.overriddenPrice).toLocaleString('en-IN')}</span>
              )}
              {!hasOverriddenPrice && attributeAdjustments.priceAdjustment !== 0 && (
                <span>
                  Attribute Price Adjustment:{' '}
                  {attributeAdjustments.priceAdjustment > 0 ? '+' : '-'}₹
                  {Math.abs(attributeAdjustments.priceAdjustment).toLocaleString('en-IN')}
                </span>
              )}
              {attributeAdjustments.weightAdjustment !== 0 && (
                <span>
                  Weight Adjustment: {attributeAdjustments.weightAdjustment > 0 ? '+' : ''}
                  {attributeAdjustments.weightAdjustment} kg
                </span>
              )}
            </div>
          )}

          {attributeError && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
              {attributeError}
            </div>
          )}
        </div>
      )}

      {/* Variant Selector (if available) */}
      {variants.length > 1 && (
        <div className="space-y-2 pt-1">
          <label className="block text-xs font-bold text-slate-900">
            Select Configuration / Pack Size:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {variants.map((v: any) => {
              const isSelected = selectedVariant?.id === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVariant(v)}
                  className={`p-3 rounded-xl border text-left transition ${
                    isSelected
                      ? 'border-agri-green bg-emerald-50 text-agri-green-dark ring-1 ring-agri-green shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="font-bold text-xs">{v.title}</div>
                  <div className="text-[11px] font-black mt-1">
                    {product.callForPrice ? 'Call for Price' : `₹${v.price.toLocaleString('en-IN')}`}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      {!product.disableBuyButton && !product.callForPrice && (
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <label className="text-xs font-bold text-slate-800">Quantity:</label>
          <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
            <button
              type="button"
              disabled={quantity <= minQty}
              onClick={() => setQuantity((q) => Math.max(minQty, q - 1))}
              className={`p-2 transition ${
                quantity <= minQty
                  ? 'text-slate-300 opacity-45 cursor-not-allowed'
                  : 'text-slate-600 hover:bg-slate-200 cursor-pointer'
              }`}
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-4 font-bold text-slate-900 text-xs min-w-[2.5rem] text-center">
              {quantity}
            </span>
            <button
              type="button"
              disabled={effectiveMaxStock <= 0 || quantity >= effectiveMaxStock}
              onClick={() =>
                setQuantity((q) => (effectiveMaxStock > 0 ? Math.min(effectiveMaxStock, q + 1) : q))
              }
              className={`p-2 transition ${
                effectiveMaxStock <= 0 || quantity >= effectiveMaxStock
                  ? 'text-slate-300 opacity-45 cursor-not-allowed'
                  : 'text-slate-600 hover:bg-slate-200 cursor-pointer'
              }`}
              aria-label="Increase quantity"
              title={
                effectiveMaxStock > 0 && quantity >= effectiveMaxStock
                  ? `Maximum available stock (${effectiveMaxStock}) reached`
                  : 'Increase quantity'
              }
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Required Other Products Notice */}
      {product.requireOtherProducts && resolvedRequiredProducts.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2.5 text-xs">
          <div className="font-bold text-amber-900">
            Required Companion Product{resolvedRequiredProducts.length > 1 ? 's' : ''}:
          </div>
          <p className="text-[11px] text-amber-800">
            This product requires purchasing the following item(s) together:
          </p>
          <ul className="space-y-1">
            {resolvedRequiredProducts.map((rp: any) => (
              <li key={rp.id} className="flex items-center justify-between text-[11px] bg-white px-3 py-1.5 rounded-lg border border-amber-200/80">
                <Link href={`/products/${rp.slug}`} className="font-bold text-slate-900 hover:text-agri-green underline">
                  {rp.name}
                </Link>
                <span className="font-bold text-emerald-700">₹{(rp.price || 0).toLocaleString('en-IN')}</span>
              </li>
            ))}
          </ul>
          {!product.automaticallyAddRequiredProducts && (
            <button
              type="button"
              onClick={addRequiredProductsToCart}
              className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] transition cursor-pointer"
            >
              Add Required Products to Cart
            </button>
          )}
          {requiredWarning && (
            <div className="text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
              {requiredWarning}
            </div>
          )}
        </div>
      )}

      {/* User Login Status Indicator */}
      {isLoggedIn ? (
        <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-800">
          <div className="flex items-center gap-1.5 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Signed in as {user?.name || user?.phone} &bull; Dark Warehouse Priority Dispatch Active</span>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900">
          <div className="flex items-center gap-1.5 font-semibold">
            <Lock className="w-3.5 h-3.5 text-amber-600" />
            <span>Sign in required to add items to cart or proceed to checkout</span>
          </div>
          <Link
            href={`/login?redirect=/products/${product.slug}`}
            className="text-amber-900 font-bold underline hover:text-amber-950"
          >
            Sign In &rarr;
          </Link>
        </div>
      )}

      {/* Availability Start / End Date Window Banner */}
      {(availability.hasStartDate || availability.hasEndDate) && (
        <div
          className={`p-3.5 rounded-2xl border text-xs space-y-1 ${
            !availability.isAvailableNow
              ? 'bg-amber-50 border-amber-300 text-amber-900'
              : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}
        >
          <div className="font-bold flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>
              {availability.isBeforeStart
                ? 'Upcoming Product — Not Yet Available for Purchase'
                : availability.isAfterEnd
                ? 'Availability Window Ended — No Longer Available'
                : 'Scheduled Product Availability Window'}
            </span>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
            {availability.formattedStart && (
              <span>
                Available Start Date: <strong>{availability.formattedStart}</strong>
              </span>
            )}
            {availability.formattedEnd && (
              <span>
                Available End Date: <strong>{availability.formattedEnd}</strong>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {!availability.isAvailableNow ? (
        canPreOrder ? (
          <div className="space-y-3 pt-2">
            <div className="w-full py-2.5 px-4 rounded-xl bg-amber-50 text-amber-900 font-bold text-xs flex items-center justify-center gap-2 border border-amber-300 shadow-2xs">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Pre-Order Open — Releases {availability.formattedStart}</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleBuyNow}
                className="flex-1 text-center bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs py-3.5 px-6 rounded-2xl shadow-xs transition flex items-center justify-center gap-2"
              >
                <Clock className="w-4 h-4" /> Pre-Order Now
              </button>
              <button
                onClick={handleAddToCart}
                className={`flex-1 text-center font-bold text-xs py-3.5 px-6 rounded-2xl shadow-xs transition flex items-center justify-center gap-2 ${
                  addedNotice
                    ? 'bg-emerald-600 text-white'
                    : 'bg-agri-green hover:bg-agri-green-dark text-white'
                }`}
              >
                {addedNotice ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" /> Add Pre-Order to Cart
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full py-3.5 px-6 rounded-2xl bg-amber-50 text-amber-900 font-bold text-xs flex items-center justify-center gap-2 border border-amber-300 shadow-2xs select-none">
            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              {availability.isBeforeStart
                ? `Coming Soon — Available starting ${availability.formattedStart}`
                : `Availability ended on ${availability.formattedEnd}`}
            </span>
          </div>
        )
      ) : product.callForPrice ? (
        <div className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="tel:+918001234567"
              className="flex-1 text-center bg-agri-green hover:bg-agri-green-dark text-white font-extrabold text-xs py-3.5 px-6 rounded-2xl shadow-xs transition flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-4 h-4" /> Call for Price &amp; Custom Quote
            </a>
            <a
              href={`https://wa.me/918001234567?text=${encodeURIComponent(`Hello Agri-Mart, I want to inquire about ${product.name} (SKU: ${product.sku || product.id})`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-xs py-3.5 px-6 rounded-2xl shadow-xs transition flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" /> WhatsApp Agri Expert
            </a>
          </div>
        </div>
      ) : product.disableBuyButton ? (
        <div className="space-y-3 pt-2">
          <div className="space-y-2.5">
              <div className="w-full py-3.5 px-6 rounded-2xl bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 border border-slate-200 shadow-2xs select-none">
                <Ban className="w-4 h-4 text-rose-500 shrink-0" />
                <span>Direct Online Purchase Currently Disabled for this Product</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={`https://wa.me/918001234567?text=${encodeURIComponent(`Hello Agri-Mart, I would like to inquire about availability and offline purchase of ${product.name} (SKU: ${product.sku || product.id})`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-xs py-3.5 px-6 rounded-2xl shadow-xs transition flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" /> Inquire via WhatsApp
                </a>
                <a
                  href="tel:+918001234567"
                  className="flex-1 text-center bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs py-3.5 px-6 rounded-2xl shadow-xs transition flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" /> Call Mandya/Hubballi Hub
                </a>
              </div>
            </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleBuyNow}
            className="flex-1 text-center bg-agri-yellow hover:bg-amber-400 text-slate-950 font-extrabold text-xs py-3.5 px-6 rounded-2xl shadow-xs transition flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4" /> Buy Now &bull; Reserve Stock
          </button>

          <button
            onClick={handleAddToCart}
            className={`flex-1 text-center font-bold text-xs py-3.5 px-6 rounded-2xl shadow-xs transition flex items-center justify-center gap-2 ${
              addedNotice
                ? 'bg-emerald-600 text-white'
                : 'bg-agri-green hover:bg-agri-green-dark text-white'
            }`}
          >
            {addedNotice ? (
              <>
                <CheckCircle2 className="w-4 h-4" /> Added to Cart!
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" /> Add to Cart
              </>
            )}
          </button>
        </div>
      )}

      {/* Product Specifications Summary (unified across specificationAttributes, specifications & metadata) */}
      {(() => {
        const displaySpecs = getEffectiveSpecificationAttributes(product).filter(
          (s) => s.showOnProductPage !== false
        );
        if (displaySpecs.length === 0) return null;
        return (
          <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2 text-xs">
            <div className="font-extrabold text-slate-900 border-b border-slate-100 pb-2">
              Product Specifications
            </div>
            <div className="divide-y divide-slate-100">
              {displaySpecs.map((spec, idx) => {
                const attrType = String(spec.attributeType || '').toLowerCase();
                return (
                  <div key={spec.id || idx} className="flex items-center justify-between gap-4 py-1.5">
                    <span className="text-slate-500 font-semibold">{spec.attributeName}</span>
                    {attrType === 'hyperlink' && spec.value ? (
                      <a
                        href={String(spec.value).startsWith('http') ? spec.value : `https://${spec.value}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-700 hover:underline font-bold text-right break-all"
                      >
                        {spec.value}
                      </a>
                    ) : attrType === 'custom html text' ? (
                      <div
                        className="text-slate-900 font-bold text-right"
                        dangerouslySetInnerHTML={{ __html: spec.value || '' }}
                      />
                    ) : (
                      <span className="text-slate-900 font-bold text-right">{spec.value}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* Dark Warehouse Live Availability Breakdown */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-[11px]">
        <div className="font-bold text-slate-800 flex items-center gap-1.5">
          <Warehouse className="w-4 h-4 text-agri-green" /> Regional Dark Warehouse Availability:
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-slate-600">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Hubballi Hub: <strong>In Stock</strong></span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Belagavi Hub: <strong>In Stock</strong></span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Dharwad Hub: <strong>In Stock</strong></span>
          </div>
        </div>
      </div>

      {/* Equipment Compatibility Matrix (Controlled by Filter (YMM) settings: displayOnProductDetailsPage) */}
      {ymmSettings.filterLevelEnabled && ymmSettings.displayOnProductDetailsPage && (
        <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Tractor className="w-4 h-4 text-agri-green" />
              <span>Verified Equipment Compatibility ({ymmSettings.levels.filter(l => l.enabled).map(l => l.name).join(' / ')})</span>
            </div>
            <span className="text-[10px] font-bold text-agri-green bg-white px-2.5 py-0.5 rounded-full border border-emerald-300">
              Guaranteed Fit
            </span>
          </div>
          <p className="text-[11px] text-slate-600">
            Engineered and factory-tested for seamless compatibility with multi-brand agricultural machinery:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
            <div className="bg-white p-2.5 rounded-xl border border-emerald-100/80">
              <span className="font-bold text-slate-800">Years:</span>
              <div className="text-slate-600">2020 – 2025 Current</div>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-emerald-100/80">
              <span className="font-bold text-slate-800">Compatible Makes:</span>
              <div className="text-slate-600">AgriPro, Mahindra, KisanKraft, Kubota</div>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-emerald-100/80">
              <span className="font-bold text-slate-800">Compatible Models:</span>
              <div className="text-slate-600">5HP - 55HP Tillers &amp; Tractors</div>
            </div>
          </div>
        </div>
      )}

      {/* Trust Badges */}
      <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-slate-600 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-agri-green shrink-0" />
          <span>40–60km Dark Warehouse Direct Delivery</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-agri-green shrink-0" />
          <span>1-Year Comprehensive AMC &amp; Warranty</span>
        </div>
      </div>

      {/* Auth Requirement Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl animate-scaleIn text-xs">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                  <Lock className="w-4 h-4 text-amber-700" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Sign In Required to {pendingAction === 'buy' ? 'Buy Now' : 'Add to Cart'}
                  </h3>
                  <p className="text-[11px] text-slate-500">Access Dark Warehouse dispatch &amp; warranty</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { setShowAuthModal(false); setPendingAction(null); }}
                className="text-slate-400 hover:text-slate-700 p-1 text-base cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 text-xs">
                {product.name}
              </div>
              <div className="text-slate-600 text-[11px] leading-relaxed">
                Please sign in to reserve dark warehouse stock, calculate doorstep delivery to your farm pin code, and access 1-year AMC warranty support.
              </div>
            </div>

            <div className="space-y-2 text-[11px] text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Real-time dark warehouse stock reservation (Hubballi / Belagavi)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Doorstep farm delivery tracking via SMS &amp; WhatsApp</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Kisan Wallet reward points on every agricultural purchase</span>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <Link
                href={`/login?redirect=/products/${product.slug}`}
                className="w-full bg-agri-green hover:bg-agri-green-dark text-white font-extrabold py-3 rounded-xl shadow-xs transition flex items-center justify-center gap-2 text-xs"
              >
                <User className="w-4 h-4" />
                <span>Sign In with Phone OTP / Password &rarr;</span>
              </Link>

              <button
                type="button"
                onClick={handleDemoSignInAndProceed}
                className="w-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-black py-2.5 rounded-xl shadow-xs transition flex items-center justify-center gap-2 text-xs cursor-pointer"
              >
                <Tractor className="w-4 h-4 text-slate-950" />
                <span>1-Click Demo Farmer Sign In &amp; Continue</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

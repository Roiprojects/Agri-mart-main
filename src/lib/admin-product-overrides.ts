const OVERRIDES_KEY = 'agrimart_admin_product_overrides_v1';
const DELETED_KEY = 'agrimart_admin_product_deleted_v1';

export function getSavedProductOverrides(): Record<string, any> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(OVERRIDES_KEY);
    if (!raw) return {};
    return JSON.parse(raw) || {};
  } catch {
    return {};
  }
}

export function getDeletedProductIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(DELETED_KEY);
    if (!raw) return [];
    return JSON.parse(raw) || [];
  } catch {
    return [];
  }
}

export function saveProductOverride(product: any): void {
  if (typeof window === 'undefined' || !product || !product.id) return;
  try {
    const current = getSavedProductOverrides();
    current[product.id] = {
      ...(current[product.id] || {}),
      ...product,
      updatedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(OVERRIDES_KEY, JSON.stringify(current));

    // Ensure it's not in deleted list
    const deleted = getDeletedProductIds().filter((id) => id !== product.id);
    window.localStorage.setItem(DELETED_KEY, JSON.stringify(deleted));
  } catch {}
}

export function getProductOverrideById(id: string): any | null {
  if (typeof window === 'undefined' || !id) return null;
  const overrides = getSavedProductOverrides();
  return overrides[id] || null;
}

export function saveProductOverridesBulk(products: any[]): void {
  if (typeof window === 'undefined' || !Array.isArray(products)) return;
  for (const p of products) {
    if (p && p.id) {
      saveProductOverride(p);
    }
  }
}

export function markProductDeletedOverride(id: string): void {
  if (typeof window === 'undefined' || !id) return;
  try {
    const current = getSavedProductOverrides();
    delete current[id];
    window.localStorage.setItem(OVERRIDES_KEY, JSON.stringify(current));

    const deleted = Array.from(new Set([...getDeletedProductIds(), id]));
    window.localStorage.setItem(DELETED_KEY, JSON.stringify(deleted));
  } catch {}
}

export function mergeProductsWithOverrides<T extends { id: string }>(
  serverProducts: T[],
  categories?: { id: string; name: string; parentId?: string | null }[],
  brands?: { id: string; name: string }[]
): T[] {
  if (typeof window === 'undefined') return serverProducts;
  const overrides = getSavedProductOverrides();
  const deletedIds = new Set(getDeletedProductIds());

  const catMap = new Map<string, { id: string; name: string; parentId?: string | null }>();
  (categories || []).forEach((c) => catMap.set(c.id, c));

  const brandMap = new Map<string, { id: string; name: string }>();
  (brands || []).forEach((b) => brandMap.set(b.id, b));

  const enrichProduct = (item: any) => {
    const next = { ...item };
    if (next.brandId && brandMap.has(next.brandId)) {
      next.brand = brandMap.get(next.brandId);
    }
    const pCatId = next.parentCategoryId || next.categoryId;
    if (pCatId && catMap.has(pCatId)) {
      const catObj = catMap.get(pCatId)!;
      if (catObj.parentId && catMap.has(catObj.parentId)) {
        next.subCategory = catObj;
        next.subCategoryId = catObj.id;
        next.parentCategory = catMap.get(catObj.parentId);
        next.parentCategoryId = catObj.parentId;
        next.category = next.parentCategory;
      } else {
        next.parentCategory = catObj;
        next.category = catObj;
      }
    }
    if (next.subCategoryId && catMap.has(next.subCategoryId)) {
      next.subCategory = catMap.get(next.subCategoryId);
    }
    if (next.stockQuantity !== undefined) {
      const stockNum = Number(next.stockQuantity) || 0;
      if (Array.isArray(next.variants) && next.variants.length > 0) {
        next.variants = next.variants.map((v: any, idx: number) =>
          idx === 0
            ? { ...v, stockQuantity: stockNum, price: next.price ?? v.price }
            : { ...v, stockQuantity: 0 }
        );
      } else {
        next.variants = [{ stockQuantity: stockNum, sku: next.sku, price: next.price }];
      }
    }
    return next;
  };

  const seenIds = new Set<string>();
  const merged = serverProducts
    .filter((p) => !deletedIds.has(p.id))
    .map((p) => {
      seenIds.add(p.id);
      if (overrides[p.id]) {
        return enrichProduct({ ...p, ...overrides[p.id] });
      }
      return p;
    });

  // Also include any newly created products stored in overrides that weren't in serverProducts yet
  for (const [id, ov] of Object.entries(overrides)) {
    if (!seenIds.has(id) && !deletedIds.has(id) && ov && ov.name) {
      merged.unshift(enrichProduct(ov));
    }
  }

  return merged;
}

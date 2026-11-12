const BRAND_OVERRIDES_KEY = 'agrimart_admin_brand_overrides_v1';
const BRAND_DELETED_KEY = 'agrimart_admin_brand_deleted_v1';

export function getSavedBrandOverrides(): Record<string, any> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(BRAND_OVERRIDES_KEY);
    if (!raw) return {};
    return JSON.parse(raw) || {};
  } catch {
    return {};
  }
}

export function getDeletedBrandIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(BRAND_DELETED_KEY);
    if (!raw) return [];
    return JSON.parse(raw) || [];
  } catch {
    return [];
  }
}

export function saveBrandOverride(brand: any): void {
  if (typeof window === 'undefined' || !brand || !brand.id) return;
  try {
    const current = getSavedBrandOverrides();
    current[brand.id] = {
      ...(current[brand.id] || {}),
      ...brand,
      updatedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(BRAND_OVERRIDES_KEY, JSON.stringify(current));

    // Ensure it is not in the deleted list
    const deleted = getDeletedBrandIds().filter((id) => id !== brand.id);
    window.localStorage.setItem(BRAND_DELETED_KEY, JSON.stringify(deleted));
  } catch {}
}

export function getBrandOverrideById(id: string): any | null {
  if (typeof window === 'undefined' || !id) return null;
  const overrides = getSavedBrandOverrides();
  return overrides[id] || null;
}

export function markBrandDeletedOverride(id: string): void {
  if (typeof window === 'undefined' || !id) return;
  try {
    const current = getSavedBrandOverrides();
    delete current[id];
    window.localStorage.setItem(BRAND_OVERRIDES_KEY, JSON.stringify(current));

    const deleted = Array.from(new Set([...getDeletedBrandIds(), id]));
    window.localStorage.setItem(BRAND_DELETED_KEY, JSON.stringify(deleted));
  } catch {}
}

export function mergeBrandsWithOverrides<T extends { id: string }>(
  serverBrands: T[]
): T[] {
  if (typeof window === 'undefined') return serverBrands;
  const overrides = getSavedBrandOverrides();
  const deletedIds = new Set(getDeletedBrandIds());

  const seenIds = new Set<string>();
  const merged = serverBrands
    .filter((b) => !deletedIds.has(b.id))
    .map((b) => {
      seenIds.add(b.id);
      if (overrides[b.id]) {
        return { ...b, ...overrides[b.id] };
      }
      return b;
    });

  // Include any newly created brands stored in overrides that weren't in serverBrands yet
  for (const [id, ov] of Object.entries(overrides)) {
    if (!seenIds.has(id) && !deletedIds.has(id) && ov && ov.name) {
      merged.push(ov as T);
    }
  }

  return merged;
}

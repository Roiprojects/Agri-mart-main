const CAT_OVERRIDES_KEY = 'agrimart_admin_category_overrides_v1';
const CAT_DELETED_KEY = 'agrimart_admin_category_deleted_v1';

export function getSavedCategoryOverrides(): Record<string, any> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(CAT_OVERRIDES_KEY);
    if (!raw) return {};
    return JSON.parse(raw) || {};
  } catch {
    return {};
  }
}

export function getDeletedCategoryIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(CAT_DELETED_KEY);
    if (!raw) return [];
    return JSON.parse(raw) || [];
  } catch {
    return [];
  }
}

export function saveCategoryOverride(category: any): void {
  if (typeof window === 'undefined' || !category || !category.id) return;
  try {
    const current = getSavedCategoryOverrides();
    current[category.id] = {
      ...(current[category.id] || {}),
      ...category,
      updatedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(CAT_OVERRIDES_KEY, JSON.stringify(current));

    // Ensure it is not in the deleted list
    const deleted = getDeletedCategoryIds().filter((id) => id !== category.id);
    window.localStorage.setItem(CAT_DELETED_KEY, JSON.stringify(deleted));
  } catch {}
}

export function getCategoryOverrideById(id: string): any | null {
  if (typeof window === 'undefined' || !id) return null;
  const overrides = getSavedCategoryOverrides();
  return overrides[id] || null;
}

export function markCategoryDeletedOverride(id: string): void {
  if (typeof window === 'undefined' || !id) return;
  try {
    const current = getSavedCategoryOverrides();
    delete current[id];
    window.localStorage.setItem(CAT_OVERRIDES_KEY, JSON.stringify(current));

    const deleted = Array.from(new Set([...getDeletedCategoryIds(), id]));
    window.localStorage.setItem(CAT_DELETED_KEY, JSON.stringify(deleted));
  } catch {}
}

export function mergeCategoriesWithOverrides<T extends { id: string }>(
  serverCategories: T[]
): T[] {
  if (typeof window === 'undefined') return serverCategories;
  const overrides = getSavedCategoryOverrides();
  const deletedIds = new Set(getDeletedCategoryIds());

  const seenIds = new Set<string>();
  const merged = serverCategories
    .filter((c) => !deletedIds.has(c.id))
    .map((c) => {
      seenIds.add(c.id);
      if (overrides[c.id]) {
        return { ...c, ...overrides[c.id] };
      }
      return c;
    });

  // Include any newly created categories stored in overrides that weren't in serverCategories yet
  for (const [id, ov] of Object.entries(overrides)) {
    if (!seenIds.has(id) && !deletedIds.has(id) && ov && ov.name) {
      merged.push(ov as T);
    }
  }

  return merged;
}

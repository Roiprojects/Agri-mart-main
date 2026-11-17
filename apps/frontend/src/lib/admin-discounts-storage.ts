export interface AdminDiscountRecord {
  id: string;
  isActive: boolean;
  name: string;
  discountType: string;
  vendor?: string;
  usePercentage: boolean;
  discountAmount: number;
  discountPercentage: number;
  currency?: string;
  requiresCouponCode: boolean;
  couponCode: string;
  startDate: string;
  endDate: string;
  cumulativeWithOtherDiscounts?: boolean;
  discountLimitation?: string;
  limitationTimes?: number;
  adminComment?: string;
  timesUsed: number;
  createdAt?: string;
  updatedAt?: string;
}

const DISCOUNTS_KEY = 'agrimart_admin_discounts_v1';
const DELETED_DISCOUNTS_KEY = 'agrimart_admin_discount_deleted_v1';

export function getSavedAdminDiscounts(): AdminDiscountRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(DISCOUNTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getDeletedDiscountIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(DELETED_DISCOUNTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveAdminDiscount(discount: AdminDiscountRecord): void {
  if (typeof window === 'undefined' || !discount || !discount.id) return;
  try {
    const current = getSavedAdminDiscounts();
    const idx = current.findIndex((d) => d.id === discount.id);
    if (idx >= 0) {
      current[idx] = { ...current[idx], ...discount, updatedAt: new Date().toISOString() };
    } else {
      current.unshift(discount);
    }
    window.localStorage.setItem(DISCOUNTS_KEY, JSON.stringify(current));

    const deleted = getDeletedDiscountIds().filter((id) => id !== discount.id);
    window.localStorage.setItem(DELETED_DISCOUNTS_KEY, JSON.stringify(deleted));
  } catch {}
}

export function deleteAdminDiscount(id: string): void {
  if (typeof window === 'undefined' || !id) return;
  try {
    const current = getSavedAdminDiscounts().filter((d) => d.id !== id);
    window.localStorage.setItem(DISCOUNTS_KEY, JSON.stringify(current));

    const deleted = Array.from(new Set([...getDeletedDiscountIds(), id]));
    window.localStorage.setItem(DELETED_DISCOUNTS_KEY, JSON.stringify(deleted));
  } catch {}
}

export function mergeDiscountsWithLocalStorage(
  serverDiscounts: AdminDiscountRecord[]
): AdminDiscountRecord[] {
  if (typeof window === 'undefined') return serverDiscounts;
  const localDiscounts = getSavedAdminDiscounts();
  const deletedIds = new Set(getDeletedDiscountIds());

  const byId = new Map<string, AdminDiscountRecord>();
  for (const d of serverDiscounts || []) {
    if (d && d.id && !deletedIds.has(d.id)) {
      byId.set(d.id, d);
    }
  }
  for (const d of localDiscounts) {
    if (d && d.id && !deletedIds.has(d.id)) {
      byId.set(d.id, { ...(byId.get(d.id) || {}), ...d });
    }
  }

  return Array.from(byId.values());
}

export async function fetchMergedDiscounts(): Promise<AdminDiscountRecord[]> {
  let serverDiscounts: AdminDiscountRecord[] = [];
  try {
    const res = await fetch('/api/admin/promotions/discounts', { cache: 'no-store' });
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      serverDiscounts = json.data;
    }
  } catch {}
  return mergeDiscountsWithLocalStorage(serverDiscounts);
}

export interface ResolvedProductDiscounts {
  activeDiscounts: AdminDiscountRecord[];
  primaryDiscount: AdminDiscountRecord | null;
  discountedPrice: number;
  hasAutomaticDiscount: boolean;
}

export function resolveProductDiscounts(
  product: { discountIds?: string[]; appliedDiscounts?: AdminDiscountRecord[] } | null | undefined,
  basePrice: number
): ResolvedProductDiscounts {
  if (!product) {
    return { activeDiscounts: [], primaryDiscount: null, discountedPrice: basePrice, hasAutomaticDiscount: false };
  }

  const discountIds = Array.isArray(product.discountIds) ? product.discountIds : [];
  const embedded = Array.isArray(product.appliedDiscounts) ? product.appliedDiscounts : [];
  const local = getSavedAdminDiscounts();
  const deletedIds = new Set(getDeletedDiscountIds());

  const byId = new Map<string, AdminDiscountRecord>();
  for (const d of embedded) {
    if (d && d.id && !deletedIds.has(d.id)) byId.set(d.id, d);
  }
  for (const d of local) {
    if (d && d.id && !deletedIds.has(d.id)) byId.set(d.id, d);
  }

  const now = new Date();
  const activeDiscounts = discountIds
    .map((id) => byId.get(id))
    .filter((d): d is AdminDiscountRecord => {
      if (!d || !d.isActive) return false;
      if (d.startDate) {
        const s = new Date(d.startDate);
        if (!Number.isNaN(s.getTime()) && now < s) return false;
      }
      if (d.endDate) {
        const e = new Date(d.endDate);
        if (!Number.isNaN(e.getTime()) && now > e) return false;
      }
      return true;
    });

  // Also include any embedded active discounts if discountIds wasn't populated
  if (activeDiscounts.length === 0 && embedded.length > 0 && discountIds.length === 0) {
    for (const d of embedded) {
      if (d && d.isActive && !deletedIds.has(d.id)) activeDiscounts.push(d);
    }
  }

  const primaryDiscount = activeDiscounts[0] || null;
  const autoDiscount = activeDiscounts.find((d) => !d.requiresCouponCode) || null;

  let discountedPrice = basePrice;
  if (autoDiscount && basePrice > 0) {
    if (autoDiscount.usePercentage && autoDiscount.discountPercentage > 0) {
      discountedPrice = Math.max(0, Math.round(basePrice * (1 - autoDiscount.discountPercentage / 100)));
    } else if (!autoDiscount.usePercentage && autoDiscount.discountAmount > 0) {
      discountedPrice = Math.max(0, Math.round(basePrice - autoDiscount.discountAmount));
    }
  }

  return {
    activeDiscounts,
    primaryDiscount,
    discountedPrice,
    hasAutomaticDiscount: Boolean(autoDiscount && discountedPrice < basePrice),
  };
}

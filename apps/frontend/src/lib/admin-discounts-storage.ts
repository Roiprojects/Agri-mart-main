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

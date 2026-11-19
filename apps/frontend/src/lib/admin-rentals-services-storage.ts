const RENTALS_KEY = 'agrimart_admin_rentals_v1';
const DELETED_RENTALS_KEY = 'agrimart_admin_rentals_deleted_v1';
const SERVICES_KEY = 'agrimart_admin_services_v1';
const DELETED_SERVICES_KEY = 'agrimart_admin_services_deleted_v1';

function readList<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeList<T>(key: string, items: T[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(items));
  } catch {}
}

export function saveRentalOverride(item: any): void {
  if (!item?.id) return;
  const list = readList<any>(RENTALS_KEY);
  const idx = list.findIndex((x) => x.id === item.id);
  if (idx >= 0) list[idx] = { ...list[idx], ...item };
  else list.unshift(item);
  writeList(RENTALS_KEY, list);
  writeList(
    DELETED_RENTALS_KEY,
    readList<string>(DELETED_RENTALS_KEY).filter((id) => id !== item.id)
  );
}

export function deleteRentalOverride(id: string): void {
  if (!id) return;
  writeList(
    RENTALS_KEY,
    readList<any>(RENTALS_KEY).filter((x) => x.id !== id)
  );
  writeList(
    DELETED_RENTALS_KEY,
    Array.from(new Set([...readList<string>(DELETED_RENTALS_KEY), id]))
  );
}

export function isRentalDeleted(id: string): boolean {
  return readList<string>(DELETED_RENTALS_KEY).includes(id);
}

export function buildRentalFromProduct(product: any) {
  const basePrice = Number(product.price) || 15000;
  const dailyRate = Math.max(250, Math.round(basePrice * 0.025));
  const hourlyRate = Math.max(50, Math.round(dailyRate / 6));
  const weeklyRate = Math.round(dailyRate * 6);
  const monthlyRate = Math.round(dailyRate * 22);
  const securityDeposit = Math.max(500, Math.round(dailyRate * 3.5));
  const units = Math.max(1, Math.min(10, Number(product.stockQuantity) || 3));
  const catName =
    typeof product.category === 'object'
      ? product.category?.name || 'Power Equipment'
      : product.category || 'Power Equipment';
  const img =
    (Array.isArray(product.images) && product.images[0]) ||
    product.image ||
    '/images/gallery/01-hero-tractor-sunrise.jpg';
  const crops =
    Array.isArray(product.targetCrops) && product.targetCrops.length > 0
      ? product.targetCrops.join(', ')
      : typeof product.targetCrops === 'string' && product.targetCrops.trim()
      ? product.targetCrops
      : 'Sugarcane, Cotton, Maize, Vegetables';
  const periodLen = Number(product.rentalPeriodLength) || 1;

  return {
    id: `rnt-${product.id}`,
    title: product.name || 'Rent Equipment',
    slug: `${product.slug || product.seName || product.id}-rental`,
    category: catName,
    description:
      product.shortDescription ||
      product.description ||
      `${product.name || 'Equipment'} available for farm equipment rental.`,
    hourlyRate,
    dailyRate,
    weeklyRate,
    monthlyRate,
    securityDeposit,
    images: [img],
    image: img,
    imageUrl: img,
    powerRating: product.modelNumber || product.riplCode || 'Standard Agricultural Grade',
    suitableFor: crops,
    fuelType: 'Standard / Petrol / Electric',
    weightKg: Number(product.weight) || 25,
    totalUnits: units,
    availableUnits: units,
    specifications: {
      SKU: product.sku || product.id,
      'Rental Availability': `${periodLen} Days`,
    },
  };
}

export function mergeRentalsWithOverrides<T extends { id: string }>(serverList: T[]): T[] {
  if (typeof window === 'undefined') return serverList;
  const overrides = readList<any>(RENTALS_KEY);
  const deleted = new Set(readList<string>(DELETED_RENTALS_KEY));
  const map = new Map<string, any>();
  for (const item of serverList || []) {
    if (item?.id && !deleted.has(item.id)) map.set(item.id, item);
  }
  for (const ov of overrides) {
    if (ov?.id && !deleted.has(ov.id)) map.set(ov.id, { ...(map.get(ov.id) || {}), ...ov });
  }
  return Array.from(map.values());
}

export function saveServiceOverride(item: any): void {
  if (!item?.id) return;
  const list = readList<any>(SERVICES_KEY);
  const idx = list.findIndex((x) => x.id === item.id);
  if (idx >= 0) list[idx] = { ...list[idx], ...item };
  else list.unshift(item);
  writeList(SERVICES_KEY, list);
  writeList(
    DELETED_SERVICES_KEY,
    readList<string>(DELETED_SERVICES_KEY).filter((id) => id !== item.id)
  );
}

export function deleteServiceOverride(id: string): void {
  if (!id) return;
  writeList(
    SERVICES_KEY,
    readList<any>(SERVICES_KEY).filter((x) => x.id !== id)
  );
  writeList(
    DELETED_SERVICES_KEY,
    Array.from(new Set([...readList<string>(DELETED_SERVICES_KEY), id]))
  );
}

export function mergeServicesWithOverrides<T extends { id: string }>(serverList: T[]): T[] {
  if (typeof window === 'undefined') return serverList;
  const overrides = readList<any>(SERVICES_KEY);
  const deleted = new Set(readList<string>(DELETED_SERVICES_KEY));
  const map = new Map<string, any>();
  for (const item of serverList || []) {
    if (item?.id && !deleted.has(item.id)) map.set(item.id, item);
  }
  for (const ov of overrides) {
    if (ov?.id && !deleted.has(ov.id)) map.set(ov.id, { ...(map.get(ov.id) || {}), ...ov });
  }
  return Array.from(map.values());
}

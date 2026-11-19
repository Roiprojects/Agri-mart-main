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

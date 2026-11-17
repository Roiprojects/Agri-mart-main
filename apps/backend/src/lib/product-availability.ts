export interface ProductAvailabilityState {
  hasStartDate: boolean;
  hasEndDate: boolean;
  isBeforeStart: boolean;
  isAfterEnd: boolean;
  isAvailableNow: boolean;
  shouldBlurImage: boolean;
  formattedStart: string | null;
  formattedEnd: string | null;
}

function parseDateMs(value?: string | null): number | null {
  if (!value || !String(value).trim()) return null;
  const ms = Date.parse(String(value).trim());
  return Number.isFinite(ms) ? ms : null;
}

export function formatAvailabilityDate(value?: string | null): string | null {
  const ms = parseDateMs(value);
  if (ms === null) return null;
  const d = new Date(ms);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const yyyy = d.getFullYear();
  const timeStr = d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${mm}/${dd}/${yyyy} ${timeStr}`;
}

export function getProductAvailability(
  product?: { availableStartDate?: string | null; availableEndDate?: string | null } | null,
  nowMs: number = Date.now()
): ProductAvailabilityState {
  const startMs = parseDateMs(product?.availableStartDate);
  const endMs = parseDateMs(product?.availableEndDate);

  const hasStartDate = startMs !== null;
  const hasEndDate = endMs !== null;
  const isBeforeStart = startMs !== null && nowMs < startMs;
  const isAfterEnd = endMs !== null && nowMs > endMs;
  const isAvailableNow = !isBeforeStart && !isAfterEnd;

  return {
    hasStartDate,
    hasEndDate,
    isBeforeStart,
    isAfterEnd,
    isAvailableNow,
    shouldBlurImage: isBeforeStart,
    formattedStart: formatAvailabilityDate(product?.availableStartDate),
    formattedEnd: formatAvailabilityDate(product?.availableEndDate),
  };
}

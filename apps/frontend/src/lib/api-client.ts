/**
 * AGRI MART Decoupled Typed Backend API Client
 * Used by Server Components (with Next.js ISR tags) and Client Components.
 * Zero direct database access or server secrets.
 */

import {
  CartCalculationRequest,
  CartCalculationResponse,
  CartRevalidationRequest,
  CartRevalidationResponse,
  CreateOrderRequest,
  CreateOrderResponse,
  VerifyPaymentRequest,
  VerifyPaymentResponse,
} from '@agrimart/contracts';

const IS_SERVER = typeof window === 'undefined';

interface CacheEntry {
  data: any;
  timestamp: number;
}

const globalApiCache = globalThis as unknown as {
  __agrimartFrontendApiCache?: Map<string, CacheEntry>;
};

export function getFrontendApiCache(): Map<string, CacheEntry> {
  if (!globalApiCache.__agrimartFrontendApiCache) {
    globalApiCache.__agrimartFrontendApiCache = new Map<string, CacheEntry>();
  }
  return globalApiCache.__agrimartFrontendApiCache;
}

export function clearFrontendApiCache(): void {
  getFrontendApiCache().clear();
}

function getBackendBaseUrl(): string {
  if (IS_SERVER) {
    const rawUrl =
      process.env.BACKEND_INTERNAL_URL ||
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      'http://127.0.0.1:3011';
    return rawUrl.replace('://localhost:', '://127.0.0.1:');
  }
  return process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3011';
}

export class ApiClient {
  private static baseUrl = getBackendBaseUrl();

  private static async fetchJson<T>(
    endpoint: string,
    options?: RequestInit & { next?: { tags?: string[]; revalidate?: number } }
  ): Promise<T> {
    const method = (options?.method || 'GET').toUpperCase();
    const url = `${getBackendBaseUrl()}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    };

    const cache = getFrontendApiCache();
    if (method === 'GET') {
      const cached = cache.get(url);
      const now = Date.now();
      if (cached && now - cached.timestamp < 120000) {
        return cached.data as T;
      }
      if (cached) {
        // Stale-while-revalidate: return cached immediately and refresh in background
        fetch(url, { ...options, headers })
          .then((r) => (r.ok ? r.json() : null))
          .then((fresh) => {
            if (fresh) cache.set(url, { data: fresh, timestamp: Date.now() });
          })
          .catch(() => {});
        return cached.data as T;
      }
    } else {
      cache.clear();
    }

    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const errorBody = await res.text().catch(() => '');
      throw new Error(`API error ${res.status} on ${endpoint}: ${errorBody || res.statusText}`);
    }

    const json = (await res.json()) as T;
    if (method === 'GET') {
      cache.set(url, { data: json, timestamp: Date.now() });
    }
    return json;
  }

  // --- CATALOGUE & PRODUCTS ---

  static async getProducts(query?: {
    category?: string;
    crop?: string;
    stage?: number;
    search?: string;
    sort?: string;
  }) {
    const params = new URLSearchParams();
    if (query?.category && query.category !== 'ALL') params.set('category', query.category);
    if (query?.crop && query.crop !== 'ALL') params.set('crop', query.crop);
    if (query?.stage) params.set('stage', String(query.stage));
    if (query?.search) params.set('search', query.search);
    if (query?.sort) params.set('sort', query.sort);

    const qs = params.toString() ? `?${params.toString()}` : '';
    return this.fetchJson<{ success: boolean; data: any[] }>(`/api/products${qs}`, {
      cache: 'no-store',
    });
  }

  static async getProductBySlug(slug: string) {
    return this.fetchJson<{ success: boolean; data: any }>(`/api/products/${slug}`, {
      cache: 'no-store',
    });
  }

  static async getCategories() {
    return this.fetchJson<{ success: boolean; data: any[] }>(`/api/categories`, {
      cache: 'no-store',
    });
  }

  static async getBanners() {
    return this.fetchJson<{ success: boolean; data: any[] }>(`/api/content/banners`, {
      cache: 'no-store',
    });
  }

  // --- RENTALS ---

  static async getRentals() {
    return this.fetchJson<{ success: boolean; data: any[] }>(`/api/rentals`, {
      cache: 'no-store',
    });
  }

  static async getRentalBySlug(slug: string) {
    return this.fetchJson<{ success: boolean; data: any }>(`/api/rentals?slug=${slug}`, {
      cache: 'no-store',
    });
  }

  static async getCustomerRentals(userId: string = 'usr-farmer-01') {
    return this.fetchJson<{ success: boolean; data: any[] }>(`/api/rentals/book?userId=${userId}`, {
      cache: 'no-store',
    });
  }

  static async bookRental(payload: any) {
    return this.fetchJson<{ success: boolean; data: any }>(`/api/rentals/book`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // --- SERVICES ---

  static async getServicesCatalogue(query?: { category?: string; search?: string; slug?: string }) {
    const params = new URLSearchParams();
    if (query?.category && query.category !== 'All') params.set('category', query.category);
    if (query?.search) params.set('search', query.search);
    if (query?.slug) params.set('slug', query.slug);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return this.fetchJson<{ success: boolean; services: any[] }>(`/api/services${qs}`, {
      cache: 'no-store',
    });
  }

  static async getCustomerServices(userId: string = 'usr-farmer-01') {
    return this.fetchJson<{ success: boolean; data: any[] }>(`/api/services/request?userId=${userId}`, {
      cache: 'no-store',
    });
  }

  static async requestService(payload: any) {
    return this.fetchJson<{ success: boolean; data: any }>(`/api/services/request`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // --- CART & SECURE REVALIDATION ---

  static async revalidateCart(request: CartRevalidationRequest): Promise<CartRevalidationResponse> {
    return this.fetchJson<CartRevalidationResponse>(`/api/cart/revalidate`, {
      method: 'POST',
      body: JSON.stringify(request),
      cache: 'no-store',
    });
  }

  static async calculateCart(request: CartCalculationRequest): Promise<CartCalculationResponse> {
    return this.fetchJson<CartCalculationResponse>(`/api/cart/calculate`, {
      method: 'POST',
      body: JSON.stringify(request),
      cache: 'no-store',
    });
  }

  // --- CHECKOUT & ORDERS ---

  static async createOrder(payload: CreateOrderRequest): Promise<CreateOrderResponse> {
    return this.fetchJson<CreateOrderResponse>(`/api/checkout/create-order`, {
      method: 'POST',
      body: JSON.stringify(payload),
      cache: 'no-store',
    });
  }

  static async verifyPayment(payload: VerifyPaymentRequest): Promise<VerifyPaymentResponse> {
    return this.fetchJson<VerifyPaymentResponse>(`/api/checkout/verify-payment`, {
      method: 'POST',
      body: JSON.stringify(payload),
      cache: 'no-store',
    });
  }

  static async getCustomerOrders(userId: string = 'usr-farmer-01', orderId?: string) {
    const qs = orderId ? `?userId=${userId}&id=${orderId}` : `?userId=${userId}`;
    return this.fetchJson<{ success: boolean; data: any }>(`/api/customer/orders${qs}`, {
      cache: 'no-store',
    });
  }

  // --- FARMER PROFILE & ADVISORY ---

  static async getFarmerProfile(userId: string = 'usr-farmer-01') {
    return this.fetchJson<{ success: boolean; data: any }>(`/api/procurement/farmers?farmerId=${userId}`, {
      cache: 'no-store',
    });
  }

  static async getAiRecommendations(payload: any) {
    return this.fetchJson<{ success: boolean; data: any }>(`/api/ai/recommendations`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
}

/**
 * AGRI MART Unified Typed Backend & In-Process API Client
 * Used by Server Components (direct in-process devDb / CatalogueService access) and Client Components (same-origin /api/*).
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
import { devDb, readDb, writeDb } from './dev-db';
import { CatalogueService } from './catalogue-service';
import { SERVICES_CATALOGUE, ServiceDefinition } from './services-data';

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
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://127.0.0.1:3011');
    return rawUrl.replace('://localhost:', '://127.0.0.1:');
  }
  return process.env.NEXT_PUBLIC_BACKEND_URL || '';
}

export class ApiClient {
  private static async fetchJson<T>(
    endpoint: string,
    options?: RequestInit & { next?: { tags?: string[]; revalidate?: number } }
  ): Promise<T> {
    const method = (options?.method || 'GET').toUpperCase();
    const baseUrl = getBackendBaseUrl();
    const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
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
    if (IS_SERVER) {
      const products = await CatalogueService.getProducts({
        categoryId: query?.category && query.category !== 'ALL' ? query.category : undefined,
        crop: query?.crop && query.crop !== 'ALL' ? query.crop : undefined,
        stage: query?.stage,
        search: query?.search,
        onlyPublished: true,
      });

      const detailed = products.map((p) => {
        const full = devDb.getProductWithDetails(p.id);
        const categoryObj = full?.category;
        const mediaObj = full?.media?.[0];
        const image = mediaObj?.url || 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80';

        return {
          ...p,
          category: categoryObj?.name || 'General Agri Input',
          categoryKn: categoryObj?.nameKn,
          image,
          images: full?.media?.map((m) => m.url) || [image],
          rating: 4.8,
          reviewsCount: full?.reviews?.length || 12,
          inStock: full?.warehouseStocks?.some((ws) => ws.quantity > 0) ?? true,
          variants: full?.variants || [],
          specifications: full?.specifications || [],
        };
      });

      return { success: true, data: detailed };
    }

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
    if (IS_SERVER) {
      const product = devDb.getProductBySlug(slug) || devDb.getProductById(slug);
      if (!product) {
        return { success: false, data: null };
      }
      const detailed = devDb.getProductWithDetails(product.id);
      const categoryObj = detailed?.category;
      const mediaList = detailed?.media?.map((m) => m.url) || [];
      const defaultImage = 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80';

      return {
        success: true,
        data: {
          id: product.id,
          slug: product.slug,
          sku: product.sku,
          name: product.name,
          nameKn: product.nameKn,
          brand: detailed?.brand?.name || product.brandId || 'AgriPro',
          categoryId: product.categoryId,
          category: categoryObj?.name || 'Farm Equipment & Machinery',
          categoryKn: categoryObj?.nameKn,
          price: product.price,
          comparePrice: product.comparePrice,
          description: product.description,
          targetCrops: product.targetCrops || [],
          cropStages: product.cropStages || [],
          images: mediaList.length > 0 ? mediaList : [defaultImage],
          variants: detailed?.variants || [],
          specifications: detailed?.specifications || [],
          reviews: detailed?.reviews || [],
          warehouseStocks: detailed?.warehouseStocks || [],
        },
      };
    }

    return this.fetchJson<{ success: boolean; data: any }>(`/api/products/${slug}`, {
      cache: 'no-store',
    });
  }

  static async getCategories() {
    if (IS_SERVER) {
      const categories = devDb.getCategories();
      const products = devDb.getProducts();
      const formatted = categories.map((cat) => {
        const count = products.filter((p) => p.categoryId === cat.id).length;
        return {
          id: cat.id,
          slug: cat.slug,
          name: cat.name,
          nameKn: cat.nameKn,
          description: cat.description,
          image: cat.image,
          imageUrl: cat.image,
          productCount: count,
          featured: cat.displayOrder <= 4,
        };
      });
      return { success: true, data: formatted };
    }

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
    if (IS_SERVER) {
      const items = devDb.getRentalProducts();
      return { success: true, data: items };
    }
    return this.fetchJson<{ success: boolean; data: any[] }>(`/api/rentals`, {
      cache: 'no-store',
    });
  }

  static async getRentalBySlug(slug: string) {
    if (IS_SERVER) {
      const item = devDb.getRentalProductBySlug(slug) || devDb.getRentalProductById(slug);
      return { success: Boolean(item), data: item || null };
    }
    return this.fetchJson<{ success: boolean; data: any }>(`/api/rentals?slug=${slug}`, {
      cache: 'no-store',
    });
  }

  static async getCustomerRentals(userId: string = 'usr-farmer-01') {
    if (IS_SERVER) {
      const bookings = devDb.getRentalBookings({ userId });
      return { success: true, data: bookings };
    }
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
    if (IS_SERVER) {
      const db = readDb();
      if (!db.services || !Array.isArray(db.services) || db.services.length === 0) {
        db.services = JSON.parse(JSON.stringify(SERVICES_CATALOGUE));
        writeDb(db);
      }
      let services: ServiceDefinition[] = db.services;

      if (query?.slug) {
        const found = services.find((s) => s.slug === query.slug);
        return { success: Boolean(found), service: found || null, services: found ? [found] : [] };
      }

      if (query?.category && query.category !== 'All') {
        services = services.filter((s) => s.category.toLowerCase() === query.category!.toLowerCase());
      }

      if (query?.search) {
        const q = query.search.toLowerCase();
        services = services.filter(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            s.shortDescription.toLowerCase().includes(q) ||
            s.category.toLowerCase().includes(q)
        );
      }

      return { success: true, services, total: services.length };
    }

    const params = new URLSearchParams();
    if (query?.category && query.category !== 'All') params.set('category', query.category);
    if (query?.search) params.set('search', query.search);
    if (query?.slug) params.set('slug', query.slug);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return this.fetchJson<{ success: boolean; services: any[]; service?: any }>(`/api/services${qs}`, {
      cache: 'no-store',
    });
  }

  static async getCustomerServices(userId: string = 'usr-farmer-01') {
    if (IS_SERVER) {
      const requests = devDb.getServiceRequests({ userId });
      return { success: true, data: requests };
    }
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
    if (IS_SERVER) {
      if (orderId) {
        const details = devDb.getOrderWithDetails(orderId);
        return { success: Boolean(details), data: details || null };
      }
      const orders = devDb.getOrders(userId || undefined);
      const fullOrders = orders.map((o) => devDb.getOrderWithDetails(o.id));
      return { success: true, data: fullOrders };
    }
    const qs = orderId ? `?userId=${userId}&id=${orderId}` : `?userId=${userId}`;
    return this.fetchJson<{ success: boolean; data: any }>(`/api/customer/orders${qs}`, {
      cache: 'no-store',
    });
  }

  // --- FARMER PROFILE & ADVISORY ---

  static async getFarmerProfile(userId: string = 'usr-farmer-01') {
    if (IS_SERVER) {
      const profile = devDb.getFarmerProfileById(userId) || devDb.getFarmerProfiles()[0] || null;
      return { success: Boolean(profile), data: profile, profile };
    }
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

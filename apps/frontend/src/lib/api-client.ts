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

function getBackendBaseUrl(): string {
  if (IS_SERVER) {
    return (
      process.env.BACKEND_INTERNAL_URL ||
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      'http://localhost:3011'
    );
  }
  return process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3011';
}

export class ApiClient {
  private static baseUrl = getBackendBaseUrl();

  private static async fetchJson<T>(
    endpoint: string,
    options?: RequestInit & { next?: { tags?: string[]; revalidate?: number } }
  ): Promise<T> {
    const url = `${getBackendBaseUrl()}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    };

    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const errorBody = await res.text().catch(() => '');
      throw new Error(`API error ${res.status} on ${endpoint}: ${errorBody || res.statusText}`);
    }

    return (await res.json()) as T;
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
      next: { tags: ['products', 'catalogue'], revalidate: 30 },
    });
  }

  static async getProductBySlug(slug: string) {
    return this.fetchJson<{ success: boolean; data: any }>(`/api/products/${slug}`, {
      next: { tags: ['products', `product-${slug}`], revalidate: 30 },
    });
  }

  static async getCategories() {
    return this.fetchJson<{ success: boolean; data: any[] }>(`/api/categories`, {
      next: { tags: ['categories'], revalidate: 30 },
    });
  }

  static async getBanners() {
    return this.fetchJson<{ success: boolean; data: any[] }>(`/api/content/banners`, {
      next: { tags: ['banners'], revalidate: 30 },
    });
  }

  // --- RENTALS ---

  static async getRentals() {
    return this.fetchJson<{ success: boolean; data: any[] }>(`/api/rentals`, {
      next: { tags: ['rentals'], revalidate: 30 },
    });
  }

  static async getRentalBySlug(slug: string) {
    return this.fetchJson<{ success: boolean; data: any }>(`/api/rentals?slug=${slug}`, {
      next: { tags: ['rentals', `rental-${slug}`], revalidate: 30 },
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

import { devDb, DbProduct, DbCategory, DbBrand, DbCoupon, DbReview } from './dev-db';
import { revalidatePath } from 'next/cache';

export interface CatalogueFilters {
  categoryId?: string;
  crop?: string;
  stage?: number;
  search?: string;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  onlyPublished?: boolean;
}

export class CatalogueService {
  static async getCategories(): Promise<DbCategory[]> {
    return devDb.getCategories();
  }

  static async getCategoryBySlug(slug: string): Promise<DbCategory | undefined> {
    return devDb.getCategoryBySlug(slug);
  }

  static async getProducts(filters?: CatalogueFilters): Promise<DbProduct[]> {
    return devDb.getProducts(filters);
  }

  static async getProductBySlug(slug: string) {
    return devDb.getProductWithDetails(slug);
  }

  static async getProductById(id: string) {
    return devDb.getProductWithDetails(id);
  }

  static async getBrands(): Promise<DbBrand[]> {
    return devDb.getBrands();
  }

  static async getCoupons(): Promise<DbCoupon[]> {
    return devDb.getCoupons();
  }

  static async validateCoupon(code: string, subtotal: number) {
    return devDb.validateCoupon(code, subtotal);
  }

  static async getProductReviews(productId: string): Promise<DbReview[]> {
    return devDb.getProductReviews(productId);
  }

  static async addProductReview(review: Omit<DbReview, 'id' | 'createdAt'>): Promise<DbReview> {
    const created = devDb.addReview(review);
    const product = devDb.getProductById(review.productId);
    if (product) {
      this.revalidateProduct(product.slug);
    }
    return created;
  }

  // Admin Mutations with Deliberate Cache Invalidation
  static async saveProduct(productData: any): Promise<DbProduct> {
    const saved = devDb.saveProduct(productData);

    // Deliberate Cache Revalidation across public storefront pages
    try {
      revalidatePath('/shop');
      revalidatePath('/products/' + saved.slug);
      revalidatePath('/');
      if (saved.categoryId) {
        const cat = devDb.getCategories().find((c) => c.id === saved.categoryId);
        if (cat) revalidatePath('/categories/' + cat.slug);
      }
      revalidatePath('/crop-guidance');
    } catch (e) {
      // Revalidation within route handlers / server actions
    }

    return saved;
  }

  static async deleteProduct(id: string): Promise<boolean> {
    const product = devDb.getProductById(id);
    const slug = product?.slug;
    const deleted = devDb.deleteProduct(id);

    try {
      revalidatePath('/shop');
      if (slug) revalidatePath('/products/' + slug);
      revalidatePath('/');
      revalidatePath('/crop-guidance');
    } catch (e) {}

    return deleted;
  }

  static async saveCategory(categoryData: any): Promise<DbCategory> {
    const saved = devDb.saveCategory(categoryData);

    try {
      revalidatePath('/shop');
      revalidatePath('/categories/' + saved.slug);
      revalidatePath('/');
    } catch (e) {}

    return saved;
  }

  static async saveCoupon(couponData: any): Promise<DbCoupon> {
    return devDb.saveCoupon(couponData);
  }

  static revalidateProduct(slug: string) {
    try {
      revalidatePath('/products/' + slug);
      revalidatePath('/shop');
      revalidatePath('/');
    } catch (e) {}
  }
}

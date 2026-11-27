import { NextResponse } from 'next/server';
import { CatalogueService } from '@/lib/catalogue-service';
import { devDb } from '@/lib/dev-db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const crop = searchParams.get('crop');
  const stage = searchParams.get('stage');
  const search = searchParams.get('search') || searchParams.get('q');
  const color = searchParams.get('color');
  const minMrpParam = searchParams.get('minMrp');
  const maxMrpParam = searchParams.get('maxMrp');

  const products = await CatalogueService.getProducts({
    categoryId: category || undefined,
    crop: crop || undefined,
    stage: stage ? parseInt(stage) : undefined,
    search: search || undefined,
    onlyPublished: true,
  });

  let detailed = products.map((p) => {
    const full = devDb.getProductWithDetails(p.id);
    const categoryObj = full?.category;
    const mediaObj = full?.media?.[0];
    const image = mediaObj?.url || 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80';

    return {
      ...p,
      brand: p.brandName || full?.brand?.name || (p as any).brand || 'Agrimate',
      brandName: p.brandName || full?.brand?.name || 'Agrimate',
      disableBuyButton: Boolean(p.disableBuyButton),
      disableWishlistButton: Boolean(p.disableWishlistButton),
      callForPrice: Boolean(p.callForPrice),
      customerEntersPrice: Boolean(p.customerEntersPrice),
      availableForPreOrder: Boolean(p.availableForPreOrder),
      requireOtherProducts: Boolean(p.requireOtherProducts),
      requiredProductIds: full?.requiredProductIds || [],
      requiredProducts: full?.requiredProducts || [],
      automaticallyAddRequiredProducts: Boolean((p as any).automaticallyAddRequiredProducts),
      allowCustomerReviews:
        p.allowCustomerReviews !== undefined ? Boolean(p.allowCustomerReviews) : true,
      availableStartDate: p.availableStartDate || '',
      availableEndDate: p.availableEndDate || '',
      markAsNew: Boolean(p.markAsNew),
      isRental: Boolean((p as any).isRental),
      rentalPeriodLength: (p as any).rentalPeriodLength || '',
      rentalPeriod: (p as any).rentalPeriod || 'Days',
      isRentService: Boolean((p as any).isRentService),
      servicePeriodLength: (p as any).servicePeriodLength || '',
      servicePeriod: (p as any).servicePeriod || 'Days',
      discountIds: Array.isArray((p as any).discountIds) ? (p as any).discountIds : [],
      appliedDiscounts: Array.isArray((p as any).appliedDiscounts) ? (p as any).appliedDiscounts : [],
      category: categoryObj?.name || (p as any).category || 'General Agri Input',
      categoryKn: categoryObj?.nameKn,
      image,
      images: full?.media?.map((m) => m.url) || p.images || [image],
      rating: 4.8,
      reviewsCount: full?.reviews?.length || 12,
      stockQuantity:
        p.stockQuantity !== undefined
          ? Number(p.stockQuantity)
          : full?.variants?.[0]?.stockQuantity ?? 25,
      stock:
        p.stockQuantity !== undefined
          ? Number(p.stockQuantity)
          : full?.variants?.[0]?.stockQuantity ?? 25,
      minStockQuantity:
        (p as any).minStockQuantity ??
        (p as any).lowStockQuantity ??
        (p as any).minOrderQty ??
        1,
      lowStockQuantity:
        (p as any).minStockQuantity ??
        (p as any).lowStockQuantity ??
        (p as any).minOrderQty ??
        1,
      inStock: (p.stockQuantity ?? 0) > 0 || (full?.warehouseStocks?.some((ws) => ws.quantity > 0) ?? true),
      variants: full?.variants || [],
      specifications: full?.specifications || [],
      productAttributes: (p as any).productAttributes || (full as any)?.productAttributes || [],
      attributeCombinations: (p as any).attributeCombinations || (full as any)?.attributeCombinations || [],
      displayOnlyAttributeImages: Boolean(
        (p as any).displayOnlyAttributeImages ?? (full as any)?.displayOnlyAttributeImages
      ),
      specificationAttributes:
        (p as any).specificationAttributes || (full as any)?.specificationAttributes || [],
      updatedAt: (p as any).updatedAt || (full as any)?.updatedAt || '',
    };
  });

  if (color) {
    const targetColor = color.trim().toLowerCase();
    detailed = detailed.filter((item: any) =>
      Array.isArray(item.productAttributes) &&
      item.productAttributes.some(
        (a: any) =>
          Array.isArray(a.values) &&
          a.values.some((v: any) => String(v.name || '').trim().toLowerCase() === targetColor)
      )
    );
  }

  if (minMrpParam !== null && minMrpParam !== '' && Number.isFinite(Number(minMrpParam))) {
    const minVal = Number(minMrpParam);
    detailed = detailed.filter((item: any) => Number(item.comparePrice || item.price || 0) >= minVal);
  }

  if (maxMrpParam !== null && maxMrpParam !== '' && Number.isFinite(Number(maxMrpParam))) {
    const maxVal = Number(maxMrpParam);
    detailed = detailed.filter((item: any) => Number(item.comparePrice || item.price || 0) <= maxVal);
  }

  return NextResponse.json({
    success: true,
    count: detailed.length,
    data: detailed,
  });
}

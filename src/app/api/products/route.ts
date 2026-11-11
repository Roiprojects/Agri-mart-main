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

  const products = await CatalogueService.getProducts({
    categoryId: category || undefined,
    crop: crop || undefined,
    stage: stage ? parseInt(stage) : undefined,
    search: search || undefined,
    onlyPublished: true,
  });

  const detailed = products.map((p) => {
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
      availableForPreOrder: Boolean(p.availableForPreOrder),
      category: categoryObj?.name || (p as any).category || 'General Agri Input',
      categoryKn: categoryObj?.nameKn,
      image,
      images: full?.media?.map((m) => m.url) || p.images || [image],
      rating: 4.8,
      reviewsCount: full?.reviews?.length || 12,
      inStock: (p.stockQuantity ?? 0) > 0 || (full?.warehouseStocks?.some((ws) => ws.quantity > 0) ?? true),
      variants: full?.variants || [],
      specifications: full?.specifications || [],
    };
  });

  return NextResponse.json({
    success: true,
    count: detailed.length,
    data: detailed,
  });
}

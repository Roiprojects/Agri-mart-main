import { NextResponse } from 'next/server';
import { CatalogueService } from '@/lib/catalogue-service';
import { devDb } from '@/lib/dev-db';

export async function GET(request: Request) {
  devDb.reload();
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

  return NextResponse.json({
    success: true,
    count: detailed.length,
    data: detailed,
  });
}

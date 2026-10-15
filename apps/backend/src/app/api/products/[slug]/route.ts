import { NextRequest, NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const product = devDb.getProductBySlug(slug) || devDb.getProductById(slug);

  if (!product) {
    return NextResponse.json(
      { success: false, error: 'Product not found' },
      { status: 404 }
    );
  }

  const detailed = devDb.getProductWithDetails(product.id);
  const categoryObj = detailed?.category;
  const mediaList = detailed?.media?.map((m) => m.url) || [];
  const defaultImage = 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80';

  return NextResponse.json({
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
  });
}

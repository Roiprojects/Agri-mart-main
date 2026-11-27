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
      name: product.name,
      nameKn: product.nameKn,
      slug: product.slug,
      sku: product.sku,
      riplCode: product.riplCode,
      modelNumber: product.modelNumber,
      brand: detailed?.brand?.name || (product as any).brandName || product.brandId || 'AgriPro',
      brandName: detailed?.brand?.name || (product as any).brandName || 'AgriPro',
      categoryId: product.categoryId,
      category: categoryObj?.name || 'Farm Equipment & Machinery',
      categoryKn: categoryObj?.nameKn,
      price: product.price,
      comparePrice: product.comparePrice,
      priceNote: product.priceNote,
      discountText: (product as any).discountText,
      variantLabel: product.variantLabel,
      availableQty: product.availableQty,
      description: product.description,
      descriptionHtml: product.descriptionHtml,
      accessoriesInfo: product.accessoriesInfo,
      accessoriesAvailable: Boolean(product.accessoriesAvailable),
      brochures: product.brochures || [],
      videos: product.videos || [],
      targetCrops: product.targetCrops || [],
      cropStages: product.cropStages || [],
      images: mediaList.length > 0 ? mediaList : [defaultImage],
      variants: detailed?.variants || [],
      specifications: detailed?.specifications || [],
      productAttributes: (product as any).productAttributes || (detailed as any)?.productAttributes || [],
      attributeCombinations:
        (product as any).attributeCombinations || (detailed as any)?.attributeCombinations || [],
      displayOnlyAttributeImages: Boolean(
        (product as any).displayOnlyAttributeImages ?? (detailed as any)?.displayOnlyAttributeImages
      ),
      specificationAttributes:
        (product as any).specificationAttributes || (detailed as any)?.specificationAttributes || [],
      updatedAt: (product as any).updatedAt || (detailed as any)?.updatedAt || '',
      reviews: detailed?.reviews || [],
      warehouseStocks: detailed?.warehouseStocks || [],
      disableBuyButton: Boolean(product.disableBuyButton),
      disableWishlistButton: Boolean(product.disableWishlistButton),
      isRental: Boolean((product as any).isRental),
      rentalPeriodLength: (product as any).rentalPeriodLength || '',
      rentalPeriod: (product as any).rentalPeriod || 'Days',
      isRentService: Boolean((product as any).isRentService),
      servicePeriodLength: (product as any).servicePeriodLength || '',
      servicePeriod: (product as any).servicePeriod || 'Days',
      discountIds: Array.isArray((product as any).discountIds) ? (product as any).discountIds : [],
      appliedDiscounts: Array.isArray((product as any).appliedDiscounts) ? (product as any).appliedDiscounts : [],
      availableForPreOrder: Boolean(product.availableForPreOrder),
      callForPrice: Boolean(product.callForPrice),
      customerEntersPrice: Boolean(product.customerEntersPrice),
      requireOtherProducts: Boolean(product.requireOtherProducts),
      requiredProductIds: detailed?.requiredProductIds || [],
      requiredProducts: detailed?.requiredProducts || [],
      automaticallyAddRequiredProducts: Boolean((product as any).automaticallyAddRequiredProducts),
      allowCustomerReviews:
        product.allowCustomerReviews !== undefined ? Boolean(product.allowCustomerReviews) : true,
      availableStartDate: product.availableStartDate || '',
      availableEndDate: product.availableEndDate || '',
      markAsNew: Boolean(product.markAsNew),
      isPublished: product.isPublished !== undefined ? Boolean(product.isPublished) : true,
      isFeatured: Boolean(product.isFeatured),
      isBestSeller: Boolean(product.isBestSeller),
      stockQuantity:
        product.stockQuantity !== undefined
          ? Number(product.stockQuantity)
          : detailed?.variants?.[0]?.stockQuantity ?? 25,
      stock:
        product.stockQuantity !== undefined
          ? Number(product.stockQuantity)
          : detailed?.variants?.[0]?.stockQuantity ?? 25,
      minStockQuantity:
        (product as any).minStockQuantity ??
        (product as any).lowStockQuantity ??
        (product as any).minOrderQty ??
        1,
      lowStockQuantity:
        (product as any).minStockQuantity ??
        (product as any).lowStockQuantity ??
        (product as any).minOrderQty ??
        1,
      minOrderQty:
        (product as any).minStockQuantity ??
        (product as any).lowStockQuantity ??
        (product as any).minOrderQty ??
        1,
    },
  });
}

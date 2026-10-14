import { NextResponse } from 'next/server';
import { CatalogueService } from '@/lib/catalogue-service';
import { devDb } from '@/lib/dev-db';

// Catalogue products admin route with full nopCommerce pricing and metadata support
export async function GET() {
  const products = devDb.getProducts({ onlyPublished: false });
  const fullProducts = products.map((p) => devDb.getProductWithDetails(p.id));
  return NextResponse.json({ success: true, count: fullProducts.length, data: fullProducts });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Support batch updates for bulk editing
    if (Array.isArray(body)) {
      const results = [];
      for (const item of body) {
        if (item.id) {
          const existing = devDb.getProductById(item.id);
          if (existing) {
            const updated = await CatalogueService.saveProduct({
              ...existing,
              ...item,
            });
            results.push(updated);
          }
        }
      }
      return NextResponse.json({
        success: true,
        count: results.length,
        data: results,
        message: `${results.length} product(s) updated successfully.`,
      });
    }

    if (!body.name || !body.sku) {
      return NextResponse.json({ success: false, message: 'Product name and SKU are required.' }, { status: 400 });
    }

    const saved = await CatalogueService.saveProduct(body);

    return NextResponse.json({
      success: true,
      data: saved,
      message: `Product "${saved.name}" saved and public storefront caches revalidated.`,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, message: 'Product ID is required.' }, { status: 400 });
    }

    const deleted = await CatalogueService.deleteProduct(id);
    return NextResponse.json({
      success: deleted,
      message: deleted ? 'Product deleted and public caches revalidated.' : 'Product not found.',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

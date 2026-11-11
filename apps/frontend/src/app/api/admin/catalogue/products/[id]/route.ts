import { NextResponse } from 'next/server';
import { CatalogueService } from '@/lib/catalogue-service';
import { devDb } from '@/lib/dev-db';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = devDb.getProductWithDetails(id);
  if (!product) {
    return NextResponse.json(
      { success: false, message: 'Product not found', error: 'Product not found' },
      { status: 404 }
    );
  }
  return NextResponse.json({ success: true, data: product });
}

async function handleUpdateById(
  request: Request,
  params: Promise<{ id: string }>
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const existing = devDb.getProductById(id) || devDb.getProductWithDetails(id);

    const mergedPayload = {
      ...(existing || {}),
      ...body,
      id,
      name: body.name || existing?.name || 'Product',
      sku: body.sku || existing?.sku || `SKU-${id}`,
    };

    const saved = await CatalogueService.saveProduct(mergedPayload);
    const enriched = devDb.getProductWithDetails(saved.id) || saved;

    return NextResponse.json({
      success: true,
      data: enriched,
      message: `Product "${saved.name}" updated successfully.`,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: err?.message || 'Failed to update product',
        error: err?.message || 'Failed to update product',
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return handleUpdateById(request, params);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return handleUpdateById(request, params);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return handleUpdateById(request, params);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await CatalogueService.deleteProduct(id);
    return NextResponse.json({
      success: deleted,
      message: deleted
        ? 'Product deleted successfully.'
        : 'Product not found.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Failed to delete product' },
      { status: 500 }
    );
  }
}

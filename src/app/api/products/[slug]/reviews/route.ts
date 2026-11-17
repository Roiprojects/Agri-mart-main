import { NextRequest, NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';
import { CatalogueService } from '@/lib/catalogue-service';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const product = devDb.getProductBySlug(slug) || devDb.getProductById(slug);
  if (!product) {
    return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
  }
  const reviews = devDb.getProductReviews(product.id);
  return NextResponse.json({
    success: true,
    allowCustomerReviews:
      product.allowCustomerReviews !== undefined ? Boolean(product.allowCustomerReviews) : true,
    data: reviews,
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const product = devDb.getProductBySlug(slug) || devDb.getProductById(slug);

    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    const allowed =
      product.allowCustomerReviews !== undefined ? Boolean(product.allowCustomerReviews) : true;
    if (!allowed) {
      return NextResponse.json(
        { success: false, message: 'Customer reviews and ratings are disabled for this product.' },
        { status: 403 }
      );
    }

    const rating = Math.min(5, Math.max(1, Number(body.rating) || 5));
    const title = String(body.title || '').trim();
    const comment = String(body.comment || '').trim();
    const customerName = String(body.customerName || 'Verified Farmer').trim() || 'Verified Farmer';

    if (!title || !comment) {
      return NextResponse.json(
        { success: false, message: 'Please provide both a review title/quality summary and your comments.' },
        { status: 400 }
      );
    }

    const created = await CatalogueService.addProductReview({
      productId: product.id,
      userId: body.userId || 'usr-customer',
      customerName,
      rating,
      title,
      comment,
      status: 'APPROVED',
      verifiedPurchase: true,
    });

    return NextResponse.json({
      success: true,
      data: created,
      message: 'Thank you! Your rating and review have been submitted.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Failed to submit review' },
      { status: 500 }
    );
  }
}

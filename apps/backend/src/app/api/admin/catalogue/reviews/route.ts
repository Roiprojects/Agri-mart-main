import { NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

export async function GET() {
  try {
    const reviews = (devDb as any).data?.reviews || [];
    const products = devDb.getProducts({ onlyPublished: false });
    const users = (devDb as any).data?.users || [];

    const enriched = reviews.map((r: any) => {
      const product = products.find((p) => p.id === r.productId);
      const user = users.find((u: any) => u.id === r.userId);
      return {
        ...r,
        productName: product?.name || 'Agri Product',
        userMobile: user?.mobile || '',
      };
    });

    return NextResponse.json({ success: true, data: enriched });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const reviews = (devDb as any).data?.reviews || [];
    const review = reviews.find((r: any) => r.id === body.id);
    if (!review) {
      return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 });
    }
    review.status = body.status;
    try { (devDb as any).save?.(); } catch {}
    return NextResponse.json({ success: true, data: review });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

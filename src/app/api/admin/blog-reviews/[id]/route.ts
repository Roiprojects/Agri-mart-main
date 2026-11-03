import { NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';
import { revalidateFrontendPath } from '@/lib/revalidation-dispatcher';

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ success: false, message: 'Status must be APPROVED or REJECTED' }, { status: 400 });
    }

    const updated = devDb.moderateBlogReview(id, status);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Review not found' }, { status: 404 });
    }

    // Revalidate frontend article path
    try {
      await revalidateFrontendPath(`/blog/${updated.articleSlug}`);
    } catch {
      // ignore sync err in dev
    }

    return NextResponse.json({
      success: true,
      message: `Review marked as ${status}.`,
      data: updated,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

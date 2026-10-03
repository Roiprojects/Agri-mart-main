import { NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const slug = searchParams.get('slug');

  let reviews = devDb.getBlogReviews(slug || undefined);
  if (status && status !== 'ALL') {
    reviews = reviews.filter((r) => r.status === status);
  }

  return NextResponse.json({
    success: true,
    count: reviews.length,
    data: reviews,
  });
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    if (Array.isArray(body.ids) && body.ids.length > 0) {
      const targetStatus = body.status || (body.action === 'disapprove' ? 'REJECTED' : 'APPROVED');
      const blogReviews = (devDb as any).data?.blogReviews || [];
      blogReviews.forEach((r: any) => {
        if (body.ids.includes(r.id)) {
          r.status = targetStatus;
        }
      });
      try { (devDb as any).save?.(); } catch {}
      return NextResponse.json({
        success: true,
        message: `Updated status to ${targetStatus} for ${body.ids.length} comment(s)`,
      });
    }

    if (body.id) {
      const updated = devDb.moderateBlogReview(body.id, body.status || 'APPROVED');
      return NextResponse.json({ success: true, data: updated });
    }

    return NextResponse.json({ success: false, error: 'Missing ID or IDs' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const queryIds = url.searchParams.get('ids');
    const singleId = url.searchParams.get('id');

    let targetIds: string[] = [];
    if (queryIds) {
      targetIds = queryIds.split(',').map((id) => id.trim()).filter(Boolean);
    } else if (singleId) {
      targetIds = [singleId.trim()];
    } else {
      try {
        const body = await request.json();
        if (Array.isArray(body.ids)) targetIds = body.ids;
        else if (body.id) targetIds = [body.id];
      } catch {}
    }

    if (targetIds.length === 0) {
      return NextResponse.json({ success: false, error: 'No IDs provided' }, { status: 400 });
    }

    (devDb as any).data.blogReviews = ((devDb as any).data?.blogReviews || []).filter(
      (r: any) => !targetIds.includes(r.id)
    );
    try { (devDb as any).save?.(); } catch {}

    return NextResponse.json({
      success: true,
      message: `Deleted ${targetIds.length} comment(s) successfully`,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

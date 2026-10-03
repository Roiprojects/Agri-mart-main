import { NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

const DEFAULT_REVIEWS = [
  {
    id: 'rev-screenshot-01',
    productId: 'prod-001',
    productName: 'Round Straw Bag',
    userId: 'usr-farmer-01',
    customerName: 'b7662095-d56e-489a-98df-b7f1c2cc0f5c',
    customerEmail: 'b7662095-d56e-489a-98df-b7f1c2cc0f5c',
    rating: 5,
    title: 'test3',
    comment: 'this is a review.',
    replyText: '',
    verifiedPurchase: true,
    status: 'APPROVED',
    createdAt: '2022-01-06T21:47:57.000Z',
  },
  {
    id: 'rev-screenshot-02',
    productId: 'prod-001',
    productName: 'Round Straw Bag',
    userId: 'usr-farmer-01',
    customerName: 'b7662095-d56e-489a-98df-b7f1c2cc0f5c',
    customerEmail: 'b7662095-d56e-489a-98df-b7f1c2cc0f5c',
    rating: 5,
    title: 'test',
    comment: 'test',
    replyText: '',
    verifiedPurchase: true,
    status: 'APPROVED',
    createdAt: '2022-01-06T21:39:56.000Z',
  },
  {
    id: 'rev-screenshot-03',
    productId: 'prod-001',
    productName: 'Round Straw Bag',
    userId: 'usr-farmer-01',
    customerName: 'b7662095-d56e-489a-98df-b7f1c2cc0f5c',
    customerEmail: 'b7662095-d56e-489a-98df-b7f1c2cc0f5c',
    rating: 5,
    title: 'plop',
    comment: 'plop',
    replyText: '',
    verifiedPurchase: true,
    status: 'APPROVED',
    createdAt: '2022-01-06T21:39:27.000Z',
  },
  {
    id: 'rev-agri-01',
    productId: 'prod-001',
    productName: 'AgriPro 7HP Heavy-Duty Multi-Speed Power Weeder',
    userId: 'usr-farmer-01',
    customerName: 'Ramesh Kumar Gowda (Mandya)',
    customerEmail: 'ramesh.gowda@gmail.com',
    rating: 5,
    title: 'Outstanding machine for sugarcane fields',
    comment: 'Weeded 4.5 acres of sugarcane in less than two days. Fuel consumption was around 0.85 litres per hour.',
    replyText: 'Thank you for sharing your experience! We are glad it helped your sugarcane farm.',
    verifiedPurchase: true,
    status: 'APPROVED',
    createdAt: '2022-01-05T14:20:10.000Z',
  },
  {
    id: 'rev-pending-01',
    productId: 'prod-002',
    productName: 'KisanKraft 16L Battery Sprayer with Double Motor',
    userId: 'usr-farmer-02',
    customerName: 'Ningappa Kamatar (Dharwad)',
    customerEmail: 'ningappa.k@outlook.com',
    rating: 4,
    title: 'Good battery backup but nozzle needs cleaning often',
    comment: 'The dual motor provides high pressure for cotton fields. However, the brass nozzle gets clogged if liquid is not filtered properly.',
    replyText: '',
    verifiedPurchase: true,
    status: 'PENDING',
    createdAt: '2022-01-04T10:15:30.000Z',
  },
  {
    id: 'rev-pending-02',
    productId: 'prod-003',
    productName: 'Bhoomi Sanjivani Organic Micro-Nutrient Bio-Fertilizer (5 Kg)',
    userId: 'usr-farmer-01',
    customerName: 'Suresh Patil (Belagavi)',
    customerEmail: 'suresh.patil@yahoo.in',
    rating: 3,
    title: 'Awaiting results after 1st soil application',
    comment: 'Applied last week to turmeric crop. Waiting for sprouting results before ordering the 25kg bulk sack.',
    replyText: '',
    verifiedPurchase: true,
    status: 'PENDING',
    createdAt: '2022-01-03T16:45:00.000Z',
  },
  {
    id: 'rev-rejected-01',
    productId: 'prod-004',
    productName: 'Neem-Guard 10000 PPM Certified Botanical Bio-Insecticide',
    userId: 'usr-bot-01',
    customerName: 'Spam Marketing Profile',
    customerEmail: 'promo@spambot.xyz',
    rating: 1,
    title: 'Free external promo discount link',
    comment: 'Click this external URL for coupon codes on unrelated shopping site. Not relevant to product.',
    replyText: 'Review rejected: promotional link spam violating guidelines.',
    verifiedPurchase: false,
    status: 'REJECTED',
    createdAt: '2022-01-02T08:12:00.000Z',
  },
];

function ensureSeedReviews() {
  if (!devDb.data.reviews || devDb.data.reviews.length === 0) {
    devDb.data.reviews = [...DEFAULT_REVIEWS];
    try { devDb.save?.(); } catch {}
  } else {
    // If screenshot reviews not found, prepend them
    const hasScreenshot = devDb.data.reviews.some((r: any) => r.id === 'rev-screenshot-01');
    if (!hasScreenshot) {
      devDb.data.reviews = [...DEFAULT_REVIEWS, ...devDb.data.reviews];
      try { devDb.save?.(); } catch {}
    }
  }
}

export async function GET(request: Request) {
  try {
    ensureSeedReviews();
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get('status');
    const searchParam = searchParams.get('search');

    const reviews = devDb.getReviews ? devDb.getReviews() : (devDb as any).data?.reviews || [];
    const products = devDb.getProducts({ onlyPublished: false });
    const users = (devDb as any).data?.users || [];

    let enriched = reviews.map((r: any) => {
      const product = products.find((p) => p.id === r.productId);
      const user = users.find((u: any) => u.id === r.userId);
      return {
        ...r,
        productName: r.productName || product?.name || 'Round Straw Bag',
        userMobile: user?.mobile || '',
        customerEmail: r.customerEmail || user?.email || r.customerName || 'customer@example.com',
        isApproved: r.status === 'APPROVED',
      };
    });

    if (statusParam && statusParam !== 'ALL') {
      enriched = enriched.filter((r) => r.status === statusParam);
    }

    if (searchParam) {
      const q = searchParam.toLowerCase();
      enriched = enriched.filter(
        (r) =>
          r.title?.toLowerCase().includes(q) ||
          r.comment?.toLowerCase().includes(q) ||
          r.productName?.toLowerCase().includes(q) ||
          r.customerName?.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({ success: true, data: enriched });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    ensureSeedReviews();
    const body = await request.json();

    // Bulk update by IDs
    if (Array.isArray(body.ids) && body.ids.length > 0) {
      let targetStatus: 'APPROVED' | 'PENDING' | 'REJECTED' = 'APPROVED';
      if (body.action === 'disapprove' || body.status === 'REJECTED') {
        targetStatus = 'REJECTED';
      } else if (body.action === 'pending' || body.status === 'PENDING') {
        targetStatus = 'PENDING';
      } else if (body.action === 'approve' || body.status === 'APPROVED') {
        targetStatus = 'APPROVED';
      }

      if (devDb.updateReviewStatus) {
        devDb.updateReviewStatus(body.ids, targetStatus);
      } else {
        const reviews = (devDb as any).data?.reviews || [];
        reviews.forEach((r: any) => {
          if (body.ids.includes(r.id)) {
            r.status = targetStatus;
          }
        });
        try { (devDb as any).save?.(); } catch {}
      }

      return NextResponse.json({
        success: true,
        message: `Updated status to ${targetStatus} for ${body.ids.length} review(s)`,
      });
    }

    // Single review update
    if (!body.id) {
      return NextResponse.json({ success: false, error: 'Review ID is required' }, { status: 400 });
    }

    const reviews = (devDb as any).data?.reviews || [];
    const review = reviews.find((r: any) => r.id === body.id);
    if (!review) {
      return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 });
    }

    if (body.title !== undefined) review.title = body.title;
    if (body.comment !== undefined) review.comment = body.comment;
    if (body.replyText !== undefined) review.replyText = body.replyText;
    if (body.rating !== undefined) review.rating = Number(body.rating);
    if (body.status !== undefined) review.status = body.status;
    if (body.isApproved !== undefined) {
      review.status = body.isApproved ? 'APPROVED' : 'REJECTED';
    }

    try { (devDb as any).save?.(); } catch {}

    return NextResponse.json({
      success: true,
      data: {
        ...review,
        isApproved: review.status === 'APPROVED',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    ensureSeedReviews();
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
        if (Array.isArray(body.ids)) {
          targetIds = body.ids;
        } else if (body.id) {
          targetIds = [body.id];
        }
      } catch {
        // No json body
      }
    }

    if (targetIds.length === 0) {
      return NextResponse.json({ success: false, error: 'No IDs provided for deletion' }, { status: 400 });
    }

    if (devDb.deleteReviews) {
      devDb.deleteReviews(targetIds);
    } else {
      (devDb as any).data.reviews = ((devDb as any).data?.reviews || []).filter(
        (r: any) => !targetIds.includes(r.id)
      );
      try { (devDb as any).save?.(); } catch {}
    }

    return NextResponse.json({
      success: true,
      message: `Deleted ${targetIds.length} review(s) successfully`,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    ensureSeedReviews();
    const body = await request.json();
    const newReview = devDb.saveReview ? devDb.saveReview(body) : body;
    return NextResponse.json({ success: true, data: newReview });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

interface Params {
  params: Promise<{ slug: string }>;
}

export async function GET(request: Request, { params }: Params) {
  const { slug } = await params;
  const reviews = devDb.getBlogReviews(slug).filter((r) => r.status === 'APPROVED');
  const count = reviews.length;
  const averageRating =
    count > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / count).toFixed(1) : '0.0';

  return NextResponse.json({
    success: true,
    count,
    averageRating: Number(averageRating),
    data: reviews,
  });
}

export async function POST(request: Request, { params }: Params) {
  try {
    const { slug } = await params;
    const body = await request.json();

    const { userName, userMobile, rating, comment } = body;

    if (!userName || typeof userName !== 'string' || userName.trim().length < 2) {
      return NextResponse.json({ success: false, message: 'Full name is required (at least 2 characters).' }, { status: 400 });
    }

    if (!userMobile || !/^\d{10}$/.test(userMobile.replace(/\D/g, ''))) {
      return NextResponse.json({ success: false, message: 'A valid 10-digit mobile number is required for farmer authentication.' }, { status: 400 });
    }

    const numericRating = Number(rating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return NextResponse.json({ success: false, message: 'Rating must be an integer between 1 and 5 stars.' }, { status: 400 });
    }

    if (!comment || typeof comment !== 'string' || comment.trim().length < 10) {
      return NextResponse.json({ success: false, message: 'Review comment must be at least 10 characters long.' }, { status: 400 });
    }

    const created = devDb.addBlogReview({
      articleSlug: slug,
      userName: userName.trim(),
      userMobile: userMobile.trim(),
      rating: numericRating,
      comment: comment.trim(),
    });

    return NextResponse.json({
      success: true,
      message: 'Review submitted successfully and queued for editorial moderation.',
      data: created,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

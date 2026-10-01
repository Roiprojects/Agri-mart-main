import { NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';
import { revalidateFrontendPath } from '@/lib/revalidation-dispatcher';

export async function GET() {
  const posts = devDb.getBlogPosts();
  return NextResponse.json({ success: true, count: posts.length, data: posts });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title || !body.slug) {
      return NextResponse.json({ success: false, message: 'Title and slug are required.' }, { status: 400 });
    }

    const saved = devDb.saveBlogPost(body);

    try {
      await revalidateFrontendPath('/blog');
      await revalidateFrontendPath(`/blog/${saved.slug}`);
    } catch {
      // ignore
    }

    return NextResponse.json({
      success: true,
      data: saved,
      message: `Blog article "${saved.title}" saved and revalidated.`,
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
      return NextResponse.json({ success: false, message: 'Post ID required' }, { status: 400 });
    }
    const data = (devDb as any).data;
    data.blogPosts = (data.blogPosts || []).filter((p: any) => p.id !== id);
    try { (devDb as any).save?.(); } catch {}
    try { await revalidateFrontendPath('/blog'); } catch {}
    return NextResponse.json({ success: true, message: 'Blog post deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

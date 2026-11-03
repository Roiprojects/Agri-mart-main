import { NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const topics = (devDb as any).data?.topics || [];
    const topic = topics.find((t: any) => t.id === id);
    if (!topic) {
      return NextResponse.json({ success: false, error: 'Topic not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: topic });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const topics = (devDb as any).data?.topics || [];
    const topic = topics.find((t: any) => t.id === id);
    if (!topic) {
      return NextResponse.json({ success: false, error: 'Topic not found' }, { status: 404 });
    }

    Object.assign(topic, body);
    try {
      (devDb as any).save?.();
    } catch (e) {}

    return NextResponse.json({ success: true, data: topic });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const topics = (devDb as any).data?.topics || [];
    const index = topics.findIndex((t: any) => t.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Topic not found' }, { status: 404 });
    }

    topics.splice(index, 1);
    try {
      (devDb as any).save?.();
    } catch (e) {}

    return NextResponse.json({ success: true, message: 'Topic deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

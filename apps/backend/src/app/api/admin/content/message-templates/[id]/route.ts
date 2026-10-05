import { NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const templates = (devDb as any).data?.messageTemplates || [];
    const template = templates.find((t: any) => t.id === id);
    if (!template) {
      return NextResponse.json({ success: false, error: 'Template not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: template });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const templates = (devDb as any).data?.messageTemplates || [];
    const template = templates.find((t: any) => t.id === id);
    if (!template) {
      return NextResponse.json({ success: false, error: 'Template not found' }, { status: 404 });
    }

    Object.assign(template, body);
    try {
      (devDb as any).save?.();
    } catch (e) {}

    return NextResponse.json({ success: true, data: template });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const templates = (devDb as any).data?.messageTemplates || [];
    const index = templates.findIndex((t: any) => t.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Template not found' }, { status: 404 });
    }

    templates.splice(index, 1);
    try {
      (devDb as any).save?.();
    } catch (e) {}

    return NextResponse.json({ success: true, message: 'Template deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';
import { initialMessageTemplates } from '../route';

function getTemplates() {
  if (!(devDb as any).data) {
    (devDb as any).data = {};
  }
  if (!(devDb as any).data.messageTemplates || (devDb as any).data.messageTemplates.length === 0) {
    (devDb as any).data.messageTemplates = [...initialMessageTemplates];
    try {
      (devDb as any).save?.();
    } catch (e) {}
  }
  return (devDb as any).data.messageTemplates;
}

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const templates = getTemplates();
    const template = templates.find((t: any) => t.id === id || t.name.toLowerCase() === id.toLowerCase());
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
    const templates = getTemplates();
    const template = templates.find((t: any) => t.id === id || t.name.toLowerCase() === id.toLowerCase());
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
    const templates = getTemplates();
    const index = templates.findIndex((t: any) => t.id === id || t.name.toLowerCase() === id.toLowerCase());
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

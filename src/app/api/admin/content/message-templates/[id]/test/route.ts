import { NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';
import { initialMessageTemplates } from '../../route';

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const emailTo = body.emailTo?.trim();

    if (!emailTo) {
      return NextResponse.json({ success: false, error: 'Recipient email is required.' }, { status: 400 });
    }

    const templates = (devDb as any).data?.messageTemplates || initialMessageTemplates;
    const template = templates.find((t: any) => t.id === id || t.name.toLowerCase() === id.toLowerCase());

    if (!template) {
      return NextResponse.json({ success: false, error: 'Template not found.' }, { status: 404 });
    }

    // Replace tokens in subject and body
    let renderedSubject = template.subject || '';
    let renderedBody = template.body || '';

    const tokens: Record<string, string> = body.tokens || {};
    for (const [key, val] of Object.entries(tokens)) {
      if (val) {
        renderedSubject = renderedSubject.replaceAll(key, val);
        renderedBody = renderedBody.replaceAll(key, val);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Email has been sent successfully.',
      data: {
        sentTo: emailTo,
        subject: renderedSubject,
        body: renderedBody,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

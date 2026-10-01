import { NextRequest, NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

export async function GET(request: NextRequest) {
  try {
    const integrations = devDb.getIntegrations();
    return NextResponse.json({
      success: true,
      integrations,
      summary: {
        total: integrations.length,
        active: integrations.filter((i) => i.status === 'SANDBOX_ACTIVE').length,
        pending: integrations.filter((i) => i.status === 'PENDING_PRODUCTION_KEY').length,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { integrationId } = body;

    if (!integrationId) {
      return NextResponse.json({ success: false, error: 'integrationId is required' }, { status: 400 });
    }

    const result = devDb.testIntegrationPing(integrationId);
    return NextResponse.json(result, { status: result.success ? 200 : 404 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

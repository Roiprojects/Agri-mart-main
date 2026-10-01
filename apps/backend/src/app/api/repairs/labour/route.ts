import { NextRequest, NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

export async function GET(request: NextRequest) {
  try {
    const catalogue = devDb.getLabourCatalogue();
    return NextResponse.json({
      success: true,
      count: catalogue.length,
      catalogue,
    });
  } catch (error: any) {
    console.error('[API_REPAIRS_LABOUR_GET_ERROR]', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, standardHours, baseRatePerHour, name, category } = body;
    if (!id) return NextResponse.json({ success: false, message: 'id is required' }, { status: 400 });

    const updated = devDb.updateLabourOperation(id, {
      standardHours,
      baseRatePerHour,
      name,
      category,
    });

    return NextResponse.json({ success: true, labourOperation: updated, message: 'Labour operation updated' });
  } catch (error: any) {
    console.error('[API_REPAIRS_LABOUR_PATCH_ERROR]', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

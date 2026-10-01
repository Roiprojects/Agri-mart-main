import { NextRequest, NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const farmerId = searchParams.get('farmerId');

    if (farmerId) {
      const profile = devDb.getFarmerProfileById(farmerId);
      if (!profile) {
        return NextResponse.json({ success: false, error: 'Farmer profile not found' }, { status: 404 });
      }
      const usage = devDb.getProductUsageLogs(profile.id);
      const followUps = devDb.getAgronomyFollowUps().filter((f) => f.farmerProfileId === profile.id);
      const orders = devDb.getOrders(profile.userId).map((o) => devDb.getOrderWithDetails(o.id));

      return NextResponse.json({
        success: true,
        profile,
        usage,
        followUps,
        orders,
      });
    }

    const profiles = devDb.getFarmerProfiles();
    const followUps = devDb.getAgronomyFollowUps();
    const usage = devDb.getProductUsageLogs();
    const orders = devDb.getOrders().slice(0, 10).map((o) => devDb.getOrderWithDetails(o.id));

    return NextResponse.json({
      success: true,
      profiles,
      followUps,
      pendingCallsCount: followUps.filter((f) => f.status === 'SCHEDULED' || f.status === 'OVERDUE').length,
      usageLogs: usage,
      recentDemandOrders: orders,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, farmerProfileId, stage, followUpId, agronomistNotes } = body;

    if (action === 'UPDATE_STAGE') {
      if (!farmerProfileId || !stage) {
        return NextResponse.json({ success: false, error: 'farmerProfileId and stage are required' }, { status: 400 });
      }
      const updated = devDb.updateCropStage(farmerProfileId, stage, body.notes);
      if (!updated) return NextResponse.json({ success: false, error: 'Farmer not found' }, { status: 404 });
      return NextResponse.json({ success: true, profile: updated, message: `Crop stage updated to ${stage}` });
    }

    if (action === 'COMPLETE_FOLLOWUP') {
      if (!followUpId) {
        return NextResponse.json({ success: false, error: 'followUpId is required' }, { status: 400 });
      }
      const result = devDb.completeAgronomyFollowUp(followUpId, agronomistNotes || 'Advice provided by agronomist');
      return NextResponse.json(result, { status: result.success ? 200 : 400 });
    }

    return NextResponse.json({ success: false, error: `Unsupported action: ${action}` }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

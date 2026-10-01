import { NextRequest, NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const dealer = devDb.getDealerProfileById(id);
      if (!dealer) return NextResponse.json({ success: false, message: 'Dealer not found' }, { status: 404 });
      return NextResponse.json({ success: true, dealer });
    }

    const dealers = devDb.getDealerProfiles();
    const totalNetworkSales = dealers.reduce((sum, d) => sum + d.mtdGrossSales, 0);
    const totalNetDeliveredSales = dealers.reduce((sum, d) => sum + d.mtdDeliveredSales, 0);
    const totalCommissionEarned = dealers.reduce((sum, d) => sum + d.totalEarnedCommission, 0);
    const totalPendingPayouts = dealers.reduce((sum, d) => sum + d.pendingPayoutBalance, 0);

    return NextResponse.json({
      success: true,
      count: dealers.length,
      dealers,
      metrics: {
        totalNetworkSales,
        totalNetDeliveredSales,
        totalCommissionEarned,
        totalPendingPayouts,
      },
    });
  } catch (error: any) {
    console.error('[API_FINANCE_DEALERS_GET_ERROR]', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { dealerId, monthlyTarget, user } = body;

    if (!dealerId || monthlyTarget === undefined) {
      return NextResponse.json({ success: false, message: 'dealerId and monthlyTarget are required' }, { status: 400 });
    }

    const updated = devDb.updateDealerTarget(dealerId, Number(monthlyTarget), user || 'Finance Admin');
    return NextResponse.json({
      success: true,
      dealer: updated,
      message: `Sales target updated for ${updated.businessName} to ₹${Number(monthlyTarget).toLocaleString('en-IN')}`,
    });
  } catch (error: any) {
    console.error('[API_FINANCE_DEALERS_PATCH_ERROR]', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

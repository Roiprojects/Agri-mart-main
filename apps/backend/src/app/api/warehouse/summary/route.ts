import { NextRequest, NextResponse } from 'next/server';
import { getFullPortalState } from '@/lib/warehouse-portal-store';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locationId = searchParams.get('locationId') || 'ALL';
    const state = getFullPortalState();

    // Compute dynamic notification counts from live store data
    let incomingCount = 0;
    for (const t of state.transfers || []) {
      for (const g of t.groups || []) {
        if (locationId !== 'ALL' && g.destinationId !== locationId) continue;
        if (['IN_TRANSIT', 'PARTIAL_RECEIPT', 'PENDING_SIGNED_COPY'].includes(g.status)) {
          incomingCount++;
        }
      }
    }

    const ordersDispatchCount = (state.orders || []).length;

    const deliveriesCount = (state.orders || []).filter((o: any) => {
      if (!o.fulfillment?.franchiseeId) return false;
      if (locationId !== 'ALL' && o.fulfillment.franchiseeId !== locationId) return false;
      return true;
    }).length;

    const exceptionsCount = (state.exceptions || []).filter((e: any) => {
      if (e.status === 'RESOLVED') return false;
      if (locationId !== 'ALL' && e.locationId && e.locationId !== locationId) return false;
      return true;
    }).length;

    return NextResponse.json({
      success: true,
      counts: {
        locations: (state.warehouses?.length || 0) + (state.franchisees?.length || 0),
        stockVariants: state.catalogVariants?.length || 0,
        transfers: state.transfers?.length || 0,
        incoming: incomingCount,
        ordersDispatch: ordersDispatchCount,
        deliveries: deliveriesCount,
        exceptions: exceptionsCount,
      },
      warehouses: (state.warehouses || []).map((w: any) => ({
        id: w.id,
        name: w.name,
        code: w.code,
        tier: w.tier,
      })),
      franchisees: (state.franchisees || []).map((f: any) => ({
        id: f.id,
        name: f.name,
        code: f.code,
      })),
      staffUsers: (state.staffUsers || []).map((u: any) => ({
        id: u.id,
        name: u.name,
        status: u.status,
        roles: (u.assignments || []).flatMap((a: any) => a.roles || []),
      })),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to load WMS summary' },
      { status: 500 }
    );
  }
}

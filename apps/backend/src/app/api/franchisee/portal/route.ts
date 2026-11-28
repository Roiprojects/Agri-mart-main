import { NextRequest, NextResponse } from 'next/server';
import {
  getFranchiseePortalState,
  getLocationName,
  readPortalDb,
  writePortalDb,
} from '@/lib/warehouse-portal-store';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const franchiseeId = searchParams.get('franchiseeId');
    const db = readPortalDb();

    if (!franchiseeId) {
      // Return active franchisee login directory (without exposing passwords)
      const directory = (db.staffUsers || [])
        .filter((u) => u.status === 'ACTIVE' && u.assignments?.some((a) => a.locationKind === 'FRANCHISEE'))
        .map((u) => {
          const frAssignment = u.assignments.find((a) => a.locationKind === 'FRANCHISEE');
          const fr = db.franchisees.find((f) => f.id === frAssignment?.locationId);
          return {
            staffName: u.name,
            loginId: u.loginId || u.email || u.mobile,
            franchiseeName: fr?.name || frAssignment?.locationId,
          };
        });
      return NextResponse.json({ success: true, directory });
    }

    const state = getFranchiseePortalState(franchiseeId);
    return NextResponse.json({ success: true, ...state });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;
    const db = readPortalDb();
    const now = new Date().toISOString();

    if (action === 'LOGIN') {
      const loginInput = String(body.loginId || '').trim().toLowerCase();
      const passwordInput = String(body.password || '').trim();
      if (!loginInput || !passwordInput) {
        return NextResponse.json({ success: false, error: 'User ID and Password are required' }, { status: 400 });
      }

      const staff = (db.staffUsers || []).find((u) => {
        if (u.status !== 'ACTIVE') return false;
        const matchesId =
          (u.loginId || '').toLowerCase() === loginInput ||
          (u.email || '').toLowerCase() === loginInput ||
          (u.mobile || '').toLowerCase() === loginInput;
        const expectedPass = u.password || 'franchisee@123';
        return matchesId && expectedPass === passwordInput;
      });

      if (!staff) {
        return NextResponse.json({ success: false, error: 'Invalid User ID or Password' }, { status: 401 });
      }

      const franchiseeAssignments = (staff.assignments || []).filter((a) => a.locationKind === 'FRANCHISEE');
      if (franchiseeAssignments.length === 0) {
        return NextResponse.json(
          { success: false, error: 'This user does not have a Franchisee profile assigned.' },
          { status: 403 }
        );
      }

      const assignedFranchisees = franchiseeAssignments
        .map((a) => db.franchisees.find((f) => f.id === a.locationId))
        .filter(Boolean);

      return NextResponse.json({
        success: true,
        staff: {
          id: staff.id,
          name: staff.name,
          email: staff.email,
          mobile: staff.mobile,
          roles: franchiseeAssignments.flatMap((a) => a.roles),
        },
        assignedFranchisees,
        activeFranchisee: assignedFranchisees[0],
      });
    }

    if (action === 'CREATE_STOCK_REQUEST') {
      const { franchiseeId, targetWarehouseId, requestedByUserId, requestedByName, items, notes } = body;
      if (!franchiseeId || !targetWarehouseId || !Array.isArray(items) || items.length === 0) {
        return NextResponse.json(
          { success: false, error: 'franchiseeId, targetWarehouseId, and at least one product are required' },
          { status: 400 }
        );
      }

      if (!db.stockRequests) db.stockRequests = [];
      const requestNumber = `REQ-${new Date().getFullYear()}-${String(db.stockRequests.length + 1).padStart(4, '0')}`;
      const newReq = {
        id: `req-${Date.now()}`,
        requestNumber,
        franchiseeId,
        franchiseeName: getLocationName(db, franchiseeId),
        targetWarehouseId,
        targetWarehouseName: getLocationName(db, targetWarehouseId),
        requestedByUserId: requestedByUserId || 'franchisee-agent',
        requestedByName: requestedByName || 'Franchisee Agent',
        items: items.map((it: any) => ({
          productId: it.productId,
          variantId: it.variantId,
          productName: it.productName,
          variantName: it.variantName || 'Standard',
          sku: it.sku || '',
          requestedQty: Math.max(1, Number(it.requestedQty) || 1),
        })),
        notes: notes || '',
        status: 'PENDING' as const,
        createdAt: now,
        updatedAt: now,
      };

      db.stockRequests.unshift(newReq);
      writePortalDb(db);
      return NextResponse.json({
        success: true,
        message: `Stock request ${requestNumber} sent to ${newReq.targetWarehouseName}.`,
        request: newReq,
      });
    }

    return NextResponse.json({ success: false, error: `Unsupported action: ${action}` }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

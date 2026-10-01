import { NextRequest, NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

export async function GET(request: NextRequest) {
  try {
    const claims = devDb.getWarrantyClaims();
    const escalated = claims.filter((c) => c.status === 'ESCALATED_TO_HQ' || c.isEscalatedToHQ);
    const approved = claims.filter((c) => c.status === 'APPROVED');

    return NextResponse.json({
      success: true,
      count: claims.length,
      claims,
      escalatedCount: escalated.length,
      approvedCount: approved.length,
    });
  } catch (error: any) {
    console.error('[API_REPAIRS_WARRANTY_GET_ERROR]', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'CREATE_CLAIM') {
      const { jobCardId, jobCardNumber, dealerId, dealerName, equipmentSerial, equipmentModel, claimAmount, failureDescription, partsReplaced } = body.data || {};
      if (!jobCardId || !claimAmount || !failureDescription) {
        return NextResponse.json({ success: false, message: 'jobCardId, claimAmount, and failureDescription are required' }, { status: 400 });
      }

      const newClaim = devDb.createWarrantyClaim({
        jobCardId,
        jobCardNumber: jobCardNumber || 'JC-2026-TBD',
        dealerId: dealerId || 'dlr-01',
        dealerName: dealerName || 'Patil Kisan Seva Kendra',
        equipmentSerial: equipmentSerial || 'SN-TBD',
        equipmentModel: equipmentModel || 'Equipment',
        claimAmount: Number(claimAmount),
        failureDescription,
        partsReplaced: partsReplaced || [],
        status: 'SUBMITTED',
        isEscalatedToHQ: false,
      });

      return NextResponse.json({ success: true, claim: newClaim, message: `Warranty Claim ${newClaim.claimNumber} filed` });
    }

    if (action === 'ESCALATE_HQ') {
      const { claimId, reason, user } = body;
      if (!claimId || !reason) {
        return NextResponse.json({ success: false, message: 'claimId and reason are required' }, { status: 400 });
      }

      const claim = devDb.escalateWarrantyClaimToHQ(claimId, reason, user || 'Dealer Workshop Manager');
      return NextResponse.json({ success: true, claim, message: `Claim ${claim.claimNumber} escalated to AgriMart Mega Central HQ` });
    }

    if (action === 'RESOLVE') {
      const { claimId, status, remarks, user } = body;
      if (!claimId || !status) {
        return NextResponse.json({ success: false, message: 'claimId and status are required' }, { status: 400 });
      }

      const claim = devDb.resolveWarrantyClaim(claimId, status, remarks || 'Processed by Central HQ Warranty Board', user || 'HQ Admin');
      return NextResponse.json({ success: true, claim, message: `Claim ${claim.claimNumber} marked as ${status}` });
    }

    return NextResponse.json({ success: false, message: `Unknown action: ${action}` }, { status: 400 });
  } catch (error: any) {
    console.error('[API_REPAIRS_WARRANTY_POST_ERROR]', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const executiveId = searchParams.get('executiveId');
    const stage = searchParams.get('stage');

    let leads = devDb.getSalesLeads();
    if (executiveId && executiveId !== 'all') {
      leads = leads.filter((l) => l.assignedExecutiveId === executiveId);
    }
    if (stage && stage !== 'all') {
      leads = leads.filter((l) => l.stage === stage);
    }

    const visits = devDb.getSalesVisits();
    const targets = devDb.getSalesTargets();

    return NextResponse.json({
      success: true,
      count: leads.length,
      leads,
      visits,
      targets,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'UPDATE_STAGE') {
      const { leadId, stage, remarks, actionType } = body;
      if (!leadId || !stage) {
        return NextResponse.json({ success: false, error: 'leadId and stage are required' }, { status: 400 });
      }
      const result = devDb.updateLeadStage(leadId, stage, remarks || `Moved to ${stage}`, actionType || 'CALL');
      return NextResponse.json(result, { status: result.success ? 200 : 400 });
    }

    if (action === 'CREATE_LEAD') {
      const { customerName, mobile, village, taluk, district, leadSource, estimatedValue, assignedExecutiveId, assignedExecutiveName, remarks, aiHistoryId, aiDiagnosisSummary, interestedCategory, interestedProductTitle } = body;
      if (!customerName || !mobile) {
        return NextResponse.json({ success: false, error: 'customerName and mobile are required' }, { status: 400 });
      }
      const newLead = devDb.createSalesLead({
        customerName,
        mobile,
        village: village || 'Mandya Rural',
        taluk: taluk || 'Mandya',
        district: district || 'Mandya',
        leadSource: leadSource || 'WEBSITE',
        aiHistoryId,
        aiDiagnosisSummary,
        interestedCategory,
        interestedProductTitle,
        estimatedValue: Number(estimatedValue) || 10000,
        stage: 'NEW',
        assignedExecutiveId: assignedExecutiveId || 'exec-01',
        assignedExecutiveName: assignedExecutiveName || 'Sunil Kumar (Mandya Belt)',
        remarks: remarks || 'Fresh lead generated',
      });
      return NextResponse.json({ success: true, lead: newLead, message: 'Sales lead created successfully' });
    }

    if (action === 'LOG_VISIT') {
      const { leadId, leadNumber, farmerName, executiveId, executiveName, visitDate, gpsLatitude, gpsLongitude, cropObserved, acreage, visitSummary, outcome } = body;
      if (!leadId || !executiveName || !gpsLatitude || !gpsLongitude) {
        return NextResponse.json({ success: false, error: 'leadId, executiveName, and GPS coordinates are required' }, { status: 400 });
      }
      const visit = devDb.logSalesVisit({
        leadId,
        leadNumber: leadNumber || 'SL-2026-UNKNOWN',
        farmerName: farmerName || 'Farmer',
        executiveId: executiveId || 'exec-01',
        executiveName,
        visitDate: visitDate || new Date().toISOString().split('T')[0],
        gpsLatitude: Number(gpsLatitude),
        gpsLongitude: Number(gpsLongitude),
        cropObserved: cropObserved || 'Mixed Cropping',
        acreage: Number(acreage) || 5.0,
        visitSummary: visitSummary || 'Farm visit completed',
        outcome: outcome || 'FOLLOW_UP_REQUIRED',
      });
      return NextResponse.json({ success: true, visit, message: 'Farm visit logged with GPS coordinates' });
    }

    return NextResponse.json({ success: false, error: `Unsupported action: ${action}` }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

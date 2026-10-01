import { NextRequest, NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';
import { RepairStage } from '@/lib/repair-finance-types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as RepairStage | null;
    const dealerId = searchParams.get('dealerId') || undefined;
    const search = searchParams.get('search') || undefined;
    const id = searchParams.get('id');

    if (id) {
      const jc = devDb.getJobCardById(id);
      if (!jc) return NextResponse.json({ success: false, message: 'Job card not found' }, { status: 404 });
      return NextResponse.json({ success: true, jobCard: jc });
    }

    const jobCards = devDb.getJobCards({
      status: status || undefined,
      dealerId,
      search,
    });

    const all = devDb.getJobCards();
    const stageCounts: Record<string, number> = {};
    for (const jc of all) {
      stageCounts[jc.status] = (stageCounts[jc.status] || 0) + 1;
    }

    return NextResponse.json({
      success: true,
      count: jobCards.length,
      jobCards,
      stageCounts,
    });
  } catch (error: any) {
    console.error('[API_REPAIRS_JOB_CARDS_GET_ERROR]', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'CREATE') {
      const { customerName, equipmentModel, serialNumber, ...rest } = body.data || {};
      if (!customerName || !equipmentModel || !serialNumber) {
        return NextResponse.json(
          { success: false, message: 'customerName, equipmentModel, and serialNumber are required' },
          { status: 400 }
        );
      }
      const newJc = devDb.createJobCard({ customerName, equipmentModel, serialNumber, ...rest });
      return NextResponse.json({ success: true, jobCard: newJc, message: `Job Card ${newJc.jobCardNumber} created` });
    }

    if (action === 'ADVANCE_STAGE') {
      const { id, targetStage } = body;
      if (!id) return NextResponse.json({ success: false, message: 'id is required' }, { status: 400 });
      const res = devDb.advanceRepairStage(id, targetStage);
      if (!res.success) {
        return NextResponse.json({ success: false, message: res.message }, { status: 422 });
      }
      return NextResponse.json({ success: true, jobCard: res.jobCard, message: res.message });
    }

    if (action === 'UPDATE_DIAGNOSIS') {
      const { id, diagnosisNotes, rootCauseCategory, parts, labour, discountAmount } = body;
      if (!id) return NextResponse.json({ success: false, message: 'id is required' }, { status: 400 });
      const updated = devDb.updateDiagnosisAndEstimates(id, {
        diagnosisNotes,
        rootCauseCategory,
        parts: parts || [],
        labour: labour || [],
        discountAmount,
      });
      return NextResponse.json({ success: true, jobCard: updated, message: 'Diagnosis & estimate updated' });
    }

    if (action === 'UPDATE_ESTIMATE_DECISION') {
      const { id, decision, customerSignature, rejectionReason, approvedPartIds, approvedLabourIds } = body;
      if (!id || !decision) {
        return NextResponse.json({ success: false, message: 'id and decision are required' }, { status: 400 });
      }
      const updated = devDb.updateEstimateDecision(id, decision, {
        customerSignature,
        rejectionReason,
        approvedPartIds,
        approvedLabourIds,
      });
      return NextResponse.json({ success: true, jobCard: updated, message: `Estimate decision marked as ${decision}` });
    }

    if (action === 'ASSIGN_TECH_BAY') {
      const { id, technicianId, technicianName, bayNumber, estimatedHours } = body;
      if (!id || !technicianName || !bayNumber) {
        return NextResponse.json(
          { success: false, message: 'id, technicianName, and bayNumber are required' },
          { status: 400 }
        );
      }
      const updated = devDb.assignTechnicianAndBay(id, technicianId || 'tech-01', technicianName, bayNumber, estimatedHours || 2.0);
      return NextResponse.json({ success: true, jobCard: updated, message: 'Technician and Service Bay assigned' });
    }

    if (action === 'QUALITY_CHECK') {
      const { id, qcData } = body;
      if (!id || !qcData) {
        return NextResponse.json({ success: false, message: 'id and qcData are required' }, { status: 400 });
      }
      const updated = devDb.completeQualityInspection(id, qcData);
      return NextResponse.json({ success: true, jobCard: updated, message: 'Quality Inspection logged' });
    }

    if (action === 'GENERATE_INVOICE') {
      const { id, discountAmount, paymentMode, paymentStatus, transactionRef } = body;
      if (!id) return NextResponse.json({ success: false, message: 'id is required' }, { status: 400 });
      const updated = devDb.generateJobCardInvoice(id, {
        discountAmount: discountAmount || 0,
        paymentMode: paymentMode || 'UPI',
        paymentStatus: paymentStatus || 'PAID',
        transactionRef,
      });
      return NextResponse.json({ success: true, jobCard: updated, message: 'GST Workshop invoice generated' });
    }

    if (action === 'COMPLETE_DELIVERY') {
      const { id, deliveredTo, customerSignature, nextServiceDueDays } = body;
      if (!id || !deliveredTo) {
        return NextResponse.json({ success: false, message: 'id and deliveredTo are required' }, { status: 400 });
      }
      const updated = devDb.completeDelivery(id, {
        deliveredTo,
        customerSignature,
        nextServiceDueDays,
      });
      return NextResponse.json({ success: true, jobCard: updated, message: 'Machine delivered and next service scheduled' });
    }

    return NextResponse.json({ success: false, message: `Unknown action: ${action}` }, { status: 400 });
  } catch (error: any) {
    console.error('[API_REPAIRS_JOB_CARDS_POST_ERROR]', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

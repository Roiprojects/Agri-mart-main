import { NextRequest, NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

export async function GET(request: NextRequest) {
  try {
    const vouchers = devDb.getPayoutRecords();
    const auditLogs = devDb.getFinanceAuditLogs();

    return NextResponse.json({
      success: true,
      disclaimer:
        'Recording a payout voucher in the AgriMart portal registers an authorized finance disbursement mandate. It does NOT imply that an actual bank transfer has completed. Bank transfers require external corporate banking authorization (NEFT/RTGS/CMS batch file).',
      count: vouchers.length,
      vouchers,
      auditLogs,
    });
  } catch (error: any) {
    console.error('[API_FINANCE_PAYOUTS_GET_ERROR]', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'RECORD_VOUCHER') {
      const { dealerId, period, amount, recordedBy, breakdown } = body;
      if (!dealerId || !amount) {
        return NextResponse.json({ success: false, message: 'dealerId and amount are required' }, { status: 400 });
      }

      const voucher = devDb.recordPayoutVoucher({
        dealerId,
        period: period || '2026-03 Incentive Run',
        amount: Number(amount),
        recordedBy: recordedBy || 'Finance Accounts Executive',
        breakdown,
      });

      return NextResponse.json({
        success: true,
        voucher,
        message: `Payout Voucher ${voucher.voucherNumber} recorded. Disclaimer: Voucher recorded for Treasury release; does not imply bank transfer execution.`,
      });
    }

    if (action === 'APPROVE_VOUCHER') {
      const { voucherId, approver, bankBatchRef } = body;
      if (!voucherId) {
        return NextResponse.json({ success: false, message: 'voucherId is required' }, { status: 400 });
      }

      const voucher = devDb.approvePayoutVoucher(voucherId, approver || 'Finance Controller', bankBatchRef);
      return NextResponse.json({
        success: true,
        voucher,
        message: `Payout Voucher ${voucher.voucherNumber} approved by Finance Controller`,
      });
    }

    if (action === 'SETTLE_EXTERNAL') {
      const { voucherId, bankBatchRef } = body;
      if (!voucherId || !bankBatchRef) {
        return NextResponse.json({ success: false, message: 'voucherId and bankBatchRef are required' }, { status: 400 });
      }

      const voucher = devDb.markPayoutExternallySettled(voucherId, bankBatchRef);
      return NextResponse.json({
        success: true,
        voucher,
        message: `Payout Voucher ${voucher.voucherNumber} marked as settled externally via Bank Batch ${bankBatchRef}`,
      });
    }

    return NextResponse.json({ success: false, message: `Unknown action: ${action}` }, { status: 400 });
  } catch (error: any) {
    console.error('[API_FINANCE_PAYOUTS_POST_ERROR]', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

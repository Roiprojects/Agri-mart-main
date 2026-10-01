import { NextRequest, NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '2026-03';

    // Recalculate or retrieve commissions for period
    const targets = devDb.calculateDealerCommissions(period);
    const dealers = devDb.getDealerProfiles();

    return NextResponse.json({
      success: true,
      period,
      policy: {
        incentiveBase: 'Net Delivered Sales strictly (Gross Sales minus Refunds minus Cancelled Orders)',
        clawbackRule: 'Refunded or cancelled orders after commission cycle are clawed back against subsequent pending payout balances',
        tiers: [
          { tier: 'BRONZE', baseRate: '4.0%', bonusRate: '1.0%', minMonthlyTarget: '₹2,00,000' },
          { tier: 'SILVER', baseRate: '6.0%', bonusRate: '1.5%', minMonthlyTarget: '₹3,50,000' },
          { tier: 'GOLD', baseRate: '8.0%', bonusRate: '2.0%', minMonthlyTarget: '₹5,00,000' },
          { tier: 'PLATINUM', baseRate: '9.0%', bonusRate: '2.5%', minMonthlyTarget: '₹7,50,000' },
        ],
      },
      count: targets.length,
      targets,
      dealers,
    });
  } catch (error: any) {
    console.error('[API_FINANCE_COMMISSIONS_GET_ERROR]', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

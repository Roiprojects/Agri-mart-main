import { NextRequest, NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

export async function GET(request: NextRequest) {
  try {
    const parts = devDb.getSpareParts();
    const lowStockParts = parts.filter((p) => p.stockQuantity <= p.reorderLevel);

    return NextResponse.json({
      success: true,
      count: parts.length,
      parts,
      lowStockCount: lowStockParts.length,
      lowStockParts,
    });
  } catch (error: any) {
    console.error('[API_REPAIRS_INVENTORY_GET_ERROR]', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'STOCK_TRANSACTION') {
      const { partId, partNumber, partName, transactionType, quantity, sourceLocation, destinationLocation, reason, loggedBy } = body.data || {};
      if (!partId || !transactionType || !quantity) {
        return NextResponse.json({ success: false, message: 'partId, transactionType, and quantity are required' }, { status: 400 });
      }

      const tx = devDb.recordSparePartTransaction({
        partId,
        partNumber: partNumber || 'SP-GENERIC',
        partName: partName || 'Spare Part',
        transactionType,
        quantity: Number(quantity),
        sourceLocation: sourceLocation || 'Store',
        destinationLocation: destinationLocation || 'Service Bay',
        reason: reason || 'Inventory adjustment',
        loggedBy: loggedBy || 'Store Manager',
      });

      return NextResponse.json({ success: true, transaction: tx, message: 'Stock transaction recorded successfully' });
    }

    if (action === 'TRANSFER') {
      const { partId, quantity, fromLocation, toLocation, reason, user } = body;
      if (!partId || !quantity || !fromLocation || !toLocation) {
        return NextResponse.json(
          { success: false, message: 'partId, quantity, fromLocation, and toLocation are required' },
          { status: 400 }
        );
      }

      const tx = devDb.transferSpareParts(partId, Number(quantity), fromLocation, toLocation, reason || 'Inter-hub transfer', user || 'Store Admin');
      return NextResponse.json({ success: true, transaction: tx, message: 'Part transferred successfully' });
    }

    return NextResponse.json({ success: false, message: `Unknown action: ${action}` }, { status: 400 });
  } catch (error: any) {
    console.error('[API_REPAIRS_INVENTORY_POST_ERROR]', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

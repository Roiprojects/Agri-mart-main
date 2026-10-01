import { NextRequest, NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const warehouseId = searchParams.get('warehouseId') || 'wh-hubballi';

    const warehouses = devDb.getWarehouses();
    const currentWh = warehouses.find((w) => w.id === warehouseId) || warehouses[0];

    // Filter stocks for this warehouse
    const allProducts = devDb.getProducts();
    const stocks = devDb.getStockLedger(warehouseId);

    // Build current inventory report
    const inventory = allProducts.map((prod) => {
      const whStock = devDb.getWarehouseStocks(prod.id).find((s) => s.warehouseId === currentWh.id);
      const quantity = whStock ? whStock.quantity : 0;
      const reservedQuantity = whStock ? whStock.reservedQuantity : 0;
      const availableQuantity = Math.max(0, quantity - reservedQuantity);
      const reorderThreshold = whStock ? whStock.reorderThreshold : 5;
      const isLowStock = availableQuantity <= reorderThreshold;

      return {
        productId: prod.id,
        name: prod.name,
        nameKn: prod.nameKn,
        sku: prod.sku,
        price: prod.price,
        category: prod.categoryId,
        quantity,
        reservedQuantity,
        availableQuantity,
        reorderThreshold,
        isLowStock,
      };
    });

    const lowStockCount = inventory.filter((i) => i.isLowStock).length;

    return NextResponse.json({
      success: true,
      warehouse: currentWh,
      inventory,
      lowStockCount,
      recentLedger: stocks.slice(0, 20),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { warehouseId, productId, variantId, type, quantity, referenceId, notes, performedBy } = body;

    if (!warehouseId || !productId || !type || !quantity) {
      return NextResponse.json(
        { success: false, error: 'warehouseId, productId, type, and quantity are required' },
        { status: 400 }
      );
    }

    const result = devDb.processStockTransaction({
      warehouseId,
      productId,
      variantId,
      type,
      quantity: Number(quantity),
      referenceId,
      notes: notes || 'Manual warehouse inventory adjustment',
      performedBy: performedBy || 'Warehouse Manager',
    });

    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

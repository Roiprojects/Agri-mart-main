import { NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

export async function GET() {
  try {
    const data = (devDb as any).data;
    const stocks = data?.warehouseStocks || [];
    const warehouses = devDb.getWarehouses();
    const products = devDb.getProducts({ onlyPublished: false });

    const lowStock = stocks
      .filter((s: any) => s.quantity <= s.reorderThreshold)
      .map((s: any) => {
        const product = products.find((p) => p.id === s.productId);
        const warehouse = warehouses.find((w) => w.id === s.warehouseId);
        return {
          id: s.id,
          warehouseId: s.warehouseId,
          productId: s.productId,
          productName: product?.name || 'Agri Product',
          productSku: product?.sku || 'SKU-UNKNOWN',
          warehouseName: warehouse?.name || 'Hubballi Fulfillment Hub',
          quantity: s.quantity,
          reservedQuantity: s.reservedQuantity,
          reorderThreshold: s.reorderThreshold,
          shortage: Math.max(0, s.reorderThreshold - s.quantity),
          isCritical: s.quantity === 0,
        };
      })
      .sort((a: any, b: any) => a.quantity - b.quantity);

    return NextResponse.json({
      success: true,
      data: lowStock,
      criticalCount: lowStock.filter((s: any) => s.isCritical).length,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

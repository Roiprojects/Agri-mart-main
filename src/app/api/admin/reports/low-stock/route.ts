import { NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = (devDb as any).data;
    const stocks = data?.warehouseStocks || [];
    const warehouses = devDb.getWarehouses();
    const products = devDb.getProducts({ onlyPublished: false });

    const lowStockItems: any[] = [];
    const seenProductIds = new Set<string>();

    // Check all warehouse stock entries first, syncing threshold from product's minStockQuantity / lowStockQuantity
    for (const s of stocks) {
      const product = products.find((p) => p.id === s.productId);
      if (!product) continue;
      seenProductIds.add(product.id);

      const warehouse = warehouses.find((w) => w.id === s.warehouseId);
      const effectiveQty =
        (product as any).stockQuantity !== undefined
          ? Number((product as any).stockQuantity) || 0
          : Number(s.quantity) || 0;
      const effectiveMinStock = Math.max(
        1,
        Number(
          (product as any).minStockQuantity ??
            (product as any).lowStockQuantity ??
            s.reorderThreshold ??
            1
        ) || 1
      );

      if (effectiveQty <= effectiveMinStock) {
        lowStockItems.push({
          id: s.id,
          warehouseId: s.warehouseId,
          productId: s.productId,
          productName: product.name || 'Agri Product',
          productSku: product.sku || 'SKU-UNKNOWN',
          warehouseName: warehouse?.name || 'Hubballi Fulfillment Hub',
          quantity: effectiveQty,
          reservedQuantity: s.reservedQuantity || 0,
          reorderThreshold: effectiveMinStock,
          minStockQuantity: effectiveMinStock,
          lowStockQuantity: effectiveMinStock,
          shortage: Math.max(0, effectiveMinStock - effectiveQty),
          isCritical: effectiveQty === 0,
        });
      }
    }

    // Also check all remaining products that don't have a warehouseStocks entry
    for (const product of products) {
      if (seenProductIds.has(product.id)) continue;
      const detailed = devDb.getProductWithDetails(product.id);
      const effectiveQty =
        detailed?.stockQuantity !== undefined
          ? Number(detailed.stockQuantity) || 0
          : Number((product as any).stockQuantity ?? 0);
      const effectiveMinStock = Math.max(
        1,
        Number(
          (product as any).minStockQuantity ??
            (product as any).lowStockQuantity ??
            (product as any).minOrderQty ??
            1
        ) || 1
      );

      if (effectiveQty <= effectiveMinStock) {
        lowStockItems.push({
          id: `ls-${product.id}`,
          warehouseId: 'wh-hubballi',
          productId: product.id,
          productName: product.name || 'Agri Product',
          productSku: product.sku || 'SKU-UNKNOWN',
          warehouseName: 'Hubballi Fulfillment Hub',
          quantity: effectiveQty,
          reservedQuantity: 0,
          reorderThreshold: effectiveMinStock,
          minStockQuantity: effectiveMinStock,
          lowStockQuantity: effectiveMinStock,
          shortage: Math.max(0, effectiveMinStock - effectiveQty),
          isCritical: effectiveQty === 0,
        });
      }
    }

    lowStockItems.sort((a, b) => a.quantity - b.quantity);

    return NextResponse.json({
      success: true,
      data: lowStockItems,
      criticalCount: lowStockItems.filter((s) => s.isCritical).length,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

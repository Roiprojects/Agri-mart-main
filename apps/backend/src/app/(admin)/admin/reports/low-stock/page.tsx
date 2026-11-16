'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, PackageX, RefreshCw, ArrowRight } from 'lucide-react';
import { DataTable, Column } from '@/components/admin/DataTable';
import { mergeProductsWithOverrides } from '@/lib/admin-product-overrides';

interface LowStockItem {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  warehouseName: string;
  quantity: number;
  reservedQuantity: number;
  reorderThreshold: number;
  shortage: number;
  isCritical: boolean;
}

export default function LowStockReportPage() {
  const [items, setItems] = useState<LowStockItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLowStock = async () => {
    try {
      setLoading(true);
      const [lowRes, prodRes] = await Promise.all([
        fetch('/api/admin/reports/low-stock', { cache: 'no-store' }).then((r) => r.json()),
        fetch('/api/admin/catalogue/products', { cache: 'no-store' })
          .then((r) => r.json())
          .catch(() => ({ success: false, data: [] })),
      ]);

      const serverLow: LowStockItem[] = lowRes.success ? lowRes.data || [] : [];
      if (prodRes.success && Array.isArray(prodRes.data)) {
        const mergedProducts = mergeProductsWithOverrides(prodRes.data);
        const byProductId = new Map<string, LowStockItem>();
        serverLow.forEach((item) => byProductId.set(item.productId, item));

        // Ensure client overrides for stockQuantity and minStockQuantity are mapped accurately
        for (const p of mergedProducts as any[]) {
          const qty =
            p.stockQuantity !== undefined
              ? Number(p.stockQuantity) || 0
              : p.variants?.[0]?.stockQuantity !== undefined
              ? Number(p.variants[0].stockQuantity) || 0
              : 0;
          const minStock = Math.max(
            1,
            Number(p.minStockQuantity ?? p.lowStockQuantity ?? p.minOrderQty ?? 1) || 1
          );
          if (qty <= minStock) {
            const existing = byProductId.get(p.id);
            byProductId.set(p.id, {
              id: existing?.id || `ls-${p.id}`,
              productId: p.id,
              productName: p.name || existing?.productName || 'Agri Product',
              productSku: p.sku || existing?.productSku || 'SKU-UNKNOWN',
              warehouseName: existing?.warehouseName || 'Hubballi Fulfillment Hub',
              quantity: qty,
              reservedQuantity: existing?.reservedQuantity || 0,
              reorderThreshold: minStock,
              shortage: Math.max(0, minStock - qty),
              isCritical: qty === 0,
            });
          } else {
            byProductId.delete(p.id);
          }
        }
        setItems(Array.from(byProductId.values()).sort((a, b) => a.quantity - b.quantity));
      } else if (lowRes.success) {
        setItems(serverLow);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLowStock();
  }, []);

  const criticalCount = items.filter((i) => i.isCritical).length;

  const columns: Column<LowStockItem>[] = [
    {
      key: 'productName',
      header: 'Product Item',
      sortable: true,
      render: (row) => (
        <div>
          <div className="font-semibold text-slate-900">{row.productName}</div>
          <div className="text-xs text-slate-500 font-mono">SKU: {row.productSku}</div>
        </div>
      ),
    },
    {
      key: 'warehouseName',
      header: 'Fulfillment Node',
      sortable: true,
      render: (row) => (
        <span className="text-xs text-slate-700 font-medium">
          {row.warehouseName}
        </span>
      ),
    },
    {
      key: 'quantity',
      header: 'Available Stock',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <span
            className={`font-mono text-xs font-bold px-2 py-0.5 rounded border ${
              row.isCritical
                ? 'bg-red-50 text-red-700 border-red-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            {row.quantity} units
          </span>
          {row.isCritical && (
            <span className="text-[10px] font-bold uppercase text-red-600 animate-pulse">
              OUT OF STOCK
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'reorderThreshold',
      header: 'Minimum / Low Stock Qty',
      sortable: true,
      render: (row) => (
        <span className="text-xs font-mono text-slate-600">
          {row.reorderThreshold} units
        </span>
      ),
    },
    {
      key: 'shortage',
      header: 'Reorder Deficit',
      sortable: true,
      render: (row) => (
        <span className="text-xs font-mono font-bold text-red-600">
          +{row.shortage} units required
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-red-50 text-red-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Low Stock & Reorder Alerts</h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-red-50 text-red-700 border border-red-200">
              {items.length} Alerts
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automated dark warehouse replenishment triggers when inventory breaches the regional safety threshold.
          </p>
        </div>

        <button
          onClick={fetchLowStock}
          className="p-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-xs transition"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {criticalCount > 0 && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 flex items-center justify-between text-xs text-red-800 shadow-xs">
          <div className="flex items-center gap-2.5">
            <PackageX className="h-5 w-5 text-red-600 shrink-0" />
            <span>
              <strong>{criticalCount} items completely depleted!</strong> Customer orders routed to these regional dark warehouses will trigger automated split-shipment fallbacks.
            </span>
          </div>
          <Link
            href="/warehouse"
            className="inline-flex items-center gap-1 font-semibold text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg shadow-xs transition"
          >
            Fulfillment Slip Portal <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      )}

      <div className="rounded-xl bg-white border border-slate-200 shadow-xs p-4">
        <DataTable
          data={items}
          columns={columns}
          rowKey={(r) => r.id}
          searchPlaceholder="Filter shortage by product or warehouse..."
          searchKeys={['productName', 'productSku', 'warehouseName']}
          actions={(row) => (
            <Link
              href={`/admin/catalogue/products/${row.productId}/edit`}
              className="text-xs text-emerald-700 hover:underline font-semibold"
            >
              Edit Product
            </Link>
          )}
        />
      </div>
    </div>
  );
}

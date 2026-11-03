'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, PackageX, RefreshCw, ArrowRight } from 'lucide-react';
import { DataTable, Column } from '@/components/admin/DataTable';

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
      const res = await fetch('/api/admin/reports/low-stock');
      const json = await res.json();
      if (json.success) {
        setItems(json.data || []);
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
      header: 'Threshold Limit',
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

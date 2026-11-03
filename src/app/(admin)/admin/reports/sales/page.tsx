'use client';

import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, IndianRupee, ShoppingCart, RefreshCw } from 'lucide-react';
import { StatsCard } from '@/components/admin/StatsCard';
import { StatusBadge } from '@/components/admin/StatusBadge';

export default function SalesReportPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/orders');
      const json = await res.json();
      if (json.success) {
        const orders = json.data || [];
        const delivered = orders.filter((o: any) => o.status === 'DELIVERED');
        const grossDeliveredRevenue = delivered.reduce((acc: number, o: any) => acc + (o.totalAmount || 0), 0);
        const totalTaxCollected = delivered.reduce((acc: number, o: any) => acc + (o.taxAmount || 0), 0);

        // Group by Payment Method
        const paymentMethods: Record<string, { count: number; total: number }> = {};
        for (const o of orders) {
          const pm = o.paymentMethod || 'UPI';
          if (!paymentMethods[pm]) paymentMethods[pm] = { count: 0, total: 0 };
          paymentMethods[pm].count += 1;
          paymentMethods[pm].total += o.totalAmount || 0;
        }

        // Group by Status
        const statusBreakdown: Record<string, { count: number; total: number }> = {};
        for (const o of orders) {
          const s = o.status || 'PLACED';
          if (!statusBreakdown[s]) statusBreakdown[s] = { count: 0, total: 0 };
          statusBreakdown[s].count += 1;
          statusBreakdown[s].total += o.totalAmount || 0;
        }

        setData({
          totalOrders: orders.length,
          deliveredOrders: delivered.length,
          grossDeliveredRevenue,
          totalTaxCollected,
          paymentMethods,
          statusBreakdown,
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-24 text-slate-500">
        <RefreshCw className="h-6 w-6 animate-spin text-emerald-600 mr-2" />
        <span>Compiling sales statistics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sales & Revenue Report</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Aggregated gross sales, GST collection, and fulfillment channel analytics.
          </p>
        </div>

        <button
          onClick={fetchSalesData}
          className="p-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-xs transition"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Delivered Gross Sales"
          value={`₹${(data?.grossDeliveredRevenue || 0).toLocaleString('en-IN')}`}
          icon={IndianRupee}
          trend={{ value: 14.8, label: 'vs last month' }}
        />
        <StatsCard
          title="Fulfilled Deliveries"
          value={data?.deliveredOrders || 0}
          subtitle={`Out of ${data?.totalOrders || 0} total bookings`}
          icon={ShoppingCart}
        />
        <StatsCard
          title="GST Tax Collected"
          value={`₹${(data?.totalTaxCollected || 0).toLocaleString('en-IN')}`}
          subtitle="5% Agriculture input GST"
          icon={TrendingUp}
        />
        <StatsCard
          title="Avg Order Value"
          value={
            data?.deliveredOrders > 0
              ? `₹${Math.round(data.grossDeliveredRevenue / data.deliveredOrders).toLocaleString('en-IN')}`
              : '₹0'
          }
          icon={BarChart3}
        />
      </div>

      {/* Breakdown Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment Methods */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs">
          <h3 className="font-bold text-sm text-slate-900">Revenue by Payment Channel</h3>
          <div className="divide-y divide-slate-100 text-xs">
            {Object.entries(data?.paymentMethods || {}).map(([method, info]: any) => (
              <div key={method} className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 uppercase">{method}</span>
                  <span className="text-slate-400 ml-2 font-mono">({info.count} orders)</span>
                </div>
                <span className="font-semibold text-emerald-700 font-mono">
                  ₹{info.total?.toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs">
          <h3 className="font-bold text-sm text-slate-900">Pipeline by Fulfillment Stage</h3>
          <div className="divide-y divide-slate-100 text-xs">
            {Object.entries(data?.statusBreakdown || {}).map(([stage, info]: any) => (
              <div key={stage} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StatusBadge status={stage} size="sm" />
                  <span className="text-slate-500 font-mono">({info.count})</span>
                </div>
                <span className="font-semibold text-slate-800 font-mono">
                  ₹{info.total?.toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

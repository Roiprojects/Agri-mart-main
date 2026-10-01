'use client';

import React, { useState, useEffect } from 'react';
import {
  Warehouse,
  Package,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Printer,
  Layers,
  Search,
  XCircle,
  FileText,
  Clock,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  PlusCircle,
  MapPin,
  ExternalLink,
} from 'lucide-react';

interface WarehouseOrder {
  id: string;
  orderNumber: string;
  subtotalAmount: number;
  totalAmount: number;
  status: string;
  allocationStatus?: string;
  paymentMethod: string;
  paymentStatus: string;
  assignedWarehouseId?: string;
  assignedWarehouseName?: string;
  assignmentMode: string;
  packingSlipNumber?: string;
  trackingNumber?: string;
  courierName?: string;
  shippingAddress: any;
  items: any[];
  user?: any;
  trackingMilestones?: any[];
  rejectionHistory?: any[];
  isSplitOrder?: boolean;
}

interface InventoryItem {
  productId: string;
  name: string;
  nameKn?: string;
  sku: string;
  price: number;
  category: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  reorderThreshold: number;
  isLowStock: boolean;
}

interface LedgerEntry {
  id: string;
  type: string;
  productName: string;
  quantity: number;
  balanceAfter: number;
  referenceId?: string;
  notes: string;
  performedBy: string;
  createdAt: string;
}

export default function WarehousePortalPage() {
  const [selectedWarehouseId, setSelectedWarehouseId] = useState('wh-hubballi');
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'ledger'>('orders');
  const [orders, setOrders] = useState<WarehouseOrder[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  // Modals
  const [rejectModalOrder, setRejectModalOrder] = useState<WarehouseOrder | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Damaged physical inventory on warehouse rack');
  const [packingManifestOrder, setPackingManifestOrder] = useState<WarehouseOrder | null>(null);
  const [dispatchModalOrder, setDispatchModalOrder] = useState<WarehouseOrder | null>(null);
  const [courierName, setCourierName] = useState('VRL Logistics Agri Express');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [stockInModalOpen, setStockInModalOpen] = useState(false);
  const [stockInProduct, setStockInProduct] = useState('prod-001');
  const [stockInQty, setStockInQty] = useState(10);
  const [stockInNotes, setStockInNotes] = useState('Bulk factory consignment received from Bangalore hub');

  const WAREHOUSES = [
    { id: 'wh-hubballi', name: 'Hubballi Central Dark Warehouse', code: 'DWH-HBX-01', location: 'Tarihal Industrial Area' },
    { id: 'wh-dharwad', name: 'Dharwad Rural Fulfillment Hub', code: 'DWH-DWD-02', location: 'Belur Estate, PB Road' },
    { id: 'wh-belagavi', name: 'Belagavi Agro Logistics Center', code: 'DWH-IXG-03', location: 'Auto Nagar Industrial Area' },
    { id: 'wh-davanagere', name: 'Davanagere Central Agro Hub', code: 'DWH-DVG-04', location: 'Lokikere Road' },
    { id: 'wh-haveri', name: 'Haveri Agricultural Transit Hub', code: 'DWH-HVR-05', location: 'APMC Yard, PB Road' },
  ];

  const currentWh = WAREHOUSES.find((w) => w.id === selectedWarehouseId) || WAREHOUSES[0];

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersRes, invRes] = await Promise.all([
        fetch(`/api/warehouse/orders?warehouseId=${selectedWarehouseId}`),
        fetch(`/api/warehouse/inventory?warehouseId=${selectedWarehouseId}`),
      ]);
      const ordersData = await ordersRes.json();
      const invData = await invRes.json();

      if (ordersData.success) setOrders(ordersData.orders || []);
      if (invData.success) {
        setInventory(invData.inventory || []);
        setLowStockCount(invData.lowStockCount || 0);
        setLedger(invData.recentLedger || []);
      }
    } catch (err: any) {
      setActionError('Failed to load warehouse data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedWarehouseId]);

  const handleAcceptOrder = async (orderId: string) => {
    try {
      const res = await fetch('/api/warehouse/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ACCEPT',
          orderId,
          warehouseId: selectedWarehouseId,
          operatorName: `${currentWh.name} Dispatch Desk`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess(`Order #${data.order?.orderNumber || orderId} accepted & packing slip generated!`);
        fetchData();
      } else {
        setActionError(data.error || 'Failed to accept order');
      }
    } catch (err) {
      setActionError('Network error accepting order');
    }
  };

  const handleRejectOrder = async () => {
    if (!rejectModalOrder) return;
    try {
      const res = await fetch('/api/warehouse/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'REJECT',
          orderId: rejectModalOrder.id,
          warehouseId: selectedWarehouseId,
          reason: rejectionReason,
        }),
      });
      const data = await res.json();
      if (data.reassignedTo) {
        setActionSuccess(
          `Order rejected by this hub. Automated Recovery transferred order to ${data.reassignedTo.name}!`
        );
      } else {
        setActionSuccess(
          `Order rejected. No alternative hub had full stock; order transferred to Super Admin Hold.`
        );
      }
      setRejectModalOrder(null);
      fetchData();
    } catch (err) {
      setActionError('Error submitting rejection');
    }
  };

  const handleDispatchOrder = async () => {
    if (!dispatchModalOrder) return;
    try {
      const awb = trackingNumber.trim() || `VRL-${Math.floor(100000 + Math.random() * 900000)}`;
      const res = await fetch('/api/warehouse/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'DISPATCH',
          orderId: dispatchModalOrder.id,
          warehouseId: selectedWarehouseId,
          courierName,
          trackingNumber: awb,
          estimatedDeliveryDate: new Date(Date.now() + 86400000 * 2).toISOString(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess(`Order dispatched with ${courierName} (AWB: ${awb})! Stock ledger updated.`);
        setDispatchModalOrder(null);
        fetchData();
      } else {
        setActionError(data.error || 'Failed to dispatch order');
      }
    } catch (err) {
      setActionError('Error dispatching order');
    }
  };

  const handleStockTransaction = async () => {
    try {
      const res = await fetch('/api/warehouse/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          warehouseId: selectedWarehouseId,
          productId: stockInProduct,
          type: 'STOCK_IN',
          quantity: Number(stockInQty),
          notes: stockInNotes,
          performedBy: `${currentWh.name} Store Keeper`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess(`Stock receipt recorded! New balance: ${data.balanceAfter} units.`);
        setStockInModalOpen(false);
        fetchData();
      } else {
        setActionError(data.error || 'Failed to record stock');
      }
    } catch (err) {
      setActionError('Error processing stock transaction');
    }
  };

  const pendingAcceptance = orders.filter((o) => o.allocationStatus === 'ALLOCATED' && o.status === 'CONFIRMED').length;
  const readyToDispatch = orders.filter((o) => o.status === 'PACKED').length;
  const inTransit = orders.filter((o) => o.status === 'DISPATCHED' || o.status === 'OUT_FOR_DELIVERY').length;
  const delivered = orders.filter((o) => o.status === 'DELIVERED').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-slate-800 text-xs">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-[#183526] to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-emerald-900/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#B4D334] text-slate-950 uppercase tracking-wide">
            Pillar 2: Dark Warehouse Operations
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mt-1 text-white flex items-center gap-2.5">
            <Warehouse className="w-7 h-7 text-[#F7C629]" />
            Dark Warehouse Fulfillment Portal
          </h1>
          <p className="text-slate-300 text-xs mt-1 max-w-2xl">
            Atomic inventory reservation, automated proximity routing, order accept/reject recovery failover, packing slips, and rural carrier dispatch.
          </p>
        </div>

        {/* Warehouse Scoped Selector */}
        <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20 w-full md:w-auto">
          <label className="block text-[10px] text-emerald-200 font-bold uppercase mb-1">
            Active Dark Hub (Data Scoped):
          </label>
          <select
            value={selectedWarehouseId}
            onChange={(e) => setSelectedWarehouseId(e.target.value)}
            className="w-full bg-slate-900 text-[#F7C629] font-bold px-3 py-1.5 rounded-lg border border-slate-700 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            {WAREHOUSES.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name} ({w.code})
              </option>
            ))}
          </select>
          <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-emerald-400" /> {currentWh.location}
          </div>
        </div>
      </div>

      {/* Alert Notices */}
      {actionSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 font-semibold rounded-xl flex items-center justify-between shadow-sm animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess('')} className="text-slate-500 hover:text-slate-800">
            &times;
          </button>
        </div>
      )}

      {actionError && (
        <div className="p-3 bg-red-50 border border-red-300 text-red-900 font-semibold rounded-xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-700 shrink-0" />
            <span>{actionError}</span>
          </div>
          <button onClick={() => setActionError('')} className="text-slate-500 hover:text-slate-800">
            &times;
          </button>
        </div>
      )}

      {/* Operational KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 font-bold text-[10px] uppercase tracking-wider flex items-center justify-between">
            <span>Pending Acceptance</span>
            <Clock className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 mt-1">{pendingAcceptance}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Awaiting warehouse QC review</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 font-bold text-[10px] uppercase tracking-wider flex items-center justify-between">
            <span>Packing / Ready</span>
            <Package className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-blue-600 mt-1">{readyToDispatch}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Generate labels & dispatch</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 font-bold text-[10px] uppercase tracking-wider flex items-center justify-between">
            <span>In Transit (Rural)</span>
            <Truck className="w-3.5 h-3.5 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-purple-600 mt-1">{inTransit}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Carrier tracking active</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 font-bold text-[10px] uppercase tracking-wider flex items-center justify-between">
            <span>Low-Stock SKUs</span>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600 mt-1">{lowStockCount}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Below reorder threshold</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-4">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-2.5 font-bold text-xs flex items-center gap-2 border-b-2 transition ${
            activeTab === 'orders'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Package className="w-4 h-4" /> Assigned Orders Queue ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-2.5 font-bold text-xs flex items-center gap-2 border-b-2 transition ${
            activeTab === 'inventory'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" /> Hub Stock Inventory ({inventory.length})
        </button>
        <button
          onClick={() => setActiveTab('ledger')}
          className={`pb-2.5 font-bold text-xs flex items-center gap-2 border-b-2 transition ${
            activeTab === 'ledger'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" /> Stock In/Out Ledger History
        </button>
      </div>

      {/* TAB 1: ORDERS QUEUE */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap justify-between items-center gap-3">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">
                Fulfillment Queue for {currentWh.name}
              </h3>
              <p className="text-[11px] text-slate-500">
                Orders allocated based on GPS proximity, PIN serviceability, and verified real-time stock.
              </p>
            </div>
            <button
              onClick={fetchData}
              className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 font-semibold text-slate-700 shadow-sm transition"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh Queue
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-[10px] uppercase tracking-wider bg-slate-100/60">
                  <th className="py-2.5 px-4 font-bold">Order Details</th>
                  <th className="py-2.5 px-4 font-bold">Customer & Farm Destination</th>
                  <th className="py-2.5 px-4 font-bold">Line Items</th>
                  <th className="py-2.5 px-4 font-bold">Amount & Pay</th>
                  <th className="py-2.5 px-4 font-bold">Allocation & Status</th>
                  <th className="py-2.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-slate-400">
                      No orders currently assigned to {currentWh.name}.
                    </td>
                  </tr>
                ) : (
                  orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4">
                        <div className="font-extrabold text-slate-900">{ord.orderNumber}</div>
                        <div className="text-[10px] text-slate-400">
                          Mode: <span className="font-semibold text-emerald-700">{ord.assignmentMode}</span>
                        </div>
                        {ord.packingSlipNumber && (
                          <div className="text-[10px] text-blue-700 font-mono">Slip: {ord.packingSlipNumber}</div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{ord.shippingAddress?.fullName}</div>
                        <div className="text-[11px] text-slate-600 font-mono">{ord.shippingAddress?.mobile}</div>
                        <div className="text-[10px] text-slate-500 line-clamp-1">
                          {ord.shippingAddress?.village}, {ord.shippingAddress?.taluk} ({ord.shippingAddress?.pincode})
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          {ord.items?.map((item: any, idx: number) => (
                            <div key={idx} className="text-[11px] text-slate-800 flex items-center justify-between gap-2">
                              <span className="line-clamp-1 font-medium">{item.productName}</span>
                              <span className="font-bold text-slate-500 whitespace-nowrap">&times; {item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-black text-slate-900 text-sm">
                          ₹{ord.totalAmount.toLocaleString('en-IN')}
                        </div>
                        <span
                          className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-bold ${
                            ord.paymentStatus === 'PAID'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {ord.paymentMethod} ({ord.paymentStatus})
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[10px] inline-flex items-center w-max ${
                              ord.status === 'PACKED'
                                ? 'bg-blue-100 text-blue-800'
                                : ord.status === 'DISPATCHED'
                                ? 'bg-purple-100 text-purple-800'
                                : ord.status === 'DELIVERED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {ord.status}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Alloc: <strong className="text-slate-700">{ord.allocationStatus || 'ALLOCATED'}</strong>
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                        {/* ACCEPT & REJECT (for new allocated orders) */}
                        {ord.allocationStatus === 'ALLOCATED' && ord.status === 'CONFIRMED' && (
                          <>
                            <button
                              onClick={() => handleAcceptOrder(ord.id)}
                              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-2.5 py-1 rounded-md text-[11px] shadow-sm transition"
                              title="Accept order and mark for packing"
                            >
                              Accept & Pack
                            </button>
                            <button
                              onClick={() => setRejectModalOrder(ord)}
                              className="border border-red-300 hover:bg-red-50 text-red-700 font-bold px-2 py-1 rounded-md text-[11px] transition"
                              title="Reject with recovery failover"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {/* PACKED: READY FOR DISPATCH */}
                        {ord.status === 'PACKED' && (
                          <button
                            onClick={() => {
                              setDispatchModalOrder(ord);
                              setTrackingNumber(`VRL-EXP-${ord.orderNumber.split('-')[2] || '9481'}`);
                            }}
                            className="bg-purple-700 hover:bg-purple-800 text-white font-bold px-2.5 py-1 rounded-md text-[11px] shadow-sm transition inline-flex items-center gap-1"
                          >
                            <Truck className="w-3 h-3" /> Dispatch
                          </button>
                        )}

                        {/* DISPATCHED: OUT FOR DELIVERY OR DELIVER */}
                        {ord.status === 'DISPATCHED' && (
                          <button
                            onClick={async () => {
                              await fetch('/api/warehouse/orders', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ action: 'DELIVER', orderId: ord.id }),
                              });
                              setActionSuccess(`Order #${ord.orderNumber} marked as DELIVERED to farmer!`);
                              fetchData();
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2 py-1 rounded-md text-[11px] transition"
                          >
                            Mark Delivered
                          </button>
                        )}

                        {/* PRINT MANIFEST */}
                        <button
                          onClick={() => setPackingManifestOrder(ord)}
                          className="border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium px-2 py-1 rounded-md text-[11px] transition inline-flex items-center gap-1"
                          title="View & Print Packing Slip"
                        >
                          <Printer className="w-3 h-3" /> Manifest
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: INVENTORY & STOCK THRESHOLDS */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex flex-wrap justify-between items-center gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-700" />
                Physical Stock Inventory at {currentWh.name}
              </h3>
              <p className="text-[11px] text-slate-500">
                Inventory levels determine automated order routing eligibility. Available = Total - Reserved.
              </p>
            </div>
            <button
              onClick={() => setStockInModalOpen(true)}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs shadow-sm flex items-center gap-1.5 transition"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Log Stock-In Consignment
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {inventory.map((item) => (
              <div
                key={item.productId}
                className={`p-4 rounded-xl border transition ${
                  item.isLowStock ? 'bg-amber-50/60 border-amber-300' : 'bg-slate-50/60 border-slate-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="font-extrabold text-slate-900 line-clamp-1">{item.name}</div>
                  {item.isLowStock && (
                    <span className="px-1.5 py-0.5 bg-amber-200 text-amber-900 font-bold rounded text-[9px] uppercase">
                      Low Stock
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">SKU: {item.sku}</div>

                <div className="grid grid-cols-3 gap-2 pt-3 text-center border-t border-slate-200/60 mt-3">
                  <div>
                    <div className="text-[9px] text-slate-400 font-bold uppercase">On Hand</div>
                    <div className="text-base font-black text-slate-800">{item.quantity}</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-slate-400 font-bold uppercase">Reserved</div>
                    <div className="text-base font-black text-amber-600">{item.reservedQuantity}</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-slate-400 font-bold uppercase">Available</div>
                    <div
                      className={`text-base font-black ${
                        item.availableQuantity <= item.reorderThreshold ? 'text-red-600' : 'text-emerald-700'
                      }`}
                    >
                      {item.availableQuantity}
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 mt-2 flex justify-between items-center">
                  <span>Reorder Level: {item.reorderThreshold}</span>
                  <span className="font-semibold text-slate-700">₹{item.price.toLocaleString('en-IN')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: STOCK LEDGER AUDIT */}
      {activeTab === 'ledger' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <FileText className="w-4 h-4 text-emerald-700" />
            Stock In/Out Transaction Ledger ({currentWh.name})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-[10px] uppercase tracking-wider bg-slate-50">
                  <th className="py-2.5 px-3">Date & Time</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Product Name</th>
                  <th className="py-2.5 px-3 text-right">Quantity</th>
                  <th className="py-2.5 px-3 text-right">Balance After</th>
                  <th className="py-2.5 px-3">Reference / Notes</th>
                  <th className="py-2.5 px-3">Authorized By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px]">
                {ledger.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50 transition">
                    <td className="py-2.5 px-3 text-slate-500 font-mono">
                      {new Date(entry.createdAt).toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-3 font-bold">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] ${
                          entry.type === 'STOCK_IN'
                            ? 'bg-emerald-100 text-emerald-800'
                            : entry.type === 'DISPATCHED'
                            ? 'bg-purple-100 text-purple-800'
                            : entry.type === 'RESERVED'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {entry.type}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{entry.productName}</td>
                    <td className="py-2.5 px-3 text-right font-black text-slate-800">{entry.quantity}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-700">{entry.balanceAfter}</td>
                    <td className="py-2.5 px-3 text-slate-600">
                      <div className="font-semibold text-slate-800">{entry.referenceId}</div>
                      <div className="text-[10px] text-slate-400">{entry.notes}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">{entry.performedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: REJECTION & AUTOMATED RECOVERY FAILOVER */}
      {rejectModalOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-red-200 animate-scaleUp">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-red-600 font-bold uppercase text-[10px]">Recovery Failover Mechanism</span>
                <h3 className="font-extrabold text-lg text-slate-900">
                  Reject Order #{rejectModalOrder.orderNumber}
                </h3>
              </div>
              <button onClick={() => setRejectModalOrder(null)} className="text-slate-400 hover:text-slate-700 text-lg">
                &times;
              </button>
            </div>

            <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-red-950 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-xs">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                Immediate Automated Recovery Trigger
              </div>
              <p className="text-[11px] text-red-800">
                Rejecting this order releases inventory reservations at <strong>{currentWh.name}</strong>. The engine will instantly evaluate the remaining 4 regional dark warehouses by distance and re-allocate fulfillment with stock verification.
              </p>
            </div>

            <div>
              <label className="block text-slate-700 font-bold text-xs mb-1">Reason for Hub Rejection:</label>
              <select
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
              >
                <option value="Damaged physical inventory on warehouse rack">Damaged physical inventory on warehouse rack</option>
                <option value="Missing batch quality test certificate">Missing batch quality test certificate</option>
                <option value="Physical count discrepancy (zero on shelf)">Physical count discrepancy (zero on shelf)</option>
                <option value="Logistics route blocked / heavy floods">Logistics route blocked / heavy floods</option>
                <option value="Hazardous material packaging deficit">Hazardous material packaging deficit</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectModalOrder(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectOrder}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-md transition"
              >
                Confirm Rejection & Trigger Recovery
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CARRIER DISPATCH FORM */}
      {dispatchModalOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-purple-200">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-purple-600 font-bold uppercase text-[10px]">Logistics Handoff</span>
                <h3 className="font-extrabold text-lg text-slate-900">
                  Carrier Dispatch: Order #{dispatchModalOrder.orderNumber}
                </h3>
              </div>
              <button onClick={() => setDispatchModalOrder(null)} className="text-slate-400 hover:text-slate-700 text-lg">
                &times;
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1">Select Courier Partner:</label>
                <select
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                >
                  <option value="VRL Logistics Agri Express">VRL Logistics Agri Express (Rural Heavy Cargo)</option>
                  <option value="Delhivery Rural Surface">Delhivery Rural Surface</option>
                  <option value="AgriMart Direct Express Van">AgriMart Direct Express Van</option>
                  <option value="DTDC Kisan Special">DTDC Kisan Special</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1">Air Waybill / Consignment # (AWB):</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. VRL-EXP-948122"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-mono font-bold"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <div><strong>Origin:</strong> {currentWh.name}</div>
                <div><strong>Destination:</strong> {dispatchModalOrder.shippingAddress?.village}, {dispatchModalOrder.shippingAddress?.district} ({dispatchModalOrder.shippingAddress?.pincode})</div>
                <div><strong>Customer Mobile:</strong> {dispatchModalOrder.shippingAddress?.mobile}</div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDispatchModalOrder(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDispatchOrder}
                className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-lg shadow-md transition flex items-center gap-1.5"
              >
                <Truck className="w-3.5 h-3.5" /> Confirm Dispatch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: PRINTABLE PACKING MANIFEST & SHIPPING LABEL */}
      {packingManifestOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-slate-300 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <div>
                <span className="text-emerald-700 font-bold uppercase text-[10px]">Official Dispatch Manifest</span>
                <h3 className="font-black text-lg text-slate-900">
                  AGRI MART MEGA - PACKING SLIP
                </h3>
              </div>
              <button onClick={() => setPackingManifestOrder(null)} className="text-slate-400 hover:text-slate-700 text-lg">
                &times;
              </button>
            </div>

            <div className="border-2 border-slate-800 p-4 rounded-xl space-y-4 bg-white text-slate-900 font-mono text-xs">
              <div className="flex justify-between items-start border-b border-slate-300 pb-2">
                <div>
                  <div className="font-black text-sm text-emerald-800">AGRI MART MEGA</div>
                  <div className="text-[10px] text-slate-600">{currentWh.name}</div>
                  <div className="text-[10px] text-slate-600">{currentWh.location}</div>
                  <div className="text-[10px] text-slate-600">GSTIN: 29AABCA1234F1Z5</div>
                </div>
                <div className="text-right">
                  <div className="font-black text-sm">SLIP: {packingManifestOrder.packingSlipNumber || 'PKG-HBX-9481'}</div>
                  <div className="text-[10px] text-slate-500">Order #{packingManifestOrder.orderNumber}</div>
                  <div className="text-[10px] text-slate-500">Date: {new Date().toLocaleDateString('en-IN')}</div>
                </div>
              </div>

              {/* Farmer Destination & Barcode simulation */}
              <div className="grid grid-cols-2 gap-4 border-b border-slate-300 pb-3">
                <div>
                  <div className="font-bold text-[10px] text-slate-400 uppercase">SHIP TO (FARMER):</div>
                  <div className="font-black">{packingManifestOrder.shippingAddress?.fullName}</div>
                  <div className="text-[11px]">{packingManifestOrder.shippingAddress?.addressLine}</div>
                  <div className="text-[11px]">{packingManifestOrder.shippingAddress?.village}, {packingManifestOrder.shippingAddress?.taluk}</div>
                  <div className="text-[11px] font-bold">PIN: {packingManifestOrder.shippingAddress?.pincode}</div>
                  <div className="text-[11px]">Phone: {packingManifestOrder.shippingAddress?.mobile}</div>
                </div>
                <div className="border-l border-slate-200 pl-4 text-center flex flex-col justify-center items-center">
                  <div className="font-bold text-[10px] text-slate-400 uppercase mb-1">PARCEL ROUTING AWB</div>
                  <div className="bg-slate-900 text-white font-mono text-sm tracking-widest px-3 py-1 rounded">
                    *{packingManifestOrder.trackingNumber || 'VRL-EXP-948122'}*
                  </div>
                  <div className="text-[9px] text-slate-500 mt-1">Carrier: {packingManifestOrder.courierName || 'VRL Express'}</div>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <div className="font-bold text-[10px] text-slate-400 uppercase mb-1">PACKED ITEMS VERIFICATION:</div>
                <table className="w-full text-left border border-slate-200">
                  <thead className="bg-slate-100 text-[10px]">
                    <tr>
                      <th className="p-1.5">SKU / Item</th>
                      <th className="p-1.5 text-center">Qty</th>
                      <th className="p-1.5 text-right">Price</th>
                      <th className="p-1.5 text-center">QC Checked</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-[11px]">
                    {packingManifestOrder.items?.map((item: any, i: number) => (
                      <tr key={i}>
                        <td className="p-1.5">
                          <div className="font-bold">{item.productName}</div>
                          <div className="text-[9px] text-slate-500">{item.sku}</div>
                        </td>
                        <td className="p-1.5 text-center font-bold">{item.quantity}</td>
                        <td className="p-1.5 text-right">₹{item.totalPrice?.toLocaleString('en-IN')}</td>
                        <td className="p-1.5 text-center text-emerald-700 font-bold">&#10003; PASS</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center pt-2 text-[10px] text-slate-500 border-t border-slate-200">
                <div>Inspector: Suresh Patil (Hub Mgr)</div>
                <div>Authorized Signature: __________________</div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setPackingManifestOrder(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-100"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-md transition flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" /> Print Manifest & Label
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: STOCK-IN RECEIPT */}
      {stockInModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-emerald-200">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-emerald-700 font-bold uppercase text-[10px]">Inventory Receipt</span>
                <h3 className="font-extrabold text-lg text-slate-900">
                  Stock-In Consignment ({currentWh.name})
                </h3>
              </div>
              <button onClick={() => setStockInModalOpen(false)} className="text-slate-400 hover:text-slate-700 text-lg">
                &times;
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1">Product SKU:</label>
                <select
                  value={stockInProduct}
                  onChange={(e) => setStockInProduct(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                >
                  {inventory.map((item) => (
                    <option key={item.productId} value={item.productId}>
                      {item.name} ({item.sku}) - Current: {item.quantity}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1">Consignment Quantity Received:</label>
                <input
                  type="number"
                  min={1}
                  value={stockInQty}
                  onChange={(e) => setStockInQty(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1">Delivery Notes / PO Reference:</label>
                <textarea
                  rows={2}
                  value={stockInNotes}
                  onChange={(e) => setStockInNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setStockInModalOpen(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleStockTransaction}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-md transition"
              >
                Post to Stock Ledger
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

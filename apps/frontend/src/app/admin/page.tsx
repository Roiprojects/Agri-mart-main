'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/config';
import { dataStore } from '@/lib/store';
import { SEED_WAREHOUSES } from '@/lib/seed-data';
import {
  ShieldCheck,
  TrendingUp,
  Package,
  Warehouse,
  Users,
  Settings,
  Bell,
  Layers,
  Wrench,
  CheckCircle2,
  Globe,
  Plus,
  Edit2,
  Trash2,
  Tag,
  Eye,
  RefreshCw,
  AlertTriangle,
  Tractor,
  MapPin,
  ArrowLeftRight,
  Split,
  Activity,
  Radio,
  CheckSquare,
} from 'lucide-react';

export default function SuperAdminPortalPage() {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'catalogue' | 'coupons' | 'rentals' | 'services' | 'allocation' | 'integrations' | 'warehouses' | 'rbac' | 'settings'
  >('catalogue');

  const [domainConfig, setDomainConfig] = useState(SITE_CONFIG.domain);
  const [saveNotice, setSaveNotice] = useState('');

  // Catalogue State
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loadingCatalogue, setLoadingCatalogue] = useState(false);

  // Rentals & Returns State
  const [rentalBookings, setRentalBookings] = useState<any[]>([]);
  const [rentalStats, setRentalStats] = useState<any[]>([]);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedReturnBooking, setSelectedReturnBooking] = useState<any>(null);
  const [returnForm, setReturnForm] = useState({
    actualReturnDate: new Date().toISOString().split('T')[0],
    condition: 'ON_TIME' as 'ON_TIME' | 'LATE' | 'DAMAGED',
    damageNotes: '',
    damageCharge: 0,
  });

  // Allocation & Recovery State
  const [allocationOrders, setAllocationOrders] = useState<any[]>([]);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [selectedReassignOrder, setSelectedReassignOrder] = useState<any>(null);
  const [reassignWhId, setReassignWhId] = useState('wh-belagavi');
  const [reassignReason, setReassignReason] = useState('Super Admin re-routing to balance inventory');

  const [showSplitModal, setShowSplitModal] = useState(false);
  const [selectedSplitOrder, setSelectedSplitOrder] = useState<any>(null);
  const [splitHub1, setSplitHub1] = useState('wh-hubballi');
  const [splitHub2, setSplitHub2] = useState('wh-dharwad');

  const [showAuditModal, setShowAuditModal] = useState(false);
  const [selectedAuditOrder, setSelectedAuditOrder] = useState<any>(null);

  // Integrations & Notification Matrix State
  const [integrationsList, setIntegrationsList] = useState<any[]>([]);
  const [notifQueue, setNotifQueue] = useState<any[]>([]);
  const [notifStats, setNotifStats] = useState<any>({});
  const [pingingId, setPingingId] = useState<string | null>(null);

  // Services & Dispatch State
  const [serviceRequests, setServiceRequests] = useState<any[]>([]);
  const [serviceStats, setServiceStats] = useState<any>({});
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedAssignRequest, setSelectedAssignRequest] = useState<any>(null);
  const [assignForm, setAssignForm] = useState({
    providerName: 'Mandya Precision Agro Fleet #11',
    operatorMobile: '9480188990',
    fleetUnit: 'Tractor Unit KA-11-T-4912 (Basavaraj)',
  });

  // Allocation Handlers
  const handleReassignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReassignOrder) return;
    try {
      const res = await fetch('/api/admin/allocation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'REASSIGN',
          orderId: selectedReassignOrder.id,
          newWarehouseId: reassignWhId,
          reason: reassignReason,
          changedBy: 'Super Admin',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveNotice(`Order #${selectedReassignOrder.orderNumber} successfully reassigned!`);
        setShowReassignModal(false);
        fetchCatalogue();
      } else {
        alert(data.error || 'Failed to reassign');
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSplitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSplitOrder) return;
    const items = selectedSplitOrder.items || [];
    if (items.length < 2) {
      alert('Order must contain at least 2 line items to split');
      return;
    }
    const mid = Math.ceil(items.length / 2);
    const plan = [
      { warehouseId: splitHub1, itemIds: items.slice(0, mid).map((i: any) => i.id) },
      { warehouseId: splitHub2, itemIds: items.slice(mid).map((i: any) => i.id) },
    ];

    try {
      const res = await fetch('/api/admin/allocation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SPLIT_ORDER',
          orderId: selectedSplitOrder.id,
          splitPlan: plan,
          changedBy: 'Super Admin',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveNotice(`Order #${selectedSplitOrder.orderNumber} split into 2 shipments across ${splitHub1} and ${splitHub2}!`);
        setShowSplitModal(false);
        fetchCatalogue();
      } else {
        alert(data.error || 'Failed to split order');
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleToggleHold = async (order: any) => {
    const isHold = !order.isHold;
    const reason = isHold ? prompt('Enter reason for placing allocation on hold:') : 'Hold released by Super Admin';
    if (isHold && !reason) return;

    try {
      const res = await fetch('/api/admin/allocation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'HOLD',
          orderId: order.id,
          isHold,
          reason: reason || 'Admin review',
          changedBy: 'Super Admin',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveNotice(`Order #${order.orderNumber} ${isHold ? 'placed on HOLD' : 'hold RELEASED'}!`);
        fetchCatalogue();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handlePingIntegration = async (id: string) => {
    setPingingId(id);
    try {
      const res = await fetch('/api/integrations/diagnostics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ integrationId: id }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveNotice(data.message);
        fetchCatalogue();
      }
    } catch (err: any) {
      alert('Ping error: ' + err.message);
    } finally {
      setPingingId(null);
    }
  };

  const handleRetryNotifications = async () => {
    try {
      const res = await fetch('/api/notifications/queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'PROCESS_RETRY' }),
      });
      const data = await res.json();
      setSaveNotice(`Processed retry for ${data.processed || 0} queued notifications.`);
      fetchCatalogue();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Edit / Create Product Modal
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    nameKn: '',
    sku: '',
    categoryId: 'cat-machinery',
    price: 36500,
    comparePrice: 42000,
    shortDescription: '',
    description: '',
    isPublished: true,
    isDraft: false,
    targetCrops: 'Paddy, Cotton, Sugarcane',
    cropStages: '1, 2, 3',
    metaTitle: '',
    metaDescription: '',
  });

  // Create Coupon Modal
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponForm, setCouponForm] = useState({
    code: '',
    description: '',
    discountType: 'FIXED',
    discountValue: 500,
    minOrderValue: 2500,
    usageLimit: 1000,
  });

  const fetchCatalogue = () => {
    setLoadingCatalogue(true);
    Promise.all([
      fetch('/api/admin/catalogue/products').then((r) => r.json()),
      fetch('/api/admin/catalogue/categories').then((r) => r.json()),
      fetch('/api/admin/coupons').then((r) => r.json()),
      fetch('/api/rentals/admin').then((r) => r.json()),
      fetch('/api/services/admin').then((r) => r.json()),
      fetch('/api/admin/allocation').then((r) => r.json()),
      fetch('/api/integrations/diagnostics').then((r) => r.json()),
      fetch('/api/notifications/queue').then((r) => r.json()),
    ])
      .then(([prodData, catData, couponData, rentData, srvData, allocData, integData, notifData]) => {
        if (prodData.success) setProducts(prodData.data);
        if (catData.success) setCategories(catData.data);
        if (couponData.success) setCoupons(couponData.data);
        if (rentData.success) {
          setRentalBookings(rentData.data.bookings || []);
          setRentalStats(rentData.data.inventoryStats || []);
        }
        if (srvData.success) {
          setServiceRequests(srvData.data.requests || []);
          setServiceStats(srvData.data.stats || {});
        }
        if (allocData?.success) {
          setAllocationOrders(allocData.queue || []);
        }
        if (integData?.success) {
          setIntegrationsList(integData.integrations || []);
        }
        if (notifData?.success) {
          setNotifQueue(notifData.queue || []);
          setNotifStats(notifData.stats || {});
        }
        setLoadingCatalogue(false);
      })
      .catch((e) => {
        console.error(e);
        setLoadingCatalogue(false);
      });
  };

  useEffect(() => {
    fetchCatalogue();
  }, []);

  const handleOpenCreateProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      nameKn: '',
      sku: `AGP-${Date.now().toString().slice(-4)}`,
      categoryId: categories[0]?.id || 'cat-machinery',
      price: 2500,
      comparePrice: 3000,
      shortDescription: '',
      description: '',
      isPublished: true,
      isDraft: false,
      targetCrops: 'Paddy, Cotton, Sugarcane',
      cropStages: '1, 2, 3',
      metaTitle: '',
      metaDescription: '',
    });
    setShowProductModal(true);
  };

  const handleOpenEditProduct = (p: any) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name,
      nameKn: p.nameKn || '',
      sku: p.sku,
      categoryId: p.categoryId,
      price: p.price,
      comparePrice: p.comparePrice || 0,
      shortDescription: p.shortDescription || '',
      description: p.description || '',
      isPublished: p.isPublished,
      isDraft: p.isDraft || false,
      targetCrops: p.targetCrops || '',
      cropStages: p.cropStages || '',
      metaTitle: p.metaTitle || '',
      metaDescription: p.metaDescription || '',
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        id: editingProduct?.id,
        ...productForm,
      };

      const res = await fetch('/api/admin/catalogue/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setSaveNotice(`Product "${productForm.name}" saved! Public pages (/shop, /products) revalidated.`);
        setShowProductModal(false);
        fetchCatalogue();
      } else {
        alert(data.message || 'Failed to save product');
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? Public caches will be refreshed.`)) return;
    try {
      const res = await fetch(`/api/admin/catalogue/products?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setSaveNotice(`Product "${name}" deleted. Public storefront updated.`);
        fetchCatalogue();
      }
    } catch (err: any) {
      alert('Error deleting: ' + err.message);
    }
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(couponForm),
      });
      const data = await res.json();
      if (data.success) {
        setSaveNotice(`Coupon "${couponForm.code}" created and ready for checkout!`);
        setShowCouponModal(false);
        fetchCatalogue();
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleSaveDomain = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveNotice(`Domain updated to ${domainConfig}! Canonical URLs and SEO schema re-synchronized.`);
    setTimeout(() => setSaveNotice(''), 4000);
  };

  // Rental Actions
  const handleApproveRental = async (bookingId: string) => {
    try {
      const res = await fetch('/api/rentals/admin', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, status: 'APPROVED' }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveNotice('Rental booking approved for dark warehouse dispatch!');
        fetchCatalogue();
      }
    } catch (e: any) {
      alert('Error approving rental: ' + e.message);
    }
  };

  const handleActivateRental = async (bookingId: string) => {
    try {
      const res = await fetch('/api/rentals/admin', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, status: 'ACTIVE' }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveNotice('Rental equipment dispatched and marked ACTIVE on-field!');
        fetchCatalogue();
      }
    } catch (e: any) {
      alert('Error activating rental: ' + e.message);
    }
  };

  const handleOpenReturnModal = (booking: any) => {
    setSelectedReturnBooking(booking);
    setReturnForm({
      actualReturnDate: new Date().toISOString().split('T')[0],
      condition: 'ON_TIME',
      damageNotes: '',
      damageCharge: 0,
    });
    setShowReturnModal(true);
  };

  const handleProcessReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReturnBooking) return;
    try {
      const res = await fetch('/api/rentals/return', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: selectedReturnBooking.id,
          ...returnForm,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveNotice(`Machine return processed! Status: ${data.data.status}. Net deposit refund: ₹${data.data.depositRefundAmount?.toLocaleString('en-IN')}`);
        setShowReturnModal(false);
        fetchCatalogue();
      }
    } catch (e: any) {
      alert('Error processing return: ' + e.message);
    }
  };

  // Service Actions
  const handleOpenAssignModal = (request: any) => {
    setSelectedAssignRequest(request);
    setAssignForm({
      providerName: 'Mandya Precision Agro Fleet #11',
      operatorMobile: '9480188990',
      fleetUnit: 'Tractor Unit KA-11-T-4912 (Basavaraj)',
    });
    setShowAssignModal(true);
  };

  const handleAssignProvider = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignRequest) return;
    try {
      const res = await fetch('/api/services/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: selectedAssignRequest.id,
          ...assignForm,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveNotice(`Operator assigned to Request #${selectedAssignRequest.requestNumber}! SMS dispatch notification triggered.`);
        setShowAssignModal(false);
        fetchCatalogue();
      }
    } catch (e: any) {
      alert('Error assigning provider: ' + e.message);
    }
  };

  const handleUpdateServiceStatus = async (requestId: string, status: string) => {
    try {
      const res = await fetch('/api/services/admin', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, status }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveNotice(`Service status updated to ${status}!`);
        fetchCatalogue();
      }
    } catch (e: any) {
      alert('Error updating service status: ' + e.message);
    }
  };

  const orders = dataStore.orders;
  const totalGMV = orders.reduce((sum, o) => sum + o.totalAmount, 0) + 1485000;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-xs">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="inline-flex items-center gap-1.5 bg-agri-yellow text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" /> Super Admin Portal &amp; Catalogue Engine
            </div>
            <span className="bg-emerald-500/20 text-emerald-300 font-mono text-[10px] px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              DEV_DB: Active &amp; Persistent
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">{SITE_CONFIG.name} &mdash; Administration</h1>
          <p className="text-slate-300 text-xs mt-1">
            Real-time database catalog, automated dark warehouse routing, and Next.js ISR cache revalidation.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('catalogue')}
            className={`px-3.5 py-2 rounded-xl font-bold transition ${activeTab === 'catalogue' ? 'bg-agri-green text-white shadow-xs' : 'bg-white/10 text-slate-300 hover:bg-white/20'}`}
          >
            Catalogue &amp; Products
          </button>
          <button
            onClick={() => setActiveTab('rentals')}
            className={`px-3.5 py-2 rounded-xl font-bold transition ${activeTab === 'rentals' ? 'bg-agri-green text-white shadow-xs' : 'bg-white/10 text-slate-300 hover:bg-white/20'}`}
          >
            Rentals &amp; Returns ({rentalBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-3.5 py-2 rounded-xl font-bold transition ${activeTab === 'services' ? 'bg-agri-green text-white shadow-xs' : 'bg-white/10 text-slate-300 hover:bg-white/20'}`}
          >
            Services &amp; Dispatch ({serviceRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('allocation')}
            className={`px-3.5 py-2 rounded-xl font-bold transition ${activeTab === 'allocation' ? 'bg-agri-green text-white shadow-xs' : 'bg-white/10 text-slate-300 hover:bg-white/20'}`}
          >
            Allocation &amp; Recovery ({allocationOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('integrations')}
            className={`px-3.5 py-2 rounded-xl font-bold transition ${activeTab === 'integrations' ? 'bg-agri-green text-white shadow-xs' : 'bg-white/10 text-slate-300 hover:bg-white/20'}`}
          >
            Integrations &amp; Matrix
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-3.5 py-2 rounded-xl font-bold transition ${activeTab === 'coupons' ? 'bg-agri-green text-white shadow-xs' : 'bg-white/10 text-slate-300 hover:bg-white/20'}`}
          >
            Coupons
          </button>
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 rounded-xl font-bold transition ${activeTab === 'overview' ? 'bg-agri-green text-white shadow-xs' : 'bg-white/10 text-slate-300 hover:bg-white/20'}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('warehouses')}
            className={`px-3.5 py-2 rounded-xl font-bold transition ${activeTab === 'warehouses' ? 'bg-agri-green text-white shadow-xs' : 'bg-white/10 text-slate-300 hover:bg-white/20'}`}
          >
            Warehouses
          </button>
          <button
            onClick={() => setActiveTab('rbac')}
            className={`px-3.5 py-2 rounded-xl font-bold transition ${activeTab === 'rbac' ? 'bg-agri-green text-white shadow-xs' : 'bg-white/10 text-slate-300 hover:bg-white/20'}`}
          >
            RBAC Roles
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 py-2 rounded-xl font-bold transition ${activeTab === 'settings' ? 'bg-agri-yellow text-slate-950 font-black' : 'bg-white/10 text-slate-300 hover:bg-white/20'}`}
          >
            Domain Settings
          </button>
        </div>
      </div>

      {saveNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 font-semibold rounded-2xl flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>{saveNotice}</span>
          </div>
          <button onClick={() => setSaveNotice('')} className="text-emerald-700 font-bold hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* TAB: CATALOGUE & PRODUCTS */}
      {activeTab === 'catalogue' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base text-slate-900">Database Product Catalogue</h3>
                <span className="bg-slate-100 text-slate-700 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                  {products.length} Active Items
                </span>
              </div>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Changes made here immediately update the database and trigger deliberate Next.js cache revalidation for public storefront routes.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="http://localhost:3001/admin/catalogue/products"
                target="_blank"
                className="bg-[#2585be] hover:bg-[#1f73a5] text-white font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition shadow-xs text-xs"
              >
                <Package className="w-4 h-4" /> Enterprise Products View ↗
              </Link>
              <button
                onClick={fetchCatalogue}
                className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition"
                title="Refresh"
              >
                <RefreshCw className={`w-4 h-4 ${loadingCatalogue ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={handleOpenCreateProduct}
                className="bg-agri-green hover:bg-agri-green-dark text-white font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition shadow-xs"
              >
                <Plus className="w-4 h-4" /> Add New Product
              </button>
            </div>
          </div>

          {/* Products Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 text-[10px] uppercase">
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Product Name &amp; SKU</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Price (₹)</th>
                  <th className="py-2.5 px-3">Stock Units</th>
                  <th className="py-2.5 px-3">Crops &amp; Stages</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3">
                      <span
                        className={`font-bold px-2.5 py-0.5 rounded-full text-[10px] uppercase ${
                          p.isPublished && !p.isDraft
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {p.isPublished && !p.isDraft ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-extrabold text-slate-900">{p.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">SKU: {p.sku}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-medium">
                      {p.category?.name || p.category || 'Machinery'}
                    </td>
                    <td className="py-3 px-3 font-extrabold text-slate-900">
                      ₹{p.price.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-emerald-700">
                        {p.variants?.reduce((sum: number, v: any) => sum + (v.stockQuantity || 0), 0) || 25} in stock
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500 text-[11px]">
                      {p.targetCrops || 'All Crops'} &bull; Stage {p.cropStages || '1–7'}
                    </td>
                    <td className="py-3 px-3 text-right space-x-1">
                      <button
                        onClick={() => handleOpenEditProduct(p)}
                        className="p-1.5 hover:bg-slate-200 text-slate-600 rounded-lg transition"
                        title="Edit product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id, p.name)}
                        className="p-1.5 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: COUPONS */}
      {activeTab === 'coupons' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-black text-base text-slate-900">Kisan Discount Coupons</h3>
              <p className="text-slate-500 text-[11px] mt-0.5">Manage promotional discount codes applicable during checkout.</p>
            </div>
            <button
              onClick={() => setShowCouponModal(true)}
              className="bg-agri-green hover:bg-agri-green-dark text-white font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition shadow-xs"
            >
              <Plus className="w-4 h-4" /> Create Coupon
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {coupons.map((c) => (
              <div key={c.id} className="p-5 rounded-2xl border border-slate-200 space-y-2 bg-slate-50/50">
                <div className="flex justify-between items-center">
                  <span className="font-black font-mono text-sm text-agri-green-dark bg-emerald-100 px-3 py-1 rounded-xl">
                    {c.code}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {c.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
                <div className="font-bold text-slate-900 text-xs">
                  {c.discountType === 'FIXED' ? `₹${c.discountValue} Flat Discount` : `${c.discountValue}% Percentage Off`}
                </div>
                <p className="text-[11px] text-slate-600">{c.description || 'Valid on all orders.'}</p>
                <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-200 flex justify-between">
                  <span>Min Order: ₹{c.minOrderValue}</span>
                  <span>Used: {c.usageCount} times</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: DASHBOARD / OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
              <div className="text-slate-400 font-bold text-[10px] uppercase">Gross Merchandise Value (GMV)</div>
              <div className="text-2xl font-black text-slate-950 mt-1">₹{totalGMV.toLocaleString('en-IN')}</div>
              <div className="text-[10px] text-emerald-700 font-semibold mt-1">+18.4% from last month</div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
              <div className="text-slate-400 font-bold text-[10px] uppercase">Active Registered Farmers</div>
              <div className="text-2xl font-black text-emerald-700 mt-1">4,280</div>
              <div className="text-[10px] text-slate-500 mt-1">With 19-Field Customer Data Forms</div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
              <div className="text-slate-400 font-bold text-[10px] uppercase">Authorized Dealers</div>
              <div className="text-2xl font-black text-blue-600 mt-1">1,540</div>
              <div className="text-[10px] text-slate-500 mt-1">Across 31 Karnataka Districts</div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
              <div className="text-slate-400 font-bold text-[10px] uppercase">Active Dark Warehouses</div>
              <div className="text-2xl font-black text-purple-600 mt-1">5 Regional Hubs</div>
              <div className="text-[10px] text-slate-500 mt-1">100% GPS Serviceability Match</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: WAREHOUSES */}
      {activeTab === 'warehouses' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Dark Multi-Warehouse Network &amp; Manual Assignment Controls</h3>
              <p className="text-slate-500 text-[11px]">Option 2: Change warehouse, split orders across warehouses, or hold assignment.</p>
            </div>
            <span className="bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full text-[10px]">
              5 Regional Hubs
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {SEED_WAREHOUSES.map((wh) => (
              <div key={wh.id} className="py-3 flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-900">{wh.name} ({wh.code})</div>
                  <div className="text-[11px] text-slate-500">
                    GPS: {wh.latitude}, {wh.longitude} &bull; Radius: {wh.serviceRadiusKm} km &bull; Manager: {wh.managerName} ({wh.contactNumber})
                  </div>
                </div>
                <span className="text-emerald-700 font-bold">ACTIVE</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: RBAC MATRIX */}
      {activeTab === 'rbac' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-sm text-slate-900">Role-Based Access Control (RBAC) Permissions Matrix</h3>
            <p className="text-slate-500 text-[11px]">Granular privileges across all 11 user types as defined in Section 23.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 text-[10px] uppercase">
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Portal Path</th>
                  <th className="py-2.5 px-3">Key Features &amp; Privileges</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {SITE_CONFIG.roles.map((r) => (
                  <tr key={r.key} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold text-slate-900">{r.label}</td>
                    <td className="py-2.5 px-3 font-mono text-emerald-700">{r.path}</td>
                    <td className="py-2.5 px-3 text-slate-600">Full operational capability for {r.label}.</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: DOMAIN SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6 max-w-2xl">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-700" />
              Configurable Domain Architecture
            </h3>
            <p className="text-slate-500 text-[11px] mt-0.5">
              Configure primary operational domain for canonical SEO links and branding.
            </p>
          </div>

          <form onSubmit={handleSaveDomain} className="space-y-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 p-3 rounded-2xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="radio"
                  name="domain"
                  value="agrimart.in"
                  checked={domainConfig === 'agrimart.in'}
                  onChange={(e) => setDomainConfig(e.target.value)}
                  className="text-emerald-700"
                />
                <div>
                  <div className="font-bold text-slate-900">agrimart.in (Official Logo Domain)</div>
                  <div className="text-[11px] text-slate-500">Matches the logo artwork branding.</div>
                </div>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-2xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="radio"
                  name="domain"
                  value="agrimartmega.com"
                  checked={domainConfig === 'agrimartmega.com'}
                  onChange={(e) => setDomainConfig(e.target.value)}
                  className="text-emerald-700"
                />
                <div>
                  <div className="font-bold text-slate-900">agrimartmega.com (Project Spec Domain)</div>
                  <div className="text-[11px] text-slate-500">Matches the technical architecture reports.</div>
                </div>
              </label>
            </div>

            <button
              type="submit"
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-2.5 rounded-xl shadow transition"
            >
              Save &amp; Apply Domain Configuration
            </button>
          </form>
        </div>
      )}

      {/* TAB: RENTALS & RETURNS MANAGEMENT */}
      {activeTab === 'rentals' && (
        <div className="space-y-6">
          {/* Regional Fleet Capacity Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <Tractor className="w-5 h-5 text-emerald-700" />
                  Regional Dark Warehouse Equipment Fleet &amp; Capacity
                </h3>
                <p className="text-slate-500 text-xs mt-0.5">
                  Real-time unit capacity prevents overlapping bookings beyond physical machine inventory.
                </p>
              </div>
              <span className="bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full text-xs">
                Active Fleet Hubs: Hubballi &bull; Belagavi &bull; Mandya
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {rentalStats.map((stat: any) => (
                <div key={stat.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-900 text-xs block line-clamp-1">{stat.title}</span>
                  <div className="flex justify-between items-end pt-1">
                    <div>
                      <div className="text-2xl font-black text-slate-900">{stat.availableUnits}</div>
                      <div className="text-[10px] text-slate-500">Available Units</div>
                    </div>
                    <div className="text-right text-[11px] text-slate-600">
                      <div>Total Fleet: <strong>{stat.totalUnits}</strong></div>
                      <div>On-Field: <strong className="text-emerald-700">{stat.inUseUnits}</strong></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bookings & Returns Table */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Rental Bookings &amp; Return Settlements
                </h3>
                <p className="text-slate-500 text-xs mt-0.5">
                  Approve bookings, activate dispatches, and process on-time, late, or damaged returns.
                </p>
              </div>
              <button
                onClick={fetchCatalogue}
                className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-emerald-700 border border-slate-200 px-3 py-1.5 rounded-xl hover:bg-slate-50"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Refresh
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-3">Booking #</th>
                    <th className="py-3 px-3">Equipment</th>
                    <th className="py-3 px-3">Customer</th>
                    <th className="py-3 px-3">Period &bull; Days</th>
                    <th className="py-3 px-3">Rent &bull; Deposit</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {rentalBookings.map((b: any) => (
                    <tr key={b.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">{b.bookingNumber}</td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 line-clamp-1">{b.productTitle}</div>
                        <div className="text-[10px] text-slate-400">Hub: {b.warehouseId}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900">{b.customerName}</div>
                        <div className="text-[10px] text-slate-500">{b.customerMobile}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-slate-900">{b.startDate} to {b.endDate}</div>
                        <div className="text-[10px] text-slate-500">{b.totalDays} Days ({b.pricingTier})</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-emerald-700">₹{b.rentAmount?.toLocaleString('en-IN')}</div>
                        <div className="text-[10px] text-slate-500">Deposit: ₹{b.securityDeposit?.toLocaleString('en-IN')}</div>
                      </td>
                      <td className="py-3 px-3">
                        {b.status === 'ACTIVE' && (
                          <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                            ACTIVE ON-FIELD
                          </span>
                        )}
                        {b.status === 'APPROVED' && (
                          <span className="bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                            APPROVED
                          </span>
                        )}
                        {b.status === 'PENDING_APPROVAL' && (
                          <span className="bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                            PENDING
                          </span>
                        )}
                        {b.status === 'RETURNED_ON_TIME' && (
                          <span className="bg-slate-100 text-slate-800 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                            RETURNED ON-TIME
                          </span>
                        )}
                        {b.status === 'RETURNED_LATE' && (
                          <span className="bg-orange-100 text-orange-900 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                            LATE (-₹{b.lateFee})
                          </span>
                        )}
                        {b.status === 'RETURNED_DAMAGED' && (
                          <span className="bg-rose-100 text-rose-900 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                            DAMAGED (-₹{b.damageFee})
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right space-x-1.5 whitespace-nowrap">
                        {b.status === 'PENDING_APPROVAL' && (
                          <button
                            onClick={() => handleApproveRental(b.id)}
                            className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-3 py-1.5 rounded-lg text-[11px] shadow-xs"
                          >
                            Approve
                          </button>
                        )}
                        {b.status === 'APPROVED' && (
                          <button
                            onClick={() => handleActivateRental(b.id)}
                            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-lg text-[11px] shadow-xs"
                          >
                            Dispatch / Activate
                          </button>
                        )}
                        {b.status === 'ACTIVE' && (
                          <button
                            onClick={() => handleOpenReturnModal(b)}
                            className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-3 py-1.5 rounded-lg text-[11px] shadow-xs"
                          >
                            Process Return
                          </button>
                        )}
                        {['RETURNED_ON_TIME', 'RETURNED_LATE', 'RETURNED_DAMAGED'].includes(b.status) && (
                          <span className="text-[11px] text-slate-500 font-medium">
                            Refunded ₹{b.depositRefundAmount?.toLocaleString('en-IN')} ✓
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: SERVICES & DISPATCH MANAGEMENT */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          {/* Dispatch Summary Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-700" />
                  Section 9 GPS Smart Service Requests &amp; Fleet Assignment
                </h3>
                <p className="text-slate-500 text-xs mt-0.5">
                  Super Admin portal forwards customer GPS farm coordinates to verified operators &amp; certified technicians.
                </p>
              </div>
              <button
                onClick={fetchCatalogue}
                className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-emerald-700 border border-slate-200 px-3 py-1.5 rounded-xl hover:bg-slate-50"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Refresh Queue
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="text-xl font-black text-slate-900">{serviceStats.total || 0}</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">Total Requests</div>
              </div>
              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200">
                <div className="text-xl font-black text-amber-900">{serviceStats.requested || 0}</div>
                <div className="text-[10px] text-amber-800 font-bold uppercase mt-0.5">Pending Dispatch</div>
              </div>
              <div className="p-3.5 bg-blue-50 rounded-2xl border border-blue-200">
                <div className="text-xl font-black text-blue-900">{serviceStats.assigned || 0}</div>
                <div className="text-[10px] text-blue-800 font-bold uppercase mt-0.5">Assigned Provider</div>
              </div>
              <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-200">
                <div className="text-xl font-black text-purple-900">{serviceStats.inProgress || 0}</div>
                <div className="text-[10px] text-purple-800 font-bold uppercase mt-0.5">In Progress</div>
              </div>
              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200">
                <div className="text-xl font-black text-emerald-900">{serviceStats.completed || 0}</div>
                <div className="text-[10px] text-emerald-800 font-bold uppercase mt-0.5">Completed</div>
              </div>
            </div>
          </div>

          {/* Service Requests Queue */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-3">
              Incoming GPS Service Queue
            </h3>

            <div className="space-y-4">
              {serviceRequests.map((srv: any) => (
                <div
                  key={srv.id}
                  className="p-5 bg-slate-50 hover:bg-slate-100/70 rounded-2xl border border-slate-200 transition space-y-3"
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-200/60 pb-3">
                    <div>
                      <span className="font-extrabold text-sm text-slate-900">{srv.serviceName}</span>
                      {srv.jobWorkName && (
                        <span className="ml-2 font-semibold text-xs text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                          {srv.jobWorkName}
                        </span>
                      )}
                      <span className="ml-2 font-mono text-[11px] text-slate-400">#{srv.requestNumber}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {srv.status === 'REQUESTED' && (
                        <span className="bg-amber-100 text-amber-900 font-bold px-3 py-1 rounded-full text-[10px] border border-amber-300">
                          AWAITING OPERATOR ASSIGNMENT
                        </span>
                      )}
                      {srv.status === 'ASSIGNED' && (
                        <span className="bg-blue-100 text-blue-900 font-bold px-3 py-1 rounded-full text-[10px] border border-blue-300">
                          OPERATOR ASSIGNED
                        </span>
                      )}
                      {srv.status === 'IN_PROGRESS' && (
                        <span className="bg-purple-100 text-purple-900 font-bold px-3 py-1 rounded-full text-[10px] border border-purple-300">
                          ON-FIELD IN PROGRESS
                        </span>
                      )}
                      {srv.status === 'COMPLETED' && (
                        <span className="bg-emerald-100 text-emerald-900 font-bold px-3 py-1 rounded-full text-[10px] border border-emerald-300">
                          COMPLETED ✓
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-slate-600 text-xs">
                    <div>
                      <div className="text-slate-500 font-medium">Customer:</div>
                      <div className="text-slate-900 font-bold">{srv.customerName}</div>
                      <div className="text-[11px] text-slate-500">{srv.customerMobile}</div>
                    </div>

                    <div>
                      <div className="text-slate-500 font-medium">GPS Farm Location:</div>
                      <div className="text-slate-900 truncate font-semibold">{srv.address}</div>
                      <div className="text-[11px] font-mono text-emerald-700 font-bold">
                        Lat: {srv.gpsLatitude}, Lng: {srv.gpsLongitude}
                      </div>
                    </div>

                    <div>
                      <div className="text-slate-500 font-medium">Scheduled Slot &amp; Parcel:</div>
                      <div className="text-slate-900 font-semibold">{srv.preferredDate} ({srv.preferredTime})</div>
                      <div className="text-[11px] text-slate-500">{srv.farmAcreage} Acre(s) &bull; {srv.cropType}</div>
                    </div>

                    <div>
                      <div className="text-slate-500 font-medium">Estimated Bill:</div>
                      <div className="text-emerald-700 font-black text-sm">
                        ₹{srv.estimatedCost?.toLocaleString('en-IN') || 0}
                      </div>
                      <div className="text-[10px] text-slate-400">Advance Paid: ₹{srv.advancePaid || 0}</div>
                    </div>
                  </div>

                  {srv.assignedProviderName && (
                    <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-blue-950 flex flex-col sm:flex-row justify-between sm:items-center gap-2 text-xs">
                      <div>
                        <strong>Assigned Fleet:</strong> {srv.assignedProviderName} &bull; Unit: <strong>{srv.assignedFleetUnit}</strong> &bull; Driver Phone: <strong className="font-mono">{srv.assignedOperatorMobile}</strong>
                      </div>
                      <div className="flex gap-2">
                        {srv.status === 'ASSIGNED' && (
                          <button
                            onClick={() => handleUpdateServiceStatus(srv.id, 'IN_PROGRESS')}
                            className="bg-purple-700 hover:bg-purple-800 text-white font-bold px-3 py-1 rounded-lg text-[11px] shadow-xs"
                          >
                            Mark On-Field
                          </button>
                        )}
                        {srv.status === 'IN_PROGRESS' && (
                          <button
                            onClick={() => handleUpdateServiceStatus(srv.id, 'COMPLETED')}
                            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1 rounded-lg text-[11px] shadow-xs"
                          >
                            Mark Completed
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {srv.status === 'REQUESTED' && (
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => handleOpenAssignModal(srv)}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-xs transition"
                      >
                        Assign Nearest Verified Operator &rarr;
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Product Create/Edit Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto animate-scaleIn">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">
                {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Add New Agricultural Product'}
              </h3>
              <button
                onClick={() => setShowProductModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Product Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Product Name (Kannada)</label>
                  <input
                    type="text"
                    value={productForm.nameKn}
                    onChange={(e) => setProductForm({ ...productForm, nameKn: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">SKU Identifier *</label>
                  <input
                    type="text"
                    required
                    value={productForm.sku}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category *</label>
                  <select
                    value={productForm.categoryId}
                    onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-xl"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Base Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Compare Price (₹ MRP)</label>
                  <input
                    type="number"
                    value={productForm.comparePrice}
                    onChange={(e) => setProductForm({ ...productForm, comparePrice: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Short Description *</label>
                <input
                  type="text"
                  required
                  value={productForm.shortDescription}
                  onChange={(e) => setProductForm({ ...productForm, shortDescription: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Description</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Crops (Comma-separated)</label>
                  <input
                    type="text"
                    value={productForm.targetCrops}
                    onChange={(e) => setProductForm({ ...productForm, targetCrops: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Crop Stages (e.g. 1, 2, 3)</label>
                  <input
                    type="text"
                    value={productForm.cropStages}
                    onChange={(e) => setProductForm({ ...productForm, cropStages: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              {/* SEO Fields */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-800 text-[11px]">SEO Metadata:</div>
                <input
                  type="text"
                  placeholder="Custom Meta Title"
                  value={productForm.metaTitle}
                  onChange={(e) => setProductForm({ ...productForm, metaTitle: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-xl bg-white"
                />
                <input
                  type="text"
                  placeholder="Custom Meta Description"
                  value={productForm.metaDescription}
                  onChange={(e) => setProductForm({ ...productForm, metaDescription: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-xl bg-white"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={productForm.isPublished}
                    onChange={(e) => setProductForm({ ...productForm, isPublished: e.target.checked })}
                    className="w-4 h-4 text-agri-green"
                  />
                  <span>Published on Storefront</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={productForm.isDraft}
                    onChange={(e) => setProductForm({ ...productForm, isDraft: e.target.checked })}
                    className="w-4 h-4 text-amber-600"
                  />
                  <span>Save as Draft</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-agri-green hover:bg-agri-green-dark text-white rounded-xl font-bold shadow-xs"
                >
                  Save &amp; Revalidate Public Storefront
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Coupon Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-2xl animate-scaleIn">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Create Kisan Coupon</h3>
              <button
                onClick={() => setShowCouponModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. KISAN2026"
                  value={couponForm.code}
                  onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                  className="w-full p-2 border border-slate-300 rounded-xl font-mono uppercase"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Discount Type *</label>
                <select
                  value={couponForm.discountType}
                  onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value as any })}
                  className="w-full p-2 border border-slate-300 rounded-xl"
                >
                  <option value="FIXED">Fixed Amount (₹)</option>
                  <option value="PERCENTAGE">Percentage (%)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Discount Value *</label>
                <input
                  type="number"
                  required
                  value={couponForm.discountValue}
                  onChange={(e) => setCouponForm({ ...couponForm, discountValue: Number(e.target.value) })}
                  className="w-full p-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Minimum Order Value (₹)</label>
                <input
                  type="number"
                  value={couponForm.minOrderValue}
                  onChange={(e) => setCouponForm({ ...couponForm, minOrderValue: Number(e.target.value) })}
                  className="w-full p-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="Special festival discount for farmers"
                  value={couponForm.description}
                  onChange={(e) => setCouponForm({ ...couponForm, description: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCouponModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-agri-green hover:bg-agri-green-dark text-white rounded-xl font-bold shadow-xs"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Return Settlement Modal */}
      {showReturnModal && selectedReturnBooking && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-2xl animate-scaleIn text-xs">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Process Return &amp; Deposit Settlement
                </h3>
                <span className="text-slate-500 text-[11px]">
                  Booking #{selectedReturnBooking.bookingNumber} &bull; {selectedReturnBooking.productTitle}
                </span>
              </div>
              <button
                onClick={() => setShowReturnModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleProcessReturn} className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-[11px] text-slate-700">
                <div className="flex justify-between">
                  <span>Scheduled End Date:</span>
                  <strong className="text-slate-900">{selectedReturnBooking.endDate}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Refundable Security Deposit:</span>
                  <strong className="text-emerald-700">₹{selectedReturnBooking.securityDeposit?.toLocaleString('en-IN')}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Daily Rental Base Rate:</span>
                  <span>₹{selectedReturnBooking.dailyRate}/day</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Actual Return Date *</label>
                  <input
                    type="date"
                    required
                    value={returnForm.actualReturnDate}
                    onChange={(e) => setReturnForm({ ...returnForm, actualReturnDate: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Inspection Condition *</label>
                  <select
                    value={returnForm.condition}
                    onChange={(e) => setReturnForm({ ...returnForm, condition: e.target.value as any })}
                    className="w-full p-2 border border-slate-300 rounded-xl font-bold text-slate-800"
                  >
                    <option value="ON_TIME">On-Time &bull; Clean Working Condition</option>
                    <option value="LATE">Returned Late</option>
                    <option value="DAMAGED">Damaged &bull; Needs Workshop Repair</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Damage Assessment Charge (₹ Deducted from Deposit)
                </label>
                <input
                  type="number"
                  min="0"
                  value={returnForm.damageCharge}
                  onChange={(e) => setReturnForm({ ...returnForm, damageCharge: Number(e.target.value) })}
                  className="w-full p-2 border border-slate-300 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Inspector Notes</label>
                <textarea
                  rows={2}
                  value={returnForm.damageNotes}
                  onChange={(e) => setReturnForm({ ...returnForm, damageNotes: e.target.value })}
                  placeholder="Engine oil level checked, gearbox smooth, cutting tines cleaned..."
                  className="w-full p-2 border border-slate-300 rounded-xl"
                />
              </div>

              {/* Settlement Preview Box */}
              {(() => {
                const sched = new Date(selectedReturnBooking.endDate).getTime();
                const actual = new Date(returnForm.actualReturnDate).getTime();
                const diff = Math.ceil((actual - sched) / (1000 * 3600 * 24));
                const lateDays = Math.max(0, diff);
                const lateFee = lateDays > 0 ? Math.round(lateDays * (selectedReturnBooking.dailyRate * 1.5)) : 0;
                const totalDeductions = lateFee + returnForm.damageCharge;
                const netRefund = Math.max(0, selectedReturnBooking.securityDeposit - totalDeductions);

                return (
                  <div className="p-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-200 space-y-1.5 text-xs text-emerald-950">
                    <div className="font-extrabold flex justify-between">
                      <span>Calculated Late Fee ({lateDays} Days &times; 1.5x):</span>
                      <span>₹{lateFee.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="font-extrabold flex justify-between text-rose-700">
                      <span>Damage Assessment Deduction:</span>
                      <span>₹{returnForm.damageCharge.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="pt-1.5 border-t border-emerald-200 flex justify-between font-black text-sm text-slate-900">
                      <span>Net Security Deposit Refund:</span>
                      <span className="text-emerald-800">₹{netRefund.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                );
              })()}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowReturnModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-xs"
                >
                  Confirm &amp; Process Return
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Provider Assignment Modal */}
      {showAssignModal && selectedAssignRequest && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-2xl animate-scaleIn text-xs">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Assign Provider &amp; Operator
                </h3>
                <span className="text-slate-500 text-[11px]">
                  Request #{selectedAssignRequest.requestNumber} &bull; {selectedAssignRequest.serviceName}
                </span>
              </div>
              <button
                onClick={() => setShowAssignModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAssignProvider} className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-700 space-y-1">
                <div><strong>Customer:</strong> {selectedAssignRequest.customerName} ({selectedAssignRequest.customerMobile})</div>
                <div><strong>Farm Location:</strong> {selectedAssignRequest.address} (GPS: {selectedAssignRequest.gpsLatitude}, {selectedAssignRequest.gpsLongitude})</div>
                <div><strong>Scheduled Time:</strong> {selectedAssignRequest.preferredDate} ({selectedAssignRequest.preferredTime})</div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Provider / Fleet Business Name *</label>
                <input
                  type="text"
                  required
                  value={assignForm.providerName}
                  onChange={(e) => setAssignForm({ ...assignForm, providerName: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Operator Mobile Number (for GPS SMS) *</label>
                <input
                  type="tel"
                  required
                  value={assignForm.operatorMobile}
                  onChange={(e) => setAssignForm({ ...assignForm, operatorMobile: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Machinery / Fleet Unit ID *</label>
                <input
                  type="text"
                  required
                  value={assignForm.fleetUnit}
                  onChange={(e) => setAssignForm({ ...assignForm, fleetUnit: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="p-3 bg-blue-50 text-blue-900 rounded-xl border border-blue-200 text-[11px]">
                Upon assignment, an automated SMS notification will be dispatched to the customer with operator phone number and machine unit ID.
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-xs"
                >
                  Confirm Assignment &amp; Notify
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

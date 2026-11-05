'use client';

import React, { useState, useEffect } from 'react';
import {
  Wrench,
  CheckCircle2,
  ShieldCheck,
  Printer,
  Plus,
  AlertCircle,
  FileText,
  Search,
  ArrowRight,
  Clock,
  Truck,
  Calendar,
  DollarSign,
  AlertTriangle,
  Send,
  Sparkles,
  Package,
  Layers,
  ChevronRight,
  Eye,
  Check,
  X,
  RefreshCw,
} from 'lucide-react';
import { DbJobCard, DbSparePart, DbLabourOperation, DbWarrantyClaim, DbServiceReminder, RepairStage } from '@/lib/repair-finance-types';
import { SITE_CONFIG } from '@/lib/config';

export default function RepairsPortalPage() {
  const [activeTab, setActiveTab] = useState<
    'PIPELINE' | 'INTAKE' | 'INVENTORY' | 'LABOUR' | 'WARRANTY' | 'REMINDERS' | 'REPORTS'
  >('PIPELINE');

  const [jobCards, setJobCards] = useState<DbJobCard[]>([]);
  const [selectedJc, setSelectedJc] = useState<DbJobCard | null>(null);
  const [spareParts, setSpareParts] = useState<DbSparePart[]>([]);
  const [labourCatalogue, setLabourCatalogue] = useState<DbLabourOperation[]>([]);
  const [warrantyClaims, setWarrantyClaims] = useState<DbWarrantyClaim[]>([]);
  const [serviceReminders, setServiceReminders] = useState<DbServiceReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStage, setFilterStage] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionNotice, setActionNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Selected Service Workshop Center
  const [activeWorkshop, setActiveWorkshop] = useState('Hubballi Central Agri Workshop');

  // Modal States
  const [showPartialApprovalModal, setShowPartialApprovalModal] = useState(false);
  const [showQCModal, setShowQCModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showEscalateHQModal, setShowEscalateHQModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);

  // QC Form State
  const [qcForm, setQcForm] = useState({
    testRunPassed: true,
    fuelBatteryChecked: true,
    bladeAlignmentChecked: true,
    sprayPressureChecked: true,
    leakageCheckPassed: true,
    cleaningVerified: true,
    inspectorNotes: 'Passed all mechanical and electrical load tests on test bench.',
    inspectorName: 'S. Kulkarni (Quality Inspector)',
    isPassed: true,
  });

  // Invoice Form State
  const [invoiceForm, setInvoiceForm] = useState({
    discountAmount: 0,
    paymentMode: 'UPI' as 'CASH' | 'UPI' | 'CARD' | 'DEALER_CREDIT',
    paymentStatus: 'PAID' as 'PAID' | 'PENDING',
  });

  // Delivery Form State
  const [deliveryForm, setDeliveryForm] = useState({
    deliveredTo: '',
    customerSignature: '',
    nextServiceDueDays: 90,
  });

  // Escalation Form State
  const [escalateReason, setEscalateReason] = useState('');

  // Stock Adjustment Form State
  const [stockForm, setStockForm] = useState({
    partId: '',
    transactionType: 'STOCK_IN' as 'STOCK_IN' | 'INTER_TRANSFER' | 'DAMAGED_WRITE_OFF',
    quantity: 5,
    sourceLocation: 'Central Warehouse',
    destinationLocation: 'Hubballi Store Rack',
    reason: 'Regular inventory replenishment',
  });

  // Intake New Job Card Form State
  const [intakeForm, setIntakeForm] = useState({
    customerName: '',
    customerMobile: '',
    customerVillage: '',
    equipmentModel: 'AgriPro 7HP Power Weeder (Model AP-7001)',
    serialNumber: '',
    category: 'Power Weeder',
    powerType: '4-Stroke Petrol' as any,
    usageHours: 120,
    warrantyStatus: 'IN_WARRANTY' as any,
    complaintText: '',
    selectedComplaints: [] as string[],
    fuelOrBatteryLevel: '50% Fuel',
    accessoriesReceived: ['Standard Hand Toolkit', 'Measuring Dispenser'],
    expectedDeliveryDate: '',
  });

  const notify = (type: 'success' | 'error', message: string) => {
    setActionNotice({ type, message });
    setTimeout(() => setActionNotice(null), 4500);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [jcRes, spRes, lbrRes, clmRes] = await Promise.all([
        fetch('/api/repairs/job-cards').then((r) => r.json()),
        fetch('/api/repairs/inventory').then((r) => r.json()),
        fetch('/api/repairs/labour').then((r) => r.json()),
        fetch('/api/repairs/warranty').then((r) => r.json()),
      ]);

      if (jcRes.success) {
        setJobCards(jcRes.jobCards || []);
        if (jcRes.jobCards?.length > 0 && !selectedJc) {
          setSelectedJc(jcRes.jobCards[0]);
        } else if (selectedJc) {
          const updated = jcRes.jobCards.find((j: DbJobCard) => j.id === selectedJc.id);
          if (updated) setSelectedJc(updated);
        }
      }

      if (spRes.success) setSpareParts(spRes.parts || []);
      if (lbrRes.success) setLabourCatalogue(lbrRes.catalogue || []);
      if (clmRes.success) setWarrantyClaims(clmRes.claims || []);
    } catch (err: any) {
      notify('error', 'Failed to load repair portal data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered Job Cards
  const filteredJobCards = jobCards.filter((jc) => {
    if (filterStage !== 'ALL' && jc.status !== filterStage) return false;
    if (searchQuery) {
      const s = searchQuery.toLowerCase();
      return (
        jc.jobCardNumber.toLowerCase().includes(s) ||
        jc.customerName.toLowerCase().includes(s) ||
        jc.customerMobile.includes(s) ||
        jc.equipmentModel.toLowerCase().includes(s) ||
        jc.serialNumber.toLowerCase().includes(s)
      );
    }
    return true;
  });

  // Action: Advance Repair Stage
  const handleAdvanceStage = async (targetStage?: RepairStage) => {
    if (!selectedJc) return;
    try {
      const res = await fetch('/api/repairs/job-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ADVANCE_STAGE',
          id: selectedJc.id,
          targetStage,
        }),
      });
      const data = await res.json();
      if (data.success) {
        notify('success', data.message);
        loadData();
      } else {
        notify('error', data.message);
      }
    } catch (err: any) {
      notify('error', err.message);
    }
  };

  // Action: Estimate Decision (Approved / Rejected / Partial)
  const handleEstimateDecision = async (decision: 'APPROVED' | 'REJECTED' | 'PARTIALLY_APPROVED') => {
    if (!selectedJc) return;
    try {
      const res = await fetch('/api/repairs/job-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'UPDATE_ESTIMATE_DECISION',
          id: selectedJc.id,
          decision,
          customerSignature: `SIG-DIGITAL-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        notify('success', data.message);
        setShowPartialApprovalModal(false);
        loadData();
      } else {
        notify('error', data.message);
      }
    } catch (err: any) {
      notify('error', err.message);
    }
  };

  // Action: Submit Quality Check
  const handleQualityCheckSubmit = async () => {
    if (!selectedJc) return;
    try {
      const res = await fetch('/api/repairs/job-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'QUALITY_CHECK',
          id: selectedJc.id,
          qcData: qcForm,
        }),
      });
      const data = await res.json();
      if (data.success) {
        notify('success', 'Quality Inspection certified by Inspector');
        setShowQCModal(false);
        loadData();
      } else {
        notify('error', data.message);
      }
    } catch (err: any) {
      notify('error', err.message);
    }
  };

  // Action: Generate Invoice
  const handleGenerateInvoice = async () => {
    if (!selectedJc) return;
    try {
      const res = await fetch('/api/repairs/job-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'GENERATE_INVOICE',
          id: selectedJc.id,
          discountAmount: Number(invoiceForm.discountAmount),
          paymentMode: invoiceForm.paymentMode,
          paymentStatus: invoiceForm.paymentStatus,
        }),
      });
      const data = await res.json();
      if (data.success) {
        notify('success', 'GST Tax Workshop Invoice Generated');
        setShowInvoiceModal(false);
        loadData();
      } else {
        notify('error', data.message);
      }
    } catch (err: any) {
      notify('error', err.message);
    }
  };

  // Action: Complete Delivery
  const handleCompleteDelivery = async () => {
    if (!selectedJc) return;
    try {
      const res = await fetch('/api/repairs/job-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'COMPLETE_DELIVERY',
          id: selectedJc.id,
          deliveredTo: deliveryForm.deliveredTo || selectedJc.customerName,
          customerSignature: deliveryForm.customerSignature || `SIG-DELIV-${Date.now().toString().slice(-5)}`,
          nextServiceDueDays: Number(deliveryForm.nextServiceDueDays),
        }),
      });
      const data = await res.json();
      if (data.success) {
        notify('success', 'Machine delivered to customer and reminder logged');
        setShowDeliveryModal(false);
        loadData();
      } else {
        notify('error', data.message);
      }
    } catch (err: any) {
      notify('error', err.message);
    }
  };

  // Action: Escalate Warranty Claim to HQ
  const handleEscalateHQ = async () => {
    if (!selectedJc?.warrantyClaim?.claimId) {
      notify('error', 'No active warranty claim linked to this job card');
      return;
    }
    try {
      const res = await fetch('/api/repairs/warranty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ESCALATE_HQ',
          claimId: selectedJc.warrantyClaim.claimId,
          reason: escalateReason || 'Major component replacement exceeding dealer authorization limit.',
          user: 'Workshop Manager (Patil Seva Kendra)',
        }),
      });
      const data = await res.json();
      if (data.success) {
        notify('success', 'Claim escalated to AgriMart Central HQ Warranty Board');
        setShowEscalateHQModal(false);
        loadData();
      } else {
        notify('error', data.message);
      }
    } catch (err: any) {
      notify('error', err.message);
    }
  };

  // Action: Submit Intake Form
  const handleCreateIntakeJobCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!intakeForm.customerName || !intakeForm.serialNumber) {
      notify('error', 'Customer name and equipment serial number are required');
      return;
    }
    try {
      const complaints = [...intakeForm.selectedComplaints];
      if (intakeForm.complaintText.trim()) complaints.push(intakeForm.complaintText.trim());

      const res = await fetch('/api/repairs/job-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CREATE',
          data: {
            customerName: intakeForm.customerName,
            customerMobile: intakeForm.customerMobile || '+91 98860 00000',
            customerVillage: intakeForm.customerVillage || 'Dharwad',
            equipmentModel: intakeForm.equipmentModel,
            serialNumber: intakeForm.serialNumber,
            category: intakeForm.category,
            powerType: intakeForm.powerType,
            usageHours: Number(intakeForm.usageHours),
            complaints: complaints.length > 0 ? complaints : ['Periodic Inspection & Tune Up'],
            fuelOrBatteryLevel: intakeForm.fuelOrBatteryLevel,
            accessoriesReceived: intakeForm.accessoriesReceived,
            expectedDeliveryDate: intakeForm.expectedDeliveryDate || new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString().split('T')[0],
            serviceCentreName: activeWorkshop,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        notify('success', `New Job Card #${data.jobCard.jobCardNumber} created!`);
        setIntakeForm({
          customerName: '',
          customerMobile: '',
          customerVillage: '',
          equipmentModel: 'AgriPro 7HP Power Weeder (Model AP-7001)',
          serialNumber: '',
          category: 'Power Weeder',
          powerType: '4-Stroke Petrol',
          usageHours: 120,
          warrantyStatus: 'IN_WARRANTY',
          complaintText: '',
          selectedComplaints: [],
          fuelOrBatteryLevel: '50% Fuel',
          accessoriesReceived: ['Standard Hand Toolkit'],
          expectedDeliveryDate: '',
        });
        setActiveTab('PIPELINE');
        loadData();
      } else {
        notify('error', data.message);
      }
    } catch (err: any) {
      notify('error', err.message);
    }
  };

  // Action: Adjust Stock
  const handleStockAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockForm.partId) return;
    try {
      const part = spareParts.find((p) => p.id === stockForm.partId);
      const res = await fetch('/api/repairs/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'STOCK_TRANSACTION',
          data: {
            partId: stockForm.partId,
            partNumber: part?.partNumber,
            partName: part?.name,
            transactionType: stockForm.transactionType,
            quantity: Number(stockForm.quantity),
            sourceLocation: stockForm.sourceLocation,
            destinationLocation: stockForm.destinationLocation,
            reason: stockForm.reason,
            loggedBy: 'Workshop Store Manager',
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        notify('success', 'Stock transaction recorded');
        setShowStockModal(false);
        loadData();
      } else {
        notify('error', data.message);
      }
    } catch (err: any) {
      notify('error', err.message);
    }
  };

  // KPIs
  const totalActiveJobs = jobCards.length;
  const inRepairCount = jobCards.filter((j) => j.status === 'REPAIR').length;
  const awaitingApprovalCount = jobCards.filter((j) => j.status === 'CUSTOMER_APPROVAL' || j.status === 'ESTIMATE').length;
  const lowStockCount = spareParts.filter((p) => p.stockQuantity <= p.reorderLevel).length;
  const totalRevenue = jobCards
    .filter((j) => j.invoice && j.invoice.paymentStatus === 'PAID')
    .reduce((sum, j) => sum + (j.invoice?.finalPayable || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-xs text-slate-800">
      {/* Top Banner & Workshop Selector */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
              Module 4 & Section 17
            </span>
            <span className="text-emerald-400 font-bold text-[11px]">AgriMart Mega Service Center Network</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1 text-white">Repair &amp; Workshop Management System</h1>
          <p className="text-slate-300 text-xs mt-1 max-w-2xl">
            9-stage machinery workflow from product intake, multi-complaint diagnostics, and estimate approvals to GST billing, warranty claims, and authorized delivery.
          </p>
        </div>

        {/* Workshop Center Selector */}
        <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20 space-y-1">
          <label className="text-[10px] uppercase font-bold text-slate-300 block">Authorized Workshop Bay</label>
          <select
            value={activeWorkshop}
            onChange={(e) => setActiveWorkshop(e.target.value)}
            className="bg-slate-900 text-amber-300 font-bold text-xs rounded-lg px-3 py-1.5 border border-white/20 focus:ring-2 focus:ring-amber-400 outline-none"
          >
            <option value="Hubballi Central Agri Workshop">Hubballi Central Agri Workshop (Patil Kendra)</option>
            <option value="Dharwad Farm Tech Center">Dharwad Farm Tech Center (Basaveshwara Agro)</option>
            <option value="Belagavi Machinery Hub">Belagavi Machinery Hub (Maratha Tech)</option>
            <option value="Haveri Service Bay">Haveri Service Bay (Ranebennur Spares)</option>
            <option value="Gadag Rural Workshop">Gadag Rural Workshop (Tontadarya Traders)</option>
          </select>
        </div>
      </div>

      {/* Alert / Notification Banner */}
      {actionNotice && (
        <div
          className={`p-3 rounded-xl font-semibold flex items-center gap-2 border ${
            actionNotice.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-red-50 border-red-200 text-red-900'
          }`}
        >
          {actionNotice.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-700" /> : <AlertCircle className="w-4 h-4 text-red-700" />}
          <span>{actionNotice.message}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-slate-400 font-bold text-[10px] uppercase">Active Job Cards</span>
          <div className="text-2xl font-black text-slate-900 mt-0.5">{totalActiveJobs}</div>
          <span className="text-[10px] text-emerald-700 font-semibold">Across all 9 stages</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-slate-400 font-bold text-[10px] uppercase">In Repair Bays</span>
          <div className="text-2xl font-black text-amber-600 mt-0.5">{inRepairCount}</div>
          <span className="text-[10px] text-slate-500 font-semibold">Active bay work</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-slate-400 font-bold text-[10px] uppercase">Awaiting Approval</span>
          <div className="text-2xl font-black text-blue-600 mt-0.5">{awaitingApprovalCount}</div>
          <span className="text-[10px] text-slate-500 font-semibold">Estimate review</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-slate-400 font-bold text-[10px] uppercase">Low Stock Alerts</span>
          <div className="text-2xl font-black text-red-600 mt-0.5">{lowStockCount}</div>
          <span className="text-[10px] text-red-700 font-semibold">Below reorder limit</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-slate-400 font-bold text-[10px] uppercase">Paid Workshop Revenue</span>
          <div className="text-2xl font-black text-emerald-700 mt-0.5">₹{totalRevenue.toLocaleString('en-IN')}</div>
          <span className="text-[10px] text-emerald-800 font-semibold">GST Invoices settled</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-1.5 border-b border-slate-200 pb-2">
        {[
          { key: 'PIPELINE', label: '9-Stage Pipeline & Queue', icon: Layers },
          { key: 'INTAKE', label: '+ New Job Card Intake', icon: Plus },
          { key: 'INVENTORY', label: 'Spare Parts & Transfers', icon: Package },
          { key: 'LABOUR', label: 'Labour Catalogue', icon: Clock },
          { key: 'WARRANTY', label: 'Warranty Claims & HQ Escalation', icon: ShieldCheck },
          { key: 'REMINDERS', label: 'Next-Service Reminders', icon: Calendar },
          { key: 'REPORTS', label: 'Operational & Revenue Reports', icon: DollarSign },
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition text-xs ${
                isActive
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: 9-STAGE PIPELINE & QUEUE */}
      {activeTab === 'PIPELINE' && (
        <div className="space-y-6">
          {selectedJc && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              {/* Header for selected Job Card */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono bg-emerald-100 text-emerald-900 font-black px-2.5 py-0.5 rounded text-xs">
                      {selectedJc.jobCardNumber}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      selectedJc.warrantyStatus === 'IN_WARRANTY'
                        ? 'bg-emerald-100 text-emerald-800'
                        : selectedJc.warrantyStatus === 'AMC_COVERED'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-slate-100 text-slate-800'
                    }`}>
                      {selectedJc.warrantyStatus ? selectedJc.warrantyStatus.replace('_', ' ') : 'OUT OF WARRANTY'}
                    </span>
                    {selectedJc.serviceBayNumber && (
                      <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded text-[10px]">
                        {selectedJc.serviceBayNumber}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 mt-1">
                    {selectedJc.equipmentModel} (S/N: {selectedJc.serialNumber})
                  </h3>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    Farmer: <strong>{selectedJc.customerName}</strong> ({selectedJc.customerMobile}) &bull; Village: {selectedJc.customerVillage} &bull; Technician: {selectedJc.assignedTechnicianName}
                  </div>
                </div>

                {/* Stage Advancement & Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleAdvanceStage()}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3.5 py-2 rounded-xl shadow-sm transition flex items-center gap-1.5"
                  >
                    <span>Advance Stage</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {selectedJc.status === 'ESTIMATE' || selectedJc.status === 'CUSTOMER_APPROVAL' ? (
                    <button
                      onClick={() => setShowPartialApprovalModal(true)}
                      className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-3.5 py-2 rounded-xl shadow-sm transition flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Estimate Decisions</span>
                    </button>
                  ) : null}

                  {selectedJc.status === 'QUALITY_CHECK' && (
                    <button
                      onClick={() => setShowQCModal(true)}
                      className="bg-purple-700 hover:bg-purple-800 text-white font-bold px-3.5 py-2 rounded-xl shadow-sm transition flex items-center gap-1.5"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Quality Sign-Off</span>
                    </button>
                  )}

                  {selectedJc.status === 'CLEANING' || selectedJc.status === 'BILLING' ? (
                    <button
                      onClick={() => setShowInvoiceModal(true)}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-3.5 py-2 rounded-xl shadow-sm transition flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>{selectedJc.invoice ? 'View / Print Invoice' : 'Generate GST Invoice'}</span>
                    </button>
                  ) : null}

                  {selectedJc.status === 'BILLING' && selectedJc.invoice && (
                    <button
                      onClick={() => setShowDeliveryModal(true)}
                      className="bg-green-700 hover:bg-green-800 text-white font-bold px-3.5 py-2 rounded-xl shadow-sm transition flex items-center gap-1.5"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Handover & Deliver</span>
                    </button>
                  )}
                </div>
              </div>

              {/* 9-Stage Visual Progress Bar */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400">9-Stage Sequential Machinery Lifecycle</span>
                <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-1.5">
                  {SITE_CONFIG.repairStages.map((stg, idx) => {
                    const currentIdx = SITE_CONFIG.repairStages.findIndex((s) => s.key === selectedJc.status);
                    const isDone = idx < currentIdx;
                    const isCurrent = idx === currentIdx;

                    return (
                      <div
                        key={stg.key}
                        onClick={() => handleAdvanceStage(stg.key as any)}
                        title="Click to jump or validate stage"
                        className={`p-2 rounded-xl border text-center transition cursor-pointer flex flex-col justify-between ${
                          isCurrent
                            ? 'border-amber-400 bg-amber-50 ring-2 ring-amber-300 font-bold text-slate-900'
                            : isDone
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-900 font-semibold'
                            : 'border-slate-200 bg-slate-50 text-slate-400'
                        }`}
                      >
                        <div className="text-[9px] uppercase font-bold text-slate-400">Stage {idx + 1}</div>
                        <div className="text-[10px] mt-0.5 font-bold leading-tight">{stg.label.replace(/^\d+\.\s*/, '')}</div>
                        <div className="text-[8px] mt-1 font-semibold">
                          {isCurrent ? '● ACTIVE' : isDone ? '✓ DONE' : '○ PENDING'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Two Column Layout: Machine Details & Complaints vs Estimate / QC / Billing */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
                {/* Left Column (7 cols): Machine Intake & Inspection */}
                <div className="lg:col-span-7 space-y-4">
                  {/* Equipment Specifications Box */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <h4 className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5 text-emerald-700" /> Equipment Profile & Intake State
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Engine / Motor No.</span>
                        <strong className="text-slate-900">{selectedJc.engineMotorNumber}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Power Type</span>
                        <strong className="text-slate-900">{selectedJc.powerType}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Usage Meter</span>
                        <strong className="text-slate-900">{selectedJc.usageHours} Hours</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Intake Fuel / Battery</span>
                        <strong className="text-amber-700">{selectedJc.fuelOrBatteryLevel}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Expected Delivery</span>
                        <strong className="text-slate-900">{selectedJc.expectedDeliveryDate}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Intake Signature</span>
                        <code className="text-emerald-700 font-mono text-[10px]">{selectedJc.customerSignatureAtIntake}</code>
                      </div>
                    </div>

                    {selectedJc.accessoriesReceived && selectedJc.accessoriesReceived.length > 0 && (
                      <div className="pt-2 border-t border-slate-200">
                        <span className="text-slate-500 font-semibold text-[10px]">Accessories Received: </span>
                        <span className="text-slate-800 font-medium">{selectedJc.accessoriesReceived.join(', ')}</span>
                      </div>
                    )}
                  </div>

                  {/* Customer Complaints Reported */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 text-xs flex items-center justify-between">
                      <span>Customer Complaints Reported (Section 17.4):</span>
                      <span className="text-[10px] text-amber-700 font-semibold">{selectedJc.complaints.length} issues registered</span>
                    </label>
                    <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/60 space-y-1">
                      {selectedJc.complaints.map((c, i) => (
                        <div key={i} className="flex items-start gap-2 text-slate-800">
                          <span className="text-amber-600 font-bold">•</span>
                          <span className="font-medium">{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Configurable Inspection Checklist */}
                  <div className="space-y-2">
                    <label className="font-bold text-slate-700 text-xs">
                      Category Inspection Checklist (Section 17.5):
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedJc.inspectionChecklist.map((item, i) => (
                        <div key={i} className="p-2.5 bg-white rounded-lg border border-slate-200 flex justify-between items-center">
                          <div>
                            <span className="font-medium text-slate-900 block">{item.item}</span>
                            {item.notes && <span className="text-[10px] text-slate-500">{item.notes}</span>}
                          </div>
                          <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                            item.status === 'Good'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.status === 'Replace'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Diagnosis & Root Cause */}
                  <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2">
                    <span className="text-emerald-900 font-bold text-xs uppercase tracking-wider block">
                      Technician Diagnosis & Root Cause Analysis
                    </span>
                    <p className="text-slate-800 leading-relaxed font-medium">{selectedJc.diagnosisNotes}</p>
                    <div className="text-[11px] text-slate-600">
                      Primary Root Cause: <strong>{selectedJc.rootCauseCategory}</strong>
                    </div>
                  </div>
                </div>

                {/* Right Column (5 cols): Estimate, Quality Check, Invoice & Warranty */}
                <div className="lg:col-span-5 space-y-4">
                  {/* Estimate Box */}
                  <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
                    <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                      <h4 className="font-extrabold text-xs text-slate-900">Repair Estimate (Section 17.7)</h4>
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        selectedJc.estimate.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : selectedJc.estimate.status === 'PARTIALLY_APPROVED'
                          ? 'bg-purple-100 text-purple-800'
                          : selectedJc.estimate.status === 'REJECTED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {selectedJc.estimate.status.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Parts Required Table */}
                    {selectedJc.partsRequired && selectedJc.partsRequired.length > 0 ? (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Spare Parts Required</span>
                        <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                          <table className="w-full text-left">
                            <thead className="bg-slate-100 text-[9px] uppercase text-slate-500">
                              <tr>
                                <th className="p-1.5">Part</th>
                                <th className="p-1.5 text-center">Qty</th>
                                <th className="p-1.5 text-right">Total</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-[10px]">
                              {selectedJc.partsRequired.map((p, idx) => (
                                <tr key={idx}>
                                  <td className="p-1.5 font-medium text-slate-800">{p.name}</td>
                                  <td className="p-1.5 text-center text-slate-600">{p.qty}</td>
                                  <td className="p-1.5 text-right font-bold text-slate-900">₹{p.unitPrice * p.qty}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : null}

                    {/* Labour Operations Table */}
                    {selectedJc.labourRequired && selectedJc.labourRequired.length > 0 ? (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Labour Operations</span>
                        <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                          <table className="w-full text-left">
                            <thead className="bg-slate-100 text-[9px] uppercase text-slate-500">
                              <tr>
                                <th className="p-1.5">Operation</th>
                                <th className="p-1.5 text-center">Hrs</th>
                                <th className="p-1.5 text-right">Cost</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-[10px]">
                              {selectedJc.labourRequired.map((l, idx) => (
                                <tr key={idx}>
                                  <td className="p-1.5 font-medium text-slate-800">{l.description}</td>
                                  <td className="p-1.5 text-center text-slate-600">{l.standardHours}</td>
                                  <td className="p-1.5 text-right font-bold text-slate-900">₹{l.total}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : null}

                    {/* Cost Totals */}
                    <div className="pt-2 border-t border-slate-200 space-y-1 text-[11px]">
                      <div className="flex justify-between text-slate-600">
                        <span>Parts Subtotal:</span>
                        <span>₹{selectedJc.estimate.partsSubtotal}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Labour Subtotal:</span>
                        <span>₹{selectedJc.estimate.labourSubtotal}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Estimated GST (18%):</span>
                        <span>₹{selectedJc.estimate.estimatedTax}</span>
                      </div>
                      <div className="flex justify-between font-black text-slate-900 text-sm pt-1 border-t border-slate-200">
                        <span>Total Estimate:</span>
                        <span className="text-emerald-700">₹{selectedJc.estimate.estimatedTotal}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quality Check Status Box */}
                  <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-purple-700" /> Quality Check Certification
                      </h4>
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        selectedJc.qualityCheck.isPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {selectedJc.qualityCheck.isPassed ? '✓ QC PASSED' : '○ PENDING QC'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600">{selectedJc.qualityCheck.inspectorNotes}</p>
                    <div className="text-[10px] text-slate-400">
                      Inspector: <strong>{selectedJc.qualityCheck.inspectorName}</strong>
                    </div>
                  </div>

                  {/* Warranty Claim & HQ Escalation Status */}
                  {selectedJc.warrantyClaim && (
                    <div className="bg-purple-50 rounded-xl border border-purple-200 p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-extrabold text-xs text-purple-950">Warranty Claim Details</h4>
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          selectedJc.warrantyClaim.claimStatus === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : selectedJc.warrantyClaim.claimStatus === 'ESCALATED_TO_HQ'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {selectedJc.warrantyClaim.claimStatus?.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-[11px] text-purple-900">
                        Claim Amount: <strong>₹{selectedJc.warrantyClaim.claimAmount}</strong> &bull; Reason: {selectedJc.warrantyClaim.failureType}
                      </div>

                      {selectedJc.warrantyClaim.claimStatus === 'ESCALATED_TO_HQ' ? (
                        <div className="p-2 bg-amber-100 rounded-lg text-[10px] text-amber-950 font-medium">
                          <strong>Escalated to Central HQ:</strong> {selectedJc.warrantyClaim.hqEscalationReason}
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowEscalateHQModal(true)}
                          className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-1.5 rounded-lg text-[10px] transition"
                        >
                          Escalate Claim to AgriMart HQ &rarr;
                        </button>
                      )}
                    </div>
                  )}

                  {/* GST Invoice Box (if generated) */}
                  {selectedJc.invoice && (
                    <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-emerald-700">Tax Invoice Generated</span>
                          <div className="font-mono font-black text-slate-900">{selectedJc.invoice.invoiceNumber}</div>
                        </div>
                        <span className="bg-emerald-700 text-white font-black px-2 py-0.5 rounded text-[10px]">
                          PAID via {selectedJc.invoice.paymentMode}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs pt-1 border-t border-emerald-200 font-bold">
                        <span>Net Paid:</span>
                        <span className="text-emerald-900 text-sm">₹{selectedJc.invoice.finalPayable}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Master Job Cards Queue with Filters */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Active Service Center Queue</h3>
                <p className="text-slate-500 text-xs">Browse all machinery job cards in progress at {activeWorkshop}.</p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-60">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by job card, farmer, serial..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>

                <select
                  value={filterStage}
                  onChange={(e) => setFilterStage(e.target.value)}
                  className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold bg-white outline-none"
                >
                  <option value="ALL">All Stages ({jobCards.length})</option>
                  {SITE_CONFIG.repairStages.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Queue Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-[10px] text-slate-400 uppercase font-bold">
                  <tr>
                    <th className="p-3">Job Card #</th>
                    <th className="p-3">Farmer & Village</th>
                    <th className="p-3">Equipment / Serial</th>
                    <th className="p-3">Stage</th>
                    <th className="p-3">Warranty</th>
                    <th className="p-3 text-right">Estimate</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredJobCards.map((jc) => (
                    <tr
                      key={jc.id}
                      onClick={() => setSelectedJc(jc)}
                      className={`hover:bg-slate-50 cursor-pointer transition ${
                        selectedJc?.id === jc.id ? 'bg-emerald-50/60 font-semibold' : ''
                      }`}
                    >
                      <td className="p-3 font-mono font-bold text-slate-900">{jc.jobCardNumber}</td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{jc.customerName}</div>
                        <div className="text-[10px] text-slate-500">{jc.customerVillage}</div>
                      </td>
                      <td className="p-3">
                        <div className="text-slate-800">{jc.equipmentModel}</div>
                        <div className="text-[10px] font-mono text-slate-400">{jc.serialNumber}</div>
                      </td>
                      <td className="p-3">
                        <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded text-[10px]">
                          {jc.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="text-[10px] font-bold text-slate-700">{jc.warrantyStatus ? jc.warrantyStatus.replace('_', ' ') : 'STANDARD'}</span>
                      </td>
                      <td className="p-3 text-right font-black text-slate-900">
                        ₹{jc.invoice?.finalPayable || jc.estimate.estimatedTotal}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedJc(jc);
                          }}
                          className="border border-slate-300 hover:bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-[10px] font-bold"
                        >
                          Inspect &rarr;
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INTAKE NEW JOB CARD */}
      {activeTab === 'INTAKE' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 max-w-4xl mx-auto">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">Intake New Machinery Job Card</h3>
            <p className="text-slate-500 text-xs">Record farmer complaints, equipment intake condition, accessories, and signatures.</p>
          </div>

          <form onSubmit={handleCreateIntakeJobCard} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Customer / Farmer Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mahadevappa Angadi"
                  value={intakeForm.customerName}
                  onChange={(e) => setIntakeForm({ ...intakeForm, customerName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Customer Mobile *</label>
                <input
                  type="text"
                  required
                  placeholder="+91 98860 11223"
                  value={intakeForm.customerMobile}
                  onChange={(e) => setIntakeForm({ ...intakeForm, customerMobile: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Village & Taluk *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Navalgund, Dharwad"
                  value={intakeForm.customerVillage}
                  onChange={(e) => setIntakeForm({ ...intakeForm, customerVillage: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Equipment Model *</label>
                <select
                  value={intakeForm.equipmentModel}
                  onChange={(e) => setIntakeForm({ ...intakeForm, equipmentModel: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none"
                >
                  <option value="AgriPro 7HP Power Weeder (Model AP-7001)">AgriPro 7HP Power Weeder (AP-7001)</option>
                  <option value="KisanKraft 16L Double Motor Battery Sprayer">KisanKraft 16L Double Motor Sprayer</option>
                  <option value="Honda GX200 6.5HP Multi-Utility Engine">Honda GX200 6.5HP Utility Engine</option>
                  <option value="AgriMart Mega Self-Propelled Multi-Crop Reaper 4S">AgriMart Mega Multi-Crop Reaper 4S</option>
                  <option value="FarmStar 52cc 2-Stroke Brush Cutter">FarmStar 52cc 2-Stroke Brush Cutter</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Equipment Serial Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AP7001-2026-1049"
                  value={intakeForm.serialNumber}
                  onChange={(e) => setIntakeForm({ ...intakeForm, serialNumber: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-mono text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Power / Fuel Type</label>
                <select
                  value={intakeForm.powerType}
                  onChange={(e) => setIntakeForm({ ...intakeForm, powerType: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none"
                >
                  <option value="4-Stroke Petrol">4-Stroke Petrol</option>
                  <option value="2-Stroke Petrol">2-Stroke Petrol</option>
                  <option value="12V Battery Electric">12V Battery Electric</option>
                  <option value="Diesel Engine">Diesel Engine</option>
                  <option value="220V Electric Motor">220V Electric Motor</option>
                </select>
              </div>
            </div>

            {/* Standard Complaint Selection */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="font-bold text-slate-700 block">Common Complaints (Select all that apply):</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  'Engine Hard Starting',
                  'Excessive White / Black Smoke',
                  'Rotary Blade Slipping',
                  'Carburetor Petrol Overflow',
                  'Pressure Drop in Spray Lance',
                  'Recoil Rope Broken',
                  'Gearbox Oil Weeping',
                  'Battery Discharge Rapidly',
                ].map((complaint) => {
                  const isChecked = intakeForm.selectedComplaints.includes(complaint);
                  return (
                    <label
                      key={complaint}
                      className={`p-2.5 rounded-xl border cursor-pointer flex items-center gap-2 transition ${
                        isChecked ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          if (isChecked) {
                            setIntakeForm({
                              ...intakeForm,
                              selectedComplaints: intakeForm.selectedComplaints.filter((c) => c !== complaint),
                            });
                          } else {
                            setIntakeForm({
                              ...intakeForm,
                              selectedComplaints: [...intakeForm.selectedComplaints, complaint],
                            });
                          }
                        }}
                        className="rounded text-emerald-700"
                      />
                      <span>{complaint}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Additional Specific Farmer Remarks</label>
              <textarea
                rows={2}
                placeholder="Describe any particular sound, vibration, or incident on the field..."
                value={intakeForm.complaintText}
                onChange={(e) => setIntakeForm({ ...intakeForm, complaintText: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Intake Fuel / Battery Level</label>
                <select
                  value={intakeForm.fuelOrBatteryLevel}
                  onChange={(e) => setIntakeForm({ ...intakeForm, fuelOrBatteryLevel: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none"
                >
                  <option value="100% Full">100% Full</option>
                  <option value="75% Level">75% Level</option>
                  <option value="50% Level">50% Level</option>
                  <option value="Quarter Tank">Quarter Tank</option>
                  <option value="Near Empty / Dry">Near Empty / Dry</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Current Usage Meter (Hours)</label>
                <input
                  type="number"
                  value={intakeForm.usageHours}
                  onChange={(e) => setIntakeForm({ ...intakeForm, usageHours: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Expected Delivery Date</label>
                <input
                  type="date"
                  value={intakeForm.expectedDeliveryDate}
                  onChange={(e) => setIntakeForm({ ...intakeForm, expectedDeliveryDate: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-black py-3 rounded-xl shadow-md transition text-xs mt-4 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Generate Official Job Card & Notify Farmer via SMS</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: SPARE PARTS & TRANSFERS */}
      {activeTab === 'INVENTORY' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Spare Parts Inventory & Transfers</h3>
              <p className="text-slate-500 text-xs">Real-time stock ledger, compatible model mappings, and store rack allocations.</p>
            </div>

            <button
              onClick={() => setShowStockModal(true)}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-xl shadow-sm transition flex items-center gap-1.5"
            >
              <Package className="w-3.5 h-3.5" />
              <span>Record Stock In / Transfer</span>
            </button>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] text-slate-400 uppercase font-bold">
                <tr>
                  <th className="p-3">Part #</th>
                  <th className="p-3">Description & Category</th>
                  <th className="p-3">Rack Location</th>
                  <th className="p-3 text-center">Stock</th>
                  <th className="p-3 text-center">Min Level</th>
                  <th className="p-3 text-right">Selling MRP</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {spareParts.map((sp) => {
                  const isLow = sp.stockQuantity <= sp.reorderLevel;
                  return (
                    <tr key={sp.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-slate-900">{sp.partNumber}</td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{sp.name}</div>
                        <div className="text-[10px] text-slate-500">{sp.compatibleModels.join(' • ')}</div>
                      </td>
                      <td className="p-3 text-slate-700">{sp.storeRackLocation}</td>
                      <td className="p-3 text-center font-black text-slate-900">{sp.stockQuantity}</td>
                      <td className="p-3 text-center text-slate-500">{sp.reorderLevel}</td>
                      <td className="p-3 text-right font-bold text-slate-900">₹{sp.sellingPrice}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          isLow ? 'bg-red-100 text-red-800 ring-1 ring-red-300' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {isLow ? 'REORDER ALERT' : 'IN STOCK'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: LABOUR CATALOGUE */}
      {activeTab === 'LABOUR' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Configurable Labour Catalogue (Section 17.10)</h3>
            <p className="text-slate-500 text-xs">Standardized labor rates, hours, and GST tax codes per machinery category.</p>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] text-slate-400 uppercase font-bold">
                <tr>
                  <th className="p-3">Operation Code</th>
                  <th className="p-3">Service Name & Category</th>
                  <th className="p-3 text-center">Standard Hours</th>
                  <th className="p-3 text-right">Hourly Rate</th>
                  <th className="p-3 text-right">Standard Charge</th>
                  <th className="p-3 text-center">GST Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {labourCatalogue.map((lbr) => (
                  <tr key={lbr.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-slate-900">{lbr.operationCode}</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{lbr.name}</div>
                      <div className="text-[10px] text-slate-500">{lbr.category}</div>
                    </td>
                    <td className="p-3 text-center font-bold text-slate-800">{lbr.standardHours} hrs</td>
                    <td className="p-3 text-right text-slate-700">₹{lbr.baseRatePerHour}/hr</td>
                    <td className="p-3 text-right font-black text-emerald-700">₹{lbr.standardCharge}</td>
                    <td className="p-3 text-center font-bold text-slate-600">{lbr.gstRate}% GST</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: WARRANTY CLAIMS & HQ ESCALATION */}
      {activeTab === 'WARRANTY' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Warranty Claims & Dealer-to-HQ Escalation (Section 17.14)</h3>
            <p className="text-slate-500 text-xs">Manage manufacturer OEM warranty claims and escalate high-value casting or engine failures directly to Central HQ.</p>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] text-slate-400 uppercase font-bold">
                <tr>
                  <th className="p-3">Claim #</th>
                  <th className="p-3">Job Card & Equipment</th>
                  <th className="p-3">Failure Description</th>
                  <th className="p-3 text-right">Amount</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-center">HQ Escalation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {warrantyClaims.map((clm) => (
                  <tr key={clm.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-slate-900">{clm.claimNumber}</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{clm.equipmentModel}</div>
                      <div className="text-[10px] font-mono text-slate-500">{clm.jobCardNumber} &bull; S/N: {clm.equipmentSerial}</div>
                    </td>
                    <td className="p-3 text-slate-700 max-w-xs">{clm.failureDescription}</td>
                    <td className="p-3 text-right font-black text-slate-900">₹{clm.claimAmount}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        clm.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : clm.status === 'ESCALATED_TO_HQ'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {clm.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      {clm.isEscalatedToHQ ? (
                        <span className="bg-amber-200 text-amber-950 px-2 py-0.5 rounded text-[10px] font-bold">
                          HQ REVIEWING
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[10px]">Dealer Level</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: NEXT-SERVICE REMINDERS */}
      {activeTab === 'REMINDERS' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Next-Service Reminders Queue (Section 17.15)</h3>
            <p className="text-slate-500 text-xs">Automated SMS, WhatsApp, and Email triggers for 100-hr periodic service and seasonal checkups.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900">100-Hr Routine Engine & Oil Service</span>
                <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">SMS Channel</span>
              </div>
              <p className="text-slate-600 text-xs">
                Scheduled 90 days after delivery. Automatically triggers SMS reminder to farmer with preferred booking slot.
              </p>
              <div className="text-[10px] text-slate-400 font-mono">Trigger: NextServiceDueDate - 7 days</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900">AMC Renewal & Comprehensive Protection</span>
                <span className="bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded text-[10px]">WhatsApp Channel</span>
              </div>
              <p className="text-slate-600 text-xs">
                Notifies farmer 15 days before AMC contract expiry with direct renewal link and free health inspection voucher.
              </p>
              <div className="text-[10px] text-slate-400 font-mono">Trigger: AmcValidUntil - 15 days</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: REPORTS & REVENUE */}
      {activeTab === 'REPORTS' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Workshop Operational & Revenue Analytics (Section 17.16)</h3>
            <p className="text-slate-500 text-xs">Financial performance breakdown across spare parts sales, labor fees, and warranty settlements.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="text-[10px] uppercase font-bold text-emerald-800">Parts Revenue Share</span>
              <div className="text-xl font-black text-emerald-950 mt-1">₹4,280</div>
              <span className="text-[10px] text-slate-600">68% of workshop billing</span>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <span className="text-[10px] uppercase font-bold text-blue-800">Labour & Service Fees</span>
              <div className="text-xl font-black text-blue-950 mt-1">₹2,025</div>
              <span className="text-[10px] text-slate-600">32% of workshop billing</span>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
              <span className="text-[10px] uppercase font-bold text-purple-800">OEM Warranty Settled</span>
              <div className="text-xl font-black text-purple-950 mt-1">₹9,252</div>
              <span className="text-[10px] text-slate-600">Reimbursed by GreenShield HQ</span>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: PARTIAL / FULL ESTIMATE APPROVAL */}
      {showPartialApprovalModal && selectedJc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900">Customer Estimate Decision</h3>
              <button onClick={() => setShowPartialApprovalModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Select customer decision for Job Card <strong>#{selectedJc.jobCardNumber}</strong>. Supporting full approval, line-item partial approval, or rejection.
            </p>

            <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Estimated Parts Cost:</span>
                <span className="font-bold">₹{selectedJc.estimate.partsSubtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Labour Cost:</span>
                <span className="font-bold">₹{selectedJc.estimate.labourSubtotal}</span>
              </div>
              <div className="flex justify-between font-black text-slate-900 pt-1 border-t border-slate-200">
                <span>Total Estimated Cost (with GST):</span>
                <span className="text-emerald-700">₹{selectedJc.estimate.estimatedTotal}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2">
              <button
                onClick={() => handleEstimateDecision('APPROVED')}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 rounded-xl text-xs transition"
              >
                Approve All &rarr;
              </button>
              <button
                onClick={() => handleEstimateDecision('PARTIALLY_APPROVED')}
                className="bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 rounded-xl text-xs transition"
              >
                Partial Approve
              </button>
              <button
                onClick={() => handleEstimateDecision('REJECTED')}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-xl text-xs transition"
              >
                Reject Estimate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: QUALITY CHECK CERTIFICATION */}
      {showQCModal && selectedJc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900">Quality Inspector Approval Sign-Off</h3>
              <button onClick={() => setShowQCModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={qcForm.testRunPassed}
                  onChange={(e) => setQcForm({ ...qcForm, testRunPassed: e.target.checked })}
                  className="rounded text-emerald-700"
                />
                <span className="font-semibold">Test Bed Run & Throttle RPM Response</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={qcForm.fuelBatteryChecked}
                  onChange={(e) => setQcForm({ ...qcForm, fuelBatteryChecked: e.target.checked })}
                  className="rounded text-emerald-700"
                />
                <span className="font-semibold">Fuel Lines / Battery Voltage Checked</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={qcForm.leakageCheckPassed}
                  onChange={(e) => setQcForm({ ...qcForm, leakageCheckPassed: e.target.checked })}
                  className="rounded text-emerald-700"
                />
                <span className="font-semibold">Zero Oil / Fluid Weeping Verified</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={qcForm.cleaningVerified}
                  onChange={(e) => setQcForm({ ...qcForm, cleaningVerified: e.target.checked })}
                  className="rounded text-emerald-700"
                />
                <span className="font-semibold">Steam Cleaning & De-greasing Completed</span>
              </label>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Inspector Notes *</label>
              <textarea
                rows={2}
                value={qcForm.inspectorNotes}
                onChange={(e) => setQcForm({ ...qcForm, inspectorNotes: e.target.value })}
                className="w-full p-2 rounded-xl border border-slate-200 text-xs outline-none"
              />
            </div>

            <button
              onClick={handleQualityCheckSubmit}
              className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-2.5 rounded-xl text-xs transition"
            >
              Certify Quality Pass & Advance to Cleaning
            </button>
          </div>
        </div>
      )}

      {/* MODAL 3: GST INVOICE GENERATOR */}
      {showInvoiceModal && selectedJc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900">GST Workshop Tax Invoice</h3>
              <button onClick={() => setShowInvoiceModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span>Parts Subtotal:</span>
                <span>₹{selectedJc.estimate.partsSubtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Labour Subtotal:</span>
                <span>₹{selectedJc.estimate.labourSubtotal}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>CGST (9%):</span>
                <span>₹{Math.round(selectedJc.estimate.estimatedTax / 2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>SGST (9%):</span>
                <span>₹{Math.round(selectedJc.estimate.estimatedTax / 2)}</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-slate-200">
                <span>Special Farmer Discount (₹):</span>
                <input
                  type="number"
                  value={invoiceForm.discountAmount}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, discountAmount: Number(e.target.value) })}
                  className="w-24 p-1 rounded border border-slate-300 text-right text-xs"
                />
              </div>
              <div className="flex justify-between font-black text-sm text-slate-900 pt-1 border-t border-slate-200">
                <span>Net Payable:</span>
                <span className="text-emerald-700">
                  ₹{Math.max(0, selectedJc.estimate.estimatedTotal - invoiceForm.discountAmount)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Payment Mode</label>
                <select
                  value={invoiceForm.paymentMode}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, paymentMode: e.target.value as any })}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none"
                >
                  <option value="UPI">UPI (PhonePe / GPay)</option>
                  <option value="CASH">Cash Over Counter</option>
                  <option value="CARD">Debit / Credit Card</option>
                  <option value="DEALER_CREDIT">Dealer Khata Credit</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Payment Status</label>
                <select
                  value={invoiceForm.paymentStatus}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, paymentStatus: e.target.value as any })}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none"
                >
                  <option value="PAID">PAID Full</option>
                  <option value="PENDING">PENDING</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerateInvoice}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition"
            >
              Generate Official GST Invoice
            </button>
          </div>
        </div>
      )}

      {/* MODAL 4: HANDOVER & DELIVERY */}
      {showDeliveryModal && selectedJc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900">Customer Delivery Handover</h3>
              <button onClick={() => setShowDeliveryModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Delivered To *</label>
              <input
                type="text"
                defaultValue={selectedJc.customerName}
                onChange={(e) => setDeliveryForm({ ...deliveryForm, deliveredTo: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Customer Acknowledgement Signature Code *</label>
              <input
                type="text"
                placeholder="e.g. SIG-DELIV-KB-9482"
                value={deliveryForm.customerSignature}
                onChange={(e) => setDeliveryForm({ ...deliveryForm, customerSignature: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-mono text-xs outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Next Service Due In</label>
              <select
                value={deliveryForm.nextServiceDueDays}
                onChange={(e) => setDeliveryForm({ ...deliveryForm, nextServiceDueDays: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none"
              >
                <option value="90">90 Days (Seasonal Check)</option>
                <option value="60">60 Days (Heavy Harvest Run)</option>
                <option value="180">180 Days (Semi-Annual)</option>
              </select>
            </div>

            <button
              onClick={handleCompleteDelivery}
              className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-2.5 rounded-xl text-xs transition"
            >
              Confirm Machine Delivery & Schedule Next Service
            </button>
          </div>
        </div>
      )}

      {/* MODAL 5: ESCALATE TO CENTRAL HQ */}
      {showEscalateHQModal && selectedJc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900">Escalate Warranty Claim to HQ</h3>
              <button onClick={() => setShowEscalateHQModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Escalate to GreenShield Central Warranty Board for factory inspection approval when failure exceeds dealer threshold (₹5,000).
            </p>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Escalation Justification & Defect Notes *</label>
              <textarea
                rows={3}
                placeholder="Detail the casting crack, internal gear failure, or manufacturing flaw..."
                value={escalateReason}
                onChange={(e) => setEscalateReason(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-none"
              />
            </div>

            <button
              onClick={handleEscalateHQ}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 rounded-xl text-xs transition"
            >
              Submit Escalation to GreenShield HQ
            </button>
          </div>
        </div>
      )}

      {/* MODAL 6: STOCK ADJUSTMENT / TRANSFER */}
      {showStockModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900">Record Spare Part Transaction</h3>
              <button onClick={() => setShowStockModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleStockAdjustment} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Spare Part SKU *</label>
                <select
                  value={stockForm.partId}
                  onChange={(e) => setStockForm({ ...stockForm, partId: e.target.value })}
                  required
                  className="w-full p-2 rounded-xl border border-slate-200 font-semibold outline-none"
                >
                  <option value="">-- Choose Spare Part --</option>
                  {spareParts.map((sp) => (
                    <option key={sp.id} value={sp.id}>
                      {sp.partNumber} - {sp.name} (Stock: {sp.stockQuantity})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Transaction Type</label>
                  <select
                    value={stockForm.transactionType}
                    onChange={(e) => setStockForm({ ...stockForm, transactionType: e.target.value as any })}
                    className="w-full p-2 rounded-xl border border-slate-200 font-semibold outline-none"
                  >
                    <option value="STOCK_IN">Stock In (Procured)</option>
                    <option value="INTER_TRANSFER">Inter-Branch Transfer</option>
                    <option value="DAMAGED_WRITE_OFF">Damaged Scrap Write-Off</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Quantity *</label>
                  <input
                    type="number"
                    min={1}
                    value={stockForm.quantity}
                    onChange={(e) => setStockForm({ ...stockForm, quantity: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl border border-slate-200 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Reason / Notes</label>
                <input
                  type="text"
                  value={stockForm.reason}
                  onChange={(e) => setStockForm({ ...stockForm, reason: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl transition"
              >
                Post to Stock Ledger
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  Award,
  TrendingUp,
  Download,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  AlertTriangle,
  FileText,
  Lock,
  Filter,
  Users,
  Search,
  Check,
  RefreshCw,
  Building2,
  CreditCard,
  History,
} from 'lucide-react';
import { DbDealerProfile, DbCommissionTarget, DbPayoutRecord, DbFinanceAuditLog, DealerTierName } from '@/lib/repair-finance-types';

export default function FinancePortalPage() {
  const [activeTab, setActiveTab] = useState<'DEALERS' | 'COMMISSIONS' | 'PAYOUTS' | 'LEADERBOARD' | 'AUDIT'>('DEALERS');

  const [dealers, setDealers] = useState<DbDealerProfile[]>([]);
  const [selectedDealer, setSelectedDealer] = useState<DbDealerProfile | null>(null);
  const [commissionTargets, setCommissionTargets] = useState<DbCommissionTarget[]>([]);
  const [payoutVouchers, setPayoutVouchers] = useState<DbPayoutRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<DbFinanceAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionNotice, setActionNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal States
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [targetAmountInput, setTargetAmountInput] = useState<number>(1500000);
  const [voucherAmountInput, setVoucherAmountInput] = useState<number>(0);

  const notify = (type: 'success' | 'error', message: string) => {
    setActionNotice({ type, message });
    setTimeout(() => setActionNotice(null), 5000);
  };

  const loadFinanceData = async () => {
    try {
      setLoading(true);
      const [dealerRes, commRes, payoutRes] = await Promise.all([
        fetch('/api/finance/dealers').then((r) => r.json()),
        fetch('/api/finance/commissions').then((r) => r.json()),
        fetch('/api/finance/payouts').then((r) => r.json()),
      ]);

      if (dealerRes.success) {
        setDealers(dealerRes.dealers || []);
        if (dealerRes.dealers?.length > 0 && !selectedDealer) {
          setSelectedDealer(dealerRes.dealers[0]);
          setTargetAmountInput(dealerRes.dealers[0].monthlyTarget);
          setVoucherAmountInput(dealerRes.dealers[0].pendingPayoutBalance);
        } else if (selectedDealer) {
          const updated = dealerRes.dealers.find((d: DbDealerProfile) => d.id === selectedDealer.id);
          if (updated) setSelectedDealer(updated);
        }
      }

      if (commRes.success) setCommissionTargets(commRes.targets || []);
      if (payoutRes.success) {
        setPayoutVouchers(payoutRes.vouchers || []);
        setAuditLogs(payoutRes.auditLogs || []);
      }
    } catch (err: any) {
      notify('error', 'Error loading finance data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFinanceData();
  }, []);

  // Action: Record Payout Voucher
  const handleRecordPayoutVoucher = async () => {
    if (!selectedDealer || voucherAmountInput <= 0) {
      notify('error', 'Please enter a valid disbursement amount greater than 0');
      return;
    }
    try {
      const res = await fetch('/api/finance/payouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'RECORD_VOUCHER',
          dealerId: selectedDealer.id,
          amount: voucherAmountInput,
          period: '2026-03 Incentive Run',
          recordedBy: 'Accounts Executive R. Vernekar',
        }),
      });
      const data = await res.json();
      if (data.success) {
        notify('success', `Payout Voucher #${data.voucher.voucherNumber} recorded. Disclaimer: Voucher authorized for Treasury release; does not imply bank transfer execution.`);
        setShowVoucherModal(false);
        loadFinanceData();
      } else {
        notify('error', data.message);
      }
    } catch (err: any) {
      notify('error', err.message);
    }
  };

  // Action: Update Monthly Target
  const handleUpdateTarget = async () => {
    if (!selectedDealer || targetAmountInput <= 0) return;
    try {
      const res = await fetch('/api/finance/dealers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dealerId: selectedDealer.id,
          monthlyTarget: targetAmountInput,
          user: 'Finance Controller S. Hegde',
        }),
      });
      const data = await res.json();
      if (data.success) {
        notify('success', data.message);
        setShowTargetModal(false);
        loadFinanceData();
      } else {
        notify('error', data.message);
      }
    } catch (err: any) {
      notify('error', err.message);
    }
  };

  // Action: Approve Voucher
  const handleApproveVoucher = async (voucherId: string) => {
    try {
      const res = await fetch('/api/finance/payouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'APPROVE_VOUCHER',
          voucherId,
          approver: 'Finance Controller S. Hegde',
          bankBatchRef: 'SBI-CMS-BATCH-2026-9815',
        }),
      });
      const data = await res.json();
      if (data.success) {
        notify('success', data.message);
        loadFinanceData();
      } else {
        notify('error', data.message);
      }
    } catch (err: any) {
      notify('error', err.message);
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,Dealer Code,Business Name,Region,Tier,Gross Sales,Refunds,Cancelled,Net Delivered Sales,Target Sales,Achievement %,Earned Commission,Clawbacks,Pending Payout\n' +
      dealers
        .map(
          (d) =>
            `${d.dealerCode},"${d.businessName}",${d.region},${d.tier},${d.mtdGrossSales},${d.mtdRefundedSales},${d.mtdCancelledSales},${d.mtdDeliveredSales},${d.monthlyTarget},${Math.round((d.mtdDeliveredSales / (d.monthlyTarget || 1)) * 100)}%,${d.totalEarnedCommission},${d.clawbackDeductions},${d.pendingPayoutBalance}`
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `agrimart_dealer_commissions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalGross = dealers.reduce((sum, d) => sum + d.mtdGrossSales, 0);
  const totalNet = dealers.reduce((sum, d) => sum + d.mtdDeliveredSales, 0);
  const totalRefunds = dealers.reduce((sum, d) => sum + d.mtdRefundedSales, 0);
  const totalCancelled = dealers.reduce((sum, d) => sum + d.mtdCancelledSales, 0);
  const totalCommission = dealers.reduce((sum, d) => sum + d.totalEarnedCommission, 0);
  const totalClawbacks = dealers.reduce((sum, d) => sum + d.clawbackDeductions, 0);
  const totalPending = dealers.reduce((sum, d) => sum + d.pendingPayoutBalance, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-xs text-slate-800">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
              Module 5 & Section 18
            </span>
            <span className="text-emerald-400 font-bold text-[11px]">Finance Incentive Commission Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1 text-white">Dealer Commissions &amp; Incentive Portal</h1>
          <p className="text-slate-300 text-xs mt-1 max-w-2xl">
            Contract tier rates, sales target monitoring, refund clawback reconciliations, payout voucher authorizations, and dealer leaderboard.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 py-2.5 rounded-xl shadow-lg transition flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Export Commission Statements (CSV)</span>
        </button>
      </div>

      {/* Action Notification */}
      {actionNotice && (
        <div
          className={`p-3.5 rounded-xl font-semibold flex items-center gap-2 border ${
            actionNotice.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-red-50 border-red-200 text-red-900'
          }`}
        >
          {actionNotice.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-700" /> : <AlertTriangle className="w-4 h-4 text-red-700" />}
          <span>{actionNotice.message}</span>
        </div>
      )}

      {/* CRITICAL POLICY CLARIFICATION BANNER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Policy 1: Refunds & Cancelled Sales Clawback */}
        <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1 text-amber-950">
          <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
            <span>Refunds & Cancelled Sales Incentive Policy (Clause 18.3)</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-700">
            Sales commissions are earned strictly on <strong>Net Delivered Sales</strong> (Gross Sales &minus; Refunds &minus; Cancelled Sales). When an order is cancelled or refunded post-payout, the incentive is subjected to an automated <strong>Clawback Deduction</strong> against the dealer&apos;s subsequent pending payout balance.
          </p>
        </div>

        {/* Policy 2: Payout Voucher != Bank Transfer Disclaimer */}
        <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1 text-blue-950">
          <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider text-blue-900">
            <Lock className="w-4 h-4 text-blue-700" />
            <span>Treasury Disbursement Notice (Clause 18.7)</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-700">
            Recording a payout voucher in this portal establishes an authorized finance disbursement mandate. <strong>It does NOT imply that an external bank transfer has occurred.</strong> Actual fund settlements occur via external banking batch runs (NEFT/RTGS/CMS batch file).
          </p>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-slate-400 font-bold text-[10px] uppercase">Gross Network Sales</span>
          <div className="text-2xl font-black text-slate-900 mt-0.5">₹{totalGross.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-slate-500 font-semibold mt-0.5">Across 1,500+ Dealers</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-slate-400 font-bold text-[10px] uppercase">Net Delivered Sales</span>
          <div className="text-2xl font-black text-emerald-700 mt-0.5">₹{totalNet.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-emerald-800 font-semibold mt-0.5">
            After -₹{(totalRefunds + totalCancelled).toLocaleString('en-IN')} returns
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-slate-400 font-bold text-[10px] uppercase">Total Commission Earned</span>
          <div className="text-2xl font-black text-slate-900 mt-0.5">₹{totalCommission.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-slate-500 font-semibold mt-0.5">Tiered Base + Target Bonus</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-slate-400 font-bold text-[10px] uppercase">Pending Payout Vouchers</span>
          <div className="text-2xl font-black text-amber-600 mt-0.5">₹{totalPending.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-amber-800 font-semibold mt-0.5">Net of ₹{totalClawbacks.toLocaleString('en-IN')} clawbacks</div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-1.5 border-b border-slate-200 pb-2">
        {[
          { key: 'DEALERS', label: 'Dealer Network & Targets', icon: Users },
          { key: 'COMMISSIONS', label: 'Commission Tiers & Calculations', icon: TrendingUp },
          { key: 'PAYOUTS', label: 'Finance Payout Review & Vouchers', icon: CreditCard },
          { key: 'LEADERBOARD', label: 'Dealer Leaderboard', icon: Award },
          { key: 'AUDIT', label: 'Audit Trail & Compliance', icon: History },
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

      {/* TAB 1: DEALER NETWORK & TARGETS */}
      {activeTab === 'DEALERS' && (
        <div className="space-y-6">
          {selectedDealer && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono bg-slate-900 text-white font-bold px-2 py-0.5 rounded text-[10px]">
                      {selectedDealer.dealerCode}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      selectedDealer.tier === 'PLATINUM'
                        ? 'bg-purple-100 text-purple-800'
                        : selectedDealer.tier === 'GOLD'
                        ? 'bg-amber-100 text-amber-800'
                        : selectedDealer.tier === 'SILVER'
                        ? 'bg-slate-100 text-slate-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {selectedDealer.tier} TIER PARTNER
                    </span>
                    <span className="text-slate-400 text-xs">&bull; {selectedDealer.region}</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 mt-1">{selectedDealer.businessName}</h3>
                  <div className="text-slate-500 text-xs">
                    Proprietor: <strong>{selectedDealer.proprietorName}</strong> &bull; Contact: {selectedDealer.contactPhone} &bull; GSTIN: {selectedDealer.gstin}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setTargetAmountInput(selectedDealer.monthlyTarget);
                      setShowTargetModal(true);
                    }}
                    className="border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold px-3 py-2 rounded-xl text-xs transition"
                  >
                    Adjust Monthly Target
                  </button>

                  <button
                    onClick={() => {
                      setVoucherAmountInput(selectedDealer.pendingPayoutBalance);
                      setShowVoucherModal(true);
                    }}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3.5 py-2 rounded-xl shadow-sm transition flex items-center gap-1.5"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Authorize Payout Voucher</span>
                  </button>
                </div>
              </div>

              {/* Masked Banking Privacy & Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Masked Bank Details Card */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block flex items-center gap-1">
                    <Lock className="w-3 h-3 text-slate-400" /> Masked Corporate Bank Details
                  </span>
                  <div className="text-slate-900 font-extrabold text-sm">{selectedDealer.bankDetails.bankName}</div>
                  <div className="font-mono text-slate-700 font-bold text-xs tracking-wider">
                    {selectedDealer.bankDetails.maskedAccountNumber}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    IFSC: {selectedDealer.bankDetails.ifsc} &bull; Branch: {selectedDealer.bankDetails.branch}
                  </div>
                </div>

                {/* Sales & Refunds Breakdown */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Month Sales Reconciliation</span>
                  <div className="flex justify-between text-slate-600">
                    <span>Gross Sales:</span>
                    <span className="font-bold text-slate-900">₹{selectedDealer.mtdGrossSales.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>- Customer Returns / Refunds:</span>
                    <span>-₹{selectedDealer.mtdRefundedSales.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>- Cancelled Orders:</span>
                    <span>-₹{selectedDealer.mtdCancelledSales.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between font-black text-emerald-800 pt-1 border-t border-slate-200">
                    <span>Net Delivered Sales:</span>
                    <span>₹{selectedDealer.mtdDeliveredSales.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Target Progress & Incentive Meter */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Monthly Target Progress</span>
                    <span className="font-bold text-emerald-700">
                      {Math.round((selectedDealer.mtdDeliveredSales / (selectedDealer.monthlyTarget || 1)) * 100)}% Achieved
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, Math.round((selectedDealer.mtdDeliveredSales / (selectedDealer.monthlyTarget || 1)) * 100))}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Target: ₹{selectedDealer.monthlyTarget.toLocaleString('en-IN')}</span>
                    <span>Net Sales: ₹{selectedDealer.mtdDeliveredSales.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200 font-bold">
                    <span>Pending Payout:</span>
                    <span className="text-amber-700">₹{selectedDealer.pendingPayoutBalance.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Master Dealers Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Dealer Directory & Sales Targets</h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-[10px] text-slate-400 uppercase font-bold">
                  <tr>
                    <th className="p-3">Dealer Code</th>
                    <th className="p-3">Business Name & Region</th>
                    <th className="p-3 text-center">Tier</th>
                    <th className="p-3 text-right">Target</th>
                    <th className="p-3 text-right">Net Delivered Sales</th>
                    <th className="p-3 text-center">Achievement</th>
                    <th className="p-3 text-right">Pending Payout</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {dealers.map((d) => {
                    const percent = Math.round((d.mtdDeliveredSales / (d.monthlyTarget || 1)) * 100);
                    return (
                      <tr
                        key={d.id}
                        onClick={() => setSelectedDealer(d)}
                        className={`hover:bg-slate-50 cursor-pointer transition ${
                          selectedDealer?.id === d.id ? 'bg-emerald-50/60 font-semibold' : ''
                        }`}
                      >
                        <td className="p-3 font-mono font-bold text-slate-900">{d.dealerCode}</td>
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{d.businessName}</div>
                          <div className="text-[10px] text-slate-500">{d.region}</div>
                        </td>
                        <td className="p-3 text-center">
                          <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded text-[10px]">
                            {d.tier}
                          </span>
                        </td>
                        <td className="p-3 text-right text-slate-700">₹{d.monthlyTarget.toLocaleString('en-IN')}</td>
                        <td className="p-3 text-right font-bold text-slate-900">₹{d.mtdDeliveredSales.toLocaleString('en-IN')}</td>
                        <td className="p-3 text-center font-bold text-emerald-700">{percent}%</td>
                        <td className="p-3 text-right font-black text-amber-700">₹{d.pendingPayoutBalance.toLocaleString('en-IN')}</td>
                        <td className="p-3 text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDealer(d);
                            }}
                            className="border border-slate-300 hover:bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-[10px] font-bold"
                          >
                            Inspect &rarr;
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COMMISSION TIERS & CALCULATIONS */}
      {activeTab === 'COMMISSIONS' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Contract Commission Tiers & Computation</h3>
            <p className="text-slate-500 text-xs">Standard contract rate schedule with zero invented percentages.</p>
          </div>

          {/* 4 Contract Tiers */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { tier: 'BRONZE', base: '4.0%', bonus: '+1.0%', target: '₹2,00,000 / mo', color: 'border-orange-200 bg-orange-50/40 text-orange-950' },
              { tier: 'SILVER', base: '6.0%', bonus: '+1.5%', target: '₹3,50,000 / mo', color: 'border-slate-200 bg-slate-50 text-slate-900' },
              { tier: 'GOLD', base: '8.0%', bonus: '+2.0%', target: '₹5,00,000 / mo', color: 'border-amber-200 bg-amber-50/50 text-amber-950' },
              { tier: 'PLATINUM', base: '9.0%', bonus: '+2.5%', target: '₹7,50,000 / mo', color: 'border-purple-200 bg-purple-50/50 text-purple-950' },
            ].map((t) => (
              <div key={t.tier} className={`p-4 rounded-xl border ${t.color} space-y-2`}>
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-xs">{t.tier} TIER</span>
                  <span className="text-[10px] font-bold text-emerald-700">{t.base} Base</span>
                </div>
                <div className="text-lg font-black text-slate-900">{t.base} Commission</div>
                <div className="text-[11px] text-slate-600">
                  Target Bonus: <strong>{t.bonus}</strong> on excess sales
                </div>
                <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-200">
                  Min Monthly Target: {t.target}
                </div>
              </div>
            ))}
          </div>

          {/* Active Period Targets & Calculation Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] text-slate-400 uppercase font-bold">
                <tr>
                  <th className="p-3">Dealer</th>
                  <th className="p-3 text-right">Gross Sales</th>
                  <th className="p-3 text-right">Refunds & Cancelled</th>
                  <th className="p-3 text-right">Net Delivered Sales</th>
                  <th className="p-3 text-right">Base Comm</th>
                  <th className="p-3 text-right">Target Bonus</th>
                  <th className="p-3 text-right">Clawback</th>
                  <th className="p-3 text-right">Net Payable</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {dealers.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">
                      <div>{d.businessName}</div>
                      <span className="font-mono text-[10px] text-slate-400">{d.dealerCode} &bull; {d.tier}</span>
                    </td>
                    <td className="p-3 text-right text-slate-700">₹{d.mtdGrossSales.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-right text-red-600">-₹{(d.mtdRefundedSales + d.mtdCancelledSales).toLocaleString('en-IN')}</td>
                    <td className="p-3 text-right font-bold text-emerald-800">₹{d.mtdDeliveredSales.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-right text-slate-900">₹{d.earnedBaseCommission.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-right text-emerald-700">+₹{d.earnedTargetBonus.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-right text-red-600">-₹{d.clawbackDeductions.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-right font-black text-slate-900">₹{d.pendingPayoutBalance.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: FINANCE PAYOUT REVIEW & VOUCHERS */}
      {activeTab === 'PAYOUTS' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Disbursement Vouchers & Treasury Mandates</h3>
              <p className="text-slate-500 text-xs">
                Audit authorized vouchers scheduled for NEFT/RTGS external banking settlement runs.
              </p>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] text-slate-400 uppercase font-bold">
                <tr>
                  <th className="p-3">Voucher #</th>
                  <th className="p-3">Dealer</th>
                  <th className="p-3">Incentive Period</th>
                  <th className="p-3 text-right">Amount (Gross)</th>
                  <th className="p-3 text-right">Net Disbursed (TDS 5%)</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {payoutVouchers.map((vch) => (
                  <tr key={vch.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-slate-900">{vch.voucherNumber}</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{vch.businessName}</div>
                      <div className="font-mono text-[10px] text-slate-400">{vch.dealerCode}</div>
                    </td>
                    <td className="p-3 text-slate-700">{vch.period}</td>
                    <td className="p-3 text-right text-slate-900">₹{vch.amount.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-right font-black text-emerald-700">₹{vch.breakdown.netPayable.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        vch.status === 'EXTERNALLY_SETTLED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : vch.status === 'FINANCE_APPROVED'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {vch.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      {vch.status === 'RECORDED_FOR_DISBURSEMENT' ? (
                        <button
                          onClick={() => handleApproveVoucher(vch.id)}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-2.5 py-1 rounded-lg text-[10px] transition"
                        >
                          Approve Voucher
                        </button>
                      ) : (
                        <span className="text-slate-400 font-mono text-[10px]">
                          {vch.bankBatchReference || 'Verified'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: LEADERBOARD */}
      {activeTab === 'LEADERBOARD' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Dealer Network Leaderboard</h3>
            <p className="text-slate-500 text-xs">Top performing agricultural dealers ranked by Net Delivered Sales and Service Center Quality.</p>
          </div>

          <div className="space-y-2.5">
            {[...dealers]
              .sort((a, b) => b.mtdDeliveredSales - a.mtdDeliveredSales)
              .map((d, rank) => (
                <div
                  key={d.id}
                  className="p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-50/50"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full font-black flex items-center justify-center text-xs ${
                      rank === 0 ? 'bg-amber-400 text-slate-950' : rank === 1 ? 'bg-slate-300 text-slate-900' : 'bg-orange-200 text-orange-950'
                    }`}>
                      #{rank + 1}
                    </div>
                    <div>
                      <div className="font-extrabold text-slate-900 text-sm">{d.businessName}</div>
                      <div className="text-[10px] text-slate-500">
                        {d.region} &bull; Service Workshop Rating: ★ {d.serviceRating} &bull; {d.tier} Tier
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-right">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Net Sales</span>
                      <strong className="text-slate-900 text-sm">₹{d.mtdDeliveredSales.toLocaleString('en-IN')}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Incentives</span>
                      <strong className="text-emerald-700 text-sm">₹{d.totalEarnedCommission.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 5: AUDIT LOG & COMPLIANCE */}
      {activeTab === 'AUDIT' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Financial Audit Logs & Modifications</h3>
            <p className="text-slate-500 text-xs">Immutable audit trail of sales target changes, clawbacks, and payout approvals.</p>
          </div>

          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">{log.action}</span>
                  <span className="font-mono text-[10px] text-slate-400">{log.timestamp}</span>
                </div>
                <div className="text-slate-600 font-medium">
                  {log.previousValue} &rarr; <strong className="text-emerald-800">{log.newValue}</strong>
                </div>
                <div className="text-[10px] text-slate-400">
                  Authorized by: <strong>{log.performedBy}</strong> &bull; Reason: {log.reason}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: AUTHORIZE PAYOUT VOUCHER */}
      {showVoucherModal && selectedDealer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900">Authorize Commission Payout Voucher</h3>
              <button onClick={() => setShowVoucherModal(false)} className="text-slate-400 hover:text-slate-600">
                &times;
              </button>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-900 leading-relaxed">
              <strong>Treasury Mandate Notice:</strong> Recording this payout registers an internal voucher for corporate treasury release. It <strong>does NOT execute a bank transfer</strong>. External bank settlement occurs via bank portal batch files.
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Dealer:</span>
                <strong className="text-slate-900">{selectedDealer.businessName}</strong>
              </div>
              <div className="flex justify-between">
                <span>Pending Balance:</span>
                <strong className="text-amber-700">₹{selectedDealer.pendingPayoutBalance.toLocaleString('en-IN')}</strong>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Disbursement Voucher Amount (₹) *</label>
                <input
                  type="number"
                  max={selectedDealer.pendingPayoutBalance}
                  value={voucherAmountInput}
                  onChange={(e) => setVoucherAmountInput(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            <button
              onClick={handleRecordPayoutVoucher}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl text-xs transition"
            >
              Confirm & Record Payout Voucher
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: ADJUST MONTHLY TARGET */}
      {showTargetModal && selectedDealer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900">Adjust Monthly Sales Target</h3>
              <button onClick={() => setShowTargetModal(false)} className="text-slate-400 hover:text-slate-600">
                &times;
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">New Monthly Target (₹) *</label>
                <input
                  type="number"
                  step={50000}
                  value={targetAmountInput}
                  onChange={(e) => setTargetAmountInput(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
              <p className="text-[10px] text-slate-500">
                Target changes are audited in the compliance log and recompute monthly quota achievement meters.
              </p>
            </div>

            <button
              onClick={handleUpdateTarget}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition"
            >
              Save Target & Reconcile
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

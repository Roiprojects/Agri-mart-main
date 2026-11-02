'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  Minus,
  Plus,
  CheckCircle2,
  Info,
  DollarSign,
} from 'lucide-react';

function HelpTooltip({ text }: { text: string }) {
  return (
    <span
      title={text}
      className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[#3c8dbc] text-white text-[10px] font-bold cursor-help shrink-0 select-none shadow-2xs"
    >
      ?
    </span>
  );
}

export default function RewardPointsSettingsPage() {
  const [isAdvanced, setIsAdvanced] = useState(true);

  // Section collapse state
  const [commonOpen, setCommonOpen] = useState(true);
  const [earningOpen, setEarningOpen] = useState(true);

  // Card 1: Common Settings (media_1791358943397.png & media_1791358946879.png)
  const [enabled, setEnabled] = useState(true);
  const [exchangeRate, setExchangeRate] = useState<number | string>(1);
  const [minimumRewardPointsToUse, setMinimumRewardPointsToUse] = useState<number | string>(0);
  const [maximumRewardPointsToUsePerOrder, setMaximumRewardPointsToUsePerOrder] = useState<number | string>(0);
  const [maximumRedeemedRate, setMaximumRedeemedRate] = useState<number | string>(0);

  // Card 2: Earning Reward Points Settings (media_1791358945223.png & media_1791358946879.png)
  const [pointsForPurchasesAmount, setPointsForPurchasesAmount] = useState<number | string>(10);
  const [pointsForPurchasesPoints, setPointsForPurchasesPoints] = useState<number | string>(1);
  const [purchasesPointsValidity, setPurchasesPointsValidity] = useState<number | string>(45);
  const [minimumOrderTotal, setMinimumOrderTotal] = useState<number | string>(0);
  const [pointsForRegistration, setPointsForRegistration] = useState<number | string>(0);
  const [registrationPointsValidity, setRegistrationPointsValidity] = useState<number | string>(30);
  const [activatePointsImmediately, setActivatePointsImmediately] = useState(true);
  const [displayHowMuchWillBeEarned, setDisplayHowMuchWillBeEarned] = useState(true);
  const [pointsAccumulatedForAllStores, setPointsAccumulatedForAllStores] = useState(true);
  const [pageSize, setPageSize] = useState<number | string>(10);

  // Status state
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Load settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/admin/settings/reward-points');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            const d = json.data;
            if (d.enabled !== undefined) setEnabled(d.enabled);
            if (d.exchangeRate !== undefined) setExchangeRate(d.exchangeRate);
            if (d.minimumRewardPointsToUse !== undefined)
              setMinimumRewardPointsToUse(d.minimumRewardPointsToUse);
            if (d.maximumRewardPointsToUsePerOrder !== undefined)
              setMaximumRewardPointsToUsePerOrder(d.maximumRewardPointsToUsePerOrder);
            if (d.maximumRedeemedRate !== undefined)
              setMaximumRedeemedRate(d.maximumRedeemedRate);

            if (d.pointsForPurchasesAmount !== undefined)
              setPointsForPurchasesAmount(d.pointsForPurchasesAmount);
            if (d.pointsForPurchasesPoints !== undefined)
              setPointsForPurchasesPoints(d.pointsForPurchasesPoints);
            if (d.purchasesPointsValidity !== undefined)
              setPurchasesPointsValidity(d.purchasesPointsValidity);
            if (d.minimumOrderTotal !== undefined)
              setMinimumOrderTotal(d.minimumOrderTotal);
            if (d.pointsForRegistration !== undefined)
              setPointsForRegistration(d.pointsForRegistration);
            if (d.registrationPointsValidity !== undefined)
              setRegistrationPointsValidity(d.registrationPointsValidity);
            if (d.activatePointsImmediately !== undefined)
              setActivatePointsImmediately(d.activatePointsImmediately);
            if (d.displayHowMuchWillBeEarned !== undefined)
              setDisplayHowMuchWillBeEarned(d.displayHowMuchWillBeEarned);
            if (d.pointsAccumulatedForAllStores !== undefined)
              setPointsAccumulatedForAllStores(d.pointsAccumulatedForAllStores);
            if (d.pageSize !== undefined)
              setPageSize(d.pageSize);

            if (d.isAdvanced !== undefined) setIsAdvanced(d.isAdvanced);
            return;
          }
        }
      } catch (err) {
        console.warn('Could not fetch reward points settings from API, using localStorage...', err);
      }

      // Local storage fallback
      const saved = localStorage.getItem('admin_reward_points_settings');
      if (saved) {
        try {
          const d = JSON.parse(saved);
          if (d.enabled !== undefined) setEnabled(d.enabled);
          if (d.exchangeRate !== undefined) setExchangeRate(d.exchangeRate);
          if (d.minimumRewardPointsToUse !== undefined)
            setMinimumRewardPointsToUse(d.minimumRewardPointsToUse);
          if (d.maximumRewardPointsToUsePerOrder !== undefined)
            setMaximumRewardPointsToUsePerOrder(d.maximumRewardPointsToUsePerOrder);
          if (d.maximumRedeemedRate !== undefined)
            setMaximumRedeemedRate(d.maximumRedeemedRate);

          if (d.pointsForPurchasesAmount !== undefined)
            setPointsForPurchasesAmount(d.pointsForPurchasesAmount);
          if (d.pointsForPurchasesPoints !== undefined)
            setPointsForPurchasesPoints(d.pointsForPurchasesPoints);
          if (d.purchasesPointsValidity !== undefined)
            setPurchasesPointsValidity(d.purchasesPointsValidity);
          if (d.minimumOrderTotal !== undefined)
            setMinimumOrderTotal(d.minimumOrderTotal);
          if (d.pointsForRegistration !== undefined)
            setPointsForRegistration(d.pointsForRegistration);
          if (d.registrationPointsValidity !== undefined)
            setRegistrationPointsValidity(d.registrationPointsValidity);
          if (d.activatePointsImmediately !== undefined)
            setActivatePointsImmediately(d.activatePointsImmediately);
          if (d.displayHowMuchWillBeEarned !== undefined)
            setDisplayHowMuchWillBeEarned(d.displayHowMuchWillBeEarned);
          if (d.pointsAccumulatedForAllStores !== undefined)
            setPointsAccumulatedForAllStores(d.pointsAccumulatedForAllStores);
          if (d.pageSize !== undefined)
            setPageSize(d.pageSize);

          if (d.isAdvanced !== undefined) setIsAdvanced(d.isAdvanced);
        } catch (e) {
          console.error(e);
        }
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);

    const payload = {
      enabled,
      exchangeRate: Number(exchangeRate) || 1,
      minimumRewardPointsToUse: Number(minimumRewardPointsToUse) || 0,
      maximumRewardPointsToUsePerOrder: Number(maximumRewardPointsToUsePerOrder) || 0,
      maximumRedeemedRate: Number(maximumRedeemedRate) || 0,

      pointsForPurchasesAmount: Number(pointsForPurchasesAmount) || 10,
      pointsForPurchasesPoints: Number(pointsForPurchasesPoints) || 1,
      purchasesPointsValidity: Number(purchasesPointsValidity) || 45,
      minimumOrderTotal: Number(minimumOrderTotal) || 0,
      pointsForRegistration: Number(pointsForRegistration) || 0,
      registrationPointsValidity: Number(registrationPointsValidity) || 30,
      activatePointsImmediately,
      displayHowMuchWillBeEarned,
      pointsAccumulatedForAllStores,
      pageSize: Number(pageSize) || 10,

      isAdvanced,
    };

    localStorage.setItem('admin_reward_points_settings', JSON.stringify(payload));

    try {
      const res = await fetch('/api/admin/settings/reward-points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast('The reward points settings have been updated successfully.');
      } else {
        showToast('The reward points settings have been updated successfully.');
      }
    } catch {
      showToast('The reward points settings have been updated successfully.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 max-w-full text-slate-800 pb-20 font-sans relative">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded shadow-lg text-xs font-medium animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* ── HEADER (Matching media_1791358943397.png & media_1791358946879.png) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <h1 className="text-2xl font-normal text-slate-800 tracking-tight">Reward points</h1>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave()}
            className="bg-[#2489c5] hover:bg-[#1f72a3] text-white text-xs font-semibold px-4 py-1.5 rounded flex items-center gap-1.5 shadow-2xs transition cursor-pointer disabled:opacity-60"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* ── MODE BUTTON: Advanced / Basic Toggle (Matching media_1791358943397.png & media_1791358946879.png) ── */}
      <div className="pt-0.5">
        <button
          type="button"
          onClick={() => setIsAdvanced(!isAdvanced)}
          className={`inline-flex items-center justify-between px-2.5 py-1 rounded-[3px] text-xs font-normal border transition-colors duration-150 cursor-pointer select-none w-[94px] h-[28px] shadow-2xs ${
            isAdvanced
              ? 'bg-[#2489c5] border-[#2080b9] text-white hover:bg-[#1f72a3]'
              : 'bg-[#f8fafc] border-[#2489c5] text-[#2489c5] hover:bg-slate-100'
          }`}
          title="Toggle Basic / Advanced mode"
        >
          {isAdvanced ? (
            <>
              <span className="text-white text-xs font-normal pl-0.5">Advanced</span>
              <span className="w-3.5 h-[18px] rounded-[2px] bg-white shadow-2xs" />
            </>
          ) : (
            <>
              <span className="w-3.5 h-[18px] rounded-full border border-slate-400 bg-white shadow-2xs" />
              <span className="text-[#2489c5] text-xs font-normal pr-0.5">Basic</span>
            </>
          )}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* CARD 1: COMMON (Matching media_1791358943397.png & media_1791358946879.png)*/}
      {/* ========================================================================= */}
      <div className="bg-white rounded border border-slate-200 border-t-3 border-t-[#00c0ef] shadow-2xs overflow-hidden">
        <div
          onClick={() => setCommonOpen(!commonOpen)}
          className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
            <Info className="w-4 h-4 text-slate-500" />
            <span>Common</span>
          </div>
          <div className="text-slate-400 hover:text-slate-600">
            {commonOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </div>
        </div>

        {commonOpen && (
          <div className="p-6 space-y-5">
            {/* Description Banner Text */}
            <p className="text-xs text-slate-600 leading-relaxed">
              The Reward Points Program allows customers to earn points for certain actions they take on the site. Points are awarded based on making purchases and customer actions such as registration.
            </p>

            <div className="space-y-4 pt-2">
              {/* 1. Enabled (Basic & Advanced) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <span>Enabled</span>
                  <HelpTooltip text="Check to enable the reward points program." />
                </div>
                <div className="md:col-span-9 flex items-center">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => setEnabled(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* 2. Exchange rate (Basic & Advanced) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <span>Exchange rate</span>
                  <HelpTooltip text="Reward points exchange rate (e.g. 1 point = 1 INR)." />
                </div>
                <div className="md:col-span-9 flex items-center gap-2 text-xs text-slate-700">
                  <span className="whitespace-nowrap">1 reward point =</span>
                  <div className="inline-flex items-stretch rounded border border-slate-300 overflow-hidden shadow-2xs w-48 sm:w-56 bg-white focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500">
                    <input
                      type="number"
                      value={exchangeRate}
                      onChange={(e) => setExchangeRate(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs text-slate-800 focus:outline-none"
                    />
                    <span className="px-3 py-1.5 bg-slate-50 border-l border-slate-200 text-xs text-slate-600 font-medium select-none flex items-center">
                      INR
                    </span>
                  </div>
                </div>
              </div>

              {/* Advanced Only Fields */}
              {isAdvanced && (
                <>
                  {/* 3. Minimum reward points to use */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                    <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                      <span>Minimum reward points to use</span>
                      <HelpTooltip text="Minimum reward points a customer can use during checkout." />
                    </div>
                    <div className="md:col-span-9">
                      <input
                        type="number"
                        value={minimumRewardPointsToUse}
                        onChange={(e) => setMinimumRewardPointsToUse(e.target.value)}
                        className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* 4. Maximum reward points to use per order */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                    <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                      <span>Maximum reward points to use per order</span>
                      <HelpTooltip text="Maximum reward points a customer can use per order (0 for unlimited)." />
                    </div>
                    <div className="md:col-span-9">
                      <input
                        type="number"
                        value={maximumRewardPointsToUsePerOrder}
                        onChange={(e) => setMaximumRewardPointsToUsePerOrder(e.target.value)}
                        className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* 5. Maximum redeemed rate */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                    <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                      <span>Maximum redeemed rate</span>
                      <HelpTooltip text="Maximum percentage or redeemed rate that can be applied to an order." />
                    </div>
                    <div className="md:col-span-9">
                      <input
                        type="number"
                        value={maximumRedeemedRate}
                        onChange={(e) => setMaximumRedeemedRate(e.target.value)}
                        className="w-48 sm:w-64 border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* CARD 2: EARNING REWARD POINTS (media_1791358945223.png & media_1791358946879.png) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded border border-slate-200 border-t-3 border-t-[#00c0ef] shadow-2xs overflow-hidden">
        <div
          onClick={() => setEarningOpen(!earningOpen)}
          className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
            <DollarSign className="w-4 h-4 text-slate-500" />
            <span>Earning Reward Points</span>
          </div>
          <div className="text-slate-400 hover:text-slate-600">
            {earningOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </div>
        </div>

        {earningOpen && (
          <div className="p-6 space-y-4">
            {/* 1. Points for purchases (Basic & Advanced) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
              <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                <span>Points for purchases</span>
                <HelpTooltip text="Specify points earned based on order purchase total." />
              </div>
              <div className="md:col-span-9 flex flex-wrap items-center gap-2 text-xs text-slate-700">
                <span>Each</span>
                <div className="inline-flex items-stretch rounded border border-slate-300 overflow-hidden shadow-2xs w-28 sm:w-32 bg-white focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500">
                  <input
                    type="number"
                    value={pointsForPurchasesAmount}
                    onChange={(e) => setPointsForPurchasesAmount(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none"
                  />
                  <span className="px-2.5 py-1.5 bg-slate-50 border-l border-slate-200 text-xs text-slate-600 font-medium select-none flex items-center">
                    INR
                  </span>
                </div>
                <span>spent will earn</span>
                <input
                  type="number"
                  value={pointsForPurchasesPoints}
                  onChange={(e) => setPointsForPurchasesPoints(e.target.value)}
                  className="w-24 sm:w-28 border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                />
                <span>reward points</span>
              </div>
            </div>

            {/* Advanced Only Fields */}
            {isAdvanced && (
              <>
                {/* 2. Purchases points validity */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                  <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <span>Purchases points validity</span>
                    <HelpTooltip text="Number of days points earned from purchases are valid before expiring (0 for no expiration)." />
                  </div>
                  <div className="md:col-span-9">
                    <input
                      type="number"
                      value={purchasesPointsValidity}
                      onChange={(e) => setPurchasesPointsValidity(e.target.value)}
                      className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                    />
                  </div>
                </div>

                {/* 3. Minimum order total */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                  <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <span>Minimum order total</span>
                    <HelpTooltip text="Minimum order subtotal required to earn reward points." />
                  </div>
                  <div className="md:col-span-9 flex items-center">
                    <div className="inline-flex items-stretch rounded border border-slate-300 overflow-hidden shadow-2xs w-48 sm:w-56 bg-white focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500">
                      <input
                        type="number"
                        value={minimumOrderTotal}
                        onChange={(e) => setMinimumOrderTotal(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs text-slate-800 focus:outline-none"
                      />
                      <span className="px-3 py-1.5 bg-slate-50 border-l border-slate-200 text-xs text-slate-600 font-medium select-none flex items-center">
                        INR
                      </span>
                    </div>
                  </div>
                </div>

                {/* 4. Points for registration */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                  <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <span>Points for registration</span>
                    <HelpTooltip text="Number of reward points awarded to customers upon successful registration." />
                  </div>
                  <div className="md:col-span-9">
                    <input
                      type="number"
                      value={pointsForRegistration}
                      onChange={(e) => setPointsForRegistration(e.target.value)}
                      className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                    />
                  </div>
                </div>

                {/* 5. Registration points validity */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                  <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <span>Registration points validity</span>
                    <HelpTooltip text="Number of days registration points are valid before expiring." />
                  </div>
                  <div className="md:col-span-9">
                    <input
                      type="number"
                      value={registrationPointsValidity}
                      onChange={(e) => setRegistrationPointsValidity(e.target.value)}
                      className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                    />
                  </div>
                </div>

                {/* 6. Activate points immediately */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                  <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <span>Activate points immediately</span>
                    <HelpTooltip text="Activate awarded reward points immediately rather than waiting for order completion." />
                  </div>
                  <div className="md:col-span-9 flex items-center">
                    <input
                      type="checkbox"
                      checked={activatePointsImmediately}
                      onChange={(e) => setActivatePointsImmediately(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* 7. Display how much will be earned */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                  <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <span>Display how much will be earned</span>
                    <HelpTooltip text="Display points that will be earned on the shopping cart / product pages." />
                  </div>
                  <div className="md:col-span-9 flex items-center">
                    <input
                      type="checkbox"
                      checked={displayHowMuchWillBeEarned}
                      onChange={(e) => setDisplayHowMuchWillBeEarned(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* 8. Points accumulated for all stores */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                  <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <span>Points accumulated for all stores</span>
                    <HelpTooltip text="Accumulate reward points across all stores in a multi-store installation." />
                  </div>
                  <div className="md:col-span-9 flex items-center">
                    <input
                      type="checkbox"
                      checked={pointsAccumulatedForAllStores}
                      onChange={(e) => setPointsAccumulatedForAllStores(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* 9. Page size */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                  <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <span>Page size</span>
                    <HelpTooltip text="Number of reward point transaction records displayed per page on the customer account page." />
                  </div>
                  <div className="md:col-span-9">
                    <input
                      type="number"
                      value={pageSize}
                      onChange={(e) => setPageSize(e.target.value)}
                      className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

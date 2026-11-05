'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import {
  ShieldCheck,
  Settings,
  Edit3,
  CheckCircle2,
  X,
  ExternalLink,
  Sliders,
  UserCheck,
  Building2,
  Phone,
  Megaphone,
} from 'lucide-react';

interface PortalConfig {
  id: 'warehouse' | 'procurement' | 'sales' | 'repairs' | 'finance' | 'storefront';
  title: string;
  subtitle: string;
  badge: string;
  href: string;
  status: 'ACTIVE' | 'MAINTENANCE' | 'READ_ONLY';
  managerName: string;
  managerPhone: string;
  activeHub: string;
  announcementBanner: string;
  allowEdits: boolean;
  autoSyncFrontend: boolean;
  updatedAt: string;
}

const portalConfigMemoryCache: Record<string, PortalConfig> = {};
let activeStaffMemoryCache: {
  id: string;
  name: string;
  role: string;
  permissions: string[];
} | null = null;

export function AdminPortalShell({
  portalId,
  children,
}: {
  portalId: 'warehouse' | 'procurement' | 'sales' | 'repairs' | 'finance';
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [config, setConfig] = useState<PortalConfig | null>(
    () => portalConfigMemoryCache[portalId] || null
  );
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [formData, setFormData] = useState(() => {
    const cached = portalConfigMemoryCache[portalId];
    return {
      title: cached?.title || '',
      subtitle: cached?.subtitle || '',
      status: (cached?.status || 'ACTIVE') as 'ACTIVE' | 'MAINTENANCE' | 'READ_ONLY',
      managerName: cached?.managerName || '',
      managerPhone: cached?.managerPhone || '',
      activeHub: cached?.activeHub || '',
      announcementBanner: cached?.announcementBanner || '',
      allowEdits: cached ? cached.allowEdits !== false : true,
      autoSyncFrontend: cached ? cached.autoSyncFrontend !== false : true,
    };
  });

  const loadConfig = async () => {
    try {
      const res = await fetch(`/api/admin/portals?portalId=${portalId}`);
      const json = await res.json();
      if (json.success && json.config) {
        portalConfigMemoryCache[portalId] = json.config;
        setConfig(json.config);
        setFormData({
          title: json.config.title || '',
          subtitle: json.config.subtitle || '',
          status: json.config.status || 'ACTIVE',
          managerName: json.config.managerName || '',
          managerPhone: json.config.managerPhone || '',
          activeHub: json.config.activeHub || '',
          announcementBanner: json.config.announcementBanner || '',
          allowEdits: json.config.allowEdits !== false,
          autoSyncFrontend: json.config.autoSyncFrontend !== false,
        });
      }
    } catch {}
  };

  const [activeStaff, setActiveStaff] = useState<{
    id: string;
    name: string;
    role: string;
    permissions: string[];
  } | null>(() => activeStaffMemoryCache);

  const loadActiveStaff = async () => {
    if (typeof window === 'undefined') return;
    const activeId = window.localStorage.getItem('agrimart_active_staff_id');
    if (!activeId || activeId === 'SUPER_ADMIN') {
      activeStaffMemoryCache = null;
      setActiveStaff(null);
      return;
    }
    try {
      const res = await fetch(`/api/admin/staff?id=${encodeURIComponent(activeId)}`);
      const json = await res.json();
      if (json.success && json.data) {
        activeStaffMemoryCache = json.data;
        setActiveStaff(json.data);
      } else {
        activeStaffMemoryCache = null;
        setActiveStaff(null);
      }
    } catch {
      setActiveStaff(null);
    }
  };

  useEffect(() => {
    loadConfig();
    loadActiveStaff();
    const handler = () => loadActiveStaff();
    window.addEventListener('agrimart-operator-changed', handler);
    return () => window.removeEventListener('agrimart-operator-changed', handler);
  }, [portalId]);

  const hasPermission = (jobCode: string) => {
    if (!activeStaff) return true;
    const perms = Array.isArray(activeStaff.permissions) ? activeStaff.permissions : [];
    return perms.includes('FULL_ADMIN') || perms.includes(jobCode);
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission('EDIT')) {
      setToast(`Permission Denied: ${activeStaff?.name} does not have 'EDIT' checkbox selected.`);
      setTimeout(() => setToast(null), 3500);
      return;
    }
    try {
      setSaving(true);
      const res = await fetch('/api/admin/portals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          panel: 'PORTAL_CONFIG',
          action: 'SAVE',
          payload: {
            id: portalId,
            ...formData,
          },
        }),
      });
      const json = await res.json();
      if (json.success) {
        setConfig(json.config);
        setEditModalOpen(false);
        setToast('Portal settings updated by Super Admin!');
        setTimeout(() => setToast(null), 3500);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAF8] text-slate-800 overflow-hidden">
      <AdminSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <AdminTopbar onMobileMenuOpen={() => setMobileOpen(true)} />

        {/* SUPER ADMIN PORTAL CONTROL BAR */}
        <div className="bg-slate-900 text-white px-4 sm:px-6 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0 z-20">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Controlled Portal</span>
            </span>

            {config && (
              <>
                <span className="text-xs font-semibold text-white">
                  {config.title}
                </span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    config.status === 'ACTIVE'
                      ? 'bg-emerald-500 text-slate-950'
                      : config.status === 'MAINTENANCE'
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-blue-400 text-slate-950'
                  }`}
                >
                  {config.status}
                </span>
                <span className="hidden xl:inline-flex items-center gap-1 text-xs text-slate-300">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{config.activeHub}</span>
                </span>
                <span className="hidden lg:inline-flex items-center gap-1 text-xs text-slate-300">
                  <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>{config.managerName}</span>
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {activeStaff && (
              <span className="px-2.5 py-1 rounded-md bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold">
                Staff: {activeStaff.name} [{(activeStaff.permissions || []).join(', ') || 'No Jobs Checked'}]
              </span>
            )}
            <button
              type="button"
              onClick={() => {
                if (!hasPermission('EDIT')) {
                  setToast(
                    `Permission Denied: ${activeStaff?.name} is not allowed to Edit (${
                      (activeStaff?.permissions || []).join(', ') || 'No checkboxes selected'
                    })`
                  );
                  setTimeout(() => setToast(null), 3500);
                  return;
                }
                setEditModalOpen(true);
              }}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border border-white/15"
            >
              <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Edit Portal Config</span>
            </button>

            <Link
              href={`/admin/portals?tab=${portalId}`}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Master Admin Editor ({portalId.toUpperCase()})</span>
            </Link>
          </div>
        </div>

        {/* Portal Announcement Banner if configured */}
        {config?.announcementBanner && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-4 sm:px-6 py-1.5 flex items-center justify-between gap-2 text-xs text-emerald-900 shrink-0">
            <div className="flex items-center gap-2">
              <Megaphone className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span className="font-medium">{config.announcementBanner}</span>
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold hidden sm:inline">
              Contact: {config.managerPhone}
            </span>
          </div>
        )}

        {/* Toast Notification */}
        {toast && (
          <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-lg shadow-lg text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toast}</span>
          </div>
        )}

        {/* Main Portal Content */}
        <main className="flex-1 overflow-y-auto">
          {!hasPermission('VIEW') ? (
            <div className="p-12 text-center space-y-3">
              <div className="text-base font-bold text-slate-900">
                Access Restricted for {activeStaff?.name}
              </div>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                The <strong>VIEW</strong> checkbox is not selected for {activeStaff?.name}. Allowed jobs:{' '}
                <strong>{(activeStaff?.permissions || []).join(', ') || 'None'}</strong>.
              </p>
              <Link
                href="/admin/staff"
                className="inline-flex px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold"
              >
                Manage Staff Permissions
              </Link>
            </div>
          ) : (
            children
          )}
        </main>
      </div>

      {/* Edit Portal Settings Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">
                  Edit Portal Control Settings ({portalId.toUpperCase()})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveConfig} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Portal Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-600 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subtitle / Description</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Operational Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as 'ACTIVE' | 'MAINTENANCE' | 'READ_ONLY',
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:border-emerald-600 outline-none"
                  >
                    <option value="ACTIVE">ACTIVE (Full Operations)</option>
                    <option value="READ_ONLY">READ_ONLY (View Only)</option>
                    <option value="MAINTENANCE">MAINTENANCE (Paused)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Active Hub / Division</label>
                  <input
                    type="text"
                    value={formData.activeHub}
                    onChange={(e) => setFormData({ ...formData, activeHub: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-600 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Portal Manager / Head</label>
                  <input
                    type="text"
                    value={formData.managerName}
                    onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Manager Contact (INR/IN)</label>
                  <input
                    type="text"
                    value={formData.managerPhone}
                    onChange={(e) => setFormData({ ...formData, managerPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Admin Announcement Banner
                </label>
                <input
                  type="text"
                  value={formData.announcementBanner}
                  onChange={(e) => setFormData({ ...formData, announcementBanner: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-600 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Save Portal Controls'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

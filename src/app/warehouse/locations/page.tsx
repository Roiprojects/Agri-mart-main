'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Warehouse, Store, Users, Truck, Plus, MapPin, Settings } from 'lucide-react';
import { useWmsContext } from '@/components/wms/WmsContext';
import { WmsLoadingState } from '@/components/wms/WmsLoadingState';
import { WmsButton } from '@/components/wms/WmsButton';

const ALL_ROLES = [
  'CENTRAL_ADMIN',
  'WAREHOUSE_MANAGER',
  'DISPATCH_STAFF',
  'RECEIVING_STAFF',
  'FRANCHISEE_MANAGER',
  'FRANCHISEE_DELIVERY',
] as const;

export default function LocationsModulePage() {
  const { loading, portalData, allLocations, postAction } = useWmsContext();
  const [whModal, setWhModal] = useState<any>(null);
  const [frModal, setFrModal] = useState<any>(null);
  const [staffModal, setStaffModal] = useState<any>(null);
  const [carrierModal, setCarrierModal] = useState<any>(null);
  const [summaryFranchisee, setSummaryFranchisee] = useState<any>(null);

  if (loading && !portalData) {
    return <WmsLoadingState label="Loading Locations, Staff Access & Super Admin Shipping..." />;
  }

  const warehouses = portalData?.warehouses || [];
  const franchisees = portalData?.franchisees || [];
  const staffUsers = portalData?.staffUsers || [];
  const carriers = portalData?.carriers || [];
  const shipping = portalData?.superAdminShipping || {};
  const shippingProviders = shipping.shippingProviders || [];
  const shippingSettings = shipping.shippingSettings || null;
  const pickupProviders = shipping.pickupPointProviders || [];

  return (
    <div className="space-y-5">
      {/* 1. Warehouses */}
      <section className="bg-white border border-[#d2d6de] rounded shadow-2xs overflow-hidden">
        <div className="px-4 py-3 border-b border-[#e5e7eb] flex flex-wrap items-center justify-between gap-2 bg-white">
          <div className="flex items-center gap-2">
            <Warehouse className="w-4 h-4 text-[#2585be]" />
            <h2 className="text-sm font-semibold text-slate-800">
              Warehouses (Main &amp; Branches) — Synced with Super Admin
            </h2>
          </div>
          <WmsButton
            variant="primary"
            size="sm"
            onClick={() =>
              setWhModal({
                name: '',
                code: '',
                tier: 'BRANCH',
                address: '',
                district: '',
                latitude: 15.3647,
                longitude: 75.124,
                serviceRadiusKm: 60,
                servicedPincodes: '',
                managerName: '',
                operatingContact: '',
                isActive: true,
              })
            }
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Warehouse
          </WmsButton>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-[#f4f6f9] text-slate-700 font-semibold border-b border-[#e5e7eb]">
                <th className="py-2.5 px-3 border-r border-[#e5e7eb]">Code / Tier</th>
                <th className="py-2.5 px-3 border-r border-[#e5e7eb]">Name &amp; Address</th>
                <th className="py-2.5 px-3 border-r border-[#e5e7eb]">District / Radius</th>
                <th className="py-2.5 px-3 border-r border-[#e5e7eb]">Manager &amp; Contact</th>
                <th className="py-2.5 px-3 border-r border-[#e5e7eb] text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {warehouses.map((w: any) => (
                <tr key={w.id} className="border-b border-[#f0f0f0] hover:bg-slate-50">
                  <td className="py-2.5 px-3 border-r border-[#f0f0f0] font-mono">
                    <span className="font-semibold text-[#2585be]">{w.code}</span>
                    <span className="ml-1.5 px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] text-slate-700">
                      {w.tier}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 border-r border-[#f0f0f0]">
                    <div className="font-semibold text-slate-800">{w.name}</div>
                    <div className="text-[11px] text-slate-500">{w.address}</div>
                  </td>
                  <td className="py-2.5 px-3 border-r border-[#f0f0f0] text-slate-700">
                    <div>{w.district}</div>
                    <div className="text-[11px] text-slate-500">{w.serviceRadiusKm} km radius</div>
                  </td>
                  <td className="py-2.5 px-3 border-r border-[#f0f0f0] text-slate-700">
                    <div>{w.managerName}</div>
                    <div className="text-[11px] text-slate-500">{w.operatingContact || w.contactNumber}</div>
                  </td>
                  <td className="py-2.5 px-3 border-r border-[#f0f0f0] text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        w.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {w.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right space-x-2">
                    <button type="button" onClick={() => setWhModal({ ...w })} className="text-[#2585be] hover:underline font-medium cursor-pointer">
                      Edit
                    </button>
                    <button type="button" onClick={() => postAction({ action: 'DELETE_WAREHOUSE', id: w.id })} className="text-[#dd4b39] hover:underline font-medium cursor-pointer">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 2. Franchisees */}
      <section className="bg-white border border-[#d2d6de] rounded shadow-2xs overflow-hidden">
        <div className="px-4 py-3 border-b border-[#e5e7eb] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-[#2585be]" />
            <h2 className="text-sm font-semibold text-slate-800">Franchisees &amp; Linked Warehouses</h2>
          </div>
          <WmsButton
            variant="primary"
            size="sm"
            onClick={() =>
              setFrModal({
                name: '',
                code: '',
                address: '',
                district: '',
                latitude: 15.4,
                longitude: 75.15,
                contact: '',
                linkedWarehouseIds: [],
                isActive: true,
              })
            }
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Franchisee
          </WmsButton>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-[#f4f6f9] text-slate-700 font-semibold border-b border-[#e5e7eb]">
                <th className="py-2.5 px-3 border-r border-[#e5e7eb]">Code</th>
                <th className="py-2.5 px-3 border-r border-[#e5e7eb]">Name &amp; Address</th>
                <th className="py-2.5 px-3 border-r border-[#e5e7eb]">Contact</th>
                <th className="py-2.5 px-3 border-r border-[#e5e7eb]">Linked Warehouses</th>
                <th className="py-2.5 px-3 border-r border-[#e5e7eb] text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {franchisees.map((f: any) => (
                <tr key={f.id} className="border-b border-[#f0f0f0] hover:bg-slate-50">
                  <td className="py-2.5 px-3 border-r border-[#f0f0f0] font-mono font-semibold text-[#2585be]">{f.code}</td>
                  <td className="py-2.5 px-3 border-r border-[#f0f0f0]">
                    <button
                      type="button"
                      onClick={() => setSummaryFranchisee(f)}
                      className="font-semibold text-[#2585be] hover:underline text-left cursor-pointer"
                    >
                      {f.name}
                    </button>
                    <div className="text-[11px] text-slate-500">{f.address} ({f.district})</div>
                  </td>
                  <td className="py-2.5 px-3 border-r border-[#f0f0f0] text-slate-700">{f.contact}</td>
                  <td className="py-2.5 px-3 border-r border-[#f0f0f0]">
                    <div className="flex flex-wrap gap-1">
                      {(f.linkedWarehouseIds || []).map((wid: string) => {
                        const wh = warehouses.find((w: any) => w.id === wid);
                        return (
                          <span key={wid} className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 text-[10px]">
                            {wh ? wh.name : wid}
                          </span>
                        );
                      })}
                    </div>
                  </td>
                  <td className="py-2.5 px-3 border-r border-[#f0f0f0] text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${f.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'}`}>
                      {f.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right space-x-2">
                    <button type="button" onClick={() => setSummaryFranchisee(f)} className="text-[#00a65a] hover:underline font-semibold cursor-pointer">
                      Summary
                    </button>
                    <button type="button" onClick={() => setFrModal({ ...f })} className="text-[#2585be] hover:underline font-medium cursor-pointer">
                      Edit
                    </button>
                    <button type="button" onClick={() => postAction({ action: 'DELETE_FRANCHISEE', id: f.id })} className="text-[#dd4b39] hover:underline font-medium cursor-pointer">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. Users & Access */}
      <section className="bg-white border border-[#d2d6de] rounded shadow-2xs overflow-hidden">
        <div className="px-4 py-3 border-b border-[#e5e7eb] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#2585be]" />
            <h2 className="text-sm font-semibold text-slate-800">Users &amp; Access (Staff Profiles &amp; Roles)</h2>
          </div>
          <WmsButton
            variant="primary"
            size="sm"
            onClick={() =>
              setStaffModal({
                name: '',
                email: '',
                mobile: '',
                loginId: '',
                password: '',
                status: 'ACTIVE',
                assignments: [
                  {
                    locationId: allLocations[0]?.id || '',
                    locationKind: allLocations[0]?.kind || 'WAREHOUSE',
                    roles: ['RECEIVING_STAFF'],
                  },
                ],
              })
            }
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            Invite Staff User
          </WmsButton>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-[#f4f6f9] text-slate-700 font-semibold border-b border-[#e5e7eb]">
                <th className="py-2.5 px-3 border-r border-[#e5e7eb]">Staff Name</th>
                <th className="py-2.5 px-3 border-r border-[#e5e7eb]">Email / Mobile</th>
                <th className="py-2.5 px-3 border-r border-[#e5e7eb]">Portal Credentials (ID / Password)</th>
                <th className="py-2.5 px-3 border-r border-[#e5e7eb]">Location &amp; Role Assignments</th>
                <th className="py-2.5 px-3 border-r border-[#e5e7eb] text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staffUsers.map((u: any) => (
                <tr key={u.id} className="border-b border-[#f0f0f0] hover:bg-slate-50">
                  <td className="py-2.5 px-3 border-r border-[#f0f0f0] font-semibold text-slate-800">{u.name}</td>
                  <td className="py-2.5 px-3 border-r border-[#f0f0f0] text-slate-700">
                    <div>{u.email}</div>
                    <div className="text-[11px] text-slate-500">{u.mobile}</div>
                  </td>
                  <td className="py-2.5 px-3 border-r border-[#f0f0f0] font-mono text-[11px]">
                    <div>
                      <span className="text-slate-500">ID:</span>{' '}
                      <span className="text-[#2585be] font-semibold">{u.loginId || u.email || u.mobile || '—'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Pass:</span>{' '}
                      <span className="text-slate-800 font-semibold">{u.password || 'franchisee@123'}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 border-r border-[#f0f0f0] space-y-1">
                    {(u.assignments || []).map((a: any, idx: number) => {
                      const loc = allLocations.find((l: any) => l.id === a.locationId);
                      return (
                        <div key={idx} className="text-[11px]">
                          <span className="text-[#2585be] font-semibold">{loc?.name || a.locationId}</span>
                          <span className="text-slate-600"> — {a.roles.join(', ')}</span>
                        </div>
                      );
                    })}
                  </td>
                  <td className="py-2.5 px-3 border-r border-[#f0f0f0] text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${u.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right space-x-2">
                    <button type="button" onClick={() => setStaffModal({ ...u })} className="text-[#2585be] hover:underline font-medium cursor-pointer">Edit</button>
                    <button type="button" onClick={() => postAction({ action: 'RESEND_INVITE', id: u.id })} className="text-amber-600 hover:underline font-medium cursor-pointer">Resend Invite</button>
                    <button type="button" onClick={() => postAction({ action: 'TOGGLE_STAFF_STATUS', id: u.id })} className="text-slate-600 hover:underline font-medium cursor-pointer">{u.status === 'SUSPENDED' ? 'Activate' : 'Suspend'}</button>
                    <button type="button" onClick={() => postAction({ action: 'DELETE_STAFF', id: u.id })} className="text-[#dd4b39] hover:underline font-medium cursor-pointer">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. Super Admin Shipping Connection & Delivery Channel Partners */}
      <section className="bg-white border border-[#d2d6de] rounded shadow-2xs overflow-hidden">
        <div className="px-4 py-3 border-b border-[#e5e7eb] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#2585be]" />
            <h2 className="text-sm font-semibold text-slate-800">
              Super Admin Shipping Configuration &amp; Delivery Channel Partners
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/admin/configuration/shipping-providers" className="text-xs text-[#2585be] hover:underline font-medium">
              Open Shipping Providers →
            </Link>
            <WmsButton
              variant="primary"
              size="sm"
              onClick={() =>
                setCarrierModal({
                  name: '',
                  code: '',
                  mode: 'MANUAL',
                  trackingUrlTemplate: '',
                  contactMobile: '',
                  isActive: true,
                })
              }
              icon={<Plus className="w-3.5 h-3.5" />}
            >
              Add Delivery Partner
            </WmsButton>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {shippingSettings && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-[#f4f6f9] border border-[#e5e7eb] rounded p-3">
                <div className="font-semibold text-slate-700 mb-1">Shipping Origin (Super Admin)</div>
                <div className="text-slate-600">
                  {shippingSettings.shippingOrigin?.company || 'Agri-Mart Central'} —{' '}
                  {shippingSettings.shippingOrigin?.city || 'Hubballi'}, {shippingSettings.shippingOrigin?.stateProvince || 'Karnataka'}
                </div>
              </div>
              <div className="bg-[#f4f6f9] border border-[#e5e7eb] rounded p-3">
                <div className="font-semibold text-slate-700 mb-1">Warehouse &amp; Pickup Flags</div>
                <div className="text-slate-600">
                  Use Warehouse Location: <strong>{shippingSettings.useWarehouseLocation ? 'Enabled' : 'Disabled'}</strong> •
                  Pick Up In Store: <strong>{shippingSettings.pickUpInStoreEnabled ? 'Enabled' : 'Disabled'}</strong>
                </div>
              </div>
              <div className="bg-[#f4f6f9] border border-[#e5e7eb] rounded p-3">
                <div className="font-semibold text-slate-700 mb-1">Pickup Point Providers (Super Admin)</div>
                <div className="text-slate-600">
                  {pickupProviders.length > 0
                    ? pickupProviders.map((p: any) => p.friendlyName).join(', ')
                    : 'Pickup in store active'}
                </div>
              </div>
            </div>
          )}

          {shippingProviders.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-slate-700 mb-2">Super Admin Shipping Providers</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
                {shippingProviders.map((sp: any) => (
                  <div key={sp.id} className="border border-[#d2d6de] rounded p-2.5 flex items-center justify-between bg-white">
                    <div>
                      <div className="font-semibold text-slate-800">{sp.friendlyName}</div>
                      <div className="text-[11px] font-mono text-slate-500">{sp.systemName}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => postAction({ action: 'TOGGLE_SUPER_ADMIN_PROVIDER', id: sp.id })}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer ${
                        sp.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}
                    >
                      {sp.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-xs font-semibold text-slate-700 mb-2">WMS Delivery Channel Partners</h3>
            <div className="overflow-x-auto border border-[#e5e7eb] rounded">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-[#f4f6f9] text-slate-700 font-semibold border-b border-[#e5e7eb]">
                    <th className="py-2 px-3 border-r border-[#e5e7eb]">Code</th>
                    <th className="py-2 px-3 border-r border-[#e5e7eb]">Carrier Name</th>
                    <th className="py-2 px-3 border-r border-[#e5e7eb]">Mode</th>
                    <th className="py-2 px-3 border-r border-[#e5e7eb]">Tracking URL Template</th>
                    <th className="py-2 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {carriers.map((c: any) => (
                    <tr key={c.id} className="border-b border-[#f0f0f0] hover:bg-slate-50">
                      <td className="py-2 px-3 border-r border-[#f0f0f0] font-mono text-[#2585be] font-semibold">{c.code}</td>
                      <td className="py-2 px-3 border-r border-[#f0f0f0] font-semibold text-slate-800">{c.name}</td>
                      <td className="py-2 px-3 border-r border-[#f0f0f0]">{c.mode}</td>
                      <td className="py-2 px-3 border-r border-[#f0f0f0] font-mono text-[11px] text-slate-500">{c.trackingUrlTemplate}</td>
                      <td className="py-2 px-3 text-right space-x-2">
                        <button type="button" onClick={() => setCarrierModal({ ...c })} className="text-[#2585be] hover:underline font-medium cursor-pointer">Edit</button>
                        <button type="button" onClick={() => postAction({ action: 'DELETE_CARRIER', id: c.id })} className="text-[#dd4b39] hover:underline font-medium cursor-pointer">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Warehouse Modal */}
      {whModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white border border-[#d2d6de] rounded shadow-xl w-full max-w-lg p-5 space-y-3 text-xs">
            <h3 className="text-sm font-semibold text-slate-800">{whModal.id ? 'Edit Warehouse' : 'Add Warehouse'}</h3>
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Name" value={whModal.name} onChange={(e) => setWhModal({ ...whModal, name: e.target.value })} className="border border-[#d2d6de] rounded px-2.5 py-1.5" />
              <input placeholder="Code" value={whModal.code} onChange={(e) => setWhModal({ ...whModal, code: e.target.value })} className="border border-[#d2d6de] rounded px-2.5 py-1.5" />
              <select value={whModal.tier} onChange={(e) => setWhModal({ ...whModal, tier: e.target.value })} className="border border-[#d2d6de] rounded px-2.5 py-1.5">
                <option value="MAIN">MAIN Warehouse</option>
                <option value="BRANCH">BRANCH Warehouse</option>
              </select>
              <input placeholder="District" value={whModal.district} onChange={(e) => setWhModal({ ...whModal, district: e.target.value })} className="border border-[#d2d6de] rounded px-2.5 py-1.5" />
              <input placeholder="Address" value={whModal.address} onChange={(e) => setWhModal({ ...whModal, address: e.target.value })} className="col-span-2 border border-[#d2d6de] rounded px-2.5 py-1.5" />
              <input placeholder="Manager Name" value={whModal.managerName} onChange={(e) => setWhModal({ ...whModal, managerName: e.target.value })} className="border border-[#d2d6de] rounded px-2.5 py-1.5" />
              <input placeholder="Operating Contact" value={whModal.operatingContact} onChange={(e) => setWhModal({ ...whModal, operatingContact: e.target.value })} className="border border-[#d2d6de] rounded px-2.5 py-1.5" />
              <input type="number" step="0.0001" placeholder="Latitude" value={whModal.latitude} onChange={(e) => setWhModal({ ...whModal, latitude: e.target.value })} className="border border-[#d2d6de] rounded px-2.5 py-1.5" />
              <input type="number" step="0.0001" placeholder="Longitude" value={whModal.longitude} onChange={(e) => setWhModal({ ...whModal, longitude: e.target.value })} className="border border-[#d2d6de] rounded px-2.5 py-1.5" />
              <input type="number" placeholder="Service Radius (km)" value={whModal.serviceRadiusKm} onChange={(e) => setWhModal({ ...whModal, serviceRadiusKm: e.target.value })} className="border border-[#d2d6de] rounded px-2.5 py-1.5" />
              <label className="flex items-center gap-2 text-slate-700">
                <input type="checkbox" checked={whModal.isActive} onChange={(e) => setWhModal({ ...whModal, isActive: e.target.checked })} /> Active
              </label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <WmsButton onClick={() => setWhModal(null)}>Cancel</WmsButton>
              <WmsButton variant="primary" onClick={async () => { const r = await postAction({ action: 'SAVE_WAREHOUSE', ...whModal }); if (r) setWhModal(null); }}>Save Warehouse</WmsButton>
            </div>
          </div>
        </div>
      )}

      {/* Franchisee Modal */}
      {frModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white border border-[#d2d6de] rounded shadow-xl w-full max-w-lg p-5 space-y-3 text-xs">
            <h3 className="text-sm font-semibold text-slate-800">{frModal.id ? 'Edit Franchisee' : 'Add Franchisee'}</h3>
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Franchisee Name" value={frModal.name} onChange={(e) => setFrModal({ ...frModal, name: e.target.value })} className="border border-[#d2d6de] rounded px-2.5 py-1.5" />
              <input placeholder="Code" value={frModal.code} onChange={(e) => setFrModal({ ...frModal, code: e.target.value })} className="border border-[#d2d6de] rounded px-2.5 py-1.5" />
              <input placeholder="Address" value={frModal.address} onChange={(e) => setFrModal({ ...frModal, address: e.target.value })} className="col-span-2 border border-[#d2d6de] rounded px-2.5 py-1.5" />
              <input placeholder="District" value={frModal.district} onChange={(e) => setFrModal({ ...frModal, district: e.target.value })} className="border border-[#d2d6de] rounded px-2.5 py-1.5" />
              <input placeholder="Contact" value={frModal.contact} onChange={(e) => setFrModal({ ...frModal, contact: e.target.value })} className="border border-[#d2d6de] rounded px-2.5 py-1.5" />
            </div>
            <div className="space-y-1">
              <div className="text-slate-700 font-semibold">Linked Warehouses:</div>
              <div className="flex flex-wrap gap-2">
                {warehouses.map((w: any) => {
                  const checked = (frModal.linkedWarehouseIds || []).includes(w.id);
                  return (
                    <label key={w.id} className="flex items-center gap-1.5 bg-[#f4f6f9] px-2 py-1 rounded border border-[#d2d6de] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          const list = new Set(frModal.linkedWarehouseIds || []);
                          if (e.target.checked) list.add(w.id);
                          else list.delete(w.id);
                          setFrModal({ ...frModal, linkedWarehouseIds: Array.from(list) });
                        }}
                      />
                      <span>{w.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <WmsButton onClick={() => setFrModal(null)}>Cancel</WmsButton>
              <WmsButton variant="primary" onClick={async () => { const r = await postAction({ action: 'SAVE_FRANCHISEE', ...frModal }); if (r) setFrModal(null); }}>Save Franchisee</WmsButton>
            </div>
          </div>
        </div>
      )}

      {/* Staff Modal */}
      {staffModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white border border-[#d2d6de] rounded shadow-xl w-full max-w-lg p-5 space-y-3 text-xs">
            <h3 className="text-sm font-semibold text-slate-800">{staffModal.id ? 'Edit Staff Access' : 'Invite Staff User'}</h3>
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Full Name" value={staffModal.name} onChange={(e) => setStaffModal({ ...staffModal, name: e.target.value })} className="border border-[#d2d6de] rounded px-2.5 py-1.5" />
              <input placeholder="Email" value={staffModal.email} onChange={(e) => setStaffModal({ ...staffModal, email: e.target.value })} className="border border-[#d2d6de] rounded px-2.5 py-1.5" />
              <input placeholder="Mobile" value={staffModal.mobile} onChange={(e) => setStaffModal({ ...staffModal, mobile: e.target.value })} className="border border-[#d2d6de] rounded px-2.5 py-1.5" />
              <select value={staffModal.status} onChange={(e) => setStaffModal({ ...staffModal, status: e.target.value })} className="border border-[#d2d6de] rounded px-2.5 py-1.5">
                <option value="ACTIVE">ACTIVE</option>
                <option value="INVITED">INVITED</option>
                <option value="SUSPENDED">SUSPENDED</option>
              </select>
              <input placeholder="Login User ID (e.g. email/mobile)" value={staffModal.loginId || ''} onChange={(e) => setStaffModal({ ...staffModal, loginId: e.target.value })} className="border border-[#d2d6de] rounded px-2.5 py-1.5" />
              <input type="text" placeholder="Portal Password" value={staffModal.password || ''} onChange={(e) => setStaffModal({ ...staffModal, password: e.target.value })} className="border border-[#d2d6de] rounded px-2.5 py-1.5" />
            </div>
            <div className="space-y-2">
              <div className="text-slate-700 font-semibold">Location &amp; Roles Assignment:</div>
              {(staffModal.assignments || []).map((a: any, idx: number) => (
                <div key={idx} className="bg-[#f4f6f9] border border-[#d2d6de] p-2.5 rounded space-y-2">
                  <select
                    value={a.locationId}
                    onChange={(e) => {
                      const loc = allLocations.find((l: any) => l.id === e.target.value);
                      const copy = [...staffModal.assignments];
                      copy[idx] = { ...copy[idx], locationId: e.target.value, locationKind: loc?.kind || 'WAREHOUSE' };
                      setStaffModal({ ...staffModal, assignments: copy });
                    }}
                    className="w-full bg-white border border-[#d2d6de] rounded px-2 py-1"
                  >
                    {allLocations.map((l: any) => (
                      <option key={l.id} value={l.id}>[{l.kind}] {l.name}</option>
                    ))}
                  </select>
                  <div className="flex flex-wrap gap-2">
                    {ALL_ROLES.map((role) => (
                      <label key={role} className="flex items-center gap-1 text-[11px]">
                        <input
                          type="checkbox"
                          checked={a.roles.includes(role)}
                          onChange={(e) => {
                            const copy = [...staffModal.assignments];
                            const set = new Set(copy[idx].roles);
                            if (e.target.checked) set.add(role);
                            else set.delete(role);
                            copy[idx] = { ...copy[idx], roles: Array.from(set) };
                            setStaffModal({ ...staffModal, assignments: copy });
                          }}
                        />
                        <span>{role}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <WmsButton onClick={() => setStaffModal(null)}>Cancel</WmsButton>
              <WmsButton variant="primary" onClick={async () => { const r = await postAction({ action: 'SAVE_STAFF', ...staffModal }); if (r) setStaffModal(null); }}>Save Staff</WmsButton>
            </div>
          </div>
        </div>
      )}

      {/* Carrier Modal */}
      {carrierModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white border border-[#d2d6de] rounded shadow-xl w-full max-w-md p-5 space-y-3 text-xs">
            <h3 className="text-sm font-semibold text-slate-800">{carrierModal.id ? 'Edit Delivery Partner' : 'Add Delivery Partner'}</h3>
            <input placeholder="Carrier Name" value={carrierModal.name} onChange={(e) => setCarrierModal({ ...carrierModal, name: e.target.value })} className="w-full border border-[#d2d6de] rounded px-2.5 py-1.5" />
            <input placeholder="Code" value={carrierModal.code} onChange={(e) => setCarrierModal({ ...carrierModal, code: e.target.value })} className="w-full border border-[#d2d6de] rounded px-2.5 py-1.5" />
            <select value={carrierModal.mode} onChange={(e) => setCarrierModal({ ...carrierModal, mode: e.target.value })} className="w-full border border-[#d2d6de] rounded px-2.5 py-1.5">
              <option value="MANUAL">MANUAL</option>
              <option value="CONNECTED">CONNECTED</option>
            </select>
            <input placeholder="Tracking URL Template (use {AWB})" value={carrierModal.trackingUrlTemplate} onChange={(e) => setCarrierModal({ ...carrierModal, trackingUrlTemplate: e.target.value })} className="w-full border border-[#d2d6de] rounded px-2.5 py-1.5" />
            <div className="flex justify-end gap-2 pt-2">
              <WmsButton onClick={() => setCarrierModal(null)}>Cancel</WmsButton>
              <WmsButton variant="primary" onClick={async () => { const r = await postAction({ action: 'SAVE_CARRIER', ...carrierModal }); if (r) setCarrierModal(null); }}>Save Carrier</WmsButton>
            </div>
          </div>
        </div>
      )}
      {/* Complete Franchisee Summary Modal */}
      {summaryFranchisee && (() => {
        const fr = summaryFranchisee;
        const frStaff = staffUsers.filter((u: any) =>
          (u.assignments || []).some((a: any) => a.locationId === fr.id)
        );
        const frOrders = (portalData?.orders || []).filter(
          (o: any) => o.fulfillment?.franchiseeId === fr.id
        );
        const deliveredOrders = frOrders.filter((o: any) => o.fulfillment?.status === 'DELIVERED');
        const pendingOrders = frOrders.filter(
          (o: any) => !['DELIVERED', 'CANCELLED'].includes(o.fulfillment?.status || '')
        );
        const frStocks = (portalData?.stocks || []).filter((s: any) => s.locationId === fr.id);
        const totalOnHand = frStocks.reduce((acc: number, s: any) => acc + (s.onHand || 0), 0);
        const totalReserved = frStocks.reduce((acc: number, s: any) => acc + (s.reserved || 0), 0);
        const totalAvailable = Math.max(0, totalOnHand - totalReserved);
        const frRequests = (portalData?.stockRequests || []).filter(
          (r: any) => r.franchiseeId === fr.id
        );

        return (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white border border-[#d2d6de] rounded shadow-xl w-full max-w-2xl p-5 space-y-4 text-xs my-8">
              <div className="flex items-start justify-between border-b border-[#e5e7eb] pb-3">
                <div>
                  <h3 className="text-base font-semibold text-slate-800">{fr.name} ({fr.code})</h3>
                  <p className="text-slate-500 mt-0.5">{fr.address} • {fr.district} • Contact: {fr.contact}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${fr.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'}`}>
                  {fr.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-[#f4f6f9] border border-[#e5e7eb] rounded p-3">
                  <div className="text-slate-500 text-[11px]">Total Assigned Orders</div>
                  <div className="text-lg font-bold text-slate-800">{frOrders.length}</div>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded p-3">
                  <div className="text-emerald-700 text-[11px]">Orders Delivered</div>
                  <div className="text-lg font-bold text-[#00a65a]">{deliveredOrders.length}</div>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded p-3">
                  <div className="text-amber-700 text-[11px]">Pending Delivery</div>
                  <div className="text-lg font-bold text-amber-700">{pendingOrders.length}</div>
                </div>
                <div className="bg-[#e8f4fa] border border-[#b8dcf0] rounded p-3">
                  <div className="text-[#1f72a3] text-[11px]">Stock Available / On Hand</div>
                  <div className="text-lg font-bold text-[#2585be]">{totalAvailable} / {totalOnHand}</div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="font-semibold text-slate-700">Staff / Managers Handling This Franchisee ({frStaff.length}):</div>
                {frStaff.length === 0 ? (
                  <div className="text-slate-500">No staff assigned yet.</div>
                ) : (
                  <div className="space-y-1">
                    {frStaff.map((u: any) => (
                      <div key={u.id} className="bg-[#f4f6f9] border border-[#e5e7eb] rounded px-3 py-1.5 flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <strong className="text-slate-800">{u.name}</strong> ({u.mobile || u.email})
                        </div>
                        <div className="font-mono text-[11px] text-[#2585be]">
                          ID: {u.loginId || u.email} • Roles: {(u.assignments || []).find((a: any) => a.locationId === fr.id)?.roles?.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="font-semibold text-slate-700">Stock Requests from {fr.name} ({frRequests.length}):</div>
                {frRequests.length === 0 ? (
                  <div className="text-slate-500">No stock requests submitted yet.</div>
                ) : (
                  <div className="space-y-1 max-h-36 overflow-y-auto">
                    {frRequests.map((r: any) => (
                      <div key={r.id} className="bg-[#f4f6f9] border border-[#e5e7eb] rounded px-3 py-1.5 flex items-center justify-between">
                        <span>
                          <strong className="text-[#2585be]">{r.requestNumber}</strong> → Source: <strong>[{r.sourceTier || 'WAREHOUSE'}] {r.targetWarehouseName}</strong>
                        </span>
                        <span className="font-semibold">{r.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <WmsButton onClick={() => setSummaryFranchisee(null)}>Close</WmsButton>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

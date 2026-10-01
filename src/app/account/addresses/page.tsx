'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, Plus, Trash2, CheckCircle2, Home } from 'lucide-react';

export default function CustomerAddressesPage() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: 'Ramesh Kumar Gowda',
    mobile: '9845190812',
    alternateMobile: '',
    addressLine: '',
    landmark: '',
    taluk: 'Mandya',
    village: '',
    district: 'Mandya',
    state: 'Karnataka',
    pincode: '571401',
    isDefaultShipping: true,
  });

  const fetchAddresses = () => {
    fetch('/api/customer/addresses')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAddresses(data.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/customer/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'usr-farmer-01', ...newAddress }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAdding(false);
        fetchAddresses();
      } else {
        alert(data.message || 'Failed to save address.');
      }
    } catch (err: any) {
      alert('Error saving address: ' + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    try {
      const res = await fetch(`/api/customer/addresses?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchAddresses();
      }
    } catch (err: any) {
      alert('Error deleting address: ' + err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-xs">
      <Link href="/account" className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Account
      </Link>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Saved Farm &amp; Delivery Addresses</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage delivery destinations for power tillers, equipment, and bio-inputs.</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-agri-green hover:bg-agri-green-dark text-white font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition shadow-xs"
        >
          <Plus className="w-4 h-4" /> {isAdding ? 'Cancel' : 'Add New Farm Address'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSave} className="bg-white rounded-3xl border border-agri-green/40 p-6 shadow-sm space-y-4 animate-fadeIn">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <MapPin className="w-4 h-4 text-agri-green" /> Add Karnataka Farm / Delivery Address
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={newAddress.fullName}
                onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mobile Number *</label>
              <input
                type="text"
                required
                value={newAddress.mobile}
                onChange={(e) => setNewAddress({ ...newAddress, mobile: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-xl"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Address / Farm Plot / Sy. No *</label>
              <input
                type="text"
                required
                placeholder="Farm Plot #14, Sy. No 124, Maddur Road"
                value={newAddress.addressLine}
                onChange={(e) => setNewAddress({ ...newAddress, addressLine: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Village / Town *</label>
              <input
                type="text"
                required
                placeholder="e.g. Kothathi"
                value={newAddress.village}
                onChange={(e) => setNewAddress({ ...newAddress, village: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Taluk *</label>
              <input
                type="text"
                required
                placeholder="e.g. Mandya"
                value={newAddress.taluk}
                onChange={(e) => setNewAddress({ ...newAddress, taluk: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">District *</label>
              <input
                type="text"
                required
                placeholder="e.g. Mandya"
                value={newAddress.district}
                onChange={(e) => setNewAddress({ ...newAddress, district: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">PIN Code (For Dark Warehouse Routing) *</label>
              <input
                type="text"
                required
                placeholder="e.g. 571401"
                value={newAddress.pincode}
                onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="defaultShipping"
              checked={newAddress.isDefaultShipping}
              onChange={(e) => setNewAddress({ ...newAddress, isDefaultShipping: e.target.checked })}
              className="w-4 h-4 text-agri-green rounded"
            />
            <label htmlFor="defaultShipping" className="text-slate-700 font-semibold cursor-pointer">
              Set as primary shipping address for checkout
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-agri-green hover:bg-agri-green-dark text-white rounded-xl font-bold shadow-xs"
            >
              Save Address
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="py-16 text-center text-slate-500">Loading addresses...</div>
      ) : addresses.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-500">
          No addresses saved. Click "Add New Farm Address" to set up your delivery destination.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`bg-white rounded-3xl border p-6 shadow-sm space-y-3 relative ${
                addr.isDefaultShipping ? 'border-agri-green ring-2 ring-agri-green/10' : 'border-slate-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-1.5 font-extrabold text-slate-900 text-sm">
                  <Home className="w-4 h-4 text-agri-green" /> {addr.fullName}
                </div>
                {addr.isDefaultShipping && (
                  <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                    Default Shipping
                  </span>
                )}
              </div>

              <div className="text-slate-600 space-y-0.5 leading-relaxed">
                <p>{addr.addressLine}</p>
                <p>
                  {addr.village && `${addr.village}, `}
                  {addr.taluk && `${addr.taluk} Taluk, `}
                  {addr.district} - {addr.pincode}
                </p>
                <p className="font-semibold text-slate-800">Phone: +91-{addr.mobile}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => handleDelete(addr.id)}
                  className="text-slate-400 hover:text-rose-600 transition p-1.5 rounded-lg"
                  title="Delete address"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

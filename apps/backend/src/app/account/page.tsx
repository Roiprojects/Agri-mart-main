import React from 'react';
import Link from 'next/link';
import { User, FileText, Tractor, Wrench, Wallet, MapPin, Sparkles, ArrowRight, Bell } from 'lucide-react';
import { ApiClient } from '@/lib/api-client';

const defaultProfile = {
  name: 'Ramesh Kumar Gowda',
  mobile: '+91 98451 90812',
  villagePanchayat: 'Kothathi',
  taluk: 'Mandya',
  district: 'Mandya',
  acreage: '4.5',
  cropName: 'Sugarcane (Co 86032)',
  irrigationType: 'Drip',
  currentCropStage: 3,
  sownDate: '2026-06-10',
  cropCycleDays: 360,
};

export default async function AccountPage() {
  let profile = defaultProfile;
  let orders: any[] = [];
  let rentals: any[] = [];
  let services: any[] = [];

  try {
    const [profRes, ordRes, rentRes, servRes] = await Promise.allSettled([
      ApiClient.getFarmerProfile('usr-farmer-01'),
      ApiClient.getCustomerOrders('usr-farmer-01'),
      ApiClient.getCustomerRentals('usr-farmer-01'),
      ApiClient.getCustomerServices('usr-farmer-01'),
    ]);

    if (profRes.status === 'fulfilled' && profRes.value?.success && profRes.value?.data) {
      profile = { ...defaultProfile, ...profRes.value.data };
    }
    if (ordRes.status === 'fulfilled' && ordRes.value?.success && ordRes.value?.data) {
      orders = ordRes.value.data;
    }
    if (rentRes.status === 'fulfilled' && rentRes.value?.success && rentRes.value?.data) {
      rentals = rentRes.value.data;
    }
    if (servRes.status === 'fulfilled' && servRes.value?.success && servRes.value?.data) {
      services = servRes.value.data;
    }
  } catch (err) {
    // Graceful fallback
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Profile Card */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-amber-400 text-slate-950 font-black text-xl flex items-center justify-center border-2 border-white">
            {profile.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">Registered Farmer</div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">{profile.name}</h1>
            <div className="text-xs text-emerald-200 mt-0.5">
              {profile.mobile} &bull; {profile.villagePanchayat}, {profile.taluk}, {profile.district}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <Link
            href="/account/farm-profile"
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-4 py-2 rounded-xl transition"
          >
            Edit Farm Data Form (19 Fields)
          </Link>
          <Link
            href="/ai-advisory"
            className="bg-emerald-700 hover:bg-emerald-600 text-white font-semibold px-4 py-2 rounded-xl transition border border-emerald-500/40"
          >
            Run AI Advisory
          </Link>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          href="/account/orders"
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-emerald-600 hover:shadow-md transition group"
        >
          <div className="text-emerald-700 mb-2 group-hover:scale-110 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <div className="font-bold text-sm text-slate-900">Orders</div>
          <div className="text-xs text-slate-500 mt-0.5">{orders.length} Active / Past Orders</div>
        </Link>

        <Link
          href="/account/rentals"
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-emerald-600 hover:shadow-md transition group"
        >
          <div className="text-emerald-700 mb-2 group-hover:scale-110 transition-transform">
            <Tractor className="w-5 h-5" />
          </div>
          <div className="font-bold text-sm text-slate-900">Equipment Rentals</div>
          <div className="text-xs text-slate-500 mt-0.5">{rentals.length} Machinery Bookings</div>
        </Link>

        <Link
          href="/account/services"
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-emerald-600 hover:shadow-md transition group"
        >
          <div className="text-emerald-700 mb-2 group-hover:scale-110 transition-transform">
            <Wrench className="w-5 h-5" />
          </div>
          <div className="font-bold text-sm text-slate-900">Farm Services</div>
          <div className="text-xs text-slate-500 mt-0.5">{services.length} GPS Bookings</div>
        </Link>

        <Link
          href="/account/addresses"
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-emerald-600 hover:shadow-md transition group"
        >
          <div className="text-emerald-700 mb-2 group-hover:scale-110 transition-transform">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="font-bold text-sm text-slate-900">Saved Addresses</div>
          <div className="text-xs text-slate-500 mt-0.5">Manage Farm Plots</div>
        </Link>

        <Link
          href="/account/notifications"
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-emerald-600 hover:shadow-md transition group"
        >
          <div className="text-emerald-700 mb-2 group-hover:scale-110 transition-transform">
            <Bell className="w-5 h-5" />
          </div>
          <div className="font-bold text-sm text-slate-900">Notifications</div>
          <div className="text-xs text-slate-500 mt-0.5">SMS &amp; WhatsApp History</div>
        </Link>

        <Link
          href="/account/wishlist"
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-emerald-600 hover:shadow-md transition group"
        >
          <div className="text-emerald-700 mb-2 group-hover:scale-110 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="font-bold text-sm text-slate-900">Saved Wishlist</div>
          <div className="text-xs text-slate-500 mt-0.5">Preferred Machinery</div>
        </Link>

        <Link
          href="/account/wallet"
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-emerald-600 hover:shadow-md transition group"
        >
          <div className="text-emerald-700 mb-2 group-hover:scale-110 transition-transform">
            <Wallet className="w-5 h-5" />
          </div>
          <div className="font-bold text-sm text-slate-900">Kisan Wallet (Optional)</div>
          <div className="text-xs text-slate-500 mt-0.5">₹2,500 Credits</div>
        </Link>
      </div>

      {/* Active Crop Lifecycle Tracker Preview */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10px] font-bold text-emerald-700 uppercase">Crop Monitoring</span>
            <h3 className="text-base font-extrabold text-slate-900">
              Active Crop: {profile.cropName} ({profile.acreage} Acres)
            </h3>
          </div>
          <Link
            href="/crop-guidance"
            className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
          >
            <span>Crop Guidance</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
          <div>
            <div className="font-bold text-slate-900 text-sm">
              Current Stage: Stage {profile.currentCropStage} (Manure & Fertilizers / Weeding)
            </div>
            <div className="text-slate-600 mt-1">
              Irrigation: {profile.irrigationType} &bull; Sown: {profile.sownDate} &bull; Cycle: {profile.cropCycleDays} Days
            </div>
          </div>
          <div className="bg-white px-3 py-1.5 rounded-lg border border-emerald-200 text-emerald-800 font-bold">
            Next Action: Power Weeder Pass
          </div>
        </div>
      </div>
    </div>
  );
}

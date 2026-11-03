import React from 'react';
import Link from 'next/link';
import { ApiClient } from '@/lib/api-client';
import {
  ArrowLeft,
  Wrench,
  MapPin,
  Calendar,
  Clock,
  Tractor,
  PhoneCall,
  CheckCircle2,
  AlertCircle,
  Truck,
  UserCheck,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export default async function CustomerServicesPage() {
  let requests: any[] = [];
  try {
    const res = await ApiClient.getCustomerServices('usr-farmer-01');
    if (res.success && res.data) {
      requests = res.data;
    }
  } catch (e) {
    // Fallback
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'REQUESTED':
        return <span className="bg-amber-100 text-amber-900 font-extrabold px-3 py-1 rounded-full text-[11px] border border-amber-300">REQUESTED &bull; AWAITING DISPATCH</span>;
      case 'ASSIGNED':
        return <span className="bg-blue-100 text-blue-900 font-extrabold px-3 py-1 rounded-full text-[11px] border border-blue-300">OPERATOR ASSIGNED</span>;
      case 'IN_PROGRESS':
        return <span className="bg-purple-100 text-purple-900 font-extrabold px-3 py-1 rounded-full text-[11px] border border-purple-300">ON-FIELD IN PROGRESS</span>;
      case 'COMPLETED':
        return <span className="bg-emerald-100 text-emerald-900 font-extrabold px-3 py-1 rounded-full text-[11px] border border-emerald-300">WORK COMPLETED ✓</span>;
      case 'CANCELLED':
        return <span className="bg-slate-200 text-slate-700 font-extrabold px-3 py-1 rounded-full text-[11px]">CANCELLED</span>;
      default:
        return <span className="bg-slate-100 text-slate-800 font-bold px-2.5 py-1 rounded-full text-[11px]">{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-xs">
      <Link href="/account" className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Account
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Farm Service Bookings (GPS Dispatched)</h1>
          <p className="text-slate-500 mt-0.5">
            Real-time status of tractor ploughing, rotavator tilling, drone spraying, and soil testing requests.
          </p>
        </div>
        <Link
          href="/services/book"
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2.5 rounded-xl transition self-start sm:self-auto shadow-sm"
        >
          Book New Smart Service
        </Link>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <Tractor className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No Service Bookings Yet</h3>
          <p className="text-slate-500 max-w-sm mx-auto">
            Book professional tractor operators, drone spraying, harvesting, and soil testing directly to your farm parcel coordinates.
          </p>
          <Link
            href="/services/book"
            className="inline-block bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-2.5 rounded-xl transition"
          >
            Book Farm Service with GPS &rarr;
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((srv) => (
            <div
              key={srv.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 hover:border-slate-300 transition"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
                <div>
                  <span className="font-extrabold text-sm text-slate-900">{srv.serviceName}</span>
                  {srv.jobWorkName && (
                    <span className="text-emerald-800 font-semibold ml-2 text-xs bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {srv.jobWorkName}
                    </span>
                  )}
                  <span className="text-slate-400 ml-2 font-mono text-[11px]">#{srv.requestNumber}</span>
                </div>
                <div>{getStatusBadge(srv.status)}</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-slate-600">
                <div>
                  <div className="text-slate-500 font-medium">Farm GPS Location:</div>
                  <div className="text-slate-900 font-bold mt-0.5">{srv.address}</div>
                  <div className="text-[11px] font-mono text-emerald-800">
                    (Lat: {srv.gpsLatitude}, Lng: {srv.gpsLongitude})
                  </div>
                </div>

                <div>
                  <div className="text-slate-500 font-medium">Scheduled Time Slot:</div>
                  <div className="text-slate-900 font-semibold mt-0.5">
                    {srv.preferredDate}
                  </div>
                  <div className="text-[11px] text-slate-500">{srv.preferredTime}</div>
                </div>

                <div>
                  <div className="text-slate-500 font-medium">Farm Parcel / Crop:</div>
                  <div className="text-slate-900 font-bold mt-0.5">
                    {srv.farmAcreage} Acre(s) &bull; {srv.cropType || 'General'}
                  </div>
                </div>

                <div>
                  <div className="text-slate-500 font-medium">Estimated Cost:</div>
                  <div className="text-emerald-700 font-extrabold text-sm mt-0.5">
                    ₹{srv.estimatedCost?.toLocaleString('en-IN') || 'Quotation Pending'}
                  </div>
                  <div className="text-[10px] text-slate-400">Payable after field inspection</div>
                </div>
              </div>

              {/* Assigned Provider Card if assigned */}
              {srv.assignedProviderName ? (
                <div className="p-3.5 bg-blue-50/80 rounded-xl border border-blue-200 text-blue-950 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                  <div className="space-y-0.5">
                    <div className="font-extrabold text-xs flex items-center gap-1.5 text-blue-900">
                      <UserCheck className="w-4 h-4 text-blue-700" />
                      Assigned Service Fleet Provider: {srv.assignedProviderName}
                    </div>
                    <div className="text-[11px] text-blue-800">
                      Fleet Machine: <strong>{srv.assignedFleetUnit || 'Standard Tractor Unit'}</strong> &bull; Operator Phone: <strong className="font-mono">{srv.assignedOperatorMobile}</strong>
                    </div>
                  </div>
                  {srv.assignedOperatorMobile && (
                    <a
                      href={`tel:${srv.assignedOperatorMobile}`}
                      className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-3.5 py-1.5 rounded-lg text-[11px] self-start sm:self-auto flex items-center gap-1 shadow-xs transition"
                    >
                      <PhoneCall className="w-3.5 h-3.5" /> Call Driver
                    </a>
                  )}
                </div>
              ) : (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                    Request logged in Super Admin queue. Our operator coordinator will verify distance and assign the nearest fleet unit within 2 hours.
                  </span>
                </div>
              )}

              {srv.notes && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-600 text-[11px]">
                  <strong className="text-slate-800">Customer Field Notes:</strong> {srv.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

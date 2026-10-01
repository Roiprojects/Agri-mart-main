'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { SERVICES_CATALOGUE, getServiceById } from '@/lib/services-data';
import {
  MapPin,
  Calendar,
  Clock,
  Camera,
  CheckCircle2,
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
  Layers,
  Sparkles,
  Info,
  X,
  Tractor,
  Lock,
  User,
  LogOut,
  PhoneCall,
} from 'lucide-react';
import { useAuth, setClientAuthUser, clearClientAuthUser } from '@/lib/auth-client';

const REGIONAL_PRESETS = [
  { name: 'Mandya (Kothathi Hobli)', district: 'Mandya', taluk: 'Mandya', village: 'Kothathi', lat: 12.5218, lng: 76.8951, pincode: '571401' },
  { name: 'Dharwad (Hebballi)', district: 'Dharwad', taluk: 'Dharwad', village: 'Hebballi', lat: 15.4612, lng: 75.0125, pincode: '580004' },
  { name: 'Haveri / Byadgi', district: 'Haveri', taluk: 'Byadgi', village: 'Devihosur', lat: 14.8123, lng: 75.4120, pincode: '581110' },
  { name: 'Belagavi (Sankeshwar)', district: 'Belagavi', taluk: 'Hukkeri', village: 'Sankeshwar', lat: 16.2625, lng: 74.4820, pincode: '591313' },
  { name: 'Davanagere (Harihar)', district: 'Davanagere', taluk: 'Harihar', village: 'Yelehole', lat: 14.4644, lng: 75.9218, pincode: '577601' },
];

function BookServiceContent() {
  const { user, isLoggedIn } = useAuth();
  const searchParams = useSearchParams();
  const initialServiceId = searchParams.get('service') || searchParams.get('type') || 'srv-tractor';

  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');

  useEffect(() => {
    if (user) {
      if (!customerName && user.name) setCustomerName(user.name);
      if (!customerMobile && user.phone) setCustomerMobile(user.phone);
    }
  }, [user, customerName, customerMobile]);

  const [selectedServiceId, setSelectedServiceId] = useState(initialServiceId);
  const [selectedJobWorkId, setSelectedJobWorkId] = useState('');
  const [farmAcreage, setFarmAcreage] = useState<number>(2.0);
  const [cropType, setCropType] = useState('Paddy / Rice');

  const [preferredDate, setPreferredDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [preferredTime, setPreferredTime] = useState('08:00 AM - 12:00 PM');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('Dharwad');
  const [taluk, setTaluk] = useState('Dharwad');
  const [village, setVillage] = useState('');
  const [pincode, setPincode] = useState('');

  // GPS State (Dharwad Agro Regional Default)
  const [gpsLat, setGpsLat] = useState<number>(15.4589);
  const [gpsLng, setGpsLng] = useState<number>(75.0078);
  const [geoLocating, setGeoLocating] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<'IDLE' | 'DETECTED' | 'DENIED' | 'UNAVAILABLE'>('IDLE');
  const [gpsErrorMsg, setGpsErrorMsg] = useState('');

  const [notes, setNotes] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=400&q=80',
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const currentService = getServiceById(selectedServiceId) || SERVICES_CATALOGUE[0];

  // Set default job work when service changes
  useEffect(() => {
    if (currentService && currentService.jobWorkTypes.length > 0) {
      if (!currentService.jobWorkTypes.some((j) => j.id === selectedJobWorkId)) {
        setSelectedJobWorkId(currentService.jobWorkTypes[0].id);
      }
    }
  }, [currentService, selectedJobWorkId]);

  const currentJobWork = currentService.jobWorkTypes.find((j) => j.id === selectedJobWorkId);
  const estimatedCost = currentJobWork
    ? currentJobWork.rate * farmAcreage
    : currentService.baseRatePerAcre * farmAcreage;

  // GPS Location Detection with Explicit Location Denial Handling
  const captureGPS = () => {
    setGeoLocating(true);
    setGpsErrorMsg('');

    if (!('geolocation' in navigator)) {
      setGpsStatus('UNAVAILABLE');
      setGpsErrorMsg('Device or browser does not support Geolocation API. Manual selection activated.');
      setGeoLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLat(Math.round(pos.coords.latitude * 10000) / 10000);
        setGpsLng(Math.round(pos.coords.longitude * 10000) / 10000);
        setGpsStatus('DETECTED');
        setGeoLocating(false);
      },
      (error) => {
        setGeoLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setGpsStatus('DENIED');
          setGpsErrorMsg('Location access was denied in browser permissions. Switched to manual Karnataka taluk coordinates.');
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setGpsStatus('UNAVAILABLE');
          setGpsErrorMsg('GPS satellite signal unavailable. Please use regional presets below.');
        } else {
          setGpsStatus('UNAVAILABLE');
          setGpsErrorMsg('Location request timed out. Please select your region below.');
        }
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleApplyPreset = (preset: (typeof REGIONAL_PRESETS)[0]) => {
    setDistrict(preset.district);
    setTaluk(preset.taluk);
    setVillage(preset.village);
    setPincode(preset.pincode);
    setGpsLat(preset.lat);
    setGpsLng(preset.lng);
    setAddress(`${preset.village}, ${preset.taluk} Taluk, ${preset.district} Dist`);
    setGpsStatus('DETECTED');
    setGpsErrorMsg('');
  };

  const handleMockAddPhoto = () => {
    const samples = [
      'https://images.unsplash.com/photo-1592417817098-8f3d6eb2251a?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=400&q=80',
    ];
    if (uploadedPhotos.length < 3) {
      setUploadedPhotos([...uploadedPhotos, samples[uploadedPhotos.length % samples.length]]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmissionError(null);

    try {
      const response = await fetch('/api/services/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: currentService.id,
          jobWorkId: currentJobWork?.id,
          jobWorkName: currentJobWork?.name,
          customerName,
          customerMobile,
          farmAcreage,
          cropType,
          district,
          taluk,
          village,
          address,
          pincode,
          gpsLatitude: gpsLat,
          gpsLongitude: gpsLng,
          preferredDate,
          preferredTime,
          notes,
          photoUrl: uploadedPhotos[0] || '',
          advancePaid: 0,
        }),
      });

      const result = await response.json();
      setSubmitting(false);

      if (!response.ok || !result.success) {
        setSubmissionError(result.error || 'Failed to dispatch service request.');
        return;
      }

      setSubmissionResult(result.data);
    } catch (err: any) {
      setSubmitting(false);
      setSubmissionError(err.message || 'Network error submitting request.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-xs">
      <Link href="/services" className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to All Services
      </Link>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white rounded-3xl p-6 sm:p-8 space-y-2 shadow-xl">
        <div className="flex items-center gap-2">
          <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Pillar 3 &bull; Section 9 Smart Dispatch
          </span>
          <span className="text-emerald-300 font-medium text-[11px]">Direct Super Admin Forwarding</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold">GPS-Based Smart Service Request System</h1>
        <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
          Submit your farm parcel GPS location and implement needs. Requests are auto-routed to dispatch the nearest verified provider and operator within 2 hours.
        </p>
      </div>

      {submissionResult ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-5 shadow-sm animate-fadeIn">
          <CheckCircle2 className="w-14 h-14 text-emerald-700 mx-auto" />
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Service Request Dispatched Successfully!</h2>
            <p className="text-xs text-slate-600 mt-1">
              Request Reference: <strong className="font-mono text-slate-900 bg-slate-100 px-2 py-0.5 rounded border">{submissionResult.requestNumber}</strong>
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left max-w-lg mx-auto text-xs space-y-2 text-slate-700">
            <div className="flex justify-between">
              <span>Selected Service:</span>
              <strong className="text-slate-900">{submissionResult.serviceName}</strong>
            </div>
            {submissionResult.jobWorkName && (
              <div className="flex justify-between">
                <span>Operation:</span>
                <span className="font-semibold text-emerald-800">{submissionResult.jobWorkName}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Farm GPS Coordinates:</span>
              <span className="font-mono text-slate-900 font-bold">Lat: {submissionResult.gpsLatitude}, Lng: {submissionResult.gpsLongitude}</span>
            </div>
            <div className="flex justify-between">
              <span>Scheduled Slot:</span>
              <span className="text-slate-900">{submissionResult.preferredDate} ({submissionResult.preferredTime})</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-200 text-slate-900 font-bold">
              <span>Estimated Cost:</span>
              <span className="text-emerald-700 font-black">₹{submissionResult.estimatedCost?.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-[11px] max-w-lg mx-auto">
            Super Admin coordinator is assigning the nearest certified operator. You will receive an SMS and WhatsApp notification once the provider is dispatched.
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <Link
              href="/account/services"
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-3 rounded-xl transition shadow-md"
            >
              Track in Customer Dashboard &rarr;
            </Link>
            <button
              onClick={() => setSubmissionResult(null)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-5 py-3 rounded-xl transition"
            >
              Book Another Service
            </button>
          </div>
        </div>
      ) : !isLoggedIn ? (
        /* Not Logged In: Educational Showcase of Service Rental & Login Gate */
        <div className="space-y-6 animate-fadeIn">
          {/* Login Gate Action Card */}
          <div className="bg-gradient-to-br from-amber-500/10 via-emerald-500/5 to-slate-100 border-2 border-amber-400/40 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-extrabold text-[11px] border border-amber-300">
                  <Lock className="w-3.5 h-3.5 text-amber-700" />
                  <span>Farmer Login Required to Rent &amp; Schedule Machinery</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  Sign In to Book {currentService.name}
                </h2>
                <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
                  Please log in with your farmer mobile number or account to schedule verified operators, capture parcel GPS bund coordinates, and dispatch equipment to your field.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
                <Link
                  href={`/login?redirect=/services/book${selectedServiceId ? `?service=${selectedServiceId}` : ''}`}
                  className="inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow-md transition"
                >
                  <User className="w-4 h-4" />
                  <span>Sign In to Book Service</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setClientAuthUser({
                      id: 'demo-farmer-1',
                      name: 'Basavaraj Patil',
                      phone: '9845190812',
                      role: 'farmer',
                    });
                  }}
                  className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs px-5 py-3 rounded-xl shadow-md transition cursor-pointer"
                >
                  <Tractor className="w-4 h-4 text-slate-950" />
                  <span>1-Click Demo Sign-In</span>
                </button>
              </div>
            </div>
          </div>

          {/* Educational Showcase: What is Service Rental & Uses */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                Smart Farm Mechanization on Demand
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                What is Agri Mart Mega Equipment &amp; Service Rental?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Agri Mart Mega operates Karnataka&apos;s premier on-demand agricultural machinery fleet. Rather than investing ₹8 to ₹15 Lakhs in heavy machinery that sits idle for months, farmers can schedule certified operators with fuel, implements, and GPS tracking deployed directly to their parcel bund within 2 hours.
              </p>
            </div>

            {/* Key Uses & Operational Benefits */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Key Uses &amp; Operational Benefits for Farmers
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/70 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    1
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900">Zero Capital Expenditure</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Eliminate ₹5,00,000 to ₹15,00,000 in upfront machine purchases, EMIs, and maintenance. Pay strictly per acre or hour worked.
                  </p>
                </div>

                <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/70 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    2
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900">Operator + Fuel Included</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    No hunting for licensed drivers or diesel fuel disputes. Every booking includes a trained operator, machinery implements, and diesel.
                  </p>
                </div>

                <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/70 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    3
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900">Pinpoint GPS Dispatch</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Your field parcel coordinates ensure the operator arrives directly to your bund, even in remote rural locations with zero road names.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-800 flex items-center justify-center font-bold">
                    4
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900">3-Hour Backup Guarantee</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    In the rare event of mechanical snag or puncture, a backup machine is dispatched from our regional Dark Warehouse hub within 3 hours.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-800 flex items-center justify-center font-bold">
                    5
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900">Precision Agronomy Calibration</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Operators calibrate ploughing depth, drone nano-droplet misting, and seed drills according to certified scientific guidelines.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-800 flex items-center justify-center font-bold">
                    6
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900">Post-Work Inspection &amp; Billing</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Review and sign off on completion acreage before making final settlement. Pay securely via Kisan Wallet, UPI, or cash on field.
                  </p>
                </div>
              </div>
            </div>

            {/* Available Fleet Overview */}
            <div className="pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Available Mechanized Fleet &amp; Standard Pricing
                </h3>
                <span className="text-[11px] text-slate-500 font-medium">10 Services Online</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {SERVICES_CATALOGUE.map((s) => (
                  <div key={s.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <div className="font-extrabold text-slate-900 text-xs flex justify-between items-center">
                      <span>{s.name}</span>
                      <span className="text-emerald-700 font-black shrink-0 ml-2">₹{s.baseRatePerAcre}/ac</span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{s.shortDescription}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Logged In: Form with Logged-in Header */
        <div className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                <User className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-900">
                  Logged in as <span className="text-emerald-800">{user?.name || 'Farmer User'}</span> ({user?.phone})
                </div>
                <div className="text-[11px] text-emerald-700 font-medium">
                  Verified Farmer &bull; Ready to schedule equipment to field parcel
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => clearClientAuthUser()}
              className="text-slate-500 hover:text-rose-600 font-semibold text-xs flex items-center gap-1 self-start sm:self-auto cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            {submissionError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-900 rounded-xl flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0" />
                <span>{submissionError}</span>
              </div>
            )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Customer Details */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Customer Full Name *</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Basavaraj Patil"
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mobile Number (SMS Updates) *</label>
              <input
                type="tel"
                required
                value={customerMobile}
                onChange={(e) => setCustomerMobile(e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>

            {/* Service & Job-Work Selection */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Select Agricultural Service *</label>
              <select
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-1 focus:ring-emerald-600 focus:outline-hidden font-medium"
              >
                {SERVICES_CATALOGUE.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} (from ₹{s.baseRatePerAcre}/acre)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Job-Work Operation Sub-Type *</label>
              <select
                value={selectedJobWorkId}
                onChange={(e) => setSelectedJobWorkId(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-1 focus:ring-emerald-600 focus:outline-hidden font-medium"
              >
                {currentService.jobWorkTypes.map((jw) => (
                  <option key={jw.id} value={jw.id}>
                    {jw.name} &mdash; ₹{jw.rate}/{jw.rateUnit}
                  </option>
                ))}
              </select>
            </div>

            {/* Acreage & Crop */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Farm Parcel Acreage / Units *</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="50"
                required
                value={farmAcreage}
                onChange={(e) => setFarmAcreage(parseFloat(e.target.value) || 1)}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Crop *</label>
              <input
                type="text"
                required
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                placeholder="e.g. Sugarcane, Paddy, Chili, Cotton"
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>

            {/* GPS Capture Card with Location Denial Handling */}
            <div className="sm:col-span-2 p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 space-y-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <div className="font-extrabold text-emerald-950 flex items-center gap-1.5 text-xs sm:text-sm">
                    <MapPin className="w-4 h-4 text-emerald-700" />
                    GPS Farm Coordinates: <span className="font-mono text-emerald-800">Lat {gpsLat}, Lng {gpsLng}</span>
                  </div>
                  <div className="text-[11px] text-emerald-800 mt-0.5">
                    Ensures tractor driver or drone pilot navigates right up to your farm bund without calling for directions.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={captureGPS}
                  disabled={geoLocating}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-xl transition shadow-xs text-xs whitespace-nowrap"
                >
                  {geoLocating ? 'Detecting GPS...' : 'Detect Device GPS'}
                </button>
              </div>

              {/* Location Denial Banner */}
              {gpsStatus === 'DENIED' && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-300 text-amber-950 space-y-1 text-[11px] animate-fadeIn">
                  <div className="font-bold flex items-center gap-1.5 text-amber-900">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-700" /> Location Access Denied in Browser
                  </div>
                  <p className="text-amber-900 leading-relaxed">
                    {gpsErrorMsg} No problem! Select your nearest Karnataka rural taluk below to automatically populate precise coordinates.
                  </p>
                </div>
              )}

              {/* Regional Presets Fallback */}
              <div className="pt-2 border-t border-emerald-200/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 block mb-1.5">
                  Quick Regional Presets (Karnataka Agricultural Hubs):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {REGIONAL_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className="text-[11px] font-semibold bg-white hover:bg-emerald-100/70 text-slate-800 border border-emerald-200 px-2.5 py-1 rounded-lg transition"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Farm Address Details */}
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Full Farm Land Address (Survey No, Landmark, Village) *
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Survey No 124, Near North Canal, Kelageri"
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">District *</label>
              <input
                type="text"
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Taluk &amp; Village *</label>
              <input
                type="text"
                required
                value={`${taluk} / ${village}`}
                onChange={(e) => {
                  const parts = e.target.value.split('/');
                  setTaluk(parts[0]?.trim() || '');
                  setVillage(parts[1]?.trim() || '');
                }}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>

            {/* Schedule */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Preferred Execution Date *</label>
              <input
                type="date"
                required
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Preferred Time Slot *</label>
              <select
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-1 focus:ring-emerald-600 focus:outline-hidden font-medium"
              >
                <option value="06:00 AM - 09:00 AM">Early Morning (06:00 AM - 09:00 AM)</option>
                <option value="08:00 AM - 12:00 PM">Morning (08:00 AM - 12:00 PM)</option>
                <option value="02:00 PM - 06:00 PM">Afternoon (02:00 PM - 06:00 PM)</option>
                <option value="05:00 PM - 08:00 PM">Evening (05:00 PM - 08:00 PM)</option>
              </select>
            </div>

            {/* Customer Notes */}
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Field Notes &amp; Specific Implement Requirements
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Mention any ditches, power lines, soft wet spots, or specific blade adjustments required..."
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>

            {/* Optional Photos */}
            <div className="sm:col-span-2 space-y-2">
              <label className="block font-semibold text-slate-700">
                Field / Crop Condition Photos (Optional &bull; Up to 3 photos)
              </label>
              <div className="flex flex-wrap items-center gap-3">
                {uploadedPhotos.map((photo, idx) => (
                  <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo} alt="Field preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setUploadedPhotos(uploadedPhotos.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 bg-slate-900/80 text-white rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {uploadedPhotos.length < 3 && (
                  <button
                    type="button"
                    onClick={handleMockAddPhoto}
                    className="w-20 h-20 border-2 border-dashed border-slate-300 hover:border-emerald-600 rounded-xl flex flex-col items-center justify-center text-slate-500 hover:text-emerald-700 hover:bg-emerald-50/50 transition cursor-pointer"
                  >
                    <Camera className="w-5 h-5 mb-0.5" />
                    <span className="text-[10px] font-bold">+ Add Photo</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Pricing Calculation Summary Card */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <div className="font-extrabold text-sm text-slate-900">
                Estimated Service Total: <span className="text-emerald-800 text-base">₹{estimatedCost.toLocaleString('en-IN')}</span>
              </div>
              <div className="text-[11px] text-slate-500">
                Rate: ₹{currentJobWork?.rate || currentService.baseRatePerAcre}/{currentJobWork?.rateUnit || 'acre'} &times; {farmAcreage} unit(s). Diesel &amp; certified operator included.
              </div>
            </div>
            <div className="text-right text-[11px] text-emerald-800 font-semibold">
              ✓ Pay After Service or Advance
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold py-4 rounded-xl shadow-lg transition text-sm disabled:opacity-50"
          >
            {submitting ? 'Dispatching Request...' : `Submit GPS Service Request to Super Admin (Est: ₹${estimatedCost.toLocaleString('en-IN')})`}
          </button>
        </form>
      </div>
    )}
    </div>
  );
}

export default function BookServicePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading service request form...</div>}>
      <BookServiceContent />
    </Suspense>
  );
}

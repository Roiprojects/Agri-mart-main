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
  User,
  LogOut,
  PhoneCall,
  CreditCard,
  Smartphone,
  Building2,
  Banknote,
} from 'lucide-react';
import { useAuth, clearClientAuthUser } from '@/lib/auth-client';
import { validatePhoneNumber, validateEmailOptional, validatePinCode } from '@/lib/validation';

const INDIAN_BANKS = [
  'State Bank of India (SBI)',
  'Canara Bank',
  'Karnataka Bank',
  'Karnataka Vikas Grameena Bank (KVGB)',
  'HDFC Bank',
  'ICICI Bank',
  'Axis Bank',
  'Union Bank of India',
];

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
  const [customerEmail, setCustomerEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'NETBANKING' | 'COD'>('UPI');
  const [upiId, setUpiId] = useState('farmer@upi');
  const [selectedBank, setSelectedBank] = useState(INDIAN_BANKS[0]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    if (user) {
      if (!customerName && user.name) setCustomerName(user.name);
      if (!customerMobile && user.phone) setCustomerMobile(user.phone);
    }
  }, [user, customerName, customerMobile]);

  const [selectedServiceId, setSelectedServiceId] = useState(initialServiceId);
  const [selectedJobWorkId, setSelectedJobWorkId] = useState('');
  const [bookingBasis, setBookingBasis] = useState<'HOURLY' | 'ACRE'>('HOURLY');
  const [bookingHours, setBookingHours] = useState<number>(2);
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
  const acreRate = currentJobWork ? currentJobWork.rate : currentService.baseRatePerAcre;
  const hourlyRate = Math.max(200, Math.round(acreRate * 0.65));
  const estimatedCost =
    bookingBasis === 'HOURLY' ? hourlyRate * bookingHours : acreRate * farmAcreage;

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

  const handleOpenPaymentModal = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError(null);

    if (customerName.trim().length < 2) {
      setSubmissionError('Please enter your full name.');
      return;
    }

    const phoneValidation = validatePhoneNumber(customerMobile);
    if (!phoneValidation.valid) {
      setSubmissionError(phoneValidation.error || 'Please enter a valid 10-digit mobile number.');
      return;
    }

    const emailValidation = validateEmailOptional(customerEmail);
    if (!emailValidation.valid) {
      setSubmissionError(emailValidation.error || 'Please enter a valid email address.');
      return;
    }

    if (address.trim().length < 4) {
      setSubmissionError('Please enter your farm land address.');
      return;
    }

    const pinValidation = validatePinCode(pincode);
    if (!pinValidation.valid) {
      setSubmissionError(pinValidation.error || 'Please enter a valid 6-digit PIN code.');
      return;
    }

    setShowPaymentModal(true);
  };

  const handleConfirmServiceBooking = async () => {
    setSubmitting(true);
    setSubmissionError(null);

    const cleanMobile = customerMobile.replace(/[^0-9]/g, '').slice(0, 10);
    const cleanPin = pincode.replace(/[^0-9]/g, '').slice(0, 6);

    try {
      const response = await fetch('/api/services/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: currentService.id,
          jobWorkId: currentJobWork?.id,
          jobWorkName: currentJobWork?.name,
          customerName: customerName.trim(),
          customerMobile: cleanMobile,
          customerEmail: customerEmail.trim() || undefined,
          bookingBasis,
          bookingHours: bookingBasis === 'HOURLY' ? bookingHours : undefined,
          farmAcreage,
          cropType,
          district,
          taluk,
          village,
          address: address.trim(),
          pincode: cleanPin,
          gpsLatitude: gpsLat,
          gpsLongitude: gpsLng,
          preferredDate,
          preferredTime,
          notes,
          photoUrl: uploadedPhotos[0] || '',
          paymentMethod,
          advancePaid: paymentMethod === 'COD' ? 0 : estimatedCost,
        }),
      });

      const result = await response.json();
      setSubmitting(false);

      if (!response.ok || !result.success) {
        setShowPaymentModal(false);
        setSubmissionError(result.error || 'Failed to dispatch service request.');
        return;
      }

      setShowPaymentModal(false);
      setSubmissionResult(result.data);
    } catch (err: any) {
      setSubmitting(false);
      setShowPaymentModal(false);
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
              <span>Booking Basis:</span>
              <span className="font-bold text-emerald-800">
                {submissionResult.bookingBasis === 'HOURLY'
                  ? `Hourly Basis (${submissionResult.bookingHours || bookingHours} Hour(s))`
                  : `Per-Acre Basis (${submissionResult.farmAcreage} Acre(s))`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Scheduled Slot:</span>
              <span className="text-slate-900">{submissionResult.preferredDate} ({submissionResult.preferredTime})</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Mode:</span>
              <span className="font-bold text-emerald-800">
                {submissionResult.paymentMethod === 'NETBANKING'
                  ? 'NetBanking'
                  : submissionResult.paymentMethod === 'COD'
                  ? 'Cash on Delivery (COD)'
                  : 'UPI Pay'}
              </span>
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
      ) : (
        <div className="space-y-4">
          {isLoggedIn && user && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">
                    Logged in as <span className="text-emerald-800">{user.name || 'Farmer User'}</span> ({user.phone})
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
          )}

          <form onSubmit={handleOpenPaymentModal} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
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
                  placeholder="Enter your full name"
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mobile Number (10 Digits, Non-Repeating) *</label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={customerMobile}
                  onChange={(e) => setCustomerMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="10-digit mobile number"
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Email Address (Optional — validated if entered)</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="Optional: e.g. farmer@example.com"
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
                  {SERVICES_CATALOGUE.map((s) => {
                    const hr = Math.max(250, Math.round(s.baseRatePerAcre * 0.65));
                    return (
                      <option key={s.id} value={s.id}>
                        {s.name} (₹{hr}/hr • ₹{s.baseRatePerAcre}/acre)
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Job-Work Operation Sub-Type *</label>
                <select
                  value={selectedJobWorkId}
                  onChange={(e) => setSelectedJobWorkId(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-1 focus:ring-emerald-600 focus:outline-hidden font-medium"
                >
                  {currentService.jobWorkTypes.map((jw) => {
                    const jwHr = Math.max(200, Math.round(jw.rate * 0.65));
                    return (
                      <option key={jw.id} value={jw.id}>
                        {jw.name} &mdash; ₹{jwHr}/hour • ₹{jw.rate}/{jw.rateUnit}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Service Booking Basis Toggle (Hourly vs Per-Acre) */}
              <div className="sm:col-span-2 p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-emerald-950 text-xs flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-emerald-700" />
                    Select Service Rental Basis (Hourly or Per-Acre)
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-700 text-white px-2.5 py-0.5 rounded-full">
                    Hourly Booking Enabled
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setBookingBasis('HOURLY')}
                    className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${
                      bookingBasis === 'HOURLY'
                        ? 'border-emerald-700 bg-white text-emerald-950 font-extrabold ring-2 ring-emerald-500/20 shadow-xs'
                        : 'border-emerald-200/80 bg-white/60 text-slate-700 hover:bg-white'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-extrabold">Hourly Basis</div>
                      <div className="text-[10px] text-slate-500 font-normal">Book operator &amp; machine by hours</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-emerald-700">₹{hourlyRate}/hr</div>
                      <div className="text-[10px] text-emerald-800 font-semibold">Flexible Hours</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBookingBasis('ACRE')}
                    className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${
                      bookingBasis === 'ACRE'
                        ? 'border-emerald-700 bg-white text-emerald-950 font-extrabold ring-2 ring-emerald-500/20 shadow-xs'
                        : 'border-emerald-200/80 bg-white/60 text-slate-700 hover:bg-white'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-extrabold">Per-Acre / Unit Basis</div>
                      <div className="text-[10px] text-slate-500 font-normal">Standard parcel acreage rate</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-slate-900">₹{acreRate}/{currentJobWork?.rateUnit || 'acre'}</div>
                      <div className="text-[10px] text-slate-500 font-semibold">Area Based</div>
                    </div>
                  </button>
                </div>

                {bookingBasis === 'HOURLY' && (
                  <div className="pt-2 border-t border-emerald-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <label className="block font-bold text-emerald-950 text-xs">
                        Number of Service Hours Needed (1 &ndash; 24 Hours) *
                      </label>
                      <span className="text-[11px] text-emerald-800">
                        Total Hourly Charge: ₹{hourlyRate}/hour &times; {bookingHours} hour(s) = ₹{(hourlyRate * bookingHours).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        max={24}
                        required
                        value={bookingHours}
                        onChange={(e) => setBookingHours(Math.max(1, Math.min(24, Number(e.target.value) || 1)))}
                        className="w-28 p-2.5 bg-white border border-emerald-400 rounded-xl font-extrabold text-center text-sm text-emerald-950 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                      />
                      <span className="font-bold text-emerald-900 text-xs">Hours</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Acreage & Crop */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Farm Parcel Acreage / Units {bookingBasis === 'HOURLY' ? '(For Field Reference)' : '*'}
                </label>
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

              <div>
                <label className="block font-semibold text-slate-700 mb-1">PIN Code (6 Digits) *</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="6-digit PIN code (e.g. 580004)"
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

            {/* Payment Method Section (UPI Pay, NetBanking, Cash on Delivery) */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-700" />
                <span>Select Service Payment Method (UPI Pay &bull; NetBanking &bull; Cash on Delivery)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-4 rounded-2xl border text-center transition flex flex-col items-center justify-center space-y-1.5 ${
                    paymentMethod === 'UPI'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-extrabold ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-emerald-700" />
                  <span className="text-xs font-bold">UPI Pay</span>
                  <span className="text-[10px] text-slate-500 font-normal">GPay, PhonePe, Paytm, BHIM</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('NETBANKING')}
                  className={`p-4 rounded-2xl border text-center transition flex flex-col items-center justify-center space-y-1.5 ${
                    paymentMethod === 'NETBANKING'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-extrabold ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Building2 className="w-5 h-5 text-emerald-700" />
                  <span className="text-xs font-bold">NetBanking</span>
                  <span className="text-[10px] text-slate-500 font-normal">SBI, Canara, Karnataka Bank &amp; All Banks</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-4 rounded-2xl border text-center transition flex flex-col items-center justify-center space-y-1.5 ${
                    paymentMethod === 'COD'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-extrabold ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Banknote className="w-5 h-5 text-emerald-700" />
                  <span className="text-xs font-bold">Cash on Delivery</span>
                  <span className="text-[10px] text-slate-500 font-normal">Pay cash on field after service</span>
                </button>
              </div>

              {paymentMethod === 'UPI' && (
                <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-1.5">
                  <label className="block font-bold text-emerald-950 text-xs">UPI ID / VPA (or scan QR in next step)</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. farmer@upi"
                    className="w-full p-2.5 bg-white border border-emerald-300 rounded-xl text-xs outline-none"
                  />
                </div>
              )}

              {paymentMethod === 'NETBANKING' && (
                <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-2xl space-y-1.5">
                  <label className="block font-bold text-slate-900 text-xs">Select Your Bank for NetBanking</label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full p-2.5 bg-white border border-blue-300 rounded-xl text-xs font-semibold outline-none"
                  >
                    {INDIAN_BANKS.map((bank) => (
                      <option key={bank} value={bank}>{bank}</option>
                    ))}
                  </select>
                </div>
              )}

              {paymentMethod === 'COD' && (
                <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl text-[11px] text-amber-950">
                  <strong>Cash on Delivery (Pay on Field):</strong> Settle the service fee directly in cash to our certified operator upon completion of the field work.
                </div>
              )}
            </div>

            {/* Pricing Calculation Summary Card */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <div className="font-extrabold text-sm text-slate-900">
                  Estimated Service Total: <span className="text-emerald-800 text-base">₹{estimatedCost.toLocaleString('en-IN')}</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  {bookingBasis === 'HOURLY'
                    ? `Hourly Rate: ₹${hourlyRate}/hour × ${bookingHours} hour(s) (Parcel: ${farmAcreage} acre). Diesel & certified operator included.`
                    : `Rate: ₹${acreRate}/${currentJobWork?.rateUnit || 'acre'} × ${farmAcreage} unit(s). Diesel & certified operator included.`}
                </div>
              </div>
              <div className="text-right text-[11px] text-emerald-800 font-semibold">
                <div>Basis: {bookingBasis === 'HOURLY' ? `Hourly (${bookingHours} hrs)` : `Per-Acre (${farmAcreage} acres)`}</div>
                <div>Mode: {paymentMethod === 'UPI' ? 'UPI Pay' : paymentMethod === 'NETBANKING' ? 'NetBanking' : 'Cash on Delivery'}</div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold py-4 rounded-xl shadow-lg transition text-sm disabled:opacity-50"
            >
              {submitting
                ? 'Dispatching Request...'
                : `Proceed to Book Service (${paymentMethod === 'COD' ? 'Cash on Delivery' : paymentMethod === 'NETBANKING' ? 'NetBanking' : 'UPI Pay'} • ₹${estimatedCost.toLocaleString('en-IN')})`}
            </button>
          </form>
        </div>
      )}

      {/* Service Rental Payment Confirmation Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100 text-xs animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Confirm Service Booking &amp; Payment</h4>
                  <span className="text-[10px] text-emerald-800 font-semibold uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    UPI Pay &bull; NetBanking &bull; Cash on Delivery
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-slate-400 hover:text-slate-600 text-base font-bold"
              >
                &times;
              </button>
            </div>

            {/* Interactive Payment Mode Switcher inside Modal */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-700 block">Choose Payment Mode:</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                    paymentMethod === 'UPI'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-extrabold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-emerald-700" />
                  <span className="text-[11px]">UPI Pay</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('NETBANKING')}
                  className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                    paymentMethod === 'NETBANKING'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-extrabold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-emerald-700" />
                  <span className="text-[11px]">NetBanking</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                    paymentMethod === 'COD'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-extrabold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Banknote className="w-4 h-4 text-emerald-700" />
                  <span className="text-[11px]">Cash on Delivery</span>
                </button>
              </div>
            </div>

            {paymentMethod === 'UPI' && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1.5 text-[11px]">
                <div className="font-bold text-emerald-950">UPI Pay (GPay / PhonePe / Paytm / BHIM)</div>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="Enter UPI ID (e.g. farmer@upi)"
                  className="w-full p-2 bg-white border border-emerald-300 rounded-lg text-xs"
                />
              </div>
            )}

            {paymentMethod === 'NETBANKING' && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1.5 text-[11px]">
                <div className="font-bold text-slate-900">NetBanking Bank Selection</div>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full p-2 bg-white border border-blue-300 rounded-lg text-xs font-semibold"
                >
                  {INDIAN_BANKS.map((bank) => (
                    <option key={bank} value={bank}>{bank}</option>
                  ))}
                </select>
              </div>
            )}

            {paymentMethod === 'COD' && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                <strong>Cash on Delivery (COD):</strong> Pay ₹{estimatedCost.toLocaleString('en-IN')} in cash at the farm parcel after the operator completes the service.
              </div>
            )}

            <div className="p-3.5 bg-slate-50 rounded-xl space-y-2 text-slate-700">
              <div className="flex justify-between">
                <span>Service:</span>
                <span className="font-bold text-slate-900">{currentService.name}</span>
              </div>
              {currentJobWork && (
                <div className="flex justify-between">
                  <span>Operation:</span>
                  <span className="font-semibold text-slate-900">{currentJobWork.name}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Booking Basis &amp; Slot:</span>
                <span className="font-semibold text-slate-900">
                  {bookingBasis === 'HOURLY' ? `${bookingHours} Hour(s) @ ₹${hourlyRate}/hr` : `${farmAcreage} Acre(s) @ ₹${acreRate}/acre`} &bull; {preferredDate}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Payment Mode:</span>
                <span className="font-bold text-emerald-800">
                  {paymentMethod === 'UPI' ? `UPI Pay (${upiId || 'QR'})` : paymentMethod === 'NETBANKING' ? `NetBanking (${selectedBank})` : 'Cash on Delivery'}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-slate-900 text-sm">
                <span>Estimated Total:</span>
                <span className="text-emerald-800">₹{estimatedCost.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleConfirmServiceBooking}
                className="flex-1 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-md transition disabled:opacity-50"
              >
                {submitting
                  ? 'Dispatching...'
                  : paymentMethod === 'COD'
                  ? 'Confirm COD Service'
                  : `Pay via ${paymentMethod === 'UPI' ? 'UPI Pay' : 'NetBanking'}`}
              </button>
            </div>
          </div>
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

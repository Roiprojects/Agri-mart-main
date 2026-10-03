'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Calendar,
  IndianRupee,
  User,
  Truck,
  ShieldCheck,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { FormSection, FormField, inputClass, textareaClass, selectClass } from '@/components/admin/FormSection';

export default function RentalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Form states - Customer & Delivery
  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [pincode, setPincode] = useState('');

  // Equipment & Duration
  const [productTitle, setProductTitle] = useState('');
  const [rentalProductId, setRentalProductId] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalDays, setTotalDays] = useState<number>(1);
  const [pricingTier, setPricingTier] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY'>('DAILY');
  const [dailyRate, setDailyRate] = useState<number>(0);

  // Pricing & Payment
  const [rentAmount, setRentAmount] = useState<number>(0);
  const [securityDeposit, setSecurityDeposit] = useState<number>(0);
  const [totalPaid, setTotalPaid] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'PENDING' | 'PAID' | 'REFUNDED'>('PENDING');
  const [paymentId, setPaymentId] = useState('');

  // Status & Settlement
  const [status, setStatus] = useState<string>('PENDING_APPROVAL');
  const [actualReturnDate, setActualReturnDate] = useState('');
  const [lateDays, setLateDays] = useState<number>(0);
  const [lateFee, setLateFee] = useState<number>(0);
  const [damageFee, setDamageFee] = useState<number>(0);
  const [damageNotes, setDamageNotes] = useState('');
  const [depositRefundAmount, setDepositRefundAmount] = useState<number>(0);
  const [depositRefundStatus, setDepositRefundStatus] = useState<'PENDING' | 'PROCESSED' | 'FORFEITED'>('PENDING');

  const fetchRental = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/admin/rentals/${resolvedParams.id}`);
      const json = await res.json();
      if (json.success && json.data) {
        const data = json.data;
        setBooking(data);

        setCustomerName(data.customerName || '');
        setCustomerMobile(data.customerMobile || '');
        setDeliveryAddress(data.deliveryAddress || '');
        setPincode(data.pincode || '');

        setProductTitle(data.productTitle || '');
        setRentalProductId(data.rentalProductId || '');
        setWarehouseId(data.warehouseId || '');
        setStartDate(data.startDate ? data.startDate.split('T')[0] : '');
        setEndDate(data.endDate ? data.endDate.split('T')[0] : '');
        setTotalDays(data.totalDays ?? 1);
        setPricingTier(data.pricingTier || 'DAILY');
        setDailyRate(data.dailyRate ?? 0);

        setRentAmount(data.rentAmount ?? 0);
        setSecurityDeposit(data.securityDeposit ?? 0);
        setTotalPaid(data.totalPaid ?? 0);
        setPaymentMethod(data.paymentMethod || '');
        setPaymentStatus(data.paymentStatus || 'PENDING');
        setPaymentId(data.paymentId || '');

        setStatus(data.status || 'PENDING_APPROVAL');
        setActualReturnDate(data.actualReturnDate ? data.actualReturnDate.split('T')[0] : '');
        setLateDays(data.lateDays ?? 0);
        setLateFee(data.lateFee ?? 0);
        setDamageFee(data.damageFee ?? 0);
        setDamageNotes(data.damageNotes || '');
        setDepositRefundAmount(data.depositRefundAmount ?? 0);
        setDepositRefundStatus(data.depositRefundStatus || 'PENDING');
      } else {
        setError(json.error || 'Failed to load rental booking');
      }
    } catch (err: any) {
      setError(err.message || 'Error loading rental booking');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRental();
  }, [resolvedParams.id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setNotice(null);
      setError(null);

      const payload = {
        customerName,
        customerMobile,
        deliveryAddress,
        pincode,
        productTitle,
        rentalProductId,
        warehouseId,
        startDate,
        endDate,
        totalDays: Number(totalDays),
        pricingTier,
        dailyRate: Number(dailyRate),
        rentAmount: Number(rentAmount),
        securityDeposit: Number(securityDeposit),
        totalPaid: Number(totalPaid),
        paymentMethod,
        paymentStatus,
        paymentId,
        status,
        actualReturnDate: actualReturnDate || undefined,
        lateDays: Number(lateDays),
        lateFee: Number(lateFee),
        damageFee: Number(damageFee),
        damageNotes,
        depositRefundAmount: Number(depositRefundAmount),
        depositRefundStatus,
      };

      const res = await fetch(`/api/admin/rentals/${resolvedParams.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setNotice('Rental booking updated successfully!');
        setBooking(json.data);
        setTimeout(() => setNotice(null), 4000);
      } else {
        setError(json.error || 'Failed to update rental booking');
      }
    } catch (err: any) {
      setError(err.message || 'Error updating rental booking');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-24 text-slate-500">
        <RefreshCw className="h-6 w-6 animate-spin text-emerald-600 mr-3" />
        <span>Loading rental booking details...</span>
      </div>
    );
  }

  if (error && !booking) {
    return (
      <div className="rounded-xl bg-red-50 border border-red-200 p-6 text-center max-w-md mx-auto shadow-xs">
        <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
        <h2 className="text-lg font-bold text-red-900 mb-1">Failed to load rental</h2>
        <p className="text-sm text-red-600 mb-4">{error}</p>
        <Link
          href="/admin/rentals"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-semibold shadow-2xs"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Rentals
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-5xl pb-12">
      {/* Top Breadcrumb & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/rentals"
            className="p-2 rounded-lg bg-white border border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition shadow-2xs"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h1 className="text-2xl font-bold text-slate-900">Rental #{booking.bookingNumber}</h1>
              <StatusBadge status={status} />
              <StatusBadge status={paymentStatus} size="sm" />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Booked on {new Date(booking.createdAt).toLocaleString('en-IN')}
              {booking.updatedAt && ` · Updated ${new Date(booking.updatedAt).toLocaleString('en-IN')}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/rentals"
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition shadow-2xs"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition shadow-xs"
          >
            <Save className={`h-3.5 w-3.5 ${saving ? 'animate-spin' : ''}`} />
            {saving ? 'Saving Changes…' : 'Save Changes'}
          </button>
        </div>
      </div>

      {notice && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800 flex items-center gap-2 shadow-xs">
          <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{notice}</span>
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 flex items-center gap-2 shadow-xs">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: Customer Details */}
        <FormSection title="Customer Information" description="Renter contact and delivery address coordinates">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Customer Name" required>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className={inputClass}
              />
            </FormField>
            <FormField label="Mobile Number" required>
              <input
                type="tel"
                required
                value={customerMobile}
                onChange={(e) => setCustomerMobile(e.target.value)}
                className={inputClass}
              />
            </FormField>
          </div>

          <FormField label="Delivery Address" required>
            <textarea
              rows={2}
              required
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              className={textareaClass}
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Pincode" required>
              <input
                type="text"
                required
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className={inputClass}
              />
            </FormField>
            <FormField label="User ID (Account Ref)">
              <input
                type="text"
                value={booking.userId || ''}
                readOnly
                className={`${inputClass} bg-slate-50 text-slate-500 cursor-not-allowed`}
              />
            </FormField>
          </div>
        </FormSection>

        {/* Section 2: Equipment & Duration */}
        <FormSection title="Equipment & Duration" description="Machinery specifications and rental time window">
          <FormField label="Equipment / Product Title" required>
            <input
              type="text"
              required
              value={productTitle}
              onChange={(e) => setProductTitle(e.target.value)}
              className={inputClass}
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Rental Product ID">
              <input
                type="text"
                value={rentalProductId}
                onChange={(e) => setRentalProductId(e.target.value)}
                className={inputClass}
              />
            </FormField>
            <FormField label="Assigned Warehouse ID">
              <input
                type="text"
                value={warehouseId}
                onChange={(e) => setWarehouseId(e.target.value)}
                placeholder="e.g. wh-blr-north"
                className={inputClass}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <FormField label="Start Date" required>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={inputClass}
              />
            </FormField>
            <FormField label="End Date" required>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={inputClass}
              />
            </FormField>
            <FormField label="Total Days" required>
              <input
                type="number"
                min={1}
                required
                value={totalDays}
                onChange={(e) => setTotalDays(Number(e.target.value))}
                className={inputClass}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Pricing Tier">
              <select
                value={pricingTier}
                onChange={(e) => setPricingTier(e.target.value as any)}
                className={selectClass}
              >
                <option value="DAILY">DAILY</option>
                <option value="WEEKLY">WEEKLY</option>
                <option value="MONTHLY">MONTHLY</option>
              </select>
            </FormField>
            <FormField label="Daily Rate (₹)">
              <input
                type="number"
                min={0}
                value={dailyRate}
                onChange={(e) => setDailyRate(Number(e.target.value))}
                className={inputClass}
              />
            </FormField>
          </div>
        </FormSection>

        {/* Section 3: Billing & Payments */}
        <FormSection title="Financials & Payment" description="Rent total, security deposit, and payment confirmation">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <FormField label="Rent Amount (₹)" required>
              <input
                type="number"
                min={0}
                required
                value={rentAmount}
                onChange={(e) => setRentAmount(Number(e.target.value))}
                className={inputClass}
              />
            </FormField>
            <FormField label="Security Deposit (₹)" required>
              <input
                type="number"
                min={0}
                required
                value={securityDeposit}
                onChange={(e) => setSecurityDeposit(Number(e.target.value))}
                className={inputClass}
              />
            </FormField>
            <FormField label="Total Paid (₹)" required>
              <input
                type="number"
                min={0}
                required
                value={totalPaid}
                onChange={(e) => setTotalPaid(Number(e.target.value))}
                className={inputClass}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <FormField label="Payment Status">
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as any)}
                className={selectClass}
              >
                <option value="PENDING">PENDING</option>
                <option value="PAID">PAID</option>
                <option value="REFUNDED">REFUNDED</option>
              </select>
            </FormField>
            <FormField label="Payment Method">
              <input
                type="text"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                placeholder="UPI / NetBanking / COD"
                className={inputClass}
              />
            </FormField>
            <FormField label="Payment Transaction ID">
              <input
                type="text"
                value={paymentId}
                onChange={(e) => setPaymentId(e.target.value)}
                placeholder="txn_xxx..."
                className={inputClass}
              />
            </FormField>
          </div>
        </FormSection>

        {/* Section 4: Status & Return Settlement */}
        <FormSection title="Booking Status & Return Settlement" description="Current lifecycle state, return date, late fees and damages">
          <FormField label="Rental Lifecycle Status" required>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={selectClass}
            >
              <option value="PENDING_APPROVAL">PENDING_APPROVAL</option>
              <option value="APPROVED">APPROVED</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="RETURNED_ON_TIME">RETURNED_ON_TIME</option>
              <option value="RETURNED_LATE">RETURNED_LATE</option>
              <option value="RETURNED_DAMAGED">RETURNED_DAMAGED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <FormField label="Actual Return Date">
              <input
                type="date"
                value={actualReturnDate}
                onChange={(e) => setActualReturnDate(e.target.value)}
                className={inputClass}
              />
            </FormField>
            <FormField label="Late Days">
              <input
                type="number"
                min={0}
                value={lateDays}
                onChange={(e) => setLateDays(Number(e.target.value))}
                className={inputClass}
              />
            </FormField>
            <FormField label="Late Fee (₹)">
              <input
                type="number"
                min={0}
                value={lateFee}
                onChange={(e) => setLateFee(Number(e.target.value))}
                className={inputClass}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <FormField label="Damage Fee (₹)">
              <input
                type="number"
                min={0}
                value={damageFee}
                onChange={(e) => setDamageFee(Number(e.target.value))}
                className={inputClass}
              />
            </FormField>
            <FormField label="Deposit Refund Amount (₹)">
              <input
                type="number"
                min={0}
                value={depositRefundAmount}
                onChange={(e) => setDepositRefundAmount(Number(e.target.value))}
                className={inputClass}
              />
            </FormField>
            <FormField label="Deposit Refund Status">
              <select
                value={depositRefundStatus}
                onChange={(e) => setDepositRefundStatus(e.target.value as any)}
                className={selectClass}
              >
                <option value="PENDING">PENDING</option>
                <option value="PROCESSED">PROCESSED</option>
                <option value="FORFEITED">FORFEITED</option>
              </select>
            </FormField>
          </div>

          <FormField label="Damage / Condition Inspection Notes">
            <textarea
              rows={2}
              value={damageNotes}
              onChange={(e) => setDamageNotes(e.target.value)}
              placeholder="Notes on equipment return condition..."
              className={textareaClass}
            />
          </FormField>
        </FormSection>
      </div>

      {/* Bottom Action Footer */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
        <Link
          href="/admin/rentals"
          className="px-4 py-2 text-sm font-medium rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition shadow-2xs"
        >
          Back to Rentals
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2 text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition shadow-xs"
        >
          <Save className={`h-4 w-4 ${saving ? 'animate-spin' : ''}`} />
          {saving ? 'Saving Changes…' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}

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
  UserCheck,
  Wrench,
  MapPin,
  Calendar,
  IndianRupee,
} from 'lucide-react';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { FormSection, FormField, inputClass, textareaClass, selectClass } from '@/components/admin/FormSection';

export default function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [serviceReq, setServiceReq] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Form states - Customer & Location
  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [district, setDistrict] = useState('');
  const [taluk, setTaluk] = useState('');
  const [village, setVillage] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [gpsLatitude, setGpsLatitude] = useState<number>(0);
  const [gpsLongitude, setGpsLongitude] = useState<number>(0);

  // Service Details
  const [serviceName, setServiceName] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [jobWorkName, setJobWorkName] = useState('');
  const [jobWorkId, setJobWorkId] = useState('');
  const [farmAcreage, setFarmAcreage] = useState<number>(0);
  const [cropType, setCropType] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [notes, setNotes] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  // Status & Financials
  const [status, setStatus] = useState<string>('REQUESTED');
  const [estimatedCost, setEstimatedCost] = useState<number>(0);
  const [advancePaid, setAdvancePaid] = useState<number>(0);

  // Provider Assignment
  const [assignedProviderId, setAssignedProviderId] = useState('');
  const [assignedProviderName, setAssignedProviderName] = useState('');
  const [assignedOperatorMobile, setAssignedOperatorMobile] = useState('');
  const [assignedFleetUnit, setAssignedFleetUnit] = useState('');

  const fetchServiceReq = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/admin/services/${resolvedParams.id}`);
      const json = await res.json();
      if (json.success && json.data) {
        const data = json.data;
        setServiceReq(data);

        setCustomerName(data.customerName || '');
        setCustomerMobile(data.customerMobile || '');
        setDistrict(data.district || '');
        setTaluk(data.taluk || '');
        setVillage(data.village || '');
        setAddress(data.address || '');
        setPincode(data.pincode || '');
        setGpsLatitude(data.gpsLatitude ?? 0);
        setGpsLongitude(data.gpsLongitude ?? 0);

        setServiceName(data.serviceName || '');
        setServiceId(data.serviceId || '');
        setJobWorkName(data.jobWorkName || '');
        setJobWorkId(data.jobWorkId || '');
        setFarmAcreage(data.farmAcreage ?? 0);
        setCropType(data.cropType || '');
        setPreferredDate(data.preferredDate ? data.preferredDate.split('T')[0] : '');
        setPreferredTime(data.preferredTime || '');
        setNotes(data.notes || '');
        setPhotoUrl(data.photoUrl || '');

        setStatus(data.status || 'REQUESTED');
        setEstimatedCost(data.estimatedCost ?? 0);
        setAdvancePaid(data.advancePaid ?? 0);

        setAssignedProviderId(data.assignedProviderId || '');
        setAssignedProviderName(data.assignedProviderName || '');
        setAssignedOperatorMobile(data.assignedOperatorMobile || '');
        setAssignedFleetUnit(data.assignedFleetUnit || '');
      } else {
        setError(json.error || 'Failed to load service request');
      }
    } catch (err: any) {
      setError(err.message || 'Error loading service request');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceReq();
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
        district,
        taluk,
        village,
        address,
        pincode,
        gpsLatitude: Number(gpsLatitude),
        gpsLongitude: Number(gpsLongitude),
        serviceName,
        serviceId,
        jobWorkName,
        jobWorkId,
        farmAcreage: Number(farmAcreage),
        cropType,
        preferredDate,
        preferredTime,
        notes,
        photoUrl,
        status,
        estimatedCost: Number(estimatedCost),
        advancePaid: Number(advancePaid),
        assignedProviderId,
        assignedProviderName,
        assignedOperatorMobile,
        assignedFleetUnit,
      };

      const res = await fetch(`/api/admin/services/${resolvedParams.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setNotice('Service request updated successfully!');
        setServiceReq(json.data);
        setTimeout(() => setNotice(null), 4000);
      } else {
        setError(json.error || 'Failed to update service request');
      }
    } catch (err: any) {
      setError(err.message || 'Error updating service request');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-24 text-slate-500">
        <RefreshCw className="h-6 w-6 animate-spin text-emerald-600 mr-3" />
        <span>Loading service request details...</span>
      </div>
    );
  }

  if (error && !serviceReq) {
    return (
      <div className="rounded-xl bg-red-50 border border-red-200 p-6 text-center max-w-md mx-auto shadow-xs">
        <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
        <h2 className="text-lg font-bold text-red-900 mb-1">Failed to load service request</h2>
        <p className="text-sm text-red-600 mb-4">{error}</p>
        <Link
          href="/admin/services"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-semibold shadow-2xs"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Services
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-5xl pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/services"
            className="p-2 rounded-lg bg-white border border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition shadow-2xs"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h1 className="text-2xl font-bold text-slate-900">Request #{serviceReq.requestNumber}</h1>
              <StatusBadge status={status} />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Requested on {new Date(serviceReq.createdAt).toLocaleString('en-IN')}
              {serviceReq.updatedAt && ` · Updated ${new Date(serviceReq.updatedAt).toLocaleString('en-IN')}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/services"
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
        {/* Section 1: Customer & Farm Location */}
        <FormSection title="Customer & Farm Location" description="Farmer contact and geocoded field destination">
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <FormField label="District" required>
              <input
                type="text"
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className={inputClass}
              />
            </FormField>
            <FormField label="Taluk">
              <input
                type="text"
                value={taluk}
                onChange={(e) => setTaluk(e.target.value)}
                className={inputClass}
              />
            </FormField>
            <FormField label="Village">
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className={inputClass}
              />
            </FormField>
          </div>

          <FormField label="Full Address / Farm Directions" required>
            <textarea
              rows={2}
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={textareaClass}
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <FormField label="Pincode" required>
              <input
                type="text"
                required
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className={inputClass}
              />
            </FormField>
            <FormField label="GPS Latitude">
              <input
                type="number"
                step="any"
                value={gpsLatitude}
                onChange={(e) => setGpsLatitude(Number(e.target.value))}
                className={inputClass}
              />
            </FormField>
            <FormField label="GPS Longitude">
              <input
                type="number"
                step="any"
                value={gpsLongitude}
                onChange={(e) => setGpsLongitude(Number(e.target.value))}
                className={inputClass}
              />
            </FormField>
          </div>
        </FormSection>

        {/* Section 2: Service Specifications & Schedule */}
        <FormSection title="Service Specifications & Schedule" description="Service scope, acreage, crop and schedule timing">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Service Name" required>
              <input
                type="text"
                required
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                className={inputClass}
              />
            </FormField>
            <FormField label="Job Work / Sub-Service">
              <input
                type="text"
                value={jobWorkName}
                onChange={(e) => setJobWorkName(e.target.value)}
                className={inputClass}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Farm Acreage (Acres)" required>
              <input
                type="number"
                step="0.1"
                min={0}
                required
                value={farmAcreage}
                onChange={(e) => setFarmAcreage(Number(e.target.value))}
                className={inputClass}
              />
            </FormField>
            <FormField label="Crop Type">
              <input
                type="text"
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                placeholder="e.g. Paddy, Cotton, Sugarcane"
                className={inputClass}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Preferred Date" required>
              <input
                type="date"
                required
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className={inputClass}
              />
            </FormField>
            <FormField label="Preferred Time Slot">
              <input
                type="text"
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                placeholder="e.g. 07:00 AM - 11:00 AM"
                className={inputClass}
              />
            </FormField>
          </div>

          <FormField label="Farmer Instructions / Field Notes">
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any obstacles, irrigation ditches, water supply availability..."
              className={textareaClass}
            />
          </FormField>
        </FormSection>

        {/* Section 3: Status & Financials */}
        <FormSection title="Status & Charges" description="Workflow progression and service payment totals">
          <FormField label="Lifecycle Status" required>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={selectClass}
            >
              <option value="REQUESTED">REQUESTED</option>
              <option value="ASSIGNED">ASSIGNED</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Estimated Cost (₹)">
              <input
                type="number"
                min={0}
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(Number(e.target.value))}
                className={inputClass}
              />
            </FormField>
            <FormField label="Advance Paid (₹)">
              <input
                type="number"
                min={0}
                value={advancePaid}
                onChange={(e) => setAdvancePaid(Number(e.target.value))}
                className={inputClass}
              />
            </FormField>
          </div>

          <FormField label="User ID (Account)">
            <input
              type="text"
              value={serviceReq.userId || ''}
              readOnly
              className={`${inputClass} bg-slate-50 text-slate-500 cursor-not-allowed`}
            />
          </FormField>
        </FormSection>

        {/* Section 4: Provider & Machinery Assignment */}
        <FormSection title="Provider Assignment & Dispatch" description="Assigned contractor, operator mobile and machinery unit">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Provider Name">
              <input
                type="text"
                value={assignedProviderName}
                onChange={(e) => setAssignedProviderName(e.target.value)}
                placeholder="e.g. Krishna Agri Services"
                className={inputClass}
              />
            </FormField>
            <FormField label="Operator Mobile">
              <input
                type="tel"
                value={assignedOperatorMobile}
                onChange={(e) => setAssignedOperatorMobile(e.target.value)}
                placeholder="+91 9876543210"
                className={inputClass}
              />
            </FormField>
          </div>

          <FormField label="Fleet Machinery Unit">
            <input
              type="text"
              value={assignedFleetUnit}
              onChange={(e) => setAssignedFleetUnit(e.target.value)}
              placeholder="e.g. Combine Harvester KA-01 AB 1234 or Drone Unit #3"
              className={inputClass}
            />
          </FormField>

          <FormField label="Provider ID">
            <input
              type="text"
              value={assignedProviderId}
              onChange={(e) => setAssignedProviderId(e.target.value)}
              placeholder="e.g. sp-001"
              className={inputClass}
            />
          </FormField>
        </FormSection>
      </div>

      {/* Bottom Action Footer */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
        <Link
          href="/admin/services"
          className="px-4 py-2 text-sm font-medium rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition shadow-2xs"
        >
          Back to Services
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2 text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition shadow-xs"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Saving Changes…' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}

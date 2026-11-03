'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  UserPlus,
  Edit3,
  Trash2,
  Search,
  CheckCircle2,
  AlertTriangle,
  X,
  RefreshCw,
  ShieldCheck,
  Building2,
  Phone,
  Mail,
  Eye,
  EyeOff,
  ExternalLink,
  Lock,
  UserCheck,
  KeyRound,
  Sparkles,
  Send,
} from 'lucide-react';

interface StaffMember {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  password?: string;
  emailVerified?: boolean;
  mobile: string;
  role: string;
  department: string;
  assignedPortal: 'admin' | 'warehouse' | 'procurement' | 'sales' | 'repairs' | 'finance' | 'storefront';
  branchHub: string;
  salaryINR: number;
  joiningDate: string;
  status: 'ACTIVE' | 'ON_LEAVE' | 'INACTIVE';
  permissions: string[];
  address: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

const ROLE_OPTIONS: string[] = [
  'Super Admin',
  'Catalogue & Storefront Manager',
  'Chief Logistics Officer',
  'Warehouse Manager',
  'Dispatch & Stock Supervisor',
  'Inventory & Barcode Executive',
  'Lead Agronomist',
  'Field Agronomy Officer',
  'Procurement Executive',
  'Quality Control (QC) Inspector',
  'State Field Sales Head',
  'Field Sales Executive',
  'Chief Workshop Engineer',
  'Workshop Service Technician',
  'Spare Parts & Warranty Coordinator',
  'Finance Controller',
  'Accounts & Payout Executive',
  'Customer Support Executive',
  'Operations Executive',
];

const DEPARTMENT_OPTIONS: string[] = [
  'Super Admin & Catalogue',
  'Warehouse & Logistics',
  'Procurement & Agronomy',
  'Field Sales CRM',
  'Workshop & Repairs',
  'Finance & Dealer Commissions',
  'Customer Support & Storefront',
  'Quality Assurance & Lab',
  'Operations',
];

const PERMISSION_JOBS: { code: string; label: string; description: string }[] = [
  { code: 'VIEW', label: 'VIEW', description: 'View Dashboard & Staff / Portal Records' },
  { code: 'CREATE', label: 'CREATE', description: 'Add / Create New Records & Entries' },
  { code: 'EDIT', label: 'EDIT', description: 'Edit / Modify Existing Details & Status' },
  { code: 'DELETE', label: 'DELETE', description: 'Delete / Remove Records' },
  { code: 'DISPATCH', label: 'DISPATCH', description: 'Approve & Dispatch Warehouse Shipments' },
  { code: 'STOCK_AUDIT', label: 'STOCK_AUDIT', description: 'Perform Inventory & Stock Audits' },
  { code: 'AGRONOMY_ADVISORY', label: 'AGRONOMY_ADVISORY', description: 'Manage Farmer Crop Advisory Cycles' },
  { code: 'LEAD_ASSIGNMENT', label: 'LEAD_ASSIGNMENT', description: 'Assign & Convert Field Sales Leads' },
  { code: 'QC_APPROVAL', label: 'QC_APPROVAL', description: 'Approve Workshop Repair QC & Job Cards' },
  { code: 'VOUCHER_APPROVAL', label: 'VOUCHER_APPROVAL', description: 'Approve Finance & Commission Vouchers' },
  { code: 'FULL_ADMIN', label: 'FULL_ADMIN', description: 'Full Super Admin Override (All Jobs)' },
];

const PORTAL_LABELS: Record<string, { label: string; href: string; badgeClass: string }> = {
  admin: {
    label: 'Super Admin Panel',
    href: '/admin',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  warehouse: {
    label: 'Dark Warehouse & Stock',
    href: '/warehouse',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  procurement: {
    label: 'Procurement & Agronomy',
    href: '/procurement',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  sales: {
    label: 'Field Sales CRM',
    href: '/sales',
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  repairs: {
    label: 'Workshop & Repairs',
    href: '/repairs',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
  },
  finance: {
    label: 'Finance & Commissions',
    href: '/finance',
    badgeClass: 'bg-teal-100 text-teal-800 border-teal-200',
  },
  storefront: {
    label: 'Customer Storefront',
    href: '/',
    badgeClass: 'bg-slate-100 text-slate-800 border-slate-200',
  },
};

function formatINR(n: number): string {
  return `₹${Number(n || 0).toLocaleString('en-IN')}`;
}

const EMPTY_FORM = {
  employeeId: '',
  name: '',
  email: '',
  password: '',
  mobile: '',
  role: '',
  department: '',
  assignedPortal: 'admin' as StaffMember['assignedPortal'],
  branchHub: '',
  salaryINR: '' as string | number,
  joiningDate: '',
  status: 'ACTIVE' as StaffMember['status'],
  permissions: [] as string[],
  address: '',
  notes: '',
};

export default function AdminStaffManagementPage() {
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [advancedMode, setAdvancedMode] = useState(true);

  // Active Staff Session for strict job permission enforcement
  const [activeOperatorId, setActiveOperatorId] = useState<string>('SUPER_ADMIN');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [filterPortal, setFilterPortal] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Selection (unchecked by default)
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // View / Create / Edit / Delete Modals
  const [viewingStaff, setViewingStaff] = useState<StaffMember | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [deleteConfirmIds, setDeleteConfirmIds] = useState<string[] | null>(null);

  // Form State (Starts completely empty — no hardcoded text)
  const [formData, setFormData] = useState({ ...EMPTY_FORM });

  // Login Credentials & Phone OTP Verification State
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpCodeInput, setOtpCodeInput] = useState('');
  const [dispatchedOtpPreview, setDispatchedOtpPreview] = useState<string | null>(null);
  const [gmailComposeUrl, setGmailComposeUrl] = useState<string | null>(null);
  const [otpVerified, setOtpVerified] = useState(false);
  const [passwordModified, setPasswordModified] = useState(false);

  // Change Password Popup Modal State (for Edit Staff Member)
  const [changePwdModalOpen, setChangePwdModalOpen] = useState(false);
  const [changePwdOtpSent, setChangePwdOtpSent] = useState(false);
  const [changePwdOtpLoading, setChangePwdOtpLoading] = useState(false);
  const [changePwdDispatchedOtp, setChangePwdDispatchedOtp] = useState<string | null>(null);
  const [changePwdOtpInput, setChangePwdOtpInput] = useState('');
  const [changePwdOtpVerified, setChangePwdOtpVerified] = useState(false);
  const [changePwdNewPassword, setChangePwdNewPassword] = useState('');
  const [changePwdShowNew, setChangePwdShowNew] = useState(false);
  const [changePwdSaving, setChangePwdSaving] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/staff');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setStaffList(json.data);
      } else {
        showToast(json.error || 'Failed to load staff', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error loading staff', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
    if (typeof window !== 'undefined') {
      const savedOp = window.localStorage.getItem('agrimart_active_staff_id');
      if (savedOp) setActiveOperatorId(savedOp);
    }
  }, []);

  const handleSelectOperator = (id: string) => {
    setActiveOperatorId(id);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('agrimart_active_staff_id', id);
      window.dispatchEvent(new Event('agrimart-operator-changed'));
    }
    if (id === 'SUPER_ADMIN') {
      showToast('Switched to Super Admin (All job permissions enabled)');
    } else {
      const found = staffList.find((s) => s.id === id);
      if (found) {
        const jobs = (found.permissions || []).length > 0 ? found.permissions.join(', ') : 'NONE';
        showToast(`Active Staff: ${found.name} — Allowed Jobs: [${jobs}]`);
      }
    }
  };

  const activeOperator =
    activeOperatorId === 'SUPER_ADMIN'
      ? null
      : staffList.find((s) => s.id === activeOperatorId) || null;

  // Check if current active person has permission to perform a specific job
  const canPerformJob = (jobCode: string): boolean => {
    if (!activeOperator) return true; // Super Admin master mode
    const perms = Array.isArray(activeOperator.permissions) ? activeOperator.permissions : [];
    if (perms.includes('FULL_ADMIN')) return true;
    return perms.includes(jobCode);
  };

  const requireJobPermission = (jobCode: string, actionLabel: string): boolean => {
    if (canPerformJob(jobCode)) return true;
    const allowed =
      activeOperator && activeOperator.permissions.length > 0
        ? activeOperator.permissions.join(', ')
        : 'None (No checkboxes selected)';
    showToast(
      `Permission Denied: ${activeOperator?.name} is NOT allowed to perform "${actionLabel}" (${jobCode} checkbox is not selected). Allowed jobs: [${allowed}]`,
      'error'
    );
    return false;
  };

  const handleSearchClick = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAppliedSearch(searchQuery.trim());
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setAppliedSearch('');
    setFilterRole('All');
    setFilterDepartment('All');
    setFilterPortal('All');
    setFilterStatus('All');
  };

  // Filtered staff list — searches by Staff Name and Staff ID (employeeId & id), plus Role/Dept/Portal/Status filters
  const activeQuery = (searchQuery || appliedSearch).trim().toLowerCase();
  const filteredStaff = staffList.filter((s) => {
    const matchesSearch =
      !activeQuery ||
      (s.name || '').toLowerCase().includes(activeQuery) ||
      (s.employeeId || '').toLowerCase().includes(activeQuery) ||
      (s.id || '').toLowerCase().includes(activeQuery) ||
      (s.email || '').toLowerCase().includes(activeQuery) ||
      (s.mobile || '').toLowerCase().includes(activeQuery) ||
      (s.role || '').toLowerCase().includes(activeQuery) ||
      (s.department || '').toLowerCase().includes(activeQuery);

    const matchesRole = filterRole === 'All' || s.role === filterRole;
    const matchesDept = filterDepartment === 'All' || s.department === filterDepartment;
    const matchesPortal = filterPortal === 'All' || s.assignedPortal === filterPortal;
    const matchesStatus = filterStatus === 'All' || s.status === filterStatus;

    return matchesSearch && matchesRole && matchesDept && matchesPortal && matchesStatus;
  });

  const resetOtpState = () => {
    setShowPassword(false);
    setOtpSent(false);
    setOtpLoading(false);
    setOtpCodeInput('');
    setDispatchedOtpPreview(null);
    setGmailComposeUrl(null);
    setOtpVerified(false);
    setPasswordModified(false);
    setChangePwdModalOpen(false);
    setChangePwdOtpSent(false);
    setChangePwdOtpLoading(false);
    setChangePwdDispatchedOtp(null);
    setChangePwdOtpInput('');
    setChangePwdOtpVerified(false);
    setChangePwdNewPassword('');
    setChangePwdShowNew(false);
    setChangePwdSaving(false);
  };

  // Open Create Modal — All fields empty (no hardcoded values)
  const handleOpenCreate = () => {
    if (!requireJobPermission('CREATE', 'Add New Staff')) return;
    setEditingStaff(null);
    resetOtpState();
    setFormData({
      ...EMPTY_FORM,
      assignedPortal: 'admin',
      status: 'ACTIVE',
      permissions: [],
    });
    setModalOpen(true);
  };

  // Open Edit Modal — Pre-filled with the details of that particular staff member
  const handleOpenEdit = (member: StaffMember) => {
    if (!requireJobPermission('EDIT', 'Edit Staff')) return;
    setEditingStaff(member);
    resetOtpState();
    if (member.password) {
      setOtpVerified(true);
    }
    setFormData({
      employeeId: member.employeeId || '',
      name: member.name || '',
      email: member.email || '',
      password: member.password || '',
      mobile: member.mobile || '',
      role: member.role || '',
      department: member.department || '',
      assignedPortal: member.assignedPortal || 'admin',
      branchHub: member.branchHub || '',
      salaryINR: member.salaryINR !== undefined && member.salaryINR !== null ? member.salaryINR : '',
      joiningDate: member.joiningDate || '',
      status: member.status || 'ACTIVE',
      permissions: Array.isArray(member.permissions) ? [...member.permissions] : [],
      address: member.address || '',
      notes: member.notes || '',
    });
    setModalOpen(true);
  };

  // Send OTP to the given Phone Number
  const handleSendPhoneOtp = async (passwordType: 'MANUAL' | 'AUTO_GENERATED' = 'MANUAL') => {
    const phone = formData.mobile.trim();
    const digits = phone.replace(/\D/g, '');
    if (!phone || digits.length < 10) {
      showToast('Please enter a valid 10-digit Phone Number first to receive the OTP.', 'error');
      return false;
    }

    try {
      setOtpLoading(true);
      const res = await fetch('/api/admin/staff/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SEND',
          phone,
          staffName: formData.name.trim() || 'New Staff',
          passwordType,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setOtpSent(true);
        setOtpVerified(false);
        setOtpCodeInput('');
        setDispatchedOtpPreview(json.otp || null);
        showToast(`6-digit OTP sent to phone number: ${phone}`);
        return true;
      } else {
        showToast(json.error || 'Failed to send OTP to phone number', 'error');
        return false;
      }
    } catch (err: any) {
      showToast(err.message || 'Error sending OTP', 'error');
      return false;
    } finally {
      setOtpLoading(false);
    }
  };

  // Auto-Generate Password (ONLY available in Add New Staff modal) -> generates password & sends OTP linked to Phone Number
  const handleAutoGeneratePassword = async () => {
    const phone = formData.mobile.trim();
    const digits = phone.replace(/\D/g, '');
    if (!phone || digits.length < 10) {
      showToast('Please enter a valid 10-digit Phone Number first so the OTP can be sent to that phone number!', 'error');
      return;
    }

    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
    const symbols = '@#$!';
    let randomPart = '';
    for (let i = 0; i < 6; i++) {
      randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const sym = symbols.charAt(Math.floor(Math.random() * symbols.length));
    const generatedPassword = `Agri${sym}${randomPart}9`;

    setFormData((prev) => ({ ...prev, password: generatedPassword }));
    setShowPassword(true);
    setPasswordModified(true);
    setOtpVerified(false);

    // Immediately trigger OTP linked to the given Phone Number
    await handleSendPhoneOtp('AUTO_GENERATED');
  };

  // Verify the 6-digit OTP sent to the given Phone Number
  const handleVerifyPhoneOtp = async () => {
    const phone = formData.mobile.trim();
    if (!phone) {
      showToast('Phone Number is required', 'error');
      return;
    }
    if (!otpCodeInput.trim()) {
      showToast('Please enter the 6-digit OTP sent to the phone number', 'error');
      return;
    }

    try {
      setOtpLoading(true);
      const res = await fetch('/api/admin/staff/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'VERIFY',
          phone,
          otp: otpCodeInput.trim(),
        }),
      });
      const json = await res.json();
      if (json.success && json.verified) {
        setOtpVerified(true);
        showToast(json.message || `OTP verified for phone number ${phone}!`);
      } else {
        showToast(json.error || 'Invalid OTP', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'OTP verification failed', 'error');
    } finally {
      setOtpLoading(false);
    }
  };

  // Send OTP specifically for the Change Password Popup Modal in Edit Staff Member
  const handleSendChangePasswordOtp = async (targetPhone?: string) => {
    const phone = (targetPhone || formData.mobile || editingStaff?.mobile || '').trim();
    const digits = phone.replace(/\D/g, '');
    if (!phone || digits.length < 10) {
      showToast('Please enter a valid 10-digit Phone Number for this staff member first.', 'error');
      return false;
    }

    try {
      setChangePwdOtpLoading(true);
      const res = await fetch('/api/admin/staff/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SEND',
          phone,
          staffName: formData.name.trim() || editingStaff?.name || 'Staff Member',
          passwordType: 'CHANGE_PASSWORD',
        }),
      });
      const json = await res.json();
      if (json.success) {
        setChangePwdOtpSent(true);
        setChangePwdOtpVerified(false);
        setChangePwdOtpInput('');
        setChangePwdDispatchedOtp(json.otp || null);
        showToast(`OTP sent to ${formData.name || editingStaff?.name}'s phone number (${phone})`);
        return true;
      } else {
        showToast(json.error || 'Failed to send OTP', 'error');
        return false;
      }
    } catch (err: any) {
      showToast(err.message || 'Error sending OTP', 'error');
      return false;
    } finally {
      setChangePwdOtpLoading(false);
    }
  };

  // Open the "Change Password" Popup Modal in Edit Staff Member
  const handleOpenChangePasswordModal = async () => {
    if (!editingStaff) return;
    const phone = (formData.mobile || editingStaff.mobile || '').trim();
    const digits = phone.replace(/\D/g, '');
    if (!phone || digits.length < 10) {
      showToast('Please ensure the staff member has a valid 10-digit Phone Number first.', 'error');
      return;
    }

    setChangePwdModalOpen(true);
    setChangePwdOtpSent(false);
    setChangePwdDispatchedOtp(null);
    setChangePwdOtpInput('');
    setChangePwdOtpVerified(false);
    setChangePwdNewPassword('');
    setChangePwdShowNew(true);

    // Automatically generate & dispatch the OTP for that staff member's phone number when popup opens
    await handleSendChangePasswordOtp(phone);
  };

  // Verify the OTP inside the Change Password Popup Modal
  const handleVerifyChangePasswordOtp = async () => {
    const phone = (formData.mobile || editingStaff?.mobile || '').trim();
    if (!changePwdOtpInput.trim()) {
      showToast('Please enter the 6-digit OTP shown for this phone number', 'error');
      return;
    }

    try {
      setChangePwdOtpLoading(true);
      const res = await fetch('/api/admin/staff/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'VERIFY',
          phone,
          otp: changePwdOtpInput.trim(),
        }),
      });
      const json = await res.json();
      if (json.success && json.verified) {
        setChangePwdOtpVerified(true);
        showToast(`Phone number ${phone} verified! You can now enter the new permanent password.`);
      } else {
        showToast(json.error || 'Incorrect OTP entered. Please check the OTP and try again.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'OTP verification failed', 'error');
    } finally {
      setChangePwdOtpLoading(false);
    }
  };

  // Save the New Permanent Password & Delete the Old Password
  const handleConfirmChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;

    const phone = (formData.mobile || editingStaff.mobile || '').trim();
    const enteredOtp = changePwdOtpInput.trim();
    const newPassword = changePwdNewPassword.trim();

    if (!enteredOtp) {
      showToast('Please enter the 6-digit OTP to verify the phone number.', 'error');
      return;
    }

    if (!changePwdOtpVerified && enteredOtp !== changePwdDispatchedOtp) {
      showToast('Please verify the correct OTP first before updating the password.', 'error');
      return;
    }

    if (!newPassword) {
      showToast('Please enter the new password.', 'error');
      return;
    }

    try {
      setChangePwdSaving(true);
      const res = await fetch('/api/admin/staff/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CHANGE_PASSWORD',
          staffId: editingStaff.id,
          phone,
          otp: enteredOtp,
          newPassword,
        }),
      });
      const json = await res.json();
      if (json.success) {
        // Update form and editingStaff with the new permanent password; old password is deleted
        setFormData((prev) => ({
          ...prev,
          mobile: phone,
          password: newPassword,
        }));
        setEditingStaff((prev) =>
          prev
            ? {
                ...prev,
                mobile: phone,
                password: newPassword,
                emailVerified: true,
              }
            : null
        );
        setOtpVerified(true);
        setPasswordModified(false);
        setChangePwdModalOpen(false);
        fetchStaff();
        showToast(
          json.message ||
            `Permanent password updated for ${formData.name || editingStaff.name}! Old password has been deleted.`
        );
      } else {
        showToast(json.error || 'Failed to update password', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error updating password', 'error');
    } finally {
      setChangePwdSaving(false);
    }
  };

  // Toggle individual permission checkbox
  const handleTogglePermissionCheckbox = (code: string) => {
    setFormData((prev) => {
      const exists = prev.permissions.includes(code);
      const updated = exists
        ? prev.permissions.filter((p) => p !== code)
        : [...prev.permissions, code];
      return {
        ...prev,
        permissions: updated,
      };
    });
  };

  // Save (Create or Update)
  const handleSaveStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = !!editingStaff;

    if (!formData.name.trim()) {
      showToast('Full Name is required', 'error');
      return;
    }

    if (!isEdit && !formData.mobile.trim()) {
      showToast('Login Phone Number is required for new staff', 'error');
      return;
    }

    if (!isEdit && !formData.password.trim()) {
      showToast('Login Password is required for new staff (enter password or click Auto-Generate Password)', 'error');
      return;
    }

    // Whenever creating a new password (in Add New Staff or when modifying password in Edit), require Phone OTP verification
    const requiresOtpCheck = (!isEdit && !!formData.password.trim()) || (isEdit && passwordModified);
    if (requiresOtpCheck && !otpVerified) {
      if (!otpSent) {
        await handleSendPhoneOtp('MANUAL');
        showToast(
          `An OTP has been sent to phone number ${formData.mobile.trim()}. Please verify the OTP before saving the new password.`,
          'error'
        );
      } else {
        showToast(
          `Please verify the 6-digit OTP sent to phone number ${formData.mobile.trim()} to confirm the password.`,
          'error'
        );
      }
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...(isEdit ? { id: editingStaff.id } : {}),
        employeeId: formData.employeeId.trim(),
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        emailVerified: otpVerified || Boolean(editingStaff?.emailVerified),
        mobile: formData.mobile.trim(),
        role: formData.role.trim(),
        department: formData.department.trim(),
        assignedPortal: formData.assignedPortal,
        branchHub: formData.branchHub.trim(),
        salaryINR: formData.salaryINR !== '' ? Number(formData.salaryINR) : 0,
        joiningDate: formData.joiningDate.trim(),
        status: formData.status,
        permissions: formData.permissions,
        address: formData.address.trim(),
        notes: formData.notes.trim(),
      };

      const res = await fetch('/api/admin/staff', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        showToast(json.message || (isEdit ? 'Staff updated!' : 'Staff created!'));
        setModalOpen(false);
        fetchStaff();
        if (viewingStaff && isEdit && viewingStaff.id === editingStaff.id) {
          setViewingStaff(json.data);
        }
      } else {
        showToast(json.error || 'Failed to save staff member', 'error');
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // Quick Status Toggle
  const handleQuickStatusChange = async (member: StaffMember, newStatus: StaffMember['status']) => {
    if (!requireJobPermission('EDIT', 'Change Employment Status')) return;
    try {
      const res = await fetch('/api/admin/staff', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: member.id,
          status: newStatus,
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast(`${member.name} status updated to ${newStatus}`);
        fetchStaff();
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // Execute Delete
  const handleConfirmDelete = async () => {
    if (!deleteConfirmIds || deleteConfirmIds.length === 0) return;
    if (!requireJobPermission('DELETE', 'Delete Staff')) {
      setDeleteConfirmIds(null);
      return;
    }
    try {
      setSaving(true);
      const res = await fetch('/api/admin/staff', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: deleteConfirmIds }),
      });
      const json = await res.json();
      if (json.success) {
        showToast(json.message || 'Deleted staff member(s)!');
        setSelectedIds((prev) => prev.filter((id) => !deleteConfirmIds.includes(id)));
        if (viewingStaff && deleteConfirmIds.includes(viewingStaff.id)) {
          setViewingStaff(null);
        }
        setDeleteConfirmIds(null);
        fetchStaff();
      } else {
        showToast(json.error || 'Failed to delete', 'error');
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // Selection Helpers
  const handleSelectAll = () => {
    if (filteredStaff.length === 0) return;
    if (selectedIds.length === filteredStaff.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredStaff.map((s) => s.id));
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Execute a specific job for a staff member (only allowed if that job checkbox is checked for them)
  const handleExecuteMemberJob = (member: StaffMember, jobCode: string) => {
    const perms = Array.isArray(member.permissions) ? member.permissions : [];
    const allowed = perms.includes(jobCode) || perms.includes('FULL_ADMIN');
    if (!allowed) {
      showToast(
        `Blocked: "${member.name}" is NOT allowed to perform [${jobCode}] because that checkbox is not selected.`,
        'error'
      );
      return;
    }
    showToast(`Job Executed: "${member.name}" performed allowed job [${jobCode}] successfully!`);
  };

  const totalPayroll = staffList
    .filter((s) => s.status === 'ACTIVE')
    .reduce((sum, s) => sum + (Number(s.salaryINR) || 0), 0);

  return (
    <div className="space-y-6 pb-16 text-slate-800">
      {/* Toast Notification */}
      {toast && (
        <div
          style={{ zIndex: 10000 }}
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-white text-xs font-semibold flex items-center gap-2 max-w-md ${
            toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0" />
          )}
          <span>{toast.text}</span>
        </div>
      )}

      {/* TOP HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-600" />
            <span>Staff Management</span>
          </h1>

          {/* Advanced / Basic Toggle Switch */}
          <button
            type="button"
            onClick={() => setAdvancedMode((prev) => !prev)}
            className={`inline-flex items-center rounded border text-xs font-semibold transition cursor-pointer overflow-hidden shadow-2xs ${
              advancedMode
                ? 'bg-[#2585be] border-[#2070a0] text-white'
                : 'bg-white border-[#3c8dbc] text-[#3c8dbc]'
            }`}
            title={
              advancedMode
                ? 'Switch to Basic mode (show mandatory fields only)'
                : 'Switch to Advanced mode (show all fields)'
            }
          >
            {advancedMode ? (
              <>
                <span className="px-2.5 py-1">Advanced</span>
                <span className="w-5 h-6 bg-white/95 block rounded-r-xs m-0.5" />
              </>
            ) : (
              <>
                <span className="w-5 h-6 bg-[#3c8dbc] block rounded-l-xs m-0.5" />
                <span className="px-2.5 py-1">Basic</span>
              </>
            )}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleOpenCreate}
            className={`text-white text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer ${
              canPerformJob('CREATE')
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-slate-400 hover:bg-slate-500'
            }`}
          >
            {!canPerformJob('CREATE') ? (
              <Lock className="w-3.5 h-3.5" />
            ) : (
              <UserPlus className="w-4 h-4" />
            )}
            <span>Add New Staff</span>
          </button>

          <button
            type="button"
            disabled={selectedIds.length === 0}
            onClick={() => {
              if (!requireJobPermission('DELETE', 'Delete Selected Staff')) return;
              setDeleteConfirmIds(selectedIds);
            }}
            className="bg-[#dd4b39] hover:bg-[#c23321] disabled:opacity-50 text-white text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            {!canPerformJob('DELETE') ? (
              <Lock className="w-3.5 h-3.5" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
            <span>Delete (selected {selectedIds.length > 0 ? `(${selectedIds.length})` : ''})</span>
          </button>

          <button
            type="button"
            onClick={fetchStaff}
            className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* SEARCH & FILTER BAR (Search by Staff Name & Staff ID + Filters + Search Button) */}
      <form
        onSubmit={handleSearchClick}
        className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3"
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search staff by Staff Name or Staff ID (e.g. EMP-2026-001, stf-001)..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-emerald-600 outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
            </button>

            <button
              type="button"
              onClick={handleClearFilters}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center gap-1 transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Filter</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Filter by Role / Designation
            </label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:border-emerald-600 outline-none"
            >
              <option value="All">All Roles / Designations</option>
              {ROLE_OPTIONS.map((roleOpt) => (
                <option key={roleOpt} value={roleOpt}>
                  {roleOpt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Filter by Department
            </label>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:border-emerald-600 outline-none"
            >
              <option value="All">All Departments</option>
              {DEPARTMENT_OPTIONS.map((deptOpt) => (
                <option key={deptOpt} value={deptOpt}>
                  {deptOpt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Filter by Portal / Panel
            </label>
            <select
              value={filterPortal}
              onChange={(e) => setFilterPortal(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:border-emerald-600 outline-none"
            >
              <option value="All">All Portals / Panels</option>
              <option value="admin">Super Admin Panel</option>
              <option value="warehouse">Dark Warehouse & Stock</option>
              <option value="procurement">Procurement & Agronomy</option>
              <option value="sales">Field Sales CRM</option>
              <option value="repairs">Workshop & Repairs</option>
              <option value="finance">Finance & Commissions</option>
              <option value="storefront">Customer Storefront</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Filter by Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:border-emerald-600 outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="ON_LEAVE">ON_LEAVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>
        </div>
      </form>

      {/* KPI SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-400">Total Staff Members</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{staffList.length}</div>
          <div className="text-xs text-slate-500 mt-0.5">Across all 6 connected portals</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-400">Active On-Duty Staff</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">
            {staffList.filter((s) => s.status === 'ACTIVE').length}
          </div>
          <div className="text-xs text-emerald-700 font-medium mt-0.5">Full portal access enabled</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-400">On Leave / Inactive</span>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {staffList.filter((s) => s.status !== 'ACTIVE').length}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Temporarily away or suspended</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-400">Monthly Active Payroll (INR)</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{formatINR(totalPayroll)}</div>
          <div className="text-xs text-slate-500 mt-0.5">Disbursed in Indian Rupees (₹)</div>
        </div>
      </div>

      {/* SELECTED STAFF DETAIL DRAWER (IF VIEWING) */}
      {viewingStaff && (
        <div className="bg-white rounded-xl border-2 border-emerald-500 p-5 shadow-md space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                {viewingStaff.employeeId && (
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-900 text-white">
                    {viewingStaff.employeeId}
                  </span>
                )}
                <h2 className="text-lg font-bold text-slate-900">{viewingStaff.name}</h2>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    viewingStaff.status === 'ACTIVE'
                      ? 'bg-emerald-100 text-emerald-800'
                      : viewingStaff.status === 'ON_LEAVE'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {viewingStaff.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {viewingStaff.role || 'No Role Assigned'} · {viewingStaff.department || 'No Department'} ·{' '}
                {viewingStaff.branchHub || 'No Branch'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSelectOperator(viewingStaff.id)}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Act as {viewingStaff.name}</span>
              </button>
              <button
                type="button"
                onClick={() => handleOpenEdit(viewingStaff)}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Staff</span>
              </button>
              <button
                type="button"
                onClick={() => setViewingStaff(null)}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <div className="text-slate-400 font-semibold uppercase text-[10px]">Contact Details</div>
              <div className="font-semibold text-slate-800 mt-1">{viewingStaff.mobile || '—'}</div>
              <div className="text-slate-600">{viewingStaff.email || '—'}</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <div className="text-slate-400 font-semibold uppercase text-[10px]">Assigned Portal</div>
              <div className="font-semibold text-slate-800 mt-1">
                {PORTAL_LABELS[viewingStaff.assignedPortal]?.label || viewingStaff.assignedPortal}
              </div>
              <Link
                href={PORTAL_LABELS[viewingStaff.assignedPortal]?.href || '/admin'}
                className="text-emerald-700 hover:underline inline-flex items-center gap-1 mt-0.5 font-semibold"
              >
                <span>Open Assigned Portal</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <div className="text-slate-400 font-semibold uppercase text-[10px]">Compensation & Joining</div>
              <div className="font-bold text-emerald-700 text-sm mt-1">
                {formatINR(viewingStaff.salaryINR)} / month
              </div>
              <div className="text-slate-600">Joined: {viewingStaff.joiningDate || '—'}</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <div className="text-slate-400 font-semibold uppercase text-[10px]">
                Checked Job Permissions (Click to Test)
              </div>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {PERMISSION_JOBS.map((job) => {
                  const isAllowed =
                    (viewingStaff.permissions || []).includes(job.code) ||
                    (viewingStaff.permissions || []).includes('FULL_ADMIN');
                  return (
                    <button
                      key={job.code}
                      type="button"
                      onClick={() => handleExecuteMemberJob(viewingStaff, job.code)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border transition cursor-pointer ${
                        isAllowed
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
                          : 'bg-slate-100 text-slate-400 border-slate-200 line-through'
                      }`}
                      title={
                        isAllowed
                          ? `Allowed: Click to perform ${job.code}`
                          : `Blocked: ${job.code} checkbox not selected for ${viewingStaff.name}`
                      }
                    >
                      {isAllowed ? `✓ ${job.code}` : `✗ ${job.code}`}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          {viewingStaff.notes && (
            <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <strong>Admin Notes:</strong> {viewingStaff.notes}
            </div>
          )}
        </div>
      )}

      {/* STAFF DIRECTORY TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {!canPerformJob('VIEW') ? (
          <div className="p-10 text-center space-y-3">
            <Lock className="w-8 h-8 text-red-500 mx-auto" />
            <div className="text-sm font-bold text-slate-900">
              View Permission Restricted for {activeOperator?.name}
            </div>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              The <strong>VIEW</strong> checkbox is not selected for{' '}
              <strong>{activeOperator?.name}</strong>. Only staff members with the VIEW checkbox selected
              can view directory records.
            </p>
            <button
              type="button"
              onClick={() => handleSelectOperator('SUPER_ADMIN')}
              className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold cursor-pointer"
            >
              Switch Back to Super Admin
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-semibold">
                  <th className="px-3.5 py-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={filteredStaff.length > 0 && selectedIds.length === filteredStaff.length}
                      onChange={handleSelectAll}
                      className="w-3.5 h-3.5 rounded text-emerald-600 cursor-pointer"
                    />
                  </th>
                  <th className="px-4 py-3">Employee ID & Name</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Role, Dept & Portal</th>
                  <th className="px-4 py-3">Allowed Jobs (Checkboxes)</th>
                  {advancedMode && <th className="px-4 py-3">Branch / Hub</th>}
                  {advancedMode && <th className="px-4 py-3">Salary (INR)</th>}
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">CRUD Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-10 text-center text-slate-500">
                      Loading staff directory...
                    </td>
                  </tr>
                ) : filteredStaff.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-10 text-center text-slate-500">
                      No staff members found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredStaff.map((member) => {
                    const portalInfo = PORTAL_LABELS[member.assignedPortal] || PORTAL_LABELS.admin;
                    const isCurrentOperator = activeOperatorId === member.id;
                    return (
                      <tr
                        key={member.id}
                        className={`hover:bg-slate-50/80 transition ${
                          isCurrentOperator ? 'bg-emerald-50/50' : ''
                        }`}
                      >
                        <td className="px-3.5 py-3 text-center">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(member.id)}
                            onChange={() => handleSelectRow(member.id)}
                            className="w-3.5 h-3.5 rounded text-emerald-600 cursor-pointer"
                          />
                        </td>

                        <td className="px-4 py-3">
                          {member.employeeId && (
                            <div className="font-mono text-[11px] font-bold text-emerald-700">
                              {member.employeeId}
                            </div>
                          )}
                          <div className="font-bold text-slate-900 text-sm">{member.name}</div>
                          <div className="text-[11px] text-slate-500">{member.department || '—'}</div>
                        </td>

                        <td className="px-4 py-3 text-slate-700">
                          <div className="flex items-center gap-1 font-medium">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{member.mobile || '—'}</span>
                          </div>
                          <div className="flex items-center gap-1 text-slate-500 mt-0.5">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span>{member.email || '—'}</span>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-900">{member.role || '—'}</div>
                          <Link
                            href={portalInfo.href}
                            className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${portalInfo.badgeClass}`}
                          >
                            <span>{portalInfo.label}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </Link>
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1 max-w-[220px]">
                            {(member.permissions || []).length > 0 ? (
                              member.permissions.map((perm) => (
                                <span
                                  key={perm}
                                  className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-bold"
                                >
                                  ✓ {perm}
                                </span>
                              ))
                            ) : (
                              <span className="text-[11px] text-slate-400 italic">
                                No job selected
                              </span>
                            )}
                          </div>
                        </td>

                        {advancedMode && (
                          <td className="px-4 py-3 text-slate-600">
                            <div className="flex items-center gap-1">
                              <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{member.branchHub || '—'}</span>
                            </div>
                            {member.joiningDate && (
                              <div className="text-[11px] text-slate-400 mt-0.5">
                                Joined: {member.joiningDate}
                              </div>
                            )}
                          </td>
                        )}

                        {advancedMode && (
                          <td className="px-4 py-3 font-bold text-slate-900 font-mono">
                            {formatINR(member.salaryINR)}
                          </td>
                        )}

                        <td className="px-4 py-3">
                          <select
                            value={member.status}
                            onChange={(e) =>
                              handleQuickStatusChange(member, e.target.value as StaffMember['status'])
                            }
                            className={`px-2 py-1 rounded-full text-[10px] font-bold border outline-none cursor-pointer ${
                              member.status === 'ACTIVE'
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                : member.status === 'ON_LEAVE'
                                ? 'bg-amber-100 text-amber-800 border-amber-200'
                                : 'bg-red-100 text-red-800 border-red-200'
                            }`}
                          >
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="ON_LEAVE">ON_LEAVE</option>
                            <option value="INACTIVE">INACTIVE</option>
                          </select>
                        </td>

                        <td className="px-4 py-3 text-right whitespace-nowrap space-x-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              handleSelectOperator(isCurrentOperator ? 'SUPER_ADMIN' : member.id)
                            }
                            className={`px-2 py-1 rounded font-semibold inline-flex items-center gap-1 cursor-pointer ${
                              isCurrentOperator
                                ? 'bg-emerald-600 text-white'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
                            }`}
                            title="Enforce only this staff member's checked job permissions"
                          >
                            <UserCheck className="w-3 h-3" />
                            <span>{isCurrentOperator ? 'Active' : 'Use Role'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (!requireJobPermission('VIEW', 'View Staff Details')) return;
                              setViewingStaff(member);
                            }}
                            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold inline-flex items-center gap-1 cursor-pointer"
                            title="View full staff profile"
                          >
                            <Eye className="w-3 h-3" />
                            <span>View</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(member)}
                            className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold inline-flex items-center gap-1 cursor-pointer"
                            title="Edit staff member"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (!requireJobPermission('DELETE', 'Delete Staff Member')) return;
                              setDeleteConfirmIds([member.id]);
                            }}
                            className="px-2.5 py-1 rounded bg-red-50 hover:bg-red-100 text-red-700 font-semibold inline-flex items-center gap-1 cursor-pointer"
                            title="Delete staff member"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE / EDIT STAFF MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden max-h-[92vh] flex flex-col">
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-bold !text-white" style={{ color: '#ffffff' }}>
                  {editingStaff ? `Edit Staff Member: ${editingStaff.name}` : 'Add New Staff Member'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Advanced / Basic Toggle inside Modal */}
                <button
                  type="button"
                  onClick={() => setAdvancedMode((prev) => !prev)}
                  className={`inline-flex items-center rounded border text-[11px] font-semibold transition cursor-pointer overflow-hidden ${
                    advancedMode
                      ? 'bg-[#2585be] border-[#2070a0] text-white'
                      : 'bg-white border-[#3c8dbc] text-[#3c8dbc]'
                  }`}
                >
                  {advancedMode ? (
                    <>
                      <span className="px-2 py-0.5">Advanced</span>
                      <span className="w-3.5 h-4 bg-white block rounded-r-xs m-0.5" />
                    </>
                  ) : (
                    <>
                      <span className="w-3.5 h-4 bg-[#3c8dbc] block rounded-l-xs m-0.5" />
                      <span className="px-2 py-0.5">Basic</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveStaff} className="p-5 space-y-4 text-xs overflow-y-auto">
              {/* Mandatory / Core Fields (Always visible in Basic & Advanced) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required={!editingStaff}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter full name"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Employee ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required={!editingStaff}
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    placeholder="Enter employee ID"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono focus:border-emerald-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required={!editingStaff}
                    value={formData.mobile}
                    onChange={(e) => {
                      setFormData({ ...formData, mobile: e.target.value });
                      setOtpSent(false);
                      setOtpVerified(false);
                    }}
                    placeholder="Enter mobile number"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Role / Designation <span className="text-red-500">*</span>
                  </label>
                  <select
                    required={!editingStaff}
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:border-emerald-600 outline-none"
                  >
                    <option value="">-- Select Role / Designation --</option>
                    {ROLE_OPTIONS.map((roleOpt) => (
                      <option key={roleOpt} value={roleOpt}>
                        {roleOpt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Assigned Portal / Panel <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.assignedPortal}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        assignedPortal: e.target.value as StaffMember['assignedPortal'],
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:border-emerald-600 outline-none"
                  >
                    <option value="admin">Super Admin Panel</option>
                    <option value="warehouse">Dark Warehouse & Stock</option>
                    <option value="procurement">Procurement & Agronomy</option>
                    <option value="sales">Field Sales CRM</option>
                    <option value="repairs">Workshop & Repairs</option>
                    <option value="finance">Finance & Commissions</option>
                    <option value="storefront">Customer Storefront</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Employment Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as StaffMember['status'],
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:border-emerald-600 outline-none"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="ON_LEAVE">ON_LEAVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>

              {/* STAFF LOGIN CREDENTIALS (PHONE NUMBER & PASSWORD + OTP LINKED TO PHONE NUMBER) */}
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                    <KeyRound className="w-4 h-4 text-emerald-600" />
                    <span>Staff Login Credentials (Phone Number & Password)</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {otpVerified && formData.password && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-bold">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>OTP Verified for {formData.mobile}</span>
                      </span>
                    )}
                    {editingStaff && (
                      <button
                        type="button"
                        onClick={handleOpenChangePasswordModal}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition cursor-pointer shadow-xs"
                        title="Open popup to verify phone number with OTP and set a new permanent password"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>Change Password</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Login Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required={!editingStaff}
                      value={formData.mobile}
                      onChange={(e) => {
                        setFormData({ ...formData, mobile: e.target.value });
                        setOtpSent(false);
                        setOtpVerified(false);
                      }}
                      placeholder="e.g. +91 98450 11223"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:border-emerald-600 outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1 gap-1">
                      <label className="block font-semibold text-slate-700">
                        Login Password <span className="text-red-500">*</span>
                      </label>

                      {/* Auto-Generate Password Button ONLY for Add New Staff (!editingStaff) */}
                      {!editingStaff && (
                        <button
                          type="button"
                          onClick={handleAutoGeneratePassword}
                          disabled={otpLoading}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold transition cursor-pointer shadow-2xs"
                          title="Auto-generate strong password and send verification OTP to the given phone number"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Auto-Generate Password</span>
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <div className="relative flex-1">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required={!editingStaff}
                          readOnly={!!editingStaff}
                          value={formData.password}
                          onChange={(e) => {
                            if (editingStaff) return;
                            setFormData({ ...formData, password: e.target.value });
                            setPasswordModified(true);
                            setOtpVerified(false);
                          }}
                          placeholder={
                            editingStaff
                              ? 'Click "Change Password" to set a new password'
                              : 'Create password (requires Phone OTP)'
                          }
                          className={`w-full pl-3 pr-8 py-2 rounded-lg border border-slate-300 font-mono focus:border-emerald-600 outline-none ${
                            editingStaff ? 'bg-slate-100 text-slate-700 cursor-not-allowed' : 'bg-white'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                          title={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      {editingStaff ? (
                        <button
                          type="button"
                          onClick={handleOpenChangePasswordModal}
                          className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold inline-flex items-center gap-1.5 shrink-0 cursor-pointer shadow-2xs"
                        >
                          <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Change Password</span>
                        </button>
                      ) : (
                        formData.password.trim() &&
                        (!otpVerified || passwordModified) && (
                          <button
                            type="button"
                            onClick={() => handleSendPhoneOtp('MANUAL')}
                            disabled={otpLoading}
                            className="px-2.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-semibold inline-flex items-center gap-1 shrink-0 cursor-pointer"
                          >
                            <Send className="w-3 h-3" />
                            <span>{otpSent ? 'Resend OTP' : 'Send OTP'}</span>
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* OTP Verification Prompt whenever creating or auto-generating a password in Add New Staff */}
                {!editingStaff &&
                  (otpSent || (formData.password.trim() && !otpVerified)) && (
                    <div className="p-3 rounded-lg bg-white border border-emerald-300 space-y-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="text-[11px] text-slate-700">
                          <span className="font-bold text-slate-900">Phone OTP Verification Required:</span>{' '}
                          {otpSent ? (
                            <span>
                              A 6-digit OTP has been sent to phone number{' '}
                              <strong className="text-emerald-700">{formData.mobile}</strong>.
                            </span>
                          ) : (
                            <span>
                              Click <strong>Send OTP</strong> to receive a verification code on{' '}
                              <strong className="text-emerald-700">
                                {formData.mobile || 'the given phone number'}
                              </strong>
                              .
                            </span>
                          )}
                        </div>

                        {!otpSent && (
                          <button
                            type="button"
                            onClick={() => handleSendPhoneOtp('MANUAL')}
                            disabled={otpLoading}
                            className="px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Send className="w-3 h-3" />
                            <span>{otpLoading ? 'Sending OTP...' : 'Send OTP to Phone'}</span>
                          </button>
                        )}
                      </div>

                      {otpSent && dispatchedOtpPreview && (
                        <div className="p-2.5 rounded-lg bg-slate-900 text-white flex flex-wrap items-center justify-between gap-2 text-[11px]">
                          <div>
                            <span className="text-emerald-400 font-bold">[SMS OTP Dispatched to Phone]</span>{' '}
                            <span>
                              Phone: <strong>{formData.mobile}</strong> · OTP Code:{' '}
                            </span>
                            <span className="font-mono text-sm font-black px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400 text-emerald-300">
                              {dispatchedOtpPreview}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setOtpCodeInput(dispatchedOtpPreview)}
                              className="px-2 py-1 rounded bg-white/15 hover:bg-white/25 text-white text-[10px] font-semibold cursor-pointer"
                            >
                              Fill OTP
                            </button>
                          </div>
                        </div>
                      )}

                      {otpSent && (
                        <div className="flex flex-wrap items-center gap-2">
                          <input
                            type="text"
                            maxLength={6}
                            value={otpCodeInput}
                            onChange={(e) => setOtpCodeInput(e.target.value.replace(/\D/g, ''))}
                            placeholder="Enter 6-digit OTP from Phone"
                            className="w-48 px-3 py-1.5 rounded-lg border border-slate-300 font-mono text-xs tracking-widest focus:border-emerald-600 outline-none"
                          />
                          <button
                            type="button"
                            onClick={handleVerifyPhoneOtp}
                            disabled={otpLoading || otpVerified}
                            className={`px-3.5 py-1.5 rounded-lg text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer ${
                              otpVerified
                                ? 'bg-emerald-600'
                                : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{otpVerified ? 'OTP Verified ✓' : 'Verify OTP'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
              </div>

              {/* Advanced Fields */}
              {advancedMode && (
                <div className="space-y-3.5 pt-3 border-t border-slate-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Official Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Enter official email"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-600 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Department</label>
                      <select
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:border-emerald-600 outline-none"
                      >
                        <option value="">-- Select Department --</option>
                        {DEPARTMENT_OPTIONS.map((deptOpt) => (
                          <option key={deptOpt} value={deptOpt}>
                            {deptOpt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Branch / Hub Location</label>
                      <input
                        type="text"
                        value={formData.branchHub}
                        onChange={(e) => setFormData({ ...formData, branchHub: e.target.value })}
                        placeholder="Enter branch or hub location"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-600 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Monthly Salary (₹ INR)</label>
                      <input
                        type="number"
                        value={formData.salaryINR}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            salaryINR: e.target.value === '' ? '' : Number(e.target.value),
                          })
                        }
                        placeholder="Enter monthly salary in ₹"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-600 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Joining Date</label>
                      <input
                        type="date"
                        value={formData.joiningDate}
                        onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-600 outline-none"
                      />
                    </div>
                  </div>

                  {/* PERMISSIONS CHECKBOXES */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2.5">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <label className="block font-bold text-slate-800">
                        Permissions (Select Checkboxes to Allow Specific Jobs)
                      </label>
                      <span className="text-[11px] font-semibold text-emerald-700">
                        Selected Jobs: {formData.permissions.length}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Only the checked jobs below will be allowed for this staff member. Unchecked jobs will be restricted.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {PERMISSION_JOBS.map((job) => {
                        const checked = formData.permissions.includes(job.code);
                        return (
                          <label
                            key={job.code}
                            className={`flex items-start gap-2.5 p-2 rounded-lg border cursor-pointer transition ${
                              checked
                                ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => handleTogglePermissionCheckbox(job.code)}
                              className="mt-0.5 w-3.5 h-3.5 rounded text-emerald-600 cursor-pointer shrink-0"
                            />
                            <div className="leading-tight">
                              <div className="font-bold text-[11px]">{job.label}</div>
                              <div className="text-[10px] text-slate-500 mt-0.5">{job.description}</div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Residential Address</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Enter residential address"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Admin Notes / Remarks</label>
                    <textarea
                      rows={2}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Responsibilities, certifications, or remarks..."
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-600 outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold cursor-pointer shadow-xs"
                >
                  {saving ? 'Saving...' : editingStaff ? 'Update Staff Member' : 'Create Staff Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CHANGE PASSWORD POPUP MODAL (FOR EDIT STAFF MEMBER) */}
      {changePwdModalOpen && editingStaff && (
        <div
          style={{ zIndex: 9999 }}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-[2px] flex items-center justify-center p-4"
        >
          <div
            style={{ zIndex: 9999 }}
            className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden"
          >
            <div className="p-5 border-b border-slate-800 bg-slate-900 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
                  <KeyRound className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white" style={{ color: '#ffffff' }}>
                    Change Password
                  </h3>
                  <p className="text-[11px] text-emerald-300">
                    Verify Staff Phone Number via OTP to Set Permanent Password
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setChangePwdModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmChangePassword} className="p-5 space-y-4 text-xs">
              {/* Staff Person Name & Phone Number Info Card */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-semibold">Staff Member Name:</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {formData.name || editingStaff.name}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-0.5">
                  <span className="text-slate-500 font-semibold">Phone Number:</span>
                  <span className="font-mono font-bold text-emerald-700 text-sm flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" />
                    {formData.mobile || editingStaff.mobile}
                  </span>
                </div>
              </div>

              {/* OTP Displayed in the Popup Message to Verify That Phone Number */}
              <div className="p-3.5 rounded-xl bg-slate-900 text-white space-y-2 border border-slate-800">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                    OTP to Verify Phone Number
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSendChangePasswordOtp()}
                    disabled={changePwdOtpLoading}
                    className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white text-[10px] font-semibold cursor-pointer"
                  >
                    {changePwdOtpLoading ? 'Sending...' : 'Resend OTP'}
                  </button>
                </div>

                {changePwdDispatchedOtp ? (
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <div>
                      <div className="text-[11px] text-slate-300">
                        Verification OTP for{' '}
                        <strong className="text-white">{formData.mobile || editingStaff.mobile}</strong>:
                      </div>
                      <div className="mt-1 inline-block font-mono text-lg font-black tracking-widest px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400 text-emerald-300">
                        {changePwdDispatchedOtp}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setChangePwdOtpInput(changePwdDispatchedOtp);
                        setChangePwdOtpVerified(true);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold cursor-pointer shrink-0"
                    >
                      Copy / Fill OTP
                    </button>
                  </div>
                ) : (
                  <div className="text-slate-300 text-[11px]">
                    {changePwdOtpLoading
                      ? 'Generating 6-digit OTP for this phone number...'
                      : 'Click Resend OTP to generate verification code.'}
                  </div>
                )}
              </div>

              {/* Step 1: Enter that Same OTP to Verify Phone Number */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-800">
                  Enter OTP to Verify Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={changePwdOtpInput}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setChangePwdOtpInput(val);
                      if (changePwdDispatchedOtp && val === changePwdDispatchedOtp) {
                        setChangePwdOtpVerified(true);
                      } else {
                        setChangePwdOtpVerified(false);
                      }
                    }}
                    placeholder="Enter 6-digit OTP shown above"
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-300 font-mono text-sm tracking-widest focus:border-emerald-600 outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyChangePasswordOtp}
                    disabled={changePwdOtpLoading || !changePwdOtpInput.trim()}
                    className={`px-3.5 py-2 rounded-lg text-white font-bold inline-flex items-center gap-1.5 cursor-pointer shrink-0 ${
                      changePwdOtpVerified
                        ? 'bg-emerald-600'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{changePwdOtpVerified ? 'Verified ✓' : 'Verify OTP'}</span>
                  </button>
                </div>
                {changePwdOtpVerified && (
                  <p className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>OTP verified! You can now create the new permanent password below.</span>
                  </p>
                )}
              </div>

              {/* Step 2: Field to Enter the New Password */}
              <div className="space-y-1.5 pt-1 border-t border-slate-200">
                <label className="block font-bold text-slate-800">
                  Enter New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={changePwdShowNew ? 'text' : 'password'}
                    disabled={!changePwdOtpVerified}
                    value={changePwdNewPassword}
                    onChange={(e) => setChangePwdNewPassword(e.target.value)}
                    placeholder={
                      changePwdOtpVerified
                        ? 'Enter new permanent password'
                        : 'Enter & verify the correct OTP above to unlock'
                    }
                    className={`w-full pl-3 pr-9 py-2 rounded-lg border font-mono text-sm outline-none ${
                      changePwdOtpVerified
                        ? 'border-emerald-400 bg-white focus:border-emerald-600 text-slate-900'
                        : 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setChangePwdShowNew((prev) => !prev)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    {changePwdShowNew ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Once updated, the <strong>old password will be permanently deleted</strong> and can no longer be used to log in. This new password will become the permanent login password.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setChangePwdModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={changePwdSaving || !changePwdOtpVerified || !changePwdNewPassword.trim()}
                  className={`px-4 py-2 rounded-lg text-white font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-xs ${
                    changePwdOtpVerified && changePwdNewPassword.trim()
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-slate-300 cursor-not-allowed'
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>{changePwdSaving ? 'Updating...' : 'Update Permanent Password'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmIds && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-slate-900">Confirm Staff Deletion</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <strong>{deleteConfirmIds.length}</strong> selected staff member(s)? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmIds(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold cursor-pointer"
              >
                {saving ? 'Deleting...' : 'Yes, Delete Staff'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

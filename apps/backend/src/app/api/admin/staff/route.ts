import { NextRequest, NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

export interface StaffMember {
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

const DEFAULT_STAFF: StaffMember[] = [
  {
    id: 'stf-001',
    employeeId: 'EMP-2026-001',
    name: 'Ramesh Kulkarni',
    email: 'ramesh.kulkarni@agrimart.in',
    mobile: '+91 98450 11223',
    role: 'Chief Logistics Officer',
    department: 'Warehouse & Logistics',
    assignedPortal: 'warehouse',
    branchHub: 'Hubballi Central Dark Warehouse (DWH-HBX-01)',
    salaryINR: 68000,
    joiningDate: '2024-03-15',
    status: 'ACTIVE',
    permissions: ['VIEW', 'CREATE', 'EDIT', 'DISPATCH', 'STOCK_AUDIT'],
    address: 'Vidyanagar, Hubballi, Karnataka 580021',
    notes: 'Heads all 5 dark warehouse fulfillment hubs across North Karnataka.',
    createdAt: '2024-03-15T09:00:00.000Z',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'stf-002',
    employeeId: 'EMP-2026-002',
    name: 'Dr. Anand Nadagouda',
    email: 'anand.nadagouda@agrimart.in',
    mobile: '+91 98450 22334',
    role: 'Lead Agronomist',
    department: 'Procurement & Agronomy',
    assignedPortal: 'procurement',
    branchHub: 'Dharwad Agronomy Research Cell',
    salaryINR: 75000,
    joiningDate: '2024-01-10',
    status: 'ACTIVE',
    permissions: ['VIEW', 'CREATE', 'EDIT', 'AGRONOMY_ADVISORY'],
    address: 'Saptapur, Dharwad, Karnataka 580001',
    notes: 'Ph.D. in Agronomy (UAS Dharwad). Manages 7-stage farmer crop cycles.',
    createdAt: '2024-01-10T09:00:00.000Z',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'stf-003',
    employeeId: 'EMP-2026-003',
    name: 'Sunil Kumar',
    email: 'sunil.kumar@agrimart.in',
    mobile: '+91 98450 33445',
    role: 'State Field Sales Head',
    department: 'Field Sales CRM',
    assignedPortal: 'sales',
    branchHub: 'Mandya & North Karnataka Sales Division',
    salaryINR: 58000,
    joiningDate: '2024-06-01',
    status: 'ACTIVE',
    permissions: ['VIEW', 'CREATE', 'EDIT', 'LEAD_ASSIGNMENT'],
    address: 'Ashok Nagar, Mandya, Karnataka 571401',
    notes: 'Oversees field sales executives, farm demos, and monthly quotas.',
    createdAt: '2024-06-01T09:00:00.000Z',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'stf-004',
    employeeId: 'EMP-2026-004',
    name: 'S. Kulkarni',
    email: 's.kulkarni@agrimart.in',
    mobile: '+91 98450 44556',
    role: 'Chief Workshop Engineer',
    department: 'Workshop & Repairs',
    assignedPortal: 'repairs',
    branchHub: 'Hubballi Central Agri Workshop',
    salaryINR: 54000,
    joiningDate: '2024-04-20',
    status: 'ACTIVE',
    permissions: ['VIEW', 'CREATE', 'EDIT', 'QC_APPROVAL', 'INVOICE'],
    address: 'Gokul Road, Hubballi, Karnataka 580030',
    notes: 'Certified mechanical engineer for 7HP/9HP weeders, sprayers, and pumps.',
    createdAt: '2024-04-20T09:00:00.000Z',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'stf-005',
    employeeId: 'EMP-2026-005',
    name: 'R. Vernekar',
    email: 'r.vernekar@agrimart.in',
    mobile: '+91 98450 55667',
    role: 'Finance Controller',
    department: 'Finance & Dealer Commissions',
    assignedPortal: 'finance',
    branchHub: 'GreenShield Corporate Treasury — Hubballi',
    salaryINR: 72000,
    joiningDate: '2024-02-01',
    status: 'ACTIVE',
    permissions: ['VIEW', 'CREATE', 'EDIT', 'VOUCHER_APPROVAL', 'AUDIT'],
    address: 'Keshwapur, Hubballi, Karnataka 580023',
    notes: 'Manages dealer commission tiers, TDS reconciliation, and payout vouchers.',
    createdAt: '2024-02-01T09:00:00.000Z',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'stf-006',
    employeeId: 'EMP-2026-006',
    name: 'Kavitha Deshpande',
    email: 'kavitha.d@agrimart.in',
    mobile: '+91 98450 66778',
    role: 'Catalogue & Storefront Manager',
    department: 'Super Admin & Catalogue',
    assignedPortal: 'admin',
    branchHub: 'AgriMart HQ — Hubballi',
    salaryINR: 52000,
    joiningDate: '2024-08-12',
    status: 'ACTIVE',
    permissions: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'FULL_ADMIN'],
    address: 'Navanagar, Hubballi, Karnataka 580025',
    notes: 'Manages product catalogue, pricing in INR, attributes, and storefront sync.',
    createdAt: '2024-08-12T09:00:00.000Z',
    updatedAt: new Date().toISOString(),
  },
];

function getStaffList(): StaffMember[] {
  const raw = devDb.getRawData();
  if (!raw.staffMembers || !Array.isArray(raw.staffMembers) || raw.staffMembers.length === 0) {
    raw.staffMembers = DEFAULT_STAFF;
    devDb.save();
  }
  return raw.staffMembers;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const search = (searchParams.get('search') || '').trim().toLowerCase();
    const portal = searchParams.get('portal');
    const status = searchParams.get('status');

    let staff = getStaffList();

    if (id) {
      const found = staff.find((s) => s.id === id || s.employeeId === id);
      if (!found) {
        return NextResponse.json({ success: false, error: 'Staff member not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: found });
    }

    if (search) {
      staff = staff.filter(
        (s) =>
          (s.id || '').toLowerCase().includes(search) ||
          (s.name || '').toLowerCase().includes(search) ||
          (s.employeeId || '').toLowerCase().includes(search) ||
          (s.email || '').toLowerCase().includes(search) ||
          (s.mobile || '').toLowerCase().includes(search) ||
          (s.role || '').toLowerCase().includes(search) ||
          (s.department || '').toLowerCase().includes(search)
      );
    }

    if (portal && portal !== 'All') {
      staff = staff.filter((s) => s.assignedPortal === portal);
    }

    if (status && status !== 'All') {
      staff = staff.filter((s) => s.status === status);
    }

    return NextResponse.json({
      success: true,
      count: staff.length,
      data: staff,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const raw = devDb.getRawData();
    const staff = getStaffList();
    const now = new Date().toISOString();

    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ success: false, error: 'Staff name is required' }, { status: 400 });
    }

    const newMember: StaffMember = {
      id: body.id || `stf-${Date.now()}`,
      employeeId: body.employeeId !== undefined ? String(body.employeeId).trim() : '',
      name: body.name.trim(),
      email: body.email !== undefined ? String(body.email).trim() : '',
      password: body.password !== undefined ? String(body.password) : '',
      emailVerified: Boolean(body.emailVerified),
      mobile: body.mobile !== undefined ? String(body.mobile).trim() : '',
      role: body.role !== undefined ? String(body.role).trim() : '',
      department: body.department !== undefined ? String(body.department).trim() : '',
      assignedPortal: body.assignedPortal || 'admin',
      branchHub: body.branchHub !== undefined ? String(body.branchHub).trim() : '',
      salaryINR: body.salaryINR !== undefined && body.salaryINR !== '' ? Number(body.salaryINR) : 0,
      joiningDate: body.joiningDate !== undefined ? String(body.joiningDate).trim() : '',
      status: body.status || 'ACTIVE',
      permissions: Array.isArray(body.permissions)
        ? body.permissions.filter(Boolean)
        : typeof body.permissions === 'string' && body.permissions.trim()
        ? body.permissions.split(',').map((p: string) => p.trim()).filter(Boolean)
        : [],
      address: body.address !== undefined ? String(body.address).trim() : '',
      notes: body.notes !== undefined ? String(body.notes).trim() : '',
      createdAt: now,
      updatedAt: now,
    };

    staff.unshift(newMember);
    raw.staffMembers = staff;
    devDb.save();

    return NextResponse.json({
      success: true,
      data: newMember,
      message: `Staff member "${newMember.name}" added successfully.`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const raw = devDb.getRawData();
    const staff = getStaffList();
    const now = new Date().toISOString();

    if (!body.id) {
      return NextResponse.json({ success: false, error: 'Staff ID is required for update' }, { status: 400 });
    }

    const idx = staff.findIndex((s) => s.id === body.id);
    if (idx < 0) {
      return NextResponse.json({ success: false, error: 'Staff member not found' }, { status: 404 });
    }

    const permissions = Array.isArray(body.permissions)
      ? body.permissions.filter(Boolean)
      : typeof body.permissions === 'string'
      ? body.permissions.split(',').map((p: string) => p.trim()).filter(Boolean)
      : staff[idx].permissions;

    staff[idx] = {
      ...staff[idx],
      ...body,
      salaryINR:
        body.salaryINR !== undefined
          ? body.salaryINR === ''
            ? 0
            : Number(body.salaryINR)
          : staff[idx].salaryINR,
      permissions,
      updatedAt: now,
    };

    // Ensure old passwords are permanently deleted and only the active password remains
    delete (staff[idx] as any).oldPassword;
    delete (staff[idx] as any).previousPassword;
    delete (staff[idx] as any).tempPassword;

    raw.staffMembers = staff;
    devDb.save();

    return NextResponse.json({
      success: true,
      data: staff[idx],
      message: `Staff member "${staff[idx].name}" updated successfully.`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  return PUT(request);
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryId = searchParams.get('id');
    let idsToDelete: string[] = [];

    if (queryId) {
      idsToDelete.push(queryId);
    } else {
      const body = await request.json().catch(() => ({}));
      if (body.id) idsToDelete.push(body.id);
      if (Array.isArray(body.ids)) idsToDelete.push(...body.ids);
    }

    if (idsToDelete.length === 0) {
      return NextResponse.json({ success: false, error: 'No staff ID(s) provided to delete' }, { status: 400 });
    }

    const raw = devDb.getRawData();
    const staff = getStaffList();
    const remaining = staff.filter((s) => !idsToDelete.includes(s.id));
    const deletedCount = staff.length - remaining.length;

    raw.staffMembers = remaining;
    devDb.save();

    return NextResponse.json({
      success: true,
      deletedCount,
      message: `Deleted ${deletedCount} staff member(s) successfully.`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

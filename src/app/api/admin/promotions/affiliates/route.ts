import { NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

export const initialExampleAffiliates = [
  {
    id: 'aff-1',
    firstName: 'Suresh',
    lastName: 'Gowda',
    friendlyName: 'mandya-krishi-mitra',
    email: 'suresh.gowda@gmail.com',
    company: 'Mandya Agro Producer Co',
    country: 'India',
    stateProvince: 'Karnataka',
    countyRegion: 'Mandya District',
    city: 'Mandya',
    address1: 'Near APMC Yard, Main Road',
    address2: 'Ward No. 4',
    zipPostalCode: '571401',
    phoneNumber: '+91 98451 23456',
    faxNumber: '',
    adminComment: 'Top performing agricultural equipment referral affiliate in South Karnataka.',
    ordersCount: 38,
    commissionEarned: '₹14,500',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'aff-2',
    firstName: 'Vijay',
    lastName: 'Kumar',
    friendlyName: 'rythu-seva-kendra',
    email: 'vijay.rythu@yahoo.com',
    company: 'Rythu Seva Kendra Hub',
    country: 'India',
    stateProvince: 'Andhra Pradesh',
    countyRegion: 'Guntur District',
    city: 'Guntur',
    address1: 'Chilli Market Complex, Shop 12',
    address2: '',
    zipPostalCode: '522004',
    phoneNumber: '+91 94401 98765',
    faxNumber: '',
    adminComment: 'Active affiliate coordinating drone spraying and seed bookings.',
    ordersCount: 65,
    commissionEarned: '₹28,900',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'aff-3',
    firstName: 'Anand',
    lastName: 'Patil',
    friendlyName: 'maharashtra-agro-connect',
    email: 'anand.patil@rediffmail.com',
    company: 'Sahyadri Agro Connect',
    country: 'India',
    stateProvince: 'Maharashtra',
    countyRegion: 'Kolhapur District',
    city: 'Kolhapur',
    address1: 'Station Road, Plot 5',
    address2: 'Near Sugarcane Mill',
    zipPostalCode: '416001',
    phoneNumber: '+91 98220 54321',
    faxNumber: '',
    adminComment: 'Specializes in drip irrigation systems and power tillers.',
    ordersCount: 21,
    commissionEarned: '₹8,400',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'aff-4',
    firstName: 'Pooja',
    lastName: 'Sharma',
    friendlyName: 'kisan-digital-hub',
    email: 'pooja.kisan@gmail.com',
    company: 'Kisan Digital Kendra',
    country: 'India',
    stateProvince: 'Madhya Pradesh',
    countyRegion: 'Indore District',
    city: 'Indore',
    address1: 'AB Road, Bypass Cross',
    address2: '',
    zipPostalCode: '452001',
    phoneNumber: '+91 97550 11223',
    faxNumber: '',
    adminComment: 'New affiliate onboarded last month. Pending verification.',
    ordersCount: 0,
    commissionEarned: '₹0',
    isActive: false,
    createdAt: new Date().toISOString(),
  },
];

export async function GET() {
  try {
    if (!(devDb as any).data) {
      (devDb as any).data = {};
    }
    if (!(devDb as any).data.affiliates || (devDb as any).data.affiliates.length === 0) {
      (devDb as any).data.affiliates = [...initialExampleAffiliates];
      try {
        (devDb as any).save?.();
      } catch (e) {
        // ignore
      }
    }
    return NextResponse.json({ success: true, data: (devDb as any).data.affiliates });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.firstName?.trim() || !body.lastName?.trim()) {
      return NextResponse.json(
        { success: false, error: 'First name and Last name are required' },
        { status: 400 }
      );
    }

    if (!(devDb as any).data) {
      (devDb as any).data = {};
    }
    if (!(devDb as any).data.affiliates) {
      (devDb as any).data.affiliates = [...initialExampleAffiliates];
    }

    const newAffiliate = {
      id: body.id || `aff-${Date.now()}`,
      isActive: Boolean(body.isActive),
      firstName: body.firstName.trim(),
      lastName: body.lastName.trim(),
      email: body.email?.trim() || '',
      company: body.company?.trim() || '',
      country: body.country?.trim() || 'Select country',
      stateProvince: body.stateProvince?.trim() || 'Other',
      countyRegion: body.countyRegion?.trim() || '',
      city: body.city?.trim() || '',
      address1: body.address1?.trim() || '',
      address2: body.address2?.trim() || '',
      zipPostalCode: body.zipPostalCode?.trim() || '',
      phoneNumber: body.phoneNumber?.trim() || '',
      faxNumber: body.faxNumber?.trim() || '',
      adminComment: body.adminComment?.trim() || '',
      friendlyName:
        body.friendlyName?.trim() ||
        `${body.firstName.toLowerCase()}-${body.lastName.toLowerCase()}`,
      ordersCount: 0,
      commissionEarned: '₹0',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    (devDb as any).data.affiliates.unshift(newAffiliate);

    try {
      (devDb as any).save?.();
    } catch (saveErr) {
      console.warn('Could not call save on devDb', saveErr);
    }

    return NextResponse.json({ success: true, data: newAffiliate });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

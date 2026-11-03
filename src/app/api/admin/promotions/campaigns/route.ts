import { NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

export const initialDemoCampaigns = [
  {
    id: 'camp-1',
    name: 'Kharif Pre-Monsoon Machinery Advisory',
    subject: 'Book heavy tillers and seeders before seasonal surge',
    createdOn: '5/20/2026 8:30:00 AM',
    plannedDateOfSending: '5/25/2026 8:00:00 AM',
    body: 'Dear Farmer, prepare your fields with verified heavy equipment...',
    targetRole: 'All Farmers',
  },
  {
    id: 'camp-2',
    name: 'Monsoon Fungicide Special Broadcast',
    subject: 'Protect your crops with tested bio-fungicides & copper sprayers',
    createdOn: '7/10/2026 10:15:00 AM',
    plannedDateOfSending: '7/15/2026 9:30:00 AM',
    body: 'Safeguard your horticultural crops against fungal blast...',
    targetRole: 'Horticulture & Vegetable Growers',
  },
  {
    id: 'camp-3',
    name: 'Drip Irrigation Subsidy Notification',
    subject: 'Avail government aligned drip kit packages at 15% discount',
    createdOn: '9/1/2026 11:00:00 AM',
    plannedDateOfSending: '9/5/2026 10:00:00 AM',
    body: 'Special PMKSY aligned subsidy kits available for booking...',
    targetRole: 'Registered Landowners',
  },
  {
    id: 'camp-4',
    name: 'Harvest Season Drone Spraying Bookings Open',
    subject: 'Drone crop spray bookings now live across 14 districts',
    createdOn: '10/1/2026 9:00:00 AM',
    plannedDateOfSending: '10/10/2026 7:00:00 AM',
    body: 'Book high-precision aerial spraying for paddy and cotton harvest protection...',
    targetRole: 'All Customers',
  },
];

export async function GET() {
  try {
    if (!(devDb as any).data) {
      (devDb as any).data = {};
    }
    if (!(devDb as any).data.campaigns || (devDb as any).data.campaigns.length === 0) {
      (devDb as any).data.campaigns = [...initialDemoCampaigns];
      try {
        (devDb as any).save?.();
      } catch (e) {
        // ignore
      }
    }
    return NextResponse.json({ success: true, data: (devDb as any).data.campaigns });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name?.trim()) {
      return NextResponse.json({ success: false, error: 'Campaign name is required' }, { status: 400 });
    }

    if (!(devDb as any).data) {
      (devDb as any).data = {};
    }
    if (!(devDb as any).data.campaigns) {
      (devDb as any).data.campaigns = [...initialDemoCampaigns];
    }

    const now = new Date();
    const formattedCreated = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()} ${now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' })}`;

    const newCampaign = {
      id: body.id || `camp-${Date.now()}`,
      name: body.name.trim(),
      subject: body.subject?.trim() || body.name.trim(),
      createdOn: formattedCreated,
      plannedDateOfSending: body.plannedDateOfSending?.trim() || '—',
      body: body.body?.trim() || '',
      limitedToCustomerRole: body.limitedToCustomerRole || 'All',
      limitedToSubscriptionTypes: body.limitedToSubscriptionTypes || 'All',
      targetRole: body.limitedToCustomerRole || body.targetRole || 'All Customers',
    };

    (devDb as any).data.campaigns.unshift(newCampaign);

    try {
      (devDb as any).save?.();
    } catch (saveErr) {
      console.warn('Could not call save on devDb', saveErr);
    }

    return NextResponse.json({ success: true, data: newCampaign });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

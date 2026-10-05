import { NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

export const initialTopics = [
  { id: '1', name: 'FAQ', published: false, passwordProtected: false, includeInSitemap: false, displayOrder: 0, body: 'Frequently Asked Questions regarding agri machinery, seed quality, and order delivery.' },
  { id: '2', name: 'Help', published: false, passwordProtected: false, includeInSitemap: false, displayOrder: 0, body: 'Farmer help center and support guidelines.' },
  { id: '3', name: 'ApplyVendor', published: true, passwordProtected: false, includeInSitemap: false, displayOrder: 1, body: 'Join Agri-Mart as a certified agricultural input vendor or machinery provider.' },
  { id: '4', name: 'CheckoutAsGuestOrRegister', published: true, passwordProtected: false, includeInSitemap: false, displayOrder: 1, body: 'Checkout information for registered farmers and guest buyers.' },
  { id: '5', name: 'ContactUs', published: true, passwordProtected: false, includeInSitemap: false, displayOrder: 1, body: 'Reach our 24/7 Kisan Support Desk and Regional Hubs.' },
  { id: '6', name: 'ForumWelcomeMessage', published: true, passwordProtected: false, includeInSitemap: false, displayOrder: 1, body: 'Welcome to the Agri-Mart Community Forum for agricultural discussions.' },
  { id: '7', name: 'HomePageText', published: false, passwordProtected: false, includeInSitemap: false, displayOrder: 1, body: 'Welcome to Agri-Mart - Indias Leading Agricultural Supermarket.' },
  { id: '8', name: 'LoginRegistrationInfo', published: true, passwordProtected: false, includeInSitemap: false, displayOrder: 1, body: 'Benefits of creating an account with Agri-Mart.' },
  { id: '9', name: 'PageNotFound', published: true, passwordProtected: false, includeInSitemap: false, displayOrder: 1, body: 'The requested agricultural listing or page could not be found.' },
  { id: '10', name: 'VendorTermsOfService', published: true, passwordProtected: false, includeInSitemap: false, displayOrder: 1, body: 'Vendor terms, commission structure, and quality inspection rules.' },
  { id: '11', name: 'ShippingInfo', published: true, passwordProtected: false, includeInSitemap: false, displayOrder: 5, body: 'Delivery timelines, village logistics, and machinery freight rates.' },
  { id: '12', name: 'PrivacyInfo', published: true, passwordProtected: false, includeInSitemap: false, displayOrder: 10, body: 'How Agri-Mart secures farmer data, KYC, and land records.' },
  { id: '13', name: 'ConditionsOfUse', published: true, passwordProtected: false, includeInSitemap: false, displayOrder: 15, body: 'Terms of service and marketplace conditions for all buyers and sellers.' },
  { id: '14', name: 'AboutUs', published: true, passwordProtected: false, includeInSitemap: false, displayOrder: 20, body: 'About Agri-Mart Mega Network: Empowering Indian agriculture with technology.' },
];

export async function GET() {
  try {
    if (!(devDb as any).data) {
      (devDb as any).data = {};
    }
    if (!(devDb as any).data.topics || (devDb as any).data.topics.length === 0) {
      (devDb as any).data.topics = [...initialTopics];
      try {
        (devDb as any).save?.();
      } catch (e) {}
    }
    return NextResponse.json({ success: true, data: (devDb as any).data.topics });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name?.trim()) {
      return NextResponse.json({ success: false, error: 'Topic name is required' }, { status: 400 });
    }

    if (!(devDb as any).data) {
      (devDb as any).data = {};
    }
    if (!(devDb as any).data.topics) {
      (devDb as any).data.topics = [...initialTopics];
    }

    const newTopic = {
      id: body.id || `topic-${Date.now()}`,
      name: body.name.trim(),
      published: Boolean(body.published),
      passwordProtected: Boolean(body.passwordProtected),
      includeInSitemap: Boolean(body.includeInSitemap),
      displayOrder: Number(body.displayOrder) || 0,
      body: body.body || '',
    };

    (devDb as any).data.topics.push(newTopic);
    try {
      (devDb as any).save?.();
    } catch (e) {}

    return NextResponse.json({ success: true, data: newTopic });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

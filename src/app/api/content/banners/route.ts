import { NextResponse } from 'next/server';

const BANNERS = [
  {
    id: 'b-01',
    title: 'Kisan Yantra Kranthi 2026',
    subtitle: 'Heavy Power Weeders & Seeders Delivered to Your Farm Gate',
    imageUrl: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=1200&q=80',
    link: '/shop',
    ctaText: 'Explore Machinery',
    badge: 'Seasonal Subsidy Direct',
  },
  {
    id: 'b-02',
    title: 'Drone Precision Crop Protection',
    subtitle: 'Ultra-Fine Micron Spraying for Cotton & Sugarcane Canopy',
    imageUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1200&q=80',
    link: '/services',
    ctaText: 'Book Drone Service',
    badge: 'Verified Operators',
  },
  {
    id: 'b-03',
    title: 'Smart Rental Fleet Marketplace',
    subtitle: 'Tractors, Rotavators & Harvesters on Daily or Weekly Hire',
    imageUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1200&q=80',
    link: '/rentals',
    ctaText: 'View Rental Fleet',
    badge: '100% Refundable Deposit',
  },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: BANNERS,
  });
}

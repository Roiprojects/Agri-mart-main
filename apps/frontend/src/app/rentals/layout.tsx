import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Farm Machinery & Equipment Rentals Karnataka | AGRI MART MEGA',
  description:
    'Rent heavy agricultural machinery, power weeders, self-propelled reapers, and sprayers on daily, weekly, and monthly rates with security deposit protection and doorstep dark hub delivery.',
  alternates: {
    canonical: 'https://www.agrimart.in/rentals',
  },
  openGraph: {
    title: 'Farm Machinery & Equipment Rentals Karnataka | AGRI MART MEGA',
    description:
      'Rent verified farm machinery on daily or weekly slabs without heavy capital investment.',
    url: 'https://www.agrimart.in/rentals',
    siteName: 'AGRI MART MEGA',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RentalsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

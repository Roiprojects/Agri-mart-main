import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Farmer Account Portal | AGRI MART MEGA',
  description: 'Manage your orders, farm equipment rentals, service appointments, and Kisan Wallet.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

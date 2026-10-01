import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Agricultural Inputs & Farm Equipment Shop | AGRI MART MEGA',
  description:
    'Browse and buy genuine agricultural equipment, certified hybrid seeds, organic fertilizers, knapsack sprayers, and power tillers with 1-Year AMC warranty and fast dark warehouse delivery across Karnataka.',
  alternates: {
    canonical: `https://www.${SITE_CONFIG.domain}/shop`,
  },
  openGraph: {
    title: 'Agricultural Inputs & Farm Equipment Shop | AGRI MART MEGA',
    description:
      'Buy authentic farm machinery, seed hybrids, and organic crop nutrition with dark warehouse fulfillment.',
    url: `https://www.${SITE_CONFIG.domain}/shop`,
    siteName: SITE_CONFIG.name,
    locale: 'en_IN',
    type: 'website',
  },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

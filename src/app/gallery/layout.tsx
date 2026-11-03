import { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Life on the Farm - Agricultural Life & Field Operations Gallery | AGRI MART MEGA',
  description:
    'Explore curated photography capturing authentic agricultural operations across Karnataka—from tillage and seed sowing to irrigation, spraying, harvesting, and grain storage.',
  alternates: {
    canonical: `https://www.${SITE_CONFIG.domain}/gallery`,
  },
  openGraph: {
    title: 'Life on the Farm - Agricultural Photo Gallery | AGRI MART MEGA',
    description:
      'Curated visual archive of agricultural life, machinery operations, and crop management milestones across Karnataka.',
    url: `https://www.${SITE_CONFIG.domain}/gallery`,
    siteName: SITE_CONFIG.name,
    locale: 'en_IN',
    type: 'website',
  },
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return children;
}

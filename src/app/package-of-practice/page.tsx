import React from 'react';
import { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/config';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import PackageOfPracticeForm from '@/components/pop/PackageOfPracticeForm';

export const metadata: Metadata = {
  title: 'Package of Practice (POP) & Customer Data Form | AGRI MART MEGA',
  description:
    'Official online Package of Practice (POP) and Customer Data registration form. Connects Karnataka farmers with 1,500+ VLEs, FPOs, 7-stage university agronomic guidance, and mechanical job work services.',
  alternates: {
    canonical: `https://www.${SITE_CONFIG.domain}/package-of-practice`,
  },
  openGraph: {
    title: 'Package of Practice (POP) & Customer Data Form | AGRI MART MEGA',
    description:
      'Official online Package of Practice (POP) and Customer Data registration form. Connects Karnataka farmers with 1,500+ VLEs, FPOs, 7-stage university agronomic guidance, and mechanical job work services.',
    url: `https://www.${SITE_CONFIG.domain}/package-of-practice`,
    siteName: SITE_CONFIG.name,
    locale: 'en_IN',
    type: 'website',
  },
};

export default function PackageOfPracticePage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Package of Practice' },
  ];

  return (
    <div className="min-h-screen bg-agri-cream py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 print:hidden">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <PackageOfPracticeForm />
    </div>
  );
}

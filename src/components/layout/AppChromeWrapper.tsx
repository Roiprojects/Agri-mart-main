'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const PORTAL_PREFIXES = [
  '/admin',
  '/procurement',
  '/warehouse',
  '/sales',
  '/repairs',
  '/finance',
  '/operations-gateway',
];

export default function AppChromeWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/';
  const isPortalRoute = PORTAL_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (isPortalRoute) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-agri-cream text-agri-dark antialiased selection:bg-agri-green selection:text-white">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

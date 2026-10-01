import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { SITE_CONFIG } from '@/lib/config';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import RoleSwitcher from '@/components/common/RoleSwitcher';
import AIChatbotWrapper from '@/components/ai/AIChatbotWrapper';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  metadataBase: new URL(`https://www.${SITE_CONFIG.domain}`),
  title: {
    default: `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline}`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: `${SITE_CONFIG.name} by ${SITE_CONFIG.parentCompany}. Complete digital agricultural platform covering farm machinery, rentals, services, dark warehouses, and AI agronomy guidance.`,
  keywords: [
    'Agri Mart Mega',
    'agrimart.in',
    'agrimartmega.com',
    'power weeders',
    'agricultural equipment rental',
    'farm services tractor booking',
    'bio fertilizers',
    'paddy harvesting',
    'GreenShield Industries',
    'Karnataka agricultural machinery',
  ],
  authors: [{ name: SITE_CONFIG.parentCompany }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: `${SITE_CONFIG.name} - ${SITE_CONFIG.tagline}`,
    description: 'Empowering Indian farmers with genuine farm equipment, equipment rentals, on-field services, and AI advisory.',
    url: `https://www.${SITE_CONFIG.domain}`,
    siteName: SITE_CONFIG.name,
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.name,
    alternateName: [SITE_CONFIG.nameKannada, 'Agri Mart', 'GreenShield Industries'],
    url: `https://www.${SITE_CONFIG.domain}`,
    logo: `https://www.${SITE_CONFIG.domain}/images/agrimart_logo_en_transparent.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: SITE_CONFIG.tollFree,
      contactType: 'customer service',
      areaServed: 'IN',
      availableLanguage: ['en', 'kn', 'hi'],
    },
  };

  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans bg-agri-cream text-agri-dark antialiased selection:bg-agri-green selection:text-white">
        <RoleSwitcher />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        {/* Floating AI Farm Assistant removed as requested */}
        {/* <AIChatbotWrapper /> */}
      </body>
    </html>
  );
}

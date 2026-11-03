import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/config';

export default function robots(): MetadataRoute.Robots {
  const isStaging =
    process.env.APP_ENV === 'staging' ||
    process.env.NEXT_PUBLIC_APP_ENV === 'staging' ||
    (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production');

  const baseUrl = `https://www.${SITE_CONFIG.domain}`;

  // If in staging/preview environment, disallow all crawlers entirely
  if (isStaging) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
      sitemap: `${baseUrl}/sitemap.xml`,
    };
  }

  // Production crawl rules
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin',
        '/admin/',
        '/warehouse',
        '/warehouse/',
        '/procurement',
        '/procurement/',
        '/sales',
        '/sales/',
        '/repairs',
        '/repairs/',
        '/finance',
        '/finance/',
        '/account',
        '/account/',
        '/cart',
        '/checkout',
        '/login',
        '/api/',
        '/order-success',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

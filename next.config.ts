import type { NextConfig } from 'next';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3010';

const nextConfig: NextConfig = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    optimizePackageImports: ['lucide-react', '@agrimart/contracts'],
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: FRONTEND_URL },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/privacy',
        destination: '/privacy-policy',
        permanent: true,
      },
      {
        source: '/shipping',
        destination: '/shipping-policy',
        permanent: true,
      },
      {
        source: '/refund-policy',
        destination: '/terms',
        permanent: true,
      },
      {
        source: '/warehouses',
        destination: '/warehouse',
        permanent: true,
      },
      {
        source: '/service-centres',
        destination: '/repairs',
        permanent: true,
      },
      {
        source: '/shop/farm-equipment-machinery',
        destination: '/categories/farm-equipment-machinery',
        permanent: true,
      },
      {
        source: '/shop/seeds-planting-materials',
        destination: '/categories/seeds-planting-materials',
        permanent: true,
      },
      {
        source: '/shop/fertilizers-soil-care',
        destination: '/categories/fertilizers-soil-care',
        permanent: true,
      },
      {
        source: '/shop/crop-protection-green-care',
        destination: '/categories/crop-protection-green-care',
        permanent: true,
      },
      {
        source: '/shop/irrigation-smart-water-tools',
        destination: '/categories/irrigation-smart-water-tools',
        permanent: true,
      },
      {
        source: '/shop/spare-parts-accessories',
        destination: '/categories/spare-parts-accessories',
        permanent: true,
      },
    ];
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;

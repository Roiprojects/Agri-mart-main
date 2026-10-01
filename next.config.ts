import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
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
};

export default nextConfig;


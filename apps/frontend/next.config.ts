import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
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
  async rewrites() {
    const rawBackendUrl =
      process.env.BACKEND_INTERNAL_URL ||
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      'http://127.0.0.1:3011';
    const backendUrl = rawBackendUrl.replace('://localhost:', '://127.0.0.1:');

    return [
      // Proxy backend API routes except local webhooks and package-of-practice
      {
        source: '/api/:path((?!revalidate|package-of-practice).*)',
        destination: `${backendUrl}/api/:path*`,
      },
      // Proxy admin routes to backend
      {
        source: '/admin/:path*',
        destination: `${backendUrl}/admin/:path*`,
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
    ];
  },
};

export default nextConfig;

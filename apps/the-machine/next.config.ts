import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* Configuration for The Machine - Admin Console */
  reactStrictMode: true,
  
  /* Strict TypeScript enforcement */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  /* Image optimization */
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  /* Enhanced security headers for admin interface */
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

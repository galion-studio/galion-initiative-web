import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Optimize for Cloudflare Pages
  output: 'standalone', // Use 'standalone' for Cloudflare Pages with Next.js runtime
  // Or use 'export' for static export (if you don't need API routes)
  // output: 'export',
};

export default nextConfig;

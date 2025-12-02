import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure Next.js for static export
  // This tells Next.js to export a static site that can be deployed to Cloudflare Pages
  output: 'export',
  
  // Optional: Add trailing slash to all URLs for consistent static file paths
  // This helps with routing on static hosting platforms
  trailingSlash: true,
  
  // Note: With static export, Next.js API routes in src/app/api/ will not work
  // However, Cloudflare Functions in functions/api/ will handle these endpoints
  // when deployed to Cloudflare Pages
};

export default nextConfig;

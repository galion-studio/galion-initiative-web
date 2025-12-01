# The Galion Initiative

Institutional-grade website for The Galion Initiative - a nonprofit research organization developing safe artificial superintelligence (ASI).

## Tech Stack
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- Framer Motion
- Shadcn/ui
- Lucide React
- React Hook Form + Zod

## Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env.local` based on environment variables below.
4. Run dev server: `npm run dev`

## Environment Variables
- `NEXT_PUBLIC_SITE_URL`: https://galioninitiative.org
- `RESEND_API_KEY`: API Key for Resend (Email)
- `NEXT_PUBLIC_NEWSLETTER_LIST_ID`: Audience ID for newsletter

## Deployment
Deployed on Cloudflare Pages.
Build command: `npm run build`
Output directory: `.next`
Node Version: 20

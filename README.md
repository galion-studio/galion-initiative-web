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
- `NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN`: (Optional) Cloudflare Web Analytics token

**Newsletter**: Uses Cloudflare D1 database (no API keys needed). See `CLOUDFLARE_D1_SETUP.md` for setup.

## Deployment
Deployed on Cloudflare Pages.
Build command: `npm run build`
Output directory: `.next`
Node Version: 20

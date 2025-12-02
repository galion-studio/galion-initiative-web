# Local Development Guide

## Important: Newsletter API in Development

**The newsletter API only works when deployed to Cloudflare Pages** because it uses Cloudflare Functions and D1 database.

### Option 1: Test Locally with Wrangler (Recommended)

To test the newsletter functionality locally, you need to use Wrangler to run Cloudflare Functions:

1. **Install Wrangler** (if not already installed):
   ```bash
   npm install -D wrangler
   ```

2. **Create a local D1 database**:
   ```bash
   npx wrangler d1 create galion-newsletter --local
   ```

3. **Run the database schema**:
   ```bash
   npx wrangler d1 execute galion-newsletter --local --file=schema.sql
   ```

4. **Build your Next.js app**:
   ```bash
   npm run build
   ```

5. **Start Wrangler Pages dev server**:
   ```bash
   npm run dev:cloudflare
   ```

   This will start a local server that simulates Cloudflare Pages, including Functions and D1.

### Option 2: Test in Production Only

If you don't want to set up local development:
- The newsletter form will show errors in local development (`npm run dev`)
- It will work correctly when deployed to Cloudflare Pages
- Test the newsletter functionality on your deployed site

### Option 3: Mock API for Development

You can temporarily modify the newsletter component to use a mock response during development:

```typescript
// In Newsletter.tsx, temporarily add:
const response = process.env.NODE_ENV === 'development' 
  ? { ok: true, json: async () => ({ success: true, message: "Subscribed successfully (dev mode)" }) }
  : await fetch('/api/newsletter', { ... });
```

## Current Setup

- **Production**: Newsletter works via Cloudflare Functions (`functions/api/newsletter.ts`)
- **Local Dev**: Newsletter doesn't work unless using Wrangler (see Option 1 above)
- **Next.js API Routes**: Removed (they don't work with static export)

## Quick Test

To quickly test if everything is set up correctly:

1. Deploy to Cloudflare Pages
2. Set up D1 database binding (see `CLOUDFLARE_D1_SETUP.md`)
3. Test the newsletter form on the deployed site
4. Check D1 Console to verify emails are being saved


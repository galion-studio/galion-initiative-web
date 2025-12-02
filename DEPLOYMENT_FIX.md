# Cloudflare Pages Deployment Fix

## Current Error

```
Error: Failed to publish your Function. Got error: Uncaught Error: No such module "node:stream".
```

## Root Cause

Cloudflare Pages is auto-detecting Next.js and running `@cloudflare/next-on-pages`, which is for **server-side Next.js**. However, this project uses **static export** (`output: 'export'`), which doesn't need `@cloudflare/next-on-pages`.

The `@cloudflare/next-on-pages` tool tries to use Node.js modules like `node:stream` that aren't available in Cloudflare Workers runtime, causing the deployment to fail.

## Solution

**You MUST set the Framework preset to "None" in Cloudflare Pages Dashboard:**

1. Go to your Cloudflare Pages project
2. Click **Settings** → **Builds & deployments**
3. Scroll to **Framework preset**
4. **Change it from "Next.js" to "None"**
5. Click **Save**
6. Trigger a new deployment

## Why This Fixes It

- **Framework preset = "Next.js"**: Cloudflare auto-runs `@cloudflare/next-on-pages` (for server-side Next.js)
- **Framework preset = "None"**: Cloudflare treats it as a static site and just serves the `out` directory

Since we're using `output: 'export'`, we're deploying a **static site**, not a server-side Next.js app. The Framework preset should be "None".

## Additional Settings

Make sure these are also correct:

- **Build command**: `npm run build`
- **Build output directory**: `out` (not `.next`)
- **Deploy command**: Leave empty (Cloudflare handles deployment automatically)

## Functions

The Cloudflare Functions in `/functions` will still work correctly - they're separate from the Next.js build process and don't require `@cloudflare/next-on-pages`.


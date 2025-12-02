# Cloudflare Pages Deployment Guide

This guide will walk you through deploying The Galion Initiative website to Cloudflare Pages.

## Prerequisites

1. A Cloudflare account (sign up at [cloudflare.com](https://www.cloudflare.com))
2. Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)
3. Node.js 18+ installed locally (for testing builds)

## Step 1: Prepare Your Repository

Ensure your code is pushed to a Git repository:

```bash
git add .
git commit -m "Prepare for Cloudflare Pages deployment"
git push origin main
```

## Step 2: Connect Repository to Cloudflare Pages

**⚠️ CRITICAL - IMPORTANT DISTINCTION**:
- **Cloudflare Pages** = For hosting Next.js apps and static websites (THIS IS WHAT YOU NEED)
- **Cloudflare Workers** = For serverless functions/edge computing (NOT for Next.js apps)
- In the unified "Workers & Pages" interface, you must specifically create a **Pages** project, not a Worker

### Option 1: Via Cloudflare Dashboard (Recommended)

1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Workers & Pages** in the sidebar (under "Compute & AI")
3. Click **Create application** button (top right, blue button)
4. In the modal that appears, look for tabs or options - you should see:
   - **Workers** tab (for serverless functions)
   - **Pages** tab (for websites/Next.js apps) ← **SELECT THIS ONE**
5. Click on the **Pages** tab/option
6. Click **Connect to Git**
7. Select your Git provider (GitHub, GitLab, or Bitbucket)
8. Authorize Cloudflare to access your repositories
9. Select the `galion-initiative-web` repository
10. Click **Begin setup**

### Option 2: Direct Pages URL

If you can't find the Pages option in the unified interface:

1. Go directly to: `https://dash.cloudflare.com/[your-account-id]/pages`
   - Replace `[your-account-id]` with your account ID (visible in your dashboard URL)
2. Or try: `https://pages.cloudflare.com` and sign in
3. Click **Create a project** or **Connect to Git**
4. Follow the Git connection steps above

**If you accidentally created a Worker instead of a Pages project:**
- You need to create a NEW Pages project (Workers and Pages are separate, even in the unified interface)
- The existing Worker project won't work for Next.js - you need a Pages project
- You can delete the Worker project later if you want (it won't affect your Pages project)

## Step 3: Configure Build Settings

In the **Build configuration** section, use these settings:

### Build Settings:
- **Framework preset**: **MUST be set to `None`** ⚠️ CRITICAL - For static exports, do NOT use "Next.js" preset!
- **Build command**: `npm run build`
- **Build output directory**: **`out`** (this is where Next.js exports static files with `output: 'export'`)
- **Root directory**: `/` (leave as default)
- **Deploy command**: Leave empty (Cloudflare Pages handles deployment automatically)
- **Node.js version**: `20` (set in environment variables)    yes

**⚠️ CRITICAL - FRAMEWORK PRESET FOR STATIC EXPORT**: 
- **You MUST set Framework preset to `None`** in the Cloudflare Pages dashboard
- Setting it to "Next.js" will trigger `@cloudflare/next-on-pages` which requires `nodejs_compat` flag and is for server-side Next.js
- For static exports (`output: 'export'`), we're deploying a static site, not a Next.js runtime app
- Go to: **Settings** → **Builds & deployments** → **Framework preset** → Select `None`
- This prevents the "no nodejs_compat compatibility flag set" error

**⚠️ CRITICAL - BUILD OUTPUT DIRECTORY**: 
- **MUST be set to `out`** - This is where Next.js generates static files when using `output: 'export'`
- Do NOT use `.next` - that's for Next.js runtime deployments, not static exports
- The `out` directory contains all the static HTML, CSS, and JavaScript files ready to be served

**⚠️ IMPORTANT**: 
- Your `next.config.ts` already has `output: 'export'` configured correctly
- This tells Next.js to generate a static site instead of a server-side application
- Cloudflare Pages will serve the static files from the `out` directory

**⚠️ CRITICAL - DEPLOYMENT ISSUE**: 
- **For Git-integrated Cloudflare Pages**: The deploy command should be **EMPTY** - Cloudflare Pages automatically deploys after the build
- If the field is **required** and won't accept empty, use: `echo "Deployment handled by Cloudflare Pages"`
- **DO NOT** use `npx wrangler deploy` - this is for Workers, not Pages, and will cause errors
- **DO NOT** use `wrangler pages deploy` - this causes authentication errors in Git-integrated deployments
- Cloudflare Pages with Git integration handles deployment automatically - no manual deploy command needed
- If you see "Missing entry-point to Worker script" error, it means your deploy command is trying to deploy as a Worker instead of Pages

### Environment Variables:
Add the following environment variables in the **Environment variables** section:

**For Production:**
```
NODE_VERSION=20
NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN=your_cloudflare_analytics_token_here
NEXT_PUBLIC_SITE_URL=https://galioninitiative.org
```

**Optional (if using email services):**
```
RESEND_API_KEY=your_resend_api_key_here
NEXT_PUBLIC_NEWSLETTER_LIST_ID=your_newsletter_list_id_here
```

**Note**: 
- Replace `your_cloudflare_analytics_token_here` with your actual Cloudflare Web Analytics token if you have one. You can get this from:
  - Cloudflare Dashboard → Analytics & Logs → Web Analytics
  - Create a new site and copy the token
- The `NEXT_PUBLIC_*` variables are exposed to the browser, so only use them for non-sensitive values

### Advanced Build Settings (if needed):
If you encounter build issues, you may need to add:

```
NPM_FLAGS=--legacy-peer-deps
```

## Step 4: Deploy

1. Click **Save and Deploy**
2. Cloudflare will start building your site
3. Wait for the build to complete (usually 2-5 minutes)
4. Once complete, you'll get a preview URL like: `https://your-project.pages.dev`

## Step 5: Custom Domain (Optional)

To use a custom domain:

1. In your Cloudflare Pages project, go to **Custom domains**
2. Click **Set up a custom domain**
3. Enter your domain (e.g., `galioninitiative.org`)
4. Follow the DNS configuration instructions
5. Cloudflare will automatically provision SSL certificates

## Step 6: Environment Variables for Production

For production builds, make sure to set environment variables:

1. Go to your Pages project → **Settings** → **Environment variables**
2. Add variables for **Production**:
   - `NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN` (if using Cloudflare Analytics)
   - Any other environment variables your app needs

## Important Notes

### Next.js Static Export on Cloudflare Pages

Since you're using Next.js 16 with `output: 'export'`, you're deploying a static site. Here's what you need to know:

1. **Static Site Deployment**: With `output: 'export'`, Next.js generates static HTML, CSS, and JavaScript files in the `out` directory. Cloudflare Pages serves these static files directly.

2. **API Routes**: Next.js API routes (`src/app/api/`) do NOT work with static export. They require a server runtime. Instead:

   **Use Cloudflare Pages Functions** (Required for static export)
   - Cloudflare Functions in `functions/api/` will handle your API endpoints
   - These functions are automatically deployed with your Pages project
   - The functions will handle `/api/contact` and `/api/newsletter` requests
   - Make sure the functions are in the `functions/api/` directory (already created)

3. **Email Integration**: Currently, your API routes only log to console. For production:
   - Implement email sending using Resend API or similar service
   - Add `RESEND_API_KEY` as an environment variable in Cloudflare Pages
   - Update your API routes to actually send emails

4. **Static Assets**: Files in the `public/` directory (including `blueprint.pdf`) will be served automatically.

### Build Optimization

The build process will:
- Compile TypeScript
- Bundle React components
- Optimize images
- Generate static pages where possible
- Create optimized production builds

### Troubleshooting

**Build succeeds but deployment fails with authentication error**:
- **Issue**: Using `wrangler pages deploy` in Git-integrated Cloudflare Pages causes authentication errors
- **Root cause**: Cloudflare Pages with Git integration handles deployment automatically - no deploy command needed
- **Solution**: Go to your Cloudflare Pages project → **Settings** → **Builds & deployments**
- **Remove or clear the "Deploy command" field** - leave it completely empty
- If the field is required and won't accept empty, try: `echo "Deployment handled by Cloudflare Pages"`
- Save the settings and trigger a new deployment
- **Important**: Git-integrated Pages deployments don't need a deploy command - Cloudflare handles it automatically after the build

**Build fails with "Module not found"**:
- Ensure all dependencies are in `package.json`
- Check that `node_modules` is in `.gitignore`
- Verify `package-lock.json` is committed

**Build succeeds but site shows "Hello World" or doesn't load**:
- **CRITICAL**: Go to your Cloudflare Pages project → **Settings** → **Builds & deployments**
- **Framework preset**: Must be set to `None` (not "Next.js") for static exports
- **Build output directory**: Must be set to `out` (not `.next` or empty)
- **Clear build cache**: Go to **Settings** → **Builds & deployments** → **Clear build cache** and redeploy
- Verify environment variables are set
- Check browser console for errors
- Make sure `next.config.ts` has `output: 'export'` (we already configured this)

**Error: "no nodejs_compat compatibility flag set" or "@cloudflare/next-on-pages" error**:
- **Root cause**: Framework preset is set to "Next.js" which triggers the Next.js runtime
- **Solution**: Go to **Settings** → **Builds & deployments** → **Framework preset** → Change to `None`
- **Why**: With `output: 'export'`, we're deploying a static site, not a Next.js runtime app
- **Build output directory**: Must be `out` (where static files are generated)
- After changing these settings, trigger a new deployment

**PDF not loading**:
- Ensure `public/blueprint.pdf` is committed to the repository
- Check file size (Cloudflare Pages has a 25MB file size limit per file)

## Alternative: Manual Deployment via Wrangler CLI

If you prefer to deploy via CLI:

1. Install Wrangler:
```bash
npm install -g wrangler
```

2. Login to Cloudflare:
```bash
wrangler login
```

3. Build your project:
```bash
npm run build
```

4. Deploy to Pages:
```bash
wrangler pages deploy .next --project-name=galion-initiative-web
```

## Monitoring and Analytics

After deployment:
1. Monitor builds in the Cloudflare Pages dashboard
2. Set up Cloudflare Web Analytics (if using)
3. Configure custom error pages if needed
4. Set up redirects in the Pages dashboard if needed

## Support

For issues specific to:
- **Cloudflare Pages**: Check [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- **Next.js**: Check [Next.js Documentation](https://nextjs.org/docs)
- **Build errors**: Check the build logs in the Cloudflare Pages dashboard


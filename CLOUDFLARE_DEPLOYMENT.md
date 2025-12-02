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

## Step 3: Configure Build Settings yeet the change 

In the **Build configuration** section, use these settings:

### Build Settings:
- **Framework preset**: **MUST be explicitly set to `Next.js`** ⚠️ CRITICAL - Do not rely on auto-detection!
- **Build command**: `npm run build`
- **Build output directory**: Try `.next` first. If that doesn't work, leave it empty
- **Root directory**: `/` (leave as default)
- **Deploy command**: `echo "Deployment handled by Cloudflare Pages"` (or leave empty if possible)
- **Node.js version**: `20` (set in environment variables)

**⚠️ CRITICAL - FRAMEWORK PRESET**: 
- **You MUST explicitly set Framework preset to `Next.js`** in the Cloudflare Pages dashboard
- If Framework preset is not set or is set to "None", Cloudflare Pages will show "Hello World" instead of your app
- Go to: **Settings** → **Builds & deployments** → **Framework preset** → Select `Next.js`
- This is the #1 cause of "Hello World" appearing on deployed sites

**⚠️ IMPORTANT**: 
- Do NOT set `output: 'standalone'` in `next.config.ts` - this is for self-hosting, not Cloudflare Pages
- Cloudflare Pages needs the Framework preset to properly serve Next.js applications

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

### Next.js 16 on Cloudflare Pages

Since you're using Next.js 16, Cloudflare Pages supports Next.js natively. Here's what you need to know:

1. **Next.js Runtime**: Cloudflare Pages will automatically use the Next.js runtime when it detects a Next.js project. Your API routes in `src/app/api/` will work automatically.

2. **API Routes**: Your existing Next.js API routes (`/api/contact` and `/api/newsletter`) should work on Cloudflare Pages without modification. However:

   **Option A: Keep Next.js API Routes** (Simplest)
   - Your current API routes will work as-is
   - Cloudflare Pages will handle them automatically
   - Just ensure environment variables are set correctly

   **Option B: Use Cloudflare Pages Functions** (Optional, for better performance)
   - I've created example functions in the `functions/api/` directory
   - These can replace your Next.js API routes if you prefer
   - Delete the `functions/api/` directory if you want to keep using Next.js API routes

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
- **Framework preset**: Must be explicitly set to `Next.js` (don't rely on auto-detection)
- **Build output directory**: Try setting it to `.next` explicitly (even though docs say to leave empty, sometimes explicit is needed)
- If `.next` doesn't work, try leaving it empty again and ensure Framework preset is `Next.js`
- **Clear build cache**: Go to **Settings** → **Builds & deployments** → **Clear build cache** and redeploy
- Verify environment variables are set
- Check browser console for errors
- Make sure `next.config.ts` does NOT have `output: 'standalone'` (we already fixed this)

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


# Cloudflare Web Analytics Setup Guide

This guide explains how to connect Cloudflare Web Analytics to your site.

## Step 1: Get Your Analytics Token

### Option 1: Check Cloudflare Pages Environment Variables (Easiest)

If your analytics is already working on the live site, the token might already be set:

1. **Go to Cloudflare Pages Dashboard**
   - Log in to [dash.cloudflare.com](https://dash.cloudflare.com)
   - Navigate to **Workers & Pages** → Your project (`galion-initiative-web`)
   - Go to **Settings** → **Environment variables**

2. **Check for the Token**
   - Look for `NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN` in the Production environment
   - If it exists, you can view/copy it from there
   - If it doesn't exist but analytics is working, it might be set elsewhere

### Option 2: Extract Token from Live Site HTML

If the script is already on your live site:

1. **Visit your live site**: `https://galioninitiative.org`
2. **View Page Source**: Right-click → **View Page Source** (or press Ctrl+U / Cmd+U)
3. **Search for the token**: Press Ctrl+F / Cmd+F and search for:
   - `data-cf-beacon`
   - `cloudflareinsights`
   - `NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN`
4. **Extract the token**: Look for a script tag like:
   ```html
   <script defer src="https://static.cloudflareinsights.com/beacon.min.js" 
           data-cf-beacon='{"token": "YOUR_TOKEN_HERE"}'></script>
   ```
   - The token is the value after `"token":` (the long alphanumeric string)

### Option 3: Get Token from "Enable with JS Snippet installation" Option

If you selected **"Enable with JS Snippet installation"** in the Manage site page:

1. After clicking **"Update"**, the JavaScript snippet should appear on the page
2. The snippet will look like:
   ```html
   <script defer src='https://static.cloudflareinsights.com/beacon.min.js' 
           data-cf-beacon='{"token": "YOUR_TOKEN_HERE"}'></script>
   ```
3. Extract the token from the `data-cf-beacon` attribute

**Note**: If the snippet doesn't appear, check the **"Advanced Options"** link at the bottom of the page.

### Option 4: Check Web Analytics Dashboard Settings

If You Already Have a Site Set Up (Finding Existing Token)

If you've already created Cloudflare Web Analytics for your site but can't find the token:

1. **Log in to Cloudflare Dashboard**
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com)
   - Sign in with your Cloudflare account

2. **Navigate to Web Analytics**
   - In the left sidebar, click **Analytics & Logs**
   - Click **Web Analytics**

3. **Find Your Site**
   - Click on your site name (`galioninitiative.org`) in the list
   - Or look for a **"Manage site"** or **"Setup"** button

4. **View Installation Instructions**
   - Look for a section showing the JavaScript installation code
   - You should see a snippet like:
     ```html
     <script defer src='https://static.cloudflareinsights.com/beacon.min.js' 
             data-cf-beacon='{"token": "YOUR_TOKEN_HERE"}'></script>
     ```

5. **Extract the Token**
   - The token is the value inside the quotes after `"token":` in the `data-cf-beacon` attribute
   - Copy just the token value (the long alphanumeric string)

**Alternative: Check Your Live Site**
- If the analytics script is already on your live site, you can:
  1. Visit your website
  2. Right-click → **View Page Source** (or press Ctrl+U)
  3. Search for `data-cf-beacon` or `cloudflareinsights`
  4. Extract the token from the `data-cf-beacon` attribute

### If You Need to Create a New Site

1. **Log in to Cloudflare Dashboard**
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com)
   - Sign in with your Cloudflare account

2. **Navigate to Web Analytics**
   - In the left sidebar, click **Analytics & Logs**
   - Click **Web Analytics**

3. **Add a New Site**
   - Click **Add a site** button
   - Enter your website URL (e.g., `galioninitiative.org`)
   - Click **Begin setup**

4. **Copy Your Token**
   - After adding the site, you'll see the installation snippet with the token
   - Extract the token from the `data-cf-beacon` attribute
   - **Important**: Copy the token immediately - Cloudflare doesn't show it again after initial setup!

## Step 2: Set Environment Variable

### For Local Development

1. Create or edit `.env.local` in your project root:
   ```bash
   NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN=your_token_here
   NEXT_PUBLIC_SITE_URL=https://galioninitiative.org
   ```

2. Replace `your_token_here` with the token you copied from Cloudflare

3. Restart your development server:
   ```bash
   npm run dev
   ```

### For Production (Cloudflare Pages)

1. Go to your Cloudflare Pages project dashboard
2. Navigate to **Settings** → **Environment variables**
3. Click **Add variable** for **Production** environment
4. Add:
   - **Variable name**: `NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN`
   - **Value**: Your token from Step 1
5. Click **Save**
6. Redeploy your site (or wait for the next automatic deployment)

## Step 3: Verify It's Working

### In Development

1. Open your browser's Developer Console (F12)
2. Accept analytics cookies in the cookie consent banner
3. Navigate around your site
4. You should see analytics events logged in the console like:
   ```
   [Analytics] page_view { path: '/', ... }
   [Analytics] click_button { ... }
   ```

### In Production

1. Visit your live site
2. Accept analytics cookies
3. Wait a few minutes
4. Go back to Cloudflare Dashboard → Analytics & Logs → Web Analytics
5. You should see page views and events appearing in the dashboard

## How It Works

The analytics implementation:

- **Only loads if user consents**: The script only loads after the user accepts analytics cookies
- **Tracks automatically**:
  - Page views and navigation
  - Scroll depth (25%, 50%, 75%, 90%, 100%)
  - Click events on buttons and links
  - Time spent on pages
- **Privacy-preserving**: Cloudflare Web Analytics doesn't use cookies or track individual users
- **Respects user preferences**: If user disables analytics cookies, tracking stops immediately

## Troubleshooting

### Analytics not loading?

1. **Check the token is set correctly**
   - Make sure `NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN` is in your environment variables
   - For local dev: Check `.env.local` file exists and has the token
   - For production: Check Cloudflare Pages environment variables

2. **Check cookie consent**
   - Analytics only loads if user accepts analytics cookies
   - Open browser console and check if `isAnalyticsEnabled()` returns `true`

3. **Check browser console**
   - Look for any errors related to Cloudflare Analytics
   - Check if the script tag is being added to the page

4. **Verify token format**
   - Token should be a long alphanumeric string
   - No spaces or extra characters

### Still not working?

- Make sure you've restarted your dev server after adding the token
- Clear browser cache and cookies
- Check that the site URL in Cloudflare Analytics matches your actual domain

## Current Implementation

The analytics code is already integrated in:
- `src/components/AnalyticsScript.tsx` - Loads the Cloudflare Analytics script
- `src/components/AnalyticsProvider.tsx` - Tracks page views, scrolls, and clicks
- `src/lib/analytics.ts` - Utility functions for tracking events

No code changes needed - just add the token!


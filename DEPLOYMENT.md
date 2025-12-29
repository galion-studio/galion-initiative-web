# Project 42 - Deployment Guide

This guide covers deployment for both projects in the Project 42 monorepo.

## Architecture Overview

Project 42 uses a **monorepo structure** with two independent applications:
- **Galion Initiative** - Deployed to Cloudflare Pages
- **The Machine** - To be deployed to Cloudflare Pages

Both apps are deployed separately but share common packages.

## Prerequisites

- Node.js 20 or higher
- npm 10 or higher
- Cloudflare account
- Wrangler CLI installed globally: `npm install -g wrangler`

## Deployment Strategy

### Option 1: Independent Deployments (Recommended)

Each app is deployed separately with its own domain and configuration.

**Advantages:**
- Independent scaling
- Isolated environments
- Separate analytics
- Different deployment schedules

**Domains:**
- Galion Initiative: `galioninitiative.org`
- The Machine: TBD (e.g., `themachine.ai`)

### Option 2: Subdomain Deployments

Both apps under the same root domain.

**Example:**
- Galion Initiative: `galion.project42.org`
- The Machine: `machine.project42.org`

## Galion Initiative Deployment

### Current Setup
✅ Already deployed to Cloudflare Pages  
✅ Domain: galioninitiative.org  
✅ Database: Cloudflare D1  
✅ Analytics: Cloudflare Web Analytics

### Build Configuration

```bash
# From project root
npm run build:galion
```

**Build settings:**
- Build command: `npm run build -w apps/galion-initiative`
- Output directory: `apps/galion-initiative/.next`
- Node version: 20
- Root directory: (leave empty - build from root)

### Environment Variables

Set in Cloudflare Pages dashboard:

```bash
NEXT_PUBLIC_SITE_URL=https://galioninitiative.org
NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN=your_token_here
```

### Database Setup

See detailed guides:
- [CLOUDFLARE_D1_SETUP.md](./apps/galion-initiative/CLOUDFLARE_D1_SETUP.md)
- [LOCAL_DEVELOPMENT.md](./apps/galion-initiative/LOCAL_DEVELOPMENT.md)

## The Machine Deployment

### Setup Steps

#### 1. Create Cloudflare Pages Project

```bash
# Login to Cloudflare
wrangler login

# Create new Pages project
wrangler pages project create the-machine
```

#### 2. Configure Build Settings

**In Cloudflare Pages dashboard:**
- Build command: `npm run build -w apps/the-machine`
- Output directory: `apps/the-machine/.next`
- Node version: 20
- Root directory: (leave empty - build from root)

#### 3. Set Environment Variables

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NODE_VERSION=20
```

#### 4. Deploy

```bash
# From project root
npm run build:machine

# Deploy to Cloudflare Pages
cd apps/the-machine
wrangler pages deploy .next --project-name=the-machine
```

### Custom Domain

1. Go to Cloudflare Pages dashboard
2. Select "the-machine" project
3. Go to "Custom domains"
4. Add your domain
5. Update DNS records as instructed

## Monorepo Considerations

### Build Process

Because we use a monorepo with workspaces, builds must be run from the **project root**:

```bash
# ✅ CORRECT - from root
npm run build:galion
npm run build:machine

# ❌ INCORRECT - from app directory
cd apps/galion-initiative
npm run build  # This won't work - missing shared packages
```

### Cloudflare Pages Configuration

**Important:** Cloudflare Pages needs to build from the root to access shared packages.

**Build command format:**
```bash
npm install && npm run build -w apps/[APP_NAME]
```

**Examples:**
```bash
# Galion Initiative
npm install && npm run build -w apps/galion-initiative

# The Machine
npm install && npm run build -w apps/the-machine
```

### Shared Packages

Shared packages are automatically installed when you run `npm install` from the root.

**Packages:**
- `@project-42/shared-ui` - Shared components
- `@project-42/shared-utils` - Shared utilities
- `@project-42/shared-config` - Shared config

## CI/CD Pipeline (Future)

### GitHub Actions (Recommended)

Create `.github/workflows/deploy-galion.yml`:

```yaml
name: Deploy Galion Initiative

on:
  push:
    branches:
      - main
    paths:
      - 'apps/galion-initiative/**'
      - 'packages/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build Galion Initiative
        run: npm run build:galion
      
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: galion-initiative
          directory: apps/galion-initiative/.next
```

Create similar workflow for The Machine: `.github/workflows/deploy-machine.yml`

## Local Testing

### Test Galion Initiative

```bash
# Development
npm run dev:galion

# Production build locally
npm run build:galion
cd apps/galion-initiative
npx next start
```

### Test The Machine

```bash
# Development
npm run dev:machine

# Production build locally
npm run build:machine
cd apps/the-machine
npx next start
```

## Troubleshooting

### Build fails with "Cannot find module"

**Problem:** Shared packages not found  
**Solution:** Run build from project root, not app directory

```bash
# From project root
npm install
npm run build:galion  # or build:machine
```

### Environment variables not working

**Problem:** Environment variables not set in Cloudflare  
**Solution:** Add them in Cloudflare Pages dashboard under Settings > Environment variables

### Outdated dependencies

**Problem:** Dependencies out of sync  
**Solution:** Clean install from root

```bash
# From project root
npm run clean
npm install
npm run build
```

## Monitoring

### Galion Initiative
- Analytics: Cloudflare Web Analytics dashboard
- Logs: Cloudflare Pages logs
- Performance: Cloudflare Speed insights

### The Machine
- To be configured after deployment

## Rollback Procedure

If a deployment fails:

1. Go to Cloudflare Pages dashboard
2. Select the project
3. Go to "Deployments"
4. Find the last working deployment
5. Click "Rollback to this deployment"

## Security

### Secrets Management

Never commit secrets to git. Use:
- Cloudflare dashboard for environment variables
- `.env.local` for local development (gitignored)
- GitHub Secrets for CI/CD

### Security Headers

Both apps include security headers in `next.config.ts`:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin

## Performance

### Optimization Checklist

- [x] Next.js Image optimization enabled
- [x] Static asset optimization
- [x] Code splitting (automatic with Next.js)
- [x] Cloudflare CDN caching
- [ ] Database query optimization (as needed)
- [ ] API route caching (as needed)

## Support

For deployment issues:
1. Check this guide first
2. Review app-specific documentation
3. Check Cloudflare Pages documentation
4. Review build logs in Cloudflare dashboard

---

**Part of Project 42**  
*Building safe AGI and caring AI for humanity*

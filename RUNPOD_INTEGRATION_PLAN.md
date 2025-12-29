# RunPod Integration Plan for Galion Initiative Web

## Current State Analysis

### Project Structure
```
galion-initiative-web/
├── src/                    # Galion Initiative website (ROOT PROJECT)
├── apps/
│   ├── galion-initiative/  # Empty - code is at root
│   ├── the-machine/        # Admin console (broken - React version conflict)
│   └── torchbearer/        # Community interface (broken - Tailwind v4 issues)
└── packages/               # Shared packages (empty)
```

### Current Deployment
| App | Status | Platform | Issues |
|-----|--------|----------|--------|
| galion-initiative | ✅ Fixed | Cloudflare Pages | Build now works |
| the-machine | ❌ Broken | Not deployed | React 18 vs 19 conflict |
| torchbearer | ❌ Broken | Not deployed | Tailwind v4 migration issues |

## Integration Options

### Option A: Hybrid Deployment (Recommended)
Keep galion-initiative on Cloudflare, deploy the-machine and torchbearer to RunPod.

**Pros:**
- galion-initiative uses static export - perfect for Cloudflare CDN
- the-machine needs server-side features (API routes, database)
- Leverages existing project-nexus infrastructure on RunPod

**Cons:**
- Split infrastructure management

### Option B: Full RunPod Migration
Move all apps to RunPod alongside project-nexus.

**Pros:**
- Unified infrastructure
- Share PostgreSQL database with project-nexus
- Centralized monitoring and deployment

**Cons:**
- Lose Cloudflare CDN benefits for static site
- More RunPod resources needed

### Option C: Merge into Project-Nexus
Incorporate as new frontend apps within project-nexus ecosystem.

**Pros:**
- Single codebase
- Shared components
- Unified deployment pipeline

**Cons:**
- Major restructuring
- Different tech requirements (Cloudflare D1 vs PostgreSQL)

## Recommended Approach: Option A (Hybrid)

### Phase 1: Fix galion-initiative (DONE)
- [x] Fixed tsconfig.json to exclude apps/
- [x] Fixed package.json build scripts
- [x] Pushed to GitHub - Cloudflare auto-deploys

### Phase 2: Fix the-machine for RunPod
**Changes Required:**
1. Remove @cloudflare/next-on-pages dependency
2. Replace Cloudflare D1 with PostgreSQL (use project-nexus DB)
3. Upgrade to React 19 / Next.js 16 to match ecosystem
4. Remove Cloudflare-specific API patterns

**Database Migration:**
```sql
-- Migrate from D1 to PostgreSQL
-- Tables to migrate:
-- - operators
-- - audit_logs
-- - assessments
-- - settings
-- - patterns
```

### Phase 3: Fix torchbearer for RunPod
**Changes Required:**
1. Fix Tailwind v4 configuration
2. Align React/Next.js versions with ecosystem
3. Add to project-nexus frontend family

### Phase 4: Deploy to RunPod
**PM2 Configuration:**
```javascript
// ecosystem.config.js additions
{
  name: 'the-machine',
  script: 'npm',
  args: 'start',
  cwd: '/app/frontend/the-machine',
  env: {
    PORT: 3004,
    NODE_ENV: 'production',
    DATABASE_URL: 'postgres://...'
  }
},
{
  name: 'torchbearer',
  script: 'npm',
  args: 'start',
  cwd: '/app/frontend/torchbearer',
  env: {
    PORT: 3005,
    NODE_ENV: 'production'
  }
}
```

**Port Assignments:**
| App | Internal Port | External Port |
|-----|--------------|---------------|
| galion-app | 3000 | 4000 |
| galion-studio | 3001 | 4001 |
| workspace3d | 3002 | 4002 |
| developer-portal | 3003 | 4003 |
| **the-machine** | **3004** | **4004** |
| **torchbearer** | **3005** | **4005** |
| backend | 8000 | 8000 |

## Migration Checklist

### Pre-Migration
- [ ] Backup Cloudflare D1 database
- [ ] Document all environment variables
- [ ] Test builds locally

### the-machine Migration
- [ ] Remove Cloudflare dependencies
- [ ] Create PostgreSQL schema
- [ ] Update API routes to use PostgreSQL
- [ ] Fix React version (upgrade to 19)
- [ ] Test build locally
- [ ] Copy to RunPod
- [ ] Add to PM2

### torchbearer Migration
- [ ] Fix Tailwind v4 configuration
- [ ] Align package versions
- [ ] Test build locally
- [ ] Copy to RunPod
- [ ] Add to PM2

### Post-Migration
- [ ] Update nginx configuration
- [ ] Test all endpoints
- [ ] Set up monitoring
- [ ] Update documentation

## Database Schema for the-machine

```sql
-- operators table
CREATE TABLE operators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(100),
  role VARCHAR(50) DEFAULT 'operator',
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);

-- audit_logs table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operator_id UUID REFERENCES operators(id),
  action VARCHAR(100) NOT NULL,
  category VARCHAR(50),
  severity VARCHAR(20),
  details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- assessments table
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID REFERENCES operators(id),
  identification JSONB,
  estimate JSONB,
  options JSONB,
  flags JSONB,
  status VARCHAR(20) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- settings table
CREATE TABLE settings (
  key VARCHAR(100) PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW(),
  updated_by UUID REFERENCES operators(id)
);
```

## Next Steps

1. **Immediate**: galion-initiative is fixed and deploying to Cloudflare
2. **Short-term**: Fix the-machine for local development, then deploy to RunPod
3. **Medium-term**: Fix torchbearer and integrate
4. **Long-term**: Consider full unification with project-nexus

## Notes

- Keep galion-initiative on Cloudflare for best static site performance
- the-machine and torchbearer are better suited for RunPod due to server requirements
- Consider using shared components between project-nexus and Project 42 apps

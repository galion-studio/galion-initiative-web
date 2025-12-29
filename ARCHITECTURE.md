# Project 42 - Architecture Documentation

## Overview

Project 42 uses a **monorepo architecture** to house two independent but related projects:

1. **Galion Initiative** - Safe AGI research platform
2. **The Machine** - Caring AI guidance interface

## Monorepo Structure

```
project-42/
├── apps/                       # Applications
│   ├── galion-initiative/      # Galion Initiative app
│   │   ├── src/
│   │   │   ├── app/            # Next.js App Router
│   │   │   ├── components/     # React components
│   │   │   └── lib/            # Utilities
│   │   ├── functions/          # Cloudflare Functions
│   │   ├── public/             # Static assets
│   │   ├── package.json        # App dependencies
│   │   └── README.md
│   │
│   └── the-machine/            # The Machine app
│       ├── src/
│       │   ├── app/            # Next.js App Router
│       │   ├── components/     # React components
│       │   └── lib/            # Utilities
│       ├── public/             # Static assets
│       ├── package.json        # App dependencies
│       └── README.md
│
├── packages/                   # Shared packages
│   ├── shared-ui/              # Shared React components
│   │   ├── src/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── README.md
│   │
│   ├── shared-utils/           # Shared utilities
│   │   ├── src/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── README.md
│   │
│   └── shared-config/          # Shared configuration
│       ├── package.json
│       └── README.md
│
├── docs/                       # Documentation
│   └── project-42/             # Project vision docs
│       ├── PROJECT_42_VISION.md
│       ├── Galion-Blueprint-Part1-UPDATED.md
│       ├── Galion-Blueprint-Part2.md
│       ├── Galion-Blueprint-Part3.md
│       └── FRONTEND_IMPLEMENTATION_SUMMARY.md
│
├── package.json                # Root package.json (workspaces)
├── .gitignore                  # Git ignore rules
├── README.md                   # Main documentation
├── ARCHITECTURE.md             # This file
└── DEPLOYMENT.md               # Deployment guide
```

## Design Philosophy

### Separation of Concerns

**Each project has distinct purpose:**

**Galion Initiative:**
- Technical focus
- Safety architecture
- Research documentation
- Institutional design
- Professional tone

**The Machine:**
- Human focus
- Guidance interface
- Wisdom sharing
- Warm, caring design
- Motherly tone

### Shared Infrastructure

**Common packages prevent duplication:**

- **shared-ui**: Reusable React components
- **shared-utils**: Common utility functions
- **shared-config**: Shared configurations

**Benefits:**
- Code reuse
- Consistent patterns
- Easier maintenance
- Single source of truth

## Technology Stack

### Both Projects

**Framework:**
- Next.js 15 (App Router)
- React 19
- TypeScript (Strict Mode)

**Styling:**
- Tailwind CSS v4
- PostCSS
- Custom design tokens

**Development:**
- ESLint
- TypeScript
- npm workspaces

### Galion Initiative Specific

**UI Components:**
- Shadcn/ui
- Radix UI primitives
- Framer Motion animations

**Backend:**
- Cloudflare Functions
- Cloudflare D1 Database

**Deployment:**
- Cloudflare Pages

**Design:**
- Institutional color palette (blues, grays)
- Professional typography
- Technical, precise interface

### The Machine Specific

**UI Components:**
- Radix UI primitives
- Framer Motion animations
- Custom warm components

**Backend:**
- To be determined (AI integration)
- Potential database: Cloudflare D1

**Deployment:**
- Cloudflare Pages (planned)

**Design:**
- Warm color palette (coral, sage, lavender)
- Friendly typography
- Caring, gentle interface

## Package Management

### npm Workspaces

Project 42 uses **npm workspaces** for monorepo management.

**Root package.json:**
```json
{
  "name": "project-42",
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}
```

**Benefits:**
- Single `node_modules` at root
- Shared dependencies
- Workspace-specific commands
- Efficient installation

**Commands:**
```bash
# Install all packages
npm install

# Run command in specific workspace
npm run dev -w apps/galion-initiative
npm run build -w apps/the-machine

# Run command in all workspaces
npm run build --workspaces
```

## Data Flow

### Galion Initiative

```
User Browser
    ↓
Next.js App Router
    ↓
React Components → Shared UI Components
    ↓
API Routes (Cloudflare Functions)
    ↓
Cloudflare D1 Database
```

### The Machine (Planned)

```
User Browser
    ↓
Next.js App Router
    ↓
React Components → Shared UI Components
    ↓
AI API Layer (to be implemented)
    ↓
Knowledge Base / Vector Database
```

## Styling Architecture

### Tailwind CSS v4

Both projects use Tailwind CSS v4 with **different design tokens**.

**Galion Initiative:**
```css
/* Institutional blues and grays */
primary: #1E3A8A (deep blue)
secondary: #64748B (slate gray)
accent: #3B82F6 (bright blue)
```

**The Machine:**
```css
/* Warm, caring colors */
primary: #FF8A5B (warm coral)
secondary: #52B788 (calm green)
accent: #9C27B0 (gentle purple)
```

### CSS Organization

```
src/app/globals.css
├── @layer base        # CSS reset, base styles
├── @layer utilities   # Custom utilities
└── Custom animations  # App-specific animations
```

## Component Architecture

### Galion Initiative

```
src/components/
├── sections/          # Homepage sections
│   ├── Hero.tsx
│   ├── Mission.tsx
│   ├── Blueprint.tsx
│   ├── Donate.tsx
│   └── Newsletter.tsx
├── shared/            # Reusable components
│   ├── CookieConsent.tsx
│   └── TrackedButton.tsx
└── ui/                # UI primitives (Shadcn)
    ├── button.tsx
    ├── card.tsx
    └── input.tsx
```

### The Machine

```
src/components/
├── sections/          # Page sections (to be built)
├── shared/            # Reusable components
└── ui/                # UI primitives (to be built)
```

### Shared Components

```
packages/shared-ui/src/
└── index.ts           # Exported components
```

**Usage in apps:**
```typescript
import { Button, Card } from '@project-42/shared-ui';
```

## Build Process

### Development

```bash
# Terminal 1 - Galion Initiative
npm run dev:galion     # Runs on port 3000

# Terminal 2 - The Machine
npm run dev:machine    # Runs on port 3001
```

### Production Build

```bash
# Build all apps
npm run build

# Build specific app
npm run build:galion
npm run build:machine
```

**Build output:**
- `apps/galion-initiative/.next/` - Galion build
- `apps/the-machine/.next/` - Machine build

## Deployment Architecture

### Independent Deployments

Each app deploys independently:

**Galion Initiative:**
- Platform: Cloudflare Pages
- Domain: galioninitiative.org
- Build: From monorepo root
- Command: `npm run build:galion`

**The Machine:**
- Platform: Cloudflare Pages (planned)
- Domain: TBD
- Build: From monorepo root
- Command: `npm run build:machine`

### Deployment Flow

```
Git Push to Main
    ↓
CI/CD Detects Changes
    ↓
Install Dependencies (root)
    ↓
Build Specific App
    ↓
Deploy to Cloudflare Pages
    ↓
Update DNS
    ↓
Live Site
```

## Security Considerations

### Environment Variables

**Never commit:**
- API keys
- Database credentials
- Analytics tokens

**Storage:**
- Local: `.env.local` (gitignored)
- Production: Cloudflare Pages environment variables
- CI/CD: GitHub Secrets

### Security Headers

Both apps implement security headers:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Content-Security-Policy (planned)

## Performance Optimization

### Next.js Features

- **Automatic code splitting** - Only load what's needed
- **Image optimization** - Next.js Image component
- **Static generation** - Pre-render pages at build time
- **Incremental Static Regeneration** - Update static pages

### Cloudflare Features

- **Global CDN** - Edge caching worldwide
- **Smart routing** - Fastest path to origin
- **Minification** - Automatic asset optimization
- **Brotli compression** - Smaller file sizes

## Testing Strategy (Future)

### Unit Tests
```bash
npm run test -w apps/galion-initiative
npm run test -w apps/the-machine
```

### E2E Tests
```bash
npm run test:e2e -w apps/galion-initiative
npm run test:e2e -w apps/the-machine
```

### Integration Tests
```bash
npm run test:integration
```

## Future Enhancements

### Phase 1 (Current)
- [x] Monorepo structure
- [x] Both app scaffolds
- [x] Shared packages setup

### Phase 2
- [ ] Implement The Machine features
- [ ] Add more shared components
- [ ] Set up CI/CD pipeline

### Phase 3
- [ ] Cross-app authentication
- [ ] Unified admin portal
- [ ] Advanced analytics

### Phase 4
- [ ] Microservices for AI processing
- [ ] Vector database integration
- [ ] Real-time features

## Development Guidelines

### Code Style

1. **TypeScript strict mode** - No implicit any
2. **Functional components** - Use hooks
3. **Descriptive naming** - Clear variable names
4. **Comments** - Explain why, not what
5. **Small files** - < 200 lines preferred

### Git Workflow

```
main
├── feature/galion-newsletter
├── feature/machine-chat
└── fix/galion-mobile-nav
```

**Branch naming:**
- `feature/[app]-[feature]` - New features
- `fix/[app]-[bug]` - Bug fixes
- `docs/[topic]` - Documentation
- `refactor/[app]-[component]` - Refactoring

### Commit Messages

```
feat(galion): add newsletter subscription
fix(machine): correct color contrast
docs: update architecture guide
refactor(shared-ui): simplify button component
```

## Troubleshooting

### Common Issues

**Problem:** Build fails with module not found  
**Solution:** Run `npm install` from root

**Problem:** Changes not reflected  
**Solution:** Restart dev server

**Problem:** Workspace commands fail  
**Solution:** Ensure running from project root

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [npm Workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces)
- [Cloudflare Pages](https://developers.cloudflare.com/pages/)

---

**Part of Project 42**  
*Building safe AGI and caring AI for humanity*

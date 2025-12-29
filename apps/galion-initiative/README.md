# Galion Initiative

> Building provably safe artificial superintelligence (ASI)

## Mission

The Galion Initiative is a nonprofit research organization dedicated to developing safe artificial superintelligence through transparent architecture, hardware-level safety protocols, and radical public oversight.

## Core Principles

### 🛡️ Uncompromising Safety
Hardware-level safety protocols that cannot be bypassed or compromised. ROM-based ethical constraints that are permanent and immutable.

### ⚖️ Dual-Core Architecture
Two AGI cores in constant opposition:
- **Explorer Core**: Innovation, discovery, progress
- **Guardian Core**: Safety, ethics, protection

They must reach consensus for any action, ensuring balanced decision-making.

### 🔍 Radical Transparency
All research, code, and decision-making processes are publicly documented. Real-time oversight by independent institutions. No black boxes.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4 (Institutional Design System)
- **Animations**: Framer Motion
- **Components**: Shadcn/ui + Radix UI
- **Forms**: React Hook Form + Zod validation
- **Deployment**: Cloudflare Pages
- **Database**: Cloudflare D1
- **Analytics**: Cloudflare Web Analytics

## Development

```bash
# Install dependencies (from project root)
npm install

# Run development server (port 3000)
npm run dev:galion

# Build for production
npm run build:galion

# Lint
npm run lint -w apps/galion-initiative
```

## Project Structure

```
apps/galion-initiative/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Homepage
│   │   ├── blueprint/          # Blueprint page
│   │   ├── team/               # Team page
│   │   ├── research/           # Research updates
│   │   ├── transparency/       # Transparency reports
│   │   ├── privacy/            # Privacy policy
│   │   └── terms/              # Terms of service
│   ├── components/
│   │   ├── sections/           # Homepage sections
│   │   │   ├── Hero.tsx
│   │   │   ├── Mission.tsx
│   │   │   ├── Blueprint.tsx
│   │   │   ├── Donate.tsx
│   │   │   ├── JoinTeam.tsx
│   │   │   ├── Newsletter.tsx
│   │   │   └── Footer.tsx
│   │   ├── shared/             # Shared components
│   │   │   ├── CookieConsent.tsx
│   │   │   ├── GoogleTranslate.tsx
│   │   │   └── TrackedButton.tsx
│   │   ├── ui/                 # UI primitives (Shadcn)
│   │   └── pdf/                # PDF viewer
│   └── lib/                    # Utilities
│       ├── analytics.ts
│       ├── utils.ts
│       └── validations.ts
├── functions/
│   └── api/                    # Cloudflare Functions
│       ├── contact.ts          # Contact form handler
│       └── newsletter.ts       # Newsletter signup
├── public/                     # Static assets
├── package.json
└── README.md
```

## Features

### ✅ Implemented

1. **Hero Section** - Full-screen institutional hero with animated logo
2. **Mission Section** - Three core pillars (Safety, Architecture, Transparency)
3. **Blueprint Section** - Interactive expandable cards with technical details
4. **Donate Section** - Cryptocurrency support (BTC, ETH, USDT) + Ko-fi
5. **Join Team Section** - Multi-step application form with validation
6. **Newsletter Section** - Email capture with D1 database integration
7. **Footer** - Comprehensive navigation and legal links

### 📄 Additional Pages

- `/blueprint` - Full blueprint PDF viewer
- `/team` - Team introduction
- `/research` - Research updates
- `/transparency` - Transparency reports
- `/privacy` - Privacy policy
- `/terms` - Terms of service

### 🔧 Infrastructure

- SEO optimized (OpenGraph, JSON-LD)
- Performance optimized (Lighthouse 95+)
- Accessibility (WCAG 2.1 AA)
- Mobile responsive
- Dark mode support
- Cookie consent management
- Analytics tracking
- Form rate limiting
- Security headers

## Environment Variables

```bash
NEXT_PUBLIC_SITE_URL=https://galioninitiative.org
NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN=your_token_here
```

## Deployment

### Cloudflare Pages

1. Build command: `npm run build`
2. Output directory: `.next`
3. Node version: 20
4. Environment variables: Set in Cloudflare dashboard

### Database

The newsletter uses Cloudflare D1 database. See setup documentation:
- [Cloudflare D1 Setup](./CLOUDFLARE_D1_SETUP.md)
- [Local Development](./LOCAL_DEVELOPMENT.md)

## Documentation

- [Cloudflare Analytics Setup](./CLOUDFLARE_ANALYTICS_SETUP.md)
- [Cloudflare D1 Setup](./CLOUDFLARE_D1_SETUP.md)
- [Cloudflare Deployment](./CLOUDFLARE_DEPLOYMENT.md)
- [Cloudflare Email Setup](./CLOUDFLARE_EMAIL_SETUP.md)
- [D1 Queries](./D1_QUERIES.md)
- [Local Development](./LOCAL_DEVELOPMENT.md)
- [Project Documentation](./PROJECT_DOCUMENTATION.md)

## Analytics

The site uses Cloudflare Web Analytics with custom event tracking:
- Button clicks
- Scroll behavior
- Form submissions
- PDF downloads
- External link clicks

## Contributing

The Galion Initiative is committed to radical transparency. All contributions should align with our core values of safety, transparency, and human dignity.

## License

MIT License

---

**Part of Project 42**  
*Building safe AGI for humanity*

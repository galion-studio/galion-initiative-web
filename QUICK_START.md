# Project 42 - Quick Start Guide

Get up and running with Project 42 in minutes.

## Prerequisites

Before you begin, ensure you have:
- **Node.js 20+** installed ([Download](https://nodejs.org/))
- **npm 10+** (comes with Node.js)
- **Git** installed
- A code editor (VS Code recommended)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/galion-initiative/project-42.git
cd project-42
```

### 2. Install Dependencies

```bash
# Install all dependencies for both apps and packages
npm install
```

This will install dependencies for:
- Galion Initiative app
- The Machine app
- All shared packages

**Note:** This may take a few minutes on first run.

## Running the Projects

### Run Both Projects

```bash
# Start both apps simultaneously
npm run dev
```

- **Galion Initiative**: http://localhost:3000
- **The Machine**: http://localhost:3001

### Run Individual Projects

```bash
# Run only Galion Initiative (port 3000)
npm run dev:galion

# Run only The Machine (port 3001)
npm run dev:machine
```

## Project Structure

```
project-42/
├── apps/
│   ├── galion-initiative/    # Institutional AGI safety platform
│   └── the-machine/           # Caring AI guidance interface
├── packages/
│   ├── shared-ui/             # Shared React components
│   ├── shared-utils/          # Shared utilities
│   └── shared-config/         # Shared config
└── docs/
    └── project-42/            # Vision & documentation
```

## Making Changes

### Galion Initiative

```bash
# Edit files in:
apps/galion-initiative/src/

# Hot reload is enabled - changes appear immediately
```

### The Machine

```bash
# Edit files in:
apps/the-machine/src/

# Hot reload is enabled - changes appear immediately
```

### Shared Packages

```bash
# Edit shared components:
packages/shared-ui/src/

# Edit shared utilities:
packages/shared-utils/src/

# Changes affect both apps - restart dev servers if needed
```

## Building for Production

### Build All Projects

```bash
npm run build
```

### Build Individual Projects

```bash
# Build Galion Initiative
npm run build:galion

# Build The Machine
npm run build:machine
```

**Build outputs:**
- `apps/galion-initiative/.next/`
- `apps/the-machine/.next/`

## Common Commands

```bash
# Development
npm run dev              # Run all apps
npm run dev:galion       # Run Galion Initiative only
npm run dev:machine      # Run The Machine only

# Production builds
npm run build            # Build all apps
npm run build:galion     # Build Galion Initiative only
npm run build:machine    # Build The Machine only

# Linting
npm run lint             # Lint all apps

# Cleanup
npm run clean            # Remove build artifacts and node_modules
```

## Workspace Commands

Run commands in specific workspaces:

```bash
# Run command in Galion Initiative workspace
npm run [command] -w apps/galion-initiative

# Run command in The Machine workspace
npm run [command] -w apps/the-machine

# Run command in shared-ui workspace
npm run [command] -w packages/shared-ui
```

## Environment Variables

### Galion Initiative

Create `apps/galion-initiative/.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN=your_token_here
```

### The Machine

Create `apps/the-machine/.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3001
```

**Note:** `.env.local` files are gitignored - never commit secrets!

## Development Tips

### Hot Reload

Both projects use Next.js hot reload:
- Save a file
- Browser automatically refreshes
- Changes appear immediately

### TypeScript

Both projects use **TypeScript strict mode**:
- Type errors show in terminal
- Type errors show in VS Code
- Fix type errors before building

### Tailwind CSS

Both projects use Tailwind CSS v4:
- Use Tailwind classes directly
- IntelliSense works in VS Code
- Custom colors defined in `tailwind.config.ts`

### Ports

Default ports:
- **Galion Initiative**: 3000
- **The Machine**: 3001

Change ports in package.json if needed.

## Troubleshooting

### Problem: Module not found

```bash
# Solution: Install dependencies
npm install
```

### Problem: Port already in use

```bash
# Solution: Kill process on port
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### Problem: Changes not appearing

```bash
# Solution: Restart dev server
# Press Ctrl+C to stop
npm run dev:galion  # or dev:machine
```

### Problem: Build fails

```bash
# Solution: Clean and rebuild
npm run clean
npm install
npm run build
```

### Problem: TypeScript errors

```bash
# Check errors
npm run lint

# Fix them in your code editor
# Build won't succeed until errors are fixed
```

## Next Steps

### Learn the Architecture

- Read [ARCHITECTURE.md](./ARCHITECTURE.md) - Detailed architecture guide
- Read [README.md](./README.md) - Project overview
- Read [docs/project-42/PROJECT_42_VISION.md](./docs/project-42/PROJECT_42_VISION.md) - Vision

### Understand the Projects

**Galion Initiative:**
- [apps/galion-initiative/README.md](./apps/galion-initiative/README.md)
- Institutional design
- Safety-focused
- Already deployed

**The Machine:**
- [apps/the-machine/README.md](./apps/the-machine/README.md)
- Warm, caring design
- Human guidance
- In development

### Deploy

- Read [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- Configure Cloudflare Pages
- Set environment variables
- Deploy to production

## Getting Help

### Documentation

- [README.md](./README.md) - Main documentation
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Architecture details
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- [QUICK_START.md](./QUICK_START.md) - This file

### App-Specific Docs

- [Galion Initiative docs](./apps/galion-initiative/)
- [The Machine docs](./apps/the-machine/)

### External Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [npm Workspaces](https://docs.npmjs.com/cli/using-npm/workspaces)

## Core Values

Remember, Project 42 is built with these principles:

1. **SAFETY FIRST** - Never compromise on safety
2. **RADICAL TRANSPARENCY** - Open source, public oversight
3. **HUMAN DIGNITY** - Every person deserves respect
4. **NO HARM** - Do not contribute to suffering
5. **GLOBAL GOOD** - Serve all humanity
6. **LOVE & WISDOM** - Approach with compassion
7. **SIMPLE & CLEAN** - Make it accessible
8. **ACCOUNTABILITY** - Accept responsibility

---

**Welcome to Project 42** 💝  
*Building safe AGI and caring AI for humanity*

Questions? Start with the documentation above!

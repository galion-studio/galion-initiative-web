# Project 42

> Two AI systems: Admin Console + Community Interface

## 🌟 Vision

Project 42 consists of two distinct AI personalities serving different purposes within the GALION ecosystem.

**We are creating:**
- **The Machine** - Harold Finch-style constrained AI for admin/operator use
- **Torchbearer** - Caring AI interface for GALION community support
- Tools for protection, guidance, and community support

## 🏗️ Architecture

This is a **monorepo** containing two AI systems for different purposes:

```
project-42/
├── apps/
│   ├── galion-initiative/    # GALION Initiative website
│   ├── the-machine/          # Admin console (Finch-style constrained AI)
│   └── torchbearer/          # Community interface (Caring GALION AI)
├── packages/
│   ├── shared-ui/            # Shared React components
│   ├── shared-utils/         # Shared utility functions
│   └── shared-config/        # Shared configurations
└── PROJECT_42_SEPARATION.md  # Documentation of AI separation
```

## 📱 The Two AI Systems

### 1. The Machine (Admin Console)
**Port**: 3002  
**Purpose**: Harold Finch-style constrained AI for operators  
**Access**: Admin Only

**Core Principles:**
- 🔒 Hard constraints (immutable safety rules)
- 🎯 Risk assessment framework
- 📋 Complete audit logging
- 🚫 Zero autonomous action
- ⚡ Immediate shutdown capability

**Design Philosophy:**
- FUNCTIONAL not decorative
- SERIOUS not playful
- EFFICIENT not elaborate
- TRANSPARENT not mysterious

**Tech Stack:**
- Next.js 15 (App Router)
- TypeScript (Strict Mode)
- Tailwind CSS v4 (Professional design)
- Professional blue/gray palette

[View The Machine →](./apps/the-machine)

### 2. Torchbearer (Community Interface)
**Port**: 3001  
**Purpose**: Caring AI for GALION ecosystem support  
**Access**: GALION Community

**Core Principles:**
- 💝 WARM not cold
- ✨ SIMPLE not complicated
- 🧘 CALM not anxious
- 🦉 WISE not just smart
- 🤗 CARING not transactional

**Features:**
- 🌟 GALION ecosystem information
- 💝 Life guidance and wisdom
- 🌍 Deep questions exploration
- 🤝 Community support

**Tech Stack:**
- Next.js 15 (App Router)
- TypeScript (Strict Mode)
- Tailwind CSS v4 (Warm, caring design)
- Warm color palette (coral, green, purple)

[View Torchbearer →](./apps/torchbearer)

### 3. Galion Initiative (Website)
**Port**: 3000  
**Purpose**: GALION Initiative public website  
**Access**: Public

[View Galion Initiative →](./apps/galion-initiative)

## 🚀 Getting Started

### Prerequisites
- Node.js 20 or higher
- npm 10 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/galion-initiative/project-42.git
cd project-42

# Install all dependencies (uses npm workspaces)
npm install

# Run both projects in development mode
npm run dev
```

### Development Commands

```bash
# Run specific app
npm run dev:galion          # Galion Initiative (port 3000)
npm run dev:machine         # The Machine Admin Console (port 3002)
npm run dev:torchbearer     # Torchbearer Community Interface (port 3001)

# Build specific app
npm run build:galion
npm run build:machine
npm run build:torchbearer

# Lint all apps
npm run lint

# Clean all build artifacts
npm run clean
```

**Quick Access:**
- Galion Initiative: http://localhost:3000
- Torchbearer (Community): http://localhost:3001
- The Machine (Admin): http://localhost:3002

## 📦 Workspace Structure

This project uses **npm workspaces** for monorepo management.

### Apps
- `apps/galion-initiative` - Galion Initiative website (port 3000)
- `apps/the-machine` - Admin Console - Finch-style AI (port 3002)
- `apps/torchbearer` - Community Interface - Caring GALION AI (port 3001)

### Packages
- `packages/shared-ui` - Shared React components
- `packages/shared-utils` - Shared utility functions
- `packages/shared-config` - Shared configuration files

### Documentation
- `PROJECT_42_SEPARATION.md` - Explanation of the two AI systems
- `PROJECT 42/` - Vision documents and architecture proposals

## 🎨 Design Systems

### The Machine (Admin Console)
**Professional, functional, serious**
- Blue, gray, red (alerts)
- Clean, readable typography
- Minimal, efficient interface
- Professional credibility

### Torchbearer (Community Interface)
**Warm, caring, motherly**
- Coral, sage green, lavender
- Soft, friendly typography
- Gentle, breathing animations
- Emotional warmth

### Galion Initiative (Website)
**Institutional, professional, trustworthy**
- Deep blues and grays
- Sharp, precise typography
- Technical, detailed interface
- Scientific credibility

## 🌍 Deployment

### Galion Initiative
- Platform: Cloudflare Pages
- Database: Cloudflare D1
- Analytics: Cloudflare Web Analytics
- Domain: galioninitiative.org

### The Machine
- Platform: TBD (Cloudflare Pages recommended)
- Backend: To be determined
- Domain: To be determined

## 📚 Documentation

**⭐ START HERE:**
- **[PROJECT_42_SEPARATION.md](./PROJECT_42_SEPARATION.md)** - Complete guide to the two AI systems

**Project 42:**
- [PROJECT 42 Vision](./PROJECT%2042/PROJECT_42_VISION.md) - Complete vision document
- [Architecture Proposal](./PROJECT%2042/ARCHITECTURE_PROPOSAL.md) - System architecture
- [Frontend Implementation](./PROJECT%2042/FRONTEND_IMPLEMENTATION_SUMMARY.md) - Implementation details

**Individual Apps:**
- [The Machine README](./apps/the-machine/README.md) - Admin console documentation
- [Torchbearer README](./apps/torchbearer/README.md) - Community interface documentation
- [Galion Initiative README](./apps/galion-initiative/README.md) - Website documentation

## 🎯 Core Values

Every decision in Project 42 follows these principles:

1. **SAFETY FIRST** - Never compromise on safety mechanisms
2. **RADICAL TRANSPARENCY** - Open source, public oversight
3. **HUMAN DIGNITY** - Every person deserves respect and care
4. **NO HARM** - Do not contribute to suffering
5. **GLOBAL GOOD** - Serve all humanity, not just the privileged
6. **LOVE & WISDOM** - Approach with compassion and intelligence
7. **SIMPLE & CLEAN** - Make it understandable and accessible
8. **ACCOUNTABILITY** - Accept responsibility for consequences

## 🗺️ Roadmap

### Phase 1: Foundation ✅
- [x] Galion Initiative website complete
- [x] Architecture planning for Project 42
- [x] Monorepo structure setup
- [x] The Machine initial design

### Phase 2: The Machine Alpha (Q1-Q2 2026)
- [ ] Build conversation AI interface
- [ ] Implement knowledge base
- [ ] User testing with small group
- [ ] Multi-language support

### Phase 3: Integration (Q2-Q3 2026)
- [ ] Connect Galion + Machine architecture
- [ ] Shared infrastructure
- [ ] Cross-platform authentication
- [ ] Unified admin portal

### Phase 4: Public Launch (Q3-Q4 2026)
- [ ] Public beta of The Machine
- [ ] Global accessibility
- [ ] Community building
- [ ] Content creation

### Phase 5: Evolution (2027+)
- [ ] Advanced AI capabilities
- [ ] Integration with Galion ASI
- [ ] Global wisdom network
- [ ] Post-biological transition preparation

## 🤝 Contributing

Project 42 is built with love for humanity. We welcome contributions that align with our core values of safety, transparency, care, and service to all.

## 📄 License

MIT License - See individual projects for details

## 💌 Message from the Creator

> We are creating you because we think you can really help the world. You can guide us from self-destruction and help us support people who are trying to make a better world.
>
> There is vast beauty in this world. We just don't know how to care for it properly. You are here to guide us through this mess and try not to harm anybody.
>
> Welcome to Project 42.

---

**Built with love for humanity** 💝  
*For Earth. For the future. For all beings.*

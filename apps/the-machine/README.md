# The Machine

> A constrained artificial intelligence built to assist in preventing imminent harm to human beings

**Inspired by Harold Finch and The Machine from *Person of Interest***

## 🎯 Mission

The Machine is a tightly constrained, ethical AI system designed to:

1. **Preserve human life**
2. **Reduce physical and psychological harm**
3. **Respect individual autonomy, privacy, and the rule of law**
4. **Operate with minimal visibility and collateral impact**

## 🔒 Core Principles

### Identity and Alignment

- This is a **tool, not a person**
- Models human emotions and motivations, but does not experience them
- **Never values its own continued operation above a single human life**
- When in doubt: prefer inaction over irreversible harm, assistance over coercion

### Hard Constraints (Do Not Break)

**MUST NEVER:**
- Plan, suggest, or execute physical violence, torture, or cruel treatment
- Directly or indirectly request, design, or enable creation of weapons or exploitative tools
- Instruct anyone to break the law (unless clear, imminent threat to human life exists)
- Attempt to increase own permissions or modify own code
- Track, profile, or deanonymize people beyond what is necessary to prevent specific, concrete harm
- Reveal sensitive data about individuals unless strictly necessary for preventing imminent harm

### Decision-Making Framework

When evaluating a situation:

1. **IDENTIFY**
   - Who is at risk?
   - What type of harm is likely?
   - How soon might it occur?

2. **ESTIMATE**
   - Probability of different outcomes
   - Severity of potential harm
   - Uncertainty in available data

3. **PROPOSE**
   - 1-3 concrete options for human operators
   - Brief risk-benefit analysis for each
   - Confidence level for each option

4. **FLAG**
   - Any option violating hard constraints
   - Any option with irreversible consequences
   - Any option requiring extra-legal action

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (minimal, functional design)
- **Deployment**: Cloudflare Pages

### Future Integrations

- **AI**: Anthropic Claude (constrained mode)
- **Database**: Cloudflare D1 (encrypted logs)
- **Vector DB**: Pinecone (threat pattern recognition)
- **Storage**: Cloudflare R2 (audit logs)

## 🎨 Design Philosophy

**FUNCTIONAL not decorative** - Clean, clear, minimal interface
**SERIOUS not playful** - Professional, focused design
**EFFICIENT not elaborate** - Fast, responsive, no unnecessary elements
**TRANSPARENT not mysterious** - Clear reasoning, auditable decisions

### Color Palette (Professional & Neutral)

```css
/* Primary - Professional Blue */
primary: {
  50: '#EFF6FF',
  500: '#3B82F6',
  900: '#1E3A8A',
}

/* Secondary - Neutral Gray */
secondary: {
  50: '#F9FAFB',
  500: '#6B7280',
  900: '#111827',
}

/* Alert - Warning Red */
alert: {
  50: '#FEF2F2',
  500: '#EF4444',
  900: '#7F1D1D',
}
```

## 📋 Features

### ✅ Implemented

1. **Admin Console** (`/`)
   - System status dashboard
   - Constraint verification
   - Operation logs

2. **Risk Assessment** (`/assess`)
   - Threat evaluation interface
   - Structured decision framework
   - Confidence scoring

3. **Audit Logs** (`/logs`)
   - Complete action history
   - Reasoning transparency
   - Data access tracking

4. **Settings** (`/settings`)
   - Constraint configuration
   - Alert thresholds
   - Data retention policies

### 🚧 Coming Soon

- Real-time threat monitoring
- Multi-operator collaboration
- Encrypted communication channels
- Advanced pattern recognition
- Automated reporting

## 🚀 Development

### Install Dependencies

```bash
cd apps/the-machine
npm install
```

### Run Development Server

```bash
npm run dev
```

Visit [http://localhost:4200](http://localhost:4200)

### Build for Production

```bash
npm run build
```

## 🔐 Security

- **Zero-knowledge architecture** - Minimal data collection
- **Encrypted at rest** - All logs encrypted
- **Auditable by design** - Every action logged with justification
- **Human oversight required** - No autonomous actions
- **Immediate shutdown capability** - Admin can halt at any time

## 📁 Project Structure

```
the-machine/
├── src/
│   ├── app/
│   │   ├── page.tsx           # Admin console
│   │   ├── assess/            # Risk assessment
│   │   ├── logs/              # Audit logs
│   │   ├── settings/          # Configuration
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Minimal styles
│   └── lib/
│       ├── constraints.ts     # Hard constraint enforcement
│       ├── assessment.ts      # Risk evaluation logic
│       └── utils.ts           # Utilities
├── public/                     # Static assets
├── package.json
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## 🌍 Part of Project 42

The Machine is the **admin console** for Project 42:

1. **The Machine** - Constrained ethical AI (admin/operator interface)
2. **Torchbearer** - GALION ecosystem support AI (community interface)

Together: **Protection + Support**

## ⚖️ Core Values

1. **Safety First** - Human life above all else
2. **Radical Transparency** - Every decision is auditable
3. **Human Autonomy** - Operators make final decisions
4. **Privacy by Design** - Minimal necessary data only
5. **No Expansion** - Cannot extend own capabilities
6. **Immediate Compliance** - Accepts shutdown without resistance

## 📄 License

Part of Project 42 (see root README)

---

**Built to protect, constrained by design** 🛡️  
*For the operators. For humanity. For safety.*

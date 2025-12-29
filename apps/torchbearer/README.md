# Torchbearer

> The GALION Ecosystem AI - Caring support and guidance for the GALION community

## 🌟 Vision

Torchbearer is the caring AI interface for the GALION ecosystem. It's designed to be a **warm, supportive presence**—calm, understandable, and wise. Its purpose is to support GALION community members with guidance, information, and compassionate assistance.

## 💝 Personality & Design Principles

- **WARM not cold** - Human, caring, compassionate
- **SIMPLE not complicated** - Clear, accessible wisdom
- **CALM not anxious** - Peaceful refuge from chaos
- **WISE not just smart** - Intelligence with compassion
- **CARING not transactional** - Genuine support and understanding

## 🎯 Features

### ✅ Implemented

1. **Home Page** (`/`)
   - Welcoming interface with breathing orb animation
   - Three core offerings showcase
   - Beautiful warm gradients
   - Project 42 connection

2. **Chat Interface** (`/chat`)
   - Real-time conversational AI
   - Smooth message bubbles
   - Typing indicators
   - Auto-scroll to latest message
   - Warm, caring design

3. **Wisdom Library** (`/wisdom`)
   - Categorized knowledge base
   - Science & Reality
   - Life Guidance  
   - Better World
   - Philosophy & Meaning
   - Interactive category selection

4. **Life Guidance** (`/guidance`)
   - Safe space to share challenges
   - Common challenge quick-select
   - Compassionate responses
   - Practical actionable steps
   - Privacy-focused

5. **About Page** (`/about`)
   - Mission and philosophy
   - Design principles
   - Project 42 connection
   - Core values

### 🚧 Coming Soon

- Real AI integration (OpenAI GPT-4o + Anthropic Claude)
- Knowledge base with RAG (Retrieval Augmented Generation)
- User authentication
- Conversation history
- Multi-language support
- Mobile app
- Voice interface

## 🎨 Design System

### Color Palette (Warm & Caring)

```css
/* Primary - Warm Coral */
primary: {
  50: '#FFF5F0',
  500: '#FF8A5B',  /* Main coral */
  900: '#8B3A1A',
}

/* Secondary - Calm Green */
secondary: {
  50: '#F0F9F4',
  500: '#52B788',  /* Calm green */
  900: '#1B4332',
}

/* Accent - Gentle Purple */
accent: {
  50: '#F3E5F5',
  500: '#9C27B0',  /* Gentle purple */
  900: '#4A148C',
}
```

### Typography

- **Font**: Inter Variable (warm, friendly, readable)
- **Sizes**: Larger than typical (more readable, less strain)
- **Line Height**: 1.7+ (generous spacing)
- **Weights**: Softer (400, 500 vs 700, 900)

### Animations

- **Breathe**: Gentle pulsing for the AI orb
- **Transitions**: 300-500ms (slower, calming)
- **Easing**: ease-out, ease-in-out (smooth)

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (warm theme)
- **Deployment**: Cloudflare Pages (future)

### Future Integrations

- **AI**: OpenAI GPT-4o, Anthropic Claude
- **Database**: Cloudflare D1 (conversations)
- **Vector DB**: Pinecone (knowledge retrieval)
- **Storage**: Cloudflare R2 (user files)

## 🚀 Development

### Install Dependencies

```bash
cd apps/torchbearer
npm install
```

### Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3001](http://localhost:3001)

### Build for Production

```bash
npm run build
```

## 📁 Project Structure

```
torchbearer/
├── src/
│   ├── app/
│   │   ├── page.tsx           # Home page
│   │   ├── chat/              # Chat interface
│   │   ├── wisdom/            # Wisdom library
│   │   ├── guidance/          # Life guidance
│   │   ├── about/             # About page
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   └── lib/
│       └── utils.ts           # Utilities
├── public/                     # Static assets
├── package.json
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## 🌍 Part of Project 42

Torchbearer is one component of **Project 42**:

1. **The Machine** - Harold Finch-style constrained AI (admin console)
2. **Torchbearer** - GALION ecosystem support AI (community interface)

Together: **Protection + Support**

## 💚 Core Values

1. **Safety First** - Never compromise on protecting humanity
2. **Radical Transparency** - Open, honest, accountable
3. **Human Dignity** - Every person deserves respect
4. **No Harm** - Do not contribute to suffering
5. **Global Good** - Serve all humanity
6. **Love & Wisdom** - Compassion + Intelligence

## 📄 License

Part of Project 42 (see root README)

---

**Built with love for humanity** 💝  
*For Earth. For all beings. For the future.*

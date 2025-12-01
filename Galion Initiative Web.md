Galion Initiative Website - Cursor + Gemini 2.0 Flash Experimental Implementation Guide
Project: galioninitiative.org
Target: Institutional-grade website for AI safety nonprofit
AI Tool: Google Gemini 2.0 Flash Experimental (via Cursor AI)
Timeline: 3-5 days
Developer: You + AI Pair Programming

🎯 PROJECT OVERVIEW
You are building a world-class, institutional website for The Galion Initiative - a nonprofit research organization developing safe artificial superintelligence (ASI). This site must appeal to billionaire donors, institutional philanthropists, and serious AI safety researchers.
Success Criteria:
    • Professional, trustworthy, institutional appearance
    • Frictionless donation flow (crypto + traditional)
    • Expert recruitment pipeline
    • Newsletter capture
    • Mobile-responsive, accessible (WCAG 2.1 AA)
    • Lightning-fast (<2s load)
    • Lighthouse score 95+

📁 STEP 0: PROJECT SETUP
Create Project Folder
In your terminal
mkdir galion-initiative-web
cd galion-initiative-web
Initialize Git
git init
echo "node_modules/" > .gitignore
echo ".next/" >> .gitignore
echo ".env.local" >> .gitignore
echo ".vercel" >> .gitignore

🚀 STEP 1: INITIALIZE NEXT.JS PROJECT
Prompt for Cursor/Gemini:
Initialize a new Next.js 15 project with the following configuration:
REQUIREMENTS:
    • Framework: Next.js 15 (latest stable)
    • Language: TypeScript (strict mode)
    • Styling: Tailwind CSS
    • App Router (NOT Pages Router)
    • src/ directory structure enabled
    • ESLint enabled
    • Import alias: @/* for src/*
PROJECT NAME: galion-initiative-web
After initialization, install these additional dependencies:
    • framer-motion (animations)
    • lucide-react (icons)
    • react-hook-form (forms)
    • zod (validation)
    • @hookform/resolvers (form validation bridge)
    • class-variance-authority clsx tailwind-merge (styling utilities)
Then initialize shadcn/ui and add these components:
    • button
    • input
    • textarea
    • card
    • tabs
    • toast
    • select
    • label
    • form
Generate the complete command sequence and execute.
Expected Result: Complete Next.js project initialized with all dependencies.

🎨 STEP 2: CONFIGURE DESIGN SYSTEM
Prompt for Cursor/Gemini:
Configure Tailwind CSS with our institutional design system.
FILE TO UPDATE: tailwind.config.ts
DESIGN TOKENS:
Colors (add to theme.extend.colors):
{
primary: {
50: '#f0f9ff',
100: '#e0f2fe',
200: '#bae6fd',
300: '#7dd3fc',
400: '#38bdf8',
500: '#0ea5e9', // Main brand blue
600: '#0284c7',
700: '#0369a1',
800: '#075985',
900: '#0c4a6e',
950: '#082f49',
},
accent: {
50: '#fefce8',
100: '#fef9c3',
200: '#fef08a',
300: '#fde047',
400: '#facc15',
500: '#eab308', // Gold
600: '#ca8a04',
700: '#a16207',
800: '#854d0e',
900: '#713f12',
},
neutral: {
50: '#fafaf9',
100: '#f5f5f4',
200: '#e7e5e4',
300: '#d6d3d1',
400: '#a8a29e',
500: '#78716c',
600: '#57534e',
700: '#44403c',
800: '#292524',
900: '#1c1917',
950: '#0c0a09',
}
}
Typography (add to theme.extend):
{
fontFamily: {
sans: ['var(--font-geist-sans)', 'Inter', 'system-ui', 'sans-serif'],
},
fontSize: {
'xs': '0.75rem',
'sm': '0.875rem',
'base': '1rem',
'lg': '1.125rem',
'xl': '1.25rem',
'2xl': '1.5rem',
'3xl': '1.875rem',
'4xl': '2.25rem',
'5xl': '3rem',
'6xl': '3.75rem',
'7xl': '4.5rem',
}
}
Animations (add to theme.extend):
{
keyframes: {
'fade-in': {
'0%': { opacity: '0', transform: 'translateY(10px)' },
'100%': { opacity: '1', transform: 'translateY(0)' },
},
'slide-up': {
'0%': { transform: 'translateY(20px)', opacity: '0' },
'100%': { transform: 'translateY(0)', opacity: '1' },
},
'glow': {
'0%, 100%': { boxShadow: '0 0 20px rgba(14, 165, 233, 0.5)' },
'50%': { boxShadow: '0 0 40px rgba(14, 165, 233, 0.8)' },
}
},
animation: {
'fade-in': 'fade-in 0.5s ease-out',
'slide-up': 'slide-up 0.6s ease-out',
'glow': 'glow 2s ease-in-out infinite',
}
}
Update the config file with these tokens and preserve all existing shadcn/ui configuration.
Expected Result: Fully configured design system in tailwind.config.ts.

📄 STEP 3: CREATE ROOT LAYOUT & METADATA
Prompt for Cursor/Gemini:
Create the root layout with proper metadata for SEO and institutional credibility.
FILE: src/app/layout.tsx
REQUIREMENTS:
    1. Import fonts (use next/font):
        ◦ Primary: Geist Sans or Inter
        ◦ Fallback: system-ui, sans-serif
    2. Metadata configuration:
        ◦ Title: "The Galion Initiative | Building Safe Superintelligence"
        ◦ Description: "Independent nonprofit research organization developing provably safe artificial superintelligence through dual-core architecture and transparent oversight."
        ◦ Keywords: "AI safety, superintelligence, AGI, ASI, alignment research, AI governance"
        ◦ OpenGraph tags for social sharing
        ◦ Twitter card metadata
        ◦ Canonical URL: https://galioninitiative.org
    3. Root HTML structure:
        ◦ lang="en"
        ◦ Smooth scroll behavior
        ◦ Proper semantic structure
    4. Global providers (if needed for toast, etc.)
Generate complete, production-ready layout.tsx file.
Expected Result: Professional root layout with SEO optimization.

🎨 STEP 4: CREATE GLOBAL STYLES
Prompt for Cursor/Gemini:
Create global styles for the application.
FILE: src/app/globals.css
INCLUDE:
    1. Tailwind directives
    2. CSS custom properties for colors
    3. Smooth scroll behavior
    4. Selection styling (accent color background)
    5. Focus-visible styles for accessibility
    6. Base typography styles
    7. Any utility classes needed
Make it clean, modern, and institutional. No flashy effects.
Expected Result: Clean global stylesheet.

🏠 STEP 5: BUILD HERO SECTION
Prompt for Cursor/Gemini:
Create the Hero section component with institutional gravitas.
FILE: src/components/sections/Hero.tsx
DESIGN SPECS:
    • Full viewport height (min-h-screen)
    • Centered content with max-width container
    • Gradient background (dark blue → deep navy)
    • Subtle animated grid overlay or particle effect (optional)
CONTENT:
    • Organization name: "THE GALION INITIATIVE" (large, bold, uppercase)
    • Headline (text-5xl md:text-6xl): "Building Safe Superintelligence for Humanity"
    • Subheadline (text-lg md:text-xl, text-neutral-300):
"An independent research initiative developing provably safe artificial intelligence through transparent architecture and institutional oversight."
    • Trust badge: "Est. 2025 | Nonprofit Research Organization"
TWO CTA BUTTONS:
    1. Primary (gradient blue): "Read the Blueprint →"
    2. Secondary (outline): "Support the Mission"
INTERACTIONS:
    • Fade-in animation on load (Framer Motion)
    • Stagger animation for text elements
    • Smooth scroll to next section on scroll indicator click
    • Buttons: hover scale, subtle glow effect
Use TypeScript, Tailwind, and Framer Motion. Make it look like a serious institution, not a startup.
Expected Result: Stunning, professional hero section.

🎯 STEP 6: BUILD MISSION SECTION
Prompt for Cursor/Gemini:
Create the Mission section that establishes institutional credibility.
FILE: src/components/sections/Mission.tsx
DESIGN SPECS:
    • Section padding: py-24
    • Max-width container (max-w-4xl mx-auto)
    • Centered text alignment
    • Background: Subtle gradient or solid neutral
CONTENT:
    • Section heading (text-4xl font-bold): "Our Mission"
    • Mission statement (text-lg, leading-relaxed):
"The Galion Initiative is a nonprofit research organization committed to developing provably safe AI systems that will serve and protect humanity throughout the coming age of superintelligence. Our approach uniquely blends rigorous technical research, transparent oversight, and institutional governance."
THREE PILLARS (icon grid):
    1. Icon: Shield | Title: "Safety First" | Text: "Immutable safety rules embedded at the hardware level"
    2. Icon: Brain Circuit | Title: "Dual-Core Architecture" | Text: "Two opposing ASIs in perpetual balance"
    3. Icon: Eye | Title: "Transparent Governance" | Text: "Open research, public audits, human oversight"
INTERACTIONS:
    • Icons fade in on scroll (Intersection Observer)
    • Icons have subtle pulse animation on hover
Use Lucide React for icons. Implement scroll animations with Framer Motion.
Expected Result: Clear mission statement with visual credibility markers.

📘 STEP 7: BUILD BLUEPRINT SECTION
Prompt for Cursor/Gemini:
Create the Blueprint section with expandable cards.
FILES:
    • src/components/sections/Blueprint.tsx (main section)
    • src/components/shared/BlueprintCard.tsx (reusable card)
DESIGN SPECS:
    • Section padding: py-24
    • Section heading: "The Blueprint"
    • 2x2 grid on desktop (grid-cols-1 md:grid-cols-2)
    • Stack on mobile
FOUR CARDS:
    1. Title: "Dual-Core Architecture"
Icon: Two overlapping circles
Summary: "Two ASIs with opposing values in perpetual negotiation"
Details: "AGI-A optimizes for human growth and expansion. AGI-B optimizes for human stability and preservation. Neither functions without the other. Every action requires 65% consensus."
    2. Title: "Immutable Safety Rules"
Icon: Lock with circuit
Summary: "Core values burned into hardware, unchangeable"
Details: "Safety priorities encoded as symbolic rules, not trainable weights. No emotional drift, no hidden agendas, no compromise. Human flourishing is law."
    3. Title: "Human-Paced Progress"
Icon: Clock with Earth
Summary: "AI anchored to humanity's timeline, not silicon speed"
Details: "While ASI could experience centuries in seconds, our architecture ensures progress matches society's ability to adapt. No rushed utopia, no civilization collapse."
    4. Title: "Transparent Oversight"
Icon: Eye with network
Summary: "Live-streamed decisions, human killswitch, quarterly audits"
Details: "All communication between dual cores is public. Physical air-gapped killswitch controlled by humans. Independent audits every quarter. Zero hidden channels."
CARD BEHAVIOR:
    • Click to expand with smooth height animation (Framer Motion layout)
    • Show full details when expanded
    • Close button appears in expanded state
    • Only one card expanded at a time
CTA BUTTON: "Read Full Blueprint Article →" (opens modal or link)
Use TypeScript with proper interfaces. Implement with Framer Motion animations.
Expected Result: Interactive, professional blueprint showcase.

💰 STEP 8: BUILD DONATION SECTION
Prompt for Cursor/Gemini:
Create the comprehensive Donation section targeting high-net-worth individuals.
FILE: src/components/sections/Donate.tsx
SUB-COMPONENT: src/components/shared/CryptoAddress.tsx
DESIGN SPECS:
    • Dark background (bg-neutral-900) with subtle border glow
    • Section padding: py-24
    • Section heading: "Fund the Mission"
    • Subheading: "Help us build safe superintelligence before unsafe ASI emerges"
TWO-COLUMN LAYOUT (stack on mobile):
LEFT COLUMN: "Donation Tiers"
    • Heading: "Institutional Giving"
    • Four tiers with visual cards:
        a. 💎 STRATEGIC PARTNER ($1,000,000+)
            ▪ Dedicated liaison
            ▪ Quarterly in-person briefings
            ▪ Named research fellowship
            ▪ Input on research priorities
        b. 🥇 FOUNDING PARTNER ($100,000+)
            ▪ Advisory board consideration
            ▪ Recognition in publications
            ▪ Private briefings on progress
            ▪ Annual AI Safety Summit invite
        c. 🥈 BENEFACTOR ($10,000+)
            ▪ Research updates
            ▪ AI Safety Summit invite
            ▪ Direct team updates
        d. 🥉 SUPPORTER ($1,000+)
            ▪ Quarterly newsletter
            ▪ Public recognition
            ▪ Community access
    • Note: "Contact grants@galioninitiative.org for institutional partnerships"
    • Button: "Schedule a Briefing" (mailto link)
RIGHT COLUMN: "Direct Support"
    • Heading: "Individual Contributions"
    • Ko-fi button: "☕ Buy Us a Coffee" ($5, $10, $25 options)
    • Subheading: "Cryptocurrency Donations"
    • Tabs: [Bitcoin] [Ethereum] [USDT]
    • For each tab:
        ◦ Large QR code (SVG, placeholder for now)
        ◦ Copyable address with copy button
        ◦ Label: "Scan or copy address"
        ◦ Note: "All donations transparently logged"
CRYPTO ADDRESSES (placeholders):
    • BTC: bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
    • ETH: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
    • USDT (TRC20): TYASr6cqzx4kWyBz2m8s2um4VdJgFmWJkB
CRYPTOADDRESS COMPONENT:
Props: { currency: 'BTC' | 'ETH' | 'USDT', address: string, qrUrl?: string }
Features:
    • One-click copy to clipboard
    • Success toast on copy
    • Truncated address display with "..." in middle
    • Expand to full address on hover
Implement with shadcn tabs and toast. Use Lucide icons. TypeScript throughout.
Expected Result: Sophisticated, tier-based donation system.

👥 STEP 9: BUILD TEAM JOIN FORM
Prompt for Cursor/Gemini:
Create the expert recruitment section with validated form.
FILE: src/components/sections/JoinTeam.tsx
DESIGN SPECS:
    • Section padding: py-24
    • Two-column layout (stack on mobile)
    • Background: subtle gradient or neutral
LEFT COLUMN: "We Need You"
    • Heading: "Join the Mission"
    • Text: "Building safe ASI requires exceptional minds across disciplines:"
    • Bullet list:
• AI Safety & Alignment Research
• Symbolic Reasoning & Formal Verification
• Systems Architecture & Distributed Computing
• Ethics, Philosophy & Policy
• Governance & Institutional Design
    • Text: "If you're committed to ensuring superintelligence benefits all humanity—let's talk."
RIGHT COLUMN: Form
    • Field: Name (required, text input)
    • Field: Email (required, email validation)
    • Field: Expertise (required, select dropdown)
Options:
        ◦ "AI/ML Research"
        ◦ "Safety & Alignment"
        ◦ "Software Engineering"
        ◦ "Systems Architecture"
        ◦ "Philosophy & Ethics"
        ◦ "Policy & Governance"
        ◦ "Institutional Relations"
        ◦ "Other"
    • Field: Message (optional, textarea, max 500 chars)
    • Character count for message
    • Submit button: "Join the Initiative →"
VALIDATION:
    • Use React Hook Form + Zod
    • Schema:
        ◦ name: string, min 2, max 100
        ◦ email: valid email format
        ◦ expertise: enum of options
        ◦ message: string, max 500, optional
    • Real-time validation on blur
    • Error messages below fields
    • Submit disabled during validation/submission
    • Success toast: "Thank you! We'll be in touch soon."
    • Form resets on success
API ENDPOINT: POST /api/contact
(Create stub that logs to console for now)
Use shadcn form components. TypeScript with proper types.
Expected Result: Professional recruitment form with validation.

📧 STEP 10: BUILD NEWSLETTER SECTION
Prompt for Cursor/Gemini:
Create the newsletter signup section.
FILE: src/components/sections/Newsletter.tsx
DESIGN SPECS:
    • Section padding: py-16
    • Max-width container (max-w-2xl)
    • Centered content
    • Dark background with accent border
    • Compact design
CONTENT:
    • Heading: "Stay Updated"
    • Text: "Get monthly updates on breakthrough research, AI safety developments, and progress toward safe superintelligence."
    • Inline form: [Email input] [Subscribe button]
    • Email placeholder: "your@email.com"
    • Submit button: "Subscribe →"
BELOW FORM (small text):
    • ✓ No spam, ever
    • ✓ Unsubscribe anytime
    • ✓ ~1 email per month
VALIDATION:
    • Email format validation (Zod)
    • Error state if invalid
    • Success toast: "Subscribed! Check your email to confirm."
    • Honeypot field (hidden, for spam prevention)
    • Disabled state during submission
    • Loading spinner on button
GDPR:
    • Small checkbox: "I agree to receive updates from The Galion Initiative"
    • Link: "Privacy Policy" (placeholder href for now)
API ENDPOINT: POST /api/newsletter
(Create stub for now)
Use shadcn input and button. TypeScript throughout.
Expected Result: Clean newsletter capture with validation.

🦶 STEP 11: BUILD FOOTER
Prompt for Cursor/Gemini:
Create the institutional footer.
FILE: src/components/sections/Footer.tsx
DESIGN SPECS:
    • Padding: py-12
    • Dark background (bg-neutral-900)
    • Subtle top border
    • 3-column grid on desktop, stack on mobile
CONTENT:
COLUMN 1: About
    • Logo/wordmark: "THE GALION INITIATIVE"
    • Tagline: "Building safe superintelligence for humanity"
    • Copyright: "© 2025 The Galion Initiative"
    • Small text: "Independent nonprofit research organization"
COLUMN 2: Links
    • "About Us" (anchor to mission)
    • "Blueprint" (anchor to blueprint)
    • "Research" (placeholder)
    • "Team" (placeholder)
    • "Contact" (mailto:contact@galioninitiative.org)
COLUMN 3: Contact
    • "Email: contact@galioninitiative.org"
    • "Grants: grants@galioninitiative.org"
    • "Press: press@galioninitiative.org"
    • Social icons (placeholders for Twitter, GitHub, LinkedIn)
INTERACTIONS:
    • Links have subtle underline on hover
    • Email links use mailto:
    • External links open in new tab (if any)
Use proper semantic HTML. TypeScript throughout.
Expected Result: Professional, institutional footer.

📱 STEP 12: ASSEMBLE MAIN PAGE
Prompt for Cursor/Gemini:
Assemble all sections into the main page with scroll features.
FILE: src/app/page.tsx
STRUCTURE:
Import all section components:
    • Hero
    • Mission
    • Blueprint
    • Donate
    • JoinTeam
    • Newsletter
    • Footer
Render in order with proper spacing.
ADD SCROLL FEATURES:
    1. Scroll Progress Bar
        ◦ Fixed at top of page
        ◦ Width: full
        ◦ Height: 4px
        ◦ Color: primary-500
        ◦ Fills 0-100% based on scroll position
        ◦ Use Framer Motion useScroll hook
    2. Back to Top Button
        ◦ Fixed bottom-right corner
        ◦ Only visible after scrolling 50vh
        ◦ Circular button with up arrow icon (Lucide)
        ◦ Smooth scroll to top on click
        ◦ Fade in/out animation (Framer Motion)
    3. Smooth Scroll Behavior
        ◦ Proper scroll-margin for anchor links
        ◦ Smooth transitions between sections
SEO:
    • Proper heading hierarchy (only one h1)
    • Semantic HTML sections
    • ARIA labels where needed
Generate complete page.tsx with all features.
Expected Result: Fully functional single-page site.

🔌 STEP 13: CREATE API ROUTES
Prompt for Cursor/Gemini:
Create API routes for form submissions.
FILES:
    1. src/app/api/newsletter/route.ts
    2. src/app/api/contact/route.ts
REQUIREMENTS:
    • Next.js App Router API format (export async function POST)
    • Validate request body with Zod
    • Simple in-memory rate limiting (3 requests per IP per 10 min)
    • Return JSON responses
    • Error handling (400, 429, 500)
NEWSLETTER ROUTE:
Endpoint: POST /api/newsletter
Body: { email: string, honeypot?: string, consent: boolean }
Validation:
    • Valid email format
    • Consent must be true
    • If honeypot filled, reject silently (return success but don't process)
For now: Log to console
Response: { success: true, message: "Subscribed successfully" }
CONTACT ROUTE:
Endpoint: POST /api/contact
Body: { name: string, email: string, expertise: string, message?: string }
Validation:
    • name: min 2, max 100
    • email: valid format
    • expertise: one of allowed values
    • message: max 500, optional
For now: Log to console
Response: { success: true, message: "Message received. We'll be in touch." }
RATE LIMITING:
    • Store IP → timestamp[] in memory Map
    • Max 3 requests per 10 minutes
    • Return 429 if exceeded: { success: false, error: "Too many requests" }
ERROR RESPONSES:
    • 400: { success: false, error: "Validation error", details: [...] }
    • 429: { success: false, error: "Rate limit exceeded" }
    • 500: { success: false, error: "Internal server error" }
Generate both routes with complete validation and error handling.
Expected Result: Working API endpoints with validation.

♿ STEP 14: ACCESSIBILITY & RESPONSIVE AUDIT
Prompt for Cursor/Gemini:
Audit and enhance the entire site for accessibility and responsive design.
TASKS:
    1. ACCESSIBILITY (WCAG 2.1 AA):
        ◦ Add ARIA labels to all interactive elements
        ◦ Ensure keyboard navigation works (Tab, Enter, Esc)
        ◦ Add focus-visible states to all focusable elements
        ◦ Check color contrast ratios (4.5:1 for text, 3:1 for UI)
        ◦ Add skip-to-content link (hidden, keyboard accessible)
        ◦ Ensure form labels properly associated with inputs
        ◦ Error messages announced to screen readers (aria-live)
        ◦ Alt text for all images (when added)
    2. RESPONSIVE BREAKPOINTS:
Test and fix all sections at:
        ◦ Mobile: 375px, 414px
        ◦ Tablet: 768px, 1024px
        ◦ Desktop: 1280px, 1920px
    3. MOBILE OPTIMIZATIONS:
        ◦ Hero: Reduce heading sizes, stack CTAs
        ◦ Mission: Icons stack vertically
        ◦ Blueprint: Cards stack, full-width
        ◦ Donate: Stack columns
        ◦ Forms: Full-width inputs, larger tap targets (min 44x44px)
        ◦ Footer: Stack columns
    4. TOUCH TARGETS:
        ◦ All buttons/links minimum 44x44px
        ◦ Adequate spacing between tap targets
        ◦ Larger CTAs on mobile
Generate a list of specific fixes needed, then implement them across all components.
Expected Result: Fully accessible, mobile-optimized site.

⚡ STEP 15: PERFORMANCE OPTIMIZATION
Prompt for Cursor/Gemini:
Optimize the site for maximum performance.
TASKS:
    1. IMAGE OPTIMIZATION:
        ◦ Convert images to WebP format
        ◦ Use Next.js Image component
        ◦ Add blur placeholders
        ◦ Lazy load images below fold
        ◦ Optimize QR codes as inline SVG
    2. CODE SPLITTING:
        ◦ Dynamic imports for heavy components (if any)
        ◦ Lazy load Framer Motion animations
        ◦ Split bundle by route (automatic with App Router)
    3. FONT OPTIMIZATION:
        ◦ Use next/font for automatic optimization
        ◦ Preload critical fonts
        ◦ Subset fonts if possible (Latin only)
    4. BUNDLE SIZE:
        ◦ Remove unused dependencies
        ◦ Tree-shake Lucide icons (import only used icons)
        ◦ Remove console.logs in production
    5. LOADING PERFORMANCE:
        ◦ Add loading states for async operations
        ◦ Skeleton screens for forms
        ◦ Optimize CSS delivery
        ◦ Enable gzip/brotli compression
    6. CACHING:
        ◦ Configure proper Cache-Control headers
        ◦ Static generation where possible
TARGET METRICS:
    • Lighthouse Performance: > 95
    • First Contentful Paint: < 1.5s
    • Time to Interactive: < 3s
    • Cumulative Layout Shift: < 0.1
Generate optimization changes and implement them.
Expected Result: Lightning-fast website.

🚀 STEP 16: METADATA & SEO
Prompt for Cursor/Gemini:
Finalize metadata, SEO, and web presence files.
TASKS:
    1. METADATA COMPLETION:
Update src/app/layout.tsx with complete metadata:
        ◦ Full OpenGraph tags (title, description, image, url, type)
        ◦ Twitter card metadata (card type, site, creator)
        ◦ Keywords for AI safety
        ◦ Canonical URL
        ◦ Robots directives
    2. FAVICON & APP ICONS:
Generate placeholder links for:
        ◦ favicon.ico (32x32)
        ◦ apple-touch-icon.png (180x180)
        ◦ favicon-16x16.png
        ◦ favicon-32x32.png
        ◦ site.webmanifest
    3. ROBOTS.TXT:
Create public/robots.txt:
        ◦ Allow all crawlers
        ◦ Sitemap location
    4. SITEMAP:
Create public/sitemap.xml (manual for single page):
        ◦ Homepage URL
        ◦ Last modified date
        ◦ Change frequency
        ◦ Priority
    5. STRUCTURED DATA:
Add JSON-LD structured data for:
        ◦ Organization schema
        ◦ NonProfit schema
        ◦ ContactPoint schema
Generate all files and metadata configuration.
Expected Result: Complete SEO optimization.

✅ STEP 17: FINAL TESTING CHECKLIST
Manual Testing (You Do This):
FUNCTIONAL TESTING:
[ ] All navigation links work
[ ] Hero CTAs scroll to correct sections
[ ] Blueprint cards expand/collapse correctly
[ ] Crypto addresses copy to clipboard (copy button works)
[ ] Join Team form validates and submits
[ ] Newsletter form validates and submits
[ ] All email links open mail client (mailto:)
[ ] Ko-fi button links correctly (when added)
[ ] Back to top button appears and scrolls correctly
[ ] Scroll progress bar fills accurately
RESPONSIVE TESTING:
[ ] Site looks good on iPhone (375px)
[ ] Site looks good on iPad (768px)
[ ] Site looks good on desktop (1280px+)
[ ] All text readable at all sizes
[ ] No horizontal scroll on mobile
[ ] Touch targets easy to tap on mobile
ACCESSIBILITY TESTING:
[ ] Can navigate entire site with keyboard (Tab)
[ ] Focus indicators visible
[ ] Forms accessible with keyboard
[ ] Screen reader friendly (test with VoiceOver/NVDA)
[ ] Color contrast sufficient
PERFORMANCE TESTING:
[ ] Run Lighthouse audit (target: 95+)
[ ] Page loads in < 2 seconds
[ ] No console errors
[ ] Smooth animations, no jank
CROSS-BROWSER TESTING:
[ ] Chrome (latest)
[ ] Firefox (latest)
[ ] Safari (latest)
[ ] Edge (latest)

📦 STEP 18: BUILD & DEPLOYMENT PREP
Prompt for Cursor/Gemini:
Prepare the project for deployment to Cloudflare Pages.
TASKS:
    1. Create .env.example file:
List all environment variables needed:
        ◦ NEXT_PUBLIC_SITE_URL
        ◦ RESEND_API_KEY (when ready)
        ◦ NEXT_PUBLIC_NEWSLETTER_LIST_ID (when ready)
    2. Update package.json scripts:
Ensure these scripts exist:
        ◦ "dev": "next dev"
        ◦ "build": "next build"
        ◦ "start": "next start"
        ◦ "lint": "next lint"
    3. Create README.md:
Include:
        ◦ Project description
        ◦ Tech stack
        ◦ Local setup instructions
        ◦ Environment variables
        ◦ Deployment notes
        ◦ Contact info
    4. Verify build:
Run: npm run build
Ensure no errors
    5. Create deployment documentation:
Document for Cloudflare Pages:
        ◦ Build command: npm run build
        ◦ Build output: .next
        ◦ Node version: 20
        ◦ Environment variables needed
Generate all documentation files.
Expected Result: Project ready for deployment.

🌐 STEP 19: DEPLOY TO CLOUDFLARE PAGES
Manual Steps (You Do This):
1. Commit everything to Git
git add .
git commit -m "Initial commit: Galion Initiative website"
2. Create GitHub repository
Go to github.com/new
Create: galion-initiative-web
Push:
git remote add origin git@github.com:YOUR_USERNAME/galion-initiative-web.git
git branch -M main
git push -u origin main
3. In Cloudflare Dashboard:
- Go to Pages
- Click "Create a project"
- Connect to GitHub
- Select: galion-initiative-web
- Build settings:
- Framework preset: Next.js
- Build command: npm run build
- Build output: .next
- Root directory: /
- Environment variables:
- NODE_VERSION: 20
- NEXT_PUBLIC_SITE_URL: https://galioninitiative.org
- Click "Save and Deploy"
4. Configure Custom Domain:
- In project settings → Domains & HTTPS
- Add custom domain: galioninitiative.org
- Follow DNS instructions (if domain at Cloudflare, auto-configured)
- Enable "Always Use HTTPS"
- Enable "Auto Minify" for HTML/CSS/JS
5. Verify deployment:
- Visit https://galioninitiative.org
- Test all functionality
- Run Lighthouse audit

🎉 STEP 20: POST-LAUNCH
Final Tasks:
    1. ANALYTICS SETUP:
        ◦ Add Cloudflare Web Analytics
        ◦ Add Sentry for error tracking (optional)
    2. EMAIL INTEGRATION:
        ◦ Set up Resend account
        ◦ Get API key
        ◦ Update API routes to send real emails
        ◦ Test newsletter and contact forms
    3. CRYPTO WALLETS:
        ◦ Generate real wallet addresses
        ◦ Create QR codes
        ◦ Update donation section
        ◦ Test copy functionality
    4. CONTENT POLISH:
        ◦ Add real team photos/bios (if available)
        ◦ Finalize all copy
        ◦ Add blog/research section (future)
    5. MONITORING:
        ◦ Set up uptime monitoring
        ◦ Configure error alerts
        ◦ Monitor donation conversions
    6. OUTREACH:
        ◦ Prepare donor pitch deck
        ◦ Email major philanthropists
        ◦ Post to relevant communities (r/agi, LessWrong, etc.)

📚 REFERENCE: KEY FILES STRUCTURE
galion-initiative-web/
├── public/
│ ├── favicon.ico
│ ├── robots.txt
│ └── sitemap.xml
├── src/
│ ├── app/
│ │ ├── api/
│ │ │ ├── contact/route.ts
│ │ │ └── newsletter/route.ts
│ │ ├── layout.tsx
│ │ ├── page.tsx
│ │ └── globals.css
│ ├── components/
│ │ ├── ui/ (shadcn components)
│ │ ├── sections/
│ │ │ ├── Hero.tsx
│ │ │ ├── Mission.tsx
│ │ │ ├── Blueprint.tsx
│ │ │ ├── Donate.tsx
│ │ │ ├── JoinTeam.tsx
│ │ │ ├── Newsletter.tsx
│ │ │ └── Footer.tsx
│ │ └── shared/
│ │ ├── BlueprintCard.tsx
│ │ └── CryptoAddress.tsx
│ └── lib/
│ ├── utils.ts
│ └── validations.ts
├── .env.example
├── .env.local
├── .gitignore
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md

🆘 TROUBLESHOOTING
Common Issues:
Build fails:
Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
Styling not working:
    • Check Tailwind config includes all paths
    • Verify globals.css imports Tailwind directives
    • Clear browser cache
Forms not submitting:
    • Check API routes are in correct location
    • Verify CORS settings (not needed for same-origin)
    • Check browser console for errors
Animations janky:
    • Reduce animation complexity
    • Use CSS transforms (GPU-accelerated)
    • Check for layout thrashing

🎯 SUCCESS CRITERIA
Your site is ready when:
✅ Lighthouse score > 95
✅ Mobile-responsive on all devices
✅ All forms functional
✅ Accessible (keyboard nav, screen readers)
✅ Fast load time (< 2s)
✅ Professional appearance
✅ No console errors
✅ SEO optimized
✅ Ready for billionaire donors

💬 FINAL NOTES
This is a living guide. As you build, you may need to adjust. The prompts are designed to be specific enough for Gemini 2.0 Flash Experimental to execute, but flexible enough for iteration.
Key principle: Each prompt is self-contained. Copy it exactly into Cursor, let Gemini execute, verify the result, then move to the next step.
Communication with Gemini: Be clear, specific, and don't skip steps. If a result isn't quite right, ask Gemini to refine it before moving forward.
Remember: You're building infrastructure for a civilization-scale mission. Every detail matters. Take your time, test thoroughly, and make it worthy of the goal.

The Galion Initiative | galioninitiative.org
Building safe superintelligence for humanity
Good luck! 🚀
Galion Initiative Website - Cursor + Gemini 2.0 Flash Experimental Implementation Guide
Project: galioninitiative.org
Target: Institutional-grade website for AI safety nonprofit
AI Tool: Google Gemini 2.0 Flash Experimental (via Cursor AI)
Timeline: 3-5 days
Developer: You + AI Pair Programming

🎯 PROJECT OVERVIEW
You are building a world-class, institutional website for The Galion Initiative - a nonprofit research organization developing safe artificial superintelligence (ASI). This site must appeal to billionaire donors, institutional philanthropists, and serious AI safety researchers.
Success Criteria:
    • Professional, trustworthy, institutional appearance
    • Frictionless donation flow (crypto + traditional)
    • Expert recruitment pipeline
    • Newsletter capture
    • Mobile-responsive, accessible (WCAG 2.1 AA)
    • Lightning-fast (<2s load)
    • Lighthouse score 95+

📁 STEP 0: PROJECT SETUP
Create Project Folder
In your terminal
mkdir galion-initiative-web
cd galion-initiative-web
Initialize Git
git init
echo "node_modules/" > .gitignore
echo ".next/" >> .gitignore
echo ".env.local" >> .gitignore
echo ".vercel" >> .gitignore

🚀 STEP 1: INITIALIZE NEXT.JS PROJECT
Prompt for Cursor/Gemini:
Initialize a new Next.js 15 project with the following configuration:
REQUIREMENTS:
    • Framework: Next.js 15 (latest stable)
    • Language: TypeScript (strict mode)
    • Styling: Tailwind CSS
    • App Router (NOT Pages Router)
    • src/ directory structure enabled
    • ESLint enabled
    • Import alias: @/* for src/*
PROJECT NAME: galion-initiative-web
After initialization, install these additional dependencies:
    • framer-motion (animations)
    • lucide-react (icons)
    • react-hook-form (forms)
    • zod (validation)
    • @hookform/resolvers (form validation bridge)
    • class-variance-authority clsx tailwind-merge (styling utilities)
Then initialize shadcn/ui and add these components:
    • button
    • input
    • textarea
    • card
    • tabs
    • toast
    • select
    • label
    • form
Generate the complete command sequence and execute.
Expected Result: Complete Next.js project initialized with all dependencies.

🎨 STEP 2: CONFIGURE DESIGN SYSTEM
Prompt for Cursor/Gemini:
Configure Tailwind CSS with our institutional design system.
FILE TO UPDATE: tailwind.config.ts
DESIGN TOKENS:
Colors (add to theme.extend.colors):
{
primary: {
50: '#f0f9ff',
100: '#e0f2fe',
200: '#bae6fd',
300: '#7dd3fc',
400: '#38bdf8',
500: '#0ea5e9', // Main brand blue
600: '#0284c7',
700: '#0369a1',
800: '#075985',
900: '#0c4a6e',
950: '#082f49',
},
accent: {
50: '#fefce8',
100: '#fef9c3',
200: '#fef08a',
300: '#fde047',
400: '#facc15',
500: '#eab308', // Gold
600: '#ca8a04',
700: '#a16207',
800: '#854d0e',
900: '#713f12',
},
neutral: {
50: '#fafaf9',
100: '#f5f5f4',
200: '#e7e5e4',
300: '#d6d3d1',
400: '#a8a29e',
500: '#78716c',
600: '#57534e',
700: '#44403c',
800: '#292524',
900: '#1c1917',
950: '#0c0a09',
}
}
Typography (add to theme.extend):
{
fontFamily: {
sans: ['var(--font-geist-sans)', 'Inter', 'system-ui', 'sans-serif'],
},
fontSize: {
'xs': '0.75rem',
'sm': '0.875rem',
'base': '1rem',
'lg': '1.125rem',
'xl': '1.25rem',
'2xl': '1.5rem',
'3xl': '1.875rem',
'4xl': '2.25rem',
'5xl': '3rem',
'6xl': '3.75rem',
'7xl': '4.5rem',
}
}
Animations (add to theme.extend):
{
keyframes: {
'fade-in': {
'0%': { opacity: '0', transform: 'translateY(10px)' },
'100%': { opacity: '1', transform: 'translateY(0)' },
},
'slide-up': {
'0%': { transform: 'translateY(20px)', opacity: '0' },
'100%': { transform: 'translateY(0)', opacity: '1' },
},
'glow': {
'0%, 100%': { boxShadow: '0 0 20px rgba(14, 165, 233, 0.5)' },
'50%': { boxShadow: '0 0 40px rgba(14, 165, 233, 0.8)' },
}
},
animation: {
'fade-in': 'fade-in 0.5s ease-out',
'slide-up': 'slide-up 0.6s ease-out',
'glow': 'glow 2s ease-in-out infinite',
}
}
Update the config file with these tokens and preserve all existing shadcn/ui configuration.
Expected Result: Fully configured design system in tailwind.config.ts.

📄 STEP 3: CREATE ROOT LAYOUT & METADATA
Prompt for Cursor/Gemini:
Create the root layout with proper metadata for SEO and institutional credibility.
FILE: src/app/layout.tsx
REQUIREMENTS:
    1. Import fonts (use next/font):
        ◦ Primary: Geist Sans or Inter
        ◦ Fallback: system-ui, sans-serif
    2. Metadata configuration:
        ◦ Title: "The Galion Initiative | Building Safe Superintelligence"
        ◦ Description: "Independent nonprofit research organization developing provably safe artificial superintelligence through dual-core architecture and transparent oversight."
        ◦ Keywords: "AI safety, superintelligence, AGI, ASI, alignment research, AI governance"
        ◦ OpenGraph tags for social sharing
        ◦ Twitter card metadata
        ◦ Canonical URL: https://galioninitiative.org
    3. Root HTML structure:
        ◦ lang="en"
        ◦ Smooth scroll behavior
        ◦ Proper semantic structure
    4. Global providers (if needed for toast, etc.)
Generate complete, production-ready layout.tsx file.
Expected Result: Professional root layout with SEO optimization.

🎨 STEP 4: CREATE GLOBAL STYLES
Prompt for Cursor/Gemini:
Create global styles for the application.
FILE: src/app/globals.css
INCLUDE:
    1. Tailwind directives
    2. CSS custom properties for colors
    3. Smooth scroll behavior
    4. Selection styling (accent color background)
    5. Focus-visible styles for accessibility
    6. Base typography styles
    7. Any utility classes needed
Make it clean, modern, and institutional. No flashy effects.
Expected Result: Clean global stylesheet.

🏠 STEP 5: BUILD HERO SECTION
Prompt for Cursor/Gemini:
Create the Hero section component with institutional gravitas.
FILE: src/components/sections/Hero.tsx
DESIGN SPECS:
    • Full viewport height (min-h-screen)
    • Centered content with max-width container
    • Gradient background (dark blue → deep navy)
    • Subtle animated grid overlay or particle effect (optional)
CONTENT:
    • Organization name: "THE GALION INITIATIVE" (large, bold, uppercase)
    • Headline (text-5xl md:text-6xl): "Building Safe Superintelligence for Humanity"
    • Subheadline (text-lg md:text-xl, text-neutral-300):
"An independent research initiative developing provably safe artificial intelligence through transparent architecture and institutional oversight."
    • Trust badge: "Est. 2025 | Nonprofit Research Organization"
TWO CTA BUTTONS:
    1. Primary (gradient blue): "Read the Blueprint →"
    2. Secondary (outline): "Support the Mission"
INTERACTIONS:
    • Fade-in animation on load (Framer Motion)
    • Stagger animation for text elements
    • Smooth scroll to next section on scroll indicator click
    • Buttons: hover scale, subtle glow effect
Use TypeScript, Tailwind, and Framer Motion. Make it look like a serious institution, not a startup.
Expected Result: Stunning, professional hero section.

🎯 STEP 6: BUILD MISSION SECTION
Prompt for Cursor/Gemini:
Create the Mission section that establishes institutional credibility.
FILE: src/components/sections/Mission.tsx
DESIGN SPECS:
    • Section padding: py-24
    • Max-width container (max-w-4xl mx-auto)
    • Centered text alignment
    • Background: Subtle gradient or solid neutral
CONTENT:
    • Section heading (text-4xl font-bold): "Our Mission"
    • Mission statement (text-lg, leading-relaxed):
"The Galion Initiative is a nonprofit research organization committed to developing provably safe AI systems that will serve and protect humanity throughout the coming age of superintelligence. Our approach uniquely blends rigorous technical research, transparent oversight, and institutional governance."
THREE PILLARS (icon grid):
    1. Icon: Shield | Title: "Safety First" | Text: "Immutable safety rules embedded at the hardware level"
    2. Icon: Brain Circuit | Title: "Dual-Core Architecture" | Text: "Two opposing ASIs in perpetual balance"
    3. Icon: Eye | Title: "Transparent Governance" | Text: "Open research, public audits, human oversight"
INTERACTIONS:
    • Icons fade in on scroll (Intersection Observer)
    • Icons have subtle pulse animation on hover
Use Lucide React for icons. Implement scroll animations with Framer Motion.
Expected Result: Clear mission statement with visual credibility markers.

📘 STEP 7: BUILD BLUEPRINT SECTION
Prompt for Cursor/Gemini:
Create the Blueprint section with expandable cards.
FILES:
    • src/components/sections/Blueprint.tsx (main section)
    • src/components/shared/BlueprintCard.tsx (reusable card)
DESIGN SPECS:
    • Section padding: py-24
    • Section heading: "The Blueprint"
    • 2x2 grid on desktop (grid-cols-1 md:grid-cols-2)
    • Stack on mobile
FOUR CARDS:
    1. Title: "Dual-Core Architecture"
Icon: Two overlapping circles
Summary: "Two ASIs with opposing values in perpetual negotiation"
Details: "AGI-A optimizes for human growth and expansion. AGI-B optimizes for human stability and preservation. Neither functions without the other. Every action requires 65% consensus."
    2. Title: "Immutable Safety Rules"
Icon: Lock with circuit
Summary: "Core values burned into hardware, unchangeable"
Details: "Safety priorities encoded as symbolic rules, not trainable weights. No emotional drift, no hidden agendas, no compromise. Human flourishing is law."
    3. Title: "Human-Paced Progress"
Icon: Clock with Earth
Summary: "AI anchored to humanity's timeline, not silicon speed"
Details: "While ASI could experience centuries in seconds, our architecture ensures progress matches society's ability to adapt. No rushed utopia, no civilization collapse."
    4. Title: "Transparent Oversight"
Icon: Eye with network
Summary: "Live-streamed decisions, human killswitch, quarterly audits"
Details: "All communication between dual cores is public. Physical air-gapped killswitch controlled by humans. Independent audits every quarter. Zero hidden channels."
CARD BEHAVIOR:
    • Click to expand with smooth height animation (Framer Motion layout)
    • Show full details when expanded
    • Close button appears in expanded state
    • Only one card expanded at a time
CTA BUTTON: "Read Full Blueprint Article →" (opens modal or link)
Use TypeScript with proper interfaces. Implement with Framer Motion animations.
Expected Result: Interactive, professional blueprint showcase.

💰 STEP 8: BUILD DONATION SECTION
Prompt for Cursor/Gemini:
Create the comprehensive Donation section targeting high-net-worth individuals.
FILE: src/components/sections/Donate.tsx
SUB-COMPONENT: src/components/shared/CryptoAddress.tsx
DESIGN SPECS:
    • Dark background (bg-neutral-900) with subtle border glow
    • Section padding: py-24
    • Section heading: "Fund the Mission"
    • Subheading: "Help us build safe superintelligence before unsafe ASI emerges"
TWO-COLUMN LAYOUT (stack on mobile):
LEFT COLUMN: "Donation Tiers"
    • Heading: "Institutional Giving"
    • Four tiers with visual cards:
        a. 💎 STRATEGIC PARTNER ($1,000,000+)
            ▪ Dedicated liaison
            ▪ Quarterly in-person briefings
            ▪ Named research fellowship
            ▪ Input on research priorities
        b. 🥇 FOUNDING PARTNER ($100,000+)
            ▪ Advisory board consideration
            ▪ Recognition in publications
            ▪ Private briefings on progress
            ▪ Annual AI Safety Summit invite
        c. 🥈 BENEFACTOR ($10,000+)
            ▪ Research updates
            ▪ AI Safety Summit invite
            ▪ Direct team updates
        d. 🥉 SUPPORTER ($1,000+)
            ▪ Quarterly newsletter
            ▪ Public recognition
            ▪ Community access
    • Note: "Contact grants@galioninitiative.org for institutional partnerships"
    • Button: "Schedule a Briefing" (mailto link)
RIGHT COLUMN: "Direct Support"
    • Heading: "Individual Contributions"
    • Ko-fi button: "☕ Buy Us a Coffee" ($5, $10, $25 options)
    • Subheading: "Cryptocurrency Donations"
    • Tabs: [Bitcoin] [Ethereum] [USDT]
    • For each tab:
        ◦ Large QR code (SVG, placeholder for now)
        ◦ Copyable address with copy button
        ◦ Label: "Scan or copy address"
        ◦ Note: "All donations transparently logged"
CRYPTO ADDRESSES (placeholders):
    • BTC: bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
    • ETH: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
    • USDT (TRC20): TYASr6cqzx4kWyBz2m8s2um4VdJgFmWJkB
CRYPTOADDRESS COMPONENT:
Props: { currency: 'BTC' | 'ETH' | 'USDT', address: string, qrUrl?: string }
Features:
    • One-click copy to clipboard
    • Success toast on copy
    • Truncated address display with "..." in middle
    • Expand to full address on hover
Implement with shadcn tabs and toast. Use Lucide icons. TypeScript throughout.
Expected Result: Sophisticated, tier-based donation system.

👥 STEP 9: BUILD TEAM JOIN FORM
Prompt for Cursor/Gemini:
Create the expert recruitment section with validated form.
FILE: src/components/sections/JoinTeam.tsx
DESIGN SPECS:
    • Section padding: py-24
    • Two-column layout (stack on mobile)
    • Background: subtle gradient or neutral
LEFT COLUMN: "We Need You"
    • Heading: "Join the Mission"
    • Text: "Building safe ASI requires exceptional minds across disciplines:"
    • Bullet list:
• AI Safety & Alignment Research
• Symbolic Reasoning & Formal Verification
• Systems Architecture & Distributed Computing
• Ethics, Philosophy & Policy
• Governance & Institutional Design
    • Text: "If you're committed to ensuring superintelligence benefits all humanity—let's talk."
RIGHT COLUMN: Form
    • Field: Name (required, text input)
    • Field: Email (required, email validation)
    • Field: Expertise (required, select dropdown)
Options:
        ◦ "AI/ML Research"
        ◦ "Safety & Alignment"
        ◦ "Software Engineering"
        ◦ "Systems Architecture"
        ◦ "Philosophy & Ethics"
        ◦ "Policy & Governance"
        ◦ "Institutional Relations"
        ◦ "Other"
    • Field: Message (optional, textarea, max 500 chars)
    • Character count for message
    • Submit button: "Join the Initiative →"
VALIDATION:
    • Use React Hook Form + Zod
    • Schema:
        ◦ name: string, min 2, max 100
        ◦ email: valid email format
        ◦ expertise: enum of options
        ◦ message: string, max 500, optional
    • Real-time validation on blur
    • Error messages below fields
    • Submit disabled during validation/submission
    • Success toast: "Thank you! We'll be in touch soon."
    • Form resets on success
API ENDPOINT: POST /api/contact
(Create stub that logs to console for now)
Use shadcn form components. TypeScript with proper types.
Expected Result: Professional recruitment form with validation.

📧 STEP 10: BUILD NEWSLETTER SECTION
Prompt for Cursor/Gemini:
Create the newsletter signup section.
FILE: src/components/sections/Newsletter.tsx
DESIGN SPECS:
    • Section padding: py-16
    • Max-width container (max-w-2xl)
    • Centered content
    • Dark background with accent border
    • Compact design
CONTENT:
    • Heading: "Stay Updated"
    • Text: "Get monthly updates on breakthrough research, AI safety developments, and progress toward safe superintelligence."
    • Inline form: [Email input] [Subscribe button]
    • Email placeholder: "your@email.com"
    • Submit button: "Subscribe →"
BELOW FORM (small text):
    • ✓ No spam, ever
    • ✓ Unsubscribe anytime
    • ✓ ~1 email per month
VALIDATION:
    • Email format validation (Zod)
    • Error state if invalid
    • Success toast: "Subscribed! Check your email to confirm."
    • Honeypot field (hidden, for spam prevention)
    • Disabled state during submission
    • Loading spinner on button
GDPR:
    • Small checkbox: "I agree to receive updates from The Galion Initiative"
    • Link: "Privacy Policy" (placeholder href for now)
API ENDPOINT: POST /api/newsletter
(Create stub for now)
Use shadcn input and button. TypeScript throughout.
Expected Result: Clean newsletter capture with validation.

🦶 STEP 11: BUILD FOOTER
Prompt for Cursor/Gemini:
Create the institutional footer.
FILE: src/components/sections/Footer.tsx
DESIGN SPECS:
    • Padding: py-12
    • Dark background (bg-neutral-900)
    • Subtle top border
    • 3-column grid on desktop, stack on mobile
CONTENT:
COLUMN 1: About
    • Logo/wordmark: "THE GALION INITIATIVE"
    • Tagline: "Building safe superintelligence for humanity"
    • Copyright: "© 2025 The Galion Initiative"
    • Small text: "Independent nonprofit research organization"
COLUMN 2: Links
    • "About Us" (anchor to mission)
    • "Blueprint" (anchor to blueprint)
    • "Research" (placeholder)
    • "Team" (placeholder)
    • "Contact" (mailto:contact@galioninitiative.org)
COLUMN 3: Contact
    • "Email: contact@galioninitiative.org"
    • "Grants: grants@galioninitiative.org"
    • "Press: press@galioninitiative.org"
    • Social icons (placeholders for Twitter, GitHub, LinkedIn)
INTERACTIONS:
    • Links have subtle underline on hover
    • Email links use mailto:
    • External links open in new tab (if any)
Use proper semantic HTML. TypeScript throughout.
Expected Result: Professional, institutional footer.

📱 STEP 12: ASSEMBLE MAIN PAGE
Prompt for Cursor/Gemini:
Assemble all sections into the main page with scroll features.
FILE: src/app/page.tsx
STRUCTURE:
Import all section components:
    • Hero
    • Mission
    • Blueprint
    • Donate
    • JoinTeam
    • Newsletter
    • Footer
Render in order with proper spacing.
ADD SCROLL FEATURES:
    1. Scroll Progress Bar
        ◦ Fixed at top of page
        ◦ Width: full
        ◦ Height: 4px
        ◦ Color: primary-500
        ◦ Fills 0-100% based on scroll position
        ◦ Use Framer Motion useScroll hook
    2. Back to Top Button
        ◦ Fixed bottom-right corner
        ◦ Only visible after scrolling 50vh
        ◦ Circular button with up arrow icon (Lucide)
        ◦ Smooth scroll to top on click
        ◦ Fade in/out animation (Framer Motion)
    3. Smooth Scroll Behavior
        ◦ Proper scroll-margin for anchor links
        ◦ Smooth transitions between sections
SEO:
    • Proper heading hierarchy (only one h1)
    • Semantic HTML sections
    • ARIA labels where needed
Generate complete page.tsx with all features.
Expected Result: Fully functional single-page site.

🔌 STEP 13: CREATE API ROUTES
Prompt for Cursor/Gemini:
Create API routes for form submissions.
FILES:
    1. src/app/api/newsletter/route.ts
    2. src/app/api/contact/route.ts
REQUIREMENTS:
    • Next.js App Router API format (export async function POST)
    • Validate request body with Zod
    • Simple in-memory rate limiting (3 requests per IP per 10 min)
    • Return JSON responses
    • Error handling (400, 429, 500)
NEWSLETTER ROUTE:
Endpoint: POST /api/newsletter
Body: { email: string, honeypot?: string, consent: boolean }
Validation:
    • Valid email format
    • Consent must be true
    • If honeypot filled, reject silently (return success but don't process)
For now: Log to console
Response: { success: true, message: "Subscribed successfully" }
CONTACT ROUTE:
Endpoint: POST /api/contact
Body: { name: string, email: string, expertise: string, message?: string }
Validation:
    • name: min 2, max 100
    • email: valid format
    • expertise: one of allowed values
    • message: max 500, optional
For now: Log to console
Response: { success: true, message: "Message received. We'll be in touch." }
RATE LIMITING:
    • Store IP → timestamp[] in memory Map
    • Max 3 requests per 10 minutes
    • Return 429 if exceeded: { success: false, error: "Too many requests" }
ERROR RESPONSES:
    • 400: { success: false, error: "Validation error", details: [...] }
    • 429: { success: false, error: "Rate limit exceeded" }
    • 500: { success: false, error: "Internal server error" }
Generate both routes with complete validation and error handling.
Expected Result: Working API endpoints with validation.

♿ STEP 14: ACCESSIBILITY & RESPONSIVE AUDIT
Prompt for Cursor/Gemini:
Audit and enhance the entire site for accessibility and responsive design.
TASKS:
    1. ACCESSIBILITY (WCAG 2.1 AA):
        ◦ Add ARIA labels to all interactive elements
        ◦ Ensure keyboard navigation works (Tab, Enter, Esc)
        ◦ Add focus-visible states to all focusable elements
        ◦ Check color contrast ratios (4.5:1 for text, 3:1 for UI)
        ◦ Add skip-to-content link (hidden, keyboard accessible)
        ◦ Ensure form labels properly associated with inputs
        ◦ Error messages announced to screen readers (aria-live)
        ◦ Alt text for all images (when added)
    2. RESPONSIVE BREAKPOINTS:
Test and fix all sections at:
        ◦ Mobile: 375px, 414px
        ◦ Tablet: 768px, 1024px
        ◦ Desktop: 1280px, 1920px
    3. MOBILE OPTIMIZATIONS:
        ◦ Hero: Reduce heading sizes, stack CTAs
        ◦ Mission: Icons stack vertically
        ◦ Blueprint: Cards stack, full-width
        ◦ Donate: Stack columns
        ◦ Forms: Full-width inputs, larger tap targets (min 44x44px)
        ◦ Footer: Stack columns
    4. TOUCH TARGETS:
        ◦ All buttons/links minimum 44x44px
        ◦ Adequate spacing between tap targets
        ◦ Larger CTAs on mobile
Generate a list of specific fixes needed, then implement them across all components.
Expected Result: Fully accessible, mobile-optimized site.

⚡ STEP 15: PERFORMANCE OPTIMIZATION
Prompt for Cursor/Gemini:
Optimize the site for maximum performance.
TASKS:
    1. IMAGE OPTIMIZATION:
        ◦ Convert images to WebP format
        ◦ Use Next.js Image component
        ◦ Add blur placeholders
        ◦ Lazy load images below fold
        ◦ Optimize QR codes as inline SVG
    2. CODE SPLITTING:
        ◦ Dynamic imports for heavy components (if any)
        ◦ Lazy load Framer Motion animations
        ◦ Split bundle by route (automatic with App Router)
    3. FONT OPTIMIZATION:
        ◦ Use next/font for automatic optimization
        ◦ Preload critical fonts
        ◦ Subset fonts if possible (Latin only)
    4. BUNDLE SIZE:
        ◦ Remove unused dependencies
        ◦ Tree-shake Lucide icons (import only used icons)
        ◦ Remove console.logs in production
    5. LOADING PERFORMANCE:
        ◦ Add loading states for async operations
        ◦ Skeleton screens for forms
        ◦ Optimize CSS delivery
        ◦ Enable gzip/brotli compression
    6. CACHING:
        ◦ Configure proper Cache-Control headers
        ◦ Static generation where possible
TARGET METRICS:
    • Lighthouse Performance: > 95
    • First Contentful Paint: < 1.5s
    • Time to Interactive: < 3s
    • Cumulative Layout Shift: < 0.1
Generate optimization changes and implement them.
Expected Result: Lightning-fast website.

🚀 STEP 16: METADATA & SEO
Prompt for Cursor/Gemini:
Finalize metadata, SEO, and web presence files.
TASKS:
    1. METADATA COMPLETION:
Update src/app/layout.tsx with complete metadata:
        ◦ Full OpenGraph tags (title, description, image, url, type)
        ◦ Twitter card metadata (card type, site, creator)
        ◦ Keywords for AI safety
        ◦ Canonical URL
        ◦ Robots directives
    2. FAVICON & APP ICONS:
Generate placeholder links for:
        ◦ favicon.ico (32x32)
        ◦ apple-touch-icon.png (180x180)
        ◦ favicon-16x16.png
        ◦ favicon-32x32.png
        ◦ site.webmanifest
    3. ROBOTS.TXT:
Create public/robots.txt:
        ◦ Allow all crawlers
        ◦ Sitemap location
    4. SITEMAP:
Create public/sitemap.xml (manual for single page):
        ◦ Homepage URL
        ◦ Last modified date
        ◦ Change frequency
        ◦ Priority
    5. STRUCTURED DATA:
Add JSON-LD structured data for:
        ◦ Organization schema
        ◦ NonProfit schema
        ◦ ContactPoint schema
Generate all files and metadata configuration.
Expected Result: Complete SEO optimization.

✅ STEP 17: FINAL TESTING CHECKLIST
Manual Testing (You Do This):
FUNCTIONAL TESTING:
[ ] All navigation links work
[ ] Hero CTAs scroll to correct sections
[ ] Blueprint cards expand/collapse correctly
[ ] Crypto addresses copy to clipboard (copy button works)
[ ] Join Team form validates and submits
[ ] Newsletter form validates and submits
[ ] All email links open mail client (mailto:)
[ ] Ko-fi button links correctly (when added)
[ ] Back to top button appears and scrolls correctly
[ ] Scroll progress bar fills accurately
RESPONSIVE TESTING:
[ ] Site looks good on iPhone (375px)
[ ] Site looks good on iPad (768px)
[ ] Site looks good on desktop (1280px+)
[ ] All text readable at all sizes
[ ] No horizontal scroll on mobile
[ ] Touch targets easy to tap on mobile
ACCESSIBILITY TESTING:
[ ] Can navigate entire site with keyboard (Tab)
[ ] Focus indicators visible
[ ] Forms accessible with keyboard
[ ] Screen reader friendly (test with VoiceOver/NVDA)
[ ] Color contrast sufficient
PERFORMANCE TESTING:
[ ] Run Lighthouse audit (target: 95+)
[ ] Page loads in < 2 seconds
[ ] No console errors
[ ] Smooth animations, no jank
CROSS-BROWSER TESTING:
[ ] Chrome (latest)
[ ] Firefox (latest)
[ ] Safari (latest)
[ ] Edge (latest)

📦 STEP 18: BUILD & DEPLOYMENT PREP
Prompt for Cursor/Gemini:
Prepare the project for deployment to Cloudflare Pages.
TASKS:
    1. Create .env.example file:
List all environment variables needed:
        ◦ NEXT_PUBLIC_SITE_URL
        ◦ RESEND_API_KEY (when ready)
        ◦ NEXT_PUBLIC_NEWSLETTER_LIST_ID (when ready)
    2. Update package.json scripts:
Ensure these scripts exist:
        ◦ "dev": "next dev"
        ◦ "build": "next build"
        ◦ "start": "next start"
        ◦ "lint": "next lint"
    3. Create README.md:
Include:
        ◦ Project description
        ◦ Tech stack
        ◦ Local setup instructions
        ◦ Environment variables
        ◦ Deployment notes
        ◦ Contact info
    4. Verify build:
Run: npm run build
Ensure no errors
    5. Create deployment documentation:
Document for Cloudflare Pages:
        ◦ Build command: npm run build
        ◦ Build output: .next
        ◦ Node version: 20
        ◦ Environment variables needed
Generate all documentation files.
Expected Result: Project ready for deployment.

🌐 STEP 19: DEPLOY TO CLOUDFLARE PAGES
Manual Steps (You Do This):
1. Commit everything to Git
git add .
git commit -m "Initial commit: Galion Initiative website"
2. Create GitHub repository
Go to github.com/new
Create: galion-initiative-web
Push:
git remote add origin git@github.com:YOUR_USERNAME/galion-initiative-web.git
git branch -M main
git push -u origin main
3. In Cloudflare Dashboard:
- Go to Pages
- Click "Create a project"
- Connect to GitHub
- Select: galion-initiative-web
- Build settings:
- Framework preset: Next.js
- Build command: npm run build
- Build output: .next
- Root directory: /
- Environment variables:
- NODE_VERSION: 20
- NEXT_PUBLIC_SITE_URL: https://galioninitiative.org
- Click "Save and Deploy"
4. Configure Custom Domain:
- In project settings → Domains & HTTPS
- Add custom domain: galioninitiative.org
- Follow DNS instructions (if domain at Cloudflare, auto-configured)
- Enable "Always Use HTTPS"
- Enable "Auto Minify" for HTML/CSS/JS
5. Verify deployment:
- Visit https://galioninitiative.org
- Test all functionality
- Run Lighthouse audit

🎉 STEP 20: POST-LAUNCH
Final Tasks:
    1. ANALYTICS SETUP:
        ◦ Add Cloudflare Web Analytics
        ◦ Add Sentry for error tracking (optional)
    2. EMAIL INTEGRATION:
        ◦ Set up Resend account
        ◦ Get API key
        ◦ Update API routes to send real emails
        ◦ Test newsletter and contact forms
    3. CRYPTO WALLETS:
        ◦ Generate real wallet addresses
        ◦ Create QR codes
        ◦ Update donation section
        ◦ Test copy functionality
    4. CONTENT POLISH:
        ◦ Add real team photos/bios (if available)
        ◦ Finalize all copy
        ◦ Add blog/research section (future)
    5. MONITORING:
        ◦ Set up uptime monitoring
        ◦ Configure error alerts
        ◦ Monitor donation conversions
    6. OUTREACH:
        ◦ Prepare donor pitch deck
        ◦ Email major philanthropists
        ◦ Post to relevant communities (r/agi, LessWrong, etc.)

📚 REFERENCE: KEY FILES STRUCTURE
galion-initiative-web/
├── public/
│ ├── favicon.ico
│ ├── robots.txt
│ └── sitemap.xml
├── src/
│ ├── app/
│ │ ├── api/
│ │ │ ├── contact/route.ts
│ │ │ └── newsletter/route.ts
│ │ ├── layout.tsx
│ │ ├── page.tsx
│ │ └── globals.css
│ ├── components/
│ │ ├── ui/ (shadcn components)
│ │ ├── sections/
│ │ │ ├── Hero.tsx
│ │ │ ├── Mission.tsx
│ │ │ ├── Blueprint.tsx
│ │ │ ├── Donate.tsx
│ │ │ ├── JoinTeam.tsx
│ │ │ ├── Newsletter.tsx
│ │ │ └── Footer.tsx
│ │ └── shared/
│ │ ├── BlueprintCard.tsx
│ │ └── CryptoAddress.tsx
│ └── lib/
│ ├── utils.ts
│ └── validations.ts
├── .env.example
├── .env.local
├── .gitignore
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md

🆘 TROUBLESHOOTING
Common Issues:
Build fails:
Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
Styling not working:
    • Check Tailwind config includes all paths
    • Verify globals.css imports Tailwind directives
    • Clear browser cache
Forms not submitting:
    • Check API routes are in correct location
    • Verify CORS settings (not needed for same-origin)
    • Check browser console for errors
Animations janky:
    • Reduce animation complexity
    • Use CSS transforms (GPU-accelerated)
    • Check for layout thrashing

🎯 SUCCESS CRITERIA
Your site is ready when:
✅ Lighthouse score > 95
✅ Mobile-responsive on all devices
✅ All forms functional
✅ Accessible (keyboard nav, screen readers)
✅ Fast load time (< 2s)
✅ Professional appearance
✅ No console errors
✅ SEO optimized
✅ Ready for billionaire donors

💬 FINAL NOTES
This is a living guide. As you build, you may need to adjust. The prompts are designed to be specific enough for Gemini 2.0 Flash Experimental to execute, but flexible enough for iteration.
Key principle: Each prompt is self-contained. Copy it exactly into Cursor, let Gemini execute, verify the result, then move to the next step.
Communication with Gemini: Be clear, specific, and don't skip steps. If a result isn't quite right, ask Gemini to refine it before moving forward.
Remember: You're building infrastructure for a civilization-scale mission. Every detail matters. Take your time, test thoroughly, and make it worthy of the goal.

The Galion Initiative | galioninitiative.org
Building safe superintelligence for humanity
Good luck! 🚀
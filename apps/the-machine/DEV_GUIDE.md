# THE MACHINE - Development Guide

**Complete guide for local development**

---

## 🚀 Quick Start (30 seconds)

### Option 1: PowerShell Script (Recommended)
```powershell
cd c:\Users\Gigabyte\Documents\galion-initiative-web\apps\the-machine
.\start-dev.ps1
```

### Option 2: Manual Start
```powershell
cd c:\Users\Gigabyte\Documents\galion-initiative-web\apps\the-machine
npm install
npm run dev
```

Then visit: **http://localhost:4200/login**

---

## 🔐 Login Credentials

**Development Mode:**
- Email: `admin@machine.local`
- Password: `(any password works)`

The system uses an in-memory database in development, so no Cloudflare setup is needed!

---

## 📁 Project Structure

```
the-machine/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── page.tsx           # Main console
│   │   ├── login/             # Login page
│   │   ├── assess/            # Risk assessment interface
│   │   ├── logs/              # Audit logs
│   │   ├── monitor/           # Real-time monitor
│   │   ├── sentinel/          # Sentinel dashboard
│   │   ├── settings/          # System settings
│   │   └── api/               # API routes
│   │       ├── auth/          # Authentication
│   │       ├── assessments/   # Risk assessments
│   │       ├── audit/         # Audit logs
│   │       ├── ai/            # AI endpoints
│   │       ├── patterns/      # Pattern recognition
│   │       ├── sentinel/      # Sentinel system
│   │       └── realtime/      # Real-time events
│   ├── lib/                   # Core logic
│   │   ├── db-local.ts        # Local dev database
│   │   ├── db-client.ts       # D1 database (production)
│   │   ├── auth.ts            # Authentication
│   │   ├── assessment.ts      # Risk assessment logic
│   │   ├── constraints.ts     # Hard constraints
│   │   ├── ai.ts              # AI integration
│   │   ├── pattern-recognition.ts
│   │   ├── sentinel.ts        # Sentinel system
│   │   └── realtime.ts        # Real-time features
│   └── middleware.ts          # Auth middleware
├── database/                  # Database schemas
│   └── schema-v2.sql         # Production schema
├── package.json
├── next.config.ts
├── wrangler.toml             # Cloudflare config (production)
├── start-dev.ps1             # Quick start script
└── dev-setup.ps1             # Full setup script
```

---

## 🔧 Key Features

### 1. **Risk Assessment**
- 3-step process: Identify → Estimate → Options
- Automatic risk scoring
- Constraint checking
- Intervention options
- Full audit trail

### 2. **Authentication**
- JWT-based sessions
- Operator roles (admin, operator, viewer)
- Session management
- Secure logout

### 3. **Constraint System**
- 7 hard-coded constraints
- Cannot be disabled
- Automatic violation detection
- All violations logged

### 4. **Pattern Recognition**
- Threat pattern detection
- Learning from past assessments
- False positive tracking
- Confidence scoring

### 5. **Sentinel System**
- Real-time monitoring
- AI intelligence tracking
- Infrastructure watchdog
- Team protection

### 6. **Audit Logging**
- Every action logged
- Justification required
- Privacy-aware
- Exportable

---

## 💻 Development Workflow

### 1. **Make Changes**
Edit files in `src/`

### 2. **Hot Reload**
Next.js will automatically reload your browser

### 3. **Check Logs**
Watch the console for errors

### 4. **Test Features**
Use the UI to test your changes

---

## 🗄️ Database

### Development (Local)
- **Type**: In-memory  
- **Location**: `src/lib/db-local.ts`
- **Data**: Resets on server restart
- **Default Operator**: `admin@machine.local`

### Production (Cloudflare)
- **Type**: Cloudflare D1 (SQLite)
- **Schema**: `database/schema-v2.sql`
- **Setup**: See `DATABASE_SETUP_v2.md`

---

## 🧪 Testing

### Manual Testing
1. Start server: `npm run dev`
2. Open: http://localhost:4200/login
3. Login with any password
4. Test features:
   - Create assessment
   - View audit logs
   - Check Sentinel
   - Adjust settings

### API Testing
```powershell
# Test login
Invoke-RestMethod -Uri "http://localhost:4200/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"admin@machine.local","password":"test"}'

# Test session
Invoke-RestMethod -Uri "http://localhost:4200/api/auth/session"
```

---

## 🐛 Troubleshooting

### Server Won't Start
```powershell
# Check Node version (needs 18+)
node --version

# Reinstall dependencies
Remove-Item -Recurse -Force node_modules
npm install
```

### Port 4200 In Use
```powershell
# Find process using port
netstat -ano | findstr :4200

# Kill process (replace PID)
taskkill /PID <PID> /F

# Or use different port
npm run dev -- --port 4201
```

### Database Errors
Development uses in-memory database, so no database setup needed!

If you see D1 errors, check that you're using `getDatabaseForRequest()` from `db-local.ts`.

### TypeScript Errors
```powershell
# Check for errors
npm run build

# VS Code: Restart TypeScript server
# Press: Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

---

## 🔑 Environment Variables

Create `.env.local` for development:

```env
# AI API Key (optional for development)
ANTHROPIC_API_KEY=your_key_here

# Node environment
NODE_ENV=development
```

---

## 📝 Code Style

### Comments
- ALWAYS add explanatory comments
- Document WHY, not just WHAT
- Use short, clear sentences

### Functions
- Keep functions small (<50 lines)
- One responsibility per function
- Clear, descriptive names

### Files
- Keep files focused (<200 lines)
- One component/module per file
- Group related code

---

## 🚢 Deployment

See `DEPLOYMENT.md` for production deployment to Cloudflare Pages.

Development and production use different databases:
- **Dev**: In-memory (db-local.ts)
- **Prod**: Cloudflare D1 (db-client.ts)

---

## 📚 Additional Resources

- **Full Blueprint**: `../Galion-Blueprint-COMPLETE.md`
- **Test Scenarios**: `TEST_SCENARIOS.md`
- **Authentication**: `AUTHENTICATION_GUIDE.md`
- **Pattern Recognition**: `PATTERN_RECOGNITION_GUIDE.md`
- **Sentinel System**: `SENTINEL_GUIDE.md`
- **Database Setup**: `DATABASE_SETUP_v2.md`

---

## 💡 Tips

1. **Use the PowerShell script** - It's the easiest way to start
2. **Check the console** - Most errors show up there
3. **Hot reload works** - Just save and watch the browser update
4. **Test incrementally** - Don't make too many changes at once
5. **Check audit logs** - They show everything the system does

---

## 🎯 Common Tasks

### Add a New API Route
```typescript
// src/app/api/my-route/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDatabaseForRequest } from '@/lib/db-local';

export async function GET(request: NextRequest) {
  const db = getDatabaseForRequest();
  // Your code here
  return NextResponse.json({ success: true });
}
```

### Add a New Page
```typescript
// src/app/my-page/page.tsx
export default function MyPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">My Page</h1>
    </div>
  );
}
```

### Use the Database
```typescript
import { getDatabaseForRequest } from '@/lib/db-local';

const db = getDatabaseForRequest();
const operators = await db.listOperators();
const operator = await db.getOperatorByEmail('admin@machine.local');
```

---

**Ready to build? Run `.\start-dev.ps1` and start coding!** 🚀

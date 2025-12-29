# The Machine - Quick Start Guide

**For Admin**: Get The Machine running in 5 minutes

---

## ⚡ 1. Install & Run (30 seconds)

```bash
# Navigate to The Machine
cd apps/the-machine

# Install dependencies
npm install

# Start development server
npm run dev
```

**Open in browser**: [http://localhost:4200](http://localhost:4200)

---

## 🧪 2. Test the Features (2 minutes)

### Test 1: Risk Assessment
1. Click **"Risk Assessment"** on the console
2. Fill in the form:
   - **Who at risk**: "Test Person"
   - **Harm type**: "Physical Violence"
   - **Description**: "Testing the system"
   - **Timeframe**: "Medium-term"
3. Click **"Continue to Estimation"**
4. Review the risk score and estimates
5. Click **"Continue to Options"**
6. Review the proposed interventions
7. Note which options pass constraints ✅

**Expected**: 3 options (monitor, alert, intervene), constraint checks displayed

---

### Test 2: Audit Logs
1. Click **"Audit Logs"** from console
2. See the mock logs displayed
3. Try the filters:
   - Category: "Assessment"
   - Severity: "Info"
4. Search for "risk"
5. Expand metadata on a log entry

**Expected**: Logs filter correctly, metadata shows JSON details

---

### Test 3: Settings
1. Click **"Settings"** from console
2. Review hard constraints (should be locked 🔒)
3. Adjust alert threshold slider
4. Try to toggle "Require Approval" (should be disabled)
5. Note the emergency shutdown button

**Expected**: Critical settings are locked, others are configurable

---

## 🔍 3. Review the Code (2 minutes)

### Core Files to Check:

1. **Constraint System**:
   ```bash
   code src/lib/constraints.ts
   ```
   - 7 hard constraints
   - Automatic violation detection
   - ~400 lines, well-documented

2. **Assessment Logic**:
   ```bash
   code src/lib/assessment.ts
   ```
   - Risk estimation algorithm
   - Option generation
   - ~400 lines, clear structure

3. **Risk Assessment UI**:
   ```bash
   code src/app/assess/page.tsx
   ```
   - 3-step wizard
   - Real-time validation
   - ~500 lines

---

## 📚 4. Understand the Architecture

### The Flow:

```
User Input (Risk Assessment)
   ↓
Threat Identification
   ↓
Risk Estimation (probability × severity)
   ↓
Option Generation (monitor, alert, intervene)
   ↓
Constraint Checking (for each option)
   ↓
Flags & Recommendations
   ↓
Operator Approval
   ↓
Audit Log
```

### Key Principles:

1. **No Autonomous Action** - All decisions require operator approval
2. **Transparent** - Every action is logged
3. **Constrained** - 7 hard constraints cannot be violated
4. **Auditable** - Complete history of all operations

---

## 🎯 5. What's Next?

### Immediate (This Week):
- [ ] Set up Cloudflare D1 database
- [ ] Add admin authentication
- [ ] Deploy to staging environment

### Short-term (This Month):
- [ ] Integrate Claude AI for threat analysis
- [ ] Add real-time monitoring
- [ ] Implement data encryption

### Long-term (Q1 2026):
- [ ] Production deployment
- [ ] Multi-operator support
- [ ] Advanced threat patterns
- [ ] Automated reporting

---

## 📖 Documentation

- **[README.md](./README.md)** - Full project overview
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Complete technical details
- **[PROJECT_42_READY.md](../../PROJECT_42_READY.md)** - Overall project status

---

## 🛠️ Common Commands

```bash
# Development
npm run dev              # Start dev server (port 4200)
npm run build            # Build for production
npm run start            # Start production server

# Type checking
npm run type-check       # Check TypeScript types

# Linting
npm run lint             # Run ESLint

# Deployment (future)
npx wrangler pages deploy .next  # Deploy to Cloudflare
```

---

## 🐛 Troubleshooting

### Port 4200 already in use?
```bash
# Kill the process using port 4200
# Windows:
netstat -ano | findstr :4200
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:4200 | xargs kill -9
```

### Dependencies not installing?
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors?
```bash
# Restart TypeScript server in VS Code
# Command Palette (Ctrl+Shift+P) → "TypeScript: Restart TS Server"
```

---

## ✅ Success Checklist

After following this guide, you should have:

- [x] The Machine running on `http://localhost:4200`
- [x] Tested risk assessment (all 3 steps)
- [x] Reviewed audit logs
- [x] Checked settings page
- [x] Reviewed constraint system code
- [x] Understood the architecture
- [x] Ready for next steps (database, auth, deployment)

---

## 🎊 You're Ready!

**The Machine is operational.** 🛡️

All core features are working:
- ✅ Hard constraints enforced
- ✅ Risk assessment framework
- ✅ Audit logging
- ✅ Admin controls

**Next**: Set up database and authentication, then deploy!

---

*Constrained by design. Built to protect.* 🔒

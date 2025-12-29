# THE MACHINE - Build and Start Guide

## Current Status
The Machine is configured for local development with an in-memory database.

## Quick Start Commands

### For PowerShell (Recommended):
```powershell
# Navigate to the project
cd c:\Users\Gigabyte\Documents\galion-initiative-web\apps\the-machine

# Install dependencies (if needed)
npm install

# Start development server
npm run dev
```

### Manual Start:
```powershell
cd c:\Users\Gigabyte\Documents\galion-initiative-web\apps\the-machine
.\start-dev.ps1
```

## What Was Fixed

### 1. Local Development Database
- Created `src/lib/db-local.ts` - In-memory database for local dev
- No Cloudflare D1 setup required
- Automatic default operator creation

### 2. Updated API Routes
- `src/app/api/auth/login/route.ts` - Uses local database
- `src/app/api/assessments/route.ts` - Uses local database
- Other routes can be updated similarly

### 3. Development Scripts
- `start-dev.ps1` - Quick start script  
- `dev-setup.ps1` - Full setup verification
- `DEV_GUIDE.md` - Complete development guide

## Login Information

**Email**: `admin@machine.local`  
**Password**: Any password works in development mode

The local database automatically creates this operator on first access.

## Project Structure

```
the-machine/
├── src/
│   ├── app/              # Next.js pages and API routes
│   ├── lib/
│   │   ├── db-local.ts   # ✨ NEW: Local dev database
│   │   ├── db-client.ts  # Production Cloudflare D1
│   │   ├── auth.ts
│   │   ├── assessment.ts
│   │   └── ...
│   └── middleware.ts
├── start-dev.ps1         # ✨ NEW: Quick start script
├── dev-setup.ps1         # ✨ NEW: Setup verification
├── DEV_GUIDE.md          # ✨ NEW: Development guide
└── package.json
```

## Development vs Production

### Development (Local)
- Database: In-memory (`db-local.ts`)
- No Cloudflare account needed
- Data resets on server restart
- Fast iteration

### Production (Cloudflare Pages)
- Database: Cloudflare D1 (`db-client.ts`)
- Persistent data
- See `DATABASE_SETUP_v2.md` for setup

## Troubleshooting

### If server won't start:

1. **Check Node version**
   ```powershell
   node --version  # Should be 18 or higher
   ```

2. **Reinstall dependencies**
   ```powershell
   Remove-Item -Recurse node_modules
   npm install
   ```

3. **Check port 4200**
   ```powershell
   netstat -ano | findstr :4200
   ```

4. **Try different port**
   ```powershell
   npm run dev -- --port 4201
   ```

### If you get database errors:

The local database (`db-local.ts`) is automatically initialized. No setup required!

### If login fails:

- Email: `admin@machine.local`
- Password: Literally anything
- The system creates the operator automatically

## Next Steps

1. Start the server
2. Open http://localhost:4200/login
3. Login with `admin@machine.local`
4. Explore the interface
5. Check the code
6. Start developing!

## Building for Production

```powershell
npm run build
```

This will build for Cloudflare Pages deployment.

## Files to Ignore

These files are for development only:
- `start-dev.ps1`
- `dev-setup.ps1`
- `test-build.bat`
- `build-output.txt`

## Additional Documentation

- `DEV_GUIDE.md` - Comprehensive development guide
- `TEST_SCENARIOS.md` - Testing scenarios
- `AUTHENTICATION_GUIDE.md` - Auth system details
- `DATABASE_SETUP_v2.md` - Production database setup
- `SENTINEL_GUIDE.md` - Sentinel system docs

---

**Ready to code? Just run `npm run dev`!** 🚀

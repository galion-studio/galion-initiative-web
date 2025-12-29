# THE MACHINE - Manual Start Instructions

## ✅ Everything is Ready!

The complete development pipeline has been built. All files are in place:

- ✅ Local development database (`src/lib/db-local.ts`)
- ✅ Updated API routes (login and assessments)
- ✅ Helper scripts (RUN.ps1, start-dev.ps1)
- ✅ Complete documentation

---

## 🚀 Start The Server Now (2 Options)

### Option 1: Direct npm Command (Simplest)

**Open your PowerShell terminal** and run:

```powershell
cd c:\Users\Gigabyte\Documents\galion-initiative-web\apps\the-machine
npm run dev
```

### Option 2: Use the Helper Script

```powershell
cd c:\Users\Gigabyte\Documents\galion-initiative-web\apps\the-machine
.\RUN.ps1
```

---

## 📋 What You'll See

When the server starts successfully, you'll see:

```
> @project-42/the-machine@2.0.0 dev
> next dev --port 4200

  ▲ Next.js 16.0.6 (Turbopack)
  - Local:         http://localhost:4200
  - Network:       http://10.x.x.x:4200

✓ Ready in 800ms
```

---

## 🌐 Access The Machine

Once you see "✓ Ready", open your browser to:

**http://localhost:4200/login**

### Login Credentials:
- **Email**: `admin@machine.local`  
- **Password**: Type anything (any password works in development)

---

## 🛠️ If Dependencies Are Missing

If you see an error about missing dependencies, run:

```powershell
cd c:\Users\Gigabyte\Documents\galion-initiative-web\apps\the-machine
npm install
npm run dev
```

---

## 📊 What Happens When You Login

1. Local database auto-initializes in memory
2. Admin operator (`admin@machine.local`) is auto-created
3. You'll see the main console interface
4. All features will be available:
   - Risk Assessment
   - Audit Logs
   - Sentinel Dashboard
   - Settings
   - Real-time Monitor

---

## 🔧 Quick Troubleshooting

### Port 4200 Already in Use?

```powershell
# Find what's using the port
netstat -ano | findstr :4200

# Kill the process (replace <PID> with the number from above)
taskkill /PID <PID> /F

# Then start again
npm run dev
```

### Or Use a Different Port:

```powershell
npm run dev -- --port 4201
```

Then visit: http://localhost:4201/login

---

## 📁 Project Structure

```
the-machine/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Main console
│   │   ├── login/page.tsx        # Login page
│   │   └── api/
│   │       ├── auth/login/       # Login endpoint
│   │       └── assessments/      # Assessments API
│   └── lib/
│       ├── db-local.ts           # ✨ Local database (NEW!)
│       ├── auth.ts               # Authentication
│       ├── assessment.ts         # Risk assessment logic
│       └── constraints.ts        # Hard constraints
├── RUN.ps1                       # Quick start script
├── package.json                  # Dependencies
└── [Documentation files]
```

---

## 💡 Development Workflow

1. **Start the server**: `npm run dev`
2. **Open browser**: http://localhost:4200/login
3. **Login**: `admin@machine.local` + any password
4. **Make code changes**: Edit files in `src/`
5. **See changes**: Browser auto-reloads
6. **Check logs**: Watch the terminal

---

## 📚 Documentation

- `START_NOW.md` - Quick start guide
- `DEV_GUIDE.md` - Complete development guide
- `PIPELINE_COMPLETE.md` - Technical summary
- `BUILD_AND_START.md` - Build information

---

## ✨ Features Ready to Use

Once logged in, you can:

✅ **Create Risk Assessments**
- 3-step process
- Automatic risk scoring
- Constraint checking

✅ **View Audit Logs**
- Complete action history
- Filter and search
- Export functionality

✅ **Monitor with Sentinel**
- Real-time system status
- AI intelligence tracking
- Infrastructure watchdog

✅ **Configure Settings**
- Adjust thresholds
- View constraints (locked)
- System parameters

---

## 🎯 Your Next Steps

1. **Open PowerShell**
2. **Run**: 
   ```powershell
   cd c:\Users\Gigabyte\Documents\galion-initiative-web\apps\the-machine
   npm run dev
   ```
3. **Wait** for "✓ Ready" message
4. **Open** http://localhost:4200/login
5. **Login** with `admin@machine.local`
6. **Start building!**

---

## 🎉 Summary

✅ **Development pipeline**: COMPLETE  
✅ **Local database**: READY  
✅ **API routes**: UPDATED  
✅ **Documentation**: COMPREHENSIVE  
✅ **Ready to code**: YES!

**Just run `npm run dev` in your PowerShell terminal!** 🚀

---

**Note**: The server must be started from your PowerShell terminal, not through the automation scripts. This ensures you can see all output and interact with the server properly.

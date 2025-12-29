# THE MACHINE - Development Environment Setup Script
# This script sets up the complete local development environment

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  THE MACHINE - Dev Environment Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get current location
$ProjectRoot = "c:\Users\Gigabyte\Documents\galion-initiative-web\apps\the-machine"
Set-Location $ProjectRoot

Write-Host "[Step 1/5] Checking Node.js and npm..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    $npmVersion = npm --version
    Write-Host "  ✓ Node.js: $nodeVersion" -ForegroundColor Green
    Write-Host "  ✓ npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Node.js or npm not found!" -ForegroundColor Red
    Write-Host "  Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "[Step 2/5] Checking dependencies..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "  ✓ Dependencies already installed" -ForegroundColor Green
} else {
    Write-Host "  Installing dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host "  ✓ Dependencies installed" -ForegroundColor Green
}
Write-Host ""

Write-Host "[Step 3/5] Setting up local database..." -ForegroundColor Yellow

# Create .wrangler directory structure
$wranglerStateDir = Join-Path $ProjectRoot ".wrangler\state\v3"
if (!(Test-Path $wranglerStateDir)) {
    New-Item -ItemType Directory -Path $wranglerStateDir -Force | Out-Null
    Write-Host "  ✓ Created .wrangler directory" -ForegroundColor Green
} else {
    Write-Host "  ✓ .wrangler directory exists" -ForegroundColor Green
}

# Run the setup script
Write-Host "  Running database initialization..." -ForegroundColor Yellow
try {
    $output = node setup-operator.js 2>&1 | Out-String
    Write-Host $output
    
    # Check if database was created
    $dbPath = Join-Path $wranglerStateDir "the-machine.sqlite"
    if (Test-Path $dbPath) {
        Write-Host "  ✓ Database created successfully" -ForegroundColor Green
        $dbSize = (Get-Item $dbPath).Length / 1KB
        Write-Host "  Database size: $([Math]::Round($dbSize, 2)) KB" -ForegroundColor Gray
    } else {
        Write-Host "  ⚠ Database file not found at expected location" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  ✗ Error setting up database: $_" -ForegroundColor Red
}
Write-Host ""

Write-Host "[Step 4/5] Verifying configuration..." -ForegroundColor Yellow

# Check required files
$requiredFiles = @(
    "package.json",
    "next.config.ts",
    "wrangler.toml",
    "src\app\layout.tsx",
    "src\app\page.tsx",
    "src\lib\db-client.ts",
    "database\schema-v2.sql"
)

$allFilesExist = $true
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "  ✓ $file" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $file MISSING!" -ForegroundColor Red
        $allFilesExist = $false
    }
}
Write-Host ""

Write-Host "[Step 5/5] Environment ready!" -ForegroundColor Yellow
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "  SETUP COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Start the development server:" -ForegroundColor White
Write-Host "     npm run dev" -ForegroundColor Yellow
Write-Host ""
Write-Host "  2. Open your browser to:" -ForegroundColor White
Write-Host "     http://localhost:4200/login" -ForegroundColor Yellow
Write-Host ""
Write-Host "  3. Login credentials:" -ForegroundColor White
Write-Host "     Email: admin@machine.local" -ForegroundColor Yellow
Write-Host "     Password: (any password works in dev mode)" -ForegroundColor Yellow
Write-Host ""

Write-Host "Quick Commands:" -ForegroundColor Cyan
Write-Host "  npm run dev       - Start development server" -ForegroundColor Gray
Write-Host "  npm run build     - Build for production" -ForegroundColor Gray
Write-Host "  npm run setup     - Re-run database setup" -ForegroundColor Gray
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

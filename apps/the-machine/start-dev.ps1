# THE MACHINE - Quick Start Development Server
# Run this script to start the development server

param(
    [switch]$NoOpen = $false
)

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  THE MACHINE - Starting Dev Server" -ForegroundColor Cyan  
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to the project directory
$ProjectRoot = "c:\Users\Gigabyte\Documents\galion-initiative-web\apps\the-machine"
Set-Location $ProjectRoot

Write-Host "[1/3] Checking dependencies..." -ForegroundColor Yellow
if (!(Test-Path "node_modules")) {
    Write-Host "  Installing dependencies..." -ForegroundColor Yellow
    npm install
} else {
    Write-Host "  ✓ Dependencies found" -ForegroundColor Green
}
Write-Host ""

Write-Host "[2/3] Starting Next.js server..." -ForegroundColor Yellow
Write-Host "  Port: 4200" -ForegroundColor Gray
Write-Host "  Local database: In-memory (development mode)" -ForegroundColor Gray
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "  SERVER STARTING..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Once ready, visit:" -ForegroundColor Cyan
Write-Host "  → Login: http://localhost:4200/login" -ForegroundColor Yellow
Write-Host "  → Console: http://localhost:4200/" -ForegroundColor Yellow
Write-Host ""
Write-Host "Default credentials:" -ForegroundColor Cyan
Write-Host "  Email: admin@machine.local" -ForegroundColor Yellow
Write-Host "  Password: (any password works)" -ForegroundColor Yellow  
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""

# Open browser automatically unless -NoOpen is specified
if (!$NoOpen) {
    Start-Sleep -Seconds 3
    Start-Process "http://localhost:4200/login"
}

# Start the development server
npm run dev

# THE MACHINE - Development Server
# Simple, direct script to run the development server

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "         THE MACHINE v2.0" -ForegroundColor Cyan
Write-Host "      Development Server Start" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Set location
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

Write-Host "[INFO] Project: The Machine" -ForegroundColor Gray
Write-Host "[INFO] Location: $ScriptDir" -ForegroundColor Gray
Write-Host ""

# Check Node.js
Write-Host "[1/4] Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>&1
    Write-Host "      OK Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "      ERROR Node.js not found!" -ForegroundColor Red
    Write-Host "      Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    pause
    exit 1
}

# Check npm
Write-Host "[2/4] Checking npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version 2>&1
    Write-Host "      OK npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "      ERROR npm not found!" -ForegroundColor Red
    pause
    exit 1
}

# Check dependencies
Write-Host "[3/4] Checking dependencies..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "      OK Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "      Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "      ERROR Failed to install dependencies" -ForegroundColor Red
        pause
        exit 1
    }
    Write-Host "      OK Dependencies installed" -ForegroundColor Green
}

Write-Host "[4/4] Starting server..." -ForegroundColor Yellow
Write-Host ""

# Show info
Write-Host "========================================" -ForegroundColor Green
Write-Host " SERVER STARTING" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "  URL: http://localhost:4200" -ForegroundColor White
Write-Host "  Login: http://localhost:4200/login" -ForegroundColor White
Write-Host ""
Write-Host "  Email: admin@machine.local" -ForegroundColor Yellow
Write-Host "  Password: (any password)" -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""

# Start the server
npm run dev

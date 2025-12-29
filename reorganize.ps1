# Project 42 - Reorganization Script
# This script completes the monorepo restructuring

Write-Host "Starting Project 42 reorganization..." -ForegroundColor Green

# Move src folder
if (Test-Path "src") {
    Write-Host "Moving src folder..."
    if (!(Test-Path "apps\galion-initiative\src")) {
        robocopy "src" "apps\galion-initiative\src" /E /MOVE /NFL /NDL /NJH /NJS
    }
}

# Move public folder
if (Test-Path "public") {
    Write-Host "Moving public folder..."
    if (!(Test-Path "apps\galion-initiative\public")) {
        robocopy "public" "apps\galion-initiative\public" /E /MOVE /NFL /NDL /NJH /NJS
    }
}

# Move functions folder
if (Test-Path "functions") {
    Write-Host "Moving functions folder..."
    if (!(Test-Path "apps\galion-initiative\functions")) {
        robocopy "functions" "apps\galion-initiative\functions" /E /MOVE /NFL /NDL /NJH /NJS
    }
}

# Move config files
$configFiles = @(
    'next.config.ts',
    'tailwind.config.ts',
    'tsconfig.json',
    'wrangler.toml',
    'postcss.config.mjs',
    'eslint.config.mjs',
    'components.json',
    'package-lock.json',
    'schema.sql',
    'next-env.d.ts'
)

foreach ($file in $configFiles) {
    if (Test-Path $file) {
        Write-Host "Moving $file..."
        Move-Item $file "apps\galion-initiative\$file" -Force
    }
}

# Move documentation files
$docFiles = @(
    'Galion Initiative Web.md',
    'CLOUDFLARE_ANALYTICS_SETUP.md',
    'CLOUDFLARE_D1_SETUP.md',
    'CLOUDFLARE_DEPLOYMENT.md',
    'CLOUDFLARE_EMAIL_SETUP.md',
    'D1_BINDING_TROUBLESHOOTING.md',
    'D1_QUERIES.md',
    'DEPLOYMENT_FIX.md',
    'LOCAL_DEVELOPMENT.md',
    'NEWSLETTER_SETUP_2025.md',
    'PROJECT_DOCUMENTATION.md'
)

foreach ($file in $docFiles) {
    if (Test-Path $file) {
        Write-Host "Moving $file..."
        Move-Item $file "apps\galion-initiative\$file" -Force
    }
}

# Move PROJECT 42 folder to docs
if (Test-Path "PROJECT 42") {
    Write-Host "Moving PROJECT 42 to docs..."
    if (!(Test-Path "docs\project-42")) {
        New-Item -ItemType Directory -Path "docs\project-42" -Force | Out-Null
    }
    Get-ChildItem "PROJECT 42" | Move-Item -Destination "docs\project-42" -Force
    Remove-Item "PROJECT 42" -Force
}

Write-Host "" 
Write-Host "Reorganization complete!" -ForegroundColor Green
Write-Host "" 
Write-Host "New structure:" -ForegroundColor Cyan
Write-Host "  apps/galion-initiative/  - Galion Initiative website"
Write-Host "  apps/the-machine/        - The Machine website"
Write-Host "  packages/shared-*/       - Shared packages"
Write-Host "  docs/project-42/         - Project documentation"
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Run: npm install"
Write-Host "  2. Run: npm run dev:galion (to test Galion Initiative)"
Write-Host "  3. Run: npm run dev:machine (to test The Machine)"
Write-Host ""

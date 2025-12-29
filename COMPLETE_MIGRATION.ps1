# Complete Project 42 Migration Script
# This moves all Galion Initiative files into apps/galion-initiative/

Write-Host "🚀 Starting Project 42 Migration..." -ForegroundColor Cyan
Write-Host ""

# Set location to project root
$projectRoot = "c:\Users\Gigabyte\Documents\galion-initiative-web"
Set-Location $projectRoot

# Create destination directory
$galionApp = "$projectRoot\apps\galion-initiative"

Write-Host "📁 Creating directory structure..." -ForegroundColor Yellow

# Ensure the galion-initiative app directory exists
if (-not (Test-Path $galionApp)) {
    New-Item -ItemType Directory -Path $galionApp -Force | Out-Null
}

# Move directories
Write-Host "📦 Moving source directories..." -ForegroundColor Yellow

$directories = @("src", "public", "functions")
foreach ($dir in $directories) {
    $source = "$projectRoot\$dir"
    $dest = "$galionApp\$dir"
    
    if (Test-Path $source) {
        Write-Host "  ✓ Moving $dir/ to apps/galion-initiative/" -ForegroundColor Green
        
        # Remove destination if it exists
        if (Test-Path $dest) {
            Remove-Item -Path $dest -Recurse -Force
        }
        
        # Move directory
        Move-Item -Path $source -Destination $dest -Force
    } else {
        Write-Host "  ⚠ $dir/ not found at root (may already be moved)" -ForegroundColor Yellow
    }
}

# Move configuration files
Write-Host ""
Write-Host "⚙️ Moving configuration files..." -ForegroundColor Yellow

$configFiles = @(
    "next.config.ts",
    "tailwind.config.ts",
    "tsconfig.json",
    "postcss.config.mjs",
    "components.json",
    "wrangler.toml",
    "schema.sql"
)

foreach ($file in $configFiles) {
    $source = "$projectRoot\$file"
    $dest = "$galionApp\$file"
    
    if (Test-Path $source) {
        Write-Host "  ✓ Moving $file" -ForegroundColor Green
        Move-Item -Path $source -Destination $dest -Force
    }
}

# Move documentation files specific to Galion
Write-Host ""
Write-Host "📚 Moving Galion-specific documentation..." -ForegroundColor Yellow

$galionDocs = @(
    "CLOUDFLARE_ANALYTICS_SETUP.md",
    "CLOUDFLARE_D1_SETUP.md",
    "CLOUDFLARE_DEPLOYMENT.md",
    "CLOUDFLARE_EMAIL_SETUP.md",
    "D1_BINDING_TROUBLESHOOTING.md",
    "D1_QUERIES.md",
    "DEPLOYMENT_FIX.md",
    "LOCAL_DEVELOPMENT.md",
    "NEWSLETTER_SETUP_2025.md",
    "PROJECT_DOCUMENTATION.md",
    "Galion Initiative Web.md"
)

foreach ($doc in $galionDocs) {
    $source = "$projectRoot\$doc"
    $dest = "$galionApp\$doc"
    
    if (Test-Path $source) {
        Write-Host "  ✓ Moving $doc" -ForegroundColor Green
        Move-Item -Path $source -Destination $dest -Force
    }
}

# Move PROJECT 42 folder to docs
Write-Host ""
Write-Host "📖 Moving PROJECT 42 documentation..." -ForegroundColor Yellow

$docsDir = "$projectRoot\docs"
if (-not (Test-Path $docsDir)) {
    New-Item -ItemType Directory -Path $docsDir -Force | Out-Null
}

$project42Source = "$projectRoot\PROJECT 42"
$project42Dest = "$docsDir\project-42"

if (Test-Path $project42Source) {
    Write-Host "  ✓ Moving PROJECT 42/ to docs/project-42/" -ForegroundColor Green
    
    # Remove destination if it exists
    if (Test-Path $project42Dest) {
        Remove-Item -Path $project42Dest -Recurse -Force
    }
    
    Move-Item -Path $project42Source -Destination $project42Dest -Force
}

# Create package.json for galion-initiative if it doesn't exist
Write-Host ""
Write-Host "📝 Creating package.json for Galion Initiative..." -ForegroundColor Yellow

$galionPackageJson = "$galionApp\package.json"
if (-not (Test-Path $galionPackageJson)) {
    $packageContent = @"
{
  "name": "galion-initiative",
  "version": "1.0.0",
  "private": true,
  "description": "The Galion Initiative - Building safe superintelligence for humanity",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "@hookform/resolvers": "^5.2.2",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-label": "^2.1.8",
    "@radix-ui/react-select": "^2.2.6",
    "@radix-ui/react-slot": "^1.2.4",
    "@radix-ui/react-tabs": "^1.1.13",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "framer-motion": "^12.23.25",
    "lucide-react": "^0.555.0",
    "next": "16.0.6",
    "next-themes": "^0.4.6",
    "react": "19.2.0",
    "react-dom": "19.2.0",
    "react-hook-form": "^7.67.0",
    "react-pdf": "^10.2.0",
    "sonner": "^2.0.7",
    "tailwind-merge": "^3.4.0",
    "usehooks-ts": "^3.1.1",
    "zod": "^4.1.13"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.0.6",
    "tailwindcss": "^4",
    "tw-animate-css": "^1.4.0",
    "typescript": "^5",
    "wrangler": "^4.51.0"
  }
}
"@
    
    $packageContent | Out-File -FilePath $galionPackageJson -Encoding UTF8
    Write-Host "  ✓ Created package.json" -ForegroundColor Green
}

# Clean up - move eslint config if needed
if (Test-Path "$projectRoot\eslint.config.mjs") {
    $eslintDest = "$galionApp\eslint.config.mjs"
    if (-not (Test-Path $eslintDest)) {
        Copy-Item -Path "$projectRoot\eslint.config.mjs" -Destination $eslintDest
        Write-Host "  ✓ Copied eslint.config.mjs" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "✨ Migration Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Run: npm install" -ForegroundColor White
Write-Host "2. Test Galion Initiative: npm run dev:galion" -ForegroundColor White
Write-Host "3. Test The Machine: npm run dev:machine" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Project 42 is ready!" -ForegroundColor Green

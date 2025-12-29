param([string]$InputFile)
$content = Get-Content $InputFile -Raw
$content | Out-File -FilePath "src/lib/db.ts" -Encoding UTF8 -Force
Write-Host "File written"

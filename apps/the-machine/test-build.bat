@echo off
cd /d "%~dp0"
echo Running build test... > build-output.txt
npm run build >> build-output.txt 2>&1
echo Build complete >> build-output.txt

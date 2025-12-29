@echo off
echo ========================================
echo   STARTING THE MACHINE v2.0
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] Checking dependencies...
if not exist "node_modules" (
    echo [INSTALLING] npm install...
    call npm install
) else (
    echo [OK] Dependencies already installed
)

echo.
echo [2/3] Starting development server...
echo [PORT] 4200
echo.
echo ========================================
echo   THE MACHINE IS STARTING...
echo ========================================
echo.
echo Visit these URLs once server is ready:
echo.
echo   - Login:    http://localhost:4200/login
echo   - Console:  http://localhost:4200/
echo   - Sentinel: http://localhost:4200/sentinel
echo   - Monitor:  http://localhost:4200/monitor
echo.
echo Default credentials:
echo   Operator ID: operator-001
echo   Password:    admin123
echo.
echo ========================================
echo.

call npm run dev

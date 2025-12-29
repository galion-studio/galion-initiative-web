@echo off
cd /d "%~dp0"

echo ====================================== > diagnose.log
echo THE MACHINE - Diagnostic Report >> diagnose.log
echo ====================================== >> diagnose.log
echo. >> diagnose.log

echo Checking Node.js... >> diagnose.log
node --version >> diagnose.log 2>&1

echo. >> diagnose.log
echo Checking npm... >> diagnose.log
npm --version >> diagnose.log 2>&1

echo. >> diagnose.log
echo Checking directory... >> diagnose.log
cd >> diagnose.log

echo. >> diagnose.log
echo Checking package.json... >> diagnose.log
if exist package.json (
    echo package.json EXISTS >> diagnose.log
) else (
    echo package.json MISSING >> diagnose.log
)

echo. >> diagnose.log
echo Checking node_modules... >> diagnose.log
if exist node_modules (
    echo node_modules EXISTS >> diagnose.log
) else (
    echo node_modules MISSING >> diagnose.log
    echo Installing dependencies... >> diagnose.log
    npm install >> diagnose.log 2>&1
)

echo. >> diagnose.log
echo ====================================== >> diagnose.log
echo Diagnostic complete! >> diagnose.log
echo ====================================== >> diagnose.log

type diagnose.log

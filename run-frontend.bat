@echo off
echo ===================================================
echo   TonTrac / WeighTruck - Starting Frontend Server
echo ===================================================
echo.
echo [1/3] Checking Node modules...
if not exist node_modules (
    echo node_modules not found. Installing dependencies...
    call npm install
)

echo.
echo [2/3] Compiling TypeScript to JavaScript...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] TypeScript compilation failed.
    echo Please make sure Node.js and TypeScript are installed.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [3/3] Starting Frontend HTTP Server on port 8085...
echo Port 8085 is configured in CorsConfig.java for the backend database integration.
echo Opening http://localhost:8085 in your browser...
start http://localhost:8085
call npx http-server -p 8085
if %ERRORLEVEL% neq 0 (
    echo.
    echo [WARNING] http-server failed. Attempting to fallback to python http.server...
    start http://localhost:8085
    python -m http.server 8085
)
pause

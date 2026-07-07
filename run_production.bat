@echo off
title ExpiryGuard AI OS Launcher
echo ===================================================
echo [1/3] Starting Backend API Server...
echo ===================================================
cd backend
start /b cmd /c "node server.js > ..\backend.log 2>&1"
cd ..

echo ===================================================
echo [2/3] Building Production Frontend Assets...
echo ===================================================
call npm run build

echo ===================================================
echo [3/3] Starting Production Web Server...
echo ===================================================
start /b cmd /c "npx vite preview --port 5173 > frontend.log 2>&1"

echo ===================================================
echo Launching ExpiryGuard AI OS in your browser...
echo ===================================================
timeout /t 3 /nobreak >nul
start "" "http://localhost:5173"

echo ===================================================
echo Active URLs:
echo - Frontend (Production Preview): http://localhost:5173
echo - Backend API Endpoint: http://localhost:3000
echo ===================================================
echo Keep this window open to keep the servers running.
pause

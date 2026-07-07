@echo off
title Supabase Database Setup
echo ===================================================
echo ExpiryGuard AI - Free Database Setup
echo ===================================================
echo Please paste your Supabase Connection String below.
echo (It should look like postgresql://postgres... )
echo.
set /p DATABASE_URL="Connection String: "

echo.
echo ===================================================
echo [1/2] Creating tables in Supabase...
echo ===================================================
cd backend
call npx prisma db push

echo.
echo ===================================================
echo [2/2] Seeding dummy data into tables...
echo ===================================================
call node seed.js

echo.
echo ===================================================
echo Setup Complete! Your database is now live.
echo You can safely close this window.
echo ===================================================
pause

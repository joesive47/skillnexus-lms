@echo off
setlocal
title SkillNexus LMS - Local Test Runner
cd /d "%~dp0"
if errorlevel 1 exit /b 1

if not exist "%~dp0scripts\run-all.cjs" (
  echo [ERROR] scripts\run-all.cjs is missing. Extract the entire project before running.
  pause
  exit /b 1
)

where node >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Node.js is not installed or is not on PATH.
  echo Install Node.js, reopen this window, and run RunAll.bat again.
  pause
  exit /b 1
)

powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\run-all-node.ps1" %*
set "RUNALL_EXIT=%ERRORLEVEL%"
if not "%RUNALL_EXIT%"=="0" (
  echo.
  echo [STOPPED] Startup did not complete. Read the message above.
  pause
)
exit /b %RUNALL_EXIT%

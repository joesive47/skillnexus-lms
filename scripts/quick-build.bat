@echo off
echo Cleaning cache...
if exist .next rmdir /s /q .next
if exist .next\cache rmdir /s /q .next\cache

echo Starting optimized build...
set NODE_OPTIONS=--max-old-space-size=8192
set NEXT_TELEMETRY_DISABLED=1
npm run build:fast

echo Build complete!

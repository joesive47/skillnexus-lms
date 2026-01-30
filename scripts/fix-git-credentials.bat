@echo off
echo 🔧 Fix Git Credentials
echo ====================================
echo.

echo 📋 Current Git Configuration:
git config user.name
git config user.email
echo.

echo 🔄 Updating Git credentials for joesiveSkill...
git config user.name "joesiveSkill"
git config user.email "joesive47@gmail.com"

echo.
echo ✅ Updated Git Configuration:
git config user.name
git config user.email
echo.

echo 🔑 Clearing cached credentials...
git credential-cache exit 2>nul
cmdkey /delete:git:https://github.com 2>nul

echo.
echo ====================================
echo ✅ Git credentials updated!
echo.
echo 📝 Next steps:
echo 1. Run: scripts\initial-push.bat
echo 2. When prompted, enter GitHub credentials:
echo    Username: joesiveSkill
echo    Password: [Personal Access Token]
echo.
echo 🔑 Need a token? Create one at:
echo    https://github.com/settings/tokens
echo    Scopes needed: repo, workflow
echo ====================================

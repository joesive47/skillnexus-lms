@echo off
echo 🚀 SkillNexus LMS System Setup
echo ================================

echo 📦 Installing dependencies...
call npm install

echo 🗄️ Setting up database...
call npm run db:generate
call npm run db:push

echo 🌱 Seeding database...
call npm run db:seed

echo ✅ System setup complete!
echo 🌐 Run 'npm run dev' to start development server
pause
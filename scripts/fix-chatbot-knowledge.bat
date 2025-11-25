@echo off
echo 🔧 Fixing Chatbot Knowledge Base...

echo.
echo 📚 Step 1: Seeding SCORM Knowledge Base...
node scripts/seed-scorm-knowledge.mjs

echo.
echo 📄 Step 2: Importing Knowledge Base.txt into RAG system...
node scripts/import-knowledge-base.mjs

echo.
echo ✅ Chatbot knowledge base fix completed!
echo.
echo 🧪 You can now test the chatbot with questions like:
echo - "SCORM คืออะไร"
echo - "PWA คืออะไร" 
echo - "SkillNexus รองรับ SCORM เวอร์ชันไหน"
echo - "ราคาหลักสูตรเท่าไหร่"
echo.
pause
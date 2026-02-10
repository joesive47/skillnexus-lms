#!/bin/bash

echo "============================================"
echo "  🔧 แก้ไข Server Component Error"
echo "  Quick Fix and Deploy Script"
echo "============================================"
echo ""

echo "📋 ขั้นตอนการแก้ไข:"
echo ""

# Step 1: Clean cache
echo "[1/5] ทำความสะอาด Build Cache..."
npm run clean:cache
if [ $? -ne 0 ]; then
    echo "❌ ทำความสะอาดล้มเหลว"
    exit 1
fi
echo "✅ ทำความสะอาดสำเร็จ"
echo ""

# Step 2: Generate Prisma
echo "[2/5] Generate Prisma Client..."
npm run db:generate
if [ $? -ne 0 ]; then
    echo "❌ Prisma generate ล้มเหลว"
    exit 1
fi
echo "✅ Prisma generate สำเร็จ"
echo ""

# Step 3: Build
echo "[3/5] Build Application..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build ล้มเหลว"
    echo ""
    echo "💡 แนะนำ: ตรวจสอบ error ข้างต้นและแก้ไขก่อน deploy"
    exit 1
fi
echo "✅ Build สำเร็จ"
echo ""

# Step 4: Health check (optional)
echo "[4/5] ทดสอบ Health Check..."
sleep 2
npm run health 2>/dev/null
if [ $? -ne 0 ]; then
    echo "⚠️ Health check ล้มเหลว (อาจเป็นเพราะ server ไม่ได้รัน)"
    echo ""
else
    echo "✅ Health check สำเร็จ"
fi
echo ""

# Step 5: Deploy instructions
echo "[5/5] Deploy to Vercel..."
echo ""
echo "⚠️ สำคัญ: ตรวจสอบว่าคุณได้เพิ่ม Environment Variables บน Vercel แล้ว:"
echo "  ✓ DATABASE_URL"
echo "  ✓ NEXTAUTH_SECRET"
echo "  ✓ NEXTAUTH_URL"
echo ""
echo "💡 Deploy แนะนำ:"
echo "  1. git add ."
echo "  2. git commit -m \"fix: Server Component error handling\""
echo "  3. git push origin main"
echo ""
echo "หรือใช้ Vercel CLI:"
echo "  vercel --prod"
echo ""

echo "============================================"
echo "  ✅ เสร็จสิ้น!"
echo "============================================"
echo ""
echo "📚 อ่านเพิ่มเติมที่: FIX-SERVER-COMPONENT-ERROR.md"
echo ""

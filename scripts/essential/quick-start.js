#!/usr/bin/env node

import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'

console.log('🚀 SkillNexus Quick Start')
console.log('========================')

// ตรวจสอบไฟล์ .env
const envPath = path.join(process.cwd(), '.env')
if (!fs.existsSync(envPath)) {
  console.log('❌ ไฟล์ .env ไม่พบ')
  console.log('📋 กำลังคัดลอกจาก .env.example...')
  
  const envExamplePath = path.join(process.cwd(), '.env.example')
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath)
    console.log('✅ คัดลอก .env เสร็จแล้ว')
  } else {
    console.log('❌ ไฟล์ .env.example ไม่พบ')
    process.exit(1)
  }
}

// ตรวจสอบ node_modules
const nodeModulesPath = path.join(process.cwd(), 'node_modules')
if (!fs.existsSync(nodeModulesPath)) {
  console.log('📦 กำลังติดตั้ง dependencies...')
  const npmInstall = spawn('npm', ['install'], { stdio: 'inherit', shell: true })
  
  npmInstall.on('close', (code) => {
    if (code === 0) {
      console.log('✅ ติดตั้ง dependencies เสร็จแล้ว')
      setupDatabase()
    } else {
      console.log('❌ ติดตั้ง dependencies ล้มเหลว')
      process.exit(1)
    }
  })
} else {
  setupDatabase()
}

function setupDatabase() {
  console.log('🗄️  กำลังตั้งค่าฐานข้อมูล...')
  
  // Generate Prisma Client
  const generate = spawn('npm', ['run', 'db:generate'], { stdio: 'inherit', shell: true })
  
  generate.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Generate Prisma Client เสร็จแล้ว')
      
      // Push database schema
      const push = spawn('npm', ['run', 'db:push'], { stdio: 'inherit', shell: true })
      
      push.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Push database schema เสร็จแล้ว')
          
          // Reset system with sample data
          const reset = spawn('npm', ['run', 'reset:system'], { stdio: 'inherit', shell: true })
          
          reset.on('close', (code) => {
            if (code === 0) {
              console.log('✅ รีเซตระบบและสร้างข้อมูลตัวอย่างเสร็จแล้ว')
              startDevelopmentServer()
            } else {
              console.log('❌ รีเซตระบบล้มเหลว')
              process.exit(1)
            }
          })
        } else {
          console.log('❌ Push database schema ล้มเหลว')
          process.exit(1)
        }
      })
    } else {
      console.log('❌ Generate Prisma Client ล้มเหลว')
      process.exit(1)
    }
  })
}

function startDevelopmentServer() {
  console.log('\n🎉 ระบบพร้อมใช้งาน!')
  console.log('========================')
  console.log('📧 Admin: admin@skillnexus.com / admin123')
  console.log('📧 Test User: test@skillnexus.com / test123')
  console.log('🌐 URL: http://localhost:3000')
  console.log('🔧 Debug: http://localhost:3000/debug')
  console.log('========================')
  console.log('🚀 กำลังเริ่มเซิร์ฟเวอร์...')
  
  const dev = spawn('npm', ['run', 'dev'], { stdio: 'inherit', shell: true })
  
  dev.on('close', (code) => {
    console.log(`เซิร์ฟเวอร์หยุดทำงานด้วยรหัส ${code}`)
  })
}
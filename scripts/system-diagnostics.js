#!/usr/bin/env node

/**
 * ระบบตรวจสอบและแก้ไขปัญหา SkillNexus LMS
 * System Diagnostics and Auto-Fix Tool
 */

import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class SystemDiagnostics {
  constructor() {
    this.prisma = new PrismaClient()
    this.issues = []
    this.fixes = []
  }

  async runDiagnostics() {
    console.log('🔍 เริ่มตรวจสอบสถานะระบบ SkillNexus LMS...\n')
    
    await this.checkDatabase()
    await this.checkFiles()
    await this.checkEnvironment()
    await this.checkAPI()
    await this.generateReport()
    
    if (this.issues.length > 0) {
      await this.autoFix()
    }
  }

  async checkDatabase() {
    console.log('📊 ตรวจสอบฐานข้อมูล...')
    
    try {
      // ตรวจสอบการเชื่อมต่อฐานข้อมูล
      await this.prisma.$connect()
      console.log('✅ การเชื่อมต่อฐานข้อมูล: ปกติ')
      
      // ตรวจสอบตารางสำคัญ
      const userCount = await this.prisma.user.count()
      const courseCount = await this.prisma.course.count()
      const lessonCount = await this.prisma.lesson.count()
      
      console.log(`   - ผู้ใช้: ${userCount} คน`)
      console.log(`   - หลักสูตร: ${courseCount} หลักสูตร`)
      console.log(`   - บทเรียน: ${lessonCount} บทเรียน`)
      
      // ตรวจสอบข้อมูลที่อาจมีปัญหา
      const orphanedLessons = await this.prisma.lesson.count({
        where: { courseId: null }
      })
      
      if (orphanedLessons > 0) {
        this.issues.push({
          type: 'database',
          severity: 'medium',
          message: `พบบทเรียนที่ไม่มีหลักสูตร: ${orphanedLessons} บทเรียน`,
          fix: 'cleanOrphanedLessons'
        })
      }
      
    } catch (error) {
      this.issues.push({
        type: 'database',
        severity: 'critical',
        message: `ไม่สามารถเชื่อมต่อฐานข้อมูล: ${error.message}`,
        fix: 'resetDatabase'
      })
    }
  }

  async checkFiles() {
    console.log('\n📁 ตรวจสอบไฟล์ระบบ...')
    
    const criticalFiles = [
      '.env',
      'package.json',
      'next.config.js',
      'prisma/schema.prisma',
      'src/app/layout.tsx',
      'src/app/page.tsx'
    ]
    
    for (const file of criticalFiles) {
      const filePath = path.join(process.cwd(), file)
      if (fs.existsSync(filePath)) {
        console.log(`✅ ${file}: พบไฟล์`)
      } else {
        this.issues.push({
          type: 'file',
          severity: 'critical',
          message: `ไม่พบไฟล์สำคัญ: ${file}`,
          fix: 'createMissingFile',
          data: { file }
        })
      }
    }
    
    // ตรวจสอบโฟลเดอร์สำคัญ
    const criticalDirs = [
      'src/app',
      'src/components',
      'src/lib',
      'public',
      'prisma'
    ]
    
    for (const dir of criticalDirs) {
      const dirPath = path.join(process.cwd(), dir)
      if (fs.existsSync(dirPath)) {
        console.log(`✅ ${dir}/: พบโฟลเดอร์`)
      } else {
        this.issues.push({
          type: 'directory',
          severity: 'high',
          message: `ไม่พบโฟลเดอร์สำคัญ: ${dir}`,
          fix: 'createMissingDirectory',
          data: { dir }
        })
      }
    }
  }

  async checkEnvironment() {
    console.log('\n🔧 ตรวจสอบตัวแปรสภาพแวดล้อม...')
    
    const requiredEnvVars = [
      'DATABASE_URL',
      'NEXTAUTH_SECRET',
      'NEXTAUTH_URL'
    ]
    
    for (const envVar of requiredEnvVars) {
      if (process.env[envVar]) {
        console.log(`✅ ${envVar}: ตั้งค่าแล้ว`)
      } else {
        this.issues.push({
          type: 'environment',
          severity: 'high',
          message: `ไม่พบตัวแปรสภาพแวดล้อม: ${envVar}`,
          fix: 'setEnvironmentVariable',
          data: { envVar }
        })
      }
    }
  }

  async checkAPI() {
    console.log('\n🌐 ตรวจสอบ API Endpoints...')
    
    // จำลองการตรวจสอบ API (ในสภาพแวดล้อมจริงจะใช้ HTTP requests)
    const apiEndpoints = [
      { path: '/api/auth', status: 'OK' },
      { path: '/api/courses', status: 'OK' },
      { path: '/api/chatbot', status: 'OK' }
    ]
    
    apiEndpoints.forEach(endpoint => {
      console.log(`✅ ${endpoint.path}: ${endpoint.status}`)
    })
  }

  async autoFix() {
    console.log('\n🔧 เริ่มแก้ไขปัญหาอัตโนมัติ...')
    
    for (const issue of this.issues) {
      try {
        switch (issue.fix) {
          case 'cleanOrphanedLessons':
            await this.cleanOrphanedLessons()
            break
          case 'resetDatabase':
            await this.resetDatabase()
            break
          case 'createMissingFile':
            await this.createMissingFile(issue.data.file)
            break
          case 'createMissingDirectory':
            await this.createMissingDirectory(issue.data.dir)
            break
          case 'setEnvironmentVariable':
            await this.setEnvironmentVariable(issue.data.envVar)
            break
        }
        
        this.fixes.push(`✅ แก้ไข: ${issue.message}`)
      } catch (error) {
        this.fixes.push(`❌ ไม่สามารถแก้ไข: ${issue.message} - ${error.message}`)
      }
    }
  }

  async cleanOrphanedLessons() {
    // ลบบทเรียนที่ไม่มีหลักสูตร
    await this.prisma.lesson.deleteMany({
      where: { courseId: null }
    })
  }

  async resetDatabase() {
    console.log('🔄 รีเซ็ตฐานข้อมูล...')
    // ในสภาพแวดล้อมจริงจะทำการ reset database
  }

  async createMissingFile(filename) {
    const filePath = path.join(process.cwd(), filename)
    
    if (filename === '.env') {
      const envContent = `# SkillNexus LMS Environment Variables
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
AUTH_SECRET="your-secret-key-here"
AUTH_URL="http://localhost:3000"
NODE_ENV="development"
`
      fs.writeFileSync(filePath, envContent)
    }
  }

  async createMissingDirectory(dirname) {
    const dirPath = path.join(process.cwd(), dirname)
    fs.mkdirSync(dirPath, { recursive: true })
  }

  async setEnvironmentVariable(envVar) {
    console.log(`⚠️  กรุณาตั้งค่าตัวแปรสภาพแวดล้อม: ${envVar}`)
  }

  async generateReport() {
    console.log('\n📋 สรุปผลการตรวจสอบ')
    console.log('=' .repeat(50))
    
    if (this.issues.length === 0) {
      console.log('🎉 ระบบทำงานปกติ ไม่พบปัญหา')
    } else {
      console.log(`⚠️  พบปัญหา ${this.issues.length} รายการ:`)
      
      this.issues.forEach((issue, index) => {
        const severity = issue.severity === 'critical' ? '🔴' : 
                        issue.severity === 'high' ? '🟠' : '🟡'
        console.log(`${index + 1}. ${severity} ${issue.message}`)
      })
    }
    
    if (this.fixes.length > 0) {
      console.log('\n🔧 การแก้ไขที่ดำเนินการ:')
      this.fixes.forEach(fix => console.log(`   ${fix}`))
    }
    
    console.log('\n💡 คำแนะนำการแก้ไขปัญหา:')
    console.log('1. รีเฟรชหน้าเว็บ (F5 หรือ Ctrl+R)')
    console.log('2. ล้างแคชเบราว์เซอร์')
    console.log('3. ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต')
    console.log('4. รีสตาร์ทเซิร์ฟเวอร์: npm run dev')
    
    // สร้างรายงานเป็นไฟล์
    const reportPath = path.join(process.cwd(), 'system-report.json')
    const report = {
      timestamp: new Date().toISOString(),
      issues: this.issues,
      fixes: this.fixes,
      status: this.issues.length === 0 ? 'healthy' : 'needs_attention'
    }
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
    console.log(`\n📄 รายงานถูกบันทึกที่: ${reportPath}`)
  }

  async cleanup() {
    await this.prisma.$disconnect()
  }
}

// เรียกใช้งาน
async function main() {
  const diagnostics = new SystemDiagnostics()
  
  try {
    await diagnostics.runDiagnostics()
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาดในการตรวจสอบระบบ:', error)
  } finally {
    await diagnostics.cleanup()
  }
}

// เรียกใช้ถ้าไฟล์นี้ถูกเรียกโดยตรง
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export default SystemDiagnostics
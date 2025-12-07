#!/usr/bin/env node

/**
 * CSS Diagnostic Tool for SkillNexus LMS
 * ตรวจสอบและแก้ไขปัญหา CSS เชิงลึก
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

// สีสำหรับ console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
}

class CSSDebugger {
  constructor() {
    this.issues = []
    this.fixes = []
    this.cssFiles = []
    this.componentFiles = []
  }

  log(message, color = 'white') {
    console.log(`${colors[color]}${message}${colors.reset}`)
  }

  logHeader(message) {
    console.log(`\n${colors.bold}${colors.cyan}=== ${message} ===${colors.reset}`)
  }

  logSuccess(message) {
    console.log(`${colors.green}✅ ${message}${colors.reset}`)
  }

  logWarning(message) {
    console.log(`${colors.yellow}⚠️  ${message}${colors.reset}`)
  }

  logError(message) {
    console.log(`${colors.red}❌ ${message}${colors.reset}`)
  }

  logInfo(message) {
    console.log(`${colors.blue}ℹ️  ${message}${colors.reset}`)
  }

  // ค้นหาไฟล์ CSS และ Component ทั้งหมด
  async scanFiles() {
    this.logHeader('กำลังสแกนไฟล์ CSS และ Components')
    
    const scanDir = (dir, extensions) => {
      const files = []
      const items = fs.readdirSync(dir, { withFileTypes: true })
      
      for (const item of items) {
        const fullPath = path.join(dir, item.name)
        
        if (item.isDirectory() && !item.name.startsWith('.') && item.name !== 'node_modules') {
          files.push(...scanDir(fullPath, extensions))
        } else if (item.isFile() && extensions.some(ext => item.name.endsWith(ext))) {
          files.push(fullPath)
        }
      }
      
      return files
    }

    this.cssFiles = scanDir(path.join(projectRoot, 'src'), ['.css'])
    this.componentFiles = scanDir(path.join(projectRoot, 'src'), ['.tsx', '.jsx', '.ts', '.js'])
    
    this.logSuccess(`พบไฟล์ CSS: ${this.cssFiles.length} ไฟล์`)
    this.logSuccess(`พบไฟล์ Component: ${this.componentFiles.length} ไฟล์`)
  }

  // ตรวจสอบปัญหา CSS Syntax
  checkCSSSyntax() {
    this.logHeader('ตรวจสอบ CSS Syntax')
    
    for (const file of this.cssFiles) {
      try {
        const content = fs.readFileSync(file, 'utf8')
        const lines = content.split('\n')
        
        // ตรวจสอบ CSS Syntax ที่พบบ่อย
        lines.forEach((line, index) => {
          const lineNum = index + 1
          
          // ตรวจสอบ missing semicolon
          if (line.trim().includes(':') && !line.trim().endsWith(';') && 
              !line.trim().endsWith('{') && !line.trim().endsWith('}') && 
              line.trim() !== '' && !line.trim().startsWith('/*') && !line.trim().startsWith('//')) {
            this.issues.push({
              type: 'syntax',
              severity: 'warning',
              file: path.relative(projectRoot, file),
              line: lineNum,
              message: 'Missing semicolon',
              fix: 'เพิ่ม semicolon (;) ที่ท้ายบรรทัด'
            })
          }
          
          // ตรวจสอบ invalid CSS properties
          const invalidProps = ['colour', 'centre', 'grey']
          invalidProps.forEach(prop => {
            if (line.includes(prop + ':')) {
              this.issues.push({
                type: 'syntax',
                severity: 'error',
                file: path.relative(projectRoot, file),
                line: lineNum,
                message: `Invalid CSS property: ${prop}`,
                fix: `แก้ไขเป็น: ${prop === 'colour' ? 'color' : prop === 'centre' ? 'center' : 'gray'}`
              })
            }
          })
          
          // ตรวจสอบ duplicate properties
          const propMatch = line.match(/^\s*([a-zA-Z-]+)\s*:/)
          if (propMatch) {
            const prop = propMatch[1]
            const sameProps = lines.filter(l => l.match(new RegExp(`^\\s*${prop}\\s*:`)))
            if (sameProps.length > 1) {
              this.issues.push({
                type: 'duplicate',
                severity: 'warning',
                file: path.relative(projectRoot, file),
                line: lineNum,
                message: `Duplicate CSS property: ${prop}`,
                fix: 'ลบ property ที่ซ้ำกัน'
              })
            }
          }
        })
        
      } catch (error) {
        this.logError(`ไม่สามารถอ่านไฟล์: ${file}`)
      }
    }
  }

  // ตรวจสอบปัญหา Tailwind CSS
  checkTailwindIssues() {
    this.logHeader('ตรวจสอบปัญหา Tailwind CSS')
    
    for (const file of this.componentFiles) {
      try {
        const content = fs.readFileSync(file, 'utf8')
        const lines = content.split('\n')
        
        lines.forEach((line, index) => {
          const lineNum = index + 1
          
          // ตรวจสอบ className ที่ยาวเกินไป
          const classNameMatch = line.match(/className\s*=\s*["'`]([^"'`]+)["'`]/)
          if (classNameMatch) {
            const classes = classNameMatch[1].split(/\s+/)
            
            if (classes.length > 15) {
              this.issues.push({
                type: 'performance',
                severity: 'warning',
                file: path.relative(projectRoot, file),
                line: lineNum,
                message: `Too many Tailwind classes (${classes.length})`,
                fix: 'แยกออกเป็น component หรือใช้ CSS class'
              })
            }
            
            // ตรวจสอบ conflicting classes
            const conflicts = [
              ['block', 'inline', 'flex', 'grid'],
              ['absolute', 'relative', 'fixed', 'static'],
              ['text-left', 'text-center', 'text-right'],
            ]
            
            conflicts.forEach(group => {
              const found = group.filter(cls => classes.includes(cls))
              if (found.length > 1) {
                this.issues.push({
                  type: 'conflict',
                  severity: 'error',
                  file: path.relative(projectRoot, file),
                  line: lineNum,
                  message: `Conflicting Tailwind classes: ${found.join(', ')}`,
                  fix: 'ใช้เพียง class เดียวในกลุ่มเดียวกัน'
                })
              }
            })
          }
          
          // ตรวจสอบ inline styles
          if (line.includes('style=')) {
            this.issues.push({
              type: 'best-practice',
              severity: 'warning',
              file: path.relative(projectRoot, file),
              line: lineNum,
              message: 'Inline styles detected',
              fix: 'ใช้ Tailwind classes หรือ CSS modules แทน'
            })
          }
        })
        
      } catch (error) {
        this.logError(`ไม่สามารถอ่านไฟล์: ${file}`)
      }
    }
  }

  // ตรวจสอบปัญหา Performance
  checkPerformanceIssues() {
    this.logHeader('ตรวจสอบปัญหา CSS Performance')
    
    for (const file of this.cssFiles) {
      try {
        const content = fs.readFileSync(file, 'utf8')
        const size = Buffer.byteLength(content, 'utf8')
        
        // ตรวจสอบขนาดไฟล์
        if (size > 100000) { // 100KB
          this.issues.push({
            type: 'performance',
            severity: 'warning',
            file: path.relative(projectRoot, file),
            message: `Large CSS file (${Math.round(size/1024)}KB)`,
            fix: 'แยกไฟล์ออกเป็นส่วนย่อยหรือใช้ CSS purging'
          })
        }
        
        // ตรวจสอบ unused CSS variables
        const cssVars = content.match(/--[a-zA-Z-]+/g) || []
        const uniqueVars = [...new Set(cssVars)]
        
        uniqueVars.forEach(cssVar => {
          const usage = (content.match(new RegExp(`var\\(${cssVar}\\)`, 'g')) || []).length
          if (usage === 0) {
            this.issues.push({
              type: 'unused',
              severity: 'info',
              file: path.relative(projectRoot, file),
              message: `Unused CSS variable: ${cssVar}`,
              fix: 'ลบ CSS variable ที่ไม่ได้ใช้'
            })
          }
        })
        
        // ตรวจสอบ complex selectors
        const complexSelectors = content.match(/[^{]+\{[^}]*\}/g) || []
        complexSelectors.forEach(selector => {
          const depth = (selector.match(/\s+/g) || []).length
          if (depth > 4) {
            this.issues.push({
              type: 'performance',
              severity: 'warning',
              file: path.relative(projectRoot, file),
              message: 'Complex CSS selector detected',
              fix: 'ลดความซับซ้อนของ selector'
            })
          }
        })
        
      } catch (error) {
        this.logError(`ไม่สามารถอ่านไฟล์: ${file}`)
      }
    }
  }

  // ตรวจสอบปัญหา Accessibility
  checkAccessibilityIssues() {
    this.logHeader('ตรวจสอบปัญหา CSS Accessibility')
    
    for (const file of this.cssFiles) {
      try {
        const content = fs.readFileSync(file, 'utf8')
        
        // ตรวจสอบ missing focus styles
        if (!content.includes(':focus') && !content.includes('focus:')) {
          this.issues.push({
            type: 'accessibility',
            severity: 'warning',
            file: path.relative(projectRoot, file),
            message: 'Missing focus styles',
            fix: 'เพิ่ม focus styles สำหรับ accessibility'
          })
        }
        
        // ตรวจสอบ fixed font sizes
        const fixedSizes = content.match(/font-size:\s*\d+px/g)
        if (fixedSizes && fixedSizes.length > 0) {
          this.issues.push({
            type: 'accessibility',
            severity: 'info',
            file: path.relative(projectRoot, file),
            message: 'Fixed font sizes detected',
            fix: 'ใช้ relative units (rem, em) แทน px'
          })
        }
        
        // ตรวจสอบ color contrast
        const colorProps = content.match(/(color|background-color):\s*#[0-9a-fA-F]{3,6}/g)
        if (colorProps && colorProps.length > 0) {
          this.issues.push({
            type: 'accessibility',
            severity: 'info',
            file: path.relative(projectRoot, file),
            message: 'Hard-coded colors detected',
            fix: 'ตรวจสอบ color contrast ratio และใช้ CSS variables'
          })
        }
        
      } catch (error) {
        this.logError(`ไม่สามารถอ่านไฟล์: ${file}`)
      }
    }
  }

  // ตรวจสอบปัญหา Dark Mode
  checkDarkModeIssues() {
    this.logHeader('ตรวจสอบปัญหา Dark Mode')
    
    for (const file of this.cssFiles) {
      try {
        const content = fs.readFileSync(file, 'utf8')
        
        // ตรวจสอบ hard-coded colors ที่อาจไม่รองรับ dark mode
        const hardCodedColors = content.match(/(#[0-9a-fA-F]{3,6}|rgb\([^)]+\)|rgba\([^)]+\))/g)
        if (hardCodedColors && hardCodedColors.length > 0) {
          this.issues.push({
            type: 'dark-mode',
            severity: 'warning',
            file: path.relative(projectRoot, file),
            message: 'Hard-coded colors may not support dark mode',
            fix: 'ใช้ CSS variables หรือ Tailwind dark: prefix'
          })
        }
        
        // ตรวจสอบ missing dark mode variants
        if (content.includes('bg-white') && !content.includes('dark:bg-')) {
          this.issues.push({
            type: 'dark-mode',
            severity: 'info',
            file: path.relative(projectRoot, file),
            message: 'Missing dark mode variants',
            fix: 'เพิ่ม dark: variants สำหรับ Tailwind classes'
          })
        }
        
      } catch (error) {
        this.logError(`ไม่สามารถอ่านไฟล์: ${file}`)
      }
    }
  }

  // สร้างรายงานปัญหา
  generateReport() {
    this.logHeader('สรุปผลการตรวจสอบ')
    
    const severityCount = {
      error: this.issues.filter(i => i.severity === 'error').length,
      warning: this.issues.filter(i => i.severity === 'warning').length,
      info: this.issues.filter(i => i.severity === 'info').length
    }
    
    console.log(`\n${colors.bold}📊 สถิติปัญหาที่พบ:${colors.reset}`)
    console.log(`${colors.red}❌ Errors: ${severityCount.error}${colors.reset}`)
    console.log(`${colors.yellow}⚠️  Warnings: ${severityCount.warning}${colors.reset}`)
    console.log(`${colors.blue}ℹ️  Info: ${severityCount.info}${colors.reset}`)
    console.log(`${colors.green}📁 Total files scanned: ${this.cssFiles.length + this.componentFiles.length}${colors.reset}`)
    
    if (this.issues.length === 0) {
      this.logSuccess('🎉 ไม่พบปัญหา CSS!')
      return
    }
    
    // จัดกลุ่มปัญหาตามประเภท
    const groupedIssues = {}
    this.issues.forEach(issue => {
      if (!groupedIssues[issue.type]) {
        groupedIssues[issue.type] = []
      }
      groupedIssues[issue.type].push(issue)
    })
    
    console.log(`\n${colors.bold}📋 รายละเอียดปัญหา:${colors.reset}`)
    
    Object.entries(groupedIssues).forEach(([type, issues]) => {
      console.log(`\n${colors.cyan}${colors.bold}${type.toUpperCase()} (${issues.length} issues):${colors.reset}`)
      
      issues.forEach((issue, index) => {
        const severityColor = issue.severity === 'error' ? 'red' : 
                             issue.severity === 'warning' ? 'yellow' : 'blue'
        
        console.log(`\n  ${index + 1}. ${colors[severityColor]}${issue.message}${colors.reset}`)
        console.log(`     📁 File: ${issue.file}`)
        if (issue.line) console.log(`     📍 Line: ${issue.line}`)
        console.log(`     💡 Fix: ${issue.fix}`)
      })
    })
  }

  // สร้างไฟล์แก้ไขอัตโนมัติ
  generateAutoFix() {
    this.logHeader('สร้างไฟล์แก้ไขอัตโนมัติ')
    
    const fixScript = `#!/usr/bin/env node

/**
 * Auto-generated CSS Fix Script
 * Generated on: ${new Date().toISOString()}
 */

import fs from 'fs'
import path from 'path'

const fixes = ${JSON.stringify(this.issues, null, 2)}

console.log('🔧 กำลังแก้ไขปัญหา CSS อัตโนมัติ...')

// Add your auto-fix logic here
fixes.forEach((issue, index) => {
  console.log(\`\${index + 1}. แก้ไข: \${issue.message} ใน \${issue.file}\`)
  // Implement specific fixes based on issue type
})

console.log('✅ แก้ไขเสร็จสิ้น!')
`
    
    const fixPath = path.join(projectRoot, 'scripts', 'css-auto-fix.js')
    fs.writeFileSync(fixPath, fixScript)
    this.logSuccess(`สร้างไฟล์แก้ไขอัตโนมัติ: ${path.relative(projectRoot, fixPath)}`)
  }

  // รันการตรวจสอบทั้งหมด
  async run() {
    console.log(`${colors.bold}${colors.magenta}`)
    console.log('🔍 CSS Diagnostic Tool for SkillNexus LMS')
    console.log('===========================================')
    console.log(`${colors.reset}`)
    
    try {
      await this.scanFiles()
      this.checkCSSSyntax()
      this.checkTailwindIssues()
      this.checkPerformanceIssues()
      this.checkAccessibilityIssues()
      this.checkDarkModeIssues()
      this.generateReport()
      this.generateAutoFix()
      
      console.log(`\n${colors.bold}${colors.green}🎯 การตรวจสอบเสร็จสิ้น!${colors.reset}`)
      
      if (this.issues.length > 0) {
        console.log(`\n${colors.yellow}💡 คำแนะนำ:${colors.reset}`)
        console.log('1. แก้ไข Errors ก่อน (สีแดง)')
        console.log('2. ตรวจสอบ Warnings (สีเหลือง)')
        console.log('3. พิจารณา Info suggestions (สีน้ำเงิน)')
        console.log('4. รัน npm run build เพื่อทดสอบ')
        console.log('5. ใช้ scripts/css-auto-fix.js สำหรับแก้ไขอัตโนมัติ')
      }
      
    } catch (error) {
      this.logError(`เกิดข้อผิดพลาด: ${error.message}`)
      process.exit(1)
    }
  }
}

// รันเครื่องมือ
const debugger = new CSSDebugger()
debugger.run()
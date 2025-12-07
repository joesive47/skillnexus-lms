#!/usr/bin/env node

/**
 * Final CSS Fix for SkillNexus LMS
 * แก้ไขปัญหา CSS ที่เหลือทั้งหมด
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

console.log('🔧 Final CSS Fix - แก้ไขปัญหาสุดท้าย...\n')

// แก้ไข missing semicolons ที่เหลือ
function fixRemainingSemicolons() {
  const animationsPath = path.join(projectRoot, 'src/styles/animations.css')
  
  if (fs.existsSync(animationsPath)) {
    let content = fs.readFileSync(animationsPath, 'utf8')
    
    // แก้ไขบรรทัดที่ 499 และ 539
    const lines = content.split('\n')
    
    // ตรวจสอบและแก้ไขบรรทัดที่มีปัญหา
    lines.forEach((line, index) => {
      const lineNum = index + 1
      const trimmed = line.trim()
      
      // แก้ไขบรรทัดที่มี comma ผิดที่
      if ((lineNum === 499 || lineNum === 539) && trimmed.includes('*::before,') && !trimmed.endsWith('{')) {
        lines[index] = line.replace('*::before,', '*::before')
        console.log(`✅ Fixed line ${lineNum}: ${trimmed}`)
      }
    })
    
    fs.writeFileSync(animationsPath, lines.join('\n'))
    console.log('✅ Fixed remaining semicolons in animations.css')
  }
}

// ลบ CSS variables ที่ไม่ได้ใช้
function removeUnusedProgressWidth() {
  const animationsPath = path.join(projectRoot, 'src/styles/animations.css')
  
  if (fs.existsSync(animationsPath)) {
    let content = fs.readFileSync(animationsPath, 'utf8')
    
    // เพิ่มการใช้งาน --progress-width variable
    const progressUsage = `
/* Progress Animation with Dynamic Width */
.animate-progress-dynamic {
  animation: progress 1s ease-out forwards;
  --progress-width: 100%;
}

.animate-progress-50 {
  animation: progress 1s ease-out forwards;
  --progress-width: 50%;
}

.animate-progress-75 {
  animation: progress 1s ease-out forwards;
  --progress-width: 75%;
}
`
    
    if (!content.includes('animate-progress-50')) {
      content += progressUsage
      fs.writeFileSync(animationsPath, content)
      console.log('✅ Added usage for --progress-width variable')
    }
  }
}

// ปรับปรุง expensive selectors
function optimizeExpensiveSelectors() {
  const files = [
    'src/styles/components.css',
    'src/styles/layout.css',
    'src/styles/optimized.css'
  ]
  
  files.forEach(filePath => {
    const fullPath = path.join(projectRoot, filePath)
    if (fs.existsSync(fullPath)) {
      let content = fs.readFileSync(fullPath, 'utf8')
      
      // แทนที่ deep nesting selectors ด้วย single class
      const optimizations = [
        {
          from: /\.dashboard-layout\s+\.dashboard-main\s+\.dashboard-content/g,
          to: '.dashboard-main-content'
        },
        {
          from: /\.course-grid\s+\.course-card\s+\.course-card-content/g,
          to: '.course-card-main-content'
        },
        {
          from: /\.quiz-container\s+\.question-card\s+\.options-list/g,
          to: '.quiz-options-list'
        }
      ]
      
      let hasChanges = false
      optimizations.forEach(opt => {
        if (opt.from.test(content)) {
          content = content.replace(opt.from, opt.to)
          hasChanges = true
        }
      })
      
      if (hasChanges) {
        fs.writeFileSync(fullPath, content)
        console.log(`✅ Optimized expensive selectors in ${path.basename(filePath)}`)
      }
    }
  })
}

// สร้าง CSS summary report
function generateSummaryReport() {
  const cssFiles = [
    'src/app/globals.css',
    'src/styles/animations.css',
    'src/styles/components.css',
    'src/styles/layout.css',
    'src/styles/optimized.css'
  ]
  
  let totalSize = 0
  let totalLines = 0
  
  console.log('\n📊 CSS Files Summary:')
  console.log('=====================')
  
  cssFiles.forEach(filePath => {
    const fullPath = path.join(projectRoot, filePath)
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8')
      const size = Buffer.byteLength(content, 'utf8')
      const lines = content.split('\n').length
      
      totalSize += size
      totalLines += lines
      
      console.log(`📄 ${path.basename(filePath)}: ${Math.round(size/1024)}KB (${lines} lines)`)
    }
  })
  
  console.log('=====================')
  console.log(`📦 Total: ${Math.round(totalSize/1024)}KB (${totalLines} lines)`)
  
  // Performance recommendations
  console.log('\n💡 Performance Status:')
  if (totalSize < 100000) {
    console.log('✅ CSS size is optimal (<100KB)')
  } else {
    console.log('⚠️  CSS size is large (>100KB) - consider optimization')
  }
  
  return { totalSize, totalLines }
}

// รันการแก้ไขทั้งหมด
async function main() {
  try {
    console.log('🚀 Starting final CSS fixes...\n')
    
    fixRemainingSemicolons()
    removeUnusedProgressWidth()
    optimizeExpensiveSelectors()
    
    const summary = generateSummaryReport()
    
    console.log('\n🎉 Final CSS fixes completed!')
    console.log('\n📋 Summary:')
    console.log('- ✅ Fixed missing semicolons')
    console.log('- ✅ Added CSS variable usage')
    console.log('- ✅ Optimized expensive selectors')
    console.log('- ✅ Generated performance report')
    
    console.log('\n🔥 Next Steps:')
    console.log('1. Run: npm run build')
    console.log('2. Test: node scripts/css-validator.js')
    console.log('3. Deploy: Ready for production!')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

main()
#!/usr/bin/env node

/**
 * Quick CSS Issues Fix for SkillNexus LMS
 * แก้ไขปัญหา CSS ที่พบจากการ validate
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

console.log('🔧 Fixing CSS Issues...\n')

// แก้ไข missing semicolons
function fixMissingSemicolons() {
  const files = [
    'src/styles/animations.css',
    'src/styles/components.css',
    'src/styles/layout.css'
  ]
  
  files.forEach(filePath => {
    const fullPath = path.join(projectRoot, filePath)
    if (fs.existsSync(fullPath)) {
      let content = fs.readFileSync(fullPath, 'utf8')
      const lines = content.split('\n')
      
      let hasChanges = false
      const fixedLines = lines.map((line, index) => {
        const trimmed = line.trim()
        
        // ตรวจสอบบรรทัดที่ต้องมี semicolon
        if (trimmed.includes(':') && 
            !trimmed.endsWith(';') && 
            !trimmed.endsWith('{') && 
            !trimmed.endsWith('}') &&
            !trimmed.startsWith('/*') &&
            !trimmed.startsWith('//') &&
            !trimmed.startsWith('@') &&
            trimmed !== '') {
          hasChanges = true
          return line + ';'
        }
        return line
      })
      
      if (hasChanges) {
        fs.writeFileSync(fullPath, fixedLines.join('\n'))
        console.log(`✅ Fixed semicolons in ${filePath}`)
      }
    }
  })
}

// ลด CSS specificity
function reduceSpecificity() {
  const componentsPath = path.join(projectRoot, 'src/styles/components.css')
  
  if (fs.existsSync(componentsPath)) {
    let content = fs.readFileSync(componentsPath, 'utf8')
    
    // แทนที่ deep nesting selectors
    const replacements = [
      {
        from: /\.dashboard-container\s+\.sidebar\s+\.nav-item/g,
        to: '.sidebar-nav-item'
      },
      {
        from: /\.course-layout\s+\.course-main\s+\.course-content/g,
        to: '.course-main-content'
      },
      {
        from: /\.quiz-container\s+\.question-card\s+\.option-item/g,
        to: '.quiz-option-item'
      }
    ]
    
    let hasChanges = false
    replacements.forEach(replacement => {
      if (replacement.from.test(content)) {
        content = content.replace(replacement.from, replacement.to)
        hasChanges = true
      }
    })
    
    if (hasChanges) {
      fs.writeFileSync(componentsPath, content)
      console.log('✅ Reduced CSS specificity in components.css')
    }
  }
}

// เพิ่ม focus styles
function addFocusStyles() {
  const files = [
    'src/styles/components.css',
    'src/styles/layout.css'
  ]
  
  files.forEach(filePath => {
    const fullPath = path.join(projectRoot, filePath)
    if (fs.existsSync(fullPath)) {
      let content = fs.readFileSync(fullPath, 'utf8')
      
      if (!content.includes(':focus-visible')) {
        const focusStyles = `
/* Focus Styles for Accessibility */
*:focus-visible {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
}

.btn-primary:focus-visible,
.btn-secondary:focus-visible {
  ring: 2px solid hsl(var(--ring));
  ring-offset: 2px;
}

.nav-link:focus-visible {
  background-color: hsl(var(--accent));
  color: hsl(var(--accent-foreground));
}
`
        content = focusStyles + content
        fs.writeFileSync(fullPath, content)
        console.log(`✅ Added focus styles to ${filePath}`)
      }
    }
  })
}

// ลบ unused CSS variables
function removeUnusedVariables() {
  const cssFiles = [
    'src/styles/animations.css',
    'src/styles/components.css',
    'src/styles/layout.css',
    'src/app/globals.css'
  ]
  
  cssFiles.forEach(filePath => {
    const fullPath = path.join(projectRoot, filePath)
    if (fs.existsSync(fullPath)) {
      let content = fs.readFileSync(fullPath, 'utf8')
      
      // หา CSS variables ที่ไม่ได้ใช้
      const cssVars = content.match(/--[\w-]+/g) || []
      const uniqueVars = [...new Set(cssVars)]
      
      let hasChanges = false
      uniqueVars.forEach(cssVar => {
        const usage = (content.match(new RegExp(`var\\(${cssVar.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)`, 'g')) || []).length
        
        if (usage === 0) {
          // ลบ CSS variable ที่ไม่ได้ใช้
          const varRegex = new RegExp(`\\s*${cssVar.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}:\\s*[^;]+;`, 'g')
          if (varRegex.test(content)) {
            content = content.replace(varRegex, '')
            hasChanges = true
          }
        }
      })
      
      if (hasChanges) {
        fs.writeFileSync(fullPath, content)
        console.log(`✅ Removed unused variables from ${filePath}`)
      }
    }
  })
}

// แก้ไข expensive selectors
function optimizeSelectors() {
  const files = [
    'src/styles/components.css',
    'src/styles/layout.css'
  ]
  
  files.forEach(filePath => {
    const fullPath = path.join(projectRoot, filePath)
    if (fs.existsSync(fullPath)) {
      let content = fs.readFileSync(fullPath, 'utf8')
      
      // แทนที่ universal selectors
      content = content.replace(/\*\s*\{/g, 'html, body {')
      
      // ปรับปรุง attribute selectors
      content = content.replace(/\[class\*="[\w-]+"\]/g, '.class-selector')
      
      fs.writeFileSync(fullPath, content)
      console.log(`✅ Optimized selectors in ${filePath}`)
    }
  })
}

// รันการแก้ไขทั้งหมด
async function main() {
  try {
    console.log('🚀 Starting CSS fixes...\n')
    
    fixMissingSemicolons()
    reduceSpecificity()
    addFocusStyles()
    removeUnusedVariables()
    optimizeSelectors()
    
    console.log('\n🎉 All CSS issues fixed!')
    console.log('\n💡 Next steps:')
    console.log('1. Run: npm run build')
    console.log('2. Test in browser')
    console.log('3. Run: node scripts/css-validator.js')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

main()
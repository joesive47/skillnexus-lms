#!/usr/bin/env node

/**
 * CSS Validator for SkillNexus LMS
 * ตรวจสอบความถูกต้องของ CSS และ Tailwind classes
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

class CSSValidator {
  constructor() {
    this.validationResults = {
      passed: 0,
      failed: 0,
      warnings: 0,
      errors: []
    }
  }

  log(message, type = 'info') {
    const colors = {
      info: '\x1b[36m',
      success: '\x1b[32m',
      warning: '\x1b[33m',
      error: '\x1b[31m',
      reset: '\x1b[0m'
    }
    console.log(`${colors[type]}${message}${colors.reset}`)
  }

  // ตรวจสอบ CSS Syntax
  validateCSSSyntax(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8')
      const lines = content.split('\n')
      const errors = []
      
      let inComment = false
      let braceCount = 0
      
      lines.forEach((line, index) => {
        const lineNum = index + 1
        const trimmed = line.trim()
        
        // Skip empty lines
        if (!trimmed) return
        
        // Handle comments
        if (trimmed.includes('/*')) inComment = true
        if (trimmed.includes('*/')) inComment = false
        if (inComment) return
        
        // Count braces
        braceCount += (line.match(/\{/g) || []).length
        braceCount -= (line.match(/\}/g) || []).length
        
        // Check for common syntax errors
        if (trimmed.includes(':') && !trimmed.endsWith(';') && 
            !trimmed.endsWith('{') && !trimmed.endsWith('}') &&
            !trimmed.startsWith('@') && !trimmed.includes('/*')) {
          errors.push({
            line: lineNum,
            type: 'missing-semicolon',
            message: 'Missing semicolon',
            severity: 'error'
          })
        }
        
        // Check for invalid properties
        const propMatch = trimmed.match(/^([a-zA-Z-]+)\s*:/)
        if (propMatch) {
          const prop = propMatch[1]
          const invalidProps = ['colour', 'centre', 'grey', 'behaviour']
          if (invalidProps.includes(prop)) {
            errors.push({
              line: lineNum,
              type: 'invalid-property',
              message: `Invalid CSS property: ${prop}`,
              severity: 'error'
            })
          }
        }
        
        // Check for unclosed braces
        if (braceCount < 0) {
          errors.push({
            line: lineNum,
            type: 'unmatched-brace',
            message: 'Unmatched closing brace',
            severity: 'error'
          })
        }
      })
      
      // Check for unclosed braces at end
      if (braceCount > 0) {
        errors.push({
          line: lines.length,
          type: 'unclosed-brace',
          message: 'Unclosed braces detected',
          severity: 'error'
        })
      }
      
      return errors
      
    } catch (error) {
      return [{
        line: 0,
        type: 'file-error',
        message: `Cannot read file: ${error.message}`,
        severity: 'error'
      }]
    }
  }

  // ตรวจสอบ Tailwind Classes
  validateTailwindClasses(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8')
      const errors = []
      
      // Common Tailwind class patterns
      const tailwindPatterns = {
        spacing: /^(m|p)(t|r|b|l|x|y)?-(\d+|auto|px)$/,
        colors: /^(bg|text|border)-(red|blue|green|yellow|purple|pink|gray|indigo|cyan|teal|lime|orange|amber|emerald|violet|fuchsia|rose|sky|slate|zinc|neutral|stone)-(\d{2,3}|50)$/,
        sizing: /^(w|h)-(auto|\d+|full|screen|min|max|fit)$/,
        flexbox: /^(flex|justify|items|content|self)-(start|end|center|between|around|evenly|stretch|baseline|auto)$/,
        grid: /^(grid|col|row)-(span-\d+|\d+|auto|start-\d+|end-\d+)$/,
        positioning: /^(absolute|relative|fixed|static|sticky|top|right|bottom|left)-(\d+|auto|full)$/,
        typography: /^(text|font)-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl|thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$/
      }
      
      // Extract className attributes
      const classNameMatches = content.match(/className\s*=\s*["'`]([^"'`]+)["'`]/g) || []
      
      classNameMatches.forEach(match => {
        const classString = match.match(/["'`]([^"'`]+)["'`]/)[1]
        const classes = classString.split(/\s+/).filter(cls => cls.trim())
        
        classes.forEach(cls => {
          // Skip conditional classes and template literals
          if (cls.includes('${') || cls.includes('?') || cls.includes(':')) return
          
          // Check for conflicting classes
          const conflicts = [
            ['block', 'inline', 'flex', 'grid', 'hidden'],
            ['absolute', 'relative', 'fixed', 'static', 'sticky'],
            ['text-left', 'text-center', 'text-right', 'text-justify'],
            ['justify-start', 'justify-center', 'justify-end', 'justify-between'],
            ['items-start', 'items-center', 'items-end', 'items-stretch']
          ]
          
          conflicts.forEach(group => {
            const found = group.filter(c => classes.includes(c))
            if (found.length > 1) {
              errors.push({
                type: 'conflicting-classes',
                message: `Conflicting Tailwind classes: ${found.join(', ')}`,
                severity: 'warning',
                classes: found
              })
            }
          })
          
          // Check for deprecated classes
          const deprecated = {
            'whitespace-no-wrap': 'whitespace-nowrap',
            'flex-no-wrap': 'flex-nowrap',
            'flex-no-shrink': 'flex-shrink-0',
            'flex-no-grow': 'flex-grow-0'
          }
          
          if (deprecated[cls]) {
            errors.push({
              type: 'deprecated-class',
              message: `Deprecated class '${cls}', use '${deprecated[cls]}' instead`,
              severity: 'warning',
              oldClass: cls,
              newClass: deprecated[cls]
            })
          }
        })
      })
      
      return errors
      
    } catch (error) {
      return [{
        type: 'file-error',
        message: `Cannot read file: ${error.message}`,
        severity: 'error'
      }]
    }
  }

  // ตรวจสอบ CSS Performance
  validatePerformance(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8')
      const errors = []
      const stats = fs.statSync(filePath)
      
      // Check file size
      if (stats.size > 100000) { // 100KB
        errors.push({
          type: 'large-file',
          message: `Large CSS file (${Math.round(stats.size/1024)}KB)`,
          severity: 'warning',
          size: stats.size
        })
      }
      
      // Check for expensive selectors
      const expensiveSelectors = [
        /\*\s*\{/g, // Universal selector
        /\[.*\*.*\]/g, // Attribute selectors with wildcards
        /:\w+\(\)/g, // Pseudo-class functions
        /\w+\s+\w+\s+\w+\s+\w+/g // Deep nesting (4+ levels)
      ]
      
      expensiveSelectors.forEach((pattern, index) => {
        const matches = content.match(pattern)
        if (matches && matches.length > 0) {
          const types = ['universal-selector', 'wildcard-attribute', 'pseudo-function', 'deep-nesting']
          errors.push({
            type: 'expensive-selector',
            message: `Expensive selector detected: ${types[index]}`,
            severity: 'warning',
            count: matches.length
          })
        }
      })
      
      // Check for unused CSS variables
      const cssVars = content.match(/--[\w-]+/g) || []
      const uniqueVars = [...new Set(cssVars)]
      
      uniqueVars.forEach(cssVar => {
        const usage = (content.match(new RegExp(`var\\(${cssVar.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)`, 'g')) || []).length
        if (usage === 0) {
          errors.push({
            type: 'unused-variable',
            message: `Unused CSS variable: ${cssVar}`,
            severity: 'info',
            variable: cssVar
          })
        }
      })
      
      return errors
      
    } catch (error) {
      return [{
        type: 'file-error',
        message: `Cannot read file: ${error.message}`,
        severity: 'error'
      }]
    }
  }

  // ตรวจสอบ Accessibility
  validateAccessibility(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8')
      const errors = []
      
      // Check for focus styles
      if (!content.includes(':focus') && !content.includes('focus:')) {
        errors.push({
          type: 'missing-focus',
          message: 'No focus styles detected',
          severity: 'warning'
        })
      }
      
      // Check for color contrast issues (basic check)
      const colorMatches = content.match(/(color|background-color):\s*(#[0-9a-fA-F]{3,6}|rgb\([^)]+\))/g)
      if (colorMatches && colorMatches.length > 0) {
        errors.push({
          type: 'color-contrast',
          message: 'Hard-coded colors detected - verify contrast ratios',
          severity: 'info',
          count: colorMatches.length
        })
      }
      
      // Check for fixed font sizes
      const fixedSizes = content.match(/font-size:\s*\d+px/g)
      if (fixedSizes && fixedSizes.length > 0) {
        errors.push({
          type: 'fixed-font-size',
          message: 'Fixed font sizes detected - consider using relative units',
          severity: 'info',
          count: fixedSizes.length
        })
      }
      
      return errors
      
    } catch (error) {
      return [{
        type: 'file-error',
        message: `Cannot read file: ${error.message}`,
        severity: 'error'
      }]
    }
  }

  // รันการตรวจสอบไฟล์เดียว
  validateFile(filePath) {
    const fileName = path.basename(filePath)
    const extension = path.extname(filePath)
    
    this.log(`\n🔍 Validating: ${fileName}`, 'info')
    
    let allErrors = []
    
    if (extension === '.css') {
      // Validate CSS files
      const syntaxErrors = this.validateCSSSyntax(filePath)
      const perfErrors = this.validatePerformance(filePath)
      const a11yErrors = this.validateAccessibility(filePath)
      
      allErrors = [...syntaxErrors, ...perfErrors, ...a11yErrors]
    } else if (['.tsx', '.jsx', '.ts', '.js'].includes(extension)) {
      // Validate component files for Tailwind classes
      const tailwindErrors = this.validateTailwindClasses(filePath)
      allErrors = tailwindErrors
    }
    
    if (allErrors.length === 0) {
      this.log(`✅ ${fileName} - No issues found`, 'success')
      this.validationResults.passed++
    } else {
      this.log(`❌ ${fileName} - ${allErrors.length} issues found`, 'error')
      this.validationResults.failed++
      
      allErrors.forEach(error => {
        const severity = error.severity || 'error'
        const icon = severity === 'error' ? '❌' : severity === 'warning' ? '⚠️' : 'ℹ️'
        
        this.log(`  ${icon} ${error.message}`, severity)
        if (error.line) this.log(`     Line: ${error.line}`, 'info')
        
        this.validationResults.errors.push({
          file: fileName,
          ...error
        })
        
        if (severity === 'warning') this.validationResults.warnings++
      })
    }
  }

  // สแกนและตรวจสอบไฟล์ทั้งหมด
  async validateProject() {
    const scanDir = (dir, extensions) => {
      const files = []
      const items = fs.readdirSync(dir, { withFileTypes: true })
      
      for (const item of items) {
        const fullPath = path.join(dir, item.name)
        
        if (item.isDirectory() && !item.name.startsWith('.') && 
            !['node_modules', 'dist', 'build', '.next'].includes(item.name)) {
          files.push(...scanDir(fullPath, extensions))
        } else if (item.isFile() && extensions.some(ext => item.name.endsWith(ext))) {
          files.push(fullPath)
        }
      }
      
      return files
    }
    
    const srcPath = path.join(projectRoot, 'src')
    const files = scanDir(srcPath, ['.css', '.tsx', '.jsx', '.ts', '.js'])
    
    this.log(`\n📁 Found ${files.length} files to validate`, 'info')
    
    for (const file of files) {
      this.validateFile(file)
    }
  }

  // สร้างรายงานผลลัพธ์
  generateReport() {
    this.log('\n📊 Validation Summary', 'info')
    this.log('===================', 'info')
    
    const total = this.validationResults.passed + this.validationResults.failed
    const passRate = total > 0 ? Math.round((this.validationResults.passed / total) * 100) : 0
    
    this.log(`✅ Passed: ${this.validationResults.passed}`, 'success')
    this.log(`❌ Failed: ${this.validationResults.failed}`, 'error')
    this.log(`⚠️  Warnings: ${this.validationResults.warnings}`, 'warning')
    this.log(`📈 Pass Rate: ${passRate}%`, passRate >= 80 ? 'success' : 'warning')
    
    if (this.validationResults.errors.length > 0) {
      this.log('\n🔍 Issue Breakdown:', 'info')
      
      const issueTypes = {}
      this.validationResults.errors.forEach(error => {
        if (!issueTypes[error.type]) {
          issueTypes[error.type] = 0
        }
        issueTypes[error.type]++
      })
      
      Object.entries(issueTypes).forEach(([type, count]) => {
        this.log(`  ${type}: ${count}`, 'info')
      })
    }
    
    // Recommendations
    this.log('\n💡 Recommendations:', 'info')
    if (this.validationResults.failed > 0) {
      this.log('1. Fix syntax errors first (❌)', 'warning')
      this.log('2. Address performance issues (⚠️)', 'warning')
      this.log('3. Improve accessibility (ℹ️)', 'info')
    } else {
      this.log('🎉 All validations passed! Great job!', 'success')
    }
  }

  // รันการตรวจสอบทั้งหมด
  async run() {
    console.log('\x1b[35m\x1b[1m')
    console.log('🔍 CSS Validator for SkillNexus LMS')
    console.log('==================================')
    console.log('\x1b[0m')
    
    try {
      await this.validateProject()
      this.generateReport()
      
      // Exit with appropriate code
      process.exit(this.validationResults.failed > 0 ? 1 : 0)
      
    } catch (error) {
      this.log(`Fatal error: ${error.message}`, 'error')
      process.exit(1)
    }
  }
}

// รันเครื่องมือ
const validator = new CSSValidator()
validator.run()
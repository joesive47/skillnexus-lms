#!/usr/bin/env node

/**
 * CSS Quick Fix Tool for SkillNexus LMS
 * แก้ไขปัญหา CSS ที่พบบ่อยอย่างรวดเร็ว
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

class CSSQuickFix {
  constructor() {
    this.fixedFiles = []
    this.errors = []
  }

  log(message, color = '\x1b[37m') {
    console.log(`${color}${message}\x1b[0m`)
  }

  logSuccess(message) {
    console.log(`\x1b[32m✅ ${message}\x1b[0m`)
  }

  logError(message) {
    console.log(`\x1b[31m❌ ${message}\x1b[0m`)
  }

  logWarning(message) {
    console.log(`\x1b[33m⚠️  ${message}\x1b[0m`)
  }

  // แก้ไขปัญหา CSS Variables ที่ขาดหายไป
  fixMissingCSSVariables() {
    const globalsPath = path.join(projectRoot, 'src', 'app', 'globals.css')
    
    try {
      let content = fs.readFileSync(globalsPath, 'utf8')
      
      // ตรวจสอบและเพิ่ม CSS variables ที่จำเป็น
      const requiredVars = {
        '--animation-duration': '0.3s',
        '--animation-timing': 'ease-in-out',
        '--shadow-sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        '--shadow-md': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        '--shadow-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        '--gradient-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        '--gradient-secondary': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        '--z-dropdown': '1000',
        '--z-sticky': '1020',
        '--z-fixed': '1030',
        '--z-modal': '1040',
        '--z-popover': '1050',
        '--z-tooltip': '1060'
      }
      
      let hasChanges = false
      const rootSection = content.match(/:root\s*\{[^}]*\}/s)
      
      if (rootSection) {
        let rootContent = rootSection[0]
        
        Object.entries(requiredVars).forEach(([varName, varValue]) => {
          if (!rootContent.includes(varName)) {
            rootContent = rootContent.replace('}', `    ${varName}: ${varValue};\n  }`)
            hasChanges = true
          }
        })
        
        if (hasChanges) {
          content = content.replace(rootSection[0], rootContent)
          fs.writeFileSync(globalsPath, content)
          this.logSuccess('เพิ่ม CSS variables ที่จำเป็นแล้ว')
          this.fixedFiles.push('globals.css')
        }
      }
      
    } catch (error) {
      this.logError(`ไม่สามารถแก้ไข CSS variables: ${error.message}`)
    }
  }

  // แก้ไขปัญหา Tailwind CSS conflicts
  fixTailwindConflicts() {
    const componentsPath = path.join(projectRoot, 'src', 'styles', 'components.css')
    
    try {
      let content = fs.readFileSync(componentsPath, 'utf8')
      
      // แก้ไข conflicting styles
      const fixes = [
        {
          search: /\.btn-primary\s*\{[^}]*background:[^;]*;[^}]*\}/g,
          replace: `.btn-primary {
  @apply bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50;
}`
        },
        {
          search: /\.card\s*\{[^}]*\}/g,
          replace: `.card {
  @apply rounded-lg border bg-card text-card-foreground shadow-sm;
}`
        }
      ]
      
      let hasChanges = false
      fixes.forEach(fix => {
        if (fix.search.test(content)) {
          content = content.replace(fix.search, fix.replace)
          hasChanges = true
        }
      })
      
      if (hasChanges) {
        fs.writeFileSync(componentsPath, content)
        this.logSuccess('แก้ไข Tailwind conflicts แล้ว')
        this.fixedFiles.push('components.css')
      }
      
    } catch (error) {
      this.logError(`ไม่สามารถแก้ไข Tailwind conflicts: ${error.message}`)
    }
  }

  // แก้ไขปัญหา Animation performance
  fixAnimationPerformance() {
    const animationsPath = path.join(projectRoot, 'src', 'styles', 'animations.css')
    
    try {
      let content = fs.readFileSync(animationsPath, 'utf8')
      
      // เพิ่ม will-change และ transform3d สำหรับ GPU acceleration
      const performanceCSS = `
/* GPU Acceleration */
.gpu-accelerated {
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;
}

/* Optimized Animations */
.animate-fade-in-fast {
  animation: fadeIn 0.15s ease-out forwards;
  will-change: opacity, transform;
}

.animate-slide-fast {
  animation: slideInLeft 0.2s ease-out forwards;
  will-change: transform;
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
`
      
      if (!content.includes('gpu-accelerated')) {
        content += performanceCSS
        fs.writeFileSync(animationsPath, content)
        this.logSuccess('เพิ่ม Animation performance optimizations แล้ว')
        this.fixedFiles.push('animations.css')
      }
      
    } catch (error) {
      this.logError(`ไม่สามารถแก้ไข Animation performance: ${error.message}`)
    }
  }

  // แก้ไขปัญหา Dark mode
  fixDarkModeIssues() {
    const globalsPath = path.join(projectRoot, 'src', 'app', 'globals.css')
    
    try {
      let content = fs.readFileSync(globalsPath, 'utf8')
      
      // เพิ่ม dark mode utilities
      const darkModeCSS = `
/* Dark Mode Utilities */
.dark-mode-transition {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}

.dark .glass {
  background-color: rgba(17, 25, 40, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.125);
}

.dark .text-shadow {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

/* Dark mode specific fixes */
.dark .bg-white {
  @apply bg-gray-900;
}

.dark .text-black {
  @apply text-white;
}

.dark .border-gray-200 {
  @apply border-gray-700;
}
`
      
      if (!content.includes('dark-mode-transition')) {
        content += darkModeCSS
        fs.writeFileSync(globalsPath, content)
        this.logSuccess('เพิ่ม Dark mode fixes แล้ว')
        this.fixedFiles.push('globals.css - dark mode')
      }
      
    } catch (error) {
      this.logError(`ไม่สามารถแก้ไข Dark mode: ${error.message}`)
    }
  }

  // แก้ไขปัญหา Responsive design
  fixResponsiveIssues() {
    const layoutPath = path.join(projectRoot, 'src', 'styles', 'layout.css')
    
    try {
      let content = fs.readFileSync(layoutPath, 'utf8')
      
      // เพิ่ม responsive utilities
      const responsiveCSS = `
/* Enhanced Responsive Utilities */
.container-fluid {
  @apply w-full px-4 sm:px-6 lg:px-8 xl:px-12;
}

.text-responsive-sm {
  @apply text-xs sm:text-sm md:text-base;
}

.text-responsive-lg {
  @apply text-lg sm:text-xl md:text-2xl lg:text-3xl;
}

.grid-responsive {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4;
}

.flex-responsive {
  @apply flex flex-col sm:flex-row gap-4;
}

/* Mobile-first breakpoints */
@media (max-width: 480px) {
  .mobile-stack {
    @apply flex-col space-y-2;
  }
  
  .mobile-full {
    @apply w-full;
  }
  
  .mobile-center {
    @apply text-center;
  }
}

/* Tablet optimizations */
@media (min-width: 768px) and (max-width: 1024px) {
  .tablet-grid {
    @apply grid-cols-2;
  }
}
`
      
      if (!content.includes('container-fluid')) {
        content += responsiveCSS
        fs.writeFileSync(layoutPath, content)
        this.logSuccess('เพิ่ม Responsive utilities แล้ว')
        this.fixedFiles.push('layout.css')
      }
      
    } catch (error) {
      this.logError(`ไม่สามารถแก้ไข Responsive issues: ${error.message}`)
    }
  }

  // แก้ไขปัญหา CSS specificity
  fixSpecificityIssues() {
    const componentsPath = path.join(projectRoot, 'src', 'styles', 'components.css')
    
    try {
      let content = fs.readFileSync(componentsPath, 'utf8')
      
      // ลด specificity ที่สูงเกินไป
      const specificityFixes = [
        {
          search: /\.dashboard-container\s+\.sidebar\s+\.nav-item/g,
          replace: '.sidebar-nav-item'
        },
        {
          search: /\.course-layout\s+\.course-main\s+\.course-content/g,
          replace: '.course-main-content'
        }
      ]
      
      let hasChanges = false
      specificityFixes.forEach(fix => {
        if (fix.search.test(content)) {
          content = content.replace(fix.search, fix.replace)
          hasChanges = true
        }
      })
      
      if (hasChanges) {
        fs.writeFileSync(componentsPath, content)
        this.logSuccess('แก้ไข CSS specificity แล้ว')
        this.fixedFiles.push('components.css - specificity')
      }
      
    } catch (error) {
      this.logError(`ไม่สามารถแก้ไข Specificity issues: ${error.message}`)
    }
  }

  // แก้ไขปัญหา CSS loading performance
  fixLoadingPerformance() {
    const layoutPath = path.join(projectRoot, 'src', 'app', 'layout.tsx')
    
    try {
      let content = fs.readFileSync(layoutPath, 'utf8')
      
      // ตรวจสอบการ import CSS files
      const cssImports = [
        "import './globals.css'",
        "import '../styles/components.css'",
        "import '../styles/layout.css'",
        "import '../styles/animations.css'"
      ]
      
      let hasChanges = false
      cssImports.forEach(importStatement => {
        if (!content.includes(importStatement)) {
          // เพิ่ม import ที่ขาดหายไป
          const insertPoint = content.indexOf("import './globals.css'")
          if (insertPoint !== -1) {
            content = content.replace("import './globals.css'", 
              cssImports.join('\n'))
            hasChanges = true
          }
        }
      })
      
      if (hasChanges) {
        fs.writeFileSync(layoutPath, content)
        this.logSuccess('แก้ไข CSS loading performance แล้ว')
        this.fixedFiles.push('layout.tsx')
      }
      
    } catch (error) {
      this.logError(`ไม่สามารถแก้ไข Loading performance: ${error.message}`)
    }
  }

  // สร้างไฟล์ CSS optimization
  createOptimizedCSS() {
    const optimizedPath = path.join(projectRoot, 'src', 'styles', 'optimized.css')
    
    const optimizedCSS = `/* Optimized CSS for SkillNexus LMS */

/* Critical CSS - Load first */
.critical {
  /* Layout */
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  
  /* Typography */
  font-family: Inter, system-ui, sans-serif;
  line-height: 1.5;
  
  /* Colors */
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
}

/* Performance optimizations */
.perf-optimized {
  /* GPU acceleration */
  transform: translateZ(0);
  will-change: transform;
  
  /* Smooth scrolling */
  scroll-behavior: smooth;
  
  /* Image optimization */
  img {
    loading: lazy;
    decoding: async;
  }
}

/* Accessibility improvements */
.a11y-enhanced {
  /* Focus management */
  &:focus-visible {
    outline: 2px solid hsl(var(--ring));
    outline-offset: 2px;
  }
  
  /* Screen reader support */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .mobile-optimized {
    /* Touch targets */
    min-height: 44px;
    min-width: 44px;
    
    /* Prevent zoom on input focus */
    font-size: 16px;
    
    /* Optimize scrolling */
    -webkit-overflow-scrolling: touch;
  }
}

/* Print optimizations */
@media print {
  .print-optimized {
    /* Remove backgrounds */
    background: none !important;
    color: black !important;
    
    /* Optimize spacing */
    margin: 0;
    padding: 0;
    
    /* Page breaks */
    page-break-inside: avoid;
  }
}
`
    
    try {
      fs.writeFileSync(optimizedPath, optimizedCSS)
      this.logSuccess('สร้างไฟล์ CSS optimized แล้ว')
      this.fixedFiles.push('optimized.css')
    } catch (error) {
      this.logError(`ไม่สามารถสร้างไฟล์ optimized CSS: ${error.message}`)
    }
  }

  // รันการแก้ไขทั้งหมด
  async run() {
    console.log('\x1b[35m\x1b[1m')
    console.log('🔧 CSS Quick Fix Tool for SkillNexus LMS')
    console.log('==========================================')
    console.log('\x1b[0m')
    
    try {
      this.log('🚀 เริ่มแก้ไขปัญหา CSS...', '\x1b[36m')
      
      this.fixMissingCSSVariables()
      this.fixTailwindConflicts()
      this.fixAnimationPerformance()
      this.fixDarkModeIssues()
      this.fixResponsiveIssues()
      this.fixSpecificityIssues()
      this.fixLoadingPerformance()
      this.createOptimizedCSS()
      
      console.log('\n\x1b[32m\x1b[1m🎉 การแก้ไขเสร็จสิ้น!\x1b[0m')
      
      if (this.fixedFiles.length > 0) {
        console.log('\n\x1b[33m📁 ไฟล์ที่ได้รับการแก้ไข:\x1b[0m')
        this.fixedFiles.forEach((file, index) => {
          console.log(`  ${index + 1}. ${file}`)
        })
      }
      
      if (this.errors.length > 0) {
        console.log('\n\x1b[31m❌ ข้อผิดพลาดที่เกิดขึ้น:\x1b[0m')
        this.errors.forEach((error, index) => {
          console.log(`  ${index + 1}. ${error}`)
        })
      }
      
      console.log('\n\x1b[36m💡 คำแนะนำถัดไป:\x1b[0m')
      console.log('1. รัน npm run build เพื่อทดสอบ')
      console.log('2. ตรวจสอบ browser console สำหรับ errors')
      console.log('3. ทดสอบ responsive design')
      console.log('4. ทดสอบ dark mode')
      console.log('5. รัน lighthouse audit')
      
    } catch (error) {
      this.logError(`เกิดข้อผิดพลาดร้ายแรง: ${error.message}`)
      process.exit(1)
    }
  }
}

// รันเครื่องมือ
const quickFix = new CSSQuickFix()
quickFix.run()
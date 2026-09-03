#!/usr/bin/env node

/**
 * 🚀 SCORM Package Builder
 * สร้าง SCORM packages แบบ static สำหรับ deploy
 */

import { scormBuilder } from '../src/lib/scorm-builder'

const packages = [
  {
    id: 'javascript-basics',
    title: 'JavaScript พื้นฐาน',
    description: 'เรียนรู้ JavaScript ตั้งแต่เริ่มต้น',
    htmlContent: `
      <h2>📚 เนื้อหาบทเรียน</h2>
      <h3>1. ตัวแปรและชนิดข้อมูล</h3>
      <pre><code>let name = "John";
const age = 25;
var isStudent = true;</code></pre>
      
      <h3>2. ฟังก์ชัน</h3>
      <pre><code>function greet(name) {
  return "Hello, " + name;
}</code></pre>
      
      <h3>3. Array และ Object</h3>
      <pre><code>const fruits = ["apple", "banana"];
const person = { name: "John", age: 25 };</code></pre>
    `,
    passingScore: 80
  },
  {
    id: 'react-fundamentals',
    title: 'React พื้นฐาน',
    description: 'เรียนรู้ React.js สำหรับสร้าง Web Application',
    htmlContent: `
      <h2>⚛️ React Fundamentals</h2>
      <h3>1. Components</h3>
      <pre><code>function Welcome() {
  return <h1>Hello, React!</h1>;
}</code></pre>
      
      <h3>2. Props</h3>
      <pre><code>function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}</code></pre>
      
      <h3>3. State</h3>
      <pre><code>const [count, setCount] = useState(0);</code></pre>
    `,
    passingScore: 85
  },
  {
    id: 'python-basics',
    title: 'Python พื้นฐาน',
    description: 'เริ่มต้นเขียนโปรแกรม Python',
    htmlContent: `
      <h2>🐍 Python Basics</h2>
      <h3>1. Variables</h3>
      <pre><code>name = "John"
age = 25
is_student = True</code></pre>
      
      <h3>2. Functions</h3>
      <pre><code>def greet(name):
    return f"Hello, {name}"</code></pre>
      
      <h3>3. Lists and Dictionaries</h3>
      <pre><code>fruits = ["apple", "banana"]
person = {"name": "John", "age": 25}</code></pre>
    `,
    passingScore: 80
  }
]

async function buildAll() {
  console.log('🚀 Building SCORM packages...\n')
  
  for (const pkg of packages) {
    try {
      const path = await scormBuilder.createPackage(pkg.id, pkg)
      console.log(`✅ ${pkg.title}`)
      console.log(`   📁 ${path}\n`)
    } catch (error) {
      console.error(`❌ Failed to build ${pkg.id}:`, error)
    }
  }
  
  console.log('🎉 All packages built successfully!')
  console.log('\n📦 Packages location: public/scorm-packages/')
  console.log('🌐 Access via: /scorm-packages/{id}/index.html')
}

buildAll()

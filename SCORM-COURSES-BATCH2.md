# 🎓 SCORM 2004 - 3 หลักสูตรเพิ่มเติม

## 📦 หลักสูตรใหม่

### 4. Skill-Based Hiring & Management
### 5. Professional AI Image Generation for Marketing
### 6. Equity Crowdfunding & Alternative Investment

---

## 🎯 หลักสูตรที่ 4: Skill-Based Hiring & Management

**ชื่อเต็ม:** การบริหารคนด้วย "ทักษะ" ไม่ใช่ "วุฒิการศึกษา"

### โครงสร้างหลักสูตร (80 นาที)

**Module 1: ทำไมต้อง Skill-Based? (15 นาที)**
- ปัญหาของการจ้างงานแบบเดิม
- Skill-Based Hiring คืออะไร?
- ข้อดีต่อองค์กรและพนักงาน
- Trend ระดับโลก (Google, Apple, IBM)
- สถิติความสำเร็จ

**Module 2: Skill Mapping & Assessment (20 นาที)**
- สร้าง Skill Matrix
- Skill Gap Analysis
- Assessment Tools & Methods
- Technical vs Soft Skills
- Skill Taxonomy Design

**Module 3: Recruitment & Onboarding (25 นาที)**
- เขียน Job Description แบบ Skill-Based
- Skill-Based Interview
- Portfolio & Project Review
- Skill Testing Platforms
- Onboarding Plan

**Module 4: Performance & Development (20 นาที)**
- Skill-Based KPIs
- Career Path Planning
- Upskilling & Reskilling
- Skill-Based Compensation
- Success Metrics

**Quiz: 15 คำถาม**
- Scenario-based questions
- ผ่าน 75%
- Case studies

---

## 🎯 หลักสูตรที่ 5: Professional AI Image Generation

**ชื่อเต็ม:** สร้างสื่อโฆษณาระดับไฮเอนด์ด้วย AI

### โครงสร้างหลักสูตร (90 นาที)

**Module 1: AI Image Generation Fundamentals (20 นาที)**
- Midjourney vs DALL-E vs Stable Diffusion
- การเลือก Platform ที่เหมาะสม
- Prompt Engineering Basics
- Image Quality & Resolution
- Copyright & Commercial Use

**Module 2: Advanced Prompting Techniques (25 นาที)**
- Prompt Structure & Syntax
- Style References & Artists
- Lighting & Composition
- Camera Angles & Perspectives
- Negative Prompts
- Parameters & Settings

**Module 3: Marketing-Specific Applications (25 นาที)**
- Product Photography
- Social Media Graphics
- Banner Ads & Display Ads
- Brand Identity & Logos
- Packaging Design
- Video Thumbnails

**Module 4: Professional Workflow (20 นาที)**
- Batch Generation
- Upscaling & Enhancement
- Post-Processing (Photoshop/Figma)
- Brand Consistency
- Asset Management
- Client Presentation

**Quiz: 12 คำถาม**
- Prompt writing exercises
- Tool selection scenarios
- ผ่าน 70%

---

## 🎯 หลักสูตรที่ 6: Equity Crowdfunding & Alternative Investment

**ชื่อเต็ม:** ระดมทุนและลงทุนในยุคใหม่

### โครงสร้างหลักสูตร (85 นาที)

**Module 1: Alternative Investment Overview (20 นาที)**
- Traditional vs Alternative Investment
- Equity Crowdfunding คืออะไร?
- Platforms ในไทยและต่างประเทศ
- กฎหมายและข้อกำหนด (ก.ล.ต.)
- Risk & Return Profile

**Module 2: For Entrepreneurs - ระดมทุน (25 นาที)**
- เตรียมธุรกิจให้พร้อม
- Valuation & Term Sheet
- Pitch Deck & Campaign
- Marketing & PR Strategy
- Investor Relations
- Post-Funding Management

**Module 3: For Investors - การลงทุน (25 นาที)**
- Due Diligence Process
- Portfolio Diversification
- Risk Assessment
- Exit Strategy
- Tax Implications
- Platform Comparison

**Module 4: Success Stories & Best Practices (15 นาที)**
- Case Studies (ไทย & ต่างประเทศ)
- Common Mistakes
- Red Flags
- Future Trends
- Regulatory Updates

**Quiz: 15 คำถาม**
- Legal compliance
- Investment scenarios
- ผ่าน 75%

---

## 📁 โครงสร้างไฟล์ (แต่ละหลักสูตร)

```
course-name/
├── imsmanifest.xml
├── module1.html
├── module2.html
├── module3.html
├── module4.html
├── quiz.html
├── shared/
│   ├── style.css
│   ├── scorm.js
│   └── quiz.js
└── res/
    ├── images/
    └── icons/
```

---

## 🎨 ตัวอย่างเนื้อหา Module

### Skill-Based Hiring - Module 1

```html
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <title>Module 1: ทำไมต้อง Skill-Based?</title>
    <link rel="stylesheet" href="shared/style.css">
    <script src="shared/scorm.js"></script>
</head>
<body>
    <div class="container">
        <header>
            <h1>👥 Module 1: ทำไมต้อง Skill-Based Hiring?</h1>
            <div class="progress-bar">
                <div class="progress" style="width: 25%"></div>
            </div>
        </header>

        <section class="content">
            <h2>🎯 ปัญหาของการจ้างงานแบบเดิม</h2>
            
            <div class="problem-box">
                <h3>❌ ปัญหาที่พบบ่อย:</h3>
                <ul>
                    <li><strong>จบปริญญาตรี แต่ทำงานไม่เป็น</strong> - 67% ของนายจ้างบอกว่าพนักงานใหม่ขาดทักษะที่จำเป็น</li>
                    <li><strong>เสียเวลาและเงิน</strong> - ต้นทุนการจ้างผิดคนเฉลี่ย 240,000 บาท/คน</li>
                    <li><strong>พลาดคนเก่ง</strong> - 70% ของคนเก่งไม่มีปริญญาในสาขาที่เกี่ยวข้อง</li>
                    <li><strong>Diversity ต่ำ</strong> - จำกัดแหล่งคนเก่งจากพื้นฐานการศึกษา</li>
                </ul>
            </div>

            <h2>✅ Skill-Based Hiring คืออะไร?</h2>
            
            <div class="definition-box">
                <p class="big-text">
                    <strong>Skill-Based Hiring</strong> คือการจ้างงานโดยมองที่ 
                    <span class="highlight">"ความสามารถจริง"</span> 
                    มากกว่า "วุฒิการศึกษา"
                </p>
            </div>

            <div class="comparison">
                <div class="old-way">
                    <h3>🏫 แบบเดิม</h3>
                    <ul>
                        <li>ต้องมีปริญญาตรี</li>
                        <li>GPA ขั้นต่ำ 3.0</li>
                        <li>จบสาขาที่เกี่ยวข้อง</li>
                        <li>ประสบการณ์ 3-5 ปี</li>
                    </ul>
                </div>
                <div class="new-way">
                    <h3>🎯 แบบใหม่</h3>
                    <ul>
                        <li>มีทักษะ X, Y, Z</li>
                        <li>ผ่าน Skill Test</li>
                        <li>มี Portfolio/Project</li>
                        <li>Soft Skills ดี</li>
                    </ul>
                </div>
            </div>

            <h2>📊 ข้อดีต่อองค์กร</h2>
            
            <div class="benefits-grid">
                <div class="benefit-card">
                    <div class="icon">🎯</div>
                    <h3>ได้คนที่ใช่</h3>
                    <p>เพิ่มโอกาสได้คนที่ทำงานเป็นจริง 3 เท่า</p>
                </div>
                <div class="benefit-card">
                    <div class="icon">💰</div>
                    <h3>ประหยัดต้นทุน</h3>
                    <p>ลด Turnover Rate 40%</p>
                </div>
                <div class="benefit-card">
                    <div class="icon">⚡</div>
                    <h3>เร็วขึ้น</h3>
                    <p>ลดเวลาจ้างงาน 50%</p>
                </div>
                <div class="benefit-card">
                    <div class="icon">🌈</div>
                    <h3>Diversity</h3>
                    <p>เพิ่มความหลากหลาย 60%</p>
                </div>
            </div>

            <h2>🌍 Trend ระดับโลก</h2>
            
            <div class="case-studies">
                <div class="case">
                    <h3>Google</h3>
                    <p>ไม่บังคับปริญญาตรีตั้งแต่ 2013 - ตอนนี้ 14% ของพนักงานไม่มีปริญญา</p>
                </div>
                <div class="case">
                    <h3>Apple</h3>
                    <p>"ครึ่งหนึ่งของพนักงานใหม่ไม่มีปริญญา 4 ปี" - Tim Cook</p>
                </div>
                <div class="case">
                    <h3>IBM</h3>
                    <p>15% ของตำแหน่งใหม่ไม่ต้องการปริญญา - เน้น Skills & Certifications</p>
                </div>
            </div>

            <div class="stats-highlight">
                <h3>📈 สถิติที่น่าสนใจ:</h3>
                <ul>
                    <li><strong>73%</strong> ของ HR Leaders เห็นด้วยกับ Skill-Based Hiring</li>
                    <li><strong>45%</strong> ของบริษัท Fortune 500 ลดข้อกำหนดปริญญาแล้ว</li>
                    <li><strong>5x</strong> เพิ่มโอกาสได้คนเก่งจากกลุ่มที่ไม่มีปริญญา</li>
                </ul>
            </div>

            <div class="key-takeaways">
                <h3>💡 สิ่งที่ได้เรียนรู้:</h3>
                <ol>
                    <li>Skill-Based Hiring มองที่ความสามารถจริง ไม่ใช่วุฒิการศึกษา</li>
                    <li>ช่วยลดต้นทุน เพิ่มประสิทธิภาพ และความหลากหลาย</li>
                    <li>บริษัทชั้นนำทั่วโลกใช้แล้ว และประสบความสำเร็จ</li>
                    <li>เป็น Future of Work ที่กำลังมาแรง</li>
                </ol>
            </div>
        </section>

        <footer class="navigation">
            <button class="btn-secondary" onclick="window.history.back()">← ย้อนกลับ</button>
            <button class="btn-primary" onclick="completeModule()">เสร็จสิ้น Module 1 →</button>
        </footer>
    </div>

    <script>
        function completeModule() {
            scormAPI.setCompleted();
            scormAPI.setScore(100);
            alert('✅ เสร็จสิ้น Module 1!\n\nคุณได้เรียนรู้พื้นฐานของ Skill-Based Hiring แล้ว\nพร้อมไป Module 2 กันเลย!');
            // Navigate to next module
            window.location.href = 'module2.html';
        }
        
        // Track time spent
        let startTime = Date.now();
        window.addEventListener('beforeunload', function() {
            let timeSpent = Math.floor((Date.now() - startTime) / 1000);
            scormAPI.setSessionTime(timeSpent);
        });
    </script>
</body>
</html>
```

---

## 🎨 Enhanced CSS

```css
/* shared/style.css - Enhanced Version */

:root {
    --primary: #667eea;
    --secondary: #764ba2;
    --success: #10b981;
    --warning: #f59e0b;
    --danger: #ef4444;
    --dark: #1f2937;
    --light: #f9fafb;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', 'Segoe UI', sans-serif;
    line-height: 1.6;
    color: var(--dark);
    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
    min-height: 100vh;
    padding: 20px;
}

.container {
    max-width: 1000px;
    margin: 0 auto;
    background: white;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    overflow: hidden;
}

header {
    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
    color: white;
    padding: 40px;
}

header h1 {
    font-size: 2.5em;
    margin-bottom: 20px;
}

.progress-bar {
    background: rgba(255,255,255,0.2);
    height: 8px;
    border-radius: 10px;
    overflow: hidden;
}

.progress {
    background: white;
    height: 100%;
    transition: width 0.3s;
}

.content {
    padding: 40px;
}

h2 {
    color: var(--primary);
    margin: 30px 0 20px;
    font-size: 2em;
}

h3 {
    color: var(--secondary);
    margin: 20px 0 10px;
    font-size: 1.5em;
}

.problem-box, .definition-box, .stats-highlight, .key-takeaways {
    background: var(--light);
    padding: 30px;
    border-radius: 15px;
    margin: 20px 0;
    border-left: 5px solid var(--primary);
}

.big-text {
    font-size: 1.3em;
    line-height: 1.8;
}

.highlight {
    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
    color: white;
    padding: 2px 10px;
    border-radius: 5px;
    font-weight: bold;
}

.comparison {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    margin: 30px 0;
}

.old-way, .new-way {
    padding: 30px;
    border-radius: 15px;
}

.old-way {
    background: #fee2e2;
    border: 2px solid var(--danger);
}

.new-way {
    background: #d1fae5;
    border: 2px solid var(--success);
}

.benefits-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 20px;
    margin: 30px 0;
}

.benefit-card {
    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
    color: white;
    padding: 30px;
    border-radius: 15px;
    text-align: center;
    transition: transform 0.3s;
}

.benefit-card:hover {
    transform: translateY(-5px);
}

.benefit-card .icon {
    font-size: 3em;
    margin-bottom: 15px;
}

.case-studies {
    display: grid;
    gap: 20px;
    margin: 30px 0;
}

.case {
    background: var(--light);
    padding: 25px;
    border-radius: 10px;
    border-left: 4px solid var(--primary);
}

.case h3 {
    color: var(--primary);
    margin-bottom: 10px;
}

.navigation {
    display: flex;
    justify-content: space-between;
    padding: 30px 40px;
    background: var(--light);
}

button {
    padding: 15px 40px;
    font-size: 1.1em;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s;
    font-weight: 600;
}

.btn-primary {
    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
    color: white;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
    background: white;
    color: var(--primary);
    border: 2px solid var(--primary);
}

.btn-secondary:hover {
    background: var(--primary);
    color: white;
}

@media (max-width: 768px) {
    .comparison {
        grid-template-columns: 1fr;
    }
    
    .benefits-grid {
        grid-template-columns: 1fr;
    }
    
    .navigation {
        flex-direction: column;
        gap: 15px;
    }
}
```

---

## 📦 วิธีสร้างและ Deploy

### ขั้นตอนที่ 1: สร้างไฟล์

```bash
# สร้างโครงสร้าง
mkdir skill-based-hiring
cd skill-based-hiring
mkdir shared res res/images

# สร้างไฟล์ทั้งหมด
# - imsmanifest.xml
# - module1.html - module4.html
# - quiz.html
# - shared/style.css
# - shared/scorm.js
```

### ขั้นตอนที่ 2: Package

```bash
# Zip ทั้ง folder
Compress-Archive -Path * -DestinationPath ../skill-based-hiring.zip
```

### ขั้นตอนที่ 3: Deploy

1. Extract ZIP
2. ไปที่ https://app.netlify.com
3. Drag & Drop folder
4. Copy URL

---

## ✅ Checklist ทั้ง 3 หลักสูตร

### Skill-Based Hiring
- [ ] Module 1-4 เนื้อหาครบ
- [ ] Quiz 15 ข้อ
- [ ] Case studies
- [ ] Deploy Netlify

### AI Image Generation
- [ ] Module 1-4 เนื้อหาครบ
- [ ] Prompt examples
- [ ] Quiz 12 ข้อ
- [ ] Deploy Netlify

### Equity Crowdfunding
- [ ] Module 1-4 เนื้อหาครบ
- [ ] Legal compliance
- [ ] Quiz 15 ข้อ
- [ ] Deploy Netlify

---

**ต้องการให้สร้างไฟล์เต็มรูปแบบของหลักสูตรไหนก่อนครับ?** 🚀

# 🎓 SCORM 2004 - Professional Series (Batch 3)

## 📦 หลักสูตรระดับมืออาชีพ

### 7. Generative AI for Professionals (ไม่ใช่แค่ Prompt)
### 8. Data-Driven Decision Making & Analytics
### 9. Cybersecurity Awareness & Data Governance

---

## 🤖 หลักสูตรที่ 7: Generative AI for Professionals

**ระยะเวลา:** 120 นาที | **Level:** Intermediate-Advanced

### โครงสร้างหลักสูตร

**Module 1: Beyond Prompting - AI Architecture (30 นาที)**

📚 **เนื้อหา:**
- Transformer Architecture & Attention Mechanism
- LLM Training Process (Pre-training, Fine-tuning, RLHF)
- Model Parameters & Context Windows
- Token Economics & Cost Optimization
- Open Source vs Proprietary Models

🎯 **Learning Objectives:**
- เข้าใจโครงสร้างพื้นฐานของ AI Models
- วิเคราะห์ความแตกต่างระหว่าง Models
- คำนวณต้นทุนการใช้งาน AI

💡 **Practical Examples:**
- เปรียบเทียบ GPT-4 vs Claude vs Llama
- คำนวณ Token Cost สำหรับโปรเจกต์จริง
- เลือก Model ที่เหมาะสมกับงาน

---

**Module 2: Advanced Integration & API (30 นาที)**

📚 **เนื้อหา:**
- API Integration Best Practices
- Function Calling & Tool Use
- Streaming Responses
- Error Handling & Retry Logic
- Rate Limiting & Quota Management
- Caching Strategies

🎯 **Learning Objectives:**
- สร้าง AI Application ด้วย API
- จัดการ Error และ Performance
- Optimize Cost และ Speed

💻 **Code Examples:**
```python
# OpenAI Function Calling
import openai

def get_weather(location):
    # API call to weather service
    pass

response = openai.ChatCompletion.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "What's the weather in Bangkok?"}],
    functions=[{
        "name": "get_weather",
        "description": "Get current weather",
        "parameters": {
            "type": "object",
            "properties": {
                "location": {"type": "string"}
            }
        }
    }]
)
```

---

**Module 3: RAG & Vector Databases (30 นาที)**

📚 **เนื้อหา:**
- Retrieval-Augmented Generation (RAG)
- Vector Embeddings & Similarity Search
- Vector Databases (Pinecone, Weaviate, Chroma)
- Chunking Strategies
- Hybrid Search (Vector + Keyword)
- RAG Evaluation Metrics

🎯 **Learning Objectives:**
- สร้าง RAG System จากเอกสารองค์กร
- เลือก Vector Database ที่เหมาะสม
- Optimize Retrieval Quality

🛠️ **Hands-on Project:**
- สร้าง Company Knowledge Base Chatbot
- Implement Semantic Search
- Measure Retrieval Accuracy

---

**Module 4: Fine-tuning & Production Deployment (30 นาที)**

📚 **เนื้อหา:**
- When to Fine-tune vs Prompt Engineering
- Dataset Preparation & Quality
- Fine-tuning Process (LoRA, QLoRA)
- Model Evaluation & Testing
- Deployment Strategies (Cloud, Edge, Hybrid)
- Monitoring & Observability
- A/B Testing & Continuous Improvement

🎯 **Learning Objectives:**
- ตัดสินใจว่าควร Fine-tune หรือไม่
- Deploy AI Model สู่ Production
- Monitor และ Improve Model

📊 **Case Studies:**
- Customer Service Bot Fine-tuning
- Legal Document Analysis
- Medical Diagnosis Assistant

---

**Quiz: 20 คำถาม**
- Technical concepts (40%)
- Architecture decisions (30%)
- Best practices (30%)
- ผ่าน 80%

---

## 📊 หลักสูตรที่ 8: Data-Driven Decision Making & Analytics

**ระยะเวลา:** 110 นาที | **Level:** Intermediate

### โครงสร้างหลักสูตร

**Module 1: Data Literacy & Analytics Fundamentals (25 นาที)**

📚 **เนื้อหา:**
- Types of Data (Structured, Unstructured, Semi-structured)
- Data Quality Dimensions (Accuracy, Completeness, Consistency)
- Descriptive vs Predictive vs Prescriptive Analytics
- Key Metrics & KPIs Framework
- Data Storytelling Principles

🎯 **Learning Objectives:**
- อ่านและเข้าใจข้อมูลได้อย่างถูกต้อง
- แยกแยะประเภทของ Analytics
- สร้าง KPI Framework

📈 **Frameworks:**
- SMART Goals for Metrics
- North Star Metric
- Pirate Metrics (AARRR)
- OKR (Objectives & Key Results)

---

**Module 2: Data Analysis Tools & Techniques (30 นาที)**

📚 **เนื้อหา:**
- Excel/Google Sheets Advanced Functions
- SQL for Data Analysis
- Business Intelligence Tools (Tableau, Power BI, Looker)
- Python for Data Analysis (Pandas, NumPy)
- Statistical Analysis Basics
- A/B Testing & Experimentation

🎯 **Learning Objectives:**
- ใช้เครื่องมือ Analytics อย่างมืออาชีพ
- วิเคราะห์ข้อมูลด้วย SQL และ Python
- ออกแบบและวิเคราะห์ A/B Tests

💻 **Practical Examples:**
```sql
-- Customer Cohort Analysis
SELECT 
    DATE_TRUNC('month', first_purchase_date) as cohort_month,
    COUNT(DISTINCT user_id) as cohort_size,
    SUM(revenue) as total_revenue,
    AVG(revenue) as avg_revenue_per_user
FROM users
GROUP BY cohort_month
ORDER BY cohort_month;
```

---

**Module 3: Data Visualization & Communication (25 นาที)**

📚 **เนื้อหา:**
- Visualization Best Practices
- Chart Types & When to Use
- Dashboard Design Principles
- Color Theory & Accessibility
- Interactive Visualizations
- Presenting Data to Stakeholders

🎯 **Learning Objectives:**
- สร้าง Visualization ที่มีประสิทธิภาพ
- ออกแบบ Dashboard ที่ใช้งานง่าย
- นำเสนอข้อมูลให้ผู้บริหารเข้าใจ

📊 **Chart Selection Guide:**
- Comparison → Bar Chart
- Trend → Line Chart
- Distribution → Histogram
- Relationship → Scatter Plot
- Composition → Pie/Stacked Chart

---

**Module 4: Decision Frameworks & Business Impact (30 นาที)**

📚 **เนื้อหา:**
- Data-Driven Decision Framework
- Cost-Benefit Analysis
- Risk Assessment & Mitigation
- Scenario Planning
- ROI Calculation
- Building Data Culture

🎯 **Learning Objectives:**
- ใช้ข้อมูลในการตัดสินใจอย่างเป็นระบบ
- คำนวณ ROI และ Business Impact
- สร้าง Data Culture ในองค์กร

🎯 **Decision Framework:**
1. Define the Problem
2. Collect Relevant Data
3. Analyze & Visualize
4. Generate Insights
5. Make Decision
6. Measure Impact

---

**Quiz: 15 คำถาม**
- Data concepts (30%)
- Tools & techniques (40%)
- Decision making (30%)
- ผ่าน 75%

---

## 🔒 หลักสูตรที่ 9: Cybersecurity Awareness & Data Governance

**ระยะเวลา:** 100 นาที | **Level:** Beginner-Intermediate

### โครงสร้างหลักสูตร

**Module 1: Cybersecurity Fundamentals (25 นาที)**

📚 **เนื้อหา:**
- CIA Triad (Confidentiality, Integrity, Availability)
- Common Cyber Threats (Phishing, Malware, Ransomware)
- Social Engineering Tactics
- Password Security & MFA
- Secure Browsing & Email
- Mobile Device Security

🎯 **Learning Objectives:**
- เข้าใจภัยคุกคามทางไซเบอร์
- ป้องกันตัวเองจาก Phishing และ Social Engineering
- ใช้งาน Password และ MFA อย่างปลอดภัย

⚠️ **Real-World Examples:**
- Phishing Email ตัวอย่างจริง
- Ransomware Attack Case Studies
- Social Engineering Scenarios

🛡️ **Best Practices:**
- Password: 12+ characters, unique, password manager
- MFA: Always enable on critical accounts
- Email: Verify sender, don't click suspicious links
- Updates: Keep software up-to-date

---

**Module 2: Data Protection & Privacy (25 นาที)**

📚 **เนื้อหา:**
- Personal Data vs Sensitive Data
- PDPA (Thailand) Overview
- GDPR Principles
- Data Classification
- Encryption Basics
- Data Breach Response
- Privacy by Design

🎯 **Learning Objectives:**
- เข้าใจกฎหมาย PDPA และ GDPR
- จำแนกและปกป้องข้อมูลส่วนบุคคล
- รับมือกับ Data Breach

📋 **PDPA Key Points:**
- Consent Management
- Data Subject Rights
- Data Retention Policy
- Cross-border Transfer
- Penalties & Compliance

🔐 **Data Classification:**
- **Public:** ข้อมูลสาธารณะ
- **Internal:** ข้อมูลภายในองค์กร
- **Confidential:** ข้อมูลลับ
- **Restricted:** ข้อมูลลับสุดยอด

---

**Module 3: Data Governance Framework (25 นาที)**

📚 **เนื้อหา:**
- Data Governance Principles
- Roles & Responsibilities (Data Owner, Steward, Custodian)
- Data Quality Management
- Master Data Management (MDM)
- Data Lineage & Metadata
- Data Catalog
- Compliance & Audit

🎯 **Learning Objectives:**
- สร้าง Data Governance Framework
- กำหนด Roles และ Responsibilities
- จัดการ Data Quality

🏗️ **Governance Framework:**
```
Data Governance Council
    ↓
Data Owners (Business)
    ↓
Data Stewards (Quality)
    ↓
Data Custodians (IT)
```

📊 **Data Quality Dimensions:**
- Accuracy: ถูกต้อง
- Completeness: ครบถ้วน
- Consistency: สอดคล้อง
- Timeliness: ทันเวลา
- Validity: ถูกรูปแบบ
- Uniqueness: ไม่ซ้ำ

---

**Module 4: Incident Response & Business Continuity (25 นาที)**

📚 **เนื้อหา:**
- Incident Response Plan
- Security Incident Types
- Reporting Procedures
- Containment & Recovery
- Business Continuity Planning (BCP)
- Disaster Recovery (DR)
- Backup Strategies (3-2-1 Rule)

🎯 **Learning Objectives:**
- รับมือกับ Security Incidents
- สร้าง Incident Response Plan
- วางแผน Business Continuity

🚨 **Incident Response Steps:**
1. **Preparation:** มีแผนและทีมพร้อม
2. **Detection:** ตรวจจับเหตุการณ์
3. **Containment:** จำกัดความเสียหาย
4. **Eradication:** กำจัดภัยคุกคาม
5. **Recovery:** กู้คืนระบบ
6. **Lessons Learned:** เรียนรู้และปรับปรุง

💾 **Backup Best Practices:**
- **3-2-1 Rule:**
  - 3 copies of data
  - 2 different media types
  - 1 offsite backup

---

**Quiz: 20 คำถาม**
- Security awareness (35%)
- Data protection (35%)
- Governance & compliance (30%)
- ผ่าน 80%

---

## 📁 โครงสร้างไฟล์มาตรฐาน

```
course-name/
├── imsmanifest.xml
├── index.html (Course Overview)
├── module1.html
├── module2.html
├── module3.html
├── module4.html
├── quiz.html
├── certificate.html (Completion Certificate)
├── shared/
│   ├── style.css
│   ├── scorm.js
│   ├── quiz.js
│   └── animations.js
└── res/
    ├── images/
    ├── icons/
    └── diagrams/
```

---

## 🎨 Enhanced Features

### Interactive Elements

```javascript
// shared/animations.js
class InteractiveContent {
    static createCodeEditor(containerId, initialCode) {
        // Syntax highlighted code editor
    }
    
    static createDiagram(containerId, data) {
        // Interactive diagrams
    }
    
    static createQuiz(questions) {
        // Inline quiz with instant feedback
    }
}
```

### Progress Tracking

```javascript
// shared/scorm.js - Enhanced
const scormAPI = {
    setProgress(moduleId, percentage) {
        // Track progress per module
    },
    
    setBookmark(location) {
        // Resume from last position
    },
    
    trackInteraction(type, data) {
        // Track user interactions
    }
}
```

---

## 📦 Package & Deploy Guide

### ขั้นตอนที่ 1: Validate SCORM

```bash
# ใช้ SCORM Cloud Validator
https://cloud.scorm.com/sc/guest/SignUpForm

# หรือ ADL SCORM Test Suite
```

### ขั้นตอนที่ 2: Optimize Assets

```bash
# Compress images
# Minify CSS/JS
# Test on multiple browsers
```

### ขั้นตอนที่ 3: Create ZIP

```bash
# Windows PowerShell
Compress-Archive -Path * -DestinationPath ../course-name.zip

# Verify ZIP structure
```

### ขั้นตอนที่ 4: Deploy to Netlify

```bash
# 1. Extract ZIP
# 2. Upload to Netlify
# 3. Test all modules
# 4. Copy URLs
```

---

## ✅ Quality Checklist

### Content Quality
- [ ] เนื้อหาถูกต้อง ทันสมัย
- [ ] ตัวอย่างและ Case Studies จริง
- [ ] Code Examples ทดสอบแล้ว
- [ ] ภาษาเข้าใจง่าย ไม่ซับซ้อน

### Technical Quality
- [ ] SCORM 2004 compliant
- [ ] ทดสอบใน LMS แล้ว
- [ ] Responsive design
- [ ] Cross-browser compatible
- [ ] Fast loading (<3 seconds)

### Learning Experience
- [ ] Clear learning objectives
- [ ] Interactive elements
- [ ] Progress tracking
- [ ] Instant feedback
- [ ] Certificate of completion

---

## 🎯 Learning Outcomes

หลังจากเรียนครบทั้ง 9 หลักสูตร ผู้เรียนจะสามารถ:

✅ **AI & Technology:**
- สร้างธุรกิจด้วย AI
- พัฒนาด้วย Amazon Q & VS Code
- สร้างระบบ Automation
- ใช้ Generative AI ระดับมืออาชีพ

✅ **Business & Management:**
- บริหารคนด้วย Skill-Based
- สร้างสื่อโฆษณาด้วย AI
- ระดมทุนและลงทุนยุคใหม่
- ตัดสินใจด้วยข้อมูล

✅ **Security & Governance:**
- ป้องกันภัยไซเบอร์
- จัดการข้อมูลตาม PDPA
- สร้าง Data Governance

---

## 📊 Course Catalog Summary

| # | Course Name | Duration | Level | Modules | Quiz |
|---|-------------|----------|-------|---------|------|
| 1 | AI-Powered Solopreneur | 80 min | Beginner | 4 | 10 Q |
| 2 | Amazon Q & VS Code | 80 min | Intermediate | 4 | 10 Q |
| 3 | No-Code Automation | 80 min | Beginner | 4 | 10 Q |
| 4 | Skill-Based Hiring | 80 min | Intermediate | 4 | 15 Q |
| 5 | AI Image Generation | 90 min | Intermediate | 4 | 12 Q |
| 6 | Equity Crowdfunding | 85 min | Intermediate | 4 | 15 Q |
| 7 | Generative AI Pro | 120 min | Advanced | 4 | 20 Q |
| 8 | Data-Driven Decisions | 110 min | Intermediate | 4 | 15 Q |
| 9 | Cybersecurity & Governance | 100 min | Beginner | 4 | 20 Q |

**Total:** 905 minutes (15+ hours) of professional content

---

**พร้อมสร้างไฟล์เต็มรูปแบบของหลักสูตรไหนก่อนครับ?** 🚀

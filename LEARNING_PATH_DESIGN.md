# 🛤️ Learning Path System Design - SkillNexus LMS

## 📋 Overview
ระบบเส้นทางการเรียนที่ครบถ้วน เชื่อมโยงจาก Career Goals → Skills → Courses → Lessons

## 🎯 Core Features

### 1. **Personalized Learning Paths**
- AI-driven path generation based on career goals
- Adaptive difficulty adjustment
- Real-time progress tracking
- Prerequisite management

### 2. **Career-Skill Mapping**
- Industry-standard skill requirements
- Skill level progression (Beginner → Expert)
- Cross-skill dependencies
- Market demand insights

### 3. **Smart Course Sequencing**
- Optimal learning order
- Difficulty progression
- Time estimation
- Completion milestones

### 4. **Progress Analytics**
- Learning velocity tracking
- Skill gap analysis
- Completion predictions
- Performance insights

## 🏗️ Database Schema Extensions

### New Models Required:

```prisma
model LearningPath {
  id          String   @id @default(cuid())
  title       String
  description String?
  careerId    String?
  difficulty  String   @default("BEGINNER") // BEGINNER, INTERMEDIATE, ADVANCED
  estimatedHours Int   @default(0)
  isPublic    Boolean  @default(true)
  createdBy   String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  career      Career?  @relation(fields: [careerId], references: [id])
  steps       LearningPathStep[]
  enrollments LearningPathEnrollment[]
  
  @@map("learning_paths")
}

model LearningPathStep {
  id            String   @id @default(cuid())
  pathId        String
  order         Int
  title         String
  description   String?
  type          String   // COURSE, SKILL_ASSESSMENT, PROJECT, QUIZ
  targetId      String?  // courseId, skillId, etc.
  isRequired    Boolean  @default(true)
  estimatedHours Int     @default(0)
  
  // Prerequisites
  prerequisites String?  // JSON array of step IDs
  
  // Relations
  path          LearningPath @relation(fields: [pathId], references: [id], onDelete: Cascade)
  completions   StepCompletion[]
  
  @@map("learning_path_steps")
}

model LearningPathEnrollment {
  id          String   @id @default(cuid())
  userId      String
  pathId      String
  startedAt   DateTime @default(now())
  completedAt DateTime?
  progress    Float    @default(0) // 0-100
  
  // Relations
  user        User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  path        LearningPath @relation(fields: [pathId], references: [id], onDelete: Cascade)
  
  @@unique([userId, pathId])
  @@map("learning_path_enrollments")
}

model StepCompletion {
  id          String   @id @default(cuid())
  userId      String
  stepId      String
  completedAt DateTime @default(now())
  score       Float?   // For assessments
  timeSpent   Int?     // In minutes
  
  // Relations
  user        User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  step        LearningPathStep @relation(fields: [stepId], references: [id], onDelete: Cascade)
  
  @@unique([userId, stepId])
  @@map("step_completions")
}

model SkillPrerequisite {
  id              String @id @default(cuid())
  skillId         String
  prerequisiteId  String
  requiredLevel   Int    @default(1)
  
  // Relations
  skill           Skill  @relation("SkillPrerequisites", fields: [skillId], references: [id], onDelete: Cascade)
  prerequisite    Skill  @relation("PrerequisiteFor", fields: [prerequisiteId], references: [id], onDelete: Cascade)
  
  @@unique([skillId, prerequisiteId])
  @@map("skill_prerequisites")
}
```

## 🤖 AI Learning Path Generator

### Algorithm Components:

1. **Career Analysis**
   - Industry skill requirements
   - Market demand trends
   - Salary correlations

2. **Skill Gap Detection**
   - Current vs target skills
   - Learning velocity analysis
   - Difficulty assessment

3. **Path Optimization**
   - Shortest learning path
   - Prerequisite ordering
   - Time constraints

4. **Adaptive Adjustments**
   - Performance-based difficulty
   - Learning style preferences
   - Real-time feedback

## 📱 User Interface Components

### 1. **Path Discovery**
- Career-based path suggestions
- Skill-based filtering
- Difficulty level selection
- Time commitment options

### 2. **Progress Visualization**
- Interactive path map
- Completion milestones
- Skill progression charts
- Time tracking

### 3. **Adaptive Recommendations**
- Next best step suggestions
- Alternative path options
- Skill reinforcement
- Challenge adjustments

## 🎯 Implementation Phases

### Phase 1: Core Infrastructure (Week 1-2)
- [ ] Database schema updates
- [ ] Basic CRUD operations
- [ ] Path enrollment system

### Phase 2: AI Engine (Week 3-4)
- [ ] Path generation algorithm
- [ ] Skill gap analysis
- [ ] Prerequisite management

### Phase 3: User Interface (Week 5-6)
- [ ] Path discovery page
- [ ] Progress dashboard
- [ ] Interactive path map

### Phase 4: Advanced Features (Week 7-8)
- [ ] Adaptive learning
- [ ] Social learning paths
- [ ] Performance analytics

## 📊 Success Metrics

### Learning Effectiveness
- Course completion rates: +25%
- Skill acquisition speed: +40%
- Student satisfaction: +30%

### Engagement Metrics
- Time on platform: +50%
- Path completion rate: 85%+
- Return user rate: +35%

### Business Impact
- Course enrollment: +60%
- Revenue per user: +45%
- Customer lifetime value: +55%

## 🔧 Technical Considerations

### Performance Optimization
- Path caching strategies
- Lazy loading for large paths
- Background progress calculations

### Scalability
- Microservice architecture
- Database sharding
- CDN for static assets

### Security
- Path access controls
- Progress data encryption
- Audit logging

---

**Next Steps:** Implement Phase 1 database schema and basic functionality
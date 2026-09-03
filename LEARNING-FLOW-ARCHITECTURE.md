# Learning Flow Management System - Architecture Design

## 📋 Table of Contents
1. [System Overview](#system-overview)
2. [Architecture Components](#architecture-components)
3. [Database Schema](#database-schema)
4. [Rule Engine](#rule-engine)
5. [API Design](#api-design)
6. [Implementation Guide](#implementation-guide)
7. [Security & Anti-Cheating](#security--anti-cheating)

---

## 1. System Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Layer (Next.js)                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Course  │  │  Video   │  │  SCORM   │  │   Quiz   │   │
│  │  Player  │  │  Player  │  │  Player  │  │  Player  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                           ↕ WebSocket/REST
┌─────────────────────────────────────────────────────────────┐
│                     API Layer (Server)                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Rule Engine (Core Logic)                │  │
│  │  • Dependency Resolution                             │  │
│  │  • Progress Evaluation                               │  │
│  │  • Unlock Calculation                                │  │
│  │  • Certificate Eligibility Check                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Progress │  │   Quiz   │  │   SCORM  │  │   Cert   │  │
│  │   API    │  │   API    │  │   API    │  │   API    │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↕ Prisma ORM
┌─────────────────────────────────────────────────────────────┐
│                    Data Layer (PostgreSQL)                  │
│  • Learning Paths & Nodes (Graph Structure)                │
│  • Progress Tracking (Video, SCORM, Quiz)                  │
│  • Dependencies & Rules                                    │
│  • Certificates & Audit Logs                               │
└─────────────────────────────────────────────────────────────┘
```

### Key Design Principles

1. **Graph-Based Structure**: Directed Acyclic Graph (DAG) for flexible learning paths
2. **Idempotent Operations**: All progress updates are retry-safe
3. **Transaction Safety**: All state changes use database transactions
4. **Event Sourcing**: Audit log for all unlock/progress events
5. **Real-time Sync**: WebSocket for multi-device progress synchronization
6. **Anti-Cheating**: Server-side validation, rate limiting, anomaly detection

---

## 2. Architecture Components

### Component Diagram

```
┌───────────────────────────────────────────────────────────────────┐
│                      Course Flow System                           │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────┐         ┌─────────────────┐                │
│  │  Learning Node  │◄────────│  Course Graph   │                │
│  │  (Abstract)     │         │  Manager        │                │
│  └────────┬────────┘         └─────────────────┘                │
│           │                                                       │
│    ┌──────┴──────┬──────────┬──────────┐                       │
│    │             │          │          │                        │
│  ┌─▼──┐      ┌──▼──┐   ┌──▼──┐   ┌──▼──┐                     │
│  │Video│      │SCORM│   │Quiz │   │Cert │                     │
│  │Node │      │Node │   │Node │   │Node │                     │
│  └─────┘      └─────┘   └─────┘   └─────┘                     │
│                                                                   │
│  ┌─────────────────────────────────────────────────┐            │
│  │         Dependency Resolution Engine            │            │
│  │  • Topological Sort (DAG validation)            │            │
│  │  • Prerequisite Checking (AND/OR logic)         │            │
│  │  • Circular Dependency Detection                │            │
│  └─────────────────────────────────────────────────┘            │
│                                                                   │
│  ┌─────────────────────────────────────────────────┐            │
│  │         Progress Evaluation Engine              │            │
│  │  • Video: Watch time >= threshold               │            │
│  │  • SCORM: completion_status + success_status    │            │
│  │  • Quiz: score >= passScore && status = PASSED  │            │
│  │  • Course: All required nodes completed         │            │
│  └─────────────────────────────────────────────────┘            │
│                                                                   │
│  ┌─────────────────────────────────────────────────┐            │
│  │         Unlock Calculation Engine               │            │
│  │  • Real-time dependency check                   │            │
│  │  • Lazy unlock (on-demand)                      │            │
│  │  • Cache invalidation on progress update        │            │
│  └─────────────────────────────────────────────────┘            │
│                                                                   │
│  ┌─────────────────────────────────────────────────┐            │
│  │         Certificate Issuance System             │            │
│  │  • Eligibility verification                     │            │
│  │  • PDF generation (PDFKit/Puppeteer)            │            │
│  │  • Blockchain verification (optional)           │            │
│  │  • Email notification                           │            │
│  └─────────────────────────────────────────────────┘            │
│                                                                   │
│  ┌─────────────────────────────────────────────────┐            │
│  │         Event Audit System                      │            │
│  │  • Progress events                              │            │
│  │  • Unlock events with reasons                   │            │
│  │  • Certificate issuance                         │            │
│  │  • Quiz attempts & results                      │            │
│  └─────────────────────────────────────────────────┘            │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

---

## 3. Database Schema

See `LEARNING-FLOW-SCHEMA.md` for complete Prisma models.

### Key Tables

1. **LearningPath** - Course learning flow definition
2. **LearningNode** - Individual learning units (Video/SCORM/Quiz)
3. **NodeDependency** - Prerequisites graph edges
4. **NodeProgress** - User progress per node
5. **QuizAttempt** - Quiz submission records
6. **NodeUnlockLog** - Audit trail of unlocks
7. **CourseCertificate** - Issued certificates

---

## 4. Rule Engine

### Rule Evaluation Flow

```
┌─────────────────────────────────────────────────────────────┐
│  User requests to access Node X                            │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
         ┌─────────────────────────────┐
         │  Load Node X Dependencies   │
         └─────────────┬───────────────┘
                       ↓
         ┌─────────────────────────────┐
         │  For each Prerequisite:     │
         │  1. Check completion status │
         │  2. Evaluate rule type      │
         │  3. Compute AND/OR logic    │
         └─────────────┬───────────────┘
                       ↓
              ┌────────┴────────┐
              │  All satisfied? │
              └────────┬────────┘
                       │
         ┌─────────────┴─────────────┐
         │                           │
       Yes                          No
         │                           │
         ↓                           ↓
  ┌─────────────┐          ┌──────────────────┐
  │ UNLOCK Node │          │ LOCK Node        │
  │ Return TRUE │          │ Return FALSE +   │
  │             │          │ Missing reasons  │
  └─────────────┘          └──────────────────┘
```

### Rule Types

1. **VIDEO_COMPLETION**: `watchedPercentage >= requiredPercentage`
2. **SCORM_COMPLETION**: `completion_status === 'completed'`
3. **SCORM_SUCCESS**: `success_status === 'passed'`
4. **QUIZ_PASSED**: `score >= passScore AND attemptStatus === 'PASSED'`
5. **COURSE_COMPLETED**: All required nodes completed
6. **CUSTOM_RULE**: JavaScript expression evaluation

---

## 5. API Design

See `LEARNING-FLOW-API.md` for complete endpoint specifications.

### Core Endpoints

```
# Progress Tracking
POST   /api/progress/video
POST   /api/progress/scorm
POST   /api/progress/quiz

# Node Access Control
GET    /api/course/:id/graph
GET    /api/course/:id/unlock-status
GET    /api/node/:id/can-access

# Quiz System
POST   /api/quiz/:id/start
POST   /api/quiz/:id/submit
GET    /api/quiz/:id/attempts

# Certificate
POST   /api/certificate/issue
GET    /api/certificate/:id/download
GET    /api/dashboard/certificates
```

---

## 6. Implementation Guide

### Phase 1: Database Setup
1. Create Prisma schema
2. Run migrations
3. Seed test data

### Phase 2: Rule Engine
1. Implement dependency resolver
2. Build progress evaluator
3. Create unlock calculator

### Phase 3: API Layer
1. Progress tracking endpoints
2. Unlock status endpoints
3. Certificate issuance

### Phase 4: Client Integration
1. Course player with flow visualization
2. Progress indicators
3. Lock/unlock UI states

### Phase 5: Testing & Optimization
1. Load testing
2. Concurrency testing
3. Cache optimization

---

## 7. Security & Anti-Cheating

### Video Anti-Skip

```javascript
// Server-side validation
function validateVideoProgress(userId, lessonId, newWatchTime, oldWatchTime) {
  const timeDelta = newWatchTime - oldWatchTime
  const realTimeDelta = Date.now() - lastUpdateTimestamp
  
  // Cannot advance faster than real-time (with 10% buffer)
  if (timeDelta > realTimeDelta * 1.1) {
    throw new Error('INVALID_PROGRESS_ADVANCE')
  }
  
  // Cannot skip more than 10 seconds ahead
  if (timeDelta > 10000) {
    throw new Error('SUSPICIOUS_SKIP_DETECTED')
  }
  
  return true
}
```

### SCORM Data Validation

```javascript
// Validate SCORM CMI data before accepting
function validateScormData(cmiData) {
  // Check for valid completion status
  if (!['completed', 'incomplete', 'not attempted'].includes(
    cmiData.completion_status
  )) {
    throw new Error('INVALID_COMPLETION_STATUS')
  }
  
  // Success status must be valid
  if (!['passed', 'failed', 'unknown'].includes(cmiData.success_status)) {
    throw new Error('INVALID_SUCCESS_STATUS')
  }
  
  // Score must be within valid range
  if (cmiData.score_raw < 0 || cmiData.score_raw > 100) {
    throw new Error('INVALID_SCORE_RANGE')
  }
  
  return true
}
```

### Quiz Anti-Cheating

1. **Time-bound sessions**: Quiz must be completed within time limit
2. **One active attempt**: Cannot have multiple simultaneous attempts
3. **Answer randomization**: Question/option shuffle per attempt
4. **Rate limiting**: Maximum attempts per hour
5. **IP tracking**: Flag suspicious IP changes mid-quiz

### Progress Sync Conflict Resolution

```javascript
// Last-write-wins with server timestamp
async function syncProgress(userId, nodeId, clientProgress, clientTimestamp) {
  return await prisma.$transaction(async (tx) => {
    const serverProgress = await tx.nodeProgress.findUnique({
      where: { userId_nodeId: { userId, nodeId } }
    })
    
    // Server data is newer, reject client update
    if (serverProgress && serverProgress.updatedAt > clientTimestamp) {
      return { 
        success: false, 
        reason: 'STALE_DATA',
        serverProgress 
      }
    }
    
    // Client data is newer or equal, accept update
    return await tx.nodeProgress.upsert({
      where: { userId_nodeId: { userId, nodeId } },
      update: { ...clientProgress, updatedAt: new Date() },
      create: { userId, nodeId, ...clientProgress }
    })
  })
}
```

---

## 📊 Monitoring & Analytics

### Key Metrics to Track

1. **Progress Velocity**: Average time to complete each node type
2. **Unlock Rate**: % of users who unlock each node
3. **Bottleneck Nodes**: Nodes with high drop-off rate
4. **Certificate Completion Rate**: % of enrolled users who get certificate
5. **Quiz Performance**: Average scores, attempt counts
6. **SCORM Interaction**: Detailed interaction logs

### Event Logging

All critical events are logged to `NodeUnlockLog` for audit:
- Node unlocked (with reason)
- Progress updated
- Quiz attempted
- Certificate issued

---

## 🔄 Future Enhancements

1. **AI-driven adaptive learning**: Recommend optimal learning path
2. **Peer prerequisites**: Unlock based on cohort progress
3. **Time-based unlock**: Release content on schedule
4. **Blockchain certificates**: Immutable verification
5. **Learning analytics dashboard**: Real-time insights

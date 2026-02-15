-- CreateTable
CREATE TABLE "courses" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "price" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modules" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "courseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lessons" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'VIDEO',
    "order" INTEGER NOT NULL,
    "title" TEXT,
    "youtubeUrl" TEXT,
    "launchUrl" TEXT,
    "requiredPct" INTEGER,
    "durationMin" INTEGER,
    "quizId" TEXT,
    "moduleId" TEXT,
    "content" TEXT,
    "duration" DOUBLE PRECISION,
    "lessonType" TEXT NOT NULL DEFAULT 'VIDEO',
    "requiredCompletionPercentage" INTEGER NOT NULL DEFAULT 80,
    "isFinalExam" BOOLEAN NOT NULL DEFAULT false,
    "nextLessonId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enrollments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "watch_history" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "watchTime" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalTime" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "watch_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quizzes" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "courseId" TEXT,
    "timeLimit" INTEGER DEFAULT 0,
    "randomize" BOOLEAN NOT NULL DEFAULT false,
    "shuffleOptions" BOOLEAN NOT NULL DEFAULT false,
    "questionPoolSize" INTEGER,
    "questionsToShow" INTEGER,
    "passScore" INTEGER NOT NULL DEFAULT 70,
    "prerequisiteQuizId" TEXT,
    "retryDelayMinutes" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quizzes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'MULTIPLE_CHOICE',
    "quizId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "correctAnswer" TEXT,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "answer_options" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "questionId" TEXT NOT NULL,

    CONSTRAINT "answer_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_submissions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "score" DOUBLE PRECISION,
    "passed" BOOLEAN NOT NULL DEFAULT false,
    "answers" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skills" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skill_assessments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 0,
    "courseId" TEXT,

    CONSTRAINT "skill_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certificates" (
    "id" TEXT NOT NULL,
    "certificateNumber" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "verificationToken" TEXT NOT NULL,
    "digitalSignature" TEXT NOT NULL,
    "qrCodeUrl" TEXT,
    "pdfUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "bardData" TEXT NOT NULL,

    CONSTRAINT "certificates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bard_skills" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bard_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_bard_skills" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "bardSkillId" TEXT NOT NULL,

    CONSTRAINT "question_bard_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classrooms" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "courseId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "classrooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "careers" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "careers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "career_skills" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "career_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment_questions" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "careerId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "option1" TEXT NOT NULL,
    "option2" TEXT NOT NULL,
    "option3" TEXT NOT NULL,
    "option4" TEXT NOT NULL,
    "correctAnswer" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 1,
    "skillCategory" TEXT DEFAULT 'General',
    "skillImportance" TEXT DEFAULT 'Medium',
    "questionType" TEXT DEFAULT 'single',
    "difficultyLevel" TEXT DEFAULT 'Intermediate',
    "explanation" TEXT,
    "courseLink" TEXT,
    "courseTitle" TEXT,
    "learningResource" TEXT,
    "estimatedTime" INTEGER,
    "prerequisiteSkills" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assessment_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment_results" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "careerId" TEXT NOT NULL,
    "totalScore" INTEGER NOT NULL DEFAULT 0,
    "maxScore" INTEGER NOT NULL DEFAULT 0,
    "percentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "level" TEXT NOT NULL DEFAULT 'Beginner',
    "timeSpent" INTEGER NOT NULL DEFAULT 0,
    "answers" TEXT NOT NULL,
    "skillScores" TEXT NOT NULL,
    "analysis" TEXT,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assessment_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "description" TEXT,
    "courseId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'THB',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "paymentMethod" TEXT NOT NULL,
    "stripePaymentId" TEXT,
    "promptPayRef" TEXT,
    "bankTransferRef" TEXT,
    "qrCodeData" TEXT,
    "description" TEXT,
    "metadata" TEXT,
    "paidAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_methods" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "config" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_methods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "nameEn" TEXT,
    "phone" TEXT,
    "birthDate" TEXT,
    "gender" TEXT,
    "education" TEXT,
    "occupation" TEXT,
    "address" TEXT,
    "province" TEXT,
    "postalCode" TEXT,
    "role" TEXT NOT NULL DEFAULT 'STUDENT',
    "stripeCustomerId" TEXT,
    "credits" INTEGER NOT NULL DEFAULT 0,
    "certificateTemplate" INTEGER DEFAULT 1,
    "totalXP" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 1,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "maxStreak" INTEGER NOT NULL DEFAULT 0,
    "lastLoginDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_knowledge_base" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'general',
    "courseId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chat_knowledge_base_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_chunks" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "embedding" TEXT,
    "metadata" TEXT,
    "chunkIndex" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_chunks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileUrl" TEXT,
    "sourceUrl" TEXT,
    "courseId" TEXT,
    "uploadedBy" TEXT,
    "status" TEXT NOT NULL DEFAULT 'processing',
    "totalChunks" INTEGER NOT NULL DEFAULT 0,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "sessionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chat_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_messages" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isBot" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learning_paths" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "careerId" TEXT,
    "difficulty" TEXT NOT NULL DEFAULT 'BEGINNER',
    "estimatedHours" INTEGER NOT NULL DEFAULT 0,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "tags" TEXT,
    "imageUrl" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "learning_paths_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learning_path_steps" (
    "id" TEXT NOT NULL,
    "pathId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "targetId" TEXT,
    "targetType" TEXT,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "estimatedHours" INTEGER NOT NULL DEFAULT 0,
    "points" INTEGER NOT NULL DEFAULT 0,
    "prerequisites" TEXT DEFAULT '[]',
    "metadata" TEXT,

    CONSTRAINT "learning_path_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learning_path_enrollments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "pathId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "lastAccessAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "progress" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currentStepId" TEXT,
    "learningStyle" TEXT,
    "timeGoal" INTEGER,

    CONSTRAINT "learning_path_enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "step_completions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stepId" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "score" DOUBLE PRECISION,
    "timeSpent" INTEGER,
    "attempts" INTEGER NOT NULL DEFAULT 1,
    "difficulty" INTEGER,
    "feedback" TEXT,

    CONSTRAINT "step_completions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "path_reviews" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "pathId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "path_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skill_prerequisites" (
    "id" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "prerequisiteId" TEXT NOT NULL,
    "requiredLevel" INTEGER NOT NULL DEFAULT 1,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1.0,

    CONSTRAINT "skill_prerequisites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learning_goals" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "targetDate" TIMESTAMP(3),
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "progress" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "pathIds" TEXT,
    "skillIds" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "learning_goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learning_streaks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "lastActivity" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "learning_streaks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interactive_results" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "passed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "interactive_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scorm_packages" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "packagePath" TEXT NOT NULL,
    "manifest" TEXT,
    "version" TEXT NOT NULL DEFAULT '1.2',
    "title" TEXT,
    "identifier" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scorm_packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scorm_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "cmiData" TEXT,
    "completionStatus" TEXT NOT NULL DEFAULT 'incomplete',
    "successStatus" TEXT NOT NULL DEFAULT 'unknown',
    "scoreRaw" DOUBLE PRECISION,
    "scoreMax" DOUBLE PRECISION,
    "scoreMin" DOUBLE PRECISION,
    "sessionTime" TEXT,
    "totalTime" TEXT,
    "location" TEXT,
    "suspendData" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scorm_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rag_documents" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'processing',
    "totalChunks" INTEGER NOT NULL DEFAULT 0,
    "processedAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rag_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rag_chunks" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "embedding" TEXT,
    "chunkIndex" INTEGER NOT NULL,
    "keywords" TEXT,
    "summary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rag_chunks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "knowledge_chunks" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "documentName" TEXT NOT NULL,
    "embedding" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "knowledge_chunks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "study_groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "courseId" TEXT,
    "creatorId" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "maxMembers" INTEGER NOT NULL DEFAULT 50,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "study_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "study_group_members" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'MEMBER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "study_group_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_discussions" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "group_discussions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discussion_replies" (
    "id" TEXT NOT NULL,
    "discussionId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "discussion_replies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "study_sessions" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "study_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_attendances" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'REGISTERED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "session_attendances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "peer_reviews" (
    "id" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "revieweeId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "courseId" TEXT,
    "lessonId" TEXT,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "peer_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "experience" INTEGER NOT NULL DEFAULT 0,
    "totalPoints" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 1,
    "streak" INTEGER NOT NULL DEFAULT 0,
    "lastActivity" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "badges" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "color" TEXT,
    "points" INTEGER NOT NULL DEFAULT 0,
    "criteria" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_badges" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_achievements" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "metadata" TEXT,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leaderboard_entries" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "rank" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leaderboard_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "voice_assignments" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "instruction" TEXT NOT NULL,
    "targetText" TEXT,
    "keywords" TEXT,
    "minWords" INTEGER NOT NULL DEFAULT 50,
    "maxDuration" INTEGER NOT NULL DEFAULT 120,
    "passingScore" INTEGER NOT NULL DEFAULT 70,
    "aiMode" TEXT NOT NULL DEFAULT 'FREE',
    "maxAttempts" INTEGER NOT NULL DEFAULT 3,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "voice_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "voice_submissions" (
    "id" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "audioUrl" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "transcription" TEXT NOT NULL,
    "analysis" TEXT,
    "score" INTEGER NOT NULL,
    "feedback" TEXT NOT NULL,
    "attempt" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "aiMode" TEXT NOT NULL,
    "creditsUsed" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "voice_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_keys" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3),
    "lastUsedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_logs" (
    "id" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL,
    "responseTime" INTEGER NOT NULL,
    "userId" TEXT,
    "apiKeyId" TEXT,
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "api_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webhooks" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "events" TEXT NOT NULL,
    "secret" TEXT,
    "userId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastTriggeredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "webhooks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domain" TEXT,
    "logo" TEXT,
    "primaryColor" TEXT NOT NULL DEFAULT '#3b82f6',
    "secondaryColor" TEXT NOT NULL DEFAULT '#8b5cf6',
    "favicon" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_rewards" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rewardType" TEXT NOT NULL,
    "rewardValue" INTEGER NOT NULL,
    "streakDay" INTEGER DEFAULT 1,
    "claimedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_rewards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "achievements" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT,
    "xpReward" INTEGER NOT NULL DEFAULT 0,
    "badgeReward" TEXT,
    "requirementType" TEXT NOT NULL,
    "requirementValue" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_achievements_new" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "achievementId" TEXT NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "progress" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "user_achievements_new_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_xp_log" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "xpGained" INTEGER NOT NULL,
    "source" TEXT NOT NULL,
    "sourceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_xp_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_missions" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "target" INTEGER NOT NULL DEFAULT 1,
    "xpReward" INTEGER NOT NULL DEFAULT 50,
    "creditReward" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "daily_missions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mission_completions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mission_completions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credit_store" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "cost" INTEGER NOT NULL,
    "targetId" TEXT,
    "imageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "credit_store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credit_purchases" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "cost" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "credit_purchases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blocked_ips" (
    "id" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "reason" TEXT,
    "blockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "blocked_ips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security_logs" (
    "id" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userId" TEXT,
    "details" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "security_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "threat_detections" (
    "id" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "threatType" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "blocked" BOOLEAN NOT NULL DEFAULT false,
    "attempts" INTEGER NOT NULL DEFAULT 1,
    "lastAttempt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "threat_detections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "event" TEXT NOT NULL,
    "page" TEXT NOT NULL,
    "userAgent" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_assets" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "url" TEXT NOT NULL,
    "checksum" TEXT NOT NULL,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "badge_design_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "templateData" TEXT NOT NULL,
    "previewUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "badge_design_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_certificate_definitions" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "templateHtml" TEXT NOT NULL,
    "issuerName" TEXT NOT NULL DEFAULT 'SkillNexus LMS',
    "issuerTitle" TEXT NOT NULL DEFAULT 'Learning Management System',
    "expiryMonths" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_certificate_definitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_certificate_criteria" (
    "id" TEXT NOT NULL,
    "definitionId" TEXT NOT NULL,
    "criteriaType" TEXT NOT NULL,
    "criteriaValue" TEXT NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "course_certificate_criteria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_certificates" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "definitionId" TEXT NOT NULL,
    "verificationCode" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiryDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "revokedAt" TIMESTAMP(3),
    "revokedReason" TEXT,
    "pdfUrl" TEXT,

    CONSTRAINT "course_certificates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_badge_definitions" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "assetId" TEXT,
    "designData" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_badge_definitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_badges" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "definitionId" TEXT NOT NULL,
    "certificateId" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "course_badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "career_paths" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "difficulty" TEXT NOT NULL DEFAULT 'BEGINNER',
    "estimatedHours" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "career_paths_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "career_path_courses" (
    "id" TEXT NOT NULL,
    "careerPathId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "career_path_courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "career_requirements" (
    "id" TEXT NOT NULL,
    "careerPathId" TEXT NOT NULL,
    "requirementType" TEXT NOT NULL,
    "requirementValue" TEXT NOT NULL,
    "logicType" TEXT NOT NULL DEFAULT 'AND',

    CONSTRAINT "career_requirements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "career_certificate_definitions" (
    "id" TEXT NOT NULL,
    "careerPathId" TEXT NOT NULL,
    "templateHtml" TEXT NOT NULL,
    "issuerName" TEXT NOT NULL DEFAULT 'SkillNexus LMS',
    "issuerTitle" TEXT NOT NULL DEFAULT 'Career Development Program',
    "expiryMonths" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "career_certificate_definitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "career_certificates" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "careerPathId" TEXT NOT NULL,
    "definitionId" TEXT NOT NULL,
    "verificationCode" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiryDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "courseBadgesSnapshot" TEXT NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "revokedReason" TEXT,
    "pdfUrl" TEXT,

    CONSTRAINT "career_certificates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "career_badge_definitions" (
    "id" TEXT NOT NULL,
    "careerPathId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "assetId" TEXT,
    "designData" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "career_badge_definitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "career_badges" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "careerPathId" TEXT NOT NULL,
    "definitionId" TEXT NOT NULL,
    "certificateId" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "career_badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_records" (
    "id" TEXT NOT NULL,
    "verificationCode" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "recipientName" TEXT NOT NULL,
    "issuerName" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL,
    "expiryDate" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verification_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visitor_stats" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "totalVisitors" INTEGER NOT NULL DEFAULT 0,
    "lastVisit" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "visitor_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learning_nodes" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "nodeType" TEXT NOT NULL,
    "refId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "requiredScore" INTEGER,
    "requiredProgress" DOUBLE PRECISION,
    "requiredDuration" INTEGER,
    "isFinalExam" BOOLEAN NOT NULL DEFAULT false,
    "isOptional" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "learning_nodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "node_dependencies" (
    "id" TEXT NOT NULL,
    "fromNodeId" TEXT NOT NULL,
    "toNodeId" TEXT NOT NULL,
    "dependencyType" TEXT NOT NULL DEFAULT 'AND',
    "customRule" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "node_dependencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "node_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "nodeId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NOT_STARTED',
    "progressPercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "score" DOUBLE PRECISION,
    "timeSpent" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "lastActivityAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version" INTEGER NOT NULL DEFAULT 1,
    "deviceId" TEXT,
    "ipAddress" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "node_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "video_segments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "startTime" DOUBLE PRECISION NOT NULL,
    "endTime" DOUBLE PRECISION NOT NULL,
    "watchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "video_segments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scorm_runtime_data" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "completionStatus" TEXT,
    "successStatus" TEXT,
    "scoreRaw" DOUBLE PRECISION,
    "scoreMin" DOUBLE PRECISION,
    "scoreMax" DOUBLE PRECISION,
    "totalTime" TEXT,
    "sessionTime" TEXT,
    "suspendData" TEXT,
    "location" TEXT,
    "cmiData" JSONB,
    "lastCommit" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scorm_runtime_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_attempt_records" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "nodeId" TEXT,
    "attemptNumber" INTEGER NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "answers" JSONB NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeSpent" INTEGER NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "idempotencyKey" TEXT,

    CONSTRAINT "quiz_attempt_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unlock_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "nodeId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "triggeredBy" TEXT,
    "ruleSnapshot" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "unlock_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certificate_files" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "certificateType" TEXT NOT NULL,
    "verificationId" TEXT NOT NULL,
    "pdfUrl" TEXT NOT NULL,
    "pdfHash" TEXT NOT NULL,
    "issuerName" TEXT NOT NULL,
    "recipientName" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiryDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "revokedAt" TIMESTAMP(3),
    "revokedReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "certificate_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_progress_summary" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "totalNodes" INTEGER NOT NULL,
    "completedNodes" INTEGER NOT NULL,
    "progressPercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "canTakeFinalExam" BOOLEAN NOT NULL DEFAULT false,
    "finalExamPassed" BOOLEAN NOT NULL DEFAULT false,
    "certificateIssued" BOOLEAN NOT NULL DEFAULT false,
    "lastActivity" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_progress_summary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skill_badges" (
    "id" TEXT NOT NULL,
    "badgeName" TEXT NOT NULL,
    "skillCategory" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "criteriaType" TEXT NOT NULL,
    "criteriaValue" TEXT NOT NULL,
    "issuerName" TEXT NOT NULL DEFAULT 'SkillNexus Academy',
    "issuerUrl" TEXT,
    "issuerEmail" TEXT,
    "expiryMonths" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "skill_badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_skill_badges" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "issuedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiryDate" TIMESTAMP(3),
    "evidenceType" TEXT,
    "evidenceId" TEXT,
    "evidenceUrl" TEXT,
    "evidenceData" TEXT,
    "verificationCode" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "revokedAt" TIMESTAMP(3),
    "revokedReason" TEXT,

    CONSTRAINT "user_skill_badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skill_certifications" (
    "id" TEXT NOT NULL,
    "certificationName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "minimumBadgeLevel" TEXT,
    "issuerName" TEXT NOT NULL DEFAULT 'SkillNexus Academy',
    "issuerUrl" TEXT,
    "issuerLogo" TEXT,
    "validityMonths" INTEGER,
    "imageUrl" TEXT,
    "certificateTemplate" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "skill_certifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certification_badges" (
    "id" TEXT NOT NULL,
    "certificationId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "certification_badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_certifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "certificationId" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiryDate" TIMESTAMP(3),
    "certificationNumber" TEXT NOT NULL,
    "verificationCode" TEXT NOT NULL,
    "verificationUrl" TEXT,
    "digitalSignature" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "earnedBadgesSnapshot" TEXT NOT NULL,
    "pdfUrl" TEXT,
    "pdfGeneratedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "revokedReason" TEXT,

    CONSTRAINT "user_certifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certification_events" (
    "id" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "metadata" TEXT,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "certification_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "actionUrl" TEXT,
    "metadata" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "lessons_nextLessonId_key" ON "lessons"("nextLessonId");

-- CreateIndex
CREATE INDEX "lessons_courseId_idx" ON "lessons"("courseId");

-- CreateIndex
CREATE INDEX "lessons_moduleId_idx" ON "lessons"("moduleId");

-- CreateIndex
CREATE INDEX "lessons_type_courseId_idx" ON "lessons"("type", "courseId");

-- CreateIndex
CREATE INDEX "lessons_lessonType_idx" ON "lessons"("lessonType");

-- CreateIndex
CREATE INDEX "enrollments_userId_idx" ON "enrollments"("userId");

-- CreateIndex
CREATE INDEX "enrollments_courseId_idx" ON "enrollments"("courseId");

-- CreateIndex
CREATE INDEX "enrollments_createdAt_idx" ON "enrollments"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "enrollments_userId_courseId_key" ON "enrollments"("userId", "courseId");

-- CreateIndex
CREATE INDEX "watch_history_userId_lessonId_updatedAt_idx" ON "watch_history"("userId", "lessonId", "updatedAt");

-- CreateIndex
CREATE INDEX "watch_history_completed_updatedAt_idx" ON "watch_history"("completed", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "watch_history_userId_lessonId_key" ON "watch_history"("userId", "lessonId");

-- CreateIndex
CREATE INDEX "quizzes_courseId_idx" ON "quizzes"("courseId");

-- CreateIndex
CREATE INDEX "quizzes_prerequisiteQuizId_idx" ON "quizzes"("prerequisiteQuizId");

-- CreateIndex
CREATE INDEX "student_submissions_userId_quizId_createdAt_idx" ON "student_submissions"("userId", "quizId", "createdAt");

-- CreateIndex
CREATE INDEX "student_submissions_score_idx" ON "student_submissions"("score");

-- CreateIndex
CREATE UNIQUE INDEX "skills_name_key" ON "skills"("name");

-- CreateIndex
CREATE UNIQUE INDEX "skill_assessments_userId_skillId_key" ON "skill_assessments"("userId", "skillId");

-- CreateIndex
CREATE UNIQUE INDEX "certificates_certificateNumber_key" ON "certificates"("certificateNumber");

-- CreateIndex
CREATE UNIQUE INDEX "certificates_verificationToken_key" ON "certificates"("verificationToken");

-- CreateIndex
CREATE INDEX "certificates_userId_verificationToken_idx" ON "certificates"("userId", "verificationToken");

-- CreateIndex
CREATE UNIQUE INDEX "certificates_userId_courseId_key" ON "certificates"("userId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "bard_skills_name_category_key" ON "bard_skills"("name", "category");

-- CreateIndex
CREATE UNIQUE INDEX "question_bard_skills_questionId_bardSkillId_key" ON "question_bard_skills"("questionId", "bardSkillId");

-- CreateIndex
CREATE UNIQUE INDEX "careers_title_key" ON "careers"("title");

-- CreateIndex
CREATE UNIQUE INDEX "career_skills_name_key" ON "career_skills"("name");

-- CreateIndex
CREATE UNIQUE INDEX "assessment_questions_questionId_key" ON "assessment_questions"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_stripeCustomerId_key" ON "users"("stripeCustomerId");

-- CreateIndex
CREATE INDEX "document_chunks_documentId_idx" ON "document_chunks"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "chat_sessions_sessionId_key" ON "chat_sessions"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "learning_path_enrollments_userId_pathId_key" ON "learning_path_enrollments"("userId", "pathId");

-- CreateIndex
CREATE UNIQUE INDEX "step_completions_userId_stepId_key" ON "step_completions"("userId", "stepId");

-- CreateIndex
CREATE UNIQUE INDEX "path_reviews_userId_pathId_key" ON "path_reviews"("userId", "pathId");

-- CreateIndex
CREATE UNIQUE INDEX "skill_prerequisites_skillId_prerequisiteId_key" ON "skill_prerequisites"("skillId", "prerequisiteId");

-- CreateIndex
CREATE UNIQUE INDEX "learning_streaks_userId_key" ON "learning_streaks"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "interactive_results_userId_lessonId_key" ON "interactive_results"("userId", "lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "scorm_packages_lessonId_key" ON "scorm_packages"("lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "scorm_progress_userId_packageId_key" ON "scorm_progress"("userId", "packageId");

-- CreateIndex
CREATE INDEX "rag_chunks_documentId_idx" ON "rag_chunks"("documentId");

-- CreateIndex
CREATE INDEX "knowledge_chunks_documentName_idx" ON "knowledge_chunks"("documentName");

-- CreateIndex
CREATE UNIQUE INDEX "study_group_members_groupId_userId_key" ON "study_group_members"("groupId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "session_attendances_sessionId_userId_key" ON "session_attendances"("sessionId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_userId_key" ON "user_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_badges_userId_badgeId_key" ON "user_badges"("userId", "badgeId");

-- CreateIndex
CREATE UNIQUE INDEX "user_achievements_userId_badgeId_key" ON "user_achievements"("userId", "badgeId");

-- CreateIndex
CREATE UNIQUE INDEX "leaderboard_entries_userId_category_period_key" ON "leaderboard_entries"("userId", "category", "period");

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_key_key" ON "api_keys"("key");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_domain_key" ON "organizations"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "achievements_name_key" ON "achievements"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_achievements_new_userId_achievementId_key" ON "user_achievements_new"("userId", "achievementId");

-- CreateIndex
CREATE UNIQUE INDEX "mission_completions_userId_missionId_date_key" ON "mission_completions"("userId", "missionId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "blocked_ips_ipAddress_key" ON "blocked_ips"("ipAddress");

-- CreateIndex
CREATE INDEX "analytics_userId_idx" ON "analytics"("userId");

-- CreateIndex
CREATE INDEX "analytics_event_idx" ON "analytics"("event");

-- CreateIndex
CREATE INDEX "analytics_timestamp_idx" ON "analytics"("timestamp");

-- CreateIndex
CREATE INDEX "media_assets_createdBy_idx" ON "media_assets"("createdBy");

-- CreateIndex
CREATE UNIQUE INDEX "course_certificate_definitions_courseId_key" ON "course_certificate_definitions"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "course_certificates_verificationCode_key" ON "course_certificates"("verificationCode");

-- CreateIndex
CREATE INDEX "course_certificates_verificationCode_idx" ON "course_certificates"("verificationCode");

-- CreateIndex
CREATE INDEX "course_certificates_userId_status_idx" ON "course_certificates"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "course_certificates_userId_courseId_key" ON "course_certificates"("userId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "course_badge_definitions_courseId_key" ON "course_badge_definitions"("courseId");

-- CreateIndex
CREATE INDEX "course_badges_userId_status_idx" ON "course_badges"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "course_badges_userId_courseId_key" ON "course_badges"("userId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "career_path_courses_careerPathId_courseId_key" ON "career_path_courses"("careerPathId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "career_certificate_definitions_careerPathId_key" ON "career_certificate_definitions"("careerPathId");

-- CreateIndex
CREATE UNIQUE INDEX "career_certificates_verificationCode_key" ON "career_certificates"("verificationCode");

-- CreateIndex
CREATE INDEX "career_certificates_verificationCode_idx" ON "career_certificates"("verificationCode");

-- CreateIndex
CREATE INDEX "career_certificates_userId_status_idx" ON "career_certificates"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "career_certificates_userId_careerPathId_key" ON "career_certificates"("userId", "careerPathId");

-- CreateIndex
CREATE UNIQUE INDEX "career_badge_definitions_careerPathId_key" ON "career_badge_definitions"("careerPathId");

-- CreateIndex
CREATE INDEX "career_badges_userId_status_idx" ON "career_badges"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "career_badges_userId_careerPathId_key" ON "career_badges"("userId", "careerPathId");

-- CreateIndex
CREATE UNIQUE INDEX "verification_records_verificationCode_key" ON "verification_records"("verificationCode");

-- CreateIndex
CREATE INDEX "verification_records_verificationCode_idx" ON "verification_records"("verificationCode");

-- CreateIndex
CREATE INDEX "learning_nodes_courseId_nodeType_idx" ON "learning_nodes"("courseId", "nodeType");

-- CreateIndex
CREATE INDEX "learning_nodes_courseId_order_idx" ON "learning_nodes"("courseId", "order");

-- CreateIndex
CREATE INDEX "node_dependencies_toNodeId_idx" ON "node_dependencies"("toNodeId");

-- CreateIndex
CREATE UNIQUE INDEX "node_dependencies_fromNodeId_toNodeId_key" ON "node_dependencies"("fromNodeId", "toNodeId");

-- CreateIndex
CREATE INDEX "node_progress_userId_courseId_idx" ON "node_progress"("userId", "courseId");

-- CreateIndex
CREATE INDEX "node_progress_nodeId_status_idx" ON "node_progress"("nodeId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "node_progress_userId_nodeId_key" ON "node_progress"("userId", "nodeId");

-- CreateIndex
CREATE INDEX "video_segments_userId_lessonId_idx" ON "video_segments"("userId", "lessonId");

-- CreateIndex
CREATE INDEX "scorm_runtime_data_lessonId_completionStatus_idx" ON "scorm_runtime_data"("lessonId", "completionStatus");

-- CreateIndex
CREATE UNIQUE INDEX "scorm_runtime_data_userId_lessonId_key" ON "scorm_runtime_data"("userId", "lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "quiz_attempt_records_idempotencyKey_key" ON "quiz_attempt_records"("idempotencyKey");

-- CreateIndex
CREATE INDEX "quiz_attempt_records_userId_quizId_idx" ON "quiz_attempt_records"("userId", "quizId");

-- CreateIndex
CREATE INDEX "quiz_attempt_records_quizId_passed_idx" ON "quiz_attempt_records"("quizId", "passed");

-- CreateIndex
CREATE INDEX "quiz_attempt_records_userId_quizId_submittedAt_idx" ON "quiz_attempt_records"("userId", "quizId", "submittedAt");

-- CreateIndex
CREATE INDEX "quiz_attempt_records_score_idx" ON "quiz_attempt_records"("score");

-- CreateIndex
CREATE INDEX "unlock_logs_userId_courseId_idx" ON "unlock_logs"("userId", "courseId");

-- CreateIndex
CREATE INDEX "unlock_logs_nodeId_action_idx" ON "unlock_logs"("nodeId", "action");

-- CreateIndex
CREATE UNIQUE INDEX "certificate_files_verificationId_key" ON "certificate_files"("verificationId");

-- CreateIndex
CREATE INDEX "certificate_files_userId_status_idx" ON "certificate_files"("userId", "status");

-- CreateIndex
CREATE INDEX "certificate_files_verificationId_idx" ON "certificate_files"("verificationId");

-- CreateIndex
CREATE INDEX "course_progress_summary_userId_idx" ON "course_progress_summary"("userId");

-- CreateIndex
CREATE INDEX "course_progress_summary_courseId_progressPercent_idx" ON "course_progress_summary"("courseId", "progressPercent");

-- CreateIndex
CREATE UNIQUE INDEX "course_progress_summary_userId_courseId_key" ON "course_progress_summary"("userId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "user_skill_badges_verificationCode_key" ON "user_skill_badges"("verificationCode");

-- CreateIndex
CREATE INDEX "user_skill_badges_userId_idx" ON "user_skill_badges"("userId");

-- CreateIndex
CREATE INDEX "user_skill_badges_status_idx" ON "user_skill_badges"("status");

-- CreateIndex
CREATE UNIQUE INDEX "user_skill_badges_userId_badgeId_evidenceId_key" ON "user_skill_badges"("userId", "badgeId", "evidenceId");

-- CreateIndex
CREATE UNIQUE INDEX "skill_certifications_certificationName_key" ON "skill_certifications"("certificationName");

-- CreateIndex
CREATE UNIQUE INDEX "certification_badges_certificationId_badgeId_key" ON "certification_badges"("certificationId", "badgeId");

-- CreateIndex
CREATE UNIQUE INDEX "user_certifications_certificationNumber_key" ON "user_certifications"("certificationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "user_certifications_verificationCode_key" ON "user_certifications"("verificationCode");

-- CreateIndex
CREATE INDEX "user_certifications_userId_idx" ON "user_certifications"("userId");

-- CreateIndex
CREATE INDEX "user_certifications_status_idx" ON "user_certifications"("status");

-- CreateIndex
CREATE INDEX "certification_events_processed_idx" ON "certification_events"("processed");

-- CreateIndex
CREATE INDEX "certification_events_eventType_idx" ON "certification_events"("eventType");

-- CreateIndex
CREATE INDEX "notifications_userId_isRead_idx" ON "notifications"("userId", "isRead");

-- CreateIndex
CREATE INDEX "notifications_createdAt_idx" ON "notifications"("createdAt");

-- AddForeignKey
ALTER TABLE "modules" ADD CONSTRAINT "modules_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_nextLessonId_fkey" FOREIGN KEY ("nextLessonId") REFERENCES "lessons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "watch_history" ADD CONSTRAINT "watch_history_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "watch_history" ADD CONSTRAINT "watch_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_prerequisiteQuizId_fkey" FOREIGN KEY ("prerequisiteQuizId") REFERENCES "quizzes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answer_options" ADD CONSTRAINT "answer_options_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_submissions" ADD CONSTRAINT "student_submissions_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_submissions" ADD CONSTRAINT "student_submissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skill_assessments" ADD CONSTRAINT "skill_assessments_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skill_assessments" ADD CONSTRAINT "skill_assessments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_bard_skills" ADD CONSTRAINT "question_bard_skills_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_bard_skills" ADD CONSTRAINT "question_bard_skills_bardSkillId_fkey" FOREIGN KEY ("bardSkillId") REFERENCES "bard_skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classrooms" ADD CONSTRAINT "classrooms_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_questions" ADD CONSTRAINT "assessment_questions_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "career_skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_questions" ADD CONSTRAINT "assessment_questions_careerId_fkey" FOREIGN KEY ("careerId") REFERENCES "careers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_results" ADD CONSTRAINT "assessment_results_careerId_fkey" FOREIGN KEY ("careerId") REFERENCES "careers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_results" ADD CONSTRAINT "assessment_results_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_knowledge_base" ADD CONSTRAINT "chat_knowledge_base_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_chunks" ADD CONSTRAINT "document_chunks_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_sessions" ADD CONSTRAINT "chat_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "chat_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_paths" ADD CONSTRAINT "learning_paths_careerId_fkey" FOREIGN KEY ("careerId") REFERENCES "careers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_paths" ADD CONSTRAINT "learning_paths_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_path_steps" ADD CONSTRAINT "learning_path_steps_pathId_fkey" FOREIGN KEY ("pathId") REFERENCES "learning_paths"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_path_enrollments" ADD CONSTRAINT "learning_path_enrollments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_path_enrollments" ADD CONSTRAINT "learning_path_enrollments_pathId_fkey" FOREIGN KEY ("pathId") REFERENCES "learning_paths"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "step_completions" ADD CONSTRAINT "step_completions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "step_completions" ADD CONSTRAINT "step_completions_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "learning_path_steps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "path_reviews" ADD CONSTRAINT "path_reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "path_reviews" ADD CONSTRAINT "path_reviews_pathId_fkey" FOREIGN KEY ("pathId") REFERENCES "learning_paths"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skill_prerequisites" ADD CONSTRAINT "skill_prerequisites_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skill_prerequisites" ADD CONSTRAINT "skill_prerequisites_prerequisiteId_fkey" FOREIGN KEY ("prerequisiteId") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_goals" ADD CONSTRAINT "learning_goals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_streaks" ADD CONSTRAINT "learning_streaks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interactive_results" ADD CONSTRAINT "interactive_results_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interactive_results" ADD CONSTRAINT "interactive_results_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scorm_packages" ADD CONSTRAINT "scorm_packages_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scorm_progress" ADD CONSTRAINT "scorm_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scorm_progress" ADD CONSTRAINT "scorm_progress_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "scorm_packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rag_chunks" ADD CONSTRAINT "rag_chunks_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "rag_documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_groups" ADD CONSTRAINT "study_groups_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_groups" ADD CONSTRAINT "study_groups_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_group_members" ADD CONSTRAINT "study_group_members_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "study_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_group_members" ADD CONSTRAINT "study_group_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_discussions" ADD CONSTRAINT "group_discussions_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "study_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_discussions" ADD CONSTRAINT "group_discussions_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discussion_replies" ADD CONSTRAINT "discussion_replies_discussionId_fkey" FOREIGN KEY ("discussionId") REFERENCES "group_discussions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discussion_replies" ADD CONSTRAINT "discussion_replies_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discussion_replies" ADD CONSTRAINT "discussion_replies_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "discussion_replies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_sessions" ADD CONSTRAINT "study_sessions_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "study_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_sessions" ADD CONSTRAINT "study_sessions_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_attendances" ADD CONSTRAINT "session_attendances_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "study_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_attendances" ADD CONSTRAINT "session_attendances_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "peer_reviews" ADD CONSTRAINT "peer_reviews_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "peer_reviews" ADD CONSTRAINT "peer_reviews_revieweeId_fkey" FOREIGN KEY ("revieweeId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "peer_reviews" ADD CONSTRAINT "peer_reviews_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "peer_reviews" ADD CONSTRAINT "peer_reviews_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user_profiles"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "badges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user_profiles"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "badges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leaderboard_entries" ADD CONSTRAINT "leaderboard_entries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user_profiles"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voice_assignments" ADD CONSTRAINT "voice_assignments_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voice_submissions" ADD CONSTRAINT "voice_submissions_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "voice_assignments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voice_submissions" ADD CONSTRAINT "voice_submissions_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webhooks" ADD CONSTRAINT "webhooks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_rewards" ADD CONSTRAINT "user_rewards_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_achievements_new" ADD CONSTRAINT "user_achievements_new_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_achievements_new" ADD CONSTRAINT "user_achievements_new_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "achievements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_xp_log" ADD CONSTRAINT "user_xp_log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_completions" ADD CONSTRAINT "mission_completions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_completions" ADD CONSTRAINT "mission_completions_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "daily_missions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credit_purchases" ADD CONSTRAINT "credit_purchases_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credit_purchases" ADD CONSTRAINT "credit_purchases_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "credit_store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_certificate_definitions" ADD CONSTRAINT "course_certificate_definitions_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_certificate_criteria" ADD CONSTRAINT "course_certificate_criteria_definitionId_fkey" FOREIGN KEY ("definitionId") REFERENCES "course_certificate_definitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_certificates" ADD CONSTRAINT "course_certificates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_certificates" ADD CONSTRAINT "course_certificates_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_certificates" ADD CONSTRAINT "course_certificates_definitionId_fkey" FOREIGN KEY ("definitionId") REFERENCES "course_certificate_definitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_badge_definitions" ADD CONSTRAINT "course_badge_definitions_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_badge_definitions" ADD CONSTRAINT "course_badge_definitions_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_badges" ADD CONSTRAINT "course_badges_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_badges" ADD CONSTRAINT "course_badges_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_badges" ADD CONSTRAINT "course_badges_definitionId_fkey" FOREIGN KEY ("definitionId") REFERENCES "course_badge_definitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_badges" ADD CONSTRAINT "course_badges_certificateId_fkey" FOREIGN KEY ("certificateId") REFERENCES "course_certificates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "career_path_courses" ADD CONSTRAINT "career_path_courses_careerPathId_fkey" FOREIGN KEY ("careerPathId") REFERENCES "career_paths"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "career_path_courses" ADD CONSTRAINT "career_path_courses_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "career_requirements" ADD CONSTRAINT "career_requirements_careerPathId_fkey" FOREIGN KEY ("careerPathId") REFERENCES "career_paths"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "career_certificate_definitions" ADD CONSTRAINT "career_certificate_definitions_careerPathId_fkey" FOREIGN KEY ("careerPathId") REFERENCES "career_paths"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "career_certificates" ADD CONSTRAINT "career_certificates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "career_certificates" ADD CONSTRAINT "career_certificates_careerPathId_fkey" FOREIGN KEY ("careerPathId") REFERENCES "career_paths"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "career_certificates" ADD CONSTRAINT "career_certificates_definitionId_fkey" FOREIGN KEY ("definitionId") REFERENCES "career_certificate_definitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "career_badge_definitions" ADD CONSTRAINT "career_badge_definitions_careerPathId_fkey" FOREIGN KEY ("careerPathId") REFERENCES "career_paths"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "career_badge_definitions" ADD CONSTRAINT "career_badge_definitions_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "career_badges" ADD CONSTRAINT "career_badges_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "career_badges" ADD CONSTRAINT "career_badges_careerPathId_fkey" FOREIGN KEY ("careerPathId") REFERENCES "career_paths"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "career_badges" ADD CONSTRAINT "career_badges_definitionId_fkey" FOREIGN KEY ("definitionId") REFERENCES "career_badge_definitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "career_badges" ADD CONSTRAINT "career_badges_certificateId_fkey" FOREIGN KEY ("certificateId") REFERENCES "career_certificates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_nodes" ADD CONSTRAINT "learning_nodes_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "node_dependencies" ADD CONSTRAINT "node_dependencies_fromNodeId_fkey" FOREIGN KEY ("fromNodeId") REFERENCES "learning_nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "node_dependencies" ADD CONSTRAINT "node_dependencies_toNodeId_fkey" FOREIGN KEY ("toNodeId") REFERENCES "learning_nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "node_progress" ADD CONSTRAINT "node_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "node_progress" ADD CONSTRAINT "node_progress_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "learning_nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_segments" ADD CONSTRAINT "video_segments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_segments" ADD CONSTRAINT "video_segments_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scorm_runtime_data" ADD CONSTRAINT "scorm_runtime_data_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scorm_runtime_data" ADD CONSTRAINT "scorm_runtime_data_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_attempt_records" ADD CONSTRAINT "quiz_attempt_records_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_attempt_records" ADD CONSTRAINT "quiz_attempt_records_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_attempt_records" ADD CONSTRAINT "quiz_attempt_records_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "learning_nodes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unlock_logs" ADD CONSTRAINT "unlock_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unlock_logs" ADD CONSTRAINT "unlock_logs_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "learning_nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificate_files" ADD CONSTRAINT "certificate_files_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificate_files" ADD CONSTRAINT "certificate_files_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_progress_summary" ADD CONSTRAINT "course_progress_summary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_progress_summary" ADD CONSTRAINT "course_progress_summary_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_skill_badges" ADD CONSTRAINT "user_skill_badges_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_skill_badges" ADD CONSTRAINT "user_skill_badges_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "skill_badges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certification_badges" ADD CONSTRAINT "certification_badges_certificationId_fkey" FOREIGN KEY ("certificationId") REFERENCES "skill_certifications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certification_badges" ADD CONSTRAINT "certification_badges_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "skill_badges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_certifications" ADD CONSTRAINT "user_certifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_certifications" ADD CONSTRAINT "user_certifications_certificationId_fkey" FOREIGN KEY ("certificationId") REFERENCES "skill_certifications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

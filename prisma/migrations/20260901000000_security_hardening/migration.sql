-- Additive only. Review and apply to a TEST database before starting the updated app.
CREATE TABLE "quiz_sessions" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "quizId" TEXT NOT NULL,
  "lessonId" TEXT NOT NULL,
  "questions" JSONB NOT NULL,
  "passScore" INTEGER NOT NULL,
  "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "submittedAt" TIMESTAMP(3),
  "result" JSONB,
  CONSTRAINT "quiz_sessions_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "quiz_sessions_userId_quizId_lessonId_submittedAt_idx" ON "quiz_sessions"("userId", "quizId", "lessonId", "submittedAt");
CREATE INDEX "quiz_sessions_expiresAt_idx" ON "quiz_sessions"("expiresAt");

CREATE TABLE "payment_webhook_events" (
  "id" TEXT NOT NULL,
  "paymentId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "payment_webhook_events_pkey" PRIMARY KEY ("id")
);

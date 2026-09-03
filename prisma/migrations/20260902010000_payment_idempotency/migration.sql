-- Additive-only payment safety: one logical checkout request creates one payment.
ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "idempotencyKey" TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS "payments_idempotencyKey_key" ON "payments"("idempotencyKey");

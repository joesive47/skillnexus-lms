-- Persist the certificate switch used by the course create/edit form.
ALTER TABLE "courses"
ADD COLUMN IF NOT EXISTS "hasCertificate" BOOLEAN NOT NULL DEFAULT false;

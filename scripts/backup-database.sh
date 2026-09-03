#!/usr/bin/env bash
set -Eeuo pipefail

: "${DATABASE_URL:?DATABASE_URL is required}"
: "${AWS_S3_BACKUP_BUCKET:?AWS_S3_BACKUP_BUCKET is required}"

timestamp="$(date -u +%Y%m%d_%H%M%S)"
backup_dir="${BACKUP_DIR:-${RUNNER_TEMP:-/tmp}/skillnexus-backups}"
backup_file="$backup_dir/backup_${timestamp}.dump"
s3_key="postgres/backup_${timestamp}.dump"

mkdir -p "$backup_dir"
command -v pg_dump >/dev/null || { echo 'pg_dump is required' >&2; exit 1; }
command -v pg_restore >/dev/null || { echo 'pg_restore is required' >&2; exit 1; }
command -v aws >/dev/null || { echo 'AWS CLI is required' >&2; exit 1; }

echo "Creating encrypted-transport PostgreSQL backup at ${timestamp} UTC"
pg_dump "$DATABASE_URL" --format=custom --compress=9 --file="$backup_file"

test -s "$backup_file" || { echo 'Backup archive is empty' >&2; exit 1; }
pg_restore --list "$backup_file" >/dev/null
sha256sum "$backup_file" >"${backup_file}.sha256"

aws s3 cp "$backup_file" "s3://${AWS_S3_BACKUP_BUCKET}/${s3_key}" \
  --storage-class STANDARD_IA \
  --only-show-errors
aws s3 cp "${backup_file}.sha256" "s3://${AWS_S3_BACKUP_BUCKET}/${s3_key}.sha256" \
  --storage-class STANDARD_IA \
  --only-show-errors
aws s3api head-object --bucket "$AWS_S3_BACKUP_BUCKET" --key "$s3_key" >/dev/null

echo "Backup verified locally and in S3: ${s3_key}"
echo 'Retention must be enforced by an S3 lifecycle policy with versioning/object lock configured on the bucket.'

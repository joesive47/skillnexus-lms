# Operations runbook

## Health and incident response

- Probe `GET /api/health`; alert on non-2xx or sustained latency. The public response intentionally excludes user counts and database error details.
- Correlate application logs/Sentry with provider event IDs and payment IDs. Never log secrets, card data, passwords or certificate signing keys.
- Pause paid enrollment if webhook verification or ledger reconciliation fails; do not manually mark payments complete through the API.

## Backup and restore

- Target RPO: 24 hours for the pilot. Target RTO: 4 hours. Tighten after measured drills.
- Store encrypted backups outside the application host and retain immutable copies according to policy.
- Record file size, SHA-256, database name, timestamp, tool version and operator.
- Verify before restore: `npm run backup:verify -- -BackupFile <path> -ExpectedSha256 <hash>`.
- Restore first into a newly created isolated database whose name ends in `_restore`, `drill`, `test` or `_runall`.
- Run Prisma validation, row-count reconciliation, login smoke tests and certificate/payment checks before any approved production recovery.
- The Windows restore script requires the exact target database name and blocks ordinary database names unless an incident operator explicitly supplies `-AllowProductionRestore`.

## Scale guardrail

The current middleware rate limiter is per process. Before running more than one application instance, replace it with a shared Redis-backed limiter and verify trusted proxy/IP settings.

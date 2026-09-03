'use strict'

const { spawnSync } = require('node:child_process')
const { readFileSync } = require('node:fs')
const { join } = require('node:path')

const root = join(__dirname, '..')
const npmCli = process.env.npm_execpath
if (!npmCli) {
  console.error('Run this audit through npm run security:audit')
  process.exit(1)
}
const result = spawnSync(process.execPath, [npmCli, 'audit', '--json'], { cwd: root, encoding: 'utf8' })

if (!result.stdout) {
  console.error(result.stderr || 'npm audit did not return JSON')
  process.exit(1)
}

let report
try { report = JSON.parse(result.stdout) } catch {
  console.error('Unable to parse npm audit output')
  process.exit(1)
}

const nextVersion = JSON.parse(readFileSync(join(root, 'node_modules', 'next', 'package.json'), 'utf8')).version
const exceptionExpires = new Date('2026-10-01T00:00:00Z')
const exceptionActive = Date.now() < exceptionExpires.getTime() && nextVersion === '15.5.25'
const acceptedPackages = new Set(exceptionActive ? ['next', 'postcss'] : [])
const blockers = Object.entries(report.vulnerabilities || {}).filter(([name, vulnerability]) =>
  ['high', 'critical'].includes(vulnerability.severity) && !acceptedPackages.has(name)
)

console.log(`Dependency audit: ${report.metadata?.vulnerabilities?.total || 0} total; ${report.metadata?.vulnerabilities?.high || 0} high; ${report.metadata?.vulnerabilities?.critical || 0} critical.`)
if (exceptionActive) {
  console.warn(`Temporary exception: Next.js ${nextVersion} bundled PostCSS advisory; expires 2026-10-01. Next 16 migration is tracked separately.`)
}

if (blockers.length) {
  for (const [name, vulnerability] of blockers) console.error(`BLOCKED: ${name} (${vulnerability.severity})`)
  process.exit(1)
}

if (!exceptionActive && ['next', 'postcss'].some((name) => report.vulnerabilities?.[name]?.severity === 'high')) {
  console.error('The temporary Next.js/PostCSS exception expired or the pinned Next.js version changed.')
  process.exit(1)
}

console.log('No unapproved high or critical dependency vulnerabilities found.')

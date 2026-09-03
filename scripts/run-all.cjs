'use strict'

// Local development launcher. Only its own isolated Docker database is initialized.
const fs = require('node:fs')
const path = require('node:path')
const net = require('node:net')
const crypto = require('node:crypto')
const { spawn } = require('node:child_process')
const { developmentSettings, prepareLocalDatabase } = require('./run-all-database.cjs')

const root = path.resolve(__dirname, '..')
const host = '127.0.0.1'
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

function options(args) {
  const result = { port: 3000, test: false, browser: true, check: false, help: false }
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--port': {
        const value = args[++i]
        if (!/^\d+$/.test(value || '') || Number(value) < 1024 || Number(value) > 65535) {
          throw new Error('--port must be an integer between 1024 and 65535.')
        }
        result.port = Number(value)
        break
      }
      case '--test': result.test = true; break
      case '--no-browser': result.browser = false; break
      case '--check': result.check = true; break
      case '--help': result.help = true; break
      default: throw new Error(`Unknown option: ${args[i]}. Use --help.`)
    }
  }
  return result
}

function assertPortAvailable(port) {
  return new Promise((resolve, reject) => {
    const probe = net.createServer()
    probe.once('error', () => reject(new Error(
      `Port ${port} is unavailable. Close its server or use RunAll.bat --port ${port === 65535 ? 3000 : port + 1}. No existing process was stopped.`
    )))
    probe.listen(port, host, () => probe.close(resolve))
  })
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: root, env: process.env, stdio: 'inherit', windowsHide: true })
    child.once('error', () => reject(new Error(`Could not start ${path.basename(command)}. Check that Node.js and npm are on PATH.`)))
    child.once('exit', code => code === 0 ? resolve() : reject(new Error(`Command failed (exit ${code}): ${path.basename(command)} ${args.join(' ')}`)))
  })
}

// Only internal, constant npm commands are passed to cmd.exe. User arguments
// (including the port) are never interpolated into a shell command.
function npm(command) {
  if (process.platform === 'win32') {
    return run(process.env.ComSpec || 'cmd.exe', ['/d', '/s', '/c', `npm ${command}`])
  }
  return run('npm', command.split(' '))
}

function dependencyStatus() {
  return ['next/dist/bin/next', '@next/env', '@prisma/client', 'prisma/build/index.js', 'jest/package.json'].every(name => {
    try { require.resolve(name, { paths: [root] }); return true } catch { return false }
  })
}

function normalizePrismaSchema(source) {
  // Prisma may align columns in the generated schema even when the source is
  // semantically identical. Compare normalized lines so formatting alone does
  // not trigger a Windows DLL replacement while another dev server is running.
  const normalizeLine = line => {
    let normalized = ''
    let inString = false
    let escaped = false
    let pendingSpace = false
    for (const character of line.trim()) {
      if (inString) {
        normalized += character
        if (escaped) escaped = false
        else if (character === '\\') escaped = true
        else if (character === '"') inString = false
      } else if (character === '"') {
        if (pendingSpace && normalized) normalized += ' '
        pendingSpace = false
        inString = true
        normalized += character
      } else if (/\s/.test(character)) {
        pendingSpace = true
      } else {
        if (pendingSpace && normalized) normalized += ' '
        pendingSpace = false
        normalized += character
      }
    }
    return normalized
  }
  return source
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map(normalizeLine)
    .filter(Boolean)
    .join('\n')
}

function prismaClientCurrent() {
  try {
    const source = fs.readFileSync(path.join(root, 'prisma', 'schema.prisma'), 'utf8')
    const generated = fs.readFileSync(path.join(root, 'node_modules', '.prisma', 'client', 'schema.prisma'), 'utf8')
    return normalizePrismaSchema(source) === normalizePrismaSchema(generated)
  } catch { return false }
}

function checkConfigurationFiles(checkOnly) {
  const candidates = ['.env.development.local', '.env.local', '.env.development', '.env']
  if (process.env.DATABASE_URL || candidates.some(file => fs.existsSync(path.join(root, file)))) return
  if (!checkOnly) {
    const secret = crypto.randomBytes(32).toString('hex')
    fs.writeFileSync(path.join(root, '.env.local'), [
      '# Local test settings only. Never use a production database here.',
      '# Example: postgresql://postgres:YOUR_PASSWORD@127.0.0.1:5432/skillnexus_test',
      '# Empty DATABASE_URL uses a separate RunAll PostgreSQL container in Docker Desktop.',
      'DATABASE_URL=""',
      `AUTH_SECRET="${secret}"`,
      `NEXTAUTH_SECRET="${secret}"`,
      ''
    ].join('\r\n'), { flag: 'wx' })
  }
  if (checkOnly) throw new Error('No development environment configuration. Run RunAll.bat to create local settings and prepare an isolated test database.')
  console.log('[CONFIG] Created .env.local with a random auth secret. Production settings were not copied.')
}

async function checkDatabase() {
  const { PrismaClient } = require(path.join(root, 'node_modules', '@prisma', 'client'))
  const db = new PrismaClient({ log: [] })
  try {
    // The health API alone only checks SELECT 1 and can hide missing tables.
    await db.$queryRawUnsafe('SELECT 1')
    await Promise.all([db.user.count(), db.course.count(), db.lesson.count(), db.quizSession.count(), db.paymentWebhookEvent.count()])
  } catch (error) {
    const code = /^P\d{4}$/.test(error.code || '') ? ` (${error.code})` : ''
    throw new Error(`Database/schema check failed${code}. Check DATABASE_URL, PostgreSQL availability and migrations in your TEST database. Nothing was migrated, seeded or reset.`)
  } finally {
    await db.$disconnect()
  }
}

async function request(url) {
  const controller = new AbortController()
  // First compilation on Windows can take longer than a normal HTTP request.
  const timer = setTimeout(() => controller.abort(), 30000)
  try {
    const response = await fetch(url, { signal: controller.signal, redirect: 'manual' })
    // Consume the body while the timeout is still active.
    return { status: response.status, body: await response.text() }
  } finally { clearTimeout(timer) }
}

async function ready(baseUrl) {
  try {
    const response = await request(`${baseUrl}/api/health`)
    if (response.status !== 200) return false
    const health = JSON.parse(response.body)
    if (health.app?.name !== 'upPowerSkill LMS' ||
        !['healthy', 'degraded'].includes(health.database?.status) ||
        !['ok', 'warning'].includes(health.status)) return false
    const home = await request(baseUrl)
    return home.status === 200 && /<html[\s>]/i.test(home.body) && home.body.includes('data-runall-home')
  } catch { return false }
}

async function stopServer(child) {
  if (!child.pid || child.exitCode !== null || child.signalCode !== null) return
  if (process.platform === 'win32') {
    // Kill only the process tree created by this launcher, never by port/name.
    await new Promise(resolve => {
      const killer = spawn('taskkill.exe', ['/pid', String(child.pid), '/t', '/f'], { windowsHide: true, stdio: 'ignore' })
      killer.once('error', resolve)
      killer.once('exit', resolve)
    })
  } else { child.kill('SIGTERM') }
}

async function serve(config) {
  await assertPortAvailable(config.port)
  const baseUrl = `http://${host}:${config.port}`
  const next = require.resolve('next/dist/bin/next', { paths: [root] })
  console.log(`\n[START] ${baseUrl} (local access only). Keep this window open; Ctrl+C stops the server.`)
  const childEnv = { ...process.env, NEXT_DIST_DIR: '.next-runall' }
  const child = spawn(process.execPath, [next, 'dev', '--hostname', host, '--port', String(config.port)], {
    cwd: root, env: childEnv, stdio: 'inherit', windowsHide: true
  })
  let stopped = false
  let startError = false
  child.once('error', () => { startError = true })
  const exited = new Promise(resolve => child.once('close', resolve))
  const interrupt = () => { stopped = true; void stopServer(child) }
  process.on('SIGINT', interrupt)
  process.on('SIGTERM', interrupt)
  try {
    const startupTimeoutMs = 10 * 60 * 1000
    const deadline = Date.now() + startupTimeoutMs
    let nextStatusAt = Date.now() + 30000
    let healthy = false
    while (!stopped && Date.now() < deadline) {
      if (startError || child.exitCode !== null || child.signalCode !== null) {
        throw new Error('Development server exited before it was ready. See the server output above.')
      }
      if (await ready(baseUrl)) { healthy = true; break }
      if (Date.now() >= nextStatusAt) {
        const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000))
        console.log(`[WAIT] Server is compiling or warming up; ${remaining}s remain before timeout.`)
        nextStatusAt = Date.now() + 30000
      }
      await delay(1500)
    }
    if (stopped) return
    if (!healthy) throw new Error('Startup timed out after 10 minutes. Health and home-page checks did not both pass. See the server output above.')
    if (child.exitCode !== null || child.signalCode !== null) throw new Error('Server stopped during startup.')
    console.log(`\n[READY] Database, health API and home page passed startup checks. UI: ${baseUrl}`)
    console.log('[NOTE] This is a development smoke check, not a full security or production certification.')
    if (config.browser) {
      try {
        if (process.platform === 'win32') {
          await run('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', `Start-Process -FilePath '${baseUrl}'`])
        } else { console.log(`[OPEN] Open ${baseUrl} in your browser.`) }
      } catch { console.log(`[WARNING] Browser did not open. Open ${baseUrl} manually.`) }
    }
    const code = await exited
    if (!stopped && code !== 0) throw new Error(`Development server stopped (exit ${code}).`)
  } finally {
    await stopServer(child)
    process.removeListener('SIGINT', interrupt)
    process.removeListener('SIGTERM', interrupt)
  }
}

async function main(args = process.argv.slice(2)) {
  const config = options(args)
  if (config.help) {
    console.log('RunAll.bat [--port 3000] [--test] [--no-browser] [--check]\nDefault: prepare an isolated Docker TEST database when DATABASE_URL is empty, install missing packages, generate Prisma, and start the UI.\nConfigured databases are never initialized or migrated automatically. No seed, reset or deployment.\n--test: also run Jest first; failures stop startup.\n--check: check prerequisites/database only; no install, Docker startup, generate, server or browser.')
    return
  }
  const [major] = process.versions.node.split('.').map(Number)
  if (major < 22) throw new Error('Node.js 22 or newer is required. Node.js 22 matches the project CI runtime.')
  if (major !== 22) console.log('[WARNING] Use Node.js 22 to match CI. This runtime has not been verified with this project.')
  process.chdir(root)
  process.env.NODE_ENV = 'development'
  console.log('[RUNALL] SkillNexus local development / smoke checks')
  console.log('[WARNING] Use a TEST database. Using the UI can change data. Known security issues remain; do not expose this server publicly.')
  checkConfigurationFiles(config.check)
  const settings = developmentSettings(root)
  const managedDatabase = !(settings.DATABASE_URL || '').trim()
  if (!managedDatabase && !/^postgres(?:ql)?:\/\//.test(settings.DATABASE_URL)) {
    throw new Error('DATABASE_URL must be a PostgreSQL TEST database URL. Fix .env.local before installing packages, or leave it empty to use an isolated Docker database.')
  }
  if (managedDatabase) {
    if (config.check) throw new Error('DATABASE_URL is empty. Run RunAll.bat with Docker Desktop running to prepare its isolated local TEST database, or configure a prepared TEST database in .env.local.')
    process.env.DATABASE_URL = await prepareLocalDatabase(root)
  }
  if (!dependencyStatus()) {
    if (config.check) throw new Error('Dependencies are missing. Configure .env.local, then run RunAll.bat to install them.')
    console.log('[INSTALL] Installing packages from package-lock.json. First run requires Internet access.')
    await npm('ci')
  }
  const { loadEnvConfig } = require(require.resolve('@next/env', { paths: [root] }))
  loadEnvConfig(root, true)
  if (!/^postgres(?:ql)?:\/\//.test(process.env.DATABASE_URL || '')) {
    throw new Error('Set DATABASE_URL in .env.local to a prepared PostgreSQL TEST database. SQLite and empty URLs are not supported by this schema.')
  }
  if (!process.env.AUTH_SECRET && !process.env.NEXTAUTH_SECRET) throw new Error('Set AUTH_SECRET or NEXTAUTH_SECRET in .env.local.')
  try {
    await assertPortAvailable(config.port)
  } catch (error) {
    if (args.includes('--port')) throw error
    let selected = null
    for (let candidate = config.port + 1; candidate <= config.port + 20; candidate++) {
      try { await assertPortAvailable(candidate); selected = candidate; break } catch { /* try the next local port */ }
    }
    if (!selected) throw error
    console.log(`[PORT] Port ${config.port} is busy. Using available port ${selected}; no existing process was stopped.`)
    config.port = selected
  }
  // Consistent local redirects even when the selected port changes.
  const baseUrl = `http://${host}:${config.port}`
  for (const key of ['AUTH_URL', 'NEXTAUTH_URL', 'NEXTAUTH_URL_INTERNAL', 'NEXT_PUBLIC_URL', 'NEXT_PUBLIC_BASE_URL']) process.env[key] = baseUrl
  if (!config.check) {
    if (prismaClientCurrent()) {
      console.log('[PRISMA] Generated client already matches the schema; generation skipped.')
    } else {
      console.log('[PRISMA] Generating Prisma 5.22.0 client (no database changes).')
      await npm('exec -- prisma generate')
    }
    if (managedDatabase) {
      console.log('[SCHEMA] Synchronizing tables in the isolated RunAll database only. Destructive changes are not accepted.')
      await npm('exec -- prisma db push --skip-generate')
      console.log('[DEMO] Preparing local-only administrator and learner accounts.')
      await run(process.execPath, [path.join(root, 'scripts', 'run-all-demo.cjs')])
      process.env.NEXT_PUBLIC_RUNALL_DEMO = 'true'
    }
  }
  console.log('[CHECK] Testing database connection and core LMS tables (read-only).')
  await checkDatabase()
  if (config.check) { console.log('[OK] Prerequisites, database and port checks passed. No server started.'); return }
  if (config.test) {
    console.log('[TEST] Running existing Jest suite. Any failure prevents startup.')
    await npm('test -- --runInBand --watch=false')
  }
  await serve(config)
}

module.exports = { options, assertPortAvailable, ready, main, normalizePrismaSchema, prismaClientCurrent }
if (require.main === module) {
  main().catch(error => { console.error(`\n[ERROR] ${error.message}`); process.exitCode = 1 })
}

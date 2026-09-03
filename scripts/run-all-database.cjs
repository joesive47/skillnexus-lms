'use strict'

const fs = require('node:fs')
const path = require('node:path')
const crypto = require('node:crypto')
const { spawn } = require('node:child_process')
const { parseEnv } = require('node:util')

// Read development settings without requiring node_modules. Never read production files.
function developmentSettings(root, inherited = process.env) {
  const values = { ...inherited }
  for (const name of ['.env.development.local', '.env.local', '.env.development', '.env']) {
    const file = path.join(root, name)
    if (!fs.existsSync(file)) continue
    for (const [key, value] of Object.entries(parseEnv(fs.readFileSync(file, 'utf8')))) {
      if (values[key] === undefined) values[key] = value
    }
  }
  return values
}

function docker(args, cwd, timeout = 60000) {
  return new Promise((resolve, reject) => {
    const child = spawn('docker', args, { cwd, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] })
    let output = ''
    let error = ''
    const timer = setTimeout(() => {
      child.kill()
      reject(new Error('Docker timed out. Open Docker Desktop, wait until its engine is running, and try again.'))
    }, timeout)
    child.stdout.on('data', data => { output += data })
    child.stderr.on('data', data => { error += data })
    child.once('error', () => {
      clearTimeout(timer)
      reject(new Error('Docker Desktop is required for automatic local database setup. Start Docker Desktop, or set DATABASE_URL in .env.local to your prepared TEST database.'))
    })
    child.once('close', code => {
      clearTimeout(timer)
      if (code === 0) resolve(output.trim())
      else reject(new Error(`Docker setup failed. Start Docker Desktop and retry. ${error.slice(-1500)}`))
    })
  })
}

async function prepareLocalDatabase(root) {
  console.log('[DATABASE] DATABASE_URL is empty. Preparing a separate local PostgreSQL database with Docker.')
  await docker(['info', '--format', '{{.ServerVersion}}'], root, 30000)
  const directory = path.join(root, '.runall')
  fs.mkdirSync(directory, { recursive: true })
  const envFile = path.join(directory, 'postgres.env')
  if (!fs.existsSync(envFile)) fs.writeFileSync(envFile,
    `POSTGRES_USER=runall\nPOSTGRES_PASSWORD=${crypto.randomBytes(32).toString('hex')}\nPOSTGRES_DB=skillnexus_runall\n`, { flag: 'wx', mode: 0o600 })
  const settings = parseEnv(fs.readFileSync(envFile, 'utf8'))
  if (settings.POSTGRES_USER !== 'runall' || settings.POSTGRES_DB !== 'skillnexus_runall' || !/^[a-f0-9]{64}$/.test(settings.POSTGRES_PASSWORD || '')) {
    throw new Error('Invalid .runall/postgres.env. Restore its original generated settings; do not point automatic setup at another database.')
  }
  const project = `skillnexus-runall-${crypto.createHash('sha256').update(root.toLowerCase()).digest('hex').slice(0, 12)}`
  const composeFile = path.join(directory, 'compose.json')
  fs.writeFileSync(composeFile, JSON.stringify({
    services: { database: {
      image: 'postgres:16-alpine', env_file: [envFile],
      ports: ['127.0.0.1::5432'], volumes: ['database:/var/lib/postgresql/data'],
      healthcheck: { test: ['CMD-SHELL', 'pg_isready -U runall -d skillnexus_runall'], interval: '2s', timeout: '3s', retries: 30 }
    } }, volumes: { database: {} }
  }, null, 2))
  const base = ['compose', '--project-name', project, '--file', composeFile]
  console.log('[DATABASE] Starting the RunAll container; the first run may download PostgreSQL. Existing containers are unchanged.')
  await docker([...base, 'up', '-d', '--wait', '--wait-timeout', '90'], root, 180000)
  const address = await docker([...base, 'port', 'database', '5432'], root)
  const port = /^127\.0\.0\.1:(\d+)$/.exec(address)?.[1]
  if (!port || Number(port) > 65535) throw new Error('The RunAll database did not publish a loopback-only port.')
  console.log(`[DATABASE] Isolated TEST database ready on 127.0.0.1:${port}. Data is kept in its own Docker volume.`)
  return `postgresql://runall:${settings.POSTGRES_PASSWORD}@127.0.0.1:${port}/skillnexus_runall?schema=public`
}

module.exports = { developmentSettings, prepareLocalDatabase }

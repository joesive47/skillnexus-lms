'use strict'

const { test } = require('node:test')
const assert = require('node:assert/strict')
const http = require('node:http')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { developmentSettings } = require('./run-all-database.cjs')
const { options, assertPortAvailable, ready } = require('./run-all.cjs')

test('database selection respects development precedence and never reads production credentials', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'runall-config-'))
  t.after(() => fs.rmSync(root, { recursive: true, force: true }))
  fs.writeFileSync(path.join(root, '.env.production'), 'DATABASE_URL=postgresql://production/database\n')
  assert.equal(developmentSettings(root, {}).DATABASE_URL, undefined)
  fs.writeFileSync(path.join(root, '.env'), 'DATABASE_URL=postgresql://fallback/database\n')
  fs.writeFileSync(path.join(root, '.env.local'), 'DATABASE_URL=""\nAUTH_SECRET=local-secret\n')
  assert.equal(developmentSettings(root, {}).DATABASE_URL, '')
  assert.equal(developmentSettings(root, {}).AUTH_SECRET, 'local-secret')
  fs.writeFileSync(path.join(root, '.env.development.local'), 'DATABASE_URL=postgresql://preferred/database\n')
  assert.equal(developmentSettings(root, {}).DATABASE_URL, 'postgresql://preferred/database')
  assert.equal(developmentSettings(root, {DATABASE_URL:'postgresql://inherited/database'}).DATABASE_URL, 'postgresql://inherited/database')
})

test('port arguments are validated before they reach a process command', () => {
  assert.equal(options(['--port', '3001']).port, 3001)
  for (const value of ['', '0', '65536', '3000 & echo unsafe', '-1', '3.5']) {
    assert.throws(() => options(['--port', value]))
  }
  assert.throws(() => options(['--unknown']))
  assert.deepEqual(options(['--test', '--no-browser', '--check']), {
    port: 3000, test: true, browser: false, check: true, help: false
  })
})

test('startup readiness requires this LMS, a working database and the RunAll home page', async t => {
  let healthStatus = 200
  let health = { app: { name: 'upPowerSkill LMS' }, status: 'ok', database: { status: 'healthy' } }
  let homeStatus = 200
  let homeBody = '<!doctype html><html><body><main data-runall-home>Home</main></body></html>'
  const server = http.createServer((req, res) => {
    if (req.url === '/api/health') {
      res.writeHead(healthStatus, { 'Content-Type': 'application/json', Connection: 'close' })
      res.end(JSON.stringify(health))
    } else {
      res.writeHead(homeStatus, { 'Content-Type': 'text/html', Connection: 'close' })
      res.end(homeBody)
    }
  })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  t.after(() => new Promise(resolve => server.close(resolve)))
  const port = server.address().port
  const url = `http://127.0.0.1:${port}`

  await assert.rejects(assertPortAvailable(port), /No existing process was stopped/)
  assert.equal(await ready(url), true)
  health.database.status = 'degraded'
  health.status = 'warning'
  assert.equal(await ready(url), true)
  health.database.status = 'unhealthy'
  assert.equal(await ready(url), false)
  health.database.status = 'healthy'
  health.app.name = 'Another application'
  assert.equal(await ready(url), false)
  health.app.name = 'upPowerSkill LMS'
  healthStatus = 503
  assert.equal(await ready(url), false)
  healthStatus = 200
  homeStatus = 500
  assert.equal(await ready(url), false)
  homeStatus = 302
  assert.equal(await ready(url), false)
  homeStatus = 200
  homeBody = '<html><body>Another application</body></html>'
  assert.equal(await ready(url), false)
})

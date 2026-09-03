import { defineConfig, devices } from '@playwright/test'
import { existsSync } from 'fs'
import { join } from 'path'

const localBrowsers = join(process.cwd(), '.playwright-browsers')
if (!process.env.CI && !process.env.PLAYWRIGHT_BROWSERS_PATH && existsSync(localBrowsers)) {
  process.env.PLAYWRIGHT_BROWSERS_PATH = localBrowsers
}

export default defineConfig({
  testDir: './e2e',
  timeout: 90_000,
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  expect: { timeout: 30_000 },
  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://127.0.0.1:3001',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    navigationTimeout: 60_000,
    actionTimeout: 30_000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: process.env.E2E_EXTERNAL_SERVER ? undefined : {
    command: 'node .next/standalone/server.js',
    url: 'http://127.0.0.1:3001/login',
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
    env: { HOSTNAME: '127.0.0.1', PORT: '3001', NEXTAUTH_URL: 'http://127.0.0.1:3001', AUTH_URL: 'http://127.0.0.1:3001' },
  },
})

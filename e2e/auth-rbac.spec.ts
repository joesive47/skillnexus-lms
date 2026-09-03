import { expect, test, type Page } from '@playwright/test'

const password = process.env.E2E_PASSWORD || 'SkillNexus@Test2026'

async function login(page: Page, email: string, loginPassword = password) {
  await page.goto('/login')
  await page.getByLabel('อีเมล').fill(email)
  await page.getByLabel('รหัสผ่าน').fill(loginPassword)
  await page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true }).click()
}

test('administrator logs in once and can manage course categories', async ({ page }) => {
  await login(page, 'admin@test.local')
  await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 60_000 })
  await page.goto('/dashboard/admin/course-categories')
  await expect(page.getByRole('heading', { name: 'จัดการหมวดหมู่หลักสูตร' })).toBeVisible()
  await expect(page.getByText('เพิ่มหมวดหมู่หลัก')).toBeVisible()
})

test('student logs in once and cannot open administrator pages', async ({ page }) => {
  await login(page, 'student@test.local')
  await expect(page).toHaveURL(/\/student\/dashboard/, { timeout: 60_000 })
  await page.goto('/dashboard/admin/course-categories')
  await expect(page).toHaveURL(/\/student\/dashboard/, { timeout: 60_000 })
  await expect(page.getByRole('heading', { name: 'Student Dashboard' })).toBeVisible()
})

test('invalid credentials show a stable error without navigation loops', async ({ page }) => {
  await login(page, 'student@test.local', 'wrong-password')
  await expect(page.getByText('อีเมลหรือรหัสผ่านไม่ถูกต้อง')).toBeVisible()
  await expect(page).toHaveURL(/\/login/)
})

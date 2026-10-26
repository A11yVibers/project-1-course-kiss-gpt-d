import { expect, test } from '@playwright/test'

test('catalog is populated from supplied course and instructor data', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle('Epoch — History, in context')
  await expect(page.getByRole('heading', { name: 'The past is never just past.' })).toBeVisible()
  await page.getByRole('link', { name: 'Explore the catalog' }).click()
  await expect(page).toHaveURL(/#catalog$/)
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100)
  await expect(page.locator('.course-card')).toHaveCount(12)
  await expect(page.getByText('12 courses', { exact: true }).first()).toBeVisible()
  const egyptCourse = page.locator('.course-card').filter({ has: page.getByRole('heading', { name: 'Ancient Egypt: Pharaohs, Pyramids, and Daily Life' }) })
  const worldWarTwoCourse = page.locator('.course-card').filter({ has: page.getByRole('heading', { name: 'World War II: A Global History' }) })
  await expect(egyptCourse).toContainText('Dr. Leila Rahman')
  await expect(worldWarTwoCourse).toContainText('8 weeks')
})

test('search narrows the catalog and can be cleared', async ({ page }) => {
  await page.goto('/#catalog')
  const search = page.getByRole('searchbox', { name: 'Search courses' })

  await search.fill('Silk Roads')
  await expect(page.locator('.course-card')).toHaveCount(1)
  await expect(page.getByRole('button', { name: 'Open The Silk Roads: Trade, Religion, and Exchange' })).toBeVisible()
  await page.getByRole('button', { name: 'Clear search' }).click()
  await expect(page.locator('.course-card')).toHaveCount(12)

  await search.fill('subject not in this catalog')
  await expect(page.getByRole('heading', { name: 'No courses found' })).toBeVisible()
  await page.getByRole('button', { name: 'Show all courses' }).click()
  await expect(page.locator('.course-card')).toHaveCount(12)
})

test('catalog filters and sorting work together and reset cleanly', async ({ page }) => {
  await page.goto('/#catalog')

  await page.getByRole('combobox', { name: 'Filter by instructor' }).selectOption({ label: 'Dr. Arjun Mehta' })
  await expect(page.locator('.course-card')).toHaveCount(3)
  await page.getByRole('combobox', { name: 'Filter by course length' }).selectOption('6')
  await expect(page.locator('.course-card')).toHaveCount(1)
  await expect(page.getByRole('button', { name: 'Open Empires of South Asia: Sultanates, Mughals, and Colonial Encounters' })).toBeVisible()

  await page.getByRole('combobox', { name: 'Sort courses' }).selectOption('title')
  await page.getByRole('button', { name: 'Reset filters' }).click()
  await expect(page.locator('.course-card')).toHaveCount(12)

  await page.getByRole('combobox', { name: 'Sort courses' }).selectOption('length')
  await expect(page.locator('.course-card').first()).toContainText('Ancient Egypt')
})

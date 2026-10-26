import { expect, test } from '@playwright/test'

test('mobile course view keeps the material viewer available behind the syllabus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/#/courses/HIST111')

  const sidebar = page.getByLabel('Course information and syllabus')
  await expect(sidebar).toBeVisible()
  await page.getByRole('button', { name: /Assignment: Mapping the Silk Roads/ }).click()
  await page.getByRole('button', { name: 'Collapse course information' }).click()
  await expect(sidebar).toHaveAttribute('aria-hidden', 'true')
  await expect(page.getByRole('heading', { name: 'Assignment: Mapping the Silk Roads' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Expand course information' })).toContainText('Show syllabus')
})

test('unknown course routes return to the catalog instead of a broken screen', async ({ page }) => {
  await page.goto('/#/courses/NOT-A-COURSE')
  await expect(page.getByRole('heading', { name: 'Choose where to begin.' })).toBeVisible()
  await expect(page.locator('.course-card')).toHaveCount(12)
})

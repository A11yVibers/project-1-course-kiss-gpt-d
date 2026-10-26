import { expect, test } from '@playwright/test'

async function openSilkRoads(page) {
  await page.goto('/')
  await page.getByRole('link', { name: /Course spotlight/ }).click()
  await expect(page).toHaveURL(/#\/courses\/HIST111$/)
}

test('Silk Roads course shows its complete data-driven syllabus', async ({ page }) => {
  await openSilkRoads(page)

  await expect(page.getByRole('heading', { level: 1, name: 'The Silk Roads: Trade, Religion, and Exchange' })).toBeVisible()
  await expect(page.getByText('Dr. Leila Rahman')).toBeVisible()
  await expect(page.getByRole('table', { name: '' }).locator('tbody tr')).toHaveCount(10)
  await expect(page.getByText('Class 1: What Were the Silk Roads?')).toBeVisible()
  await expect(page.getByText('Class 10: Maritime Routes and the Legacy of the Silk Roads')).toBeVisible()
  await expect(page.getByRole('button', { name: /Lecture Notes: What Were the Silk Roads/ })).toBeVisible()
  await expect(page.getByRole('button', { name: /Lecture Video: What Were the Silk Roads/ })).toBeVisible()
  await expect(page.getByRole('button', { name: /Crash Course World History #9/ })).toBeVisible()
  await expect(page.getByRole('button', { name: /Assignment: Mapping the Silk Roads/ })).toBeVisible()
  await expect(page.getByText('Materials forthcoming')).toHaveCount(8)
})

test('persistent viewer swaps among every supplied material without leaving the course', async ({ page }) => {
  await openSilkRoads(page)
  const originalUrl = page.url()

  await expect(page.getByTestId('course-cover')).toBeVisible()
  await page.getByRole('button', { name: /Lecture Notes: What Were the Silk Roads/ }).click()
  await expect(page.locator('.document-frame iframe')).toHaveAttribute('src', /silk_roads_class_01_lecture.*\.pdf#view=FitH$/)
  await expect(page).toHaveURL(originalUrl)

  await page.getByRole('button', { name: /Lecture Video: What Were the Silk Roads/ }).click()
  await expect(page.locator('.video-frame video')).toHaveAttribute('src', /silk_roads_class_01_lecture.*\.mp4$/)
  await expect(page).toHaveURL(originalUrl)

  await page.getByRole('button', { name: /Crash Course World History #9/ }).click()
  await expect(page.locator('.video-frame iframe')).toHaveAttribute('src', 'https://www.youtube-nocookie.com/embed/vfe-eNq-Qyg')
  await expect(page).toHaveURL(originalUrl)

  await page.getByRole('button', { name: /Assignment: Mapping the Silk Roads/ }).click()
  await expect(page.getByRole('heading', { name: 'Assignment: Mapping the Silk Roads' })).toBeVisible()
  await expect(page.getByText('How did geography, trade goods, travelers, and cultural exchange')).toBeVisible()
  await expect(page.getByRole('cell', { name: 'Historical accuracy' })).toBeVisible()
  await expect(page).toHaveURL(originalUrl)

  await page.getByRole('button', { name: 'Close material' }).click()
  await expect(page.getByTestId('course-cover')).toBeVisible()
})

test('syllabus pane collapses, expands, and returns to the catalog', async ({ page }) => {
  await page.goto('/#/courses/HIST111')
  const sidebar = page.getByLabel('Course information and syllabus')

  await expect(sidebar).toHaveAttribute('aria-hidden', 'false')
  await page.getByRole('button', { name: 'Collapse course information' }).click()
  await expect(sidebar).toHaveAttribute('aria-hidden', 'true')
  await expect(page.getByRole('button', { name: 'Expand course information' })).toHaveAttribute('aria-expanded', 'false')
  await page.getByRole('button', { name: 'Expand course information' }).click()
  await expect(sidebar).toHaveAttribute('aria-hidden', 'false')

  await page.getByRole('button', { name: 'Catalog' }).click()
  await expect(page).toHaveURL(/#\/$/)
  await expect(page.getByRole('heading', { name: 'Choose where to begin.' })).toBeVisible()
})

test('courses without supplied materials still open with their complete schedule', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Open Ancient Greece: Polis, Myth, and Democracy' }).click()

  await expect(page.getByRole('heading', { level: 1, name: 'Ancient Greece: Polis, Myth, and Democracy' })).toBeVisible()
  await expect(page.locator('.syllabus-table tbody tr')).toHaveCount(12)
  await expect(page.getByText('Materials forthcoming')).toHaveCount(12)
  await expect(page.getByTestId('course-cover')).toBeVisible()
})

// Invalid external URLs, missing local files, unknown material types, and image-network
// failures cannot be reached with the immutable project data without mocks or test doubles.

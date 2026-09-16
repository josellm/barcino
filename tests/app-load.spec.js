import { test, expect } from '@playwright/test';

test.describe('app-load smoke test', () => {
  test('loads the app without errors and renders the #app root', async ({ page }) => {
    const errors = [];

    // Collect runtime errors that would indicate failed module imports or script failures.
    page.on('pageerror', (error) => errors.push(error));
    page.on('consoleerror', (message) => errors.push(message));

    await page.goto('/', { waitUntil: 'networkidle' });

    // No runtime errors should have been emitted during load.
    expect(errors).toEqual([]);

    // The intro screen must appear before the onboarding flow.
    await expect(page.locator('#btn-start')).toBeVisible();
    await page.click('#btn-start');
    await expect(page.locator('#btn-join-adventure')).toBeVisible();
    await page.click('#btn-join-adventure');

    // After starting, the #app root element must contain rendered child elements.
    await expect(page.locator('#app')).not.toBeEmpty();
    expect(await page.locator('#app').count()).toBeGreaterThan(0);
    expect(
      await page.evaluate(() => document.querySelector('#app').children.length)
    ).toBeGreaterThan(0);
  });
});
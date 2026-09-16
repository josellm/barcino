import { test, expect } from '@playwright/test';

test.describe('parchment scrollability and containment', () => {
  test('.parchment-content has scrollable overflow and stays within .scene-container', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    // Advance to onboarding step 2 where parchment content is shown.
    await page.click('#btn-start');
    await page.click('#btn-join-adventure');
    await expect(page.locator('.parchment-content')).toBeVisible();

    // Verify the parchment content is contained within the scene container.
    const sceneBox = await page.locator('.scene-container').boundingBox();
    const parchmentBox = await page.locator('.parchment-content').boundingBox();

    expect(parchmentBox).not.toBeNull();
    expect(sceneBox).not.toBeNull();

    // Parchment should be within the scene container bounds.
    expect(parchmentBox!.x).toBeGreaterThanOrEqual(sceneBox!.x - 1);
    expect(parchmentBox!.y).toBeGreaterThanOrEqual(sceneBox!.y - 1);
    expect(parchmentBox!.x + parchmentBox!.width).toBeLessThanOrEqual(sceneBox!.x + sceneBox!.width + 1);
    expect(parchmentBox!.y + parchmentBox!.height).toBeLessThanOrEqual(sceneBox!.y + sceneBox!.height + 1);

    // Verify scrollable overflow is set on the parchment content.
    const overflow = await page.locator('.parchment-content').evaluate((el) => {
      return getComputedStyle(el).overflowY;
    });
    expect(overflow).toBe('auto');
  });

  test('team registration error handling — short name shows .error span inside parchment overlay', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    // Advance to onboarding step 2.
    await page.click('#btn-start');
    await page.click('#btn-join-adventure');
    await expect(page.locator('.parchment-content')).toBeVisible();

    // Enter a name that is too short (< 3 characters).
    await page.fill('#team-name-input', 'A');
    await page.click('#btn-confirm-name');

    // The error span should appear inside the parchment overlay.
    await expect(page.locator('.parchment-content .error')).toBeVisible();
  });
});
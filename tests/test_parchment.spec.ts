import { test, expect } from '@playwright/test';

test.describe('parchment scrollability and containment', () => {
  test('.parchment-content has scrollable overflow and stays within .scene-container', async ({ page }) => {
    await page.goto('/');
    await page.click('#btn-start');
    await expect(page.locator('#input-team-name')).toBeVisible();

    // Verify overflow-y is set to auto or scroll on .parchment-content.
    const overflowY = await page.locator('.parchment-content').evaluate((el) => {
      return window.getComputedStyle(el).overflowY;
    });
    expect(['auto', 'scroll']).toContain(overflowY);

    // Verify .parchment-content bounding box does not extend beyond .scene-container.
    const parchmentBox = await page.locator('.parchment-content').boundingBox();
    const sceneBox = await page.locator('.scene-container').boundingBox();

    expect(parchmentBox).not.toBeNull();
    expect(sceneBox).not.toBeNull();

    expect(parchmentBox.x).toBeGreaterThanOrEqual(sceneBox.x - 2);
    expect(parchmentBox.y).toBeGreaterThanOrEqual(sceneBox.y - 2);
    expect(parchmentBox.x + parchmentBox.width).toBeLessThanOrEqual(sceneBox.x + sceneBox.width + 2);
    expect(parchmentBox.y + parchmentBox.height).toBeLessThanOrEqual(sceneBox.y + sceneBox.height + 2);
  });
});

test.describe('team registration error handling', () => {
  test('invalid characters show .error span inside parchment overlay', async ({ page }) => {
    await page.goto('/');
    await page.click('#btn-start');
    await expect(page.locator('#input-team-name')).toBeVisible();

    // Fill with invalid characters (less than 3 chars triggers validation error).
    await page.fill('#input-team-name', 'a');
    await page.click('#btn-confirm-team');

    // The .error span must be visible and positioned inside .parchment-content.
    const errorSpan = page.locator('#team-name-error');
    await expect(errorSpan).toBeVisible();
    await expect(errorSpan).toHaveText('El nombre debe tener al menos 3 caracteres');

    const errorBox = await errorSpan.boundingBox();
    const parchmentBox = await page.locator('.parchment-content').boundingBox();

    expect(errorBox).not.toBeNull();
    expect(parchmentBox).not.toBeNull();

    expect(errorBox.x).toBeGreaterThanOrEqual(parchmentBox.x - 2);
    expect(errorBox.y).toBeGreaterThanOrEqual(parchmentBox.y - 2);
    expect(errorBox.x + errorBox.width).toBeLessThanOrEqual(parchmentBox.x + parchmentBox.width + 2);
    expect(errorBox.y + errorBox.height).toBeLessThanOrEqual(parchmentBox.y + parchmentBox.height + 2);
  });
});

test.describe('maps button containment', () => {
  test('.btn-maps link is within parchment bounds', async ({ page }) => {
    await page.goto('/');
    await page.click('#btn-start');

    // Register a valid team to advance to Mission 0 where .btn-maps appears.
    await page.fill('#input-team-name', 'Detectives de Barcino');
    await page.click('#btn-confirm-team');

    await expect(page.locator('.btn-maps')).toBeVisible();

    const mapsBox = await page.locator('.btn-maps').boundingBox();
    const parchmentBox = await page.locator('.parchment-content').boundingBox();

    expect(mapsBox).not.toBeNull();
    expect(parchmentBox).not.toBeNull();

    expect(mapsBox.x).toBeGreaterThanOrEqual(parchmentBox.x - 2);
    expect(mapsBox.y).toBeGreaterThanOrEqual(parchmentBox.y - 2);
    expect(mapsBox.x + mapsBox.width).toBeLessThanOrEqual(parchmentBox.x + parchmentBox.width + 2);
    expect(mapsBox.y + mapsBox.height).toBeLessThanOrEqual(parchmentBox.y + parchmentBox.height + 2);
  });
});
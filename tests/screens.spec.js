import { test, expect } from '@playwright/test';

test.describe('screen transitions', () => {
  test('01 Onboarding Flow — join adventure button transitions to team registration', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error));
    page.on('consoleerror', (message) => errors.push(message));

    await page.goto('/', { waitUntil: 'networkidle' });
    expect(errors).toEqual([]);

    // Onboarding step 1: intro with join-adventure button.
    await expect(page.locator('#btn-start')).toBeVisible();
    await page.click('#btn-start');
    await expect(page.locator('#btn-join-adventure')).toBeVisible();
    await page.click('#btn-join-adventure');

    // Onboarding step 2: team name input and confirm button.
    await expect(page.locator('#team-name-input')).toBeVisible();
    await expect(page.locator('#btn-confirm-name')).toBeVisible();
  });

  test('02 Team Registration Screen — validation blocks empty name and valid name advances to Mission 0', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error));
    page.on('consoleerror', (message) => errors.push(message));

    await page.goto('/', { waitUntil: 'networkidle' });
    expect(errors).toEqual([]);

    // Advance to team registration step.
    await page.click('#btn-start');
    await page.click('#btn-join-adventure');

    // Try submitting empty name — should stay on step 2 with error.
    await page.click('#btn-confirm-name');
    await expect(page.locator('#team-name-error')).toBeVisible();
    await expect(page.locator('#team-name-input')).toBeVisible();

    // Enter valid name and confirm.
    await page.fill('#team-name-input', 'Los Viajeros');
    await page.click('#btn-confirm-name');

    // Should advance to Mission 0 screen.
    await expect(page.locator('#mission0-screen')).toBeVisible();
    await expect(page.locator('#mission0-screen .puzzle-container h3')).toContainText('El Enigma de la Amuleta');
  });

  test('03 Mission 0 Screen & Persistence — state survives a page reload', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error));
    page.on('consoleerror', (message) => errors.push(message));

    await page.goto('/', { waitUntil: 'networkidle' });
    expect(errors).toEqual([]);

    // Advance to Mission 0 screen.
    await page.click('#btn-start');
    await page.click('#btn-join-adventure');
    await page.fill('#team-name-input', 'Los Viajeros');
    await page.click('#btn-confirm-name');

    await expect(page.locator('#mission0-screen')).toBeVisible();

    // Reload — state should persist via localStorage.
    await page.reload({ waitUntil: 'networkidle' });

    // After reload, the app should restore the Mission 0 screen.
    await expect(page.locator('#mission0-screen')).toBeVisible();
  });

  test('04 Audio Toggle — present in DOM on page reload', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error));
    page.on('consoleerror', (message) => errors.push(message));

    await page.goto('/', { waitUntil: 'networkidle' });
    expect(errors).toEqual([]);

    // Audio toggle should be present in the global UI.
    await expect(page.locator('#btn-audio-toggle')).toBeVisible();

    // Reload and verify it persists in the DOM.
    await page.reload({ waitUntil: 'networkidle' });
    await expect(page.locator('#btn-audio-toggle')).toBeVisible();
  });

  test('05 Parchment overlay — rendered during onboarding step 2', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error));
    page.on('consoleerror', (message) => errors.push(message));

    await page.goto('/', { waitUntil: 'networkidle' });
    expect(errors).toEqual([]);

    // Advance to onboarding step 2 where the parchment overlay is shown.
    await page.click('#btn-start');
    await page.click('#btn-join-adventure');

    // Parchment content should be visible during onboarding.
    await expect(page.locator('.parchment-content')).toBeVisible();

    // The team name input and confirm button should be inside the parchment.
    await expect(page.locator('#team-name-input')).toBeVisible();
    await expect(page.locator('#btn-confirm-name')).toBeVisible();
  });
});
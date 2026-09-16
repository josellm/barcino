import { test, expect } from '@playwright/test';

test.describe('Stage 1', () => {
  test('Stage 1 renders with witnesses and amulet bar', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error));
    page.on('consoleerror', (message) => errors.push(message));

    await page.goto('/', { waitUntil: 'networkidle' });
    expect(errors).toEqual([]);

    // Advance through onboarding to the mission screen.
    await page.click('#btn-start');
    await page.click('#btn-join-adventure');
    await page.fill('#team-name-input', 'Los Viajeros');
    await page.click('#btn-confirm-name');

    // Now on Mission 0 screen (first stage with witnesses)
    await expect(page.locator('#mission0-screen')).toBeVisible();

    // Assert the 3 witness cards (by their names) are visible — scope to headings to avoid strict-mode collision with puzzle labels
    await expect(page.locator('.witness-card h3').filter({ hasText: 'Lluís Domènech i Montaner' })).toBeVisible();
    await expect(page.locator('.witness-card h3').filter({ hasText: 'Músico despistado' })).toBeVisible();
    await expect(page.locator('.witness-card h3').filter({ hasText: 'Agente Encubierto' })).toBeVisible();

    // Amulet bar should be present in the global UI
    await expect(page.locator('#amulet-bar')).toBeVisible();
    await expect(page.locator('.gem-slot')).toHaveCount(5);
  });

  test('Liar witness shows warning, true witness unlocks puzzle', async ({ page }) => {
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

    // Click the liar witness (Agente Encubierto) and its 'Interrogate' button.
    const liarCard = page.locator('.witness-card').filter({ hasText: 'Agente Encubierto' });
    await liarCard.locator('.cta-button').click();

    // Assert a warning message appears (text contains 'no es fiable')
    await expect(page.getByText(/no es fiable/)).toBeVisible();

    // Now click the true witness to reach the observation puzzle phase
    const trueCard = page.locator('.witness-card').filter({ hasText: 'Lluís Domènech i Montaner' });
    await trueCard.locator('.cta-button').click();

    // Assert the puzzle container becomes visible with the observation question text
    await expect(page.locator('.puzzle-container')).toBeVisible();
    await expect(page.locator('.puzzle-instruction')).toContainText('Una figura hembra alegórica');
  });

  test('Correct puzzle answer advances from Mission 0 screen', async ({ page }) => {
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

    // Click the true witness to reach the observation puzzle
    const trueCard = page.locator('.witness-card').filter({ hasText: 'Lluís Domènech i Montaner' });
    await trueCard.locator('.cta-button').click();

    // Select the correct option (index 0: 'Una figura hembra alegórica...')
    await page.locator('#puzzle-opt-0').check();

    // Submit the puzzle
    await page.locator('.puzzle-cta').click();

    // After solving, the app attempts to advance to the next stage.
    // The mission0 screen should no longer be visible.
    await expect(page.locator('#mission0-screen')).not.toBeVisible({ timeout: 10000 });

    // The amulet bar should still be present in the global UI.
    await expect(page.locator('#amulet-bar')).toBeVisible();
  });
});
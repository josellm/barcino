import { test, expect } from '@playwright/test';

test.describe('Stage 3 - Pont del Bisbe', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('barcino_game_state', JSON.stringify({
        teamName: 'Los Viajeros',
        currentStage: 3,
        gems: [true, true, false, false, false]
      }));
    });
  });

  test('loads Pont del Bisbe with its background, dispatch, and witnesses', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error));
    page.on('consoleerror', (message) => errors.push(message));

    await page.goto('/', { waitUntil: 'networkidle' });

    await expect(page.locator('#stage-screen')).toBeVisible();
    await expect(page.locator('.stage-title')).toHaveText('Pont del Bisbe');
    await expect(page.locator('.scene-container')).toHaveCSS(
      'background-image',
      /pont-bisbe-bg\.jpg/
    );
    await expect(page.getByText(/Con la Gema Templaria a salvo/)).toBeVisible();
    await expect(page.locator('a[href*="Pont+del+Bisbe"]')).toBeVisible();
    await expect(page.getByRole('button', { name: '¡Estamos en el Pont del Bisbe!' })).toBeVisible();

    await page.getByRole('button', { name: '¡Estamos en el Pont del Bisbe!' }).click();
    await expect(page.getByRole('button', { name: 'Hablar con Cronista del Barri Gòtic' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Hablar con Turista desorientado' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Hablar con Soplón de la Sombra' })).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('rejects false witnesses and progresses with Cronista del Barri Gòtic', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: '¡Estamos en el Pont del Bisbe!' }).click();

    await page.getByRole('button', { name: 'Hablar con Turista desorientado' }).click();
    await page.locator('.witness-dialogue-box .cta-button').click();
    await expect(page.getByText('Esa testigo no es fiable. Intenta de nuevo.')).toBeVisible();

    await page.getByRole('button', { name: 'Hablar con Soplón de la Sombra' }).click();
    await page.locator('.witness-dialogue-box .cta-button').click();
    await expect(page.getByText('Esa testigo no es fiable. Intenta de nuevo.')).toBeVisible();

    await page.getByRole('button', { name: 'Hablar con Cronista del Barri Gòtic' }).click();
    await page.locator('.witness-dialogue-box .cta-button').click();
    await expect(page.locator('.puzzle-options')).toBeVisible();
  });

  test('unlocks Gem 3 and persists Stage 3 after the skull answer', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error));
    page.on('consoleerror', (message) => errors.push(message));

    await page.goto('/', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: '¡Estamos en el Pont del Bisbe!' }).click();
    await page.getByRole('button', { name: 'Hablar con Cronista del Barri Gòtic' }).click();
    await page.locator('.witness-dialogue-box .cta-button').click();
    await page.getByRole('radio', { name: 'Una calavera de mármol atravesada por una daga real' }).check();

    expect(errors).toEqual([]);
    await expect(page.locator('#gem-unlocked-modal')).toBeVisible();
    await expect(page.locator('#gem-unlocked-modal')).toContainText('Gema Desbloqueada');
    await expect(page.locator('#amulet-bar .gem-slot.collected')).toHaveCount(3);
    const savedState = await page.evaluate(() => JSON.parse(localStorage.getItem('barcino_game_state')));
    expect(savedState.currentStage).toBe(3);
    expect(savedState.gems).toEqual([true, true, true, false, false]);
  });
});
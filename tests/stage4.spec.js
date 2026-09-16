import { test, expect } from '@playwright/test';

test.describe('Stage 4 - Templo de Augusto', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('barcino_game_state', JSON.stringify({
        teamName: 'Los Viajeros',
        currentStage: 4,
        gems: [true, true, true, false, false]
      }));
    });
  });

  test('loads Templo de Augusto with its background, dispatch, and witnesses', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error));
    page.on('consoleerror', (message) => errors.push(message));

    await page.goto('/', { waitUntil: 'networkidle' });

    await expect(page.locator('#stage-screen')).toBeVisible();
    await expect(page.locator('.stage-title')).toHaveText('Templo de Augusto');
    await expect(page.locator('.scene-container')).toHaveCSS(
      'background-image',
      /templo-augusto-bg\.jpg/
    );
    await expect(page.getByText(/número 10 de la calle Paradís/)).toBeVisible();
    await expect(page.locator('a[href*="Templo+de+Augusto"]')).toBeVisible();
    await expect(page.getByRole('button', { name: '¡Estamos en el Templo de Augusto!' })).toBeVisible();

    await page.getByRole('button', { name: '¡Estamos en el Templo de Augusto!' }).click();
    await expect(page.getByRole('button', { name: 'Hablar con Arqueóloga de Barcino' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Hablar con Vecino despistado' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Hablar con Mercenario de la Sombra' })).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('rejects false witnesses and progresses with Arqueóloga de Barcino', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: '¡Estamos en el Templo de Augusto!' }).click();

    await page.getByRole('button', { name: 'Hablar con Vecino despistado' }).click();
    await page.locator('.witness-dialogue-box .cta-button').click();
    await expect(page.getByText('Esa testigo no es fiable. Intenta de nuevo.')).toBeVisible();

    await page.getByRole('button', { name: 'Hablar con Mercenario de la Sombra' }).click();
    await page.locator('.witness-dialogue-box .cta-button').click();
    await expect(page.getByText('Esa testigo no es fiable. Intenta de nuevo.')).toBeVisible();

    await page.getByRole('button', { name: 'Hablar con Arqueóloga de Barcino' }).click();
    await page.locator('.witness-dialogue-box .cta-button').click();
    await expect(page.locator('.puzzle-options')).toBeVisible();
  });

  test('unlocks Gem 4 and persists Stage 4 after the column answer', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error));
    page.on('consoleerror', (message) => errors.push(message));

    await page.goto('/', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: '¡Estamos en el Templo de Augusto!' }).click();
    await page.getByRole('button', { name: 'Hablar con Arqueóloga de Barcino' }).click();
    await page.locator('.witness-dialogue-box .cta-button').click();
    await page.getByRole('radio', { name: '4 columnas corintias completas' }).check();

    expect(errors).toEqual([]);
    await expect(page.locator('#gem-unlocked-modal')).toBeVisible();
    await expect(page.locator('#gem-unlocked-modal')).toContainText('Gema Desbloqueada');
    await expect(page.locator('#amulet-bar .gem-slot.collected')).toHaveCount(4);
    const savedState = await page.evaluate(() => JSON.parse(localStorage.getItem('barcino_game_state')));
    expect(savedState.currentStage).toBe(4);
    expect(savedState.gems).toEqual([true, true, true, true, false]);
  });
});
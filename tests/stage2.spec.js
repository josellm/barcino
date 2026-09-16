import { test, expect } from '@playwright/test';

test.describe('Stage 2 - Iglesia de Santa Ana', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('barcino_game_state', JSON.stringify({
        teamName: 'Los Viajeros',
        currentStage: 2,
        gems: [true, false, false, false, false]
      }));
    });
  });

  test('loads Santa Ana with its background, title, and witnesses', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error));
    page.on('consoleerror', (message) => errors.push(message));

    await page.goto('/', { waitUntil: 'networkidle' });

    await expect(page.locator('#stage-screen')).toBeVisible();
    await expect(page.locator('.stage-title')).toHaveText('Iglesia de Santa Ana');
    await expect(page.locator('.scene-container')).toHaveCSS(
      'background-image',
      /santa-ana-bg\.jpg/
    );
    await expect(page.locator('a[href*="Iglesia+de+Santa+Ana"]')).toBeVisible();
    await page.getByRole('button', { name: '¡Estamos en Santa Ana!' }).click();
    await expect(page.getByRole('button', { name: 'Hablar con Monje Custodio' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Hablar con Comprador despistado' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Hablar con Falso Templario' })).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('rejects false witnesses and progresses with Monje Custodio', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    await page.getByRole('button', { name: '¡Estamos en Santa Ana!' }).click();
    await page.getByRole('button', { name: 'Hablar con Comprador despistado' }).click();
    await page.locator('.witness-dialogue-box .cta-button').click();
    await expect(page.getByText('Esa testigo no es fiable. Intenta de nuevo.')).toBeVisible();

    await page.getByRole('button', { name: 'Hablar con Falso Templario' }).click();
    await page.locator('.witness-dialogue-box .cta-button').click();
    await expect(page.getByText('Esa testigo no es fiable. Intenta de nuevo.')).toBeVisible();

    await page.getByRole('button', { name: 'Hablar con Monje Custodio' }).click();
    await page.locator('.witness-dialogue-box .cta-button').click();
    await expect(page.locator('.puzzle-options')).toBeVisible();
  });

  test('awards Gem 2 and transitions to Stage 3', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    await page.getByRole('button', { name: '¡Estamos en Santa Ana!' }).click();
    await page.getByRole('button', { name: 'Hablar con Monje Custodio' }).click();
    await page.locator('.witness-dialogue-box .cta-button').click();
    await page.getByRole('radio', { name: 'Una gran cruz de piedra' }).check();
    await page.getByRole('button', { name: 'Continuar' }).click();

    await expect(page.getByText('¡Gema desbloqueada!')).toBeVisible();
    await page.getByRole('button', { name: 'Ir al Pont del Bisbe (Stage 3)' }).click();

    await expect(page.locator('.stage-title')).toHaveText('Pont del Bisbe');
    await expect(page.locator('#amulet-bar .gem-slot.collected')).toHaveCount(2);
    const savedState = await page.evaluate(() => JSON.parse(localStorage.getItem('barcino_game_state')));
    expect(savedState.currentStage).toBe(3);
    expect(savedState.gems).toEqual([true, true, false, false, false]);
  });
});
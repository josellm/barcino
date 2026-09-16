import { test, expect } from '@playwright/test';

test.describe('Stage 5 - El Bosc de les Fades', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('barcino_game_state', JSON.stringify({
        teamName: 'Los Viajeros',
        currentStage: 5,
        gems: [true, true, true, true, false]
      }));
    });
  });

  test('loads the rest stop with its background, narrative, and witnesses', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error));
    page.on('consoleerror', (message) => errors.push(message));

    await page.goto('/', { waitUntil: 'networkidle' });

    await expect(page.locator('#stage-screen')).toBeVisible();
    await expect(page.locator('.stage-title')).toHaveText('El Bosc de les Fades');
    await expect(page.locator('.scene-container')).toHaveCSS(
      'background-image',
      /bosc-fades-bg\.jpg/
    );
    await expect(page.locator('.stage-dispatch.parchment-content')).toContainText('tomar un descanso');
    await expect(page.locator('#amulet-bar .gem-slot.collected')).toHaveCount(4);
    await expect(page.getByRole('button', { name: '¡Hemos llegado al Bosc de les Fades!' })).toBeVisible();

    await page.getByRole('button', { name: '¡Hemos llegado al Bosc de les Fades!' }).click();
    await expect(page.getByRole('button', { name: 'Hablar con Hada del Bosque' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Hablar con Cliente despistado' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Hablar con Duende de las Sombras' })).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('rejects false witnesses and unlocks the final-search action', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: '¡Hemos llegado al Bosc de les Fades!' }).click();

    await page.getByRole('button', { name: 'Hablar con Cliente despistado' }).click();
    await page.locator('.witness-dialogue-box .cta-button').click();
    await expect(page.getByText('Esa testigo no es fiable. Intenta de nuevo.')).toBeVisible();

    await page.getByRole('button', { name: 'Hablar con Duende de las Sombras' }).click();
    await page.locator('.witness-dialogue-box .cta-button').click();
    await expect(page.getByText('Esa testigo no es fiable. Intenta de nuevo.')).toBeVisible();

    await page.getByRole('button', { name: 'Hablar con Hada del Bosque' }).click();
    await page.locator('.witness-dialogue-box .cta-button').click();
    await expect(page.locator('#btn-next-stage')).toHaveText('¡Reanudar la Búsqueda Final!');
  });

  test('advances to Stage 6 when the final search resumes', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: '¡Hemos llegado al Bosc de les Fades!' }).click();
    await page.getByRole('button', { name: 'Hablar con Hada del Bosque' }).click();
    await page.locator('.witness-dialogue-box .cta-button').click();
    await page.click('#btn-next-stage');

    const savedState = await page.evaluate(() => JSON.parse(localStorage.getItem('barcino_game_state')));
    expect(savedState.currentStage).toBe(6);
  });
});
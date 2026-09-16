import { test, expect } from '@playwright/test';

test.describe('Stage 1', () => {
  test('Stage 1 renders with witnesses and amulet bar', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error));
    page.on('consoleerror', (message) => errors.push(message));

    await page.goto('/', { waitUntil: 'networkidle' });
    expect(errors).toEqual([]);

    await page.click('#btn-start');
    await page.click('#btn-join-adventure');
    await page.fill('#team-name-input', 'Los Viajeros');
    await page.click('#btn-confirm-name');

    await expect(page.locator('#mission0-screen')).toBeVisible();
    await page.click('#btn-arrived-passatge');

    await expect(page.locator('#stage-screen')).toBeVisible();
    await expect(page.locator('.witness-hotspot')).toHaveCount(3);
    await expect(page.locator('#amulet-bar')).toBeVisible();
    await expect(page.locator('.gem-slot')).toHaveCount(5);
  });

  test('Liar witness shows warning, true witness unlocks puzzle', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error));
    page.on('consoleerror', (message) => errors.push(message));

    await page.goto('/', { waitUntil: 'networkidle' });
    expect(errors).toEqual([]);

    await page.click('#btn-start');
    await page.click('#btn-join-adventure');
    await page.fill('#team-name-input', 'Los Viajeros');
    await page.click('#btn-confirm-name');

    await expect(page.locator('#mission0-screen')).toBeVisible();
    await page.click('#btn-arrived-passatge');

    await page.getByRole('button', { name: 'Hablar con Agente Encubierto' }).click();
    await page.locator('.witness-dialogue-box .cta-button').click();
    await expect(page.getByText(/no es fiable|Esa testigo no es fiable/i)).toBeVisible();

    await page.getByRole('button', { name: 'Hablar con Lluís Domènech i Montaner' }).click();
    await page.locator('.witness-dialogue-box .cta-button').click();

    await expect(page.locator('.puzzle-options')).toBeVisible();
    await expect(page.locator('.puzzle-option')).toHaveCount(3);
  });

  test('Gem unlock is only marked after the stage is actually completed', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error));
    page.on('consoleerror', (message) => errors.push(message));

    await page.addInitScript(() => {
      localStorage.setItem('barcino_game_state', JSON.stringify({
        teamName: 'Los Viajeros',
        currentStage: 2,
        gems: [false, false, false, false, false]
      }));
    });

    await page.goto('/', { waitUntil: 'networkidle' });
    expect(errors).toEqual([]);

    await expect(page.locator('#amulet-bar')).toBeVisible();
    await expect(page.locator('#amulet-bar .gem-slot.collected')).toHaveCount(0);

    await page.locator('.witness-hotspot').first().click();
    await page.locator('.witness-dialogue-box .cta-button').click();

    await expect(page.locator('.puzzle-options')).toBeVisible();
    await page.getByRole('radio', { name: 'Una figura hembra alegórica' }).check();

    await page.getByRole('button', { name: 'Continuar' }).click();
    await expect(page.getByText('¡Gema desbloqueada!')).toBeVisible();
    await expect(page.locator('#amulet-bar .gem-slot.collected')).toHaveCount(0);

    await page.getByRole('button', { name: /Ir a Santa Ana/i }).click();
    await expect(page.locator('#amulet-bar .gem-slot.collected')).toHaveCount(1);
  });

  test('Correct puzzle answer marks the gem only when the stage is fully completed', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error));
    page.on('consoleerror', (message) => errors.push(message));

    await page.goto('/', { waitUntil: 'networkidle' });
    expect(errors).toEqual([]);

    await page.click('#btn-start');
    await page.click('#btn-join-adventure');
    await page.fill('#team-name-input', 'Los Viajeros');
    await page.click('#btn-confirm-name');

    await expect(page.locator('#mission0-screen')).toBeVisible();
    await page.click('#btn-arrived-passatge');

    await page.getByRole('button', { name: 'Hablar con Lluís Domènech i Montaner' }).click();
    await page.locator('.witness-dialogue-box .cta-button').click();

    await page.locator('input[type="radio"][value="0"]').check();
    await page.getByRole('button', { name: 'Continuar' }).click();

    await expect(page.locator('#amulet-bar .gem-slot.collected')).toHaveCount(0);
    await expect(page.getByText('¡Gema desbloqueada!')).toBeVisible();

    await page.getByRole('button', { name: /Ir a Santa Ana/i }).click();
    await expect(page.locator('#amulet-bar .gem-slot.collected')).toHaveCount(1);
  });
});
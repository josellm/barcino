import { test, expect } from '@playwright/test';

test.describe('Stage 6 climax and diploma', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('barcino_game_state', JSON.stringify({
        teamName: 'Los Viajeros',
        currentStage: 6,
        gems: [true, true, true, true, false]
      }));
    });
  });

  async function solveFinalPuzzle(page) {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: '¡Estamos en la Plaça del Rei!' }).click();
    await page.getByRole('button', { name: 'Hablar con Archivero del Palau Reial' }).click();
    await page.locator('.witness-dialogue-box .cta-button').click();
    await page.getByRole('radio', { name: 'Semicircular en abanico' }).check();
  }

  test('captures the thief and unlocks Gem 5 with all gems active', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error));
    page.on('consoleerror', (message) => errors.push(message));

    await solveFinalPuzzle(page);

    await expect(page.locator('#gem-unlocked-modal')).toBeVisible();
    await expect(page.locator('#gem-unlocked-modal')).toContainText('Victoria');
    await expect(page.locator('#amulet-bar .gem-slot.collected')).toHaveCount(5);
    const savedState = await page.evaluate(() => JSON.parse(localStorage.getItem('barcino_game_state')));
    expect(savedState.currentStage).toBe(6);
    expect(savedState.gems).toEqual([true, true, true, true, true]);
    expect(errors).toEqual([]);
  });

  test('renders a personalized diploma after the final victory', async ({ page }) => {
    await solveFinalPuzzle(page);
    await page.getByRole('button', { name: 'Continuar' }).click();
    await page.getByRole('button', { name: 'Ver Diploma de Graduación' }).click();

    await expect(page.locator('#diploma-screen')).toBeVisible();
    await expect(page.locator('.diploma-team-name')).toHaveText('Los Viajeros');
    await expect(page.locator('.diploma-title')).toHaveText('Grandes Detectives e Historiadores de Barcino');
    await expect(page.locator('.diploma-gem.collected')).toHaveCount(5);
    await expect(page.locator('#btn-print-diploma')).toBeVisible();
  });

  test('resets localStorage and returns to the intro screen', async ({ page }) => {
    await solveFinalPuzzle(page);
    await page.getByRole('button', { name: 'Continuar' }).click();
    await page.getByRole('button', { name: 'Ver Diploma de Graduación' }).click();
    await page.click('#btn-restart-game');

    await expect(page.locator('#btn-start')).toBeVisible();
    expect(await page.evaluate(() => localStorage.getItem('barcino_game_state'))).toBeNull();
  });
});
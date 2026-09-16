import { test, expect } from '@playwright/test';

test.describe('Stage 1', () => {
  test('Stage 1 renders with witnesses and amulet bar', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');

    // Complete the intro/onboarding flow if needed
    // Step 1: Click 'Iniciar aventura' to begin
    await page.click('#btn-start');

    // Step 2: Click 'Unirse a la Aventura' in the onboarding story step
    await page.click('#btn-join-adventure');

    // Step 3: Enter team name and confirm
    await page.fill('#team-name-input', 'Detectives de Barcino');
    await page.click('#btn-confirm-name');

    // Now on Stage 1 screen
    // Assert the 3 witness cards (by their names) are visible
    await expect(page.getByText('Lluís Domènech i Montaner')).toBeVisible();
    await expect(page.getByText('Músico despistado')).toBeVisible();
    await expect(page.getByText('Agente Encubierto')).toBeVisible();

    // Assert the amulet bar with 5 gem slots is present in #global-ui
    const amuletBar = page.locator('#global-ui #amulet-bar');
    await expect(amuletBar).toBeVisible();
    await expect(amuletBar.locator('.gem-slot')).toHaveCount(5);
  });

  test('Liar witness shows warning, true witness unlocks puzzle', async ({ page }) => {
    // Navigate and complete onboarding
    await page.goto('/');
    await page.click('#btn-start');
    await page.click('#btn-join-adventure');
    await page.fill('#team-name-input', 'Detectives de Barcino');
    await page.click('#btn-confirm-name');

    // Click the 'Agente Encubierto' (liar) witness button
    // Witness cards are in .witness-card; find the card containing 'Agente Encubierto'
    // and click its 'Interrogate' button.
    const liarCard = page.locator('.witness-card').filter({ hasText: 'Agente Encubierto' });
    await liarCard.locator('.cta-button').click();

    // Assert a warning message appears (text contains 'no es fiable')
    await expect(page.getByText(/no es fiable/)).toBeVisible();

    // Click the 'Lluís Domènech i Montaner' (true) witness button
    const trueCard = page.locator('.witness-card').filter({ hasText: 'Lluís Domènech i Montaner' });
    await trueCard.locator('.cta-button').click();

    // Assert the screen transitions to the observation puzzle phase
    // (assert the observation question text is visible)
    await expect(page.getByText('Observad la gran escultura en la esquina de la fachada principal')).toBeVisible();
  });

  test('Correct puzzle answer awards gem and highlights amulet', async ({ page }) => {
    // Navigate and complete onboarding
    await page.goto('/');
    await page.click('#btn-start');
    await page.click('#btn-join-adventure');
    await page.fill('#team-name-input', 'Detectives de Barcino');
    await page.click('#btn-confirm-name');

    // Click the true witness to reach the observation puzzle
    const trueCard = page.locator('.witness-card').filter({ hasText: 'Lluís Domènech i Montaner' });
    await trueCard.locator('.cta-button').click();

    // Select the correct option (index 0: 'Una figura hembra alegórica...')
    await page.getByLabel(/Una figura hembra alegórica/).check();

    // Assert the gem unlocked modal appears
    await expect(page.locator('#gem-unlocked-modal')).toBeVisible();

    // Click 'Continuar' in the modal to award the gem
    await page.locator('#gem-unlocked-modal .cta-button').click();

    // Assert the first gem slot (data-index='0') has class 'collected'
    const firstGemSlot = page.locator('#amulet-bar .gem-slot[data-index="0"]');
    await expect(firstGemSlot).toHaveClass(/collected/);

    // Assert gameState.gems[0] is true
    const gems = await page.evaluate(() => JSON.parse(localStorage.getItem('barcino_game_state')).gems);
    expect(gems[0]).toBe(true);
  });
});
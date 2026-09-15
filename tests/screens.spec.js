import { test, expect } from '@playwright/test';

/**
 * Attaches console-error and page-error listeners to the given page and
 * returns an array that the test can assert against to fail on errors.
 */
function collectErrors(page) {
  const errors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push('[console] ' + message.text());
    }
  });
  page.on('pageerror', (error) => {
    errors.push('[pageerror] ' + (error.message || String(error)));
  });
  return errors;
}

test.describe('screen transitions', () => {
  // All three tests share a single page so that game state (localStorage)
  // persists across tests, mirroring a real user session.
  let sharedPage;

  test.beforeAll(async ({ browser }) => {
    sharedPage = await browser.newPage();
  });

  test.afterAll(async () => {
    await sharedPage.close();
  });

  test('01 Intro Screen — start button transitions to team registration', async () => {
    const errors = collectErrors(sharedPage);

    await sharedPage.goto('/', { waitUntil: 'networkidle' });
    expect(errors).toEqual([]);

    await sharedPage.click('#btn-start');
    await expect(sharedPage.locator('#input-team-name')).toBeVisible();

    expect(errors).toEqual([]);
  });

  test('02 Team Registration Screen — validation blocks empty name and valid name advances to Mission 0', async () => {
    const errors = collectErrors(sharedPage);

    await expect(sharedPage.locator('#input-team-name')).toBeVisible();

    // Empty submission must be rejected and show an inline error.
    await sharedPage.click('#btn-confirm-team');
    await expect(sharedPage.locator('#team-name-error')).toHaveText(
      'El nombre debe tener al menos 3 caracteres'
    );
    await expect(sharedPage.locator('#input-team-name')).toBeVisible();

    // Valid submission must advance to Mission 0 and personalise the parchment.
    await sharedPage.fill('#input-team-name', 'Detectives de Barcino');
    await sharedPage.click('#btn-confirm-team');
    await expect(sharedPage.locator('.parchment-content')).toBeVisible();
    await expect(sharedPage.locator('#btn-arrived-passatge')).toBeVisible();
    await expect(sharedPage.locator('.parchment-text')).toContainText('Detectives de Barcino');

    expect(errors).toEqual([]);
  });

  test('03 Mission 0 Screen & Persistence — state survives a page reload', async () => {
    const errors = collectErrors(sharedPage);

    await expect(sharedPage.locator('.parchment-content')).toBeVisible();
    await expect(sharedPage.locator('.parchment-text')).toContainText('Detectives de Barcino');

    const persistedBefore = await sharedPage.evaluate(() =>
      localStorage.getItem('barcino_game_state')
    );
    expect(persistedBefore).not.toBeNull();

    await sharedPage.reload({ waitUntil: 'networkidle' });

    // State must be restored to Mission 0 (not Intro) after reload.
    await expect(sharedPage.locator('#btn-arrived-passatge')).toBeVisible();
    await expect(sharedPage.locator('.parchment-text')).toContainText('Detectives de Barcino');

    const persistedAfter = await sharedPage.evaluate(() =>
      localStorage.getItem('barcino_game_state')
    );
    expect(persistedAfter).not.toBeNull();

    expect(errors).toEqual([]);
  });

  test('04 Audio Toggle — present in DOM on page reload', async () => {
    const errors = collectErrors(sharedPage);

    await sharedPage.goto('/', { waitUntil: 'networkidle' });
    await expect(sharedPage.locator('#btn-audio-toggle')).toHaveCount(1);

    expect(errors).toEqual([]);
  });

  test('05 Audio Toggle — remains visible through onboarding screens', async () => {
    const errors = collectErrors(sharedPage);

    // Reset to intro screen for a clean onboarding flow.
    await sharedPage.evaluate(() => localStorage.removeItem('barcino_game_state'));
    await sharedPage.goto('/', { waitUntil: 'networkidle' });

    await sharedPage.click('#btn-start');
    await sharedPage.fill('#input-team-name', 'Detectives de Barcino');
    await sharedPage.click('#btn-confirm-team');

    await expect(sharedPage.locator('#btn-audio-toggle')).toBeVisible();

    expect(errors).toEqual([]);
  });

  test('06 Audio Toggle — persists across page reload', async () => {
    const errors = collectErrors(sharedPage);

    await expect(sharedPage.locator('#btn-audio-toggle')).toBeVisible();

    await sharedPage.reload({ waitUntil: 'networkidle' });
    await expect(sharedPage.locator('#btn-audio-toggle')).toBeVisible();
    await expect(sharedPage.locator('#btn-audio-toggle')).toHaveCount(1);

    expect(errors).toEqual([]);
  });
});

test.describe('parchment containment', () => {
  test('child elements are contained within parchment-content across viewports', async ({ browser }) => {
    const viewports = [320, 480, 768, 1024];
    const tolerance = 2;

    for (const width of viewports) {
      // Fresh context + page per viewport to avoid state leakage.
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.setViewportSize({ width, height: 900 });

      // Start from the intro screen.
      await page.goto('/', { waitUntil: 'networkidle' });
      await page.waitForSelector('#btn-start', { state: 'visible' });
      await page.click('#btn-start');

      // Team Registration Screen — assert containment of input and confirm button.
      await expect(page.locator('#input-team-name')).toBeVisible();

      const parchmentBox = await page.locator('.parchment-content').boundingBox();
      const inputBox = await page.locator('#input-team-name').boundingBox();
      const confirmBox = await page.locator('#btn-confirm-team').boundingBox();

      expect(parchmentBox).not.toBeNull();
      expect(inputBox).not.toBeNull();
      expect(confirmBox).not.toBeNull();

      // #input-team-name must be fully inside .parchment-content.
      expect(inputBox.x).toBeGreaterThanOrEqual(parchmentBox.x - tolerance);
      expect(inputBox.y).toBeGreaterThanOrEqual(parchmentBox.y - tolerance);
      expect(inputBox.x + inputBox.width).toBeLessThanOrEqual(parchmentBox.x + parchmentBox.width + tolerance);
      expect(inputBox.y + inputBox.height).toBeLessThanOrEqual(parchmentBox.y + parchmentBox.height + tolerance);

      // #btn-confirm-team must be fully inside .parchment-content.
      expect(confirmBox.x).toBeGreaterThanOrEqual(parchmentBox.x - tolerance);
      expect(confirmBox.y).toBeGreaterThanOrEqual(parchmentBox.y - tolerance);
      expect(confirmBox.x + confirmBox.width).toBeLessThanOrEqual(parchmentBox.x + parchmentBox.width + tolerance);
      expect(confirmBox.y + confirmBox.height).toBeLessThanOrEqual(parchmentBox.y + parchmentBox.height + tolerance);

      // Advance to Mission 0.
      await page.fill('#input-team-name', 'Detectives de Barcino');
      await page.click('#btn-confirm-team');

      // Mission 0 Screen — assert containment of .parchment-text.
      await expect(page.locator('.parchment-text')).toBeVisible();

      const missionParchmentBox = await page.locator('.parchment-content').boundingBox();
      const textbox = await page.locator('.parchment-text').boundingBox();

      expect(missionParchmentBox).not.toBeNull();
      expect(textbox).not.toBeNull();

      expect(textbox.x).toBeGreaterThanOrEqual(missionParchmentBox.x - tolerance);
      expect(textbox.y).toBeGreaterThanOrEqual(missionParchmentBox.y - tolerance);
      expect(textbox.x + textbox.width).toBeLessThanOrEqual(missionParchmentBox.x + missionParchmentBox.width + tolerance);
      expect(textbox.y + textbox.height).toBeLessThanOrEqual(missionParchmentBox.y + missionParchmentBox.height + tolerance);

      await context.close();
    }
  });
});


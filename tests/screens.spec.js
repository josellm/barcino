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

    await sharedPage.goto('http://localhost:8080', { waitUntil: 'networkidle' });
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
    await expect(sharedPage.locator('#btn-arrived-palau')).toBeVisible();
    await expect(sharedPage.locator('.parchment-text')).toContainText('Detectives de Barcino');

    expect(errors).toEqual([]);
  });

  test('03 Mission 0 Screen & Persistence — state survives a page reload', async () => {
    const errors = collectErrors(sharedPage);

    await expect(sharedPage.locator('.parchment-text')).toContainText('Detectives de Barcino');

    const persistedBefore = await sharedPage.evaluate(() =>
      localStorage.getItem('barcino_game_state')
    );
    expect(persistedBefore).not.toBeNull();

    await sharedPage.reload({ waitUntil: 'networkidle' });

    // State must be restored to Mission 0 (not Intro) after reload.
    await expect(sharedPage.locator('#btn-arrived-palau')).toBeVisible();
    await expect(sharedPage.locator('.parchment-text')).toContainText('Detectives de Barcino');

    const persistedAfter = await sharedPage.evaluate(() =>
      localStorage.getItem('barcino_game_state')
    );
    expect(persistedAfter).not.toBeNull();

    expect(errors).toEqual([]);
  });
});


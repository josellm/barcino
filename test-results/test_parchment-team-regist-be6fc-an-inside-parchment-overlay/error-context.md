# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: test_parchment.spec.ts >> team registration error handling >> invalid characters show .error span inside parchment overlay
- Location: tests/test_parchment.spec.ts:31:3

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:8080/
Call log:
  - navigating to "http://localhost:8080/", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('parchment scrollability and containment', () => {
  4  |   test('.parchment-content has scrollable overflow and stays within .scene-container', async ({ page }) => {
  5  |     await page.goto('/');
  6  |     await page.click('#btn-start');
  7  |     await page.click('#btn-join-adventure');
  8  |     await expect(page.locator('#team-name-input')).toBeVisible();
  9  | 
  10 |     // Verify overflow-y is set to auto or scroll on .parchment-content.
  11 |     const overflowY = await page.locator('.parchment-content').evaluate((el) => {
  12 |       return window.getComputedStyle(el).overflowY;
  13 |     });
  14 |     expect(['auto', 'scroll']).toContain(overflowY);
  15 | 
  16 |     // Verify .parchment-content bounding box does not extend beyond .scene-container.
  17 |     const parchmentBox = await page.locator('.parchment-content').boundingBox();
  18 |     const sceneBox = await page.locator('.scene-container').boundingBox();
  19 | 
  20 |     expect(parchmentBox).not.toBeNull();
  21 |     expect(sceneBox).not.toBeNull();
  22 | 
  23 |     expect(parchmentBox.x).toBeGreaterThanOrEqual(sceneBox.x - 2);
  24 |     expect(parchmentBox.y).toBeGreaterThanOrEqual(sceneBox.y - 2);
  25 |     expect(parchmentBox.x + parchmentBox.width).toBeLessThanOrEqual(sceneBox.x + sceneBox.width + 2);
  26 |     expect(parchmentBox.y + parchmentBox.height).toBeLessThanOrEqual(sceneBox.y + sceneBox.height + 2);
  27 |   });
  28 | });
  29 | 
  30 | test.describe('team registration error handling', () => {
  31 |   test('invalid characters show .error span inside parchment overlay', async ({ page }) => {
> 32 |     await page.goto('/');
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:8080/
  33 |     await page.click('#btn-start');
  34 |     await page.click('#btn-join-adventure');
  35 |     await expect(page.locator('#team-name-input')).toBeVisible();
  36 | 
  37 |     // Fill with invalid characters (less than 3 chars triggers validation error).
  38 |     await page.fill('#team-name-input', 'a');
  39 |     await page.click('#btn-confirm-name');
  40 | 
  41 |     // The .error span must be visible and positioned inside .parchment-content.
  42 |     const errorSpan = page.locator('#team-name-error');
  43 |     await expect(errorSpan).toBeVisible();
  44 |     await expect(errorSpan).toHaveText('El nombre debe tener al menos 3 caracteres');
  45 | 
  46 |     const errorBox = await errorSpan.boundingBox();
  47 |     const parchmentBox = await page.locator('.parchment-content').boundingBox();
  48 | 
  49 |     expect(errorBox).not.toBeNull();
  50 |     expect(parchmentBox).not.toBeNull();
  51 | 
  52 |     expect(errorBox.x).toBeGreaterThanOrEqual(parchmentBox.x - 2);
  53 |     expect(errorBox.y).toBeGreaterThanOrEqual(parchmentBox.y - 2);
  54 |     expect(errorBox.x + errorBox.width).toBeLessThanOrEqual(parchmentBox.x + parchmentBox.width + 2);
  55 |     expect(errorBox.y + errorBox.height).toBeLessThanOrEqual(parchmentBox.y + parchmentBox.height + 2);
  56 |   });
  57 | });
  58 | 
  59 | test.describe('maps button containment', () => {
  60 |   test('.btn-maps link is within parchment bounds', async ({ page }) => {
  61 |     await page.goto('/');
  62 |     await page.click('#btn-start');
  63 |     await page.click('#btn-join-adventure');
  64 | 
  65 |     // Register a valid team to advance to Mission 0 where .btn-maps appears.
  66 |     await page.fill('#team-name-input', 'Detectives de Barcino');
  67 |     await page.click('#btn-confirm-name');
  68 | 
  69 |     await expect(page.locator('.btn-maps')).toBeVisible();
  70 | 
  71 |     const mapsBox = await page.locator('.btn-maps').boundingBox();
  72 |     const parchmentBox = await page.locator('.parchment-content').boundingBox();
  73 | 
  74 |     expect(mapsBox).not.toBeNull();
  75 |     expect(parchmentBox).not.toBeNull();
  76 | 
  77 |     expect(mapsBox.x).toBeGreaterThanOrEqual(parchmentBox.x - 2);
  78 |     expect(mapsBox.y).toBeGreaterThanOrEqual(parchmentBox.y - 2);
  79 |     expect(mapsBox.x + mapsBox.width).toBeLessThanOrEqual(parchmentBox.x + parchmentBox.width + 2);
  80 |     expect(mapsBox.y + mapsBox.height).toBeLessThanOrEqual(parchmentBox.y + parchmentBox.height + 2);
  81 |   });
  82 | });
```
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/app-load.spec.js >> app-load smoke test >> loads the app without errors and renders the #app root
- Location: tests/app-load.spec.js:4:3

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 3

- Array []
+ Array [
+   [SyntaxError: The requested module './gameState.js' does not provide an export named 'advanceStage'],
+ ]
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - heading "El amuleto del tiempo" [level=1] [ref=e3]
  - contentinfo
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('app-load smoke test', () => {
  4  |   test('loads the app without errors and renders the #app root', async ({ page }) => {
  5  |     const errors = [];
  6  | 
  7  |     // Collect runtime errors that would indicate failed module imports or script failures.
  8  |     page.on('pageerror', (error) => errors.push(error));
  9  |     page.on('consoleerror', (message) => errors.push(message));
  10 | 
  11 |     await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });
  12 | 
  13 |     // No runtime errors should have been emitted during load.
> 14 |     expect(errors).toEqual([]);
     |                    ^ Error: expect(received).toEqual(expected) // deep equality
  15 | 
  16 |     // The start button must be present and clickable.
  17 |     await expect(page.locator('#btn-start')).toBeVisible();
  18 |     await page.click('#btn-start');
  19 | 
  20 |     // After starting, the #app root element must contain rendered child elements.
  21 |     await expect(page.locator('#app')).not.toBeEmpty();
  22 |     expect(await page.locator('#app').count()).toBeGreaterThan(0);
  23 |     expect(
  24 |       await page.evaluate(() => document.querySelector('#app').children.length)
  25 |     ).toBeGreaterThan(0);
  26 |   });
  27 | });
```
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: app-load.spec.js >> app-load smoke test >> loads the app without errors and renders the #app root
- Location: tests/app-load.spec.js:4:3

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 3

- Array []
+ Array [
+   [ReferenceError: mountAmuletBar is not defined],
+ ]
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner:
    - button "Toggle Audio" [ref=e2] [cursor=pointer]: 🔊
  - main [ref=e3]:
    - main [ref=e4]:
      - generic [ref=e5]:
        - img "Intro background"
        - toolbar "Story start actions" [ref=e6]:
          - button "Iniciar aventura" [ref=e7] [cursor=pointer]
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
  11 |     await page.goto('/', { waitUntil: 'networkidle' });
  12 | 
  13 |     // No runtime errors should have been emitted during load.
> 14 |     expect(errors).toEqual([]);
     |                    ^ Error: expect(received).toEqual(expected) // deep equality
  15 | 
  16 |     // The intro screen must appear before the onboarding flow.
  17 |     await expect(page.locator('#btn-start')).toBeVisible();
  18 |     await page.click('#btn-start');
  19 |     await expect(page.locator('#btn-join-adventure')).toBeVisible();
  20 |     await page.click('#btn-join-adventure');
  21 | 
  22 |     // After starting, the #app root element must contain rendered child elements.
  23 |     await expect(page.locator('#app')).not.toBeEmpty();
  24 |     expect(await page.locator('#app').count()).toBeGreaterThan(0);
  25 |     expect(
  26 |       await page.evaluate(() => document.querySelector('#app').children.length)
  27 |     ).toBeGreaterThan(0);
  28 |   });
  29 | });
```
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: screens.spec.js >> screen transitions >> 05 Parchment overlay — rendered and dismissible after clicking ¡Estamos en el Passatge!
- Location: tests/screens.spec.js:87:3

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:8080/
Call log:
  - navigating to "http://localhost:8080/", waiting until "networkidle"

```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('screen transitions', () => {
  4   |   test('01 Onboarding Flow — join adventure button transitions to team registration', async ({ page }) => {
  5   |     const errors = [];
  6   |     page.on('pageerror', (error) => errors.push(error));
  7   |     page.on('consoleerror', (message) => errors.push(message));
  8   | 
  9   |     await page.goto('/', { waitUntil: 'networkidle' });
  10  |     expect(errors).toEqual([]);
  11  | 
  12  |     // Onboarding step 1: intro with join-adventure button.
  13  |     await expect(page.locator('#btn-start')).toBeVisible();
  14  |     await page.click('#btn-start');
  15  |     await expect(page.locator('#btn-join-adventure')).toBeVisible();
  16  |     await page.click('#btn-join-adventure');
  17  | 
  18  |     // Onboarding step 2: team name input and confirm button.
  19  |     await expect(page.locator('#team-name-input')).toBeVisible();
  20  |     await expect(page.locator('#btn-confirm-name')).toBeVisible();
  21  |   });
  22  | 
  23  |   test('02 Team Registration Screen — validation blocks empty name and valid name advances to Mission 0', async ({ page }) => {
  24  |     const errors = [];
  25  |     page.on('pageerror', (error) => errors.push(error));
  26  |     page.on('consoleerror', (message) => errors.push(message));
  27  | 
  28  |     await page.goto('/', { waitUntil: 'networkidle' });
  29  |     expect(errors).toEqual([]);
  30  | 
  31  |     // Advance to team registration step.
  32  |     await page.click('#btn-start');
  33  |     await page.click('#btn-join-adventure');
  34  | 
  35  |     // Try submitting empty name — should stay on step 2.
  36  |     await page.click('#btn-confirm-name');
  37  |     await expect(page.locator('#team-name-input')).toBeVisible();
  38  | 
  39  |     // Enter valid name and confirm.
  40  |     await page.fill('#team-name-input', 'Los Viajeros');
  41  |     await page.click('#btn-confirm-name');
  42  | 
  43  |     // Should advance to Mission 0 screen.
  44  |     await expect(page.locator('#mission0-screen')).toBeVisible();
  45  |     await expect(page.locator('#mission0-title')).toContainText('Misión 0: El amuleto del tiempo');
  46  |   });
  47  | 
  48  |   test('03 Mission 0 Screen & Persistence — state survives a page reload', async ({ page }) => {
  49  |     const errors = [];
  50  |     page.on('pageerror', (error) => errors.push(error));
  51  |     page.on('consoleerror', (message) => errors.push(message));
  52  | 
  53  |     await page.goto('/', { waitUntil: 'networkidle' });
  54  |     expect(errors).toEqual([]);
  55  | 
  56  |     // Advance to Mission 0.
  57  |     await page.click('#btn-start');
  58  |     await page.click('#btn-join-adventure');
  59  |     await page.fill('#team-name-input', 'Los Viajeros');
  60  |     await page.click('#btn-confirm-name');
  61  |     await expect(page.locator('#mission0-screen')).toBeVisible();
  62  | 
  63  |     // Reload — state should persist via localStorage.
  64  |     await page.reload({ waitUntil: 'networkidle' });
  65  |     expect(errors).toEqual([]);
  66  | 
  67  |     // Should still be on Mission 0 screen.
  68  |     await expect(page.locator('#mission0-screen')).toBeVisible();
  69  |   });
  70  | 
  71  |   test('04 Audio Toggle — present in DOM on page reload', async ({ page }) => {
  72  |     const errors = [];
  73  |     page.on('pageerror', (error) => errors.push(error));
  74  |     page.on('consoleerror', (message) => errors.push(message));
  75  | 
  76  |     await page.goto('/', { waitUntil: 'networkidle' });
  77  |     expect(errors).toEqual([]);
  78  | 
  79  |     await expect(page.locator('#btn-audio-toggle')).toBeVisible();
  80  | 
  81  |     await page.reload({ waitUntil: 'networkidle' });
  82  |     expect(errors).toEqual([]);
  83  | 
  84  |     await expect(page.locator('#btn-audio-toggle')).toBeVisible();
  85  |   });
  86  | 
  87  |   test('05 Parchment overlay — rendered and dismissible after clicking ¡Estamos en el Passatge!', async ({ page }) => {
  88  |     const errors = [];
  89  |     page.on('pageerror', (error) => errors.push(error));
  90  |     page.on('consoleerror', (message) => errors.push(message));
  91  | 
> 92  |     await page.goto('/', { waitUntil: 'networkidle' });
      |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:8080/
  93  |     expect(errors).toEqual([]);
  94  | 
  95  |     // Advance to Mission 0.
  96  |     await page.click('#btn-start');
  97  |     await page.click('#btn-join-adventure');
  98  |     await page.fill('#team-name-input', 'Los Viajeros');
  99  |     await page.click('#btn-confirm-name');
  100 |     await expect(page.locator('#mission0-screen')).toBeVisible();
  101 | 
  102 |     // Parchment overlay should be visible.
  103 |     await expect(page.locator('#parchment-overlay')).toBeVisible();
  104 | 
  105 |     // Click the dismiss button.
  106 |     await page.click('#btn-estamos-en-el-passatge');
  107 | 
  108 |     // Overlay should be hidden after dismissal.
  109 |     await expect(page.locator('#parchment-overlay')).not.toBeVisible();
  110 |   });
  111 | });
  112 | 
```
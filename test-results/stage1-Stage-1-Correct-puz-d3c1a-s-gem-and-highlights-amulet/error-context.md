# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: stage1.spec.js >> Stage 1 >> Correct puzzle answer awards gem and highlights amulet
- Location: tests/stage1.spec.js:57:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('.witness-card').filter({ hasText: 'Lluís Domènech i Montaner' }).locator('.cta-button')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner:
    - button "Toggle Audio" [ref=e2] [cursor=pointer]: 🔊
    - generic:
      - generic: 💎
      - generic: 💎
      - generic: 💎
      - generic: 💎
      - generic: 💎
  - main [ref=e3]:
    - main [ref=e4]:
      - generic [ref=e6]:
        - 'heading "Misión 0: El amuleto del tiempo" [level=2] [ref=e7]'
        - paragraph [ref=e8]: "¡Excelente, function onMission0Complete() { advanceStage(); render(); }! El primer rastro nos lleva a la entrada del Passatge de les Manufactures. Diríos allí para adentraros en el paso hacia el Palau..."
        - link "Ver ubicación en Google Maps" [ref=e9] [cursor=pointer]:
          - /url: https://maps.google.com/?q=Passatge+de+les+Manufactures+Barcelona
        - button "¡Estamos en el Passatge!" [ref=e10] [cursor=pointer]
      - generic [ref=e12]:
        - paragraph [ref=e13]: El Scribe te invita a abrir el mapa y marcar el camino hacia el Passatge de les Manufactures.
        - button "¡Estamos en el Passatge!" [ref=e14] [cursor=pointer]
  - contentinfo
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Stage 1', () => {
  4  |   test('Stage 1 renders with witnesses and amulet bar', async ({ page }) => {
  5  |     // Navigate to the app
  6  |     await page.goto('/');
  7  | 
  8  |     // Complete the intro/onboarding flow if needed
  9  |     // Step 1: Click 'Iniciar aventura' to begin
  10 |     await page.click('#btn-start');
  11 | 
  12 |     // Step 2: Click 'Unirse a la Aventura' in the onboarding story step
  13 |     await page.click('#btn-join-adventure');
  14 | 
  15 |     // Step 3: Enter team name and confirm
  16 |     await page.fill('#team-name-input', 'Detectives de Barcino');
  17 |     await page.click('#btn-confirm-name');
  18 | 
  19 |     // Now on Stage 1 screen
  20 |     // Assert the 3 witness cards (by their names) are visible
  21 |     await expect(page.getByText('Lluís Domènech i Montaner')).toBeVisible();
  22 |     await expect(page.getByText('Músico despistado')).toBeVisible();
  23 |     await expect(page.getByText('Agente Encubierto')).toBeVisible();
  24 | 
  25 |     // Assert the amulet bar with 5 gem slots is present in #global-ui
  26 |     const amuletBar = page.locator('#global-ui #amulet-bar');
  27 |     await expect(amuletBar).toBeVisible();
  28 |     await expect(amuletBar.locator('.gem-slot')).toHaveCount(5);
  29 |   });
  30 | 
  31 |   test('Liar witness shows warning, true witness unlocks puzzle', async ({ page }) => {
  32 |     // Navigate and complete onboarding
  33 |     await page.goto('/');
  34 |     await page.click('#btn-start');
  35 |     await page.click('#btn-join-adventure');
  36 |     await page.fill('#team-name-input', 'Detectives de Barcino');
  37 |     await page.click('#btn-confirm-name');
  38 | 
  39 |     // Click the 'Agente Encubierto' (liar) witness button
  40 |     // Witness cards are in .witness-card; find the card containing 'Agente Encubierto'
  41 |     // and click its 'Interrogate' button.
  42 |     const liarCard = page.locator('.witness-card').filter({ hasText: 'Agente Encubierto' });
  43 |     await liarCard.locator('.cta-button').click();
  44 | 
  45 |     // Assert a warning message appears (text contains 'no es fiable')
  46 |     await expect(page.getByText(/no es fiable/)).toBeVisible();
  47 | 
  48 |     // Click the 'Lluís Domènech i Montaner' (true) witness button
  49 |     const trueCard = page.locator('.witness-card').filter({ hasText: 'Lluís Domènech i Montaner' });
  50 |     await trueCard.locator('.cta-button').click();
  51 | 
  52 |     // Assert the screen transitions to the observation puzzle phase
  53 |     // (assert the observation question text is visible)
  54 |     await expect(page.getByText('Observad la gran escultura en la esquina de la fachada principal')).toBeVisible();
  55 |   });
  56 | 
  57 |   test('Correct puzzle answer awards gem and highlights amulet', async ({ page }) => {
  58 |     // Navigate and complete onboarding
  59 |     await page.goto('/');
  60 |     await page.click('#btn-start');
  61 |     await page.click('#btn-join-adventure');
  62 |     await page.fill('#team-name-input', 'Detectives de Barcino');
  63 |     await page.click('#btn-confirm-name');
  64 | 
  65 |     // Click the true witness to reach the observation puzzle
  66 |     const trueCard = page.locator('.witness-card').filter({ hasText: 'Lluís Domènech i Montaner' });
> 67 |     await trueCard.locator('.cta-button').click();
     |                                           ^ Error: locator.click: Test timeout of 30000ms exceeded.
  68 | 
  69 |     // Select the correct option (index 0: 'Una figura hembra alegórica...')
  70 |     await page.getByLabel(/Una figura hembra alegórica/).check();
  71 | 
  72 |     // Assert the gem unlocked modal appears
  73 |     await expect(page.locator('#gem-unlocked-modal')).toBeVisible();
  74 | 
  75 |     // Click 'Continuar' in the modal to award the gem
  76 |     await page.locator('#gem-unlocked-modal .cta-button').click();
  77 | 
  78 |     // Assert the first gem slot (data-index='0') has class 'collected'
  79 |     const firstGemSlot = page.locator('#amulet-bar .gem-slot[data-index="0"]');
  80 |     await expect(firstGemSlot).toHaveClass(/collected/);
  81 | 
  82 |     // Assert gameState.gems[0] is true
  83 |     const gems = await page.evaluate(() => JSON.parse(localStorage.getItem('barcino_game_state')).gems);
  84 |     expect(gems[0]).toBe(true);
  85 |   });
  86 | });
```
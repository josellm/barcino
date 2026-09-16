import { getGameState } from '../gameState.js';

/**
 * AmuletBar — renders a bar of 5 gem slots inside the #global-ui header.
 *
 * Each slot displays a gem icon (💎) and gains the 'collected' class when
 * the corresponding entry in gameState.gems is true. The bar re-renders
 * itself whenever the gem collection state changes.
 */

/**
 * Build and return the amulet bar <div> element.
 *
 * @returns {HTMLElement} the <div id='amulet-bar'> element containing
 *   five <div class='gem-slot'> children.
 */
function renderAmuletBar() {
  const bar = document.createElement('div');
  bar.id = 'amulet-bar';

  const state = getGameState();

  for (let i = 0; i < 5; i++) {
    const slot = document.createElement('div');
    slot.className = 'gem-slot';
    if (state.gems[i]) {
      slot.classList.add('collected');
    }
    slot.dataset.index = String(i);

    const icon = document.createElement('span');
    icon.className = 'gem-icon';
    icon.textContent = '💎';

    slot.appendChild(icon);
    bar.appendChild(slot);
  }

  return bar;
}

/**
 * Insert the amulet bar into the #global-ui header and keep it up to date
 * whenever the gem collection state changes.
 *
 * The component reads the current state via getGameState() and re-renders
 * the entire bar on every call so the 'collected' classes always reflect
 * the latest state.
 */
function mountAmuletBar() {
  const header = document.querySelector('#global-ui');
  if (!header) {
    console.warn('AmuletBar: #global-ui header element not found.');
    return;
  }

  // Remove any previously mounted bar so re-mounting is idempotent.
  const existing = header.querySelector('#amulet-bar');
  if (existing) {
    existing.remove();
  }

  header.appendChild(renderAmuletBar());
}

export { renderAmuletBar, mountAmuletBar };
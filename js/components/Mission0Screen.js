/**
 * Mission0Screen — builds the first mission screen DOM for Barcino.
 *
 * Renders the mission 0 screen with a parchment frame containing the
 * mission briefing text, a Google Maps link, and an "arrived" button.
 */

/**
 * Build and return the mission 0 screen <main> element.
 *
 * @param {string} teamName — the team's name to personalise the greeting.
 *   Fallback to a generic greeting when null or empty.
 * @param {Function} onArrivedCallback — invoked when the user clicks
 *   the "¡Estamos en el Passatge!" button.
 * @returns {HTMLElement} the <main id='mission0-screen'> element.
 */
function renderMission0Screen(teamName, onArrivedCallback) {
  const main = document.createElement('main');
  main.id = 'mission0-screen';

  const scene = document.createElement('div');
  scene.className = 'scene-container';

  const parchmentContent = document.createElement('div');
  parchmentContent.className = 'parchment-content';

  const title = document.createElement('h2');
  title.id = 'mission0-title';
  title.textContent = 'Misión 0: El amuleto del tiempo';

  const text = document.createElement('p');
  text.className = 'parchment-text';
  const greeting = teamName
    ? '¡Excelente, ' + teamName + '! El primer rastro nos lleva a la entrada del Passatge de les Manufactures. Diríos allí para adentraros en el paso hacia el Palau...'
    : '¡Excelente! El primer rastro nos lleva a la entrada del Passatge de les Manufactures. Diríos allí para adentraros en el paso hacia el Palau...';
  text.textContent = greeting;

  const mapsLink = document.createElement('a');
  mapsLink.className = 'btn-maps';
  mapsLink.href = 'https://maps.google.com/?q=Passatge+de+les+Manufactures+Barcelona';
  mapsLink.target = '_blank';
  mapsLink.rel = 'noopener noreferrer';
  mapsLink.textContent = 'Ver ubicación en Google Maps';

  const btnArrived = document.createElement('button');
  btnArrived.id = 'btn-arrived-passatge';
  btnArrived.type = 'button';
  btnArrived.className = 'cta-button';
  btnArrived.textContent = '¡Estamos en el Passatge!';

  btnArrived.addEventListener('click', (e) => {
    e.preventDefault();
    if (typeof onArrivedCallback === 'function') {
      onArrivedCallback();
    }
  });

  parchmentContent.appendChild(title);
  parchmentContent.appendChild(text);
  parchmentContent.appendChild(mapsLink);
  parchmentContent.appendChild(btnArrived);

  // Parchment overlay backdrop — rendered on top of the mission scene.
  const overlay = document.createElement('div');
  overlay.id = 'parchment-overlay';
  overlay.className = 'parchment-overlay';

  const overlayContent = document.createElement('div');
  overlayContent.className = 'parchment-overlay-content';
  overlayContent.innerHTML = `
    <p class="parchment-overlay-text">
      El Scribe te invita a abrir el mapa y marcar el camino hacia el Passatge de les Manufactures.
    </p>
  `;

  const btnDismiss = document.createElement('button');
  btnDismiss.id = 'btn-estamos-en-el-passatge';
  btnDismiss.type = 'button';
  btnDismiss.className = 'cta-button';
  btnDismiss.textContent = '¡Estamos en el Passatge!';
  btnDismiss.addEventListener('click', () => {
    overlay.remove();
  });

  overlayContent.appendChild(btnDismiss);
  overlay.appendChild(overlayContent);

  scene.appendChild(parchmentContent);
  main.appendChild(scene);
  main.appendChild(overlay);

  return main;
}

export { renderMission0Screen };
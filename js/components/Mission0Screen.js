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
 *   the "¡Ya estamos frente al Palau!" button.
 * @returns {HTMLElement} the <main id='mission0-screen'> element.
 */
function renderMission0Screen(teamName, onArrivedCallback) {
  const main = document.createElement('main');
  main.id = 'mission0-screen';

  const frame = document.createElement('div');
  frame.className = 'parchment-frame';

  const text = document.createElement('p');
  text.className = 'parchment-text';
  const greeting = teamName
    ? '¡Excelente, ' + teamName + '! El ladrón ha sido visto merodeando cerca de un palacio modernista lleno de música y mosaicos...'
    : '¡Excelente! El ladrón ha sido visto merodeando cerca de un palacio modernista lleno de música y mosaicos...';
  text.textContent = greeting;

  const mapsLink = document.createElement('a');
  mapsLink.className = 'btn-maps';
  mapsLink.href = 'https://maps.google.com/?q=Palau+de+la+Musica+Catalana';
  mapsLink.target = '_blank';
  mapsLink.rel = 'noopener noreferrer';
  mapsLink.textContent = 'Ver ubicación en Google Maps';

  const btnArrived = document.createElement('button');
  btnArrived.id = 'btn-arrived-palau';
  btnArrived.type = 'button';
  btnArrived.className = 'cta-button';
  btnArrived.textContent = '¡Ya estamos frente al Palau!';

  btnArrived.addEventListener('click', (e) => {
    e.preventDefault();
    if (typeof onArrivedCallback === 'function') {
      onArrivedCallback();
    }
  });

  frame.appendChild(text);
  frame.appendChild(mapsLink);
  frame.appendChild(btnArrived);
  main.appendChild(frame);

  return main;
}

export { renderMission0Screen };
/**
 * IntroScreen — builds the starting screen DOM for Barcino.
 *
 * Renders the intro screen with background image, container, and
 * a start button. The audio toggle is intentionally excluded — it
 * lives as a global overlay in index.html.
 */

/**
 * Build and return the intro screen <main> element.
 *
 * @param {Function} onStartCallback — invoked when the user clicks
 *   the "Iniciar aventura" button. The click handler calls
 *   onStartCallback() and prevents default to avoid page reloads.
 * @returns {HTMLElement} the <main id='intro-screen'> element.
 */
function renderIntroScreen(onStartCallback) {
  const main = document.createElement('main');
  main.id = 'intro-screen';

  const bg = document.createElement('img');
  bg.id = 'intro-bg';
  bg.src = 'assets/img/intro-bg.jpg';
  bg.alt = 'Intro background';

  const container = document.createElement('div');
  container.className = 'container';

  const actionBar = document.createElement('div');
  actionBar.className = 'action-bar';
  actionBar.setAttribute('role', 'toolbar');
  actionBar.setAttribute('aria-label', 'Story start actions');

  const btnStart = document.createElement('button');
  btnStart.id = 'btn-start';
  btnStart.type = 'button';
  btnStart.className = 'cta-button';
  btnStart.textContent = 'Iniciar aventura';

  btnStart.addEventListener('click', (e) => {
    e.preventDefault();
    if (typeof onStartCallback === 'function') {
      onStartCallback();
    }
  });

  actionBar.appendChild(btnStart);

  main.appendChild(bg);
  main.appendChild(container);
  main.appendChild(actionBar);

  return main;
}

export { renderIntroScreen };
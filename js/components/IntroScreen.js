/**
 * IntroScreen — builds the starting screen DOM for Barcino.
 *
 * Renders the intro screen with a scene-container backdrop, parchment
 * content overlay, and a start button.
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

  const scene = document.createElement('div');
  scene.className = 'container';

  const bg = document.createElement('img');
  bg.id = 'intro-bg';
  bg.src = 'assets/img/intro-bg.jpg';
  bg.alt = 'Intro background';
  scene.appendChild(bg);

  const ActionBar = document.createElement('div');
  ActionBar.className = 'action-bar';
  ActionBar.setAttribute('role', 'toolbar');
  ActionBar.setAttribute('aria-label', 'Story start actions');

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

  ActionBar.appendChild(btnStart);
  scene.appendChild(ActionBar);
  main.appendChild(scene);

  return main;
}

export { renderIntroScreen };

/**
 * IntroScreen — builds the starting screen DOM for Barcino.
 *
 * Renders the intro screen with a scene-container backdrop, parchment
 * content overlay, and a start button. The audio toggle lives inside the
 * action bar.
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
  scene.className = 'scene-container';

  const parchmentContent = document.createElement('div');
  parchmentContent.className = 'parchment-content';

  const title = document.createElement('h1');
  title.className = 'parchment-text';
  title.textContent = 'El amuleto del tiempo';

  parchmentContent.appendChild(title);
  scene.appendChild(parchmentContent);

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

  const btnAudioToggle = document.createElement('button');
  btnAudioToggle.id = 'btn-audio-toggle';
  btnAudioToggle.type = 'button';
  btnAudioToggle.className = 'audio-toggle';
  btnAudioToggle.setAttribute('aria-label', 'Toggle audio');
  btnAudioToggle.setAttribute('aria-pressed', 'false');

  const audioIcon = document.createElement('span');
  audioIcon.className = 'audio-icon';
  audioIcon.textContent = '🔊';

  btnAudioToggle.appendChild(audioIcon);
  ActionBar.appendChild(btnStart);
  ActionBar.appendChild(btnAudioToggle);

  main.appendChild(scene);
  main.appendChild(ActionBar);

  return main;
}

export { renderIntroScreen };

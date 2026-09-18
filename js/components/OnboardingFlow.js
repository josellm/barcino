/**
 * OnboardingFlow — manages the parchment overlay onboarding for Barcino.
 *
 * Renders an internal step-based flow: Step 1 (Story Intro) presents the
 * Scribe's call to action and a join button; Step 2 collects the team name.
 * The component manages its own step state and delegates team name storage
 * to the host via a callback prop.
 */

/**
 * Build and return the onboarding flow <main> element.
 *
 * The flow manages two internal steps:
 *   - Step 1: Story intro with the Scribe's call to action and the
 *     #btn-join-adventure button.
 *   - Step 2: Team name input with validation and a confirm button.
 *
 * @param {Function} onJoinAdventure — invoked when the user clicks
 *   "Unirse a la Aventura" in Step 1. The host can use this hook to
 *   notify gameState that the adventure has begun.
 * @param {Function} onTeamNameSubmit — invoked with the trimmed team name
 *   when the user submits Step 2. The host stores the name in gameState.
 * @returns {HTMLElement} the <main id='onboarding-flow'> element.
 */
function renderOnboardingFlow(onJoinAdventure, onTeamNameSubmit) {
  let step = 1;

  const main = document.createElement('main');
  main.id = 'onboarding-flow';

  const scene = document.createElement('div');
  scene.className = 'scene-container';

  const parchmentContent = document.createElement('div');
  parchmentContent.className = 'parchment-content';

  // --- Step 1: Story Intro ---
  const step1 = document.createElement('div');
  step1.className = 'onboarding-step';
  step1.id = 'onboarding-step-1';

  const introText = document.createElement('p');
  introText.className = 'parchment-text';
  introText.textContent =
    'En el año de nuestro Señor 1350, el Amuleto de Barcino ha sido robado por El famoso ladrón "El Coleccionista". ' +
    'El escriba convoca a los valientes para recuperar la reliquia y restaurar el equilibrio del tiempo. ' +
    '¿Aceptas esta aventura?';

  const btnJoin = document.createElement('button');
  btnJoin.id = 'btn-join-adventure';
  btnJoin.type = 'button';
  btnJoin.className = 'cta-button';
  btnJoin.textContent = 'Unirse a la Aventura';

  btnJoin.addEventListener('click', (e) => {
    e.preventDefault();
    step = 2;
    renderStep();
    if (typeof onJoinAdventure === 'function') {
      onJoinAdventure();
    }
  });

  step1.appendChild(introText);
  step1.appendChild(btnJoin);

  // --- Step 2: Team Name ---
  const step2 = document.createElement('div');
  step2.className = 'onboarding-step';
  step2.id = 'onboarding-step-2';

  const promptText = document.createElement('p');
  promptText.className = 'parchment-text';
  promptText.textContent = '¿Cómo se llama vuestro equipo de detectives?';

  const teamInput = document.createElement('input');
  teamInput.id = 'team-name-input';
  teamInput.type = 'text';
  teamInput.placeholder = 'Ingresa el nombre de tu equipo';

  const errorSpan = document.createElement('span');
  errorSpan.id = 'team-name-error';
  errorSpan.className = 'error';

  const btnConfirm = document.createElement('button');
  btnConfirm.id = 'btn-confirm-name';
  btnConfirm.type = 'button';
  btnConfirm.className = 'cta-button';
  btnConfirm.textContent = 'Confirmar Equipo';

  btnConfirm.addEventListener('click', () => {
    const name = teamInput.value.trim();
    if (name.length < 3) {
      errorSpan.textContent = 'El nombre debe tener al menos 3 caracteres';
      return;
    }
    errorSpan.textContent = '';
    if (typeof onTeamNameSubmit === 'function') {
      onTeamNameSubmit(name);
    }
  });

  step2.appendChild(promptText);
  step2.appendChild(teamInput);
  step2.appendChild(errorSpan);
  step2.appendChild(btnConfirm);

  function renderStep() {
    parchmentContent.innerHTML = '';
    if (step === 1) {
      parchmentContent.appendChild(step1);
    } else {
      parchmentContent.appendChild(step2);
    }
  }

  renderStep();

  scene.appendChild(parchmentContent);
  main.appendChild(scene);

  return main;
}

export { renderOnboardingFlow };
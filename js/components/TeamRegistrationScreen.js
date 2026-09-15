/**
 * TeamRegistrationScreen — builds the team registration screen DOM for Barcino.
 *
 * Renders a screen with a text input for the team name and a confirm button.
 * The button validates the input and either shows an error or invokes the
 * submission callback.
 */

/**
 * Build and return the team registration screen <main> element.
 *
 * The button click handler reads the input value, trims it, and validates:
 * - If length < 3, displays an error span with id='team-name-error' and text
 *   'El nombre debe tener al menos 3 caracteres', clearing any previous error.
 * - If valid, clears the error span and calls onSubmitCallback(name).
 *
 * @param {Function} onSubmitCallback — invoked with the trimmed team name when
 *   validation passes.
 * @returns {HTMLElement} the <main id='team-registration-screen'> element.
 */
function renderTeamRegistrationScreen(onSubmitCallback) {
  const main = document.createElement('main');
  main.id = 'team-registration-screen';

  const sceneContainer = document.createElement('div');
  sceneContainer.className = 'scene-container';

  const parchmentContent = document.createElement('div');
  parchmentContent.className = 'parchment-content';

  const input = document.createElement('input');
  input.id = 'input-team-name';
  input.type = 'text';
  input.placeholder = 'Ingresa el nombre de tu equipo';

  const errorSpan = document.createElement('span');
  errorSpan.id = 'team-name-error';
  errorSpan.className = 'error';

  const btnConfirm = document.createElement('button');
  btnConfirm.id = 'btn-confirm-team';
  btnConfirm.type = 'button';
  btnConfirm.className = 'cta-button';
  btnConfirm.textContent = 'Confirmar';

  btnConfirm.addEventListener('click', () => {
    const name = input.value.trim();
    if (name.length < 3) {
      errorSpan.textContent = 'El nombre debe tener al menos 3 caracteres';
      return;
    }
    errorSpan.textContent = '';
    if (typeof onSubmitCallback === 'function') {
      onSubmitCallback(name);
    }
  });

  parchmentContent.appendChild(input);
  parchmentContent.appendChild(errorSpan);
  parchmentContent.appendChild(btnConfirm);
  sceneContainer.appendChild(parchmentContent);
  main.appendChild(sceneContainer);

  return main;
}

export { renderTeamRegistrationScreen };


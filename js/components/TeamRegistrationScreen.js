export function renderTeamRegistrationScreen(onSubmit) {
  const screen = document.createElement('div');
  screen.id = 'team-registration-screen';
  screen.className = 'scene-container';

  const parchment = document.createElement('div');
  parchment.className = 'parchment-content';

  const title = document.createElement('h2');
  title.textContent = 'Registra tu equipo';
  parchment.appendChild(title);

  const form = document.createElement('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('team-name-input');
    const name = input.value.trim();
    const errorEl = document.getElementById('team-name-error');
    errorEl.textContent = '';

    if (!name) {
      errorEl.textContent = 'El nombre del equipo no puede estar vacío';
      return;
    }

    if (name.length < 2) {
      errorEl.textContent = 'El nombre debe tener al menos 2 caracteres';
      return;
    }

    if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/.test(name)) {
      errorEl.textContent = 'Solo letras, números y espacios';
      return;
    }

    onSubmit(name);
  });

  const label = document.createElement('label');
  label.textContent = 'Nombre del equipo';
  label.htmlFor = 'team-name-input';

  const input = document.createElement('input');
  input.id = 'team-name-input';
  input.type = 'text';
  input.placeholder = 'Ej: Los Detectives de Barcino';
  input.maxLength = 30;

  const error = document.createElement('span');
  error.id = 'team-name-error';
  error.className = 'error';

  const submitBtn = document.createElement('button');
  submitBtn.id = 'btn-continue';
  submitBtn.type = 'submit';
  submitBtn.textContent = 'Continuar';

  form.appendChild(label);
  form.appendChild(input);
  form.appendChild(error);
  form.appendChild(submitBtn);

  parchment.appendChild(form);
  screen.appendChild(parchment);

  return screen;
}
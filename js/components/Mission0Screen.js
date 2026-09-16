export function renderMission0Screen(onComplete) {
  const screen = document.createElement('div');
  screen.id = 'mission0-screen';
  screen.className = 'scene-container';

  // Witness cards
  const witnesses = [
    { name: 'Lluís Domènech i Montaner', liar: false },
    { name: 'Agente Encubierto', liar: true },
    { name: 'Músico despistado', liar: false }
  ];

  const witnessContainer = document.createElement('div');
  witnessContainer.className = 'witness-container';

  witnesses.forEach((w) => {
    const card = document.createElement('div');
    card.className = 'witness-card';
    card.dataset.name = w.name;

    const nameEl = document.createElement('h3');
    nameEl.textContent = w.name;
    card.appendChild(nameEl);

    const cta = document.createElement('button');
    cta.className = 'cta-button';
    cta.textContent = 'Interrogate';
    cta.addEventListener('click', () => {
      // Reset previous states
      document.querySelectorAll('.witness-card').forEach(c => {
        c.classList.remove('selected', 'liar');
      });

      if (w.liar) {
        card.classList.add('selected', 'liar');
        warningEl.textContent = 'Este testigo no es fiable. Busca otro.';
        warningEl.style.display = 'block';
        puzzleContainer.style.display = 'none';
      } else {
        card.classList.add('selected');
        warningEl.textContent = '';
        warningEl.style.display = 'none';
        puzzleContainer.style.display = 'block';
      }
    });
    card.appendChild(cta);
    witnessContainer.appendChild(card);
  });

  // Warning element
  const warningEl = document.createElement('span');
  warningEl.className = 'warning';
  warningEl.style.display = 'none';

  // Puzzle container
  const puzzleContainer = document.createElement('div');
  puzzleContainer.className = 'puzzle-container';
  puzzleContainer.style.display = 'none';

  const puzzleTitle = document.createElement('h3');
  puzzleTitle.textContent = 'El Enigma de la Amuleta';
  puzzleContainer.appendChild(puzzleTitle);

  const instruction = document.createElement('p');
  instruction.className = 'puzzle-instruction';
  instruction.textContent = 'Una figura hembra alegórica preside el templo. ¿Cuál es la respuesta correcta?';
  puzzleContainer.appendChild(instruction);

  const options = [
    { label: 'Una figura hembra alegórica', value: 'a' },
    { label: 'Lluís Domènech i Montaner', value: 'b' },
    { label: 'Agente Encubierto', value: 'c' }
  ];

  const optionsContainer = document.createElement('div');
  optionsContainer.className = 'puzzle-options';

  options.forEach((opt, idx) => {
    const optEl = document.createElement('div');
    optEl.className = 'puzzle-option';

    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.id = `puzzle-opt-${idx}`;
    radio.name = 'puzzle';
    radio.value = opt.value;

    const label = document.createElement('label');
    label.htmlFor = `puzzle-opt-${idx}`;
    label.textContent = opt.label;

    optEl.appendChild(radio);
    optEl.appendChild(label);
    optionsContainer.appendChild(optEl);
  });

  puzzleContainer.appendChild(optionsContainer);

  const submitBtn = document.createElement('button');
  submitBtn.className = 'puzzle-cta';
  submitBtn.textContent = 'Resolver';
  submitBtn.addEventListener('click', () => {
    const selected = document.querySelector('input[name="puzzle"]:checked');
    if (!selected) return;

    if (selected.value === 'a') {
      gemEl.classList.add('gem-earned');
      const slots = document.querySelectorAll('.amulet-slot');
      if (slots.length > 0) slots[0].classList.add('active');
      const amuletBar = document.getElementById('amulet-bar');
      if (amuletBar) amuletBar.classList.add('active');
      submitBtn.textContent = '¡Correcto!';
      submitBtn.disabled = true;
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 1500);
    } else {
      submitBtn.textContent = 'Incorrecto, inténtalo de nuevo';
    }
  });
  puzzleContainer.appendChild(submitBtn);

  // Gem element
  const gemEl = document.createElement('div');
  gemEl.className = 'gem';

  screen.appendChild(witnessContainer);
  screen.appendChild(warningEl);
  screen.appendChild(gemEl);
  screen.appendChild(puzzleContainer);

  return screen;
}
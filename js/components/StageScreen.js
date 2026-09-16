/**
 * StageScreen — builds the stage interrogation and puzzle screen for Barcino.
 *
 * Renders a three-phase stage view inside a scene-container backdrop:
 *   Phase 1 — Interrogation (witness cards)
 *   Phase 2 — Observation puzzle (multiple-choice)
 *   Phase 3 — Stage complete (gem unlock + transition)
 */

import { addGem } from '../gameState.js';

/**
 * Fetch stage data from the local stages.json file.
 *
 * @param {number} stageNumber — the 1-based stage id to load.
 * @returns {Promise<Object>} the resolved stage data object.
 */
async function loadStageData(stageNumber) {
  const response = await fetch('data/stages.json');
  if (!response.ok) {
    throw new Error('Failed to load stage data: ' + response.status);
  }
  const data = await response.json();
  // stages.json currently holds a single stage object; if an array, pick by id.
  if (Array.isArray(data)) {
    const stage = data.find(function (s) { return s.id === stageNumber; });
    if (!stage) {
      throw new Error('Stage ' + stageNumber + ' not found in stages.json');
    }
    return stage;
  }
  return data;
}

/**
 * Build and return the stage screen <main> element.
 *
 * @param {number} stageNumber — the 1-based stage identifier.
 * @param {Object} stageData — the stage definition (witnesses, puzzle, etc.).
 * @param {Function} onStageComplete — invoked when the user clicks the
 *   transition button in Phase 3 to advance to the next stage.
 * @returns {HTMLElement} the <main id='stage-screen'> element.
 */
function renderStageScreen(stageNumber, stageData, onStageComplete) {
  const main = document.createElement('main');
  main.id = 'stage-screen';

  const scene = document.createElement('div');
  scene.className = 'scene-container';
  if (stageData && stageData.bgImage) {
    scene.style.backgroundImage = "url('" + stageData.bgImage + "')";
  }

  // Internal phase state
  let phase = 1;
  let feedback = '';

  // --- Phase 1: Interrogation ---
  function renderPhase1() {
    const hotspots = document.createElement('div');
    hotspots.className = 'witness-hotspots';

    stageData.witnesses.slice(0, 3).forEach(function (witness, index) {
      const hotspot = document.createElement('button');
      hotspot.type = 'button';
      hotspot.className = 'witness-hotspot witness-hotspot-' + index;
      hotspot.setAttribute('aria-label', 'Hablar con ' + witness.name);

      hotspot.addEventListener('click', function (event) {
        event.stopPropagation();
        showWitnessDialogue(witness, index);
      });

      hotspots.appendChild(hotspot);
    });

    return hotspots;
  }

  function showWitnessDialogue(witness, index) {
    const existingDialogue = scene.querySelector('.witness-dialogue-box');
    if (existingDialogue) {
      existingDialogue.remove();
    }

    const dialogue = document.createElement('aside');
    dialogue.className = 'witness-dialogue-box witness-dialogue-' + index;
    dialogue.addEventListener('click', function (event) {
      event.stopPropagation();
    });

    const nameEl = document.createElement('h2');
    nameEl.textContent = witness.name;
    dialogue.appendChild(nameEl);

    const roleEl = document.createElement('p');
    roleEl.className = 'witness-role';
    roleEl.textContent = witness.role;
    dialogue.appendChild(roleEl);

    const dialogueEl = document.createElement('p');
    dialogueEl.className = 'witness-dialogue';
    dialogueEl.textContent = witness.dialogue;
    dialogue.appendChild(dialogueEl);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cta-button';
    btn.textContent = 'Interrogar';
    btn.addEventListener('click', function () {
      if (witness.type === 'true') {
        feedback = '';
        phase = 2;
      } else {
        feedback = 'Esa testigo no es fiable. Intenta de nuevo.';
      }
      renderPhase();
    });
    dialogue.appendChild(btn);

    scene.appendChild(dialogue);
  }

  // --- Phase 2: Observation Puzzle ---
  function renderPhase2() {
    const content = document.createElement('div');
    content.className = 'parchment-content';

    const puzzle = stageData.observationPuzzle;

    const questionEl = document.createElement('h3');
    questionEl.textContent = puzzle.question;
    content.appendChild(questionEl);

    const optionsEl = document.createElement('div');
    optionsEl.className = 'puzzle-options';

    puzzle.options.forEach(function (option, index) {
      const label = document.createElement('label');
      label.className = 'puzzle-option';

      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'puzzle-option';
      radio.value = String(index);

      const span = document.createElement('span');
      span.textContent = option;

      radio.addEventListener('change', function () {
        if (index === puzzle.correctIndex) {
          showGemUnlockedModal();
        } else {
          feedback = 'Opción incorrecta. Intenta de nuevo.';
          renderPhase();
        }
      });

      label.appendChild(radio);
      label.appendChild(span);
      optionsEl.appendChild(label);
    });

    content.appendChild(optionsEl);

    if (feedback) {
      const warning = document.createElement('p');
      warning.className = 'error';
      warning.textContent = feedback;
      content.appendChild(warning);
    }

    return content;
  }

  // --- Phase 3: Stage Complete ---
  function renderPhase3() {
    const content = document.createElement('div');
    content.className = 'parchment-content stage-complete-content';

    const successEl = document.createElement('h2');
    successEl.textContent = '¡Gema desbloqueada!';
    content.appendChild(successEl);

    const gemNameEl = document.createElement('p');
    gemNameEl.className = 'gem-name';
    gemNameEl.textContent = stageData.gemName;
    content.appendChild(gemNameEl);

    const transitionBtn = document.createElement('button');
    transitionBtn.type = 'button';
    transitionBtn.className = 'cta-button';
    transitionBtn.textContent = 'Ir a Santa Ana (Stage 2)';
    transitionBtn.addEventListener('click', function (e) {
      e.preventDefault();
      addGem(stageData.id - 1);
      if (typeof onStageComplete === 'function') {
        onStageComplete();
      }
    });

    content.appendChild(transitionBtn);
    return content;
  }

  // --- Gem Unlocked Modal ---
  function showGemUnlockedModal() {
    const modal = document.createElement('div');
    modal.id = 'gem-unlocked-modal';
    modal.className = 'gem-unlocked-modal';

    const overlay = document.createElement('div');
    overlay.className = 'gem-unlocked-overlay';

    const messageBox = document.createElement('div');
    messageBox.className = 'gem-unlocked-message';

    const title = document.createElement('h2');
    title.textContent = '💎 Gema Desbloqueada';

    const gemName = document.createElement('p');
    gemName.textContent = stageData.gemName;

    const continueBtn = document.createElement('button');
    continueBtn.type = 'button';
    continueBtn.className = 'cta-button';
    continueBtn.textContent = 'Continuar';
    continueBtn.addEventListener('click', function () {
      modal.remove();
      phase = 3;
      renderPhase();
    });

    messageBox.appendChild(title);
    messageBox.appendChild(gemName);
    messageBox.appendChild(continueBtn);
    overlay.appendChild(messageBox);
    modal.appendChild(overlay);
    main.appendChild(modal);
  }

  // --- Master render ---
  function renderPhase() {
    // Clear existing phase content
    while (scene.firstChild) {
      scene.removeChild(scene.firstChild);
    }

    let phaseContent;
    if (phase === 1) {
      phaseContent = renderPhase1();
    } else if (phase === 2) {
      phaseContent = renderPhase2();
    } else if (phase === 3) {
      phaseContent = renderPhase3();
    }

    if (phaseContent) {
      scene.appendChild(phaseContent);
    }

    if (phase === 1 && feedback) {
      const warning = document.createElement('p');
      warning.className = 'witness-feedback error';
      warning.textContent = feedback;
      scene.appendChild(warning);
    }

    if (phase === 1) {
      scene.addEventListener('click', function closeDialogue(event) {
        const dialogue = scene.querySelector('.witness-dialogue-box');
        if (dialogue && !dialogue.contains(event.target)) {
          dialogue.remove();
          event.stopPropagation();
        }
      }, true);
    }
  }

  // Initial render
  renderPhase();
  main.appendChild(scene);

  return main;
}

export { renderStageScreen, loadStageData };
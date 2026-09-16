import { getGameState, loadFromLocalStorage } from '../gameState.js';

function formatDate(date) {
  return [date.getDate(), date.getMonth() + 1, date.getFullYear()]
    .map((part) => String(part).padStart(2, '0'))
    .join('/');
}

function renderDiplomaScreen(onRestart) {
  const main = document.createElement('main');
  main.id = 'diploma-screen';

  const content = document.createElement('section');
  content.className = 'parchment-content diploma-content';

  const eyebrow = document.createElement('p');
  eyebrow.className = 'diploma-eyebrow';
  eyebrow.textContent = 'El amuleto del tiempo';

  const title = document.createElement('h1');
  title.textContent = 'Diploma de Honor';

  const teamName = document.createElement('p');
  teamName.className = 'diploma-team-name';
  teamName.textContent = getGameState().teamName;

  const achievement = document.createElement('p');
  achievement.className = 'diploma-title';
  achievement.textContent = 'Grandes Detectives e Historiadores de Barcino';

  const date = document.createElement('p');
  date.className = 'diploma-date';
  date.textContent = formatDate(new Date());

  const gems = document.createElement('div');
  gems.className = 'diploma-gems';
  getGameState().gems.forEach((collected, index) => {
    const gem = document.createElement('span');
    gem.className = 'diploma-gem' + (collected ? ' collected' : '');
    gem.dataset.index = String(index);
    gem.textContent = '◆';
    gems.appendChild(gem);
  });

  const printButton = document.createElement('button');
  printButton.id = 'btn-print-diploma';
  printButton.type = 'button';
  printButton.className = 'cta-button';
  printButton.textContent = 'Imprimir Diploma';
  printButton.addEventListener('click', () => window.print());

  const restartButton = document.createElement('button');
  restartButton.id = 'btn-restart-game';
  restartButton.type = 'button';
  restartButton.className = 'cta-button';
  restartButton.textContent = 'Reiniciar Aventura';
  restartButton.addEventListener('click', () => {
    localStorage.removeItem('barcino_game_state');
    loadFromLocalStorage();
    if (typeof onRestart === 'function') {
      onRestart();
    }
  });

  content.append(eyebrow, title, teamName, achievement, date, gems, printButton, restartButton);
  main.appendChild(content);
  return main;
}

export { renderDiplomaScreen, formatDate };
import { renderIntroScreen } from './components/IntroScreen.js';
import { getGameState, setTeamName, advanceStage } from './gameState.js';

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');

  if (!app) {
    console.error('Root element #app not found in the DOM.');
    return;
  }

  // Clear any static markup that may remain inside #app.
  app.innerHTML = '';

  const introScreen = renderIntroScreen(() => {
    const state = getGameState();

    // Set a default team name if none was provided yet.
    if (!state.teamName) {
      setTeamName('Aventurero');
    }

    // Advance to the next stage (mutates internal state and persists).
    advanceStage();

    // Log the transition for debugging.
    console.log(`Transitioning to stage ${getGameState().currentStage}`);
  });

  app.appendChild(introScreen);
});

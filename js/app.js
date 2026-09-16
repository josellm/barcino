import { renderIntroScreen } from './components/IntroScreen.js';
import { renderOnboardingFlow } from './components/OnboardingFlow.js';
import { renderMission0Screen } from './components/Mission0Screen.js';
import { mountAmuletBar } from './components/AmuletBar.js';
import { getGameState, setTeamName, advanceStage } from './gameState.js';

function render() {
  const app = document.getElementById('app');
  if (!app) {
    console.error('Root element #app not found in the DOM.');
    return;
  }

  // Clear any previously rendered content.
  app.innerHTML = '';

  const state = getGameState();

  if (state.currentStage === 0) {
    const introScreen = renderIntroScreen(() => {
      introScreen.remove();
      const onboarding = renderOnboardingFlow(
        () => {},
        (name) => {
          try {
            setTeamName(name);
            advanceStage();
            render();
          } catch (e) {
            console.error('Failed to set team name:', e);
          }
        }
      );
      app.appendChild(onboarding);
    });
    app.appendChild(introScreen);
  } else if (state.currentStage === 1) {
    const missionScreen = renderMission0Screen(state.teamName, () => {
      advanceStage();
      render();
    });
    app.appendChild(missionScreen);
  } else {
    // stage >= 2: placeholder for the next mission.
    const placeholder = document.createElement('main');
    placeholder.id = 'next-mission-screen';
    const heading = document.createElement('h1');
    heading.textContent = 'Próxima misión';
    placeholder.appendChild(heading);
    app.appendChild(placeholder);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');

  if (!app) {
    console.error('Root element #app not found in the DOM.');
    return;
  }

  // Clear any static markup that may remain inside #app.
  app.innerHTML = '';

  render();
  mountAmuletBar();
});
import { renderIntroScreen } from './components/IntroScreen.js';
import { renderOnboardingFlow } from './components/OnboardingFlow.js';
import { renderMission0Screen } from './components/Mission0Screen.js';
import { renderAmuletBar, mountAmuletBar } from './components/AmuletBar.js';
import { getGameState, setTeamName, advanceStage } from './gameState.js';

async function loadStageData(stageNumber) {
  const response = await fetch('data/stages.json');
  if (!response.ok) {
    throw new Error('Failed to load stage data: ' + response.status);
  }
  const data = await response.json();
  if (Array.isArray(data)) {
    const stage = data.find(function (s) { return s.id === stageNumber; });
    if (!stage) {
      throw new Error('Stage ' + stageNumber + ' not found in stages.json');
    }
    return stage;
  }
  return data;
}

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
    // Mission 0: amulet puzzle screen.
    renderAmuletBar();
    const mission0Screen = renderMission0Screen(function onMission0Complete() {
      advanceStage();
      render();
    });
    app.appendChild(mission0Screen);
  } else if (state.currentStage === 2) {
    // Render amulet bar in the global UI header.
    renderAmuletBar();

    loadStageData(2)
      .then(function (stageData) {
        const stageScreen = renderStageScreen(2, stageData, function onStageComplete() {
          advanceStage();
          render();
        });
        app.appendChild(stageScreen);
      })
      .catch(function (err) {
        console.error('Failed to load stage 2 data:', err);
        const errorEl = document.createElement('main');
        errorEl.id = 'stage-screen';
        const heading = document.createElement('h1');
        heading.textContent = 'Error cargando la etapa';
        errorEl.appendChild(heading);
        app.appendChild(errorEl);
      });
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
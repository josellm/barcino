import { renderIntroScreen } from './components/IntroScreen.js';
import { renderOnboardingFlow } from './components/OnboardingFlow.js';
import { renderMission0Screen } from './components/Mission0Screen.js';
import { renderStageScreen } from './components/StageScreen.js';
import { renderDiplomaScreen } from './components/DiplomaScreen.js';
import { getGameState, setTeamName, setStage, setStageStatus } from './gameState.js';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('./sw.js').catch(function (error) {
      console.warn('Service worker registration failed:', error);
    });
  });
}

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

function isPWA() {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const isiOSStandalone = window.navigator.standalone === true;
  return isStandalone || isiOSStandalone;
}

function showInstallBannerInBrowser() {
  const installBanner = document.getElementById('install-banner');
  if (installBanner && !isPWA()) {
    installBanner.hidden = false;
  }
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
            setStage(1);
            setStageStatus('briefing');
            render();
          } catch (e) {
            console.error('Failed to set team name:', e);
          }
        }
      );
      app.appendChild(onboarding);
    });
    app.appendChild(introScreen);
  } else if (state.currentStage === 1 && state.stageStatus !== 'active') {
    const mission0Screen = renderMission0Screen(state.teamName, function onMission0Complete() {
      setStageStatus('active');
      render();
    });
    app.appendChild(mission0Screen);
  } else if (state.currentStage === 6 && state.stageStatus === 'complete') {
    app.appendChild(renderDiplomaScreen(() => {
      render();
    }));
  } else if (state.currentStage >= 1 && state.currentStage <= 6) {
    // Older saved games used stage 2 for the first data-driven stage.
    const stageNumber = state.currentStage === 2 && !state.gems[0] ? 1 : state.currentStage;

    loadStageData(stageNumber)
      .then(function (stageData) {
        const stageScreen = renderStageScreen(stageNumber, stageData, function onStageComplete() {
          if (stageNumber === 1) {
            setStage(2);
            setStageStatus('active');
            render();
          } else if (stageNumber === 2) {
            setStage(3);
            setStageStatus('active');
            render();
          } else if (stageNumber === 3) {
            setStage(4);
            setStageStatus('active');
            render();
          } else if (stageNumber === 4) {
            setStage(5);
            setStageStatus('active');
            render();
          } else if (stageNumber === 5) {
            setStage(6);
            setStageStatus('active');
            render();
          } else if (stageNumber === 6) {
            setStageStatus('complete');
            render();
          }
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

  showInstallBannerInBrowser();
  render();
});
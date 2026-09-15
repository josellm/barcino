// Central state manager with localStorage persistence
const gameStateModule = (() => {
  const DEFAULT_STATE = {
    teamName: '',
    currentStage: 0,
    gems: [false, false, false, false, false]
  };

  let state = { ...DEFAULT_STATE };

  function saveToLocalStorage() {
    try {
      localStorage.setItem('barcino-game-state', JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save game state to localStorage:', e);
    }
  }

  function loadFromLocalStorage() {
    try {
      const saved = localStorage.getItem('barcino-game-state');
      if (saved) {
        const parsed = JSON.parse(saved);
        state = { ...DEFAULT_STATE, ...parsed };
      }
    } catch (e) {
      console.warn('Failed to load game state from localStorage:', e);
    }
  }

  // Load persisted state on module load
  loadFromLocalStorage();

  function advanceStage() {
    state.currentStage++;
    saveToLocalStorage();
  }

  return {
    getGameState: () => ({ ...state }),
    setTeamName: (name) => {
      state.teamName = name;
      saveToLocalStorage();
    },
    saveToLocalStorage,
    loadFromLocalStorage,
    advanceStage
  };
})();

export const { getGameState, setTeamName, saveToLocalStorage, loadFromLocalStorage, advanceStage } = gameStateModule;
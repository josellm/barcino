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
      localStorage.setItem('barcino_game_state', JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save game state to localStorage:', e);
    }
  }

  function loadFromLocalStorage() {
    state = { ...DEFAULT_STATE };
    try {
      const saved = localStorage.getItem('barcino_game_state');
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

  function setStageStatus(status) {
    state.stageStatus = status;
    saveToLocalStorage();
  }

  function addGem(index) {
    state.gems[index] = true;
    saveToLocalStorage();
    return { ...state };
  }

  function hasGem(index) {
    return state.gems[index];
  }

  return {
    getGameState: () => ({ ...state }),
    setTeamName: (name) => {
      if (typeof name !== 'string' || name.trim().length < 3) {
        throw new Error('Team name must be at least 3 characters');
      }
      state.teamName = name;
      saveToLocalStorage();
    },
    setStage: (stage) => {
      state.currentStage = stage;
      saveToLocalStorage();
    },
    setStageStatus,
    saveToLocalStorage,
    loadFromLocalStorage,
    advanceStage,
    addGem,
    hasGem
  };
})();

export const { getGameState, setTeamName, setStage, setStageStatus, saveToLocalStorage, loadFromLocalStorage, advanceStage, addGem, hasGem } = gameStateModule;


// core/state.js
let globalState = {
  mode: 'singlePlayer', 
  turn: 1,
  currentTurnOwner: 'player', 
  bank: { w: 5, u: 5, g: 5, r: 5, k: 5, o: 5 },
  player: {
    tokens: { w: 0, u: 0, g: 0, r: 0, k: 0, o: 0 },
    bonus: { w: 0, u: 0, g: 0, r: 0, k: 0 },
    reserved: [],
    score: 0
  },
  ai: { 
    tokens: { w: 0, u: 0, g: 0, r: 0, k: 0, o: 0 },
    bonus: { w: 0, u: 0, g: 0, r: 0, k: 0 },
    reserved: [],
    score: 0
  },
  nobles: [],
  decks: { lv1: [], lv2: [], lv3: [] },
  board: { lv1: [], lv2: [], lv3: [] },
  settings: {
    difficulty: 'easy',
    isMusicMuted: false,
    isSfxMuted: false,
    talentPool: [],
    selectedAssistant: null
  }
};

export const CoreState = {
  get() {
    return globalState;
  },
  set(newState) {
    globalState = newState;
  },
  updatePlayer(updater) {
    updater(globalState.player);
  },
  updateBank(updater) {
    updater(globalState.bank);
  }
};
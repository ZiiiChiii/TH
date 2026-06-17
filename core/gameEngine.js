// core/gameEngine.js
export const GameEngine = {
  canAffordCard(playerBonus, playerTokens, cardCost) {
    let neededGold = 0;
    let breakdown = { w: 0, u: 0, g: 0, r: 0, k: 0 };
    const GEM_TYPES = ['w', 'u', 'g', 'r', 'k'];

    for (let k of GEM_TYPES) {
      const reqAmount = cardCost[k] || 0;
      const bonus = playerBonus[k] || 0;
      const net = Math.max(0, reqAmount - bonus);
      const token = playerTokens[k] || 0;

      if (token < net) {
        neededGold += (net - token);
        breakdown[k] = token; 
      } else {
        breakdown[k] = net; 
      }
    }

    return {
      affordable: playerTokens.o >= neededGold,
      neededGold: neededGold,
      breakdown: breakdown
    };
  },

  shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  },

  checkNoblesVisit(nobles, actorBonus) {
    let newlyEarnedNobles = [];
    nobles.forEach(n => {
      if (n.completed) return;
      let satisfy = true;
      for (let k in n.req) {
        if ((actorBonus[k] || 0) < n.req[k]) { satisfy = false; break; }
      }
      if (satisfy) newlyEarnedNobles.push(n);
    });
    return newlyEarnedNobles;
  }
};
// core/action.js
import { CoreState } from './state.js';
import { GameEngine } from './gameEngine.js';
import { SingleMode } from './singleMode.js';
import { AiMode } from './aiMode.js';

const RAW_CARDS = {
  lv1: [
    {id:"101", points:0, provides:"w", cost:{u:1, g:1, r:1, k:1}},
    {id:"102", points:0, provides:"u", cost:{w:1, g:1, r:1, k:1}},
    {id:"103", points:0, provides:"g", cost:{w:1, u:1, r:1, k:1}},
    {id:"104", points:0, provides:"r", cost:{w:1, u:1, g:1, k:1}},
    {id:"105", points:0, provides:"k", cost:{w:1, u:1, g:1, r:1}},
    {id:"106", points:0, provides:"w", cost:{u:2, k:1}},
    {id:"107", points:0, provides:"u", cost:{g:2, r:1}},
    {id:"108", points:0, provides:"g", cost:{r:2, w:1}},
    {id:"109", points:0, provides:"r", cost:{k:2, u:1}},
    {id:"110", points:0, provides:"k", cost:{w:2, g:1}},
    {id:"111", points:1, provides:"w", cost:{g:4}},
    {id:"112", points:1, provides:"u", cost:{r:4}},
    {id:"113", points:1, provides:"g", cost:{k:4}},
    {id:"114", points:1, provides:"r", cost:{w:4}},
    {id:"115", points:1, provides:"k", cost:{u:4}}
  ],
  lv2: [
    {id:"201", points:1, provides:"w", cost:{w:3, u:2, g:2}},
    {id:"202", points:1, provides:"u", cost:{u:3, g:2, r:2}},
    {id:"203", points:1, provides:"g", cost:{g:3, r:2, k:2}},
    {id:"204", points:2, provides:"r", cost:{r:4, k:2, w:1}},
    {id:"205", points:2, provides:"k", cost:{k:4, w:2, u:1}},
    {id:"206", points:2, provides:"w", cost:{w:5}},
    {id:"207", points:2, provides:"u", cost:{u:5}},
    {id:"208", points:3, provides:"g", cost:{g:6}},
    {id:"209", points:2, provides:"r", cost:{w:1, u:4, g:2}},
    {id:"210", points:3, provides:"k", cost:{k:6}}
  ],
  lv3: [
    {id:"301", points:4, provides:"w", cost:{k:7}},
    {id:"302", points:4, provides:"u", cost:{w:7}},
    {id:"303", points:4, provides:"g", cost:{u:7}},
    {id:"304", points:4, provides:"r", cost:{g:7}},
    {id:"305", points:4, provides:"k", cost:{r:7}},
    {id:"306", points:5, provides:"w", cost:{w:3, k:7}},
    {id:"307", points:5, provides:"u", cost:{w:7, u:3}},
    {id:"308", points:5, provides:"g", cost:{u:7, g:3}}
  ]
};

const ALL_NOBLES_POOL = [
  {id:"n1", name:"赫克特", gender:"male", points:3, img:"https://i.ibb.co/zHGC8vsm/image.png", req:{w:3, u:3, g:3}},
  {id:"n2", name:"羅蘭德", gender:"male", points:3, img:"https://i.ibb.co/QvHvZZWc/image.png", req:{u:3, g:3, r:3}},
  {id:"n3", name:"亞瑟", gender:"male", points:3, img:"https://i.ibb.co/hzw3Vfm/image.png", req:{g:3, r:3, k:3}},
  {id:"n4", name:"查理曼", gender:"male", points:3, img:"https://i.ibb.co/nNSjxvvd/image.png", req:{w:3, u:3, k:3}},
  {id:"n5", name:"桂妮薇兒", gender:"female", points:3, img:"https://i.ibb.co/GQ2Yh0yH/image.png", req:{w:3, u:3, g:3}}
];

export const ActionDispatcher = {
  dispatch(actionType, payload) {
    const state = CoreState.get();
    const p = state.player;

    switch (actionType) {
      case 'INIT_GAME':
        this.setupNewGame();
        break;

      case 'SWITCH_MODE':
        state.mode = payload.mode;
        this.setupNewGame();
        break;

      case 'TAKE_DIFF':
        payload.colors.forEach(k => { state.bank[k]--; p.tokens[k]++; });
        SingleMode.auditInstantAchievements("takeDiff", { count: payload.colors.length });
        this.finalizeTurn('player');
        break;

      case 'TAKE_SAME':
        state.bank[payload.color] -= 2;
        p.tokens[payload.color] += 2;
        SingleMode.auditInstantAchievements("takeSame", {});
        this.finalizeTurn('player');
        break;

      case 'BUY_BOARD': {
        const { level, idx } = payload;
        const card = state.board[level][idx];
        const afford = GameEngine.canAffordCard(p.bonus, p.tokens, card.cost);
        
        SingleMode.sessionTracker.goldUsedInThisPurchase = (afford.neededGold > 0);
        let totalGemsSpent = 0;

        for (let k in card.cost) {
          const spent = afford.breakdown[k] || 0;
          p.tokens[k] -= spent; state.bank[k] += spent;
          totalGemsSpent += spent;
        }
        if (afford.neededGold > 0) { p.tokens.o -= afford.neededGold; state.bank.o += afford.neededGold; totalGemsSpent += afford.neededGold; }
        
        p.bonus[card.provides]++;
        p.score += card.points;
        
        if (level === 'lv1') {
          SingleMode.sessionTracker.purchasedCardsCountLv1++;
          if (state.turn <= 10 && SingleMode.sessionTracker.purchasedCardsCountLv1 === 5) {
            SingleMode.triggerAchievementUnlock(11);
          }
        }
        
        state.board[level][idx] = state.decks[level].length > 0 ? state.decks[level].pop() : null;
        SingleMode.auditInstantAchievements("buy", { card, level, totalGemsSpent, isReserved: false });
        
        this.finalizeTurn('player');
        break;
      }

      case 'BUY_RESERVED': {
        const { idx } = payload;
        const card = p.reserved[idx];
        const afford = GameEngine.canAffordCard(p.bonus, p.tokens, card.cost);
        
        SingleMode.sessionTracker.goldUsedInThisPurchase = (afford.neededGold > 0);
        let totalGemsSpent = 0;

        for (let k in card.cost) {
          const spent = afford.breakdown[k] || 0;
          p.tokens[k] -= spent; state.bank[k] += spent;
          totalGemsSpent += spent;
        }
        if (afford.neededGold > 0) { p.tokens.o -= afford.neededGold; state.bank.o += afford.neededGold; totalGemsSpent += afford.neededGold; }
        
        p.bonus[card.provides]++;
        p.score += card.points;
        p.reserved.splice(idx, 1);
        
        SingleMode.auditInstantAchievements("buy", { card, level: 'reserved', totalGemsSpent, isReserved: true });
        this.finalizeTurn('player');
        break;
      }

      case 'RESERVE_CARD': {
        const { level, idx } = payload;
        const card = state.board[level][idx];
        p.reserved.push(card);
        SingleMode.sessionTracker.hasReservedThisGame = true;

        let currentTokens = 0;
        for (let k in p.tokens) currentTokens += p.tokens[k];
        if (state.bank.o > 0 && currentTokens < 10) { state.bank.o--; p.tokens.o++; }
        state.board[level][idx] = state.decks[level].length > 0 ? state.decks[level].pop() : null;
        
        SingleMode.auditInstantAchievements("reserve", {});
        this.finalizeTurn('player');
        break;
      }

      case 'TOGGLE_MUSIC':
        state.settings.isMusicMuted = !state.settings.isMusicMuted;
        const bgMusic = document.getElementById('bg-music');
        if (bgMusic) { if (state.settings.isMusicMuted) bgMusic.pause(); else bgMusic.play().catch(()=>{}); }
        break;

      case 'TOGGLE_SFX':
        state.settings.isSfxMuted = !state.settings.isSfxMuted;
        break;

      case 'CHANGE_DIFFICULTY':
        state.settings.difficulty = payload.difficulty;
        this.setupNewGame();
        break;
    }
    window.render();
  },

  finalizeTurn(actor) {
    const state = CoreState.get();
    const currentBonus = actor === 'player' ? state.player.bonus : state.ai.bonus;
    const earnedNobles = GameEngine.checkNoblesVisit(state.nobles, currentBonus);
    
    earnedNobles.forEach(n => {
      n.completed = true;
      if (actor === 'player') { 
        state.player.score += n.points; 
        window.playNobleSfx(n.gender); 
        SingleMode.triggerAchievementUnlock(15);
      }
      else state.ai.score += n.points;
    });

    // 【修正 3】大局勝負判定邏輯重構 — 根據不同勝負方改用 ID 精準選取，動態調整圖示、文字與外框顏色
    if (state.player.score >= 15 || state.ai.score >= 15) {
      window.render();
      SingleMode.auditEndGameAchievements();

      const iconEl = document.getElementById('win-modal-icon');
      const titleEl = document.getElementById('win-modal-title');  
      const bodyEl = document.getElementById('modal-body-txt');
      const modal = document.getElementById('win-modal');
      const modalBox = modal.querySelector('.modal');

      if (state.player.score >= 15) {
        // 玩家勝利
        iconEl.textContent = '🏆';
        titleEl.textContent = '傳奇大師，實至名歸！';
        bodyEl.textContent = `恭喜您成功奪得 ${state.player.score} 分威望，擊敗了電腦 AI！`;
        modalBox.style.borderColor = '#d4af37';
      } else {
        // AI 勝利
        iconEl.textContent = '🤖';
        titleEl.textContent = '棋差一著，AI 獲得了勝利！';
        bodyEl.textContent = `電腦 AI 率先突破 15 分，最終得分 ${state.ai.score} 分。請重整旗鼓，再次挑戰！`;
        modalBox.style.borderColor = '#e74c3c';
      }

      document.getElementById('win-modal').classList.add('show');
      return;
    }

    if (state.mode === 'singlePlayer') {
      state.turn++;
    } else if (state.mode === 'vsAI') {
      if (actor === 'player') {
        state.currentTurnOwner = 'ai';
        window.render();
        setTimeout(() => { AiMode.thinkAndExecute(state); }, 1000);
        return;
      } else {
        state.currentTurnOwner = 'player';
        state.turn++;
      }
    }
    window.render();
  },

  setupNewGame() {
    const state = CoreState.get();
    state.turn = 1;
    state.currentTurnOwner = 'player';
    state.bank = { w: 5, u: 5, g: 5, r: 5, k: 5, o: 5 };
    
    state.player = { tokens: { w: 0, u: 0, g: 0, r: 0, k: 0, o: 0 }, bonus: { w: 0, u: 0, g: 0, r: 0, k: 0 }, reserved: [], score: 0 };
    state.ai = { tokens: { w: 0, u: 0, g: 0, r: 0, k: 0, o: 0 }, bonus: { w: 0, u: 0, g: 0, r: 0, k: 0 }, reserved: [], score: 0 };

    SingleMode.sessionTracker = {
      hasReservedThisGame: false,
      purchasedCardsCount: 0,
      purchasedCardsCountLv1: 0, 
      lv1CardsCountBeforeTurn10: 0,
      singleTurnScoreGained: 0,
      goldUsedInThisPurchase: false
    };

    state.decks.lv1 = JSON.parse(JSON.stringify(RAW_CARDS.lv1));
    state.decks.lv2 = JSON.parse(JSON.stringify(RAW_CARDS.lv2));
    state.decks.lv3 = JSON.parse(JSON.stringify(RAW_CARDS.lv3));
    
    GameEngine.shuffle(state.decks.lv1);
    GameEngine.shuffle(state.decks.lv2);
    GameEngine.shuffle(state.decks.lv3);

    state.board.lv1 = [state.decks.lv1.pop(), state.decks.lv1.pop(), state.decks.lv1.pop(), state.decks.lv1.pop()];
    state.board.lv2 = [state.decks.lv2.pop(), state.decks.lv2.pop(), state.decks.lv2.pop(), state.decks.lv2.pop()];
    state.board.lv3 = [state.decks.lv3.pop(), state.decks.lv3.pop(), state.decks.lv3.pop(), state.decks.lv3.pop()];

    state.nobles = JSON.parse(JSON.stringify(ALL_NOBLES_POOL));
    GameEngine.shuffle(state.nobles);
    
    if (document.getElementById('game-options-modal')) {
      document.getElementById('game-options-modal').classList.remove('show');
    }
  }
};
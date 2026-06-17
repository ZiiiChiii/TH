// ==========================================
// 1. 全域 UI 樣式常數定義
// ==========================================
const GEM_TYPES = ['w', 'u', 'g', 'r', 'k']; 
const GEM_CLASSES = { w: 'bg-w', u: 'bg-u', g: 'bg-g', r: 'bg-r', k: 'bg-k', o: 'bg-o' };
const GEM_BTN_CLASSES = { w: 'token-btn-w', u: 'token-btn-u', g: 'token-btn-g', r: 'token-btn-r', k: 'token-btn-k' };

const CUSTOM_CARD_IMAGES = {
  g: ["https://i.ibb.co/KxX2gxBP/1.jpg", "https://i.ibb.co/35Wz9SGp/2.jpg", "https://i.ibb.co/4nRZhdV9/3.jpg", "https://i.ibb.co/VW851t3Q/4.jpg", "https://i.ibb.co/zh2mXJDS/5.jpg"],
  u: ["https://i.ibb.co/cc5LQG4Z/1.jpg", "https://i.ibb.co/JjQb4p1F/2.jpg", "https://i.ibb.co/spKMvZfr/3.jpg", "https://i.ibb.co/R4QS49Zj/4.jpg", "https://i.ibb.co/HLFX94d2/5.jpg"],
  r: ["https://i.ibb.co/rf43Prw8/1.jpg", "https://i.ibb.co/gFPGMGK7/2.jpg", "https://i.ibb.co/bjgntGqQ/3.jpg", "https://i.ibb.co/NghmMzHM/4.jpg", "https://i.ibb.co/VWhLdVjL/5.jpg"],
  w: ["https://i.ibb.co/DDkcxCww/1.jpg", "https://i.ibb.co/Z6wkT9sw/2.jpg", "https://i.ibb.co/dstw94C5/3.jpg", "https://i.ibb.co/HLcpg8kB/4.jpg", "https://i.ibb.co/p6Y1Tt5M/5.jpg"],
  k: ["https://i.ibb.co/6cKPW5Ff/1.jpg", "https://i.ibb.co/7tRFCqBb/2.jpg", "https://i.ibb.co/gbGqKfnv/3.jpg", "https://i.ibb.co/zHS6cht3/4.jpg", "https://i.ibb.co/SwrD6WdV/5.jpg"]
};

const TUTORIAL_STEPS_DATA = [
  { elementId: "guide-actions", title: "🟢 第一步：行動挑選面板", text: "輪到您的回合時，可以選擇拿取 3 個 different 顏色或 2 個同色籌碼。" },
  { elementId: "guide-dashboard", title: "🪙 第二步：皇家金庫資產欄", text: "左側為持有的籌碼與卡片減免產量，注意背包籌碼總上限為 10 顆！" },
  { elementId: "guide-matrix", title: "💎 第三步：核心產業卡片矩陣", text: "可在此花費籌碼收購或保留卡片。左上為威望分數，右上是永久寶石產量。" },
  { elementId: "guide-nobles", title: "⚜️ 第四步：貴族覲見區", text: "當發展卡累積達到貴族所需的永久產量時，貴族會前來拜訪並贈予 3 分！" },
  { elementId: "guide-reserved", title: "🔒 第五步：機密保留契約", text: "可保留卡牌入此區並獲得 1 顆黃金。保留上限為 3 張。" }
];

// ==========================================
// 2. 音效組件參照 (由 DOMContentLoaded 初始化)
// ==========================================
let audioEl, sfxGemEl, sfxBuyEl, sfxReserveEl, sfxSelectEl, sfxUnselectEl, sfxNobleMale, sfxNobleFemale;
let sfxAchievementsMap = {};

let lastRenderedCardIds = new Set();
let lastPlayerState = null;
let selectedDiff = [];
let selectedSame = null;
let currentTutorialStep = 0;

let CoreState, GameEngine, SingleMode, AiMode, ActionDispatcher;

async function loadCoreModules() {
  const stateMod = await import('./core/state.js');
  const engineMod = await import('./core/gameEngine.js');
  const singleMod = await import('./core/singleMode.js');
  const aiMod = await import('./core/aiMode.js');
  const actionMod = await import('./core/action.js');

  CoreState = stateMod.CoreState;
  GameEngine = engineMod.GameEngine;
  SingleMode = singleMod.SingleMode;
  AiMode = aiMod.AiMode;
  ActionDispatcher = actionMod.ActionDispatcher;

  window.ActionDispatcher = ActionDispatcher;
  window.SingleMode = SingleMode;
}

window.playUniformSfx = function() {
  if (!CoreState) return; 
  if (sfxSelectEl && !CoreState.get().settings.isSfxMuted) {
    sfxSelectEl.currentTime = 0; sfxSelectEl.play().catch(() => {});
  }
}

window.playActionGemSfx = function() {
  if (!CoreState) return; 
  if (sfxGemEl && !CoreState.get().settings.isSfxMuted) {
    sfxGemEl.currentTime = 0; sfxGemEl.play().catch(() => {});
  }
}

window.playNobleSfx = function(gender) {
  if (!CoreState) return; 
  if (CoreState.get().settings.isSfxMuted) return;
  if (gender === 'female' && sfxNobleFemale) {
    sfxNobleFemale.currentTime = 0; sfxNobleFemale.play().catch(() => {});
  } else if (gender === 'male' && sfxNobleMale) {
    sfxNobleMale.currentTime = 0; sfxNobleMale.play().catch(() => {});
  }
}

window.playAchievementSfx = function(tier) {
  if (!CoreState) return; 
  const targetSFX = sfxAchievementsMap[tier] || sfxAchievementsMap['easy'];
  if (targetSFX && !CoreState.get().settings.isSfxMuted) {
    targetSFX.currentTime = 0; targetSFX.play().catch(() => {});
  }
}

// ==========================================
// 3. 3D 旋轉翻面與拋物飛行震撼視覺特效 (更新版)
// ==========================================
function animateCardFlightToGoldVault(cardId, providesColor, callback) {
  const sourceDom = document.getElementById(`dom-card-${cardId}`);
  const vaultTargetId = `vault-target-${providesColor}`;
  const targetDom = document.getElementById(vaultTargetId);
  const fxContainer = document.getElementById('effects-layer');
  
  if (!sourceDom || !targetDom || !fxContainer) {
    if (callback) callback(); return;
  }

  // ── 第一階段：浮起 + 準備 (150ms) ──
  // 1. 原始卡牌本身輕微放大 (【修正 2】移除所有 zIndex 設值避免原始卡牌遮住其他元素)
  sourceDom.style.transition = 'transform 150ms ease-out';
  sourceDom.style.transform = 'scale(1.08)';

  // 2. 複製動畫卡並設定初始樣式
  const animCard = sourceDom.cloneNode(true);
  animCard.id = `ghost-card-${cardId}`;
  animCard.classList.remove('animate-deal', 'animate-buy', 'animate-reserve');
  
  const srcRect = sourceDom.getBoundingClientRect();
  animCard.style.position = 'fixed';
  animCard.style.top = `${srcRect.top}px`;
  animCard.style.left = `${srcRect.left}px`;
  animCard.style.width = `${srcRect.width}px`;
  animCard.style.height = `${srcRect.height}px`;
  animCard.style.margin = '0';
  animCard.style.pointerEvents = 'none';
  animCard.style.transformOrigin = 'center center';
  animCard.style.zIndex = '10000';
  
  // 【修正 1】perspective 改用 transform 函數形式
  animCard.style.transform = 'perspective(800px) scale(1)';
  
  const actions = animCard.querySelector('.card-actions');
  if (actions) actions.style.display = 'none';
  
  fxContainer.appendChild(animCard);

  // ── 第二階段：飛行 (650ms) ──
  setTimeout(() => {
    const dstRect = targetDom.getBoundingClientRect();
    const deltaX = (dstRect.left + dstRect.width / 2) - (srcRect.left + srcRect.width / 2);
    const deltaY = (dstRect.top + dstRect.height / 2) - (srcRect.top + srcRect.height / 2);

    animCard.style.transition = 'transform 650ms cubic-bezier(0.25, 1, 0.5, 1), opacity 650ms ease-in';
    
    // 【修正 1】在飛行階段將 perspective 函數串在單一 transform 字串開頭
    animCard.style.transform = `perspective(800px) translate(${deltaX}px, ${deltaY}px) scale(0.2) rotateY(360deg)`;
    animCard.style.opacity = '0';
  }, 150);

  // ── 第三階段：動畫結束處理 (150ms + 650ms) ──
  setTimeout(() => {
    animCard.remove(); 
    sourceDom.style.transform = ''; // 【修正 2】只恢復 scale，無 zIndex 殘留

    // 觸發金庫/背包的 Bounce 彈跳特效
    targetDom.classList.remove('vault-bounce');
    void targetDom.offsetWidth; 
    targetDom.classList.add('vault-bounce');

    if (callback) callback();
  }, 150 + 650);
}

// ==========================================
// 4. 其他渲染與事件監聽控制器
// ==========================================
function renderDashboardGems(targetElementId, actorData, diffs) {
  const container = document.getElementById(targetElementId);
  if (!container) return;

  let html = '';
  ['w', 'u', 'g', 'r', 'k', 'o'].forEach(k => {
    const tokenVal = actorData.tokens[k] || 0;
    const bonusVal = actorData.bonus[k] || 0;
    const isGold = (k === 'o');
    
    let tDiffHtml = (diffs && diffs.tokens[k] > 0) ? `<span class="floating-diff plus">+${diffs.tokens[k]}</span>` : (diffs && diffs.tokens[k] < 0 ? `<span class="floating-diff minus">${diffs.tokens[k]}</span>` : '');
    let bDiffHtml = (diffs && !isGold && diffs.bonus[k] > 0) ? `<span class="floating-permanent-anim">+${diffs.bonus[k]} 🛡️</span>` : '';
    let pulseClass = (diffs && (diffs.tokens[k] !== 0 || (!isGold && diffs.bonus[k] !== 0))) ? 'animate-pulse-glow' : '';

    html += `
      <div class="res-block ${pulseClass}" id="vault-target-${k}">
        ${tDiffHtml} ${bDiffHtml}
        <div class="res-circle ${GEM_CLASSES[k]}"></div>
        <div class="res-text-group">
          <span class="res-count">${tokenVal}</span>
          ${!isGold ? (bonusVal > 0 ? `<span class="res-bonus">+${bonusVal}</span>` : `<span class="res-bonus" style="visibility:hidden;">+0</span>`) : `<span class="res-bonus" style="color:#968a7f; font-size:0.55rem;">百搭</span>`}
        </div>
      </div>
    `;
  });
  container.innerHTML = html;
}

window.render = function() {
  const fullState = CoreState.get();
  const player = fullState.player;

  document.getElementById('turn-txt').textContent = fullState.turn;
  document.getElementById('score-txt').textContent = player.score;

  const isvsAI = fullState.mode === 'vsAI';
  document.getElementById('ai-dashboard-box').style.display = isvsAI ? 'block' : 'none';
  document.getElementById('player-dashboard-title').style.display = isvsAI ? 'block' : 'none';
  
  const achBanner = document.getElementById('ach-banner-btn');
  if (achBanner) achBanner.style.display = isvsAI ? 'none' : '';

  const indicator = document.getElementById('turn-owner-indicator');
  indicator.style.display = isvsAI ? 'block' : 'none';
  indicator.textContent = fullState.currentTurnOwner === 'player' ? '👤 玩家回合' : '🤖 電腦回合';
  indicator.style.borderColor = fullState.currentTurnOwner === 'player' ? '#ffcc00' : '#e74c3c';

  let totalTokens = 0;
  for (let k in player.tokens) totalTokens += player.tokens[k];

  let diffs = { tokens: {}, bonus: {} };
  if (lastPlayerState) {
    for (let k in player.tokens) diffs.tokens[k] = player.tokens[k] - lastPlayerState.tokens[k];
    for (let k in player.bonus) diffs.bonus[k] = player.bonus[k] - lastPlayerState.bonus[k];
  }

  renderDashboardGems('res-layer', player, diffs);
  if (isvsAI) {
    document.getElementById('ai-score-txt').textContent = fullState.ai.score;
    renderDashboardGems('ai-res-layer', fullState.ai, null);
  }

  const capTxtEl = document.getElementById('cap-txt');
  capTxtEl.textContent = `背包: ${totalTokens} / 10`;
  capTxtEl.classList.remove('bag-warning-yellow', 'bag-danger-red');
  if (totalTokens === 10) capTxtEl.classList.add('bag-danger-red');
  else if (totalTokens > 7) capTxtEl.classList.add('bag-warning-yellow');

  lastPlayerState = deepClone(player);

  document.getElementById('nobles-layer').innerHTML = fullState.nobles.map(n => {
    let reqHtml = '';
    for (let k in n.req) {
      reqHtml += `<div class="noble-req-item"><span class="cost-dot-circle ${GEM_CLASSES[k]}"></span><span>${n.req[k]}</span></div>`;
    }
    return `
      <div class="noble-card ${n.completed ? 'completed' : ''}">
        <img class="noble-img" src="${n.img}">
        <div class="noble-overlay">
          <div class="card-top"><span class="noble-pts">${n.points}</span><span class="noble-name">${n.name}</span></div>
          <div class="noble-reqs">${reqHtml}</div>
        </div>
      </div>
    `;
  }).join('');

  document.getElementById('earned-nobles-layer').innerHTML = fullState.nobles.filter(n => n.completed).map(n => `
    <div class="earned-noble-mini"><img src="${n.img}"><span>${n.name}</span></div>
  `).join('') || `<p style="font-size:0.55rem; color:var(--text-muted); padding:4px 0;">尚無貴族拜訪</p>`;

  document.getElementById('diff-selectors').innerHTML = GEM_TYPES.map(k => {
    const isSelected = selectedDiff.includes(k) ? 'selected' : '';
    return `
      <div class="token-container-cell">
        <button class="token-btn ${GEM_BTN_CLASSES[k]} ${isSelected}" ${fullState.bank[k] <= 0 ? 'disabled style="opacity:0.08;"' : ''} onclick="toggleSelectDiff('${k}')"></button>
        <span class="token-count-label">庫存:${fullState.bank[k]}</span>
      </div>
    `;
  }).join('');

  document.getElementById('same-selectors').innerHTML = GEM_TYPES.map(k => {
    const isSelected = selectedSame === k ? 'selected' : '';
    return `
      <div class="token-container-cell">
        <button class="token-btn ${GEM_BTN_CLASSES[k]} ${isSelected}" ${fullState.bank[k] < 2 ? 'disabled style="opacity:0.08;"' : ''} onclick="toggleSelectSame('${k}')"></button>
        <span class="token-count-label">庫存:${fullState.bank[k]}</span>
      </div>
    `;
  }).join('');

  const isPlayerTurn = fullState.currentTurnOwner === 'player';
  document.getElementById('btn-do-diff').disabled = !isPlayerTurn || (selectedDiff.length === 0);
  document.getElementById('btn-do-same').disabled = !isPlayerTurn || (selectedSame === null);

  ['lv1', 'lv2', 'lv3'].forEach(level => {
    document.getElementById(`deck-${level}-txt`).textContent = `剩餘: ${fullState.decks[level].length}`;
    document.getElementById(`row-${level}`).innerHTML = fullState.board[level].map((card, idx) => {
      if (!card) return `<div class="card empty">已全數售罄</div>`;
      
      let costHtml = '';
      for (let k in card.cost) {
        costHtml += `
          <div class="cost-dot ${(player.bonus[k] || 0) >= card.cost[k] ? 'free' : ''}">
            <span class="cost-dot-circle ${GEM_CLASSES[k]}"></span><span>${card.cost[k]}</span>
          </div>`;
      }
      
      const afford = GameEngine.canAffordCard(player.bonus, player.tokens, card.cost);
      let imgUrl = CUSTOM_CARD_IMAGES[card.provides][parseInt(card.id) % CUSTOM_CARD_IMAGES[card.provides].length];

      return `
        <div class="card ${!lastRenderedCardIds.has(card.id) ? 'animate-deal' : ''}" id="dom-card-${card.id}" style="background-image: url('${imgUrl}');">
          <div class="card-content-wrapper">
            <div class="card-top"><span class="card-pts">${card.points > 0 ? card.points : ''}</span><div class="card-gem-icon ${GEM_CLASSES[card.provides]}"></div></div>
            <div>
              <div class="card-costs">${costHtml}</div>
              <div class="card-actions">
                <button class="btn-card" ${!isPlayerTurn || !afford.affordable ? 'disabled' : ''} onclick="buyBoardCard('${level}', ${idx})">收購</button>
                <button class="btn-card" ${!isPlayerTurn || player.reserved.length >= 3 ? 'disabled' : ''} onclick="reserveBoardCard('${level}', ${idx})">保留</button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  });

  const resLayerReserved = document.getElementById('reserved-layer');
  if (player.reserved.length === 0) {
    resLayerReserved.innerHTML = `<div class="card empty" style="grid-column: span 4;">🔒 當前保密保留區尚無契約手牌 (上限 3 張)</div>`;
  } else {
    resLayerReserved.innerHTML = [0, 1, 2].map(i => {
      const card = player.reserved[i];
      if (!card) return `<div class="card empty">空位</div>`;
      const afford = GameEngine.canAffordCard(player.bonus, player.tokens, card.cost);
      let imgUrl = CUSTOM_CARD_IMAGES[card.provides][parseInt(card.id) % CUSTOM_CARD_IMAGES[card.provides].length];
      return `
        <div class="card" id="dom-card-${card.id}" style="background-image: url('${imgUrl}');">
          <div class="card-content-wrapper">
            <div class="card-top"><span class="card-pts">${card.points > 0 ? card.points : ''}</span><div class="card-gem-icon ${GEM_CLASSES[card.provides]}"></div></div>
            <div class="card-actions"><button class="btn-card" ${!isPlayerTurn || !afford.affordable ? 'disabled' : ''} onclick="buyReservedCard(${i})">簽署收購</button></div>
          </div>
        </div>
      `;
    }).join('');
  }

  ['lv1', 'lv2', 'lv3'].forEach(l => fullState.board[l]?.forEach(c => { if(c) lastRenderedCardIds.add(c.id); }));
}

window.toggleSelectDiff = function(color) {
  if(CoreState.get().currentTurnOwner !== 'player') return;
  document.getElementById('error-msg').textContent = ''; selectedSame = null;
  const idx = selectedDiff.indexOf(color);
  if (idx > -1) { selectedDiff.splice(idx, 1); if (sfxUnselectEl && !CoreState.get().settings.isSfxMuted) sfxUnselectEl.play(); }
  else { if (selectedDiff.length >= 3) selectedDiff.shift(); selectedDiff.push(color); playUniformSfx(); }
  render();
};

window.toggleSelectSame = function(color) {
  if(CoreState.get().currentTurnOwner !== 'player') return;
  document.getElementById('error-msg').textContent = ''; selectedDiff = [];
  if (selectedSame === color) { selectedSame = null; if (sfxUnselectEl && !CoreState.get().settings.isSfxMuted) sfxUnselectEl.play(); }
  else { selectedSame = color; playUniformSfx(); }
  render();
};

window.handleDoDiffClick = function() {
  if (selectedDiff.length === 0) return;
  if (sfxGemEl && !CoreState.get().settings.isSfxMuted) {
    sfxGemEl.currentTime = 0; sfxGemEl.play().catch(() => {});
  }
  const colors = [...selectedDiff];
  selectedDiff = [];      
  selectedSame = null;
  ActionDispatcher.dispatch('TAKE_DIFF', { colors });
};

window.handleDoSameClick = function() {
  if (!selectedSame) return;
  if (sfxGemEl && !CoreState.get().settings.isSfxMuted) {
    sfxGemEl.currentTime = 0; sfxGemEl.play().catch(() => {});
  }
  const color = selectedSame;
  selectedSame = null;    
  selectedDiff = [];
  ActionDispatcher.dispatch('TAKE_SAME', { color });
};

window.buyBoardCard = function(level, idx) {
  const card = CoreState.get().board[level][idx];
  if (!card) return;
  animateCardFlightToGoldVault(card.id, card.provides, () => {
    if (sfxBuyEl && !CoreState.get().settings.isSfxMuted) {
      sfxBuyEl.currentTime = 0; sfxBuyEl.play().catch(() => {});
    }
    ActionDispatcher.dispatch('BUY_BOARD', { level, idx });
  });
};

window.buyReservedCard = function(idx) {
  const card = CoreState.get().player.reserved[idx];
  if (!card) return;
  animateCardFlightToGoldVault(card.id, card.provides, () => {
    if (sfxBuyEl && !CoreState.get().settings.isSfxMuted) {
      sfxBuyEl.currentTime = 0; sfxBuyEl.play().catch(() => {});
    }
    ActionDispatcher.dispatch('BUY_RESERVED', { idx });
  });
};

window.reserveBoardCard = function(level, idx) {
  if (sfxReserveEl && !CoreState.get().settings.isSfxMuted) {
    sfxReserveEl.currentTime = 0; sfxReserveEl.play().catch(() => {});
  }
  ActionDispatcher.dispatch('RESERVE_CARD', { level, idx });
};

window.openGameOptionsModal = () => {
  const s = CoreState.get().settings;
  const m = CoreState.get().mode;
  document.getElementById('menu-toggle-music').textContent = s.isMusicMuted ? "🔇 背景音樂：靜音" : "🎵 背景音樂：開啟";
  document.getElementById('menu-toggle-sfx').textContent = s.isSfxMuted ? "🔇 遊戲音效：靜音" : "🔊 遊戲音效：開啟";
  
  document.getElementById('mode-btn-single').classList.toggle('active', m === 'singlePlayer');
  document.getElementById('mode-btn-ai').classList.toggle('active', m === 'vsAI');
  
  document.querySelectorAll('.diff-opt-btn').forEach(b => {
    if(b.id !== 'mode-btn-single' && b.id !== 'mode-btn-ai') {
      b.classList.toggle('active', b.getAttribute('data-diff') === s.difficulty);
    }
  });
  document.getElementById('game-options-modal').classList.add('show');
};

window.closeGameOptionsModal = () => document.getElementById('game-options-modal').classList.remove('show');

window.closeWinModal = () => {
  document.getElementById('win-modal').classList.remove('show');
};

window.restartGame = () => {
  document.getElementById('win-modal').classList.remove('show');
  ActionDispatcher.dispatch('INIT_GAME');
};

window.openTalentPoolModal = () => { SingleMode.renderTalentPoolModalUI(); document.getElementById('talent-pool-modal').classList.add('show'); };
window.closeTalentPoolModal = () => { document.getElementById('talent-pool-modal').classList.remove('show'); SingleMode.renderActiveAssistantUI(); };
window.openAchievementHistory = () => SingleMode.openAchievementHistory();
window.closeAchievementHistory = () => SingleMode.closeAchievementHistory();
window.saveCurrentProgress = () => SingleMode.saveCurrentProgress();
window.changeGameDifficultyWithWarning = (diff) => ActionDispatcher.dispatch('CHANGE_DIFFICULTY', { difficulty: diff });
window.handleMusicToggle = () => ActionDispatcher.dispatch('TOGGLE_MUSIC');
window.handleSfxToggle = () => ActionDispatcher.dispatch('TOGGLE_SFX');
window.startFloatingTutorial = () => { document.getElementById('tutorial-start-modal').classList.remove('show'); hideWelcomeModal(); document.getElementById('floating-tutorial-widget').style.display = 'block'; showStepData(0); };
window.hideWelcomeModal = () => { document.getElementById('welcome-back-modal').style.display = 'none'; if (!CoreState.get().settings.isMusicMuted && audioEl) audioEl.play().catch(() => {}); };

function showStepData(stepIdx) {
  currentTutorialStep = stepIdx;
  TUTORIAL_STEPS_DATA.forEach((s, i) => document.getElementById(s.elementId)?.classList.toggle('tutorial-highlight', i === stepIdx));
  const step = TUTORIAL_STEPS_DATA[stepIdx];
  if (step) {
    document.getElementById(step.elementId)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    document.getElementById('floating-tutorial-header').textContent = step.title;
    document.getElementById('floating-tutorial-text').textContent = step.text;
  }
  document.getElementById('floating-tutorial-dots').innerHTML = TUTORIAL_STEPS_DATA.map((_, i) => `<div class="t-dot ${i === stepIdx ? 'active' : ''}\"></div>`).join('');
  document.getElementById('floating-tutorial-next-btn').textContent = stepIdx === TUTORIAL_STEPS_DATA.length - 1 ? "進入大會堂" : "下一步";
}

window.nextFloatingStep = () => {
  if (currentTutorialStep < TUTORIAL_STEPS_DATA.length - 1) showStepData(currentTutorialStep + 1);
  else {
    TUTORIAL_STEPS_DATA.forEach(s => document.getElementById(s.elementId)?.classList.remove('tutorial-highlight'));
    document.getElementById('floating-tutorial-widget').style.display = 'none';
    localStorage.setItem('splendor_tutorial_completed_2026', 'true');
  }
};

window.addEventListener('DOMContentLoaded', async () => {
  document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
  
  audioEl = document.getElementById('bg-music');
  sfxGemEl = document.getElementById('sfx-gem');
  sfxBuyEl = document.getElementById('sfx-buy');
  sfxReserveEl = document.getElementById('sfx-reserve');
  sfxSelectEl = document.getElementById('sfx-select');
  sfxUnselectEl = document.getElementById('sfx-unselect');
  sfxNobleMale = document.getElementById('sfx-noble-male');
  sfxNobleFemale = document.getElementById('sfx-noble-female');

  sfxAchievementsMap = {
    easy: document.getElementById('sfx-ach-easy'),
    normal: document.getElementById('sfx-ach-normal'),
    hard: document.getElementById('sfx-ach-hard'),
    expert: document.getElementById('sfx-ach-expert'),
    master: document.getElementById('sfx-ach-master')
  };

  await loadCoreModules();
  SingleMode.loadTalentPool();
  ActionDispatcher.dispatch('INIT_GAME');
  if (!localStorage.getItem('splendor_tutorial_completed_2026')) {
    document.getElementById('tutorial-start-modal').classList.add('show');
  } else {
    document.getElementById('welcome-back-modal').classList.add('show');
  }
});
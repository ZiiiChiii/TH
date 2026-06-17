// core/singleMode.js
import { CoreState } from './state.js';

// 【修正 1】定義成就清單常數放在 singleMode.js 頂部
const ALL_ACHIEVEMENTS = [
    { id: 1, symbol: "💰", name: "第一桶金", desc: "在單一回合中，一口氣拿取 3 枚不同顏色的普通寶石。", tier: "easy", color: "var(--diff-easy)" },
  { id: 2, symbol: "💎", name: "專一的收藏家", desc: "在單一回合中，拿取 2 枚相同顏色的普通寶石。", tier: "easy", color: "var(--diff-easy)" },
  { id: 3, symbol: "🏪", name: "開張大吉", desc: "成功購買第一張發展卡。", tier: "easy", color: "var(--diff-easy)" },
  { id: 4, symbol: "🪙", name: "黃金儲蓄狂", desc: "同時持有 3 枚黃金（百搭寶石）。", tier: "easy", color: "var(--diff-easy)" },
  { id: 5, symbol: "🎒", name: "滿載而歸", desc: "某個回合結束時，手上的寶石數量剛好達到上限 10 枚。", tier: "easy", color: "var(--diff-easy)" },
  { id: 6, symbol: "🪙", name: "不需找零", desc: "購買一張發展卡時，完全由手牌普通寶石支付，沒用到黃金。", tier: "easy", color: "var(--diff-easy)" },
  
  { id: 7, symbol: "🌈", name: "七彩的寶石尋寶家", desc: "玩家背包同時存在 5 種不同顏色的普通寶石各至少 1 枚。", tier: "normal", color: "var(--diff-normal)" },
  { id: 8, symbol: "🔄", name: "永續發展", desc: "完全不消耗 any 實體寶石（僅靠已購卡片的減免功能）購買卡片。", tier: "normal", color: "var(--diff-normal)" },
  { id: 9, symbol: "⚡", name: "先搶先贏", desc: "執行「保留一張卡片並獲得 1 黃金」的行動。", tier: "normal", color: "var(--diff-normal)" },
  { id: 10, symbol: "🎯", name: "高瞻遠矚", desc: "成功將保留區的 3 張手牌全部補滿。", tier: "normal", color: "var(--diff-normal)" },
  { id: 11, symbol: "🏗️", name: "基礎紮實", desc: "成功在遊戲前 10 回合內，購買 5 張等級 1 的發展卡。", tier: "normal", color: "var(--diff-normal)" },
  { id: 12, symbol: "🧱", name: "金字塔底層", desc: "遊戲結束時，名下擁有 8 張（或以上）等級 1 的發展卡。", tier: "normal", color: "var(--diff-normal)" },
  
  { id: 13, symbol: "🧬", name: "打破鴨蛋", desc: "獲得遊戲中的第一張帶有分數的卡片。", tier: "hard", color: "var(--diff-hard)" },
  { id: 14, symbol: "🚀", name: "跨越階級", desc: "首次成功購買一張等級 3（Level 3）的發展卡。", tier: "hard", color: "var(--diff-hard)" },
  { id: 15, symbol: "⚜️", name: "貴族青睞", desc: "滿足貴族條件，獲得第一位貴族板塊的拜訪。", tier: "hard", color: "var(--diff-hard)" },
  { id: 16, symbol: "🔓", name: "清空庫存", desc: "成功將保留區的卡片購買下來，使保留區歸零。", tier: "hard", color: "var(--diff-hard)" },
  { id: 17, symbol: "🏭", name: "基建大師", desc: "單一顏色的發展卡減免效果達到 4 次。", tier: "hard", color: "var(--diff-hard)" },
  { id: 18, symbol: "📈", name: "精準投資", desc: "購買一張「價值 4 分以上（含）」的高級發展卡。", tier: "hard", color: "var(--diff-hard)" },
  { id: 19, symbol: "⏱️", name: "小試身手", desc: "成功通關（達到 15 分），且總消耗回合數小於 35 回合。", tier: "hard", color: "var(--diff-hard)" },
  
  { id: 20, symbol: "🔥", name: "真金不怕火煉", desc: "成功通關，且整局遊戲從未執行過「保留卡片」的行動。", tier: "expert", color: "var(--diff-expert)" },
  { id: 21, symbol: "🔓", name: "白手起家", desc: "成功通關，且名下沒有任何一位貴族拜訪。", tier: "expert", color: "var(--diff-expert)" },
  { id: 22, symbol: "🥂", name: "上流社會", desc: "成功通關，且分數來源有 9 分（或以上）是來自於貴族板塊。", tier: "expert", color: "var(--diff-expert)" },
  { id: 23, symbol: "🔋", name: "黃金絕緣體", desc: "成功通關，且通關當下持有的寶石中完全沒有黃金。", tier: "expert", color: "var(--diff-expert)" },
  { id: 24, symbol: "🗺️", name: "全色制霸", desc: "5 種普通顏色的發展卡，每種顏色都至少擁有 3 張。", tier: "expert", color: "var(--diff-expert)" },
  { id: 25, symbol: "👥", name: "雙喜臨門", desc: "在單人局遊戲中，成功吸引兩位（或以上）的貴族拜訪。", tier: "expert", color: "var(--diff-expert)" },
  { id: 26, symbol: "🧠", name: "精算大師", desc: "成功通關，且總消耗回合數小於 25 回合。", tier: "expert", color: "var(--diff-expert)" },
  
  { id: 27, symbol: "💥", name: "厚積薄發", desc: "在單一回合內，同時靠購買卡片+貴族拜訪，一舉獲得 6 分以上。", tier: "master", color: "var(--diff-master)" },
  { id: 28, symbol: "🎯", name: "壓軸登場", desc: "成功通關時，最終分數剛好精準落在 15 分，不多不少。", tier: "master", color: "var(--diff-master)" },
  { id: 29, symbol: "⚡", name: "璀璨神速", desc: "以極限速度通關，總消耗回合數小於 20 回合。", tier: "master", color: "var(--diff-master)" },
  { id: 30, symbol: "👑", name: "璀璨大師", desc: "達成上述 29 個成就中的任意 20 個。", tier: "master", color: "var(--diff-master)" }
];


export const SingleMode = {
  unlockedAchievementIds: new Set(),
  latestAchievementId: null,
  pendingAchievementsThisAction: [],
  isShowingAchievementAnimation: false,

  sessionTracker: {
    hasReservedThisGame: false,
    purchasedCardsCount: 0,
    purchasedCardsCountLv1: 0, 
    lv1CardsCountBeforeTurn10: 0,
    singleTurnScoreGained: 0,
    goldUsedInThisPurchase: false
  },

  loadTalentPool() {
    const savedProgress = localStorage.getItem('splendor_saved_progress_2026');
    const s = CoreState.get().settings;
    if (savedProgress) {
      try {
        const data = JSON.parse(savedProgress);
        s.difficulty = data.difficulty || 'easy';
        s.talentPool = data.talentPool || [];
        s.selectedAssistant = data.selectedAssistant || null;
      } catch(e) {}
    }
  },

  saveCurrentProgress() {
    const s = CoreState.get().settings;
    const progressData = { difficulty: s.difficulty, talentPool: s.talentPool, selectedAssistant: s.selectedAssistant };
    localStorage.setItem('splendor_saved_progress_2026', JSON.stringify(progressData));
    alert('💾 皇家進度已成功保存！');
  },

  // 【修正 3】解鎖成就後，更新頂部成就欄的最新成就文字
  triggerAchievementUnlock(id) {
    if (this.unlockedAchievementIds.has(id)) return;
    this.unlockedAchievementIds.add(id);
    
    // 找到成就名稱並更新頂部顯示欄
    const found = ALL_ACHIEVEMENTS.find(a => a.id === id);
    if (found) {
      const latestEl = document.getElementById('ach-latest-field');
      if (latestEl) latestEl.textContent = `🏆 最新成就：${found.title} — ${found.desc}`;
    }
    
    if (typeof window.playAchievementSfx === 'function') {
      window.playAchievementSfx('easy');
    }
  },

  auditInstantAchievements(actionType, meta) {
    const state = CoreState.get();
    const p = state.player;
    if (actionType === "takeDiff" && meta.count === 3) this.triggerAchievementUnlock(1);
    if (actionType === "takeSame") this.triggerAchievementUnlock(2);
    if (p.tokens.o >= 3) this.triggerAchievementUnlock(4);
  },

  auditEndGameAchievements() {
    const state = CoreState.get();
    const totalTurns = state.turn - 1;
    const diffResultTxtEl = document.getElementById('modal-diff-result-txt');
    if (diffResultTxtEl) {
      diffResultTxtEl.innerHTML = `👑 戰局結算：本次單人對局耗時 ${totalTurns} 回合。`;
    }
  },

  renderTalentPoolModalUI() {},
  renderActiveAssistantUI() {},

  // 【修正 1】補全 openAchievementHistory()，實作點擊成就欄後開啟彈窗並顯示已解鎖成就
  openAchievementHistory() {
    const container = document.getElementById('ach-matrix-injector');
    if (container) {
      container.innerHTML = ALL_ACHIEVEMENTS.map(a => {
        const unlocked = this.unlockedAchievementIds.has(a.id);
        return `
          <div class="ach-item ${unlocked ? 'unlocked' : 'locked'}">
            <div class="ach-icon">${unlocked ? '🏆' : '🔒'}</div>
            <div class="ach-info">
              <div class="ach-title">${unlocked ? a.title : '???'}</div>
              <div class="ach-desc">${unlocked ? a.desc : '尚未解鎖'}</div>
            </div>
          </div>
        `;
      }).join('');
    }
    const statsEl = document.getElementById('ach-stats-field');
    if (statsEl) { 
      statsEl.textContent = `${this.unlockedAchievementIds.size} / ${ALL_ACHIEVEMENTS.length}`; 
      statsEl.style.display = ''; 
    }
    document.getElementById('ach-history-modal-container')?.classList.add('show');
  },

  // 【修正 2】補全 closeAchievementHistory()
  closeAchievementHistory() {
    document.getElementById('ach-history-modal-container')?.classList.remove('show');
    const statsEl = document.getElementById('ach-stats-field');
    if (statsEl) statsEl.style.display = 'none';
  }
};

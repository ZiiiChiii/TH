// core/singleMode.js
import { CoreState } from './state.js';

// 【修正 1】定義成就清單常數放在 singleMode.js 頂部
const ALL_ACHIEVEMENTS = [
  { id: 1, title: "初試身手", desc: "第一次拿取 3 個不同顏色籌碼" },
  { id: 2, title: "同色雙收", desc: "第一次拿取 2 個相同顏色籌碼" },
  { id: 4, title: "黃金持有者", desc: "同時持有 3 顆以上黃金籌碼" }
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

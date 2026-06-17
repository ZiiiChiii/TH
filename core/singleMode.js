// core/singleMode.js
import { CoreState } from './state.js';

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

  triggerAchievementUnlock(id) {
    if (this.unlockedAchievementIds.has(id)) return;
    this.unlockedAchievementIds.add(id);
    // 【修正 4】成就音效改為安全呼叫判定
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
  openAchievementHistory() {},
  closeAchievementHistory() {}
};
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

const NOON_NOBLE_IMAGES = [
  "https://i.ibb.co/zHGC8vsm/image.png", "https://i.ibb.co/QvHvZZWc/image.png", "https://i.ibb.co/hzw3Vfm/image.png",
  "https://i.ibb.co/nNSjxvvd/image.png", "https://i.ibb.co/67w5Lbjg/image.png", "https://i.ibb.co/8gJK15HN/image.png",
  "https://i.ibb.co/DDCcYWwX/image.png", "https://i.ibb.co/twnJGmm0/image.png", "https://i.ibb.co/rGGhc41x/image.png",
  "https://i.ibb.co/JjvCKgMm/image.png", "https://i.ibb.co/xSv0th2K/image.png", "https://i.ibb.co/dwsGHwHv/image.png",
  "https://i.ibb.co/GQ2Yh0yH/image.png", "https://i.ibb.co/C3J5y1YY/image.png", "https://i.ibb.co/zTgwrwjz/image.png",
  "https://i.ibb.co/Q7zdjpKt/image.png", "https://i.ibb.co/7tghmFD6/image.png", "https://i.ibb.co/1tvK72P3/image.png",
  "https://i.ibb.co/0pZCRHx7/image.png", "https://i.ibb.co/PsNV1NKC/image.png", "https://i.ibb.co/N2g1rhFp/image.png",
  "https://i.ibb.co/KcbQYgmQ/image.png", "https://i.ibb.co/PzjqmHYQ/image.png", "https://i.ibb.co/xSJsNHRv/image.png",
  "https://i.ibb.co/N28cjs5Z/image.png"
];

let lastRenderedCardIds = new Set();
let lastPlayerState = null; 

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
  {id:"n1",  name:"01 赫克特",   gender:"male",   points:3, img:"https://i.ibb.co/zHGC8vsm/image.png", req:{w:3, u:3, g:3}},
  {id:"n2",  name:"02 羅蘭德",   gender:"male",   points:3, img:"https://i.ibb.co/QvHvZZWc/image.png", req:{u:3, g:3, r:3}},
  {id:"n3",  name:"03 亞瑟",     gender:"male",   points:3, img:"https://i.ibb.co/hzw3Vfm/image.png",  req:{g:3, r:3, k:3}},
  {id:"n4",  name:"04 查理曼",   gender:"male",   points:3, img:"https://i.ibb.co/nNSjxvvd/image.png", req:{w:3, u:3, k:3}},
  {id:"n5",  name:"05 蘭斯洛特", gender:"male",   points:3, img:"https://i.ibb.co/67w5Lbjg/image.png", req:{w:3, r:3, k:3}},
  {id:"n6",  name:"06 鮑德溫",   gender:"male",   points:3, img:"https://i.ibb.co/8gJK15HN/image.png", req:{w:4, k:4}},
  {id:"n7",  name:"07 高文",     gender:"male",   points:3, img:"https://i.ibb.co/DDCcYWwX/image.png", req:{u:4, r:4}},
  {id:"n8",  name:"08 貝德維爾", gender:"male",   points:3, img:"https://i.ibb.co/twnJGmm0/image.png", req:{g:4, r:4}},
  {id:"n9",  name:"09 珀西瓦里", gender:"male",   points:3, img:"https://i.ibb.co/rGGhc41x/image.png", req:{w:4, u:4}},
  {id:"n10", name:"10 崔斯坦",   gender:"male",   points:3, img:"https://i.ibb.co/JjvCKgMm/image.png", req:{u:4, g:4}},
  {id:"n11", name:"11 尤瑟",     gender:"male",   points:3, img:"https://i.ibb.co/xSv0th2K/image.png", req:{g:4, k:4}},
  {id:"n12", name:"12 艾德華",   gender:"male",   points:3, img:"https://i.ibb.co/dwsGHwHv/image.png", req:{r:4, k:4}},
  {id:"n13", name:"01 桂妮薇兒", gender:"female", points:3, img:"https://i.ibb.co/GQ2Yh0yH/image.png", req:{w:3, u:3, g:3}},
  {id:"n14", name:"02 摩根娜",   gender:"female", points:3, img:"https://i.ibb.co/C3J5y1YY/image.png", req:{u:3, g:3, r:3}},
  {id:"n15", name:"03 薇薇安",   gender:"female", points:3, img:"https://i.ibb.co/zTgwrwjz/image.png", req:{g:3, r:3, k:3}},
  {id:"n16", name:"04 艾蓮娜",   gender:"female", points:3, img:"https://i.ibb.co/Q7zdjpKt/image.png", req:{w:3, r:3, k:3}},
  {id:"n17", name:"05 奧古斯塔", gender:"female", points:3, img:"https://i.ibb.co/7tghmFD6/image.png", req:{w:4, k:4}},
  {id:"n18", name:"06 碧翠絲",   gender:"female", points:3, img:"https://i.ibb.co/1tvK72P3/image.png", req:{u:4, r:4}},
  {id:"n19", name:"07 凱瑟琳",   gender:"female", points:3, img:"https://i.ibb.co/0pZCRHx7/image.png", req:{g:4, r:4}},
  {id:"n20", name:"08 瑪格麗特", gender:"female", points:3, img:"https://i.ibb.co/PsNV1NKC/image.png", req:{w:4, u:4}},
  {id:"n21", name:"09 伊莉莎白", gender:"female", points:3, img:"https://i.ibb.co/N2g1rhFp/image.png", req:{u:4, g:4}},
  {id:"n22", name:"10 維多利亞", gender:"female", points:3, img:"https://i.ibb.co/KcbQYgmQ/image.png", req:{g:4, k:4}},
  {id:"n23", name:"11 塞西莉亞", gender:"female", points:3, img:"https://i.ibb.co/PzjqmHYQ/image.png", req:{r:4, k:4}},
  {id:"n24", name:"12 阿格妮絲", gender:"female", points:3, img:"https://i.ibb.co/xSJsNHRv/image.png", req:{w:3, u:3, r:3}},
  {id:"n25", name:"13 伊莎貝拉", gender:"female", points:3, img:"https://i.ibb.co/N28cjs5Z/image.png", req:{w:3, g:3, k:3}}
];

let globalTalentPoolIds = [];   
let selectedAssistantId = null; 
let currentDifficulty = 'easy'; 
let isMusicMuted = false;
let isSfxMuted = false; 

// 統一按鈕與選單點擊基本音效
function playUniformSfx() {
  const uniformSfx = document.getElementById('sfx-select');
  if (uniformSfx && !isSfxMuted) {
    uniformSfx.currentTime = 0;
    uniformSfx.play().catch(e => console.log(e));
  }
}

// 專門播放確認拿取籌碼時的音效
function playActionGemSfx() {
  const gemSfx = document.getElementById('sfx-gem');
  if (gemSfx && !isSfxMuted) {
    gemSfx.currentTime = 0;
    gemSfx.play().catch(e => console.log(e));
  }
}

function loadTalentPool() {
  const savedProgress = localStorage.getItem('splendor_saved_progress_2026');
  if (savedProgress) {
    try {
      const data = JSON.parse(savedProgress);
      currentDifficulty = data.difficulty || 'easy';
      globalTalentPoolIds = data.talentPool || [];
      selectedAssistantId = data.selectedAssistant || null;
      if (globalTalentPoolIds.length === 0) {
        selectedAssistantId = null;
      }
    } catch(e) {
      fallbackToLegacyStorage();
    }
  } else {
    fallbackToLegacyStorage();
  }
}

function fallbackToLegacyStorage() {
  const saved = localStorage.getItem('splendor_noble_talent_pool_2026');
  if (saved) {
    try { globalTalentPoolIds = JSON.parse(saved); } catch(e) { globalTalentPoolIds = []; }
  }
  const savedDiff = localStorage.getItem('splendor_difficulty_2026');
  if (savedDiff) currentDifficulty = savedDiff;
}

function saveCurrentProgress() {
  const progressData = {
    difficulty: currentDifficulty,
    talentPool: globalTalentPoolIds,
    selectedAssistant: selectedAssistantId
  };
  localStorage.setItem('splendor_saved_progress_2026', JSON.stringify(progressData));
  alert('💾 皇家進度已成功保存！(已記錄當前難易度及人才庫狀態)');
}

function saveTalentPool() {
  localStorage.setItem('splendor_noble_talent_pool_2026', JSON.stringify(globalTalentPoolIds));
}

const ACHIEVEMENT_DEFINITIONS = [
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

let state = {};
let selectedDiff = [];
let selectedSame = null;

let unlockedAchievementIds = new Set();
let latestAchievementId = null;
let pendingAchievementsThisAction = [];
let isShowingAchievementAnimation = false;

let sessionTracker = {
  hasReservedThisGame: false,
  purchasedCardsCount: 0,
  lv1CardsCountBeforeTurn10: 0,
  singleTurnScoreGained: 0,
  goldUsedInThisPurchase: false
};

const audioEl = document.getElementById('bg-music');
const sfxGemEl = document.getElementById('sfx-gem');
const sfxBuyEl = document.getElementById('sfx-buy');
const sfxReserveEl = document.getElementById('sfx-reserve');
const sfxSelectEl = document.getElementById('sfx-select');
const sfxUnselectEl = document.getElementById('sfx-unselect');

const sfxAchievementsMap = {
  easy: document.getElementById('sfx-ach-easy'),
  normal: document.getElementById('sfx-ach-normal'),
  hard: document.getElementById('sfx-ach-hard'),
  expert: document.getElementById('sfx-ach-expert'),
  master: document.getElementById('sfx-ach-master')
};

const sfxNobleMale = document.getElementById('sfx-noble-male');
const sfxNobleFemale = document.getElementById('sfx-noble-female');


/* ── ⚙️ 選項彈窗、人才庫、音效控制模組 ────────────────── */
function openGameOptionsModal() {
  document.getElementById('menu-toggle-music').textContent = isMusicMuted ? "🔇 背景音樂：靜音" : "🎵 背景音樂：開啟";
  document.getElementById('menu-toggle-sfx').textContent = isSfxMuted ? "🔇 遊戲音效：靜音" : "🔊 遊戲音效：開啟";
  
  document.querySelectorAll('.diff-opt-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-diff') === currentDifficulty) {
      btn.classList.add('active');
    }
  });
  
  document.getElementById('game-options-modal').classList.add('show');
}

function closeGameOptionsModal() {
  document.getElementById('game-options-modal').classList.remove('show');
}

function handleMusicToggle() {
  if (isMusicMuted) {
    isMusicMuted = false;
    audioEl.play().catch(err => {});
  } else {
    isMusicMuted = true;
    audioEl.pause();
  }
  document.getElementById('menu-toggle-music').textContent = isMusicMuted ? "🔇 背景音樂：靜音" : "🎵 背景音樂：開啟";
}

function handleSfxToggle() {
  isSfxMuted = !isSfxMuted;
  document.getElementById('menu-toggle-sfx').textContent = isSfxMuted ? "🔇 遊戲音效：靜音" : "🔊 遊戲音效：開啟";
}

/* 🏛️ 人才庫模組視窗內部處理 */
function openTalentPoolModal() {
  renderTalentPoolModalUI();
  document.getElementById('talent-pool-modal').classList.add('show');
}

function closeTalentPoolModal() {
  document.getElementById('talent-pool-modal').classList.remove('show');
  renderActiveAssistantUI(); 
}

function renderTalentPoolModalUI() {
  const modalLayer = document.getElementById('talent-pool-modal-layer');
  if (globalTalentPoolIds.length === 0) {
    modalLayer.innerHTML = `<p style="font-size:0.75rem; color:var(--text-muted); padding: 20px 0; grid-column: span 2; text-align:center;">人才庫目前空空如也！<br>需在對局限時內成功通關，方可在此保留解鎖隨行貴族。</p>`;
    return;
  }

  modalLayer.innerHTML = globalTalentPoolIds.map(id => {
    const nobleMeta = ALL_NOBLES_POOL.find(n => n.id === id);
    if (!nobleMeta) return '';
    const isSelected = selectedAssistantId === id ? 'selected' : '';
    return `
      <div class="talent-mini-card ${isSelected}" onclick="playUniformSfx(); selectAssistant('${id}')">
        <img src="${nobleMeta.img}" alt="${nobleMeta.name}">
        <span>${nobleMeta.name}</span>
      </div>
    `;
  }).join('');
}

window.selectAssistant = function(id) {
  if (selectedAssistantId === id) {
    selectedAssistantId = null; 
  } else {
    selectedAssistantId = id;
  }
  renderTalentPoolModalUI();
};

function renderActiveAssistantUI() {
  const assistantLayer = document.getElementById('assistant-display-layer');
  if (!selectedAssistantId) {
    assistantLayer.innerHTML = `<p style="font-size:0.55rem; color:var(--text-muted);">孤軍奮戰中</p>`;
    return;
  }

  const nobleMeta = ALL_NOBLES_POOL.find(n => n.id === selectedAssistantId);
  if (nobleMeta) {
    assistantLayer.innerHTML = `
      <div class="earned-noble-mini" style="border-style: solid; background: rgba(212,175,55,0.15); width:100%">
        <img src="${nobleMeta.img}">
        <span style="font-weight:700;">${nobleMeta.name} (伴隨中)</span>
      </div>
    `;
  }
}

/* 🟢 對局難易度切換與警告機制 */
window.changeGameDifficultyWithWarning = function(diffLevel) {
  if (currentDifficulty === diffLevel) return;

  const confirmChange = confirm("⚠️ 警告：您正在中途變更皇家貿易商會難易度！\n變更難易度將會徹底清空當前儲存的【皇家貴族人才庫】與重置無名貴族。確定要執行變更嗎？");
  
  if (confirmChange) {
    globalTalentPoolIds = [];
    selectedAssistantId = null;
    saveTalentPool();
    
    currentDifficulty = diffLevel;
    localStorage.setItem('splendor_difficulty_2026', diffLevel);
    
    document.querySelectorAll('.diff-opt-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('data-diff') === diffLevel) {
        btn.classList.add('active');
      }
    });

    alert(`難易度已重置變更，人才庫已被清空，無名貴族也已重置。`);
    renderActiveAssistantUI();
    initGame(); 
  }
};


/* ── 🏆 成就檢定核心運算與播放佇列引擎 ────────────────────────── */
function triggerAchievementUnlock(id) {
  if (unlockedAchievementIds.has(id)) return;
  unlockedAchievementIds.add(id);
  
  const def = ACHIEVEMENT_DEFINITIONS.find(d => d.id === id);
  if (def) {
    pendingAchievementsThisAction.push(def);
  }
  
  if (id !== 30 && unlockedAchievementIds.size >= 20) {
    triggerAchievementUnlock(30);
  }
}

function processPendingAchievementsQueue(callback) {
  if (pendingAchievementsThisAction.length === 0) {
    if (callback) callback();
    return;
  }

  if (isShowingAchievementAnimation) {
    if (callback) callback();
    return;
  }
  
  isShowingAchievementAnimation = true;
  const latestField = document.getElementById('ach-latest-field');
  const achievementsToShow = [...pendingAchievementsThisAction];
  pendingAchievementsThisAction = [];
  
  let currentIdx = 0;
  
  function renderNextAch() {
    if (currentIdx >= achievementsToShow.length) {
      isShowingAchievementAnimation = false;
      if (callback) callback();
      return;
    }
    
    const currentAch = achievementsToShow[currentIdx];
    latestAchievementId = currentAch.id;
    
    let tierText = "簡單";
    if (currentAch.tier === "normal") tierText = "中階";
    if (currentAch.tier === "hard") tierText = "進階";
    if (currentAch.tier === "expert") tierText = "困難";
    if (currentAch.tier === "master") tierText = "神人";
    
    latestField.innerHTML = `<span style="color: ${currentAch.color}; font-weight: 800;">${currentAch.symbol} [${tierText}] ${currentAch.name}</span>`;
    latestField.classList.remove('has-ach');
    void latestField.offsetWidth; 
    latestField.classList.add('has-ach');
    
    const targetSFX = sfxAchievementsMap[currentAch.tier] || sfxAchievementsMap['easy'];
    if (targetSFX && !isSfxMuted) {
      targetSFX.currentTime = 0;
      targetSFX.play().catch(e => {});
    }
    
    currentIdx++;
    
    if (currentIdx < achievementsToShow.length) {
      setTimeout(renderNextAch, 1500);
    } else {
      isShowingAchievementAnimation = false;
      if (callback) callback();
    }
  }
  
  renderNextAch();
}

function auditInstantAchievements(actionType, meta) {
  const p = state.player;
  
  if (actionType === "takeDiff" && meta.count === 3) triggerAchievementUnlock(1);
  if (actionType === "takeSame") triggerAchievementUnlock(2);
  if (p.tokens.o >= 3) triggerAchievementUnlock(4);
  
  let totalTokens = 0;
  for (let k in p.tokens) totalTokens += p.tokens[k];
  if (totalTokens === 10) triggerAchievementUnlock(5);
  
  if (p.tokens.w >= 1 && p.tokens.u >= 1 && p.tokens.g >= 1 && p.tokens.r >= 1 && p.tokens.k >= 1) {
    triggerAchievementUnlock(7);
  }
  if (actionType === "reserve") triggerAchievementUnlock(9);
  if (p.reserved.length === 3) triggerAchievementUnlock(10);
  
  if (actionType === "buy") {
    triggerAchievementUnlock(3);
    if (!sessionTracker.goldUsedInThisPurchase) triggerAchievementUnlock(6);
    if (meta.totalGemsSpent === 0) triggerAchievementUnlock(8);
    if (meta.card.points > 0) triggerAchievementUnlock(13);
    if (meta.level === "lv3") triggerAchievementUnlock(14);
    if (meta.isReserved && p.reserved.length === 0) triggerAchievementUnlock(16);
    if (p.bonus[meta.card.provides] >= 4) triggerAchievementUnlock(17);
    if (meta.card.points >= 4) triggerAchievementUnlock(18);
  }
}

/* ── 難易度通關判定邏輯 ────────────────────────── */
function auditEndGameAchievements() {
  const p = state.player;
  const totalTurns = state.turn - 1;
  
  let lv1Holdings = sessionTracker.purchasedCardsCountLv1 || 0; 
  if (lv1Holdings >= 8) triggerAchievementUnlock(12);

  if (totalTurns < 35) triggerAchievementUnlock(19);
  if (!sessionTracker.hasReservedThisGame) triggerAchievementUnlock(20);
  
  const earnedNobles = state.nobles.filter(n => n.completed);
  if (earnedNobles.length === 0) triggerAchievementUnlock(21);
  if (earnedNobles.length * 3 >= 9) triggerAchievementUnlock(22);
  if (earnedNobles.length >= 2) triggerAchievementUnlock(25);
  
  if (p.tokens.o === 0) triggerAchievementUnlock(23);
  
  if (p.bonus.w >= 3 && p.bonus.u >= 3 && p.bonus.g >= 3 && p.bonus.r >= 3 && p.bonus.k >= 3) {
    triggerAchievementUnlock(24);
  }
  
  if (totalTurns < 25) triggerAchievementUnlock(26);
  if (p.score === 15) triggerAchievementUnlock(28);
  if (totalTurns < 20) triggerAchievementUnlock(29);

  let targetLimit = 30; 
  let diffChineseName = "簡單";
  if (currentDifficulty === 'easy') { targetLimit = 30; diffChineseName = "簡單"; }
  else if (currentDifficulty === 'normal') { targetLimit = 28; diffChineseName = "普通"; }
  else if (currentDifficulty === 'hard') { targetLimit = 25; diffChineseName = "困難"; }
  else if (currentDifficulty === 'expert') { targetLimit = 22; diffChineseName = "極限"; }
  else if (currentDifficulty === 'master') { targetLimit = 20; diffChineseName = "神人"; }

  const diffResultTxtEl = document.getElementById('modal-diff-result-txt');

  if (totalTurns <= targetLimit) {
    let newlySavedCount = 0;
    earnedNobles.forEach(n => {
      if (n.id && !n.isNoName && !globalTalentPoolIds.includes(n.id)) {
        globalTalentPoolIds.push(n.id);
        newlySavedCount++;
      }
    });
    if (newlySavedCount > 0) saveTalentPool();
    
    diffResultTxtEl.innerHTML = `👑 戰局檢定：成功在 <strong>${diffChineseName}模式 (${targetLimit} 回合內)</strong> 通關！<br>已為您永久保留並解鎖本局拜訪的貴族至人才庫。`;
    diffResultTxtEl.style.color = "#2ecc71";
  } else {
    diffResultTxtEl.innerHTML = `⏳ 戰局檢定：本次通關花費了 ${totalTurns} 回合，未能達到 <strong>${diffChineseName}模式 (${targetLimit} 回合)</strong> 保留門檻，貴族返回封地。`;
    diffResultTxtEl.style.color = "#e67e22";
  }
}

/* ── 🏆 成就履歷視窗介面渲染 ────────────────────────── */
function openAchievementHistory() {
  const statsEl = document.getElementById('ach-stats-field');
  if (statsEl) { statsEl.textContent = `${unlockedAchievementIds.size} / 30`; statsEl.style.display = ''; }
  const container = document.getElementById('ach-matrix-injector');
  container.innerHTML = ACHIEVEMENT_DEFINITIONS.map(def => {
    const isUnlocked = unlockedAchievementIds.has(def.id);
    const statusText = isUnlocked ? "已達成" : "未解鎖";
    let tierText = "簡單";
    if (def.tier === "normal") tierText = "中階";
    if (def.tier === "hard") tierText = "進階";
    if (def.tier === "expert") tierText = "困難";
    if (def.tier === "master") tierText = "神人";
    
    return `
      <div class="ach-item-row ${isUnlocked ? 'unlocked' : ''}" style="border-left: 4px solid ${def.color};">
        <div class="ach-row-meta">
          <div class="ach-row-name">${def.symbol} ${def.name}</div>
          <div class="ach-row-desc">${def.desc}</div>
        </div>
        <div class="ach-row-tag" style="background: ${def.color}; font-weight:800; font-size:0.65rem;">${statusText}</div>
      </div>
    `;
  }).join('');
  document.getElementById('ach-history-modal-container').classList.add('show');
}

function closeAchievementHistory() {
  document.getElementById('ach-history-modal-container').classList.remove('show');
  const statsEl = document.getElementById('ach-stats-field');
  if (statsEl) statsEl.style.display = 'none';
}


/* ── 🎴 遊戲核心邏輯架構 ────────────────────────────────────── */
function deepClone(obj) { return JSON.parse(JSON.stringify(obj)); }

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function initGame() {
  selectedDiff = [];
  selectedSame = null;
  document.getElementById('error-msg').textContent = '';
  
  sessionTracker = {
    hasReservedThisGame: false,
    purchasedCardsCount: 0,
    purchasedCardsCountLv1: 0, 
    lv1CardsCountBeforeTurn10: 0,
    singleTurnScoreGained: 0,
    goldUsedInThisPurchase: false
  };

  const pool1 = deepClone(RAW_CARDS.lv1);
  const pool2 = deepClone(RAW_CARDS.lv2);
  const pool3 = deepClone(RAW_CARDS.lv3);
  shuffle(pool1); shuffle(pool2); shuffle(pool3);

  let noblesCount = 3;
  if (currentDifficulty === 'easy' || currentDifficulty === 'expert' || currentDifficulty === 'master') {
    noblesCount = 5;
  }

  const shuffledNoblesPool = deepClone(ALL_NOBLES_POOL);
  shuffle(shuffledNoblesPool);
  
  let gameNobles = [];
  let addedIds = new Set();

  if (selectedAssistantId) {
    const assistantMeta = shuffledNoblesPool.find(n => n.id === selectedAssistantId);
    if (assistantMeta) {
      gameNobles.push({ ...assistantMeta, completed: false, isNoName: false });
      addedIds.add(selectedAssistantId);
    }
  }

  for (let i = 0; i < shuffledNoblesPool.length; i++) {
    if (gameNobles.length >= noblesCount) break;
    const n = shuffledNoblesPool[i];
    if (!addedIds.has(n.id)) {
      gameNobles.push({ ...n, completed: false, isNoName: false });
      addedIds.add(n.id);
    }
  }

  while (gameNobles.length < noblesCount) {
    const randomReq = {};
    const t1 = GEM_TYPES[Math.floor(Math.random()*5)];
    let t2 = GEM_TYPES[Math.floor(Math.random()*5)];
    while(t2 === t1) { t2 = GEM_TYPES[Math.floor(Math.random()*5)]; }
    randomReq[t1] = 4; randomReq[t2] = 4;
    
    gameNobles.push({
      id: "noname_" + Math.random(),
      name: "無名貴族爵士",
      gender: Math.random() > 0.5 ? "male" : "female",
      points: 3,
      img: NOON_NOBLE_IMAGES[Math.floor(Math.random() * NOON_NOBLE_IMAGES.length)],
      req: randomReq,
      isNoName: true
    });
  }

  state = {
    turn: 1,
    bank: { w: 5, u: 5, g: 5, r: 5, k: 5, o: 5 },
    player: {
      tokens: { w: 0, u: 0, g: 0, r: 0, k: 0, o: 0 },
      bonus: { w: 0, u: 0, g: 0, r: 0, k: 0 },
      reserved: [],
      score: 0
    },
    nobles: gameNobles,
    decks: { lv1: pool1, lv2: pool2, lv3: pool3 },
    board: { lv1: [], lv2: [], lv3: [] }
  };

  for (let i = 0; i < 4; i++) {
    if (state.decks.lv1.length) state.board.lv1.push(state.decks.lv1.pop());
    if (state.decks.lv2.length) state.board.lv2.push(state.decks.lv2.pop());
    if (state.decks.lv3.length) state.board.lv3.push(state.decks.lv3.pop());
  }

  lastRenderedCardIds.clear();
  lastPlayerState = null;

  render();
}

/* ── 🪙 背包籌碼更新與顏色閃爍特效控制器 ────────────────── */
function renderDashboard() {
  const p = state.player;
  const resLayer = document.getElementById('res-layer');
  
  let totalTokens = 0;
  for (let k in p.tokens) totalTokens += p.tokens[k];

  let diffs = { tokens: {}, bonus: {} };
  if (lastPlayerState) {
    for (let k in p.tokens) diffs.tokens[k] = p.tokens[k] - lastPlayerState.tokens[k];
    for (let k in p.bonus) diffs.bonus[k] = p.bonus[k] - lastPlayerState.bonus[k];
  }

  let html = '';
  const allKeys = ['w', 'u', 'g', 'r', 'k', 'o'];
  
  allKeys.forEach(k => {
    const tokenVal = p.tokens[k] || 0;
    const bonusVal = p.bonus[k] || 0;
    const isGold = (k === 'o');
    
    let tDiffHtml = '';
    if (diffs.tokens[k] > 0) tDiffHtml = `<span class="floating-diff plus">+${diffs.tokens[k]}</span>`;
    else if (diffs.tokens[k] < 0) tDiffHtml = `<span class="floating-diff minus">${diffs.tokens[k]}</span>`;

    let bDiffHtml = '';
    if (!isGold && diffs.bonus[k] > 0) {
      bDiffHtml = `<span class="floating-permanent-anim">+${diffs.bonus[k]} 🛡️</span>`;
    }

    let pulseClass = '';
    if (diffs.tokens[k] !== 0 || (!isGold && diffs.bonus[k] !== 0)) {
      pulseClass = 'animate-pulse-glow';
    }

    html += `
      <div class="res-block ${pulseClass}">
        ${tDiffHtml}
        ${bDiffHtml}
        <div class="res-circle ${GEM_CLASSES[k]}"></div>
        <div class="res-text-group">
          <span class="res-count">${tokenVal}</span>
          ${!isGold ? (bonusVal > 0 ? `<span class="res-bonus">+${bonusVal}</span>` : `<span class="res-bonus" style="visibility:hidden;">+0</span>`) : `<span class="res-bonus" style="color:#968a7f; font-size:0.55rem;">百搭</span>`}
        </div>
      </div>
    `;
  });
  
  resLayer.innerHTML = html;

  const capTxtEl = document.getElementById('cap-txt');
  capTxtEl.textContent = `背包: ${totalTokens} / 10`;
  
  capTxtEl.classList.remove('bag-warning-yellow', 'bag-danger-red');
  if (totalTokens === 10) {
    capTxtEl.classList.add('bag-danger-red');
  } else if (totalTokens > 7) {
    capTxtEl.classList.add('bag-warning-yellow');
  }

  lastPlayerState = deepClone(p);
}

function renderNobles() {
  const layer = document.getElementById('nobles-layer');
  layer.innerHTML = state.nobles.map(n => {
    let reqHtml = '';
    for (let k in n.req) {
      reqHtml += `
        <div class="noble-req-item">
          <span class="cost-dot-circle ${GEM_CLASSES[k]}"></span>
          <span>${n.req[k]}</span>
        </div>
      `;
    }
    return `
      <div class="noble-card ${n.completed ? 'completed' : ''}">
        <img class="noble-img" src="${n.img}" alt="${n.name}">
        <div class="noble-overlay">
          <div class="card-top">
            <span class="noble-pts">${n.points}</span>
            <span class="noble-name">${n.name}</span>
          </div>
          <div class="noble-reqs">${reqHtml}</div>
        </div>
      </div>
    `;
  }).join('');

  const earnedLayer = document.getElementById('earned-nobles-layer');
  const completedNobles = state.nobles.filter(n => n.completed);
  if (completedNobles.length === 0) {
    earnedLayer.innerHTML = `<p style="font-size:0.55rem; color:var(--text-muted); padding:4px 0;">尚無貴族拜訪</p>`;
  } else {
    earnedLayer.innerHTML = completedNobles.map(n => `
      <div class="earned-noble-mini">
        <img src="${n.img}">
        <span>${n.name}</span>
      </div>
    `).join('');
  }
}

function renderActionPanel() {
  const diffSelectors = document.getElementById('diff-selectors');
  diffSelectors.innerHTML = GEM_TYPES.map(k => {
    const isSelected = selectedDiff.includes(k) ? 'selected' : '';
    const bankEmpty = (state.bank[k] || 0) <= 0;
    const disabledAttr = bankEmpty ? 'disabled style="opacity:0.08;"' : '';
    return `
      <div class="token-container-cell">
        <button class="token-btn ${GEM_BTN_CLASSES[k]} ${isSelected}" ${disabledAttr} onclick="toggleSelectDiff('${k}')"></button>
        <span class="token-count-label">庫存:${state.bank[k]}</span>
      </div>
    `;
  }).join('');

  const sameSelectors = document.getElementById('same-selectors');
  sameSelectors.innerHTML = GEM_TYPES.map(k => {
    const isSelected = selectedSame === k ? 'selected' : '';
    const canTakeSame = (state.bank[k] || 0) >= 2; 
    const disabledAttr = !canTakeSame ? 'disabled style="opacity:0.08;"' : '';
    return `
      <div class="token-container-cell">
        <button class="token-btn ${GEM_BTN_CLASSES[k]} ${isSelected}" ${disabledAttr} onclick="toggleSelectSame('${k}')"></button>
        <span class="token-count-label">庫存:${state.bank[k]}</span>
      </div>
    `;
  }).join('');

  const btnDiff = document.getElementById('btn-do-diff');
  btnDiff.disabled = (selectedDiff.length === 0);
  
  const btnSame = document.getElementById('btn-do-same');
  btnSame.disabled = (selectedSame === null);
}

function renderCard(card, level, idx, isReserved = false) {
  if (!card) {
    return `<div class="card empty">已全數售罄</div>`;
  }

  const isNewCard = !lastRenderedCardIds.has(card.id);
  let animationClass = isNewCard ? 'animate-deal' : '';

  let costHtml = '';
  for (let k in card.cost) {
    const reqAmount = card.cost[k];
    const playerHasBonus = state.player.bonus[k] || 0;
    const playerHasToken = state.player.tokens[k] || 0;
    const netCost = Math.max(0, reqAmount - playerHasBonus);
    
    let dotStateStyle = '';
    if (netCost === 0) dotStateStyle = 'free';

    costHtml += `
      <div class="cost-dot ${dotStateStyle}">
        <span class="cost-dot-circle ${GEM_CLASSES[k]}"></span>
        <span>${reqAmount}</span>
      </div>
    `;
  }

  const canBuyResult = canPlayerAffordCard(card);
  const buyDisabled = !canBuyResult.affordable ? 'disabled' : '';
  const reserveDisabled = (!isReserved && state.player.reserved.length >= 3) ? 'disabled' : '';

  let imgUrl = "https://i.ibb.co/KxX2gxBP/1.jpg";
  if (CUSTOM_CARD_IMAGES[card.provides]) {
    const list = CUSTOM_CARD_IMAGES[card.provides];
    const hash = parseInt(card.id) || 0;
    imgUrl = list[hash % list.length];
  }

  let actionButtonsHtml = '';
  if (!isReserved) {
    actionButtonsHtml = `
      <div class="card-actions">
        <button class="btn-card" ${buyDisabled} onclick="buyBoardCard('${level}', ${idx})">收購</button>
        <button class="btn-card" ${reserveDisabled} onclick="reserveBoardCard('${level}', ${idx})">保留</button>
      </div>
    `;
  } else {
    actionButtonsHtml = `
      <div class="card-actions">
        <button class="btn-card" ${buyDisabled} onclick="buyReservedCard(${idx})">簽署收購</button>
      </div>
    `;
  }

  return `
    <div class="card ${animationClass}" id="dom-card-${card.id}" style="background-image: url('${imgUrl}');">
      <div class="card-content-wrapper">
        <div class="card-top">
          <span class="card-pts">${card.points > 0 ? card.points : ''}</span>
          <div class="card-gem-icon ${GEM_CLASSES[card.provides]}"></div>
        </div>
        <div>
          <div class="card-costs">${costHtml}</div>
          ${actionButtonsHtml}
        </div>
      </div>
    </div>
  `;
}

function renderMatrix() {
  ['lv1', 'lv2', 'lv3'].forEach(level => {
    const rowEl = document.getElementById(`row-${level}`);
    const deckCountEl = document.getElementById(`deck-${level}-txt`);
    deckCountEl.textContent = `剩餘: ${state.decks[level].length}`;

    let html = '';
    for (let i = 0; i < 4; i++) {
      html += renderCard(state.board[level][i], level, i, false);
    }
    rowEl.innerHTML = html;
  });

  const reservedLayer = document.getElementById('reserved-layer');
  if (state.player.reserved.length === 0) {
    reservedLayer.innerHTML = `
      <div class="card empty" style="grid-column: span 4; min-height:55px; height:55px;">
        🔒 當前保密保留區尚無契約手牌 (上限 3 張)
      </div>
    `;
  } else {
    let rHtml = '';
    for (let i = 0; i < 4; i++) {
      if (state.player.reserved[i]) {
        rHtml += renderCard(state.player.reserved[i], 'reserved', i, true);
      } else {
        rHtml += `<div class="card empty" style="min-height:55px; height:55px;">空位</div>`;
      }
    }
    reservedLayer.innerHTML = rHtml;
  }

  ['lv1', 'lv2', 'lv3'].forEach(lvl => {
    state.board[lvl].forEach(c => { if(c) lastRenderedCardIds.add(c.id); });
  });
  state.player.reserved.forEach(c => { if(c) lastRenderedCardIds.add(c.id); });
}

function render() {
  document.getElementById('turn-txt').textContent = state.turn;
  document.getElementById('score-txt').textContent = state.player.score;

  renderDashboard();
  renderNobles();
  renderActionPanel();
  renderMatrix();
}


/* ── 🪙 行動操控與條件檢定模組 ────────────────────── */
window.toggleSelectDiff = function(color) {
  document.getElementById('error-msg').textContent = '';
  selectedSame = null; 

  const idx = selectedDiff.indexOf(color);
  if (idx > -1) {
    selectedDiff.splice(idx, 1);
    if (!isSfxMuted && sfxUnselectEl) { sfxUnselectEl.currentTime = 0; sfxUnselectEl.play().catch(e=>{}); }
  } else {
    if (selectedDiff.length >= 3) {
      selectedDiff.shift();
    }
    selectedDiff.push(color);
    if (!isSfxMuted && sfxSelectEl) { sfxSelectEl.currentTime = 0; sfxSelectEl.play().catch(e=>{}); }
  }
  render();
};

window.toggleSelectSame = function(color) {
  document.getElementById('error-msg').textContent = '';
  selectedDiff = []; 

  if (selectedSame === color) {
    selectedSame = null;
    if (!isSfxMuted && sfxUnselectEl) { sfxUnselectEl.currentTime = 0; sfxUnselectEl.play().catch(e=>{}); }
  } else {
    selectedSame = color;
    if (!isSfxMuted && sfxSelectEl) { sfxSelectEl.currentTime = 0; sfxSelectEl.play().catch(e=>{}); }
  }
  render();
};

function checkBackpackCapacityAfterGain(incomingCount) {
  let currentTotal = 0;
  for (let k in state.player.tokens) currentTotal += state.player.tokens[k];
  return (currentTotal + incomingCount <= 10);
}

window.handleDoDiffClick = function() {
  if (selectedDiff.length === 0) return;
  
  if (!checkBackpackCapacityAfterGain(selectedDiff.length)) {
    document.getElementById('error-msg').textContent = '⚠️ 背包容量超出上限！單人版限制至多只能持有 10 顆籌碼，請先收購或保留卡片。';
    return;
  }

  playActionGemSfx();

  selectedDiff.forEach(k => {
    state.bank[k]--;
    state.player.tokens[k]++;
  });

  auditInstantAchievements("takeDiff", { count: selectedDiff.length });
  
  selectedDiff = [];
  endTurnFlow();
};

window.handleDoSameClick = function() {
  if (!selectedSame) return;

  if (!checkBackpackCapacityAfterGain(2)) {
    document.getElementById('error-msg').textContent = '⚠️ 背包容量超出上限！單人版限制至多只能持有 10 顆籌碼，請先收購或保留卡片。';
    return;
  }

  playActionGemSfx();

  const k = selectedSame;
  state.bank[k] -= 2;
  state.player.tokens[k] += 2;

  auditInstantAchievements("takeSame", { color: k });

  selectedSame = null;
  endTurnFlow();
};


/* ── 💳 卡片購買、百搭金幣扣抵與保留邏輯 ────────────────── */
function canPlayerAffordCard(card) {
  let neededGold = 0;
  let breakdown = { w: 0, u: 0, g: 0, r: 0, k: 0 };

  for (let k of GEM_TYPES) {
    const reqAmount = card.cost[k] || 0;
    const bonus = state.player.bonus[k] || 0;
    const net = Math.max(0, reqAmount - bonus);
    const token = state.player.tokens[k] || 0;

    if (token < net) {
      neededGold += (net - token);
      breakdown[k] = token; 
    } else {
      breakdown[k] = net; 
    }
  }

  if (state.player.tokens.o >= neededGold) {
    return { affordable: true, neededGold: neededGold, breakdown: breakdown };
  } else {
    return { affordable: false, neededGold: neededGold };
  }
}

function executeCardPurchaseEffects(card, breakdown, neededGold) {
  sessionTracker.goldUsedInThisPurchase = (neededGold > 0);

  let totalGemsSpent = 0;
  for (let k of GEM_TYPES) {
    const spent = breakdown[k] || 0;
    state.player.tokens[k] -= spent;
    state.bank[k] += spent;
    totalGemsSpent += spent;
  }

  if (neededGold > 0) {
    state.player.tokens.o -= neededGold;
    state.bank.o += neededGold;
    totalGemsSpent += neededGold;
  }

  state.player.bonus[card.provides]++;
  state.player.score += card.points;
  sessionTracker.singleTurnScoreGained += card.points;

  sessionTracker.purchasedCardsCount++;
  return { totalGemsSpent: totalGemsSpent };
}

window.buyBoardCard = function(level, idx) {
  const card = state.board[level][idx];
  if (!card) return;

  const afford = canPlayerAffordCard(card);
  if (!afford.affordable) return;

  const cardDom = document.getElementById(`dom-card-${card.id}`);
  if (cardDom) {
    cardDom.classList.add('animate-buy');
  }

  setTimeout(() => {
    if (!isSfxMuted && sfxBuyEl) { sfxBuyEl.currentTime = 0; sfxBuyEl.play().catch(e=>{}); }
    
    const meta = executeCardPurchaseEffects(card, afford.breakdown, afford.neededGold);
    
    if (level === 'lv1') {
      sessionTracker.purchasedCardsCountLv1 = (sessionTracker.purchasedCardsCountLv1 || 0) + 1;
      if (state.turn <= 10) {
        sessionTracker.lv1CardsCountBeforeTurn10++;
        if (sessionTracker.lv1CardsCountBeforeTurn10 === 5) triggerAchievementUnlock(11);
      }
    }

    let newCard = null;
    if (state.decks[level].length > 0) {
      newCard = state.decks[level].pop();
    }
    state.board[level][idx] = newCard;

    auditInstantAchievements("buy", { card: card, level: level, totalGemsSpent: meta.totalGemsSpent, isReserved: false });
    endTurnFlow();
  }, 280);
};

window.buyReservedCard = function(idx) {
  const card = state.player.reserved[idx];
  if (!card) return;

  const afford = canPlayerAffordCard(card);
  if (!afford.affordable) return;

  const cardDom = document.getElementById(`dom-card-${card.id}`);
  if (cardDom) cardDom.classList.add('animate-buy');

  setTimeout(() => {
    if (!isSfxMuted && sfxBuyEl) { sfxBuyEl.currentTime = 0; sfxBuyEl.play().catch(e=>{}); }
    
    const meta = executeCardPurchaseEffects(card, afford.breakdown, afford.neededGold);
    state.player.reserved.splice(idx, 1);

    auditInstantAchievements("buy", { card: card, level: 'reserved', totalGemsSpent: meta.totalGemsSpent, isReserved: true });
    endTurnFlow();
  }, 280);
};

window.reserveBoardCard = function(level, idx) {
  if (state.player.reserved.length >= 3) return;

  const card = state.board[level][idx];
  if (!card) return;

  let currentTokensTotal = 0;
  for (let k in state.player.tokens) currentTokensTotal += state.player.tokens[k];

  const cardDom = document.getElementById(`dom-card-${card.id}`);
  if (cardDom) cardDom.classList.add('animate-reserve');

  setTimeout(() => {
    if (!isSfxMuted && sfxReserveEl) { sfxReserveEl.currentTime = 0; sfxReserveEl.play().catch(e=>{}); }

    state.player.reserved.push(card);
    sessionTracker.hasReservedThisGame = true;

    let goldAwarded = false;
    if (state.bank.o > 0) {
      if (currentTokensTotal < 10) {
        state.bank.o--;
        state.player.tokens.o++;
        goldAwarded = true;
      }
    }

    let newCard = null;
    if (state.decks[level].length > 0) {
      newCard = state.decks[level].pop();
    }
    state.board[level][idx] = newCard;

    auditInstantAchievements("reserve", { goldAwarded: goldAwarded });
    endTurnFlow();
  }, 280);
};


/* ── 🔄 回合遞進、貴族覲見與勝負結算 ────────────────── */
function checkNoblesVisit() {
  let newlyEarnedPoints = 0;
  
  for (let i = 0; i < state.nobles.length; i++) {
    const n = state.nobles[i];
    if (n.completed) continue;

    let satisfy = true;
    for (let k in n.req) {
      if ((state.player.bonus[k] || 0) < n.req[k]) {
        satisfy = false; break;
      }
    }

    if (satisfy) {
      n.completed = true;
      state.player.score += n.points;
      sessionTracker.singleTurnScoreGained += n.points;
      newlyEarnedPoints += n.points;

      triggerAchievementUnlock(15);

      if (!isSfxMuted) {
        if (n.gender === 'female' && sfxNobleFemale) {
          sfxNobleFemale.currentTime = 0; sfxNobleFemale.play().catch(e=>{});
        } else if (n.gender === 'male' && sfxNobleMale) {
          sfxNobleMale.currentTime = 0; sfxNobleMale.play().catch(e=>{});
        }
      }
    }
  }

  if (sessionTracker.singleTurnScoreGained >= 6) {
    triggerAchievementUnlock(27);
  }
}

function endTurnFlow() {
  checkNoblesVisit();
  sessionTracker.singleTurnScoreGained = 0; 

  processPendingAchievementsQueue(() => {
    if (state.player.score >= 15) {
      triggerEndGameWin(true);
      return;
    }

    state.turn++;
    render();
  });
}

function triggerEndGameWin(isSuccess) {
  render();
  auditEndGameAchievements();

  const titleEl = document.querySelector('#win-modal .modal-title');
  const bodyEl = document.getElementById('modal-body-txt');
  
  if (isSuccess) {
    titleEl.textContent = "璀璨大師，實至名歸！";
    bodyEl.innerHTML = `恭喜您成功購得皇家產業，累積威望達到 <strong>${state.player.score} 分</strong>！<br>大會堂因您的經商智慧而熠熠生輝，共計耗時 <strong>${state.turn - 1} 回合</strong>。`;
  }
  
  document.getElementById('win-modal').classList.add('show');
}

document.getElementById('btn-restart').addEventListener('click', () => {
  document.getElementById('win-modal').classList.remove('show');
  initGame();
});


/* ── 🚀 全新重構：浮動分解欄位教學導覽引擎 ────────────────────── */
let currentTutorialStep = 0;
const TUTORIAL_STEPS_DATA = [
  {
    elementId: "guide-actions",
    title: "🟢 第一步：行動挑選面板",
    text: "輪到您的回合時，可以選擇「任選 3 個不同顏色籌碼」或「若金庫庫存足夠（≥2）則拿取 2 個同色籌碼」。"
  },
  {
    elementId: "guide-dashboard",
    title: "🪙 第二步：皇家金庫資產欄",
    text: "左側為您持有的籌碼數量與卡片提供的減免產量；右側為已來訪隨行的貴族。請隨時注意，背包籌碼總上限為 10 顆！"
  },
  {
    elementId: "guide-matrix",
    title: "💎 第三步：核心產業卡片矩陣",
    text: "這是大會堂核心區！可在此花費籌碼收購或保留卡片。卡牌左上為威望分數，右上是產出的永久寶石，左下角則為購買此卡所需的原料成本。"
  },
  {
    elementId: "guide-nobles",
    title: "⚜️ 第四步：貴族覲見區",
    text: "當您名下的發展卡累積達到貴族所需的「永久寶石產量」時，貴族將會在回合結束自動前來拜訪，並贈予您 3 分威望！"
  },
  {
    elementId: "guide-reserved",
    title: "🔒 第五步：機密保留契約",
    text: "若某張卡片暫時買不起但不想被搶走，可以點擊「保留」。這會將卡牌秘密存入此區，並獲得 1 顆萬能黃金籌碼（百搭）。保留上限為 3 張。"
  }
];

function checkAndStartTutorial() {
  const isTutorialDone = localStorage.getItem('splendor_tutorial_completed_2026');
  if (!isTutorialDone) {
    document.getElementById('tutorial-start-modal').classList.add('show');
  } else {
    document.getElementById('welcome-back-modal').classList.add('show');
  }
}

function hideWelcomeModal() {
  document.getElementById('welcome-back-modal').classList.remove('remove');
  document.getElementById('welcome-back-modal').classList.add('hide'); // 相容舊樣式
  document.getElementById('welcome-back-modal').style.display = 'none';
  
  if (!isMusicMuted && audioEl) {
    audioEl.play().catch(e => console.log("音樂啟動受瀏覽器限制: ", e));
  }
}

window.startFloatingTutorial = function() {
  document.getElementById('tutorial-start-modal').classList.remove('show');
  hideWelcomeModal();
  
  currentTutorialStep = 0;
  document.getElementById('floating-tutorial-widget').style.display = 'block';
  showStepData(currentTutorialStep);
};

function showStepData(stepIdx) {
  // 清除前一個高亮
  TUTORIAL_STEPS_DATA.forEach(step => {
    const el = document.getElementById(step.elementId);
    if (el) el.classList.remove('tutorial-highlight');
  });

  const stepData = TUTORIAL_STEPS_DATA[stepIdx];
  const targetEl = document.getElementById(stepData.elementId);
  
  if (targetEl) {
    targetEl.classList.add('tutorial-highlight');
    targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // 更新浮動卡內容
  document.getElementById('floating-tutorial-header').textContent = stepData.title;
  document.getElementById('floating-tutorial-text').textContent = stepData.text;

  // 更新點點指示器
  const dotsContainer = document.getElementById('floating-tutorial-dots');
  dotsContainer.innerHTML = TUTORIAL_STEPS_DATA.map((_, idx) => 
    `<div class="t-dot ${idx === stepIdx ? 'active' : ''}"></div>`
  ).join('');

  // 變更按鈕文字
  const nextBtn = document.getElementById('floating-tutorial-next-btn');
  if (stepIdx === TUTORIAL_STEPS_DATA.length - 1) {
    nextBtn.textContent = "進入大會堂";
  } else {
    nextBtn.textContent = "下一步";
  }
}

window.nextFloatingStep = function() {
  if (currentTutorialStep < TUTORIAL_STEPS_DATA.length - 1) {
    currentTutorialStep++;
    showStepData(currentTutorialStep);
  } else {
    // 教學結束
    TUTORIAL_STEPS_DATA.forEach(step => {
      const el = document.getElementById(step.elementId);
      if (el) el.classList.remove('tutorial-highlight');
    });
    document.getElementById('floating-tutorial-widget').style.display = 'none';
    localStorage.setItem('splendor_tutorial_completed_2026', 'true');
  }
};


/* ── 初始化加載 ────────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {
  loadTalentPool();
  renderActiveAssistantUI();
  initGame();
  checkAndStartTutorial();
});

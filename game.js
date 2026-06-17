
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

// 統一按鈕與選單點擊基本音效 (不影響核心動作確認音效)
function playUniformSfx() {
  const uniformSfx = document.getElementById('sfx-select');
  if (uniformSfx && !isSfxMuted) {
    uniformSfx.currentTime = 0;
    uniformSfx.play().catch(e => console.log(e));
  }
}

// 專門播放按下確認拿取籌碼時的音效
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
  { id: 21, symbol: "🪵", name: "白手起家", desc: "成功通關，且名下沒有任何一位貴族拜訪。", tier: "expert", color: "var(--diff-expert)" },
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

/* ── 🎬 局部更換：全新 5 步浮動說明卡邏輯 ────────────────────────── */
let currentTutorialStep = 0;

// 根據你的新設計：開場直接進遊戲，點擊才亮起對應欄位，文字簡短直接
const TUTORIAL_STEPS = [
  { 
    elementId: 'guide-actions', 
    title: '① 行動面板', 
    text: '核心行動區。每回合可選：拿3個不同色籌碼、拿2個同色籌碼，或者在此確認收下。',
    align: 'bottom'
  },
  { 
    elementId: 'guide-dashboard', 
    title: '② 皇家金庫', 
    text: '檢視您的資產背包。上半部顯示目前持有的籌碼（上限10顆），下半部是購得卡片提供的永久寶石減免。',
    align: 'bottom'
  },
  { 
    elementId: 'guide-matrix', 
    title: '③ 卡牌矩陣', 
    text: '核心貿易區。分為三種產業等級，卡片左下角為所需籌碼成本，產出威望分數與永久寶石。',
    align: 'top'
  },
  { 
    elementId: 'guide-nobles', 
    title: '④ 貴族覲見區', 
    text: '展示當前賽局中注視著您的五位無名貴族。當名下發展卡的永久寶石加總滿足其條件，貴族會主動拜訪移居。',
    align: 'bottom'
  },
  { 
    elementId: 'guide-reserved', 
    title: '⑤ 保留區', 
    text: '展示您目前保密暫扣的發展卡契約（上限3張）。扣留時會附贈1顆萬能黃金籌碼。',
    align: 'top'
  }
];

// 覆蓋原本舊的開場檢查，改成直接進遊戲
function checkAndStartTutorial() {
  const hasSeen = localStorage.getItem('splendor_tutorial_seen_2026');
  if (!hasSeen) {
    startFieldTutorial();
  }
}

function startFieldTutorial() {
  currentTutorialStep = 0;
  const overlay = document.getElementById('tutorial-floating-overlay');
  if (overlay) overlay.style.display = 'block';
  showTutorialStep();
}

function showTutorialStep() {
  // 1. 先清除所有舊的高亮狀態
  TUTORIAL_STEPS.forEach(s => {
    const el = document.getElementById(s.elementId);
    if (el) el.classList.remove('tutorial-highlight');
  });

  // 如果 5 步都走完了，就關閉導覽
  if (currentTutorialStep >= TUTORIAL_STEPS.length) {
    const overlay = document.getElementById('tutorial-floating-overlay');
    if (overlay) overlay.style.display = 'none';
    localStorage.setItem('splendor_tutorial_seen_2026', 'true');
    return;
  }

  const step = TUTORIAL_STEPS[currentTutorialStep];
  const targetEl = document.getElementById(step.elementId);
  const card = document.getElementById('tutorial-floating-card');

  if (!targetEl) {
    nextTutorialStep();
    return;
  }

  // 2. 幫當前步驟的欄位加上高亮外框
  targetEl.classList.add('tutorial-highlight');

  // 3. 填入簡短直接的文字與標題
  const headerEl = document.getElementById('floating-tutorial-header');
  const textEl = document.getElementById('floating-tutorial-text');
  if (headerEl) headerEl.textContent = step.title;
  if (textEl) textEl.textContent = step.text;

  // 4. 渲染進度小圓點
  const dotsLayer = document.getElementById('floating-tutorial-dots');
  if (dotsLayer) {
    dotsLayer.innerHTML = TUTORIAL_STEPS.map((_, i) => 
      `<div style="width:6px; height:6px; border-radius:50%; background:${i === currentTutorialStep ? '#d4af37' : '#554a3a'}; transition:all 0.2s;"></div>`
    ).join('');
  }

  // 5. 自動計算高亮欄位的位置，把浮動小卡「飄移」到它旁邊
  const rect = targetEl.getBoundingClientRect();
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  
  let leftPos = rect.left + (rect.width / 2) - 140; // 居中對齊
  if (leftPos < 10) leftPos = 10;
  if (leftPos + 290 > window.innerWidth) leftPos = window.innerWidth - 290;

  let topPos = 0;
  if (step.align === 'bottom') {
    topPos = rect.bottom + scrollTop + 10;
  } else {
    topPos = rect.top + scrollTop - 160;
    if (topPos < 10) topPos = rect.bottom + scrollTop + 10;
  }

  if (card) {
    card.style.left = leftPos + 'px';
    card.style.top = topPos + 'px';
  }

  // 畫面自動平滑滾動到焦點區域
  targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function nextTutorialStep() {
  currentTutorialStep++;
  showTutorialStep();
}

// 供選單按鈕重新呼叫
function forceStartOverviewTutorial() {
  const menuModal = document.getElementById('game-options-modal');
  if (menuModal) menuModal.classList.remove('show');
  startFieldTutorial();
}

// 確保開局時防死機並啟動渲染
window.addEventListener('DOMContentLoaded', () => {
  try {
    initGame();
  } catch(e) {
    console.error("Init crash:", e);
  }
  
  setTimeout(() => {
    if (typeof state !== 'undefined' && typeof render === 'function') {
      render();
    }
    if (typeof checkAndStartTutorial === 'function') {
      checkAndStartTutorial();
    }
  }, 100);
});

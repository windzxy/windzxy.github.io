(() => {
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  const ui = {
    energy: document.getElementById("energy"),
    lives: document.getElementById("lives"),
    wave: document.getElementById("wave"),
    score: document.getElementById("score"),
    bestScore: document.getElementById("bestScore"),
    towerList: document.getElementById("towerList"),
    selectedText: document.getElementById("selectedText"),
    selectedBox: document.getElementById("selectedBox"),
    upgradeBtn: document.getElementById("upgradeBtn"),
    sellBtn: document.getElementById("sellBtn"),
    startBtn: document.getElementById("startBtn"),
    pauseBtn: document.getElementById("pauseBtn"),
    speedBtn: document.getElementById("speedBtn"),
    soundBtn: document.getElementById("soundBtn"),
    restartBtn: document.getElementById("restartBtn"),
    playerName: document.getElementById("playerName"),
    submitScoreBtn: document.getElementById("submitScoreBtn"),
    refreshBoardBtn: document.getElementById("refreshBoardBtn"),
    leaderboardList: document.getElementById("leaderboardList"),
    leaderboardHint: document.getElementById("leaderboardHint"),
    powerStatus: document.getElementById("powerStatus"),
    themeStatus: document.getElementById("themeStatus"),
    difficultySelect: document.getElementById("difficultySelect"),
    difficultyStatus: document.getElementById("difficultyStatus"),
    chapterGate: document.getElementById("chapterGate"),
    chapterGateTitle: document.getElementById("chapterGateTitle"),
    chapterGateText: document.getElementById("chapterGateText"),
    nextThemeBtn: document.getElementById("nextThemeBtn"),
    stayThemeBtn: document.getElementById("stayThemeBtn"),
    banner: document.getElementById("banner")
  };

  const W = 1100;
  const H = 820;
  const tile = 44;
  const cols = 25;
  const rows = 18;
  const offset = { x: 0, y: 24 };
  let pathCells = [];
  let path = [];
  let pathSet = new Set();
  let blockedSet = new Set();
  let battlefield = null;
  const leaderboardUrl = "leaderboard.json";
  const issueUrl = "https://github.com/windzxy/windzxy.github.io/issues/new";
  const iconFiles = window.BeexTowerFiles || {
    crossbow: "assets/towers/tower-crossbow.png",
    lotus: "assets/towers/tower-lotus.png",
    drum: "assets/towers/tower-drum.png",
    mine: "assets/towers/tower-hive-mine.png",
    bastion: "assets/towers/tower-guard-bastion.png"
  };
  const actionIcons = {
    start: "assets/icons/action-start.svg",
    pause: "assets/icons/action-pause.svg",
    speed: "assets/icons/action-speed.svg",
    sound: "assets/icons/action-sound.svg",
    restart: "assets/icons/action-restart.svg",
    upgrade: "assets/icons/action-upgrade.svg",
    sell: "assets/icons/action-sell.svg"
  };
  const enemyFiles = {
    drone: "assets/enemies/enemy-footman.png",
    runner: "assets/enemies/enemy-rider.png",
    elite: "assets/enemies/enemy-armor.png"
  };
  const landmarkFiles = window.BeexLandmarkFiles || {
    ancientCamp: "assets/map/start-camp-ancient.png",
    ancientGate: "assets/map/end-gate-ancient.png",
    glacierCamp: "assets/map/start-camp-glacier.png",
    glacierGate: "assets/map/end-gate-glacier.png",
    volcanoCamp: "assets/map/start-camp-volcano.png",
    volcanoGate: "assets/map/end-gate-volcano.png"
  };
  const powerFiles = window.BeexPowerFiles || {
    beeCrossbow: "assets/towers/weapon-bee-crossbow.png"
  };
  const sceneFiles = window.BeexSceneFiles || {
    ancient: [],
    glacier: [],
    volcano: []
  };
  const powerCardIcon = document.querySelector(".power-icon img");
  if (powerCardIcon) powerCardIcon.src = powerFiles.beeCrossbow;
  const chapters = [
    {
      id: "ancient",
      name: "古城山河",
      gate: "蜂巢城門",
      enemyCamp: "敵營",
      weather: "晴嵐",
      weatherKind: "breeze",
      status: "標準地形，攻守均衡。",
      enemyTint: "rgba(255, 220, 130, 0.1)",
      enemyHp: 1,
      enemySpeed: 1,
      reward: 1,
      towerBoosts: {},
      towers: {
        pulse: { name: "神機弩", color: "#ffd878", effect: "遠距離單體輸出" },
        frost: { name: "寒玉蓮", color: "#9fe8ff", effect: "寒氣減速控制" },
        arc: { name: "雷鼓臺", color: "#ffcf5d", effect: "雷擊連鎖傷害" },
        mine: { name: "爆蜂罐", color: "#ffad38", effect: "近距離觸發範圍爆破" },
        bastion: { name: "城防蜂堡", color: "#58d4d0", effect: "修補城防兼弱攻擊" }
      },
      theme: {
        sky: ["#8fc9d8", "#dce9c4", "#91bd68", "#789b52"],
        far: ["#6e8f7f", "#3f5d49"],
        field: "#91b866",
        road: ["#5f391b", "#b47a3a", "#d1a55f"],
        river: ["#39748e", "#a8e2ea"],
        blocker: ["rgba(69, 65, 42, 0.72)", "rgba(47, 103, 58, 0.86)", "rgba(38, 91, 52, 0.78)"],
        sun: "rgba(255, 230, 156, 0.48)",
        gate: ["#9b5528", "#ca3c25"]
      }
    },
    {
      id: "glacier",
      name: "冰川寒原",
      gate: "冰晶要塞",
      enemyCamp: "雪原敵哨",
      weather: "暴雪",
      weatherKind: "snow",
      status: "敵軍稍慢但更耐打，寒玉蓮控制更強。",
      enemyTint: "rgba(120, 220, 255, 0.24)",
      enemyHp: 1.12,
      enemySpeed: 0.92,
      reward: 1.08,
      towerBoosts: {
        frost: { slow: 0.43, slowTime: 1.8, damageMod: 1.12 },
        pulse: { rangeMod: 0.96 },
        arc: { cooldownMod: 1.04 },
        mine: { damageMod: 1.1, blastMod: 1.08 },
        bastion: { repairMod: 1.18 }
      },
      towers: {
        pulse: { name: "破冰弩", color: "#bfefff", effect: "破冰遠射，射程略短" },
        frost: { name: "霜晶蓮", color: "#d4fbff", effect: "暴雪增幅，減速更久" },
        arc: { name: "極光鼓", color: "#a8d8ff", effect: "極光連鎖，節奏略慢" },
        mine: { name: "裂冰蜂罐", color: "#8cecff", effect: "破冰爆裂，範圍更寬" },
        bastion: { name: "凍壁蜂堡", color: "#c8f6ff", effect: "冰壁修補，城防更穩" }
      },
      theme: {
        sky: ["#b7e6ff", "#e8f7ff", "#bcd7d9", "#8eb4c4"],
        far: ["#b8d7e8", "#6f8fa4"],
        field: "#b8d6c9",
        road: ["#405b68", "#8fb6c4", "#d6edf1"],
        river: ["#5a94bf", "#d6fbff"],
        blocker: ["rgba(113, 136, 146, 0.78)", "rgba(220, 245, 255, 0.82)", "rgba(142, 188, 202, 0.84)"],
        sun: "rgba(238, 251, 255, 0.38)",
        gate: ["#7397a7", "#dff8ff"]
      }
    },
    {
      id: "volcano",
      name: "火山熔境",
      gate: "黑曜城門",
      enemyCamp: "熔岩敵陣",
      weather: "火山灰",
      weatherKind: "ember",
      status: "敵軍更快更硬，擊殺糧草更多，雷鼓臺爆發更強。",
      enemyTint: "rgba(255, 98, 42, 0.22)",
      enemyHp: 1.18,
      enemySpeed: 1.1,
      reward: 1.16,
      towerBoosts: {
        pulse: { damageMod: 1.08 },
        frost: { slow: 0.56, slowTime: 1.18 },
        arc: { damageMod: 1.2, cooldownMod: 0.92 },
        mine: { damageMod: 1.26, blastMod: 0.94 },
        bastion: { repairMod: 0.82, damageMod: 1.12 }
      },
      towers: {
        pulse: { name: "熔芯弩", color: "#ffb15c", effect: "高溫弩矢，單體更痛" },
        frost: { name: "灰燼蓮", color: "#ffcf9a", effect: "灰霧緩速，控制較短" },
        arc: { name: "火山雷鼓", color: "#ff6a3d", effect: "熔雷連鎖，爆發更強" },
        mine: { name: "熔爆蜂罐", color: "#ff7c35", effect: "熔岩爆破，傷害更高" },
        bastion: { name: "黑曜蜂堡", color: "#ff9f66", effect: "黑曜護城，修補較慢" }
      },
      theme: {
        sky: ["#3a1c1b", "#8a3b24", "#b45c2a", "#614123"],
        far: ["#6e3430", "#2d2521"],
        field: "#7c6841",
        road: ["#2f1a14", "#8a4a25", "#d07438"],
        river: ["#7d251d", "#ff9c3d"],
        blocker: ["rgba(70, 47, 41, 0.86)", "rgba(129, 64, 35, 0.88)", "rgba(219, 82, 38, 0.72)"],
        sun: "rgba(255, 94, 38, 0.32)",
        gate: ["#4d3229", "#ff693a"]
      }
    }
  ];
  let activeChapterIndex = 0;
  let wavePlan = [];
  const difficulties = {
    easy: {
      name: "簡單",
      status: "敵軍較慢較少，初始糧草與城防更多。",
      hp: 0.82,
      speed: 0.9,
      count: 0.86,
      reward: 1,
      score: 0.9,
      energy: 280,
      lives: 30,
      bossHp: 0.9
    },
    normal: {
      name: "中等",
      status: "標準守城節奏，Boss 波需要集中火力。",
      hp: 1,
      speed: 1,
      count: 1,
      reward: 1,
      score: 1,
      energy: 240,
      lives: 24,
      bossHp: 1
    },
    hard: {
      name: "困難",
      status: "敵軍更快更硬，數量更多，但戰功倍率更高。",
      hp: 1.25,
      speed: 1.12,
      count: 1.18,
      reward: 1.15,
      score: 1.28,
      energy: 210,
      lives: 18,
      bossHp: 1.22
    }
  };
  let selectedDifficultyId = difficulties[localStorage.getItem("beexTdDifficulty")] ? localStorage.getItem("beexTdDifficulty") : "easy";

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function cellKey(x, y) {
    return `${x},${y}`;
  }

  function riverSegments() {
    return [
      [[1085, 294], [936, 352], [826, 282], [712, 366]],
      [[712, 366], [580, 462], [472, 426], [346, 526]],
      [[346, 526], [226, 622], [132, 612], [18, 704]]
    ];
  }

  function cubicPoint(points, t) {
    const u = 1 - t;
    const [p0, p1, p2, p3] = points;
    return {
      x: u ** 3 * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t ** 3 * p3[0],
      y: u ** 3 * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t ** 3 * p3[1]
    };
  }

  function riverYAtX(x, shift) {
    let best = { distance: Infinity, y: H + 80 };
    for (const segment of riverSegments()) {
      for (let i = 0; i <= 42; i++) {
        const p = cubicPoint(segment, i / 42);
        const distance = Math.abs(p.x - x);
        if (distance < best.distance) best = { distance, y: p.y + shift };
      }
    }
    return best.y;
  }

  function cellCenter(cx, cy) {
    return {
      x: offset.x + cx * tile + tile / 2,
      y: offset.y + cy * tile + tile / 2
    };
  }

  function isRiverCell(cx, cy, shift, margin = 34) {
    const p = cellCenter(cx, cy);
    if (p.x < 18 || p.x > 1085) return false;
    return Math.abs(p.y - riverYAtX(p.x, shift)) <= margin;
  }

  function isMountainCell(cx, cy) {
    return cy < 5;
  }

  function nearestRiverRow(cx, shift) {
    const p = cellCenter(cx, 0);
    const y = riverYAtX(p.x, shift);
    return clamp(Math.round((y - offset.y - tile / 2) / tile), 6, rows - 3);
  }

  function createBridgeCells(bridgeX, shift) {
    const cells = new Set();
    const centerRow = nearestRiverRow(bridgeX, shift);
    for (let x = bridgeX - 1; x <= bridgeX + 1; x++) {
      for (let y = centerRow - 2; y <= centerRow + 2; y++) {
        if (x < 1 || x >= cols - 1 || y < 5 || y >= rows - 1) continue;
        if (isRiverCell(x, y, shift, 44)) cells.add(cellKey(x, y));
      }
    }
    if (!cells.size) cells.add(cellKey(bridgeX, centerRow));
    return cells;
  }

  function findRouteSegment(start, goal, shift, bridgeCells) {
    const startKey = cellKey(start[0], start[1]);
    const goalKey = cellKey(goal[0], goal[1]);
    const queue = [start];
    const cameFrom = new Map([[startKey, null]]);
    const directions = [[1, 0], [0, 1], [0, -1], [-1, 0]];
    const canUseCell = (x, y) => {
      if (x < 0 || y < 0 || x >= cols || y >= rows) return false;
      if (isMountainCell(x, y)) return false;
      if (isRiverCell(x, y, shift, 36) && !bridgeCells.has(cellKey(x, y))) return false;
      return true;
    };

    while (queue.length) {
      const [x, y] = queue.shift();
      if (cellKey(x, y) === goalKey) break;
      directions
        .map(([dx, dy]) => [x + dx, y + dy])
        .sort((a, b) => (Math.abs(a[0] - goal[0]) + Math.abs(a[1] - goal[1])) - (Math.abs(b[0] - goal[0]) + Math.abs(b[1] - goal[1])) + (Math.random() - 0.5) * 0.18)
        .forEach(([nx, ny]) => {
          const key = cellKey(nx, ny);
          if (cameFrom.has(key) || !canUseCell(nx, ny)) return;
          cameFrom.set(key, [x, y]);
          queue.push([nx, ny]);
        });
    }

    if (!cameFrom.has(goalKey)) return null;
    const segment = [];
    let current = goal;
    while (current) {
      segment.push(current);
      current = cameFrom.get(cellKey(current[0], current[1]));
    }
    return segment.reverse();
  }

  function currentChapter() {
    return chapters[activeChapterIndex] || chapters[0];
  }

  function currentDifficulty() {
    return difficulties[selectedDifficultyId] || difficulties.easy;
  }

  function towerDef(type) {
    const base = towers[type];
    const chapter = currentChapter();
    const skin = chapter.towers[type] || {};
    return { ...base, ...skin, id: base.id, icon: base.icon };
  }

  function towerBoost(type) {
    return currentChapter().towerBoosts[type] || {};
  }

  function createWavePlan(level) {
    const chapter = currentChapter();
    const difficulty = currentDifficulty();
    const levelBoost = 1 + (level - 1) * 0.17;
    return Array.from({ length: 12 }, (_, i) => {
      const waveNumber = i + 1;
      const boss = waveNumber % 4 === 0;
      const finalBoss = waveNumber === 12;
      const baseCount = 8 + i * 2 + Math.floor((level - 1) * 1.4);
      const regularCount = Math.max(3, Math.round(baseCount * difficulty.count));
      const hp = Math.round((50 + i * 17 + Math.max(0, i - 6) * 12) * levelBoost * chapter.enemyHp * difficulty.hp);
      return {
        count: regularCount + (boss ? 1 : 0),
        regularCount,
        hp,
        speed: (48 + i * 3 + Math.max(0, level - 1) * 1.6) * chapter.enemySpeed * difficulty.speed,
        reward: Math.round((13 + Math.floor(i / 2) + Math.floor((level - 1) / 2)) * chapter.reward * difficulty.reward),
        spawnGap: Math.max(0.36, (0.9 - i * 0.025 - (level - 1) * 0.012) / Math.max(0.86, difficulty.count)),
        swarm: i > 7 || level > 2 ? 2 : 1,
        boss,
        finalBoss,
        bossHp: Math.round(hp * (finalBoss ? 6.8 : 3.8) * difficulty.bossHp),
        bossSpeed: (48 + i * 2 + Math.max(0, level - 1) * 1.2) * chapter.enemySpeed * difficulty.speed * (finalBoss ? 0.46 : 0.58),
        bossReward: Math.round((finalBoss ? 82 : 46) * chapter.reward * difficulty.reward * (1 + level * 0.08))
      };
    });
  }

  function expandAnchors(anchors) {
    const cells = [];
    const seen = new Set();
    function push(x, y) {
      const key = `${x},${y}`;
      if (!seen.has(key)) {
        cells.push([x, y]);
        seen.add(key);
      }
    }
    for (let i = 0; i < anchors.length - 1; i++) {
      const [x1, y1] = anchors[i];
      const [x2, y2] = anchors[i + 1];
      if (x1 !== x2) {
        const step = x2 > x1 ? 1 : -1;
        for (let x = x1; x !== x2 + step; x += step) push(x, y1);
      } else {
        const step = y2 > y1 ? 1 : -1;
        for (let y = y1; y !== y2 + step; y += step) push(x1, y);
      }
    }
    return cells;
  }

  function createRoute(riverShift, bridgeCells, bridgeX) {
    const start = [1, randInt(6, 10)];
    const bridgeY = nearestRiverRow(bridgeX, riverShift);
    const bridge = [bridgeX, bridgeY];
    const end = [cols - 2, randInt(11, 16)];
    const first = findRouteSegment(start, bridge, riverShift, bridgeCells);
    const second = findRouteSegment(bridge, end, riverShift, bridgeCells);
    if (!first || !second) {
      return expandAnchors([[1, 9], [bridgeX, 9], [bridgeX, bridgeY], [bridgeX + 2, bridgeY], [cols - 2, 14]]);
    }
    return [...first, ...second.slice(1)];
  }

  function createBlockedCells(nextPathSet, riverShift) {
    const cells = new Set();
    const clusters = randInt(5, 7);
    for (let i = 0; i < clusters; i++) {
      const cx = randInt(1, cols - 3);
      const cy = randInt(2, rows - 3);
      const shape = Math.random() < 0.5 ? [[0, 0], [1, 0], [0, 1]] : [[0, 0], [1, 0], [1, 1]];
      for (const [dx, dy] of shape) {
        const x = cx + dx;
        const y = cy + dy;
        const key = cellKey(x, y);
        if (!nextPathSet.has(key) && !isRiverCell(x, y, riverShift, 40) && !isMountainCell(x, y)) cells.add(key);
      }
    }
    return cells;
  }

  function createBattlefield() {
    const chapter = currentChapter();
    const sceneList = sceneFiles[chapter.id] || [];
    const sceneIndex = sceneList.length ? (state.chapterLevel - 1 + randInt(0, sceneList.length - 1)) % sceneList.length : -1;
    const riverShift = randInt(-28, 28);
    const bridgeX = randInt(7, 17);
    const bridgeCells = createBridgeCells(bridgeX, riverShift);
    const nextPathCells = createRoute(riverShift, bridgeCells, bridgeX);
    const nextPathSet = new Set(nextPathCells.map(([x, y]) => cellKey(x, y)));
    const bridgePathCells = nextPathCells.filter(([x, y]) => bridgeCells.has(cellKey(x, y)));
    const trees = [];
    let guard = 0;
    while (trees.length < 64 && guard < 560) {
      guard += 1;
      const x = randInt(24, W - 24);
      const y = randInt(228, H - 34);
      const cx = Math.floor((x - offset.x) / tile);
      const cy = Math.floor((y - offset.y) / tile);
      const key = cellKey(cx, cy);
      if (nextPathSet.has(key) || isRiverCell(cx, cy, riverShift, 42) || isMountainCell(cx, cy)) continue;
      trees.push([x, y]);
    }
    const groundStones = [];
    guard = 0;
    while (groundStones.length < 92 && guard < 760) {
      guard += 1;
      const x = randInt(20, W - 20);
      const y = randInt(238, H - 28);
      const cx = Math.floor((x - offset.x) / tile);
      const cy = Math.floor((y - offset.y) / tile);
      const key = cellKey(cx, cy);
      if (nextPathSet.has(key) || isRiverCell(cx, cy, riverShift, 50) || isMountainCell(cx, cy)) continue;
      groundStones.push([x, y, randInt(3, 10), randInt(2, 6), Math.random() * Math.PI]);
    }
    const blooms = [];
    guard = 0;
    while (blooms.length < 76 && guard < 680) {
      guard += 1;
      const x = randInt(28, W - 28);
      const y = randInt(255, H - 40);
      const cx = Math.floor((x - offset.x) / tile);
      const cy = Math.floor((y - offset.y) / tile);
      const key = cellKey(cx, cy);
      if (nextPathSet.has(key) || isRiverCell(cx, cy, riverShift, 44) || isMountainCell(cx, cy)) continue;
      blooms.push([x, y, randInt(2, 5), Math.random()]);
    }
    const riverRocks = Array.from({ length: 34 }, (_, i) => {
      const x = 26 + (i * 137 + randInt(0, 70)) % (W - 52);
      const y = riverYAtX(x, riverShift) + randInt(-34, 34);
      return [x, y, randInt(5, 16), randInt(3, 9), Math.random() * Math.PI];
    });
    return {
      theme: chapter.theme,
      pathCells: nextPathCells,
      pathSet: nextPathSet,
      blockedSet: createBlockedCells(nextPathSet, riverShift),
      bridgeCells: bridgePathCells,
      mountainShift: randInt(-34, 34),
      riverShift,
      sceneIndex,
      sceneVariant: randInt(0, 3),
      weatherSeed: Math.random() * 1000,
      fieldMarks: Array.from({ length: 7 }, () => [randInt(80, 980), randInt(285, H - 74), randInt(110, 220), randInt(30, 66), (Math.random() - 0.5) * 0.34]),
      trees,
      groundStones,
      blooms,
      riverRocks
    };
  }

  function resetBattlefield(chapterIndex = activeChapterIndex) {
    activeChapterIndex = chapterIndex;
    battlefield = createBattlefield();
    pathCells = battlefield.pathCells;
    pathSet = battlefield.pathSet;
    blockedSet = battlefield.blockedSet;
    path = pathCells.map(([x, y]) => ({
      x: offset.x + x * tile + tile / 2,
      y: offset.y + y * tile + tile / 2
    }));
  }

  function loadImages(files) {
    return Object.fromEntries(Object.entries(files).map(([key, src]) => {
      const img = new Image();
      img.src = src;
      img.addEventListener("load", () => draw());
      return [key, img];
    }));
  }

  function loadSceneImages(files) {
    return Object.fromEntries(Object.entries(files).map(([themeId, sources]) => [
      themeId,
      sources.map(src => {
        const img = new Image();
        img.decoding = "async";
        img.fetchPriority = "high";
        img._failed = false;
        img.src = src;
        img.addEventListener("load", () => draw());
        img.addEventListener("error", () => {
          img._failed = true;
          draw();
        });
        return img;
      })
    ]));
  }

  const icons = loadImages(iconFiles);
  const enemySprites = loadImages(enemyFiles);
  const landmarks = loadImages(landmarkFiles);
  const powerIcons = loadImages(powerFiles);
  const sceneImages = loadSceneImages(sceneFiles);
  resetBattlefield();
  const audio = {
    ctx: null,
    muted: localStorage.getItem("beexTdMuted") === "1",
    unlocked: false,
    last: Object.create(null)
  };

  function unlockAudio() {
    if (audio.muted) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    if (!audio.ctx) audio.ctx = new AudioContext();
    if (audio.ctx.state === "suspended") audio.ctx.resume();
    audio.unlocked = true;
  }

  function playTone(freq, duration = 0.08, type = "sine", gain = 0.05, delay = 0) {
    if (audio.muted || !audio.ctx || !audio.unlocked) return;
    const now = audio.ctx.currentTime + delay;
    const osc = audio.ctx.createOscillator();
    const volume = audio.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    volume.gain.setValueAtTime(0.0001, now);
    volume.gain.exponentialRampToValueAtTime(gain, now + 0.012);
    volume.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(volume);
    volume.connect(audio.ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  function playNoise(duration = 0.12, gain = 0.04) {
    if (audio.muted || !audio.ctx || !audio.unlocked) return;
    const sampleRate = audio.ctx.sampleRate;
    const length = Math.max(1, Math.floor(sampleRate * duration));
    const buffer = audio.ctx.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 1.8);
    }
    const source = audio.ctx.createBufferSource();
    const volume = audio.ctx.createGain();
    volume.gain.value = gain;
    source.buffer = buffer;
    source.connect(volume);
    volume.connect(audio.ctx.destination);
    source.start();
  }

  function playSound(name) {
    const now = performance.now();
    const gap = name === "shot" ? 75 : name === "hit" ? 90 : 25;
    if ((audio.last[name] || 0) + gap > now) return;
    audio.last[name] = now;
    if (name === "build") {
      playTone(260, 0.07, "triangle", 0.055);
      playTone(392, 0.08, "triangle", 0.05, 0.06);
    } else if (name === "upgrade") {
      playTone(330, 0.08, "triangle", 0.055);
      playTone(494, 0.09, "triangle", 0.05, 0.07);
      playTone(660, 0.1, "triangle", 0.045, 0.14);
    } else if (name === "shot") {
      playTone(720, 0.045, "square", 0.025);
    } else if (name === "kill") {
      playTone(210, 0.07, "sawtooth", 0.04);
      playNoise(0.08, 0.025);
    } else if (name === "drop") {
      playTone(540, 0.08, "sine", 0.05);
      playTone(810, 0.14, "sine", 0.045, 0.08);
    } else if (name === "power") {
      playTone(330, 0.1, "triangle", 0.06);
      playTone(660, 0.16, "triangle", 0.055, 0.09);
      playTone(990, 0.22, "triangle", 0.045, 0.18);
      playNoise(0.2, 0.035);
    } else if (name === "leak") {
      playTone(150, 0.18, "sawtooth", 0.055);
      playNoise(0.16, 0.035);
    } else if (name === "start") {
      playTone(196, 0.1, "triangle", 0.055);
      playTone(262, 0.12, "triangle", 0.05, 0.09);
    } else if (name === "win") {
      [392, 494, 587, 784].forEach((freq, i) => playTone(freq, 0.12, "triangle", 0.05, i * 0.08));
    } else if (name === "lose") {
      [260, 220, 174].forEach((freq, i) => playTone(freq, 0.16, "sawtooth", 0.05, i * 0.11));
    } else if (name === "deny") {
      playTone(120, 0.08, "square", 0.035);
    } else if (name === "click") {
      playTone(440, 0.045, "triangle", 0.025);
    }
  }

  const towers = {
    pulse: {
      id: "pulse",
      name: "神機弩",
      icon: "crossbow",
      cost: 50,
      color: "#ffd878",
      range: 128,
      damage: 24,
      cooldown: 0.52,
      effect: "遠距離單體輸出"
    },
    frost: {
      id: "frost",
      name: "寒玉蓮",
      icon: "lotus",
      cost: 68,
      color: "#9fe8ff",
      range: 116,
      damage: 10,
      cooldown: 0.8,
      slow: 0.5,
      slowTime: 1.45,
      effect: "寒氣減速控制"
    },
    arc: {
      id: "arc",
      name: "雷鼓臺",
      icon: "drum",
      cost: 94,
      color: "#ffcf5d",
      range: 142,
      damage: 18,
      cooldown: 0.96,
      chain: 3,
      effect: "雷擊連鎖傷害"
    },
    mine: {
      id: "mine",
      name: "爆蜂罐",
      icon: "mine",
      cost: 82,
      color: "#ffad38",
      range: 74,
      damage: 96,
      cooldown: 0.28,
      blastRadius: 88,
      singleUse: true,
      effect: "近距離觸發範圍爆破"
    },
    bastion: {
      id: "bastion",
      name: "城防蜂堡",
      icon: "bastion",
      cost: 76,
      color: "#58d4d0",
      range: 104,
      damage: 9,
      cooldown: 1.25,
      repair: 1,
      repairCooldown: 4.8,
      effect: "修補城防兼弱攻擊"
    }
  };

  const towerUnlocks = {
    pulse: 1,
    frost: 3,
    arc: 5,
    mine: 7,
    bastion: 9
  };

  wavePlan = createWavePlan(1);

  const state = {
    energy: currentDifficulty().energy,
    lives: currentDifficulty().lives,
    maxLives: currentDifficulty().lives,
    chapterIndex: 0,
    chapterLevel: 1,
    waveIndex: 0,
    score: 0,
    best: Number(localStorage.getItem("beexTdBest") || 0),
    localScores: readLocalScores(),
    remoteScores: [],
    playerName: localStorage.getItem("beexTdPlayer") || "",
    difficultyId: selectedDifficultyId,
    scoreSubmittedFor: "",
    selectedBuild: "pulse",
    selectedTower: null,
    hoverCell: null,
    towers: [],
    enemies: [],
    drops: [],
    shots: [],
    sparks: [],
    spawnTimer: 0,
    spawned: 0,
    waveActive: false,
    paused: false,
    speed: 1,
    ended: false,
    won: false,
    readyForNextTheme: false,
    powerUses: 0,
    dropsThisWave: 0,
    last: 0,
    dpr: 1,
    shake: 0
  };

  function readLocalScores() {
    try {
      const scores = JSON.parse(localStorage.getItem("beexTdScores") || "[]");
      return Array.isArray(scores) ? scores : [];
    } catch {
      return [];
    }
  }

  function cleanPlayerName(value) {
    return String(value || "")
      .replace(/[<>`{}[\]\\]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 18);
  }

  function scoreKey() {
    return `${state.playerName}:${state.score}:${state.chapterLevel}:${state.chapterIndex}:${state.waveIndex}:${state.lives}:${state.energy}:${state.difficultyId}`;
  }

  function progressWave() {
    return (state.chapterLevel - 1) * wavePlan.length + state.waveIndex + 1;
  }

  function towerUnlockWave(type) {
    return towerUnlocks[type] || 1;
  }

  function towerUnlocked(type) {
    return progressWave() >= towerUnlockWave(type);
  }

  function newlyUnlockedTowers() {
    const wave = progressWave();
    return Object.values(towers).filter(tower => towerUnlockWave(tower.id) === wave);
  }

  function nextLockedTower() {
    return Object.values(towers)
      .filter(tower => !towerUnlocked(tower.id))
      .sort((a, b) => towerUnlockWave(a.id) - towerUnlockWave(b.id))[0] || null;
  }

  function saveLocalScore() {
    const name = cleanPlayerName(state.playerName) || "無名俠客";
    const entry = {
      name,
      score: state.score,
      wave: Math.min(state.waveIndex + 1, wavePlan.length),
      chapter: `${currentChapter().name} ${state.chapterLevel}`,
      difficulty: currentDifficulty().name,
      lives: Math.max(0, state.lives),
      energy: state.energy,
      time: new Date().toISOString()
    };
    state.localScores = [entry, ...state.localScores]
      .sort((a, b) => b.score - a.score || String(a.time).localeCompare(String(b.time)))
      .slice(0, 10);
    localStorage.setItem("beexTdScores", JSON.stringify(state.localScores));
    renderLeaderboard();
  }

  function mergedScores() {
    const remote = state.remoteScores.map(item => ({ ...item, source: "github" }));
    const local = state.localScores.map(item => ({ ...item, source: "local" }));
    return [...remote, ...local]
      .filter(item => Number.isFinite(Number(item.score)))
      .sort((a, b) => Number(b.score) - Number(a.score) || String(a.time || "").localeCompare(String(b.time || "")))
      .slice(0, 8);
  }

  function renderLeaderboard() {
    const scores = mergedScores();
    ui.leaderboardList.innerHTML = "";
    if (!scores.length) {
      const empty = document.createElement("li");
      empty.innerHTML = `<span class="rank">-</span><span class="player">暫無戰功</span><span class="score">0</span>`;
      ui.leaderboardList.appendChild(empty);
      return;
    }
    scores.forEach((entry, index) => {
      const li = document.createElement("li");
      const name = cleanPlayerName(entry.name) || "無名俠客";
      const source = entry.source === "github" ? "雲榜" : "本地";
      const rank = document.createElement("span");
      const player = document.createElement("span");
      const score = document.createElement("span");
      const tag = document.createElement("small");
      rank.className = "rank";
      player.className = "player";
      score.className = "score";
      rank.textContent = String(index + 1);
      player.title = name;
      player.textContent = `${name} `;
      tag.textContent = source;
      score.textContent = String(Number(entry.score) || 0);
      player.appendChild(tag);
      li.append(rank, player, score);
      ui.leaderboardList.appendChild(li);
    });
  }

  async function loadRemoteLeaderboard() {
    ui.leaderboardHint.textContent = "正在讀取 GitHub 排行榜...";
    try {
      const response = await fetch(`${leaderboardUrl}?t=${Date.now()}`, { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const scores = await response.json();
      state.remoteScores = Array.isArray(scores) ? scores : [];
      ui.leaderboardHint.textContent = "已讀取 GitHub 排行榜。";
    } catch {
      state.remoteScores = [];
      ui.leaderboardHint.textContent = "暫時未讀到雲端榜單，仍會顯示本地戰功。";
    }
    renderLeaderboard();
  }

  function submitScore() {
    state.playerName = cleanPlayerName(ui.playerName.value) || "無名俠客";
    localStorage.setItem("beexTdPlayer", state.playerName);
    if (!state.ended || state.score <= 0 || state.scoreSubmittedFor === scoreKey()) return;
    const body = [
      "遊戲: 蜂巢古城守衛",
      "代碼: beex-tower-defense",
      `玩家: ${state.playerName}`,
      `戰功: ${state.score}`,
      `主題: ${currentChapter().name}`,
      `難度: ${currentDifficulty().name}`,
      `周目: ${state.chapterLevel}`,
      `波次: ${Math.min(state.waveIndex + 1, wavePlan.length)}`,
      `城防: ${Math.max(0, state.lives)}`,
      `糧草: ${state.energy}`,
      `時間: ${new Date().toISOString()}`
    ].join("\n");
    const params = new URLSearchParams({
      title: `[古城戰功] ${state.playerName} - ${state.score}`,
      body
    });
    state.scoreSubmittedFor = scoreKey();
    updateUi();
    ui.leaderboardHint.textContent = "已打開 GitHub 提交頁，送出 Issue 後會由 Action 寫入雲端榜單。";
    window.open(`${issueUrl}?${params.toString()}`, "_blank", "noopener,noreferrer");
  }

  function resizeCanvas() {
    const box = canvas.getBoundingClientRect();
    state.dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    canvas.width = Math.round(box.width * state.dpr);
    canvas.height = Math.round(box.height * state.dpr);
    ctx.setTransform(canvas.width / W, 0, 0, canvas.height / H, 0, 0);
  }

  function gridToWorld(cx, cy) {
    return {
      x: offset.x + cx * tile + tile / 2,
      y: offset.y + cy * tile + tile / 2
    };
  }

  function pointerToWorld(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * W,
      y: ((event.clientY - rect.top) / rect.height) * H
    };
  }

  function worldToCell(x, y) {
    const cx = Math.floor((x - offset.x) / tile);
    const cy = Math.floor((y - offset.y) / tile);
    if (cx < 0 || cy < 0 || cx >= cols || cy >= rows) return null;
    return { cx, cy, key: `${cx},${cy}` };
  }

  function cellHasTower(key) {
    return state.towers.some(t => t.key === key);
  }

  function cellDistanceToPath(cell) {
    if (!cell || !path.length) return Infinity;
    const p = gridToWorld(cell.cx, cell.cy);
    return path.reduce((best, item) => Math.min(best, Math.hypot(item.x - p.x, item.y - p.y)), Infinity);
  }

  function canUseAsTowerPad(cell) {
    if (!cell) return false;
    if (isMountainCell(cell.cx, cell.cy) || isRiverCell(cell.cx, cell.cy, battlefield.riverShift, 36)) return false;
    if (pathSet.has(cell.key) || blockedSet.has(cell.key) || cellHasTower(cell.key)) return false;
    const distance = cellDistanceToPath(cell);
    return distance >= 58 && distance <= 172;
  }

  function canBuild(cell) {
    if (!towerUnlocked(state.selectedBuild)) return false;
    return canUseAsTowerPad(cell) && state.energy >= towerDef(state.selectedBuild).cost;
  }

  function buildDenyReason(cell) {
    const def = towerDef(state.selectedBuild);
    if (!cell) return "請拖到戰場內的可投放平台。";
    if (!towerUnlocked(state.selectedBuild)) return `${def.name} 尚未開放。`;
    if (!canUseAsTowerPad(cell)) return "這裡不能投放，請選金色平台或道路旁空地。";
    if (state.energy < def.cost) return `糧草不足，${def.name} 需要 ${def.cost}。`;
    return "暫時不能投放。";
  }

  function makeEnemy(index) {
    const plan = wavePlan[state.waveIndex];
    const boss = plan.boss && index >= plan.regularCount;
    const finalBoss = boss && plan.finalBoss;
    const elite = state.waveIndex >= 5 && index % 7 === 0;
    const runner = state.waveIndex >= 3 && index % 5 === 2;
    const hp = boss ? plan.bossHp : plan.hp * (elite ? 1.65 : 1) * (runner ? 0.7 : 1);
    const speed = boss ? plan.bossSpeed : plan.speed * (runner ? 1.35 : 1) * (elite ? 0.75 : 1);
    const first = path[0];
    return {
      x: first.x - 28,
      y: first.y,
      hp,
      maxHp: hp,
      speed,
      reward: boss ? plan.bossReward : plan.reward + (elite ? 10 : runner ? 3 : 0),
      node: 0,
      radius: finalBoss ? 31 : boss ? 25 : elite ? 16 : runner ? 10 : 13,
      facing: -1,
      slow: 1,
      slowTimer: 0,
      type: finalBoss ? "finalBoss" : boss ? "boss" : elite ? "elite" : runner ? "runner" : "drone",
      spriteType: boss ? "elite" : null,
      boss,
      finalBoss,
      alive: true,
      leaked: false
    };
  }

  function maybeDropPower(enemy) {
    const maxDrops = state.waveIndex >= 8 ? 2 : 1;
    if (state.dropsThisWave >= maxDrops) return;
    const baseChance = enemy.finalBoss ? 0.9 : enemy.boss ? 0.42 : enemy.type === "elite" ? 0.12 : enemy.type === "runner" ? 0.035 : 0.02;
    const waveBoost = Math.min(0.035, state.waveIndex * 0.0035);
    if (Math.random() > baseChance + waveBoost) return;
    state.dropsThisWave += 1;
    state.drops.push({
      id: self.crypto && self.crypto.randomUUID ? self.crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
      type: "beeCrossbow",
      name: "蜂鳴神弩",
      x: enemy.x,
      y: enemy.y,
      age: 0,
      ttl: 8,
      radius: 26
    });
    playSound("drop");
    showBanner("驚喜掉落：蜂鳴神弩！");
  }

  function collectDrop(drop) {
    if (!drop) return;
    state.drops = state.drops.filter(item => item !== drop);
    state.powerUses += 1;
    const damage = 72 + state.waveIndex * 14;
    const living = state.enemies.filter(enemy => enemy.alive);
    living.forEach(enemy => {
      state.shots.push({
        x1: drop.x,
        y1: drop.y,
        x2: enemy.x,
        y2: enemy.y,
        life: 0.24,
        color: "#fff1a6",
        width: 5
      });
      damageEnemy(enemy, damage, false);
    });
    state.score += Math.round((30 + living.length * 8) * currentDifficulty().score);
    state.sparks.push({ x: drop.x, y: drop.y, r: 34, life: 0.55, color: "#fff1a6" });
    playSound("power");
    showBanner(`蜂鳴神弩發動，全場齊射 ${living.length} 名敵軍`);
    updateUi();
  }

  function pickDrop(point) {
    return state.drops.find(drop => Math.hypot(drop.x - point.x, drop.y - point.y) <= drop.radius + 8) || null;
  }

  function towerStats(t) {
    const base = towerDef(t.type);
    const boost = towerBoost(t.type);
    const level = t.level;
    return {
      range: Math.round((base.range + (level - 1) * 15) * (boost.rangeMod || 1)),
      damage: Math.round(base.damage * (boost.damageMod || 1) * (1 + (level - 1) * 0.45)),
      cooldown: Math.max(0.22, base.cooldown * (boost.cooldownMod || 1) * (1 - (level - 1) * 0.1)),
      slow: boost.slow || base.slow,
      slowTime: boost.slowTime || base.slowTime,
      chain: base.chain ? base.chain + level - 1 : 0,
      blastRadius: Math.round((base.blastRadius || 0) * (boost.blastMod || 1) * (1 + (level - 1) * 0.1)),
      repair: Math.max(0, Math.round((base.repair || 0) * (boost.repairMod || 1) * (1 + (level - 1) * 0.35))),
      repairCooldown: base.repairCooldown ? Math.max(2.6, base.repairCooldown * (1 - (level - 1) * 0.08)) : 0
    };
  }

  function upgradeCost(t) {
    return Math.round(towerDef(t.type).cost * (0.72 + t.level * 0.5));
  }

  function sellValue(t) {
    let spent = towerDef(t.type).cost;
    for (let i = 1; i < t.level; i++) {
      spent += Math.round(towerDef(t.type).cost * (0.72 + i * 0.5));
    }
    return Math.floor(spent * 0.68);
  }

  function renderTowerButtons() {
    ui.towerList.innerHTML = "";
    Object.values(towers).filter(tower => towerUnlocked(tower.id)).forEach(tower => {
      const def = towerDef(tower.id);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.draggable = true;
      btn.className = `tower-card ${state.selectedBuild === tower.id ? "active" : ""}`;
      btn.innerHTML = `
        <span class="tower-icon"><img src="${iconFiles[def.icon]}" alt=""></span>
        <span class="tower-meta"><strong>${def.name}</strong><small>${def.effect}</small></span>
        <span class="tower-cost">${def.cost} 糧</span>
      `;
      btn.addEventListener("click", () => {
        state.selectedBuild = tower.id;
        state.selectedTower = null;
        updateUi();
        showBanner(`已選擇 ${def.name}，點擊金色平台投放。`);
      });
      btn.addEventListener("dragstart", event => {
        state.selectedBuild = tower.id;
        state.selectedTower = null;
        event.dataTransfer.setData("text/plain", tower.id);
        event.dataTransfer.effectAllowed = "copy";
        updateUi();
      });
      ui.towerList.appendChild(btn);
    });
  }

  function setActionButton(button, icon, text) {
    button.innerHTML = `<img src="${actionIcons[icon]}" alt="">${text}`;
  }

  function updateUi() {
    const chapter = currentChapter();
    const difficulty = currentDifficulty();
    const plan = wavePlan[state.waveIndex] || wavePlan[wavePlan.length - 1];
    ui.energy.textContent = state.energy;
    ui.lives.textContent = state.lives;
    ui.wave.textContent = `${Math.min(state.waveIndex + 1, wavePlan.length)}/${wavePlan.length}${plan && plan.finalBoss ? " 大Boss" : plan && plan.boss ? " Boss" : ""}`;
    ui.score.textContent = state.score;
    ui.bestScore.textContent = state.best;
    ui.themeStatus.textContent = `第 ${state.chapterLevel} 主題｜${chapter.name}｜${chapter.weather}：${chapter.status}｜第4/8波Boss，第12波大Boss`;
    ui.difficultySelect.value = state.difficultyId;
    ui.difficultyStatus.textContent = `${difficulty.name}｜${difficulty.status}`;
    ui.powerStatus.textContent = state.powerUses > 0
      ? `已發動 ${state.powerUses} 次。本波掉落 ${state.dropsThisWave} 次，看到金光要手動點擊。`
      : "低概率驚喜掉落，點擊即可全場齊射。";
    ui.startBtn.disabled = state.waveActive || state.ended || state.waveIndex >= wavePlan.length;
    setActionButton(ui.startBtn, "start", state.ended ? (state.won ? "已通關" : "已失守") : "迎敵");
    ui.pauseBtn.disabled = state.ended;
    setActionButton(ui.pauseBtn, "pause", state.paused ? "繼續" : "暫停");
    setActionButton(ui.speedBtn, "speed", `${state.speed === 1 ? "一" : state.speed === 2 ? "二" : "三"}倍速度`);
    setActionButton(ui.soundBtn, "sound", audio.muted ? "靜音" : "音效");
    setActionButton(ui.restartBtn, "restart", "重開");
    ui.submitScoreBtn.disabled = !state.ended || state.score <= 0 || scoreKey() === state.scoreSubmittedFor;
    if (state.selectedTower) {
      const t = state.selectedTower;
      const def = towerDef(t.type);
      const cost = upgradeCost(t);
      ui.selectedText.textContent = `${def.name} ${t.level}級｜攻擊 ${towerStats(t).damage}｜拆除返還 ${sellValue(t)}`;
      ui.upgradeBtn.disabled = t.level >= 4 || state.energy < cost;
      setActionButton(ui.upgradeBtn, "upgrade", t.level >= 4 ? "滿級" : `升級 ${cost}`);
      ui.sellBtn.disabled = false;
      setActionButton(ui.sellBtn, "sell", "拆除");
    } else {
      const def = towerDef(state.selectedBuild);
      const next = nextLockedTower();
      const hint = next ? ` 第 ${towerUnlockWave(next.id)} 波會開放新設施。` : "";
      ui.selectedText.textContent = `準備投放 ${def.name}。消耗 ${def.cost} 糧草，${def.effect}。點擊或拖到金色平台。${hint}`;
      ui.upgradeBtn.disabled = true;
      setActionButton(ui.upgradeBtn, "upgrade", "升級");
      ui.sellBtn.disabled = true;
      setActionButton(ui.sellBtn, "sell", "拆除");
    }
    renderTowerButtons();
  }

  function showBanner(text, persist = false) {
    window.clearTimeout(showBanner.timer);
    ui.banner.textContent = text;
    ui.banner.classList.remove("hidden");
    if (!persist) {
      showBanner.timer = window.setTimeout(() => ui.banner.classList.add("hidden"), 1500);
    }
  }

  function showChapterGate() {
    const chapter = currentChapter();
    const next = chapters[(state.chapterIndex + 1) % chapters.length];
    ui.chapterGateTitle.textContent = `${chapter.name} 通關`;
    ui.chapterGateText.textContent = `是否進入「${next.name}」？下一主題會生成新地圖、新天氣與更高難度。`;
    setActionButton(ui.nextThemeBtn, "start", `進入 ${next.name}`);
    setActionButton(ui.stayThemeBtn, "restart", "留在本主題");
    ui.chapterGate.classList.remove("hidden");
  }

  function hideChapterGate() {
    ui.chapterGate.classList.add("hidden");
  }

  function resetStateForChapter({ chapterIndex, chapterLevel, carryScore = false }) {
    const difficulty = currentDifficulty();
    state.chapterIndex = chapterIndex;
    state.chapterLevel = chapterLevel;
    state.difficultyId = selectedDifficultyId;
    activeChapterIndex = chapterIndex;
    resetBattlefield(chapterIndex);
    wavePlan = createWavePlan(chapterLevel);
    const maxLives = difficulty.lives + Math.min(6, chapterLevel - 1);
    Object.assign(state, {
      energy: difficulty.energy + Math.min(80, (chapterLevel - 1) * 20),
      lives: maxLives,
      maxLives,
      waveIndex: 0,
      score: carryScore ? state.score : 0,
      selectedBuild: "pulse",
      selectedTower: null,
      hoverCell: null,
      towers: [],
      enemies: [],
      drops: [],
      shots: [],
      sparks: [],
      spawnTimer: 0,
      spawned: 0,
      waveActive: false,
      paused: false,
      speed: 1,
      ended: false,
      won: false,
      readyForNextTheme: false,
      powerUses: carryScore ? state.powerUses : 0,
      dropsThisWave: 0,
      last: performance.now(),
      scoreSubmittedFor: carryScore ? state.scoreSubmittedFor : "",
      shake: 0
    });
    hideChapterGate();
    ui.banner.classList.add("hidden");
    updateUi();
    showBanner(`${currentChapter().name} 開戰：${currentChapter().weather}`);
  }

  function buildTower(cell) {
    const def = towerDef(state.selectedBuild);
    if (!canBuild(cell)) {
      state.shake = 0.18;
      playSound("deny");
      showBanner(buildDenyReason(cell));
      return;
    }
    const pos = gridToWorld(cell.cx, cell.cy);
    state.energy -= def.cost;
    state.towers.push({
      type: def.id,
      x: pos.x,
      y: pos.y,
      cx: cell.cx,
      cy: cell.cy,
      key: cell.key,
      level: 1,
      cooldown: 0,
      repairTimer: def.repairCooldown || 0
    });
    state.selectedTower = state.towers[state.towers.length - 1];
    playSound("build");
    updateUi();
  }

  function pickTower(cell) {
    if (!cell) return null;
    return state.towers.find(t => t.key === cell.key) || null;
  }

  function startWave() {
    if (state.waveActive || state.ended || state.waveIndex >= wavePlan.length) return;
    state.waveActive = true;
    state.spawned = 0;
    state.spawnTimer = 0;
    state.dropsThisWave = 0;
    ui.banner.classList.add("hidden");
    playSound("start");
    const plan = wavePlan[state.waveIndex];
    showBanner(plan.finalBoss ? `第 ${state.waveIndex + 1} 波：終章大Boss壓境！` : plan.boss ? `第 ${state.waveIndex + 1} 波：Boss來襲！` : `第 ${state.waveIndex + 1} 波敵軍來襲`);
    updateUi();
  }

  function restart() {
    resetStateForChapter({
      chapterIndex: state.chapterIndex,
      chapterLevel: state.chapterLevel,
      carryScore: false
    });
    playSound("click");
  }

  function enterNextTheme() {
    const nextIndex = (state.chapterIndex + 1) % chapters.length;
    resetStateForChapter({
      chapterIndex: nextIndex,
      chapterLevel: state.chapterLevel + 1,
      carryScore: true
    });
    playSound("start");
  }

  function damageEnemy(enemy, amount, allowDrop = true) {
    enemy.hp -= amount;
    state.sparks.push({
      x: enemy.x,
      y: enemy.y,
      r: 4,
      life: 0.28,
      color: enemy.boss ? "#ff6d3a" : enemy.type === "elite" ? "#ffd166" : "#56d8ff"
    });
    if (enemy.hp <= 0 && enemy.alive) {
      enemy.alive = false;
      state.energy += enemy.reward;
      state.score += Math.round((enemy.reward * 12 + (state.waveIndex + 1) * 4) * currentDifficulty().score);
      state.sparks.push({ x: enemy.x, y: enemy.y, r: enemy.boss ? 34 : 18, life: enemy.boss ? 0.56 : 0.36, color: enemy.boss ? "#ffd878" : "#66f2c2" });
      playSound("kill");
      if (allowDrop) maybeDropPower(enemy);
    }
  }

  function findTarget(tower, stats) {
    let best = null;
    let bestProgress = -1;
    for (const enemy of state.enemies) {
      if (!enemy.alive) continue;
      const d = Math.hypot(enemy.x - tower.x, enemy.y - tower.y);
      if (d <= stats.range && enemy.node + d / tile > bestProgress) {
        best = enemy;
        bestProgress = enemy.node + d / tile;
      }
    }
    return best;
  }

  function fireTower(tower, target, stats) {
    const def = towerDef(tower.type);
    if (tower.type === "mine") {
      const victims = state.enemies.filter(enemy => enemy.alive && Math.hypot(enemy.x - tower.x, enemy.y - tower.y) <= stats.blastRadius);
      victims.forEach(enemy => damageEnemy(enemy, stats.damage));
      state.sparks.push({ x: tower.x, y: tower.y, r: stats.blastRadius * 0.5, life: 0.42, color: def.color });
      state.shots.push({ x1: tower.x, y1: tower.y, x2: target.x, y2: target.y, life: 0.18, color: def.color, width: 7 });
      tower.remove = true;
      playSound("power");
      return;
    }
    if (tower.type === "arc") {
      const chainTargets = state.enemies
        .filter(e => e.alive && Math.hypot(e.x - target.x, e.y - target.y) <= 118)
        .sort((a, b) => Math.hypot(a.x - target.x, a.y - target.y) - Math.hypot(b.x - target.x, b.y - target.y))
        .slice(0, stats.chain);
      let from = tower;
      chainTargets.forEach((enemy, index) => {
        damageEnemy(enemy, Math.round(stats.damage * Math.pow(0.74, index)));
        state.shots.push({ x1: from.x, y1: from.y, x2: enemy.x, y2: enemy.y, life: 0.16, color: def.color, width: 4 - index * 0.6 });
        from = enemy;
      });
      playSound("shot");
      return;
    }
    damageEnemy(target, stats.damage);
    if (tower.type === "frost") {
      target.slow = stats.slow;
      target.slowTimer = stats.slowTime;
    }
    state.shots.push({ x1: tower.x, y1: tower.y, x2: target.x, y2: target.y, life: 0.2, color: def.color, width: tower.type === "frost" ? 5 : 3 });
    playSound("shot");
  }

  function update(dt) {
    if (state.paused || state.ended) return;
    dt *= state.speed;
    if (state.shake > 0) state.shake -= dt;
    if (state.waveActive) {
      const plan = wavePlan[state.waveIndex];
      state.spawnTimer -= dt;
      while (state.spawned < plan.count && state.spawnTimer <= 0) {
        const batch = Math.min(plan.swarm, plan.count - state.spawned);
        for (let i = 0; i < batch; i++) {
          state.enemies.push(makeEnemy(state.spawned + i));
        }
        state.spawned += batch;
        state.spawnTimer += plan.spawnGap;
      }
    }

    for (const enemy of state.enemies) {
      if (!enemy.alive) continue;
      if (enemy.slowTimer > 0) {
        enemy.slowTimer -= dt;
        if (enemy.slowTimer <= 0) enemy.slow = 1;
      }
      const target = path[enemy.node + 1] || path[enemy.node];
      const dx = target.x - enemy.x;
      const dy = target.y - enemy.y;
      const dist = Math.hypot(dx, dy);
      const move = enemy.speed * enemy.slow * dt;
      if (Math.abs(dx) > 0.5) enemy.facing = dx > 0 ? -1 : 1;
      if (dist <= move) {
        enemy.x = target.x;
        enemy.y = target.y;
        enemy.node += 1;
        if (enemy.node >= path.length - 1) {
          enemy.alive = false;
          enemy.leaked = true;
          state.lives -= enemy.finalBoss ? 8 : enemy.boss ? 5 : enemy.type === "elite" ? 2 : 1;
          state.shake = 0.24;
          state.sparks.push({ x: enemy.x, y: enemy.y, r: 22, life: 0.35, color: "#ff657d" });
          playSound("leak");
        }
      } else if (dist > 0) {
        enemy.x += (dx / dist) * move;
        enemy.y += (dy / dist) * move;
      }
    }

    for (const tower of state.towers) {
      const stats = towerStats(tower);
      if (tower.type === "bastion" && stats.repair > 0 && state.lives < state.maxLives) {
        tower.repairTimer = (tower.repairTimer || 0) - dt;
        if (tower.repairTimer <= 0) {
          const before = state.lives;
          state.lives = Math.min(state.maxLives, state.lives + stats.repair);
          tower.repairTimer = stats.repairCooldown;
          if (state.lives > before) {
            state.sparks.push({ x: tower.x, y: tower.y, r: 24, life: 0.38, color: "#58d4d0" });
            playSound("build");
          }
        }
      }
      tower.cooldown -= dt;
      if (tower.cooldown <= 0) {
        const target = findTarget(tower, stats);
        if (target) {
          fireTower(tower, target, stats);
          tower.cooldown = stats.cooldown;
        }
      }
    }
    state.towers = state.towers.filter(tower => !tower.remove);

    state.enemies = state.enemies.filter(e => e.alive);
    state.drops.forEach(drop => drop.age += dt);
    state.drops = state.drops.filter(drop => drop.age < drop.ttl);
    state.shots.forEach(s => s.life -= dt);
    state.shots = state.shots.filter(s => s.life > 0);
    state.sparks.forEach(s => {
      s.life -= dt;
      s.r += dt * 34;
    });
    state.sparks = state.sparks.filter(s => s.life > 0);

    if (state.lives <= 0) {
      endGame(false);
      return;
    }

    if (state.waveActive && state.spawned >= wavePlan[state.waveIndex].count && state.enemies.length === 0) {
      state.waveActive = false;
      state.waveIndex += 1;
      state.energy += 42 + state.waveIndex * 7;
      if (state.waveIndex >= wavePlan.length) {
        endGame(true);
      } else {
        const unlocked = newlyUnlockedTowers().map(tower => towerDef(tower.id).name);
        showBanner(unlocked.length ? `新設施開放：${unlocked.join("、")}` : "敵軍退散，糧草已補給。");
      }
      updateUi();
    }
  }

  function endGame(win) {
    if (state.ended) return;
    state.ended = true;
    state.won = win;
    state.readyForNextTheme = win;
    state.waveActive = false;
    const bonus = win ? Math.round((state.lives * 35 + state.energy * 2) * currentDifficulty().score) : 0;
    state.score += bonus;
    state.best = Math.max(state.best, state.score);
    localStorage.setItem("beexTdBest", String(state.best));
    saveLocalScore();
    playSound(win ? "win" : "lose");
    showBanner(win ? `守城大捷！戰功 ${state.score}。可選擇下一主題。` : `城門失守。戰功 ${state.score}。可提交榜單或重開。`, true);
    if (win) showChapterGate();
    updateUi();
  }

  function drawPathStroke(width, style, dash = null, alpha = 1) {
    if (!path.length) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = style;
    ctx.lineWidth = width;
    if (dash) ctx.setLineDash(dash);
    ctx.beginPath();
    path.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();
    ctx.restore();
  }

  function pathNormalAt(index) {
    const p = path[index];
    const prev = path[Math.max(0, index - 1)] || p;
    const next = path[Math.min(path.length - 1, index + 1)] || p;
    const dx = next.x - prev.x;
    const dy = next.y - prev.y;
    const len = Math.hypot(dx, dy) || 1;
    return { nx: -dy / len, ny: dx / len, angle: Math.atan2(dy, dx) };
  }

  function drawOffsetPath(distance, width, style, dash = null, alpha = 1) {
    if (!path.length) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = style;
    ctx.lineWidth = width;
    if (dash) ctx.setLineDash(dash);
    ctx.beginPath();
    path.forEach((p, i) => {
      const normal = pathNormalAt(i);
      const x = p.x + normal.nx * distance;
      const y = p.y + normal.ny * distance;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.restore();
  }

  function roadStyle(chapter, theme) {
    if (chapter.id === "glacier") {
      return {
        shadow: "rgba(21, 52, 70, 0.5)",
        verge: "rgba(219, 246, 255, 0.62)",
        outer: theme.road[0],
        mid: theme.road[1],
        slab: "#d8f0f2",
        slabAlt: "#a9cdd7",
        line: "rgba(48, 88, 102, 0.38)",
        edge: "rgba(246, 255, 255, 0.78)",
        glow: "rgba(215, 250, 255, 0.4)",
        chip: "rgba(79, 113, 126, 0.42)"
      };
    }
    if (chapter.id === "volcano") {
      return {
        shadow: "rgba(16, 6, 4, 0.68)",
        verge: "rgba(67, 41, 31, 0.7)",
        outer: theme.road[0],
        mid: theme.road[1],
        slab: "#9b5430",
        slabAlt: "#5b3328",
        line: "rgba(255, 143, 66, 0.42)",
        edge: "rgba(255, 126, 58, 0.7)",
        glow: "rgba(255, 99, 44, 0.34)",
        chip: "rgba(255, 191, 95, 0.45)"
      };
    }
    return {
      shadow: "rgba(55, 33, 15, 0.58)",
      verge: "rgba(80, 92, 42, 0.58)",
      outer: theme.road[0],
      mid: theme.road[1],
      slab: "#d7ad65",
      slabAlt: "#b77b3e",
      line: "rgba(88, 52, 20, 0.38)",
      edge: "rgba(255, 220, 126, 0.6)",
      glow: "rgba(255, 232, 166, 0.34)",
      chip: "rgba(92, 55, 22, 0.42)"
    };
  }

  function drawRoadSlabs(style) {
    path.forEach((p, i) => {
      if (i === 0 || i === path.length - 1) return;
      const normal = pathNormalAt(i);
      const bend = i > 0 && i < path.length - 1 && (
        Math.abs(path[i - 1].x - path[i + 1].x) < 4 ||
        Math.abs(path[i - 1].y - path[i + 1].y) < 4
      );
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(normal.angle);
      const jitter = ((i * 37) % 11) - 5;
      const w = bend ? 30 : 38 + (i % 3) * 4;
      const h = bend ? 30 : 25 + (i % 2) * 5;
      ctx.fillStyle = i % 2 ? style.slab : style.slabAlt;
      ctx.globalAlpha = 0.62;
      ctx.beginPath();
      ctx.roundRect(-w / 2 + jitter * 0.25, -h / 2, w, h, 8);
      ctx.fill();
      ctx.globalAlpha = 0.46;
      ctx.strokeStyle = style.line;
      ctx.lineWidth = 1.4;
      ctx.stroke();
      ctx.globalAlpha = 0.32;
      ctx.strokeStyle = style.glow;
      ctx.beginPath();
      ctx.moveTo(-w * 0.32, -h * 0.24);
      ctx.lineTo(w * 0.28, -h * 0.22);
      ctx.stroke();
      ctx.restore();
    });
  }

  function drawPremiumRoad(theme, chapter) {
    const style = roadStyle(chapter, theme);
    ctx.save();
    ctx.shadowColor = style.shadow;
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 12;
    drawPathStroke(72, style.shadow, null, 0.72);
    ctx.restore();

    drawPathStroke(70, style.verge, null, 0.54);
    drawPathStroke(62, style.outer, null, 0.88);
    drawPathStroke(52, style.mid, null, 0.94);
    drawPathStroke(42, theme.road[2], null, 0.86);
    drawOffsetPath(-29, 6, style.edge, [18, 10], 0.5);
    drawOffsetPath(29, 6, style.edge, [18, 10], 0.5);
    drawOffsetPath(-22, 2.5, "rgba(45, 20, 9, 0.42)", [8, 9], 0.75);
    drawOffsetPath(22, 2.5, "rgba(45, 20, 9, 0.42)", [8, 9], 0.75);
    drawRoadSlabs(style);
    drawPathStroke(2, style.glow, [20, 24], 0.62);

    ctx.save();
    ctx.fillStyle = style.chip;
    path.forEach((p, i) => {
      if (i % 3 !== 1) return;
      const normal = pathNormalAt(i);
      [-1, 1].forEach(side => {
        const x = p.x + normal.nx * (26 + (i % 4)) * side + ((i * 9) % 7) - 3;
        const y = p.y + normal.ny * (26 + (i % 4)) * side + ((i * 13) % 7) - 3;
        ctx.beginPath();
        ctx.ellipse(x, y, 5 + (i % 3), 2.2 + (i % 2), normal.angle + 0.4, 0, Math.PI * 2);
        ctx.fill();
      });
    });
    ctx.restore();
  }

  function drawTerrainDetails(chapter) {
    ctx.save();
    const rockFill = chapter.id === "glacier" ? "rgba(230, 250, 255, 0.52)" : chapter.id === "volcano" ? "rgba(88, 54, 42, 0.58)" : "rgba(216, 204, 150, 0.42)";
    const rockStroke = chapter.id === "volcano" ? "rgba(255, 120, 54, 0.22)" : "rgba(62, 54, 38, 0.18)";
    battlefield.groundStones.forEach(([x, y, rx, ry, rot]) => {
      ctx.fillStyle = rockFill;
      ctx.strokeStyle = rockStroke;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
    battlefield.blooms.forEach(([x, y, r, seed]) => {
      const flower = chapter.id === "glacier" ? "rgba(238, 255, 255, 0.62)" : chapter.id === "volcano" ? "rgba(255, 138, 65, 0.52)" : "rgba(255, 232, 122, 0.58)";
      ctx.fillStyle = flower;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(x + Math.cos(seed * 6 + i * 2.1) * r, y + Math.sin(seed * 6 + i * 2.1) * r, r * 0.72, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    ctx.restore();
  }

  function drawRiverRocks(chapter) {
    ctx.save();
    battlefield.riverRocks.forEach(([x, y, rx, ry, rot], i) => {
      ctx.fillStyle = chapter.id === "volcano" ? "rgba(56, 32, 28, 0.78)" : "rgba(238, 244, 226, 0.62)";
      ctx.strokeStyle = chapter.id === "volcano" ? "rgba(255, 118, 52, 0.32)" : "rgba(71, 107, 116, 0.28)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      if (i % 3 === 0) {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.32)";
        ctx.beginPath();
        ctx.moveTo(x - rx * 0.38, y - ry * 0.2);
        ctx.lineTo(x + rx * 0.28, y - ry * 0.32);
        ctx.stroke();
      }
    });
    ctx.restore();
  }

  function currentSceneImage(chapter) {
    const list = sceneImages[chapter.id] || [];
    const image = list[battlefield.sceneIndex] || list[0];
    if (image && image.complete && image.naturalWidth > 0) return image;
    return list.find(item => item && item.complete && item.naturalWidth > 0) || null;
  }

  function sceneIsPending(chapter) {
    const list = sceneImages[chapter.id] || [];
    if (!list.length) return false;
    return list.some(image => image && !image.complete && !image._failed);
  }

  function drawPendingSceneMap(theme, chapter) {
    drawSceneRoute(theme, chapter);
    drawSceneLandmarks(theme, chapter);
    return true;
  }

  function drawSceneBackdrop(image, chapter) {
    const variant = battlefield.sceneVariant || 0;
    const scales = [1, 1.025, 1.04, 1.018];
    const shifts = [[0, 0], [-12, 8], [14, -8], [8, 12]];
    const scale = scales[variant] || 1;
    const [shiftX, shiftY] = shifts[variant] || [0, 0];
    const sw = image.naturalWidth / scale;
    const sh = image.naturalHeight / scale;
    const sx = Math.max(0, (image.naturalWidth - sw) / 2 + shiftX);
    const sy = Math.max(0, (image.naturalHeight - sh) / 2 + shiftY);
    ctx.drawImage(image, sx, sy, sw, sh, 0, 0, W, H);

    const vignette = ctx.createRadialGradient(W / 2, H / 2, 250, W / 2, H / 2, 690);
    vignette.addColorStop(0, "rgba(255,255,255,0)");
    vignette.addColorStop(1, chapter.id === "glacier" ? "rgba(7,22,44,0.28)" : "rgba(24,8,4,0.34)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, W, H);

    if (variant === 1) {
      ctx.fillStyle = chapter.id === "volcano" ? "rgba(255,87,31,0.08)" : "rgba(255,232,166,0.08)";
      ctx.fillRect(0, 0, W, H);
    } else if (variant === 2) {
      ctx.fillStyle = chapter.id === "glacier" ? "rgba(190,238,255,0.1)" : "rgba(40,84,68,0.08)";
      ctx.fillRect(0, 0, W, H);
    }
  }

  function drawSceneRoute(theme, chapter) {
    const style = roadStyle(chapter, theme);
    ctx.save();
    ctx.globalCompositeOperation = chapter.id === "volcano" ? "screen" : "source-over";
    drawPathStroke(76, chapter.id === "volcano" ? "rgba(255,68,24,0.18)" : "rgba(18,10,5,0.24)", null, 0.75);
    ctx.globalCompositeOperation = "source-over";
    drawPathStroke(68, chapter.id === "glacier" ? "rgba(223,250,255,0.46)" : chapter.id === "volcano" ? "rgba(42,24,20,0.62)" : "rgba(86,58,30,0.52)", null, 0.78);
    drawPathStroke(52, style.mid, null, chapter.id === "volcano" ? 0.58 : 0.46);
    drawPathStroke(35, style.slab, null, chapter.id === "glacier" ? 0.32 : 0.26);
    drawOffsetPath(-34, 4.5, style.edge, [16, 10], 0.62);
    drawOffsetPath(34, 4.5, style.edge, [16, 10], 0.62);
    drawRoadSlabs(style);
    drawPathStroke(3, style.glow, [18, 22], chapter.id === "volcano" ? 0.82 : 0.52);
    ctx.restore();
  }

  function drawLandmarkImage(img, x, y, w, h, fallback) {
    ctx.save();
    ctx.shadowColor = "rgba(35, 15, 5, 0.35)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 6;
    if (img && img.complete && img.naturalWidth) {
      ctx.drawImage(img, x, y, w, h);
    } else {
      fallback();
    }
    ctx.restore();
  }

  function drawSceneLandmarks(theme, chapter) {
    const campImg = landmarks[`${chapter.id}Camp`];
    const gateImg = landmarks[`${chapter.id}Gate`];
    const startPoint = path[0];
    const endPoint = path[path.length - 1];
    drawLandmarkImage(campImg, startPoint.x - 68, startPoint.y - 126, 154, 154, () => {
      ctx.fillStyle = "#7e2b1a";
      ctx.strokeStyle = "#2b1208";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(startPoint.x - 42, startPoint.y - 38, 66, 58, 8);
      ctx.fill();
      ctx.stroke();
    });
    drawLandmarkImage(gateImg, endPoint.x - 84, endPoint.y - 138, 164, 164, () => {
      ctx.fillStyle = theme.gate[0];
      ctx.strokeStyle = "#2d1409";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(endPoint.x - 38, endPoint.y - 76, 72, 68, 8);
      ctx.fill();
      ctx.stroke();
    });
  }

  function drawBuildPads() {
    if (state.selectedTower || state.ended || !towerUnlocked(state.selectedBuild)) return;
    const def = towerDef(state.selectedBuild);
    ctx.save();
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const cell = { cx: x, cy: y, key: cellKey(x, y) };
        if (!canUseAsTowerPad(cell)) continue;
        const p = gridToWorld(x, y);
        const ok = state.energy >= def.cost;
        const nearHover = state.hoverCell && state.hoverCell.key === cell.key;
        ctx.globalAlpha = nearHover ? 0.92 : 0.42;
        ctx.fillStyle = ok ? "rgba(255,216,120,0.16)" : "rgba(255,101,125,0.12)";
        ctx.strokeStyle = ok ? "rgba(255,226,142,0.78)" : "rgba(255,101,125,0.62)";
        ctx.lineWidth = nearHover ? 3 : 1.6;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y + 4, 18, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        if (nearHover) {
          ctx.globalAlpha = 0.18;
          ctx.fillStyle = def.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, def.range, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    ctx.restore();
  }

  function drawSceneMap(theme, chapter) {
    const scene = currentSceneImage(chapter);
    if (!scene) return sceneIsPending(chapter) ? drawPendingSceneMap(theme, chapter) : false;
    drawSceneBackdrop(scene, chapter);
    drawSceneRoute(theme, chapter);
    drawSceneLandmarks(theme, chapter);
    return true;
  }

  function drawGrid() {
    ctx.save();
    ctx.translate(state.shake > 0 ? Math.sin(performance.now() / 22) * 3 : 0, 0);
    const theme = battlefield.theme;
    const chapter = currentChapter();

    if (drawSceneMap(theme, chapter)) {
      ctx.restore();
      return;
    }

    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, theme.sky[0]);
    sky.addColorStop(0.2, theme.sky[1]);
    sky.addColorStop(0.42, theme.sky[2]);
    sky.addColorStop(1, theme.sky[3]);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = theme.sun;
    ctx.beginPath();
    ctx.arc(88, 82, 44, 0, Math.PI * 2);
    ctx.fill();

    const far = ctx.createLinearGradient(0, 70, 0, 230);
    far.addColorStop(0, theme.far[0]);
    far.addColorStop(1, theme.far[1]);
    ctx.fillStyle = far;
    ctx.beginPath();
    ctx.moveTo(0, 190);
    [[82, 118], [150, 166], [236, 94], [326, 176], [420, 128], [522, 186], [618, 112], [724, 178], [838, 108], [948, 168], [1100, 118]]
      .forEach(([x, y]) => ctx.lineTo(x, y + battlefield.mountainShift));
    ctx.lineTo(W, 260);
    ctx.lineTo(0, 260);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "rgba(238, 244, 218, 0.62)";
    [[236, 94, 44], [618, 112, 36], [838, 108, 40]].forEach(([x, y, w]) => {
      ctx.beginPath();
      ctx.moveTo(x - w, y + 42);
      ctx.lineTo(x, y);
      ctx.lineTo(x + w, y + 42);
      ctx.lineTo(x + 12, y + 28);
      ctx.lineTo(x, y + 38);
      ctx.lineTo(x - 12, y + 28);
      ctx.closePath();
      ctx.fill();
    });

    ctx.strokeStyle = "rgba(255, 245, 210, 0.18)";
    ctx.lineWidth = 2;
    [[82, 118], [236, 94], [420, 128], [618, 112], [838, 108]].forEach(([x, y], i) => {
      ctx.beginPath();
      ctx.moveTo(x - 42, y + 58 + battlefield.mountainShift * 0.35);
      ctx.quadraticCurveTo(x, y + 26 + battlefield.mountainShift * 0.35, x + 48, y + 60 + battlefield.mountainShift * 0.35);
      ctx.stroke();
      if (i % 2 === 0) {
        ctx.strokeStyle = "rgba(34, 68, 48, 0.22)";
        ctx.beginPath();
        ctx.moveTo(x - 78, y + 94 + battlefield.mountainShift * 0.25);
        ctx.lineTo(x + 88, y + 90 + battlefield.mountainShift * 0.25);
        ctx.stroke();
        ctx.strokeStyle = "rgba(255, 245, 210, 0.18)";
      }
    });

    ctx.fillStyle = theme.field;
    ctx.beginPath();
    ctx.moveTo(0, 218);
    ctx.bezierCurveTo(180, 188, 326, 236, 516, 214);
    ctx.bezierCurveTo(738, 190, 910, 224, W, 198);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();

    for (let i = 0; i < 170; i++) {
      const x = (i * 73 + battlefield.weatherSeed * 19) % W;
      const y = 236 + ((i * 47 + battlefield.weatherSeed * 31) % (H - 258));
      const len = 8 + (i % 5) * 3;
      ctx.strokeStyle = i % 3 === 0 ? "rgba(255, 241, 172, 0.12)" : "rgba(39, 91, 52, 0.12)";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + len * 0.5, y - 4, x + len, y - 1);
      ctx.stroke();
    }

    ctx.fillStyle = "rgba(224, 199, 118, 0.36)";
    battlefield.fieldMarks.forEach(([x, y, rx, ry, rot]) => {
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2);
      ctx.fill();
    });
    drawTerrainDetails(chapter);

    const drawRiverLine = () => {
      const segments = riverSegments();
      ctx.beginPath();
      ctx.moveTo(segments[0][0][0], segments[0][0][1] + battlefield.riverShift);
      segments.forEach(segment => {
        ctx.bezierCurveTo(
          segment[1][0], segment[1][1] + battlefield.riverShift,
          segment[2][0], segment[2][1] + battlefield.riverShift,
          segment[3][0], segment[3][1] + battlefield.riverShift
        );
      });
      ctx.stroke();
    };
    ctx.strokeStyle = chapter.id === "volcano" ? "rgba(37, 19, 17, 0.72)" : "rgba(35, 73, 78, 0.42)";
    ctx.lineWidth = 72;
    ctx.lineCap = "round";
    drawRiverLine();
    ctx.strokeStyle = theme.river[0];
    ctx.lineWidth = 56;
    drawRiverLine();
    const riverGrad = ctx.createLinearGradient(0, 260 + battlefield.riverShift, W, 700 + battlefield.riverShift);
    riverGrad.addColorStop(0, theme.river[0]);
    riverGrad.addColorStop(0.45, theme.river[1]);
    riverGrad.addColorStop(1, chapter.id === "volcano" ? "#ff7a31" : "#63c9df");
    ctx.strokeStyle = riverGrad;
    ctx.lineWidth = 38;
    drawRiverLine();
    drawRiverRocks(chapter);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.42)";
    ctx.lineWidth = 3;
    ctx.setLineDash([18, 22]);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.36)";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    riverSegments().forEach(segment => {
      for (let i = 1; i < 5; i++) {
        const p = cubicPoint(segment, i / 6);
        ctx.beginPath();
        ctx.moveTo(p.x - 16, p.y + battlefield.riverShift + 3);
        ctx.lineTo(p.x + 14, p.y + battlefield.riverShift - 5);
        ctx.stroke();
      }
    });

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const key = `${x},${y}`;
        const px = offset.x + x * tile;
        const py = offset.y + y * tile;
        if (pathSet.has(key)) continue;
        if (blockedSet.has(key)) {
          ctx.fillStyle = theme.blocker[0];
          ctx.beginPath();
          ctx.moveTo(px + 4, py + 38);
          ctx.lineTo(px + 20, py + 10);
          ctx.lineTo(px + 39, py + 38);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = theme.blocker[1];
          ctx.fillRect(px + 7, py + 33, 30, 7);
          ctx.fillStyle = theme.blocker[2];
          for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(px + 12 + i * 9, py + 34);
            ctx.lineTo(px + 14 + i * 8, py + 19);
            ctx.lineTo(px + 20 + i * 6, py + 34);
            ctx.closePath();
            ctx.fill();
          }
        } else {
          ctx.fillStyle = "rgba(255, 247, 198, 0.07)";
          ctx.beginPath();
          ctx.ellipse(px + tile / 2, py + tile / 2, 13, 7, ((x + y) % 5) * 0.28, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    drawPremiumRoad(theme, chapter);

    battlefield.bridgeCells.forEach(([cx, cy]) => {
      const p = gridToWorld(cx, cy);
      const prev = pathCells.find(([x, y]) => Math.abs(x - cx) + Math.abs(y - cy) === 1);
      const vertical = prev ? prev[0] === cx : false;
      ctx.save();
      ctx.translate(p.x, p.y);
      if (vertical) ctx.rotate(Math.PI / 2);
      ctx.fillStyle = "rgba(20, 9, 4, 0.48)";
      ctx.beginPath();
      ctx.roundRect(-46, -32, 92, 64, 10);
      ctx.fill();
      ctx.fillStyle = chapter.id === "glacier" ? "#c4d8dc" : chapter.id === "volcano" ? "#654030" : "#9b5a2b";
      ctx.strokeStyle = chapter.id === "glacier" ? "#58717a" : "#4f2610";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(-42, -26, 84, 52, 8);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = chapter.id === "volcano" ? "rgba(255, 145, 72, 0.34)" : "rgba(255, 231, 160, 0.42)";
      ctx.lineWidth = 2.5;
      for (let i = -30; i <= 30; i += 12) {
        ctx.beginPath();
        ctx.moveTo(i, -24);
        ctx.lineTo(i, 24);
        ctx.stroke();
      }
      ctx.strokeStyle = chapter.id === "glacier" ? "#6d8a95" : "#6d3517";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(-44, -24);
      ctx.lineTo(44, -24);
      ctx.moveTo(-44, 24);
      ctx.lineTo(44, 24);
      ctx.stroke();
      ctx.strokeStyle = "rgba(255, 246, 204, 0.35)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-32, -13);
      ctx.lineTo(32, -15);
      ctx.stroke();
      ctx.restore();
    });

    const drawLandmark = (img, x, y, w, h, fallback) => {
      ctx.save();
      ctx.shadowColor = "rgba(35, 15, 5, 0.35)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 6;
      if (img && img.complete && img.naturalWidth) {
        ctx.drawImage(img, x, y, w, h);
      } else {
        fallback();
      }
      ctx.restore();
    };

    const campImg = landmarks[`${chapter.id}Camp`];
    const gateImg = landmarks[`${chapter.id}Gate`];
    const startPoint = path[0];
    const endPoint = path[path.length - 1];
    drawLandmark(campImg, startPoint.x - 68, startPoint.y - 126, 154, 154, () => {
      ctx.fillStyle = "#7e2b1a";
      ctx.strokeStyle = "#2b1208";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(startPoint.x - 42, startPoint.y - 38, 66, 58, 8);
      ctx.fill();
      ctx.stroke();
    });
    drawLandmark(gateImg, endPoint.x - 84, endPoint.y - 138, 164, 164, () => {
      ctx.fillStyle = theme.gate[0];
      ctx.strokeStyle = "#2d1409";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(endPoint.x - 38, endPoint.y - 76, 72, 68, 8);
      ctx.fill();
      ctx.stroke();
    });

    ctx.fillStyle = "rgba(36, 82, 44, 0.72)";
    battlefield.trees.forEach(([x, y]) => {
      if (pathSet.has(`${Math.floor((x - offset.x) / tile)},${Math.floor((y - offset.y) / tile)}`)) return;
      ctx.beginPath();
      if (chapter.id === "glacier") {
        ctx.moveTo(x - 6, y);
        ctx.lineTo(x + 3, y - 18);
        ctx.lineTo(x + 12, y);
      } else if (chapter.id === "volcano") {
        ctx.moveTo(x - 7, y);
        ctx.lineTo(x + 2, y - 18);
        ctx.lineTo(x + 12, y);
      } else {
        ctx.moveTo(x, y);
        ctx.lineTo(x + 4, y - 16);
        ctx.lineTo(x + 9, y);
      }
      ctx.closePath();
      ctx.fill();
    });
    ctx.restore();
  }

  function drawWeather() {
    const chapter = currentChapter();
    const t = performance.now() / 1000 + battlefield.weatherSeed;
    ctx.save();
    if (chapter.weatherKind === "snow") {
      ctx.fillStyle = "rgba(238, 252, 255, 0.82)";
      for (let i = 0; i < 70; i++) {
        const x = (i * 83 + t * 34 + Math.sin(t + i) * 26) % W;
        const y = (i * 47 + t * 66) % H;
        const r = 1.5 + (i % 4) * 0.7;
        ctx.globalAlpha = 0.42 + (i % 5) * 0.08;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (chapter.weatherKind === "ember") {
      for (let i = 0; i < 46; i++) {
        const x = (i * 97 + Math.sin(t * 0.8 + i) * 90 + W) % W;
        const y = (H - ((i * 53 + t * 82) % H));
        ctx.globalAlpha = 0.32 + (i % 4) * 0.12;
        ctx.fillStyle = i % 3 === 0 ? "#ffd27a" : "#ff743d";
        ctx.beginPath();
        ctx.ellipse(x, y, 2 + (i % 3), 5 + (i % 4), -0.35, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      ctx.strokeStyle = "rgba(255, 239, 170, 0.26)";
      ctx.lineWidth = 2;
      for (let i = 0; i < 34; i++) {
        const x = (i * 76 + t * 28) % W;
        const y = 54 + ((i * 61 + Math.sin(t + i) * 18) % 520);
        ctx.globalAlpha = 0.3 + (i % 4) * 0.08;
        ctx.beginPath();
        ctx.ellipse(x, y, 12, 5, 0.25, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  function drawHover() {
    const cell = state.hoverCell;
    if (!cell || state.ended) return;
    const p = gridToWorld(cell.cx, cell.cy);
    const ok = canBuild(cell);
    ctx.save();
    const def = towerDef(state.selectedBuild);
    ctx.fillStyle = ok ? "rgba(102, 242, 194, 0.2)" : "rgba(255, 101, 125, 0.18)";
    ctx.strokeStyle = ok ? "rgba(102, 242, 194, 0.9)" : "rgba(255, 101, 125, 0.88)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(p.x, p.y + 4, 22, 13, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(p.x, p.y, def.range, 0, Math.PI * 2);
    ctx.fillStyle = ok ? "rgba(86, 216, 255, 0.045)" : "rgba(255, 101, 125, 0.035)";
    ctx.fill();
    ctx.strokeStyle = ok ? "rgba(86, 216, 255, 0.24)" : "rgba(255, 101, 125, 0.2)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  }

  function drawTowers() {
    for (const tower of state.towers) {
      const def = towerDef(tower.type);
      const selected = state.selectedTower === tower;
      const stats = towerStats(tower);
      ctx.save();
      if (selected) {
        ctx.beginPath();
        ctx.arc(tower.x, tower.y, stats.range, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(86, 216, 255, 0.055)";
        ctx.fill();
        ctx.strokeStyle = "rgba(86, 216, 255, 0.24)";
        ctx.stroke();
      }
      ctx.translate(tower.x, tower.y);
      ctx.fillStyle = "rgba(0, 0, 0, 0.36)";
      ctx.beginPath();
      ctx.ellipse(0, 15, 24, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      const img = icons[def.icon];
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.shadowColor = def.color;
        ctx.shadowBlur = selected ? 18 : 8;
        const spriteSize = tower.type === "mine" ? 62 : tower.type === "bastion" ? 66 : 70;
        ctx.drawImage(img, -spriteSize / 2, -spriteSize + 18, spriteSize, spriteSize);
      } else {
        ctx.fillStyle = "#5a2f17";
        ctx.strokeStyle = "#281106";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(-19, -10, 38, 29, 7);
        ctx.fill();
        ctx.stroke();
        const grad = ctx.createRadialGradient(-7, -12, 3, 0, -8, 25);
        grad.addColorStop(0, "#fff4c6");
        grad.addColorStop(0.42, def.color);
        grad.addColorStop(1, "#7a361a");
        ctx.fillStyle = grad;
        ctx.strokeStyle = selected ? "#fff7dc" : "rgba(45,18,8,0.7)";
        ctx.lineWidth = selected ? 3 : 2;
        ctx.beginPath();
        ctx.roundRect(-21, -25, 42, 38, 8);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = def.color;
        ctx.beginPath();
        ctx.moveTo(0, -24);
        ctx.lineTo(15, 2);
        ctx.lineTo(0, 16);
        ctx.lineTo(-15, 2);
        ctx.closePath();
        ctx.fill();
      }
      ctx.fillStyle = def.color;
      for (let i = 0; i < tower.level; i++) {
        ctx.beginPath();
        ctx.arc(-12 + i * 8, -42, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  function drawEnemies() {
    const chapter = currentChapter();
    for (const enemy of state.enemies) {
      const hp = Math.max(0, enemy.hp / enemy.maxHp);
      ctx.save();
      ctx.translate(enemy.x, enemy.y);
      ctx.fillStyle = "rgba(0,0,0,0.34)";
      ctx.beginPath();
      ctx.ellipse(0, enemy.radius + 5, enemy.radius + 8, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      if (enemy.boss) {
        const aura = enemy.finalBoss ? "rgba(255, 88, 54, 0.42)" : "rgba(255, 216, 120, 0.32)";
        ctx.fillStyle = aura;
        ctx.beginPath();
        ctx.arc(0, -18, enemy.finalBoss ? 42 : 34, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = enemy.finalBoss ? "rgba(255, 236, 178, 0.86)" : "rgba(255, 216, 120, 0.72)";
        ctx.lineWidth = enemy.finalBoss ? 4 : 3;
        ctx.beginPath();
        ctx.arc(0, -18, enemy.finalBoss ? 46 : 38, 0, Math.PI * 2);
        ctx.stroke();
      }

      const sprite = enemySprites[enemy.spriteType || enemy.type];
      const size = enemy.finalBoss ? 98 : enemy.boss ? 84 : enemy.type === "runner" ? 62 : enemy.type === "elite" ? 68 : 54;
      if (sprite && sprite.complete && sprite.naturalWidth > 0) {
        ctx.save();
        ctx.scale(enemy.facing || 1, 1);
        ctx.drawImage(sprite, -size / 2, -size + 14, size, size);
        if (chapter.enemyTint) {
          ctx.globalCompositeOperation = "source-atop";
          ctx.fillStyle = chapter.enemyTint;
          ctx.fillRect(-size / 2, -size + 14, size, size);
        }
        ctx.restore();
        if (chapter.id !== "ancient") {
          ctx.strokeStyle = chapter.id === "glacier" ? "rgba(190, 245, 255, 0.74)" : "rgba(255, 126, 58, 0.72)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(0, -18, size * 0.34, 0, Math.PI * 2);
          ctx.stroke();
        }
        if (enemy.boss) {
          ctx.fillStyle = enemy.finalBoss ? "#ffe6a3" : "#ffd878";
          ctx.strokeStyle = "rgba(45,18,8,0.82)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(-22, -size + 22);
          ctx.lineTo(-10, -size + 2);
          ctx.lineTo(0, -size + 18);
          ctx.lineTo(10, -size + 2);
          ctx.lineTo(22, -size + 22);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
        if (enemy.slow < 1) {
          ctx.strokeStyle = "rgba(159, 232, 255, 0.8)";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(0, -16, size * 0.38, 0, Math.PI * 2);
          ctx.stroke();
        }
      } else {
        const color = enemy.boss ? "#9b3d24" : enemy.type === "elite" ? "#d6a24a" : enemy.type === "runner" ? "#c85a3a" : "#405a37";
        ctx.fillStyle = enemy.slow < 1 ? "#9fe8ff" : color;
        ctx.strokeStyle = "rgba(39,17,8,0.88)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(-enemy.radius, -enemy.radius + 3, enemy.radius * 2, enemy.radius * 1.8, 5);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = enemy.boss ? "#ffd878" : enemy.type === "elite" ? "#7c2d1a" : "#d8c08a";
        ctx.beginPath();
        ctx.arc(0, -enemy.radius + 1, enemy.radius * 0.62, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = enemy.boss || enemy.type === "elite" ? "#ffd878" : "#251007";
        ctx.beginPath();
        ctx.moveTo(-enemy.radius - 2, -enemy.radius + 1);
        ctx.lineTo(0, -enemy.radius - 10);
        ctx.lineTo(enemy.radius + 2, -enemy.radius + 1);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
      const barWidth = enemy.finalBoss ? 76 : enemy.boss ? 62 : 40;
      ctx.fillStyle = "rgba(39,17,8,0.92)";
      ctx.fillRect(-barWidth / 2, -enemy.radius - 30, barWidth, enemy.boss ? 7 : 5);
      ctx.fillStyle = hp > 0.5 ? "#70d4a4" : hp > 0.24 ? "#ffd878" : "#e55236";
      ctx.fillRect(-barWidth / 2, -enemy.radius - 30, barWidth * hp, enemy.boss ? 7 : 5);
      ctx.restore();
    }
  }

  function drawDrops() {
    const icon = powerIcons.beeCrossbow;
    for (const drop of state.drops) {
      const pulse = 1 + Math.sin((performance.now() / 180) + drop.x) * 0.08;
      ctx.save();
      ctx.translate(drop.x, drop.y - 18);
      ctx.scale(pulse, pulse);
      ctx.globalAlpha = Math.max(0.35, 1 - Math.max(0, drop.age - 5) / 3);
      ctx.shadowColor = "#fff1a6";
      ctx.shadowBlur = 22;
      ctx.fillStyle = "rgba(255, 225, 105, 0.28)";
      ctx.beginPath();
      ctx.arc(0, 0, 31, 0, Math.PI * 2);
      ctx.fill();
      if (icon && icon.complete && icon.naturalWidth > 0) {
        ctx.drawImage(icon, -28, -28, 56, 56);
      } else {
        ctx.fillStyle = "#ffe388";
        ctx.beginPath();
        ctx.moveTo(-22, -4);
        ctx.lineTo(20, -18);
        ctx.lineTo(8, 4);
        ctx.lineTo(22, 20);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }
  }

  function drawShots() {
    for (const shot of state.shots) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, shot.life / 0.2);
      ctx.strokeStyle = shot.color;
      ctx.lineWidth = shot.width;
      ctx.lineCap = "round";
      ctx.shadowColor = shot.color;
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.moveTo(shot.x1, shot.y1);
      ctx.lineTo(shot.x2, shot.y2);
      ctx.stroke();
      ctx.restore();
    }
  }

  function drawSparks() {
    for (const spark of state.sparks) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, spark.life / 0.36);
      ctx.strokeStyle = spark.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(spark.x, spark.y, spark.r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }

  function drawTopLabels() {
    const chapter = currentChapter();
    ctx.save();
    ctx.fillStyle = "rgba(255,243,216,0.86)";
    ctx.font = "900 14px system-ui";
    ctx.textAlign = "left";
    ctx.fillText(chapter.enemyCamp, 12, 26);
    ctx.textAlign = "right";
    ctx.fillText(chapter.gate, W - 12, 26);
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(255,243,216,0.74)";
    ctx.fillText(`${chapter.name} · ${chapter.weather}`, W / 2, 26);
    if (!state.waveActive && !state.ended) {
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(255,243,216,0.72)";
      ctx.font = "900 16px system-ui";
      ctx.fillText("先布防，再迎敵", W / 2, H - 28);
    }
    ctx.restore();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    drawGrid();
    drawWeather();
    drawBuildPads();
    drawHover();
    drawDrops();
    drawTowers();
    drawEnemies();
    drawShots();
    drawSparks();
    drawTopLabels();
  }

  function loop(now) {
    const dt = Math.min(0.04, (now - state.last) / 1000 || 0);
    state.last = now;
    update(dt);
    draw();
    requestAnimationFrame(loop);
  }

  canvas.addEventListener("pointermove", event => {
    state.hoverCell = worldToCell(pointerToWorld(event).x, pointerToWorld(event).y);
  });

  canvas.addEventListener("pointerleave", () => {
    state.hoverCell = null;
  });

  canvas.addEventListener("pointerdown", event => {
    unlockAudio();
    if (state.ended) {
      playSound("deny");
      showBanner(state.won ? "已通關，請選擇下一主題或留在本主題。" : "戰局已結束，請提交榜單或重開。", true);
      if (state.won) showChapterGate();
      return;
    }
    const point = pointerToWorld(event);
    const drop = pickDrop(point);
    if (drop) {
      collectDrop(drop);
      return;
    }
    const cell = worldToCell(point.x, point.y);
    const tower = pickTower(cell);
    if (tower) {
      state.selectedTower = tower;
      updateUi();
      return;
    }
    state.selectedTower = null;
    buildTower(cell);
  });

  canvas.addEventListener("dragover", event => {
    event.preventDefault();
    const point = pointerToWorld(event);
    state.hoverCell = worldToCell(point.x, point.y);
    event.dataTransfer.dropEffect = "copy";
  });

  canvas.addEventListener("drop", event => {
    event.preventDefault();
    unlockAudio();
    const towerId = event.dataTransfer.getData("text/plain");
    if (towers[towerId]) state.selectedBuild = towerId;
    state.selectedTower = null;
    const point = pointerToWorld(event);
    state.hoverCell = worldToCell(point.x, point.y);
    buildTower(state.hoverCell);
    updateUi();
  });

  ui.upgradeBtn.addEventListener("click", () => {
    const t = state.selectedTower;
    if (!t || t.level >= 4) return;
    const cost = upgradeCost(t);
    if (state.energy < cost) return;
    state.energy -= cost;
    t.level += 1;
    state.sparks.push({ x: t.x, y: t.y, r: 18, life: 0.4, color: towerDef(t.type).color });
    playSound("upgrade");
    updateUi();
  });

  ui.sellBtn.addEventListener("click", () => {
    const t = state.selectedTower;
    if (!t) return;
    state.energy += sellValue(t);
    state.towers = state.towers.filter(item => item !== t);
    state.selectedTower = null;
    playSound("click");
    updateUi();
  });

  window.addEventListener("pointerdown", unlockAudio, { once: false, passive: true });
  ui.startBtn.addEventListener("click", () => {
    unlockAudio();
    startWave();
  });
  ui.pauseBtn.addEventListener("click", () => {
    unlockAudio();
    if (state.ended) return;
    state.paused = !state.paused;
    playSound("click");
    showBanner(state.paused ? "已暫停" : "繼續迎敵");
    updateUi();
  });
  ui.speedBtn.addEventListener("click", () => {
    unlockAudio();
    state.speed = state.speed === 1 ? 2 : state.speed === 2 ? 3 : 1;
    playSound("click");
    updateUi();
  });
  ui.soundBtn.addEventListener("click", () => {
    audio.muted = !audio.muted;
    localStorage.setItem("beexTdMuted", audio.muted ? "1" : "0");
    if (!audio.muted) {
      unlockAudio();
      playSound("click");
    }
    updateUi();
  });
  ui.restartBtn.addEventListener("click", restart);
  ui.nextThemeBtn.addEventListener("click", () => {
    unlockAudio();
    if (!state.won) return;
    enterNextTheme();
  });
  ui.stayThemeBtn.addEventListener("click", () => {
    unlockAudio();
    restart();
  });
  ui.submitScoreBtn.addEventListener("click", submitScore);
  ui.refreshBoardBtn.addEventListener("click", loadRemoteLeaderboard);
  ui.difficultySelect.addEventListener("change", () => {
    selectedDifficultyId = difficulties[ui.difficultySelect.value] ? ui.difficultySelect.value : "easy";
    localStorage.setItem("beexTdDifficulty", selectedDifficultyId);
    resetStateForChapter({
      chapterIndex: state.chapterIndex,
      chapterLevel: state.chapterLevel,
      carryScore: false
    });
    showBanner(`難度切換：${currentDifficulty().name}`);
  });
  ui.playerName.addEventListener("input", () => {
    state.playerName = cleanPlayerName(ui.playerName.value);
    localStorage.setItem("beexTdPlayer", state.playerName);
    updateUi();
  });

  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("keydown", event => {
    if (event.target && ["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName)) return;
    if (event.key === "1") state.selectedBuild = "pulse";
    if (event.key === "2") state.selectedBuild = "frost";
    if (event.key === "3") state.selectedBuild = "arc";
    if (event.code === "Space") {
      event.preventDefault();
      startWave();
    }
    if (event.key.toLowerCase() === "p") {
      state.paused = !state.paused;
    }
    updateUi();
  });

  if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function roundRect(x, y, w, h, r) {
      const radius = Math.min(r, w / 2, h / 2);
      this.beginPath();
      this.moveTo(x + radius, y);
      this.arcTo(x + w, y, x + w, y + h, radius);
      this.arcTo(x + w, y + h, x, y + h, radius);
      this.arcTo(x, y + h, x, y, radius);
      this.arcTo(x, y, x + w, y, radius);
      this.closePath();
      return this;
    };
  }

  resizeCanvas();
  ui.playerName.value = state.playerName;
  updateUi();
  renderLeaderboard();
  loadRemoteLeaderboard();
  showBanner("布防守城，護住蜂巢城門");
  state.last = performance.now();
  requestAnimationFrame(loop);
})();

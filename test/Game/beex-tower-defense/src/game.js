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
    restartBtn: document.getElementById("restartBtn"),
    playerName: document.getElementById("playerName"),
    submitScoreBtn: document.getElementById("submitScoreBtn"),
    refreshBoardBtn: document.getElementById("refreshBoardBtn"),
    leaderboardList: document.getElementById("leaderboardList"),
    leaderboardHint: document.getElementById("leaderboardHint"),
    banner: document.getElementById("banner")
  };

  const W = 1100;
  const H = 720;
  const tile = 44;
  const cols = 25;
  const rows = 15;
  const offset = { x: 0, y: 30 };
  const pathCells = [
    [0, 7], [1, 7], [2, 7], [3, 7], [4, 7],
    [4, 6], [4, 5], [4, 4], [5, 4], [6, 4], [7, 4], [8, 4],
    [8, 5], [8, 6], [8, 7], [9, 7], [10, 7], [11, 7], [12, 7],
    [12, 8], [12, 9], [12, 10], [13, 10], [14, 10], [15, 10], [16, 10],
    [16, 9], [16, 8], [16, 7], [17, 7], [18, 7], [19, 7], [20, 7],
    [20, 6], [20, 5], [21, 5], [22, 5], [23, 5], [24, 5]
  ];
  const path = pathCells.map(([x, y]) => ({
    x: offset.x + x * tile + tile / 2,
    y: offset.y + y * tile + tile / 2
  }));
  const pathSet = new Set(pathCells.map(([x, y]) => `${x},${y}`));
  const blockedSet = new Set([
    "2,2", "3,2", "6,11", "7,11", "18,3", "19,3", "22,10", "23,10"
  ]);
  const leaderboardUrl = "leaderboard.json";
  const issueUrl = "https://github.com/windzxy/windzxy.github.io/issues/new";
  const iconFiles = {
    crossbow: "assets/icons/tower-crossbow.svg",
    lotus: "assets/icons/tower-lotus.svg",
    drum: "assets/icons/tower-drum.svg"
  };
  const icons = Object.fromEntries(Object.entries(iconFiles).map(([key, src]) => {
    const img = new Image();
    img.src = src;
    img.addEventListener("load", () => draw());
    return [key, img];
  }));

  const towers = {
    pulse: {
      id: "pulse",
      name: "神機弩",
      icon: "crossbow",
      cost: 55,
      color: "#ffd878",
      range: 128,
      damage: 21,
      cooldown: 0.52,
      effect: "遠距離單體輸出"
    },
    frost: {
      id: "frost",
      name: "寒玉蓮",
      icon: "lotus",
      cost: 75,
      color: "#9fe8ff",
      range: 116,
      damage: 8,
      cooldown: 0.8,
      slow: 0.5,
      slowTime: 1.45,
      effect: "寒氣減速控制"
    },
    arc: {
      id: "arc",
      name: "雷鼓臺",
      icon: "drum",
      cost: 105,
      color: "#ffcf5d",
      range: 142,
      damage: 15,
      cooldown: 0.96,
      chain: 3,
      effect: "雷擊連鎖傷害"
    }
  };

  const wavePlan = Array.from({ length: 12 }, (_, i) => ({
    count: 9 + i * 3,
    hp: 58 + i * 22 + Math.max(0, i - 5) * 18,
    speed: 52 + i * 4,
    reward: 9 + Math.floor(i / 3),
    spawnGap: Math.max(0.38, 0.82 - i * 0.035),
    swarm: i > 6 ? 2 : 1
  }));

  const state = {
    energy: 180,
    lives: 20,
    waveIndex: 0,
    score: 0,
    best: Number(localStorage.getItem("beexTdBest") || 0),
    localScores: readLocalScores(),
    remoteScores: [],
    playerName: localStorage.getItem("beexTdPlayer") || "",
    scoreSubmittedFor: "",
    selectedBuild: "pulse",
    selectedTower: null,
    hoverCell: null,
    towers: [],
    enemies: [],
    shots: [],
    sparks: [],
    spawnTimer: 0,
    spawned: 0,
    waveActive: false,
    paused: false,
    speed: 1,
    ended: false,
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
    return `${state.playerName}:${state.score}:${state.waveIndex}:${state.lives}:${state.energy}`;
  }

  function saveLocalScore() {
    const name = cleanPlayerName(state.playerName) || "無名俠客";
    const entry = {
      name,
      score: state.score,
      wave: Math.min(state.waveIndex + 1, wavePlan.length),
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
      "game: beex-tower-defense",
      `player: ${state.playerName}`,
      `score: ${state.score}`,
      `wave: ${Math.min(state.waveIndex + 1, wavePlan.length)}`,
      `lives: ${Math.max(0, state.lives)}`,
      `energy: ${state.energy}`,
      `time: ${new Date().toISOString()}`
    ].join("\n");
    const params = new URLSearchParams({
      title: `[BeeX Score] ${state.playerName} - ${state.score}`,
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

  function canBuild(cell) {
    if (!cell) return false;
    if (pathSet.has(cell.key) || blockedSet.has(cell.key) || cellHasTower(cell.key)) return false;
    return state.energy >= towers[state.selectedBuild].cost;
  }

  function makeEnemy(index) {
    const plan = wavePlan[state.waveIndex];
    const elite = state.waveIndex >= 5 && index % 7 === 0;
    const runner = state.waveIndex >= 3 && index % 5 === 2;
    const hp = plan.hp * (elite ? 1.8 : 1) * (runner ? 0.72 : 1);
    const speed = plan.speed * (runner ? 1.45 : 1) * (elite ? 0.75 : 1);
    const first = path[0];
    return {
      x: first.x - 28,
      y: first.y,
      hp,
      maxHp: hp,
      speed,
      reward: plan.reward + (elite ? 6 : 0),
      node: 0,
      radius: elite ? 16 : runner ? 10 : 13,
      slow: 1,
      slowTimer: 0,
      type: elite ? "elite" : runner ? "runner" : "drone",
      alive: true,
      leaked: false
    };
  }

  function towerStats(t) {
    const base = towers[t.type];
    const level = t.level;
    return {
      range: base.range + (level - 1) * 15,
      damage: Math.round(base.damage * (1 + (level - 1) * 0.45)),
      cooldown: Math.max(0.22, base.cooldown * (1 - (level - 1) * 0.1)),
      slow: base.slow,
      slowTime: base.slowTime,
      chain: base.chain ? base.chain + level - 1 : 0
    };
  }

  function upgradeCost(t) {
    return Math.round(towers[t.type].cost * (0.72 + t.level * 0.5));
  }

  function sellValue(t) {
    let spent = towers[t.type].cost;
    for (let i = 1; i < t.level; i++) {
      spent += Math.round(towers[t.type].cost * (0.72 + i * 0.5));
    }
    return Math.floor(spent * 0.68);
  }

  function renderTowerButtons() {
    ui.towerList.innerHTML = "";
    Object.values(towers).forEach(tower => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `tower-card ${state.selectedBuild === tower.id ? "active" : ""}`;
      btn.innerHTML = `
        <span class="tower-icon"><img src="${iconFiles[tower.icon]}" alt=""></span>
        <span class="tower-meta"><strong>${tower.name}</strong><small>${tower.effect}</small></span>
        <span class="tower-cost">${tower.cost} 糧</span>
      `;
      btn.addEventListener("click", () => {
        state.selectedBuild = tower.id;
        state.selectedTower = null;
        updateUi();
      });
      ui.towerList.appendChild(btn);
    });
  }

  function updateUi() {
    ui.energy.textContent = state.energy;
    ui.lives.textContent = state.lives;
    ui.wave.textContent = `${Math.min(state.waveIndex + 1, wavePlan.length)}/${wavePlan.length}`;
    ui.score.textContent = state.score;
    ui.bestScore.textContent = state.best;
    ui.startBtn.disabled = state.waveActive || state.ended || state.waveIndex >= wavePlan.length;
    ui.pauseBtn.textContent = state.paused ? "繼續" : "暫停";
    ui.speedBtn.textContent = `${state.speed}x 速度`;
    ui.submitScoreBtn.disabled = !state.ended || state.score <= 0 || scoreKey() === state.scoreSubmittedFor;
    if (state.selectedTower) {
      const t = state.selectedTower;
      const def = towers[t.type];
      const cost = upgradeCost(t);
      ui.selectedText.textContent = `${def.name} ${t.level}級｜攻擊 ${towerStats(t).damage}｜拆除返還 ${sellValue(t)}`;
      ui.upgradeBtn.disabled = t.level >= 4 || state.energy < cost;
      ui.upgradeBtn.textContent = t.level >= 4 ? "滿級" : `升級 ${cost}`;
      ui.sellBtn.disabled = false;
    } else {
      const def = towers[state.selectedBuild];
      ui.selectedText.textContent = `準備建造 ${def.name}。消耗 ${def.cost} 糧草，${def.effect}。`;
      ui.upgradeBtn.disabled = true;
      ui.upgradeBtn.textContent = "升級";
      ui.sellBtn.disabled = true;
    }
    renderTowerButtons();
  }

  function showBanner(text, persist = false) {
    ui.banner.textContent = text;
    ui.banner.classList.remove("hidden");
    if (!persist) {
      window.clearTimeout(showBanner.timer);
      showBanner.timer = window.setTimeout(() => ui.banner.classList.add("hidden"), 1500);
    }
  }

  function buildTower(cell) {
    const def = towers[state.selectedBuild];
    if (!canBuild(cell)) {
      state.shake = 0.18;
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
      cooldown: 0
    });
    state.selectedTower = state.towers[state.towers.length - 1];
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
    ui.banner.classList.add("hidden");
    showBanner(`第 ${state.waveIndex + 1} 波敵軍來襲`);
    updateUi();
  }

  function restart() {
    Object.assign(state, {
      energy: 180,
      lives: 20,
      waveIndex: 0,
      score: 0,
      selectedBuild: "pulse",
      selectedTower: null,
      hoverCell: null,
      towers: [],
      enemies: [],
      shots: [],
      sparks: [],
      spawnTimer: 0,
      spawned: 0,
      waveActive: false,
      paused: false,
      speed: 1,
      ended: false,
      last: performance.now(),
      scoreSubmittedFor: "",
      shake: 0
    });
    ui.banner.classList.add("hidden");
    updateUi();
  }

  function damageEnemy(enemy, amount) {
    enemy.hp -= amount;
    state.sparks.push({
      x: enemy.x,
      y: enemy.y,
      r: 4,
      life: 0.28,
      color: enemy.type === "elite" ? "#ffd166" : "#56d8ff"
    });
    if (enemy.hp <= 0 && enemy.alive) {
      enemy.alive = false;
      state.energy += enemy.reward;
      state.score += enemy.reward * 12 + (state.waveIndex + 1) * 4;
      state.sparks.push({ x: enemy.x, y: enemy.y, r: 18, life: 0.36, color: "#66f2c2" });
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
    const def = towers[tower.type];
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
      return;
    }
    damageEnemy(target, stats.damage);
    if (tower.type === "frost") {
      target.slow = stats.slow;
      target.slowTimer = stats.slowTime;
    }
    state.shots.push({ x1: tower.x, y1: tower.y, x2: target.x, y2: target.y, life: 0.2, color: def.color, width: tower.type === "frost" ? 5 : 3 });
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
      if (dist <= move) {
        enemy.x = target.x;
        enemy.y = target.y;
        enemy.node += 1;
        if (enemy.node >= path.length - 1) {
          enemy.alive = false;
          enemy.leaked = true;
          state.lives -= enemy.type === "elite" ? 2 : 1;
          state.shake = 0.24;
          state.sparks.push({ x: enemy.x, y: enemy.y, r: 22, life: 0.35, color: "#ff657d" });
        }
      } else if (dist > 0) {
        enemy.x += (dx / dist) * move;
        enemy.y += (dy / dist) * move;
      }
    }

    for (const tower of state.towers) {
      tower.cooldown -= dt;
      if (tower.cooldown <= 0) {
        const stats = towerStats(tower);
        const target = findTarget(tower, stats);
        if (target) {
          fireTower(tower, target, stats);
          tower.cooldown = stats.cooldown;
        }
      }
    }

    state.enemies = state.enemies.filter(e => e.alive);
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
      state.energy += 28 + state.waveIndex * 4;
      if (state.waveIndex >= wavePlan.length) {
        endGame(true);
      } else {
        showBanner("敵軍退散，糧草已補給。");
      }
      updateUi();
    }
  }

  function endGame(win) {
    state.ended = true;
    state.waveActive = false;
    const bonus = win ? state.lives * 35 + state.energy * 2 : 0;
    state.score += bonus;
    state.best = Math.max(state.best, state.score);
    localStorage.setItem("beexTdBest", String(state.best));
    saveLocalScore();
    showBanner(win ? `守城大捷！戰功 ${state.score}` : `城門失守。戰功 ${state.score}`, true);
    updateUi();
  }

  function drawGrid() {
    ctx.save();
    ctx.translate(state.shake > 0 ? Math.sin(performance.now() / 22) * 3 : 0, 0);
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#32624a");
    bg.addColorStop(0.52, "#536a34");
    bg.addColorStop(1, "#7b4d22");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = "rgba(255, 241, 186, 0.08)";
    for (let i = 0; i < 18; i++) {
      const x = (i * 127) % W;
      const y = 66 + ((i * 83) % (H - 120));
      ctx.beginPath();
      ctx.ellipse(x, y, 46 + (i % 3) * 18, 16 + (i % 2) * 8, (i % 5) * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const key = `${x},${y}`;
        const px = offset.x + x * tile;
        const py = offset.y + y * tile;
        if (pathSet.has(key)) continue;
        if (blockedSet.has(key)) {
          ctx.fillStyle = "rgba(63, 43, 24, 0.36)";
          ctx.beginPath();
          ctx.moveTo(px + 10, py + 34);
          ctx.lineTo(px + 22, py + 10);
          ctx.lineTo(px + 36, py + 34);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = "rgba(111, 149, 77, 0.72)";
          ctx.fillRect(px + 7, py + 30, 30, 6);
        } else {
          ctx.fillStyle = "rgba(255,255,255,0.025)";
          ctx.fillRect(px + 4, py + 4, tile - 8, tile - 8);
        }
      }
    }

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "rgba(73, 38, 16, 0.48)";
    ctx.lineWidth = 40;
    ctx.beginPath();
    path.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();
    ctx.strokeStyle = "#c99250";
    ctx.lineWidth = 30;
    ctx.stroke();
    ctx.setLineDash([10, 16]);
    ctx.strokeStyle = "rgba(255, 238, 186, 0.25)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "#7e2b1a";
    ctx.strokeStyle = "#2b1208";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(path[0].x - 62, path[0].y - 32, 58, 54, 8);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#ffd878";
    ctx.beginPath();
    ctx.moveTo(path[0].x - 49, path[0].y - 40);
    ctx.lineTo(path[0].x - 18, path[0].y - 24);
    ctx.lineTo(path[0].x - 49, path[0].y - 12);
    ctx.closePath();
    ctx.fill();

    const gateX = path[path.length - 1].x + 8;
    const gateY = path[path.length - 1].y - 34;
    ctx.fillStyle = "#9b5528";
    ctx.strokeStyle = "#2d1409";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(gateX, gateY, 70, 62, 8);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#ca3c25";
    ctx.beginPath();
    ctx.moveTo(gateX - 6, gateY);
    ctx.lineTo(gateX + 35, gateY - 28);
    ctx.lineTo(gateX + 76, gateY);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#3a1a0d";
    ctx.fillRect(gateX + 24, gateY + 30, 22, 28);
    ctx.restore();
  }

  function drawHover() {
    const cell = state.hoverCell;
    if (!cell || state.ended) return;
    const px = offset.x + cell.cx * tile;
    const py = offset.y + cell.cy * tile;
    const ok = canBuild(cell);
    ctx.save();
    ctx.fillStyle = ok ? "rgba(102, 242, 194, 0.16)" : "rgba(255, 101, 125, 0.16)";
    ctx.strokeStyle = ok ? "rgba(102, 242, 194, 0.86)" : "rgba(255, 101, 125, 0.86)";
    ctx.lineWidth = 2;
    ctx.fillRect(px + 3, py + 3, tile - 6, tile - 6);
    ctx.strokeRect(px + 3, py + 3, tile - 6, tile - 6);
    const def = towers[state.selectedBuild];
    ctx.beginPath();
    ctx.arc(px + tile / 2, py + tile / 2, def.range, 0, Math.PI * 2);
    ctx.fillStyle = ok ? "rgba(86, 216, 255, 0.045)" : "rgba(255, 101, 125, 0.035)";
    ctx.fill();
    ctx.restore();
  }

  function drawTowers() {
    for (const tower of state.towers) {
      const def = towers[tower.type];
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
      ctx.ellipse(0, 13, 18, 8, 0, 0, Math.PI * 2);
      ctx.fill();
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
      const img = icons[def.icon];
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, -19, -27, 38, 38);
      } else {
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
        ctx.arc(-12 + i * 8, -32, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  function drawEnemies() {
    for (const enemy of state.enemies) {
      const hp = Math.max(0, enemy.hp / enemy.maxHp);
      ctx.save();
      ctx.translate(enemy.x, enemy.y);
      ctx.fillStyle = "rgba(0,0,0,0.34)";
      ctx.beginPath();
      ctx.ellipse(0, enemy.radius + 5, enemy.radius, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      const color = enemy.type === "elite" ? "#d6a24a" : enemy.type === "runner" ? "#c85a3a" : "#405a37";
      ctx.fillStyle = enemy.slow < 1 ? "#9fe8ff" : color;
      ctx.strokeStyle = "rgba(39,17,8,0.88)";
      ctx.lineWidth = 3;
      if (enemy.type === "runner") {
        ctx.beginPath();
        ctx.ellipse(0, 3, enemy.radius + 8, enemy.radius - 1, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#f0d19a";
        ctx.beginPath();
        ctx.arc(-6, -7, 6, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.roundRect(-enemy.radius, -enemy.radius + 3, enemy.radius * 2, enemy.radius * 1.8, 5);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = enemy.type === "elite" ? "#7c2d1a" : "#d8c08a";
        ctx.beginPath();
        ctx.arc(0, -enemy.radius + 1, enemy.radius * 0.62, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      ctx.fillStyle = enemy.type === "elite" ? "#ffd878" : "#251007";
      ctx.beginPath();
      ctx.moveTo(-enemy.radius - 2, -enemy.radius + 1);
      ctx.lineTo(0, -enemy.radius - 10);
      ctx.lineTo(enemy.radius + 2, -enemy.radius + 1);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "rgba(39,17,8,0.92)";
      ctx.fillRect(-18, -enemy.radius - 13, 36, 5);
      ctx.fillStyle = hp > 0.5 ? "#70d4a4" : hp > 0.24 ? "#ffd878" : "#e55236";
      ctx.fillRect(-18, -enemy.radius - 13, 36 * hp, 5);
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
    ctx.save();
    ctx.fillStyle = "rgba(255,243,216,0.86)";
    ctx.font = "900 14px system-ui";
    ctx.textAlign = "left";
    ctx.fillText("敵營", 12, 26);
    ctx.textAlign = "right";
    ctx.fillText("BeeX 城門", W - 12, 26);
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
    drawHover();
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
    const point = pointerToWorld(event);
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

  ui.upgradeBtn.addEventListener("click", () => {
    const t = state.selectedTower;
    if (!t || t.level >= 4) return;
    const cost = upgradeCost(t);
    if (state.energy < cost) return;
    state.energy -= cost;
    t.level += 1;
    state.sparks.push({ x: t.x, y: t.y, r: 18, life: 0.4, color: towers[t.type].color });
    updateUi();
  });

  ui.sellBtn.addEventListener("click", () => {
    const t = state.selectedTower;
    if (!t) return;
    state.energy += sellValue(t);
    state.towers = state.towers.filter(item => item !== t);
    state.selectedTower = null;
    updateUi();
  });

  ui.startBtn.addEventListener("click", startWave);
  ui.pauseBtn.addEventListener("click", () => {
    if (state.ended) return;
    state.paused = !state.paused;
    showBanner(state.paused ? "已暫停" : "繼續迎敵");
    updateUi();
  });
  ui.speedBtn.addEventListener("click", () => {
    state.speed = state.speed === 1 ? 2 : state.speed === 2 ? 3 : 1;
    updateUi();
  });
  ui.restartBtn.addEventListener("click", restart);
  ui.submitScoreBtn.addEventListener("click", submitScore);
  ui.refreshBoardBtn.addEventListener("click", loadRemoteLeaderboard);
  ui.playerName.addEventListener("input", () => {
    state.playerName = cleanPlayerName(ui.playerName.value);
    localStorage.setItem("beexTdPlayer", state.playerName);
    updateUi();
  });

  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("keydown", event => {
    if (event.target && ["INPUT", "TEXTAREA"].includes(event.target.tagName)) return;
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
  showBanner("布防守城，護住 BeeX 城門");
  state.last = performance.now();
  requestAnimationFrame(loop);
})();

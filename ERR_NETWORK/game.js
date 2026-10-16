"use strict";
(() => {
  const $ = (id) => document.getElementById(id);
  const canvas = $("game");
  const ctx = canvas.getContext("2d", { alpha: false });
  const W = 1200, H = 360, GROUND = 286;
  canvas.width = W; canvas.height = H;
  ctx.imageSmoothingEnabled = false;

  const runner = $("runner"), secretToggle = $("secretToggle");
  const overlay = $("overlay"), action = $("action");
  const overlayTitle = $("overlayTitle"), overlayText = $("overlayText"), eyebrow = $("eyebrow");
  const scoreLabel = $("scoreLabel"), bestLabel = $("best");
  const modeSelect = $("difficulty"), duckTouch = $("duckTouch");
  const achievementToggle = $("achievementsToggle"), achievementPanel = $("achievementsPanel");
  const overlayAchievements = $("overlayBadges");

  const STORE_BEST = "err-network-best-v4";
  const STORE_BADGES = "err-network-achievements-v4";
  const BADGES = [
    ["hatch", "First Hatch", "Reach 500"],
    ["grown", "Grown", "Reach 1000"],
    ["phoenix", "Phoenix", "Reach 2000"],
    ["flight", "Skyborn", "Complete your first flight"],
    ["collector", "Treasure Hunter", "Collect 12 treasures"],
    ["gold", "Golden Egg", "Collect a golden egg"],
    ["flow", "Perfect Flow", "Clear 12 obstacles in one streak"]
  ];

  const modes = {
    relaxed:   { speed: 285, cap: 410, accel: 3.0, gap: 1.18, score: 1.00 },
    classic:   { speed: 315, cap: 500, accel: 4.5, gap: 1.00, score: 1.00 },
    challenge: { speed: 350, cap: 590, accel: 6.0, gap: 0.90, score: 1.20 }
  };

  let difficulty = modes.classic;
  let gameState = "ready";
  let last = 0, time = 0, score = 0, best = 0, speed = difficulty.speed;
  let distance = 0, nextSpawn = 680, groundOffset = 0;
  let evolution = 0, evolutionPulse = 0;
  let obstacles = [], treasures = [], powerups = [], particles = [];
  let streak = 0, collected = 0, golden = 0, bonus = 0, shield = 0, comboTimer = 0, jumps = 0, coyote = 0;
  let scene = 0, scenePulse = 0, flash = "", flashTime = 0, lastFlightMilestone = 0;
  let flight = null, invulnerable = 0, shake = 0, boss = null, eventTimer = 0, eventType = "", dashCooldown = 0, skillFlash = 0, skillName = "", wingCharge = 0, guardianPhase = 1;
  let badges = {};
  try { best = Number(localStorage.getItem(STORE_BEST) || 0); } catch (_) {}
  try { badges = JSON.parse(localStorage.getItem(STORE_BADGES) || "{}") || {}; } catch (_) {}
  bestLabel.textContent = fmt(best);

  const player = {
    x: 126, y: GROUND - 58, vy: 0, duck: false, grounded: true,
    flap: 0, blink: 0
  };

  const sprites = {};
  const spriteNames = [
    "egg","chick","jadebird","phoenix","cactus","crate","barrel","fence","ice","bat",
    "star","golden","cloud","tree","shrine","mountain","lantern","feather","flame"
  ];
  for (const name of spriteNames) {
    const img = new Image();
    img.decoding = "async";
    img.src = "./assets/sprites.svg#" + name;
    sprites[name] = img;
  }

  function fmt(n) { return String(Math.floor(n)).padStart(5, "0"); }
  function clamp(v,a,b) { return Math.max(a, Math.min(b,v)); }
  function rnd(a,b) { return a + Math.random() * (b-a); }
  function rect(x,y,w,h,c) { ctx.fillStyle=c; ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h)); }
  function lerp(a,b,t) { return a+(b-a)*t; }

  function drawSprite(name,x,y,w,h,alpha=1,flip=false) {
    const img = sprites[name];
    if (!img || !img.complete || !img.naturalWidth) return false;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.imageSmoothingEnabled = false;
    if (flip) { ctx.translate(x+w,y); ctx.scale(-1,1); ctx.drawImage(img,0,0,w,h); }
    else ctx.drawImage(img,Math.round(x),Math.round(y),Math.round(w),Math.round(h));
    ctx.restore();
    return true;
  }

  function unlock(id, label) {
    if (badges[id]) return;
    badges[id] = true;
    try { localStorage.setItem(STORE_BADGES, JSON.stringify(badges)); } catch (_) {}
    flash = "★ " + label;
    flashTime = 2.2;
    renderBadges();
  }

  function renderBadges() {
    achievementPanel.replaceChildren();
    for (const [id,label,detail] of BADGES) {
      const row = document.createElement("div");
      row.className = "achievement" + (badges[id] ? " unlocked" : "");
      row.innerHTML = '<span class="achievement-mark">' + (badges[id] ? "✦" : "◇") +
        '</span><span><b></b><small></small></span>';
      row.querySelector("b").textContent = label;
      row.querySelector("small").textContent = detail;
      achievementPanel.appendChild(row);
    }
    const count = Object.keys(badges).length;
    achievementToggle.textContent = "Achievements " + count + "/" + BADGES.length;
    overlayAchievements.textContent = "✦ " + count + "/" + BADGES.length + " achievements";
  }

  function reset() {
    gameState = "ready"; time=0; score=0; speed=difficulty.speed; distance=0; nextSpawn=680;
    obstacles=[]; treasures=[]; particles=[]; streak=0; collected=0; golden=0; bonus=0;
    evolution=0; evolutionPulse=0; scene=0; scenePulse=0; flash=""; flashTime=0;
    flight=null; invulnerable=0; shake=0; shield=0; boss=null; eventTimer=0; eventType=""; dashCooldown=0; skillFlash=0; skillName=""; wingCharge=0; guardianPhase=1; comboTimer=0; jumps=0; coyote=0; lastFlightMilestone=0; player.y=GROUND-58; player.vy=0;
    player.duck=false; player.grounded=true; player.flap=0; player.blink=0;
    groundOffset=0; scoreLabel.textContent=fmt(0); bestLabel.textContent=fmt(best);
  }

  function openGame() {
    runner.hidden = false;
    document.body.classList.add("playing");
    reset();
    showOverlay("ready");
    runner.scrollIntoView({block:"nearest", behavior:"smooth"});
  }

  function closeGame() {
    runner.hidden = true;
    document.body.classList.remove("playing");
    reset();
  }

  function showOverlay(type) {
    overlay.hidden = false;
    if (type === "over") {
      eyebrow.textContent = "CONNECTION INTERRUPTED";
      overlayTitle.textContent = "Game over";
      overlayText.textContent = "Score " + fmt(score) + " · Best " + fmt(best) + " · " + collected + " treasures";
      action.innerHTML = 'Run again <span>↻</span>';
      overlayAchievements.hidden = false;
    } else {
      eyebrow.textContent = "OFFLINE MODE";
      overlayTitle.textContent = "Ready to run?";
      overlayText.textContent = "Click the game or press Space to start";
      action.innerHTML = 'Start running <span>→</span>';
      overlayAchievements.hidden = true;
    }
  }

  function start() {
    difficulty = modes[modeSelect.value] || modes.classic;
    reset();
    gameState = "running";
    overlay.hidden = true;
    last = performance.now();
  }

  function jump() {
    if (gameState === "ready" || gameState === "over") { start(); return; }
    if (gameState === "flight") { player.vy = -720; player.flap = 1; burst(player.x+45,player.y+40,"#ffe09a",7); return; }
    if (player.grounded || coyote > 0) {
      player.duck = false;
      player.vy = -710;
      player.grounded = false;
      coyote = 0;
      jumps = 1;
      burst(player.x+30, GROUND-4, "#e8c77a", 5);
    } else if (evolution >= 1 && jumps < 2) {
      player.duck = false;
      player.vy = -620;
      jumps = 2;
      burst(player.x+30, player.y+playerBox().h, "#fff0a0", 8);
    }
  }

  function setDuck(v) {
    if (gameState === "running") player.duck = v;
  }

  function startFlight() {
    gameState = "flight";
    flight = { elapsed:0, duration:13, energy:100, collected:0, returnReady:false };
    invulnerable = 1.3;
    player.y = 170; player.vy = 0; player.grounded=false;
    obstacles=[]; treasures=[];
    nextSpawn=250;
    flash="SKYBOUND · TAP TO FLAP";
    flashTime=3;
    burst(player.x+40,player.y+30,"#ffd15a",24);
  }

  function endFlight() {
    if (!flight) return;
    unlock("flight","Skyborn");
    bonus += 180 + flight.collected * 35;
    gameState = "running";
    invulnerable = 1.5;
    player.y = GROUND-62; player.vy=0; player.grounded=true;
    flash="BACK TO THE CLOUD ROAD  +" + (180 + flight.collected*35);
    flashTime=2.5;
    burst(player.x+35,player.y+25,"#ffd36b",22);
    flight=null; lastFlightMilestone=Math.floor(score/2500); powerups=[]; nextSpawn=380;
  }

  function playerBox() {
    if (gameState === "flight") return {x:player.x+9,y:player.y+8,w:55,h:39};
    if (player.duck && player.grounded) return {x:player.x+8,y:GROUND-35,w:55,h:25};
    return {x:player.x+12,y:player.y+8,w:48,h:48};
  }

  function obstacleBox(o) {
    const pad = o.kind === "bat" ? 7 : 5;
    return {x:o.x+pad,y:o.y+4,w:Math.max(4,o.w-pad*2),h:Math.max(4,o.h-7)};
  }

  function spawnGroundObstacle() {
    const r=Math.random();
    let o;
    if (score>1200 && r<0.13) o={kind:"bat",x:W+40,y:GROUND-rnd(105,132),w:76,h:54};
    else if (score>650 && r<0.42) o={kind:["crate","barrel","fence","ice"][Math.floor(Math.random()*4)],x:W+40,y:0,w:0,h:0};
    else o={kind:"cactus",x:W+40,y:0,w:0,h:0};

    const dims={
      cactus:[34,52],crate:[48,48],barrel:[42,55],fence:[58,49],ice:[50,57]
    };
    if (o.kind !== "bat") {
      const d=dims[o.kind] || [34,52];
      o.w=d[0]; o.h=d[1]; o.y=GROUND-o.h;
    }
    obstacles.push(o);

    const airTime=(2*710)/2050;
    const safety=o.kind==="bat" ? 0.9 : 0.72;
    const minimum=speed*(airTime+safety)+o.w+playerBox().w+70;
    nextSpawn=rnd(Math.max(500,minimum)*difficulty.gap,Math.max(560,minimum)*difficulty.gap+190);
    distance=0;
  }

  function spawnFlightObstacle() {
    const top = Math.random()<.5;
    const kind = Math.random()<.42 ? "cloud" : (Math.random()<.5 ? "bat" : "ice");
    const o={kind,x:W+50,y:top?rnd(55,115):rnd(210,255),w:kind==="cloud"?90:kind==="bat"?74:54,h:kind==="cloud"?42:kind==="bat"?54:56};
    obstacles.push(o);
    nextSpawn=rnd(300,470)*(difficulty.gap+0.08);
    distance=0;
  }

  function spawnPowerup() {
    if (obstacles.some(o=>o.x>W-150)) return;
    powerups.push({x:W+38,y:GROUND-rnd(88,135),kind:Math.random()<.65?"shield":"feather",phase:rnd(0,Math.PI*2)});
  }

  function spawnTreasure() {
    if (obstacles.some(o=>o.x>W-100)) return;
    const goldChance = gameState==="flight" ? .16 : score>700 ? .11 : .05;
    treasures.push({
      x:W+28,
      y:gameState==="flight"?rnd(80,255):GROUND-rnd(70,118),
      gold:Math.random()<goldChance,
      phase:rnd(0,Math.PI*2)
    });
  }

  function spawnBoss(){
    if(boss || score<3500 || evolution<3) return;
    boss={x:W+170,y:74,w:145,h:150,hp:5,maxHp:5,phase:0,shot:1.2,pattern:0,patternTimer:2.2,active:true};
    flash="ANCIENT SKY GUARDIAN";flashTime=2.4;shake=.2;
    burst(W-90,130,"#ffb64b",35);
  }
  function updateBoss(dt){
    if(gameState!=="running" || !boss) return;
    boss.phase+=dt; boss.x=lerp(boss.x,W-245,Math.min(1,dt*1.8));
    boss.y=74+Math.sin(boss.phase*1.7)*22;
    boss.shot-=dt; boss.patternTimer-=dt;
    if(boss.patternTimer<=0){
      boss.pattern=(boss.pattern+1)%3;
      boss.patternTimer=3.1-Math.min(.8,(5-boss.hp)*.18);
      if(boss.pattern===0){
        boss.shot=.15;
        obstacles.push({kind:"bat",x:boss.x-12,y:boss.y+75,w:70,h:50,counted:true});
      } else if(boss.pattern===1){
        for(let i=0;i<2;i++) obstacles.push({kind:"bat",x:boss.x-12-i*35,y:GROUND-82-i*42,w:66,h:46,counted:true});
        flash="GUARDIAN SWARM";flashTime=.7;
      } else {
        treasures.push({x:boss.x-30,y:boss.y+15,gold:false,phase:time,taken:false});
        treasures.push({x:boss.x-70,y:boss.y-45,gold:false,phase:time+.7,taken:false});
        flash="DIVE FOR THE STARS";flashTime=.8;
      }
    }
    // jumping into the guardian's crest damages it; contact is never an instant unfair death.
    const p=playerBox(), hit={x:boss.x+28,y:boss.y+35,w:85,h:90};
    if(invulnerable<=0 && collision(p,hit) && player.vy<40){
      boss.hp--; invulnerable=.7; player.vy=-520; shake=.16;
      burst(boss.x+70,boss.y+55,"#ffe08b",18);
      if(boss.hp<=0){
        bonus+=650;unlock("phoenix","Phoenix");unlock("guardian","Sky Guardian");flash="GUARDIAN DEFEATED  +650";flashTime=3;
        burst(boss.x+70,boss.y+70,"#ffb13b",55);boss=null;nextSpawn=520;
      } else {flash="CREST HIT  "+boss.hp+"/"+5;flashTime=.8}
    }
  }

  function updateGround(dt) {
    speed=Math.min(difficulty.cap,difficulty.speed+time*difficulty.accel);
    distance+=speed*dt; groundOffset=(groundOffset+speed*dt)%64;
    if(distance>=nextSpawn) spawnGroundObstacle();
    if(Math.random()<dt*.32) spawnTreasure();
    if(Math.random()<dt*.055 && score>350) spawnPowerup();

    player.vy+=2050*dt; player.y+=player.vy*dt;
    coyote=Math.max(0,coyote-dt);
    if(player.y>=GROUND-58){
      player.y=GROUND-58;player.vy=0;
      if(!player.grounded) jumps=0;
      player.grounded=true;coyote=.11;
    } else {
      if(player.grounded) coyote=.11;
      player.grounded=false;
    }

    for(const o of obstacles) o.x-=speed*dt;
    obstacles=obstacles.filter(o=>o.x+o.w>-40);
    for(const t of treasures) t.x-=speed*dt;
    treasures=treasures.filter(t=>t.x>-50);
    for(const p of powerups) p.x-=speed*dt;
    powerups=powerups.filter(p=>p.x>-50);
    shield=Math.max(0,shield-dt);
    comboTimer=Math.max(0,comboTimer-dt);

    const p=playerBox();
    for(const o of obstacles){
      if(invulnerable<=0 && collision(p,obstacleBox(o))){
        if(shield>0){
          shield=0; invulnerable=1.15; shake=.45; streak=0;
          flash="SHIELD BREAK"; flashTime=1.1;
          burst(o.x+o.w/2,o.y+o.h/2,"#bce8ff",24);
          o.x=-999;
        } else {streak=0;finish();return}
      }
      if(o.x+o.w<player.x&&!o.counted){
        o.counted=true; streak++;
        if(streak>=12) unlock("flow","Perfect Flow");
        if(streak%4===0){bonus+=12+streak;flash="FLOW +" + (streak*3);flashTime=.8}
        comboTimer=2.4;
      }
    }
    for(const t of treasures){
      if(!t.taken && collision(p,{x:t.x-12,y:t.y-12,w:24,h:24})){
        t.taken=true; collected++;
        if(t.gold){golden++;bonus+=150;unlock("gold","Golden Egg");flash="GOLDEN EGG  +150"}
        else {bonus+=35;flash="TREASURE  +35"}
        flashTime=1.1; burst(t.x,t.y,t.gold?"#ffd15a":"#fff0a0",10);
        if(collected>=12) unlock("collector","Treasure Hunter");
      }
    }
    treasures=treasures.filter(t=>!t.taken);
    for(const pwr of powerups){
      if(!pwr.taken && collision(p,{x:pwr.x-13,y:pwr.y-13,w:26,h:26})){
        pwr.taken=true;
        if(pwr.kind==="shield"){
          shield=7; flash="AURA SHIELD · 7s"; flashTime=1.2;
          burst(pwr.x,pwr.y,"#bfeaff",18);
        } else {
          bonus+=70; flash="WIND FEATHER · +70"; flashTime=1.2;
          burst(pwr.x,pwr.y,"#fff0a0",18);
        }
      }
    }
    powerups=powerups.filter(p=>!p.taken);

    const oldScene=Math.floor(score/500)%5;
    if(oldScene!==scene){scene=oldScene;scenePulse=1.8}
    if(score>=500 && !badges.hatch) unlock("hatch","First Hatch");
    if(score>=1000 && !badges.grown) unlock("grown","Grown");
    if(score>=2000 && !badges.phoenix) unlock("phoenix","Phoenix");
    const next=score>=2000?3:score>=1000?2:score>=500?1:0;
    if(next!==evolution){
      evolution=next; evolutionPulse=2.4;
      const msg=["","HATCHED · CLOUD CHICK","JADE PLUME AWAKENS","PHOENIX AWAKENS"][evolution];
      flash=msg;flashTime=2.5;burst(player.x+34,player.y+28,evolution===3?"#ff9e39":"#ffe28a",32);
    }
    // Flight is a true second game mode, not a cosmetic jump.
    const flightMilestone=Math.floor(score/2500); if(evolution===3 && score>=2500 && !flight && !boss && time>8 && flightMilestone>lastFlightMilestone) startFlight();
    if(evolution===3 && score>=3500 && !flight && !boss && time>16) spawnBoss();
    // Phoenix skill: every 12 collected treasures charges a short, forgiving dash.
    wingCharge=Math.min(100,wingCharge+dt*(streak>=3?2.4:1));
    if(evolution===3 && wingCharge>=100 && dashCooldown<=0 && keys.shift){
      wingCharge=0;dashCooldown=5;invulnerable=1.0;skillFlash=.9;skillName="PHOENIX DASH";
      player.vy=-390;bonus+=45;burst(player.x+30,player.y+28,"#ffd36a",30);
    }
  }

  function updateFlight(dt) {
    if(!flight) return;
    flight.elapsed+=dt;
    speed=Math.min(680, speed+30*dt);
    distance+=speed*dt;
    groundOffset=(groundOffset+speed*dt)%64;
    if(distance>=nextSpawn) spawnFlightObstacle();
    if(Math.random()<dt*.42) spawnTreasure();
    if(Math.random()<dt*.045) spawnPowerup();

    player.vy+=1320*dt; player.y+=player.vy*dt;
    player.y=clamp(player.y,34,H-82);
    player.grounded=false;
    for(const o of obstacles) o.x-=speed*dt;
    obstacles=obstacles.filter(o=>o.x+o.w>-60);
    for(const t of treasures) t.x-=speed*dt;
    treasures=treasures.filter(t=>t.x>-60);
    for(const pwr of powerups) pwr.x-=speed*dt;
    powerups=powerups.filter(pwr=>pwr.x>-60);

    const p=playerBox();
    for(const o of obstacles){
      if(o.kind==="cloud") continue; // clouds are scenery in flight, not hazards
      if(invulnerable<=0 && collision(p,obstacleBox(o))){streak=0;finish();return}
    }
    for(const t of treasures){
      if(!t.taken && collision(p,{x:t.x-13,y:t.y-13,w:26,h:26})){
        t.taken=true; collected++; flight.collected++;
        if(t.gold){golden++;bonus+=180;unlock("gold","Golden Egg");flash="SKY TREASURE  +180"}
        else {bonus+=45;flash="CLOUD GEM  +45"}
        flashTime=.9; burst(t.x,t.y,t.gold?"#ffe06b":"#c7f3ff",12);
      }
    }
    treasures=treasures.filter(t=>!t.taken);
    for(const pwr of powerups){
      if(!pwr.taken && collision(p,{x:pwr.x-13,y:pwr.y-13,w:26,h:26})){
        pwr.taken=true; flight.energy=Math.min(100,flight.energy+12);
        bonus+=55; flash="SKY FEATHER · +55"; flashTime=.8;
        burst(pwr.x,pwr.y,"#d5f6ff",14);
      }
    }
    powerups=powerups.filter(pwr=>!pwr.taken);
    if(flight.elapsed>=flight.duration) endFlight();
  }

  function collision(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y}

  function update(dt) {
    if(gameState!=="running" && gameState!=="flight") return;
    time+=dt; invulnerable=Math.max(0,invulnerable-dt);
    evolutionPulse=Math.max(0,evolutionPulse-dt);
    scenePulse=Math.max(0,scenePulse-dt);
    flashTime=Math.max(0,flashTime-dt);
    shake=Math.max(0,shake-dt);
    if(gameState==="running") updateGround(dt); else updateFlight(dt);
    score=Math.floor(time*15*difficulty.score)+bonus+(gameState==="flight"?Math.floor(flight.elapsed*5):0)+(streak>=4?Math.floor(streak*.35):0);
    scoreLabel.textContent=fmt(score);
  }

  function burst(x,y,color,n){
    for(let i=0;i<n;i++) particles.push({x,y,vx:rnd(-90,90),vy:rnd(-150,35),life:rnd(.35,.9),max:.9,color,size:rnd(2,5)});
  }

  function updateParticles(dt){
    for(const p of particles){p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=300*dt}
    particles=particles.filter(p=>p.life>0);
  }

  function drawSky(){
    const skies=[
      ["#f8fbff","#eef3f5"],["#fff3e5","#f7dfc8"],["#e9e9f7","#d5d9ee"],
      ["#172a47","#33486a"],["#dff5f3","#b8d7d4"]
    ];
    const [a,b]=skies[scene];
    const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,a);g.addColorStop(1,b);
    ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    if(scene===3||scene===4){
      ctx.globalAlpha=.35;
      for(let i=0;i<45;i++){const x=(i*97+time*12)%W,y=(i*47)%210;rect(x,y,2,2,"#fff3bd")}
      ctx.globalAlpha=1;
    }
  }

  function drawClouds(){
    for(let i=-1;i<6;i++){
      const x=((i*245-(time*speed*.055))%1320)+120;
      const y=34+(i%3)*31;
      drawSprite("cloud",x,y,108,60,.72);
    }
  }

  function drawWorld(){
    drawSky(); drawClouds();
    const farShift=(time*speed*.018)%420;
    for(let i=-1;i<4;i++){
      const x=i*420-farShift;
      drawSprite("mountain",x,116,430,210,.28);
      if(scene>=1) drawSprite("shrine",x+220,142,150,128,.25);
    }
    const midShift=(time*speed*.055)%250;
    for(let i=-1;i<7;i++){
      const x=i*250-midShift;
      drawSprite(scene===2||scene===3?"lantern":"tree",x+30,GROUND-112,88,112,.78);
      if(scene===4) drawSprite("ice",x+158,GROUND-45,40,44,.62);
      else drawSprite("tree",x+152,GROUND-78,62,88,.58);
    }
    // foreground grass and stone details, drawn procedurally to avoid any atlas cropping.
    const groundColor=scene===3?"#273744":scene===4?"#d7ecea":"#f4f0e7";
    rect(0,GROUND,W,H-GROUND,groundColor);
    rect(0,GROUND-22,W,22,scene===3?"rgba(22,37,55,.22)":"rgba(255,255,255,.22)");
    rect(0,GROUND,W,4,scene===3?"#e1bd70":"#7c858b");
    for(let x=-groundOffset;x<W;x+=64){
      rect(x,GROUND+20,25,3,scene===3?"#5c6d77":"#c8cdd1");
      rect(x+35,GROUND+38,12,3,scene===3?"#667984":"#d1d5d8");
      rect(x+7,GROUND+7,3,5,scene===3?"#b49a6b":"#a7b79e");
    }
    if(scene!==3){
      for(let x=20-groundOffset;x<W;x+=108){
        rect(x,GROUND-5,3,5,"#79936f");rect(x+4,GROUND-8,3,8,"#9eb58e");
      }
    }
  }

  function drawObstacle(o){
    if(o.kind==="cactus") drawSprite("cactus",o.x,o.y,o.w,o.h);
    else if(o.kind==="crate") drawSprite("crate",o.x,o.y,o.w,o.h);
    else if(o.kind==="barrel") drawSprite("barrel",o.x,o.y,o.w,o.h);
    else if(o.kind==="fence") drawSprite("fence",o.x,o.y,o.w,o.h);
    else if(o.kind==="ice") drawSprite("ice",o.x,o.y,o.w,o.h);
    else if(o.kind==="bat"){
      const bob=Math.sin(time*9+o.x*.03)*8;
      drawSprite("bat",o.x,o.y+bob,o.w,o.h,1,o.x<player.x);
    } else if(o.kind==="cloud"){
      drawSprite("cloud",o.x,o.y,o.w,o.h,.72);
    }
  }

  function drawTreasure(t){
    const bob=Math.sin(time*5+t.phase)*5;
    if(t.gold) drawSprite("golden",t.x-22,t.y-30+bob,44,52);
    else drawSprite("star",t.x-19,t.y-19+bob,38,38);
  }

  function drawPowerup(pwr){
    const bob=Math.sin(time*5.5+pwr.phase)*5;
    ctx.save();
    ctx.globalAlpha=.95;
    if(pwr.kind==="shield"){
      ctx.strokeStyle="#8fd8ff";ctx.lineWidth=3;
      ctx.beginPath();ctx.arc(pwr.x,pwr.y+bob,15,0,Math.PI*2);ctx.stroke();
      drawSprite("star",pwr.x-10,pwr.y-10+bob,20,20,.9);
    } else {
      drawSprite("feather",pwr.x-18,pwr.y-28+bob,36,48,.95);
    }
    ctx.restore();
  }

  function drawBoss(){
    if(!boss) return;
    const bob=Math.sin(boss.phase*2.2)*4;
    drawSprite("phoenix",boss.x,boss.y+bob,boss.w,boss.h,1,true);
    ctx.save();
    ctx.fillStyle="rgba(30,34,42,.45)";ctx.fillRect(boss.x,boss.y-13,boss.w,6);
    ctx.fillStyle="#e9a43e";ctx.fillRect(boss.x,boss.y-13,boss.w*(boss.hp/boss.maxHp),6);
    ctx.font="700 10px Arial";ctx.fillStyle="#6d5540";ctx.textAlign="center";
    ctx.fillText("SKY GUARDIAN",boss.x+boss.w/2,boss.y-20);
    ctx.restore();
  }

  function drawPlayer(){
    const names=["egg","chick","jadebird","phoenix"];
    const name=names[evolution];
    let w=[52,70,86,112][evolution], h=[64,70,82,102][evolution];
    if(gameState==="flight") {
      w+=14;h+=8;
      const tilt=clamp(player.vy/800,-.35,.35);
      ctx.save();ctx.translate(player.x+w*.45,player.y+h*.45);ctx.rotate(tilt);
      drawSprite(name,-w*.45,-h*.45,w,h,1,evolution===3&&Math.sin(time*8)<-.4);
      ctx.restore();
      drawSprite("flame",player.x-4,player.y+h-4,30,38,.65);
      return;
    }
    if(player.duck&&player.grounded){w*=1.12;h*=.66}
    const bob=player.grounded?Math.sin(time*13)*1.4:0;
    if(player.duck&&player.grounded) player.y=GROUND-h;
    if(evolution>=2 && player.grounded) {
      const wingPulse=0.92+Math.sin(time*12)*.08;
      drawSprite(name,player.x,player.y+bob,w*wingPulse,h);
    } else drawSprite(name,player.x,player.y+bob,w,h);
    if(invulnerable>0 && Math.floor(time*14)%2===0){
      ctx.save();ctx.globalAlpha=.24;ctx.strokeStyle="#fff2a1";ctx.lineWidth=5;
      ctx.beginPath();ctx.arc(player.x+w/2,player.y+h/2,Math.max(w,h)*.65,0,Math.PI*2);ctx.stroke();ctx.restore();
    }
  }

  function drawParticles(){
    for(const p of particles){ctx.globalAlpha=clamp(p.life/p.max,0,1);rect(p.x,p.y,p.size,p.size,p.color)}
    ctx.globalAlpha=1;
  }

  function drawHUD(){
    if(gameState==="ready") return;
    ctx.save();
    ctx.textBaseline="top";
    ctx.font="700 14px ui-monospace,Consolas,monospace";
    ctx.fillStyle=scene>=3?"#fff":"#424a52";
    ctx.fillText("SCORE  "+fmt(score),22,18);
    ctx.font="600 11px ui-monospace,Consolas,monospace";
    ctx.fillStyle=scene>=3?"#d9e5ee":"#77818b";
    ctx.fillText("BEST  "+fmt(best),22,39);

    if(skillFlash>0){skillFlash=Math.max(0,skillFlash-dt)}
    if(gameState==="running"){
      const labels=["EGG","CHICK","JADE PLUME","PHOENIX"];
      ctx.fillText(labels[evolution],W-22,18);ctx.textAlign="right";
      if(evolution===3){
        ctx.fillStyle="#d08b36";ctx.fillText(boss?"GUARDIAN":"SKYBOUND 2500",W-22,39);
    if(evolution===3){
      ctx.textAlign="left";ctx.font="700 10px Arial";ctx.fillStyle="#6f7882";
      ctx.fillText("WING CHARGE",22,39);
      ctx.strokeStyle="rgba(80,90,105,.25)";ctx.strokeRect(22,45,90,5);
      ctx.fillStyle="#e3a64a";ctx.fillRect(22,45,.9*wingCharge,5);
    }
    if(skillFlash>0){
      ctx.textAlign="center";ctx.font="800 15px Arial";ctx.fillStyle="#e7a33b";
      ctx.fillText(skillName,W/2,58);
    }
      } else {
        const target=[500,1000,2000][evolution]||500;
        const prev=[0,500,1000,2000][evolution];
        const p=clamp((score-prev)/(target-prev),0,1);
        ctx.fillStyle="#cfd5da";ctx.fillRect(W-164,42,142,5);
        ctx.fillStyle="#e6ae45";ctx.fillRect(W-164,42,142*p,5);
      }
    } else {
      ctx.textAlign="right";ctx.fillStyle="#fff2b2";
      ctx.fillText("FLIGHT  "+Math.ceil(flight.duration-flight.elapsed)+"s",W-22,18);
      ctx.fillStyle="rgba(255,255,255,.28)";ctx.fillRect(W-164,40,142,5);
      ctx.fillStyle="#ffd35a";ctx.fillRect(W-164,40,142*clamp(1-flight.elapsed/flight.duration,0,1),5);
    }
    if(streak>=3){
      ctx.textAlign="center";ctx.font="700 13px Arial";ctx.fillStyle=scene>=3?"#ffe7a0":"#d08a34";
      ctx.fillText("FLOW ×"+streak,W/2,20);
      if(comboTimer>0){ctx.font="600 10px Arial";ctx.fillText("keep the rhythm",W/2,37)}
    }
    if(shield>0 && gameState==="running"){
      ctx.textAlign="left";ctx.font="700 10px Arial";ctx.fillStyle="#78bfe7";
      ctx.fillText("AURA "+Math.ceil(shield)+"s",22,57);
    }
    ctx.restore();
  }

  function drawFlash(){
    if(flashTime<=0)return;
    ctx.save();ctx.globalAlpha=clamp(flashTime,0,1);
    ctx.textAlign="center";ctx.font="700 17px Arial";ctx.fillStyle=scene>=3?"#ffe9a3":"#a26d2a";
    ctx.fillText(flash,W/2,72);ctx.restore();
  }

  function render(){
    ctx.save();
    if(shake>0) ctx.translate(rnd(-3,3),rnd(-2,2));
    drawWorld();
    for(const t of treasures) drawTreasure(t);
    for(const pwr of powerups) drawPowerup(pwr);
    for(const o of obstacles) drawObstacle(o);
    if(boss) drawBoss();
    drawPlayer();drawParticles();drawHUD();drawFlash();
    if(evolutionPulse>0){
      ctx.save();ctx.globalAlpha=Math.min(.55,evolutionPulse*.35);
      ctx.fillStyle=evolution===3?"#ffb33d":"#ffe7a0";ctx.fillRect(0,0,W,H);ctx.restore();
    }
    ctx.restore();
  }

  function finish(){
    if(gameState==="over") return;
    gameState="over"; overlay.hidden=false;
    if(score>best){best=score;try{localStorage.setItem(STORE_BEST,String(best))}catch(_){}}
    bestLabel.textContent=fmt(best); showOverlay("over");
  }

  function loop(now){
    let dt=last?Math.min(.05,(now-last)/1000):0;
    last=now;
    if(dt>0){update(dt);updateParticles(dt)}
    render();
    requestAnimationFrame(loop);
  }

  // The secret entrance is intentionally click-only: no keyboard reveal shortcut.
  secretToggle.addEventListener("click",openGame);
  canvas.addEventListener("pointerdown",(e)=>{e.preventDefault();jump()});
  action.addEventListener("click",(e)=>{e.stopPropagation();start()});
  overlay.addEventListener("pointerdown",(e)=>{if(e.target===overlay)jump()});
  modeSelect.addEventListener("change",()=>{
    difficulty=modes[modeSelect.value]||modes.classic;
    if(gameState==="running"||gameState==="flight"){flash="MODE CHANGES NEXT RUN";flashTime=1.6}
  });
  function handleGameKeyDown(e){
    if(!document.body.classList.contains("playing")) return;
    const isRestartKey=e.code==="Space"||e.code==="Enter"||e.code==="ArrowUp";
    if(isRestartKey){
      e.preventDefault();
      e.stopPropagation();
      if(!e.repeat) jump();
      return;
    }
    if(e.code==="ArrowDown"){e.preventDefault();setDuck(true);return}
    if(e.code==="Escape"){e.preventDefault();closeGame()}
  }
  function handleGameKeyUp(e){
    if(e.code==="ArrowDown") setDuck(false);
  }
  // Capture phase makes restart reliable even when the overlay/canvas has focus.
  window.addEventListener("keydown",handleGameKeyDown,true);
  window.addEventListener("keyup",handleGameKeyUp,true);
  duckTouch.addEventListener("pointerdown",(e)=>{e.preventDefault();duckTouch.setPointerCapture(e.pointerId);setDuck(true)});
  ["pointerup","pointercancel","lostpointercapture"].forEach(ev=>duckTouch.addEventListener(ev,()=>setDuck(false)));
  achievementToggle.addEventListener("click",()=>{
    achievementPanel.hidden=!achievementPanel.hidden;
    achievementToggle.setAttribute("aria-expanded",String(!achievementPanel.hidden));
    renderBadges();
  });
  overlayAchievements.addEventListener("click",()=>{
    achievementPanel.hidden=false;achievementToggle.setAttribute("aria-expanded","true");renderBadges();
    achievementPanel.scrollIntoView({block:"nearest",behavior:"smooth"});
  });
  $("reload").addEventListener("click",()=>location.reload());

  renderBadges();
  reset();
  showOverlay("ready");
  requestAnimationFrame(loop);
})();
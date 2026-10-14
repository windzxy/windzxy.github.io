"use strict";
(()=>{const canvas=document.getElementById("game");let ctx=canvas.getContext("2d");const overlay=document.getElementById("overlay"),action=document.getElementById("action"),eyebrow=document.getElementById("eyebrow"),heading=document.getElementById("overlayTitle"),message=document.getElementById("overlayText"),scoreLabel=document.getElementById("scoreLabel"),bestLabel=document.getElementById("best");const runner=document.getElementById("runner");const badgePanel=document.getElementById("achievementsPanel"),badgeToggle=document.getElementById("achievementsToggle");const badgeDefs=[["hatched","First Hatch","Reach 500 points"],["grown","Full Grown","Reach 1000 points"],["dodger","Dodger","Dodge 10 obstacles"],["collector","Treasure Hunter","Collect 10 items"],["gold","Golden Egg","Find the rare egg"],["phoenix","Phoenix","Reach 2000 points"]];let revealed=false;function toggleGame(forceHide=false){revealed=forceHide?false:!revealed;runner.hidden=!revealed;document.body.classList.toggle("playing",revealed);document.title=revealed?"网页无法访问":"网页无法访问";if(!revealed){reset();show("ready");}else{reset();show("ready");runner.scrollIntoView({block:"nearest",behavior:"smooth"});}}const difficultyInput=document.getElementById("difficulty");const difficultyModes={relaxed:{speed:250,cap:375,accel:3,gap:1.35,reward:1},classic:{speed:295,cap:490,accel:5,gap:1,reward:1},challenge:{speed:350,cap:580,accel:6,gap:.95,reward:1.25}};let difficulty=difficultyModes.classic;difficultyInput.addEventListener("change",()=>{difficulty=difficultyModes[difficultyInput.value]||difficultyModes.classic;if(mode==="running"){flashNote="MODE CHANGES NEXT RUN";flashFor=1.6}else{reset();show("ready")}});const W=960,H=280,GROUND=224,DX=110,PW=42,PH=46,GRAVITY=1950,JUMP=-680;const key="err-network-best-v3";let best=0;try{best=+localStorage.getItem(key)||0}catch(_){}const fmt=n=>String(Math.floor(n)).padStart(5,"0");bestLabel.textContent=fmt(best);
let mode="ready",last=0,elapsed=0,score=0,speed=295,distance=0,nextGap=550,obstacles=[],clouds=[],groundShift=0,birdAllowed=false,evolution=0,evolveFlash=0,stars=[],starTimer=0,bonus=0,collected=0,streak=0,flashNote="",flashFor=0,goldenEggs=0,achievements={},scene=0,nextStarDelay=4.3,eventTimer=0,eventActive=0,eventUsed=false;try{achievements=JSON.parse(localStorage.getItem("err-network-achievements")||"{}")||{}}catch(_){}const hero={x:DX,y:GROUND-PH,vy:0,duck:false,grounded:true};const random=(a,b)=>a+Math.random()*(b-a);const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
function reset(){mode="ready";elapsed=0;score=0;speed=difficulty.speed;distance=0;nextGap=570;obstacles=[];groundShift=0;birdAllowed=false;evolution=0;evolveFlash=0;stars=[];starTimer=0;bonus=0;collected=0;streak=0;goldenEggs=0;scene=0;eventTimer=0;eventActive=0;eventUsed=false;nextStarDelay=random(3.5,5.5);flashNote="";flashFor=0;hero.y=GROUND-PH;hero.vy=0;hero.duck=false;hero.grounded=true;clouds=[{x:180,y:45,s:1},{x:490,y:75,s:.8},{x:820,y:40,s:1.1}];scoreLabel.textContent=fmt(0);bestLabel.textContent=fmt(best)}
function show(type){overlay.hidden=false;eyebrow.textContent=type==="over"?"CONNECTION INTERRUPTED":"OFFLINE MODE";heading.textContent=type==="over"?"Game over":"Ready to run?";message.textContent=type==="over"?"Score "+fmt(score)+" · Best "+fmt(best)+" · "+collected+" treasures ("+goldenEggs+" golden)":"Press Space or tap to start";document.getElementById("overlayBadges").hidden=type!=="over";document.getElementById("overlayBadges").textContent="🏆 "+Object.keys(achievements).length+"/"+badgeDefs.length+" Achievements";action.innerHTML=type==="over"?'Run again <span aria-hidden="true">↻</span>':'Start running <span aria-hidden="true">→</span>'}
function start(){difficulty=difficultyModes[difficultyInput.value]||difficultyModes.classic;reset();mode="running";overlay.hidden=true;last=performance.now()}
function jump(){if(mode!=="running"){start();return}if(hero.grounded){hero.duck=false;hero.vy=JUMP;hero.grounded=false}}
function finish(){if(mode!=="running")return;mode="over";if(score>best){best=score;try{localStorage.setItem(key,String(best))}catch(_){}}bestLabel.textContent=fmt(best);show("over")}
function collision(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y}
function playerBox(){const dh=hero.duck&&hero.grounded;return dh?{x:hero.x+6,y:GROUND-25,w:42,h:22}:{x:hero.x+10,y:hero.y+7,w:31,h:36}}
function obstacleBox(o){return{x:o.x+5,y:o.y+3,w:o.w-10,h:o.h-5}}
function renderBadges(){badgePanel.replaceChildren();for(const [id,label,detail] of badgeDefs){const row=document.createElement("div");row.className="achievement"+(achievements[id]?" unlocked":"");const mark=document.createElement("span");mark.textContent=achievements[id]?"★":"◇";const info=document.createElement("span");const name=document.createElement("b");name.textContent=label;const hint=document.createElement("small");hint.textContent=detail;info.append(name,hint);row.append(mark,info);badgePanel.append(row)}}document.getElementById("overlayBadges").addEventListener("click",()=>{badgePanel.hidden=false;badgeToggle.setAttribute("aria-expanded","true");renderBadges();badgePanel.scrollIntoView({block:"nearest",behavior:"smooth"})});badgeToggle.addEventListener("click",()=>{badgePanel.hidden=!badgePanel.hidden;badgeToggle.setAttribute("aria-expanded",String(!badgePanel.hidden));renderBadges()});function unlock(id,label){if(achievements[id])return;achievements[id]=true;renderBadges();try{localStorage.setItem("err-network-achievements",JSON.stringify(achievements))}catch(_){}flashNote="🏆 "+label;flashFor=2.4}function spawn(){const bird=birdAllowed&&Math.random()<.23;let o;if(bird){o={kind:"bird",x:W+30,y:GROUND-68,w:48,h:23}}else{const big=Math.random()<.33,crate=score>650&&Math.random()<.19;const themed=score>=400&&Math.random()<.32;if(themed){const kinds=["fence","barrel","bat","ice"];const sizes=[[36,29],[30,39],[42,22],[36,28]];const idx=scene;const [w,h]=sizes[idx];o={kind:kinds[idx],x:W+30,y:GROUND-(idx===2?72:h),w,h}}else{o=crate?{kind:"crate",x:W+30,y:GROUND-30,w:34,h:30}:{kind:big?"cactus2":"cactus",x:W+30,y:GROUND-(big?49:38),w:big?42:26,h:big?49:38}}}obstacles.push(o);
// Travel gap includes air-time and reaction buffer: gap grows with speed, not random per-frame clustering.
const air=2*Math.abs(JUMP)/GRAVITY;
const guaranteed=Math.max(440,speed*(air+0.72)+o.w+PW)*difficulty.gap;
nextGap=random(guaranteed+(o.kind==="crate"?45:0),guaranteed+180);distance=0}
function update(dt){if(mode!=="running")return;elapsed+=dt;score=Math.floor(elapsed*15*difficulty.reward)+bonus;flashFor=Math.max(0,flashFor-dt);if(score>=300){eventTimer+=dt;if(eventActive>0){eventActive=Math.max(0,eventActive-dt)}else if(eventTimer>42){eventTimer=0;eventActive=9;flashNote="GOLDEN RUSH!";flashFor=2.5}}const newScene=Math.floor(score/400)%4;if(newScene!==scene){scene=newScene;flashNote=["MEADOW","SUNSET","MOONLIGHT","FROST"][scene];flashFor=2;}if(score>=500)unlock("hatched","First Hatch");if(score>=1000)unlock("grown","Full Grown");if(score>=2000)unlock("phoenix","Phoenix Awakens");const nextEvolution=score>=2000?3:score>=1000?2:score>=500?1:0;if(nextEvolution!==evolution){evolution=nextEvolution;evolveFlash=2.2;flashNote=["","EGG HATCHED!","PHEASANT!","PHOENIX AWAKENS!"][evolution];flashFor=2.2;}evolveFlash=Math.max(0,evolveFlash-dt);speed=Math.min(difficulty.cap,difficulty.speed+elapsed*difficulty.accel);birdAllowed=score>=110;groundShift=(groundShift+speed*dt)%46;
hero.vy+=GRAVITY*dt;hero.y+=hero.vy*dt;if(hero.y>=GROUND-PH){hero.y=GROUND-PH;hero.vy=0;hero.grounded=true}else hero.grounded=false;
for(const c of clouds){c.x-=speed*dt*.075*c.s;if(c.x < -85){c.x=W+random(20,150);c.y=random(26,85)}}
distance+=speed*dt;if(distance>=nextGap)spawn();
for(const o of obstacles){o.x-=speed*dt;if(!o.passed&&o.x+o.w<hero.x){o.passed=true;streak++;if(streak===10)unlock("dodger","10 Clear");if(streak%5===0){bonus+=25;flashNote=streak+" DODGES  +25";flashFor=1.6;}}}obstacles=obstacles.filter(o=>o.x+o.w>=-5);starTimer+=dt;if(starTimer>nextStarDelay){starTimer=0;nextStarDelay=random(3.7,5.8);const spawnX=W+22,tooClose=obstacles.some(o=>Math.abs(o.x-spawnX)<165);if(!tooClose)stars.push({x:spawnX,y:GROUND-random(66,94),phase:random(0,6.28),gold:Math.random()<(eventActive>0?.55:.08)})}for(const star of stars)star.x-=speed*dt;stars=stars.filter(star=>star.x>-20);
const p=playerBox();for(const star of stars){if(!star.taken&&collision(p,{x:star.x-11,y:star.y-11,w:22,h:22})){star.taken=true;bonus+=star.gold?150:35;collected++;if(star.gold){goldenEggs++;unlock("gold","Golden Egg");flashNote="GOLDEN EGG +150"}else{flashNote="STAR +35"}if(collected>=10)unlock("collector","10 Treasures");flashFor=1.2;}}stars=stars.filter(star=>!star.taken);score=Math.floor(elapsed*15*difficulty.reward)+bonus;for(const o of obstacles){if(collision(p,obstacleBox(o))){finish();break}}}
function rect(x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))}
// Original single-sheet world atlas. Keep procedural drawing as a loading fallback.
const worldAtlas=new Image();let worldAtlasReady=false;
worldAtlas.onload=()=>{worldAtlasReady=true};worldAtlas.onerror=()=>{worldAtlasReady=false};
worldAtlas.src="./world-atlas.png";
const worldRects={
cloud0:[15,23,442,149],cloud1:[446,28,369,145],cloud2:[835,14,299,157],cloud3:[1146,65,289,103],
tree0:[16,175,276,214],tree1:[302,166,270,223],tree2:[581,190,174,199],
shrub0:[766,280,150,108],shrub1:[925,243,163,145],rock0:[1104,199,165,189],
palace0:[16,397,395,259],palace1:[417,396,325,259],palace2:[760,396,325,259],palace3:[1090,396,349,259],
ground0:[17,667,225,101],ground1:[396,665,221,108],shrub2:[251,668,133,104],
cactus0:[16,783,108,132],cactus1:[131,783,106,132],cactus2:[244,783,105,132],
crate0:[369,801,96,104],crate1:[476,801,95,105],barrel:[580,795,94,117],fence:[688,796,124,111],
ice:[821,795,102,114],iceBlock:[934,804,96,108],bat:[1047,800,222,111],bird:[1281,787,150,129],
star:[146,930,114,114],gold:[287,936,82,116],spark:[685,931,156,129],dust:[859,938,150,114]
};
function atlasDraw(name,x,y,w,h,alpha=1){if(!worldAtlasReady)return false;const q=worldRects[name];if(!q)return false;ctx.save();ctx.globalAlpha=alpha;ctx.imageSmoothingEnabled=false;ctx.drawImage(worldAtlas,q[0],q[1],q[2],q[3],Math.round(x),Math.round(y),Math.round(w),Math.round(h));ctx.restore();return true}
function cloud(x,y,s){if(atlasDraw("cloud"+(Math.floor(x/160+8)%4),x-12*s,y-8*s,100*s,42*s,.74))return;const c="#dadddf";rect(x,y+11*s,64*s,13*s,c);rect(x+12*s,y+3*s,20*s,18*s,c);rect(x+29*s,y,20*s,23*s,c)}
function cactus(o){if(atlasDraw(o.kind==="cactus2"?"cactus0":"cactus1",o.x-7,o.y-7,o.w+14,o.h+7))return;const x=o.x,y=o.y;rect(x+o.w*.40,y+3,o.w*.25,o.h-3,"#505861");rect(x+3,y+o.h*.48,7,o.h*.25,"#505861");rect(x+3,y+o.h*.67,o.w*.48,6,"#505861");rect(x+o.w-9,y+o.h*.34,7,o.h*.33,"#505861");rect(x+o.w*.58,y+o.h*.54,o.w*.28,6,"#505861");rect(x+o.w*.43,y+6,3,o.h-11,"#848c95");rect(x+o.w*.58,y+4,3,o.h-9,"#353d45");rect(x+5,y+o.h*.55,2,7,"#879099");rect(x+o.w-7,y+o.h*.41,2,6,"#929aa2")}
function bird(o){if(atlasDraw("bird",o.x-4,o.y-7,o.w+8,o.h+15))return;const flap=Math.sin(elapsed*19)>0, x=o.x,y=o.y;rect(x+13,y+11,25,10,"#535860");rect(x+32,y+5,13,9,"#535860");rect(x+43,y+10,7,3,"#535860");rect(x+18,y+(flap?0:17),18,7,"#535860");rect(x+34,y+9,3,3,"#fff");}
function rounded(x,y,w,h,r,c){ctx.fillStyle=c;ctx.beginPath();ctx.roundRect(Math.round(x),Math.round(y),w,h,r);ctx.fill()}
// Pixel sprites are rendered at native resolution to offscreen sheets and cached.
// Each evolution has distinct ready, runA, runB, jump and duck frames.
const spriteSheets=new Map();
function spriteShape(stage,pose,frame){
const isDuck=pose==="duck",isJump=pose==="jump",moving=pose==="run",step=frame===1?3:0;
const feather=(points,color,size=3)=>{ctx.strokeStyle=color;ctx.lineWidth=size;ctx.lineCap="square";ctx.lineJoin="miter";ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke()};
if(stage<2){
const shell=stage===0;
if(shell){rounded(isDuck?12:18,isDuck?28:8,isDuck?42:31,isDuck?18:39,14,"#75604b");rounded(isDuck?14:20,isDuck?29:10,isDuck?38:27,isDuck?15:35,13,"#fff1d2");rounded(isDuck?19:25,isDuck?29:14,12,6,5,"#fffefa");rect(30,37,4,3,"#e3bd87");rect(42,31,3,3,"#e3bd87");return}
rounded(12,isDuck?27:17,39,isDuck?17:27,12,"#9b642f");
rounded(14,isDuck?28:18,35,isDuck?14:25,11,"#ffd55f");
rounded(isDuck?35:26,isDuck?20:8,30,isDuck?23:31,14,"#ffd867");
rounded(isDuck?39:31,isDuck?25:15,13,8,5,"#fff0a5");
rounded(17,32,21,9,6,"#e8a441");rect(isDuck?57:49,isDuck?29:19,5,5,"#2d292d");
rect(isDuck?63:55,isDuck?34:28,10,5,"#ed922f");
}else{
// Long pheasant tail curls upwards; phoenix has five heavy flame feathers.
const fire=stage===3;const coat=fire?"#fa9635":"#b77a46",shade=fire?"#be3c31":"#674639",accent=fire?"#ffd25d":"#258c83";
const ribbons=fire?["#f83f34","#ff812e","#ffd753","#e13f3a","#ffab35"]:["#26786f","#3cae91","#194d68","#80c8a8"];
for(let k=0;k<ribbons.length;k++){const t=k/ribbons.length,shift=Math.sin(frame*1.8+k)*3,high=isDuck?27:10;feather([[23,32+k],[8,24-k*2],[-8-k*5,high-k*4+shift],[-18-k*6,14+k*3+shift]],ribbons[k],fire?5:4)}
// Crest has its own silhouette, not reused between species.
if(fire){feather([[52,17],[51,6],[45,-6],[47,-15]],"#e64235",6);feather([[59,18],[61,3],[67,-8]],"#ffb638",5);feather([[47,15],[41,3],[38,-7]],"#e73f36",5)}
else{feather([[51,17],[48,8],[43,4]],"#8e343e",4);feather([[56,16],[59,7]],"#b64748",3)}
rounded(15,isDuck?30:20,49,isDuck?15:25,11,shade);
rounded(18,isDuck?31:21,45,isDuck?12:22,10,coat);
rounded(isDuck?52:49,isDuck?24:8,22,isDuck?19:30,10,coat);
rounded(52,isDuck?27:12,11,12,5,fire?"#ffe59c":"#efd0a9");
// Layered wing shapes with contrasting edges and feather ridges.
rounded(25,isDuck?33:29,28,12,5,fire?"#e94d30":"#355b65");
rounded(28,isDuck?34:30,20,7,4,fire?"#ffba4b":"#58ac91");
for(let k=0;k<3;k++)rect(30+k*6,isDuck?39:35,4,2,fire?"#ffe4a0":"#a9dcc4");
rect(isDuck?66:65,isDuck?31:19,5,5,"#292937");rect(isDuck?67:66,isDuck?31:19,2,2,"#fff");
feather([[isDuck?73:72,isDuck?37:28],[84,isDuck?38:31],[73,isDuck?41:34]],fire?"#ffe29b":"#d8ad67",4);
}
const low=isDuck?43:40;const legs=isDuck?2:isJump?2:frame===0?7:3;
if(stage!==0){rect(29,low,5,legs,"#9e6639");rect(49,low,5,isDuck?2:isJump?2:frame===0?3:7,"#9e6639");rect(27,low+legs-2,10,3,"#bd7d41");rect(47,low+(frame===0?1:legs-2),10,3,"#bd7d41")}
}
const spriteCache=new Map();
function getSprite(stage,pose,frame){
const key=stage+"-"+pose+"-"+frame;if(spriteCache.has(key))return spriteCache.get(key);
const surface=document.createElement("canvas");surface.width=160;surface.height=104;
const target=surface.getContext("2d");target.imageSmoothingEnabled=false;
const main=ctx;try{ctx=target;ctx.translate(60,30);spriteShape(stage,pose,frame);ctx.setTransform(1,0,0,1,0,0)}finally{ctx=main}
spriteCache.set(key,surface);return surface
}
// The approved original 4x4 illustration sheet is used when available.
// The old procedural sprites remain as a safe fallback until the PNG asset is uploaded.
const evolutionSheet=new Image();let evolutionSheetReady=false;
evolutionSheet.onload=()=>{evolutionSheetReady=true};
evolutionSheet.onerror=()=>{evolutionSheetReady=false};
evolutionSheet.src="./bird-evolution.png";
function dino(){
const pose=hero.duck&&hero.grounded?"duck":!hero.grounded?"jump":"run",frame=Math.floor(elapsed*11)%2;
if(evolutionSheetReady){const col=pose==="duck"?3:pose==="jump"?2:frame;const sw=evolutionSheet.width/4,sh=evolutionSheet.height/4;
const widths=[59,72,111,136],heights=[61,67,75,82],dw=widths[evolution],dh=heights[evolution];
ctx.save();ctx.imageSmoothingEnabled=false;
ctx.drawImage(evolutionSheet,col*sw,evolution*sh,sw,sh,Math.round(hero.x+49-dw),Math.round(GROUND-dh+(hero.y-(GROUND-PH))),dw,dh);ctx.restore();return}
const sprite=getSprite(evolution,pose,frame);ctx.imageSmoothingEnabled=false;ctx.drawImage(sprite,Math.round(hero.x-77),Math.round(hero.y-30))
}
function evolutionEffect(){if(evolveFlash<=0)return;const progress=1-evolveFlash/2.2,cx=hero.x+28,cy=hero.y+23;ctx.save();const pulse=.4+.35*Math.sin(progress*24)**2;ctx.globalAlpha=Math.min(.8,(1-progress)*pulse);ctx.fillStyle=evolution===3?"#ffb94c":"#ffde87";ctx.beginPath();ctx.arc(cx,cy,23+progress*57,0,Math.PI*2);ctx.fill();ctx.globalAlpha=Math.min(1,(1-progress)*1.2);for(let i=0;i<20;i++){const angle=i*Math.PI/10+progress*2,r=20+progress*(55+i%3*8);ctx.fillStyle=i%3===0?"#fff7bf":i%2?"#ffbd49":"#e7864e";rect(cx+Math.cos(angle)*r,cy+Math.sin(angle)*r,3+i%3,3+i%3,ctx.fillStyle)}ctx.restore();ctx.save();ctx.globalAlpha=Math.min(1,evolveFlash)*.95;ctx.fillStyle=evolution===3?"#d9502d":"#936827";ctx.font="bold 16px Arial";ctx.textAlign="center";ctx.fillText(["","HATCHED!","PHEASANT!","PHOENIX AWAKENS!"][evolution],W/2,52);ctx.restore()}
function scenery(){
const back=(elapsed*speed*.035)%460;
if(worldAtlasReady){
for(let i=-1;i<4;i++){const x=i*460-back;atlasDraw("palace"+((i+12+scene)%4),x,106,470,116,.26)}
const middle=(elapsed*speed*.09)%250;
for(let i=-1;i<6;i++){const x=i*250-middle;const item=scene===3?"rock0":scene===2?"tree1":scene===1?"tree2":"tree0";atlasDraw(item,x+25,GROUND-54,90,54,.65);atlasDraw(i%2?"shrub1":"shrub0",x+160,GROUND-19,38,19,.75)}
for(let i=-1;i<13;i++){let x=i*96-(groundShift*2.1%96);atlasDraw("ground"+(scene%2),x,GROUND+2,97,23,.58)}
return}
const parallax=(elapsed*speed*.09)%310;ctx.save();ctx.globalAlpha=.48;for(let i=-1;i<5;i++){const x=i*310-parallax;rect(x+35,170,84,52,"#edf0f3");rect(x+53,155,45,15,"#edf0f3");rect(x+164,186,72,36,"#e5eaef")}ctx.restore();
}
function milestone(){if(mode!=="running"||score<100)return;const mod=score%250;if(mod>36)return;ctx.save();ctx.globalAlpha=Math.max(0,Math.min(1,mod/6,(36-mod)/9));ctx.fillStyle="#9ca6b1";ctx.textAlign="center";ctx.font="bold 13px Arial";ctx.fillText(score<500?"KEEP GOING":score<1000?"HATCHED!":"FULLY GROWN",W/2,42);ctx.restore()}function starArt(star){if(atlasDraw(star.gold?"gold":"star",star.x-14,star.y-14+Math.sin(elapsed*4+star.phase)*3,28,28))return;const x=star.x,y=star.y+Math.sin(elapsed*4+star.phase)*3;if(star.gold){ctx.save();ctx.fillStyle="#a46d1b";ctx.beginPath();ctx.ellipse(x,y,11,14,0,0,Math.PI*2);ctx.fill();ctx.fillStyle="#ffd15b";ctx.beginPath();ctx.ellipse(x-1,y-2,8,11,0,0,Math.PI*2);ctx.fill();rect(x-4,y-9,4,5,"#fff4bd");ctx.restore();return}ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(elapsed*3+star.phase)*.15);ctx.fillStyle="#e7aa39";ctx.beginPath();for(let i=0;i<10;i++){const a=i*Math.PI/5-Math.PI/2,r=i%2?5:12;ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r)}ctx.closePath();ctx.fill();ctx.fillStyle="#fff4b9";ctx.fillRect(-2,-7,4,5);ctx.restore()}function crateArt(o){if(atlasDraw("crate0",o.x-3,o.y-3,o.w+6,o.h+3))return;const x=Math.round(o.x),y=o.y;rect(x+2,y+29,32,3,"#b4b8bd");rect(x,y,34,30,"#352b2a");rect(x+3,y+3,28,24,"#805037");rect(x+6,y+6,22,18,"#b97b4b");rect(x+8,y+8,18,14,"#955935");ctx.strokeStyle="#553b2c";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+7,y+7);ctx.lineTo(x+27,y+23);ctx.moveTo(x+27,y+7);ctx.lineTo(x+7,y+23);ctx.stroke();rect(x+2,y+2,7,7,"#626773");rect(x+25,y+2,7,7,"#626773");rect(x+2,y+21,7,7,"#626773");rect(x+25,y+21,7,7,"#626773");for(const [dx,dy] of [[5,5],[28,5],[5,24],[28,24]])rect(x+dx,y+dy,2,2,"#d6dbe0")}function hazardArt(o){const id={fence:"fence",barrel:"barrel",bat:"bat",ice:"ice"}[o.kind];if(id&&atlasDraw(id,o.x-4,o.y-5,o.w+8,o.h+5))return;const x=o.x,y=o.y;if(o.kind==="fence"){rect(x,y+5,36,5,"#614c3b");rect(x,y+17,36,5,"#614c3b");rect(x+4,y,6,29,"#9b7250");rect(x+26,y,6,29,"#9b7250")}else if(o.kind==="barrel"){rect(x+2,y+3,26,36,"#65473b");rect(x+5,y+6,20,30,"#9e6651");rect(x+3,y+8,24,5,"#4f5962");rect(x+3,y+27,24,5,"#4f5962")}else if(o.kind==="bat"){rect(x+15,y+9,12,12,"#47445f");rect(x,y+5,16,8,"#62607b");rect(x+26,y+5,16,8,"#62607b");rect(x+20,y+12,3,3,"#ffb78b")}else if(o.kind==="ice"){rect(x+2,y+11,32,17,"#92c5dc");rect(x+9,y+1,20,12,"#bce9fb");rect(x+10,y+12,5,13,"#effaff");rect(x+24,y+15,4,10,"#6ea6c9")}}function render(){ctx.clearRect(0,0,W,H);const skies=["#fbfcfd","#fff4e7","#e5eafb","#f0f8ff"];rect(0,0,W,H,skies[scene]);for(const c of clouds)cloud(c.x,c.y,c.s);scenery();rect(0,GROUND,W,2,"#666c74");for(let x=-groundShift;x<W;x+=46){rect(x,GROUND+13,17,2,"#c7cbd0");rect(x+27,GROUND+23,7,2,"#c7cbd0")}for(const o of obstacles){if(o.kind==="bird")bird(o);else if(o.kind==="crate")crateArt(o);else if(["fence","barrel","bat","ice"].includes(o.kind))hazardArt(o);else cactus(o)}for(const star of stars)starArt(star);dino();evolutionEffect();milestone();if(eventActive>0){ctx.save();ctx.fillStyle="#c5882e";ctx.textAlign="right";ctx.font="bold 12px Arial";ctx.fillText("✦ GOLDEN RUSH "+Math.ceil(eventActive)+"s",W-20,25);ctx.restore()}if(flashFor>0){ctx.save();ctx.globalAlpha=Math.min(1,flashFor);ctx.fillStyle="#b67b2c";ctx.textAlign="center";ctx.font="bold 16px Arial";ctx.fillText(flashNote,W/2,62);ctx.restore()}if(mode==="running"&&score>0&&score%250>=240){rect(0,0,W,2,"#e5e8ed")}}
function frame(t){let dt=last?clamp((t-last)/1000,0,.05):0;last=t;let steps=0;while(dt>.00001&&steps<6){const step=Math.min(dt,1/120);update(step);dt-=step;steps++;if(mode==="over")break}if(mode==="running")scoreLabel.textContent=fmt(score);render();requestAnimationFrame(frame)}
document.addEventListener("keydown",e=>{if(e.code==="Escape"&&revealed){e.preventDefault();toggleGame(true);return}if(!revealed)return;if(e.code==="Space"||e.code==="ArrowUp"){e.preventDefault();if(!e.repeat)jump()}else if(e.code==="ArrowDown"){e.preventDefault();hero.duck=true}else if(e.code==="Enter"&&mode!=="running"){e.preventDefault();start()}});document.addEventListener("keyup",e=>{if(e.code==="ArrowDown")hero.duck=false});document.getElementById("secretToggle").addEventListener("click",()=>toggleGame());canvas.addEventListener("pointerdown",()=>{if(revealed)jump()});action.addEventListener("click",e=>{e.stopPropagation();start()});const duckTouch=document.getElementById("duckTouch");duckTouch.addEventListener("pointerdown",e=>{e.preventDefault();if(revealed&&mode==="running"){hero.duck=true;duckTouch.setPointerCapture(e.pointerId)}});for(const eventName of ["pointerup","pointercancel","lostpointercapture"])duckTouch.addEventListener(eventName,()=>{hero.duck=false});document.getElementById("reload").addEventListener("click",()=>location.reload());document.addEventListener("visibilitychange",()=>{last=performance.now()});reset();renderBadges();show("ready");requestAnimationFrame(frame);
})();
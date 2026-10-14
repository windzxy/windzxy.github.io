"use strict";
(()=>{const canvas=document.getElementById("game"),ctx=canvas.getContext("2d"),overlay=document.getElementById("overlay"),action=document.getElementById("action"),eyebrow=document.getElementById("eyebrow"),heading=document.getElementById("overlayTitle"),message=document.getElementById("overlayText"),scoreLabel=document.getElementById("scoreLabel"),bestLabel=document.getElementById("best");const runner=document.getElementById("runner");let revealed=false;function toggleGame(forceHide=false){revealed=forceHide?false:!revealed;runner.hidden=!revealed;document.body.classList.toggle("playing",revealed);document.title=revealed?"网页无法访问":"网页无法访问";if(!revealed){reset();show("ready");}else{reset();show("ready");runner.scrollIntoView({block:"nearest",behavior:"smooth"});}}const W=960,H=280,GROUND=224,DX=110,PW=42,PH=46,GRAVITY=1950,JUMP=-680;const key="err-network-best-v3";let best=0;try{best=+localStorage.getItem(key)||0}catch(_){}const fmt=n=>String(Math.floor(n)).padStart(5,"0");bestLabel.textContent=fmt(best);
let mode="ready",last=0,elapsed=0,score=0,speed=295,distance=0,nextGap=550,obstacles=[],clouds=[],groundShift=0,birdAllowed=false,evolution=0,evolveFlash=0;const hero={x:DX,y:GROUND-PH,vy:0,duck:false,grounded:true};const random=(a,b)=>a+Math.random()*(b-a);const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
function reset(){mode="ready";elapsed=0;score=0;speed=295;distance=0;nextGap=570;obstacles=[];groundShift=0;birdAllowed=false;evolution=0;evolveFlash=0;hero.y=GROUND-PH;hero.vy=0;hero.duck=false;hero.grounded=true;clouds=[{x:180,y:45,s:1},{x:490,y:75,s:.8},{x:820,y:40,s:1.1}];scoreLabel.textContent=fmt(0);bestLabel.textContent=fmt(best)}
function show(type){overlay.hidden=false;eyebrow.textContent=type==="over"?"CONNECTION INTERRUPTED":"OFFLINE MODE";heading.textContent=type==="over"?"Game over":"Ready to run?";message.textContent=type==="over"?"Score "+fmt(score)+" · Best "+fmt(best):"Press Space or tap to start";action.innerHTML=type==="over"?'Run again <span aria-hidden="true">↻</span>':'Start running <span aria-hidden="true">→</span>'}
function start(){reset();mode="running";overlay.hidden=true;last=performance.now()}
function jump(){if(mode!=="running"){start();return}if(hero.grounded){hero.duck=false;hero.vy=JUMP;hero.grounded=false}}
function finish(){if(mode!=="running")return;mode="over";if(score>best){best=score;try{localStorage.setItem(key,String(best))}catch(_){}}bestLabel.textContent=fmt(best);show("over")}
function collision(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y}
function playerBox(){const dh=hero.duck&&hero.grounded;return dh?{x:hero.x+6,y:GROUND-25,w:42,h:22}:{x:hero.x+10,y:hero.y+7,w:31,h:36}}
function obstacleBox(o){return{x:o.x+5,y:o.y+3,w:o.w-10,h:o.h-5}}
function spawn(){const bird=birdAllowed&&Math.random()<.23;let o;if(bird){o={kind:"bird",x:W+30,y:GROUND-68,w:48,h:23}}else{const big=Math.random()<.33;o={kind:big?"cactus2":"cactus",x:W+30,y:GROUND-(big?49:38),w:big?42:26,h:big?49:38}}obstacles.push(o);
// Travel gap includes air-time and reaction buffer: gap grows with speed, not random per-frame clustering.
const air=2*Math.abs(JUMP)/GRAVITY;
const guaranteed=Math.max(360,speed*(air+0.55)+o.w+PW);
nextGap=random(guaranteed,guaranteed+180);distance=0}
function update(dt){if(mode!=="running")return;elapsed+=dt;score=Math.floor(elapsed*15);const nextEvolution=score>=1000?2:score>=500?1:0;if(nextEvolution!==evolution){evolution=nextEvolution;evolveFlash=2.2;}evolveFlash=Math.max(0,evolveFlash-dt);speed=Math.min(490,295+elapsed*5);birdAllowed=score>=110;scoreLabel.textContent=fmt(score);groundShift=(groundShift+speed*dt)%46;
hero.vy+=GRAVITY*dt;hero.y+=hero.vy*dt;if(hero.y>=GROUND-PH){hero.y=GROUND-PH;hero.vy=0;hero.grounded=true}else hero.grounded=false;
for(const c of clouds){c.x-=speed*dt*.075*c.s;if(c.x < -85){c.x=W+random(20,150);c.y=random(26,85)}}
distance+=speed*dt;if(distance>=nextGap)spawn();
for(const o of obstacles)o.x-=speed*dt;obstacles=obstacles.filter(o=>o.x+o.w>=-5);
const p=playerBox();for(const o of obstacles){if(collision(p,obstacleBox(o))){finish();break}}}
function rect(x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))}
function cloud(x,y,s){const c="#dadddf";rect(x,y+11*s,64*s,13*s,c);rect(x+12*s,y+3*s,20*s,18*s,c);rect(x+29*s,y,20*s,23*s,c)}
function cactus(o){const x=o.x,y=o.y;rect(x+o.w*.40,y+3,o.w*.25,o.h-3,"#505861");rect(x+3,y+o.h*.48,7,o.h*.25,"#505861");rect(x+3,y+o.h*.67,o.w*.48,6,"#505861");rect(x+o.w-9,y+o.h*.34,7,o.h*.33,"#505861");rect(x+o.w*.58,y+o.h*.54,o.w*.28,6,"#505861");rect(x+o.w*.43,y+6,3,o.h-11,"#848c95");rect(x+o.w*.58,y+4,3,o.h-9,"#353d45");rect(x+5,y+o.h*.55,2,7,"#879099");rect(x+o.w-7,y+o.h*.41,2,6,"#929aa2")}
function bird(o){const flap=Math.sin(elapsed*19)>0, x=o.x,y=o.y;rect(x+13,y+11,25,10,"#535860");rect(x+32,y+5,13,9,"#535860");rect(x+43,y+10,7,3,"#535860");rect(x+18,y+(flap?0:17),18,7,"#535860");rect(x+34,y+9,3,3,"#fff");}
function rounded(x,y,w,h,r,c){ctx.fillStyle=c;ctx.beginPath();ctx.roundRect(Math.round(x),Math.round(y),w,h,r);ctx.fill()}
function dino(){const x=hero.x,y=hero.y,phase=Math.floor(elapsed*13)%2,duck=hero.duck&&hero.grounded,grown=evolution===2,hop=hero.grounded&&!duck?Math.sin(elapsed*15)*.7:0;
ctx.save();ctx.translate(Math.round(x),Math.round(y+hop));
const ink="#755b43",egg="#fff2d8",eggShade="#e9cba0",chick=grown?"#edae3c":"#ffd55f",shade=grown?"#cd842c":"#eaa643",light="#fff2ac",feet="#b86f39";
if(duck){
// Individually drawn low poses; all sit on the SAME ground at local y=46.
if(evolution===0){rounded(2,23,49,23,12,ink);rounded(5,25,43,19,10,eggShade);rounded(7,24,39,17,9,egg);rounded(12,26,15,5,3,"#fffefa");rect(37,35,5,3,eggShade);rect(15,43,7,3,ink);rect(35,43,7,3,ink)}
else{rounded(2,25,45,19,9,ink);rounded(4,26,42,16,8,chick);rounded(25,19,26,21,10,chick);rounded(33,23,12,5,2,light);rect(42,27,4,4,"#3d342b");rect(43,27,2,2,"#fff");rect(49,34,10,4,"#df8231");rounded(6,32,20,7,4,shade);rect(14,43,7,3,feet);rect(35,43,7,3,feet);if(grown){rect(34,13,5,7,"#d45d47");rect(40,15,5,6,"#d45d47");rect(3,30,8,5,shade)}}
ctx.restore();return}
if(evolution===0){
// Egg: hand-crafted shell profile, glint, freckles, and a grounded base.
rounded(7,3,39,43,18,ink);rounded(9,5,35,39,17,eggShade);rounded(12,5,30,35,15,egg);rounded(16,9,13,7,4,"#fffefa");rect(18,29,3,3,"#ebcb94");rect(36,22,3,4,"#ebcb94");rect(15,39,5,3,"#e7c38e");rect(15,44,7,2,ink);rect(33,44,7,2,ink);
}else{
// Chick / adult: separate silhouette, animated wing, feather texture and footfall.
rounded(7,16,37,28,13,ink);rounded(9,16,34,26,12,chick);rounded(16,grown?3:8,31,30,13,chick);rounded(20,12,14,8,5,light);
rounded(9,27+(phase?1:0),17,12,6,shade);rounded(14,27+(phase?1:0),11,6,4,chick);
rect(37,20,5,5,"#342b28");rect(38,20,2,2,"#fff");ctx.fillStyle="#d87e35";ctx.beginPath();ctx.moveTo(45,27);ctx.lineTo(grown?61:56,31);ctx.lineTo(45,36);ctx.closePath();ctx.fill();
rect(15,42,5,phase?4:2,feet);rect(33,42,5,phase?2:4,feet);
if(grown){rect(18,3,5,9,"#d7624d");rect(25,0,6,12,"#d7624d");rect(32,5,5,8,"#d7624d");rect(2,27,9,6,shade);rect(29,32,5,3,"#fbd279")}
else{rect(18,8,4,4,light);rect(29,33,3,3,"#f9bd56")}
}
ctx.restore()}
function evolutionEffect(){if(evolveFlash<=0)return;const a=Math.min(1,evolveFlash/.5);ctx.save();ctx.globalAlpha=a*.75;const cx=hero.x+26,cy=hero.y+20;for(let i=0;i<12;i++){const angle=i*Math.PI/6+elapsed*.7,rad=27+(2.2-evolveFlash)*25;rect(cx+Math.cos(angle)*rad,cy+Math.sin(angle)*rad,4+(i%3),4+(i%3),i%2?"#f7c861":"#ffe6a2")}ctx.restore();ctx.save();ctx.globalAlpha=Math.min(.8,evolveFlash*.5);ctx.fillStyle="#a66e21";ctx.textAlign="center";ctx.font="bold 15px Arial";ctx.fillText(evolution===1?"CHICK!":"EVOLVED!",hero.x+22,hero.y-20);ctx.restore()}
function render(){ctx.clearRect(0,0,W,H);rect(0,0,W,H,"#fbfcfd");for(const c of clouds)cloud(c.x,c.y,c.s);rect(0,GROUND,W,2,"#666c74");for(let x=-groundShift;x<W;x+=46){rect(x,GROUND+13,17,2,"#c7cbd0");rect(x+27,GROUND+23,7,2,"#c7cbd0")}for(const o of obstacles){if(o.kind==="bird")bird(o);else cactus(o)}dino();evolutionEffect();if(mode==="running"&&score>0&&score%250>=240){rect(0,0,W,2,"#e5e8ed")}}
function frame(t){const dt=last?clamp((t-last)/1000,0,.035):0;last=t;update(dt);render();requestAnimationFrame(frame)}
document.addEventListener("keydown",e=>{if(e.code==="Escape"&&revealed){e.preventDefault();toggleGame(true);return}if(!revealed)return;if(e.code==="Space"||e.code==="ArrowUp"){e.preventDefault();if(!e.repeat)jump()}else if(e.code==="ArrowDown"){e.preventDefault();hero.duck=true}else if(e.code==="Enter"&&mode!=="running"){e.preventDefault();start()}});document.addEventListener("keyup",e=>{if(e.code==="ArrowDown")hero.duck=false});document.getElementById("secretToggle").addEventListener("click",()=>toggleGame());canvas.addEventListener("pointerdown",()=>{if(revealed)jump()});action.addEventListener("click",e=>{e.stopPropagation();start()});document.getElementById("reload").addEventListener("click",()=>location.reload());document.addEventListener("visibilitychange",()=>{last=performance.now()});reset();show("ready");requestAnimationFrame(frame);
})();
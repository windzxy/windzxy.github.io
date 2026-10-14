"use strict";
(()=>{const canvas=document.getElementById("game"),ctx=canvas.getContext("2d"),overlay=document.getElementById("overlay"),action=document.getElementById("action"),eyebrow=document.getElementById("eyebrow"),heading=document.getElementById("overlayTitle"),message=document.getElementById("overlayText"),scoreLabel=document.getElementById("scoreLabel"),bestLabel=document.getElementById("best");const runner=document.getElementById("runner");let revealed=false;function toggleGame(forceHide=false){revealed=forceHide?false:!revealed;runner.hidden=!revealed;document.body.classList.toggle("playing",revealed);document.title=revealed?"网页无法访问":"网页无法访问";if(!revealed){reset();show("ready");}else{reset();show("ready");runner.scrollIntoView({block:"nearest",behavior:"smooth"});}}const W=960,H=280,GROUND=224,DX=110,PW=42,PH=46,GRAVITY=1950,JUMP=-680;const key="err-network-best-v3";let best=0;try{best=+localStorage.getItem(key)||0}catch(_){}const fmt=n=>String(Math.floor(n)).padStart(5,"0");bestLabel.textContent=fmt(best);
let mode="ready",last=0,elapsed=0,score=0,speed=295,distance=0,nextGap=550,obstacles=[],clouds=[],groundShift=0,birdAllowed=false,evolution=0,evolveFlash=0;const hero={x:DX,y:GROUND-PH,vy:0,duck:false,grounded:true};const random=(a,b)=>a+Math.random()*(b-a);const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
function reset(){mode="ready";elapsed=0;score=0;speed=295;distance=0;nextGap=570;obstacles=[];groundShift=0;birdAllowed=false;evolution=0;evolveFlash=0;hero.y=GROUND-PH;hero.vy=0;hero.duck=false;hero.grounded=true;clouds=[{x:180,y:45,s:1},{x:490,y:75,s:.8},{x:820,y:40,s:1.1}];scoreLabel.textContent=fmt(0);bestLabel.textContent=fmt(best)}
function show(type){overlay.hidden=false;eyebrow.textContent=type==="over"?"CONNECTION INTERRUPTED":"OFFLINE MODE";heading.textContent=type==="over"?"Game over":"Ready to run?";message.textContent=type==="over"?"Score "+fmt(score)+" · Best "+fmt(best):"Press Space or tap to start";action.innerHTML=type==="over"?'Run again <span aria-hidden="true">↻</span>':'Start running <span aria-hidden="true">→</span>'}
function start(){reset();mode="running";overlay.hidden=true;last=performance.now()}
function jump(){if(mode!=="running"){start();return}if(hero.grounded){hero.duck=false;hero.vy=JUMP;hero.grounded=false}}
function finish(){if(mode!=="running")return;mode="over";if(score>best){best=score;try{localStorage.setItem(key,String(best))}catch(_){}}bestLabel.textContent=fmt(best);show("over")}
function collision(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y}
function playerBox(){const dh=hero.duck&&hero.grounded;return{x:hero.x+7,y:hero.y+(dh?24:7),w:dh?35:30,h:dh?17:37}}
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
function cactus(o){const x=o.x,y=o.y;rect(x+o.w*.40,y+3,o.w*.25,o.h-3,"#535860");rect(x+3,y+o.h*.48,7,o.h*.25,"#535860");rect(x+3,y+o.h*.67,o.w*.48,6,"#535860");rect(x+o.w-9,y+o.h*.34,7,o.h*.33,"#535860");rect(x+o.w*.58,y+o.h*.54,o.w*.28,6,"#535860");}
function bird(o){const flap=Math.sin(elapsed*19)>0, x=o.x,y=o.y;rect(x+13,y+11,25,10,"#535860");rect(x+32,y+5,13,9,"#535860");rect(x+43,y+10,7,3,"#535860");rect(x+18,y+(flap?0:17),18,7,"#535860");rect(x+34,y+9,3,3,"#fff");}
function rounded(x,y,w,h,r,c){ctx.fillStyle=c;ctx.beginPath();ctx.roundRect(Math.round(x),Math.round(y),w,h,r);ctx.fill()}
function dino(){const x=hero.x,y=hero.y,phase=Math.floor(elapsed*13)%2,grounded=hero.grounded,duck=hero.duck&&grounded,hop=grounded?Math.sin(elapsed*15)*1.6:0;
ctx.save();ctx.translate(Math.round(x),Math.round(y+hop));if(duck)ctx.scale(1,0.82);
if(evolution===0){
// Warm ivory egg with chocolate outline, soft shadow, tiny highlight and faint pixel speckles.
rounded(6,6,37,42,17,"#6b625c");rounded(9,8,31,36,15,"#fff1d4");rounded(12,10,25,30,12,"#ffe9bf");rounded(15,11,12,7,5,"#fffdfa");
rect(15,28,4,4,"#edcf9e");rect(34,22,3,3,"#edcf9e");rect(12,38,5,3,"#f6d9a5");
}else{
// Distinct chick at 500 and grown bird at 1000, animated feet and wing.
const grown=evolution===2,main=grown?"#f3b847":"#ffd56b",shadow=grown?"#d99630":"#ebaf4e",highlight=grown?"#ffe7a0":"#ffed9e";
rounded(6,13,36,32,15,"#765a3e");rounded(8,13,33,29,14,main);
rounded(grown?16:13,grown?3:7,grown?31:29,grown?31:28,13,main);
rounded(18,12,15,10,6,highlight);
rect(grown?37:35,19,5,5,"#3b3431");rect(grown?38:36,19,2,2,"#fff");
ctx.fillStyle=grown?"#d77a37":"#ec9c3d";ctx.beginPath();ctx.moveTo(44,26);ctx.lineTo(grown?60:55,30);ctx.lineTo(44,35);ctx.closePath();ctx.fill();
rounded(11,29+(phase?2:0),16,9,5,shadow);rounded(14,30+(phase?2:0),11,5,4,main);
if(grown){rect(16,4,5,8,"#d9634c");rect(23,0,6,12,"#d9634c");rect(29,6,5,7,"#d9634c");rect(1,25,11,6,shadow)}
const foot="#bd7942";rect(15,41,5,grounded&&phase?7:5,foot);rect(32,41,5,grounded&&!phase?7:5,foot);
}
ctx.restore()}
function evolutionEffect(){if(evolveFlash<=0)return;const a=Math.min(1,evolveFlash/.5);ctx.save();ctx.globalAlpha=a*.75;const cx=hero.x+26,cy=hero.y+20;for(let i=0;i<12;i++){const angle=i*Math.PI/6+elapsed*.7,rad=27+(2.2-evolveFlash)*25;rect(cx+Math.cos(angle)*rad,cy+Math.sin(angle)*rad,4+(i%3),4+(i%3),i%2?"#f7c861":"#ffe6a2")}ctx.restore();ctx.save();ctx.globalAlpha=Math.min(.8,evolveFlash*.5);ctx.fillStyle="#a66e21";ctx.textAlign="center";ctx.font="bold 15px Arial";ctx.fillText(evolution===1?"CHICK!":"EVOLVED!",hero.x+22,hero.y-20);ctx.restore()}
function render(){ctx.clearRect(0,0,W,H);rect(0,0,W,H,"#fbfcfd");for(const c of clouds)cloud(c.x,c.y,c.s);rect(0,GROUND,W,2,"#666c74");for(let x=-groundShift;x<W;x+=46){rect(x,GROUND+13,17,2,"#c7cbd0");rect(x+27,GROUND+23,7,2,"#c7cbd0")}for(const o of obstacles){if(o.kind==="bird")bird(o);else cactus(o)}dino();evolutionEffect();if(mode==="running"&&score>0&&score%250>=240){rect(0,0,W,2,"#e5e8ed")}}
function frame(t){const dt=last?clamp((t-last)/1000,0,.035):0;last=t;update(dt);render();requestAnimationFrame(frame)}
document.addEventListener("keydown",e=>{if(e.code==="Escape"&&revealed){e.preventDefault();toggleGame(true);return}if(!revealed)return;if(e.code==="Space"||e.code==="ArrowUp"){e.preventDefault();if(!e.repeat)jump()}else if(e.code==="ArrowDown"){e.preventDefault();hero.duck=true}else if(e.code==="Enter"&&mode!=="running"){e.preventDefault();start()}});document.addEventListener("keyup",e=>{if(e.code==="ArrowDown")hero.duck=false});document.getElementById("secretToggle").addEventListener("click",()=>toggleGame());canvas.addEventListener("pointerdown",()=>{if(revealed)jump()});action.addEventListener("click",e=>{e.stopPropagation();start()});document.getElementById("reload").addEventListener("click",()=>location.reload());document.addEventListener("visibilitychange",()=>{last=performance.now()});reset();show("ready");requestAnimationFrame(frame);
})();
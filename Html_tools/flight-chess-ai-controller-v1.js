(()=>{
'use strict';
const VERSION='20260913-flight-chess-ai-controller-v1.1-color-choice';
if(window.__webdeskFlightChessAIController===VERSION)return;
window.__webdeskFlightChessAIController=VERSION;
const COLORS=['red','yellow','blue','green'];
const NAME={red:'紅方',yellow:'黃方',blue:'藍方',green:'綠方'};
const START={red:0,yellow:13,blue:26,green:39};
const SAFE=new Set([0,8,13,21,26,34,39,47]);
const seen=new Map();
const timers=new Map();
function ws(){try{return activeWorkspace()}catch(_){return null}}
function persist(){try{save()}catch(_){}}
function redraw(){try{if(typeof renderDesktop==='function')renderDesktop();else renderAll?.()}catch(_){}}
function globalPos(color,p){return(START[color]+p)%52}
function normalize(s){
 if(!s||!Array.isArray(s.players)||s.players.length!==4)return;
 if(s.mode==='solo'){
   const human=COLORS.includes(s.humanColor)?s.humanColor:'red';
   s.humanColor=human;
   s.players.forEach(p=>p.type=p.color===human?'human':'ai');
 } else if(s.mode==='duo')s.players.forEach((p,i)=>p.type=i<2?'human':'ai');
 else if(s.mode==='local')s.players.forEach(p=>p.type='human');
}
function movable(s){
 const d=+s.roll||0,p=s.players[s.turn];if(!d||!p)return[];
 return p.planes.filter(pl=>{if(pl.finished)return false;if(pl.state==='base')return d===5||d===6;if(pl.state==='track'){const n=pl.progress+d;return n<=51||(n-52)<=5}if(pl.state==='home')return pl.home+d<=5;return false});
}
function capture(s,p,pl){
 if(pl.state!=='track')return 0;const gp=globalPos(p.color,pl.progress);if(SAFE.has(gp))return 0;let n=0;
 for(const op of s.players){if(op===p)continue;for(const q of op.planes){if(q.state==='track'&&globalPos(op.color,q.progress)===gp){q.state='base';q.progress=-1;q.home=-1;q.finished=false;n++}}}
 return n;
}
function bonus(pl){if(pl.state!=='track')return'';if(pl.progress===18){pl.progress=30;return'穿越飛行線'}if(pl.progress<=47&&pl.progress%4===2){pl.progress+=4;return'同色跳躍 +4'}return''}
function choose(s){
 const p=s.players[s.turn],m=movable(s);let best=null,score=-1e9;
 for(const pl of m){let v=Math.random()*4;if(pl.state==='base')v+=70;if(pl.state==='home')v+=160+(pl.home||0)*14;if(pl.state==='track'){const n=pl.progress+s.roll;v+=n;if(n>51)v+=210;if(n===18)v+=100;if(n<=47&&n%4===2)v+=42;const gp=globalPos(p.color,Math.min(n,51));if(!SAFE.has(gp))for(const op of s.players)if(op!==p)for(const q of op.planes)if(q.state==='track'&&globalPos(op.color,q.progress)===gp)v+=180}if(v>score){score=v;best=pl}}
 return best;
}
function next(s,keep=false){if(keep){s.roll=0;s.awaitingRoll=true;s.message=NAME[s.players[s.turn].color]+' 再擲一次';return}s.turn=(s.turn+1)%4;s.roll=0;s.awaitingRoll=true;s.consecutiveSix=0;s.message='輪到 '+NAME[s.players[s.turn].color]}
function finish(s,p){if(p.planes.every(x=>x.finished)){s.winner=p.color;s.message='🏆 '+NAME[p.color]+' 勝出！';return true}return false}
function directMove(card,s){
 const p=s.players[s.turn],pl=choose(s);if(!pl)return false;const d=s.roll;let msg='';
 if(pl.state==='base'){pl.state='track';pl.progress=0;msg='起飛'}else if(pl.state==='track'){const n=pl.progress+d;if(n<=51){pl.progress=n;msg='前進 '+d+' 格'}else{pl.state='home';pl.home=n-52;pl.progress=-1;msg='進入終點航道'}}else if(pl.state==='home'){pl.home+=d;msg='終點航道前進 '+d+' 格'}
 if(pl.state==='home'&&pl.home===5){pl.finished=true;pl.state='finished';msg='抵達終點'}
 if(!pl.finished&&pl.state==='track'){const b=bonus(pl);if(b)msg+=' · '+b;const c=capture(s,p,pl);if(c)msg+=' · 撞回 '+c+' 架飛機'}
 s.moves=(+s.moves||0)+1;s.message=NAME[p.color]+'：'+msg;const keep=d===6;s.roll=0;s.awaitingRoll=true;if(finish(s,p)){persist();redraw();return true}
 persist();redraw();setTimeout(()=>{const q=card.data?.flightChessV3;if(!q||q.winner)return;next(q,keep);normalize(q);persist();redraw();scanCard(card,true)},420);return true;
}
function directRoll(card,s){
 const p=s.players[s.turn];const d=1+Math.floor(Math.random()*6);s.roll=d;s.awaitingRoll=false;d===6?s.consecutiveSix=(+s.consecutiveSix||0)+1:s.consecutiveSix=0;
 if(s.consecutiveSix>=3){s.message=NAME[p.color]+' 連續三次 6 · 本回合取消';s.roll=0;s.awaitingRoll=true;s.consecutiveSix=0;persist();redraw();setTimeout(()=>{next(s,false);normalize(s);persist();redraw();scanCard(card,true)},500);return}
 const m=movable(s);s.message=NAME[p.color]+' 擲出 '+d+(m.length?' · AI 思考中':' · 無可走飛機');persist();redraw();
 if(!m.length){setTimeout(()=>{next(s,d===6);normalize(s);persist();redraw();scanCard(card,true)},560);return}
 setTimeout(()=>directMove(card,s),520);
}
function keyOf(s){return [s.turn,s.roll,s.awaitingRoll?1:0,s.moves||0,s.winner||'',s.humanColor||'',s.players?.map(p=>p.type).join(',')].join('|')}
function scanCard(card,force=false){
 const s=card?.data?.flightChessV3;if(!s||s.winner)return;normalize(s);
 const p=s.players[s.turn];if(!p||p.type!=='ai')return;
 const k=card.id+':'+keyOf(s),now=Date.now(),prev=seen.get(card.id);
 if(!prev||prev.key!==k){seen.set(card.id,{key:k,at:now});return}
 const wait=force?0:(s.awaitingRoll?900:760);if(now-prev.at<wait)return;
 if(timers.has(card.id))return;timers.set(card.id,true);seen.set(card.id,{key:k,at:now});
 setTimeout(()=>{timers.delete(card.id);const q=card.data?.flightChessV3;if(!q||q.winner)return;normalize(q);if(q.players[q.turn]?.type!=='ai')return;if(q.awaitingRoll)directRoll(card,q);else if(q.roll&&movable(q).length)directMove(card,q);else if(q.roll&&!movable(q).length){next(q,q.roll===6);normalize(q);persist();redraw();scanCard(card,true)}},100);
}
function injectColorChoice(root,card){
 const s=card?.data?.flightChessV3;if(!s||s.mode!=='solo')return;
 normalize(s);
 let bar=root.querySelector('.flight-solo-color-choice');
 if(!bar){
   bar=document.createElement('section');bar.className='flight-solo-color-choice';
   bar.innerHTML='<div class="flight-solo-color-title"><b>你的顏色</b><span>單人模式：其餘三色由 AI 控制</span></div><div class="flight-solo-color-buttons"></div>';
   const anchor=root.querySelector('.flight3-head,.flight3-header,.flight3-status,.flight3-main')||root.firstElementChild;
   if(anchor?.parentNode)anchor.parentNode.insertBefore(bar,anchor.nextSibling);else root.prepend(bar);
 }
 const box=bar.querySelector('.flight-solo-color-buttons');
 box.innerHTML=COLORS.map(c=>`<button type="button" data-flight-human-color="${c}" class="${s.humanColor===c?'active':''}" aria-pressed="${s.humanColor===c?'true':'false'}"><i style="--swatch:${c==='red'?'#ff5d68':c==='yellow'?'#f5c84c':c==='blue'?'#4b8df8':'#45c98a'}"></i>${NAME[c]}</button>`).join('');
}
function scan(){const w=ws();if(!w?.cards)return;for(const card of w.cards)if(card.appId==='flight-chess'&&card.data?.flightChessV3){scanCard(card,false);const root=document.querySelector(`.desktop-card[data-card-id="${CSS.escape(card.id)}"] .flight3-app`);if(root)injectColorChoice(root,card)}}
setInterval(scan,300);
document.addEventListener('click',e=>{
 const btn=e.target.closest?.('[data-flight-human-color]');
 if(btn){const root=btn.closest('.desktop-card[data-card-id]');const card=ws()?.cards?.find(c=>c.id===root?.dataset.cardId);const s=card?.data?.flightChessV3;if(card&&s&&s.mode==='solo'){
   const color=btn.dataset.flightHumanColor;if(!COLORS.includes(color))return;
   s.humanColor=color;normalize(s);
   const target=s.players.findIndex(p=>p.color===color);
   if((+s.moves||0)===0&&s.players.every(p=>p.planes.every(pl=>pl.state==='base'))){s.turn=target;s.roll=0;s.awaitingRoll=true;s.consecutiveSix=0;s.message='你選擇'+NAME[color]+' · 由你先行'}
   persist();redraw();setTimeout(scan,60);return;
 }
 }
 if(e.target.closest?.('.flight3-app'))setTimeout(scan,80);
},true);
function style(){if(document.getElementById('flightSoloColorChoiceStyle'))return;const st=document.createElement('style');st.id='flightSoloColorChoiceStyle';st.textContent=`.flight-solo-color-choice{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:12px 14px;margin:10px 0;border:1px solid rgba(32,43,63,.09);border-radius:18px;background:rgba(255,255,255,.78);backdrop-filter:blur(14px)}.flight-solo-color-title{display:flex;flex-direction:column;gap:2px}.flight-solo-color-title b{font-size:13px}.flight-solo-color-title span{font-size:11px;opacity:.62}.flight-solo-color-buttons{display:flex;gap:7px;flex-wrap:wrap}.flight-solo-color-buttons button{display:flex;align-items:center;gap:6px;border:1px solid rgba(32,43,63,.10);background:rgba(255,255,255,.82);padding:7px 10px;border-radius:12px;font-weight:800;cursor:pointer}.flight-solo-color-buttons button i{width:11px;height:11px;border-radius:50%;background:var(--swatch);box-shadow:0 0 0 3px color-mix(in srgb,var(--swatch) 16%,transparent)}.flight-solo-color-buttons button.active{outline:2px solid var(--accent,#4b8df8);box-shadow:0 5px 16px rgba(31,46,77,.12)}@media(max-width:820px){.flight-solo-color-choice{align-items:flex-start;flex-direction:column}.flight-solo-color-buttons{width:100%;display:grid;grid-template-columns:repeat(4,1fr)}.flight-solo-color-buttons button{justify-content:center;padding:9px 4px}}`;document.head.appendChild(st)}
style();
window.WebDeskFlightChessAIController={version:VERSION,soloColorChoice:true,watchdog:true};
})();
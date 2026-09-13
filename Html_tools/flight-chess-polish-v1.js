(()=>{
'use strict';
const VERSION='20260913-flight-chess-polish-v1.1-perf';
if(window.__flightChessPolish===VERSION)return;
window.__flightChessPolish=VERSION;
const COLORS=['red','yellow','blue','green'];
const HEX={red:'#ef4444',yellow:'#facc15',blue:'#3b82f6',green:'#22c55e'};
const START={red:0,yellow:13,blue:26,green:39};
function style(){if(document.getElementById('flight-chess-polish-v1-style'))return;const s=document.createElement('style');s.id='flight-chess-polish-v1-style';s.textContent=`
.flight-app{--flight-accent:#3b82f6}
.flight-status{box-shadow:inset 4px 0 0 var(--flight-accent)}
.flight-dice{position:relative;overflow:hidden;transform:translateZ(0)}
.flight-dice:not(:disabled):active{transform:scale(.96)}
.flight-app.flight-rolling .flight-dice span{animation:flight-dice-roll .48s cubic-bezier(.2,.8,.2,1)}
@keyframes flight-dice-roll{0%{transform:rotate(0) scale(1)}25%{transform:rotate(90deg) scale(.82)}50%{transform:rotate(180deg) scale(1.1)}75%{transform:rotate(270deg) scale(.86)}100%{transform:rotate(360deg) scale(1)}}
.flight-plane.movable{outline:none}.flight-plane.movable::after{content:''}
.flight-plane.movable circle{animation:flight-plane-pulse 1.1s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
@keyframes flight-plane-pulse{50%{transform:scale(1.12)}}
.flight-plane:focus-visible circle{stroke:#111827!important;stroke-width:6!important}
.flight-cell.flight-color-red{fill:#fee2e2;stroke:#fca5a5}.flight-cell.flight-color-yellow{fill:#fef9c3;stroke:#fde047}.flight-cell.flight-color-blue{fill:#dbeafe;stroke:#93c5fd}.flight-cell.flight-color-green{fill:#dcfce7;stroke:#86efac}
.flight-cell.flight-shortcut{stroke-width:3;stroke-dasharray:5 3}
.flight-flightline{fill:none;stroke-width:5;stroke-linecap:round;stroke-dasharray:8 7;opacity:.45;pointer-events:none}
.flight-board-wrap{position:relative}.flight-turn-badge{display:none;align-items:center;gap:6px;font-size:10px;font-weight:800}.flight-turn-badge i{width:9px;height:9px;border-radius:50%;background:var(--flight-accent)}
.flight-a11y-live{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.flight-winner-banner{margin-top:6px;padding:10px 12px;border-radius:12px;background:linear-gradient(135deg,rgba(250,204,21,.20),rgba(59,130,246,.14));font-weight:850;text-align:center;box-shadow:inset 0 0 0 1px rgba(250,204,21,.32)}
@media(max-width:820px){.flight-board{width:min(100%,calc(100vw - 44px))!important;max-width:560px!important}.flight-status{position:sticky;top:0;z-index:4;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}.flight-dice{min-width:64px!important;min-height:56px!important}.flight-plane.movable{cursor:pointer}.flight-plane.movable circle{stroke-width:6}.flight-side{grid-template-columns:1fr!important}.flight-side .flight-settings{grid-column:auto!important}.flight-player{min-height:42px}.flight-settings label,.flight-settings button,.flight-settings summary{min-height:40px;align-items:center}.flight-head small{line-height:1.35}}
@media(min-width:821px) and (max-width:1180px){.flight-main{align-items:start}.flight-side{position:sticky;top:8px}.flight-board{max-width:min(66dvh,640px)}}
@media(max-width:540px){.flight-tabs{display:grid!important;grid-template-columns:1fr!important}.flight-tabs button{width:100%!important}.flight-status span{max-width:56vw;white-space:normal}.flight-card{padding:10px!important}}
@media(prefers-reduced-motion:reduce){.flight-app.flight-rolling .flight-dice span,.flight-plane.movable circle{animation:none!important}.flight-plane{transition:none!important}}
`;document.head.appendChild(s)}
function cardFor(app){const c=app.closest('.desktop-card[data-card-id]');if(!c||typeof activeWorkspace!=='function')return null;return activeWorkspace().cards.find(x=>x.id===c.dataset.cardId)||null}
function decorateTrack(app){const svg=app.querySelector('.flight-board-svg');if(!svg||svg.dataset.polished==='1')return;svg.dataset.polished='1';const cells=[...svg.querySelectorAll('.flight-cell')];cells.forEach((cell,g)=>{let owner='';for(const c of COLORS){const p=(g-START[c]+52)%52;if(p%4===2){owner=c;break}}if(owner)cell.classList.add('flight-color-'+owner);for(const c of COLORS){const p=(g-START[c]+52)%52;if(p===18){cell.classList.add('flight-shortcut');cell.style.stroke=HEX[c];break}}});
 const ns='http://www.w3.org/2000/svg';const lines=document.createElementNS(ns,'g');lines.setAttribute('aria-hidden','true');lines.innerHTML='<path class="flight-flightline" stroke="#ef4444" d="M145 300 L295 300"/><path class="flight-flightline" stroke="#facc15" d="M300 145 L300 295"/><path class="flight-flightline" stroke="#3b82f6" d="M455 300 L305 300"/><path class="flight-flightline" stroke="#22c55e" d="M300 455 L300 305"/>';const center=svg.querySelector('.flight-center');if(center)svg.insertBefore(lines,center);else svg.appendChild(lines)}
function enhancePlanes(app){app.querySelectorAll('.flight-plane').forEach(g=>{const movable=g.classList.contains('movable');if(movable){g.setAttribute('tabindex','0');g.setAttribute('role','button');g.setAttribute('aria-label','可移動飛機 '+((+g.querySelector('.flight-plane-no')?.textContent)||''));}else{g.removeAttribute('tabindex');g.removeAttribute('role')}})}
function sync(app){const card=cardFor(app),state=card?.data?.flightChess;if(!state)return;const p=state.players?.[state.turn];if(p?.color)app.style.setProperty('--flight-accent',HEX[p.color]||'#3b82f6');decorateTrack(app);enhancePlanes(app);let live=app.querySelector('.flight-a11y-live');if(!live){live=document.createElement('div');live.className='flight-a11y-live';live.setAttribute('aria-live','polite');app.appendChild(live)}if(live.textContent!==(state.message||''))live.textContent=state.message||'';const side=app.querySelector('.flight-side');if(side&&state.winner&&!side.querySelector('.flight-winner-banner')){const b=document.createElement('div');b.className='flight-winner-banner';b.textContent='🏆 '+({red:'紅方',yellow:'黃方',blue:'藍方',green:'綠方'}[state.winner]||'玩家')+' 完成全部 4 架飛機！';side.prepend(b)}}
function scan(root=document){if(root.matches?.('.flight-app'))sync(root);root.querySelectorAll?.('.flight-app').forEach(sync)}
let raf=0;
function scheduleScan(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;const canvas=document.getElementById('desktopCanvas');if(canvas)scan(canvas)})}
function boot(){style();const canvas=document.getElementById('desktopCanvas');if(canvas){scan(canvas);new MutationObserver(records=>{if(records.some(r=>r.addedNodes.length||r.removedNodes.length))scheduleScan()}).observe(canvas,{childList:true,subtree:true})}document.addEventListener('click',e=>{const r=e.target.closest?.('[data-flight-roll]');if(r){const app=r.closest('.flight-app');app?.classList.add('flight-rolling');setTimeout(()=>app?.classList.remove('flight-rolling'),520)}},true);document.addEventListener('keydown',e=>{if(!['Enter',' '].includes(e.key))return;const p=e.target.closest?.('.flight-plane.movable[data-flight-plane]');if(p){e.preventDefault();p.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}))}},true)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.WebDeskFlightChessPolish={version:VERSION,features:['dice-animation','keyboard-accessibility','colored-track','shortcut-markers','mobile-touch-polish','winner-banner','live-status','scoped-observer']};
})();
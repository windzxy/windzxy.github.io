(()=>{
'use strict';
const VERSION='20260913-flight-chess-experience-v6.0';
if(window.__webdeskFlightChessExperienceV6===VERSION)return;
window.__webdeskFlightChessExperienceV6=VERSION;
const COLORS=['red','yellow','blue','green'];
const NAME={red:'紅色',yellow:'黃色',blue:'藍色',green:'綠色'};
const HEX={red:'#ff5d68',yellow:'#f2c94c',blue:'#4b8df8',green:'#42c98a'};

function ws(){try{return activeWorkspace()}catch(_){return null}}
function cardFor(root){const el=root?.closest?.('.desktop-card[data-card-id]');return el?ws()?.cards?.find(c=>c.id===el.dataset.cardId):null}
function persist(){try{save()}catch(_){}}
function redraw(){try{if(typeof renderDesktop==='function')renderDesktop();else renderAll?.()}catch(_){}}
function setPlayers(s,mode,humanColor){
 s.mode=mode;
 s.players.forEach((p,i)=>{
  if(mode==='local')p.type='human';
  else if(mode==='duo')p.type=i<2?'human':'ai';
  else p.type=p.color===humanColor?'human':'ai';
 });
 if(mode==='solo'){
  s.humanColor=humanColor;
  const idx=s.players.findIndex(p=>p.color===humanColor);
  if(idx>=0)s.turn=idx;
 }
 s.roll=0;s.awaitingRoll=true;s.consecutiveSix=0;s.winner='';s.message=(mode==='solo'?NAME[humanColor]+'玩家先行':'準備開始 · 擲骰');
}
function resetPlanes(s){
 s.players.forEach(p=>p.planes.forEach(pl=>{pl.state='base';pl.progress=-1;pl.home=-1;pl.finished=false}));
 s.moves=0;s.roll=0;s.awaitingRoll=true;s.consecutiveSix=0;s.winner='';
}
function style(){
 if(document.getElementById('flightChessExperienceV6Style'))return;
 const el=document.createElement('style');el.id='flightChessExperienceV6Style';el.textContent=`
 .flight3-app{position:relative}
 .flight6-toolbar{display:flex;justify-content:flex-end;gap:7px;margin:0 0 8px}
 .flight6-toolbar button{border:0;background:rgba(255,255,255,.84);color:#475569;padding:7px 10px;border-radius:11px;font-size:11px;font-weight:800;box-shadow:0 4px 12px rgba(35,48,71,.08);cursor:pointer}
 .flight6-lobby{position:absolute;inset:0;z-index:60;display:grid;place-items:center;padding:18px;background:linear-gradient(145deg,rgba(232,239,249,.88),rgba(248,250,253,.94));backdrop-filter:blur(20px);border-radius:28px}
 .flight6-lobby[hidden]{display:none}
 .flight6-shell{width:min(760px,96%);max-height:94%;overflow:auto;background:rgba(255,255,255,.95);border:1px solid rgba(255,255,255,.9);box-shadow:0 32px 90px rgba(37,52,82,.24);border-radius:30px;padding:24px}
 .flight6-title{display:flex;align-items:center;gap:14px;margin-bottom:18px}.flight6-mark{width:54px;height:54px;border-radius:18px;background:linear-gradient(145deg,#477df3,#7ea5ff);display:grid;place-items:center;color:#fff;font-size:25px;box-shadow:0 12px 28px rgba(69,116,225,.28)}
 .flight6-title h2{margin:0;color:#172033;font-size:24px}.flight6-title p{margin:4px 0 0;color:#778297;font-size:12px}
 .flight6-mode-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.flight6-mode{position:relative;text-align:left;border:1px solid rgba(39,55,82,.09);background:#f7f9fc;padding:15px;border-radius:18px;cursor:pointer}.flight6-mode.active{background:#fff;border-color:#6f97f5;box-shadow:0 8px 26px rgba(76,118,220,.14)}.flight6-mode strong{display:block;font-size:14px;color:#1c273a}.flight6-mode span{display:block;margin-top:4px;color:#7a8598;font-size:11px;line-height:1.45}.flight6-mode b{position:absolute;right:10px;top:10px;font-size:9px;background:#eef3ff;color:#4771d6;padding:4px 6px;border-radius:8px}
 .flight6-section{margin-top:17px;padding-top:15px;border-top:1px solid rgba(35,48,72,.08)}.flight6-label{font-size:11px;font-weight:900;letter-spacing:.08em;color:#64748b;margin-bottom:9px}
 .flight6-colors{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.flight6-color{display:flex;align-items:center;justify-content:center;gap:7px;border:1px solid rgba(32,44,66,.09);background:#f8fafc;padding:10px;border-radius:14px;cursor:pointer;font-weight:800;color:#3b4557}.flight6-color i{width:13px;height:13px;border-radius:50%;background:var(--c);box-shadow:0 0 0 4px color-mix(in srgb,var(--c) 13%,transparent)}.flight6-color.active{background:#fff;border-color:var(--c);box-shadow:0 7px 18px color-mix(in srgb,var(--c) 14%,transparent)}
 .flight6-rules{display:grid;grid-template-columns:repeat(3,1fr);gap:7px}.flight6-rule{background:#f6f8fb;border-radius:13px;padding:10px}.flight6-rule b{display:block;color:#334155;font-size:11px}.flight6-rule small{display:block;color:#7b8799;font-size:9px;margin-top:3px;line-height:1.4}
 .flight6-actions{display:flex;gap:9px;justify-content:flex-end;margin-top:18px}.flight6-actions button{border:0;border-radius:14px;padding:12px 17px;font-weight:900;cursor:pointer}.flight6-cancel{background:#eef2f6;color:#687386}.flight6-start{background:linear-gradient(135deg,#4f7ff2,#6b96ff);color:#fff;box-shadow:0 10px 25px rgba(70,111,214,.27)}
 .flight6-toast{position:absolute;left:50%;top:88px;transform:translateX(-50%) translateY(-8px);z-index:45;opacity:0;pointer-events:none;background:rgba(20,30,47,.91);color:#fff;border-radius:999px;padding:8px 13px;font-size:11px;font-weight:800;box-shadow:0 10px 26px rgba(22,33,50,.2);transition:.2s ease;white-space:nowrap}.flight6-toast.show{opacity:1;transform:translateX(-50%) translateY(0)}
 .flight3-svg .f6-airport-runway{opacity:.46}.flight3-svg .f6-goal{filter:drop-shadow(0 4px 8px rgba(32,44,65,.12))}
 @media(max-width:820px){.flight6-lobby{position:fixed;inset:0;border-radius:0;padding:12px}.flight6-shell{width:100%;max-height:92dvh;border-radius:24px;padding:17px}.flight6-mode-grid{grid-template-columns:1fr}.flight6-colors{grid-template-columns:repeat(2,1fr)}.flight6-rules{grid-template-columns:1fr 1fr}.flight6-title h2{font-size:20px}.flight6-actions{position:sticky;bottom:0;background:linear-gradient(180deg,transparent,#fff 25%);padding-top:18px}.flight6-start{flex:1}.flight6-toast{position:fixed;top:auto;bottom:84px;max-width:88vw;overflow:hidden;text-overflow:ellipsis}}
 `;document.head.appendChild(el);
}
function decorateSvg(root){
 const svg=root.querySelector('.flight3-svg');if(!svg||svg.dataset.v6==='1')return;svg.dataset.v6='1';const ns='http://www.w3.org/2000/svg';const g=document.createElementNS(ns,'g');g.setAttribute('pointer-events','none');g.setAttribute('class','f6-decor');
 g.innerHTML=`
 <g class="f6-airport-runway" fill="none" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-dasharray="5 7">
  <path d="M95 218 L218 218"/><path d="M382 218 L505 218"/><path d="M382 382 L505 382"/><path d="M95 382 L218 382"/>
 </g>
 <g class="f6-goal" transform="translate(300 300)">
  <path d="M0 0 L-47 -47 A66 66 0 0 1 47 -47 Z" fill="#f2c94c" fill-opacity=".22"/>
  <path d="M0 0 L47 -47 A66 66 0 0 1 47 47 Z" fill="#4b8df8" fill-opacity=".22"/>
  <path d="M0 0 L47 47 A66 66 0 0 1 -47 47 Z" fill="#42c98a" fill-opacity=".22"/>
  <path d="M0 0 L-47 47 A66 66 0 0 1 -47 -47 Z" fill="#ff5d68" fill-opacity=".22"/>
  <circle r="29" fill="white" fill-opacity=".93" stroke="rgba(40,52,72,.1)"/>
  <path d="M-13 3 L11 0 L1 -5 L4 -16 L-2 -16 L-8 -5 L-17 -1 Z" fill="#52627a" fill-opacity=".72"/>
 </g>`;
 const firstInteractive=svg.querySelector('.flight3-plane');if(firstInteractive)svg.insertBefore(g,firstInteractive);else svg.appendChild(g);
}
function lobbyMarkup(){return `
 <div class="flight6-lobby" hidden>
  <div class="flight6-shell">
   <div class="flight6-title"><div class="flight6-mark">✈</div><div><h2>飛行棋</h2><p>選擇玩法，準備起飛</p></div></div>
   <div class="flight6-mode-grid">
    <button class="flight6-mode active" data-f6-mode="solo"><b>推薦</b><strong>單人挑戰</strong><span>你選一種顏色，其餘三方由 AI 控制。</span></button>
    <button class="flight6-mode" data-f6-mode="duo"><strong>雙人對戰</strong><span>兩位真人輪流操作，另外兩方由 AI 控制。</span></button>
    <button class="flight6-mode" data-f6-mode="local"><strong>四人同樂</strong><span>四個顏色全部由真人在同一裝置輪流操作。</span></button>
   </div>
   <div class="flight6-section" data-f6-color-section><div class="flight6-label">選擇你的顏色</div><div class="flight6-colors">${COLORS.map((c,i)=>`<button class="flight6-color ${i===0?'active':''}" style="--c:${HEX[c]}" data-f6-color="${c}"><i></i>${NAME[c]}</button>`).join('')}</div></div>
   <div class="flight6-section"><div class="flight6-label">經典規則</div><div class="flight6-rules"><div class="flight6-rule"><b>5 / 6 起飛</b><small>機場中的飛機可以進入航道。</small></div><div class="flight6-rule"><b>6 再擲一次</b><small>連續三次 6 取消本回合。</small></div><div class="flight6-rule"><b>同色跳躍</b><small>落在己方同色格可前跳 4 格。</small></div><div class="flight6-rule"><b>飛行捷徑</b><small>指定飛行點可跨越中央航線。</small></div><div class="flight6-rule"><b>撞機</b><small>非安全格落在敵機位置可將其送回機場。</small></div><div class="flight6-rule"><b>精確到達</b><small>進入終點航道後需剛好點數抵達。</small></div></div></div>
   <div class="flight6-actions"><button class="flight6-cancel" data-f6-cancel>繼續目前棋局</button><button class="flight6-start" data-f6-start>開始新遊戲</button></div>
  </div>
 </div>`}
function enhance(root){
 if(!root||root.dataset.v6==='1')return;root.dataset.v6='1';
 decorateSvg(root);
 const toolbar=document.createElement('div');toolbar.className='flight6-toolbar';toolbar.innerHTML='<button type="button" data-f6-open>⚙ 遊戲設定</button>';
 root.prepend(toolbar);
 root.insertAdjacentHTML('beforeend',lobbyMarkup()+'<div class="flight6-toast" aria-live="polite"></div>');
 const card=cardFor(root),s=card?.data?.flightChessV3;if(!s)return;
 const lobby=root.querySelector('.flight6-lobby');
 if(!card.data.flightChessV6Seen && (+s.moves||0)===0){lobby.hidden=false;}
 root.addEventListener('click',e=>{
  const mode=e.target.closest('[data-f6-mode]');if(mode){root.querySelectorAll('[data-f6-mode]').forEach(x=>x.classList.toggle('active',x===mode));root.querySelector('[data-f6-color-section]').style.display=mode.dataset.f6Mode==='solo'?'block':'none';return}
  const color=e.target.closest('[data-f6-color]');if(color){root.querySelectorAll('[data-f6-color]').forEach(x=>x.classList.toggle('active',x===color));return}
  if(e.target.closest('[data-f6-open]')){lobby.hidden=false;return}
  if(e.target.closest('[data-f6-cancel]')){card.data.flightChessV6Seen=true;persist();lobby.hidden=true;return}
  if(e.target.closest('[data-f6-start]')){const m=root.querySelector('[data-f6-mode].active')?.dataset.f6Mode||'solo';const c=root.querySelector('[data-f6-color].active')?.dataset.f6Color||'red';resetPlanes(s);setPlayers(s,m,c);card.data.flightChessV6Seen=true;persist();lobby.hidden=true;redraw();return}
 });
 let last='';const tick=()=>{const c=cardFor(root),q=c?.data?.flightChessV3;if(!q)return;if(q.message&&q.message!==last){last=q.message;const t=root.querySelector('.flight6-toast');if(t){t.textContent=q.message;t.classList.add('show');clearTimeout(t._hide);t._hide=setTimeout(()=>t.classList.remove('show'),1300)}}};root._f6Timer=setInterval(tick,260);
}
function scan(root=document){root.querySelectorAll?.('.flight3-app').forEach(enhance);if(root.matches?.('.flight3-app'))enhance(root)}
function boot(){style();scan(document);const host=document.getElementById('desktopCanvas');if(!host)return;let raf=0;new MutationObserver(ms=>{if(raf)return;raf=requestAnimationFrame(()=>{raf=0;for(const m of ms)for(const n of m.addedNodes)if(n.nodeType===1)scan(n)})}).observe(host,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.WebDeskFlightChessExperienceV6={version:VERSION,lobby:true,soloColorChoice:true,productFlow:true,scopedObserver:true};
})();
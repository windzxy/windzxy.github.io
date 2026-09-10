(()=>{
'use strict';
const VER='20260910-boardgame-polish-v2.0';
if(window.__windzxyBoardgamePolishV2===VER)return;
window.__windzxyBoardgamePolishV2=VER;

const PIECE_INFO={
 k:{name:'國王',en:'King',move:'每次可向任意方向移動一格。',rule:'國王不能走到受攻擊的格子。被將軍時必須立即解除；符合條件時可與車進行王車易位。'},
 q:{name:'皇后',en:'Queen',move:'可沿橫線、直線或斜線移動任意格。',rule:'路徑不能穿過其他棋子。皇后結合了車與象的走法，是最強的長程棋子。'},
 r:{name:'車',en:'Rook',move:'可沿橫線或直線移動任意格。',rule:'路徑不能穿過其他棋子；在條件符合時可與國王完成王車易位。'},
 b:{name:'象',en:'Bishop',move:'可沿斜線移動任意格。',rule:'路徑不能穿過其他棋子；一枚象整局都只會停留在同一顏色的格子上。'},
 n:{name:'馬',en:'Knight',move:'走「日」字：先兩格再垂直一格，形成 L 形。',rule:'馬是唯一可以跳過其他棋子的棋子；每次落點顏色都會改變。'},
 p:{name:'兵',en:'Pawn',move:'通常向前一格；首次移動可選擇前進兩格；吃子時向前斜一格。',rule:'可吃過路兵；到達最遠一排必須升變為皇后、車、象或馬。'}
};

function svg(code){
  const t=String(code||'').toLowerCase();
  const common='fill="currentColor" stroke="var(--piece-edge)" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"';
  let body='';
  if(t==='p') body='<circle cx="50" cy="27" r="13" '+common+'/><path d="M39 42h22c-2 8-6 14-10 18 9 5 15 13 17 24H32c2-11 8-19 17-24-4-4-8-10-10-18Z" '+common+'/><path d="M27 84h46l5 9H22Z" '+common+'/>';
  else if(t==='r') body='<path d="M25 18h12v10h10V18h10v10h10V18h10v22l-8 7 5 34H26l5-34-6-7Z" '+common+'/><path d="M22 81h56l5 12H17Z" '+common+'/>';
  else if(t==='n') body='<path d="M29 85c3-19 8-31 18-40l-8-4 10-24 22 11c7 4 11 12 10 23-6-4-12-5-18-3 7 9 10 21 10 37H29Z" '+common+'/><circle cx="64" cy="34" r="2.7" fill="var(--piece-edge)"/><path d="M24 85h54l5 8H19Z" '+common+'/>';
  else if(t==='b') body='<path d="M50 14c10 8 17 18 17 29 0 8-4 14-10 18 7 6 11 13 13 23H30c2-10 6-17 13-23-6-4-10-10-10-18 0-11 7-21 17-29Z" '+common+'/><path d="M51 25 43 47" fill="none" stroke="var(--piece-edge)" stroke-width="4"/><path d="M25 84h50l6 9H19Z" '+common+'/>';
  else if(t==='q') body='<circle cx="23" cy="24" r="5" '+common+'/><circle cx="41" cy="17" r="5" '+common+'/><circle cx="59" cy="17" r="5" '+common+'/><circle cx="77" cy="24" r="5" '+common+'/><path d="M23 30 34 65h32l11-35-18 15-9-22-9 22Z" '+common+'/><path d="M30 65h40l4 18H26Z" '+common+'/><path d="M21 83h58l5 10H16Z" '+common+'/>';
  else body='<path d="M46 10h8v11h11v8H54v11h-8V29H35v-8h11Z" '+common+'/><path d="M34 42c5-8 27-8 32 0l-7 14c8 7 12 16 14 28H27c2-12 6-21 14-28Z" '+common+'/><path d="M22 84h56l6 9H16Z" '+common+'/>';
  return '<svg class="chess-piece-svg" viewBox="0 0 100 100" aria-hidden="true" focusable="false">'+body+'</svg>';
}

function getCard(node){
  const el=node?.closest?.('.desktop-card[data-card-id]');
  if(!el||typeof activeWorkspace!=='function')return null;
  return activeWorkspace().cards.find(c=>c.id===el.dataset.cardId)||null;
}
function redraw(){try{save()}catch(_){}try{if(typeof renderDesktop==='function')renderDesktop();else renderAll()}catch(_){try{renderAll()}catch(__){}}}
function pieceCode(square){
  const label=square?.getAttribute('aria-label')||'';
  const m=label.match(/\s([KQRBNPkqrbnp])$/);
  return m?.[1]||'';
}
function isTutorial(app){return !!app?.querySelector('[data-chess-mode="tutorial"].active')}
function cardIdFrom(node){return node?.closest?.('.desktop-card[data-card-id]')?.dataset?.cardId||''}

function installStyle(){
  if(document.getElementById('boardgame-polish-v2-style'))return;
  const st=document.createElement('style');st.id='boardgame-polish-v2-style';st.textContent=`
.chess-board{grid-template-columns:repeat(8,minmax(0,1fr))!important;grid-template-rows:repeat(8,minmax(0,1fr))!important;align-items:stretch!important;justify-items:stretch!important;background:#b58863!important;border:1px solid rgba(15,23,42,.24);box-sizing:border-box}
.chess-square{width:100%!important;height:100%!important;min-width:0!important;min-height:0!important;overflow:visible;line-height:1}
.chess-square.light{background:#f0d9b5!important}.chess-square.dark{background:#b58863!important}
.chess-piece{--piece-edge:#202a35;width:78%;height:78%;display:grid!important;place-items:center;font-size:0!important;line-height:0!important;filter:drop-shadow(0 2px 1px rgba(0,0,0,.22))!important;transform:translateZ(0)}
.chess-piece.white{color:#f8f5ed!important;--piece-edge:#4b5563;text-shadow:none!important}.chess-piece.black{color:#17202a!important;--piece-edge:#05090e}.chess-piece-svg{width:100%;height:100%;display:block}
.chess-square>small{inset:0!important;pointer-events:none;font:800 clamp(7px,.72vw,10px)/1 system-ui!important;color:inherit!important;opacity:.58}.chess-rank{position:absolute;left:4px;top:4px}.chess-file{position:absolute;right:4px;bottom:4px}.chess-square.light .chess-rank,.chess-square.light .chess-file{color:#8a5c3d}.chess-square.dark .chess-rank,.chess-square.dark .chess-file{color:#f0d9b5}
.chess-teach-tooltip{position:absolute;z-index:30;width:min(238px,42%);box-sizing:border-box;padding:10px 11px;border-radius:12px;background:rgba(15,23,42,.96);color:#f8fafc;box-shadow:0 16px 38px rgba(0,0,0,.38);border:1px solid rgba(148,163,184,.24);backdrop-filter:blur(12px);text-align:left;pointer-events:auto}.chess-teach-tooltip.tip-right{left:calc(var(--sq-col)*12.5% + 12.5%);}.chess-teach-tooltip.tip-left{right:calc((7 - var(--sq-col))*12.5% + 12.5%)}.chess-teach-tooltip.tip-down{top:calc(var(--sq-row)*12.5% + 10%)}.chess-teach-tooltip.tip-up{bottom:calc((7 - var(--sq-row))*12.5% + 10%)}
.chess-tip-head{display:grid;grid-template-columns:38px 1fr 22px;align-items:center;gap:8px;margin-bottom:7px}.chess-tip-icon{width:38px;height:38px;display:grid;place-items:center;color:#f8f5ed;--piece-edge:#475569}.chess-tip-icon .chess-piece-svg{width:36px;height:36px}.chess-tip-head strong{font-size:14px;line-height:1.15}.chess-tip-head small{display:block;margin-top:2px;font-size:9px;opacity:.58}.chess-tip-close{width:22px;height:22px;border:0;border-radius:7px;background:rgba(255,255,255,.08);color:inherit;cursor:pointer}.chess-tip-row{display:grid;grid-template-columns:34px 1fr;gap:7px;padding:5px 0;border-top:1px solid rgba(148,163,184,.14);font-size:10px;line-height:1.45}.chess-tip-row b{color:#7dd3fc}.chess-tutor-hint{font-size:9px!important;opacity:.66!important;padding:3px 7px;border-radius:999px;background:rgba(56,189,248,.10);border:1px solid rgba(56,189,248,.16)}
.game-setting select[data-chess-difficulty],.game-setting select[data-gomoku-difficulty]{display:none!important}.board-difficulty-seg{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:5px;margin-top:7px}.board-difficulty-seg button{border:1px solid rgba(127,127,127,.22);border-radius:9px;padding:8px 6px;background:rgba(127,127,127,.08);color:inherit;font:750 11px/1 system-ui;cursor:pointer}.board-difficulty-seg button.active{background:rgba(56,189,248,.18);border-color:rgba(56,189,248,.45);box-shadow:inset 0 0 0 1px rgba(56,189,248,.12)}
@media(max-width:760px){.chess-piece{width:80%;height:80%}.chess-teach-tooltip{left:5%!important;right:5%!important;bottom:5%!important;top:auto!important;width:90%!important}.chess-tip-row{font-size:9px}.board-difficulty-seg button{padding:9px 4px}}
`;
  document.head.appendChild(st);
}

function replaceCoords(app){
  app.querySelectorAll('.chess-square').forEach((sq,i)=>{
    let sm=sq.querySelector(':scope > small');if(!sm)return;
    const r=Math.floor(i/8),c=i%8;
    const parts=[];
    if(c===0)parts.push('<span class="chess-rank">'+(8-r)+'</span>');
    if(r===7)parts.push('<span class="chess-file">'+String.fromCharCode(97+c)+'</span>');
    sm.innerHTML=parts.join('');
  });
}
function replacePieces(app){
  app.querySelectorAll('.chess-square').forEach(sq=>{
    const span=sq.querySelector('.chess-piece');if(!span||span.dataset.polished==='1')return;
    const code=pieceCode(sq);if(!code)return;
    span.dataset.polished='1';span.dataset.piece=code;span.innerHTML=svg(code);
  });
}
function diffLabel(v){return v==='easy'?'簡單':v==='hard'?'困難':'標準'}
function replaceDifficulty(app,kind){
  const sel=app.querySelector(kind==='chess'?'select[data-chess-difficulty]':'select[data-gomoku-difficulty]');
  if(!sel||sel.dataset.polished==='1')return;
  sel.dataset.polished='1';
  const seg=document.createElement('div');seg.className='board-difficulty-seg';seg.setAttribute('role','group');seg.setAttribute('aria-label','難度');
  seg.innerHTML=['easy','normal','hard'].map(v=>'<button type="button" data-board-difficulty="'+v+'" data-board-kind="'+kind+'" class="'+(sel.value===v?'active':'')+'">'+diffLabel(v)+'</button>').join('');
  sel.insertAdjacentElement('afterend',seg);
}
function addTutorHint(app){
  const status=app.querySelector('.chess-status');if(!status)return;
  status.querySelector('.chess-tutor-hint')?.remove();
  if(isTutorial(app)){const el=document.createElement('span');el.className='chess-tutor-hint';el.textContent='點棋子查看名稱、走法與規則';status.appendChild(el)}
}
function enhance(root=document){
  root.querySelectorAll?.('.chess-app').forEach(app=>{replaceCoords(app);replacePieces(app);replaceDifficulty(app,'chess');addTutorHint(app)});
  root.querySelectorAll?.('.gomoku-app').forEach(app=>replaceDifficulty(app,'gomoku'));
}

function showTip(cardId,sqIndex,code){
  const card=document.querySelector('.desktop-card[data-card-id="'+CSS.escape(cardId)+'"]');
  const app=card?.querySelector('.chess-app');if(!app||!isTutorial(app))return;
  const board=app.querySelector('.chess-board');if(!board)return;
  board.querySelector('.chess-teach-tooltip')?.remove();
  if(!code)return;
  const info=PIECE_INFO[code.toLowerCase()];if(!info)return;
  const white=code===code.toUpperCase(),r=Math.floor(sqIndex/8),c=sqIndex%8;
  const tip=document.createElement('div');
  tip.className='chess-teach-tooltip '+(c<4?'tip-right':'tip-left')+' '+(r<4?'tip-down':'tip-up');
  tip.style.setProperty('--sq-row',r);tip.style.setProperty('--sq-col',c);
  tip.innerHTML='<div class="chess-tip-head"><span class="chess-tip-icon">'+svg(code)+'</span><div><strong>'+(white?'白方 ':'黑方 ')+info.name+'</strong><small>'+info.en+' · '+String.fromCharCode(97+c)+(8-r)+'</small></div><button type="button" class="chess-tip-close" data-chess-tip-close aria-label="關閉">×</button></div><div class="chess-tip-row"><b>走法</b><span>'+info.move+'</span></div><div class="chess-tip-row"><b>規則</b><span>'+info.rule+'</span></div>';
  board.appendChild(tip);
}

function bind(){
  if(document.documentElement.dataset.boardgamePolishV2Bound==='1')return;
  document.documentElement.dataset.boardgamePolishV2Bound='1';
  document.addEventListener('click',e=>{
    const close=e.target.closest?.('[data-chess-tip-close]');if(close){e.preventDefault();e.stopPropagation();close.closest('.chess-teach-tooltip')?.remove();return}
    const d=e.target.closest?.('[data-board-difficulty]');
    if(d){e.preventDefault();e.stopPropagation();const card=getCard(d);if(!card)return;const kind=d.dataset.boardKind,state=kind==='chess'?card.data?.chess:card.data?.gomoku;if(state){state.difficulty=d.dataset.boardDifficulty;redraw()}return}
    const sq=e.target.closest?.('.chess-app [data-chess-square]');if(!sq)return;
    const app=sq.closest('.chess-app');if(!isTutorial(app))return;
    const cardId=cardIdFrom(sq),idx=+sq.dataset.chessSquare,code=pieceCode(sq);
    setTimeout(()=>showTip(cardId,idx,code),0);
  },true);
}

function boot(){
  installStyle();enhance();bind();
  const mo=new MutationObserver(records=>{for(const r of records){for(const n of r.addedNodes){if(n.nodeType===1){if(n.matches?.('.chess-app,.gomoku-app')||n.querySelector?.('.chess-app,.gomoku-app')){queueMicrotask(()=>enhance(n.matches?.('.chess-app,.gomoku-app')?n.parentNode:n));return}}}}});
  mo.observe(document.body,{childList:true,subtree:true});
  setInterval(()=>enhance(),1200);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.WebDeskBoardgamePolishV2={version:VER,chess:{squareGeometry:'strict-8x8',pieceArt:'inline-svg',tutorialPieceTooltips:true},difficultyControl:'segmented-no-native-select'};
})();
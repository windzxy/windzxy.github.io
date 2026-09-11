(()=>{
'use strict';
const VERSION='20260911-xiangqi-interaction-fix-v1.2-segmented-difficulty';
const START=['r','n','b','a','k','a','b','n','r',null,null,null,null,null,null,null,null,null,null,'c',null,null,null,null,null,'c',null,'p',null,'p',null,'p',null,'p',null,'p',null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,'P',null,'P',null,'P',null,'P',null,'P',null,'C',null,null,null,null,null,'C',null,null,null,null,null,null,null,null,null,'R','N','B','A','K','A','B','N','R'];
let lastPointerAt=0;
function currentCard(target){
  const host=target?.closest?.('.desktop-card[data-card-id]');
  if(!host||typeof activeWorkspace!=='function')return null;
  return activeWorkspace().cards.find(c=>c.id===host.dataset.cardId&&c.appId==='xiangqi')||null;
}
function state(card){
  card.data=card.data||{};
  let s=card.data.xiangqi;
  if(!s||!Array.isArray(s.board)||s.board.length!==90){
    s=card.data.xiangqi={board:START.slice(),turn:'r',selected:-1,history:[],mode:'ai',difficulty:'entry',lesson:0,thinking:false,winner:'',section:'learn'};
  }
  if(!Array.isArray(s.history))s.history=[];
  if(!['entry','club','competition'].includes(s.difficulty))s.difficulty='entry';
  return s;
}
function saveAndRender(){
  try{if(typeof save==='function')save()}catch(_){ }
  try{if(typeof renderDesktop==='function')renderDesktop();else if(typeof renderAll==='function')renderAll()}catch(_){try{if(typeof renderAll==='function')renderAll()}catch(__){ }}
  queueMicrotask(syncUI);
}
function resetBoard(s){
  s.board=START.slice();s.turn='r';s.selected=-1;s.history=[];s.winner='';s.thinking=false;
}
function installStyle(){
  if(document.getElementById('xq-interaction-fix-style'))return;
  const style=document.createElement('style');
  style.id='xq-interaction-fix-style';
  style.textContent=`
    .desktop-card.t-xiangqi .xq-card select[data-xq-difficulty]{display:none!important}
    .desktop-card.t-xiangqi .xq-difficulty-seg{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin-top:8px}
    .desktop-card.t-xiangqi .xq-difficulty-seg button{min-width:0;border:1px solid rgba(148,163,184,.22);border-radius:10px;padding:9px 6px;background:rgba(127,127,127,.08);color:inherit;font-weight:750;cursor:pointer;white-space:nowrap}
    .desktop-card.t-xiangqi .xq-difficulty-seg button.active{background:rgba(56,189,248,.18);border-color:rgba(56,189,248,.52);box-shadow:inset 0 0 0 1px rgba(56,189,248,.16)}
    .desktop-card.t-xiangqi .xq-card label{gap:4px}
    .desktop-card.t-xiangqi .xq-card label>span.xq-level-label{font-size:11px;opacity:.72}
    .desktop-card.t-xiangqi .xq-side{min-width:0}
    .desktop-card.t-xiangqi .xq-card{overflow:visible}
    @media(max-width:760px){.desktop-card.t-xiangqi .xq-difficulty-seg{grid-template-columns:1fr 1fr 1fr}.desktop-card.t-xiangqi .xq-difficulty-seg button{font-size:12px;padding:9px 4px}}
  `;
  document.head.appendChild(style);
}
function ensureDifficultyUI(app,s){
  const select=app.querySelector('select[data-xq-difficulty]');
  if(!select)return;
  const label=select.closest('label');
  if(label&&!label.querySelector('.xq-level-label')){
    const txt=document.createElement('span');txt.className='xq-level-label';txt.textContent='級別';
    label.childNodes.forEach(n=>{if(n.nodeType===3&&n.textContent.trim()==='級別')n.textContent=''});
    label.insertBefore(txt,label.firstChild);
  }
  let seg=label?.querySelector('.xq-difficulty-seg');
  if(!seg){
    seg=document.createElement('div');seg.className='xq-difficulty-seg';
    seg.innerHTML='<button type="button" data-xq-diff="entry">啟蒙</button><button type="button" data-xq-diff="club">中級考級</button><button type="button" data-xq-diff="competition">競賽</button>';
    select.after(seg);
  }
  seg.querySelectorAll('[data-xq-diff]').forEach(btn=>{
    const on=btn.dataset.xqDiff===s.difficulty;
    btn.classList.toggle('active',on);btn.setAttribute('aria-pressed',on?'true':'false');
  });
}
function syncUI(){
  document.querySelectorAll('.desktop-card[data-card-id] .xq-app').forEach(app=>{
    const card=currentCard(app);if(!card)return;
    const s=state(card);
    app.querySelectorAll('[data-xq-mode]').forEach(btn=>{
      const m=btn.dataset.xqMode;
      const on=s.section==='play'?(m===s.mode):(m===s.section);
      btn.classList.toggle('active',on);
      btn.setAttribute('aria-pressed',on?'true':'false');
    });
    ensureDifficultyUI(app,s);
  });
}
function handleMode(btn,ev){
  const card=currentCard(btn);if(!card)return false;
  const s=state(card),m=btn.dataset.xqMode;
  if(!['learn','ai','pvp','endgame','scores'].includes(m))return false;
  ev?.preventDefault?.();ev?.stopImmediatePropagation?.();
  if(m==='ai'||m==='pvp'){
    s.mode=m;s.section='play';resetBoard(s);
  }else{
    s.section=m;s.selected=-1;s.thinking=false;
  }
  saveAndRender();
  return true;
}
function handleLesson(btn,ev){
  const card=currentCard(btn);if(!card)return false;
  const s=state(card);
  ev?.preventDefault?.();ev?.stopImmediatePropagation?.();
  const total=8,dir=btn.dataset.xqLesson==='next'?1:-1;
  s.lesson=((Number(s.lesson)||0)+dir+total)%total;s.section='learn';
  saveAndRender();return true;
}
function handleDifficulty(btn,ev){
  const card=currentCard(btn);if(!card)return false;
  const s=state(card),value=btn.dataset.xqDiff;
  if(!['entry','club','competition'].includes(value))return false;
  ev?.preventDefault?.();ev?.stopImmediatePropagation?.();
  s.difficulty=value;
  try{if(typeof save==='function')save()}catch(_){ }
  syncUI();
  return true;
}
function route(ev){
  const diff=ev.target?.closest?.('[data-xq-diff]');if(diff)return handleDifficulty(diff,ev);
  const mode=ev.target?.closest?.('[data-xq-mode]');if(mode)return handleMode(mode,ev);
  const lesson=ev.target?.closest?.('[data-xq-lesson]');if(lesson)return handleLesson(lesson,ev);
  return false;
}
document.addEventListener('pointerup',ev=>{
  if(ev.button!==undefined&&ev.button!==0)return;
  if(route(ev))lastPointerAt=Date.now();
},true);
document.addEventListener('click',ev=>{
  if(Date.now()-lastPointerAt<500)return;
  route(ev);
},true);
document.addEventListener('change',ev=>{
  const select=ev.target?.closest?.('select[data-xq-difficulty]');if(!select)return;
  const card=currentCard(select);if(!card)return;
  const s=state(card);if(['entry','club','competition'].includes(select.value)){s.difficulty=select.value;try{if(typeof save==='function')save()}catch(_){ }syncUI()}
},true);
const observer=new MutationObserver(()=>queueMicrotask(syncUI));
observer.observe(document.documentElement,{subtree:true,childList:true});
function boot(){installStyle();syncUI()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.WebDeskXiangqiInteractionFix={version:VERSION,modeButtons:true,lessonButtons:true,exclusiveActiveTab:true,segmentedDifficulty:true};
})();
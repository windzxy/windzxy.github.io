(()=>{
'use strict';
const VERSION='20260911-xiangqi-interaction-fix-v1.0';
const START=['r','n','b','a','k','a','b','n','r',null,null,null,null,null,null,null,null,'c',null,null,null,null,null,'c',null,'p',null,'p',null,'p',null,'p',null,'p',null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,'P',null,'P',null,'P',null,'P',null,'P',null,'C',null,null,null,null,null,'C',null,null,null,null,null,null,null,null,'R','N','B','A','K','A','B','N','R'];
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
  return s;
}
function saveAndRender(){
  try{if(typeof save==='function')save()}catch(_){ }
  try{if(typeof renderDesktop==='function')renderDesktop();else if(typeof renderAll==='function')renderAll()}catch(_){try{if(typeof renderAll==='function')renderAll()}catch(__){ }}
  queueMicrotask(syncTabs);
}
function resetBoard(s){
  s.board=START.slice();s.turn='r';s.selected=-1;s.history=[];s.winner='';s.thinking=false;
}
function syncTabs(){
  document.querySelectorAll('.desktop-card[data-card-id] .xq-app').forEach(app=>{
    const card=currentCard(app);if(!card)return;
    const s=state(card);
    app.querySelectorAll('[data-xq-mode]').forEach(btn=>{
      const m=btn.dataset.xqMode;
      const on=s.section==='play'?(m===s.mode):(m===s.section);
      btn.classList.toggle('active',on);
      btn.setAttribute('aria-pressed',on?'true':'false');
    });
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
function route(ev){
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
const observer=new MutationObserver(()=>queueMicrotask(syncTabs));
observer.observe(document.documentElement,{subtree:true,childList:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',syncTabs,{once:true});else syncTabs();
window.WebDeskXiangqiInteractionFix={version:VERSION,modeButtons:true,lessonButtons:true,exclusiveActiveTab:true};
})();
(()=>{
'use strict';
const VERSION='20260913-webdesk-mobile-antiflicker-v1.0';
if(window.__webdeskMobileAntiFlicker===VERSION)return;
window.__webdeskMobileAntiFlicker=VERSION;
let activeId='';

function installStyle(){
  if(document.getElementById('webdesk-mobile-antiflicker-v1-style'))return;
  const s=document.createElement('style');
  s.id='webdesk-mobile-antiflicker-v1-style';
  s.textContent=`
  @media (max-width:820px){
    .desktop-card.mobile-active-card{animation:none!important;transition:none!important}
    .desktop-card.mobile-active-card .gomoku-board,
    .desktop-card.mobile-active-card .chess-board,
    .desktop-card.mobile-active-card .xq-board{animation:none!important}
  }
  `;
  document.head.appendChild(s);
}
function cardId(node){
  if(!node||node.nodeType!==1)return'';
  const c=node.matches?.('.desktop-card[data-card-id]')?node:node.querySelector?.('.desktop-card[data-card-id]');
  return c?.dataset?.cardId||'';
}
function remember(){
  const c=document.querySelector('#desktopCanvas .desktop-card.mobile-active-card[data-card-id]');
  if(c)activeId=c.dataset.cardId||'';
}
function activateNow(){
  if(innerWidth>820)return;
  const list=[...document.querySelectorAll('#desktopCanvas .desktop-card[data-card-id]')];
  if(!list.length)return;
  let target=activeId?list.find(c=>c.dataset.cardId===activeId):null;
  if(!target){
    target=list.find(c=>c.classList.contains('mobile-active-card'))||list[0];
    activeId=target.dataset.cardId||'';
  }
  list.forEach(c=>c.classList.toggle('mobile-active-card',c===target));
}
function boot(){
  installStyle();remember();activateNow();
  const canvas=document.getElementById('desktopCanvas');
  if(!canvas)return;
  canvas.addEventListener('pointerdown',e=>{
    const c=e.target.closest?.('.desktop-card[data-card-id]');
    if(c)activeId=c.dataset.cardId||activeId;
  },true);
  new MutationObserver(records=>{
    if(innerWidth>820)return;
    for(const r of records){
      for(const n of r.removedNodes){
        if(n.nodeType!==1)continue;
        const c=n.matches?.('.desktop-card.mobile-active-card[data-card-id]')?n:n.querySelector?.('.desktop-card.mobile-active-card[data-card-id]');
        if(c?.dataset?.cardId)activeId=c.dataset.cardId;
      }
    }
    // MutationObserver runs before the next paint, so restore visibility synchronously.
    activateNow();
  }).observe(canvas,{childList:true,subtree:false});
  window.addEventListener('resize',()=>{if(innerWidth<=820)activateNow()},{passive:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.WebDeskMobileAntiFlicker={version:VERSION};
})();
(()=>{
'use strict';
const VERSION='20260912-webdesk-mobile-responsive-v2.0-safe-dock-fluid-games';
if(window.__webdeskMobileResponsive===VERSION)return;
window.__webdeskMobileResponsive=VERSION;

function installStyle(){
  if(document.getElementById('webdesk-mobile-responsive-v2-style'))return;
  const s=document.createElement('style');
  s.id='webdesk-mobile-responsive-v2-style';
  s.textContent=`
  .webdesk-mobile-fab{display:none}
  @media (max-width:820px){
    html,body{overflow-x:hidden!important}
    .desktop-dock{
      position:fixed!important;
      right:max(10px,env(safe-area-inset-right))!important;
      bottom:max(82px,calc(env(safe-area-inset-bottom) + 76px))!important;
      z-index:12020!important;
      display:flex!important;
      flex-direction:column!important;
      gap:8px!important;
      padding:9px!important;
      border-radius:20px!important;
      background:rgba(250,250,250,.94)!important;
      box-shadow:0 16px 40px rgba(0,0,0,.28)!important;
      backdrop-filter:blur(16px) saturate(1.2)!important;
      -webkit-backdrop-filter:blur(16px) saturate(1.2)!important;
      transform:translateX(calc(100% + 34px))!important;
      opacity:0!important;
      visibility:hidden!important;
      pointer-events:none!important;
      transition:transform .22s cubic-bezier(.2,.8,.2,1),opacity .18s ease,visibility .18s ease!important;
    }
    html[data-theme='dark'] .desktop-dock{background:rgba(24,28,36,.94)!important}
    body.webdesk-dock-open .desktop-dock{
      transform:translateX(0)!important;
      opacity:1!important;
      visibility:visible!important;
      pointer-events:auto!important;
    }
    .desktop-dock button{width:48px!important;height:48px!important;min-width:48px!important;min-height:48px!important;border-radius:14px!important}
    .webdesk-mobile-fab{
      display:flex!important;
      position:fixed!important;
      right:max(12px,env(safe-area-inset-right))!important;
      bottom:max(18px,calc(env(safe-area-inset-bottom) + 12px))!important;
      width:54px!important;height:54px!important;
      z-index:12021!important;
      align-items:center!important;justify-content:center!important;
      border:0!important;border-radius:18px!important;
      background:linear-gradient(145deg,#ff9800,#ff7a00)!important;
      color:#fff!important;font:800 26px/1 system-ui!important;
      box-shadow:0 12px 30px rgba(0,0,0,.28)!important;
      touch-action:manipulation!important;
      -webkit-tap-highlight-color:transparent!important;
    }
    body.webdesk-dock-open .webdesk-mobile-fab{transform:rotate(45deg)!important}

    /* Game cards use the phone viewport instead of desktop saved geometry. */
    .desktop-card.t-gomoku,.desktop-card.t-chess,.desktop-card.t-xiangqi{
      left:max(6px,env(safe-area-inset-left))!important;
      top:max(6px,env(safe-area-inset-top))!important;
      width:calc(100vw - max(12px,env(safe-area-inset-left) + env(safe-area-inset-right)))!important;
      max-width:calc(100vw - max(12px,env(safe-area-inset-left) + env(safe-area-inset-right)))!important;
      height:calc(100dvh - max(12px,env(safe-area-inset-top) + env(safe-area-inset-bottom)))!important;
      max-height:calc(100dvh - max(12px,env(safe-area-inset-top) + env(safe-area-inset-bottom)))!important;
      min-width:0!important;min-height:0!important;
      border-radius:20px!important;
      overflow:hidden!important;
    }
    .desktop-card.t-gomoku .card-body,.desktop-card.t-chess .card-body,.desktop-card.t-xiangqi .card-body,
    .desktop-card.t-gomoku .card-content,.desktop-card.t-chess .card-content,.desktop-card.t-xiangqi .card-content{
      min-width:0!important;width:100%!important;max-width:100%!important;overflow:auto!important;
    }
    .gomoku-app,.chess-app,.xq-app{width:100%!important;max-width:100%!important;box-sizing:border-box!important;overflow:auto!important}
    .gomoku-main,.chess-main,.xq-main{grid-template-columns:minmax(0,1fr)!important;width:100%!important;min-width:0!important}
    .gomoku-board,.chess-board,.xq-board{
      width:min(100%,calc(100vw - 34px))!important;
      max-width:100%!important;
      margin-left:auto!important;margin-right:auto!important;
      box-sizing:border-box!important;
    }
    .gomoku-board{aspect-ratio:1!important}
    .chess-board{aspect-ratio:1!important}
    .xq-board{aspect-ratio:9/10!important}
    .gomoku-app .boardgame-side,.chess-app .boardgame-side,.xq-app .xq-side{
      width:100%!important;max-width:100%!important;box-sizing:border-box!important;
    }
    .desktop-taskbar{z-index:40!important}
  }
  `;
  document.head.appendChild(s);
}

function closeDock(){
  document.body.classList.remove('webdesk-dock-open');
  const b=document.querySelector('.webdesk-mobile-fab');
  if(b)b.setAttribute('aria-expanded','false');
}
function toggleDock(){
  const next=!document.body.classList.contains('webdesk-dock-open');
  document.body.classList.toggle('webdesk-dock-open',next);
  const b=document.querySelector('.webdesk-mobile-fab');
  if(b)b.setAttribute('aria-expanded',String(next));
}
function installFab(){
  if(document.querySelector('.webdesk-mobile-fab'))return;
  const b=document.createElement('button');
  b.type='button';
  b.className='webdesk-mobile-fab';
  b.textContent='+';
  b.setAttribute('aria-label','開啟 WebDesk 功能選單');
  b.setAttribute('aria-expanded','false');
  document.body.appendChild(b);
  b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();toggleDock()});

  document.addEventListener('pointerdown',e=>{
    if(innerWidth>820||!document.body.classList.contains('webdesk-dock-open'))return;
    if(e.target.closest('.desktop-dock,.webdesk-mobile-fab'))return;
    closeDock();
  },true);
  document.addEventListener('click',e=>{
    if(innerWidth>820)return;
    if(e.target.closest('.desktop-dock [data-dock],.desktop-dock [data-random-bg]'))setTimeout(closeDock,0);
  },true);
  window.addEventListener('resize',()=>{if(innerWidth>820)closeDock()});
  window.addEventListener('keydown',e=>{if(e.key==='Escape')closeDock()});
}
function normalizeGameCards(){
  if(innerWidth>820)return;
  document.querySelectorAll('.desktop-card.t-gomoku,.desktop-card.t-chess,.desktop-card.t-xiangqi').forEach(card=>{
    card.dataset.mobileFluid='1';
  });
}
function boot(){
  installStyle();
  installFab();
  normalizeGameCards();
  new MutationObserver(normalizeGameCards).observe(document.body,{childList:true,subtree:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.WebDeskMobileResponsive={version:VERSION,features:['safe-floating-dock','fluid-game-cards','no-click-blocking-mask']};
})();

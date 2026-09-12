(()=>{
'use strict';
const VERSION='20260912-webdesk-mobile-responsive-v2.1-flow-layout';
if(window.__webdeskMobileResponsive===VERSION)return;
window.__webdeskMobileResponsive=VERSION;

function installStyle(){
  let s=document.getElementById('webdesk-mobile-responsive-v2-style');
  if(!s){s=document.createElement('style');s.id='webdesk-mobile-responsive-v2-style';document.head.appendChild(s)}
  s.textContent=`
  .webdesk-mobile-fab{display:none}
  @media (max-width:820px){
    html,body{
      width:100%!important;
      min-height:100%!important;
      height:auto!important;
      max-height:none!important;
      overflow-x:hidden!important;
      overflow-y:auto!important;
      overscroll-behavior-y:auto!important;
      -webkit-overflow-scrolling:touch!important;
    }
    body.desktop-home{position:static!important}
    #desktopApp,.web-desktop{
      position:relative!important;
      width:100%!important;
      min-height:100vh!important;
      height:auto!important;
      max-height:none!important;
      overflow:visible!important;
      padding-bottom:calc(86px + env(safe-area-inset-bottom))!important;
      box-sizing:border-box!important;
    }
    #desktopCanvas,.desktop-surface,
    #windowLayer,.window-layer{
      position:relative!important;
      inset:auto!important;
      width:100%!important;
      min-height:0!important;
      height:auto!important;
      max-height:none!important;
      overflow:visible!important;
      box-sizing:border-box!important;
      padding:10px max(10px,env(safe-area-inset-right)) 18px max(10px,env(safe-area-inset-left))!important;
    }
    #windowLayer,.window-layer{pointer-events:auto!important}

    /* Every WebDesk card becomes part of the normal mobile document flow. */
    .desktop-card{
      position:relative!important;
      left:auto!important;
      right:auto!important;
      top:auto!important;
      bottom:auto!important;
      transform:none!important;
      width:100%!important;
      max-width:100%!important;
      min-width:0!important;
      height:auto!important;
      min-height:0!important;
      max-height:none!important;
      margin:0 0 12px 0!important;
      box-sizing:border-box!important;
      overflow:visible!important;
      border-radius:18px!important;
    }
    .desktop-card.is-minimized{height:auto!important;min-height:0!important}
    .desktop-card .card-body,
    .desktop-card .card-content,
    .desktop-card .desktop-card-body,
    .desktop-card [data-card-body]{
      width:100%!important;
      max-width:100%!important;
      min-width:0!important;
      height:auto!important;
      min-height:0!important;
      max-height:none!important;
      overflow:visible!important;
      box-sizing:border-box!important;
    }
    .desktop-card .card-resize,.desktop-card .resize-handle,[data-card-resize]{display:none!important}

    /* Common widgets/tools adapt to card width instead of viewport-fixed desktop geometry. */
    .weather-card,.calendar-card,.class-schedule-card,.metals-card,.fx-card,
    .image-workbench,.text-tool,.table-tool,.json-tool,.date-tool,
    .gomoku-app,.chess-app,.xq-app{
      width:100%!important;
      max-width:100%!important;
      min-width:0!important;
      height:auto!important;
      max-height:none!important;
      box-sizing:border-box!important;
      overflow:visible!important;
    }
    img,canvas,svg,video,iframe,table{max-width:100%!important}

    /* Board games: width follows the card; controls continue below the board. */
    .gomoku-main,.chess-main,.xq-main{
      display:grid!important;
      grid-template-columns:minmax(0,1fr)!important;
      width:100%!important;
      max-width:100%!important;
      min-width:0!important;
      height:auto!important;
      max-height:none!important;
      overflow:visible!important;
      gap:10px!important;
    }
    .gomoku-board-wrap,.chess-board-wrap,.xq-main>section{min-width:0!important;width:100%!important;height:auto!important}
    .gomoku-board,.chess-board{
      width:100%!important;
      max-width:100%!important;
      aspect-ratio:1/1!important;
      margin:0 auto!important;
      box-sizing:border-box!important;
    }
    .xq-board{
      width:100%!important;
      max-width:100%!important;
      aspect-ratio:9/10!important;
      margin:0 auto!important;
      box-sizing:border-box!important;
    }
    .gomoku-app .boardgame-side,.chess-app .boardgame-side,.xq-app .xq-side{
      position:static!important;
      width:100%!important;
      max-width:100%!important;
      min-width:0!important;
      height:auto!important;
      max-height:none!important;
      overflow:visible!important;
      box-sizing:border-box!important;
    }

    /* Keep the global WebDesk dock hidden until the floating button is tapped. */
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
    body.webdesk-dock-open .desktop-dock{transform:translateX(0)!important;opacity:1!important;visibility:visible!important;pointer-events:auto!important}
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

    /* Drawer may scroll internally, but must never lock the whole page after it closes. */
    .desktop-drawer{max-height:calc(100dvh - 20px)!important;overflow-y:auto!important}
    body:not(.drawer-open){overflow-y:auto!important}
    .desktop-taskbar{position:relative!important;left:auto!important;right:auto!important;bottom:auto!important;width:100%!important;box-sizing:border-box!important;z-index:40!important}
  }
  `;
}

function closeDock(){document.body.classList.remove('webdesk-dock-open');const b=document.querySelector('.webdesk-mobile-fab');if(b)b.setAttribute('aria-expanded','false')}
function toggleDock(){const next=!document.body.classList.contains('webdesk-dock-open');document.body.classList.toggle('webdesk-dock-open',next);const b=document.querySelector('.webdesk-mobile-fab');if(b)b.setAttribute('aria-expanded',String(next))}
function installFab(){
  if(document.querySelector('.webdesk-mobile-fab'))return;
  const b=document.createElement('button');b.type='button';b.className='webdesk-mobile-fab';b.textContent='+';b.setAttribute('aria-label','開啟 WebDesk 功能選單');b.setAttribute('aria-expanded','false');document.body.appendChild(b);
  b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();toggleDock()});
  document.addEventListener('pointerdown',e=>{if(innerWidth>820||!document.body.classList.contains('webdesk-dock-open'))return;if(e.target.closest('.desktop-dock,.webdesk-mobile-fab'))return;closeDock()},true);
  document.addEventListener('click',e=>{if(innerWidth>820)return;if(e.target.closest('.desktop-dock [data-dock],.desktop-dock [data-random-bg]'))setTimeout(closeDock,0)},true);
  window.addEventListener('resize',()=>{if(innerWidth>820)closeDock()});
  window.addEventListener('keydown',e=>{if(e.key==='Escape')closeDock()});
}
function normalizeCards(){
  if(innerWidth>820)return;
  document.documentElement.style.height='auto';document.body.style.height='auto';
  document.querySelectorAll('.desktop-card').forEach(card=>{card.dataset.mobileFluid='1';card.style.removeProperty('height');card.style.removeProperty('max-height')});
}
function boot(){installStyle();installFab();normalizeCards();new MutationObserver(normalizeCards).observe(document.body,{childList:true,subtree:true});window.addEventListener('orientationchange',()=>setTimeout(normalizeCards,80))}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.WebDeskMobileResponsive={version:VERSION,features:['safe-floating-dock','all-cards-fluid-width','natural-page-height','vertical-page-scroll','no-click-blocking-mask']};
})();

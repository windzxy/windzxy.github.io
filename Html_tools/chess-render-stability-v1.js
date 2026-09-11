(()=>{
'use strict';
const VERSION='20260911-chess-render-stability-v1.1-no-flicker';
if(window.__windzxyChessRenderStability===VERSION)return;
window.__windzxyChessRenderStability=VERSION;

function installStyle(){
  if(document.getElementById('chess-render-stability-v1-style'))return;
  const s=document.createElement('style');
  s.id='chess-render-stability-v1-style';
  s.textContent=`
    .desktop-card.t-chess .chess-board{isolation:isolate;contain:layout paint}
    .desktop-card.t-chess .chess-square{contain:layout paint}
    .desktop-card.t-chess .chess-piece,
    .desktop-card.t-chess .chess-piece-svg{filter:none!important}
    .desktop-card.t-chess .chess-piece{transform:none!important}
    .desktop-card.t-chess .chess-piece-svg{transform:none!important}
    .desktop-card.t-chess .chess-square.last-from,
    .desktop-card.t-chess .chess-square.last-to,
    .desktop-card.t-chess .chess-square.selected{will-change:auto!important}
  `;
  document.head.appendChild(s);
}

function boot(){
  installStyle();
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.WebDeskChessRenderStability={version:VERSION,heavyFilters:false,paintIsolation:true,forcedVisibilityRepaint:false,mutationObserver:false};
})();
(()=>{
'use strict';
const VERSION='20260911-chess-render-stability-v1.0';
if(window.__windzxyChessRenderStability===VERSION)return;
window.__windzxyChessRenderStability=VERSION;

function installStyle(){
  if(document.getElementById('chess-render-stability-v1-style'))return;
  const s=document.createElement('style');
  s.id='chess-render-stability-v1-style';
  s.textContent=`
    .desktop-card.t-chess{isolation:isolate;contain:layout style paint}
    .desktop-card.t-chess .card-body{isolation:isolate;contain:layout style paint}
    .desktop-card.t-chess .chess-app{isolation:isolate;transform:translateZ(0);backface-visibility:hidden}
    .desktop-card.t-chess .chess-board{isolation:isolate;contain:layout paint;transform:translateZ(0);backface-visibility:hidden}
    .desktop-card.t-chess .chess-square{contain:layout paint;backface-visibility:hidden}
    .desktop-card.t-chess .chess-piece{filter:none!important;transform:translateZ(0);backface-visibility:hidden}
    .desktop-card.t-chess .chess-piece-svg{filter:none!important;transform:none!important;backface-visibility:hidden}
    .desktop-card.t-chess .chess-square.last-from,
    .desktop-card.t-chess .chess-square.last-to,
    .desktop-card.t-chess .chess-square.selected{will-change:auto!important}
  `;
  document.head.appendChild(s);
}

function settle(root=document){
  root.querySelectorAll?.('.desktop-card.t-chess .chess-board').forEach(board=>{
    board.style.visibility='hidden';
    requestAnimationFrame(()=>{
      board.style.visibility='';
    });
  });
}

function boot(){
  installStyle();
  settle();
  const target=document.getElementById('desktopCanvas');
  if(target&&window.MutationObserver){
    const obs=new MutationObserver(muts=>{
      if(!muts.some(m=>m.addedNodes?.length))return;
      requestAnimationFrame(()=>settle(target));
    });
    obs.observe(target,{childList:true,subtree:true});
  }
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.WebDeskChessRenderStability={version:VERSION,heavyFilters:false,paintIsolation:true};
})();
(()=>{
'use strict';
const VERSION='20260913-webdesk-tablet-responsive-v1.0';
if(window.__webdeskTabletResponsive===VERSION)return;
window.__webdeskTabletResponsive=VERSION;
const s=document.createElement('style');
s.id='webdesk-tablet-responsive-v1-style';
s.textContent=`
@media (min-width:821px) and (max-width:1180px){
  html,body{overflow-x:hidden!important}
  #desktopApp,.web-desktop{width:100%!important;min-width:0!important}
  #desktopCanvas,.desktop-surface{padding:14px 18px 84px!important;box-sizing:border-box!important}
  #windowLayer,.window-layer{width:100%!important;min-width:0!important}

  .desktop-card{
    max-width:calc(100vw - 36px)!important;
    min-width:0!important;
    box-sizing:border-box!important;
  }
  .desktop-card .card-body,.desktop-card .card-content,.desktop-card .desktop-card-body,.desktop-card [data-card-body]{
    min-width:0!important;max-width:100%!important;overflow-x:hidden!important;
  }
  .desktop-card *{box-sizing:border-box;max-width:100%}
  .desktop-card :where(section,article,main,aside,header,footer,div,form,fieldset,label,nav,ul,ol,li){min-width:0!important}
  .desktop-card :where(button,input,select,textarea){max-width:100%!important}

  /* Tablet board-game layout: board and controls share the screen without overlays. */
  .desktop-card.t-gomoku,.desktop-card.t-chess,.desktop-card.t-xiangqi{min-width:0!important}
  .gomoku-app,.chess-app,.xq-app{width:100%!important;min-width:0!important;overflow:visible!important}
  .gomoku-main,.chess-main,.xq-main{
    width:100%!important;min-width:0!important;display:grid!important;gap:14px!important;
    grid-template-columns:minmax(0,1fr) minmax(210px,30%)!important;
    align-items:start!important;
  }
  .gomoku-board-wrap,.chess-board-wrap,.xq-main>section{min-width:0!important}
  .gomoku-board,.chess-board{
    width:min(100%,58dvh,620px)!important;height:auto!important;aspect-ratio:1/1!important;margin:0 auto!important;
  }
  .xq-board{
    width:min(100%,52dvh,560px)!important;height:auto!important;aspect-ratio:9/10!important;margin:0 auto!important;
  }
  .gomoku-board{grid-template-columns:repeat(15,minmax(0,1fr))!important;grid-template-rows:repeat(15,minmax(0,1fr))!important}
  .gomoku-cell{aspect-ratio:1/1!important;min-width:0!important;min-height:0!important;width:100%!important;height:100%!important}
  .gomoku-app .boardgame-side,.chess-app .boardgame-side,.xq-app .xq-side{
    position:static!important;inset:auto!important;transform:none!important;opacity:1!important;visibility:visible!important;pointer-events:auto!important;
    width:100%!important;max-width:none!important;height:auto!important;max-height:none!important;overflow:visible!important;box-shadow:none!important;
  }
  .chess-mobile-menu-btn,.chess-mobile-drawer-backdrop{display:none!important}
  body.chess-mobile-drawer-lock{overflow:auto!important}

  /* Tablet WebDesk dock stays available but compact and non-blocking. */
  .desktop-dock{
    right:12px!important;gap:6px!important;padding:7px!important;border-radius:18px!important;
    transform:none!important;opacity:.92!important;visibility:visible!important;pointer-events:auto!important;
  }
  .desktop-dock button{width:44px!important;height:44px!important;min-width:44px!important;min-height:44px!important}
  .webdesk-mobile-fab,.webdesk-mobile-card-indicator{display:none!important}
  .desktop-taskbar{display:flex!important}

  .boardgame-tabs,.xq-tabs,.game-actions,.lesson-nav,.xq-actions{max-width:100%!important;flex-wrap:wrap!important}
  .boardgame-tabs button,.xq-tabs button{min-width:0!important}
}

@media (min-width:821px) and (max-width:1180px) and (orientation:portrait){
  .gomoku-main,.chess-main,.xq-main{grid-template-columns:minmax(0,1fr)!important}
  .gomoku-board,.chess-board{width:min(100%,64vw,600px)!important}
  .xq-board{width:min(100%,58vw,540px)!important}
  .gomoku-app .boardgame-side,.chess-app .boardgame-side,.xq-app .xq-side{
    display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:10px!important;margin-top:10px!important;
  }
  .gomoku-app .game-tip,.gomoku-app .lesson-card,.chess-app .game-tip,.chess-app .lesson-card,.xq-app .xq-card{grid-column:1/-1!important}
}
`;
document.head.appendChild(s);
window.WebDeskTabletResponsive={version:VERSION,range:'821-1180px'};
})();
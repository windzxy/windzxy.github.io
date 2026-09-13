(()=>{
'use strict';
const VERSION='20260913-gomoku-mobile-square-grid-v1.0';
if(window.__gomokuMobileSquareGrid===VERSION)return;
window.__gomokuMobileSquareGrid=VERSION;
const style=document.createElement('style');
style.id='gomoku-mobile-square-grid-v1-style';
style.textContent=`
@media (max-width:820px){
  .desktop-card.t-gomoku .gomoku-board{
    width:min(calc(100vw - 64px),520px)!important;
    height:auto!important;
    aspect-ratio:1/1!important;
    display:grid!important;
    grid-template-columns:repeat(15,minmax(0,1fr))!important;
    grid-template-rows:repeat(15,minmax(0,1fr))!important;
    padding:10px!important;
    margin:0 auto!important;
    box-sizing:border-box!important;
    overflow:hidden!important;
  }
  .desktop-card.t-gomoku .gomoku-cell{
    width:100%!important;
    height:100%!important;
    min-width:0!important;
    min-height:0!important;
    aspect-ratio:1/1!important;
    padding:0!important;
    margin:0!important;
    box-sizing:border-box!important;
  }
  .desktop-card.t-gomoku .gomoku-board-wrap{
    width:100%!important;
    min-width:0!important;
    max-width:100%!important;
  }
}
`;
document.head.appendChild(style);
window.WebDeskGomokuMobileSquareGrid={version:VERSION};
})();
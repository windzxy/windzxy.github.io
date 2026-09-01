(function(){
'use strict';
const VER='20260901-class-schedule-mobile-v10';
if(window.__windzxyClassScheduleMobileV10===VER)return;
window.__windzxyClassScheduleMobileV10=VER;
function install(){
  if(document.getElementById('classScheduleMobileV10Style'))return;
  const s=document.createElement('style');
  s.id='classScheduleMobileV10Style';
  s.textContent=`
@media (max-width:760px){
  .desktop-card.t-schedule{
    left:8px!important;
    top:8px!important;
    width:calc(100vw - 82px)!important;
    max-width:none!important;
    height:calc(100dvh - 76px)!important;
    min-width:0!important;
    min-height:480px!important;
    border-radius:16px;
    touch-action:auto;
  }
  .desktop-card.t-schedule .card-bar{height:44px;grid-template-columns:32px minmax(0,1fr) 28px 28px;padding:6px 8px;cursor:default}
  .desktop-card.t-schedule .card-bar h3{font-size:14px}
  .desktop-card.t-schedule .card-body{padding:0!important;overflow:hidden!important}
  .desktop-card.t-schedule .resize-grip{display:none!important}
  .desktop-card.t-schedule .class-schedule-v1{height:100%!important}
  .desktop-card.t-schedule .cs4.cs7-focus{padding:8px!important;gap:7px!important}
  .desktop-card.t-schedule .cs4.cs7-focus .cs4-head{min-height:26px!important}
  .desktop-card.t-schedule .cs4.cs7-focus .cs4-current{min-height:70px!important}
  .desktop-card.t-schedule .cs4.cs7-focus .cs4-next,.desktop-card.t-schedule .cs4.cs7-focus .cs4-progress{min-height:54px!important}
  .desktop-card.t-schedule .cs4.cs7-focus .cs4-content{padding-bottom:max(8px,env(safe-area-inset-bottom))!important}
  .desktop-card.t-schedule .cs4.cs7-focus .cs4-row{min-height:40px!important}
  .desktop-card.t-schedule .cs4.cs7-focus .cs4-row time{font-size:11px!important}
  .desktop-card.t-schedule .cs4.cs7-focus .cs4-row>strong{font-size:13px!important}
  .desktop-drawer{width:min(360px,calc(100vw - 72px));}
  .toolbox-category-list .dock-tool.t-schedule{display:grid!important;visibility:visible!important;opacity:1!important}
}
@media (max-width:430px){
  .desktop-card.t-schedule{left:6px!important;top:6px!important;width:calc(100vw - 76px)!important;height:calc(100dvh - 70px)!important}
  .desktop-card.t-schedule .cs4.cs7-focus .cs4-view button{padding:0 8px!important}
  .desktop-card.t-schedule .cs4.cs7-focus .cs4-days button{height:32px!important}
  .desktop-card.t-schedule .cs4.cs7-focus .cs4-current>strong{font-size:17px!important}
}
`;
  document.head.appendChild(s);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
window.WebDeskClassScheduleMobile={version:'v10',mobileFirst:true};
})();
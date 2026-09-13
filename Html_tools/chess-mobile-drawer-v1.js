(()=>{
'use strict';
const VERSION='20260913-chess-mobile-drawer-v1.1-disabled-for-card-carousel';
if(window.__webdeskChessMobileDrawer===VERSION)return;
window.__webdeskChessMobileDrawer=VERSION;

function installStyle(){
  let s=document.getElementById('chess-mobile-drawer-v1-style');
  if(!s){s=document.createElement('style');s.id='chess-mobile-drawer-v1-style';document.head.appendChild(s)}
  s.textContent=`
  @media (max-width:820px){
    .chess-mobile-menu-btn,.chess-mobile-drawer-backdrop{display:none!important}
    .chess-app,.xq-app{position:relative!important;overflow:visible!important}
    .chess-app .boardgame-main,.xq-app .xq-main{display:grid!important;grid-template-columns:minmax(0,1fr)!important}
    .chess-app .boardgame-side,.xq-app .xq-side{
      position:static!important;
      inset:auto!important;
      transform:none!important;
      opacity:1!important;
      visibility:visible!important;
      pointer-events:auto!important;
      width:100%!important;
      max-width:100%!important;
      height:auto!important;
      max-height:none!important;
      overflow:visible!important;
      box-shadow:none!important;
      backdrop-filter:none!important;
      -webkit-backdrop-filter:none!important;
    }
    body.chess-mobile-drawer-lock{overflow:auto!important}
  }
  `;
}
function cleanup(){
  document.body.classList.remove('chess-mobile-drawer-lock');
  document.querySelectorAll('.chess-app.mobile-menu-open,.xq-app.mobile-menu-open').forEach(app=>app.classList.remove('mobile-menu-open'));
  document.querySelectorAll('.chess-mobile-menu-btn,.chess-mobile-drawer-backdrop').forEach(el=>el.remove());
}
function boot(){
  installStyle();
  cleanup();
  const root=document.getElementById('desktopCanvas')||document.body;
  new MutationObserver(()=>cleanup()).observe(root,{childList:true,subtree:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.WebDeskChessMobileDrawer={version:VERSION,disabledOnMobile:true};
})();
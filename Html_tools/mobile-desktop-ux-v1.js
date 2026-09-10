(()=>{
'use strict';
const VER='20260910-mobile-desktop-ux-v1.0';
if(window.__windzxyMobileDesktopUX===VER)return;
window.__windzxyMobileDesktopUX=VER;
const mq=window.matchMedia('(max-width:760px)');
function ensureStyle(){
  let s=document.getElementById('mobileDesktopUxV1Css');
  if(!s){s=document.createElement('style');s.id='mobileDesktopUxV1Css';document.head.appendChild(s)}
  s.textContent=`
@media(max-width:760px){
  .desktop-drawer{
    left:10px!important;right:10px!important;top:auto!important;
    bottom:calc(64px + env(safe-area-inset-bottom,0px))!important;
    width:auto!important;max-width:none!important;height:auto!important;
    max-height:min(56dvh,520px)!important;padding:12px!important;
    border-radius:20px 20px 16px 16px!important;
    transform:translateY(calc(100% + 92px))!important;
    transition:transform .2s ease!important;
    overscroll-behavior:contain;-webkit-overflow-scrolling:touch;
  }
  .desktop-drawer.is-open{transform:translateY(0)!important}
  .drawer-head{position:sticky;top:-12px;z-index:4;margin:-12px -12px 10px;padding:12px 12px 8px;background:color-mix(in srgb,var(--panel) 94%,transparent);backdrop-filter:blur(24px)}
  .drawer-head h2{font-size:19px}
  .drawer-panel .panel-title{margin-top:8px}
  .dock-tool-list{gap:8px}
  .dock-tool{min-height:48px}
  [data-typhoon-root]>.tp-weather-p0-global{
    left:6px!important;top:50px!important;width:128px!important;
    max-height:calc(100% - 118px)!important;padding:6px!important;gap:4px!important;
    border-radius:13px!important;
  }
  [data-typhoon-root]>.tp-weather-p0-global [data-p0-title]{font-size:10px!important;padding:2px 3px 4px!important}
  [data-typhoon-root]>.tp-weather-p0-global [data-p0-group]{font-size:7px!important;margin-top:2px!important}
  [data-typhoon-root]>.tp-weather-p0-global [data-p0-mode]{min-height:28px!important;padding:0 3px!important;font-size:9px!important}
  [data-typhoon-root]>.tp-weather-p0-global [data-layer-freshness]{font-size:7.5px!important;min-height:14px!important;padding:4px 3px 0!important}
  .tp-dynamic-city-label{transform:translate(-50%,-50%) scale(.92);transform-origin:center;}
}
@media(max-width:390px){
  [data-typhoon-root]>.tp-weather-p0-global{width:118px!important}
  [data-typhoon-root]>.tp-weather-p0-global [data-p0-mode]{font-size:8.5px!important}
}
`;
}
function drawer(){return document.getElementById('desktopDrawer')}
function clearDockActive(){document.querySelectorAll('[data-dock].is-active').forEach(b=>b.classList.remove('is-active'))}
function closeMobileDrawer(){if(!mq.matches)return;const d=drawer();if(d)d.classList.remove('is-open');clearDockActive()}
function settleMobile(){if(!mq.matches)return;closeMobileDrawer();document.documentElement.dataset.mobileDeskReady='1'}
function boot(){
  ensureStyle();
  settleMobile();
  requestAnimationFrame(()=>requestAnimationFrame(settleMobile));
  setTimeout(settleMobile,180);
  addEventListener('pageshow',settleMobile,{passive:true});
  addEventListener('orientationchange',()=>setTimeout(settleMobile,120),{passive:true});
  if(mq.addEventListener)mq.addEventListener('change',e=>{if(e.matches)settleMobile()});
  else if(mq.addListener)mq.addListener(e=>{if(e.matches)settleMobile()});
  document.addEventListener('click',e=>{
    if(!mq.matches)return;
    const d=drawer();if(!d)return;
    if(e.target.closest('.dock-tool')){setTimeout(closeMobileDrawer,40);return}
    if(d.classList.contains('is-open')&&!e.target.closest('.desktop-drawer')&&!e.target.closest('[data-dock]'))closeMobileDrawer();
  },false);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.WebDeskMobileUX={version:'v1.0',defaultDrawerClosed:true,drawer:'bottom-sheet-56dvh',typhoonMobileWeatherControls:true};
})();
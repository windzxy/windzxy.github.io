(()=>{
  "use strict";
  const VERSION="20260913-webdesk-mobile-card-ux-v1.0";
  if(window.__webdeskMobileCardUx===VERSION)return;
  window.__webdeskMobileCardUx=VERSION;

  function installStyle(){
    if(document.getElementById("webdeskMobileCardUxStyle"))return;
    const s=document.createElement("style");
    s.id="webdeskMobileCardUxStyle";
    s.textContent=`
      @media(max-width:820px){
        .webdesk-mobile-card-indicator{display:none!important}
        .webdesk-mobile-fab{
          width:46px!important;height:46px!important;
          right:max(12px,env(safe-area-inset-right))!important;
          bottom:max(14px,calc(env(safe-area-inset-bottom) + 10px))!important;
          border-radius:15px!important;font-size:23px!important;
          box-shadow:0 9px 24px rgba(0,0,0,.24)!important;
        }
        .mobile-global-weather-card{
          height:auto!important;min-height:0!important;max-height:none!important;
          overflow:hidden!important;
        }
        .mobile-global-weather-card .card-body{
          height:auto!important;min-height:0!important;max-height:none!important;
          overflow:visible!important;padding:10px!important;
        }
        .mobile-global-weather-card .card-body>*:not(.product-live-summary):not(.mobile-global-weather-actions){display:none!important}
        .mobile-global-weather-card .product-live-summary{margin:0!important}
        .mobile-global-weather-actions{display:flex!important;gap:8px!important;margin-top:9px!important}
        .mobile-global-weather-actions button{
          width:100%!important;min-height:42px!important;border:0!important;border-radius:13px!important;
          background:linear-gradient(135deg,#1677ff,#19b5fe)!important;color:#fff!important;
          font:700 13px/1 system-ui!important;box-shadow:0 8px 18px rgba(22,119,255,.18)!important;
        }
        #windowLayer.mobile-global-weather-open{
          position:fixed!important;inset:0!important;width:100dvw!important;height:100dvh!important;
          z-index:13000!important;overflow:hidden!important;pointer-events:none!important;
        }
        #windowLayer.mobile-global-weather-open .mobile-global-weather-window{
          position:fixed!important;left:0!important;top:0!important;right:auto!important;bottom:auto!important;
          width:100dvw!important;height:100dvh!important;max-width:none!important;max-height:none!important;
          margin:0!important;border-radius:0!important;transform:none!important;pointer-events:auto!important;
        }
        #windowLayer.mobile-global-weather-open .mobile-global-weather-window .window-bar{
          min-height:54px!important;padding-top:max(8px,env(safe-area-inset-top))!important;
        }
        #windowLayer.mobile-global-weather-open .mobile-global-weather-window .desktop-window-body{
          height:calc(100dvh - 54px)!important;max-height:none!important;overflow:hidden!important;
        }
        #windowLayer.mobile-global-weather-open .mobile-global-weather-window .window-resize{display:none!important}
      }
    `;
    document.head.appendChild(s);
  }

  function isTyphoonCard(card){
    if(card.querySelector('[data-inline-app="typhoon"]'))return true;
    const title=card.querySelector('.card-bar h3')?.textContent?.trim()||"";
    return /全球氣象|global weather/i.test(title);
  }

  function openFullWeather(){
    if(innerWidth>820)return;
    try{
      if(typeof openApp==="function")openApp("typhoon","全球氣象","");
    }catch(e){console.warn("Open global weather failed",e)}
    requestAnimationFrame(()=>{
      const layer=document.getElementById("windowLayer");
      if(!layer)return;
      const wins=[...layer.querySelectorAll(".desktop-window")];
      const win=wins.find(x=>/全球氣象|global weather/i.test(x.querySelector(".window-bar")?.textContent||""))||wins[wins.length-1];
      if(!win)return;
      wins.forEach(x=>x.classList.remove("mobile-global-weather-window"));
      win.classList.add("mobile-global-weather-window");
      layer.classList.add("mobile-global-weather-open");
      document.body.classList.add("webdesk-mobile-app-open");
    });
  }

  function decorate(){
    if(innerWidth>820)return;
    document.querySelectorAll("#desktopCanvas .desktop-card").forEach(card=>{
      if(!isTyphoonCard(card))return;
      card.classList.add("mobile-global-weather-card");
      const body=card.querySelector(".card-body");
      if(!body||body.querySelector(".mobile-global-weather-actions"))return;
      const actions=document.createElement("div");
      actions.className="mobile-global-weather-actions";
      const btn=document.createElement("button");
      btn.type="button";
      btn.textContent="打開全球氣象";
      btn.setAttribute("aria-label","全屏打開全球氣象");
      btn.addEventListener("click",e=>{e.preventDefault();e.stopPropagation();openFullWeather()});
      actions.appendChild(btn);
      body.appendChild(actions);
    });
    document.documentElement.dataset.webdeskMobileCardUx=VERSION;
  }

  function cleanupFullScreen(){
    const layer=document.getElementById("windowLayer");
    if(!layer)return;
    if(!layer.querySelector(".mobile-global-weather-window")){
      layer.classList.remove("mobile-global-weather-open");
      document.body.classList.remove("webdesk-mobile-app-open");
    }
  }

  let raf=0;
  function schedule(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;decorate();cleanupFullScreen()})}

  function start(){
    installStyle();
    decorate();
    const canvas=document.getElementById("desktopCanvas");
    const layer=document.getElementById("windowLayer");
    if(canvas)new MutationObserver(schedule).observe(canvas,{childList:true,subtree:true});
    if(layer)new MutationObserver(()=>{cleanupFullScreen();schedule()}).observe(layer,{childList:true,subtree:true});
    addEventListener("resize",schedule,{passive:true});
    addEventListener("orientationchange",schedule,{passive:true});
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});else start();
})();
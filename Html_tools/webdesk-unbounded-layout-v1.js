(()=>{
  "use strict";
  const VERSION="20260913-webdesk-unbounded-layout-v1.2-drag-grow";
  const STYLE_ID="webdeskUnboundedLayoutStyle";
  let frame=0;
  let dragGrowUntil=0;

  function installStyle(){
    if(document.getElementById(STYLE_ID))return;
    const style=document.createElement("style");
    style.id=STYLE_ID;
    style.textContent=`
      html{min-height:100%;overflow-x:hidden;overflow-y:auto;scroll-behavior:auto}
      body.desktop-home{
        width:100%;
        height:auto!important;
        min-height:100vh;
        min-height:100dvh;
        overflow-x:hidden!important;
        overflow-y:auto!important;
        overscroll-behavior-y:contain;
      }
      body.desktop-home .web-desktop{
        position:relative!important;
        inset:auto!important;
        width:100%;
        height:auto!important;
        min-height:100vh;
        min-height:100dvh;
        overflow:visible!important;
      }
      body.desktop-home .desktop-surface{
        position:relative!important;
        inset:auto!important;
        width:calc(100% - 72px);
        min-height:calc(100vh - 46px);
        min-height:calc(100dvh - 46px);
      }
      body.desktop-home .desktop-card.is-dragging,
      body.desktop-home .desktop-card.is-resizing{will-change:left,top,width,height}
      body.desktop-home .card-bar,
      body.desktop-home .resize-grip{touch-action:none}
      body.desktop-home .window-layer{
        position:fixed!important;
        inset:0!important;
        pointer-events:none;
      }
      body.desktop-home .window-layer>.desktop-window{pointer-events:auto}
      @media(max-width:700px){
        body.desktop-home .desktop-surface{width:100%;min-height:100dvh;padding-bottom:84px}
      }
    `;
    document.head.appendChild(style);
  }

  function measuredBottom(surface){
    let bottom=Math.max(window.innerHeight||0,document.documentElement.clientHeight||0)-46;
    surface.querySelectorAll(":scope > .desktop-card").forEach(card=>{
      const top=parseFloat(card.style.top)||card.offsetTop||0;
      const height=card.getBoundingClientRect().height||card.offsetHeight||0;
      bottom=Math.max(bottom,top+height+72);
    });
    return bottom;
  }

  function applyHeight(bottom){
    const surface=document.getElementById("desktopCanvas");
    const root=document.getElementById("desktopApp");
    if(!surface||!root)return;
    const surfaceHeight=Math.max(0,Math.ceil(bottom))+"px";
    const rootHeight=Math.max(0,Math.ceil(bottom+46))+"px";
    if(surface.style.minHeight!==surfaceHeight)surface.style.minHeight=surfaceHeight;
    if(root.style.minHeight!==rootHeight)root.style.minHeight=rootHeight;
  }

  function syncHeight(){
    frame=0;
    const surface=document.getElementById("desktopCanvas");
    if(!surface)return;
    const bottom=Math.max(measuredBottom(surface),dragGrowUntil);
    applyHeight(bottom);
    if(!document.querySelector(".desktop-card.is-dragging,.desktop-card.is-resizing"))dragGrowUntil=0;
    document.documentElement.dataset.webdeskUnboundedLayout=VERSION;
  }

  function growAheadOfPointer(event){
    const surface=document.getElementById("desktopCanvas");
    if(!surface)return;
    const active=document.querySelector(".desktop-card.is-dragging,.desktop-card.is-resizing");
    if(!active)return;
    const rect=surface.getBoundingClientRect();
    const localY=event.clientY-rect.top;
    const reserve=Math.max(220,active.getBoundingClientRect().height+120);
    const needed=Math.ceil(localY+reserve);
    if(needed>dragGrowUntil){
      dragGrowUntil=needed;
      const current=Math.max(rect.height,measuredBottom(surface));
      if(needed>current)applyHeight(needed);
    }
  }

  function schedule(){
    if(frame)return;
    frame=requestAnimationFrame(syncHeight);
  }

  function start(){
    installStyle();
    syncHeight();
    const surface=document.getElementById("desktopCanvas");
    if(surface){
      new MutationObserver(schedule).observe(surface,{childList:true,subtree:true,attributes:true,attributeFilter:["style","class"]});
      if("ResizeObserver" in window)new ResizeObserver(schedule).observe(surface);
    }
    document.addEventListener("pointermove",growAheadOfPointer,true);
    document.addEventListener("pointerup",schedule,true);
    document.addEventListener("pointercancel",schedule,true);
    addEventListener("resize",schedule,{passive:true});
    addEventListener("orientationchange",schedule,{passive:true});
    addEventListener("pageshow",schedule,{passive:true});
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});
  else start();
})();
(function(){
'use strict';
const VER='20260908-typhoon-window-p0-fix6-resize-repair';
if(window.__windzxyTyphoonWindowP0===VER)return;
window.__windzxyTyphoonWindowP0=VER;

function fallbackBody(){
  return '<div class="typhoon-widget tpv4" data-typhoon-root data-version="'+VER+'"><div class="tpv4-map"><div class="tpv4-map-loading"><span>🌀</span><b>正在載入颱風資料…</b></div></div></div>';
}

function typhoonBody(){
  try{
    if(typeof bodyHtml==='function'){
      const html=bodyHtml({appId:'typhoon',data:{}},{id:'typhoon',title:'颱風路徑'});
      if(html&&html.indexOf('data-typhoon-root')!==-1)return html;
    }
  }catch(error){
    console.error('[typhoon-window] body bridge failed',error);
  }
  return fallbackBody();
}

function showDegraded(root){
  if(!root||!document.body.contains(root)||root.querySelector('.leaflet-container'))return;
  const loading=root.querySelector('.tpv4-map-loading');
  if(!loading)return;
  loading.innerHTML='<span>⚠️</span><b>颱風資料暫時無法載入</b><small style="display:block;margin-top:8px;opacity:.72">請稍後再試。</small>';
}

function repairMapSize(root){
  if(!root||!root.isConnected)return;
  const map=root.__tpMap;
  if(!map||typeof map.invalidateSize!=='function')return;
  try{map.invalidateSize({pan:false,animate:false});}catch(_){try{map.invalidateSize(false)}catch(__){}}
}

function installResizeRepair(win,root){
  if(!win||!root||win.__tpResizeRepair)return;
  win.__tpResizeRepair=1;
  let raf=0;
  const repair=()=>{
    cancelAnimationFrame(raf);
    raf=requestAnimationFrame(()=>repairMapSize(root));
  };
  if(typeof ResizeObserver==='function'){
    const observer=new ResizeObserver(()=>{
      if(!win.isConnected){observer.disconnect();return;}
      repair();
    });
    observer.observe(win);
    const body=win.querySelector('.desktop-window-body');
    if(body)observer.observe(body);
    win.__tpResizeObserver=observer;
  }
  [0,80,220,520,1200].forEach(ms=>setTimeout(repair,ms));
  win.addEventListener('transitionend',repair);
}

function bindWindowRoot(win){
  const root=win?.querySelector?.('[data-typhoon-root]');
  if(!root)return;
  win.dataset.tpP0Fixed='1';
  root.dataset.tpP0Stable='1';
  root.dataset.tpOwner='window-bridge-v6';
  /* Keep the mounted root stable: weather/radar controls attach listeners to it.
     Resize repair only asks Leaflet to recalculate its viewport; it never replaces
     the root or resets the current map bounds. */
  installResizeRepair(win,root);
  setTimeout(()=>showDegraded(root),12000);
}

function install(){
  if(typeof appContent!=='function'||typeof bindApp!=='function'||typeof bodyHtml!=='function'){
    setTimeout(install,80);
    return;
  }
  if(!window.__windzxyTyphoonWindowContentP0){
    window.__windzxyTyphoonWindowContentP0=1;
    const oldAppContent=appContent;
    appContent=function(appId){
      if(appId==='typhoon')return typhoonBody();
      return oldAppContent.apply(this,arguments);
    };
  }
  if(!window.__windzxyTyphoonWindowBindP0){
    window.__windzxyTyphoonWindowBindP0=1;
    const oldBindApp=bindApp;
    bindApp=function(win,appId){
      const out=oldBindApp.apply(this,arguments);
      if(appId==='typhoon')requestAnimationFrame(()=>bindWindowRoot(win));
      return out;
    };
  }
  window.WebDeskTyphoonWindowBridge={version:VER,appWindow:true,degradedRecovery:true,globalRerender:false,stableRoot:true,weatherControlsPreserved:true,mapResizeRepair:true};
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
else install();
})();
